import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import {  RoomInfo } from '../providers/book-service';

import { C } from '../providers/constants';
import { Storage } from '@ionic/storage';
import { GlobalFunction } from '../providers/globalfunction';
import * as moment from 'moment';
import { ActivityService } from './../providers/globalfunction';
import { BizTravelService } from '../providers/bizTravelService';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-mytripaymentflightcombo',
  templateUrl: './mytripaymentflightcombo.page.html',
  styleUrls: ['./mytripaymentflightcombo.page.scss'],
})
export class MytripaymentflightcomboPage implements OnInit {
  departTimeStr; returnTimeStr; airlineCodedep; airlineCoderet; arrchild; textage = ""; children; timestamp;
  public loader: any; ischeckpaymentCard; ischeckpaymentLater; titlecombo; jti;
  scheckvisa = false; returnUrl; arrbankrmb:any = []; tokenid; startDate; endDate; ischeckpay = true; isbtn = false; ischeckvisa = false;
  intervalID: any; ischeckTransaction = false;
  isremember=true;isdisable=false;Name;
  cin; cout;
  roomnumber; breakfast; PriceAvgPlusTAStr;priceshow;totalPaxStr;
  auth_token: any = '';  bookingCode = "";cus_phone="";
  _windowmomo: any;
  totalPrice: any;
  ischeckedDK=true;
  constructor(public navCtrl: NavController, public activityService: ActivityService, public loadingCtrl: LoadingController,public storage: Storage,public gf: GlobalFunction,public Roomif: RoomInfo,
    public bizTravelService: BizTravelService) { 
    this.titlecombo=this.activityService.objPaymentMytrip.trip.combo_name;
    this.cin=moment(this.activityService.objPaymentMytrip.trip.checkInDate).format('DD-MM-YYYY');
    this.cout=moment(this.activityService.objPaymentMytrip.trip.checkOutDate).format('DD-MM-YYYY');
    this.Name=this.activityService.objPaymentMytrip.trip.hotel_name;
    this.priceshow=this.activityService.objPaymentMytrip.trip.priceShow;
    this.cus_phone=this.activityService.objPaymentMytrip.trip.cus_phone;
    this.bookingCode=this.activityService.objPaymentMytrip.trip.booking_id;
    this.totalPaxStr=this.activityService.objPaymentMytrip.trip.totalPaxStr;
    this.roomnumber=this.activityService.objPaymentMytrip.trip.room_count;
    this.totalPrice = this.priceshow.toString().replace(/\./g, '').replace(/\,/g, '');
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
        this.GeTokensOfMember(0);
      }
    })
  }
  
  ngOnInit() {
  }
  goback() {
    clearInterval(this.intervalID);
    this.navCtrl.back();
  }
  roompaymentatm() {
    this.Roomif.point='';
    this.gf.CheckPaymentDate(this.bookingCode).then(data => {
      // this.presentLoading();
      var timestamp = new Date();
      var temptime = timestamp.setTime(timestamp.getTime() + 15 * 60 * 1000);
      var paymentTime = moment(temptime).format('YYYYMMDDHHmmss');
      var paymentDate = moment(data.booking.DeliveryPaymentDate).format('YYYYMMDDHHmmss');
      if (paymentTime < paymentDate) {
        this.navCtrl.navigateForward("/roomchoosebank/1");
      }
      else{
        this.goMytrip();
      }
    })
  }
  roompaymentvisa() {
    if (this.arrbankrmb.length==0) {
      this.GeTokensOfMember(1);
    }
  }
  roompaymentpayooqr() {
    this.buildLink('payoo_qr');
  }
  roompaymentmomo() {
    this.buildLink('momo');
  }
  async openWebpage(url: string) {
    var se = this;
    
    await Browser.open({ url: url});

    Browser.addListener('browserFinished', () => {
      if (se.loader) {
        se.loader.dismiss();
      }
    })
    clearInterval(se.intervalID);
    this.intervalID = setInterval(() => {
      this.checkPayment();
    }, 1000 * 1);
    setTimeout(() => {
      clearInterval(this.intervalID);
    }, 60000 * 15);
  }
  setinterval()
  {
    clearInterval(this.intervalID);
    this.intervalID = setInterval(() => {
      this.checkPayment();
    }, 1000 * 1);
    setTimeout(() => {
      clearInterval(this.intervalID);
    }, 60000 * 15);
  }
  checkPayment() {
    var se = this;
    // var options = {
    //   method: 'GET',
    //   url: C.urls.baseUrl.urlPost + '/mCheckBooking',
    //   qs: { code:  this.bookingCode },
    //   headers:
    //   {
    //   }
    // };

    let urlPath = C.urls.baseUrl.urlPost + '/mCheckBooking?code='+this.bookingCode;
        let headers = {};
        this.gf.RequestApi('GET', urlPath, headers, { }, 'MytripPaymentFlightCombo', 'checkPayment').then((data)=>{

      if (data) {
        var rs = data;
        if (rs.StatusBooking == 3) {
          var id = rs.BookingCode;
          var total = se.priceshow;
          se.Roomif.priceshowtt = se.priceshow;
          var ischeck = '0'
          clearInterval(se.intervalID);
          Browser.close();
          if (se._windowmomo) {
            se._windowmomo.close();
          }
          if(se.loader){
            se.loader.dismiss();
          }
          se.navCtrl.navigateForward('/roompaymentdoneean/' + id + '/' + total + '/' + ischeck);
        }
        else if(rs.StatusBooking == 9||rs.StatusBooking == 2)
        {
          if(se.loader){
            se.loader.dismiss();
          }
          Browser.close();
          if (se._windowmomo) {
            se._windowmomo.close();
          }
          clearInterval(se.intervalID);
        }
      }
      else {
        se.loader.dismiss();
        se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
      }
    });
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
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
            this.isdisable = true;
            this.isbtn = true;
            this.ischeckvisa = true;
          }
        }
      }
      if (stt == 1) {
        if (this.arrbankrmb.length > 0) {
          this.ischeckvisa = true;
        } else {
          //this.presentLoading();
          this.buildLink('visa');
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
  buildLink(paymentType)
  {
    this.presentLoading();
    var se=this;
    var url="";
    var totalPrice=se.priceshow.toString().replace(/\./g, '').replace(/\,/g, '');
    this.gf.CheckPaymentDate(this.bookingCode).then(data => {
      var timestamp = new Date();
      var temptime = timestamp.setTime(timestamp.getTime() + 15 * 60 * 1000);
      var paymentTime = moment(temptime).format('YYYYMMDDHHmmss');
      var paymentDate = moment(data.booking.DeliveryPaymentDate).format('YYYYMMDDHHmmss');
      if (paymentTime < paymentDate) {
        if (paymentType=='visa') {
          url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=visa&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' +this.cus_phone + '&memberId=' + se.jti + '&TokenId='+se.tokenid+'&rememberToken='+se.isremember+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink';
        }
        else if (paymentType=='bnpl') {
          url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=bnpl&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' +se.cus_phone + '&memberId=' + se.jti + '&TokenId='+se.tokenid+'&rememberToken='+se.isremember+'&BankId=bnpl'+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink';
        }
        else{
          url  = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType='+paymentType+'&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' + this.cus_phone + '&callbackUrl=https://ivivudownload.page.link/ivivuapp';
        }
        this.gf.CreateUrl(url).then(dataBuildLink => {
          if (dataBuildLink.success) {
            if (paymentType=='visa' || paymentType=='bnpl') {
              se.openWebpage(dataBuildLink.returnUrl);
            }
            else if(paymentType=='payoo_qr'){
              if (dataBuildLink.success) {
                this.Roomif.qrimg = dataBuildLink.payooQrData.QRCodeUrl;
                if (this.loader) {
                  this.loader.dismiss();
                }
                this.Roomif.roomtype="";
                this.Roomif.priceshow=this.priceshow;
                this.navCtrl.navigateForward('roompaymentpayoo/' + this.bookingCode + '/1');
              }
            }
            else if(paymentType=='momo'){
              if (dataBuildLink.success) {
                if (this.loader) {
                  this.loader.dismiss();
                }
                //this._windowmomo=window.open(dataBuildLink.returnUrl.payUrl, '_system');
                Browser.open({url : dataBuildLink.returnUrl.payUrl});
                this.setinterval();
              }
            }
          }
        })
      }
      else{
        if (this.loader) {
          this.loader.dismiss();
        }
        this.goMytrip();
      }
    })
  }
  next() {
    this.buildLink('visa');
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
  rememberCard(){
    this.isremember=!this.isremember
  }
  goMytrip(){
    this.gf.showAlertMessageOnly("Booking đã hết hạn thanh toán!");
    clearInterval(this.intervalID);
    this.navCtrl.back();
  }


  paymentbiztravel(){
    if(this.bizTravelService.bizAccount.balanceAvaiable - this.totalPrice <=0){
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
        var params = {memberid: this.jti, totalprice: this.totalPrice };
        this.gf.showLoading();
        this.gf.checkAcceptBizCredit('POST', C.urls.baseUrl.urlMobile + '/api/Dashboard/CheckAcceptBizCredit', headers, params, 'companyinfo', 'GetBizTransactions').then((data) => {
          if(data && data.error == 0){
            this.bizTravelService.phoneOtp = data.phoneOtp;
            this.bizTravelService.phoneOtpShort = data.phoneOtpShort;
            this.bizTravelService.paymentType = 4;
            this.flightComboPayment();
          }else{
            this.gf.showToastWarning('Account hiện tại không có quyền thanh toán. Vui lòng kiểm tra lại.');
          }
        })
      }else{

      }
     
    })
  }

  flightComboPayment(){
    var se =this;
      se.gf.CheckPaymentDate(this.bookingCode).then(data => {
          var timestamp = new Date();
          var temptime = timestamp.setTime(timestamp.getTime() + 15 * 60 * 1000);
          var paymentTime = moment(temptime).format('YYYYMMDDHHmmss');
          var paymentDate = moment(data.booking.DeliveryPaymentDate).format('YYYYMMDDHHmmss');
          if (paymentTime < paymentDate) {
            se.buildLinkPayment().then((checkvalid) => {
              if(checkvalid){
                se.bizTravelService.routeBackWhenCancel = 'mybooking';
                se.bizTravelService.mytripPaymentBookingCode = se.bookingCode;
                se.navCtrl.navigateForward('confirmpayment');
              }
            })
          }else{

          }
        })
  }

  buildLinkPayment(): Promise<any>{
    let se = this;
    return new Promise((resolve, reject) => {
    let url;
      url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=companycredit&source=app&amount=' + se.totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' +se.cus_phone + '&memberId=' + se.jti +'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink';
      se.gf.CreateUrl(url).then(dataBuildLink => {
        if (dataBuildLink.success) {
          se.gf.hideLoading();
          resolve(true);
        }else{
          se.gf.hideLoading();
          resolve(false);
        }
      })
    })
  }
  checkDk(){
    this.ischeckedDK=!this.ischeckedDK;
  }
  async openWebpageDK(url: string) {
    await Browser.open({ url: url});

  }

  flightbuynowpaylater(){
    this.buildLink('bnpl');
  }
}
