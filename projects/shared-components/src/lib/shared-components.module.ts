import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from './card/card.component';
import { FilterDropdownComponent } from './filter-dropdown/filter-dropdown.component';
import { LoaderComponent } from './loader/loader.component';
import { MonthPickerComponent } from './month-picker/month-picker.component';

@NgModule({
    declarations: [
        CardComponent,
        FilterDropdownComponent,
        LoaderComponent,
        MonthPickerComponent
    ],
    imports: [CommonModule, NgbModule],
    exports: [
        CardComponent,
        FilterDropdownComponent,
        LoaderComponent,
        MonthPickerComponent
    ],
})
export class SharedComponentsModule {}
