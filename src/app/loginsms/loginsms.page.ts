import { ValueGlobal } from './../providers/book-service';
import { ToastController, NavController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
@Component({
  selector: 'app-loginsms',
  templateUrl: './loginsms.page.html',
  styleUrls: ['./loginsms.page.scss'],
})
export class LoginsmsPage implements OnInit {
  phone;
  @ViewChild('iptel') ipTel;
  constructor(private toastCtrl: ToastController, public navCtrl: NavController, public valueGlobal: ValueGlobal,
    public gf: GlobalFunction) { }
  ngOnInit() {
  }
  goback() {
    this.navCtrl.back();
  }
  next() {
    if (this.phonenumber(this.phone)) {
      var se = this;
      se.valueGlobal.phone = se.phone
      se.navCtrl.navigateForward('loginsmsverify')
      // var options = {
      //   method: 'POST',
      //   url: C.urls.baseUrl.urlMobile + '/api/account/OTPLoginSMS',
      //   //url: 'http://192.168.10.121:3400/api/account/OTPLoginSMS',
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
        this.gf.RequestApi('POST', urlPath, headers, { PhoneNumber: this.phone }, 'Login', 'postDatafb').then((data)=>{

        if (data.result) {
        }
        else {
          alert(data.msg);
        }
      });
    } else {
      this.presentToastPhone();
    }
  }
  ionViewWillEnter() {
    setTimeout(()=>{
      this.ipTel.setFocus();
    },300)
    
  }
  async presentToastPhone() {
    let toast = await this.toastCtrl.create({
      message: "Số điện thoại không hợp lệ. Xin vui lòng nhập lại.",
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
