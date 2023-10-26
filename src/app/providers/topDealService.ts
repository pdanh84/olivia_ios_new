import {Injectable, EventEmitter} from '@angular/core';

@Injectable({
    providedIn: 'root' // <- ADD THIS
})
@Injectable()
export class topDealService{
    itemCountFilter = new EventEmitter();
    itemClearFilter = new EventEmitter();
  listRegion:any= [];
  listData:any = [];
  objectFilter:any = {};
  listDataFilter:any = [];
  listAllData:any = [];
  listSlideData: any[];
  

}