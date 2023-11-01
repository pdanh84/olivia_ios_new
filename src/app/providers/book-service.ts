import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
    providedIn: 'root'  // <- ADD THIS
})
@Injectable()
export class Booking {
    CheckInDate: string;
    CheckOutDate: string;
    roomNb: any;
    Adults: any;
    Child: any;
    CName: string;
    CEmail: string;
    CPhone: string;
    cost: string;
    indexroom: string;
    indexmealtype: string;
    ChildAge: Array<string>;
    HotelId: string;
    timestamp: string;
    Hotels: any;
    HotelName: string;
    RoomName: string;
    note: string;
    Customers: Array<string>;
    MemberId: string;
    MealTypeName: string;
    code: string;
    FormParam: any;
    RatingHotel:string;
    //thời gian check in/out
    CheckinTime:string;
    CheckoutTime:string;
  OriginalRoomClass: any;
  HotelLink: any;
  Avatar: any;
  RegionId: any;
  Address: any;
}
@Injectable()
export class RoomInfo {
    Address: string;
    imgHotel: string;
    dur: string;
    arrroom: Array<string>;
    roomnumber: any;
    roomtype: any;
    jsonroom: Array<string>;
    imgRoom: string;
    ho: string;
    ten: string;
    hoten: string;
    phone: string;
    email: string;
    note: string;
    companyname: string;
    address: string;
    tax: string;
    addressorder: string;
    ischeck: boolean;
    RoomId: string;
    payment: string;
    arrcustomer: Array<string>;
    bed: string;
    notetotal: string;
    arrrbed: Array<string>;
    pricepoint: number;
    setInter: any;
    ischeckpoint: boolean;
    priceshow: string;
    order: string;
    point: any;
    priceshowtt: string;
    HotelRoomHBedReservationRequest: string;
    ischeckpayment: boolean;
    ischeckpaymentCard: boolean;
    ischeckpaymentLater: boolean;
    promocode: string;
    objMealType: any;
    roomcancelhbed: number;
    textcancel: string;
    ischeckpaylater:boolean;
    BillingCode:string;
    qrimg:string;
    nameroom:string;
    //thông tin bank
    accountNumber:string;
    textbank:string;
    bankName:string;
    bankBranch:string;
    paymentbank:string;
    //Hạn thanh toán vé xe rẻ
    expiredtime:string;
    //Mã booking và status
    bookingCode:string;
    bookingStatus:string;
    PeriodPaymentDate:string;
    nameOrder:string;
    ExcludeVAT:any;
  RoomClass: any;
  DescriptionTaxFee: any;
  discountpromo: any;
}
@Injectable()
export class ValueGlobal {
    flag: number;
    flagreview: number;
    arrhotellist: Array<string>;
    arrtopdeal: Array<string>;
    logingoback: string;
    urlblog: string;
    ChildAgeTo: number;
    backValue: string;
    countNotifi: number;
    objchangeinfo: any;
    phone: string;
    name: string;
    pagechangetab5: string;
    popover: any;
    interval: any;
    blogid: string;
    dealid: string;
    insurance: any;
    bookingsComboData: any;
    //thay đổi pass
    resettoken: string;
    userid: string
    token: string;
    checksendcb: boolean;
    countclaim: any = 0;
    //list âm lịch
    listlunar: any;
    likePlaceCount: any;
    //total
    PriceAvgPlusTAStr: string;
    notRefreshDetail: boolean = false;
    activeTab: any;
    titlecombo:string;
    backpageCathay:string
  notSuggestDailyCB: any[];
  dayhot: any[];
  notSuggestDaily: any[];
  ischeckCB: number;
  listhistory: any;
  BookingCodeHis: any;
  ischeckFavourite : any
  notifyAction: string;
  flightAvgPoint: any;
  wasTappedNoti: any;
  flightNumOfReview: any;
}
@Injectable()
export class SearchHotel {
    recent: Array<ItemBook>;
    minprice: string;
    maxprice: string;
    star: Array<number>;
    review: number;
    adult: number;
    child: number;
    roomnumber: number;
    input: string;
    flag: number;
    gbmsg: any;
    gbitem: any;
    chuoi: string;
    CheckInDate: string;
    CheckOutDate: string;
    arrchild: Array<child> = [];
    sortOrder: string;
    meal1check: boolean;
    meal2check: boolean;
    meal3check: boolean;
    local0check: boolean;
    local1check: boolean;
    local2check: boolean;
    local3check: boolean;
    local4check: boolean;
    local5check: boolean;
    local6check: boolean;
    local7check: boolean;
    local8check: boolean;
    local9check: boolean;
    local10check: boolean;
    local11check: boolean;
    local12check: boolean;
    local13check: boolean;
    local14check: boolean;
    local15check: boolean;
    local16check: boolean;
    local17check: boolean;
    local18check: boolean;
    local19check: boolean;
    arrlocalcheck: any = [];
    arrtrademarkcheck: any = [];
    arrfacilitycheck: any = [];
    arrstylecheck: any = [];
    arrhoteltypecheck: any = [];
    itemLocals: Array<itemLocal>;
    trademark0check: boolean;
    trademark1check: boolean;
    trademark2check: boolean;
    trademark3check: boolean;
    trademark4check: boolean;
    trademark5check: boolean;
    trademark6check: boolean;
    trademark7check: boolean;
    trademark8check: boolean;
    trademark9check: boolean;

    facility0check: boolean;
    facility1check: boolean;
    facility2check: boolean;
    facility3check: boolean;
    facility4check: boolean;
    facility5check: boolean;
    facility6check: boolean;
    facility7check: boolean;
    facility8check: boolean;
    facility9check: boolean;
    facility10check: boolean;
    facility11check: boolean;

    style0check: boolean;
    style1check: boolean;
    style2check: boolean;
    style3check: boolean;
    style4check: boolean;
    style5check: boolean;
    style6check: boolean;
    style7check: boolean;
    style8check: boolean;
    style9check: boolean;
    style10check: boolean;
    style11check: boolean;

    hoteltype0check: boolean;
    hoteltype1check: boolean;
    hoteltype2check: boolean;
    hoteltype3check: boolean;
    hoteltype4check: boolean;
    hoteltype5check: boolean;
    hoteltype6check: boolean;
    hoteltype7check: boolean;
    hoteltype8check: boolean;
    hoteltype9check: boolean;
    hoteltype10check: boolean;
    hoteltype11check: boolean;
    location: string;//Khu vực
    tagIds: string;//Phong cách
    classIds: string;//Loại hình nơi ở
    facsearch: string;//Tiện ích
    ef_houropen: string;//Giờ mở cửa (trải nghiệm)
    ef_location: string;//Khu vực (trải nghiệm)
    ef_style: string;//Phong cách (trải nghiệm)
    ef_hoteltype: string;//Loại hình (trải nghiệm)
    ischeckAL: boolean = false;//check có allotment
    ef_arrlocalcheck: any = [];
    ef_arrhouropencheck: any = [];
    ef_arrstylecheck: any = [];
    ef_arrhoteltypecheck: any = [];
    ef_arrdistancecheck: any = [];
    hotelID: string;
    roomID: string;
    rootPage: string;
    isRefreshDetail: boolean;
    showPopup: boolean;//Biến xác định là đang show popup khi close sẽ pop để về trang trước đó
    backPage: string;
    ChildAgeTo: number;
    ischeckBOD: boolean;
    arrimgreview: any = [];
    indexreviewimg: number;
    cusnamereview: string;
    datereview: string;
    clearFilterExperience: boolean = false;
    ItemExperienceRegionRecent = [];
    inputExperienceRegionCode: any;
    inputExperienceText: any;
    experiencesearchTagsId: any;
    inputExperienceItem: any;
    stringFilterName: string;
    ef_arrlocalnamecheck: any = [];
    ef_arrhoteltypenamecheck: any = [];
    ef_arrhouropennamecheck: any = [];
    ef_arrdistancenamecheck: any = [];
    deviceLocation: any;
    ef_arrstylenamecheck: any = [];
    ef_arrsubregioncheck: any = [];
    ef_arrsubregionnamecheck: any = [];
    inputExperienceRegionName: any;
    hotelName: any;
    itemTabHotel = new EventEmitter();
  duplicateName: any;
  duplicateItem: any;
  searchCityName: any;
  destinationCity: any;
  OriginalCity: any;
    itemChangeDate= new EventEmitter();
  formChangeDate: number;//1- homehotel; 2- detailhotel; 3- popupinfo; 4- homeflight; 5-flightchangeinfo; 6 -flightsearchresult; 7- flightcombovmb; 8-comboxe
  selectedRegion: any = [];
  listBOD: any;
  itemHotelCityDetail:any;
  listHotelCityRoomUpgrade: any;
  hotelCityId: any;
  fromPage: string;
  //changeInfoHotelList = new EventEmitter();
  changeInfoHotelList= new Subject<any>();
  elder: any;
  publicChangeInfoHotelList(data: any) {
    this.changeInfoHotelList.next(data);
  }
  getChangeInfoHotelList(): Subject<any> {
    return this.changeInfoHotelList;
  }
  changeInfoFromPage: string;
  hasSortHotelList: any;
  itemSearchHotelHome= new EventEmitter();
  datecin: Date;
  datecout: Date;
  cindisplay: string;
  coutdisplay: string;
  cinthu: string;
  coutthu: string;
  hasShowCalendarFirstTime: any;
  isRecent:any;
    objRecent:any;
    itemChangePax = new EventEmitter();
  tourDetailName: any;
  trustedVideoUrl: any;
  totalPrice: any;
  paymentType: string;
  gaHotelDetail: any;
  gaComboId: any;
  gaComboName: any;
  gaHotelId: string;
  keySearchHotelDetail: any;
  ischeckDate: any;
  openFromTopReviewList: boolean;
  keySearchHotelList: string='';
  reviewName: any;
}
@Injectable()
export class itemLocal {
    name: string;
    arrlocalcheck: any = [];
}
@Injectable()
export class child {
    text: string;
    numage: string;
}
@Injectable()
export class ItemBook {
    Type: string;
    HotelId: string;
    HotelName: string;
    RegionId: string;
    RegionCode: string;
    regionName: string;
    flag: string;
    TotalHotels: string
}
@Injectable()
export class Bookcombo {
    CheckInDate: any;
    CheckOutDate: any;
    Adults: number;
    Child: number;
    Childss: number;
    ChildAge: Array<childAge>;
    roomNb: number;
    location: string;
    tolocation: string;
    ComboRoomPrice: number;
    Nightnum: number;
    roomid: string;
    ReturnTicketSale: string;
    DepartTicketSale: string;
    MealTypeCode: string;
    MealTypeIndex: number;
    PriceDepart: number;
    PriceDepartc: number;
    PriceDepartss: number;
    PriceReturn: number;
    PriceReturnc: number;
    PriceReturnss: number;
    totalprice: number;
    imgroom: string;
    MealTypeName: string;
    MealTypePrice: number;
    PriceDepartpt: number;
    PriceReturnpt: number;
    Pricecpt: number;
    numchildpt: number;
    Pricecptmb: number;
    arrDepart: Array<string>;
    arrReturn: Array<string>;
    Hotelid: string;
    HotelName: string;
    Email: string;
    Avatar: any;
    Address: any;
    HotelLink: string;
    RegionId: any;
    isFlashSale: boolean;
    isFlightCombo: boolean;
    isNormalCombo: boolean;
    ComboId: number;
    ListHotelRoomClasses = [];
    ComboDetail: any;
    arrivalCode: string;
    ComboTitle: string;
    transportDepartTime: string;
    transportReturnTime: string;
    FormParam: any;
    arrPassengers: Array<string>;
    arrlugage: Array<string>;
    lastname: string;
    firstname: string;
    hoten: string;
    phone: string;
    ischecklugage: boolean;
    totalpricecombo: string;
    pricePointShow: any;
    point: any;
    PriceAvgPlusTAStr: any;
    HotelCode: any;
    titleComboShort: any;
    ischeckbtnpromo: boolean;
    discountpromo: number;
    ObjectHotelDetail: any;
    departObjectCar: any;
    returnObjectCar: any;
    totalAdult: number;
    //thay đổi điểm đón/đến
    arrplacedepd: Array<string>;
    arrplacedept: Array<string>;
    arrplaceretd: Array<string>;
    arrplacerett: Array<string>;

    arrplacedeptcd: Array<string>;
    arrplacedeptct: Array<string>;
    arrplacerettcd: Array<string>;
    arrplacerettct: Array<string>;

    isDepart: string;
    idpointdepd: string;
    idpointrett: string;
    idpointretd: string;
    idpointdept: string;
    pricedep: number;
    priceret: number;
    objInsurranceFee: any;
    hasInsurrance: any;
    checkInsurranceFee: any;
    //id chuyến bay
    iddepart: string;
    idreturn: string;
    de_departdatestr: string;
    ar_departdatestr: string;
    departTimeStr: string;
    returnTimeStr: string;
    //book combo vmb tra truoc
    bookingcode: string;
    DepartATCode: string;
    ReturnATCode: string;
    FlightCode: string;
    objComboDetail: any;
    Luggage:number;
    airlineMemberCode:any;
    airlineCardCode:any;
    //thông tin hành lý
    departConditionInfo: any;
    returnConditionInfo: any;
    itemFlightLuggagePriceChange = new EventEmitter();
  totalseatsdep: any;
  totalseatsret: any;
    //check gọi hàm Transaction
    ischeckTransaction:boolean;
    tileComboShort:any;
  upgradeRoomChange= new EventEmitter();
  ischeckShowupgrade: boolean;
  mealTypeRates: any;
  isshuttlebus: any;
  promoCode: string;
  totalPriceBeforeApplyVoucher: any;
  isHBEDBooking: any;
  isAGODABooking: any;
  roomPenalty: boolean;
}
@Injectable()
export class childAge {
    numage: string;
    text: string;
}
@Injectable()
export class DeviceLocation {
    latitude: any;
    longitude: any;
    regioncode: any = '';
}
@Injectable()
export class foodInfo {
    extraOther: Array<string>;
    extraWater: Array<string>;
  extraDinner: any;
}

