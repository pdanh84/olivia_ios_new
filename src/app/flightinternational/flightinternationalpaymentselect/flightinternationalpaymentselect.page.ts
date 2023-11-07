import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, LoadingController, Platform, ModalController, AlertController } from '@ionic/angular';
import { C } from '../../providers/constants';

import { Storage } from '@ionic/storage';

import { ActivityService, GlobalFunction } from '../../providers/globalfunction';
import * as moment from 'moment';
import { flightService } from '../../providers/flightService';
import { FlightBookingDetailsPage } from '../../flightbookingdetails/flightbookingdetails.page';
import { FlightquickbackPage } from '../../flightquickback/flightquickback.page';
import { BizTravelService } from '../../providers/bizTravelService';
import { voucherService } from '../../providers/voucherService';
import { FlightDetailInternationalPage } from '../flightdetailinternational/flightdetailinternational.page';
import { SearchHotel } from 'src/app/providers/book-service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-flightinternationalpaymentselect',
  templateUrl: './flightinternationalpaymentselect.page.html',
  styleUrls: ['./flightinternationalpaymentselect.page.scss'],
})
export class FlightInternationalPaymentSelectPage implements OnInit {
  priceshow; listmenu:any = []; arrmenu; ischeckvisa = false
  public loader: any; returnUrl; arrbankrmb:any = [];tokenid
  bookingCode = ""; startDate; endDate; ischeckpay = true; jti='';isbtn=false;
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
  checkInDisplayFullYear: string;
  checkOutDisplayFullYear: string;
  isremember=true;isdisable=false;
  checkInDisplay: string;
  checkOutDisplay: string;
  totalPaxStr: string;
  totalRoom: string;
  ischeckedDK=true;
  totalPrice: number;
  allowApplyVoucher: boolean=true;
  isPaymentMytrip: boolean = false;
  private _inAppBrowser: any;
  _windowmomo: any;
  dataServiceFee:any = [];
  dataSF: any;
  constructor(private navCtrl:NavController,public _flightService: flightService
    ,public gf: GlobalFunction, public loadingCtrl: LoadingController
    ,public searchhotel:SearchHotel, public storage: Storage,
    private modalCtrl: ModalController,
    private platform: Platform,
    private alertCtrl: AlertController,
    private zone: NgZone,
    public bizTravelService: BizTravelService,
    public _voucherService: voucherService,
    public activityService: ActivityService,
    ) { 
    if(this.activityService.objPaymentMytrip && this._flightService.itemFlightCache.dataSummaryBooking){
      this.isPaymentMytrip = true;
      this.showline = this._flightService.itemFlightCache.dataSummaryBooking.isRoundTrip ? true : false;
      this.bookingCode =  this._flightService.itemFlightCache.dataSummaryBooking.reservationNo;
      this.startDate = moment(this.activityService.objPaymentMytrip.checkInDate).format('YYYY-MM-DD');
      this.endDate = moment(this.activityService.objPaymentMytrip.checkOutDate).format('YYYY-MM-DD');
      this.loadCheckPayment();
     
      this.adult = this._flightService.itemFlightCache.dataSummaryBooking.adult;
      this.child = this._flightService.itemFlightCache.dataSummaryBooking.child;
      this.infant = this._flightService.itemFlightCache.dataSummaryBooking.infant;
      this.totalpricedisplay= this.gf.convertNumberToString(this._flightService.itemFlightCache.dataSummaryBooking.totalPrice);
      this.totalPrice = this.gf.convertStringToNumber(this._flightService.itemFlightCache.dataSummaryBooking.totalPrice);
      this._flightService.itemFlightCache.totalPriceDisplay = this.totalpricedisplay;
      this._flightService.itemFlightCache.totalPrice = this.totalPrice;
      this._flightService.itemFlightCache.phone = this.activityService.objPaymentMytrip.cus_phone;
      let objday:any = this.gf.getDayOfWeek(this.startDate);
        let objdayreturn:any = this.gf.getDayOfWeek(this.endDate);
      this._flightService.itemFlightCache.departPaymentTitleDisplay = objday.daynameshort + ", " + moment(this.startDate).format("DD-MM")+ " · " + this._flightService.itemFlightCache.dataSummaryBooking.departFlight.fromPlaceCode + " - " + this._flightService.itemFlightCache.dataSummaryBooking.departFlight.toPlaceCode + " · ";
      this._flightService.itemFlightCache.returnPaymentTitleDisplay = objdayreturn.daynameshort + ", " + moment(this.endDate).format("DD-MM")+ " · "+ this._flightService.itemFlightCache.dataSummaryBooking.departFlight.toPlaceCode + " - " + this._flightService.itemFlightCache.dataSummaryBooking.departFlight.fromPlaceCode + " · ";

      this.departtitle = this._flightService.itemFlightCache.departPaymentTitleDisplay + moment(this._flightService.itemFlightCache.dataSummaryBooking.departFlightData.departTime).format("HH:mm") + " - " + moment(this._flightService.itemFlightCache.dataSummaryBooking.departFlightData.landingTime).format("HH:mm")+ " · " +this._flightService.itemFlightCache.dataSummaryBooking.departFlightData.airlineCode;
      
      if(this._flightService.itemFlightCache.dataSummaryBooking.returnFlightData){
          this.returntitle = this._flightService.itemFlightCache.returnPaymentTitleDisplay + moment(this._flightService.itemFlightCache.dataSummaryBooking.returnFlightData.departTime).format("HH:mm") + " - " + moment(this._flightService.itemFlightCache.dataSummaryBooking.returnFlightData.landingTime).format("HH:mm")+ " · " +this._flightService.itemFlightCache.dataSummaryBooking.returnFlightData.airlineCode; 
      }
      
      this.itemflight = this._flightService.itemFlightCache;
      this.checkInDisplayFullYear = this.itemflight.departPaymentTitleDisplay +", "+ moment(this._flightService.itemFlightCache.dataSummaryBooking.departFlightData.departTime).format("YYYY");
      if(this._flightService.itemFlightCache.dataSummaryBooking.returnFlightData){
        this.checkOutDisplayFullYear = this.itemflight.returnPaymentTitleDisplay + ", " + moment(this._flightService.itemFlightCache.dataSummaryBooking.returnFlightData.departTime).format("YYYY");
      }
    }
    else if(this._flightService.itemFlightCache){
      this.showline = this._flightService.itemFlightCache.roundTrip ? true : false;
      this.bookingCode =  this._flightService.itemFlightCache.pnr.resNo;
      this.startDate = moment(this._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');
      this.endDate = moment(this._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD');
      if(this._flightService.itemFlightCache.pnr){
        this.blockPaylate = this._flightService.itemFlightCache.pnr.blockPaylate;
        this.blockPayCard = this._flightService.itemFlightCache.pnr.blockPayCard;
      }
     
      this.adult = this._flightService.itemFlightCache.adult;
      this.child = this._flightService.itemFlightCache.child;
      this.infant = this._flightService.itemFlightCache.infant;
      // this.totalpricedisplay= this.gf.convertNumberToString(this._flightService.itemFlightInternational.fare.price);
      // this.totalPrice = this.gf.convertStringToNumber(this._flightService.itemFlightInternational.fare.price);
      this.totalPrice = this.gf.convertStringToNumber(this._flightService.itemFlightInternational.fare.price);
      if(this._flightService.itemFlightInternational.promotionCode){
        this._flightService.itemFlightInternational.hasvoucher = this._flightService.itemFlightInternational.promotionCode;
        this.totalPrice = this.totalPrice - this._flightService.itemFlightInternational.discountpromo;
      }
      if(this.totalPrice <=0){
        this.totalPrice =0;
      }
      this.totalpricedisplay= this.gf.convertNumberToString(this.totalPrice);
      if(!this.totalpricedisplay){
        this.totalpricedisplay ='0';
      }
      this._flightService.itemFlightCache.totalPriceDisplay = this.totalpricedisplay;
      this._flightService.itemFlightCache.totalPrice = this.totalPrice;
      
      this._flightService.itemFlightCache.totalPriceDisplay = this.totalpricedisplay;
      this._flightService.itemFlightCache.totalPrice = this.totalPrice;
      this.departtitle = this._flightService.itemFlightCache.departPaymentTitleDisplay + moment(this._flightService.itemFlightCache.itemFlightInternationalDepart.departTime).format("HH:mm") + " - " + moment(this._flightService.itemFlightCache.itemFlightInternationalDepart.landingTime).format("HH:mm")+ " · " +this._flightService.itemFlightCache.itemFlightInternationalDepart.airlineCode;
      
      if(this._flightService.itemFlightCache.itemFlightInternationalReturn){
          this.returntitle = this._flightService.itemFlightCache.returnPaymentTitleDisplay + moment(this._flightService.itemFlightCache.itemFlightInternationalReturn.departTime).format("HH:mm") + " - " + moment(this._flightService.itemFlightCache.itemFlightInternationalReturn.landingTime).format("HH:mm")+ " · " +this._flightService.itemFlightCache.itemFlightInternationalReturn.airlineCode; 
      }
      
      this.itemflight = this._flightService.itemFlightCache;
      this.checkInDisplayFullYear = this.itemflight.departTimeDisplay +", "+ moment(this._flightService.itemFlightCache.itemFlightInternationalDepart.departTime).format("YYYY");
      if(this._flightService.itemFlightCache.itemFlightInternationalReturn){
        this.checkOutDisplayFullYear = this.itemflight.returnTimeDisplay + ", " + moment(this._flightService.itemFlightCache.itemFlightInternationalReturn.departTime).format("YYYY");
      }
    }

    this._flightService.itemFlightCache.bookingCode = this.bookingCode;
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

            this.gf.RequestApi('GET', C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo', headers, {}, 'flightinternationalpaymentselect', 'initpage').then((data)=>{
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

          //pdanh 20-07-2023: call api tính phí dịch vụ
          let url = `${C.urls.baseUrl.urlMobile}/api/Data/getaddonpaymentfee?applyFor=vmb&totalPrice=${this.totalPrice}`;
          this.gf.RequestApi('GET', url, {}, {}, 'flightpaymentselect', 'getaddonpaymentfee').then((data)=>{
            if(data && data.length >0){
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

    C.writePaymentLog("flightinternational", "paymentselect", "purchase", this.bookingCode);
  }

  async loadCheckPayment(){
    let datacheck = await this.gf.checkAllowPayment(this.bookingCode);
    this.blockPayCard = datacheck.response.blockPaymentCard;
    this.blockPaylate = datacheck.response.blockPaymentLate;
  }

  checkpayment()
  {
    var ti = new Date();
    var thu=moment(ti).format('dddd');
    var hours = moment(ti).format('HHmm');
    if (thu=='Friday') {
      if (parseInt(hours)>=2100) {
        this.ischeckpay=false;
      }
    }
    else if(thu=='Saturday'||thu=='Sunday')
    {
      this.ischeckpay=false;
    }
  }
  ngOnInit() {
  }
  gobackpage(){
    this.gf.hideLoading();
    this.navCtrl.navigateBack('flightadddetailsinternational');
  }
  gotoaddservicepage(){
    this.gf.hideLoading();
    this.navCtrl.navigateBack('flightadddetailsinternational');
  }

  goback()
  {
    var se = this;
    if(se.activityService.objPaymentMytrip && se._flightService.itemFlightCache.dataSummaryBooking){
      this.navCtrl.pop();
    }else{
      this.navCtrl.navigateBack('flightadddetailsinternational');
    }
    
      
  }


  
  
  flightpaymentbank()
  {
    if(this.blockPaylate){
      return;
    }
    //this.presentLoading();
    this._flightService.itemFlightCache.paymentType = 'banktransfer';
    this.navCtrl.navigateForward('flightinternationalpaymentbank');
    // this.checkAllowRepay().then((check) => {
    //   if(check){
    //     clearInterval(this.intervalID);
    //     this.navCtrl.navigateForward('flightpaymentbank');
    //     this.hideLoading();
    //   }else{
    //     this.gf.checkTicketAvaiable(this._flightService.itemFlightCache).then((check) =>{
    //       if(check){
    //         clearInterval(this.intervalID);
    //         this.navCtrl.navigateForward('flightpaymentbank');
    //         this.hideLoading();
    //       }else{
    //         this.gf.showAlertOutOfTicketInternational(this._flightService.itemFlightCache, 1);
    //         clearInterval(this.intervalID);
    //         this.hideLoading();
    //       }
    //     })
    //   }
    // })
    
  }
  flightpaymentatm()
  {
    if(this.blockPayCard){
      return;
    }
    this._flightService.itemFlightCache.paymentType = 'atm';
    this.navCtrl.navigateForward('flightinternationalpaymentchoosebank');
  }
  flightpaymentvisa() {
    if(this.blockPayCard){
      return;
    }
    this._flightService.itemFlightCache.paymentType = 'visa';
    this.GeTokensOfMember(1);
  }
  async openWebpage(url: string) {
    var se = this;
    se.gf.logEventFirebase(se._flightService.itemFlightCache.paymentType, se._flightService.itemFlightCache, 'flightsearchresultinternational', 'add_payment_info', 'Flights');
    await Browser.open({ url: url})

      Browser.addListener('browserFinished', () => {
      if((this._voucherService.voucherSelected && this._voucherService.voucherSelected.length >0) || (this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0)){
        this._flightService.itemFlightCache.listVouchersAlreadyApply = [...this._voucherService.voucherSelected, ...this._voucherService.listPromoCode];
      }
                  let url = C.urls.baseUrl.urlFlight + "gate/apiv1/PaymentCheck?id="+ (se._flightService.itemFlightCache.reservationId ? se._flightService.itemFlightCache.reservationId : se.bookingCode);
                  se.gf.Checkpayment(url).then((checkpay) => {
                    if (checkpay.ipnCall == "CALLED_OK") { 
                      se._flightService.itemFlightCache.ischeckpayment= 1;
                      se.gf.hideLoading();
                      Browser.close();
                      clearInterval(se.intervalID);
                      se.navCtrl.navigateForward('flightinternationalpaymentdone/'+se.bookingCode+'/'+se.startDate+'/'+se.endDate);
                    }
                    else
                    {
                      se.gf.hideLoading();
                      Browser.close();
                      clearInterval(se.intervalID);
                      se._flightService.paymentError = checkpay;
                      if(this._flightService.itemFlightCache.listVouchersAlreadyApply && this._flightService.itemFlightCache.listVouchersAlreadyApply.length >0){
                        let strpromocode = this._flightService.itemFlightCache.listVouchersAlreadyApply.map(v => v.code).join(', ');
                        this.alertMessage(`Mã giảm giá ${strpromocode} đã được dùng cho booking ${this._flightService.itemFlightCache.pnr.resNo}. Vui lòng thao tác lại booking!`);
                      }else{
                        se.navCtrl.navigateForward('/flightinternationalpaymenttimeout/0');
                      }
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
    if(this.blockPayCard){
      return;
    }
    this._flightService.itemFlightCache.paymentType = 'momo';
    this.presentLoading();
              this.gf.updatePaymentMethod(this._flightService.itemFlightCache, 4, "","").then(datatype => {
                if (datatype && datatype.isHoldSuccess) {
                    let itemcache = this._flightService.itemFlightCache;
                    if((this._voucherService.voucherSelected && this._voucherService.voucherSelected.length >0) || (this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0)){
                      this._flightService.itemFlightCache.listVouchersAlreadyApply = [...this._voucherService.voucherSelected, ...this._voucherService.listPromoCode];
                    }
                    var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=momo&source=app&amount=' + this._flightService.itemFlightCache.totalPrice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + this.bookingCode + '&buyerPhone=' + itemcache.phone +'&rememberToken='+this.isremember+'&callbackUrl=ivivuapp%3A%2F%2Fapp%2Fhomeflight'+ '&memberId=' + this.jti+'&version=2';
                    this.gf.CreatePayoo(url).then((data) => {
                      if (data.success) {
                        this._flightService.itemFlightCache.periodPaymentDate = data.periodPaymentDate;
                        //this.openWebpage(data.returnUrl.payUrl);
                        //this._windowmomo = window.open(data.returnUrl.payUrl, '_system');
                        Browser.open({url : data.returnUrl.payUrl});
                        this.zone.run(()=>{
                          this.setinterval(null);
                        })
                      }else{
                        this.hideLoading();
                        this.gf.showAlertOutOfTicketInternational(this._flightService.itemFlightCache, 2);
                      }
                    })
                  }else{
                    this.gf.showAlertOutOfTicketInternational(this._flightService.itemFlightCache, 2);
                    clearInterval(this.intervalID);
                    this.hideLoading();
                  }
                })
  }

  setinterval(timeout)
  {
    if (this.loader) {
      this.loader.dismiss();
    }
    clearInterval(this.intervalID);
    this.intervalID = setInterval(() => {
    
        let url = C.urls.baseUrl.urlFlight + "gate/apiv1/PaymentCheck?id="+ (this._flightService.itemFlightCache.reservationId ? this._flightService.itemFlightCache.reservationId : this.bookingCode);
        this.zone.run(()=>{
          this.gf.Checkpayment(url).then((checkpay) => {
            //var checkpay=JSON.parse(data);
            if (checkpay.ipnCall == "CALLED_OK") {
            
              this._flightService.itemFlightCache.ischeckpayment= 1;
              this.hideLoading();
              this.gf.hideLoading();
              //this._inAppBrowser.close();
              Browser.close();
              if(this._windowmomo){
                this._windowmomo.close();
              }
              clearInterval(this.intervalID);
             
              this.navCtrl.navigateForward('flightinternationalpaymentdone/'+this.bookingCode+'/'+this.startDate+'/'+this.endDate);
            }
            else if(checkpay.ipnCall == "CALLED_TIMEOUT" || checkpay.ipnCall == "CALLED_FAIL")//case timeout
            {
              this.hideLoading();
              this.gf.hideLoading();
              //this._inAppBrowser.close();
              Browser.close();
              if(this._windowmomo){
                this._windowmomo.close();
              }
              clearInterval(this.intervalID);
              this._flightService.paymentError = checkpay;
              this.navCtrl.navigateForward('/flightinternationalpaymenttimeout/0');
            }
          })
        })
      
    }, 1000 * 1);
    setTimeout(() => {
      clearInterval(this.intervalID);
     
    }, timeout ? timeout : 60000 * 9.1);
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
          //this.presentLoading();
          if (this.bookingCode) {
            this.NoCreateBooking();
          } 
        } 
      }
    })
  }
  next() {
    if(this.blockPayCard){
      return;
    }
    this._flightService.itemFlightCache.paymentType = 'visa';
    //this.presentLoading();
    if (this.bookingCode) {
      this.NoCreateBooking();
    }
  }
  chooseacc(item)
  {
    if(this.blockPayCard){
      return;
    }
    this.tokenid=item.id;
    this.isbtn=true;
    this.isdisable=true;
    this.isremember=true;
  }
  nochooseacc()
  {
    if(this.blockPayCard){
      return;
    }
    this.tokenid="";
    this.isbtn=true;
    this.isdisable=false;
    this.isremember=true;
  }
  
  NoCreateBooking()
  {
    var se=this;
    se.presentLoading();
          se.gf.updatePaymentMethod(se._flightService.itemFlightCache, 3, "","").then(datatype => {
            if (datatype && datatype.isHoldSuccess) {
             
              let itemcache = se._flightService.itemFlightCache;
              if((this._voucherService.voucherSelected && this._voucherService.voucherSelected.length >0) || (this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0)){
                this._flightService.itemFlightCache.listVouchersAlreadyApply = [...this._voucherService.voucherSelected, ...this._voucherService.listPromoCode];
              }
                  let url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=visa&source=app&amount=' + this._flightService.itemFlightCache.totalPrice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + se.bookingCode + '&buyerPhone=' +itemcache.phone + '&memberId=' + se.jti + '&TokenId='+se.tokenid+'&rememberToken='+se.isremember+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink'+'&version=2&isFlightInt=true';
                  se.gf.CreatePayoo(url).then((data) => {
                   
                    if(data.success){
                  
                      se._flightService.itemFlightCache.periodPaymentDate = data.periodPaymentDate;
                        se._flightService.itemFlightCache.ischeckpayment = 1;
                        se.openWebpage(data.returnUrl);
                        se.setinterval(null);
                    }else{
                      se.gf.showAlertOutOfTicketInternational(se._flightService.itemFlightCache, 2);
                      se.hideLoading();
                    }
                    
                  })
                }else{
                  se.gf.showAlertOutOfTicketInternational(se._flightService.itemFlightCache, 2);
                  clearInterval(se.intervalID);
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
    if(this.blockPaylate){
      return;
    }
    this._flightService.itemFlightCache.paymentType = 'payoo';
    this.gf.updatePaymentMethod(this._flightService.itemFlightCache, 5, "","").then(datatype => {
      if (datatype && datatype.isHoldSuccess) {
        this.presentLoading();
            let itemcache = this._flightService.itemFlightCache;
            if((this._voucherService.voucherSelected && this._voucherService.voucherSelected.length >0) || (this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0)){
              this._flightService.itemFlightCache.listVouchersAlreadyApply = [...this._voucherService.voucherSelected, ...this._voucherService.listPromoCode];
            }
              var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=payoo_store&source=app&amount=' + this._flightService.itemFlightCache.totalPrice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + this.bookingCode + '&rememberToken='+this.isremember+'&buyerPhone=' + itemcache.phone+ '&memberId=' + this.jti+'&version=2&isFlightInt=true';
              this.gf.CreatePayoo(url).then((data) => {
                this.hideLoading();
                //let data = JSON.parse(datapayoo);
                if (data.success) {
                  this.gf.logEventFirebase(this._flightService.itemFlightCache.paymentType, this._flightService.itemFlightCache, 'flightsearchresultinternational', 'add_payment_info', 'Flights');
                  this._flightService.itemFlightCache.BillingCode = data.payooStoreData.BillingCode;
                  this._flightService.itemFlightCache.periodPaymentDate = data.payooStoreData.periodPayment;
                  console.log(this._flightService.itemFlightCache.periodPaymentDate);
                  if (this.loader) {
                    this.loader.dismiss();
                  }
                  this.navCtrl.navigateForward('flightinternationalpaymentpayoo/' + this.bookingCode + '/0');
                }else{
                  this.hideLoading();
                  this.gf.showAlertOutOfTicketInternational(this._flightService.itemFlightCache, 2);
                  clearInterval(this.intervalID);
                }
              })
            }else{
              this.gf.showAlertOutOfTicketInternational(this._flightService.itemFlightCache, 2);
              clearInterval(this.intervalID);
              this.hideLoading();
            }
        })
   
  }
  flightpaymentpayooqr() {
    if(this.blockPayCard){
      return;
    }
    this._flightService.itemFlightCache.paymentType = 'payoo';
    this.presentLoading();
    this.gf.updatePaymentMethod(this._flightService.itemFlightCache, 6, "","").then(datatype => {
      if (datatype && datatype.isHoldSuccess) {
        let itemcache = this._flightService.itemFlightCache;
        let totalprice = itemcache.totalPrice;
        if((this._voucherService.voucherSelected && this._voucherService.voucherSelected.length >0) || (this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0)){
          this._flightService.itemFlightCache.listVouchersAlreadyApply = [...this._voucherService.voucherSelected, ...this._voucherService.listPromoCode];
        }
        var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=payoo_qr&source=app&amount=' + totalprice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + this.bookingCode + '&rememberToken='+this.isremember+'&buyerPhone=' + itemcache.phone+ '&memberId=' + this.jti+'&version=2&isFlightInt=true';
        this.gf.CreatePayoo(url).then((data) => {
          this.hideLoading();
          if (data.success) {
            this.gf.logEventFirebase(this._flightService.itemFlightCache.paymentType, this._flightService.itemFlightCache, 'flightsearchresultinternational', 'add_payment_info', 'Flights');
            this._flightService.itemFlightCache.periodPaymentDate = data.periodPaymentDate;
            this._flightService.itemFlightCache.qrimg = data.payooQrData.QRCodeUrl;
            this.navCtrl.navigateForward('flightinternationalpaymentpayoo/' + this.bookingCode + '/1');
          }else{
            this.hideLoading();
            this.gf.showAlertOutOfTicketInternational(this._flightService.itemFlightCache, 2);
          }
        })
      }else{
        this.gf.showAlertOutOfTicketInternational(this._flightService.itemFlightCache, 2);
        clearInterval(this.intervalID);
        this.hideLoading();
      }
    })
    
  }

  callCheckPayment(){
    var se = this;
      se.checkpayment();
  }

  checkPayment(){
    var se = this;
    //if(se._flightService.itemFlightCache && se._flightService.itemFlightCache.reservationId){
      let url = C.urls.baseUrl.urlFlight + "gate/apiv1/PaymentCheck?id="+(se._flightService.itemFlightCache.reservationId ? se._flightService.itemFlightCache.reservationId : se.bookingCode);
      se.gf.Checkpayment(url).then((checkpay) => {
        //var checkpay=JSON.parse(data);
        if (checkpay.status == 0) {
          setTimeout(()=>{
            se.callCheckPayment();
          },1000)
        }
       
        else if(checkpay.ipnCall == "CALLED_FAIL" && checkpay.errorCode == '99')//hủy
                  {
                    se.hideLoading();
                    se.gf.hideLoading();
                    Browser.close();
                    clearInterval(se.intervalID);
                    se.navCtrl.navigateForward('/flightinternationalpaymenterror');
                  }
                  else if(checkpay.ipnCall == "CALLED_TIMEOUT" && checkpay.errorCode == '253')//case timeout
                  {
                    se.hideLoading();
                    se.gf.hideLoading();
                    Browser.close();
                    clearInterval(se.intervalID);
                    if(this._flightService.itemFlightCache.listVouchersAlreadyApply && this._flightService.itemFlightCache.listVouchersAlreadyApply.length >0){
                        let strpromocode = this._flightService.itemFlightCache.listVouchersAlreadyApply.map(v => v.code).join(', ');
                        this.alertMessage(`Mã giảm giá ${strpromocode} đã được dùng cho booking ${this._flightService.itemFlightCache.pnr.resNo}. Vui lòng thao tác lại booking!`);
                      }else{
                        se.navCtrl.navigateForward('/flightinternationalpaymenttimeout/0');
                      }
                  }
        else{
            se._flightService.itemFlightCache.ischeckpayment= 1;
            //se.checkHoldTicket(se._flightService.itemFlightCache);
        }
      })
    //}
    
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
      if(this.blockPaylate){
        return;
      }
      this._flightService.itemFlightCache.paymentType = 'office';
      this.gf.showLoading();
      this.navCtrl.navigateForward('/flightinternationalpaymentatoffice');
    }

 
    rememberCard(){
      this.isremember=!this.isremember
    }

    paymentbiztravel(){
      if(this.bizTravelService.bizAccount.balanceAvaiable - this._flightService.itemFlightCache.totalPrice<=0){
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
          var params = {memberid: this.jti, totalprice: this._flightService.itemFlightCache.totalPrice};
          this.presentLoading();
          this.gf.checkAcceptBizCredit('POST', C.urls.baseUrl.urlMobile + '/api/Dashboard/CheckAcceptBizCredit', headers, params, 'companyinfo', 'GetBizTransactions').then((data) => {
            if(data && data.error == 0){
              this.bizTravelService.phoneOtp = data.phoneOtp;
              this.bizTravelService.phoneOtpShort = data.phoneOtpShort;
              this.bizTravelService.paymentType = 1;
              this.flightPayment().then((checkvalid) => {
                if(checkvalid){
                  this.bizTravelService.routeBackWhenCancel = 'flightsearchresultinternational';
                  this.navCtrl.navigateForward('confirmpayment');
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
        this.gf.checkTicketAvaiable(this._flightService.itemFlightCache).then((check) =>{
          if(check){
                  let itemcache = this._flightService.itemFlightCache;
                  if((this._voucherService.voucherSelected && this._voucherService.voucherSelected.length >0) || (this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0)){
                    this._flightService.itemFlightCache.listVouchersAlreadyApply = [...this._voucherService.voucherSelected, ...this._voucherService.listPromoCode];
                  }
                  var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=companycredit&source=app&amount=' + this._flightService.itemFlightCache.totalPrice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + this.bookingCode + '&buyerPhone=' + itemcache.phone +'&memberId='+this.jti+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink'+'&version=2&isFlightInt=true';
                  this.gf.CreatePayoo(url).then((data) => {
                    //let data = JSON.parse(datapayoo);
                    if (data.success) {
                      // if(this._voucherService.selectVoucher){
                      //   this._voucherService.rollbackSelectedVoucher.emit(this._voucherService.selectVoucher);
                      //   this._voucherService.publicClearVoucherAfterPaymentDone(1);
                      //   this._voucherService.selectVoucher = null;
                      // }
                      this.hideLoading();
                      resolve(true);
                    }else{
                      this.hideLoading();
                      resolve(false);
                      this.showAlertOutOfTicketInternational(this._flightService.itemFlightCache, 2);
                    }
                  })
            }else{
              this.hideLoading();
              resolve(false);
              this.showAlertOutOfTicketInternational(this._flightService.itemFlightCache, 1);
            }
          })
      })
      
        
    }
  
    async showAlertOutOfTicketInternational(itemFlight, type){
      var se = this;
      let msg ='';
      if(itemFlight.errorHoldTicket == 1){
          msg = 'Chuyến bay '+itemFlight.departFlight.airlineCode + ' từ ' + itemFlight.departCity + ' đi ' + itemFlight.returnCity + ' vào ' + itemFlight.checkInDisplay + ' lúc ' + moment(itemFlight.departFlight.departTime).format('HH:mm') + ' → ' + moment(itemFlight.departFlight.landingTime).format('HH:mm') + ' đã hết vé. Vui lòng chọn chuyến bay khác.';
      }
      else if(itemFlight.errorHoldTicket == 2){
          msg = 'Chuyến bay '+itemFlight.returnFlight.airlineCode + ' từ ' + itemFlight.returnCity + ' đi ' + itemFlight.departCity + ' vào ' + itemFlight.checkOutDisplay + ' lúc ' + moment(itemFlight.returnFlight.departTime).format('HH:mm') + ' → ' + moment(itemFlight.returnFlight.landingTime).format('HH:mm') + ' đã hết vé. Vui lòng chọn chuyến bay khác.';
      }
      else{
          msg = 'Các chuyến bay đã chọn không giữ được vé. Vui lòng chọn chuyến bay khác!';
      }
      //let msg = 'Chuyến bay '+itemFlight.departFlight.airlineCode + ' từ ' + itemFlight.departCity + ' đi ' + itemFlight.returnCity + ' vào ' + itemFlight.checkInDisplay + ' lúc ' + moment(itemFlight.departFlight.departTime).format('HH:mm') + ' → ' + moment(itemFlight.departFlight.landingTime).format('HH:mm') + ' đã hết vé. Vui lòng chọn chuyến bay khác.';
      let alert = await se.alertCtrl.create({
        message: msg,
        header: type == 1 ? 'Rất tiếc, vé máy bay đã hết' : 'Rất tiếc, vé không giữ được',
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
    async showPriceDetail(){
      if(this._flightService.itemFlightInternational){
        let itemd = this._flightService.itemFlightInternational.departFlights.filter((id)=>{return id.ischeck});
        let itemr = this._flightService.itemFlightInternational.returnFlights.filter((ir)=>{return ir.ischeck});
        this._flightService.itemFlightCache.itemFlightInternationalDepart = itemd[0];
        this._flightService.itemFlightCache.itemFlightInternationalReturn = itemr[0];
  
          const modal: HTMLIonModalElement =
          await this.modalCtrl.create({
            component: FlightDetailInternationalPage,
          });
        modal.present();
      }
      
    }

    async openWebpageDK(url: string) {
      var se = this;
      await Browser.open({ url: url});
    }

    flightbuynowpaylater(){
      var se=this;
      se.presentLoading();
      se._flightService.itemFlightCache.paymentType = 'bnpl';
      let itemcache = se._flightService.itemFlightCache;
      if((this._voucherService.voucherSelected && this._voucherService.voucherSelected.length >0) || (this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0)){
        this._flightService.itemFlightCache.listVouchersAlreadyApply = [...this._voucherService.voucherSelected, ...this._voucherService.listPromoCode];
      }
          let url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=bnpl&source=app&amount=' + this._flightService.itemFlightCache.totalPrice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + se.bookingCode + '&buyerPhone=' +itemcache.phone + '&memberId=' + se.jti + '&TokenId='+se.tokenid+'&rememberToken='+se.isremember+'&BankId=bnpl'+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink'+'&version=2&isFlightInt=true';
          se.gf.CreatePayoo(url).then((data) => {
            if(data.success){
              se._flightService.itemFlightCache.periodPaymentDate = data.periodPaymentDate;
                se._flightService.itemFlightCache.ischeckpayment = 1;
                se.openWebpage(data.returnUrl);
                se.setinterval(null);
            }else{
              se.gf.showAlertOutOfTicketInternational(se._flightService.itemFlightCache, 2);
              se.hideLoading();
            }
          })
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
  
  
