import { GlobalFunction } from '../../providers/globalfunction';
import { NavController,ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import { C } from '../../providers/constants';
import * as moment from 'moment';
import { ticketService } from '../../providers/ticketService';
import { ValueGlobal } from '../../providers/book-service';
import { FlightquickbackPage } from 'src/app/flightquickback/flightquickback.page';

@Component({
  selector: 'app-ticketpaymentpayoo',
  templateUrl: './ticketpaymentpayoo.page.html',
  styleUrls: ['./ticketpaymentpayoo.page.scss'],
})
export class TicketPaymentPayooPage implements OnInit {

  bookingCode; stt; text; qrimg; BillingCode; total; PeriodPaymentDate; textHours;
  intervalID: any;
  allowCheck: any = true;
  allowCheckHoldTicket: boolean = true;
  _inAppBrowser: any; _email
  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private activatedRoute: ActivatedRoute, private _ticketService: ticketService,
     public valueGlobal: ValueGlobal,private modalCtrl: ModalController,
    private zone: NgZone) {

  }

  ngOnInit() {
    this.bookingCode = this.activatedRoute.snapshot.paramMap.get('code');
    this.stt= this.activatedRoute.snapshot.paramMap.get('stt');
    if (this.stt == 0) {
      this.BillingCode = this._ticketService.BillingCode;
      this.textHours = moment(this._ticketService.periodPaymentDate).format("HH:mm");
      this.PeriodPaymentDate = this._ticketService.periodPaymentDate ? this.gf.getDayOfWeek(this._ticketService.periodPaymentDate).dayname + ", " + moment(this._ticketService.periodPaymentDate).format("DD") + " thg " + moment(this._ticketService.periodPaymentDate).format("MM") : "";
    }
    else {
      this.qrimg = this._ticketService.qrimg;
      clearInterval(this.intervalID);
      this.intervalID = setInterval(() => {
        //this.checkqrcode();
        this.zone.run(()=>{
          this.callCheckPayment();
        })
       
      }, 1000 * 5);

      setTimeout(() => {
        clearInterval(this.intervalID);
      }, 60000 * 15);
    }
    if(this._ticketService.discountPrice){
      this.total = this._ticketService.discountPrice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }else{
      this.total = this._ticketService.totalPriceNum.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }
    this.gf.logEventFirebase('Payoo', this._ticketService, 'ticketpaymentpayoo', 'add_payment_info', 'Ticket');
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
      this._ticketService.paymentType = -1;
      var paymentMethod=se.gf.funcpaymentMethodTicket('payoo_store');
      let objbookTicket={
        bookingCode : se._ticketService.itemTicketService.objbooking.bookingCode,
        paymentMethod: paymentMethod,
        bankTransfer:""
      }
      se.gf.ticketPaymentSave(objbookTicket);
      this.navCtrl.navigateForward('/ticketpaymentdone/0');
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
    let url = C.urls.baseUrl.urlMobile + "/app/CRMOldApis/getBookingDetailByCode?bookingCode="+se._ticketService.itemTicketService.objbooking.bookingCode+"";
    se.intervalID = setInterval(() => {
      se.gf.CheckPaymentTicket(url).then((res) => {
        let checkpay = res;
        if (checkpay.response && checkpay.response.payment_status == 5) {
         
          clearInterval(se.intervalID);
          se.gf.hideLoading();
         
          clearInterval(se.intervalID);
          se._ticketService.paymentType = 1;
          var paymentMethod=se.gf.funcpaymentMethodTicket('payoo_qr');
          let objbookTicket={
            bookingCode : se._ticketService.itemTicketService.objbooking.bookingCode,
            paymentMethod: paymentMethod
          }
          se.gf.ticketPaymentSave(objbookTicket);
          se.navCtrl.navigateForward('ticketpaymentdone/0');

        }
        else if (checkpay.response && checkpay.response.payment_status == 2) {

         
          clearInterval(se.intervalID);
          se.navCtrl.navigateForward('ticketpaymentfail');
        }
      })
    
      
    }, 2000 * 1);

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
    let url = C.urls.baseUrl.urlMobile + "/app/CRMOldApis/getBookingDetailByCode?bookingCode="+se._ticketService.itemTicketService.objbooking.bookingCode+"";
    this.zone.run(() => {
      se.gf.CheckPaymentTicket(url).then((res) => {
        let checkpay = res;
        if (checkpay.response && checkpay.response.payment_status == 5) {
          se._ticketService.paymentType = 1;
         
          clearInterval(se.intervalID);
          //se.ticketService.paymentType = 1;
          se.navCtrl.navigateForward('ticketpaymentdone/0');
        }
        else if (checkpay.response && checkpay.response.payment_status == 2) {

         
          clearInterval(se.intervalID);
          se.navCtrl.navigateForward('ticketpaymentfail');
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
      // enterAnimation: CustomAnimations.iosCustomEnterAnimation,
      // leaveAnimation: CustomAnimations.iosCustomLeaveAnimation,
      cssClass: "modal-flight-quick-back",
    });
  modal.present();
  }
  openWebpagePayoo(){
    
  }
}
