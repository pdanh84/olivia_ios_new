import { OverlayEventDetail } from '@ionic/core';
import { Component, NgZone, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalFunction } from '../providers/globalfunction';
import { LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';

@Component({
    selector: 'app-usercondition',
    templateUrl: 'usercondition.page.html',
    styleUrls: ['usercondition.page.scss'],
})

export class UserConditionPage implements OnInit {
    link: any;
    loader: any;
    userData: { accessToken: string; id: any; email: any; UserName: any; picture: any; username: any; phone: any; gender: any; };
    
    subtitle: string;
    constructor(
        public gf: GlobalFunction,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        private navCtrl: NavController
        ){
       this.subtitle = "Cập nhật vào 19 Thg 1, 2022"; 
    };
    ngOnInit() {
        
    } 

    goback(){
        this.navCtrl.back();
    }
}