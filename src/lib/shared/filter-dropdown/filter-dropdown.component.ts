import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

const PAGE_SIZE = 7; // If this is updated, also update the SCSS

@Component({
    selector: 'filter-dropdown',
    templateUrl: './filter-dropdown.component.html',
    styleUrls: ['./filter-dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: FilterDropdownComponent }
    ]
})
export class FilterDropdownComponent implements ControlValueAccessor, OnInit, OnDestroy {
    @Input() label: string = '';
    @Input() data: any[] = [];
    @Input() textProperty: string = '';
    @Input() defaultText: string = 'All';

    @ViewChild('mainButton') mainButton?: ElementRef;
    @ViewChild('dropdown') dropdown?: ElementRef;

    ctrl = new FormControl();
    isOpen = false;
    selectedIndex = -1;
    focusIndex = -1;

    private onChanged = (_: any) => {};
    private onTouched = (_: any) => {};
    private destroy$ = new Subject<void>();

    private clickHandler = (event: MouseEvent) => this.checkForFocusLoss(event);
    
    constructor(
        private readonly el: ElementRef,
        private readonly cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.ctrl.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(val => this.onChanged(val));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    writeValue(newVal: any): void {
        this.selectedIndex = this.data.indexOf(newVal);
        if (this.selectedIndex > -1) {
            this.ctrl.setValue(newVal, { emitEvent: false });
        }
    }

    registerOnChange(fn: any): void {
        this.onChanged = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    selectValue(val: any, index: number): void {
        this.ctrl.setValue(val);
        this.selectedIndex = index;
        this.hideDropdown();
    }

    toggleOpen(): void {
        this.isOpen = !this.isOpen;
        this.cdr.detectChanges();

        if (this.isOpen) {
            this.focusIndex = this.selectedIndex;
            this.updateFocusedOption();
            document.addEventListener('click', this.clickHandler);
        }
    }

    private hideDropdown(): void {
        this.isOpen = false;
        this.cdr.detectChanges();
        this.mainButton?.nativeElement.focus();
        document.removeEventListener('click', this.clickHandler);
    }

    private checkForFocusLoss(event: MouseEvent): void {
        if (!this.el.nativeElement.contains(event.target)) {
            this.hideDropdown();
        }
    }

    @HostListener('keydown', ['$event'])
    private processKeyboardEvents(event: KeyboardEvent): void {
        const notAtTop = this.focusIndex > -1,
            notAtBottom = this.focusIndex < this.data.length - 1,
            alphaRegex = /^[a-z]$/i,
            isSingleLetter = alphaRegex.test(event.key);

        // Allow the down arrow key to expand the dropdown if it's closed
        if (!this.isOpen) {
            if (event.key === 'ArrowDown') {
                this.toggleOpen();
                event.preventDefault();
            }
            return;
        }
        
        // Process keystrokes to close or navigate within the dropdown
        switch (event.key) {
            case 'Escape':
                this.hideDropdown();
                return;
            case 'PageUp':
                if (notAtTop) {
                    this.focusIndex = Math.max(this.focusIndex - PAGE_SIZE, -1);
                    this.updateFocusedOption();
                    event.preventDefault();
                }
                return;
            case 'PageDown':
                if (notAtBottom) {
                    this.focusIndex = Math.min(this.focusIndex + PAGE_SIZE, this.data.length - 1);
                    this.updateFocusedOption();
                    event.preventDefault();
                }
                return;
            case 'ArrowUp':
                if (notAtTop) {
                    this.focusIndex--;
                    this.updateFocusedOption();
                    event.preventDefault();
                }
                return;
            case 'ArrowDown':
                if (notAtBottom) {
                    this.focusIndex++;
                    this.updateFocusedOption();
                    event.preventDefault();
                }
                return;
            case 'Tab':
                if (event.shiftKey && notAtTop) {
                    this.focusIndex--;
                    this.updateFocusedOption();
                } else if (!event.shiftKey && notAtBottom) {
                    this.focusIndex++;
                    this.updateFocusedOption();
                }
                event.preventDefault();
                return;
        }

        // Allow searching for items by first letter
        if (isSingleLetter) {
            const newIdx = this.findOptionByFirstLetter(event.key.toLocaleLowerCase(), this.focusIndex) ??
                this.findOptionByFirstLetter(event.key.toLocaleLowerCase()) ?? -1;

            if (newIdx > -1) {
                this.focusIndex = newIdx;
                this.updateFocusedOption();
                event.preventDefault();
            }
            return;
        }
    }

    private updateFocusedOption(): void {
        const el = this.dropdown?.nativeElement as HTMLElement,
            children = Array.from(el.children),
            child = children[this.focusIndex + 1] as HTMLElement;

        child.focus();
    }

    private findOptionByFirstLetter(letter: string, idxLimit = -1): number | null {
        const result = this.data.findIndex((val, idx) => {
            const str = val[this.textProperty] as string;
            return str[0].toLocaleLowerCase() === letter && idx > idxLimit;
        });

        return result > -1
            ? result
            : null;
    }
}
