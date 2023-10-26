import { Component, NgZone } from '@angular/core';
import { NavController, Platform, ModalController, ToastController } from '@ionic/angular';
import { ComboPrice } from '../providers/comboPrice';
import { Bookcombo, SearchHotel, ValueGlobal } from '../providers/book-service';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-departurecalendar',
  templateUrl: 'departurecalendar.html',
  styleUrls: ['departurecalendar.scss'],
})
export class DepartureCalendarPage {
  date: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  public listPriceDate;
  public currentDay;
  public comboId;
  public region;
  public startdate;
  public enddate; arrBOD;ischeckBOD
  constructor(public platform: Platform, public navCtrl: NavController, public comboPrice: ComboPrice, public modalCtrl: ModalController,
    public bookCombo: Bookcombo, public searchhotel: SearchHotel, private activatedRoute: ActivatedRoute, public zone: NgZone,
    public gf: GlobalFunction, public toastCtrl: ToastController,
    public valueGlobal:ValueGlobal) {
    //Xử lý nút back của dt
    platform.ready().then(() => {
      this.platform.backButton.subscribe(() => {
        // code that is executed when the user pressed the back button
        this.modalCtrl.dismiss('closeevent');
      })
    })
    var se = this;
    let params = se.gf.getParams('departure');
    se.comboId = params.comboId;
    se.region = params.fromPlace;
    se.startdate = params.comboStartDate;
    se.enddate = params.comboEndDate;
    this.ischeckBOD=this.searchhotel.ischeckBOD;
    if (se.comboId && se.region) {
      let headers = {};
      let strUrl = C.urls.baseUrl.urlMobile + "//get-min-price-calendar?comboId=" + se.comboId + "&fromPlace=" + se.region;
      this.gf.RequestApi('GET', strUrl, headers, { }, 'departureCalendar', 'initpage').then((data)=>{

        var lstDate = data;
        if (lstDate.length > 0) {
          se.listPriceDate = [];
          se.listPriceDate = lstDate;
          se.date = se.searchhotel.CheckInDate ? new Date(se.searchhotel.CheckInDate) : new Date();
          se.currentDay = se.date.getDate();
          // se.zone.run(() => {
          //   se.getBOD();
          // })
          se.arrBOD =  se.valueGlobal.notSuggestDailyCB;
          se.getDaysOfMonth();
        }
      })

    }
    //google analytic
    gf.googleAnalytion('departurecalendar', 'load', '');
  }

  getDaysOfMonth() {
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    if (this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();
    } else {
      this.currentDate = 999;
    }

    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    var curmonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getMonth();
    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
    if(firstDayThisMonth <1){
      firstDayThisMonth = 7-firstDayThisMonth;
    }
    for (var i = prevNumOfDays - (firstDayThisMonth - 2); i <= prevNumOfDays; i++) {
      //var d = new Date(this.date.getFullYear(), (this.date.getMonth() === new Date().getMonth() ? curmonth : curmonth - 1), i);
      var d = new Date(this.date.getFullYear(),  curmonth - 1, i);
      var obj = this.listPriceDate.filter((cp: ComboPrice) => new Date(cp.day).toDateString() == d.toDateString());
      if (obj.length > 0) {
        obj.map((o: ComboPrice) => o.dateDisplay = d.getDate().toString());
        obj[0].addday=moment(d).format('YYYY-MM-DD');
        this.daysInLastMonth.push(obj[0]);
      } else {
        var newObj = {
          dateDisplay: i,
          day: moment(d).format('MM-DD-YYYY'),
          addday: moment(d).format('YYYY-MM-DD')
        }
        this.daysInLastMonth.push(newObj);
      }
    }

    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
    for (var i = 0; i < thisNumOfDays; i++) {
      var d1 = new Date(this.date.getFullYear(), curmonth, i + 1);
      var obj1 = this.listPriceDate.filter((cp: ComboPrice) => new Date(cp.day).toDateString() == d1.toDateString());
      if (obj1.length > 0) {
        obj1.map((o: ComboPrice) => o.dateDisplay = d1.getDate().toString());
        obj1[0].addday=moment(d1).format('YYYY-MM-DD');
        this.daysInThisMonth.push(obj1[0]);
      }
      else {
        var newObj = {
          dateDisplay: i + 1,
          day: moment(d1).format('MM-DD-YYYY'),
          addday: moment(d1).format('YYYY-MM-DD')
        }
        this.daysInThisMonth.push(newObj);
      }
    }

    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();
    var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0).getDate();
    for (var i = 0; i < (6 - lastDayThisMonth); i++) {
      var d2 = new Date(this.date.getFullYear(), this.date.getMonth() + 1, i + 1);
      var obj1 = this.listPriceDate.filter((cp: ComboPrice) => new Date(cp.day).toDateString() == d2.toDateString());
      if (obj1.length > 0) {
        obj1.map((o: ComboPrice) => o.dateDisplay = d2.getDate().toString());
        obj1[0].addday=moment(d2).format('YYYY-MM-DD');
        this.daysInNextMonth.push(obj1[0]);
      }
      else {
        var newObj = {
          dateDisplay: i + 1,
          day: moment(d2).format('MM-DD-YYYY'),
          addday: moment(d2).format('YYYY-MM-DD')
        }
        this.daysInNextMonth.push(newObj);
      }
      //this.daysInNextMonth.push(i+1);
    }
    var totalDays = this.daysInLastMonth.length + this.daysInThisMonth.length + this.daysInNextMonth.length;
    if (totalDays < 36) {
      for (var i = (7 - lastDayThisMonth); i < ((7 - lastDayThisMonth) + 7); i++) {
        var d3 = new Date(this.date.getFullYear(), this.date.getMonth() + 1, i);
        var obj1 = this.listPriceDate.filter((cp: ComboPrice) => new Date(cp.day).toDateString() == d3.toDateString());
        if (obj1.length > 0) {
          obj1.map((o: ComboPrice) => o.dateDisplay = d3.getDate().toString());
          obj1[0].addday=moment(d3).format('YYYY-MM-DD');
          this.daysInNextMonth.push(obj1[0]);
        }
        else {
          var newObj = {
            dateDisplay: i,
            day: moment(d3).format('MM-DD-YYYY'),
            addday: moment(d3).format('YYYY-MM-DD')
          }
          this.daysInNextMonth.push(newObj);
        }
        //this.daysInNextMonth.push(i);
      }
    }
    if (this.daysInLastMonth.length >0 && this.daysInLastMonth[0].day=="07/30/2019") {
      let d2 = new Date(this.date.getFullYear(), this.date.getMonth() + 1, i + 1);
      this.daysInLastMonth=[];
      var newObj = {
        dateDisplay: 30,
        day: moment(d2).format('06-30-2019'),
        addday: moment(d2).format('2019-06-30')
      }
      this.daysInLastMonth.push(newObj);
    }
    if (this.arrBOD.length > 0) {
      if (this.daysInThisMonth.length > 0) {
        for (let i = 0; i < this.daysInThisMonth.length; i++) {
          var date = this.daysInThisMonth[i].addday
          this.daysInThisMonth[i].BOD = false;
          for (let j = 0; j < this.arrBOD.length; j++) {
            if (date == this.arrBOD[j]) {
              this.daysInThisMonth[i].BOD = true;
              break;
            }
          }
        }
      }
      if (this.daysInLastMonth.length > 0) {
        for (let i = 0; i < this.daysInLastMonth.length; i++) {
          var date = this.daysInLastMonth[i].addday
          this.daysInLastMonth[i].BOD = false;
          for (let j = 0; j < this.arrBOD.length; j++) {
            if (date == this.arrBOD[j]) {
              this.daysInLastMonth[i].BOD = true;
              break;
            }
          }
        }
      }
      if (this.daysInNextMonth.length > 0) {
        for (let i = 0; i < this.daysInNextMonth.length; i++) {
          var date = this.daysInNextMonth[i].addday
          this.daysInNextMonth[i].BOD = false;
          for (let j = 0; j < this.arrBOD.length; j++) {
            if (date == this.arrBOD[j]) {
              this.daysInNextMonth[i].BOD = true;
              break;
            }
          }
        }
      }
    }
    if(this.valueGlobal.notSuggestDailyCB.length>0){
      if (this.daysInThisMonth.length > 0) {
        for (let i = 0; i < this.daysInThisMonth.length; i++) {
          var date = this.daysInThisMonth[i].addday
          this.daysInThisMonth[i].BOD = false;
          for (let j = 0; j < this.valueGlobal.notSuggestDailyCB.length; j++) {
            if (date == this.valueGlobal.notSuggestDailyCB[j]) {
              this.daysInThisMonth[i].BOD = true;
              break;
            }
          }
        }
      }
      if (this.daysInLastMonth && this.daysInLastMonth.length > 0) {
        for (let i = 0; i < this.daysInLastMonth.length; i++) {
          var date = this.daysInLastMonth[i].addday
          this.daysInLastMonth[i].BOD = false;
          for (let j = 0; j < this.valueGlobal.notSuggestDailyCB.length; j++) {
            if (date == this.valueGlobal.notSuggestDailyCB[j]) {
              this.daysInLastMonth[i].BOD = true;
              break;
            }
          }
        }
      }
      if (this.daysInNextMonth && this.daysInNextMonth.length > 0) {
        for (let i = 0; i < this.daysInNextMonth.length; i++) {
          var date = this.daysInNextMonth[i].addday
          this.daysInNextMonth[i].BOD = false;
          for (let j = 0; j < this.valueGlobal.notSuggestDailyCB.length; j++) {
            if (date == this.valueGlobal.notSuggestDailyCB[j]) {
              this.daysInNextMonth[i].BOD = true;
              break;
            }
          }
        }
      }
    }
  }

  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
  }
  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
    this.getDaysOfMonth();
  }

  changeDateCombo(dateObject) {
    //Thêm kiểm tra ngày chọn trên lịch không được nhỏ hơn ngày hiện tại
    if (dateObject.day && this.checkValidChoiceDate(dateObject.day)) {
      this.bookCombo.CheckInDate = dateObject.day;
      //fix lỗi đổi ngày checkin trên lịch khởi hành => đổi cả ngày checkout
      if (this.searchhotel.CheckInDate && this.searchhotel.CheckOutDate) {
        var numday = moment(this.searchhotel.CheckOutDate).diff(moment(this.searchhotel.CheckInDate), 'days');
        var dcin = new Date(this.bookCombo.CheckInDate);
        var res = dcin.setTime(dcin.getTime() + (numday * 24 * 60 * 60 * 1000));
        var dcout = new Date(res);
        this.bookCombo.CheckOutDate = moment(dcout).format('YYYY-MM-DD');
        this.searchhotel.CheckInDate = moment(new Date(this.bookCombo.CheckInDate)).format('YYYY-MM-DD');
        this.searchhotel.CheckOutDate = this.bookCombo.CheckOutDate;
        this.gf.setCacheSearchHotelInfo({checkInDate: this.searchhotel.CheckInDate, checkOutDate: this.searchhotel.CheckOutDate, adult: this.searchhotel.adult, child: this.searchhotel.child, childAge: this.searchhotel.arrchild, roomNumber: this.searchhotel.roomnumber});
      }
      this.searchhotel.ischeckBOD=false;
      if (this.arrBOD.length>0) {
        var checkcintemp = new Date(this.searchhotel.CheckInDate );
        var checkdatecout = new Date(this.searchhotel.CheckOutDate);
        var checkcin=moment(checkcintemp).format('YYYYMMDD');
        var checkcout=moment(checkdatecout).format('YYYYMMDD');
        for (let i = 0; i < this.arrBOD.length; i++) {
          var checkBODtemp = new Date(this.arrBOD[i]);
          var checkBOD=moment(checkBODtemp).format('YYYYMMDD');
          if (checkcin<=checkBOD&&checkBOD<checkcout) {
            this.searchhotel.ischeckBOD=true;
            break;
          }
        }
      }
      this.modalCtrl.dismiss();
    }
  }
  /**
   * Hàm kiểm tra ngày chọn trên lịch không được nhỏ hơn ngày hiện tại
   * @param selectedDate Ngày chọn trên lịch
   */
  checkValidChoiceDate(selectedDate) {
    let res = true;
    let today = new Date();
    let arr = this.startdate.split('-');
    let arr_ed = this.enddate.split('-');
    let sd = new Date(arr[2], arr[1] - 1, arr[0]);
    let ed = new Date(arr_ed[2], arr_ed[1] - 1, arr_ed[0]);
    if (moment(today).diff(selectedDate, 'days') > 0) {
      this.showToastr('Ngày khởi hành không được nhỏ hơn ngày hiện tại. Vui lòng chọn lại.');
      res = false;
      return false;
    }
    if (moment(selectedDate).diff(ed, 'days') > 0) {
      res = false;
      this.showToastr('Combo chỉ áp dụng trong khoảng ' + this.startdate + ' đến ' + this.enddate + '. Vui lòng chọn lại.');
      return false;
    }
    return res;
  }

  async showToastr(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    })
    toast.present();
  }
  close() {
    this.searchhotel.ischeckBOD=this.ischeckBOD;
    this.modalCtrl.dismiss('closeevent');
  }
}
