import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ExpenseFilter } from './models';

@Injectable({
    providedIn: 'root'
})
export class ExpenseFilterService {
    private readonly defaultFilter: ExpenseFilter = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        categoryId: null
    };
    private readonly filterSubj$ = new ReplaySubject<ExpenseFilter>(1);

    readonly filter$ = this.filterSubj$.asObservable();

    constructor() {
        this.filterSubj$.next(this.defaultFilter);
    }

    updateFilter(filter: ExpenseFilter) {
        const newFilter = this.processFilter(filter) ?? this.defaultFilter;
        this.filterSubj$.next(newFilter);
    }
    
    private processFilter(filter: ExpenseFilter | null): ExpenseFilter | null {
        const date = new Date();

        return !filter
            ? null
            : {
                year: filter.year ?? date.getFullYear(),
                month: filter.month ?? date.getMonth() + 1,
                categoryId: filter.categoryId ?? null
            };
    }
}
