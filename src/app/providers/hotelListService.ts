
import {Injectable, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
    providedIn: 'root' // <- ADD THIS
})

export class hotelListService{
    constructor(private http: HttpClient){

    }

    loadHotelListPrice(url,headersObj, body){
        return this.http.post(url, body, {headers: headersObj});
    }
}