import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { first, Subject, takeUntil } from 'rxjs';
import { ExpenseService } from '@expenses';

type ExpensesByCategorySummary = { name: string; value: number };

@Component({
    selector: 'recent-expenses-by-category',
    templateUrl: './recent-expenses-by-category.component.html',
    styleUrls: ['./recent-expenses-by-category.component.scss'],
})
export class RecentExpensesByCategoryComponent implements OnInit, OnDestroy {
    @Input() categoryId: number = 0;
    @Input() categoryGroupName: string = '';
    @Output() exit = new EventEmitter<void>();

    loading = true;
    drawing = false;
    expensesByCategory: ExpensesByCategorySummary[] = [];
    activeEntries: ExpensesByCategorySummary[] = [];
    activeIndex = -1;
    legendData: string[] = [];

    colorSchemeName: string;

    private destroy$ = new Subject<void>();

    constructor(private readonly expenseService: ExpenseService) {
        this.colorSchemeName = 'vivid';

        this.expenseService.expenseListUpdate$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.getExpensesByCategory());
    }

    ngOnInit() {
        this.getExpensesByCategory();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    goBack() {
        this.exit.emit();
    }

    itemHover(event?: any | number | undefined): void {
        if (event === undefined) {
            this.activeEntries = [];
            return;
        }

        const eventAsNumber = Number(event);
        this.activeEntries = [isNaN(eventAsNumber) ? event : this.expensesByCategory[eventAsNumber]];
        this.activeIndex = isNaN(eventAsNumber)
            ? this.expensesByCategory.findIndex(x => x.name === event.value.name)
            : eventAsNumber;
    }

    private getExpensesByCategory() {
        const date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1;

        this.expenseService
            .getRecentExpensesByCategory(year, month, this.categoryId)
            .pipe(first())
            .subscribe((data) => {
                this.expensesByCategory = data.map((x) => ({
                    name: x.name,
                    value: x.total,
                }));
                this.legendData = this.expensesByCategory.map(
                    (x) => `${x.name}: ${x.value}`
                );
                this.loading = false;
                this.preventHoverWhileDrawing();
            });
    }

    private preventHoverWhileDrawing() {
        this.drawing = true;
        setTimeout(() => this.drawing = false, 750);
    }
}