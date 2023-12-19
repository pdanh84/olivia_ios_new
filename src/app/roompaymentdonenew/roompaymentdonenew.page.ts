import { LaunchReview } from '@awesome-cordova-plugins/launch-review/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../providers/auth-service';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, Platform, AlertController, ToastController, ModalController } from '@ionic/angular';
import { Booking, RoomInfo, SearchHotel } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction, ActivityService } from '../providers/globalfunction';
import * as moment from 'moment';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { FlightquickbackPage } from '../flightquickback/flightquickback.page';
import { CustomAnimations } from '../providers/CustomAnimations';
import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
import { voucherService } from '../providers/voucherService';
@Component({
  selector: 'app-roompaymentdonenew',
  templateUrl: './roompaymentdonenew.page.html',
  styleUrls: ['./roompaymentdonenew.page.scss'],
})
export class RoompaymentdonenewPage implements OnInit {
  ischeck: boolean; ishide; code; total; companyname; address; tax; addressorder; timeStamp; jti; cin; cout; priceshow; text; status; ischeckpayment
  checkreview; jsonroom; accountNumber: any;
  textbank; bankName; url = ""; urlimgbank = ""; paymentbank; _email;nameroom="";room
  constructor(public _platform: Platform, public Roomif: RoomInfo, public navCtrl: NavController, public zone: NgZone,
    public booking: Booking, public authService: AuthService, public activatedRoute: ActivatedRoute, public router: Router,
    public storage: Storage, public gf: GlobalFunction, public alertCtrl: AlertController, private launchReview: LaunchReview,
    public activityService: ActivityService,
    public iab: InAppBrowser, private modalCtrl: ModalController,
    public clipboard: Clipboard, private toastCtrl: ToastController,
    private fb: Facebook,
    public searchhotel: SearchHotel, private _calendar: Calendar,
    public _voucherService: voucherService) {
    this.accountNumber = this.Roomif.accountNumber;
    this.textbank = this.Roomif.textbank;
    this.bankName = this.Roomif.bankName + " . " + this.Roomif.bankBranch;
    this.paymentbank = this.Roomif.paymentbank;
    this._email = this.booking.CEmail;
    this.room = Roomif.arrroom;
    this.nameroom = this.room[0].ClassName;
    this.storage.get('checkreview').then(checkreview => {
      if (checkreview == 0) {
        this.checkreview = 0;
      } else {
        this.checkreview = checkreview;
      }
    })
    if(this._voucherService.selectVoucher){
      
      this._voucherService.rollbackSelectedVoucher.emit(this._voucherService.selectVoucher);
      this._voucherService.selectVoucher = null;
    }
    this._voucherService.publicClearVoucherAfterPaymentDone(1);
    
    this.jsonroom = Roomif.jsonroom
    this.ischeckpayment = Roomif.ischeckpayment;
    this.Roomif.ischeckpoint = false;
    var ti = new Date();
    var DateNow = moment(ti).format('YYYYMMDD');
    var ho = ti.getHours();
    var addhours = moment(ti).add(1, 'hours').format('HH:mm');
    this.text = addhours + ' cùng ngày';
    if (this.Roomif.payment) {
      var PaymentPeriod = this.jsonroom.RoomClasses[0].MealTypeRates[this.booking.indexmealtype].PaymentPeriod;
      if (this.Roomif.payment == 'AL' || this.Roomif.payment == 'RQ') {
        if (PaymentPeriod) {
          var PaymentPeriodcovert = moment(PaymentPeriod).format('YYYYMMDDHHmm');
          if (ho > 0 && ho < 6) {
            DateNow = DateNow + '1100';
            if (parseInt(PaymentPeriodcovert) >= parseInt(DateNow)) {
              this.text = '11 am cùng ngày';
            }
            else {
              this.text = moment(PaymentPeriod).format('HH:mm') + ' ngày ' + moment(PaymentPeriod).format('DD-MM-YYYY');
            }
          }
          else if (ho >= 6 && ho < 12) {
            DateNow = DateNow + '1700';
            if (parseInt(PaymentPeriodcovert) >= parseInt(DateNow)) {
              this.text = '17h cùng ngày';
            }
            else {
              this.text = moment(PaymentPeriod).format('HH:mm') + ' ngày ' + moment(PaymentPeriod).format('DD-MM-YYYY');
            }
          }
          else if (ho >= 12 && ho < 20) {
            DateNow = DateNow + '2030';
            if (parseInt(PaymentPeriodcovert) >= parseInt(DateNow)) {
              this.text = '20h30 cùng ngày'
            }
            else {
              this.text = moment(PaymentPeriod).format('HH:mm') + ' ngày ' + moment(PaymentPeriod).format('DD-MM-YYYY');
            }
          }
          else {
            var res = ti.setTime(ti.getTime() + (24 * 60 * 60 * 1000));
            var date = new Date(res);
            var checkDate = moment(date).format('YYYYMMDD') + '1100';
            if (parseInt(PaymentPeriodcovert) >= parseInt(checkDate)) {
              this.text = '11 am hôm sau';
            } else {
              this.text = moment(PaymentPeriod).format('HH:mm') + ' ngày ' + moment(PaymentPeriod).format('DD-MM-YYYY');
            }

          }

        }
        else {
          if (ho > 0 && ho < 6) {
            this.text = '11 am cùng ngày';
          }
          else if (ho >= 6 && ho < 12) {
            this.text = '17h cùng ngày'
          }
          else if (ho >= 12 && ho < 20) {
            this.text = '20h30 cùng ngày'
          }
          else {
            this.text = '11 am hôm sau';
          }
        }
      }
    }
    this.ishide = true;
    if (Roomif.priceshow) {
      this.priceshow = Roomif.priceshow;
    }
    else {
      this.priceshow = booking.cost;
    }
    
    this.getbank();
  }
  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('code');
    this.status = this.activatedRoute.snapshot.paramMap.get('stt');
  }

  ionViewWillEnter() {
    let se = this;
    let pricestring = se.priceshow ? se.priceshow : se.Roomif.pricepoint;
    //se.gf.googleAnalytionCustom('ecommerce_purchase', { items: [{ item_category: 'hotel_room', item_name: se.booking.HotelName, item_id: se.booking.code, start_date: se.booking.CheckInDate, end_date: se.booking.CheckOutDate, number_of_rooms: (se.booking.roomNb ? se.booking.roomNb : 1) }], value: se.gf.convertNumberToDouble(pricestring), currency: "VND" });
    se.gf.logEventFirebase(se.searchhotel.paymentType,se.searchhotel, 'roompaymentdonenew', 'purchase', 'Hotels');
    se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_PURCHASED, {
      'fb_content_type': 'hotel', 'fb_content_id': se.booking.code, 'fb_num_items': se.searchhotel.roomnumber, 'fb_value': se.gf.convertNumberToDouble(pricestring), 'fb_currency': 'VND',
      'checkin_date': se.booking.CheckInDate, 'checkout_date ': se.booking.CheckOutDate, 'num_adults': se.searchhotel.adult, 'num_children': (se.searchhotel.child ? se.searchhotel.child : 0),
    }, se.gf.convertStringToNumber(pricestring));

  }

  next() {
    this.Roomif.priceshow = "";
    if (this.checkreview == 0) {
      this.showConfirm();
    }
    this.navCtrl.navigateBack('/');
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
        this.gf.getUserInfo(auth_token).then((data) => {
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
  copyClipboard(type) {
    if (type == 1) {
      this.clipboard.copy(this.accountNumber);
    } else if (type == 2) {
      this.clipboard.copy("Người thụ hưởng: Công ty Cổ Phần IVIVU.COM");
    } else if (type == 3) {
      this.clipboard.copy(this.code);
    }
    else if (type == 4) {
      this.clipboard.copy(this.priceshow);
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
  openWebpage() {
    var se = this;
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'yes',
      toolbar: 'yes',
      hideurlbar: 'yes',
      closebuttoncaption: 'Đóng',
      hidenavigationbuttons: 'yes'
    };
    const browser = this.iab.create(this.url, '_self', options);
    //const browser:any = se.iab.open(this.url, '_self', "zoom=no; location=yes; toolbar=yes; hideurlbar=yes; closebuttoncaption=Đóng");
    browser.show();
  }
  getbank() {
    switch (this.paymentbank) {
      case "41":
        this.urlimgbank = "https://res.ivivu.com/payment/img/banklogo/2.acb.png";
        this.url = 'https://online.acb.com.vn/acbib';
        break;
      case "42":
        this.urlimgbank = "https://res.ivivu.com/payment/img/banklogo/1.vietcombank.png";
        this.url = 'https://www.vietcombank.com.vn/IBanking2020';
        break;
      case "43":
        this.urlimgbank = "https://res.ivivu.com/payment/img/banklogo/5.dongabank.png";
        this.url = 'https://ebanking.dongabank.com.vn/khcn/';
        break;
      case "44":
        this.urlimgbank = "https://res.ivivu.com/payment/img/banklogo/4.techcombank.png";
        this.url = 'https://ib.techcombank.com.vn/servlet/BrowserServlet';
        break;
      case "45":
        this.urlimgbank = "https://res.ivivu.com/payment/img/banklogo/3.viettinbank.png";
        this.url = 'https://ebanking.vietinbank.vn/rcas';
        break;
      case "46":
        this.urlimgbank = "https://res.ivivu.com/payment/img/banklogo/8.sacombank.png";
        this.url = 'https://www.isacombank.com.vn/corp/AuthenticationController?FORMSGROUP_ID__=AuthenticationFG&__START_TRAN_FLAG__=Y&FG_BUTTONS__=LOAD&ACTION.LOAD=Y&AuthenticationFG.LOGIN_FLAG=1&BANK_ID=303&LANGUAGE_ID=003';
        break;
      case "47":
        this.urlimgbank = "https://res.ivivu.com/payment/img/banklogo/6.agribank.png";
        this.url = 'https://ibank.agribank.com.vn/ibank';
        break;
      case "48":
        this.urlimgbank = "https://res.ivivu.com/payment/img/banklogo/7.bidv.png";
        this.url = 'https://www.bidv.vn:81/iportalweb/iRetail@1';
        break;
      case "49":
        this.urlimgbank = "https://res.ivivu.com/payment/img/banklogo/scb-icon.png";
        this.url = 'https://ebanking.scb.com.vn/?module=login';
        break;
      case "50":
        this.urlimgbank = "https://res.ivivu.com/payment/img/banklogo/hdb-icon.png";
        this.url = 'https://ebanking.hdbank.vn/ipc/vi/';
        break;
      case "53":
        this.urlimgbank = "https://res.ivivu.com/payment/img/banklogo/ocb-logo.png";
        this.url = 'https://omni.ocb.com.vn/frontend-web/app/auth.html#/login';
        break;
      default:
        break;
    }
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
        //enterAnimation: CustomAnimations.iosCustomEnterAnimation,
        //leaveAnimation: CustomAnimations.iosCustomLeaveAnimation,
        cssClass: "modal-flight-quick-back",
      });
    modal.present();
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
      title: se.code+"-"+se.booking.HotelName,
      location: "",
      message: strmess,
      startDate: se.booking.CheckInDate+"T"+se.booking.CheckinTime+":00",
      endDate: se.booking.CheckInDate+"T"+se.booking.CheckinTime+":00",
      calOptions
    };
    se._calendar.hasReadWritePermission().then((allow) => {
      let sdate = new Date(event.startDate),
        edate = new Date(event.endDate);
      if (allow) {
        if (createOrModify) {//true - tạo mới
          //se.gf.showLoadingwithtimeout();
          se._calendar.createEventWithOptions(event.title, event.location, event.message, sdate, edate, event.calOptions).then(() => {
            se._calendar.openCalendar(new Date(se.booking.CheckInDate+"T14:00:00")).then(() => {
              se.navCtrl.navigateBack(['/app/tabs/tab3']);
            });
          });
        }  
      } else {
        se._calendar.requestReadWritePermission().then(() => {

          if (createOrModify) {//true - tạo mới
            // se.gf.showLoadingwithtimeout();
            se._calendar.createEventWithOptions(event.title, event.location, event.message, sdate, edate, event.calOptions).then(() => {

              se._calendar.openCalendar(new Date(se.booking.CheckInDate+"T14:00:00")).then(() => {

              });
            });
          }
        })
      }
    })
  }
}
