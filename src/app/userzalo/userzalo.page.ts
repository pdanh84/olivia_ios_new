import { OverlayEventDetail } from '@ionic/core';
import { Component, NgZone, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalFunction } from '../providers/globalfunction';
import { LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';

@Component({
    selector: 'app-userzalo',
    templateUrl: 'userzalo.page.html',
    styleUrls: ['userzalo.page.scss'],
})

export class UserZaloPage implements OnInit {
    link: any;
    loader: any;
    userData: { accessToken: string; id: any; email: any; UserName: any; picture: any; username: any; phone: any; gender: any; };

    subtitle: string;
    constructor(
        public gf: GlobalFunction,
        private navCtrl: NavController
        ){
    };
    ngOnInit() {
        
    } 

    goback(){
        this.navCtrl.back();
    }

   
}