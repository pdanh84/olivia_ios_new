import { ValueGlobal } from './../providers/book-service';
import { ToastController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.page.html',
  styleUrls: ['./forgotpass.page.scss'],
})
export class ForgotpassPage implements OnInit {
  phoneoremail='';
  captcha:any=null;
  public forgotpassData: FormGroup;
  validCaptcha: any;
  constructor(private toastCtrl: ToastController, public navCtrl: NavController, public valueGlobal: ValueGlobal,
    public gf: GlobalFunction, public formBuilder: FormBuilder,) {
      this.forgotpassData = this.formBuilder.group({
        //captcha: [null, Validators.compose([Validators.required])],
        phoneoremail: ['', Validators.compose([Validators.required])],
      });
     }
  ngOnInit() {
  }
  goback() {
    this.navCtrl.back();
  }
  next() {
    //  if(!this.validCaptcha){
    //   this.gf.showToastWarning('Captcha không hợp lệ!');
    //   return;
    //  }
      var se = this;
      this.gf.showLoading();
      let urlPath = C.urls.baseUrl.urlMobile + '/api/account/OTPForgotPassWord';
      let headers = {
        'cache-control': 'no-cache',
          'content-type': 'application/json'
      };
      this.gf.RequestApi('POST', urlPath, headers, {EmailOrPhone: this.phoneoremail}, 'foodReviewweek', 'loadReview').then((data)=>{

        if (data.result) {
          se.valueGlobal.phone = se.phoneoremail
          se.navCtrl.navigateForward('forgotpassotp');
          se.gf.hideLoading();
        }
        else {
          se.gf.showAlertMessageOnly(data.msg);
          se.gf.hideLoading();
        }
      });
    
  }

   resolved(response: string) {
    if(response != null && response != undefined) {
      this.validCaptcha = !this.validCaptcha;
    }else {
      this.validCaptcha = false;
    }
  }
}
