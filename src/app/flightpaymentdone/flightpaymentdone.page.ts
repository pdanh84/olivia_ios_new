import { SearchHotel, ValueGlobal } from './../providers/book-service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import * as moment from 'moment';
import { NavController, ModalController, Platform,AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { flightService } from '../providers/flightService';
import { GlobalFunction } from '../providers/globalfunction';
import { FlightquickbackPage } from '../flightquickback/flightquickback.page';
import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';
//import { Appsflyer } from '@ionic-native/appsflyer/ngx';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
import { LaunchReview } from '@awesome-cordova-plugins/launch-review/ngx';
import { voucherService } from '../providers/voucherService';
@Component({
  selector: 'app-flightpaymentdone',
  templateUrl: './flightpaymentdone.page.html',
  styleUrls: ['./flightpaymentdone.page.scss'],
})
export class FlightpaymentdonePage implements OnInit {
  code:any = ""; startdate; enddate; _email = ""; stt; total; text; isDinner
  bookingCode: any;
  bookingFlight: any;
  pacificVNA: string = "";
  pacificVNAReturn: string = "";
  listDiChung: any = "";
  checkInDisplayDC: string;
  checkOutDisplayDC: string;
  checkreview;
  contactOption: any;
  constructor(private activatedRoute: ActivatedRoute, public _flightService: flightService,
    private navCtrl: NavController, public searchhotel: SearchHotel, public storage: Storage, private zone: NgZone,
    public valueGlobal: ValueGlobal,
    public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private fb: Facebook,
    private _calendar: Calendar,
    private _platform: Platform, public alertCtrl: AlertController, private launchReview: LaunchReview,
    public _voucherService: voucherService) {
      this.storage.get('checkreview').then(checkreview => {
        if (checkreview == 0) {
          this.checkreview = 0;
        } else {
          this.checkreview = checkreview;
        }
      })
    this.total = this._flightService.itemFlightCache.totalPrice;
    this._email = this._flightService.itemFlightCache.email;
    if(this._flightService.itemFlightCache.pnr){
      this.bookingCode = this._flightService.itemFlightCache.pnr.bookingCode ? this._flightService.itemFlightCache.pnr.bookingCode: this._flightService.itemFlightCache.pnr.resNo;
    }
    
    this.bookingFlight = this._flightService.itemFlightCache;
    if(this._voucherService.selectVoucher){
      this._voucherService.rollbackSelectedVoucher.emit(this._voucherService.selectVoucher);
      this._voucherService.selectVoucher = null;
    }
    this._voucherService.publicClearVoucherAfterPaymentDone(1);
      this._flightService.itemFlightCache.promotionCode = "";
      this._flightService.itemFlightCache.promocode = "";
      this._flightService.itemFlightCache.discount = 0;

      this.storage.get('contactOption').then((option)=>{
        this.contactOption = option;
      })
  }


  ngOnInit() {

  }

  ionViewWillEnter() {
    this.code = this.activatedRoute.snapshot.paramMap.get('code');
    this.startdate = moment(this.activatedRoute.snapshot.paramMap.get('startdate')).format('DD/MM');
    this.enddate = moment(this.activatedRoute.snapshot.paramMap.get('enddate')).format('DD/MM');
    this.stt = this._flightService.itemFlightCache.ischeckpayment;
    //let date = this._flightService.itemFlightCache.periodPaymentDate;
    this.gf.getSummaryBooking(this._flightService.itemFlightCache).then((dataSummary)=>{
      let date = dataSummary.periodPaymentDate;
      if(date){
        this.text= moment(date).format("HH:mm") + " " + this.gf.getDayOfWeek(date).dayname +", "+ moment(date).format("DD") + " thg " + moment(date).format("MM");
      }
    })
    
    if (this._flightService.itemFlightCache.departFlight && this._flightService.itemFlightCache.departFlight.operatedBy) {
      this.pacificVNA = this._flightService.itemFlightCache.departFlight.operatedBy;
    }

    if (this._flightService.itemFlightCache.returnFlight && this._flightService.itemFlightCache.returnFlight.operatedBy) {
      this.pacificVNAReturn = this._flightService.itemFlightCache.returnFlight.operatedBy;
    }


    // if (date) {
    //   this.text = moment(date).format("HH:mm") + " " + this.gf.getDayOfWeek(date).dayname + ", " + moment(date).format("DD") + " thg " + moment(date).format("MM");
    // }
    var se = this;
    //se.gf.googleAnalytionCustom('ecommerce_purchase', { item_category: 'flight', start_date: moment(se._flightService.itemFlightCache.checkInDate).format("YYYY-MM-DD"), end_date:moment(se._flightService.itemFlightCache.checkOutDate).format("YYYY-MM-DD") , item_name: se._flightService.itemFlightCache.departCity+'-'+se._flightService.itemFlightCache.returnCity, item_id: se._flightService.itemFlightCache.departCode, value: se.gf.convertNumberToDouble(se._flightService.itemFlightCache.totalPrice), currency: "VND",origin: se._flightService.itemFlightCache.departCode, destination: se._flightService.itemFlightCache.returnCode, flight_number: se._flightService.itemFlightCache.itemFlightInternationalDepart.flightNumber });
    let tt = se._flightService.itemFlightCache.departCode + "_" + se._flightService.itemFlightCache.returnCode + "_" + se._flightService.itemFlightCache.checkInDate + "_" + se._flightService.itemFlightCache.checkOutDate
    //se._appsflyer.trackEvent('af_ecommerce_purchase', {'af_content_id': se._flightService.itemFlightCache.pnr.resNo, 'af_content_name': tt, 'af_currency': 'VND', 'af_revenue': se._flightService.itemFlightCache.totalPrice.toString() });
    se.gf.logEventFirebase(se._flightService.itemFlightCache.paymentType, se._flightService.itemFlightCache, 'flightpaymentselect', 'purchase', 'Flights');

    se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_PURCHASED, {
      'fb_content_type': 'flight', 'fb_content_id': tt, 'fb_num_items': 1, 'fb_value': (se._flightService.itemFlightCache.totalPrice ? se.gf.convertNumberToDouble(se._flightService.itemFlightCache.totalPrice) : 0), 'fb_currency': 'VND',
      'origin_airport': se._flightService.itemFlightCache.departFlight.fromPlaceCode,
      'destination_airport': se._flightService.itemFlightCache.departFlight.toPlaceCode,
      'departing_departure_date': se._flightService.itemFlightCache.checkInDate, 'returning_departure_date ': se._flightService.itemFlightCache.checkOutDate, 'num_adults': se._flightService.itemFlightCache.adult, 'num_children': se._flightService.itemFlightCache.child ? se._flightService.itemFlightCache.child : 0, 'num_infants': se._flightService.itemFlightCache.infant ? se._flightService.itemFlightCache.infant : 0
    },
      (se._flightService.itemFlightCache.totalPrice ? se.gf.convertStringToNumber(se._flightService.itemFlightCache.totalPrice) : 0));

  }

  addToCalendar() {
    let se = this;
    if (se._platform.is("cordova")) {
      let itemflight = se._flightService.itemFlightCache;

      se.createCalendar(itemflight, true, true);
      if (itemflight.roundTrip) {
        setTimeout(() => {
          se.createCalendar(itemflight, false, true);
        }, 1000)

      }
    }

  }

  createCalendar(itemflight, isdepart, createOrModify) {
    let se = this;
    let calOptions = se._calendar.getCalendarOptions();

    let strmess = `Mã đặt chỗ: ` + (isdepart ? (itemflight.dataSummaryBooking && itemflight.dataSummaryBooking.departFlight ? itemflight.dataSummaryBooking.departFlight.atBookingCode : '') : (itemflight.dataSummaryBooking && itemflight.dataSummaryBooking.returnFlight ? itemflight.dataSummaryBooking.returnFlight.atBookingCode : '')) + `
      
Giờ ra tàu bay: `+ (isdepart ? (moment(itemflight.departFlight.departTime).format("HH") + "h" + moment(itemflight.departFlight.departTime).format("mm")) : (moment(itemflight.returnFlight.departTime).format("HH") + "h" + moment(itemflight.returnFlight.departTime).format("mm"))) +
      `	
      
Hành khách:

`;
    //Người lớn
    itemflight.adults.forEach((elementA, index) => {
      if (index != 0) {
        strmess += `

`;
      }
      strmess += index + 1 + ". " + elementA.genderdisplay + " " + elementA.name;
      //chuyến đi
      if (isdepart && elementA.ancillaryJson) {
        let objjson = JSON.parse(elementA.ancillaryJson);
        if (objjson && objjson.length > 0) {
          
          objjson.forEach((elementAncillary, indexanci) => {
            if (elementAncillary.Type != "Transfer") {
              strmess += " | ";
              strmess += (elementAncillary.Type == "Baggage" ? "Hành lý" : "Chỗ ngồi") + ": " + (elementAncillary.Type == "Baggage" ? elementAncillary.Value + 'kg' : elementAncillary.Value) + (indexanci != objjson.length - 1 ? " | " : '');
            }
            
          });
        }
      }
      //chuyến về
      if (!isdepart && elementA.ancillaryReturnJson) {
        let objjson = JSON.parse(elementA.ancillaryReturnJson);
        if (objjson && objjson.length > 0) {
         
          objjson.forEach((elementAncillary, indexanci) => {
            if (elementAncillary.Type != "Transfer") {
              strmess += " | ";
              strmess += (elementAncillary.Type == "Baggage" ? "Hành lý" : "Chỗ ngồi") + ": " + (elementAncillary.Type == "Baggage" ? elementAncillary.Value + 'kg' : elementAncillary.Value) + (indexanci != objjson.length - 1 ? " | " : '');
            }
            
          });
        }
      }
    });
    //trẻ em
    itemflight.childs.forEach((elementC, index) => {
      strmess += `

`;
      strmess += (index + 1 + itemflight.adults.length) + ". " + elementC.genderdisplay + " " + elementC.name;
      if (isdepart && elementC.ancillaryJson) {
        let objjson = JSON.parse(elementC.ancillaryJson);
        if (objjson && objjson.length > 0) {
          strmess += " | ";
          objjson.forEach((elementAncillary, indexanci) => {
            strmess += (elementAncillary.Type == "Baggage" ? "Hành lý" : "Chỗ ngồi") + ": " + (elementAncillary.Type == "Baggage" ? elementAncillary.Value + 'kg' : elementAncillary.Value) + (indexanci != objjson.length - 1 ? " | " : '');
          });
        }
      }

      //chuyến về
      if (!isdepart && elementC.ancillaryReturnJson) {
        let objjson = JSON.parse(elementC.ancillaryReturnJson);
        if (objjson && objjson.length > 0) {
          strmess += " | ";
          objjson.forEach((elementAncillary, indexanci) => {
            strmess += (elementAncillary.Type == "Baggage" ? "Hành lý" : "Chỗ ngồi") + ": " + (elementAncillary.Type == "Baggage" ? elementAncillary.Value + 'kg' : elementAncillary.Value) + (indexanci != objjson.length - 1 ? " | " : '');
          });
        }
      }
    });
strmess+=`

`;
//Check nếu có items ks thì add thêm thông tin ks
if(itemflight.objHotelCitySelected){
  strmess += `
Khách sạn:`  + itemflight.objHotelCitySelected.HotelName +`
  
Tên phòng: ` + itemflight.objHotelCitySelected.RoomName + `
    
Khách hàng: ` + itemflight.hoten;
      
strmess += `
        
`;
  }
if (this._flightService.itemFlightCache.DICHUNGParam) {
  se.listDiChung=this._flightService.itemFlightCache.DICHUNGParam;
  this.checkInDisplayDC = this.bookingFlight.checkInDisplaysort
        if(this.bookingFlight && this.bookingFlight.returnFlight){
          this.checkOutDisplayDC = this.bookingFlight.checkOutDisplaysort
        }
  if (se._flightService.itemFlightCache.departCity && se.listDiChung.PhaseGo) {
    strmess += `Xe đưa đón tại ` +se._flightService.itemFlightCache.departCity +`
`+se.checkInDisplayDC+`     `+ se.listDiChung.PhaseGo.pickUpTime.text +`     Chiều đi`
  

}

if (se._flightService.itemFlightCache.departCity && se.listDiChung.PhaseGo_RoundTrip) {
  strmess+=`

`;
  strmess += `Xe đưa đón tại ` +se._flightService.itemFlightCache.departCity +`
`+se.checkOutDisplayDC+`     `+ se.listDiChung.PhaseGo_RoundTrip.pickUpTime.text +`     Chiều về`


}

if (se._flightService.itemFlightCache.returnCity && se.listDiChung.PhaseReturn) {
  strmess+=`

`;
  strmess += `Xe đưa đón tại ` +se._flightService.itemFlightCache.returnCity +`
`+se.checkInDisplayDC+`     `+ se.listDiChung.PhaseReturn.pickUpTime.text +`     Chiều đi`


}
if (se._flightService.itemFlightCache.returnCity && se.listDiChung.PhaseReturn_RoundTrip) {
  strmess+=`

`;
  strmess += `Xe đưa đón tại ` +se._flightService.itemFlightCache.returnCity +`
`+se.checkOutDisplayDC+`     `+ se.listDiChung.PhaseReturn_RoundTrip.pickUpTime.text +`     Chiều về`


}
  }
    calOptions.firstReminderMinutes = 120;
    calOptions.calendarName = "Chuyến đi " + (isdepart ? itemflight.departCity : itemflight.returnCity) + "  -  " + (isdepart ? itemflight.returnCity : itemflight.departCity) + ", " + (isdepart ? moment(itemflight.departFlight.departTime).format('DD/MM/YYYY') : moment(itemflight.returnFlight.departTime).format('DD/MM/YYYY'));
    calOptions.calendarId = 1;
    let event = {
      title: (isdepart ? itemflight.departCity : itemflight.returnCity) + "  ✈  " + (isdepart ? itemflight.returnCity : itemflight.departCity) + " (" + (isdepart ? itemflight.departFlight.flightNumber : itemflight.returnFlight.flightNumber) + ")",
      location: (isdepart ? itemflight.departAirport : itemflight.returnAirport),
      message: strmess,
      startDate: (isdepart ? itemflight.departFlight.departTime : itemflight.returnFlight.departTime),
      endDate: (isdepart ? itemflight.departFlight.landingTime : itemflight.returnFlight.landingTime),
      calOptions
    };

    se._calendar.hasReadWritePermission().then((allow) => {
      let sdate = new Date(event.startDate),
        edate = new Date(event.endDate);
      if (allow) {
        if (createOrModify) {//true - tạo mới
          se.gf.showLoadingwithtimeout();
          if(!se.checkExistCalendar(event.calOptions.calendarName)){
              se._calendar.createEventWithOptions(event.title, event.location, event.message, sdate, edate, event.calOptions).then(() => {
                if ((itemflight.roundTrip && !isdepart) || !itemflight.roundTrip) {
                  se.zone.run(() => {
                    se.gf.hideLoading();
                    se.clearItemCache();

                    se._flightService.itemMenuFlightClick.emit(2);
                    se.next();
                  })

                  se._calendar.openCalendar(new Date(itemflight.departFlight.departTime)).then(() => {
                  });

                }

              });
            }
        } else {
          se.clearItemCache();
          se._flightService.itemMenuFlightClick.emit(2);
          se.next();
        }
      } else {
        se._calendar.requestReadWritePermission().then(() => {

          if (createOrModify) {//true - tạo mới
            se.gf.showLoadingwithtimeout();
            if(!se.checkExistCalendar(event.calOptions.calendarName)){
              se._calendar.createEventWithOptions(event.title, event.location, event.message, sdate, edate, event.calOptions).then(() => {
                if ((itemflight.roundTrip && !isdepart) || !itemflight.roundTrip) {
                  se.zone.run(() => {
                    se.gf.hideLoading();
                    se.clearItemCache();

                    se._flightService.itemMenuFlightClick.emit(2);
                    se.next();
                  })

                  se._calendar.openCalendar(new Date(itemflight.departFlight.departTime)).then(() => {

                  });
                }
              });
            }
          } else {
            se.clearItemCache();
            se._flightService.itemMenuFlightClick.emit(2);
            se.next();
          }
        })
      }

    })
  }

  // checkExistCalendarName(itemflight, isdepart) {
  //   let se = this;
  //   let calendarname = "Chuyến đi " + (isdepart ? itemflight.departCity : itemflight.returnCity) + "  -  " + (isdepart ? itemflight.returnCity : itemflight.departCity) + ", " + (isdepart ? moment(itemflight.departFlight.departTime).format('DD/MM/YYYY') : moment(itemflight.returnFlight.departTime).format('DD/MM/YYYY'));
  //   se.storage.get('objectflightpaymentbank').then((data) => {
  //     if (data) {
  //       let arrobject = JSON.parse(data);
  //       if (arrobject && arrobject.length > 0) {
  //         let objexists = arrobject.filter((item) => {
  //           return item.resNo == itemflight.pnr.resNo;
  //         })

  //         if (objexists && objexists.length > 0) {
  //           //sửa event
  //           se.createCalendar(itemflight, isdepart, false)
  //         } else {
  //           se.createCalendar(itemflight, isdepart, true);
  //         }
  //       }
  //     } else {
  //       se.createCalendar(itemflight, isdepart, true);
  //     }
  //   })
  // }

  next() {
    try {
      this.storage.get('objectflightpaymentbank').then((data) => {
        if (data) {
          let arrobject = JSON.parse(data);
          if (arrobject && arrobject.length > 0) {
            arrobject.push({ resNo: this.bookingCode, checkInDate: this._flightService.itemFlightCache.checkInDate, checkOutDate: this._flightService.itemFlightCache.checkOutDate, totalPrice: this.total, itemFlightCache: this._flightService.itemFlightCache });
          } else {
            arrobject = [];
            arrobject.push({ resNo: this.bookingCode, checkInDate: this._flightService.itemFlightCache.checkInDate, checkOutDate: this._flightService.itemFlightCache.checkOutDate, totalPrice: this.total, itemFlightCache: this._flightService.itemFlightCache });
          }

          this.storage.remove('objectflightpaymentbank').then(() => {
            this.storage.set('objectflightpaymentbank', JSON.stringify(arrobject));
          })
        } else {
          let arr:any = [];
          arr.push({ resNo: this.bookingCode, checkInDate: this._flightService.itemFlightCache.checkInDate, checkOutDate: this._flightService.itemFlightCache.checkOutDate, totalPrice: this.total, itemFlightCache: this._flightService.itemFlightCache });
          this.storage.set('objectflightpaymentbank', JSON.stringify(arr));
        }

      })
    } catch (error) {
      console.log('fail to set storage object')
    }
    this.gf.hideLoading();
    this._flightService.itemTabFlightActive.emit(true);
    this.valueGlobal.backValue = "homeflight";
    //this._flightService.itemMenuFlightClick.emit(2);
    this._flightService.bookingCodePayment = this.bookingCode;
    this._flightService.bookingSuccess = true;
    if (this.checkreview == 0) {
      this.showConfirm();
    }
    this.navCtrl.navigateBack('/tabs/tab1');
  }
  public async showConfirm() {
    this.storage.set("checkreview", 1);
    let alert = await this.alertCtrl.create({
      header: 'Bạn thích iVIVU.com?',
      message: 'Đánh giá ứng dụng trên CH Play',
      cssClass: 'done1-combo-css',
      mode: "ios",
      buttons: [
        {
          text: 'Hủy',
          handler: () => {
          }
        },
        {
          text: 'Đánh giá',
          role: 'OK',
          handler: () => {
            this.launchReview.launch()
              .then(() => console.log('Successfully launched store app'));
          }
        }
      ]
    });
    alert.present();
    alert.onDidDismiss().then((data) => {
    })
  }
  async showBooking() {
    var se = this;
    se.clearItemCache();
    se._flightService.itemTabFlightActive.emit(true);
    se._flightService.itemMenuFlightClick.emit(2);
    se._flightService.bookingCodePayment = this.bookingCode;
    se._flightService.bookingSuccess = true;
    se.valueGlobal.backValue = "flightmytrip";
    se.navCtrl.navigateBack('/app/tabs/tab1');
    //   const modal: HTMLIonModalElement =
    //   await se.modalCtrl.create({
    //     component: FlightBookingDetailsPage,
    //     componentProps: {
    //       aParameter: true,
    //     },
    //     showBackdrop: true,
    //     backdropDismiss: true,

    //     cssClass: "modal-flight-booking-detail"
    //   });
    // modal.present();
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

  checkExistCalendar(name){
    return false;//tạm ghi đè lịch nếu trùng
  }
}
