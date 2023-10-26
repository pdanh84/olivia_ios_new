import { ValueGlobal } from './../providers/book-service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { GlobalFunction } from '../providers/globalfunction';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { NavController, MenuController, Platform } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';

import jwt_decode from 'jwt-decode';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import {FCM} from '@capacitor-community/fcm';
@Component({
  selector: 'app-register',
  templateUrl: 'register.html',
  styleUrls: ['register.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild('user') input;
  public regData: FormGroup; ischeck;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  appversion: string;
  deviceToken: any;

  constructor(public keyboard: Keyboard,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public formBuilder: FormBuilder, private iab: InAppBrowser, public platform: Platform, private toastCtrl: ToastController, public storage: Storage, public gf: GlobalFunction, public zone: NgZone
    , public valueGlobal: ValueGlobal
    ) {

    this.regData = this.formBuilder.group({
      emailorphone: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
    });
  }
  ngOnInit() {
  }
  hideShowPassword() {
    this.zone.run(() => {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    })
  }
  ionViewDidLoad() {
    //hide menu when on the login page, regardless of the screen resolution
    this.menuCtrl.enable(false);
  }

  register() {
    if(!this.regData.value.name){
      this.presentToast("Vui lòng nhập tên đầy đủ");
      return;
    }
    else if (this.regData.value.emailorphone) {
      var checkmail = this.validateEmail(this.regData.value.emailorphone);
      if (checkmail) {
        if (this.regData.value.password) {
          var test = this.regData.value.password.length;
          if (test >= 6) {
            this.funcregister();
          } else {
            this.presentToast("Mật khẩu phải ít nhất 6 ký tự");
          }
        }
        else {
          this.presentToast("Vui lòng nhập mật khẩu");
        }
      }
      else {
        if (this.phonenumber(this.regData.value.emailorphone)) {
          var test = this.regData.value.password.length;
          if (test > 0) {
            if (test >= 6) {
              this.postapiRegisterByPhone();
            } else {
              this.presentToast("Mật khẩu phải ít nhất 6 ký tự");
            }
          }
          else {
            this.presentToast("Vui lòng nhập mật khẩu");
          }

        }
        else {
          this.presentToast("Định dạng email không đúng hoặc số điện thoại không chính xác");
        }
      }

    } else {
      this.presentToast("Vui lòng nhập email hoặc số điện thoại");
    }
  }
  postapiRegisterByPhone() {
    var se = this;

    let body = { phoneNumber: this.regData.value.emailorphone, password: this.regData.value.password, password2: this.regData.value.password };
    let urlPath = C.urls.baseUrl.urlMobile + '/api/Account/RegisterByPhone';
    let headers = { 
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    };
    this.gf.RequestApi('POST', urlPath, headers, body, 'register', 'postapiRegisterByPhone').then((data)=>{

      if (data) {
        if (data.result) {
          se.valueGlobal.phone = se.regData.value.emailorphone
          se.navCtrl.navigateForward('registerverify')
        }
        else {
          alert(data.msg);
        }
      }
    });
  }
  
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  funcregister() {
    var se = this;
    // var options = {
    //   method: 'POST',
    //   url: C.urls.baseUrl.urlMobile + '/api/Account/Register',
    //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
    //   headers:
    //   {
    //     'cache-control': 'no-cache',
    //     'content-type': 'application/json'
    //   },
    //   body:
    //   {
    //     email: this.regData.value.emailorphone,
    //     password: this.regData.value.password,
    //     password2: this.regData.value.password
    //   },
    //   json: true
    // };

    let body =
    {
      email: this.regData.value.emailorphone,
      password: this.regData.value.password,
      password2: this.regData.value.password
    };
    let urlPath = C.urls.baseUrl.urlMobile + '/api/Account/Register';
    let headers = { 
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    };
    this.gf.RequestApi('POST', urlPath, headers, body, 'register', 'funcregister').then((data)=>{

      if (data) {
        alert(data.msg);
        se.logintk();
      }
      else {
        alert(data.msg);
      }

    });
  }
  logintk() {
    var se = this;
   
    let body =
    {
      emailOrPhone: this.regData.value.email,
        password: this.regData.value.password,
        rememberMe: true
    };
    let urlPath = C.urls.baseUrl.urlMobile + '/api/Account/Login';
    let headers = { 
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    };
    this.gf.RequestApi('POST', urlPath, headers, body, 'register', 'logintk').then((data)=>{

      if (data.auth_token) {
        var decoded = jwt_decode<any>(data.auth_token);
       
        se.zone.run(() => {
          se.storage.set("email", decoded.email);
          se.storage.set("auth_token", data.auth_token);
          se.storage.set("username", decoded.fullname);
          if (Array.isArray(decoded.jti)) {
            se.storage.set("jti", decoded.jti[0]);
          }
          else {
            se.storage.set("jti", decoded.jti);
          }
          se.storage.set("point", decoded.point);
          //PDANH 19/07/2019: Push memberid & devicetoken
          if (se.deviceToken) {
            se.gf.pushTokenAndMemberID(data.auth_token, se.deviceToken, se.appversion);
          }
          se.navCtrl.navigateRoot('/');
        }, 10)
      }
    });
    //google analytic
    this.gf.googleAnalytion('loginusername', 'login', '');
  }
  ionViewDidEnter() {
    setTimeout(() => {
      this.input.setFocus();
    }, 150);
    this.keyboard.show();
  }

  goback() {
    this.navCtrl.back();
  }

  async ionViewWillEnter() {
    //Test notification
    this.platform.ready().then(() => {
      FCM.getToken().then(token => {
        console.log(token);
        this.deviceToken = token;
      });
    })
    //Lấy app version
    this.appversion= await this.gf.getAppVersion();
  }
  async presentToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  phonenumber(inputtxt) {
    var n = Number(inputtxt);
    if (n) {
      var test1 = inputtxt.length;
      if (inputtxt) {
        if (test1 == 10) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
}
