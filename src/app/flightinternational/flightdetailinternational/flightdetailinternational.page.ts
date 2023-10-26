import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { C } from './../../providers/constants';
import { GlobalFunction } from '../../providers/globalfunction';
import { flightService } from '../../providers/flightService';
import * as moment from 'moment';
import { FlightInfoInternationalPage } from '../flightinfointernationnal/flightinfointernational.page';
import { FlightDepartureDetailInternationalPage } from '../flightdeparturedetailinternational/flightdeparturedetailinternational.page';
@Component({
  selector: 'app-flightdetailinternational',
  templateUrl: './flightdetailinternational.page.html',
  styleUrls: ['./flightdetailinternational.page.scss'],
})
export class FlightDetailInternationalPage implements OnInit {
  msg;
  itemFlight: any;
  //ticketInfo: any;
  loadticketinfodone = true;
  arrsdk = [1,2,3];
  itemDepart: any;
  itemReturn: any;
  departTimeDisplay = '';
  returnTimeDisplay = '';
  departFlightNumber ='';
  returnFlightNumber ='';
  departFlightDepartTime: string='';
  departFlightLandingTime: string='';
  returnFlightDepartTime: string='';
  returnFlightLandingTime: string='';
  textDepartStops: string='';
  textReturnStops: string='';
  priceAdult = 0;
  priceChild = 0;
  priceInfant = 0;
  priceTax= 0;
  quantityAdult= 0;
  quantityChild= 0;
  quantityInfant= 0;
  departTimeDisplayTotal: string;
  returnTimeDisplayTotal: string;
  roundTrip: boolean = false;
  totalPrice: any=0;
  totalPriceBeforeDiscount:number=0;
  promocode: any;
  promotionCode: any;
  discountpromo: any;
  constructor(public modalCtrl: ModalController, public zone: NgZone, public navCtrl: NavController,
    public gf: GlobalFunction,public _flightService: flightService,
    ) {
     this.itemFlight = this._flightService.itemFlightInternational;
     this.itemDepart = this._flightService.itemFlightCache.itemFlightInternationalDepart;
     this.departTimeDisplay = `${this.gf.getDayOfWeek(this._flightService.itemFlightCache.itemFlightInternationalDepart.departTime).dayname}, ${moment(this._flightService.itemFlightCache.itemFlightInternationalDepart.departTime).format('DD/MM/YYYY')}`;
     this.departTimeDisplayTotal = `${this.gf.getDayOfWeek(this._flightService.itemFlightCache.itemFlightInternationalDepart.departTime).dayname}, ${moment(this._flightService.itemFlightCache.itemFlightInternationalDepart.departTime).format('DD')} thg ${moment(this._flightService.itemFlightCache.itemFlightInternationalDepart.departTime).format('MM')}`;
     this.departFlightNumber = this._flightService.itemFlightCache.itemFlightInternationalDepart.details.map((item) => item.flightNumber).join(', ');
     this.departFlightDepartTime = moment(this._flightService.itemFlightCache.itemFlightInternationalDepart.departTime).format('HH:mm');
     this.departFlightLandingTime = moment(this._flightService.itemFlightCache.itemFlightInternationalDepart.landingTime).format('HH:mm');
     this.zone.run(() => this.itemDepart.priceSummaries.sort(function (a, b) {
      return a.passengerType - b.passengerType;
    }));
    //console.log(this.itemDepart)
    this.itemDepart.priceTax =0;
    this.itemDepart.priceSummaries.forEach(element => {
      if(element.passengerType ==0 && element.code == 'NET'){
        this.itemDepart.priceAdult = element.price;
        this.itemDepart.quantityAdult = element.quantity;
      }
     
      else if(element.passengerType ==1 && element.code == 'NET'){
        this.itemDepart.priceChild = element.price;
        this.itemDepart.quantityChild = element.quantity;
      }
      else if(element.passengerType ==2 && element.code == 'NET'){
        this.itemDepart.priceInfant = element.price;
        this.quantityInfant = element.quantity;
      }
      else if(element.code == 'TAX'){
        this.itemDepart.priceTax += element.total;
      }
    
    });
   

     if(this.itemDepart && this.itemDepart.stops >0){
        this.textDepartStops = `+${this.itemDepart.stops} chặng dừng`;

        let totallayover = Math.floor(this.itemDepart.details.reduce((total,b)=>{ return total + b.layover; }, 0)/60);
        //let hourslayover:any =  Math.floor(this.itemDepart.layover/60);
        if(this.itemDepart.landingTime) {
          let hourslanding:any = moment(this.itemDepart.landingTime).format('HH');
          let layoverNights = Math.floor((hourslanding*1 + totallayover*1) / 24);
          if(layoverNights >0){
            this.textReturnStops += ` (${layoverNights} ngày)`;
          }
        }

        this.itemDepart.totalTimeLayover = 0;
        this.itemDepart.details.forEach(elementDepart => {
          if(elementDepart.layover){
            this.itemDepart.totalTimeLayover += elementDepart.layover;
          }
        })

        if(this.itemDepart.totalTimeLayover){
          let hourslayover:any = Math.floor(this.itemDepart.totalTimeLayover/60);
            let minuteslayover:any = this.itemDepart.totalTimeLayover*1 - (hourslayover*60);
            if(hourslayover < 10){
              hourslayover = hourslayover != 0?  "0"+hourslayover : "0";
            }
            if(minuteslayover < 10){
              minuteslayover = "0"+minuteslayover;
            }
            this.itemDepart.flightLayoverDisplay = hourslayover+"h"+minuteslayover+"m";
        }
     }

     if(this._flightService.itemFlightCache.itemFlightInternationalReturn){
      this.roundTrip = true;
      this.itemReturn = this._flightService.itemFlightCache.itemFlightInternationalReturn;
      this.returnTimeDisplay = `${this.gf.getDayOfWeek(this._flightService.itemFlightCache.itemFlightInternationalReturn.departTime).dayname}, ${moment(this._flightService.itemFlightCache.itemFlightInternationalReturn.departTime).format('DD/MM/YYYY')}`;
      this.returnTimeDisplayTotal = `${this.gf.getDayOfWeek(this._flightService.itemFlightCache.itemFlightInternationalReturn.departTime).dayname}, ${moment(this._flightService.itemFlightCache.itemFlightInternationalReturn.departTime).format('DD')} thg ${moment(this._flightService.itemFlightCache.itemFlightInternationalReturn.departTime).format('MM')}`;
      this.returnFlightNumber = this._flightService.itemFlightCache.itemFlightInternationalReturn.details.map((item) => item.flightNumber).join(', ');
      this.returnFlightDepartTime = moment(this._flightService.itemFlightCache.itemFlightInternationalReturn.departTime).format('HH:mm');
      this.returnFlightLandingTime = moment(this._flightService.itemFlightCache.itemFlightInternationalReturn.landingTime).format('HH:mm');

      this.itemReturn.priceTax=0;
      this.itemReturn.priceSummaries.forEach(element => {
        if(element.passengerType ==0 && element.code == 'NET'){
          this.itemReturn.priceAdult = element.price;
          this.itemReturn.quantityAdult = element.quantity;
        }
       
        else if(element.passengerType ==1 && element.code == 'NET'){
          this.itemReturn.priceChild = element.price;
          this.itemReturn.quantityChild = element.quantity;
        }
        else if(element.passengerType ==2 && element.code == 'NET'){
          this.itemReturn.priceInfant = element.price;
          this.quantityInfant = element.quantity;
        }
        else if(element.code == 'TAX'){
          this.itemReturn.priceTax += element.total;
        }
      
      });

      if(this.itemReturn && this.itemReturn.stops >0){
        this.textReturnStops = `+${this.itemReturn.stops} chặng dừng`;
        //let hourslayover:any = Math.floor(this.itemReturn.layover/60);
        let totallayover = Math.floor(this.itemReturn.details.reduce((total,b)=>{ return total + b.layover; }, 0)/60);
        if(this.itemReturn.landingTime) {
          let hourslanding:any = moment(this.itemReturn.landingTime).format('HH');
          let layoverNights = Math.floor((hourslanding*1 + totallayover*1) / 24);
          if(layoverNights >0){
            this.textReturnStops += ` (${layoverNights} ngày)`;
          }
          
        }

        this.itemReturn.totalTimeLayover = 0;
        this.itemReturn.details.forEach(elementReturn => {
          if(elementReturn.layover){
            this.itemReturn.totalTimeLayover += elementReturn.layover;
          }
        })

        if(this.itemReturn.totalTimeLayover){
          let hourslayover:any = Math.floor(this.itemReturn.totalTimeLayover/60);
            let minuteslayover:any = this.itemReturn.totalTimeLayover*1 - (hourslayover*60);
            if(hourslayover < 10){
              hourslayover = hourslayover != 0?  "0"+hourslayover : "0";
            }
            if(minuteslayover < 10){
              minuteslayover = "0"+minuteslayover;
            }
            this.itemReturn.flightLayoverDisplay = hourslayover+"h"+minuteslayover+"m";
        }
     }
     }

    
  }

  ngOnInit() {
  }

  close(){
      this.modalCtrl.dismiss();
  }

  confirm(){
      
    
  }

  async showFlightInfo(type) {
    this._flightService.itemFlightInternationalInfo = type == 1?this._flightService.itemFlightCache.itemFlightInternationalDepart: this._flightService.itemFlightCache.itemFlightInternationalReturn; 
    this._flightService.loadFlightInfoType = type;
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: FlightInfoInternationalPage,
      });
      modal.present();
  }


  async showDepartureDetail(itemFlight) {
    this._flightService.itemFlightInternationalDepartureDetail = itemFlight;
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: FlightDepartureDetailInternationalPage,
      });
      modal.present();
  }

  ionViewWillEnter() {
    if(this._flightService.itemFlightInternational.promotionCode){
      this.promocode = this._flightService.itemFlightInternational.promotionCode;
      this.promotionCode = this._flightService.itemFlightInternational.promotionCode;
      this.discountpromo = this._flightService.itemFlightInternational.discountpromo;
      
    }
    this.totalPriceAll();
      
  }

  totalPriceAll() {
    this.totalPrice = this.itemFlight.fare.price;
    if(this._flightService.itemFlightInternational && this._flightService.itemFlightInternational.discountpromo){
      this.totalPriceBeforeDiscount = this.itemFlight.fare.price;
      this.totalPrice = this.totalPrice - this._flightService.itemFlightInternational.discountpromo;
    }
  }
}