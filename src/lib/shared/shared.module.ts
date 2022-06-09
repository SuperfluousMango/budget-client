import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from './card/card.component';
import { LoaderComponent } from './loader/loader.component';
import { ToastsContainerComponent } from './ngb-customization';

@NgModule({
    declarations: [CardComponent, LoaderComponent, ToastsContainerComponent],
    imports: [CommonModule, NgbModule],
    exports: [CardComponent, LoaderComponent, ToastsContainerComponent],
})
export class SharedModule {}
