import { SearchHotel, ValueGlobal } from '../providers/book-service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import * as moment from 'moment';
import { NavController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { flightService } from '../providers/flightService';
@Component({
  selector: 'app-flightconfirmbookingdetail',
  templateUrl: './flightconfirmbookingdetail.page.html',
  styleUrls: ['./flightconfirmbookingdetail.page.scss'],
})
export class flightConfirmBookingDetailPage implements OnInit {
    bookingCode: any;
    bookingFlight: any;
    allowchangeflight =  true;
  departConditionInfo: any;
  returnConditionInfo: any;
  checkInDisplay: string;
  checkOutDisplay: string;
  
  constructor(private activatedRoute: ActivatedRoute,public _flightService: flightService,
    private navCtrl:NavController, public searchhotel: SearchHotel,public storage: Storage, private zone: NgZone,
    public valueGlobal: ValueGlobal,
    private modalCtrl: ModalController) { 
      
        //this.bookingCode =  this._flightService.itemFlightCache.pnr.resNo;
        this.bookingFlight = this._flightService.itemFlightCache;
        this.checkInDisplay = this.bookingFlight.checkInDisplay + ", " + moment(this.bookingFlight.departFlight.departTime).format("YYYY");
        if(this.bookingFlight && this.bookingFlight.returnFlight){
          this.checkOutDisplay = this.bookingFlight.checkOutDisplay + ", " + moment(this.bookingFlight.returnFlight.departTime).format("YYYY");
        }
        
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
    }
 
    ngOnInit() {
    }
        
    close(){
        this.modalCtrl.dismiss();
    }

    gotopayment(){
      this.modalCtrl.dismiss({confirm: true});
    }

    edit(){
        this.modalCtrl.dismiss();
    }
  }