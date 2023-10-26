import { SearchHotel } from 'src/app/providers/book-service';
import { GlobalFunction } from './../providers/globalfunction';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NavController, ToastController, ModalController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ValueGlobal } from '../providers/book-service';

import { C } from './../providers/constants';
import {FCM} from '@capacitor-community/fcm';
import jwt_decode from 'jwt-decode';
import { flightService } from '../providers/flightService';


@Component({
  selector: 'app-loginsmsverify',
  templateUrl: './loginsmsverify.page.html',
  styleUrls: ['./loginsmsverify.page.scss'],
})
export class LoginsmsverifyPage implements OnInit {

  @ViewChild('ipOTP1') ipOTP1;
  @ViewChild('ipOTP2') ipOTP2;
  @ViewChild('ipOTP3') ipOTP3;
  @ViewChild('ipOTP4') ipOTP4;
  @ViewChild('ipOTP5') ipOTP5;
  @ViewChild('ipOTP6') ipOTP6;
  checkreview;
  num1 = ""; num2 = ""; num3 = ""; num4 = ""; num5 = ""; num6 = ""; phone; obj; strwarning; public deviceToken;refreshTokenTimer;appversion;
  constructor(public modalCtrl: ModalController,public searchhotel: SearchHotel, public zone: NgZone, public navCtrl: NavController, public keyboard: Keyboard, public storage: Storage, public valueGlobal: ValueGlobal, public toastCtrl: ToastController, public gf: GlobalFunction,
    public _flightService: flightService,
    private platform: Platform) {
    this.phone = this.valueGlobal.phone;
    this.storage.get('checkreview').then(checkreview => {
      this.checkreview=checkreview;
    })
      //Lấy app version
      this.appversion=this.gf.getAppVersion();
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
      //   url: C.urls.baseUrl.urlMobile +'/api/account/LoginSMS',
      //   headers:
      //   {
      //     'postman-token': 'aac9e726-944b-2180-2416-63d2b1031a7a',
      //     'cache-control': 'no-cache',
      //     'content-type': 'application/json'
      //   },
      //   body: { PhoneNumber: this.phone, Token: se.obj },
      //   json: true
      // };

      let urlPath = C.urls.baseUrl.urlMobile +'/api/account/LoginSMS';
        let headers = {
          'postman-token': '0b9f3a80-3e35-1af7-058f-597d733e7cee',
          'cache-control': 'no-cache',
          'content-type': 'application/json'
        };
        this.gf.RequestApi('POST', urlPath, headers, { PhoneNumber: this.phone, Token: se.obj }, 'Login', 'confirm').then((data)=>{

        if (data.result) {
          if (data.auth_token) {
            var decoded = jwt_decode<any>(data.auth_token);
            se.refreshTokenTimer=decoded.refreshTokenTimer;
            se.storage.set("email", decoded.email);
            se.storage.set("auth_token", data.auth_token);
            se.storage.set("username", decoded.fullname);
            se.storage.set("phone", decoded.phone);
            var checkfullname = false;
            if(decoded.fullname){
              checkfullname = se.hasWhiteSpace(decoded.fullname);
            }
            //se.storage.remove('deviceToken');
            if(se.platform.is('cordova') || se.platform.is('android')){
              FCM.getToken().then(token => {
                se.deviceToken = token;
                se.storage.set('deviceToken',token);
                if(se.deviceToken){
                  se.gf.pushTokenAndMemberID(data.auth_token, se.deviceToken, se.appversion);
                }
              });
            }
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
                info = { ho: textfullname[0], ten: name , phone: decoded.phone, gender: decoded.gender}
              }else if(textfullname.length>1){
                info = { ho: textfullname[0], ten: textfullname[1], phone: decoded.phone, gender: decoded.gender}
              }
              else if(textfullname.length==1){
                info = { ho: textfullname[0], ten: "", phone: decoded.phone, gender: decoded.gender}
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
            
            se.storage.remove('blogtripdefault');
            se.storage.remove('regionnamesuggest');
            se.storage.remove('listtopdealdefault');
            
            se.valueGlobal.countNotifi = 0;
            se.gf.setParams(true,'resetBlogTrips');
            if (!se.checkreview) {
              se.storage.set("checkreview", 0);
            }
            se.storage.set("point", decoded.point);
            se.searchhotel.rootPage ='login';
            se.countdownRefreshToken();
           
            if (se.valueGlobal.logingoback) {
              if(se.valueGlobal.logingoback == "flightadddetails"|| se.valueGlobal.logingoback == "flightadddetailsinternational"){
                se._flightService.itemFlightLogin.emit(1);
              }
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
    }
    else {
      se.presentToast("Xin nhập đầy đủ mã OTP");
    }

  }
  countdownRefreshToken() {
    var timer = parseInt(this.refreshTokenTimer);
    this.countdownTimer(timer);
  }
  countdownTimer(timer: number) {
    // if (timer >= 0) {
    //   this.valueGlobal.interval = setInterval(() => {
    //     //console.log(timer);
    //     timer--;

    //     if (timer < 0) {
    //       clearInterval(this.valueGlobal.interval);
    //       this.reloadToken()
    //     }
    //   }, 1000);

    // }
    for (let index = 0; index < 10; index++) {
      setTimeout(()=>{
        this.reloadToken();
      },1000)
      
    }
  }
  reloadToken() {
    this.refreshToken(); 
  }

  refreshToken() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'GET',
        //   url: C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims',
        //   headers:
        //   {
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json',
        //     authorization: text
        //   },
        // }
        
        let urlPath = C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims';
        let headers = {
          'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        };
        this.gf.RequestApi('GET', urlPath, headers, { }, 'Loginsmsverify', 'refreshToken').then((data)=>{
          if(data) {
            var json=data;
            if (json.auth_token) {
              se.storage.remove('auth_token').then(()=>{
                se.storage.set("auth_token", json.auth_token);
              })
              //se.countdownRefreshToken();
            }
          }
        })
      }
    })
  }
  hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
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
    var se = this;
      // var options = {
      //   method: 'POST',
      //   url: C.urls.baseUrl.urlMobile + '/api/account/OTPLoginSMS',
      //   headers:
      //   {
      //     'postman-token': '0b9f3a80-3e35-1af7-058f-597d733e7cee',
      //     'cache-control': 'no-cache',
      //     'content-type': 'application/json'
      //   },
      //   body: { PhoneNumber: this.phone },
      //   json: true
      // };

      let urlPath = C.urls.baseUrl.urlMobile + '/api/account/OTPLoginSMS';
        let headers = {
          'postman-token': '0b9f3a80-3e35-1af7-058f-597d733e7cee',
          'cache-control': 'no-cache',
          'content-type': 'application/json'
        };
        this.gf.RequestApi('POST', urlPath, headers, { PhoneNumber: this.phone }, 'Loginsmsverify', 'sendOTP').then((data)=>{

        if (!data.result) {
          alert(data.msg);
        }
      });
    }
}
