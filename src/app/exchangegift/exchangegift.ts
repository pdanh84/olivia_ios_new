import { Component,NgZone ,OnInit} from '@angular/core';
import { NavController, AlertController, ToastController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
var document:any;
@Component({
  selector: 'app-exchangegift',
  templateUrl: 'exchangegift.html',
  styleUrls: ['exchangegift.scss'],
})

export class ExchangeGiftPage implements OnInit{
    userInfoData:any;
    record:any;
    CountryCode: string;
    optCheck: number = 0;
    public customerName: string;
    public customerMobile: string;
    public customerAddress: string;
    public nameValidate =  true;
    public mobileValidate =  true;
    public addressValidate =  true;
    location;
    constructor(public platform:Platform,public navCtrl: NavController, public toastCtrl: ToastController,
        public zone: NgZone,public storage: Storage,public alertCtrl: AlertController,
        public gf: GlobalFunction){
        let self = this;
        //Load data reward
        let params = self.gf.getParams('exchangegift');
        if(params && params.userinfo){
            self.loadData(params.record, params.userinfo);
        }
        //Xử lý nút back của dt
        this.platform.ready().then(() => {
          this.platform.backButton.subscribe(() => {
            this.navCtrl.navigateBack('/showmore');
          })
        })
        //google analytic
      gf.googleAnalytion('exchangegift','load','');
    }

    ngOnInit(){
    }

    loadData(rc,uinfo){
        var se = this;
        se.record = rc;
        se.userInfoData = uinfo;
    }

    close(){
      this.navCtrl.navigateBack('/showmore');
    }

    async presentToast(msg) {
        const toast = await this.toastCtrl.create({
          message: msg,
          duration: 2000,
          position: 'top',
        });
        toast.present();
      }

      radioCheck(val){
          this.zone.run(()=>{
            this.optCheck = val;
            var itemRadioButton:any = window.document.getElementsByClassName('radio-icon')
            if(val==1){
              itemRadioButton[0].classList.add('radio-checked');
              itemRadioButton[1].classList.remove('radio-checked');
              itemRadioButton[0].nextElementSibling.setAttribute('aria-checked','true');
              itemRadioButton[1].nextElementSibling.setAttribute('aria-checked','false');
            }else{
              itemRadioButton[1].classList.add('radio-checked');
              itemRadioButton[0].classList.remove('radio-checked');
              itemRadioButton[1].nextElementSibling.setAttribute('aria-checked','true');
              itemRadioButton[0].nextElementSibling.setAttribute('aria-checked','false');
            }
          })
      }

      filterPhone(phone){
        var pattern = new RegExp("0[9|8|1|7|3|5]([0-9]|\s|-|\.){8,12}");
        return pattern.test(phone);
      }
    /**
     * Nhấn nút đổi quà
     */
      exchange(){
        //Validate name
        // if(window.document.getElementById('ipName') && !this.customerName){
        //   this.nameValidate = false;
        //   this.setInputFocus("ipName");
        //   return;
        //   }else if(this.customerName){
        //     this.nameValidate= true;
        //   }
        //  //Validate số điện thoại
        //  if(window.document.getElementById('ipMobile') && !this.filterPhone(this.customerMobile)){
        //   this.mobileValidate = false;
        //   this.setInputFocus("ipMobile");
        //   return;
        //   }else if(this.filterPhone(this.customerMobile)){
        //     this.mobileValidate= true;
        //   }
        //   //Validate address
        // if(window.document.getElementById('ipAddress') &&!this.customerAddress){
        //   this.addressValidate = false;
        //   this.setInputFocus("ipAddress");
        //   return;
        //   }else if(this.customerAddress){
        //     this.addressValidate= true;
        //   }
        //   if(this.record){
        //     var obj ={
        //       "redeemInfo": {
        //         "itemId": this.record.id,
        //         "itemType": this.record.rewardTypeId,
        //         "pickupType": this.optCheck,
        //         "point": this.record.unitPoint,
        //         "fullname": this.optCheck == 2 ? this.customerName : "",
        //         "phone": this.optCheck == 2 ? this.customerMobile : "",
        //         "address": this.optCheck == 2 ? this.customerAddress : ""
        //       }
        //     }
        //     var se = this;

        //     se.storage.get('auth_token').then(auth_token => {
        //         if (auth_token) {
        //         var text = "Bearer " + auth_token;
        //         var options = {
        //           method: 'POST',
        //           url: C.urls.baseUrl.urlMobile +"/api/Dashboard/RedeemItem",
        //           timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //           headers:
        //             {
        //               'accept': 'application/json',
        //               'content-type': 'application/json-patch+json',
        //               authorization: text
        //             },
        //           body: JSON.stringify(obj),
        //         };
        //         request(options, function (error, response, body) {
        //           if (error) {
        //             error.page= "exchangegift";
        //             error.func= "exchange";
        //             error.param = JSON.stringify(options);
        //             C.writeErrorLog(error,response);
        //             throw new Error(error);
        //           };
        //           if(response.statusCode != 200){
        //             var objError ={
        //               page: "exchangegift",
        //               func: "exchange",
        //               message : response.statusMessage,
        //               content : response.body,
        //               param: JSON.stringify(options)
        //               };
        //             C.writeErrorLog(error,response);
        //           }
        //           if(response.statusCode == 200){
        //             var htmlstr = "<div class='ct-1'>Chúc mừng quý khách Phạm Đức Anh đã đổi quà tặng thành công.</div>";
        //             htmlstr += "<div class='ct-2'>Thời gian dự kiến nhận được quà từ 3 - 5 ngày làm việc (trừ thứ 7, chủ nhật & lễ Tết).</div>";
        //             htmlstr += "<div class='ct-3'>Nếu cần sự hỗ trợ vui lòng liên hệ với iVIVU.com qua email tc@ivivu.com hoặc số tổng đài sau:</div>";
        //             htmlstr += "<div class='ct-4'>Hồ Chí Minh: 1900 1870</div>";
        //             htmlstr += "<div class='ct-5'>Hà Nội: 1900 2045</div>";
        //             htmlstr += "<div class='ct-6'>Cần Thơ: 1900 2087</div>";
        //             htmlstr += "<div class='ct-7'>Đà Nẵng: (023) 6710 9566</div>";
        //             se.presentAlert('',htmlstr, text);
        //           }
        //         })
        //       }
        //     });
        //   }
          
      }

      setInputFocus(name){
        //const element = window.document.getElementById(name);
        //this.renderer.invokeElementMethod(element, 'focus', []);
      }
      /**
       * Thông báo đổi quà thành công + refresh key token
       * @param title tiêu đề thông báo
       * @param msg thông báo đổi quà thành công
       * @param token key token
       */
      async presentAlert(title,msg,token) {
        // const alert = await this.alertCtrl.create({
        //   message: msg,
        //   buttons: ['OK']
        // });
    
        // await alert.present();

        // alert.dismiss(()=>{
        //   //reload token
        //   var options = {
        //     method: 'POST',
        //     url: C.urls.baseUrl.urlMobile +"/api/account/reloadTokenClaims",
        //     timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //     headers:
        //       {
        //         'accept': 'application/json',
        //         'content-type': 'application/json-patch+json',
        //         authorization: token
        //       },
        //     body: {},
        //   };
        //   request(options, function (error, response, body) {
        //     if (error) {
        //       error.page= "reloadTokenClaims";
        //       error.func= "exchange";
        //       error.param = JSON.stringify(options);
        //       C.writeErrorLog(error,response);
        //     };
        //     if(response.statusCode != 200){
        //       var objError ={
        //         page: "reloadTokenClaims",
        //         func: "exchange",
        //         message : response.statusMessage,
        //         content : response.body,
        //         param: JSON.stringify(options)
        //         };
        //       C.writeErrorLog(error,response);
        //     }
        //   })
        //   this.navCtrl.navigateBack('/showmore');
        // })
      }
}