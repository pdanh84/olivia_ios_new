import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NavController, ModalController, ToastController, ActionSheetController, IonContent, AlertController, PickerController } from '@ionic/angular';
import { ActivityService, GlobalFunction } from '../../providers/globalfunction';
import * as $ from 'jquery';
import { C } from './../../providers/constants';
import { OverlayEventDetail } from '@ionic/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { ValueGlobal, SearchHotel } from '../../providers/book-service';
import {flightService} from './../../providers/flightService';

import { FlightsearchfilterPage } from 'src/app/flightsearchfilter/flightsearchfilter.page';
import { FlightchangeinfoPage } from 'src/app/flightchangeinfo/flightchangeinfo.page';
import { FlightdetailPage } from 'src/app/flightdetail/flightdetail.page';

@Component({
  selector: 'app-orderrequestsearchflight',
  templateUrl: './orderrequestsearchflight.page.html',
  styleUrls: ['./orderrequestsearchflight.page.scss'],
})
export class OrderRequestSearchFlightPage implements OnInit {
  @ViewChild('scrollArea') content: IonContent;
  loadpricedone = false;
  listDepart: any;
  listReturn: any;
  departfi: any[];
  returnfi: any[];
  title ="";
  subtitle = "";
  bestpricedepart: any[];
  otherpricedepart: any[];
  sortairline: boolean = true;
  column: any;
  step = 2;
  bestpricereturn: any[];
  otherpricereturn: any[];
  buttonVASelected: boolean;
  airlinename: boolean;
  arrFilterAirline: any=[];
  buttonVJSelected: boolean;
  buttonJSSelected: boolean;
  buttonBASelected: boolean;
  listdepartflightdisplay: any[];
  listreturnflightdisplay: any[];
  buttonMinPriceSelected: any;
  buttonMinTimeSelected: boolean;
  buttonMaxTimeSelected: boolean;
  buttonMinTimeDepartSelected: boolean;
  buttonMaxTimeDepartSelected: boolean;
  buttonMinTimeReturnSelected: boolean;
  buttonMaxTimeReturnSelected: boolean;
  titlereturn: any;
  subtitlereturn: any;
  count: number=0;
  stoprequest: boolean=false;
  listDepartConditions:any = [];
  listReturnConditions:any = [];
  enableFlightFilter:any;
  enableFlightFilterReturn:any;
  canselect = true;
  listDepartAirlines: any=[];
  listReturnAirlines: any=[];
  listDepartNoFilter: any=[];
  listReturnNoFilter: any=[];
  listDepartFilter: any;
  listReturnFilter: any;
  listDepartTimeRange: any=[];
  listDepartLandingTimeRange: any=[];
  listReturnTimeRange: any=[];
  listReturnLandingTimeRange: any=[];
  listDepartTicketClass: any=[];
  ecoTicketClassName ="Phổ thông";
  bussinessTicketClassName ="Thương gia";
  firstTicketClassName ="Hạng nhất";
  promoTicketClassName ="Tiết kiệm";
  flexTicketClassName ="Linh hoạt";
  listReturnTicketClass: any=[];
  listDepartStops:any=[];
  listReturnStops:any=[];
  departFlight: any;
  loadsk = [1,2,3];

  listDepartAirlinesReturn: any=[];
  listReturnAirlinesReturn: any=[];
  listDepartNoFilterReturn: any=[];
  listReturnNoFilterReturn: any=[];
  listDepartFilterReturn: any;
  listReturnFilterReturn: any;
  listDepartTimeRangeReturn: any=[];
  listDepartLandingTimeRangeReturn: any=[];
  listReturnTimeRangeReturn: any=[];
  listReturnLandingTimeRangeReturn: any=[];
  listDepartTicketClassReturn: any=[];
  listReturnTicketClassReturn: any=[];
  listDepartStopsReturn:any=[];
  listReturnStopsReturn:any=[];
  myCalendar: HTMLIonModalElement;
  progressbarloading = 0.5;
  progressbarbuffer = 0.75;
  intervalFlightTicket: any;
  intervalProgressbar: any;
  auth_token: any;
  jti: any = '';
  allowSearch: boolean=true;
  allowSearchReturn: boolean=true;
  buttoniVIVUSelected: boolean=true;
  textsort: string= "iVIVU đề xuất";
  showlowestprice: boolean = false;
  countdaydisplay: number = 0;
  checkInDisplayMonth: string;
  checkOutDisplayMonth: string;
  roundtriptext:string ="khứ hồi/khách";
  timedepartpriorityconfig: any;
  timereturnpriorityconfig: any;
  listDepartFacility:any = [];
  listReturnFacility:any = [];
  allowclickcalendar: boolean = true;
  
  VJSaverTicket = ['E1_Eco','A_Eco'];
  listReturnSeri:any = [];
  dayDisplay: any;
  dayReturnDisplay: any;
  trip: any;
  checkInDate: any;
  checkOutDate: any;

  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private zone: NgZone,
    public storage: Storage,
    private actionsheetCtrl: ActionSheetController,
    public valueGlobal: ValueGlobal,
    public searchhotel: SearchHotel,
    public _flightService: flightService,
    private alertCtrl: AlertController,
    public activityService: ActivityService) { 
      
      this.trip = this.activityService.objPaymentMytrip.trip;

      this.checkInDate = this._flightService.itemFlightCache.checkInDate;
                this.checkOutDate = this._flightService.itemFlightCache.checkOutDate;
                let objday:any = this.gf.getDayOfWeek(this.checkInDate);
                let objdayreturn:any = this.gf.getDayOfWeek(this.checkOutDate);
                this.title = (this._flightService.itemFlightCache.departCity || this.trip.itemdepart.flightFrom) +" → " + (this._flightService.itemFlightCache.returnCity ||this.trip.itemdepart.flightTo);
                this.subtitle = " · " + this.trip.itemdepart.numberOfPax + " khách";
                if(this.trip.itemreturn){
                  this.titlereturn =  (this._flightService.itemFlightCache.returnCity || this.trip.itemreturn.flightFrom) +" → " + (this._flightService.itemFlightCache.departCity || this.trip.itemreturn.flightTo);
                  this.subtitlereturn = " · " + this.trip.itemreturn.numberOfPax + " khách";
                }
              
                this.dayDisplay = objday.dayname + ", " +moment(this.checkInDate).format("DD") +  " thg " +moment(this.checkInDate).format("M");
                this.dayReturnDisplay = objdayreturn.dayname + ", " + moment(this.checkOutDate).format("DD") + " thg " +moment(this.checkOutDate).format("M");
                this.trip.dayDisplay = this.dayDisplay;
                this.trip.dayReturnDisplay = this.dayReturnDisplay;
                this.checkInDate = this._flightService.itemFlightCache.checkInDate || this.trip.checkInDate;
                this.checkOutDate = this._flightService.itemFlightCache.checkOutDate || this.trip.checkOutDate;

      this.storage.get('jti').then(jti => {
        if (jti) {
          this.jti = jti;
        }
      })


      
      this.loadFlightData(false)
    
   
      //this.loadmultidata()
      
    }

  ngOnInit() {
    this.zone.run(()=>{
        this.stoprequest = false;
      setTimeout(()=>{
        this.stoprequest = true;
        this.loadpricedone = true;
      }, 50 * 1000);
    })
    
    this._flightService.getOrderRequestSearchFlightFilter().subscribe((data) => {
        if(data == 1){
          this.zone.run(()=>{
            this.enableFlightFilter = 1;
          })
        }else if(data == 0){
          this.zone.run(()=>{
            this.enableFlightFilter = 0;
          })
        }
        else if(data == 2){
          this.zone.run(()=>{
            this.enableFlightFilterReturn = 1;
          })
        }
        else if(data == 3){
          this.zone.run(()=>{
            this.enableFlightFilterReturn = 0;
          })
        }
    })

    // this._flightService.itemFlightFilterChangeReturn.pipe().subscribe((data) => {
    //   if(data){
    //     this.zone.run(()=>{
    //       this.enableFlightFilterReturn = 1;
    //     })
    //   }else{
    //     this.zone.run(()=>{
    //       this.enableFlightFilterReturn = 0;
    //     })
    //   }
    // })

    this._flightService.itemChangeTicketFlight.pipe().subscribe((data) => {
      if(data){
        let obj= this._flightService.objSearch;
        this.step = this._flightService.itemFlightCache.step;
        this.zone.run(()=>{
          this.resetValue();
          this.clearMinMaxPriceFilter();
        })
        this.loadFlightData(false);
      }
    })


  }

  goback(){
    this.stoprequest = true;
    if(this.step ==3 && this.activityService.typeChangeFlight == 3){
      this.zone.run(()=>{
        this.step = 2;
        this._flightService.itemFlightCache.step = 2;
        this._flightService.itemFlightCache.departFlight = null;
        this._flightService.itemFlightCache.returnFlight = null;
        this._flightService.orderRequestDepartFlight = null;
        this._flightService.orderRequestReturnFlight = null;
        this._flightService.itemFlightCache.objSearch = {};
        this._flightService.itemFlightCache = {};
        if(this._flightService.objectFilter){
          this.filterItem();
        }
        this.listReturnSeri = [];
      })
    }else{
      
      this.navCtrl.navigateBack('/orderrequestchangeflight');
    }
    
  }
  checkRoundTripInDay(item) : Promise<any>{
    var se = this, res = false;
     return new Promise((resolve, reject) => {
       let departTime = moment(se._flightService.itemFlightCache.departFlight.landingTime);
       let departTimeReturn = moment(item.departTime);
       //Giờ cất cánh chuyến về phải lớn hơn giờ cất cánh chuyến đi ít nhất 3h
        if(se._flightService.itemFlightCache.departFlight && item && departTimeReturn.diff(departTime, 'minutes') < 180 ){
            resolve(true);
        }
        resolve(false);
     })
  }

  async showAlert(msg){
    var se = this;
    let alert = await this.alertCtrl.create({
      message: msg,
      cssClass: "cls-alert-searchresult",
      backdropDismiss: false,
      buttons: [
      {
        text: 'OK',
        role: 'OK',
        handler: () => {
          alert.dismiss();
        }
      }
    ]
  });
  alert.present();
  }

  select(type,item){
    var se = this;
    if(!item.allowChange){
      se.gf.showToastWarning('Vé chưa được kiểm tra giá chênh lệch hoặc chưa hỗ trợ đổi vé. Xin quý khách vui lòng thử lại!');
      return;
    }
    if(!se.checkChangeFlightPrice(item, type)){
      se.gf.showToastWarning('Quý khách vui lòng chọn hạng vé cao hơn vé hiện tại.');
      return;
    }
    if(type ==1 ){
      
      item.departTimeDisplayFull = se._flightService.itemFlightCache.checkInDisplay;
      se.choiceTicket(1, item);
      //se._flightService.itemFlightCache.departFlight = item; 
      se.departFlight = item;
      //se.departFlight.timeDisplay = se.departFlight.timeDisplay.replace('-', '→');
      if(se.activityService.typeChangeFlight == 3){
        se._flightService.itemFlightCache.step = 3;
        se.trip.roundTrip = true;
       
        se.zone.run(()=>{
          se.step = 3;
          se.content.scrollToTop(300);
        })
       
      }else{
          se.choiceTicket(1, item);
          se.trip.roundTrip = false;
          se.navCtrl.navigateForward('/orderrequestchangeflightpaymentselect');
      }
    }else{
      
      //Nếu đi và về cùng ngày thì check thêm dk giờ về phải lớn hơn giờ đi 3h
      if(se.activityService.typeChangeFlight == 3)
      {
          se.choiceTicket(2, item);
          se.trip.roundTrip = true;
          se.navCtrl.navigateForward('/orderrequestchangeflightpaymentselect');
      }else{
          se.choiceTicket(2, item);
          se.trip.roundTrip = true;
          se.navCtrl.navigateForward('/orderrequestchangeflightpaymentselect');
      }
      
    }
    
  }

  filterSeriItem(itemseri){
    var se = this;
    let listFilter = [...se.listReturn];
    let filterSeri = listFilter.filter((filterSeriItem) => {
        return filterSeriItem.id && filterSeriItem.id.indexOf('__seri') != -1 && filterSeriItem.availId == itemseri.availId;
      })
      listFilter = [...filterSeri];
      return listFilter;
  }
  filterOutBoundItem(itemOutBound){
    var se = this;
    let listFilter = [...se.listReturn];
    let filterSeri = listFilter.filter((filterSeriItem) => {
        return filterSeriItem.airlineCode == itemOutBound.airlineCode;
      })
      listFilter = [...filterSeri];
      return listFilter;
  }
  filterNotSeriItem(){
    var se = this;
    let listFilter = [...se.listReturn];
    let filterSeri = listFilter.filter((filterSeriItem) => {
        return filterSeriItem.id && filterSeriItem.id.indexOf('__seri') == -1;
      })
      se.zone.run(()=> {
        listFilter = [...filterSeri];
      })
      
      return listFilter;
  }
  /**
   * Trả về true nếu ko chọn seri cả chiều đi, chiều về hoặc có chọn seri chiều đi và vé seri chiều đi & chiều về cùng cặp
   * Ngược lại trả về false
   * @returns 
   */
  checkMapSeriFlight(){
    var se = this, res = true;
    if(se._flightService.itemFlightCache.departFlight && se._flightService.itemFlightCache.returnFlight){
      res = (se._flightService.itemFlightCache.departFlight.id.indexOf('__seri') == -1 && se._flightService.itemFlightCache.returnFlight.id.indexOf('__seri') == -1)
      || (se._flightService.itemFlightCache.departFlight.id.indexOf('__seri') != -1 && se._flightService.itemFlightCache.returnFlight.id.indexOf('__seri') != -1 
      && se._flightService.itemFlightCache.departFlight.availId == se._flightService.itemFlightCache.returnFlight.availId)
    }
    return res;
  }

  choiceTicket(type, item){
    var se = this;
    se.gf.showLoading();
    
      if(type ==1){
        se._flightService.orderRequestDepartFlight = item;
        se._flightService.itemFlightCache.step = 3;
      }else if(type ==2){
        se._flightService.orderRequestReturnFlight = item;
      }
      
      se.canselect = true;
      se.gf.hideLoading();

      
  }

  clearMinMaxPriceFilter(){
    if(this._flightService.objectFilter){
      this._flightService.objectFilter.minprice = 0;
      this._flightService.objectFilter.maxprice = 15000000;
      this._flightService.objectFilterReturn.minpriceReturn = 0;
      this._flightService.objectFilterReturn.maxpriceReturn = 15000000;
    }
    
  }


  clearFilter(){
    this._flightService.objectFilter = {};
    this._flightService.objectFilter.departTimeRange = [];
    this._flightService.objectFilter.returnTimeRange = [];
    this._flightService.objectFilter.airlineSelected = [];
    this._flightService.objectFilter.classSelected = [];
    this._flightService.objectFilter.stopSelected = [];
    this._flightService.objectFilter.facilitySelected = [];
    this._flightService.objectFilter.minprice = 0;
    this._flightService.objectFilter.maxprice = 15000000;

    this._flightService.objectFilterReturn = {};
    this._flightService.objectFilterReturn.departTimeRangeReturn = [];
    this._flightService.objectFilterReturn.returnTimeRangeReturn = [];
    this._flightService.objectFilterReturn.airlineSelectedReturn = [];
    this._flightService.objectFilterReturn.classSelectedReturn = [];
    this._flightService.objectFilterReturn.stopSelectedReturn = [];
    this._flightService.objectFilterReturn.facilitySelectedReturn = [];
    this._flightService.objectFilterReturn.minpriceReturn = 0;
    this._flightService.objectFilterReturn.maxpriceReturn = 15000000;
  }

  clearSearchFilter(){
    this._flightService.objectFilter = {};
    this._flightService.objectFilter.departTimeRange = [];
    this._flightService.objectFilter.returnTimeRange = [];
    this._flightService.objectFilter.airlineSelected = [];
    this._flightService.objectFilter.classSelected = [];
    this._flightService.objectFilter.stopSelected = [];
    this._flightService.objectFilter.facilitySelected = [];
    this._flightService.objectFilter.minprice = 0;
    this._flightService.objectFilter.maxprice = 15000000;

    this._flightService.objectFilterReturn = {};
    this._flightService.objectFilterReturn.departTimeRangeReturn = [];
    this._flightService.objectFilterReturn.returnTimeRangeReturn = [];
    this._flightService.objectFilterReturn.airlineSelectedReturn = [];
    this._flightService.objectFilterReturn.classSelectedReturn = [];
    this._flightService.objectFilterReturn.stopSelectedReturn = [];
    this._flightService.objectFilterReturn.facilitySelectedReturn = [];
    this._flightService.objectFilterReturn.minpriceReturn = 0;
    this._flightService.objectFilterReturn.maxpriceReturn = 15000000;

    if(this.step == 2){
      let listdepart = this._flightService.listAllFlightDepart;
      this.bestpricedepart = [...listdepart].splice(0,3);
      this.otherpricedepart = [...listdepart].splice(3,listdepart.length);
      if(this.enableFlightFilter){
        this.listDepartFilter = [...listdepart];
      }
      this._flightService.itemFlightFilterChange.emit(0);
    }else{
      let listreturn = this._flightService.listAllFlightReturn;
      this.bestpricereturn = [...listreturn].splice(0,3);
      this.otherpricereturn = [...listreturn].splice(3,listreturn.length);
      if(this.enableFlightFilterReturn){
        this.listReturnFilter = [...listreturn];
      }
      this._flightService.itemFlightFilterChangeReturn.emit(0);
      
    }
    if(this.sortairline && !this.buttoniVIVUSelected){
      this.excuteSort();
    }
    this.storage.remove('flightfilterobject');
  }


  loadConditions(conditions, type){
    var se = this;
    
    if(type == 'depart'){
        if(se.listDepartConditions && se.listDepartConditions.length >0){
            se.listDepartConditions = [...se.listDepartConditions,...conditions];
        }else{
          se.listDepartConditions = [...conditions];
        }
    }else{
      if(se.listReturnConditions && se.listReturnConditions.length >0){
        se.listReturnConditions = [...se.listReturnConditions,...conditions];
      }else{
        se.listReturnConditions = [...conditions];
      }
    }
  }
  

  loadFlightData(ischangeinfo){
    var se = this;
   
    setTimeout(() => {
      se.zone.run(()=>{
          se.progressbarloading += 0.05;
          se.progressbarbuffer += 0.05;
      })
      
    }, 500);

    se.intervalProgressbar = setInterval(() => {
      se.zone.run(()=>{
        se.progressbarloading += 0.02;
        se.progressbarbuffer += 0.02;
      })
    }, 1000)

    let header = {
      "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
      'Content-Type': 'application/json; charset=utf-8'
    };
    let url = '';
    if(this.activityService.typeChangeFlight == 1){
      this.step=2;
      //this.
        url = C.urls.baseUrl.urlFlight + `gate/apiv1/UpdateJourneysVJ?pnrCode=${this.trip.itemdepart.ticketCode}&secureKey=3b760e5dcf038878925b5613c32651dus&segment=1&flightDate=${moment(this.checkInDate).format('YYYY-MM-DD')}&flightNumber=${this.trip.itemdepart.flightNumner}&ticketClass=${this.trip.itemdepart.ticketClass}&funAction=search&fromCode=${this.trip.itemdepart.departCode}&toCode=${this.trip.itemdepart.arrivalCode}`;
        this.gf.RequestApi('GET', url, header, {}, 'orderrequestchangeflight', 'clickChangeFlight').then((data)=> {
          if(!data.error && data != 'no data'){
            this.loadmultidata(data.data, 'depart');
          }else{
            this.listDepart = [];
            this.loadpricedone = true;
          }
            
            
        })
    }else if(this.activityService.typeChangeFlight == 2){
      this.departFlight = null;
      this.step=3;
        url = C.urls.baseUrl.urlFlight + `gate/apiv1/UpdateJourneysVJ?pnrCode=${this.trip.itemreturn.ticketCode}&secureKey=3b760e5dcf038878925b5613c32651dus&segment=2&flightDate=${moment(this.checkOutDate).format('YYYY-MM-DD')}&flightNumber=${this.trip.itemreturn.flightNumner}&ticketClass=${this.trip.itemreturn.ticketClass}&funAction=search&fromCode=${this.trip.itemreturn.departCode}&toCode=${this.trip.itemreturn.arrivalCode}`;
        this.gf.RequestApi('GET', url, header, {}, 'orderrequestchangeflight', 'clickChangeFlight').then((data)=> {
          if(!data.error&& data != 'no data'){
            this.loadmultidata(data.data, 'return');
          }else{
            this.listReturn = [];
            this.loadpricedone = true;
          }
        })
    }else {
      this.step=2;
      url = C.urls.baseUrl.urlFlight + `gate/apiv1/UpdateJourneysVJ?pnrCode=${this.trip.itemdepart.ticketCode}&secureKey=3b760e5dcf038878925b5613c32651dus&segment=1&flightDate=${moment(this.checkInDate).format('YYYY-MM-DD')}&flightNumber=${this.trip.itemdepart.flightNumner}&ticketClass=${this.trip.itemdepart.ticketClass}&funAction=search&fromCode=${this.trip.itemdepart.departCode}&toCode=${this.trip.itemdepart.arrivalCode}`;
      this.gf.RequestApi('GET', url, header, {}, 'orderrequestchangeflight', 'clickChangeFlight').then((data)=> {
        if(!data.error&& data != 'no data'){
          this.loadmultidata(data.data, 'depart');
        }else{
          this.listDepart = [];
          this.loadpricedone = true;
        }
          
      });

      let url1 = C.urls.baseUrl.urlFlight + `gate/apiv1/UpdateJourneysVJ?pnrCode=${this.trip.itemreturn.ticketCode}&secureKey=3b760e5dcf038878925b5613c32651dus&segment=2&flightDate=${moment(this.checkOutDate).format('YYYY-MM-DD')}&flightNumber=${this.trip.itemreturn.flightNumner}&ticketClass=${this.trip.itemreturn.ticketClass}&funAction=search&fromCode=${this.trip.itemreturn.departCode}&toCode=${this.trip.itemreturn.arrivalCode}`;
      this.gf.RequestApi('GET', url1, header, {}, 'orderrequestchangeflight', 'clickChangeFlight').then((data)=> {
        if(!data.error){
          this.loadmultidata(data.data, 'return');
        }else{
          this.listReturn = [];
          this.loadpricedone = true;
        }
      })
    }
    
  }

  loadmultidata(data, type){
    var se = this;
    let jsondata = data;
    //se.loadpricedone = true;
    se.zone.run(() => {
      se.count++;
      if(type == 'depart'){
          if(!se.listDepart || (se.listDepart && se.listDepart.length == 0) ){
            se.listDepart = jsondata;
            //se.listDepartNoFilter = jsondata;
          }
          else{
            if(se.listDepart && se.listDepart.length >0){
              se.listDepart = [...se.listDepart,...jsondata];
              //se.listDepartNoFilter = [...se.listDepart,...jsondata];
            }
          }
      }

      if(type == 'return'){
        if(!se.listReturn || ( se.listReturn && se.listReturn.length == 0) ){
          se.listReturn = jsondata;
          //se.listReturnNoFilter = jsondata;
        }
        else{
          if(se.listReturn && se.listReturn.length >0){
            se.listReturn = [...se.listReturn,...jsondata];
            //se.listReturnNoFilter = [...se.listReturn,...jsondata];
          }
        }
    }
  

      if(se.listDepart && se.listDepart.length >0){
        se.listDepart.forEach(element => {
          let priceFlightAdult = 0;
          let priceFlightChild = 0;
          let priceFlightInfant = 0;
          
          element.timeDisplay = moment(element.departTime).format("HH:mm") + " → " + moment(element.landingTime).format("HH:mm");
          let hours:any = Math.floor(element.flightDuration/60);
          let minutes:any = element.flightDuration*1 - (hours*60);
          if(hours < 10){
            hours = hours != 0?  "0"+hours : "0";
          }
          if(minutes < 10){
            minutes = "0"+minutes;
          }
          element.departTimeDisplay = moment(element.departTime).format("HH:mm");
          element.landingTimeDisplay = moment(element.landingTime).format("HH:mm");
          element.flightTimeDisplay = hours+"h"+minutes;
          element.flightTimeDetailDisplay = hours+"h"+minutes+"m";
          if(element.details[0].from.length > 3){
            element.from = element.details[0].from.split(',')[1].trim();
          }else{
            element.from = element.details[0].from;
          }
          if(element.details[0].to.length > 3){
            element.to = element.details[0].to.split(',')[1].trim();
          }else{
            element.to = element.details[0].to;
          }

          if(element.details[0] && element.details[0].ticketType){
            element.ticketTypeSearch = element.details[0].ticketType;
          }
         

          element.priceSummaries.forEach(e => {
            if (e.passengerType == 0) {
              priceFlightAdult += e.price;
            }
            if (e.passengerType == 1) {
              priceFlightChild += e.price;
            }
            if (e.passengerType == 2) {
              priceFlightInfant += e.price;
            }
          });
          //check hãng bay trong list
          element.priceorder = element.priceAvg;
          if(element.airlineCode.indexOf("VietnamAirlines") != -1){
            //element.priceorder = element.totalPrice * 0.75;
              if(se.listDepartAirlines.length ==0 || !se.gf.checkExistsItemInArray(se.listDepartAirlines, "VietnamAirlines","filtername")){
                se.listDepartAirlines.push("VietnamAirlines");
              }
          }else if(element.airlineCode.indexOf("BambooAirways") != -1 ){
            //element.priceorder = element.totalPrice * 0.8;
              if(se.listDepartAirlines.length ==0 || !se.gf.checkExistsItemInArray(se.listDepartAirlines, "BambooAirways","filtername")){
                se.listDepartAirlines.push("BambooAirways");
              }
          }
          else if(element.airlineCode.indexOf("VietJetAir") != -1 ){
            //element.priceorder = element.totalPrice;
            if(se.listDepartAirlines.length ==0 || !se.gf.checkExistsItemInArray(se.listDepartAirlines, "VietJetAir","filtername")){
              se.listDepartAirlines.push("VietJetAir");
            }
          }
          else if(element.airlineCode.indexOf("JetStar") != -1 ){
            //element.priceorder = element.totalPrice;
            if(se.listDepartAirlines.length ==0 || !se.gf.checkExistsItemInArray(se.listDepartAirlines, "JetStar","filtername")){
                  se.listDepartAirlines.push("JetStar");
                }
            }
            //check khoảng thời gian cất cánh
            let time = moment(element.departTime).format("HH:mm:ss");
            let timerange = time ? se.gf.convertStringToNumber(time) : -1;
           
                if(timerange >= 0 && timerange <= 60000 && se.listDepartTimeRange.indexOf(1) == -1){
                  se.listDepartTimeRange.push(1);
                }
                else if(timerange >= 60000 && timerange <= 120000 && se.listDepartTimeRange.indexOf(2) == -1){
                  se.listDepartTimeRange.push(2);
                }
                else if(timerange >= 120000 && timerange <= 180000 && se.listDepartTimeRange.indexOf(3) == -1){
                  se.listDepartTimeRange.push(3);
                }
                else if(timerange >= 180000 && timerange <= 240000 && se.listDepartTimeRange.indexOf(4) == -1){
                  se.listDepartTimeRange.push(4);
                }

                let timeReturn = moment(element.landingTime).format("HH:mm:ss");
                let timeRangeReturn = time ? se.gf.convertStringToNumber(timeReturn) : -1;
                if(timeRangeReturn >= 0 && timeRangeReturn <= 60000 && se.listDepartLandingTimeRange.indexOf(1) == -1){
                  se.listDepartLandingTimeRange.push(1);
                }
                else if(timeRangeReturn >= 60000 && timeRangeReturn <= 120000 && se.listDepartLandingTimeRange.indexOf(2) == -1){
                  se.listDepartLandingTimeRange.push(2);
                }
                else if(timeRangeReturn >= 120000 && timeRangeReturn <= 180000 && se.listDepartLandingTimeRange.indexOf(3) == -1){
                  se.listDepartLandingTimeRange.push(3);
                }
                else if(timeRangeReturn >= 180000 && timeRangeReturn <= 240000 && se.listDepartLandingTimeRange.indexOf(4) == -1){
                  se.listDepartLandingTimeRange.push(4);
                }
                //check hạng vé
                // if(element.ticketClass == se.ecoTicketClassName && se.listDepartTicketClass.indexOf(1) == -1){
                //   se.listDepartTicketClass.push(1);
                // }
                // else if(element.ticketClass == se.bussinessTicketClassName && se.listDepartTicketClass.indexOf(2) == -1){
                //   se.listDepartTicketClass.push(2);
                // }
                // else if(element.ticketClass == se.flexTicketClassName && se.listDepartTicketClass.indexOf(3) == -1){
                //   se.listDepartTicketClass.push(3);
                // }
                // else if(element.ticketClass == se.promoTicketClassName && se.listDepartTicketClass.indexOf(4) == -1){
                //   se.listDepartTicketClass.push(4);
                // }
                if( ( (element.ticketClass == se.ecoTicketClassName  && element.airlineCode != 'VietJetAir') || (element.airlineCode == 'VietJetAir' && element.ticketType == "Eco" && se.VJSaverTicket.indexOf(element.details[0].ticketType) == -1 ) ) && se.listDepartTicketClass.indexOf(1) == -1){
                  se.listDepartTicketClass.push(1);
                }
                else if(element.ticketClass == se.bussinessTicketClassName && se.listDepartTicketClass.indexOf(2) == -1){
                  se.listDepartTicketClass.push(2);
                }
                else if(( (element.ticketClass == se.flexTicketClassName && element.airlineCode != 'VietJetAir') || (element.airlineCode != 'VietJetAir' && element.ticketType == se.flexTicketClassName && se.VJSaverTicket.indexOf(element.details[0].ticketType) == -1) ) && se.listDepartTicketClass.indexOf(3) == -1){
                  se.listDepartTicketClass.push(3);
                }
                else if((element.ticketClass == se.promoTicketClassName || (element.airlineCode== 'VietJetAir' && element.ticketType == "Eco" && se.VJSaverTicket.indexOf(element.details[0].ticketType) != -1) ) && se.listDepartTicketClass.indexOf(4) == -1){
                  se.listDepartTicketClass.push(4);
                }
                //check điểm dừng
                if(element.stops == 0 && se.listDepartStops.indexOf(1) == -1){
                  se.listDepartStops.push(1);
                }
                else if(element.stops == 1 && se.listDepartStops.indexOf(2) == -1){
                  se.listDepartStops.push(2);
                }
                else if(element.stops == 2 && se.listDepartStops.indexOf(3) == -1){
                  se.listDepartStops.push(3);
                }
                else if(element.stops == 3 && se.listDepartStops.indexOf(4) == -1){
                  se.listDepartStops.push(4);
                }
          
                //check tiện ích
                if(element.ticketCondition && element.ticketCondition.isTicketRefund && se.listDepartFacility.indexOf(1) == -1){
                  se.listDepartFacility.push(1);
                }
                else if(element.promotions && element.promotions.length >0 && se.listDepartFacility.indexOf(2) == -1){
                  se.listDepartFacility.push(2);
                }
                else if(element.ticketCondition &&  element.ticketCondition.luggageSigned && se.listDepartFacility.indexOf(3) == -1 ){
                  se.listDepartFacility.push(3);
                }
                else if(element.ticketCondition && element.ticketCondition.priorityCI && se.listDepartFacility.indexOf(4) == -1){
                  se.listDepartFacility.push(4);
                }
          
          
          element.priceAdult = priceFlightAdult;
          element.priceChild = priceFlightChild;
          element.priceInfant = priceFlightInfant;

          element.priceDisplay = element.totalPrice ? se.gf.convertNumberToString(element.totalPrice)+ " đ" : '';
          if(!element.priceBeforeDiscount && element.totalDiscount){
            element.priceBeforeDiscount = element.totalPrice + element.totalDiscount;
            element.priceBeforeDiscount = se.gf.convertNumberToString(element.priceBeforeDiscount);
          }

          let ar_time = element.departTime.toString().split('T')[1];
          let Hour = ar_time.toString().split(':')[0];
          let Minute = ar_time.toString().split(':')[1];
          let kq = Hour * 60 + Number(Minute);
          element.rangeTime = kq;

          if(element.operatedBy && element.urlLogo.indexOf('images/brands/w100') ==-1 ){
            element.urlLogo = "https://res.ivivu.com/flight/inbound/images/brands/w100/" +element.urlLogo;
          }
        });

            se._flightService.itemFlightCache.listDepartAirlines = se.listDepartAirlines;
            se._flightService.itemFlightCache.listDepartTimeRange = se.listDepartTimeRange;
            se._flightService.itemFlightCache.listDepartLandingTimeRange = se.listDepartLandingTimeRange;
            se._flightService.itemFlightCache.listDepartTicketClass = se.listDepartTicketClass;
            se._flightService.itemFlightCache.listDepartStops = se.listDepartStops;
            se._flightService.itemFlightCache.listDepartFacility = se.listDepartFacility;
            
          se.sortFlights('priceorder', se.listDepart);
          //se.checkvalueDepart(se.listDepart);
     
      }
      
      if(se.listReturn && se.listReturn.length >0){
        se.listReturn.forEach(element => {

          element.timeDisplay = moment(element.departTime).format("HH:mm") + " - " + moment(element.landingTime).format("HH:mm");
          let hours:any = Math.floor(element.flightDuration/60);
          let minutes:any = element.flightDuration*1 - (hours*60);
          if(hours < 10){
            hours = hours != 0?  "0"+hours : "0";
          }
          if(minutes < 10){
            minutes = "0"+minutes;
          }

          element.departTimeDisplay = moment(element.departTime).format("HH:mm");
          element.landingTimeDisplay = moment(element.landingTime).format("HH:mm");
          element.flightTimeDisplay = hours+"h"+minutes;
          element.flightTimeDetailDisplay = hours+"h"+minutes+"m";
          if(element.details[0].from.length > 3){
            element.from = element.details[0].from.split(',')[1].trim();
          }else{
            element.from = element.details[0].from;
          }

          if(element.details[0].to.length > 3){
            element.to = element.details[0].to.split(',')[1].trim();
          }else{
            element.to = element.details[0].to;
          }

          if(element.details[0] && element.details[0].ticketType){
            element.ticketTypeSearch = element.details[0].ticketType;
          }
         
          let priceFlightAdult = 0;
          let priceFlightChild = 0;
          let priceFlightInfant = 0;

          element.priceSummaries.forEach(e => {
            if (e.passengerType == 0) {
              priceFlightAdult += e.price;
            }
            if (e.passengerType == 1) {
              priceFlightChild += e.price;
            }
            if (e.passengerType == 2) {
              priceFlightInfant += e.price;
            }
          });
          //25/12/2020: Sửa lại lấy đúng giá giảm (sau khi trừ giá bán default)
          element.priceorder = element.priceAvg;
          if(element.airlineCode.indexOf("VietnamAirlines") != -1){
            //element.priceorder = element.totalPrice * 0.75;
            if(se.listReturnAirlinesReturn.length ==0 || !se.gf.checkExistsItemInArray(se.listReturnAirlinesReturn, "VietnamAirlines","filtername")){
              se.listReturnAirlinesReturn.push("VietnamAirlines");
            }
          }else if(element.airlineCode.indexOf("BambooAirways") != -1 ){
            //element.priceorder = element.totalPrice * 0.8;
            if(se.listReturnAirlinesReturn.length ==0 || !se.gf.checkExistsItemInArray(se.listReturnAirlinesReturn, "BambooAirways","filtername")){
              se.listReturnAirlinesReturn.push("BambooAirways");
            }
          }
          else if(element.airlineCode.indexOf("VietJetAir") != -1 ){
            //element.priceorder = element.totalPrice;
            if(se.listReturnAirlinesReturn.length ==0 || !se.gf.checkExistsItemInArray(se.listReturnAirlinesReturn, "VietJetAir","filtername")){
                  se.listReturnAirlinesReturn.push("VietJetAir");
              }
          }
          else if(element.airlineCode.indexOf("JetStar") != -1 ){
            //element.priceorder = element.totalPrice;
            if(se.listReturnAirlinesReturn.length ==0 || !se.gf.checkExistsItemInArray(se.listReturnAirlinesReturn, "JetStar","filtername")){
                se.listReturnAirlinesReturn.push("JetStar");
            }
          }

         //check khoảng thời gian cất cánh
         let time = moment(element.departTime).format("HH:mm:ss");
         let timerange = time ? se.gf.convertStringToNumber(time) : -1;

        if(timerange >= 0 && timerange <= 60000 && se.listReturnTimeRangeReturn.indexOf(1) == -1){
          se.listReturnTimeRangeReturn.push(1);
        }
        else if(timerange >= 60000 && timerange <= 120000 && se.listReturnTimeRangeReturn.indexOf(2) == -1){
          se.listReturnTimeRangeReturn.push(2);
        }
        else if(timerange >= 120000 && timerange <= 180000 && se.listReturnTimeRangeReturn.indexOf(3) == -1){
          se.listReturnTimeRangeReturn.push(3);
        }
        else if(timerange >= 180000 && timerange <= 240000 && se.listReturnTimeRangeReturn.indexOf(4) == -1){
          se.listReturnTimeRangeReturn.push(4);
        }

        let timeReturn = moment(element.landingTime).format("HH:mm:ss");
        let timeRangeReturn = time ? se.gf.convertStringToNumber(timeReturn) : -1;
        if(timeRangeReturn >= 0 && timeRangeReturn <= 60000 && se.listReturnLandingTimeRangeReturn.indexOf(1) == -1){
          se.listReturnLandingTimeRangeReturn.push(1);
        }
        else if(timeRangeReturn >= 60000 && timeRangeReturn <= 120000 && se.listReturnLandingTimeRangeReturn.indexOf(2) == -1){
          se.listReturnLandingTimeRangeReturn.push(2);
        }
        else if(timeRangeReturn >= 120000 && timeRangeReturn <= 180000 && se.listReturnLandingTimeRangeReturn.indexOf(3) == -1){
          se.listReturnLandingTimeRangeReturn.push(3);
        }
        else if(timeRangeReturn >= 180000 && timeRangeReturn <= 240000 && se.listReturnLandingTimeRangeReturn.indexOf(4) == -1){
          se.listReturnLandingTimeRangeReturn.push(4);
        }
        //check hạng vé
        // if(element.ticketClass == se.ecoTicketClassName && se.listReturnTicketClassReturn.indexOf(1) == -1){
        //   se.listReturnTicketClassReturn.push(1);
        // }
        // else if(element.ticketClass == se.bussinessTicketClassName && se.listReturnTicketClassReturn.indexOf(2) == -1){
        //   se.listReturnTicketClassReturn.push(2);
        // }
        // else if(element.ticketClass == se.flexTicketClassName && se.listReturnTicketClassReturn.indexOf(3) == -1){
        //   se.listReturnTicketClassReturn.push(3);
        // }
        // else if(element.ticketClass == se.promoTicketClassName && se.listReturnTicketClassReturn.indexOf(3) == -1){
        //   se.listReturnTicketClassReturn.push(4);
        // }
        if(( (element.ticketClass == se.ecoTicketClassName  && element.airlineCode != 'VietJetAir') || (element.airlineCode == 'VietJetAir' && element.ticketType == "Eco" && se.VJSaverTicket.indexOf(element.details[0].ticketType) == -1 ) ) && se.listReturnTicketClassReturn.indexOf(1) == -1){
          se.listReturnTicketClassReturn.push(1);
        }
        else if(element.ticketClass == se.bussinessTicketClassName && se.listReturnTicketClassReturn.indexOf(2) == -1){
          se.listReturnTicketClassReturn.push(2);
        }
        else if(( (element.ticketClass == se.flexTicketClassName && element.airlineCode != 'VietJetAir') || (element.airlineCode != 'VietJetAir' && element.ticketClass == se.flexTicketClassName && se.VJSaverTicket.indexOf(element.details[0].ticketType) == -1) ) && se.listReturnTicketClassReturn.indexOf(3) == -1){
          se.listReturnTicketClassReturn.push(3);
        }
        else if( element.ticketClass == se.promoTicketClassName || (element.airlineCode== 'VietJetAir' && element.ticketType == "Eco" && se.VJSaverTicket.indexOf(element.details[0].ticketType) != -1) && se.listReturnTicketClassReturn.indexOf(4) == -1 ){
          se.listReturnTicketClassReturn.push(4);
        }
        //check điểm dừng
        if(element.stops == 0 && se.listReturnStopsReturn.indexOf(1) == -1){
          se.listReturnStopsReturn.push(1);
        }
        else if(element.stops == 1 && se.listReturnStopsReturn.indexOf(2) == -1){
          se.listReturnStopsReturn.push(2);
        }
        else if(element.stops == 2 && se.listReturnStopsReturn.indexOf(3) == -1){
          se.listReturnStopsReturn.push(3);
        }
        else if(element.stops == 3 && se.listReturnStopsReturn.indexOf(4) == -1){
          se.listReturnStopsReturn.push(4);
        }

        //check tiện ích
        if(element.ticketCondition && element.ticketCondition.isTicketRefund && se.listReturnFacility.indexOf(1) == -1){
          se.listReturnFacility.push(1);
        }
        else if(element.promotions && element.promotions.length >0 && se.listReturnFacility.indexOf(2) == -1){
          se.listReturnFacility.push(2);
        }
        else if(element.ticketCondition && element.ticketCondition.luggageSigned && se.listReturnFacility.indexOf(3) == -1 ){
          se.listReturnFacility.push(3);
        }
        else if(element.ticketCondition && element.ticketCondition.priorityCI && se.listReturnFacility.indexOf(4) == -1){
          se.listReturnFacility.push(4);
        }
            
          element.priceAdult = priceFlightAdult;
          element.priceChild = priceFlightChild;
          element.priceInfant = priceFlightInfant;

          element.priceDisplay = element.totalPrice ? se.gf.convertNumberToString(element.totalPrice)+ " đ" : '';
          if(!element.priceBeforeDiscount && element.totalDiscount){
            element.priceBeforeDiscount = element.totalPrice + element.totalDiscount;
            element.priceBeforeDiscount = se.gf.convertNumberToString(element.priceBeforeDiscount);
          }

          let ar_time = element.departTime.toString().split('T')[1];
          let Hour = ar_time.toString().split(':')[0];
          let Minute = ar_time.toString().split(':')[1];
          let kq = Hour * 60 + Number(Minute);
          element.rangeTimeReturn = kq;

          if(element.operatedBy && element.urlLogo.indexOf('content/img') ==-1 ){
            element.urlLogo = "https://www.ivivu.com/ve-may-bay/content/img/brands/w100/" +element.urlLogo;
          }
        });
        
          se._flightService.itemFlightCache.listReturnAirlinesReturn = se.listReturnAirlinesReturn;
          se._flightService.itemFlightCache.listReturnTimeRangeReturn = se.listReturnTimeRangeReturn;
          se._flightService.itemFlightCache.listReturnLandingTimeRangeReturn = se.listReturnLandingTimeRangeReturn;
          se._flightService.itemFlightCache.listReturnTicketClassReturn = se.listReturnTicketClassReturn;
          se._flightService.itemFlightCache.listReturnStopsReturn = se.listReturnStopsReturn;
          se._flightService.itemFlightCache.listReturnFacility = se.listReturnFacility;
          
          se.sortFlights('priceorder', se.listReturn);
          //se.checkReturnList(se.listReturn);
        
      }
      //console.log(se.listDepart);
      if(se.listDepart && se.listDepart.length >0){
        se.listDepartNoFilter = [...se.listDepart];
      }
      
      if(se.listReturn && se.listReturn.length >0){
        se.listReturnNoFilter = [...se.listReturn];
      }

              setTimeout(()=>{
                if(se.listDepart && se.listDepart.length > 0) {
                  se.bestpricedepart = se.listDepart.length >=2 ?  [...se.listDepart].splice(0,2) : [...se.listDepart];
                  if(se.listDepart.length > 2){
                    let listotherpricedepart = [...se.listDepart].splice(2,se.listDepart.length);
                    //listotherpricedepart = se.sortFlightsByPrice(listotherpricedepart);
                    se.sortFlightsByPrice(listotherpricedepart).then((data)=>{
                      se.bestpricedepart = [...se.bestpricedepart, data.splice(0,1)[0]];
    
                      let listotherpricedepartmustreorder = [...listotherpricedepart];
                      se.sortFlights("priceorder", listotherpricedepartmustreorder);
    
                      se.otherpricedepart = [...listotherpricedepartmustreorder];
                    })
                  }else{
                    se.otherpricedepart = [];
                  }
                  
                }
              
                if(se.listReturn && se.listReturn.length > 0){
                  se.bestpricereturn = se.listReturn.length >=2 ? [...se.listReturn].splice(0,2) : [...se.listReturn];
                  if(se.listReturn.length > 2){
                    let listotherpricereturn = [...se.listReturn].splice(2,se.listReturn.length);
                    //listotherpricereturn = se.sortFlightsByPrice(listotherpricereturn);
                    se.sortFlightsByPrice(listotherpricereturn).then((data)=>{
                      se.bestpricereturn = [...se.bestpricereturn, data.splice(0,1)[0]];

                      let listotherpricereturnmustreorder = [...data];
                      se.sortFlights("priceorder", listotherpricereturnmustreorder);

                      se.otherpricereturn = [...listotherpricereturnmustreorder];
                    })
                  }else{
                    se.otherpricereturn = []
                  }
                }
                  
                  if((se.listDepart && se.listDepart.length >0) || (se.listReturn && se.listReturn.length >0))
                  {
                      se.loadpricedone = true;
                  }
                    se.zone.run(()=>{
                      se.progressbarloading = 1;
                      se.progressbarbuffer = 1;
                    })
              }, 50);
         
          if(se.count >=1){
          // se.sortFlightsByPriceOrder(se.listDepart);
          // se.sortFlightsByPriceOrder(se.listReturn);
          
            setTimeout(()=>{
            
              // if(se.listDepart && se.listDepart.length > 0) {
              //   se.bestpricedepart = [...se.listDepart].splice(0,3);
              //   se.otherpricedepart = [...se.listDepart].splice(3,se.listDepart.length);
              // }
    
              // if(se.listReturn && se.listReturn.length > 0){
              //   se.bestpricereturn = [...se.listReturn].splice(0,3);
              //   se.otherpricereturn = [...se.listReturn].splice(3,se.listReturn.length);
              // }

              if(se.listDepart && se.listDepart.length > 0) {
                se.bestpricedepart = se.listDepart.length >=2 ? [...se.listDepart].splice(0,2) : [...se.listDepart];
                let listotherpricedepart = [...se.listDepart].splice(2,se.listDepart.length);
                //listotherpricedepart = se.sortFlightsByPrice(listotherpricedepart);
                se.sortFlightsByPrice(listotherpricedepart).then((data)=>{
                  se.bestpricedepart = [...se.bestpricedepart, data.splice(0,1)[0]];

                  let listotherpricedepartmustreorder = [...data];
                  se.sortFlights("priceorder", listotherpricedepartmustreorder);

                  se.otherpricedepart = [...listotherpricedepartmustreorder];
                })
              }
            
              if(se.listReturn && se.listReturn.length > 0){
                se.bestpricereturn = [...se.listReturn].splice(0,2);

                let listotherpricereturn = se.listReturn.length >=2 ? [...se.listReturn].splice(2,se.listReturn.length) : [...se.listReturn];
                //listotherpricereturn = se.sortFlightsByPrice(listotherpricereturn);
                se.sortFlightsByPrice(listotherpricereturn).then((data)=>{
                  se.bestpricereturn = [...se.bestpricereturn, data.splice(0,1)[0]];

                  let listotherpricereturnmustreorder = [...data];
                  se.sortFlights("priceorder", listotherpricereturnmustreorder);

                  se.otherpricereturn = [...listotherpricereturnmustreorder];
                })
              }
            },150)
            
            if((se.listDepart && se.listDepart.length >0) || (se.listReturn && se.listReturn.length >0))
                    {
                      setTimeout(()=>{
                        se.loadpricedone = true;
                      }, 200);
                      
                    }
          }
        //}
        
     
    })
  }

  sort(property, listsort) {
    var se = this;
    if (listsort && listsort.flights.length > 0) {
      se.zone.run(() => listsort.flights.sort(function (a, b) {
        let direction = -1;
        if (property == "priceorder") {
          if (a[property] * 1 < b[property] * 1) {
            return 1 * direction;
          }
          else if (a[property] * 1 > b[property] * 1) {
            return -1 * direction;
          }
          //chiều đi
          else if (a[property] * 1 == b[property] * 1 && a["rangeTime"] && b["rangeTime"]) {
            if(a["rangeTime"] >= 600 && a["rangeTime"] <=720){
              return 1 * direction;
            }
            else if(b["rangeTime"] >= 600 && b["rangeTime"] <=720){
              return -1 * direction;
            }
            else{
              return 1 * direction;
            }
          }
          //chiều về
          else if (a[property] * 1 == b[property] * 1 && a["rangeTimeReturn"] && b["rangeTimeReturn"]) {
            if(a["rangeTimeReturn"] >= 840 && a["rangeTimeReturn"] <=1020){
              return 1 * direction;
            }
            else if(b["rangeTimeReturn"] >= 840 && b["rangeTimeReturn"] <=1020){
              return -1 * direction;
            }
            else{
              return 1 * direction;
            }
          }
          else {
            return;
          }
        }
        else {
          return;
        }
      }));
    }
  };

  sortFlights(property, listsort) {
    var se = this;
    if (listsort && listsort.length > 0) {
      se.zone.run(() => listsort.sort(function (a, b) {
        let direction = -1;
        if (property == "priceorder") {
          if (a[property] * 1 < b[property] * 1) {
            return 1 * direction;
          }
          else if (a[property] * 1 > b[property] * 1) {
            return -1 * direction;
          }
          else {
            return 1 * direction;
          }
          // //chiều đi
          // else if (a[property] * 1 == b[property] * 1 && a["rangeTime"] && b["rangeTime"]) {
          //   if(a["rangeTime"] >= 600 && a["rangeTime"] <=720){
          //     return 1 * direction;
          //   }
          //   else if(b["rangeTime"] >= 600 && b["rangeTime"] <=720){
          //     return -1 * direction;
          //   }
          //   else{
          //     return 1 * direction;
          //   }
          // }
          // //chiều về
          // else if (a[property] * 1 == b[property] * 1 && a["rangeTimeReturn"] && b["rangeTimeReturn"]) {
          //   if(a["rangeTimeReturn"] >= 840 && a["rangeTimeReturn"] <=1020){
          //     return 1 * direction;
          //   }
          //   else if(b["rangeTimeReturn"] >= 840 && b["rangeTimeReturn"] <=1020){
          //     return -1 * direction;
          //   }
          //   else{
          //     return 1 * direction;
          //   }
          // }
        }
      }));
    }
  };

  sortFlightsByPriceOrder(listsort){
    var se = this;
    if (listsort && listsort.length > 0) {
      se.zone.run(() => listsort.sort(function (a, b) {
        let direction = -1;
            if(a['priceorder'] == b['priceorder']){
              if (a['sortpriceorder'] * 1 < b['sortpriceorder'] * 1) {
                return 1 * direction;
              }
              else if (a['sortpriceorder'] * 1 > b['sortpriceorder'] * 1) {
                return -1 * direction;
              }else {
                return 1 * direction;
              }
            }
        })
      )
    }
  }

  sortFlightsByPrice(listsort) : Promise<any>{
    var se = this;
    return new Promise((resolve, reject) =>{
      if (listsort && listsort.length > 0) {
        se.zone.run(() => listsort.sort(function (a, b) {
          let direction = -1;
              if(a['totalPrice'] == b['totalPrice']){
                if (a['sortpriceorder'] * 1 < b['sortpriceorder'] * 1) {
                  return 1 * direction;
                }
                else if (a['sortpriceorder'] * 1 > b['sortpriceorder'] * 1) {
                  return -1 * direction;
                }else {
                  return 1 * direction;
                }
              }else{
                return a['totalPrice']*1 - b['totalPrice']*1;
              }
          })
        )
      }
      resolve(listsort);
    })
    
  }

  sortFlightsByTime(listsort, type){
    var se = this;
    let columntime = type == 1 ? 'rangeTime' : 'rangeTimeReturn';
    if (listsort && listsort.length > 0) {
      se.zone.run(() => listsort.sort(function (a, b) {
        let direction = -1;
            if(a['priceorder'] == b['priceorder']){
              if (a[columntime] * 1 < b[columntime] * 1) {
                return 1 * direction;
              }
              else if (a[columntime] * 1 > b[columntime] * 1) {
                return -1 * direction;
              }
            }
        })
      )
    }
  }

  //Hàm check VMB giá thấp nhất trong khung giờ chấp nhận được
  checkvalueDepart(list) {
    if(list && list.length >0){
      var Hour; var Minute; var kq;
      var good:any = [];
      var medium:any = [];
      var other:any = [];
      
        for (let i = 0; i < list.length; i++) {
          let ar_time = list[i].departTime.toString().split('T')[1];
          Hour = ar_time.toString().split(':')[0];
          Minute = ar_time.toString().split(':')[1];
          kq = Hour * 60 + Number(Minute);
          list[i].rangeTime = kq;
  
          if (kq >= 360 && kq <= 840) {//lấy khung giờ ưu tiên 6h - 14h
           
            list[i].sortpriceorder = 1;
            good.push(list[i]);
          }
          else {
            list[i].sortpriceorder = 3;
            other.push(list[i]);
          }
        }
       
        if(good.length>0)
        {
          this.sortFlightsByTime(good,1);
          let otherlist = [...good.splice(good.length > 2 ? 3 : 2,good.length),...other];
          //this.sortFlightsByTime(otherlist,1);
          this.sortFlights('priceorder', otherlist);
          this.listDepart = [...good.splice(0,good.length > 2 ? 3 : 2),...otherlist];
        }
        else{
          this.sortFlightsByTime(other,1);
          this.listDepart =  [...other];
        }
        
        if(this.listDepart.length ==0){
          this.listDepart =  other;
        }

    }
    return [...this.listDepart];
  }

  checkReturnList(list){
    if(list && list.length >0){
      var Hour; var Minute; var kq;
      var good:any = [];
      var medium:any = [];
      var other:any = [];
        for (let i = 0; i < list.length; i++) {
          // var dateTime = new Date(list[i].departTime);
          // Hour = moment(dateTime).format("HH");
          // Minute = moment(dateTime).format("mm");
          let ar_time = list[i].departTime.toString().split('T')[1];
          Hour = ar_time.toString().split(':')[0];
          Minute = ar_time.toString().split(':')[1];
          kq = Hour * 60 + Number(Minute);
  
          if (kq >= 600 && kq < 1200) {
            // if (kq >= 840 && kq <= 1020) {
            //   list[i].sortpriceorder = 1;
            //   good.push(list[i]);
            // }
            // else {
            //   list[i].sortpriceorder = 2;
            //   medium.push(list[i]);
            // }
            list[i].sortpriceorder = 1;
              good.push(list[i]);
          }
          else {
            list[i].sortpriceorder = 3;
            other.push(list[i]);
          }
        }
        // if(medium && medium.length >0 && good && good.length >0){
        //   if(good[0].priceorder <= medium[0].priceorder ){
        //     this.returnfi =  [...good,...medium,...other];
        //   }else{
        //     if (medium.length > 0) {
        //       this.returnfi =  [...medium,...good,...other];
        //     }else{
        //      if(good.length>0)
        //       {
        //         this.returnfi =  [...good,...medium,...other];
        //       }
        //       else{
        //         this.returnfi =  other;
        //       }
        //     }
        //   }
        // }else {
        //   if (medium.length > 0) {
        //     this.returnfi =  [...medium,...good,...other];
        //   }else{
        //    if(good.length>0)
        //     {
        //       this.returnfi = [...good,...medium,...other];
        //     }
        //     else{
        //       this.returnfi =  [...other];
        //     }
        //   }
        // }
        
        // if(this.returnfi.length ==0){
        //   this.returnfi = other;
        // }

        if(good.length>0)
            {
              this.sortFlightsByTime(good,2);
              let otherlist = [...good.splice(good.length > 2 ? 3 : 2,good.length),...other];
              //this.sortFlightsByTime(otherlist,1);
              this.sortFlights('priceorder', otherlist);
              this.listReturn = [...good.splice(0,good.length > 2 ? 3 : 2),...otherlist];
            }
            else{
              this.sortFlightsByTime(other,2);
              this.listReturn =  [...other];
        }
        
        if(this.listReturn.length ==0){
          this.listReturn = other;
        }
    }
    return [...this.listReturn];
  }

  sortAirline(type){
    this.sortairline = (this.buttonMinPriceSelected || this.buttonMinTimeDepartSelected || this.buttonMaxTimeDepartSelected || this.buttonMinTimeReturnSelected || this.buttonMaxTimeReturnSelected || this.buttoniVIVUSelected);
    this.sortByAirline(type);
  }

  /**Hàm sort list khách sạn theo giá, điểm trung bình 
     * PDANH 23/01/2018
     */
    sortByAirline(property) {
        var se = this;
        se.column = property;
        if(se.enableFlightFilter){
          if(se._flightService.listflightDepartFilter && se._flightService.listflightDepartFilter.length >0){
            se.zone.run(() => se._flightService.listflightDepartFilter.sort(function (a, b) {
              let direction = -1;
              if(property == "priceup"){
                let col = 'totalPrice';
                if (a[col] * 1 < b[col] * 1) {
                  return 1 * direction;
                }
                else if (a[col] * 1 > b[col] * 1) {
                  return -1 * direction;
                }
              }else{
                let direction = (property == "sortByTimeDepartEarly" || property =="sortByTimeLandingEarly") ? -1 : 1;
                let columnname = property == "sortByTimeDepartEarly" ? 'departTime' : 'landingTime';
                if (a[columnname] < b[columnname]) {
                  return 1 * direction;
                }
                else if (a[columnname] > b[columnname]) {
                  return -1 * direction;
                }
              }
            }));

            if(se.listDepartFilter && se.listDepartFilter.length >0){
              se.zone.run(() => se.listDepartFilter.sort(function (a, b) {
                let direction = -1;
                if(property == "priceup"){
                  let col = 'totalPrice';
                  if (a[col] * 1 < b[col] * 1) {
                    return 1 * direction;
                  }
                  else if (a[col] * 1 > b[col] * 1) {
                    return -1 * direction;
                  }else {
                    return 1 * direction;
                  }
                }else{
                  let direction = (property == "sortByTimeDepartEarly" || property =="sortByTimeLandingEarly") ? -1 : 1;
                  let columnname = property == "sortByTimeDepartEarly" ? 'departTime' : 'landingTime';
                  if (a[columnname] < b[columnname]) {
                    return 1 * direction;
                  }
                  else if (a[columnname] > b[columnname]) {
                    return -1 * direction;
                  }else {
                    return 1 * direction;
                  }
                }
              }));
            }

          }
          else{
            se.listDepartFilter = [];
          }
          

        }else{
          if(se.listDepart && se.listDepart.length >0 && property){
            se.zone.run(() => se.listDepart.sort(function (a, b) {
              let direction = -1;
              if(property == "priceup"){
                let col = 'totalPrice';
                if (a[col] * 1 < b[col] * 1) {
                  return 1 * direction;
                }
                else if (a[col] * 1 > b[col] * 1) {
                  return -1 * direction;
                }else {
                  return 1 * direction;
                }
              }else{
                let direction = (property == "sortByTimeDepartEarly" || property =="sortByTimeLandingEarly") ? -1 : 1;
                let columnname = property == "sortByTimeDepartEarly" ? 'departTime' : 'landingTime';
                if (a[columnname] < b[columnname]) {
                  return 1 * direction;
                }
                else if (a[columnname] > b[columnname]) {
                  return -1 * direction;
                }
                else {
                  return 1 * direction;
                }
              }
            }));
          }
        }
      
        if(se.enableFlightFilterReturn){
          if(se._flightService.listflightReturnFilter && se._flightService.listflightReturnFilter.length >0){
            se.zone.run(() => se._flightService.listflightReturnFilter.sort(function (a, b) {
              let direction = -1;
              if(property == "priceup"){
                let col = 'totalPrice';
                if (a[col] * 1 < b[col] * 1) {
                  return 1 * direction;
                }
                else if (a[col] * 1 > b[col] * 1) {
                  return -1 * direction;
                }
              }else{
                let direction = (property == "sortByTimeDepartEarly" || property =="sortByTimeLandingEarly") ? -1 : 1;
                //let columnname = "sortByTime";
                let columnname = property == "sortByTimeDepartEarly" ? 'departTime' : 'landingTime';
                if (a[columnname] < b[columnname]) {
                  return 1 * direction;
                }
                else if (a[columnname] > b[columnname]) {
                  return -1 * direction;
                }
              }
            }));

            if(se.listReturnFilter && se.listReturnFilter.length >0){
              se.zone.run(() => se.listReturnFilter.sort(function (a, b) {
                let direction = -1;
                if(property == "priceup"){
                  let col = 'totalPrice';
                  if (a[col] * 1 < b[col] * 1) {
                    return 1 * direction;
                  }
                  else if (a[col] * 1 > b[col] * 1) {
                    return -1 * direction;
                  }
                }else{
                  let direction = (property == "sortByTimeDepartEarly" || property =="sortByTimeLandingEarly") ? -1 : 1;
                  //let columnname = "sortByTime";
                  let columnname = property == "sortByTimeDepartEarly" ? 'departTime' : 'landingTime';
                  if (a[columnname] < b[columnname]) {
                    return 1 * direction;
                  }
                  else if (a[columnname] > b[columnname]) {
                    return -1 * direction;
                  }
                }
              }));
            }
          }else{
            se.listReturnFilter =[];
          }

          
        }else{
          if(se.listReturn && se.listReturn.length >0 && property){
            se.zone.run(() => se.listReturn.sort(function (a, b) {
              let direction = -1;
              if(property == "priceup"){
                let col = 'totalPrice';
                if (a[col] * 1 < b[col] * 1) {
                  return 1 * direction;
                }
                else if (a[col] * 1 > b[col] * 1) {
                  return -1 * direction;
                }
                else {
                  return 1 * direction;
                }
              }else{
                let direction = (property == "sortByTimeDepartEarly" || property =="sortByTimeLandingEarly") ? -1 : 1;
                //let columnname = "sortByTime";
                let columnname = property == "sortByTimeDepartEarly" ? 'departTime' : 'landingTime';
                if (a[columnname] < b[columnname]) {
                  return 1 * direction;
                }
                else if (a[columnname] > b[columnname]) {
                  return -1 * direction;
                }
                else {
                  return 1 * direction;
                }
              }
            }));
          }
        }
      
        

        setTimeout(()=>{
          if(se.enableFlightFilter){
            // se.bestpricedepart = [...se._flightService.listflightDepartFilter].splice(0,3);
            // se.otherpricedepart = [...se._flightService.listflightDepartFilter].splice(3,se._flightService.listflightDepartFilter.length);
            if(se._flightService.listflightDepartFilter && se._flightService.listflightDepartFilter.length >0){
              se.listDepartFilter = [...se._flightService.listflightDepartFilter];
            }
            
          }else{
            // se.bestpricedepart = [...se.listDepart].splice(0,3);
            // se.otherpricedepart = [...se.listDepart].splice(3,se.listDepart.length);
            if(se.listDepart && se.listDepart.length >0){
              se.listDepart = [...se.listDepart];
            }
            
          }

          if(se.enableFlightFilterReturn){
            if(se._flightService.listflightReturnFilter && se._flightService.listflightReturnFilter.length >0){
              // se.bestpricereturn = [...se._flightService.listflightReturnFilter].splice(0,3);
              // se.otherpricereturn = [...se._flightService.listflightReturnFilter].splice(3,se._flightService.listflightReturnFilter.length);
              if(se._flightService.listflightReturnFilter && se._flightService.listflightReturnFilter.length >0){
                se.listReturnFilter = [...se._flightService.listflightReturnFilter];
              }
              
            }
          }else{
            // if(se.listReturn && se.listReturn.length >0){
            //   se.bestpricereturn = [...se.listReturn].splice(0,3);
            //   se.otherpricereturn = [...se.listReturn].splice(3,se.listReturn.length);
            // }
            if(se.listReturn && se.listReturn.length >0){
              se.listReturn = [...se.listReturn];
            }
            
          }
          
        },200)
        

      };


      async openSortFlight(){
        if(!this.loadpricedone){
          this.gf.showToastWarning('Đang tìm vé máy bay tốt nhất. Xin quý khách vui lòng đợi trong giây lát!');
          return;
        }
        let actionSheet = await this.actionsheetCtrl.create({
          cssClass: 'action-sheets-flightsearchresult-sort',
          buttons: [
            {
              text: "iVIVU đề xuất",
              cssClass:"btn-iVIVU cls-border-bottom",
              handler: () => {
                this.buttoniVIVUSelected = !this.buttoniVIVUSelected;
                this.textsort = this.buttoniVIVUSelected ? "iVIVU đề xuất" : "";
                this.buttoniVIVUSelected ? $(".btn-minprice > span").addClass('selected') : $(".btn-minprice > span").removeClass('selected');

                this.buttonMinPriceSelected = false;
                this.buttonMinTimeDepartSelected = false;
                this.buttonMaxTimeDepartSelected = false;
                this.buttonMinTimeReturnSelected = false;
                this.buttonMaxTimeReturnSelected = false;

                if(this.buttonMinPriceSelected){
                  this.buttonMinPriceSelected = !this.buttonMinPriceSelected;
                  this.sortAirline("priceup");
                }
                else if(this.buttonMinTimeDepartSelected){
                  this.buttonMinTimeDepartSelected = !this.buttonMinTimeDepartSelected;
                  this.sortAirline("sortByTimeDepartEarly");
                }
                else if(this.buttonMaxTimeDepartSelected){
                  this.buttonMaxTimeDepartSelected = !this.buttonMaxTimeDepartSelected;
                  this.sortAirline("sortByTimeDepartLately");
                }
                else if(this.buttonMinTimeReturnSelected){
                  this.buttonMinTimeReturnSelected = !this.buttonMinTimeReturnSelected;
                  this.sortAirline("sortByTimeLandingEarly");
                }
                else if(this.buttonMaxTimeDepartSelected){
                  this.buttonMaxTimeDepartSelected = !this.buttonMaxTimeDepartSelected;
                  this.sortAirline("sortByTimeLandingLately");
                }

                this.sortairline = this.buttoniVIVUSelected;
                if(this.enableFlightFilter || this.enableFlightFilterReturn){
                  this.filterFlight();
                }
              }
            },
            // {
            //   text: "Giá thấp nhất",
            //   cssClass:"btn-minprice cls-border-bottom",
            //   handler: () => {
            //     this.buttonMinPriceSelected = !this.buttonMinPriceSelected;
            //     this.textsort = this.buttonMinPriceSelected ? "Giá thấp nhất" : "";
            //     this.buttonMinPriceSelected ? $(".btn-minprice > span").addClass('selected') : $(".btn-minprice > span").removeClass('selected');

            //     this.buttonMinTimeDepartSelected = false;
            //     this.buttonMaxTimeDepartSelected = false;
            //     this.buttonMinTimeReturnSelected = false;
            //     this.buttonMaxTimeReturnSelected = false;
            //     this.buttoniVIVUSelected = !this.buttonMinPriceSelected;
            //     this.sortAirline("priceup");
            //   }
            // },
            {
              text: "Cất cánh sớm nhất",
              cssClass:"btn-mintimedepart cls-border-bottom",
              handler: () => {
                this.buttonMinTimeDepartSelected = !this.buttonMinTimeDepartSelected;
                this.textsort = this.buttonMinTimeDepartSelected ? "Cất cánh sớm nhất" : "";
                this.buttonMinTimeDepartSelected ? $(".btn-mintimedepart > span").addClass('selected') : $(".btn-mintimedepart > span").removeClass('selected');

                this.buttonMinPriceSelected = false;
                this.buttonMaxTimeDepartSelected = false;
                this.buttonMinTimeReturnSelected = false;
                this.buttonMaxTimeReturnSelected = false;
                this.buttoniVIVUSelected = !this.buttonMinTimeDepartSelected;
                this.sortAirline("sortByTimeDepartEarly");
              }
            },
            {
              text: "Cất cánh muộn nhất",
              cssClass:"btn-maxtimedepart cls-border-bottom",
              handler: () => {
                this.buttonMaxTimeDepartSelected = !this.buttonMaxTimeDepartSelected;
                this.textsort = this.buttonMaxTimeDepartSelected ? "Cất cánh muộn nhất" : "";
                this.buttonMaxTimeDepartSelected ? $(".btn-JetStar > span").addClass('selected') : $(".btn-JetStar > span").removeClass('selected');
                
                this.buttonMinPriceSelected = false;
                this.buttonMinTimeDepartSelected = false;
                this.buttonMinTimeReturnSelected = false;
                this.buttonMaxTimeReturnSelected = false;
                this.buttoniVIVUSelected = !this.buttonMaxTimeDepartSelected;
                this.sortAirline("sortByTimeDepartLately");
              }
            },
            {
              text: "Hạ cánh sớm nhất",
              cssClass:"btn-mintimereturn cls-border-bottom",
              handler: () => {
                this.buttonMinTimeReturnSelected = !this.buttonMinTimeReturnSelected;
                this.textsort = this.buttonMinTimeReturnSelected ? "Hạ cánh sớm nhất" : "";
                this.buttonMinTimeReturnSelected ? $(".btn-mintimereturn > span").addClass('selected') : $(".btn-mintimereturn > span").removeClass('selected');

                this.buttonMinPriceSelected = false;
                this.buttonMinTimeDepartSelected = false;
                this.buttonMaxTimeDepartSelected = false;
                this.buttonMaxTimeReturnSelected = false;
                this.buttoniVIVUSelected = !this.buttonMinTimeReturnSelected;
                this.sortAirline("sortByTimeLandingEarly");
              }
            },
            {
              text: "Hạ cánh muộn nhất",
              cssClass:"btn-maxtimereturn cls-border-bottom",
              handler: () => {
                this.buttonMaxTimeReturnSelected = !this.buttonMaxTimeReturnSelected;
                this.textsort = this.buttonMaxTimeReturnSelected ? "Hạ cánh muộn nhất" : "";
                this.buttonMaxTimeReturnSelected ? $(".btn-maxtimereturn > span").addClass('selected') : $(".btn-maxtimereturn > span").removeClass('selected');

                this.buttonMinPriceSelected = false;
                this.buttonMinTimeDepartSelected = false;
                this.buttonMaxTimeDepartSelected = false;
                this.buttonMinTimeReturnSelected = false;
                this.buttoniVIVUSelected = !this.buttonMaxTimeReturnSelected;
                this.sortAirline("sortByTimeLandingLately");
              }
            },
            // {
            //   text: "Xác nhận",
            //   cssClass:"btn-filter",
            //   handler: () => {
            //       this.filterAirline(this.arrFilterAirline);
            //   }
            // },
          ],
    
        });
       
        this.buttonMinPriceSelected ? $(".btn-minprice > span").addClass('selected') : $(".btn-minprice > span").removeClass('selected');
        this.buttonMinTimeDepartSelected ? $(".btn-mintimedepart > span").addClass('selected') : $(".btn-mintimedepart > span").removeClass('selected');
        this.buttonMaxTimeDepartSelected ? $(".btn-maxtimedepart > span").addClass('selected') : $(".btn-maxtimedepart > span").removeClass('selected');
        this.buttonMinTimeReturnSelected ? $(".btn-mintimereturn > span").addClass('selected') : $(".btn-mintimereturn > span").removeClass('selected');
        this.buttonMaxTimeReturnSelected ? $(".btn-maxtimereturn > span").addClass('selected') : $(".btn-maxtimereturn > span").removeClass('selected');
        this.buttoniVIVUSelected ? $(".btn-iVIVU > span").addClass('selected') : $(".btn-iVIVU > span").removeClass('selected');
        this.sortairline = this.buttoniVIVUSelected ? this.buttoniVIVUSelected : this.sortairline;
        
        actionSheet.present();
      
      }
    
        /**Hàm lọc lại chuyến bay
         * PDANH 24/04/2018
         */
        filterAirline(arrAirline){
          var se = this;
          if(arrAirline && arrAirline.length >0){
              //let arrAirline = event.detail.value;
              let strAirline = "";
              arrAirline.forEach(element => {
                strAirline += (strAirline != "")? (","+element) : element;
              });
              
              se.listdepartflightdisplay = [];
              se.listreturnflightdisplay = [];

              se.zone.run(()=>{
                se.departfi.forEach(f => {
                  if(strAirline.indexOf(f.airlineCode) != -1){
                    se.listdepartflightdisplay.push(f);
                  }
                });

                se.returnfi.forEach(f => {
                  if(strAirline.indexOf(f.airlineCode) != -1){
                    se.listreturnflightdisplay.push(f);
                  }
                });

                se.bestpricedepart = [...se.listdepartflightdisplay].splice(0,3);
                se.otherpricedepart = [...se.listdepartflightdisplay].splice(3,se.departfi.length);

                se.bestpricereturn = [...se.listreturnflightdisplay].splice(0,3);
                se.otherpricereturn = [...se.listreturnflightdisplay].splice(3,se.returnfi.length);
              })
            }else{
              se.listdepartflightdisplay = [];
              se.zone.run(()=>{
                se.departfi.forEach(f => {
                    se.listdepartflightdisplay.push(f);
                });

                se.returnfi.forEach(f => {
                    se.listreturnflightdisplay.push(f);
                });

                se.bestpricedepart = [...se.listdepartflightdisplay].splice(0,3);
                se.otherpricedepart = [...se.listdepartflightdisplay].splice(3,se.departfi.length);

                se.bestpricereturn = [...se.listreturnflightdisplay].splice(0,3);
                se.otherpricereturn = [...se.listreturnflightdisplay].splice(3,se.returnfi.length);
              })
            }
            if(se.column){
              se.sortByAirline(se.column);
            }
          }

      async openFilterFlight(){
        if(!this.loadpricedone){
          this.gf.showToastWarning('Đang tìm vé máy bay tốt nhất. Xin quý khách vui lòng đợi trong giây lát!');
          return;
        }
        this._flightService.filterFromRequestSearchFlight = true;
        this._flightService.itemFlightCache.step = this.step;
            this._flightService.listAllFlightDepart = this.listDepartNoFilter;
            if(this.listReturnNoFilter && this.listReturnNoFilter.length >0){
              this._flightService.listAllFlightReturn = this.listReturnNoFilter;
              this._flightService.listAllFlight = [...this.listDepartNoFilter,...this.listReturnNoFilter];
            }else{
              this._flightService.listAllFlight = [...this.listDepartNoFilter];
            }
            
           
            const modal: HTMLIonModalElement =
            await this.modalCtrl.create({
              component: FlightsearchfilterPage,
              componentProps: {
                aParameter: true,
              }
            });
          modal.present();
        
          modal.onDidDismiss().then((data: OverlayEventDetail) => {
            if(data && data.data){
              if(this._flightService.objectFilter){
                this.storage.get('flightfilterobject').then((data) => {
                  if(data){
                    this.storage.remove('flightfilterobject').then(()=>{
                      this.storage.set('flightfilterobject', this._flightService.objectFilter);
                    })
                  }else{
                    this.storage.set('flightfilterobject', this._flightService.objectFilter);
                  }
                })
                
                this.filterFlight();
              }else{

                if(this._flightService.objSearch){
                 
                  let obj= this._flightService.objSearch;
                  this.resetValue();
                  this.clearMinMaxPriceFilter();
                  setTimeout(()=> {
                    this.loadFlightData(false);
                  }, 200)
                 
                  this.title = obj.title;
                  this.subtitle = obj.subtitle;
                }
              
              }
            }
          })
      }

      excuteSort(){
        var se = this;
        let type = '';
            if(se.buttonMinPriceSelected){
                type = "priceup";
            }else if(se.buttonMinTimeDepartSelected){
                type ='sortByTimeDepartEarly';
            }else if(se.buttonMaxTimeDepartSelected){
                  type ='sortByTimeDepartLately';
            }else if(se.buttonMinTimeReturnSelected){
                type ='sortByTimeLandingEarly';
            }else if(se.buttonMaxTimeReturnSelected){
              type ='sortByTimeLandingLately';
            }
            se.sortByAirline(type);
      }

      filterFlight(){
        var se = this;
        var se = this;
        if(se.step == 2){
          let listdepart = se._flightService.listflightDepartFilter;
          //if(se.enableFlightFilter){
            if(listdepart && listdepart.length >0){
              se.sortFlights('priceorder', listdepart);
              // if( !se._flightService.objectFilter.departTimeRange || (se._flightService.objectFilter.departTimeRange && se._flightService.objectFilter.departTimeRange.length ==0 ) ){
              //   listdepart = se.checkvalueDepart(listdepart);
              // }
                
                if(se.sortairline){
                  se.checkSortFlight();
                }
              if(se.sortairline && !se.buttoniVIVUSelected){
                se.listDepartFilter = listdepart;
                se.excuteSort();
                
              }
              //else{
                // se.bestpricedepart = [...listdepart].splice(0,3);
                // se.otherpricedepart = [...listdepart].splice(3,listdepart.length);
                
              //}

              if(listdepart && listdepart.length > 0) {
                se.bestpricedepart = listdepart.length >=2 ?  [...listdepart].splice(0,2) : [...listdepart];
                if(listdepart.length >2){
                  let listotherpricedepart = [...listdepart].splice(2,listdepart.length);
                  se.sortFlightsByPrice(listotherpricedepart).then((data)=>{
                    se.bestpricedepart = [...se.bestpricedepart, data.splice(0,1)[0]];

                    let listotherpricedepartmustreorder = [...data];
                    se.sortFlights("priceorder", listotherpricedepartmustreorder);
    
                    se.otherpricedepart = [...listotherpricedepartmustreorder];
                  });
                  
  
                  
                }else{
                  se.otherpricedepart = [];
                }
                
              }

            }else{
              if(se.sortairline && !se.buttoniVIVUSelected){
                se.listDepartFilter = [];
              }else{
                se.bestpricedepart =[];
                se.otherpricedepart = [];
              }

            }
            
          //setTimeout(()=>{
            
            
          //},100)
        }else{
          let listreturn = se._flightService.listflightReturnFilter;
          if(listreturn && listreturn.length >0){
            //if(se.enableFlightFilterReturn){
              se.sortFlights('price', listreturn);
              // if(!se._flightService.objectFilter.returnTimeRange || (se._flightService.objectFilter.returnTimeRange && se._flightService.objectFilter.returnTimeRange.length ==0) ){
              //   listreturn = se.checkReturnList(listreturn);
              // }
              
              if(se.sortairline){
                se.checkSortFlight();
              }
            if(se.sortairline && !se.buttoniVIVUSelected){
              se.listReturnFilter = listreturn;
              se.excuteSort();
            }
            //else{
              // se.bestpricereturn = [...listreturn].splice(0,3);
              // se.otherpricereturn = [...listreturn].splice(3,listreturn.length);
            //}

            if(listreturn && listreturn.length > 0){
              se.bestpricereturn = listreturn.length >=2 ?  [...listreturn].splice(0,2) : [...listreturn];
              if(listreturn.length >2){
                let listotherpricereturn = [...listreturn].splice(2,listreturn.length);
                //listotherpricereturn = se.sortFlightsByPrice(listotherpricereturn);
                se.sortFlightsByPrice(listotherpricereturn).then((data)=>{
                se.bestpricereturn = [...se.bestpricereturn, data.splice(0,1)[0]];
  
                let listotherpricereturnmustreorder = [...data];
                se.sortFlights("priceorder", listotherpricereturnmustreorder);
  
                se.otherpricereturn = [...listotherpricereturnmustreorder];
                })
              }else{
                se.otherpricereturn = [];
              }
              
            }

          }else{
            if(se.sortairline && !se.buttoniVIVUSelected){
              se.listReturnFilter = [];
            }else{
              se.bestpricereturn =[];
              se.otherpricereturn = [];
            }
          }
        }
      }

      checkSortFlight(){
        if(this.buttonMinPriceSelected){
          this.sortAirline("priceup");
        }
        else if(this.buttonMinTimeDepartSelected){
          this.sortAirline("sortByTimeDepartEarly");
        }
        else if(this.buttonMaxTimeDepartSelected){
          this.sortAirline("sortByTimeDepartLately");
        }
        else if(this.buttonMinTimeReturnSelected){
          this.sortAirline("sortByTimeLandingEarly");
        }
        else if(this.buttonMaxTimeDepartSelected){
          this.sortAirline("sortByTimeLandingLately");
        }
      }

      filterByListFlight(list, type){
        var se = this;
        var listFilter:any =[];
        if(type == 'depart'){
          let filterPrice = list;
          if(se._flightService.objectFilter && se._flightService.objectFilter.minprice && se._flightService.objectFilter.maxprice){
            filterPrice = list.filter((filterpriceitem) => {
              return filterpriceitem.totalPrice *1 >= se._flightService.objectFilter.minprice *1 && filterpriceitem.totalPrice *1 <= se._flightService.objectFilter.maxprice *1;
            })
          }
         
          listFilter = [...filterPrice];
  
            if( se._flightService.objectFilter.departTimeRange && se._flightService.objectFilter.departTimeRange.length >0){//Lọc theo giờ cất cánh
                let filterDepart = listFilter.filter((filterdepartitem) => {
                  let time = moment(filterdepartitem.departTime).format("HH:mm:ss");
                  let timerange = time ? se.gf.convertStringToNumber(time) : -1;
  
                  let strFilter;
                  if(se._flightService.objectFilter.departTimeRange.indexOf(1) != -1){
                    strFilter = timerange >= 0 && timerange <= 60000;
                  }
                  if(se._flightService.objectFilter.departTimeRange.indexOf(2) != -1){
                    strFilter = strFilter ? (strFilter || timerange >= 60000 && timerange <= 120000) : timerange >= 60000 && timerange <= 120000;
                  }
                  if(se._flightService.objectFilter.departTimeRange.indexOf(3) != -1){
                    strFilter = strFilter ? (strFilter || timerange >= 120000 && timerange <= 180000) : timerange >= 120000 && timerange <= 180000 ;
                  }
                  if(se._flightService.objectFilter.departTimeRange.indexOf(4) != -1){
                    strFilter = strFilter ? (strFilter || timerange >= 180000 && timerange <= 240000) : timerange >= 180000 && timerange <= 240000;
                  }
                  
                  return strFilter;
                })
                listFilter = [...filterDepart];
            }
  
          if( se._flightService.objectFilter.returnTimeRange && se._flightService.objectFilter.returnTimeRange.length >0){//Lọc theo giờ hạ cánh
              let filterReturn = listFilter.filter((filterreturnitem) => {
                let time = moment(filterreturnitem.landingTime).format("HH:mm:ss");
                let timerange = time ? se.gf.convertStringToNumber(time) : -1;
  
                let strFilter;
                  if(se._flightService.objectFilter.returnTimeRange.indexOf(1) != -1){
                    strFilter = timerange >= 0 && timerange <= 60000;
                  }
                  if(se._flightService.objectFilter.returnTimeRange.indexOf(2) != -1){
                    strFilter = strFilter ? (strFilter || timerange >= 60000 && timerange <= 120000) : timerange >= 60000 && timerange <= 120000;
                  }
                  if(se._flightService.objectFilter.returnTimeRange.indexOf(3) != -1){
                    strFilter = strFilter ? (strFilter || timerange >= 120000 && timerange <= 180000) : timerange >= 120000 && timerange <= 180000 ;
                  }
                  if(se._flightService.objectFilter.returnTimeRange.indexOf(4) != -1){
                    strFilter = strFilter ? (strFilter || timerange >= 180000 && timerange <= 240000) : timerange >= 180000 && timerange <= 240000;
                  }
                  
                  return strFilter;
              })
              listFilter = [...filterReturn];
          }
  
            if(se._flightService.objectFilter.airlineSelected && se._flightService.objectFilter.airlineSelected.length >0){
              let filterAirline = listFilter.filter((filterairlineitem) => {
                let str;
                if(type == 'depart'){
                  if(se._flightService.objectFilter.airlineSelected.indexOf(1) != -1 && se.listDepartAirlines.indexOf("VietnamAirlines") != -1){
                    str = filterairlineitem.airlineCode == "VietnamAirlines";
                  }
                  if(se._flightService.objectFilter.airlineSelected.indexOf(2) != -1 && se.listDepartAirlines.indexOf("BambooAirways") != -1){
                    str = str ? (str || filterairlineitem.airlineCode == "BambooAirways") : filterairlineitem.airlineCode == "BambooAirways";
                  }
                  if(se._flightService.objectFilter.airlineSelected.indexOf(3) != -1  && se.listDepartAirlines.indexOf("JetStar") != -1){
                    str = str ? (str || filterairlineitem.airlineCode == "JetStar") : filterairlineitem.airlineCode == "JetStar" ;
                  }
                  if(se._flightService.objectFilter.airlineSelected.indexOf(4) != -1  && se.listDepartAirlines.indexOf("VietJetAir") != -1){
                    str = str ? (str || filterairlineitem.airlineCode == "VietJetAir") : filterairlineitem.airlineCode == "VietJetAir";
                  }
                  if(se._flightService.objectFilter.airlineSelected.indexOf(5) != -1  && se.listDepartAirlines.indexOf("AirAsia") != -1){
                    str = str ? (str || filterairlineitem.airlineCode == "AirAsia") : filterairlineitem.airlineCode == "AirAsia" ;
                  }
                }else{
                  if(se._flightService.objectFilter.airlineSelected.indexOf(1) != -1 && se.listReturnAirlines.indexOf("VietnamAirlines") != -1){
                    str = filterairlineitem.airlineCode == "VietnamAirlines";
                  }
                  if(se._flightService.objectFilter.airlineSelected.indexOf(2) != -1 && se.listReturnAirlines.indexOf("BambooAirways") != -1){
                    str = str ? (str || filterairlineitem.airlineCode == "BambooAirways") : filterairlineitem.airlineCode == "BambooAirways";
                  }
                  if(se._flightService.objectFilter.airlineSelected.indexOf(3) != -1  && se.listReturnAirlines.indexOf("JetStar") != -1){
                    str = str ? (str || filterairlineitem.airlineCode == "JetStar") : filterairlineitem.airlineCode == "JetStar" ;
                  }
                  if(se._flightService.objectFilter.airlineSelected.indexOf(4) != -1  && se.listReturnAirlines.indexOf("VietJetAir") != -1){
                    str = str ? (str || filterairlineitem.airlineCode == "VietJetAir") : filterairlineitem.airlineCode == "VietJetAir";
                  }
                  if(se._flightService.objectFilter.airlineSelected.indexOf(5) != -1  && se.listReturnAirlines.indexOf("AirAsia") != -1){
                    str = str ? (str || filterairlineitem.airlineCode == "AirAsia") : filterairlineitem.airlineCode == "AirAsia" ;
                  }
                }
                
                return str;
              })
              listFilter = [...filterAirline];
            }

            if( se._flightService.objectFilter.classSelected && se._flightService.objectFilter.classSelected.length >0){
              let filterclass = listFilter.filter((filterclassitem) => {
                let str;
                // if(se._flightService.objectFilter.classSelected.indexOf(1) != -1){
                //   str = filterclassitem.ticketClass == "Phổ thông";
                // }
                // if(se._flightService.objectFilter.classSelected.indexOf(2) != -1){
                //   str = str ? (str || filterclassitem.ticketClass == "Thương gia") : filterclassitem.ticketClass == "Thương gia";
                // }
                // if(se._flightService.objectFilter.classSelected.indexOf(3) != -1){
                //   str = str ? (str || filterclassitem.ticketClass == "Hạng nhất") : filterclassitem.ticketClass == "Hạng nhất" ;
                // }
                if(se._flightService.objectFilter.classSelected.indexOf(1) != -1){
                  str = ((filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Phổ thông") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Eco" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) == -1));
                }
                if(se._flightService.objectFilter.classSelected.indexOf(2) != -1){
                  str = str ? (str || filterclassitem.ticketClass == "Thương gia") : filterclassitem.ticketClass == "Thương gia";
                }
                if(se._flightService.objectFilter.classSelected.indexOf(3) != -1){
                  str = str ? (str || ((filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Linh hoạt") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Deluxe" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) == -1))) : ((filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Linh hoạt") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Deluxe" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) == -1)) ;
                }
                if(se._flightService.objectFilter.classSelected.indexOf(4) != -1){
                  
                  str = str ? (str || ((filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Tiết kiệm") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Eco" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) != -1))) : ((filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Tiết kiệm") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Eco" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) != -1)) ;
                }
                return str;
              })
             
              listFilter = [...filterclass];
            }
  
            if( se._flightService.objectFilter.stopSelected && se._flightService.objectFilter.stopSelected.length >0){
              let filterclass = listFilter.filter((filterstopitem) => {
                let stop = filterstopitem.stops*1 +1;
                return se._flightService.objectFilter.stopSelected.indexOf(stop) != -1 ? true : false ;
              })
              listFilter = [...filterclass];
            }

            if( se._flightService.objectFilter.facilitySelected && se._flightService.objectFilter.facilitySelected.length >0){
              let filterfac = listFilter.filter((filterfacility) => {
                let str;
                if(filterfacility.ticketCondition){
                    if(se._flightService.objectFilter.facilitySelected.indexOf(1) != -1){
                      str = filterfacility.ticketCondition.isTicketRefund;
                    }
                    if(se._flightService.objectFilter.facilitySelected.indexOf(2) != -1){
                      str = str ? ( str || (filterfacility.promotions && filterfacility.promotions.length >0)) : (filterfacility.promotions && filterfacility.promotions.length >0);
                    }
                    if(se._flightService.objectFilter.facilitySelected.indexOf(3) != -1){
                      str = str ? ( str || (filterfacility.ticketCondition.baggageHanded || filterfacility.ticketCondition.luggageSigned )) : (filterfacility.ticketCondition.baggageHanded || filterfacility.ticketCondition.luggageSigned );
                    }
                    if(se._flightService.objectFilter.facilitySelected.indexOf(4) != -1){
                      str = str ? ( str || (filterfacility.ticketCondition && filterfacility.ticketCondition.priorityCI)) : (filterfacility.ticketCondition && filterfacility.ticketCondition.priorityCI);
                    }
                }
                
                return str ;
              })
              listFilter = [...filterfac];
            }
  
            list = listFilter;
        }
        //Chiều về
        else {
          let filterPrice = list;
          if(se._flightService.objectFilterReturn && se._flightService.objectFilterReturn.minprice && se._flightService.objectFilterReturn.maxprice){
            filterPrice = list.filter((filterpriceitem) => {
              return filterpriceitem.totalPrice *1 >= se._flightService.objectFilterReturn.minprice *1 && filterpriceitem.totalPrice *1 <= se._flightService.objectFilterReturn.maxprice *1;
            })
          }
          listFilter = [...filterPrice];
  
            if( se._flightService.objectFilterReturn.departTimeRangeReturn && se._flightService.objectFilterReturn.departTimeRangeReturn.length >0){//Lọc theo giờ cất cánh
                let filterDepart = listFilter.filter((filterdepartitem) => {
                  let time = moment(filterdepartitem.departTime).format("HH:mm:ss");
                  let timerange = time ? se.gf.convertStringToNumber(time) : -1;
  
                  let strFilter;
                  if(se._flightService.objectFilterReturn.departTimeRangeReturn.indexOf(1) != -1){
                    strFilter = timerange >= 0 && timerange <= 60000;
                  }
                  if(se._flightService.objectFilterReturn.departTimeRangeReturn.indexOf(2) != -1){
                    strFilter = strFilter ? (strFilter || timerange >= 60000 && timerange <= 120000) : timerange >= 60000 && timerange <= 120000;
                  }
                  if(se._flightService.objectFilterReturn.departTimeRangeReturn.indexOf(3) != -1){
                    strFilter = strFilter ? (strFilter || timerange >= 120000 && timerange <= 180000) : timerange >= 120000 && timerange <= 180000 ;
                  }
                  if(se._flightService.objectFilterReturn.departTimeRangeReturn.indexOf(4) != -1){
                    strFilter = strFilter ? (strFilter || timerange >= 180000 && timerange <= 240000) : timerange >= 180000 && timerange <= 240000;
                  }
                  
                  return strFilter;
                })
                listFilter = [...filterDepart];
            }
  
          if( se._flightService.objectFilterReturn.returnTimeRangeReturn && se._flightService.objectFilterReturn.returnTimeRangeReturn.length >0){//Lọc theo giờ hạ cánh
              let filterReturn = listFilter.filter((filterreturnitem) => {
                let time = moment(filterreturnitem.landingTime).format("HH:mm:ss");
                let timerange = time ? se.gf.convertStringToNumber(time) : -1;
  
                let strFilter;
                  if(se._flightService.objectFilterReturn.returnTimeRangeReturn.indexOf(1) != -1){
                    strFilter = timerange >= 0 && timerange <= 60000;
                  }
                  if(se._flightService.objectFilterReturn.returnTimeRangeReturn.indexOf(2) != -1){
                    strFilter = strFilter ? (strFilter || timerange >= 60000 && timerange <= 120000) : timerange >= 60000 && timerange <= 120000;
                  }
                  if(se._flightService.objectFilterReturn.returnTimeRangeReturn.indexOf(3) != -1){
                    strFilter = strFilter ? (strFilter || timerange >= 120000 && timerange <= 180000) : timerange >= 120000 && timerange <= 180000 ;
                  }
                  if(se._flightService.objectFilterReturn.returnTimeRangeReturn.indexOf(4) != -1){
                    strFilter = strFilter ? (strFilter || timerange >= 180000 && timerange <= 240000) : timerange >= 180000 && timerange <= 240000;
                  }
                  
                  return strFilter;
              })
              listFilter = [...filterReturn];
          }
  
            if(se._flightService.objectFilterReturn.airlineSelectedReturn && se._flightService.objectFilterReturn.airlineSelectedReturn.length >0){
              let filterAirline = listFilter.filter((filterairlineitem) => {
                let str;
                if(type == 'depart'){
                  if(se._flightService.objectFilterReturn.airlineSelectedReturn.indexOf(1) != -1 && se.listDepartAirlines.indexOf("VietnamAirlines") != -1){
                    str = filterairlineitem.airlineCode == "VietnamAirlines";
                  }
                  if(se._flightService.objectFilterReturn.airlineSelectedReturn.indexOf(2) != -1 && se.listDepartAirlines.indexOf("BambooAirways") != -1){
                    str = str ? (str || filterairlineitem.airlineCode == "BambooAirways") : filterairlineitem.airlineCode == "BambooAirways";
                  }
                  if(se._flightService.objectFilterReturn.airlineSelectedReturn.indexOf(3) != -1  && se.listDepartAirlines.indexOf("JetStar") != -1){
                    str = str ? (str || filterairlineitem.airlineCode == "JetStar") : filterairlineitem.airlineCode == "JetStar" ;
                  }
                  if(se._flightService.objectFilterReturn.airlineSelectedReturn.indexOf(4) != -1  && se.listDepartAirlines.indexOf("VietJetAir") != -1){
                    str = str ? (str || filterairlineitem.airlineCode == "VietJetAir") : filterairlineitem.airlineCode == "VietJetAir";
                  }
                  if(se._flightService.objectFilterReturn.airlineSelectedReturn.indexOf(5) != -1  && se.listDepartAirlines.indexOf("AirAsia") != -1){
                    str = str ? (str || filterairlineitem.airlineCode == "AirAsia") : filterairlineitem.airlineCode == "AirAsia" ;
                  }
                }else{
                  if(se._flightService.objectFilterReturn.airlineSelectedReturn.indexOf(1) != -1 && se.listReturnAirlinesReturn.indexOf("VietnamAirlines") != -1){
                    str = filterairlineitem.airlineCode == "VietnamAirlines";
                  }
                  if(se._flightService.objectFilterReturn.airlineSelectedReturn.indexOf(2) != -1 && se.listReturnAirlinesReturn.indexOf("BambooAirways") != -1){
                    str = str ? (str || filterairlineitem.airlineCode == "BambooAirways") : filterairlineitem.airlineCode == "BambooAirways";
                  }
                  if(se._flightService.objectFilterReturn.airlineSelectedReturn.indexOf(3) != -1  && se.listReturnAirlinesReturn.indexOf("JetStar") != -1){
                    str = str ? (str || filterairlineitem.airlineCode == "JetStar") : filterairlineitem.airlineCode == "JetStar" ;
                  }
                  if(se._flightService.objectFilterReturn.airlineSelectedReturn.indexOf(4) != -1  && se.listReturnAirlinesReturn.indexOf("VietJetAir") != -1){
                    str = str ? (str || filterairlineitem.airlineCode == "VietJetAir") : filterairlineitem.airlineCode == "VietJetAir";
                  }
                  if(se._flightService.objectFilterReturn.airlineSelectedReturn.indexOf(5) != -1  && se.listReturnAirlinesReturn.indexOf("AirAsia") != -1){
                    str = str ? (str || filterairlineitem.airlineCode == "AirAsia") : filterairlineitem.airlineCode == "AirAsia" ;
                  }
                }
                
                return str;
              })
              listFilter = [...filterAirline];
            }

            if(se.departFlight && se.departFlight.flightType.indexOf("outBound") != -1){
              let filterAirline = listFilter.filter((filterairlineitem) => {
                let str;
                    str = str ? (str || filterairlineitem.airlineCode == se.departFlight.airlineCode ) : filterairlineitem.airlineCode == se.departFlight.airlineCode ;
                return str;
              })
              listFilter = [...filterAirline];
            }
  
            if( se._flightService.objectFilterReturn.classSelectedReturn && se._flightService.objectFilterReturn.classSelectedReturn.length >0){
              let filterclass = listFilter.filter((filterclassitem) => {
                let str;
                // if(se._flightService.objectFilterReturn.classSelectedReturn.indexOf(1) != -1){
                //   str = filterclassitem.ticketClass == "Phổ thông";
                // }
                // if(se._flightService.objectFilterReturn.classSelectedReturn.indexOf(2) != -1){
                //   str = str ? (str || filterclassitem.ticketClass == "Thương gia") : filterclassitem.ticketClass == "Thương gia";
                // }
                // if(se._flightService.objectFilterReturn.classSelectedReturn.indexOf(3) != -1){
                //   str = str ? (str || filterclassitem.ticketClass == "Hạng nhất") : filterclassitem.ticketClass == "Hạng nhất" ;
                // }
                if(se._flightService.objectFilterReturn.classSelectedReturn.indexOf(1) != -1){
                  str = ( (filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Phổ thông") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Eco" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) == -1) );
                }
                if(se._flightService.objectFilterReturn.classSelectedReturn.indexOf(2) != -1){
                  str = str ? (str || filterclassitem.ticketClass == "Thương gia") : filterclassitem.ticketClass == "Thương gia";
                }
                if(se._flightService.objectFilterReturn.classSelectedReturn.indexOf(3) != -1){
                  str = str ? (str || ((filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Linh hoạt") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Deluxe" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) == -1))) : ((filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Linh hoạt") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Deluxe" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) == -1)) ;
                }
                if(se._flightService.objectFilterReturn.classSelectedReturn.indexOf(4) != -1){
                  
                  str = str ? (str || ((filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Tiết kiệm") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Eco" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) != -1))) : ((filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Tiết kiệm") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Eco" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) != -1)) ;
                }
                return str;
              })
             
              listFilter = [...filterclass];
            }
  
            if( se._flightService.objectFilterReturn.stopSelectedReturn && se._flightService.objectFilterReturn.stopSelectedReturn.length >0){
              let filterclass = listFilter.filter((filterstopitem) => {
                let stop = filterstopitem.stops*1 +1;
                return se._flightService.objectFilterReturn.stopSelectedReturn.indexOf(stop) != -1 ? true : false ;
              })
              listFilter = [...filterclass];
            }

            if( se._flightService.objectFilterReturn.facilitySelectedReturn && se._flightService.objectFilterReturn.facilitySelectedReturn.length >0){
              let filterfac = listFilter.filter((filterfacility) => {
                let str;
                if(filterfacility.ticketCondition){
                    if(se._flightService.objectFilterReturn.facilitySelectedReturn.indexOf(1) != -1){
                      str = filterfacility.ticketCondition.isTicketRefund;
                    }
                    if(se._flightService.objectFilterReturn.facilitySelectedReturn.indexOf(2) != -1){
                      str = str ? ( str || (filterfacility.promotions && filterfacility.promotions.length >0)) : (filterfacility.promotions && filterfacility.promotions.length >0);
                    }
                    if(se._flightService.objectFilterReturn.facilitySelectedReturn.indexOf(3) != -1){
                      str = str ? ( str || (filterfacility.ticketCondition.baggageHanded || filterfacility.ticketCondition.luggageSigned )) : (filterfacility.ticketCondition.baggageHanded || filterfacility.ticketCondition.luggageSigned );
                    }
                    if(se._flightService.objectFilterReturn.facilitySelectedReturn.indexOf(4) != -1){
                      str = str ? ( str || (filterfacility.ticketCondition && filterfacility.ticketCondition.priorityCI)) : (filterfacility.ticketCondition && filterfacility.ticketCondition.priorityCI);
                    }
                }
                
                return str ;
              })
              listFilter = [...filterfac];
            }
  
            list = listFilter;
        }
          
            
          return list;
      }
  
      filterItem() :Promise<any>{
        var se = this;
        return new Promise((resolve, reject) => {
          if( (se.listDepart && se.listDepart.length >0) || (se.listReturn && se.listReturn.length >0) ){
            const totalItemBeforeFilter = (se.listDepart ? se.listDepart.length : 0) + (se.listReturn ? se.listReturn.length : 0);
            const totalItemDepartBeforeFilter = (se.listDepart ? se.listDepart.length : 0);
            const totalItemReturnBeforeFilter = (se.listReturn ? se.listReturn.length : 0);
            se.zone.run(()=>{
            if(se._flightService.objectFilter &&
              (se._flightService.objectFilter.minprice*1 != 0
              || se._flightService.objectFilter.maxprice*1 != 15000000
              || se._flightService.objectFilter.departTimeRange.length >0
              || se._flightService.objectFilter.returnTimeRange.length >0
              || se._flightService.objectFilter.airlineSelected.length >0
              || se._flightService.objectFilter.classSelected.length >0
              || se._flightService.objectFilter.stopSelected.length >0
              || se._flightService.objectFilter.facilitySelected.length >0)
              ){
              if(se.listDepart && se.listDepart.length >0){
                se.listDepartFilter = se.filterByListFlight([...se.listDepart], 'depart');
              }
            }else{
              se.listDepartFilter =se.listDepart;
            }
            
            if(se._flightService.objectFilterReturn &&
              (se._flightService.objectFilterReturn.minprice*1 != 0
              || se._flightService.objectFilterReturn.maxprice*1 != 15000000
              || se._flightService.objectFilterReturn.departTimeRangeReturn.length >0
              || se._flightService.objectFilterReturn.returnTimeRangeReturn.length >0
              || se._flightService.objectFilterReturn.airlineSelectedReturn.length >0
              || se._flightService.objectFilterReturn.classSelectedReturn.length >0
              || se._flightService.objectFilterReturn.stopSelectedReturn.length >0
              || se._flightService.objectFilterReturn.facilitySelectedReturn.length >0
              )){
              if(se.listReturn && se.listReturn.length >0){
                se.zone.run(()=> {
                  se.listReturnFilter = se.filterByListFlight([...se.listReturn], 'return');
                })
                
                
               }
            }else{
              se.listReturnFilter =se.listReturn;
            }

             //se.loadpricedone = true;
             let totalItemAfterFilter = (se.listDepartFilter ? se.listDepartFilter.length : 0) + (se.listReturnFilter ? se.listReturnFilter.length : 0);
             let totalItemDepartAfterFilter = (se.listDepartFilter ? se.listDepartFilter.length : 0);
             let totalItemReturnAfterFilter = (se.listReturnFilter ? se.listReturnFilter.length : 0);

             if(se.step == 2){
              se.zone.run(()=>{
                se.enableFlightFilter = (totalItemDepartAfterFilter != totalItemDepartBeforeFilter) ? 1 : 0;
                
                if(se.departFlight && se.departFlight.flightType.indexOf("outBound") != -1){
                  let filterOutBound = se.listReturn.filter((filterairlineitem) => {
                    return filterairlineitem.airlineCode == se.departFlight.airlineCode;
                  })
                 
                  if(filterOutBound && filterOutBound.length != totalItemReturnAfterFilter){
                    se.listReturnFilter = filterOutBound;
                    se.enableFlightFilterReturn = (totalItemReturnAfterFilter != totalItemReturnBeforeFilter) ? 1 : 0;
                  }
                }else {
                  se.enableFlightFilterReturn = (totalItemReturnAfterFilter != totalItemReturnBeforeFilter) ? 1 : 0;
                }
              })
                
                
             }else{
                se.enableFlightFilterReturn = (totalItemReturnAfterFilter != totalItemReturnBeforeFilter) ? 1 : 0;
             }
               
             })
            
           }

           resolve(true);
        })
       
      }

      async showFlightDetail(item, type){
        var se = this;
        se._flightService.itemFlightCache.step = this.step;
        if(!se.loadpricedone){
          se.gf.showToastWarning('Đang tìm vé máy bay tốt nhất. Xin quý khách vui lòng đợi trong giây lát!');
          return;
        }
        se._flightService.itemFlightCache.itemFlight = item;
        const modal: HTMLIonModalElement =
        await se.modalCtrl.create({
          component: FlightdetailPage,
        });
        modal.present();

        modal.onDidDismiss().then((data: OverlayEventDetail) => {
          if(data && data.data){
            se.select(type,item);
          }
        })
      }

    async showChangeInfo(){
      var se = this;
      if(!se.loadpricedone){
        se.gf.showToastWarning('Đang tìm vé máy bay tốt nhất. Xin quý khách vui lòng đợi trong giây lát!');
        return;
      }
         
      setTimeout(()=>{
        se._flightService.itemAllFlightCount.emit(( this.listDepart ? this.listDepart.length: 0) + (this.listReturn ? this.listReturn.length : 0));
      },350)
      
      this._flightService.filterFromRequestSearchFlight = true;
        const modal: HTMLIonModalElement =
        await se.modalCtrl.create({
          component: FlightchangeinfoPage,
          componentProps: {
            aParameter: true,
          },
          showBackdrop: true,
          backdropDismiss: true,
          cssClass: "modal-flight-change-info",
          //enterAnimation: CustomAnimations.iosCustomEnterAnimation,
          //leaveAnimation: CustomAnimations.iosCustomLeaveAnimation,
        });
      modal.present();
    
      modal.onDidDismiss().then((data: OverlayEventDetail) => {
            if(data && data.data){
                let obj = se._flightService.objSearch;
                se.resetValue();
                // se.title = obj.title;
                // se.subtitle = obj.subtitle;
                // se.dayDisplay = obj.dayDisplay;
                // se.titlereturn = obj.titleReturn;
                // se.dayReturnDisplay = obj.dayReturnDisplay;
                // se.subtitlereturn = obj.subtitleReturn;
                // se.checkInDate = obj.departDate;
                // se.checkOutDate = obj.returnDate;
                this.checkInDate = this.searchhotel.CheckInDate;
                this.checkOutDate = this.searchhotel.CheckOutDate;
                let objday:any = this.gf.getDayOfWeek(this.searchhotel.CheckInDate);
                let objdayreturn:any = this.gf.getDayOfWeek(this.searchhotel.CheckOutDate);
                this.title = "Đi " + (this._flightService.itemFlightCache.departCity || this.trip.itemdepart.flightFrom) +" → " + (this._flightService.itemFlightCache.returnCity ||this.trip.itemdepart.flightTo);
                this.subtitle = " · " + this.trip.itemdepart.numberOfPax + " khách";
                this.titlereturn = "Về " + (this._flightService.itemFlightCache.returnCity || this.trip.itemreturn.flightFrom) +" → " + (this._flightService.itemFlightCache.departCity || this.trip.itemreturn.flightTo);
                this.subtitlereturn = " · " + this.trip.itemreturn.numberOfPax + " khách";
                this.dayDisplay = objday.dayname + ", " +moment(this.checkInDate).format("DD") +  " thg " +moment(this.checkInDate).format("M");
                this.dayReturnDisplay = objdayreturn.dayname + ", " + moment(this.checkOutDate).format("DD") + " thg " +moment(this.checkOutDate).format("M");
                this.trip.dayDisplay = this.dayDisplay;
                this.trip.dayReturnDisplay = this.dayReturnDisplay;
                this.checkInDate = this._flightService.itemFlightCache.checkInDate || this.trip.checkInDate;
                this.checkOutDate = this._flightService.itemFlightCache.checkOutDate || this.trip.checkOutDate;
                
                

                se.loadFlightData(true);
                
            }
          })
      }

      resetValue(){
        var se = this;
        se.zone.run(()=>{
          se.loadpricedone = false;
          se.listDepart = [];
          se.listReturn = [];
          se.departfi = [];
          se.returnfi = [];
          se.title ="";
          se.subtitle = "";
          se.bestpricedepart = [];
          se.otherpricedepart = [];
          se.sortairline = false;
          se.step = 2;
          se.bestpricereturn = [];
          se.otherpricereturn = [];
          se.buttonVASelected = false;
          se.airlinename=false;
          se.arrFilterAirline = [];
          se.buttonVJSelected = false;
          se.buttonJSSelected = false;
          se.buttonBASelected = false;
          se.listdepartflightdisplay = [];
          se.listreturnflightdisplay = [];
          se.buttonMinPriceSelected = false;
          se.buttonMinTimeSelected = false;
          se.buttonMaxTimeSelected = false;
          se.buttonMinTimeDepartSelected = false;
          se.buttonMaxTimeDepartSelected = false;
          se.buttonMinTimeReturnSelected = false;
          se.buttonMaxTimeReturnSelected = false;
          se.titlereturn = "";
          se.subtitlereturn = "";
          se.count=0;
          se.stoprequest=false;
          se.listDepartConditions = [];
          se.listReturnConditions = [];
          se.enableFlightFilter = false;
          se.enableFlightFilterReturn = false;
          se.canselect = true;
          se.listDepartAirlines=[];
          se.listReturnAirlines=[];
          se.listDepartAirlinesReturn = [];
          se.listReturnAirlinesReturn = [];
          se.listDepartNoFilter=[];
          se.listReturnNoFilter=[];
          se.listDepartFilter = [];
          se.listReturnFilter = [];
          se.listDepartTimeRange=[];
          se.listDepartLandingTimeRange=[];
          se.listReturnTimeRange=[];
          se.listReturnLandingTimeRange=[];
          se.listDepartTicketClass=[];
          se.ecoTicketClassName = "Phổ thông";
          se.bussinessTicketClassName ="Thương gia";
          se.firstTicketClassName ="Hạng nhất";
          se.listReturnTicketClass =[];
          se.listDepartStops=[];
          se.listReturnStops=[];
          se.listDepartFacility = [];
          se.listReturnFacility = [];
          se.departFlight=null;
          se._flightService.itemFlightCache.itemFlight = null;
          se._flightService.itemFlightCache.departFlight = null;
          se._flightService.itemFlightCache.returnFlight = null;
          se._flightService.itemFlightCache.step = 2;
          se._flightService.objectFilter = null;
          se._flightService.objectFilterReturn = null;
          se._flightService.itemFlightCache.pnr = null;

          if(se._flightService && se._flightService.objSearch){
            let obj = se._flightService.objSearch;
            se.title = obj.title;
            se.subtitle = obj.subtitle;
            se.dayDisplay = obj.dayDisplay;
            se.titlereturn = obj.titleReturn;
            se.dayReturnDisplay = obj.dayReturnDisplay;
            se.subtitlereturn = obj.subtitleReturn;
          }
        
          
          se.buttoniVIVUSelected = true;
          se.sortairline = true;
          se._flightService.filterFromRequestSearchFlight = false;
        })
        
      }

      closecalendar(){
        this.modalCtrl.dismiss();
        
      }
  
    async showPromo(item){
        let actionSheet = await this.actionsheetCtrl.create({
          cssClass: item.promotions[0].promotionContent.length >= 380 ? 'action-sheets-flight-promo height-194' : 'action-sheets-flight-promo',
          header: item.promotions[0].promotionNote,
          animated: false,
          mode: 'md',
          buttons: [
            {
              text: item.promotions[0].promotionContent
            }
          ],
          });
        
          actionSheet.present();
          $('.action-sheets-flight-promo').append("<div class='div-close-promo'><img src='./assets/ic_close_w.svg'></div>");

          $('.div-close-promo').click(()=>{
            actionSheet.dismiss();
            $('.div-close-promo')[0].style.display = 'none';
            
          })
      }

      showWarningFee(){

      }

      checkPrice(item, type){
        this.gf.showLoading();
        let header = {
          "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          'Content-Type': 'application/json; charset=utf-8'
      };
        let url = C.urls.baseUrl.urlFlight + `gate/apiv1/UpdateJourneysVJ?pnrCode=${type == 1 ? this.trip.itemdepart.ticketCode : this.trip.itemreturn.ticketCode}&secureKey=3b760e5dcf038878925b5613c32651dus&segment=${type}&flightDate=${moment(item.departTime).format('YYYY-MM-DD')}&flightNumber=${item.flightNumber}&ticketClass=${(item.ticketTypeSearch || item.ticketClass)}&funAction=qoute&fromCode=${item.fromPlaceCode}&toCode=${item.toPlaceCode}`;
        this.gf.RequestApi('GET', url, header, {}, 'orderrequestchangeflight', 'clickChangeFlight').then((data)=> {
            console.log(data);
            item.hasCheckPrice = true;
            this.gf.hideLoading();
            if(data && data.success && data.priceChange){
              item.priceDisplay = this.gf.convertNumberToString(data.priceChange) + " đ";
              item.priceChange = data.priceChange;
              item.allowChange = true;
            }else if(data.data && data.data[0] && data.data[0].totalPrice){
              item.priceDisplay = this.gf.convertNumberToString(data.data[0].totalPrice) + " đ";
              item.priceChange = data.data[0].totalPrice;
              item.allowChange = true;
            }
            else {
              item.priceDisplay = "0 đ";
              item.priceChange = 0;
              item.allowChange = false;
            }
            
        })
      }

        async clickedElement(e: any) {
          var obj: any = e.currentTarget;
          if ( (this._flightService.itemFlightCache.roundTrip && ($(obj.parentNode).hasClass("endSelection") || $(obj.parentNode).hasClass("startSelection"))) || (!this._flightService.itemFlightCache.roundTrip && $(obj).hasClass('on-selected'))  ) {
            if (this.modalCtrl) {
              let fday: any;
              let tday: any;
              var monthenddate: any;
              var yearenddate: any;
              var monthstartdate: any;
              var yearstartdate: any;
              var objTextMonthEndDate: any;
              var objTextMonthStartDate: any;
      
              let objsearch = this._flightService.objSearch;
              if(objsearch.roundTrip){
                this.roundtriptext = "khứ hồi/khách";
                if ($(obj.parentNode).hasClass('endSelection')) {
                  if ( $('.days-btn.lunarcalendar.on-selected > p')[0]) {
                    fday= $('.days-btn.lunarcalendar.on-selected > p')[0].innerText;
                  } else {
                    fday = $('.on-selected > p')[0].textContent;
                  }
                  if ($('.days.endSelection .days-btn.lunarcalendar > p')[0]) {
                    tday = $('.days.endSelection .days-btn.lunarcalendar > p')[0].innerText; 
                  } else {
                    //tday = $(obj)[0].textContent;
                    tday = $('.days.endSelection .days-btn > p')[0].innerText;
                  }
                  objTextMonthStartDate = $('.on-selected')?.closest('.month-box')?.children()[0]?.textContent?.replace('Tháng ','');
                  objTextMonthEndDate = $(obj)?.closest('.month-box')?.children()[0]?.textContent?.replace('Tháng ','');
                } else {
                  if ($('.days-btn.lunarcalendar.on-selected > p')[0]) {
                    fday =$('.days-btn.lunarcalendar.on-selected > p')[0].innerText;
                  }
                  else{
                    //fday = $(obj)[0].textContent;
                    fday = $(obj)[0].children[0].textContent
                  }
                  if ($('.days.endSelection .days-btn.lunarcalendar > p')[0]) {
                    tday = $('.days.endSelection .days-btn.lunarcalendar > p')[0].innerText;
                  }
                  else{
                    //tday = $('.endSelection').children('.days-btn')[0].textContent;
                    tday = $('.days.endSelection .days-btn > p')[0].innerText;
                  }
                  objTextMonthStartDate = $(obj)?.closest('.month-box')?.children()[0]?.textContent?.replace('Tháng ','');
                  objTextMonthEndDate = $('.endSelection')?.closest('.month-box')?.children()[0]?.textContent?.replace('Tháng ','');
                }
              }else{
                this.roundtriptext = "một chiều/khách";
                  if ( $('.days-btn.lunarcalendar.on-selected > p')[0]) {
                    fday= $('.days-btn.lunarcalendar.on-selected > p')[0].innerText;
                  } else {
                    //fday = $('.on-selected')[0].textContent;
                    fday = $('.on-selected > p')[0].textContent;
                  }
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
                monthstartdate = objTextMonthStartDate.trim().split(",")[0];
                yearstartdate = objTextMonthStartDate.trim().split(",")[1];
                monthenddate = objTextMonthEndDate.trim().split(",")[0];
                yearenddate = objTextMonthEndDate.trim().split(",")[1];
      
                var fromdate = new Date(yearstartdate, monthstartdate - 1, fday);
                var todate = new Date(yearenddate, monthenddate - 1, tday);
                let diffday =moment(todate).diff(fromdate, "days");
                this.countdaydisplay = diffday +1;
                var se = this;
                let allowseach = (diffday >=0 ? true : false);
                if (fromdate && todate && allowseach) {
                  
                  setTimeout(() => {
                    se.modalCtrl.dismiss({from: fromdate, to: todate});
                  }, 300);
      
                }
              }
            }
          }
        }

        checkChangeFlightPrice(item, type){
          return type == 1 ? item.price >= this.trip.bookingsComboData[0].totalCost : item.price >= this.trip.bookingsComboData[1].totalCost;
        }
        showChangeDate(){
          
        }
}
