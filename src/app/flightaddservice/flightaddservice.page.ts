import { Component, OnInit, ViewChild, HostListener, NgZone, Input } from '@angular/core';
import { NavController, ModalController, ToastController, ActionSheetController, AlertController } from '@ionic/angular';
import { ActivityService, GlobalFunction } from '../providers/globalfunction';
import * as $ from 'jquery';
import { C } from './../providers/constants';
import { OverlayEventDetail } from '@ionic/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { ValueGlobal, SearchHotel } from '../providers/book-service';
import { flightService } from './../providers/flightService';
import { FlightpricedetailPage } from './../flightpricedetail/flightpricedetail.page';
import { FlightquickbackPage } from '../flightquickback/flightquickback.page';
import { CustomAnimations } from '../providers/CustomAnimations';
import { DomSanitizer } from '@angular/platform-browser';
import { voucherService } from '../providers/voucherService';
import { AdddiscountPage } from '../adddiscount/adddiscount.page';
import { HTMLIonOverlayElement } from '@ionic/core';
import { FlightInfoInternationalPage } from '../flightinternational/flightinfointernationnal/flightinfointernational.page';
import { InAppBrowserOptions, InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { FlightdetailPage } from '../flightdetail/flightdetail.page';
import { SelectDateOfBirthPage } from '../selectdateofbirth/selectdateofbirth.page';

@Component({
  selector: 'app-flightaddservice',
  templateUrl: './flightaddservice.page.html',
  styleUrls: ['./flightaddservice.page.scss'],
})
export class FlightaddservicePage implements OnInit {
  departdisplay: any;
  returndisplay: any;
  departtimedisplay: any;
  returntimedisplay: any;
  departFlight: any;
  returnFlight: any;
  departtime_depart: string;
  landingtime_depart: string;
  departtime_return: string;
  landingtime_return: string;
  departlocationdisplay: string;
  returnlocationdisplay: string;
  hasdepartluggage: boolean = false;
  hasreturnluggage: boolean = false;
  showbuttonluggage: boolean = true;
  departLuggage: any = [];
  returnLuggage: any = [];
  listdepartseatselected: any = "";
  listreturnseatselected: any = "";
  adult: any;
  child: any;
  totalPriceDisplay: any;
  allowchoiceseat = false;
  roundtrip: any = true;
  departCondition: any;
  chkchangeflight = true;
  returnCondition: any;
  departConditionInfo: any;
  returnConditionInfo: any;
  hadchoiceluggage = false;
  hasdepartseat: boolean = false;
  hasreturnseat: boolean = false;
  checkseat: boolean = false;
  options: any;
  jti: any;
  ischeckVN=true;
  itemsFlightCityHotel: any=[];
  itemsFlightCityHotelDetail: any=[];
  loader: any;
  hoteldetaildata: any;
  listDiChung: any = "";
  isDiChung=false;
  loadHotelCityDone: boolean = false;
  ischeck = false;
  discountpromo=0; msg;textpromotion = "Nhập mã giảm giá";
  promocode="";
  ischecktext = 3; ischeckerror = 0; 
  promotionCode="";
  alert: any;
  isCathay: any;
  priceCathay: any;
  departTcheckCaThay;
  isExtenal: any;
  itemVoucher: any;
  checkEmptyHotelCity: boolean;
  listVouchersApply=[];
  strPromoCode: string = '';
  totaldiscountpromo = 0;
  isApiDirect=false;
  departCodeDisplay= '';
  returnCodeDisplay='';
  _inAppBrowser: any;
  departDateDisplay: string;
  returnDateDisplay: string;
  allowClickDateOfBirth: any=true;
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
    private sanitizer: DomSanitizer,
    public _voucherService: voucherService,
    private iab: InAppBrowser,
    public activityService: ActivityService) {
    this.checkseat = false;
    if (this._flightService.itemFlightCache) {
      this.roundtrip = this._flightService.itemFlightCache.roundTrip;
      this.adult = this._flightService.itemFlightCache.adult;
      this.child = this._flightService.itemFlightCache.child * 1 + (this._flightService.itemFlightCache.infant ? this._flightService.itemFlightCache.infant : 0) * 1;

      this.isApiDirect = this._flightService.itemFlightCache.isApiDirect;
      this.loadHotelCityDone = true;
      if(this._flightService.itemFlightCache.isApiDirect){
        
        this.departdisplay = this._flightService.objSearch.departCity;
        this.returndisplay = this._flightService.objSearch.returnCity;
        
        this.departCodeDisplay = this._flightService.objSearch.departCode;
        this.returnCodeDisplay = this._flightService.objSearch.arrivalCode;
      }else{
        this.departdisplay = this._flightService.itemFlightCache.departCity;
        this.returndisplay = this._flightService.itemFlightCache.returnCity;
      }
      this.departFlight = this._flightService.itemFlightCache.departFlight;
      this.returnFlight = this._flightService.itemFlightCache.returnFlight;

      
      if (this.departFlight) {
        this.departtime_depart = moment(this.departFlight.departTime).format("HH:mm");
        this.landingtime_depart = moment(this.departFlight.landingTime).format("HH:mm");
        this.departlocationdisplay = this._flightService.itemFlightCache.departCode + " · " + this.departFlight.flightTimeDetailDisplay + " · " + this._flightService.itemFlightCache.returnCode;

      }
      if (this.returnFlight) {
        this.departtime_return = moment(this.returnFlight.departTime).format("HH:mm");
        this.landingtime_return = moment(this.returnFlight.landingTime).format("HH:mm");
        this.returnlocationdisplay = this._flightService.itemFlightCache.returnCode + " · " + this.returnFlight.flightTimeDetailDisplay + " · " + this._flightService.itemFlightCache.departCode;

      }
      this.departDateDisplay = this.gf.getDayOfWeek(this._flightService.itemFlightCache.checkInDate).dayname + ", " + moment(this._flightService.itemFlightCache.checkInDate).format("DD") + " tháng " +moment(this._flightService.itemFlightCache.checkInDate).format("MM");
      if(this.returnFlight){
        this.returnDateDisplay = this.gf.getDayOfWeek(this._flightService.itemFlightCache.checkOutDate).dayname + ", " + moment(this._flightService.itemFlightCache.checkOutDate).format("DD")+ " tháng " +moment(this._flightService.itemFlightCache.checkOutDate).format("MM");
      }

      this.isExtenal=_flightService.itemFlightCache.isExtenal;
      //pdanh 11-05-2023
      //Thêm code sửa lỗi lazyload hotelcity lần đầu tiên
      
      if(_flightService.itemFlightCache.dataBooking && !_flightService.itemFlightCache.dataBooking.hotelIds){
        this.zone.run(()=>{
          this.loadHotelCityDone = true;
        })
      }
      this._flightService.itemFlightCache.priceCathay= 0;
      //get price cathay
      this.getpriceCathay();
      this.getCheckAirportDiChung();
      if (this.departFlight && this.departFlight.ticketCondition) {
        this.departConditionInfo = this.departFlight.ticketCondition;
      }
      else {
        this.getDetailTicket(this.departFlight).then((data) => {
          if (data.ticketCondition) {
            this.departConditionInfo = data.ticketCondition;
          }
        })
      }
      if (this.returnFlight && this.returnFlight.ticketCondition) {
        this.returnConditionInfo = this.returnFlight.ticketCondition;
      }
      else if (this.returnFlight) {
        this.getDetailTicket(this.returnFlight).then((data) => {
          if (data.ticketCondition) {
            this.returnConditionInfo = data.ticketCondition;
          }
        })
      }

      this.checkLuggage();

      if (this._flightService.itemFlightCache.listdepartseatselected) {
        this.listdepartseatselected = this._flightService.itemFlightCache.listdepartseatselected;
      }

      if (this._flightService.itemFlightCache.listreturnseatselected) {
        this.listreturnseatselected = this._flightService.itemFlightCache.listreturnseatselected;
      }
      if (this._flightService.itemFlightCache.DICHUNGParam) {
        this.listDiChung = this._flightService.itemFlightCache.DICHUNGParam;
      }

      this.totalPriceAll(0);
      if (!(this._flightService.itemFlightCache.jsonSeats && ((this._flightService.itemFlightCache.jsonSeats.departSeats && this._flightService.itemFlightCache.jsonSeats.departSeats.length > 0) || (this._flightService.itemFlightCache.jsonSeats.returnSeats && this._flightService.itemFlightCache.jsonSeats.returnSeats.length > 0)))) {
        this.getSeatMap(this._flightService.itemFlightCache.reservationId);
      } else {
        this.allowchoiceseat = true;
      }
      //Chưa chọn hành lý
      if (this._flightService.objSearch.roundTrip && !this._flightService.itemFlightCache.hasChoiceLuggage) {
        if ((this._flightService.itemFlightCache.departFlight && this._flightService.itemFlightCache.departFlight.airLineLuggage.length == 0
          && this._flightService.itemFlightCache.returnFlight && this._flightService.itemFlightCache.returnFlight.airLineLuggage.length == 0)
          || ((!this._flightService.itemFlightCache.departLuggage || (this._flightService.itemFlightCache.departLuggage && this._flightService.itemFlightCache.departLuggage.length == 0))
            && (!this._flightService.itemFlightCache.returnLuggage || (this._flightService.itemFlightCache.returnLuggage && this._flightService.itemFlightCache.returnLuggage.length == 0)))) {
          if (this._flightService.itemFlightCache.departFlight && this._flightService.itemFlightCache.departFlight.airlineCode == "BambooAirways") {
            this.getLuggage(this._flightService.itemFlightCache.reservationId, "BB", true).then((check) => {
              if (check) {
                this.callCheckLuggage();
              }
            })
          }
          else if (this._flightService.itemFlightCache.returnFlight && this._flightService.itemFlightCache.returnFlight.airlineCode == "BambooAirways") {
            this.getLuggage(this._flightService.itemFlightCache.reservationId, "BB", false).then((check) => {
              if (check) {
                this.callCheckLuggage();
              }
            })
          }

          if (this._flightService.itemFlightCache.departFlight && this._flightService.itemFlightCache.departFlight.airlineCode == "VietJetAir") {
            this.getLuggage(this._flightService.itemFlightCache.reservationId, "VJ", true).then((check) => {
              if (check) {
                this.callCheckLuggage();
              }
            })
          }

          else if (this._flightService.itemFlightCache.returnFlight && this._flightService.itemFlightCache.returnFlight.airlineCode == "VietJetAir") {
            this.getLuggage(this._flightService.itemFlightCache.reservationId, "VJ", false).then((check) => {
              if (check) {
                if (this.returnLuggage && this.returnLuggage.length > 0 && this.checkLuggageZeroAmount(this.returnLuggage)) {
                  setTimeout(() => {
                    //set default hành lý không đồng
                    let itemdefault = this.checkLuggageZeroAmount(this.returnLuggage);
                    itemdefault.quantity = (this._flightService.itemFlightCache.adult * 1 + this._flightService.itemFlightCache.child * 1);//set theo số pax
                    this._flightService.itemFlightCache.hasChoiceLuggage = true;
                    this.showbuttonluggage = true;
                    this.checkLuggageZero(2);
                  }, 350)
                }
              }
            })
          }
          // thêm VNA
          if (this._flightService.itemFlightCache.departFlight && this._flightService.itemFlightCache.departFlight.airlineCode == "VietnamAirlines") {
            this.ischeckVN=false;
            this.getLuggage(this._flightService.itemFlightCache.reservationId, "VN", true).then((check) => {
              if (check) {
                this.callCheckLuggage();
              }
            })
          }
          if (this._flightService.itemFlightCache.returnFlight && this._flightService.itemFlightCache.returnFlight.airlineCode == "VietnamAirlines") {
            this.ischeckVN=false;
            if (this._flightService.itemFlightCache.departFlight && this._flightService.itemFlightCache.departFlight.airlineCode != "VietnamAirlines") {
              this.getLuggage(this._flightService.itemFlightCache.reservationId, "VN", false).then((check) => {
               
                if (check) {
                  this.callCheckLuggage();
                }
              })
            }
            else {
              this.getLuggageVN(this._flightService.itemFlightCache.reservationId, "VN", false).then((check) => {
                if (check) {
                  this.callCheckLuggage();
                }
              })
            }

          }
          //tạm thời chưa lấy dc VNA && jetstar
          // if(this._flightService.itemFlightCache.departFlight.airlineCode == "VietnamAirlines" || this._flightService.itemFlightCache.departFlight.airlineCode == "JetStar"){
          //     this.showbuttonluggage = true;
          //     this.checkLuggage();
          // }
        }
      } else {
        if (this._flightService.itemFlightCache.departFlight && this._flightService.itemFlightCache.departFlight.airLineLuggage.length == 0 && this._flightService.itemFlightCache.departLuggage && this._flightService.itemFlightCache.departLuggage.length == 0) {
          if (this._flightService.itemFlightCache.departFlight && this._flightService.itemFlightCache.departFlight.airlineCode == "BambooAirways") {
            this.getLuggage(this._flightService.itemFlightCache.reservationId, "BB", true);
          }
          else if (this._flightService.itemFlightCache.departFlight && this._flightService.itemFlightCache.departFlight.airlineCode == "VietJetAir") {
            this.getLuggage(this._flightService.itemFlightCache.reservationId, "VJ", true).then((check) => {
              if (check) {
                this.callCheckLuggage();
              }
            })
          }
          // thêm VNA
          else if (this._flightService.itemFlightCache.departFlight && this._flightService.itemFlightCache.departFlight.airlineCode == "VietnamAirlines") {
            this.getLuggage(this._flightService.itemFlightCache.reservationId, "VN", true);
          }
        }
        //Có chọn hành lý chiều đi hoặc chiều về
        else if (this._flightService.itemFlightCache.hasChoiceLuggage && ((this._flightService.itemFlightCache.departLuggage && this._flightService.itemFlightCache.departLuggage.length > 0) || (this._flightService.itemFlightCache.returnLuggage && this._flightService.itemFlightCache.returnLuggage.length > 0))) {
          this.showbuttonluggage = !this._flightService.itemFlightCache.hasChoiceLuggage;
        }
      }
    }

    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
      }
    })

    if(this.isApiDirect){
        this.getSummaryBooking(this._flightService.itemFlightCache.resNo);
    }
  }

getSummaryBooking(resNo) {
    var se = this;
   
      let urlPath = C.urls.baseUrl.urlFlight + "gate/apiv1/SummaryBooking/"+resNo+"?"+new Date().getTime()+"&stepBooking=service";
          let headers = {
            "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            'Content-Type': 'application/json; charset=utf-8'
          };
          this.gf.RequestApi('GET', urlPath, headers, {}, 'flightSearchResult', 'getHotelCity').then((dataBooking)=>{

        if (dataBooking) {
          if(dataBooking && dataBooking.allowRequestCheckinOnline){
            se._flightService.itemFlightCache.allowCheckinOnline = dataBooking.allowRequestCheckinOnline.allowCheckin;
            se._flightService.itemFlightCache.textCheckinOnline = dataBooking.allowRequestCheckinOnline.note;
          }else{
            se._flightService.itemFlightCache.allowCheckinOnline = false;
            se._flightService.itemFlightCache.textCheckinOnline = dataBooking.allowRequestCheckinOnline && dataBooking.allowRequestCheckinOnline.note ? dataBooking.allowRequestCheckinOnline.note : '';
          }
        }
      })
   
  }

  ngOnInit() {
    this._flightService.itemFlightLuggagePriceChange.subscribe((data) => {
      if (data) {
        this._flightService.itemFlightCache.hasChoiceLuggage = true;
        this.totalPriceAll(0);
      }
    })

    this._flightService.itemFlightSeatPriceChange.subscribe((data) => {
      if (data) {
        this.totalPriceAll(0);
      }
    })
   
    this._flightService.itemFlightReChoiceSeat.subscribe((data) => {
      if (data) {
        this.allowchoiceseat = false;
        this.checkseat = true;
        this.clearSeatChoice();
        this.getSeatMap(this._flightService.itemFlightCache.reservationId);
      }
    })

    this._flightService.itemResetCheckSeat.subscribe((data) => {
      if (data) {
        this.checkseat = false;
      }
    })
    this._flightService.itemTranferChange.subscribe((data) => {
      if (data) {
        
        this.totalPriceAll(0);
      }
    })

    this._flightService.itemCheckHotelCity.subscribe((data)=>{
      if(data){
        this.loadHotelCity(data);
      }else{
        //pdanh 11-05-2023
        //Thêm code zone.run sửa lỗi lazyload hotelcity lần đầu tiên
        this.zone.run(()=>{
          this.loadHotelCityDone = true;
        })
        
      }
        
    })

    this._flightService.itemHotelCityChange.subscribe((data)=>{
      if(data){
        this.checkChangeRoom(data);
      }
    })

    this._flightService.itemHotelCityAddHotel.subscribe((item:any)=>{
      if(item.value){
        this.clearOtherSelectedItem(item.id).then((check)=>{
          if(check){
            if(this.checkEmptyHotelCity && this._flightService.itemFlightCache.pnr && this._flightService.itemFlightCache.pnr.resNo && this._flightService.itemFlightCache.itemsFlightCityHotel && this._flightService.itemFlightCache.itemsFlightCityHotel.length >0)
            {
              this.checkEmptyHotelCity = false;
            }
            this.AddHotelCity(item.id);
          }
        })
        
      }else{
        if(this._flightService.itemFlightCache.objHotelCitySelected && item.id ==  this._flightService.itemFlightCache.objHotelCitySelected.HotelId && !item.value){
          this._flightService.itemFlightCache.objHotelCitySelected = null;
        }
        if(this._flightService.itemFlightCache.pnr && this._flightService.itemFlightCache.pnr.resNo && this._flightService.itemFlightCache.itemsFlightCityHotel && this._flightService.itemFlightCache.itemsFlightCityHotel.length >0)
        {
          this.checkEmptyHotelCity = true;
        }
        this.totalPriceAll(0);
      }
    })

    
    this._flightService.itemHotelCityChangeRoom.subscribe((data)=>{
      if(data){
        this._flightService.itemFlightCache.objHotelCitySelected = null;
        this.zone.run(()=>{
          this._flightService.itemFlightCache.itemsFlightCityHotel.forEach(element => {
            element.checkaddhotel = false;
          });
        })
          
        this.totalPriceAll(0);
      }
  })

  this._voucherService.getVoucherUsedObservable().subscribe(async (itemVoucher)=> {
    if(itemVoucher){
      this.showAlertVoucherUsed();
    }
  })
  
  this._voucherService.getObservable().subscribe((itemVoucher)=> {
    if(itemVoucher){
      if(this.promocode && this.promocode != itemVoucher.code && !this.itemVoucher){
        this._voucherService.rollbackSelectedVoucher.emit(itemVoucher);
        this.gf.showAlertMessageOnly(`Chỉ hỗ trợ áp dụng nhiều voucher tiền mặt trên một đơn hàng, Coupon và Voucher khuyến mãi chỉ áp dụng một`);
        return;
      }

      this.zone.run(()=>{
        if(itemVoucher.claimed){
          this.itemVoucher = itemVoucher;
          this.promocode = itemVoucher.code;
          this.promotionCode = itemVoucher.code;
          this.discountpromo = itemVoucher.rewardsItem.price;
          
         this.buildStringPromoCode();
          
        }else{
          this.itemVoucher = null;
          this.promocode = "";
          this.promotionCode = "";
          this.discountpromo = 0;
         
          this.buildStringPromoCode();

          if(this._voucherService.voucherSelected && this._voucherService.voucherSelected.length ==0 && this._voucherService.listPromoCode && this._voucherService.listPromoCode.length ==0){
            this.strPromoCode = '';
            this.totaldiscountpromo = 0;
          }
        }
        this.totalPriceAll(0);
      })
     
    }
  })

  this._voucherService.getObservableClearVoucherAfterPaymentDone().subscribe((check)=> {
    if(check){
      this.itemVoucher = null;
      this.promocode = "";
      this.promotionCode = "";
      this.discountpromo = 0;
      
      this._flightService.itemFlightCache.hasvoucher = false;
      this.strPromoCode = '';
      this.totaldiscountpromo =0;
          this._flightService.itemFlightCache.listVouchersAlreadyApply = [];
          this._voucherService.totalDiscountPromoCode =0;
          this._voucherService.listPromoCode =[];
          this._voucherService.voucherSelected = [];
          this._voucherService.flightPromoCode = "";
          this._voucherService.flightTotalDiscount=0;
      this.totalPriceAll(0);
    }
  })
    
  }

  clearSeatChoice() {
    this.listdepartseatselected = '';
    this.listreturnseatselected = '';
    this._flightService.itemFlightCache.departSeatChoice = [];
    this._flightService.itemFlightCache.returnSeatChoice = [];
    this._flightService.itemFlightCache.listdepartseatselected = '';
    this._flightService.itemFlightCache.listreturnseatselected = '';
    this._flightService.itemFlightCache.departSeatChoiceAmout = 0;
    this._flightService.itemFlightCache.returnSeatChoiceAmout = 0;
    this._flightService.itemFlightCache.listSeatNormal.forEach(element => {
      if(element.itemsLeft && element.itemsLeft.length >0){
        element.itemsLeft.forEach(elementLeft => {
          if(elementLeft.booked){
            elementLeft.booked = false;
          } 
        });
      }
      if(element.elementRight && element.elementRight.length >0){
        element.itemsRight.forEach(elementRight => {
          if(elementRight.booked){
            elementRight.booked = false;
          } 
        });
      }
    });
    this.totalPriceAll(0);
  }

  checkLuggageZeroAmount(list) {
    let items = list.filter((item) => { return item.amount == 0 && item.weight > 0 });
    return items && items.length > 0 ? items[0] : false;
  }

  checkLuggageZero(type) {
    //check nếu load ancilary
    if (type == 1 && this._flightService.itemFlightCache.departLuggage && this._flightService.itemFlightCache.departLuggage.length > 0) {
      this.departLuggage = this._flightService.itemFlightCache.departLuggage;
      let chocieDepartLuggage = this.departLuggage.filter(element => {
        return element.quantity;
      });
      if (chocieDepartLuggage && chocieDepartLuggage.length > 0) {
        this.zone.run(() => {
          this.hasdepartluggage = true;
          this.showbuttonluggage = false;
        })
      } else {
        this.zone.run(() => {
          this.hasdepartluggage = false;
          this.showbuttonluggage = true;
        })
      }
    }
    else if (type == 2 && this._flightService.itemFlightCache.returnLuggage && this._flightService.itemFlightCache.returnLuggage.length > 0) {
      this.returnLuggage = this._flightService.itemFlightCache.returnLuggage;
      let chocieReturnLuggage = this.returnLuggage.filter(element => {
        return element.quantity;
      });
      if (chocieReturnLuggage && chocieReturnLuggage.length > 0) {
        this.zone.run(() => {
          this.hasreturnluggage = true;
          this.showbuttonluggage = false;
        })
      } else {
        this.zone.run(() => {
          this.hasreturnluggage = false;
          this.showbuttonluggage = true;
        })
      }
    }
  }

  callCheckLuggage() {
    if (this.departLuggage && this.departLuggage.length > 0 && this.checkLuggageZeroAmount(this.departLuggage)) {
      setTimeout(() => {
        //set default hành lý không đồng
        let itemdefault = this.checkLuggageZeroAmount(this.departLuggage);
        itemdefault.quantity = (this._flightService.itemFlightCache.adult * 1 + this._flightService.itemFlightCache.child * 1);//set theo số pax
        this._flightService.itemFlightCache.hasChoiceLuggage = true;
        this.showbuttonluggage = true;
        this.checkLuggageZero(1);
      }, 350)

    }

    if (this.returnLuggage && this.returnLuggage.length > 0 && this.checkLuggageZeroAmount(this.returnLuggage)) {
      setTimeout(() => {
        //set default hành lý không đồng
        let itemdefault = this.checkLuggageZeroAmount(this.returnLuggage);
        itemdefault.quantity = (this._flightService.itemFlightCache.adult * 1 + this._flightService.itemFlightCache.child * 1);//set theo số pax
        this._flightService.itemFlightCache.hasChoiceLuggage = true;
        this.showbuttonluggage = true;
        this.checkLuggageZero(2);
      }, 350)

    }
  }

  checkLuggage() {
    let chocieDepartLuggage:any = [], chocieReturnLuggage:any = [];
    if(this._flightService.itemFlightCache.adults && this._flightService.itemFlightCache.adults.length >0){
      let _a = this._flightService.itemFlightCache.adults.map(a => a.itemLug);
      _a.forEach(element => {
        if(element){
          chocieDepartLuggage.push(element);
        }
      });
      let _c = this._flightService.itemFlightCache.childs.map(a => a.itemLug);
      _c.forEach(elementC => {
        if(elementC){
          chocieDepartLuggage.push(elementC);
        }
      });

      let _ar = this._flightService.itemFlightCache.adults.map(a => a.itemLugReturn);
      _ar.forEach(element => {
        if(element){
          chocieReturnLuggage.push(element);
        }
      });
      let _cr = this._flightService.itemFlightCache.childs.map(a => a.itemLugReturn);
      _cr.forEach(elementC => {
        if(elementC){
          chocieReturnLuggage.push(elementC);
        }
      });
      
      setTimeout(()=>{
        this.zone.run(()=>{
          this.departLuggage = chocieDepartLuggage;
          this.returnLuggage = chocieReturnLuggage;
          if(chocieDepartLuggage && chocieDepartLuggage.length>0){
              
                  this.hasdepartluggage = true;
                  this.showbuttonluggage = false;
              
          }
          else  if(chocieReturnLuggage && chocieReturnLuggage.length>0){
                  this.hasreturnluggage = true;
                  this.showbuttonluggage = false;
          }
          else{
                  this.hasdepartluggage = false;
                  this.showbuttonluggage = true;
          }
        })
      },50)
    }
      
      
  }

  getLuggage(id, code, isdepart): Promise<any> {
    var se = this;
    return new Promise((resolve, reject) => {
      let headers = {
        "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
        'Content-Type': 'application/json; charset=utf-8',
      };
      let strUrl = C.urls.baseUrl.urlFlight + "gate/apiv1/ancillaryOptions?token=3b760e5dcf038878925b5613c32615ea3&reservationId=" + id + "&airline=" + code;
      this.gf.RequestApi('GET', strUrl, headers, {}, 'flightAddDetails', 'getDetailTicket').then((data)=>{

        if (data) {
          let jsondata = data;
          se.zone.run(() => {
            if (isdepart) {
              if (jsondata.baggage && jsondata.baggage && jsondata.baggage.length > 0 && se._flightService.itemFlightCache.departFlight) {
                se._flightService.itemFlightCache.departLuggage = jsondata.baggage.length > 0 ? jsondata.baggage : [];
                se.departLuggage = se._flightService.itemFlightCache.departLuggage;
              }
              if (jsondata.baggageReturn && jsondata.baggageReturn.length > 0 && se._flightService.itemFlightCache.returnFlight) {
                se._flightService.itemFlightCache.returnLuggage = jsondata.baggageReturn.length > 0 ? jsondata.baggageReturn : [];
                se.returnLuggage = se._flightService.itemFlightCache.returnLuggage;
              }
           
            
            } else {
              if (jsondata.baggage && jsondata.baggage && jsondata.baggage.length > 0 && se._flightService.itemFlightCache.returnFlight) {
                se._flightService.itemFlightCache.returnLuggage = jsondata.baggage.length > 0 ? jsondata.baggage : [];
                se.returnLuggage = se._flightService.itemFlightCache.returnLuggage;
              }
             
            }
            if (code=='VN') {
              se.ischeckVN=true;
            }
            se.showbuttonluggage = true;
            resolve(true);
          })

        } else {
          if (code=='VN') {
            se.ischeckVN=true;
          }
          resolve(false);
        }
      })
    })
  }
  getLuggageVN(id, code, isdepart): Promise<any> {
    var se = this;
    return new Promise((resolve, reject) => {
      let headers = {
        "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
        'Content-Type': 'application/json; charset=utf-8',
      };
      let strUrl = C.urls.baseUrl.urlFlight + "gate/apiv1/ancillaryOptions?token=3b760e5dcf038878925b5613c32615ea3&reservationId=" + id + "&airline=" + code + "&type=return";
      this.gf.RequestApi('GET', strUrl, headers, {}, 'flightAddDetails', 'getLuggageVN').then((data)=>{

        if (data) {
          let jsondata = data;
          se.zone.run(() => {
            if (isdepart) {
              if (jsondata.baggage && jsondata.baggage && jsondata.baggage.length > 0 && se._flightService.itemFlightCache.departFlight) {
                se._flightService.itemFlightCache.departLuggage = jsondata.baggage.length > 0 ? jsondata.baggage : [];
                se.departLuggage = se._flightService.itemFlightCache.departLuggage;
              }
              if (jsondata.baggageReturn && jsondata.baggageReturn.length > 0 && se._flightService.itemFlightCache.returnFlight) {
                se._flightService.itemFlightCache.returnLuggage = jsondata.baggageReturn.length > 0 ? jsondata.baggageReturn : [];
                se.returnLuggage = se._flightService.itemFlightCache.returnLuggage;
              }
            } else {
              if (jsondata.baggage && jsondata.baggage && jsondata.baggage.length > 0 && se._flightService.itemFlightCache.returnFlight) {
                se._flightService.itemFlightCache.returnLuggage = jsondata.baggage.length > 0 ? jsondata.baggage : [];
                se.returnLuggage = se._flightService.itemFlightCache.returnLuggage;
              }
             
            }
            if (code=='VN') {
              se.ischeckVN=true;
            }
            se.showbuttonluggage = true;
            resolve(true);
          })

        } else {
          if (code=='VN') {
            se.ischeckVN=true;
          }
          resolve(false);
        }
      })
    })
  }

  totalPriceAll(mealtype) {
    this.zone.run(() => {

      this.checkLuggage();

      let totalprice: any = this._flightService.itemFlightCache.departFlight.totalPrice + (this._flightService.itemFlightCache.returnFlight ? this._flightService.itemFlightCache.returnFlight.totalPrice : 0);
      let departluggageprice = 0, returnluggageprice = 0;
      departluggageprice = this._flightService.itemFlightCache.adults.reduce((total,a)=>{ return total + (a.itemLug ? (a.itemLug.amount) : 0); }, 0);
      departluggageprice += this._flightService.itemFlightCache.childs.reduce((total,c)=>{ return total + (c.itemLug ? (c.itemLug.amount) : 0); }, 0);
      if(this.returnLuggage && this.returnLuggage.length >0){
        returnluggageprice += this._flightService.itemFlightCache.adults.reduce((total,a)=>{ return total + (a.itemLugReturn ? (a.itemLugReturn.amount) : 0); }, 0);
        returnluggageprice += this._flightService.itemFlightCache.childs.reduce((total,c)=>{ return total + (c.itemLugReturn ? (c.itemLugReturn.amount) : 0); }, 0);
      }
      if (departluggageprice > 0) {
        this.hasdepartluggage = true;
        this.showbuttonluggage = false;
        totalprice += departluggageprice;
      }

      if (returnluggageprice > 0) {
        this.hasreturnluggage = true;
        this.showbuttonluggage = false;
        totalprice += returnluggageprice;
      }

      if (this._flightService.itemFlightCache.departSeatChoiceAmout) {
        totalprice += this._flightService.itemFlightCache.departSeatChoiceAmout;

      }

      if (this._flightService.itemFlightCache.returnSeatChoiceAmout) {
        totalprice += this._flightService.itemFlightCache.returnSeatChoiceAmout;
      }
      //Add hotelcity price
      if(mealtype){
        totalprice+= mealtype.PriceAvgPlusOTA;
      }else if(this._flightService.itemFlightCache.HotelCityMealtypeSelected && this._flightService.itemFlightCache.itemsFlightCityHotel.length >0){
        //check lại xem có mealtype nào đang chọn không
        let check = false;
        for (let index = 0; index < this._flightService.itemFlightCache.itemsFlightCityHotel.length; index++) {
          const element = this._flightService.itemFlightCache.itemsFlightCityHotel[index];
          if(element.checkaddhotel){
            check = true;
          }
          
        }
        if(check){
          totalprice+= this._flightService.itemFlightCache.HotelCityMealtypeSelected.PriceAvgPlusOTA;
        }
      }
      if (this._flightService.itemFlightCache.DICHUNGParam) {
        totalprice += this._flightService.itemFlightCache.DICHUNGParam.TotalPriceGo;
        totalprice += this._flightService.itemFlightCache.DICHUNGParam.TotalPriceReturn;
      }

      if((this._voucherService.voucherSelected && this._voucherService.voucherSelected.length >0) || (this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0)){
        if(this._voucherService.voucherSelected && this._voucherService.voucherSelected.length >0){
          let totaldiscount = this._voucherService.voucherSelected.map(item => item.rewardsItem).reduce((total,b)=>{ return total + b.price; }, 0);
          totalprice = totalprice - totaldiscount;
        }
        if(this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0){
          totalprice = totalprice - this._voucherService.totalDiscountPromoCode;
        }
      }else if(this.promotionCode && this.discountpromo>0){
        totalprice= totalprice-this.discountpromo;
      }

      if(this.isCathay){
        totalprice=totalprice+this.priceCathay;
      }

      if((this._voucherService.voucherSelected && this._voucherService.voucherSelected.length >0) || (this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0)){
        if(this._voucherService.voucherSelected && this._voucherService.voucherSelected.length >0){
          let totaldiscount = this._voucherService.voucherSelected.map(item => item.rewardsItem).reduce((total,b)=>{ return total + b.price; }, 0);
          this._flightService.itemFlightCache.totalPriceBeforeApplyVoucher = totalprice + totaldiscount;
        }
        if(this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0){
          this._flightService.itemFlightCache.totalPriceBeforeApplyVoucher = totalprice + this._voucherService.totalDiscountPromoCode;
        }
      }else if(this.promotionCode && this.discountpromo>0){
        this._flightService.itemFlightCache.totalPriceBeforeApplyVoucher = totalprice + this.discountpromo;
      }

      if(totalprice*1 <0){
        totalprice = 0;
      }
      this.totalPriceDisplay = this.gf.convertNumberToString(totalprice);
      this._flightService.itemFlightCache.totalPrice = totalprice;
      this._flightService.itemFlightCache.totalPriceDisplay = this.totalPriceDisplay;
    })
    this.listdepartseatselected = this._flightService.itemFlightCache.listdepartseatselected;
    if (this._flightService.itemFlightCache.listdepartseatselected) {
      this.hasdepartseat = true;
    }
    this.listreturnseatselected = this._flightService.itemFlightCache.listreturnseatselected;
    if (this._flightService.itemFlightCache.listreturnseatselected) {
      this.hasreturnseat = true;
    }
    this.listDiChung = this._flightService.itemFlightCache.DICHUNGParam;
    if (this._flightService.itemFlightCache.DICHUNGParam) {
      this.isDiChung = true;
    }
    if(!this.totalPriceDisplay){
      this.totalPriceDisplay = '0';
    }
  }


  getSeatMap(id) {
    var se = this;
    if((se._flightService.itemFlightCache.departFlight && se._flightService.itemFlightCache.departFlight.stops) || (se._flightService.itemFlightCache.returnFlight && se._flightService.itemFlightCache.returnFlight.stops)){
      se.allowchoiceseat = false;
    }else{
      let departairlines = se._flightService.itemFlightCache.departFlight.airline.replace(' ','');
      let returnairlines = se._flightService.itemFlightCache.returnFlight ? se._flightService.itemFlightCache.returnFlight.airline.replace(' ','') : "";
      if (departairlines == returnairlines || !se._flightService.objSearch.roundTrip) {
        let urlSeatMap = C.urls.baseUrl.urlFlight + "gate/apiv1/GetSeatMaps?reservationId=" + id + "&airline=" + departairlines;
        se.getSeatMaps(urlSeatMap, departairlines, 3);
      } else {
        let urlSeatMapDepart = C.urls.baseUrl.urlFlight + "gate/apiv1/GetSeatMaps?reservationId=" + id + "&airline=" + departairlines;
        se.getSeatMaps(urlSeatMapDepart, departairlines, 1);
        let urlSeatMapReturn = C.urls.baseUrl.urlFlight + "gate/apiv1/GetSeatMaps?reservationId=" + id + "&airline=" + returnairlines;
        se.getSeatMaps(urlSeatMapReturn, returnairlines, 2);
      }
    }

  }

  getSeatMaps(url, airlineCode, indexdepart) {
    var se = this;
    let headers = {
      "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
      'Content-Type': 'application/json; charset=utf-8',
    };
    
    this.gf.RequestApi('GET', url, headers, {}, 'flightAddDetails', 'getSeatMaps').then((data)=>{

      if (data) {
        let jsondata = data;
        console.log(jsondata);
        se._flightService.itemFlightCache.jsonSeats = jsondata;
        //Tạo object chọn ghế cho bamboo
        if (airlineCode == "BambooAirways") {
          if (jsondata.departSeats && jsondata.departSeats.length > 0) {
            se.hasdepartseat = true;
            se.allowchoiceseat = true;
            let data = jsondata.departSeats[0];
            let listSeatNameLeft:any = [], listSeatNameRight:any = [], listSeatNormal:any = [];
            let listrows:any = [];
            let listSeatName = data.deckDetails.cabinDetails.internalSeatConfigurationList;
            if (data && data.deckDetails && data.deckDetails.cabinDetails) {
              se._flightService.itemFlightCache.departSeats = data;
              if (data.deckDetails.cabinDetails.compartmentDetails && data.deckDetails.cabinDetails.compartmentDetails.length > 0) {
                if (data.smtCode.indexOf('787') != -1 ) {
                  for (let index = 0; index < data.deckDetails.cabinDetails.compartmentDetails.length; index++) {
                    let elementCompartmentDetails = data.deckDetails.cabinDetails.compartmentDetails[index];
                    let compartmentdetail = elementCompartmentDetails;
                    for (let index = 0; index < compartmentdetail.rows.length; index++) {
                      let  itemnormal:any = [], rowseat = compartmentdetail.rows[index];

                      for (let index = 0; index < elementCompartmentDetails.seatConfigurationMap.length; index++) {
                        if (elementCompartmentDetails.seatConfigurationMap[index] == -1) {
                          let fakeitem = { name: 'noname', type: -1, show: false };
                          itemnormal.push(fakeitem);
                        } else {
                          let idx = elementCompartmentDetails.seatConfigurationMap[index];
                          const element = rowseat.seatOptions[idx];
                          if(element){
                            element.show = true;
                            element.amount = element.seatAssignMentFee && element.seatAssignMentFee.amount ? element.seatAssignMentFee.amount : 0;
                            element.netPrice = element.seatAssignMentFee && element.seatAssignMentFee.netPrice ? element.seatAssignMentFee.netPrice : 0;
                            element.name = element.seatNumber;
                            element.type = 1;
  
                            if (element.seatQualifiers.seatFront) {//ghế phía trước
                              element.type = 2;
                            }
                            if (element.seatQualifiers.emergencyExit) {//ghế gần cửa exit
                              element.type = 3;
                            }
                            if (element.controlAttribute != "Available") {//ghế đã chọn
                              if (!element.seatQualifiers.emergencyExit) {
                                element.type = 5;
                              }
                            }
                            itemnormal.push(element);
                          }
                          
                        }
                      }
                      let itemnm = { itemsNormal: itemnormal, row: rowseat.rowIndex };
                      listrows.push(itemnm);
                    }
                  }
                }
                else {
                  for (let index = 0; index < data.deckDetails.cabinDetails.compartmentDetails.length; index++) {
                    const elementCompartmentDetails = data.deckDetails.cabinDetails.compartmentDetails[index];
                    let seatdetail = elementCompartmentDetails.seatConfigurationList;
                    let listSeatName = elementCompartmentDetails.internalSeatConfigurationList;
                    let dataSeat = elementCompartmentDetails.seatDetails;
                    let numofcolumnleft = Math.floor(elementCompartmentDetails.seatConfigurationMap.length / 2), numofcolumnright = Math.ceil(elementCompartmentDetails.seatConfigurationMap.length / 2);
                    let firstleftidx = elementCompartmentDetails.seatConfigurationMap[0];
                    let endrightidx = elementCompartmentDetails.seatConfigurationMap[elementCompartmentDetails.seatConfigurationMap.length - 1];
                    if (listSeatName && listSeatName.length > 0) {
                      for (let index = 0; index < numofcolumnleft; index++) {
                        const element = listSeatName[index];
                        listSeatNameLeft.push(element);
                      }
                      for (let index = numofcolumnright; index < listSeatName.length; index++) {
                        const element = listSeatName[index];
                        listSeatNameRight.push(element);
                      }
                    }

                    let compartmentdetail = elementCompartmentDetails;
                    for (let index = 0; index < compartmentdetail.rows.length; index++) {
                      let itemLeft:any = [], itemRight:any = [], itemnormal, rowseat = compartmentdetail.rows[index];
                      for (let index = 0; index < numofcolumnleft; index++) {
                        if (elementCompartmentDetails.seatConfigurationMap[index] == -1) {
                          let fakeitem = { name: 'noname', type: -1, show: false };
                          itemLeft.push(fakeitem);
                        } else {
                          let idx = elementCompartmentDetails.seatConfigurationMap[index];
                          const element = rowseat.seatOptions[idx];
                          element.show = true;
                          element.amount = element.seatAssignMentFee && element.seatAssignMentFee.amount ? element.seatAssignMentFee.amount : 0;
                            element.netPrice = element.seatAssignMentFee && element.seatAssignMentFee.netPrice ? element.seatAssignMentFee.netPrice : 0;
                          element.name = element.seatNumber;
                          element.type = 1;

                          if (element.seatQualifiers.seatFront) {//ghế phía trước
                            element.type = 2;
                          }
                          if (element.seatQualifiers.emergencyExit) {//ghế gần cửa exit
                            element.type = 3;
                          }
                          if (element.controlAttribute != "Available") {//ghế đã chọn
                            if (!element.seatQualifiers.emergencyExit) {
                              element.type = 5;
                            }
                          }
                          itemLeft.push(element);
                        }
                      }
                      for (let index = numofcolumnright; index < elementCompartmentDetails.seatConfigurationMap.length; index++) {
                        if (elementCompartmentDetails.seatConfigurationMap[index] == -1) {
                          let fakeitem = { name: 'noname', type: -1, show: false };
                          itemRight.push(fakeitem);
                        } else {
                          let idx = elementCompartmentDetails.seatConfigurationMap[index];
                          const element = rowseat.seatOptions[idx];
                          if(element){
                            element.show = true;
                            element.amount = element.seatAssignMentFee && element.seatAssignMentFee.amount ? element.seatAssignMentFee.amount : 0;
                            element.netPrice = element.seatAssignMentFee && element.seatAssignMentFee.netPrice ? element.seatAssignMentFee.netPrice : 0;
                            element.name = element.seatNumber;
                            element.type = 1;
  
                            if (element.seatQualifiers.seatFront) {//ghế phía trước
                              element.type = 2;
                            }
                            if (element.seatQualifiers.emergencyExit) {//ghế gần cửa exit
                              element.type = 3;
                            }
                            if (element.controlAttribute != "Available") {//ghế đã chọn
                              if (!element.seatQualifiers.emergencyExit) {
                                element.type = 5;
                              }
                            }
                            itemRight.push(element);
                          }
                          
                        }
                      }
                      itemnormal = { itemsLeft: itemLeft, itemsRight: itemRight, row: rowseat.rowIndex };
                      listSeatNormal.push(itemnormal);
                    }
                  }
                }
              }
            }

            if (indexdepart == 1 || indexdepart == 3) {
              if (data.smtCode.indexOf('787') != -1) {
                se._flightService.itemFlightCache.listSeatName = listSeatName;
                se._flightService.itemFlightCache.listSeatNormal = listrows;
                se._flightService.itemFlightCache.isnewmodelseat = true;
              } else {
                se._flightService.itemFlightCache.isnewmodelseat = false;
                se._flightService.itemFlightCache.listSeatName = listSeatName;
                se._flightService.itemFlightCache.listSeatNameLeft = listSeatNameLeft;
                se._flightService.itemFlightCache.listSeatNameRight = listSeatNameRight;
                se._flightService.itemFlightCache.listSeatNormal = listSeatNormal;
              }
            }

          } else {
            se.hasdepartseat = false;
          }

          if (jsondata.returnSeats && jsondata.returnSeats.length > 0) {
            se.hasreturnseat = true;
            se.allowchoiceseat = true;
            let data = jsondata.returnSeats[0];
            let listReturnSeatNameLeft:any = [], listReturnSeatNameRight:any = [], listReturnSeatNormal:any = [];
            let listrows:any = [];
            let listSeatName = data.deckDetails.cabinDetails.internalSeatConfigurationList;
            if (data && data.deckDetails && data.deckDetails.cabinDetails) {
              se._flightService.itemFlightCache.returnSeats = data;
              if (data.deckDetails.cabinDetails.compartmentDetails && data.deckDetails.cabinDetails.compartmentDetails.length > 0) {
                let elementCompartmentDetails = data.deckDetails.cabinDetails.compartmentDetails[0];

                if (data.smtCode.indexOf('787') != -1) {

                  for (let index = 0; index < data.deckDetails.cabinDetails.compartmentDetails.length; index++) {
                    let elementCompartmentDetails = data.deckDetails.cabinDetails.compartmentDetails[index];
                    let compartmentdetail = elementCompartmentDetails;
                    for (let index = 0; index < compartmentdetail.rows.length; index++) {
                      let itemLeft:any = [], itemRight:any = [], itemnormal:any = [], rowseat = compartmentdetail.rows[index];

                      for (let index = 0; index < elementCompartmentDetails.seatConfigurationMap.length; index++) {
                        if (elementCompartmentDetails.seatConfigurationMap[index] == -1) {
                          let fakeitem = { name: 'noname', type: -1, show: false };
                          itemnormal.push(fakeitem);
                        } else {
                          let idx = elementCompartmentDetails.seatConfigurationMap[index];
                          const element = rowseat.seat ? rowseat.seat[idx] : rowseat.seatOptions[idx];
                          element.show = true;
                          element.amount = element.seatAssignMentFee && element.seatAssignMentFee.amount ? element.seatAssignMentFee.amount : 0;
                            element.netPrice = element.seatAssignMentFee && element.seatAssignMentFee.netPrice ? element.seatAssignMentFee.netPrice : 0;
                          element.name = element.seatNumber;
                          element.type = 1;

                          if (element.seatQualifiers.seatFront) {//ghế phía trước
                            element.type = 2;
                          }
                          if (element.seatQualifiers.emergencyExit) {//ghế gần cửa exit
                            element.type = 3;
                          }
                          if (element.controlAttribute != "Available") {//ghế đã chọn
                            if (!element.seatQualifiers.emergencyExit) {
                              element.type = 5;
                            }
                          }
                          itemnormal.push(element);
                        }
                      }
                      let itemnm = { itemsNormal: itemnormal, row: rowseat.rowIndex };
                      listrows.push(itemnm);
                    }

                  }
                }
                else {
                  for (let index = 0; index < data.deckDetails.cabinDetails.compartmentDetails.length; index++) {
                    const elementCompartmentDetails = data.deckDetails.cabinDetails.compartmentDetails[index];

                    let seatdetail = elementCompartmentDetails.seatConfigurationList;
                    let listSeatName = elementCompartmentDetails.internalSeatConfigurationList;
                    let dataSeat = elementCompartmentDetails.seatDetails;
                    let numofcolumnleft = Math.floor(elementCompartmentDetails.seatConfigurationMap.length / 2), numofcolumnright = Math.ceil(elementCompartmentDetails.seatConfigurationMap.length / 2);
                    let firstleftidx = elementCompartmentDetails.seatConfigurationMap[0];
                    let endrightidx = elementCompartmentDetails.seatConfigurationMap[elementCompartmentDetails.seatConfigurationMap.length - 1];

                    if (listSeatName && listSeatName.length > 0) {

                      for (let index = 0; index < numofcolumnleft; index++) {
                        const element = listSeatName[index];
                        listReturnSeatNameLeft.push(element);
                      }
                      for (let index = numofcolumnright; index < listSeatName.length; index++) {
                        const element = listSeatName[index];
                        listReturnSeatNameRight.push(element);
                      }
                    }

                    let compartmentdetail = elementCompartmentDetails;
                    for (let index = 0; index < compartmentdetail.rows.length; index++) {
                      let itemLeft:any = [], itemRight:any = [], itemnormal, rowseat = compartmentdetail.rows[index];

                      for (let index = 0; index < numofcolumnleft; index++) {
                        if (elementCompartmentDetails.seatConfigurationMap[index] == -1) {
                          let fakeitem = { name: 'noname', type: -1, show: false };
                          itemLeft.push(fakeitem);
                        } else {
                          let idx = elementCompartmentDetails.seatConfigurationMap[index];
                          const element = rowseat.seat ? rowseat.seat[idx] : rowseat.seatOptions[idx];
                          element.show = true;

                          element.amount = element.seatAssignMentFee && element.seatAssignMentFee.amount ? element.seatAssignMentFee.amount : 0;
                            element.netPrice = element.seatAssignMentFee && element.seatAssignMentFee.netPrice ? element.seatAssignMentFee.netPrice : 0;
                          element.name = element.seatNumber;
                          element.type = 1;
                          if (element.seatQualifiers.seatFront) {//ghế phía trước
                            element.type = 2;
                          }
                          if (element.seatQualifiers.emergencyExit) {//ghế gần cửa exit
                            element.type = 3;
                          }
                          if (element.controlAttribute != "Available") {//ghế đã chọn
                            if (!element.seatQualifiers.emergencyExit) {
                              element.type = 5;
                            }
                          }
                          itemLeft.push(element);
                        }

                      }
                      for (let index = numofcolumnright; index < elementCompartmentDetails.seatConfigurationMap.length; index++) {
                        if (elementCompartmentDetails.seatConfigurationMap[index] == -1) {
                          let fakeitem = { name: 'noname', type: -1, show: false };
                          itemRight.push(fakeitem);
                        } else {
                          let idx = elementCompartmentDetails.seatConfigurationMap[index];
                          const element = rowseat.seat ? rowseat.seat[idx] : rowseat.seatOptions[idx];
                          element.show = true;

                          element.amount = element.seatAssignMentFee && element.seatAssignMentFee.amount ? element.seatAssignMentFee.amount : 0;
                            element.netPrice = element.seatAssignMentFee && element.seatAssignMentFee.netPrice ? element.seatAssignMentFee.netPrice : 0;
                          element.name = element.seatNumber;
                          element.type = 1;
                          if (element.seatQualifiers.seatFront) {//ghế phía trước
                            element.type = 2;
                          }
                          if (element.seatQualifiers.emergencyExit) {//ghế gần cửa exit
                            element.type = 3;
                          }
                          if (element.controlAttribute != "Available") {//ghế đã chọn
                            if (!element.seatQualifiers.emergencyExit) {
                              element.type = 5;
                            }
                          }
                          if (element.seatQualifiers.emergencyExit) {
                            element.type = 5;
                          }
                          itemRight.push(element);
                        }
                      }
                      itemnormal = { itemsLeft: itemLeft, itemsRight: itemRight, row: rowseat.rowIndex };
                      listReturnSeatNormal.push(itemnormal);
                    }
                  }
                }

              }
            }
            if (indexdepart == 2 || indexdepart == 3) {
              if (data.smtCode.indexOf('787') != -1) {
                se._flightService.itemFlightCache.listReturnSeatName = listSeatName;
                se._flightService.itemFlightCache.listReturnSeatNormal = listrows;
                se._flightService.itemFlightCache.isnewmodelreturnseat = true;
              }
              else {
                se._flightService.itemFlightCache.isnewmodelreturnseat = false;
                se._flightService.itemFlightCache.listReturnSeatName = listSeatName;
                se._flightService.itemFlightCache.listReturnSeatNameLeft = listReturnSeatNameLeft;
                se._flightService.itemFlightCache.listReturnSeatNameRight = listReturnSeatNameRight;
                se._flightService.itemFlightCache.listReturnSeatNormal = listReturnSeatNormal;
              }

            }
          }
          else {
            se.hasreturnseat = false;
          }
        }
        // thêm VNA
        else if (airlineCode == "VietnamAirlines") {
          if (jsondata.departSeats && jsondata.departSeats.length > 0) {
            se.hasdepartseat = true;
            se.allowchoiceseat = true;

            

            let data = jsondata.departSeats[0];
            let listSeatNameLeft:any = [], listSeatNameRight:any = [], listSeatNormal:any = [], itemLeft:any = [], itemRight:any = [], itemnormal;
            let itemfirstrow = data.cabin.row[0];
            let numofcolumnleft = itemfirstrow.seat.length / 2, numofcolumnright = itemfirstrow.seat.length / 2;
            let listrows:any = [];
            let listSeatName:any = [];
            for (let index = 0; index < data.cabin.column.length; index++) {
              let colname = data.cabin.column[index].column1;
              listSeatName.push(colname);
            }

            if (data.equipment.indexOf('787') != -1 || data.equipment.indexOf('350') != -1) {
              for (let index = 0; index < data.cabin.row.length; index++) {
                let cabinRows = data.cabin.row[index];

                let cabinRowDetail = cabinRows;
                  let itemLeft:any = [], itemRight:any = [], itemnormal:any = [], rowseat = cabinRowDetail.seat;
                  if(rowseat && rowseat.length ==0){
                    continue;
                  }
                  for (let index = 0; index < data.cabin.column.length; index++) {
                    if (index == 3 || index == 6) {
                      if(!(data.equipment.indexOf('350') != -1 && data.cabin.column.length == 4)){
                        let fakeitem = { name: 'noname', type: -1, show: false };
                        itemnormal.push(fakeitem);
                      }
                    } 
                      const element = cabinRowDetail.seat[index];
                      element.show = true;
                      element.amount = element.offer && element.offer.price && element.offer.price.totalAmount ? Number(element.offer.price.totalAmount.text) : 0;
                      element.name = cabinRowDetail.rowNumber + element.number;
                      element.type = 1;
                      element.row = cabinRowDetail.rowNumber;
                      if (se.checkSeatTypeVNA(element.facilities) == 'front') {//ghế phía trước
                        element.type = 2;
                      }
                      if (element.exitRowInd == 'true') {//ghế gần cửa exit
                        element.type = 3;
                      }
                      if (element.occupiedInd == 'true') {//ghế hạn chế
                        element.type = 6;
                      }
                      if ((element.occupiedInd == 'true' || element.premiumInd == 'true' || element.exitRowInd == 'true' || element.inoperativeInd == 'true')) {//ghế đã chọn
                        element.type = 5;
                      }
                      itemnormal.push(element);
                  }
                  let itemnm = { itemsNormal: itemnormal, row: cabinRowDetail.rowNumber };
                  listrows.push(itemnm);

              }

            }else{
              for (let index = 0; index < numofcolumnleft; index++) {
                let seatname = itemfirstrow.seat[index].number;
                listSeatNameLeft.push(seatname);
              }
              for (let index = numofcolumnleft; index < itemfirstrow.seat.length; index++) {
                let seatname = itemfirstrow.seat[index].number;
                listSeatNameRight.push(seatname);
              }
              data.cabin.row.sort((a, b) => {
                a.rowNumber < b.rowNumber ? -1 : 1;
              })
              for (let index = 0; index < data.cabin.row.length; index++) {
                let itemLeft:any = [], itemRight:any = [], itemnormal;
                const elementRow = data.cabin.row[index];

                if(elementRow.seat && elementRow.seat.length ==0){
                  continue;
                }

                if (elementRow.seat.length == 4) {
                  let fakeitem = { name: 'noname', type: -1, show: false };
                  itemLeft.push(fakeitem);
                }
                numofcolumnleft = elementRow.seat.length / 2;
                numofcolumnright = elementRow.seat.length / 2;
  
                for (let index = 0; index < numofcolumnleft; index++) {
                  const element = elementRow.seat[index];
                  element.show = true;
                  element.amount = element.offer && element.offer.price && element.offer.price.totalAmount ? Number(element.offer.price.totalAmount.text) : 0;
                  element.name = elementRow.rowNumber + element.number;
                  element.type = 1;
                  if (se.checkSeatTypeVNA(element.facilities) == 'front') {//ghế phía trước
                    element.type = 2;
                  }
                  if (element.exitRowInd == 'true') {//ghế gần cửa exit
                    element.type = 3;
                  }
                  if (element.occupiedInd == 'true') {//ghế hạn chế
                    element.type = 6;
                  }
                  if ((element.occupiedInd == 'true' || element.premiumInd == 'true' || element.exitRowInd == 'true' || element.inoperativeInd == 'true')) {//ghế đã chọn
                    element.type = 5;
                  }
                  itemLeft.push(element);
                }
                for (let index = numofcolumnright; index < elementRow.seat.length; index++) {
                  const element = elementRow.seat[index];
                  element.show = true;
                  element.amount = element.offer && element.offer.price && element.offer.price.totalAmount ? Number(element.offer.price.totalAmount.text) : 0;
                  element.name = elementRow.rowNumber + element.number;
                  element.type = 1;
                  if (se.checkSeatTypeVNA(element.facilities) == 'front') {//ghế phía trước
                    element.type = 2;
                  }
                  if (element.exitRowInd == 'true') {//ghế gần cửa exit
                    element.type = 3;
                  }
                  if (element.occupiedInd == 'true') {//ghế hạn chế
                    element.type = 6;
                  }
                  if ((element.occupiedInd == 'true' || element.premiumInd == 'true' || element.exitRowInd == 'true' || element.inoperativeInd == 'true')) {//ghế đã chọn
                    element.type = 5;
                  }
  
                  itemRight.push(element);
                }
                if (elementRow.seat.length == 4 && itemRight.length == 2) {
                  let fakeitem = { name: 'noname', type: -1, show: false };
                  itemRight.push(fakeitem);
                }
  
                itemnormal = { itemsLeft: itemLeft, itemsRight: itemRight, row: elementRow.rowNumber };
                listSeatNormal.push(itemnormal);
              }
            }

            if (indexdepart == 1 || indexdepart == 3) {
              if (data.equipment.indexOf('787') != -1 || data.equipment.indexOf('350') != -1) {
                se._flightService.itemFlightCache.listSeatName = listSeatName;
                se._flightService.itemFlightCache.listSeatNormal = listrows;
                se._flightService.itemFlightCache.isnewmodelseat = true;
              } else {
                se._flightService.itemFlightCache.isnewmodelseat = false;
                se._flightService.itemFlightCache.listSeatNameLeft = listSeatNameLeft;
                se._flightService.itemFlightCache.listSeatNameRight = listSeatNameRight;
                se._flightService.itemFlightCache.listSeatNormal = listSeatNormal;
              }
  
            }
          } else {
            se.hasdepartseat = false;
          }

          if (jsondata.returnSeats && jsondata.returnSeats.length > 0) {
            se.hasreturnseat = true;
            se.allowchoiceseat = true;
            let data = jsondata.returnSeats[0];
            let listReturnSeatNameLeft:any = [], listReturnSeatNameRight:any = [], listReturnSeatNormal:any = [], itemnormal;

            let itemfirstrow = data.cabin.row[0];
            let numofcolumnleft = itemfirstrow.seat.length / 2, numofcolumnright = itemfirstrow.seat.length / 2;

            let listrows:any = [];
            let listSeatName:any = [];

            if (data.equipment.indexOf('787') != -1 || data.equipment.indexOf('350') != -1) {

              for (let index = 0; index < data.cabin.column.length; index++) {
                let colname = data.cabin.column[index].column1;
                listSeatName.push(colname);
              }

              for (let index = 0; index < data.cabin.row.length; index++) {
                let cabinRows = data.cabin.row[index];

                let cabinRowDetail = cabinRows;
                  let itemLeft:any = [], itemRight:any = [], itemnormal:any = [], rowseat = cabinRowDetail.seat;
                  if(rowseat && rowseat.length ==0){
                    continue;
                  }
                  for (let index = 0; index < data.cabin.column.length; index++) {
                    if (index == 3 || index == 6) {
                      if(!(data.equipment.indexOf('350') != -1 && data.cabin.column.length == 4)){
                        let fakeitem = { name: 'noname', type: -1, show: false };
                        itemnormal.push(fakeitem);
                      }
                    } 
                      const element = cabinRowDetail.seat[index];
                      element.show = true;
                      element.amount = element.offer && element.offer.price && element.offer.price.totalAmount ? Number(element.offer.price.totalAmount.text) : 0;
                      element.name = cabinRowDetail.rowNumber + element.number;
                      element.type = 1;
                      element.row = cabinRowDetail.rowNumber;
                      if (se.checkSeatTypeVNA(element.facilities) == 'front') {//ghế phía trước
                        element.type = 2;
                      }
                      if (element.exitRowInd == 'true') {//ghế gần cửa exit
                        element.type = 3;
                      }
                      if (element.occupiedInd == 'true') {//ghế hạn chế
                        element.type = 6;
                      }
                      if ((element.occupiedInd == 'true' || element.premiumInd == 'true' || element.exitRowInd == 'true' || element.inoperativeInd == 'true')) {//ghế đã chọn
                        element.type = 5;
                      }
                      itemnormal.push(element);
                  }
                  let itemnm = { itemsNormal: itemnormal, row: cabinRowDetail.rowNumber };
                  listrows.push(itemnm);

              }

            }
            else{
              for (let index = 0; index < numofcolumnleft; index++) {
                let seatname = itemfirstrow.seat[index].number;
                listReturnSeatNameLeft.push(seatname);
              }
              for (let index = numofcolumnleft; index < itemfirstrow.seat.length; index++) {
                let seatname = itemfirstrow.seat[index].number;
                listReturnSeatNameRight.push(seatname);
              }
              data.cabin.row.sort((a, b) => {
                a.rowNumber < b.rowNumber ? -1 : 1;
              })
              for (let index = 0; index < data.cabin.row.length; index++) {
                let itemLeft:any = [], itemRight:any = [], itemnormal;
                const elementRow = data.cabin.row[index];
                
                if(elementRow.seat && elementRow.seat.length ==0){
                  continue;
                }

                if (elementRow.seat.length == 4) {
                  let fakeitem = { name: 'noname', type: -1, show: false };
                  itemLeft.push(fakeitem);
                }
                numofcolumnleft = elementRow.seat.length / 2;
                numofcolumnright = elementRow.seat.length / 2;
                for (let index = 0; index < numofcolumnleft; index++) {
                  const element = elementRow.seat[index];
                  element.show = true;
                  element.amount = element.offer && element.offer.price && element.offer.price.totalAmount ? Number(element.offer.price.totalAmount.text) : 0;
                  element.name = elementRow.rowNumber + element.number;
                  element.type = 1;
                  if (se.checkSeatTypeVNA(element.facilities) == 'front') {//ghế phía trước
                    element.type = 2;
                  }
                  if (element.exitRowInd == 'true') {//ghế gần cửa exit
                    element.type = 3;
                  }
                  if (element.occupiedInd == 'true') {//ghế hạn chế
                    element.type = 6;
                  }
                  if ((element.occupiedInd == 'true' || element.premiumInd == 'true' || element.exitRowInd == 'true' || element.inoperativeInd == 'true')) {//ghế đã chọn
  
                    element.type = 5;
  
                  }
                  itemLeft.push(element);
                }
                for (let index = numofcolumnright; index < elementRow.seat.length; index++) {
                  const element = elementRow.seat[index];
                  element.show = true;
                  element.amount = element.offer && element.offer.price && element.offer.price.totalAmount ? Number(element.offer.price.totalAmount.text) : 0;
                  element.name = elementRow.rowNumber + element.number;
                  element.type = 1;
                  if (se.checkSeatTypeVNA(element.facilities) == 'front') {//ghế phía trước
                    element.type = 2;
                  }
                  if (element.exitRowInd == 'true') {//ghế gần cửa exit
                    element.type = 3;
                  }
                  if (element.occupiedInd == 'true') {//ghế hạn chế
                    element.type = 6;
                  }
                  if ((element.occupiedInd == 'true' || element.premiumInd == 'true' || element.exitRowInd == 'true' || element.inoperativeInd == 'true')) {//ghế đã chọn
  
                    element.type = 5;
  
                  }
  
                  itemRight.push(element);
                }
                if (elementRow.seat.length == 4 && itemRight.length == 2) {
                  let fakeitem = { name: 'noname', type: -1, show: false };
                  itemRight.push(fakeitem);
                }
  
                itemnormal = { itemsLeft: itemLeft, itemsRight: itemRight, row: elementRow.rowNumber };
                listReturnSeatNormal.push(itemnormal);
              }
            }
            
            if (indexdepart == 2 || indexdepart == 3) {
              if (data.equipment.indexOf('787') != -1 || data.equipment.indexOf('350') != -1) {
                se._flightService.itemFlightCache.listReturnSeatName = listSeatName;
                se._flightService.itemFlightCache.listReturnSeatNormal = listrows;
                se._flightService.itemFlightCache.isnewmodelreturnseat = true;
              } else {
                se._flightService.itemFlightCache.listReturnSeatNameLeft = listReturnSeatNameLeft;
                se._flightService.itemFlightCache.listReturnSeatNameRight = listReturnSeatNameRight;
                se._flightService.itemFlightCache.listReturnSeatNormal = listReturnSeatNormal;
              }
            }

          } else {
            se.hasreturnseat = false;
          }
        }
        //Tạo object chọn ghế cho vietjetair
        else {

          if (jsondata.departSeats && jsondata.departSeats.length > 0) {
            se.hasdepartseat = true;
            se.allowchoiceseat = true;
            let data = jsondata.departSeats[0];
            let listSeatNameLeft:any = [], listSeatNameRight:any = [], listSeatNormal:any = [], itemLeft:any = [], itemRight:any = [], itemnormal;
            let itemfirstrow = data.rows[0];
            let numofcolumnleft = itemfirstrow.seatOptions.length / 2, numofcolumnright = itemfirstrow.seatOptions.length / 2;

            let maxseatlen = Math.max(...data.rows.map((item) => {return item.seatOptions.length}));

            let listrows:any = [];
            let listSeatName:any = [];
            //case máy bay thân rộng Airbus330
            if (maxseatlen == 9) {
              for (let index = 0; index < data.rows.length; index++) {
                let itemnormal:any = [];
                const elementRow = data.rows[index];
                listSeatName =  ['A','B','C','-1','D','F','G','-1','H','J','K'];
                for (let indexCol = 0; indexCol < listSeatName.length; indexCol++) {
                  const elementSeatName = listSeatName[indexCol];
                  let elementseat = elementRow.seatOptions.filter(c => c.seatMapCell.seatIdentifier == elementSeatName);
                  if(elementseat && elementseat.length >0){
                      let element = elementseat[0];
                      element.show = true;
                      element.netPrice = element.seatCharges[0].currencyAmounts[0].netPrice ? element.seatCharges[0].currencyAmounts[0].netPrice : element.seatCharges[0].currencyAmounts[0].totalAmount;
                      element.amount = element.seatCharges[0].currencyAmounts[0].totalAmount;
                      element.name = element.seatMapCell.rowIdentifier + element.seatMapCell.seatIdentifier;
                      element.type = 1;
                      if (element.seatMapCell.seatQualifiers.seatFront || element.seatMapCell.seatQualifiers.bulkheadFront) {//ghế phía trước
                        element.type = 2;
                      }
                      if (element.seatMapCell.seatQualifiers.emergencyExit) {//ghế gần cửa exit
                        element.type = 3;
                      }
                      if (element.seatMapCell.rowIdentifier <= 3 && !element.selectionValidity.available) {//ghế hạn chế
                        element.type = 6;
                      }
                      if (!element.selectionValidity.available) {//ghế đã chọn
                        if (!element.seatMapCell.seatQualifiers.emergencyExit) {
                          element.type = 5;
                        }
                      }
                      itemnormal.push(element);
                  }else{
                    let fakeitem = { name: 'noname', type: -2, show: false };
                    itemnormal.push(fakeitem);
                  }
                }
                
                  let itemnm = { itemsNormal: itemnormal, row: elementRow.rowNumber };
                  listrows.push(itemnm);
              }

            }
            else{

              for (let index = 0; index < numofcolumnleft; index++) {
                let seatname = itemfirstrow.seatOptions[index].seatMapCell.seatIdentifier;
                listSeatNameLeft.push(seatname);
              }
              for (let index = numofcolumnleft; index < itemfirstrow.seatOptions.length; index++) {
                let seatname = itemfirstrow.seatOptions[index].seatMapCell.seatIdentifier;
                listSeatNameRight.push(seatname);
              }
              data.rows.sort((a, b) => {
                a.rowNumber < b.rowNumber ? -1 : 1;
              })
              for (let index = 0; index < data.rows.length; index++) {
                let itemLeft:any = [], itemRight:any = [], itemnormal;
                const elementRow = data.rows[index];
                if (elementRow.seatOptions.length == 4) {
                  let fakeitem = { name: 'noname', type: -1, show: false };
                  itemLeft.push(fakeitem);
                }
                numofcolumnleft = elementRow.seatOptions.length / 2;
                numofcolumnright = elementRow.seatOptions.length / 2;
  
                for (let index = 0; index < numofcolumnleft; index++) {
                  const element = elementRow.seatOptions[index];
  
                  element.show = true;
                  element.netPrice = element.seatCharges[0].currencyAmounts[0].netPrice ? element.seatCharges[0].currencyAmounts[0].netPrice : element.seatCharges[0].currencyAmounts[0].totalAmount;
                  element.amount = element.seatCharges[0].currencyAmounts[0].totalAmount;
                  element.name = element.seatMapCell.rowIdentifier + element.seatMapCell.seatIdentifier;
                  element.type = 1;
                  if (element.seatMapCell.seatQualifiers.seatFront || element.seatMapCell.seatQualifiers.bulkheadFront) {//ghế phía trước
                    element.type = 2;
                  }
                  if (element.seatMapCell.seatQualifiers.emergencyExit) {//ghế gần cửa exit
                    element.type = 3;
                  }
                  if (element.seatMapCell.rowIdentifier <= 3 && !element.selectionValidity.available) {//ghế hạn chế
                    element.type = 6;
                  }
                  if (!element.selectionValidity.available) {//ghế đã chọn
                    if (!element.seatMapCell.seatQualifiers.emergencyExit) {
                      element.type = 5;
                    }
                  }
                  itemLeft.push(element);
                }
                for (let index = numofcolumnright; index < elementRow.seatOptions.length; index++) {
                  const element = elementRow.seatOptions[index];
                  element.show = true;
                  element.netPrice = element.seatCharges[0].currencyAmounts[0].netPrice ? element.seatCharges[0].currencyAmounts[0].netPrice : element.seatCharges[0].currencyAmounts[0].totalAmount;
                  element.amount = element.seatCharges[0].currencyAmounts[0].totalAmount;
                  element.name = element.seatMapCell.rowIdentifier + element.seatMapCell.seatIdentifier;
                  element.type = 1;
                  if (element.seatMapCell.seatQualifiers.seatFront || element.seatMapCell.seatQualifiers.bulkheadFront) {//ghế phía trước
                    element.type = 2;
                  }
                  if (element.seatMapCell.seatQualifiers.emergencyExit) {//ghế gần cửa exit
                    element.type = 3;
                  }
                  if (element.seatMapCell.rowIdentifier <= 3 && !element.selectionValidity.available) {
                    element.type = 6;
                  }
                  if (!element.selectionValidity.available) {//ghế đã chọn
                    if (!element.seatMapCell.seatQualifiers.emergencyExit) {
                      element.type = 5;
                    }
                  }
  
                  itemRight.push(element);
                }
                if (elementRow.seatOptions.length == 4 && itemRight.length == 2) {
                  let fakeitem = { name: 'noname', type: -1, show: false };
                  itemRight.push(fakeitem);
                }
  
                itemnormal = { itemsLeft: itemLeft, itemsRight: itemRight, row: elementRow.rowNumber };
                listSeatNormal.push(itemnormal);
              }
            }


            if (indexdepart == 1 || indexdepart == 3) {
              if (maxseatlen == 9) {
                se._flightService.itemFlightCache.listSeatName = listSeatName;
                se._flightService.itemFlightCache.listSeatNormal = listrows;
                se._flightService.itemFlightCache.isnewmodelseat = true;
              } else {
                se._flightService.itemFlightCache.listSeatNameLeft = listSeatNameLeft;
                se._flightService.itemFlightCache.listSeatNameRight = listSeatNameRight;
                se._flightService.itemFlightCache.listSeatNormal = listSeatNormal;
              }

              
            }
          } else {
            se.hasdepartseat = false;
          }

          if (jsondata.returnSeats && jsondata.returnSeats.length > 0) {
            se.hasreturnseat = true;
            se.allowchoiceseat = true;
            let data = jsondata.returnSeats[0];
            let listReturnSeatNameLeft:any = [], listReturnSeatNameRight:any = [], listReturnSeatNormal:any = [], itemnormal;
            let listSeatNameLeft:any = [], listSeatNameRight:any = [], listSeatNormal:any = [], itemLeft:any = [], itemRight:any = [];
            let itemfirstrow = data.rows[0];
            let numofcolumnleft = itemfirstrow.seatOptions.length / 2, numofcolumnright = itemfirstrow.seatOptions.length / 2;

            let maxseatlen = Math.max(...data.rows.map((item) => {return item.seatOptions.length}));
            let listrows:any = [];
            let listSeatName:any = [];
            //case máy bay thân rộng Airbus330
            if (maxseatlen == 9) {
              for (let index = 0; index < data.rows.length; index++) {
                let itemnormal:any = [];
                const elementRow = data.rows[index];
                listSeatName =  ['A','B','C','-1','D','F','G','-1','H','J','K'];
                for (let indexCol = 0; indexCol < listSeatName.length; indexCol++) {
                  const elementSeatName = listSeatName[indexCol];
                  let elementseat = elementRow.seatOptions.filter(c => c.seatMapCell.seatIdentifier == elementSeatName);
                  if(elementseat && elementseat.length >0){
                      let element = elementseat[0];
                      element.show = true;
                      element.netPrice = element.seatCharges[0].currencyAmounts[0].netPrice ? element.seatCharges[0].currencyAmounts[0].netPrice : element.seatCharges[0].currencyAmounts[0].totalAmount;
                      element.amount = element.seatCharges[0].currencyAmounts[0].totalAmount;
                      element.name = element.seatMapCell.rowIdentifier + element.seatMapCell.seatIdentifier;
                      element.type = 1;
                      if (element.seatMapCell.seatQualifiers.seatFront || element.seatMapCell.seatQualifiers.bulkheadFront) {//ghế phía trước
                        element.type = 2;
                      }
                      if (element.seatMapCell.seatQualifiers.emergencyExit) {//ghế gần cửa exit
                        element.type = 3;
                      }
                      if (element.seatMapCell.rowIdentifier <= 3 && !element.selectionValidity.available) {//ghế hạn chế
                        element.type = 6;
                      }
                      if (!element.selectionValidity.available) {//ghế đã chọn
                        if (!element.seatMapCell.seatQualifiers.emergencyExit) {
                          element.type = 5;
                        }
                      }
                      itemnormal.push(element);
                  }else{
                    let fakeitem = { name: 'noname', type: -2, show: false };
                    itemnormal.push(fakeitem);
                  }
                }
                  
                  let itemnm = { itemsNormal: itemnormal, row: elementRow.rowNumber };
                  listrows.push(itemnm);
              }

            }
            else{

            for (let index = 0; index < numofcolumnleft; index++) {
              let seatname = itemfirstrow.seatOptions[index].seatMapCell.seatIdentifier;
              listReturnSeatNameLeft.push(seatname);
            }
            for (let index = numofcolumnleft; index < itemfirstrow.seatOptions.length; index++) {
              let seatname = itemfirstrow.seatOptions[index].seatMapCell.seatIdentifier;
              listReturnSeatNameRight.push(seatname);
            }
            data.rows.sort((a, b) => {
              a.rowNumber < b.rowNumber ? -1 : 1;
            })
            for (let index = 0; index < data.rows.length; index++) {
              let itemLeft:any = [], itemRight:any = [], itemnormal;
              const elementRow = data.rows[index];
              if (elementRow.seatOptions.length == 4) {
                let fakeitem = { name: 'noname', type: -1, show: false };
                itemLeft.push(fakeitem);
              }
              numofcolumnleft = elementRow.seatOptions.length / 2;
              numofcolumnright = elementRow.seatOptions.length / 2;
              for (let index = 0; index < numofcolumnleft; index++) {
                const element = elementRow.seatOptions[index];
                element.show = true;
                element.amount = element.seatCharges[0].currencyAmounts[0].totalAmount;
                element.netPrice = element.seatCharges[0].currencyAmounts[0].netPrice ? element.seatCharges[0].currencyAmounts[0].netPrice : element.seatCharges[0].currencyAmounts[0].totalAmount;
                element.name = element.seatMapCell.rowIdentifier + element.seatMapCell.seatIdentifier;
                element.type = 1;
                if (element.seatMapCell.seatQualifiers.seatFront || element.seatMapCell.seatQualifiers.bulkheadFront) {//ghế phía trước
                  element.type = 2;
                }
                if (element.seatMapCell.seatQualifiers.emergencyExit) {//ghế gần cửa exit
                  element.type = 3;
                }
                if (element.seatMapCell.rowIdentifier <= 3 && !element.selectionValidity.available) {
                  element.type = 6;
                }
                if (!element.selectionValidity.available) {//ghế đã chọn
                  if (!element.seatMapCell.seatQualifiers.emergencyExit) {
                    element.type = 5;
                  }
                }

                itemLeft.push(element);
              }
              for (let index = numofcolumnright; index < elementRow.seatOptions.length; index++) {
                const element = elementRow.seatOptions[index];
                element.show = true;
                element.amount = element.seatCharges[0].currencyAmounts[0].totalAmount;
                element.netPrice = element.seatCharges[0].currencyAmounts[0].netPrice ? element.seatCharges[0].currencyAmounts[0].netPrice : element.seatCharges[0].currencyAmounts[0].totalAmount;
                element.name = element.seatMapCell.rowIdentifier + element.seatMapCell.seatIdentifier;
                element.type = 1;
                if (element.seatMapCell.seatQualifiers.seatFront || element.seatMapCell.seatQualifiers.bulkheadFront) {//ghế phía trước
                  element.type = 2;
                }
                if (element.seatMapCell.seatQualifiers.emergencyExit) {//ghế gần cửa exit
                  element.type = 3;
                }
                if (element.seatMapCell.rowIdentifier <= 3 && !element.selectionValidity.available) {
                  element.type = 6;
                }
                if (!element.selectionValidity.available) {//ghế đã chọn
                  if (!element.seatMapCell.seatQualifiers.emergencyExit) {
                    element.type = 5;
                  }
                }

                itemRight.push(element);
              }
              if (elementRow.seatOptions.length == 4 && itemRight.length == 2) {
                let fakeitem = { name: 'noname', type: -1, show: false };
                itemRight.push(fakeitem);
              }

              itemnormal = { itemsLeft: itemLeft, itemsRight: itemRight, row: elementRow.rowNumber };
              listReturnSeatNormal.push(itemnormal);
            }

          }
            if (indexdepart == 2 || indexdepart == 3) {
              if (maxseatlen == 9) {
                se._flightService.itemFlightCache.listReturnSeatName = listSeatName;
                se._flightService.itemFlightCache.listReturnSeatNormal = listrows;
                se._flightService.itemFlightCache.isnewmodelreturnseat = true;
              } else {
                se._flightService.itemFlightCache.listReturnSeatNameLeft = listReturnSeatNameLeft;
                se._flightService.itemFlightCache.listReturnSeatNameRight = listReturnSeatNameRight;
                se._flightService.itemFlightCache.listReturnSeatNormal = listReturnSeatNormal;
              }

              // se._flightService.itemFlightCache.listReturnSeatNameLeft = listReturnSeatNameLeft;
              // se._flightService.itemFlightCache.listReturnSeatNameRight = listReturnSeatNameRight;
              // se._flightService.itemFlightCache.listReturnSeatNormal = listReturnSeatNormal;
            }

          } else {
            se.hasreturnseat = false;
          }

        }

      }
    })
  }

  goback() {
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
    this.hasdepartluggage = false;
    this.hasreturnluggage = false;
    this.showbuttonluggage = true;
    this.hasreturnseat = true;
    this.hasdepartseat = true;
    this._flightService.itemFlightCache.isnewmodelseat = false;
    this._flightService.itemFlightCache.isnewmodelreturnseat = false;
    this._flightService.itemFlightCache.objHotelCitySelected = null;
    this._flightService.itemFlightCache.hasvoucher = false;
    this._voucherService.rollbackSelectedVoucher.emit(this._voucherService.selectVoucher);
        this._voucherService.selectVoucher = null;
         this.checkEmptyHotelCity = false;

            this.clearSeatChoice();
            this._flightService.itemFlightCache.backtochoiceseat = false;

            this.itemVoucher = null;
        this.promocode = "";
        this.promotionCode = "";
        this.discountpromo = 0;
        this.strPromoCode = '';
        this.totaldiscountpromo = 0;
        this._flightService.itemFlightCache.promotionCode = "";
        this._flightService.itemFlightCache.discount = 0;
        this._flightService.itemFlightCache.discountpromo = 0;
        this._voucherService.voucherSelected = [];
        this._voucherService.listPromoCode = "";
        this._voucherService.listObjectPromoCode = [];
        this._voucherService.totalDiscountPromoCode = 0;
        this._voucherService.flightPromoCode = "";
        this._voucherService.flightTotalDiscount=0;
        this._flightService.itemFlightCache.HotelCityMealtypeSelected = null;
        this._flightService.itemFlightCache.itemsFlightCityHotel = [];
        this._flightService.itemFlightCache.priceCathay = 0;
        if(this._flightService.itemFlightCache.adults && this._flightService.itemFlightCache.adults.length>0){
          this._flightService.itemFlightCache.adults.forEach(element => {
            element.itemLug = null;
            element.itemLugReturn = null;
          });
        }
        if(this._flightService.itemFlightCache.childs && this._flightService.itemFlightCache.childs.length>0){
          this._flightService.itemFlightCache.childs.forEach(elementc => {
            elementc.itemLug = null;
            elementc.itemLugReturn = null;
          });
        }
        this.navCtrl.navigateBack('/flightadddetails');
  }

  buyLuggage() {
    if (!this.ischeckVN) {
      this.presentToastwarming('Hành lý đang được cập nhật, xin vui lòng đợi trong giây lát!');
      return;
    }
    this.navCtrl.navigateForward('/flightaddluggage');
  }
  async presentToastwarming(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }
  buySeat() {
    this.navCtrl.navigateForward('/flightaddseat');
  }

  addMeal() {
    this.navCtrl.navigateForward('/flightaddmeal');
  }

  async showPriceDetail() {
    this._flightService.itemFlightCache.promotionCode=this.strPromoCode;
    this._flightService.itemFlightCache.discount=this.totaldiscountpromo;
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: FlightpricedetailPage,
      });
    modal.present();
  }

  confirm() {
    var se = this;
    if(!(se.loadHotelCityDone || (se._flightService.itemFlightCache.itemsFlightCityHotel && se._flightService.itemFlightCache.itemsFlightCityHotel.length >0))){
      se.gf.showToastWarning('Đang tải dữ liệu. Xin vui lòng đợi trong giây lát!')
      return;
    }
    if(se.checkEmptyHotelCity){
      se.showAlertChoiceHotelCity();
      return;
    }
   

    // let databkg = this._flightService.itemFlightCache.dataSummaryBooking;
    // let itemflightcache = this._flightService.itemFlightCache;
    // if(databkg && itemflightcache.promotionCode && itemflightcache.pnr && itemflightcache.pnr.resNo && itemflightcache.promotionCode != se.promocode){
    //   this.showAlertPromoCode();
    //   return;
    // }


    if((se._voucherService.voucherSelected && se._voucherService.voucherSelected.length >0) || se._voucherService.listPromoCode){
      se._flightService.itemFlightCache.promotionCode = se.strPromoCode;
      se._flightService.itemFlightCache.discount = se.totaldiscountpromo;
    }else{
      se._flightService.itemFlightCache.promotionCode=se.promotionCode;
      se._flightService.itemFlightCache.discount=se.discountpromo;
    }

    if (se._flightService.itemFlightCache.backtochoiceseat) {
      if (!se.checkseat) {
        se.showAlertChoiceSeat();
      } else {
        se._flightService.itemFlightCache.backtochoiceseat = false;
        se.updatePassengerInfo().then((data) => {
          if (!data.error) {
            se._flightService.itemFlightCache.pnr = data;
            if(se._flightService.itemFlightCache.totalPrice==0)
                          {
                            let itemcache = se._flightService.itemFlightCache;
                            itemcache.ischeckpayment = 0;
                            this.gf.checkTicketAvaiable(this._flightService.itemFlightCache).then((check) =>{
                              if(check){
                                var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=office&source=app&amount=' + itemcache.totalPrice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + (itemcache.pnr.bookingCode ?itemcache.pnr.bookingCode:  itemcache.pnr.resNo) + '&memberId=' + se.jti + '&rememberToken=&buyerPhone=' + itemcache.phone+'&version=2';
                                            se.gf.CreatePayoo(url).then((data) => {
                                              se.gf.hideLoading();
                                            if(data.success){
                                              se._flightService.itemFlightCache.ischeckpayment= 1;
                                                  se.navCtrl.navigateForward('flightpaymentdone/'+(se._flightService.itemFlightCache.pnr.bookingCode ?se._flightService.itemFlightCache.pnr.bookingCode:  se._flightService.itemFlightCache.pnr.resNo)+'/'+moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD')+'/'+moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD'));
                                                }else{
                                                  se.gf.showAlertOutOfTicket(se._flightService.itemFlightCache, 2, false);
                                                  se.gf.hideLoading();
                                                }
                                          })
                                  }
                                  else{
                                    se.gf.showAlertOutOfTicket(se._flightService.itemFlightCache, 2, false);
                                    se.gf.hideLoading();
                                  }
                            })
                          }
                          else{
                            se.gf.hideLoading();
                            se.navCtrl.navigateForward('/flightpaymentselect');
                          }
          } else {
            se.gf.showToastWarning(data.error);
            se.gf.hideLoading();
          }
        })
      }

    } else {
      if(se.isCathay){
        se.checkInput().then((check)=>{
          if(check){
            se.gotopaymentpage();
          }
        });
      }else{
        se.gotopaymentpage();
      }
    }
  }

  async showAlertChoiceSeat() {
    var se = this;
    let msg = 'Vui lòng chọn lại ghế ngồi!';
    let alert = await se.alertCtrl.create({
      message: msg,
      cssClass: "cls-alert-choiceseat",
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          role: 'OK',
          handler: () => {
            this.allowchoiceseat = false;
            this.checkseat = true;
            this.clearSeatChoice();
            
            this.getSeatMap(this._flightService.itemFlightCache.reservationId);
          }
        }
      ]
    });
    alert.present();
  }

  showCondition() {
    var se = this;
    if (se._flightService.itemFlightCache.backtochoiceseat && se.checkseat) {
      se._flightService.itemFlightCache.backtochoiceseat = false;
    }
    se.navCtrl.navigateForward('/flightcondition');
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

  checkChange() {
    this.chkchangeflight = true;
  }

  getDetailTicket(item): Promise<any> {
    return new Promise((resolve, reject) => {
      let headers = {
        "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
        'Content-Type': 'application/json; charset=utf-8',
      };
      let strUrl = C.urls.baseUrl.urlFlight + "gate/apiv1/GetDetailTicketAirBus?airlineCode=" + item.airlineCode + "&ticketType=" + item.ticketType + "&airbusCode=" + item.aircraft + "&flightNumber=" + item.flightNumber + "&fromPlace=" + (item.fromPlaceCode ? item.fromPlaceCode : item.from) + "&toPlace=" + (item.toPlaceCode ? item.toPlaceCode : item.to)+"&departDate="+moment(item.departTime).format("MM-DD-YYYY")+"&bookingDate="+moment(new Date()).format("MM-DD-YYYY");
      this.gf.RequestApi('GET', strUrl, headers, {}, 'flightAddDetails', 'getDetailTicket').then((data)=>{
        if (data == 200) {
          let result = data;
          resolve(result);

        }
      })
    })

  }

  updatePassengerInfo() : Promise<any>{
    var se = this;
    return new Promise((resolve, reject) => {
      se.gf.showLoadingWithMsg('Đang tiến hành giữ vé');
      try{
        let data = se._flightService.itemFlightCache;
        let listpassenger:any = [];
            //let data = se._flightService.itemFlightCache;
             let departluggage:any=[],returnluggage:any=[],
              departAirlineCode = data.departFlight.airlineCode, returnAirlineCode = data.returnFlight ? data.returnFlight.airlineCode : "";
  
  
            for (let index = 0; index < data.adults.length; index++) {
              const element = data.adults[index];
              //tên
              var ho1 ='', ten1='';
              let objhoten1 = se.splitFullName(element.name, ho1, ten1);
              ho1 = objhoten1.firstname;
              ten1 = objhoten1.lastname;
              //hành lý
              let objAncilary:any =[],objAncilaryReturn:any =[] ;
              let departluggageweight = 0, returnluggageweight = 0;
              
              if(element.itemLug){
                let objLuggage;
                if(departAirlineCode == "JetStar"){
                  objLuggage = {
                    Name: element.itemLug.title, 
                    Type: "Baggage", 
                    Value: element.itemLug.weight,
                    price: element.itemLug.amount,
                    netPrice: element.itemLug.netPrice,
                    flightNumber: data.departFlight.flightNumber
                  }
                }
                else if(departAirlineCode == "VietnamAirlines"){
                  let obj = JSON.parse(element.itemLug.purchaseKey);
                  obj.NameId = "1.1";
                  objLuggage = {
                    Name: element.itemLug.title, 
                    Type: "Baggage", 
                    Key: JSON.stringify(obj),
                    Value: element.itemLug.weight,
                    price: element.itemLug.amount,
                    netPrice:element.itemLug.netPrice,
                    flightNumber: data.departFlight.flightNumber
                  }
                }
                else{
                  objLuggage = {
                    Name: element.itemLug.title, 
                    Type: "Baggage", 
                    Key: element.itemLug.purchaseKey,
                    Value: element.itemLug.weight,
                    price: element.itemLug.amount,
                    netPrice: element.itemLug.netPrice,
                    flightNumber: data.departFlight.flightNumber
                  }
                }
  
                objAncilary.push(objLuggage);
                departluggageweight = element.itemLug.weight;
              }
  
              if(element.itemLugReturn){
                let objReturnLuggage1;
                if(returnAirlineCode && returnAirlineCode == "JetStar"){
                  objReturnLuggage1 = {
                    Name: element.itemLugReturn.title, 
                    Type: "Baggage", 
                    Value: element.itemLugReturn.weight,
                    price: element.itemLugReturn.amount,
                    netPrice: element.itemLugReturn.netPrice,
                    flightNumber: data.returnFlight.flightNumber
                  }
                }
                else if(returnAirlineCode == "VietnamAirlines")
                    {
                      let obj = JSON.parse(element.itemLugReturn.purchaseKey);
                          obj.NameId = "1.1";
                      objReturnLuggage1 = {
                        Name: element.itemLugReturn.title, 
                        Type: "Baggage", 
                        Key: JSON.stringify(obj),
                        Value: element.itemLugReturn.weight,
                        price: element.itemLugReturn.amount,
                        netPrice:element.itemLugReturn.netPrice,
                        flightNumber: data.returnFlight.flightNumber
                      }
                    }
                else{
                  objReturnLuggage1 = {
                    Name: element.itemLugReturn.title, 
                    Type: "Baggage", 
                    Key: element.itemLugReturn.purchaseKey,
                    Value: element.itemLugReturn.weight,
                    price: element.itemLugReturn.amount,
                    netPrice: element.itemLugReturn.netPrice,
                    flightNumber: data.returnFlight.flightNumber
                  }
                }
                
                objAncilaryReturn.push(objReturnLuggage1);
                returnluggageweight = element.itemLugReturn.weight;
              }
  
                  //chỗ ngồi
                  //Vietjet lấy key theo selectionKey; Bamboo lấy key theo seatNumber
                  let objSeat;
                  if(data.departSeatChoice && data.departSeatChoice.length >0){
                    if(data.departSeatChoice.length ==1 && !data.departSeatChoice[0].choosed){
                      let seat = data.departSeatChoice[0];
                      let stop = data.departFlight.stops;
                      if (departAirlineCode=='VietnamAirlines') {
                          let objKey = { NameId: "1.1", SeatNumber: seat.name, Price: seat.amount };
                          objSeat = {Name: "Chỗ ngồi " + seat.name, Type : "Seat", Key:  JSON.stringify(objKey), Value: seat.name, journey: 1, segment: (stop >=1 ? 2 : 1), price: seat.amount, netPrice: seat.amount, PaxIndex: index+1 };
                      }
                      else{
                        objSeat = {Name: "Chỗ ngồi " + seat.name, Type : "Seat", Key:  seat.selectionKey ? seat.selectionKey : seat.seatNumber, Value: seat.name, journey: 1, segment: (stop >=1 ? 2 : 1), price: seat.amount, netPrice: seat.netPrice ? seat.netPrice: seat.amount, PaxIndex: index+1 };
                      }
                     
                      objAncilary.push(objSeat);
                      data.departSeatChoice[0].choosed = true;
                    }else{
                      let seat = data.departSeatChoice[index];
                      if(seat){
                        let stop = data.departFlight.stops;
                        if (departAirlineCode=='VietnamAirlines') {
                          let objKey = { NameId: "1.1", SeatNumber: seat.name, Price: seat.amount };
                          objSeat = {Name: "Chỗ ngồi " + seat.name, Type : "Seat", Key:  JSON.stringify(objKey), Value: seat.name, journey: 1, segment: (stop >=1 ? 2 : 1), price: seat.amount, netPrice: seat.amount, PaxIndex: index+1 };
                      }
                      else{
                        objSeat = {Name: "Chỗ ngồi " + seat.name, Type : "Seat", Key:  seat.selectionKey ? seat.selectionKey : seat.seatNumber, Value: seat.name, journey: 1, segment: (stop >=1 ? 2 : 1), price: seat.amount, netPrice: seat.netPrice ? seat.netPrice: seat.amount, PaxIndex: index+1 };
                      }
                        //objSeat = {Name: "Chỗ ngồi " + seat.name, Type : "Seat", Key:  seat.selectionKey ? seat.selectionKey : seat.seatNumber, Value: seat.name, journey: 1, segment: (stop >=1 ? 2 : 1), price: seat.amount, PaxIndex: index+1 };
                        objAncilary.push(objSeat);
                        data.departSeatChoice[index].choosed = true;
                      }
                      
                    }
                    
                  }
                  let objSeatReturn;
                  if(data.returnSeatChoice && data.returnSeatChoice.length >0){
                    if(data.returnSeatChoice.length ==1 && !data.returnSeatChoice[0].choosed){
                      let seatreturn = data.returnSeatChoice[0];
                      let stopreturn = data.returnFlight.stops;
                      if (returnAirlineCode=='VietnamAirlines') {
                          let objKey = { NameId: "1.1", SeatNumber: seatreturn.name, Price: seatreturn.amount };
                          objSeatReturn = {Name: "Chỗ ngồi " + seatreturn.name, Type : "Seat", Key:  JSON.stringify(objKey), Value: seatreturn.name, journey: (data.departFlight.airlineCode == data.returnFlight.airlineCode)? 2 : 1, segment: (stopreturn >=1 ? 2 : 1), price: seatreturn.amount, netPrice: seatreturn.amount, PaxIndex: index+1 };
                        
                      }
                      else{
                        objSeatReturn = {Name: "Chỗ ngồi " + seatreturn.name, Type : "Seat", Key:  seatreturn.selectionKey? seatreturn.selectionKey : seatreturn.seatNumber, Value: seatreturn.name, journey: (data.departFlight.airlineCode == data.returnFlight.airlineCode)? 2 : 1, segment: (stopreturn >=1 ? 2 : 1), price: seatreturn.amount, netPrice: seatreturn.netPrice ? seatreturn.netPrice: seatreturn.amount, PaxIndex: index+1 };
                      }
                     
                      objAncilaryReturn.push(objSeatReturn);
                      data.returnSeatChoice[0].choosed = true;
                    }else{
                      let seatreturn = data.returnSeatChoice[index];
                      if(seatreturn){
                        let stopreturn = data.returnFlight.stops;
                        if (returnAirlineCode=='VietnamAirlines') {
                            let objKey = { NameId: "1.1", SeatNumber: seatreturn.name, Price: seatreturn.amount };
                            objSeatReturn = {Name: "Chỗ ngồi " + seatreturn.name, Type : "Seat", Key:  JSON.stringify(objKey), Value: seatreturn.name, journey: (data.departFlight.airlineCode == data.returnFlight.airlineCode)? 2 : 1, segment: (stopreturn >=1 ? 2 : 1), price: seatreturn.amount, netPrice: seatreturn.amount, PaxIndex: index+1 };
                        }
                        else{
                          objSeatReturn = {Name: "Chỗ ngồi " + seatreturn.name, Type : "Seat", Key:  seatreturn.selectionKey? seatreturn.selectionKey : seatreturn.seatNumber, Value: seatreturn.name, journey: (data.departFlight.airlineCode == data.returnFlight.airlineCode)? 2 : 1, segment: (stopreturn >=1 ? 2 : 1), price: seatreturn.amount, netPrice: seatreturn.netPrice ? seatreturn.netPrice: seatreturn.amount, PaxIndex: index+1 };
                        }
                        // objSeatReturn = {Name: "Chỗ ngồi " + seatreturn.name, Type : "Seat", Key:  seatreturn.selectionKey? seatreturn.selectionKey : seatreturn.seatNumber , Value: seatreturn.name, journey: (data.departFlight.airlineCode == data.returnFlight.airlineCode)? 2 : 1, segment: (stopreturn >=1 ? 2 : 1), price: seatreturn.amount, PaxIndex: index+1 };
                        objAncilaryReturn.push(objSeatReturn);
                        data.returnSeatChoice[index].choosed = true;
                      }
                      
                    }
                    
                  }
                 //Đi chung
                 let objTransfer;
                 if (this._flightService.itemFlightCache.DICHUNGParam && this._flightService.itemFlightCache.DICHUNGParam.TotalPriceGo) {
                   
                   objTransfer={Type:"Transfer",price: this._flightService.itemFlightCache.DICHUNGParam.TotalPriceGo,netPrice:this._flightService.itemFlightCache.DICHUNGParam.TotalPriceGo,title:"1"}
                   if(index == 0){
                      objAncilary.push(objTransfer);
                   }
                   
                 }
                 if (this._flightService.itemFlightCache.DICHUNGParam && this._flightService.itemFlightCache.DICHUNGParam.TotalPriceReturn) {
                   objTransfer={Type:"Transfer",price: this._flightService.itemFlightCache.DICHUNGParam.TotalPriceReturn,netPrice:this._flightService.itemFlightCache.DICHUNGParam.TotalPriceReturn,title:"1"}
                   if(index == 0){
                      objAncilaryReturn.push(objTransfer);
                   }
                 }
                 element.ancillaryJson = (objAncilary.length >0 ? JSON.stringify(objAncilary): "");
                  element.ancillaryReturnJson = (objAncilaryReturn.length >0 ? JSON.stringify(objAncilaryReturn): "");
                  // console.log(element.ancillaryJson);
                  // console.log(element.ancillaryReturnJson);
                  listpassenger.push({
                    "passengerType": 0,
                    "gender": element.gender,
                    "firstName": ten1,
                    "lastName": ho1,
                    "mobileNumber": "",
                    "baggage": departluggageweight,
                    "returnBaggage": returnluggageweight,
                    "birthDay": element.dateofbirth,
                    "email": "",
                    "passportNumber": (data.showLotusPoint && se.isExtenal) ? element.passport :"",
                    "passportExpired": (data.showLotusPoint && se.isExtenal) ? element.passportExpireDate : "", 
                    "nationality": (data.showLotusPoint && se.isExtenal) ? element.country : "",
                    "destinationCity": "",
                    "destinationPostal": "",
                    "destinationStreet": "",
                    "passportIssueCountry": (data.showLotusPoint && se.isExtenal) ? element.passportCountry : "",
                    "airlineMemberCode": element.departAirlineMemberCode && element.expanddivairlinemember ? element.departAirlineMemberCode : '', 
                    "airlineMemberCodeReturn": (se._flightService.itemFlightCache.roundTrip && element.returnAirlineMemberCode && element.expanddivairlinemember? element.returnAirlineMemberCode : ''), 
                    "departMealPlan": "", 
                    "returnMealPlan": "",  
                    "adultIndex": index, 
                    "ancillaryJson": element.ancillaryJson,
                    "ancillaryReturnJson": element.ancillaryReturnJson
                  })
        }
  
        let adultindex = 0;
        //trẻ em 
        for (let index = 0; index < data.childs.length; index++) {
          const element = data.childs[index];
          
          //hành lý
          let objAncilary:any =[],objAncilaryReturn:any =[] ;
          let departluggageweight = 0, returnluggageweight = 0;
  
          departluggage = departluggage.filter((item) => { return item.quantitycheck >0});
          returnluggage = returnluggage.filter((item) => { return item.quantitycheck >0});
  
          if(!element.isInfant){
              if(element.itemLug){
                let objLuggage;
                if(departAirlineCode == "JetStar"){
                  objLuggage = {
                    Name: element.itemLug.title, 
                    Type: "Baggage", 
                    Value: element.itemLug.weight,
                    price: element.itemLug.amount,
                    netPrice: element.itemLug.netPrice,
                    flightNumber: data.departFlight.flightNumber
                  }
                }
                else if(departAirlineCode == "VietnamAirlines"){
                  let obj = JSON.parse(element.itemLug.purchaseKey);
                  obj.NameId = "1.1";
                  objLuggage = {
                    Name: element.itemLug.title, 
                    Type: "Baggage", 
                    Key: JSON.stringify(obj),
                    Value: element.itemLug.weight,
                    price: element.itemLug.amount,
                    netPrice:element.itemLug.netPrice,
                    flightNumber: data.departFlight.flightNumber
                  }
                }
                else{
                  objLuggage = {
                    Name: element.itemLug.title, 
                    Type: "Baggage", 
                    Key: element.itemLug.purchaseKey,
                    Value: element.itemLug.weight,
                    price: element.itemLug.amount,
                    netPrice: element.itemLug.netPrice,
                    flightNumber: data.departFlight.flightNumber
                  }
                }
  
                objAncilary.push(objLuggage);
                departluggageweight = element.itemLug.weight;
              }
  
              if(element.itemLugReturn){
                let objReturnLuggage1;
                if(returnAirlineCode && returnAirlineCode == "JetStar"){
                  objReturnLuggage1 = {
                    Name: element.itemLugReturn.title, 
                    Type: "Baggage", 
                    Value: element.itemLugReturn.weight,
                    price: element.itemLugReturn.amount,
                    netPrice: element.itemLugReturn.netPrice,
                    flightNumber: data.returnFlight.flightNumber
                  }
                }
                else if(returnAirlineCode == "VietnamAirlines")
                    {
                      let obj = JSON.parse(element.itemLugReturn.purchaseKey);
                          obj.NameId = "1.1";
                      objReturnLuggage1 = {
                        Name: element.itemLugReturn.title, 
                        Type: "Baggage", 
                        Key: JSON.stringify(obj),
                        Value: element.itemLugReturn.weight,
                        price: element.itemLugReturn.amount,
                        netPrice:element.itemLugReturn.netPrice,
                        flightNumber: data.returnFlight.flightNumber
                      }
                    }
                else{
                  objReturnLuggage1 = {
                    Name: element.itemLugReturn.title, 
                    Type: "Baggage", 
                    Key: element.itemLugReturn.purchaseKey,
                    Value: element.itemLugReturn.weight,
                    price: element.itemLugReturn.amount,
                    netPrice: element.itemLugReturn.netPrice,
                    flightNumber: data.returnFlight.flightNumber
                  }
                }
                
                objAncilaryReturn.push(objReturnLuggage1);
                returnluggageweight = element.itemLugReturn.weight;
              }
          }
         
          //tên
          var ho1 ='', ten1='';
          let objhoten1 = se.splitFullName(element.name, ho1, ten1);
          ho1 = objhoten1.firstname;
          ten1 = objhoten1.lastname;
          let indexseat = index + data.adults.length;
          if(!element.isInfant){
            //chỗ ngồi
            let objSeat;
            if(data.departSeatChoice && data.departSeatChoice.length >0){
              if(data.departSeatChoice.length ==1){
                if(data.departSeatChoice[indexseat] && !data.departSeatChoice[indexseat].choosed){
                  let seat = data.departSeatChoice[indexseat];
                  let stop = data.departFlight.stops;
  
                  if (departAirlineCode=='VietnamAirlines') {
                    let objKey = { NameId: "1.1", SeatNumber: seat.name, Price: seat.amount };
                    objSeat = {Name: "Chỗ ngồi " + seat.name, Type : "Seat", Key: JSON.stringify(objKey), Value: seat.name, journey: 1, segment: (stop >=1 ? 2 : 1), price: seat.amount, netPrice: seat.amount, PaxIndex: indexseat+1 };
                  }else{
                    objSeat = {Name: "Chỗ ngồi " + seat.name, Type : "Seat", Key:  seat.selectionKey ? seat.selectionKey : seat.seatNumber, Value: seat.name, journey: 1, segment: (stop >=1 ? 2 : 1), price: seat.amount, netPrice: seat.netPrice ? seat.netPrice: seat.amount, PaxIndex: indexseat+1 };
                  }
                  objAncilary.push(objSeat);
                }
                
              }else{
                if(data.departSeatChoice[indexseat] && !data.departSeatChoice[indexseat].choosed){
                  let seat = data.departSeatChoice[indexseat];
                  if(seat){
                    let stop = data.departFlight.stops;
                    if (departAirlineCode=='VietnamAirlines') {
                      let objKey = { NameId: "1.1", SeatNumber: seat.name, Price: seat.amount };
                      objSeat = {Name: "Chỗ ngồi " + seat.name, Type : "Seat", Key:  JSON.stringify(objKey), Value: seat.name, journey: 1, segment: (stop >=1 ? 2 : 1), price: seat.amount, netPrice: seat.amount, PaxIndex: indexseat+1 };
                    }else{
                      objSeat = {Name: "Chỗ ngồi " + seat.name, Type : "Seat", Key:  seat.selectionKey ? seat.selectionKey : seat.seatNumber, Value: seat.name, journey: 1, segment: (stop >=1 ? 2 : 1), price: seat.amount, netPrice: seat.netPrice ? seat.netPrice: seat.amount, PaxIndex: indexseat+1 };
                    }
                    
                    objAncilary.push(objSeat);
                  }
                  
                }
              }
              
            }
  
            let objSeatReturn;
            if(data.returnSeatChoice && data.returnSeatChoice.length >0){
              if(data.returnSeatChoice.length ==1){
                if(data.returnSeatChoice[indexseat] && !data.returnSeatChoice[indexseat].choosed){
                    let seatreturn = data.returnSeatChoice[indexseat];
                    let stopreturn = data.returnFlight.stops;
                    
                    if (returnAirlineCode=='VietnamAirlines') {
                      let objKey = { NameId: "1.1", SeatNumber: seatreturn.name, Price: seatreturn.amount };
                      objSeatReturn = {Name: "Chỗ ngồi " + seatreturn.name, Type : "Seat", Key:  JSON.stringify(objKey) , Value: seatreturn.name, journey: (data.departFlight.airlineCode == data.returnFlight.airlineCode)? 2 : 1, segment: (stopreturn >=1 ? 2 : 1), price: seatreturn.amount, netPrice: seatreturn.amount, PaxIndex: indexseat+1 };
                    }
                    else{
                      objSeatReturn = {Name: "Chỗ ngồi " + seatreturn.name, Type : "Seat", Key:  seatreturn.selectionKey ? seatreturn.selectionKey : seatreturn.seatNumber , Value: seatreturn.name, journey: (data.departFlight.airlineCode == data.returnFlight.airlineCode)? 2 : 1, segment: (stopreturn >=1 ? 2 : 1), price: seatreturn.amount, netPrice: seatreturn.netPrice ? seatreturn.netPrice: seatreturn.amount, PaxIndex: indexseat+1 };
                    }
                    objAncilaryReturn.push(objSeatReturn);
                  }
              }else{
                if(data.returnSeatChoice[indexseat] && !data.returnSeatChoice[indexseat].choosed){
                  let seatreturn = data.returnSeatChoice[indexseat];
                  if(seatreturn){
                    let stopreturn = data.returnFlight.stops;
                    if (returnAirlineCode=='VietnamAirlines') {
                      let objKey = { NameId: "1.1", SeatNumber: seatreturn.name, Price: seatreturn.amount };
                      objSeatReturn = {Name: "Chỗ ngồi " + seatreturn.name, Type : "Seat", Key:  JSON.stringify(objKey) , Value: seatreturn.name, journey: (data.departFlight.airlineCode == data.returnFlight.airlineCode)? 2 : 1, segment: (stopreturn >=1 ? 2 : 1), price: seatreturn.amount, netPrice: seatreturn.amount, PaxIndex: indexseat+1 };
                    }else{
                      objSeatReturn = {Name: "Chỗ ngồi " + seatreturn.name, Type : "Seat", Key:  seatreturn.selectionKey ? seatreturn.selectionKey : seatreturn.seatNumber , Value: seatreturn.name, journey: (data.departFlight.airlineCode == data.returnFlight.airlineCode)? 2 : 1, segment: (stopreturn >=1 ? 2 : 1), price: seatreturn.amount, netPrice: seatreturn.netPrice ? seatreturn.netPrice: seatreturn.amount, PaxIndex: indexseat+1 };
                    }
                    
                    objAncilaryReturn.push(objSeatReturn);
                  }
                    
                  }
              }
              
            }
          }
          
          if(element.isInfant){
            adultindex++;
          }
          element.ancillaryJson = (objAncilary.length >0 ? JSON.stringify(objAncilary): "");
          element.ancillaryReturnJson = (objAncilaryReturn.length >0 ? JSON.stringify(objAncilaryReturn): "");
  
            listpassenger.push({
              "passengerType": element.isInfant ? 2 : 1,
              "gender": element.gender,
              "firstName": ten1,
              "lastName": ho1,
              "mobileNumber": "",
              "baggage": departluggageweight ? departluggageweight : "",
              "returnBaggage": returnluggageweight ? returnluggageweight : "",
              "birthDay": element.dateofbirth,
              "email": "",
              "passportNumber": (data.showLotusPoint && se.isExtenal) ? element.passport :"",
              "passportExpired": (data.showLotusPoint && se.isExtenal) ? element.passportExpireDate : "", 
              "nationality": (data.showLotusPoint && se.isExtenal) ? element.country : "",
              "destinationCity": "",
              "destinationPostal": "",
              "destinationStreet": "",
              "passportIssueCountry": (data.showLotusPoint && se.isExtenal) ? element.passportCountry : "",
              "airlineMemberCode": "", 
              "departMealPlan": "", 
              "returnMealPlan": "",  
              "adultIndex": element.isInfant ? adultindex -1 : 0, 
              "ancillaryJson": element.ancillaryJson,
              "ancillaryReturnJson": element.ancillaryReturnJson
            })
        }
  
        let firstnamecontact = '', lastnamecontact = '';
        let objcontact = se.splitFullName(data.hoten ? data.hoten : data.adults[0].name, firstnamecontact, lastnamecontact);
        firstnamecontact = objcontact.firstname;
        lastnamecontact = objcontact.lastname;
        data.ho = firstnamecontact;
        data.ten = lastnamecontact;
  
        var bookingJsonData;
             //thêm param đi chung vào list đầu tiên
            if (this._flightService.itemFlightCache.DICHUNGParam) {
              this._flightService.itemFlightCache.DICHUNGParam.User={email:C.urls.baseUrl.emailDC,phone: data.sodienthoai,fullName:data.ho+" "+data.ten};
              listpassenger[0].DICHUNGParam = this._flightService.itemFlightCache.DICHUNGParam;
              var AirTicketObj:any=[];
              let AirTicketItem= {PromotionNote:"",AirlineName:""};
              let JsonItem = JSON.stringify(listpassenger[0].DICHUNGParam);
              AirTicketItem.PromotionNote = JsonItem;
              AirTicketItem.AirlineName = "APIDICHUNG";
              AirTicketObj.push(AirTicketItem);
              let Json = JSON.stringify(AirTicketObj);
              bookingJsonData = Json;
            }
  
            let voucherSelectedMap = this._voucherService.voucherSelected.map(v => {
              let newitem = {};
              newitem["voucherCode"] = v.code;
              newitem["voucherName"] = v.rewardsItem.title;
              newitem["voucherType"] = v.applyFor || v.rewardsItem.rewardsType;
              newitem["voucherDiscount"] = v.rewardsItem.price;
              newitem["keepCurrentVoucher"] = this._flightService.itemFlightCache.listVouchersAlreadyApply && this._flightService.itemFlightCache.listVouchersAlreadyApply.length >0 ? this._flightService.itemFlightCache.listVouchersAlreadyApply.some(item => item.code == v.code) :false;
              return newitem;
            });
            let promoSelectedMap = this._voucherService.listObjectPromoCode.map(v => {
              let newitem = {};
              newitem["voucherCode"] = v.code;
              newitem["voucherName"] = v.name;
              newitem["voucherType"] = 2;
              newitem["voucherDiscount"] = v.price;
              newitem["keepCurrentVoucher"] = this._flightService.itemFlightCache.listVouchersAlreadyApply && this._flightService.itemFlightCache.listVouchersAlreadyApply.length >0 ? this._flightService.itemFlightCache.listVouchersAlreadyApply.some(item => item.code == v.code) :false;
              return newitem;
            });
  
            let checkpromocode = this._voucherService.voucherSelected && this._voucherService.voucherSelected.length ==0 && this._voucherService.listObjectPromoCode && this._voucherService.listObjectPromoCode.length ==0;
            let arrpromocode = se._voucherService.flightPromoCode ? [{"voucherCode": se._voucherService.flightPromoCode, "voucherName": se._voucherService.flightPromoCode,"voucherType": 1,"voucherDiscount": se._voucherService.flightTotalDiscount,"keepCurrentVoucher": false  }] : [];
  
        //return new Promise((resolve, reject) => {
          let objPass
          objPass = {
            "contact": {
              "gender": "1",
              "firstName": lastnamecontact,
              "lastName": firstnamecontact ,
              "mobileNumber": data.phone,
              "email": data.contactOption =='mail' ? (data.email || "") : '',
              "address": "",
              "phoneNumber": data.phone,
              "hasvoucher": se._flightService.itemFlightCache.promotionCode ? true : false,
              "memberCodeAirline": '',
              "contactChannel": data.contactOption =='mail' ? 'mail' : 'zalo'
            },
            "passengers": listpassenger,
            "userToken": "",
            "noteCorp": "",
            "compName": data.Invoice? data.companyname : '',
            "compAddress": data.Invoice?data.address : '',
            "compTaxCode": data.Invoice?data.tax : '',
            "compContactEmail": data.emailhddt || '',
            "compContactName": data.hotenhddt || '',
            "isInvoice": data.Invoice,
            "isHoldTicket": false,//tạm thời chưa giữ chỗ
            "departFlightId": data.departFlight ? data.departFlight.id : "",
            "returnFlightId": data.returnFlight ? data.returnFlight.id : "",
            "memberId": se.jti ? se.jti : "",
            "hotelAddon" : se._flightService.itemFlightCache.objHotelCitySelected ? se._flightService.itemFlightCache.objHotelCitySelected : "" ,//truyền thêm hotelcity nếu chọn
            "bookingJsonData":bookingJsonData,//đi chung
            "vouchers" : !checkpromocode ? [...voucherSelectedMap,...promoSelectedMap] : arrpromocode,
            "InsuranceType":se._flightService.itemFlightCache.InsuranceType,
            "isCheckinOnline": se._flightService.itemFlightCache.isCheckinOnline,
            "isInitAncillary" : false
          }
            
          if(this._voucherService.voucherSelected && this._voucherService.voucherSelected.length ==0 && this._voucherService.listObjectPromoCode && this._voucherService.listObjectPromoCode.length ==0){
            if(se._flightService.itemFlightCache.pnr && se._flightService.itemFlightCache.pnr.resNo && se._flightService.itemFlightCache.hasvoucher && se._flightService.itemFlightCache.promotionCode)
            {
              objPass.voucher={};
              objPass.voucher.keepCurrentVoucher=true;
              objPass.voucher.voucherCode = se._flightService.itemFlightCache.promotionCode ? se._flightService.itemFlightCache.promotionCode:"";
            }
          }
          
          let headers = {
            "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            'Content-Type': 'application/json; charset=utf-8',
          };
          let strUrl = C.urls.baseUrl.urlFlight + "gate/apiv1/PassengerSave/"+data.reservationId;
          this.gf.RequestApi('POST', strUrl, headers, objPass, 'flightAddService', 'GetUserInfo').then((data)=>{
            if (data) {
              let result = data;
              //console.log(result);
              resolve(result);
            }else{
              resolve(false);
            }
          })
  
        //})
      }
      catch(e){
        se.gf.hideLoading();
        let result = (e as Error).message;
        console.log(result)
        let objError = {
          page: "flightaddservice",
          func: "updatePassengerInfo",
          message: "exception",
          content: result,
          type: "warning",
          param: JSON.stringify(se.options)
        };
        C.writeErrorLog(objError,result);
        se.gf.showAlertErrorMessage();
      }
    })
    
    
  }

  splitFullName(strHoten, ho, ten) {
    let textfullname = strHoten.split(' ');
    let name = '';
    if (textfullname.length > 2) {
      for (let i = 1; i < textfullname.length; i++) {
        if (i == 1) {
          name += textfullname[i];
        } else {
          name += ' ' + textfullname[i];
        }
      }
      ho = textfullname[0];
      ten = name;
    } else if (textfullname.length > 1) {
      ho = textfullname[0];
      ten = textfullname[1];
    }
    else if (textfullname.length == 1) {
      ho = textfullname[0];
      ten = "";
    }
    return { firstname: ho, lastname: ten };
  }
  checkSeatTypeVNA(facs) {
    let fac = facs.filter(item => item.detail == 'FrontOfCabin').length;
    if (fac > 0) {
      return 'front';
    }
  }

  loadHotelCity(data){
    var se = this;
    se.zone.run(()=>{
      se.loadHotelCityDone = (data && data.length >0) ? false : true;

      se._flightService.itemFlightCache.itemsFlightCityHotel = data;
      se._flightService.itemFlightCache.itemsFlightCityHotel.forEach(item => {
        if(item && item.Rating){
          switch (item.Rating) {
            case 50:
              item.RatingStar = "../../assets/star/ic_star_5.svg";
              break;
            case 45:
              item.RatingStar = "../../assets/star/ic_star_4.5.svg";
              break;
            case 40:
              item.RatingStar = "../../assets/star/ic_star_4.svg";
              break;
            case 35:
              item.RatingStar = "../../assets/star/ic_star_3.5.svg";
              break;
            case 30:
              item.RatingStar = "../../assets/star/ic_star_3.svg";
              break;
            case 25:
              item.RatingStar = "../../assets/star/ic_star_2.5.svg";
              break;
            case 20:
              item.RatingStar = "../../assets/star/ic_star_2.svg";
              break;
            case 15:
              item.RatingStar = "../../assets/star/ic_star_1.5.svg";
              break;
            case 10:
              item.RatingStar = "../../assets/star/ic_star_1.svg";
              break;
            case 5:
              item.RatingStar = "../../assets/star/ic_star_0.5.svg";
              break;
            default:
              break;
          }
        }

        let link = "https://maps.google.com/maps?q=" + item.HotelName + "&hl=es;z=14&amp&output=embed";
        item.linkGoogleMap = se.sanitizer.bypassSecurityTrustResourceUrl(link);
        if(item.Avatar && item.Avatar.indexOf('http')==-1){
          item.Avatar = 'https:' +item.Avatar;
        }
        if(item.dataPrice && item.hotelDetail){
          item.hotelDetail.RoomClasses[0].selected = true;
          item.PaxAndRoomInfo = item.hotelDetail.SummaryFilter+ ", " + item.hotelDetail.RoomClasses[0].TotalRoom+ " · " + item.dataPrice.mealName;
          item.roomName = item.dataPrice.roomName;
          item.priceDiff = (item.dataPrice.lowRateOta * item.hotelDetail.TotalNight) - item.hotelDetail.RoomClasses[0].MealTypeRates[0].PriceAvgPlusOTA;
          item.priceOriginal = item.dataPrice.lowRateOta * item.hotelDetail.TotalNight;
          item.priceOriginalDisplay = se.gf.convertNumberToString(item.priceOriginal);
          item.pricePromo = se.gf.convertNumberToString(item.hotelDetail.RoomClasses[0].MealTypeRates[0].PriceAvgPlusOTA);
          item.priceTotal = item.hotelDetail.RoomClasses[0].MealTypeRates[0].PriceAvgPlusOTA;
          item.SummaryFilter = item.hotelDetail.SummaryFilter;

          item.hotelDetail.RoomClasses.forEach(roomClass => {
            roomClass.MealTypeRates[0].PriceDiffUpgradeDisplay = se.gf.convertNumberToString(roomClass.MealTypeRates[0].PriceAvgPlusOTA);
          });
        }
      });

      se.zone.run(() => se._flightService.itemFlightCache.itemsFlightCityHotel.sort(function(a,b){
          if(a.dataPrice && b.dataPrice){
            return a.dataPrice.lowRate - b.dataPrice.lowRate;
          }
        })
      )
      se.loadHotelCityDone = true;
    })

    
    
   
    
    let itemhoteldetail = se._flightService.itemFlightCache.itemsFlightCityHotel[0];
    if(itemhoteldetail && itemhoteldetail.hotelDetail && itemhoteldetail.hotelDetail.RoomClasses[0]){
      this._flightService.itemFlightCache.objectHotelCity = itemhoteldetail.hotelDetail.RoomClasses[0];
    }
    
    se.loadDataHotelDetail(itemhoteldetail);
  }

  loadDataHotelDetail(item){
      let headers = {
        "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
        'Content-Type': 'application/json; charset=utf-8',
      };
      let strUrl = C.urls.baseUrl.urlPost + "/mhoteldetail/" + item.HotelId;
      this.gf.RequestApi('POST', strUrl, headers, {}, 'flightAddDetails', 'getDetailTicket').then((data)=>{

        if (data) {
          let jsondata = data;
          item.defaultHotelData = jsondata;
        }
      })
  
  }
  
  checkChangeRoom(data: any) {
    let se = this;
    if(data && se.searchhotel.hotelCityId){
      let objchangeroom = se._flightService.itemFlightCache.itemsFlightCityHotel.filter((item) => {return item.HotelId == se.searchhotel.hotelCityId});
      if(objchangeroom && objchangeroom.length>0){
          objchangeroom[0].hotelDetail.RoomClasses.forEach(element => {
              if(element.ClassID == data.ClassID){
                element.selected = true;
                element.MealTypeRates[0].selected = true;
                se._flightService.itemFlightCache.HotelCityMealtypeSelected = element.MealTypeRates[0];
                se.zone.run(()=>{
                  objchangeroom[0].priceDiff = (objchangeroom[0].dataPrice.lowRateOta * objchangeroom[0].hotelDetail.TotalNight) - element.MealTypeRates[0].PriceAvgPlusOTA;
                  objchangeroom[0].pricePromo = se.gf.convertNumberToString(element.MealTypeRates[0].PriceAvgPlusOTA);
                  objchangeroom[0].priceTotal = element.MealTypeRates[0].PriceAvgPlusOTA;
                })
               
                se.AddHotelCity(objchangeroom[0].HotelId);
              }else{
                element.selected = false;
              }
          });
      }
    }
  }

  
  AddHotelCity(id) {
      let se = this;
      let objHotelCity = se._flightService.itemFlightCache.itemsFlightCityHotel.filter((item) => {return item.HotelId == id});
      if(objHotelCity && objHotelCity.length>0){
        objHotelCity[0].checkaddhotel = true;
        let el = objHotelCity[0].hotelDetail.RoomClasses.filter((r) => {return r.selected});
        if(el && el.length >0){
          let room = el[0];
          let mealtype = room.MealTypeRates[0];
          if(mealtype){
            let objHotelCitySelected = {
              HotelId: objHotelCity[0].HotelId,
              TotalRoom: room.TotalRoom,
              TotalPrices: mealtype.PriceAvgPlusOTA,
              RoomStatus: mealtype.Status,
              BreakfastInclude: mealtype.Code,
              BreakfastIncludeName: mealtype.Name,
              PaymentMethod: "",
              BookingStatus: "",
              TravPaxPrices: mealtype.PriceAvgPlusNet,
              Office: "",
              RoomName: mealtype.RoomName,
              RoomPrices: mealtype.PriceAvgPlusOTA,
              RoomId:mealtype.RoomId,
              MealTypeNote: mealtype.PromotionInclusions && mealtype.PromotionInclusions.length >0 ? mealtype.PromotionInclusions.join(',') : '',
              PromotionNote: mealtype.PromotionNote,
              HotelCheckDetailTokenVinHms: mealtype.HotelCheckDetailTokenVinHms,
              HotelCheckPriceTokenSMD: mealtype.HotelCheckPriceTokenSMD,
              HotelCheckDetailTokenInternal: mealtype.Supplier == 'SERI' && mealtype.HotelCheckDetailTokenInternal ? mealtype.HotelCheckDetailTokenInternal : "",
              Supplier: mealtype.IsHoliday ? "Holiday" : mealtype.Supplier,
              AllomentBreak: mealtype.AllomentBreak,
              IsPromotionAllotment: mealtype.IsPromotionAllotment,
              NoteForSupp: mealtype.NoteForSupplier,
              Avatar: objHotelCity[0].Avatar,
              HotelName: objHotelCity[0].HotelName,
              RatingStar: objHotelCity[0].RatingStar,
              SummaryFilter: objHotelCity[0].SummaryFilter,
              RoomPriceStr: mealtype.PriceAvgPlusOTAStr,
              Address:objHotelCity[0].Address,
              Location:objHotelCity[0].Lat+','+objHotelCity[0].Lon
            }
            se._flightService.itemFlightCache.objHotelCitySelected = objHotelCitySelected;
            se._flightService.itemFlightCache.HotelCityMealtypeSelected = mealtype;
            se.totalPriceAll(mealtype);
          }
            
        }
        
      }
  }
  /**
   * Xóa những Hotelcity không được check chọn trước khi chọn lại (trường hợp chọn lại hotelcity khác)
   */
  clearOtherSelectedItem(id):Promise<boolean>{
    return new Promise((resolve, reject) => {
      for (let index = 0; index < this._flightService.itemFlightCache.itemsFlightCityHotel.length; index++) {
        const element = this._flightService.itemFlightCache.itemsFlightCityHotel[index];
        if(element.HotelId != id){
          element.checkaddhotel = false;
        }
        if(index == this._flightService.itemFlightCache.itemsFlightCityHotel.length-1){
          resolve(true);
        }
      }
    })
  }
  /**
   * Kiểm tra lại có check chọn hotelcity thì add vào object
   */
  checkHotelCityBeforeAddDetail(){
    var se = this;
    if(se._flightService.itemFlightCache.itemsFlightCityHotel && se._flightService.itemFlightCache.itemsFlightCityHotel.length >0){
      let objHotelCity = se._flightService.itemFlightCache.itemsFlightCityHotel && se._flightService.itemFlightCache.itemsFlightCityHotel.filter((hc)=> {return hc.checkaddhotel});
      if(objHotelCity && objHotelCity.length >0){
          se.AddHotelCity(objHotelCity[0].HotelId);
      }
    }
    
  }


  //thêm đưa đón
  addDichung(stt){
    if(stt==0){
      this._flightService.itemTranferChange.emit(true);
      this._flightService.itemFlightCache.departDCPlace=null;
      this._flightService.itemFlightCache.returnDCPlace=null;
      this.navCtrl.navigateForward('/flightdcpickaddress');
    }
    else{
      this.navCtrl.navigateBack('/flightdcdetail/'+this._flightService.itemFlightCache.isblocktextDepart+'/'+this._flightService.itemFlightCache.isblocktextReturn);
    }
  }
  async showdiscount(){
    this.promocode="";
      this.promotionCode = "";
      this.discountpromo =0;
      this.itemVoucher = null;
      this._voucherService.isFlightPage = true;
      this.msg="";
      this._voucherService.openFrom = 'flightaddservice';
      const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: AdddiscountPage,
      });
      modal.present();
       if(this._voucherService.selectVoucher && this._voucherService.selectVoucher.claimed){
         this._voucherService.rollbackSelectedVoucher.emit(this._voucherService.selectVoucher);
         this._voucherService.selectVoucher = null;
       }
       this._voucherService.listPromoCode = [];
       this.buildStringPromoCode();
      this.totalPriceAll(0);
      modal.onDidDismiss().then((data: OverlayEventDetail) => {
        //case multi voucher tiền mặt
        if(this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0){
          if(this.strPromoCode){
            this.strPromoCode += ', '+this._voucherService.listPromoCode.join(', ');
            this.totaldiscountpromo += this._voucherService.totalDiscountPromoCode;
          }else{
            this.strPromoCode = this._voucherService.listPromoCode.join(', ');
            this.totaldiscountpromo = this._voucherService.totalDiscountPromoCode;
          }
         
          this.totalPriceAll(0);
        }else if (data.data) {//case voucher km
          let vc = data.data;
          let databkg = this._flightService.itemFlightCache.dataSummaryBooking;
          let itemflightcache = this._flightService.itemFlightCache;

          if(vc.applyFor && vc.applyFor != 'flight'){
            this.gf.showAlertMessageOnly(`Mã giảm giá chỉ áp dụng cho đơn hàng ${ vc.applyFor == 'flight' ? 'vé máy bay' : 'khách sạn'}. Quý khách vui lòng chọn lại mã khác!`);
            this._voucherService.rollbackSelectedVoucher.emit(vc);
            return;
          }
         
          else if(databkg && itemflightcache.promotionCode && itemflightcache.pnr && itemflightcache.pnr.resNo && itemflightcache.promotionCode != data.data.promocode){
            this.showAlertPromoCode();
            return;
          }
          else {
            this._voucherService.isFlightPage = false;
            this.zone.run(() => {
              if (data.data.promocode) {
                $('.div-point').addClass('div-disabled');
                this.promocode=data.data.promocode;
                this.promofunc(data.data);
              }
            })
          }
        }
      })
  }
  promofunc(vc) {
    var se = this;
    if (se.promocode) {
      let headers = {
        'postman-token': '37a7a641-c2dd-9fc6-178b-6a5eed1bc611',
          'cache-control': 'no-cache',
          'content-type': 'application/json'
      };
      //let body = { bookingCode: 'VMB', code: se.promocode, totalAmount: se._flightService.itemFlightCache.totalPrice}
      let body = {bookingCode: 'VMB' ,code: se.promocode, totalAmount: se._flightService.itemFlightCache.totalPrice, comboDetailId: 0, couponData: (vc.applyFor && vc.applyFor == 'flight' || se._voucherService.openFrom == 'flightaddservice') ? {
        flight: { "tickets": this._flightService.itemFlightCache.roundTrip ? [
          {
            "flightNumber": se._flightService.itemFlightCache.departFlight.flightNumber ,
            "airLineCode": se._flightService.itemFlightCache.departFlight.airlineCode,
            "departTime": se._flightService.itemFlightCache.departFlight.departTime,
            "landingTime": se._flightService.itemFlightCache.departFlight.landingTime,
            "flightDuration": se._flightService.itemFlightCache.departFlight.flightDuration,
            "fromPlaceCode": se._flightService.itemFlightCache.departFlight.fromPlaceCode,
            "toPlaceCode": se._flightService.itemFlightCache.departFlight.toPlaceCode,
            "stops": se._flightService.itemFlightCache.departFlight.stops,
            "ticketClass": se._flightService.itemFlightCache.departFlight.ticketClass,
            "fareBasis": se._flightService.itemFlightCache.departFlight.fareBasis,
            "jsonObject": ""
          },
          {
            "flightNumber": se._flightService.itemFlightCache.returnFlight.flightNumber ,
            "airLineCode": se._flightService.itemFlightCache.returnFlight.airlineCode,
            "departTime": se._flightService.itemFlightCache.returnFlight.departTime,
            "landingTime": se._flightService.itemFlightCache.returnFlight.landingTime,
            "flightDuration": se._flightService.itemFlightCache.returnFlight.flightDuration,
            "fromPlaceCode": se._flightService.itemFlightCache.returnFlight.fromPlaceCode,
            "toPlaceCode": se._flightService.itemFlightCache.returnFlight.toPlaceCode,
            "stops": se._flightService.itemFlightCache.returnFlight.stops,
            "ticketClass": se._flightService.itemFlightCache.returnFlight.ticketClass,
            "fareBasis": se._flightService.itemFlightCache.returnFlight.fareBasis,
            "jsonObject": ""
          }
        ] : 
        [
          {
            "flightNumber": se._flightService.itemFlightCache.departFlight.flightNumber ,
            "airLineCode": se._flightService.itemFlightCache.departFlight.airlineCode,
            "departTime": se._flightService.itemFlightCache.departFlight.departTime,
            "landingTime": se._flightService.itemFlightCache.departFlight.landingTime,
            "flightDuration": se._flightService.itemFlightCache.departFlight.flightDuration,
            "fromPlaceCode": se._flightService.itemFlightCache.departFlight.fromPlaceCode,
            "toPlaceCode": se._flightService.itemFlightCache.departFlight.toPlaceCode,
            "stops": se._flightService.itemFlightCache.departFlight.stops,
            "ticketClass": se._flightService.itemFlightCache.departFlight.ticketClass,
            "fareBasis": se._flightService.itemFlightCache.departFlight.fareBasis,
            "jsonObject": ""
          }
        ],
        "totalAdult": se._flightService.itemFlightCache.adult,
        "totalChild": se._flightService.itemFlightCache.child,
        "totalInfant": se._flightService.itemFlightCache.infant
      ,
    } }: '' };
      let strUrl = C.urls.baseUrl.urlMobile + '/api/data/validpromocode';
      this.gf.RequestApi('POST', strUrl, headers, body, 'flightAddService', 'promofunc').then((data)=>{

        se.zone.run(() => {
          var json = data;
          se.promotionCode="";
          if (json.error == 0) {
            se.msg = json.msg;
            se.ischecktext = 0;
            se.ischeckerror = 0;
            se.discountpromo = json.data.orginDiscount ? json.data.orginDiscount : json.data.discount;
            se.promotionCode=se.promocode;
            se._voucherService.flightPromoCode = se.promocode;
            se._voucherService.flightTotalDiscount = se.discountpromo;
            se.strPromoCode = se.promocode;
            se.totaldiscountpromo = se.discountpromo;
            //se._flightService.itemFlightCache.promotionCode = se.promocode;
            //se._flightService.itemFlightCache.discount = json.data.orginDiscount ? json.data.orginDiscount : json.data.discount;
            se.totalPriceAll(0);
          }
          else if (json.error == 1) {
            se.msg = json.msg;
            se.discountpromo = 0;
            se.ischecktext = 1;
            se.ischeckerror = 1;
          }
          else if (json.error == 2) {
            se.msg = json.msg;
            se.discountpromo = 0;
            se.ischecktext = 2;
            se.ischeckerror = 1;
          }
          else if (json.error == 3) {
            se.msg = json.msg;
            se.discountpromo = 0;
            se.ischecktext = 2;
            se.ischeckerror = 1;
          }
          else {
            se.msg = json.msg;
            se.discountpromo = 0;
            se.ischecktext = 2;
            se.ischeckerror = 1;
          }
        })
      });
    }
  }
  textchange() {
    this.discountpromo=0;
    this.ischeckerror=0;
    this.msg="";
    this.ischecktext=3;
    this.promotionCode="";
    this.totalPriceAll(0);
  }
  async showinfoCathay(){
     this.alert = await this.alertCtrl.create({
      header:'Bảo hiểm trễ chuyến',
      message: 'Có thêm quyền lợi khi chuyến bay bị thay đổi trễ hoặc hủy chuyến. <u >Xem quy chế</u>',
      cssClass: 'action-sheets-flight-cathay',
      buttons: [
        {
          text: 'OK',
          cssClass:"btn-ok",
          handler: () => {
            
          }
        }
      ]
    });
    const utag = document.querySelector('u');
    if (utag) {
      utag.setAttribute('style', 'color: #00c1de;');
      utag.addEventListener("click", (e)=>{
        this.noteCathay();
    });
    }
    this.alert.present();
  }
  noteCathay(){
    this.navCtrl.navigateForward('/insurrancenote');
  }
  toggleCathay(ev){
    this.isCathay=ev.detail.checked;
    this._flightService.itemFlightCache.isCathay = ev.detail.checked;
    if (this.isCathay) {
      this._flightService.itemFlightCache.priceCathay = this.priceCathay;
      if(this.roundtrip){
        this._flightService.itemFlightCache.InsuranceType = 3;
      }
      else{
        this._flightService.itemFlightCache.InsuranceType = 2;
      }
    }else{
      this._flightService.itemFlightCache.InsuranceType=0;
      this._flightService.itemFlightCache.priceCathay = 0;
    }
    this.totalPriceAll(0);
  }
  checkAddCathayTime() {
    let now: any = new Date();
    let flightDT: any = this.parseDatetime(
      moment(this.departFlight.departTime).format("DD-MM-YYYY"),
      this.departFlight.departTimeDisplay
    );
    let hours = (flightDT-now) / 36e5;
    return hours > 6 ? true : false;
  }
  parseDatetime(date: string, time: string) {
    let dateObj = date.split("-");
    let dtStr = dateObj[1] + "/" + dateObj[0] + "/" + dateObj[2] + " " + time;
    return new Date(dtStr);
  }
  getpriceCathay() {
    var se = this;
      let headers = {
        'postman-token': '37a7a641-c2dd-9fc6-178b-6a5eed1bc611',
          'cache-control': 'no-cache',
          'content-type': 'application/json'
      };
      let body = { code: se.promocode, totalAmount: se._flightService.itemFlightCache.totalPrice}
      let strUrl = C.urls.baseUrl.urlMobile+'/api/Dashboard/GetPriceCathay?roundtrip='+this.roundtrip+'&pax='+this._flightService.itemFlightCache.pax+'';
      this.gf.RequestApi('GET', strUrl, headers, body, 'flightAddDetails', 'getpriceCathay').then((data)=>{

        if (data) {
          let jsondata = data;
          se.priceCathay=jsondata.priceCathay;
          se._flightService.itemFlightCache.InsuranceType=0;
          se._flightService.itemFlightCache.priceCathay=0;
        }
    })
  }

  getCheckAirportDiChung() {
    var se = this;
    let headers = {
    };
    let strUrl = C.urls.baseUrl.urlMobile+'/api/Dashboard/CheckAirportDiChung?airportCode_First='+this._flightService.itemFlightCache.departCode+'&airportCode_Second='+this._flightService.itemFlightCache.returnCode+'&internal_AirporFirst='+se._flightService.itemFlightCache.dataBooking.fromPlace.internal+'&internal_AirporSecond='+se._flightService.itemFlightCache.dataBooking.toPlace.internal+'';
    this.gf.RequestApi('GET', strUrl, headers, {}, 'flightAddDetails', 'CheckAirportDiChung').then((data)=>{

      if (data) {
        let jsondata = data;
        se._flightService.itemFlightCache.isAirportFirst=jsondata.data.isAirportFirst;
        se._flightService.itemFlightCache.isAirportSecond=jsondata.data.isAirportSecond;
      }
  })
  }

  async showAlertPromoCode() {
    var se = this;
    const overlays = document.querySelectorAll('ion-alert, ion-modal');
    const overlaysArr = Array.from(overlays) as HTMLIonOverlayElement[];
    let msg = `Mã voucher ${se._flightService.itemFlightCache.hasvoucher} đang dùng cho đơn hàng ${se._flightService.itemFlightCache.pnr.resNo} Vui lòng chọn lại vé nếu quý khách muốn tiếp tục thay đổi`;
    let alert = await se.alertCtrl.create({
      message: msg,
      cssClass: "cls-alert-choiceseat",
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          role: 'OK',
          handler: () => {
            overlaysArr.forEach(o => o.dismiss());
            this.goback();
          }
        },
        {
          text: 'Hủy',
          role: 'Cancel',
          handler: () => {
            this.promocode = "";
            this.promotionCode = "";
            this.discountpromo = 0;
            this.strPromoCode = '';
            this.totaldiscountpromo = 0;
            this._flightService.itemFlightCache.promotionCode = "";
            this._flightService.itemFlightCache.discount = 0;
            this._flightService.itemFlightCache.discountpromo = 0;
            this._voucherService.voucherSelected = [];
            this._voucherService.listPromoCode = "";
            this._voucherService.listObjectPromoCode = [];
            this._voucherService.totalDiscountPromoCode = 0;
            this._voucherService.flightPromoCode ="";
            this._voucherService.flightTotalDiscount=0;
            se.totalPriceAll(0);
            overlaysArr.forEach(o => o.dismiss());
          }
        }
      ]
    });
    alert.present();
  }

  async showAlertChoiceHotelCity(){
    var se = this;
    let msg ='Không thể tạo lại đơn hàng cũ.Vui lòng chọn lại vé khác!';
    let alert = await se.alertCtrl.create({
      message: msg,
      cssClass: "cls-alert-choiceseat",
      backdropDismiss: false,
      buttons: [
      {
        text: 'OK',
        role: 'OK',
        handler: () => {
        this.goback();
        }
      },
      {
        text: 'Huỷ',
        role: 'Cancel',
        handler: () => {
          alert.dismiss();
        }
      }
    ]
  });
  alert.present();
  }


buildStringPromoCode(){
  
  if(this._voucherService.voucherSelected && this._voucherService.voucherSelected.length >0){
    this.strPromoCode = this._voucherService.voucherSelected.map(item => item.code).join(', ');
    this.totaldiscountpromo = this._voucherService.voucherSelected.map(item => item.rewardsItem).reduce((total,b)=>{ return total + b.price; }, 0);
  }else{
    this.strPromoCode = '';
    this.totaldiscountpromo = 0;
  }

  if(this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0){
    if(this.strPromoCode){
      this.strPromoCode += ', '+this._voucherService.listPromoCode.join(', ');
    }else{
      this.strPromoCode += this._voucherService.listPromoCode.join(', ');
    }
      
      this.totaldiscountpromo += this._voucherService.totalDiscountPromoCode;
  }
  this._voucherService.flightPromoCode = this.strPromoCode;
  this._voucherService.flightTotalDiscount = this.totaldiscountpromo;
}

async showAlertVoucherUsed() {
  var se = this;
  let msg = `Mã voucher ${se._flightService.itemFlightCache.hasvoucher} đang dùng cho đơn hàng ${se._flightService.itemFlightCache.pnr.resNo}. Vui lòng chọn lại vé nếu quý khách muốn tiếp tục thay đổi`;
  let alert = await se.alertCtrl.create({
    message: msg,
    cssClass: "cls-alert-choiceseat",
    backdropDismiss: false,
    buttons: [
      {
        text: 'OK',
        role: 'OK',
        handler: () => {
          alert.dismiss();
          this.goback();
        }
      },
      {
        text: 'Hủy',
        role: 'Cancel',
        handler: () => {
          alert.dismiss();
        }
      }
    ]
  });
  alert.present();
}


async showFlightInfo(isdepart) {
  this._flightService.itemFlightInternationalInfo = isdepart ? this._flightService.itemFlightCache.departFlight : this._flightService.itemFlightCache.returnFlight;
  this._flightService.indexFlightInternational = 0;
  let item = this._flightService.itemFlightInternational;
 
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
openLinkPromoCathay() {
  var se = this;
  const options: InAppBrowserOptions = {
    zoom: 'no',
    location: 'yes',
    toolbar: 'yes',
    hideurlbar: 'yes',
    closebuttoncaption: 'Đóng',
    hidenavigationbuttons: 'yes'
  };
  se._inAppBrowser = se.iab.create('https://rd.zapps.vn/detail/3888313238733373810?id=0089ad8733c2da9c83d3&pageId=3888313238733373810', '_self', options);
}
async showFlightDetail(item, isdepart){
  var se = this;
  if(se.isApiDirect){
    se.showFlightInfo(isdepart);
  }else{
    se._flightService.itemFlightCache.itemFlight = item;
    se._flightService.showFlightDetailFrom = 'flightaddservice';
    const modal: HTMLIonModalElement =
    await se.modalCtrl.create({
      component: FlightdetailPage,
    });
    modal.present();
  }
 
}
async selectDateOfBirth(pax, isChangeBOD){
  let se = this;
  if(!se.allowClickDateOfBirth){
    return;
  }
  se.allowClickDateOfBirth = false;
  se.activityService.itemPax = pax;
  se.activityService.itemPax.isChangeBOD = isChangeBOD;
    let modal = await se.modalCtrl.create({
      component: SelectDateOfBirthPage,
      cssClass: 'cls-flight-addservice-selectdatetime'
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

/**
         * @param inputcheck đối tượng check
         * @param type: 1 - giới tính; 2 - name;
         * @param isadult: true - là người lớn
         */
checkInput() :Promise<any>{
  var se = this;
  return new Promise((resolve, reject) => {
    if(se._flightService.itemFlightCache.adults && se._flightService.itemFlightCache.adults.length >0){
      for (let index = 0; index < se._flightService.itemFlightCache.adults.length; index++) {
        const element = se._flightService.itemFlightCache.adults[index];
        if(!element.dateofbirth){
          se.gf.showAlertMessageOnly('Vui lòng nhập ngày sinh Người lớn'+(element.id));
          resolve(false);
        }
        if(element.dateofbirth){
          let diffdate = moment(new Date()).diff(element.dateofbirth, 'months');
          if(diffdate < 144){
            se.gf.showAlertMessageOnly( "Vui lòng nhập ngày sinh Người lớn "+(element.id)+" trên 12 tuổi");
            resolve(false);
          }
        }
      }
    }

    if(se._flightService.itemFlightCache.childs && se._flightService.itemFlightCache.childs.length >0){
      for (let index = 0; index < se._flightService.itemFlightCache.childs.length; index++) {
        const elementChild = se._flightService.itemFlightCache.childs[index];
        
        if(!elementChild.dateofbirth){
          se.gf.showAlertMessageOnly("Vui lòng nhập ngày sinh "+ (!elementChild.isInfant ? "Trẻ em" : "Em bé") +" "+ (!elementChild.isInfant ? elementChild.id : elementChild.iddisplay));
          resolve(false);
        }
      
        if(elementChild.dateofbirth){
          let returndate = se._flightService.itemFlightCache.roundTrip ? moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD') : moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');
          let returndatestring = moment(returndate).format('DD-MM-YYYY');
                      //Check độ tuổi trẻ em > 2
                      if(!elementChild.isInfant && moment(returndate).diff(moment(elementChild.dateofbirth).format('YYYY-MM-DD'), 'months') < 24){
                        se.gf.showAlertMessageOnly( "Vui lòng nhập ngày sinh Trẻ em "+(!elementChild.isInfant ? elementChild.id : elementChild.iddisplay) +" lớn hơn hoặc bằng 2 tuổi so với ngày về "+returndatestring);
                        resolve(false);
                      }
                      //Check độ tuổi trẻ em <12
                      if(!elementChild.isInfant && moment(returndate).diff(moment(elementChild.dateofbirth).format('YYYY-MM-DD'), 'months') >= 144){
                        se.gf.showAlertMessageOnly( "Vui lòng nhập ngày sinh Trẻ em "+(!elementChild.isInfant ? elementChild.id : elementChild.iddisplay) +" không được lớn hơn 12 tuổi so với ngày về "+returndatestring);
                        resolve(false);
                      }
                      
                      //Check độ tuổi của em bé <14 ngày
                      if(elementChild.isInfant && moment(returndate).diff(moment(elementChild.dateofbirth).format('YYYY-MM-DD'), 'days') < 14){
                          se.gf.showAlertMessageOnly("Vui lòng nhập ngày sinh Em bé "+ (!elementChild.isInfant ? elementChild.id : elementChild.iddisplay) +" lớn hơn 14 ngày tuổi so với ngày về "+returndatestring);
                          resolve(false);
                      }
                      
                      //Check độ tuổi của em bé <2
                      if(elementChild.isInfant && moment(returndate).diff(moment(elementChild.dateofbirth), 'months') >= 24){
                          se.gf.showAlertMessageOnly( "Vui lòng nhập ngày sinh Em bé "+ (!elementChild.isInfant ? elementChild.id : elementChild.iddisplay) +" không được lớn hơn 2 tuổi so với ngày về "+returndatestring);
                          resolve(false);
                      }
                     
        }
      }
    }
    resolve(true);
  })
  
   
}

gotopaymentpage(){
  var se = this;
  se._flightService.itemFlightCache.backtochoiceseat = false;
    
  se.updatePassengerInfo().then((data)=>{
    if(!data.error){
      
      se._flightService.itemFlightCache.pnr = data;
      if(se._flightService.itemFlightCache.totalPrice==0)
                  {
                   
                    let itemcache = se._flightService.itemFlightCache;
                    itemcache.ischeckpayment = 0;
                    this.gf.checkTicketAvaiable(this._flightService.itemFlightCache).then((check) =>{
                      if(check){
                        var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=office&source=app&amount=' + itemcache.totalPrice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + (itemcache.pnr.bookingCode ?itemcache.pnr.bookingCode:  itemcache.pnr.resNo) + '&memberId=' + se.jti + '&rememberToken=&buyerPhone=' + itemcache.phone+'&version=2';
                                    se.gf.CreatePayoo(url).then((data) => {
                                      se.gf.hideLoading();
                                    if(data.success){
                                      se._flightService.itemFlightCache.ischeckpayment= 1;
                                          se.navCtrl.navigateForward('flightpaymentdone/'+(se._flightService.itemFlightCache.pnr.bookingCode ?se._flightService.itemFlightCache.pnr.bookingCode:  se._flightService.itemFlightCache.pnr.resNo)+'/'+moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD')+'/'+moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD'));
                                        }else{
                                          se.gf.showAlertOutOfTicket(se._flightService.itemFlightCache, 2, false);
                                          se.gf.hideLoading();
                                        }
                                  })
                          }
                          else{
                            se.gf.showAlertOutOfTicket(se._flightService.itemFlightCache, 2, false);
                            se.gf.hideLoading();
                          }
                    })
                  }
                  else{
                    se.gf.hideLoading();
                    se.navCtrl.navigateForward('/flightpaymentselect');
                  }
    }else{
      se.gf.showToastWarning(data.error);
      se.gf.hideLoading();
    }
  })
}
}
