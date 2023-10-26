
import {Injectable, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
    providedIn: 'root' // <- ADD THIS
})

export class hotelDetailService{
    constructor(private http: HttpClient){

    }

    loadHotelDetailContractPrice(url,headersObj, body){
        return this.http.post(url, body, {headers: headersObj});
    }

    loadHotelSuggestDaily(url){
        return this.http.get(url, {headers: {
            apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
            apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U',}
        });
    }
}