import { GlobalFunction } from './../providers/globalfunction';
import { NavController, Platform,ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';

import { C } from '../providers/constants';
import * as moment from 'moment';
import { flightService } from '../providers/flightService';
import { ValueGlobal } from './../providers/book-service';
import { FlightquickbackPage } from '../flightquickback/flightquickback.page';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
import { Storage } from '@ionic/storage';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-flightpaymentpayoo',
  templateUrl: './flightpaymentpayoo.page.html',
  styleUrls: ['./flightpaymentpayoo.page.scss'],
})
export class FlightpaymentpayooPage implements OnInit {

  bookingCode; stt; text; qrimg; BillingCode; total; PeriodPaymentDate; textHours;
  intervalID: any;
  allowCheck: any = true;
  allowCheckHoldTicket: boolean = true;
   _email;
  contactOption: any;
  payment_fee: any;
  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private activatedRoute: ActivatedRoute, private _flightService: flightService,
    private platform: Platform,
    public valueGlobal: ValueGlobal,private modalCtrl: ModalController,
    private zone: NgZone,
    private _calendar: Calendar,
    private _platform: Platform,
    private storage: Storage) {

      this.gf.getSummaryBooking(this._flightService.itemFlightCache).then((databkg:any) => {
        this._flightService.itemFlightCache.dataSummaryBooking = databkg;
        this.total = this.gf.convertNumberToString(databkg.totalPrice);
        this.payment_fee = databkg.paymentFee;
      })   
      this.storage.get('contactOption').then((option)=>{
        this.contactOption = option;
      })

     
  }

  ngOnInit() {
    this.bookingCode = this.activatedRoute.snapshot.paramMap.get('code');
    this.stt = this.activatedRoute.snapshot.paramMap.get('stt');
    this._email = this._flightService.itemFlightCache.email;
    if (this.stt == 0) {
      this.BillingCode = this._flightService.itemFlightCache.BillingCode;
      this.gf.logEventFirebase(this._flightService.itemFlightCache.paymentType, this._flightService.itemFlightCache, 'flightpaymentpayoo', 'purchase', 'Flights');
    }
    else {
      this.qrimg = this._flightService.itemFlightCache.qrimg;
      clearInterval(this.intervalID);
      this.intervalID = setInterval(() => {
        //this.checkqrcode();
        this.zone.run(()=>{
          this.callCheckPayment();
        })
       
      }, 1000 * 5);

      setTimeout(() => {
        clearInterval(this.intervalID);
      }, 60000 * 15);
    }
    //this.total = this._flightService.itemFlightCache.totalPrice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    //this.PeriodPaymentDate=this._flightService.itemFlightCache.periodPaymentDate ? moment(this._flightService.itemFlightCache.periodPaymentDate).format('HH:mm DD/MM/YYYY') : "";
    this.textHours = moment(this._flightService.itemFlightCache.periodPaymentDate).format("HH:mm");
    this.PeriodPaymentDate = this._flightService.itemFlightCache.periodPaymentDate ? this.gf.getDayOfWeek(this._flightService.itemFlightCache.periodPaymentDate).dayname + ", " + moment(this._flightService.itemFlightCache.periodPaymentDate).format("DD") + " thg " + moment(this._flightService.itemFlightCache.periodPaymentDate).format("MM") : "";
  }
  goback() {
    if (this.stt == 1) {
      clearInterval(this.intervalID);
    }
    this.allowCheck = false;
    this.navCtrl.back();
  }
  next() {
    var se = this;
    if (this.stt == 0) {
      this.clearItemCache();
      this._flightService.itemTabFlightActive.emit(true);
      this.valueGlobal.backValue = "homeflight";
      this._flightService.itemFlightMytripRefresh.emit(true);
      this._flightService.bookingCodePayment = this.bookingCode;
      this._flightService.bookingSuccess = true;
      this.navCtrl.navigateBack('/app/tabs/tab1');
    }
    else {
      
      clearInterval(this.intervalID);
      se.checkqrcode();
      se.allowCheck = false;
      //se.callCheckPayment();
    }

  }

  checkHoldTicket(data) {
    var se = this, res = false;
    let url = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/" + data.pnr.resNo;

    se.callCheckHoldTicket(url, data).then((check) => {
      if (!check && se.allowCheckHoldTicket) {
        res = false;
        setTimeout(() => {
          se.checkHoldTicket(data);
        }, 3000);
      } else {
        let startDate = moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');
        let endDate = moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD');
        if (check) {
          se.gf.getSummaryBooking(se._flightService.itemFlightCache).then((databkg:any) => {
            se._flightService.itemFlightCache.dataSummaryBooking = databkg;
          })
          if (!se._flightService.itemFlightCache.ischeckpayment) {
            se.gf.hideLoading();
            se.gf.createFlightTransaction(se._flightService.itemFlightCache);
            clearInterval(se.intervalID);
            se.navCtrl.navigateForward('flightpaymentdone/' + se.bookingCode + '/' + startDate + '/' + endDate);
          } else {
            clearInterval(se.intervalID);
            se.navCtrl.navigateForward('flightpaymentdone/' + se.bookingCode + '/' + startDate + '/' + endDate);
          }

        } else {//hold vé thất bại về trang tìm kiếm
          se.gf.hideLoading();
          clearInterval(se.intervalID);
          if (!se._flightService.itemFlightCache.ischeckpayment) {
            se.gf.showAlertOutOfTicket(se._flightService.itemFlightCache, 1, 0);
          }
          else {
            se.navCtrl.navigateForward('/flightpaymentwarning');
          }
          //se.gf.showAlertOutOfTicket(se._flightService.itemFlightCache);

        }

      }
    })


    setTimeout(() => {

      se.allowCheckHoldTicket = false;

    }, 1000 * 30);

  }

  callCheckHoldTicket(url, data) {
    var res = false, se = this;
    return new Promise((resolve, reject) => {
      // var options = {
      //   method: 'GET',
      //   url: C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/" + data.pnr.resNo,
      //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
      //   headers: {
      //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
      //     'Content-Type': 'application/json; charset=utf-8',
      //   },
      // };
      let urlPath = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/" + data.pnr.resNo;
      let headers = {
        "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
        'Content-Type': 'application/json; charset=utf-8',
      };
      this.gf.RequestApi('GET', urlPath, headers, {}, 'flightPaymentPayoo', 'callCheckHoldTicket').then((result)=>{

        if (result) {
          //let result = data;
          if(se._flightService){
            se._flightService.itemFlightCache.dataSummaryBooking = result;
          }
          //Thêm case check thanh toán thành công nhưng quá hạn giữ vé
          if(result.expIssueTicket){
              se.allowCheckHoldTicket = false;
              resolve(false);
            }else{
                if (data.ischeckpayment == 0)//trả sau
                {
                  if (result.isRoundTrip) {//khứ hồi
                    if (result.departFlight.atBookingCode != null && result.departFlight.atBookingCode.indexOf("T__") == -1 && result.returnFlight.atBookingCode != null && result.returnFlight.atBookingCode.indexOf("T__") == -1) {
                      resolve(true);
                    } else {
                      if (!result.departFlight.atBookingCode || result.departFlight.atBookingCode.indexOf("T__") != -1) {
                        se._flightService.itemFlightCache.errorHoldTicket = 1;// không hold dc vé chiều đi
                      }
                      else if (!result.returnFlight.atBookingCode || result.returnFlight.atBookingCode.indexOf("T__") != -1) {
                        se._flightService.itemFlightCache.errorHoldTicket = 2;// không hold dc vé chiều về
                      }
                      else if ((!result.returnFlight.atBookingCode || result.returnFlight.atBookingCode.indexOf("T__") != -1) && (!result.departFlight.atBookingCode || result.departFlight.atBookingCode.indexOf("T__") != -1)) {
                        se._flightService.itemFlightCache.errorHoldTicket = 3;// không hold dc vé 2 chiều
                      }
                      resolve(false);
                    }
                  } else {
                    if (result.departFlight.atBookingCode != null && result.departFlight.atBookingCode.indexOf("T__") == -1) {
                      resolve(true);
                    } else {
                      se._flightService.itemFlightCache.errorHoldTicket = 1;// không hold dc vé chiều đi
                      resolve(false);
                    }
                  }
                } else {//trả trước

                  if (result.isRoundTrip) {//khứ hồi
                    //Có mã giữ chỗ và trạng thái đã xuất vé cả 2 chiều thì trả về true - hoàn thành
                    if (result.departFlight.atBookingCode != null && result.departFlight.atBookingCode.indexOf("T__") == -1 && result.returnFlight.atBookingCode != null && result.returnFlight.atBookingCode.indexOf("T__") == -1
                      && result.departFlight.status == 4 && result.returnFlight.status == 4) {
                      resolve(true);
                    } else {
                      resolve(false);
                    }
                  } else {//Có mã giữ chỗ và trạng thái đã xuất vé thì trả về true - hoàn thành
                    if (result.departFlight.atBookingCode != null && result.departFlight.atBookingCode.indexOf("T__") == -1 && result.departFlight.status == 4) {
                      resolve(true);
                    } else {
                      resolve(false);
                    }
                  }
                }
              }
        }
      })


    })
  }

  checkqrcode() {
    var se = this;
    se.gf.showLoading();
    // var options = {
    //   'method': 'GET',
    //   'url': C.urls.baseUrl.urlFlight + '/gate/apiv1/PaymentCheck?id=' + se._flightService.itemFlightCache.reservationId,
    //   'headers': {
    //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
    //     'Content-Type': 'application/json; charset=utf-8'
    //   }
    // };
    let urlPath = C.urls.baseUrl.urlFlight + '/gate/apiv1/PaymentCheck?id=' + se._flightService.itemFlightCache.reservationId;
      let headers = {
        "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
        'Content-Type': 'application/json; charset=utf-8',
      };
      this.gf.RequestApi('GET', urlPath, headers, {}, 'flightPaymentPayoo', 'checkqrcode').then((data)=>{

      var rs = data;
      se.gf.hideLoading();
      let startDate = moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');
      let endDate = moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD');
      if (rs.ipnCall == "CALLED_OK") {
        se._flightService.itemFlightCache.ischeckpayment= 1;
        se.gf.hideLoading();
        clearInterval(se.intervalID);
        se.navCtrl.navigateForward('flightpaymentdone/'+se.bookingCode+'/'+startDate+'/'+endDate);
         //21-09-2020: Bỏ check hold vé, trả về màn hình thành công sau khi check đã thanh toán
        //se.checkHoldTicket(se._flightService.itemFlightCache);
      }
      else if(rs.ipnCall == "CALLED_FAIL" && rs.errorCode == '99')//hủy
      {
        se.gf.hideLoading();
        clearInterval(se.intervalID);
        se.navCtrl.navigateForward('/flightpaymenterror');
      }
      else if(rs.ipnCall == "CALLED_TIMEOUT" && rs.errorCode == '253')//case timeout
      {
        se.gf.hideLoading();
        clearInterval(se.intervalID);
        se._flightService.paymentError = rs;
        se.navCtrl.navigateForward('/flightpaymenttimeout');
      }
      else if(rs.ipnCall == "CALLED_FAIL" && rs.errorCode != '99')//hủy
                  {
                    se.gf.hideLoading();
                    clearInterval(se.intervalID);
                    se._flightService.paymentError = rs;
                    se.navCtrl.navigateForward('/flightpaymenttimeout');
                  }
        else{
          se.allowCheck = true;
          se.zone.run(()=>{
            se.callCheckPayment();
          })
          
        }
    });
  }

  callCheckPayment() {
    var se = this;
    if (se.allowCheck) {
      se.checkPayment();
    }

  }

  checkPayment() {
    var se = this;
    let url = C.urls.baseUrl.urlFlight + "gate/apiv1/PaymentCheck?id=" + se._flightService.itemFlightCache.reservationId;
    se.gf.Checkpayment(url).then((data) => {
      var checkpay = data;
      let startDate = moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');
      let endDate = moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD');
       if (checkpay.ipnCall == "CALLED_OK") {
        se._flightService.itemFlightCache.ischeckpayment= 1;
        se.gf.hideLoading();
        clearInterval(se.intervalID);
        se.navCtrl.navigateForward('flightpaymentdone/'+se.bookingCode+'/'+startDate+'/'+endDate);
         //21-09-2020: Bỏ check hold vé, trả về màn hình thành công sau khi check đã thanh toán
        //se.checkHoldTicket(se._flightService.itemFlightCache);
      }
      else if(checkpay.ipnCall == "CALLED_FAIL" && checkpay.errorCode == '99')//hủy
      {
        se.gf.hideLoading();
        clearInterval(se.intervalID);
        se.navCtrl.navigateForward('/flightpaymenterror');
      }
      else if(checkpay.ipnCall == "CALLED_TIMEOUT" && checkpay.errorCode == '253')//case timeout
      {
        se.gf.hideLoading();
        clearInterval(se.intervalID);
        se._flightService.paymentError = checkpay;
        se.navCtrl.navigateForward('/flightpaymenttimeout');
      }
      else if(checkpay.ipnCall == "CALLED_FAIL" && checkpay.errorCode != '99')//hủy
                  {
                    se.gf.hideLoading();
                    clearInterval(se.intervalID);
                    se._flightService.paymentError = checkpay;
                    se.navCtrl.navigateForward('/flightpaymenttimeout');
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
      let itemflight = se._flightService.itemFlightCache;
      
      se.checkExistCalendarName(itemflight, true);
      if(itemflight.roundTrip){
        setTimeout(()=> {
          se.checkExistCalendarName(itemflight, false);
        },300)
        
      }
    }

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
  strmess+= "Quý khách nhớ mang theo giấy tờ tuỳ thân và giấy khai sinh của "+ itemflight.childs.map((c)=> {return c.name}).join(', ') +".";
}else{
  strmess+= "Quý khách nhớ mang theo giấy tờ tuỳ thân."
}

      calOptions.firstReminderMinutes = 120; 
      calOptions.calendarName = "Chuyến đi " + (isdepart ? itemflight.departCity : itemflight.returnCity) + "  -  " +(isdepart ? itemflight.returnCity : itemflight.departCity) + ", " + (isdepart ? moment(itemflight.departFlight.departTime).format('DD/MM/YYYY') : moment(itemflight.returnFlight.departTime).format('DD/MM/YYYY') );
      calOptions.calendarId = 1; 
      let event = { 
        title: (isdepart ? itemflight.departCity : itemflight.returnCity) + "  ✈  " +(isdepart ? itemflight.returnCity : itemflight.departCity) + " ("+(isdepart ? itemflight.departFlight.flightNumber : itemflight.returnFlight.flightNumber) +")", 
        location: (isdepart ? itemflight.departAirport : itemflight.returnAirport), 
        message: strmess, 
        startDate: (isdepart ? itemflight.departFlight.departTime : itemflight.returnFlight.departTime) , 
        endDate: (isdepart ? itemflight.departFlight.landingTime : itemflight.returnFlight.landingTime), 
        calOptions 
      };

      se._calendar.hasReadWritePermission().then((allow) => {
        let sdate = new Date(event.startDate),
        edate = new Date(event.endDate);
        if(allow){  
          if(createOrModify){//true - tạo mới
            se.gf.showLoadingwithtimeout();
              se._calendar.createEventWithOptions( event.title, event.location, event.message, sdate, edate, event.calOptions).then(()=>{
                if( (itemflight.roundTrip && !isdepart) || !itemflight.roundTrip ){
                  se.zone.run(()=>{
                    se.gf.hideLoading();
                    se.clearItemCache();
                        
                    se._flightService.itemMenuFlightClick.emit(2);
                    se.next();
                  })
                  
                    se._calendar.openCalendar(new Date(itemflight.departFlight.departTime)).then(()=>{
                    });
                  
                }
                
              });
          }else{
            se.clearItemCache();
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
                      se.clearItemCache();
                      
                      se._flightService.itemMenuFlightClick.emit(2);
                      se.next();
                    })
                  
                      se._calendar.openCalendar(new Date(itemflight.departFlight.departTime)).then(()=>{
                       
                      });
                  }
                });
            }else{
              se.clearItemCache();
              se._flightService.itemMenuFlightClick.emit(2);
              se.next();
            }
          })
        }
        
      })
  }

  checkExistCalendarName(itemflight, isdepart){
    let se = this;
    let calendarname = "Chuyến đi " + (isdepart ? itemflight.departCity : itemflight.returnCity) + "  -  " +(isdepart ? itemflight.returnCity : itemflight.departCity) + ", " + (isdepart ? moment(itemflight.departFlight.departTime).format('DD/MM/YYYY') : moment(itemflight.returnFlight.departTime).format('DD/MM/YYYY') );
    se.storage.get('objectflightpaymentbank').then((data)=>{
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
