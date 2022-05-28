import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbDateAdapter, NgbDateNativeUTCAdapter, NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from '@dashboard';
import { CustomDateParserFormatter, ToastsContainerComponent } from '@ngb-customization';
import { TransactionCategoryComponent, TransactionEntryComponent, TransactionListComponent } from '@transactions';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgbModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        TransactionListComponent,
        TransactionEntryComponent,
        TransactionCategoryComponent,
        ToastsContainerComponent
    ],
    providers: [
        { provide: NgbDateAdapter, useClass: NgbDateNativeUTCAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
