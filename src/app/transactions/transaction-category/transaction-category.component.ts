import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@shared';
import { debounceTime, distinctUntilChanged, map, Observable, OperatorFunction, switchMap } from 'rxjs';
import { GroupedCategories } from '../transaction-category';
import { TransactionService } from '../transaction.service';

@Component({
    selector: 'transaction-category',
    templateUrl: './transaction-category.component.html',
    styleUrls: ['./transaction-category.component.scss']
})
export class TransactionCategoryComponent {
    private groupNames$: Observable<string[]>;

    currentCategory?: GroupedCategories;
    form = this.fb.group({
        groupName: this.fb.control(null, [Validators.required, Validators.maxLength(100)]),
        categoryName: this.fb.control(null, [Validators.required, Validators.maxLength(100)])
    });

    constructor(
        private readonly transactionService: TransactionService,
        private readonly fb: FormBuilder,
        private readonly modalInstance: NgbActiveModal,
        private readonly toastService: ToastService
    ) {
        this.groupNames$ = this.transactionService.groupedCategories$
            .pipe(
                map(data => data.map(g => g.name))
            )
    }

    searchGroupNames: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term.toLocaleLowerCase()),
            switchMap(term => this.groupNames$.pipe(
                map(names => names.filter(name => name.toLocaleLowerCase().includes(term))
                    .slice(0, 10)
                )
            ))
        );

    saveCategory(): void {
        if (this.form.invalid) {
            return;
        }

        this.transactionService.saveCategory(this.form.value.categoryName, this.form.value.groupName)
            .subscribe(() => {
                this.toastService.showSuccess("Your category was successfully saved.");
                this.modalInstance.close();
            });
    }

    cancelDialog(): void {
        this.modalInstance.dismiss();
    }
}
