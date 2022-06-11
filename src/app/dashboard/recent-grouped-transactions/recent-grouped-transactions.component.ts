import { Component } from '@angular/core';
import { TransactionService } from '@transactions';
import { first } from 'rxjs';

type transactionGroup = { name: string, value: number };

@Component({
    selector: 'recent-grouped-transactions',
    templateUrl: './recent-grouped-transactions.component.html',
    styleUrls: ['./recent-grouped-transactions.component.scss'],
})
export class RecentGroupedTransactionsComponent {
    loading = true;
    transactionGroups: transactionGroup[] = [];
    activeEntries: transactionGroup[] = [];
    legendData: string[] = [];

    colorSchemeName: string;

    constructor(transactionService: TransactionService) {
        this.colorSchemeName = 'vivid';

        const date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1;
        
        transactionService.getRecentGroupedTransactions(year, month)
            .pipe(first())
            .subscribe(data => {
                this.transactionGroups = data.map(x => ({ name: x.name, value: x.total }));
                this.legendData = this.transactionGroups.map(x => `${x.name}: ${x.value}`);
                this.loading = false;
            });
    }

    itemHover(event?: transactionGroup | number | undefined): void {
        if (event === undefined) {
            this.activeEntries = [];
            return;
        }

        const eventAsNumber = Number(event),
            eventAsItem: transactionGroup = event as transactionGroup;
        this.activeEntries = [ isNaN(eventAsNumber) ? eventAsItem : this.transactionGroups[eventAsNumber] ];
    }
}
