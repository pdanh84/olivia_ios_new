import { Bookcombo, SearchHotel } from './../providers/book-service';
import { LaunchReview } from '@awesome-cordova-plugins/launch-review/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../providers/auth-service';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { Booking, RoomInfo } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import * as moment from 'moment';
import { Facebook } from '@awesome-cordova-plugins/facebook/ngx';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
import { voucherService } from '../providers/voucherService';
@Component({
  selector: 'app-combodone',
  templateUrl: './combodone.page.html',
  styleUrls: ['./combodone.page.scss'],
})
export class CombodonePage implements OnInit {
  code; priceshow; text; listcars; loccation; checkreview; status; room; nameroom;
  constructor(public _platform: Platform,public bookCombo:Bookcombo, public Roomif: RoomInfo, public navCtrl: NavController, public zone: NgZone,
    public booking: Booking, public authService: AuthService, public activatedRoute: ActivatedRoute, public router: Router,
    public storage: Storage, public gf: GlobalFunction, public alertCtrl: AlertController, private launchReview: LaunchReview,
    private fb: Facebook,
    public Bookcombo: Bookcombo,
    public searchhotel: SearchHotel, private _calendar: Calendar,
    public _voucherService: voucherService) {
    this.listcars = this.gf.getParams('carscombo');
    this.priceshow =this.bookCombo.totalprice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
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
    this.bookCombo.promoCode="";
    this.bookCombo.discountpromo=0;
  }
  GetUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.gf.getUserInfo(auth_token).then((data) => {
            if (data && data.statusCode != 401) {
              var data = data;
              se.storage.set("email", data.email);
              se.storage.set("username", data.fullname);
              se.storage.set("phone", data.phone);
              se.storage.set("point", data.point);
            }
        });
      }
    })
    se.searchhotel.totalPrice = se.priceshow;
    se.gf.logEventFirebase(se.searchhotel.paymentType,se.searchhotel, 'combodone', 'purchase', 'Combo');
  }
  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('code');
    this.status = this.Roomif.payment;
    this.checkPaymentperiod();
  }
  checkPaymentperiod()
  {
    if (this.status == 'AL' && this.Roomif.expiredtime) {
      var se=this;
      var ti = new Date();
      var DateNow = moment(ti).format('YYYYMMDD');
      var _timetemp=new Date(this.Roomif.expiredtime);
      var timetemp=new Date(this.Roomif.expiredtime);
      var restime = timetemp.setTime(timetemp.getTime() - (30 * 60 * 1000));
      var PaymentPeriodcovert=moment(restime).format('YYYYMMDDHHmm');
      var thu = moment(restime).format('dddd');
      let PaymentPeriod = this.Roomif.expiredtime;
      if(se.bookCombo.isHBEDBooking){
        if(PaymentPeriod){
          let _paymentPeriodcovert = moment(PaymentPeriod).format('YYYYMMDDHHmm');
          let _dateNow = moment(ti).add(30, 'minutes').format('YYYYMMDDHHmm');
          if (parseInt(_paymentPeriodcovert) >= parseInt(_dateNow)) {
            let addhours = moment(ti).add(30, 'minutes').format('HH:mm');
            se.text = addhours + ' cùng ngày';
          }else{
            let textthu= se.getDay(thu);
            let day=moment(PaymentPeriod).format('DD')+ ' '+ 'thg' + ' ' +  moment(PaymentPeriod).format('MM') +', ' +moment(PaymentPeriod).format('YYYY') 
            se.text = moment(PaymentPeriod).format('HH:mm') + ' ' + textthu + ', ' + day;
          }
        }else{
          let addhours = moment(ti).add(30, 'minutes').format('HH:mm');
          se.text = addhours + ' cùng ngày';
        }
        
      }else if(se.bookCombo.isAGODABooking){
        if(PaymentPeriod){
          let _paymentPeriodcovert = moment(PaymentPeriod).format('YYYYMMDDHHmm');
          let _dateNow = moment(ti).add(1, 'hours').format('YYYYMMDDHHmm');
          if (parseInt(_paymentPeriodcovert) >= parseInt(_dateNow)) {
            let addhours = moment(ti).add(1, 'hours').format('HH:mm');
            se.text = addhours + ' cùng ngày';
          }else{
            let textthu= se.getDay(thu);
            let day=moment(PaymentPeriod).format('DD')+ ' '+ 'thg' + ' ' +  moment(PaymentPeriod).format('MM') +', ' +moment(PaymentPeriod).format('YYYY') 
            se.text = moment(PaymentPeriod).format('HH:mm') + ' ' + textthu + ', ' + day;
          }
        }
        else{
          let addhours = moment(ti).add(1, 'hours').format('HH:mm');
          se.text = addhours + ' cùng ngày';
        }
        
      }
        else {
        var ho = ti.getHours();
        if (ho > 0 && ho < 6) {
          DateNow = DateNow + '1100';
          if (parseInt(PaymentPeriodcovert) >= parseInt(DateNow)) {
            se.text = '11 am cùng ngày';
          }
          else {
            var textthu= se.getDay(thu);
            if(Math.abs(moment(ti).diff(timetemp,'minutes')) < 30) {
              var day=moment(_timetemp).format('DD')+ ' '+ 'thg' + ' ' +  moment(_timetemp).format('MM') +', ' +moment(_timetemp).format('YYYY') 
              se.text = moment(_timetemp).format('HH:mm') + ' ' + textthu + ', ' + day;
          }
          else{
            var day=moment(restime).format('DD')+ ' '+ 'thg' + ' ' +  moment(restime).format('MM') +', ' +moment(restime).format('YYYY') 
            se.text = moment(restime).format('HH:mm') + ' ' + textthu + ', ' + day;
          }
          }
        }
        else if (ho >= 6 && ho < 12) {
          DateNow = DateNow + '1700';
          if (parseInt(PaymentPeriodcovert) >= parseInt(DateNow)) {
            se.text = '17h cùng ngày';
          }
          else {
            var textthu= se.getDay(thu);
            if(Math.abs(moment(ti).diff(timetemp,'minutes')) < 30) {
              var day=moment(_timetemp).format('DD')+ ' '+ 'thg' + ' ' +  moment(_timetemp).format('MM') +', ' +moment(_timetemp).format('YYYY') 
              se.text = moment(_timetemp).format('HH:mm') + ' ' + textthu + ', ' + day;
          }
          else{
            var day=moment(restime).format('DD')+ ' '+ 'thg' + ' ' +  moment(restime).format('MM') +', ' +moment(restime).format('YYYY') 
            se.text = moment(restime).format('HH:mm') + ' ' + textthu + ', ' + day;
          }
          }
        }
        else if (ho >= 12 && ho < 20) {
          DateNow = DateNow + '2030';
          if (parseInt(PaymentPeriodcovert) >= parseInt(DateNow)) {
            se.text = '20h30 cùng ngày'
          }
          else {
            var textthu= se.getDay(thu);
            if(Math.abs(moment(ti).diff(timetemp,'minutes')) < 30) {
              var day=moment(_timetemp).format('DD')+ ' '+ 'thg' + ' ' +  moment(_timetemp).format('MM') +', ' +moment(_timetemp).format('YYYY') 
              se.text = moment(_timetemp).format('HH:mm') + ' ' + textthu + ', ' + day;
          }
          else{
            var day=moment(restime).format('DD')+ ' '+ 'thg' + ' ' +  moment(restime).format('MM') +', ' +moment(restime).format('YYYY') 
            se.text = moment(restime).format('HH:mm') + ' ' + textthu + ', ' + day;
          }
          }
        }
        else {
          var res = ti.setTime(ti.getTime() + (24 * 60 * 60 * 1000));
          var date = new Date(res);
          var checkDate = moment(date).format('YYYYMMDD') + '1100';
          if (parseInt(PaymentPeriodcovert) >= parseInt(checkDate)) {
            se.text = '11 am hôm sau';
          } else {
            var textthu= se.getDay(thu);
            if(Math.abs(moment(ti).diff(timetemp,'minutes')) < 30) {
              var day=moment(_timetemp).format('DD')+ ' '+ 'thg' + ' ' +  moment(_timetemp).format('MM') +', ' +moment(_timetemp).format('YYYY') 
              se.text = moment(_timetemp).format('HH:mm') + ' ' + textthu + ', ' + day;
          }
          else{
            var day=moment(restime).format('DD')+ ' '+ 'thg' + ' ' +  moment(restime).format('MM') +', ' +moment(restime).format('YYYY') 
            se.text = moment(restime).format('HH:mm') + ' ' + textthu + ', ' + day;
          }
          }
        }
      }
    }
    else{
      let ho=-1;
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
  getDay(thu)
  {
    switch (thu) {
      case "Monday":
        thu = "Thứ 2"
        break;
      case "Tuesday":
        thu = "Thứ 3"
        break;
      case "Wednesday":
        thu = "Thứ 4"
        break;
      case "Thursday":
        thu = "Thứ 5"
        break;
      case "Friday":
        thu = "Thứ 6"
        break;
      case "Saturday":
        thu = "Thứ 7"
        break;
      default:
        thu = "Chủ nhật"
        break;
    }
    return thu;
  }
  next() {
    this.gf.setParams(2, 'seemoreblog');
    if (this.checkreview == 0) {
      this.showConfirm();
    }
    this.bookCombo.isAGODABooking = false;
    this.bookCombo.isHBEDBooking = false;
    this.bookCombo.roomPenalty = false;
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
    se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_PURCHASED, {'fb_content_type': 'hotel' ,'fb_content_id': se.Bookcombo.HotelCode ? se.Bookcombo.HotelCode : se.booking.code,'fb_num_items': se.searchhotel.roomnumber, 'fb_value': se.gf.convertNumberToDouble(se.priceshow) ,  'fb_currency': 'VND' ,
    'checkin_date': se.booking.CheckInDate ,'checkout_date ': se.booking.CheckOutDate,'num_adults': se.searchhotel.adult,'num_children': (se.searchhotel.child ? se.searchhotel.child : 0) }, se.gf.convertStringToNumber(se.priceshow) );
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
