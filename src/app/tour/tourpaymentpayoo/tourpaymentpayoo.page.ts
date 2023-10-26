import { GlobalFunction } from './../../providers/globalfunction';
import { NavController, Platform,ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';

import { C } from '../../providers/constants';
import * as moment from 'moment';
import { tourService } from '../../providers/tourService';
import { ValueGlobal } from '../../providers/book-service';
import { Storage } from '@ionic/storage';
import { FlightquickbackPage } from 'src/app/flightquickback/flightquickback.page';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-tourpaymentpayoo',
  templateUrl: './tourpaymentpayoo.page.html',
  styleUrls: ['./tourpaymentpayoo.page.scss'],
})
export class TourPaymentPayooPage implements OnInit {

  bookingCode; stt; text; qrimg; BillingCode; total; PeriodPaymentDate; textHours;
  intervalID: any;
  allowCheck: any = true;
  allowCheckHoldTicket: boolean = true;
  _email;
  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private activatedRoute: ActivatedRoute, private _tourService: tourService,
    private platform: Platform, public valueGlobal: ValueGlobal,private modalCtrl: ModalController,
    private zone: NgZone,
    private _platform: Platform,
    private storage: Storage,
    ) {

  }

  ngOnInit() {
    this.bookingCode = this.activatedRoute.snapshot.paramMap.get('code');
    this.stt= this.activatedRoute.snapshot.paramMap.get('stt');
    if (this.stt == 0) {
      this.BillingCode = this._tourService.BillingCode;
      this.textHours = moment(this._tourService.periodPaymentDate).format("HH:mm");
      this.PeriodPaymentDate = this._tourService.periodPaymentDate ? this.gf.getDayOfWeek(this._tourService.periodPaymentDate).dayname + ", " + moment(this._tourService.periodPaymentDate).format("DD") + " thg " + moment(this._tourService.periodPaymentDate).format("MM") : "";
    }
    else {
      this.qrimg = this._tourService.qrimg;
      clearInterval(this.intervalID);
      this.intervalID = setInterval(() => {
        this.callCheckPayment();
      }, 1000 * 5);

      setTimeout(() => {
        clearInterval(this.intervalID);
      }, 60000 * 15);
    }
    if(this._tourService.discountPrice){
      this.total = this._tourService.discountPrice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }else{
      this.total = this._tourService.totalPrice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }

    this._tourService.gaPaymentType = 'payoo';
    this._tourService.totalPrice = this.total;
    this.gf.logEventFirebase(this._tourService.gaPaymentType,this._tourService, 'tourpaymentpayoo', 'add_payment_info', 'Tours');
  }
  goback() {
    if (this.stt == 1) {
      clearInterval(this.intervalID);
    }
    this.allowCheck = false;
    this.navCtrl.back();
  }
  next() {
    var se = this;
    if (se.stt == 0) {
      this._tourService.paymentType = -1;
      this.navCtrl.navigateForward('/tourpaymentdone');
      //se.navCtrl.navigateBack('/app/tabs/tab1');
    }
    else {
      clearInterval(se.intervalID);
      se.checkqrcode();
      se.allowCheck = false;
    }

  }

  checkqrcode() {
    var se = this;
    se.gf.showLoading();
    clearInterval(this.intervalID);
    se.intervalID = setInterval(() => {
        let url = C.urls.baseUrl.urlMobile + "/tour/api/BookingsApi/GetBookingByCode?code="+se.bookingCode;
        se.zone.run(() => {
          se.gf.Checkpayment(url).then((checkpay) => {
            //let checkpay = JSON.parse(res);
            if (checkpay.Response && checkpay.Response.PaymentStatus == 3) { 
              se.gf.hideLoading();
              clearInterval(se.intervalID);
              se._tourService.paymentType = 1;
              se.navCtrl.navigateForward('tourpaymentdone');
            }
            else if (checkpay.Response && checkpay.Response.PaymentStatus == 2)
            {
              se.gf.hideLoading();
              clearInterval(se.intervalID);
              se.gf.showAlertTourPaymentFail(checkpay.internalNote);
            }    
          
          })
        })
      
    }, 5000 * 1);

    setTimeout(() => {
      clearInterval(this.intervalID);
    }, 60000 * 10.5);
  }

  callCheckPayment() {
    var se = this;
    if (se.allowCheck) {
      se.checkPayment();
    }

  }

  checkPayment() {
    var se = this;
    let url = C.urls.baseUrl.urlMobile + "/tour/api/BookingsApi/GetBookingByCode?code="+se.bookingCode;
        se.zone.run(() => {
          se.gf.Checkpayment(url).then((checkpay) => {
           // let checkpay = JSON.parse(res);
            if (checkpay.Response && checkpay.Response.PaymentStatus == 3) { 
              se.gf.hideLoading();
             
              clearInterval(se.intervalID);
              se._tourService.paymentType = 1;
              se.navCtrl.navigateForward('tourpaymentdone');
            }
            else if (checkpay.Response && checkpay.Response.PaymentStatus == 2)
            {
              se.gf.hideLoading();
              
              clearInterval(se.intervalID);
              se.gf.showAlertTourPaymentFail(checkpay.internalNote);
            }
          
          })
        })
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

  async openWebpagePayoo() {
    var se = this;
    var url = "https://payoo.vn/mapv2/public/index.php?verify=true";
    await Browser.open({ url: url});

    Browser.addListener('browserFinished', () => {
      se.gf.hideLoading();

    });

  }
}
