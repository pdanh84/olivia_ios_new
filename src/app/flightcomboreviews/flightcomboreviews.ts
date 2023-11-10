import { child } from '../providers/book-service';
import { AdddiscountPage } from './../adddiscount/adddiscount.page';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, Platform, LoadingController, ToastController } from '@ionic/angular';
import { Booking, ValueGlobal, RoomInfo, Bookcombo, SearchHotel } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction, ActivityService } from '../providers/globalfunction';

import jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { FlightDeparturePage } from '../flightdeparture/flightdeparture';
import { OverlayEventDetail } from '@ionic/core';
import { RequestComboPage } from '../requestcombo/requestcombo';
import * as $ from 'jquery';
import { FlightcomboupgraderoomPage } from '../flightcomboupgraderoom/flightcomboupgraderoom.page';
import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';
import { SelectDateRangePage } from '../selectdaterange/selectdaterange.page';
import { voucherService } from '../providers/voucherService';
//import { Appsflyer } from '@ionic-native/appsflyer/ngx';
/**
 * Generated class for the FacilitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-flightcomboreviews',
  templateUrl: 'flightcomboreviews.html',
  styleUrls: ['flightcomboreviews.scss'],
})
export class FlightComboReviewsPage implements OnInit {
  promocode; pointshow
  Avatar; Name; Address; cin; cout; dur; room; nameroom; jsonroom; textage = ""; arrchild
  roomnumber; adults; children; breakfast; PriceAvgPlusTAStr: any = 0; ischeckpoint = false; TotalPrice;
  imgroom; roomtype; indexme; indexroom; cin1; cout1; point; price; ischeck = false; Pricepoint; Pricepointshow; roomcancel;
  titlecombo; TravPaxPrices;
  allowPaymentOnline = false;
  isJetstarFlight = false;
  hasAllotment = false;
  listDeparture:any = [];
  //listReturn =[];
  listDepart: any;
  listReturn: any;
  de_departtime; re_departtime;
  de_departdatestr;
  ar_departtime; ar_returntime; ar_departdatestr;
  de_flightpricetitle; ar_flightpricetitle;
  de_departpriceincrease = false;
  de_returnpriceincrease = false;
  ar_departpriceincrease = false;
  ar_returnpriceincrease = false;
  loadflightpricedone = false;
  paxtitle = '';
  daydeparttitle;
  dayreturntitle;
  currentDepartFlight: any;
  currentReturnFlight: any;
  objhoteldetail: any;
  roomclass: any;
  basepricesale;
  duration;
  loadpricedone = false;
  adultCombo = 2;
  elementMealtype;
  username;
  email;
  adultUnit = 0;
  commissionAdult = 0;
  adultUnitExb = 0;
  childUnit = 0;
  infantUnit = 0;
  departTicketSale = 0;
  returnTicketSale = 0;
  transportPriceSale = 0;
  transportPriceNet = 0;
  transportPriceSaleForChild = 0;
  transportPriceNetForChild = 0;
  totalPriceSale = 0;
  totalSurchargeWeekendFee = 0;
  totalTransportPriceSale = 0;
  TotalPriceCombo = 0;
  totalAirLineLuggage = 0;
  totalPriceForEXBA = 0;
  totalPriceForChildCWE = 0;
  totalPriceForChildEXBC = 0;
  totalPriceInfant = 0;
  totalPriceForOtherFee = 0;
  totalGetSubPriceForAdultExtrabed = 0;
  totalGetSubPriceForChild = 0;
  totalQuantityChildCWEAndEXBC = 0;
  totalQuantityFlightForChildAndInfant = 0;
  totalQuantityFlightForChild = 0;
  totalPriceChild = 0;
  ChildOtherFeeTotal = 0;
  ChildOtherFee = 0;
  FlightDepartSelected: any;
  FlightReturnSelected: any;
  totalChild = 0;
  totalAdult = 0;
  totalInfant = 0;
  totalFlightDepart = 0;
  totalFlightReturn = 0;
  commissionFlight = 0;
  commissionDepart = 0;
  Commission = 0;
  AdultCombo = 0;
  totalAdultExtrabed = 0;
  totalExtraBedAndGalaDinerListTA = 0;
  AdultOtherFee = 0;
  roomPriceSale = 0;
  TotalNight = 0;
  PriceDiffUnit = 0;
  adultFlightNumber = 0;
  JsonSurchargeFee =
    {
      RoomDifferenceFee: 0,
      AdultUnit: 0,
      DepartTicketDifferenceFee: 0,
      TransportPriceSale: 0,
      ReturnTicketDifferenceFee: 0,
      BaggageDepart: 0,
      BaggageReturn: 0,
      SurchargeWeekendFee: 0,
      SurchargeFee: [] as any,
      TotalAll: 0,
      ComboData: {}
    };
  ComboPriceDiff = {
    RoomDiff: { AdultUnit: 0, ChildUnit: 0, Total: 0 },
    DepartFlightDiff: { AdultUnit: 0, AdultUnitExb: 0, ChildUnit: 0, InfantUnit: 0, Total: 0, CommissionAdult: 0 },
    ReturnFlightDiff: { AdultUnit: 0, AdultUnitExb: 0, ChildUnit: 0, InfantUnit: 0, Total: 0, CommissionAdult: 0 },
  };
  infant = 0; intervalID; listkeys:any = []; flightdeparttitle; bookcombodetail; fromPlace = ""; toPlace = "";
  departfi:any = []; returnfi:any = []; childrendisplay = 0; adulsdisplay = 0;
  loaddatafromcache: boolean = false; discountpromo; msg; ischecktext = 0; ischeckerror = 0; ischeckbtnpromo = false; ischeckpromo
  objInsurranceFee: any;
  hasInsurrance: any;
  showInsurranceText: any; textpromotion = "Nhập mã giảm giá";
  public myCalendar: any;
  _daysConfig: any[] = [];
  cofdate: number;
  cotdate: number;
  cinthu: string;
  coutthu: string;
  stoprequest: boolean = false;
  allowSearch: boolean = true;
  allowSearchReturn: boolean = true; loader: any;
  cinthudisplay: string;
  coutthudisplay: string; Rating; departlocationdisplay; returnlocationdisplay;
  cindisplay; coutdisplay; index; RoomType; operatedBydep = ""; operatedByret = "";
  departConditionInfo: any; returnConditionInfo: any;
  ischecklugage = false;
  //thay đổi chuyến bay có thay đổi thì true
  ischangefly = true;
  allowclickcalendar: boolean = true;
  departLuggage: any = [];
  returnLuggage: any = [];
  totaldepluggage = 0;
  totalretluggage = 0;
  ischeckcalendar=true;elementRooom: any;
  arrBOD: any;
  msgEmptyFlight: string;
  ischeckwaitlug: boolean;
  currentReturnSeriFlight: any = [];
  ischeckBOD: boolean;
  statusRoom: any;
  itemVoucherCombo: any;
  strPromoCode: string;
  totaldiscountpromo: number;
  adultsdisplay: number;
  constructor(public platform: Platform, public valueGlobal: ValueGlobal, public navCtrl: NavController, private Roomif: RoomInfo, public zone: NgZone,
    public booking: Booking, public storage: Storage, public alertCtrl: AlertController, public value: ValueGlobal, public modalCtrl: ModalController, public gf: GlobalFunction,
    public bookCombo: Bookcombo, public searchhotel: SearchHotel, public loadingCtrl: LoadingController,
    public activityService: ActivityService,
    private toastCtrl: ToastController,
    private fb: Facebook,
    public _voucherService: voucherService) {
   

    this.Avatar = Roomif.imgHotel;
    this.Name = booking.HotelName;
    this.Address = Roomif.Address;
    this.cin = moment(this.gf.getCinIsoDate(booking.CheckInDate)).format('YYYY-MM-DD');
    this.cout = moment(this.gf.getCinIsoDate(booking.CheckOutDate)).format('YYYY-MM-DD');
    this.cinthudisplay = this.getDayOfWeek(this.cin);
    this.coutthudisplay = this.getDayOfWeek(this.cout);
    this.duration = moment(this.cout).diff(moment(this.cin), 'days');

    var cintemp = new Date(this.gf.getCinIsoDate(this.cin));
    this.cindisplay = moment(cintemp).format('DD') + ' ' + 'thg' + ' ' + moment(cintemp).format('MM')

    var couttemp = new Date(this.gf.getCinIsoDate(this.cout));
    this.coutdisplay = moment(couttemp).format('DD') + ' ' + 'thg' + ' ' + moment(couttemp).format('MM')


    this.TotalNight = this.duration;
    this.dur = this.duration;
    this.roomnumber = Roomif.roomnumber;
    this.adults = booking.Adults;
    this.totalAdult = booking.Adults;
    if (booking.Child) {
      this.children = booking.Child;
    }
    else {
      this.children = 0;
    }
    this.totalChild = booking.Child;
    this.Rating = this.booking.RatingHotel
    this.roomtype = Roomif.roomtype;

    this.jsonroom = {...Roomif.jsonroom};
    this.room = Roomif.arrroom;
   
    if(typeof(this.cin) == "string" && this.cin.indexOf('-') != -1){
      var chuoicin = this.cin.split('-');
      var chuoicout = this.cout.split('-');
      this.cin = chuoicin[2] + "-" + chuoicin[1] + "-" + chuoicin[0];
      this.cout = chuoicout[2] + "-" + chuoicout[1] + "-" + chuoicout[0];
    }else{
      this.cin = moment(this.cin).format('MM-DD-YYYY');
      this.cout = moment(this.cout).format('MM-DD-YYYY');
    }
    
    this.nameroom = this.room[0].ClassName;
    //this.roomcancel = this.room[0].MealTypeRates[this.indexme];
    this.breakfast = this.bookCombo.MealTypeName;
    //this.PriceAvgPlusTAStr = this.booking.cost.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    this.value.flagreview = 1;
    // this.titlecombo = this.bookCombo.ComboTitle;
    this.titlecombo = this.valueGlobal.titlecombo;
    this.searchhotel.gaComboName = this.valueGlobal.titlecombo;
    this.searchhotel.gaComboId= this.bookCombo.HotelCode || '';
    this.objInsurranceFee = this.bookCombo.objInsurranceFee;
    this.hasInsurrance = this.bookCombo.hasInsurrance;
    this.showInsurranceText = this.hasInsurrance ? this.hasInsurrance : (this.bookCombo.checkInsurranceFee ? true : false);
    var cb;
    this.loadComboData(cb);
    this.getHotelContractPrice(this.bookCombo.FormParam);
    this.roomPriceSale = this.basepricesale;
    this.totalInfant = this.infant;
    this.totalChild = this.children - this.infant;
    this.arrchild = this.searchhotel.arrchild;
    this.childrendisplay = this.children;

    this.adulsdisplay = this.booking.Adults;
    //PDANH 10/06/2019: Check tuổi trẻ em >=12 tuổi tính giá vé = người lớn
    if (this.arrchild) {
      for (let i = 0; i < this.arrchild.length; i++) {
        if (i == this.arrchild.length - 1) {
          this.textage = this.textage + this.arrchild[i].numage;
        } else {
          this.textage = this.textage + this.arrchild[i].numage + ",";
        }
        //PDANH 10/06/2019: Check tuổi trẻ em >=12 tuổi tính giá vé = người lớn
        if (this.arrchild[i].numage >= 12) {
          this.children--;
          this.totalChild--;
          this.adults++;
          this.totalAdult++;
        }
      }
      if (this.textage) {
        this.textage = "(" + this.textage + ")";
      }
    }
    if (this.adulsdisplay > 0) {
      this.paxtitle += this.adulsdisplay + ' người lớn'
    }
    if (this.childrendisplay > 0) {
      this.paxtitle += ', ' + this.childrendisplay + ' trẻ em'
    }
    this.storage.get('point').then(point => {
      if (point) {
        if (point > 0) {
          this.pointshow = point;
          this.Roomif.point = point;
          this.point = point * 1000;
          this.price = this.point.toLocaleString();
        }
      }
    });
    this.storage.get('username').then(name => {
      if (name !== null) {
        this.username = name;
      }
    })
    this.storage.get('email').then(e => {
      if (e !== null) {
        this.email = e;
      }
    })
    this.booking.ChildAge.forEach(element => {
      if (element == "<1" || Number(element) < 2) {
        this.infant += 1;
      }
    });
    //clear cache sau 15p
    this.intervalID = setInterval(() => {
      if (this.listkeys.length > 0) {
        this.listkeys.forEach(key => {
          this.storage.remove(key);
        });
      }
    }, 60000 * 15);
    this.loadLunar();
  }

  loadLunar() {
    var se = this;
    if (se.valueGlobal.listlunar && se.valueGlobal.listlunar.length > 0) {
      se.cofdate = 0;
      se.cotdate = 0;
      se.bindlunar();
      for (let j = 0; j < se.valueGlobal.listlunar.length; j++) {
        se._daysConfig.push({
          date: se.valueGlobal.listlunar[j].date,
          subTitle: se.valueGlobal.listlunar[j].name,
          cssClass: 'lunarcalendar'
        })
      }
    }

  }
  checklunar(s) {
    return s.indexOf('Mùng') >= 0;
  }
  bindlunar() {
    var se = this;
    for (let i = 0; i < se.valueGlobal.listlunar.length; i++) {
      var checkdate = moment(se.valueGlobal.listlunar[i].date).format('YYYY-MM-DD');
      if (checkdate == se.cin) {
        se.cofdate = 1;
        if (se.valueGlobal.listlunar[i].isNameDisplay == 1) {
          var ischecklunar = se.checklunar(se.valueGlobal.listlunar[i].name);
          if (ischecklunar) {
            se.cinthu = se.valueGlobal.listlunar[i].name + ' ' + 'tết';
          }
          else {
            se.cinthu = se.valueGlobal.listlunar[i].name
          }
        }
      }
      else {
        se.getDayName(se.cin, se.cout);
      }
      if (checkdate == se.cout) {
        se.cotdate = 1;
        if (se.valueGlobal.listlunar[i].isNameDisplay == 1) {
          var ischecklunar = se.checklunar(se.valueGlobal.listlunar[i].name);
          if (ischecklunar) {
            se.coutthu = se.valueGlobal.listlunar[i].name + ' ' + 'tết';
          }
          else {
            se.coutthu = se.valueGlobal.listlunar[i].name
          }
        }
      }
      else {
        se.getDayName(se.cin, se.cout);
      }
    }
  }
  getDayName(datecin, datecout) {
    if (!this.cinthu) {
      this.cinthu = moment(datecin).format('dddd');
      switch (this.cinthu) {
        case "Monday":
          this.cinthu = "Thứ 2"
          break;
        case "Tuesday":
          this.cinthu = "Thứ 3"
          break;
        case "Wednesday":
          this.cinthu = "Thứ 4"
          break;
        case "Thursday":
          this.cinthu = "Thứ 5"
          break;
        case "Friday":
          this.cinthu = "Thứ 6"
          break;
        case "Saturday":
          this.cinthu = "Thứ 7"
          break;
        default:
          this.cinthu = "Chủ nhật"
          break;
      }
    }
    if (!this.coutthu) {
      this.coutthu = moment(datecout).format('dddd');
      switch (this.coutthu) {
        case "Monday":
          this.coutthu = "Thứ 2"
          break;
        case "Tuesday":
          this.coutthu = "Thứ 3"
          break;
        case "Wednesday":
          this.coutthu = "Thứ 4"
          break;
        case "Thursday":
          this.coutthu = "Thứ 5"
          break;
        case "Friday":
          this.coutthu = "Thứ 6"
          break;
        case "Saturday":
          this.coutthu = "Thứ 7"
          break;
        default:
          this.coutthu = "Chủ nhật"
          break;
      }
    }
  }

  ngOnInit() {
    this.bookCombo.itemFlightLuggagePriceChange.subscribe((data) => {
      if (data) {
        var objectFlight = this.gf.getParams('flightcombo');
        // var total=Number(this.JsonSurchargeFee.TotalAll)+Number(this.bookCombo.Luggage);
        // this.TotalPrice=total;
        if (this.departConditionInfo && this.departConditionInfo.luggageSigned && this.departConditionInfo.luggageSigned.length <= 4) {
          this.totaldepluggage = Number(this.departConditionInfo.luggageSigned);
        }
        else {
          this.totaldepluggage = 0;
        }

        if (this.returnConditionInfo && this.returnConditionInfo.luggageSigned && this.returnConditionInfo.luggageSigned.length <= 4) {
          this.totalretluggage = Number(this.returnConditionInfo.luggageSigned);
        }
        else {
          this.totalretluggage = 0;
        }
        this.edit();
        var totaldepartluggage = 0;
        var totalreturnluggage = 0;
        for (let index = 0; index < objectFlight.airLineLuggageDepart.length; index++) {
          const element = objectFlight.airLineLuggageDepart[index];
          if (element.quantity > 0) {
            totaldepartluggage = Number(totaldepartluggage) + Number((element.quantity * element.Weight));
          }
        }
        this.totaldepluggage = Number(this.totaldepluggage) + Number(totaldepartluggage);

        for (let index = 0; index < objectFlight.airLineLuggageReturn.length; index++) {
          const element = objectFlight.airLineLuggageReturn[index];
          if (element.quantity > 0) {
            totalreturnluggage = Number(totalreturnluggage) + Number((element.quantity * element.Weight));
          }
        }
        this.totalretluggage = Number(this.totalretluggage) + Number(totalreturnluggage);
      }
    })

    var se = this;
    se.bookCombo.upgradeRoomChange.pipe().subscribe((dataRoomChange)=>{
      if(dataRoomChange){
          se.updateRoomChange(dataRoomChange);
      }
  })
  
  this._voucherService.getFlightComboObservable().subscribe((itemVoucher)=> {
    if(itemVoucher){
      if(this.promocode && this.promocode != itemVoucher.code && !this.itemVoucherCombo){
        this._voucherService.rollbackSelectedVoucher.emit(itemVoucher);
        this.gf.showAlertMessageOnly(`Chỉ hỗ trợ áp dụng nhiều voucher tiền mặt trên một đơn hàng, Coupon và Voucher khuyến mãi chỉ áp dụng một`);
        return;
      }
      //this._voucherService.selectVoucher = itemVoucher;
      this.zone.run(()=>{
        let total = se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '');
          if (se.ischeck) {
            total = se.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
          }
        if(itemVoucher.claimed){
          this.itemVoucherCombo = itemVoucher;
          this.promocode = itemVoucher.code;
          this.discountpromo = itemVoucher.rewardsItem.price;
          this.bookCombo.promoCode = itemVoucher.code;
          this.bookCombo.discountpromo = this.discountpromo;
          this.ischeckbtnpromo = true;
          this.ischeckpromo = true;
          se.bookCombo.totalPriceBeforeApplyVoucher = total;
          this.Pricepointshow = total - this.discountpromo;
          this.buildStringPromoCode();
        }else{
          this.itemVoucherCombo = null;
          this.promocode = "";
          this.bookCombo.promoCode = "";
          this.bookCombo.discountpromo = 0;
          this.discountpromo = 0;
          this.ischeckbtnpromo = false;
          se.bookCombo.totalPriceBeforeApplyVoucher = null;
          this.Pricepointshow = total + itemVoucher.rewardsItem.price;
          this.buildStringPromoCode();
          if(this._voucherService.voucherSelected && this._voucherService.voucherSelected.length ==0 && this._voucherService.listPromoCode && this._voucherService.listPromoCode.length ==0){
            this.strPromoCode = '';
            this.totaldiscountpromo = 0;
            this.ischeckbtnpromo = false;
            this.ischeckpromo = false;
          }
        }
        this.edit();
      })
      
      //this.modalCtrl.dismiss();
    }
  })

  this._voucherService.getObservableClearVoucherAfterPaymentDone().subscribe((check)=> {
    if(check){
      this.itemVoucherCombo = null;
          this.promocode = "";
          this.bookCombo.promoCode = "";
          this.bookCombo.discountpromo = 0;
          this.discountpromo = 0;
          this.ischeckbtnpromo = false;

          this.strPromoCode = '';
          this.totaldiscountpromo = 0;
          this._voucherService.voucherSelected = [];
          this._voucherService.listPromoCode = "";
          this._voucherService.listObjectPromoCode = [];
          this._voucherService.totalDiscountPromoCode = 0;
          this._voucherService.comboFlightPromoCode = "";
          this._voucherService.comboFlightTotalDiscount = 0;

      this.edit();
    }
  })
  }

  /**Hàm sort list khách sạn theo giá, điểm trung bình 
     * PDANH 23/01/2018
     */
  sort(property, listsort) {
    var se = this;
    if (listsort && listsort.length > 0) {
      se.zone.run(() => listsort.sort(function (a, b) {
        let direction = -1;
        if (property == "priceAvg") {
          if (a[property] * 1 < b[property] * 1) {
            return 1 * direction;
          }
          else if (a[property] * 1 > b[property] * 1) {
            return -1 * direction;
          }
          // else if (a[property] * 1 == b[property] * 1 && a["rangeTime"] && b["rangeTime"]) {
          //   if (a["rangeTime"] >= 600 && a["rangeTime"] <= 720) {
          //     return 1 * direction;
          //   }
          //   else if (b["rangeTime"] >= 600 && b["rangeTime"] <= 720) {
          //     return -1 * direction;
          //   }
          //   else {
          //     return 1 * direction;
          //   }
          // }
        }
      }));
    }
  };

  /**
   * Load giá phòng của combo 
   * @param data - data giá phòng (Nếu không có dữ liệu = ko có phòng trống)
   */
  getHotelContractPrice(data) : Promise<any> {
    var se = this;
    return new Promise((resolve, reject) => {
      if (data) {
         data.IsPackageRateInternal = true;
         data.IsPackageRate = true;
         data.GetVinHms= 1;
         data.GetSMD= 1;
         data.IsB2B= true;
         data.IsSeri= true;
         data.IsAgoda= true;
         data.GetOTAPackage = 1;
         data.IsOccWithBed = false;
        let body = se.gf.getFormData(data);
        let form = data;
        form += '&IsPackageRateInternal=true&IsPackageRate=true&GetVinHms=true&GetSMD=true&IsB2B=true&IsSeri=true';
        let headers = {'content-type' : 'application/x-www-form-urlencoded', accept: '*/*'};
        let strUrl = C.urls.baseUrl.urlContracting + '/api/contracting/HotelSearchReqContractAppV2';
        this.gf.RequestApi('POST', strUrl, headers, body, 'flightComboReview', 'getHotelContractPrice').then((data)=>{

          se.zone.run(() => {
            var result = data;
            if (result.Hotels) {
              se.jsonroom = result.Hotels[0].RoomClasses;
              //Hàm tính tiền chênh khi nâng cấp phòng
             
              let cbp = se.bookcombodetail;
              var element = se.checkElement(se.jsonroom);
              
              if (element) {
                se.elementRooom= element;
                 //check lấy theo meal
                 var index=0;
                 for (let i = 0; i < element.MealTypeRates.length; i++) {
                   if (element.MealTypeRates[i].Code==se.bookCombo.MealTypeCode) {
                     index=i;
                     break;
                   }
                 }
  
                se.nameroom = element.ClassName;
                se.RoomType = element.RoomType;

                //se.breakfast = element.element.MealTypeRates[0].Name;
                se.roomnumber = element.TotalRoom;
                se.index=index;
                se.calculateDiffPriceUnit();
                se.callSummaryPrice(element,index);
                se.bookCombo.mealTypeRates = element;
                //se.getBOD(element.MealTypeRates[0].RoomId);
                se.arrBOD =  se.valueGlobal.notSuggestDaily;
                se.bookCombo.isHBEDBooking = element.Supplier == 'HBED' && element.HotelRoomHBedReservationRequest;
                se.bookCombo.isAGODABooking = element.Supplier == 'AGD' && element.HotelCheckDetailTokenAgoda;
                se.checkAllowPaylaterBookXML(element);
              } else {
                se.jsonroom = result.Hotels[0].RoomClassesRecomments;
                  //Hàm tính tiền chênh khi nâng cấp phòng
                 
                let cbp = se.bookcombodetail;
                var element = se.checkElement(se.jsonroom);
                se.elementRooom=element;
                
                //check lấy theo meal
                if (element) {
                  var index = 0;
                  for (let i = 0; i < element.MealTypeRates.length; i++) {
                    if (element.MealTypeRates[i].Code == se.bookCombo.MealTypeCode) {
                      index = i;
                      break;
                    }
                  }
                  if (element) {
                    se.elementRooom= element;
                    se.nameroom = element.ClassName;
                    se.roomnumber = element.TotalRoom;
                    se.RoomType = element.RoomType;
                    se.index = index;
                    se.calculateDiffPriceUnit();
                    se.callSummaryPrice(element, index);
                    se.getBOD(element.MealTypeRates[0].RoomId);
                    se.bookCombo.isHBEDBooking = element.Supplier == 'HBED' && element.HotelRoomHBedReservationRequest;
                    se.bookCombo.isAGODABooking = element.Supplier == 'AGD' && element.HotelCheckDetailTokenAgoda;
                    se.checkAllowPaylaterBookXML(element);
                  } else {
                    se.loadpricedone = true;
                  }
                
                  resolve(true);
                }
                else {
                  se.loadpricedone = true;
                  //Không valid thì hiển thị gửi yêu cầu
                  se.loadflightpricedone = true;
                  se.PriceAvgPlusTAStr = 0;
                  se.TotalPrice = 0;
                  resolve(false);
                }
              }
              resolve(true);
            } else {
              se.loadpricedone = true;
              se.PriceAvgPlusTAStr=0;
              se.loadflightpricedone = true;
              resolve(false);
            }
            
          })
        })
      }
    })
    
  }

  /**
   * Check room
   * @param object object mealtyperate
   * Updated PDANH 17/07/2019: Thêm kiểm tra allotment để chạy tool giữ vé
   */
  checkElement(object) {
    var el: any = null;
    var se = this;
    se.hasAllotment = false;
    object.forEach(element => {
      if (element && element.MealTypeRates[0].RoomId == se.bookcombodetail.roomId && !element.MSGCode) {
        el = element;
      }
    })

    if (!el) {
      var arr = object.filter(function (e) { return !e.MSGCode })
      if (arr && arr.length > 0) {
        el = arr[0];
      }
    }
    return el;
  }
  /**
   * Tính tổng tiền combo
   */
   callSummaryPrice(element,index) {
    var se = this;
    if (element && !element.MSGCode) {
      // Giá nhà cung cấp
      se.TravPaxPrices = element.MealTypeRates[index].PriceAvgPlusNet * se.roomnumber * se.TotalNight;

      se.roomclass = element;
      se.elementMealtype = element.MealTypeRates[index];
      se.bookCombo.mealTypeRates = element.MealTypeRates[index];
      se.breakfast= element.MealTypeRates[index].Name;
      se.statusRoom=element.MealTypeRates[index].Status;
      this.index=index;
      se.AdultCombo = element.Rooms[0].IncludeAdults * se.elementMealtype.TotalRoom;
      se.AdultCombo = se.AdultCombo > se.totalAdult ? se.totalAdult : se.AdultCombo;

      se.transportPriceSale = se.transportPriceSale * (se.totalAdult - se.AdultCombo);
      se.transportPriceNet = se.transportPriceNet * (se.totalAdult - se.AdultCombo);

      se.TotalPriceCombo = se.totalPriceSale * se.AdultCombo;
      se.totalAdultExtrabed = se.totalAdult - se.AdultCombo;
      se.MathGaladinnerAdExtrabed();
      if (se.currentDepartFlight != undefined) {
        se.SaveFlightDepartSelected();
      }
      if (se.currentDepartFlight != undefined) {
        se.SaveFlightReturnSelected();
      }
      se.MathPriceAll();
    }
  }
  /**
   * Hàm tính lại giá vé máy bay
   * PDANH 27/04/2019
   */
  getFlightPriceSale(departFlight, returnFlight): number {
    var se = this;
    var flightprice = 0;
    if (departFlight && departFlight.priceSummaries) {
      flightprice += departFlight.totalPrice;
      se.daydeparttitle = se.getDayOfWeek(new Date(this.gf.getCinIsoDate(departFlight.departTime))) + ', ' + moment(new Date(this.gf.getCinIsoDate(departFlight.departTime))).format('DD-MM-YYYY');
    } if (returnFlight && returnFlight.priceSummaries) {
      flightprice += returnFlight.totalPrice;
      se.dayreturntitle = se.getDayOfWeek(new Date(this.gf.getCinIsoDate(returnFlight.departTime))) + ', ' + moment(new Date(this.gf.getCinIsoDate(returnFlight.departTime))).format('DD-MM-YYYY');
    }
    if (!departFlight && !returnFlight) {
      let cb = se.bookcombodetail;
      flightprice = (cb.departTicketSale + cb.returnTicketSale) * se.adults;
    }
    return flightprice;
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }

  goback() {
    this._voucherService.rollbackSelectedVoucher.emit(this._voucherService.selectVoucher);
    this._voucherService.selectVoucher = null;
    if(moment(this.booking.CheckOutDate).format('DD-MM-YYYY') != moment(this.searchhotel.CheckOutDate).format('DD-MM-YYYY') || moment(this.booking.CheckInDate).format('DD-MM-YYYY') != moment(this.searchhotel.CheckInDate).format('DD-MM-YYYY'))
    {
      this.searchhotel.CheckInDate = this.booking.CheckInDate;
      this.searchhotel.CheckOutDate = this.booking.CheckOutDate;
      this.valueGlobal.notRefreshDetail = false;
    }else{
      this.valueGlobal.backValue = '';
    }
    
    this.stoprequest = true;
    this.loadpricedone = true;
    this.valueGlobal.backValue = 'flightcombo';
    this.navCtrl.navigateBack('/hoteldetail/' + this.booking.HotelId);
  }
  /**
   * Hàm lấy thông tin chuyến bay
   * PDANH 27/04/2019
   */
  loadFlightDataNew(hascache) {
    var se = this;
    se.resetValue();
    setTimeout(() => {
      se.stoprequest = true;
      se.loadpricedone = true;
      if (se.listDepart.length == 0 || se.listReturn.length == 0) {
        se.PriceAvgPlusTAStr = 0;
        se.loadflightpricedone=true;
        se.ischeckwaitlug=true;
        se.msgEmptyFlight = se.listDepart.length == 0 && se.listReturn.length == 0 ? 'Vé máy bay không có.' : (se.listDepart.length == 0 ? 'Vé máy bay chiều đi không có.' : 'Vé máy bay chiều về không có.');
      }
    }, 50 * 1000);

    se.checkLoadCacheData(hascache).then(data => {
      if (data) {
        se.stoprequest = false;
        se.loadFlightCacheDataByAirline(data, 'depart');

        se.loadFlightCacheDataByAirline(data, 'return');
      }
    })
  }
  checkLoadCacheData(hascache): Promise<any> {
    var se = this;
    se.stoprequest = true;
    return new Promise((resolve, reject) => {
      let objjson =
      {
        "requestFrom": {
          "fromPlace": se.bookCombo.ComboDetail.departureCode,
          "toPlace": se.bookCombo.arrivalCode,
          "departDate": moment(new Date(this.gf.getCinIsoDate(se.booking.CheckInDate))).format("YYYY-MM-DDTHH:mm:ss.SSS"),
          "returnDate": moment(new Date(this.gf.getCinIsoDate(se.booking.CheckInDate))).format("YYYY-MM-DDTHH:mm:ss.SSS"),
          "adult": se.adults,
          "child": (se.children - se.infant),
          "infant": se.infant,
          "version": "2.0"

        },
        "requestTo": {
          "fromPlace": se.bookCombo.arrivalCode,
          "toPlace": se.bookCombo.ComboDetail.departureCode,
          "departDate": moment(new Date(this.gf.getCinIsoDate(se.booking.CheckOutDate))).format("YYYY-MM-DDTHH:mm:ss.SSS"),
          "returnDate": moment(new Date(this.gf.getCinIsoDate(se.booking.CheckOutDate))).format("YYYY-MM-DDTHH:mm:ss.SSS"),
          "adult": se.adults,
          "child": (se.children - se.infant),
          "infant": se.infant,
          "version": "2.0"
        },
        "roundTrip": true,
        "noCache": hascache,
        'tcincharge': '89311',
      }

      let headers = {
        "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          'Content-Type': 'application/json; charset=utf-8'
      };
        let strUrl = C.urls.baseUrl.urlFlight + 'gate/apiv1/GetSessionFlight';
        this.gf.RequestApi('POST', strUrl, headers, objjson, 'flightComboReview', 'getHotelContractPrice').then((data)=>{

        if (data) {
          //console.log(body);
          resolve(data);
        }
      });

    })
  }
  loadFlightCacheDataByAirline(source, type) {
    var se = this;
    if (type == "depart") {
      se.allowSearch = false;
    } else {
      se.allowSearchReturn = false;
    }

    let urlfindflightincache = type == "depart" ? C.urls.baseUrl.urlFlight + "gate/apiv1/GetFlightDepart" : C.urls.baseUrl.urlFlight + "gate/apiv1/GetFlightReturn";
    let objbody = {
      "fromPlace": type == 'depart' ? se.bookCombo.ComboDetail.departureCode : se.bookCombo.arrivalCode,
      "toPlace": type == 'depart' ? se.bookCombo.arrivalCode : se.bookCombo.ComboDetail.departureCode,
      "departDate": type == 'depart' ? moment(new Date(this.gf.getCinIsoDate(se.booking.CheckInDate))).format("YYYY-MM-DDTHH:mm:ss.SSS") : moment(new Date(this.gf.getCinIsoDate(se.booking.CheckOutDate))).format("YYYY-MM-DDTHH:mm:ss.SSS"),
      "returnDate": type == 'depart' ? moment(new Date(this.gf.getCinIsoDate(se.booking.CheckInDate))).format("YYYY-MM-DDTHH:mm:ss.SSS") : moment(new Date(this.gf.getCinIsoDate(se.booking.CheckOutDate))).format("YYYY-MM-DDTHH:mm:ss.SSS"),
      "adult": se.adults,
      "child": (se.children - se.infant),
      "infant": se.infant,
      "sources": source,
      "version": "2.0"
    };

    let headers = {
      "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
        'Content-Type': 'application/json; charset=utf-8'
    };
      this.gf.RequestApi('POST', urlfindflightincache, headers, objbody, 'flightComboReview', 'getHotelContractPrice').then((data)=>{

        let result = data;
        if (type == "depart") {
          se.allowSearch = true;
        } else {
          se.allowSearchReturn = true;
        }
        if (result.stop) {
          se.stoprequest = result.stop;
        }
        if (result) {
          if (result.data && result.data.length > 0) {
            result.data.forEach(element => {
              var arrfly:any = [];
              for (let i = 0; i < element.flights.length; i++) {
                if (element.flights[i].stops == 0) {
                  arrfly.push(element.flights[i]);
                }
              }
              se.loadmultidata(arrfly, type);
            });

          }
          if (!result.stop && !se.stoprequest && type == 'depart' && se.allowSearch) {

            setTimeout(() => {
              se.zone.run(() => {
                source = result.sources;
              })
              se.loadFlightCacheDataByAirline(source, 'depart');
            }, 1500)
            // obj.countretry++;
          }
          else if (!result.stop && !se.stoprequest && type == 'return' && se.allowSearchReturn) {
            source = result.sources;
            setTimeout(() => {
              se.zone.run(() => {
                source = result.sources;
              })
              se.loadFlightCacheDataByAirline(source, 'return');
            }, 1500)
            // obj.countretry++;
          }
        }
      

    })
  }
  loadmultidata(data, type) {
    var se = this;
    let jsondata = data;
    se.ischeckwaitlug=false;
    //se.loadpricedone = true;
    se.zone.run(() => {
      if (type == 'depart') {
        if (!se.listDepart || (se.listDepart && se.listDepart.length == 0)) {
          se.listDepart = jsondata;
          //se.listDepartNoFilter = jsondata;
        }
        else {
          if (se.listDepart && se.listDepart.length > 0) {
            se.listDepart = [...se.listDepart, ...jsondata];
            //se.listDepartNoFilter = [...se.listDepart,...jsondata];
          }
        }
      }

      if (type == 'return') {
        if (!se.listReturn || (se.listReturn && se.listReturn.length == 0)) {
          se.listReturn = jsondata;
          //se.listReturnNoFilter = jsondata;
        }
        else {
          if (se.listReturn && se.listReturn.length > 0) {
            se.listReturn = [...se.listReturn, ...jsondata];
            //se.listReturnNoFilter = [...se.listReturn,...jsondata];
          }
        }
      }
      se.getdata();


    });
  }
  getdata() {
    var se = this;
    se.loadpricedone = true;
    // se.storage.set('listflight_' + se.booking.HotelId + '_' + se.booking.CheckInDate + '_' + se.booking.CheckOutDate + '_' + se.bookCombo.ComboDetail.departureCode + '_' + se.bookCombo.arrivalCode + '_' + se.adults + '_' + se.children + '_' + se.infant, jsondata);
    se.zone.run(() => {
      if (se.listDepart && se.listDepart.length > 0) {
        se.listDepart.forEach(element => {
          var priceFlightAdult = 0;
          element.priceSummaries.forEach(e => {
            if (e.passengerType == 0) {
              priceFlightAdult += e.price;
            }
          });
          //25/12/2020: Sửa lại lấy đúng giá giảm (sau khi trừ giá bán default)
          element.priceorder = priceFlightAdult - se.departTicketSale;
          if (element.airlineCode == "VietnamAirlines") {
            element.priceorder = element.priceorder * 0.75;
          }
          else if (element.airlineCode == "BambooAirways") {
            element.priceorder = element.priceorder * 0.8;
          }
          let ar_time = element.departTime.toString().split('T')[1];
          let Hour = ar_time.toString().split(':')[0];
          let Minute = ar_time.toString().split(':')[1];
          let kq = Hour * 60 + Number(Minute);
          element.rangeTime = kq;
        });
        se.sort('priceAvg', se.listDepart);
        //se.checkvalue(se.listDepart, 0);
        se.currentDepartFlight = se.listDepart;
      }

      if (se.listReturn && se.listReturn.length > 0) {
        se.listReturn.forEach(element => {
          var priceFlightAdult = 0;
          element.priceSummaries.forEach(e => {
            if (e.passengerType == 0) {
              priceFlightAdult += e.price;
            }
          });
          //25/12/2020: Sửa lại lấy đúng giá giảm (sau khi trừ giá bán default)
          element.priceorder = priceFlightAdult - se.returnTicketSale;

          if (element.airlineCode == "VietnamAirlines") {
            element.priceorder = element.priceorder * 0.75;
          }
          else if (element.airlineCode == "BambooAirways") {
            element.priceorder = element.priceorder * 0.8;
          }
        });
        se.sort('priceAvg', se.listReturn);
        //se.checkvalue(se.listReturn, 1);
        se.currentReturnFlight = se.listReturn;
      }
      se.loadFlightData(se.listDepart, se.listReturn);
      
    })

    if (se.listDepart.length == 0 || se.listReturn.length == 0) {
      se.PriceAvgPlusTAStr = 0;
    }
  }
  //Hàm check VMB giá thấp nhất trong khung giờ chấp nhận được
  checkvalue(list, stt) {
    var Hour; var Minute; var kq;
    var good:any = [];
    var medium:any = [];
    var other:any = [];
    if (stt == 0) {
      for (let i = 0; i < list.length; i++) {
        // var dateTime = new Date(list.flights[i].departTime);
        // Hour = moment(dateTime).format("HH");
        // Minute = moment(dateTime).format("mm");
        let ar_time = list[i].departTime.toString().split('T')[1];
        Hour = ar_time.toString().split(':')[0];
        Minute = ar_time.toString().split(':')[1];
        kq = Hour * 60 + Number(Minute);
        list[i].rangeTime = kq;

        if (kq >= 360 && kq <= 960) {
          if (kq >= 480 && kq <= 660) {
            good.push(list[i]);
          }
          else {
            medium.push(list[i]);
          }
        }
        else {
          other.push(list[i]);
        }
      }
      if (medium && medium.length > 0 && good && good.length > 0) {
        if (good[0].priceorder <= medium[0].priceorder) {
          this.departfi = good;
        } else {
          if (medium.length > 0) {
            this.departfi = medium;
          } else {
            if (good.length > 0) {
              this.departfi = good;
            }

          }
        }
      } else {
        if (medium.length > 0) {
          this.departfi = medium;
        } else {
          if (good.length > 0) {
            this.departfi = good;
          }

        }
      }


      if (this.departfi && this.departfi.length == 0) {
        this.departfi = other;
      }
    }
    else {
      for (let i = 0; i < list.length; i++) {
        // var dateTime = new Date(list.flights[i].departTime);
        // Hour = moment(dateTime).format("HH");
        // Minute = moment(dateTime).format("mm");
        let ar_time = list[i].departTime.toString().split('T')[1];
        Hour = ar_time.toString().split(':')[0];
        Minute = ar_time.toString().split(':')[1];
        kq = Hour * 60 + Number(Minute);

        if (kq >= 600 && kq < 1440) {
          if (kq >= 840 && kq <= 1020) {
            good.push(list[i]);
          }
          else {
            medium.push(list[i]);
          }
        }
        else {
          other.push(list[i]);
        }
      }
      if (medium.length > 0) {
        this.returnfi = medium;
      }
      else {
        if (good.length > 0) {
          this.returnfi = good;
        }

      }
      if (this.returnfi.length == 0) {
        this.returnfi = other;
      }
    }

  }

  /**
   * Hàm bind lại thông tin chuyến bay + tiền vé khi thay đổi chuyến
   * PDANH 27/04/2019
   */
  loadFlightData(departFlight, returnFlight) {
    var se = this;
    se.listDeparture = [];
    this.totaldepluggage=0;
    this.totalretluggage=0;
    //se.loadflightpricedone = false;
    if (departFlight && departFlight.length > 0) {
      se.listDeparture.push(departFlight[0]);
      let de_date = new Date(this.gf.getCinIsoDate(departFlight[0].departTime));
      let de_date_landing = new Date(this.gf.getCinIsoDate(departFlight[0].landingTime));
      let de_hour = moment(de_date).format("HH");
      let de_minute = moment(de_date).format("mm");
      let de_hour_landing = moment(de_date_landing).format("HH");
      let de_minute_landing = moment(de_date_landing).format("mm");
      if (departFlight[0].departTime.toString().indexOf('T')) {
        de_date = new Date(this.gf.getCinIsoDate(departFlight[0].departTime.toString().split('T')[0]));
        de_date_landing = new Date(this.gf.getCinIsoDate(departFlight[0].landingTime.toString().split('T')[0]));
        let de_time = departFlight[0].departTime.toString().split('T')[1];
        de_hour = de_time.toString().split(':')[0];
        de_minute = de_time.toString().split(':')[1];
        let ar_time_landing = departFlight[0].landingTime.toString().split('T')[1];
        de_hour_landing = ar_time_landing.toString().split(':')[0];
        de_minute_landing = ar_time_landing.toString().split(':')[1];
      }

      // se.de_departtime = de_hour + ':' + de_minute + ' → ' + de_hour_landing + ':' + de_minute_landing;
      se.de_departtime = de_hour + ':' + de_minute;
      se.re_departtime = de_hour_landing + ':' + de_minute_landing;
      se.bookCombo.departTimeStr = de_hour + ':' + de_minute + ' → ' + de_hour_landing + ':' + de_minute_landing;
      se.de_departdatestr = se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD') + ' ' + 'thg' + ' ' + moment(de_date).format('MM');

      se.bookCombo.de_departdatestr = "Đi " + se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD-MM-YYYY');
      se.daydeparttitle = se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD-MM-YYYY');
      //tính thời gian bay
      let hours: any = Math.floor(departFlight[0].flightDuration / 60);
      let minutes: any = departFlight[0].flightDuration * 1 - (hours * 60);
      if (hours < 10) {
        hours = hours != 0 ? "0" + hours : "0";
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      departFlight[0].departTimeDisplay = moment(departFlight[0].departTime).format("HH:mm");
      departFlight[0].landingTimeDisplay = moment(departFlight[0].landingTime).format("HH:mm");
      departFlight[0].flightTimeDisplay = hours + "h" + minutes;
      departFlight[0].flightTimeDetailDisplay = hours + "h" + minutes + "m";
      se.departlocationdisplay = departFlight[0].fromPlaceCode + "   ·   " + departFlight[0].flightTimeDetailDisplay + "   ·   " + departFlight[0].toPlaceCode;
      se.operatedBydep = departFlight[0].operatedBy;
      if (departFlight[0].operatedBy && departFlight[0].urlLogo.indexOf('content/img') == -1) {
        departFlight[0].urlLogo = "https://www.ivivu.com/ve-may-bay/content/img/brands/w100/" + departFlight[0].urlLogo;
      }
      let priceFlightAdult = 0;
      departFlight[0].priceSummaries.forEach(e => {
        if (e.passengerType == 0) {
          priceFlightAdult += e.price;
        }
      });
      if (se.bookcombodetail.departTicketSale > priceFlightAdult) {

        let pricesdepartstr = se.bookcombodetail.departTicketSale - priceFlightAdult;
        se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '') - pricesdepartstr;
        se.TotalPrice - pricesdepartstr;
        //se.de_flightpricetitle = pricesdepartstr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
        se.de_departpriceincrease = false;

      }
      if (se.bookcombodetail.departTicketSale <= priceFlightAdult) {

        let pricesdepartstr = priceFlightAdult - se.bookcombodetail.departTicketSale;
        se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '') + pricesdepartstr;
        se.TotalPrice + pricesdepartstr;
        //se.de_flightpricetitle = pricesdepartstr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
        se.de_departpriceincrease = true
      }
      //Gán giá vé máy bay chênh
      se.JsonSurchargeFee.DepartTicketDifferenceFee = priceFlightAdult - se.bookcombodetail.departTicketSale;

      //PDANH 17/07/2019: Check loại vé jetstar để chạy tool giữ vé
      if (departFlight[0].airlineCode == "JetStar") {
        se.isJetstarFlight = true;
      }
      //thông tin hành lý
      if (departFlight[0].ticketCondition) {
        se.departConditionInfo = departFlight[0].ticketCondition;
        if (se.departConditionInfo && se.departConditionInfo.luggageSigned && se.departConditionInfo.luggageSigned.length <= 4) {
          se.totaldepluggage = se.departConditionInfo.luggageSigned;
        }
        else {
          se.totaldepluggage = 0;
        }
      }

    }

    if (returnFlight && returnFlight.length > 0) {
      let itemReturnFlight = returnFlight[0];
      se.currentReturnSeriFlight = [];
      //Check vé seri
      if(departFlight[0] && departFlight[0].id.indexOf('__seri') != -1){
        let itemr = returnFlight.filter((itemreturn) => { return itemreturn.id.indexOf('__seri') != -1 && itemreturn.availId == departFlight[0].availId})
        if(itemr && itemr.length >0){
          itemReturnFlight = itemr[0];
          se.currentReturnSeriFlight = itemr;
        }
      }
      se.listDeparture.push(itemReturnFlight);
      let ar_date = new Date(this.gf.getCinIsoDate(returnFlight[0].departTime));
      let ar_date_landing = new Date(this.gf.getCinIsoDate(returnFlight[0].landingTime));
      let ar_hour = moment(ar_date).format("HH");
      let ar_minute = moment(ar_date).format("mm");
      let ar_hour_landing = moment(ar_date_landing).format("HH");
      let ar_minute_landing = moment(ar_date_landing).format("mm");
      if (returnFlight[0].departTime.toString().indexOf('T')) {
        ar_date = new Date(this.gf.getCinIsoDate(returnFlight[0].departTime.toString().split('T')[0]));
        ar_date_landing = new Date(this.gf.getCinIsoDate(returnFlight[0].landingTime.toString().split('T')[0]));
        let ar_time = returnFlight[0].departTime.toString().split('T')[1];
        ar_hour = ar_time.toString().split(':')[0];
        ar_minute = ar_time.toString().split(':')[1];
        let ar_time_landing = returnFlight[0].landingTime.toString().split('T')[1];
        ar_hour_landing = ar_time_landing.toString().split(':')[0];
        ar_minute_landing = ar_time_landing.toString().split(':')[1];
      }

      // se.ar_departtime = ar_hour + ':' + ar_minute + ' → ' + ar_hour_landing + ':' + ar_minute_landing;
      se.ar_departtime = ar_hour + ':' + ar_minute
      se.ar_returntime = ar_hour_landing + ':' + ar_minute_landing;
      se.bookCombo.returnTimeStr = ar_hour + ':' + ar_minute + ' → ' + ar_hour_landing + ':' + ar_minute_landing;
      se.ar_departdatestr = se.getDayOfWeek(ar_date) + ', ' + moment(ar_date).format('DD') + ' ' + 'thg' + ' ' + moment(ar_date).format('MM'),
        se.bookCombo.ar_departdatestr = "Về " + se.getDayOfWeek(ar_date) + ', ' + moment(ar_date).format('DD-MM-YYYY');
      se.dayreturntitle = se.getDayOfWeek(ar_date) + ', ' + moment(ar_date).format('DD-MM-YYYY');
      //tính thời gian bay
      let hours: any = Math.floor(returnFlight[0].flightDuration / 60);
      let minutes: any = returnFlight[0].flightDuration * 1 - (hours * 60);
      if (hours < 10) {
        hours = hours != 0 ? "0" + hours : "0";
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      returnFlight[0].departTimeDisplay = moment(returnFlight[0].departTime).format("HH:mm");
      returnFlight[0].landingTimeDisplay = moment(returnFlight[0].landingTime).format("HH:mm");
      returnFlight[0].flightTimeDisplay = hours + "h" + minutes;
      returnFlight[0].flightTimeDetailDisplay = hours + "h" + minutes + "m";
      se.returnlocationdisplay = returnFlight[0].fromPlaceCode + "   ·   " + returnFlight[0].flightTimeDetailDisplay + "   ·   " + returnFlight[0].toPlaceCode;
      se.operatedByret = returnFlight[0].operatedBy;
      if (returnFlight[0].operatedBy && returnFlight[0].urlLogo.indexOf('content/img') == -1) {
        returnFlight[0].urlLogo = "https://www.ivivu.com/ve-may-bay/content/img/brands/w100/" + returnFlight[0].urlLogo;
      }

      let priceFlightAdult = 0;
      returnFlight[0].priceSummaries.forEach(e => {
        if (e.passengerType == 0) {
          priceFlightAdult += e.price;
        }
      });
      if (se.bookcombodetail.returnTicketSale > priceFlightAdult) {
        let pricesreturnstr = se.bookcombodetail.returnTicketSale - priceFlightAdult;
        se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '') - pricesreturnstr;
        se.TotalPrice - pricesreturnstr;
        //se.ar_flightpricetitle = pricesreturnstr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
        se.ar_departpriceincrease = false
      }
      if (se.bookcombodetail.returnTicketSale <= priceFlightAdult) {
        let pricesreturnstr = priceFlightAdult - se.bookcombodetail.returnTicketSale;
        se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '') + pricesreturnstr;
        se.TotalPrice + pricesreturnstr;
        //se.ar_flightpricetitle = pricesreturnstr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
        se.ar_departpriceincrease = true
      }
      //Gán giá vé máy bay chênh
      se.JsonSurchargeFee.ReturnTicketDifferenceFee = priceFlightAdult - se.bookcombodetail.returnTicketSale;

      //PDANH 17/07/2019: Check loại vé jetstar để chạy tool giữ vé
      if (returnFlight[0].airlineCode == "JetStar") {
        se.isJetstarFlight = true;
      }
      //thông tin hành lý
      if (returnFlight[0].ticketCondition) {
        se.returnConditionInfo = returnFlight[0].ticketCondition;
        if (se.returnConditionInfo && se.returnConditionInfo.luggageSigned && se.returnConditionInfo.luggageSigned.length <= 4) {
          se.totalretluggage = se.returnConditionInfo.luggageSigned;
        }
        else {
          se.totalretluggage = 0;
        }
      }
    }
    if (se.currentDepartFlight) {
      se.flightdeparttitle = 'Từ ' + se.currentDepartFlight[0].fromPlace + ' đi ' + se.currentDepartFlight[0].toPlace;
      se.fromPlace = se.currentDepartFlight[0].fromPlace;
      se.toPlace = se.currentDepartFlight[0].toPlace;
      se.callSummaryPrice(se.roomclass, se.index);
    }
    setTimeout(() => {
      se.ischeckwaitlug=true;
    }, 10 *1000)
    setTimeout(() => {
      se.loadflightpricedone = true;
      se.checkVoucherClaimed();
    },4000)
  }

  getDayOfWeek(date): string {
    let coutthu = moment(date).format('dddd');
    switch (coutthu) {
      case "Monday":
        coutthu = "Thứ 2"
        break;
      case "Tuesday":
        coutthu = "Thứ 3"
        break;
      case "Wednesday":
        coutthu = "Thứ 4"
        break;
      case "Thursday":
        coutthu = "Thứ 5"
        break;
      case "Friday":
        coutthu = "Thứ 6"
        break;
      case "Saturday":
        coutthu = "Thứ 7"
        break;
      default:
        coutthu = "Chủ nhật"
        break;
    }
    return coutthu;
  }
  /**
   * Trả về true nếu ko chọn seri cả chiều đi, chiều về hoặc có chọn seri chiều đi và vé seri chiều đi & chiều về cùng cặp
   * Ngược lại trả về false
   * @returns 
   */
   checkMapSeriFlight(){
    var se = this, res = true;
    if(se.currentDepartFlight[0] && se.currentReturnFlight[0]){
      res = (se.currentDepartFlight[0].id.indexOf('__seri') == -1 && se.currentReturnFlight[0].id.indexOf('__seri') == -1)
      || (se.currentDepartFlight[0].id.indexOf('__seri') != -1 && se.currentReturnFlight[0].id.indexOf('__seri') != -1 
      && se.currentDepartFlight[0].availId == se.currentReturnFlight[0].availId)
    }
    return res;
  }
  next(value) {
    //build object flight json
    if (!this.currentDepartFlight || !this.currentReturnFlight) {
      if (!this.currentDepartFlight) {
        this.gf.showToastWarning('Không lấy được thông tin chuyến bay đi, mong quý khách thông cảm! Vui lòng chọn lại lịch bay.');
      } else {
        this.gf.showToastWarning('Không lấy được thông tin chuyến bay về, mong quý khách thông cảm! Vui lòng chọn lại lịch bay.');
      }
      this.zone.run(() => {
        this.PriceAvgPlusTAStr = 0;
        this.TotalPrice = 0;
      })

      return;
    }
    //check valid cặp vé seri
    if(!this.checkMapSeriFlight()){
      this.gf.showToastWarning('Một chặng bay đang chọn hạng vé Seri, vui lòng chọn vé Seri cho chặng bay còn lại');
      return;
    }

    if(this.elementMealtype.Supplier == 'SERI' && this.elementMealtype.HotelCheckDetailTokenInternal){
      //Check allotment trÆ°á»›c khi book
      this.gf.checkAllotmentSeri(
        this.booking.HotelId,
        this.elementMealtype.RoomId,
        this.booking.CheckInDate,
        this.booking.CheckOutDate,
        this.roomnumber,
        'SERI', this.elementMealtype.HotelCheckDetailTokenInternal
        ).then((allow)=> {
          if(allow){
            this.continueBook(value);
          }else{
            this.gf.showToastWarning('Hiện tại khách sạn đã hết phòng loại này.');
          }
        })
    }else{
      this.continueBook(value);
    }
  }

  continueBook(value) {
    var pointprice = 0;
    var total = this.TotalPrice;
    this.edit();
    if (this.ischeck) {
      pointprice = this.point;
      if (this.ischeckpoint) {
        pointprice = this.TotalPrice;
      }
      total = this.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
    }
    if (this.strPromoCode) {
      total = this.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
      this.bookCombo.ischeckbtnpromo = true;
      this.bookCombo.discountpromo = this.totaldiscountpromo;
    }
    else {
      this.bookCombo.ischeckbtnpromo = false;
      this.bookCombo.discountpromo = 0;
      this.promocode = "";
    }
    let voucherSelectedMap = this._voucherService.voucherSelected.map(v => {
      let newitem = {};
      newitem["voucherCode"] = v.code;
      newitem["voucherName"] = v.rewardsItem.title;
      newitem["voucherType"] = v.applyFor || v.rewardsItem.rewardsType;
      newitem["voucherDiscount"] = v.rewardsItem.price;
      newitem["keepCurrentVoucher"] = false;
      return newitem;
    });
    let promoSelectedMap = this._voucherService.listObjectPromoCode.map(v => {
      let newitem = {};
      newitem["voucherCode"] = v.code;
      newitem["voucherName"] = v.name;
      newitem["voucherType"] = 2;
      newitem["voucherDiscount"] = v.price;
      newitem["keepCurrentVoucher"] = false;
      return newitem;
    });
    let checkpromocode = this._voucherService.voucherSelected && this._voucherService.voucherSelected.length ==0 && this._voucherService.listObjectPromoCode && this._voucherService.listObjectPromoCode.length ==0;
    let arrpromocode = this.promocode ? [{"voucherCode": this.promocode , "voucherName": this.promocode,"voucherType": 1,"voucherDiscount": this.discountpromo ,"keepCurrentVoucher": false  }] : [];

    total = Number(total).toFixed(0);
    var officestr = "";
    if (this.bookCombo.ComboDetail.departureCode) {
      officestr = this.bookCombo.ComboDetail.departureCode == "SGN" ? "HCM" : (this.bookCombo.ComboDetail.departureCode == "HAN" ? "HN" : (this.bookCombo.ComboDetail.departureCode == "VCA" ? "CT" : ""));
    }
    this.storage.get('jti').then(jti => {
      if (jti) {
        if (value == 1) {
          if (this.ischangefly) {
            this.JsonSurchargeFee.ComboData = {
              ComboId: this.bookCombo.ComboId,
              MealTypeCode: this.bookCombo.MealTypeCode,
              AdultCombo: this.adultCombo
            }

            //this.gf.googleAnalytionCustom('add_to_cart', { item_category: 'flightcombo', item_name: this.bookCombo.ComboTitle, item_id: this.bookCombo.HotelCode, start_date: this.cin, end_date: this.cout, origin: this.bookCombo.ComboDetail.departureCode, destination: this.bookCombo.arrivalCode, value: Number(this.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '')), currency: "VND" });
            this.gf.logEventFirebase('',this.searchhotel, 'flightcomboreview', 'begin_checkout', 'Combo');
            this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_INITIATED_CHECKOUT, {'fb_content_type': 'hotel'  ,'fb_content_id': this.bookCombo.HotelCode,'fb_num_items': 1, 'fb_value': this.gf.convertNumberToDouble(this.PriceAvgPlusTAStr) ,  'fb_currency': 'VND' ,
            'checkin_date': this.cin ,'checkout_date ': this.cout,'num_adults': this.searchhotel.adult,'num_children': (this.searchhotel.child ? this.searchhotel.child : 0), }, this.gf.convertStringToNumber(this.PriceAvgPlusTAStr));

            //thêm id chuyến bay để giữ chỗ
            this.bookCombo.iddepart = this.currentDepartFlight[0].id;
            this.bookCombo.idreturn = this.currentReturnFlight[0].id;
            this.bookCombo.MealTypeName = this.breakfast;
            this.bookCombo.MealTypeIndex = this.index;
            let objflight = {
              FlightBooking: {
                departFlightId: this.currentDepartFlight[0].id,
                returnFlightId: this.currentReturnFlight[0].id,
                fromPlaceCode: this.bookCombo.ComboDetail.departureCode,
                toPlaceCode: this.bookCombo.arrivalCode,
                flightType: "2",
                adult: this.adults,
                child: this.children - this.infant,
                infant: this.infant,
                departFlight: {
                  AirlineCode: this.currentDepartFlight[0].details[0].airlineCode,
                  FlightNumber: this.currentDepartFlight[0].details[0].flightNumber,
                  DepartTime: this.currentDepartFlight[0].details[0].departTime,
                  FareBasis: this.currentDepartFlight[0].fareBasis,
                  FlightDuration: this.currentDepartFlight[0].details[0].flightDuration,
                  LandingTime: this.currentDepartFlight[0].details[0].landingTime,
                  Stops: 0,
                  TicketType: this.currentDepartFlight[0].ticketType,
                  PriceSummaries: this.currentDepartFlight[0].priceSummaries,

                },
                returnFlight: {
                  AirlineCode: this.currentReturnFlight[0].details[0].airlineCode,
                  FlightNumber: this.currentReturnFlight[0].details[0].flightNumber,
                  DepartTime: this.currentReturnFlight[0].details[0].departTime,
                  FareBasis: this.currentReturnFlight[0].fareBasis,
                  FlightDuration: this.currentReturnFlight[0].details[0].flightDuration,
                  LandingTime: this.currentReturnFlight[0].details[0].landingTime,
                  Stops: 0,
                  TicketType: this.currentReturnFlight[0].ticketType,
                  PriceSummaries: this.currentReturnFlight[0].priceSummaries,
                }

              },
              HotelBooking: {
                NoteForSupp:this.elementMealtype.NoteForSupplier,
                HotelId: this.booking.HotelId.toString(),
                CheckIn: moment(this.booking.CheckInDate).format('YYYY-MM-DD'),
                CheckOut: moment(this.booking.CheckOutDate).format('YYYY-MM-DD'),
                TotalRoom: this.roomnumber,
                TotalPrices: total,
                //TotalPrices : this.bookCombo.totalprice,
                RoomStatus: this.elementMealtype.Status,
                BreakfastInclude: this.elementMealtype.Code,
                BreakfastIncludeName: this.elementMealtype.Name,
                PaymentMethod: "2",
                CName: this.username,
                CEmail: this.email,
                CAddress: "",
                CPhone: "",
                CTitle: "",
                LeadingName: "",
                LeadingEmail: "",
                LeadingPhone: "",
                LeadingNationality: "",
                IsInvoice: 0,
                Note: "",
                BookingStatus: "0",
                Adult: this.adults,
                AdultCombo: this.adultCombo,
                Child: this.children,
                TravPaxPrices: this.TravPaxPrices,
                Office: officestr,//Gán văn phòng khi tạo bkg
                FromPlaceCode: this.bookCombo.ComboDetail.departureCode,
                RoomName: this.elementMealtype.RoomName,
                RoomPrices: this.elementMealtype.PriceAvgPlusTA,
                RoomId: this.elementMealtype.RoomId,
                MealTypeNote: (this.elementMealtype.PromotionInclusions.length > 0 ? this.elementMealtype.PromotionInclusions.join(' \r\n') : "") + (this.elementMealtype.Notes != null && this.elementMealtype.Notes.length > 0 ? this.elementMealtype.Notes.join('\r\n,') : ""),
                PromotionNote: this.elementMealtype.PromotionNote,
                PersonIncharge: "",
                DiscountAmount: "0",
                SupplierRef: null,
                ChildAges: this.booking.ChildAge,
                PenaltyDescription: null,
                CompName: "",
                CompAddress: "",
                CompTaxCode: "",
                CompanyContactEmail:"",
                CompanyContactName:"",
                JsonSurchargeFee: JSON.stringify(this.JsonSurchargeFee),
                Commission: this.Commission,
                Source: '6',
                Supplier: (this.elementMealtype.IsHoliday ? "Holiday" : (this.elementMealtype.IsVoucher ? "Voucher" : this.elementMealtype.Supplier)),
                MemberId: jti,
                UsePointPrice: pointprice,
                //promotionCode: this.promocode,
                vouchers : !checkpromocode ? [...voucherSelectedMap,...promoSelectedMap] : arrpromocode,
                AllomentBreak: this.elementMealtype.AllomentBreak,
                IsPromotionAllotment: this.elementMealtype.IsPromotionAllotment,
                //hasInsurrance = true: đã bao gồm bảo hiểm trong giá combo
                //hasInsurrance = false: chưa bao gồm bảo hiểm
                //checkInsurranceFee = true: Người dùng có tích chọn gói bảo hiểm
                //checkInsurranceFee = false: Người dùng không chọn gói bảo hiểm
                Insurance: this.hasInsurrance ? this.hasInsurrance : (this.bookCombo.checkInsurranceFee ? true : false),
                SurchargeFee: this.objInsurranceFee ? JSON.stringify({
                  type: "Insurance",
                  PassengerType: 0,
                  PriceType: 1,
                  Text: this.objInsurranceFee.name,
                  Quantity: this.adults + this.children,
                  Price: this.hasInsurrance ? 0 : this.objInsurranceFee.priceNetTotal,
                  PriceFormat: this.objInsurranceFee.priceNetTotal.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
                  "$$hashKey": "object:473"
                }) : 0,
                SupplierName: this.elementMealtype.Supplier,
                HotelCheckDetailTokenVinHms: this.elementMealtype.HotelCheckDetailTokenVinHms ? this.elementMealtype.HotelCheckDetailTokenVinHms : "",
                HotelCheckPriceTokenSMD: this.elementMealtype.HotelCheckPriceTokenSMD  ? this.elementMealtype.HotelCheckPriceTokenSMD  : "",
                HotelCheckDetailTokenInternal: this.elementMealtype.Supplier == 'SERI' && this.elementMealtype.HotelCheckDetailTokenInternal ? this.elementMealtype.HotelCheckDetailTokenInternal : "",
                HotelRoomHBedReservationRequest: this.elementMealtype.Supplier == 'HBED' && this.elementMealtype.HotelRoomHBedReservationRequest ? JSON.stringify(this.elementMealtype.HotelRoomHBedReservationRequest) : "",
                ReqHBED: this.elementRooom && this.elementRooom.ReqHBED? JSON.stringify(this.elementRooom.ReqHBED) : '',
                HotelCheckDetailTokenAgoda: this.elementMealtype.Supplier == 'AGD' && this.elementMealtype.HotelCheckDetailTokenAgoda ? this.elementMealtype.HotelCheckDetailTokenAgoda : '',
              },
              airLineLuggageDepart: [],
              airLineLuggageReturn: [],
              ResId: ""
            };
            this.gf.setParams(objflight, 'flightcombo');
            this.initFlightBooking(objflight).then((checklug) => {
              if (this.loader) {
                this.loader.dismiss();
              }
              var se = this;
              this.activityService.objFlightComboPaymentBreakDown = { objDetail: se };
              this.ischangefly = false;
              var objinfofly = {
                de_departdatestr: se.de_departdatestr,
                de_departtime: se.de_departtime,
                re_departtime: se.re_departtime,
                departlocationdisplay: se.departlocationdisplay,
                listDeparture: se.listDeparture,
                ar_departdatestr: se.ar_departdatestr,
                ar_departtime: se.ar_departtime,
                ar_returntime: se.ar_returntime,
                returnlocationdisplay: se.returnlocationdisplay,
                operatedBydep: se.operatedBydep,
                operatedByret: se.operatedByret
              }
              this.gf.setParams(objinfofly, 'objinfofly');
              this.navCtrl.navigateForward('/flightcomboadddetails');
            });
          }
          else {
            var objinfofly = {
              de_departdatestr: this.de_departdatestr,
              de_departtime: this.de_departtime,
              re_departtime: this.re_departtime,
              departlocationdisplay: this.departlocationdisplay,
              listDeparture: this.listDeparture,
              ar_departdatestr: this.ar_departdatestr,
              ar_departtime: this.ar_departtime,
              ar_returntime: this.ar_returntime,
              returnlocationdisplay: this.returnlocationdisplay,
              operatedBydep: this.operatedBydep,
              operatedByret: this.operatedByret
            }
            this.gf.setParams(objinfofly, 'objinfofly');
            objectFlight = this.gf.getParams('flightcombo');
            //set lại objhotel;
            var objhotel = {
              NoteForSupp:this.elementMealtype.NoteForSupplier,
              HotelId: this.booking.HotelId.toString(),
              CheckIn: moment(this.booking.CheckInDate).format('YYYY-MM-DD'),
              CheckOut: moment(this.booking.CheckOutDate).format('YYYY-MM-DD'),
              TotalRoom: this.roomnumber,
              TotalPrices: total,
              //TotalPrices : this.bookCombo.totalprice,
              RoomStatus: this.elementMealtype.Status,
              BreakfastInclude: this.elementMealtype.Code,
              BreakfastIncludeName: this.elementMealtype.Name,
              PaymentMethod: "2",
              CName: this.username,
              CEmail: this.email,
              CAddress: "",
              CPhone: "",
              CTitle: "",
              LeadingName: "",
              LeadingEmail: "",
              LeadingPhone: "",
              LeadingNationality: "",
              IsInvoice: 0,
              Note: "",
              BookingStatus: "0",
              Adult: this.adults,
              AdultCombo: this.adultCombo,
              Child: this.children,
              TravPaxPrices: this.TravPaxPrices,
              Office: officestr,//Gán văn phòng khi tạo bkg
              FromPlaceCode: this.bookCombo.ComboDetail.departureCode,
              RoomName: this.elementMealtype.RoomName,
              RoomPrices: this.elementMealtype.PriceAvgPlusTA,
              RoomId: this.elementMealtype.RoomId,
              MealTypeNote: (this.elementMealtype.PromotionInclusions.length > 0 ? this.elementMealtype.PromotionInclusions.join(' \r\n') : "") + (this.elementMealtype.Notes != null && this.elementMealtype.Notes.length > 0 ? this.elementMealtype.Notes.join('\r\n,') : ""),
              PromotionNote: this.elementMealtype.PromotionNote,
              PersonIncharge: "",
              DiscountAmount: "0",
              SupplierRef: null,
              ChildAges: this.booking.ChildAge,
              PenaltyDescription: null,
              CompName: "",
              CompAddress: "",
              CompTaxCode: "",
              JsonSurchargeFee: JSON.stringify(this.JsonSurchargeFee),
              Commission: this.Commission,
              Source: '6',
              Supplier: (this.elementMealtype.IsHoliday ? "Holiday" : (this.elementMealtype.IsVoucher ? "Voucher" : this.elementMealtype.Supplier)),
              MemberId: jti,
              UsePointPrice: pointprice,
              //promotionCode: this.promocode,
              vouchers : !checkpromocode ? [...voucherSelectedMap,...promoSelectedMap] : arrpromocode,
              AllomentBreak: this.elementMealtype.AllomentBreak,
              IsPromotionAllotment: this.elementMealtype.IsPromotionAllotment,
              //hasInsurrance = true: đã bao gồm bảo hiểm trong giá combo
              //hasInsurrance = false: chưa bao gồm bảo hiểm
              //checkInsurranceFee = true: Người dùng có tích chọn gói bảo hiểm
              //checkInsurranceFee = false: Người dùng không chọn gói bảo hiểm
              Insurance: this.hasInsurrance ? this.hasInsurrance : (this.bookCombo.checkInsurranceFee ? true : false),
              SurchargeFee: this.objInsurranceFee ? JSON.stringify({
                type: "Insurance",
                PassengerType: 0,
                PriceType: 1,
                Text: this.objInsurranceFee.name,
                Quantity: this.adults + this.children,
                Price: this.hasInsurrance ? 0 : this.objInsurranceFee.priceNetTotal,
                PriceFormat: this.objInsurranceFee.priceNetTotal.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
                "$$hashKey": "object:473"
              }) : 0,
              SupplierName: this.elementMealtype.Supplier,
              HotelCheckDetailTokenVinHms: this.elementMealtype.HotelCheckDetailTokenVinHms ? this.elementMealtype.HotelCheckDetailTokenVinHms : "",
              HotelCheckPriceTokenSMD: this.elementMealtype.HotelCheckPriceTokenSMD  ? this.elementMealtype.HotelCheckPriceTokenSMD  : "",
              HotelCheckDetailTokenInternal: this.elementMealtype.Supplier == 'SERI' && this.elementMealtype.HotelCheckDetailTokenInternal ? this.elementMealtype.HotelCheckDetailTokenInternal : "",
              HotelRoomHBedReservationRequest: this.elementMealtype.Supplier == 'HBED' && this.elementMealtype.HotelRoomHBedReservationRequest ? JSON.stringify(this.elementMealtype.HotelRoomHBedReservationRequest) : "",
              ReqHBED: this.elementRooom && this.elementRooom.ReqHBED? JSON.stringify(this.elementRooom.ReqHBED) : '',
              HotelCheckDetailTokenAgoda: this.elementMealtype.Supplier == 'AGD' && this.elementMealtype.HotelCheckDetailTokenAgoda ? this.elementMealtype.HotelCheckDetailTokenAgoda : '',
            }
            objectFlight.HotelBooking = objhotel;
            this.gf.setParams(objectFlight, 'flightcombo');
            this.navCtrl.navigateForward('/flightcomboadddetails');
          }
        } else {
          this.valueGlobal.backValue = 'flightcomboinfoluggage';
          if (this.ischangefly) {
            this.JsonSurchargeFee.ComboData = {
              ComboId: this.bookCombo.ComboId,
              MealTypeCode: this.bookCombo.MealTypeCode,
              AdultCombo: this.adultCombo
            }
            var objectFlight = {
              FlightBooking: {
                fromPlaceCode: this.bookCombo.ComboDetail.departureCode,
                toPlaceCode: this.bookCombo.arrivalCode,
                flightType: "2",
                adult: this.adults,
                child: this.children - this.infant,
                infant: this.infant,
                departFlight: {
                  AirlineCode: this.currentDepartFlight[0].details[0].airlineCode,
                  FlightNumber: this.currentDepartFlight[0].details[0].flightNumber,
                  DepartTime: this.currentDepartFlight[0].details[0].departTime,
                  FareBasis: this.currentDepartFlight[0].fareBasis,
                  FlightDuration: this.currentDepartFlight[0].details[0].flightDuration,
                  LandingTime: this.currentDepartFlight[0].details[0].landingTime,
                  Stops: 0,
                  TicketType: this.currentDepartFlight[0].ticketType,
                  PriceSummaries: this.currentDepartFlight[0].priceSummaries
                },
                returnFlight: {
                  AirlineCode: this.currentReturnFlight[0].details[0].airlineCode,
                  FlightNumber: this.currentReturnFlight[0].details[0].flightNumber,
                  DepartTime: this.currentReturnFlight[0].details[0].departTime,
                  FareBasis: this.currentReturnFlight[0].fareBasis,
                  FlightDuration: this.currentReturnFlight[0].details[0].flightDuration,
                  LandingTime: this.currentReturnFlight[0].details[0].landingTime,
                  Stops: 0,
                  TicketType: this.currentReturnFlight[0].ticketType,
                  PriceSummaries: this.currentReturnFlight[0].priceSummaries
                }

              },
              HotelBooking: {
                NoteForSupp:this.elementMealtype.NoteForSupplier,
                HotelId: this.booking.HotelId.toString(),
                CheckIn: moment(this.booking.CheckInDate).format('YYYY-MM-DD'),
                CheckOut: moment(this.booking.CheckOutDate).format('YYYY-MM-DD'),
                TotalRoom: this.roomnumber,
                TotalPrices: total,
                //TotalPrices : this.bookCombo.totalprice,
                RoomStatus: this.elementMealtype.Status,
                BreakfastInclude: this.elementMealtype.Code,
                BreakfastIncludeName: this.elementMealtype.Name,
                PaymentMethod: "2",
                CName: this.username,
                CEmail: this.email,
                CAddress: "",
                CPhone: "",
                CTitle: "",
                LeadingName: "",
                LeadingEmail: "",
                LeadingPhone: "",
                LeadingNationality: "",
                IsInvoice: 0,
                Note: "",
                BookingStatus: "0",
                Adult: this.adults,
                AdultCombo: this.adultCombo,
                Child: this.children,
                TravPaxPrices: this.TravPaxPrices,
                Office: officestr,//Gán văn phòng khi tạo bkg
                FromPlaceCode: this.bookCombo.ComboDetail.departureCode,
                RoomName: this.elementMealtype.RoomName,
                RoomPrices: this.elementMealtype.PriceAvgPlusTA,
                RoomId: this.elementMealtype.RoomId,
                MealTypeNote: (this.elementMealtype.PromotionInclusions.length > 0 ? this.elementMealtype.PromotionInclusions.join(' \r\n') : "") + (this.elementMealtype.Notes != null && this.elementMealtype.Notes.length > 0 ? this.elementMealtype.Notes.join('\r\n,') : ""),
                PromotionNote: this.elementMealtype.PromotionNote,
                PersonIncharge: "",
                DiscountAmount: "0",
                SupplierRef: null,
                ChildAges: this.booking.ChildAge,
                PenaltyDescription: null,
                CompName: "",
                CompAddress: "",
                CompTaxCode: "",
                JsonSurchargeFee: JSON.stringify(this.JsonSurchargeFee),
                Commission: this.Commission,
                Source: '6',
                Supplier: (this.elementMealtype.IsHoliday ? "Holiday" : (this.elementMealtype.IsVoucher ? "Voucher" : this.elementMealtype.Supplier)),
                MemberId: jti,
                UsePointPrice: pointprice,
                //promotionCode: this.promocode,
                vouchers : !checkpromocode ? [...voucherSelectedMap,...promoSelectedMap] : arrpromocode,
                AllomentBreak: this.elementMealtype.AllomentBreak,
                IsPromotionAllotment: this.elementMealtype.IsPromotionAllotment,
                //hasInsurrance = true: đã bao gồm bảo hiểm trong giá combo
                //hasInsurrance = false: chưa bao gồm bảo hiểm
                //checkInsurranceFee = true: Người dùng có tích chọn gói bảo hiểm
                //checkInsurranceFee = false: Người dùng không chọn gói bảo hiểm
                Insurance: this.hasInsurrance ? this.hasInsurrance : (this.bookCombo.checkInsurranceFee ? true : false),
                SurchargeFee: this.objInsurranceFee ? JSON.stringify({
                  type: "Insurance",
                  PassengerType: 0,
                  PriceType: 1,
                  Text: this.objInsurranceFee.name,
                  Quantity: this.adults + this.children,
                  Price: this.hasInsurrance ? 0 : this.objInsurranceFee.priceNetTotal,
                  PriceFormat: this.objInsurranceFee.priceNetTotal.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
                  "$$hashKey": "object:473"
                }) : 0,
                SupplierName: this.elementMealtype.Supplier,
                HotelCheckDetailTokenVinHms: this.elementMealtype.HotelCheckDetailTokenVinHms ? this.elementMealtype.HotelCheckDetailTokenVinHms : "",
                HotelCheckPriceTokenSMD: this.elementMealtype.HotelCheckPriceTokenSMD  ? this.elementMealtype.HotelCheckPriceTokenSMD  : "",
                HotelCheckDetailTokenInternal: this.elementMealtype.Supplier == 'SERI' && this.elementMealtype.HotelCheckDetailTokenInternal ? this.elementMealtype.HotelCheckDetailTokenInternal : "",
                HotelRoomHBedReservationRequest: this.elementMealtype.Supplier == 'HBED' && this.elementMealtype.HotelRoomHBedReservationRequest ? JSON.stringify(this.elementMealtype.HotelRoomHBedReservationRequest) : "",
                ReqHBED: this.elementRooom && this.elementRooom.ReqHBED? JSON.stringify(this.elementRooom.ReqHBED) : '',
                HotelCheckDetailTokenAgoda: this.elementMealtype.Supplier == 'AGD' && this.elementMealtype.HotelCheckDetailTokenAgoda ? this.elementMealtype.HotelCheckDetailTokenAgoda : '',
              },
              airLineLuggageDepart: [],
              airLineLuggageReturn: [],
              ResId: ""
            }
            this.gf.setParams(objectFlight, 'flightcombo');
            this.gf.googleAnalytionCustom('add_to_cart', { item_category: 'flightcombo', item_name: this.bookCombo.ComboTitle, item_id: this.bookCombo.HotelCode, start_date: this.cin, end_date: this.cout, origin: this.bookCombo.ComboDetail.departureCode, destination: this.bookCombo.arrivalCode, value: Number(this.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '')), currency: "VND" });
            this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_INITIATED_CHECKOUT, {'fb_content_type': 'hotel'  ,'fb_content_id': this.bookCombo.HotelCode,'fb_num_items': 1, 'fb_value': this.gf.convertNumberToDouble(this.PriceAvgPlusTAStr) ,  'fb_currency': 'VND' ,
            'checkin_date': this.cin ,'checkout_date ': this.cout,'num_adults': this.searchhotel.adult,'num_children': (this.searchhotel.child ? this.searchhotel.child : 0), },  this.gf.convertStringToNumber(this.PriceAvgPlusTAStr) );

            //thêm id chuyến bay để giữ chỗ
            this.bookCombo.iddepart = this.currentDepartFlight[0].id;
            this.bookCombo.idreturn = this.currentReturnFlight[0].id;
            this.bookCombo.MealTypeName = this.breakfast;
            this.bookCombo.MealTypeIndex = this.index;
            let objflight = {
              FlightBooking: {
                departFlightId: this.currentDepartFlight[0].id,
                returnFlightId: this.currentReturnFlight[0].id,
                fromPlaceCode: this.bookCombo.ComboDetail.departureCode,
                toPlaceCode: this.bookCombo.arrivalCode,
                flightType: "2",
                adult: this.adults,
                child: this.children - this.infant,
                infant: this.infant,
                departFlight: {
                  AirlineCode: this.currentDepartFlight[0].details[0].airlineCode,
                  FlightNumber: this.currentDepartFlight[0].details[0].flightNumber,
                  DepartTime: this.currentDepartFlight[0].details[0].departTime,
                  FareBasis: this.currentDepartFlight[0].fareBasis,
                  FlightDuration: this.currentDepartFlight[0].details[0].flightDuration,
                  LandingTime: this.currentDepartFlight[0].details[0].landingTime,
                  Stops: 0,
                  TicketType: this.currentDepartFlight[0].ticketType,
                  PriceSummaries: this.currentDepartFlight[0].priceSummaries,

                },
                returnFlight: {
                  AirlineCode: this.currentReturnFlight[0].details[0].airlineCode,
                  FlightNumber: this.currentReturnFlight[0].details[0].flightNumber,
                  DepartTime: this.currentReturnFlight[0].details[0].departTime,
                  FareBasis: this.currentReturnFlight[0].fareBasis,
                  FlightDuration: this.currentReturnFlight[0].details[0].flightDuration,
                  LandingTime: this.currentReturnFlight[0].details[0].landingTime,
                  Stops: 0,
                  TicketType: this.currentReturnFlight[0].ticketType,
                  PriceSummaries: this.currentReturnFlight[0].priceSummaries,
                }

              }
            };
            this.initFlightBooking(objflight).then((checklug) => {
              if (this.loader) {
                this.loader.dismiss();
              }
              this.ischangefly = false;
              this.bookCombo.departConditionInfo = this.departConditionInfo;
              this.bookCombo.returnConditionInfo = this.returnConditionInfo;
              this.navCtrl.navigateForward('/flightcomboinfoluggage');
            });
          }
          else {
            this.navCtrl.navigateForward('/flightcomboinfoluggage');
          }
        }

      }else{
        this.gf.showToastWarning('Vui lòng đăng nhập lại để tiếp tục!');
      }
    })
  }

  initFlightBooking(objFlight): Promise<any> {
    var se = this;
    se.presentLoading();
    return new Promise((resolve, reject) => {
      objFlight.InitFlight = true;
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateComboBooking',
        //url: "http://192.168.10.103:8000//api/ToolsAPI/CreateComboBooking",
        "method": "POST",
        "headers": {
          "content-type": "application/x-www-form-urlencoded"
        },
        "data": $.param(objFlight)
      }

      $.ajax(settings).done(function (response) {

        if (response.Error) {
          var error = {
            page: "flightcomboadddetails",
            func: "CreateComboBooking",
            message: response.Error,
            content: response.body,
            type: "warning",
            param: JSON.stringify(settings)
          };
          C.writeErrorLog(error, response);
          resolve(false);
        }
        else {
          var res = response;
          if (res.flyBookingId) {
            let objflight = se.gf.getParams('flightcombo');
            objflight.ResId = res.flyBookingId;
            objflight.airLineLuggageDepart = (res.ancillary && res.ancillary.Baggage) ? res.ancillary.Baggage : [];
            objflight.airLineLuggageReturn = (res.ancillaryReturn && res.ancillaryReturn.Baggage) ? res.ancillaryReturn.Baggage : [];
            se.gf.setParams(objflight, 'flightcombo');
          }

          resolve(true);
        }
      })
    })

  }

  changedate() {
    //this.navCtrl.navigateForward('/hoteldetail/' + this.booking.HotelId);
    this.valueGlobal.notRefreshDetail = false;
    this.navCtrl.navigateBack('/hoteldetail/' + this.booking.HotelId);
  }

  async showListFlight(index) {
    var se = this;
    se.gf.setParams({ listdepart: se.listDepart, listreturn: se.listReturn, title: index == 0 ? se.daydeparttitle : se.dayreturntitle, isdepart: index == 0 ? true : false, flightdeparttitle: se.flightdeparttitle }, 'listflight');
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: FlightDeparturePage
      });
    modal.present();

    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      if (data.data) {
        se.zone.run(() => {
          se.ischangefly = true;
          se.bookCombo.Luggage = 0;
          let objDepart = se.listDepart;
          let objReturn = se.listReturn;
          if (!se.currentDepartFlight) {
            se.currentDepartFlight = objDepart;
          }

          if (!se.currentReturnFlight) {
            se.currentReturnFlight = objReturn;
          }

          if (data.data.isdepart) {
            se.currentDepartFlight = data.data.flights.flights;
            se.loadFlightData(se.currentDepartFlight, se.currentReturnFlight);
          } else {
            se.currentReturnFlight = data.data.flights.flights;
            se.loadFlightData(se.currentDepartFlight, se.currentReturnFlight);
          }
          if (data.data.loader) {
            data.data.loader.dismiss();
          }
        })
      }
    })
  }


  ////////////////////////////////////
  /**
   * Hàm tính lại tổng tiền + phụ phí
   * PDANH 27/04/2019
   */
  MathPriceAll() {
    var se = this;
    var surchargePlus = se.JsonSurchargeFee.SurchargeFee.reduce(function (acc, val) { return acc + val.Price; }, 0);
    let adultFlightNumber = se.adults;
    se.JsonSurchargeFee.TransportPriceSale = se.transportPriceSale + se.transportPriceSaleForChild;
    se.totalTransportPriceSale = se.JsonSurchargeFee.TransportPriceSale;
    se.totalSurchargeWeekendFee = 0;

    se.JsonSurchargeFee.TotalAll = se.TotalPriceCombo +
      se.JsonSurchargeFee.RoomDifferenceFee
      + se.JsonSurchargeFee.DepartTicketDifferenceFee
      + se.JsonSurchargeFee.ReturnTicketDifferenceFee
      + se.totalSurchargeWeekendFee
      + se.totalTransportPriceSale
      + surchargePlus
      + se.totalAirLineLuggage;
    let GetSubPriceForAdultExtrabed = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.PassengerType == 0 && (e.Code == 'EXBA' || e.type == 'flightDepart' || e.type == 'flightReturn') });
    se.totalPriceForEXBA = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.Code == 'EXBA' }).reduce(function (acc, val) { return acc + val.Price / val.Quantity; }, 0);//= GetSubPriceForAdultExtrabed.reduce(function (acc, val) { return acc + val.Price / val.Quantity; }, 0);

    let GetSubPriceForChild = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return (e.PassengerType == 1 || e.PassengerType == 2) && (e.Code == 'CWE' || e.Code == 'EXBC' || e.type == 'flightDepart' || e.type == 'flightReturn') });
    se.totalPriceForChildCWE = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.Code == 'CWE' }).reduce(function (acc, val) { return acc + val.Price / val.Quantity; }, 0);
    se.totalPriceForChildEXBC = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.Code == 'EXBC' }).reduce(function (acc, val) { return acc + val.Price / val.Quantity; }, 0);
    se.totalPriceInfant = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.PassengerType == 2 }).reduce(function (acc, val) { return acc + val.Price; }, 0);

    let GetSubPriceForOtherFee = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.Code != 'EXBA' && e.Code != 'CWE' && e.Code != 'EXBC' && e.type != 'flightDepart' && e.type != 'flightReturn' });

    se.totalPriceForOtherFee = GetSubPriceForOtherFee.reduce(function (acc, val) { return acc + val.Price; }, 0);
    se.JsonSurchargeFee.TotalAll = se.JsonSurchargeFee.TotalAll - se.totalPriceForOtherFee;
    se.JsonSurchargeFee.AdultUnit = se.ComboPriceDiff.RoomDiff.AdultUnit;


    se.totalGetSubPriceForAdultExtrabed = GetSubPriceForAdultExtrabed.reduce(function (acc, val) { return acc + val.Price; }, 0);
    se.totalGetSubPriceForChild = GetSubPriceForChild.reduce(function (acc, val) { return acc + val.Price; }, 0);

    se.totalQuantityChildCWEAndEXBC = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.Code == 'CWE' || e.Code == 'EXBC' }).reduce(function (acc, val) { return acc + val.Quantity; }, 0);
    se.totalQuantityFlightForChildAndInfant = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return (e.PassengerType == 1 || e.PassengerType == 2) && (e.type == 'flightDepart' || e.type == 'flightReturn') }).reduce(function (acc, val) { return acc + val.Quantity; }, 0) / 2;
    se.totalQuantityFlightForChild = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return (e.PassengerType == 1) && (e.type == 'flightDepart' || e.type == 'flightReturn') }).reduce(function (acc, val) { return acc + val.Quantity; }, 0) / 2 - adultFlightNumber;

    se.totalPriceChild = 0;
    if (se.totalPriceForChildCWE > 0 && se.totalPriceForChildEXBC > 0) {
      se.totalPriceChild == 0
    }
    else if (se.totalQuantityChildCWEAndEXBC < (se.totalQuantityFlightForChildAndInfant) && se.currentDepartFlight != undefined && se.currentReturnFlight != undefined) {
      se.totalPriceChild = (se.totalQuantityFlightForChild - se.totalQuantityChildCWEAndEXBC) * (se.ComboPriceDiff.DepartFlightDiff.ChildUnit + se.ComboPriceDiff.ReturnFlightDiff.ChildUnit) + (se.ChildOtherFeeTotal - se.ChildOtherFee * se.totalQuantityChildCWEAndEXBC);  //$.grep(se.JsonSurchargeFee.SurchargeFee, function (e) { return e.PassengerType == 1 }).reduce(function (acc, val) { return acc + val.Price; }, 0);
    }

    if (adultFlightNumber > 0) {

      se.totalPriceChild += (se.ComboPriceDiff.DepartFlightDiff.AdultUnitExb + se.ComboPriceDiff.ReturnFlightDiff.AdultUnitExb) * adultFlightNumber;
    }

    if (se.totalChild > 0) {
      se.ComboPriceDiff.RoomDiff.ChildUnit = se.totalGetSubPriceForChild / se.totalChild;

    }
    se.totalFlightDepart = se.currentDepartFlight == undefined ? 0 : se.currentDepartFlight[0].priceSummaries.reduce(function (acc, val) { return acc + val.total; }, 0);
    se.totalFlightReturn = se.currentReturnFlight == undefined ? 0 : se.currentReturnFlight[0].priceSummaries.reduce(function (acc, val) { return acc + val.total; }, 0);
    se.commissionFlight = se.ComboPriceDiff.DepartFlightDiff.CommissionAdult * se.AdultCombo + se.ComboPriceDiff.ReturnFlightDiff.CommissionAdult * se.AdultCombo;
    se.commissionDepart = se.ComboPriceDiff.DepartFlightDiff.CommissionAdult * se.AdultCombo;
    if (se.commissionFlight < 0) {
      se.commissionFlight = 0;
    }
    se.Commission = (se.elementMealtype == undefined ? 0 : se.JsonSurchargeFee.TotalAll - (se.totalFlightDepart + se.totalFlightReturn + (se.transportPriceNet * se.totalAdult + se.transportPriceNetForChild * (se.totalInfant + se.totalChild) + se.elementMealtype.PriceAvgPlusNet * se.elementMealtype.TotalRoom * se.TotalNight) + se.JsonSurchargeFee.BaggageDepart + se.JsonSurchargeFee.BaggageReturn));
    if (!se.bookCombo.Luggage) {
      se.bookCombo.Luggage = 0;
    }
    let pricetotal = Math.ceil(se.JsonSurchargeFee.TotalAll) + se.bookCombo.Luggage;
    //Tính thêm tiền bảo hiểm nếu có tích chọn mua bảo hiểm đi kèm combo
    if (!se.hasInsurrance && se.bookCombo.checkInsurranceFee) {
      pricetotal += se.objInsurranceFee.priceTaTotal;
    }

    se.PriceAvgPlusTAStr = pricetotal.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    se.TotalPrice = pricetotal;
    var tempprice = se.TotalPrice;
    if (se.point > 0) {
      se.Pricepoint = tempprice - se.point;
      se.Pricepointshow = se.Pricepoint.toLocaleString();
      if (se.Pricepoint <= 0) {
        se.ischeckpoint = true;
        se.Pricepointshow = 0;
      }
      else {
        se.ischeckpoint = false;
      }
      //se.PriceAvgPlusTAStr = se.Pricepoint.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }

    var total = se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '');
      if (se.ischeck) {
        total = se.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
      }
    
    if (se.ischeckbtnpromo) {
      
      var total = se.TotalPrice.toFixed(0);;
      if (se.ischeck) {
        total = se.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
      }
      se.Pricepointshow = total - se.totaldiscountpromo;
      if (se.Pricepointshow > 0) {
        se.Pricepointshow = se.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        se.ischeckbtnpromo = true;
        se.ischeckpromo = true;
      }
      else {
        se.Pricepointshow = 0;
      }
      se.ischecktext = 0;
      se.ischeckerror = 0;
    }
    se.bookCombo.totalprice = se.Pricepointshow ? se.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") : se.PriceAvgPlusTAStr;
    se.bookCombo.pricePointShow = se.Pricepointshow;
    se.bookCombo.point = se.point;
    if ((!se.departfi || !se.returnfi) && se.loaddatafromcache) {
      se.zone.run(() => {
        se.PriceAvgPlusTAStr = 0;
        se.TotalPrice = 0;
        se.loadpricedone = true;
        se.loadflightpricedone = true;
      })
    }

  }

  edit() {
    this.zone.run(() => {
      //Tính thêm tiền bảo hiểm nếu có tích chọn mua bảo hiểm đi kèm combo
      if (!this.bookCombo.Luggage) {
        this.bookCombo.Luggage = 0;
      }
      var pricetotal = this.JsonSurchargeFee.TotalAll + this.bookCombo.Luggage;

      if (!this.hasInsurrance && this.bookCombo.checkInsurranceFee) {
        pricetotal += this.objInsurranceFee.priceTaTotal;
        this.PriceAvgPlusTAStr = pricetotal;
      }
      this.TotalPrice = pricetotal;
      this.bookCombo.totalPriceBeforeApplyVoucher = this.TotalPrice;
      if (this.ischeck) {
        if (this.ischeckpoint) {
          this.Pricepointshow = 0;
        }
        else {
          if (this.ischeckpromo) {
            this.price = this.point.toLocaleString();
            var tempprice = this.TotalPrice;
            this.Pricepoint = tempprice - this.point - this.totaldiscountpromo;
            if(this.Pricepoint <= 0){
              this.Pricepoint =0;
            }
            this.Pricepointshow = this.Pricepoint.toLocaleString();
            this.bookCombo.totalprice = this.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          } else {
            this.price = this.point.toLocaleString();
            var tempprice = this.TotalPrice;
            this.Pricepoint = tempprice - this.point;
            if(this.Pricepoint <= 0){
              this.Pricepoint =0;
            }
            this.Pricepointshow = this.Pricepoint.toLocaleString();
            this.PriceAvgPlusTAStr = this.TotalPrice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            this.bookCombo.totalprice = this.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          }
        }

      } else {
        if (this.ischeckpromo) {
          this.PriceAvgPlusTAStr = this.TotalPrice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          var tempprice = this.TotalPrice;
          this.Pricepointshow = tempprice - this.totaldiscountpromo;
          if(this.Pricepointshow <= 0){
            this.Pricepointshow =0;
          }
          this.Pricepointshow = this.Pricepointshow.toLocaleString();
        }
        else {
          if(this.strPromoCode){
            let tempprice = this.TotalPrice;
            this.Pricepointshow = tempprice - this.totaldiscountpromo;
          }
          this.PriceAvgPlusTAStr = this.TotalPrice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.bookCombo.totalprice = this.TotalPrice;
        }

      }
    })
  }
  /**
   * Hàm tính lại phụ phí của phòng
   * PDANH 27/04/2019
   */
  MathGaladinnerAdExtrabed() {
    var se = this;
    if (se.elementMealtype == undefined) return false;


    se.totalExtraBedAndGalaDinerListTA = 0;
    se.JsonSurchargeFee.SurchargeFee = [];
    if (se.elementMealtype.ExtraBedAndGalaDinerList.length > 0) {
      for (var i = 0; i < se.elementMealtype.ExtraBedAndGalaDinerList.length; i++) {
        if (se.elementMealtype.ExtraBedAndGalaDinerList[i].ChargeType == "Per Night" || se.elementMealtype.ExtraBedAndGalaDinerList[i].ChargeType == "Per Bed" || se.elementMealtype.ExtraBedAndGalaDinerList[i].ChargeType == "Per Meal WithoutNo") {
          se.totalExtraBedAndGalaDinerListTA += se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value * se.elementMealtype.ExtraBedAndGalaDinerList[i].PriceOTA * se.TotalNight;
          var priceItem2 = { Code: se.elementMealtype.ExtraBedAndGalaDinerList[i].Code, type: 'room', PassengerType: (se.elementMealtype.ExtraBedAndGalaDinerList[i].ChargeOn == 'Per Adult' ? 0 : 1), PriceType: 0, Text: se.elementMealtype.ExtraBedAndGalaDinerList[i].NameDisplay, Quantity: se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value, Price: (se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value * se.elementMealtype.ExtraBedAndGalaDinerList[i].PriceOTA * se.TotalNight), PriceFormat: (se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value * se.elementMealtype.ExtraBedAndGalaDinerList[i].PriceOTA * se.TotalNight).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
          se.JsonSurchargeFee.SurchargeFee.push(priceItem2);

        }
        else {
          se.totalExtraBedAndGalaDinerListTA += se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value * se.elementMealtype.ExtraBedAndGalaDinerList[i].PriceOTA;
          var priceItem2 = { Code: se.elementMealtype.ExtraBedAndGalaDinerList[i].Code, type: 'room', PassengerType: (se.elementMealtype.ExtraBedAndGalaDinerList[i].ChargeOn == 'Per Adult' ? 0 : 1), PriceType: 0, Text: se.elementMealtype.ExtraBedAndGalaDinerList[i].NameDisplay, Quantity: se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value, Price: (se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value * se.elementMealtype.ExtraBedAndGalaDinerList[i].PriceOTA), PriceFormat: (se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value * se.elementMealtype.ExtraBedAndGalaDinerList[i].PriceOTA).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
          se.JsonSurchargeFee.SurchargeFee.push(priceItem2);
        }
      }
    }


    //AdultOtherFee
    se.AdultOtherFee = 0;
    se.elementMealtype.ExtraBedAndGalaDinerList.forEach(e => {
      if (e.ChargeOn == 'Per Adult' && e.Code != 'EXBA') {
        se.AdultOtherFee += e.PriceOTA;
      }
    });
    //ChildOtherFee
    se.ChildOtherFee = 0;
    se.elementMealtype.ExtraBedAndGalaDinerList.forEach(e => {
      if (e.ChargeOn == 'Per Child' && e.Code != 'CWE' && e.Code != 'EXBC') {
        se.ChildOtherFee += e.PriceOTA;
      }
    });
    //ChildOtherFeeTotal
    se.ChildOtherFeeTotal = 0;
    se.elementMealtype.ExtraBedAndGalaDinerList.forEach(e => {
      if (e.ChargeOn == 'Per Child' && e.Code != 'CWE' && e.Code != 'EXBC') {
        se.ChildOtherFeeTotal += e.PriceOTA * e.Quantity.value;
      }
    });

    se.AdultOtherFee = se.AdultOtherFee * (se.roomclass.Rooms[0].IncludeAdults * se.roomnumber) / se.AdultCombo;
    se.PriceDiffUnit = se.AdultOtherFee + ((se.elementMealtype.PriceAvgDefaultTA * se.roomnumber) * se.TotalNight / se.AdultCombo) - se.roomPriceSale;

    se.ComboPriceDiff.RoomDiff.Total = se.elementMealtype.PriceAvgPlusTotalTA - (se.roomPriceSale * se.AdultCombo) //- totalExtraBedAndGalaDinerListTA;
    se.ComboPriceDiff.RoomDiff.AdultUnit = se.PriceDiffUnit;

    se.JsonSurchargeFee.RoomDifferenceFee = se.PriceDiffUnit * se.AdultCombo + (se.totalAdult - se.AdultCombo) * se.AdultOtherFee + se.ChildOtherFeeTotal;

  }
  /**
   * Tính lại giá + phụ phí khi đổi vé máy bay chiều đi
   * PDANH 27/04/2019
   */
  SaveFlightDepartSelected() {
    var se = this;
    if (!se.currentDepartFlight) return;
    se.JsonSurchargeFee.SurchargeFee = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.type != 'flightDepart'; });
    var priceFlightAdult = 0;
    se.currentDepartFlight[0].priceSummaries.forEach(e => {
      if (e.passengerType == 0) {
        priceFlightAdult += e.price;
      }
    });

    se.ComboPriceDiff.DepartFlightDiff.AdultUnit = priceFlightAdult - se.departTicketSale;
    var tempDiff = se.ComboPriceDiff.DepartFlightDiff.AdultUnit;
    se.ComboPriceDiff.DepartFlightDiff.CommissionAdult = Math.ceil((se.ComboPriceDiff.DepartFlightDiff.AdultUnit < 0 ? Math.abs(se.ComboPriceDiff.DepartFlightDiff.AdultUnit * 0.3) : -tempDiff) / 1000) * 1000;
    //Hiển thị giá tăng/giảm chiều đi
    se.de_flightpricetitle = Math.ceil((se.ComboPriceDiff.DepartFlightDiff.AdultUnit < 0 ? Math.abs(se.ComboPriceDiff.DepartFlightDiff.AdultUnit * 0.7) : tempDiff) / 1000) * 1000;
    se.de_flightpricetitle = se.de_flightpricetitle.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    se.de_departpriceincrease = tempDiff > 0 ? true : false;
    se.ComboPriceDiff.DepartFlightDiff.AdultUnit = se.ComboPriceDiff.DepartFlightDiff.AdultUnit + (se.ComboPriceDiff.DepartFlightDiff.CommissionAdult > 0 ? se.ComboPriceDiff.DepartFlightDiff.CommissionAdult : 0);
    se.ComboPriceDiff.DepartFlightDiff.AdultUnitExb = 0;
    se.currentDepartFlight[0].priceSummaries.forEach(e => {
      if (e.passengerType == 0) {
        se.ComboPriceDiff.DepartFlightDiff.AdultUnitExb += e.price;
      }
    });

    se.ComboPriceDiff.DepartFlightDiff.ChildUnit = 0;
    if (se.totalChild > 0) {
      se.ComboPriceDiff.DepartFlightDiff.ChildUnit = 0;
      se.currentDepartFlight[0].priceSummaries.forEach(e => {
        if (e.passengerType == 1) {
          se.ComboPriceDiff.DepartFlightDiff.ChildUnit += e.price;
        }
      });

    }

    se.ComboPriceDiff.DepartFlightDiff.InfantUnit = 0;
    if (se.totalInfant > 0) {
      se.currentDepartFlight[0].priceSummaries.forEach(e => {
        if (e.passengerType == 2) {
          se.ComboPriceDiff.DepartFlightDiff.InfantUnit += e.price;
        }
      });
    }

    se.JsonSurchargeFee.DepartTicketDifferenceFee = se.ComboPriceDiff.DepartFlightDiff.AdultUnit * se.AdultCombo;
    if (se.totalChild > 0) {
      var priceItem = { type: 'flightDepart', PassengerType: 1, Quantity: (se.totalChild), PriceType: 1, Text: 'Vé máy bay chiều đi', Price: (se.ComboPriceDiff.DepartFlightDiff.ChildUnit * (se.totalChild)), PriceFormat: (se.ComboPriceDiff.DepartFlightDiff.ChildUnit * (se.totalChild)).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
      se.JsonSurchargeFee.SurchargeFee.push(priceItem);
    }
    if (se.totalInfant > 0) {
      var priceItem = { type: 'flightDepart', PassengerType: 2, Quantity: (se.totalInfant), PriceType: 1, Text: 'Vé máy bay chiều đi', Price: (se.ComboPriceDiff.DepartFlightDiff.InfantUnit * se.totalInfant), PriceFormat: (se.ComboPriceDiff.DepartFlightDiff.InfantUnit * se.totalInfant).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
      se.JsonSurchargeFee.SurchargeFee.push(priceItem);
    }
    if (se.totalAdultExtrabed > 0 && se.adultFlightNumber == 0) {
      var priceItem = { type: 'flightDepart', PassengerType: 0, Quantity: se.totalAdultExtrabed, PriceType: 1, Text: 'Vé máy bay chiều đi', Price: priceFlightAdult * se.totalAdultExtrabed, PriceFormat: (priceFlightAdult * se.totalAdultExtrabed).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
      se.JsonSurchargeFee.SurchargeFee.push(priceItem);
    } else if (se.adultFlightNumber > 0) {
      if (se.totalAdultExtrabed > 0) {
        var priceItem = { type: 'flightDepart', PassengerType: 0, Quantity: se.totalAdultExtrabed, PriceType: 1, Text: 'Vé máy bay chiều đi', Price: priceFlightAdult * se.totalAdultExtrabed, PriceFormat: (priceFlightAdult * se.totalAdultExtrabed).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
        se.JsonSurchargeFee.SurchargeFee.push(priceItem);
      }

      var priceItem1 = { type: 'flightDepart', PassengerType: 1, childAsAdult: true, Quantity: se.adultFlightNumber, PriceType: 1, Text: 'Vé máy bay chiều đi', Price: (priceFlightAdult * se.adultFlightNumber), PriceFormat: (priceFlightAdult * se.adultFlightNumber).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
      se.JsonSurchargeFee.SurchargeFee.push(priceItem1);

    }

    se.MathPriceAll();
  }
  /**
   * Tính lại giá + phụ phí khi đổi vé máy bay chiều về
   * PDANH 27/04/2019
   */
  SaveFlightReturnSelected() {
    var se = this;
    if (!se.currentReturnFlight) return;
    se.JsonSurchargeFee.SurchargeFee = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.type != 'flightReturn'; });
    //var priceFlightAdult = $.grep(se.FlightReturnSelected.priceSummaries, function (e) { return e.passengerType == 0; }).reduce(function (acc, val) { return acc + val.price; }, 0);
    var priceFlightAdult = 0;
    se.currentReturnFlight[0].priceSummaries.forEach(e => {
      if (e.passengerType == 0) {
        priceFlightAdult += e.price;
      }
    });
    se.ComboPriceDiff.ReturnFlightDiff.AdultUnit = priceFlightAdult - se.returnTicketSale;
    var tempDiff = se.ComboPriceDiff.ReturnFlightDiff.AdultUnit;
    se.ComboPriceDiff.ReturnFlightDiff.CommissionAdult = Math.ceil((se.ComboPriceDiff.ReturnFlightDiff.AdultUnit < 0 ? Math.abs(se.ComboPriceDiff.ReturnFlightDiff.AdultUnit * 0.3) : -tempDiff) / 1000) * 1000;
    //Hiển thị giá tăng/giảm chiều về
    se.ar_flightpricetitle = Math.ceil((se.ComboPriceDiff.ReturnFlightDiff.AdultUnit < 0 ? Math.abs(se.ComboPriceDiff.ReturnFlightDiff.AdultUnit * 0.7) : tempDiff) / 1000) * 1000;
    se.ar_flightpricetitle = se.ar_flightpricetitle.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    se.ar_returnpriceincrease = tempDiff > 0 ? true : false;
    se.ComboPriceDiff.ReturnFlightDiff.AdultUnit = se.ComboPriceDiff.ReturnFlightDiff.AdultUnit + (se.ComboPriceDiff.ReturnFlightDiff.CommissionAdult > 0 ? se.ComboPriceDiff.ReturnFlightDiff.CommissionAdult : 0);
    //se.ComboPriceDiff.ReturnFlightDiff.AdultUnitExb = $.grep(se.FlightReturnSelected.priceSummaries, function (e) { return e.passengerType == 0 }).reduce(function (acc, val) { return acc + val.price; }, 0);
    se.ComboPriceDiff.ReturnFlightDiff.AdultUnitExb = 0;
    se.currentReturnFlight[0].priceSummaries.forEach(e => {
      if (e.passengerType == 0) {
        se.ComboPriceDiff.ReturnFlightDiff.AdultUnitExb += e.price;
      }
    });

    se.ComboPriceDiff.ReturnFlightDiff.ChildUnit = 0;
    if (se.totalChild > 0) {
      se.ComboPriceDiff.ReturnFlightDiff.ChildUnit = 0;
      se.currentReturnFlight[0].priceSummaries.forEach(e => {
        if (e.passengerType == 1) {
          se.ComboPriceDiff.ReturnFlightDiff.ChildUnit += e.price;
        }
      });

    }

    se.ComboPriceDiff.ReturnFlightDiff.InfantUnit = 0;
    if (se.totalInfant > 0) {
      se.currentReturnFlight[0].priceSummaries.forEach(e => {
        if (e.passengerType == 2) {
          se.ComboPriceDiff.ReturnFlightDiff.InfantUnit += e.price;
        }
      });
    }

    se.JsonSurchargeFee.ReturnTicketDifferenceFee = se.ComboPriceDiff.ReturnFlightDiff.AdultUnit * se.AdultCombo;
    if (se.totalChild > 0) {
      var priceItem = { type: 'flightReturn', PassengerType: 1, Quantity: (se.totalChild), PriceType: 1, Text: 'Vé máy bay chiều về', Price: (se.ComboPriceDiff.ReturnFlightDiff.ChildUnit * (se.totalChild)), PriceFormat: (se.ComboPriceDiff.ReturnFlightDiff.ChildUnit * (se.totalChild)).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
      se.JsonSurchargeFee.SurchargeFee.push(priceItem);
    }
    if (se.totalInfant > 0) {
      var priceItem = { type: 'flightReturn', PassengerType: 2, Quantity: (se.totalInfant), PriceType: 1, Text: 'Vé máy bay chiều về', Price: (se.ComboPriceDiff.ReturnFlightDiff.InfantUnit * se.totalInfant), PriceFormat: (se.ComboPriceDiff.ReturnFlightDiff.InfantUnit * se.totalInfant).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
      se.JsonSurchargeFee.SurchargeFee.push(priceItem);
    }
    if (se.totalAdultExtrabed > 0 && se.adultFlightNumber == 0) {
      var priceItem = { type: 'flightReturn', PassengerType: 0, Quantity: se.totalAdultExtrabed, PriceType: 1, Text: 'Vé máy bay chiều về', Price: priceFlightAdult * se.totalAdultExtrabed, PriceFormat: (priceFlightAdult * se.totalAdultExtrabed).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
      se.JsonSurchargeFee.SurchargeFee.push(priceItem);
    }
    else
      if (se.adultFlightNumber > 0) {
        if (se.totalAdultExtrabed > 0) {
          var priceItem = { type: 'flightReturn', PassengerType: 0, Quantity: se.totalAdultExtrabed, PriceType: 1, Text: 'Vé máy bay chiều về', Price: priceFlightAdult * se.totalAdultExtrabed, PriceFormat: (priceFlightAdult * se.totalAdultExtrabed).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
          se.JsonSurchargeFee.SurchargeFee.push(priceItem);
        }
        var priceItem1 = { type: 'flightReturn', PassengerType: 1, childAsAdult: true, Quantity: se.adultFlightNumber, PriceType: 1, Text: 'Vé máy bay chiều về', Price: (priceFlightAdult * se.adultFlightNumber), PriceFormat: (priceFlightAdult * se.adultFlightNumber).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
        se.JsonSurchargeFee.SurchargeFee.push(priceItem1);
      }

    se.MathPriceAll();
  }

  async showPenalty() {
    let alert = await this.alertCtrl.create({
      header: "Giá rẻ (không hoàn tiền)",
      message: "Đây là giá đặc biệt thấp hơn giá thông thường, không thể hủy hoặc thay đổi. Trong trường hợp không thể sử dụng combo sẽ không hoàn lại tiền. <p style='text-align:center;font-style:italic;margin-bottom:0'>Nếu bạn đã có kế hoạch chắc chắn thì hãy chớp lấy cơ hội này.</p>",
      cssClass: "cls-alert-flightcomboreview",
      buttons: [{
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

  async sendRequestCombo() {
    this.bookCombo.Address = this.Address;
    this.bookCombo.ComboId = this.bookcombodetail.comboId;
    this.bookCombo.isFlightCombo = true;
    this.bookCombo.isFlashSale = false;
    this.bookCombo.isNormalCombo = false;
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: RequestComboPage
      });
    modal.present();

    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      this.valueGlobal.backValue = 'flightcombo';
      this.navCtrl.navigateBack('/hoteldetail/' + this.booking.HotelId);
    })
  }
  ionViewDidEnter() {
    var se = this;
    if (se.valueGlobal.backValue == "flightcomboinfoluggage" || se.valueGlobal.backValue == "flightcomboupgraderoom") {
      se.valueGlobal.backValue = "";
    }
    else {
      if (se.valueGlobal.backValue != "flightcombopaymentbreakdown") {
        if (this.valueGlobal.listlunar) {
          for (let j = 0; j < this.valueGlobal.listlunar.length; j++) {
            this._daysConfig.push({
              date: this.valueGlobal.listlunar[j].date,
              subTitle: this.valueGlobal.listlunar[j].name,
              cssClass: 'lunarcalendar'
            })
          }
        }
        se.ischangefly = true;
        se.bookCombo.Luggage = 0;
        se.ischeck = false;
        se.GetUserInfo();
        se.loadflightpricedone = false;
        se.listDepart = [];
        se.listReturn = [];
        se.listDeparture = [];
        if (se.bookCombo.MealTypeIndex) {
          se.index = se.bookCombo.MealTypeIndex;
        }
        se.loadFlightDataNew(true);
      } else {
        se.valueGlobal.backValue = "";
      }
    }


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
          this.gf.RequestApi('GET', strUrl, headers, {}, 'flightComboReview', 'GetUserInfo').then((data)=>{

            se.point = 0;
            if (data) {
              se.zone.run(() => {
                if (data.point) {
                  if (data.point > 0) {
                    se.pointshow=data.point;
                    se.Roomif.point = data.point;
                    se.point = data.point * 1000;
                    se.price = se.point.toLocaleString();
                    var tempprice =0;
                    if (se.PriceAvgPlusTAStr) {
                      tempprice  = se.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
                    }
                   
                    se.Pricepoint = tempprice - se.point;
                    se.Pricepointshow = se.Pricepoint.toLocaleString();
                    if (se.Pricepoint <= 0) {
                      se.ischeckpoint = true;
                      se.Pricepointshow = 0;
                    }
                  }
                  // if (data.point > 0) {
                  //   se.pointshow = data.point;
                  //   se.Roomif.point = data.point;
                  //   se.point = data.point * 1000;
                  //   se.price = se.point.toLocaleString();
                  // }
                }
                se.storage.remove('point');
                se.storage.set('point', data.point);
              })
              //se.storage.set('userInfoData', data);
            }

          
        });
      }
    })
  }
  refreshToken() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'GET',
        //   url: C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims',
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json-patch+json',
        //     authorization: text
        //   },
        // }
        let headers = {
          'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims';
          this.gf.RequestApi('GET', strUrl, headers, {}, 'flightComboReview', 'reloadTokenClaims').then((data)=>{
            
            var au = data;
            se.zone.run(() => {
              se.storage.remove('auth_token');
              se.storage.set('auth_token', au.auth_token);
              var decoded = jwt_decode<any>(au.auth_token);
              se.storage.remove('point');
              se.storage.set('point', decoded.point);
              se.storage.get('point').then(point => {
                if (point) {
                  if (point > 0) {
                    se.pointshow = point;
                    se.Roomif.point = point;
                    se.point = point * 1000;
                    se.price = se.point.toLocaleString();
                  }
                }
              });
            })
          
        })
      }
    })
  }
  public async showConfirm() {
    let alert = await this.alertCtrl.create({
      message: "Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại để sử dụng chức năng này.",
      backdropDismiss: false,
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
            //this.valueGlobal.logingoback = "MainPage";
            this.navCtrl.navigateForward('/login');
          }
        },
      ]
    });
    alert.present();
  }

  promofunc() {
    var se = this;
    if (se.promocode) {

      let headers = {
        'postman-token': '37a7a641-c2dd-9fc6-178b-6a5eed1bc611',
          'cache-control': 'no-cache',
          'content-type': 'application/json'
      };
      let strUrl = C.urls.baseUrl.urlMobile + '/api/data/validpromocode';
        this.gf.RequestApi('POST', strUrl, headers, { bookingCode: 'HOTEL',code: se.promocode, totalAmount: se.TotalPrice, comboDetailId: this.bookCombo.ComboId,
        couponData: {
          "hotel": {
            "hotelId": this.booking.HotelId,
            "roomName": this.booking.RoomName,
            "totalRoom": this.Roomif.roomnumber,
            "totalAdult": this.booking.Adults,
            "totalChild": this.booking.Child,
            "jsonObject": "",
            "checkIn": this.searchhotel.CheckInDate,
            "checkOut": this.searchhotel.CheckOutDate
          }
        } }, 'flightComboReview', 'reloadTokenClaims').then((data)=>{

        se.zone.run(() => {
          var json = data;
          if (json.error == 0) {
            var total = se.TotalPrice;
            if (se.ischeck) {
              total = se.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
            }
            let discountpromo = json.data.orginDiscount ? json.data.orginDiscount : json.data.discount;
            se.Pricepointshow = total - discountpromo;
            se.discountpromo = discountpromo;
            se.promocode = json.data.code;
            se.strPromoCode = json.data.code;
            se.totaldiscountpromo = discountpromo;
            if (se.Pricepointshow > 0) {
              se.Pricepointshow = se.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
              se.ischeckbtnpromo = true;
              se.ischeckpromo = true;
            }
            else {
              se.ischeckbtnpromo = true;
              se.Pricepointshow = 0;
            }
            se.msg = json.msg;
            se.ischecktext = 0;
            se.ischeckerror = 0;
          }
          else if (json.error == 1) {
            se.ischeckbtnpromo = false;
            se.msg = json.msg;
            se.discountpromo = 0;
            se.ischecktext = 1;
            se.ischeckerror = 1;
          }
          else if (json.error == 2) {
            se.ischeckbtnpromo = false;
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
    this.ischeckbtnpromo = false;
    this.discountpromo = 0;
    this.ischeckerror = 0;
    this.msg = "";
    this.ischecktext = 3;
    if (this.ischeck) {
      if (this.ischeckpoint) {
        this.Pricepointshow = 0;
      }
      else {
        this.price = this.point.toLocaleString();
        var tempprice = this.TotalPrice;
        this.Pricepoint = tempprice - this.point;
        this.Pricepointshow = this.Pricepoint.toLocaleString();
      }
    }
  }
  click() {
    this.ischecktext = 3;
  }
  async showdiscount() {
    if (!this.loadflightpricedone) {
      this.presentToastwarming('Đang tìm vé máy bay tốt nhất. Xin quý khách vui lòng đợi trong giây lát!');
      return;
    }
    if (!this.ischeck) {
      $('.div-point').removeClass('div-disabled');
      this.valueGlobal.PriceAvgPlusTAStr=this.PriceAvgPlusTAStr;
      this.textpromotion="iVIVU Voucher | Mobile Gift";
      this.msg="";
     
      this._voucherService.openFrom = 'flightcomboreview';
      const modal: HTMLIonModalElement =
        await this.modalCtrl.create({
          component: AdddiscountPage,
        });

    this._voucherService.listPromoCode = [];
    this.buildStringPromoCode();
    this.edit();

      modal.present();
     
      modal.onDidDismiss().then((data: OverlayEventDetail) => {
        if(this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0){
          if(this.strPromoCode){
            this.strPromoCode += ', '+this._voucherService.listPromoCode.join(', ');
            this.totaldiscountpromo += this._voucherService.totalDiscountPromoCode;
          }else{
            this.strPromoCode = this._voucherService.listPromoCode.join(', ');
            this.totaldiscountpromo = this._voucherService.totalDiscountPromoCode;
          }
          this.buildStringPromoCode();
          this.edit();
        }else if (data.data) {//case voucher km
          let vc = data.data;
          if(vc.applyFor && vc.applyFor != 'comboflight'){
            this.gf.showAlertMessageOnly(`Mã giảm giá chỉ áp dụng cho đơn hàng ${ vc.applyFor == 'hotel' ? 'khách sạn' : 'vé máy bay'}. Quý khách vui lòng chọn lại mã khác!`);
            this._voucherService.rollbackSelectedVoucher.emit(vc);
            return;
          }
          else {
            this.zone.run(() => {
              if (data.data.promocode) {
                $('.div-point').addClass('div-disabled');
                this.promocode=data.data.promocode;
                this.promofunc();
              }
            })
          }
        }else{
          this.ischeckbtnpromo = false;
        }
      })
    }
  }

  async upgradeRoom() {
    var se = this;
    se.activityService.objFlightComboUpgrade = {};
    se.activityService.objFlightComboUpgrade.Rooms = se.jsonroom;
    se.activityService.objFlightComboUpgrade.CurrentRoom = se.elementMealtype;
    se.activityService.objFlightComboUpgrade.roomPriceSale = se.roomPriceSale;
    se.activityService.objFlightComboUpgrade.address = se.Address;
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: FlightcomboupgraderoomPage
      });
    modal.present();

    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      if (data.data) {
        se.zone.run(() => {
          let itemroom = data.data.itemroom;
          let itemmealtype = data.data.itemmealtype;
          se.index = data.data.index;
          se.RoomType = itemroom.RoomType;
          se.roomnumber=itemmealtype.TotalRoom
          se.statusRoom=itemmealtype.Status;
          if (itemmealtype.Name != null && itemmealtype.Notes.length == 0) {
            se.breakfast = itemmealtype.Name;
          }
          else if (itemmealtype.Name != null && itemmealtype.Notes.length != 0 && itemmealtype.Notes[0].length == itemmealtype.Name.length) {
            se.breakfast = itemmealtype.Notes.join(', ')
            itemmealtype.Name = itemmealtype.Notes.join(', ');
          }
          else if (itemmealtype.Name != null && itemmealtype.Notes.length != 0 && itemmealtype.Notes[0].length != itemmealtype.Name.length) {
            se.breakfast = itemmealtype.Name + ", " + itemmealtype.Notes.join(', ');
            itemmealtype.Name = itemmealtype.Name + ", " + itemmealtype.Notes.join(', ');
          }
          se.elementMealtype = itemmealtype;
          se.bookCombo.mealTypeRates = itemmealtype;
          //se.breakfast = itemmealtype.Name;
          se.Roomif.arrroom = [];
          se.Roomif.arrroom.push(itemroom);
          if (itemroom && itemmealtype) {
            se.callSummaryPriceAfterUpgradeRoom(itemroom, itemmealtype)
          }
        })
      }
    })
  }

  /**
   * Tính lại tổng tiền combo sau khi nâng cấp phòng
   */
  callSummaryPriceAfterUpgradeRoom(itemroom, itemmealtype) {
    var se = this;
    if (itemroom && !itemroom.MSGCode) {
      // Giá nhà cung cấp
      se.TravPaxPrices = itemmealtype.PriceAvgPlusNet * se.roomnumber * se.TotalNight;

      se.roomclass = itemroom;
      se.nameroom = itemroom.ClassName;
      se.roomnumber = itemroom.TotalRoom;
      se.elementMealtype = itemmealtype;
      se.bookCombo.mealTypeRates = itemmealtype;
      se.AdultCombo = itemroom.Rooms[0].IncludeAdults * se.elementMealtype.TotalRoom;
      se.AdultCombo = se.AdultCombo > se.totalAdult ? se.totalAdult : se.AdultCombo;

      se.transportPriceSale = se.transportPriceSale * (se.totalAdult - se.AdultCombo);
      se.transportPriceNet = se.transportPriceNet * (se.totalAdult - se.AdultCombo);

      se.TotalPriceCombo = se.totalPriceSale * se.AdultCombo;
      se.totalAdultExtrabed = se.totalAdult - se.AdultCombo;
      se.MathGaladinnerAdExtrabed();
      if (se.currentDepartFlight != undefined) {
        se.SaveFlightDepartSelected();
      }
      if (se.currentDepartFlight != undefined) {
        se.SaveFlightReturnSelected();
      }
      se.MathPriceAll();
    }
  }

  /**
   * Hàm tính lại phụ phí của phòng
   * PDANH 27/04/2019
   */
   calculateDiffPriceUnit() {
    var se = this;

    if(se.jsonroom && se.jsonroom.length >0){

      se.jsonroom.forEach(room => {
        room.MealTypeRates.forEach(element => {
          //AdultOtherFee
          let adultOtherFee = 0;
          element.ExtraBedAndGalaDinerList.forEach(e => {
            if (e.ChargeOn == 'Per Adult' && e.Code != 'EXBA') {
              adultOtherFee += e.PriceOTA;
            }
          });
          //ChildOtherFee
          let childOtherFee = 0;
          element.ExtraBedAndGalaDinerList.forEach(e => {
            if (e.ChargeOn == 'Per Child' && e.Code != 'CWE' && e.Code != 'EXBC') {
              childOtherFee += e.PriceOTA;
            }
          });
          //ChildOtherFeeTotal
          let childOtherFeeTotal = 0;
          element.ExtraBedAndGalaDinerList.forEach(e => {
            if (e.ChargeOn == 'Per Child' && e.Code != 'CWE' && e.Code != 'EXBC') {
              childOtherFeeTotal += e.PriceOTA * e.Quantity.value;
            }
          });
          let adultCombo = room.Rooms[0].IncludeAdults * element.TotalRoom;
          adultCombo = adultCombo > se.totalAdult ? se.totalAdult : adultCombo;
          adultOtherFee = 0;
          element.PriceDiffUnit=0;
          if(adultCombo){
              adultOtherFee = adultOtherFee * (room.Rooms[0].IncludeAdults * se.roomnumber) / adultCombo;
              element.PriceDiffUnit = adultOtherFee + ((element.PriceAvgDefaultTA * se.roomnumber) * se.TotalNight / adultCombo) - se.roomPriceSale;
              element.PriceDiffUnit = Math.round(element.PriceDiffUnit);
          }
         
        });
      });
      
      //se.ComboPriceDiff.RoomDiff.Total = se.elementMealtype.PriceAvgPlusTotalTA - (se.roomPriceSale * se.AdultCombo) //- totalExtraBedAndGalaDinerListTA;
      //se.ComboPriceDiff.RoomDiff.AdultUnit = se.PriceDiffUnit;

      }
    
  }

  showComboDetail() {
    var se = this;
    se.valueGlobal.backValue = 'flightcombopaymentbreakdown';
    if (!se.bookCombo.Luggage) {
      se.bookCombo.Luggage = 0;
    }
    se.activityService.objFlightComboPaymentBreakDown = { objDetail: se };
    se._voucherService.comboFlightPromoCode = se.strPromoCode;
    se._voucherService.comboFlightTotalDiscount = se.totaldiscountpromo;
    se.navCtrl.navigateForward("/flightcombopaymentbreakdown");
  }

  async presentToastwarming(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }

  async changeDateInfo() {
    var se = this;
    
    if (!this.loadflightpricedone) {
      this.presentToastwarming('Đang tìm vé máy bay tốt nhất. Xin quý khách vui lòng đợi trong giây lát!');
      return;
    }
    if(!this.allowclickcalendar){
      return;
    }
    

    this.allowclickcalendar = false;
    this.msgEmptyFlight = '';
    let arr = se.cin.split('-');
    let arr1 = se.cout.split('-');
    let newdatecin = new Date(arr[2], arr[1] - 1, arr[0]);
    let newdatecout = new Date(arr1[2], arr1[1] - 1, arr1[0]);
    let fromdate = new Date(this.gf.getCinIsoDate(newdatecin));
    let todate = new Date(this.gf.getCinIsoDate(newdatecout));
     if(this.valueGlobal.notSuggestDailyCB){
      for (let j = 0; j < this.valueGlobal.notSuggestDailyCB.length; j++) {
        this._daysConfig.push({
          date: this.valueGlobal.notSuggestDailyCB[j],
          cssClass: 'strikethrough'
        })
      }
     }
     if(this.arrBOD && this.arrBOD.length>0){
      for (let j = 0; j < this.arrBOD.length; j++) {
        this._daysConfig.push({
          date: this.arrBOD[j],
          cssClass: 'strikethrough'
        })
      }
    }
     if(this.valueGlobal.listlunar){
      for (let j = 0; j < this.valueGlobal.listlunar.length; j++) {
        this._daysConfig.push({
          date: this.valueGlobal.listlunar[j].date,
          subTitle: this.valueGlobal.listlunar[j].name,
          cssClass: 'lunarcalendar'
        })
      }
    }
    
    let modal = await se.modalCtrl.create({
      component: SelectDateRangePage,
    });
    se.searchhotel.formChangeDate = 8;
    se.valueGlobal.ischeckCB = 1;
    modal.present();
    const event: any = await modal.onDidDismiss();
    if (event) {
      this.allowclickcalendar = true;
      let fromdate = event.data.from;
      let todate = event.data.to;
      if (fromdate && todate && moment(todate).diff(fromdate, 'days') > 0) {
        var se = this;
        let arr_ed = this.bookCombo.objComboDetail.endDate.split('-');
        let ed = new Date(arr_ed[2], arr_ed[1] - 1, arr_ed[0]);
        if (moment(fromdate).diff(ed, 'days') > 0) {
          this.presentToastwarming('Combo chỉ áp dụng trong khoảng ' + this.bookCombo.objComboDetail.startDate + ' đến ' + this.bookCombo.objComboDetail.endDate + '. Vui lòng chọn lại.');
          return;
        }
        //Nếu chọn duration = 1 thì tự cộng thêm 1 ngày cho = duration combo
        let _duration = moment(todate).diff(moment(fromdate), 'days');
        if (_duration == 1) {
          se.booking.CheckInDate = moment(fromdate).format('YYYY-MM-DD');
          se.booking.CheckOutDate = (moment(todate).add('days', 1)).format('YYYY-MM-DD');
          se.cin = moment(fromdate).format('DD-MM-YYYY');
          se.cout = (moment(todate).add('days', 1)).format('DD-MM-YYYY');
        } else {
          se.booking.CheckInDate = moment(fromdate).format('YYYY-MM-DD');
          se.booking.CheckOutDate = moment(todate).format('YYYY-MM-DD');
          se.cin = moment(fromdate).format('DD-MM-YYYY');
          se.cout = moment(todate).format('DD-MM-YYYY');
        }
        //se.searchhotel.CheckInDate = se.booking.CheckInDate;
        //se.searchhotel.CheckOutDate = se.booking.CheckOutDate;
        se.bookCombo.FormParam.CheckInDate = se.booking.CheckInDate;
        se.bookCombo.FormParam.CheckOutDate = se.booking.CheckOutDate;
        se.bookCombo.CheckInDate = se.booking.CheckInDate;
        se.bookCombo.CheckOutDate = se.booking.CheckOutDate;
        se.duration = moment(se.booking.CheckOutDate).diff(moment(se.booking.CheckInDate), 'days');
        se.dur = se.duration;
        se.TotalNight = se.duration;
        //hiện ngày check in out
        var cintemp = new Date(se.gf.getCinIsoDate(se.booking.CheckInDate));
        se.cindisplay = moment(cintemp).format('DD') + ' ' + 'thg' + ' ' + moment(cintemp).format('MM')

        var couttemp = new Date(se.gf.getCinIsoDate(se.booking.CheckOutDate));
        se.coutdisplay = moment(couttemp).format('DD') + ' ' + 'thg' + ' ' + moment(couttemp).format('MM');
        se.cinthudisplay = se.getDayOfWeek(se.booking.CheckInDate);
        se.coutthudisplay = se.getDayOfWeek(se.booking.CheckOutDate);
        se.ischangefly = true;
        se.bookCombo.Luggage = 0;
        se.gf.setCacheSearchHotelInfo({checkInDate: se.booking.CheckInDate, checkOutDate: se.booking.CheckOutDate, adult: se.searchhotel.adult, child: se.searchhotel.child, childAge: se.searchhotel.arrchild, roomNumber: se.searchhotel.roomnumber});
        se.storage.set('hasChangeDate', true);
        se.checkComboAfterChangedate();
        setTimeout(() => {
          se.modalCtrl.dismiss();
        }, 100)
      }
    }
  }

  async clickedElement(e: any) {
    var obj: any = e.currentTarget;
    if ($(obj.parentNode).hasClass('endSelection') || $(obj.parentNode).hasClass('startSelection')) {
      if (this.modalCtrl) {
        let fday: any;
        let tday: any;
        var monthenddate: any;
        var yearenddate: any;
        var monthstartdate: any;
        var yearstartdate: any;
        var objTextMonthEndDate: any;
        var objTextMonthStartDate: any;
        if ($(obj.parentNode).hasClass('endSelection')) {
          if ($('.days-btn.lunarcalendar.on-selected > p')[0]) {
            fday = $('.days-btn.lunarcalendar.on-selected > p')[0].innerText;
          } else {
            fday = $('.on-selected')[0].textContent;
          }
          if ($('.days.endSelection .days-btn.lunarcalendar > p')[0]) {
            tday = $('.days.endSelection .days-btn.lunarcalendar > p')[0].innerText;
          } else {
            tday = $(obj)[0].textContent;
          }
          objTextMonthStartDate = $('.on-selected').closest('.month-box').children()[0].textContent;
          objTextMonthEndDate = $(obj).closest('.month-box').children()[0].textContent;
        } else {
          if ($('.days-btn.lunarcalendar.on-selected > p')[0]) {
            fday = $('.days-btn.lunarcalendar.on-selected > p')[0].innerText
          }
          else {
            fday = $(obj)[0].textContent;
          }
          if ($('.days.endSelection .days-btn.lunarcalendar > p')[0]) {
            tday = $('.days.endSelection .days-btn.lunarcalendar > p')[0].innerText;
          }
          else {
            tday = $('.endSelection').children('.days-btn')[0].textContent;
          }
          objTextMonthStartDate = $(obj).closest('.month-box').children()[0].textContent;
          objTextMonthEndDate = $('.endSelection').closest('.month-box').children()[0].textContent;
        }


        if (objTextMonthEndDate && objTextMonthEndDate.length > 0 && objTextMonthStartDate && objTextMonthStartDate.length > 0) {
          monthstartdate = objTextMonthStartDate.split('/')[0];
          yearstartdate = objTextMonthStartDate.split('/')[1];
          monthenddate = objTextMonthEndDate.split('/')[0];
          yearenddate = objTextMonthEndDate.split('/')[1];
          var fromdate = this.gf.getCinIsoDate(new Date(yearstartdate, monthstartdate - 1, fday));
          var todate = this.gf.getCinIsoDate(new Date(yearenddate, monthenddate - 1, tday));
          if (fromdate && todate && moment(todate).diff(fromdate, 'days') > 0) {
            if (moment(todate).diff(fromdate, "days") > 30) {
              this.presentToastwarming('Ngày nhận và trả phòng phải trong vòng 30 ngày');
              return;
            }
            var se = this;
            //Nếu chọn duration = 1 thì tự cộng thêm 1 ngày cho = duration combo
            let _duration = moment(todate).diff(moment(fromdate), 'days');
            if (_duration == 1) {
              se.booking.CheckInDate = moment(fromdate).format('YYYY-MM-DD');
              se.booking.CheckOutDate = (moment(todate).add('days', 1)).format('YYYY-MM-DD');
              se.cin = moment(fromdate).format('DD-MM-YYYY');
              se.cout = (moment(todate).add('days', 1)).format('DD-MM-YYYY');
            } else {
              se.booking.CheckInDate = moment(fromdate).format('YYYY-MM-DD');
              se.booking.CheckOutDate = moment(todate).format('YYYY-MM-DD');
              se.cin = moment(fromdate).format('DD-MM-YYYY');
              se.cout = moment(todate).format('DD-MM-YYYY');
            }
            se.searchhotel.CheckInDate = se.booking.CheckInDate;
            se.searchhotel.CheckOutDate = se.booking.CheckOutDate;
            se.bookCombo.FormParam.CheckInDate = se.booking.CheckInDate;
            se.bookCombo.FormParam.CheckOutDate = se.booking.CheckOutDate;
            se.bookCombo.CheckInDate = se.booking.CheckInDate;
            se.bookCombo.CheckOutDate = se.booking.CheckOutDate;
            se.duration = moment(se.booking.CheckOutDate).diff(moment(se.booking.CheckInDate), 'days');
            se.dur = se.duration;
            se.TotalNight = se.duration;
            //hiện ngày check in out
            var cintemp = new Date(this.gf.getCinIsoDate(se.searchhotel.CheckInDate));
            se.cindisplay = moment(cintemp).format('DD') + ' ' + 'thg' + ' ' + moment(cintemp).format('MM')

            var couttemp = new Date(this.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
            se.coutdisplay = moment(couttemp).format('DD') + ' ' + 'thg' + ' ' + moment(couttemp).format('MM');
            se.cinthudisplay = se.getDayOfWeek(se.searchhotel.CheckInDate);
            se.coutthudisplay = se.getDayOfWeek(se.searchhotel.CheckOutDate);
            se.ischangefly = true;
            se.bookCombo.Luggage = 0;
            se.gf.setCacheSearchHotelInfo({checkInDate: se.searchhotel.CheckInDate, checkOutDate: se.searchhotel.CheckOutDate, adult: se.searchhotel.adult, child: se.searchhotel.child, childAge: se.searchhotel.arrchild, roomNumber: se.searchhotel.roomnumber});
            se.storage.set('hasChangeDate', true);
            se.checkComboAfterChangedate();
            setTimeout(() => {
              se.modalCtrl.dismiss();
            }, 100)
          }
        }
      }
    }
  }

  /**
   * Check ngày cin,cout có thuộc khoảng valid của combo hiện tại hay không
   * @param combodetail object combo
   */
  checkComboDuration(combodetail): Promise<any> {
    var se = this;
    return new Promise((resolve, reject) => {
      if (combodetail && combodetail.endDate) {
        var arr = combodetail.endDate.split('-');
        var newdate = new Date(arr[2], arr[1] - 1, arr[0]);
        var d = moment(newdate).format('YYYY-MM-DD');
        resolve(moment(se.searchhotel.CheckOutDate).diff(moment(d), 'days') > 1 ? false : true);
      } else {
        resolve(true);
      }
    })
  }

  checkComboAfterChangedate() {
    var se = this;
    //se.PriceAvgPlusTAStr = 0;
    se.loadpricedone = false;
    se.loadflightpricedone = false;
    var cb;
    se.loadComboData(cb);
    this.roomPriceSale = this.basepricesale;
    se.checkComboDuration(se.bookCombo.objComboDetail).then((valid) => {
      if (valid) {
        //Valid thì check tiếp BOD
        se.checkBOD(se.bookCombo.objComboDetail.comboDetail.roomId).then((checkbod) => {
          if (checkbod) {
            se.getHotelContractPrice(se.bookCombo.FormParam).then((data) => {
              if (data) {
                se.listDepart=[];
                se.listReturn=[];
                se.loadFlightDataNew(false);
              }
            });
          } else {
            //Không valid thì hiển thị gửi yêu cầu
            se.loadpricedone = true;
            se.loadflightpricedone = true;
            se.PriceAvgPlusTAStr = 0;
            se.TotalPrice = 0;
          }
        })
      } else {
        //Không valid thì hiển thị gửi yêu cầu
        se.loadpricedone = true;
        se.loadflightpricedone = true;
        se.PriceAvgPlusTAStr = 0;
        se.TotalPrice = 0;
      }
    })

  }

  loadComboData(cb) {
    if (this.bookCombo.ComboDetail.details.length == 1) {
      cb = this.bookCombo.ComboDetail.details[0];
      this.bookcombodetail = cb;
    } else {
      this.bookCombo.ComboDetail.details.forEach(element => {
        let df = moment(element.stayFrom).format('YYYY-MM-DD');
        let dt = moment(element.stayTo).format('YYYY-MM-DD');
        if (moment(this.booking.CheckInDate).diff(moment(df), 'days') >= 0 && moment(dt).diff(moment(this.booking.CheckInDate), 'days') >= 0
          && moment(this.booking.CheckOutDate).diff(moment(df), 'days') >= 0 && moment(dt).diff(moment(this.booking.CheckOutDate), 'days') >= 0) {
          cb = element;
          this.bookcombodetail = element;
        }
      });
      if (!cb) {
        cb = this.bookCombo.ComboDetail.details[0];
        this.bookcombodetail = cb;
      }
    }
    this.totalPriceSale = cb.totalPriceSale;
    this.departTicketSale = cb.departTicketSale;
    this.returnTicketSale = cb.returnTicketSale;
    this.basepricesale = cb.totalPriceSale - cb.departTicketSale - cb.returnTicketSale;
  }

  checkBOD(roomid): Promise<any> {
    var se = this;
    return new Promise((resolve, reject) => {
      // var options = {
      //   method: 'GET',
      //   url: 'https://gate.ivivu.com/get-blackout-date',
      //   qs: { hotelId: se.booking.HotelId ? se.booking.HotelId : se.searchhotel.hotelID, roomId: roomid },
      //   headers:
      //   {
      //     'postman-token': '86c67bdc-5fcd-0240-5549-f3ea2b31faf8',
      //     'cache-control': 'no-cache'
      //   }
      // };
      let headers = {
        'postman-token': '86c67bdc-5fcd-0240-5549-f3ea2b31faf8',
        'cache-control': 'no-cache'
      };
      let strUrl = `https://gate.ivivu.com/get-blackout-date?hotelId=${se.booking.HotelId ? se.booking.HotelId : se.searchhotel.hotelID}&roomId=${roomid}`;
        this.gf.RequestApi('GET', strUrl, headers, { }, 'flightComboReview', 'checkBOD').then((data)=>{

        var BOD = data;
        var arrBOD = BOD.BlackOutDates;
        if (arrBOD.length > 0) {
          var checkcintemp = new Date(this.gf.getCinIsoDate(se.booking.CheckInDate));
          var checkdatecout = new Date(this.gf.getCinIsoDate(se.booking.CheckOutDate));
          var checkcin = moment(checkcintemp).format('YYYYMMDD');
          var checkcout = moment(checkdatecout).format('YYYYMMDD');
          for (let i = 0; i < arrBOD.length; i++) {
            var checkBODtemp = new Date(this.gf.getCinIsoDate(arrBOD[i]));
            var checkBOD = moment(checkBODtemp).format('YYYYMMDD');
            if (checkcin <= checkBOD && checkBOD < checkcout) {
              resolve(false);
              break;
            }
          }
        }
        resolve(true);
      })
    })
  }
  buyLuggage() {
    this.next(2);
  }
  ionViewWillEnter() {
    if(this.valueGlobal.backValue != "flightcombopaymentbreakdown" && this.valueGlobal.backValue != "flightcomboupgraderoom" && this.valueGlobal.backValue !="flightcomboinfoluggage"){
      this.point=0;
      this.ischeck = false;
      this.Roomif.point='';
      this.price=0;

      this.textpromotion="iVIVU Voucher | Mobile Gift";
      this.promocode="";
      this.discountpromo=0;
      this.ischeckbtnpromo=false;
      this.ischeckpromo=false;
      this.msg="";
      this.bookCombo.promoCode="";
      this.bookCombo.discountpromo=0;
      this.itemVoucherCombo=null;

      this.strPromoCode = '';
          this.totaldiscountpromo = 0;
          this._voucherService.voucherSelected = [];
          this._voucherService.listPromoCode = "";
          this._voucherService.listObjectPromoCode = [];
          this._voucherService.totalDiscountPromoCode = 0;
          this._voucherService.hotelPromoCode = "";
          this._voucherService.hotelTotalDiscount = 0;
          this._voucherService.vouchers = [];

      this.GetUserInfo();
    }
  }

  closecalendar(){
    this.modalCtrl.dismiss();
  }

  getBOD(roomid)
  {
    var se=this;
    this.ischeckBOD=false;
    let arrBOD= se.valueGlobal.notSuggestDailyCB;
    if (arrBOD && arrBOD.length>0) {
        var checkcintemp = new Date(this.gf.getCinIsoDate(se.cin));
        var checkdatecout = new Date(this.gf.getCinIsoDate(se.cout));
        var checkcin=moment(checkcintemp).format('YYYYMMDD');
        var checkcout=moment(checkdatecout).format('YYYYMMDD');

        let objcheckbod = arrBOD.filter((bod) => { return checkcin<= moment(bod).format('YYYYMMDD') && moment(bod).format('YYYYMMDD') <checkcout });
        if(objcheckbod && objcheckbod.length >0){
          se.ischeckBOD=true;
        }
    }
  }
  nextShuttlebus(){
    this.navCtrl.navigateForward("/shuttlebusnote");
  }

  updateRoomChange(data){
    var se = this;
    if (data) {
          se.zone.run(() => {
            let itemroom = data.itemroom;
            let itemmealtype = data.itemmealtype;
            se.index=data.index;
            se.RoomType=itemroom.RoomType;
            se.roomnumber=itemmealtype.TotalRoom;
            se.statusRoom=itemmealtype.Status;
            if(itemmealtype.Name != null && itemmealtype.Notes.length==0){
              se.breakfast = itemmealtype.Name;
            }
            else if(itemmealtype.Name != null && itemmealtype.Notes.length!=0 && itemmealtype.Notes[0].length == itemmealtype.Name.length)
            {
              se.breakfast = itemmealtype.Notes.join(', ')
              itemmealtype.Name = itemmealtype.Notes.join(', ');
            }
            else if(itemmealtype.Name != null && itemmealtype.Notes.length!=0 && itemmealtype.Notes[0].length != itemmealtype.Name.length)
            {
              se.breakfast = itemmealtype.Name  +", " +itemmealtype.Notes.join(', ');
              itemmealtype.Name = itemmealtype.Name  +", " +itemmealtype.Notes.join(', ');
            }
            se.elementMealtype = itemmealtype;
            se.bookCombo.mealTypeRates = itemmealtype;
            se.bookCombo.MealTypeName=se.breakfast 
            //se.breakfast = itemmealtype.Name;
            se.Roomif.arrroom = [];
            se.Roomif.arrroom.push(itemroom);
            if(itemroom && itemmealtype){
              se.callSummaryPriceAfterUpgradeRoom(itemroom, itemmealtype)
            }
            se.bookCombo.isHBEDBooking = itemmealtype.Supplier == 'HBED' && itemmealtype.HotelRoomHBedReservationRequest;
            se.bookCombo.isAGODABooking = itemmealtype.Supplier == 'AGD' && itemmealtype.HotelCheckDetailTokenAgoda;
            se.checkAllowPaylaterBookXML(itemmealtype);
            //se.bookCombo.roomPenalty = itemmealtype.Penaltys && itemmealtype.Penaltys.length >0 && itemmealtype.Penaltys[0] && !itemmealtype.Penaltys[0].IsPenaltyFree && itemmealtype.Penaltys[0].PenaltyDescription;
          })
        }
  }
  /**
     * Hàm check điều kiện cho phép trả sau với trường hợp book combo có chọn phòng XML(HBED+AGODA)
     * @param mealtyle 
     */
  checkAllowPaylaterBookXML(mealtyle){
    let se = this;
      if(mealtyle && mealtyle.Penaltys && mealtyle.Penaltys.length >0){
        let nd = moment(new Date(this.gf.getCinIsoDate(new Date()))).format('YYYYMMDDHHmm');
        let pd = moment(mealtyle.Penaltys[0].PenaltyDateParse).format('YYYYMMDDHHmm');
        //Trường hợp ngày hiện tại >= hạn penalty => không cho trả sau
        if (parseInt(nd) >= parseInt(pd)) {
            se.bookCombo.roomPenalty = true;
        }else {//ngày hiện tại < hạn penalty => lấy theo biến IsPenaltyFree
          se.bookCombo.roomPenalty = !mealtyle.Penaltys[0].IsPenaltyFree;
        }
      }
  }
  checkVoucherClaimed() {
    if(this.itemVoucherCombo && this.itemVoucherCombo.claimed){
      this._voucherService.vouchers.forEach((element)=>{
        if(element.id == this.itemVoucherCombo.id){
              element.claimed = true;
        }
      });
    }
  }
  resetValue(){
    this.currentDepartFlight = null;
    this.currentReturnFlight = null;
    this.listDepart = [];
    this.listReturn = [];
    this.listDeparture = [];
    this.departfi = [];
    this.returnfi = [];
    this.de_departdatestr = '';
    this.de_departtime = '';
    this.de_departpriceincrease = false;
    this.de_flightpricetitle = '';
    this.de_returnpriceincrease = false;
    this.re_departtime ='';
    this.ar_departdatestr = '';
    this.ar_departtime = '';
    this.ar_departpriceincrease = false;
    this.ar_flightpricetitle ='';
    this.ar_returnpriceincrease = false;
    this.ar_returntime = '';
  }

  buildStringPromoCode(){
  
    if(this._voucherService.voucherSelected && this._voucherService.voucherSelected.length >0){
      this.strPromoCode = this._voucherService.voucherSelected.map(item => item.code).join(', ');
      this.totaldiscountpromo = this._voucherService.voucherSelected.map(item => item.rewardsItem).reduce((total,b)=>{ return total + b.price; }, 0);
      this.ischeckpromo = true;
    }else{
      this.strPromoCode = '';
      this.totaldiscountpromo = 0;
    }
  
    if(this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0){
      this.ischeckpromo = true;
      if(this.strPromoCode){
        this.strPromoCode += ', '+this._voucherService.listPromoCode.join(', ');
      }else{
        this.strPromoCode += this._voucherService.listPromoCode.join(', ');
      }
        
        this.totaldiscountpromo += this._voucherService.totalDiscountPromoCode;
    }

    this._voucherService.comboFlightPromoCode = this.strPromoCode;
    this._voucherService.comboFlightTotalDiscount = this.totaldiscountpromo;
  }
}
