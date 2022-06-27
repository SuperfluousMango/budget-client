import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
    @Input() title = 'Confirm';
    @Input() message = 'Are you sure?';
    @Input() confirmButtonText = 'Confirm';
    @Input() cancelButtonText = 'Cancel';

    constructor(private readonly modalInstance: NgbActiveModal) {}

    readonly confirm = () => this.modalInstance.close(true);
    readonly deny = () => this.modalInstance.close(false);
    readonly cancel = () => this.modalInstance.dismiss();
}
