import { SearchHotel, ValueGlobal } from '../../providers/book-service';
import { Component, NgZone,OnInit } from '@angular/core';
import { NavController, Platform, ModalController, PickerController } from '@ionic/angular';

import { AuthService } from '../../providers/auth-service';
import { HttpClientModule } from '@angular/common/http';
import { C } from '../../providers/constants';
import { GlobalFunction } from '../../providers/globalfunction';
import { tourService } from 'src/app/providers/tourService';
import * as moment from 'moment';
import * as $ from 'jquery';
import { Storage } from '@ionic/storage';
import { ticketService } from 'src/app/providers/ticketService';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SelectDateRangePage } from 'src/app/selectdaterange/selectdaterange.page';
/**
 * Generated class for the SearchHotelFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-ticketservice',
  templateUrl: 'ticketservice.page.html',
  styleUrls: ['ticketservice.page.scss'],
})
export class TicketServicePage implements OnInit{
  totalPrice: number;
  hasAllotment: boolean = true;
  itemDepartureCalendar: any;
  myCalendar: HTMLIonModalElement;
  allowclickcalendar: boolean = true;
  MsgError: any;
  hasDeparture: boolean = false;
  infant = '<1';
  point: number = 0;
  pointbkg = '';
  loaddeparturedone: boolean = false;
  itemTicketService: any;
  dateDisplay
  index: number;
  checkinDate: any
  arrSkus: any;
  reCheckToken: any;
  indexSku: any = 0;
  totalRate: any;
  adult: number = 0;
  child: number = 0;
  elder: number = 0;
  Custom1: number = 0;
  Custom2: number = 0;
  timeTicket: any;
  totalPax = 0
  daysInAdvance: number | Date;
  ischeckDate: boolean = false;
   subject = new Subject();
  ischeckbtn: boolean = false;
  specs:any={};
  objectLength: number = 0;
  dailyRatePkgs: { pkgId: number; adults: any; childs: any; seniors: any; custom1: any; custom2: any; checkin: string; time: string;  specs: any };
  chooseExpPkg: any;

  timeId: any;
  constructor(public platform: Platform, public navCtrl: NavController, public zone: NgZone, public searchhotel: SearchHotel, public authService: AuthService, private http: HttpClientModule,
    public gf: GlobalFunction, public modalCtrl: ModalController, private pickerController: PickerController, private storage: Storage,
    public tourService: tourService,
    public valueGlobal: ValueGlobal,
    public ticketService: ticketService) {

      if (ticketService.itemTicketService) {
        this.hasDeparture = true;
  
        this.loaddeparturedone = true;
        this.itemTicketService = this.ticketService.itemTicketService;
        console.log(this.itemTicketService);
      }
      else {
        this.hasDeparture = false;
      }
      this.selectNewPackage(this.ticketService.itemTicketService.itemObjRate.pkgId)
      
      var timestamp = new Date();
      var res = timestamp.setTime(timestamp.getTime() + 1 * 24 * 60 * 60 * 1000);
      var date = new Date(res);
     
      var res = timestamp.setTime(timestamp.getTime() + 180 * 24 * 60 * 60 * 1000);
      var date = new Date(res);
  
      if (this.dailyRatePkgs.specs) {
  
        if (this.ticketService.itemTicketService.itemObjRate && this.ticketService.itemTicketService.itemObjRate.specs && this.ticketService.itemTicketService.itemObjRate.specs.length > 0) {
          if (this.ticketService.itemTicketService.itemObjRate.specs.length === 1) {
            this.ticketService.itemTicketService.itemObjRate.specs.forEach(element => {
              element.child.forEach(elementC => {
                if (elementC.child_id === this.dailyRatePkgs.specs[element.id]) {
                  elementC.action = true;
                } else {
                  elementC.action = false;
                }
              });
            });
          }
        }
      
        let matchedSkus = this.itemTicketService.itemObjRate.skus.filter(x => x.spec.join(',') === Object.values(this.dailyRatePkgs.specs).join(','))
        if (matchedSkus.length > 0) {
          this.checkinDate = matchedSkus[0].skusDaily.dailyRate[0].date;
        }
        else {
          for (let index = 0; index < this.itemTicketService.itemObjRate.skus.length; index++) {
            const element = this.itemTicketService.itemObjRate.skus[index];
            if(element.skusDaily && element.skusDaily.dailyRate[0]){
              this.checkinDate = element.skusDaily.dailyRate[0].date;
              break;
            }
            
          }
          
        }
        this.dailyRatePkgs.checkin = this.checkinDate
       
      } else {
    
        this.checkinDate = this.itemTicketService.itemObjRate.skus[0].skusDaily.dailyRate[0].date
        this.dailyRatePkgs.checkin = this.checkinDate
      
      }
      var dateParts = this.checkinDate.split("-"); // Tách chuỗi thành mảng các phần tử
      this.dateDisplay = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
      this.ticketService.itemTicketService.AllotmentDateDisplay =  this.dateDisplay
      // }
      this.index = 0;
      this.ticketService.selectedDateDisplay =  moment(this.checkinDate).format('DD-MM-YYYY');
      this.ticketService.selectedDate =  moment(this.checkinDate).format('YYYY-MM-DD');
      this.ticketService.itemTicketService.AllotmentDateDisplay = moment(this.checkinDate).format('DD-MM-YYYY');
      //Select ngày theo ngày đang default 
      this.itemTicketService.dailyRatePkgs = [];
       if (this.itemTicketService.itemObjRate.skus){
        if(this.timeId && this.timeId.length > 0){
          this.itemTicketService.dailyRatePkgs = this.timeId[0].skusDaily.dailyRate
         
        }else{
          if (!this.itemTicketService.itemObjRate.specs || (this.itemTicketService.itemObjRate.specs && this.itemTicketService.itemObjRate.specs.length == 0)) {
            this.itemTicketService.dailyRatePkgs = this.itemTicketService.itemObjRate.skus[0].skusDaily.dailyRate;
          }
  
        }
  
      }
      if (this.itemTicketService.dailyRatePkgs) {
        this.itemTicketService.dailyRatePkgs.forEach(element => {
          if(element.date == this.checkinDate){
            element.action = true;
          }
          let tomorrowDate = moment(new Date()).add('days',1).format('YYYY-MM-DD');
          let todayDate = moment(new Date()).format('YYYY-MM-DD');
          element.dailydisplay = element.date == tomorrowDate ? 'Ngày mai' : (element.date == todayDate? 'Hôm nay' :moment(element.date).format('DD/M'));
        });
      }
  
  
      if (this.itemTicketService.minPax > 0) {
        if (this.itemTicketService.allowAdults) {
          this.adult = this.itemTicketService.minPax;
          this.totalPax = this.adult;
        }
        else if (!this.itemTicketService.allowAdults && this.itemTicketService.allowChildren) {
          this.child = this.itemTicketService.minPax;
          this.totalPax = this.child;
        }
        else if (!this.itemTicketService.allowAdults && !this.itemTicketService.allowChildren && this.itemTicketService.allowSeniors) {
          this.elder = this.itemTicketService.minPax;
          this.totalPax = this.elder;
        }
        else if (!this.itemTicketService.allowAdults && !this.itemTicketService.allowChildren && !this.itemTicketService.allowSeniors && this.itemTicketService.allowCustom1) {
          this.Custom1 = this.itemTicketService.minPax;
          this.totalPax = this.Custom1;
        }
        else if (!this.itemTicketService.allowAdults && !this.itemTicketService.allowChildren && !this.itemTicketService.allowSeniors && !this.itemTicketService.allowCustom1 && this.itemTicketService.allowCustom2) {
          this.Custom2 = this.itemTicketService.minPax;
          this.totalPax = this.Custom2;
        }
      }
      else {
        this.adult = 1;
      }
      if (this.itemTicketService.itemObjRate.specs && this.itemTicketService.itemObjRate.specs.length > 0) {
  
        this.objectLength = Object.keys(this.specs).length;
        let arrSort = this.itemTicketService.itemObjRate.specs.find((el) => { return el.name == 'Điểm trả khách' || el.name == 'Điểm đón khách' });
        if (arrSort) {
          arrSort.child.sort(function (a, b) {
            return a.child_name.length - b.child_name.length;
          });
          var foundIndex = this.itemTicketService.itemObjRate.specs.findIndex(x => x.name == 'Điểm trả khách' || x.name == 'Điểm đón khách');
          this.itemTicketService.itemObjRate.specs[foundIndex].child = arrSort.child;
        }
      }
      this.gf.showLoading();
      this.GetDailyRatePackages();
      this.subject.pipe(debounceTime(500)).subscribe(value => {
        if (value) {
          this.GetDailyRatePackages();
        }
      });
  }

  ngOnInit() {

  }


  calculatePrice() {
    let se = this;
    if (this.itemTicketService && this.itemTicketService.skus) {
      // let totalPrice = this.itemTicketService.skus.rateAdult * this.searchhotel.adult + this.itemTicketService.skus.rateChild * this.searchhotel.child  + this.itemTicketService.skus.rateSenior * this.searchhotel.elder;
      this.zone.run(() => {
        this.totalPrice = this.itemTicketService.skus.totalRateRounded;
        this.ischeckbtn=true;
      })
    }

  }

  goback() {
    this.navCtrl.navigateBack('ticketdetail');
  }

  book() {
    if (this.arrSkus && this.arrSkus.length == 0) {
      return;
    }
    // if (!this.ischeckDate) {
    //   alert('Vui lòng chọn ngày');
    //   return;
    // }
    this.ticketService.totalPax = this.totalPax;
    this.RecheckRateBooking();
  }
  addPax(type) {
    if (this.arrSkus.length > 0 && this.totalPax < this.itemTicketService.maxPax && this.totalPax >= this.itemTicketService.minPax) {
      if (type == 1) {
        this.adult++;
        this.dailyRatePkgs.adults = this.adult
      } else if (type == 2) {
        this.child++;
        this.dailyRatePkgs.childs = this.child
      } else if (type == 3) {
        this.elder++;
        this.dailyRatePkgs.seniors = this.elder
      }
      else if (type == 4) {
        this.Custom1++;
        this.dailyRatePkgs.custom1 = this.Custom1
      }
      else if (type == 5) {
        this.Custom2++;
        this.dailyRatePkgs.custom2 = this.Custom1
      }
      this.totalPax = this.adult + this.child + this.elder + this.Custom1 + this.Custom2;
      this.ischeckbtn = false;
      this.dailyRatePkgs.adults = this.adult;
      this.dailyRatePkgs.childs = this.child;
      this.dailyRatePkgs.seniors = this.elder;
      this.dailyRatePkgs.custom1 = this.Custom1;
      this.dailyRatePkgs.custom2 = this.Custom2;
      this.subject.next(true);
    } else {
      alert('Vé chỉ được phép đặt tối đa ' + this.totalPax + ' khách');
    }
  }
  removePax(type) {
    if (this.arrSkus.length > 0 && this.totalPax <= this.itemTicketService.maxPax && this.totalPax > this.itemTicketService.minPax) {
      if (type == 1) {
        if (this.adult == 0) {
          this.gf.showToastWarning('Số lượng khách không hợp lệ. Vui lòng kiểm tra lại.');
          return;
        }
        if (this.child == 0 && this.elder == 0 && this.adult == 1) {
          this.gf.showToastWarning('Số lượng khách không hợp lệ. Vui lòng kiểm tra lại.');
          return;
        }
        this.adult--;
        this.ischeckbtn = false;
        // this.subject.next(true);

      } else if (type == 2) {
        if (this.child == 0) {
          this.gf.showToastWarning('Số lượng khách không hợp lệ. Vui lòng kiểm tra lại.');
          return;
        }
        if (this.adult == 0 && this.elder == 0 && this.child == 1) {
          this.gf.showToastWarning('Số lượng khách không hợp lệ. Vui lòng kiểm tra lại.');
          return;
        }
        this.child--;
        this.ischeckbtn = false;
        // this.subject.next(true);
      } else if (type == 3) {
        if (this.elder <= 0) {
          this.gf.showToastWarning('Số lượng khách không hợp lệ. Vui lòng kiểm tra lại.');
          return;
        }
        if (this.adult == 0 && this.child == 0 && this.Custom1 == 0 && this.Custom2 == 0 && this.elder == 1) {
          this.gf.showToastWarning('Số lượng khách không hợp lệ. Vui lòng kiểm tra lại.');
          return;
        }
        this.elder--;
        this.ischeckbtn = false;
        // this.subject.next(true);
      } else if (type == 4) {
        if (this.Custom1 <= 0) {
          this.gf.showToastWarning('Số lượng khách không hợp lệ. Vui lòng kiểm tra lại.');
          return;
        }
        if (this.adult == 0 && this.child == 0 && this.elder == 0 && this.Custom2 == 0 && this.Custom1 == 1) {
          this.gf.showToastWarning('Số lượng khách không hợp lệ. Vui lòng kiểm tra lại.');
          return;
        }
        this.Custom1--;
        this.ischeckbtn = false;
        // this.subject.next(true);
      } else if (type == 5) {
        if (this.Custom2 <= 0) {
          this.gf.showToastWarning('Số lượng khách không hợp lệ. Vui lòng kiểm tra lại.');
          return;
        }
        if (this.adult == 0 && this.child == 0 && this.elder == 0 && this.Custom1 == 0 && this.Custom2 == 1) {
          this.gf.showToastWarning('Số lượng khách không hợp lệ. Vui lòng kiểm tra lại.');
          return;
        }
        this.Custom2--;
        this.ischeckbtn = false;
    
      }
      this.dailyRatePkgs.adults = this.adult;
      this.dailyRatePkgs.childs = this.child;
      this.dailyRatePkgs.seniors = this.elder;
      this.dailyRatePkgs.custom1 = this.Custom1;
      this.dailyRatePkgs.custom2 = this.Custom2;
      this.subject.next(true);
      this.totalPax = this.adult + this.child + this.elder + this.Custom1 + this.Custom2;
    }

  }
  async openPickupCalendar(){
    let se = this;

    se.allowclickcalendar = false;
    this.ticketService.ischeckCalendar = true;
    this.ticketService.timeId = "";
    this.ticketService.timeId = this.timeId;
    this.ticketService.checkinDate = this.checkinDate;
    let modal = await se.modalCtrl.create({
      component: SelectDateRangePage,
    });
    modal.present().then(()=>{ se.allowclickcalendar = true; });
      const event: any = await modal.onDidDismiss();
      const date = event.data;
      if (event.data) {
       
        se.ticketService.itemTicketService.AllotmentDateDisplay = moment(event.data.from).format('DD-MM-YYYY');
        se.checkinDate = moment(event.data.from).format('YYYY-MM-DD');
        this.dailyRatePkgs.checkin = this.checkinDate;
        this.ticketService.checkinDate = this.checkinDate;
        se.dateDisplay = moment(event.data.from).format('DD-MM');
       
        if(this.itemTicketService.dailyRatePkgs && this.itemTicketService.dailyRatePkgs.length>0){
          this.itemTicketService.dailyRatePkgs.forEach(element => {
            element.action=false;
            if(element.date == this.checkinDate){
              element.action = true;
            }
          })
        }
        se.ischeckDate = true;
        se.ticketService.selectedDateDisplay =  moment(event.data.from).format('DD-MM-YYYY');
        se.ticketService.selectedDate =  moment(event.data.from).format('YYYY-MM-DD');

        se.GetDailyRatePackages();
      }

      modal.present().then(() => {
        se.allowclickcalendar = true;
      });
  }
   /**
   * Hàm bắt sự kiện click chọn ngày trên lịch bằng jquery
   * @param e biến event
   */

  /**
  * Hàm bắt sự kiện click chọn ngày trên lịch bằng jquery
  * @param e biến event
  */
  async clickedElement(e: any) {
    var se = this;
    var obj: any = e.currentTarget;
    var pElement = obj.querySelector('p');
    if (pElement && !pElement.classList.contains('text-xam')) {
      if ($(obj).hasClass('on-selected')) {
        if (this.modalCtrl) {
          let fday: any;
          let tday: any;
          var monthenddate: any;
          var yearenddate: any;
          var monthstartdate: any;
          var yearstartdate: any;
          var objTextMonthEndDate: any;
          var objTextMonthStartDate: any;
  
          if ($('.days-btn.lunarcalendar.on-selected > p')[0]) {
            fday = $('.days-btn.lunarcalendar.on-selected > p')[0].innerText;
            tday = fday;
            objTextMonthStartDate = $('.on-selected')?.closest('.month-box')?.children()[0]?.textContent?.replace('Tháng ', '');
            objTextMonthEndDate = objTextMonthStartDate;
          } else {
            fday = $('.on-selected > p')[0].textContent;
            tday = fday;
            objTextMonthStartDate = $('.on-selected')?.closest('.month-box')?.children()[0]?.textContent?.replace('Tháng ', '');
            objTextMonthEndDate = objTextMonthStartDate;
          }
          if (
            objTextMonthEndDate &&
            objTextMonthEndDate.length > 0 &&
            objTextMonthStartDate &&
            objTextMonthStartDate.length > 0
          ) {
            monthstartdate = objTextMonthStartDate.split(" ")[0];
            yearstartdate = objTextMonthStartDate.split(" ")[1];
            monthenddate = objTextMonthEndDate.split(" ")[0];
            yearenddate = objTextMonthEndDate.split(" ")[1];
            var fromdate = new Date(yearstartdate, monthstartdate - 1, fday);
            var todate = new Date(yearenddate, monthenddate - 1, tday * 1 + 1);
            if (fromdate && todate && moment(todate).diff(fromdate, "days") >= 0) {
  
              setTimeout(() => {
                se.modalCtrl.dismiss();
              }, 300);
              // se.searchhotel.CheckInDate = moment(fromdate).format('YYYY-MM-DD');
              se.ticketService.itemTicketService.AllotmentDateDisplay = moment(fromdate).format('DD-MM-YYYY');
              se.checkinDate = moment(fromdate).format('YYYY-MM-DD');
              this.dailyRatePkgs.checkin = this.checkinDate;
              // se.itemTicketService.AllotmentDateDisplay = moment(fromdate).format('DD-MM-YYYY');
              se.dateDisplay = moment(fromdate).format('DD-MM-YYYY');
              
              if(this.itemTicketService.dailyRatePkgs && this.itemTicketService.dailyRatePkgs.length>0){
                this.itemTicketService.dailyRatePkgs.forEach(element => {
                  element.action=false;
                  if(element.date == this.checkinDate){
                    element.action = true;
                  }
                })
              }
              
              se.ticketService.selectedDateDisplay =  moment(fromdate).format('DD-MM-YYYY');
              se.ticketService.selectedDate =  moment(fromdate).format('YYYY-MM-DD');
              // this.ischeckDate = true;
              this.ticketService.checkinDate = this.checkinDate;
              // se.itemTicketService.AllotmentDateDisplay = moment(fromdate).format('DD-MM-YYYY');
              se.dateDisplay = moment(fromdate).format('DD-MM');
              // for (let i = 0; i < this.itemTicketService.dailyRatePkgs.length; i++) {
              //   const element = this.itemTicketService.dailyRatePkgs[i];
              //   element.action=false;
              //   if (element.daily==se.searchhotel.CheckInDate) {
              //     this.index=i;
              //     element.action=true;
              //   }
              // }
              this.ischeckDate = true;
              se.GetDailyRatePackages();
            }
          }
        }
      }
    }else{
      var buttonElement = $(obj); 
      buttonElement.removeClass('on-selected');

    
      var targetDate = new Date(this.checkinDate); // Chuyển đổi ngày mục tiêu thành đối tượng Date
      $(".days-btn").each(function() {
        var buttonElement1:any; // Lấy thẻ button
        var dayText = buttonElement1.find('p').text();// Lấy nội dung của thẻ p
        var year = new Date().getFullYear();
        // var month = new Date().getMonth();
        var monthText:any = buttonElement.find('.price-calendar-text-ticket').text(); 
        // Tạo đối tượng Date từ ngày, tháng và năm
        var buttonDate = new Date(year, monthText, parseInt(dayText));
        var formattedDate = moment(buttonDate).format('YYYY-MM-DD');
        // So sánh ngày của thẻ với ngày mục tiêu
        if (formattedDate == se.checkinDate) {
          buttonElement1.addClass('on-selected'); // Thêm class "on-selected" cho thẻ button có ngày trùng khớp
        }
      });
     
    }
  
  }
  closecalendar() {
    this.modalCtrl.dismiss();
  }
  async selectAge(textchild) {
    var se = this;

    var columnOptions = ['<1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

    const picker = await this.pickerController.create({
      columns: this.getColumns(1, 11, columnOptions, textchild),
      cssClass: 'action-sheets-select-age',
      buttons: [
        {
          text: textchild,
          cssClass: 'picker-header',
          handler: (value) => {

            return false;
          }
        }
      ],
    });

    if ($('.picker-wrapper.sc-ion-picker-ios') && $('.picker-wrapper.sc-ion-picker-ios').length > 0) {
      $('.picker-wrapper.sc-ion-picker-ios').append('<div class="div-button"><button (click)="getPickerValue()" ion-button round outline class="button button-done">Xong</button></div>');
    } else if ($('.picker-wrapper.sc-ion-picker-md') && $('.picker-wrapper.sc-ion-picker-md').length > 0) {
      $('.picker-wrapper.sc-ion-picker-md').append('<div class="div-button"><button (click)="getPickerValue()" ion-button round outline class="button button-done">Xong</button></div>');
    }

    $('.action-sheets-select-age .button-done').on('click', () => {
      let value = $('.picker-opt.picker-opt-selected')[0].innerText;
      se.selectclick(value, textchild);
      picker.dismiss();
    })
    await picker.present();
  }

  selectclick(event, text) {
    for (let i = 0; i < this.searchhotel.arrchild.length; i++) {
      if (this.searchhotel.arrchild[i].text == text) {
        this.searchhotel.arrchild[i].numage = (event == "<1" ? 0 : event);
        break;
      }

    }
    this.GetDailyRatePackages();
  }

  getColumns(numColumns, numOptions, columnOptions, textchild) {
    let columns:any = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: textchild,
        options: this.getColumnOptions(i, numOptions, columnOptions)
      });
    }

    return columns;
  }

  getColumnOptions(columnIndex, numOptions, columnOptions) {
    let options:any = [];
    for (let i = 0; i <= numOptions; i++) {
      options.push({
        text: columnOptions[i],
        value: i
      })
    }

    return options;
  }

 

  showTicketServiceDetail(itemService) {
    if (itemService) {
      this.tourService.itemTicketService = itemService;
      this.navCtrl.navigateForward('/ticketservicedetail');
    }
  }
  funcdate(item) {

    this.checkactionDate(item);
    this.ischeckDate = true;
    // this.calculatePrice();
    this.GetDailyRatePackages();


  }
  checkactionDate(item) {
    // this.checkinDate = moment(item.daily).format('YYYY-MM-DD');
    // this.dailyRatePkgs.checkin = this.checkinDate;
    // this.dateDisplay = moment(item.daily).format('DD/MM');
    // this.searchhotel.CheckInDate = moment(item.daily).format('YYYY-MM-DD');
    this.ischeckbtn = false;
    for (let i = 0; i < this.itemTicketService.dailyRatePkgs.length; i++) {
      const element = this.itemTicketService.dailyRatePkgs[i];
      this.zone.run(()=>{
        element.action = false;
        if (element.date == item.date) {
          this.index = i;
          element.action = true;
        }
      })
      
    }
    let _fromdate = item.date;
    this.ticketService.itemTicketService.AllotmentDateDisplay = moment(_fromdate).format('DD-MM-YYYY');
    this.checkinDate = moment(_fromdate).format('YYYY-MM-DD');
    this.dailyRatePkgs.checkin = this.checkinDate;
    this.dateDisplay = moment(_fromdate).format('DD-MM-YYYY');
   
    this.ticketService.selectedDateDisplay =  moment(_fromdate).format('DD-MM-YYYY');
    this.ticketService.selectedDate =  moment(_fromdate).format('YYYY-MM-DD');
    this.subject.next(true);
  }
  funcsku(index) {
    this.indexSku = index;
    this.arrSkus = this.arrSkus.map((item) => {
      return { ...item, action: false }
    });
    this.arrSkus[this.indexSku].action = true;
    this.subject.next(true);
  }
  funcspecs(arrSpecs, item, itemc, index) {
    arrSpecs = arrSpecs.map((item) => {
      return { ...item, action: false }
    });
    arrSpecs[index].action = true;
    this.ischeckbtn = false;
    var foundIndex = this.itemTicketService.itemObjRate.specs.findIndex(x => x.id == item.id);
    this.itemTicketService.itemObjRate.specs[foundIndex].child = arrSpecs;
   
    this.onSelectSpecs(item.id, itemc.child_id);
    
    if (this.itemTicketService.itemObjRate.skus && this.itemTicketService.itemObjRate.skus.length !== 0) {
      this.timeId = [];
      this.itemTicketService.dailyRatePkgs = [];
      this.timeId = this.itemTicketService.itemObjRate.skus.filter(x => x.spec.join(',') === Object.values(this.dailyRatePkgs.specs).join(','));
      if (this.timeId && this.timeId.length > 0) {
        let objDate = this.timeId[0].skusDaily.dailyRate.filter(x => x.price > 0 && x.date === this.checkinDate)
        if (objDate && objDate.length == 0) {
          let objDateNext = this.timeId[0].skusDaily.dailyRate.filter(x => x.price > 0)
          if (objDateNext && objDateNext.length > 0) {
            this.checkinDate = objDateNext[0].date;
            this.dailyRatePkgs.checkin = objDateNext[0].date;
            var dateParts = this.checkinDate.split("-"); // Tách chuỗi thành mảng các phần tử
            this.dateDisplay = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
            this.ticketService.itemTicketService.AllotmentDateDisplay = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
            // this.ischeckDate = true;
          }
          
        }
        if (this.timeId[0].skusDaily && this.timeId[0].skusDaily.times && this.timeId[0].skusDaily.times.length !== 0) {
          this.itemTicketService.itemObjRate.times = this.timeId[0].skusDaily.times;
          this.timeTicket = this.timeId[0].skusDaily.times[0];
          this.dailyRatePkgs.time = this.timeId[0].skusDaily.times[0];
        }

          this.itemTicketService.dailyRatePkgs = this.timeId[0].skusDaily.dailyRate;
          this.itemTicketService.dailyRatePkgs.forEach(element => {
            element.action = false;
            if(element.date == this.checkinDate){
              element.action = true;
            }
            let tomorrowDate = moment(new Date()).add('days',1).format('YYYY-MM-DD');
            let todayDate = moment(new Date()).format('YYYY-MM-DD');
            element.dailydisplay = element.date == tomorrowDate ? 'Ngày mai' : (element.date == todayDate? 'Hôm nay' :moment(element.date).format('DD/M'));
          });
        
      }
     
    } else {
      if (this.itemTicketService.itemObjRate.skus && this.itemTicketService.itemObjRate.skus.length > 0) {
        this.itemTicketService.itemObjRate.times = this.itemTicketService.itemObjRate.skus[0].skusDaily.times;
        this.timeTicket = this.itemTicketService.itemObjRate.skus[0].skusDaily.times[0];
        this.dailyRatePkgs.time = this.itemTicketService.itemObjRate.skus[0].skusDaily.times[0];
      }

    }
    this.subject.next(true);
  }
  RecheckRateBooking() {
    let object = {
      adults: this.adult,
      childs: this.child,
      custom1: this.Custom1,
      custom2: this.Custom2,
      seniors: this.elder,
      token: this.reCheckToken,
      tokenBooking: this.itemTicketService.skus.bookingToken,
      checkin: this.checkinDate,
      totalRate: this.itemTicketService.skus.totalNet,
      source: 6
    }
    let headers =
    {
      'content-type': 'application/json'
    }
    this.gf.showLoading();
    this.gf.RequestApi('POST', C.urls.baseUrl.urlTicket + '/api/Booking/RecheckAndInitBooking', headers, object, 'ticketservice', 'RecheckRateBooking').then((data: any) => {
      this.gf.hideLoading();
      if (data && data.success) {
        this.ticketService.itemTicketService.objbooking = data.data;
        this.ticketService.hasAllotment = this.hasAllotment;
        this.ticketService.paymentType = 1;
        this.ticketService.totalPriceNum = this.totalPrice;
        this.ticketService.indexDetail = this.index;
        this.ticketService.skus = this.arrSkus[this.indexSku];
        this.ticketService.adult = this.adult;
        this.ticketService.child = this.child;
        this.ticketService.elder = this.elder;
        this.navCtrl.navigateForward('/ticketadddetails');
      }
    });
  }
  GetDailyRatePackages() {
    let obj = this.dailyRatePkgs
    let headers =
    {
      'content-type': 'application/json'
    }
    this.gf.RequestApi('POST', C.urls.baseUrl.urlTicket + '/api/Detail/GetDailyRatePackages', headers, obj, 'ticketservice', 'GetDailyRatePackages').then((data: any) => {
      this.gf.hideLoading();
      this.arrSkus=[];
      this.itemTicketService.skus =[];
      //this.itemTicketService.dailyRatePkgs = [];
      this.ischeckbtn=false;
      if (data && data.success) {
        this.arrSkus = data.data.skus;
        this.zone.run(() => {
          if (this.arrSkus && this.arrSkus.length > 0) {
            this.arrSkus =  this.arrSkus.map((item) => {
              return { ...item, action: false}
            });
                    
            this.arrSkus[this.indexSku].action = true;
            this.reCheckToken = this.arrSkus[this.indexSku].reCheckToken;
            this.itemTicketService.skus = this.arrSkus[this.indexSku];
      
            this.calculatePrice();
          }
        })
      
      } else {
        alert('Lỗi request api')
      }
    })
  }
  InitBooking(object) {
    let headers =
    {
      'content-type': 'application/json'
    }
    this.gf.RequestApi('POST', C.urls.baseUrl.urlTicket + '/api/Booking/InitBooking/' + this.ticketService.itemTicketService.id, headers, object, 'ticketservice', 'InitBooking').then((data: any) => {
      if (data && data.success) {
        this.ticketService.itemTicketService.objbooking = data.data;
        this.ticketService.hasAllotment = this.hasAllotment;
        this.ticketService.paymentType = 1;
        this.ticketService.totalPriceNum = this.totalPrice;
        this.ticketService.indexDetail = this.index;
        this.ticketService.skus = this.arrSkus[this.indexSku];
        this.gf.hideLoading();
        this.ticketService.adult = this.adult;
        this.ticketService.child = this.child;
        this.ticketService.elder = this.elder;
        this.navCtrl.navigateForward('/ticketadddetails');
      }
    })
  }
  timeOption(event) {
    this.timeTicket = event.detail.value;
    this.dailyRatePkgs.time = this.timeTicket;
    this.GetDailyRatePackages();
  }

   async selectNewPackage(pkgId) {

    const pkgSelect = this.ticketService.itemTicketService;
    this.chooseExpPkg = pkgSelect;

    const { allowAdults, allowChildren, allowSeniors, allowCustom1, allowCustom2, departureTimes, minPax } = pkgSelect
    let minPaxNew = minPax

    const _packageSearch = this.ticketService.itemTicketService.itemObjRate
    // nếu có option chẳn / lẽ thì check xem default là lẽ thì sẽ + thêm 1
    if (_packageSearch && _packageSearch.isMultipleLimit && minPaxNew % 2 !== 0) {
      minPaxNew += 1
    }

    this.dailyRatePkgs = {
      pkgId: pkgId,
      adults: allowAdults ? minPaxNew : 0,
      childs: (!allowAdults && allowChildren) ? minPaxNew : 0,
      seniors: (!allowAdults && !allowChildren && allowSeniors) ? minPaxNew : 0,
      custom1: (!allowAdults && !allowChildren && !allowSeniors && allowCustom1) ? minPaxNew : 0,
      custom2: (!allowAdults && !allowChildren && !allowSeniors && !allowCustom1 && allowCustom2) ? minPaxNew : 0,
      checkin: this.checkinDate,
      time: '',
      specs: {}
    }


    if (_packageSearch && _packageSearch.dailyRateAvailableSpes && _packageSearch.dailyRateAvailableSpes.length !== 0) {
      const [_dailyRateAvailable] = _packageSearch.dailyRateAvailableSpes;
      
     

      if (this.ticketService.itemTicketService.itemObjRate.specs && this.ticketService.itemTicketService.itemObjRate.specs.length > 0) {
        this.ticketService.itemTicketService.itemObjRate.specs.forEach((_spec, index) => {
          let objAction = _spec.child.filter(x => x.action == true);
          if (objAction && objAction.length>0) {
            this.onSelectSpecs(_spec.id, objAction[0].child_id);
          }
  
        })
      }
   

      if (_packageSearch.specs && _packageSearch.specs.length !== 0) {
        this.timeId = _packageSearch.skus.filter(x => x.spec.join(',') === Object.values(this.dailyRatePkgs.specs).join(','))

        if (this.timeId && this.timeId.length > 0 && this.timeId[0].skusDaily && this.timeId[0].skusDaily.times && this.timeId[0].skusDaily.times.length !== 0) {
          this.itemTicketService.itemObjRate.times = this.timeId[0].skusDaily.times;
          this.timeTicket = this.timeId[0].skusDaily.times[0];
          this.dailyRatePkgs.time = this.timeId[0].skusDaily.times[0];
        }
      } else {
        if (this.itemTicketService.itemObjRate.skus && this.itemTicketService.itemObjRate.skus.length > 0) {
          this.itemTicketService.itemObjRate.times = this.itemTicketService.itemObjRate.skus[0].skusDaily.times;
          this.timeTicket = this.itemTicketService.itemObjRate.skus[0].skusDaily.times[0];
          this.dailyRatePkgs.time = this.itemTicketService.itemObjRate.skus[0].skusDaily.times[0];
        }
      }
 
    }
  }

  async onSelectSpecs(parentKey: string, childId: string) {
    if (!this.isSpecAvailable(childId))
      return;
    const newSpecs = { ...this.dailyRatePkgs.specs }
    newSpecs[parentKey] = childId
    const { specs } = this.dailyRatePkgs
    specs[parentKey] = childId;
  }
  isSpecAvailable(childId: string) {
    // const _packageSearch = this.ticketService.itemTicketService.itemObjRate;
    if (this.ticketService.itemTicketService.itemObjRate.specs.length === 1) {
      if (this.ticketService.itemTicketService.itemObjRate.skus.some(x => x.spec.length === 1 && x.spec[0] === childId && x.skusDaily.dailyRate.length !== 0)) {
        return true
      } else {
        return false
      }
    }
    return true
  }

}

