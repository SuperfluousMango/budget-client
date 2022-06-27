import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ExpensesLibraryModule } from '@lib-expenses';
import {
    CustomDateParserFormatter,
    NgbCustomizationModule,
} from '@lib-ngb-customization';
import {
    NgbDateAdapter,
    NgbDateNativeAdapter,
    NgbDateParserFormatter,
    NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgbModule,
        NgbCustomizationModule,
        AppRoutingModule,
        ExpensesLibraryModule.forRoot(environment), // We don't actually use this module, but we do need to configure it
    ],
    declarations: [AppComponent],
    providers: [
        { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
        {
            provide: NgbDateParserFormatter,
            useClass: CustomDateParserFormatter,
        },
        CurrencyPipe,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
