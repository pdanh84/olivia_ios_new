import { Component, NgZone, OnInit } from '@angular/core';
import {  NavController, LoadingController,Platform, ToastController } from '@ionic/angular';
import { Booking, RoomInfo,Bookcombo } from '../../providers/book-service';

import { Storage } from '@ionic/storage';
import { C } from '../../providers/constants';
import { ActivityService, GlobalFunction } from '../../providers/globalfunction';
import jwt_decode from 'jwt-decode';
import { flightService } from '../../providers/flightService';
import * as moment from 'moment';
/**
 * Generated class for the RoompaymentlivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-orderrequestaddluggagepaymentatoffice',
  templateUrl: 'orderrequestaddluggagepaymentatoffice.page.html',
  styleUrls: ['orderrequestaddluggagepaymentatoffice.page.scss'],
})
export class OrderRequestAddluggagePaymentAtOfficePage implements OnInit{
  isenabled = true; ischeck; timestamp; paymentMethod;auth_token: any;
  allowCheckHoldTicket: boolean = true;
  jti: any;
  bookingCode: string;
  phone: any;
; room; jsonroom;loader:any;
  constructor(public platform: Platform,public bookcombo:Bookcombo,public navCtrl: NavController, public Roomif: RoomInfo, public storage: Storage, public booking: Booking, public loadingCtrl: LoadingController,public gf: GlobalFunction, public zone: NgZone,private toastCtrl: ToastController,
    public _flightService: flightService,
    public activityService: ActivityService) {
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
      }
    })
    this.storage.get('infocus').then(infocus => {
      if (infocus) {
        this.phone = infocus.phone;
      }
    })

    this.bookingCode = this.activityService.objRequestAddLuggage.bookingCode;
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
      se.callBuildLink().then(data => {
      if (data) {
        se.checkHoldTicket();
      }else{
        se.gf.hideLoading();
        se.gf.showAlertOutOfTicket(null, 2, 0);
      }
   
    })
  }

  checkHoldTicket(){
    var se = this, res = false;
    let url = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/"+ se.bookingCode;
    
        se.callCheckHoldTicket(url, null).then((check) => {
          if (!check && se.allowCheckHoldTicket) {
              res = false;
              setTimeout(() => {
                se.checkHoldTicket();
              }, 3000);
          }else{

            if(check){
              se.activityService.objRequestAddLuggage.ischeckpayment = 0;
              se.navCtrl.navigateForward('orderrequestaddluggagepaymentdone');
              
            }else{
              se.gf.hideLoading();
              se.gf.showAlertPaymentFail();
            }
                
          }
        })
      

      setTimeout(() => {
       
        se.allowCheckHoldTicket = false;
       
      }, 1000 * 15);
   
  }

  callBuildLink(){
    var se = this;
    return  new Promise((resolve, reject) => {
      let itemcache = se.activityService.objRequestAddLuggage;
      var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=office&source=app&amount=' + itemcache.totalPrice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + itemcache.bookingCode + '&memberId=' + se.jti + '&rememberToken=&buyerPhone=' + se.phone+'&version=2'+'&IsPartialPayment=true';
                se.gf.CreatePayoo(url).then((data)=> {
                  let result = JSON.parse(data);
                  resolve(result.success);
                })
    })
  }

  callCheckHoldTicket(url, data){
    var res = false,
    se = this;
    return new Promise((resolve, reject) => {
      let url = C.urls.baseUrl.urlFlight + "/gate/apiv1/SummaryBooking/" + this.bookingCode;
      let headers= {
            "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            'Content-Type': 'application/json; charset=utf-8',
          };
      this.gf.RequestApi('GET', url, headers , {}, 'orderrequestaddluggagepaymentoffice', 'callCheckHoldTicket' ).then((result) => {
      if(result){
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
                  this._flightService.itemFlightCache.errorHoldTicket = 1;// không hold dc vé chiều đi
                  resolve(false);
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
