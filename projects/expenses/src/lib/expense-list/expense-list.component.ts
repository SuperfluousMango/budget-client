import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    first,
    forkJoin,
    map,
    merge,
    Observable,
    OperatorFunction,
    startWith,
    Subject,
    takeUntil,
    tap,
    timer,
} from 'rxjs';
import { Expense } from '../models';
import { ExpenseCategory } from '../models/expense-category';
import { ExpenseEntryComponent } from '../expense-entry/expense-entry.component';
import { ExpenseFilterService } from '../expense-filter.service';
import { ExpenseService } from '../expense.service';
import { DateMonth } from '@lib-shared-components/month-picker/date-month';

const EN_DASH = '–';
const HYPHEN = '-';

@Component({
    selector: 'expense-list',
    templateUrl: './expense-list.component.html',
    styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent implements OnDestroy {
    loading = true;
    searchDate = new Date();
    expenses: Expense[] = [];
    categories: ExpenseCategory[] = [];
    categoryHash: { [key: number]: string } = {};
    categoryFilterCtrl = new FormControl();
    monthCtrl: FormControl;
    maxMonth: DateMonth;
    focus$ = new Subject<string>();

    private _destroy$ = new Subject<void>();

    constructor(
        private readonly expenseFilterService: ExpenseFilterService,
        private readonly expenseService: ExpenseService,
        private readonly modalService: NgbModal,
        private readonly cdr: ChangeDetectorRef
    ) {
        const date = new Date();
        this.maxMonth = { month: date.getMonth() + 1, year: date.getFullYear() };
        this.monthCtrl = new FormControl({ ...this.maxMonth });

        this.expenseService.categories$
            .pipe(takeUntil(this._destroy$))
            .subscribe((data) => {
                this.categories = [...data];
                this.categoryHash = {};
                data.reduce((acc, val) => {
                    acc[val.id] = val.displayName;
                    return acc;
                }, this.categoryHash);
            });

        this.monthCtrl.valueChanges
            .pipe(takeUntil(this._destroy$), distinctUntilChanged(), tap(x => console.log(x)))
            .subscribe(() => this.updateExpenseFilter());

        this.categoryFilterCtrl.valueChanges
            .pipe(takeUntil(this._destroy$), distinctUntilChanged())
            .subscribe(() => this.updateExpenseFilter());

        this.expenseFilterService.filter$
            .pipe(takeUntil(this._destroy$))
            .subscribe((filter) => {
                const filteredCategory = filter.categoryId
                    ? this.categories.find(
                            (c) => c.id === filter.categoryId
                        ) ?? null
                    : null;

                const filterMonth = filter.month
                    ? { month: filter.month, year: filter.year }
                    : this.maxMonth;

                this.categoryFilterCtrl.setValue(filteredCategory, { emitEvent: false });
                this.monthCtrl.setValue(filterMonth, { emitEvent: false });
                this.refreshExpenseList();
            });

        this.expenseService.expenseListUpdate$
            .pipe(takeUntil(this._destroy$))
            .subscribe((expenseDate) => this.checkForRefresh(expenseDate));

        this.updateExpenseFilter();
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    searchCategories: OperatorFunction<string, readonly ExpenseCategory[]> = (
        text$: Observable<string>
    ) => {
        const debouncedText$ = text$.pipe(
            debounceTime(200),
            distinctUntilChanged()
        );

        return merge(debouncedText$, this.focus$.asObservable()).pipe(
            map((term) => term.toLocaleLowerCase()),
            map((term) => term.replace(EN_DASH, HYPHEN)),
            map((term) =>
                this.categories.filter((cat) =>
                    cat.displayName
                        .toLocaleLowerCase()
                        .replace(EN_DASH, HYPHEN)
                        .includes(term)
                )
            )
        );
    };

    formatter = (cat: ExpenseCategory) => cat.displayName;

    openModal(): void {
        this.modalService.open(ExpenseEntryComponent);
    }

    viewExpense(expense: Expense): void {
        const modalInstance = this.modalService.open(ExpenseEntryComponent),
            comp = modalInstance.componentInstance as ExpenseEntryComponent;
        comp.editMode = false;
        comp.expense = expense;
        comp.ngOnInit();
    }

    private updateExpenseFilter() {
        this.expenseFilterService.updateFilter({
            categoryId: this.categoryFilterCtrl.value?.id ?? null,
            month: this.monthCtrl.value.month,
            year: this.monthCtrl.value.year
        });
    }

    private checkForRefresh(transDate: Date): void {
        if (
            transDate.getMonth() == this.searchDate.getMonth() &&
            transDate.getFullYear() == this.searchDate.getFullYear()
        ) {
            this.refreshExpenseList();
        }
    }

    private refreshExpenseList(): void {
        this.loading = true;
        forkJoin([
            this.expenseService.getExpensesByMonth(),
            timer(750),
        ]).subscribe(([data]) => {
            this.expenses = data;
            this.loading = false;
            this.cdr.detectChanges();
        });
    }
}
