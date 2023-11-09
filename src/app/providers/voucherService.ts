import {Injectable, EventEmitter} from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
    providedIn: 'root' // <- ADD THIS
})

export class voucherService{
    itemVoucher;
    hasVoucher: boolean;
    selectVoucher: any=[];
    itemSelectVoucher: any = new EventEmitter();
    rollbackSelectedVoucher: any= new EventEmitter();
    vouchers: any[];
    isFlightPage: boolean;
    deSelectedVoucher: any= new EventEmitter();
    itemSelectVoucherFlightCombo: any= new EventEmitter();
    itemSelectVoucherHotel: any = new EventEmitter();
    openFrom: string;
    itemSelectVoucherTour: any = new EventEmitter();

  private clearVoucherSubject = new Subject<any>();
  voucherSelected: any=[];
  voucherSelectedMap: any;
  listPromoCode: any=[];
  totalDiscountPromoCode: any=0;
  listObjectPromoCode: any=[];
  voucherUsedSubject= new Subject<any>();
  voucherRefreshListSubject= new Subject<any>();
  rollbackAllSelectedVoucher= new Subject<any>();
  hotelPromoCode: string;
  hotelTotalDiscount: number;
  flightPromoCode: string;
  flightTotalDiscount: number;
  comboCarPromoCode: string;
  comboCarTotalDiscount: number;
  comboFlightPromoCode: string;
  comboFlightTotalDiscount: number;
  ticketTotalDiscount: any;
  ticketPromoCode: string;
  getRollbackAllSelectedVoucher(): Subject<any> {
    return this.rollbackAllSelectedVoucher;
  }
  getVoucherRefreshList(): Subject<any> {
    return this.voucherRefreshListSubject;
  }
  publicVoucherRefreshList(data: any) {
    this.voucherRefreshListSubject.next(data);
  }
  publicVoucherUsedClicked(data: any) {
    this.voucherUsedSubject.next(data);
  }
  publicClearVoucherAfterPaymentDone(data: any) {
    this.clearVoucherSubject.next(data);
  }

  getObservableClearVoucherAfterPaymentDone(): Subject<any> {
    return this.clearVoucherSubject;
  }
  getVoucherUsedObservable(): Subject<any> {
    return this.voucherUsedSubject;
  }

  publicInternationalVoucherUsedClicked(data: any) {
    this.voucherInternationalUsedSubject.next(data);
  }
  getVoucherInternationalUsedObservable(): Subject<any> {
    return this.voucherInternationalUsedSubject;
  }
  
  publicVoucherHotelUsedClicked(data: any) {
    this.voucherHotelUsedSubject.next(data);
  }
  getVoucherHotelUsedObservable(): Subject<any> {
    return this.voucherHotelUsedSubject;
  }
  private voucherInternationalUsedSubject = new Subject<any>();
  private voucherHotelUsedSubject = new Subject<any>();
  private voucherSubject = new Subject<any>();
  private voucherFlightComboSubject = new Subject<any>();
  private voucherHotelSubject = new Subject<any>();
  private voucherCarComboSubject = new Subject<any>();
  private voucherTourSubject = new Subject<any>();
  private voucherTicketSubject = new Subject<any>();
  publicVoucherClicked(data: any) {
    this.voucherSubject.next(data);
  }

  getObservable(): Subject<any> {
    return this.voucherSubject;
  }

  publicVoucherFlightComboClicked(data: any) {
    this.voucherFlightComboSubject.next(data);
  }

  getFlightComboObservable(): Subject<any> {
    return this.voucherFlightComboSubject;
  }

  publicVoucherHotelClicked(data: any) {
    this.voucherHotelSubject.next(data);
  }

  getHotelObservable(): Subject<any> {
    return this.voucherHotelSubject;
  }

  publicVoucherCarComboClicked(data: any) {
    this.voucherCarComboSubject.next(data);
  }

  getCarComboObservable(): Subject<any> {
    return this.voucherCarComboSubject;
  }
  
  publicVoucherTourClicked(data: any) {
    this.voucherTourSubject.next(data);
  }

  getTourObservable(): Subject<any> {
    return this.voucherTourSubject;
  }
  publicVoucherTicketClicked(data: any) {
    this.voucherTicketSubject.next(data);
  }
  getTicketObservable(): Subject<any> {
    return this.voucherTicketSubject;
  }
}