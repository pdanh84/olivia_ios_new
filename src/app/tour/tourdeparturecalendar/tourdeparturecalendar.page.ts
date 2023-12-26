
import { Component, NgZone,OnInit } from '@angular/core';
import { NavController, Platform, ModalController, PickerController } from '@ionic/angular';
import { AuthService } from '../../providers/auth-service';
import { HttpClientModule } from '@angular/common/http';
import { C } from '../../providers/constants';
import { GlobalFunction } from '../../providers/globalfunction';
import { tourService } from 'src/app/providers/tourService';
import * as moment from 'moment';
import * as $ from 'jquery';
import { SelectDateRangePage } from 'src/app/selectdaterange/selectdaterange.page';
import { Storage } from '@ionic/storage';
import { SearchHotel, ValueGlobal } from 'src/app/providers/book-service';
/**
 * Generated class for the tourServiceFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tourdeparturecalendar',
  templateUrl: 'tourdeparturecalendar.page.html',
  styleUrls: ['tourdeparturecalendar.page.scss'],
})
export class TourDepartureCalendarPage implements OnInit{
  totalPriceStr: number;
  hasAllotment: boolean = false;
  itemDepartureCalendar: any;
  myCalendar: HTMLIonModalElement;
  allowclickcalendar: boolean=true;
  MsgError: any;
  hasDeparture:boolean=false;
  infant = '<1';
  point: number=0;
  pointbkg = '';
  listCalendarPrice:any = [];
  AllotmentAvaiable: any;
  statusAllotment: any;
  loaddeparturedone: boolean=false;
  constructor(public platform: Platform,public navCtrl: NavController, public zone: NgZone, public authService: AuthService, private http: HttpClientModule,
    public gf: GlobalFunction,public modalCtrl: ModalController, private pickerController: PickerController,
    public tourService: tourService,
    public searchhotel: SearchHotel,
    private storage: Storage,
    public valueGlobal: ValueGlobal) {
      if(!tourService.adult){
        tourService.adult = 2;
      }
      if(!tourService.child){
        tourService.child = 0;
      }
      if(tourService.itemDepartureCalendar){
        this.hasDeparture = true;
        this.itemDepartureCalendar = tourService.itemDepartureCalendar;
      }
      else{
        this.hasDeparture = false;
      }
       this.calculatePrice(0);
       this.GetUserInfo();
       this.platform.resume.subscribe(async()=>{
        if(!tourService.itemDepartureCalendar){
          //this.tourService.itemPaymentDone.emit(true);
          this.valueGlobal.backValue = "hometour";
          this.tourService.BookingTourMytrip = null;
          this.navCtrl.navigateBack('/app/tabs/tab1');
        }
       })
    }
  
  ngOnInit() {
    
  }

  checkTourAllotment(_date, rebuildListCalendarPrice) : Promise<any>{
    var se = this;
    return new Promise((resolve, reject) => {
      let body = { "TourId": se.tourService.tourDetailId,
      "StartDate": moment(_date).format('YYYY-MM-DD'),
      "AdultNo": se.tourService.adult,
      "ChildNo": se.tourService.child ? se.tourService.child :0,
      "ChildAges": se.tourService.child ? se.tourService.arrchild.map(c=>c.numage).join(',') : ""
      };
        // let urlApi = C.urls.baseUrl.urlMobile+'/tour/api/TourApi/CheckAllotmentPreBooking';
        let headers = {
          apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
          apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
        };
        se.gf.RequestApi('GET', C.urls.baseUrl.urlMobile+`/tour/api/TourApi/GetMercuriusTourPrice?TourId=${se.tourService.tourDetailId}&date=${moment(_date).format('YYYY-MM-DD')}&adult=${se.tourService.adult}&child=${se.tourService.child ? se.tourService.child :0}&childAges=${se.tourService.child ? se.tourService.arrchild.map(c=>c.numage).join(',') : ""}&version=${rebuildListCalendarPrice ? 'v2' : 'v3'}`, headers, {}, 'tourdeparturecalendar', 'GetMercuriusTourPrice').then((data)=>{
          if(data.Status != 'Error' && data.Response.Status != 'ER' && data.Response.Status != 'False'){
              this.itemDepartureCalendar = data.Response.TourRate;
             
              this.zone.run(()=>{
                if(this.itemDepartureCalendar.RateChildAvg){
                  this.itemDepartureCalendar.PriceChildAvg = this.itemDepartureCalendar.RateChildAvg;
                  this.itemDepartureCalendar.PriceChildAvgStr = this.gf.convertNumberToString(this.itemDepartureCalendar.RateChildAvg.toFixed(0));
                  this.itemDepartureCalendar.PriceAdultAvgStr = this.gf.convertNumberToString(this.itemDepartureCalendar.RateAdultAvg.toFixed(0));
                  this.tourService.itemDepartureCalendar = this.itemDepartureCalendar;
                }
                this.hasAllotment = this.itemDepartureCalendar.Status == 'AL';
                this.tourService.hasAllotment = this.itemDepartureCalendar.Status == 'AL';

                this.AllotmentAvaiable = this.itemDepartureCalendar.AvaiableNo;
                this.statusAllotment = this.itemDepartureCalendar.Status;
              
                if(rebuildListCalendarPrice){
                  let _listCalendarPrice = data.Response.StrListDepartures.split(',');
                  let _dayselect =moment(_date).format('YYYY-MM-DD');
                  this.buildListCalendarPrice(_listCalendarPrice, _dayselect);
                }
              })
              
              resolve(true);
            }else{
              this.MsgError = data.Response.MSG;
              this.zone.run(()=>{
                this.listCalendarPrice = [];
                this.hasAllotment = false;
                this.tourService.hasAllotment = false;
              })
              resolve(false);
            }
            
        })
    })
    
  }

  buildListCalendarPrice(_listCalendarPrice, _dayselect){
    this.listCalendarPrice = [];
    if(_listCalendarPrice && _listCalendarPrice.length >0){
      let idx= _listCalendarPrice.findIndex(i => i==_dayselect);
      if(idx ==0){//ngày đang check đứng đầu mảng => lấy 3 item đầu
        if(_listCalendarPrice.length >2){
          this.listCalendarPrice = _listCalendarPrice.splice(0,3);
        }else{
          this.listCalendarPrice = _listCalendarPrice;
        }
        
      }else if(idx == _listCalendarPrice.length-1){//ngày đang check đứng cuối mảng => lấy 3 item cuối
        let arrlen = _listCalendarPrice.length;
        if(_listCalendarPrice.length >2){
          this.listCalendarPrice = _listCalendarPrice.splice(arrlen-3,arrlen-1);
        }else{
          this.listCalendarPrice = _listCalendarPrice;
        }
      }else {
        if(_listCalendarPrice.length >2){
          this.listCalendarPrice.push(_listCalendarPrice[idx-1]);
          this.listCalendarPrice.push(_listCalendarPrice[idx]);
          this.listCalendarPrice.push(_listCalendarPrice[idx+1]);
        }else{
          this.listCalendarPrice = _listCalendarPrice;
        }
      }
      this.listCalendarPrice = this.getFullDayInfo(this.listCalendarPrice, _dayselect);
      console.log(this.listCalendarPrice);
      //this.listCalendarPrice = this.listCalendarPrice.splice(0,2);
    }
  }

  getFullDayInfo(list, dayselect){
    if(list && list.length >0){
      list = list.map(i => ({name: `${this.gf.getDayOfWeek(i).daynameshort}, ${moment(i).format('DD-MM')}`, date: i, selected: i == dayselect ? true : false}));
    }
    return list;
  }

  calculatePrice(isShowWarning) {
    let se = this;
    if(this.itemDepartureCalendar){
      let _date = this.itemDepartureCalendar.DepartureDate || this.itemDepartureCalendar.AllotmentDate;
      se.tourService.checkInDate =  moment(_date).format('YYYY-MM-DD');
      se.loaddeparturedone = false;
      this.checkTourAllotment(_date, true).then((check)=>{
        se.loaddeparturedone = true;
        if(check){
          this.tourService.itemDepartureCalendar = this.itemDepartureCalendar;
          let totalPrice = this.itemDepartureCalendar.TotalRate;
          this.zone.run(()=>{
            this.pointbkg = Math.floor(totalPrice/100000).toFixed(0);
            this.totalPriceStr = this.gf.convertNumberToString(totalPrice);
            this.tourService.totalPrice = totalPrice;
            this.tourService.totalPriceStr = this.totalPriceStr;
           
            if(!se.tourService.itemDepartureCalendar){
              let itemmap = se.tourService.departuresItemList.filter(i => i.DepartureDate == moment(_date).format('YYYY-MM-DD'));
              if(itemmap && itemmap.length >0){
               se.tourService.itemDepartureCalendar = itemmap[0];
               se.tourService.hasDeparture = true;
               se.tourService.DepartureDate = itemmap[0].DepartureDate;
              }
            }else {
              this.itemDepartureCalendar.AllotmentDateDisplay = moment(_date).format('DD-MM-YYYY');
              this.tourService.itemDepartureCalendar.AllotmentDateDisplay = moment(_date).format('DD-MM-YYYY');
              //this.tourService.DepartureDate = moment(_date).format('YYYY-MM-DD');
            }
            if(this.itemDepartureCalendar.RateChildAvg){
              this.itemDepartureCalendar.PriceChildAvg = this.itemDepartureCalendar.RateChildAvg;
              this.itemDepartureCalendar.PriceChildAvgStr = this.gf.convertNumberToString(this.itemDepartureCalendar.RateChildAvg.toFixed(0));
            }
            if(this.itemDepartureCalendar.RateAdultAvg) {
              this.itemDepartureCalendar.PriceAdultAvgStr = this.gf.convertNumberToString(this.itemDepartureCalendar.RateAdultAvg.toFixed(0));
            }
            

          })
        }else if(this.tourService.itemDepartureCalendar){
          let totalPrice = ((this.tourService.itemDepartureCalendar.RateAdultAvg || (this.tourService.itemDepartureCalendar.PriceAdultAvg ||0)) * this.tourService.adult || 0) + ((this.tourService.itemDepartureCalendar.RateChildAvg ||0) * this.tourService.child || 0)
          this.zone.run(()=>{
            this.pointbkg = Math.floor(totalPrice/100000).toFixed(0);
            this.totalPriceStr = this.gf.convertNumberToString(totalPrice);
            this.tourService.totalPrice = totalPrice;
            this.tourService.totalPriceStr = this.totalPriceStr;
            this.itemDepartureCalendar.AllotmentDateDisplay = moment(_date).format('DD-MM-YYYY');
            this.tourService.itemDepartureCalendar.AllotmentDateDisplay = moment(_date).format('DD-MM-YYYY');

            if(this.itemDepartureCalendar.RateChildAvg){
              this.itemDepartureCalendar.PriceChildAvg = this.itemDepartureCalendar.RateChildAvg;
              this.itemDepartureCalendar.PriceChildAvgStr = this.gf.convertNumberToString(this.itemDepartureCalendar.RateChildAvg.toFixed(0));
            }
            if(this.itemDepartureCalendar.RateAdultAvg) {
              this.itemDepartureCalendar.PriceAdultAvgStr = this.gf.convertNumberToString(this.itemDepartureCalendar.RateAdultAvg.toFixed(0));
            }
          })
          if(isShowWarning){
            se.gf.showAlertMessageOnly(se.MsgError);
          }
          //
        }
      });
    }else{
      if(this.tourService.itemDepartureCalendar){
        let totalPrice = ((this.tourService.itemDepartureCalendar.RateAdultAvg || (this.tourService.itemDepartureCalendar.PriceAdultAvg ||0)) * this.tourService.adult || 0) + ((this.tourService.itemDepartureCalendar.RateChildAvg ||0) * this.tourService.child || 0)
        this.zone.run(()=>{
          this.pointbkg = Math.floor(totalPrice/100000).toFixed(0);
          this.totalPriceStr = this.gf.convertNumberToString(totalPrice);
          this.tourService.totalPrice = totalPrice;
          this.tourService.totalPriceStr = this.totalPriceStr;
        })
      }else{
        this.zone.run(()=>{
          this.pointbkg = '';
          this.totalPriceStr = 0;
          this.tourService.totalPrice = 0;
          this.tourService.totalPriceStr = 0;
        })
      }
      
    }
    
  }

  goback() {
    //this.tourService.publicScrollToDepartureDiv(1);
    this.navCtrl.pop();
  }

  book(){
    if(!this.tourService.departuresItemList || this.tourService.departuresItemList.length == 0){
      return;
    }
    if(!this.hasDeparture){
      return;
    }
    for (let i = 0; i < this.tourService.arrchild.length; i++) {
      const element = this.tourService.arrchild[i];
      if(!element.text)
      {
        this.gf.showAlertMessageOnly('Vui lòng chọn tuổi trẻ em');
        return;
      }
    }
    this.tourService.hasAllotment = this.hasAllotment;
    this.tourService.paymentType = 1;
    this.tourService.BookingTourMytrip = null;
    this.navCtrl.navigateForward('/touradddetails');
  }

  addPax(type){
    if(!this.tourService.departuresItemList || this.tourService.departuresItemList.length == 0){
      return;
    }
    if(!this.hasDeparture){
      return;
    }
    if(type == 1){
      this.tourService.adult++;
    }else{
      this.tourService.child++;
      let arr = { text: 'Trẻ em' + ' ' + this.tourService.child, numage: "7" }
      this.tourService.arrchild.push(arr);
    }
    this.calculatePrice(1);
  }
  removePax(type){
    if(!this.tourService.departuresItemList || this.tourService.departuresItemList.length == 0){
      return;
    }
    if(!this.hasDeparture){
      return;
    }
    if(type == 1){
      if(this.tourService.adult<=1){
        this.gf.showToastWarning('Số lượng khách không hợp lệ. Vui lòng kiểm tra lại.');
        return;
      }
      this.tourService.adult--;
      this.calculatePrice(1);
     
    }else{
      if(this.tourService.child<=0){
        this.gf.showToastWarning('Số lượng khách không hợp lệ. Vui lòng kiểm tra lại.');
        return;
      }
      this.tourService.child--;
      this.tourService.arrchild.splice(this.tourService.arrchild.length - 1, 1);
      this.calculatePrice(1);
    }
  }
  async openPickupCalendar(){
    let se = this;
    if(!se.hasDeparture){
      return;
    }
    if(!se.allowclickcalendar){
      return;
    }
    if(!this.tourService.departuresItemList || this.tourService.departuresItemList.length == 0){
      return;
    }
    
    se.allowclickcalendar = false;
    se.searchhotel.formChangeDate = 10;
    let modal = await se.modalCtrl.create({
      component: SelectDateRangePage,
        animated: true,
        mode: 'ios'
      });
    modal.present().then(()=>{ se.allowclickcalendar = true; });
      const event: any = await modal.onDidDismiss();
      const date = event.data;
      if (event.data) {
        //  se.zone.run(() => {
        //    se.tourService.checkInDate = moment(event.data.from).format('YYYY-MM-DD');
        //    se.tourService.datecin = new Date(event.data.from);
        //    se.tourService.cindisplay = moment(se.tourService.datecin).format("DD-MM-YYYY");
        //  })
        let fromdate = event.data.from;
        let todate = moment(this.gf.getCinIsoDate(fromdate)).add('days', 1);
        se.loaddeparturedone = false;
        se.checkTourAllotment(this.gf.getCinIsoDate(fromdate), true).then((check)=>{
                se.loaddeparturedone = true;
          if(check){
            let totalPrice = se.itemDepartureCalendar.TotalRate;
              se.zone.run(()=>{
                se.tourService.checkInDate = moment(this.gf.getCinIsoDate(fromdate)).format("YYYY-MM-DD");
                se.tourService.cindisplay = moment(this.gf.getCinIsoDate(fromdate)).format("DD-MM-YYYY");

                se.totalPriceStr = se.gf.convertNumberToString(totalPrice);
                se.tourService.totalPrice = totalPrice;
                se.tourService.totalPriceStr = se.totalPriceStr;
                se.itemDepartureCalendar.AllotmentDateDisplay = moment(this.gf.getCinIsoDate(fromdate)).format('DD-MM-YYYY');
                  let itemmap = se.tourService.departuresItemList.filter(i => i.DepartureDate == moment(this.gf.getCinIsoDate(fromdate)).format('YYYY-MM-DD'));
                  if(itemmap && itemmap.length >0){
                    se.tourService.itemDepartureCalendar = itemmap[0];
                    se.tourService.hasDeparture = true;
                    se.tourService.DepartureDate = itemmap[0].DepartureDate;
                    se.tourService.itemDepartureCalendar.PriceChildAvg = se.itemDepartureCalendar.RateChildAvg;
                    se.tourService.itemDepartureCalendar.RateChildAvg = se.itemDepartureCalendar.RateChildAvg;
                    se.tourService.itemDepartureCalendar.PriceChildAvgStr = se.gf.convertNumberToString(se.itemDepartureCalendar.RateChildAvg.toFixed(0));
                    se.tourService.itemDepartureCalendar.TotalRate = se.itemDepartureCalendar.TotalRate;
                    
                  }
            })
          }
          else{
            se.itemDepartureCalendar.AllotmentDateDisplay = moment(this.gf.getCinIsoDate(fromdate)).format('DD-MM-YYYY');
            se.tourService.DepartureDate =  moment(this.gf.getCinIsoDate(fromdate)).format('YYYY-MM-DD');
            se.tourService.itemDepartureCalendar.AllotmentDateDisplay = moment(this.gf.getCinIsoDate(fromdate)).format('DD-MM-YYYY');
            se.gf.showAlertMessageOnly(se.MsgError);
          
          }
          
       
       })
      }

      modal.present().then(() => {
        se.allowclickcalendar = true;
      });
  }
   /**
   * Hàm bắt sự kiện click chọn ngày trên lịch bằng jquery
   * @param e biến event
   */
    async clickedElement(e: any) {
      var obj: any = e.currentTarget;
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
          if ( $('.days-btn.lunarcalendar.on-selected > p')[0]) {
            fday= $('.days-btn.lunarcalendar.on-selected > p')[0].innerText;
          } else {
            fday = $('.on-selected > p')[0].textContent;
            tday = fday;
            objTextMonthStartDate = $('.on-selected')?.closest('.month-box')?.children()[0]?.textContent?.replace('Tháng ','');
            objTextMonthEndDate = objTextMonthStartDate;
          }
          if (
            objTextMonthEndDate &&
            objTextMonthEndDate.length > 0 &&
            objTextMonthStartDate &&
            objTextMonthStartDate.length > 0
          ) {
            monthstartdate = objTextMonthStartDate.split("/")[0];
            yearstartdate = objTextMonthStartDate.split("/")[1];
            monthenddate = objTextMonthEndDate.split("/")[0];
            yearenddate = objTextMonthEndDate.split("/")[1];
            var fromdate = new Date(yearstartdate, monthstartdate - 1, fday);
            var todate = new Date(yearenddate, monthenddate - 1, tday*1 +1);
            if (fromdate && todate && moment(todate).diff(fromdate, "days") >= 0) {
              var se = this;
              setTimeout(() => {
                se.modalCtrl.dismiss();
              }, 300);
              se.loaddeparturedone = false;
              se.checkTourAllotment(this.gf.getCinIsoDate(fromdate), true).then((check)=>{
                se.loaddeparturedone = true;
                  if(check){
                    let totalPrice = se.itemDepartureCalendar.TotalRate;
                      se.zone.run(()=>{
                        se.tourService.checkInDate = moment(this.gf.getCinIsoDate(fromdate)).format("YYYY-MM-DD");
                        se.tourService.cindisplay = moment(this.gf.getCinIsoDate(fromdate)).format("DD-MM-YYYY");

                        se.totalPriceStr = se.gf.convertNumberToString(totalPrice);
                        se.tourService.totalPrice = totalPrice;
                        se.tourService.totalPriceStr = se.totalPriceStr;
                        se.itemDepartureCalendar.AllotmentDateDisplay = moment(this.gf.getCinIsoDate(fromdate)).format('DD-MM-YYYY');
                          let itemmap = se.tourService.departuresItemList.filter(i => i.DepartureDate == moment(this.gf.getCinIsoDate(fromdate)).format('YYYY-MM-DD'));
                          if(itemmap && itemmap.length >0){
                            se.tourService.itemDepartureCalendar = itemmap[0];
                            se.tourService.hasDeparture = true;
                            se.tourService.DepartureDate = itemmap[0].DepartureDate;
                            se.tourService.itemDepartureCalendar.PriceChildAvg = se.itemDepartureCalendar.RateChildAvg;
                            se.tourService.itemDepartureCalendar.RateChildAvg = se.itemDepartureCalendar.RateChildAvg;
                            se.tourService.itemDepartureCalendar.PriceChildAvgStr = se.gf.convertNumberToString(se.itemDepartureCalendar.RateChildAvg.toFixed(0));
                            se.tourService.itemDepartureCalendar.TotalRate = se.itemDepartureCalendar.TotalRate;
                            
                          }
                    })
                  }
                  else{
                    se.itemDepartureCalendar.AllotmentDateDisplay = moment(this.gf.getCinIsoDate(fromdate)).format('DD-MM-YYYY');
                    se.tourService.DepartureDate =  moment(this.gf.getCinIsoDate(fromdate)).format('YYYY-MM-DD');
                    se.tourService.itemDepartureCalendar.AllotmentDateDisplay = moment(this.gf.getCinIsoDate(fromdate)).format('DD-MM-YYYY');
                    se.gf.showAlertMessageOnly(se.MsgError);
                  
                  }
                  
               
               })
            }
          }
        }
      }
    }
  closecalendar(){
    this.modalCtrl.dismiss();
  }
  async selectAge(textchild){
    var se =this;
   
    var columnOptions =['<1','1','2','3','4','5','6','7','8','9','10','11'];

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

    if($('.picker-wrapper.sc-ion-picker-ios') && $('.picker-wrapper.sc-ion-picker-ios').length >0){
      $('.picker-wrapper.sc-ion-picker-ios').append('<div class="div-button"><button (click)="getPickerValue()" ion-button round outline class="button button-done">Xong</button></div>');
    }else if($('.picker-wrapper.sc-ion-picker-md') && $('.picker-wrapper.sc-ion-picker-md').length >0){
      $('.picker-wrapper.sc-ion-picker-md').append('<div class="div-button"><button (click)="getPickerValue()" ion-button round outline class="button button-done">Xong</button></div>');
    }
    
    $('.action-sheets-select-age .button-done').on('click', ()=>{
      let value = $('.picker-opt.picker-opt-selected')[0].innerText;
      se.selectclick(value, textchild);
      picker.dismiss();
    })
    await picker.present();
  }

  selectclick(event, text) {
    for (let i = 0; i < this.tourService.arrchild.length; i++) {
      if (this.tourService.arrchild[i].text == text) {
        this.tourService.arrchild[i].numage = (event == "<1" ? 0 : event);
        break;
      }

    }
    this.calculatePrice(1);
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
  requestBook(){
    let se = this;
    if(!se.hasDeparture){
      return;
    }
    if(!this.tourService.departuresItemList || this.tourService.departuresItemList.length == 0){
      return;
    }
    if(this.statusAllotment=='SS'){
      return;
    }
    for (let i = 0; i < se.tourService.arrchild.length; i++) {
      const element = se.tourService.arrchild[i];
      if(!element.text)
      {
        se.gf.showAlertMessageOnly('Vui lòng chọn tuổi trẻ em');
        return;
      }
    }
    se.tourService.hasAllotment = se.hasAllotment;
    se.tourService.paymentType = 2;
    se.navCtrl.navigateForward('/touradddetails');
  }
  requestQuote() {
    let se = this;
    if(!this.tourService.departuresItemList || this.tourService.departuresItemList.length == 0){
      return;
    }
    for (let i = 0; i < se.tourService.arrchild.length; i++) {
      const element = se.tourService.arrchild[i];
      if(!element.text)
      {
        se.gf.showAlertMessageOnly('Vui lòng chọn tuổi trẻ em');
        return;
      }
    }
    se.tourService.hasAllotment = false;
    se.tourService.paymentType = 3;
    se.navCtrl.navigateForward('/touradddetails');
    
  }

  
  GetUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        this.gf.getUserInfo(auth_token).then((data) => {
            if (data && data.statusCode != 401) {
              // se.storage.get('point').then(point => {
              //   se.point = point;
              // });
              if (data.point) {
                  se.point = data.point;
                }
            }
        });
      }
    })
  }
  changeItemDeparturePrice(item){
    let se = this;
    se.listCalendarPrice.forEach((item) => {item.selected = false});
    setTimeout(()=>{
      item.selected = true;
    },10)
    se.loaddeparturedone = false;
    se.checkTourAllotment(item.date, false).then((check) => {
      se.loaddeparturedone = true;
      if (check) {
        let totalPrice = se.itemDepartureCalendar.TotalRate;
        se.zone.run(() => {
          se.tourService.checkInDate = moment(item.date).format("YYYY-MM-DD");
          se.tourService.cindisplay = moment(item.date).format("DD-MM-YYYY");

          se.totalPriceStr = se.gf.convertNumberToString(totalPrice);
          se.tourService.totalPrice = totalPrice;
          se.tourService.totalPriceStr = se.totalPriceStr;
          se.itemDepartureCalendar.AllotmentDateDisplay = moment(item.date).format('DD-MM-YYYY');
          let itemmap = se.tourService.departuresItemList.filter(i => i.DepartureDate == moment(item.date).format('YYYY-MM-DD'));
          if (itemmap && itemmap.length > 0) {
            se.tourService.itemDepartureCalendar = itemmap[0];
            se.tourService.hasDeparture = true;
            se.tourService.DepartureDate = itemmap[0].DepartureDate;

            se.tourService.itemDepartureCalendar.PriceChildAvg = se.itemDepartureCalendar.RateChildAvg;
            se.tourService.itemDepartureCalendar.RateChildAvg = se.itemDepartureCalendar.RateChildAvg;
            if (se.itemDepartureCalendar.RateChildAvg) {
              se.tourService.itemDepartureCalendar.PriceChildAvgStr = se.gf.convertNumberToString(se.itemDepartureCalendar.RateChildAvg.toFixed(0));
            }

            se.tourService.itemDepartureCalendar.TotalRate = se.itemDepartureCalendar.TotalRate;

          }
        })
      }
      else {
        se.itemDepartureCalendar.AllotmentDateDisplay = moment(item.date).format('DD-MM-YYYY');
        se.tourService.DepartureDate = moment(item.date).format('YYYY-MM-DD');
        se.tourService.itemDepartureCalendar.AllotmentDateDisplay = moment(item.date).format('DD-MM-YYYY');
        se.gf.showAlertMessageOnly(se.MsgError);

      }


    })
  }
}
