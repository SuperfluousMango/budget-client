import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseFilterService, ExpensesByCategory, ExpenseService } from '@lib-expenses';
import { DateMonth } from '@lib-shared-components/month-picker/date-month';
import { first, Subject, takeUntil } from 'rxjs';

type ExpensesByCategorySummary = { name: string; value: number };

@Component({
    selector: 'recent-expenses-by-category',
    templateUrl: './recent-expenses-by-category.component.html',
    styleUrls: ['./recent-expenses-by-category.component.scss'],
})
export class RecentExpensesByCategoryComponent implements OnInit, OnDestroy, OnChanges {
    @Input() categoryId: number = 0;
    @Input() categoryGroupName: string = '';
    @Input() selectedMonth!: DateMonth;
    @Output() exit = new EventEmitter<void>();

    loading = true;
    drawing = false;
    expensesByCategory: ExpensesByCategorySummary[] = [];
    activeEntries: ExpensesByCategorySummary[] = [];
    activeIndex = -1;
    legendData: string[] = [];

    colorSchemeName: string;

    private categoryData: ExpensesByCategory[] = [];
    private destroy$ = new Subject<void>();

    constructor(
        private readonly expenseService: ExpenseService,
        private readonly expenseFilterService: ExpenseFilterService,
        private readonly router: Router
    ) {
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

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedMonth']) {
            this.getExpensesByCategory();
        }
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

    openExpensesByCategory(event: string) {
        const categoryId = this.categoryData.find(x => x.name === event)?.id ?? null;
        this.expenseFilterService.updateFilter({ categoryId, month: this.selectedMonth.month, year: this.selectedMonth.year });
        this.router.navigate(['/expenses']);
    }

    private getExpensesByCategory() {
        this.expenseService
            .getRecentExpensesByCategory(this.selectedMonth.year, this.selectedMonth.month, this.categoryId)
            .pipe(first())
            .subscribe((data) => {
                this.categoryData = data;
                this.expensesByCategory = data.map((x) => ({
                    name: x.name,
                    value: x.total
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
