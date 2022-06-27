import { Component } from '@angular/core';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(
        modalConfig: NgbModalConfig
    ) {
        // Set modal configuration options for the app
        modalConfig.centered = true;
    }
}
