
import {Injectable, EventEmitter} from '@angular/core';

@Injectable({
    providedIn: 'root' // <- ADD THIS
})
@Injectable()
export class BizTravelService{
  isCompany: boolean;
  bizAccount: any = {
    taxCode: '',
    legalName: '',
    address: '',
    phone: '',
    balanceAvaiable: 0,
    balanceAvailableStr: '0',
    phoneOtp: '',
    supporter: null
  };phoneOtp: any;
  phoneOtpShort: any;
  paymentType: any;//1-flightpayment; 2-hotelpayment; 3-combo
  accountBizTravelChange = new EventEmitter();
  routeBackWhenCancel: string;
  mytripPaymentBookingCode: any;
;
  actionHistory: any[];
  checkInDate: string;
  checkOutDate: string;
  checkInDateDisplay: string;
  checkOutDateDisplay: string;
  objBookinghoteldetail: any;
}