import { Component, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { Transaction } from '../transaction';
import { TransactionEntryComponent } from '../transaction-entry/transaction-entry.component';
import { TransactionService } from '../transaction.service';

@Component({
    selector: 'transaction-list',
    templateUrl: './transaction-list.component.html',
    styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnDestroy {
    loading = true;
    searchDate = new Date();
    transactions: Transaction[] = [];
    categories: { [key: number]: string } | undefined;

    private _destroy$ = new Subject<void>();

    constructor(
        private readonly transactionService: TransactionService,
        private readonly modalService: NgbModal
    ) {
        this.refreshTransactionList();

        this.transactionService.categories$
            .pipe(takeUntil(this._destroy$))
            .subscribe(data => {
                this.categories = {};
                data.reduce((acc, val) => {
                    acc[val.id] = val.displayName;
                    return acc;
                }, this.categories);
            });

        this.transactionService.transactionListUpdate$
            .pipe(takeUntil(this._destroy$))
            .subscribe(transDate => this.checkForRefresh(transDate));
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    openModal(): void {
        this.modalService.open(TransactionEntryComponent);
    }

    private checkForRefresh(transDate: Date): void {
        if (transDate.getMonth() == this.searchDate.getMonth() && transDate.getFullYear() == this.searchDate.getFullYear()) {
            this.refreshTransactionList();
        }
    }

    private refreshTransactionList(): void {
        this.loading = true;
        const year = this.searchDate.getFullYear(),
            month = this.searchDate.getMonth() + 1;

        this.transactionService.getTransactionsByMonth(year, month)
            .subscribe(data => {
                this.transactions = data;
                this.loading = false;
            });
    }
}
