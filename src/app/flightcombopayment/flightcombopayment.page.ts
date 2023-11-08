import { FlightcombobookingdetailPage } from './../flightcombobookingdetail/flightcombobookingdetail.page';
import { Bookcombo } from './../providers/book-service';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController, Platform } from '@ionic/angular';
import { Booking, RoomInfo, SearchHotel, ValueGlobal } from '../providers/book-service';
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
  selector: 'app-flightcombopayment',
  templateUrl: './flightcombopayment.page.html',
  styleUrls: ['./flightcombopayment.page.scss'],
})
export class FlightcombopaymentPage implements OnInit {
  listfly; priceshow; Name; Avatar; cin; cout; adults; roomnumber; room; nameroom; breakfast; departDateTimeStr; returnDateTimeStr;
  departTimeStr; returnTimeStr; airlineCodedep; airlineCoderet; arrchild; textage = ""; children; timestamp;
  public loader: any; ischeckpaymentCard; ischeckpaymentLater; titlecombo; jti;
  scheckvisa = false; returnUrl; arrbankrmb:any = []; tokenid; startDate; endDate; ischeckpay = true; isbtn = false; ischeckvisa = false;
  intervalID: any; ischeckTransaction = false;
  _windowmomo: any;
  isremember=true;isdisable=false;
  ischeckedDK=true;
  constructor(public platform: Platform, public searchhotel: SearchHotel, public navCtrl: NavController,
    public storage: Storage, public Roomif: RoomInfo, public booking1: Booking,
    public booking: Booking, public authService: AuthService, public modalCtrl: ModalController, public loadingCtrl: LoadingController,
    public gf: GlobalFunction, public zone: NgZone, private router: Router, public bookCombo: Bookcombo, private valueGlobal: ValueGlobal,
    public bizTravelService: BizTravelService,
    public _voucherService: voucherService) {
    this.listfly = this.gf.getParams('flightcombo');
    this.priceshow = this.bookCombo.totalprice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    this.Name = booking.HotelName;
    this.Avatar = Roomif.imgHotel;
    this.cin = booking.CheckInDate;
    this.cout = booking.CheckOutDate;
    this.arrchild = this.searchhotel.arrchild;

    var cintemp = new Date(this.cin);
    var thu = moment(cintemp).format('dddd');
    var textthu = this.getDay(thu);
    this.cin = textthu + ', ' + moment(cintemp).format('DD') + ' ' + 'thg' + ' ' + moment(cintemp).format('MM')

    var couttemp = new Date(this.cout);
    var thu = moment(couttemp).format('dddd');
    var textthu = this.getDay(thu);
    this.cout = textthu + ', ' + moment(couttemp).format('DD') + ' ' + 'thg' + ' ' + moment(couttemp).format('MM')

    this.adults = booking.Adults;
    this.roomnumber = this.searchhotel.roomnumber;
    this.room = Roomif.arrroom;
    this.nameroom = this.room[0].ClassName;
    this.children = booking.Child;
    this.breakfast = this.bookCombo.MealTypeName;

    this.departDateTimeStr = this.bookCombo.de_departdatestr;
    this.returnDateTimeStr = this.bookCombo.ar_departdatestr;
    this.departTimeStr = this.bookCombo.departTimeStr;
    this.returnTimeStr = this.bookCombo.returnTimeStr;
    this.airlineCodedep = this.listfly.FlightBooking.departFlight.AirlineCode;
    this.airlineCoderet = this.listfly.FlightBooking.returnFlight.AirlineCode;
    this.titlecombo = this.valueGlobal.titlecombo;
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
    this.ischeckpaymentCard = this.Roomif.ischeckpaymentCard;
    this.ischeckpaymentLater = this.Roomif.ischeckpaymentLater  || this.bookCombo.roomPenalty;
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
        this.GeTokensOfMember(0);
      }
    })
    this.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
            let text = "Bearer " + auth_token;
            let headers =
                {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    authorization: text
                }

            this.gf.RequestApi('GET', C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo', headers, {}, 'flightcombopaymentselect', 'initpage').then((data)=>{
              if(data && data.bizAccount){
                this.zone.run(()=>{
                  this.bizTravelService.bizAccount = data.bizAccount;
                  this.bizTravelService.isCompany = true;
                })
               
              }else{
                this.bizTravelService.isCompany = false;
              }
            })
          }else{
            this.bizTravelService.isCompany = false;
          }
        });

    C.writePaymentLog("flightcombo", "paymentselect", "purchase", this.bookCombo.bookingcode);
    App.addListener('appUrlOpen', data => {
      this.setinterval();
    });
  }
  getDay(thu) {
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
  ngOnInit() {
  }
  roompaymentbank() {
    this.searchhotel.paymentType = 'banktransfer';
    this.navCtrl.navigateForward("/flightcombobank");
    //google analytic
    this.gf.googleAnalytion('roompaymentselect', 'roompaymentbankselect', '');
  }
  roompaymentatm() {
    this.searchhotel.paymentType = 'atm';
    this.navCtrl.navigateForward("/flightcombochosebank");
  }
  continuewBook(paymentType){
    var se = this;
    se.presentLoading();
    se.gf.CheckPaymentDate(se.bookCombo.bookingcode).then(data => {
      var paymentMethod = se.gf.funcpaymentMethod(paymentType);
      //data = JSON.parse(data);
      var timestamp = new Date();
      var temptime = timestamp.setTime(timestamp.getTime() + 15 * 60 * 1000);
      var paymentTime = moment(temptime).format('YYYYMMDDHHmmss');
      var paymentDate = moment(data.booking.DeliveryPaymentDate).format('YYYYMMDDHHmmss');
      if (paymentTime < paymentDate) {
        se.timestamp = Date.now();
        let strUrl = C.urls.baseUrl.urlContracting + '/api/toolsapi/UpdatePaymentMethod?HotelCode=' + se.bookCombo.bookingcode + '&paymentMethod=' + paymentMethod;
        this.gf.RequestApi('POST', strUrl, {}, {}, 'flightComboPayment', 'UpdatePaymentMethod').then((data)=>{
          if (se.bookCombo.DepartATCode && se.bookCombo.ReturnATCode) {
            se.NoTransaction(paymentType);
          }
          else {
            se.gf.holdTicketCombo(se.bookCombo.FlightCode, se.bookCombo.iddepart, se.bookCombo.idreturn).then(datafly => {
              if (datafly.depcode && datafly.retcode) {
                se.gf.createTransactionCombo(se.bookCombo.bookingcode, se.bookCombo.FlightCode, datafly.depcode, datafly.retcode).then(data => {
                  if (data) {
                    se.ischeckTransaction = true;
                    se.bookCombo.DepartATCode = datafly.depcode;
                    se.bookCombo.ReturnATCode = datafly.retcode;
                    // var url = C.urls.baseUrl.urlPayment + "/Home/PaymentAppComboflyios?code=" + se.bookCombo.bookingcode + "&timestamp=" + se.timestamp + "&cost=" + se.priceshow + "&DepartATCode=" + datafly.depcode + "&ReturnATCode=" + datafly.retcode + "&FlightCode=" + se.bookCombo.FlightCode + "&paymentType=0";
                    // se.openWebpage(url);
                    let url;
                    if (paymentType == 'visa') {
                      url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=' + paymentType + '&source=app&amount=' + se.priceshow.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + se.bookCombo.bookingcode + '&buyerPhone=' + se.listfly.HotelBooking.CPhone + '&memberId=' + se.jti + '&TokenId=' + se.tokenid + '&rememberToken='+se.isremember+'&callbackUrl=' + C.urls.baseUrl.urlPayment + '/Home/BlankDeepLink';
                    } 
                    else if (paymentType == 'bnpl') {
                      url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=' + paymentType + '&source=app&amount=' + se.priceshow.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + se.bookCombo.bookingcode + '&buyerPhone=' + se.listfly.HotelBooking.CPhone + '&memberId=' + se.jti + '&TokenId=' + se.tokenid + '&rememberToken='+se.isremember+'&BankId='+paymentType+'&callbackUrl=' + C.urls.baseUrl.urlPayment + '/Home/BlankDeepLink';
                    }
                    else {
                      url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=' + paymentType + '&source=app&amount=' + se.priceshow.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + se.bookCombo.bookingcode + '&buyerPhone=' + se.listfly.HotelBooking.CPhone + '&memberId=' + se.jti+ '&callbackUrl=https://ivivudownload.page.link/ivivuapp';
                    }

                    se.gf.CreateUrl(url).then(dataBuildLink => {
                      //dataBuildLink = JSON.parse(dataBuildLink);
                      if (dataBuildLink.success) {
                        if (paymentType == 'visa') {
                          se.openWebpage(dataBuildLink.returnUrl);
                        }
                        else if (paymentType == 'payoo_store') {
                          se.Roomif.BillingCode = dataBuildLink.payooStoreData.BillingCode;
                          se.Roomif.PeriodPaymentDate = dataBuildLink.payooStoreData.periodPayment;
                          if (se.loader) {
                            se.loader.dismiss();
                          }
                          se.navCtrl.navigateForward('flightcombopaymentpayoonew/' + se.bookCombo.bookingcode + '/0');
                        }
                        else if (paymentType == 'payoo_qr') {
                          if (dataBuildLink.success) {
                            se.Roomif.qrimg = dataBuildLink.payooQrData.QRCodeUrl;
                            if (se.loader) {
                              se.loader.dismiss();
                            }
                            se.navCtrl.navigateForward('flightcombopaymentpayoonew/' + se.bookCombo.bookingcode + '/1');
                          }
                        }
                        else if (paymentType == 'momo') {
                          if (dataBuildLink.success) {
                            //se._windowmomo = window.open(dataBuildLink.returnUrl.payUrl, '_system');
                            Browser.open({url : dataBuildLink.returnUrl.payUrl});
                            se.setinterval();
                          }
                        }
                      }
                    })
                  } else {
                    se.gf.showAlertMessageOnly('Gặp sự cố, vui lòng thử lại')
                  }
                })

              }
              else {
                if (se.loader) {
                  se.loader.dismiss();
                }
                if (paymentType == 'payoo_store') {
                  se.NoTransaction(paymentType);
                } else {
                  se.gf.showAlertMessageOnly("Vé máy bay không giữ được, vui lòng chọn lại vé khác!");
                  se.navCtrl.navigateForward('/flightcomboreviews')
                }
              }
            })
          }
        });
      } else {
        se.gf.showAlertMessageOnly('Đã hết thời hạn thanh toán, vui lòng thực hiện lại');
        se.navCtrl.navigateForward('/flightcomboreviews')
      }
    })
  }

  postapibook(paymentType) {
    var se = this;
    se.searchhotel.totalPrice = se.priceshow;
    se.searchhotel.paymentType = paymentType;
    if(se.bookCombo.mealTypeRates.Supplier == 'SERI' && se.bookCombo.mealTypeRates.HotelCheckDetailTokenInternal){
      //Check allotment trÆ°á»›c khi book
      se.gf.checkAllotmentSeri(
        se.booking.HotelId,
        se.bookCombo.mealTypeRates.RoomId,
        se.booking.CheckInDate,
        se.booking.CheckOutDate,
        se.bookCombo.mealTypeRates.TotalRoom,
        'SERI', se.bookCombo.mealTypeRates.HotelCheckDetailTokenInternal
        ).then((allow)=> {
          if(allow){
            se.continuewBook(paymentType);
          }else{
            if (se.loader) {
              se.loader.dismiss();
            }
            se.gf.showToastWarning('Hiện tại khách sạn đã hết phòng loại này.');
          }
        })
    }else{
      se.continuewBook(paymentType);
    }
  }
  roompaymentlive() {
    this.searchhotel.paymentType = 'office';
    this.navCtrl.navigateForward("/flightcombolive");
  }
  async openWebpage(url: string) {
    var se = this;
    se.gf.logEventFirebase(se.searchhotel.paymentType,se.searchhotel, 'flightcombopayment', 'add_payment_info', 'Combo');
    await Browser.open({ url: url});

    Browser.addListener('browserFinished', () => {
      if (se.loader) {
        se.loader.dismiss();
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
  checkPayment() {
    var se = this;
    //wait 5s
    var options = {
      method: 'GET',
      url: C.urls.baseUrl.urlPost + '/mCheckBooking',
      qs: { code: se.bookCombo.bookingcode },
      headers:
      {
      }
    };
    let headers = {};
        let strUrl = C.urls.baseUrl.urlPost + '/mCheckBooking?code='+ se.bookCombo.bookingcode;
        this.gf.RequestApi('GET', strUrl, headers, {}, 'flightComboPayment', 'mCheckBooking').then((data)=>{

        if (data) {
        var rs = data;
        if (rs.StatusBooking == 3) {
          var id = rs.BookingCode;
          var total = se.priceshow;
          se.Roomif.priceshowtt = se.priceshow;
          var ischeck = '0';
          //let url = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/" + se.bookCombo.FlightCode;
          Browser.close();
          if (se._windowmomo) {
            se._windowmomo.close();
          }
          clearInterval(se.intervalID)
          if (se.loader) {
            se.loader.dismiss();
          }
          se.navCtrl.navigateForward('/flightcombodoneprepay/' + id + '/' + total + '/' + ischeck)
          // se.callCheckHoldTicket(url).then((check) => {
          //   if (check) {
          //     se.navCtrl.navigateForward('/flightcombodoneprepay/' + id + '/' + total + '/' + ischeck)
          //   }
          //   else {
          //     se.navCtrl.navigateForward('/flightcombowarning')
          //   }
          // })

        }
        else if (rs.StatusBooking == 9 || rs.StatusBooking == 2) {
          if (se.loader) {
            se.loader.dismiss();
          }
          clearInterval(se.intervalID);
          Browser.close();
        }
      }
      else {
       
        se.loader.dismiss();
        se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
      }

    });
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      message: "Giao dịch đang xử lý, xin quý khách đợi trong giây lát!",
    });
    this.loader.present();
  }
  goback() {
    clearInterval(this.intervalID);
    this.navCtrl.navigateForward('/flightcomboreviews')
  }
  callCheckHoldTicket(url) {
    var res = false;
    return new Promise((resolve, reject) => {
      // var options = {
      //   method: 'GET',
      //   url: url,
      //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
      //   headers: {
      //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
      //     'Content-Type': 'application/json; charset=utf-8',
      //   },
      // };
      let headers = {
        "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          'Content-Type': 'application/json; charset=utf-8',
      };
        this.gf.RequestApi('GET', url, headers, {}, 'flightComboPayment', 'callCheckHoldTicket').then((data)=>{

        if (data) {
          let result = data;
          if (result.isRoundTrip) {//khứ hồi
            //Có mã giữ chỗ và trạng thái đã xuất vé cả 2 chiều thì trả về true - hoàn thành
            if (result.departFlight.atBookingCode != null && result.departFlight.atBookingCode.indexOf("T__") == -1 && result.returnFlight.atBookingCode != null && result.returnFlight.atBookingCode.indexOf("T__") == -1
              && result.departFlight.status == 4 && result.returnFlight.status == 4) {
              resolve(true);
            } else {
              resolve(false);
            }
          } else {//Có mã giữ chỗ và trạng thái đã xuất vé thì trả về true - hoàn thành
            if (result.departFlight.atBookingCode != null && result.departFlight.atBookingCode.indexOf("T__") == -1 && result.departFlight.status == 4) {
              resolve(true);
            } else {
              resolve(false);
            }
          }
        }
      })
    })
  }
  async showFlightDetail() {
    var se = this;
    const modal: HTMLIonModalElement =
      await se.modalCtrl.create({
        component: FlightcombobookingdetailPage,
        componentProps: {
          aParameter: true,
        },
        showBackdrop: true,
        backdropDismiss: true,

        cssClass: "modal-flight-booking-detail"
      });
    modal.present();
  }
  GeTokensOfMember(stt) {
    var se = this;
    se.gf.GeTokensOfMember(se.jti).then(dataTokens => {
      if (dataTokens) {
        if (dataTokens.tokens.length > 0) {
          this.arrbankrmb = [];
          for (let i = 0; i < dataTokens.tokens.length; i++) {
            if (dataTokens.tokens[i].vpc_Card == 'VC' || dataTokens.tokens[i].vpc_Card == 'MC' || dataTokens.tokens[i].vpc_Card == 'JC' || dataTokens.tokens[i].vpc_Card == 'AE') {
              // this.TokenId = dataTokens.tokens[i].id;
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
            this.isbtn = true;
            this.isdisable=true;
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
  NoTransaction(paymentType) {
    var se = this;
    let url;
    if (paymentType == 'visa') {
      url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=' + paymentType + '&source=app&amount=' + se.priceshow.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + se.bookCombo.bookingcode + '&buyerPhone=' + se.listfly.HotelBooking.CPhone + '&memberId=' + se.jti + '&TokenId=' + se.tokenid + '&rememberToken='+se.isremember+'&callbackUrl=' + C.urls.baseUrl.urlPayment + '/Home/BlankDeepLink';
    } else {
      url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=' + paymentType + '&source=app&amount=' + se.priceshow.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + se.bookCombo.bookingcode + '&buyerPhone=' + se.listfly.HotelBooking.CPhone + '&memberId=' + se.jti+ '&callbackUrl=https://ivivudownload.page.link/ivivuapp';
    }
    this.gf.CreateUrl(url).then(dataBuildLink => {
      if (dataBuildLink.success) {
        if (paymentType == 'visa') {
          se.openWebpage(dataBuildLink.returnUrl);
        }
        else if (paymentType == 'payoo_store') {
          this.Roomif.BillingCode = dataBuildLink.payooStoreData.BillingCode;
          this.Roomif.PeriodPaymentDate = dataBuildLink.payooStoreData.periodPayment;
          if (se.loader) {
            se.loader.dismiss();
          }
          this.navCtrl.navigateForward('flightcombopaymentpayoonew/' + se.bookCombo.bookingcode + '/0');
        }
        else if (paymentType == 'payoo_qr') {
          if (dataBuildLink.success) {
            this.Roomif.qrimg = dataBuildLink.payooQrData.QRCodeUrl;
            if (se.loader) {
              se.loader.dismiss();
            }
            this.navCtrl.navigateForward('flightcombopaymentpayoonew/' + se.bookCombo.bookingcode + '/1');
          }
        }
        else if (paymentType == 'momo') {
          if (dataBuildLink.success) {
            //window.open(dataBuildLink.returnUrl.payUrl, '_system');
            Browser.open({url : dataBuildLink.returnUrl.payUrl});
            this.setinterval();
          }
        }
      }

    })

  }
  setinterval() {
    clearInterval(this.intervalID);
    // this.searchhotel.backPage = "foodpaymentselect";
    // this.navCtrl.navigateBack('/app/tabs/tab1');
    this.intervalID = setInterval(() => {
      this.checkPayment();
    }, 1000 * 1);
    setTimeout(() => {
      clearInterval(this.intervalID);
    }, 60000 * 15);
  }
  //thêm các phương thức thanh toán
  roompaymentpayoolive() {
    this.searchhotel.paymentType = 'payoo';
    this.postapibook('payoo_store');
    // if (!this.ischeckTransaction) {
    //   this.postapibook('payoo_store');
    // } else {
    //   this.NoTransaction('payoo_store');
    // }
  }
  roompaymentpayooqr() {
    this.searchhotel.paymentType = 'payoo';
    this.postapibook('payoo_qr');
    // if (!this.ischeckTransaction) {
    //   this.postapibook('payoo_qr');
    // } else {
    //   this.NoTransaction('payoo_qr');
    // }
  }
  roompaymentmomo() {
    this.searchhotel.paymentType = 'momo';
    this.postapibook('momo');
    // if (!this.ischeckTransaction) {
    //   this.postapibook('momo');
    // } else {
    //   this.NoTransaction('momo');
    // }
  }
  chooseacc(item) {
    this.tokenid = item.id;
    this.isbtn = true;
    this.isdisable=true;
    this.isremember=true;
  }
  nochooseacc() {
    this.tokenid = "";
    this.isbtn = true;
    this.isdisable=false;
    this.isremember=true;
  }
  next() {
    this.searchhotel.paymentType = 'visa';
    this.postapibook('visa');
  }
  roompaymentvisa() {
    this.searchhotel.paymentType = 'visa';
    if (this.arrbankrmb.length==0) {
      this.GeTokensOfMember(1);
    }
    // if (!this.ischeckTransaction) {
    //   this.GeTokensOfMember(1);
    // } else {
    //   this.NoTransaction('visa');
    // }
  }
  rememberCard(){
    this.isremember=!this.isremember
  }

  paymentbiztravel(){
    if(this.bizTravelService.bizAccount.balanceAvaiable - this.bookCombo.totalprice <=0){
      return;
    }
    
    this.storage.get('auth_token').then(auth_token => {
      if(auth_token){
        var text = "Bearer " + auth_token;
        var  headers =
        {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        }
        var params = {memberid: this.jti, totalprice: this.priceshow.toString().replace(/\./g, '').replace(/\,/g, '') };
        this.gf.showLoading();
        this.gf.checkAcceptBizCredit('POST', C.urls.baseUrl.urlMobile + '/api/Dashboard/CheckAcceptBizCredit', headers, params, 'companyinfo', 'GetBizTransactions').then((data) => {
          if(data && data.error == 0){
            this.bizTravelService.phoneOtp = data.phoneOtp;
            this.bizTravelService.phoneOtpShort = data.phoneOtpShort;
            this.bizTravelService.paymentType = 3;
            this.flightComboPayment();
          }else{
            this.gf.showToastWarning('Account hiện tại không có quyền thanh toán. Vui lòng kiểm tra lại.');
          }
        })
      }else{

      }
     
    })
  }

  flightComboPayment(){
    var se =this;
      
      se.gf.CheckPaymentDate(this.bookCombo.bookingcode).then(data => {
          var timestamp = new Date();
          var temptime = timestamp.setTime(timestamp.getTime() + 15 * 60 * 1000);
          var paymentTime = moment(temptime).format('YYYYMMDDHHmmss');
          var paymentDate = moment(data.booking.DeliveryPaymentDate).format('YYYYMMDDHHmmss');
          if (paymentTime < paymentDate) {
            if (se.bookCombo.DepartATCode && se.bookCombo.ReturnATCode) {
              se.buildLinkPayment().then((checkvalid) => {
                if(checkvalid){
                  se.bizTravelService.routeBackWhenCancel = 'flightcomboreviews';
                  se.bizTravelService.mytripPaymentBookingCode = se.bookCombo.bookingcode;
                  se.navCtrl.navigateForward('confirmpayment');
                }
              })
            }
            else {
              se.gf.holdTicketCombo(se.bookCombo.FlightCode, se.bookCombo.iddepart, se.bookCombo.idreturn).then(datafly => {
                if (datafly.depcode && datafly.retcode) {
                  se.gf.createTransactionCombo(se.bookCombo.bookingcode, se.bookCombo.FlightCode, datafly.depcode, datafly.retcode).then(data => {
                    if (data) {
                      se.ischeckTransaction = true;
                      se.bookCombo.DepartATCode = datafly.depcode;
                      se.bookCombo.ReturnATCode = datafly.retcode;

                      se.buildLinkPayment().then((checkvalid) => {
                        if(checkvalid){
                          se.bizTravelService.routeBackWhenCancel = 'flightcomboreviews';
                          se.bizTravelService.mytripPaymentBookingCode = se.bookCombo.bookingcode;
                          se.navCtrl.navigateForward('confirmpayment');
                        }
                      })
                     
                    } else {
                      alert('Gặp sự cố, vui lòng thử lại');
                    }
                  })
  
                }
                else {
                  se.gf.hideLoading();
                  se.gf.showAlertMessageOnly("Vé máy bay không giữ được, vui lòng chọn lại vé khác!");
                  se.navCtrl.navigateForward('/flightcomboreviews')
                }
              })
            }
          }else{

          }
        })
  }

  buildLinkPayment(): Promise<any>{
    let se = this;
    return new Promise((resolve, reject) => {
    let url;
      url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=companycredit&source=app&amount=' + se.priceshow.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + se.bookCombo.bookingcode + '&buyerPhone=' + se.listfly.HotelBooking.CPhone + '&memberId=' + se.jti +'&callbackUrl=' + C.urls.baseUrl.urlPayment + '/Home/BlankDeepLink';
      se.gf.CreateUrl(url).then(dataBuildLink => {
        if (dataBuildLink.success) {
          se.gf.hideLoading();
          resolve(true);
        }else{
          se.gf.hideLoading();
          resolve(false);
        }
      })
    })
  }
  checkDk(){
    this.ischeckedDK=!this.ischeckedDK;
  }
  async openWebpageDK(url: string) {
    await Browser.open({ url: url});
  }

  flightbuynowpaylater(){
    this.postapibook('bnpl');
  }
}
