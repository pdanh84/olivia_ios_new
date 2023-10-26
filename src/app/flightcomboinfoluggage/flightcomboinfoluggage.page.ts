import { GlobalFunction } from './../providers/globalfunction';
import { Bookcombo } from './../providers/book-service';
import { NavController } from '@ionic/angular';
import { Component, OnInit,NgZone } from '@angular/core';

@Component({
  selector: 'app-flightcomboinfoluggage',
  templateUrl: './flightcomboinfoluggage.page.html',
  styleUrls: ['./flightcomboinfoluggage.page.scss'],
})
export class FlightcomboinfoluggagePage implements OnInit {
  departConditionInfo:any;returnConditionInfo:any
  departLuggage: any=[];
  returnLuggage: any=[];
  objectFlight;
  hasdepartluggage: boolean = false;
  hasreturnluggage: boolean = false;
  ischeckinfant=false;
  constructor(public navCtrl: NavController,public bookCombo: Bookcombo,public gf:GlobalFunction, public zone: NgZone) {
    this.objectFlight = this.gf.getParams('flightcombo');
    this.ischeckinfant=this.objectFlight.HotelBooking.Child?true:false;
    this.departConditionInfo=this.bookCombo.departConditionInfo;
    this.returnConditionInfo=this.bookCombo.returnConditionInfo;
    this.checkLuggageZero();
   }
   checkLuggageZero(){

    if(this.objectFlight.airLineLuggageDepart && this.objectFlight.airLineLuggageDepart.length>0){
        this.departLuggage = this.objectFlight.airLineLuggageDepart;
        let chocieDepartLuggage = this.departLuggage.filter(element => {
            return element.quantity;
        });
        if(chocieDepartLuggage && chocieDepartLuggage.length>0){
            this.zone.run(()=>{
                this.hasdepartluggage = true;
            })
        }else{
            this.zone.run(()=>{
                this.hasdepartluggage = false;
            })
        }
    }
    if(this.objectFlight.airLineLuggageReturn && this.objectFlight.airLineLuggageReturn.length>0){
        this.returnLuggage = this.objectFlight.airLineLuggageReturn;
        let chocieReturnLuggage = this.returnLuggage.filter(element => {
            return element.quantity;
        });
        if(chocieReturnLuggage && chocieReturnLuggage.length>0){
            this.zone.run(()=>{
                this.hasreturnluggage = true;
            })
        }else{
            this.zone.run(()=>{
                this.hasreturnluggage = false;
            })
        }
    }
}
  ngOnInit() {
  }
  goback()
  {
    this.navCtrl.back();
  }
  next()
  {
    var objectFlight = this.gf.getParams('flightcombo');
    if (objectFlight.airLineLuggageDepart.length <= 0 && objectFlight.airLineLuggageReturn.length <= 0) {
      this.gf.showAlertMessageOnly("Không có hành lý để mua thêm");
    }
    else{
      this.navCtrl.navigateForward('/flightcomboaddluggage');
    }
  }
}
