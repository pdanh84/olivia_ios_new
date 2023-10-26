import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform, ModalController, AlertController } from '@ionic/angular';
import { C } from '../../providers/constants';

import { Storage } from '@ionic/storage';
import { ActivityService, GlobalFunction } from '../../providers/globalfunction';
import * as moment from 'moment';
import { flightService } from '../../providers/flightService';
import { CustomAnimations } from '../../providers/CustomAnimations';
import { BizTravelService } from '../../providers/bizTravelService';
import { tourService } from 'src/app/providers/tourService';
import { FlightquickbackPage } from 'src/app/flightquickback/flightquickback.page';
import { Browser } from '@capacitor/browser';


@Component({
  selector: 'app-tourpaymentselect',
  templateUrl: './tourpaymentselect.page.html',
  styleUrls: ['./tourpaymentselect.page.scss'],
})
export class TourPaymentSelectPage implements OnInit {
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
  arrbankrmb:any=[];
  tokenid: any;
  isbtn: boolean;
  isdisable: boolean;
  isremember: boolean;
  bookingCode: string;
  phone: any;
  blockPayCard = false;
  dataServiceFee: any=[];
  dataSF:any;
  constructor(private navCtrl:NavController,public _flightService: flightService
    ,public gf: GlobalFunction, public loadingCtrl: LoadingController
    , public storage: Storage,
    private modalCtrl: ModalController,
    private platform: Platform,
    private alertCtrl: AlertController,
    private zone: NgZone,
    public bizTravelService: BizTravelService,
    public activityService: ActivityService,
    public tourService: tourService,) { 
    
    if(tourService.BookingTourMytrip) {
      let totalPrice = tourService.BookingTourMytrip.amount_after_tax;
      if(tourService.BookingTourMytrip.promotionDiscountAmount){
        tourService.totalPriceBeforeDiscount = tourService.BookingTourMytrip.amount_after_tax + tourService.BookingTourMytrip.promotionDiscountAmount;
      }
      this.zone.run(()=>{
        this.tourService.totalPrice = totalPrice;
        this.tourService.totalPriceStr = this.gf.convertNumberToString(totalPrice);
      })

      this.tourService.departureCalendarStr = this.gf.getDayOfWeek(tourService.BookingTourMytrip.checkInDate).dayname +', '+ moment(tourService.BookingTourMytrip.checkInDate).format('DD') + ' tháng ' + moment(tourService.BookingTourMytrip.checkInDate).format('MM') + ' ' + moment(tourService.BookingTourMytrip.checkInDate).format('YYYY')
     
      this.bookingCode = tourService.BookingTourMytrip.booking_id;

      this.adult = tourService.BookingTourMytrip.extra_guest_info.split('|')[0] || 0;
      this.child = tourService.BookingTourMytrip.extra_guest_info.split('|')[1] || 0;
    }else if (this.tourService.itemDetail){
     
        let totalPrice =0;
        if(this.tourService.discountPrice){
          totalPrice = this.tourService.discountPrice;
        }else{
          if(this.tourService.itemDepartureCalendar && this.tourService.itemDepartureCalendar.TotalRate){
            totalPrice = this.tourService.itemDepartureCalendar.TotalRate;
          }else{
            totalPrice = ((this.tourService.itemDepartureCalendar.RateAdultAvg || (this.tourService.itemDepartureCalendar.PriceAdultAvg ||0)) * this.tourService.adult || 0) + ((this.tourService.itemDepartureCalendar.RateChildAvg ||0) * this.tourService.child || 0);
          }
  
          if(this.tourService.TourBooking.IsInvoice && this.tourService.itemDetail.Inbound){
            totalPrice = totalPrice *1.08;
          }
        }
        
      this.zone.run(()=>{
        this.tourService.totalPrice = totalPrice;
        this.tourService.totalPriceStr = this.gf.convertNumberToString(totalPrice);
      })

      this.tourService.departureCalendarStr = this.gf.getDayOfWeek(this.tourService.checkInDate).dayname +', '+ moment(this.tourService.checkInDate).format('DD') + ' tháng ' + moment(this.tourService.checkInDate).format('MM') + ' ' + moment(this.tourService.checkInDate).format('YYYY')
     
      this.bookingCode = this.tourService.dataBookResponse.Code;
    }
    
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
            let text = "Bearer " + auth_token;
            let headers =
                {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    authorization: text
                }

            this.gf.RequestApi('GET', C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo', headers, {}, 'tourpaymentselect', 'initpage').then((data)=>{
              if(data && data.bizAccount){
                this.zone.run(()=>{
                  this.bizTravelService.bizAccount = data.bizAccount;
                  this.bizTravelService.isCompany = true;
                })
               
              }else{
                this.bizTravelService.isCompany = false;
              }
            })
          }else{
            this.bizTravelService.isCompany = false;
          }
        });

        this.platform.ready().then(()=>{
    
          setTimeout(() => {
            clearInterval(this.intervalID);
        }, 1000 * 60 * 10);
        })

        //pdanh 16-08-2023: call api tính phí dịch vụ
      let url = `${C.urls.baseUrl.urlMobile}/api/Data/getaddonpaymentfee?applyFor=tour&totalPrice=${this.tourService.totalPrice}`;
      this.gf.RequestApi('GET', url, {}, {}, 'flightpaymentselect', 'getaddonpaymentfee').then((data)=>{
     if(data){
       this.dataServiceFee = data.filter(d => {return d.applyFor == 'tour'});
       console.log(this.dataServiceFee);
       let atmsf = this.dataServiceFee.filter(d => {return d.levelService == 'atm'});
       let vssf = this.dataServiceFee.filter(d => {return d.levelService == 'visa'});
       let jcbsf = this.dataServiceFee.filter(d => {return d.levelService == 'jcb'});
       let amexsf = this.dataServiceFee.filter(d => {return d.levelService == 'amex'});
       let alepaysf = this.dataServiceFee.filter(d => {return d.levelService == 'alepay'});
       let momosf = this.dataServiceFee.filter(d => {return d.levelService == 'momo'});
       let bnplsf = this.dataServiceFee.filter(d => {return d.levelService == 'bnpl'});
       let payoo_qrsf = this.dataServiceFee.filter(d => {return d.levelService == 'payoo_qr'});
       let payoo_storesf = this.dataServiceFee.filter(d => {return d.levelService == 'payoo_store'});

       this.dataSF = this.dataServiceFee && this.dataServiceFee.length >0 ? {} : null;
       this.dataSF.atmSF = atmsf && atmsf.length >0 ? atmsf[0] : null;
       this.dataSF.vsSF = vssf && vssf.length >0 ? vssf[0] : null;
       this.dataSF.jcbSF = jcbsf && jcbsf.length >0 ? jcbsf[0] : null;
       this.dataSF.amexSF = amexsf && amexsf.length >0 ? amexsf[0] : null;
       this.dataSF.alepaySF = alepaysf && alepaysf.length >0 ? alepaysf[0] : null;
       this.dataSF.momosSF = momosf && momosf.length >0 ? momosf[0] : null;
       this.dataSF.bnplSF = bnplsf && bnplsf.length >0 ? bnplsf[0] : null;
       this.dataSF.payoo_qrSF = payoo_qrsf && payoo_qrsf.length >0 ? payoo_qrsf[0] : null;
       this.dataSF.payoo_storesSF = payoo_storesf && payoo_storesf.length >0 ? payoo_storesf[0] : null;
     }
   })
  }
  ngOnInit() {
  }
  
  goback()
  {
    var se = this;
    clearInterval(se.intervalID);
    se.navCtrl.back();
  }
  tourpaymentbank()
  {
    clearInterval(this.intervalID);
    this.tourService.gaPaymentType = 'banktransfer';
    this.navCtrl.navigateForward('tourpaymentbank');
  }
  tourpaymentatm()
  {
    clearInterval(this.intervalID);
    this.tourService.paymentType = 1;
    this.tourService.gaPaymentType = 'atm';
    this.navCtrl.navigateForward('tourpaymentatm');
  }
  tourpaymentvisa() {
    this.tourService.gaPaymentType = 'visa';
    this.presentLoading();
    this.tourService.paymentType = 1;
    this.GeTokensOfMember(1);
  }

  async openWebpage(url: string) {
    var se = this;
    se.gf.logEventFirebase(se.tourService.gaPaymentType,se.tourService, 'tourpaymentselect', 'add_payment_info', 'Tours');
    await Browser.open({ url: url});

    Browser.addListener('browserFinished', () => {
            let url = C.urls.baseUrl.urlMobile + "/tour/api/BookingsApi/GetBookingByCode?code="+se.bookingCode;
              se.gf.hideLoading();
              se.gf.Checkpayment(url).then((checkpay)=>{
                //let checkpay = JSON.parse(res);
                if (checkpay.Response && checkpay.Response.PaymentStatus == 3) { 
                  se.tourService.paymentType = 1;
                  Browser.close();
                  clearInterval(se.intervalID);
                  
                  se.navCtrl.navigateForward('tourpaymentdone');
                }
                else if (checkpay.Response && checkpay.Response.PaymentStatus == 2)
                {
                  Browser.close();
                  clearInterval(se.intervalID);
                  this.gf.showAlertTourPaymentFail(checkpay.internalNote)
                }    
              })

              setTimeout(() => {
                clearInterval(this.intervalID);
              }, 60000 * 15);
         
        }
        );

        se.callSetInterval();
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }

  async hideLoading(){
    if(this.loader){
      this.loader.dismiss();
    }
  }
  tourpaymentmomo(){
    this.tourService.paymentType = 1;
    this.CreateBooking('momo');
  }

  callSetInterval()
  {
    if (this.loader) {
      this.loader.dismiss();
    }
    clearInterval(this.intervalID);
    this.intervalID = setInterval(() => {
        let url = C.urls.baseUrl.urlMobile + "/tour/api/BookingsApi/GetBookingByCode?code="+this.bookingCode;
          this.gf.Checkpayment(url).then((checkpay) => {
            //let checkpay = JSON.parse(res);
            if (checkpay.Response && checkpay.Response.PaymentStatus == 3) { 
              this.hideLoading();
              this.gf.hideLoading();
              Browser.close();
              if(this._windowmomo){
                this._windowmomo.close();
              }
              clearInterval(this.intervalID);
              this.tourService.paymentType = 1;
              this.navCtrl.navigateForward('tourpaymentdone');
            }
            else if (checkpay.Response && checkpay.Response.PaymentStatus == 2)
            {
              this.hideLoading();
              this.gf.hideLoading();
              Browser.close();
              if(this._windowmomo){
                this._windowmomo.close();
              }
              clearInterval(this.intervalID);
              this.gf.showAlertTourPaymentFail(checkpay.internalNote)
            }    
          
          })
      
    }, 5000 * 1);

    setTimeout(() => {
      clearInterval(this.intervalID);
    }, 60000 * 10.5);
  }

  createBookingTourTransaction() {
    let urlApiTrans = C.urls.baseUrl.urlMobile+'/tour/api/BookingsApi/UpdateTransaction?bookingCode='+this.bookingCode+'&status=2';
    let headers = {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    this.gf.RequestApi('GET', urlApiTrans, headers, null , 'tourpaymentbank', 'UpdateTransaction').then((dataTrans)=>{
      console.log(dataTrans);
      if(dataTrans){
        this.navCtrl.navigateForward('tourpaymentpayoo/' + this.bookingCode + '/0');
      }
    });
  }
  
  GeTokensOfMember(stt) {
    var se = this;
    se.gf.GeTokensOfMember(se.jti).then(dataTokens => {
      if (dataTokens) {
        //dataTokens = JSON.parse(dataTokens);
        if (dataTokens.tokens.length > 0) {
          this.arrbankrmb=[];
          for (let i = 0; i < dataTokens.tokens.length; i++) {
            if (dataTokens.tokens[i].vpc_Card == 'VC' || dataTokens.tokens[i].vpc_Card == 'MC' || dataTokens.tokens[i].vpc_Card == 'JC' || dataTokens.tokens[i].vpc_Card == 'AE') {
              // this.TokenId = dataTokens.tokens[i].id;
              var vpc_CardNum = dataTokens.tokens[i].vpc_CardNum.split('xxx');
              vpc_CardNum = vpc_CardNum[1];
              var cardname=this.getCardName(dataTokens.tokens[i].vpc_Card);
              var item = { id: dataTokens.tokens[i].id, imgbank: 'https://res.ivivu.com/payment/img/onepay/' + dataTokens.tokens[i].vpc_Card + '.png', vpc_CardNum: vpc_CardNum, name_Bank: cardname, checked: false };
              this.arrbankrmb.push(item);
            }
          }
          if ( this.arrbankrmb.length>0) {
            this.arrbankrmb[0].checked=true;
            this.tokenid= this.arrbankrmb[0].id;
            this.isbtn=true;
            this.isdisable=true;
            this.ischeckvisa=true
          }
        }
      }
      if (stt==1) {
        if (this.arrbankrmb.length > 0) {
          this.ischeckvisa = true;
        } else {
          if (this.bookingCode) {
            this.CreateBooking('visa');
          } 
        } 
      }
    })
  }
  next() {
   
    clearInterval(this.intervalID);
    this.CreateBooking('visa');
  }
  chooseacc(item)
  {
    
    this.tokenid=item.id;
    this.isbtn=true;
    this.isdisable=true;
    this.isremember=true;
  }
  nochooseacc()
  {
   
    this.tokenid="";
    this.isbtn=true;
    this.isdisable=false;
    this.isremember=true;
  }
  
  CreateBooking(paymentType)
  {
    var se=this;
    let itemcache = this.tourService;
    if(se.tourService.BookingTourMytrip) {
      se.bookingCode = se.tourService.BookingTourMytrip.booking_id;
      se.createBookingUrl(paymentType, se.tourService.BookingTourMytrip.amount_after_tax);
    }else {
      se.createBookingTour().then((bookingCode) => {
        if(bookingCode){
          se.bookingCode = bookingCode;
          se.createBookingUrl(paymentType, itemcache.totalPrice);
        }
      })
    }
    
    
  }

  createBookingUrl(paymentType, totalPrice) {
    let se = this, url='';
    if(paymentType == 'momo'){
      url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType='+paymentType+'&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' +se.phone + '&memberId=' + se.jti + '&TokenId='+(se.tokenid ? se.tokenid : '') +'&rememberToken='+(se.isremember ? se.isremember : 'false')+'&callbackUrl=https://ivivudownload.page.link/ivivuapp&version=2';
    }
    else if(paymentType == 'bnpl'){
      url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType='+paymentType+'&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' +se.phone + '&memberId=' + se.jti + '&TokenId='+(se.tokenid ? se.tokenid : '') +'&rememberToken='+(se.isremember ? se.isremember : 'false')+'&BankId=bnpl'+'&callbackUrl=ivivuapp%3A%2F%2Fapp%2Fhomeflight&version=2';
    }
    else{
      url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType='+paymentType+'&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' +se.phone + '&memberId=' + se.jti + '&TokenId='+(se.tokenid ? se.tokenid : '') +'&rememberToken='+(se.isremember ? se.isremember : 'false')+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink'+'&version=2';
    }
          se.gf.CreatePayoo(url).then(datapayoo => {
            if(datapayoo.success){
              se.gf.hideLoading();
              se.hideLoading();
              if(paymentType == 'momo'){
                //se.openWebpage(datapayoo.returnUrl.payUrl);
                se._windowmomo = window.open(datapayoo.returnUrl.payUrl, '_system');
                se.callSetInterval();
              }else{
                se.openWebpage(datapayoo.returnUrl);
                se.callSetInterval();
              }
              
              // se.zone.run(()=>{
              //   setTimeout(()=> {
              //     se.callSetInterval();
              //   },5000)
                
              // })
              
            }
            else{
              se.showAlertPaymentError();
              se.hideLoading();
            }
          })
  }
  
  getCardName(text)
  {
    var cardStr="";
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

  tourpaymentpayoostore() {
    let se = this;
    se.createBookingTour().then((bookingCode) => {
      if(bookingCode){
        this.bookingCode = bookingCode;
        let itemcache = this.tourService;
        var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=payoo_store&source=app&amount=' + itemcache.totalPrice + '&orderCode=' + this.bookingCode + '&buyerPhone=' + this.phone+'&memberId='+this.jti+'&version=2';
        this.gf.CreatePayoo(url).then(datapayoo => {
          this.gf.hideLoading();
          this.hideLoading();
          if (datapayoo.success) {
            this.tourService.BillingCode = datapayoo.payooStoreData.BillingCode;
            this.tourService.periodPaymentDate = datapayoo.payooStoreData.periodPayment;
            if (this.loader) {
              this.loader.dismiss();
            }
            
            this.createBookingTourTransaction();
            // this.navCtrl.navigateForward('tourpaymentpayoo/' + this.bookingCode + '/0');
          }
          else{
            this.gf.hideLoading();
            this.showAlertPaymentError();
            this.hideLoading();
          }
        })
      }
    })
    
  }
  tourpaymentpayooqr() {
    var se=this;
    this.tourService.paymentType = 1;
    let itemcache = this.tourService;
    if(se.tourService.BookingTourMytrip) {
      se.bookingCode = se.tourService.BookingTourMytrip.booking_id;
      se.createBookingUrlPayoo(se.tourService.BookingTourMytrip.amount_after_tax);
    } else {
      se.createBookingTour().then((bookingCode) => {
        if(bookingCode){
          se.bookingCode = bookingCode;
          se.createBookingUrlPayoo(itemcache.totalPrice);
        }
      })
    }
    
  }

  createBookingUrlPayoo(totalPrice) {
    let se = this;
    let url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=payoo_qr&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' +se.phone + '&memberId=' + se.jti + '&TokenId='+(se.tokenid ? se.tokenid : '') +'&rememberToken='+(se.isremember ? se.isremember : 'false')+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink'+'&version=2';
          se.gf.CreatePayoo(url).then(datapayoo => {
            se.gf.hideLoading();
            se.hideLoading();
            if (datapayoo.success) {
              se.tourService.qrimg = datapayoo.payooQrData.QRCodeUrl;
              se.navCtrl.navigateForward('tourpaymentpayoo/' + se.bookingCode + '/1');
            }else{
              se.gf.hideLoading();
              se.hideLoading();
              se.showAlertPaymentError();
            }
          })
  }

    tourpaymentatoffice(){
      
      //this.gf.showLoadingwithtimeout();
      this.tourService.gaPaymentType = 'office';
      this.navCtrl.navigateForward('/tourpaymentatoffice');
    }

   
    rememberCard(){
      this.isremember=!this.isremember
    }


    paymentbiztravel(){
      if(this.bizTravelService.bizAccount.balanceAvaiable - this.activityService.objRequestAddLuggage.totalPrice<=0){
        return;
      }
      this.storage.get('auth_token').then(auth_token => {
        if(auth_token){
          var text = "Bearer " + auth_token;
          var  headers =
          {
              'cache-control': 'no-cache',
              'content-type': 'application/json',
              authorization: text
          }
          var params = {memberid: this.jti, totalprice: this.activityService.objRequestAddLuggage.totalPrice};
          this.presentLoading();
          this.gf.checkAcceptBizCredit('POST', C.urls.baseUrl.urlMobile + '/api/Dashboard/CheckAcceptBizCredit', headers, params, 'companyinfo', 'GetBizTransactions').then((data) => {
            if(data && data.error == 0){
              this.bizTravelService.phoneOtp = data.phoneOtp;
              this.bizTravelService.phoneOtpShort = data.phoneOtpShort;
              this.bizTravelService.paymentType = 1;
              this.flightPayment().then((checkvalid) => {
                if(checkvalid){
                  this.tourService.paymentType = 1;
                  this.navCtrl.navigateForward('tourpaymentdone');
                }
                
              })
              
            }else{
              this.gf.showToastWarning('Account hiện tại không có quyền thanh toán. Vui lòng kiểm tra lại.');
            }
          })
        }else{

        }
       
      })
    }

    flightPayment(): Promise<any>{
      return new Promise((resolve, reject) => {
        let itemcache = this.activityService.objRequestAddLuggage;
                  var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=companycredit&source=app&amount=' + itemcache.totalPrice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + this.bookingCode + '&buyerPhone=' + this.phone +'&memberId='+this.jti+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink'+'&version=2';
                  this.gf.CreatePayoo(url).then(datapayoo => {
                    //datapayoo = JSON.parse(datapayoo);
                    if (datapayoo.success) {
                      this.hideLoading();
                      resolve(true);
                    }else{
                      this.hideLoading();
                      resolve(false);
                      this.showAlertPaymentError();
                    }
                  })
      })
      
        
    }
  
    async showAlertPaymentError(){
      var se = this;
      let msg ='Thanh toán không thành công. Xin vui lòng thử lại sau!';
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

    createBookingTour():Promise<any> {
      var se = this;
      this.gf.showLoading();
      return new Promise((resolve, reject) => {
        if (se.tourService.TourBooking.CustomerEmail) {
          var Invoice=0;
          if (se.tourService.order) {
            Invoice=1;
          }
            let urlApi = C.urls.baseUrl.urlMobile+'/tour/api/TourApi/CreateBookingVerApi';
            let headers = {
              apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
              apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
            };
            se.gf.RequestApi('POST', urlApi, headers, se.tourService.TourBooking, 'tourpaymentbank', 'CreateBookingVerApi').then((data)=>{
              if(data && data.Status == "Success" && data.Response && data.Response.BookingCode){
                se.tourService.tourBookingCode = data.Response.BookingCode;
                se.tourService.totalPrice = data.Response.Total;
                resolve(data.Response.BookingCode)
              }else{
                resolve(false);
              }
             
            });
      }else{
        se.gf.hideLoading();
        se.gf.showToastWarning('Email không hợp lệ. Vui lòng kiểm tra lại.');
        resolve(false);
      }
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
    tourbuynowpaylater(){
      this.tourService.gaPaymentType = 'bnpl';
      this.createBookingUrl('bnpl', this.tourService.totalPrice);
    }
}
