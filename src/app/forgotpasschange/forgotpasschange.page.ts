import {FCM} from '@capacitor-community/fcm';
import { SearchHotel } from 'src/app/providers/book-service';
import { GlobalFunction } from './../providers/globalfunction';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NavController, ToastController, ModalController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ValueGlobal } from '../providers/book-service';

import { C } from './../providers/constants';
import jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-forgotpasschange',
  templateUrl: './forgotpasschange.page.html',
  styleUrls: ['./forgotpasschange.page.scss'],
})
export class ForgotpasschangePage implements OnInit {
  passwordIcon: string = 'eye-off';
  passwordType: string = 'password';
  pass; public deviceToken;refreshTokenTimer;
  constructor(public zone: NgZone, public gf: GlobalFunction, public storage: Storage,public searchhotel:SearchHotel, public navCtrl: NavController, public valueGlobal: ValueGlobal, private toastCtrl: ToastController,
    private platform: Platform) { }

  ngOnInit() {
  }
  saveChange() {
    var se = this;
    if (this.pass) {
      if (this.pass.length >= 6) {
        // var options = {
        //   method: 'POST',
        //   url: C.urls.baseUrl.urlMobile + '/api/account/SetForgotPassMobile',
        //   headers:
        //   {
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json'
        //   },
        //   body:
        //   {
        //     EmailOrPhone: this.valueGlobal.phone,
        //     Token: se.valueGlobal.token,
        //     Password: this.pass,
        //     Password2: this.pass,
        //     ResetToken: this.valueGlobal.resettoken,
        //     UserId: this.valueGlobal.userid
        //   },
        //   json: true
        // };

        let body =
        {
          EmailOrPhone: this.valueGlobal.phone,
          Token: se.valueGlobal.token,
          Password: this.pass,
          Password2: this.pass,
          ResetToken: this.valueGlobal.resettoken,
          UserId: this.valueGlobal.userid
        };
        let urlPath = C.urls.baseUrl.urlMobile + '/api/account/SetForgotPassMobile';
        let headers = {
          'cache-control': 'no-cache',
            'content-type': 'application/json'
        };
        this.gf.RequestApi('POST', urlPath, headers, body, 'forgotPassChange', 'saveChange').then((data)=>{

          if (data.result) {
            if (data.auth_token) {
              var decoded = jwt_decode<any>(data.auth_token);
              se.refreshTokenTimer=decoded.refreshTokenTimer;
              se.storage.set("email", decoded.email);
              se.storage.set("auth_token", data.auth_token);
              se.storage.set("username", decoded.fullname);
              se.storage.set("phone", decoded.phone);
              var checkfullname=se.hasWhiteSpace(decoded.fullname);
              var info;
              if (checkfullname) {
                var textfullname=decoded.fullname.trim();
                textfullname=decoded.fullname.split(' ');
                if(textfullname.length >2){
                  let name = '';
                  for(let i = 1; i < textfullname.length; i++){
                    if(i == 1){
                      name += textfullname[i];
                    }else{
                      name +=' ' +textfullname[i];
                    }
                  }
                  info = { ho: textfullname[0], ten: name , phone: decoded.phone}
                }else if(textfullname.length>1){
                  info = { ho: textfullname[0], ten: textfullname[1], phone: decoded.phone}
                }
                else if(textfullname.length==1){
                  info = { ho: textfullname[0], ten: "", phone: decoded.phone}
                }
                se.storage.set("infocus", info);
              } else {
                info = { ho: "", ten: "", phone: decoded.phone,fullname:""}
                se.storage.set("infocus", info);
              }
              if (Array.isArray(decoded.jti)) {
                se.storage.set("jti", decoded.jti[0]);
              }
              else {
                se.storage.set("jti", decoded.jti);
              }
              if(se.deviceToken){
                
                se.gf.pushTokenAndMemberID(data.auth_token, se.deviceToken, se.gf.getAppVersion());
              }
              se.storage.remove('blogtripdefault');
              se.storage.remove('regionnamesuggest');
              se.storage.remove('listtopdealdefault');
              
              se.valueGlobal.countNotifi = 0;
              se.gf.setParams(true,'resetBlogTrips');
              se.storage.set("point", decoded.point);
              se.searchhotel.rootPage ='login';
              //se.countdownRefreshToken();
              if (se.valueGlobal.logingoback) {
                se.navCtrl.navigateBack([se.valueGlobal.logingoback]);
              }
              else{
                se.navCtrl.navigateRoot('/');
              }
            }
          } else {
            alert(data.msg);
          }
        });
      } else {
        this.presentToastpass();
      }
    }
    else
    {
      se.gf.showAlertMessageOnly("Mật khẩu không được để trống");
    }
  }
  countdownRefreshToken() {
    var timer = parseInt(this.refreshTokenTimer);
    this.countdownTimer(timer);
  }
  countdownTimer(timer: number) {
    if (timer >= 0) {
      this.valueGlobal.interval = setInterval(() => {
        //console.log(timer);
        timer--;

        if (timer < 0) {
          clearInterval(this.valueGlobal.interval);
        }
      }, 1000);

    }
  }

  hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
  } 
  async presentToastpass() {
    let toast = await this.toastCtrl.create({
      message: "Mật khẩu phải ít nhất 6 ký tự",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  goback() {
    this.navCtrl.back();
  }
  hideShowPassword() {
    this.zone.run(() => {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    })
  }
}
