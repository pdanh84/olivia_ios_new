import { ActivityService, GlobalFunction } from './../../providers/globalfunction';
import { NavController, Platform,ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';

import { C } from '../../providers/constants';
import * as moment from 'moment';
import { flightService } from '../../providers/flightService';
import { ValueGlobal } from './../../providers/book-service';
import { FlightquickbackPage } from '../../flightquickback/flightquickback.page';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-orderrequestaddluggagepaymentpayoo',
  templateUrl: './orderrequestaddluggagepaymentpayoo.page.html',
  styleUrls: ['./orderrequestaddluggagepaymentpayoo.page.scss'],
})
export class OrderRequestAddluggagePaymentPayooPage implements OnInit {

  bookingCode; stt; text; qrimg; BillingCode; total; PeriodPaymentDate; textHours;
  intervalID: any;
  allowCheck: any = true;
  allowCheckHoldTicket: boolean = true;
  _email;
  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private activatedRoute: ActivatedRoute, private _flightService: flightService,
    public valueGlobal: ValueGlobal,private modalCtrl: ModalController,
    private zone: NgZone,
    public activityService: ActivityService,
    private alertCtrl: AlertController) {
      this.bookingCode = this.activityService.objRequestAddLuggage.bookingCode;
  }

  ngOnInit() {
    //this.bookingCode = this.activatedRoute.snapshot.paramMap.get('code');
    this.stt = this.activatedRoute.snapshot.paramMap.get('stt');
    this._email = this._flightService.itemFlightCache.email;
    if (this.stt == 0) {
      this.BillingCode = this._flightService.itemFlightCache.BillingCode;
    }
    else {
      this.qrimg = this._flightService.itemFlightCache.qrimg;
      clearInterval(this.intervalID);
      this.intervalID = setInterval(() => {
        //this.checkqrcode();
        this.zone.run(()=>{
          this.callCheckPayment();
        })
       
      }, 1000 * 5);

      setTimeout(() => {
        clearInterval(this.intervalID);
      }, 60000 * 15);
    }
    this.total = this.activityService.objRequestAddLuggage.totalPrice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    this.PeriodPaymentDate = this._flightService.itemFlightCache.periodPaymentDate ? this.gf.getDayOfWeek(this._flightService.itemFlightCache.periodPaymentDate).dayname + ", " + moment(this._flightService.itemFlightCache.periodPaymentDate).format("DD") + " thg " + moment(this._flightService.itemFlightCache.periodPaymentDate).format("MM") : "";
  }
  goback() {
    if (this.stt == 1) {
      clearInterval(this.intervalID);
    }
    this.allowCheck = false;
    this.navCtrl.back();
  }
  next() {
    var se = this;
    if (this.stt == 0) {
      this.clearItemCache();
      this._flightService.itemTabFlightActive.emit(true);
      this.valueGlobal.backValue = "homeflight";
      this._flightService.itemFlightMytripRefresh.emit(true);
      this._flightService.bookingCodePayment = this.bookingCode;
      this._flightService.bookingSuccess = true;
      this.navCtrl.navigateBack('/app/tabs/tab1');
    }
    else {
      
      clearInterval(this.intervalID);
      se.checkqrcode();
      se.allowCheck = false;
      //se.callCheckPayment();
    }

  }

  checkHoldTicket(data) {
    var se = this, res = false;
    let url = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/" + data.pnr.resNo;

    se.callCheckHoldTicket(url, data).then((check) => {
      if (!check && se.allowCheckHoldTicket) {
        res = false;
        setTimeout(() => {
          se.checkHoldTicket(data);
        }, 3000);
      } else {
        let startDate = moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');
        let endDate = moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD');
        if (check) {
          se.navCtrl.navigateForward('orderrequestaddluggagepaymentdone');

        } else {//hold vé thất bại về trang tìm kiếm
          se.gf.hideLoading();
          clearInterval(se.intervalID);
          se.rollBackObjectRequestAddLuggage();
          se.gf.showAlertPaymentFail();

        }

      }
    })


    setTimeout(() => {

      se.allowCheckHoldTicket = false;

    }, 1000 * 30);

  }

  callCheckHoldTicket(url, data) {
    var res = false, se = this;
    return new Promise((resolve, reject) => {
      // var options = {
      //   method: 'GET',
      //   url: C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/" + data.pnr.resNo,
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
      //     let result = JSON.parse(body);
      let url = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/" + data.pnr.resNo;
        let headers= {
              "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
              'Content-Type': 'application/json; charset=utf-8',
            };
        this.gf.RequestApi('POST', url, headers , {}, 'orderrequestaddluggagepaymentpayoo', 'callCheckHoldTicket' ).then((result) => {
          if(result){
          if(se._flightService){
            se._flightService.itemFlightCache.dataSummaryBooking = result;
          }
          //Thêm case check thanh toán thành công nhưng quá hạn giữ vé
          if(result.expIssueTicket){
              se.allowCheckHoldTicket = false;
              resolve(false);
            }else{
                if (data.ischeckpayment == 0)//trả sau
                {
                  if (result.isRoundTrip) {//khứ hồi
                    if (result.departFlight.atBookingCode != null && result.departFlight.atBookingCode.indexOf("T__") == -1 && result.returnFlight.atBookingCode != null && result.returnFlight.atBookingCode.indexOf("T__") == -1) {
                      resolve(true);
                    } else {
                      resolve(false);
                    }
                  } else {
                    if (result.departFlight.atBookingCode != null && result.departFlight.atBookingCode.indexOf("T__") == -1) {
                      resolve(true);
                    } else {
                      se._flightService.itemFlightCache.errorHoldTicket = 1;// không hold dc vé chiều đi
                      resolve(false);
                    }
                  }
                } else {//trả trước

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
        }
      })


    })
  }

  checkqrcode() {
    var se = this;
    se.gf.showLoading();
   
    let url = C.urls.baseUrl.urlFlight + '/gate/apiv1/PaymentCheck?id=' + se.bookingCode+'&IsPartialPayment=true';
        let headers= {
              "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
              'Content-Type': 'application/json; charset=utf-8',
            };
        this.gf.RequestApi('POST', url, headers , {}, 'orderrequestaddluggagepaymentpayoo', 'callCheckHoldTicket' ).then((rs) => {
        if(rs){
      se.gf.hideLoading();
      let startDate = moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');
      let endDate = moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD');
      if (rs.ipnCall == "CALLED_OK") {
        se.gf.hideLoading();
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
      else if(rs.ipnCall == "CALLED_FAIL" && rs.errorCode == '99')//hủy
      {
        se.gf.hideLoading();
        clearInterval(se.intervalID);
        se.rollBackObjectRequestAddLuggage();
        se.gf.showAlertPaymentFail();
      }
      else if(rs.ipnCall == "CALLED_TIMEOUT" && rs.errorCode == '253')//case timeout
      {
        se.gf.hideLoading();
        clearInterval(se.intervalID);
        se._flightService.paymentError = rs;
        se.navCtrl.navigateForward('/flightpaymenttimeout');
      }
      else if(rs.ipnCall == "CALLED_FAIL" && rs.errorCode != '99')//hủy
                  {
                    se.gf.hideLoading();
                    clearInterval(se.intervalID);
                    se._flightService.paymentError = rs;
                    se.rollBackObjectRequestAddLuggage();
                    se.gf.showAlertPaymentFail();
                  }
        else{
          se.allowCheck = true;
          se.zone.run(()=>{
            se.callCheckPayment();
          })
          
        }
      }
    });
  }

  callCheckPayment() {
    var se = this;
    if (se.allowCheck) {
      se.checkPayment();
    }

  }

  checkPayment() {
    var se = this;
    let url = C.urls.baseUrl.urlFlight + "gate/apiv1/PaymentCheck?id=" + se.bookingCode+'&IsPartialPayment=true';
    se.gf.Checkpayment(url).then((checkpay) => {
      //var checkpay = JSON.parse(data);
      let startDate = moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');
      let endDate = moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD');
       if (checkpay.ipnCall == "CALLED_OK") {
        se.gf.hideLoading();
        clearInterval(se.intervalID);
        se.navCtrl.navigateForward('orderrequestaddluggagepaymentdone');

      }
      else if(checkpay.ipnCall == "CALLED_FAIL" && checkpay.errorCode == '99')//hủy
      {
        se.gf.hideLoading();
        clearInterval(se.intervalID);
        se.rollBackObjectRequestAddLuggage();
        se.gf.showAlertPaymentFail();
      }
      else if(checkpay.ipnCall == "CALLED_TIMEOUT" && checkpay.errorCode == '253')//case timeout
      {
        se.gf.hideLoading();
        clearInterval(se.intervalID);
        se._flightService.paymentError = checkpay;
        se.rollBackObjectRequestAddLuggage();
        se.gf.showAlertPaymentFail();
      }
      else if(checkpay.ipnCall == "CALLED_FAIL" && checkpay.errorCode != '99')//hủy
                  {
                    se.gf.hideLoading();
                    clearInterval(se.intervalID);
                    se._flightService.paymentError = checkpay;
                    se.rollBackObjectRequestAddLuggage();
                    se.gf.showAlertPaymentFail();
                  }
    })
  }

  async openWebpagePayoo() {
    var se = this;
    var url = "https://payoo.vn/mapv2/public/index.php?verify=true";
    await Browser.open({ url: url});

    Browser.addListener('browserFinished', () => {
      se.gf.hideLoading();

    });

  }
  clearItemCache() {
    this._flightService.itemFlightCache = {};
    this._flightService.itemFlightCache.departLuggage = [];
    this._flightService.itemFlightCache.returnLuggage = [];
    this._flightService.itemFlightCache.jsonSeats = null;
    this._flightService.itemFlightCache.listdepartseatselected = "";
    this._flightService.itemFlightCache.listreturnseatselected = "";
    this._flightService.itemFlightCache.departLuggage = [];
    this._flightService.itemFlightCache.returnLuggage = [];
    this._flightService.itemFlightCache.hasChoiceLuggage = false;
    this._flightService.itemFlightCache.listSeatNormal = [];
    this._flightService.itemFlightCache.listReturnSeatNormal = [];
    this._flightService.itemFlightCache.departConditionInfo = null;
    this._flightService.itemFlightCache.returnConditionInfo = null;
    this._flightService.itemFlightCache.isnewmodelseat = false;
    this._flightService.itemFlightCache.isnewmodelreturnseat = false;
  }
  async showQuickBack() {
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
        text: 'Xác nhận',
        role: 'OK',
        handler: () => {
          //this.gf.CreateSupportRequest(this.bookingCode, this.email, this.hoten, this.phone, `Yêu cầu hỗ trợ lỗi đỗi lịch trình bkg VMB ${this.bookingCode} từ ngày ${this.activityService.typeChangeFlight == 1 ? moment(trip.checkInDate).format('DD/MM/YYYY') : moment(trip.checkOutDate).format('DD/MM/YYYY')} qua ngày ${ moment(this._flightService.itemFlightCache.checkInDate).format('DD/MM/YYYY')}`);
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
