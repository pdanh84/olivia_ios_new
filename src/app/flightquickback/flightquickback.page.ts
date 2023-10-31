import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, ModalController, ToastController, ActionSheetController } from '@ionic/angular';
import { GlobalFunction } from '../providers/globalfunction';
import { Storage } from '@ionic/storage';
import { ValueGlobal, SearchHotel } from '../providers/book-service';
import {flightService} from './../providers/flightService';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-flightquickback',
  templateUrl: './flightquickback.page.html',
  styleUrls: ['./flightquickback.page.scss'],
})

export class FlightquickbackPage implements OnInit {
  currentVersion: string;
  
    constructor(private navCtrl: NavController, public gf: GlobalFunction,
        private modalCtrl: ModalController,
        private toastCtrl: ToastController,
        private zone: NgZone,
        public storage: Storage,
        private actionsheetCtrl: ActionSheetController,
        public valueGlobal: ValueGlobal,
        public searchhotel: SearchHotel,
        public _flightService: flightService) { 
          App.getInfo().then((info) => {
            this.zone.run(()=>{
              this.currentVersion = info.version;
            })
           
          })
              
        }

        ngOnInit(){
            var se = this;
        }

        close(){
            this.modalCtrl.dismiss();
        }

        goToHomePage(pageIndex){
          var se = this;
            if(pageIndex ==1){
                se.valueGlobal.backValue = "";
                se.searchhotel.itemTabHotel.emit(1);
                setTimeout(()=>{
                  se.navCtrl.navigateBack('/app/tabs/tab1');
                },350)
            }
            else if(pageIndex ==2){
              se.valueGlobal.backValue = "homeflight";
             
              se._flightService.itemTabFlightActive.emit(1);
              setTimeout(()=>{
                se.navCtrl.navigateBack('/app/tabs/tab1');
              },350)
            }
            else if(pageIndex ==3){
              se.valueGlobal.backValue = "homefood";
              
            }
            se.clearFlightService();
            se.modalCtrl.dismiss();
        }

        clearFlightService(){
          this._flightService.itemFlightCache.jsonSeats = null;
          this._flightService.itemFlightCache.listdepartseatselected = "";
          this._flightService.itemFlightCache.listreturnseatselected = "";
          this._flightService.itemFlightCache.departLuggage = [];
          this._flightService.itemFlightCache.returnLuggage = [];
          this._flightService.itemFlightCache.hasChoiceLuggage = false;
          this._flightService.itemFlightCache.listSeatNormal = [];
          this._flightService.itemFlightCache.listReturnSeatNormal = [];
          this._flightService.itemFlightCache.departConditionInfo = null;
          this._flightService.itemFlightCache.returnConditionInfo = null;
          this._flightService.itemFlightCache.departSeatChoiceAmout = 0;
          this._flightService.itemFlightCache.returnSeatChoiceAmout = 0;
          this._flightService.itemFlightCache.isnewmodelseat = false;
          this._flightService.itemFlightCache.isnewmodelreturnseat = false;
          this._flightService.itemFlightCache.departFlight = null;
          this._flightService.itemFlightCache.returnFlight = null;
          this._flightService.itemFlightCache.itemFlight = null;
        }
}