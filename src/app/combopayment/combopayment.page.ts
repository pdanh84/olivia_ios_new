import { Bookcombo } from './../providers/book-service';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController, Platform, AlertController } from '@ionic/angular';
import { Booking, RoomInfo, SearchHotel } from '../providers/book-service';
import { AuthService } from '../providers/auth-service';
import { C } from '../providers/constants';
import { Storage } from '@ionic/storage';
import { GlobalFunction } from '../providers/globalfunction';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BizTravelService } from '../providers/bizTravelService';
import { voucherService } from '../providers/voucherService';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-combopayment',
  templateUrl: './combopayment.page.html',
  styleUrls: ['./combopayment.page.scss'],
})
export class CombopaymentPage implements OnInit {
  departtime;
  timestamp;
  Avatar; Name; Address; cin; cout; dur; room; nameroom; jsonroom; textage = ""; arrchild;
  roomnumber; adults; children; breakfast; PriceAvgPlusTAStr; priceshow
  imgroom; roomtype; indexme; indexroom; cin1; cout1; checkpayment; book; roomcancel; hotelid
  pricetemp; public loader: any; titlecombo; departTicketSale; departTicketSaleshow; loadpricedone = false;
  returnTicketSale; returnTicketSaleshow; checkdiscountdepart; checkdiscountreturn; departObject; returnObject;
  departDateTimeStr: string;
  returnDateTimeStr: string;
  departTimeStr: string;
  returnTimeStr: string;
  departVehicleStr: any;
  returnVehicleStr: any; listcars; fromPlace; totalAdult; hoten; phone; email; bookingCode;
  jti; arrbankrmb:any = []; tokenid; isbtn = false;
  intervalID: NodeJS.Timeout; ischeckvisa = false;
  _windowmomo: any;
  isremember = true; isdisable = false;
  totalPrice: any;
  sttbooking = 0;
  ischeckedDK = true;
  cindisplay: string;
  coutdisplay: string;
  constructor(public platform: Platform, public searchhotel: SearchHotel, public navCtrl: NavController,
    public storage: Storage, public Roomif: RoomInfo, public booking1: Booking,
    public booking: Booking, public authService: AuthService, public modalCtrl: ModalController, public loadingCtrl: LoadingController,
    public gf: GlobalFunction, public zone: NgZone, private router: Router, public bookCombo: Bookcombo,
    public bizTravelService: BizTravelService,
    public _voucherService: voucherService,
    private alertCtrl: AlertController) {
    this.listcars = this.gf.getParams('carscombo');
    this.totalPrice = bookCombo.totalprice.toString().replace(/\./g, '').replace(/\,/g, '');
    this.priceshow = this.bookCombo.totalprice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    this.hoten = this.Roomif.hoten;
    this.phone = this.Roomif.phone
    this.totalAdult = bookCombo.totalAdult;
    this.Avatar = Roomif.imgHotel;
    this.Name = booking.HotelName;
    this.Address = Roomif.Address;
    this.cin =moment(booking.CheckInDate).format("DD-MM-YYYY");
    this.cout = moment(booking.CheckOutDate).format("DD-MM-YYYY");
    this.cindisplay =moment(booking.CheckInDate).format("DD-MM-YYYY");
    this.coutdisplay = moment(booking.CheckOutDate).format("DD-MM-YYYY");
    this.dur = moment(this.cout).diff(moment(this.cin), 'days');
    this.roomnumber = this.searchhotel.roomnumber;
    this.adults = booking.Adults;
    this.children = booking.Child;
    this.roomtype = Roomif.roomtype;
    this.jsonroom = {...Roomif.jsonroom};
    this.room = Roomif.arrroom;
    var chuoicin = this.cin.split('-');
    var chuoicout = this.cout.split('-');
    this.cin = chuoicin[2] + "-" + chuoicin[1] + "-" + chuoicin[0];
    this.cout = chuoicout[2] + "-" + chuoicout[1] + "-" + chuoicout[0];
    this.nameroom = this.room[0].ClassName;
    this.breakfast = (this.bookCombo.MealTypeCode == 'CUS' ? 'Ăn 3 bữa' : this.bookCombo.MealTypeName);
    this.titlecombo = this.bookCombo.ComboTitle;
    this.arrchild = this.searchhotel.arrchild;
    this.departObject = this.bookCombo.departObjectCar;
    this.returnObject = this.bookCombo.returnObjectCar;
    this.departTicketSale = this.bookCombo.ComboDetail.comboDetail.departTicketSale;
    this.returnTicketSale = this.bookCombo.ComboDetail.comboDetail.returnTicketSale;
    this.fromPlace = this.bookCombo.ComboDetail.comboDetail.departurePlace;
    if (this.arrchild) {
      for (let i = 0; i < this.arrchild.length; i++) {
        if (i == this.arrchild.length - 1) {
          this.textage = this.textage + this.arrchild[i].numage;
        } else {
          this.textage = this.textage + this.arrchild[i].numage + ",";
        }
      }
      if (this.textage) {
        this.textage = "(" + this.textage + ")";
      }
    }
    this.searchhotel.backPage = "roompaymentselect";
    this.searchhotel.rootPage = "roompaymentselect-ean";
    this.checkpayment = Roomif.payment;
    this.bookingCode = this.bookingCode ? this.bookingCode : this.Roomif.bookingCode;
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
        this.GeTokensOfMember(0);
      }
    })
    this.storage.get('email').then(e => {
      if (e !== null) {
        this.email = e;
        this.loadTransferInfo();
      }
    });
    this.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        let text = "Bearer " + auth_token;
        let headers =
        {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
        }
        this.gf.RequestApi('GET', C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo', headers, {}, 'flightcombopaymentselect', 'initpage').then((data) => {
          if (data && data.bizAccount) {
            this.zone.run(() => {
              this.bizTravelService.bizAccount = data.bizAccount;
              this.bizTravelService.isCompany = true;
            })
          } else {
            this.bizTravelService.isCompany = false;
          }
        })
      } else {
        this.bizTravelService.isCompany = false;
      }
    });
    //google analytic
    gf.googleAnalytion('roompaymentselect', 'load', '');
    App.addListener('appUrlOpen', data => {
      this.setinterval();
    });
  }
  ngOnInit() {
  }
  roompaymentbank() {
    this.searchhotel.paymentType = 'banktransfer';
    clearInterval(this.Roomif.setInter);
    this.navCtrl.navigateForward("/combocarbank");
    //google analytic
    this.gf.googleAnalytion('roompaymentselect', 'roompaymentbankselect', '');
  }
  roompaymentlive() {
    this.searchhotel.paymentType = 'office';
    clearInterval(this.Roomif.setInter);
    this.navCtrl.navigateForward("/combocarlive");
    //google analytic
    this.gf.googleAnalytion('roompaymentselect', 'roompaymentliveselect', '');
  }
  roompaymentatm() {
    this.searchhotel.paymentType = 'atm';
    this.navCtrl.navigateForward("/combochoosebank")
    //google analytic
    this.gf.googleAnalytion('combopayment', 'combopayment', '');
  }
  roompaymentvisa() {
    this.searchhotel.paymentType = 'visa';
    if (this.arrbankrmb.length == 0) {
      this.GeTokensOfMember(1);
    }
  }
  postapibook(paymentType) {
    var se = this;
    se.searchhotel.totalPrice = se.priceshow;
    se.searchhotel.paymentType = paymentType;
    se.gf.logEventFirebase(paymentType,se.searchhotel, 'combopayment', 'add_payment_info', 'Combo');
    let body =
    {
      departParams:
      {
        trip_code: this.listcars.TransferBooking.departTransfer.TransferNumber,
        total_seats: this.bookCombo.totalseatsdep,
        total_price: this.bookCombo.pricedep,
        code: '',
        dropoff_place: "",
        pickup_place: ""
      },
      returnParams:
      {
        trip_code: this.listcars.TransferBooking.returnTransfer.TransferNumber,
        total_seats: this.bookCombo.totalseatsret,
        total_price: this.bookCombo.priceret,
        code: '',
        pickup_place: '',
        dropoff_place: ''
      },
      customer_phone: se.phone,
      customer_name: se.hoten,
      customer_email: 'tc@ivivu.com',
      pay_status: 0
    };
    let headers = {
      apikey: 'sx25k7TABO6W4ULFjfxoJJaLjQr0wUGxYCph1TQiTBM',
      apisecret: 'wZH8vCalp5-ZsUzJiP1IP6V2beWUm0ej8G_25gzg2xg'
    };
    let strUrl = C.urls.baseUrl.urlMobile + '/booking';
    this.gf.RequestApi('POST', strUrl, headers, body, 'combolist', 'postapibook').then((data) => {
      if (data) {
        var json = data;
        if (json.length > 0) {
          se.listcars.TransferBooking.departTransfer.ReservedTickets = JSON.stringify(json[0].data.reserve_Tickets);
          se.listcars.TransferBooking.returnTransfer.ReservedTickets = JSON.stringify(json[1].data.reserve_Tickets);

          var Seatsde = json[0].data.seats;
          var Seatsre = json[1].data.seats;
          var seatstextde = "";
          var seatstextre = "";
          for (let i = 0; i < Seatsde.length; i++) {
            if (i == Seatsde.length - 1) {
              seatstextde = seatstextde + Seatsde[i].seat_code;
            }
            else {
              seatstextde = seatstextde + Seatsde[i].seat_code + ',';
            }
          }
          for (let i = 0; i < Seatsre.length; i++) {
            if (i == Seatsre.length - 1) {
              seatstextre = seatstextre + Seatsre[i].seat_code;
            }
            else {
              seatstextre = seatstextre + Seatsre[i].seat_code + ',';
            }
          }
          se.listcars.TransferBooking.departTransfer.Seats = seatstextde;
          se.listcars.TransferBooking.returnTransfer.Seats = seatstextre;
          //thêm hạn thanh toán
          var expiredtimedep = moment(json[0].data.reserve_Tickets.expired_time).format('YYYYMMDDHHmm');
          var expiredtimeret = moment(json[1].data.reserve_Tickets.expired_time).format('YYYYMMDDHHmm');

          if (Number(expiredtimedep) == Number(expiredtimeret)) {
            se.Roomif.expiredtime = json[0].data.reserve_Tickets.expired_time;
          }
          else if (Number(expiredtimedep) > Number(expiredtimeret)) {
            se.Roomif.expiredtime = json[1].data.reserve_Tickets.expired_time;
          }
          else if (Number(expiredtimedep) < Number(expiredtimeret)) {
            se.Roomif.expiredtime = json[0].data.reserve_Tickets.expired_time;
          }
          var textfullname = se.hoten.split(' ')
          var FirstName;
          var LastName;
          if (textfullname.length > 2) {
            let name = '';
            for (let i = 1; i < textfullname.length; i++) {
              if (i == 1) {
                name += textfullname[i];
              } else {
                name += ' ' + textfullname[i];
              }
            }
            FirstName = textfullname[0];
            LastName = name;
          } else if (textfullname.length > 1) {
            FirstName = textfullname[0];
            LastName = textfullname[1];
          }
          else if (textfullname.length == 1) {
            FirstName = textfullname[0];
            LastName = "";
          }
          se.listcars.TransferBooking.passengerInfo.FirstName = FirstName;
          se.listcars.TransferBooking.passengerInfo.LastName = LastName;
          se.listcars.TransferBooking.passengerInfo.Email = se.email;
          se.listcars.TransferBooking.passengerInfo.MobileNumber = se.phone;
          se.listcars.HotelBooking.CPhone = se.phone;
          se.listcars.HotelBooking.LeadingName = se.hoten;
          se.listcars.HotelBooking.LeadingEmail = se.email;
          se.listcars.HotelBooking.LeadingPhone = se.phone;
          se.CreateCombo(paymentType);
        } else {
          se.loader.dismiss();
          se.gf.showAlertMessageOnly("Không còn ghế xe, vui lòng chọn Nhà xe khác!");
          se.navCtrl.navigateForward('/combocarnew');
        }
      }
      else {
        se.loader.dismiss();
        se.gf.showAlertMessageOnly("Không còn ghế xe, vui lòng chọn Nhà xe khác!");
        se.navCtrl.navigateForward('/combocarnew');
      }
    });
  }
  CreateCombo(paymentType) {
    this.timestamp = Date.now();
    var se = this;
    var form = this.listcars;
    var paymentMethod = se.gf.funcpaymentMethod(paymentType);
    form.HotelBooking.PaymentMethod = paymentMethod;
    if (this.bookCombo.mealTypeRates.Supplier == 'SERI' && this.bookCombo.mealTypeRates.HotelCheckDetailTokenInternal) {
      //Check allotment trước khi book
      this.gf.checkAllotmentSeri(
        this.booking.HotelId,
        this.bookCombo.mealTypeRates.RoomId,
        this.booking.CheckInDate,
        this.booking.CheckOutDate,
        this.bookCombo.mealTypeRates.TotalRoom,
        'SERI', this.bookCombo.mealTypeRates.HotelCheckDetailTokenInternal
      ).then((allow) => {
        if (allow) {
          //se.CreateBuildLink(paymentType);
          let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
          let strUrl = C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateComboTransferBooking';
          this.gf.RequestApi('POST', strUrl, headers, form, 'combolist', 'CreateCombo').then((data) => {
            var obj = data;
            se.bookingCode = obj.Code;
            se.Roomif.bookingCode = obj.Code;
            //05-07-2022 thêm đoạn sync crm
            let strUrl = C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateTransactionIDComboTransfer';
            let headers = {};
            var form = {
              BookingCode: obj.Code,
              DepartATCode: obj.TransferReserveCode.DepartReserveCode,
              ReturnATCode: obj.TransferReserveCode.ReturnReserveCode,
              FromPlaceCode: se.listcars.TransferBooking.fromPlaceCode
            }
            se.gf.RequestApi('POST', strUrl, headers, form, 'combocarpaymentpayoonew', 'CreateComboTransferBooking').then((data) => {
              if (data.Error == 0) {
                se.CreateBuildLink(paymentType);
              }
            })

          })
        } else {
          if (se.loader) {
            se.loader.dismiss();
          }
          this.gf.showToastWarning('Hiện tại khách sạn đã hết phòng loại này.');
        }
      })
    } else {
      // se.CreateBuildLink(paymentType);
      let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      let strUrl = C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateComboTransferBooking';
      this.gf.RequestApi('POST', strUrl, headers, form, 'combolist', 'CreateCombo').then((data) => {
        var obj = data;
        se.bookingCode = obj.Code;
        se.Roomif.bookingCode = obj.Code;
        //05-07-2022 thêm đoạn sync crm
        let strUrl = C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateTransactionIDComboTransfer';
        let headers = {};
        var form = {
          BookingCode: obj.Code,
          DepartATCode: obj.TransferReserveCode.DepartReserveCode,
          ReturnATCode: obj.TransferReserveCode.ReturnReserveCode,
          FromPlaceCode: se.listcars.TransferBooking.fromPlaceCode
        }
        se.gf.RequestApi('POST', strUrl, headers, form, 'combocarpaymentpayoonew', 'CreateComboTransferBooking').then((data) => {
          if (data.Error == 0) {
            se.CreateBuildLink(paymentType);
          }
        })
      })
    }

  }
  async openWebpage(url: string) {
    var se = this;
   
    await Browser.open({ url: url});

    Browser.addListener('browserFinished', () => {
      if (se.loader) {
        se.loader.dismiss();
      }
      if (se.Roomif.point && se.bookingCode && se.sttbooking == 0) {
        se.showInfo("Điểm tích luỹ " + se.Roomif.point + " đã được dùng cho booking " + se.bookingCode + ".Xin vui lòng thao tác lại booking!")
      }
      if (se.Roomif.promocode && se.bookingCode && se.sttbooking == 0) {
        se.showInfo("Mã giảm giá " + se.Roomif.promocode + " đã được dùng cho booking " + se.bookingCode + ".Xin vui lòng thao tác lại booking!")
      }
    })
    clearInterval(se.intervalID);
    this.intervalID = setInterval(() => {
      this.checkPayment();
    }, 1000 * 1);
    setTimeout(() => {
      clearInterval(this.intervalID);
    }, 60000 * 15);
  }
  goback() {
    this.navCtrl.navigateForward('/combocarnew');
  }

  roompaymentbreakdow() {
    var dur = this.dur;
    var roomnumber = this.roomnumber;
    this.navCtrl.navigateForward('/roompaymentbreakdown/' + dur + '/' + roomnumber);
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      message: "Giao dịch đang xử lý, xin quý khách đợi trong giây lát!",
    });
    this.loader.present();
  }
  openRoomCancel() {
    this.gf.setParams(this.roomcancel, 'roomInfo')
    this.searchhotel.backPage = "roompaymentselect";
    this.navCtrl.navigateForward('/roomcancel');
  }
  loadTransferInfo() {
    var se = this;
    let de_date = this.departObject.route.departure_date;
    se.departDateTimeStr = 'Đi ' + se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD-MM-YYYY');
    se.departTimeStr = this.listcars.TransferBooking.departTransfer.DepartTime + ' → ' + this.listcars.TransferBooking.departTransfer.ArrivalTime;
    se.departVehicleStr = this.departObject.company.name;
    this.departTicketSaleshow = this.departObject.route.schedules[0].fare.price - this.departTicketSale;
    if (this.departTicketSaleshow <= 0) {
      this.checkdiscountdepart = true;
      this.departTicketSaleshow = Math.abs(this.departTicketSaleshow);
    }
    else {
      this.checkdiscountdepart = false;
    }
    this.departTicketSaleshow = this.departTicketSaleshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    //bind thông tin chiều về
    let re_date = this.returnObject.route.departure_date;
    se.returnDateTimeStr = 'Về ' + se.getDayOfWeek(re_date) + ', ' + moment(re_date).format('DD-MM-YYYY');
    se.returnTimeStr = this.listcars.TransferBooking.returnTransfer.DepartTime + ' → ' + this.listcars.TransferBooking.returnTransfer.ArrivalTime;
    se.returnVehicleStr = this.returnObject.company.name;
    this.returnTicketSaleshow = this.returnObject.route.schedules[0].fare.price - this.returnTicketSale;
    if (this.returnTicketSaleshow <= 0) {
      this.checkdiscountreturn = true;
      this.returnTicketSaleshow = Math.abs(this.returnTicketSaleshow);
    }
    else {
      this.checkdiscountreturn = false;
    }
    this.returnTicketSaleshow = this.returnTicketSaleshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
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
  CreateBuildLink(paymentType) {
    var se = this;
    if (paymentType == 'companycredit') {
      se.flightComboPayment();
    }
    else {
      se.gf.CheckPaymentDate(this.bookingCode).then(data => {
        var url = "";
        var totalPrice = se.priceshow.toString().replace(/\./g, '').replace(/\,/g, '');
        var timestamp = new Date();
        var paymentTime = moment(timestamp).format('YYYYMMDDHHmmss');
        var paymentDate = moment(data.booking.DeliveryPaymentDate).format('YYYYMMDDHHmmss');
        if (paymentTime < paymentDate) {
          if (paymentType == 'visa') {
            url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=visa&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' + this.Roomif.phone + '&memberId=' + se.jti + '&TokenId=' + se.tokenid + '&rememberToken=' + se.isremember + '&callbackUrl=' + C.urls.baseUrl.urlPayment + '/Home/BlankDeepLink';
          }
          else if (paymentType == 'bnpl') {
            url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=bnpl&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' + this.Roomif.phone + '&memberId=' + se.jti + '&TokenId=' + se.tokenid + '&rememberToken='+se.isremember+'&BankId=bnpl'+'&callbackUrl=' + C.urls.baseUrl.urlPayment + '/Home/BlankDeepLink';
          }
          else {
            url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=' + paymentType + '&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' + this.Roomif.phone + '&memberId=' + se.jti + '&callbackUrl=https://ivivudownload.page.link/ivivuapp';
          }
          this.gf.CreateUrl(url).then(dataBuildLink => {
            if (dataBuildLink.success) {
              if (paymentType == 'visa') {
                if (this.loader) {
                  this.loader.dismiss();
                }
                se.openWebpage(dataBuildLink.returnUrl);
              }
              else if (paymentType == 'payoo_store') {
                this.Roomif.BillingCode = dataBuildLink.payooStoreData.BillingCode;
                this.Roomif.PeriodPaymentDate = dataBuildLink.payooStoreData.periodPayment;
                if (this.loader) {
                  this.loader.dismiss();
                }
                this.navCtrl.navigateForward('combocarpaymentpayoonew/' + this.bookingCode + '/0');
              }
              else if (paymentType == 'payoo_qr') {
                if (dataBuildLink.success) {
                  this.Roomif.qrimg = dataBuildLink.payooQrData.QRCodeUrl;
                  if (this.loader) {
                    this.loader.dismiss();
                  }
                  this.navCtrl.navigateForward('combocarpaymentpayoonew/' + this.bookingCode + '/1');
                }
              }
              else if (paymentType == 'momo') {
                if (dataBuildLink.success) {
                  //se._windowmomo = window.open(dataBuildLink.returnUrl.payUrl, '_system');
                  Browser.open({url : dataBuildLink.returnUrl.payUrl});
                  this.setinterval();
                }
              }
            }
          })
        }
        else {
          if (paymentType == 'payoo_store') {
            url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=' + paymentType + '&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' + this.Roomif.phone + '&memberId=' + se.jti + '&callbackUrl=' + C.urls.baseUrl.urlPayment + '/Home/BlankDeepLink';
            this.gf.CreateUrl(url).then(dataBuildLink => {
              if (this.loader) {
                this.loader.dismiss();
              }
              this.Roomif.BillingCode = dataBuildLink.payooStoreData.BillingCode;
              this.Roomif.PeriodPaymentDate = dataBuildLink.payooStoreData.periodPayment;
              this.navCtrl.navigateForward('combocarpaymentpayoonew/' + this.bookingCode + '/0');
            })
          } else {
            se.checkpayment = "RQ";
            if (this.loader) {
              this.loader.dismiss();
            }
            alert('Đã hết phòng, vui lòng chọn phòng khác hoặc chọn phương thức thanh toán khác');
            se.navCtrl.navigateBack('combocarnew');
          }
        }
      })
    }

  }
  GeTokensOfMember(stt) {
    var se = this;
    se.gf.GeTokensOfMember(se.jti).then(dataTokens => {
      if (dataTokens) {
        if (dataTokens.tokens.length > 0) {
          this.arrbankrmb = [];
          for (let i = 0; i < dataTokens.tokens.length; i++) {
            if (dataTokens.tokens[i].vpc_Card == 'VC' || dataTokens.tokens[i].vpc_Card == 'MC' || dataTokens.tokens[i].vpc_Card == 'JC' || dataTokens.tokens[i].vpc_Card == 'AE') {
              var vpc_CardNum = dataTokens.tokens[i].vpc_CardNum.split('xxx');
              vpc_CardNum = vpc_CardNum[1];
              var cardname = this.getCardName(dataTokens.tokens[i].vpc_Card);
              var item = { id: dataTokens.tokens[i].id, imgbank: 'https://res.ivivu.com/payment/img/onepay/' + dataTokens.tokens[i].vpc_Card + '.png', vpc_CardNum: vpc_CardNum, name_Bank: cardname, checked: false };
              this.arrbankrmb.push(item);
            }
          }
          if (this.arrbankrmb.length > 0) {
            this.arrbankrmb[0].checked = true;
            this.tokenid = this.arrbankrmb[0].id;
            this.isdisable = true;
            this.isbtn = true;
            this.ischeckvisa = true
          }
        }
      }
      if (stt == 1) {
        if (this.arrbankrmb.length > 0) {
          this.ischeckvisa = true;
        } else {
          this.postapibook('visa');
        }
      }
    })
  }
  getCardName(text) {
    var cardStr = "";
    switch (text) {
      case "MC":
        cardStr = "Mastercard";
        break;
      case "VC":
        cardStr = "Visacard";
        break;
      case "JC":
        cardStr = "JCBCard";
        break;
      case "AE":
        cardStr = "AECard";
    }
    return cardStr;
  }
  setinterval() {
    clearInterval(this.intervalID);
    this.intervalID = setInterval(() => {
      this.checkPayment();
    }, 1000 * 1);
    setTimeout(() => {
      clearInterval(this.intervalID);
    }, 60000 * 15);
  }
  //check Payment
  checkPayment() {
    var se = this;
    let headers = {};
    let strUrl = C.urls.baseUrl.urlPost + '/mCheckBooking?code=' + se.bookingCode;
    this.gf.RequestApi('POST', strUrl, headers, {}, 'combolist', 'CreateCombo').then((data) => {
      if (data) {
        var rs = data;
        if (rs.StatusBooking == 3) {
          se.sttbooking = 3;
          var id = rs.BookingCode;
          var total = se.priceshow;
          se.Roomif.priceshowtt = se.priceshow;
          var ischeck = '0';
          Browser.close();
          if (se._windowmomo) {
            se._windowmomo.close();
          }
          clearInterval(se.intervalID);
          if (se.loader) {
            se.loader.dismiss();
          }
          se.navCtrl.navigateForward('/combodoneprepay/' + id + '/' + total + '/' + ischeck)
        }
        //9: khách hủy giao dịch 2:thanh toán thất bại (bao gồm case hết hạn thanh toán)
        else if (rs.StatusBooking == 9 || rs.StatusBooking == 2) {
          if (se.loader) {
            se.loader.dismiss();
          }
          clearInterval(se.intervalID);
          Browser.close();
          if (se.Roomif.point && se.bookingCode) {
            se.showInfo("Điểm tích luỹ " + se.Roomif.point + " đã được dùng cho booking " + se.bookingCode + ".Xin vui lòng thao tác lại booking!")
          }
          if (se.Roomif.promocode && se.bookingCode) {
            se.showInfo("Mã giảm giá " + se.Roomif.promocode + " đã được dùng cho booking " + se.bookingCode + ".Xin vui lòng thao tác lại booking!")
          }
        }
      }
      else {
        se.loader.dismiss();
        se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
      }

    });
  }
  chooseacc(item) {
    this.tokenid = item.id;
    this.isbtn = true;
    this.isdisable = true;
    this.isremember = true;
  }
  nochooseacc() {
    this.tokenid = "";
    this.isbtn = true;
    this.isdisable = false;
    this.isremember = true;
  }
  //thêm các phương thức thanh toán
  roompaymentpayoolive() {
    this.presentLoading();
    this.searchhotel.paymentType = 'payoo';
    this.postapibook('payoo_store');
  }
  roompaymentpayooqr() {
    this.presentLoading();
    this.searchhotel.paymentType = 'payoo';
    this.postapibook('payoo_qr');
  }
  roompaymentmomo() {
    this.presentLoading();
    this.searchhotel.paymentType = 'momo';
    this.postapibook('momo');
  }
  next() {
    this.presentLoading();
    this.searchhotel.paymentType = 'visa';
    this.postapibook('visa');
  }
  rememberCard() {
    this.isremember = !this.isremember
  }

  paymentbiztravel() {
    if (this.bizTravelService.bizAccount.balanceAvaiable - this.bookCombo.totalprice <= 0) {
      return;
    }
    this.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        var headers =
        {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
        }
        var params = { memberid: this.jti, totalprice: this.priceshow.toString().replace(/\./g, '').replace(/\,/g, '') };
        this.gf.checkAcceptBizCredit('POST', C.urls.baseUrl.urlMobile + '/api/Dashboard/CheckAcceptBizCredit', headers, params, 'companyinfo', 'GetBizTransactions').then((data) => {
          if (data && data.error == 0) {
            this.bizTravelService.phoneOtp = data.phoneOtp;
            this.bizTravelService.phoneOtpShort = data.phoneOtpShort;
            this.bizTravelService.paymentType = 3;
            this.presentLoading();
            this.postapibook('companycredit')
          } else {
            this.gf.showToastWarning('Account hiện tại không có quyền thanh toán. Vui lòng kiểm tra lại.');
          }
        })
      } else {

      }

    })
  }

  flightComboPayment() {
    var se = this;
    se.gf.showLoading();
    se.gf.CheckPaymentDate(se.bookingCode).then(data => {
      var timestamp = new Date();
      var temptime = timestamp.setTime(timestamp.getTime() + 15 * 60 * 1000);
      var paymentTime = moment(temptime).format('YYYYMMDDHHmmss');
      var paymentDate = moment(data.booking.DeliveryPaymentDate).format('YYYYMMDDHHmmss');
      if (paymentTime < paymentDate) {
        se.buildLinkPayment().then((checkvalid) => {
          if (checkvalid) {
            se.bizTravelService.routeBackWhenCancel = 'combocarnew';
            se.bizTravelService.mytripPaymentBookingCode = se.bookingCode;
            se.navCtrl.navigateForward('confirmpayment');
          }
        })
      } else {
        se.checkpayment = "RQ";
        se.gf.hideLoading();
        alert('Đã hết phòng, vui lòng chọn phòng khác hoặc chọn phương thức thanh toán khác');
        se.navCtrl.navigateBack('combocarnew');
      }
    })
  }

  buildLinkPayment(): Promise<any> {
    let se = this;
    return new Promise((resolve, reject) => {
      let url;
      var totalPrice = se.priceshow.toString().replace(/\./g, '').replace(/\,/g, '');
      url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=companycredit&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' + this.Roomif.phone + '&memberId=' + se.jti + '&callbackUrl=' + C.urls.baseUrl.urlPayment + '/Home/BlankDeepLink';
      se.gf.CreateUrl(url).then(dataBuildLink => {
        if (dataBuildLink.success) {
          se.gf.hideLoading();
          resolve(true);
        } else {
          se.gf.hideLoading();
          resolve(false);
        }
      })
    })
  }
  async showInfo(msg) {
    let alert = await this.alertCtrl.create({
      header: "Thông báo",
      message: msg,
      buttons: [{
        text: 'OK',
        role: 'OK',
        handler: () => {
          alert.dismiss();
          this.Roomif.promocode = "";
          this.navCtrl.navigateForward('/combocarnew');
        }
      }
      ]
    });
    alert.present();
  }
  checkDk() {
    this.ischeckedDK = !this.ischeckedDK;
  }
  async openWebpageDK(url: string) {
    var se = this;
    await Browser.open({ url: url});
  }

  flightbuynowpaylater(){
    this.searchhotel.paymentType = 'bnpl';
    this.postapibook('bnpl');
  }
}
