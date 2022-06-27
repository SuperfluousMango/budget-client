import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExpensesLibraryModule } from '@lib-expenses';
import { SharedComponentsModule } from '@lib-shared-components';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import {
    ChartLegendComponent,
    RecentExpensesByCategoryComponent,
    RecentExpensesByGroupComponent
} from './dashboard/recent-expenses-by-group';
import { RecentExpensesComponent } from './dashboard/recent-expenses/recent-expenses.component';

@NgModule({
    declarations: [
        DashboardComponent,
        RecentExpensesComponent,
        RecentExpensesByGroupComponent,
        RecentExpensesByCategoryComponent,
        ChartLegendComponent,
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        ExpensesLibraryModule,
        NgxChartsModule,
        ReactiveFormsModule,
        SharedComponentsModule,
    ],
})
export class DashboardModule {}
