import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@shared';
import { debounceTime, distinctUntilChanged, map, Observable, OperatorFunction, Subject, takeUntil } from 'rxjs';
import { ExpenseCategory } from '../expense-category';
import { ExpenseCategoryComponent } from '../expense-category/expense-category.component';
import { ExpenseService } from '../expense.service';

@Component({
    selector: 'expense-entry-dialog',
    templateUrl: './expense-entry.component.html',
    styleUrls: ['./expense-entry.component.scss']
})
export class ExpenseEntryComponent implements OnDestroy {
    @ViewChild("dateField", { read: ElementRef }) dateField?: ElementRef;
    
    private readonly _destroy$ = new Subject<void>();
    
    readonly maxDate: NgbDateStruct;
    
    categories: ExpenseCategory[] = [];
    form = this.fb.group({
        transactionDate: [null, Validators.required],
        amount: [null, [Validators.required, Validators.min(0.01)]],
        category: [null, Validators.required],
        memo: [null, Validators.maxLength(100)],
    });

    keepDialogOpenOnSave = this.fb.control(false);

    constructor(
        private readonly expenseService: ExpenseService,
        private readonly fb: FormBuilder,
        private readonly modalInstance: NgbActiveModal,
        private readonly modalService: NgbModal,
        private readonly toastService: ToastService
    ) {
        this.expenseService.categories$
            .pipe(takeUntil(this._destroy$))
            .subscribe(data => this.categories = data);

        const date = new Date();
        this.maxDate = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    searchCategories: OperatorFunction<string, readonly ExpenseCategory[]> = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term.toLocaleLowerCase()),
            map(term => this.categories.filter(cat => cat.displayName.toLocaleLowerCase().replace('–', '-').includes(term))
                .slice(0, 10)
            )
        );

    formatter = (cat: ExpenseCategory) => cat.displayName;

    saveExpense(): void {
        if (this.form.invalid) {
            return;
        }

        // NgbDatepicker tries to be clever and sets the time on our dates to noon, in order to keep the UTC
        // date that JS passes to the API the same as the local date. Since we're only saving the date and
        // don't care about the time, that is acceptable.
        this.expenseService.saveExpense({ ...this.form.value, categoryId: this.form.value.category.id })
            .subscribe(() => {
                this.toastService.showSuccess("Your expense was successfully saved.");
                if (this.keepDialogOpenOnSave.value) {
                    this.initializeForm();
                } else {
                    this.modalInstance.close();
                }
            });
    }

    cancelDialog(): void {
        this.modalInstance.dismiss();
    }

    openCategoryModal(): void {
        this.modalService.open(ExpenseCategoryComponent);
    }

    private initializeForm(): void {
        this.form.reset();
        this.dateField?.nativeElement.focus();
    }
}
