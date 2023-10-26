import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { C } from './../../providers/constants';
import { GlobalFunction } from '../../providers/globalfunction';
import { flightService } from '../../providers/flightService';
@Component({
  selector: 'app-flightinfointernational',
  templateUrl: './flightinfointernational.page.html',
  styleUrls: ['./flightinfointernational.page.scss'],
})
export class FlightInfoInternationalPage implements OnInit {
  itemFlight: any;
  //ticketInfo: any;
  loadticketinfodone = false;
  arrsdk = [1,2,3];
  itemFlightTicket: any;
  changeDepartTime: any;
  ticketRefund: any;
  hasFeeChangeDepartTime: boolean;
  hasFeeTicketRefund: boolean;

  constructor(public modalCtrl: ModalController, public zone: NgZone, public navCtrl: NavController,
    public gf: GlobalFunction,public _flightService: flightService,
    ) {
     this.itemFlightTicket = this._flightService.itemFlightInternationalInfo;
    if(this.itemFlightTicket.penaltyFlighs && this.itemFlightTicket.penaltyFlighs.length >0 ){
      let itemmap = this.itemFlightTicket.penaltyFlighs.filter((i) => i.penaltyType == 1 && i.descriptionPenalty);
      let itemmapcancel = this.itemFlightTicket.penaltyFlighs.filter((i) => i.penaltyType == 2 && i.descriptionPenalty);
      if(itemmap && itemmap.length >0){
        this.changeDepartTime = itemmap[0].descriptionPenalty ;
        if(itemmap[0].feePenalty){
          this.hasFeeChangeDepartTime = true;
        }
      }
      if(itemmapcancel && itemmapcancel.length >0){
        this.ticketRefund = itemmapcancel[0].descriptionPenalty;
        if(itemmapcancel[0].feePenalty){
          this.hasFeeTicketRefund = true;
        }
      }
     }
     
     this.loadTicketInfo();
  }

  loadTicketInfo() {
    let url = C.urls.baseUrl.urlFlightInt + "api/bookings/get-airline-details";
    let body = {
      "Aircraft" : this._flightService.itemFlightInternationalInfo?this._flightService.itemFlightInternationalInfo.aircraft : ( (!this._flightService.loadFlightInfoType || this._flightService.loadFlightInfoType == 1) ? this._flightService.itemFlightCache.itemFlightInternationalDepart : this._flightService.itemFlightCache.itemFlightInternationalReturn ) ,
      "AircraftStr" : this._flightService.itemFlightInternationalInfo?this._flightService.itemFlightInternationalInfo.aircraftStr :  ( (!this._flightService.loadFlightInfoType || this._flightService.loadFlightInfoType == 1) ? this._flightService.itemFlightCache.itemFlightInternationalDepart : this._flightService.itemFlightCache.itemFlightInternationalReturn ) ,
      "Airline" : this._flightService.itemFlightInternationalInfo?this._flightService.itemFlightInternationalInfo.airline : ( (!this._flightService.loadFlightInfoType || this._flightService.loadFlightInfoType == 1) ? this._flightService.itemFlightCache.itemFlightInternationalDepart : this._flightService.itemFlightCache.itemFlightInternationalReturn ) ,
      "FlightNumber" : this._flightService.itemFlightInternationalInfo?this._flightService.itemFlightInternationalInfo.flightNumber : ( (!this._flightService.loadFlightInfoType || this._flightService.loadFlightInfoType == 1) ? this._flightService.itemFlightCache.itemFlightInternationalDepart : this._flightService.itemFlightCache.itemFlightInternationalReturn ) ,
      "FromPlaceCode" : this._flightService.itemFlightInternationalInfo?this._flightService.itemFlightInternationalInfo.fromPlaceCode : ( (!this._flightService.loadFlightInfoType || this._flightService.loadFlightInfoType == 1) ? this._flightService.itemFlightCache.itemFlightInternationalDepart : this._flightService.itemFlightCache.itemFlightInternationalReturn ) ,
      "SessionId" : this._flightService.itemFlightInternationalInfo ? this._flightService.itemFlightInternationalInfo.sessionsId : this._flightService.itemFlightCache.SessionId, //this._flightService.itemFlightCache.SessionId,
      "TicketClass" : this._flightService.itemFlightInternationalInfo?this._flightService.itemFlightInternationalInfo.ticketClass : ( (!this._flightService.loadFlightInfoType || this._flightService.loadFlightInfoType == 1) ? this._flightService.itemFlightCache.itemFlightInternationalDepart : this._flightService.itemFlightCache.itemFlightInternationalReturn ) ,
      "TicketClassShort" : this._flightService.itemFlightInternationalInfo?this._flightService.itemFlightInternationalInfo.ticketClassShort : ( (!this._flightService.loadFlightInfoType || this._flightService.loadFlightInfoType == 1) ? this._flightService.itemFlightCache.itemFlightInternationalDepart : this._flightService.itemFlightCache.itemFlightInternationalReturn ) ,
      "TicketType" : this._flightService.itemFlightInternational.isInternal ? (this._flightService.itemFlightInternationalInfo.airlineCode == "VietJetAir" ? this._flightService.itemFlightInternationalInfo.ticketType : this._flightService.itemFlightInternationalInfo.ticketClass) : '' ,
      "ToPlaceCode" : this._flightService.itemFlightInternationalInfo?this._flightService.itemFlightInternationalInfo.toPlaceCode : ( (!this._flightService.loadFlightInfoType || this._flightService.loadFlightInfoType == 1) ? this._flightService.itemFlightCache.itemFlightInternationalDepart : this._flightService.itemFlightCache.itemFlightInternationalReturn ),
      "UrlLogo" : this._flightService.itemFlightInternationalInfo?this._flightService.itemFlightInternationalInfo.urlLogo : ( (!this._flightService.loadFlightInfoType || this._flightService.loadFlightInfoType == 1) ? this._flightService.itemFlightCache.itemFlightInternationalDepart : this._flightService.itemFlightCache.itemFlightInternationalReturn ) ,
      "departFlightId" : this._flightService.itemFlightCache.itemFlightInternationalDepart ? this._flightService.itemFlightCache.itemFlightInternationalDepart.id : this._flightService.itemFlightInternationalInfo.id,
      "fareId" : this._flightService.itemFlightInternational.fare.key,
      "returnFlightId" : this._flightService.itemFlightCache.roundTrip ? this._flightService.itemFlightCache.itemFlightInternationalReturn ? this._flightService.itemFlightCache.itemFlightInternationalReturn.id : (this._flightService.itemFlightInternational.returnFlights && this._flightService.itemFlightInternational.returnFlights.length -1 >= this._flightService.indexFlightInternational ? this._flightService.itemFlightInternational.returnFlights[this._flightService.indexFlightInternational].id: 0 ) : "",
      "IsInternal": this._flightService.itemFlightInternational.isInternal
    }
    this.gf.RequestApi('POST', url, {}, body, 'flightinfointernational', 'loadTicketInfo').then((data) => {
      if(data) {
        console.log(data);
        this.itemFlight = data.data;
        this.loadticketinfodone = true;
      }
    })
  }

  ngOnInit() {
  }

  close(){
      this.modalCtrl.dismiss();
  }

  confirm(){
      
    
  }
}