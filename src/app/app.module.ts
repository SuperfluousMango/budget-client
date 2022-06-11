import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardComponent } from '@dashboard';
import { NgbDateAdapter, NgbDateNativeAdapter, NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter, SharedModule } from '@shared';
import { TransactionCategoryComponent, TransactionEntryComponent, TransactionListComponent } from '@transactions';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecentTransactionsComponent } from './dashboard/recent-transactions/recent-transactions.component';
import { RecentGroupedTransactionsComponent } from './dashboard/recent-grouped-transactions/recent-grouped-transactions.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartLegendComponent } from './dashboard/recent-grouped-transactions/chart-legend/chart-legend.component';

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
        TransactionListComponent,
        TransactionEntryComponent,
        TransactionCategoryComponent,
        RecentTransactionsComponent,
        RecentGroupedTransactionsComponent,
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
