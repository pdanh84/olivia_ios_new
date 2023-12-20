import { Component, NgZone,OnInit } from '@angular/core';
import { NavController, AlertController, Platform, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { ValueGlobal } from '../providers/book-service';
import * as moment from 'moment';

@Component({
  selector: 'app-cuspoints',
  templateUrl: 'cuspoints.html',
  styleUrls: ['cuspoints.scss'],
})
export class CuspointsPage implements OnInit{
  point;actionHistory;  isShowConfirm = false;
  loader: any;
  expPointNowYear: any;
  currentYear: string;
  expPointNextYear: any;
  currentNextYear: string;
  constructor(public platform: Platform,public navCtrl: NavController, public storage: Storage,
    public alertCtrl: AlertController,public zone: NgZone,public gf: GlobalFunction,public valueGlobal: ValueGlobal,
    private loadingCtrl: LoadingController) {
      this.presentLoading();
      this.GetUserInfo();
    gf.googleAnalytion('cuspoints','load','');
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      message: "",
      duration: 3000
    });
    this.loader.present();
  }
  ngOnInit(){

  }
  goback(){
    this.navCtrl.back();
  }

  getPoint() {
    var se=this;
    this.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        var options = {
          method: 'GET',
          url: C.urls.baseUrl.urlMobile + '/api/Dashboard/GetActionHistory',
          timeout: 10000, maxAttempts: 5, retryDelay: 2000,
          headers:
          {
            'content-type': 'application/json',
            authorization: text
          }
        };
        
        se.gf.RequestApi('GET', options.url, options.headers, '', 'cuspoints', 'getPoint').then((data) => {
         
          //let item = data.actionHistory;
            se.zone.run(()=>{
              se.actionHistory=data.actionHistory;
              se.actionHistory.forEach(element => {
                if (element.actionName=="Đặt phòng khách sạn") {
                  element.contentNote="";
                  var note=element.note.split('|');
                  element.date= note[note.length-1];
                  for (let i = 0; i < note.length -1 ; i++) {
                    if (i==note.length -2) {
                      element.contentNote=element.contentNote+note[i]
                    }else{
                      element.contentNote=element.contentNote+note[i] + '|'
                    }
                  }
                }else{
                  element.contentNote="";
                  var note=element.note.split('|');
                  element.date= note[0];
                  for (let i = 1; i < note.length ; i++) {
                    if (i==note.length - 1) {
                      element.contentNote=element.contentNote+note[i]
                    }else{
                      element.contentNote=element.contentNote+note[i] + '|'
                    }
                  }
                }
              });
              if(se.loader){
                se.loader.dismiss();
              }
            })
        }
        )
      }
    });
  }
  public async showConfirm(msg){
    let alert = await this.alertCtrl.create({
      message: msg,
      buttons: [
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
          this.storage.remove('blogtripdefault');
          this.point = 0;
          this.valueGlobal.countNotifi = 0;
          this.navCtrl.navigateRoot('/')
        }
      },
      {
        text: 'Đăng nhập',
        role: 'OK',
        handler: () => {
          this.storage.remove('auth_token');
          this.storage.remove('email');
          this.storage.remove('username');
          this.storage.remove('jti');
          this.storage.remove('userInfoData');
          this.storage.remove('userRewardData');
          this.storage.remove('point');
          this.storage.remove('blogtripdefault');
          this.point = 0;
          this.valueGlobal.countNotifi = 0;
          this.navCtrl.navigateForward('/login');
        }
      }
    ]
  });
  alert.present();

  alert.onDidDismiss().then((data)=>{
    this.storage.remove('auth_token');
    this.storage.remove('email');
    this.storage.remove('username');
    this.storage.remove('jti');
    this.storage.remove('userInfoData');
    this.storage.remove('userRewardData');
    this.storage.remove('point');
    this.valueGlobal.countNotifi = 0;
    this.navCtrl.navigateBack('/');
    })
}

  GetUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.gf.getUserInfo(auth_token).then((data) => {
              if (data) {
                          //var data = JSON.parse(body);
                          se.expPointNowYear=data.expPointNowYear;
                          if (se.expPointNowYear > 0) {
                            let year = new Date(new Date().setFullYear(new Date().getFullYear()))
                            se.currentYear =  "31"+"-"+"12"+"-"+moment(year).format('YYYY');
                          }
                          se.expPointNextYear=data.expPointNextYear;
                          if (se.expPointNextYear > 0) {
              
                            let year  = new Date(new Date().setFullYear(new Date().getFullYear()+ 1))
                            se.currentNextYear =  "31"+"-"+"12"+"-"+moment(year).format('YYYY');
                          }
                          se.getPoint();
                      }
          });
        }
    })
  }

  loadUserInfoRefresh(token) {
    var se = this;
        if (token) {
            var text = "Bearer " + token;
            let urlStr = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo';
            let headers = { 
              'cache-control': 'no-cache',
              'content-type': 'application/json',
              authorization: text
            };
            this.gf.RequestApi('GET', urlStr, headers, {}, 'tab5', 'loadUserInfoRefresh').then((data)=>{
              if (data) {
                se.expPointNowYear=data.expPointNowYear;
                if (se.expPointNowYear > 0) {
                  var year = new Date(new Date().setFullYear(new Date().getFullYear()))
                  se.currentYear =  "31"+"-"+"12"+"-"+moment(year).format('YYYY');
                }
                se.expPointNextYear=data.expPointNextYear;
                if (se.expPointNextYear > 0) {
    
                  var year  = new Date(new Date().setFullYear(new Date().getFullYear()+ 1))
                  this.currentNextYear =  "31"+"-"+"12"+"-"+moment(year).format('YYYY');
                }
                se.getPoint();
            }
            });
        } 
}
}
