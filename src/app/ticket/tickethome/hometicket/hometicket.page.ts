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
topsale: any;
  
  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private zone: NgZone,
    public storage: Storage,
    private actionsheetCtrl: ActionSheetController,
    private platform: Platform,
    public networkProvider: NetworkProvider,
    public ticketService: ticketService) {
    this.loadTopSale();
  }
  loadTopSale(){
    let url = C.urls.baseUrl.urlTicket + '/api/Home/GetTotalBooking';
    let headers = {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    this.gf.RequestApi('GET', url, headers, null, 'hometicketslide', 'GetExperienceSameTopic').then((data) => {
      let res = data;
      this.topsale = res.data
 
    });
  }

  ngOnInit(){
   
  }

  ionViewDidEnter() {
    SplashScreen.hide();
  }
}
