import { ValueGlobal } from './../providers/book-service';
import { RequestCombo1Page } from './../requestcombo1/requestcombo1';
import { CardeparturePage } from './../cardeparture/cardeparture.page';
import { Component, OnInit, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { NavController, ActionSheetController, AlertController, ModalController, LoadingController } from '@ionic/angular';
import { Bookcombo, Booking, RoomInfo, SearchHotel } from '../providers/book-service';
import * as moment from 'moment';
import { OverlayEventDetail } from '@ionic/core';
@Component({
  selector: 'app-carcombo',
  templateUrl: './carcombo.page.html',
  styleUrls: ['./carcombo.page.scss'],
})
export class CarComboPage implements OnInit {
  username: any; loader;
  email: any;
  infant: number;
  Avatar: string;
  Name: string;
  Address: string;
  cin: string;
  cout: string;
  cinshow: string;
  coutshow: string;
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
  paxtitle: string;
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
  departTimeStr: string;
  returnTimeStr: string;
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
      ComboData: {}
    };
  point; price; ischeck = false; Pricepoint; Pricepointshow; roomcancel; ischeckpoint = false;roomcboId
  discountpromo; msgwrn;msg; ischecktext = 0; ischeckerror = 0; ischeckbtnpromo = false; ischeckpromo=false; promocode; loadcarspricedone = false;
  constructor(private storage: Storage, private zone: NgZone,public valueGlobal:ValueGlobal,
    private navCtrl: NavController,
    public gf: GlobalFunction,
    public bookCombo: Bookcombo,
    public booking: Booking,
    public Roomif: RoomInfo,
    public searchhotel: SearchHotel, public alertCtrl: AlertController, public modalCtrl: ModalController, public loadingCtrl: LoadingController) {
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
    this.storage.get('point').then(point => {
      if (point) {
        if (point > 0) {
          this.Roomif.point = point;
          this.point = point * 1000;
          this.price = this.point.toLocaleString();
        }
      }
    });
    this.booking.ChildAge.forEach(element => {
      if (element == "<1" || Number(element) < 2) {
        this.infant += 1;
      }
    });
    this.Avatar = Roomif.imgHotel;
    this.Name = booking.HotelName;
    this.Address = Roomif.Address;
    this.cin = booking.CheckInDate;
    this.cout = booking.CheckOutDate;
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
    var chuoicin = this.cin.split('-');
    var chuoicout = this.cout.split('-');
    this.cinshow = chuoicin[2] + "-" + chuoicin[1] + "-" + chuoicin[0];
    this.coutshow = chuoicout[2] + "-" + chuoicout[1] + "-" + chuoicout[0];
    this.nameroom = this.room[0].ClassName;
    this.breakfast = (this.bookCombo.MealTypeCode == 'CUS' ? 'Ăn 3 bữa' : this.bookCombo.MealTypeName);
    this.titlecombo = this.bookCombo.ComboTitle;
    this.titlecomboprice = this.bookCombo.ComboRoomPrice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    this.totalInfant = this.infant;
    this.totalChild = this.children - this.infant;
    this.arrchild = this.searchhotel.arrchild;
    this.childrendisplay = this.children;
    this.adulsdisplay = this.booking.Adults;
    this.fromPlace = this.bookCombo.ComboDetail.comboDetail.departurePlace;
    this.comboId = this.bookCombo.ComboDetail.comboDetail.comboId;
    this.roomcboId = this.bookCombo.ComboDetail.comboDetail.roomId;
    this.departTicketSale = this.bookCombo.ComboDetail.comboDetail.departTicketSale;
    this.returnTicketSale = this.bookCombo.ComboDetail.comboDetail.returnTicketSale;
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
    this.getHotelContractPrice(this.bookCombo.FormParam);

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
  }
  getHotelContractPrice(data) {
    var se = this;
    if (data) {
      data += '&IsPackageRateInternal=true&IsPackageRate=true&IsSeri=true';
      var form = data;
      let headers ={};
      let strUrl = C.urls.baseUrl.urlContracting + '/api/contracting/HotelSearchReqContractAppV2';
      se.gf.RequestApi('POST', strUrl, headers, form, 'carcombo', 'unlikeItemsame').then((data) => {
        se.zone.run(() => {
          var result = data;
          if (result.Hotels) {
            se.jsonroom = result.Hotels[0].RoomClasses;
            var element = se.checkElement(se.jsonroom);
            if (element) {
              se.nameroom = element.ClassName;
              se.PriceAvgPlusTA = element.MealTypeRates[0].PriceAvgPlusTotalTA;
              se.elementMealtype = element.MealTypeRates[0];
              se.TravPaxPrices = element.MealTypeRates[0].PriceAvgPlusNet * se.roomnumber * se.TotalNight;
              se.AdultCombo = element.Rooms[0].IncludeAdults * se.elementMealtype.TotalRoom;
              se.AdultCombo = se.AdultCombo > se.totalAdult ? se.totalAdult : se.AdultCombo;
              se.storage.get('listDepartTransfers_' + se.comboId + '_' + se.cin + '_' + se.adults + '_' + se.children + '_' + se.textagepost).then((data) => {
                if (data) {
                  se.listDepartTransfers = data.data;
                  se.getBestTransfer(data, 1);
                  se.storage.get('listReturnTransfers_' + se.comboId + '_' + se.cout + '_' + se.adults + '_' + se.children + '_' + se.textagepost).then((data) => {
                    if (data) {
                      se.listReturnTransfers = data.data;
                      se.getBestTransfer(data, 0);
                      se.loadTransferInfo(se.departTime, se.returnTime);
                    } else {
                      //Chưa có list xe về thì mới gọi lại api lấy
                      if (!se.listReturnTransfers || se.listReturnTransfers.length <= 0)
                        se.getTransferData(false);
                    }
                  })
                } else {
                  se.getTransferData(true);
                }
              })
            } else {
              se.departDateTimeStr="không có vé";
              se.msgwrn="Hiện tại không có phòng thoả điều kiện của quy khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
              se.loadpricedone=true
            }
          }
          else{
            se.departDateTimeStr="không có vé";
            se.msgwrn="Hiện tại không có phòng thoả điều kiện của quy khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
            se.loadpricedone=true;
          }
        })
      })
    }
  }
  checkElement(object) {
    var el: any = null;
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
    this.navCtrl.navigateBack('/hoteldetail/' + this.booking.HotelId);
  }


  loadTransferInfo(departTransfer, returnTransfer) {
    var se = this;
    //bind thông tin chiều đi
    if (departTransfer && departTransfer.length > 0) {
      this.departObject = departTransfer[0];
      let de_date = this.departObject.route.departure_date;
      se.departDateTimeStr = 'Đi ' + se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD-MM-YYYY');
      se.departTimeStr = this.departObject.route.pickup_time + ' → ' + this.departObject.route.arrival_time;
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
    if (returnTransfer && returnTransfer.length > 0) {
      this.returnObject = returnTransfer[0];
      let re_date = this.returnObject.route.departure_date;
      se.returnDateTimeStr = 'Về ' + se.getDayOfWeek(re_date) + ', ' + moment(re_date).format('DD-MM-YYYY');
      se.returnTimeStr = this.returnObject.route.pickup_time + ' → ' + this.returnObject.route.arrival_time;
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
      this.PriceAvgPlusTAStr = this.PriceAvgPlusTA + this.pricedepart * this.totalAdult + this.pricereturn * this.totalAdult;
      this.total = this.PriceAvgPlusTAStr;
      this.PriceAvgPlusTAStr = this.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }
    this.funccheckpoint();
  }
  // Hàm kiểm tra điểm
  funccheckpoint()
  {
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
      se.Pricepointshow = total -  se.discountpromo;
      if (se.Pricepointshow>0) {
        se.Pricepointshow = se.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        se.ischeckbtnpromo = true;
        se.ischeckpromo=true;
      }
      else
      {
        se.Pricepointshow=0;
      }
      se.ischecktext=0;
      se.ischeckerror=0;
    }
    se.loadcarspricedone=true;
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
          if (data.data.length>0) {
              var listDeparttemp=data.data;
              for (let i = 0; i < listDeparttemp.length; i++) {
                if (listDeparttemp[i].route.schedules[0].available_seats>=se.totalAdult) {
                  se.listDepartTransfers.push(listDeparttemp[i]);
                }
              }
              se.storage.set('listDepartTransfers_' + se.comboId + '_' + se.cin + '_' + se.adults + '_' + se.children + '_' + se.textagepost, data);
              se.listkeys.push('listDepartTransfers_' + se.comboId + '_' + se.cin + '_' + se.adults + '_' + se.children + '_' + se.textagepost);
              se.getBestTransfer(data, 1);
              se.storage.get('listReturnTransfers_' + se.comboId + '_' + se.cout + '_' + se.adults + '_' + se.children + '_' + se.textagepost).then((data) => {
                if (data) {
                  se.listReturnTransfers = data.data;
                  se.getBestTransfer(data, 0);
                  se.loadTransferInfo(se.departTime, se.returnTime);
                } else {
                  //Chưa có list xe về thì mới gọi lại api lấy
                  if (!se.listReturnTransfers || se.listReturnTransfers.length <= 0)
                    se.getTransferData(false);
                }
              })
          }
          else
          {
            se.loadpricedone=true;
            se.departDateTimeStr="không có vé";
            se.msgwrn="Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
          }
        });
      } else {
        se.fromId = se.bookCombo.ComboDetail.comboDetail.departureCode;
        se.toId = se.bookCombo.ComboDetail.arrivalCode;
        //Lấy danh sách chuyến xe chiều về
        var url = C.urls.baseUrl.urlMobile + '/get-transfer-data?cid=' + se.comboId + '&from=' + se.toId + '&to=' + se.fromId + '&date=' + se.cout + '&an=' + se.adults + '&cn=' + se.children + '&cas=' + se.textagepost;
        se.gf.RequestApi('GET', url, {}, {}, 'carcombo', 'get-transfer-data').then((data: any) => {
          if (data) {
            var listReturntemp=data.data;
            for (let i = 0; i < listReturntemp.length; i++) {
              if (listReturntemp[i].route.schedules[0].available_seats>=se.totalAdult) {
                se.listReturnTransfers.push(listReturntemp[i]);
              }
            }
            se.storage.set('listReturnTransfers_' + se.comboId + '_' + se.cout + '_' + se.adults + '_' + se.children + '_' + se.textagepost, data);
            se.listkeys.push('listReturnTransfers_' + se.comboId + '_' + se.cout + '_' + se.adults + '_' + se.children + '_' + se.textagepost);
            se.getBestTransfer(data, 0);
            this.loadTransferInfo(this.departTime, this.returnTime);
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
  getBestTransfer(list, isDepart) {
    var home: any = [];
    var away: any = [];
    for (let i = 0; i < list.data.length; i++) {
      var Hour; var Minute; var kq;
      var time = list.data[i].route.pickup_time;
      Hour = time.toString().split(':')[0];
      Minute = time.toString().split(':')[1];
      kq = Hour * 60 + Number(Minute);
      if (isDepart == 1) {
        if (kq >= 480 && kq <= 840) {
          if (list.data[i].sort_order != 999) {
            home.push(list.data[i]);
          }
          else {
            away.push(list.data[i]);
          }
        }
      }
      else {
        if (kq >= 600 && kq <= 1080) {
          if (list.data[i].sort_order != 999) {
            home.push(list.data[i]);
          }
          else {
            away.push(list.data[i]);
          }
        }
      }
    }
    if (isDepart == 1) {
      if (home.length > 0) {
        this.departTime = home;
      } else {
        this.departTime = away;
      }
    } else {
      if (home.length > 0) {
        this.returnTime = home;
      } else {
        this.returnTime = away;
      }
    }
  }

  getDayOfWeek(date): string {
    let coutthu = moment(date).format('dddd');
    switch (coutthu) {
      case "Monday":
        coutthu = "thứ 2"
        break;
      case "Tuesday":
        coutthu = "thứ 3"
        break;
      case "Wednesday":
        coutthu = "thứ 4"
        break;
      case "Thursday":
        coutthu = "thứ 5"
        break;
      case "Friday":
        coutthu = "thứ 6"
        break;
      case "Saturday":
        coutthu = "thứ 7"
        break;
      default:
        coutthu = "Chủ nhật"
        break;
    }
    return coutthu;
  }
  next() {
    this.presentLoading();
    if (this.point > 0) {
      if (this.ischeck) {
        this.Roomif.ischeckpoint = this.ischeck;
      }
      else {
        this.Roomif.ischeckpoint = this.ischeck;
        this.Roomif.point = '';
      }
    }
    this.postcardetaildepart();
  }
  postcardetaildepart() {
    var self = this;
    let headers ={
      'cache-control': 'no-cache',
        Connection: 'keep-alive',
        'Accept-Encoding': 'gzip, deflate',
        Host: C.urls.baseUrl.urlMobile,
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent': 'PostmanRuntime/7.17.1'
    };
      let strUrl = C.urls.baseUrl.urlMobile + `/get-transfer-detail?trip_code=${this.departObject.route.schedules[0].trip_code}`;
      self.gf.RequestApi('GET', strUrl, headers, {}, 'carcombo', 'postcardetaildepart').then((data) => {
      self.transferdetaildepart = data;
      self.postcardetailreturn();
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
    se.JsonSurchargeFee.AdultUnit = se.PriceDiffUnit;
    se.JsonSurchargeFee.RoomDifferenceFee = se.PriceDiffUnit * se.AdultCombo + (se.totalAdult - se.AdultCombo) * se.AdultOtherFee + se.ChildOtherFeeTotal;
  }
  //get data chiều về
  postcardetailreturn() {
    var self = this;
    let headers ={
      'cache-control': 'no-cache',
        Connection: 'keep-alive',
        'Accept-Encoding': 'gzip, deflate',
        Host: C.urls.baseUrl.urlMobile,
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent': 'PostmanRuntime/7.17.1'
    };
      let strUrl = C.urls.baseUrl.urlMobile + `/get-transfer-detail?trip_code=${this.returnObject.route.schedules[0].trip_code}`;
      self.gf.RequestApi('GET', strUrl, headers, {}, 'carcombo', 'postcardetaildepart').then((data) => {
      self.transferdetailreturn = data;
      self.bookCombo.departObjectCar = self.departObject;
      self.bookCombo.returnObjectCar = self.returnObject;
      self.Commission = (self.elementMealtype.PriceAvgPlusOTA * self.roomnumber * self.TotalNight) - (self.elementMealtype.PriceAvgPlusNet * self.roomnumber * self.TotalNight);
      self.MathGaladinnerAdExtrabed();
      self.JsonSurchargeFee.DepartTicketDifferenceFee = (self.departTicketSale - self.pricedepart) * (-1) * self.totalAdult;
      self.JsonSurchargeFee.ReturnTicketDifferenceFee = (self.returnTicketSale - self.pricereturn) * (-1) * self.totalAdult;
      self.JsonSurchargeFee.TotalAll = self.total;
      self.JsonSurchargeFee.ComboData = {
        ComboId: self.bookCombo.ComboId,
        MealTypeCode: self.bookCombo.MealTypeCode,
        AdultCombo: self.adultCombo
      }
      var pointprice = 0;
      var total = self.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '');
      if (self.ischeck) {
        pointprice = self.point;
        if (self.ischeckpoint) {
          pointprice = self.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '');
        }
        total = self.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
      }
      if (self.ischeckbtnpromo) {
        total = self.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
        self.bookCombo.ischeckbtnpromo=self.ischeckbtnpromo;
        self.bookCombo.discountpromo=self.discountpromo;
        self.Roomif.promocode=self.promocode;
      }
      else
      {
        self.bookCombo.ischeckbtnpromo=self.ischeckbtnpromo;
        self.bookCombo.discountpromo=0;
        self.promocode= "";
        self.Roomif.promocode=self.promocode;
      }
      self.storage.get('jti').then(jti => {
        if (jti) {
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
                PickupPlaceCode: self.transferdetaildepart.data.pickup_points[0].id,
                PickupPlaceName: self.transferdetaildepart.data.pickup_points[0].name,
                DropoffPlaceCode: self.transferdetaildepart.data.drop_off_points_at_arrive[0].id,
                DropoffPlaceName: self.transferdetaildepart.data.drop_off_points_at_arrive[0].name,
                DepartDate: self.departObject.route.pickup_date,
                DepartTime: self.departObject.route.pickup_time,
                ArrivalDate: self.departObject.route.arrival_date,
                ArrivalTime: self.departObject.route.arrival_time,
                Duration: self.departObject.route.duration,
                FareOrigins: self.departObject.route.schedules[0].fare.original,
                FareNet: self.departObject.route.schedules[0].fare.price,
                TotalPrice: self.pricedepart * self.totalAdult,
                CancelPolicy:self.transferdetaildepart.data.policyData.join('\r\n')
              },
              returnTransfer: {
                CompanyCode: self.returnObject.company.id,
                CompanyName: self.returnObject.company.name,
                TransferNumber: self.returnObject.route.schedules[0].trip_code,
                VehicleType: self.returnObject.route.schedules[0].vehicle_type,
                RouteNumber: self.returnObject.route.id,
                PickupPlaceCode: self.transferdetailreturn.data.pickup_points[0].id,
                PickupPlaceName: self.transferdetailreturn.data.pickup_points[0].name,
                DropoffPlaceCode: self.transferdetailreturn.data.drop_off_points_at_arrive[0].id,
                DropoffPlaceName: self.transferdetailreturn.data.drop_off_points_at_arrive[0].name,
                DepartDate: self.returnObject.route.pickup_date,
                DepartTime: self.returnObject.route.pickup_time,
                ArrivalDate: self.returnObject.route.arrival_date,
                ArrivalTime: self.returnObject.route.arrival_time,
                Duration: self.returnObject.route.duration,
                FareOrigins: self.returnObject.route.schedules[0].fare.original,
                FareNet: self.returnObject.route.schedules[0].fare.price,
                TotalPrice: self.pricereturn * self.totalAdult,
                CancelPolicy:self.transferdetailreturn.data.policyData.join('\r\n')
              },
              passengerInfo: {
                FirstName: "",
                LastName: "",
                Email: "",
                MobileNumber: ""
              }
            },
            HotelBooking: {
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
              JsonSurchargeFee: JSON.stringify(self.JsonSurchargeFee),
              Commission: self.Commission,
              Source: '6',
              Supplier: (self.elementMealtype.IsHoliday ? "Holiday" : (self.elementMealtype.IsVoucher ? "Voucher" : self.elementMealtype.Supplier)),
              MemberId: jti,
              UsePointPrice: pointprice,
              promotionCode:self.promocode
            },
          }
          self.bookCombo.totalAdult = self.totalAdult;
          self.gf.setParams(objectCar, 'carscombo');
          self.loader.dismiss();
          self.navCtrl.navigateForward("comboadddetails");
        }
      })
    });
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
    this.gf.setParams({ listdepart: this.listDepartTransfers, listreturn: this.listReturnTransfers, title: index == 0 ? this.daydeparttitle : this.dayreturntitle, isdepart: index == 0 ? true : false }, 'listcar');
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: CardeparturePage
      });
    modal.present();
    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      if (data.data) {
        se.zone.run(() => {
          if (data.data.isdepart) {
            se.current = data.data.cars;
            se.loadData(se.current, data.data.isdepart);
          } else {
            se.current = data.data.cars;
            se.loadData(se.current, data.data.isdepart);
          }

        })
      }
    })
  }
  //load lại data
  loadData(Transfer, ischeck) {
    var se = this;
    if (ischeck) {
      //bind thông tin chiều đi
      if (Transfer && Transfer.length > 0) {
        this.departObject = Transfer[0];
        let de_date = this.departObject.route.departure_date;
        se.departDateTimeStr = 'Đi ' + se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD-MM-YYYY');
        se.departTimeStr = this.departObject.route.pickup_time + ' → ' + this.departObject.route.arrival_time;
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
        this.PriceAvgPlusTAStr = this.PriceAvgPlusTA + this.pricedepart * this.totalAdult + this.pricereturn * this.totalAdult;
        this.total = this.PriceAvgPlusTAStr;
        this.PriceAvgPlusTAStr = this.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

      }
    } else {
      //bind thông tin chiều về
      if (Transfer && Transfer.length > 0) {
        this.returnObject = Transfer[0];
        let re_date = this.returnObject.route.departure_date;
        se.returnDateTimeStr = 'Về ' + se.getDayOfWeek(re_date) + ', ' + moment(re_date).format('DD-MM-YYYY');
        se.returnTimeStr = this.returnObject.route.pickup_time + ' → ' + this.returnObject.route.arrival_time;
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
        this.PriceAvgPlusTAStr = this.PriceAvgPlusTA + this.pricedepart * this.totalAdult + this.pricereturn * this.totalAdult;
        this.total = this.PriceAvgPlusTAStr;
        this.PriceAvgPlusTAStr = this.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
    }
    this.edit();
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
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
      let headers ={
        'content-type' : 'application/x-www-form-urlencoded', 
        accept: '*/*'
      };
      let body = `code=${se.promocode}&totalAmount=${se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '')}`;
        let strUrl = C.urls.baseUrl.urlMobile + '/api/data/validpromocode';
        se.gf.RequestApi('POST', strUrl, headers, body, 'carcombo', 'promofunc').then((data) => {
        se.zone.run(() => {
          var json = data;
          if (json.error == 0) {
            var total = se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '');
            if (se.ischeck) {
              total = se.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
            }
            se.discountpromo = data.data.orginDiscount ? data.data.orginDiscount : data.data.discount;
            se.Pricepointshow = total - se.discountpromo;
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
            this.Pricepoint = tempprice - this.point - this.discountpromo;
            this.Pricepointshow = this.Pricepoint.toLocaleString();
            this.bookCombo.totalprice = this.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          } else {
            this.price = this.point.toLocaleString();
            var tempprice = this.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
            this.Pricepoint = tempprice - this.point;
            this.Pricepointshow = this.Pricepoint.toLocaleString();
            this.bookCombo.totalprice = this.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          }
        }
      } else {
        if (this.ischeckpromo) {
          this.PriceAvgPlusTAStr = this.total.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          var tempprice = this.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
          this.Pricepointshow = tempprice - this.discountpromo;
          this.Pricepointshow = this.Pricepointshow.toLocaleString();
        }
        else {
          this.PriceAvgPlusTAStr = this.total.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.bookCombo.totalprice = this.PriceAvgPlusTAStr;
        }
      }
    })
  }
  ionViewDidEnter() {
    this.GetUserInfo();
  }
  GetUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.gf.getUserInfo(auth_token).then((data) => {
            if (data) {
              if(data.email){
                se.email = data.email;
              }
              se.storage.set("email", data.email);
              se.storage.set("jti", data.memberId);
              se.storage.set("username", data.fullname);
              se.storage.set("phone", data.phone);
              se.storage.set("point", data.point);
            }
        });
      }
    })
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
}
