import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from './card/card.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { FilterDropdownComponent } from './filter-dropdown/filter-dropdown.component';
import { LoaderComponent } from './loader/loader.component';
import { ToastsContainerComponent, TypeaheadScrollableDirective } from './ngb-customization';

@NgModule({
    declarations: [CardComponent, FilterDropdownComponent, LoaderComponent, ToastsContainerComponent, ConfirmDialogComponent, TypeaheadScrollableDirective],
    imports: [CommonModule, NgbModule],
    exports: [CardComponent, FilterDropdownComponent, LoaderComponent, ToastsContainerComponent, TypeaheadScrollableDirective]
})
export class SharedModule {}
