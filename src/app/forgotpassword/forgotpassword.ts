import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../providers/auth-service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

import jwt_decode from 'jwt-decode';
import { ValueGlobal } from '../providers/book-service';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: 'forgotpassword.html',
  styleUrls: ['forgotpassword.scss'],
})

export class ForgotPasswordPage implements OnInit {
  @ViewChild('user') input;
  public emailvalidate = true;
  usermail;
  constructor(public keyboard: Keyboard, public platform: Platform, public valueGlobal: ValueGlobal, public navCtrl: NavController, public formBuilder: FormBuilder, public authService: AuthService, public storage: Storage,
    private toastCtrl: ToastController, public zone: NgZone, public gf: GlobalFunction,public alertCtrl: AlertController) {
     
  }
  ngOnInit() {
  }

  resetPassword(){
      //Validate email
      if(!this.filterEmail(this.usermail)){
        this.emailvalidate = false;
        return;
      }else if(this.filterEmail(this.usermail)){
        this.emailvalidate = true;

        var se = this;
        var options = {
            method: 'POST',
            url: C.urls.baseUrl.urlMobile + '/api/Account/ForgotPass',
            timeout: 10000, maxAttempts: 5, retryDelay: 2000,
            headers:
            {
              'cache-control': 'no-cache',
              'content-type': 'application/json'
            },
            body:
            {
                email: this.usermail,
            },
            json: true
          };
      
          let urlPath = C.urls.baseUrl.urlMobile + '/api/Account/ForgotPass';
          let headers = {
            'cache-control': 'no-cache',
              'content-type': 'application/json',
          };
        this.gf.RequestApi('POST', urlPath, headers, {email: this.usermail}, 'forgotPassword', 'resetPassword').then((data)=>{

            var rs = data;
            if(rs.result){
                se.showAlertMsg();
            }
          });
      }
  }

  async showAlertMsg(){
    let alert = await this.alertCtrl.create({
        header: "Quên mật khẩu",
        message: "Hệ thống đã gửi link lấy lại mật khẩu đến email của quý khách!. Trong vòng 5 phút vẫn chưa nhận được mail, quý khách vui lòng thử lại bước này.",
        cssClass:"cls-alert-flightcomboreview",
        buttons: [{
          text: 'Về đăng nhập',
          role: 'OK',
          handler: () => {
            this.navCtrl.navigateBack('/loginusername');
          }
        }
      ]
    });
    alert.present();
  }

  filterEmail(email) {
    var regex = new RegExp(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/);
    return regex.test(email);
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.input.setFocus();
    }, 150);
    this.keyboard.show();
    const ionSelects:any = window.document.querySelectorAll('ion-item');
    let img = null;
      const selectItemNavtiveInner = ionSelects[0].shadowRoot.querySelector('.item-native');
      if(selectItemNavtiveInner){
       selectItemNavtiveInner.setAttribute('style','background: transparent !important');
      }
  }

  ionViewWillEnter(){
     // ion-item customizing
     const ionSelects:any = window.document.querySelectorAll('ion-item');
     let img = null;
     var item =ionSelects[0];
     if(ionSelects.length >1){
         let idx = ionSelects.length -1;
        item = ionSelects[idx];
     }
       const selectItemNavtiveInner = item.shadowRoot.querySelector('.item-native');
       if(selectItemNavtiveInner){
        selectItemNavtiveInner.setAttribute('style','background: transparent !important');
       }
  }

  goback() {
    this.navCtrl.back();
  }
}
