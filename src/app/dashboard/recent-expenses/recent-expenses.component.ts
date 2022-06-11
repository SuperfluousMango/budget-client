import { Component } from '@angular/core';
import { ExpenseInfo, ExpenseService } from '@expenses';
import { first, Observable } from 'rxjs';

@Component({
    selector: 'recent-expenses',
    templateUrl: './recent-expenses.component.html',
    styleUrls: ['./recent-expenses.component.scss'],
})
export class RecentExpensesComponent {
    loading = true;
    recentExpenses: ExpenseInfo[] = [];

    constructor(expenseService: ExpenseService) {
        expenseService.getRecentExpenses()
            .pipe(first())
            .subscribe(data => {
                this.recentExpenses = data;
                this.loading = false;
            });
    }
}
