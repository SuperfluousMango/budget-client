import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseEntryComponent, ExpenseFilterService, ExpenseInfo, ExpenseService } from '@expenses';
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
        private readonly expenseFilterService: ExpenseFilterService,
        private readonly router: Router,
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

    createExpense(): void {
        const modalInstance = this.modalService.open(ExpenseEntryComponent);
        modalInstance.closed.subscribe(() => this.updateRecentExpenses());
    }

    viewExpenseList(): void {
        this.expenseFilterService.updateFilter({});
        this.router.navigate(['/ExpenseList']);
    }

    private updateRecentExpenses() {
        this.expenseService.getRecentExpenses()
            .subscribe(data => {
                this.recentExpenses = data;
                this.loading = false;
            });
    }
}
