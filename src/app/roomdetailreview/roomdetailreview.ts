import { Bookcombo } from './../providers/book-service';
import { OverlayEventDetail } from '@ionic/core';
import { AdddiscountPage } from './../adddiscount/adddiscount.page';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, Platform } from '@ionic/angular';
import { Booking, ValueGlobal, RoomInfo, SearchHotel } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction,ActivityService } from '../providers/globalfunction';

import jwt_decode from 'jwt-decode';
import * as $ from 'jquery';
import * as moment from 'moment';
import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';
import { voucherService } from '../providers/voucherService';
//import { Appsflyer } from '@ionic-native/appsflyer/ngx';
/**
 * Generated class for the RoomdetailreviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-roomdetailreview',
  templateUrl: 'roomdetailreview.html',
  styleUrls: ['roomdetailreview.scss'],
})
export class RoomdetailreviewPage implements OnInit {
  Avatar; Name; Address; cin; cout; dur; room; nameroom; jsonroom; arrchild; textage = ""; promocode; ischeckbtnpromo = false;
  roomnumber; adults; children; breakfast; PriceAvgPlusTAStr; ischeckpoint = false; ischeckpromo
  imgroom; roomtype; indexme; indexroom; cin1; cout1; point; price; ischeck = false; Pricepoint; Pricepointshow; roomcancel; checkpayment; ischeckpayment; pointshow;
  public intervalID; discountpromo; msg; ischecktext = 3; ischeckerror = 0; textpromotion = "Nhập mã giảm giá"; titlecombo;
  myCalendar: any; ischeckroom = ""; RoomType
  nameroomEAN: string = "";
  specialCheckInInstructions: string = "";
  objroomfsale: any[];
  elementMealtype: any;
  indexMealTypeRates: any;
  arrroomFS: any[];
  itemVoucherHotel: any;
  nameroomHBED="";
  strPromoCode: string;
  totaldiscountpromo: number;
  statusRoom: any;
  constructor(public searchhotel: SearchHotel, public platform: Platform, public valueGlobal: ValueGlobal, public navCtrl: NavController, public Roomif: RoomInfo, public zone: NgZone,
    public booking: Booking, public storage: Storage, public bookCombo: Bookcombo, public alertCtrl: AlertController, public value: ValueGlobal, public modalCtrl: ModalController, public gf: GlobalFunction,
    private fb: Facebook,private activityService: ActivityService,
    public _voucherService: voucherService
  ) {

    setTimeout(() => {
      this.loadRoomInfo();
    }, 350)
  }

  loadRoomInfo() {
    var se = this;
    se.ischeckpayment = se.Roomif.ischeckpayment;
    se.checkpayment = se.Roomif.payment;
    se.Avatar = se.Roomif.imgHotel;
    const sizes = ['1024x768', '768x576', '346x260'];
    for (let size of sizes) {
        const normal = `${size}.webp`;
        const replaced = `${size}-${size}.webp`;
    
        if (se.Avatar && se.Avatar.includes(normal) && !se.Avatar.includes(replaced)) {
            se.Avatar = se.Avatar.replace(normal, replaced);
        }
    }
    se.Name = se.booking.HotelName;
    se.Address = se.Roomif.Address;
    se.cin = moment(se.gf.getCinIsoDate(se.booking.CheckInDate)).format('YYYY-MM-DD');
    se.cout = moment(se.gf.getCinIsoDate(se.booking.CheckOutDate)).format('YYYY-MM-DD');
    se.dur = se.Roomif.dur;
    se.roomnumber = se.Roomif.roomnumber;
    se.adults = se.booking.Adults;
    se.children = se.booking.Child;
    se.roomtype = se.Roomif.roomtype;
    se.indexme = se.booking.indexmealtype;
    se.indexroom = se.booking.indexroom;
    se.jsonroom = se.Roomif.jsonroom;
    se.room = se.Roomif.arrroom;
    var chuoicin = moment(se.cin).format('YYYY-MM-DD').split('-');
    var chuoicout =  moment(se.cout).format('YYYY-MM-DD').split('-');
    se.cin = chuoicin[2] + "-" + chuoicin[1] + "-" + chuoicin[0];
    se.cout = chuoicout[2] + "-" + chuoicout[1] + "-" + chuoicout[0];
    if(se.room && se.room.length > 0) {
        se.nameroom = se.room[0].ClassName;
        se.RoomType = se.room[0].RoomType;
    }
    se.roomcancel = se.Roomif.objMealType;
    se.breakfast = se.Roomif.objMealType.Name;
    se.ischeckroom = se.room[0].MealTypeRates[se.indexme].Supplier
    if (se.Roomif.objMealType.Notes.length != 0 && se.Roomif.objMealType.Notes[0].length != se.Roomif.objMealType.Name.length) {
      if (se.breakfast) {
        se.breakfast += ", " + se.Roomif.objMealType.Notes[0];
      } else {
        se.breakfast = se.Roomif.objMealType.Notes[0];
      }
    }
    se.PriceAvgPlusTAStr = se.roomtype.PriceAvgPlusTAStr;
    se.value.flagreview = 1;
    se.arrchild = se.searchhotel.arrchild;
    se.titlecombo = se.bookCombo.ComboTitle;
    if (se.arrchild) {
      for (let i = 0; i < se.arrchild.length; i++) {
        if (i == se.arrchild.length - 1) {
          se.textage = se.textage + se.arrchild[i].numage;
        } else {
          se.textage = se.textage + se.arrchild[i].numage + ",";
        }
      }
      if (se.textage) {
        se.textage = "(" + se.textage + ")";
      }
    }

    if(se.room[0].MealTypeRates[se.indexme].RoomName != se.room[0].ClassName){
      se.nameroomEAN = se.room[0].MealTypeRates[se.indexme].RoomName;
    }
    
    se.specialCheckInInstructions = se.jsonroom.SpecialCheckInInstructions;
    if( this.activityService.objFlightComboUpgrade){
      this.elementMealtype = this.activityService.objFlightComboUpgrade.CurrentRoom;
      this.indexMealTypeRates = this.activityService.objFlightComboUpgrade.CurrentRoomIndex;
    }
  }

   ngOnInit() {
    this._voucherService.getHotelObservable().subscribe((itemVoucher)=> {
      if(itemVoucher){
        if(this.promocode && this.promocode != itemVoucher.code && !this.itemVoucherHotel){
          this._voucherService.rollbackSelectedVoucher.emit(itemVoucher);
          this.gf.showAlertMessageOnly(`Chỉ hỗ trợ áp dụng nhiều voucher tiền mặt trên một đơn hàng, Coupon và Voucher khuyến mãi chỉ áp dụng một`);
          return;
        }
        if(itemVoucher.claimed){
          this._voucherService.selectVoucher = itemVoucher;
          this.itemVoucherHotel = itemVoucher;
          this.promocode = itemVoucher.code;
          this.discountpromo = itemVoucher.rewardsItem.price;
          this.ischeckbtnpromo = true;
          this.ischeckpromo = true;

          this.buildStringPromoCode();
        }else{
          this._voucherService.selectVoucher = null;
          this.itemVoucherHotel = null;
          this.promocode = "";
          this.discountpromo = 0;

          this.buildStringPromoCode();

          if(this._voucherService.voucherSelected && this._voucherService.voucherSelected.length ==0 && this._voucherService.listPromoCode && this._voucherService.listPromoCode.length ==0){
            this.strPromoCode = '';
            this.totaldiscountpromo = 0;
            this.ischeckbtnpromo = false;
            this.ischeckpromo = false;
          }
        }
        this.edit();
        //this.modalCtrl.dismiss();
      }
    })
    this._voucherService.getObservableClearVoucherAfterPaymentDone().subscribe((check)=> {
      if(check){
        this._voucherService.selectVoucher = null;
          this.itemVoucherHotel = null;
          this.promocode = "";
          this.discountpromo = 0;
          this.ischeckbtnpromo = false;
          this.ischeckpromo = false;
          this.Roomif.promocode = "";
          this.Roomif.priceshow = "";

          this.strPromoCode = '';
          this.totaldiscountpromo = 0;
          this._voucherService.voucherSelected = [];
          this._voucherService.listPromoCode = "";
          this._voucherService.listObjectPromoCode = [];
          this._voucherService.totalDiscountPromoCode = 0;
          this._voucherService.hotelPromoCode = "";
          this._voucherService.hotelTotalDiscount = 0;

        this.edit();
      }
    })

    this._voucherService.getVoucherHotelUsedObservable().subscribe((check)=>{
      if(check){

      }
    })
  }
  roompaymentbreakdow() {
    // var value = { room: this.room, dur: this.dur, PriceAvgPlusTAStr: this.PriceAvgPlusTAStr, roomnumber: this.roomnumber, roomtype: this.roomtype, indexme: this.indexme, indexroom: this.indexroom };
    var dur = this.dur;
    var roomnumber = this.roomnumber;
    this.searchhotel.backPage = "roomdetailreview";
    this.valueGlobal.backValue = 'roompaymentbreakdown';
    this._voucherService.hotelPromoCode = this.strPromoCode;
    this._voucherService.hotelTotalDiscount = this.totaldiscountpromo;
    this.navCtrl.navigateForward('/roompaymentbreakdown/' + dur + '/' + roomnumber);
  }
  next() {
    //this.presentLoading();
    this.Roomif.priceshow = "";
    this.Roomif.pricepoint = 0;
    this.Roomif.ischeckpoint = false;
    if (this.point > 0) {
      if (this.ischeck) {
        this.Roomif.ischeckpoint = this.ischeck;
        this.Roomif.priceshow = this.Pricepointshow;
        if (this.ischeckpoint) {
          this.Roomif.pricepoint = this.roomtype.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
        } else {
          this.Roomif.pricepoint = this.point;
        }
      }
      else {
        this.Roomif.ischeckpoint = this.ischeck;
        this.Roomif.priceshow = this.PriceAvgPlusTAStr;
        this.Roomif.point = null;
      }
    }
    else{
      this.Roomif.priceshow = this.PriceAvgPlusTAStr;
    }
    if (this.ischeckbtnpromo) {
      this.Roomif.promocode= this.promocode;
      this.Roomif.priceshow = this.Pricepointshow;
      this._voucherService.hotelPromoCode = this.strPromoCode;
      this._voucherService.hotelTotalDiscount = this.totaldiscountpromo;

    }
    else if(this._voucherService.selectVoucher && this._voucherService.selectVoucher.claimed){ //thêm luồng voucher heniken
      this.Roomif.promocode= this._voucherService.selectVoucher.code;
      this.Roomif.priceshow = this.Pricepointshow;
    }
    else if(this._voucherService.hotelPromoCode && this._voucherService.hotelTotalDiscount){
      this.Roomif.priceshow = this.Pricepointshow;
    }
    else
    {
      this.Roomif.promocode= "";
      this.promocode= "";
    }
    this.valueGlobal.backValue = '';
    if (this.room[0].MealTypeRates[this.indexme].Supplier == 'Internal' || this.room[0].MealTypeRates[this.indexme].Supplier == 'B2B') {
      this.navCtrl.navigateForward('roomadddetails');
    } else {
      if(this.room[0].MealTypeRates[this.indexme].Supplier == 'EAN'){
        this.Roomif.ExcludeVAT=1;
      }
      this.navCtrl.navigateForward('roomadddetails-ean');
    }
    
    //this.gf.googleAnalytionCustom('add_to_cart',{item_category:'roomdetail' , item_name: this.booking.HotelName, item_id: this.booking.code, start_date: this.booking.CheckInDate, end_date: this.booking.CheckOutDate, value: Number(this.booking.cost.replace(/\./g, '').replace(/\,/g, '') ), currency: 'VND'});
    let se = this;
    if(se.Roomif.priceshow){
      se.searchhotel.totalPrice = se.Roomif.priceshow;
    }else if(se.booking.cost){
      se.searchhotel.totalPrice = se.booking.cost;
    }
    se.gf.logEventFirebase('',this.searchhotel, 'roomdetailreview', 'begin_checkout', 'Hotels');
    se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_INITIATED_CHECKOUT, {
      'fb_content_type': 'hotel', 'fb_content_id': se.booking.code, 'fb_num_items': se.searchhotel.roomnumber, 'fb_value': se.gf.convertNumberToDouble(se.booking.cost), 'fb_currency': 'VND',
      'checkin_date': se.searchhotel.CheckInDate, 'checkout_date ': se.searchhotel.CheckOutDate, 'num_adults': se.searchhotel.adult, 'num_children': (se.searchhotel.child ? se.searchhotel.child : 0)
    }, se.gf.convertStringToNumber(se.booking.cost));
 
  }
  ionViewWillEnter() {
    if(this.valueGlobal.backValue != 'roompaymentbreakdown'){
      if(this.itemVoucherHotel){
        this._voucherService.rollbackSelectedVoucher.emit(this.itemVoucherHotel);
      }
      
      this.point=0;
      this.ischeck = false;
      this.Roomif.point=null;
      this.price=0;
  
      this.textpromotion="iVIVU Voucher | Mobile Gift";
      this.promocode="";
      this.ischeckbtnpromo=false;
      this.ischeckpromo=false;
      this.msg="";
      this.itemVoucherHotel = null;
      this.strPromoCode = '';
          this.totaldiscountpromo = 0;
          this._voucherService.voucherSelected = [];
          this._voucherService.listPromoCode = "";
          this._voucherService.listObjectPromoCode = [];
          this._voucherService.totalDiscountPromoCode = 0;
          this._voucherService.hotelPromoCode = "";
          this._voucherService.hotelTotalDiscount = 0;
          this._voucherService.vouchers = [];
    }
      this.bookCombo.upgradeRoomChange.pipe().subscribe((dataRoomChange)=>{         
        if(dataRoomChange){
          this.updateRoomChange(dataRoomChange);
        }
    })
      this.GetUserInfo();
      this.edit();
    }
  GetUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
       
        let headers =
          {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
          };
        let strUrl = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo';
        this.gf.RequestApi('GET', strUrl, headers, {}, 'roomdetailreview', 'GetUserInfo').then((data)=>{
            if (data) {
              if(data.statusCode == 401){
                se.storage.get('jti').then((memberid) => {
                  se.storage.get('deviceToken').then((devicetoken) => {
                    se.gf.refreshToken(memberid, devicetoken).then((token) => {
                      setTimeout(() => {
                        se.GetUserInfo();
                      }, 100)
                    });
    
                  })
                })
              }
              se.zone.run(() => {
                if (data.point) {
                  //point=500;
                  // if (point > 0) {
                  //   se.pointshow=point;
                  //   se.Roomif.point = point;
                  //   se.point = point * 1000;
                  //   se.price = se.point.toLocaleString();
                  //   var tempprice = se.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
                  //   se.Pricepoint = tempprice - se.point;
                  //   se.Pricepointshow = se.Pricepoint.toLocaleString();
                  //   if (se.Pricepoint <= 0) {
                  //     se.ischeckpoint = true;
                  //     se.Pricepointshow = 0;
                  //   }
                  // }
                  if (data.point > 0) {
                    se.Roomif.point = data.point;
                    se.point = data.point * 1000;
                    se.price = se.point.toLocaleString();
                  }
                }
                se.storage.remove('point');
                se.storage.set('point', data.point);
            })
              //se.storage.set('userInfoData', data);
            }

          
        });
      }
    })
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  // ionViewWillLeave() {
  //   this.zone.run(() => {
  //     clearInterval(this.intervalID);
  //   })
  // }
  refreshToken() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        let headers =
          {
            'cache-control': 'no-cache',
            'content-type': 'application/json-patch+json',
            authorization: text
          };
        let strUrl = C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims';
        this.gf.RequestApi('GET', strUrl, headers, {}, 'roomdetailreview', 'refreshToken').then((data)=>{
            var au = data;
            se.zone.run(() => {
              // se.storage.remove('auth_token');
              // se.storage.set('auth_token', au.auth_token);
              var decoded = jwt_decode<any>(au.auth_token);
              se.storage.remove('point');
              se.storage.set('point', decoded.point);
              se.storage.get('point').then(point => {
                if (point) {
                  //point=500;
                  if (point > 0) {
                    se.pointshow = point;
                    se.Roomif.point = point;
                    se.point = point * 1000;
                    se.price = se.point.toLocaleString();
                    var tempprice = se.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
                    se.Pricepoint = tempprice - se.point;
                    se.Pricepointshow = se.Pricepoint.toLocaleString();
                    if (se.Pricepoint <= 0) {
                      se.ischeckpoint = true;
                      se.Pricepointshow = 0;
                    }
                  }
                }
                se.GetUserInfo();
              });
            })
          
        })
      }
    })
  }
  public async showConfirm() {
    let alert = await this.alertCtrl.create({
      message: "Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại để sử dụng chức năng này.",
      backdropDismiss: false,
      cssClass: 'alert-session-confirm',
      buttons: [
        {
          text: 'Để sau',
          handler: () => {
            this.storage.remove('auth_token');
            this.storage.remove('email');
            this.storage.remove('username');
            this.storage.remove('jti');
            this.storage.remove('userInfoData');
            this.storage.remove('userRewardData');
            this.storage.remove('point');
            this.navCtrl.navigateBack('/');
          }
        },
        {
          text: 'Đăng nhập',
          role: 'OK',
          handler: () => {
            this.storage.remove('auth_token');
            this.storage.remove('email');
            this.storage.remove('username');
            this.storage.remove('jti');
            this.storage.remove('userInfoData');
            this.storage.remove('userRewardData');
            this.storage.remove('point');
            //this.valueGlobal.logingoback = "MainPage";
            this.navCtrl.navigateForward('/login');
          }
        },
      ]
    });
    alert.present();
  }
  
  edit() {
    this.zone.run(() => {
      if (this.ischeck) {
        if (this.ischeckpoint) {
          this.Pricepointshow = 0;
        }
        else {
          if (this.ischeckpromo) {
            this.price = this.point.toLocaleString();
            var tempprice = this.roomtype.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
            //this.Pricepoint = tempprice - this.point-this.discountpromo;
            this.Pricepoint = tempprice - this.point-this.totaldiscountpromo;
            if(this.Pricepoint*1 <0){
              this.Pricepoint = 0;
            }
            this.Pricepointshow = this.Pricepoint.toLocaleString();
          } else {
            this.price = this.point.toLocaleString();
            var tempprice = this.roomtype.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
            this.Pricepoint = tempprice - this.point;
            if(this.Pricepoint*1 <0){
              this.Pricepoint = 0;
            }
            this.Pricepointshow = this.Pricepoint.toLocaleString();
            if ( this.Pricepoint <=0) {
              this.ischeckpoint=true;
              this.Pricepointshow = 0;
            }
      
          }
        
        }

      } else {
        if (this.ischeckpromo) {
          var tempprice = this.roomtype.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
          //this.Pricepointshow = tempprice -  this.discountpromo;
          this.Pricepointshow = tempprice -  this.totaldiscountpromo;
         
          if ( this.Pricepointshow*1 <=0) {
            this.Pricepointshow = 0;
          }
          this.Pricepointshow = this.Pricepointshow.toLocaleString();
          this.PriceAvgPlusTAStr = this.roomtype.PriceAvgPlusTAStr;
        }
        else
        {
          if (this.roomtype) {
            this.PriceAvgPlusTAStr = this.roomtype.PriceAvgPlusTAStr;
          }
        
          
        }
      }
    })
  }
  goback() {
    this.promocode ="";
    this.discountpromo=0;
    this.itemVoucherHotel=null;
    this.valueGlobal.backValue = '';
    this.strPromoCode = '';
        this.totaldiscountpromo = 0;
        this._voucherService.voucherSelected = [];
        this._voucherService.listPromoCode = "";
        this._voucherService.listObjectPromoCode = [];
        this._voucherService.totalDiscountPromoCode = 0;

    if (this.valueGlobal.backValue == 'hotelroomdetail') {
      this.navCtrl.navigateBack('/hotelroomdetail');
    } else {
      this.valueGlobal.notRefreshDetail = false;
      this.navCtrl.navigateBack('/hoteldetail/' + this.booking.HotelId);
      // this.navCtrl.back();
    }

  }

  openRoomCancel() {
    this.gf.setParams(this.roomcancel, 'roomInfo');
    this.searchhotel.backPage = "roomdetailreview";
    this.navCtrl.navigateForward('/roomcancel');
  }
  promofunc() {
    var se = this;
    if (se.promocode) {
      let body = { bookingCode: 'HOTEL',code: se.promocode, totalAmount: se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, ''), comboDetailId: this.bookCombo.ComboId,
      couponData: {
        "hotel": {
          "hotelId": this.booking.HotelId,
          "roomName": this.booking.RoomName,
          "totalRoom": this.Roomif.roomnumber,
          "totalAdult": this.booking.Adults,
          "totalChild": this.booking.Child,
          "jsonObject": "",
          "checkIn": this.searchhotel.CheckInDate,
          "checkOut": this.searchhotel.CheckOutDate
        }
      } }
      let headers =
          {
            'postman-token': '37a7a641-c2dd-9fc6-178b-6a5eed1bc611',
            'cache-control': 'no-cache',
            'content-type': 'application/json'
          };
        let strUrl = C.urls.baseUrl.urlMobile + '/api/data/validpromocode';
        this.gf.RequestApi('POST', strUrl, headers, body, 'roomdetailreview', 'promofunc').then((data)=>{
        se.zone.run(() => {
          var json = data;
          
          if (json.error == 0) {
            var total = se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '');
            if (se.ischeck) {
              total = se.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
            }
            let _discount= json.data.orginDiscount ? json.data.orginDiscount : json.data.discount;
            se.Pricepointshow = total -  _discount;

            se.strPromoCode = se.promocode;
            se.totaldiscountpromo = _discount;
            se.Roomif.discountpromo = _discount;
            se.edit();

            if (se.Pricepointshow > 0) {
              se.Pricepointshow = se.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
              se.ischeckbtnpromo = true;
              se.ischeckpromo = true;
            }
            else {
              se.ischeckbtnpromo = true;
              se.Pricepointshow = 0;
            }
            se.msg = json.msg;
            se.ischecktext = 0;
            se.ischeckerror = 0;
          }
          else if (json.error == 1) {
            se.ischeckbtnpromo = false;
            se.msg = json.msg;
            se.discountpromo = 0;
            se.ischecktext = 1;
            se.ischeckerror = 1;
          }
          else if (json.error == 2) {
            se.ischeckbtnpromo = false;
            se.msg = json.msg;
            se.discountpromo = 0;
            se.ischecktext = 2;
            se.ischeckerror = 1;
          }
          else if (json.error == 3) {
            se.ischeckbtnpromo = false;
            se.msg = json.msg;
            se.discountpromo = 0;
            se.ischecktext = 2;
            se.ischeckerror = 1;
          }
          else {
            se.ischeckbtnpromo = false;
            se.msg = json.msg;
            se.discountpromo = 0;
            se.ischecktext = 2;
            se.ischeckerror = 1;
          }
        })
      });
    }
  }
  textchange() {
    this.ischeckbtnpromo = false;
    this.discountpromo = 0;
    this.ischeckerror = 0;
    this.msg = "";
    this.ischecktext = 3
    if (this.ischeck) {
      if (this.ischeckpoint) {
        this.Pricepointshow = 0;
      }
      else {
        this.price = this.point.toLocaleString();
        var tempprice = this.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
        this.Pricepoint = tempprice - this.point;
        this.Pricepointshow = this.Pricepoint.toLocaleString();
      }
    }
  }
  click() {
    this.ischecktext = 3
  }
  async showdiscount() {
    if (!this.ischeck) {
      $('.div-point').removeClass('div-disabled');
      this.valueGlobal.PriceAvgPlusTAStr = this.PriceAvgPlusTAStr;
      this.textpromotion = "iVIVU Voucher | Mobile Gift";
      this.promocode = "";
      this.discountpromo=0;
     
      this._voucherService.openFrom = 'roomdetailreview';
      this.msg="";  
      const modal: HTMLIonModalElement =
        await this.modalCtrl.create({
          component: AdddiscountPage,
        });
      modal.present();

      this._voucherService.listPromoCode = [];
      this._voucherService.listObjectPromoCode = [];
      this.buildStringPromoCode();
      this.edit();
      modal.onDidDismiss().then((data: OverlayEventDetail) => {
        if(this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0){
        if(this.strPromoCode){
          this.strPromoCode += ', '+this._voucherService.listPromoCode.join(', ');
          this.totaldiscountpromo += this._voucherService.totalDiscountPromoCode;
        }else{
          this.strPromoCode = this._voucherService.listPromoCode.join(', ');
          this.totaldiscountpromo = this._voucherService.totalDiscountPromoCode;
        }
        this._voucherService.hotelPromoCode = this.strPromoCode;
        this._voucherService.hotelTotalDiscount = this.totaldiscountpromo;
        this.ischeckpromo = true;
        this.edit();
      }else if (data.data) {//case voucher km
        let vc = data.data;
        if(vc.applyFor && vc.applyFor != 'hotel'){
          this.gf.showAlertMessageOnly(`Mã giảm giá chỉ áp dụng cho đơn hàng ${ vc.applyFor == 'hotel' ? 'khách sạn' : 'vé máy bay'}. Quý khách vui lòng chọn lại mã khác!`);
          this._voucherService.rollbackSelectedVoucher.emit(vc);
          return;
        }
        else {
          this.zone.run(() => {
            if (data.data.promocode) {
              $('.div-point').addClass('div-disabled');
              this.promocode=data.data.promocode;
              this.promofunc();
            }
          })
        }
      }
      })
    }
  }
  async upgradeRoom(){
    var se = this;
    se.activityService.objFlightComboUpgrade = {};
    se.activityService.objFlightComboUpgrade.CurrentRoom = se.elementMealtype;
    se.activityService.objFlightComboUpgrade.CurrentRoomIndex = se.indexMealTypeRates;
    se.valueGlobal.backValue = "hotelupgraderoom";
    se.valueGlobal.notRefreshDetail=true;
    se.navCtrl.navigateForward('/hotelupgraderoom');
  }
  updateRoomChange(dataRoomChange) {
    var se = this;
    this.objroomfsale=[];
    se.PriceAvgPlusTAStr=dataRoomChange.itemroom.MealTypeRates[dataRoomChange.index].PriceAvgPlusTAStr;
    this.statusRoom=dataRoomChange.itemroom.MealTypeRates[dataRoomChange.index].Status;
    this.booking.indexmealtype=dataRoomChange.index;
    se.nameroom = dataRoomChange.itemroom.ClassName;
    se.bookCombo.roomNb = dataRoomChange.itemroom.TotalRoom;
    se.elementMealtype=dataRoomChange.itemroom.MealTypeRates[dataRoomChange.index];
    this.objroomfsale.push(dataRoomChange.itemroom.MealTypeRates[dataRoomChange.index]);
     if (se.objroomfsale[0].Status == 'RQ' || se.objroomfsale[0].Supplier == 'B2B') {
          se.Roomif.payment = "RQ";
        }else{
          se.Roomif.payment = "AL";
        }
    this.indexMealTypeRates=dataRoomChange.index;
    this.arrroomFS = [];
    this.arrroomFS.push(dataRoomChange.itemroom);
    this.Roomif.roomtype = this.objroomfsale[0];
    this.roomtype = this.objroomfsale[0];
    this.Roomif.HotelRoomHBedReservationRequest = JSON.stringify(this.arrroomFS[0].HotelRoomHBedReservationRequest);
    this.Roomif.arrroom = this.arrroomFS;
    this.Roomif.imgRoom = this.arrroomFS[0].Rooms[0].ImagesMaxWidth320;
    this.Roomif.objMealType = dataRoomChange.itemroom.MealTypeRates[dataRoomChange.index];
    
  }
  nextShuttlebus(){
    this.navCtrl.navigateForward("/shuttlebusnote");
  }

  buildStringPromoCode(){
  
    if(this._voucherService.voucherSelected && this._voucherService.voucherSelected.length >0){
      this.strPromoCode = this._voucherService.voucherSelected.map(item => item.code).join(', ');
      this.totaldiscountpromo = this._voucherService.voucherSelected.map(item => item.rewardsItem).reduce((total,b)=>{ return total + b.price; }, 0);
      this.ischeckpromo = true;
    }else{
      this.strPromoCode = '';
      this.totaldiscountpromo = 0;
    }
  
    if(this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0){
      this.ischeckpromo = true;
      if(this.strPromoCode){
        this.strPromoCode += ', '+this._voucherService.listPromoCode.join(', ');
      }else{
        this.strPromoCode += this._voucherService.listPromoCode.join(', ');
      }
        
        this.totaldiscountpromo += this._voucherService.totalDiscountPromoCode;
    }
    if(!this.strPromoCode){
      this.Pricepointshow = 0;
      this.ischeckbtnpromo = false
    }
    this._voucherService.hotelPromoCode = this.strPromoCode;
    this._voucherService.hotelTotalDiscount = this.totaldiscountpromo;
  }
}

