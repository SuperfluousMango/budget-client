import { Component } from '@angular/core';
import { TransactionService } from '@transactions';
import { first, map, Observable, tap } from 'rxjs';

@Component({
    selector: 'recent-grouped-transactions',
    templateUrl: './recent-grouped-transactions.component.html',
    styleUrls: ['./recent-grouped-transactions.component.scss'],
})
export class RecentGroupedTransactionsComponent {
    loading = true;
    transactionGroups: { name: string, value: number }[] = [];

    constructor(transactionService: TransactionService) {
        const date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1;
        
        transactionService.getRecentGroupedTransactions(year, month)
            .pipe(first())
            .subscribe(data => {
                this.transactionGroups = data.map(x => ({ name: x.name, value: x.total }));
                this.loading = false;
            });
    }
}
