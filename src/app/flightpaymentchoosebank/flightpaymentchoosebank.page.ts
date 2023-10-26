import { Bookcombo } from './../providers/book-service';
import { Booking, RoomInfo, SearchHotel } from '../providers/book-service';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform, AlertController } from '@ionic/angular';
import { C } from '../providers/constants';

import { Storage } from '@ionic/storage';
import { GlobalFunction } from '../providers/globalfunction';
import { flightService } from '../providers/flightService';
import * as moment from 'moment';
import { voucherService } from '../providers/voucherService';
//import { PowerManagement } from '@ionic-native/power-management/ngx';
import { Browser } from '@capacitor/browser';



@Component({
  selector: 'app-flightpaymentchoosebank',
  templateUrl: './flightpaymentchoosebank.page.html',
  styleUrls: ['./flightpaymentchoosebank.page.scss'],
})
export class FlightpaymentchoosebankPage implements OnInit {

  ischeck; timestamp; public ischeckbox; jti='';
  Avatar; Name; Address; cin; cout; dur; room; nameroom; jsonroom; ischecktext = true
  roomnumber; adults; children; breakfast; PriceAvgPlusTAStr; priceshow
  imgroom; roomtype; indexme; indexroom; cin1; cout1; checkpayment; book; id; pricetemp; hotelid
  public loader: any; startDate; endDate; arrbankrmb:any=[];
  auth_token: any = ''; bookingCode = ""; isckb = false; TokenId;bankid="";
  intervalID: any;
  allowCheckHoldTicket: boolean = true;
  _inAppBrowser: any;
  isremember=true;isdisable=false
  ischeckedDK=true;
  constructor(public navCtrl: NavController, private toastCtrl: ToastController, public booking: Booking,
    public Roomif: RoomInfo, public storage: Storage, public zone: NgZone, public searchhotel: SearchHotel,
    public loadingCtrl: LoadingController,public _flightService : flightService, public platform: Platform, public gf: GlobalFunction,public bookCombo:Bookcombo,
    public _voucherService: voucherService,
    private alertCtrl: AlertController
    ) {
      this.priceshow = this._flightService.itemFlightCache.totalPriceDisplay;


      setTimeout(() => {
        clearInterval(this.intervalID);
    }, 1000 * 60 * 10);
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

    if(this._flightService.itemFlightCache.pnr){
      this.bookingCode = this._flightService.itemFlightCache.pnr.bookingCode ? this._flightService.itemFlightCache.pnr.bookingCode : this._flightService.itemFlightCache.pnr.resNo;
      this.startDate = moment(this._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');
      this.endDate = moment(this._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD');
    }
  }
  next() {
    this.presentLoading();
    this.TokenId="";
    this.bankid="";
    this.arrbankrmb.forEach(element => {
      if (element.checked) {
        this.TokenId=element.id;
        this.bankid=element.vpc_Card;
      }
    });

    this.checkAllowRepay().then((check)=>{
      if(check){
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
            this.hideLoading();
            this.presentToast();
          }
        }
      }else{
        this.gf.checkTicketAvaiable(this._flightService.itemFlightCache).then((check) =>{
            if(check){
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
                  this.hideLoading();
                  this.presentToast();
                }
              }
            }else{
              this.hideLoading();
              this.gf.showAlertOutOfTicket(this._flightService.itemFlightCache, 1, 0);
              clearInterval(this.intervalID);
              
            }
        })
      }
      
    })
  }

  async openWebpage(url: string) {
    var se = this;

    await Browser.open({ url: url});

    Browser.addListener('browserFinished', () => {
      se._flightService.itemFlightCache.hasvoucher = se._flightService.itemFlightCache.promotionCode;//set param xac dinh da nhap voucher o buoc chon dich vu

      se.hideLoading();
                  se.gf.hideLoading();
                  let itemcache = se._flightService.itemFlightCache;
                  if(itemcache && itemcache.objHotelCitySelected){
                    se.checkComboHotelCityPayment();
                  }else{
                    let url = C.urls.baseUrl.urlFlight + "gate/apiv1/PaymentCheck?id="+se._flightService.itemFlightCache.reservationId;
                    se.gf.Checkpayment(url).then((datapayment) => {
                      var checkpay=datapayment;
  
                      if (checkpay.ipnCall == "CALLED_OK") {
                        se.hideLoading();
                        se.gf.hideLoading();
                        //Browser.close();
                        Browser.close();
                        clearInterval(se.intervalID);
                        se.gf.getSummaryBooking(se._flightService.itemFlightCache).then((databkg:any) => {
                          se._flightService.itemFlightCache.dataSummaryBooking = databkg;
                        })
                        se.navCtrl.navigateForward('flightpaymentdone/'+se.bookingCode+'/'+se.startDate+'/'+se.endDate);
                      }
                      else//case còn lại không thành công
                      {
                        se.hideLoading();
                        se.gf.hideLoading();
                        Browser.close();
                        //Browser.close();
                        clearInterval(se.intervalID);
                        se._flightService.paymentError = checkpay;
                        if(se._flightService.itemFlightCache.listVouchersAlreadyApply && se._flightService.itemFlightCache.listVouchersAlreadyApply.length >0){
                          let strpromocode = se._flightService.itemFlightCache.listVouchersAlreadyApply.map(v => v.code).join(', ');
                          se.alertMessage(`Mã giảm giá ${strpromocode} đã được dùng cho booking ${se._flightService.itemFlightCache.pnr.resNo}. Vui lòng thao tác lại booking!`);
                        }else{
                          se.navCtrl.navigateForward('/flightpaymenttimeout/0');
                        }
                      }
            })
          }
    });

    //_browser.addListener(eventName: 'browserFinished', listenerFunc: () => void) => Promise<PluginListenerHandle> & PluginListenerHandle
    

    //addListener(eventName: 'browserFinished', listenerFunc: () => void) => Promise<PluginListenerHandle> & PluginListenerHandle
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
    this.navCtrl.navigateBack('flightpaymentselect');
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
            se._flightService.itemFlightCache.periodPaymentDate = data.periodPaymentDate;
            if((se._voucherService.voucherSelected && se._voucherService.voucherSelected.length >0) || (se._voucherService.listPromoCode && se._voucherService.listPromoCode.length >0)){
              se._flightService.itemFlightCache.listVouchersAlreadyApply = [...se._voucherService.voucherSelected, ...se._voucherService.listPromoCode];
            }
            var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=atm&source=app&amount=' + itemcache.totalPrice + '&orderCode=' + (itemcache.pnr.bookingCode ?itemcache.pnr.bookingCode:  itemcache.pnr.resNo) + '&buyerPhone=' + itemcache.phone + '&memberId=' + se.jti + '&BankId=' + bankid + '&TokenId=' + se.TokenId + '&rememberToken='+se.isremember+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink'+ '&version=2';
            se.gf.CreatePayoo(url).then(datapayoo => {
            datapayoo = datapayoo;
            if(datapayoo.success){
              se._flightService.itemFlightCache.hasvoucher = se._flightService.itemFlightCache.promotionCode;//set param xac dinh da nhap voucher o buoc chon dich vu
              se.searchhotel.paymentType = 'atm';
              se.gf.logEventFirebase('atm', se._flightService.itemFlightCache, 'flightpaymentselect', 'add_payment_info', 'Flights');
              se.openWebpage(datapayoo.returnUrl);
              se.zone.run(()=>{
                se.setinterval();
              })
              se.hideLoading();
            }else{
              se.hideLoading();
              se.gf.hideLoading();
              se.gf.showAlertOutOfTicket(se._flightService.itemFlightCache, 2, 0);
            }
          
          })

          }else{
            se.gf.showAlertOutOfTicket(se._flightService.itemFlightCache, 2, 0);
            se.hideLoading();
            se.gf.hideLoading();
          }
        })
  }
  GeTokensOfMember() {
    var se = this;
    se.gf.GeTokensOfMember(se.jti).then(dataTokens => {
      if (dataTokens) {
        if (dataTokens.tokens.length > 0) {
          for (let i = 0; i < dataTokens.tokens.length; i++) {
            if (dataTokens.tokens[i].vpc_Card != 'VC' && dataTokens.tokens[i].vpc_Card != 'MC' && dataTokens.tokens[i].vpc_Card != 'JC' && dataTokens.tokens[i].vpc_Card != 'AE') {
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

  setinterval()
  {
    let se = this;
    if (se.loader) {
      se.loader.dismiss();
    }
    clearInterval(se.intervalID);
    se.intervalID = setInterval(() => {
      let itemcache = se._flightService.itemFlightCache;
      if(itemcache && itemcache.objHotelCitySelected){
        se.checkComboHotelCityPayment();
      }else{
        let url = C.urls.baseUrl.urlFlight + "gate/apiv1/PaymentCheck?id="+se._flightService.itemFlightCache.reservationId;
        se.zone.run(() => {
          se.gf.Checkpayment(url).then((data) => {
            var checkpay= data;
            if (checkpay.ipnCall == "CALLED_OK") {
              se._flightService.itemFlightCache.ischeckpayment= 1;
              se.hideLoading();
              se.gf.hideLoading();
              Browser.close();
              clearInterval(se.intervalID);
              se.gf.getSummaryBooking(se._flightService.itemFlightCache).then((databkg:any) => {
                se._flightService.itemFlightCache.dataSummaryBooking = databkg;
              })
              se.navCtrl.navigateForward('flightpaymentdone/'+se.bookingCode+'/'+se.startDate+'/'+se.endDate);
            }
            else if(checkpay.ipnCall == "CALLED_FAIL" || checkpay.ipnCall == "CALLED_TIMEOUT")//hủy
                      {
                        se.hideLoading();
                        se.gf.hideLoading();
                        Browser.close();
                        clearInterval(se.intervalID);
                        se._flightService.paymentError = checkpay;
                        if(se._flightService.itemFlightCache.listVouchersAlreadyApply && se._flightService.itemFlightCache.listVouchersAlreadyApply.length >0){
                          let strpromocode = se._flightService.itemFlightCache.listVouchersAlreadyApply.map(v => v.code).join(', ');
                          se.alertMessage(`Mã giảm giá ${strpromocode} đã được dùng cho booking ${se._flightService.itemFlightCache.pnr.resNo}. Vui lòng thao tác lại booking!`);
                        }else{
                          se.navCtrl.navigateForward('/flightpaymenttimeout/0');
                        }
                      }
          
          })
        })
      }
      
    }, 2000 * 1);

    setTimeout(() => {
      clearInterval(se.intervalID);
    }, 60000 * 10.5);
  }

  checkHoldTicket(data){
    var se = this, res = false;
    let url = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+data.pnr.resNo;
    
        se.callCheckHoldTicket(url, data).then((check) => {
          if (!check && se.allowCheckHoldTicket) {
              res = false;
              setTimeout(() => {
                se.checkHoldTicket(data);
              }, 3000);
          }else{

            if(check){
              se.gf.hideLoading();
              window.close();
              Browser.close();
              clearInterval(se.intervalID);
              se.navCtrl.navigateForward('flightpaymentdone/'+se.bookingCode+'/'+se.startDate+'/'+se.endDate);
            }else{//hold vé thất bại về trang tìm kiếm
              clearInterval(se.intervalID);
              se.gf.hideLoading();
              Browser.close();
              se.navCtrl.navigateForward('/flightpaymentwarning');
            }
                
          }
        })
      

      setTimeout(() => {
       
        se.allowCheckHoldTicket = false;
       
      }, 1000 * 30);
   
  }

  callCheckHoldTicket(url, data){
    var res = false;
    var se = this;
    return new Promise((resolve, reject) => {
      // var options = {
      //   method: 'GET',
      //   url: C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+data.pnr.resNo,
      //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
      //   headers: {
      //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
      //     'Content-Type': 'application/json; charset=utf-8',
      //   },
      // };
      let urlPath = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+data.pnr.resNo;
      let headers = {
        "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
        'Content-Type': 'application/json; charset=utf-8',
      };
      this.gf.RequestApi('GET', urlPath, headers, {}, 'flightPaymentChooseBank', 'callCheckHoldTicket').then((result)=>{

        if (result) {
          //let result = data;
          if(se._flightService){
            se._flightService.itemFlightCache.dataSummaryBooking = result;
          }
          //Thêm case check thanh toán thành công nhưng quá hạn giữ vé
          if(result.expIssueTicket){
              se.allowCheckHoldTicket = false;
              resolve(false);
            }else{
                if(data.ischeckpayment == 0)//trả sau
                {
                    if(result.isRoundTrip){//khứ hồi
                      if(result.departFlight.atBookingCode != null && result.departFlight.atBookingCode.indexOf("T__") == -1 && result.returnFlight.atBookingCode != null && result.returnFlight.atBookingCode.indexOf("T__") == -1){
                        resolve(true);
                      }else{
                        resolve(false);
                      }
                    }else{
                      if(result.departFlight.atBookingCode != null && result.departFlight.atBookingCode.indexOf("T__") == -1){
                        resolve(true);
                      }else{
                        resolve(false);
                      }
                    }
                }else{//trả trước
        
                  if(result.isRoundTrip){//khứ hồi
                    //Có mã giữ chỗ và trạng thái đã xuất vé cả 2 chiều thì trả về true - hoàn thành
                    if(result.departFlight.atBookingCode != null && result.departFlight.atBookingCode.indexOf("T__") == -1 && result.returnFlight.atBookingCode != null && result.returnFlight.atBookingCode.indexOf("T__") == -1
                    && result.departFlight.status == 4 && result.returnFlight.status == 4){
                      resolve(true);
                    }else{
                      resolve(false);
                    }
                  }else{//Có mã giữ chỗ và trạng thái đã xuất vé thì trả về true - hoàn thành
                    if(result.departFlight.atBookingCode != null && result.departFlight.atBookingCode.indexOf("T__") == -1 && result.departFlight.status == 4){
                      resolve(true);
                    }else{
                      resolve(false);
                    }
                  }
                }
              }
        }
      })
     
      
    })
  }

  callCheckPayment(){
    var se = this;
      se.checkPayment();
  }

  checkPayment(){
    var se = this;
    let url = C.urls.baseUrl.urlFlight + "gate/apiv1/PaymentCheck?id="+se._flightService.itemFlightCache.reservationId;
    se.gf.Checkpayment(url).then((data) => {
      var checkpay=data;
      if (!checkpay.status) {
        setTimeout(()=>{
          se.callCheckPayment();
        },1000 *2)
      }else{
          Browser.close();
      }
    })
  }

  checkAllowRepay(){
    var se = this;
    return new Promise((resolve, reject) => {
      se.callCheckHoldTicket('',se._flightService.itemFlightCache).then((check) => {
        let databkg = se._flightService.itemFlightCache.dataSummaryBooking;
        let data = se._flightService.itemFlightCache;
           if(data.ischeckpayment == 0)//trả sau
            {
                if(databkg.isRoundTrip){//khứ hồi
                  if(databkg.departFlight.atBookingCode != null && databkg.departFlight.atBookingCode.indexOf("T__") == -1 
                  && databkg.returnFlight.atBookingCode != null && databkg.returnFlight.atBookingCode.indexOf("T__") == -1
                  && databkg && !databkg.expIssueTicket && databkg.urlPaymentAgain)
                  {
                    resolve(true);
                  }
                  else{
                    resolve(false);
                  }
                }else{
                  if(databkg.departFlight.atBookingCode != null && databkg.departFlight.atBookingCode.indexOf("T__") == -1
                  && databkg && !databkg.expIssueTicket && databkg.urlPaymentAgain)
                  {
                    resolve(true);
                  }
                  else{
                    resolve(false);
                  }
                }
              }else{//trả trước
      
                if(databkg.isRoundTrip){//khứ hồi
                  //Có mã giữ chỗ và trạng thái đã xuất vé cả 2 chiều thì trả về true - hoàn thành
                  if(databkg.departFlight.atBookingCode != null && databkg.departFlight.atBookingCode.indexOf("T__") == -1 
                  && databkg.returnFlight.atBookingCode != null && databkg.returnFlight.atBookingCode.indexOf("T__") == -1
                  && databkg && !databkg.expIssueTicket && databkg.urlPaymentAgain)
                  {
                    resolve(true);
                  }
                  else{
                    resolve(false);
                  }
                }else{//Có mã giữ chỗ và trạng thái đã xuất vé thì trả về true - hoàn thành
                  if(databkg.departFlight.atBookingCode != null && databkg.departFlight.atBookingCode.indexOf("T__") == -1
                  && databkg && !databkg.expIssueTicket && databkg.urlPaymentAgain)
                  {
                    resolve(true);
                  }
                  else{
                    resolve(false);
                  }
                }
              }
      })
    })
    
  }
  rememberCard(){
    this.isremember=!this.isremember
  }


  checkComboHotelCityPayment() {
    var se = this;
    //wait 5s
    // var options = {
    //   method: 'GET',
    //   url: C.urls.baseUrl.urlPost + '/mCheckBooking',
    //   qs: { code: se.bookingCode },
    //   headers:
    //   {
    //   }
    // };
    let urlPath = C.urls.baseUrl.urlPost + '/mCheckBooking?code='+se.bookingCode;
      let headers = {
        "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
        'Content-Type': 'application/json; charset=utf-8',
      };
      this.gf.RequestApi('GET', urlPath, headers, {}, 'flightPaymentChooseBank', 'checkComboHotelCityPayment').then((data)=>{

      if (data) {
        var rs = data
        if (rs.StatusBooking == 3 && !rs.error) {
          se._flightService.itemFlightCache.ischeckpayment= 1;
          se.hideLoading();
          se.gf.hideLoading();
          // if(se._inAppBrowser){
          //   Browser.close();
          // }
          Browser.close();
          clearInterval(se.intervalID);
          se.gf.getSummaryBooking(se._flightService.itemFlightCache).then((databkg:any) => {
            se._flightService.itemFlightCache.dataSummaryBooking = databkg;
          })
          se.navCtrl.navigateForward('flightpaymentdone/'+se.bookingCode+'/'+se.startDate+'/'+se.endDate);
        }
        else if(rs.error){
          se.hideLoading();
          se.gf.hideLoading();
          // if(se._inAppBrowser){
          //   Browser.close();
          // }
          Browser.close();
          clearInterval(se.intervalID);
          se._flightService.paymentError = rs.error;
          if(this._flightService.itemFlightCache.listVouchersAlreadyApply && this._flightService.itemFlightCache.listVouchersAlreadyApply.length >0){
                    let strpromocode = this._flightService.itemFlightCache.listVouchersAlreadyApply.map(v => v.code).join(', ');
                    this.alertMessage(`Mã giảm giá ${strpromocode} đã được dùng cho booking ${this._flightService.itemFlightCache.pnr.resNo}. Vui lòng thao tác lại booking!`);
                  }else{
                    this.navCtrl.navigateForward('/flightpaymenttimeout/0');
                  }
        }
      }
      else {
        se.hideLoading();
        se.gf.hideLoading();
        if(se._inAppBrowser){
          Browser.close();
        }
        clearInterval(se.intervalID);
        se._flightService.paymentError = rs.error;
        if(this._flightService.itemFlightCache.listVouchersAlreadyApply && this._flightService.itemFlightCache.listVouchersAlreadyApply.length >0){
                    let strpromocode = this._flightService.itemFlightCache.listVouchersAlreadyApply.map(v => v.code).join(', ');
                    this.alertMessage(`Mã giảm giá ${strpromocode} đã được dùng cho booking ${this._flightService.itemFlightCache.pnr.resNo}. Vui lòng thao tác lại booking!`);
                  }else{
                    this.navCtrl.navigateForward('/flightpaymenttimeout/0');
                  }
      }

    });
  }
  checkDk(){
    this.ischeckedDK=!this.ischeckedDK;
  }
  async openWebpageDK(url: string) {
    await Browser.open({ url: url});
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
          if(this._flightService.itemFlightCache.isApiDirect){
            this.navCtrl.navigateBack('/flightsearchresultinternational');
          }else{
            this.navCtrl.navigateBack('/flightsearchresult');
          }
          alert.dismiss();
        }
      }
    ]
  });
  alert.present();
  }
}
