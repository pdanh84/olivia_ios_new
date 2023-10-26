import { ActivityService } from './../providers/globalfunction';
import { Bookcombo } from './../providers/book-service';
import { Booking, RoomInfo, SearchHotel } from '../providers/book-service';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { C } from '../providers/constants';

import { Storage } from '@ionic/storage';
import { InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { GlobalFunction } from '../providers/globalfunction';
import jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-mytripaymentchoosebank',
  templateUrl: './mytripaymentchoosebank.page.html',
  styleUrls: ['./mytripaymentchoosebank.page.scss'],
})
export class MytripaymentchoosebankPage implements OnInit {

  ischeck; timestamp;ischecktext = true;id
  public loader: any;objbook; 
  auth_token: any = '';intervalID: NodeJS.Timeout;browser
  constructor(public navCtrl: NavController, private toastCtrl: ToastController, public booking: Booking, private iab: InAppBrowser,
    public Roomif: RoomInfo, public storage: Storage, public zone: NgZone, public searchhotel: SearchHotel,
    public loadingCtrl: LoadingController,public activityService: ActivityService, public platform: Platform, public gf: GlobalFunction,public bookCombo:Bookcombo) {
    this.searchhotel.rootPage = "roomchoosebank";
    //google analytic
    gf.googleAnalytion('roomchoosebank', 'load', '');
  }
  ngOnInit() {
  }
  ionViewWillEnter() {
    this.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
    })
  }
  next() {
    if (this.ischeck) {
      if (this.id) {
        this.objbook = {
          code: this.activityService.objPaymentMytrip.trip.booking_id,
          timestamp: "",
          cost: this.activityService.objPaymentMytrip.trip.priceShow,
          paymentType: "0",
          BanhkID: this.id,
        }
        var url = C.urls.baseUrl.urlPayment + "/Home/PaymentAppEan?info=" + JSON.stringify(this.objbook);
        this.openWebpage(url);
      } else {
        this.presentToast();
      }
    } else {
      this.ischecktext = false;
    }
  }
  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: "Xin chọn 1 ngân hàng",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  openWebpage(url: string) {
    var se = this;
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'yes',
      toolbar: 'yes',
      hideurlbar: 'yes',
      closebuttoncaption: 'Đóng',
      hidenavigationbuttons: 'yes'
    };
    const browser = this.iab.create(url, '_self', options);
    //const browser:any = se.iab.open(url, '_self', "zoom=no; location=yes; toolbar=yes; hideurlbar=yes; closebuttoncaption=Đóng");
    this.browser=browser;
    this.setinterval();
    browser.on('exit').subscribe(() => {
      clearInterval(this.intervalID);
    }, err => {
      console.error(err);
    });
    browser.show();
  }

  clickitem(id) {
    this.zone.run(() => {
      this.id = id;
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
  goback() {
    clearInterval(this.intervalID);
    this.navCtrl.back();
  }
  setinterval()
  {
    if (this.loader) {
      this.loader.dismiss();
    }
    this.navCtrl.navigateBack('/hoteldetail/' + this.booking.HotelId);
    this.intervalID = setInterval(() => {
      this.checkBooking();
    }, 1000 * 1);
    setTimeout(() => {
      clearInterval(this.intervalID);
    }, 60000 * 15);
  }
  checkBooking()
  {
    var se=this;
    // var options = {
    //   method: 'GET',
    //   url: C.urls.baseUrl.urlPost + '/mCheckBooking',
    //   qs: { code: se.activityService.objPaymentMytrip.trip.booking_id },
    //   headers:
    //   {
    //   }
    // };
    let urlPath = C.urls.baseUrl.urlPost + '/mCheckBooking?code=' + se.activityService.objPaymentMytrip.trip.booking_id;
        let headers = {};
        this.gf.RequestApi('GET', urlPath, headers, { }, 'MytripPaymentChooseBank', 'checkBooking').then((data)=>{

      if (data) {
        var rs = data;
        if (rs.StatusBooking == 3) {
          var id = rs.BookingCode;
          var total = se.activityService.objPaymentMytrip.trip.priceShow
          var ischeck = '0'
          clearInterval(se.intervalID);
          se.browser.close();
          se.navCtrl.navigateForward('/roompaymentdoneean/' + id + '/' + total + '/' + ischeck);
        }
      }
      else {
        se.loader.dismiss();
        se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
      }
    });
  }

}
