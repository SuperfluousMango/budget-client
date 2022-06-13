import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { map, Observable, ReplaySubject, Subject, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Expense } from './expense';
import { GroupedCategories } from './expense-category';
import { ExpenseGroup } from './expense-group';
import { ExpenseInfo } from './expense-info';

@Injectable({
    providedIn: 'root'
})
export class ExpenseService implements OnDestroy {
    private _expenseListUpdateSubj = new Subject<Date>();
    private _categorySubj$ = new ReplaySubject<GroupedCategories[]>(1);
    private _destroy$ = new ReplaySubject<void>(1);

    expenseListUpdate$ = this._expenseListUpdateSubj.asObservable();
    groupedCategories$ = this._categorySubj$.asObservable();
    categories$ = this._categorySubj$
        .pipe(
            map(data => data.map(group => group.categories).flat())
        );

    constructor(private readonly httpClient: HttpClient) {
        this.loadCategories();
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    getExpense(id: number): Observable<Expense> {
        const url = `${environment.apiUrl}/api/Expense/${id}`;
        return this.httpClient.get<Expense>(url);
    }

    getExpensesByMonth(year: number, month: number): Observable<Expense[]> {
        const url = `${environment.apiUrl}/api/Expense/${year}/${month}`;
        return this.httpClient.get<Expense[]>(url);
    }

    saveExpense(expense: Expense): Observable<void> {
        return expense.id
            ? this.updateExpense(expense)
            : this.createExpense(expense);
    }

    saveCategory(categoryName: string, groupName: string): Observable<void> {
        const url = `${environment.apiUrl}/api/ExpenseCategory`;
        return this.httpClient.post<void>(url, { categoryName, groupName })
            .pipe(
                tap(() => this.loadCategories())
            );
    }

    getRecentExpenses(): Observable<ExpenseInfo[]> {
        const url = `${environment.apiUrl}/api/Expense/Recent`;
        return this.httpClient.get<ExpenseInfo[]>(url);
    }

    getRecentGroupedExpenses(year: number, month: number): Observable<ExpenseGroup[]> {
        const url = `${environment.apiUrl}/api/Expense/RecentGrouped/${year}/${month}`;
        return this.httpClient.get<ExpenseGroup[]>(url);
    }

    private loadCategories(): void {
        const url = `${environment.apiUrl}/api/ExpenseCategory`;
        this.httpClient.get<GroupedCategories[]>(url)
            .subscribe(data => this._categorySubj$.next(data));
    }

    private createExpense(expense: Expense): Observable<void> {
        const url = `${environment.apiUrl}/api/Expense`;
        return this.httpClient.post<void>(url, expense)
            .pipe(
                tap(() => this._expenseListUpdateSubj.next(expense.transactionDate))
            );
    }

    private updateExpense(expense: Expense): Observable<void> {
        const url = `${environment.apiUrl}/api/Expense/${expense.id}`;
        return this.httpClient.put<void>(url, expense)
            .pipe(
                tap(() => this._expenseListUpdateSubj.next(expense.transactionDate))
            );
    }
}