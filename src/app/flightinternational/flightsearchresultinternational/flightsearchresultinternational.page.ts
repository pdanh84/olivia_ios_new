import { Component, OnInit, ViewChild, HostListener, NgZone, Input } from '@angular/core';
import { NavController, ModalController, ToastController, ActionSheetController,  IonContent, AlertController, PickerController } from '@ionic/angular';
import { GlobalFunction } from '../../providers/globalfunction';
import * as $ from 'jquery';
import { C } from './../../providers/constants';
import { OverlayEventDetail } from '@ionic/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { ValueGlobal, SearchHotel } from '../../providers/book-service';
import {flightService} from './../../providers/flightService';

import {FlightdetailPage } from '../../flightdetail/flightdetail.page';
import { FlightchangeinfoPage } from '../../flightchangeinfo/flightchangeinfo.page';
import { FlightquickbackPage } from '../../flightquickback/flightquickback.page';
import { CustomAnimations } from '../../providers/CustomAnimations';
import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';
import { FlightselecttimepriorityPage } from '../../flightselecttimepriority/flightselecttimepriority.page';
import { FlightInfoInternationalPage } from '../flightinfointernationnal/flightinfointernational.page';
import { FlightDepartureDetailInternationalPage } from '../flightdeparturedetailinternational/flightdeparturedetailinternational.page';
import { FlightInternationalSearchfilterPage } from '../flightinternationalsearchfilter/flightinternationalsearchfilter.page';
import { voucherService } from 'src/app/providers/voucherService';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-flightsearchresultinternational',
  templateUrl: './flightsearchresultinternational.page.html',
  styleUrls: ['./flightsearchresultinternational.page.scss'],
})
export class FlightSearchResultInternationalPage implements OnInit {
  @ViewChild('scrollArea') content: IonContent;
  loadpricedone = false;
  listDepart: any=[];
  listReturn: any=[];
  departfi: any[];
  returnfi: any[];
  title ="";
  subtitle = "";
  bestpricedepart: any=[];
  otherpricedepart: any=[];
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
  listAirlines: any=[];
  listDepartNoFilter: any=[];
  listDepartFilter: any;
  listStops:any=[];
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
  listDepartFacility = [];
  listReturnFacility = [];
  allowclickcalendar: boolean = true;
  
  VJSaverTicket = ['E1_Eco','A_Eco'];
  listReturnSeri:any = [];
  dayDisplay: any;
  dayReturnDisplay: any;
  timedepartpriorityinternationnalconfig: any;
  timereturnpriorityinternationnalconfig: any;
  expanddivflight: boolean;
  emptyFilterResult: boolean = false;
  countFilterResult: any;
  listAirlinesFilterDirect:any = [];
  loadalldone: boolean;

  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private zone: NgZone,
    public storage: Storage,
    private actionsheetCtrl: ActionSheetController,
    public valueGlobal: ValueGlobal,
    public searchhotel: SearchHotel,
    public _flightService: flightService,
    private alertCtrl: AlertController,
    private pickerCtrl : PickerController,
    private fb: Facebook,
    public _voucherService: voucherService) { 
      if(this._flightService.itemFlightInternational){
        this._flightService.itemFlightInternational.discountpromo = 0;
        this._flightService.itemFlightInternational.promotionCode = "";
        this._flightService.itemFlightInternational.hasvoucher = '';
      }
      
      this.step =2;
      clearInterval(this.intervalFlightTicket);
      if(_flightService.objSearch){
        let obj= _flightService.objSearch;
        let key="";
        
        storage.get('timedepartpriorityinternationnalconfig').then((data) => {
          if(data){
              this.timedepartpriorityinternationnalconfig = data;
              obj.timeDepartPriority = data;
          }
        })
  
        storage.get('timereturnpriorityinternationnalconfig').then((data) => {
            if(data){
                this.timereturnpriorityinternationnalconfig = data;
                obj.timeReturnPriority = data;
            }
        })
        
        if(!obj.itemSameCity){
          key ='listflight_' + obj.departDate + '_' + obj.returnDate + '_' + obj.departCode + '_' + obj.arrivalCode + '_' + obj.adult + '_' + obj.child + '_' + obj.infant;
          storage.get(key).then((data)=>{
            if(data){
              //this.loadcachedata(data);
              this.loadFlightData(obj, false);
            }else{
              this.loadFlightData(obj, false);
            }
          })
        }else{
          key ='listflight_' + obj.departDate + '_' + obj.returnDate + '_' + obj.departCity + '_' + obj.returnCity + '_' + obj.adult + '_' + obj.child + '_' + obj.infant;
          storage.get(key).then((data)=>{
            if(data){
              let objsamecity = obj.itemDepartSameCity ? obj.itemDepartSameCity : obj.itemReturnSameCity;
              //this.loadmultidata(data);
            }else{
              if(!obj.itemSameCity){
                this.loadFlightData(obj, false);
              }else{
                let objsamecity = obj.itemDepartSameCity ? obj.itemDepartSameCity : obj.itemReturnSameCity;
              }
              
            }
          })
        }
        
        
        
        this.title = obj.title;
        this.subtitle = obj.subtitle;
        this.titlereturn = obj.titleReturn;
        this.subtitlereturn = obj.subtitleReturn;
        this.dayDisplay = obj.dayDisplay;
        this.dayReturnDisplay = obj.dayReturnDisplay;
      }
      else {
        this._flightService.itemTabFlightActive.emit(true);
        this._flightService.publicItemFlightReloadInfo(1);
        this.valueGlobal.backValue = "homeflight";
        this.navCtrl.navigateBack('/tabs/tab1');
      }

      this.storage.get('flightinternationalfilterobject').then((data)=>{
        if(data){
          this._flightService.objectFilter = data;
        }
      })
      
      this.storage.get('jti').then(jti => {
        if (jti) {
          this.jti = jti;
        }
      })

      // this.fb.login(['public_profile', 'user_friends', 'email'])
      //   .then((res: FacebookLoginResponse) => console.log('Logged into Facebook!', res))
      //   .catch(e => console.log('Error logging into Facebook', e));


      //this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
      
      let se = this;
      se.gf.logEventFirebase(null, se._flightService.itemFlightCache, 'flightsearchresultinternational', 'view_item', 'Flights');
      se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_SEARCHED, {'fb_content_type': 'flight', 'fb_content_id': se._flightService.itemFlightCache.departCode +"_"+se._flightService.itemFlightCache.returnCode,
      'origin_airport' : se._flightService.itemFlightCache.departCode  ,
      'destination_airport': se._flightService.itemFlightCache.returnCode,
      'departing_departure_date': se._flightService.itemFlightCache.checkInDate ,'returning_departure_date ': se._flightService.itemFlightCache.checkOutDate,'num_adults': se._flightService.itemFlightCache.adult,'num_children': se._flightService.itemFlightCache.child ? se._flightService.itemFlightCache.child : 0,'num_infants': se._flightService.itemFlightCache.infant ? se._flightService.itemFlightCache.infant : 0, 'fb_value': (se._flightService.itemFlightCache.totalPrice ? se.gf.convertNumberToDouble(se._flightService.itemFlightCache.totalPrice) : 0) , 'fb_currency': "VND",
      'value': (se._flightService.itemFlightCache.totalPrice ? se.gf.convertNumberToDouble(se._flightService.itemFlightCache.totalPrice) : 0) , 'currency': "VND"   }, se._flightService.itemFlightCache.totalPrice ? se.gf.convertNumberToDouble(se._flightService.itemFlightCache.totalPrice) : 0);

      let flightItem = se._flightService.itemFlightCache;
    }

  ngOnInit() {
    this.zone.run(()=>{
        this.stoprequest = false;
      setTimeout(()=>{
        this.stoprequest = true;
        this.loadpricedone = true;
      }, 50 * 1000);
    })
    
    this._flightService.getItemFlightInternationalFilter().subscribe((data) => {
        if(data){
          this.filterItem();
          this.zone.run(()=>{
            this.enableFlightFilter = 1;
          })
        }else{
          this.zone.run(()=>{
            this.enableFlightFilter = 0;
          })
        }
    })

    this._flightService.itemFlightFilterChangeReturn.pipe().subscribe((data) => {
      if(data){
        this.zone.run(()=>{
          this.enableFlightFilterReturn = 1;
        })
      }else{
        this.zone.run(()=>{
          this.enableFlightFilterReturn = 0;
        })
      }
    })

    this._flightService.itemChangeTicketFlight.pipe().subscribe((data) => {
      if(data){
        let obj= this._flightService.objSearch;
        this.step = this._flightService.itemFlightCache.step;
        if(data == 2 && this._flightService.objectFilterInternational && this._flightService.objectFilterInternational.classSelected){
          obj.classSelected = this._flightService.objectFilterInternational.classSelected;
        }
        this.zone.run(()=>{
          this.resetValue();
          //this.clearMinMaxPriceFilter();
        })
        this.loadFlightData(obj, true);
      }
    })
  }

  ionViewWillEnter(){
    SplashScreen.hide();
  }

  goback(){
    this.stoprequest = true;
    this._flightService.classSelected = '';
    this._flightService.classSelectedName = '';
      this._flightService.itemTabFlightActive.emit(true);
      this._flightService.publicItemFlightReloadInfo(1);
      this.valueGlobal.backValue = "homeflight";
      this.navCtrl.navigateBack('/tabs/tab1');
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

    se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_VIEWED_CONTENT, {'fb_content_type': 'flight', 'fb_content_id': item.fromPlaceCode +"_"+item.toPlaceCode +"_"+item.flightNumber,
      'origin_airport' : item.fromPlaceCode  ,
      'fb_destination_airport': item.toPlaceCode,
      'departing_departure_date': se._flightService.itemFlightCache.checkInDate ,'returning_departure_date ': se._flightService.itemFlightCache.checkOutDate,'num_adults': se._flightService.itemFlightCache.adult,'num_children': se._flightService.itemFlightCache.child ? se._flightService.itemFlightCache.child : 0,'num_infants': se._flightService.itemFlightCache.infant ? se._flightService.itemFlightCache.infant : 0, 'fb_value': item.totalPrice , 'fb_currency': "VND" ,'value': item.totalPrice , 'currency': "VND" ,
     }, se.gf.convertNumberToDouble(item.totalPrice) );

      let flightItem = se._flightService.itemFlightCache;

    if(type ==1 ){
      item.departTimeDisplayFull = se._flightService.itemFlightCache.checkInDisplay;

      se._flightService.itemFlightCache.departFlight = item; 
      se.departFlight = item;
      //se.departFlight.timeDisplay = se.departFlight.timeDisplay.replace('-', '→');
      if(se._flightService.objSearch.roundTrip){
        se._flightService.itemFlightCache.step = 3;
        //Lọc vé seri chiều về theo availId
        if(item.id && item.id.indexOf('__seri') != -1){
          se.listReturnSeri = se.filterSeriItem(item);
        }
       
        else{
          if(se.departFlight.flightType.indexOf("outBound") == -1){
            if(se._flightService.objectFilter){
              se.filterItem();
            }
  
            se.filterNotSeriItem();
          }else{
              se.filterItem().then(()=>{
               
              })
            
          }
          
        }

       
        se.zone.run(()=>{
          se.step = 3;
          se.content.scrollToTop(300);
        })
       
      }else{
        se._flightService.itemFlightCache.returnFlight = null;
        if(se.canselect){
          se.choiceTicket(type, item);
        }
        se._flightService.itemFlightCache.hasChoiceLuggage = false;
        se._flightService.itemFlightCache.departLuggage = [];
        se._flightService.itemFlightCache.returnLuggage = [];
      }
    }else{
      
      //Nếu đi và về cùng ngày thì check thêm dk giờ về phải lớn hơn giờ đi 3h
      if(se._flightService.objSearch.roundTrip)
      {
        if(se.departFlight.flightType.indexOf("outBound") != -1 && item.flightType.indexOf("outBound") != -1 && se.departFlight.airlineCode != item.airlineCode){
          se.showAlert('Không thể kết hợp chặng bay này. Vui lòng chọn chuyến bay cùng hãng của chiều đi');
          return;
        }
        se.checkRoundTripInDay(item).then((data) => {
          if(data){
              se.showAlert('Để thuận tiện, bạn nên chọn chuyến bay về có giờ khởi hành cách thời điểm chuyến bay đi hạ cánh ít nhất 3 tiếng');
              return;
          }else{
            item.returnTimeDisplayFull = se._flightService.itemFlightCache.returnTimeDisplay;
            se._flightService.itemFlightCache.returnFlight = se._flightService.objSearch.roundTrip ? item : null; 
            // if(se.canselect){
            //   se.choiceTicket(type, item);
            // }
            // se._flightService.itemFlightCache.hasChoiceLuggage = false;
            // se._flightService.itemFlightCache.departLuggage = [];
            // se._flightService.itemFlightCache.returnLuggage = [];
            if(!se.checkMapSeriFlight()){
              se.showAlert('Một chặng bay đang chọn hạng vé Seri, vui lòng chọn vé Seri cho chặng bay còn lại');
              return;
            }else{
              if(se.canselect){
                se.choiceTicket(type, item);
              }
              se._flightService.itemFlightCache.hasChoiceLuggage = false;
              se._flightService.itemFlightCache.departLuggage = [];
              se._flightService.itemFlightCache.returnLuggage = [];
            }
          }
        })
      }else{
        se._flightService.itemFlightCache.returnFlight = se._flightService.objSearch.roundTrip ? item : null; 
        if(se.canselect){
          se.choiceTicket(type, item);
        }
        se._flightService.itemFlightCache.hasChoiceLuggage = false;
        se._flightService.itemFlightCache.departLuggage = [];
        se._flightService.itemFlightCache.returnLuggage = [];
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
    
    se.selectTicket().then((data)=>{
      se.canselect = true;
      se.gf.hideLoading();
      
      if(data && data.id){
        se._flightService.itemFlightCache.dataTicket = data;
        se._flightService.itemFlightCache.dataBooking = data.detail;
        
          se._flightService.itemFlightCache.reservationId = data.id;
         
         
          se._flightService.itemFlightCache.step = 3;
          

          se.storage.get("itemFlightCache").then((data)=>{
            if(data){
              se.storage.remove("itemFlightCache").then(()=>{
                se.storage.set("itemFlightCache", JSON.stringify(se._flightService.itemFlightCache));
              })
            }else{
              se.storage.set("itemFlightCache", JSON.stringify(se._flightService.itemFlightCache));
            }
          })
          se._flightService.publicItemFlightReloadInfo(1);

          se._flightService.itemFlightCache.departSeatChoice = [];
          se._flightService.itemFlightCache.returnSeatChoice = [];
          se._flightService.itemFlightCache.listdepartseatselected="";
          se._flightService.itemFlightCache.listreturnseatselected ="";
          se._flightService.itemFlightCache.departSeatChoiceAmout = 0;
          se._flightService.itemFlightCache.returnSeatChoiceAmout = 0;
          se.clearServiceInfo();
          let _totalprice =  se._flightService.itemFlightCache.departFlight.totalPrice + (se._flightService.itemFlightCache.returnFlight ? se._flightService.itemFlightCache.returnFlight.totalPrice : 0);
          se.gf.googleAnalytionCustom('add_to_cart',{item_category:'flightinternational' ,  start_date: moment(se._flightService.itemFlightCache.checkInDate).format("YYYY-MM-DD"), end_date: moment(se._flightService.itemFlightCache.checkOutDate).format("YYYY-MM-DD"),item_name: se._flightService.itemFlightCache.departCity+'-'+se._flightService.itemFlightCache.returnCity,item_id:se._flightService.itemFlightCache.departCode, value: _totalprice ,currency: "VND",origin: se._flightService.itemFlightCache.departCode, destination: se._flightService.itemFlightCache.returnCode, flight_number: se._flightService.itemFlightCache.itemFlightInternationalDepart.flightNumber});
          

          se.navCtrl.navigateForward('/flightaddservice');
          se.stoprequest = true;
      }else{
        //se.gf.showToastWarning('Vé máy bay bạn chọn hiện không còn. Vui lòng chọn lại!');
        se.showAlertRefreshPrice('Vé máy bay bạn chọn hiện không còn. Vui lòng chọn lại!');
      }
    })
  }
  
  

  clearServiceInfo(){
    this._flightService.itemFlightCache.jsonSeats = null;
    this._flightService.itemFlightCache.listdepartseatselected = "";
    this._flightService.itemFlightCache.listreturnseatselected = "";
    this._flightService.itemFlightCache.departLuggage = [];
    this._flightService.itemFlightCache.returnLuggage = [];
    this._flightService.itemFlightCache.hasChoiceLuggage = false;
    this._flightService.itemFlightCache.listSeatNormal = [];
    this._flightService.itemFlightCache.listReturnSeatNormal = [];
    this._flightService.itemFlightCache.departConditionInfo = null;
    this._flightService.itemFlightCache.returnConditionInfo = null;
    this._flightService.itemFlightCache.departSeatChoiceAmout = 0;
    this._flightService.itemFlightCache.returnSeatChoiceAmout = 0;
    this._flightService.itemFlightCache.isnewmodelseat = false;
    this._flightService.itemFlightCache.isnewmodelreturnseat = false;
    this._flightService.itemFlightCache.DICHUNGParam = null;
    this._flightService.itemFlightCache.departDCPlace=null;
    this._flightService.itemFlightCache.returnDCPlace=null;
    this._flightService.itemFlightCache.isblocktextDepart=false;
    this._flightService.itemFlightCache.isblocktextReturn=false;
    this._flightService.itemFlightCache.promotionCode="";
    this._flightService.itemFlightCache.discount=0;
    this._flightService.itemFlightCache.hasvoucher = false;
  }

  async showAlertRefreshPrice(msg){
    var se = this;
    let alert = await this.alertCtrl.create({
      message: msg,
      header: 'Giá đã được cập nhật',
      cssClass: "cls-alert-refreshPrice",
      backdropDismiss: false,
      buttons: [
      {
        text: 'OK',
        role: 'OK',
        handler: () => {
          se.zone.run(()=>{
            se.resetValue();
            se.clearMinMaxPriceFilter();
          })
          se.loadFlightData(se._flightService.objSearch, true);
          clearInterval(se.intervalFlightTicket);
          if(se.actionsheetCtrl){
            se.actionsheetCtrl.dismiss();
          }
          if(se.modalCtrl){
            se.modalCtrl.dismiss();
          }
          if(se.pickerCtrl){
            se.pickerCtrl.dismiss();
          }
          se.navCtrl.navigateBack('/flightsearchresult');
          alert.dismiss();
        }
      }
    ]
  });
  alert.present();
  }

  selectTicket() :Promise<any>{
    var se = this;
    se.canselect = false;
    return new Promise((resolve, reject) => {
        let obj = se._flightService.objSearch;
        let objdepart = se._flightService.itemFlightCache.departFlight;
        let objreturn = obj.roundTrip ? se._flightService.itemFlightCache.returnFlight : null;
        let flighttype = obj.roundTrip ? 2 : 1;
        let selectFlightURL ="";
        if(obj.roundTrip){
          selectFlightURL = C.urls.baseUrl.urlFlight +'gate/apiv1/InitBooking?token=Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09&from='+ obj.departCode +'&to='+obj.arrivalCode+'&departdate='+ obj.departDate +'&returndate='+ obj.returnDate +'&adult='+ obj.adult+'&child='+ obj.child+'&infant='+ obj.infant+'&flighttype='+flighttype;
          selectFlightURL +='&departFlightId='+objdepart.id+'&returnFlightId='+objreturn.id+'&departTicketType='+objdepart.ticketType+'&returnTicketType=' +objreturn.ticketType+'&source=8&memberId=' +se.jti;
        }else{
          selectFlightURL = C.urls.baseUrl.urlFlight +'gate/apiv1/InitBooking?token=Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09&from='+ obj.departCode +'&to='+obj.arrivalCode+'&departdate='+ obj.departDate +'&returndate='+ obj.returnDate +'&adult='+ obj.adult+'&child='+ obj.child+'&infant='+ obj.infant+'&flighttype='+flighttype;
          selectFlightURL +='&departFlightId='+objdepart.id+"&returnFlightId=''&departTicketType="+objdepart.ticketType+"&returnTicketType=''"+'&source=8&memberId=' +se.jti;
        }
         

        let urlPath = selectFlightURL;
          let headers = {
            "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            'Content-Type': 'application/json; charset=utf-8'
          };
          this.gf.RequestApi('POST', urlPath, headers, {}, 'flightSearchInternationalResult', 'selectTicket').then((data)=>{

          if (data) {
            let jsondata = data;
            if(jsondata.error){
                resolve(false);
            }else{
                resolve(jsondata);
            }
            
          }
        })
    })
    
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
    this._flightService.objectFilter.maxprice = 200;
   
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
     
      this._flightService.itemFlightFilterChangeReturn.emit(0);
      
    }
    if(this.sortairline && !this.buttoniVIVUSelected){
      this.excuteSort();
    }
    this.storage.remove('flightinternationalfilterobject');
  }

  checkLoadCacheData(obj, hascache): Promise<any>{
    var se = this;
    se.stoprequest = true;
    let _darr:any = moment(obj.departDate).format('YYYY-MM-DD hh:mm:ss').split(' '),
    _darrday =  _darr[0].split('-'),
    _darrhour =  _darr[1].split(':');
    let _darr_return:any = moment(obj.returnDate).format('YYYY-MM-DD hh:mm:ss').split(' '),
    _darrday_return =  _darr_return[0].split('-'),
    _darrhour_return =  _darr_return[1].split(':');
    let _d =new Date(Date.UTC(_darrday[0], _darrday[1] -1, _darrday[2], _darrhour[0], _darrhour[1], _darrhour[2])), final = (_d.getTime() + Math.abs((_d.getTimezoneOffset()))*2 );
    let _dReturn = new Date(Date.UTC(_darrday_return[0], _darrday_return[1] -1, _darrday_return[2], _darrhour_return[0], _darrhour_return[1], _darrhour_return[2])), final_return = (_dReturn.getTime() + Math.abs((_dReturn.getTimezoneOffset()))*2);
    let _isoDate = new Date(final).toISOString().replace('Z','');
    let _isoDate_return = new Date(final_return).toISOString().replace('Z','');

    return new Promise((resolve, reject) => {
      let objjson = 
      {
        "requestFrom": {
          "fromPlace": obj.departCode,
          "toPlace": obj.arrivalCode,
          "departDate": _isoDate,
          "returnDate": obj.roundTrip ? _isoDate_return : "",
          "adult": obj.adult,
          "child": obj.child,
          "infant": obj.infant ? obj.infant : 0,
          "timeIndayRecomment": obj.timeDepartPriority ? obj.timeDepartPriority : "09:00",
          "version": "3.0",
          "roundTrip": obj.roundTrip,
          "ticketClass": obj.classSelected || null
        },
        "requestTo": {
          "fromPlace": obj.arrivalCode,
          "toPlace": obj.departCode,
          "departDate": _isoDate,
          "returnDate": obj.roundTrip ? _isoDate_return : "",
          "adult": obj.adult,
          "child": obj.child,
          "infant": obj.infant ? obj.infant : 0,
          "timeIndayRecomment": obj.timeReturnPriority ? obj.timeReturnPriority : "15:00",
          "version": "3.0",
          "roundTrip": obj.roundTrip,
          "ticketClass": obj.classSelected || null
        },
        "roundTrip": obj.roundTrip,
        "noCache": true,
        //'tcincharge': "89311",
        //"noCache": se._flightService.bookingSuccess ? true : (hascache ? hascache : false)
      }
      
      let urlPath = C.urls.baseUrl.urlFlightInt + 'api/FlightSearch/GetSessions?'+ new Date().getTime();
          let headers = {
            "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            'Content-Type': 'application/json; charset=utf-8'
          };
          this.gf.RequestApi('POST', urlPath, headers, objjson, 'flightSearchResult', 'getHotelCity').then((data)=>{

        if(data){
          //console.log(body);
          resolve(data);
        }
      });

    })
  }

  loadFlightCacheDataByAirline(obj){
    var se = this;
    se.allowSearch = false;
    let urlfindflightincache = C.urls.baseUrl.urlFlightInt + "api/FlightSearch/GetFlights";
    let headers = {
      "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
      'Content-Type': 'application/json; charset=utf-8'
    };
    this.gf.RequestApi('POST', urlfindflightincache, headers, obj.source && obj.source.data ? obj.source.data : obj.source, 'flightSearchResultInternational', 'loadFlightCacheDataByAirline').then((data)=>{
            let result = data;
            se.allowSearch = true;
            obj.source = result.data.sessions;
            if(result){
              if(result.data && result.data.flights && result.data.flights.length >0){
                
                se.loadmultidata(result.data);
                
              }
             
              if(obj && obj.source && obj.source.length >0 && se.allowSearch){
              
                setTimeout(()=>{
                  se.loadFlightCacheDataByAirline(obj);
                },1000)
                obj.countretry++;
              } else if(obj.source && obj.source.length ==0){
                se.zone.run(()=>{
                  this.stoprequest = true;
                  this.loadpricedone = true;
                  this.loadalldone = true;

                  if(!this.listDepart || this.listDepart.length ==0){
                    this.emptyFilterResult = true;
                  }
                })
              }
  
            }
          })
  }

  loadConditions(conditions, type){
    var se = this;
    
    // if(type == 'depart'){
    //     if(se.listDepartConditions && se.listDepartConditions.length >0){
    //         se.listDepartConditions = [...se.listDepartConditions,...conditions];
    //     }else{
    //       se.listDepartConditions = [...conditions];
    //     }
    // }else{
    //   if(se.listReturnConditions && se.listReturnConditions.length >0){
    //     se.listReturnConditions = [...se.listReturnConditions,...conditions];
    //   }else{
    //     se.listReturnConditions = [...conditions];
    //   }
    // }
  }
  

  loadFlightData(obj, hascache){
    var se = this;
    se._voucherService.totalDiscountPromoCode =0;
    se._voucherService.listPromoCode =[];
    se._voucherService.voucherSelected = [];
    se._voucherService.listObjectPromoCode = [];
    se._voucherService.rollbackSelectedVoucher.emit(1);
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

    // setTimeout(()=>{
    //   this.stoprequest = true;
    //   this.loadpricedone = true;
    //   if(!this.listDepart || this.listDepart.length ==0){
    //     this.emptyFilterResult = true;
    //   }
    // }, 120 * 1000);

    se.checkLoadCacheData(obj,hascache).then(data => {
      if(data){
        obj.countretry =0;
        obj.source = data;
        se._flightService.itemFlightCache.SessionId = data.data[0];
        se.listDepartConditions = [];
        se.listReturnConditions = [];
        se.stoprequest = false;
          se.loadFlightCacheDataByAirline({...obj});
          
      }
    })

    //clear cache cityhotel
    se._flightService.itemFlightCache.itemsFlightCityHotel = [];
    se._flightService.itemFlightCache.HotelCityMealtypeSelected = null;
    se._flightService.itemFlightCache.objHotelCitySelected = null;
  }


  loadmultidata(data){
    var se = this;
    let jsondata = data.flights;
    //se.loadpricedone = true;
    se.zone.run(() => {
      se.count++;
      se.stoprequest = true;
      if(!se.listDepart || (se.listDepart && se.listDepart.length == 0) ){
        se.listDepart = jsondata;
      }
      else{
        if(se.listDepart && se.listDepart.length >0){
          se.listDepart = [...se.listDepart,...jsondata];
        }
      }
   

      if(se.listDepart && se.listDepart.length >0){
        se.zone.run(()=>{
          se.sortFlightsByPrice(se.listDepart);
        })
          se.listAirlinesFilterDirect = se.listDepart.map(item => {
            let lstAirlineDepart = item.departFlights.map(d => {return {'name': d.airline, 'namefilter': d.airline.replace(/\ /g,'').replace(/\./g,'').replace(/\'/g,'').replace(/\(/g,'').replace(/\)/g,''), 'value': d.airlineCode}});
            let lstAirlineReturn = item.returnFlights.map(d => {return {'name': d.airline, 'namefilter': d.airline.replace(/\ /g,'').replace(/\./g,'').replace(/\'/g,'').replace(/\(/g,'').replace(/\)/g,''), 'value': d.airlineCode}});
            let arr:any = [];
            if(lstAirlineDepart && lstAirlineDepart.length > 0){
             if(lstAirlineReturn && lstAirlineReturn.length > 0){
              if(lstAirlineDepart[0].namefilter != lstAirlineReturn[0].namefilter){
                arr = [...lstAirlineDepart];
                arr.push(lstAirlineReturn[0]);
              }
              else {
                arr.push(lstAirlineDepart[0]);
               }
             }else {
              arr.push(lstAirlineDepart[0]);
             }
            }
            return arr;
            });
        se.listAirlinesFilterDirect = se.listAirlinesFilterDirect.map(item => item[0]);
        let _arr = Object.values(
          se.listAirlinesFilterDirect.reduce((acc, obj) => ({ ...acc, [obj.namefilter]: obj }), {})
        );
       
        se.listAirlinesFilterDirect = _arr;
        console.log(se.listAirlinesFilterDirect);

        if(se.listAirlinesFilterDirect && se.listAirlinesFilterDirect.length >0){
          se._flightService.listAirlinesFilter = se.listAirlinesFilterDirect;
        }

        se.listDepart.forEach(element => {
          let priceFlightAdult = 0;
          let priceFlightChild = 0;
          let priceFlightInfant = 0;
          let indexd = 0;
          element.departFlights.forEach(elementDepart => {
            if(indexd ==0){
              elementDepart.ischeck = true;
              indexd++;
            }else {
              elementDepart.ischeck = false;
            }

            elementDepart.sessionsId = element.sessions;

            if(elementDepart.timeDepart){
              elementDepart.timeDepartShort = elementDepart.timeDepart.substring(0,5);
            }
            if(elementDepart.landingTime){
              elementDepart.timeLandingShort = moment(elementDepart.landingTime).format('HH:mm');
            }
            if(elementDepart.departTime){
              elementDepart.departTimeDisplay = `${se.gf.getDayOfWeek(elementDepart.departTime).daynameshort}, ${moment(elementDepart.departTime).format('DD/MM')}`;

              let hours:any = Math.floor(elementDepart.flightDuration/60);
              let minutes:any = elementDepart.flightDuration*1 - (hours*60);
              if(hours < 10){
                hours = hours != 0?  "0"+hours : "0";
              }
              if(minutes < 10){
                minutes = "0"+minutes;
              }
              elementDepart.flightTimeDisplay = hours+"h"+minutes+"m";
              //elementDepart.flightTimeDetailDisplay = hours+"h"+minutes+"m";
            }

            if(elementDepart.landingTime){
              elementDepart.landingTimeDisplay = `${se.gf.getDayOfWeek(elementDepart.landingTime).daynameshort}, ${moment(elementDepart.landingTime).format('DD/MM')}`;
            }
            if(elementDepart.stops == 0 && se.listStops.indexOf(1) == -1){
              se.listStops.push(1);
            }
            else if(elementDepart.stops == 1 && se.listStops.indexOf(2) == -1){
              se.listStops.push(2);
            }
            else if(elementDepart.stops > 1 && se.listStops.indexOf(3) == -1){
              se.listStops.push(3);
            }
            
          });
          let indexr = 0;
          element.returnFlights.forEach(elementReturn => {
            if(indexr ==0){
              elementReturn.ischeck = true;
              indexr++;
            }
            else {
              elementReturn.ischeck = false;
            }

            elementReturn.sessionsId = element.sessions;

            if(elementReturn.timeDepart){
              elementReturn.timeDepartShort = elementReturn.timeDepart.substring(0,5);
            }
            if(elementReturn.timeLanding){
              elementReturn.timeLandingShort = moment(elementReturn.landingTime).format('HH:mm');
            }
            if(elementReturn.departTime){
              elementReturn.departTimeDisplay = `${se.gf.getDayOfWeek(elementReturn.departTime).daynameshort}, ${moment(elementReturn.departTime).format('DD/MM')}`;

              let hours:any = Math.floor(elementReturn.flightDuration/60);
              let minutes:any = elementReturn.flightDuration*1 - (hours*60);
              if(hours < 10){
                hours = hours != 0?  "0"+hours : "0";
              }
              if(minutes < 10){
                minutes = "0"+minutes;
              }
              elementReturn.flightTimeDisplay = hours+"h"+minutes+"m";
              //elementDepart.flightTimeDetailDisplay = hours+"h"+minutes+"m";
            }

            if(elementReturn.landingTime){
              elementReturn.landingTimeDisplay = `${se.gf.getDayOfWeek(elementReturn.landingTime).daynameshort}, ${moment(elementReturn.landingTime).format('DD/MM')}`;
            }
            
          });
          
          // if(element.filters && element.filters.length >0){
          //   se._flightService.listAirlinesFilter = element.filters[0].items;
          // }
        });

            //se._flightService.itemFlightCache.lisAirlines = se.listAirlines;
            se._flightService.listStops = se.listStops;
            
            se.zone.run(() => se._flightService.listStops.sort(function (a, b) {
              return a - b;
            }));

          //se.sortFlights('priceorder', se.listDepart);
          //se.checkvalueDepart(se.listDepart);
          
      }
      se._flightService.listAllFlightInternational = [...se.listDepart];
      if(se.listDepart && se.listDepart.length >0){
        se.listDepartNoFilter = [...se.listDepart];
      }
              setTimeout(()=>{
                if((se.listDepart && se.listDepart.length == 0) || (se.listReturn && se.listReturn.length == 0)){
      
                }else{
               
                if(se.listDepart && se.listDepart.length > 0) {
                  se.bestpricedepart = se.listDepart.length >=3 ?  [...se.listDepart].splice(0,3) : [...se.listDepart];
                  if(se.listDepart.length > 3){
                    let listotherpricedepart = [...se.listDepart].splice(3,se.listDepart.length);
                    se.otherpricedepart = [...listotherpricedepart];

                  }else{
                    se.otherpricedepart = [];
                  }
                  
                }
              
                  
                  if(se.listDepart && se.listDepart.length >0)
                  {
                      se.loadpricedone = true;
                  }
                    se.zone.run(()=>{
                      se.progressbarloading = 1;
                      se.progressbarbuffer = 1;
                    })
                }
              }, 50);
         
        if(se.count >=1){
         
            setTimeout(()=>{

              if(se.listDepart && se.listDepart.length > 0) {
                se.bestpricedepart = se.listDepart.length >=3 ? [...se.listDepart].splice(0,3) : [...se.listDepart];
                let listotherpricedepart = [...se.listDepart].splice(3,se.listDepart.length);
                se.otherpricedepart = [...listotherpricedepart];
               
              }
            
            },150)
            
            if(se.listDepart && se.listDepart.length >0)
                    {
                      setTimeout(()=>{
                        se.loadpricedone = true;
                      }, 200);
                      
                    }
          }
        
        
     
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
        }
      }));
    }
  };

  sortFlights(property, listsort) {
    var se = this;
    if (listsort && listsort.length > 0) {
      se.zone.run(() => listsort.sort(function (a, b) {
        return a.fare.price - b.fare.price;
        
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
          return a.fare.priceAvg - b.fare.priceAvg;
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
        if(se.listDepartFilter && se.listDepartFilter.length >0 && property){
          se.zone.run(() => se.listDepartFilter.sort(function (a, b) {
            //let direction = -1;
            if(property == "priceup"){
              return a.fare.price - b.fare.price;
             
            }
          }));
        }

        setTimeout(()=>{
          se.bestpricedepart = [...se.listDepartFilter].splice(0,3);
          se.otherpricedepart = [...se.listDepartFilter].splice(3,se.listDepartFilter.length);
        })

      }else{
        if(se.listDepart && se.listDepart.length >0 && property){
          se.zone.run(() => se.listDepart.sort(function (a, b) {
            //let direction = -1;
            if(property == "priceup"){
              return a.fare.price - b.fare.price;
             
            }
          }));
        }

        setTimeout(()=>{
          se.bestpricedepart = [...se.listDepart].splice(0,3);
          se.otherpricedepart = [...se.listDepart].splice(3,se.listDepart.length);
        })

      }
       
      };


      async openSortFlight(){
        if(!this.loadpricedone || !this.loadalldone){
          this.gf.showToastWarning('Đang tìm vé máy bay tốt nhất. Xin quý khách vui lòng đợi trong giây lát!');
          return;
        }
        if(!(!this.emptyFilterResult && (this.listDepart && this.listDepart.length > 0))){
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

                

                this.sortairline = this.buttoniVIVUSelected;
                this.sortiVIVU();
                if(this.enableFlightFilter){
                  setTimeout(()=>{
                    this.filterItem();
                  },100)
                  
                }
              }
            },
            {
              text: "Giá thấp nhất",
              cssClass:"btn-minprice cls-border-bottom",
              handler: () => {
                this.buttonMinPriceSelected = !this.buttonMinPriceSelected;
                this.textsort = this.buttonMinPriceSelected ? "Giá thấp nhất" : "";
                this.buttonMinPriceSelected ? $(".btn-minprice > span").addClass('selected') : $(".btn-minprice > span").removeClass('selected');

                this.buttonMinTimeDepartSelected = false;
                this.buttonMaxTimeDepartSelected = false;
                this.buttonMinTimeReturnSelected = false;
                this.buttonMaxTimeReturnSelected = false;
                this.buttoniVIVUSelected = !this.buttonMinPriceSelected;
                if(this.enableFlightFilter){
                  this.filterItem().then(()=>{
                    this.sortAirline("priceup");
                  })
                  
                }else{
                  this.sortAirline("priceup");
                }
              }
            },
           
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
        if(!this.loadpricedone || !this.loadalldone){
          this.gf.showToastWarning('Đang tìm vé máy bay tốt nhất. Xin quý khách vui lòng đợi trong giây lát!');
          return;
        }
        if(!(!this.emptyFilterResult && (this.listDepart && this.listDepart.length > 0))){
          return;
        }
        this._flightService.itemFlightCache.step = this.step;
            //this._flightService.listAllFlightDepart = this.listDepartNoFilter;
           
            //this._flightService.listAllFlight = [...this.listDepartNoFilter];
            
            
           
            const modal: HTMLIonModalElement =
            await this.modalCtrl.create({
              component: FlightInternationalSearchfilterPage,
              componentProps: {
                aParameter: true,
              }
            });
          modal.present();
        
          modal.onDidDismiss().then((data: OverlayEventDetail) => {
            if(data && data.data){
              if(this._flightService.objectFilter){
                this.storage.get('flightinternationalfilterobject').then((data) => {
                  if(data){
                    this.storage.remove('flightinternationalfilterobject').then(()=>{
                      this.storage.set('flightinternationalfilterobject', this._flightService.objectFilter);
                    })
                  }else{
                    this.storage.set('flightinternationalfilterobject', this._flightService.objectFilter);
                  }
                })
                
                this.filterFlight();
              }else{

                if(this._flightService.objSearch){
                  // let obj= this._flightService.objSearch;
                  // let key ='listflight_' + obj.departDate + '_' + obj.returnDate + '_' + obj.departCode + '_' + obj.arrivalCode + '_' + obj.adult + '_' + obj.child + '_' + obj.infant;
                  // this.storage.get(key).then((data)=>{
                  //   if(data){
                  //     this.loadmultidata(data);
                  //   }else{
                  //     this.resetValue();
                  //     this.loadFlightData(obj, true);
                  //   }
                  // })
                  let obj= this._flightService.objSearch;
                  this.resetValue();
                  this.clearMinMaxPriceFilter();
                  setTimeout(()=> {
                    this.loadFlightData(obj, true);
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

      filterByListFlight(list, type) :Promise<any>{
        var se = this;
        return new Promise((resolve, reject) => {
      var se = this;
      var listFilter:any =[];
        let filterPrice = list;

        let maxValue = Math.round(Math.max(...this._flightService.listAllFlightInternational.map(o => o.fare.price), 0)/1000000);
        if(se._flightService.objectFilterInternational && se._flightService.objectFilterInternational.minprice && se._flightService.objectFilterInternational.maxprice && se._flightService.objectFilterInternational.maxprice!= maxValue){
          filterPrice = list.filter((filterpriceitem) => {
            return Math.round(filterpriceitem.fare.price *1/1000000) >= se._flightService.objectFilterInternational.minprice *1 && Math.round(filterpriceitem.fare.price *1/1000000) <= se._flightService.objectFilterInternational.maxprice *1;
          })
        }
      
        listFilter = [...filterPrice];

        
       

          if(se._flightService.objectFilterInternational.airlineSelected && se._flightService.objectFilterInternational.airlineSelected.length >0){
            let filterAirline = listFilter.filter((filterairlineitem) => {
              //return se._flightService.objectFilterInternational.airlineSelected.indexOf(filterairlineitem.departFlights[0].airlineCode) != -1 ||(filterairlineitem.returnFlights && filterairlineitem.returnFlights.length >0 && se._flightService.objectFilterInternational.airlineSelected.indexOf(filterairlineitem.returnFlights[0].airlineCode) != -1) ;
              return se._flightService.objectFilterInternational.airlineSelected.indexOf(filterairlineitem.departFlights[0].airline.replace(/\ /g,'').replace(/\./g,'').replace(/\'/g,'').replace(/\(/g,'').replace(/\)/g,'')) != -1 ||(filterairlineitem.returnFlights && filterairlineitem.returnFlights.length >0 && se._flightService.objectFilterInternational.airlineSelected.indexOf(filterairlineitem.returnFlights[0].airline.replace(/\ /g,'').replace(/\./g,'').replace(/\'/g,'').replace(/\(/g,'').replace(/\)/g,'')) != -1) ;
            })
            listFilter = [...filterAirline];
          }
          
          if( se._flightService.objectFilterInternational.stopSelected && se._flightService.objectFilterInternational.stopSelected != -1){
            let filterstop = listFilter.filter((filterstopitem) => {
           // return filterstopitem.departFlights.filter((itemd)=> {
                let stop = filterstopitem.departFlights[0].stops*1 +1;
                let stopreturn;
                if(filterstopitem.returnFlights && filterstopitem.returnFlights[0]){
                  stopreturn = filterstopitem.returnFlights[0].stops*1 +1;
                }
                if(se._flightService.objectFilterInternational.stopSelected == 3){
                  return true;
                }
                else if(se._flightService.objectFilterInternational.stopSelected == 1){
                  if(stopreturn){
                    return ( (stop ==1 && ( stopreturn && stopreturn ==1)) ? true : false) ;
                  }else {
                    return ( stop ==1 ? true : false) ;
                  }
                  
                }
                else{
                  if(this._flightService.itemFlightCache.roundTrip) {
                    return ( ((stop <= se._flightService.objectFilterInternational.stopSelected) && ( stopreturn && stopreturn <=se._flightService.objectFilterInternational.stopSelected) && !(stop ==1 && stopreturn==1)) ? true : false) ;
                  }else {
                    return ( (stop <= se._flightService.objectFilterInternational.stopSelected && stop !=1) ? true : false) ;
                  }
                }
            })
            listFilter = [...filterstop];
          }

          se.filterItemOverlay(listFilter).then((data)=>{
            resolve(data);
          })

         
    })
  }

    filterItemOverlay(listFilter) :Promise<any>{
      var se = this;
      return new Promise((resolve, reject) => {
        let maxOverlayValue = Math.round(Math.max(...this._flightService.listAllFlightInternational.map(o => o.fare.maxDepartTime),...this._flightService.listAllFlightInternational.map(o => o.fare.maxReturnTime))/60);
        if(se._flightService.objectFilterInternational && se._flightService.objectFilterInternational.maxoverlay && se._flightService.objectFilterInternational.maxoverlay != maxOverlayValue){
          let filterOverlay = listFilter.filter((filteroverlayitem) => {
            return se._flightService.itemFlightCache.roundTrip ? (filteroverlayitem.fare.minDepartTime <= se._flightService.objectFilterInternational.maxoverlay *60
             && filteroverlayitem.fare.minReturnTime  <= se._flightService.objectFilterInternational.maxoverlay *60) : filteroverlayitem.fare.minDepartTime <= se._flightService.objectFilterInternational.maxoverlay *60;
          })

          if(filterOverlay && filterOverlay.length >0){
           filterOverlay.forEach((item) => {
            let countitemd = 0,countitemr = 0;
              item.departFlights.forEach((itemd) => { 
                  let totaloverlay = itemd.details.reduce((total,b)=>{ return total + (b.layover || 0); }, 0);
                  itemd.isHiden = totaloverlay > se._flightService.objectFilterInternational.maxoverlay *60;
                  if(!itemd.isHiden){
                    countitemd++;
                  }
              })
              item.hideDivExpandDepart = countitemd < 2;
              
              if(item.returnFlights && item.returnFlights.length >0){
                item.returnFlights.forEach((itemr) => { 
                  let totaloverlay = itemr.details.reduce((total,b)=>{ return total + (b.layover || 0); }, 0);
                  itemr.isHiden = totaloverlay > se._flightService.objectFilterInternational.maxoverlay *60;
                  if(!itemr.isHiden){
                    countitemr++;
                  }
                })
                item.hideDivExpandReturn = countitemr < 2;
              }
              
              if(this._flightService.itemFlightCache.roundTrip){
                item.isHidenTwoWay = (countitemd == 0 || countitemr ==0);
              }else {
                item.isHidenTwoWay = countitemd == 0;
              }
              
            })
          }
          
          listFilter = [...filterOverlay];
        }else {
          if(listFilter && listFilter.length >0){
            listFilter.forEach((item) => {
               item.departFlights.forEach((itemd) => { 
                   itemd.isHiden = false;
               })
               item.hideDivExpandDepart = false;

               item.returnFlights.forEach((itemr) => { 
                itemr.isHiden = false;
              })
              item.hideDivExpandReturn = false;
              item.isHidenTwoWay = false;
             })
           }

        }

        resolve(listFilter);
      })
    }
  
      filterItem() :Promise<any>{
        var se = this;
        return new Promise((resolve, reject) => {
          if( (se.listDepart && se.listDepart.length >0) || (se.listReturn && se.listReturn.length >0) ){
            const totalItemDepartBeforeFilter = (se.listDepart ? se.listDepart.length : 0);
            se.zone.run(()=>{
              if(se._flightService.objectFilterInternational &&
                (se._flightService.objectFilterInternational.minprice*1 != 0
                || se._flightService.objectFilterInternational.maxprice*1 != 200
                || se._flightService.objectFilterInternational.airlineSelected.length >0
                || se._flightService.objectFilterInternational.stopSelected.length >0)
                ){
                if(se.listDepart && se.listDepart.length >0){
                  se.filterByListFlight([...se.listDepart], 'depart').then((datafilter)=>{
                    se.listDepartFilter = datafilter.filter((item)=>{return !item.isHidenTwoWay}); 
                    setTimeout(()=>{
                      se.mapListAfterFilter(totalItemDepartBeforeFilter);
                      resolve(true);
                    },200)
                   
                  });
                }
              }else{
                se.listDepartFilter =se.listDepart;
                se.mapListAfterFilter(totalItemDepartBeforeFilter);
                resolve(true);
              }
             
             })
            
           }

           
        })
       
      }

      mapListAfterFilter(totalItemDepartBeforeFilter){
        let se = this;
        let totalItemDepartAfterFilter = (se.listDepartFilter ? se.listDepartFilter.length : 0);
              se.enableFlightFilter = (totalItemDepartAfterFilter != totalItemDepartBeforeFilter) ? 1 : 0;
              if(se.listDepartFilter && se.listDepartFilter.length > 0) {
                se.bestpricedepart = se.listDepartFilter.length >=2 ?  [...se.listDepartFilter].splice(0,2) : [...se.listDepartFilter];
                if(se.listDepartFilter.length >2){
                  let listotherpricedepart = [...se.listDepartFilter].splice(2,se.listDepartFilter.length);
                  se.sortFlightsByPrice(listotherpricedepart).then((data)=>{
                    se.bestpricedepart = [...se.bestpricedepart, data.splice(0,1)[0]];

                    let listotherpricedepartmustreorder = [...data];
                    se.otherpricedepart = [...listotherpricedepartmustreorder];
                  });
                  
  
                  
                }else{
                  se.otherpricedepart = [];
                }
                se.countFilterResult = se.listDepartFilter.length;
                se.emptyFilterResult = false;
              }else {
                se.countFilterResult = 0;
                se.emptyFilterResult = true;
              }
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
              if(!se._flightService.itemFlightCache.isInternationalFlight){
                se._flightService.itemFlightCache.isExtenalDepart = false;
                se._flightService.itemFlightCache.isExtenalReturn = false;
                se._flightService.itemFlightCache.isApiDirect = false;
                if(se._flightService.itemFlightCache){
                  se._flightService.itemFlightCache.discountpromo = 0;
                  se._flightService.itemFlightCache.promotionCode = "";
                  se._flightService.itemFlightCache.hasvoucher = '';
                }
                se._flightService.itemChangeTicketFlight.emit(1);
                se.navCtrl.navigateForward('/flightsearchresult');
              }else{
                if(data.data == 2 && this._flightService.classSelected){
                  obj.classSelected = this._flightService.classSelected;
                }
                se.resetValue();
                se.title = obj.title;
                se.subtitle = obj.subtitle;
                se.dayDisplay = obj.dayDisplay;
                se.titlereturn = obj.titleReturn;
                se.dayReturnDisplay = obj.dayReturnDisplay;
                se.subtitlereturn = obj.subtitleReturn;
                se.storage.get('flightinternationalfilterobject').then((data)=>{
                  if(data){
                    se._flightService.objectFilter = data;
                    se.clearMinMaxPriceFilter();
                  }
                })
                se.loadFlightData(obj, true);
              }
            
            }else if(!data.data || data.role=='backdrop'){
              this.rollbackObjectSearch();
            }
          })
      }

      rollbackObjectSearch(){
        let se = this;
        let obj = se._flightService.objSearch;
        se._flightService.itemFlightCache.roundTrip = obj.roundTrip;
            se._flightService.itemFlightCache.checkInDate = obj.departDate;
            se._flightService.itemFlightCache.checkOutDate = obj.returnDate;
            se._flightService.itemFlightCache.checkInDisplayMonth = moment(obj.departDate).format("DD") + " tháng " + moment(obj.departDate).format("MM") + ", " + moment(obj.departDate).format("YYYY");
            se._flightService.itemFlightCache.checkOutDisplayMonth = moment(obj.returnDate).format("DD") + " tháng " + moment(obj.returnDate).format("MM") + ", " + moment(obj.returnDate).format("YYYY");
            se._flightService.itemFlightCache.adult = obj.adult;
            se._flightService.itemFlightCache.child = obj.child;
            se._flightService.itemFlightCache.infant = obj.infant;
            se._flightService.itemFlightCache.pax = obj.adult + (obj.child ? obj.child :0)+ (obj.infant ? obj.infant : 0);
            se._flightService.itemFlightCache.arrchild = obj.arrchild;
            se._flightService.itemFlightCache.departCity = obj.departCity;
            se._flightService.itemFlightCache.departCode = obj.departCode;
            se._flightService.itemFlightCache.departAirport = obj.departAirport;
            se._flightService.itemFlightCache.returnCity = obj.returnCity;
            se._flightService.itemFlightCache.returnCode = obj.arrivalCode;
            se._flightService.itemFlightCache.returnAirport = obj.returnAirport;
            se._flightService.itemFlightCache.step = 1;
            se._flightService.itemFlightCache.departTimeDisplay = se.gf.getDayOfWeek(obj.departDate).dayname + ", " + moment(obj.departDate).format("DD") + " thg " + moment(obj.departDate).format("MM");
            se._flightService.itemFlightCache.returnTimeDisplay = se.gf.getDayOfWeek(obj.returnDate).dayname + ", " + moment(obj.returnDate).format("DD") + " thg " + moment(obj.returnDate).format("MM");
    
            se._flightService.itemFlightCache.departInfoDisplay = "Chiều đi" + " · " + se.gf.getDayOfWeek(obj.departDate).dayname + ", " + moment(obj.departDate).format("DD") + " thg " + moment(obj.departDate).format("MM");
            se._flightService.itemFlightCache.returnInfoDisplay = "Chiều về" + " · " + se.gf.getDayOfWeek(obj.returnDate).dayname + ", " + moment(obj.returnDate).format("DD") + " thg " + moment(obj.returnDate).format("MM");
    
            se._flightService.itemFlightCache.departPaymentTitleDisplay = se.gf.getDayOfWeek(obj.departDate).daynameshort + ", " + moment(obj.departDate).format("DD-MM")+ " · " + obj.departCode + " → " +obj.returnCode+ " · ";
            se._flightService.itemFlightCache.returnPaymentTitleDisplay = se.gf.getDayOfWeek(obj.returnDate).daynameshort + ", " + moment(obj.returnDate).format("DD-MM")+ " · "+ obj.returnCode + " → " +obj.departCode+ " · ";

            se._flightService.itemFlightCache.checkInDisplay = se.getDayOfWeek(obj.departDate).dayname +", " + moment(obj.departDate).format("DD") + " thg " + moment(obj.departDate).format("MM");
            se._flightService.itemFlightCache.checkOutDisplay = se.getDayOfWeek(obj.returnDate).dayname +", " + moment(obj.returnDate).format("DD") + " thg " + moment(obj.returnDate).format("MM");
            
            se.checkInDisplayMonth = se.getDayOfWeek(obj.departDate).dayname +", " + moment(obj.departDate).format("DD") + " thg " + moment(obj.departDate).format("MM");
            se.checkOutDisplayMonth = se.getDayOfWeek(obj.returnDate).dayname +", " + moment(obj.returnDate).format("DD") + " thg " + moment(obj.returnDate).format("MM");
            //se._flightService.itemFlightCache.isInternationalFlight = obj.isInternationalFlight;
            if(se._flightService.listAirport && se._flightService.listAirport.length >0){
              let placeFrom = se._flightService.listAirport.filter((itemairport) => {return itemairport.code == obj.departCode});
              let placeTo = se._flightService.listAirport.filter((itemairport) => {return itemairport.code == obj.arrivalCode});
              if(placeFrom && placeFrom.length >0 && placeTo && placeTo.length >0){
                
                se._flightService.itemFlightCache.isExtenalDepart = !placeFrom[0].internal;
                se._flightService.itemFlightCache.isExtenalReturn = !placeTo[0].internal;
                se._flightService.itemFlightCache.isInternationalFlight = !placeFrom[0].internal || !placeTo[0].internal;
                if(!se._flightService.itemFlightCache.isInternationalFlight){
                    se._flightService.itemFlightCache.isInternationalFlight = false;
                    se._flightService.itemFlightCache.isExtenalDepart = false;
                    se._flightService.itemFlightCache.isExtenalReturn = false;
                }
              }else {
                se._flightService.itemFlightCache.isInternationalFlight = false;
                se._flightService.itemFlightCache.isExtenalDepart = false;
                se._flightService.itemFlightCache.isExtenalReturn = false;
              }
            }else{
              se._flightService.itemFlightCache.isInternationalFlight = false;
              se._flightService.itemFlightCache.isExtenalDepart = false;
              se._flightService.itemFlightCache.isExtenalReturn = false;
            }
      }

      resetValue(){
        var se = this;
        se.zone.run(()=>{
          se.loadpricedone = false;
          se.loadalldone = false;
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
          se.listAirlines=[];
          
          se.listDepartAirlinesReturn = [];
          se.listReturnAirlinesReturn = [];
          se.listDepartNoFilter=[];
        
          se.listDepartFilter = [];
          
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
          se._flightService.objectFilterInternational = null;
          se.listStops = [];
          se._flightService.listStops = [];
          se.emptyFilterResult = false;

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
          se.countFilterResult =0;
          se._voucherService.totalDiscountPromoCode =0;
          se._voucherService.listPromoCode =[];
          se._voucherService.voucherSelected = [];
          se._voucherService.listObjectPromoCode = [];
        })
        
      }

      async showQuickBack(){
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


       /**
   * Hàm bắt sự kiện click chọn ngày trên lịch bằng jquery
   * @param e biến event
   */
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

    checklunar(s) {
        return s.indexOf('Mùng') >= 0;
    }

      getDayOfWeek(date) {
         let d = moment(date).format('dddd');
          let dayname ='', daynameshort ='';
          switch (d) {
            case "Monday":
              dayname = "Thứ 2";
              daynameshort="T2";
              break;
            case "Tuesday":
              dayname = "Thứ 3";
              daynameshort="T3";
              break;
            case "Wednesday":
              dayname = "Thứ 4";
              daynameshort="T4";
              break;
            case "Thursday":
              dayname = "Thứ 5";
              daynameshort="T5";
              break;
            case "Friday":
              dayname = "Thứ 6";
              daynameshort="T6";
              break;
            case "Saturday":
              dayname = "Thứ 7";
              daynameshort="T7";
              break;
            default:
              dayname = "Chủ nhật";
              daynameshort="CN";
              break;
          }
        return { dayname: dayname,daynameshort: daynameshort  }
      }

      doRefresh(event){
        if(!this.loadpricedone|| !this.loadalldone){
          this.gf.showToastWarning('Đang tìm vé máy bay tốt nhất. Xin quý khách vui lòng đợi trong giây lát!');
          return;
        }
        let obj= this._flightService.objSearch;
        this.zone.run(()=>{
          this.resetValue();
          this.clearMinMaxPriceFilter();
        })
       
        this.loadFlightData(obj, true);
       
      }

     public scrollSearchFlight = (event: any) => {
        var se = this;
          let el = window.document.getElementsByClassName('div-depart-flight-choice');
          //let el1 = window.document.getElementsByClassName('div-depart-flight-choice');
          if(el.length >0){
            //console.log(event.detail.scrollTop)
           
              if(event.detail.scrollTop > 100){
                if(se.step ==3){
                  if(!el[0].classList.contains("stick-css")){
                    el[0].classList.add('stick-css');
                  }
                }
              }else{
                el[0].classList.remove('stick-css');
              }
          }
      }

      closecalendar(){
        this.modalCtrl.dismiss();
        
      }
  
      showLowestPrice(event){
        setTimeout(()=>{
          let obj= this._flightService.objSearch;
          this.showlowestprice = event.target.checked;
          if(obj.departCode && obj.arrivalCode){
            if(this.showlowestprice){
              $('.price-calendar-text').removeClass('price-calendar-disabled').addClass('price-calendar-visible');
            }else{
              $('.price-calendar-text').removeClass('price-calendar-visible').addClass('price-calendar-disabled');
            }
          }else{
            this.gf.showToastWarning('Vui lòng chọn điểm khởi hành và điểm đến trước khi xem lịch giá rẻ.');
          }
        },100)
      }
  
      loadCalendarPrice(){
        let obj= this._flightService.objSearch;
        if(obj.departCode && obj.arrivalCode){
          let url = C.urls.baseUrl.urlFlight + "gate/apiv1/GetHotDealCalendar?fromplace="+obj.departCode+"&toplace="+obj.arrivalCode+"&getincache=false";
          this.gf.RequestApi("GET", url, {
            "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            'Content-Type': 'application/json; charset=utf-8'
            }, {}, "homeflight", "showCalendarPrice").then((data) =>{
              if(data){
                let key = "listHotDealCalendar_"+obj.departCode+"_"+obj.arrivalCode;
                this.storage.set(key, data);
                if(data && data.departs && data.departs.length >0){
  
                  if(obj.roundTrip){//2 chiều
                      this.renderCalenderPrice(1, data.departs, data.arrivals);
                  }else{//1 chiều
                    this.renderCalenderPrice(2, data.departs, null);
                  }
                }
              }
            })
        }
      }
  
      renderCalenderPrice(type, departs, arrivals){
        var se = this;
        let obj= se._flightService.objSearch;
        try {
          if($('.month-box').length >0){
            let diffday =moment(obj.returnDate).diff(obj.departDate, "days");
            for (let index = 0; index < $('.month-box').length; index++) {
              const elementMonth:any = $('.month-box')[index];
              let objtextmonth = elementMonth.children[0].textContent.replace('Tháng ','');
              let monthstartdate:any = objtextmonth.trim().split(",")[0];
              let yearstartdate:any = objtextmonth.trim().split(",")[1];
              let textmonth = moment(new Date(yearstartdate, monthstartdate - 1, 1)).format('YYYY-MM');
              
              if(objtextmonth && objtextmonth.length >0){
                let listdepartinmonth = departs.filter((item) => { return moment(item.departTime).format('YYYY-MM') == textmonth});
                let listreturninmonth:any;
                if(obj.roundTrip){
                  listreturninmonth = arrivals.filter((item) => { return moment(item.departTime).format('YYYY-MM') == textmonth});
                }
                
                let listdayinmonth = elementMonth.children[1].children[0].children[0].children;
                if(listdayinmonth && listdayinmonth.length >0){
                    for (let j = 0; j < listdayinmonth.length; j++) {
                      const elementday = listdayinmonth[j];
                      if(elementday && elementday.textContent){
                        let fday:any = elementday.textContent;
                        let fromdate = moment(new Date(yearstartdate, monthstartdate - 1, fday)).format('YYYY-MM-DD');
                        let todate = moment(fromdate).add(diffday ,'days').format('YYYY-MM-DD');
                        if(fromdate){
                            if(type ==1){
                              let mindepartvalue = Math.min(...listdepartinmonth.map(o => o.price));
                              let minreturnvalue = Math.min(...listreturninmonth.map(o => o.price));
                              let minvalue = mindepartvalue + minreturnvalue;
  
                              let pricefromdate =0;
                              let itemfromdate = listdepartinmonth.filter((d)=>{ return moment(d.departTime).format('YYYY-MM-DD') == fromdate });
                              if(itemfromdate && itemfromdate.length >0){
                                pricefromdate = itemfromdate[0].price;
                              }
                              let pricetodate =0;
                              let itemtodate = listreturninmonth.filter((d)=>{ return moment(d.departTime).format('YYYY-MM-DD') == todate });
                              if(itemtodate && itemtodate.length >0){
                                pricetodate = itemtodate[0].price;
                              }
                              
                              if(pricefromdate && pricetodate){
                                let totalpriceitem = pricefromdate + pricetodate;
                                let totalprice = (totalpriceitem)/1000 >= 1000 ? se.gf.convertNumberToString( Math.round(totalpriceitem/1000)) : Math.round((totalpriceitem/1000));
                                totalprice = totalprice +"K";
                                //giá min
                                if(minvalue == totalpriceitem){
                                  $(elementday.children[0]).append(`<span class='price-calendar-text price-calendar-disabled min-price'>${totalprice}</span>`);
                                }else{
                                  $(elementday.children[0]).append(`<span class='price-calendar-text price-calendar-disabled'>${totalprice}</span>`);
                                }
                                
                              }
                            }else{
                              let mindepartvalue = Math.min(...listdepartinmonth.map(o => o.price));
                              let minvalue = mindepartvalue;
  
                              let pricefromdate =0;
                              let itemfromdate = listdepartinmonth.filter((d)=>{ return moment(d.departTime).format('YYYY-MM-DD') == fromdate });
                              if(itemfromdate && itemfromdate.length >0){
                                pricefromdate = itemfromdate[0].price;
                              }
  
                              let totalprice = pricefromdate/1000 >= 1000 ? se.gf.convertNumberToString( Math.round(pricefromdate / 1000)) : Math.round(pricefromdate / 1000);
                                totalprice = totalprice +"K";
                              if(pricefromdate){
  
                                //giá min
                                if(minvalue == pricefromdate){
                                  $(elementday.children[0]).append(`<span class='price-calendar-text m-l-5 price-calendar-disabled min-price'>${totalprice}</span>`);
                                }else{
                                  $(elementday.children[0]).append(`<span class='price-calendar-text m-l-5 price-calendar-disabled'>${totalprice}</span>`);
                                }
                                
                              }
                            }
                        }
                      }
                      
                    }
                }
                
              }
            }
            if(this.showlowestprice){
              $('.price-calendar-text').removeClass('price-calendar-disabled').addClass('price-calendar-visible');
            }else{
              $('.price-calendar-text').removeClass('price-calendar-visible').addClass('price-calendar-disabled');
            }
          }
        } catch (error) {
          console.log('Lỗi jquery khi show lịch giá rẻ: '+ error);
        }
        
        
      }
  
      showCalendarCinCout(){
        var se = this;
          if($('.div-show-calendar-cincout').hasClass('calendar-visible')){
            $('.div-show-calendar-cincout').removeClass('calendar-visible').addClass('calendar-disabled');
          }else{
            $('.div-show-calendar-cincout').removeClass('calendar-disabled').addClass('calendar-visible');
          }
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

      async openFlightSelectTimePriority(){
        var se = this;
        if(!se.loadpricedone){
          se.gf.showToastWarning('Đang tìm vé máy bay tốt nhất. Xin quý khách vui lòng đợi trong giây lát!');
          return;
        }
        setTimeout(()=>{
          se._flightService.itemAllFlightCount.emit(this.listDepart.length + this.listReturn.length);
        },350)
        
        const modal: HTMLIonModalElement =
        await se.modalCtrl.create({
          component: FlightselecttimepriorityPage,
        });
        modal.present();

        modal.onDidDismiss().then((data: OverlayEventDetail) => {
          if(data && data.data){
            let obj = this._flightService.objSearch;
            
            if(obj){
              obj.timeDepartPriority = data.data.timeDepartPriority;
              obj.timeReturnPriority = data.data.timeReturnPriority;
              this.zone.run(()=>{
                this.resetValue();
                this.clearMinMaxPriceFilter();
              })
             
              this.loadFlightData(obj, true);
              //obj.timeDepartPriority ? obj.timeDepartPriority : "") : obj.timeReturnPriority ? obj.timeReturnPriority
            }
          }
        })
    }

    expandDiv(itemFlight, _idxd, type){
        let divCollapse, strid='';
        if(type == 1){
          divCollapse = $('#itemf_'+_idxd);
          strid = '#itemf_'+_idxd;
        } else if(type == 2){
          divCollapse = $('#itemfo_'+_idxd);
          strid = '#itemfo_'+_idxd;
        } else if(type == 3){
          divCollapse = $('#itemfr_'+_idxd);
          strid = '#itemfr_'+_idxd;
        } else if(type == 4){
          divCollapse = $('#itemfor_'+_idxd);
          strid = '#itemfor_'+_idxd;
        }
        //var divCollapse = (type == 1 ? $('#itemf_'+_idxd) : $('#itemfo_'+_idxd));
        if(divCollapse && divCollapse.length >0){
          let arrExpand = divCollapse.siblings();
          
          if((itemFlight.expanddivflight && type <3) || (itemFlight.expanddivflightreturn && type >=3)){
            divCollapse.removeClass('div-expand').addClass('div-collapse');

            if(arrExpand && arrExpand.length >1){
              for (let index = 0; index < arrExpand.length; index++) {
                const elementChild = arrExpand[index];
                if($(elementChild).hasClass('div-expand')){
                  $(elementChild).removeClass('div-expand').addClass('div-collapse');
                }
                
              }
            }
          }else{
            divCollapse.removeClass('div-collapse').addClass('div-expand');

            if(arrExpand && arrExpand.length >1){
              for (let index = 0; index < arrExpand.length; index++) {
                const elementChild = arrExpand[index];
                if($(elementChild).hasClass('div-collapse')){
                  $(elementChild).removeClass('div-collapse').addClass('div-expand');
                }
              }
            }
          }
          
          
        }
        this.zone.run(()=>{
          if(type < 3){
            itemFlight.expanddivflight = !itemFlight.expanddivflight;
          }else{
            itemFlight.expanddivflightreturn = !itemFlight.expanddivflightreturn;
          }
          
        });
        //this.expanddivflight = true;
       // this.scrollToTopGroupReview(1);
    }
    
    changeFlight(itemFlight, itemDeparture, type, idx) {
      if(itemDeparture.ischeck){
        return;
      }
      
      let arrCheck = type ==1 ? itemFlight.departFlights : itemFlight.returnFlights;
     
        this.zone.run(()=>{
          setTimeout( ()=> {
            arrCheck.forEach(elementReturn => {
              if(itemDeparture.id != elementReturn.id){
                elementReturn.ischeck = false;
              }else {
                elementReturn.ischeck = true;
              }
            })
          }, 0);

          setTimeout( ()=> {
            this.expandDiv(itemFlight, idx, type);
          }, 10);

        })
     
        
        
    }

    async showFlightInfo(itemFlight, item, index) {
      this._flightService.itemFlightInternationalInfo = itemFlight;
      this._flightService.itemFlightInternational = item;
      this._flightService.indexFlightInternational = index;
      this._flightService.showFlightInfoFromSearchPage = true;
    
        let itemd = item.departFlights.filter((id)=>{return id.ischeck});
        let itemr = item.returnFlights.filter((ir)=>{return ir.ischeck});
        if(itemd && itemd.length >0 && itemr && itemr.length >0){
          this._flightService.itemFlightCache.itemFlightInternationalDepart = itemd[0];
          this._flightService.itemFlightCache.itemFlightInternationalReturn = itemr[0];
        } else if (itemd && itemd.length >0){
          this._flightService.itemFlightCache.itemFlightInternationalDepart = itemd[0];
        }
      
      
      const modal: HTMLIonModalElement =
        await this.modalCtrl.create({
          component: FlightInfoInternationalPage,
        });
        modal.present();
    }

    async showDepartureDetail(itemFlight) {
      this._flightService.itemFlightInternationalDepartureDetail = itemFlight;
      const modal: HTMLIonModalElement =
        await this.modalCtrl.create({
          component: FlightDepartureDetailInternationalPage,
        });
        modal.present();
    }

    confirm(item){
      if(item.isInternal){
        this._flightService.itemFlightInternational = item;
        let itemd = item.departFlights.filter((id)=>{return id.ischeck});
        let itemr = item.returnFlights.filter((ir)=>{return ir.ischeck});
        if(itemd && itemd.length >0 && itemr && itemr.length >0){
          this.setFlightMoreInfo(itemd[0]);
          this.setFlightMoreInfo(itemr[0]);
          this._flightService.itemFlightCache.departFlight = itemd[0];
          this._flightService.itemFlightCache.returnFlight = itemr[0];
        } else if (itemd && itemd.length >0){
          this.setFlightMoreInfo(itemd[0]);
          this._flightService.itemFlightCache.departFlight = itemd[0];
        }
        this.selectInternalTicket().then((data)=>{
          let se = this;
          se.gf.hideLoading();
          if(data && data.id){
            se._flightService.itemFlightCache.dataTicket = data;
            se._flightService.itemFlightCache.dataBooking = data.detail;
            
              se._flightService.itemFlightCache.reservationId = data.id;
              se._flightService.itemFlightCache.resNo = data.resNo;
              se._flightService.itemFlightCache.step = 3;
              

              se.storage.get("itemFlightCache").then((data)=>{
                if(data){
                  se.storage.remove("itemFlightCache").then(()=>{
                    se.storage.set("itemFlightCache", JSON.stringify(se._flightService.itemFlightCache));
                  })
                }else{
                  se.storage.set("itemFlightCache", JSON.stringify(se._flightService.itemFlightCache));
                }
              })
              se._flightService.publicItemFlightReloadInfo(1);

              se._flightService.itemFlightCache.departSeatChoice = [];
              se._flightService.itemFlightCache.returnSeatChoice = [];
              se._flightService.itemFlightCache.listdepartseatselected="";
              se._flightService.itemFlightCache.listreturnseatselected ="";
              se._flightService.itemFlightCache.departSeatChoiceAmout = 0;
              se._flightService.itemFlightCache.returnSeatChoiceAmout = 0;
              se.clearServiceInfo();
              let _totalprice =  se._flightService.itemFlightCache.departFlight.totalPrice + (se._flightService.itemFlightCache.returnFlight ? se._flightService.itemFlightCache.returnFlight.totalPrice : 0);
              let itemcache = se._flightService.itemFlightCache;
              se._flightService.itemFlightCache.totalPrice = _totalprice;
              se.gf.logEventFirebase('', se._flightService.itemFlightCache, 'flightsearchresultinternational', 'confirm', 'Flights');

              se._flightService.itemFlightCache.isApiDirect = true;
              se.navCtrl.navigateForward('/flightadddetails');
              se.stoprequest = true;
          }else{
            se.showAlertRefreshPrice('Vé máy bay bạn chọn hiện không còn. Vui lòng chọn lại!');
          }
          
        })
        
      }else{
        this.gf.showLoading();
        let itemd = item.departFlights.filter((id)=>{return id.ischeck});
        let itemr = item.returnFlights.filter((ir)=>{return ir.ischeck});
        if(itemd && itemd.length >0 && itemr && itemr.length >0){
          this._flightService.itemFlightCache.itemFlightInternationalDepart = itemd[0];
          this._flightService.itemFlightCache.itemFlightInternationalReturn = itemr[0];
        } else if (itemd && itemd.length >0){
          this._flightService.itemFlightCache.itemFlightInternationalDepart = itemd[0];
        }

        let url = C.urls.baseUrl.urlFlightInt + "api/bookings/check-available";
        let body = {
          DepartId: itemd[0].id,
          FareId: item.fare.key,
          ReturnId: itemr && itemr.length >0 ? itemr[0].id : '',
          SessionId: item.sessions,
          source: 8
        }
         

        this.gf.RequestApi('POST', url, {}, body, 'flightsearchresultinternational', 'check-available').then((data) => {
          if(data.success && data.data) {
           
            let urlbkg = C.urls.baseUrl.urlFlightInt + "api/bookings";
            this.gf.RequestApi('POST', urlbkg, {}, body, 'flightsearchresultinternational', 'bookings').then((data) => {
              if(data.success && data.data) {
               this.gf.hideLoading();
               this._flightService.itemFlightCache.dataBookingInternational = data.data;
               this._flightService.itemFlightInternational = item;
               this._flightService.itemFlightCache.reservationId = data.data.id;

               this._flightService.itemFlightInternational.hasvoucher = false;
                this._flightService.itemFlightInternational.discountpromo = 0;
                this._flightService.itemFlightInternational.promotionCode = "";
                this._voucherService.publicClearVoucherAfterPaymentDone(1);
                this.gf.logEventFirebase('', this._flightService.itemFlightCache, 'flightsearchresultinternational', 'begin_checkout', 'Flights');
               this.navCtrl.navigateForward('/flightadddetailsinternational');
              }else{

                this.gf.showAlertMessageOnly('Phiên truy cập đã hết hiệu lực. Vui lòng tải lại trang và thử lại.').then(()=>{
                this.zone.run(()=>{
                  this.resetValue();
                })
                this.loadFlightData(this._flightService.objSearch, true);
              });
              this.gf.hideLoading();
              }
            })
          }else{
            this.gf.showAlertMessageOnly('Phiên truy cập đã hết hiệu lực. Vui lòng tải lại trang và thử lại.').then(()=>{
              this.zone.run(()=>{
                this.resetValue();
              })
              this.loadFlightData(this._flightService.objSearch, true);
            });
            this.gf.hideLoading();
          }
        })

      }
    }

    sortiVIVU() {
      let se = this;
      se.listDepart = [...se._flightService.listAllFlightInternational];
      if(se.listDepart && se.listDepart.length > 0) {
        se.bestpricedepart = se.listDepart.length >=3 ? [...se.listDepart].splice(0,3) : [...se.listDepart];
        let listotherpricedepart = [...se.listDepart].splice(3,se.listDepart.length);
        se.otherpricedepart = [...listotherpricedepart];
        se.loadpricedone = true;
      }
    }

    selectInternalTicket() :Promise<any>{
      var se = this;
      se.canselect = false;
      return new Promise((resolve, reject) => {
          let obj = se._flightService.objSearch;
          let objdepart = se._flightService.itemFlightCache.departFlight;
          let objreturn = obj.roundTrip ? se._flightService.itemFlightCache.returnFlight : null;
          let flighttype = obj.roundTrip ? 2 : 1;
          let selectFlightURL ="";
          if(obj.roundTrip){
            selectFlightURL = C.urls.baseUrl.urlFlight +'gate/apiv1/InitBooking?token=Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09&from='+ obj.departCode +'&to='+obj.arrivalCode+'&departdate='+ obj.departDate +'&returndate='+ obj.returnDate +'&adult='+ obj.adult+'&child='+ obj.child+'&infant='+ obj.infant+'&flighttype='+flighttype;
            selectFlightURL +='&departFlightId='+objdepart.id+'&returnFlightId='+objreturn.id+'&departTicketType='+(objdepart.airlineCode == "VietJetAir" ? objdepart.ticketType : objdepart.ticketClass)+'&returnTicketType=' +(objreturn.airlineCode == "VietJetAir" ? objreturn.ticketType: (objreturn.ticketClass||objreturn.ticketType))+'&source=8&memberId=' +se.jti;
          }else{
            selectFlightURL = C.urls.baseUrl.urlFlight +'gate/apiv1/InitBooking?token=Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09&from='+ obj.departCode +'&to='+obj.arrivalCode+'&departdate='+ obj.departDate +'&returndate='+ obj.returnDate +'&adult='+ obj.adult+'&child='+ obj.child+'&infant='+ obj.infant+'&flighttype='+flighttype;
            selectFlightURL +='&departFlightId='+objdepart.id+"&returnFlightId=''&departTicketType="+(objdepart.airlineCode == "VietJetAir" ? objdepart.ticketType : objdepart.ticketClass)+"&returnTicketType=''"+'&source=8&memberId=' +se.jti;
          }
           
  
          let urlPath = selectFlightURL;
          let headers = {
            "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            'Content-Type': 'application/json; charset=utf-8'
          };
          this.gf.RequestApi('POST', urlPath, headers, {}, 'flightSearchResultinternational', 'selectInternalTicket').then((data)=>{

          if (data) {
            let jsondata = data;
            if(jsondata.error){
                resolve(false);
            }else{
                resolve(jsondata);
            }
            
          }
        })
      })
      
    }

    setFlightMoreInfo(element){
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
    }
}
