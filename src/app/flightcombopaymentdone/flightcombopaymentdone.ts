import { LaunchReview } from '@awesome-cordova-plugins/launch-review/ngx';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, Platform } from '@ionic/angular';
import { Booking, ValueGlobal, RoomInfo, Bookcombo, SearchHotel } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';

import jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Facebook } from '@awesome-cordova-plugins/facebook/ngx';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
import { voucherService } from '../providers/voucherService';
//import { Appsflyer } from '@ionic-native/appsflyer/ngx';
/**
 * Generated class for the FacilitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-flightcombopaymentdone',
  templateUrl: 'flightcombopaymentdone.html',
  styleUrls: ['flightcombopaymentdone.scss'],
})
export class FlightComboPaymentDonePage implements OnInit {
  code; status; priceshow=""; number; checkreview = 1;text="";
  objectFlight;room;nameroom
  constructor(public _platform: Platform, public valueGlobal: ValueGlobal, public navCtrl: NavController, private Roomif: RoomInfo, public zone: NgZone,
    public booking: Booking, public storage: Storage, public alertCtrl: AlertController, public value: ValueGlobal, public modalCtrl: ModalController, public gf: GlobalFunction,
    public bookCombo: Bookcombo, private activatedRoute: ActivatedRoute, private launchReview: LaunchReview,
    public searchhotel: SearchHotel,private fb: Facebook, private _calendar: Calendar,
    public _voucherService: voucherService
    ) {
    this.objectFlight = this.gf.getParams('flightcombo');
    this.priceshow = this.bookCombo.totalprice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    let infant = 0;
    this.room = Roomif.arrroom;
    this.nameroom = this.room[0].ClassName;
    this.booking.ChildAge.forEach(element => {
      if (element == "<1" || Number(element) < 2) {
        infant += 1;
      }
    });
    if(this._voucherService.selectVoucher){
      this._voucherService.rollbackSelectedVoucher.emit(this._voucherService.selectVoucher);
      this._voucherService.selectVoucher = null;
    }
    this._voucherService.publicClearVoucherAfterPaymentDone(1);
    this.bookCombo.promoCode="";
    this.bookCombo.discountpromo=0;
    
    //this.gf.googleAnalytion('flightcombopayment','ecommerce_purchase',this.bookCombo.titleComboShort+'|'+this.bookCombo.HotelCode+'|'+this.booking.CheckInDate+'|'+this.booking.CheckOutDate+'|'+this.booking.Adults+'|'+this.booking.Child+'|'+this.priceshow);
    //this.gf.googleAnalytionCustom('ecommerce_purchase', { item_category: 'flightcombo', item_name: this.bookCombo.ComboTitle, item_id: this.bookCombo.HotelCode, start_date: this.booking.CheckInDate, end_date: this.booking.CheckOutDate, number_of_rooms: (this.booking.roomNb ? this.booking.roomNb : 1), value: this.gf.convertNumberToDouble(this.priceshow), currency: "VND" });
    //this._appsflyer.trackEvent('af_ecommerce_purchase', {'af_content_id': this.bookCombo.HotelCode, 'af_content_name': this.bookCombo.ComboTitle, 'af_currency': 'VND', 'af_revenue': this.priceshow.toString() });
    this.GetUserInfo();

    let se = this;
    se.gf.logEventFirebase(se.searchhotel.paymentType,se.searchhotel, 'flightcombopaymentdone', 'purchase', 'Combo');
    se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_PURCHASED, {'fb_content_type': 'hotel'  ,'fb_content_id': bookCombo.HotelCode ? bookCombo.HotelCode :se.booking.code,'fb_num_items': se.searchhotel.roomnumber, 'fb_value': se.gf.convertNumberToDouble(se.priceshow) ,  'fb_currency': 'VND' ,
            'checkin_date': se.booking.CheckInDate ,'checkout_date ': se.booking.CheckOutDate,'num_adults': se.searchhotel.adult,'num_children': (se.searchhotel.child ? se.searchhotel.child : 0), }, se.gf.convertStringToNumber(se.priceshow) );
                    
  }

  ngOnInit() {
    var se=this;
    this.status = this.activatedRoute.snapshot.paramMap.get('stt');
    this.code=se.bookCombo.bookingcode;
    if (this.status == 'AL') {
      let headers = {
        "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          'Content-Type': 'application/json; charset=utf-8',
      };
      let strUrl = C.urls.baseUrl.urlFlight + 'gate/apiv1/GetPeriodPayment/' + this.bookCombo.FlightCode;
      this.gf.RequestApi('GET', strUrl, headers, {}, 'flightComboPaymentDone', 'GetPeriodPayment').then((data)=>{

        var json = data;
        var PaymentPeriod = json.periodPaymentDate;
        var ti = new Date();
        var DateNow = moment(ti).format('YYYYMMDD');
        var ho = ti.getHours();
        var addhours = moment(ti).add(1, 'hours').format('HH:mm');
        se.text = addhours + ' cùng ngày';
        if(se.bookCombo.isHBEDBooking){
          if(PaymentPeriod){
            let _paymentPeriodcovert = moment(PaymentPeriod).format('YYYYMMDDHHmm');
            let _dateNow = moment(ti).add(30, 'minutes').format('YYYYMMDDHHmm');
            if (parseInt(_paymentPeriodcovert) >= parseInt(_dateNow)) {
              addhours = moment(ti).add(30, 'minutes').format('HH:mm');
              se.text = addhours + ' cùng ngày';
            }else{
              let textthu= se.getDay(PaymentPeriod);
              let day=moment(PaymentPeriod).format('DD')+ ' '+ 'thg' + ' ' +  moment(PaymentPeriod).format('MM') +', ' +moment(PaymentPeriod).format('YYYY') 
              se.text = moment(PaymentPeriod).format('HH:mm') + ' ' + textthu + ', ' + day;
            }
          }else{
            addhours = moment(ti).add(30, 'minutes').format('HH:mm');
            se.text = addhours + ' cùng ngày';
          }
          
        }else if(se.bookCombo.isAGODABooking){
          if(PaymentPeriod){
            let _paymentPeriodcovert = moment(PaymentPeriod).format('YYYYMMDDHHmm');
            let _dateNow = moment(ti).add(1, 'hours').format('YYYYMMDDHHmm');
            if (parseInt(_paymentPeriodcovert) >= parseInt(_dateNow)) {
              addhours = moment(ti).add(1, 'hours').format('HH:mm');
              se.text = addhours + ' cùng ngày';
            }else{
              let textthu= se.getDay(PaymentPeriod);
              let day=moment(PaymentPeriod).format('DD')+ ' '+ 'thg' + ' ' +  moment(PaymentPeriod).format('MM') +', ' +moment(PaymentPeriod).format('YYYY') 
              se.text = moment(PaymentPeriod).format('HH:mm') + ' ' + textthu + ', ' + day;
            }
          }
          else{
            addhours = moment(ti).add(1, 'hours').format('HH:mm');
            se.text = addhours + ' cùng ngày';
          }
          
        }
        else {
          if (PaymentPeriod) {
            var PaymentPeriodcovert = moment(PaymentPeriod).format('YYYYMMDDHHmm');
            var thu = moment(PaymentPeriod).format('dddd');
            if (ho > 0 && ho < 6) {
              DateNow = DateNow + '1100';
              if (parseInt(PaymentPeriodcovert) >= parseInt(DateNow)) {
                se.text = '11 am cùng ngày';
              }
              else {
                var textthu= se.getDay(thu);
                var day=moment(PaymentPeriod).format('DD')+ ' '+ 'thg' + ' ' +  moment(PaymentPeriod).format('MM') +', ' +moment(PaymentPeriod).format('YYYY') 
                se.text = moment(PaymentPeriod).format('HH:mm') + ' ' + textthu + ', ' + day;
              }
            }
            else if (ho >= 6 && ho < 12) {
              DateNow = DateNow + '1700';
              if (parseInt(PaymentPeriodcovert) >= parseInt(DateNow)) {
                se.text = '17h cùng ngày';
               
              }
              else {
                var textthu= se.getDay(thu);
                var day=moment(PaymentPeriod).format('DD')+ ' '+ 'thg' + ' ' +  moment(PaymentPeriod).format('MM') +', ' +moment(PaymentPeriod).format('YYYY') 
                se.text = moment(PaymentPeriod).format('HH:mm') + ' ' + textthu + ', ' + day;
              }
            }
            else if (ho >= 12 && ho < 20) {
              DateNow = DateNow + '2030';
              if (parseInt(PaymentPeriodcovert) >= parseInt(DateNow)) {
                se.text = '20h30 cùng ngày'
              }
              else {
                var textthu= se.getDay(thu);
                var day=moment(PaymentPeriod).format('DD')+ ' '+ 'thg' + ' ' +  moment(PaymentPeriod).format('MM') +', ' +moment(PaymentPeriod).format('YYYY') 
                se.text = moment(PaymentPeriod).format('HH:mm') + ' ' + textthu + ', ' + day;
              }
            }
            else {
              var res = ti.setTime(ti.getTime() + (24 * 60 * 60 * 1000));
              var date = new Date(res);
              var checkDate = moment(date).format('YYYYMMDD') + '1100';
              if (parseInt(PaymentPeriodcovert) >= parseInt(checkDate)) {
                se.text = '11 am hôm sau';
              } else {
                var textthu= se.getDay(thu);
                var day=moment(PaymentPeriod).format('DD')+ ' '+ 'thg' + ' ' +  moment(PaymentPeriod).format('MM') +', ' +moment(PaymentPeriod).format('YYYY') 
                se.text = moment(PaymentPeriod).format('HH:mm') + ' ' + textthu + ', ' + day;
              }
            }
          }
          else {
            if (ho > 0 && ho < 6) {
              se.text = '11 am cùng ngày';
            }
            else if (ho >= 6 && ho < 12) {
              se.text = '17h cùng ngày'
            }
            else if (ho >= 12 && ho < 20) {
              se.text = '20h30 cùng ngày'
            }
            else {
              se.text = '11 am hôm sau';
            }
          }
        }
      });
    }
  }
  getDay(thu)
  {
    switch (thu) {
      case "Monday":
        thu = "Thứ 2"
        break;
      case "Tuesday":
        thu = "Thứ 3"
        break;
      case "Wednesday":
        thu = "Thứ 4"
        break;
      case "Thursday":
        thu = "Thứ 5"
        break;
      case "Friday":
        thu = "Thứ 6"
        break;
      case "Saturday":
        thu = "Thứ 7"
        break;
      default:
        thu = "Chủ nhật"
        break;
    }
    return thu;
  }
  next() {
    if (this.checkreview == 0) {
      this.showConfirm();
    }
    this.bookCombo.isAGODABooking = false;
    this.bookCombo.isHBEDBooking = false;
    this.bookCombo.roomPenalty = false;
    this.gf.setParams(null, 'flightcombo');
    this.navCtrl.navigateBack('/');
  }

  refreshToken() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'GET',
        //   url: C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims',
        //   headers:
        //   {
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json',
        //     authorization: text
        //   },
        // }
        let headers = {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims';
        this.gf.RequestApi('GET', strUrl, headers, {}, 'flightComboPaymentDone', 'reloadTokenClaims').then((data)=>{

            var au = data;
            se.zone.run(() => {
              se.storage.remove('auth_token');
              se.storage.set('auth_token', au.auth_token);
              var decoded = jwt_decode<any>(au.auth_token);
              se.storage.remove('point');
              se.storage.set('point', decoded.point);

            })
          
        })
      }
    })
  }
  public async showConfirm() {
    this.storage.set("checkreview", 1);
    let alert = await this.alertCtrl.create({
      header: 'Bạn thích iVIVU.com?',
      message: 'Đánh giá ứng dụng trên CH Play',
      cssClass: 'cls-reivewapp',
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
  GetUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'GET',
        //   url: C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo',
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json',
        //     authorization: text
        //   }
        // };
        let headers = {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo';
        this.gf.RequestApi('GET', strUrl, headers, {}, 'flightComboPaymentDone', 'GetUserInfo').then((data)=>{

            if (data) {
              var info;
              var checkfullname = se.validateEmail(data.fullname);

              if (!checkfullname) {
                var textfullname = data.fullname.split(' ')
                //info = { ho: textfullname[0], ten: textfullname[1], phone: data.phone }
                if (textfullname.length > 2) {
                  let name = '';
                  for (let i = 1; i < textfullname.length; i++) {
                    if (i == 1) {
                      name += textfullname[i];
                    } else {
                      name += ' ' + textfullname[i];
                    }
                  }
                  info = { ho: textfullname[0], ten: name, phone: data.phone }
                } else {
                  info = { ho: textfullname[0], ten: textfullname[1], phone: data.phone }
                }
                se.storage.set("infocus", info);
              } else {
                info = { ho: "", ten: "", phone: data.phone }
                se.storage.set("infocus", info);
              }
              se.storage.set("email", data.email);
              se.storage.set("jti", data.memberId);
              //se.storage.set("auth_token", body.auth_token);
              se.storage.set("username", data.fullname);
              se.storage.set("phone", data.phone);
              se.storage.set("point", data.point);
            }

          
        });
      }
    })
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  addToCalendar() {
    let se = this;
    if (se._platform.is("cordova")) {
      let itemflight = this.objectFlight.FlightBooking;
      se.createCalendar(itemflight, true, true)
    }

  }

  createCalendar(itemflight, isdepart, createOrModify) {
    let se = this;
    let calOptions = se._calendar.getCalendarOptions();

    let strmess = `Mã đặt combo: ` + se.code + `

Tên khách sạn: ` + this.booking.HotelName + 
    `

Tên phòng: ` + this.nameroom + 
        `

Giờ ra tàu bay: `+ (isdepart ? (moment(itemflight.departFlight.DepartTime).format("HH") + "h" + moment(itemflight.departFlight.DepartTime).format("mm")) : (moment(itemflight.returnFlight.DepartTime).format("HH") + "h" + moment(itemflight.returnFlight.DepartTime).format("mm"))) +
      `	
      
Hành khách:

`;
    //Người lớn
    itemflight.adults.forEach((elementA, index) => {
      if (index != 0) {
        strmess += `

`;
      }
      strmess += index + 1 + ". " + elementA.genderdisplay + " " + elementA.hoten;
      //chuyến đi
      if (isdepart && elementA.AncillaryJson) {
        let objjson = JSON.parse(elementA.AncillaryJson);
        if (objjson && objjson.length > 0) {
          strmess += " | ";
          objjson.forEach((elementAncillary, indexanci) => {
            strmess += (elementAncillary.Type == "Baggage" ? "Hành lý" : "Chỗ ngồi") + ": " + (elementAncillary.Type == "Baggage" ? elementAncillary.Value + 'kg' : elementAncillary.Value) + (indexanci != objjson.length - 1 ? " | " : '');
          });
        }
      }
      //chuyến về
      if (!isdepart && elementA.AncillaryReturnJson) {
        let objjson = JSON.parse(elementA.AncillaryReturnJson);
        if (objjson && objjson.length > 0) {
          strmess += " | ";
          objjson.forEach((elementAncillary, indexanci) => {
            strmess += (elementAncillary.Type == "Baggage" ? "Hành lý" : "Chỗ ngồi") + ": " + (elementAncillary.Type == "Baggage" ? elementAncillary.Value + 'kg' : elementAncillary.Value) + (indexanci != objjson.length - 1 ? " | " : '');
          });
        }
      }
    });
    //trẻ em
    itemflight.childs.forEach((elementC, index) => {
      strmess += `

`;
      strmess += (index + 1 + itemflight.adults.length) + ". " + elementC.genderdisplay + " " + elementC.hoten;
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
    strmess += `

`;

    if (itemflight.childs && itemflight.childs.length > 0) {
      strmess += "Quý khách nhớ mang theo giấy tờ tuỳ thân và giấy khai sinh của " + itemflight.childs.map((c) => { return c.hoten }).join(', ') + ".";
    } else {
      strmess += "Quý khách nhớ mang theo giấy tờ tuỳ thân."
    }

    calOptions.firstReminderMinutes = 120;
    calOptions.calendarName = "Chuyến đi " + (isdepart ? se.bookCombo.ComboDetail.departureName : se.bookCombo.objComboDetail.arrivalName) + "  -  " + (isdepart ? se.bookCombo.objComboDetail.arrivalName : se.bookCombo.ComboDetail.departureName) + ", " + (isdepart ? moment(itemflight.departFlight.DepartTime).format('DD/MM/YYYY') : moment(itemflight.returnFlight.DepartTime).format('DD/MM/YYYY'));
    calOptions.calendarId = 1;
    let event = {
      // title: (isdepart ? se.bookCombo.ComboDetail.departureName : se.bookCombo.objComboDetail.arrivalName) + "  ✈  " + (isdepart ? se.bookCombo.objComboDetail.arrivalName : se.bookCombo.ComboDetail.departureName) + " (" + (isdepart ? itemflight.departFlight.FlightNumber : itemflight.returnFlight.FlightNumber) + ")",
       title: se.code+"-"+se.booking.HotelName + " (" + (isdepart ? itemflight.departFlight.FlightNumber : itemflight.returnFlight.FlightNumber) + ")",
      location: (isdepart ? itemflight.departAirport : itemflight.returnAirport),
      message: strmess,
      startDate: (isdepart ? itemflight.departFlight.DepartTime : itemflight.returnFlight.DepartTime),
      endDate: (isdepart ? itemflight.departFlight.LandingTime : itemflight.returnFlight.LandingTime),
      calOptions
    };

    se._calendar.hasReadWritePermission().then((allow) => {
      let sdate = new Date(event.startDate),
        edate = new Date(event.endDate);
      if (allow) {
        if (createOrModify) {//true - tạo mới
          se.gf.showLoadingwithtimeout();
          se._calendar.createEventWithOptions(event.title, event.location, event.message, sdate, edate, event.calOptions).then(() => {
           
            if (!isdepart) {
              se._calendar.openCalendar(new Date(itemflight.departFlight.DepartTime)).then(() => {
                se.navCtrl.navigateBack(['/app/tabs/tab3/']);
              });
            }
            else{
              let itemflight = this.objectFlight.FlightBooking;
              se.createCalendar(itemflight, false, true)
            } 
             
          });
        } 
      } else {
        se._calendar.requestReadWritePermission().then(() => {

          if (createOrModify) {//true - tạo mới
            se.gf.showLoadingwithtimeout();
            se._calendar.createEventWithOptions(event.title, event.location, event.message, sdate, edate, event.calOptions).then(() => {
         
                se._calendar.openCalendar(new Date(itemflight.departFlight.DepartTime)).then(() => {

                });
              
            });
          }
        })
      }

    })
  }
}
