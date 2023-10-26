import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { GlobalFunction } from '../providers/globalfunction';
import { Storage } from '@ionic/storage';
import { ValueGlobal, SearchHotel } from '../providers/book-service';
import {flightService} from '../providers/flightService';
import { tourService } from '../providers/tourService';


@Component({
  selector: 'app-flightusefuldetail',
  templateUrl: './flightusefuldetail.page.html',
  styleUrls: ['./flightusefuldetail.page.scss'],
})

export class FlightUsefulDetailPage implements OnInit {
  currentVersion: string;
  
    constructor(private navCtrl: NavController, public gf: GlobalFunction,
        public storage: Storage,
        public valueGlobal: ValueGlobal,
        public searchhotel: SearchHotel,
        public _flightService: flightService,
        public tourService: tourService) { 
         
              
        }

        ionViewWillEnter(){
          this._flightService.typeFlightUsefulShow = 2;
        }

        ngOnInit(){
            var se = this;
        }

        close(){
          this._flightService.typeFlightUsefulShow = 1;
            this.navCtrl.back();
        }

        
}