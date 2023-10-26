import { Component,OnInit, NgZone } from '@angular/core';
import { NavController,Platform, ModalController, ActionSheetController, PickerController } from '@ionic/angular';
import { SearchHotel } from '../providers/book-service';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { ValueGlobal } from './../providers/book-service';
import * as $ from 'jquery';
import { flightService } from '../providers/flightService';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the OccupancyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-flightselecttimepriority',
  templateUrl: 'flightselecttimepriority.page.html',
  styleUrls: ['flightselecttimepriority.page.scss'],
})
export class FlightselecttimepriorityPage implements OnInit {
  countFilter: any;
    timedepart: any;
    timereturn: any;
    showDepartTime: boolean = true;
    showReturnTime: boolean = true;
  
  constructor(public platform: Platform,public navCtrl: NavController, public modalCtrl: ModalController,public valueGlobal:ValueGlobal,
    public searchhotel: SearchHotel, public gf: GlobalFunction,
    public actionsheetCtrl: ActionSheetController,
    public pickerController: PickerController,
    private zone: NgZone,
    public _flightService: flightService,
    private storage : Storage) {
   
   
    storage.get('timedepartpriorityconfig').then((data) => {
        if(data){
            this.timedepart = data;
        }else{
            this.timedepart = '09:00';
        }
    })

    storage.get('timereturnpriorityconfig').then((data) => {
        if(data){
            this.timereturn = data;
        }else{
            this.timereturn = '15:00';
        }
    })
   
  }

  ngOnInit() {
        this._flightService.itemAllFlightCount.subscribe((data) => {
            this.zone.run(()=>{
                this.countFilter = data;
            })
        })
  }
  close() {
    this.modalCtrl.dismiss();
    
  }

  timeChange(type, e){
      if(type ==1){
        this.storage.set('timedepartpriorityconfig', e.detail.value);
        this.timedepart = e.detail.value;
      }else{
        this.storage.set('timereturnpriorityconfig', e.detail.value);
        this.timereturn = e.detail.value;
      }
  }

  filter(){
      // obj.timeDepartPriority = data.data.timeDepartPriority;
      //obj.timeReturnPriority = data.data.timeReturnPriority;
      this.modalCtrl.dismiss({ timeDepartPriority: this.timedepart, timeReturnPriority: this.timereturn});
      this._flightService.itemTimePriorityChange.emit(1);
  }
  
}