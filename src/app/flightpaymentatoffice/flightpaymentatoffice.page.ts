import { Component, NgZone, OnInit } from '@angular/core';
import {  NavController, LoadingController,Platform, ToastController } from '@ionic/angular';
import { Booking, RoomInfo,Bookcombo, SearchHotel } from '../providers/book-service';

import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import jwt_decode from 'jwt-decode';
import { flightService } from '../providers/flightService';
import * as moment from 'moment';
/**
 * Generated class for the RoompaymentlivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-flightpaymentatoffice',
  templateUrl: 'flightpaymentatoffice.page.html',
  styleUrls: ['flightpaymentatoffice.page.scss'],
})
export class FlightpaymentatofficePage implements OnInit{
  text; isenabled = true; ischeck; timestamp; paymentMethod;auth_token: any;
  allowCheckHoldTicket: boolean = true;
  jti: any='';
; room; jsonroom;loader:any;
  constructor(public platform: Platform,public bookcombo:Bookcombo,public navCtrl: NavController, public Roomif: RoomInfo, public storage: Storage, public booking: Booking, public loadingCtrl: LoadingController,public gf: GlobalFunction, public zone: NgZone,private toastCtrl: ToastController,
    public _flightService: flightService,
    public searchhotel: SearchHotel) {
    this.text = "<b>Văn phòng tại TP. Hồ Chí Minh:</b> Lầu 2, tòa nhà Saigon Prime, 107-109-111 Nguyễn Đình Chiểu, Phường 6, Quận 3, Thành phố Hồ Chí Minh<br />Thời gian làm việc:<br /><ul><li>Thứ 2 - Thứ 7: từ 07h30 đến 21h00</li><li>Chủ Nhật: từ 07h30 đến 20h00</li></ul><br /><b>Văn phòng tại Hà Nội:</b> Lầu 9, 70-72 Bà Triệu, Quận Hoàn Kiếm<br />Thời gian làm việc:<br /><ul ><li>Thứ 2 - Thứ 6: từ 07h30 đến 17h30</li></ul>";

    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
      }
    })
  }
  ngOnInit() {
  }
  ionViewWillEnter(){
    this.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
      })
      this.gf.hideLoading();
  }
  next() {
    var se = this;
    se.gf.showLoading();
    //se.gf.updatePaymentMethod(se._flightService.itemFlightCache,8, se.paymentMethod, "").then(data => {
      se.callBuildLink().then( data => {
      if (data) {
       
        se._flightService.itemFlightCache.ischeckpayment = 0;
        if(se._flightService.itemFlightCache.objHotelCitySelected){
          se.gf.updatePaymentMethodForCombo(se._flightService.itemFlightCache.pnr.bookingCode, se.paymentMethod);
        }
        se.checkHoldTicket(se._flightService.itemFlightCache);
      }else{
        se.gf.hideLoading();
        se.gf.showAlertOutOfTicket(se._flightService.itemFlightCache, 2, 0);
      }
   
    })
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
              let itemcache = se._flightService.itemFlightCache;
              se.gf.hideLoading();
              se._flightService.itemFlightCache.ischeckpayment = 0;
              se.navCtrl.navigateForward('flightpaymentdone/'+(itemcache.pnr.bookingCode ?itemcache.pnr.bookingCode:  itemcache.pnr.resNo)+'/'+moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD')+'/'+moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD'));

              // if(se._flightService.itemFlightCache.objHotelCitySelected){
              //   var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=office&source=app&amount=' + itemcache.totalPrice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + (itemcache.pnr.bookingCode ?itemcache.pnr.bookingCode:  itemcache.pnr.resNo) + '&memberId=' + se.jti + '&rememberToken=&buyerPhone=' + itemcache.phone+ '&version=2';
              //   se.gf.CreatePayoo(url).then(dataoffice => {
              //     se.gf.hideLoading();
              //     //Có chọn khách sạn thì gọi thêm updatepayment theo luồng check ks
              //     se.gf.updatePaymentMethodForCombo(se._flightService.itemFlightCache.pnr.bookingCode, se.paymentMethod);
              //     se.navCtrl.navigateForward('flightpaymentdone/'+(itemcache.pnr.bookingCode ?itemcache.pnr.bookingCode:  itemcache.pnr.resNo)+'/'+moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD')+'/'+moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD'));
              //   })
              // }else{
              //   se.gf.hideLoading();
              //   var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=office&source=app&amount=' + itemcache.totalPrice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + (itemcache.pnr.bookingCode ?itemcache.pnr.bookingCode:  itemcache.pnr.resNo) + '&memberId=' + se.jti + '&rememberToken=&buyerPhone=' + itemcache.phone+ '&version=2';
              //   se.gf.CreatePayoo(url);
              //   se.navCtrl.navigateForward('flightpaymentdone/'+(itemcache.pnr.bookingCode ?itemcache.pnr.bookingCode:  itemcache.pnr.resNo)+'/'+moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD')+'/'+moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD'));
              // }
              
            }else{//hold vé thất bại về trang tìm kiếm
              se.gf.hideLoading();
              se.gf.showAlertOutOfTicket(se._flightService.itemFlightCache, 1, 0);
            }
                
          }
        })
      

      setTimeout(() => {
       
        se.allowCheckHoldTicket = false;
       
      }, 1000 * 15);
   
  }

  callBuildLink(){
    let se = this;
    return new Promise((resolve, reject) => {
      let itemcache = se._flightService.itemFlightCache;
      var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=office&source=app&amount=' + itemcache.totalPrice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + (itemcache.pnr.bookingCode ?itemcache.pnr.bookingCode:  itemcache.pnr.resNo) + '&memberId=' + se.jti + '&rememberToken=&buyerPhone=' + itemcache.phone+ '&version=2';
      se.gf.CreatePayoo(url).then((data) => {
         //
         se.searchhotel.paymentType = 'office';
         se.gf.logEventFirebase('office', se._flightService.itemFlightCache, 'flightpaymentselect', 'add_payment_info', 'Flights');
         if(data.PeriodPaymentDate && data.PeriodPaymentDate.indexOf('/') != -1){
          let _pd = data.PeriodPaymentDate.replace('/Date(','').replace(')/','')*1;
          se._flightService.itemFlightCache.periodPaymentDate = new Date(_pd);
         }
        resolve(data.success);
      })
    })
    
  }

  callCheckHoldTicket(url, data){
    var res = false,
    se = this;
    return new Promise((resolve, reject) => {
      let urlPath = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+data.pnr.resNo;
      let headers = {
        "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
        'Content-Type': 'application/json; charset=utf-8',
      };
      this.gf.RequestApi('GET', urlPath, headers, {}, 'flightPaymentOffice', 'callCheckHoldTicket').then((result)=>{
        if (result) {
          //let result = data;
          if(data.ischeckpayment == 0)//trả sau
          {
              if(result.isRoundTrip){//khứ hồi
                if(result.departFlight.atBookingCode != null && result.departFlight.atBookingCode.indexOf("T__") == -1 && result.returnFlight.atBookingCode != null && result.returnFlight.atBookingCode.indexOf("T__") == -1){
                  resolve(true);
                }else{
                  if(!result.departFlight.atBookingCode || result.departFlight.atBookingCode.indexOf("T__") != -1){
                    se._flightService.itemFlightCache.errorHoldTicket = 1;// không hold dc vé chiều đi
                  }
                  else if(!result.returnFlight.atBookingCode || result.returnFlight.atBookingCode.indexOf("T__") != -1){
                    se._flightService.itemFlightCache.errorHoldTicket = 2;// không hold dc vé chiều về
                  }
                  else if( (!result.returnFlight.atBookingCode || result.returnFlight.atBookingCode.indexOf("T__") != -1) && (!result.departFlight.atBookingCode || result.departFlight.atBookingCode.indexOf("T__") != -1) ){
                    se._flightService.itemFlightCache.errorHoldTicket = 3;// không hold dc vé 2 chiều
                  }
                  resolve(false);
                }
              }else{
                if(result.departFlight.atBookingCode != null && result.departFlight.atBookingCode.indexOf("T__") == -1){
                  resolve(true);
                }else{
                  se._flightService.itemFlightCache.errorHoldTicket = 1;// không hold dc vé chiều đi
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
      })
     
      
    })
  }
  
  check() {
    if (this.ischeck) {
      this.isenabled = false;
    } else {
      this.isenabled = true;
    }
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }
  goback(){
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
}
