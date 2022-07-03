import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { DateMonth } from './date-month';

@Component({
    selector: 'month-picker',
    templateUrl: './month-picker.component.html',
    styleUrls: ['./month-picker.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: MonthPickerComponent },
        { provide: NG_VALIDATORS, multi: true, useExisting: MonthPickerComponent }
    ]
})
export class MonthPickerComponent implements ControlValueAccessor, OnChanges {
    readonly defaultValueText = '(Select a month)';
    readonly months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    @Input() min?: DateMonth;
    @Input() max?: DateMonth;
    @Input() label?: string;

    @ViewChild('mainButton') mainButton?: ElementRef;
    @ViewChild('dropdown') dropdown?: ElementRef;

    value?: DateMonth;
    valueStr: string = this.defaultValueText;
    isOpen = false;
    viewYear = new Date().getFullYear();
    minVal = 0;
    maxVal = 999999;

    private onChanged = (_: DateMonth) => { };
    private onTouched = () => { };
    private clickHandler = (event: MouseEvent) => this.checkForFocusLoss(event);

    constructor(
        private readonly el: ElementRef,
        private readonly cdr: ChangeDetectorRef
    ) { }

    ngOnChanges(_changes: SimpleChanges): void {
        this.minVal = this.min
            ? this.min.year * 100 + this.min.month
            : 0;
        this.maxVal = this.max
            ? this.max.year * 100 + this.max.month
            : 999999;
    }

    writeValue(newVal?: DateMonth): void {
        this.value = newVal;
        this.valueStr = this.buildValueString(this.value);
    }

    registerOnChange(fn: any): void {
        this.onChanged = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    toggleDropdown() {
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            this.viewYear = this.value ? this.value.year : new Date().getFullYear();
            document.addEventListener('click', this.clickHandler);
        }
    }

    decrementViewYear() {
        this.viewYear!--;
    }

    incrementViewYear() {
        this.viewYear!++;
    }

    selectMonth(month: number, year: number) {
        this.value = { month, year };
        this.valueStr = this.buildValueString(this.value) ?? '';
        this.onChanged(this.value);
        this.hideDropdown();
    }

    validate(control: AbstractControl): ValidationErrors | null {
        let hasErrors = false;
        const errors: ValidationErrors = {},
            value = control.value;

        if (!value) {
            return null;
        }

        if (this.valueIsLow()) {
            hasErrors = true;
            errors['minValue'] = `${this.buildValueString(this.value)} is below the minimum value of ${this.buildValueString(this.min!)}`;
        }

        if (this.valueIsHigh()) {
            hasErrors = true;
            errors['maxValue'] = `${this.buildValueString(this.value)} is above the maximum value of ${this.buildValueString(this.max!)}`;
        }

        return hasErrors
            ? errors
            : null;
    }

    private checkForFocusLoss(event: MouseEvent): void {
        if (!this.el.nativeElement.contains(event.target)) {
            this.hideDropdown();
        }
    }

    private hideDropdown() {
        this.isOpen = false;
        document.removeEventListener('click', this.clickHandler);
        this.mainButton?.nativeElement.focus();
    }

    private valueIsLow(): boolean {
        return this.min
            ? this.value!.year < this.min!.year || (this.value!.year === this.min!.year && this.value!.month < this.min.month)
            : false;
    }

    private valueIsHigh(): boolean {
        return this.max
            ? this.value!.year > this.max!.year || (this.value!.year === this.max!.year && this.value!.month > this.max.month)
            : false;
    }

    private buildValueString(date?: DateMonth): string {
        return date
            ? `${this.months[date.month - 1]} ${date.year}`
            : this.defaultValueText;
    }

    @HostListener('keydown', ['$event'])
    private processKeyboardEvents(event: KeyboardEvent): void {
        const leftEdge = [0, 2, 5, 8, 11],
            rightEdge = [1, 4, 7, 10, 13],
            bottomEdge = [11, 12, 13],
            arrows = [0, 1],
            leftArrow = 0,
            topLeft = 2,
            topCenter = 3;

        if (!this.isOpen) {
            if (event.key === 'Space' || event.key === 'ArrowDown') {
                this.toggleDropdown();
            }
            return;
        }
        
        const buttons: HTMLButtonElement[] = Array.from(this.dropdown?.nativeElement.querySelectorAll('button')),
            activeIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
        let firstButtonIndex = buttons.findIndex(b => !b.disabled),
            lastButtonIndex = buttons.length - 1 - [...buttons].reverse().findIndex(b => !b.disabled);

        // Special casing for tab key - wrap around when on the edges
        if (event.key === 'Tab' && event.shiftKey && activeIndex <= firstButtonIndex) {
            if (buttons[lastButtonIndex]) {
                buttons[lastButtonIndex].focus();
            }
            event.preventDefault();
            return;
        } else if (event.key === 'Tab' && !event.shiftKey && activeIndex === lastButtonIndex) {
            if (buttons[firstButtonIndex]) {
                buttons[firstButtonIndex].focus();
            }
            event.preventDefault();
            return;
        }

        switch (event.key) {
            case 'Escape':
                this.hideDropdown();
                break;
            case 'PageUp':
                if (this.viewYear < (this.max?.year ?? 9999)) {
                    this.incrementViewYear();
                    this.cdr.detectChanges();
                    if (activeIndex > -1 && buttons[activeIndex].disabled) {
                        firstButtonIndex = buttons.findIndex(b => !b.disabled);
                        lastButtonIndex = buttons.length - 1 - [...buttons].reverse().findIndex(b => !b.disabled);
                        const newIdx = (activeIndex > lastButtonIndex) ? lastButtonIndex : firstButtonIndex;
                        if (buttons[newIdx]) { buttons[newIdx].focus(); }
                    }
                }
                break;
            case 'PageDown':
                if (this.viewYear > (this.min?.year ?? 1)) {
                    this.decrementViewYear();
                    this.cdr.detectChanges();
                    if (activeIndex > -1 && buttons[activeIndex].disabled) {
                        firstButtonIndex = buttons.findIndex(b => !b.disabled);
                        lastButtonIndex = buttons.length - 1 - [...buttons].reverse().findIndex(b => !b.disabled);
                        const newIdx = (activeIndex > lastButtonIndex) ? lastButtonIndex : firstButtonIndex;
                        if (buttons[newIdx]) { buttons[newIdx].focus(); }
                    }
                }
                break;
            case 'ArrowLeft':
                if (!leftEdge.includes(activeIndex) && !buttons[activeIndex - 1].disabled) {
                    buttons[activeIndex - 1].focus();
                }
                break;
            case 'ArrowRight':
                if (!rightEdge.includes(activeIndex) && !buttons[activeIndex + 1].disabled) {
                    buttons[activeIndex + 1].focus();
                }
                break;
            case 'ArrowUp':
                // If we have no button selected, select the first available one.
                // If we have a button selected and not on the arrow row and not at the top of the center colum,
                // move up in the same column until we find the next non-disabled one.
                if (arrows.includes(activeIndex) || activeIndex === topCenter) { return; }
                if (activeIndex === -1 && buttons[firstButtonIndex]) {
                    buttons[firstButtonIndex].focus();
                    return;
                }
                let indexOfHigherButton = activeIndex;
                do {
                    indexOfHigherButton -= indexOfHigherButton === topLeft ? 2 : 3;
                    if (!buttons[indexOfHigherButton].disabled) {
                        buttons[indexOfHigherButton].focus();
                    }
                } while (indexOfHigherButton > 1 && buttons[indexOfHigherButton].disabled)
                break;
            case 'ArrowDown':
                // If we have no button selected, select the first available one.
                // If we have a button selected and not on the bottom row, move down in the same column until we find the next non-disabled one.
                if (bottomEdge.includes(activeIndex)) { return; }
                if (activeIndex === -1 && buttons[firstButtonIndex]) {
                    buttons[firstButtonIndex].focus();
                    return;
                }
                let indexOfLowerButton = activeIndex;
                do {
                    indexOfLowerButton += indexOfLowerButton === leftArrow ? 2 : 3;
                    if (!buttons[indexOfLowerButton].disabled) {
                        buttons[indexOfLowerButton].focus();
                    }
                } while (indexOfLowerButton < buttons.length - 3 && buttons[indexOfLowerButton].disabled)
                break;
            default:
                return;
        }
    }
}
