import { SearchHotel, ValueGlobal } from './../providers/book-service';
import { ModalController, NavController } from '@ionic/angular';
import { Component, OnInit, NgZone } from '@angular/core';
import * as moment from "moment";
import * as $ from 'jquery';

import { SelectDateRangePage } from '../selectdaterange/selectdaterange.page';
import { GlobalFunction } from '../providers/globalfunction';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-popupinfobkg',
  templateUrl: './popupinfobkg.page.html',
  styleUrls: ['./popupinfobkg.page.scss'],
})
export class PopupinfobkgPage implements OnInit {
  cindisplay;coutdisplay;cinthu;coutthu;cofdate=0;cotdate=0;adult=2;child=0;roomnumber=1;
  cin;cout;datecin;datecout;
  public myCalendar: any;
  _daysConfig: any[] = [];
  nightCount: any=0;
  ischeckcalendar=true;
  changedate: any;
  constructor(public modalCtrl: ModalController, public zone: NgZone,public searchhotel:SearchHotel,public valueGlobal:ValueGlobal,public navCtrl:NavController,
    public gf: GlobalFunction,
    private storage: Storage) {
   }
  ngOnInit() {

  }
  ionViewWillEnter() {
    this.changedate = false;
    if(this.valueGlobal.listlunar){
      for (let j = 0; j < this.valueGlobal.listlunar.length; j++) {
        this._daysConfig.push({
          date: this.valueGlobal.listlunar[j].date,
          subTitle: this.valueGlobal.listlunar[j].name,
          cssClass: 'lunarcalendar'
        })
      }
    }
    
    if (this.searchhotel.adult) {
      this.adult = this.searchhotel.adult;
    }
    if (this.searchhotel.child != null) {
      this.child = this.searchhotel.child;
    }
    if (this.searchhotel.child == 0) {
      this.child = this.searchhotel.child;
    }
    if (this.searchhotel.roomnumber) {
      this.roomnumber = this.searchhotel.roomnumber;
    }
    //check ngày tháng
    if (this.searchhotel.CheckInDate) {
      this.cin = this.searchhotel.CheckInDate;
      this.cout = this.searchhotel.CheckOutDate;

      this.datecin = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckInDate));
      this.datecout = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckOutDate));
      this.cindisplay = moment(this.datecin).format('DD-MM');
      this.coutdisplay = moment(this.datecout).format('DD-MM');
    } else {
      this.cin = new Date(this.gf.getCinIsoDate(new Date()));
      var rescin = this.cin.setTime(this.cin.getTime() + (24 * 60 * 60 * 1000));
      var datein = new Date(this.gf.getCinIsoDate(rescin));
      this.cin = moment(datein).format('YYYY-MM-DD');
      this.cindisplay = moment(datein).format('DD-MM');
      this.datecin = new Date(this.gf.getCinIsoDate(rescin));

      this.cout = new Date(this.gf.getCinIsoDate(new Date()));
      var res = this.cout.setTime(this.cout.getTime() + (2 * 24 * 60 * 60 * 1000));
      var date = new Date(this.gf.getCinIsoDate(res));
      this.cout = moment(date).format('YYYY-MM-DD');
      this.coutdisplay = moment(date).format('DD-MM');
      this.datecout = new Date(this.gf.getCinIsoDate(res));
    }
    this.nightCount = moment(this.datecout).diff( moment(this.datecin), 'days');
    this.bindlunar();
  }
  closeModal()
  {
    this.valueGlobal.notRefreshDetail = true;
    if(this.valueGlobal.backValue == 'flightcomboreview'){
      this.valueGlobal.backValue = '';
      this.modalCtrl.dismiss();
    }else{
      this.navCtrl.back();
    }
    
  }

  async openPickupCalendar(){
    let se = this;
    if (se.ischeckcalendar) {
    se.searchhotel.formChangeDate = 3;
    se.valueGlobal.ischeckCB=0;
      let modal = await se.modalCtrl.create({
        component: SelectDateRangePage,
      });

      modal.present().then(() => {
        se.ischeckcalendar=true;
      });

      const event: any = await modal.onDidDismiss();
      const date = event.data;
      if (event.data) {
        se.changedate= true;
        se.cin = moment(se.searchhotel.CheckInDate).format('YYYY-MM-DD');
        se.cout = moment(se.searchhotel.CheckOutDate).format('YYYY-MM-DD');
        se.zone.run(() => {
          se.datecin = new Date(se.gf.getCinIsoDate(se.cin));
          se.datecout = new Date(se.gf.getCinIsoDate(se.cout));
          se.cindisplay = moment(se.datecin).format('DD-MM');
          se.coutdisplay = moment(se.datecout).format('DD-MM');
          se.cindisplay = moment(se.datecin).format('DD-MM');
          se.coutdisplay = moment(se.datecout).format('DD-MM');
          se.nightCount = moment(se.datecout).diff( moment(se.datecin), 'days');
          se.gf.setCacheSearchHotelInfo({checkInDate: se.searchhotel.CheckInDate, checkOutDate: se.searchhotel.CheckOutDate, adult: se.searchhotel.adult, child: se.searchhotel.child, childAge: se.searchhotel.arrchild, roomNumber: se.searchhotel.roomnumber});
          se.storage.set('hasChangeDate', true);
          se.cinthu=''; se.coutthu='';
          // se.getDayName(se.datecin, se.datecout);
          this.bindlunar();
        })
      }
    }
  }

  async clickedElement(e: any) {
    var obj: any = e.currentTarget;
    if ($(obj.parentNode).hasClass('endSelection') || $(obj.parentNode).hasClass('startSelection')) {
      if (this.modalCtrl) {
        let fday: any;
        let tday: any;
        var monthenddate: any;
        var yearenddate: any;
        var monthstartdate: any;
        var yearstartdate: any;
        var objTextMonthEndDate: any;
        var objTextMonthStartDate: any;
        this.cofdate = 0;
        this.cotdate = 0;
        this.cinthu = "";
        this.coutthu = "";
        if ($(obj.parentNode).hasClass('endSelection')) {
          // fday = $('.on-selected')[0].textContent;
          // tday = $(obj)[0].textContent;
          if ( $('.days-btn.lunarcalendar.on-selected > p')[0]) {
            fday= $('.days-btn.lunarcalendar.on-selected > p')[0].innerText;
          } else {
            fday = $('.on-selected')[0].textContent;
          }
          if ($('.days.endSelection .days-btn.lunarcalendar > p')[0]) {
            tday = $('.days.endSelection .days-btn.lunarcalendar > p')[0].innerText; 
          } else {
            tday = $(obj)[0].textContent;
          }
          objTextMonthStartDate = $('.on-selected').closest('.month-box').children()[0].textContent;
          objTextMonthEndDate = $(obj).closest('.month-box').children()[0].textContent;
        } else {
          if ($('.days-btn.lunarcalendar.on-selected > p')[0]) {
            fday =$('.days-btn.lunarcalendar.on-selected > p')[0].innerText
          }
          else{
            fday = $(obj)[0].textContent;
          }
          if ($('.days.endSelection .days-btn.lunarcalendar > p')[0]) {
            tday = $('.days.endSelection .days-btn.lunarcalendar > p')[0].innerText;
          }
          else{
            tday = $('.endSelection').children('.days-btn')[0].textContent;
          }
          objTextMonthStartDate = $(obj).closest('.month-box').children()[0].textContent;
          objTextMonthEndDate = $('.endSelection').closest('.month-box').children()[0].textContent;
        }


        if (objTextMonthEndDate && objTextMonthEndDate.length > 0 && objTextMonthStartDate && objTextMonthStartDate.length > 0) {
          monthstartdate = objTextMonthStartDate.split('/')[0];
          yearstartdate = objTextMonthStartDate.split('/')[1];
          monthenddate = objTextMonthEndDate.split('/')[0];
          yearenddate = objTextMonthEndDate.split('/')[1];
          var fromdate = new Date(yearstartdate, monthstartdate - 1, fday);
          var todate = new Date(yearenddate, monthenddate - 1, tday);
          if (fromdate && todate && moment(todate).diff(fromdate, 'days') > 0) {
            var se = this;
            setTimeout(() => {
              se.modalCtrl.dismiss();
            }, 100)

            se.cin = moment(fromdate).format('YYYY-MM-DD');
            se.cout = moment(todate).format('YYYY-MM-DD');
            se.zone.run(() => {
              se.searchhotel.CheckInDate = se.cin;
              se.searchhotel.CheckOutDate = se.cout;
              se.datecin = new Date(se.gf.getCinIsoDate(se.cin));
              se.datecout = new Date(se.gf.getCinIsoDate(se.cout));
              se.cindisplay = moment(se.datecin).format('DD-MM');
              se.coutdisplay = moment(se.datecout).format('DD-MM');
              se.cindisplay = moment(se.datecin).format('DD-MM');
              se.coutdisplay = moment(se.datecout).format('DD-MM');
              se.nightCount = moment(se.datecout).diff( moment(se.datecin), 'days');
              se.gf.setCacheSearchHotelInfo({checkInDate: se.searchhotel.CheckInDate, checkOutDate: se.searchhotel.CheckOutDate, adult: se.searchhotel.adult, child: se.searchhotel.child, childAge: se.searchhotel.arrchild, roomNumber: se.searchhotel.roomnumber});
              //xử lý âm lịch
              this.bindlunar();
              //se.getDayName(se.datecin, se.datecout);
            })
          }
        }
      }
    }
  }
  openmnu() {
    this.searchhotel.CheckInDate = this.cin;
    this.searchhotel.CheckOutDate = this.cout;
    // this.modalCtrl.dismiss();
    this.navCtrl.navigateForward('/occupancy');
  }
  search()
  {
    this.searchhotel.CheckInDate = this.cin;
    this.searchhotel.CheckOutDate = this.cout;
    this.gf.setCacheSearchHotelInfo({checkInDate: this.searchhotel.CheckInDate, checkOutDate: this.searchhotel.CheckOutDate, adult: this.searchhotel.adult, child: this.searchhotel.child, childAge: this.searchhotel.arrchild, roomNumber: this.searchhotel.roomnumber});
    this.searchhotel.publicChangeInfoHotelList(1);
    if(this.searchhotel.changeInfoFromPage == 'hotellist'){
      this.navCtrl.navigateBack('/hotellist/true');
    }else{
      this.valueGlobal.notRefreshDetail = false;
      this.navCtrl.back();
    }
    
  }
  bindlunar() {
    var se = this;
    if(se.valueGlobal.listlunar){
      for (let i = 0; i < se.valueGlobal.listlunar.length; i++) {
        var checkdate = moment(se.valueGlobal.listlunar[i].date).format('YYYY-MM-DD');
        if (checkdate==se.cin) {
          se.cofdate = 1;
          if (se.valueGlobal.listlunar[i].isNameDisplay==1) {
            var ischecklunar = se.checklunar(se.valueGlobal.listlunar[i].name);
            if (ischecklunar) {
              se.cinthu = se.valueGlobal.listlunar[i].name + ' ' + 'tết';
            }
            else
            {
              se.cinthu = se.valueGlobal.listlunar[i].name
            }
          }
        }
        else{
          se.getDayName(se.cin, se.cout);
        }
        if (checkdate==se.cout) {
          se.cotdate = 1;
          if (se.valueGlobal.listlunar[i].isNameDisplay==1) {
            var ischecklunar = se.checklunar(se.valueGlobal.listlunar[i].name);
            if (ischecklunar) {
              se.coutthu = se.valueGlobal.listlunar[i].name + ' ' + 'tết';
            }
            else
            {
              se.coutthu = se.valueGlobal.listlunar[i].name
            }
          }
        }
        else{
          se.getDayName(se.cin, se.cout);
        }
      }
    }else{
      se.getDayName(se.cin, se.cout);
    }
    
  }
  getDayName(datecin, datecout) {
    if (!this.cinthu) {
      this.cinthu = moment(datecin).format('dddd');
      switch (this.cinthu) {
        case "Monday":
          this.cinthu = "Thứ 2"
          break;
        case "Tuesday":
          this.cinthu = "Thứ 3"
          break;
        case "Wednesday":
          this.cinthu = "Thứ 4"
          break;
        case "Thursday":
          this.cinthu = "Thứ 5"
          break;
        case "Friday":
          this.cinthu = "Thứ 6"
          break;
        case "Saturday":
          this.cinthu = "Thứ 7"
          break;
        default:
          this.cinthu = "Chủ nhật"
          break;
      }
    }
    if (!this.coutthu) {
      this.coutthu = moment(datecout).format('dddd');
      switch (this.coutthu) {
        case "Monday":
          this.coutthu = "Thứ 2"
          break;
        case "Tuesday":
          this.coutthu = "Thứ 3"
          break;
        case "Wednesday":
          this.coutthu = "Thứ 4"
          break;
        case "Thursday":
          this.coutthu = "Thứ 5"
          break;
        case "Friday":
          this.coutthu = "Thứ 6"
          break;
        case "Saturday":
          this.coutthu = "Thứ 7"
          break;
        default:
          this.coutthu = "Chủ nhật"
          break;
      }
    }
  }
  checklunar(s) {
    return s.indexOf('Mùng') >= 0;
  }
}
