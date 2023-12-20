import { LaunchReview } from '@awesome-cordova-plugins/launch-review/ngx';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../providers/auth-service';
import { Component, ViewChild, NgZone, OnInit } from '@angular/core';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { Booking, RoomInfo, Bookcombo,SearchHotel } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import jwt_decode from 'jwt-decode';
import { GlobalFunction } from '../providers/globalfunction';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
import * as moment from 'moment';
@Component({
  selector: 'app-flightcombodoneprepay',
  templateUrl: './flightcombodoneprepay.page.html',
  styleUrls: ['./flightcombodoneprepay.page.scss'],
})
export class FlightcombodoneprepayPage implements OnInit {

  code; priceshow; text; listcars; loccation; checkreview = 1; ischeckshow; total;
  bookingCode = ""; listfly;arradults;arrchilds;roomnumber;breakfast;room;nameroom;Rating;Name;objectFlight;email
  constructor(public _platform: Platform, public navCtrl: NavController, public Roomif: RoomInfo, public activatedRoute: ActivatedRoute,
    public zone: NgZone, public booking: Booking, public authService: AuthService, public storage: Storage, public alertCtrl: AlertController, private launchReview: LaunchReview,
    public gf: GlobalFunction, public bookCombo: Bookcombo,public searchhotel: SearchHotel,  private _calendar: Calendar) {
    this.objectFlight = this.gf.getParams('flightcombo');
    this.room = Roomif.arrroom;
    this.nameroom = this.room[0].ClassName;
    this.storage.get('email').then(email => {
      this.email=email
    })
    
  }

  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('code');
    this.ischeckshow = this.activatedRoute.snapshot.paramMap.get('ischeck');
    this.total = this.bookCombo.totalprice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    let se = this;
    se.searchhotel.totalPrice = se.total;
    se.gf.logEventFirebase(se.searchhotel.paymentType,se.searchhotel, 'flightcombodoneprepay', 'purchase', 'Combo');
  }
  GetUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.gf.getUserInfo(auth_token).then((data) => {
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
  next(stt) {
    this.Roomif.priceshowtt = "";
    //google analytic
    //this.gf.googleAnalytion('payment','Purchases','hotelid:'+this.booking.code+'/cin:'+this.booking.CheckInDate+'/cout:'+this.booking.CheckOutDate+'/adults:'+this.booking.Adults+'/child:'+this.booking.Child+'/roomnumber:'+ this.booking.roomNb+ '/price:'+this.booking.cost);
    this.showConfirm();
    if (this.checkreview == 0) {
      this.showConfirm();
    }
    this.gf.setParams(2, 'seemoreblog');
    if(stt==0){
      this.navCtrl.navigateForward('/app/tabs/tab1');
    }else{
      this.navCtrl.navigateBack(['/app/tabs/tab3/']);
    }
   
  }
  btnsee()
  {
    this.navCtrl.navigateForward('/app/tabs/tab3');
  }
  public async showConfirm() {
    this.storage.set("checkreview", 1);
    let alert = await this.alertCtrl.create({
      header: 'Bạn thích iVIVU.com?',
      message: 'Đánh giá ứng dụng trên CH Play',
      mode: "ios",
      cssClass: 'done1-combo-css',
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

