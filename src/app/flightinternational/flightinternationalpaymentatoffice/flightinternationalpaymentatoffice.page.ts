import { Component, NgZone, OnInit } from '@angular/core';
import {  NavController, LoadingController,Platform, ToastController } from '@ionic/angular';
import { Booking, RoomInfo,Bookcombo } from '../../providers/book-service';

import { Storage } from '@ionic/storage';
import { C } from '../../providers/constants';
import { GlobalFunction } from '../../providers/globalfunction';
import { flightService } from '../../providers/flightService';
import * as moment from 'moment';
import { voucherService } from '../../providers/voucherService';
/**
 * Generated class for the RoompaymentlivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-flightinternationalpaymentatoffice',
  templateUrl: 'flightinternationalpaymentatoffice.page.html',
  styleUrls: ['flightinternationalpaymentatoffice.page.scss'],
})
export class FlightInternationalPaymentatOfficePage implements OnInit{
  text; isenabled = true; ischeck; timestamp; paymentMethod;auth_token: any;
  allowCheckHoldTicket: boolean = true;
  bookingCode: any;
  jti: any;
; room; jsonroom;loader:any;
  constructor(public platform: Platform,public bookcombo:Bookcombo,public navCtrl: NavController, public Roomif: RoomInfo, public storage: Storage, public booking: Booking, public loadingCtrl: LoadingController,public gf: GlobalFunction, public zone: NgZone,private toastCtrl: ToastController,
    public _flightService: flightService,
    public _voucherService: voucherService) {
    this.text = "<b>Văn phòng tại TP. Hồ Chí Minh:</b> Lầu 2, tòa nhà Saigon Prime, 107-109-111 Nguyễn Đình Chiểu, Phường 6, Quận 3, Thành phố Hồ Chí Minh<br />Thời gian làm việc:<br /><ul><li>Thứ 2 - Thứ 7: từ 07h30 đến 21h00</li><li>Chủ Nhật: từ 07h30 đến 20h00</li></ul><br /><b>Văn phòng tại Hà Nội:</b> Lầu 9, 70-72 Bà Triệu, Quận Hoàn Kiếm<br />Thời gian làm việc:<br /><ul ><li>Thứ 2 - Thứ 6: từ 07h30 đến 17h30</li></ul>";
    this.bookingCode =  this._flightService.itemFlightCache.pnr.bookingCode ? this._flightService.itemFlightCache.pnr.bookingCode : this._flightService.itemFlightCache.pnr.resNo;

    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
      }
    })

  }
  ngOnInit() {
  }
  ionViewWillEnter(){
    this.gf.hideLoading();
    this.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
      })
  }
  next() {
    var se = this;
    se.gf.showLoading();
    se.callBuildLink().then(data => {
      if (data) {
        se.gf.logEventFirebase(se._flightService.itemFlightCache.paymentType, se._flightService.itemFlightCache, 'flightsearchresultinternational', 'add_payment_info', 'Flights');

        se._flightService.itemFlightCache.ischeckpayment = 0;
        let itemcache = se._flightService.itemFlightCache;
        se.gf.hideLoading();
        se.navCtrl.navigateForward('flightinternationalpaymentdone/'+(itemcache.pnr.bookingCode ?itemcache.pnr.bookingCode:  itemcache.pnr.resNo)+'/'+moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD')+'/'+moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD'));

      }else{
        se.gf.hideLoading();
        se.gf.showAlertOutOfTicketInternational(se._flightService.itemFlightCache, 2);
      }
   
    })

  }


  callBuildLink(): Promise<any> {
    var se = this;
    return new Promise((resolve, reject) => {
      let itemcache = se._flightService.itemFlightCache;
      itemcache.ischeckpayment = 0;
      var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=office&source=app&amount=' + se._flightService.itemFlightInternational.fare.price.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + (itemcache.pnr.bookingCode ?itemcache.pnr.bookingCode:  itemcache.pnr.resNo) + '&memberId=' + se.jti + '&rememberToken=&buyerPhone=' + itemcache.phone+'&version=2&isFlightInt=true';
                  se.gf.CreatePayoo(url).then((data) => {
                        resolve(data.success);
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
