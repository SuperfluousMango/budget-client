import { Component } from '@angular/core';
import { TransactionInfo, TransactionService } from '@transactions';
import { first, Observable } from 'rxjs';

@Component({
    selector: 'recent-transactions',
    templateUrl: './recent-transactions.component.html',
    styleUrls: ['./recent-transactions.component.scss'],
})
export class RecentTransactionsComponent {
    loading = true;
    recentTransactions: TransactionInfo[] = [];

    constructor(transactionService: TransactionService) {
        transactionService.getRecentTransactions()
            .pipe(first())
            .subscribe(data => {
                this.recentTransactions = data;
                this.loading = false;
            });
    }
}
