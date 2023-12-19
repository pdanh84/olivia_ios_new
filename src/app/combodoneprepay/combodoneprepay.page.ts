import { LaunchReview } from '@awesome-cordova-plugins/launch-review/ngx';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../providers/auth-service';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { Bookcombo, Booking, RoomInfo, SearchHotel } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import { Facebook } from '@awesome-cordova-plugins/facebook/ngx';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
import { voucherService } from '../providers/voucherService';
@Component({
  selector: 'app-combodoneprepay',
  templateUrl: './combodoneprepay.page.html',
  styleUrls: ['./combodoneprepay.page.scss'],
})
export class CombodoneprepayPage implements OnInit {
  code; priceshow; text; listcars; loccation; checkreview; ischeckshow; total; room; nameroom;payment
  constructor(public _platform: Platform, public navCtrl: NavController, public Roomif: RoomInfo, public activatedRoute: ActivatedRoute,
    public zone: NgZone, public booking: Booking, public authService: AuthService, public storage: Storage, public alertCtrl: AlertController, private launchReview: LaunchReview,
    public gf: GlobalFunction,
    private fb: Facebook,
    public searchhotel: SearchHotel,
    public bookCombo: Bookcombo, private _calendar: Calendar,
    public _voucherService: voucherService) {
    this.listcars = this.gf.getParams('carscombo');
    this.room = Roomif.arrroom;
    this.nameroom = this.room[0].ClassName;
    this.payment=Roomif.payment;
    this.priceshow = this.listcars.HotelBooking.TotalPrices.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    this.storage.get('checkreview').then(checkreview => {
      if (checkreview == 0) {
        this.checkreview = 0;
      } else {
        this.checkreview = checkreview;
      }
    })
    this.GetUserInfo();
    if(this._voucherService.selectVoucher){
        
      this._voucherService.rollbackSelectedVoucher.emit(this._voucherService.selectVoucher);
      this._voucherService.selectVoucher = null;
    }
    this._voucherService.publicClearVoucherAfterPaymentDone(1);
    this.bookCombo.promoCode="";
    this.bookCombo.discountpromo=0;

    let se =this;
    se.searchhotel.totalPrice = se.priceshow;
    se.gf.logEventFirebase(se.searchhotel.paymentType,se.searchhotel, 'combodone', 'purchase', 'Combo');
  }

  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('code');
    this.ischeckshow = this.activatedRoute.snapshot.paramMap.get('ischeck');
    this.total = this.Roomif.priceshowtt;
  }
  GetUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.gf.getUserInfo(auth_token).then((data) => {
            if (data) {
              var info;
              var checkfullname = se.validateEmail(data.fullname);
              if (!checkfullname) {
                var textfullname = data.fullname.split(' ')
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
  next() {
    this.Roomif.priceshowtt = "";
    if (this.checkreview == 0) {
      this.showConfirm();
    }
    this.gf.setParams(2, 'seemoreblog');
    this.navCtrl.navigateForward('/bloglist');
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
    let se = this;
    se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_PURCHASED, {'fb_content_type': 'hotel' ,'fb_content_id': se.bookCombo.HotelCode ? se.bookCombo.HotelCode :se.booking.code,'fb_num_items': se.searchhotel.roomnumber, 'fb_value': se.gf.convertNumberToDouble(se.listcars.HotelBooking.TotalPrices) ,  'fb_currency': 'VND' ,
    'checkin_date': se.listcars.HotelBooking.CheckInDate ,'checkout_date ': se.listcars.HotelBooking.CheckOutDate,'num_adults': se.listcars.HotelBooking.Adult,'num_children': (se.listcars.HotelBooking.Child ? se.listcars.HotelBooking.Child : 0) }, se.gf.convertStringToNumber(se.listcars.HotelBooking.TotalPrices) );
  }
  addToCalendar() {
    let se = this;
    if (se._platform.is("cordova")) {
        se.createCalendar(true,true);
    }
  }
  createCalendar(createOrModify,isdepart) {
    var se = this;
    let calOptions = se._calendar.getCalendarOptions();
    let CompanyName=(isdepart?this.listcars.TransferBooking.departTransfer.CompanyName : this.listcars.TransferBooking.returnTransfer.CompanyName)
    let Seats=(isdepart?this.listcars.TransferBooking.departTransfer.Seats : this.listcars.TransferBooking.returnTransfer.Seats)
    let strmess = `Mã đặt combo: ` + se.code + `

Tên phòng: ` + this.nameroom + 
    `

Khách hàng: ` + this.Roomif.hoten +
    `

Hãng xe: ` + CompanyName +
    `
    
Số ghế: ` + Seats

  strmess += `

`;

strmess += "Quý khách nhớ mang theo giấy tờ tuỳ thân."
    calOptions.firstReminderMinutes = 120;
    calOptions.calendarId = 1;
    let event = {
      title: se.code+"-"+se.booking.HotelName+" ("+CompanyName+")",
      location: "",
      message: strmess,
      startDate: (isdepart ?se.booking.CheckInDate+"T"+this.listcars.TransferBooking.departTransfer.DepartTime+":00" : se.booking.CheckOutDate+"T"+this.listcars.TransferBooking.returnTransfer.DepartTime+":00"),
      endDate: (isdepart ?se.booking.CheckInDate+"T"+this.listcars.TransferBooking.departTransfer.ArrivalTime+":00" : se.booking.CheckOutDate+"T"+this.listcars.TransferBooking.returnTransfer.ArrivalTime+":00"),
      calOptions
    };
    se._calendar.hasReadWritePermission().then((allow) => {
      let sdate = new Date(event.startDate),
        edate = new Date(event.endDate);
      if (allow) {
        if (createOrModify) {//true - tạo mới
          //se.gf.showLoadingwithtimeout();
          se._calendar.createEventWithOptions(event.title, event.location, event.message, sdate, edate, event.calOptions).then(() => {
            if (!isdepart) {
              se.navCtrl.navigateBack(['/app/tabs/tab3/']);
              se._calendar.openCalendar(new Date(se.booking.CheckInDate+"T"+this.listcars.TransferBooking.departTransfer.DepartTime+":00")).then(() => {
              });
            }
            else{
              se.createCalendar(true,false);
            } 
          });
        }
      } else {
        se._calendar.requestReadWritePermission().then(() => {
          if (createOrModify) {//true - tạo mới
            se._calendar.createEventWithOptions(event.title, event.location, event.message, sdate, edate, event.calOptions).then(() => {
              se._calendar.openCalendar(new Date(se.booking.CheckInDate+"T"+this.listcars.TransferBooking.departTransfer.DepartTime+":00")).then(() => {
              });
            });
          } else {

          }
        })
      }

    })
  }
}

