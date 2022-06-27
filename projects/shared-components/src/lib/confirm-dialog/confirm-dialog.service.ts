import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Injectable({
    providedIn: 'root',
})
export class ConfirmDialogService {
    constructor(private readonly modalService: NgbModal) {}

    createConfirmDialog(message: string, title = 'Confirm', confirmButtonText = 'Confirm', cancelButtonText = 'Cancel'): Observable<boolean | null> {
        const modalInstance = this.modalService.open(ConfirmDialogComponent, { backdrop: 'static', size: 'lg' }),
            comp = modalInstance.componentInstance as ConfirmDialogComponent,
            result = new Subject<boolean | null>();

        comp.title = title;
        comp.message = message;
        comp.confirmButtonText = confirmButtonText;
        comp.cancelButtonText = cancelButtonText;

        modalInstance.closed.subscribe(val => result.next(val));
        modalInstance.dismissed.subscribe(() => result.next(null));

        return result;
    }
}
