import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { first, map, Observable, ReplaySubject, Subject, switchMap, tap } from 'rxjs';
import { ENVIRONMENT } from './environment-token';
import { ExpenseFilterService } from './expense-filter.service';
import { Expense, ExpensesByCategory, ExpensesByGroup } from './models';
import { ExpenseCategoryGroup } from './models/expense-category';
import { ExpenseInfo } from './models/expense-info';

@Injectable({
    providedIn: 'root'
})
export class ExpenseService implements OnDestroy {
    private _expenseListUpdateSubj = new Subject<Date>();
    private _categorySubj$ = new ReplaySubject<ExpenseCategoryGroup[]>(1);
    private _destroy$ = new ReplaySubject<void>(1);

    expenseListUpdate$ = this._expenseListUpdateSubj
        .pipe(map(val => val instanceof Date ? val : new Date(val)));
    groupedCategories$ = this._categorySubj$.asObservable();
    categories$ = this._categorySubj$
        .pipe(
            map(data => data.map(group => group.categories).flat())
        );

    constructor(
        private readonly expenseFilterService: ExpenseFilterService,
        @Inject(ENVIRONMENT) private readonly environment: any,
        private readonly httpClient: HttpClient
    ) {
        this.loadCategories();
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    getExpense(id: number): Observable<Expense> {
        const url = `${this.environment.apiUrl}/api/Expense/${id}`;
        return this.httpClient.get<Expense>(url);
    }

    getExpensesByMonth(): Observable<Expense[]> {
        return this.expenseFilterService.filter$
            .pipe(
                first(),
                switchMap(filter => {
                    const categoryId = filter.categoryId ?? null,
                        url = categoryId === null
                            ? `${this.environment.apiUrl}/api/Expense/${filter.year}/${filter.month}`
                            : `${this.environment.apiUrl}/api/Expense/${filter.year}/${filter.month}/${filter.categoryId}`;
                    return this.httpClient.get<Expense[]>(url);
                })
            );
    }

    saveExpense(expense: Expense): Observable<void> {
        return expense.id
            ? this.updateExpense(expense)
            : this.createExpense(expense);
    }

    deleteExpense(expense: Expense): Observable<void> {
        const url = `${this.environment.apiUrl}/api/Expense/${expense.id}`;
        return this.httpClient.delete<void>(url)
            .pipe(
                tap(() => this._expenseListUpdateSubj.next(expense.transactionDate))
            );
    }

    saveCategory(categoryName: string, groupName: string): Observable<void> {
        const url = `${this.environment.apiUrl}/api/ExpenseCategory`;
        return this.httpClient.post<void>(url, { categoryName, groupName })
            .pipe(
                tap(() => this.loadCategories())
            );
    }

    getRecentExpenses(): Observable<ExpenseInfo[]> {
        const url = `${this.environment.apiUrl}/api/Expense/Recent`;
        return this.httpClient.get<ExpenseInfo[]>(url);
    }

    getRecentExpensesByGroup(year: number, month: number): Observable<ExpensesByGroup[]> {
        const url = `${this.environment.apiUrl}/api/Expense/RecentByGroup/${year}/${month}`;
        return this.httpClient.get<ExpensesByGroup[]>(url);
    }

    getRecentExpensesByCategory(year: number, month: number, categoryGroupId: number): Observable<ExpensesByCategory[]> {
        const url = `${this.environment.apiUrl}/api/Expense/RecentByCategory/${year}/${month}/${categoryGroupId}`;
        return this.httpClient.get<ExpensesByGroup[]>(url);
    }

    private loadCategories(): void {
        const url = `${this.environment.apiUrl}/api/ExpenseCategory`;
        this.httpClient.get<ExpenseCategoryGroup[]>(url)
            .subscribe(data => this._categorySubj$.next(data));
    }

    private createExpense(expense: Expense): Observable<void> {
        const url = `${this.environment.apiUrl}/api/Expense`;
        return this.httpClient.post<void>(url, expense)
            .pipe(
                tap(() => this._expenseListUpdateSubj.next(expense.transactionDate))
            );
    }

    private updateExpense(expense: Expense): Observable<void> {
        const url = `${this.environment.apiUrl}/api/Expense/${expense.id}`;
        return this.httpClient.put<void>(url, expense)
            .pipe(
                tap(() => this._expenseListUpdateSubj.next(expense.transactionDate))
            );
    }
}
