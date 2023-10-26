import { GlobalFunction } from './../providers/globalfunction';
import { NavController, Platform ,ModalController} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Component, NgZone, OnInit } from '@angular/core';

import { C } from '../providers/constants';
import * as moment from 'moment';
import { flightService } from '../providers/flightService';
import { ValueGlobal } from './../providers/book-service';
import { FlightquickbackPage } from '../flightquickback/flightquickback.page';
import { CustomAnimations } from '../providers/CustomAnimations';
import { Storage } from '@ionic/storage';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-mytripaymentflightpayoo',
  templateUrl: './mytripaymentflightpayoo.page.html',
  styleUrls: ['./mytripaymentflightpayoo.page.scss'],
})
export class MytripaymentflightpayooPage implements OnInit {

  bookingCode; stt; text; qrimg; BillingCode;
  intervalID: any;
  allowCheck: any = true;
  allowCheckHoldTicket: boolean = true;
  private _email: any;
  constructor(private navCtrl:NavController, public gf: GlobalFunction,
    private activatedRoute: ActivatedRoute,private _flightService: flightService,
    private platform: Platform, public valueGlobal: ValueGlobal,private modalCtrl: ModalController,
    private storage: Storage,
    private _platform: Platform,
    private _calendar: Calendar,
    private zone: NgZone,) { 
      
    }

  ngOnInit() {
    this.bookingCode = this.activatedRoute.snapshot.paramMap.get('code');
    this.stt= this.activatedRoute.snapshot.paramMap.get('stt');
    this._email = this._flightService.itemFlightCache.email;
    if (this.stt==0) {
      this.BillingCode=this._flightService.itemFlightCache.BillingCode;
    }
    else
    {
      this.qrimg=this._flightService.itemFlightCache.qrimg;
      this.intervalID = setInterval(() => {
            clearInterval(this.intervalID);
            //this.checkqrcode();
            this.callCheckPayment();
      }, 1000 * 5);

      setTimeout(() => {

        clearInterval(this.intervalID);

      }, 60000 * 9.1);
    }

    this.getSummaryBooking().then((databkg:any) => {
      this._flightService.itemFlightCache.dataSummaryBooking = databkg;
    })   
  }
  goback()
  {
    if (this.stt==1) {
      clearInterval(this.intervalID);
    }
    this.allowCheck = false;
    this.navCtrl.back();
  }
  next()
  {
    var se = this;
      clearInterval(this.intervalID);
      se.checkqrcode();
      se.allowCheck = false;
  }

  checkHoldTicket(){
    var se = this, res = false;
    let url = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+se.bookingCode;
    
        se.callCheckHoldTicket().then((check) => {
          if (!check && se.allowCheckHoldTicket) {
              res = false;
              setTimeout(() => {
                se.checkHoldTicket();
              }, 3000);
          }else{
            let startDate = moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');
            let endDate = moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD');
            if(check){
              se.getSummaryBooking().then((databkg:any) => {
                se._flightService.itemFlightCache.dataSummaryBooking = databkg;
              })
              if(!se._flightService.itemFlightCache.ischeckpayment){
                //se._flightService.itemFlightCache.periodPaymentDate = data.periodPaymentDate;
                se.gf.hideLoading();
                se.gf.createFlightTransaction(se._flightService.itemFlightCache);
                clearInterval(se.intervalID);
                se.navCtrl.navigateForward('/mytripaymentflighdone');
              }else{
                //se.safariViewController.hide();
                clearInterval(se.intervalID);
                se.navCtrl.navigateForward('/mytripaymentflighdone');
              }
             
            }else{//hold vé thất bại về trang tìm kiếm
              se.gf.hideLoading();
              if(!se._flightService.itemFlightCache.ischeckpayment){
                  se.gf.showAlertOutOfTicket(se._flightService.itemFlightCache, 1, 1);
                  clearInterval(se.intervalID);
              }
              else{
                  //hold vé thất bại về trang tìm kiếm
                  se.navCtrl.navigateForward('/flightpaymentwarning');
              }
            }
                
          }
        })
      

      setTimeout(() => {
       
        se.allowCheckHoldTicket = false;
       
      }, 1000 * 60 * 9.1);
   
  }

  callCheckHoldTicket(){
    var res = false, se = this;
    return new Promise((resolve, reject) => {
      //var options = {
      //   method: 'GET',
      //   url: C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+this.bookingCode,
      //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
      //   headers: {
      //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
      //     'Content-Type': 'application/json; charset=utf-8',
      //   },
      // };

      let urlPath = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+this.bookingCode;
        let headers = {
          "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          'Content-Type': 'application/json; charset=utf-8',
        };
        this.gf.RequestApi('GET', urlPath, headers, { }, 'MytripPaymentFlightPayoo', 'callCheckHoldTicket').then((data)=>{

        if (data) {
          let result = data;
          if(se._flightService){
            se._flightService.itemFlightCache.dataSummaryBooking = result;
          }
          //Thêm case check thanh toán thành công nhưng quá hạn giữ vé
          if(result.expIssueTicket){
              se.allowCheckHoldTicket = false;
              resolve(false);
          }else{
          //trả trước
                if(result.isRoundTrip){//khứ hồi
                  //Có mã giữ chỗ và trạng thái đã xuất vé cả 2 chiều thì trả về true - hoàn thành
                  if(result.departFlight.atBookingCode != null && result.departFlight.atBookingCode.indexOf("T__") == -1 && result.returnFlight.atBookingCode != null && result.returnFlight.atBookingCode.indexOf("T__") == -1
                  && result.departFlight.status == 4 && result.returnFlight.status == 4){
                    resolve(true);
                  }else{
                    resolve(false);
                  }
                }else{//Có mã giữ chỗ và trạng thái đã xuất vé thì trả về true - hoàn thành
                  if(result.departFlight.atBookingCode != null && result.departFlight.atBookingCode.indexOf("T__") == -1 && result.departFlight.status == 4){
                    resolve(true);
                  }else{
                    resolve(false);
                  }
                }
              
            }
        }
      })
     
      
    })
  }
  
  checkqrcode()
  {
    var se=this;
    // var options = {
    //   'method': 'GET',
    //   'url': C.urls.baseUrl.urlFlight+'/gate/apiv1/PaymentCheck?id='+this.bookingCode,
    //   'headers': {
    //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
    //       'Content-Type': 'application/json; charset=utf-8'
    //   }
    // };

    let urlPath = C.urls.baseUrl.urlFlight+'/gate/apiv1/PaymentCheck?id='+this.bookingCode;
        let headers = {
          "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          'Content-Type': 'application/json; charset=utf-8',
        };
        this.gf.RequestApi('GET', urlPath, headers, { }, 'MytripPaymentFlightPayoo', 'checkqrcode').then((data)=>{

      var rs=data;
      let startDate = moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');
      let endDate = moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD');
      
      if (rs.ipnCall == "CALLED_OK") {
         
        clearInterval(this.intervalID);
        se._flightService.itemFlightCache.ischeckpayment= 1;
        se.gf.hideLoading();
        //se.safariViewController.hide();
        clearInterval(se.intervalID);
        se.navCtrl.navigateForward('/mytripaymentflighdone');
         //21-09-2020: Bỏ check hold vé, trả về màn hình thành công sau khi check đã thanh toán
        //se.checkHoldTicket(se._flightService.itemFlightCache);
      }
      else if(rs.ipnCall == "CALLED_FAIL" && rs.errorCode == '99')//hủy
      {
        se.gf.hideLoading();
        //se.safariViewController.hide();
        clearInterval(se.intervalID);
        se.navCtrl.navigateForward('/flightpaymenterror');
      }
      else if(rs.ipnCall == "CALLED_TIMEOUT" && rs.errorCode == '253')//case timeout
      {
        se.gf.hideLoading();
        //se.safariViewController.hide();
        clearInterval(se.intervalID);
        se._flightService.paymentError = rs;
        se.navCtrl.navigateForward('/flightpaymenttimeout/1');
      }
      else if(rs.ipnCall == "CALLED_FAIL" && rs.errorCode != '99')//hủy
                  {
                    se.gf.hideLoading();
                    //se.safariViewController.hide();
                    clearInterval(se.intervalID);
                    se._flightService.paymentError = rs;
                    se.navCtrl.navigateForward('/flightpaymenttimeout/1');
                  }
        else{
          se.allowCheck = true;
          se.callCheckPayment();
        }
        
    });
  }

  callCheckPayment(){
    var se = this;
    if(se.allowCheck){
      se.checkPayment();
    }
      
  }

  checkPayment(){
    var se = this;
    let url = C.urls.baseUrl.urlFlight + "gate/apiv1/PaymentCheck?id="+this.bookingCode;
    se.gf.Checkpayment(url).then((data) => {
      var checkpay=data;
      
      let startDate = moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');
      let endDate = moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD');
      if (checkpay.ipnCall == "CALLED_OK") {
         
        clearInterval(this.intervalID);
        se._flightService.itemFlightCache.ischeckpayment= 1;
        se.gf.hideLoading();
        //se.safariViewController.hide();
        clearInterval(se.intervalID);
        se.navCtrl.navigateForward('/mytripaymentflighdone');
      }
      else if(checkpay.ipnCall == "CALLED_TIMEOUT" || checkpay.ipnCall == "CALLED_FAIL")
      {
        se.gf.hideLoading();
        //se.safariViewController.hide();
        clearInterval(se.intervalID);
        se._flightService.paymentError = checkpay;
        se.navCtrl.navigateForward('/flightpaymenttimeout/1');
      }
      else{
        setTimeout(()=>{
          se.callCheckPayment();
        },1000)
      }
    })
  }

  async openWebpagePayoo() {
    var se = this;
    var url = "https://payoo.vn/mapv2/public/index.php?verify=true";
    await Browser.open({ url: url});

    Browser.addListener('browserFinished', () => {
      se.gf.hideLoading();

    });

  }
  clearItemCache() {
    this._flightService.itemFlightCache = {};
    this._flightService.itemFlightCache.departLuggage = [];
    this._flightService.itemFlightCache.returnLuggage = [];
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
    this._flightService.itemFlightCache.isnewmodelseat = false;
    this._flightService.itemFlightCache.isnewmodelreturnseat = false;
  }
  async showQuickBack() {
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

  addToCalendar(){
    let se = this;
    if(se._platform.is("cordova")){
      let itemflight = this._flightService.itemFlightCache;
      
      se.checkExistCalendarName(itemflight, true);
      if(itemflight.roundTrip){
        setTimeout(()=> {
          se.checkExistCalendarName(itemflight, false);
        },300)
        
      }
    }

    // setTimeout(() => {
    //   se._flightService.itemMenuFlightClick.emit(2);
    //   se.next();
    // },500)
    
  }

  createCalendar(itemflight, isdepart, createOrModify){
      let se = this;
      let calOptions = se._calendar.getCalendarOptions();
      
let strmess = `Mã đặt chỗ: `+ ( isdepart ? (itemflight.dataSummaryBooking && itemflight.dataSummaryBooking.departFlight ? itemflight.dataSummaryBooking.departFlight.atBookingCode : '') : (itemflight.dataSummaryBooking && itemflight.dataSummaryBooking.returnFlight ? itemflight.dataSummaryBooking.returnFlight.atBookingCode : '') ) +`
      
Giờ ra tàu bay: `+ (isdepart ? (moment(itemflight.departFlight.departTime).format("HH") + "h"+moment(itemflight.departFlight.departTime).format("mm") ) : (moment(itemflight.returnFlight.departTime).format("HH") + "h"+moment(itemflight.returnFlight.departTime).format("mm") ) ) +
`	
      
Hành khách:

`;
//Người lớn
itemflight.adults.forEach((elementA,index) => {
  if(index !=0){
    strmess+=`

`;
  }
  strmess+= index+1 + ". " + elementA.genderdisplay + " " + elementA.name;
  //chuyến đi
  if(isdepart && elementA.ancillaryJson){
    let objjson = JSON.parse(elementA.ancillaryJson);
    if(objjson && objjson.length >0){
      strmess+= " | ";
      objjson.forEach((elementAncillary, indexanci) => {
        strmess += ( elementAncillary.Type == "Baggage" ? "Hành lý" : "Chỗ ngồi") + ": " + ( elementAncillary.Type == "Baggage" ? elementAncillary.Value+ 'kg' : elementAncillary.Value ) + (indexanci != objjson.length -1 ? " | " : '');
      });
    }
  }
  //chuyến về
  if(!isdepart && elementA.ancillaryReturnJson){
    let objjson = JSON.parse(elementA.ancillaryReturnJson);
    if(objjson && objjson.length >0){
      strmess+= " | ";
      objjson.forEach((elementAncillary, indexanci) => {
        strmess += ( elementAncillary.Type == "Baggage" ? "Hành lý" : "Chỗ ngồi") + ": " + ( elementAncillary.Type == "Baggage" ? elementAncillary.Value+ 'kg' : elementAncillary.Value ) + (indexanci != objjson.length -1 ? " | " : '');
      });
    }
  }
});
//trẻ em
itemflight.childs.forEach((elementC,index) => {
    strmess+=`

`;
  strmess+= (index+1+ itemflight.adults.length) + ". " + elementC.genderdisplay + " " + elementC.name;
  if(isdepart && elementC.ancillaryJson){
    let objjson = JSON.parse(elementC.ancillaryJson);
    if(objjson && objjson.length >0){
      strmess+= " | ";
      objjson.forEach((elementAncillary, indexanci) => {
        strmess += ( elementAncillary.Type == "Baggage" ? "Hành lý" : "Chỗ ngồi") + ": " + ( elementAncillary.Type == "Baggage" ? elementAncillary.Value+ 'kg' : elementAncillary.Value ) + (indexanci != objjson.length -1 ? " | " : '');
      });
    }
  }

  //chuyến về
  if(!isdepart && elementC.ancillaryReturnJson){
    let objjson = JSON.parse(elementC.ancillaryReturnJson);
    if(objjson && objjson.length >0){
      strmess+= " | ";
      objjson.forEach((elementAncillary, indexanci) => {
        strmess += ( elementAncillary.Type == "Baggage" ? "Hành lý" : "Chỗ ngồi") + ": " + ( elementAncillary.Type == "Baggage" ? elementAncillary.Value+ 'kg' : elementAncillary.Value ) + (indexanci != objjson.length -1 ? " | " : '');
      });
    }
  }
});
strmess+=`

`;

if(itemflight.childs && itemflight.childs.length >0){
  strmess+= "Quý khách nhớ mang theo giấy tờ tuỳ thân và giấy khai sinh của "+ itemflight.childs.map((c)=> {return c.name}).join(', ')+".";
}else{
  strmess+= "Quý khách nhớ mang theo giấy tờ tuỳ thân."
}

      calOptions.firstReminderMinutes = 120; 
      calOptions.calendarName = "Chuyến đi " + (isdepart ? itemflight.departCity : itemflight.returnCity) + "  -  " +(isdepart ? itemflight.returnCity : itemflight.departCity) + ", " + (isdepart ? moment(itemflight.departFlight.departTime).format('DD/MM/YYYY') : moment(itemflight.returnFlight.departTime).format('DD/MM/YYYY') );
      calOptions.calendarId = 1; 
      let event = { title: (isdepart ? itemflight.departCity : itemflight.returnCity) + "  ✈  " +(isdepart ? itemflight.returnCity : itemflight.departCity) + " ("+(isdepart ? itemflight.departFlight.flightNumber : itemflight.returnFlight.flightNumber) +")",
                    location: (isdepart ? itemflight.departAirport : itemflight.returnAirport), 
                    message: strmess, 
                    startDate: (isdepart ? itemflight.departFlight.departTime : itemflight.returnFlight.departTime) , 
                    endDate: (isdepart ? itemflight.departFlight.landingTime : itemflight.returnFlight.landingTime), 
                    calOptions 
                  };
                    
      se._calendar.hasReadWritePermission().then((allow) => {
        // let sdate = new Date( new Date(event.startDate).getTime() + (new Date(event.startDate).getTimezoneOffset() * 60 * 1000)),
        //     edate = new Date(new Date(event.endDate).getTime() + (new Date(event.endDate).getTimezoneOffset() * 60 * 1000));
        let sdate = new Date(event.startDate),
        edate = new Date(event.endDate);
        if(allow){  
          if(createOrModify){//true - tạo mới
            se.gf.showLoadingwithtimeout();
            se._calendar.createEventWithOptions( event.title, event.location, event.message, sdate, edate, event.calOptions).then(()=>{
              if( (itemflight.roundTrip && !isdepart) || !itemflight.roundTrip ){
                se.zone.run(()=>{
                  se.gf.hideLoading();
                  se._flightService.itemFlightCache = {};
                      
                      se._flightService.itemMenuFlightClick.emit(2);
                      se.next();
                })
                
                  se._calendar.openCalendar(new Date(itemflight.departFlight.departTime)).then(()=>{
                  });
              }
              
            });
          }else{
            se._flightService.itemFlightCache = {};
            se._flightService.itemMenuFlightClick.emit(2);
            se.next();
          }
        }else{
          se._calendar.requestReadWritePermission().then(()=>{
           
            if(createOrModify){//true - tạo mới
              se.gf.showLoadingwithtimeout();
              se._calendar.createEventWithOptions( event.title, event.location, event.message, sdate, edate, event.calOptions).then(()=>{
                if( (itemflight.roundTrip && !isdepart) || !itemflight.roundTrip ){
                  se.zone.run(()=>{
                    se.gf.hideLoading();
                    se._flightService.itemFlightCache = {};
                        
                        se._flightService.itemMenuFlightClick.emit(2);
                        se.next();
                  })
                  
                    se._calendar.openCalendar(new Date(itemflight.departFlight.departTime)).then(()=>{
                    });
                }
              });
            }else{
              se._flightService.itemFlightCache = {};
              se._flightService.itemMenuFlightClick.emit(2);
              se.next();
            }
          })
        }
        
      })
  }

  getSummaryBooking() : Promise<any>{
    var se = this;
    return new Promise((resolve, reject) => {
      // var options = {
      //   method: 'GET',
      //   url: C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+se.bookingCode,
      //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
      //   headers: {
      //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
      //     'Content-Type': 'application/json; charset=utf-8',
      //   },
      // };
      let urlPath = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+se.bookingCode;
        let headers = {
          "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          'Content-Type': 'application/json; charset=utf-8',
        };
        this.gf.RequestApi('GET', urlPath, headers, { }, 'MytripPaymentFlightPayoo', 'getSummaryBooking').then((data)=>{

        if (data) {
          resolve(data);
        }
      })
    })
  }

  checkExistCalendarName(itemflight, isdepart){
    let se = this;
    let calendarname = "Chuyến đi " + (isdepart ? itemflight.departCity : itemflight.returnCity) + "  -  " +(isdepart ? itemflight.returnCity : itemflight.departCity) + ", " + (isdepart ? moment(itemflight.departFlight.departTime).format('DD/MM/YYYY') : moment(itemflight.returnFlight.departTime).format('DD/MM/YYYY') );
    this.storage.get('objectflightpaymentbank').then((data)=>{
      if(data){
          let arrobject = JSON.parse(data);
          if(arrobject && arrobject.length >0){
              let objexists = arrobject.filter((item) => {
                return item.resNo == itemflight.pnr.resNo;
              }) 

              if(objexists && objexists.length >0){
                //sửa event
                se.createCalendar(itemflight, isdepart, false)
              }else{
                se.createCalendar(itemflight, isdepart, true);
              }
          }
        }else{
          se.createCalendar(itemflight, isdepart, true);
        }
      })
  }
}

