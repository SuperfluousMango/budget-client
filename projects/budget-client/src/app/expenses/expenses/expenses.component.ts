import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-expenses',
    templateUrl: './expenses.component.html',
    styleUrls: ['./expenses.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesComponent {
    constructor() {}
}
