import { Bookcombo } from './../providers/book-service';
import { Booking, RoomInfo, SearchHotel } from '../providers/book-service';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform,AlertController } from '@ionic/angular';
import { C } from '../providers/constants';

import { Storage } from '@ionic/storage';
import { GlobalFunction } from '../providers/globalfunction';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from './../providers/globalfunction';
import { voucherService } from '../providers/voucherService';
import { Browser } from '@capacitor/browser';

/**
 * Generated class for the RoomchoosebankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-roomchoosebank',
  templateUrl: 'roomchoosebank.html',
  styleUrls: ['roomchoosebank.scss'],
})
export class RoomchoosebankPage implements OnInit {
  ischeck; timestamp; public ischeckbox;
  Avatar; Name; Address; cin; cout; dur; room; nameroom; jsonroom; ischecktext = true
  roomnumber; adults; children; breakfast; PriceAvgPlusTAStr; priceshow
  imgroom; roomtype; indexme; indexroom; cin1; cout1; checkpayment; book; id; pricetemp; hotelid
  public loader: any
  auth_token: any = '';arrbankrmb:any=[];totalPrice=0;bookingCode;isckb = false; TokenId;bankid="";jti;intervalID: NodeJS.Timeout;
  stt;isremember=true;isdisable=false;isshowRemember=false;
  sttbooking=0;
  ischeckedDK=true;
  constructor(public navCtrl: NavController, private toastCtrl: ToastController, public booking: Booking,
    public Roomif: RoomInfo, public storage: Storage, public zone: NgZone, public searchhotel: SearchHotel,
    public loadingCtrl: LoadingController, public platform: Platform, public gf: GlobalFunction,public bookCombo:Bookcombo,
    private activatedRoute: ActivatedRoute,public activityService: ActivityService,public alertCtrl: AlertController,
    public _voucherService: voucherService) {
    //google analytic
    //gf.googleAnalytion('roomchoosebank', 'load', '');
    this.searchhotel.paymentType = 'atm';
    this.gf.logEventFirebase('atm',this.searchhotel, 'roompaymentatm', 'add_payment_info', 'Hotels');
  }
  ngOnInit() {
    this.stt = this.activatedRoute.snapshot.paramMap.get('stt');
    if (this.stt==0) {
      this.bookingCode=this.bookingCode?this.bookingCode:this.Roomif.bookingCode;
      this.indexme = this.booking.indexmealtype;
      this.indexroom = this.booking.indexroom;
      this.jsonroom = this.Roomif.jsonroom;
      this.room = this.Roomif.arrroom;
      this.searchhotel.rootPage = "roomchoosebank";
      this.roomtype = this.Roomif.roomtype;
      this.PriceAvgPlusTAStr = this.roomtype.PriceAvgPlusTAStr;
      if (this.Roomif.priceshow) {
        this.priceshow = this.Roomif.priceshow;
      }
      else {
        this.priceshow = this.PriceAvgPlusTAStr;
      }
    } else {
      this.Roomif.phone=this.activityService.objPaymentMytrip.trip.cus_phone;
      this.bookingCode=this.activityService.objPaymentMytrip.trip.booking_id;
      this.priceshow=this.activityService.objPaymentMytrip.trip.priceShow;
    }
    this.totalPrice=this.priceshow.toString().replace(/\./g, '').replace(/\,/g, '');
  }
  ionViewWillEnter() {
    
    this.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
            let text = "Bearer " + auth_token;
            let headers =
                {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    authorization: text
                }

            this.gf.RequestApi('GET', C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo', headers, {}, 'flightcombopaymentselect', 'initpage').then((data)=>{
              if(data && data.statusCode == 401){
                this.storage.get('jti').then((memberid) => {
                  this.storage.get('deviceToken').then((devicetoken) => {
                    this.gf.refreshToken(memberid, devicetoken).then((token) => {
                      if(token){
                        this.auth_token = token;
                      }
                    });
    
                  })
                })
              }else{
                this.auth_token = auth_token;
              }
            })
          }
        });
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
        this.isshowRemember=true;
        this.isremember=false;
        this.GeTokensOfMember();
      }
    })
  }
  next() {
    this.TokenId="";
    this.bankid="";
    this.arrbankrmb.forEach(element => {
      if (element.checked) {
        this.TokenId=element.id;
        this.bankid=element.vpc_Card;
      }
    });
    let _id = this.TokenId ? this.bankid : this.id;
    if(!this.TokenId && !this.id){
      this.presentToast();
      return;
    }
    this.presentLoading();
    if(this.roomtype && this.roomtype.Supplier == 'SERI'){
      //Check allotment trước khi book
      this.gf.checkAllotmentSeri(
        this.booking.HotelId,
        this.Roomif.RoomId,
        this.booking.CheckInDate,
        this.booking.CheckOutDate,
        this.Roomif.roomnumber,
        'SERI', this.Roomif.roomtype.HotelCheckDetailTokenInternal
        ).then((allow)=> {
          if(allow){
            //this.CreateUrlOnePay(_id);
            if (this.bookingCode) {
                  this.CreateUrlOnePay(_id);
                } else {
                  this.CreateBookingRoom(_id);
                } 
          }else{
            if (this.loader) {
              this.loader.dismiss();
            }
            this.gf.showToastWarning('Hiện tại khách sạn đã hết phòng loại này.');
          }
        })
    }else{
      if (this.bookingCode) {
        this.CreateUrlOnePay(_id);
      } else {
        this.CreateBookingRoom(_id);
      } 
    }
    // if (this.TokenId) {
    //   this.presentLoading();
    //   if (this.bookingCode) {
    //     this.CreateUrlOnePay(this.bankid);
    //   } else {
    //     this.CreateBookingRoom(this.bankid);
    //   } 
    // }
    // else{
    //   if (this.id) {
    //     this.presentLoading();
    //     if (this.bookingCode) {
    //       this.CreateUrlOnePay(this.id);
    //     } else {
    //       this.CreateBookingRoom(this.id);
    //     } 
    //   } else {
    //     this.presentToast();
    //   }
    // }


  }
 
  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: "Xin chọn 1 ngân hàng",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async openWebpage(url: string) {
    var se = this;
    await Browser.open({ url: url});

    Browser.addListener('browserFinished', () => {
      if(se.loader){
       se.loader.dismiss();
      }
      if (se.Roomif.point && se.bookingCode && se.sttbooking==0) {
       se.showInfo("Điểm tích luỹ "+se.Roomif.point+" đã được dùng cho booking "+se.bookingCode+".Xin vui lòng thao tác lại booking!")
     }
     //  se.Roomif.promocode ="ttkkm45";
     if (se.Roomif.promocode && se.bookingCode && se.sttbooking==0) {
       se.showInfo("Mã giảm giá "+se.Roomif.promocode+" đã được dùng cho booking "+se.bookingCode+".Xin vui lòng thao tác lại booking!")   
     }
     })
    //se._inAppBrowser = se.iab.open(url, '_self', "zoom=no; location=yes; toolbar=yes; hideurlbar=yes; closebuttoncaption=Đóng");
    clearInterval(se.intervalID);
    se.intervalID = setInterval(() => {
      se.checkPayment();
    }, 1000 * 1);
    setTimeout(() => {
      clearInterval(se.intervalID);
    }, 60000 * 15);
   
  }

  clickitem(id) {
    this.zone.run(() => {
      this.id = id;
      this.TokenId="";
      this.isdisable=false;
      this.arrbankrmb.forEach(element => {
        element.checked =false;
      });
    })
  }
  ionViewDidLoad() {
    // this.navBar.backButtonClick = (e: UIEvent) => {
    //   // todo something
    //   //this.navCtrl.push("RoomadddetailsPage");
    //   if (this.book) {
    //     if (this.book.code) {
    //       this.clearClonePage('page-hoteldetail');
    //       clearInterval(this.Roomif.setInter);
    //       this.searchhotel.rootPage = "roompaymentselect";
    //       this.navCtrl.navigateForward("HoteldetailPage");
    //     }
    //     else {
    //       this.navCtrl.pop();
    //     }
    //   }
    //   else {
    //     this.navCtrl.pop();
    //   }

  }
  edit() {
    this.zone.run(() => {
      if (this.ischeck) {
        this.ischecktext = true;
      } else {
        this.ischecktext = false;
      }
    })
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }
  goback() {
    if((this.Roomif.point && this.Roomif.bookingCode) || (this.Roomif.promocode && this.Roomif.bookingCode))
    {
      this.navCtrl.navigateBack('/roomdetailreview');
    }else{
      this.navCtrl.back();
    }
  }
  async presentToastr(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  checkacc(item,ev)
  {
    var se = this;
    if(ev.target.checked){
      se.arrbankrmb.forEach(element => {
        element.checked = false;
      });
      item.checked = true;
      this.isdisable=true;
      this.isremember=true;
      this.id="";
    }
    else{
      item.checked = false;
      ev.target.checked = false;
      ev.target.classList.remove("radio-checked");
    }
  
  }
  CreateUrlOnePay(bankid) {
    var se = this;
    // var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=atm&source=app&amount=' + this.totalPrice + '&orderCode=' + this.bookingCode + '&buyerPhone=' + this.Roomif.phone + '&callbackUrl=' + C.urls.baseUrl.urlPayment + '/Home/BlankappNew';
    se.gf.CheckPaymentDate(se.bookingCode).then(data => {
      var timestamp=new Date();
      var temptime = timestamp.setTime(timestamp.getTime() + 15 * 60 * 1000);
      var paymentTime=moment(temptime).format('YYYYMMDDHHmmss');
      var paymentDate=moment(data.booking.DeliveryPaymentDate).format('YYYYMMDDHHmmss');
      if (paymentTime < paymentDate) {
        var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=atm&source=app&amount=' + se.totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' + se.Roomif.phone + '&memberId=' + se.jti + '&BankId=' + bankid + '&TokenId=' + se.TokenId + '&rememberToken='+se.isremember+'&callbackUrl='+C.urls.baseUrl.urlPayment+'/Home/BlankDeepLink'
        this.gf.CreateUrl(url).then(datapayoo => {
          if (datapayoo) {
            if( se.loader){
              se.loader.dismiss();
            }
            se.openWebpage(datapayoo.returnUrl);
          } else {
            if(se.loader){
              se.loader.dismiss();
            }
          }
        
        })
      }
      else{
        if(se.loader){
          se.loader.dismiss();
        }
        if(se.stt==0){
          alert('Đã hết phòng, vui lòng chọn phòng khác');
          se.navCtrl.navigateBack('/hoteldetail/' + se.booking.HotelId);
        }else{
          se.gf.showAlertMessageOnly("Booking đã hết hạn thanh toán!");
          se.navCtrl.navigateBack(['/app/tabs/tab3']);
        }
 
      }
    })
  }
  //Tạo booking phòng
  CreateBookingRoom(bankid): Promise<any>{
    var Invoice = 0;
    var se=this;
    this.timestamp = Date.now();
    this.jsonroom.RoomClasses=this.room;
    if (this.Roomif.order) {
      Invoice = 1;
    }
    let mealtype = this.jsonroom.RoomClasses[0].MealTypeRates[this.booking.indexmealtype];
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

    return new Promise((resolve, reject) => {
      let body =
      {
        RoomClassObj: this.jsonroom.RoomClasses[0].ListObjRoomClass,
        CName: this.Roomif.hoten,
        CEmail: this.booking.CEmail,
        CPhone: this.Roomif.phone,
        timestamp: this.timestamp,
        HotelID: this.booking.HotelId,
        paymentMethod: "0",
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
        PenaltyDescription: this.Roomif.textcancel
      };
      let headers =
          {
            'content-type': 'application/json',
          };
        let strUrl = C.urls.baseUrl.urlPost + '/mInsertBooking';
        this.gf.RequestApi('POST', strUrl, headers, body, 'roomchoicebank', 'CreateBookingRoom').then((data)=>{
        if (data.error==0) {
          se.bookingCode = data.code;
          se.Roomif.bookingCode = data.code;
          if (se.roomtype.Supplier == 'EAN') {
            se.gf.checkroomEAN(se.bookingCode).then(data => {
              if (data == '0') {
                se.CreateUrlOnePay(bankid);
              }
              else{
                if(se.loader){
                  se.loader.dismiss();
                }
                alert('Đã hết phòng, vui lòng chọn phòng khác');
                if (se.Roomif.notetotal) {
                  se.gf.CreateSupportRequest(se.bookingCode,se.booking.CEmail,se.Roomif.hoten,se.Roomif.phone,se.Roomif.notetotal);
                }
                se.navCtrl.navigateBack('/hoteldetail/' + se.booking.HotelId);
              }
           })
          }
          else{
            se.CreateUrlOnePay(bankid);
          }
        }
        else{
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
                  se.showAlertMessage(data.msg);
                }
              })
            }else{
              se.showAlertMessageOnly(data.Msg);
            }
            
          })
          // alert(data.Msg);
          // if(se.Roomif.point &&  se.Roomif.bookingCode)
          // {
          //   se.navCtrl.navigateBack('/roomdetailreview');
          // }
        }
      });
    });
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
  
   //check Payment
   checkPayment(){
    var se = this;
    // var options = {
    //   method: 'GET',
    //   url: C.urls.baseUrl.urlPost + '/mCheckBooking',
    //   qs: { code: se.bookingCode },
    //   headers:
    //   {
    //   }
    // };
    let headers =
          {};
      let strUrl = C.urls.baseUrl.urlPost + '/mCheckBooking?code='+ se.bookingCode;
      this.gf.RequestApi('GET', strUrl, headers, {}, 'roomchoicebank', 'checkPayment').then((data)=>{
      if (data) {
        var rs = data;
        if (rs.StatusBooking == 3) {
          // var id = { BookingCode: rs.BookingCode, total: se.pricetemp,ischeck:'0' };
          se.sttbooking=3;
          var id = rs.BookingCode;
          var total = se.priceshow;
          se.Roomif.priceshowtt = se.priceshow;
          var ischeck = '0'
          Browser.close();
          clearInterval(se.intervalID);
          se.navCtrl.navigateForward('/roompaymentdoneean/' + id + '/' + total + '/' + ischeck);
          // clearInterval(se.Roomif.setInter);

        }
        else if(rs.StatusBooking == 9||rs.StatusBooking == 2)
        {
          clearInterval(se.intervalID);
          Browser.close();
          if (se.Roomif.point && se.bookingCode) {
            se.showInfo("Điểm tích luỹ "+se.Roomif.point+" đã được dùng cho booking "+se.bookingCode+".Xin vui lòng thao tác lại booking!")
          }
          if (se.Roomif.promocode && se.bookingCode) {  
            se.showInfo("Mã giảm giá "+se.Roomif.promocode+" đã được dùng cho booking "+se.bookingCode+".Xin vui lòng thao tác lại booking!")
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
  GeTokensOfMember() {
    var se = this;
    se.gf.GeTokensOfMember(se.jti).then(dataTokens => {
      if (dataTokens) {
        if (dataTokens.tokens.length > 0) {
          for (let i = 0; i < dataTokens.tokens.length; i++) {
            if (dataTokens.tokens[i].vpc_Card != 'VC' && dataTokens.tokens[i].vpc_Card != 'MC' && dataTokens.tokens[i].vpc_Card != 'JC' && dataTokens.tokens[i].vpc_Card != 'AE') {
              // this.TokenId = dataTokens.tokens[i].id;
              var vpc_CardNum = dataTokens.tokens[i].vpc_CardNum.split('xxx');
              vpc_CardNum = vpc_CardNum[1];
              var name_Bank=this.getnameBank(dataTokens.tokens[i].vpc_Card);
              var item = { id: dataTokens.tokens[i].id, imgbank: 'https://res.ivivu.com/payment/img/onepay/' + dataTokens.tokens[i].vpc_Card + '.png', vpc_CardNum: vpc_CardNum, name_Bank:name_Bank,checked:false,vpc_Card:dataTokens.tokens[i].vpc_Card};
              this.arrbankrmb.push(item);
            }
          }
          if ( this.arrbankrmb.length>0) {
            this.arrbankrmb[0].checked=true;
            this.isdisable=true;
            this.TokenId= this.arrbankrmb[0].id;
          }
        
          // item = { id: '999', imgbank: 'https://res.ivivu.com/payment/img/onepay/' + dataTokens.tokens[0].vpc_Card + '.png', vpc_CardNum: vpc_CardNum, name_Bank:name_Bank,checked:false};
          // this.arrbankrmb.push(item);
        }
      
      }
    })
  }
  getnameBank(text) {
    var cardStr="";
    switch (text) {
      case "970436":
        cardStr = "VietcomBank";
        break;
      case "970412":
        cardStr = "VRBank";
        break;
      case "970407":
        cardStr = "TechcomBank";
        break;
      case "970423":
        cardStr = "TienPhongBank";
        break;
      case "970415":
        cardStr = "ViettinBank";
        break;
      case "970441":
        cardStr = "VIB";
        break;
      case "970406":
        cardStr = "DongABank";
        break;
      case "970437":
        cardStr = "HDBank";
        break;
      case "970422":
        cardStr = "MB";
        break;
      case "970427":
        cardStr = "VietABank";
        break;
      case "970426":
        cardStr = "MaritimeBank";
        break;
      case "970431":
        cardStr = "EximBank";
        break;
      case "970443":
        cardStr = "SHB";
        break;
      case "970432":
        cardStr = "VPBank";
        break;
      case "970425":
        cardStr = "AnBinhBank";
        break;
      case "970403":
        cardStr = "SacomBank";
        break;
      case "970428":
        cardStr = "NamABank";
        break;
      case "970414":
        cardStr = "OceanBank";
        break;
      case "970418":
        cardStr = "BIDV";
        break;
      case "970440":
        cardStr = "SeaBank";
        break;
      case "970409":
        cardStr = "BacABank";
        break;
      case "970419":
        cardStr = "NaviBank";
        break;
      case "970405":
        cardStr = "AgriBank";
        break;
      case "970429":
        cardStr = "SaigonBank";
        break;
      case "970454":
        cardStr = "VietCapital";
        break;
      default:
        break;
    }
    return cardStr;
  }
  rememberCard(){
    this.isremember=!this.isremember
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
    var se = this;
    await Browser.open({ url: url});
  }
}

