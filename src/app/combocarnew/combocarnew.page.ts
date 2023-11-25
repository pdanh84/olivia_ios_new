import { AdddiscountPage } from './../adddiscount/adddiscount.page';
import { NetworkProvider } from './../network-provider.service';
import { CombocarchangeplacePage } from './../combocarchangeplace/combocarchangeplace.page';
import { ValueGlobal } from './../providers/book-service';
import { RequestCombo1Page } from './../requestcombo1/requestcombo1';
import { CardeparturePage } from './../cardeparture/cardeparture.page';
import { Component, OnInit, NgZone } from '@angular/core';

import { Storage } from '@ionic/storage';
import { C } from './../providers/constants';
import { GlobalFunction, ActivityService } from './../providers/globalfunction';
import { NavController, ActionSheetController, AlertController, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { Bookcombo, Booking, RoomInfo, SearchHotel } from '../providers/book-service';
import * as moment from 'moment';
import { OverlayEventDetail } from '@ionic/core';
import * as $ from 'jquery';

import { SelectDateRangePage } from '../selectdaterange/selectdaterange.page';
import { FlightcomboupgraderoomPage } from '../flightcomboupgraderoom/flightcomboupgraderoom.page';
import { voucherService } from '../providers/voucherService';
@Component({
  selector: 'app-combocarnew',
  templateUrl: './combocarnew.page.html',
  styleUrls: ['./combocarnew.page.scss'],
})
export class CombocarnewPage implements OnInit {
  username: any; public loader: any;
  email: any;
  infant: number;
  Avatar: string;
  Name: string;
  Address: string;
  cin: string;
  cout: string;
  cinshow: any;
  coutshow: any;
  duration: any;
  TotalNight: any;
  dur: string;
  roomnumber: number;
  adults: any;
  totalAdult: any;
  children: any = 0;
  totalChild: any;
  roomtype: any;
  jsonroom;
  room: any;
  nameroom: any;
  breakfast: string;
  titlecombo: string;
  totalInfant: number = 0;
  arrchild: any;
  childrendisplay: any;
  adulsdisplay: any;
  textage = "";
  textagepost = "";
  paxtitle: string = "";
  fromPlace = 'Hồ Chí Minh';
  titlecomboprice: any;
  PriceAvgPlusTAStr: any;
  comboId: any;
  fromId: number;
  toId: number;
  listDepartTransfers: any = [];
  listReturnTransfers: any = [];
  intervalID: NodeJS.Timeout;
  listkeys: any = [];
  departTime: any[];//giờ đón tốt nhất
  returnTime: any[];//giờ trả tốt nhất
  departDateTimeStr: string;
  returnDateTimeStr: string;
  departTimeStrd: string;
  departTimeStrt: string;
  returnTimeStrd: string;
  returnTimeStrt: string;
  departVehicleStr: any;
  returnVehicleStr: any;
  departTicketSale; departTicketSaleshow; loadpricedone = false; pricedepart = 0; pricereturn = 0;
  returnTicketSale; returnTicketSaleshow; checkdiscountdepart; checkdiscountreturn; departObject; returnObject; AdultCombo = 0;
  adultCombo = 2; Commission; totalExtraBedAndGalaDinerListTA
  daydeparttitle; dayreturntitle; current; total; elementMealtype; PriceAvgPlusTA; TravPaxPrices; transferdetailreturn; transferdetaildepart
  totalAdultExtrabed = 0;
  ChildOtherFeeTotal = 0;
  ChildOtherFee = 0;
  AdultOtherFee = 0;
  roomPriceSale = 0;
  PriceDiffUnit = 0;
  adultFlightNumber = 0;
  indexdep = 0;
  indexret = 0;
  JsonSurchargeFee =
    {
      RoomDifferenceFee: 0,
      AdultUnit: 0,
      TransportPriceSale: 0,
      DepartTicketDifferenceFee: 0,
      ReturnTicketDifferenceFee: 0,
      ExtraTicketDifferenceFee: 0,
      AllExtraTicketDifference: {},
      BaggageDepart: 0,
      BaggageReturn: 0,
      SurchargeWeekendFee: 0,
      SurchargeFee: [] as any,
      TotalAll: 0,
      ComboData: {},
      AllExtraPointsFee: {
      }
    };
  point; price; ischeck = false; Pricepoint; Pricepointshow; roomcancel; ischeckpoint = false; roomcboId; pickup_pointsdepartt; pickup_pointsdepartd; addressdepartd; addressdepartt;
  pickup_pointsreturnt; pickup_pointsreturnd; addressreturnd; addressreturnt; id_pickup_pointsreturnd; id_pickup_pointsreturnt; id_pickup_pointsdepartd; id_pickup_pointsdepartt;
  discountpromo; msgwrn; msg; ischecktext = 0; ischeckerror = 0; ischeckbtnpromo = false; ischeckpromo = false; promocode; loadcarspricedone = false;
  pickup_pointsdep = []; drop_off_points_at_arrivedep = []; pickup_pointsret = []; drop_off_points_at_arriveret = []; diff_feedep; diff_feeret
  public isConnected: boolean = true; pointshow; textpromotion = "Nhập mã giảm giá";
  surchargedepd; surchargedept; surchargeretd; surchargerett; surcharge_typedepd; surcharge_typedept; surcharge_typeretd; surcharge_typerett
  TicketDifferenceFeeUnit: any = 0;
  childsTicketFee: any = 0;
  RoomPriceDiffUnit: number;
  myCalendar: any;
  _daysConfig: any[] = [];
  cofdate: number;
  cotdate: number;
  cinthu: string;
  coutthu: string;
  seat_group_english_dep: string;
  seat_group_english_ret: string;
  totalPriceDep: number=0;
  totalPriceRet: number=0;
  priceseatdep;
  priceseatret;
  elementRooom: any;
  roomclass: any;
  index: any;
  RoomType: any;
  column: any;
  statusRoom: any;
  itemVoucherCarCombo: any;
  strPromoCode: string;
  totaldiscountpromo: number;
  constructor(private storage: Storage, private zone: NgZone, public valueGlobal: ValueGlobal,
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    public gf: GlobalFunction,
    public bookCombo: Bookcombo,
    public booking: Booking,
    public Roomif: RoomInfo,
    public searchhotel: SearchHotel, public alertCtrl: AlertController, public networkProvider: NetworkProvider, public modalCtrl: ModalController, public loadingCtrl: LoadingController,
    public activityService: ActivityService,
    private toastCtrl: ToastController,
    public _voucherService: voucherService) {
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
    this.Avatar = Roomif.imgHotel;
    this.Name = booking.HotelName;
    this.Address = Roomif.Address;
    this.cin = moment(this.gf.getCinIsoDate(booking.CheckInDate)).format('YYYY-MM-DD');
    this.cout = moment(this.gf.getCinIsoDate(booking.CheckOutDate)).format('YYYY-MM-DD');
    this.duration = moment(this.cout).diff(moment(this.cin), 'days');
    this.TotalNight = this.duration;
    this.dur = Roomif.dur;
    this.roomnumber = this.searchhotel.roomnumber;
    this.adults = booking.Adults;
    this.totalAdult = booking.Adults;
    this.children = booking.Child;
    this.totalChild = booking.Child;
    this.roomtype = Roomif.roomtype;
    this.jsonroom = {...Roomif.jsonroom};
    this.room = Roomif.arrroom;
    //var chuoicin = moment(this.cin).format('dd-MM-yyyy').split('-');
    //var chuoicout = moment(this.cout).format('dd-MM-yyyy').split('-');
    this.cinshow = moment(this.cin).format('DD-MM-YYYY');
    this.coutshow = moment(this.cout).format('DD-MM-YYYY');
    this.nameroom = this.room[0].ClassName;
    this.breakfast = (this.bookCombo.MealTypeCode == 'CUS' ? 'Ăn 3 bữa' : this.bookCombo.MealTypeName);
    this.titlecombo = this.bookCombo.ComboTitle;
    this.searchhotel.gaComboName = this.bookCombo.ComboTitle;
    this.searchhotel.gaComboId = this.bookCombo.HotelCode || '';
    this.titlecomboprice = this.bookCombo.ComboRoomPrice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    this.totalInfant = this.infant;
    this.totalChild = this.children - this.infant;
    this.arrchild = this.searchhotel.arrchild;
    this.childrendisplay = this.children;
    this.adulsdisplay = this.booking.Adults;
    this.fromPlace = this.bookCombo.ComboDetail.comboDetail.departurePlace;
    //this.PriceAvgPlusTAStr = this.Roomif.objMealType.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    this.comboId = this.bookCombo.ComboDetail.comboDetail.comboId;
    this.roomcboId = this.bookCombo.ComboDetail.comboDetail.roomId;
    this.departTicketSale = this.bookCombo.ComboDetail.comboDetail.departTicketSale;
    this.returnTicketSale = this.bookCombo.ComboDetail.comboDetail.returnTicketSale;
    this.roomPriceSale = this.bookCombo.ComboDetail.comboDetail.roomPriceSale;
    if (this.arrchild) {
      for (let i = 0; i < this.arrchild.length; i++) {
        if (i == this.arrchild.length - 1) {
          this.textage = this.textage + this.arrchild[i].numage;
          this.textagepost = this.textagepost + this.arrchild[i].numage;
        } else {
          this.textage = this.textage + this.arrchild[i].numage + ",";
          this.textagepost = this.textagepost + this.arrchild[i].numage + ",";
        }
        //PDANH 10/06/2019: Check tuổi trẻ em >=4 tuổi tính giá vé = người lớn
        if (this.arrchild[i].numage >= 4) {
          // this.children--;
          // this.totalChild--;
          // this.adults++;
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
    var se = this;
    // se.getTransferData(true);
    // se.getTransferData(false);
    if (this.networkProvider.isOnline()) {
      this.isConnected = true;
      this.getHotelContractPrice(this.bookCombo.FormParam);
    } else {
      this.isConnected = false;
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
    }
    this.loadLunar();
    this.gf.logEventFirebase('',this.searchhotel, 'combocarnew', 'begin_checkout', 'Combo');
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
    //clear cache sau 15p
    this.intervalID = setInterval(() => {
      if (this.listkeys.length > 0) {
        this.listkeys.forEach(key => {
          this.storage.remove(key);
        });
      }
    }, 60000 * 15);
    this.bookCombo.upgradeRoomChange.pipe().subscribe((dataRoomChange)=>{
      if(dataRoomChange){
          this.updateRoomChange(dataRoomChange);
      }
    })

    this._voucherService.getCarComboObservable().subscribe((itemVoucher)=> {
      if(itemVoucher){
        // if(this.promocode && this.promocode != itemVoucher.code && !this.itemVoucherCarCombo){
        //   this._voucherService.rollbackSelectedVoucher.emit(itemVoucher);
        //   this.gf.showAlertMessageOnly(`Mã voucher ${this.promocode} đang được sử dụng. Quý khách vui lòng kiểm tra lại.`);
        //   return;
        // }
        if(this.promocode && this.promocode != itemVoucher.code && !this.itemVoucherCarCombo){
          this._voucherService.rollbackSelectedVoucher.emit(itemVoucher);
          this.gf.showAlertMessageOnly(`Chỉ hỗ trợ áp dụng nhiều voucher tiền mặt trên một đơn hàng, Coupon và Voucher khuyến mãi chỉ áp dụng một`);
          return;
        }
        this.zone.run(()=>{
        if(itemVoucher.claimed){
          this._voucherService.selectVoucher = itemVoucher;
          this.itemVoucherCarCombo = itemVoucher;
          this.promocode = itemVoucher.code;
          this.discountpromo = itemVoucher.rewardsItem.price;
          this.bookCombo.promoCode = itemVoucher.code;
          this.bookCombo.discountpromo = this.discountpromo;
          this.ischeckbtnpromo = true;
          this.ischeckpromo = true;
          this.buildStringPromoCode();
        }
        else{
          this._voucherService.selectVoucher = null;
          this.itemVoucherCarCombo = null;
          this.promocode = "";
          this.discountpromo = 0;
          this.bookCombo.promoCode = "";
          this.bookCombo.discountpromo = 0;
          this.ischeckbtnpromo = false;
          this.ischeckpromo = false;
          this.buildStringPromoCode();
          if(this._voucherService.selectVoucher && this._voucherService.selectVoucher.length ==0 && this._voucherService.listPromoCode && this._voucherService.listPromoCode.length ==0){
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
        this._voucherService.selectVoucher = null;
          this.itemVoucherCarCombo = null;
          this.promocode = "";
          this.discountpromo = 0;
          this.bookCombo.promoCode = "";
          this.bookCombo.discountpromo = 0;
          this.ischeckbtnpromo = false;
          this.ischeckpromo = false;

          this.strPromoCode = '';
          this.totaldiscountpromo = 0;
          this._voucherService.selectVoucher = [];
          this._voucherService.listPromoCode = "";
          this._voucherService.listObjectPromoCode = [];
          this._voucherService.totalDiscountPromoCode = 0;
          this._voucherService.comboCarPromoCode = "";
          this._voucherService.comboCarTotalDiscount = 0;
      }
    })
  }
  updateRoomChange(data){
    var se = this;
    if (data) {
          se.zone.run(() => {
            let itemroom = data.itemroom;
            let itemmealtype = data.itemmealtype;
            se.index=data.index;
            se.RoomType=itemroom.RoomType;
            se.Roomif.payment = itemmealtype.Status;
            se.bookCombo.ComboDetail.comboDetail.roomId=itemroom.Rooms[0].RoomID;
            se.bookCombo.mealTypeRates = itemmealtype;
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
            se.bookCombo.MealTypeName=se.breakfast ;
            se.statusRoom=itemmealtype.Status;
            se.elementRooom= itemmealtype;
            
            //se.breakfast = itemmealtype.Name;
            se.Roomif.arrroom = [];
            se.Roomif.arrroom.push(itemroom);
            if(itemroom && itemmealtype){
              se.callSummaryPriceAfterUpgradeRoom(itemroom, itemmealtype)
            }
            se.bookCombo.isHBEDBooking = itemmealtype.Supplier == 'HBED' && itemmealtype.HotelRoomHBedReservationRequest;
            se.bookCombo.isAGODABooking = itemmealtype.Supplier == 'AGD' && itemmealtype.HotelCheckDetailTokenAgoda;
          })
        }
  }
  callSummaryPriceAfterUpgradeRoom(itemroom, itemmealtype) {
    var se = this;
    if (itemroom && !itemroom.MSGCode) {
      // Giá nhà cung cấp
      se.TravPaxPrices = itemmealtype.PriceAvgPlusNet * se.roomnumber * se.TotalNight;

      se.roomclass = itemroom;
      se.nameroom = itemroom.ClassName;
      se.elementMealtype = itemmealtype;

      se.AdultCombo = itemroom.Rooms[0].IncludeAdults * se.elementMealtype.TotalRoom;
      se.AdultCombo = se.AdultCombo > se.totalAdult ? se.totalAdult : se.AdultCombo;

      se.totalAdultExtrabed = se.totalAdult - se.AdultCombo;
      se.total = se.total - se.PriceAvgPlusTA;
      se.PriceAvgPlusTA = itemroom.MealTypeRates[se.index].PriceAvgPlusTotalTA;
      se.total= se.total + se.PriceAvgPlusTA;
      se.PriceAvgPlusTAStr = se.total;
      se.PriceAvgPlusTAStr = se.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }
  }
  getHotelContractPrice(data) {
    var se = this;
    if (data) {
      data.CheckInDate = moment(data.CheckInDate).format('YYYY-MM-DD');
      data.CheckOutDate = moment(data.CheckOutDate).format('YYYY-MM-DD');
      data.IsPackageRateInternal = true;
      data.IsPackageRate = true;
      data.IsB2B= true;
      data.IsSeri= true;
      data.IsAgoda= true;
      data.GetOTAPackage = 1;
      data.IsOccWithBed = false;
      // data += '&IsPackageRateInternal=true&IsPackageRate=true';
      let body = se.gf.getFormData(data);
      let strUrl = C.urls.baseUrl.urlContracting + '/api/contracting/HotelSearchReqContractAppV2';
      let headers =  {'content-type' : 'application/x-www-form-urlencoded', accept: '*/*'};
       se.gf.RequestApi('POST', strUrl, headers, body, 'combocarnew', 'getHotelContractPrice').then((data) => {
        se.zone.run(() => {
          var result = data;

          if (result.Hotels) {
            se.jsonroom = result.Hotels[0].RoomClasses;
         
            var element = se.checkElement(se.jsonroom);
            if (element) {
              se.elementRooom = element;
              se.nameroom = element.ClassName;
              se.bookCombo.ComboDetail.comboDetail.roomId=element.MealTypeRates[0].RoomId;
              se.PriceAvgPlusTA = element.MealTypeRates[0].PriceAvgPlusTotalTA;
              se.elementMealtype = element.MealTypeRates[0];
              se.roomnumber =se.elementMealtype.TotalRoom;
              se.TravPaxPrices = element.MealTypeRates[0].PriceAvgPlusNet * se.roomnumber * se.TotalNight;
              se.AdultCombo = element.Rooms[0].IncludeAdults * se.elementMealtype.TotalRoom;
              se.AdultCombo = se.AdultCombo > se.totalAdult ? se.totalAdult : se.AdultCombo;
              se.statusRoom=element.MealTypeRates[0].Status;
              se.bookCombo.mealTypeRates = se.elementMealtype;
              se.calculateDiffPriceUnit();
              se.getTransferData(true);
              se.bookCombo.isHBEDBooking = element.Supplier == 'HBED' && element.HotelRoomHBedReservationRequest;
              se.bookCombo.isAGODABooking = element.Supplier == 'AGD' && element.HotelCheckDetailTokenAgoda;
            } else {
              se.jsonroom = result.Hotels[0].RoomClassesRecomments;
              var element = se.checkElement(se.jsonroom);
              if (element) {
                se.elementRooom = element;
                se.nameroom = element.ClassName;
                se.bookCombo.ComboDetail.comboDetail.roomId=element.MealTypeRates[0].RoomId;
                se.PriceAvgPlusTA = element.MealTypeRates[0].PriceAvgPlusTotalTA;
                se.elementMealtype = element.MealTypeRates[0];
                se.roomnumber =se.elementMealtype.TotalRoom;
                se.TravPaxPrices = element.MealTypeRates[0].PriceAvgPlusNet * se.roomnumber * se.TotalNight;
                se.AdultCombo = element.Rooms[0].IncludeAdults * se.elementMealtype.TotalRoom;
                se.AdultCombo = se.AdultCombo > se.totalAdult ? se.totalAdult : se.AdultCombo;
                se.statusRoom=element.MealTypeRates[0].Status;
                se.bookCombo.mealTypeRates = se.elementMealtype;
                se.calculateDiffPriceUnit();
                se.getTransferData(true);
                se.bookCombo.isHBEDBooking = element.Supplier == 'HBED' && element.HotelRoomHBedReservationRequest;
                se.bookCombo.isAGODABooking = element.Supplier == 'AGD' && element.HotelCheckDetailTokenAgoda;
              }else{
                se.departDateTimeStr = "không có vé";
                se.msgwrn = "Hiện tại không có phòng thoả điều kiện của quy khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
                se.loadpricedone = true
              }
           
            }
          }
          else {
            se.departDateTimeStr = "không có vé";
            se.msgwrn = "Hiện tại không có phòng thoả điều kiện của quy khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
            se.loadpricedone = true;
          }
        })
      })
    }
  }
  checkElement(object) {
    var el: any = null;
    var se = this;
    object.forEach(element => {
      if (element && element.MealTypeRates[0].RoomId == this.roomcboId && !element.MSGCode) {
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
  goback() {
    this._voucherService.rollbackSelectedVoucher.emit(this._voucherService.selectVoucher);
    this._voucherService.selectVoucher = null;
    this.bookCombo.idpointdepd = '';
    this.bookCombo.idpointdept = '';
    this.bookCombo.idpointretd = '';
    this.bookCombo.idpointrett = '';
    this.valueGlobal.backValue = 'carcombo';
    if(moment(this.booking.CheckOutDate).format('DD-MM-YYYY') != moment(this.searchhotel.CheckOutDate).format('DD-MM-YYYY') || moment(this.booking.CheckInDate).format('DD-MM-YYYY') != moment(this.searchhotel.CheckInDate).format('DD-MM-YYYY'))
    {
      this.searchhotel.CheckInDate = this.booking.CheckInDate;
      this.searchhotel.CheckOutDate = this.booking.CheckOutDate;
      this.valueGlobal.notRefreshDetail = false;
    }
    this.navCtrl.navigateBack('/hoteldetail/' + this.booking.HotelId);
  }


  loadTransferInfo(departTransfer, returnTransfer, indexdep, indexret) {
    var se = this;
    //bind thông tin chiều đi
    if (departTransfer && departTransfer.length > 0 && indexdep<departTransfer.length) {
      this.departObject = departTransfer[indexdep];
      let de_date = this.departObject.route.departure_date;
      se.departDateTimeStr = 'Đi ' + se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD-MM-YYYY');
      se.departVehicleStr = this.departObject.company.name;
      this.departTicketSaleshow = this.departObject.route.schedules[0].fare.price - this.departTicketSale;
      this.pricedepart = this.departObject.route.schedules[0].fare.price;
      se.daydeparttitle = se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD-MM-YYYY');
      if (this.departTicketSaleshow <= 0) {
        this.checkdiscountdepart = true;
        this.departTicketSaleshow = Math.abs(this.departTicketSaleshow);
      }
      else {
        this.checkdiscountdepart = false;
      }
      this.departTicketSaleshow = this.departTicketSaleshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }
    //bind thông tin chiều về
    if (returnTransfer && returnTransfer.length > 0  && indexret<returnTransfer.length) {
      this.returnObject = returnTransfer[indexret];
      let re_date = this.returnObject.route.departure_date;
      se.returnDateTimeStr = 'Về ' + se.getDayOfWeek(re_date) + ', ' + moment(re_date).format('DD-MM-YYYY');
      se.returnVehicleStr = this.returnObject.company.name;
      this.returnTicketSaleshow = this.returnObject.route.schedules[0].fare.price - this.returnTicketSale;
      se.dayreturntitle = se.getDayOfWeek(re_date) + ', ' + moment(re_date).format('DD-MM-YYYY');
      this.pricereturn = this.returnObject.route.schedules[0].fare.price;
      if (this.returnTicketSaleshow <= 0) {
        this.checkdiscountreturn = true;
        this.returnTicketSaleshow = Math.abs(this.returnTicketSaleshow);
      }
      else {
        this.checkdiscountreturn = false;
      }
      this.returnTicketSaleshow = this.returnTicketSaleshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      this.PriceAvgPlusTAStr = 0;
    }
    this.postcardetaildepart(0);
  }
  // Hàm kiểm tra điểm
  funccheckpoint() {
    var se = this;
    if (se.point > 0) {
      se.Pricepoint = this.total - se.point;
      se.Pricepointshow = se.Pricepoint.toLocaleString();
      if (se.Pricepoint <= 0) {
        se.ischeckpoint = true;
        se.Pricepointshow = 0;
      }
      else {
        se.ischeckpoint = false;
      }
    }
    if (se.ischeckbtnpromo) {
      var total = se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '');
      if (se.ischeck) {
        total = se.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
      }
      se.Pricepointshow = total - se.discountpromo;
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
    se.loadcarspricedone = true;
    se.checkVoucherClaimed();
  }
  async getTransferData(isDepart) {
    var se = this;

    if (se.comboId) {
      if (isDepart) {
        se.fromId = se.bookCombo.ComboDetail.comboDetail.departureCode;
        se.toId = se.bookCombo.ComboDetail.arrivalCode;
        //Lấy danh sách chuyến xe chiều đi
        var url = C.urls.baseUrl.urlMobile + '/get-transfer-data?cid=' + se.comboId + '&from=' + se.fromId + '&to=' + se.toId + '&date=' + se.cin + '&an=' + se.adults + '&cn=' + se.children + '&cas=' + se.textagepost;
        se.gf.RequestApi('GET', url, {}, {}, 'carcombo', 'get-transfer-data').then((data: any) => {
          if (data.data.length > 0) {
            var listDeparttemp = data.data;
            se.listDepartTransfers=[];
            for (let i = 0; i < listDeparttemp.length; i++) {
              if (listDeparttemp[i].route.schedules[0].available_seats >= se.totalAdult) {
                listDeparttemp[i].priceorder=listDeparttemp[i].route.schedules[0].fare.price;
                listDeparttemp[i].sortByTime=listDeparttemp[i].route.pickup_time;
                se.listDepartTransfers.push(listDeparttemp[i]);
              }
            }
            // se.storage.set('listDepartTransfers_' + se.comboId + '_' + se.cin + '_' + se.adults + '_' + se.children + '_' + se.textagepost, data);
            this.sort("sortByTimeDepartEarly",1);
            this.sort("priceup",1);
            se.getBestTransfer(1);
            
            se.getTransferData(false);
            
          }
          else {
            se.loadpricedone = true;
            se.departDateTimeStr = "không có vé";
            se.PriceAvgPlusTAStr = 0;
            se.msgwrn = "Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
          }

        });
      } else {
        se.fromId = se.bookCombo.ComboDetail.comboDetail.departureCode;
        se.toId = se.bookCombo.ComboDetail.arrivalCode;

        //Lấy danh sách chuyến xe chiều về
        var url = C.urls.baseUrl.urlMobile + '/get-transfer-data?cid=' + se.comboId + '&from=' + se.toId + '&to=' + se.fromId + '&date=' + se.cout + '&an=' + se.adults + '&cn=' + se.children + '&cas=' + se.textagepost;
        se.gf.RequestApi('GET', url, {}, {}, 'carcombo', 'get-transfer-data').then((data: any) => {
          if (data.data.length > 0) {
            var listReturntemp = data.data;
            se.listReturnTransfers=[];
            for (let i = 0; i < listReturntemp.length; i++) {
              if (listReturntemp[i].route.schedules[0].available_seats >= se.totalAdult) {
                listReturntemp[i].priceorder=listReturntemp[i].route.schedules[0].fare.price;
                listReturntemp[i].sortByTime=listReturntemp[i].route.pickup_time;
                se.listReturnTransfers.push(listReturntemp[i]);
              }
            }
            this.sort("sortByTimeDepartEarly",0);
            this.sort("priceup",0);
            se.getBestTransfer(0);
            this.loadTransferInfo(this.departTime, this.returnTime, 0, 0);
          }
          else {
            se.loadpricedone = true;
            se.departDateTimeStr = "không có vé";
            se.PriceAvgPlusTAStr = 0;
            se.msgwrn = "Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
          }
        });
      }

    }
  }

  /**
   * Hàm check transfer giá tốt nhất trong khung giờ chấp nhận được
   * @param list - Danh sách chuyến xe
   * @param isDepart - biến xác định chiều đi/về (=1 là chiều đi/ =0 là chiều về)
   */
   getBestTransfer(isDepart) {
    // var Hour; var Minute; var kq;
    // var good = [];
    var home:any = [];
    var away:any = [];
    var other:any = [];
    var list;
    if(isDepart==1){
      list=this.listDepartTransfers;
    }else{
      list=this.listReturnTransfers;
    }
    for (let i = 0; i < list.length; i++) {
      var Hour; var Minute; var kq;
      var time = list[i].route.pickup_time;
      Hour = time.toString().split(':')[0];
      Minute = time.toString().split(':')[1];
      kq = Hour * 60 + Number(Minute);
      if (isDepart == 1) {
        if (kq >= 480 && kq <= 840) {
          if (list[i].sort_order != 999) {
            home.push(list[i]);
          }
          else {
            away.push(list[i]);
          }
        }
        other.push(list[i]);
      }
      else {
        if (kq >= 600 && kq <= 1080) {
          if (list[i].sort_order != 999) {
            home.push(list[i]);
          }
          else {
            away.push(list[i]);
          }
        }
        other.push(list[i]);
      }
    }
    if (isDepart == 1) {
      if (home.length > 0) {
        this.departTime = home;
      } else if (away.length > 0) {
        this.departTime = away;
      }
      else if (other.length > 0) {
        this.departTime = other;
      }
    } else {
      if (home.length > 0) {
        this.returnTime = home;
      } else if (away.length > 0) {
        this.returnTime = away;
      }
      else if (other.length > 0) {
        this.returnTime = other;
      }
    }
    //this.loadTransferInfo(this.departTime, this.returnTime);
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
  continueBook() {
    var self = this;
    if (this.point > 0) {
      if (this.ischeck) {
        this.Roomif.ischeckpoint = this.ischeck;
      }
      else {
        this.Roomif.ischeckpoint = this.ischeck;
        this.Roomif.point = '';
      }
    }

    self.bookCombo.departObjectCar = self.departObject;
    self.bookCombo.returnObjectCar = self.returnObject;
    self.Commission = (self.elementMealtype.PriceAvgPlusOTA * self.roomnumber * self.TotalNight) - (self.elementMealtype.PriceAvgPlusNet * self.roomnumber * self.TotalNight);
    // JsonSurchargeFee.RoomDifferenceFee=self.bookCombo.ComboRoomPrice-self.jsonroom[0].MealTypeRates[0].PriceAvgDefaultTA/2;
    self.MathGaladinnerAdExtrabed();
    self.JsonSurchargeFee.DepartTicketDifferenceFee = (self.departTicketSale - self.pricedepart) * (-1) * self.totalAdult;
    self.JsonSurchargeFee.ReturnTicketDifferenceFee = (self.returnTicketSale - self.pricereturn) * (-1) * self.totalAdult;
    self.JsonSurchargeFee.TotalAll = self.total;
    self.JsonSurchargeFee.ComboData = {
      ComboId: self.bookCombo.ComboId,
      MealTypeCode: self.bookCombo.MealTypeCode,
      AdultCombo: self.adultCombo
    }
    // JsonSurchargeFee.AdultUnit=self.AdultUnit;
    var pointprice = 0;
    var total = self.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '');
    self.bookCombo.totalPriceBeforeApplyVoucher = total;
    if (self.ischeck) {
      pointprice = self.point;
      if (self.ischeckpoint) {
        pointprice = self.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '');
      }
      total = self.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
    }
    if (self.ischeckbtnpromo) {
      //total = self.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
      self.bookCombo.ischeckbtnpromo = true;
      self.bookCombo.discountpromo = self.totaldiscountpromo;
      self.Roomif.promocode = "";
      //pdanh 18-07-2023: fix tổng tiền thanh toán case vctm
      if(self.strPromoCode && self.totaldiscountpromo){
        self.bookCombo.totalprice = total - self.totaldiscountpromo;
      }else{
        self.bookCombo.totalprice = total;
      }
    }
    else {
      self.bookCombo.ischeckbtnpromo = false;
      self.bookCombo.discountpromo = 0;
      self.promocode = "";
      self.Roomif.promocode = self.promocode;
      //pdanh 18-07-2023: fix tổng tiền thanh toán case vctm
      if(self.strPromoCode && self.totaldiscountpromo){
        self.bookCombo.totalprice = total - self.totaldiscountpromo;
      }else{
        self.bookCombo.totalprice = total;
      }
      
    }

    var departPickup = {
      "Name": self.pickup_pointsdepartd,
      "Fee": self.surchargedepd * this.totalAdult,
      "Type": self.surcharge_typedepd,
    }
    var departDropoff = {
      "Name": self.pickup_pointsdepartt,
      "Fee": self.surchargedept * this.totalAdult,
      "Type": self.surcharge_typedept,
    }
    var returnPickup = {
      "Name": self.pickup_pointsreturnd,
      "Fee": self.surchargeretd * this.totalAdult,
      "Type": self.surcharge_typeretd,
    }
    var returnDropoff = {
      "Name": self.pickup_pointsreturnt,
      "Fee": self.surchargerett * this.totalAdult,
      "Type": self.surcharge_typerett,
    }
    var objtest: any = {};
    if (self.surchargedepd > 0) {
      objtest.departPickup = departPickup;
    }
    if (self.surchargedept > 0) {
      objtest.departDropoff = departDropoff;
    }
    if (self.surchargeretd > 0) {
      objtest.returnPickup = returnPickup;
    }
    if (self.surchargerett > 0) {
      objtest.returnDropoff = returnDropoff;
    }
    self.JsonSurchargeFee.AllExtraPointsFee = objtest;
    self.storage.get('jti').then(jti => {
      if (jti) {

    //tính giá
    var priceseatdep = 1000000;
    var priceseatret = 1000000;
    let totalseatsdep = self.totalAdult;
    let totalseatsret = self.totalAdult;
    if (self.seat_group_english_dep == 'DOUBLE') {
      var numberseat = Math.round(self.totalAdult / 2);
      var diff_feedep = self.diff_feedep / self.totalAdult;
      priceseatdep = (diff_feedep + self.pricedepart) * numberseat;
      totalseatsdep = numberseat;
    }
    else {
      priceseatdep = (self.pricedepart * self.totalAdult) + self.diff_feedep;
    }
    if (self.seat_group_english_ret == 'DOUBLE') {
      var numberseat = Math.round(self.totalAdult / 2);
      var diff_feeret = self.diff_feeret / self.totalAdult;
      priceseatret = (diff_feeret + self.pricereturn) * numberseat;
      totalseatsret = numberseat;
    } 
    else {
      priceseatret = (self.pricereturn * self.totalAdult) + self.diff_feeret;
    }
    self.totalPriceDep = priceseatdep + (self.surchargedepd + self.surchargedept) * self.totalAdult;
    self.totalPriceRet = priceseatret + (self.surchargeretd + self.surchargerett) * self.totalAdult;

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

        var objectCar = {
          TransferBooking: {
            fromPlaceCode: self.bookCombo.ComboDetail.comboDetail.departureCode,
            toPlaceCode: self.bookCombo.ComboDetail.arrivalCode,
            fromPlaceName: self.bookCombo.ComboDetail.comboDetail.departurePlace,
            toPlaceName: self.bookCombo.ComboDetail.arrivalName,
            adult: self.adults,
            child: self.children,
            infant: self.totalInfant,
            departTransfer: {
              CompanyCode: self.departObject.company.id,
              CompanyName: self.departObject.company.name,
              TransferNumber: self.departObject.route.schedules[0].trip_code,
              VehicleType: self.departObject.route.schedules[0].vehicle_type,
              RouteNumber: self.departObject.route.id,
              PickupPlaceCode: self.id_pickup_pointsdepartd,
              PickupPlaceName: self.pickup_pointsdepartd,
              DropoffPlaceCode: self.id_pickup_pointsdepartt,
              DropoffPlaceName: self.pickup_pointsdepartt,
              DepartDate: self.departObject.route.pickup_date,
              DepartTime: self.departTimeStrd,
              ArrivalDate: self.departObject.route.arrival_date,
              ArrivalTime: self.departTimeStrt,
              Duration: self.departObject.route.duration,
              FareOrigins: self.departObject.route.schedules[0].fare.price,
              FareNet: self.departObject.route.schedules[0].fare.price,
              //TotalPrice: (self.pricedepart * self.totalAdult) + self.diff_feedep + (self.surchargedepd + self.surchargedept) * self.totalAdult,
              TotalPrice: self.totalPriceDep,
              CancelPolicy: self.transferdetaildepart.data.policyData.join('\r\n')
            },
            returnTransfer: {
              CompanyCode: self.returnObject.company.id,
              CompanyName: self.returnObject.company.name,
              TransferNumber: self.returnObject.route.schedules[0].trip_code,
              VehicleType: self.returnObject.route.schedules[0].vehicle_type,
              RouteNumber: self.returnObject.route.id,
              PickupPlaceCode: self.id_pickup_pointsreturnd,
              PickupPlaceName: self.pickup_pointsreturnd,
              DropoffPlaceCode: self.id_pickup_pointsreturnt,
              DropoffPlaceName: self.pickup_pointsreturnt,
              DepartDate: self.returnObject.route.pickup_date,
              DepartTime: self.returnTimeStrd,
              ArrivalDate: self.returnObject.route.arrival_date,
              ArrivalTime: self.returnTimeStrt,
              Duration: self.returnObject.route.duration,
              FareOrigins: self.returnObject.route.schedules[0].fare.price,
              FareNet: self.returnObject.route.schedules[0].fare.price,
              //TotalPrice: (self.pricereturn * self.totalAdult) + self.diff_feeret + (self.surchargeretd + self.surchargerett) * self.totalAdult,
              TotalPrice: self.totalPriceRet,
              CancelPolicy: self.transferdetailreturn.data.policyData.join('\r\n')
            },
            passengerInfo: {
              FirstName: "",
              LastName: "",
              Email: "",
              MobileNumber: ""
            }
          },
          HotelBooking: {
            NoteForSupp:self.elementMealtype.NoteForSupplier,
            HotelId: self.booking.HotelId.toString(),
            CheckIn: moment(self.booking.CheckInDate).format('YYYY-MM-DD'),
            CheckOut: moment(self.booking.CheckOutDate).format('YYYY-MM-DD'),
            TotalRoom: self.roomnumber,
            TotalPrices: total,
            RoomStatus: self.elementMealtype.Status,
            BreakfastInclude: self.bookCombo.MealTypeCode,
            BreakfastIncludeName: self.bookCombo.MealTypeName,
            PaymentMethod: "2",
            CName: self.username,
            CEmail: self.email,
            CAddress: "",
            CPhone: "",
            CTitle: "Mr",
            LeadingName: "",
            LeadingEmail: "",
            LeadingPhone: "",
            LeadingNationality: "",
            IsInvoice: 0,
            Note: "",
            BookingStatus: "0",
            Adult: self.adults,
            AdultCombo: self.adultCombo,
            Child: self.children,
            TravPaxPrices: self.TravPaxPrices,
            Office: "",
            FromPlaceCode: self.bookCombo.ComboDetail.departureCode,
            RoomName: self.elementMealtype.RoomName,
            RoomPrices: self.elementMealtype.PriceAvgPlusTA,
            RoomId: self.elementMealtype.RoomId,
            MealTypeNote: (self.elementMealtype.PromotionInclusions.length > 0 ? self.elementMealtype.PromotionInclusions.join(' \r\n') : "") + (self.elementMealtype.Notes != null && self.elementMealtype.Notes.length > 0 ? self.elementMealtype.Notes.join('\r\n,') : ""),
            PromotionNote: self.elementMealtype.PromotionNote,
            PersonIncharge: "",
            DiscountAmount: "0",
            SupplierRef: null,
            ChildAges: self.booking.ChildAge,
            PenaltyDescription: null,
            CompName: "",
            CompAddress: "",
            CompTaxCode: "",
            CompanyContactEmail:"",
            CompanyContactName:"",
            JsonSurchargeFee: JSON.stringify(self.JsonSurchargeFee),
            Commission: self.Commission,
            Source: '6',
            Supplier: (self.elementMealtype.IsHoliday ? "Holiday" : (self.elementMealtype.IsVoucher ? "Voucher" : self.elementMealtype.Supplier)),
            MemberId: jti,
            UsePointPrice: pointprice,
            //promotionCode: self.promocode,
            vouchers : !checkpromocode ? [...voucherSelectedMap,...promoSelectedMap] : arrpromocode,
            SupplierName: self.elementMealtype.Supplier,
            HotelCheckDetailTokenVinHms: self.elementMealtype.HotelCheckDetailTokenVinHms ? self.elementMealtype.HotelCheckDetailTokenVinHms : "",
            HotelCheckPriceTokenSMD: self.elementMealtype.HotelCheckPriceTokenSMD  ? self.elementMealtype.HotelCheckPriceTokenSMD  : "",
            HotelCheckDetailTokenInternal: self.elementMealtype.Supplier == 'SERI' && self.elementMealtype.HotelCheckDetailTokenInternal ? self.elementMealtype.HotelCheckDetailTokenInternal : "",
            HotelRoomHBedReservationRequest: this.elementMealtype.Supplier == 'HBED' && this.elementMealtype.HotelRoomHBedReservationRequest ? JSON.stringify(this.elementMealtype.HotelRoomHBedReservationRequest) : "",
            ReqHBED: this.elementRooom && this.elementRooom.ReqHBED? JSON.stringify(this.elementRooom.ReqHBED) : '',
            HotelCheckDetailTokenAgoda: this.elementMealtype.Supplier == 'AGD' && this.elementMealtype.HotelCheckDetailTokenAgoda ? this.elementMealtype.HotelCheckDetailTokenAgoda : '',
          },
        }
        self.bookCombo.totalAdult = self.totalAdult;
        self.bookCombo.pricedep = priceseatdep;
        self.bookCombo.priceret = priceseatret;
        self.bookCombo.totalseatsdep = totalseatsdep;
        self.bookCombo.totalseatsret = totalseatsret;
        self.gf.setParams(objectCar, 'carscombo');
        if(self.elementMealtype.Supplier=='Internal'){
          self.checkAllotment();
        }else{
          self.Roomif.payment = "RQ";
          self.Roomif.ischeckpayment = false;
        }
        
        self.navCtrl.navigateForward("comboadddetails");
      }
    })
  }
  next() {
    if(this.elementMealtype.Supplier == 'SERI' && this.elementMealtype.HotelCheckDetailTokenInternal){
      //Check allotment trước khi book
      this.gf.checkAllotmentSeri(
        this.booking.HotelId,
        this.elementMealtype.RoomId,
        this.booking.CheckInDate,
        this.booking.CheckOutDate,
        this.roomnumber,
        'SERI', this.elementMealtype.HotelCheckDetailTokenInternal
        ).then((allow)=> {
          if(allow){
            this.continueBook();
          }else{
            this.gf.showToastWarning('Hiện tại khách sạn đã hết phòng loại này.');
          }
        })
    }else{
      this.continueBook();
    }
    
  }
  postcardetaildepartload(value) {
    var self = this;
    let strUrl = C.urls.baseUrl.urlMobile + '/get-transfer-detail?trip_code='+this.departObject.route.schedules[0].trip_code;
      let headers =  {
        Connection: 'keep-alive',
        'Accept-Encoding': 'gzip, deflate',
        Host: C.urls.baseUrl.urlMobile,
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent': 'PostmanRuntime/7.17.1'
      };
      self.gf.RequestApi('GET', strUrl, headers, {}, 'combocarnew', 'postcardetaildepartload').then((data) => {
      self.transferdetaildepart = data;
      self.zone.run(() => {
        //thời gian đón đưa
        if (self.transferdetaildepart.data.pickup_points.length > 0) {
          self.departTimeStrd = self.transferdetaildepart.data.pickup_points[0].pickup_time;
          self.pickup_pointsdepartd = self.transferdetaildepart.data.pickup_points[0].name;
          self.id_pickup_pointsdepartd = self.transferdetaildepart.data.pickup_points[0].id;
          self.addressdepartd = self.transferdetaildepart.data.pickup_points[0].address;
          self.pickup_pointsdep = self.transferdetaildepart.data.pickup_points;
          //phụ thu điểm đón
          self.surchargedepd = self.transferdetaildepart.data.pickup_points[0].surcharge;
          self.surcharge_typedepd = self.transferdetaildepart.data.pickup_points[0].surcharge_type;
        }
        else {
          self.loadpricedone = true;
          self.departDateTimeStr = "không có vé";
          self.PriceAvgPlusTAStr = 0;
          self.msgwrn = "Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
          return;
        }
        if (self.transferdetaildepart.data.drop_off_points_at_arrive.length > 0) {
          self.departTimeStrt = self.transferdetaildepart.data.drop_off_points_at_arrive[0].dropoff_time;
          self.id_pickup_pointsdepartt = self.transferdetaildepart.data.drop_off_points_at_arrive[0].id;
          self.pickup_pointsdepartt = self.transferdetaildepart.data.drop_off_points_at_arrive[0].name;
          self.addressdepartt = self.transferdetaildepart.data.drop_off_points_at_arrive[0].address;
          self.drop_off_points_at_arrivedep = self.transferdetaildepart.data.drop_off_points_at_arrive;
          self.surchargedept = self.transferdetaildepart.data.drop_off_points_at_arrive[0].surcharge;
          self.surcharge_typedept = self.transferdetaildepart.data.drop_off_points_at_arrive[0].surcharge_type;
        }
        else {
          self.loadpricedone = true;
          self.departDateTimeStr = "không có vé";
          self.PriceAvgPlusTAStr = 0;
          self.msgwrn = "Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
          return;
        }
        //điểm đón trung chuyển
        self.bookCombo.arrplacedeptcd = [];
        self.bookCombo.arrplacedeptct = [];
        self.bookCombo.arrplacedepd = [];
        self.bookCombo.arrplacedept = [];
        if (self.transferdetaildepart.data.transfer_points.length > 0) {
          self.bookCombo.arrplacedeptcd = self.transferdetaildepart.data.transfer_points;

        }
        //điểm trả trung chuyển
        if (self.transferdetaildepart.data.transfer_points_at_arrive.length > 0) {
          self.bookCombo.arrplacedeptct = self.transferdetaildepart.data.transfer_points_at_arrive;
        }
        self.bookCombo.arrplacedepd = self.pickup_pointsdep;
        self.bookCombo.arrplacedept = self.drop_off_points_at_arrivedep;

        //tính giá
        self.priceseatdep = 1000000;
        self.priceseatret = 1000000;
        if (self.seat_group_english_dep == 'DOUBLE') {
          var numberseat = Math.round(self.totalAdult / 2);
          var diff_feedep = self.diff_feedep / self.totalAdult;
          self.priceseatdep = (diff_feedep + self.pricedepart) * numberseat;
        }
        else {
          self.priceseatdep = (self.pricedepart * self.totalAdult) + self.diff_feedep;
        }
        if (self.seat_group_english_ret == 'DOUBLE') {
          var numberseat = Math.round(self.totalAdult / 2);
          var diff_feeret = self.diff_feeret / self.totalAdult;
          self.priceseatret = (diff_feeret + self.pricereturn) * numberseat;
        } 
        else {
          self.priceseatret = (self.pricereturn * self.totalAdult) + self.diff_feeret;
        }
        self.totalPriceDep = self.priceseatdep + (self.surchargedepd + self.surchargedept) * self.totalAdult;
        self.totalPriceRet = self.priceseatret + (self.surchargeretd + self.surchargerett) * self.totalAdult;
        self.PriceAvgPlusTAStr = self.PriceAvgPlusTA + self.priceseatdep + self.priceseatret + (self.surchargedepd + self.surchargedept + self.surchargeretd + self.surchargerett) * self.totalAdult;
        self.total = self.PriceAvgPlusTAStr;
        self.PriceAvgPlusTAStr = self.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        if (value == 0) {
          self.funccheckpoint();
        } else {
          self.edit();
        }
      })

    });
  }
  postcardetaildepart(value) {
    var self = this;
    let strUrl = C.urls.baseUrl.urlMobile + '/get-transfer-detail?trip_code='+this.departObject.route.schedules[0].trip_code;
      let headers =  {
        Connection: 'keep-alive',
        'Accept-Encoding': 'gzip, deflate',
        Host: C.urls.baseUrl.urlMobile,
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent': 'PostmanRuntime/7.17.1'
      };
      self.gf.RequestApi('GET', strUrl, headers, {}, 'combocarnew', 'postcardetaildepart').then((data) => {
      var transferdetaildep = data;
      self.zone.run(() => {
        //thời gian đón đưa
        if (transferdetaildep.data.total_available_seats >= self.totalAdult) {
          self.transferdetaildepart = data;
          if (self.transferdetaildepart.data.pickup_points.length > 0) {
            self.departTimeStrd = self.transferdetaildepart.data.pickup_points[0].pickup_time;
            self.pickup_pointsdepartd = self.transferdetaildepart.data.pickup_points[0].name;
            self.id_pickup_pointsdepartd = self.transferdetaildepart.data.pickup_points[0].id;
            self.addressdepartd = self.transferdetaildepart.data.pickup_points[0].address;
            self.pickup_pointsdep = self.transferdetaildepart.data.pickup_points;
            //phụ thu điểm đón
            self.surchargedepd = self.transferdetaildepart.data.pickup_points[0].surcharge;
            self.surcharge_typedepd = self.transferdetaildepart.data.pickup_points[0].surcharge_type;
          }
          else {
            self.loadpricedone = true;
            self.departDateTimeStr = "không có vé";
            self.PriceAvgPlusTAStr = 0;
            self.msgwrn = "Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
            return;
          }
          if (self.transferdetaildepart.data.drop_off_points_at_arrive.length > 0) {
            self.departTimeStrt = self.transferdetaildepart.data.drop_off_points_at_arrive[0].dropoff_time;
            self.id_pickup_pointsdepartt = self.transferdetaildepart.data.drop_off_points_at_arrive[0].id;
            self.pickup_pointsdepartt = self.transferdetaildepart.data.drop_off_points_at_arrive[0].name;
            self.addressdepartt = self.transferdetaildepart.data.drop_off_points_at_arrive[0].address;
            self.drop_off_points_at_arrivedep = self.transferdetaildepart.data.drop_off_points_at_arrive;
            //phụ thu điểm đón
            self.surchargedept = self.transferdetaildepart.data.drop_off_points_at_arrive[0].surcharge;
            self.surcharge_typedept = self.transferdetaildepart.data.drop_off_points_at_arrive[0].surcharge_type;
          }
          else {
            self.loadpricedone = true;
            self.departDateTimeStr = "không có vé";
            self.PriceAvgPlusTAStr = 0;
            self.msgwrn = "Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
            return;
          }
          //điểm đón trung chuyển
          self.bookCombo.arrplacedeptcd = [];
          self.bookCombo.arrplacedeptct = [];
          self.bookCombo.arrplacedepd = [];
          self.bookCombo.arrplacedept = [];
          if (self.transferdetaildepart.data.transfer_points.length > 0) {
            self.bookCombo.arrplacedeptcd = self.transferdetaildepart.data.transfer_points;
          }
          //điểm trả trung chuyển
          if (self.transferdetaildepart.data.transfer_points_at_arrive.length > 0) {
            self.bookCombo.arrplacedeptct = self.transferdetaildepart.data.transfer_points_at_arrive;
          }
          self.bookCombo.arrplacedepd = self.pickup_pointsdep;
          self.bookCombo.arrplacedept = self.drop_off_points_at_arrivedep;
          self.postcardetailreturn(value);
        }
        else {
          self.indexdep++;
          if (self.indexdep < self.departTime.length) {
            self.loadTransferInfo(self.departTime, self.returnTime, self.indexdep, self.indexret);
          }
          else {
            self.loadpricedone = true;
            self.departDateTimeStr = "không có vé";
            self.PriceAvgPlusTAStr = 0;
            self.msgwrn = "Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
          }
        }
      })
    });
  }
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
    se.AdultOtherFee = se.AdultOtherFee * (se.jsonroom[0].Rooms[0].IncludeAdults * se.roomnumber) / se.AdultCombo;
    se.PriceDiffUnit = se.AdultOtherFee + ((se.elementMealtype.PriceAvgDefaultTA * se.roomnumber) * se.TotalNight / se.AdultCombo) - se.roomPriceSale;

    //Lấy thêm giá phòng chênh tính theo người lớn
    se.RoomPriceDiffUnit = ((se.elementMealtype.PriceAvgDefaultTA * se.roomnumber) * se.TotalNight / se.AdultCombo) - se.bookCombo.ComboDetail.comboDetail.roomPriceSale;
    se.JsonSurchargeFee.AdultUnit = se.PriceDiffUnit;
    se.JsonSurchargeFee.RoomDifferenceFee = se.PriceDiffUnit * se.AdultCombo + (se.totalAdult - se.AdultCombo) * se.AdultOtherFee + se.ChildOtherFeeTotal;
  }
  //get data chiều về
  postcardetailreturnload(value) {
    var self = this;
    let strUrl = C.urls.baseUrl.urlMobile + '/get-transfer-detail?trip_code='+this.returnObject.route.schedules[0].trip_code;
      let headers =  {
        Connection: 'keep-alive',
        'Accept-Encoding': 'gzip, deflate',
        Host: C.urls.baseUrl.urlMobile,
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent': 'PostmanRuntime/7.17.1'
      };
      self.gf.RequestApi('GET', strUrl, headers, {}, 'combocarnew', 'postcardetailreturnload').then((data) => {
      self.transferdetailreturn = data;
      self.zone.run(() => {
        if (self.transferdetailreturn.data.pickup_points.length > 0) {
          self.bookCombo.arrplaceretd = [];
          self.bookCombo.arrplacerett = [];
          self.returnTimeStrd = self.transferdetailreturn.data.pickup_points[0].pickup_time;
          self.id_pickup_pointsreturnd = self.transferdetailreturn.data.pickup_points[0].id;
          self.pickup_pointsreturnd = self.transferdetailreturn.data.pickup_points[0].name;
          self.addressreturnd = self.transferdetailreturn.data.pickup_points[0].address;
          self.pickup_pointsret = self.transferdetailreturn.data.pickup_points;
          self.bookCombo.arrplaceretd = self.transferdetailreturn.data.pickup_points;
          //phụ thu điểm trả
          self.surchargeretd = self.transferdetailreturn.data.pickup_points[0].surcharge;
          self.surcharge_typeretd = self.transferdetailreturn.data.pickup_points[0].surcharge_type;
        }
        else {
          self.loadpricedone = true;
          self.departDateTimeStr = "không có vé";
          self.PriceAvgPlusTAStr = 0;
          self.msgwrn = "Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
          return;
        }
        if (self.transferdetailreturn.data.drop_off_points_at_arrive.length > 0) {
          self.returnTimeStrt = self.transferdetailreturn.data.drop_off_points_at_arrive[0].dropoff_time;
          self.id_pickup_pointsreturnt = self.transferdetailreturn.data.drop_off_points_at_arrive[0].id;
          self.pickup_pointsreturnt = self.transferdetailreturn.data.drop_off_points_at_arrive[0].name;
          self.addressreturnt = self.transferdetailreturn.data.drop_off_points_at_arrive[0].address;
          self.drop_off_points_at_arriveret = self.transferdetailreturn.data.drop_off_points_at_arrive;
          self.bookCombo.arrplacerett = self.transferdetailreturn.data.drop_off_points_at_arrive;
          //phụ thu điểm trả
          self.surchargerett = self.transferdetailreturn.data.drop_off_points_at_arrive[0].surcharge;
          self.surcharge_typerett = self.transferdetailreturn.data.drop_off_points_at_arrive[0].surcharge_type;
        }
        else {
          self.loadpricedone = true;
          self.departDateTimeStr = "không có vé";
          self.PriceAvgPlusTAStr = 0;
          self.msgwrn = "Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
          return;
        }
        //điểm đón trung chuyển
        self.bookCombo.arrplacerettcd = [];
        self.bookCombo.arrplacerettct = [];
        if (self.transferdetaildepart.data.transfer_points.length > 0) {
          self.bookCombo.arrplacerettcd = self.transferdetailreturn.data.transfer_points;

        }
        //điểm trả trung chuyển
        if (self.transferdetaildepart.data.transfer_points_at_arrive.length > 0) {
          self.bookCombo.arrplacerettct = self.transferdetailreturn.data.transfer_points_at_arrive;
        }
        //tính giá
        self.priceseatdep = 1000000;
        self.priceseatret = 1000000;
        if (self.seat_group_english_dep == 'DOUBLE') {
          var numberseat = Math.round(self.totalAdult / 2);
          var diff_feedep = self.diff_feedep / self.totalAdult;
          self.priceseatdep = (diff_feedep + self.pricedepart) * numberseat;
        }
        else {
          self.priceseatdep = (self.pricedepart * self.totalAdult) + self.diff_feedep;
        }
        if (self.seat_group_english_ret == 'DOUBLE') {
          var numberseat = Math.round(self.totalAdult / 2);
          var diff_feeret = self.diff_feeret / self.totalAdult;
          self.priceseatret = (diff_feeret + self.pricereturn) * numberseat;
        }
        else {
          self.priceseatret = (self.pricereturn * self.totalAdult) + self.diff_feeret;
        }
        self.PriceAvgPlusTAStr = (self.PriceAvgPlusTA + self.priceseatdep + self.priceseatret) + (self.surchargedepd + self.surchargedept + self.surchargeretd + self.surchargerett) * self.totalAdult;
        self.total = self.PriceAvgPlusTAStr;
        self.PriceAvgPlusTAStr = self.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        if (self.loader) {
          self.loader.dismiss()
        }
        if (value == 0) {
          self.funccheckpoint();
        } else {
          self.edit();
        }
      })
    });
  }
  postcardetailreturn(value) {
    var self = this;
    var options = {
      method: 'GET',
      url: C.urls.baseUrl.urlMobile + '/get-transfer-detail',
      qs: { trip_code: this.returnObject.route.schedules[0].trip_code },
      headers:
      {
        'cache-control': 'no-cache',
        Connection: 'keep-alive',
        'Accept-Encoding': 'gzip, deflate',
        Host: C.urls.baseUrl.urlMobile,
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent': 'PostmanRuntime/7.17.1'
      }
    };
    let strUrl = C.urls.baseUrl.urlMobile + '/get-transfer-detail?trip_code='+this.returnObject.route.schedules[0].trip_code;
      let headers =  {
        Connection: 'keep-alive',
        'Accept-Encoding': 'gzip, deflate',
        Host: C.urls.baseUrl.urlMobile,
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent': 'PostmanRuntime/7.17.1'
      };
      self.gf.RequestApi('GET', strUrl, headers, {}, 'combocarnew', 'postcardetailreturn').then((data) => {
      var transferdetailret = data;
      if (transferdetailret.data.total_available_seats >= self.totalAdult) {
        self.zone.run(() => {
          self.transferdetailreturn = data;
          if (self.transferdetailreturn.data.pickup_points.length > 0) {
            self.bookCombo.arrplaceretd = [];
            self.bookCombo.arrplacerett = [];
            self.returnTimeStrd = self.transferdetailreturn.data.pickup_points[0].pickup_time;
            self.id_pickup_pointsreturnd = self.transferdetailreturn.data.pickup_points[0].id;
            self.pickup_pointsreturnd = self.transferdetailreturn.data.pickup_points[0].name;
            self.addressreturnd = self.transferdetailreturn.data.pickup_points[0].address;
            self.pickup_pointsret = self.transferdetailreturn.data.pickup_points;
            //phụ thu điểm trả
            self.surchargeretd = self.transferdetailreturn.data.pickup_points[0].surcharge;
            self.bookCombo.arrplaceretd = self.transferdetailreturn.data.pickup_points;
          }
          else {
            self.loadpricedone = true;
            self.departDateTimeStr = "không có vé";
            self.PriceAvgPlusTAStr = 0;
            self.msgwrn = "Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
            return;
          }
          if (self.transferdetailreturn.data.drop_off_points_at_arrive.length) {
            self.returnTimeStrt = self.transferdetailreturn.data.drop_off_points_at_arrive[0].dropoff_time;
            self.id_pickup_pointsreturnt = self.transferdetailreturn.data.drop_off_points_at_arrive[0].id;
            self.pickup_pointsreturnt = self.transferdetailreturn.data.drop_off_points_at_arrive[0].name;
            self.addressreturnt = self.transferdetailreturn.data.drop_off_points_at_arrive[0].address;
            self.drop_off_points_at_arriveret = self.transferdetailreturn.data.drop_off_points_at_arrive;
            self.bookCombo.arrplacerett = self.transferdetailreturn.data.drop_off_points_at_arrive;
            self.surchargerett = self.transferdetailreturn.data.drop_off_points_at_arrive[0].surcharge;
            self.surcharge_typerett = self.transferdetailreturn.data.drop_off_points_at_arrive[0].surcharge_type;
          }
          else {
            self.loadpricedone = true;
            self.departDateTimeStr = "không có vé";
            self.PriceAvgPlusTAStr = 0;
            self.msgwrn = "Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
            return;
          }
          //điểm đón trung chuyển
          self.bookCombo.arrplacerettcd = [];
          self.bookCombo.arrplacerettct = [];
          if (self.transferdetaildepart.data.transfer_points.length > 0) {
            self.bookCombo.arrplacerettcd = self.transferdetailreturn.data.transfer_points;

          }
          //điểm trả trung chuyển
          if (self.transferdetaildepart.data.transfer_points_at_arrive.length > 0) {
            self.bookCombo.arrplacerettct = self.transferdetailreturn.data.transfer_points_at_arrive;
          }
          self.getavailableseats(value)
        })
      }
      else {
        self.indexret++;
        if (self.indexret < self.returnTime.length) {
          self.loadTransferInfo(self.departTime, self.returnTime, self.indexdep, self.indexret);
        }
        else {
          self.loadpricedone = true;
          self.departDateTimeStr = "không có vé";
          self.PriceAvgPlusTAStr = 0;
          self.msgwrn = "Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
        }
      }

    });
  }
  getavailableseats(value) {
    var se = this;
    let body =
    {
      departParams:
      {
        trip_code: this.departObject.route.schedules[0].trip_code,
        total_seats: this.totalAdult,
        total_price: this.departObject.route.schedules[0].fare.price * se.totalAdult,
      },
      returnParams:
      {
        trip_code: this.returnObject.route.schedules[0].trip_code,
        total_seats: this.totalAdult,
        total_price: this.returnObject.route.schedules[0].fare.price * se.totalAdult,
      },
    };
    let strUrl = C.urls.baseUrl.urlMobile + '/get-available-seats';
      let headers =  {
        apikey: 'sx25k7TABO6W4ULFjfxoJJaLjQr0wUGxYCph1TQiTBM',
        apisecret: 'wZH8vCalp5-ZsUzJiP1IP6V2beWUm0ej8G_25gzg2xg'
      };
      se.gf.RequestApi('POST', strUrl, headers, body, 'combocarnew', 'getavailableseats').then((data) => {
      se.zone.run(() => {
        if (data.status == 1 || data.status == 3) {
          se.diff_feedep = data.data[0].diff_fee;
          se.diff_feeret = data.data[1].diff_fee;
          se.seat_group_english_dep = data.data[0].list_seats[0].seat_group_english;
          se.seat_group_english_ret = data.data[1].list_seats[0].seat_group_english;
          //tính giá
          se.priceseatdep = 1000000;
          se.priceseatret = 1000000;
          if (se.seat_group_english_dep == 'DOUBLE') {
            var numberseat = Math.round(se.totalAdult / 2);
            var diff_feedep = se.diff_feedep / se.totalAdult;
            se.priceseatdep = (diff_feedep + se.pricedepart) * numberseat;
          }
          else {
            se.priceseatdep = (se.pricedepart * se.totalAdult) + se.diff_feedep;
          }
          if (se.seat_group_english_ret == 'DOUBLE') {
            var numberseat = Math.round(se.totalAdult / 2);
            var diff_feeret = se.diff_feeret / se.totalAdult;
            se.priceseatret = (diff_feeret + se.pricereturn) * numberseat;
          }
          else {
            se.priceseatret = (se.pricereturn * se.totalAdult) + se.diff_feeret;
          }
          se.PriceAvgPlusTAStr = (se.PriceAvgPlusTA + se.priceseatdep + se.priceseatret) + (se.surchargedepd + se.surchargedept + se.surchargeretd + se.surchargerett) * se.totalAdult;
          se.total = se.PriceAvgPlusTAStr;
          se.PriceAvgPlusTAStr = se.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          if (value == 0) {
            se.funccheckpoint();
          } else {
            se.edit();
          }
          se.loadpricedone = true;
        }
        else {
          se.indexdep++;
          se.indexret++;
          if (se.indexdep < se.departTime.length) {
            se.loadTransferInfo(se.departTime, se.returnTime, se.indexdep, se.indexret);
          }
          else if (se.indexret < se.returnTime.length) {
            se.loadTransferInfo(se.departTime, se.returnTime, se.indexdep, se.indexret);
          }
          else {
            se.loadpricedone = true;
            se.departDateTimeStr = "không có vé";
            se.PriceAvgPlusTAStr = 0;
            se.msgwrn = "Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
          }
        }
      })
    })
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
  async showListCar(index) {
    var se = this;
    this.gf.setParams({ listdepart: this.listDepartTransfers, listreturn: this.listReturnTransfers, totalAdult: this.totalAdult, title: index == 0 ? this.daydeparttitle : this.dayreturntitle, isdepart: index == 0 ? true : false }, 'listcar');
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: CardeparturePage
      });
    modal.present();
    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      //this.presentLoading();
      if (data.data) {
        se.zone.run(() => {
          if (data.data.isdepart) {
            se.bookCombo.idpointdepd = '';
            se.bookCombo.idpointdept = '';
            se.diff_feedep = data.data.diff_fee;
            se.current = data.data.cars;
            se.seat_group_english_dep = data.data.seat_group_english;
            se.loadData(se.current, data.data.isdepart);
          } else {
            se.bookCombo.idpointretd = '';
            se.bookCombo.idpointrett = '';
            se.diff_feeret = data.data.diff_fee
            se.current = data.data.cars;
            se.seat_group_english_ret = data.data.seat_group_english;
            se.loadData(se.current, data.data.isdepart);
          }
          if (data.data.loader) {
            data.data.loader.dismiss();
          }
        })
      }
    })
  }
  //load lại data
  loadData(Transfer, ischeck) {
    var se = this;
    this.loadpricedone=false;
    if (ischeck) {
      //bind thông tin chiều đi
      if (Transfer && Transfer.length > 0) {
        this.departObject = Transfer[0];
        let de_date = this.departObject.route.departure_date;
        se.departDateTimeStr = 'Đi ' + se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD-MM-YYYY');
        se.departTimeStrd = this.departObject.route.pickup_time;
        se.departTimeStrt = this.departObject.route.arrival_time;
        se.departVehicleStr = this.departObject.company.name;
        this.departTicketSaleshow = this.departObject.route.schedules[0].fare.price - this.departTicketSale;
        se.daydeparttitle = se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD-MM-YYYY');
        this.pricedepart = this.departObject.route.schedules[0].fare.price;
        if (this.departTicketSaleshow <= 0) {
          this.checkdiscountdepart = true;
          this.departTicketSaleshow = Math.abs(this.departTicketSaleshow);
        }
        else {
          this.checkdiscountdepart = false;
        }
        this.departTicketSaleshow = this.departTicketSaleshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        this.PriceAvgPlusTAStr = 0;
        this.postcardetaildepartload(1);
        // this.PriceAvgPlusTAStr = this.PriceAvgPlusTA + this.pricedepart * this.adults + this.pricereturn * this.adults;
        // this.total = this.PriceAvgPlusTAStr;
        // this.PriceAvgPlusTAStr = this.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

      }
    } else {
      //bind thông tin chiều về
      if (Transfer && Transfer.length > 0) {
        this.returnObject = Transfer[0];
        let re_date = this.returnObject.route.departure_date;
        se.returnDateTimeStr = 'Về ' + se.getDayOfWeek(re_date) + ', ' + moment(re_date).format('DD-MM-YYYY');
        se.returnTimeStrd = this.returnObject.route.pickup_time;
        se.returnTimeStrt = this.returnObject.route.arrival_time;
        se.returnVehicleStr = this.returnObject.company.name;
        this.returnTicketSaleshow = this.returnObject.route.schedules[0].fare.price - this.returnTicketSale;
        this.pricereturn = this.returnObject.route.schedules[0].fare.price;
        if (this.returnTicketSaleshow <= 0) {
          this.checkdiscountreturn = true;
          this.returnTicketSaleshow = Math.abs(this.returnTicketSaleshow);
        }
        else {
          this.checkdiscountreturn = false;
        }
        this.returnTicketSaleshow = this.returnTicketSaleshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        this.PriceAvgPlusTAStr = 0;
        this.postcardetailreturnload(1);
        // this.PriceAvgPlusTAStr = this.PriceAvgPlusTA + this.pricedepart * this.adults + this.pricereturn * this.adults;
        // this.total = this.PriceAvgPlusTAStr;
        // this.PriceAvgPlusTAStr = this.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
    }


  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      message: "",
    });
    this.loader.present();
  }
  textchange() {
    this.ischeckbtnpromo = false;
    this.discountpromo = 0;
    this.ischeckerror = 0;
    this.msg = "";
    if (this.ischeck) {
      if (this.ischeckpoint) {
        this.Pricepointshow = 0;
      }
      else {
        this.price = this.point.toLocaleString();
        var tempprice = this.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
        this.Pricepoint = tempprice - this.point;
        this.Pricepointshow = this.Pricepoint.toLocaleString();
      }
    }
  }
  click() {
    this.ischecktext = 3
  }
  promofunc() {
    var se = this;
    if (se.promocode) {
      let body = { bookingCode: 'HOTEL',code: se.promocode, totalAmount: se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, ''), comboDetailId: this.bookCombo.ComboId,
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
      } };
      let strUrl = C.urls.baseUrl.urlMobile + '/api/data/validpromocode';
      let headers =  {
        'postman-token': '37a7a641-c2dd-9fc6-178b-6a5eed1bc611',
          'cache-control': 'no-cache',
          'content-type': 'application/json'
      };
      se.gf.RequestApi('POST', strUrl, headers, body, 'combocarnew', 'getavailableseats').then((data) => {
        se.zone.run(() => {
          var json = data;
          if (json) {
            var total = se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '');
            if (se.ischeck) {
              total = se.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
            }
            let discountpromo = data.data.orginDiscount ? data.data.orginDiscount : data.data.discount;
            se.Pricepointshow = total -  discountpromo;
            se.discountpromo = discountpromo;
            se.promocode = json.data.code;
            se.strPromoCode = json.data.code;
            se.totaldiscountpromo = discountpromo;
            se._voucherService.comboCarPromoCode = se.strPromoCode;
            se._voucherService.comboCarTotalDiscount = se.totaldiscountpromo;
            if (se.Pricepointshow > 0) {
              se.Pricepointshow = se.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
              se.ischeckbtnpromo = true;
              se.ischeckpromo = true;
            }
            else {
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
  edit() {
    this.zone.run(() => {
      if (this.ischeck) {
        if (this.ischeckpoint) {
          this.Pricepointshow = 0;
        }
        else {
          if (this.ischeckpromo) {
            this.price = this.point.toLocaleString();
            var tempprice = this.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
            this.Pricepoint = tempprice - this.point - this.totaldiscountpromo;
            if (this.Pricepoint<=0) {
              this.Pricepoint=0;
            }
            this.Pricepointshow = this.Pricepoint.toLocaleString();
            this.bookCombo.totalprice = this.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          } else {
            this.price = this.point.toLocaleString();
            var tempprice = this.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
            this.Pricepoint = tempprice - this.point;
            if (this.Pricepoint<=0) {
              this.Pricepoint=0;
            }
            this.Pricepointshow = this.Pricepoint.toLocaleString();
            this.bookCombo.totalprice = this.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          }
        }

      } else {
        if (this.ischeckpromo) {
          this.PriceAvgPlusTAStr = this.total - this.discountpromo;
          var tempprice = this.PriceAvgPlusTAStr
          this.Pricepointshow = tempprice - this.totaldiscountpromo;
          if (this.Pricepointshow<=0) {
            this.Pricepointshow=0;
          }
          this.Pricepointshow = this.Pricepointshow.toLocaleString();
        }
        else {
          this.PriceAvgPlusTAStr = this.total.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.bookCombo.totalprice = this.PriceAvgPlusTAStr;
        }

      }
      if (this.loader) {
        this.loader.dismiss();
      }
    })
    this.loadcarspricedone = true;
    this.checkVoucherClaimed();
  }
  async sendRequestCombo() {
    this.bookCombo.Address = this.Address;
    this.bookCombo.isFlightCombo = false;
    this.bookCombo.isFlashSale = true;
    this.bookCombo.isNormalCombo = false;
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: RequestCombo1Page
      });
    modal.present();

    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      this.valueGlobal.backValue = 'carcombo';
      this.navCtrl.navigateBack('/hoteldetail/' + this.booking.HotelId);
    })
  }
  async changeplace(value) {
    var self = this;
    this.bookCombo.isDepart = value;
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: CombocarchangeplacePage
      });
    modal.present();
    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      self.zone.run(() => {
        if (data.data) {
          if (data.data.isdepart == '0') {
            if (data.data.placed.length > 0) {
              self.departTimeStrd = data.data.placed[0].pickup_time;
              self.pickup_pointsdepartd = data.data.placed[0].name;
              self.id_pickup_pointsdepartd = data.data.placed[0].id;
              self.addressdepartd = data.data.placed[0].address;
              self.bookCombo.idpointdepd = self.id_pickup_pointsdepartd;
              self.surchargedepd = data.data.placed[0].surcharge;
              self.surcharge_typedepd = data.data.placed[0].surcharge_type;
            }
            if (data.data.placet.length > 0) {
              self.id_pickup_pointsdepartt = data.data.placet[0].id;
              self.pickup_pointsdepartt = data.data.placet[0].name;
              self.addressdepartt = data.data.placet[0].address;
              self.departTimeStrt = data.data.placet[0].dropoff_time;
              self.bookCombo.idpointdept = self.id_pickup_pointsdepartt;
              self.surchargedept = data.data.placet[0].surcharge;
              self.surcharge_typedept = data.data.placet[0].surcharge_type;
            }
          } else {
            if (data.data.placed.length > 0) {
              self.returnTimeStrd = data.data.placed[0].pickup_time;
              self.pickup_pointsreturnd = data.data.placed[0].name;
              self.id_pickup_pointsreturnd = data.data.placed[0].id;
              self.addressreturnd = data.data.placed[0].address;
              self.bookCombo.idpointretd = self.id_pickup_pointsreturnd;
              self.surchargeretd = data.data.placed[0].surcharge;
              self.surcharge_typeretd = data.data.placed[0].surcharge_type;
            }
            if (data.data.placet.length > 0) {
              self.id_pickup_pointsreturnt = data.data.placet[0].id;
              self.pickup_pointsreturnt = data.data.placet[0].name;
              self.addressreturnt = data.data.placet[0].address;
              self.returnTimeStrt = data.data.placet[0].dropoff_time;
              self.bookCombo.idpointrett = self.id_pickup_pointsreturnt;
              self.surchargerett = data.data.placet[0].surcharge;
              self.surcharge_typerett = data.data.placet[0].surcharge_type;
            }
          }
          self.PriceAvgPlusTAStr = 0;
          self.PriceAvgPlusTAStr = (self.PriceAvgPlusTA + self.pricedepart * self.totalAdult + self.pricereturn * self.totalAdult) + self.diff_feedep + self.diff_feeret + (self.surchargedepd + self.surchargedept + self.surchargeretd + self.surchargerett) * self.totalAdult;
          self.total = self.PriceAvgPlusTAStr;
          self.PriceAvgPlusTAStr = self.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        }
      })

    })
  }
  showmsg(msg) {
    alert(msg);
  }
  async showdiscount(){
    if (!this.ischeck) {
      $('.div-point').removeClass('div-disabled');
    this.valueGlobal.PriceAvgPlusTAStr=this.PriceAvgPlusTAStr;
    this.textpromotion="iVIVU Voucher | Mobile Gift";
    // this.promocode="";
    // this.discountpromo = 0;
    // this.ischeckbtnpromo=false;
    // this.ischeckpromo=false;
    //       this.itemVoucherCarCombo = null;
    //       this.bookCombo.promoCode = "";
    //       this.bookCombo.discountpromo = 0;
    this.msg="";
    this._voucherService.openFrom = 'combocarnew';
    const modal: HTMLIonModalElement =
    await this.modalCtrl.create({
      component: AdddiscountPage,
    });
    modal.present();
    this._voucherService.listPromoCode = [];
    this.buildStringPromoCode();
    this.edit();
    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      if(this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0){
        if(this.strPromoCode){
          this.strPromoCode += ', '+this._voucherService.listPromoCode.join(', ');
          this.totaldiscountpromo += this._voucherService.totalDiscountPromoCode;
        }else{
          this.strPromoCode = this._voucherService.listPromoCode.join(', ');
          this.totaldiscountpromo = this._voucherService.totalDiscountPromoCode;
        }
       
        this.edit();
      }else if (data.data) {//case voucher km
        let vc = data.data;
        if(vc.applyFor && vc.applyFor != 'combocar'){
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
      }
      // if (data.data) {
      //   this.zone.run(() => {
      //     if (data.data.promocode) {
      //       $('.div-point').addClass('div-disabled');
      //       this.promocode=data.data.promocode;
      //       this.textpromotion=data.data.promocode;
      //       this.promofunc();
      //     }
      //   })
      // }
    })
    }
  }

  showComboDetail() {
    var se = this;
    var obj = { objectDetail: se };
    console.log(obj);
    //Tính priceDiffUnitFee
    let objroom = obj.objectDetail.room[0];
    let adultCombo = objroom.Rooms[0].IncludeAdults * obj.objectDetail.elementMealtype.TotalRoom;
    adultCombo = adultCombo > se.adults ? se.adults : adultCombo;
    var adultOtherFee = $.grep(obj.objectDetail.elementMealtype.ExtraBedAndGalaDinerList, function (e: any) { return e.ChargeOn == 'Per Adult' && e.Code != 'EXBA' && e.Code != 'AWE' }).reduce(function (acc, val) { return acc + val.PriceOTA; }, 0);
    adultOtherFee = adultOtherFee * (objroom.Rooms[0].IncludeAdults * obj.objectDetail.elementMealtype.TotalRoom) / se.adultCombo;
    obj.objectDetail.elementMealtype.priceDiffUnit = adultOtherFee + ((obj.objectDetail.elementMealtype.PriceAvgDefaultTA * obj.objectDetail.elementMealtype.TotalRoom) * se.TotalNight / adultCombo) - se.roomPriceSale;

    se.MathGaladinnerAdExtrabed();
    se.JsonSurchargeFee.DepartTicketDifferenceFee = (se.departTicketSale - se.pricedepart) * (-1) * se.totalAdult;
    se.JsonSurchargeFee.ReturnTicketDifferenceFee = (se.returnTicketSale - se.pricereturn) * (-1) * se.totalAdult;
    se.JsonSurchargeFee.TotalAll = se.total;
    se.JsonSurchargeFee.ComboData = {
      ComboId: se.bookCombo.ComboId,
      MealTypeCode: se.bookCombo.MealTypeCode,
      AdultCombo: se.adultCombo
    }
    obj.objectDetail.TicketDifferenceFeeUnit = ((se.departTicketSale - se.pricedepart) * (-1)) + ((se.returnTicketSale - se.pricereturn) * (-1));
    if (obj.objectDetail.childrendisplay && obj.objectDetail.childrendisplay > 0) {
      obj.objectDetail.childsTicketFee = obj.objectDetail.pricedepart + obj.objectDetail.pricereturn;
      obj.objectDetail.childsTicketFee = obj.objectDetail.childsTicketFee.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }

    let diff_feedep =0,diff_feeret=0;
    if (se.seat_group_english_dep == 'DOUBLE') {
      var numberseat = Math.round(se.totalAdult / 2);
      diff_feedep = se.diff_feedep / se.totalAdult;
      obj.objectDetail.diff_feedep = diff_feedep;
    }
   
    if (se.seat_group_english_ret == 'DOUBLE') {
      var numberseat = Math.round(se.totalAdult / 2);
      diff_feeret = se.diff_feeret / se.totalAdult;
      obj.objectDetail.diff_feeret = diff_feeret;
    } 
    

    se.activityService.objCarComboPaymentBreakDown = obj;
    se.valueGlobal.backValue = 'combocarpaymentbreakdown';
    se.navCtrl.navigateForward("/combocarpaymentbreakdown");
  }

  async presentToastwarming(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }

  async changeDateInfo(){
    let se = this;
    if (!se.loadpricedone) {
      se.presentToastwarming('Đang tìm vé xe tốt nhất. Xin quý khách vui lòng đợi trong giây lát!');
      return;
    }

    let modal = await se.modalCtrl.create({
      component: SelectDateRangePage,
      animated: true,
      mode: 'ios'
    });
    se.searchhotel.formChangeDate = 8;
    se.valueGlobal.ischeckCB = 1;
    se.searchhotel.CheckInDate = se.gf.getCinIsoDate(se.booking.CheckInDate);
    se.searchhotel.CheckOutDate = se.gf.getCinIsoDate(se.booking.CheckOutDate);
    modal.present();

    const event: any = await modal.onDidDismiss();
    if(event){
      let fromdate = se.gf.getCinIsoDate(event.data.from);
      let todate = se.gf.getCinIsoDate(event.data.to);
      if (fromdate && todate && moment(todate).diff(fromdate, 'days') > 0) {
        se.booking.CheckInDate = moment(fromdate).format('YYYY-MM-DD');
            se.booking.CheckOutDate = moment(todate).format('YYYY-MM-DD');
            se.cinshow = moment(fromdate).format('DD-MM-YYYY');
            se.coutshow = moment(todate).format('DD-MM-YYYY');
            se.cin = moment(fromdate).format('YYYY-MM-DD');
            se.cout = moment(todate).format('YYYY-MM-DD');
            se.searchhotel.CheckInDate = se.booking.CheckInDate;
            se.searchhotel.CheckOutDate = se.booking.CheckOutDate;
            se.bookCombo.FormParam.CheckInDate = se.booking.CheckInDate;
            se.bookCombo.FormParam.CheckOutDate = se.booking.CheckOutDate;
            se.duration = moment(todate).diff(moment(fromdate), 'days');
            se.TotalNight = se.duration;
            se.checkComboAfterChangedate();
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
          var fromdate = new Date(yearstartdate, monthstartdate - 1, fday);
          var todate = new Date(yearenddate, monthenddate - 1, tday);
          if (fromdate && todate && moment(todate).diff(fromdate, 'days') > 0) {
            var se = this;
            se.booking.CheckInDate = moment(se.gf.getCinIsoDate(fromdate)).format('YYYY-MM-DD');
            se.booking.CheckOutDate = moment(se.gf.getCinIsoDate(todate)).format('YYYY-MM-DD');
            se.cinshow = moment(se.gf.getCinIsoDate(fromdate)).format('DD-MM-YYYY');
            se.coutshow = moment(se.gf.getCinIsoDate(todate)).format('DD-MM-YYYY');
            se.cin = moment(se.gf.getCinIsoDate(fromdate)).format('YYYY-MM-DD');
            se.cout = moment(se.gf.getCinIsoDate(todate)).format('YYYY-MM-DD');
            se.searchhotel.CheckInDate = se.booking.CheckInDate;
            se.searchhotel.CheckOutDate = se.booking.CheckOutDate;
            se.bookCombo.FormParam.CheckInDate = se.booking.CheckInDate;
            se.bookCombo.FormParam.CheckOutDate = se.booking.CheckOutDate;
            se.duration = moment(se.gf.getCinIsoDate(todate)).diff(moment(se.gf.getCinIsoDate(fromdate)), 'days');
            se.TotalNight = se.duration;
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
        resolve(moment(se.searchhotel.CheckOutDate).diff(moment(d), 'days') > 0 ? false : true);
      } else {
        resolve(true);
      }
    })
  }

  checkComboAfterChangedate() {
    var se = this;
    se.PriceAvgPlusTAStr = 0;
    se.loadpricedone = false;
    se.checkComboDuration(se.bookCombo.objComboDetail).then((valid) => {
      if (valid) {
        //Valid thì check tiếp BOD
        se.checkBOD(se.bookCombo.objComboDetail.comboDetail.roomId).then((checkbod) => {
          if (checkbod) {
            se.getHotelContractPrice(se.bookCombo.FormParam);
          } else {
            //Không valid thì hiển thị gửi yêu cầu
            se.msgwrn = "Hiện tại không có phòng thoả điều kiện của quy khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
            se.loadpricedone = true;
          }
        })
      } else {
        //Không valid thì hiển thị gửi yêu cầu
        se.msgwrn = "Hiện tại không có phòng thoả điều kiện của quy khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
        se.loadpricedone = true;
      }
    })

  }

  checkBOD(roomid): Promise<any> {
    var se = this;
    return new Promise((resolve, reject) => {
      let strUrl = `https://gate.ivivu.com/get-blackout-date?hotelId=${se.booking.HotelId ? se.booking.HotelId : se.searchhotel.hotelID}&roomId=${roomid}`;
      let headers =  {
        'postman-token': '86c67bdc-5fcd-0240-5549-f3ea2b31faf8',
        'cache-control': 'no-cache'
      };
      se.gf.RequestApi('GET', strUrl, headers, {}, 'combocarnew', 'checkBOD').then((data) => {
        var BOD = data;
        var arrBOD = BOD.BlackOutDates;
        if (arrBOD.length > 0) {
          var checkcintemp = new Date(se.gf.getCinIsoDate(se.cin));
          var checkdatecout = new Date(se.gf.getCinIsoDate(se.cout));
          var checkcin = moment(checkcintemp).format('YYYYMMDD');
          var checkcout = moment(checkdatecout).format('YYYYMMDD');
          for (let i = 0; i < arrBOD.length; i++) {
            var checkBODtemp = new Date(se.gf.getCinIsoDate(arrBOD[i]));
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

  checkAllotment() {
    var se = this;
    let strUrl = C.urls.baseUrl.urlContracting + `/api/toolsapi/CheckAllotment?token=3b760e5dcf038878925b5613c32615ea3&hotelcode=${se.booking.HotelId}&roomcode=${se.bookCombo.ComboDetail.comboDetail.roomId}&checkin=${se.booking.CheckInDate}&checkout=${se.booking.CheckOutDate}&totalroom=${se.roomnumber}`;
    let headers =  {};
    se.gf.RequestApi('GET', strUrl, headers, {}, 'combocarnew', 'checkAllotment').then((data) => {
      var rs = data;
      if (rs.Msg == "AL") {
        se.Roomif.payment = rs.Msg;
        se.Roomif.ischeckpayment = true;
      } else if (rs.Msg == "RQ") {
        se.Roomif.payment = rs.Msg;
        se.Roomif.ischeckpayment = false;
      }
    });
  }
  ionViewWillEnter() {
    if(this.valueGlobal.backValue != 'combocarpaymentbreakdown'){
      this.point=0;
      this.ischeck = false;
      this.Roomif.point='';
      this.price=0;
  
      this.textpromotion="iVIVU Voucher | Mobile Gift";
      this.promocode="";
      this.ischeckbtnpromo=false;
      this.ischeckpromo=false;
      this.msg="";
      this.GetUserInfo();
      this._voucherService.selectVoucher = null;
      this.itemVoucherCarCombo = null;
      this.discountpromo = 0;
      this.bookCombo.promoCode = "";
      this.bookCombo.discountpromo = 0;

      this.strPromoCode = '';
      this.totaldiscountpromo = 0;
      this._voucherService.selectVoucher = [];
      this._voucherService.listPromoCode = "";
      this._voucherService.listObjectPromoCode = [];
      this._voucherService.totalDiscountPromoCode = 0;
      this._voucherService.hotelPromoCode = "";
      this._voucherService.hotelTotalDiscount = 0;
      this._voucherService.vouchers = [];
    }
    
  }
  GetUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        let strUrl = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo';
        let headers =  {
          'cache-control': 'no-cache',
              'content-type': 'application/json',
              authorization: text
        };
        se.gf.RequestApi('GET', strUrl, headers, {}, 'combocarnew', 'GetUserInfo').then((data) => {
            if (data && data.statusCode != 401) {
              se.zone.run(() => {
                if (data.point) {
                  if (data.point > 0) {
                    se.pointshow = data.point;
                    se.Roomif.point = data.point;
                    se.point = data.point * 1000;
                    se.price = se.point.toLocaleString();
                  }
                }
                  se.storage.remove('point');
                  se.storage.set('point', data.point);
              })
            }else{
              se.storage.get('jti').then((memberid) => {
                se.storage.get('deviceToken').then((devicetoken) => {
                  se.gf.refreshToken(memberid, devicetoken).then((token) => {
                    setTimeout(() => {
                      se.GetUserInfo();
                    }, 100)
                  });
  
                })
              })
            }
        });
      }
    })
  }
  sort(property,stt) {
    var se = this;
    se.column = property;
    if(stt==1){
      se.zone.run(() => se.listDepartTransfers.sort(function (a, b) {
        let direction = -1;
        if (property == "priceup") {
          let col = 'priceorder';
          if (a[col] * 1 < b[col] * 1) {
            return 1 * direction;
          }
          else if (a[col] * 1 > b[col] * 1) {
            return -1 * direction;
          }
        } else {
          let direction = (property == "sortByTimeDepartEarly" || property == "sortByTimeLandingEarly") ? -1 : 1;
          let columnname = "sortByTime";
          if (a[columnname] < b[columnname]) {
            return 1 * direction;
          }
          else if (a[columnname] > b[columnname]) {
            return -1 * direction;
          }
        }
      }));
    }
    else{
      se.zone.run(() => se.listReturnTransfers.sort(function (a, b) {
        let direction = -1;
        if (property == "priceup") {
          let col = 'priceorder';
          if (a[col] * 1 < b[col] * 1) {
            return 1 * direction;
          }
          else if (a[col] * 1 > b[col] * 1) {
            return -1 * direction;
          }
        } else {
          let direction = (property == "sortByTimeDepartEarly" || property == "sortByTimeLandingEarly") ? -1 : 1;
          let columnname = "sortByTime";
          if (a[columnname] < b[columnname]) {
            return 1 * direction;
          }
          else if (a[columnname] > b[columnname]) {
            return -1 * direction;
          }
        }
      }));
    }
  }
  async upgradeRoom(){
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
          se.index=data.data.index;
          se.RoomType=itemroom.RoomType;
          se.Roomif.payment = itemmealtype.Status;
          se.bookCombo.ComboDetail.comboDetail.roomId=itemroom.Rooms[0].RoomID;
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
          se.bookCombo.MealTypeName=se.breakfast ;
          se.statusRoom=itemmealtype.Status;
          //se.breakfast = itemmealtype.Name;
          se.Roomif.arrroom = [];
          se.Roomif.arrroom.push(itemroom);
          if(itemroom && itemmealtype){
            se.callSummaryPriceAfterUpgradeRoom(itemroom, itemmealtype)
          }
          se.elementRooom = itemmealtype;
          se.bookCombo.isHBEDBooking = itemmealtype.Supplier == 'HBED' && itemmealtype.HotelRoomHBedReservationRequest;
          se.bookCombo.isAGODABooking = itemmealtype.Supplier == 'AGD' && itemmealtype.HotelCheckDetailTokenAgoda;
        })
      }
    })
  }
  
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

          adultOtherFee = adultOtherFee * (room.Rooms[0].IncludeAdults * se.roomnumber) / adultCombo;
          element.PriceDiffUnit = adultOtherFee + ((element.PriceAvgDefaultTA * se.roomnumber) * se.TotalNight / adultCombo) - se.roomPriceSale;
          element.PriceDiffUnit = Math.round(element.PriceDiffUnit);
        });
      });
      }
    
  }
  nextShuttlebus(){
    this.navCtrl.navigateForward("/shuttlebusnote");
  }



  
  checkVoucherClaimed(){
    setTimeout(()=>{
      if(this.itemVoucherCarCombo && this.itemVoucherCarCombo.claimed){
        this._voucherService.vouchers.forEach((element)=>{
          if(element.id == this.itemVoucherCarCombo.id){
            element.claimed = true;
          }
        });
      }
    },1000)
    
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

    this._voucherService.comboCarPromoCode = this.strPromoCode;
    this._voucherService.comboCarTotalDiscount = this.totaldiscountpromo;
  }
}



