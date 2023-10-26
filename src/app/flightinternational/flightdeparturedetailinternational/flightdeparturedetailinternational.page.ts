import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { C } from './../../providers/constants';
import { GlobalFunction } from '../../providers/globalfunction';
import { flightService } from '../../providers/flightService';
import * as moment from 'moment';
@Component({
  selector: 'app-flightdeparturedetailinternational',
  templateUrl: './flightdeparturedetailinternational.page.html',
  styleUrls: ['./flightdeparturedetailinternational.page.scss'],
})
export class FlightDepartureDetailInternationalPage implements OnInit {
  itemFlight: any;
  
  constructor(public modalCtrl: ModalController, public zone: NgZone, public navCtrl: NavController,
    public gf: GlobalFunction,public _flightService: flightService,
    ) {
     this.itemFlight = this._flightService.itemFlightInternationalDepartureDetail;
     this.itemFlight.details.forEach(elementDepart => {
      if(elementDepart.fromPlace){
        let freplace = '('+elementDepart.from+')';
        elementDepart.shortFromPlaceName = elementDepart.fromPlace.replace(freplace,'');
      }
      if(elementDepart.toPlace){
        let treplace = '('+elementDepart.to+')';
        elementDepart.shortToPlaceName = elementDepart.toPlace.replace(treplace,'');
      }
      
      if(elementDepart.departTime){
        elementDepart.timeDepartShort = moment(elementDepart.departTime).format('HH:mm');
        elementDepart.departTimeDisplay = `${this.gf.getDayOfWeek(elementDepart.departTime).daynameshort}, ${moment(elementDepart.departTime).format('DD/MM')}`;

        let hours:any = Math.floor(elementDepart.flightDuration/60);
        let minutes:any = elementDepart.flightDuration*1 - (hours*60);

        if(elementDepart.layover){
          let hourslayover:any = Math.floor(elementDepart.layover/60);
          let minuteslayover:any = elementDepart.layover*1 - (hourslayover*60);
          if(hourslayover < 10){
            hourslayover = hourslayover != 0?  "0"+hourslayover : "0";
          }
          if(minuteslayover < 10){
            minuteslayover = "0"+minuteslayover;
          }
          elementDepart.flightLayoverDisplay = hourslayover+"h"+minuteslayover+"m";

          if(elementDepart.landingTime) {
            let hourslanding:any = moment(elementDepart.landingTime).format('HH');
            elementDepart.layoverNight = (hourslanding*1 + hourslayover*1) >= 24;
          }
        }
        if(hours < 10){
          hours = hours != 0?  "0"+hours : "0";
        }
        if(minutes < 10){
          minutes = "0"+minutes;
        }
        elementDepart.flightTimeDisplay = hours+"h"+minutes+"m";
      }

      if(elementDepart.landingTime){
        elementDepart.timeLandingShort = moment(elementDepart.landingTime).format('HH:mm');
        elementDepart.landingTimeDisplay = `${this.gf.getDayOfWeek(elementDepart.landingTime).daynameshort}, ${moment(elementDepart.landingTime).format('DD/MM')}`;

        
      }
      
    });
  }

  ngOnInit() {
  }

  close(){
      this.modalCtrl.dismiss();
  }

  confirm(){
      
    
  }
}