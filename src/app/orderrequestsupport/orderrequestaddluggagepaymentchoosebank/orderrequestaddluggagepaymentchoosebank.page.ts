import { Bookcombo } from './../../providers/book-service';
import { Booking, RoomInfo, SearchHotel } from '../../providers/book-service';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform, AlertController } from '@ionic/angular';
import { C } from '../../providers/constants';
import { Storage } from '@ionic/storage';
import { ActivityService, GlobalFunction } from '../../providers/globalfunction';
import { flightService } from '../../providers/flightService';
import * as moment from 'moment';
import * as $ from 'jquery';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-orderrequestaddluggagepaymentchoosebank',
  templateUrl: './orderrequestaddluggagepaymentchoosebank.page.html',
  styleUrls: ['./orderrequestaddluggagepaymentchoosebank.page.scss'],
})
export class OrderRequestAddluggagePaymentChooseBankPage implements OnInit {

  ischeck; timestamp; public ischeckbox; jti
  Avatar; Name; Address; cin; cout; dur; room; nameroom; jsonroom; ischecktext = true
  roomnumber; adults; children; breakfast; PriceAvgPlusTAStr; priceshow
  imgroom; roomtype; indexme; indexroom; cin1; cout1; checkpayment; book; id; pricetemp; hotelid
  public loader: any; startDate; endDate; arrbankrmb:any=[];
  auth_token: any = ''; bookingCode = ""; isckb = false; TokenId;bankid="";
  intervalID: any;
  allowCheckHoldTicket: boolean = true;
  isremember=true;isdisable=false
  phone: any;
  constructor(public navCtrl: NavController, private toastCtrl: ToastController, public booking: Booking,
    public Roomif: RoomInfo, public storage: Storage, public zone: NgZone, public searchhotel: SearchHotel,
    public loadingCtrl: LoadingController,public _flightService : flightService, public platform: Platform, public gf: GlobalFunction,public bookCombo:Bookcombo,
    public activityService: ActivityService,
    private alertCtrl: AlertController) {
      this.priceshow = this._flightService.itemFlightCache.totalPriceDisplay;
      this.storage.get('infocus').then(infocus => {
        if (infocus) {
          this.phone = infocus.phone;
        }
      })
  
      this.bookingCode = this.activityService.objRequestAddLuggage.bookingCode;

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

    if (this.bookingCode) {
      this.CreateUrlOnePay(this.id);
    }
  }

  async openWebpage(url: string) {
    var se = this;
    await Browser.open({ url: url}).then(()=>{
      se._flightService.itemFlightCache.hasvoucher = se._flightService.itemFlightCache.promotionCode;
    });

    Browser.addListener('browserFinished', () => {
      
      se.hideLoading();
                se.gf.hideLoading();
                  let url = C.urls.baseUrl.urlFlight + "gate/apiv1/PaymentCheck?id="+se.bookingCode+'&IsPartialPayment=true';
                  se.gf.Checkpayment(url).then((checkpay) => {
                    //var checkpay=JSON.parse(datapayment);

                    if (checkpay.ipnCall == "CALLED_OK") {
                      se.hideLoading();
                      se.gf.hideLoading();
                      Browser.close();
                      clearInterval(se.intervalID);
                      if(this._flightService.fromOrderRequestChangeFlight){
                        this.gf.showLoading();
                        this.updateChangeFlight().then((success) => {
                          this.gf.hideLoading();
                          if(success){
                            let _url = C.urls.baseUrl.urlMobile + '/api/Dashboard/UpdateTicketFlight';
                            this.gf.RequestApi('POST', _url, {
                              "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                              'Content-Type': 'application/json; charset=utf-8',
                            }, 
                            {bookingCode: this.bookingCode}, 'orderrequestaddluggagepaymentchoosebank','UpdateTicketFlight').then((data)=>{
                              console.log(data);
                              if(data && data.result){
                                this.navCtrl.navigateForward('orderrequestaddluggagepaymentdone');
                              }else{
                                this.showConfirm('Đã có lỗi xảy ra. Xin quý khách vui lòng liên hệ iVIVU.com để được hỗ trợ!');
                              }
                            });
                          }else{
                            this.showConfirm('Đã có lỗi xảy ra. Xin quý khách vui lòng liên hệ iVIVU.com để được hỗ trợ!');
                          }
                        })
                      }else{
                        this.navCtrl.navigateForward('orderrequestaddluggagepaymentdone');
                      }
                    }
                    else//case còn lại không thành công
                    {
                      se.hideLoading();
                      se.gf.hideLoading();
                      Browser.close();
                      clearInterval(se.intervalID);
                      se._flightService.paymentError = checkpay;
                      se.rollBackObjectRequestAddLuggage();
                      se.gf.showAlertPaymentFail();
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
    this.navCtrl.back();
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
    let itemcache = this.activityService.objRequestAddLuggage;
    var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=atm&source=app&amount=' + itemcache.totalPrice + '&orderCode=' + se.bookingCode + '&buyerPhone=' + se.phone + '&memberId=' + se.jti + '&BankId=' + bankid + '&TokenId='+(se.TokenId ? se.TokenId : '') + '&rememberToken='+(se.isremember ? se.isremember : 'false')+'&IsPartialPayment=true'+'&callbackUrl='+ C.urls.baseUrl.urlPayment +'/Home/BlankDeepLink'+'&version=2';
      se.gf.CreatePayoo(url).then(datapayoo => {
      //datapayoo = JSON.parse(datapayoo);
      if(datapayoo.success){
        se._flightService.itemFlightCache.periodPaymentDate = datapayoo.periodPaymentDate;
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
  }
  GeTokensOfMember() {
    var se = this;
    se.gf.GeTokensOfMember(se.jti).then(dataTokens => {
      if (dataTokens) {
        //dataTokens = JSON.parse(dataTokens);
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
              if(!this._flightService.fromOrderRequestChangeFlight){
                this.navCtrl.navigateForward('orderrequestaddluggagepaymentdone');
              }
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
              se.navCtrl.navigateForward('orderrequestaddluggagepaymentdone');
            }else{//hold vé thất bại về trang tìm kiếm
              clearInterval(se.intervalID);
              se.gf.hideLoading();
              Browser.close();
              se.rollBackObjectRequestAddLuggage();
              se.gf.showAlertPaymentFail();
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
      // request(options, function (error, response, body) {
      //   if (error) {
      //     error.page = "globalfunction";
      //     error.func = "updatePaymentMethod";
      //     error.param = JSON.stringify(options);
      //   }
      //   if (response.statusCode == 200) {
        let url = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+data.pnr.resNo;
        let headers= {
              "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
              'Content-Type': 'application/json; charset=utf-8',
            };
        this.gf.RequestApi('POST', url, headers , {}, 'orderrequestaddluggagepaymentchoosebank', 'AddBaggage' ).then((result) => {
          if(result){
          if(se._flightService){
            se._flightService.itemFlightCache.dataSummaryBooking = result;
          }
          //Thêm case check thanh toán thành công nhưng quá hạn giữ vé
          if(result.expIssueTicket){
              se.allowCheckHoldTicket = false;
              resolve(false);
            }else{
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
      })
     
      
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
  updateChangeFlight(): Promise<any>{
    return new Promise((resolve, reject) => {
      let header = {
        "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
        'Content-Type': 'application/json; charset=utf-8'
      };
      let url = '';
      let trip = this.activityService.objPaymentMytrip.trip;
      if(this.activityService.typeChangeFlight == 1){
        //this.
          url = C.urls.baseUrl.urlFlight + `gate/apiv1/UpdateJourneysVJ?pnrCode=${trip.itemdepart.ticketCode}&secureKey=3b760e5dcf038878925b5613c32651dus&segment=1&flightDate=${moment(this._flightService.orderRequestDepartFlight.departTime).format('YYYY-MM-DD')}&flightNumber=${this._flightService.orderRequestDepartFlight.flightNumber}&ticketClass=${this._flightService.orderRequestDepartFlight.ticketTypeSearch || this._flightService.orderRequestDepartFlight.ticketClass}&funAction=confirm&fromCode=${this._flightService.orderRequestDepartFlight.fromPlaceCode}&toCode=${this._flightService.orderRequestDepartFlight.toPlaceCode}`;
          this.gf.RequestApi('GET', url, header, {}, 'orderrequestchangeflight', 'clickChangeFlight').then((data)=> {
            if(data && data.success && data.priceChange){
              resolve(true);
            }else if(data && data.data[0] && data.data[0].totalPrice){
              resolve(true);
            }
            else{
              resolve(false);
            }
              
          })
      }else if(this.activityService.typeChangeFlight == 2){
          url = C.urls.baseUrl.urlFlight + `gate/apiv1/UpdateJourneysVJ?pnrCode=${trip.itemreturn.ticketCode}&secureKey=3b760e5dcf038878925b5613c32651dus&segment=2&flightDate=${moment(this._flightService.orderRequestReturnFlight.departTime).format('YYYY-MM-DD')}&flightNumber=${this._flightService.orderRequestReturnFlight.flightNumber}&ticketClass=${this._flightService.orderRequestReturnFlight.ticketTypeSearch ||this._flightService.orderRequestReturnFlight.ticketClass}&funAction=confirm&fromCode=${this._flightService.orderRequestReturnFlight.fromPlaceCode}&toCode=${this._flightService.orderRequestReturnFlight.toPlaceCode}`;
          this.gf.RequestApi('GET', url, header, {}, 'orderrequestchangeflight', 'clickChangeFlight').then((data)=> {
            if(data && data.success && data.priceChange){
              resolve(true);
            }else if(data && data.data[0] && data.data[0].totalPrice){
              resolve(true);
            }else{
              resolve(false);
            }
          })
      }
    })
    
  }

  public async showConfirm(msg){
    let trip = this.activityService.objPaymentMytrip.trip;
    let alert = await this.alertCtrl.create({
      message: msg,
      cssClass: 'cls-global-confirm',
      buttons: [
      {
        text: 'Gửi hỗ trợ',
        role: 'OK',
        handler: () => {
          //this.gf.CreateSupportRequest(this.bookingCode, this.email, this.hoten, this.phone, `Yêu cầu hỗ trợ lỗi đỗi lịch trình bkg VMB ${this.bookingCode} từ ngày ${this.activityService.typeChangeFlight == 1 ? moment(trip.checkInDate).format('DD/MM/YYYY') : moment(trip.checkOutDate).format('DD/MM/YYYY')} qua ngày ${ moment(this._flightService.itemFlightCache.checkInDate).format('DD/MM/YYYY')}`);
          $('.div-hidden')[0].click();
          this.navCtrl.navigateBack(['app/tabs/tab3']);
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
