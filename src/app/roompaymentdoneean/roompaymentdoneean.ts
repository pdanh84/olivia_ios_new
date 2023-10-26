import { LaunchReview } from '@awesome-cordova-plugins/launch-review/ngx';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../providers/auth-service';
import { Component, ViewChild, NgZone, OnInit } from '@angular/core';
import { NavController, Platform, AlertController, ToastController } from '@ionic/angular';
import { Booking, RoomInfo, SearchHotel,ValueGlobal } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import jwt_decode from 'jwt-decode';
import { GlobalFunction, ActivityService } from '../providers/globalfunction';
import { InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
import { MytripService } from '../providers/mytrip-service.service';
import { flightService } from '../providers/flightService';
import { voucherService } from '../providers/voucherService';

//import { Appsflyer } from '@ionic-native/appsflyer/ngx';
/**
 * Generated class for the RoompaymentdoneeanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'app-roompaymentdoneean',
  templateUrl: 'roompaymentdoneean.html',
  styleUrls: ['roompaymentdoneean.scss'],
})
export class RoompaymentdoneeanPage implements OnInit {
  checkreview;
  paymentmytrip = false;
  textPayment: any;
  textLinkPayment: any;
  urlPayment: string;
  bankName: any;
  bankBranch: any;
  accountNumber: any;
  bookingCode: any;
  ischeck: boolean; ishide; code; total; companyname; address; tax; addressorder; timeStamp; jti; cin; cout; ischeckshow; ischeckpayment
  priceshow: any;texttype="đặt phòng"; nameroom = ""; room;isaddCalendar=0;payment;
  hoten="";
  HotelName="";CheckInDate;CheckOutDate;
  constructor(public _platform: Platform, public navCtrl: NavController, public Roomif: RoomInfo, public activatedRoute: ActivatedRoute,
    public zone: NgZone, public booking: Booking, public authService: AuthService, public storage: Storage, public alertCtrl: AlertController, private launchReview: LaunchReview,
    public gf: GlobalFunction,
    public activityService: ActivityService,
    public iab: InAppBrowser,
    public clipboard: Clipboard,
    private toastCtrl: ToastController,
    private fb: Facebook,
    public searchhotel: SearchHotel,private _calendar: Calendar, public _mytripservice: MytripService,
    public valueGlobal: ValueGlobal,
    public _flightService: flightService,
    public _voucherService: voucherService
    ) {
    this.ischeckpayment = Roomif.ischeckpayment;
    this.Roomif.ischeckpoint = false;
    this.priceshow = this.Roomif.priceshow;
    Roomif.priceshow = "";
    this.ishide = true;
    this.storage.get('checkreview').then(checkreview => {
      if (checkreview==0) {
        this.checkreview=0;
      }else
      {
        this.checkreview=checkreview;
      }
    })
    if(this._voucherService.selectVoucher){
      
      this._voucherService.rollbackSelectedVoucher.emit(this._voucherService.selectVoucher);
      this._voucherService.selectVoucher = null;
    }
    this._voucherService.publicClearVoucherAfterPaymentDone(1);

    if(this.activityService.objPaymentMytrip && this.activityService.objPaymentMytrip.textPayment){
      this.textPayment = this.activityService.objPaymentMytrip.textPayment;
      this.textLinkPayment = this.activityService.objPaymentMytrip.textLinkPayment;
      this.urlPayment = this.activityService.objPaymentMytrip.urlPayment;
      this.bankName = this.activityService.objPaymentMytrip.bankName;
      this.bankBranch = this.activityService.objPaymentMytrip.bankBranch;
      this.accountNumber = this.activityService.objPaymentMytrip.accountNumber;
      this.bookingCode = this.activityService.objPaymentMytrip.trip.booking_id;
    }
    //google analytic
    let se = this;
    if(!(se.activityService.objPaymentMytrip && se.activityService.objPaymentMytrip.trip)){
      this.room = this.Roomif.arrroom;
      this.nameroom = this.room[0].ClassName;
      this.payment=this.Roomif.payment;
      this.HotelName=se.booking.HotelName;
      this.hoten=se.Roomif.hoten;
      se.CheckInDate=se.booking.CheckInDate;
      se.CheckOutDate=se.booking.CheckOutDate;
      var pricestring = se.Roomif.priceshowtt ? se.Roomif.priceshowtt : se.Roomif.pricepoint;
      //se.gf.googleAnalytionCustom('ecommerce_purchase', { item_category: 'roompayment', item_name: se.booking.HotelName, item_id: se.booking.code, start_date: se.booking.CheckInDate, end_date: se.booking.CheckOutDate, number_of_rooms: (se.booking.roomNb ? se.booking.roomNb : 1), value: se.gf.convertNumberToDouble(pricestring), currency: "VND" });
      //se.gf.googleAnalytionCustom('purchase', { items: [{ item_category: 'hotel_room', item_name: se.booking.HotelName, item_id: se.booking.code, start_date: se.booking.CheckInDate, end_date: se.booking.CheckOutDate }], value: se.gf.convertNumberToDouble(pricestring), currency: "VND" });
      se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_PURCHASED, {'fb_content_type': 'hotel'  ,'fb_content_id': se.booking.code,'fb_num_items': se.searchhotel.roomnumber, 'fb_value': se.gf.convertNumberToDouble(pricestring) ,  'fb_currency': 'VND' ,  
    'checkin_date': se.booking.CheckInDate ,'checkout_date ': se.booking.CheckOutDate,'num_adults': se.searchhotel.adult,'num_children': (se.searchhotel.child ? se.searchhotel.child : 0), }, se.gf.convertStringToNumber(pricestring) );
    }else{
      if(se.activityService.objPaymentMytrip && se.activityService.objPaymentMytrip.trip && se.activityService.objPaymentMytrip.trip.payment_status == 1)
      se.code = se.activityService.objPaymentMytrip.trip.HotelIdERP;
      if (se.activityService.objPaymentMytrip.trip.booking_type == 'COMBO_FLIGHT') {
        this.texttype="combo";
      } else if (se.activityService.objPaymentMytrip.trip.booking_type == 'COMBO_VXR') {
        this.texttype="combo";
      }
      se.nameroom=this.activityService.objPaymentMytrip.trip.room_name;
      se.priceshow = se.activityService.objPaymentMytrip.trip.amount_after_tax.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      se.paymentmytrip = true;
      this.HotelName=this.activityService.objPaymentMytrip.trip.hotel_name;
      this.hoten=this.activityService.objPaymentMytrip.trip.cus_name;
      se.CheckInDate=se.activityService.objPaymentMytrip.trip.start_day;
      se.CheckOutDate=se.activityService.objPaymentMytrip.trip.checkOutDate;
      se.searchhotel.totalPrice = se.activityService.objPaymentMytrip.trip.amount_after_tax;
      se.searchhotel.hotelName = this.activityService.objPaymentMytrip.trip.hotel_name;
      se.searchhotel.gaHotelId = se.activityService.objPaymentMytrip.trip.HotelIdERP;
      //se.gf.googleAnalytionCustom('ecommerce_purchase', { item_category: 'roompayment', item_name: se.booking.HotelName, item_id: se.booking.code, start_date: se.booking.CheckInDate, end_date: se.booking.CheckOutDate, number_of_rooms: (se.booking.roomNb ? se.booking.roomNb : 1), value: se.gf.convertNumberToDouble(se.priceshow), currency: "VND" });
      se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_PURCHASED, {'fb_content_type': 'hotel'  ,'fb_content_id': se.booking.code,'fb_num_items': se.searchhotel.roomnumber, 'fb_value': se.gf.convertNumberToDouble(se.priceshow) ,  'fb_currency': 'VND' ,  
    'checkin_date': se.booking.CheckInDate ,'checkout_date ': se.booking.CheckOutDate,'num_adults': se.searchhotel.adult,'num_children': (se.searchhotel.child ? se.searchhotel.child : 0), }, se.gf.convertStringToNumber(se.priceshow) );
    }

    
    se.GetUserInfo();
    this.priceshow = this.searchhotel.totalPrice;
    try {
      se.gf.logEventFirebase(se.searchhotel.paymentType,se.searchhotel, 'roompaymentdone-ean', 'purchase', 'Hotels');
    } catch (error) {
      
    }
  }
  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('code');
    this.ischeckshow = this.activatedRoute.snapshot.paramMap.get('ischeck');
    this.total = this.Roomif.priceshowtt;
    
  }
  next(stt) {
    this.Roomif.priceshowtt = "";
    //google analytic
    //this.gf.googleAnalytion('payment','Purchases','hotelid:'+this.booking.code+'/cin:'+this.booking.CheckInDate+'/cout:'+this.booking.CheckOutDate+'/adults:'+this.booking.Adults+'/child:'+this.booking.Child+'/roomnumber:'+ this.booking.roomNb+ '/price:'+this.booking.cost);
    
    if (this.checkreview==0) {
      this.showConfirm();
    }
    if(this.activityService.objPaymentMytrip){
      
      this._mytripservice.itemEnableHeader.emit(1);
      this._flightService.itemTabFlightActive.emit(true);
      this.valueGlobal.backValue = "homeflight";
      this._flightService.itemFlightMytripRefresh.emit(true);
      this._flightService.bookingCodePayment = this.bookingCode;
      this._flightService.bookingSuccess = true;
      this.navCtrl.navigateBack('/tabs/tab1');
    }else{
      if(this.searchhotel.rootPage == "topdeallist"){
        this.navCtrl.navigateBack('/topdeallist');
        this.searchhotel.rootPage = "";
      }else{
        this.navCtrl.navigateBack('/');
      }
    }
  }
  refreshToken() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'GET',
        //   url: C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims',
        //   headers:
        //   {
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json',
        //     authorization: text
        //   },
        // }
        let headers = {
          'cache-control': 'no-cache',
              'content-type': 'application/json',
              authorization: text
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims';
        this.gf.RequestApi('GET', strUrl, headers, {}, 'roompaymentdoneean', 'refreshToken').then((data)=>{
            var au = data;
            se.zone.run(() => {
              se.storage.remove('auth_token');
              se.storage.set('auth_token', au.auth_token);
              var decoded = jwt_decode<any>(au.auth_token);
              se.storage.remove('point');
              se.storage.set('point', decoded.point);
            })
        })
      }
    })
  }

  public async showConfirm() {
    this.storage.set("checkreview", 1);
    let alert = await this.alertCtrl.create({
      header: 'Bạn thích iVIVU.com?',
      message: 'Đánh giá ứng dụng trên CH Play',
      cssClass: 'done1-combo-css',
      mode: "ios",
      buttons: [
        {
          text: 'Hủy',
          handler: () => {
          }
        },
        {
          text: 'Đánh giá',
          role: 'OK',
          handler: () => {
            this.launchReview.launch()
              .then(() => console.log('Successfully launched store app'));
          }
        }
      ]
    });
    alert.present();
    alert.onDidDismiss().then((data) => {
    })
  }
  GetUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'GET',
        //   url: C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo',
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json',
        //     authorization: text
        //   }
        // };
        let headers = {
          'cache-control': 'no-cache',
              'content-type': 'application/json',
              authorization: text
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo';
        this.gf.RequestApi('GET', strUrl, headers, {}, 'roompaymentdone-eans', 'GetUserInfo').then((data)=>{
            if (data) {
                var info;
                var checkfullname = se.validateEmail(data.fullname);
                
                if (!checkfullname) {
                  var textfullname = data.fullname.split(' ')
                  //info = { ho: textfullname[0], ten: textfullname[1], phone: data.phone }
                  if (textfullname.length > 2) {
                    let name = '';
                    for (let i = 1; i < textfullname.length; i++) {
                      if (i == 1) {
                        name += textfullname[i];
                      } else {
                        name += ' ' + textfullname[i];
                      }
                    }
                    info = { ho: textfullname[0], ten: name, phone: data.phone }
                  } else {
                    info = { ho: textfullname[0], ten: textfullname[1], phone: data.phone }
                  }
                  se.storage.set("infocus", info);
                } else {
                  info = { ho: "", ten: "", phone: data.phone }
                  se.storage.set("infocus", info);
                }
                se.storage.set("email", data.email);
                se.storage.set("jti", data.memberId);
                //se.storage.set("auth_token", body.auth_token);
                se.storage.set("username", data.fullname);
                se.storage.set("phone", data.phone);
                se.storage.set("point", data.point);
            }
        });
      }
    })
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  openPaymentLink(){
    var se = this;
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'yes',
      toolbar: 'yes',
      hideurlbar: 'yes',
      closebuttoncaption: 'Đóng',
      hidenavigationbuttons: 'yes'
    };
    const browser = this.iab.create(se.urlPayment, '_self', options);
    browser.on('exit').subscribe(() => {
      se.checkPayment().then((rs)=>{
        if (rs.StatusBooking == 3) {
          var id = rs.BookingCode;
          var total = se.activityService.objPaymentMytrip.trip.priceShow;
          se.Roomif.priceshowtt = se.activityService.objPaymentMytrip.trip.priceShow;
          var ischeck = '0';
          se.activityService.objPaymentMytrip.trip.payment_status = 1;
          se.navCtrl.navigateBack(['/app/tabs/tab3/']);
        }
        else {
          se.gf.showAlertMessageOnly("Hiện tại, giao dịch của bạn hết hiệu lực, xin vui lòng thử lại sau!");
        }
      });
    }, err => {
      console.error(err);
    });
    // const browser = this.iab.open(se.urlPayment, '_self', "zoom=no; location=yes; toolbar=yes; hideurlbar=yes; closebuttoncaption=Đóng");
    // browser.addEventListener('onexit', () => {
    //   se.checkPayment().then((rs)=>{
    //     if (rs.StatusBooking == 3) {
    //       var id = rs.BookingCode;
    //       var total = se.activityService.objPaymentMytrip.trip.priceShow;
    //       se.Roomif.priceshowtt = se.activityService.objPaymentMytrip.trip.priceShow;
    //       var ischeck = '0';
    //       se.activityService.objPaymentMytrip.trip.payment_status = 1;
    //       se.navCtrl.navigateBack(['/app/tabs/tab3/']);
    //     }
    //     else {
    //       se.gf.showAlertMessageOnly("Hiện tại, giao dịch của bạn hết hiệu lực, xin vui lòng thử lại sau!");
    //     }
    //   });
    // });
    browser.show();
  }

  checkPayment(): Promise<any>{
    var se = this;
    return new Promise((resolve, reject) => {
      // var options = {
      //   method: 'GET',
      //   url: C.urls.baseUrl.urlPost + '/mCheckBooking',
      //   qs: { code: se.activityService.objPaymentMytrip.trip.code },
      //   headers:
      //   {
      //   }
      // };
      let headers = {};
      let strUrl = C.urls.baseUrl.urlPost + '/mCheckBooking?code='+ se.activityService.objPaymentMytrip.trip.code;
      this.gf.RequestApi('GET', strUrl, headers, {}, 'roompaymentdoneean', 'checkPayment').then((data)=>{
        if (data) {
          var rs = data;
          resolve(rs);
        }
        else {
          // error.page = "roomchoosebank";
          // error.func = "mCheckBooking";
          // error.param = JSON.stringify(options);
          // C.writeErrorLog(error, response);
          se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
        }
  
      })
    })
    
  }

  copyClipboard(type){
    if(type == 1){
      this.clipboard.copy(this.accountNumber);
    }else if(type == 2){
      this.clipboard.copy("Người thụ hưởng: Công ty Cổ Phần IVIVU.COM");
    }else if(type == 3){
      this.clipboard.copy(this.bookingCode);
    }
    this.presentToastr('Đã sao chép');
  }

  async presentToastr(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  addToCalendar() {
    let se = this;
    if (se._platform.is("cordova")) {
      se.createCalendar(true);
      //se.checkExistCalendarName("", true);
    }
  }
  checkExistCalendarName(itemflight, isdepart) {
    let se = this;
    se.storage.get('objectflightpaymentbank').then((data) => {
      if (data) {
        let arrobject = JSON.parse(data);
        if (arrobject && arrobject.length > 0) {
          let objexists = arrobject.filter((item) => {
            return item.resNo == itemflight.pnr.resNo;
          })

          if (objexists && objexists.length > 0) {
            //sửa event
            se.createCalendar(false)
          } else {
            se.createCalendar(true);
          }
        }
      } else {
        se.createCalendar(true);
      }
    })
  }
  createCalendar(createOrModify) {
    var se = this;
    if (!se.booking.CheckinTime) {
      se.booking.CheckinTime="14:00"
    }
    let calOptions = se._calendar.getCalendarOptions();
    let strmess = `Mã đặt phòng: ` + se.code + `

Tên phòng: ` + this.nameroom + 
    `

Khách hàng: ` + this.Roomif.hoten
  strmess += `

`;
strmess += "Quý khách nhớ mang theo giấy tờ tuỳ thân."
    calOptions.firstReminderMinutes = 120;
    calOptions.calendarId = 1;
    let event = {
      title: se.code+"-"+se.HotelName,
      location: "",
      message: strmess,
      startDate: se.CheckInDate+"T"+se.booking.CheckinTime+":00",
      endDate: se.CheckInDate+"T"+se.booking.CheckinTime+":00",
      calOptions
    };
    se._calendar.hasReadWritePermission().then((allow) => {
      let sdate = new Date(event.startDate),
        edate = new Date(event.endDate);
      if (allow) {
        if (createOrModify) {//true - tạo mới
          //se.gf.showLoadingwithtimeout();
          se._calendar.createEventWithOptions(event.title, event.location, event.message, sdate, edate, event.calOptions).then(() => {
            se._calendar.openCalendar(new Date(se.CheckInDate+"T"+se.booking.CheckinTime+":00")).then(() => {
              se.navCtrl.navigateBack(['/app/tabs/tab3']);
            });
          });
         
        }
       
      } else {
        se._calendar.requestReadWritePermission().then(() => {

          if (createOrModify) {//true - tạo mới
            // se.gf.showLoadingwithtimeout();
            se._calendar.createEventWithOptions(event.title, event.location, event.message, sdate, edate, event.calOptions).then(() => {

              se._calendar.openCalendar(new Date(se.CheckInDate+"T"+se.booking.CheckinTime+":00")).then(() => {

              });
            });
          } else {

          }
        })
      }
      se._mytripservice.itemEnableHeader.emit(1);
      se.navCtrl.navigateBack(['/app/tabs/tab3']);
     
    })
  }
}
