import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExpensesLibraryModule } from '@lib-expenses';
import { ExpensesRoutingModule } from './expenses-routing.module';
import { ExpensesComponent } from './expenses/expenses.component';

@NgModule({
    declarations: [ExpensesComponent],
    imports: [
        CommonModule,
        ExpensesRoutingModule,
        ExpensesLibraryModule,
    ],
})
export class ExpensesModule {}
