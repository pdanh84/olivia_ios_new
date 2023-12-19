import { Component,NgZone ,OnInit} from '@angular/core';
import { Platform, NavController, AlertController,  ToastController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { C } from './../../providers/constants';
import { ValueGlobal } from '../../providers/book-service';
import { GlobalFunction } from './../../providers/globalfunction';
import { VoucherDetailPage } from '../voucherdetail/voucherdetail.page';
import { voucherService } from 'src/app/providers/voucherService';
import * as moment from 'moment';

@Component({
  selector: 'app-myvoucher',
  templateUrl: 'myvoucher.page.html',
  styleUrls: ['myvoucher.page.scss'],
})

export class MyVoucherPage implements OnInit{
    userRewardData:any;
    userInfoData:any;
    CityName: string;
    CountryCode: string;
    public isShowConfirm = false;
    public intervalID;
    vouchers:any = [];
    loadsdk = [1,2,3,4,5];
  vouchersClaimed: any=[];
  loadvoucherdone = false;
    constructor(public platform: Platform,public navCtrl: NavController,public toastCtrl: ToastController,
        public zone: NgZone,public storage: Storage,public alertCtrl: AlertController,public modalCtrl: ModalController,public valueGlobal: ValueGlobal,
        public gf: GlobalFunction,
        public _voucherService: voucherService){
          storage.get('auth_token').then(auth_token => {
            if (auth_token) {
              //this.loadVoucher(auth_token);
              this.loadVoucherClaimed(auth_token);
            }else{
              this.loadUserInfo();
            }
          })
    }

    ngOnInit(){

    }

    loadVoucher(auth_token){
      let url = `${C.urls.baseUrl.urlMobile}/api/dashboard/GetRewardItems`;
      let text = "Bearer " + auth_token;
      let  headers =
      {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
      }
      this.gf.RequestApi('GET', url, headers, {}, 'myvoucher', 'loadVoucher').then((data)=> {
        console.log(data);
        this.vouchers = data;
        data.forEach(element => {
          element.validdateDisplay = moment(element.to).format('DD-MM-YYYY');
        });
        //this.vouchersClaimed = data;
        this.loadvoucherdone = true;
      })
    }

    loadVoucherClaimed(auth_token){
      let url = `${C.urls.baseUrl.urlMobile}/api/dashboard/GetVoucherClaimed`;
      let text = "Bearer " + auth_token;
      let  headers =
      {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
      }
      this.gf.RequestApi('GET', url, headers, {}, 'myvoucher', 'loadVoucher').then((data)=> {
        if(data && data.statusCode == 401){
              this.gf.refreshTokenNew(auth_token).then((token) => {
                setTimeout(() => {
                  if(token && token.auth_token){
                    this.storage.remove('auth_token').then(()=>{
                      this.storage.set('auth_token', token.auth_token);
                      this.loadVoucherClaimed(token.auth_token);
                    })
                  }
                }, 100)
              });
          this.loadvoucherdone = true;
        }else{
          if(data && data.length >0){
            data.forEach(element => {
              element.validdateDisplay = moment(element.to).format('DD-MM-YYYY');
              if(element.isActive){
                this.vouchers.push(element);
              }else{
                this.vouchersClaimed.push(element);
              }
            });
          }else{
            this.vouchers = [];
            this.vouchersClaimed = [];
          }
          this.loadvoucherdone = true;
        }
       
      })
    }

    goback(){
        this.navCtrl.back();
    }

    loadUserInfo(){
        var se = this;
        se.storage.get('auth_token').then(auth_token => {
            if (auth_token) {
              this.gf.getUserInfo(auth_token).then((data) => {
                    if(data && data.statusCode != 401){
                        se.zone.run(()=>{
                            se.userInfoData = data;
                        });
                        se.loadVoucherClaimed(auth_token);
                    }
                });
            }
        })
    }

    async showVoucherDetail(voucher){
            var se = this;
            se.zone.run(()=>{
              se._voucherService.itemVoucher = voucher;
            })
            
              const modal: HTMLIonModalElement =
              await se.modalCtrl.create({
                component: VoucherDetailPage,
                showBackdrop: true,
                backdropDismiss: true,
                
                cssClass: "modal-voucher-detail"
              });
            modal.present();
    }

}