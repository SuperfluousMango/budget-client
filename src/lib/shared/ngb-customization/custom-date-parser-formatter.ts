import { Injectable } from "@angular/core";
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
    private static readonly DELIMITER_REGEX = /[-.\\]/g;

    parse = (value: string) : NgbDateStruct | null => (value ? this.#parseDate(value) : null)

    format = (date: NgbDateStruct | null): string => date
            ? `${date.month}/${date.day}/${date.year}`
            : '';

    #parseDate(date: string): NgbDateStruct | null {
        const desiredDelimiter = '/',
            replacedDate = date.replace(CustomDateParserFormatter.DELIMITER_REGEX, desiredDelimiter),
            parsedDate = new Date(replacedDate);
        const x = isNaN(parsedDate.valueOf())
            ? null
            : {
                day: parsedDate.getDate(),
                month: parsedDate.getMonth() + 1,
                year: parsedDate.getFullYear()
            };
        return x;
    }
}
