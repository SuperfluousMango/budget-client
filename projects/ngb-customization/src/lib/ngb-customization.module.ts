import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsContainerComponent } from './toasts';
import { TypeaheadScrollableDirective } from './typeahead-scrollable-results.directive';

@NgModule({
    declarations: [ToastsContainerComponent, TypeaheadScrollableDirective],
    imports: [CommonModule, NgbModule],
    exports: [ToastsContainerComponent, TypeaheadScrollableDirective],
})
export class NgbCustomizationModule {}
