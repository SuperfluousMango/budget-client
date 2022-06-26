import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    debounceTime,
    distinctUntilChanged,
    first,
    forkJoin,
    map,
    merge,
    Observable,
    OperatorFunction,
    Subject,
    takeUntil,
    timer,
} from 'rxjs';
import { Expense } from '../models';
import { ExpenseCategory } from '../models/expense-category';
import { ExpenseEntryComponent } from '../expense-entry/expense-entry.component';
import { ExpenseFilterService } from '../expense-filter.service';
import { ExpenseService } from '../expense.service';

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
    focus$ = new Subject<string>();

    private _destroy$ = new Subject<void>();

    constructor(
        private readonly expenseFilterService: ExpenseFilterService,
        private readonly expenseService: ExpenseService,
        private readonly modalService: NgbModal,
        private readonly cdr: ChangeDetectorRef
    ) {
        this.refreshExpenseList();

        this.expenseService.categories$
            .pipe(takeUntil(this._destroy$))
            .subscribe((data) => {
                this.categories = [...data];
                this.categoryHash = {};
                data.reduce((acc, val) => {
                    acc[val.id] = val.displayName;
                    return acc;
                }, this.categoryHash);

                this.expenseFilterService.filter$
                    .pipe(first())
                    .subscribe((filter) => {
                        if (filter.categoryId) {
                            const filteredCategory =
                                this.categories.find(
                                    (c) => c.id === filter.categoryId
                                ) ?? null;
                            this.categoryFilterCtrl.setValue(filteredCategory);
                        }
                    });
            });

        this.expenseService.expenseListUpdate$
            .pipe(takeUntil(this._destroy$))
            .subscribe((expenseDate) => this.checkForRefresh(expenseDate));

        this.categoryFilterCtrl.valueChanges
            .pipe(takeUntil(this._destroy$), distinctUntilChanged())
            .subscribe((val) => {
                this.expenseFilterService.updateFilter({
                    categoryId: val ? val.id : null,
                });
                this.refreshExpenseList();
            });
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
