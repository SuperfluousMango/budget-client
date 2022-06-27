import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

// Use same selector as the ng-bootstrap typeahead directive
@Directive({
    selector: '[ngbTypeahead]'
})
export class TypeaheadScrollableDirective implements OnInit, OnDestroy {
    private readonly handler = () => this.handleKeydownEvent();

    constructor(
        private readonly elRef: ElementRef,
        private readonly typeaheadInstance: NgbTypeahead
    ) { }

    ngOnInit(): void {
        this.elRef.nativeElement.addEventListener('keydown', this.handler);
        this.elRef.nativeElement.classList.add('scrollable-typeahead');
    }

    ngOnDestroy(): void {
        this.elRef.nativeElement.removeEventListener('keydown', this.handler);
    }

    private handleKeydownEvent() {
        if (this.typeaheadInstance.isPopupOpen()) {
            const popup = document.getElementById(this.typeaheadInstance.popupId),
                activeElements = popup!.getElementsByClassName('active');
            
            if (activeElements.length === 1) {
                const elem = (activeElements[0] as any);
                elem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }
}
