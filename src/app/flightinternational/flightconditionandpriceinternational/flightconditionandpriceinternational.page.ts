import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { GlobalFunction } from '../../providers/globalfunction';
import { flightService } from '../../providers/flightService';
@Component({
  selector: 'app-flightconditionandpriceinternational',
  templateUrl: './flightconditionandpriceinternational.page.html',
  styleUrls: ['./flightconditionandpriceinternational.page.scss'],
})
export class FlightConditionAndPriceInternationalPage implements OnInit {
  itemFlight: any;
  departCondition: any;
  returnCondition: any;
  changeDepartTime: any;
  ticketDepartRefund: any;
  changeReturnTime: any;
  ticketReturnRefund: any;
  
  constructor(public modalCtrl: ModalController, public zone: NgZone, public navCtrl: NavController,
    public gf: GlobalFunction,public _flightService: flightService,
    ) {
      if(this._flightService.itemFlightCache.dataSummaryBooking){
        this.departCondition = this._flightService.itemFlightCache.dataSummaryBooking.departCondition;
        this.returnCondition = this._flightService.itemFlightCache.dataSummaryBooking.returnCondition;
      }
      
      if(this._flightService.itemFlightCache.itemFlightInternationalDepart && this._flightService.itemFlightCache.itemFlightInternationalDepart.penaltyFlighs && this._flightService.itemFlightCache.itemFlightInternationalDepart.penaltyFlighs.length >0 ){
        let itemmap = this._flightService.itemFlightCache.itemFlightInternationalDepart.penaltyFlighs.filter((i) => i.penaltyType == 1 && i.feePenalty >0 && i.descriptionPenalty);
        let itemmapcancel = this._flightService.itemFlightCache.itemFlightInternationalDepart.penaltyFlighs.filter((i) => i.penaltyType == 2 && i.feePenalty >0 && i.descriptionPenalty);
        if(itemmap && itemmap.length >0){
          this.changeDepartTime = itemmap[0].descriptionPenalty;
        }
        if(itemmapcancel && itemmapcancel.length >0){
          this.ticketDepartRefund = itemmapcancel[0].descriptionPenalty;
        }
       }

       if(this._flightService.itemFlightCache.itemFlightInternationalReturn && this._flightService.itemFlightCache.itemFlightInternationalReturn.penaltyFlighs && this._flightService.itemFlightCache.itemFlightInternationalReturn.penaltyFlighs.length >0 ){
        let itemmap = this._flightService.itemFlightCache.itemFlightInternationalReturn.penaltyFlighs.filter((i) => i.penaltyType == 1 && i.feePenalty >0 && i.descriptionPenalty);
        let itemmapcancel = this._flightService.itemFlightCache.itemFlightInternationalReturn.penaltyFlighs.filter((i) => i.penaltyType == 2 && i.feePenalty >0 && i.descriptionPenalty);
        if(itemmap && itemmap.length >0){
          this.changeReturnTime = itemmap[0].descriptionPenalty;
        }
        if(itemmapcancel && itemmapcancel.length >0){
          this.ticketReturnRefund = itemmapcancel[0].descriptionPenalty;
        }
       }
  }

  ngOnInit() {
  }

  close(){
      this.modalCtrl.dismiss();
  }

}