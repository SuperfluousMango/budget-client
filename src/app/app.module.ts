import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardComponent } from '@dashboard';
import { NgbDateAdapter, NgbDateNativeAdapter, NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter, SharedModule } from '@shared';
import { ExpenseCategoryComponent, ExpenseEntryComponent, ExpenseListComponent } from '@expenses';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecentExpensesComponent } from './dashboard/recent-expenses/recent-expenses.component';
import { RecentGroupedExpensesComponent } from './dashboard/recent-grouped-expenses/recent-grouped-expenses.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartLegendComponent } from './dashboard/recent-grouped-expenses/chart-legend/chart-legend.component';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgbModule,
        NgxChartsModule,
        AppRoutingModule,
        SharedModule
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        ExpenseListComponent,
        ExpenseEntryComponent,
        ExpenseCategoryComponent,
        RecentExpensesComponent,
        RecentGroupedExpensesComponent,
        ChartLegendComponent
    ],
    providers: [
        { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
        CurrencyPipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
