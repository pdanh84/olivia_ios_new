import { Component, OnInit, ViewChild, HostListener, NgZone, Input } from '@angular/core';
import { NavController, ModalController, ToastController, ActionSheetController,  Platform } from '@ionic/angular';
import { GlobalFunction } from './../../../providers/globalfunction';
import * as $ from 'jquery';
import { C } from './../../../providers/constants';
import { OverlayEventDetail } from '@ionic/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { NetworkProvider } from './../../../network-provider.service';

import { ticketService } from 'src/app/providers/ticketService';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-hometicket',
  templateUrl: './hometicket.page.html',
  styleUrls: ['./hometicket.page.scss'],
})
export class HomeTicketPage implements OnInit {
  itemSearch: any;
  
  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private zone: NgZone,
    public storage: Storage,
    private actionsheetCtrl: ActionSheetController,
    private platform: Platform,
    public networkProvider: NetworkProvider,
    public ticketService: ticketService) {
    
  }


  ngOnInit(){
  
  }

  ionViewDidEnter() {
    SplashScreen.hide();
  }
}
