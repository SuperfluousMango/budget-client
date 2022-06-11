import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { colorSets } from '@swimlane/ngx-charts';

@Component({
    selector: 'chart-legend',
    templateUrl: './chart-legend.component.html',
    styleUrls: ['./chart-legend.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLegendComponent implements OnChanges {
    @Input() colorScheme: string = "";
    @Input() data: { name: string, value: number }[] = [];
    @Output() itemHover = new EventEmitter<number | undefined>();

    public total?: number;
    public items: { text: string, color: string }[] = [];

    private readonly defaultColors = [ '#888888' ];

    constructor(private readonly currencyPipe: CurrencyPipe) {}

    ngOnChanges(_changes: SimpleChanges): void {
        if (this.colorScheme && this.data) {
            this.updateTotal();
        }
    }

    hover(index?: number) {
        this.itemHover.emit(index);
    }

    private updateTotal(): void {
        const colors = colorSets.find(x => x.name === this.colorScheme)?.domain ?? this.defaultColors;
        this.total = 0;

        this.items = this.data.map((x, idx) => {
            this.total! += x.value;
            const text = `${x.name}: ${this.currencyPipe.transform(x.value)}`,
                color = colors[idx % colors.length];
            
            return { text, color };
        });
    }
}
