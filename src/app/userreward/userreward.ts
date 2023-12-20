import { Component,NgZone ,OnInit} from '@angular/core';
import { Platform, NavController, AlertController,  ToastController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { C } from './../providers/constants';
import { ValueGlobal } from '../providers/book-service';
import { GlobalFunction } from './../providers/globalfunction';

@Component({
  selector: 'app-userreward',
  templateUrl: 'userreward.html',
  styleUrls: ['userreward.scss'],
})

export class UserRewardPage implements OnInit{
    userRewardData:any;
    userInfoData:any;
    CityName: string;
    CountryCode: string;
    public isShowConfirm = false;
    public intervalID;
    
    constructor(public platform: Platform,public navCtrl: NavController,public toastCtrl: ToastController,
        public zone: NgZone,public storage: Storage,public alertCtrl: AlertController,public modalCtrl: ModalController,public valueGlobal: ValueGlobal,
        public gf: GlobalFunction){
        let self = this;
        //load userinfo
        
        self.loadUserInfo();
        self.fetuserRewardData();
       
        //Load userreward
        self.storage.get('userRewardData').then((data:any)=>{
            if(data){
                self.userRewardData = data;
            }else{
                self.fetuserRewardData();
            }
        })

        gf.googleAnalytion('userreward','load','');
    }

    ngOnInit(){

    }

    ionViewDidEnter(){
        // var se = this;
        // se.intervalID = setInterval(()=>{
        //     se.refreshToken();
        // },20000);
    }

    ionViewWillLeave(){
        this.zone.run(()=>{
            clearInterval(this.intervalID);
        })
    }

    loadUserInfo(){
        var se = this;
        se.storage.get('auth_token').then(auth_token => {
            if (auth_token) {
                var text = "Bearer " + auth_token;
                this.gf.getUserInfo(auth_token).then((data) => {
                    if(data){
                        se.zone.run(()=>{
                            se.userInfoData = data;
                        });
                        //se.storage.set('userInfoData', data);
                    }else{
                        if(se.isShowConfirm) return;
                        //se.showConfirm();
                        se.isShowConfirm = true;
                    }
                
                });
            }
        })
    }

    fetuserRewardData(){
          var se = this;
            se.storage.get('auth_token').then(auth_token => {
            if (auth_token) {
                var text = "Bearer " + auth_token;
                // var options = {
                // method: 'GET',
                // url: C.urls.baseUrl.urlMobile +'/api/Dashboard/GetRewardItems',
                // timeout: 10000, maxAttempts: 5, retryDelay: 2000,
                // headers:
                // {
                //     'cache-control': 'no-cache',
                //     'content-type': 'application/json',
                //     authorization: text
                // }
                // };
                let urlStr = C.urls.baseUrl.urlMobile +'/api/Dashboard/GetRewardItems';
          
                    let headers = {
                        'cache-control': 'no-cache',
                        'content-type': 'application/json',
                        authorization: text
                    };
                    this.gf.RequestApi('GET', urlStr, headers, {}, 'userreward', 'fetuserRewardData').then((data)=>{
                    if(data){
                        se.zone.run(()=>{
                            se.userRewardData = data;
                        })
                        se.storage.set('userRewardData', data);
                    }else{
                        if(se.isShowConfirm) return;
                        //se.showConfirm();
                        se.isShowConfirm = true;
                    }
                    
                
                
                });
            }
            });
    }

    goback(){
        var self = this;
        self.navCtrl.back();
    }

    public async showConfirm(){
        let alert = await this.alertCtrl.create({
          message: "Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại để sử dụng chức năng này.",
          buttons: [{
            text: 'Đăng nhập ngay',
            role: 'OK',
            handler: () => {
              this.storage.remove('auth_token');
              this.storage.remove('email');
              this.storage.remove('username');
              this.storage.remove('jti');
              this.storage.remove('userInfoData');
              this.storage.remove('userRewardData');
              this.storage.remove('point');
              //this.valueGlobal.logingoback = "MainPage";
              this.navCtrl.navigateForward('/login');
            }
          },
          {
            text: 'Để sau',
            handler: () => {
              this.storage.remove('auth_token');
              this.storage.remove('email');
              this.storage.remove('username');
              this.storage.remove('jti');
              this.storage.remove('userInfoData');
              this.storage.remove('userRewardData');
              this.storage.remove('point');
              this.navCtrl.back();
            }
          }
        ]
      });
      alert.present();
    }

    exchangeGift(item){
        var se = this;
        if(se.userInfoData){
            if(se.userInfoData.point >= item.unitPoint){
                // let modal = se.modalCtrl.create("ExchangeGiftPage", {record: item,userinfo: se.userInfoData});
                // modal.present();
                this.gf.setParams({record: item,userinfo: se.userInfoData}, 'exchangegift');
                this.navCtrl.navigateBack('/exchangegift');
            }else{
                se.presentToast('Rất tiếc, quý khách chưa đủ điểm để đổi quà tặng này!');
            }
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

      refreshToken(){
        var se = this;
        se.storage.get('auth_token').then(auth_token => {
            if (auth_token) {
            var text = "Bearer " + auth_token;
                //     var options = {
                //     method: 'GET',
                //     url: C.urls.baseUrl.urlMobile +'/api/Account/reloadTokenClaims',
                //     headers:
                //     {
                //         'cache-control': 'no-cache',
                //         'content-type': 'application/json-patch+json',
                //         authorization: text
                //     },
                // }

                let urlStr = C.urls.baseUrl.urlMobile +'/api/Account/reloadTokenClaims';
                    let headers = {
                        'cache-control': 'no-cache',
                        'content-type': 'application/json',
                        authorization: text
                    };
                    this.gf.RequestApi('GET', urlStr, headers, {}, 'userreward', 'refreshToken').then((data)=>{
                        var au = data;
                        se.zone.run(()=>{
                            se.storage.remove('auth_token');
                            se.storage.set('auth_token', au.auth_token);
                            se.loadUserInfo();
                        })
                    
                    })
            }
        })
    }
}