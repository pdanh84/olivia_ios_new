import { moodService } from './../providers/moodService';
import { Component, OnInit, NgZone } from '@angular/core';
import { ModalController, ToastController,  } from '@ionic/angular';
import { GlobalFunction } from '../providers/globalfunction';
import { Storage } from '@ionic/storage';
import { ValueGlobal, SearchHotel } from '../providers/book-service';
var document:any;

@Component({
  selector: 'app-hotellistmoodfilter',
  templateUrl: './hotellistmoodfilter.page.html',
  styleUrls: ['./hotellistmoodfilter.page.scss'],
})
export class HotellistmoodfilterPage implements OnInit {
  loadpricedone = false;
  items: any[];
  itemsfull: any[];
  selectedRegion: any = [];
  countTopdealFilter = 0;
  listRegion:any = [];
  cleartopdealfilter: boolean = false;
  constructor(public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private zone: NgZone,
    public storage: Storage,
    public valueGlobal: ValueGlobal,
    public searchhotel: SearchHotel, public moodService: moodService) {
    this.zone.run(() => {
      
      if (this.moodService.listRegion && this.moodService.listRegion.length > 0) {
        this.listRegion = this.moodService.listRegion;
        for (let i = 0; i < this.listRegion.length; i++) {
          const el = this.listRegion[i];
          el.stt=false;
          for (let j = 0; j < this.searchhotel.selectedRegion.length; j++) {
            const elRegion = this.searchhotel.selectedRegion[j];
            if (el.regionId==elRegion) {
              el.stt=true;
              break;
            }
          }
        }
      }
    })
  }

  ngOnInit() {
  }
  close() {
    this.modalCtrl.dismiss({stt:0,region:this.selectedRegion});
  }
  itemRegionClick(item) {
    var objRegion:any = window.document.getElementById(item.regionId);
    let itemdisabled = objRegion.classList.contains('region-disabled');
    if (itemdisabled) {
      return;
    }
    item.stt=!item.stt;
  }

  clearFilter() {
   
    for (let i = 0; i < this.listRegion.length; i++) {
      const element = this.listRegion[i];
      element.stt=false;
    }
  }
  filter() {
    this.searchhotel.selectedRegion=[];
    for (let i = 0; i < this.listRegion.length; i++) {
      const element = this.listRegion[i];
      if (element.stt) {
        this.searchhotel.selectedRegion.push(element.regionId);
      }
      
    }
    this.modalCtrl.dismiss({stt:1});
  }
  renderCssByType(strIndex: string, checked: boolean) {
    var objRegion = window.document.getElementById(strIndex);
    if (objRegion) {
      objRegion.classList.remove('region-check');
      objRegion.classList.remove('region-uncheck');
      objRegion.classList.add(checked ? 'region-check' : 'region-uncheck');
    }
  }
}
