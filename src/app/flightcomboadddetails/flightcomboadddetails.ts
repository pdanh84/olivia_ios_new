import { FlightpointsavePage } from './../flightpointsave/flightpointsave.page';
import { Bookcombo } from './../providers/book-service';
import { SearchHotel } from 'src/app/providers/book-service';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, Platform, LoadingController, ToastController, ActionSheetController, IonPopover } from '@ionic/angular';
import { Booking, ValueGlobal, RoomInfo } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { ActivityService, GlobalFunction } from '../providers/globalfunction';

import * as moment from 'moment';
import * as $ from 'jquery';
import { ConfirmemailPage } from '../confirmemail/confirmemail.page';
import { OverlayEventDetail } from '@ionic/core';
import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';
import { BizTravelService } from '../providers/bizTravelService';
import { SelectDateOfBirthPage } from '../selectdateofbirth/selectdateofbirth.page';

/**
 * Generated class for the FacilitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-flightcomboadddetails',
  templateUrl: 'flightcomboadddetails.html',
  styleUrls: ['flightcomboadddetails.scss'],
})
export class FlightComboAddDetailsPage implements OnInit {
  @ViewChild(IonPopover) childbirthdayctrl:IonPopover;
  cin; BirthDay; ischecklugage = false; PriceAvgPlusTAStr; PriceAvgPlusTA; PriceAvgPlusTAOld
  showLuggage = false; ho; ten
  arrlugage:any = []; hoten; phone; arradult:any = []; datecin; objectFlight; airLineLuggageDepart:any = []; airLineLuggageReturn:any = [];
  loader: any; arrchild:any = []; validemail = true; _email: any; checkchangeemail = false; search; activeStep: number = 1; adult; child = 0;
  showLotusPoint = false;
  departLuggage:any = []; returnLuggage:any = [];
  emailinvalid: boolean;
  hoteninvalid: boolean;
  sodienthoaiinvalid: boolean;
  hasinput: boolean = false;
  subnameinvalid: boolean;
  ishideNameMail = true; hotenhddt; emailhddt;
  companyname; address; tax; addressorder;
  ischeck: boolean;

  inputtext: boolean = false;
  listPaxSuggestByMemberId:any= [];
  listpaxhint: any = [];
  hidepaxhint: boolean = false;
  currentSelectPax: any;
  jti: any;
  allowClickDateOfBirth = true;
  constructor(public platform: Platform, private toastCtrl: ToastController, public valueGlobal: ValueGlobal, public navCtrl: NavController, public zone: NgZone,
    public searchhotel: SearchHotel, private booking: Booking, private bookcombo: Bookcombo, public storage: Storage, public alertCtrl: AlertController, public value: ValueGlobal, public modalCtrl: ModalController, public gf: GlobalFunction, public loadingCtrl: LoadingController,
    public Roomif: RoomInfo, public actionsheetCtrl: ActionSheetController,
    private fb: Facebook,
    public bizTravelService: BizTravelService,
    public activityService: ActivityService) {
    var id = 1;
    let num = 1;
    this.objectFlight = this.gf.getParams('flightcombo');
    this.showLotusPoint = ((this.objectFlight.FlightBooking.departFlight && this.objectFlight.FlightBooking.departFlight.AirlineCode.indexOf('VietnamAirlines') != -1) || (this.objectFlight.FlightBooking.returnFlight && this.objectFlight.FlightBooking.returnFlight.AirlineCode.indexOf('VietnamAirlines') != -1)) ? true : false;
    this.PriceAvgPlusTAStr = this.objectFlight.HotelBooking.TotalPrices;
    this.PriceAvgPlusTA = this.objectFlight.HotelBooking.TotalPrices;
    this.PriceAvgPlusTAOld = this.objectFlight.HotelBooking.TotalPrices;
    this.PriceAvgPlusTAStr = this.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    this.airLineLuggageDepart = this.objectFlight.airLineLuggageDepart;
    this.airLineLuggageReturn = this.objectFlight.airLineLuggageReturn;

    let number;
    var item;
    for (let i = 0; i < searchhotel.adult; i++) {
      number = i + 1;
      item = { id: id, text: "Người lớn " + number + "", PassengerType: 0, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0, hoten: "", genderdisplay: "", airlineMemberCode: "", iddisplay: i + 1 }
      this.arradult.push(item);
      id++;
    }
    this.adult = searchhotel.adult;
    if (searchhotel.arrchild) {
      this.child = searchhotel.arrchild.length;
      
      for (let i = 0; i < searchhotel.arrchild.length; i++) {
        if (Number(searchhotel.arrchild[i].numage) >= 12) {
          number = i + 1;
          item = { id: id, text: "Người lớn " + number + "", PassengerType: 0, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0, hoten: "", genderdisplay: "", isChild: true, iddisplay: i + 1 }
          this.arrchild.push(item);
          id++;
        }
        if (searchhotel.arrchild[i].numage == "<1") {
          let maxdob = moment(moment(searchhotel.CheckInDate).add(-14, 'days')).format('YYYY-MM-DD');//trên 14 ngày tuổi
          let mindob = moment( moment(moment(searchhotel.CheckInDate).add(-2, 'years')).add(1,'days') ).format('YYYY-MM-DD');//dưới 2 tuổi
          item = { id: id, text: "Trẻ sơ sinh", PassengerType: 2, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0, hoten: "", genderdisplay: "", isChild: true, iddisplay: i + 1, maxdob: maxdob, mindob: mindob };
          this.arrchild.push(item);
          id++;
        }
        else if (Number(searchhotel.arrchild[i].numage) < 2) {
          let maxdob = moment(moment(searchhotel.CheckInDate).add(-14, 'days')).format('YYYY-MM-DD');//trên 14 ngày tuổi
          let mindob = moment( moment(moment(searchhotel.CheckInDate).add(-2, 'years')).add(1,'days') ).format('YYYY-MM-DD');//dưới 2 tuổi
          item = { id: id, text: "Trẻ sơ sinh", PassengerType: 2, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0, hoten: "", genderdisplay: "", isChild: true, iddisplay: i + 1, maxdob: maxdob, mindob: mindob };
          this.arrchild.push(item);
          id++;
        }
        else if (Number(searchhotel.arrchild[i].numage) < 12 && Number(searchhotel.arrchild[i].numage) >= 2) {
          let maxdob = moment( moment(moment(searchhotel.CheckInDate).add(-2, 'years')).add(-1,'days') ).format('YYYY-MM-DD');//trên 2 tuổi
          let mindob = moment(moment(searchhotel.CheckInDate).add(-12, 'years')).add(1,'days').format('YYYY-MM-DD');//dưới 12 tuổi
          item = { id: id, text: "Trẻ em", PassengerType: 1, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0, hoten: "", genderdisplay: "", isChild: true, iddisplay: i + 1, maxdob: maxdob, mindob: mindob };
          this.arrchild.push(item);
          id++;
        }
      }
    }
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
      }
    })
    this.storage.get('infocus').then(infocus => {
      var item;
      if (infocus) {
        if (infocus.ho && infocus.ten) {
          this.hoten = infocus.ho + ' ' + infocus.ten;
        } else {
          if (infocus.ho) {
            this.hoten = infocus.ho;
          }
          else if (infocus.ten) {
            this.hoten = infocus.ten;
          }
        }
        this.phone = infocus.phone;

      } else {
        if (this.bookcombo.hoten) {
          this.hoten = this.bookcombo.hoten;
        }
        if (this.bookcombo.phone) {
          this.phone = this.bookcombo.phone;
        }

      }
      this.arradult[0].hoten = this.hoten;
      this.storage.get('infoPassengerscombo').then(data => {
        if (data) {

          this.zone.run(() => {
            if (data.adult && data.adult.length > 0) {
              for (let index = 0; index < this.arradult.length; index++) {
                const element = this.arradult[index];
                const elementcache = data.adult[index];
                if (elementcache) {
                  element.id = elementcache.id;
                  //element.PassengerType = elementcache.PassengerType;
                  element.Gender = elementcache.Gender;
                  element.FirstName = elementcache.FirstName;
                  element.LastName = elementcache.LastName;
                  element.hoten = elementcache.hoten;
                  element.genderdisplay = elementcache.genderdisplay;
                  element.airlineMemberCode = elementcache.airlineMemberCode;

                  if (element.Gender) {
                    this.checkInput(element, 1, true);
                  }
                  if (element.hoten) {
                    this.checkInput(element, 2, true);
                  }
                }
              }
            }
            if (data.child && data.child.length > 0) {
              for (let index = 0; index < this.arrchild.length; index++) {
                const element = this.arrchild[index];
                const elementcache = data.child[index];
                if (elementcache) {
                  element.id = elementcache.id;
                  element.Gender = elementcache.Gender;
                  element.FirstName = elementcache.FirstName;
                  element.LastName = elementcache.LastName;
                  element.hoten = elementcache.hoten;
                  if(elementcache.BirthDay){
                    element.BirthDay = elementcache.BirthDay;
                    element.birdayDisplay = moment(elementcache.BirthDay).format('DD/MM/YYYY');
                  }
                  
                  element.genderdisplay = elementcache.genderdisplay;

                  if (element.Gender) {
                    this.checkInput(element, 1, false);
                  }
                  if (element.hoten) {
                    this.checkInput(element, 2, false);
                  }
                  if (element.dateofbirth) {
                    this.checkInput(element, 3, false);
                  }
                }
              }
            }
          })
        }

      })
      for (let i = 0; i < this.arradult.length; i++) {
        if (this.arradult[i].PassengerType != 2) {
          var item1 = { id: this.arradult[i].id, text: "Ký gửi khách " + num + "", weight: 0, amount: 0, amountstr: 0, weightreturn: 0, amountreturn: 0, amountreturnstr: 0, index: 0, indexreturn: 0 };
          this.arrlugage.push(item1);
          num++;
        }
      }
      for (let i = 0; i < this.arrchild.length; i++) {
        if (this.arrchild[i].PassengerType != 2) {
          var item1 = { id: this.arrchild[i].id, text: "Ký gửi khách " + num + "", weight: 0, amount: 0, amountstr: 0, weightreturn: 0, amountreturn: 0, amountreturnstr: 0, index: 0, indexreturn: 0 };
          this.arrlugage.push(item1);
          num++;
        }
      }
    })
    this.storage.get('email').then(email => {
      if (email) {
        this._email = email;
        var checkappleemail = (this._email.includes("appleid") || this._email.includes('vivumember.info'));
        if (checkappleemail) {
          this.validemail = false;
        }
      } else {
        this.validemail = false;
      }
    })
    this.storage.get('order').then(order => {
      if (order) {
        this.companyname = order.companyname;
        this.address = order.address;
        this.tax = order.tax;
        this.addressorder = order.addressorder;
        this.hotenhddt = order.hotenhddt;
        this.emailhddt = order.emailhddt;
        this.ishideNameMail = order.ishideNameMail;
        this.ischeck = true;
      } else {
        this.ischeck = false;
      }
    })
    this.GetUserInfo();
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.gf.RequestApi('GET', C.urls.baseUrl.urlMobile+'/api/Dashboard/GetListNameHotel?memberid='+jti, {},{}, 'flightadddetails', 'GetListName').then((data)=>{
          if(data && data.response && data.response.length >0){

            for (let index = 0; index < data.length; index++) {
              const element = data.response[index];
              let checkAdult = true;
              if(element.dateOfBirth){
                checkAdult = moment(this.cin).diff(element.dateOfBirth, 'months') > 144;
              }
              element.isChild = !checkAdult;
            }
          
            this.listPaxSuggestByMemberId = [...data.response];
          }
        })
      }
    })
    let se = this;
    se.searchhotel.totalPrice = se.PriceAvgPlusTAStr;
    se.gf.logEventFirebase('',se.searchhotel, 'flightcomboadddetails', 'add_shipping_info', 'Combo');

    se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_INITIATED_CHECKOUT, {
      'fb_content_type': 'hotel', 'fb_content_id': bookcombo.HotelCode ? bookcombo.HotelCode : se.booking.code, 'fb_num_items': se.searchhotel.roomnumber, 'fb_value': se.gf.convertNumberToDouble(se.PriceAvgPlusTAStr), 'fb_currency': 'VND',
      'checkin_date': se.searchhotel.CheckInDate, 'checkout_date ': se.searchhotel.CheckOutDate, 'num_adults': se.searchhotel.adult, 'num_children': (se.searchhotel.child ? se.searchhotel.child : 0), 'price': se.PriceAvgPlusTAStr
    }, se.gf.convertStringToNumber(se.PriceAvgPlusTAStr));
  }

  ngOnInit() {
  }
  GetUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        let headers = {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo';
        se.gf.RequestApi('GET', strUrl, headers, {}, 'flightComboAddDetails', 'GetUserInfo').then((data)=>{
            if (data) {
              se.zone.run(() => {
                se.ischeck = false;
                var corpInfomations
                if (data.corpInfomations) {
                  corpInfomations=data.corpInfomations[0];
                }
               
                if(corpInfomations){
                  se.companyname = corpInfomations.legalName;
                  se.address = corpInfomations.address;
                  se.tax = corpInfomations.taxCode;
                  se.ischeck = true;
                }
                else{
                  se.storage.get('order').then(order => {
                    if (order) {
                      se.companyname = order.companyname;
                      se.address = order.address;
                      se.tax = order.tax;
                      se.addressorder = order.addressorder;
                      se.hotenhddt=order.hotenhddt;
                      se.emailhddt=order.emailhddt;
                      se.ishideNameMail=order.ishideNameMail;
                      se.ischeck = true;
                    }
                  })
                }
              })
            }else{
              se.storage.get('order').then(order => {
                if (order) {
                  se.companyname = order.companyname;
                  se.address = order.address;
                  se.tax = order.tax;
                  se.addressorder = order.addressorder;
                  se.hotenhddt=order.hotenhddt;
                  se.emailhddt=order.emailhddt;
                  se.ishideNameMail=order.ishideNameMail;
                  se.ischeck = true;
                }else {
                  se.ischeck = false;
                }
              })
            }
        });
      }
    })
  }
  goback() {
    if (this.activeStep == 1) {
      this.storage.set('infoPassengerscombo', { adult: this.arradult, child: this.arrchild });
      this.bookcombo.hoten = this.hoten;
      this.bookcombo.phone = this.phone;
      this.navCtrl.back();
    } else {
      this.activeStep = 1;
    }

  }
  /** Mua thêm hành lý
   * PDANH 24/04/2018
   */
  buyLuggage() {
    this.zone.run(() => {
      this.showLuggage = !this.showLuggage;
      if (this.showLuggage) {
        this.objectFlight.HotelBooking.TotalPrices = this.PriceAvgPlusTA;
        this.PriceAvgPlusTAStr = this.PriceAvgPlusTA.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
      else {
        this.objectFlight.HotelBooking.TotalPrices = this.PriceAvgPlusTAOld;
        this.PriceAvgPlusTAStr = this.PriceAvgPlusTAOld.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
    })

  }

  minusluggedepart(weight, index) {
    this.zone.run(() => {
      if (weight != 0) {
        var priceold = this.arrlugage[index].amount;
        if (this.arrlugage[index].index != 0) {
          this.arrlugage[index].weight = this.airLineLuggageDepart[this.arrlugage[index].index - 1].Weight;
          this.arrlugage[index].amount = this.airLineLuggageDepart[this.arrlugage[index].index - 1].Amount;
          this.arrlugage[index].key = this.airLineLuggageDepart[this.arrlugage[index].index - 1].purchaseKey;
          this.arrlugage[index].amountstr = this.airLineLuggageDepart[this.arrlugage[index].index - 1].Amount.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.arrlugage[index].index = this.arrlugage[index].index - 1;

        }
        else {
          this.arrlugage[index].weight = 0;
          this.arrlugage[index].amount = 0;
          this.arrlugage[index].amountstr = "0";
          this.arrlugage[index].key = "";
        }
        this.PriceAvgPlusTA = Number(this.PriceAvgPlusTA) + Number(this.arrlugage[index].amount) - priceold;
        this.PriceAvgPlusTAStr = this.PriceAvgPlusTA.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
    });
  }
  addluggedepart(weight, index) {
    this.zone.run(() => {
      var priceold = this.arrlugage[index].amount;
      if (weight == 0) {
        this.arrlugage[index].weight = this.airLineLuggageDepart[0].Weight;
        this.arrlugage[index].amount = this.airLineLuggageDepart[0].Amount;
        this.arrlugage[index].key = this.airLineLuggageDepart[0].purchaseKey;
        this.arrlugage[index].amountstr = this.airLineLuggageDepart[0].Amount.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        this.PriceAvgPlusTA = Number(this.PriceAvgPlusTA) + Number(this.arrlugage[index].amount) - priceold;
        this.PriceAvgPlusTAStr = this.PriceAvgPlusTA.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
      else {
        if (this.arrlugage[index].index < this.airLineLuggageDepart.length - 1) {
          this.arrlugage[index].weight = this.airLineLuggageDepart[this.arrlugage[index].index + 1].Weight;
          this.arrlugage[index].amount = this.airLineLuggageDepart[this.arrlugage[index].index + 1].Amount;
          this.arrlugage[index].key = this.airLineLuggageDepart[this.arrlugage[index].index + 1].purchaseKey;
          this.arrlugage[index].amountstr = this.airLineLuggageDepart[this.arrlugage[index].index + 1].Amount.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.arrlugage[index].index = this.arrlugage[index].index + 1;
          this.PriceAvgPlusTA = Number(this.PriceAvgPlusTA) + Number(this.arrlugage[index].amount) - priceold;
          this.PriceAvgPlusTAStr = this.PriceAvgPlusTA.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        }
      }
    });
  }
  minusluggereturn(weight, index) {
    this.zone.run(() => {
      if (weight != 0) {
        var priceold = this.arrlugage[index].amountreturn;
        if (this.arrlugage[index].indexreturn != 0) {
          this.arrlugage[index].weightreturn = this.airLineLuggageReturn[this.arrlugage[index].indexreturn - 1].Weight;
          this.arrlugage[index].amountreturn = this.airLineLuggageReturn[this.arrlugage[index].indexreturn - 1].Amount;
          this.arrlugage[index].keyreturn = this.airLineLuggageReturn[this.arrlugage[index].indexreturn - 1].purchaseKey;
          this.arrlugage[index].amountreturnstr = this.airLineLuggageReturn[this.arrlugage[index].indexreturn - 1].Amount.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.arrlugage[index].indexreturn = this.arrlugage[index].indexreturn - 1;
        }
        else {
          this.arrlugage[index].weightreturn = 0;
          this.arrlugage[index].amountreturn = 0;
          this.arrlugage[index].amountreturnstr = "0";
          this.arrlugage[index].keyreturn = "";
        }
        this.PriceAvgPlusTA = Number(this.PriceAvgPlusTA) + Number(this.arrlugage[index].amountreturn) - priceold;
        this.PriceAvgPlusTAStr = this.PriceAvgPlusTA.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
    });
  }
  addluggereturn(weight, index) {
    this.zone.run(() => {
      var priceold = this.arrlugage[index].amountreturn;
      if (weight == 0) {
        this.arrlugage[index].weightreturn = this.airLineLuggageReturn[0].Weight;
        this.arrlugage[index].amountreturn = this.airLineLuggageReturn[0].Amount;
        this.arrlugage[index].keyreturn = this.airLineLuggageReturn[0].purchaseKey;
        this.arrlugage[index].amountreturnstr = this.airLineLuggageReturn[0].Amount.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        this.PriceAvgPlusTA = Number(this.PriceAvgPlusTA) + Number(this.arrlugage[index].amountreturn) - priceold;
        this.PriceAvgPlusTAStr = this.PriceAvgPlusTA.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
      else {
        if (this.arrlugage[index].indexreturn < this.airLineLuggageReturn.length - 1) {
          this.arrlugage[index].weightreturn = this.airLineLuggageReturn[this.arrlugage[index].indexreturn + 1].Weight;
          this.arrlugage[index].amountreturn = this.airLineLuggageReturn[this.arrlugage[index].indexreturn + 1].Amount;
          this.arrlugage[index].keyreturn = this.airLineLuggageReturn[this.arrlugage[index].indexreturn + 1].purchaseKey;
          this.arrlugage[index].amountreturnstr = this.airLineLuggageReturn[this.arrlugage[index].indexreturn + 1].Amount.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.arrlugage[index].indexreturn = this.arrlugage[index].indexreturn + 1;
          this.PriceAvgPlusTA = Number(this.PriceAvgPlusTA) + Number(this.arrlugage[index].amountreturn) - priceold;
          this.PriceAvgPlusTAStr = this.PriceAvgPlusTA.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        }
      }
    });

  }
  next() {
    this.hasinput = false;
    if (this.activeStep == 1) {
      var co = 0;
      //check người lớn
      for (let i = 0; i < this.arradult.length; i++) {
        this.arradult[i].errorName = false;
        this.arradult[i].errorGender = false;
        this.arradult[i].errorBirthday = false;
        this.arradult[i].errorInfo = false;

        this.arradult[i].errorTextName = '';
        this.arradult[i].errorTextGender = '';
        this.arradult[i].errorTextBirthday = '';
        this.arradult[i].textErrorInfo = '';

        if (!this.arradult[i].Gender && !this.arradult[i].hoten && !this.arradult[i].BirthDay) {
          this.arradult[i].errorInfo = true;
          this.arradult[i].textErrorInfo = "Vui lòng nhập thông tin Người lớn " + (i + 1);
          co = 5;
          break;
        }

        if (!this.arradult[i].Gender) {
          co = 3;
          this.arradult[i].errorGender = true;
          this.arradult[i].errorTextGender = 'Vui lòng nhập giới tính Người lớn ' + (i + 1);
          break;
        }

        if (!this.arradult[i].hoten) {

          co = 1;
          this.arradult[i].errorName = true;
          this.arradult[i].errorTextName = 'Vui lòng nhập tên Người lớn ' + (i + 1);
          break;
        }
        var checktext = this.hasWhiteSpace(this.arradult[i].hoten.trimEnd().trimStart());
        if (!checktext || !this.validateNameNotContainNumber(this.arradult[i].hoten) || !this.validateNameNotContainExceptionChar(this.arradult[i].hoten)) {
          co = 1;
          this.arradult[i].errorName = true;
          this.arradult[i].errorTextName = "Họ và tên Người lớn " + (i + 1) + " không hợp lệ. Vui lòng kiểm tra lại!";
          break;
        }

        if (this.arradult[i].PassengerType != 0) {
          if (!this.arradult[i].BirthDay) {
            co = 2;
            this.arradult[i].errorBirthday = true;
            this.arradult[i].errorTextBirthday = 'Vui lòng nhập ngày sinh Người lớn ' + (i + 1);
            break;
          }
        }
      }
      //check trẻ em
      for (let i = 0; i < this.arrchild.length; i++) {
        this.arrchild[i].errorName = false;
        this.arrchild[i].errorGender = false;
        this.arrchild[i].errorBirthday = false;
        this.arrchild[i].errorBirthday1 = false;
        this.arrchild[i].errorInfo = false;

        this.arrchild[i].errorTextName = '';
        this.arrchild[i].errorTextGender = '';
        this.arrchild[i].errorTextBirthday = '';
        this.arrchild[i].errorTextInfo = '';

        if(!this.arrchild[i].Gender && !this.arrchild[i].hoten && !this.arrchild[i].BirthDay){
          this.arrchild[i].errorInfo = true;
          this.arrchild[i].textErrorInfo = "Vui lòng nhập thông tin "+(this.arrchild[i].isChild ? (this.arrchild[i].PassengerType==1 ?  'Trẻ em ': 'Trẻ sơ sinh '): 'Người lớn ')+" "+(i+1);
          co = 5;
          break;
        }

        if (!this.arrchild[i].Gender) {
          co = 3;
          this.arrchild[i].errorGender = true;
          this.arrchild[i].errorTextGender = 'Vui lòng nhập giới tính '+(this.arrchild[i].isChild ? (this.arrchild[i].PassengerType==1 ?  'Trẻ em ': 'Trẻ sơ sinh '): 'Người lớn ')+' '+ (i+1);
          break;
        }
        
        if (!this.arrchild[i].hoten) {

          co = 1;
          this.arrchild[i].errorName = true;
          this.arrchild[i].errorTextName = 'Vui lòng nhập tên '+(this.arrchild[i].isChild ? (this.arrchild[i].PassengerType==1 ?  'Trẻ em ': 'Trẻ sơ sinh '): 'Người lớn ')+''+ (i+1);
          break;
        }
        var checktext = this.hasWhiteSpace(this.arrchild[i].hoten.trimEnd().trimStart());
        if (!checktext || !this.validateNameNotContainNumber(this.arrchild[i].hoten) || !this.validateNameNotContainExceptionChar(this.arrchild[i].hoten)) {
          co = 1;
          this.arrchild[i].errorName = true;
          this.arrchild[i].errorTextName = "Họ và tên Trẻ em "+(i+1)+" không hợp lệ. Vui lòng kiểm tra lại!";
          break;
        }
      
        if (this.arrchild[i].PassengerType != 0) {
          if (!this.arrchild[i].BirthDay) {
            co = 2;
            this.arrchild[i].errorBirthday = true;
            this.arrchild[i].errorTextBirthday = 'Vui lòng nhập ngày sinh '+(this.arrchild[i].isChild ? (this.arrchild[i].PassengerType==1 ?  'Trẻ em ': 'Trẻ sơ sinh '): 'Người lớn ')+''+ (i+1);
            break;
          }
        }
        let departdate = moment(this.searchhotel.CheckOutDate).format('YYYY-MM-DD');
        let departdatestring = moment(this.searchhotel.CheckOutDate).format('DD-MM-YYYY');
        if (moment(departdate).diff(moment(this.arrchild[i].BirthDay), 'days') < 14) {
          if (this.arrchild[i].PassengerType == 1) {
            this.arrchild[i].errorTextBirthday = "Vui lòng nhập ngày sinh Trẻ em lớn hơn hoặc bằng 2 tuổi so với ngày về " + departdatestring;
            this.arrchild[i].errorBirthday = true;
            this.arrchild[i].errorBirthday1 = true;
            co = 4;
            break;
          }
          if (this.arrchild[i].PassengerType == 2) {
            this.arrchild[i].errorTextBirthday = "Vui lòng nhập ngày sinh Trẻ sơ sinh lớn hơn 14 ngày tuổi so với ngày về " + departdatestring;
            this.arrchild[i].errorBirthday = true;
            this.arrchild[i].errorBirthday1 = true;
            co = 4;
            break;
          }
        }

        //Check độ tuổi trẻ em <12
        if (this.arrchild[i].PassengerType == 1) {
          if (moment(departdate).diff(moment(this.arrchild[i].BirthDay), 'months') >= 144) {
            this.arrchild[i].errorBirthday = true;
            this.arrchild[i].errorBirthday1 = true;
            this.arrchild[i].errorTextBirthday = "Vui lòng nhập ngày sinh Trẻ em không được lớn hơn 12 tuổi so với ngày về " + departdatestring;
            co = 2;
            break;
          }
          if (moment(departdate).diff(moment(this.arrchild[i].BirthDay), 'months') < 24) {
            this.arrchild[i].errorBirthday = true;
            this.arrchild[i].errorBirthday1 = true;
            this.arrchild[i].errorTextBirthday = "Vui lòng nhập ngày sinh Trẻ em không được nhỏ hơn 2 tuổi so với ngày về " + departdatestring;
            co = 2;
            break;
          }
        }
        //Check độ tuổi trẻ sơ sinh <2
        if (this.arrchild[i].PassengerType == 2) {
          if (moment(departdate).diff(moment(this.arrchild[i].BirthDay), 'months') >= 24) {
            this.arrchild[i].errorBirthday = true;
            this.arrchild[i].errorBirthday1 = true;
            this.arrchild[i].errorTextBirthday = "Vui lòng nhập ngày sinh Trẻ sơ sinh không được lớn hơn 2 tuổi so với ngày về " + departdatestring;
            co = 2;
            break;
          }
        }
       
      }
      if (co == 0) {
        var se = this;
        //check tên nhập trùng
        var se = this;
        let itempax = [...se.arradult]
        if (se.arrchild && se.arrchild.length > 0) {
          itempax = [...itempax, ...se.arrchild];
        }
        se.checkDuplicateItem(itempax).then((itemcheck) => {
          if (itemcheck && itemcheck.length > 0) {
            se.searchhotel.duplicateItem = itemcheck;
            //show cảnh báo trùng
            se.showAlertDuplicateName();
            return;
          }
          else {
            var checkappleemail = (se._email.includes("appleid") || se._email.includes("vivumember.info"));
                    if (checkappleemail) {
                      se.showConfirmEmail();
                    } else {
                      se.activeStep = 2;
                    }
            // se.checkValidName(itempax).then((itemcheckname) => {
              // if (itemcheckname) {
              //   se.showAlertInvalidName(itemcheckname);
              //   return;
              // } else {
                // se.checkInValidSubNameBeforeNextStep(itempax).then((iteminvalid) => {
                //   if (!iteminvalid) {
                    
                //   } else {
                //     se.showAlertInvalidSubName(iteminvalid);
                //     return;
                //   }
                // })
              // }
            // })
          }
        })
      }
    } else {
      this.gonextstep();
    }


  }

  gonextstep() {
    this.emailinvalid = false;
    this.hoteninvalid = false;
    this.sodienthoaiinvalid = false;
    this.hasinput = true;
    if (this.hoten) {

      if (!this.validateNameNotContainNumber(this.hoten)) {
        this.hoteninvalid = true;
        return;
      }

      var checktext = this.hasWhiteSpace(this.hoten);
      if (checktext) {
        if (this.phone) {
          if (this.gf.checkPhoneInValidFormat(this.phone)) {
            this.sodienthoaiinvalid = true;
            return;
          }
        } else {
          return;
        }
      }
      else {
        this.hoteninvalid = true;
        return;
      }
    } else {
      this.hoteninvalid = true;
      return;
    }
    if (this._email && (!this.validateEmail(this._email) || !this.gf.checkUnicodeCharactor(this._email) || this.gf.checkEmailInvalidFormat(this._email))) {
      this.emailinvalid = true;
      return;
    }

    let checkappleemail = (this._email.includes("appleifd") || this._email.includes("vivumember.info"));
    if (checkappleemail) {
      this.checkchangeemail = true;
      this.showConfirmEmail();
      return;
    }
    //check thông tin xuất hđ
    if (this.ischeck) {
      if (this.companyname && this.address && this.tax) {
        this.Roomif.companyname = this.companyname;
        this.Roomif.address = this.address;
        this.Roomif.tax = this.tax;
        this.Roomif.addressorder = this._email;
        this.Roomif.nameOrder = this.hoten;

        if (!this.ishideNameMail) {
          if (this.emailhddt && this.hotenhddt) {
            if (!this.validateEmail(this.emailhddt) || !this.gf.checkUnicodeCharactor(this.emailhddt)) {
              this.gf.showToastWarning('email xuất hóa đơn không hợp lệ. Vui lòng kiểm tra lại');
              return;
            }
            else {
              this.Roomif.addressorder = this.emailhddt;
              this.Roomif.nameOrder = this.hotenhddt;
            }
          }
          else {
            this.presentToastOrder();
            return;
          }
        }
        var order1 = { companyname: this.companyname, address: this.address, tax: this.tax, addressorder: this.addressorder, ishideNameMail: this.ishideNameMail, hotenhddt: this.hotenhddt, emailhddt: this.emailhddt }
        this.storage.set("order", order1);
        this.Roomif.order = this.companyname + "," + this.address + "," + this.tax + "," + this.addressorder
        this.Roomif.ischeck = this.ischeck;

        this.objectFlight.HotelBooking.CompName = this.companyname;
        this.objectFlight.HotelBooking.CompAddress = this.address;
        this.objectFlight.HotelBooking.CompTaxCode = this.tax;
        this.objectFlight.HotelBooking.CompanyContactEmail = this.Roomif.addressorder;
        this.objectFlight.HotelBooking.CompanyContactName = this.Roomif.nameOrder;
        this.objectFlight.HotelBooking.IsInvoice = 1;

      }
      else {
        this.presentToastOrder();
        return;
      }
    }

    this.departLuggage = this.objectFlight.airLineLuggageDepart;
    this.returnLuggage = this.objectFlight.airLineLuggageReturn;
    let departluggage:any = [], returnluggage:any = [];
    if (this.departLuggage && this.departLuggage.length > 0) {
      const dl = this.departLuggage.filter((item) => { return item.quantity > 0 });
      if (dl && dl.length > 0) {
        dl.forEach(element => {
          element.quantitycheck = element.quantity;
          departluggage.push(element)
        });
      }
    }
    if (this.returnLuggage && this.returnLuggage.length > 0) {
      const dl = this.returnLuggage.filter((item) => { return item.quantity > 0 });
      if (dl && dl.length > 0) {
        dl.forEach(element => {
          element.quantitycheck = element.quantity;
          returnluggage.push(element)
        });
      }
    }
    for (let i = 0; i < this.arradult.length; i++) {
      if (departluggage && departluggage.length > 0) {
        if (departluggage && departluggage.length == 1) {
          if (departluggage[0].quantitycheck > 0) {
            this.arradult[i].Baggage = departluggage[0].Weight;
            if (departluggage[0].AirLineCode=="VN") {
              this.arradult[i].AncillaryJson = JSON.stringify([{ Name: "Depart baggage", Type: "Baggage", Key: departluggage[0].purchaseKey, Value: `${departluggage[0].Weight}`, price: departluggage[0].Amount,title: `${departluggage[0].Weight}`,netPrice:departluggage[0].NetPrice }]);
            } else {
              this.arradult[i].AncillaryJson = JSON.stringify([{ Name: "Depart baggage", Type: "Baggage", Key: departluggage[0].purchaseKey, Value: `${departluggage[0].Weight}`, price: departluggage[0].Amount }]);
            }
            departluggage[0].quantitycheck--;
          }
        }
        else if (departluggage && departluggage.length > 1) {
          var dl1;
          if (i > 0 && departluggage[i - 1] && departluggage[i - 1].quantitycheck > 0) {
            dl1 = departluggage[i - 1];
          } else {
            dl1 = departluggage[i];
          }
          if (dl1) {
            this.arradult[i].Baggage = dl1.Weight;
            if (dl1.AirLineCode=="VN") {
              this.arradult[i].AncillaryJson = JSON.stringify([{ Name: "Depart baggage", Type: "Baggage", Key: dl1.purchaseKey, Value: `${dl1.Weight}`, price: dl1.Amount,title:`${dl1.Weight}`,netPrice:dl1.NetPrice }]);
            } else {
              this.arradult[i].AncillaryJson = JSON.stringify([{ Name: "Depart baggage", Type: "Baggage", Key: dl1.purchaseKey, Value: `${dl1.Weight}`, price: dl1.Amount }]);
            }
            dl1.quantitycheck--;
          }
        }
      }

      if (returnluggage && returnluggage.length > 0) {
        if (returnluggage && returnluggage.length == 1) {
          if (returnluggage[0].quantitycheck > 0) {
            this.arradult[i].ReturnBaggage = returnluggage[0].Weight;
            if (returnluggage[0].AirLineCode=="VN") {
              this.arradult[i].AncillaryReturnJson = JSON.stringify([{ Name: "Return baggage", Type: "Baggage", Key: returnluggage[0].purchaseKey, Value: `${returnluggage[0].Weight}` , price: returnluggage[0].Amount,title:`${returnluggage[0].Weight}`,netPrice:returnluggage[0].NetPrice }]);
            } else {
              this.arradult[i].AncillaryReturnJson = JSON.stringify([{ Name: "Return baggage", Type: "Baggage", Key: returnluggage[0].purchaseKey, Value: `${returnluggage[0].Weight}` , price: returnluggage[0].Amount }]);
            }
          
            returnluggage[0].quantitycheck--;
          }
        }
        else if (returnluggage && returnluggage.length > 1) {
          var rl1;
          if (i > 0 && returnluggage[i - 1] && returnluggage[i - 1].quantitycheck > 0) {
            rl1 = returnluggage[i - 1];
          } else {
            rl1 = returnluggage[i];
          }
          if (rl1) {
            this.arradult[i].ReturnBaggage = rl1.Weight;
            if (rl1.AirLineCode=="VN") {
              this.arradult[i].AncillaryReturnJson = JSON.stringify([{ Name: "Return baggage", Type: "Baggage", Key: rl1.purchaseKey, Value: `${rl1.Weight}` , price: rl1.Amount,title:`${rl1.Weight}`,netPrice:rl1.NetPrice }]);
            } else {
              this.arradult[i].AncillaryReturnJson = JSON.stringify([{ Name: "Return baggage", Type: "Baggage", Key: rl1.purchaseKey, Value: `${rl1.Weight}` , price: rl1.Amount }]);
            }
            rl1.quantitycheck--;
          }
        }
      }

    }
    if (this.arrchild.length > 0) {
      for (let i = 0; i < this.arrchild.length; i++) {
        departluggage = departluggage.filter((item) => { return item.quantitycheck > 0 });
        returnluggage = returnluggage.filter((item) => { return item.quantitycheck > 0 });
        if (departluggage && departluggage.length > 0) {
          if (this.arrchild[i].PassengerType!=2) {
            if (departluggage && departluggage.length == 1) {
              if (departluggage[0].quantitycheck > 0) {
                this.arrchild[i].Baggage = departluggage[0].Weight;
                if (departluggage[0].AirLineCode=="VN") {
                  this.arrchild[i].AncillaryJson = JSON.stringify([{ Name: "Depart baggage", Type: "Baggage", Key: departluggage[0].purchaseKey, Value: `${departluggage[0].Weight}`, price: departluggage[0].Amount,title:`${departluggage[0].Weight}`,netPrice:departluggage[0].NetPrice }]);
                } else {
                  this.arrchild[i].AncillaryJson = JSON.stringify([{ Name: "Depart baggage", Type: "Baggage", Key: departluggage[0].purchaseKey, Value: `${departluggage[0].Weight}`, price: departluggage[0].Amount }]);
                }
                
                departluggage[0].quantitycheck--;
              }
            }
            else if (departluggage && departluggage.length > 1) {
              var dl1;
              if (i > 0 && departluggage[i - 1] && departluggage[i - 1].quantitycheck > 0) {
                dl1 = departluggage[i - 1];
              } else {
                dl1 = departluggage[i];
              }
              if (dl1) {
                this.arrchild[i].Baggage = dl1.Weight;
                if (dl1.AirLineCode=="VN") {
                  this.arrchild[i].AncillaryJson = JSON.stringify([{ Name: "Depart baggage", Type: "Baggage", Key: dl1.purchaseKey, Value: `${dl1.Weight}`, price: dl1.Amount,title:`${dl1.Weight}`,netPrice:dl1.NetPrice }]);
                } else {
                  this.arrchild[i].AncillaryJson = JSON.stringify([{ Name: "Depart baggage", Type: "Baggage", Key: dl1.purchaseKey, Value: `${dl1.Weight}`, price: dl1.Amount }]);
                }
                
                dl1.quantitycheck--;
              }
            }
          }
          
        }

        if (returnluggage && returnluggage.length > 0) {
          if (this.arrchild[i].PassengerType!=2) {
            if (returnluggage && returnluggage.length == 1) {
              if (returnluggage[0].quantitycheck > 0) {
                this.arrchild[i].ReturnBaggage = returnluggage[0].Weight;
                if (returnluggage[0].AirLineCode=="VN") {
                  this.arrchild[i].AncillaryReturnJson = JSON.stringify([{ Name: "Return baggage", Type: "Baggage", Key: returnluggage[0].purchaseKey, Value: `${returnluggage[0].Weight}`, price: returnluggage[0].Amount,title:`${returnluggage[0].Weight}`,netPrice:returnluggage[0].NetPrice }]);
                } else {
                  this.arrchild[i].AncillaryReturnJson = JSON.stringify([{ Name: "Return baggage", Type: "Baggage", Key: returnluggage[0].purchaseKey, Value: `${returnluggage[0].Weight}`, price: returnluggage[0].Amount }]);
                }
                
                returnluggage[0].quantitycheck--;
              }
            }
            else if (returnluggage && returnluggage.length > 1) {
              var rl1;
              if (i > 0 && returnluggage[i - 1] && returnluggage[i - 1].quantitycheck > 0) {
                rl1 = returnluggage[i - 1];
              } else {
                rl1 = returnluggage[i];
              }
              if (rl1) {
                this.arrchild[i].ReturnBaggage = rl1.Weight;
                if (rl1.AirLineCode=="VN") {
                  this.arrchild[i].AncillaryReturnJson = JSON.stringify([{ Name: "Return baggage", Type: "Baggage", Key: rl1.purchaseKey, Value: `${rl1.Weight}`, price: rl1.Amount,title:`${rl1.Weight}`,netPrice:rl1.NetPrice }]);
                } else {
                  this.arrchild[i].AncillaryReturnJson = JSON.stringify([{ Name: "Return baggage", Type: "Baggage", Key: rl1.purchaseKey, Value: `${rl1.Weight}`, price: rl1.Amount }]);
                }
                
                rl1.quantitycheck--;
              }
            }
          }
          
        }
      }
    }

    this.objectFlight.HotelBooking.TotalPrices = this.PriceAvgPlusTAOld;
    this.bookcombo.totalprice = this.PriceAvgPlusTAOld;

    if (this.bookcombo.ischeckbtnpromo) {
      this.objectFlight.HotelBooking.TotalPrices = Number(this.bookcombo.totalPriceBeforeApplyVoucher);
    }
    this.objectFlight.HotelBooking.TotalPrices = Number(this.objectFlight.HotelBooking.TotalPrices).toFixed(0);
    var arrPassengers:any = []
    for (let i = 0; i < this.arradult.length; i++) {
      var item;
      var texthoten = this.arradult[i].hoten.split(' ');
      if (texthoten.length > 2) {
        let name = '';
        for (let j = 1; j < texthoten.length; j++) {
          if (j == 1) {
            name += texthoten[j];
          } else {
            name += ' ' + texthoten[j];
          }
        }
        item = { PassengerType: this.arradult[i].PassengerType, FirstName: name, LastName: texthoten[0], BirthDay: this.arradult[i].BirthDay, Gender: this.arradult[i].Gender, Baggage: this.arradult[i].Baggage, ReturnBaggage: this.arradult[i].ReturnBaggage, AncillaryJson: this.arradult[i].AncillaryJson, AncillaryReturnJson: this.arradult[i].AncillaryReturnJson, AirlineMemberCode: (this.showLotusPoint && this.arradult[i].airlineMemberCode) ? this.arradult[i].airlineMemberCode : "" };
      } else if (texthoten.length > 1) {
        item = { PassengerType: this.arradult[i].PassengerType, FirstName: texthoten[1], LastName: texthoten[0], BirthDay: this.arradult[i].BirthDay, Gender: this.arradult[i].Gender, Baggage: this.arradult[i].Baggage, ReturnBaggage: this.arradult[i].ReturnBaggage, AncillaryJson: this.arradult[i].AncillaryJson, AncillaryReturnJson: this.arradult[i].AncillaryReturnJson, AirlineMemberCode: (this.showLotusPoint && this.arradult[i].airlineMemberCode) ? this.arradult[i].airlineMemberCode : "" };
      }
      else if (texthoten.length == 1) {
        item = { PassengerType: this.arradult[i].PassengerType, FirstName: "", LastName: texthoten[0], BirthDay: this.arradult[i].BirthDay, Gender: this.arradult[i].Gender, Baggage: this.arradult[i].Baggage, ReturnBaggage: this.arradult[i].ReturnBaggage, AncillaryJson: this.arradult[i].AncillaryJson, AncillaryReturnJson: this.arradult[i].AncillaryReturnJson, AirlineMemberCode: (this.showLotusPoint && this.arradult[i].airlineMemberCode) ? this.arradult[i].airlineMemberCode : "" };
      }
      arrPassengers.push(item);
    }
    //trẻ em
    for (let i = 0; i < this.arrchild.length; i++) {
      var item;
      var texthoten = this.arrchild[i].hoten.split(' ');
      if (this.arrchild[i].BirthDay) {
        this.arrchild[i].BirthDay = moment(this.arrchild[i].BirthDay).format('YYYY-MM-DD');
      }
      if (texthoten.length > 2) {
        let name = '';
        for (let j = 1; j < texthoten.length; j++) {
          if (j == 1) {
            name += texthoten[j];
          } else {
            name += ' ' + texthoten[j];
          }
        }
        item = { PassengerType: this.arrchild[i].PassengerType, FirstName: name, LastName: texthoten[0], BirthDay: this.arrchild[i].BirthDay, Gender: this.arrchild[i].Gender, Baggage: this.arrchild[i].Baggage, ReturnBaggage: this.arrchild[i].ReturnBaggage, AncillaryJson: this.arrchild[i].AncillaryJson, AncillaryReturnJson: this.arrchild[i].AncillaryReturnJson };
      } else if (texthoten.length > 1) {
        item = { PassengerType: this.arrchild[i].PassengerType, FirstName: texthoten[1], LastName: texthoten[0], BirthDay: this.arrchild[i].BirthDay, Gender: this.arrchild[i].Gender, Baggage: this.arrchild[i].Baggage, ReturnBaggage: this.arrchild[i].ReturnBaggage, AncillaryJson: this.arrchild[i].AncillaryJson, AncillaryReturnJson: this.arrchild[i].AncillaryReturnJson };
      }
      else if (texthoten.length == 1) {
        item = { PassengerType: this.arrchild[i].PassengerType, FirstName: "", LastName: texthoten[0], BirthDay: this.arrchild[i].BirthDay, Gender: this.arrchild[i].Gender, Baggage: this.arrchild[i].Baggage, ReturnBaggage: this.arrchild[i].ReturnBaggage, AncillaryJson: this.arrchild[i].AncillaryJson, AncillaryReturnJson: this.arrchild[i].AncillaryReturnJson };
      }
      arrPassengers.push(item);
    }
    var texthoten = this.hoten.split(' ');
    if (texthoten.length > 2) {
      let name = '';
      for (let j = 1; j < texthoten.length; j++) {
        if (j == 1) {
          name += texthoten[j];
        } else {
          name += ' ' + texthoten[j];
        }
      }
      this.ho = texthoten[0]; this.ten = name;
    } else if (texthoten.length > 1) {
      this.ho = texthoten[0]; this.ten = texthoten[1];
    }
    else if (texthoten.length == 1) {
      this.ho = texthoten[0]; this.ten = "";
    }

    var Contact = { FirstName: this.ten, LastName: this.ho, Email: this._email, MobileNumber: this.phone }
    var Passengers = { Passengers: arrPassengers, Contact: Contact, UserToken: '', NoteCorp: '' }
    this.objectFlight.FlightBooking.passengerModel = Passengers;
    //update thông tin
    this.objectFlight.HotelBooking.CName = this.hoten.trim();
    this.objectFlight.HotelBooking.CEmail = this._email;
    this.objectFlight.HotelBooking.CPhone = this.phone;

    this.objectFlight.HotelBooking.LeadingName = this.hoten.trim();
    this.objectFlight.HotelBooking.LeadingEmail = this._email
    this.objectFlight.HotelBooking.LeadingPhone = this.phone;

    this.objectFlight.HotelBooking.CTitle = "Ms";
    this.objectFlight.HotelBooking.LeadingNationality = 0;
    var search = { FlightBooking: this.objectFlight.FlightBooking, HotelBooking: this.objectFlight.HotelBooking, ResId: this.objectFlight.ResId };
    this.objectFlight.FlightBooking.adults = this.arradult;
    this.objectFlight.FlightBooking.childs = this.arrchild;
    this.gf.setParams(this.objectFlight, 'flightcombo');
    this.storage.set('infoPassengerscombo', { adult: this.arradult, child: this.arrchild });
    this.bookcombo.hoten = this.hoten;
    this.bookcombo.phone = this.phone;
    this.presentLoading();
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateComboBooking',
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded"
      },
      "data": $.param(search)
    }
    var se = this;
    $.ajax(settings).done(function (response) {
      if (response.Error) {
        if (se.loader) {
          se.loader.dismiss();
        }
        var error = {
          page: "flightcomboadddetails",
          func: "CreateComboBooking",
          message: response.Error,
          content: response.body,
          type: "warning",
          param: JSON.stringify(settings)
        };
        C.writeErrorLog(error, response);
        se.gf.showAlertMessageOnly("Rất tiếc giá vé máy bay đã thay đổi, vui lòng chọn lại");
        se.navCtrl.back();
      } else {
        //giữ chỗ vmb
        if (response.flyBookingCode) {
          se.Roomif.ischeckpaymentCard = true;
          se.bookcombo.bookingcode = response.Code;
          se.bookcombo.FlightCode = response.flyBookingCode;
          //check ALM room
          if (se.objectFlight.HotelBooking.SupplierName != "VINPEARL" && se.objectFlight.HotelBooking.SupplierName != "SERI" && se.objectFlight.HotelBooking.SupplierName != "HBED" && se.objectFlight.HotelBooking.SupplierName != "AGD") {
            if (se.objectFlight.HotelBooking.SupplierName == "B2B") {
               //truong hơp giữ chỗ đc mà phòng ko có AL thì k cho trả trước
               se.Roomif.payment = 'RQ';
               se.Roomif.ischeckpaymentCard = true;
               se.Roomif.ischeckpaymentLater = false;
               se.gf.holdflight(se.bookcombo.FlightCode, se.bookcombo.iddepart, se.bookcombo.idreturn).then(datafly => {
                 se.gf.createTransactionCombo(se.bookcombo.bookingcode, se.bookcombo.FlightCode, datafly.depcode, datafly.retcode).then(data => {
                   if (se.loader) {
                     se.loader.dismiss();
                   }
                   if (data) {
                     if(se.bizTravelService.isCompany){
                       let url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=2&source=app&amount=' + se.bookcombo.totalprice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + se.bookcombo.bookingcode + '&buyerPhone=' + se.phone + '&memberId=' + se.jti ;
                       se.gf.CreateUrl(url);
                     }

                     se.gf.createFlightTransactionCombo(se.bookcombo.FlightCode);
                     se.navCtrl.navigateForward('/flightcombopaymentdone/RQ');

                   } else {
                     alert('Gặp sự cố, vui lòng thử lại sau')
                   }
                 })
               })
               return;
            }
            
            var options = {
              method: 'GET',
              url: C.urls.baseUrl.urlContracting + '/api/toolsapi/CheckAllotment',
              qs:
              {
                token: '3b760e5dcf038878925b5613c32615ea3',
                hotelcode: se.booking.HotelId,
                roomcode: se.objectFlight.HotelBooking.RoomId,
                checkin: se.searchhotel.CheckInDate,
                checkout: se.searchhotel.CheckOutDate,
                totalroom: se.objectFlight.HotelBooking.TotalRoom
              },
              headers:
                {}
            };
            let headers = {};
          let strUrl = C.urls.baseUrl.urlContracting + `/api/toolsapi/CheckAllotment?token=3b760e5dcf038878925b5613c32615ea3&hotelcode=${se.booking.HotelId}&roomcode=${se.objectFlight.HotelBooking.RoomId}&checkin=${se.searchhotel.CheckInDate}&checkout=${se.searchhotel.CheckOutDate}&totalroom=${se.objectFlight.HotelBooking.TotalRoom}`;
          se.gf.RequestApi('GET', strUrl, headers, {}, 'flightComboAddDetails', 'CheckAllotment').then((data)=>{

              var rs = data;
              se.PriceAvgPlusTAStr = se.PriceAvgPlusTAStr.toLocaleString().replace(/\./g, '').replace(/\,/g, '');
              if (se.PriceAvgPlusTAStr > 0) {
                if (rs.Msg == "AL") {
                  let headers = {
                    "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                    'Content-Type': 'application/json; charset=utf-8'
                  };
                  let strUrl = C.urls.baseUrl.urlFlight + 'gate/apiv1/checkAllowPayment/' + se.bookcombo.FlightCode + '';
                  se.gf.RequestApi('GET', strUrl, headers, {}, 'flightComboAddDetails', 'checkAllowPayment').then((data)=>{
                    var jsonfly = data;
                    var blockPaymentCard = jsonfly.response.blockPaymentCard;
                    var blockPaymentLate = jsonfly.response.blockPaymentLate;
                    se.Roomif.payment = rs.Msg;
                    se.Roomif.ischeckpaymentCard = blockPaymentCard;
                    se.Roomif.ischeckpaymentLater = blockPaymentLate;
                    se.bookcombo.ischeckTransaction = false;
                    se.bookcombo.DepartATCode = "";
                    se.bookcombo.ReturnATCode = "";
                    if (se.loader) {
                      se.loader.dismiss();
                    }
                    se.navCtrl.navigateForward('/flightcombopayment');
                  });
                } else {
                  //truong hơp giữ chỗ đc mà phòng ko có AL thì k cho trả trước
                  se.Roomif.payment = rs.Msg;
                  se.Roomif.ischeckpaymentCard = true;
                  se.Roomif.ischeckpaymentLater = false;
                  se.gf.holdflight(se.bookcombo.FlightCode, se.bookcombo.iddepart, se.bookcombo.idreturn).then(datafly => {
                    se.gf.createTransactionCombo(se.bookcombo.bookingcode, se.bookcombo.FlightCode, datafly.depcode, datafly.retcode).then(data => {
                      if (se.loader) {
                        se.loader.dismiss();
                      }
                      if (data) {
                        if(se.bizTravelService.isCompany){
                          let url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=2&source=app&amount=' + se.bookcombo.totalprice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + se.bookcombo.bookingcode + '&buyerPhone=' + se.phone + '&memberId=' + se.jti ;
                          se.gf.CreateUrl(url);
                        }

                        se.gf.createFlightTransactionCombo(se.bookcombo.FlightCode);
                        se.navCtrl.navigateForward('/flightcombopaymentdone/RQ');

                      } else {
                        alert('Gặp sự cố, vui lòng thử lại sau')
                      }
                    })
                  })
                }
              } else {
                let headers = {};
                let strUrl = C.urls.baseUrl.urlContracting + '/api/toolsapi/UpdatePaymentMethod?HotelCode=' + se.bookcombo.bookingcode + '&paymentMethod=51';
                se.gf.RequestApi('POST', strUrl, headers, {}, 'flightComboAddDetails', 'UpdatePaymentMethod').then((data)=>{
                  let strUrl = C.urls.baseUrl.urlMobile + '/get-pnr-flight?reservationNo=' + se.bookcombo.FlightCode + '&cacheDepartId=' + se.bookcombo.iddepart + '&cacheReturnId=' + se.bookcombo.idreturn + '';
                  se.gf.RequestApi('GET', strUrl, {}, {}, 'flightComboAddDetails', 'UpdatePaymentMethod').then((data1)=>{
                    if (se.loader) {
                      se.loader.dismiss();
                    }
                    var obj = data1;
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
                    se.gf.createTransactionCombo(se.bookcombo.bookingcode, se.bookcombo.FlightCode, depcode, retcode).then(data => {
                      if (data) {
                        if(se.bizTravelService.isCompany){
                          let url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=2&source=app&amount=' + se.bookcombo.totalprice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + se.bookcombo.bookingcode + '&buyerPhone=' + se.phone + '&memberId=' + se.jti ;
                          se.gf.CreateUrl(url);
                        }
                        se.navCtrl.navigateForward('/flightcombodoneprepay/' + se.bookcombo.bookingcode + '/' + se.PriceAvgPlusTAStr + '/' + 1)
                      } else {
                        alert('Gặp sự cố, vui lòng thử lại')
                      }
                    })
                  });

                });
              }

            });
          }
          else {
            se.PriceAvgPlusTAStr = se.PriceAvgPlusTAStr.toLocaleString().replace(/\./g, '').replace(/\,/g, '');
            if (se.PriceAvgPlusTAStr > 0) {
              let headers = {
                "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                'Content-Type': 'application/json; charset=utf-8'
              };
              let strUrl = C.urls.baseUrl.urlFlight + 'gate/apiv1/checkAllowPayment/' + se.bookcombo.FlightCode + '';
              se.gf.RequestApi('GET', strUrl, headers, {}, 'flightComboAddDetails', 'checkAllowPayment').then((data1)=>{
                var jsonfly = data1;
                var blockPaymentCard = jsonfly.response.blockPaymentCard;
                var blockPaymentLate = jsonfly.response.blockPaymentLate;
                se.Roomif.payment = "AL";
                se.Roomif.ischeckpaymentCard = blockPaymentCard;
                se.Roomif.ischeckpaymentLater = blockPaymentLate;
                se.bookcombo.ischeckTransaction = false;
                se.bookcombo.DepartATCode = "";
                se.bookcombo.ReturnATCode = "";
                if (se.loader) {
                  se.loader.dismiss();
                }
                se.navCtrl.navigateForward('/flightcombopayment');
              });
            } else {
              let headers = {};
              let strUrl = C.urls.baseUrl.urlContracting + '/api/toolsapi/UpdatePaymentMethod?HotelCode=' + se.bookcombo.bookingcode + '&paymentMethod=51';
              se.gf.RequestApi('POST', strUrl, headers, {}, 'flightComboAddDetails', 'UpdatePaymentMethod').then((data)=>{
                let strUrl = C.urls.baseUrl.urlMobile + '/get-pnr-flight?reservationNo=' + se.bookcombo.FlightCode + '&cacheDepartId=' + se.bookcombo.iddepart + '&cacheReturnId=' + se.bookcombo.idreturn + '';
                se.gf.RequestApi('GET', strUrl, headers, {}, 'flightComboAddDetails', 'UpdatePaymentMethod').then((data1)=>{
                  if (se.loader) {
                    se.loader.dismiss();
                  }
                  var obj = data1;
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
                  se.gf.createTransactionCombo(se.bookcombo.bookingcode, se.bookcombo.FlightCode, depcode, retcode).then(data => {
                    if (data) {
                      if(se.bizTravelService.isCompany){
                        let url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=2&source=app&amount=' + se.bookcombo.totalprice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + se.bookcombo.bookingcode + '&buyerPhone=' + se.phone + '&memberId=' + se.jti ;
                        se.gf.CreateUrl(url);
                      }
                      se.navCtrl.navigateForward('/flightcombodoneprepay/' + se.bookcombo.bookingcode + '/' + se.PriceAvgPlusTAStr + '/' + 1)
                    } else {
                      alert('Gặp sự cố, vui lòng thử lại')
                    }
                  })
                });

              });
            }
          }
        }
        else {
          if (se.loader) {
            se.loader.dismiss();
          }
          se.gf.showAlertMessageOnly("Rất tiếc giá vé máy bay đã thay đổi, vui lòng chọn lại");
          se.navCtrl.back();
        }
      }
    })
  }

  itemrdmale(index, value) {
    if (value == 0) {
      this.arradult[index].Gender = 1;
    }
    else {
      this.arrchild[index].Gender = 1;
    }
  }
  itemrdfemale(index, value) {
    if (value == 0) {
      this.arradult[index].Gender = 2;
    }
    else {
      this.arrchild[index].Gender = 2;
    }
  }
  async presentToast1() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập đầy đủ họ tên liên hệ",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập đầy đủ họ tên hành khách",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async presentToastPhoneNull() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập số điện thoại",
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }
  async presentToastPhone() {
    let toast = await this.toastCtrl.create({
      message: "Số điện thoại phải 10 số",
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }
  async presentToastBirthDay() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập ngày sinh của trẻ em",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async presentToastGender() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng chọn quý danh",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      message: "Đang giữ vé máy bay với hãng hàng không, xin vui lòng không tắt ứng dụng!"
    });
    this.loader.present();
  }
  phonenumber(inputtxt) {
    var test1 = inputtxt.length;
    if (inputtxt) {
      if (test1 == 10) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
  textchangehoten() {
    this.zone.run(() => {
      this.arradult[0].hoten = this.hoten;
    })
  }
  next1() {
    this.navCtrl.navigateForward('/flightcombopaymentdone');
  }
  hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  async presentToastEmail() {
    let toast = await this.toastCtrl.create({
      message: "Thông tin email không hợp lệ. Vui lòng nhập lại.",
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }
  public async showConfirmEmail() {
    let alert = await this.alertCtrl.create({
      message: "Vui lòng cập nhật địa chỉ email để đảm bảo quý khách nhận được thông tin booking từ iVIVU!",
      cssClass: "cls-alert-showmore",
      buttons: [
        {
          text: 'Đổi email',
          role: 'OK',
          handler: () => {
            this.showChangeEmail();
          }
        }
      ]
    });
    alert.present();
  }

  async showChangeEmail() {
    var se = this;
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: ConfirmemailPage,
        componentProps: {
          aParameter: true,
        }
      });
    modal.present();

    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      if (data && data.data && data.data.email) {
        if (data.data.email) {
          se.storage.remove("email");
          se.storage.set("email", data.data.email);
          se.storage.set("saveemail", data.data.email);
          se._email = data.data.email;
          se.objectFlight.HotelBooking.CEmail = data.data.email;

          se.gonextstep();
        }
      }


    })
  }

  postapi() {
    this.presentLoading();
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateComboBooking',
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded"
      },
      "data": $.param(this.search)
    }
    var se = this;
    $.ajax(settings).done(function (response) {
      if (response.Error) {
        se.loader.dismiss();
        var error = {
          page: "flightcomboadddetails",
          func: "CreateComboBooking",
          message: response.Error,
          content: response.body,
          type: "warning",
          param: JSON.stringify(settings)
        };
        C.writeErrorLog(error, response);
        se.gf.showAlertMessageOnly("Rất tiếc giá vé máy bay đã thay đổi, vui lòng chọn lại");
        se.navCtrl.back();
      } else {
        //giữ chỗ vmb
        if (response.flyBookingCode) {
          se.Roomif.ischeckpaymentCard = true;
          se.bookcombo.bookingcode = response.Code;
          se.bookcombo.FlightCode = response.flyBookingCode;
          //check ALM room
          var options = {
            method: 'GET',
            url: C.urls.baseUrl.urlContracting + '/api/toolsapi/CheckAllotment',
            qs:
            {
              token: '3b760e5dcf038878925b5613c32615ea3',
              hotelcode: se.booking.HotelId,
              roomcode: se.objectFlight.HotelBooking.RoomId,
              checkin: se.searchhotel.CheckInDate,
              checkout: se.searchhotel.CheckOutDate,
              totalroom: se.objectFlight.HotelBooking.TotalRoom
            },
            headers:
              {}
          };
          let headers = {};
              let strUrl = C.urls.baseUrl.urlContracting + `/api/toolsapi/CheckAllotment?token=3b760e5dcf038878925b5613c32615ea3&hotelcode=${se.booking.HotelId}&roomcode=${se.objectFlight.HotelBooking.RoomId}&checkin=${se.searchhotel.CheckInDate}&checkout=${se.searchhotel.CheckOutDate}&totalroom=${se.objectFlight.HotelBooking.TotalRoom}`;
              se.gf.RequestApi('GET', strUrl, headers, {}, 'flightComboAddDetails', 'CheckAllotment').then((data)=>{

            var rs = data;
            se.PriceAvgPlusTAStr = se.PriceAvgPlusTAStr.toLocaleString().replace(/\./g, '').replace(/\,/g, '');
            if (se.PriceAvgPlusTAStr > 0) {
              if (rs.Msg == "AL") {
                //Check vmb cho trả trc hoặc sau
                var optionsfly = {
                  'method': 'GET',
                  'url': C.urls.baseUrl.urlFlight + 'gate/apiv1/checkAllowPayment/' + se.bookcombo.FlightCode + '',
                  'headers': {
                    "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                    'Content-Type': 'application/json; charset=utf-8'
                  }
                };
                let headers = {
                  "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                    'Content-Type': 'application/json; charset=utf-8'
                };
                let strUrl = C.urls.baseUrl.urlFlight + 'gate/apiv1/checkAllowPayment/' + se.bookcombo.FlightCode;
                se.gf.RequestApi('GET', strUrl, headers, {}, 'flightComboAddDetails', 'checkAllowPayment').then((data)=>{

                  var jsonfly = data;
                  var blockPaymentCard = jsonfly.response.blockPaymentCard;
                  var blockPaymentLate = jsonfly.response.blockPaymentLate;
                  se.Roomif.payment = rs.Msg;
                  se.Roomif.ischeckpaymentCard = blockPaymentCard;
                  se.Roomif.ischeckpaymentLater = blockPaymentLate;
                  se.bookcombo.ischeckTransaction = false;
                  se.bookcombo.DepartATCode = "";
                  se.bookcombo.ReturnATCode = "";
                  if (se.loader) {
                    se.loader.dismiss();
                  }
                  se.navCtrl.navigateForward('/flightcombopayment');
                });
              } else {
                //truong hơp giữ chỗ đc mà phòng ko có AL thì k cho trả trước
                se.Roomif.payment = rs.Msg;
                se.Roomif.ischeckpaymentCard = true;
                se.Roomif.ischeckpaymentLater = false;
                se.bookcombo.ischeckTransaction = false;
                se.bookcombo.DepartATCode = "";
                se.bookcombo.ReturnATCode = "";
                if (se.loader) {
                  se.loader.dismiss();
                }
                se.navCtrl.navigateForward('/flightcombopayment');
              }
            } else {
              let headers = {};
              let strUrl =  C.urls.baseUrl.urlContracting + '/api/toolsapi/UpdatePaymentMethod?HotelCode=' + se.bookcombo.bookingcode + '&paymentMethod=51';
              se.gf.RequestApi('POST', strUrl, headers, {}, 'flightComboAddDetails', 'UpdatePaymentMethod').then((data)=>{
                let headers = {};
                let strUrl = C.urls.baseUrl.urlMobile + '/get-pnr-flight?reservationNo=' + se.bookcombo.FlightCode + '&cacheDepartId=' + se.bookcombo.iddepart + '&cacheReturnId=' + se.bookcombo.idreturn;
                se.gf.RequestApi('GET', strUrl, headers, {}, 'flightComboAddDetails', 'UpdatePaymentMethod').then((data1)=>{
                  if (se.loader) {
                    se.loader.dismiss();
                  }
                  var obj = data1;
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
                  se.gf.createTransactionCombo(se.bookcombo.bookingcode, se.bookcombo.FlightCode, depcode, retcode).then(data => {
                    if (data) {
                      se.navCtrl.navigateForward('/flightcombodoneprepay/' + se.bookcombo.bookingcode + '/' + se.PriceAvgPlusTAStr + '/' + 1)
                    } else {
                      alert('Gặp sự cố, vui lòng thử lại')
                    }
                  })
                });

              });
            }

          });

        }
        else {
          if (se.loader) {
            se.loader.dismiss();
          }
          se.gf.showAlertMessageOnly("Rất tiếc giá vé máy bay đã thay đổi, vui lòng chọn lại");
          se.navCtrl.back();
        }
      }
    });
  }
  async selectAdultGender(item) {
    let actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-flightselectgender',
      mode: 'md',
      header: 'Danh xưng',
      buttons: [
        {
          text: "Anh",
          cssClass: item.genderdisplay == "Anh" ? 'text-bold' : '',
          handler: () => {
            item.genderdisplay = 'Anh';
            item.Gender = 1;
          }
        },
        {
          text: "Chị",
          cssClass: item.genderdisplay == "Chị" ? 'text-bold' : '',
          handler: () => {
            item.genderdisplay = 'Chị';
            item.Gender = 2;
          }
        }
      ],

    });

    actionSheet.present();
    actionSheet.onDidDismiss().then((data: OverlayEventDetail) => {
      this.checkInput(item, 1, true);
    })
  }
  async selectGender(item) {
    let actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-flightselectgender',
      mode: 'md',
      header: 'Danh xưng',
      buttons: [
        {
          text: "Bé trai",
          cssClass: item.genderdisplay == "Bé trai" ? 'text-bold' : '',
          handler: () => {
            item.genderdisplay = 'Bé trai';
            item.Gender = 1;
          }
        },
        {
          text: "Bé gái",
          cssClass: item.genderdisplay == "Bé gái" ? 'text-bold' : '',
          handler: () => {
            item.genderdisplay = 'Bé gái';
            item.Gender = 2;
          }
        }
      ],

    });

    actionSheet.present();
    actionSheet.onDidDismiss().then((data: OverlayEventDetail) => {
      this.checkInput(item, 1, false);
    })
  }
  showComboDetail() {
    var se = this; console.log(se);
    if (this.showLuggage) {
      this.bookcombo.Luggage = this.PriceAvgPlusTA - this.PriceAvgPlusTAOld
    }
    else {
      this.bookcombo.Luggage = 0;
    }
    se.navCtrl.navigateForward("/flightcombopaymentbreakdown");
  }
  async openLotusPointSave(itemAdult) {
    var se = this;
    se.bookcombo.airlineMemberCode = itemAdult.airlineMemberCode;
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: FlightpointsavePage
      });
    modal.present();

    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      if (data && data.data && data.data.code) {
        itemAdult.airlineMemberCode = data.data.code;
      }
    })
  }

  /**
           * @param inputcheck đối tượng check
           * @param type: 1 - giới tính; 2 - name;
           * @param isadult: true - là người lớn
           */

  checkInput(inputcheck, type, isadult) {
    var se = this;
    if (isadult) {
      if (type == 1) {

        if (!inputcheck.genderdisplay && !inputcheck.hoten) {
          inputcheck.errorInfo = true;
          inputcheck.textErrorInfo = "Vui lòng nhập thông tin Người lớn " + (inputcheck.iddisplay);
          return;
        } else {
          inputcheck.errorInfo = false;
          inputcheck.textErrorInfo = "";
        }

        if (!inputcheck.genderdisplay) {
          inputcheck.errorGender = !inputcheck.errorGender;
          inputcheck.errorTextGender = "Vui lòng nhập danh xưng Người lớn " + (inputcheck.iddisplay);
          return;
        } else {

          inputcheck.errorGender = false;
          inputcheck.errorTextGender = "";

          inputcheck.errorInfo = false;
          inputcheck.errorTextInfo = "";
        }
      }

      if (type == 2) {
        if (!inputcheck.hoten) {
          inputcheck.errorName = !inputcheck.errorName;
          inputcheck.errorTextName = "Vui lòng nhập họ tên Người lớn " + (inputcheck.iddisplay);
          return;
        }

        else if (inputcheck.hoten) {
          var checktext = se.hasWhiteSpace(inputcheck.hoten.trim());
          if (!checktext || !se.validateNameNotContainNumber(inputcheck.hoten.trim()) || !se.validateNameNotContainExceptionChar(inputcheck.hoten.trim())) {
            inputcheck.errorName = !inputcheck.errorName;
            inputcheck.errorTextName = "Họ và tên Người lớn " + (inputcheck.iddisplay) + " không hợp lệ. Vui lòng kiểm tra lại!";
            return;
          }
          else {
            inputcheck.errorName = false;
            inputcheck.errorTextName = "";

            inputcheck.errorInfo = false;
            inputcheck.errorTextInfo = "";
          }
          se.checkValidSubName(inputcheck.hoten).then((datacheck) => {
            if (!datacheck) {
              inputcheck.errorSubName = true;
              inputcheck.errorTextSubName = "Không nằm trong danh sách họ phổ biến. Vui lòng kiểm tra lại!";
            } else {
              inputcheck.errorSubName = false;
              inputcheck.errorTextSubName = "";
            }
          })
        }
      }
    }
    else {
      if (type == 1) {
        if (!inputcheck.genderdisplay && !inputcheck.hoten) {
          inputcheck.errorInfo = true;
          inputcheck.textErrorInfo = "Vui lòng nhập thông tin "+(inputcheck.isChild ? (inputcheck.PassengerType==1 ?  'Trẻ em ': 'Trẻ sơ sinh '): 'Người lớn ')+" " + (inputcheck.iddisplay);
          return;
        } else {
          inputcheck.errorInfo = false;
          inputcheck.textErrorInfo = "";
        }

        if (!inputcheck.genderdisplay) {
          inputcheck.errorGender = !inputcheck.errorGender;
          inputcheck.errorTextGender = "Vui lòng nhập danh xưng "+(inputcheck.isChild ? (inputcheck.PassengerType==1 ?  'Trẻ em ': 'Trẻ sơ sinh '): 'Người lớn ')+"";
          return;
        } else {
          inputcheck.errorGender = false;
          inputcheck.errorTextGender = "";
        }
      }

      if (type == 2) {
        if (!inputcheck.hoten) {
          inputcheck.errorName = !inputcheck.errorName;
          inputcheck.errorTextName = "Vui lòng nhập họ tên "+(inputcheck.isChild ? (inputcheck.PassengerType==1 ?  'Trẻ em ': 'Trẻ sơ sinh '): 'Người lớn ')+"";
          return;
        }

        else if (inputcheck.hoten) {
          var checktext = se.hasWhiteSpace(inputcheck.hoten.trim());
          if (!checktext || !se.validateNameNotContainNumber(inputcheck.hoten.trim()) || !se.validateNameNotContainExceptionChar(inputcheck.hoten.trim())) {
            inputcheck.errorName = !inputcheck.errorName;
            inputcheck.errorTextName = "Họ và tên "+(inputcheck.isChild ? (inputcheck.PassengerType==1 ?  'Trẻ em ': 'Trẻ sơ sinh '): 'Người lớn ')+" không hợp lệ. Vui lòng kiểm tra lại!";
            return;
          }
          else {
            inputcheck.errorName = false;
            inputcheck.errorTextName = "";

            inputcheck.errorInfo = false;
            inputcheck.errorTextInfo = "";
          }

          se.checkValidSubName(inputcheck.hoten).then((datacheck) => {
            if (!datacheck) {
              inputcheck.errorSubName = true;
              inputcheck.errorTextSubName = "Không nằm trong danh sách họ phổ biến. Vui lòng kiểm tra lại!";
            } else {
              inputcheck.errorSubName = false;
              inputcheck.errorTextSubName = "";
            }
          })
        }
      }

      if (type == 3) {
        if (!inputcheck.BirthDay) {
          inputcheck.errorDateofbirth = true;
          inputcheck.errorTextBirthday = "Vui lòng nhập ngày sinh Trẻ em";
          return;
        }
        else {
          inputcheck.errorDateofbirth = false;
          inputcheck.errorTextBirthday = "";
        }
        if (inputcheck.BirthDay) {
          let departdate = moment(this.searchhotel.CheckOutDate).format('YYYY-MM-DD');
          let departdatestring = moment(this.searchhotel.CheckOutDate).format('DD-MM-YYYY');
          inputcheck.birdayDisplay = moment(inputcheck.BirthDay).format('DD/MM/YYYY');
          if (moment(departdate).diff(moment(inputcheck.BirthDay), 'days') < 14) {
            if (inputcheck.PassengerType == 1) {
              inputcheck.errorTextBirthday = "Vui lòng nhập ngày sinh Trẻ em lớn hơn hoặc bằng 2 tuổi so với ngày về " + departdatestring;
            }
            else if (inputcheck.PassengerType == 2) {
              inputcheck.errorTextBirthday = "Vui lòng nhập ngày sinh Trẻ sơ sinh lớn hơn 14 ngày tuổi so với ngày về " + departdatestring;
            }
            inputcheck.errorBirthday = true;
            inputcheck.errorBirthday1 = true;
            return;
          }
          else {
            inputcheck.errorBirthday = false;
            inputcheck.errorBirthday1 = false;
            inputcheck.errorTextBirthday = "";
          }

          //Check độ tuổi trẻ em <12
          if (inputcheck.PassengerType == 1) {
            if (moment(departdate).diff(moment(inputcheck.BirthDay), 'months') >= 144) {
              inputcheck.errorBirthday = true;
              inputcheck.errorBirthday1 = true;
              inputcheck.errorTextBirthday = "Vui lòng nhập ngày sinh Trẻ em không được lớn hơn 12 tuổi so với ngày về " + departdatestring;
              return;
            }
            else {
              inputcheck.errorBirthday = false;
              inputcheck.errorBirthday1 = false;
              inputcheck.errorTextBirthday = "";
            }
            if (moment(departdate).diff(moment(inputcheck.BirthDay), 'months') < 24) {
              inputcheck.errorBirthday = true;
              inputcheck.errorBirthday1 = true;
              inputcheck.errorTextBirthday = "Vui lòng nhập ngày sinh Trẻ em không được nhỏ hơn 2 tuổi so với ngày về " + departdatestring;
              return;
            }
            else {
              inputcheck.errorBirthday = false;
              inputcheck.errorBirthday1 = false;
              inputcheck.errorTextBirthday = "";
            }
          }

          if (inputcheck.PassengerType == 2) {
            //Check độ tuổi trẻ sơ sinh <2
            if (moment(departdate).diff(moment(inputcheck.BirthDay), 'months') >= 24) {
              inputcheck.errorBirthday = true;
              inputcheck.errorBirthday1 = true;
              inputcheck.errorTextBirthday = "Vui lòng nhập ngày sinh Trẻ sơ sinh không được lớn hơn 2 tuổi so với ngày về " + departdatestring;
              return;
            }
            else {
              inputcheck.errorBirthday = false;
              inputcheck.errorBirthday1 = false;
              inputcheck.errorTextBirthday = "";
            }
          }

          //se.childbirthdayctrl.dismiss();
        }
      }

    }

  }
  validateNameNotContainNumber(name) {
    var re = /^([^0-9]*)$/;
    return re.test(String(name).toLowerCase())
  }

  validateNameNotContainExceptionChar(name) {
    let re = /^(?:[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0523\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0621-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971\u0972\u097B-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D3D\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC\u0EDD\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8B\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10D0-\u10FA\u10FC\u1100-\u1159\u115F-\u11A2\u11A8-\u11F9\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u1676\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19A9\u19C1-\u19C7\u1A00-\u1A16\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u2094\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2C6F\u2C71-\u2C7D\u2C80-\u2CE4\u2D00-\u2D25\u2D30-\u2D65\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31B7\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FC3\uA000-\uA48C\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA65F\uA662-\uA66E\uA67F-\uA697\uA717-\uA71F\uA722-\uA788\uA78B\uA78C\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA90A-\uA925\uA930-\uA946\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAC00-\uD7A3\uF900-\uFA2D\uFA30-\uFA6A\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1E\uDF30-\uDF4A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F\uDD00-\uDD15\uDD20-\uDD39\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33]|\uD808[\uDC00-\uDF6E]|\uD809[\uDC00-\uDC62]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|[\uD840-\uD868][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6]|\uD87E[\uDC00-\uDE1D])(?:[\$0-9A-Z_a-z\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0523\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0621-\u065E\u0660-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0901-\u0939\u093C-\u094D\u0950-\u0954\u0958-\u0963\u0966-\u096F\u0971\u0972\u097B-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC\u0EDD\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F8B\u0F90-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u1099\u10A0-\u10C5\u10D0-\u10FA\u10FC\u1100-\u1159\u115F-\u11A2\u11A8-\u11F9\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u1676\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17B3\u17B6-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19A9\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BAA\u1BAE-\u1BB9\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1D00-\u1DE6\u1DFE-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u2094\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2C6F\u2C71-\u2C7D\u2C80-\u2CE4\u2D00-\u2D25\u2D30-\u2D65\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31B7\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FC3\uA000-\uA48C\uA500-\uA60C\uA610-\uA62B\uA640-\uA65F\uA662-\uA66F\uA67C\uA67D\uA67F-\uA697\uA717-\uA71F\uA722-\uA788\uA78B\uA78C\uA7FB-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA900-\uA92D\uA930-\uA953\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAC00-\uD7A3\uF900-\uFA2D\uFA30-\uFA6A\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1E\uDF30-\uDF4A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F\uDD00-\uDD15\uDD20-\uDD39\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F]|\uD808[\uDC00-\uDF6E]|\uD809[\uDC00-\uDC62]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|[\uD840-\uD868][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF])*$/
    let str = name.toLowerCase().replace(/\ /g, '');
    return re.test(String(str));
  }

  checkDuplicateItem(listpax): Promise<any> {
    var se = this, res = false;
    return new Promise((resolve, reject) => {
      resolve(se.getArrayDuplicate(listpax));
    })
  }

  getArrayDuplicate(listpax): Promise<any> {
    let arrres:any = [];
    return new Promise((resolve, reject) => {
      for (let index = 0; index < listpax.length; index++) {
        const element = listpax[index];
        let itemdup = listpax.filter((i, indexp) => i.hoten.trimEnd().trimStart().toLowerCase() == element.hoten.trimEnd().trimStart().toLowerCase() && i.indexp != index);
        if (itemdup && itemdup.length > 1) {
          let arrdup = listpax.filter((i) => i.hoten.trimEnd().trimStart().toLowerCase() == itemdup[0].hoten.trimEnd().trimStart().toLowerCase());
          if (arrres.length == 0) {
            arrres.push({ list: [...arrdup] });
          } else {
            let checkvalid = true;
            for (let index = 0; index < arrres.length; index++) {
              const element = arrres[index];
              if (this.checkExistsItemInArray(element.list, arrdup[0])) {
                checkvalid = false;
              }
            }
            if (checkvalid) {
              arrres.push({ list: [...arrdup] });
            }

          }
        }
      }
      resolve(arrres);
    })
  }

  checkValidName(listpax): Promise<any> {
    var se = this, res = false, arrItem = [];
    return new Promise((resolve, reject) => {
      for (let index = 0; index < listpax.length; index++) {
        const element = listpax[index];
        let iteminvalid = listpax.filter((item) => { return item.hoten.trimEnd().trimStart().split(' ').length < 3 });
        if (iteminvalid && iteminvalid.length > 0) {
          resolve(iteminvalid);
        }
      }

      resolve(res);
    })
  }

  checkValidSubName(subname): Promise<any> {
    var se = this, res = false;
    return new Promise((resolve, reject) => {
      let iteminvalid = se.gf.getListSubName().filter((sn) => { return ((sn.value.indexOf(subname.split(' ')[0].toLowerCase()) != -1) || (sn.rawValue.indexOf(subname.split(' ')[0].toLowerCase()) != -1)) })
      if (iteminvalid && iteminvalid.length > 0) {
        resolve(iteminvalid[0])
      }
      resolve(res);
    })
  }

  


  checkInputUserInfo(type) {
    var se = this;
    se.hasinput = true;
    if (type == 1) {
      if (!se.hoten || !se.validateNameNotContainNumber(se.hoten) || !se.hasWhiteSpace(se.hoten) || !se.validateNameNotContainExceptionChar(se.hoten)) {
        se.hoteninvalid = true;
      } else {
        se.hoteninvalid = false;
      }

      se.checkValidSubName(se.hoten).then((check) => {
        if (!check) {
          se.subnameinvalid = true;
        }
        else {
          se.subnameinvalid = false;
        }
      })
    }
    if (type == 2) {
      if (se.gf.checkPhoneInValidFormat(se.phone)) {
        se.sodienthoaiinvalid = true;
      } else {
        se.sodienthoaiinvalid = false;
      }
    }
    if (type == 3) {
      let strcheck = se._email;
      if (se._email.indexOf('@') != -1) {
        strcheck = se._email.split('@')[1];
      }

      if (se.gf.checkEmailInvalidFormat(strcheck) || !se.validateEmail(se._email) || !se.gf.checkUnicodeCharactor(se._email)) {
        se.emailinvalid = true;
      } else {
        se.emailinvalid = false;
      }
    }
  }

  async showAlertDuplicateName() {
    var se = this;
    var arrdup = this.searchhotel.duplicateItem;
    let strmsg = '';
    arrdup.forEach(element => {
      for (let index = 0; index < element.list.length; index++) {
        const itemlist = element.list[index];
        if (index == 0) {
          strmsg += 'Tên ' + (itemlist.isChild ? (itemlist.PassengerType == 1 ? 'Trẻ em ' : 'Trẻ sơ sinh ') : 'Người lớn ') + itemlist.iddisplay + ' và ';
        } else {
          strmsg += (itemlist.isChild ? (itemlist.PassengerType == 1 ? 'Trẻ em ' : 'Trẻ sơ sinh ') : 'Người lớn ') + itemlist.iddisplay + (index < element.list.length - 1 ? ' và ' : '');
        }
      }
      strmsg += " <span class='cls-error'>" + element.list[0].hoten + '</span> trùng nhau.';
    });
    strmsg += ' Có khả năng quý khách đã nhập nhầm.</br>Nếu quý khách đã nhập đúng họ tên, vui lòng tiếp tục thanh toán.'
    let alert = await this.alertCtrl.create({
      header: 'Tên hành khách trùng nhau',
      message: strmsg,
      cssClass: "cls-alert-duplicatename",
      backdropDismiss: false,
      buttons: [
        {
          text: 'Thanh toán',
          role: 'OK',
          cssClass: 'button-payment',
          handler: () => {
            alert.dismiss();
            se.activeStep = 2;
          }

        },
        {
          text: 'Nhập lại họ tên',
          role: 'Cancel',
          cssClass: 'button-reinput',
          handler: () => {
            se.searchhotel.duplicateName = null;
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  async showAlertInvalidName(iteminvalid) {
    var se = this;
    let strmsg = '';
    if (iteminvalid.length < 2) {
      let element = iteminvalid[0];
      strmsg = 'Tên ' + (element.isChild ? (element.PassengerType == 1 ? 'Trẻ em ' : 'Trẻ sơ sinh ') : 'Người lớn ') + element.iddisplay + " <span class='cls-error'>" + element.hoten + '</span> chỉ có 2 chữ. Có khả năng quý khách đã nhập thiếu tên đệm.</br>Nếu quý khách đã nhập đúng họ tên, vui lòng tiếp tục thanh toán.';
    } else {
      for (let index = 0; index < iteminvalid.length; index++) {
        const element = iteminvalid[index];
        strmsg += 'Tên ' + (element.isChild ? (element.PassengerType == 1 ? 'Trẻ em ' : 'Trẻ sơ sinh ') : 'Người lớn ') + element.iddisplay + " <span class='cls-error'>" + element.hoten + '</span>' + (index < iteminvalid.length - 1 ? ', ' : ' ')
      }
      strmsg += " chỉ có 2 chữ. Có khả năng quý khách đã nhập thiếu tên đệm.</br>Nếu quý khách đã nhập đúng họ tên, vui lòng tiếp tục thanh toán."
    }
    let alert = await this.alertCtrl.create({
      header: 'Họ tên hành khách chỉ có 2 chữ',
      message: strmsg,
      cssClass: "cls-alert-duplicatename",
      backdropDismiss: false,
      buttons: [
        {
          text: 'Thanh toán',
          role: 'OK',
          cssClass: 'button-payment',
          handler: () => {
            alert.dismiss();
            se.activeStep = 2;
          }

        },
        {
          text: 'Nhập lại họ tên',
          role: 'Cancel',
          cssClass: 'button-reinput',
          handler: () => {
            se.searchhotel.duplicateName = null;
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  async showAlertInvalidFirstName(iteminvalid) {
    var se = this;
    let strmsg = 'Tên ' + (iteminvalid.isChild ? (iteminvalid.PassengerType == 1 ? 'Trẻ em ' : 'Trẻ sơ sinh ') : 'Người lớn ') + iteminvalid.iddisplay + " <span class='cls-error'>" + iteminvalid.name + '</span> chỉ có 2 chữ. Có khả năng quý khách đã nhập thiếu tên đệm.</br>Nếu quý khách đã nhập đúng họ tên, vui lòng tiếp tục thanh toán.'
    let alert = await this.alertCtrl.create({
      header: 'Họ tên hành khách chỉ có 2 chữ',
      message: strmsg,
      cssClass: "cls-alert-duplicatename",
      backdropDismiss: false,
      buttons: [
        {
          text: 'Thanh toán',
          role: 'OK',
          cssClass: 'button-payment',
          handler: () => {
            alert.dismiss();
            se.activeStep = 2;
          }

        },
        {
          text: 'Nhập lại họ tên',
          role: 'Cancel',
          cssClass: 'button-reinput',
          handler: () => {
            se.searchhotel.duplicateName = null;
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  checkInValidSubNameBeforeNextStep(listpax): Promise<any> {
    var se = this, res = false;
    return new Promise((resolve, reject) => {
      listpax.filter((itempax) => {
        let itemValueInvalid = se.gf.getListSubName().filter((sn) => { return sn.value.indexOf(itempax.hoten.split(' ')[0].toLowerCase()) != -1 });
        let itemRawValueInvalid = se.gf.getListSubName().filter((sn) => { return sn.rawValue.indexOf(itempax.hoten.split(' ')[0].toLowerCase()) != -1 });
        if (itemValueInvalid.length == 0 && itemRawValueInvalid.length == 0) {
          res = itempax;
        }
      })
      resolve(res);
    })
  }

  async showAlertInvalidSubName(iteminvalid) {
    var se = this;
    let strmsg = 'Họ của ' + (iteminvalid.isChild ? (!iteminvalid.isInfant ? 'Trẻ em ' : 'Em bé ') : 'Người lớn ') + iteminvalid.id + " <span class='cls-error'>" + iteminvalid.hoten + '</span> không nằm trong danh sách họ phổ biến. Có khả năng quý khách đã nhập sai.</br>Nếu quý khách đã nhập đúng họ tên, vui lòng tiếp tục thanh toán.';
    let alert = await this.alertCtrl.create({
      header: 'Họ không nằm trong danh sách họ phổ biến',
      message: strmsg,
      cssClass: "cls-alert-duplicatename",
      backdropDismiss: false,
      buttons: [
        {
          text: 'Thanh toán',
          role: 'OK',
          cssClass: 'button-payment',
          handler: () => {
            alert.dismiss();
            se.activeStep = 2;
          }

        },
        {
          text: 'Nhập lại họ tên',
          role: 'Cancel',
          cssClass: 'button-reinput',
          handler: () => {
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  checkExistsItemInArray(arrays: any, item: any) {
    var res = false;
    res = arrays.some(r => r.hoten == item.hoten);
    return res;
  }

  checkValidFirstNameAndSubName(listpax): Promise<any> {
    var se = this, res = false, arrItem = [];
    return new Promise((resolve, reject) => {
      for (let index = 0; index < listpax.length; index++) {
        const element = listpax[index];
        let iteminvalid = listpax.filter((item) => { return item.hoten.trim().split(' ').length >= 5 });
        if (iteminvalid && iteminvalid.length > 0) {
          resolve(iteminvalid);
        }
      }

      resolve(res);
    })
  }

  checkValidDuplicateFirstNameAndSubName(listpax): Promise<any> {
    var se = this, res = false, arrItem = [];
    return new Promise((resolve, reject) => {
      for (let index = 0; index < listpax.length; index++) {
        const element = listpax[index];
        let arrname = se.gf.convertFontVNI(element.hoten).trim().split(' ');
        if (arrname && arrname.length > 1) {
          let samename = arrname.filter((v, i, a) => a.findIndex(t => (t === v)) !== i);
          if (samename && samename.length > 0) {
            resolve(element);
          }
        }
      }

      resolve(res);
    })
  }

  async showAlertInvalidFirtNameAndLastName(item) {
    var se = this;
    let strmsg = '';
    if (item.length < 2) {
      let element = item[0];
      strmsg += 'Tên ' + (element.isChild ? (element.PassengerType == 1 ? 'Trẻ em ' : 'Trẻ sơ sinh ') : 'Người lớn ');
      strmsg += " <span class='cls-error'>" + element.hoten + '</span>';
    } else {
      for (let index = 0; index < item.length; index++) {
        const element = item[index];
        strmsg += 'Tên ' + (element.isChild ? (element.PassengerType == 1 ? 'Trẻ em ' : 'Trẻ sơ sinh ') : 'Người lớn ') + " <span class='cls-error'>" + element.hoten + '</span>' + (index < item.length - 1 ? ', ' : ' ')
      }
    }
    strmsg += " chứa nhiều hơn 4 chữ cái. Có khả năng quý khách đã nhập nhầm.</br>Nếu quý khách đã nhập đúng họ tên, vui lòng tiếp tục thanh toán."
    let alert = await this.alertCtrl.create({
      header: 'Tên nhiều hơn 4 chữ cái',
      message: strmsg,
      cssClass: "cls-alert-duplicatename",
      backdropDismiss: false,
      buttons: [
        {
          text: 'Thanh toán',
          role: 'OK',
          cssClass: 'button-payment',
          handler: () => {
            alert.dismiss();
            se.activeStep = 2;
          }

        },
        {
          text: 'Nhập lại họ tên',
          role: 'Cancel',
          cssClass: 'button-reinput',
          handler: () => {
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  async showAlertDuplicateFirtNameAndLastName(item) {
    var se = this;
    let strmsg = '';
    strmsg += 'Tên ' + (item.isChild ? (item.PassengerType == 1 ? 'Trẻ em ' : 'Trẻ sơ sinh ') : 'Người lớn ');
    strmsg += " <span class='cls-error'>" + item.hoten + '</span> chứa nhiều hơn 1 chữ cái trùng nhau.';
    strmsg += ' Có khả năng quý khách đã nhập nhầm.</br>Nếu quý khách đã nhập đúng họ tên, vui lòng tiếp tục thanh toán.'
    let alert = await this.alertCtrl.create({
      header: 'Chữ cái trùng nhau',
      message: strmsg,
      cssClass: "cls-alert-duplicatename",
      backdropDismiss: false,
      buttons: [
        {
          text: 'Thanh toán',
          role: 'OK',
          cssClass: 'button-payment',
          handler: () => {
            alert.dismiss();
            se.activeStep = 2;
          }

        },
        {
          text: 'Nhập lại họ tên',
          role: 'Cancel',
          cssClass: 'button-reinput',
          handler: () => {
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }
  showNameMail(ev) {
    this.ishideNameMail = ev.detail.checked;
  }
  async presentToastOrder() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập thông tin xuất hóa đơn",
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }


  inputFocus(item, event){
    var se = this;
    
    if(!se.inputtext){
      if(item && !item.hidePaxHint){
        if(se.listPaxSuggestByMemberId && se.listPaxSuggestByMemberId.length >0){
          se.inputtext = true;
          se.updateHintPaxName(item, se.gf.convertFontVNI(event.target.value), se.listPaxSuggestByMemberId);
        }
      }
      else if(!se.hidepaxhint&& se.activeStep ==2)
      {
        if(se.listPaxSuggestByMemberId && se.listPaxSuggestByMemberId.length >0){
          se.inputtext = true;
          se.updateHintPaxNameStep2(item, se.gf.convertFontVNI(event.target.value), se.listPaxSuggestByMemberId);
        }
      }     
    }else if(event && se.listPaxSuggestByMemberId && se.listPaxSuggestByMemberId.length >0){
      if(se.activeStep ==1){
          if(event.target.value){
            se.checkInput(item, 2, !item.isChild);
          }
          se.inputtext = true;
          se.updateHintPaxName(item, se.gf.convertFontVNI(event.target.value), se.listPaxSuggestByMemberId);
        }else{
          se.inputtext = true;
          se.updateHintPaxNameStep2(item, se.gf.convertFontVNI(event.target.value), se.listPaxSuggestByMemberId);
        }
        
      }
  }

 

  inputLostFocus(item, isadult){
    var se = this;
      setTimeout(()=>{
        se.inputtext = false;
        if(se.activeStep == 1){
          se.checkInput(item, 2, isadult);
        }else{
          se.checkInputUserInfo(1);
        }
        
        if(se.hidepaxhint){
          if(item){
            item.hidePaxHint = true;
          }
          se.hidepaxhint = false;
        }
      }, 400)
    
  }

  async createHintPaxName(item, listpaxhint){
    var se = this;
    let arraypax:any =[];
    if(item){
      se.currentSelectPax = item;

      for (let index = 0; index < listpaxhint.length; index++) {
        const element = listpaxhint[index];
        if(!item.isChild && !element.isChild){
          if(item && !item.genderdisplay || (item && item.Gender && item.Gender == element.gender) ){
            arraypax.push(element);
          }
        }
        else if(item.isChild && element.isChild){
          if(item && !item.genderdisplay || (item && item.Gender && item.Gender == element.gender) ){
            arraypax.push(element);
          }
        }
      }
    }
   
    se.listpaxhint = [...arraypax];
  }

  async createHintPaxNameStep2(item, listpaxhint){
    var se = this;
    let arraypax:any =[];
      for (let index = 0; index < listpaxhint.length; index++) {
        const element = listpaxhint[index];
        if(!element.isChild){
          arraypax.push(element);
        }
      }
   
    se.listpaxhint = [...arraypax];
  }

  updateHintPaxName(item, value, listpaxhint){
    var se = this;
    let arraypax:any =[];
      se.listpaxhint = [];
      if(item){
        se.currentSelectPax = item;
      
        for (let index = 0; index < listpaxhint.length; index++) {
          const element = listpaxhint[index];
          if(!item.isChild && !element.isChild && value && element.fullName && se.gf.convertFontVNI(element.fullName).toLowerCase().indexOf(se.gf.convertFontVNI(value).toLowerCase()) != -1 ){
            if(!item.genderdisplay || (item.Gender && item.Gender == element.gender) ){
              arraypax.push(element);
            }
          }

          else if(item.isChild && element.isChild && value && element.fullName && se.gf.convertFontVNI(element.fullName).toLowerCase().indexOf(se.gf.convertFontVNI(value).toLowerCase()) != -1 ){
            if(!item.genderdisplay || (item.Gender && item.Gender == element.gender) ){
              arraypax.push(element);
            }
          }
        }
      }
     
      se.listpaxhint = [...arraypax];
  }

  updateHintPaxNameStep2(item, value, listpaxhint){
    var se = this;
    let arraypax:any =[];
      for (let index = 0; index < listpaxhint.length; index++) {
        const element = listpaxhint[index];
        if(value && element.fullName && se.gf.convertFontVNI(element.fullName).toLowerCase().indexOf(value.toLowerCase()) != -1){
          arraypax.push(element);
        }
      }
   
    se.listpaxhint = [...arraypax];
  }

  selectPaxHint(paxhint){
    var se = this;
    if(paxhint){
      if(se.currentSelectPax && se.activeStep == 1){
        se.currentSelectPax.hoten = paxhint.fullName ? paxhint.fullName :se.currentSelectPax.hoten;
        se.currentSelectPax.phone = paxhint.phoneNumber ? paxhint.phoneNumber : se.currentSelectPax.phone;
        if(!se.currentSelectPax.isChild){
          se.currentSelectPax.genderdisplay = paxhint.gender == 1 ? 'Anh' : 'Chị';
          se.currentSelectPax.Gender = paxhint.gender;
        }else{
          se.currentSelectPax.genderdisplay = paxhint.gender ==1? 'Bé trai' : 'Bé gái';
          se.currentSelectPax.Gender = paxhint.gender ? paxhint.gender : 1;
        }
        
        if(paxhint.dateOfBirth){
          se.currentSelectPax.BirthDay = paxhint.dateOfBirth;
          se.currentSelectPax.birdayDisplay = moment(paxhint.dateOfBirth).format('DD/MM/YYYY');
          se.currentSelectPax.errorDateofbirth = false;
          se.currentSelectPax.textErrorDateofbirth = '';
        }
        se.showLotusPoint && paxhint.airlineMemberCode ? paxhint.airlineMemberCode : "";
        se.currentSelectPax.byPassCheckRegularName = true;
        se.currentSelectPax.errorName = false;
        se.currentSelectPax.errorGender = false;
        se.currentSelectPax.errorInfo = false;
        se.currentSelectPax.errorTextName = '';
        se.currentSelectPax.errorTextGender = '';
        se.currentSelectPax.errorTextSubName = '';
        se.currentSelectPax.textErrorInfo ='';
        se.currentSelectPax.birdayDisplay = '';

      }
      else{
        se.hoten = paxhint.fullName ? paxhint.fullName :se.hoten;
        se.phone = paxhint.phoneNumber ? paxhint.phoneNumber : se.phone;
      }
      
    }
  }
  hidePaxHint(){
    this.hidepaxhint = true;
  }

  editPaxInfo(item, idx){
    var se = this;
    se.zone.run(()=>{
      if(item && idx == 1){
          item.genderdisplay = '';
          item.hoten = '';
          item.airlineMemberCode = '';
          item.errorName = false;
          item.errorInfo = true;
          item.BirthDay = '';
          item.birdayDisplay = '';
          item.textErrorInfo = "Vui lòng nhập thông tin Người lớn " +item.id;
          
      }
      else if(item && idx == 2){
          item.genderdisplay = '';
          item.hoten = '';
          item.BirthDay = '';
          item.birdayDisplay = '';
          item.airlineMemberCode = '';
          item.errorName = false;
          item.errorInfo = true;
          item.textErrorInfo = "Vui lòng nhập thông tin "+ (!item.isinfant ? "Trẻ em" : "Em bé")+" "+ item.iddisplay;

      }
    })
    
  }

  inputOnFocus(item, type){
          var se = this;
          if(se.activeStep == 2 && se.hasinput){
            se.hasinput = false;
          }
          se.clearError(item, type);
          if((type ==2 && !item.hoten) || (type == 9 && !se.hoten)){

            if(se.listPaxSuggestByMemberId && se.listPaxSuggestByMemberId.length >0){
              se.inputtext = true;
              if(type ==2){
                  se.createHintPaxName(item, se.listPaxSuggestByMemberId);
                }else{
                  se.createHintPaxNameStep2(item, se.listPaxSuggestByMemberId);
                }
              
            }else{
              se.storage.get('listpaxcache').then((data)=>{
                    if(data){
                        se.inputtext = true;
                        se.createHintPaxName(item, se.listPaxSuggestByMemberId);
                    }
                  })
            }
          }
        }

  clearError(item, typeInput){
    var se = this;
    if(typeInput == 1)//gender
    {
        item.errorGender = false;
        item.errorTextGender ='';
        
    }

    if(typeInput == 2)//name
    {
        item.errorName = false;
        item.errorSubName = false;
        item.errorTextName ='';
        item.errorTextSubName = '';

         item.errorInfo = false;
        item.textErrorInfo = '';
    }

    if(typeInput == 3)//dob
    {
        item.errorDateofbirth = false;
        item.errorTextBirthday = '';
    }


    if(typeInput == 9)//name contact
    {
        se.hoteninvalid = false;
        se.subnameinvalid = false;
    }
    if(typeInput == 10)//name contact
    {
        se.sodienthoaiinvalid = false;
    }
    if(typeInput == 11)//name contact
    {
        se.emailinvalid = false;
    }
  }

  async selectDateOfBirth(pax, isChangeBOD){
    let se = this;
    if(!se.allowClickDateOfBirth){
      return;
    }
    se.allowClickDateOfBirth = false;
    se.activityService.itemPax = pax;
    se.activityService.itemPax.isChangeBODCombo = isChangeBOD;
      let modal = await se.modalCtrl.create({
        component: SelectDateOfBirthPage,
        cssClass: 'cls-flight-adddetails-selectdatetime'
      });
      
      modal.present().then(()=>{
        se.allowClickDateOfBirth = true;
      });

      const event: any = await modal.onDidDismiss();
      const rs = event.data;
      if(rs){
        se.zone.run(()=>{
          pax = rs.itempushback;
        })
        
      }
  }
}