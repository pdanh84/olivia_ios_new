import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, } from '@ionic/angular';
import { GlobalFunction } from '../providers/globalfunction';
import { Storage } from '@ionic/storage';
import { ValueGlobal } from '../providers/book-service';
import {flightService} from './../providers/flightService';


@Component({
  selector: 'app-flighttopdealdetail',
  templateUrl: './flighttopdealdetail.page.html',
  styleUrls: ['./flighttopdealdetail.page.scss'],
})
export class FlighttopdealdetailPage implements OnInit {
    item: any;

    constructor(private navCtrl: NavController, public gf: GlobalFunction,
        private zone: NgZone,
        public storage: Storage,
        public valueGlobal: ValueGlobal,
        public _flightService: flightService) { 
            if(this._flightService.itemFlightTopDeal){
                this.item = this._flightService.itemFlightTopDeal;
                this.item.content = this.item.content.replace('target="_blank"','');
                this.item.content = this.item.content.replace('target="_blank"','');
            }
        }

        ngOnInit(){

        }

        goback(){
            //this._flightService.itemHomeFlightScrollTop.emit(1);
            this.navCtrl.back();
        }

        book(){
            this._flightService.itemHomeFlightScrollTop.emit(1);
            this.navCtrl.back();
        }
}