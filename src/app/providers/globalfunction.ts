
      import { Injectable, EventEmitter } from '@angular/core';
      import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics";
      import { Platform, AlertController, ToastController, NavController, LoadingController } from '@ionic/angular';
      import { C } from '../providers/constants';
      import * as $ from 'jquery';
      
      import { Storage } from '@ionic/storage';
      import { ValueGlobal, SearchHotel, RoomInfo, Bookcombo } from './book-service';
      import { File as IonicFileService, FileEntry, IFile } from '@awesome-cordova-plugins/file/ngx';
      import * as moment from 'moment';
      import { flightService } from './flightService';
      import * as clone from 'clone';
      import jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { tourService } from './tourService';
import { ticketService } from './ticketService';
import { debounceTime } from 'rxjs';
import { App } from '@capacitor/app';
      @Injectable({
          providedIn: 'root'  // <- ADD THIS
      })
      @Injectable()
      export class GlobalFunction{
        private listCarParams : any;
        private listObjcars : any;
          private DepartureParams :any;
          private showpickupdatefromdetail = false;
          private HotelRoomDetail: any;
          private exchangeGiftParams: any;
          private mytripBookingDetailParams: any;
          private roomInfoParams: any;
          private hotelNotesParams: any;
          private hotelExpsNotesParams: any;
          private showOccupancyFromRequestcombo: boolean = false;
          private hotelListMoodParams:any;
          private listFlightParams:any;
          private flightComboParams:any;
          private hotellistmoodselectedParams:any;
          private seemoreblogParams: any;
          private resetBlogTripsParams: any;
        notifiBookingCodeParams: any;
        userAvatarParams: any;
        tripFeedBackParams: any;
        selectedTab3Params: any;
        notifiSwitchObjParams: any;
        experiencesearchParams: any;
        experienceItemParams: any;
        experienceFilter_regionIdParams: any;
        experiencesearchTagsIdParams: any;
        listDistanceNearByParams: any;
        listSearch_ExperienceDetailParams: any;
        experienceFilter_regionCodeParams: any;
        listsearchblogParams: any;
        blogidParams: any;
        itemslugParams: any;
        searchblogtextParams: any;
        experienceLocationParams: any;
        insurrenceDetailParams: any;
        insurranceClaimedParams: any;
        insurrenceHistoryParams: any;
        objinfofly: any;
        isOnline: any;
        public reLoad = true;
        loader: Promise<HTMLIonLoadingElement>;
        private allowCheckHoldTicket: boolean = true;
        intervalHoldTicket: NodeJS.Timeout;
        showtoastctrl: boolean;
        EVENTS = {EVENT_NAME_INITIATED_CHECKOUT: 'EVENT_NAME_INITIATED_CHECKOUT'};
      
          constructor(public platform: Platform, public alertCtrl: AlertController,public toastCtrl: ToastController,
            public storage: Storage,
            public navCtrl: NavController,
            public valueGlobal: ValueGlobal,
            private ionicFileService: IonicFileService,
            public loadCtrl: LoadingController,
            public _flightService: flightService,
            private searchhotel:SearchHotel,
            private httpClient: HttpClient,
            public tourService: tourService,
            public roomInfo: RoomInfo,
            public bookcombo: Bookcombo,private ticketService:ticketService){
      
          }
          
          public googleAnalytion(viewName,action,options ){
            if(this.platform.is('android') || this.platform.is('iphone')){
                if(C.ENV == "prod"){
                    this.platform.ready().then(() => {
                      if(action != "screen_view"){
                        FirebaseAnalytics.logEvent({name: action, params: { 'hitType': 'event', 'eventCategory': viewName , 'eventLabel': options}})
                        .then((res: any) => {console.log(res);})
                        .catch((error: any) => console.error(error));
                      }else{
                        //this.fba.logEvent(action, { 'hitType': 'event', 'firebase_screen_class': viewName , 'firebase_screen_name': viewName})
                        //.then((res: any) => {console.log(res);})
                        //.catch((error: any) => console.error(error));
                        //this.fba.setCurrentScreen(viewName);
                        FirebaseAnalytics.setScreenName({
                          screenName: viewName, 
                          nameOverride: viewName})
                      }
                      
                })
            }
            }
          }
          
          public googleAnalytionCustom(action,params, type? ){
            if(this.platform.is('android') || this.platform.is('iphone')){
              if(C.ENV == "prod" || C.ENV == "release"){
                  this.platform.ready().then(() => {
                    FirebaseAnalytics.logEvent({name: action, params: params})
                      .then((res: any) => {console.log(res);})
                      .catch((error: any) => console.error(error));
                  })
                }
                // else if(C.ENV == "dev") {
                //   this.platform.ready().then(() => {
                //     if(this.platform.is('android') || this.platform.is('iphone')){
                //       this.fba.logEvent(action, params)
                //       .then((res: any) => {console.log('test');})
                //       .catch((error: any) => console.log(error));
                //     }
                    
                // })
                // }
            }
        }
      
        public gaSetScreenName(_screenName){
          this.platform.ready().then(() => {
            if(this.platform.is('android') || this.platform.is('iphone')){
              FirebaseAnalytics.setScreenName({screenName: _screenName, nameOverride: _screenName})
                      .catch((error: any) => console.error(error));
                }
              })
            
        }
        public getGAPaymentType(paymentType){
          if(paymentType == 'visa'){
            return 'Credit Card';
          } 
          else if(paymentType == 'atm'){
            return 'Local ATM';
          } 
          else if(paymentType == 'momo'){
            return 'MoMo';
          } 
          else if(paymentType == 'payoo' || paymentType =='payoo_store' || paymentType =='payoo_qr'){
            return 'Payoo';
          } 
          else if(paymentType == 'office'){
            return 'iVIVU Offices';
          } 
          else if(paymentType == 'bnpl'){
            return 'Home Credit: Buy Now Pay Later';
          } 
          else if(paymentType == 'banktransfer'){
            return 'Bank Transfer';
          } 
          else if(paymentType == 'Yeu Cau Dat Tour'){
            return 'Yeu Cau Dat Tour';
          }
          else if(paymentType == 'Yeu Cau Tu Van'){
            return 'Yeu Cau Tu Van';
          }
          else if(paymentType){
            return 'On Request';
          }
          else {
            return '';
          }
        }
      
      
        public logEventFirebase(paymentType, itemcache, screenName, viewAction, category){
          if(this.platform.is('android') || this.platform.is('iphone')){
          if(category == 'Flights'){
            //this.gaSetScreenName("/ve-may-bay/"+itemcache.departCode+"-di-"+itemcache.returnCode);
            FirebaseAnalytics.logEvent({name: 'screen_view', params: {
              screen_name: "/ve-may-bay/"+itemcache.departCode+"-di-"+itemcache.returnCode, 
              screen_class: "/ve-may-bay/"+itemcache.departCode+"-di-"+itemcache.returnCode+ (itemcache.roundTrip ? '-khu-hoi' :'')}})

                this.googleAnalytionCustom(viewAction, { 
                  transaction_id: viewAction=='purchase'? this._flightService.itemFlightCache.bookingCode :'',
                  value: itemcache.totalPrice ? this.convertStringToNumber(itemcache.totalPrice) : 0,
                  currency: "VND",
                  shipping_tier: paymentType || viewAction == 'add_shipping_info' ? "Ground" : '',
                  payment_type: paymentType ? this.getGAPaymentType(paymentType) : '',
    
                  item_id: "Ve-may-bay-"+itemcache.departCode+"-di-"+itemcache.returnCode + (itemcache.roundTrip ? '-khu-hoi' :''),
                  item_name: "Vé máy bay "+itemcache.departCity+" đi "+itemcache.returnCity+ (itemcache.roundTrip ?' khứ hồi' :''),
                  discount: itemcache.discount,
                  item_brand: "iVIVU.com",
                  item_category: category,
                  item_category2: itemcache.departCode,
                  item_category3: itemcache.departFlight ? this.getTicketClass(itemcache.departFlight) : (itemcache.isInternationalFlight && itemcache.itemFlightInternationalDepart) ? this.getTicketClass(itemcache.itemFlightInternationalDepart) : '',
                  item_category4: itemcache.isInternationalFlight ? 'Travelport' :"Api", 
                  item_category5: paymentType ? this.getGAPaymentType(paymentType) : '', 
                  price: itemcache.totalPrice ? this.convertStringToNumber(itemcache.totalPrice/(itemcache.adult + (itemcache.child || 0) + (itemcache.infant || 0)) ) : 0,
                  quantity: itemcache.adult + (itemcache.child || 0) + (itemcache.infant || 0),
                });
            
          }
          else if(category == 'Hotels' || category == 'Combo'){
            let date1 = new Date(itemcache.CheckInDate);
            let date2 = new Date(itemcache.CheckOutDate);
            let timeDiff = Math.abs(date2.getTime() - date1.getTime());
            let duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
            //console.log(itemcache.gaHotelDetail);
            //this.gaSetScreenName(itemcache.gaHotelDetail.Url);
            FirebaseAnalytics.logEvent({name: 'screen_view', params: {
              screen_name: itemcache.gaHotelDetail ? itemcache.gaHotelDetail.Url : '', 
              screen_class: itemcache.gaHotelDetail ? itemcache.gaHotelDetail.Url : ''}})
            this.googleAnalytionCustom(viewAction, viewAction == 'view_item' ? {
              transaction_id: viewAction=='purchase'?(this.roomInfo.bookingCode || this.bookcombo.bookingcode || '') :'',
              currency: "VND",
                  value: 0,
                          item_brand: "iVIVU.com",
                          item_id: itemcache.gaHotelId || (itemcache.gaComboId || ''),
                          item_name: category == 'Hotels' ? itemcache.hotelName : itemcache.gaComboName,
                          item_category: 'Hotels',
                          item_category2: category == 'Combo' ? itemcache.location : (itemcache.gaHotelDetail ? itemcache.gaHotelDetail.District : ''),
                          item_category3: itemcache.gaHotelDetail ? itemcache.gaHotelDetail.RatingValue.toString() : '',
                          item_category4: category == 'Combo' ? 'Combo' : 'Room',
                          item_category5: paymentType ? this.getGAPaymentType(paymentType) : '', 
                          price: 0,
                          quantity: itemcache.roomnumber * duration
            }:
            {
              currency: "VND",
                  value: itemcache.totalPrice ? this.convertStringToNumber(itemcache.totalPrice) : 0,
                  shipping_tier: paymentType || viewAction == 'add_shipping_info' ? "Ground" : '',
                  payment_type: paymentType ? this.getGAPaymentType(paymentType) : '',
                  // items: [
                  //     {
                          item_brand: "iVIVU.com",
                          item_id: itemcache.gaHotelId || (itemcache.gaComboId || ''),
                          item_name: category == 'Hotels' ? itemcache.hotelName : itemcache.gaComboName,
                          item_category: 'Hotels',
                          item_category2: category == 'Combo' ? itemcache.location : (itemcache.gaHotelDetail ? itemcache.gaHotelDetail.District : ''),
                          item_category3: itemcache.gaHotelDetail ? itemcache.gaHotelDetail.RatingValue.toString() : '',
                          item_category4: category == 'Combo' ? 'Combo' : 'Room',
                          item_category5: paymentType ? this.getGAPaymentType(paymentType) : '', 
                          price: itemcache.totalPrice ? this.convertStringToNumber(itemcache.totalPrice/(itemcache.roomnumber * duration)) : 0,
                          quantity: itemcache.roomnumber * duration
                  //     }
                  // ]
            }
            )
          }
          else if(category == 'Tours' && itemcache && itemcache.gaTourDetail && itemcache.gaTourDetail.TourDetailUrl){
            //this.gaSetScreenName('/du-lich/'+itemcache.gaTourDetail.Code);
            FirebaseAnalytics.logEvent({name: 'screen_view', params: {
              screen_name: itemcache.gaTourDetail.TourDetailUrl.replace('https://www.ivivu.com',''), 
              screen_class: itemcache.gaTourDetail.TourDetailUrl.replace('https://www.ivivu.com','')}})
            this.googleAnalytionCustom(viewAction, {
              transaction_id: viewAction=='purchase'?this.tourService.tourBookingCode :'',
              currency: "VND",
                  value: itemcache.totalPrice ? this.convertStringToNumber(itemcache.totalPrice) : (itemcache.itemDepartureCalendar && itemcache.itemDepartureCalendar.PriceAdultAvgStr ? this.convertStringToNumber(itemcache.itemDepartureCalendar.PriceAdultAvgStr) : (this.convertStringToNumber(itemcache.gaTourDetail.AdultPrice) || 0)),
                  shipping_tier: paymentType || viewAction == 'add_shipping_info' ? "Ground" : '',
                  payment_type: paymentType ? this.getGAPaymentType(paymentType) : '',
                  // items: [
                  //     {
                          item_id: itemcache.gaTourDetail.TourDetailUrl.replace('https://www.ivivu.com','') || '',
                          item_name: itemcache.gaTourDetail.Name,
                          discount: itemcache.gaDiscountPromo || 0,
                          item_brand: "iVIVU.com",
                          item_category: 'Tours',
                          item_category2: itemcache.itemDeparture ? itemcache.itemDeparture.Name : 'Hồ Chí Minh',
                          item_category3: '',
                          item_category4: itemcache.gaTourDetail.TourType ||'',
                          item_category5: paymentType ? this.getGAPaymentType(paymentType) : '', 
                          price: itemcache.totalPrice ? this.convertStringToNumber(itemcache.totalPrice/(this.searchhotel.adult +(this.searchhotel.child || 0))) : (itemcache.itemDepartureCalendar && itemcache.itemDepartureCalendar.PriceAdultAvgStr ? this.convertStringToNumber(itemcache.itemDepartureCalendar.PriceAdultAvgStr/(this.searchhotel.adult +(this.searchhotel.child || 0))) : (this.convertStringToNumber(itemcache.gaTourDetail.AdultPrice/(this.searchhotel.adult +(this.searchhotel.child || 0))) || 0)),
                          quantity: this.searchhotel.adult +(this.searchhotel.child || 0)
                  //     }
                  // ]
            })
          }
        }       
        }

        public logEventFaceBook(eventName, params){
          
        }
      
        getTicketClass(flightObj){
          return flightObj.ticketClass.indexOf('Phổ thông đặc biệt') > -1 || flightObj.ticketClass.indexOf('Premium') > -1 ? 'premium' : 
          (flightObj.ticketClass.indexOf('Phổ thông') || flightObj.ticketClass.indexOf('Economy') > -1 ? 'economy' : 
          (flightObj.ticketClass.indexOf('Thương gia') > -1 || flightObj.ticketClass.indexOf('Business') > -1 || flightObj.ticketClass.indexOf('First') > -1 ? 'business' : 'economy'));
        }
      
          /**
           * Hàm show cảnh báo chung
           * @param header header của warning
           * @param msg nội dung warning
           * @param textButtonOK text hiển thị button ok
           */
          public async showWarning(header,msg,textButtonOK){
            if(!this.showtoastctrl){
              let alert = await this.toastCtrl.create({
                message: msg,
                position: "top",
                //header: header,
                duration: 3000,
              });
              alert.present();
              this.showtoastctrl = true;
              //}
              alert.onDidDismiss().then(()=>{
                this.showtoastctrl = false;
              })
                
            }
          }

          public async showMessageWarning(msg){
              let alert = await this.alertCtrl.create({
                message: msg
              });
              alert.present();
          }
      
          public setParams(params,type) {
            if(type == 'departure'){
              this.DepartureParams = params;
            }
            if(type == 'showpickupdatefromdetail'){
              this.showpickupdatefromdetail = params;
            }
            if(type=='hotelroomdetail'){
              this.HotelRoomDetail = params;
            }
            if(type=='exchangegift'){
              this.exchangeGiftParams = params;
            }
            if(type=='mytripbookingdetail'){
              this.mytripBookingDetailParams = params;
            }
            if(type=='roomInfo'){
              this.roomInfoParams = params;
            }
            if(type=='hotelnotes'){
              this.hotelNotesParams = params;
            }
            if(type=='hotelexpsnotes'){
              this.hotelExpsNotesParams = params;
            }
            if(type=='requestcombo'){
              this.showOccupancyFromRequestcombo = params;
            }
            if(type=='hotellistmood'){
              this.hotelListMoodParams = params;
            }
            if(type=='hotellistmoodselected'){
              this.hotellistmoodselectedParams = params;
            }
            if(type=='listflight'){
              this.listFlightParams = params;
            }
            if(type=='flightcombo'){
              this.flightComboParams = params;
            }
            if(type=='seemoreblog'){
              this.seemoreblogParams = params;
            }
            if(type=='resetBlogTrips'){
              this.resetBlogTripsParams = params;
            }
            if(type=='notifiBookingCode'){
              this.notifiBookingCodeParams = params;
            }
            if(type =='userAvatar'){
              this.userAvatarParams = params;
            }
            if(type == 'tripFeedBack'){
              this.tripFeedBackParams = params;
            }
            if(type == 'selectedTab3'){
              this.selectedTab3Params = params;
            }
            if(type =='notifiSwitchObj'){
              this.notifiSwitchObjParams = params;
            }
            if(type=='experiencesearch'){
              this.experiencesearchParams = params;
          }
          if(type=='experienceItem'){
              this.experienceItemParams = params;
          }
          if(type=='experienceFilter_regionId'){
              this.experienceFilter_regionIdParams = params;
          }
          if(type=='experienceFilter_regionCode'){
            this.experienceFilter_regionCodeParams = params;
          }
          if(type=='experiencesearchTagsId'){
              this.experiencesearchTagsIdParams = params;
          }
          if(type=='listDistanceNearBy'){
              this.listDistanceNearByParams = params;
          }
          if(type=='listSearch_ExperienceDetail'){
              this.listSearch_ExperienceDetailParams = params;
          }
          if(type=='listsearchblog'){
            this.listsearchblogParams = params;
          }
          if(type=='blogid'){
            this.blogidParams = params;
          }
          if(type=='itemslug'){
            this.itemslugParams = params;
          }
          if(type=='searchblogtext'){
            this.searchblogtextParams = params;
          }
          if(type=='searchblogmodaltext'){
            this.searchblogtextParams = params;
          }
          if(type == 'experienceLocation'){
            this.experienceLocationParams = params;
          }
          if (type == 'listcar') {
            this.listCarParams = params;
        }
        if (type == 'carscombo') {
            this.listObjcars = params;
        }
         
              if(type=='insurrenceDetail'){
                  this.insurrenceDetailParams = params;
              }
              if(type=='insurranceClaimed'){
                  this.insurranceClaimedParams = params;
              }
              if(type=='insurrenceHistory'){
                  this.insurrenceHistoryParams = params;
              }
              if(type=='objinfofly'){
                this.objinfofly = params;
            }
          }
        
          public getParams(type) {
            if(type == 'departure'){
              return this.DepartureParams;
            }
            if(type == 'showpickupdatefromdetail'){
              return this.showpickupdatefromdetail;
            }
            if(type=='hotelroomdetail'){
              return this.HotelRoomDetail;
            }
            if(type=='exchangegift'){
              return this.exchangeGiftParams;
            }
            if(type=='mytripbookingdetail'){
              return this.mytripBookingDetailParams;
            }
            if(type=='roomInfo'){
              return this.roomInfoParams;
            }
            if(type=='hotelnotes'){
              return this.hotelNotesParams;
            }
            if(type=='hotelexpsnotes'){
              return this.hotelExpsNotesParams;
            }
            if(type=='requestcombo'){
              return this.showOccupancyFromRequestcombo;
            }
            if(type=='hotellistmood'){
              return this.hotelListMoodParams;
            }
            if(type=='hotellistmoodselected'){
              return this.hotellistmoodselectedParams;
            }
            if(type=='listflight'){
              return this.listFlightParams;
            }
            if(type=='flightcombo'){
              return this.flightComboParams;
            }
            if(type=='seemoreblog'){
              return this.seemoreblogParams;
            }
            if(type=='resetBlogTrips'){
              return this.resetBlogTripsParams;
            }
            if(type=='notifiBookingCode'){
              return this.notifiBookingCodeParams;
            }
            if(type =='userAvatar'){
              return this.userAvatarParams;
            }
            if(type == 'tripFeedBack'){
              return this.tripFeedBackParams;
            }
            if(type == 'selectedTab3'){
              return this.selectedTab3Params;
            }
            if(type =='notifiSwitchObj'){
              return this.notifiSwitchObjParams;
            }
            if(type=='experiencesearch'){
              return this.experiencesearchParams;
            }
            if(type=='experienceItem'){
              return this.experienceItemParams;
            }
            if(type=='experienceFilter_regionId'){
              return this.experienceFilter_regionIdParams;
            }
            if(type=='experienceFilter_regionCode'){
              return this.experienceFilter_regionCodeParams;
            }
            if(type=='experiencesearchTagsId'){
              return this.experiencesearchTagsIdParams;
            }
            if(type=='listDistanceNearBy'){
              return this.listDistanceNearByParams;
            }
            if(type=='listSearch_ExperienceDetail'){
              return this.listSearch_ExperienceDetailParams;
            }
            if(type=='listsearchblog'){
              return this.listsearchblogParams;
            }
            if(type=='blogid'){
              return this.blogidParams;
            }
            if(type=='itemslug'){
              return this.itemslugParams;
            }
            if(type=='searchblogtext'){
              return this.searchblogtextParams;
            }
            if(type=='searchblogmodaltext'){
              return this.searchblogtextParams;
            }
            if(type == 'experienceLocation'){
              return this.experienceLocationParams;
            }
            if (type == 'listcar') {
            return this.listCarParams;
            }
            if (type == 'carscombo') {
                return this.listObjcars;
            }
            if(type=='insurrenceDetail'){
              return this.insurrenceDetailParams;
            }
            if(type=='insurranceClaimed'){
              return this.insurranceClaimedParams;
            }
            if(type=='insurrenceHistory'){
              return this.insurrenceHistoryParams;
            }
            if(type=='objinfofly'){
              return this.objinfofly;
            }
          }
       //lấy hình thức thanh toán
    public getbank(method) {
      var textbank, bankName, bankBranch, accountNumber,urlimgbank,url;
      switch (method) {
        case 41:
          textbank = "ACBbank";
          bankName = "Ngân hàng TMCP Á Châu (ACB)";
          bankBranch = "Chi nhánh Tp. Hồ Chí Minh";
          accountNumber = "190862589";
          urlimgbank = "https://res.ivivu.com/payment/img/banklogo/2.acb.png";
          url = 'https://online.acb.com.vn/acbib';
          break;
        case 42:
          textbank = "Vietcombank";
          bankName = "Ngân TMCP Ngoại Thương Việt Nam (VCB)";
          bankBranch = "Chi nhánh Tp. Hồ Chí Minh";
          accountNumber = "007 1000 895 230";
          urlimgbank = "https://res.ivivu.com/payment/img/banklogo/1.vietcombank.png";
          url = 'https://www.vietcombank.com.vn/IBanking2020';
          break;
        case 45:
          textbank = "Vietinbank";
          bankName = "Ngân hàng TMCP Công thương Việt Nam VietinBank";
          bankBranch = "Chi Nhánh 03, Tp.HCM";
          accountNumber = "1110 0014 2852";
          urlimgbank = "https://res.ivivu.com/payment/img/banklogo/3.viettinbank.png";
          url = 'https://ebanking.vietinbank.vn/rcas';
          break;
        case 44:
          textbank = "Techcombank";
          bankName = "NH TMCP Kỹ Thương Việt Nam (Techcombank)";
          bankBranch = "Chi nhánh Trần Quang Diệu, Tp.HCM";
          accountNumber = "19128840912016";
          urlimgbank = "https://res.ivivu.com/payment/img/banklogo/4.techcombank.png";
          url = 'https://ib.techcombank.com.vn/servlet/BrowserServlet';
          break;
        case 43:
          textbank = "Dongabank";
          bankName = "NH TMCP Đông Á (DongABank)";
          bankBranch = "Chi nhánh Lê Văn Sỹ, Tp.HCM";
          accountNumber = "0139 9166 0002";
          urlimgbank = "https://res.ivivu.com/payment/img/banklogo/5.dongabank.png";
          url = 'https://ebanking.dongabank.com.vn/khcn/';
          break;
        case 47:
          textbank = "Agribank";
          bankName = "Ngân hàng Agribank";
          bankBranch = "Chi Nhánh 03, Tp.HCM";
          accountNumber = "160 2201 361 086";
          urlimgbank = "https://res.ivivu.com/payment/img/banklogo/6.agribank.png";
          url = 'https://ibank.agribank.com.vn/ibank';
          break;
        case 48:
          textbank = "BIDV";
          bankName = "NH TM CP Đầu Tư và Phát Triển Việt Nam (BIDV)";
          bankBranch = "Chi Nhánh 02, Tp.HCM";
          accountNumber = "130 147 4890";
          urlimgbank = "https://res.ivivu.com/payment/img/banklogo/7.bidv.png";
          url = 'https://www.bidv.vn:81/iportalweb/iRetail@1';
          break;
        case 46:
          textbank = "Sacombank";
          bankName = "Ngân Hàng TMCP Sài Gòn Thương Tín (Sacombank)";
          bankBranch = "Chi nhánh Cao Thắng, Tp.HCM";
          accountNumber = "060 0952 73354";
          urlimgbank = "https://res.ivivu.com/payment/img/banklogo/8.sacombank.png";
          url = 'https://www.isacombank.com.vn/corp/AuthenticationController?FORMSGROUP_ID__=AuthenticationFG&__START_TRAN_FLAG__=Y&FG_BUTTONS__=LOAD&ACTION.LOAD=Y&AuthenticationFG.LOGIN_FLAG=1&BANK_ID=303&LANGUAGE_ID=003';
          break;
        case 50:
          textbank = "HDBank";
          bankName = "Ngân hàng HDBANK";
          bankBranch = "Chi nhánh Sài gòn";
          accountNumber = "052704070018649";
          urlimgbank = "https://res.ivivu.com/payment/img/banklogo/hdb-icon.png";
          url = 'https://ebanking.hdbank.vn/ipc/vi/';
          break;
        case 49:
          textbank = "SCB";
          bankName = "Ngân Hàng Sài Gòn (SCB)";
          bankBranch = "Chi nhánh Phú Đông";
          accountNumber = "023 0109 7937 00001";
          urlimgbank = "https://res.ivivu.com/payment/img/banklogo/scb-icon.png";
          url = 'https://ebanking.scb.com.vn/?module=login';
          break;
        case 53:
          textbank = "OCB";
          bankName = "Ngân hàng Phương Đông (OCB)";
          bankBranch = "Chợ Lớn, TP.HCM";
          accountNumber = "001 7101 6190 02045";
          urlimgbank = "https://res.ivivu.com/payment/img/banklogo/ocb-logo.png";
          url = 'https://omni.ocb.com.vn/frontend-web/app/auth.html#/login';
          break;
        default:
          textbank = "ACBbank";
          bankName = "Ngân hàng TMCP Á Châu (ACB)";
          bankBranch = "Chi nhánh Tp. Hồ Chí Minh";
          accountNumber = "190862589";
          urlimgbank = "https://res.ivivu.com/payment/img/banklogo/2.acb.png";
          url = 'https://online.acb.com.vn/acbib';
        break;
      }
      return { textbank: textbank, bankName: bankName,bankBranch: bankBranch, accountNumber: accountNumber,urlimgbank:urlimgbank,url:url }
    }
          public getDayOfWeek(date) {
            let d = moment(date).format('dddd');
             let dayname ='', daynameshort ='',daynamedaterange='';
             switch (d) {
               case "Monday":
                 dayname = "Thứ 2";
                 daynameshort="T2";
                 daynamedaterange="Th 2";
                 break;
               case "Tuesday":
                 dayname = "Thứ 3";
                 daynameshort="T3";
                 daynamedaterange="Th 3";
                 break;
               case "Wednesday":
                 dayname = "Thứ 4";
                 daynameshort="T4";
                 daynamedaterange="Th 4";
                 break;
               case "Thursday":
                 dayname = "Thứ 5";
                 daynameshort="T5";
                 daynamedaterange="Th 5";
                 break;
               case "Friday":
                 dayname = "Thứ 6";
                 daynameshort="T6";
                 daynamedaterange="Th 6";
                 break;
               case "Saturday":
                 dayname = "Thứ 7";
                 daynameshort="T7";
                 daynamedaterange="Th 7";
                 break;
               default:
                 dayname = "Chủ nhật";
                 daynameshort="CN";
                 daynamedaterange="CN";
                 break;
             }
           return { dayname: dayname,daynameshort: daynameshort,daynamedaterange: daynamedaterange  }
         }
      
          public checkExistsIndex(array,idx){
            return array.find((item) => {
               return item == idx;
            })
          }
      
          checkExistsItemInArray(arrays: any, item: any, type: any) {
            var res = false;
            if (type == 'trip') {
              res = arrays.some(r => r.id == item.id);
            }
            if(type == 'experiencesearch' || 'blog'){
              res = arrays.some(r => r.id == item.id);
            }
            if(type=='filtername'){
              res = arrays.some(r => r == item);
            }
            if(type=='order'){
              res = arrays.some(r => r.booking_id == item.booking_id);
            }
            if(type=='request'){
              res = arrays.some(r => r.request_id == item.request_id);
            }
            if(type == 'cathay'){
              res = arrays.some(r => r.insurance_code == item.insurance_code);
            }
            if(type == 'area'){
              res = arrays.some(r => r.areaName == item.areaName);
            }
            if(type == 'areavn'){
              res = arrays.some(r => r.countryCode == 'VN');
            }
            if(type == 'listlastsearchRegion' || type=='listlastsearch'){
              res = arrays.some(r => r.code == item.code);
            }
            if(type == 'listlastsearchHot'){
              res = arrays.some(r => r.expId == item.expId);
            }
            if(type == 'ticketslide'){
              res = arrays.some(r => r.experienceId == item.experienceId);
            }
            return res;
          }
      
          public removeItemInArrayByName(array,item){
            array.forEach( (arrayItem, index) => {
              if(arrayItem.name == item.name) array.splice(index,1);
            });
          }
        
          public removeItem(array,itemcheck){
            array.forEach( (item, index) => {
              if(item == itemcheck) array.splice(index,1);
            });
         }
      
         public removeItemInArray(array,item){
          array.forEach( (arrayItem, index) => {
            if(arrayItem.id == item.id) array.splice(index,1);
          });
       }
      
         public async showToastWarning(msg){
          let alert = await this.toastCtrl.create(({
            message: msg,
            duration: 3000,
            position: "top"
          }))
          alert.present();
        }
      
        public setActivatedTab(tabIndex){
          var objTab = window.document.querySelectorAll('ion-tab-bar');
          if(objTab && objTab.length >0){
            var tab:any = objTab[objTab.length-1];
            if(tab){
              setTimeout(() => {
                //$(tab.children.item( (tabIndex-1)*2 )).addClass('tab-selected');
                //$(tab.children.item( (tabIndex-1)*2 )).attr('aria-selected','true');
                $(tab.children.item( (tabIndex-1)*2 ))?.attr('aria-selected','true')?.siblings()?.attr('aria-selected','false');
              }, 500);
                
            }
          }
         }
      
         /**
          * Đẩy token + memberid lưu xuống db
          * @param devicetoken key token của device
          * @param authentoken key id member user
          */
         pushTokenAndMemberID(authentoken, devicetoken, appversion){
          var se = this;
          let headers;
          let strUrl;
          console.log(devicetoken);
          if (authentoken) {
              var text = "Bearer " + authentoken;
              headers = {
                'cache-control': 'no-cache',
                    'content-type': 'application/json-patch+json',
                    authorization: text
              };
              strUrl = C.urls.baseUrl.urlMobile +'/mobile/OliviaApis/PushTokenOfUser';
          }else{
            headers = {
              'cache-control': 'no-cache',
                  'content-type': 'application/json-patch+json',
            };
            strUrl = C.urls.baseUrl.urlMobile +'/mobile/OliviaApis/PushTokenUser';
          }
          
       
            let body = { tokenId: devicetoken, appVersion: appversion ? appversion.replace(/\./g, '') : '352',source:6 };
         
            this.RequestApi('POST', strUrl, headers, body, 'globalfunction', 'pushTokenAndMemberID').then((data)=>{
            })
        }
      
        DeleteTokenOfUser(deviceToken, userToken, appversion) {
          var se = this;
          if (userToken) {
              var text = "Bearer " + userToken;
              let headers = {
                'cache-control': 'no-cache',
                    'content-type': 'application/json-patch+json',
                    authorization: text
              };
              let body = { tokenId: deviceToken, appVersion: appversion.replace(/\./g, '') };
              let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/DeleteNotificationTokenOfUser';
              this.RequestApi('POST', strUrl, headers, body, 'globalfunction', 'DeleteTokenOfUser').then((data)=>{
              })
          }
      }
      
      async getAppVersion() {
      let info = await  App.getInfo();
        return info.version.replace(/\./g, '');
      }
      
        /**
        * Hàm gọi api chung
        * @param methodFunc phương thức GET/POST
        * @param strUrl Chuỗi api
        * @param headerObj object header nếu có
        * @param bodyObj object body nếu có
        * @param pageName Tên page gọi api
        * @param funcName Tên fucntion gọi api
        */
        async RequestApi(methodFunc, strUrl, headerObj, bodyObj, pageName, funcName): Promise<any> {
          var se = this; 
          return new Promise(
              (resolve, reject) => {
                if(methodFunc == 'GET'){
                  se.httpClient.get(strUrl, {headers: headerObj}).pipe(debounceTime(60000)).subscribe((data:any)=> {
                    if(data && data.StatusCode && data.StatusCode == 401){
                      resolve({statusCode: 401})
                    }else{
                      resolve(data);
                    }
                    
                  }, error => { 
                   
                    var objError = {
                          page: pageName,
                          func: funcName,
                          message: 'error',
                          content: error,
                          type: "error",
                          //param: JSON.stringify(options)
                      };
                      C.writeErrorLog(objError,error);
                      if(error.status == 401 ){
                        resolve({statusCode: 401})
                      }
                  })
                }else{
                  if(bodyObj){
                    se.httpClient.post(strUrl, bodyObj , {headers: headerObj}).pipe(debounceTime(60000)).subscribe((data:any)=> {
                      if(data && typeof(data) == 'object'){
                        data.statusCode = 200;
                      }
                      
                      resolve(data);
                    }, error => { 
                      var objError = {
                            page: pageName,
                            func: funcName,
                            message: 'error',
                            content: error,
                            type: "error",
                            param: JSON.stringify(bodyObj)
                        };
                        C.writeErrorLog(objError,error);
                        if(error.status == 401 ){
                          resolve({statusCode: 401})
                        }
                        else if(error.status == 400 && typeof(error.error) == 'object'){
                          resolve(error.error)
                        }
                    })
                  }else{
                    se.httpClient.post(strUrl, {headers: headerObj}).pipe(debounceTime(60000)).subscribe((data:any)=> {
                      if(data && typeof(data) == 'object'){
                        data.statusCode = 200;
                      }
                      resolve(data);
                    }, error => { 
                      var objError = {
                            page: pageName,
                            func: funcName,
                            message: 'error',
                            content: error,
                            type: "error",
                            param: JSON.stringify(headerObj)
                        };
                        C.writeErrorLog(objError,error);
                        if(error.status == 401 ){
                          resolve({statusCode: 401})
                        }
                    })
                  }
                 
                }

              }
          )
        }

        /**
        * Hàm gọi api chung
        * @param methodFunc phương thức GET/POST
        * @param strUrl Chuỗi api
        * @param headerObj object header nếu có
        * @param bodyObj object body nếu có
        * @param pageName Tên page gọi api
        * @param funcName Tên fucntion gọi api
        */
   async RequestApiWithQueryString(methodFunc, strUrl, headerObj, queryObj, pageName, funcName): Promise<any> {
    var se = this; 
    return new Promise(
        (resolve, reject) => {
          var options;
          if(queryObj && headerObj ){
            options = {
              method: methodFunc,
              url: strUrl,
              qs: queryObj,
              headers: headerObj,
              timeout: 180000,
              maxAttempts: 3,
              retryDelay: 2000
            }
          }

          se.httpClient.get(strUrl, {headers: headerObj, params: queryObj}).pipe(debounceTime(60000)).subscribe((data:any)=> {
            if(data && data.StatusCode && data.StatusCode == 401){
              resolve({statusCode: 401})
            }else{
              resolve(data);
            }
            
          }, error => { 
           
            var objError = {
                  page: pageName,
                  func: funcName,
                  message: 'error',
                  content: error,
                  type: "error",
                  //param: JSON.stringify(options)
              };
              C.writeErrorLog(objError,error);
              if(error.status == 401 ){
                resolve({statusCode: 401})
              }
          })
        }
    )
  }
  
        hideStatusBar(){
          var se = this;
          let el = window.document.getElementsByClassName('div-statusbar-float');
            el[0].classList.remove('float-statusbar-enabled');
            el[0].classList.add('float-statusbar-disabled');
        }
      //Tạo booking food
      public CreateBooking(objbook): Promise<any>{
        return new Promise((resolve, reject) => {
          let strUrl =  C.urls.baseUrl.urlFood+'/api/FOBooking/CreateBooking';
          let headers ={
                'Content-Type': 'application/json',
                'token': '584f470f-7a45-4793-a136-0084fadea81c'
              };
          this.RequestApi('POST', strUrl, headers, JSON.stringify(objbook), 'globalFunction', 'CreateBooking').then((data) => {
            resolve(data);
          })
          // var options = {
          //   'method': 'POST',
          //   'url': C.urls.baseUrl.urlFood+'/api/FOBooking/CreateBooking',
          //   'headers': {
          //     'Content-Type': 'application/json',
          //     'token': '584f470f-7a45-4793-a136-0084fadea81c'
          //   },
          //   body: JSON.stringify(objbook)
          
          // };
          // request(options, function (error, response) { 
          //   if (error) throw new Error(error);
          //   resolve(response.body);
          // });
        })
        
      }
       //Gửi yêu cầu food
       public sendRequest(objbook): Promise<any>{
        return new Promise((resolve, reject) => {
          let headers ={
            'Content-Type': 'application/json',
          };
          let strUrl = C.urls.baseUrl.urlERPFood+'api/erp/Email/getEmail_Request';
          this.RequestApi('POST', strUrl, headers, JSON.stringify(objbook), 'globalFunction', 'CreateBooking').then((data) => {
            resolve(data);
          })
          // var options = {
          //   'method': 'POST',
          //   'url': C.urls.baseUrl.urlERPFood+'api/erp/Email/getEmail_Request',
          //   'headers': {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify(objbook)
          
          // };
          // request(options, function (error, response) { 
          //   if (error) throw new Error(error);
          //   resolve(response.body);
          // });
        })
        
      }
      public Updatefoodpaytype(bookingCode,paymentMethod): Promise<any>{
        return new Promise((resolve, reject) => {
          // var options = {
          //   'method': 'GET',
          //   'url': C.urls.baseUrl.urlContracting+'/update-food-paytype?token=3b760e5dcf038878925b5613c32615ea3&bookingCode='+bookingCode+'&paymentMethod='+paymentMethod+'',
          //   'headers': {
          //   }
          // };
          // request(options, function (error, response) { 
          //   if (error) throw new Error(error);
          //   resolve(true);
          // });
          let strUrl = C.urls.baseUrl.urlContracting+'/update-food-paytype?token=3b760e5dcf038878925b5613c32615ea3&bookingCode='+bookingCode+'&paymentMethod='+paymentMethod+'';
          this.RequestApi('GET', strUrl, {}, {}, 'globalFunction', 'Updatefoodpaytype').then((data) => {
            resolve(true);
          })
        })
        
        
      }
         //Liên kết payoo
         public CreatePayoo(url): Promise<any>{
          return new Promise((resolve, reject) => {
            // var options = {
            //   'method': 'POST',
            //   'url': url,
            //   'headers': {
            //     'Cookie': 'ASP.NET_SessionId=1zuyjhynxivxfmups4llel5v'
            //   }
            // };
            // request(options, function (error, response) { 
            //   if (error) throw new Error(error);
            //   resolve(response.body);
            // });
            
            this.RequestApi('POST', url, {"Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",'Content-Type' : 'application/json'}, {}, 'globalFunction', 'CreatePayoo').then((data) => {
              resolve(data);
            })
          })
        }
          //Check payoo
      public Checkpayment(url): Promise<any>{
        return new Promise((resolve, reject) => {
          let headers = {
                "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                'Content-Type': 'application/json;'
              };
          this.RequestApi('GET', url, headers, {}, 'globalFunction', 'Checkpayment').then((data) => {
            resolve(data);
          })
        })
      }
      public CheckPaymentTour(url): Promise<any>{
        return new Promise((resolve, reject) => {
          let header = {
                apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
                apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
              }
          this.RequestApi('GET', url, header, {}, 'globalfunction', 'CheckPaymentTour').then((data)=>{
            resolve(data);
          })
        })
      } 
      
      public CheckpaymentFood(url): Promise<any>{
        return new Promise((resolve, reject) => {
          this.RequestApi('GET', url, {"Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",'Content-Type' : 'application/json'}, {}, 'globalFunction', 'CheckpaymentFood').then((data) => {
            resolve(data);
          })
        })
      }
       //GeTokensOfMember
      public GeTokensOfMember(jti): Promise<any>{
      {
        return new Promise((resolve, reject) => {
          let headers = {
                'apikey': 'sx25k7TABO6W4ULFjfxoJJaLjQr0wUGxYCph1TQiTBM',
                'apisecret': 'wZH8vCalp5-ZsUzJiP1IP6V2beWUm0ej8G_25gzg2xg'
              };
          let strUrl = C.urls.baseUrl.urlMobile+'/api/Dashboard/GeTokensOfMember?memberid='+jti+'';
          this.RequestApi('POST', strUrl, headers, {}, 'globalFunction', 'GeTokensOfMember').then((data) => {
            resolve(data);
          })
        })
       
      }
      }
      //check hạn thanh toán
      public CheckPaymentDate(booking): Promise<any>{
        let url=C.urls.baseUrl.urlContracting+'/booking-crm?bookingcode='+booking+'';
        return new Promise((resolve, reject) => {
          let headers = {"Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",'Content-Type' : 'application/json'};
          let strUrl = C.urls.baseUrl.urlContracting+'/booking-crm?bookingcode='+booking+'';
          this.RequestApi('GET', strUrl, headers, {}, 'globalFunction', 'CheckPaymentDate').then((data) => {
            resolve(data);
          })
        })
      }

      async checkAllowPayment(bookingCode): Promise<any>{
        let url =C.urls.baseUrl.urlFlight+"/gate/apiv1/checkAllowPayment/"+bookingCode;
        return new Promise((resolve, reject) => {
          this.RequestApi('GET', url, {}, {}, 'globalFunction', 'CheckPaymentDate').then((data) => {
            resolve(data);
          })
        })
      }


      async showAlertCancelPayment(){
        var se = this;
        let alert = await this.alertCtrl.create({
          message: 'Giao dịch đã được hủy. Quý khách vui lòng quay lại trang tìm kiếm!',
          cssClass: "cls-alert-cancelpayment",
          backdropDismiss: false,
          buttons: [
          {
            text: 'OK',
            role: 'OK',
            handler: () => {
              se.navCtrl.navigateBack('/flightsearchresult');
              alert.dismiss();
            }
          }
        ]
      });
      alert.present();
      }

      async showAlertMessage(msg,title){
        var se = this;
        let alert = await this.alertCtrl.create({
          header: title,
          message: msg,
          cssClass: "cls-alert-message",
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

      public async showAlertMessageOnly(msg){
        let alert = await this.alertCtrl.create({
          header: '',
          message: msg,
          cssClass: "cls-alert-message",
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

      async showAlertErrorMessage(){
        var se = this;
        let alert = await this.alertCtrl.create({
          message: 'Rất tiếc đã có lỗi xảy ra. Quý khách vui lòng quay lại trang tìm kiếm!',
          cssClass: "cls-alert-cancelpayment",
          backdropDismiss: false,
          buttons: [
          {
            text: 'OK',
            role: 'OK',
            handler: () => {
              se.goToSearchFlight(0);
              alert.dismiss();
            }
          }
        ]
      });
      alert.present();
      }

      
        public getNetworkStatus() {
          return this.isOnline;
        }
        public setNetworkStatus(value) {
            this.isOnline = value;
        }
      
        public async showConfirm(msg){
          let alert = await this.alertCtrl.create({
            message: msg,
            cssClass: 'cls-global-confirm',
            buttons: [
            {
              text: 'Để sau',
              handler: () => {
                this.storage.remove('auth_token');
                this.storage.remove('email');
                this.storage.remove('username');
                this.storage.remove('jti');
                this.storage.remove('userInfoData');
                this.storage.remove('userRewardData');
                this.storage.remove('point');
                this.storage.remove('blogtripdefault');
                this.storage.remove('infocus');
                this.navCtrl.navigateBack('/');
              }
            },
            {
              text: 'Đăng nhập',
              role: 'OK',
              handler: () => {
                this.storage.remove('auth_token');
                this.storage.remove('email');
                this.storage.remove('username');
                this.storage.remove('jti');
                this.storage.remove('userInfoData');
                this.storage.remove('userRewardData');
                this.storage.remove('point');
                this.storage.remove('blogtripdefault');
                //this.valueGlobal.logingoback = "MainPage";
                this.navCtrl.navigateForward('/login');
              }
              }
            ]
          });
          alert.present();
        }
      
        public clearActivatedTab() {
          var objTab = window.document.querySelectorAll('ion-tab-bar');
          if (objTab && objTab.length > 0) {
              objTab.forEach((element:any) => {
                  if (element) {
                      //clear current activcetab
                      for(let i= 1; i <=5; i++){
                          $(element.children.item((i - 1) * 2)).attr('aria-selected', 'false');
                      }
                  }
              });
          }
      }
      
        // public hiddenHeader(){
        //   let headerelement = window.document.getElementsByTagName('ion-header');
        //   if(headerelement && headerelement.length >0){
        //     setTimeout(()=>{
        //       headerelement[0].classList.add('float-statusbar-disabled');
        //     },150)
        //   }
        // }
        public showHeader(){
          let headerelement = window.document.getElementsByTagName('ion-header');
          if(headerelement && headerelement.length >0){
            setTimeout(()=>{
              headerelement[0].classList.remove('float-statusbar-disabled');
            },150)
          }
        }
      
        async getMultipleFiles(filePaths: string[]): Promise<File[]> {
          // Get FileEntry array from the array of image paths
          const fileEntryPromises: Promise<FileEntry>[] = filePaths.map(filePath => {
            return this.ionicFileService.resolveLocalFilesystemUrl(filePath);
          }) as Promise<FileEntry>[];
      
          const fileEntries: FileEntry[] = await Promise.all(fileEntryPromises);
      
          // Get a File array from the FileEntry array. NOTE that while this looks like a regular File, it does
          // not have any actual data in it. Only after we use a FileReader will the File object contain the actual
          // file data
          const CordovaFilePromises: Promise<IFile>[] = fileEntries.map(fileEntry => {
            return this.convertFileEntryToCordovaFile(fileEntry);
          });
      
          const cordovaFiles: IFile[] = await Promise.all(CordovaFilePromises);
      
          // Use FileReader on each File object to read the actual file data into the file object
          const filePromises: Promise<File>[] = cordovaFiles.map(cordovaFile => {
            return this.convertCordovaFileToJavascriptFile(cordovaFile)
          });
      
          // When this resolves, it will return a list of File objects, just as if you had used the regular web
          // file input. These can then be appended to FormData and uploaded.
          return await Promise.all(filePromises);
        }
      
        async getSingleFile(filePath: string): Promise<File> {
          // Get FileEntry from image path
          const fileEntry: FileEntry = await this.ionicFileService.resolveLocalFilesystemUrl(filePath) as FileEntry;
      
          // Get File from FileEntry. Again note that this file does not contain the actual file data yet.
          const cordovaFile: IFile = await this.convertFileEntryToCordovaFile(fileEntry);
      
          // Use FileReader on each object to populate it with the true file contents.
          return this.convertCordovaFileToJavascriptFile(cordovaFile);
        }
      
        private convertFileEntryToCordovaFile(fileEntry: FileEntry): Promise<IFile> {
          return new Promise<IFile>((resolve, reject) => {
            fileEntry.file(resolve, reject);
          })
        }
      
        private convertCordovaFileToJavascriptFile(cordovaFile: IFile): Promise<File> {
          return new Promise<File>((resolve, reject) => {
            const reader:any = new FileReader();
            reader.onloadend = () => {
              if (reader.error) {
                reject(reader.error);
              } else {
                const blob: any = new Blob([reader.result], { type: cordovaFile.type });
                blob.lastModifiedDate = new Date();
                blob.name = cordovaFile.name;
                resolve(blob as File);
              }
            };
            reader.readAsArrayBuffer(cordovaFile);
          });
      
        }
      
        
          /**
         * Chuyển ký tự font VNi vd: â - a ...
         */
        convertFontVNI(obj){
          if(obj.indexOf('đ') != -1 || obj.indexOf('Đ') != -1){
            obj = obj.replace(/\đ/g,'d').replace(/\Đ/g,'D');
          }
          if(obj.indexOf('ă') != -1 || obj.indexOf('Ă') != -1){
            obj = obj.replace(/\ă/g,'a').replace(/\Ă/g,'A');
          }
          if(obj.indexOf('â') != -1 || obj.indexOf('Â') != -1){
            obj = obj.replace(/\â/g,'a').replace(/\Â/g,'A');
          }
          if(obj.indexOf('á') != -1 || obj.indexOf('Á') != -1){
            obj = obj.replace(/\á/g,'a').replace(/\Á/g,'A');
          }
          if(obj.indexOf('à') != -1 || obj.indexOf('À') != -1){
            obj = obj.replace(/\à/g,'a').replace(/\À/g,'A');
          }
          if(obj.indexOf('ằ') != -1 || obj.indexOf('Ằ') != -1){
            obj = obj.replace(/\ằ/g,'a').replace(/\Ằ/g,'A');
          }
          if(obj.indexOf('ấ') != -1 || obj.indexOf('Ấ') != -1){
            obj = obj.replace(/\ấ/g,'a').replace(/\Ấ/g,'A');
          }
          if(obj.indexOf('ầ') != -1 || obj.indexOf('Ầ') != -1){
            obj = obj.replace(/\ầ/g,'a').replace(/\Ầ/g,'A');
          }
          if(obj.indexOf('ẵ') != -1 || obj.indexOf('Ẵ') != -1){
            obj = obj.replace(/\ẵ/g,'a').replace(/\Ẵ/g,'A');
          }
          if(obj.indexOf('ặ') != -1 || obj.indexOf('Ặ') != -1){
            obj = obj.replace(/\ặ/g,'a').replace(/\Ặ/g,'A');
          }
          if(obj.indexOf('ậ') != -1 || obj.indexOf('Ậ') != -1){
            obj = obj.replace(/\ậ/g,'a').replace(/\Ậ/g,'A');
          }
          if(obj.indexOf('ạ') != -1 || obj.indexOf('Ạ') != -1){
            obj = obj.replace(/\ạ/g,'a').replace(/\Ạ/g,'A');
          }
          if(obj.indexOf('à') != -1 || obj.indexOf('À') != -1){
              obj = obj.replace(/\à/g,'a').replace(/\À/g,'A');
            }
            if(obj.indexOf('ả') != -1 || obj.indexOf('Ả') != -1){
              obj = obj.replace(/\ả/g,'a').replace(/\Ả/g,'A');
            }
          
          if(obj.indexOf('ê') != -1 || obj.indexOf('Ê') != -1){
            obj = obj.replace(/\ê/g,'e').replace(/\Ê/g,'E');
          }
          if(obj.indexOf('é') != -1 || obj.indexOf('É') != -1){
            obj = obj.replace(/\é/g,'e').replace(/\É/g,'E');
          }
          if(obj.indexOf('è') != -1 || obj.indexOf('È') != -1){
            obj = obj.replace(/\è/g,'e').replace(/\È/g,'E');
          }
          if(obj.indexOf('ẻ') != -1 || obj.indexOf('Ẻ') != -1){
            obj = obj.replace(/\ẻ/g,'e').replace(/\Ẻ/g,'E');
          }
          if(obj.indexOf('ẽ') != -1 || obj.indexOf('Ẽ') != -1){
            obj = obj.replace(/\ẽ/g,'e').replace(/\Ẽ/g,'E');
          }
          if(obj.indexOf('ệ') != -1 || obj.indexOf('Ệ') != -1){
            obj = obj.replace(/\ệ/g,'e').replace(/\Ệ/g,'E');
          }
          if(obj.indexOf('ễ') != -1 || obj.indexOf('Ễ') != -1){
            obj = obj.replace(/\ễ/g,'e').replace(/\Ễ/g,'E');
          }
          if(obj.indexOf('ẹ') != -1 || obj.indexOf('Ẹ') != -1){
            obj = obj.replace(/\ẹ/g,'e').replace(/\Ẹ/g,'E');
          }
          if(obj.indexOf('ế') != -1 || obj.indexOf('Ế') != -1){
            obj = obj.replace(/\ế/g,'e').replace(/\Ế/g,'E');
          }
          if(obj.indexOf('ể') != -1 || obj.indexOf('Ể') != -1){
            obj = obj.replace(/\ể/g,'e').replace(/\Ể/g,'E');
          }
          if(obj.indexOf('ề') != -1 || obj.indexOf('Ề') != -1){
            obj = obj.replace(/\ề/g,'e').replace(/\Ề/g,'E');
          }
      
          if(obj.indexOf('ô') != -1 || obj.indexOf('Ô') != -1){
            obj = obj.replace(/\ô/g,'o').replace(/\Ô/g,'O');
          }
          if(obj.indexOf('ồ') != -1 || obj.indexOf('Ồ') != -1){
            obj = obj.replace(/\ồ/g,'o').replace(/\Ồ/g,'O');
          }
          if(obj.indexOf('ố') != -1 || obj.indexOf('Ố') != -1){
            obj = obj.replace(/\ố/g,'o').replace(/\Ố/g,'O');
          }
          if(obj.indexOf('ổ') != -1 || obj.indexOf('Ổ') != -1){
            obj = obj.replace(/\ổ/g,'o').replace(/\Ổ/g,'O');
          }
          if(obj.indexOf('ộ') != -1 || obj.indexOf('Ộ') != -1){
            obj = obj.replace(/\ộ/g,'o').replace(/\Ộ/g,'O');
          }
          if(obj.indexOf('ỗ') != -1 || obj.indexOf('Ỗ') != -1){
            obj = obj.replace(/\ỗ/g,'o').replace(/\Ỗ/g,'O');
          }
          if(obj.indexOf('ọ') != -1 || obj.indexOf('Ọ') != -1){
            obj = obj.replace(/\ọ/g,'o').replace(/\Ọ/g,'O');
          }
          if(obj.indexOf('ò') != -1 || obj.indexOf('Ò') != -1){
            obj = obj.replace(/\ò/g,'o').replace(/\Ò/g,'O');
          }
          if(obj.indexOf('ơ') != -1 || obj.indexOf('Ơ') != -1){
            obj = obj.replace(/\ơ/g,'o').replace(/\Ơ/g,'O');
          }
          if(obj.indexOf('ờ') != -1 || obj.indexOf('Ờ') != -1){
            obj = obj.replace(/\ờ/g,'o').replace(/\Ờ/g,'O');
          }
          if(obj.indexOf('ớ') != -1 || obj.indexOf('Ớ') != -1){
            obj = obj.replace(/\ớ/g,'o').replace(/\Ớ/g,'O');
          }
          if(obj.indexOf('ở') != -1 || obj.indexOf('Ở') != -1){
            obj = obj.replace(/\ở/g,'o').replace(/\Ở/g,'O');
          }
          if(obj.indexOf('ợ') != -1 || obj.indexOf('Ợ') != -1){
            obj = obj.replace(/\ợ/g,'o').replace(/\Ợ/g,'O');
          }
          if(obj.indexOf('ỡ') != -1 || obj.indexOf('Ỡ') != -1){
            obj = obj.replace(/\ỡ/g,'o').replace(/\Ỡ/g,'O');
          }
      
          if(obj.indexOf('ú') != -1 || obj.indexOf('Ú') != -1){
            obj = obj.replace(/\ú/g,'u').replace(/\Ú/g,'U');
          }
          if(obj.indexOf('ù') != -1 || obj.indexOf('Ù') != -1){
            obj = obj.replace(/\ù/g,'u').replace(/\Ù/g,'U');
          }
          if(obj.indexOf('ủ') != -1 || obj.indexOf('Ủ') != -1){
            obj = obj.replace(/\ủ/g,'u').replace(/\Ủ/g,'U');
          }
          if(obj.indexOf('ũ') != -1 || obj.indexOf('Ũ') != -1){
            obj = obj.replace(/\ũ/g,'u').replace(/\Ũ/g,'U');
          }
          if(obj.indexOf('ụ') != -1 || obj.indexOf('Ụ') != -1){
            obj = obj.replace(/\ụ/g,'u').replace(/\Ụ/g,'U');
          }
          if(obj.indexOf('ư') != -1 || obj.indexOf('Ư') != -1){
            obj = obj.replace(/\ư/g,'u').replace(/\Ư/g,'U');
          }
          if(obj.indexOf('ừ') != -1 || obj.indexOf('Ừ') != -1){
            obj = obj.replace(/\ừ/g,'u').replace(/\Ừ/g,'U');
          }
          if(obj.indexOf('ứ') != -1 || obj.indexOf('Ứ') != -1){
            obj = obj.replace(/\ứ/g,'u').replace(/\Ứ/g,'U');
          }
          if(obj.indexOf('ử') != -1 || obj.indexOf('Ử') != -1){
            obj = obj.replace(/\ử/g,'u').replace(/\Ử/g,'U');
          }
          if(obj.indexOf('ự') != -1 || obj.indexOf('Ự') != -1){
            obj = obj.replace(/\ự/g,'u').replace(/\Ự/g,'U');
          }
          if(obj.indexOf('ữ') != -1 || obj.indexOf('Ữ') != -1){
            obj = obj.replace(/\ữ/g,'u').replace(/\Ữ/g,'U');
          }
      
          if(obj.indexOf('í') != -1 || obj.indexOf('Í') != -1){
            obj = obj.replace(/\í/g,'i').replace(/\Í/g,'I');
          }
          if(obj.indexOf('ì') != -1 || obj.indexOf('Ì') != -1){
            obj = obj.replace(/\ì/g,'i').replace(/\Ì/g,'I');
          }
          if(obj.indexOf('ỉ') != -1 || obj.indexOf('Ỉ') != -1){
            obj = obj.replace(/\ỉ/g,'i').replace(/\Ỉ/g,'I');
          }
          if(obj.indexOf('ĩ') != -1 || obj.indexOf('Ĩ') != -1){
            obj = obj.replace(/\ĩ/g,'i').replace(/\Ĩ/g,'I');
          }
          if(obj.indexOf('ị') != -1 || obj.indexOf('Ị') != -1){
            obj = obj.replace(/\ị/g,'i').replace(/\Ị/g,'I');
          }
          
      
          return obj;
        }

        public createTransactionCombo(HotelCode,FlightCode,DepartATCode,ReturnATCode): Promise<any>{
          return new Promise((resolve, reject) => {
            // var options_1 = {
            //   method: 'POST',
            //   url: C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateTransactionIDCombo',
            //   headers:
            //   {
            //     'Content-Type': 'application/x-www-form-urlencoded'
            //   },
            //   form:
            //   {
            //     HotelCode: HotelCode,
            //     FlightCode: FlightCode,
            //     DepartATCode: DepartATCode,
            //     ReturnATCode:ReturnATCode,
            //   }
            // };
            let headers = {
              'Content-Type': 'application/x-www-form-urlencoded'
            };
            let body=`HotelCode=${HotelCode}&FlightCode=${FlightCode}&DepartATCode=${DepartATCode}&ReturnATCode=${ReturnATCode}`;
            let strUrl = C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateTransactionIDCombo';
            this.RequestApi('POST', strUrl, headers, body, 'globalfunction', 'DeleteTokenOfUser').then((data)=>{
              if (data.Error) {
                var error1 = {
                  page: "flightcomboadddetails",
                  func: "CreateTransactionIDCombo",
                  message: data.Error,
                  content: data,
                  type: "warning",
                  param: JSON.stringify(body)
                };
                C.writeErrorLog(error1, data);
                resolve(false);
              } else {
                resolve(true);
              }
            })
          })
          
        }
        //hold combo vmb
        public holdflight(flyBookingCode,iddepart,idreturn): Promise<any>{
          return new Promise((resolve, reject) => {
          // var options_2 = {
          //   'method': 'GET',
          //   'url': C.urls.baseUrl.urlMobile + '/get-pnr-flight?reservationNo=' + flyBookingCode + '&cacheDepartId=' + iddepart + '&cacheReturnId=' + idreturn + '',
          //   'headers': {
          //   }
          // };
          let headers = {};
          let strUrl = C.urls.baseUrl.urlMobile + '/get-pnr-flight?reservationNo=' + flyBookingCode + '&cacheDepartId=' + iddepart + '&cacheReturnId=' + idreturn + '';
          this.RequestApi('GET', strUrl, headers, {}, 'globalfunction', 'holdflight').then((data)=>{
            var obj = data;
            var depcode = "";
            var retcode = "";
            if (obj.length > 0) {
              var objAll = obj.filter((item) => { return item.name == "All" });
              var objDepart = obj.filter((item) => { return item.name == "Depart" });
              var objReturn = obj.filter((item) => { return item.name == "Return" });
              //Giữ vé được cả 2 chiều
              if (objAll && objAll.length > 0) {
                depcode = objAll[0].value;
                retcode = objAll[0].value;
              }
              //Giữ vé được chiều đi
              if (objDepart && objDepart.length > 0) {
                depcode = objDepart[0].value;
              }
              //Giữ vé được chiều đi
              if (objReturn && objReturn.length > 0) {
                retcode = objReturn[0].value;
              }
            }
            var objfly={depcode:depcode,retcode:retcode};
            resolve(objfly);
          });
          })
          
        }
        convertNumberToString(input){
          let output =  input.toLocaleString().replace(/\,/g,'').replace(/\./g,'').toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
          return output;
        }
      
        convertStringToNumber(input){
          let output:any = input ? input.toLocaleString().replace(/\,/g,'').replace(/\./g,'').replace(/\:/g,'')*1 : 0;
          return output;
        }

        convertNumberToDouble(input){
          let ip = input.toLocaleString().replace(/\,/g,'').replace(/\./g,'').replace(/\:/g,'')*1;
          let output =  Number(ip);
          return output;
        }

        convertNumberFormat(input){
          if(input && (input.toString().length==1)){
            input = input.toString()+',0';
          }else if(input ==10){
            input = '10,0';
          }
          let ip = input.toLocaleString().replace(/\./g,',');
          return ip;
        }
        

        getSummaryBooking(data) : Promise<any>{
          var se = this;
          return new Promise((resolve, reject) => {
            let headers = {
              "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
              'Content-Type': 'application/json; charset=utf-8',
            };
            let strUrl = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+data.pnr.resNo;
            this.RequestApi('GET', strUrl, headers, {}, 'globalfunction', 'getSummaryBooking').then((data)=>{
                let result = data;
                resolve(result);
            })
          })
        }

        deepClone<T>(value): T{
          return clone<T>(value);
        }

        getNationList(){
          return [ 
            {name: 'Việt Nam', code: 'VN'}, 
            {name: 'Afghanistan', code: 'AF'}, 
            {name: 'Åland Islands', code: 'AX'}, 
            {name: 'Albania', code: 'AL'}, 
            {name: 'Algeria', code: 'DZ'}, 
            {name: 'American Samoa', code: 'AS'}, 
            {name: 'AndorrA', code: 'AD'}, 
            {name: 'Angola', code: 'AO'}, 
            {name: 'Anguilla', code: 'AI'}, 
            {name: 'Antarctica', code: 'AQ'}, 
            {name: 'Antigua and Barbuda', code: 'AG'}, 
            {name: 'Argentina', code: 'AR'}, 
            {name: 'Armenia', code: 'AM'}, 
            {name: 'Aruba', code: 'AW'}, 
            {name: 'Australia', code: 'AU'}, 
            {name: 'Austria', code: 'AT'}, 
            {name: 'Azerbaijan', code: 'AZ'}, 
            {name: 'Bahamas', code: 'BS'}, 
            {name: 'Bahrain', code: 'BH'}, 
            {name: 'Bangladesh', code: 'BD'}, 
            {name: 'Barbados', code: 'BB'}, 
            {name: 'Belarus', code: 'BY'}, 
            {name: 'Belgium', code: 'BE'}, 
            {name: 'Belize', code: 'BZ'}, 
            {name: 'Benin', code: 'BJ'}, 
            {name: 'Bermuda', code: 'BM'}, 
            {name: 'Bhutan', code: 'BT'}, 
            {name: 'Bolivia', code: 'BO'}, 
            {name: 'Bosnia and Herzegovina', code: 'BA'}, 
            {name: 'Botswana', code: 'BW'}, 
            {name: 'Bouvet Island', code: 'BV'}, 
            {name: 'Brazil', code: 'BR'}, 
            {name: 'British Indian Ocean Territory', code: 'IO'}, 
            {name: 'Brunei Darussalam', code: 'BN'}, 
            {name: 'Bulgaria', code: 'BG'}, 
            {name: 'Burkina Faso', code: 'BF'}, 
            {name: 'Burundi', code: 'BI'}, 
            {name: 'Cambodia', code: 'KH'}, 
            {name: 'Cameroon', code: 'CM'}, 
            {name: 'Canada', code: 'CA'}, 
            {name: 'Cape Verde', code: 'CV'}, 
            {name: 'Cayman Islands', code: 'KY'}, 
            {name: 'Central African Republic', code: 'CF'}, 
            {name: 'Chad', code: 'TD'}, 
            {name: 'Chile', code: 'CL'}, 
            {name: 'China', code: 'CN'}, 
            {name: 'Christmas Island', code: 'CX'}, 
            {name: 'Cocos (Keeling) Islands', code: 'CC'}, 
            {name: 'Colombia', code: 'CO'}, 
            {name: 'Comoros', code: 'KM'}, 
            {name: 'Congo', code: 'CG'}, 
            {name: 'Congo, The Democratic Republic of the', code: 'CD'}, 
            {name: 'Cook Islands', code: 'CK'}, 
            {name: 'Costa Rica', code: 'CR'}, 
            {name: 'Cote D\'Ivoire', code: 'CI'}, 
            {name: 'Croatia', code: 'HR'}, 
            {name: 'Cuba', code: 'CU'}, 
            {name: 'Cyprus', code: 'CY'}, 
            {name: 'Czech Republic', code: 'CZ'}, 
            {name: 'Denmark', code: 'DK'}, 
            {name: 'Djibouti', code: 'DJ'}, 
            {name: 'Dominica', code: 'DM'}, 
            {name: 'Dominican Republic', code: 'DO'}, 
            {name: 'Ecuador', code: 'EC'}, 
            {name: 'Egypt', code: 'EG'}, 
            {name: 'El Salvador', code: 'SV'}, 
            {name: 'Equatorial Guinea', code: 'GQ'}, 
            {name: 'Eritrea', code: 'ER'}, 
            {name: 'Estonia', code: 'EE'}, 
            {name: 'Ethiopia', code: 'ET'}, 
            {name: 'Falkland Islands (Malvinas)', code: 'FK'}, 
            {name: 'Faroe Islands', code: 'FO'}, 
            {name: 'Fiji', code: 'FJ'}, 
            {name: 'Finland', code: 'FI'}, 
            {name: 'France', code: 'FR'}, 
            {name: 'French Guiana', code: 'GF'}, 
            {name: 'French Polynesia', code: 'PF'}, 
            {name: 'French Southern Territories', code: 'TF'}, 
            {name: 'Gabon', code: 'GA'}, 
            {name: 'Gambia', code: 'GM'}, 
            {name: 'Georgia', code: 'GE'}, 
            {name: 'Germany', code: 'DE'}, 
            {name: 'Ghana', code: 'GH'}, 
            {name: 'Gibraltar', code: 'GI'}, 
            {name: 'Greece', code: 'GR'}, 
            {name: 'Greenland', code: 'GL'}, 
            {name: 'Grenada', code: 'GD'}, 
            {name: 'Guadeloupe', code: 'GP'}, 
            {name: 'Guam', code: 'GU'}, 
            {name: 'Guatemala', code: 'GT'}, 
            {name: 'Guernsey', code: 'GG'}, 
            {name: 'Guinea', code: 'GN'}, 
            {name: 'Guinea-Bissau', code: 'GW'}, 
            {name: 'Guyana', code: 'GY'}, 
            {name: 'Haiti', code: 'HT'}, 
            {name: 'Heard Island and Mcdonald Islands', code: 'HM'}, 
            {name: 'Holy See (Vatican City State)', code: 'VA'}, 
            {name: 'Honduras', code: 'HN'}, 
            {name: 'Hong Kong', code: 'HK'}, 
            {name: 'Hungary', code: 'HU'}, 
            {name: 'Iceland', code: 'IS'}, 
            {name: 'India', code: 'IN'}, 
            {name: 'Indonesia', code: 'ID'}, 
            {name: 'Iran, Islamic Republic Of', code: 'IR'}, 
            {name: 'Iraq', code: 'IQ'}, 
            {name: 'Ireland', code: 'IE'}, 
            {name: 'Isle of Man', code: 'IM'}, 
            {name: 'Israel', code: 'IL'}, 
            {name: 'Italy', code: 'IT'}, 
            {name: 'Jamaica', code: 'JM'}, 
            {name: 'Japan', code: 'JP'}, 
            {name: 'Jersey', code: 'JE'}, 
            {name: 'Jordan', code: 'JO'}, 
            {name: 'Kazakhstan', code: 'KZ'}, 
            {name: 'Kenya', code: 'KE'}, 
            {name: 'Kiribati', code: 'KI'}, 
            {name: 'Korea, Democratic People\'S Republic of', code: 'KP'}, 
            {name: 'Korea', code: 'KR'}, 
            {name: 'Kuwait', code: 'KW'}, 
            {name: 'Kyrgyzstan', code: 'KG'}, 
            {name: 'Lao People\'S Democratic Republic', code: 'LA'}, 
            {name: 'Latvia', code: 'LV'}, 
            {name: 'Lebanon', code: 'LB'}, 
            {name: 'Lesotho', code: 'LS'}, 
            {name: 'Liberia', code: 'LR'}, 
            {name: 'Libyan Arab Jamahiriya', code: 'LY'}, 
            {name: 'Liechtenstein', code: 'LI'}, 
            {name: 'Lithuania', code: 'LT'}, 
            {name: 'Luxembourg', code: 'LU'}, 
            {name: 'Macao', code: 'MO'}, 
            {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'}, 
            {name: 'Madagascar', code: 'MG'}, 
            {name: 'Malawi', code: 'MW'}, 
            {name: 'Malaysia', code: 'MY'}, 
            {name: 'Maldives', code: 'MV'}, 
            {name: 'Mali', code: 'ML'}, 
            {name: 'Malta', code: 'MT'}, 
            {name: 'Marshall Islands', code: 'MH'}, 
            {name: 'Martinique', code: 'MQ'}, 
            {name: 'Mauritania', code: 'MR'}, 
            {name: 'Mauritius', code: 'MU'}, 
            {name: 'Mayotte', code: 'YT'}, 
            {name: 'Mexico', code: 'MX'}, 
            {name: 'Micronesia, Federated States of', code: 'FM'}, 
            {name: 'Moldova, Republic of', code: 'MD'}, 
            {name: 'Monaco', code: 'MC'}, 
            {name: 'Mongolia', code: 'MN'}, 
            {name: 'Montserrat', code: 'MS'}, 
            {name: 'Morocco', code: 'MA'}, 
            {name: 'Mozambique', code: 'MZ'}, 
            {name: 'Myanmar', code: 'MM'}, 
            {name: 'Namibia', code: 'NA'}, 
            {name: 'Nauru', code: 'NR'}, 
            {name: 'Nepal', code: 'NP'}, 
            {name: 'Netherlands', code: 'NL'}, 
            {name: 'Netherlands Antilles', code: 'AN'}, 
            {name: 'New Caledonia', code: 'NC'}, 
            {name: 'New Zealand', code: 'NZ'}, 
            {name: 'Nicaragua', code: 'NI'}, 
            {name: 'Niger', code: 'NE'}, 
            {name: 'Nigeria', code: 'NG'}, 
            {name: 'Niue', code: 'NU'}, 
            {name: 'Norfolk Island', code: 'NF'}, 
            {name: 'Northern Mariana Islands', code: 'MP'}, 
            {name: 'Norway', code: 'NO'}, 
            {name: 'Oman', code: 'OM'}, 
            {name: 'Pakistan', code: 'PK'}, 
            {name: 'Palau', code: 'PW'}, 
            {name: 'Palestinian Territory, Occupied', code: 'PS'}, 
            {name: 'Panama', code: 'PA'}, 
            {name: 'Papua New Guinea', code: 'PG'}, 
            {name: 'Paraguay', code: 'PY'}, 
            {name: 'Peru', code: 'PE'}, 
            {name: 'Philippines', code: 'PH'}, 
            {name: 'Pitcairn', code: 'PN'}, 
            {name: 'Poland', code: 'PL'}, 
            {name: 'Portugal', code: 'PT'}, 
            {name: 'Puerto Rico', code: 'PR'}, 
            {name: 'Qatar', code: 'QA'}, 
            {name: 'Reunion', code: 'RE'}, 
            {name: 'Romania', code: 'RO'}, 
            {name: 'Russian Federation', code: 'RU'}, 
            {name: 'RWANDA', code: 'RW'}, 
            {name: 'Saint Helena', code: 'SH'}, 
            {name: 'Saint Kitts and Nevis', code: 'KN'}, 
            {name: 'Saint Lucia', code: 'LC'}, 
            {name: 'Saint Pierre and Miquelon', code: 'PM'}, 
            {name: 'Saint Vincent and the Grenadines', code: 'VC'}, 
            {name: 'Samoa', code: 'WS'}, 
            {name: 'San Marino', code: 'SM'}, 
            {name: 'Sao Tome and Principe', code: 'ST'}, 
            {name: 'Saudi Arabia', code: 'SA'}, 
            {name: 'Senegal', code: 'SN'}, 
            {name: 'Serbia and Montenegro', code: 'CS'}, 
            {name: 'Seychelles', code: 'SC'}, 
            {name: 'Sierra Leone', code: 'SL'}, 
            {name: 'Singapore', code: 'SG'}, 
            {name: 'Slovakia', code: 'SK'}, 
            {name: 'Slovenia', code: 'SI'}, 
            {name: 'Solomon Islands', code: 'SB'}, 
            {name: 'Somalia', code: 'SO'}, 
            {name: 'South Africa', code: 'ZA'}, 
            {name: 'South Georgia and the South Sandwich Islands', code: 'GS'}, 
            {name: 'Spain', code: 'ES'}, 
            {name: 'Sri Lanka', code: 'LK'}, 
            {name: 'Sudan', code: 'SD'}, 
            {name: 'Suriname', code: 'SR'}, 
            {name: 'Svalbard and Jan Mayen', code: 'SJ'}, 
            {name: 'Swaziland', code: 'SZ'}, 
            {name: 'Sweden', code: 'SE'}, 
            {name: 'Switzerland', code: 'CH'}, 
            {name: 'Syrian Arab Republic', code: 'SY'}, 
            {name: 'Taiwan, Province of China', code: 'TW'}, 
            {name: 'Tajikistan', code: 'TJ'}, 
            {name: 'Tanzania, United Republic of', code: 'TZ'}, 
            {name: 'Thailand', code: 'TH'}, 
            {name: 'Timor-Leste', code: 'TL'}, 
            {name: 'Togo', code: 'TG'}, 
            {name: 'Tokelau', code: 'TK'}, 
            {name: 'Tonga', code: 'TO'}, 
            {name: 'Trinidad and Tobago', code: 'TT'}, 
            {name: 'Tunisia', code: 'TN'}, 
            {name: 'Turkey', code: 'TR'}, 
            {name: 'Turkmenistan', code: 'TM'}, 
            {name: 'Turks and Caicos Islands', code: 'TC'}, 
            {name: 'Tuvalu', code: 'TV'}, 
            {name: 'Uganda', code: 'UG'}, 
            {name: 'Ukraine', code: 'UA'}, 
            {name: 'United Arab Emirates', code: 'AE'}, 
            {name: 'United Kingdom', code: 'GB'}, 
            {name: 'United States', code: 'US'}, 
            {name: 'United States Minor Outlying Islands', code: 'UM'}, 
            {name: 'Uruguay', code: 'UY'}, 
            {name: 'Uzbekistan', code: 'UZ'}, 
            {name: 'Vanuatu', code: 'VU'}, 
            {name: 'Venezuela', code: 'VE'}, 
            
            {name: 'Virgin Islands, British', code: 'VG'}, 
            {name: 'Virgin Islands, U.S.', code: 'VI'}, 
            {name: 'Wallis and Futuna', code: 'WF'}, 
            {name: 'Western Sahara', code: 'EH'}, 
            {name: 'Yemen', code: 'YE'}, 
            {name: 'Zambia', code: 'ZM'}, 
            {name: 'Zimbabwe', code: 'ZW'} 
          ]
        }

        refreshToken(mmemberid, devicetoken): Promise<any> {
          var se = this;
          return new Promise((resolve, reject) => {
            if(devicetoken){
              return new Promise((resolve, reject) => {
                let strUrl = C.urls.baseUrl.urlMobile + '/api/Account/Login';
                let headers = {
                      'cache-control': 'no-cache',
                      'content-type': 'application/json'
                    };
                let body = {emailOrPhone:'',password:'',rememberMe:true,memberId: mmemberid ,deviceToken: devicetoken};
                se.RequestApi('POST', strUrl, headers, body, 'globalFunction', 'refreshToken').then((data) => {
                  if (data && data.auth_token) {
                      var decoded = jwt_decode(data.auth_token);
                        if (decoded) {
                          se.storage.remove('auth_token').then(()=>{
                            se.storage.set("auth_token", data.auth_token);
                          })
                        }
                        resolve(data.auth_token);
                      }
                  })
              })
            }
          })
          
        }
      
        async showLoadingWithMsg(msg){
          this.loader = this.loadCtrl.create({
             message: msg
           });
       
           (await this.loader).present();
         }
      
        async showLoading(){
         this.loader = this.loadCtrl.create({
            message: ""
          });
      
          (await this.loader).present();
        }

        async showLoadingwithtimeout(){
          this.loader = this.loadCtrl.create({
             message: "",
             duration: 3000
           });
       
           (await this.loader).present();
         }
      
        async hideLoading(){
          if(this.loader){
            (await (this.loader)).dismiss();
          }
         }
      
         async showLoadingMessage(msg){
          this.loader = this.loadCtrl.create({
             message: msg
           });
       
           (await this.loader).present();
         }
       
         async hideLoadingMessage(){
            (await (this.loader)).dismiss();
          }

          async showAlertPaymentFail(){
            var se = this;
            let msg = 'Đã có lỗi xảy ra. Vui lòng thử lại sau!';
            let alert = await this.alertCtrl.create({
              message: msg,
              header: 'Rất tiếc, thanh toán không thành công',
              cssClass: "cls-alert-refreshPrice",
              backdropDismiss: false,
              buttons: [
              {
                text: 'OK',
                role: 'OK',
                handler: () => {
                  this._flightService.itemTabFlightActive.emit(true);
                  this.valueGlobal.backValue = 'homeflight';
                  this._flightService.itemMenuFlightClick.emit(2);
                  this.navCtrl.navigateBack('app/tabs/tab1');
                }
              }
            ]
          });
          alert.present();
          }
      
          updatePaymentMethod(data, paymentMethod, bankId, BanksTranfer):Promise<any>{
            let param = {
            "paymentMethod": paymentMethod,
            "userToken": "",
            "bankId": bankId,
            "bankTransfer": BanksTranfer
          };
          return new Promise((resolve, reject) => {
            // var options = {
            //   method: 'POST',
            //   url: C.urls.baseUrl.urlFlight + "/gate/apiv1/PaymentSave/"+data.reservationId,
            //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
            //   headers: {
            //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            //     'Content-Type': 'application/json; charset=utf-8',
            //   },
            //   body: JSON.stringify(param)
            // };

            // let headers= {
            //   "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            //   'Content-Type': 'application/json; charset=utf-8',
            // };
            // let url = C.urls.baseUrl.urlFlight + "/gate/apiv1/PaymentSave/"+data.reservationId;
            // this.RequestApi('POST', url, headers, param, 'globalFunction', 'CheckPaymentDate').then((data) => {
            //     let result = data;
            //     if(!result.error){
            //       resolve(result);
            //     }else{
            //       resolve(false);
            //     }
              
            // })
            resolve({isHoldSuccess: true});
          })
        }
        updatePaymentMethodNew(bookingCode, paymentMethod, bankId, BanksTranfer):Promise<any>{
          let param = {
          "paymentMethod": paymentMethod,
          "userToken": "",
          "bankId": bankId,
          "bankTransfer": BanksTranfer
        };
        return new Promise((resolve, reject) => {
          // var options = {
          //   method: 'POST',
          //   url: C.urls.baseUrl.urlFlight + "/gate/apiv1/PaymentSave/"+bookingCode,
          //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
          //   headers: {
          //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          //     'Content-Type': 'application/json; charset=utf-8',
          //   },
          //   body: JSON.stringify(param)
          // };
          // let headers= {
          //   "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          //   'Content-Type': 'application/json; charset=utf-8',
          // };
          // let url = C.urls.baseUrl.urlFlight + "/gate/apiv1/PaymentSave/"+bookingCode;
          // this.RequestApi('POST', url, headers, param, 'globalFunction', 'updatePaymentMethodNew').then((data) => {
          //     let result = data;
          //     if(!result.error){
          //       resolve(result);
          //     }else{
          //       resolve(false);
          //     }
          // })
          resolve({isHoldSuccess: true});
        })
      }
        checkHoldTicket(data){
          var se = this, res = false;
          let url = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+data.pnr.resNo;
          return new Promise((resolve, reject) => {
            //se.intervalHoldTicket = setInterval(() => {
              
              se.callCheckHoldTicket(url, data).then((check) => {
                if (!check && se.allowCheckHoldTicket) {
                    res = false;
                    setTimeout(() => {
                      se.checkHoldTicket(data);
                    }, 3000);
                }else{
                  resolve(check);
                }
              })
            
            //}, 1000 * 3);
      
            setTimeout(() => {
              //clearInterval(se.intervalHoldTicket);
              se.allowCheckHoldTicket = false;
              // se.callCheckHoldTicket(url, data).then((check) => {
              //   resolve(check);
              // })
            }, 1000 * 15);
          })
         
        }
      
        callCheckHoldTicket(url, data){
          var res = false;
          return new Promise((resolve, reject) => {
            // var options = {
            //   method: 'GET',
            //   url: C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+data.pnr.resNo,
            //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
            //   headers: {
            //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            //     'Content-Type': 'application/json; charset=utf-8',
            //   },
            // };
            let strUrl = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+data.pnr.resNo;
              let headers = {
                "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                'Content-Type': 'application/json; charset=utf-8',
                  };
              this.RequestApi('GET', strUrl, headers, {}, 'globalFunction', 'callCheckHoldTicket').then((result) => {
                //let result = data;
                if(data.ischeckpayment == 0)//trả sau
                {
                    if(result.isRoundTrip){//khứ hồi
                      if(result.departFlight.atBookingCode != null && result.departFlight.atBookingCode != "T__" && result.returnFlight.atBookingCode != null && result.returnFlight.atBookingCode != "T__"){
                        resolve(true);
                      }else{
                        resolve(false);
                      }
                    }else{
                      if(result.departFlight.atBookingCode != null && result.departFlight.atBookingCode != "T__"){
                        resolve(true);
                      }else{
                        resolve(false);
                      }
                    }
                }else{//trả trước
        
                  if(result.isRoundTrip){//khứ hồi
                    //Có mã giữ chỗ và trạng thái đã xuất vé cả 2 chiều thì trả về true - hoàn thành
                    if(result.departFlight.atBookingCode != null && result.departFlight.atBookingCode != "T__" && result.returnFlight.atBookingCode != null && result.returnFlight.atBookingCode != "T__"
                    && result.departFlight.status == 4 && result.returnFlight.status == 4){
                      resolve(true);
                    }else{
                      resolve(false);
                    }
                  }else{//Có mã giữ chỗ và trạng thái đã xuất vé thì trả về true - hoàn thành
                    if(result.departFlight.atBookingCode != null && result.departFlight.atBookingCode != "T__" && result.departFlight.status == 4){
                      resolve(true);
                    }else{
                      resolve(false);
                    }
                  }
                }
              
            })
           
            
          })
        }
      
        holdTicket(data){
          var se = this;
          // var options = {
          //   method: 'GET',
          //   url: C.urls.baseUrl.urlFlight + "gate/apiv1/HoldPnr?reservationNo="+data.pnr.resNo+"&token=3b760e5dcf038878925b5613c32615ea3&cacheDepartId="+data.departFlight.id+"&cacheReturnId="+ (data.returnFlight ? data.returnFlight.id : ""),//GET /gate/apiv1/HoldPnr
          //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
          //   headers: {
          //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          //     'Content-Type': 'application/json; charset=utf-8',
          //   },
          // };
          let strUrl = C.urls.baseUrl.urlFlight + "gate/apiv1/HoldPnr?reservationNo="+data.pnr.resNo+"&token=3b760e5dcf038878925b5613c32615ea3&cacheDepartId="+data.departFlight.id+"&cacheReturnId="+ (data.returnFlight ? data.returnFlight.id : "");
              let headers = {
                "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                'Content-Type': 'application/json; charset=utf-8',
                  };
              this.RequestApi('GET', strUrl, headers, {}, 'globalFunction', 'holdTicket').then((data) => {
              console.log('hold ticket success!')
              //gọi api tạo transaction rớt xuống crm
              se.createFlightTransaction(data);
            
          })
        }
        //giữ vé combo vmb
        holdTicketCombo(flyBookingCode,iddepart,idreturn): Promise<any>{
          var se = this;
          return new Promise((resolve, reject) => {
            // var options = {
            //   method: 'GET',
            //   url: C.urls.baseUrl.urlFlight + "gate/apiv1/HoldPnr?reservationNo="+flyBookingCode+"&token=3b760e5dcf038878925b5613c32615ea3&cacheDepartId="+iddepart+"&cacheReturnId="+ idreturn,//GET /gate/apiv1/HoldPnr
            //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
            //   headers: {
            //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            //     'Content-Type': 'application/json; charset=utf-8',
            //   },
            // };
            let strUrl = C.urls.baseUrl.urlFlight + "gate/apiv1/HoldPnr?reservationNo="+flyBookingCode+"&token=3b760e5dcf038878925b5613c32615ea3&cacheDepartId="+iddepart+"&cacheReturnId="+ idreturn;
              let headers = {
                "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                'Content-Type': 'application/json; charset=utf-8',
                  };
              this.RequestApi('GET', strUrl, headers, {}, 'globalFunction', 'holdTicketCombo').then((data) => {
                var obj = data;
                var depcode = "";
                var retcode = "";
                if (obj.length > 0) {
                  var objAll = obj.filter((item) => { return item.name == "All" });
                  var objDepart = obj.filter((item) => { return item.name == "Depart" });
                  var objReturn = obj.filter((item) => { return item.name == "Return" });
                  //Giữ vé được cả 2 chiều
                  if (objAll && objAll.length > 0) {
                    depcode = objAll[0].value;
                    retcode = objAll[0].value;
                  }
                  //Giữ vé được chiều đi
                  if (objDepart && objDepart.length > 0) {
                    depcode = objDepart[0].value;
                  }
                  //Giữ vé được chiều về
                  if (objReturn && objReturn.length > 0) {
                    retcode = objReturn[0].value;
                  }
                }
                var objfly={depcode:depcode,retcode:retcode};
                resolve(objfly);
              
            })
          })
         
        }

        issueTicket(data){
          var se = this;
          // var options = {
          //   method: 'GET',
          //   url: C.urls.baseUrl.urlFlight + "gate/apiv1/IssueTicket?reservationNo="+data.pnr.resNo+"&token=3b760e5dcf038878925b5613c32651dus",
          //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
          //   headers: {
          //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          //     'Content-Type': 'application/json; charset=utf-8',
          //   },
          // };
          let strUrl = C.urls.baseUrl.urlFlight + "gate/apiv1/IssueTicket?reservationNo="+data.pnr.resNo+"&token=3b760e5dcf038878925b5613c32651dus";
              let headers = {
                "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                'Content-Type': 'application/json; charset=utf-8',
                  };
              this.RequestApi('GET', strUrl, headers, {}, 'globalFunction', 'issueTicket').then((data) => {
                //gọi api tạo transaction rớt xuống crm
                se.createFlightTransaction(data);
            
          })
        }
      
        createFlightTransaction(data){
          // var options = {
          //   method: 'GET',
          //   url: C.urls.baseUrl.urlFlight + "gate/apiv1/EndTranaction?resNo="+data.pnr.resNo+"&sercureKey=3b760e5dcf038878925b5613c32651dus",
          //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
          //   headers: {
          //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          //     'Content-Type': 'application/json; charset=utf-8',
          //   },
          // };
          let strUrl = C.urls.baseUrl.urlFlight + "gate/apiv1/EndTranaction?resNo="+data.pnr.resNo+"&sercureKey='3b760e5dcf038878925b5613c32651dus'";
          let headers = {
            "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            'Content-Type': 'application/json; charset=utf-8',
              };
          this.RequestApi('GET', strUrl, headers, {}, 'globalFunction', 'issueTicket').then((data) => {
            if (data && data.statusCode != 401) {
               console.log('success');
            }
          })
        }
      
        createFlightTransactionCombo(resNo){
          // var options = {
          //   method: 'GET',
          //   url: C.urls.baseUrl.urlFlight + "gate/apiv1/EndTranaction?resNo="+resNo+"&sercureKey=3b760e5dcf038878925b5613c32651dus",
          //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
          //   headers: {
          //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          //     'Content-Type': 'application/json; charset=utf-8',
          //   },
          // };
          let strUrl = C.urls.baseUrl.urlFlight + "gate/apiv1/EndTranaction?resNo="+resNo+"&sercureKey='3b760e5dcf038878925b5613c32651dus'";
          let headers = {
            "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            'Content-Type': 'application/json; charset=utf-8',
              };
          this.RequestApi('GET', strUrl, headers, {}, 'globalFunction', 'issueTicket').then((data) => {
            if (data && data.statusCode == 200) {
               console.log('success');
            }
          })
        }
      
        checkTicketAvaiable(data) : Promise<any>{
          var se = this;
          return new Promise((resolve, reject) => {
            // var options = {
            //   method: 'GET',
            //   url: C.urls.baseUrl.urlFlight + "gate/apiv1/CheckAvailable?resid="+data.reservationId,
            //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
            //   headers: {
            //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            //     'Content-Type': 'application/json; charset=utf-8',
            //   },
            // };
            let strUrl = C.urls.baseUrl.urlFlight + "gate/apiv1/CheckAvailable?resid="+data.reservationId;
          let headers = {
            "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            'Content-Type': 'application/json; charset=utf-8',
              };
          this.RequestApi('GET', strUrl, headers, {}, 'globalFunction', 'issueTicket').then((data) => {
                resolve(data);
            })
          })
          
        }
      
        async showAlertOutOfTicket(itemFlight, type, isMytripPayment){
          var se = this;
          let msg ='';
          if(itemFlight.errorHoldTicket == 1){
              msg = 'Chuyến bay '+itemFlight.departFlight.airlineCode + ' từ ' + itemFlight.departCity + ' đi ' + itemFlight.returnCity + ' vào ' + itemFlight.checkInDisplay + ' lúc ' + moment(itemFlight.departFlight.departTime).format('HH:mm') + ' → ' + moment(itemFlight.departFlight.landingTime).format('HH:mm') + ' đã hết vé. Vui lòng chọn chuyến bay khác.';
          }
          else if(itemFlight.errorHoldTicket == 2){
              msg = 'Chuyến bay '+itemFlight.returnFlight.airlineCode + ' từ ' + itemFlight.returnCity + ' đi ' + itemFlight.departCity + ' vào ' + itemFlight.checkOutDisplay + ' lúc ' + moment(itemFlight.returnFlight.departTime).format('HH:mm') + ' → ' + moment(itemFlight.returnFlight.landingTime).format('HH:mm') + ' đã hết vé. Vui lòng chọn chuyến bay khác.';
          }
          else{
              msg = 'Các chuyến bay đã chọn không giữ được vé. Vui lòng chọn chuyến bay khác!';
          }
          //let msg = 'Chuyến bay '+itemFlight.departFlight.airlineCode + ' từ ' + itemFlight.departCity + ' đi ' + itemFlight.returnCity + ' vào ' + itemFlight.checkInDisplay + ' lúc ' + moment(itemFlight.departFlight.departTime).format('HH:mm') + ' → ' + moment(itemFlight.departFlight.landingTime).format('HH:mm') + ' đã hết vé. Vui lòng chọn chuyến bay khác.';
          let alert = await this.alertCtrl.create({
            message: msg,
            header: type ==1 ? 'Rất tiếc, vé máy bay đã hết' : 'Rất tiếc, vé không giữ được',
            cssClass: "cls-alert-refreshPrice",
            backdropDismiss: false,
            buttons: [
            {
              text: 'OK',
              role: 'OK',
              handler: () => {
                this.goToSearchFlight(isMytripPayment);
              }
            }
          ]
        });
        alert.present();
        }
      
  async showAlertOutOfTicketInternational(itemFlight, type){
    var se = this;
    let msg ='';
    if(itemFlight.errorHoldTicket == 1){
        msg = 'Chuyến bay '+itemFlight.itemFlightInternationalDepart.airlineCode + ' từ ' + itemFlight.departCity + ' đi ' + itemFlight.returnCity + ' vào ' + itemFlight.checkInDisplay + ' lúc ' + moment(itemFlight.itemFlightInternationalDepart.departTime).format('HH:mm') + ' → ' + moment(itemFlight.itemFlightInternationalDepart.landingTime).format('HH:mm') + ' đã hết vé. Vui lòng chọn chuyến bay khác.';
    }
    else if(itemFlight.errorHoldTicket == 2){
        msg = 'Chuyến bay '+itemFlight.itemFlightInternationalReturn.airlineCode + ' từ ' + itemFlight.returnCity + ' đi ' + itemFlight.departCity + ' vào ' + itemFlight.checkOutDisplay + ' lúc ' + moment(itemFlight.itemFlightInternationalReturn.departTime).format('HH:mm') + ' → ' + moment(itemFlight.itemFlightInternationalReturn.landingTime).format('HH:mm') + ' đã hết vé. Vui lòng chọn chuyến bay khác.';
    }
    else{
        msg = 'Các chuyến bay đã chọn không giữ được vé. Vui lòng chọn chuyến bay khác!';
    }
    //let msg = 'Chuyến bay '+itemFlight.departFlight.airlineCode + ' từ ' + itemFlight.departCity + ' đi ' + itemFlight.returnCity + ' vào ' + itemFlight.checkInDisplay + ' lúc ' + moment(itemFlight.departFlight.departTime).format('HH:mm') + ' → ' + moment(itemFlight.departFlight.landingTime).format('HH:mm') + ' đã hết vé. Vui lòng chọn chuyến bay khác.';
    let alert = await se.alertCtrl.create({
      message: msg,
      header: type == 1 ? 'Rất tiếc, vé máy bay đã hết' : 'Rất tiếc, vé không giữ được',
      cssClass: "cls-alert-refreshPrice",
      backdropDismiss: false,
      buttons: [
      {
        text: 'OK',
        role: 'OK',
        handler: () => {
          se.goToSearchFlightInternational();
        }
      }
    ]
  });
  alert.present();
  }
  goToSearchFlightInternational(){
    this._flightService.itemFlightCache.step = 2;
    this._flightService.itemChangeTicketFlight.emit(1);
    this.navCtrl.navigateBack('/flightsearchresultinternational');
  }
        goToSearchFlight(isMytripPayment){
          if(isMytripPayment){
            this._flightService.itemTabFlightActive.emit(true);
            this.valueGlobal.backValue = 'homeflight';
            this._flightService.itemMenuFlightClick.emit(2);
            this.navCtrl.navigateBack('app/tabs/tab1');
          }else{
            this._flightService.itemFlightCache.step = 2;
            this._flightService.itemChangeTicketFlight.emit(1);
            if(this._flightService.itemFlightCache.isApiDirect){
              this.navCtrl.navigateBack('/flightsearchresultinternational');
            }else{
              this.navCtrl.navigateBack('/flightsearchresult');
            }
          }
          
        }
      
        setReLoadValue(value){
          this.reLoad = value;
        }
      
        getReLoadValue(){
          return this.reLoad;
        }

        
    public UpdatePaymentMethod(bookingCode,paymentMethod): Promise<any>{
      return new Promise((resolve, reject) => {
        // var options = {
        //   'method': 'POST',
        //   'url': C.urls.baseUrl.urlContracting + '/api/toolsapi/UpdatePaymentMethod?HotelCode='+bookingCode+'&paymentMethod='+paymentMethod +'',
        //   'headers': {
        //   }
        // };
        let strUrl = C.urls.baseUrl.urlContracting + '/api/toolsapi/UpdatePaymentMethod?HotelCode='+bookingCode+'&paymentMethod='+paymentMethod +'';
          let headers = {};
          this.RequestApi('POST', strUrl, headers, {}, 'globalFunction', 'UpdatePaymentMethod').then((data) => {
          resolve(true);
        });
      })
    }

    async checkAcceptBizCredit(methodFunc, strUrl, headerObj, bodyObj, pageName, funcName): Promise<any> {
      var se = this;
      return new Promise(
        (resolve, reject) => {
          // var options;
          // if(headerObj && bodyObj ){
          //   options = {
          //     method: methodFunc,
          //     url: strUrl,
          //     headers: headerObj,
          //     body: bodyObj,
          //     json: true,
          //     timeout: 180000,
          //     maxAttempts: 5,
          //     retryDelay: 2000
          //   }
          // }
          
          // if(headerObj && !bodyObj){
          //   options = {
          //     method: methodFunc,
          //     url: strUrl,
          //     timeout: 180000,
          //     maxAttempts: 5,
          //     retryDelay: 2000,
          //     headers: headerObj
          //   }
          // }

          // if(!headerObj && !bodyObj){
          //   options = {
          //     method: methodFunc,
          //     url: strUrl,
          //     timeout: 180000,
          //     maxAttempts: 5,
          //     retryDelay: 2000,
          //   }
          // }

          //let strUrl = C.urls.baseUrl.urlContracting + '/api/toolsapi/UpdatePaymentMethod?HotelCode='+bookingCode+'&paymentMethod='+paymentMethod +'';
          //let headers = {};
          this.RequestApi(methodFunc, strUrl, headerObj, bodyObj, pageName, funcName).then((data) => {
                if (data) {
                    resolve(data);
                }else{
                  resolve([]);
                }

            })
        }
    )
  
  }
      //Liên kết url
      public CreateUrl(url): Promise<any>{
        return new Promise((resolve, reject) => {
          // var options = {
          //   'method': 'POST',
          //   'url': url,
          //   'headers': {
          //     'Cookie': 'ASP.NET_SessionId=1zuyjhynxivxfmups4llel5v'
          //   }
          // };
          let headers = {};
          this.RequestApi('POST', url, headers, {}, 'globalFunction', 'CreateUrl').then((data) => {
            resolve(data);
          });
        })
      }
      //check phòng Internal
      public checkroomInternal(HotelId,RoomId,CheckInDate,CheckOutDate,roomnumber)
      {
        return new Promise((resolve, reject) => {
          var options = {
            method: 'GET',
            url: C.urls.baseUrl.urlContracting + '/api/toolsapi/CheckAllotment',
            qs:
            {
              token: '3b760e5dcf038878925b5613c32615ea3',
              hotelcode: HotelId,
              roomcode: RoomId,
              checkin: CheckInDate,
              checkout: CheckOutDate,
              totalroom: roomnumber
            },
            headers:
              {}
          };
          let headers = {};
          let strUrl = C.urls.baseUrl.urlContracting + `/api/toolsapi/CheckAllotment?token=3b760e5dcf038878925b5613c32615ea3&hotelcode=${HotelId}&roomcode=${RoomId}&checkin=${CheckInDate}&checkout=${CheckOutDate}&totalroom=${roomnumber}`;
          this.RequestApi('GET', strUrl, headers, {}, 'globalFunction', 'CreateUrl').then((data) => {
            var rs = data;
            resolve(rs.Msg);
          });
        })
      }
      //check phòng EAN
      checkroomEAN(bookingCode){
        return new Promise((resolve, reject) => {
          var options = {
            'method': 'GET',
            'url': C.urls.baseUrl.urlContracting+'/api/toolsapi/PrecheckRoomAvailableEAN?token=3b760e5dcf038878925b5613c32615ea3&bookingCode='+bookingCode+'',
            'headers': {
            }
          };
          let headers = {};
          let strUrl = C.urls.baseUrl.urlContracting+'/api/toolsapi/PrecheckRoomAvailableEAN?token=3b760e5dcf038878925b5613c32615ea3&bookingCode='+bookingCode+'';
          this.RequestApi('GET', strUrl, headers, {}, 'globalFunction', 'CreateUrl').then((data) => {
            var rs = data;
            resolve(rs.error);
          });
        });
       
      }
      //Các hình thức thanh toán
      funcpaymentMethod(paymentMethod): string {

        switch (paymentMethod) {
          case "visa":
            paymentMethod = "0"
            break;
          case "payoo_store":
            paymentMethod = "3"
            break;
          case "payoo_qr":
            paymentMethod = "0"
            break;
          case "momo":
            paymentMethod = "10"
            break;
          case "bnpl":
            paymentMethod = "12"
            break;
        }
        return paymentMethod;
      }
    
      //thêm phần đi chung
      public getDirection(Origin_Placeid,Destination_Placeid,Time,IsDeparture): Promise<any>{
        {
          return new Promise((resolve, reject) => {
            var IsInternational;
            if (this._flightService.itemFlightCache.dataBooking.fromPlace.internal==0||this._flightService.itemFlightCache.dataBooking.toPlace.internal==0) {
              IsInternational=true;
            }else{
              IsInternational=false;
            }
            var options = {
              method: 'GET',
              url: C.urls.baseUrl.urlMobile + '/api/Dashboard/GetDirection?Origin_Placeid=' + Origin_Placeid + '&Destination_Placeid=' + Destination_Placeid + '&Time=' + Time + '&IsDeparture='+IsDeparture,
              timeout: 10000, maxAttempts: 5, retryDelay: 2000,
              headers:
              {
              }
            };
            let headers = {};
          let strUrl = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetDirection?Origin_Placeid=' + Origin_Placeid + '&Destination_Placeid=' + Destination_Placeid + '&Time=' + Time + '&IsDeparture='+IsDeparture+ '&IsInternational='+IsInternational;
          this.RequestApi('GET', strUrl, headers, {}, 'globalFunction', 'CreateUrl').then((data) => {
              resolve(data);
            });
          })
         
        }
      }
      public GetListProduct(bookingTime, startPlace, endPlace, slot, productType, provider, sort,routeName): Promise<any>{
        {
          return new Promise((resolve, reject) => {
            var options = {
              method: 'GET',
              url: C.urls.baseUrl.urlMobile + '/api/Dashboard/GetListProducts?bookingTime=' + bookingTime + '&startPlace=' + startPlace + '&endPlace=' + endPlace + '&slot=' + slot + '&productType=' + productType + '&provider=' + provider + '&sort=' + sort,
              timeout: 10000, maxAttempts: 5, retryDelay: 2000,
              headers:
              {
              }
            };
            let headers = {};
          let strUrl = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetListProducts?reservationNo='+this._flightService.itemFlightCache.dataBooking.reservationNo+'&routeName='+routeName+'&bookingTime=' + bookingTime + '&startPlace=' + startPlace + '&endPlace=' + endPlace + '&slot=' + slot + '&productType=' + productType + '&provider=' + provider + '&sort=' + sort;
          this.RequestApi('GET', strUrl, headers, {}, 'globalFunction', 'GetListProduct').then((data) => {
              var Product = data;
              resolve(Product);
            });
          })
         
        }
      }
      round(number, precision) {
        var factor = Math.pow(10, precision);
        var tempNumber = number * factor;
        var roundedTempNumber = Math.round(tempNumber);
        return roundedTempNumber / factor;
      }
      numberToCurrency(number: number, thousands: string, includefee: boolean = false) {
        if (number == undefined)
            return 'undefined';
        let fee = 0;
        if (includefee) {
            fee = 20000;
        }
        var parts = this.round(number + fee, 0).toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
        return parts.join(thousands);
    }
      checkUnicodeCharactor(input) {
          if(input.indexOf('à') != -1 || input.indexOf('á') != -1 || input.indexOf('ạ') != -1 || input.indexOf('ả') != -1 || input.indexOf('ã') != -1 || input.indexOf('â') != -1 || input.indexOf('ầ') != -1 || input.indexOf('ấ') != -1 || input.indexOf('ậ') != -1 || input.indexOf('ẩ') != -1 || input.indexOf('ẫ') != -1 || input.indexOf('ă') != -1 || input.indexOf('ằ') != -1 || input.indexOf('ắ') != -1 || input.indexOf('ặ') != -1 || input.indexOf('ẳ') != -1 || input.indexOf('ẵ') != -1 
          || input.indexOf('è') != -1 || input.indexOf('é') != -1 || input.indexOf('ẹ') != -1 || input.indexOf('ẻ') != -1 || input.indexOf('ẽ') != -1 || input.indexOf('ê') != -1 || input.indexOf('ề') != -1 || input.indexOf('ế') != -1 || input.indexOf('ệ') != -1 || input.indexOf('ể') != -1 || input.indexOf('ễ') != -1
          || input.indexOf('ì') != -1 || input.indexOf('í') != -1 || input.indexOf('ị') != -1 || input.indexOf('ỉ') != -1 || input.indexOf('ĩ') != -1
          || input.indexOf('ò') != -1 || input.indexOf('ó') != -1 || input.indexOf('ọ') != -1 || input.indexOf('ỏ') != -1 || input.indexOf('õ') != -1 || input.indexOf('ô') != -1 || input.indexOf('ồ') != -1 || input.indexOf('ố') != -1 || input.indexOf('ộ') != -1 || input.indexOf('ổ') != -1 || input.indexOf('ỗ') != -1 || input.indexOf('ơ') != -1 || input.indexOf('ờ') != -1 || input.indexOf('ớ') != -1 || input.indexOf('ợ') != -1 || input.indexOf('ở') != -1 || input.indexOf('ỡ') != -1
          || input.indexOf('ù') != -1 || input.indexOf('ú') != -1 || input.indexOf('ụ') != -1 || input.indexOf('ủ') != -1 || input.indexOf('ũ') != -1 || input.indexOf('ư') != -1 || input.indexOf('ừ') != -1 || input.indexOf('ứ') != -1 || input.indexOf('ự') != -1 || input.indexOf('ử') != -1 || input.indexOf('ữ') != -1
          || input.indexOf('ỳ') != -1 || input.indexOf('ý') != -1 || input.indexOf('ỵ') != -1 || input.indexOf('ỷ') != -1 || input.indexOf('ỹ') != -1
          || input.indexOf('đ') != -1 
          || input.indexOf('\u0300') != -1 || input.indexOf('\u0301') != -1 || input.indexOf('\u0303') != -1 || input.indexOf('\u0309') != -1 || input.indexOf('\u0323') != -1
          || input.indexOf('\u02C6') != -1 || input.indexOf('\u0306') != -1 || input.indexOf('\u031B') != -1
          )
          {
            return false;
          }
          
        return true;
      }

      convertUnicodeCharactor(input) {
        for(var i=0; i< input.length; i++) {
          input = input.replace('à','a').replace('À','A');
          input = input.replace('á','a').replace('Á','A');
          input = input.replace('ạ','a').replace('Ạ','A');
          input = input.replace('ả','a').replace('Ả','A');
          input = input.replace('ã','a').replace('Ã','A');
          input = input.replace('â','a').replace('Â','A');
          input = input.replace('ầ','a').replace('Ầ','A');
          input = input.replace('ấ','a').replace('Ấ','A');
          input = input.replace('ậ','a').replace('Ậ','A');
          input = input.replace('ẫ','a').replace('Ẫ','A');
          input = input.replace('ẩ','a').replace('Ẩ','A');
          input = input.replace('ă','a').replace('Ă','A');
          input = input.replace('ắ','a').replace('Ắ','A');
          input = input.replace('ằ','a').replace('Ằ','A');
          input = input.replace('ặ','a').replace('Ặ','A');
          input = input.replace('ẳ','a').replace('Ẳ','A');
          input = input.replace('ẵ','a').replace('Ẵ','A');
    
          input = input.replace('è','e').replace('È','E');
          input = input.replace('é','e').replace('É','E');
          input = input.replace('ẹ','e').replace('Ẹ','E');
          input = input.replace('ẻ','e').replace('Ẻ','E');
          input = input.replace('ẽ','e').replace('Ẽ','E');
          input = input.replace('ê','e').replace('Ê','E');
          input = input.replace('ề','e').replace('Ề','E');
          input = input.replace('ế','e').replace('Ế','E');
          input = input.replace('ệ','e').replace('Ệ','E');
          input = input.replace('ể','e').replace('Ể','E');
          input = input.replace('ễ','e').replace('Ễ','E');
    
          input = input.replace('ì','i').replace('Ì','I');
          input = input.replace('í','i').replace('Í','I');
          input = input.replace('ị','i').replace('Ị','I');
          input = input.replace('ỉ','i').replace('Ỉ','I');
          input = input.replace('ĩ','i').replace('Ĩ','I');
    
          input = input.replace('ò','o').replace('Ò','O');
          input = input.replace('ó','o').replace('Ó','O');
          input = input.replace('ọ','o').replace('Ọ','O');
          input = input.replace('ỏ','o').replace('Ỏ','O');
          input = input.replace('õ','o').replace('Õ','O');
          input = input.replace('ô','o').replace('Ô','O');
          input = input.replace('ồ','o').replace('Ồ','O');
          input = input.replace('ố','o').replace('Ố','O');
          input = input.replace('ộ','o').replace('Ộ','O');
          input = input.replace('ổ','o').replace('Ổ','O');
          input = input.replace('ỗ','o').replace('Ỗ','O');
          input = input.replace('ơ','o').replace('Ơ','O');
          input = input.replace('ờ','o').replace('Ờ','O');
          input = input.replace('ớ','o').replace('Ớ','O');
          input = input.replace('ợ','o').replace('Ợ','O');
          input = input.replace('ở','o').replace('Ở','O');
          input = input.replace('ỡ','o').replace('Ỡ','O');
    
          input = input.replace('ù','u').replace('Ù','U');
          input = input.replace('ú','u').replace('Ú','U');
          input = input.replace('ụ','u').replace('Ụ','U');
          input = input.replace('ủ','u').replace('Ủ','U');
          input = input.replace('ũ','u').replace('Ũ','U');
          input = input.replace('ư','u').replace('Ư','U');
          input = input.replace('ừ','u').replace('Ừ','U');
          input = input.replace('ứ','u').replace('Ứ','U');
          input = input.replace('ự','u').replace('Ự','U');
          input = input.replace('ử','u').replace('Ử','U');
          input = input.replace('ữ','u').replace('Ữ','U');
    
          input = input.replace('ỳ','y').replace('Ỳ','Y');
          input = input.replace('ý','y').replace('Ý','Y');
          input = input.replace('ỵ','y').replace('Ỵ','Y');
          input = input.replace('ỷ','y').replace('Ỷ','Y');
          input = input.replace('ỹ','y').replace('Ỹ','Y');
    
          input = input.replace('đ','d').replace('Đ','D');
          input = input.replace('\u0300','o');
          input = input.replace('\u0301','o');
          input = input.replace('\u0303','o');
          input = input.replace('\u0309','o');
          input = input.replace('\u0323','o');
    
          input = input.replace('\u02C6','o');
          input = input.replace('\u0323','o');
          input = input.replace('\u031B','o');
        }
      return input;
    }

    convertUnicodeCharactorNew(input) {
      //for(var i=0; i< input.length; i++) {
        input = input.replace('à','a').replace('À','A');
        input = input.replace('á','a').replace('Á','A');
        input = input.replace('ạ','a').replace('Ạ','A');
        input = input.replace('ả','a').replace('Ả','A');
        input = input.replace('ã','a').replace('Ã','A');
        input = input.replace('â','a').replace('Â','A');
        input = input.replace('ầ','a').replace('Ầ','A');
        input = input.replace('ấ','a').replace('Ấ','A');
        input = input.replace('ậ','a').replace('Ậ','A');
        input = input.replace('ẫ','a').replace('Ẫ','A');
        input = input.replace('ẩ','a').replace('Ẩ','A');
        input = input.replace('ă','a').replace('Ă','A');
        input = input.replace('ắ','a').replace('Ắ','A');
        input = input.replace('ằ','a').replace('Ằ','A');
        input = input.replace('ặ','a').replace('Ặ','A');
        input = input.replace('ẳ','a').replace('Ẳ','A');
        input = input.replace('ẵ','a').replace('Ẵ','A');
  
        input = input.replace('è','e').replace('È','E');
        input = input.replace('é','e').replace('É','E');
        input = input.replace('ẹ','e').replace('Ẹ','E');
        input = input.replace('ẻ','e').replace('Ẻ','E');
        input = input.replace('ẽ','e').replace('Ẽ','E');
        input = input.replace('ê','e').replace('Ê','E');
        input = input.replace('ề','e').replace('Ề','E');
        input = input.replace('ế','e').replace('Ế','E');
        input = input.replace('ệ','e').replace('Ệ','E');
        input = input.replace('ể','e').replace('Ể','E');
        input = input.replace('ễ','e').replace('Ễ','E');
  
        input = input.replace('ì','i').replace('Ì','I');
        input = input.replace('í','i').replace('Í','I');
        input = input.replace('ị','i').replace('Ị','I');
        input = input.replace('ỉ','i').replace('Ỉ','I');
        input = input.replace('ĩ','i').replace('Ĩ','I');
  
        input = input.replace('ò','o').replace('Ò','O');
        input = input.replace('ó','o').replace('Ó','O');
        input = input.replace('ọ','o').replace('Ọ','O');
        input = input.replace('ỏ','o').replace('Ỏ','O');
        input = input.replace('õ','o').replace('Õ','O');
        input = input.replace('ô','o').replace('Ô','O');
        input = input.replace('ồ','o').replace('Ồ','O');
        input = input.replace('ố','o').replace('Ố','O');
        input = input.replace('ộ','o').replace('Ộ','O');
        input = input.replace('ổ','o').replace('Ổ','O');
        input = input.replace('ỗ','o').replace('Ỗ','O');
        input = input.replace('ơ','o').replace('Ơ','O');
        input = input.replace('ờ','o').replace('Ờ','O');
        input = input.replace('ớ','o').replace('Ớ','O');
        input = input.replace('ợ','o').replace('Ợ','O');
        input = input.replace('ở','o').replace('Ở','O');
        input = input.replace('ỡ','o').replace('Ỡ','O');
  
        input = input.replace('ù','u').replace('Ù','U');
        input = input.replace('ú','u').replace('Ú','U');
        input = input.replace('ụ','u').replace('Ụ','U');
        input = input.replace('ủ','u').replace('Ủ','U');
        input = input.replace('ũ','u').replace('Ũ','U');
        input = input.replace('ư','u').replace('Ư','U');
        input = input.replace('ừ','u').replace('Ừ','U');
        input = input.replace('ứ','u').replace('Ứ','U');
        input = input.replace('ự','u').replace('Ự','U');
        input = input.replace('ử','u').replace('Ử','U');
        input = input.replace('ữ','u').replace('Ữ','U');
  
        input = input.replace('ỳ','y').replace('Ỳ','Y');
        input = input.replace('ý','y').replace('Ý','Y');
        input = input.replace('ỵ','y').replace('Ỵ','Y');
        input = input.replace('ỷ','y').replace('Ỷ','Y');
        input = input.replace('ỹ','y').replace('Ỹ','Y');
  
        input = input.replace('đ','d').replace('Đ','D');
        input = input.replace('\u0300','o');
        input = input.replace('\u0301','o');
        input = input.replace('\u0303','o');
        input = input.replace('\u0309','o');
        input = input.replace('\u0323','o');
  
        input = input.replace('\u02C6','o');
        input = input.replace('\u0323','o');
        input = input.replace('\u031B','o');
      //}
    return input;
  }

      getListSubName(){
        return [
          {id: 1, value: ['Nguyễn','nguyễn'], rawValue: ['Nguyen', 'nguyen'], mapSuggestValue: ['nguen', 'ngyen','ngen','nhuyen','nhuen','nhyen','ng','nh','nguyem', 'nguyenx','nguyeen','nguyeenx']}, 
          {id: 2, value: ['Trần','trần'], rawValue: ['Tran', 'tran'], mapSuggestValue: ['tr', 'tra', 'tan', 'ta', 'tn', 'tranf']}, 
          {id: 3, value: ['Lê','lê'], rawValue: ['Le', 'le'], mapSuggestValue: ['lế', 'lề', 'lệ', 'lễ', 'lể']}, 
          {id: 4, value: ['Phạm','phạm'], rawValue: ['Pham', 'pham'], mapSuggestValue: ['ph','pam','phm','phamj']}, 
          {id: 5, value: ['Hoàng','hoàng'], rawValue: ['Hoang', 'hoang'], mapSuggestValue: ['ho','hoa','hoan','hoam','hoag','hang','hoamg','hamg','hoangf']}, 
          {id: 6, value: ['Huỳnh','huỳnh'], rawValue: ['Huynh', 'huynh'],mapSuggestValue: ['hu','huy','huyn','hynh','hunh','huyng','hunh','huynhf'] }, 
          {id: 7, value: ['Phan','phan'], rawValue: ['Phan', 'phan'], mapSuggestValue: ['ph','pan','phn','pham','pam']}, 
          {id: 8, value: ['Vũ', 'vũ'], rawValue: ['Vu', 'vu'], mapSuggestValue: ['vú','vụ','vủ','vù','vux']}, 
          {id: 9, value: ['Võ','vo'], rawValue: ['Vo','vo'], mapSuggestValue: ['vọ','vó','vỏ','vò','vox']}, 
          {id: 10, value: ['Đặng', 'đặng'], rawValue: ['Dang', 'dang'], mapSuggestValue: ['da', 'dan', 'dawng','dawngj','ddawng','ddawngj']}, 
          {id: 11, value: ['Bùi','bùi'], rawValue: ['Bui', 'bui'], mapSuggestValue: ['bu','bui','bụi','búi','bủi','bũi','buif']}, 
          {id: 12, value: ['Đỗ', 'đỗ'], rawValue: ['Do','do'], mapSuggestValue: ['ddoox', 'ddoo','ddỗ', 'đoỗ', 'dỗ', 'đõ']},
          {id: 13, value: ['Hồ', 'hồ'], rawValue: ['Ho', 'ho'], mapSuggestValue: ['hố', 'hổ', 'hộ', 'hỗ', 'hoof', 'hoo']}, 
          {id: 14, value: ['Ngô', 'ngô'], rawValue: ['Ngo', 'ngo'], mapSuggestValue: ['nho', 'ngoo', 'ngộ', 'ngồ', 'ngố', 'ngỗ', 'ngổ']}, 
          {id: 15, value: ['Dương', 'dương'], rawValue: ['Duong', 'duong'], mapSuggestValue: ['du', 'duo', 'duon', 'dung', 'dong', 'duơng', 'dưong', 'duwong', 'duwowng', 'duowng']},
          {id: 16, value: ['Lý', 'lý'], rawValue: ['Ly', 'ly'], mapSuggestValue: ['lỳ', 'lỷ', 'lỵ', 'lỹ', 'lys']},
          {id: 17, value: ['Lò', 'lò'], rawValue: ['Lo','lo'], mapSuggestValue: ['ló', 'lọ', 'lỏ', 'lõ', 'lof']}, 
          {id: 18, value: ['Lường', 'lường'], rawValue: ['Luong', 'luong'], mapSuggestValue: ['lu', 'luo', 'luon', 'long', 'luwơngf', 'luowngf', 'lườn','lươgf']}, 
          {id: 19, value: ['Quàng', 'quàng'], rawValue: ['Quang', 'quang'], mapSuggestValue: ['quangf', 'quanfg', 'quan', 'qàng', 'qangf']}, 
          {id: 20, value: ['Tòng', 'tòng'], rawValue: ['Tong','tong'], mapSuggestValue: ['tòn', 'tng', 'tongf', 'tonfg', 'tóng', 'tỏng','tọng', 'tõng']},
          {id: 21, value: ['Cà', 'cà'], rawValue: ['Ca','ca'], mapSuggestValue: ['cá', 'cả', 'cạ', 'cã', 'caf']}, 
          {id: 22, value: ['Lỡo', 'lỡo'], rawValue: ['Loo','loo'], mapSuggestValue: ['lỗ', 'lơxo', 'loox', 'lỏo']}, 
          {id: 23, value: ['Mè', 'mè'], rawValue: ['Me','me'], mapSuggestValue: ['mé', 'mẹ', 'mẻ', 'mẽ', 'mef']}, 
          {id: 24, value: ['Lù', 'lù'], rawValue: ['Lu', 'lu'], mapSuggestValue: ['lụ', 'lủ', 'lũ', 'lú', 'luf', 'lừ']},
          {id: 25, value: ['Lềm', 'lềm'], rawValue: ['Lem', 'lem'], mapSuggestValue: ['lếm', 'lểm', 'lệm', 'lễm', 'lèm', 'lêfm', 'leemf']}, 
          {id: 26, value: ['Ngần', 'ngần'], rawValue: ['Ngan','ngan'], mapSuggestValue: ['ngấn', 'ngận', 'ngẩn', 'ngẩn', 'ngânf', 'ngaanf', 'nganaf']}, 
          {id: 27, value: ['Nông', 'nông'], rawValue: ['Nong', 'nong'], mapSuggestValue: ['nô', 'nôn', 'noong']}, 
          {id: 28, value: ['Bạc', 'bạc'], rawValue: ['Bac','bac'], mapSuggestValue: ['bác', 'bàc', 'bacj']},
          {id: 29, value: ['Bế', 'bế'], rawValue: ['Be','be'], mapSuggestValue: ['bề', 'bể', 'bệ', 'bễ', 'bee', 'beế', 'bees']}, 
          {id: 30, value: ['Bua', 'bua'], rawValue: ['Bua', 'bua'], mapSuggestValue: ['bu', 'búa', 'bùa', 'bủa', 'bụa', 'bũa']}, 
          {id: 31, value: ['Bun', 'bun'], rawValue: ['Bun', 'bun'], mapSuggestValue: ['bún', 'bùn', 'bủn', 'bụn', 'bũn', 'bum']}, 
          {id: 32, value: ['Cà', 'cà'], rawValue: ['Ca', 'ca'], mapSuggestValue: ['cá', 'cả', 'cạ', 'cã', 'caf']},
          {id: 33, value: ['Cầm', 'cầm'], rawValue: ['Cam', 'cam'], mapSuggestValue: ['cầ', 'cần', 'cẩm', 'cậm', 'cẫm', 'cấm', 'caàm', 'caamf', 'câmf']}, 
          {id: 34, value: ['Chẩu', 'chẩu'], rawValue: ['Chau', 'chau'], mapSuggestValue: ['chẩ', 'chảu', 'chaảu', 'chaaur', 'chẫu', 'chậu', 'chấu', 'chầu']}, 
          {id: 35, value: ['Chiêu', 'chiêu'], rawValue: ['Chieu', 'chieu'], mapSuggestValue: ['chieu', 'chiê', 'cheeu', 'chieeu', 'chêu']}, 
          {id: 36, value: ['Đèo', 'đèo'], rawValue: ['Deo', 'deo'], mapSuggestValue: ['đeo', 'đéo', 'đẻo', 'đẹo', 'đẽo', 'ddeof', 'ddèo']},
          {id: 37, value: ['Điêu', 'điêu'], rawValue: ['Dieu', 'dieu'], mapSuggestValue: ['điê', 'đieu', 'diêu', 'ddiêu', 'ddieeu']}, 
          {id: 38, value: ['Khằm', 'khẳm'], rawValue: ['Kham', 'kham'], mapSuggestValue: ['khẳ', 'khẳn', 'khẩm', 'kẳm', 'khamwr', 'khănr']}, 
          {id: 39, value: ['Leo', 'leo'], rawValue: ['Leo','leo'], mapSuggestValue: ['le', 'lo', 'lao', 'lro', 'lêo']}, 
          {id: 40, value: ['Lềm', 'lềm'], rawValue: ['Lem','lem'], mapSuggestValue: ['lền', 'lề', 'lêm', 'lếm', 'lểm', 'lệm', 'lễm', 'leemf', 'lêmf', 'lèm', 'lênf']},
          {id: 41, value: ['Lô', 'lô'], rawValue: ['Lo', 'lo'], mapSuggestValue: ['loo', 'lộ', 'lổ', 'lồ', 'lố']},
          {id: 42, value: ['La', 'la'], rawValue: ['La','la'], mapSuggestValue: ['là', 'lạ', 'lả', 'lá']}, 
          {id: 43, value: ['Lộc', 'lộc'], rawValue: ['Loc', 'loc'], mapSuggestValue: ['lộ', 'lọc', 'loọc', 'loocj']}, 
          {id: 44, value: ['Lự', 'lự'], rawValue: ['Lu', 'lu'], mapSuggestValue: ['lứ', 'lử', 'lu', 'lụ', 'luw', 'luwj', 'lựu']},
          {id: 45, value: ['Lừ', 'lừ'], rawValue: ['Lu','lu'], mapSuggestValue: ['lứ', 'lử', 'lu', 'lù', 'luf', 'luwf', 'lừu']}, 
          {id: 46, value: ['Lường','lường'], rawValue: ['Luong', 'luong'], mapSuggestValue: ['lươg', 'lươn', 'lươngf','lừng','luwowngf','lướng']}, 
          {id: 47, value: ['Mang','mang'], rawValue: ['Mang', 'mang'], mapSuggestValue: ['ma', 'man', 'mag', 'mng']}, 
          {id: 48, value: ['Mè', 'mè'], rawValue: ['Me','me'], mapSuggestValue: ['mef', 'mẻ', 'mẹ', 'mé','mẽ']},
          {id: 49, value: ['Nam', 'nam'], rawValue: ['Nam', 'nam'], mapSuggestValue: ['na', 'nm', 'nan', 'mam']}, 
          {id: 50, value: ['Ngu', 'ngu'], rawValue: ['Ngu', 'ngu'], mapSuggestValue: ['nu', 'mgu','nhu']}, 
          {id: 51, value: ['Nho', 'nho'], rawValue: ['Nho','nho'], mapSuggestValue: ['no', 'mho']}, 
          {id: 52, value: ['Nhọt', 'nhọt'], rawValue: ['Nhot', 'nhot'], mapSuggestValue: ['nhọ', 'nht', 'nhoj', 'nhotj', 'nhojt', 'mhot','Mhọt', 'ngọt']},
          {id: 53, value: ['Panh', 'panh'], rawValue: ['Panh', 'panh'], mapSuggestValue: ['pan', 'panh', 'pamh', 'pang', 'phanh']}, 
          {id: 54, value: ['Pha', 'pha'], rawValue: ['Pha', 'pha'], mapSuggestValue: ['pa', 'ph']}, 
          {id: 55, value: ['Phia', 'phia'], rawValue:  ['Phia', 'phia'], mapSuggestValue: ['phi', 'pia', 'ph']}, 
          {id: 56, value: ['Quàng', 'quàng'], rawValue: ['Quang', 'quang'], mapSuggestValue: ['qu', 'qua', 'quan', 'quanfg', 'quangf', 'quanh', 'qang','quan', 'quamg']},
          {id: 57, value: ['Sầm', 'sầm'], rawValue: ['Sam','sam'], mapSuggestValue: ['sa', 'sm', 'saamf', 'sama', 'san']}, 
          {id: 58, value: ['Tụ', 'tụ'], rawValue: ['Tu', 'tu'], mapSuggestValue: ['tuj', 'tù', 'tú', 'tủ', 'tũ']}, 
          {id: 59, value: ['Tày','tày'], rawValue: ['Tay','tay'], mapSuggestValue: ['tà', 'tỳ', 'tayf', 'tài', 'táy','ày', 'yày','rày']}, 
          {id: 60, value: ['Tao', 'tao'], rawValue:  ['Tao', 'tao'],mapSuggestValue: ['ta', 'to', 'ta0', 'tào', 'táo', 'tảo', 'tão'] },
          {id: 61, value: ['Tạo', 'tạo'], rawValue: ['Tao', 'tao'], mapSuggestValue: ['tạ0', 'taoj', 'tajo', 'tọ']}, 
          {id: 62, value: ['Tòng', 'tòng'], rawValue: ['Tong', 'tong'], mapSuggestValue: ['tòn', 'tng', 'tonfg', 'tongf', 'tóng', 'tỏng', 'tọng', 'tõng', 'tòmg', 'tonhf', 'tònh']}, 
          {id: 63, value: ['Vang', 'vang'], rawValue: ['Vang', 'vang'], mapSuggestValue: ['van', 'vng', 'vamg', 'vanh']}, 
          {id: 64, value: ['Vì', 'vì'], rawValue: ['Vi', 'vi'], mapSuggestValue: ['ví', 'vỉ', 'vị', 'vĩ', 'vỳ', 'vyf', 'vif']},
          {id: 65, value: ['Sa', 'sa'], rawValue: ['Sa', 'sa'], mapSuggestValue: ['sas', 'sá', 'sạ', 'sã', 'sà', 'sả']}, 
          {id: 66, value: ['Xa', 'xa'], rawValue: ['Xa', 'xa'], mapSuggestValue: ['xax', 'xá', 'xạ', 'xã', 'xà', 'xả']}, 
          {id: 67, value: ['Xin', 'xin'], rawValue: ['Xin', 'xin'], mapSuggestValue: ['xim', 'xi', 'xịn', 'xĩn', 'xìn', 'xỉn', 'sin']}, 
          
          {id: 68, value: ['Hà', 'hà'], rawValue: ['Ha', 'ha'], mapSuggestValue: ['ga', 'hả', 'há', 'hạ', 'hã', 'haf','hầ', 'hằ']},
          {id: 69, value: ['An', 'an'], rawValue: ['An', 'an'], mapSuggestValue: ['am', 'án', 'àn', 'ãn', 'ản']},
          {id: 70, value: ['Anh', 'anh'], rawValue: ['Anh', 'anh'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 71, value: ['Ao', 'ao'], rawValue: ['Ao', 'ao'], mapSuggestValue: ['a0', 'áo', 'ào', 'ão', 'ảo', 'ăo', 'âo']},
          {id: 72, value: ['Ánh', 'ánh'], rawValue: ['Anh', 'anh'], mapSuggestValue: ['ành', 'ãnh', 'ảnh', 'ạnh', 'ámh', 'asnh', 'anhs']},
          {id: 73, value: ['Ân', 'ân'], rawValue: ['An', 'an'], mapSuggestValue: ['ăn', 'âm', 'ấn', 'ần', 'ẩn', 'ận', 'ẫn', 'aan', 'aam']},
          {id: 74, value: ['Âu Dương', 'âu dương'], rawValue: ['Au Duong', 'au duong'], mapSuggestValue: ['aau duwowng', 'âu rương', 'âu giương', 'âu zương', 'au dương', 'âu dươnh', 'âu duơng', 'âu dưong']},
          {id: 75, value: ['Ấu', 'ấu'], rawValue: ['Au', 'au'], mapSuggestValue: ['ắu', 'ăú', 'ầu', 'ẩu', 'ẫu', 'ậu', 'aáu', 'aaus']},
          {id: 76, value: ['Bá', 'bá'], rawValue: ['Ba', 'ba'], mapSuggestValue: ['ba', 'bà', 'bả', 'bã', 'bạ', 'bas']},
          {id: 77, value: ['Bạc', 'bạc'], rawValue: ['Bac', 'bac'], mapSuggestValue: ['bác', 'bàc', 'bacj', 'bãc', 'bảc', 'bặc', 'bậc']},
          {id: 78, value: ['Bạch', 'bạch'], rawValue: ['Bach', 'bach'], mapSuggestValue: ['bacg', 'bách', 'bajch', 'bachj']},
          {id: 79, value: ['Bàn', 'bàn'], rawValue: ['Ban', 'ban'], mapSuggestValue: ['bàm', 'bà', 'bạn', 'bãn', 'bản', 'bán', 'banf', 'bafn']},
          {id: 80, value: ['Bàng', 'bàng'], rawValue: ['Bang', 'bang'], mapSuggestValue: ['bamgf', 'báng', 'bảng', 'bãng', 'bạng', 'bành', 'bangf', 'bafng', 'bàmg']},
          {id: 81, value: ['Bành', 'bành'], rawValue: ['Banh', 'banh'], mapSuggestValue: ['bamh', 'bánh', 'bảnh', 'bãnh', 'bạnh', 'bàng', 'banhf', 'bafnh', 'bàmh']},
          {id: 82, value: ['Bảo', 'bảo'], rawValue: ['Bao', 'bao'], mapSuggestValue: ['bả0', 'bả', 'baro', 'báo', 'bào', 'bạo', 'bão', 'bẩo', 'bẳo']},
      
          {id: 83, value: ['Bế', 'bế'], rawValue: ['Be', 'be'], mapSuggestValue: ['be', 'bê', 'bề', 'bể', 'bệ', 'bễ', 'bão', 'bẩo', 'bẳo']},
          {id: 84, value: ['Bì', 'bì'], rawValue: ['Bi', 'bi'], mapSuggestValue: ['b', 'bí', 'bĩ', 'bỉ', 'bị']},
          {id: 85, value: ['Biện', 'biện'], rawValue: ['Bien', 'bien'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 86, value: ['Bình', 'bình'], rawValue: ['Binh', 'binh'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 87, value: ['Bồ', 'bồ'], rawValue: ['Bo', 'bo'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 88, value: ['Bung', 'bung'], rawValue: ['Bung', 'bung'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 89, value: ['Chriêng', 'chriêng'], rawValue: ['Chrieng', 'chrieng'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 90, value: ['Ca', 'ca'], rawValue: ['Ca', 'ca'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 91, value: ['Cái', 'cái'], rawValue: ['Cai', 'cai'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 92, value: ['Cai', 'cai'], rawValue: ['Cai', 'cai'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 93, value: ['Cam', 'cam'], rawValue: ['Cam', 'cam'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 94, value: ['Cảnh', 'cảnh'], rawValue: ['Canh', 'canh'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 95, value: ['Cao', 'cao'], rawValue: ['Cao', 'cao'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 96, value: ['Cáp', 'cáp'], rawValue: ['Cap', 'cap'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 97, value: ['Cát', 'cát'], rawValue: ['Cat', 'cat'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 98, value: ['Cầm', 'cầm'], rawValue: ['Cam', 'cam'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 99, value: ['Cấn', 'cấn'], rawValue: ['Can', 'can'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 100, value: ['Chế', 'chế'], rawValue: ['Che', 'che'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
    
          {id: 101, value: ['Chiêm', 'chiêm'], rawValue: ['Chiem', 'chiem'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 102, value: ['Chu', 'chu'], rawValue: ['Chu', 'chu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 103, value: ['Châu', 'châu'], rawValue: ['Chau', 'chau'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 104, value: ['Chung', 'chung'], rawValue: ['Chung', 'chung'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 105, value: ['Chúng', 'chúng'], rawValue: ['Chung', 'chung'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 106, value: ['Chương', 'chương'], rawValue: ['Chuong', 'chuong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 107, value: ['Chử', 'chử'], rawValue: ['Chu', 'chu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 108, value: ['Cồ', 'cồ'], rawValue: ['Co', 'co'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 109, value: ['Cổ', 'cổ'], rawValue: ['Co', 'co'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 110, value: ['Công', 'công'], rawValue: ['Cong', 'cong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 111, value: ['Cống', 'cống'], rawValue: ['Cong', 'cong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 112, value: ['Cung', 'cung'], rawValue: ['Cung', 'cung'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 113, value: ['Cù', 'cù'], rawValue: ['Cu', 'cu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 114, value: ['Cự', 'cự'], rawValue: ['Cu', 'cu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 115, value: ['Dã', 'dã'], rawValue: ['Da', 'da'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 116, value: ['DAnh', 'danh'], rawValue: ['DAnh', 'danh'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 117, value: ['Diêm', 'diêm'], rawValue: ['Diem', 'diem'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 118, value: ['Diệp', 'diệp'], rawValue: ['Diep', 'diep'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 119, value: ['Doãn', 'doãn'], rawValue: ['Doan', 'doan'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 120, value: ['Duy', 'duy'], rawValue: ['Duy', 'duy'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 121, value: ['Dư', 'dư'], rawValue: ['Du', 'du'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 122, value: ['Đái', 'đái'], rawValue: ['Dai', 'dai'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 123, value: ['Điều', 'điều'], rawValue: ['Dieu', 'dieu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 124, value: ['Đan', 'đan'], rawValue: ['Dan', 'dan'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 125, value: ['Đàm', 'đàm'], rawValue: ['Dam', 'dam'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 126, value: ['Đào', 'đào'], rawValue: ['Dao', 'dao'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 127, value: ['Đầu', 'đầu'], rawValue: ['Dau', 'dau'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          
          {id: 128, value: ['Đậu', 'đậu'], rawValue: ['Dau', 'dau'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 129, value: ['Đèo', 'đèo'], rawValue: ['Deo', 'deo'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 130, value: ['Điền', 'điền'], rawValue: ['Dien', 'dien'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 131, value: ['Đinh', 'đinh'], rawValue: ['Dinh', 'dinh'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 132, value: ['Điêu', 'điêu'], rawValue: ['Dieu', 'dieu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 133, value: ['Đoàn', 'đoàn'], rawValue: ['Doan', 'doan'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 134, value: ['Đoạn', 'đoạn'], rawValue: ['Doan', 'doan'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 135, value: ['Đôn', 'đôn'], rawValue: ['Don', 'don'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 136, value: ['Đống', 'đống'], rawValue: ['Dong', 'dong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 137, value: ['Đồ', 'đồ'], rawValue: ['Do', 'do'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 138, value: ['Đồng', 'đồng'], rawValue: ['Dong', 'dong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 139, value: ['Đổng', 'đổng'], rawValue: ['Dong', 'dong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 140, value: ['Đới', 'đới'], rawValue: ['Doi', 'doi'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 141, value: ['Đương', 'đương'], rawValue: ['Duong', 'duong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 142, value: ['Đường', 'đường'], rawValue: ['Duong', 'duong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 143, value: ['Đức', 'đức'], rawValue: ['Duc', 'duc'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 144, value: ['Đăng', 'đăng'], rawValue: ['Dang', 'dang'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']}, 
          {id: 145, value: ['Giả', 'giả'], rawValue: ['Gia', 'gia'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 146, value: ['Giao', 'giao'], rawValue: ['Giao', 'giao'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 147, value: ['Giang', 'giang'], rawValue: ['Giang', 'giang'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 147, value: ['Giàng', 'giàng'], rawValue: ['Giang', 'giang'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 149, value: ['Giáp', 'giáp'], rawValue: ['Giap', 'giap'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 150, value: ["H'", "h'"], rawValue: ["H'", "h'"], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 151, value: ["H'ma", "h'ma"], rawValue: ["H'ma", "h'ma"], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 152, value: ["H'nia", "h'nia"], rawValue: ["H'nia", "h'nia"], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 153, value: ['Hầu', 'hầu'], rawValue: ['Hau', 'hau'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 154, value: ['Hà', 'hà'], rawValue: ['Ha', 'ha'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 155, value: ['Hạ', 'hạ'], rawValue: ['Ha', 'ha'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 156, value: ['Hàn', 'hàn'], rawValue: ['Han', 'han'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 157, value: ['Hán', 'hán'], rawValue: ['Han', 'han'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 158, value: ['Hề', 'hề'], rawValue: ['He', 'he'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 159, value: ['Hi', 'hi'], rawValue: ['Hi', 'hi'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 160, value: ['Hình', 'hình'], rawValue: ['Hinh', 'hinh'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 161, value: ['Hoa', 'hoa'], rawValue: ['Hoa', 'hoa'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 162, value: ['Hồng', 'hồng'], rawValue: ['Hong', 'hong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 163, value: ['Hùng', 'hùng'], rawValue: ['Hung', 'hung'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 164, value: ['Hứa', 'hứa'], rawValue: ['Hua', 'hua'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 165, value: ['Hướng', 'hướng'], rawValue: ['Huong', 'huong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 166, value: ['Kông', 'kông'], rawValue: ['Kong', 'kong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 167, value: ['Kiểu', 'kiểu'], rawValue: ['Kieu', 'kieu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 168, value: ['Kha', 'kha'], rawValue: ['Kha', 'kha'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 169, value: ['Khà', 'khà'], rawValue: ['Kha', 'kha'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 170, value: ['Khương', 'khương'], rawValue: ['Khuong', 'khuong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 171, value: ['Khâu', 'khâu'], rawValue: ['Khau', 'khau'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 172, value: ['Khiếu', 'khiếu'], rawValue: ['Khieu', 'khieu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 173, value: ['Khoa', 'khoa'], rawValue: ['Khoa', 'khoa'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 174, value: ['Khổng', 'khổng'], rawValue: ['Khong', 'khong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 175, value: ['Khu', 'khu'], rawValue: ['Khu', 'khu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 176, value: ['Khuất', 'khuat'], rawValue: ['Khuat', 'khuat'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 177, value: ['Khúc', 'khúc'], rawValue: ['Khuc', 'khuc'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 178, value: ['Kiều', 'kiều'], rawValue: ['Kieu', 'kieu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 179, value: ['Kim', 'kim'], rawValue: ['Kim', 'kim'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 180, value: ['Khai', 'khai'], rawValue: ['Khai', 'khai'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 181, value: ['Lyly', 'lyly'], rawValue: ['Lyly', 'lyly'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 182, value: ['La', 'la'], rawValue: ['La', 'la'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 183, value: ['Lã', 'lã'], rawValue: ['La', 'la'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 184, value: ['Lãnh', 'lãnh'], rawValue: ['Lanh', 'lanh'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 185, value: ['Lạc', 'lạc'], rawValue: ['Lac', 'lac'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 186, value: ['Lại', 'lại'], rawValue: ['Lai', 'lai'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 187, value: ['Lăng', 'lăng'], rawValue: ['Lang', 'lang'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 188, value: ['Lâm', 'lâm'], rawValue: ['Lam', 'lam'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 189, value: ['Lèng', 'lèng'], rawValue: ['Leng', 'leng'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 190, value: ['Lều', 'lều'], rawValue: ['Leu', 'leu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 191, value: ['Liên', 'liên'], rawValue: ['Lien', 'lien'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 192, value: ['Liêu', 'liêu'], rawValue: ['Lieu', 'lieu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 193, value: ['Liễu', 'liễu'], rawValue: ['Lieu', 'lieu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 194, value: ['Lò', 'lò'], rawValue: ['Lo', 'lo'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 195, value: ['Lô', 'lô'], rawValue: ['Lo', 'lo'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 196, value: ['Lỗ', 'lỗ'], rawValue: ['Lo', 'lo'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 197, value: ['Lộ', 'Lộ'], rawValue: ['Lo', 'lo'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 198, value: ['Luyện', 'Luyện'], rawValue: ['Luyen', 'luyen'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 199, value: ['Lục', 'lục'], rawValue: ['Luc', 'luc'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 200, value: ['Lư', 'lư'], rawValue: ['Lu', 'lu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 201, value: ['Lữ', 'lữ'], rawValue: ['Lu', 'lu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 202, value: ['Lương', 'lương'], rawValue: ['Luong', 'luong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 203, value: ['Lưu', 'lưu'], rawValue: ['Luu', 'luu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 204, value: ['Lý', 'lý'], rawValue: ['Ly', 'ly'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 205, value: ['Mùa', 'mùa'], rawValue: ['Mua', 'mua'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 206, value: ['Ma', 'ma'], rawValue: ['Ma', 'ma'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 207, value: ['Mai', 'mai'], rawValue: ['Mai', 'mai'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 208, value: ['Mang', 'mang'], rawValue: ['Mang', 'mang'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 209, value: ['Mã', 'mã'], rawValue: ['Ma', 'ma'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 210, value: ['Mạc', 'mạc'], rawValue: ['Mac', 'mac'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 211, value: ['Mạch', 'mạch'], rawValue: ['Mach', 'mach'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 212, value: ['Mạnh', 'mạnh'], rawValue: ['Manh', 'manh'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 213, value: ['Mâu', 'mâu'], rawValue: ['Mau', 'mau'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 214, value: ['Mầu', 'mầu'], rawValue: ['Mau', 'mau'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 215, value: ['Màu', 'màu'], rawValue: ['Mau', 'mau'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 216, value: ['Mẫn', 'mẫn'], rawValue: ['Man', 'man'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 217, value: ['Mộc', 'mộc'], rawValue: ['Moc', 'moc'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 218, value: ['Mục', 'mục'], rawValue: ['Muc', 'muc'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 219, value: ['Nhan', 'nhan'], rawValue: ['Nhan', 'nhan'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 220, value: ['Ninh', 'ninh'], rawValue: ['Ninh', 'ninh'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 221, value: ['Nhâm', 'nhâm'], rawValue: ['Nham', 'nham'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 222, value: ['Ngân', 'ngân'], rawValue: ['Ngan', 'ngan'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 223, value: ['Nghiêm', 'nghiêm'], rawValue: ['Nghiem', 'nghiem'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 224, value: ['Nghị', 'nghị'], rawValue: ['Nghi', 'nghi'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 225, value: ['Ngọ', 'ngọ'], rawValue: ['Ngo', 'ngo'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 226, value: ['Ngọc', 'ngọc'], rawValue: ['Ngoc', 'ngoc'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 227, value: ['Ngũ', 'ngũ'], rawValue: ['Ngu', 'ngu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 228, value: ['Ngụy', 'ngụy'], rawValue: ['Nguy', 'nguy'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 229, value: ['Nhữ', 'nhữ'], rawValue: ['Nhu', 'nhu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 230, value: ['Nông', 'nông'], rawValue: ['Nong', 'nong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 231, value: ['Ong', 'ong'], rawValue: ['Ong', 'ong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 232, value: ['Ông', 'ông'], rawValue: ['Ong', 'ong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 233, value: ['Phi', 'phi'], rawValue: ['Phi', 'phi'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 234, value: ['Phí', 'phí'], rawValue: ['Phi', 'phi'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 235, value: ['Phó', 'phó'], rawValue: ['Pho', 'pho'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 236, value: ['Phù', 'phù'], rawValue: ['Phu', 'phu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 237, value: ['Phú', 'phú'], rawValue: ['Phu', 'phu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 238, value: ['Phùng', 'phùng'], rawValue: ['Phung', 'phung'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 239, value: ['Phương', 'phương'], rawValue: ['Phuong', 'phuong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 240, value: ['Quản', 'quản'], rawValue: ['Quan', 'quan'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 241, value: ['Quàng', 'quàng'], rawValue: ['Quang', 'quang'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 242, value: ['Quách', 'quách'], rawValue: ['Quach', 'quach'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 243, value: ['Sái', 'sái'], rawValue: ['Sai', 'sai'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 244, value: ['Sầm', 'sầm'], rawValue: ['Sam', 'sam'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 245, value: ['Sơn', 'sơn'], rawValue: ['Son', 'son'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 246, value: ['Sử', 'sử'], rawValue: ['Su', 'su'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 247, value: ['Sùng', 'sùng'], rawValue: ['Sung', 'sung'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 248, value: ['Tán', 'tán'], rawValue: ['Tan', 'tan'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 249, value: ['Tào', 'tào'], rawValue: ['Tao', 'tao'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 250, value: ['Tạ', 'tạ'], rawValue: ['Ta', 'ta'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 251, value: ['Tăng', 'tăng'], rawValue: ['Tang', 'tang'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 252, value: ['Tấn', 'tấn'], rawValue: ['Tan', 'tan'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 253, value: ['Tề', 'tề'], rawValue: ['Te', 'te'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 254, value: ['Thang', 'thang'], rawValue: ['Thang', 'thang'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 255, value: ['Thái', 'thái'], rawValue: ['Thai', 'thai'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 256, value: ['Thành', 'thành'], rawValue: ['Thanh', 'thanh'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 257, value: ['Thào', 'thào'], rawValue: ['Thao', 'thao'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 258, value: ['Thach', 'thạch'], rawValue: ['Thach', 'thach'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 259, value: ['Thân', 'thân'], rawValue: ['Than', 'than'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 260, value: ['Thẩm', 'thẩm'], rawValue: ['Tham', 'tham'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 261, value: ['Thập', 'thập'], rawValue: ['Thap', 'thap'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 262, value: ['Thế', 'thế'], rawValue: ['The', 'the'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 263, value: ['Thi', 'thi'], rawValue: ['Thi', 'thi'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 264, value: ['Thiều', 'thiều'], rawValue: ['Thieu', 'thieu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 265, value: ['Thịnh', 'thịnh'], rawValue: ['Thinh', 'thinh'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 266, value: ['Thoa', 'thoa'], rawValue: ['Thoa', 'thoa'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 267, value: ['Thôi', 'thôi'], rawValue: ['Thoi', 'thoi'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 268, value: ['Thục', 'thục'], rawValue: ['Thuc', 'thuc'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 269, value: ['Tiêu', 'tiêu'], rawValue: ['Tieu', 'tieu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 270, value: ['Tiếp', 'tiếp'], rawValue: ['Tiep', 'tiep'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 271, value: ['Tinh', 'tinh'], rawValue: ['Tinh', 'tinh'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 272, value: ['Tòng', 'tòng'], rawValue: ['Tong', 'tong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 273, value: ['Tô', 'tô'], rawValue: ['To', 'to'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 274, value: ['Tôn', 'tôn'], rawValue: ['Ton', 'ton'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 275, value: ['Tôn Thất', 'tôn thất'], rawValue: ['Ton That', 'ton that'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 276, value: ['Tông', 'tông'], rawValue: ['Tong', 'tong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 277, value: ['Tống', 'tống'], rawValue: ['Tong', 'tong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 278, value: ['Trang', 'trang'], rawValue: ['Trang', 'trang'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 279, value: ['Trác', 'trác'], rawValue: ['Trac', 'trac'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 280, value: ['Trà', 'trà'], rawValue: ['Tra', 'tra'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 281, value: ['Tri', 'Tri'], rawValue: ['Tri', 'Tri'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 282, value: ['Triệu', 'triệu'], rawValue: ['Trieu', 'trieu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 283, value: ['Trình', 'trình'], rawValue: ['Trinh', 'trinh'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 284, value: ['Trịnh', 'trịnh'], rawValue: ['Trinh', 'trinh'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 285, value: ['Trưng', 'trưng'], rawValue: ['Trung', 'trung'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 286, value: ['Trương', 'trương'], rawValue: ['Truong', 'truong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 287, value: ['Tuấn', 'tuấn'], rawValue: ['Tuan', 'tuan'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 288, value: ['Từ', 'từ'], rawValue: ['Tu', 'tu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 289, value: ['Ty', 'ty'], rawValue: ['Ty', 'ty'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 290, value: ['Uông', 'uông'], rawValue: ['Uong', 'uong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 291, value: ['Ung', 'ung'], rawValue: ['Ung', 'ung'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 292, value: ['Ưng', 'Ưng'], rawValue: ['Ung', 'ung'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 293, value: ['Ứng', 'ứng'], rawValue: ['Ung', 'ung'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 294, value: ['Vạn', 'vạn'], rawValue: ['Van', 'van'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 295, value: ['Văn', 'văn'], rawValue: ['Van', 'van'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 296, value: ['Vi', 'vi'], rawValue: ['Vi', 'vi'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 297, value: ['Viêm', 'viêm'], rawValue: ['Viem', 'viem'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 298, value: ['Viên', 'viên'], rawValue: ['Vien', 'vien'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 299, value: ['Vương', 'vương'], rawValue: ['Vuong', 'vuong'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 300, value: ['Vưu', 'vưu'], rawValue: ['Vuu', 'vuu'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 301, value: ['Xa', 'xa'], rawValue: ['Xa', 'xa'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 302, value: ['Xung', 'xung'], rawValue: ['Xung', 'xung'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          {id: 303, value: ['Yên', 'yên'], rawValue: ['Yen', 'yen'], mapSuggestValue: ['amh', 'ành', 'ãnh', 'ảnh', 'ang', 'ăn', 'ănh', 'ăng']},
          
          // An
          ]
      }
    
      checkEmailInvalidFormat(input){
        let strcheck = input;
                if(input.indexOf('@') != -1){
                  strcheck = input.split('@')[1];
                }
        let arr = ['mail.com', 'gail.com', 'gmil.com', 'gmal.com', 'gmai.com', 'gmail.con', 'ggmail.com', 'gmmail.com', 'gmâil.com', 'gmaail.com', 'gmaiil.com', 'gmaill.com','ail.com','gil.com','gma.com','il.com','gi.com','gm.com',
        'ahoo.com', 'yhoo.com','yaoo.com', 'yaho.com', 'yah.com','yahoo.con','yahô.com','yo.com','ya.com','ya.com','oo.com',
        'ahoo.com.vn', 'yhoo.com.vn','yaoo.com.vn', 'yaho.com.vn', 'yah.com.vn','yahoo.con.vn','yahô.com.vn','yo.com.vn','ya.com.vn','ya.com.vn','oo.com.vn',
        'otmail.com','htmail.com', 'homail.com','hotail.com','hotmil.com','hotmal.com','hotmai.com','hotnail.com', 'hotmail.con','hmail.com','mail.com','hail.com','hoil.com','hotl.com','hotm.com','hot.com','ho.com','tmail.com',
        'cloud.com','iloud.com','icoud.com','iclud.com','iclod.com','iclou.com','icloud.con','loud.com','icoud.com','icld.com','iclo.com','oud.com','iud.com','icd.com','icl.com','ic.com','cl.com','lo.com','ou.com','ud.com']
        return arr.indexOf(strcheck) != -1;
      }
    
      checkPhoneInValidFormat(input){
        let arrBeginNumber = ['086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039', //viettel
                              '088', '091', '094', '083', '084', '085', '081', '082', //vinaphone
                              '092', '056', '058', //vietnammobile
                              '089', '090', '093', '070', '079', '077', '076', '078', //mobilephonephone
                              '099', '059' //gmobile
                              ];
        //let beginnum = input.substring(0, 3);
        //return arrBeginNumber.indexOf(beginnum) == -1;
        if(input && input*1 && input.length ==10 && input.startsWith('0'))
        {
            return false;
        }
        else if(input && input*1 && input.length ==11 && input.startsWith('84'))
        {
            return false;
        }
        else {
          return true;
        }
      }

      async showAlertOutOfTicketFromMytrip(itemFlight, type){
        var se = this;
        let msg ='';
        if(itemFlight.errorHoldTicket == 1){
            msg = 'Chuyến bay '+itemFlight.departFlight.airlineCode + ' từ ' + itemFlight.departCity + ' đi ' + itemFlight.returnCity + ' vào ' + itemFlight.checkInDisplay + ' lúc ' + moment(itemFlight.departFlight.departTime).format('HH:mm') + ' → ' + moment(itemFlight.departFlight.landingTime).format('HH:mm') + ' đã hết vé. Vui lòng chọn chuyến bay khác.';
        }
        else if(itemFlight.errorHoldTicket == 2){
            msg = 'Chuyến bay '+itemFlight.returnFlight.airlineCode + ' từ ' + itemFlight.returnCity + ' đi ' + itemFlight.departCity + ' vào ' + itemFlight.checkOutDisplay + ' lúc ' + moment(itemFlight.returnFlight.departTime).format('HH:mm') + ' → ' + moment(itemFlight.returnFlight.landingTime).format('HH:mm') + ' đã hết vé. Vui lòng chọn chuyến bay khác.';
        }
        else{
            msg = 'Các chuyến bay đã chọn không giữ được vé. Vui lòng chọn chuyến bay khác!';
        }
        let alert = await se.alertCtrl.create({
          message: msg,
          header: type == 1 ? 'Rất tiếc, vé máy bay đã hết' : 'Rất tiếc, vé không giữ được',
          cssClass: "cls-alert-refreshPrice",
          backdropDismiss: false,
          buttons: [
          {
            text: 'OK',
            role: 'OK',
            handler: () => {
              se._flightService.itemTabFlightActive.emit(true);
              se.valueGlobal.backValue = "homeflight";
              se._flightService.itemMenuFlightClick.emit(2);
              se.navCtrl.navigateBack('/tabs/tab1');
            }
          }
        ]
      });
      alert.present();
      }

      updatePaymentMethodForCombo(bookingCode, paymentType){
        var options = {
          'method': 'POST',
          'url': C.urls.baseUrl.urlContracting + '/api/toolsapi/UpdatePaymentMethod?HotelCode=' + bookingCode + '&paymentMethod=' + paymentType + '',
          'headers': {
          }
        };
        let headers = {};
          let strUrl = C.urls.baseUrl.urlContracting + '/api/toolsapi/UpdatePaymentMethod?HotelCode=' + bookingCode + '&paymentMethod=' + paymentType + '';
          this.RequestApi('POST', strUrl, headers, {}, 'globalFunction', 'updatePaymentMethodForCombo').then((data) => {
        })
      }

      getCathayByKey(key: string) : Promise<any>{
        return new Promise((resolve, reject) => {
          var options = {
            'method': 'GET',
            'url':C.urls.baseUrl.urlMobile+"/api/dashboard/GetCathayByKey?key=" + key,
            'headers': {
            }
          };
          let headers = {};
          let strUrl = C.urls.baseUrl.urlMobile+"/api/dashboard/GetCathayByKey?key=" + key;
          this.RequestApi('GET', strUrl, headers, {}, 'globalFunction', 'getCathayByKey').then((data) => {
            resolve(data);
          });
        })
      }

      setCacheSearchHotelInfo(objSearch){
        this.storage.get('cacheSearchHotelInfo').then((data) => {
          if(data){
              this.storage.remove('cacheSearchHotelInfo').then(()=>{
                this.storage.set('cacheSearchHotelInfo', objSearch);
              })
          }else{
            this.storage.set('cacheSearchHotelInfo', objSearch);
          }
        })
      }
      // lưu cache search
      setCacheSearch(objSearch,stt): Promise<any> {
        return new Promise((resolve, reject) => {
          this.storage.get('arrHistory').then((data) => {
            if(data && stt==1){
              for (let i = 0; i < data.length; i++) {
                const element = data[i];
                if (objSearch.id==element.id) {
                  data.splice(i, 1);
                }
                
              }
            }
           this.searchhotel.objRecent=objSearch;
            if( !objSearch.imageUrl){
              if(objSearch.isType==0 ){
                // this.getHoteldetail(objSearch.id).then((obj) => {
                //   if(obj){
                //     objSearch.imageUrl=obj;
                //   }
                  
                  if(data && data.length>2){
                    data.splice(0, 1);
                    data.push(objSearch) 
                   
                    this.storage.set('arrHistory', data);
                    
                  }else{
                    if(!data){
                      data=[];
                    }
                    data.push(objSearch);
                   
                    this.storage.set('arrHistory', data);
                  }
                //})
              }else{
                this.storage.get('listtopregions').then(dataregion => {
                  if(dataregion){
                    var el = dataregion.filter(item => item.regionId==objSearch.id);
                    if(el && el.length >0){
                      if(el[0].image){
                        objSearch.imageUrl= (el[0].image.toLocaleString().trim().indexOf("http") == -1) ? 'https:' +el[0].image: el[0].image;
                      }
               
    
                    }else{
                      objSearch.imageUrl='https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage-110x110.jpg'
                    }
                    if(data && data.length>2){
                      data.splice(0, 1);
                      data.push(objSearch) 
                     
                      this.storage.set('arrHistory', data);
                      
                    }else{
                      if(!data){
                        data=[];
                      }
                      data.push(objSearch);
                     
                      this.storage.set('arrHistory', data);
                    }
                  }
                  
                })
              }
            
            }else{
              if(data && data.length>2){
                data.splice(0, 1);
                data.push(objSearch) 
               
                this.storage.set('arrHistory', data);
                
              }else{
                if(!data){
                  data=[];
                }
              
                data.push(objSearch);
               
                this.storage.set('arrHistory', data);
              }
            }
           
            resolve(true);
          })
         
        })
       
      }
      getHoteldetail(id): Promise<any> {
        return new Promise((resolve, reject) => {
          let url = C.urls.baseUrl.urlPost + "/mhoteldetail/" +id;
          var se = this;
            
            se.RequestApi('POST', url, {}, {}, 'globalFunction', 'getHoteldetail').then((data) => {
                let jsondata = data;
                if(jsondata.Avatar){
                  jsondata.Avatar = (jsondata.Avatar.toLocaleString().trim().indexOf("http") == -1) ? 'https:' + jsondata.Avatar : jsondata.Avatar;
                }
                resolve(jsondata.Avatar);
              })
            
        })
    }

    getFormData(object) {
      let body = '';
      Object.keys(object).forEach(key => {
        if (typeof object[key] !== 'object') {
          if(!body){
            body += `${key}=${object[key]}`;
          }else{
            body += `&${key}=${object[key]}`;
          }
        }
        //else formData.append(key, JSON.stringify(object[key]))
      })
      //return formData;
      return body;
  }

  getIsoDate(cin, cout){
    let _darr:any = moment(cin).format('YYYY-MM-DD hh:mm:ss').split(' '),
    _darrday =  _darr[0].split('-'),
    _darrhour =  _darr[1].split(':');
    let _darr_return:any = moment(cout).format('YYYY-MM-DD hh:mm:ss').split(' '),
    _darrday_return =  _darr_return[0].split('-'),
    _darrhour_return =  _darr_return[1].split(':');
    let _d =new Date(Date.UTC(_darrday[0], _darrday[1] -1, _darrday[2], _darrhour[0], _darrhour[1], _darrhour[2])), final = (_d.getTime() + Math.abs((_d.getTimezoneOffset()))*2 );
    let _dReturn = new Date(Date.UTC(_darrday_return[0], _darrday_return[1] -1, _darrday_return[2], _darrhour_return[0], _darrhour_return[1], _darrhour_return[2])), final_return = (_dReturn.getTime() + Math.abs((_dReturn.getTimezoneOffset()))*2);
    let _isoDate = new Date(final).toISOString().replace('Z','');
    let _isoDate_return = new Date(final_return).toISOString().replace('Z','');
    return { cin: _isoDate, cout: _isoDate_return};
  }

  getCinIsoDate(cin){
    let _darr:any = moment(cin).format('YYYY-MM-DD hh:mm:ss').split(' '),
    _darrday =  _darr[0].split('-'),
    _darrhour =  _darr[1].split(':');
    let _d =new Date(Date.UTC(_darrday[0], _darrday[1] -1, _darrday[2], _darrhour[0], _darrhour[1], _darrhour[2])), final = (_d.getTime() + Math.abs((_d.getTimezoneOffset()))*2 );
    let _isoDate = new Date(final).toISOString().replace('Z','');
    return _isoDate;
  }

  checkAllotment(hotelId, roomId, cin, cout, roomNumber) :Promise<any> {
    return new Promise((resolve, reject) => {
      let headers = {};
      let strUrl = C.urls.baseUrl.urlContracting + `/api/toolsapi/CheckAllotment?token=3b760e5dcf038878925b5613c32615ea3&hotelcode=${hotelId}&roomcode=${roomId}&checkin=${cin}&checkout=${cout}&totalroom=${roomNumber}`;
      this.RequestApi('GET', strUrl, headers, {}, 'globalFunction', 'CreateUrl').then((data) => {
        var rs = data;
        resolve(rs.Msg);
      });
    })
    
  }

  checkAllotmentSeri(hotelId, roomId, cin, cout, roomNumber, supplier, token) :Promise<any> {
    return new Promise((resolve, reject) => {
      
      let url= C.urls.baseUrl.urlContracting + `/api/toolsapi/CheckAllotment?token=3b760e5dcf038878925b5613c32615ea3&hotelcode=${hotelId}
      &roomcode=${roomId}&checkin=${cin}&checkout=${cout}&totalroom=${roomNumber}&supplier=${supplier}&bookingRequestXml=${token}`;
      this.RequestApi('GET', url, {}, {}, 'globalFunction', 'checkAllotmentSeri').then((rs)=> {
        resolve(rs.Msg == "AL");
      });
    })
    
  }

  removeString(input){
    input = input.replace('MSTR','').replace('MISS','').replace('MR','').replace('MRS','').replace('MS','');
    input = input.replace('mstr','').replace('miss','').replace('mr','').replace('mrs','').replace('ms','');
    input = input.replace('Mstr','').replace('Miss','').replace('Mr','').replace('Mrs','').replace('Ms','');
    return input.toLowerCase().trim();
  }

  async showAlertTourPaymentFail(msg){
    var se = this;
    let alert = await this.alertCtrl.create({
      message: msg,
      header: 'Rất tiếc, thanh toán không thành công',
      cssClass: "cls-alert-refreshPrice",
      backdropDismiss: false,
      buttons: [
      {
        text: 'OK',
        role: 'OK',
        handler: () => {
          this.tourService.itemPaymentDone.emit(true);
          this.valueGlobal.backValue = "hometour";
          this.navCtrl.navigateBack('app/tabs/tab1');
        }
      }
    ]
  });
  alert.present();
  }

  
  async createListLastSearchFlight(item){
    let listLastSearch = await this.storage.get(('listLastSearchFlight'));
      if(listLastSearch && listLastSearch.length >0){
        if(listLastSearch.length >2){
          if(!this.checkExistsItemInArray(listLastSearch, item, 'listlastsearch')){
            listLastSearch.splice(0,1);
            listLastSearch.push(item);
          }
          
        }else{
          if(!this.checkExistsItemInArray(listLastSearch, item, 'listlastsearch')){
            listLastSearch.push(item);
          }
        }
        this.storage.set('listLastSearchFlight', listLastSearch);
      }else {
        listLastSearch = [];
        listLastSearch.push(item);
        this.storage.set('listLastSearchFlight', listLastSearch);
      }
  }

  async getListLastSearchFlight() {
    return await this.storage.get(('listLastSearchFlight'));
  }

  getAllPlaceByArea(): Promise<any>{
    let url = C.urls.baseUrl.urlFlightInt + 'api/FlightSearch/GetAllPlaceByArea';
    return new Promise((resolve, reject) => {
      this.RequestApi("GET", url, {}, {}, "homeflight", "GetAllPlaceByArea").then((data) =>{
        if(data && data.success && data.data && data.data.length>0 ){
          let listAllPlaceByArea:any = [];
          for (let index = 0; index < data.data.length; index++) {
            const element = data.data[index];
            let _places:any = [];
              element.countries.forEach(elementCountry => {
                  let item:any = {};
                  if(_places.length ==0){
                    _places = [...elementCountry.places.map(item => {
                      return <Place> {
                        airport: item.airportName,
                        airportName: item.airportName,
                        city: item.placeName,
                        code: item.placeCode,
                        count: 0,
                        country: elementCountry.countryName,
                        countryCode: elementCountry.countryCode,
                        id: item.placeId,
                        internal: elementCountry.countryCode == 'VN' ? 1 : 0,
                        name: item.placeName,
                        order: 0,
                        shortAirportName: '',
                        type: 'place',
                        urlCode: '',
                      }
                    })];
                  }else if(_places.length >0){
                    if(!this.checkExistsItemInArray(_places, item, 'areavn')){
                      _places = [..._places, ...elementCountry.places.map(item => {
                        return <Place> {
                          airport: item.airportName,
                          airportName: item.airportName,
                          city: item.placeName,
                          code: item.placeCode,
                          count: 0,
                          country: elementCountry.countryName,
                          countryCode: elementCountry.countryCode,
                          id: item.placeId,
                          internal: elementCountry.countryCode == 'VN' ? 1 : 0,
                          name: item.placeName,
                          order: 0,
                          shortAirportName: '',
                          type: 'place',
                          urlCode: '',
                        }
                      })]
                    }else {
                      _places = [...elementCountry.places.map(item => {
                        return <Place> {
                          airport: item.airportName,
                          airportName: item.airportName,
                          city: item.placeName,
                          code: item.placeCode,
                          count: 0,
                          country: elementCountry.countryName,
                          countryCode: elementCountry.countryCode,
                          id: item.placeId,
                          internal: elementCountry.countryCode == 'VN' ? 1 : 0,
                          name: item.placeName,
                          order: 0,
                          shortAirportName: '',
                          type: 'place',
                          urlCode: '',
                        }
                      })]
                    }
                    
                  }
                  
                  item.areaId = element.areaId;
                  item.areaName = elementCountry.countryCode == 'VN' ? 'Việt Nam' : element.areaName;
                  item.countryCode = elementCountry.countryCode;
                  item.countryId = elementCountry.countryId;
                  item.countryName = elementCountry.countryName;
                  item.order = elementCountry.countryCode == 'VN' ? 1 : ( element.areaName == 'Châu Âu' ? 5 : ( element.areaName == 'Châu Úc' ? 6 :  ( element.areaName == 'Châu Đại Dương' ? 7 : ( element.areaName == 'Châu Phi' ? 8 :element.areaId ))));
                  item.places = _places;
                  if(listAllPlaceByArea.length ==0 || item.countryCode == 'VN'){
                    listAllPlaceByArea.push(item);
                  }
                  else if(!this.checkExistsItemInArray(listAllPlaceByArea, item, 'area') ){
                    listAllPlaceByArea.push(item);
                  }
                  else if(this.checkExistsItemInArray(listAllPlaceByArea, item, 'area') ){
                    listAllPlaceByArea.pop();
                    listAllPlaceByArea.push(item);
                  }
                
              });
          }
          //listAllPlaceByArea.map(item => )
          
          console.log(listAllPlaceByArea);
          resolve(listAllPlaceByArea);
        }else{
          resolve([]);
        }
      })
    })
    
  }
  CreateSupportRequest(bookingCode,CEmail,hoten,phone,notetotal) {
    let body =
    {
      bookingCode: bookingCode,
      customerEmail: CEmail,
      customerName: hoten,
      customerPhone: phone,
      requestContent: notetotal,
      requestType: "Khác",
      sourceRequest: "App"
    };
    let urlPath = C.urls.baseUrl.urlMobile + '/app/CRMOldApis/CreateSupportRequest';
    let headers = {
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    };
    this.RequestApi('POST', urlPath, headers, body, 'orderSupport', 'CreateSupportRequest').then((data) => {
    })

  }
  ticketGetBookingCRM(bookingCode): Promise<any>{
    let headers = {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    return new Promise((resolve, reject) => {
      let urlApi = C.urls.baseUrl.urlMobile+'/app/CRMOldApis/GetByBookingCode?token='+bookingCode;
      this.RequestApi('GET', urlApi, headers, {}, 'ticketpage', 'GetByBookingCode').then((data)=>{
  
       if (data) {
        resolve(data);
       }
      });
    })
   
  }

  async createListLastSearchTicketRegion(item,type){
    let listLastSearch = await this.storage.get(('listLastSearchTicketRegion'));
    if (type==0) {
      if(listLastSearch && listLastSearch.length >0){
        if(listLastSearch.length >2){
          if(!this.checkExistsItemInArray(listLastSearch, item, 'listlastsearchRegion')){
            listLastSearch.splice(0,1);
            listLastSearch.push(item);
          }
          
        }else{
          if(!this.checkExistsItemInArray(listLastSearch, item, 'listlastsearchRegion')){
            listLastSearch.push(item);
          }
        }
        this.storage.set('listLastSearchTicketRegion', listLastSearch);
      }else {
        listLastSearch = [];
        listLastSearch.push(item);
        this.storage.set('listLastSearchTicketRegion', listLastSearch);
      }
    }else{
      if(listLastSearch && listLastSearch.length >0){
        if(listLastSearch.length >2){
          if(!this.checkExistsItemInArray(listLastSearch, item, 'listlastsearchHot')){
            listLastSearch.splice(0,1);
            listLastSearch.push(item);
          }
          
        }else{
          if(!this.checkExistsItemInArray(listLastSearch, item, 'listlastsearchHot')){
            listLastSearch.push(item);
          }
        }
        this.storage.set('listLastSearchTicketRegion', listLastSearch);
      }else {
        listLastSearch = [];
        listLastSearch.push(item);
        this.storage.set('listLastSearchTicketRegion', listLastSearch);
      }
    }
  }

  async getListLastSearchTicketRegion() {
    return await this.storage.get(('listLastSearchTicketRegion'));
  }

  SearchKeyword(): Promise<any>{
    return new Promise((resolve, reject) => {
      let url = C.urls.baseUrl.urlTicket + '/api/Category/SearchV3';
      let headers = {
        apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
      };
   
      let body = {};
      if (this.ticketService.searchType == 1) {
        body = {
          keyword: this.ticketService.inputText,
          searchType: this.ticketService.searchType,
          sortBy: 1,
          regionFilters: this.ticketService.regionFilters,
          typeFilters: this.ticketService.typeFilters,
          topicfilters:this.ticketService.topicfilters.length > 0 ? this.ticketService.topicfilters:[],
        }
      }else if (this.ticketService.searchType == 2){
        // var arrregion = [];
        // arrregion.push(this.ticketService.itemShowList.id);
        body = {
          keyword: this.ticketService.inputText,
          searchType: this.ticketService.searchType,
          sortBy: 1,
          // regionFilters: this.ticketService.regionFilters,
          // typeFilters: this.ticketService.typeFilters,
          topicfilters:this.ticketService.topicfilters.length > 0 ? this.ticketService.topicfilters:[],
          regionIds: this.ticketService.regionFilters
        }
      }else if (this.ticketService.searchType == 3){
        // var arrTopic = [];
        // arrTopic.push(this.ticketService.itemTicketTopic.topicId);
        body = {
          keyword: this.ticketService.inputText,
          searchType: this.ticketService.searchType,
          sortBy: 1,
          regionFilters: this.ticketService.regionFilters,
          // typeFilters: this.ticketService.typeFilters,
          // topicfilters:this.ticketService.topicfilters.length > 0 ? this.ticketService.topicfilters:[],
          topicIds: this.ticketService.topicfilters
        }
      }
      debugger
      this.RequestApi('POST', url, headers, body, 'SearchKeyword', 'SearchKeyword').then((data)=>{
        this.ticketService.slideData = [];
        if (data) {
          this.ticketService.slideData = data.data.listSearchData;
     
            this.ticketService.regionModels= data.data.regionModels;
            this.ticketService.topicModels= data.data.topicModels;
            this.ticketService.typeModels= data.data.typeModels;
        
          for (let index = 0; index <  this.ticketService.slideData.length; index++) {
            const element =  this.ticketService.slideData[index];
            this.convertAvgPoint(element);
          }
          resolve(true);
        }
      });
    })
   
  }
  convertAvgPoint(element) {
    if (element.avgPoint && (element.avgPoint.toString().length == 1 || element.avgPoint == 6 || element.avgPoint == 9 || element.avgPoint == 8 || element.avgPoint == 7)) {
      element.avgPoint = element.avgPoint + ".0";
    }
  }

  //Các hình thức thanh toán ben ve vui chơi
  funcpaymentMethodTicket(paymentMethod): string {

    switch (paymentMethod) {
      case "visa":
        paymentMethod = 3
        break;
      case "payoo_store":
        paymentMethod = 5
        break;
      case "payoo_qr":
        paymentMethod = 6
        break;
      case "momo":
        paymentMethod = 4
        break;
       case "bnpl":
        paymentMethod = 12
        break;
    }
    return paymentMethod;
  }

  public CheckPaymentTicket(url): Promise<any>{
    return new Promise((resolve, reject) => {
      this.RequestApi('GET', url, {"Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",'Content-Type' : 'application/json'}, {}, 'globalFunction', 'CheckPaymentTicket').then((data) => {
        resolve(data);
      })
    })
  } 

  ticketPaymentSave(obj){
    let objticket = {
      paymentMethod:obj.paymentMethod,
      bankTransfer: obj.bankTransfer
    }
    let urlApi = C.urls.baseUrl.urlTicket+'/api/Booking/PaymentSave/'+obj.bookingCode;
    this.RequestApi('POST', urlApi, {}, objticket, 'ticketpage', 'PaymentSave').then((data)=>{

     if (data && data.success) {
      console.log(data);
     }
    });
  }

  gotoFlightSearchPage(params){
    let se = this;
    se._flightService.itemFlightCache = {};
        se._flightService.objectFilter = {};
        se._flightService.objectFilterInternational = {};
        se._flightService.objectFilterReturn = {};
        se._flightService.itemFlightCache.departFlight = null;
        se._flightService.itemFlightCache.returnFlight = null;
        se._flightService.itemFlightCache.itemFlight = null;
        se.storage.remove('flightfilterobject');
       
        se.checkLoadLocation().then((dataLocation)=>{
          let placeFrom = dataLocation.filter((itemairport) => {return itemairport.code == params[0]});
          let placeTo = dataLocation.filter((itemairport) => {return itemairport.code == params[1]});
          if(placeFrom && placeFrom.length >0 && placeTo && placeTo.length >0){
            let departCode = placeFrom[0].code,
                returnCode = placeTo[0].code,
                cin = params[2],
                cout = params[3],
                cinthu = se.getDayOfWeek(params[2]).dayname,
                coutthu = se.getDayOfWeek(params[3]).dayname,
                cinthushort = se.getDayOfWeek(params[2]).daynameshort,
                coutthushort = se.getDayOfWeek(params[3]).daynameshort,
                departCity = placeFrom[0].city,
                returnCity = placeTo[0].city,
                departAirport = placeFrom[0].airport,
                returnAirport = placeTo[0].airport,
                adult = 1,
                child = 0,
                infant = 0,
                roundtrip = params[4]*1;


            se._flightService.objSearch = {
              departCode: departCode,
              arrivalCode: returnCode,
              departDate: cin,
              returnDate: cout,
              adult: adult,
              child: child ? child : 0,
              infant: infant ? infant : 0,
              title: departCity +" → " + returnCity,
              dayDisplay: cinthu + ", " +moment(cin).format("DD") +  " thg " +moment(cin).format("M"),
              subtitle : " · " + (adult + child + (infant ? infant : 0) ) + " khách"+ " · " + (roundtrip ? ' Khứ hồi' : ' Một chiều'),
              titleReturn: returnCity +" → " + departCity,
              dayReturnDisplay: coutthu + ", " +moment(cout).format("DD") + " thg " + moment(cout).format("M") ,
              subtitleReturn :  " · " + (adult + child + (infant ? infant : 0)) + " khách"+ " · " + (roundtrip ? ' Khứ hồi' : ' Một chiều'),
              itemSameCity: '',
              itemDepartSameCity: '',
              itemReturnSameCity: '',
              departCity: departCity,
              returnCity: returnCity,
              roundTrip : roundtrip
            }

            se._flightService.itemFlightCache.roundTrip = roundtrip;
            se._flightService.itemFlightCache.checkInDate = cin;
            se._flightService.itemFlightCache.checkOutDate = cout;
            se._flightService.itemFlightCache.checkInDisplayMonth = moment(cin).format("DD") + " tháng " + moment(cin).format("MM") + ", " + moment(cin).format("YYYY");
            se._flightService.itemFlightCache.checkOutDisplayMonth = moment(cout).format("DD") + " tháng " + moment(cout).format("MM") + ", " + moment(cout).format("YYYY");
            se._flightService.itemFlightCache.adult = adult;
            se._flightService.itemFlightCache.child = child;
            se._flightService.itemFlightCache.infant = infant ? infant : 0;
            se._flightService.itemFlightCache.pax = adult + (child ? child :0)+ (infant ? infant : 0);
            se._flightService.itemFlightCache.arrchild = [];
            se._flightService.itemFlightCache.departCity = departCity;
            se._flightService.itemFlightCache.departCode = departCode;
            se._flightService.itemFlightCache.departAirport = departAirport;
            se._flightService.itemFlightCache.returnCity = returnCity;
            se._flightService.itemFlightCache.returnCode = returnCode;
            se._flightService.itemFlightCache.returnAirport = returnAirport;
            se._flightService.itemFlightCache.step = 1;
            
          
            se._flightService.itemFlightCache.departTimeDisplay = cinthu + ", " + moment(cin).format("DD") + " thg " + moment(cin).format("MM");
            se._flightService.itemFlightCache.returnTimeDisplay = coutthu + ", " + moment(cout).format("DD") + " thg " + moment(cout).format("MM");
    
            se._flightService.itemFlightCache.departInfoDisplay = "Chiều đi" + " · " + cinthu + ", " + moment(cin).format("DD") + " thg " + moment(cin).format("MM");
            se._flightService.itemFlightCache.returnInfoDisplay = "Chiều về" + " · " + coutthu + ", " + moment(cout).format("DD") + " thg " + moment(cout).format("MM");

            se._flightService.itemFlightCache.departPaymentTitleDisplay = cinthushort + ", " + moment(cin).format("DD-MM")+ " · " + departCode + " → " +returnCode+ " · ";
            se._flightService.itemFlightCache.returnPaymentTitleDisplay = coutthushort + ", " + moment(cout).format("DD-MM")+ " · "+ returnCode + " → " +departCode+ " · ";

            se._flightService.itemFlightCache.checkInDisplay = se.getDayOfWeek(cin).dayname +", " + moment(cin).format("DD") + " thg " + moment(cin).format("MM");
            se._flightService.itemFlightCache.checkOutDisplay = se.getDayOfWeek(cout).dayname +", " + moment(cout).format("DD") + " thg " + moment(cout).format("MM");

            se._flightService.itemFlightCache.checkInDisplaysort = se.getDayOfWeek(cin).daynameshort +", " + moment(cin).format("DD") + " thg " + moment(cin).format("MM");
            se._flightService.itemFlightCache.checkOutDisplaysort = se.getDayOfWeek(cout).daynameshort +", " + moment(cout).format("DD") + " thg " + moment(cout).format("MM");
            se._flightService.itemFlightCache.objSearch = se._flightService.objSearch;
            
            se.storage.get("itemFlightCache").then((data)=>{
              if(data){
                se.storage.remove("itemFlightCache").then(()=>{
                  se.storage.set("itemFlightCache", JSON.stringify(se._flightService.itemFlightCache));
                })

              }else{
                se.storage.set("itemFlightCache", JSON.stringify(se._flightService.itemFlightCache));
              }
            })
          
            if(se._flightService.listAirport && se._flightService.listAirport.length >0){
              let placeFrom = se._flightService.listAirport.filter((itemairport) => {return itemairport.code == departCode});
              let placeTo = se._flightService.listAirport.filter((itemairport) => {return itemairport.code == returnCode});
              if(placeFrom && placeFrom.length >0 && placeTo && placeTo.length >0){
                
                se._flightService.itemFlightCache.isExtenalDepart = !placeFrom[0].internal;
                se._flightService.itemFlightCache.isExtenalReturn = !placeTo[0].internal;
                se._flightService.itemFlightCache.isInternationalFlight = !placeFrom[0].internal || !placeTo[0].internal;
                if(se._flightService.itemFlightCache.isInternationalFlight){
                  se.navCtrl.navigateForward("/flightsearchresultinternational");
                }else{
                    se._flightService.itemFlightCache.isInternationalFlight = false;
                    se._flightService.itemFlightCache.isExtenalDepart = false;
                    se._flightService.itemFlightCache.isExtenalReturn = false;
                    se.navCtrl.navigateForward("/flightsearchresult");
                }
                
              }else {
                se._flightService.itemFlightCache.isInternationalFlight = false;
                se._flightService.itemFlightCache.isExtenalDepart = false;
                se._flightService.itemFlightCache.isExtenalReturn = false;
                se.navCtrl.navigateForward("/flightsearchresult");
              }
            }else{
              se._flightService.itemFlightCache.isInternationalFlight = false;
              se._flightService.itemFlightCache.isExtenalDepart = false;
              se._flightService.itemFlightCache.isExtenalReturn = false;
              se.navCtrl.navigateForward("/flightsearchresult");
            }
          }
          else{

          }
        })

        
  }
  checkLoadLocation():Promise<any>{
    var se = this;
    return new Promise((resolve, reject)=>{
      se.storage.get("listAirport").then((data)=>{
        if(!data){
          se.loadLocation().then((data)=>{
            resolve(data);
          });
        }else{
          resolve(se._flightService.listAirport = data);
        }
      })
    })
  }

  loadLocation():Promise<any>{
    var se = this;
    return new Promise((resolve, reject)=>{
      let url = C.urls.baseUrl.urlFlight + "gate/apiv1/AllPlace?token=3b760e5dcf038878925b5613c32615ea3ds";
      this.RequestApi('GET', url, {"Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",'Content-Type' : 'application/json'}, {}, 'globalFunction', 'CheckPaymentTicket').then((data) => {
          let result = data;
          if(result && result.data && result.data.length >0){
            se.storage.set("listAirport", result.data);
            se._flightService.listAirport = result.data;
            resolve(result.data);
          }
          else if(result && result.length >0){
            se.storage.set("listAirport", result);
            se._flightService.listAirport = result;
            resolve(result);
          }
          else{
            resolve([]);
          }
      })
    })
  }
}
     


export class PlaceByArea {
  areaName: string;
  countryCode: string;
  countryId: number;
  countryName: string;
  order: number;
  places : Place;
  
}

export class Place {
  airport: string;
  airportName: string;
  city: string;
  code: string;
  count: number;
  country: string;
  countryCode: string;
  id: number;
  internal: number;
  name: string;
  order: number;
  shortAirportName: string;
  type: string;
  urlCode: string;
}
      
      
      export class ActivityService {
        currentArticle = new EventEmitter();
        
        public bank: any;
        public child: any;
        public insurranceBookingId:any;
        objClaimed: any;
        tab3Loaded: any;
        listExperienceSearch: any[];
        listTopDeal:any = [];
        HotelSearchReqContract: any;
        firstloadhotelist: any;
        objFlightComboUpgrade: any;
        objBankInStallment: any;
        installmentPaymentSuccess: boolean=false;
        installmentPaymentErrorCode: string;
        objPaymentMytrip: any;
        objFlightComboPaymentBreakDown: any;
        objCarComboPaymentBreakDown: any;
        installmentPriceStr: string;
        objCathayMytrip: any;
        itemPax: any;
        objRequestAddLuggage: any;
        qrcodepaymentfrom: number;
        bankName: string;
        bankTransfer: string;
        bankAccount: string;
        totalPriceTransfer: any;
        bookingCode: any;
        typeChangeFlight: number;
        ischeckPage:any
        //abortSearch: boolean;
      }