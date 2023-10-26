import { Component, OnInit, ViewChild, HostListener, NgZone, Input } from '@angular/core';
import { NavController, ModalController, ToastController, ActionSheetController, Platform } from '@ionic/angular';
import { GlobalFunction } from '../../providers/globalfunction';
import * as $ from 'jquery';
import { C } from './../../providers/constants';
import { OverlayEventDetail } from '@ionic/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { NetworkProvider } from '../../network-provider.service';

import { tourService } from 'src/app/providers/tourService';

@Component({
  selector: 'app-hometour',
  templateUrl: './hometour.page.html',
  styleUrls: ['./hometour.page.scss'],
})
export class HomeTourPage implements OnInit {
  itemSearch: any;
  totalSale: any;
  
  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private zone: NgZone,
    public storage: Storage,
    private actionsheetCtrl: ActionSheetController,
    private platform: Platform,
    public networkProvider: NetworkProvider,
    public tourService: tourService) {
    this.loadTopSale();
    this.loadTotalSale();
  }
  loadTopSale() {
    let se = this;
    let url = C.urls.baseUrl.urlMobile+'/tour/api/TourApi/GetAllBooking24h';
    let headers = {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    se.gf.RequestApi('GET', url, headers, null, 'hometour', 'loadTopSale').then((res) => {
      //let res = data;
      console.log(res.Response);
      this.tourService.listTopSale = res.Response;
      //se.slideData = res.Response;
      //se.loaddatadone = true;
    })
  }
  loadTotalSale() {
    let url = C.urls.baseUrl.urlMobile+'/tour/api/TourApi/GetTotalBooking24H';
    let headers = {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    this.gf.RequestApi('GET', url, headers, null, 'hometour', 'loadTotalSale').then((data) => {
      this.totalSale = this.gf.convertNumberToString(data.Response);
    })
  }
  ngOnInit(){
   
  }
}
