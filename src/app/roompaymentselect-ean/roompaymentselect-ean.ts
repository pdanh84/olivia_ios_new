import { Bookcombo } from './../providers/book-service';
import { Component, ViewChild, NgZone, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController, Platform, ToastController, AlertController } from '@ionic/angular';
import { Booking, RoomInfo, SearchHotel } from '../providers/book-service';
import { AuthService } from '../providers/auth-service';

import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import * as moment from 'moment';
import { BizTravelService } from '../providers/bizTravelService';
import { voucherService } from '../providers/voucherService';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';

/**
 * Generated class for the RoompaymentselectEanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'app-roompaymentselect-ean',
  templateUrl: 'roompaymentselect-ean.html',
  styleUrls: ['roompaymentselect-ean.scss'],
})
export class RoompaymentselectEanPage implements OnInit {
  timestamp;
  Avatar; Name; Address; cin; cout; dur; room; nameroom; jsonroom; arrchild; textage = "";
  roomnumber; adults; children; breakfast; PriceAvgPlusTAStr; priceshow; hotelid
  imgroom; roomtype; indexme; indexroom; cin1; cout1; checkpayment; book; roomcancel; pricetemp;
  public loader: any
  ischeckvisa = false
  auth_token: any = ''; bookingCode = ""; jti; arrbankrmb:any = []; tokenid; isbtn = false;
  intervalID: NodeJS.Timeout;
  _windowmomo: any;
  isremember=true;isdisable=false;isshowRemember=false;
  totalPrice: any;
  sttbooking=0;
  ischeckedDK=true;
  constructor(public platform: Platform, public searchhotel: SearchHotel, public navCtrl: NavController, public Roomif: RoomInfo, public storage: Storage,public booking: Booking, public authService: AuthService, public modalCtrl: ModalController, public loadingCtrl: LoadingController,
    public gf: GlobalFunction, public zone: NgZone, public toastCtrl: ToastController, public bookCombo: Bookcombo,
    public bizTravelService: BizTravelService,
    private alertCtrl: AlertController,
    public _voucherService: voucherService) {
    this.Avatar = Roomif.imgHotel;
    this.Name = booking.HotelName;
    this.Address = Roomif.Address;
    this.cin = moment(booking.CheckInDate).format('DD-MM-YYYY');
    this.cout = moment(booking.CheckOutDate).format('DD-MM-YYYY');
    this.dur = Roomif.dur;
    this.roomnumber = Roomif.roomnumber;
    this.adults = booking.Adults;
    this.children = booking.Child;
    this.roomtype = Roomif.roomtype;
    this.indexme = booking.indexmealtype;
    this.indexroom = booking.indexroom;
    this.jsonroom = {...Roomif.jsonroom};
    this.room = Roomif.arrroom;
    //var chuoicin = this.cin.split('-');
    //var chuoicout = this.cout.split('-');
    //this.cin = chuoicin[2] + "-" + chuoicin[1] + "-" + chuoicin[0];
    //this.cout = chuoicout[2] + "-" + chuoicout[1] + "-" + chuoicout[0];
    this.nameroom = this.room[0].ClassName;
    this.roomcancel = this.room[0].MealTypeRates[this.indexme];
    this.breakfast = this.room[0].MealTypeRates[this.indexme].Name;
    this.PriceAvgPlusTAStr = this.roomtype.PriceAvgPlusTAStr;
    this.checkpayment = Roomif.payment;
    this.arrchild = this.searchhotel.arrchild;
    if (Roomif.priceshow) {
      this.priceshow = Roomif.priceshow;
    }
    else {
      this.priceshow = this.PriceAvgPlusTAStr;
    }
    this.totalPrice = this.priceshow.toString().replace(/\./g, '').replace(/\,/g, '');
    this.searchhotel.totalPrice = this.totalPrice;
    if (this.arrchild) {
      for (let i = 0; i < this.arrchild.length; i++) {
        if (i == this.arrchild.length - 1) {
          this.textage = this.textage + this.arrchild[i].numage;
        } else {
          this.textage = this.textage + this.arrchild[i].numage + ",";
        }
      }
    }

    if (this.textage) {
      this.textage = "(" + this.textage + ")";
    }
   
    this.searchhotel.backPage = "roompaymentselect-ean";
    this.searchhotel.rootPage = "roompaymentselect-ean";
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
        this.isshowRemember=true;
        this.GeTokensOfMember(0);
      }
      else{
        this.isremember=false;
      }
    });
    this.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
            let text = "Bearer " + auth_token;
            let headers =
                {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    authorization: text
                }

            this.gf.RequestApi('GET', C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo', headers, {}, 'roompaymentselect', 'initpage').then((data)=>{
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
    //google analytic
    gf.googleAnalytion('roompaymentselect-ean', 'load', '');
    App.addListener('appUrlOpen', data => {
      this.setinterval();
    });
  }
  ngOnInit() {
  }
  ionViewWillEnter() {
    this.bookingCode=this.bookingCode?this.bookingCode:this.Roomif.bookingCode;
    this.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
    })
    C.writePaymentLog("hotel", "paymentselect", "purchase", this.bookingCode);
  }
  roompaymentbank() {
    clearInterval(this.Roomif.setInter);
    this.navCtrl.navigateForward("/roompaymentbanknew");
    //google analytic
    this.gf.googleAnalytion('roompaymentselect', 'roompaymentbankselect', '');
  }
  roompaymentlive() {
    clearInterval(this.Roomif.setInter);
    this.navCtrl.navigateForward("/roompaymentlive/0");
    //google analytic
    this.gf.googleAnalytion('roompaymentselect', 'roompaymentliveselect', '');
  }
  roompaymentatm() {
    this.navCtrl.navigateForward("/roomchoosebank/0")
    //google analytic
    this.gf.googleAnalytion('roompaymentselect', 'roompaymentatmselect', '');
  }
  roompaymentvisa() {
    var se = this;
    //se.storage.get('auth_token').then(auth_token => {
    if (se.booking.CEmail) {
      if (this.arrbankrmb.length==0) {
        this.GeTokensOfMember(1);
      }
    } else {
      se.presentToastr('Email không hợp lệ. Vui lòng kiểm tra lại.');
    }
  }
  async openWebpage(url: string) {
    var se = this;
    se.gf.logEventFirebase(se.searchhotel.paymentType,se.searchhotel, 'roompaymentselect-ean', 'add_payment_info', 'Hotels');
    await Browser.open({ url: url});

    Browser.addListener('browserFinished', () => {
      if(se.loader){
       se.loader.dismiss();
      }
      if (se.Roomif.point && se.bookingCode && se.sttbooking==0) {
               
        se.Roomif.bookingCode=se.bookingCode;
        se.showInfo("Điểm tích luỹ "+se.Roomif.point+" đã được dùng cho booking "+se.bookingCode+".Xin vui lòng thao tác lại booking!")
        
       
      }
      if (se._voucherService.hotelPromoCode && se.bookingCode && se.sttbooking==0) {
        se.Roomif.bookingCode=se.bookingCode
        se.showInfo("Mã giảm giá "+se._voucherService.hotelPromoCode+" đã được dùng cho booking "+se.bookingCode+".Xin vui lòng thao tác lại booking!")
       
      }
      clearInterval(this.intervalID);
     })
    clearInterval(se.intervalID);
    this.intervalID = setInterval(() => {
      this.checkPayment();
    }, 1000 * 1);
    setTimeout(() => {
      clearInterval(this.intervalID);
    }, 60000 * 15);
  }
  roompaymentbreakdow() {
    var dur = this.dur;
    var roomnumber = this.roomnumber;
    this.navCtrl.navigateForward('/roompaymentbreakdown/' + dur + '/' + roomnumber);

  }
  
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      message: "Giao dịch đang xử lý, xin quý khách đợi trong giây lát!",
    });
    this.loader.present();
  }
  goback() {
    clearInterval(this.intervalID);
    // if (this.bookingCode) {
    //   this.clearClonePage('page-hoteldetail');
    //   clearInterval(this.Roomif.setInter);
    //   this.searchhotel.backPage = "roompaymentselect-ean";
    //   this.navCtrl.navigateBack('/hoteldetail/' + this.booking.HotelId);
    // }
    // else {
    //   this.navCtrl.back();
    // }
    if((this.Roomif.point && this.Roomif.bookingCode) || (this.Roomif.promocode && this.Roomif.bookingCode))
    {
      this.navCtrl.navigateBack('/roomdetailreview');
    }else{
      this.navCtrl.back();
    }
  }
  openRoomCancel() {
    this.gf.setParams(this.roomcancel, 'roomInfo');
    this.searchhotel.backPage = "roompaymentselect-ean";
    this.navCtrl.navigateForward('/roomcancel');
  }
  async presentToastr(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  //thêm các phương thức thanh toán
  roompaymentpayoolive() {
    this.CreateBooking('payoo_store');
  }
  roompaymentpayooqr() {
    this.CreateBooking('payoo_qr');
  }
  roompaymentmomo() {
    this.CreateBooking('momo');
  }
  GeTokensOfMember(stt) {
    var se = this;
    se.gf.GeTokensOfMember(se.jti).then(dataTokens => {
      if (dataTokens) {
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
            this.ischeckvisa = true;
            this.isdisable=true;
          }
        }
      }
      if (stt == 1) {
        if (this.arrbankrmb.length > 0) {
          this.ischeckvisa = true;
        } else {
          //this.presentLoading();
          if (this.bookingCode) {
            this.NoCreateBooking('visa');
          } else {
            this.CreateBooking('visa');
          }
        }
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
  NoCreateBooking(paymentType) {
    var se = this;
    se.presentLoading();
    se.gf.CheckPaymentDate(this.bookingCode).then(data => {
      var url="";
      var totalPrice = se.priceshow.toString().replace(/\./g, '').replace(/\,/g, '');
      var timestamp=new Date();
      var temptime = timestamp.setTime(timestamp.getTime() + 15 * 60 * 1000);
      var paymentTime=moment(temptime).format('YYYYMMDDhhmmss');
      var paymentDate=moment(data.booking.DeliveryPaymentDate).format('YYYYMMDDhhmmss');
      if (paymentTime < paymentDate) {
        if (paymentType=='visa') {
          //url  = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType='+paymentType+'&source=app&amount=' + totalPrice + '&orderCode=' + databook.code + '&buyerPhone=' + this.Roomif.phone + '&callbackUrl=' + C.urls.baseUrl.urlPayment + '/Home/BlankappNew';
          url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=visa&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' +this.Roomif.phone + '&memberId=' + se.jti + '&TokenId='+se.tokenid+'&rememberToken='+se.isremember+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink';
        }
        else{
          url  = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType='+paymentType+'&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' + this.Roomif.phone + '&callbackUrl=https://ivivudownload.page.link/ivivuapp';
        }
        this.gf.CreateUrl(url).then(dataBuildLink => {
          if (paymentType == 'visa') {
            se.openWebpage(dataBuildLink.returnUrl);
          }
          else if (paymentType == 'payoo_store') {
            if (dataBuildLink.success) {
              this.Roomif.BillingCode = dataBuildLink.payooStoreData.BillingCode;
              if (this.loader) {
                this.loader.dismiss();
              }
              this.navCtrl.navigateForward('roompaymentpayoo/' + this.bookingCode + '/0');
            }
          }
          else if (paymentType == 'payoo_qr') {
            if (dataBuildLink.success) {
              this.Roomif.qrimg = dataBuildLink.payooQrData.QRCodeUrl;
              if (this.loader) {
                this.loader.dismiss();
              }
              this.navCtrl.navigateForward('roompaymentpayoo/' + this.bookingCode + '/1');
            }
          }
          else if (paymentType == 'momo') {
            if (dataBuildLink.success) {
              //se._windowmomo = window.open(dataBuildLink.returnUrl.payUrl, '_system');
              Browser.open({url : dataBuildLink.returnUrl.payUrl});
              this.setinterval();
            }
          }
        })
      }
      else {
        if(se.loader){
          se.loader.dismiss();
        }
        alert('Đã hết phòng, vui lòng chọn phòng khác');
        se.navCtrl.navigateBack('/hoteldetail/' + se.booking.HotelId);
      }
    })
         
    
  }
  CreateBooking(paymentType) {
    var se = this;
    if(se.Roomif.roomtype.Supplier == 'SERI'){
      //Check allotment khi book
        se.gf.checkAllotmentSeri(
        se.booking.HotelId,
        se.Roomif.RoomId,
        se.booking.CheckInDate,
        se.booking.CheckOutDate,
        se.Roomif.roomnumber,
        'SERI', se.Roomif.roomtype.HotelCheckDetailTokenInternal
        ).then((allow)=> {
          if(allow){
            se.continueBook(paymentType);
          }else{
            if (se.loader) {
              se.loader.dismiss();
            }
            se.gf.showToastWarning('Hiện tại khách sạn đã hết phòng loại này.');
          }
        })
    }else{
      se.continueBook(paymentType);
    }
  }

  continueBook(paymentType) {
    var se = this;
    se.presentLoading();
    var paymentMethod=se.gf.funcpaymentMethod(paymentType);
    this.CreateBookingRoom(paymentMethod).then(databook => {
      if (databook) {
        if (databook.error == 0) {
          this.bookingCode = databook.code;
          se.Roomif.bookingCode =this.bookingCode;
          se.Roomif.bookingStatus=databook.bookingStatus;
         
          if (this.roomtype.Supplier == 'HBED') {
            var totalPrice = se.priceshow.toString().replace(/\./g, '').replace(/\,/g, '');
            se.searchhotel.totalPrice = totalPrice;
            se.searchhotel.paymentType = paymentType;
            var url="";
            if (paymentType=='visa') {
              url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=visa&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' +this.Roomif.phone + '&memberId=' + se.jti + '&TokenId='+se.tokenid+'&rememberToken='+se.isremember+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink';
            }
            else if(paymentType=='bnpl'){
              url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType='+paymentType+'&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' +this.Roomif.phone + '&memberId=' + se.jti + '&TokenId='+se.tokenid+'&rememberToken='+se.isremember+'&BankId='+paymentType+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink';
            }
            else{
              url  = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType='+paymentType+'&source=app&amount=' + totalPrice + '&orderCode=' + databook.code + '&buyerPhone=' + this.Roomif.phone + '&callbackUrl=https://ivivudownload.page.link/ivivuapp';
            }
            this.gf.CreateUrl(url).then(dataBuildLink => {
              
              if (dataBuildLink.success) {
                if (paymentType == 'visa' || paymentType == 'bnpl') {
                  se.openWebpage(dataBuildLink.returnUrl);
                }
                else if (paymentType == 'payoo_store') {
                  this.Roomif.BillingCode = dataBuildLink.payooStoreData.BillingCode;
                  se.Roomif.PeriodPaymentDate = dataBuildLink.payooStoreData.periodPayment;
                  if (this.loader) {
                    this.loader.dismiss();
                  }
                  this.navCtrl.navigateForward('roompaymentpayoo/' + this.bookingCode + '/0');
                }
                else if (paymentType == 'payoo_qr') {
                  if (dataBuildLink.success) {
                    this.Roomif.qrimg = dataBuildLink.payooQrData.QRCodeUrl;
                    if (this.loader) {
                      this.loader.dismiss();
                    }
                    this.navCtrl.navigateForward('roompaymentpayoo/' + this.bookingCode + '/1');
                  }
                }
                else if (paymentType == 'momo') {
                  if (dataBuildLink.success) {
                    if (this.loader) {
                      this.loader.dismiss();
                    }
                    //se._windowmomo = window.open(dataBuildLink.returnUrl.payUrl, '_system');
                    Browser.open({url: dataBuildLink.returnUrl.payUrl});
                    this.setinterval();
                  }
                }
              }
            })
          }
          //pdanh 12/03/2021 luồng book VIN
          else if(this.roomtype.Supplier == "VINPEARL" 
          || this.roomtype.Supplier == "SMD" || this.roomtype.Supplier == "SERI" || se.Roomif.roomtype.Supplier == 'AGD'
          ){
            var totalPrice = se.priceshow.toString().replace(/\./g, '').replace(/\,/g, '')
                var url="";
                if (paymentType=='visa') {
                  url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=visa&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' +this.Roomif.phone + '&memberId=' + se.jti + '&TokenId='+se.tokenid+'&rememberToken='+se.isremember+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink';
                }
                else{
                  url  = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType='+paymentType+'&source=app&amount=' + totalPrice + '&orderCode=' + databook.code + '&buyerPhone=' + this.Roomif.phone + '&callbackUrl=https://ivivudownload.page.link/ivivuapp';
                }
                this.gf.CreateUrl(url).then(dataBuildLink => {
                  if (dataBuildLink.success) {
                    if (paymentType == 'visa') {
                      se.openWebpage(dataBuildLink.returnUrl);
                    }
                    else if (paymentType == 'payoo_store') {
                      this.Roomif.BillingCode = dataBuildLink.payooStoreData.BillingCode;
                      se.Roomif.PeriodPaymentDate = dataBuildLink.payooStoreData.periodPayment;
                      if (this.loader) {
                        this.loader.dismiss();
                      }
                      this.navCtrl.navigateForward('roompaymentpayoo/' + this.bookingCode + '/0');
                    }
                    else if (paymentType == 'payoo_qr') {
                      if (dataBuildLink.success) {
                        this.Roomif.qrimg = dataBuildLink.payooQrData.QRCodeUrl;
                        if (this.loader) {
                          this.loader.dismiss();
                        }
                        this.navCtrl.navigateForward('roompaymentpayoo/' + this.bookingCode + '/1');
                      }
                    }
                    else if (paymentType == 'momo') {
                      if (this.loader) {
                        this.loader.dismiss();
                      }
                      if (dataBuildLink.success) {
                        //se._windowmomo = window.open(dataBuildLink.returnUrl.payUrl, '_system');
                        Browser.open({url: dataBuildLink.returnUrl.payUrl});
                        this.setinterval();
                      }
                    }
                  }
                })
          }
          else{
            se.gf.checkroomEAN(this.bookingCode).then(data => {

              if (data == '0') {
                var totalPrice = se.priceshow.toString().replace(/\./g, '').replace(/\,/g, '')
                // var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=' + paymentType + '&source=app&amount=' + totalPrice + '&orderCode=' + databook.code + '&buyerPhone=' + this.Roomif.phone + '&callbackUrl=' + C.urls.baseUrl.urlPayment + '/Home/BlankapBlankDeepLinkpNew';
                var url="";
                if (paymentType=='visa') {
                  //url  = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType='+paymentType+'&source=app&amount=' + totalPrice + '&orderCode=' + databook.code + '&buyerPhone=' + this.Roomif.phone + '&callbackUrl=' + C.urls.baseUrl.urlPayment + '/Home/BlankappNew';
                  url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=visa&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' +this.Roomif.phone + '&memberId=' + se.jti + '&TokenId='+se.tokenid+'&rememberToken='+se.isremember+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink';
                }
                else{
                  url  = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType='+paymentType+'&source=app&amount=' + totalPrice + '&orderCode=' + databook.code + '&buyerPhone=' + this.Roomif.phone + '&callbackUrl=https://ivivudownload.page.link/ivivuapp';
                }
                this.gf.CreateUrl(url).then(dataBuildLink => {
                  if (dataBuildLink.success) {
                    if (paymentType == 'visa') {
                      se.openWebpage(dataBuildLink.returnUrl);
                    }
                    else if (paymentType == 'payoo_store') {
                      this.Roomif.BillingCode = dataBuildLink.payooStoreData.BillingCode;
                      se.Roomif.PeriodPaymentDate = dataBuildLink.payooStoreData.periodPayment;
                      if (this.loader) {
                        this.loader.dismiss();
                      }
                      this.navCtrl.navigateForward('roompaymentpayoo/' + this.bookingCode + '/0');
                    }
                    else if (paymentType == 'payoo_qr') {
                      if (dataBuildLink.success) {
                        this.Roomif.qrimg = dataBuildLink.payooQrData.QRCodeUrl;
                        if (this.loader) {
                          this.loader.dismiss();
                        }
                        this.navCtrl.navigateForward('roompaymentpayoo/' + this.bookingCode + '/1');
                      }
                    }
                    else if (paymentType == 'momo') {
                      if (this.loader) {
                        this.loader.dismiss();
                      }
                      if (dataBuildLink.success) {
                        //se._windowmomo = window.open(dataBuildLink.returnUrl.payUrl, '_system');
                        Browser.open({url: dataBuildLink.returnUrl.payUrl});
                        this.setinterval();
                      }
                    }
                  }
                })
              }
              else {
                if(se.loader){
                  se.loader.dismiss();
                }
                alert('Đã hết phòng, vui lòng chọn phòng khác');
                se.navCtrl.navigateBack('/hoteldetail/' + se.booking.HotelId);
              }
            })
          }
         
        }
        else {
          if(se.loader){
            se.loader.dismiss();
          }
          se.storage.get('jti').then((memberid) => {
            if(memberid){
              se.storage.get('deviceToken').then((devicetoken) => {
                if(devicetoken){
                  se.gf.refreshToken(memberid, devicetoken).then((token) =>{
                    setTimeout(()=>{
                      se.auth_token = token;
                    },100)
                  });
                }else{
                  se.showAlertMessage(databook.msg);
                }
              })
            }else{
              se.showAlertMessageOnly(databook.Msg);
            }
            
          })
        }
      }
      else {
        if(se.loader){
          se.loader.dismiss();
        }
        se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
      }
    })
  }
  async showAlertMessageOnly(msg){
    let alert = await this.alertCtrl.create({
      header: '',
      message: 'Mã đăng nhập đã hết hạn, vui lòng đăng nhập lại!',
      cssClass: "cls-alert-message",
      backdropDismiss: false,
      buttons: [
      {
        text: 'OK',
        role: 'OK',
        handler: () => {
          this.navCtrl.navigateForward('/login');
          alert.dismiss();
        }
      }
      ]
    });
    alert.present();
  }
  async showAlertMessage(msg){
    let alert = await this.alertCtrl.create({
      header: '',
      message: msg,
      cssClass: "cls-alert-message",
      backdropDismiss: false,
      buttons: [
      {
        text: 'OK',
        role: 'OK',
        handler: () => {
          this.navCtrl.navigateForward('/hoteldetail/' + this.booking.HotelId);
          alert.dismiss();
        }
      }
      ]
    });
    alert.present();
  }
  //Tạo booking phòng
  CreateBookingRoom(paymentMethod): Promise<any> {
    var Invoice = 0;
    this.jsonroom.RoomClasses=this.room;
    this.timestamp = Date.now();
    if (this.Roomif.order) {
      Invoice = 1;
    }
    let mealtype = this.jsonroom.RoomClasses[0].MealTypeRates[this.booking.indexmealtype];
    return new Promise((resolve, reject) => {
      let voucherSelectedMap = this._voucherService.voucherSelected.map(v => {
        let newitem = {};
        newitem["voucherCode"] = v.code;
        newitem["voucherName"] = v.rewardsItem.title;
        newitem["voucherType"] = v.applyFor || v.rewardsItem.rewardsType;
        newitem["voucherDiscount"] = v.rewardsItem.price;
        newitem["keepCurrentVoucher"] = false;
        return newitem;
      });
      let promoSelectedMap = this._voucherService.listObjectPromoCode.map(v => {
        let newitem = {};
        newitem["voucherCode"] = v.code;
        newitem["voucherName"] = v.name;
        newitem["voucherType"] = 2;
        newitem["voucherDiscount"] = v.price;
        newitem["keepCurrentVoucher"] = false;
        return newitem;
      });
      let checkpromocode = this._voucherService.voucherSelected && this._voucherService.voucherSelected.length ==0 && this._voucherService.listObjectPromoCode && this._voucherService.listObjectPromoCode.length ==0;
      let arrpromocode = this.Roomif.promocode ?[{"voucherCode": this.Roomif.promocode, "voucherName": this.Roomif.promocode,"voucherType": 1,"voucherDiscount": this.Roomif.priceshow ,"keepCurrentVoucher": false  }] : [];
  
      let body =
      {
        RoomClassObj: this.jsonroom.RoomClasses[0].ListObjRoomClass,
        CName: this.Roomif.hoten,
        CEmail: this.booking.CEmail,
        CPhone: this.Roomif.phone,
        timestamp: this.timestamp,
        HotelID: this.booking.HotelId,
        paymentMethod: paymentMethod,
        note: this.Roomif.notetotal,
        Source: '6',
        MemberToken: this.auth_token,
        Customers: this.Roomif.arrcustomer,
        UsePointPrice: this.Roomif.pricepoint,
        NoteCorp: this.Roomif.order,
        Invoice: Invoice,
        UserPoints: this.Roomif.point,
        CheckInDate: this.jsonroom.CheckInDate,
        CheckOutDate: this.jsonroom.CheckOutDate,
        TotalNight: this.jsonroom.TotalNight,
        MealTypeIndex: this.booking.indexmealtype,
        CompanyName: this.Roomif.companyname,
        CompanyAddress: this.Roomif.address,
        CompanyTaxCode: this.Roomif.tax,
        BillingAddress: this.Roomif.addressorder,
        //promotionCode: this.Roomif.promocode,
        vouchers : !checkpromocode ? [...voucherSelectedMap,...promoSelectedMap] : arrpromocode,
        comboid: this.bookCombo.ComboId,
        PenaltyDescription: this.Roomif.textcancel,
        companycontactname: this.Roomif.nameOrder
      };
      let headers = {
        'content-type': 'application/json'
      };
    let strUrl = C.urls.baseUrl.urlPost + '/mInsertBooking';
    this.gf.RequestApi('POST', strUrl, headers, body, 'roompaymentselect-eans', 'CreateBookingRoom').then((data)=>{
        if (data) {
          this.Roomif.bookingCode = data.code;
          resolve(data);
        }
      });
    });
  }
  //check Payment
  checkPayment() {
    var se = this;
    // var options = {
    //   method: 'GET',
    //   url: C.urls.baseUrl.urlPost + '/mCheckBooking',
    //   qs: { code: se.bookingCode},
    //   headers:
    //   {
    //   }
    // };
    let headers = {};
    let strUrl = C.urls.baseUrl.urlPost + '/mCheckBooking?code=' + se.bookingCode;
    this.gf.RequestApi('GET', strUrl, headers, {}, 'roompaymentselect-eans', 'mCheckBooking').then((data)=>{
      if (data) {
        var rs = data;
        if (rs.StatusBooking == 3) {
          se.sttbooking=3;
          se.Roomif.priceshowtt = se.priceshow;
          clearInterval(se.intervalID);
          if (se.loader) {
            se.loader.dismiss();
          }
          Browser.close();
          se.navCtrl.navigateForward('/roompaymentdoneean/' + rs.BookingCode + '/' + se.priceshow + '/0');
          // se.navCtrl.push('HoteldetailPage', value);
        }
        else if(rs.StatusBooking == 9||rs.StatusBooking == 2)
        {
          if (se.loader) {
            se.loader.dismiss();
          }
          clearInterval(se.intervalID);
          Browser.close();
          if (se.Roomif.point && se.bookingCode) {
               
            se.Roomif.bookingCode=se.bookingCode;
            se.showInfo("Điểm tích luỹ "+se.Roomif.point+" đã được dùng cho booking "+se.bookingCode+".Xin vui lòng thao tác lại booking!")
            
           
          }
          //  se._voucherService.hotelPromoCode ="ttkkm45";
          if (se._voucherService.hotelPromoCode && se.bookingCode) {
            // se.gf.showAlertMessageOnly("Mã giảm giá "+se._voucherService.hotelPromoCode+" đã được dùng cho booking "+se.bookingCode+".Xin vui lòng thao tác lại booking!");
            se.Roomif.bookingCode=se.bookingCode
            se.showInfo("Mã giảm giá "+se._voucherService.hotelPromoCode+" đã được dùng cho booking "+se.bookingCode+".Xin vui lòng thao tác lại booking!")
            // se._voucherService.hotelPromoCode="";
           
          }
        }
      }
      else {
        // error.page = "roompaymentselect";
        // error.func = "openWebpage";
        // error.param = JSON.stringify(options);
        // C.writeErrorLog(error, response);
        se.loader.dismiss();
        se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
      }

    });
  }
  next() {
    this.CreateBooking('visa');
  }
  chooseacc(item) {
    this.tokenid = item.id;
    this.isbtn = true;
    this.isdisable=true;
    this.isremember=true;
  }
  nochooseacc() {
    this.tokenid = "";
    this.isbtn = true;
    this.isdisable=false;
    this.isremember=true;
  }
  setinterval() {
    clearInterval(this.intervalID);
    this.intervalID = setInterval(() => {
      this.checkPayment();
    }, 1000 * 1);
    setTimeout(() => {
      clearInterval(this.intervalID);
    }, 60000 * 15);
  }
  rememberCard(){
    this.isremember=!this.isremember
  }

  paymentbiztravel(){
    if(this.bizTravelService.bizAccount.balanceAvaiable - this.totalPrice*1<=0){
      return;
    }
    this.gf.showLoading();
    this.storage.get('auth_token').then(auth_token => {
      if(auth_token){
        var text = "Bearer " + auth_token;
        var  headers =
        {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        }
        var params = {memberid: this.jti, totalprice: this.priceshow.toString().replace(/\./g, '').replace(/\,/g, '') };
        this.gf.checkAcceptBizCredit('POST', C.urls.baseUrl.urlMobile + '/api/Dashboard/CheckAcceptBizCredit', headers, params, 'companyinfo', 'GetBizTransactions').then((data) => {
          if(data && data.error == 0){
            this.bizTravelService.phoneOtp = data.phoneOtp;
            this.bizTravelService.phoneOtpShort = data.phoneOtpShort;
            this.bizTravelService.paymentType = 2;
            this.roomPayment();
          }else{
            this.gf.hideLoading();
            this.gf.showToastWarning('Account hiện tại không có quyền thanh toán. Vui lòng kiểm tra lại.');
          }
        })
      }else{
        this.gf.hideLoading();
      }
     
    })
  }

  roomPayment(){
    let se = this;
      var url="";
        se.CreateBookingRoom('companycredit').then(databook => {
          if (databook) {
            if (databook.error == 0) {
              se.bookingCode = databook.code;
              se.Roomif.bookingCode = databook.code;
              if (se.Roomif.notetotal) {
                se.gf.CreateSupportRequest(databook.code,se.booking.CEmail,se.Roomif.hoten,se.Roomif.phone,se.Roomif.notetotal);
              }
              var totalPrice = se.priceshow.toString().replace(/\./g, '').replace(/\,/g, '');
              url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=companycredit&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' +se.Roomif.phone + '&memberId=' + se.jti +'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink';
              
              se.gf.CreateUrl(url).then(dataBuildLink => {
                se.gf.hideLoading();
                if (dataBuildLink.success) {
                  se.bizTravelService.routeBackWhenCancel = 'roomdetailreview';
                  se.bizTravelService.mytripPaymentBookingCode = se.bookingCode;
                  se.navCtrl.navigateForward('confirmpayment');
                }else{
                  se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
                }
              })
            }
            else {
              se.gf.hideLoading();
              // alert(databook.Msg );
              // if(se.Roomif.point &&  se.Roomif.bookingCode)
              // {
              //   se.navCtrl.navigateBack('/roomdetailreview');
              // }
              // if(se._voucherService.hotelPromoCode &&  se.Roomif.bookingCode)
              // {
              //   se.navCtrl.navigateBack('/roomdetailreview');
              // }
              se.storage.get('jti').then((memberid) => {
                if(memberid){
                  se.storage.get('deviceToken').then((devicetoken) => {
                    if(devicetoken){
                      se.gf.refreshToken(memberid, devicetoken).then((token) =>{
                        setTimeout(()=>{
                          se.auth_token = token;
                        },100)
                      });
                    }else{
                      se.showAlertMessageOnly(databook.Msg);
                    }
                  })
                }else{
                  se.showAlertMessageOnly(databook.Msg);
                }
                
              })
            }
          }
          else {
            se.gf.hideLoading();
            se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
          }
        })
       
  }
  async showInfo(msg) {
    let alert = await this.alertCtrl.create({
      header: "Thông báo",
      message: msg,
      buttons: [{
        text: 'OK',
        role: 'OK',
        handler: () => {
          alert.dismiss();
          this.Roomif.promocode="";
          this.navCtrl.navigateForward('/roomdetailreview');
        }
      }
      ]
    });
    alert.present();
  }
  checkDk(){
    this.ischeckedDK=!this.ischeckedDK;
  }
  async openWebpageDK(url: string) {
    await Browser.open({ url: url});

  }
  flightbuynowpaylater() {
    this.presentLoading();
    this.continueBook('bnpl');
  }
}

