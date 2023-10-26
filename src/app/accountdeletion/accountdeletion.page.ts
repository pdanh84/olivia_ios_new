
import { AlertController,NavController } from '@ionic/angular';
import { Component, OnInit,NgZone } from '@angular/core';
import { C } from '../providers/constants';
import {Storage} from '@ionic/storage';
import { GlobalFunction } from '../providers/globalfunction';
@Component({
  selector: 'app-accountdeletion',
  templateUrl: './accountdeletion.page.html',
  styleUrls: ['./accountdeletion.page.scss'],
})
export class AccountDeletionPage implements OnInit {
  ischeckDK1: any;ischeckDK2: any;ischeckDK3: any;ischeckDK4: any;ischeckDK5: any;
  constructor(private alertCtrl: AlertController,public navCtrl: NavController,public storage: Storage, public zone : NgZone,public gf: GlobalFunction) { }
  ngOnInit() {
  }
  goback() {
    this.navCtrl.back();
  }
  checkDk1(){
    this.zone.run(() => {
      this.ischeckDK1=!this.ischeckDK1;
    
    })
   
  }
  checkDk2(){
    this.zone.run(() => {
      this.ischeckDK2=!this.ischeckDK2;
   
    })
 
  }
  checkDk3(){
    this.zone.run(() => {
      this.ischeckDK3=!this.ischeckDK3;
    
    })
 
  }
  checkDk4(){
    this.zone.run(() => {
      this.ischeckDK4=!this.ischeckDK4;
     
    })
  
  }
  checkDk5(){
    this.zone.run(() => {
      this.ischeckDK5=!this.ischeckDK5;
    })

  }
  next(){
    this.showAlertConfirm();
  }
  async showAlertConfirm(){
    var se = this;
    let alert = await this.alertCtrl.create({
      header: 'Bạn có thật sự muốn thế?',
      message: 'Bạn sẽ mất toàn bộ iVIVU points và quyền lợi. Bạn thực sự muốn xóa tài khoản chứ?',
      cssClass: "cls-alert-message",
      backdropDismiss: false,
      buttons: [
      {
        text: 'Có',
        role: 'OK',
        handler: () => {
   
          se.storage.get('jti').then((memberid) => {
            if(memberid){
              var options1 ;
              se.storage.get('auth_token').then(auth_token => {
                if (auth_token) {
                  var text = "Bearer " + auth_token;
                  let headers=
                  {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    authorization: text
                  }
                  let strUrl =  C.urls.baseUrl.urlMobile +'/api/Dashboard/DeleteMemberUser?userId='+ memberid;
                  se.gf.RequestApi('GET', strUrl, headers, {}, 'DeleteMemberUser', 'DeleteMemberUser').then((data) => {
                    if (data) {
                      se.navCtrl.navigateForward('accountdeletiondone');
                    }
                
                  })
                }
              })
           
             
            }
          })
        }
      },
      {
        text: 'Không',
        role: 'Cancel',
        handler: () => {
          alert.dismiss();
        }
      }
    ]
  });
  alert.present();
  }
}
