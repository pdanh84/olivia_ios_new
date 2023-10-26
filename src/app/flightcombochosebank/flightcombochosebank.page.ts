import { Booking, RoomInfo, SearchHotel } from '../providers/book-service';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { C } from '../providers/constants';

import { Storage } from '@ionic/storage';
import { GlobalFunction } from '../providers/globalfunction';
import { Bookcombo } from './../providers/book-service';
import * as moment from 'moment';
import { Browser } from '@capacitor/browser';


@Component({
  selector: 'app-flightcombochosebank',
  templateUrl: './flightcombochosebank.page.html',
  styleUrls: ['./flightcombochosebank.page.scss'],
})
export class FlightcombochosebankPage implements OnInit {

  ischeck; timestamp; public ischeckbox; listcars; id; book; priceshow; ischecktext
  public loader: any; hoten; phone; totalAdult; email;
  auth_token: any = ''; arrbankrmb:any = []; totalPrice = 0; bookingCode; isckb = false; TokenId; bankid = ""; jti; intervalID: NodeJS.Timeout;
  ischeckTransaction = false; listfly;
  isremember=true;isdisable=false;
  ischeckedDK=true;
  constructor(public navCtrl: NavController, private toastCtrl: ToastController, public booking: Booking,
    public Roomif: RoomInfo, public storage: Storage, public zone: NgZone, public searchhotel: SearchHotel,
    public loadingCtrl: LoadingController, public platform: Platform, public gf: GlobalFunction, public bookCombo: Bookcombo) {
    this.searchhotel.rootPage = "flightcombochosebank";
    this.listfly = this.gf.getParams('flightcombo');
    this.priceshow = this.bookCombo.totalprice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    this.totalPrice = this.priceshow.toString().replace(/\./g, '').replace(/\,/g, '');
    this.storage.get('email').then(e => {
      if (e !== null) {
        this.email = e;
      }
    })
    //google analytic
    gf.googleAnalytion('roomchoosebank', 'load', '');
  }
  ngOnInit() {
  }
  ionViewWillEnter() {
    this.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
    })
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
        this.GeTokensOfMember();
      }
    })
  }
  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: "Xin chọn 1 ngân hàng",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  async openWebpage(url: string) {
    var se = this;
    se.searchhotel.paymentType = 'atm';
    se.gf.logEventFirebase('atm',se.searchhotel, 'flightcomboatm', 'add_payment_info', 'Combo');
    await Browser.open({ url: url});

    Browser.addListener('browserFinished', () => {
      if(se.loader){
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
    let strUrl = C.urls.baseUrl.urlPost + '/mCheckBooking?code=' + se.bookCombo.bookingcode;
    this.gf.RequestApi('GET', strUrl, headers, {}, 'flightComboChooseBank', 'checkPayment').then((data)=>{
      if (data) {
        var rs = data;
        if (rs.StatusBooking == 3) {
          var id = rs.BookingCode;
          var total = se.priceshow;
          var ischeck = '0';
          se.Roomif.priceshowtt = se.priceshow;
          if (se.loader) {
            se.loader.dismiss();
          }
          Browser.close();
          //let url = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/" + se.bookCombo.FlightCode;
          clearInterval(se.intervalID);
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

  clickitem(id) {
    this.zone.run(() => {
      this.id = id;
      this.TokenId = "";
      this.isdisable=false;
      this.arrbankrmb.forEach(element => {
        element.checked = false;
      });
    })
  }
  edit() {
    this.zone.run(() => {
      if (this.ischeck) {
        this.ischecktext = true;
      } else {
        this.ischecktext = false;
      }
    })
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }
  goback() {
    this.navCtrl.back();
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
      this.gf.RequestApi('GET', url, headers, {}, 'flightComboChooseBank', 'callCheckHoldTicket').then((data)=>{

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
        
      })
    })
  }
  GeTokensOfMember() {
    var se = this;
    se.gf.GeTokensOfMember(se.jti).then(dataTokens => {
      if (dataTokens) {
        if (dataTokens.tokens.length > 0) {
          for (let i = 0; i < dataTokens.tokens.length; i++) {
            if (dataTokens.tokens[i].vpc_Card != 'VC' && dataTokens.tokens[i].vpc_Card != 'MC' && dataTokens.tokens[i].vpc_Card != 'JC' && dataTokens.tokens[i].vpc_Card != 'AE') {
              // this.TokenId = dataTokens.tokens[i].id;
              var vpc_CardNum = dataTokens.tokens[i].vpc_CardNum.split('xxx');
              vpc_CardNum = vpc_CardNum[1];
              var name_Bank = this.getnameBank(dataTokens.tokens[i].vpc_Card);
              var item = { id: dataTokens.tokens[i].id, imgbank: 'https://res.ivivu.com/payment/img/onepay/' + dataTokens.tokens[i].vpc_Card + '.png', vpc_CardNum: vpc_CardNum, name_Bank: name_Bank, checked: false, vpc_Card: dataTokens.tokens[i].vpc_Card };
              this.arrbankrmb.push(item);
            }
          }
          if (this.arrbankrmb.length > 0) {
            this.arrbankrmb[0].checked = true;
            this.isdisable=true;
            this.TokenId = this.arrbankrmb[0].id;
          }

          // item = { id: '999', imgbank: 'https://res.ivivu.com/payment/img/onepay/' + dataTokens.tokens[0].vpc_Card + '.png', vpc_CardNum: vpc_CardNum, name_Bank:name_Bank,checked:false};
          // this.arrbankrmb.push(item);
        }

      }
    })
  }
  getnameBank(text) {
    var cardStr = "";
    switch (text) {
      case "970436":
        cardStr = "VietcomBank";
        break;
      case "970412":
        cardStr = "VRBank";
        break;
      case "970407":
        cardStr = "TechcomBank";
        break;
      case "970423":
        cardStr = "TienPhongBank";
        break;
      case "970415":
        cardStr = "ViettinBank";
        break;
      case "970441":
        cardStr = "VIB";
        break;
      case "970406":
        cardStr = "DongABank";
        break;
      case "970437":
        cardStr = "HDBank";
        break;
      case "970422":
        cardStr = "MB";
        break;
      case "970427":
        cardStr = "VietABank";
        break;
      case "970426":
        cardStr = "MaritimeBank";
        break;
      case "970431":
        cardStr = "EximBank";
        break;
      case "970443":
        cardStr = "SHB";
        break;
      case "970432":
        cardStr = "VPBank";
        break;
      case "970425":
        cardStr = "AnBinhBank";
        break;
      case "970403":
        cardStr = "SacomBank";
        break;
      case "970428":
        cardStr = "NamABank";
        break;
      case "970414":
        cardStr = "OceanBank";
        break;
      case "970418":
        cardStr = "BIDV";
        break;
      case "970440":
        cardStr = "SeaBank";
        break;
      case "970409":
        cardStr = "BacABank";
        break;
      case "970419":
        cardStr = "NaviBank";
        break;
      case "970405":
        cardStr = "AgriBank";
        break;
      case "970429":
        cardStr = "SaigonBank";
        break;
      case "970454":
        cardStr = "VietCapital";
        break;
      default:
        break;
    }
    return cardStr;
  }
  CreateUrlOnePay(bankid) {
    var se = this;
    this.gf.CheckPaymentDate(this.bookCombo.bookingcode).then(data => {
      var timestamp=new Date();
      var temptime = timestamp.setTime(timestamp.getTime() + 15 * 60 * 1000);
      var paymentTime=moment(temptime).format('YYYYMMDDHHmmss');
      var paymentDate=moment(data.booking.DeliveryPaymentDate).format('YYYYMMDDHHmmss');
      if (paymentTime < paymentDate) {
        var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=atm&source=app&amount=' + se.totalPrice + '&orderCode=' + se.bookCombo.bookingcode + '&buyerPhone=' + se.listfly.HotelBooking.CPhone + '&memberId=' + se.jti + '&BankId=' + bankid + '&TokenId=' + se.TokenId + '&rememberToken='+se.isremember+'&callbackUrl=' + C.urls.baseUrl.urlPayment + '/Home/BlankDeepLink'
        this.gf.CreateUrl(url).then(datapayoo => {
          if (se.loader) {
            se.loader.dismiss();
          }
          se.openWebpage(datapayoo.returnUrl);
        })
      }
      else{
        alert('Đã hết thời hạn thanh toán, vui lòng thực hiện lại');
        se.navCtrl.navigateForward('/flightcomboreviews')
      }
    })
  }
  checkacc(item, ev) {
    var se = this;
    if (ev.target.checked) {
      se.arrbankrmb.forEach(element => {
        element.checked = false;
      });
      this.isdisable=true;
      this.isremember=true;
      item.checked = true;
      this.id = "";
    }
    else {
      item.checked = false;
      ev.target.checked = false;
      ev.target.classList.remove("radio-checked");
    }

  }
  postapibook(bankid) {
    this.gf.CheckPaymentDate(this.bookCombo.bookingcode).then(data => {
      var timestamp = new Date();
      var temptime = timestamp.setTime(timestamp.getTime() + 15 * 60 * 1000);
      var paymentTime = moment(temptime).format('YYYYMMDDHHmmss');
      var paymentDate = moment(data.booking.DeliveryPaymentDate).format('YYYYMMDDHHmmss');
      if (paymentTime < paymentDate) {
        var se = this;
        se.timestamp = Date.now();
        // var options = {
        //   'method': 'POST',
        //   'url': C.urls.baseUrl.urlContracting + '/api/toolsapi/UpdatePaymentMethod?HotelCode=' + se.bookCombo.bookingcode + '&paymentMethod=0',
        //   'headers': {
        //   }
        // };
        let headers = {};
        let strUrl = C.urls.baseUrl.urlContracting + '/api/toolsapi/UpdatePaymentMethod?HotelCode=' + se.bookCombo.bookingcode + '&paymentMethod=0';
        this.gf.RequestApi('POST', strUrl, headers, {}, 'flightComboDonePrepay', 'postapibook').then((data)=>{

          if (se.bookCombo.DepartATCode && se.bookCombo.ReturnATCode) {
            se.CreateUrlOnePay(bankid);
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
                    var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=atm&source=app&amount=' + se.totalPrice + '&orderCode=' + se.bookCombo.bookingcode + '&buyerPhone=' + se.listfly.HotelBooking.CPhone + '&memberId=' + se.jti + '&BankId=' + bankid + '&TokenId=' + se.TokenId + '&rememberToken='+se.isremember+'&callbackUrl=' + C.urls.baseUrl.urlPayment + '/Home/BlankDeepLink'
                    se.gf.CreateUrl(url).then(dataBuildLink => {
                      if (dataBuildLink.success) {
                        if (se.loader) {
                          se.loader.dismiss();
                        }
                        se.openWebpage(dataBuildLink.returnUrl);
                      }
                    })
                  } else {
                    alert('Gặp sự cố, vui lòng thử lại')
                  }
                })

              }
              else {
                if (se.loader) {
                  se.loader.dismiss();
                }
                se.gf.showAlertMessageOnly("Vé máy bay không giữ được, vui lòng chọn lại vé khác!");
                se.navCtrl.navigateForward('/flightcomboreviews')
              }
            })
          }

        });
      }
      else{
        alert('Đã hết thời hạn thanh toán, vui lòng thực hiện lại');
        this.navCtrl.navigateForward('/flightcomboreviews')
      }
    });
  }
  next() {
    this.TokenId = "";
    this.bankid = "";
    this.arrbankrmb.forEach(element => {
      if (element.checked) {
        this.TokenId = element.id;
        this.bankid = element.vpc_Card;
      }
    });
    let _id = this.bankid;
    if (this.TokenId) {
     _id = this.bankid;
    }
    else {
      if (this.id) {
       _id = this.id;
      } else {
        this.presentToast();
        return;
      }
    }

    this.presentLoading();
    let se = this;
    if(se.bookCombo.mealTypeRates.Supplier == 'SERI' && se.bookCombo.mealTypeRates.HotelCheckDetailTokenInternal){
      //Check allotment trước khi book
      se.gf.checkAllotmentSeri(
        se.booking.HotelId,
        se.bookCombo.mealTypeRates.RoomId,
        se.booking.CheckInDate,
        se.booking.CheckOutDate,
        se.bookCombo.mealTypeRates.TotalRoom,
        'SERI', se.bookCombo.mealTypeRates.HotelCheckDetailTokenInternal
        ).then((allow)=> {
          if(allow){
            if (se.ischeckTransaction) {
              se.CreateUrlOnePay(_id);
            } else {
              se.postapibook(_id);
            }
          }else{
            if (se.loader) {
              se.loader.dismiss();
            }
            se.gf.showToastWarning('Hiện tại khách sạn đã hết phòng loại này.');
          }
        })
    }else{
      if (se.ischeckTransaction) {
        se.CreateUrlOnePay(_id);
      } else {
        se.postapibook(_id);
      }
    }
  }
  rememberCard(){
    this.isremember=!this.isremember
  }
  checkDk(){
    this.ischeckedDK=!this.ischeckedDK;
  }
  async openWebpageDK(url: string) {
    await Browser.open({ url: url});
  }
}