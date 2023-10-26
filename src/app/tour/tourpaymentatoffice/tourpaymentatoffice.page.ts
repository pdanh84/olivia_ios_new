import { Component, NgZone, OnInit } from '@angular/core';
import {  NavController, LoadingController,Platform, ToastController } from '@ionic/angular';
import { Booking, RoomInfo,Bookcombo } from '../../providers/book-service';
import { Storage } from '@ionic/storage';
import { C } from '../../providers/constants';
import { GlobalFunction } from '../../providers/globalfunction';
import { tourService } from '../../providers/tourService';
/**
 * Generated class for the RoompaymentlivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-tourpaymentatoffice',
  templateUrl: 'tourpaymentatoffice.page.html',
  styleUrls: ['tourpaymentatoffice.page.scss'],
})
export class TourPaymentAtOfficePage implements OnInit{
  text; isenabled = true; ischeck; timestamp; paymentMethod;auth_token: any;
  allowCheckHoldTicket: boolean = true;
  jti: any;
; room; jsonroom;loader:any;
  constructor(public platform: Platform,public bookcombo:Bookcombo,public navCtrl: NavController, public Roomif: RoomInfo, public storage: Storage, public booking: Booking, public loadingCtrl: LoadingController,public gf: GlobalFunction, public zone: NgZone,private toastCtrl: ToastController,
    public _tourService: tourService) {
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
    if (se.booking.CEmail) {
      this.timestamp = Date.now();
      var Invoice=0;
      if (se.Roomif.order) {
        Invoice=1;
      }
        let urlApi = C.urls.baseUrl.urlMobile+'/tour/api/TourApi/CreateBookingVerApi';
        let headers = {
          apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
          apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
        };
        se._tourService.TourBooking.PaymentMethod = '';
        se.gf.logEventFirebase(se._tourService.gaPaymentType,se._tourService, 'tourpaymentoffice', 'add_payment_info', 'Tours');
        se.gf.RequestApi('POST', urlApi, headers, se._tourService.TourBooking, 'tourpaymentbank', 'CreateBookingVerApi').then((data)=>{
          if(data && data.Status == "Success" && data.Response && data.Response.BookingCode){
            se._tourService.tourBookingCode = data.Response.BookingCode;
            se._tourService.totalPrice = data.Response.Total;

            let urlApiTrans = C.urls.baseUrl.urlMobile+'/tour/api/BookingsApi/UpdateTransaction?bookingCode='+data.Response.BookingCode+'&status=2';
            let headers = {
              apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
              apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
            };
            se.gf.RequestApi('GET', urlApiTrans, headers, null , 'tourpaymentbank', 'UpdateTransaction').then((dataTrans)=>{
              if(dataTrans){
                this._tourService.paymentType = -1;
                this.navCtrl.navigateForward('/tourpaymentdone');
              }
            });
          }
          se.gf.hideLoading();
        });
  }else{
    se.gf.hideLoading();
    se.presentToastr('Email không hợp lệ. Vui lòng kiểm tra lại.');
  }
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
