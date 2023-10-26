import { SearchHotel } from 'src/app/providers/book-service';
import { GlobalFunction } from './../providers/globalfunction';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NavController, ToastController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ValueGlobal } from '../providers/book-service';

import { C } from './../providers/constants';
import {FCM} from '@capacitor-community/fcm';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-forgotpassotp',
  templateUrl: './forgotpassotp.page.html',
  styleUrls: ['./forgotpassotp.page.scss'],
})
export class ForgotpassotpPage implements OnInit {

 
  @ViewChild('ipOTP1') ipOTP1;
  @ViewChild('ipOTP2') ipOTP2;
  @ViewChild('ipOTP3') ipOTP3;
  @ViewChild('ipOTP4') ipOTP4;
  @ViewChild('ipOTP5') ipOTP5;
  @ViewChild('ipOTP6') ipOTP6;
  checkreview;
  num1 = ""; num2 = ""; num3 = ""; num4 = ""; num5 = ""; num6 = ""; phone; obj; strwarning; public deviceToken;refreshTokenTimer;
  constructor(public modalCtrl: ModalController,public searchhotel: SearchHotel,public zone: NgZone, public navCtrl: NavController, public keyboard: Keyboard, public storage: Storage, public valueGlobal: ValueGlobal, public toastCtrl: ToastController, public gf: GlobalFunction) {
    this.phone = this.valueGlobal.phone;
    this.storage.get('checkreview').then(checkreview => {
      this.checkreview=checkreview;
    })
      //Lấy app version
    
  }

  ngOnInit() {
  }
  goback() {
    this.navCtrl.back();
  }
  ionViewDidEnter() {
    setTimeout(() => {
      this.ipOTP1.setFocus();
    }, 150);
    this.keyboard.show();
  }
  change1() {
    if (this.num1) {
      this.ipOTP2.setFocus();
      this.keyboard.show();
    }
  }
  change2() {
    if (this.num2) {
      this.ipOTP3.setFocus();
      this.keyboard.show();
    }
  }
  change3() {
    if (this.num3) {
      this.ipOTP4.setFocus();
      this.keyboard.show();
    }
  }
  change4() {
    if (this.num4) {
      this.ipOTP5.setFocus();
      this.keyboard.show();
    }
  }
  change5() {
    if (this.num5) {
      this.ipOTP6.setFocus();
      this.keyboard.show();
    }
  }
  confirm() {
    var se = this;
    if (this.num1 && this.num2 && this.num3 && this.num4 && this.num6) {
      se.obj = this.num1 + this.num2 + this.num3 + this.num4 + this.num5 + this.num6;
      // var options = {
      //   method: 'POST',
      //   url: C.urls.baseUrl.urlMobile +'/api/account/CheckTokenForgotPassWord',
      //   headers:
      //   {
      //     'cache-control': 'no-cache',
      //     'content-type': 'application/json'
      //   },
      //   body: { EmailOrPhone: this.phone, Token: se.obj },
      //   json: true
      // };
      let urlPath = C.urls.baseUrl.urlMobile +'/api/account/CheckTokenForgotPassWord';
        let headers = {
          'cache-control': 'no-cache',
            'content-type': 'application/json',
        };
        this.gf.RequestApi('POST', urlPath, headers, {EmailOrPhone: this.phone, Token: se.obj}, 'forgotPassOTP', 'confirm').then((data)=>{

        if (data.result) {
          se.valueGlobal.resettoken=data.resettoken;
          se.valueGlobal.userid=data.userid;
          se.valueGlobal.token=se.obj;
          se.navCtrl.navigateForward('forgotpasschange');
        }
        else
        {
          alert(data.msg);
        }
      });
    }
    else {
      se.presentToast("Xin nhập đầy đủ mã OTP");
    }

  }
  
  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
  
  sendOTP() {
    // var options = {
    //   method: 'POST',
    //   url: C.urls.baseUrl.urlMobile + '/api/account/OTPForgotPassWord',
    //   headers:
    //   {

    //     'cache-control': 'no-cache',
    //     'content-type': 'application/json'
    //   },
    //   body: { EmailOrPhone: this.phone },
    //   json: true
    // };
    let urlPath = C.urls.baseUrl.urlMobile + '/api/account/OTPForgotPassWord';
        let headers = {
          'cache-control': 'no-cache',
            'content-type': 'application/json',
        };
        this.gf.RequestApi('POST', urlPath, headers, {EmailOrPhone: this.phone}, 'forgotPassOTP', 'confirm').then((data)=>{

        alert(data.msg);
    });
  }
}
