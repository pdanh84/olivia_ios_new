import { Component,NgZone ,OnInit} from '@angular/core';
import { Platform, NavController, AlertController,  ToastController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { C } from './../../providers/constants';
import { ValueGlobal } from '../../providers/book-service';
import { GlobalFunction } from './../../providers/globalfunction';
import { voucherService } from './../../providers/voucherService';

@Component({
  selector: 'app-voucherdetail',
  templateUrl: 'voucherdetail.page.html',
  styleUrls: ['voucherdetail.page.scss'],
})

export class VoucherDetailPage implements OnInit{
    userRewardData:any;
    userInfoData:any;
    CityName: string;
    CountryCode: string;
    public isShowConfirm = false;
    public intervalID;
   
    constructor(public platform: Platform,public navCtrl: NavController,public toastCtrl: ToastController,
        public zone: NgZone,public storage: Storage,public alertCtrl: AlertController,public modalCtrl: ModalController,public valueGlobal: ValueGlobal,
        public gf: GlobalFunction,
        public _voucherService: voucherService
        ){
       if(_voucherService.itemVoucher.description){
        _voucherService.itemVoucher.description = _voucherService.itemVoucher.description.replace(/\r\n/g, "<br/>");
       }
    }

    ngOnInit(){

    }

    close(){
        this.modalCtrl.dismiss();
    }

}