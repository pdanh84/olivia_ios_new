
import { Bookcombo, foodInfo } from './../../providers/book-service';
import { Booking, RoomInfo, SearchHotel } from '../../providers/book-service';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController, Platform } from '@ionic/angular';
import { C } from '../../providers/constants';

import { Storage } from '@ionic/storage';

import { ActivityService, GlobalFunction } from '../../providers/globalfunction';
import { flightService } from '../../providers/flightService';
import * as moment from 'moment';
import { voucherService } from '../../providers/voucherService';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-flightinternationalpaymentchoosebank',
  templateUrl: './flightinternationalpaymentchoosebank.page.html',
  styleUrls: ['./flightinternationalpaymentchoosebank.page.scss'],
})
export class FlightInternationalPaymentChooseBankPage implements OnInit {

  ischeck; timestamp; public ischeckbox; jti
  Avatar; Name; Address; cin; cout; dur; room; nameroom; jsonroom; ischecktext = true
  roomnumber; adults; children; breakfast; PriceAvgPlusTAStr; priceshow
  imgroom; roomtype; indexme; indexroom; cin1; cout1; checkpayment; book; id; pricetemp; hotelid
  public loader: any; startDate; endDate; arrbankrmb:any=[];
  auth_token: any = ''; bookingCode = ""; isckb = false; TokenId;bankid="";
  intervalID: any;
  allowCheckHoldTicket: boolean = true;
  isremember=true;isdisable=false;
  ischeckedDK=true;
  constructor(public navCtrl: NavController, private toastCtrl: ToastController, public booking: Booking, 
    public Roomif: RoomInfo, public storage: Storage, public zone: NgZone, public searchhotel: SearchHotel,
    public loadingCtrl: LoadingController,public _flightService : flightService, public platform: Platform, public gf: GlobalFunction,public bookCombo:Bookcombo,
    public _voucherService: voucherService,
    public activityService: ActivityService,
    private alertCtrl: AlertController) {
      this.priceshow = this._flightService.itemFlightCache.totalPriceDisplay;
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

   if (this.activityService.objPaymentMytrip){
      this.bookingCode =  this._flightService.itemFlightCache.dataSummaryBooking.reservationNo;
      this.startDate = moment(this.activityService.objPaymentMytrip.checkInDate).format('YYYY-MM-DD');
      this.endDate = moment(this.activityService.objPaymentMytrip.checkOutDate).format('YYYY-MM-DD');
    }
    else if(this._flightService.itemFlightCache.pnr){
      this.bookingCode = this._flightService.itemFlightCache.pnr.bookingCode ? this._flightService.itemFlightCache.pnr.bookingCode : this._flightService.itemFlightCache.pnr.resNo;
      this.startDate = moment(this._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');
      this.endDate = moment(this._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD');
    } 
  }
  next() {
    this.gf.showLoading();
    this.TokenId="";
    this.bankid="";
    this.arrbankrmb.forEach(element => {
      if (element.checked) {
        this.TokenId=element.id;
        this.bankid=element.vpc_Card;
      }
    });
    if (this.TokenId) {
      if (this.bookingCode) {
        this.CreateUrlOnePay(this.bankid);
      } 
    }
    else{
      if (this.id) {
        if (this.bookingCode) {
          this.CreateUrlOnePay(this.id);
        }
      } else {
        this.presentToast();
      }
    }
    
  }
  async openWebpage(url: string) {
    var se = this;
    await Browser.open({ url: url});

      Browser.addListener('browserFinished', () => {
      if((this._voucherService.voucherSelected && this._voucherService.voucherSelected.length >0) || (this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0)){
        this._flightService.itemFlightCache.listVouchersAlreadyApply = [...this._voucherService.voucherSelected, ...this._voucherService.listPromoCode];
      }
            se._flightService.itemFlightCache.hasvoucher = se._flightService.itemFlightCache.promotionCode;//set param xac dinh da nhap voucher o buoc chon dich vu
                  let url = C.urls.baseUrl.urlFlight + "gate/apiv1/PaymentCheck?id="+ (se._flightService.itemFlightCache.reservationId ? se._flightService.itemFlightCache.reservationId : se.bookingCode);
                  se.gf.Checkpayment(url).then((checkpay) => {
                    if (checkpay.ipnCall == "CALLED_OK") {
                          se.hideLoading();
                          se.gf.hideLoading();
                          Browser.close();
                          clearInterval(se.intervalID);
                          se.navCtrl.navigateForward('flightinternationalpaymentdone/'+se.bookingCode+'/'+se.startDate+'/'+se.endDate);
                    }
                    else//case còn lại không thành công
                    {
                      se.hideLoading();
                      se.gf.hideLoading();
                      Browser.close();
                      clearInterval(se.intervalID);
                      se._flightService.paymentError = checkpay;
                      if(this._flightService.itemFlightCache.listVouchersAlreadyApply && this._flightService.itemFlightCache.listVouchersAlreadyApply.length >0){
                        let strpromocode = this._flightService.itemFlightCache.listVouchersAlreadyApply.map(v => v.code).join(', ');
                        this.alertMessage(`Mã giảm giá ${strpromocode} đã được dùng cho booking ${this._flightService.itemFlightCache.pnr.resNo}. Vui lòng thao tác lại booking!`);
                      }else{
                        this.navCtrl.navigateForward('/flightinternationalpaymenttimeout/0');
                      }
                    }
                  
                  })
                
            
                });
  }

  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: "Xin chọn 1 ngân hàng",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  clickitem(id) {
    this.zone.run(() => {
      this.id = id;
      this.TokenId="";
      this.isdisable=false;
      this.arrbankrmb.forEach(element => {
        element.checked =false;
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

  async hideLoading(){
    if(this.loader){
      this.loader.dismiss();
    }
  }
  goback() {
    this.navCtrl.pop();
  }
  async presentToastr(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  CreateUrlOnePay(bankid) {
    var se = this;
    let itemcache = this._flightService.itemFlightCache;
    se.gf.updatePaymentMethod(se._flightService.itemFlightCache, 2, se.bankid,"").then((data)=>{
      if(data && data.isHoldSuccess){
        // se._flightService.itemFlightCache.periodPaymentDate = data.periodPaymentDate;
        if (this.activityService.objPaymentMytrip){
          this.bookingCode =  this._flightService.itemFlightCache.dataSummaryBooking.reservationNo;
        }else {
          this.bookingCode = this._flightService.itemFlightCache.pnr.bookingCode ? this._flightService.itemFlightCache.pnr.bookingCode : this._flightService.itemFlightCache.pnr.resNo;
        }
        var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=atm&source=app&amount=' + itemcache.totalPrice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + se.bookingCode + '&buyerPhone=' + itemcache.phone + '&memberId=' + se.jti + '&BankId=' + bankid + '&TokenId=' + se.TokenId + '&rememberToken='+se.isremember+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink'+'&version=2&isFlightInt=true';
        se.gf.CreatePayoo(url).then(datapayoo => {
          se.hideLoading();
          se.gf.hideLoading();
        if(datapayoo.success){
          se._flightService.itemFlightCache.periodPaymentDate = datapayoo.periodPaymentDate;
          se.gf.logEventFirebase(se._flightService.itemFlightCache.paymentType, se._flightService.itemFlightCache, 'flightsearchresultinternational', 'add_payment_info', 'Flights');
          se.openWebpage(datapayoo.returnUrl);
          se.zone.run(()=>{
            se.setinterval(null);
          })
        }else{
          se.hideLoading();
          se.gf.hideLoading();
          se.gf.showAlertOutOfTicketInternational(se._flightService.itemFlightCache, 2);
        }
      
      })

      }else{
        se.hideLoading();
        se.gf.hideLoading();
        se.gf.showAlertOutOfTicketInternational(se._flightService.itemFlightCache, 2);
      }
    })
    
  }

  GeTokensOfMember() {
    var se = this;
    se.gf.GeTokensOfMember(se.jti).then(dataTokens => {
      if (dataTokens) {
        //dataTokens = JSON.parse(dataTokens);
        this.arrbankrmb=[];
        if (dataTokens.tokens.length > 0) {
          for (let i = 0; i < dataTokens.tokens.length; i++) {
            if (dataTokens.tokens[i].vpc_Card != 'VC' && dataTokens.tokens[i].vpc_Card != 'MC' && dataTokens.tokens[i].vpc_Card != 'JC' && dataTokens.tokens[i].vpc_Card != 'AE') {
              // this.TokenId = dataTokens.tokens[i].id;
              var vpc_CardNum = dataTokens.tokens[i].vpc_CardNum.split('xxx');
              vpc_CardNum = vpc_CardNum[1];
              var name_Bank=this.getnameBank(dataTokens.tokens[i].vpc_Card);
              var item = { id: dataTokens.tokens[i].id, imgbank: 'https://res.ivivu.com/payment/img/onepay/' + dataTokens.tokens[i].vpc_Card + '.png', vpc_CardNum: vpc_CardNum, name_Bank:name_Bank,checked:false,vpc_Card:dataTokens.tokens[i].vpc_Card};
              this.arrbankrmb.push(item);
            }
          }
          if ( this.arrbankrmb.length>0) {
            this.arrbankrmb[0].checked=true;
            this.isdisable=true;
            this.TokenId= this.arrbankrmb[0].id;
          }
          // item = { id: '999', imgbank: 'https://res.ivivu.com/payment/img/onepay/' + dataTokens.tokens[0].vpc_Card + '.png', vpc_CardNum: vpc_CardNum, name_Bank:name_Bank,checked:false};
          // this.arrbankrmb.push(item);
        }
      
      }
    })
  }
  getnameBank(text) {
    var cardStr="";
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
  checkacc(item,ev)
  {
    var se = this;
    if(ev.target.checked){
      se.arrbankrmb.forEach(element => {
        element.checked = false;
      });
      item.checked = true;
      this.isdisable=true;
      this.isremember=true;
      se.id = '';
    }
    else{
      item.checked = false;
      ev.target.checked = false;
      ev.target.classList.remove("radio-checked");
    }
  
  }

  setinterval(timeout)
  {
    if (this.loader) {
      this.loader.dismiss();
    }
    clearInterval(this.intervalID);
    this.intervalID = setInterval(() => {
        let url = C.urls.baseUrl.urlFlight + "gate/apiv1/PaymentCheck?id="+ (this._flightService.itemFlightCache.reservationId ? this._flightService.itemFlightCache.reservationId : this.bookingCode);
        this.gf.Checkpayment(url).then((checkpay) => {
          if (checkpay.ipnCall == "CALLED_OK") {
            this._flightService.itemFlightCache.ischeckpayment= 1;
            this.hideLoading();
            this.gf.hideLoading();
            Browser.close();
            clearInterval(this.intervalID);
          
            this.navCtrl.navigateForward('flightinternationalpaymentdone/'+this.bookingCode+'/'+this.startDate+'/'+this.endDate);
          }
          else if(checkpay.ipnCall == "CALLED_FAIL" || checkpay.ipnCall == "CALLED_TIMEOUT")//hủy
                    {
                      this.hideLoading();
                      this.gf.hideLoading();
                      Browser.close();
                      clearInterval(this.intervalID);
                      this._flightService.paymentError = checkpay;
                      if(this._flightService.itemFlightCache.listVouchersAlreadyApply && this._flightService.itemFlightCache.listVouchersAlreadyApply.length >0){
                        let strpromocode = this._flightService.itemFlightCache.listVouchersAlreadyApply.map(v => v.code).join(', ');
                        this.alertMessage(`Mã giảm giá ${strpromocode} đã được dùng cho booking ${this._flightService.itemFlightCache.pnr.resNo}. Vui lòng thao tác lại booking!`);
                      }else{
                        this.navCtrl.navigateForward('/flightinternationalpaymenttimeout/0');
                      }
                    }
        })
      
    }, 1000 * 1);
    setTimeout(() => {
      clearInterval(this.intervalID);
    }, timeout ? timeout : 60000 * 9.1);
  }

  callCheckPayment(){
    var se = this;
      se.checkPayment();
  }

  checkPayment(){
    var se = this;
    let url = C.urls.baseUrl.urlFlight + "gate/apiv1/PaymentCheck?id="+ (se._flightService.itemFlightCache.reservationId ? se._flightService.itemFlightCache.reservationId : se.bookingCode);
    se.gf.Checkpayment(url).then((data) => {
      var checkpay=JSON.parse(data);
      if (!checkpay.status) {
        setTimeout(()=>{
          se.callCheckPayment();
        },1000 *2)
      }else{
          Browser.close();
      }
    })
  }


  rememberCard(){
    this.isremember=!this.isremember
  }

  async alertMessage(msg){
    let alert = await this.alertCtrl.create({
      message: msg,
      cssClass: "cls-alert-flighttimeout",
      backdropDismiss: false,
      buttons: [
      {
        text: 'OK',
        role: 'OK',
        handler: () => {
          this._flightService.itemChangeTicketFlight.emit(1);
          if(this._voucherService.selectVoucher){
            
            this._voucherService.rollbackSelectedVoucher.emit(this._voucherService.selectVoucher);
            this._voucherService.selectVoucher = null;
            
          }
          this._voucherService.publicClearVoucherAfterPaymentDone(1);
          this._flightService.itemFlightCache.promotionCode = "";
          this._flightService.itemFlightCache.promocode = "";
          this._flightService.itemFlightCache.discount = 0;
          this.navCtrl.navigateBack('flightsearchresultinternational');
          alert.dismiss();
        }
      }
    ]
  });
  alert.present();
  return;
  }
}
