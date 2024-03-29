import { Component, OnDestroy } from '@angular/core';
import { ExpenseService } from '@lib-expenses';
import { DateMonth } from '@lib-shared-components/month-picker/date-month';
import { first, Subject, takeUntil } from 'rxjs';

type ExpensesByGroupSummary = { id: number, name: string, value: number };

@Component({
    selector: 'recent-expenses-by-group',
    templateUrl: './recent-expenses-by-group.component.html',
    styleUrls: ['./recent-expenses-by-group.component.scss'],
})
export class RecentExpensesByGroupComponent implements OnDestroy {
    loading = true;
    drawing = false;
    expensesByGroup: ExpensesByGroupSummary[] = [];
    activeEntries: ExpensesByGroupSummary[] = [];
    activeIndex = -1;
    legendData: string[] = [];

    selectedMonth: DateMonth;
    readonly maxMonth: DateMonth;
    activeGroup: ExpensesByGroupSummary | null = null;

    colorSchemeName: string;

    private destroy$ = new Subject<void>();

    constructor(private readonly expenseService: ExpenseService) {
        this.colorSchemeName = 'vivid';
        const date = new Date();
        this.selectedMonth = {
            month: date.getMonth() + 1,
            year: date.getFullYear()
        };
        this.maxMonth = { ...this.selectedMonth };

        this.getExpensesByGroup();

        this.expenseService.expenseListUpdate$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.getExpensesByGroup());
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    itemHover(event?: any | number | undefined): void {
        if (event === undefined) {
            this.activeEntries = [];
            this.activeIndex = -1;
            return;
        }

        const eventAsNumber = Number(event);
        this.activeEntries = [isNaN(eventAsNumber) ? event : this.expensesByGroup[eventAsNumber]];
        this.activeIndex = isNaN(eventAsNumber)
            ? this.expensesByGroup.findIndex(x => x.name === event.value.name)
            : eventAsNumber;
    }

    openDrilldown(groupName: string) {
        this.activeGroup = this.expensesByGroup.find(x => x.name === groupName) ?? null;
    }

    closeDrilldown() {
        this.activeGroup = null;
        this.preventHoverWhileDrawing();
    }

    getExpensesByGroup() {
        this.expenseService.getRecentExpensesByGroup(this.selectedMonth.year, this.selectedMonth.month)
            .pipe(first())
            .subscribe(data => {
                this.expensesByGroup = data.map(x => ({ id: x.id, name: x.name, value: x.total }));
                this.legendData = this.expensesByGroup.map(x => `${x.name}: ${x.value}`);
                this.loading = false;
                this.preventHoverWhileDrawing();
            });
    }

    private preventHoverWhileDrawing() {
        this.drawing = true;
        setTimeout(() => this.drawing = false, 750);
    }
}
