import { GlobalFunction,ActivityService } from './../providers/globalfunction';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Component, NgZone, OnInit } from '@angular/core';

import { C } from '../providers/constants';
import { flightService } from '../providers/flightService';
import { MytripService } from '../providers/mytrip-service.service';
import { ValueGlobal } from '../providers/book-service';
import { voucherService } from '../providers/voucherService';
@Component({
  selector: 'app-flightpaymenttimeout',
  templateUrl: './flightpaymenttimeout.page.html',
  styleUrls: ['./flightpaymenttimeout.page.scss'],
})
export class FlightpaymenttimeoutPage implements OnInit {

  bookingCode;stt;text;qrimg;BillingCode;total;PeriodPaymentDate
  intervalID: any;
  allowCheck: any = true;
  allowrepay: boolean = false;
  errorMsg: string='';
  showbutton: boolean = false;
  constructor(public activityService: ActivityService,private navCtrl:NavController, public gf: GlobalFunction,
    private activatedRoute: ActivatedRoute,private _flightService: flightService,
    private platform: Platform,
    public valueGlobal: ValueGlobal,
    private zone: NgZone,
    private alertCtrl: AlertController,
    public _mytripservice: MytripService,
    public _voucherService: voucherService) { 
        // this.errorMsg = _flightService.paymentError.noteIpn;
        // this.callCheckHoldTicket('',this._flightService.itemFlightCache);
    }

  ngOnInit() {
    this.stt= this.activatedRoute.snapshot.paramMap.get('stt');
    if (this.stt==0) {
      this.errorMsg = this._flightService.paymentError.noteIpn;
      this.callCheckHoldTicket('',this._flightService.itemFlightCache).then((check) => {
            if(this._flightService.itemFlightCache.dataSummaryBooking && this._flightService.itemFlightCache.dataSummaryBooking.urlPaymentAgain){
              this.zone.run(()=>{
                this.allowrepay = true;
              })
                
            }
          })
    }
    else{
      this.bookingCode=this.activityService.objPaymentMytrip.trip.booking_id;
      this.callCheckHoldTicketNew('',this.bookingCode).then((check) => {
        if(this._flightService.itemFlightCache.dataSummaryBooking && this._flightService.itemFlightCache.dataSummaryBooking.urlPaymentAgain){
          this.zone.run(()=>{
            this.allowrepay = true;
          })
            
        }
      })
    }
  }

  callCheckHoldTicket(url, data){
    var res = false;
    var se = this;
    se.gf.showLoading();
    return new Promise((resolve, reject) => {
      // var options = {
      //   method: 'GET',
      //   url: C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+data.pnr.resNo,
      //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
      //   headers: {
      //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
      //     'Content-Type': 'application/json; charset=utf-8',
      //   },
      // };

      let urlPath = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+data.pnr.resNo;
      let headers = {
            "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            'Content-Type': 'application/json; charset=utf-8',
      };
      this.gf.RequestApi('GET', urlPath, headers, {}, 'flightPaymentTimeout', 'callCheckHoldTicket').then((data)=>{

        if (data) {
          let result = data;
          se.zone.run(()=>{
          se.showbutton = true;
          se.gf.hideLoading();
            if(result && result.urlPaymentAgain){
                se.allowrepay = true;
            }
          })
        }
      })
    })
  }
  callCheckHoldTicketNew(url, bookingCode){
    var res = false;
    var se = this;
    se.gf.showLoading();
    return new Promise((resolve, reject) => {
      // var options = {
      //   method: 'GET',
      //   url: C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+bookingCode,
      //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
      //   headers: {
      //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
      //     'Content-Type': 'application/json; charset=utf-8',
      //   },
      // };

      let urlPath = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+bookingCode;
      let headers = {
            "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            'Content-Type': 'application/json; charset=utf-8',
      };
      this.gf.RequestApi('GET', urlPath, headers, {}, 'flightPaymentTimeout', 'callCheckHoldTicketNew').then((data)=>{

        if (data) {
          let result = data;
          if(se._flightService){
            se._flightService.itemFlightCache.dataSummaryBooking = result;
            se.zone.run(()=>{
              se.showbutton = true;
              se.gf.hideLoading();
              if(result && result.urlPaymentAgain){
                  se.allowrepay = true;
              }
            })
          }
        }
      })
    })
  }
  clearItemCache(){
    this._flightService.itemFlightCache = {};
    this._flightService.itemFlightCache.departLuggage = [];
    this._flightService.itemFlightCache.returnLuggage = [];
    this._flightService.itemFlightCache.jsonSeats = null;
        this._flightService.itemFlightCache.listdepartseatselected = "";
        this._flightService.itemFlightCache.listreturnseatselected = "";
        this._flightService.itemFlightCache.departLuggage = [];
        this._flightService.itemFlightCache.returnLuggage = [];
        this._flightService.itemFlightCache.hasChoiceLuggage = false;
        this._flightService.itemFlightCache.listSeatNormal = [];
        this._flightService.itemFlightCache.listReturnSeatNormal = [];
        this._flightService.itemFlightCache.departConditionInfo = null;
        this._flightService.itemFlightCache.returnConditionInfo = null;
        this._flightService.itemFlightCache.isnewmodelseat = false;
        this._flightService.itemFlightCache.isnewmodelreturnseat = false;
        if(this._voucherService.selectVoucher){
               
          this._voucherService.rollbackSelectedVoucher.emit(this._voucherService.selectVoucher);
          this._voucherService.selectVoucher = null;
        }
        this._voucherService.publicClearVoucherAfterPaymentDone(1);
        this._flightService.itemFlightCache.promotionCode = "";
        this._flightService.itemFlightCache.promocode = "";
        this._flightService.itemFlightCache.discount = 0;
  }

  gotoSearchPage(){
    if (this.stt==0) {
      this._flightService.itemChangeTicketFlight.emit(1);
      if(this._flightService.itemFlightCache.isApiDirect){
        this.navCtrl.navigateBack('/flightsearchresultinternational');
      }else{
        this.navCtrl.navigateBack('/flightsearchresult');
      }
    }
    else{
      this._flightService.itemTabFlightActive.emit(true);
      setTimeout(()=>{
        this._flightService.itemMenuFlightClick.emit(2);
      },200)
      this.valueGlobal.backValue = "homeflight";
      this.navCtrl.navigateBack(['/app/tabs/tab1']);
    }
 
  }

  async rePayment(){
    if(!this.allowrepay){
        let alert = await this.alertCtrl.create({
          message: 'Vé máy bay hết hạn thanh toán. Vui lòng chọn vé khác!',
          cssClass: "cls-alert-flighttimeout",
          backdropDismiss: false,
          buttons: [
          {
            text: 'OK',
            role: 'OK',
            handler: () => {
              this._flightService.itemChangeTicketFlight.emit(1);
              if(this._voucherService.selectVoucher){
               
                this._voucherService.rollbackSelectedVoucher.emit(this._voucherService.selectVoucher);
                this._voucherService.selectVoucher = null;
              }
              this._voucherService.publicClearVoucherAfterPaymentDone(1);
              this._flightService.itemFlightCache.promotionCode = "";
              this._flightService.itemFlightCache.promocode = "";
              this._flightService.itemFlightCache.discount = 0;
              if(this._flightService.itemFlightCache.isApiDirect){
                this.navCtrl.navigateBack('/flightsearchresultinternational');
              }else{
                this.navCtrl.navigateBack('/flightsearchresult');
              }
              alert.dismiss();
            }
          }
        ]
      });
      alert.present();
      return;
    }
    if (this.stt==0) {
      this.navCtrl.navigateBack('/flightpaymentselect');
    } else {
      this.navCtrl.navigateBack('/mytripaymentflightselect/1');
    }
  
  }
}