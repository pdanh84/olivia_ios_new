import { GlobalFunction ,ActivityService} from './../../providers/globalfunction';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Component, NgZone, OnInit } from '@angular/core';

import { flightService } from '../../providers/flightService';
import { ValueGlobal } from '../../providers/book-service';
import { MytripService } from '../../providers/mytrip-service.service';
import { voucherService } from '../../providers/voucherService';
@Component({
  selector: 'app-flightinternationalpaymenttimeout',
  templateUrl: './flightinternationalpaymenttimeout.page.html',
  styleUrls: ['./flightinternationalpaymenttimeout.page.scss'],
})
export class FlightInternationalPaymentTimeoutPage implements OnInit {

  bookingCode;stt;text;qrimg;BillingCode;total;PeriodPaymentDate
  intervalID: any;
  allowCheck: any = true;
  allowrepay: boolean = false;
  errorCode: string='';
  errorMsg: string = '';
  showbutton: boolean = true;
  constructor(public activityService: ActivityService,private navCtrl:NavController, public gf: GlobalFunction,
    private activatedRoute: ActivatedRoute,private _flightService: flightService,
    private platform: Platform,
    public valueGlobal: ValueGlobal,
    private zone: NgZone,
    private alertCtrl: AlertController,
    public _mytripservice: MytripService,
    public _voucherService: voucherService) { 
 
    }

  ngOnInit() {
    this.stt= this.activatedRoute.snapshot.paramMap.get('stt');
    this.allowrepay = true;
   
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
  }

  gotoSearchPage(){
  
    if (this.stt==0) {
      
       this._flightService.itemChangeTicketFlight.emit(1);
        this.navCtrl.navigateBack('/flightsearchresultinternational');
    }
    else{
      this._flightService.itemTabFlightActive.emit(true);
        setTimeout(()=>{
              this._flightService.itemMenuFlightClick.emit(2);
            },200)
      this.valueGlobal.backValue = "homeflight";
      this.navCtrl.navigateBack('/tabs/tab1');
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
              this.navCtrl.navigateBack('/flightsearchresultinternational');
              alert.dismiss();
            }
          }
        ]
      });
      alert.present();
      return;
    }
    if (this.stt==0) {
      this.navCtrl.navigateBack('/flightinternationalpaymentselect');
    } else {
      this.navCtrl.back();
    }
   
  }
}