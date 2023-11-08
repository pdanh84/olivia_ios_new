import { SearchHotel } from '../../providers/book-service';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform, ModalController, AlertController } from '@ionic/angular';
import { C } from '../../providers/constants';
import { Storage } from '@ionic/storage';
import { ActivityService, GlobalFunction } from '../../providers/globalfunction';
import { flightService } from '../../providers/flightService';
import {FlightpricedetailPage} from './../../flightpricedetail/flightpricedetail.page';
import { FlightBookingDetailsPage } from '../../flightbookingdetails/flightbookingdetails.page';
import { FlightquickbackPage } from '../../flightquickback/flightquickback.page';
import { BizTravelService } from '../../providers/bizTravelService';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';


@Component({
  selector: 'app-orderrequestaddluggagepaymentselect',
  templateUrl: './orderrequestaddluggagepaymentselect.page.html',
  styleUrls: ['./orderrequestaddluggagepaymentselect.page.scss'],
})
export class OrderRequestAddluggagePaymentSelectPage implements OnInit {
  ischeckvisa = false;
  public loader: any;
  adult: any;
  child: any;
  totalpricedisplay: any;
  departtitle: string;
  returntitle: string;
  paymentfirst: boolean = false;
  intervalID: any;
  itemflight: any;
  jti: any;
  _windowmomo: any;
  arrbankrmb:any=[];
  tokenid: any;
  isbtn: boolean;
  isdisable: boolean;
  isremember: boolean;
  bookingCode: string;
  phone: any;
  blockPayCard = false;
  constructor(private navCtrl:NavController,public _flightService: flightService
    ,public gf: GlobalFunction, public loadingCtrl: LoadingController
    ,public searchhotel:SearchHotel, public storage: Storage,
    private modalCtrl: ModalController,
    private platform: Platform,
    private alertCtrl: AlertController,
    private zone: NgZone,
    public bizTravelService: BizTravelService,
    public activityService: ActivityService) { 
    
    if(this.activityService.objRequestAddLuggage){
      this.totalpricedisplay = this.activityService.objRequestAddLuggage.totalPriceDisplay;
      this.departtitle = "Chiều đi: " + this.activityService.objRequestAddLuggage.departWeight + "kg";
      if(this.activityService.objRequestAddLuggage.returnWeight >0){
        this.returntitle = "Chiều về: " + this.activityService.objRequestAddLuggage.returnWeight + "kg";
      }
      
      this.itemflight = this._flightService.itemFlightCache;
      this.bookingCode = this.activityService.objRequestAddLuggage.bookingCode;
    }
    
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
        this.GeTokensOfMember(0);
      }
    })
    this.storage.get('infocus').then(infocus => {
      if (infocus) {
        this.phone = infocus.phone;
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

    this.platform.ready().then(()=>{
    
      setTimeout(() => {
        clearInterval(this.intervalID);
    }, 1000 * 60 * 10);
    })

    App.addListener('appUrlOpen', data => {
      this.setinterval();
    });
  }
  async showPriceDetail(){
    const modal: HTMLIonModalElement =
    await this.modalCtrl.create({
      component: FlightpricedetailPage,
    });
  modal.present();
}
  
  ngOnInit() {
  }
  
  goback()
  {
    var se = this;
    se.rollBackObjectRequestAddLuggage();
    this.navCtrl.back();
  }

  getSummaryBooking(data) : Promise<any>{
    var se = this;
    return new Promise((resolve, reject) => {
     
        let url = C.urls.baseUrl.urlFlight + + "/gate/apiv1/SummaryBooking/"+data.pnr.resNo;
        let headers= {
              "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
              'Content-Type': 'application/json; charset=utf-8',
            };
        this.gf.RequestApi('GET', url, headers , {}, 'orderrequestaddluggagepaymentselect', 'getSummaryBooking' ).then((result) => {
        if(result){
          //let result = JSON.parse(body);
          resolve(result);
        }
      })
    })
  }
  
  
  flightpaymentbank()
  {
    clearInterval(this.intervalID);
    this.navCtrl.navigateForward('orderrequestaddluggagepaymentbank');
  }
  flightpaymentatm()
  {
    clearInterval(this.intervalID);
    this.navCtrl.navigateForward('orderrequestaddluggagepaymentchoosebank');
  }
  flightpaymentvisa() {
   
    this.presentLoading();
    this.GeTokensOfMember(1);
  }

  async openWebpage(url: string) {
    var se = this;
    await Browser.open({ url: url});

    Browser.addListener('browserFinished', () => {
            let url = C.urls.baseUrl.urlFlight + "gate/apiv1/PaymentCheck?id="+se.bookingCode+'&IsPartialPayment=true';
              se.gf.Checkpayment(url).then((checkpay)=>{
                if (checkpay.ipnCall == "CALLED_OK") { 
                  se.hideLoading();
                  se.gf.hideLoading();
                  Browser.close();
                  clearInterval(se.intervalID);
                  se.navCtrl.navigateForward('orderrequestaddluggagepaymentdone');
                }
                else
                {
                  se.hideLoading();
                  se.gf.hideLoading();
                  clearInterval(se.intervalID);
                  se.rollBackObjectRequestAddLuggage();
                  se.gf.showAlertPaymentFail();
                }
              })
    });

  }

  async openWebpageMomo(url: string) {
    var se = this;
    await Browser.open({ url: url});

    Browser.addListener('browserFinished', () => {
              let url = C.urls.baseUrl.urlFlight + "gate/apiv1/PaymentCheck?id="+se.bookingCode+'&IsPartialPayment=true';
                se.gf.Checkpayment(url).then((checkpay)=>{
                  //let checkpay=JSON.parse(datapayment);
                  if (checkpay.ipnCall == "CALLED_OK") { 
                    se.hideLoading();
                    se.gf.hideLoading();
                    Browser.close();
                    clearInterval(se.intervalID);
                    se.navCtrl.navigateForward('orderrequestaddluggagepaymentdone');
                  }
                  else
                  {
                    se.hideLoading();
                    se.gf.hideLoading();
                    Browser.close();
                    clearInterval(se.intervalID);
                    se.rollBackObjectRequestAddLuggage();
                    se.gf.showAlertPaymentFail();
                  }        

                })
    });

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
  flightpaymentmomo(){
    
    this.presentLoading();
    let itemcache = this.activityService.objRequestAddLuggage;
    var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=momo&source=app&amount=' + itemcache.totalPrice + '&orderCode=' + this.bookingCode + '&buyerPhone=' + this.phone +'&memberId='+this.jti+'&callbackUrl=https%3A%2F%2Fivivudownload.page.link%2Fivivuapp'+'&version=2'+'&IsPartialPayment=true';
    this.gf.CreatePayoo(url).then(datapayoo => {
      //datapayoo = JSON.parse(datapayoo);
      if (datapayoo.success) {
        //this._windowmomo = window.open(datapayoo.returnUrl.payUrl, '_system');
        Browser.open({url : datapayoo.returnUrl.payUrl});
        this.zone.run(()=>{
          this.setinterval();
        })
        this.hideLoading();
      }
      else{
        this.rollBackObjectRequestAddLuggage();
        this.gf.showAlertPaymentFail();
        this.hideLoading();
      }
    })
    
  }

  setinterval()
  {
    if (this.loader) {
      this.loader.dismiss();
    }
    clearInterval(this.intervalID);
    this.intervalID = setInterval(() => {
        let url = C.urls.baseUrl.urlFlight + "gate/apiv1/PaymentCheck?id="+this.bookingCode+'&IsPartialPayment=true';
        this.zone.run(() => {
          this.gf.Checkpayment(url).then((checkpay) => {
            //var checkpay=JSON.parse(data);
            if (checkpay.ipnCall == "CALLED_OK") {
              this._flightService.itemFlightCache.ischeckpayment= 1;
              this.hideLoading();
              this.gf.hideLoading();
              Browser.close();
              clearInterval(this.intervalID);
              this.navCtrl.navigateForward('orderrequestaddluggagepaymentdone');
            }
            else if(checkpay.ipnCall == "CALLED_FAIL" || checkpay.ipnCall == "CALLED_TIMEOUT")//hủy
                      {
                        this.hideLoading();
                        this.gf.hideLoading();
                        Browser.close();
                        clearInterval(this.intervalID);
                        this._flightService.paymentError = checkpay;
                        this.rollBackObjectRequestAddLuggage();
                        this.gf.showAlertPaymentFail();
                      }
          
          })
        })
      
    }, 2000 * 1);

    setTimeout(() => {
      clearInterval(this.intervalID);
    }, 60000 * 10.5);
  }
  
  checkHoldTicket(data){
    var se = this, res = false;
    let url = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+data.pnr.resNo;
    
        se.callCheckHoldTicket(url, data).then((check) => {
          if (!check) {
              res = false;
              setTimeout(() => {
                se.checkHoldTicket(data);
              }, 3000);
          }else{

            if(check){
              se.hideLoading();
              se.gf.hideLoading();
              Browser.close();
               if(se._windowmomo){
                se._windowmomo.close();
              }
              clearInterval(se.intervalID);
             // se.navCtrl.navigateForward('flightpaymentdone/'+se.bookingCode+'/'+se.startDate+'/'+se.endDate);
            }else{//hold vé thất bại về trang tìm kiếm
              se.gf.hideLoading();
              se.hideLoading();
              clearInterval(se.intervalID);
              Browser.close();
              if(se._windowmomo){
                se._windowmomo.close();
              }
              //se.navCtrl.navigateForward('/flightpaymentwarning');
              se.gf.showAlertPaymentFail();
            }
                
          }
        })
      

      setTimeout(() => {
       
      //  se.allowCheckHoldTicket = false;
       
      }, 1000 * 60 * 7);
   
  }

  callCheckHoldTicket(url, data){
    var res = false;
    var se = this;
    return new Promise((resolve, reject) => {
     
      let url = C.urls.baseUrl.urlFlight + + "/gate/apiv1/SummaryBooking/"+data.pnr.resNo;
      let headers= {
            "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            'Content-Type': 'application/json; charset=utf-8',
          };
      this.gf.RequestApi('GET', url, headers , {}, 'orderrequestaddluggagepaymentselect', 'callCheckHoldTicket' ).then((result) => {
      if(result){
          if(se._flightService){
            this.activityService.objRequestAddLuggage.dataSummaryBooking = result;
          }
          
          //Thêm case check thanh toán thành công nhưng quá hạn giữ vé
          if(result.expIssueTicket){
              //se.allowCheckHoldTicket = false;
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
  
  GeTokensOfMember(stt) {
    var se = this;
    se.gf.GeTokensOfMember(se.jti).then(dataTokens => {
      if (dataTokens) {
        //dataTokens = JSON.parse(dataTokens);
        if (dataTokens.tokens.length > 0) {
          this.arrbankrmb=[];
          for (let i = 0; i < dataTokens.tokens.length; i++) {
            if (dataTokens.tokens[i].vpc_Card == 'VC' || dataTokens.tokens[i].vpc_Card == 'MC' || dataTokens.tokens[i].vpc_Card == 'JC' || dataTokens.tokens[i].vpc_Card == 'AE') {
              // this.TokenId = dataTokens.tokens[i].id;
              var vpc_CardNum = dataTokens.tokens[i].vpc_CardNum.split('xxx');
              vpc_CardNum = vpc_CardNum[1];
              var cardname=this.getCardName(dataTokens.tokens[i].vpc_Card);
              var item = { id: dataTokens.tokens[i].id, imgbank: 'https://res.ivivu.com/payment/img/onepay/' + dataTokens.tokens[i].vpc_Card + '.png', vpc_CardNum: vpc_CardNum, name_Bank: cardname, checked: false };
              this.arrbankrmb.push(item);
            }
          }
          if ( this.arrbankrmb.length>0) {
            this.arrbankrmb[0].checked=true;
            this.tokenid= this.arrbankrmb[0].id;
            this.isbtn=true;
            this.isdisable=true;
            this.ischeckvisa=true
          }
        }
      }
      if (stt==1) {
        if (this.arrbankrmb.length > 0) {
          this.ischeckvisa = true;
        } else {
          if (this.bookingCode) {
            this.NoCreateBooking();
          } 
        } 
      }
    })
  }
  next() {
   
    //this.presentLoading();
    clearInterval(this.intervalID);
    this.NoCreateBooking();
    //this.navCtrl.navigateForward('/orderrequestaddluggagepaymentdone');
  }
  chooseacc(item)
  {
    
    this.tokenid=item.id;
    this.isbtn=true;
    this.isdisable=true;
    this.isremember=true;
  }
  nochooseacc()
  {
   
    this.tokenid="";
    this.isbtn=true;
    this.isdisable=false;
    this.isremember=true;
  }
  
  NoCreateBooking()
  {
    var se=this;
    let itemcache = this.activityService.objRequestAddLuggage;
    let url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=visa&source=app&amount=' + itemcache.totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' +this.phone + '&memberId=' + se.jti + '&TokenId='+(se.tokenid ? se.tokenid : '') +'&rememberToken='+(se.isremember ? se.isremember : 'false')+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink'+'&version=2'+'&IsPartialPayment=true';
    se.gf.CreatePayoo(url).then(datapayoo => {
      //datapayoo = JSON.parse(datapayoo);
      if(datapayoo.success){
        se.activityService.objRequestAddLuggage.ischeckpayment = 1;
        se.openWebpage(datapayoo.returnUrl);
        se.zone.run(()=>{
          se.setinterval();
        })
        se.hideLoading();
      }
      else{
        se.showAlertOutOfTicket();
        se.hideLoading();
      }
    })
  }
  
  getCardName(text)
  {
    var cardStr="";
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

  flightpaymentpayoostore() {
   
    let itemcache = this.activityService.objRequestAddLuggage;
    var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=payoo_store&source=app&amount=' + itemcache.totalPrice + '&orderCode=' + this.bookingCode + '&buyerPhone=' + this.phone+'&memberId='+this.jti+'&version=2'+'&IsPartialPayment=true';
    this.gf.CreatePayoo(url).then(datapayoo => {
      this.hideLoading();
      //datapayoo = JSON.parse(datapayoo);
      if (datapayoo.success) {
        this._flightService.itemFlightCache.BillingCode = datapayoo.payooStoreData.BillingCode;
        this._flightService.itemFlightCache.periodPaymentDate = datapayoo.payooStoreData.periodPayment;
        if (this.loader) {
          this.loader.dismiss();
        }
        this.openWebpage(datapayoo.returnUrl);
        this.zone.run(()=>{
          this.setinterval();
        })
        //this.navCtrl.navigateForward('orderrequestaddluggagepaymentpayoo/' + this.bookingCode + '/0');
      }
      else{
        this.showAlertOutOfTicket();
        this.hideLoading();
      }
    })
  }
  flightpaymentpayooqr() {
   
    this.presentLoading();
    let itemcache = this.activityService.objRequestAddLuggage;
            var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=payoo_qr&source=app&amount=' + itemcache.totalPrice + '&orderCode=' + this.bookingCode + '&buyerPhone=' + this.phone+'&memberId='+this.jti+'&version=2'+'&IsPartialPayment=true';
            this.gf.CreatePayoo(url).then(datapayoo => {
              this.hideLoading();
              //datapayoo = JSON.parse(datapayoo);
              if (datapayoo.success) {
                this._flightService.itemFlightCache.qrimg = datapayoo.payooQrData.QRCodeUrl;
                this.navCtrl.navigateForward('orderrequestaddluggagepaymentpayoo/' + this.bookingCode + '/1');
              }else{
                this.hideLoading();
                this.showAlertOutOfTicket();
              }
            })

  }

  async showFlightDetail(){
      var se = this;
        const modal: HTMLIonModalElement =
        await se.modalCtrl.create({
          component: FlightBookingDetailsPage,
          componentProps: {
            aParameter: true,
          },
          showBackdrop: true,
          backdropDismiss: true,
          
          cssClass: "modal-flight-booking-detail"
        });
      modal.present();
    }

    async showQuickBack(){
      const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: FlightquickbackPage,
        componentProps: {
          aParameter: true,
        },
        showBackdrop: true,
        backdropDismiss: true,
        //enterAnimation: CustomAnimations.iosCustomEnterAnimation,
        //leaveAnimation: CustomAnimations.iosCustomLeaveAnimation,
        cssClass: "modal-flight-quick-back",
      });
    modal.present();
    }

    flightpaymentatoffice(){
      
      this.gf.showLoadingwithtimeout();
      //this.navCtrl.navigateForward('/flightpaymentatoffice');
    }

    checkAllowRepay(){
      var se = this;
      return new Promise((resolve, reject) => {
        se.callCheckHoldTicket('',this.activityService.objRequestAddLuggage).then((check) => {
          let databkg = this.activityService.objRequestAddLuggage.dataSummaryBooking;
          let data = this.activityService.objRequestAddLuggage;
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


    paymentbiztravel(){
      if(this.bizTravelService.bizAccount.balanceAvaiable - this.activityService.objRequestAddLuggage.totalPrice<=0){
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
          var params = {memberid: this.jti, totalprice: this.activityService.objRequestAddLuggage.totalPrice};
          this.presentLoading();
          this.gf.checkAcceptBizCredit('POST', C.urls.baseUrl.urlMobile + '/api/Dashboard/CheckAcceptBizCredit', headers, params, 'companyinfo', 'GetBizTransactions').then((data) => {
            if(data && data.error == 0){
              this.bizTravelService.phoneOtp = data.phoneOtp;
              this.bizTravelService.phoneOtpShort = data.phoneOtpShort;
              this.bizTravelService.paymentType = 1;
              this.flightPayment().then((checkvalid) => {
                if(checkvalid){
                  this.navCtrl.navigateForward('orderrequestaddluggagepaymentdone');
                }
                
              })
              
            }else{
              this.gf.showToastWarning('Account hiện tại không có quyền thanh toán. Vui lòng kiểm tra lại.');
            }
          })
        }else{

        }
       
      })
    }

    flightPayment(): Promise<any>{
      return new Promise((resolve, reject) => {
        let itemcache = this.activityService.objRequestAddLuggage;
                  var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=companycredit&source=app&amount=' + itemcache.totalPrice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + this.bookingCode + '&buyerPhone=' + this.phone +'&memberId='+this.jti+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink'+'&version=2'+'&IsPartialPayment=true';
                  this.gf.CreatePayoo(url).then(datapayoo => {
                    //datapayoo = JSON.parse(datapayoo);
                    if (datapayoo.success) {
                      this.hideLoading();
                      resolve(true);
                    }else{
                      this.hideLoading();
                      resolve(false);
                      this.showAlertOutOfTicket();
                    }
                  })
      })
      
        
    }
  
    async showAlertOutOfTicket(){
      var se = this;
      let msg ='Thanh toán không thành công. Xin vui lòng thử lại sau!';
      let alert = await se.alertCtrl.create({
        message: msg,
        header: 'Rất tiếc, không mua được hành lý',
        cssClass: "cls-alert-refreshPrice",
        backdropDismiss: false,
        buttons: [
        {
          text: 'OK',
          role: 'OK',
          handler: () => {
            
          }
        }
      ]
    });
    alert.present();
    }

    rollBackObjectRequestAddLuggage(){
      if(this.activityService.objRequestAddLuggage && this.activityService.objRequestAddLuggage.objectDepartLuggage && this.activityService.objRequestAddLuggage.objectDepartLuggage.items  && this.activityService.objRequestAddLuggage.objectDepartLuggage.items.length >0){
        let urllug = C.urls.baseUrl.urlFlight + "gate/apiv1/AddBaggage";
        let  headers = {
          "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          'Content-Type': 'application/json; charset=utf-8',
        };
        let body = this.activityService.objRequestAddLuggage.objectDepartLuggage;
        body.isDelete = true;
        this.gf.RequestApi('POST', urllug, headers , body, 'orderrequestaddluggagepaymentselect', 'rollBackObjectRequestAddLuggage' ).then((data) => {
          if(data && data == "success"){
  
            if(this.activityService.objRequestAddLuggage.listPassReturn && this.activityService.objRequestAddLuggage.listPassReturn.some((p) => {return p.returnLuggage && p.returnLuggage.amount >0 })){
              let urllug = C.urls.baseUrl.urlFlight + "gate/apiv1/AddBaggage";
              let  headers = {
                "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                'Content-Type': 'application/json; charset=utf-8',
              };
              let body = this.activityService.objRequestAddLuggage.objectReturnLuggage;
              body.isDelete = true;
              this.gf.RequestApi('POST', urllug, headers , body, 'orderrequestaddluggagepaymentselect', 'rollBackObjectRequestAddLuggage' ).then((data1) => {
                if(data1 && data1 == "success"){
                  this.gf.hideLoading();
                }else{
                  this.gf.hideLoading();
                  this.gf.showAlertMessageOnly('Mua hành lý không thành công. Vui lòng liên hệ iVIVU để được hỗ trợ thêm!');
                }
              })
            }else{
              this.gf.hideLoading();
            }
          } else{
            this.gf.hideLoading();
            this.gf.showAlertMessageOnly('Mua hành lý không thành công. Vui lòng liên hệ iVIVU để được hỗ trợ thêm!');
          }
          
        })
      }
      else if(this.activityService.objRequestAddLuggage.listPassReturn && this.activityService.objRequestAddLuggage.listPassReturn.some((p) => {return p.returnLuggage && p.returnLuggage.amount >0 })){
        let urllug = C.urls.baseUrl.urlFlight + "gate/apiv1/AddBaggage";
        let  headers = {
          "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          'Content-Type': 'application/json; charset=utf-8',
        };
        let body = this.activityService.objRequestAddLuggage.objectReturnLuggage;
        body.isDelete = true;
        this.gf.RequestApi('POST', urllug, headers , body, 'orderrequestaddluggagepaymentselect', 'rollBackObjectRequestAddLuggage' ).then((data1) => {
          if(data1 && data1 == "success"){
            this.gf.hideLoading();
          } else{
            this.gf.hideLoading();
            this.gf.showAlertMessageOnly('Mua hành lý không thành công. Vui lòng liên hệ iVIVU để được hỗ trợ thêm!');
          }
        })
      }else{
        this.gf.hideLoading();
      }
    }
}
