import { Component, OnInit, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalFunction } from '../../providers/globalfunction';
import {flightService} from './../../providers/flightService';

@Component({
  selector: 'app-flightinternationalfilterclass',
  templateUrl: './flightinternationalfilterclass.page.html',
  styleUrls: ['./flightinternationalfilterclass.page.scss'],
})

export class FlightInternationalFilterClassPage implements OnInit {
  classSelected='-1';
    constructor( public gf: GlobalFunction,
        private modalCtrl: ModalController,
        public _flightService: flightService) { 
        this.classSelected = this.getTicketClassValueByType(this._flightService.classSelected);
        }

        ngOnInit(){
            var se = this;
        }

        close(){
            this.modalCtrl.dismiss();
        }

        checkItemClass(value){
          if(!this._flightService.objectFilterInternational){
            this._flightService.objectFilterInternational = {};
          }
       
          this._flightService.classSelected = this.getTicketClassByType(value);
          this._flightService.classSelectedName = this.getTicketClassNameByType(value);
          this.modalCtrl.dismiss();
        }
        getTicketClassValueByType(type){
          let res = '-1';
          switch(type){
            case 'Economy':
                res = '1';
              break;
                case 'PremiumEconomy':
                res = '2';
              break;
                case 'Business':
                res = '3';
              break;
              case 'First':
                res = '4';
                break;
              case 'PremiumFirst':
                res = '5';
                break;
              default:
                res = '-1';
              break;
          }
          return res;
        }

        getTicketClassByType(type){
          let res = '-1';
          switch(type){
            case 1:
                res = 'Economy';
              break;
                case 2:
                res = 'PremiumEconomy';
              break;
                case 3:
                res = 'Business';
              break;
              case 4:
                res = 'First';
                break;
              case 5:
                res = 'PremiumFirst';
                break;
              default:
                res = '-1'
              break;
          }
          return res;
        }

        getTicketClassNameByType(type){
          let res = '-1';
          switch(type){
            case 1:
                res = 'Phổ thông';
              break;
                case 2:
                res = 'Phổ thông đặc biệt';
              break;
                case 3:
                res = 'Thương gia';
              break;
              case 4:
                res = 'Hạng nhất';
                break;
              case 5:
                res = 'Hạng nhất đặc biệt';
                break;
              default:
                res = 'Nhiều hạng'
              break;
          }
          return res;
        }
}