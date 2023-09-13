import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    ctrl = new UntypedFormControl();
    constructor() { }
}
