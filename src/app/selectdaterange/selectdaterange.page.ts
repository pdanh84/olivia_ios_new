import { Component, OnInit, NgZone, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NavController, Platform, LoadingController, IonContent, ModalController, ToastController } from '@ionic/angular';
import { C } from '../providers/constants';
import * as moment from 'moment';
import * as $ from 'jquery';
import Litepicker from 'litepicker';
import 'litepicker/dist/plugins/mobilefriendly';
import { ValueGlobal, SearchHotel, Bookcombo } from '../providers/book-service';
import { GlobalFunction } from '../providers/globalfunction';
import { flightService } from '../providers/flightService';
import { Storage } from '@ionic/storage';
import { tourService } from '../providers/tourService';
import { ticketService } from '../providers/ticketService';
import { Lunar, BlockLunarDate } from 'lunar-calendar-ts-vi';
var document:any;
@Component({
  selector: 'app-selectdaterange',
  templateUrl: './selectdaterange.page.html',
  styleUrls: ['./selectdaterange.page.scss'],
})
export class SelectDateRangePage implements OnInit {
  picker: any;
  _daysConfig: any = [];
  nightcount: number;
  daycin: string;
  daycout: string;
  daynamecin: string;
  daynamecout: string;
  monthcin: string;
  monthcout: string;
  flightmode: boolean = false;
  roundTrip: any;
  roundtriptext = "khứ hồi/khách";
  countdaydisplay: any = 0;
  countday: number = 1;
  checkInDisplayMonth: string = "";
  checkOutDisplayMonth: string = "";
  showlowestprice: any;
  departCode: any;
  returnCode: any;
  singlemode: boolean;
  requestForm: boolean;
  cindayofweek: string;
  cindaydisplay: string;
  cinmonthdisplay: string;
  coutdayofweek: string;
  coutdaydisplay: string;
  coutmonthdisplay: string;
  tourCalendar: boolean;
  showlunar: boolean = false;
  showFromHotelList: boolean = false;
  showLunarCalendar: boolean = false;
  _daysConfigLunar:any = [];
  currentMonth: any;
  totalPriceStr: any;
  itemDepartureCalendar: any;
  hasAllotment: boolean;
  MsgError: any;
  changeFlightCalendar: boolean = false;


  constructor(private modalCtrl: ModalController,
    public valueGlobal: ValueGlobal,
    public searchhotel: SearchHotel,
    public gf: GlobalFunction,
    private navCtrl: NavController,
    public _flightService: flightService,
    private storage: Storage,
    public bookCombo: Bookcombo, private alertCtrl: ToastController,
    public tourService: tourService, public ticketService: ticketService, public zone: NgZone) {
    this.getListLunar();
    setTimeout(() => {
      if (ticketService.ischeckCalendar) {
        this.initDateRangePickerTicket();
        this.tourCalendar = false;
      }else{
        this.initDateRangePicker();
      }
    
    }, 1)
    this.flightmode = this.searchhotel.formChangeDate >= 4 && this.searchhotel.formChangeDate < 7 ? true : false;
    this.roundTrip = this._flightService.itemFlightCache.roundTrip;
    this.singlemode = ((this.searchhotel.formChangeDate >= 4 && this.searchhotel.formChangeDate < 7 && !this.roundTrip) || (this.searchhotel.formChangeDate == 9 || this.searchhotel.formChangeDate == 10));
    this.requestForm = (this.searchhotel.formChangeDate == 9 || this.searchhotel.formChangeDate == 10 || this.searchhotel.formChangeDate == 11) ? true : false;//true: singlemode
    this.roundtriptext = this.roundTrip ? "khứ hồi/khách" : "một chiều/khách";
    this.tourCalendar = this.searchhotel.formChangeDate == 10;
    this.changeFlightCalendar = this.searchhotel.formChangeDate == 11;
    let diffday = 0;
    if (this._flightService.itemFlightCache.checkOutDate) {
      diffday = moment(this._flightService.itemFlightCache.checkOutDate).diff(this._flightService.itemFlightCache.checkInDate, "days");
    }

    this.countday = diffday;
    this.countdaydisplay = this.countday + 1;
    this.checkInDisplayMonth = this.gf.getDayOfWeek(this._flightService.itemFlightCache.checkInDate).dayname + ", " + moment(this._flightService.itemFlightCache.checkInDate).format("DD") + " thg " + moment(this._flightService.itemFlightCache.checkInDate).format("MM");
    if (this._flightService.itemFlightCache.checkOutDate) {
      this.checkOutDisplayMonth = this.gf.getDayOfWeek(this._flightService.itemFlightCache.checkOutDate).dayname + ", " + moment(this._flightService.itemFlightCache.checkOutDate).format("DD") + " thg " + moment(this._flightService.itemFlightCache.checkOutDate).format("MM");
    }
    this.departCode = this._flightService.itemFlightCache.departCode;
    this.returnCode = this._flightService.itemFlightCache.returnCode;
    this.showlowestprice = this._flightService.itemFlightCache.showCalendarLowestPrice;
    this.showlunar = this.tourService.showLunar;
    this.showLunarCalendar = this._flightService.itemFlightCache.showLunarCalendar;
    this.checkLoadPrice();
    setTimeout(() => {
      this.checkShowLunar();
      this.checkShowAllLunar();
    }, 300)

    this.showFromHotelList = this.searchhotel.changeInfoFromPage == 'hotellist';
    if (this.flightmode) {
      this.currentMonth = moment(this.gf.getCinIsoDate(this._flightService.itemFlightCache.checkInDate)).format("M");
    }
  }

  checkShowAllLunar() {
    if (this.showLunarCalendar && this.searchhotel.formChangeDate >= 4 && this.searchhotel.formChangeDate < 7) {

    }
  }

  checkLoadPrice() {
    if (this.showlowestprice && this.searchhotel.formChangeDate >= 4 && this.searchhotel.formChangeDate < 7) {
      setTimeout(() => {
        if (!this._flightService.itemFlightCache.isInternationalFlight) {
          let key = "listHotDealCalendar_" + this.departCode + "_" + this.returnCode;
          this.storage.get(key).then((data) => {
            if (!data || (data.arrivals && data.arrivals.length == 0 && data.departs && data.departs.length == 0)) {
              this.loadCalendarPrice();
            } else {
              if (this.roundTrip) {//2 chiều
                this.renderCalenderPrice(1, data.departs, data.arrivals);
              } else {//1 chiều
                this.renderCalenderPrice(2, data.departs, null);
              }
            }
          })
        } else {
          this.loadCalendarPrice();
        }

      }, 300)

    }

  }

  ngOnInit() {

  }

  goback(){
      this.modalCtrl.dismiss();
      this.ticketService.ischeckCalendar = false;
      //this.navCtrl.back();
  }

  clickShowLowestPrice(event) {
    this._flightService.itemFlightCache.showCalendarLowestPrice = this.showlowestprice;
    let containermain = this.picker.ui.children[0];
    let containermonth = containermain.children[0];
    if (this.showlowestprice) {
      this.showLunarCalendar = false;
      this._flightService.itemFlightCache.showLunarCalendar = this.showLunarCalendar;
      $('.lunardate').removeClass('date-lunar-visible');
      ($('.chk-showlunar')[0] as any).checked = false;
    }
    for (let index = 0; index < containermonth.children.length; index++) {
      const monthitem = containermonth.children[index];
      $(monthitem).addClass('cls-calendar-display');
    }
    this.checkLoadPrice();
    setTimeout(() => {
      if (!this.tourCalendar) {
        this.renderCustomDayConfig(0);
      }

    }, 100)
  }

  getListLunar() {
    var se = this;
    let tetConfig = ['29 Tết', '30 Tết', 'Mùng 1', 'Mùng 2', 'Mùng 3', 'Mùng 4', 'Mùng 5', 'Mùng 6', 'Mùng 7', 'Mùng 8', 'Mùng 9', 'Mùng 10',];
    let lunarConfig = [{ text: '29 Tết', day: '29/12' },
    { text: '30 Tết', day: '30/12' },
    { text: 'Mùng 1', day: '1/1' },
    { text: 'Mùng 2', day: '2/1' },
    { text: 'Mùng 3', day: '3/1' },
    { text: 'Mùng 4', day: '4/1' },
    { text: 'Mùng 5', day: '5/1' },
    { text: 'Mùng 6', day: '6/1' },
    { text: 'Mùng 7', day: '7/1' },
    { text: 'Mùng 8', day: '8/1' },
    { text: 'Mùng 9', day: '9/1' },
    { text: 'Mùng 10', day: '10/1' },];
    if (se.valueGlobal.listlunar) {
      for (let j = 0; j < se.valueGlobal.listlunar.length; j++) {
        se._daysConfig.push({
          date: se.valueGlobal.listlunar[j].date,
          subTitle: moment(this.valueGlobal.listlunar[j].date).format('D') + ' thg ' + moment(this.valueGlobal.listlunar[j].date).format('M'),
          description: se.valueGlobal.listlunar[j].description,
          cssClass: 'lunarcalendar',
          lunarDate: lunarConfig.filter((item) => { return item.text.indexOf(this.valueGlobal.listlunar[j].name) != -1 }).length > 0 ? lunarConfig.filter((item) => { return item.text.indexOf(this.valueGlobal.listlunar[j].name) != -1 })[0].day : '',
        })
      }
    }

    for (let k = 0; k < 365; k++) {
      let addday = moment(new Date(this.gf.getCinIsoDate(new Date()))).add(k, 'days').format('YYYY-MM-DD');
      const lunar: Lunar = new Lunar();
      lunar.getBlockLunarDate(addday);

      se._daysConfigLunar.push({
        date: addday as any,
        subTitle: lunar.getBlockLunarDate(addday).lunarDate == 1 ? `${lunar.getBlockLunarDate(addday).lunarDate.toString()}/${lunar.getBlockLunarDate(addday).lunarMonth.toString()}` : lunar.getBlockLunarDate(addday).lunarDate.toString(),
        cssClass: 'lunardate',
        month: moment(addday).format('M')
      })

    }
  }

  clickShowLunar() {
    this.tourService.showLunar = this.showlunar;
    if (this.picker) {
      let containermain = this.picker.ui.children[0];
      let containermonth = containermain.children[0];
      for (let index = 0; index < containermonth.children.length; index++) {
        const monthitem = containermonth.children[index];
        $(monthitem).addClass('cls-calendar-display');
      }

      this.checkShowLunar();
      if (this.flightmode && this.showlowestprice) {
        this.checkLoadPrice();
      }
    }

  }

  checkShowLunar() {

    if (this.showlunar) {
      var divCollapse = $('.div-expand-lunar.cls-collapse');
      if (divCollapse && divCollapse.length > 0) {
        divCollapse.removeClass('cls-collapse').addClass('cls-expand');
      }
    } else {
      var divCollapse = $('.div-expand-lunar.cls-expand');
      if (divCollapse && divCollapse.length > 0) {
        divCollapse.removeClass('cls-expand').addClass('cls-collapse');
      }
    }
  }

  refreshDayInfo(justcin) {

    if (justcin) {
      this.daycin = moment(justcin).format('DD');
      this.daynamecin = this.gf.getDayOfWeek(justcin).daynamedaterange;
      this.monthcin = "Thg " + moment(justcin).format('M');
      this.daycout = "";
      this.daynamecout = "";
      this.monthcout = "";
    } else {
      this.daycin = moment(this.searchhotel.CheckInDate).format('DD');
      this.daynamecin = this.gf.getDayOfWeek(this.searchhotel.CheckInDate).daynamedaterange;
      this.monthcin = "Thg " + moment(this.searchhotel.CheckInDate).format('M');
      if (this.searchhotel.CheckOutDate) {
        this.daycout = moment(this.searchhotel.CheckOutDate).format('DD');
        this.daynamecout = this.gf.getDayOfWeek(this.searchhotel.CheckOutDate).daynamedaterange;
        this.monthcout = "Thg " + moment(this.searchhotel.CheckOutDate).format('M');
      }

      let fromdate = new Date(moment(this.flightmode ? this.gf.getCinIsoDate(this._flightService.itemFlightCache.checkInDate) : this.gf.getCinIsoDate(this.searchhotel.CheckInDate)).format('YYYY-MM-DD'));
      let todate = new Date(moment(this.flightmode ? this.gf.getCinIsoDate(this._flightService.itemFlightCache.checkOutDate) : this.gf.getCinIsoDate(this.searchhotel.CheckOutDate)).format('YYYY-MM-DD'));

      this.cindayofweek = this.gf.getDayOfWeek(fromdate).daynameshort;
      this.cindaydisplay = moment(fromdate).format('DD');
      this.cinmonthdisplay = 'Thg ' + moment(fromdate).format('M');

      this.coutdayofweek = this.gf.getDayOfWeek(todate).daynameshort;
      this.coutdaydisplay = moment(todate).format('DD');
      this.coutmonthdisplay = 'Thg ' + moment(todate).format('M');

      //this.countday = moment(todate).diff(moment(fromdate),'days');
      //this.countdaydisplay = (this.flighttype == "twoway") ? (this.countday +1) : 1;
    }

  }

  refreshFlightCinCoutInfo(isCheckIn) {

    this.checkInDisplayMonth = this.gf.getDayOfWeek(this._flightService.itemFlightCache.checkInDate).dayname + ", " + moment(this._flightService.itemFlightCache.checkInDate).format("DD") + " thg " + moment(this._flightService.itemFlightCache.checkInDate).format("MM");
    this.checkOutDisplayMonth = isCheckIn ? "" : this.gf.getDayOfWeek(this._flightService.itemFlightCache.checkOutDate).dayname + ", " + moment(this._flightService.itemFlightCache.checkOutDate).format("DD") + " thg " + moment(this._flightService.itemFlightCache.checkOutDate).format("MM");
    let diffday = moment(this._flightService.itemFlightCache.checkOutDate).diff(this._flightService.itemFlightCache.checkInDate, "days");
    this.countday = diffday;
    this.countdaydisplay = isCheckIn ? "" : this.countday + 1;
  }

  initDateRangePicker() {
    this.refreshDayInfo(0);
    if (!this.picker) {
      let daycf = [];
      if (this._daysConfig && this._daysConfig.length > 0) {
        daycf = this._daysConfig.map((d) => { return moment(d.date).format('YYYY-MM-DD') })
      }

      let lunarConfig = [{ text: '29 Tết', day: '29/12' },
      { text: '30 Tết', day: '30/12' },
      { text: 'Mùng 1', day: '1/1' },
      { text: 'Mùng 2', day: '2/1' },
      { text: 'Mùng 3', day: '3/1' },
      { text: 'Mùng 4', day: '4/1' },
      { text: 'Mùng 5', day: '5/1' },
      { text: 'Mùng 6', day: '6/1' },
      { text: 'Mùng 7', day: '7/1' },
      { text: 'Mùng 8', day: '8/1' },
      { text: 'Mùng 9', day: '9/1' },
      { text: 'Mùng 10', day: '10/1' },];
      let tetConfig = ['29 Tết', '30 Tết', 'Mùng 1', 'Mùng 2', 'Mùng 3', 'Mùng 4', 'Mùng 5', 'Mùng 6', 'Mùng 7', 'Mùng 8', 'Mùng 9', 'Mùng 10',];
      let _daysConfig:any = [];
      if (this.valueGlobal.listlunar) {
        for (let j = 0; j < this.valueGlobal.listlunar.length; j++) {
          _daysConfig.push({
            date: this.valueGlobal.listlunar[j].date,
            subTitle: moment(this.valueGlobal.listlunar[j].date).format('D') + ' thg ' + moment(this.valueGlobal.listlunar[j].date).format('M'),
            description: this.valueGlobal.listlunar[j].description,
            cssClass: 'dayhot',
            lunarDate: lunarConfig.filter((item) => { return item.text.indexOf(this.valueGlobal.listlunar[j].name) != -1 }).length > 0 ? lunarConfig.filter((item) => { return item.text.indexOf(this.valueGlobal.listlunar[j].name) != -1 })[0].day : '',
          })
        }
      }
      let se = this;
      this.picker = new Litepicker({
        element: window.document.getElementById('litepicker') as any,
        //plugins: ['mobilefriendly'],
        lockDaysFilter(date1, date2, totalPicked) {
          return (se.tourCalendar && se.tourService.departures && se.tourService.departures.length > 0)
            ?(se.tourService.departures.includes(moment((date1 as any).dateInstance).format('YYYY-MM-DD')) ? false : true) : false;
        },
        startDate: se.tourCalendar ? this.gf.getCinIsoDate((se.tourService.itemDepartureCalendar ? (se.tourService.itemDepartureCalendar.DepartureDate || se.tourService.itemDepartureCalendar.AllotmentDate) : se.searchhotel.CheckInDate)) : (!this.flightmode ? this.gf.getCinIsoDate(this.searchhotel.CheckInDate) : this.gf.getCinIsoDate(this._flightService.itemFlightCache.checkInDate)),
        endDate: !this.flightmode ? this.requestForm ? undefined : this.gf.getCinIsoDate(this.searchhotel.CheckOutDate) : (this.searchhotel.formChangeDate >= 4 && this.searchhotel.formChangeDate < 7 && this.roundTrip) ? this.gf.getCinIsoDate(this._flightService.itemFlightCache.checkOutDate) : undefined,
        minDate: moment(this.gf.getCinIsoDate(new Date(this.gf.getCinIsoDate(new Date())))).format('YYYY-MM-DD'),
        mobileFriendly: true,
        autoApply: true,
        allowRepick: true,
        singleMode: (this.tourCalendar || this.changeFlightCalendar) ? true : this.singlemode,
        numberOfMonths: 1,
        numberOfColumns: 1,
        scrollToDate: true,
        lang: "vi-VN",
        minDays: 1,
        inlineMode: true,
        showTooltip: true,
        tooltipText: {
          one: "đêm",
          other: 'đêm'
        },
        format: this.tourCalendar ? 'cls-tour-format' : '',
        tooltipNumber: (totalDays) => {
          return totalDays - 1;
        },
        //highlightedDays : daycf,
        highlightedDaysFormat: "YYYY-MM-DD",
        //hotelMode: true,
      });


      //debugger
      this.nightcount = moment(this.searchhotel.CheckOutDate).diff(this.searchhotel.CheckInDate, 'days');
      this.picker.show();

      this.picker.render(() => {
        debugger
      })


      setTimeout(() => {

        if (this.picker && this.picker.ui && this.picker.ui.children && this.picker.ui.children.length > 0) {
          let containermain = this.picker.ui.children[0];
          let containermonth = containermain.children[0];
          for (let index = 0; index < containermonth.children.length; index++) {
            const monthitem = containermonth.children[index];
            $(monthitem).addClass('cls-calendar-display');
          }
        } else {
          setTimeout(() => {
            let containermain = this.picker.ui.children[0];
            let containermonth = containermain.children[0];
            for (let index = 0; index < containermonth.children.length; index++) {
              const monthitem = containermonth.children[index];
              $(monthitem).addClass('cls-calendar-display');
            }
          }, 500)
        }

      }, 100)


      setTimeout(() => {
        if (!this.ticketService.ischeckCalendar) {
          if (!this.tourCalendar) {
            this.renderCustomDayConfig(1);
          } else {
            this.renderCustomDayTour();
          }
        }
        else {
          this.renderCustomDayTicket();
        }
      }, 300)

      this.picker.on('selected', (fdate, tdate) => {
        // some action
        var se = this;
        let fromdate = se.gf.getCinIsoDate(fdate.dateInstance);
        let todate = tdate ? se.gf.getCinIsoDate(tdate.dateInstance) : undefined;
        se.bookCombo.CheckInDate = fromdate;
        se.bookCombo.CheckOutDate = todate;
        if (se.searchhotel.formChangeDate < 4) {
          if (fromdate && todate && moment(todate).diff(fromdate, 'days') > 0) {
            if (moment(todate).diff(fromdate, "days") > 30) {
              this.presentToastwarming('Ngày nhận và trả phòng phải trong vòng 30 ngày');
              return;
            }
            se.searchhotel.CheckInDate = fromdate;
            se.searchhotel.CheckOutDate = todate;

            se.refreshDayInfo(0);
            se.searchhotel.itemChangeDate.emit(1);
            se.nightcount = moment(todate).diff(fromdate, 'days');
            se.modalCtrl.dismiss(1);
          } else {
            return;
          }
        } else {
          if (se.roundTrip && fromdate && todate && moment(todate).diff(fromdate, 'days') >= 0) {
            se._flightService.itemFlightCache.checkInDate = fromdate;
            if (todate) {
              se._flightService.itemFlightCache.checkOutDate = todate
            }
            se.refreshFlightCinCoutInfo(0);
            se._flightService.itemFlightReloadInfo.emit(1);

            se.modalCtrl.dismiss(se.searchhotel.formChangeDate >= 5 ? { from: fromdate, to: todate } : 1);
          } else {
            se._flightService.itemFlightCache.checkInDate = fromdate;
            if (!todate && se.changeFlightCalendar) {
              se._flightService.itemFlightCache.checkOutDate = fromdate;
            }
            se.refreshFlightCinCoutInfo(0);
            se._flightService.itemFlightReloadInfo.emit(1);

            se.modalCtrl.dismiss(se.searchhotel.formChangeDate >= 5 ? { from: fromdate, to: todate } : 1);
          }
        }
        this.checkLoadPrice();

       
      });
      this.picker.on('preselect', (date1, date2) => {
        let fromdate = this.gf.getCinIsoDate(date1.dateInstance);
        let todate = date2 && date2.dateInstance ? this.gf.getCinIsoDate(date2.dateInstance) : null;
        if (!date2 || (fromdate && todate && moment(todate).diff(fromdate, 'days') == 0)) {
          $('.is-start-date').addClass('first-select');
        } else {
          $('.is-start-date').removeClass('first-select');
        }
        // if(this.searchhotel.formChangeDate == 2){
        //   this.bindBOD();
        // }
        this.checkLoadPrice();
        this.refreshDayInfo(fromdate);
        this._flightService.itemFlightCache.checkInDate = fromdate;
        this.refreshFlightCinCoutInfo(1);

        let containermain = this.picker.ui.children[0];
        let containermonth = containermain.children[0];
        for (let index = 0; index < containermonth.children.length; index++) {
          const monthitem = containermonth.children[index];
          $(monthitem).addClass('cls-calendar-display');
        }

        setTimeout(() => {
          if (!this.tourCalendar) {
            this.renderCustomDayConfig(0);
          }
    
        }, 100)
      });

      this.picker.on('change:month', (date, calendarIdx) => {

        if (this.flightmode) {
          this.currentMonth = moment(date.dateInstance).format("M");
        }

        let containermain = this.picker.ui.children[0];
        let containermonth = containermain.children[0];
        for (let index = 0; index < containermonth.children.length; index++) {
          const monthitem = containermonth.children[index];
          $(monthitem).addClass('cls-calendar-display');
        }
        if (this._flightService.listPrices && this._flightService.listPrices.length == 0) {
          this.checkLoadPrice();
        } else {
          if (this.showlowestprice && this.searchhotel.formChangeDate >= 4 && this.searchhotel.formChangeDate < 7) {
            let _daterange = moment(this._flightService.itemFlightCache.checkOutDate).diff(this._flightService.itemFlightCache.checkInDate, 'days');
            let _month: any = moment(date.dateInstance).format("M");
            let _year: any = moment(date.dateInstance).format("YYYY");
            let _fdate = new Date(_year, _month * 1 - 1, 1);
            let _tdate = new Date(_year, _month * 1 - 1, 1 + _daterange);
            this.loadMorePricesByMonth(_fdate, _tdate, this.departCode, this.returnCode);
          }
        }


        setTimeout(() => {
          if (!this.ticketService.ischeckCalendar) {
            if (!this.tourCalendar) {
              this.renderCustomDayConfig(1);
            } else {
              this.renderCustomDayTour();
            }
          }
          else {
            this.renderCustomDayTicket();
          }
        }, 200)


      });

    } else {
      this.picker.show();
      // if(this.searchhotel.formChangeDate == 2){
      //   setTimeout(()=>{
      //     this.bindBOD();
      //   }, 1000)
      // }
    }
  }
  initDateRangePickerTicket() {
    this.refreshDayInfo(0);
    if (!this.picker) {
      let daycf = [];
      if (this._daysConfig && this._daysConfig.length > 0) {
        daycf = this._daysConfig.map((d) => { return moment(d.date).format('YYYY-MM-DD') })
      }

      let lunarConfig = [{ text: '29 Tết', day: '29/12' },
      { text: '30 Tết', day: '30/12' },
      { text: 'Mùng 1', day: '1/1' },
      { text: 'Mùng 2', day: '2/1' },
      { text: 'Mùng 3', day: '3/1' },
      { text: 'Mùng 4', day: '4/1' },
      { text: 'Mùng 5', day: '5/1' },
      { text: 'Mùng 6', day: '6/1' },
      { text: 'Mùng 7', day: '7/1' },
      { text: 'Mùng 8', day: '8/1' },
      { text: 'Mùng 9', day: '9/1' },
      { text: 'Mùng 10', day: '10/1' },];
      let tetConfig = ['29 Tết', '30 Tết', 'Mùng 1', 'Mùng 2', 'Mùng 3', 'Mùng 4', 'Mùng 5', 'Mùng 6', 'Mùng 7', 'Mùng 8', 'Mùng 9', 'Mùng 10',];
      let _daysConfig:any = [];
      if (this.valueGlobal.listlunar) {
        for (let j = 0; j < this.valueGlobal.listlunar.length; j++) {
          _daysConfig.push({
            date: this.valueGlobal.listlunar[j].date,
            subTitle: moment(this.valueGlobal.listlunar[j].date).format('D') + ' thg ' + moment(this.valueGlobal.listlunar[j].date).format('M'),
            description: this.valueGlobal.listlunar[j].description,
            cssClass: 'dayhot',
            lunarDate: lunarConfig.filter((item) => { return item.text.indexOf(this.valueGlobal.listlunar[j].name) != -1 }).length > 0 ? lunarConfig.filter((item) => { return item.text.indexOf(this.valueGlobal.listlunar[j].name) != -1 })[0].day : '',
          })
        }
      }
      let se = this;
      this.picker = new Litepicker({
        element: window.document.getElementById('litepicker') as any,
   
        startDate:  this.gf.getCinIsoDate(this.ticketService.checkinDate),
        endDate: undefined,
        minDate: moment(this.gf.getCinIsoDate(new Date(this.gf.getCinIsoDate(new Date())))).format('YYYY-MM-DD'),
        mobileFriendly: true,
        autoApply: true,
        allowRepick: true,
        singleMode:  true,
        numberOfMonths: 1,
        numberOfColumns: 1,
        scrollToDate: true,
        lang: "vi-VN",
        minDays: 1,
        inlineMode: true,
        showTooltip: true,
        tooltipText: {
          one: "đêm",
          other: 'đêm'
        },
        format:'cls-tour-format',
        tooltipNumber: (totalDays) => {
          return totalDays - 1;
        },
        //highlightedDays : daycf,
        highlightedDaysFormat: "YYYY-MM-DD",
        //hotelMode: true,
      });


      //debugger
      this.picker.show();

      this.picker.render(() => {
        debugger
      })


      setTimeout(() => {

        if (this.picker && this.picker.ui && this.picker.ui.children && this.picker.ui.children.length > 0) {
          let containermain = this.picker.ui.children[0];
          let containermonth = containermain.children[0];
          for (let index = 0; index < containermonth.children.length; index++) {
            const monthitem = containermonth.children[index];
            $(monthitem).addClass('cls-calendar-display');
          }
        } else {
          setTimeout(() => {
            let containermain = this.picker.ui.children[0];
            let containermonth = containermain.children[0];
            for (let index = 0; index < containermonth.children.length; index++) {
              const monthitem = containermonth.children[index];
              $(monthitem).addClass('cls-calendar-display');
            }
          }, 500)
        }

      }, 100)


      setTimeout(() => {
        if (!this.ticketService.ischeckCalendar) {
          if (!this.tourCalendar) {
            this.renderCustomDayConfig(1);
          } else {
            this.renderCustomDayTour();
          }
        }
        else {
          this.renderCustomDayTicket();
        }
      }, 300)

      this.picker.on('selected', (fdate, tdate) => {
        // some action
        var se = this;
        let fromdate = se.gf.getCinIsoDate(fdate.dateInstance);
        se.modalCtrl.dismiss({from : fromdate});
      });
      this.picker.on('preselect', (date1, date2) => {
        let fromdate = this.gf.getCinIsoDate(date1.dateInstance);
        let todate = date2 && date2.dateInstance ? this.gf.getCinIsoDate(date2.dateInstance) : null;
        if (!date2 || (fromdate && todate && moment(todate).diff(fromdate, 'days') == 0)) {
          $('.is-start-date').addClass('first-select');
        } else {
          $('.is-start-date').removeClass('first-select');
        }
        // if(this.searchhotel.formChangeDate == 2){
        //   this.bindBOD();
        // }
        this.checkLoadPrice();
        this.refreshDayInfo(fromdate);
        this._flightService.itemFlightCache.checkInDate = fromdate;
        this.refreshFlightCinCoutInfo(1);

        let containermain = this.picker.ui.children[0];
        let containermonth = containermain.children[0];
        for (let index = 0; index < containermonth.children.length; index++) {
          const monthitem = containermonth.children[index];
          $(monthitem).addClass('cls-calendar-display');
        }

      });

      this.picker.on('change:month', (date, calendarIdx) => {

        if (this.flightmode) {
          this.currentMonth = moment(date.dateInstance).format("M");
        }

        let containermain = this.picker.ui.children[0];
        let containermonth = containermain.children[0];
        for (let index = 0; index < containermonth.children.length; index++) {
          const monthitem = containermonth.children[index];
          $(monthitem).addClass('cls-calendar-display');
        }
        if (this._flightService.listPrices && this._flightService.listPrices.length == 0) {
          this.checkLoadPrice();
        } else {
          if (this.showlowestprice && this.searchhotel.formChangeDate >= 4 && this.searchhotel.formChangeDate < 7) {
            let _daterange = moment(this._flightService.itemFlightCache.checkOutDate).diff(this._flightService.itemFlightCache.checkInDate, 'days');
            let _month: any = moment(date.dateInstance).format("M");
            let _year: any = moment(date.dateInstance).format("YYYY");
            let _fdate = new Date(_year, _month * 1 - 1, 1);
            let _tdate = new Date(_year, _month * 1 - 1, 1 + _daterange);
            this.loadMorePricesByMonth(_fdate, _tdate, this.departCode, this.returnCode);
          }
        }


        setTimeout(() => {
          if (!this.ticketService.ischeckCalendar) {
            if (!this.tourCalendar) {
              this.renderCustomDayConfig(1);
            } else {
              this.renderCustomDayTour();
            }
          }
          else {
            this.renderCustomDayTicket();
          }
        }, 200)


      });

    } else {
      this.picker.show();
      // if(this.searchhotel.formChangeDate == 2){
      //   setTimeout(()=>{
      //     this.bindBOD();
      //   }, 1000)
      // }
    }
  }
  loadMorePricesByMonth(fromdate, todate, departcode, returncode) {
    this._flightService.keyLoadMorePrices = `${moment(fromdate).format('YYYY-MM-DD')}_${moment(todate).format('YYYY-MM-DD')}_${departcode}_${returncode}`;
    let url = C.urls.baseUrl.urlFlightInt + 'api/FlightSearch/GetCalendarPrice';
    let body = {
      DepartDate: this.gf.getCinIsoDate(fromdate),
      FromPlaceCode: departcode,
      ReturnDate: this.roundTrip ? this.gf.getCinIsoDate(todate) : "",
      ToPlaceCode: returncode
    };
    this.gf.RequestApi("POST", url, {}, body, "homeflight", "GetCalendarPrice").then((data) => {
      if (data && data.success && data.data && data.data.calendarPriceItemDto && data.data.calendarPriceItemDto.length > 0) {
        if (this._flightService.listPrices && this._flightService.listPrices.length > 0) {
          this._flightService.listPrices = [...this._flightService.listPrices, ...data.data.calendarPriceItemDto];
          this.renderInternationalCalenderPrice(this._flightService.listPrices);
        } else {
          this._flightService.listPrices = [...data.data.calendarPriceItemDto];
          this.renderInternationalCalenderPrice(this._flightService.listPrices);
        }

      }
    })
  }
  renderCustomDayTour() {
    if ($('.cls-tour-calendar .container__months') && $('.cls-tour-calendar .container__months').length > 0) {
      const arrmonth = $('.cls-tour-calendar .container__months').children();
      let maxPrice = Math.max(...this.tourService.calendarDeparture.map(o => o.PriceAdultAvg), 0);
      let minPrice = Math.min(...this.tourService.calendarDeparture.map(o => o.PriceAdultAvg));
      for (let index = 0; index < arrmonth.length; index++) {
        const elementMonth:any = arrmonth[index];

        $(elementMonth).addClass('cls-calendar-display');
        const arrdays = elementMonth.children[2].children;
        $('.div-wrap-item-lunar').remove();
        //$('.div-expand-lunar').append("<div class='div-wrap-item-lunar'></div>");

        for (let index = 0; index < arrdays.length; index++) {
          const element = arrdays[index];
          if (element.classList.contains('day-item') && !element.classList.contains('is-locked') && !element.classList.contains('cls-tour-hasdeparture')) {
            $(element).addClass('cls-tour-hasdeparture');
            // let listdayinmonth = elementMonth.children[1].children[0]
            let objtextmonth:any = elementMonth.children[0].textContent.replace('Tháng ', '');
            let monthstartdate: any;
            let yearstartdate: any;
            if (objtextmonth.length == 6) {
              monthstartdate = objtextmonth.substring(0, 2);
              yearstartdate = objtextmonth.substring(2, 6);
            } else {
              monthstartdate = objtextmonth.substring(0, 1);
              yearstartdate = objtextmonth.substring(1, 5);
            }
          
        
              const elementday = element;
              let fday: any;
              let chuoi = elementday.textContent.split(':');
              if (chuoi[0].length == 6) {
                fday = elementday.textContent.substring(0, 1);
              } else {
                fday = elementday.textContent.substring(0, 2);
              }
  
              let fromdate = moment(new Date(yearstartdate, monthstartdate - 1, fday)).format('YYYY-MM-DD');
              let objday = this.tourService.calendarDeparture.filter((f) => { return moment(f.AllotmentDate).format('YYYY-MM-DD') == fromdate });
              if (objday && objday.length > 0) {
                let totalprice;
                totalprice = objday[0].PriceAdultAvg >= 100000000 ? (objday[0].PriceAdultAvg / 1000000).toFixed(1).replace(".", ",").replace(",0", "") + "tr" : objday[0].PriceAdultAvg >= 10000000 ? (((objday[0].PriceAdultAvg / 1000000).toFixed(2).replace(".", ",").replace(",00", "") + 'tr').indexOf(",") > 0 ? ((objday[0].PriceAdultAvg / 1000000).toFixed(2).replace(".", ",").replace(",00", "") + 'tr').replace("0tr", "tr") : ((objday[0].PriceAdultAvg / 1000000).toFixed(2).replace(".", ",").replace(",00", "") + 'tr')) : objday[0].PriceAdultAvg > 0 ? (objday[0].PriceAdultAvg / 1000).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'k' : '';
             
  
                if (objday[0].PriceAdultAvg == minPrice) {
             
                  $(elementday).append(`<span class='price-calendar-text-tour-green' (click)="clickedElement(e)">${totalprice}</span>`);
                 
                  $('.price-calendar-text-tour-green').parent().addClass(`div-boder-KM ${!objday[0].AvaiableNo && objday[0].Status == 'SS' ? ' no-allotment' : ''}`);
                  // $(".price-calendar-text-tour-green").click(e => this.clickedElement(e));
                } else if (objday[0].PriceAdultAvg == maxPrice) {
                  $(elementday).append(`<span class='price-calendar-text-tour-red'>${totalprice}</span>`);
                  $('.price-calendar-text-tour-red').parent().addClass(`div-boder-red ${!objday[0].AvaiableNo && objday[0].Status == 'SS' ? ' no-allotment' : ''}`);
                  // $(".price-calendar-text-tour-red").click(e => this.clickedElement(e));
                } else {
                  if (elementday) {
                    $(elementday).append(`<span class='price-calendar-text-tour'>${totalprice}</span>`);
                    if(!objday[0].AvaiableNo && objday[0].Status == 'SS'){
                      $(elementday).addClass(' no-allotment');
                    }
                  }
                }
  
              }
            
            let mapconfig = this._daysConfig.filter((d) => { return element.attributes.length >0 && moment(d.date).diff(moment(new Date(this.gf.getCinIsoDate(element.attributes[1].value*1))).format('YYYY-MM-DD'), 'days' ) == 0 });
            if(mapconfig && mapconfig.length >0){
              if($('.div-wrap-item-lunar').length ==0){
                $('.div-expand-lunar').append("<div class='div-wrap-item-lunar'></div>");
              }
              // $(element).addClass('text-red');
              $('.div-wrap-item-lunar').append("<div class='div-border-small'>" + "<div class='text-red width-78'>" + mapconfig[0].subTitle + ": " + "</div>" + "<span>" + mapconfig[0].description + (mapconfig[0].lunarDate ? "</span>" + " " + "<span class='text-red m-l-4'> (" + mapconfig[0].lunarDate + ")</span>" : '') + "</div>");
            }
          }

        }
      }
    }
    else if ($('.cls-tour-custom .container__months') && $('.cls-tour-custom .container__months').length > 0) {
      const arrmonth = $('.cls-tour-custom .container__months').children();
      for (let index = 0; index < arrmonth.length; index++) {
        const elementMonth = arrmonth[index];
        if (this._daysConfig && this._daysConfig.length > 0 && this.picker.ui.children && this.picker.ui.children.length > 0) {
          if ($(elementMonth).children() && $(elementMonth).children().length < 4) {

            const arrdays = elementMonth.children[2].children;
            $('.div-wrap-item-lunar').remove();
            //$('.div-expand-lunar').append("<div class='div-wrap-item-lunar'></div>");
            for (let index = 0; index < arrdays.length; index++) {
              const element:any = arrdays[index];
              let mapconfig = this._daysConfig.filter((d) => { return element.attributes.length > 0 && moment(d.date).diff(moment(moment(new Date(this.gf.getCinIsoDate(element.attributes[1].value * 1))).format('YYYY-MM-DD')).format('YYYY-MM-DD'), 'days') == 0 });
              if (mapconfig && mapconfig.length > 0) {
                if ($('.div-wrap-item-lunar').length == 0) {
                  $('.div-expand-lunar').append("<div class='div-wrap-item-lunar'></div>");
                }
                // $(element).addClass('text-red');
                $('.div-wrap-item-lunar').append("<div class='div-border-small'>" + "<div class='text-red width-78'>" + mapconfig[0].subTitle + ": " + "</div>" + "<span>" + mapconfig[0].description + (mapconfig[0].lunarDate ? "</span>" + " " + "<span class='text-red m-l-4'> (" + mapconfig[0].lunarDate + ")</span>" : '') + "</div>");
              }

            }
          }
        }
        $(elementMonth).addClass('cls-calendar-display');


      }
    }
  }
  renderCustomDayTicket() {
    let Year = new Date().getFullYear();
    let Month = new Date().getMonth();
    let Day = new Date().getDate();
    if ($('.cls-tour-calendar .container__months') && $('.cls-tour-calendar .container__months').length > 0) {
      const arrmonth = $('.cls-tour-calendar .container__months').children();
      for (let index = 0; index < arrmonth.length; index++) {
        const elementMonth:any = arrmonth[index];

        $(elementMonth).addClass('cls-calendar-display');
        const arrdays = elementMonth.children[2].children;
        $('.div-wrap-item-lunar').remove();
        //$('.div-expand-lunar').append("<div class='div-wrap-item-lunar'></div>");

        for (let index = 0; index < arrdays.length; index++) {
          const element:any = arrdays[index];
          if (true) {
            // let listdayinmonth = elementMonth.children[1].children[0]
            let objtextmonth = elementMonth.children[0].textContent.replace('Tháng ', '');
            let monthstartdate: any;
            let yearstartdate: any;
            if (objtextmonth.length == 6) {
              monthstartdate = objtextmonth.substring(0, 2);
              yearstartdate = objtextmonth.substring(2, 6);
            } else {
              monthstartdate = objtextmonth.substring(0, 1);
              yearstartdate = objtextmonth.substring(1, 5);
            }
            if (this.ticketService.itemTicketService.itemObjRate.skus && this.ticketService.itemTicketService.itemObjRate.skus.length > 0) {
              
            }

            const elementday:any = element;
            let fday: any;
            let chuoi = elementday.textContent.split(':');
            if (chuoi[0].length == 6) {
              fday = elementday.textContent.substring(0, 1);
            } else {
              fday = elementday.textContent.substring(0, 2);
            }

            let fromdate = moment(new Date(yearstartdate, monthstartdate - 1, fday)).format('YYYY-MM-DD');
            let nowday = moment(new Date(Year, Month, Day)).format('YYYYMMDD');
            let objday:any = []
            if (this.ticketService.itemTicketService.itemObjRate.specs && this.ticketService.itemTicketService.itemObjRate.specs.length>0) {
              if (this.ticketService.timeId && this.ticketService.timeId.length > 0) {
                objday = this.ticketService.timeId[0].skusDaily.dailyRate.filter((f) => { return f.date == fromdate });
              }
            }
            else {
               objday = this.ticketService.itemTicketService.itemObjRate.skus[0].skusDaily.dailyRate.filter((f) => { return f.date == fromdate });
            }
            var fromDateNum = parseInt(fromdate.replace(/-/g, ""), 10);
            var nowdayNum = parseInt(nowday.replace(/-/g, ""), 10);
            var specificDateStr;
            if (this.ticketService.timeId && this.ticketService.timeId.length > 0) {
              specificDateStr = this.ticketService.timeId[0].skusDaily.dailyRate[this.ticketService.timeId[0].skusDaily.dailyRate.length - 1];
            }
            else {
              specificDateStr = this.ticketService.itemTicketService.itemObjRate.skus[0].skusDaily.dailyRate[this.ticketService.itemTicketService.itemObjRate.skus[0].skusDaily.dailyRate.length - 1];
            }
            var specificDateNum = parseInt(specificDateStr.date.replace(/-/g, ""), 10);
            if (objday && objday.length > 0) {
              let totalprice:any;
              totalprice = objday[0].price >= 100000000 ? (objday[0].price / 1000000).toFixed(1).replace(".", ",").replace(",0", "") + "tr" : objday[0].price >= 10000000 ? (((objday[0].price / 1000000).toFixed(2).replace(".", ",").replace(",00", "") + 'tr').indexOf(",") > 0 ? ((objday[0].price / 1000000).toFixed(2).replace(".", ",").replace(",00", "") + 'tr').replace("0tr", "tr") : ((objday[0].price / 1000000).toFixed(2).replace(".", ",").replace(",00", "") + 'tr')) : objday[0].price > 0 ? (objday[0].price / 1000).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'k' : '';
              if (fromDateNum >= nowdayNum && fromDateNum <= specificDateNum) {
                // if ($(element)) {
                //   $(element).append(`<span class='price-calendar-text-ticket'>${totalprice}</span>`);
                // } 
                if ($(element) && elementday.textContent !== "") {
                  $(elementday).append(`<p class='price-calendar-text-ticket' (click)="clickedElement(e)">${totalprice}</p>`);
                }
              }
            }
            else {
              if ($(element)) {
                if (fromDateNum >= nowdayNum && fromDateNum <= specificDateNum) {
                  if (elementday.textContent !== "") {
                    $(element).addClass('not-available-price-in-range text-xam is-locked');
                  }
                 
                }
              }
            }
          }

        }
      }
    }
    else if ($('.cls-tour-custom .container__months') && $('.cls-tour-custom .container__months').length > 0) {
      const arrmonth = $('.cls-tour-custom .container__months').children();
      for (let index = 0; index < arrmonth.length; index++) {
        const elementMonth:any = arrmonth[index];
        if (this._daysConfig && this._daysConfig.length > 0 && this.picker.ui.children && this.picker.ui.children.length > 0) {
          if ($(elementMonth).children() && $(elementMonth).children().length < 4) {

            const arrdays = elementMonth.children[2].children;
            $('.div-wrap-item-lunar').remove();
            //$('.div-expand-lunar').append("<div class='div-wrap-item-lunar'></div>");
            for (let index = 0; index < arrdays.length; index++) {
              const element:any = arrdays[index];
              let mapconfig = this._daysConfig.filter((d) => { return element.attributes.length > 0 && moment(d.date).diff(moment(moment(new Date(this.gf.getCinIsoDate(element.attributes[1].value * 1))).format('YYYY-MM-DD')).format('YYYY-MM-DD'), 'days') == 0 });
              if (mapconfig && mapconfig.length > 0) {
                if ($('.div-wrap-item-lunar').length == 0) {
                  $('.div-expand-lunar').append("<div class='div-wrap-item-lunar'></div>");
                }
                // $(element).addClass('text-red');
                $('.div-wrap-item-lunar').append("<div class='div-border-small'>" + "<div class='text-red width-78'>" + mapconfig[0].subTitle + ": " + "</div>" + "<span>" + mapconfig[0].description + (mapconfig[0].lunarDate ? "</span>" + " " + "<span class='text-red m-l-4'> (" + mapconfig[0].lunarDate + ")</span>" : '') + "</div>");
              }

            }
          }
        }
        $(elementMonth).addClass('cls-calendar-display');


      }
    }
  }
  bindBOD() {
    let se = this;
    if (se.searchhotel.listBOD && se.searchhotel.listBOD.length > 0 && !se.showFromHotelList) {
      for (let index = 0; index < se.searchhotel.listBOD.length; index++) {
        const elementBOD = se.searchhotel.listBOD[index];
        //let itemmap = $('.day-item').filter((di:any) => { return $(di).attributes.length >0 && moment($(di).attributes[1]).format("YYYY-MM-DD") == elementBOD });
        for (let index = 0; index < $('.day-item').length; index++) {
          const elementday: any = $('.day-item')[index];

          if (elementday && elementday.attributes.length > 0 && moment(elementday.attributes[1].value * 1).format("YYYY-MM-DD") == elementBOD) {
            $(elementday).addClass('is-locked cls-bod');
          }
        }

      }
    }
  }

  renderCustomDayConfig(refresh) {

    if (this._daysConfig && this._daysConfig.length > 0 && this.picker.ui.children && this.picker.ui.children.length > 0) {
      let containermain = this.picker.ui.children[0];
      let containermonth = containermain.children[0];
      for (let index = 0; index < containermonth.children.length; index++) {
        const monthitem = containermonth.children[index];
        let containerdays = monthitem.children[2];
        //if(this.flightmode){
        $(monthitem).addClass('cls-calendar-display');
        //}
        $('.div-wrap-item-lunar').remove();

        for (let indexd = 0; indexd < containerdays.children.length; indexd++) {
          const dayitem = containerdays.children[indexd];
          let mapconfig = this._daysConfig.filter((d) => { return dayitem.attributes.length > 0 && moment(d.date).diff(moment(new Date(this.gf.getCinIsoDate(dayitem.attributes[1].value * 1))).format('YYYY-MM-DD'), 'days') == 0 });
          if (mapconfig && mapconfig.length > 0) {

            if ($('.div-wrap-item-lunar').length == 0) {
              $('.div-expand-lunar').append("<div class='div-wrap-item-lunar'></div>");
            }
            $(dayitem).addClass('text-red');
            $('.div-wrap-item-lunar').append("<div class='div-border-small'>" + "<div class='text-red width-78'>" + mapconfig[0].subTitle + ": " + "</div>" + "<span>" + mapconfig[0].description + (mapconfig[0].lunarDate ? "</span>" + " " + "<span class='text-red m-l-4'> (" + mapconfig[0].lunarDate + ")</span>" : '') + "</div>");
          }

        }
      }
    } else {
      let containermain = this.picker.ui.children[0];
      let containermonth = containermain.children[0];
      for (let index = 0; index < containermonth.children.length; index++) {
        const monthitem = containermonth.children[index];
        let containerdays = monthitem.children[2];
        $(monthitem).addClass('cls-calendar-display');
      }
    }
    if (!this.flightmode && !this.showFromHotelList) {
      if (this.valueGlobal.ischeckCB == 0) {
        if (this.valueGlobal.dayhot && this.valueGlobal.dayhot.length > 0) {
          for (let index = 0; index < this.valueGlobal.dayhot.length; index++) {
            const elementhotDay = this.valueGlobal.dayhot[index];
            var test = $('.day-item');
            //let itemmap = $('.day-item').filter((di:any) => { return $(di).attributes.length >0 && moment($(di).attributes[1]).format("YYYY-MM-DD") == elementBOD });
            for (let index = 0; index < $('.day-item').length; index++) {
              const elementday: any = $('.day-item')[index];

              if (elementday && elementday.attributes.length > 0 && moment(elementday.attributes[1].value * 1).format("YYYY-MM-DD") == elementhotDay) {
                $(elementday).addClass('dayhot');
              }
            }
          }
        }
        if (this.valueGlobal.notSuggestDaily && this.valueGlobal.notSuggestDaily.length > 0 && (this.searchhotel.formChangeDate == 2 || this.searchhotel.formChangeDate == 3)) {
          for (let index = 0; index < this.valueGlobal.notSuggestDaily.length; index++) {
            const elementDay = this.valueGlobal.notSuggestDaily[index];
            //let itemmap = $('.day-item').filter((di:any) => { return $(di).attributes.length >0 && moment($(di).attributes[1]).format("YYYY-MM-DD") == elementBOD });
            for (let index = 0; index < $('.day-item').length; index++) {
              const elementday: any = $('.day-item')[index];

              if (elementday && elementday.attributes.length > 0 && moment(elementday.attributes[1].value * 1).format("YYYY-MM-DD") == elementDay) {
                $(elementday).addClass('strikethrough');
              }
            }
          }
        }

      } else {
        if (this.valueGlobal.notSuggestDailyCB && this.valueGlobal.notSuggestDailyCB.length > 0) {
          for (let index = 0; index < this.valueGlobal.notSuggestDailyCB.length; index++) {
            const elementDay = this.valueGlobal.notSuggestDailyCB[index];
            //let itemmap = $('.day-item').filter((di:any) => { return $(di).attributes.length >0 && moment($(di).attributes[1]).format("YYYY-MM-DD") == elementBOD });
            for (let index = 0; index < $('.day-item').length; index++) {
              const elementday: any = $('.day-item')[index];

              if (elementday && elementday.attributes.length > 0 && moment(elementday.attributes[1].value * 1).format("YYYY-MM-DD") == elementDay) {
                $(elementday).addClass('strikethrough');
              }
            }
          }
        }
        this.bindBOD();
      }
    }

    if (this._daysConfigLunar && this._daysConfigLunar.length > 0 && this.searchhotel.formChangeDate >= 4 && this.searchhotel.formChangeDate < 7) {
      let _daysConfigLunarByMonth = this._daysConfigLunar.filter((item) => { return item.month == this.currentMonth });
      if (_daysConfigLunarByMonth && _daysConfigLunarByMonth.length > 0) {
        for (let index = 0; index < _daysConfigLunarByMonth.length; index++) {
          const element = _daysConfigLunarByMonth[index];
          for (let index = 0; index < $('.day-item').length; index++) {
            const elementday: any = $('.day-item')[index];

            if (elementday && elementday.attributes.length > 0 && moment(elementday.attributes[1].value * 1).format("YYYY-MM-DD") == moment(element.date).format("YYYY-MM-DD")) {
              if (this.showLunarCalendar) {
                $(elementday).append("<div class='div-lunar-calendar-all '><div class='lunardate'>" + element.subTitle + "</div></div>");
              }

            }
          }
        }
      }

    }

  }

  confirm() {
    this.modalCtrl.dismiss();
    //this.navCtrl.back();
  }

  showCalendarCinCout() {
    var se = this;
    if ($('.div-show-calendar-cincout').hasClass('calendar-visible')) {
      $('.div-show-calendar-cincout').removeClass('calendar-visible').addClass('calendar-disabled');
    } else {
      $('.div-show-calendar-cincout').removeClass('calendar-disabled').addClass('calendar-visible');
    }
    se.checkLoadPrice();
  }

  loadCalendarPrice() {
    if (!this._flightService.itemFlightCache.isInternationalFlight) {
      if (this.departCode && this.returnCode) {
        let url = C.urls.baseUrl.urlFlight + "gate/apiv1/GetHotDealCalendar?fromPlace=" + this.departCode + "&toPlace=" + this.returnCode + "&getIncache=false";
        this.gf.RequestApi("GET", url, {
          "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          'Content-Type': 'application/json; charset=utf-8'
        }, {}, "homeflight", "showCalendarPrice").then((data) => {
          if (data) {
            let key = "listHotDealCalendar_" + this.departCode + "_" + this.returnCode;

            if (data && data.departs && data.departs.length > 0) {
              this.storage.set(key, data);
              if (this.roundTrip) {//2 chiều
                this.renderCalenderPrice(1, data.departs, data.arrivals);
              } else {//1 chiều
                this.renderCalenderPrice(2, data.departs, null);
              }
            }
          }
        })
      }
    } else {
      let url = C.urls.baseUrl.urlFlightInt + 'api/FlightSearch/GetCalendarPrice';
      let body = {
        DepartDate: new Date(this.gf.getCinIsoDate(this._flightService.itemFlightCache.checkInDate)),
        FromPlaceCode: this.departCode,
        ReturnDate: this.roundTrip ? new Date(this.gf.getCinIsoDate(this._flightService.itemFlightCache.checkOutDate)) : '',
        ToPlaceCode: this.returnCode
      };
      this.gf.RequestApi("POST", url, {}, body, "homeflight", "GetCalendarPrice").then((data) => {
        if (data && data.success && data.data && data.data.calendarPriceItemDto && data.data.calendarPriceItemDto.length > 0) {
          this._flightService.listPrices = [...data.data.calendarPriceItemDto];
          this.renderInternationalCalenderPrice(this._flightService.listPrices);
        } else {
          this._flightService.listPrices = [];
        }
      })
    }
  }

  renderCalenderPrice(type, departs, arrivals) {
    var se = this;
    try {
      if ($('.month-item').length > 0) {
        let diffday = moment(this._flightService.itemFlightCache.checkOutDate).diff(this._flightService.itemFlightCache.checkInDate, "days");
        for (let index = 0; index < $('.month-item').length; index++) {
          const elementMonth = $('.month-item')[index];
          let monthstartdate: any = elementMonth.children[0].children[1].children[0].innerHTML.replace('Tháng ', '').trim();
          let yearstartdate: any = elementMonth.children[0].children[1].children[1].innerHTML;
          let textmonth = moment(new Date(yearstartdate, monthstartdate - 1, 1)).format('YYYY-MM');

          if (textmonth) {
            let listdepartinmonth = departs.filter((item) => { return moment(item.departTime).format('YYYY-MM') == textmonth });
            let listreturninmonth: any;
            let listreturnallmonth: any;
            if (this.roundTrip) {
              listreturninmonth = arrivals.filter((item) => { return moment(item.departTime).format('YYYY-MM') == textmonth });
              listreturnallmonth = [...arrivals];
            }

            let listdayinmonth = elementMonth.children[2].children;
            if (listdayinmonth && listdayinmonth.length > 0) {
              for (let j = 0; j < listdayinmonth.length; j++) {
                const elementday = listdayinmonth[j];
                if (elementday && elementday.textContent) {
                  let fday: any = elementday.textContent;
                  let fromdate = moment(new Date(yearstartdate, monthstartdate - 1, fday)).format('YYYY-MM-DD');
                  let todate = moment(fromdate).add(diffday, 'days').format('YYYY-MM-DD');
                  if (fromdate) {
                    if (type == 1) {
                      let mindepartvalue = Math.min(...listdepartinmonth.map(o => o.price));
                      let minreturnvalue = Math.min(...listreturninmonth.map(o => o.price));
                      let minvalue = mindepartvalue + minreturnvalue;

                      let pricefromdate = 0;
                      let itemfromdate = listdepartinmonth.filter((d) => { return moment(d.departTime).format('YYYY-MM-DD') == fromdate });
                      if (itemfromdate && itemfromdate.length > 0) {
                        pricefromdate = itemfromdate[0].price;
                      }
                      let pricetodate = 0;
                      let itemtodate = listreturnallmonth.filter((d) => { return moment(d.departTime).format('YYYY-MM-DD') == todate });
                      if (itemtodate && itemtodate.length > 0) {
                        pricetodate = itemtodate[0].price;
                      }

                      if (pricefromdate && pricetodate) {
                        let totalpriceitem = pricefromdate + pricetodate;
                        let totalprice = (totalpriceitem) / 1000 >= 1000 ? se.gf.convertNumberToString(Math.round(totalpriceitem / 1000)) : Math.round((totalpriceitem / 1000));
                        totalprice = totalprice + "K";
                        //giá min
                        if (minvalue == totalpriceitem) {
                          $(elementday).append(`<div class='price-calendar-text price-calendar-disabled min-price'>${totalprice}</div>`);
                        } else {
                          $(elementday).append(`<div class='price-calendar-text price-calendar-disabled'>${totalprice}</div>`);
                        }

                      }
                    } else {
                      let mindepartvalue = Math.min(...listdepartinmonth.map(o => o.price));
                      let minvalue = mindepartvalue;

                      let pricefromdate = 0;
                      let itemfromdate = listdepartinmonth.filter((d) => { return moment(d.departTime).format('YYYY-MM-DD') == fromdate });
                      if (itemfromdate && itemfromdate.length > 0) {
                        pricefromdate = itemfromdate[0].price;
                      }

                      let totalprice = pricefromdate / 1000 >= 1000 ? se.gf.convertNumberToString(Math.round(pricefromdate / 1000)) : Math.round(pricefromdate / 1000);
                      totalprice = totalprice + "K";
                      if (pricefromdate) {

                        //giá min
                        if (minvalue == pricefromdate) {
                          $(elementday).append(`<span class='price-calendar-text m-l-5 price-calendar-disabled min-price'>${totalprice}</span>`);
                        } else {
                          $(elementday).append(`<span class='price-calendar-text m-l-5 price-calendar-disabled'>${totalprice}</span>`);
                        }

                      }
                    }
                  }
                }

              }
            }

          }
        }
        if (this.showlowestprice) {
          $('.price-calendar-text').removeClass('price-calendar-disabled').addClass('price-calendar-visible');
        } else {
          $('.price-calendar-text').removeClass('price-calendar-visible').addClass('price-calendar-disabled');
        }
      }
    } catch (error) {
      console.log('Lỗi jquery khi show lịch giá rẻ: ' + error);
    }


  }

  renderInternationalCalenderPrice(listPrices) {
    var se = this;
    try {
      if ($('.month-item').length > 0) {
        let diffday = moment(this._flightService.itemFlightCache.checkOutDate).diff(this._flightService.itemFlightCache.checkInDate, "days");
        for (let index = 0; index < $('.month-item').length; index++) {
          const elementMonth = $('.month-item')[index];
          let monthstartdate: any = elementMonth.children[0].children[1].children[0].innerHTML.replace('Tháng ', '').trim();
          let yearstartdate: any = elementMonth.children[0].children[1].children[1].innerHTML;
          let textmonth = moment(new Date(yearstartdate, monthstartdate - 1, 1)).format('YYYY-MM');

          if (textmonth) {
            let listdepartinmonth = listPrices.filter((item) => { return moment(item.departDate).format('YYYY-MM') == textmonth });

            let listdayinmonth = elementMonth.children[2].children;
            if (listdayinmonth && listdayinmonth.length > 0) {
              for (let j = 0; j < listdayinmonth.length; j++) {
                const elementday = listdayinmonth[j];
                if (elementday && elementday.textContent) {
                  let fday: any = elementday.textContent;
                  let fromdate = moment(new Date(yearstartdate, monthstartdate - 1, fday)).format('YYYY-MM-DD');
                  let todate = moment(fromdate).add(diffday, 'days').format('YYYY-MM-DD');
                  if (fromdate) {

                    let mindepartvalue = Math.min(...listdepartinmonth.map(o => o.price));
                    let minvalue = mindepartvalue;

                    let pricefromdate = 0;
                    let itemfromdate = listdepartinmonth.filter((d) => { return moment(d.departDate).format('YYYY-MM-DD') == fromdate });
                    if (itemfromdate && itemfromdate.length > 0) {
                      pricefromdate = itemfromdate[0].price;
                    }


                    let totalprice = pricefromdate / 1000000 >= 1 ? (pricefromdate / 1000000).toFixed(1) : Math.round(pricefromdate / 1000000);
                    if (pricefromdate / 1000000 >= 1) {
                      totalprice = totalprice + " Trđ";
                    } else {
                      totalprice = totalprice + " Nđ";
                    }
                    if (pricefromdate) {
                      //giá min
                      if (minvalue == pricefromdate) {
                        $(elementday).append(`<div class='price-calendar-text price-calendar-disabled min-price-international'>${totalprice}</div>`);
                      } else {
                        $(elementday).append(`<div class='price-calendar-text price-calendar-disabled'>${totalprice}</div>`);
                      }

                    }

                  }
                }

              }
            }

          }
        }
        if (this.showlowestprice) {
          $('.price-calendar-text').removeClass('price-calendar-disabled').addClass('price-calendar-visible');
        } else {
          $('.price-calendar-text').removeClass('price-calendar-visible').addClass('price-calendar-disabled');
        }
      }
    } catch (error) {
      console.log('Lỗi jquery khi show lịch giá rẻ: ' + error);
    }
  }
  async presentToastwarming(msg) {
    const toast = await this.alertCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  checkLunarCalendar(event) {
    setTimeout(() => {
      this.showLunarCalendar = event.target.checked;
      this._flightService.itemFlightCache.showLunarCalendar = this.showLunarCalendar;
      if (this.showLunarCalendar) {
        this.showlowestprice = !event.target.checked;
        this._flightService.itemFlightCache.showCalendarLowestPrice = this.showlowestprice;
        $('.price-calendar-text').removeClass('price-calendar-visible').addClass('price-calendar-disabled');
        ($('.button-show-lowest-price')[0]  as any).checked = false;
        $('.lunardate').removeClass('date-lunar-disabled').addClass('date-lunar-visible');
      } else {
        $('.lunardate').removeClass('date-lunar-visible').addClass('date-lunar-disabled');
      }
    }, 10)

    let containermain = this.picker.ui.children[0];
    let containermonth = containermain.children[0];
    for (let index = 0; index < containermonth.children.length; index++) {
      const monthitem = containermonth.children[index];
      $(monthitem).addClass('cls-calendar-display');
    }

    setTimeout(() => {
      if (!this.tourCalendar) {
        this.renderCustomDayConfig(0);
      }

    }, 10)
  }

  footerClick() {
    let containermain = this.picker.ui.children[0];
    let containermonth = containermain.children[0];
    for (let index = 0; index < containermonth.children.length; index++) {
      const monthitem = containermonth.children[index];
      $(monthitem).addClass('cls-calendar-display');
    }
    if (this.tourCalendar) {
      this.renderCustomDayTour();
    }

  }
}