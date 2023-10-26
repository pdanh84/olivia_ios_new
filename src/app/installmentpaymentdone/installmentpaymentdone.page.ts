import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../providers/globalfunction';
import { NavController,Platform } from '@ionic/angular';
import { Booking, ValueGlobal, SearchHotel,RoomInfo } from '../providers/book-service';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
@Component({
  selector: 'app-installmentpaymentdone',
  templateUrl: './installmentpaymentdone.page.html',
  styleUrls: ['./installmentpaymentdone.page.scss'],
})
export class InstallmentpaymentdonePage implements OnInit {
  paymentsuccess: any = false;
  code: any;
  errorcode: string="";
  email: string;
  nameroom="";room
  constructor(public activityService: ActivityService,
    private navCtrl: NavController,
    public booking: Booking,
    public valueGlobal: ValueGlobal,
    public searchhotel: SearchHotel,public _platform: Platform, private _calendar: Calendar, public Roomif: RoomInfo) {
    var se = this;
    if(se.activityService.installmentPaymentSuccess){
      se.paymentsuccess = true;
      se.activityService.installmentPaymentSuccess = false;
      se.code = se.booking.code;
      se.email = se.booking.CEmail;
      //se.booking.code = null;
    }else{
      if(se.activityService.installmentPaymentErrorCode){
        se.errorcode = se.activityService.installmentPaymentErrorCode;
        se.code = se.booking.code;
        se.email = se.booking.CEmail;
      }
    }
    
   }

  ngOnInit() {
  }
  next() {
    this.activityService.objBankInStallment = null;
    //this.searchhotel.backPage = "foodpaymentdonepage";
    this.navCtrl.navigateBack('/app/tabs/tab1');
  }
  addToCalendar() {
    let se = this;
    if (se._platform.is("cordova")) {
        se.createCalendar(true);
    }
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
      title: se.booking.HotelName,
      location: "",
      message: strmess,
      startDate: se.booking.CheckInDate+"T"+se.booking.CheckinTime+":00",
      endDate: se.booking.CheckInDate+"T"+se.booking.CheckoutTime+":00",
      calOptions
    };
    se._calendar.hasReadWritePermission().then((allow) => {
      let sdate = new Date(event.startDate),
        edate = new Date(event.endDate);
      if (allow) {
        if (createOrModify) {//true - tạo mới
          //se.gf.showLoadingwithtimeout();
          se._calendar.createEventWithOptions(event.title, event.location, event.message, sdate, edate, event.calOptions).then(() => {
            se._calendar.openCalendar(new Date(se.booking.CheckInDate+"T"+se.booking.CheckinTime+":00")).then(() => {
            });
          });
        }  
        se.navCtrl.navigateBack(['/app/tabs/tab3']);
      } else {
        se._calendar.requestReadWritePermission().then(() => {
          if (createOrModify) {//true - tạo mới
            // se.gf.showLoadingwithtimeout();
            se._calendar.createEventWithOptions(event.title, event.location, event.message, sdate, edate, event.calOptions).then(() => {

              se._calendar.openCalendar(new Date(se.booking.CheckInDate+"T"+se.booking.CheckinTime+":00")).then(() => {

              });
            });
          } else {

          }
        })
      }
     
    })
  }
}

