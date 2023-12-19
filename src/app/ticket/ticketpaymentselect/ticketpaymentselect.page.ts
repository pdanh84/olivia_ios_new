
import { SearchHotel } from '../../providers/book-service';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform, ModalController, AlertController } from '@ionic/angular';
import { C } from '../../providers/constants';
import { Storage } from '@ionic/storage';
import { ActivityService, GlobalFunction } from '../../providers/globalfunction';
import * as moment from 'moment';
import { flightService } from '../../providers/flightService';
import { CustomAnimations } from '../../providers/CustomAnimations';
import { BizTravelService } from '../../providers/bizTravelService';
import { ticketService } from 'src/app/providers/ticketService';
import { FlightquickbackPage } from 'src/app/flightquickback/flightquickback.page';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';



@Component({
  selector: 'app-ticketpaymentselect',
  templateUrl: './ticketpaymentselect.page.html',
  styleUrls: ['./ticketpaymentselect.page.scss'],
})
export class TicketPaymentSelectPage implements OnInit {
  ischeckvisa = false;
  public loader: any;
  adult: any;
  child: any;
  totalpricedisplay: any;
  departtitle: string;
  returntitle: string;
  paymentfirst: boolean = false;
  intervalID: any;
  itemflight: any;
  jti: any;
  _windowmomo: any;
  arrbankrmb:any = [];
  tokenid: any;
  isbtn: boolean;
  isdisable: boolean;
  isremember: boolean;
  bookingCode: string;
  phone: any;
  blockPayCard = false;
  constructor(private navCtrl: NavController, public _flightService: flightService
    , public gf: GlobalFunction, public loadingCtrl: LoadingController
    , public searchhotel: SearchHotel, public storage: Storage,
    private modalCtrl: ModalController,
    private platform: Platform,
    private alertCtrl: AlertController,
    private zone: NgZone,
    public bizTravelService: BizTravelService,
    public activityService: ActivityService,
    public ticketService: ticketService,
    ) {
      let arrcd = this.ticketService.itemTicketService.AllotmentDateDisplay.split('-');
      let nd = new Date(arrcd[2], arrcd[1] - 1, arrcd[0]);
    this.ticketService.departureCalendarStr = this.gf.getDayOfWeek(nd).dayname + ', ' + ticketService.itemTicketService.AllotmentDateDisplay

    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
        this.GeTokensOfMember(0);
      }
    })
    this.storage.get('infocus').then(infocus => {
      if (infocus) {
        this.phone = infocus.phone;
      }
    })

    this.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        this.gf.getUserInfo(auth_token).then((data) => {
          if (data && data.bizAccount) {
            this.zone.run(() => {
              this.bizTravelService.bizAccount = data.bizAccount;
              this.bizTravelService.isCompany = true;
            })

          } else {
            this.bizTravelService.isCompany = false;
          }
        })
      } else {
        this.bizTravelService.isCompany = false;
      }
    });

    this.platform.ready().then(() => {
      setTimeout(() => {
        clearInterval(this.intervalID);
      }, 1000 * 60 * 10);
    })


    App.addListener('appUrlOpen', data => {
      this.callSetInterval(null);
    });
  }
  ngOnInit() {
  }

  ionViewWillLeave() {
  }

  goback() {
    var se = this;
    clearInterval(se.intervalID);
    se.navCtrl.back();
  }

  async openWebpage(url: string,paymentType) {
    var se = this;
    
    await Browser.open({ url: url});

    Browser.addListener('browserFinished', () => {
            let url = C.urls.baseUrl.urlMobile + "/app/CRMOldApis/getBookingDetailByCode?bookingCode="+se.ticketService.itemTicketService.objbooking.bookingCode+"";
                se.gf.hideLoading();
                se.gf.CheckPaymentTicket(url).then((res) => {
                  let checkpay = res;
                  if (checkpay.response && checkpay.response.payment_status == 5) {
                    Browser.close();
                    clearInterval(se.intervalID);
                    var paymentMethod=se.gf.funcpaymentMethodTicket(paymentType);
                    let objbookTicket={
                      bookingCode : se.ticketService.itemTicketService.objbooking.bookingCode,
                      paymentMethod: paymentMethod
                    }
                    se.gf.ticketPaymentSave(objbookTicket);
                    se.ticketService.paymentType = 1;
                    se.navCtrl.navigateForward('ticketpaymentdone/0');
                  }
                  else if (checkpay.response && checkpay.response.payment_status == 2) {

                    Browser.close();
                    clearInterval(se.intervalID);
                    se.navCtrl.navigateForward('ticketpaymentfail');
                    // this.gf.showAlertTourPaymentFail(checkpay.internalNote);
                  }
                })
              
              //clearInterval(se.intervalID);
              setTimeout(() => {
                clearInterval(se.intervalID);
              }, 60000 * 15);
          
        });

       
        se.gf.logEventFirebase(se.ticketService.gaPaymentType,se.ticketService, 'ticketpaymentselect', 'add_payment_info', 'Ticket');
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }

  async hideLoading() {
    if (this.loader) {
      this.loader.dismiss();
    }
  }
  ticketpaymentmomo() {
    this.ticketService.paymentType = 1;
    this.ticketService.gaPaymentType = 'momo';
    this.createBookingUrl('momo');
  }

  callSetInterval(paymentType) {
    var se = this;
    clearInterval(this.intervalID);
    this.intervalID = setInterval(() => {
      let url = C.urls.baseUrl.urlMobile + "/app/CRMOldApis/getBookingDetailByCode?bookingCode="+se.ticketService.itemTicketService.objbooking.bookingCode+"";
      this.zone.run(() => {
        se.gf.CheckPaymentTicket(url).then((res) => {
          let checkpay = res;
          if (checkpay.response && checkpay.response.payment_status == 5) {
            Browser.close();
            clearInterval(se.intervalID);
            se.ticketService.paymentType = 1;
            var paymentMethod=se.gf.funcpaymentMethodTicket(paymentType);
            let objbookTicket={
              bookingCode : se.ticketService.itemTicketService.objbooking.bookingCode,
              paymentMethod: paymentMethod
            }
            se.gf.ticketPaymentSave(objbookTicket);
            se.navCtrl.navigateForward('ticketpaymentdone/0');
          }
          else if (checkpay.response && checkpay.response.payment_status == 2) {

            Browser.close();
            clearInterval(se.intervalID);
            se.navCtrl.navigateForward('ticketpaymentfail');
            // this.gf.showAlertTourPaymentFail(checkpay.internalNote);
          }
        })
      })

    }, 5000 * 1);

    setTimeout(() => {
      clearInterval(this.intervalID);
    }, 60000 * 10.5);
  }



  GeTokensOfMember(stt) {
    var se = this;
    se.gf.GeTokensOfMember(se.jti).then(dataTokens => {
      if (dataTokens) {
        // dataTokens = JSON.parse(dataTokens);
        if (dataTokens.tokens.length > 0) {
          this.arrbankrmb = [];
          for (let i = 0; i < dataTokens.tokens.length; i++) {
            if (dataTokens.tokens[i].vpc_Card == 'VC' || dataTokens.tokens[i].vpc_Card == 'MC' || dataTokens.tokens[i].vpc_Card == 'JC' || dataTokens.tokens[i].vpc_Card == 'AE') {
              // this.TokenId = dataTokens.tokens[i].id;
              var vpc_CardNum = dataTokens.tokens[i].vpc_CardNum.split('xxx');
              vpc_CardNum = vpc_CardNum[1];
              var cardname = this.getCardName(dataTokens.tokens[i].vpc_Card);
              var item = { id: dataTokens.tokens[i].id, imgbank: 'https://res.ivivu.com/payment/img/onepay/' + dataTokens.tokens[i].vpc_Card + '.png', vpc_CardNum: vpc_CardNum, name_Bank: cardname, checked: false };
              this.arrbankrmb.push(item);
            }
          }
          if (this.arrbankrmb.length > 0) {
            this.arrbankrmb[0].checked = true;
            this.tokenid = this.arrbankrmb[0].id;
            this.isbtn = true;
            this.isdisable = true;
            this.ischeckvisa = true
          }
        }
      }
      if (stt == 1) {
        if (this.arrbankrmb.length > 0) {
          this.ischeckvisa = true;
        } else {
          if (this.bookingCode) {
            this.createBookingUrl('visa');
          }
        }
      }
    })
  }
  next() {
    clearInterval(this.intervalID);
    this.createBookingUrl('visa');
  }
  chooseacc(item) {

    this.tokenid = item.id;
    this.isbtn = true;
    this.isdisable = true;
    this.isremember = true;
  }
  nochooseacc() {

    this.tokenid = "";
    this.isbtn = true;
    this.isdisable = false;
    this.isremember = true;
  }


  createBookingUrl(paymentType) {
    let se = this, url = '';
    se.ticketService.gaPaymentType = 'paymentType';
    this.gf.showLoading();
    if (paymentType == 'momo') {
      url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=' + paymentType + '&source=app&amount=' + this.ticketService.totalPriceNum + '&orderCode=' + this.ticketService.itemTicketService.objbooking.bookingCode + '&buyerPhone=' + se.phone + '&memberId=' + se.jti + '&TokenId=' + (se.tokenid ? se.tokenid : '') + '&rememberToken=' + (se.isremember ? se.isremember : 'false') + '&callbackUrl=ivivuapp%3A%2F%2Fapp%2Fhomeflight&version=2';
    }
    // else if (paymentType == 'bnpl') {
    //   url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=' + paymentType + '&source=app&amount=' + this.ticketService.totalPriceNum + '&orderCode=' + this.ticketService.itemTicketService.objbooking.bookingCode + '&buyerPhone=' + se.phone + '&memberId=' + se.jti + '&TokenId=' + (se.tokenid ? se.tokenid : '') + '&rememberToken=' + (se.isremember ? se.isremember : 'false') + '&BankId=bnpl' + '&callbackUrl=ivivuapp%3A%2F%2Fapp%2Fhomeflight&version=2';
    // }
    else {
      url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=' + paymentType + '&source=app&amount=' + this.ticketService.totalPriceNum + '&orderCode=' + this.ticketService.itemTicketService.objbooking.bookingCode + '&buyerPhone=' + se.phone + '&memberId=' + se.jti + '&TokenId=' + (se.tokenid ? se.tokenid : '') + '&rememberToken=' + (se.isremember ? se.isremember : 'false') + '&callbackUrl=' + C.urls.baseUrl.urlPayment + '/Home/BlankDeepLink' + '&version=2';
    }
    se.gf.CreatePayoo(url).then(datapayoo => {
      if (datapayoo.success) {
        se.gf.hideLoading();
        se.hideLoading();
        if (paymentType == 'momo') {
          se.openWebpage(datapayoo.returnUrl.payUrl,paymentType);
        } else {
          se.openWebpage(datapayoo.returnUrl,paymentType);
        }

        se.zone.run(() => {
          setTimeout(() => {
            se.callSetInterval(paymentType);
          }, 5000)

        })

      }
      else {
        se.gf.hideLoading();
        se.showAlertPaymentError();
  
      }
    })
  }

  getCardName(text) {
    var cardStr = "";
    switch (text) {
      case "MC":
        cardStr = "Mastercard";
        break;
      case "VC":
        cardStr = "Visacard";
        break;
      case "JC":
        cardStr = "JCBCard";
        break;
      case "AE":
        cardStr = "AECard";
    }
    return cardStr;
  }

  ticketpaymentpayoostore() {
    this.gf.showLoading();
    let se = this;
    se.ticketService.gaPaymentType = 'payoostore';
    var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=payoo_store&source=app&amount=' + this.ticketService.totalPriceNum + '&orderCode=' + this.ticketService.itemTicketService.objbooking.bookingCode + '&buyerPhone=' + se.phone + '&memberId=' + se.jti + '&TokenId=' + (se.tokenid ? se.tokenid : '') + '&rememberToken=' + (se.isremember ? se.isremember : 'false') + '&callbackUrl=ivivuapp%3A%2F%2Fapp%2Fhomeflight&version=2';
    this.gf.CreatePayoo(url).then(datapayoo => {
      this.gf.hideLoading();
      if (datapayoo.success) {
        this.ticketService.BillingCode = datapayoo.payooStoreData.BillingCode;
        this.ticketService.periodPaymentDate = datapayoo.payooStoreData.periodPayment;
      

        this.navCtrl.navigateForward('ticketpaymentpayoo/' + this.ticketService.itemTicketService.objbooking.bookingCode + '/0');
      }
      else {
        this.gf.hideLoading();
        this.showAlertPaymentError();
        this.hideLoading();
      }
    })

  }

  rememberCard() {
    this.isremember = !this.isremember
  }


  async showAlertPaymentError() {
    var se = this;
    let msg = 'Thanh toán không thành công. Xin vui lòng thử lại sau!';
    let alert = await se.alertCtrl.create({
      message: msg,
      header: 'Rất tiếc, đã có lỗi xảy ra',
      cssClass: "cls-alert-refreshPrice",
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          role: 'OK',
          handler: () => {

          }
        }
      ]
    });
    alert.present();
  }



  async showQuickBack() {
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


  ticketpaymentpayooqr() {
    let se = this;
    se.ticketService.gaPaymentType = 'payooqr';
    se.gf.showLoading();
    let url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=payoo_qr&source=app&amount=' + this.ticketService.totalPriceNum + '&orderCode=' + this.ticketService.itemTicketService.objbooking.bookingCode +'&buyerPhone=' +se.phone + '&memberId=' + se.jti + '&TokenId='+(se.tokenid ? se.tokenid : '') +'&rememberToken='+(se.isremember ? se.isremember : 'false')+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink'+'&version=2';
          se.gf.CreatePayoo(url).then(datapayoo => {
            se.gf.hideLoading();
            se.hideLoading();
            if (datapayoo.success) {
              se.ticketService.qrimg = datapayoo.payooQrData.QRCodeUrl;
              se.navCtrl.navigateForward('ticketpaymentpayoo/' + this.ticketService.itemTicketService.objbooking.bookingCode + '/1');
            }else{
              se.gf.hideLoading();
              se.hideLoading();
              se.showAlertPaymentError();
            }
          })
         
  }
  ticketbuynowpaylater() {
    this.ticketService.gaPaymentType = 'bnpl';
    this.createBookingUrl('bnpl');
  }
  ticketpaymentbank() {
    clearInterval(this.intervalID);
    this.ticketService.gaPaymentType = 'banktransfer';
    this.navCtrl.navigateForward('/ticketpaymentbank');
  }
  ticketpaymentatm() {
    clearInterval(this.intervalID);
    this.ticketService.gaPaymentType = 'atm';
    this.navCtrl.navigateForward('ticketpaymentatm/0');
  }
  ticketpaymentvisa() {
    this.ticketService.gaPaymentType = 'visa';
    this.createBookingUrl('visa');
  }
  ticketpaymentatoffice() {
    this.ticketService.gaPaymentType = 'office';
    this.navCtrl.navigateForward('/ticketpaymentatoffice');
  }
  paymentbiztravel(){
    
  }
}

