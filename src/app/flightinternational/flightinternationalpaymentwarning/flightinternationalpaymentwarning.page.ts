import { GlobalFunction } from './../../providers/globalfunction';
import { NavController, Platform, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { flightService } from '../../providers/flightService';
import { ValueGlobal } from '../../providers/book-service';
import { FlightquickbackPage } from '../../flightquickback/flightquickback.page';
import { voucherService } from '../../providers/voucherService';
@Component({
  selector: 'app-flightinternationalpaymentwarning',
  templateUrl: './flightinternationalpaymentwarning.page.html',
  styleUrls: ['./flightinternationalpaymentwarning.page.scss'],
})
export class FlightInternationalPaymentwarningPage implements OnInit {

  bookingCode;stt;text;qrimg;BillingCode;total;PeriodPaymentDate;
  intervalID: any;
  allowCheck: any = true;
    totalpricedisplay: any;
    phone: any;
    bookingNo: string;
  constructor(private navCtrl:NavController, public gf: GlobalFunction,
    private activatedRoute: ActivatedRoute,private _flightService: flightService,
    private platform: Platform,
    public valueGlobal: ValueGlobal,
    private modalCtrl: ModalController,
    public _voucherService: voucherService) { 
        this.totalpricedisplay= this._flightService.itemFlightCache.totalPriceDisplay;
        this.phone = this._flightService.itemFlightCache.phone;
        this.bookingNo = this._flightService.itemFlightCache.pnr.resNo;
    }

  ngOnInit() {
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

  gohome(){
    this.clearItemCache();
    this._flightService.itemTabFlightActive.emit(true);
    this.valueGlobal.backValue = "homeflight";
    this.navCtrl.navigateBack('/tabs/tab1');
  }

  goback(){
    this.navCtrl.navigateBack('/tabs/tab1');
  }

    async showQuickBack(){
        const modal: HTMLIonModalElement =
        await this.modalCtrl.create({
        component: FlightquickbackPage,
        componentProps: {
            aParameter: true,
        },
        showBackdrop: true,
        backdropDismiss: true,
        //enterAnimation: CustomAnimations.iosCustomEnterAnimation,
        //leaveAnimation: CustomAnimations.iosCustomLeaveAnimation,
        cssClass: "modal-flight-quick-back",
        });
    modal.present();
    }
}