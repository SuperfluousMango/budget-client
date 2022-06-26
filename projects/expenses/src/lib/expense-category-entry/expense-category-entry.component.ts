import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '@lib-ngb-customization';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, map, merge, Observable, OperatorFunction, Subject, switchMap } from 'rxjs';
import { ExpenseService } from '../expense.service';
import { ExpenseCategoryGroup } from '../models/expense-category';

@Component({
    selector: 'expense-category-entry',
    templateUrl: './expense-category-entry.component.html',
    styleUrls: ['./expense-category-entry.component.scss']
})
export class ExpenseCategoryEntryComponent {
    private groupNames$: Observable<string[]>;

    currentCategory?: ExpenseCategoryGroup;
    form = this.fb.group({
        groupName: this.fb.control(null, [Validators.required, Validators.maxLength(100)]),
        categoryName: this.fb.control(null, [Validators.required, Validators.maxLength(100)])
    });
    focus$ = new Subject<string>();

    constructor(
        private readonly expenseService: ExpenseService,
        private readonly fb: FormBuilder,
        private readonly modalInstance: NgbActiveModal,
        private readonly toastService: ToastService
    ) {
        this.groupNames$ = this.expenseService.groupedCategories$
            .pipe(
                map(data => data.map(g => g.name))
            )
    }

    searchGroupNames: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
        const debouncedText$ = text$.pipe(
            debounceTime(200),
            distinctUntilChanged()
        );

        return merge(debouncedText$, this.focus$.asObservable())
            .pipe(
                map(term => term.toLocaleLowerCase()),
                switchMap(term => this.groupNames$.pipe(
                    map(names => names.filter(name => name.toLocaleLowerCase().includes(term)))
                ))
            );
    }

    saveCategory(): void {
        if (this.form.invalid) {
            return;
        }

        this.expenseService.saveCategory(this.form.value.categoryName, this.form.value.groupName)
            .subscribe(() => {
                this.toastService.showSuccess("Your category was successfully saved.");
                this.modalInstance.close();
            });
    }

    cancelDialog(): void {
        this.modalInstance.dismiss();
    }
}
