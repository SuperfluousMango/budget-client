import { Component, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { Expense } from '../expense';
import { ExpenseEntryComponent } from '../expense-entry/expense-entry.component';
import { ExpenseService } from '../expense.service';

@Component({
    selector: 'expense-list',
    templateUrl: './expense-list.component.html',
    styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnDestroy {
    loading = true;
    searchDate = new Date();
    expenses: Expense[] = [];
    categories: { [key: number]: string } | undefined;

    private _destroy$ = new Subject<void>();

    constructor(
        private readonly expenseService: ExpenseService,
        private readonly modalService: NgbModal
    ) {
        this.refreshExpenseList();

        this.expenseService.categories$
            .pipe(takeUntil(this._destroy$))
            .subscribe(data => {
                this.categories = {};
                data.reduce((acc, val) => {
                    acc[val.id] = val.displayName;
                    return acc;
                }, this.categories);
            });

        this.expenseService.expenseListUpdate$
            .pipe(takeUntil(this._destroy$))
            .subscribe(transDate => this.checkForRefresh(transDate));
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    openModal(): void {
        this.modalService.open(ExpenseEntryComponent);
    }

    private checkForRefresh(transDate: Date): void {
        if (transDate.getMonth() == this.searchDate.getMonth() && transDate.getFullYear() == this.searchDate.getFullYear()) {
            this.refreshExpenseList();
        }
    }

    private refreshExpenseList(): void {
        this.loading = true;
        const year = this.searchDate.getFullYear(),
            month = this.searchDate.getMonth() + 1;

        this.expenseService.getExpensesByMonth(year, month)
            .subscribe(data => {
                this.expenses = data;
                this.loading = false;
            });
    }
}
