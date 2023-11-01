import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class MytripService {
  listmytrips: any;
  listMyTrips: any[];
  listHistoryTrips: any[];
  listrequesttrips: any;
  listRequestTrips: any[];
  listSupport: any[];
  tripdetail: any;
  currentTrip: number;
  mylistOrders: any=[];
  backroute: string;
    orderPageState = new EventEmitter();
  rootPage: string;
  backfrompage: string;
  itemLoginUser = new EventEmitter();
  totalHistoryTrips: number;
  itemEnableHeader= new EventEmitter();
  totalHistoryTrip: any;
  isFlightPaymentBank: boolean;
  totalHistoryTripText: string;
  foodHistoryTextOrder: string;
  totalHistoryFoodCountText:string;
  listcount: number;
  objectDetail: any;
  listQrLink: any;

  constructor() { }

  private loadDataMytripHistorySubject = new Subject<any>();
  publicLoadDataMytripHistorySubject(data: any) {
    this.loadDataMytripHistorySubject.next(data);
  }
  getLoadDataMytripHistorySubject(): Subject<any> {
    return this.loadDataMytripHistorySubject;
  }

  private loadDataWhenLoginUser = new BehaviorSubject<any>([]);
  publicLoadDataWhenLoginUserSubject(data: any) {
    this.loadDataWhenLoginUser.next(data);
  }
  getLoadDataWhenLoginUserSubject(): BehaviorSubject<any> {
    return this.loadDataWhenLoginUser;
  }
}
