import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { map, Observable, ReplaySubject, Subject, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Transaction } from './transaction';
import { GroupedCategories } from './transaction-category';
import { TransactionGroup } from './transaction-group';
import { TransactionInfo } from './transaction-info';

@Injectable({
    providedIn: 'root'
})
export class TransactionService implements OnDestroy {
    private _transactionListUpdateSubj = new Subject<Date>();
    private _categorySubj$ = new ReplaySubject<GroupedCategories[]>(1);
    private _destroy$ = new ReplaySubject<void>(1);

    transactionListUpdate$ = this._transactionListUpdateSubj.asObservable();
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

    getTransactionsByMonth(year: number, month: number): Observable<Transaction[]> {
        const url = `${environment.apiUrl}/api/TransactionEntry/${year}/${month}`;
        return this.httpClient.get<Transaction[]>(url);
    }

    saveTransaction(transaction: Transaction): Observable<void> {
        const url = `${environment.apiUrl}/api/TransactionEntry`;
        return this.httpClient.post<void>(url, transaction)
            .pipe(
                tap(() => this._transactionListUpdateSubj.next(transaction.transactionDate))
            );
    }

    saveCategory(categoryName: string, groupName: string): Observable<void> {
        const url = `${environment.apiUrl}/api/TransactionCategory`;
        return this.httpClient.post<void>(url, { categoryName, groupName })
            .pipe(
                tap(() => this.loadCategories())
            );
    }

    getRecentTransactions(): Observable<TransactionInfo[]> {
        const url = `${environment.apiUrl}/api/TransactionEntry/Recent`;
        return this.httpClient.get<TransactionInfo[]>(url);
    }

    getRecentGroupedTransactions(year: number, month: number): Observable<TransactionGroup[]> {
        const url = `${environment.apiUrl}/api/TransactionEntry/RecentGrouped/${year}/${month}`;
        return this.httpClient.get<TransactionGroup[]>(url);
    }

    private loadCategories(): void {
        const url = `${environment.apiUrl}/api/TransactionCategory`;
        this.httpClient.get<GroupedCategories[]>(url)
            .subscribe(data => this._categorySubj$.next(data));
    }
}
