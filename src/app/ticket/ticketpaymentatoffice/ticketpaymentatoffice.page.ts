import { Component, NgZone, OnInit } from '@angular/core';
import {  NavController, LoadingController,Platform, ToastController } from '@ionic/angular';
import { Booking, RoomInfo,Bookcombo } from '../../providers/book-service';

import { Storage } from '@ionic/storage';
import { C } from '../../providers/constants';
import { GlobalFunction } from '../../providers/globalfunction';
import jwt_decode from 'jwt-decode';
import { tourService } from '../../providers/tourService';
import * as moment from 'moment';
import { ticketService } from 'src/app/providers/ticketService';
/**
 * Generated class for the RoompaymentlivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-ticketpaymentatoffice',
  templateUrl: 'ticketpaymentatoffice.page.html',
  styleUrls: ['ticketpaymentatoffice.page.scss'],
})
export class TicketPaymentAtOfficePage implements OnInit{
  text; isenabled = true; ischeck; timestamp; paymentMethod;auth_token: any;
  allowCheckHoldTicket: boolean = true;
  jti: any;
; room; jsonroom;loader:any;
  constructor(public platform: Platform,public bookcombo:Bookcombo,public navCtrl: NavController, public Roomif: RoomInfo, public storage: Storage, public booking: Booking, public loadingCtrl: LoadingController,public gf: GlobalFunction, public zone: NgZone,private toastCtrl: ToastController,public ticketService: ticketService) {
    this.text = "<b>Văn phòng tại TP. Hồ Chí Minh:</b> Lầu 2, tòa nhà Saigon Prime, 107-109-111 Nguyễn Đình Chiểu, Phường 6, Quận 3, Thành phố Hồ Chí Minh<br />Thời gian làm việc:<br /><ul><li>Thứ 2 - Thứ 7: từ 07h30 đến 21h00</li><li>Chủ Nhật: từ 07h30 đến 20h00</li></ul><br /><b>Văn phòng tại Hà Nội:</b> P.308, Tầng 3, Tòa nhà The One, số 2 Chương Dương Độ, Q.Chương Dương, Q.Hoàn Kiếm, Hà Nội<br />Thời gian làm việc:<br /><ul ><li>Thứ 2 - Thứ 6: từ 07h30 đến 17h30</li></ul>";

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
    this.ticketService.paymentType = -1;
    let objbookTicket={
      bookingCode : this.ticketService.itemTicketService.objbooking.bookingCode,
      paymentMethod: 8
  }
  this.gf.ticketPaymentSave(objbookTicket);
  this.gf.logEventFirebase('office', this.ticketService, 'ticketpaymentatoffice', 'add_payment_info', 'Ticket');
    this.navCtrl.navigateForward('/ticketpaymentdone/0');
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
