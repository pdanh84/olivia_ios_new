import { Injectable } from "@angular/core";

@Injectable()
export class ComboPrice{
    comboDate: Date;
    adult: number;
    day: Date;
    dataDay: Date;
    dayStr: string;
    price: number;
    priceStr: string;
    priceSimple: number;
    priceSimpleStr: string;
    dateDisplay: string
}