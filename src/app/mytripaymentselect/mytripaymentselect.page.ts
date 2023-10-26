import { Component, NgZone, OnInit } from '@angular/core';
import { ActivityService } from './../providers/globalfunction';
import { NavController, LoadingController } from '@ionic/angular';
import { C } from '../providers/constants';

import * as moment from 'moment';
import { GlobalFunction } from '../providers/globalfunction';
import { Storage } from '@ionic/storage';
import { RoomInfo } from '../providers/book-service';
import { MytripService } from '../providers/mytrip-service.service';
import { ActivatedRoute } from '@angular/router';
import { BizTravelService } from '../providers/bizTravelService';
import { Browser } from '@capacitor/browser';


@Component({
  selector: 'app-mytripaymentselect',
  templateUrl: './mytripaymentselect.page.html',
  styleUrls: ['./mytripaymentselect.page.scss'],
})
export class MytripaymentselectPage implements OnInit {
  objbook; intervalID: NodeJS.Timeout; browser; public loader: any
  Avatar; Name; Address; cin; cout; dur; room; nameroom; jsonroom;arrchild;
  roomnumber; adults=2; children=0; breakfast; PriceAvgPlusTAStr;priceshow;totalPaxStr;
  auth_token: any = '';  bookingCode = ""; jti; arrbankrmb:any = []; tokenid; isbtn = false;
  isremember=true;totalPrice: any;
;ischeckvisa = false;cus_phone="";isdisable=false;
  _windowmomo: any;stt
  ischeckedDK=true;
  constructor(public navCtrl: NavController, public activityService: ActivityService, public loadingCtrl: LoadingController,public storage: Storage,public gf: GlobalFunction,public Roomif: RoomInfo,
    public _mytripservice: MytripService,private activatedRoute: ActivatedRoute,
    public bizTravelService: BizTravelService,
    private zone: NgZone) { 
    this.Avatar=this.activityService.objPaymentMytrip.trip.avatar;
    this.Avatar = (this.Avatar.toLocaleString().trim().indexOf("http") != -1) ? this.Avatar : 'https:' + this.Avatar;
    this.Name=this.activityService.objPaymentMytrip.trip.hotel_name;
    this.Address=this.activityService.objPaymentMytrip.trip.address;
    this.cin=moment(this.activityService.objPaymentMytrip.trip.checkInDate).format('DD-MM-YYYY');
    this.cout=moment(this.activityService.objPaymentMytrip.trip.checkOutDate).format('DD-MM-YYYY');
    var datecinRQ = new Date(this.activityService.objPaymentMytrip.trip.checkInDate);
    var datecoutRQ = new Date(this.activityService.objPaymentMytrip.trip.checkOutDate);
    this.dur = moment(datecoutRQ).diff(moment(datecinRQ), 'days');
    this.nameroom=this.activityService.objPaymentMytrip.trip.room_name;
    this.roomnumber=this.activityService.objPaymentMytrip.trip.room_count;
    this.totalPaxStr=this.activityService.objPaymentMytrip.trip.totalPaxStr;
    this.breakfast=this.activityService.objPaymentMytrip.trip.meal_plan;
    this.priceshow=this.activityService.objPaymentMytrip.trip.priceShow;
    this.cus_phone=this.activityService.objPaymentMytrip.trip.cus_phone;
    this.bookingCode=this.activityService.objPaymentMytrip.trip.booking_id;
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
        this.GeTokensOfMember(0);
      }
    })

    this.totalPrice = this.activityService.objPaymentMytrip.trip.priceShow.toString().replace(/\./g, '').replace(/\,/g, '');
    this.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
            let text = "Bearer " + auth_token;
            let headers =
                {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    authorization: text
                }

            this.gf.RequestApi('GET', C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo', headers, {}, 'flightpaymentselect', 'initpage').then((data)=>{
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
        
  }
  
  ngOnInit() {
    this.stt = this.activatedRoute.snapshot.paramMap.get('stt');
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
     if(se.loader){
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
    let urlPath = C.urls.baseUrl.urlPost + '/mCheckBooking?code=' +se.bookingCode;
        let headers = {};
        this.gf.RequestApi('GET', urlPath, headers, { }, 'MytripPaymentFlightSelect', 'checkPayment').then((data)=>{

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
            this.isdisable=true;
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
          url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=bnpl&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' +this.cus_phone + '&memberId=' + se.jti + '&TokenId='+se.tokenid+'&rememberToken='+se.isremember+'&BankId=bnpl'+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink';
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
                this._windowmomo=window.open(dataBuildLink.returnUrl.payUrl, '_system');
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
  roompaymentbank(){
    this.navCtrl.navigateForward("/mytrippaymentbank");
  }

  paymentbiztravel(){
    if(this.bizTravelService.bizAccount.balanceAvaiable - this.totalPrice*1<=0){
      return;
    }
    this.gf.showLoading();
    this.gf.CheckPaymentDate(this.bookingCode).then(data => {

      var timestamp = new Date();
      var temptime = timestamp.setTime(timestamp.getTime() + 15 * 60 * 1000);
      var paymentTime = moment(temptime).format('YYYYMMDDHHmmss');
      var paymentDate = moment(data.booking.DeliveryPaymentDate).format('YYYYMMDDHHmmss');
      if (paymentTime < paymentDate) {
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
                this.bizTravelService.paymentType = 4;
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
      }else{
        this.gf.hideLoading();
        this.goMytrip();
      }
    })
  }

  roomPayment(){
    let se = this;
      var url="";
       
              var totalPrice = se.priceshow.toString().replace(/\./g, '').replace(/\,/g, '');
              url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=companycredit&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' +this.cus_phone + '&memberId=' + se.jti +'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink';
              se.gf.CreateUrl(url).then(dataBuildLink => {
                se.gf.hideLoading();
                if (dataBuildLink.success) {
                  se.bizTravelService.routeBackWhenCancel = 'mybooking';
                  se.bizTravelService.mytripPaymentBookingCode = se.bookingCode;
                  se.navCtrl.navigateForward('confirmpayment');
                }else{
                  se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
                }
              })
         
       
  }
  checkDk(){
    this.ischeckedDK=!this.ischeckedDK;
  }
  async openWebpageDK(url: string) {
    var se = this;
    await Browser.open({ url: url});

  }
  
  flightbuynowpaylater(){
    this.buildLink('bnpl');
   }
}

