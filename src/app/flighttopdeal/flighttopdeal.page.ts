import { Component, NgZone } from '@angular/core';
import { NavController, ModalController, ToastController, ActionSheetController } from '@ionic/angular';
import { GlobalFunction } from '../providers/globalfunction';
import { C } from './../providers/constants';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { ValueGlobal } from '../providers/book-service';
import {flightService} from './../providers/flightService';


@Component({
  selector: 'app-flighttopdeal',
  templateUrl: './flighttopdeal.page.html',
  styleUrls: ['./flighttopdeal.page.scss'],
})
export class FlighttopdealPage {
    listflighttopdeal: any= [];

    constructor(private navCtrl: NavController, public gf: GlobalFunction,
        private modalCtrl: ModalController,
        private toastCtrl: ToastController,
        private zone: NgZone,
        public storage: Storage,
        private actionsheetCtrl: ActionSheetController,
        public valueGlobal: ValueGlobal,
        public _flightService: flightService) { 
            this.loadDataFlightTopdeal();
        }
    
        ngOnInit(){
            
        }

        loadDataFlightTopdeal(){
            let url = C.urls.baseUrl.urlFlight + "gate/apiv1/GetSlideHome";
            this.gf.RequestApi("GET", url, {
                "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                'Content-Type': 'application/json; charset=utf-8'
                }, {}, "homeflight", "GetSlideHome").then((data) =>{
                  if(data){
                      data.forEach(element => {
                          if(element.version == 2 && element.content){
                              element.validToText = moment(element.validTo).format("DD/MM/YYYY");
                                this.listflighttopdeal.push(element);
                          }
                        
                      });
                      
                  }
                })
        }

        itemclickht(item){
            this._flightService.itemFlightTopDeal = item;
            this.navCtrl.navigateForward('/flighttopdealdetail');
        }

}