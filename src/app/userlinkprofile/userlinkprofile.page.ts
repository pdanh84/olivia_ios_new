import { OverlayEventDetail } from '@ionic/core';
import { Component, NgZone, OnInit } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';
import { Storage } from '@ionic/storage';
import { GlobalFunction } from '../providers/globalfunction';
import { LoadingController, ToastController, AlertController, NavController, Platform } from '@ionic/angular';
import { C } from './../providers/constants';

import jwt_decode from 'jwt-decode';
import {FCM} from '@capacitor-community/fcm';

@Component({
    selector: 'app-userlinkprofile',
    templateUrl: 'userlinkprofile.page.html',
    styleUrls: ['userlinkprofile.page.scss'],
})

export class UserLinkProfilePage implements OnInit {
    link: any;
    loader: any;
    userData: { accessToken: string; id: any; email: any; UserName: any; picture: any; username: any; phone: any; gender: any; };
    appversion: any;
    constructor(private fb: Facebook,
        private storage: Storage,
        public gf: GlobalFunction,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        private navCtrl: NavController,
        private platform: Platform
        ){
        this.storage.get('fbaccesstoken').then((accesstoken)=> {
            this.link = accesstoken;
        });
    };
    ngOnInit() {
        
    } 
    async ionViewOnEnter(){
      //Lấy app version
      this.appversion= await this.gf.getAppVersion();
    }

    goback(){
        this.navCtrl.back();
    }

    async unlinkfb(){
        let alert = await this.alertCtrl.create({
            message: 'Bạn có chắc chắn muốn hủy liên kết với tài khoản facebook hiện tại?',
            cssClass: "cls-alert-showmore",
            buttons: [{
              text: 'Có',
              role: 'OK',
              handler: () => {
                //if(this.link){
                  //this.fb.logout().then((response) => {
                   // console.log(response);
                    //this.fb.
                    this.fb.api("me/permissions",[], 'DELETE').then((response) => {
                      if(response && response.success){
                          this.storage.remove('fbaccesstoken');
                          this.link = false;
                          this.gf.showToastWarning('Hủy liên kết thành công');
                     }else{
                          this.gf.showToastWarning('Đã có lỗi xảy ra, vui lòng thử lại sau');
                      }
                   });
                 //});

               // }
               
              }
            },
            {
              text: 'Không',
              handler: () => {
      
              }
            }
            ]
          });
          alert.present();
       
    }

    linkfb(){
        var se = this;
        se.fb.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
        se.presentLoadingnotime();
        se.fb.api('me?fields=id,name,email,first_name,gender,picture.width(720).height(720).as(picture_large)', []).then(profile => {
            se.fb.getLoginStatus().then(response => {
            var test = JSON.stringify(response.authResponse.accessToken);
            se.storage.set('fbaccesstoken',test);
            se.userData = { accessToken: test, id: profile['id'], email: profile['email'], UserName: profile['first_name'], picture: profile['picture_large']['data']['url'], username: profile['name'], phone: profile['phone'], gender: profile['gender'] }
            if (se.userData.email) {
                se.postDatafb();
            } else {
                se.checknomail();
            }
            });

        }).catch( (reason: any) =>{
          se.loader.dismiss();
          console.log(reason);
          });
        }).catch( (reason: any) =>{
        se.loader.dismiss();
        console.log(reason);
        });
    }

    postDatafb() {
        var se = this;
        let body =
        {
          userData:
          {
            email: this.userData.email,
            name: this.userData.username,
            id: this.userData.id,
            image: this.userData.picture,
            provider: 'facebook',
            token: this.userData.accessToken,
            idToken: ''
          }
        };
        let urlStr = C.urls.baseUrl.urlMobile + '/api/account/socialLogin';
          
          let headers = {
            'cache-control': 'no-cache',
            'content-type': 'application/json'
          };
          this.gf.RequestApi('POST', urlStr, headers, body, 'userlinkprofile', 'postDatafb').then((data)=>{

          if (data.result) {
            se.loader.dismiss();
            var decoded = jwt_decode<any>(data.auth_token);
            
            se.storage.set("email", decoded.email);
            se.storage.set("auth_token", data.auth_token);
            se.storage.set("username", decoded.fullname);
            se.storage.set("phone", decoded.phone);
            se.storage.set("refreshTokenTimer", decoded.refreshTokenTimer ? decoded.refreshTokenTimer : 10);
            var checkfullname=se.hasWhiteSpace(decoded.fullname);
            if(se.platform.is('cordova')){
              se.storage.remove('deviceToken');
              FCM.getToken().then(token => {
                
                se.storage.set('deviceToken',token);
                //PDANH 19/07/2019: Push memberid & devicetoken
                if(token){
                  se.gf.pushTokenAndMemberID(data.auth_token, token, se.appversion);
                }
              });
            }
            var info;
            if (checkfullname) {
              var textfullname=decoded.fullname.trim();
              textfullname=decoded.fullname.split(' ');
              //info = { ho: textfullname[0], ten: textfullname[1], phone: decoded.phone}
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
            // se.storage.set("jti", decoded.jti[0]);
            if (Array.isArray(decoded.jti)) {
              se.storage.set("jti", decoded.jti[0]);
            }
            else {
              se.storage.set("jti", decoded.jti);
            }
            
            se.storage.remove('blogtripdefault');
            se.storage.remove('regionnamesuggest');
            se.storage.remove('listtopdealdefault');
            
            
            se.storage.set("point", decoded.point);
            se.link = true;
          }else if(!data.result && data.msg){
            se.gf.showMessageWarning(data.msg);
          }
        });
      }

    async presentLoadingnotime() {
        this.loader = await this.loadingCtrl.create({
          message: "",
        });
        this.loader.present();
      }

      checknomail() {
        var se = this;
        // var options = {
        //   method: 'POST',
        //   url: C.urls.baseUrl.urlMobile + '/api/account/CheckSocialNoEmail',
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json'
        //   },
        //   body:
        //   {
        //     userData:
        //     {
        //       id: this.userData.id,
        //       idToken: '',
        //       image: this.userData.picture,
        //       name: this.userData.username,
        //       provider: 'facebook',
        //       token: this.userData.accessToken
        //     }
        //   },
        //   json: true
        // };
        // console.log(JSON.stringify(options.body))
        let body =
        {
          userData:
          {
            id: this.userData.id,
            idToken: '',
            image: this.userData.picture,
            name: this.userData.username,
            provider: 'facebook',
            token: this.userData.accessToken
          }
        };
        let urlStr = C.urls.baseUrl.urlMobile + '/api/account/CheckSocialNoEmail';
          
          let headers = {
            'cache-control': 'no-cache',
            'content-type': 'application/json'
          };
          this.gf.RequestApi('POST', urlStr, headers, body, 'userlinkprofile', 'postDatafb').then((data)=>{

          if (data.result) {
            se.postDatafb();
          } else {
            se.presentPrompt();
          }
        });
      }
      hasWhiteSpace(s) {
        return s.indexOf(' ') >= 0;
      } 

      async presentPrompt() {
        this.loader.dismiss();
        let alert = await  this.alertCtrl.create({
          subHeader: 'Tài khoản của bạn không có email hoặc không để ở chế độ công khai. Vui lòng cung cấp email để iVIVU có thể xác định và bảo mật tài khoản của bạn:',
          inputs: [
            {
              name: 'email',
              placeholder: 'Nhập email'
            }
          ],
          buttons: [
            {
              text: 'Bỏ qua',
              role: 'cancel',
              handler: data => {
                this.postDatafb();
              }
            },
            {
              text: 'Xác nhận',
              handler: data => {
                if (data.email) {
                  // logged in!
                  this.userData.email = data.email;
                  var test = this.validateEmail(data.email);
                  if (test == true) {
                    this.postDatafb();
                  } else {
                    this.presentToastemail();
                  }
                } else {
                  // invalid login
                  return false;
                }
              }
            }
    
          ]
        });
        await alert.present();
      }
      validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }
      async presentToastemail() {
        let toast = await this.toastCtrl.create({
          message: "Định dạng email không đúng",
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
}