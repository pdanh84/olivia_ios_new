import { Component,OnInit, NgZone } from '@angular/core';
import { NavController,Platform, ModalController, ActionSheetController, PickerController, AlertController } from '@ionic/angular';
import { SearchHotel } from '../providers/book-service';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import { ValueGlobal } from '../providers/book-service';
import * as $ from 'jquery';
import { flightService } from '../providers/flightService';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the OccupancyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-flightcondition',
  templateUrl: 'flightcondition.page.html',
  styleUrls: ['flightcondition.page.scss'],
})
export class FlightconditionPage implements OnInit {
    departCondition: any;
    returnCondition: any;
    departtitle: any;
    returntitle: string;
  departTicketCondition: any;
  returnTicketCondition: any;

  constructor(public platform: Platform,public navCtrl: NavController, public modalCtrl: ModalController,public valueGlobal:ValueGlobal,
    public searchhotel: SearchHotel, public gf: GlobalFunction,
    public actionsheetCtrl: ActionSheetController,
    public pickerController: PickerController,
    private zone: NgZone,
    public _flightService: flightService,
    public formBuilder: FormBuilder,
    private storage: Storage,
    private alertCtrl: AlertController) {
        if(this._flightService.itemFlightCache.departConditions && this._flightService.itemFlightCache.departConditions.length >1){
            this.departCondition = this._flightService.itemFlightCache.departConditions[1].content;
            this.departtitle = "Chiều đi " + this._flightService.itemFlightCache.departCode + " - " + this._flightService.itemFlightCache.returnCode;
        }
        else if(this._flightService.itemFlightCache.departConditions && this._flightService.itemFlightCache.departConditions.length >0){
          this.departCondition = this._flightService.itemFlightCache.departConditions[0].content;
          this.departtitle = "Chiều đi " + this._flightService.itemFlightCache.departCode + " - " + this._flightService.itemFlightCache.returnCode;
        }

        if(this._flightService.itemFlightCache.returnConditions && this._flightService.itemFlightCache.returnConditions.length >1){
            this.returnCondition = this._flightService.itemFlightCache.returnConditions[1].content;
            this.returntitle = "Chiều về " + this._flightService.itemFlightCache.returnCode + " - " + this._flightService.itemFlightCache.departCode;
        }
        else if(this._flightService.itemFlightCache.returnConditions && this._flightService.itemFlightCache.returnConditions.length >0){
          this.returnCondition = this._flightService.itemFlightCache.returnConditions[0].content;
          this.returntitle = "Chiều về " + this._flightService.itemFlightCache.returnCode + " - " + this._flightService.itemFlightCache.departCode;
      }

      if(this._flightService.itemFlightCache.departFlight && this._flightService.itemFlightCache.departFlight.ticketCondition){
         this.departTicketCondition = this._flightService.itemFlightCache.departFlight.ticketCondition;
         this.departtitle = "Chiều đi " + this._flightService.itemFlightCache.departCode + " - " + this._flightService.itemFlightCache.returnCode;
      }

      if(this._flightService.itemFlightCache.returnFlight && this._flightService.itemFlightCache.returnFlight.ticketCondition){
        this.returnTicketCondition = this._flightService.itemFlightCache.returnFlight.ticketCondition;
        this.returntitle = "Chiều về " + this._flightService.itemFlightCache.returnCode + " - " + this._flightService.itemFlightCache.departCode;
     }
    }

    ngOnInit(){

    }

    goback(){
      this.navCtrl.navigateBack('/flightaddservice');
    }

    confirm(){
      var se = this;
      if(se._flightService.itemFlightCache.backtochoiceseat){
        se.showAlertChoiceSeat();
      }else{
        se.navCtrl.navigateForward('/flightadddetails');
      }
    }

    async showAlertChoiceSeat(){
      var se = this;
      let msg ='Vui lòng chọn lại ghế ngồi!';
      let alert = await se.alertCtrl.create({
        message: msg,
        cssClass: "cls-alert-choiceseat",
        backdropDismiss: false,
        buttons: [
        {
          text: 'OK',
          role: 'OK',
          handler: () => {
            se._flightService.itemFlightCache.backtochoiceseat = true;
            se._flightService.itemFlightReChoiceSeat.emit(1);
            se.navCtrl.navigateBack('flightaddservice');
          }
        }
      ]
    });
    alert.present();
    }
}