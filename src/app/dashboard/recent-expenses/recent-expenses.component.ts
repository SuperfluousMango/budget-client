import { Component } from '@angular/core';
import { ExpenseEntryComponent, ExpenseInfo, ExpenseService } from '@expenses';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'recent-expenses',
    templateUrl: './recent-expenses.component.html',
    styleUrls: ['./recent-expenses.component.scss'],
})
export class RecentExpensesComponent {
    loading = true;
    recentExpenses: ExpenseInfo[] = [];

    constructor(
        private readonly expenseService: ExpenseService,
        private readonly modalService: NgbModal
    ) {
        this.updateRecentExpenses();
    }

    viewExpense(id: number): void {
        this.expenseService.getExpense(id)
            .subscribe(expense => {
                const modalInstance = this.modalService.open(ExpenseEntryComponent),
                    comp = (modalInstance.componentInstance as ExpenseEntryComponent);
                comp.editMode = false;
                comp.expense = expense;
                comp.ngOnInit();

                modalInstance.closed.subscribe(() => this.updateRecentExpenses());
            });
    }

    private updateRecentExpenses() {
        this.expenseService.getRecentExpenses()
            .subscribe(data => {
                this.recentExpenses = data;
                this.loading = false;
            });
    }
}
