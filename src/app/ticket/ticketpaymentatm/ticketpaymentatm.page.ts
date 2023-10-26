import { Bookcombo, ValueGlobal } from '../../providers/book-service';
import { Booking, RoomInfo, SearchHotel } from '../../providers/book-service';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform,AlertController } from '@ionic/angular';
import { C } from '../../providers/constants';

import { Storage } from '@ionic/storage';
import { GlobalFunction } from '../../providers/globalfunction';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from '../../providers/globalfunction';
import { ticketService } from 'src/app/providers/ticketService';
import { Browser } from '@capacitor/browser';

/**
 * Generated class for the ticketpaymentatmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-ticketpaymentatm',
  templateUrl: 'ticketpaymentatm.page.html',
  styleUrls: ['ticketpaymentatm.page.scss'],
})
export class TicketPaymentAtmPage implements OnInit {
  ischeck; timestamp; public ischeckbox;
  Avatar; Name; Address; cin; cout; dur; room; nameroom; jsonroom; ischecktext = true
  roomnumber; adults; children; breakfast; PriceAvgPlusTAStr; priceshow
  imgroom; roomtype; indexme; indexroom; cin1; cout1; checkpayment; book; id; pricetemp; hotelid
  public loader: any
  auth_token: any = '';arrbankrmb:any=[];totalPrice=0;bookingCode;isckb = false; TokenId;bankid="";jti;intervalID: NodeJS.Timeout;
  stt;isremember=true;isdisable=false;isshowRemember=false;
  sttbooking=0;
  phone: any;
  totalPriceNum: number;
  constructor(public navCtrl: NavController, private toastCtrl: ToastController, public booking: Booking,
    public Roomif: RoomInfo, public storage: Storage, public zone: NgZone, public searchhotel: SearchHotel,
    public loadingCtrl: LoadingController, public platform: Platform, public gf: GlobalFunction,public bookCombo:Bookcombo,
    private activatedRoute: ActivatedRoute,public activityService: ActivityService,public alertCtrl: AlertController,
    public valueGlobal: ValueGlobal,
    public ticketService: ticketService,
    ) {
    //google analytic
    gf.googleAnalytion('tourpaymentatm', 'load', '');
  }
  ngOnInit() {
    //this.bookingCode = this.ticketService.BookingTourMytrip ? this.ticketService.BookingTourMytrip.booking_id :this.ticketService.dataBookResponse.Code;
    //this.totalPrice=this.priceshow.toString().replace(/\./g, '').replace(/\,/g, '');
    this.stt = this.activatedRoute.snapshot.paramMap.get('stt');
    if (this.stt==0) {
      this.bookingCode=this.ticketService.itemTicketService.objbooking.bookingCode;
      this.totalPriceNum=this.ticketService.totalPriceNum
    }else{
      this.bookingCode=this.activityService.objPaymentMytrip.trip.booking_id;
      this.totalPriceNum=this.activityService.objPaymentMytrip.trip.priceShow.toString().replace(/\./g, '').replace(/\,/g, '');
    }
    this.storage.get('infocus').then(infocus => {
      if (infocus) {
        this.phone = infocus.phone;
      }
    })
    this.platform.ready().then(()=>{
      setTimeout(() => {
        clearInterval(this.intervalID);
    }, 1000 * 60 * 10);
    })
  }
  ionViewWillEnter() {
    this.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
    })
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
        this.isshowRemember=true;
        this.isremember=false;
        this.GeTokensOfMember();
      }
    })
  }
  next() {
    this.TokenId="";
    this.bankid="";
    this.arrbankrmb.forEach(element => {
      if (element.checked) {
        this.TokenId=element.id;
        this.bankid=element.vpc_Card;
      }
    });
    this.gf.showLoading();
    this.createBookingUrl(this.TokenId ? this.bankid : this.id);

  }
  ionViewWillLeave(){
  
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

    await Browser.open({ url: url});

    Browser.addListener('browserFinished', () => {
            se.gf.hideLoading();
            let url = C.urls.baseUrl.urlMobile + "/app/CRMOldApis/getBookingDetailByCode?bookingCode="+se.bookingCode+"";
            this.zone.run(() => {
              se.gf.CheckPaymentTicket(url).then((res) => {
                let checkpay = res;
                if (checkpay.response && checkpay.response.payment_status == 5) {
                  se.ticketService.paymentType = 1;
                  Browser.close();
                  clearInterval(se.intervalID);
                  let objbookTicket={
                    bookingCode : this.bookingCode,
                    paymentMethod: 2
                }
                this.gf.ticketPaymentSave(objbookTicket);
                if (this.stt==0) {
                  se.navCtrl.navigateForward('ticketpaymentdone/0');
                }
                else{
                  se.navCtrl.navigateForward('ticketpaymentdone/1');
                }
                }
                else if (checkpay.response && checkpay.response.payment_status == 2) {
      
                  Browser.close();
                  clearInterval(se.intervalID);
                  this.gf.showAlertTourPaymentFail(checkpay.internalNote);
                }
              })
            })
           } );
        se.callSetInterval();
      se.gf.logEventFirebase('atm', se.ticketService, 'ticketpaymentatm', 'add_payment_info', 'Ticket');
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
  ionViewDidLoad() {

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
    if((this.Roomif.point && this.Roomif.bookingCode) || (this.Roomif.promocode && this.Roomif.bookingCode))
    {
      this.navCtrl.navigateBack('/roomdetailreview');
    }else{
      this.navCtrl.back();
    }
  }
  async presentToastr(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
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
      this.id="";
    }
    else{
      item.checked = false;
      ev.target.checked = false;
      ev.target.classList.remove("radio-checked");
    }
  
  }

  createBookingUrl(bankid) {
    let se = this;
    let url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=atm&source=app&amount=' + this.totalPriceNum + '&orderCode=' + this.bookingCode + '&buyerPhone=' +se.phone + '&memberId=' + se.jti + '&TokenId='+(se.TokenId ? se.TokenId : '') +'&rememberToken='+ '&BankId=' + bankid +(se.isremember ? se.isremember : 'false')+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink'+'&version=2';
          se.gf.CreatePayoo(url).then(datapayoo => {
            if(datapayoo.success){
              se.zone.run(()=>{
                setTimeout(()=> {
                  se.callSetInterval();
                },5000)
              })
              se.gf.hideLoading();
              se.openWebpage(datapayoo.returnUrl);
            }
            else{
              se.showAlertPaymentError();
              se.gf.hideLoading();
            }
          })
  }

  async showAlertPaymentError(){
    var se = this;
    let msg ='Thanh toán không thành công. Xin vui lòng thử lại sau!';
    let alert = await se.alertCtrl.create({
      message: msg,
      header: 'Rất tiếc, đã có lỗi xảy ra',
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
  
  async showAlertMessageOnly(msg){
    let alert = await this.alertCtrl.create({
      header: '',
      message: 'Mã đăng nhập đã hết hạn, vui lòng đăng nhập lại!',
      cssClass: "cls-alert-message",
      backdropDismiss: false,
      buttons: [
      {
        text: 'OK',
        role: 'OK',
        handler: () => {
          this.valueGlobal.logingoback = '/roomdetailreview';
          this.navCtrl.navigateForward('/login');
          alert.dismiss();
        }
      }
      ]
    });
    alert.present();
  }

   
  callSetInterval()
  {
    var se = this;
    if (this.loader) {
      this.loader.dismiss();
    }
    //clearInterval(this.intervalID);
    this.intervalID = setInterval(() => {
      let url = C.urls.baseUrl.urlMobile + "/app/CRMOldApis/getBookingDetailByCode?bookingCode="+se.bookingCode+"";
      this.zone.run(() => {
        se.gf.CheckPaymentTicket(url).then((res) => {
          let checkpay = res;
          if (checkpay.response && checkpay.response.payment_status == 5) {
            se.ticketService.paymentType = 1;
            Browser.close();
            clearInterval(se.intervalID);
            let objbookTicket={
              bookingCode : this.bookingCode,
              paymentMethod: 2
          }
          this.gf.ticketPaymentSave(objbookTicket);
          if (this.stt==0) {
            se.navCtrl.navigateForward('ticketpaymentdone/0');
          }
          else{
            se.navCtrl.navigateForward('ticketpaymentdone/1');
          }
          }
          else if (checkpay.response && checkpay.response.payment_status == 2) {

            Browser.close();
            clearInterval(se.intervalID);
            this.gf.showAlertTourPaymentFail(checkpay.internalNote);
          }
        })
      })
      
    }, 5000 * 1);

    setTimeout(() => {
      clearInterval(this.intervalID);
    }, 60000 * 10.5);
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
  rememberCard(){
    this.isremember=!this.isremember
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
          this.Roomif.promocode="";
          this.navCtrl.navigateForward('/roomdetailreview');
        }
      }
      ]
    });
    alert.present();
  }
}

