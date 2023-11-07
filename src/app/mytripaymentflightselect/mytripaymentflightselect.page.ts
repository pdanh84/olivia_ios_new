import { Component, OnInit, NgZone } from '@angular/core';
import { ActivityService, GlobalFunction } from './../providers/globalfunction';
import { Storage } from '@ionic/storage';
import { NavController, LoadingController } from '@ionic/angular';

import { C } from '../providers/constants';
import { flightService } from '../providers/flightService';
import { ValueGlobal } from '../providers/book-service';
import { MytripService } from '../providers/mytrip-service.service';
import { BizTravelService } from '../providers/bizTravelService';
import * as moment from 'moment';
import { Browser } from '@capacitor/browser';
@Component({
  selector: 'app-mytripaymentflightselect',
  templateUrl: './mytripaymentflightselect.page.html',
  styleUrls: ['./mytripaymentflightselect.page.scss'],
})
export class MytripaymentflightselectPage implements OnInit {

  departCity; departCode; checkInDisplayFullYear; returnCity; returnCode; checkOutDisplayFullYear; totalPaxStr
  public loader: any; returnUrl; arrbankrmb:any = []; tokenid
  bookingCode = ""; startDate; endDate; ischeckpay = true; jti; isbtn = false;
  adult: any;
  child: any;
  totalpricedisplay: any;
  departtitle: string;
  returntitle: string;
  showline: boolean;
  paymentfirst: boolean = false;
  blockPaylate: any;
  blockPayCard: any;
  intervalID: any;
  itemflight: any;
  infant: any;
  allowCheckHoldTicket: boolean = true;
  ischeckvisa = false;
  isremember = true; isdisable = false; cus_phone;
  _windowmomo: any;
  totalPrice: any;
  ischeckedDK=true;
  dataServiceFee:any = [];
  dataSF: any;
  constructor(public activityService: ActivityService, public gf: GlobalFunction, private navCtrl: NavController, public storage: Storage, public loadingCtrl: LoadingController, private _flightService: flightService, private zone: NgZone,
    public valueGlobal: ValueGlobal,
    public _mytripservice: MytripService,
    public bizTravelService: BizTravelService) {
    this.departCity = this.activityService.objPaymentMytrip.trip.flightFrom;
    this.departCode = this.activityService.objPaymentMytrip.trip.bookingsComboData[0].departCode;
    this.checkInDisplayFullYear = this.activityService.objPaymentMytrip.trip.checkInDisplay;
    if (this.activityService.objPaymentMytrip.trip.flightTo) {
      this.returnCity = this.activityService.objPaymentMytrip.trip.flightTo;
      this.returnCode = this.activityService.objPaymentMytrip.trip.bookingsComboData[0].arrivalCode;

    }
    if (this.activityService.objPaymentMytrip.trip.checkOutDisplay) {
      this.checkOutDisplayFullYear = this.activityService.objPaymentMytrip.trip.checkOutDisplay;
    }
    this.totalPaxStr = this.activityService.objPaymentMytrip.trip.totalPaxStr;
    if (this.activityService.objPaymentMytrip.trip.priceShow) {
      this.totalpricedisplay = this.activityService.objPaymentMytrip.trip.priceShow.toString().replace(/\./g, '').replace(/\,/g, '');
      
    }else{
      this.totalpricedisplay = this.activityService.objPaymentMytrip.trip.totalpricedisplay.toString().replace(/\./g, '').replace(/\,/g, '');
    }
    this.bookingCode = this.activityService.objPaymentMytrip.trip.booking_id;
    this.cus_phone = this.activityService.objPaymentMytrip.trip.cus_phone;
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
        this.GeTokensOfMember(0);
      }
    })

    this.loadCheckPayment();
      if (this.activityService.objPaymentMytrip.trip.priceShow) {
        this.totalPrice = this.activityService.objPaymentMytrip.trip.priceShow.toString().replace(/\./g, '').replace(/\,/g, '');
        
      }else{
        this.totalPrice = this.activityService.objPaymentMytrip.trip.totalpricedisplay.toString().replace(/\./g, '').replace(/\,/g, '');
      }
    this.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
            let text = "Bearer " + auth_token;
            let headers =
                {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    authorization: text
                }

            this.gf.RequestApi('GET', C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo', headers, {}, 'flightpaymentselect', 'initpage').then((data)=>{
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

        if(this.activityService.objPaymentMytrip.trip.booking_type != "CB_FLY_HOTEL"){
          //pdanh 20-07-2023: call api tính phí dịch vụ
          let url = `${C.urls.baseUrl.urlMobile}/api/Data/getaddonpaymentfee?applyFor=vmb&totalPrice=${this.totalPrice}`;
          this.gf.RequestApi('GET', url, {}, {}, 'flightpaymentselect', 'getaddonpaymentfee').then((data)=>{
            if(data && data.length>0){
              this.dataServiceFee = data.filter(d => {return d.applyFor == 'vmb'});
              console.log(this.dataServiceFee);
              let atmsf = this.dataServiceFee.filter(d => {return d.levelService == 'atm'});
              let vssf = this.dataServiceFee.filter(d => {return d.levelService == 'visa'});
              let jcbsf = this.dataServiceFee.filter(d => {return d.levelService == 'jcb'});
              let amexsf = this.dataServiceFee.filter(d => {return d.levelService == 'amex'});
              let alepaysf = this.dataServiceFee.filter(d => {return d.levelService == 'alepay'});
              let momosf = this.dataServiceFee.filter(d => {return d.levelService == 'momo'});
              let bnplsf = this.dataServiceFee.filter(d => {return d.levelService == 'bnpl'});
              let payoo_qrsf = this.dataServiceFee.filter(d => {return d.levelService == 'payoo_qr'});
              let payoo_storesf = this.dataServiceFee.filter(d => {return d.levelService == 'payoo_store'});
        
              this.dataSF = this.dataServiceFee && this.dataServiceFee.length >0 ? {} : null;
              this.dataSF.atmSF = atmsf && atmsf.length >0 ? atmsf[0] : null;
              this.dataSF.vsSF = vssf && vssf.length >0 ? vssf[0] : null;
              this.dataSF.jcbSF = jcbsf && jcbsf.length >0 ? jcbsf[0] : null;
              this.dataSF.amexSF = amexsf && amexsf.length >0 ? amexsf[0] : null;
              this.dataSF.alepaySF = alepaysf && alepaysf.length >0 ? alepaysf[0] : null;
              this.dataSF.momosSF = momosf && momosf.length >0 ? momosf[0] : null;
              this.dataSF.bnplSF = bnplsf && bnplsf.length >0 ? bnplsf[0] : null;
              this.dataSF.payoo_qrSF = payoo_qrsf && payoo_qrsf.length >0 ? payoo_qrsf[0] : null;
              this.dataSF.payoo_storesSF = payoo_storesf && payoo_storesf.length >0 ? payoo_storesf[0] : null;
            }
          
          })
        }
  }
  async loadCheckPayment(){
    //luồng CityHotel ko gọi lại updatepayment
    if(this.activityService.objPaymentMytrip.trip && this.activityService.objPaymentMytrip.trip.booking_type != "CB_FLY_HOTEL"){
      let datacheck = await this.gf.checkAllowPayment(this.bookingCode);
      this.blockPayCard = datacheck.response.blockPaymentCard;
      this.blockPaylate = datacheck.response.blockPaymentLate;
    }
  }
  ngOnInit() {
  }
  GeTokensOfMember(stt) {
    var se = this;
    se.gf.GeTokensOfMember(se.jti).then(dataTokens => {
      if (dataTokens) {
        //dataTokens = JSON.parse(dataTokens);
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
          //this.presentLoading();
          if (this.bookingCode) {
            this.NoCreateBooking();
          }
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
  flightpaymentvisa() {
    this.presentLoading();
    this.checkAllowRepay().then((check) => {
      if (check) {
        clearInterval(this.intervalID);
        this.GeTokensOfMember(1);
      } else {
        this.gobackHome();
      }
    })
  }
  flightpaymentatm() {
    this.presentLoading();
    this.checkAllowRepay().then((check) => {
      if (check) {
        clearInterval(this.intervalID);
        this.navCtrl.navigateForward('/mytripaymentflightbank');
        this.hideLoading();
      } else {
        this.gobackHome();
      }
    })
  }
  flightpaymentmomo() {
    this.presentLoading();
    var totalPrice = this.totalpricedisplay.toString().replace(/\./g, '').replace(/\,/g, '');
    this.checkAllowRepay().then((check) => {
      if (check) {
        clearInterval(this.intervalID);

        this.gf.updatePaymentMethodNew(this.bookingCode, 4, "", "").then(datatype => {
          if (datatype && datatype.isHoldSuccess) {
            this._flightService.itemFlightCache.periodPaymentDate = datatype.periodPaymentDate;
            //let itemcache = this._flightService.itemFlightCache;
            var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=momo&source=app&amount=' + totalPrice + '&orderCode=' + this.bookingCode + '&buyerPhone=' + this.cus_phone + '&callbackUrl=https://ivivudownload.page.link/ivivuapp';
            this.gf.CreatePayoo(url).then(datapayoo => {
              if (datapayoo.success) {
                //this._windowmomo = window.open(datapayoo.returnUrl.payUrl, '_system');
                Browser.open({url : datapayoo.returnUrl.payUrl});
                this.setinterval(null);
                this.hideLoading();

              } else {
                this.hideLoading();
                this.gf.showAlertMessageOnly("Rất tiếc, vé máy bay đã hết hạn thanh toán");
              }
            })
          } else {
            this.gf.showAlertMessageOnly("Rất tiếc, vé máy bay đã hết hạn thanh toán");
            clearInterval(this.intervalID);
            this.hideLoading();
          }
        })
      } else {
        this.gobackHome();
      }
    })
  }
  flightpaymentpayooqr() {
    this.presentLoading();
    var totalPrice = this.totalpricedisplay.toString().replace(/\./g, '').replace(/\,/g, '');
    this.checkAllowRepay().then((check) => {
      if (check) {

        this.gf.updatePaymentMethodNew(this.bookingCode, 6, "", "").then(datatype => {
          if (datatype && datatype.isHoldSuccess) {
            // let itemcache = this._flightService.itemFlightCache;
            this._flightService.itemFlightCache.periodPaymentDate = datatype.periodPaymentDate;
            var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=payoo_qr&source=app&amount=' + totalPrice + '&orderCode=' + this.bookingCode + '&buyerPhone=' + this.cus_phone;
            this.gf.CreatePayoo(url).then(datapayoo => {
              this.hideLoading();
              if (datapayoo.success) {
                this._flightService.itemFlightCache.qrimg = datapayoo.payooQrData.QRCodeUrl;
                this.navCtrl.navigateForward('mytripaymentflightpayoo/' + this.bookingCode + '/1');
              } else {
                this.hideLoading();
                this.gf.showAlertMessageOnly("Rất tiếc, vé máy bay đã hết");
              }
            })
          } else {
            this.gf.showAlertMessageOnly("Rất tiếc, vé máy bay đã hết");
            clearInterval(this.intervalID);
            this.hideLoading();
          }
        })
      }
      else {
        this.gobackHome();
      }
    })
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }
  checkAllowRepay() {
    var se = this;
    return new Promise((resolve, reject) => {
      se.callCheckHoldTicket().then((check) => {
        let databkg = se._flightService.itemFlightCache.dataSummaryBooking;
        //trả trước
        if (databkg.isRoundTrip) {//khứ hồi
          //Có mã giữ chỗ và trạng thái đã xuất vé cả 2 chiều thì trả về true - hoàn thành
          if (databkg.departFlight.atBookingCode != null && databkg.departFlight.atBookingCode.indexOf("T__") == -1
            && databkg.returnFlight.atBookingCode != null && databkg.returnFlight.atBookingCode.indexOf("T__") == -1
            && databkg && !databkg.expIssueTicket && databkg.urlPaymentAgain) {
            resolve(true);
          }
          else {
            resolve(false);
          }
        } else {//Có mã giữ chỗ và trạng thái đã xuất vé thì trả về true - hoàn thành
          if (databkg.departFlight.atBookingCode != null && databkg.departFlight.atBookingCode.indexOf("T__") == -1
            && databkg && !databkg.expIssueTicket && databkg.urlPaymentAgain) {
            resolve(true);
          }
          else {
            resolve(false);
          }
        }

      })
    })

  }
  callCheckHoldTicket() {
    var res = false;
    var se = this;
    return new Promise((resolve, reject) => {
      // var options = {
      //   method: 'GET',
      //   url: C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/" + this.bookingCode,
      //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
      //   headers: {
      //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
      //     'Content-Type': 'application/json; charset=utf-8',
      //   },
      // };
      let urlPath = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+se.bookingCode;
        let headers = {
          "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          'Content-Type': 'application/json; charset=utf-8',
        };
        this.gf.RequestApi('GET', urlPath, headers, { }, 'MytripPaymentFlightSelect', 'callCheckHoldTicket').then((data)=>{

        if (data) {
          let result = data;
          if (se._flightService) {
            se._flightService.itemFlightCache.dataSummaryBooking = result;
          }

          //Thêm case check thanh toán thành công nhưng quá hạn giữ vé
          if (result.expIssueTicket) {
            se.allowCheckHoldTicket = false;
            resolve(false);
          } else {
            //trả trước

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


        }
      })


    })
  }
  async hideLoading() {
    if (this.loader) {
      this.loader.dismiss();
    }
  }
  goback(){
    if (this._mytripservice.backroute == "order") {
        this.navCtrl.navigateForward(['/app/tabs/tab3']);
      }
      else{
        this.navCtrl.navigateForward('mytripdetail', {animated: true});
      }
  }
  NoCreateBooking() {
    var se = this;
    var totalPrice = this.totalpricedisplay.toString().replace(/\./g, '').replace(/\,/g, '');
    //se.presentLoading();
    se.gf.updatePaymentMethodNew(this.bookingCode, 3, "", "").then(datatype => {
      if (datatype && datatype.isHoldSuccess) {
        //se.gf.holdTicket(this._flightService.itemFlightCache);
        se._flightService.itemFlightCache.periodPaymentDate = datatype.periodPaymentDate;
        //let itemcache = se._flightService.itemFlightCache;
        let url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=visa&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' + this.cus_phone + '&memberId=' + se.jti + '&TokenId=' + se.tokenid + '&callbackUrl=' + C.urls.baseUrl.urlPayment + '/Home/BlankDeepLink';
        se.gf.CreatePayoo(url).then(datapayoo => {
          if (datapayoo.success) {
            se._flightService.itemFlightCache.ischeckpayment = 1;
            se.openWebpage(datapayoo.returnUrl);
            se.setinterval(null);
          } else {
            se.gf.showAlertMessageOnly("Rất tiếc, vé máy bay đã hết");
            se.hideLoading();
          }

        })
      } else {
        se.gf.showAlertMessageOnly("Rất tiếc, vé máy bay đã hết");
        clearInterval(se.intervalID);
        se.hideLoading();
      }
    })
  }
  setinterval(timeout) {
    // if (this.loader) {
    //   this.loader.dismiss();
    // }
    clearInterval(this.intervalID);
    this.intervalID = setInterval(() => {
      let url = C.urls.baseUrl.urlFlight + "gate/apiv1/PaymentCheck?id=" + this.bookingCode;
      this.zone.run(() => {
        if(this.activityService.objPaymentMytrip.trip && this.activityService.objPaymentMytrip.trip.booking_type == 'CB_FLY_HOTEL'){
          this.checkComboHotelCityPayment();
        }
        else{
          this.gf.Checkpayment(url).then((data) => {
            var checkpay = data;
            if (checkpay.ipnCall == "CALLED_OK") {
              this._flightService.itemFlightCache.ischeckpayment = 1;
              this.hideLoading();
              this.gf.hideLoading();
              clearInterval(this.intervalID);
              Browser.close();
              this.gf.getSummaryBooking(this._flightService.itemFlightCache).then((databkg: any) => {
                this._flightService.itemFlightCache.dataSummaryBooking = databkg;
              })
              this.navCtrl.navigateForward('/mytripaymentflighdone');
            }
            else if (checkpay.ipnCall == "CALLED_TIMEOUT" || checkpay.ipnCall == "CALLED_FAIL")//case timeout
            {
              this.hideLoading();
              this.gf.hideLoading();
              Browser.close();
              clearInterval(this.intervalID);
              this._flightService.paymentError = checkpay;
              this.navCtrl.navigateForward('/flightpaymenttimeout/1');
            }
          })
        }
      })

    }, 2000);

    setTimeout(() => {
      clearInterval(this.intervalID);
    }, timeout ? timeout : (60000 * 10.5));
  }
  async openWebpage(url: string) {
    var se = this;
    await Browser.open({ url: url});

    Browser.addListener('browserFinished', () => {
    if(!se.activityService.objPaymentMytrip.trip && this.activityService.objPaymentMytrip.trip.booking_type == 'CB_FLY_HOTEL'){
      let url = C.urls.baseUrl.urlFlight + "gate/apiv1/PaymentCheck?id=" + se.bookingCode;
      se.gf.Checkpayment(url).then((datapayment) => {
        let checkpay = datapayment;
        if (checkpay.ipnCall == "CALLED_OK") {
          se._flightService.itemFlightCache.ischeckpayment = 1;
          se.hideLoading();
          se.gf.hideLoading();
          clearInterval(se.intervalID);
          se.gf.getSummaryBooking(se._flightService.itemFlightCache).then((databkg: any) => {
            se._flightService.itemFlightCache.dataSummaryBooking = databkg;
          })
          se.navCtrl.navigateForward('mytripaymentflighdone');
        }
        else {
          se.hideLoading();
          se.gf.hideLoading();
          clearInterval(se.intervalID);
          se._flightService.paymentError = checkpay;
          se.navCtrl.navigateForward('/flightpaymenttimeout/1');
        }
      })
    }else{
      se.checkComboHotelCityPayment();
    }
    });

  }

  checkComboHotelCityPayment() {
    var se = this;
    let strUrl = C.urls.baseUrl.urlPost + '/mCheckBooking?code=' +se.bookingCode;
    let headers =  {};
    se.gf.RequestApi('GET', strUrl, headers, {}, 'combocarpaymentpayoonew', 'checkPayment').then((rs) => {
      if(rs){
        if (rs.StatusBooking == 3 && !rs.error) {
            se.hideLoading();
            se.gf.hideLoading();
            clearInterval(se.intervalID);
            Browser.close()
            se.navCtrl.navigateForward('mytripaymentflighdone');
        }
        else if(rs.error || rs.StatusBooking == 9){
          se.hideLoading();
          se.gf.hideLoading();
          Browser.close();
          clearInterval(se.intervalID);
          se._flightService.paymentError = rs.error;
          se.navCtrl.navigateForward('/flightpaymenttimeout/0');
        }
      }
      else {
        se.hideLoading();
        se.gf.hideLoading();
        Browser.close();
        clearInterval(se.intervalID);
        se._flightService.paymentError = rs.error;
        se.navCtrl.navigateForward('/flightpaymenttimeout/0');
      }

    });
  }

  getSummaryBooking(): Promise<any> {
    var se = this;
    return new Promise((resolve, reject) => {
      // var options = {
      //   method: 'GET',
      //   url: C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/" + this.bookingCode,
      //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
      //   headers: {
      //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
      //     'Content-Type': 'application/json; charset=utf-8',
      //   },
      // };
      let urlPath = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+se.bookingCode;
        let headers = {
          "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          'Content-Type': 'application/json; charset=utf-8',
        };
        this.gf.RequestApi('GET', urlPath, headers, { }, 'MytripPaymentFlightSelect', 'getSummaryBooking').then((data)=>{

        if (data) {
          resolve(data);
        }
      })
    })
  }
  next() {
    this.presentLoading();
    if(this.activityService.objPaymentMytrip.trip && this.activityService.objPaymentMytrip.trip.booking_type == 'CB_FLY_HOTEL'){
      let se = this;
      let totalPrice = this.totalpricedisplay.toString().replace(/\./g, '').replace(/\,/g, '');
      let url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=visa&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' + this.cus_phone + '&memberId=' + se.jti + '&TokenId=' + se.tokenid + '&callbackUrl=' + C.urls.baseUrl.urlPayment + '/Home/BlankDeepLink';
        se.gf.CreatePayoo(url).then(datapayoo => {
          //datapayoo = JSON.parse(datapayoo);
          if (datapayoo.success) {
            se._flightService.itemFlightCache.ischeckpayment = 1;
            se.openWebpage(datapayoo.returnUrl);
            se.setinterval(null);

            se.hideLoading();
          } else {
            this.gf.showAlertMessageOnly("Rất tiếc, vé máy bay đã hết");
            se.hideLoading();
          }

        })
    }else{
      this.checkAllowRepay().then((check) => {
        if (check) {
          clearInterval(this.intervalID);
          this.NoCreateBooking();
        } else {
          this.gobackHome();
        }
      })
    }
  }
  rememberCard() {
    this.isremember = !this.isremember
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
  gobackHome() {
    this.gf.showAlertMessageOnly("Rất tiếc, vé máy bay đã hết hạn thanh toán");
    if (this.loader) {
      this.loader.dismiss();
    }
    clearInterval(this.intervalID);
    this._flightService.itemTabFlightActive.emit(true);
    this.valueGlobal.backValue = "homeflight";
    this._flightService.itemMenuFlightClick.emit(2);
    this.navCtrl.navigateBack(['/app/tabs/tab1']);
  }

  paymentbiztravel(){
    if(this.bizTravelService.bizAccount.balanceAvaiable - this.totalPrice <=0){
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
        var params = {memberid: this.jti, totalprice: this.totalPrice };
        this.gf.showLoading();
        this.gf.checkAcceptBizCredit('POST', C.urls.baseUrl.urlMobile + '/api/Dashboard/CheckAcceptBizCredit', headers, params, 'companyinfo', 'GetBizTransactions').then((data) => {
          if(data && data.error == 0){
            this.bizTravelService.phoneOtp = data.phoneOtp;
            this.bizTravelService.phoneOtpShort = data.phoneOtpShort;
            this.bizTravelService.paymentType = 4;
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
      se.gf.CheckPaymentDate(this.bookingCode).then(data => {
          var timestamp = new Date();
          var temptime = timestamp.setTime(timestamp.getTime() + 15 * 60 * 1000);
          var paymentTime = moment(temptime).format('YYYYMMDDHHmmss');
          var paymentDate = moment(data.booking.DeliveryPaymentDate).format('YYYYMMDDHHmmss');
          if (paymentTime < paymentDate) {
            se.buildLinkPaymentFlight().then((checkvalid) => {
              if(checkvalid){
                se.bizTravelService.routeBackWhenCancel = 'mybooking';
                se.bizTravelService.mytripPaymentBookingCode = se.bookingCode;
                se.navCtrl.navigateForward('confirmpayment');
              }
            })
          }else{

          }
        })
  }

  buildLinkPaymentFlight(): Promise<any>{
    let se = this;
    return new Promise((resolve, reject) => {
    let url;
      url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=companycredit&source=app&amount=' + this.totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' +this.cus_phone + '&memberId=' + se.jti +'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink';
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
    var se = this;
    var totalPrice=se.totalpricedisplay.toString().replace(/\./g, '').replace(/\,/g, '');
    let url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=bnpl&source=app&amount=' + totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' +se.cus_phone + '&memberId=' + se.jti + '&TokenId='+se.tokenid+'&BankId=bnpl'+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink';
    se.gf.CreatePayoo(url).then(datapayoo => {
    if(datapayoo.success){
      se._flightService.itemFlightCache.periodPaymentDate = datapayoo.periodPaymentDate;
      se._flightService.itemFlightCache.ischeckpayment = 1;
      se.openWebpage(datapayoo.returnUrl);
      se.setinterval(null);
      }else{
        se.gf.showAlertOutOfTicketFromMytrip(se._flightService.itemFlightCache, 2);
        se.hideLoading();
      }
                    
    })
  }
}
