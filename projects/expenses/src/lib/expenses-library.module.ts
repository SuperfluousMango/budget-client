import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from '@lib-shared-components';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ENVIRONMENT } from './environment-token';
import { ExpenseCategoryEntryComponent } from './expense-category-entry/expense-category-entry.component';
import { ExpenseEntryComponent } from './expense-entry/expense-entry.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';

@NgModule({
    declarations: [
        ExpenseCategoryEntryComponent,
        ExpenseEntryComponent,
        ExpenseListComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbModule,
        SharedComponentsModule,
    ],
    exports: [ExpenseEntryComponent, ExpenseListComponent],
})
export class ExpensesLibraryModule {
    public static forRoot(environment: any) {
        return {
            ngModule: ExpensesLibraryModule,
            providers: [{ provide: ENVIRONMENT, useValue: environment }],
        };
    }
}
