import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, ModalController, ToastController, ActionSheetController } from '@ionic/angular';
import { GlobalFunction } from '../providers/globalfunction';
import * as $ from 'jquery';
import { Storage } from '@ionic/storage';
import { ValueGlobal, SearchHotel } from '../providers/book-service';
import {flightService} from './../providers/flightService';


@Component({
  selector: 'app-flightsearcharea',
  templateUrl: './flightsearcharea.page.html',
  styleUrls: ['./flightsearcharea.page.scss'],
})
export class FlightSearchAreaPage implements OnInit {
  //@ViewChild('ipSearchAiport') ipSearchAiport ;
  loadpricedone = false;
  items: any = [];
  itemsfull: any = [];
  itemsHasSameCity: any=[];
  isdepart:any;
  listLastSearch = [];
  itemsRegular = [];
  itemsRegularInternational = [];

  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private zone: NgZone,
    public storage: Storage,
    private actionsheetCtrl: ActionSheetController,
    public valueGlobal: ValueGlobal,
    public searchhotel: SearchHotel,
    public _flightService: flightService) { 
       this.isdepart = this._flightService.searchDepartCode;
        if(!this._flightService.listAllPlaceByArea){
          this.gf.getAllPlaceByArea().then((data) => {
              this.zone.run(() => data.sort(function (a, b) {
                return a.order - b.order;
              })
            )
            this._flightService.listAllPlaceByArea = data;
          });
        }else{

          this.zone.run(()=>{
          this.items = [...this._flightService.listAllPlaceByArea];
          
        })
        }

    }

    ngOnInit(){

    }


    goback(){
      if(this.valueGlobal.backValue == "flightchangeinfo"){
        this.modalCtrl.dismiss();
      }else{
        $('.flightsearchairport-header').css('background', 'transparent');
        this.navCtrl.back();
      }
        
    }

    async itemclick(item){
      var se = this;
        se._flightService.searchDepartCode = false;
        se._flightService.itemFlightCache.returnCode = item.code;
        se._flightService.itemFlightCache.returnCity = item.city;
        se._flightService.itemFlightCache.returnAirport = item.airport;
        se._flightService.itemFlightCache.itemReturnLocation = item;
      se.gf.createListLastSearchFlight(item);
      se._flightService.itemFlightChangeLocation.emit(item);
      se.navCtrl.back();
    }
}