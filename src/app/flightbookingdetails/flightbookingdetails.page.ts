import { SearchHotel, ValueGlobal } from '../providers/book-service';
import { Component, OnInit, NgZone } from '@angular/core';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { flightService } from '../providers/flightService';
@Component({
  selector: 'app-flightbookingdetails',
  templateUrl: './flightbookingdetails.page.html',
  styleUrls: ['./flightbookingdetails.page.scss'],
})
export class FlightBookingDetailsPage implements OnInit {
    bookingCode: any;
    bookingFlight: any;
    allowchangeflight =  true;
  departConditionInfo: any;
  returnConditionInfo: any;
  checkInDisplay: string;
  checkOutDisplay: string;
  checkInDisplayDC: string;
  checkOutDisplayDC: string;
  listDiChung: any = "";
  textDepart; textReturn; 
  constructor(public _flightService: flightService,
    public searchhotel: SearchHotel,public storage: Storage, private zone: NgZone,
    public valueGlobal: ValueGlobal,
    private modalCtrl: ModalController) { 
      
        this.bookingCode =  this._flightService.itemFlightCache.pnr.bookingCode ?this._flightService.itemFlightCache.pnr.bookingCode: this._flightService.itemFlightCache.pnr.resNo;
        this.bookingFlight = this._flightService.itemFlightCache;
        this.checkInDisplay = this.bookingFlight.checkInDisplay + ", " + moment(this.bookingFlight.departFlight.departTime).format("YYYY");
        this.checkOutDisplay = this.bookingFlight.checkOutDisplay + ", " + moment(this.bookingFlight.departFlight.landingTime).format("YYYY");
        if(this._flightService.itemFlightCache.dataBooking && this._flightService.itemFlightCache.dataBooking.departCondition){
          this.departConditionInfo = this._flightService.itemFlightCache.dataBooking.departCondition;
      }

      if(this._flightService.itemFlightCache.dataBooking && this._flightService.itemFlightCache.dataBooking.returnCondition){
          this.returnConditionInfo = this._flightService.itemFlightCache.dataBooking.returnCondition;
      }
      if(this._flightService.itemFlightCache.childs && this._flightService.itemFlightCache.childs.length >0){
        this._flightService.itemFlightCache.childs.forEach(element => {
            element.dateofbirthdisplay = moment(element.dateofbirth).format("D") + ' thg ' + moment(element.dateofbirth).format("M") + ", "+ moment(element.dateofbirth).format("YYYY");
        });
      }
      if(this._flightService.itemFlightCache.priceCathay>0){
        this._flightService.itemFlightCache.adults.forEach(element => {
            element.dateofbirthdisplay = moment(element.dateofbirth).format("D") + ' thg ' + moment(element.dateofbirth).format("M") + ", "+ moment(element.dateofbirth).format("YYYY");
        });
      }
      if (this._flightService.itemFlightCache.DICHUNGParam) {
        this.listDiChung = this._flightService.itemFlightCache.DICHUNGParam;
        if (this._flightService.itemFlightCache.departDCPlace) {
          this.textDepart = this._flightService.itemFlightCache.departDCPlace.description;
        }
        if (this._flightService.itemFlightCache.returnDCPlace) {
          this.textReturn = this._flightService.itemFlightCache.returnDCPlace.description;
        }
        this.checkInDisplayDC = this.bookingFlight.checkInDisplaysort
        if(this.bookingFlight && this.bookingFlight.returnFlight){
          this.checkOutDisplayDC = this.bookingFlight.checkOutDisplaysort
        }
      }

      
    }
 
    ngOnInit() {
    }
        
    close(){
        this.modalCtrl.dismiss();
    }
  }