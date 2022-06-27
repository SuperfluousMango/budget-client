import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@lib-ngb-customization';
import { ConfirmDialogService } from '@lib-shared-components';
import { debounceTime, distinctUntilChanged, map, merge, Observable, OperatorFunction, Subject, takeUntil } from 'rxjs';
import { ExpenseCategoryEntryComponent } from '../expense-category-entry/expense-category-entry.component';
import { ExpenseService } from '../expense.service';
import { Expense, ExpenseCategory } from '../models';

const EN_DASH = '–';
const HYPHEN = '-';

@Component({
    selector: 'expense-entry-dialog',
    templateUrl: './expense-entry.component.html',
    styleUrls: ['./expense-entry.component.scss']
})
export class ExpenseEntryComponent implements OnInit, OnDestroy {
    @Input() editMode = true;
    @Input() expense?: Expense;

    @ViewChild("dateField", { read: ElementRef }) dateField?: ElementRef;

    allowAdditionalExpenses = true;
    expenseCategoryText?: string;
    focus$ = new Subject<string>();
    
    private readonly _destroy$ = new Subject<void>();
    
    readonly maxDate: NgbDateStruct;
    
    categories: ExpenseCategory[] = [];
    form = this.fb.group({
        id: [0],
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
        private readonly toastService: ToastService,
        private readonly confirmDialogService: ConfirmDialogService
    ) {
        this.expenseService.categories$
            .pipe(takeUntil(this._destroy$))
            .subscribe(data => {
                this.categories = data;
                this.updateCategoryText();
            });

        const date = new Date();
        this.maxDate = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    }

    ngOnInit(): void {
        if (this.expense) {
            this.allowAdditionalExpenses = false;
            this.updateCategoryText();
        }
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    searchCategories: OperatorFunction<string, readonly ExpenseCategory[]> = (text$: Observable<string>) => {
        const debouncedText$ = text$.pipe(
            debounceTime(200),
            distinctUntilChanged()
        );

        return merge(debouncedText$, this.focus$.asObservable())
            .pipe(
                map(term => term.toLocaleLowerCase()),
                map(term => term.replace(EN_DASH, HYPHEN)),
                map(term => this.categories.filter(cat => cat.displayName.toLocaleLowerCase().replace(EN_DASH, HYPHEN).includes(term)))
            );
    }

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
                if (this.expense) {
                    this.closeDialog();
                } else if (this.keepDialogOpenOnSave.value) {
                    this.initializeForm();
                } else {
                    this.closeDialog();
                }
            });
    }

    beginEditMode(): void {
        this.editMode = true;
        this.initializeForm();
    }

    cancelEdit(): void {
        if (this.expense) {
            this.editMode = false;
        } else {
            this.cancelDialog();
        }
    }

    cancelDialog(): void {
        this.modalInstance.dismiss();
    }

    closeDialog(): void {
        this.modalInstance.close();
    }

    openCategoryModal(): void {
        this.modalService.open(ExpenseCategoryEntryComponent, { backdropClass: 'nested', windowClass: 'nested' });
    }

    deleteExpense(): void {
        if (!this.expense) {
            return;
        }

        const title = 'Delete Expense',
            message = `You are about to delete an expense in the amount of $${this.expense?.amount} for ${this.expenseCategoryText}. Are you sure?`,
            confirmButtonText = `Yes, I'm sure`,
            cancelButtonText = `No, I'd like to go back`;

        this.confirmDialogService.createConfirmDialog(message, title, confirmButtonText, cancelButtonText)
            .subscribe(result => {
                if (result) {
                    this.expenseService.deleteExpense(this.expense!)
                        .subscribe(() => this.closeDialog());
                }
            });
    }

    private initializeForm(): void {
        this.form.reset();
        if (this.expense) {
            this.form.controls['id'].setValue(this.expense.id);
            this.form.controls['transactionDate'].setValue(new Date(this.expense.transactionDate));
            this.form.controls['amount'].setValue(this.expense.amount);
            this.form.controls['memo'].setValue(this.expense.memo);

            const category = this.categories.find(c => c.id === this.expense?.expenseCategoryId);
            this.form.controls['category'].setValue(category);
        } else {
            this.form.controls['id'].setValue(0);
        }

        // Use setTimeout to delay the focus until after the change detection cycle. This helps
        // when editing an existing transaction, since the edit fields won't be visible yet.
        setTimeout(() => this.dateField?.nativeElement.focus(), 0);
    }

    private updateCategoryText() {
        if (this.categories.length && this.expense) {
            this.expenseCategoryText = this.categories.find(c => c.id === this.expense?.expenseCategoryId)?.displayName;
        }
    }
}