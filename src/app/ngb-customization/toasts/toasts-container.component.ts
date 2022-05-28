import { Component, ViewEncapsulation } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from './toast.service';

@Component({
    selector: 'toasts-container',
    templateUrl: './toasts-container.component.html',
    styleUrls: [ './toasts-container.component.scss' ],
    host: { 'class': 'toast-container' },
    encapsulation: ViewEncapsulation.None
})
export class ToastsContainerComponent {
    constructor(public readonly toastService: ToastService) { }

    closeToast(t: NgbToast, toast: any): void {
        t.hide();
        this.toastService.remove(toast);
    }
}
