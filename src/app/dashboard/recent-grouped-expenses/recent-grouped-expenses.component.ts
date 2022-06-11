import { Component } from '@angular/core';
import { ExpenseService } from '@expenses';
import { first } from 'rxjs';

type ExpenseGroupSummary = { name: string, value: number };

@Component({
    selector: 'recent-grouped-expenses',
    templateUrl: './recent-grouped-expenses.component.html',
    styleUrls: ['./recent-grouped-expenses.component.scss'],
})
export class RecentGroupedExpensesComponent {
    loading = true;
    expenseGroups: ExpenseGroupSummary[] = [];
    activeEntries: ExpenseGroupSummary[] = [];
    legendData: string[] = [];

    colorSchemeName: string;

    constructor(expenseService: ExpenseService) {
        this.colorSchemeName = 'vivid';

        const date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1;
        
        expenseService.getRecentGroupedExpenses(year, month)
            .pipe(first())
            .subscribe(data => {
                this.expenseGroups = data.map(x => ({ name: x.name, value: x.total }));
                this.legendData = this.expenseGroups.map(x => `${x.name}: ${x.value}`);
                this.loading = false;
            });
    }

    itemHover(event?: ExpenseGroupSummary | number | undefined): void {
        if (event === undefined) {
            this.activeEntries = [];
            return;
        }

        const eventAsNumber = Number(event),
            eventAsItem: ExpenseGroupSummary = event as ExpenseGroupSummary;
        this.activeEntries = [ isNaN(eventAsNumber) ? eventAsItem : this.expenseGroups[eventAsNumber] ];
    }
}
