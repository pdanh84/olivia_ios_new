import { Component, OnInit, ViewChild, HostListener, NgZone, Input } from '@angular/core';
import { NavController, ModalController, ToastController, ActionSheetController } from '@ionic/angular';
import { GlobalFunction } from '../providers/globalfunction';
import * as $ from 'jquery';
import { C } from './../providers/constants';
import { OverlayEventDetail } from '@ionic/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { ValueGlobal, SearchHotel } from '../providers/book-service';
import {flightService} from './../providers/flightService';

@Component({
  selector: 'app-flightpricedetail',
  templateUrl: './flightpricedetail.page.html',
  styleUrls: ['./flightpricedetail.page.scss'],
})
export class FlightpricedetailPage implements OnInit {

  loadpricedone = false;
  items: any[];
  itemsfull: any[];
  itemsHasSameCity: any=[];
  departInfoDisplay: any;
  returnInfoDisplay: any;
  adult: any;
  child: any;
  adultPriceDepartDisplay: any;
  childPriceDepartDisplay: any;
  adultPriceReturnDisplay: any;
  childPriceReturnDisplay: any;
  listdepartseatselected: any;
  listreturnseatselected: any;
  totaldepartpriceseat: any="";
  totalreturnpriceseat: any="";
  departFlight: any;
  returnFlight: any;
  departLuggage: any=[];
  returnLuggage: any=[];
  totalpricedisplay: any;
  departluggageprice: any=0;
  returnluggageprice: any=0;
  totalpriceluggage: any=0;
  infantPriceDepartDisplay: any=0;
  infantPriceReturnDisplay: any=0;
  infant: any;
  departSeatChoice: any;
  returnSeatChoice: any;
  departPriceDC=0;
  returnPriceDC=0;
  itemHotelCity: any;
  checkInDisplay: string;
  checkOutDisplay: string;
  textPax: string;
  promotionCode: any;
  discount: any;
  priceCathay:any;

  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private zone: NgZone,
    public storage: Storage,
    private actionsheetCtrl: ActionSheetController,
    public valueGlobal: ValueGlobal,
    public searchhotel: SearchHotel,
    public _flightService: flightService) { 
        if(this._flightService.itemFlightCache){
          this.departFlight = this._flightService.itemFlightCache.departFlight;
          this.returnFlight = this._flightService.itemFlightCache.returnFlight;
          this.departInfoDisplay =this._flightService.itemFlightCache.departInfoDisplay +", "+ moment(this._flightService.itemFlightCache.departFlight.departTime).format("YYYY");
          this.returnInfoDisplay = this.returnFlight ? (this._flightService.itemFlightCache.returnInfoDisplay +", "+ moment(this._flightService.itemFlightCache.returnFlight.departTime).format("YYYY")) : "";
          this.adult = this._flightService.itemFlightCache.adult;
          this.child = this._flightService.itemFlightCache.child;
          this.infant = this._flightService.itemFlightCache.infant;
          if(this.departFlight){
            if(this._flightService.itemFlightCache.isApiDirect){
              let priceFlightAdult = 0;
              let priceFlightChild = 0;
              let priceFlightInfant = 0;
              this.departFlight.priceSummaries.forEach(e => {
                if (e.passengerType == 0) {
                  priceFlightAdult += e.price;
                }
                if (e.passengerType == 1) {
                  priceFlightChild += e.price;
                }
                if (e.passengerType == 2) {
                  priceFlightInfant += e.price;
                }
              });
              this.departFlight.priceAdult = priceFlightAdult;
              this.departFlight.priceChild = priceFlightChild;
              this.departFlight.priceInfant = priceFlightInfant;
            }
            this.adultPriceDepartDisplay = this.gf.convertNumberToString(this.departFlight.priceAdult);
            this.childPriceDepartDisplay = this.gf.convertNumberToString(this.departFlight.priceChild);
            this.infantPriceDepartDisplay = this.gf.convertNumberToString(this.departFlight.priceInfant);
          }
          
          if(this.returnFlight){
            if(this._flightService.itemFlightCache.isApiDirect){
              let priceFlightAdult = 0;
              let priceFlightChild = 0;
              let priceFlightInfant = 0;
              this.returnFlight.priceSummaries.forEach(e => {
                if (e.passengerType == 0) {
                  priceFlightAdult += e.price;
                }
                if (e.passengerType == 1) {
                  priceFlightChild += e.price;
                }
                if (e.passengerType == 2) {
                  priceFlightInfant += e.price;
                }
              });
              this.returnFlight.priceAdult = priceFlightAdult;
              this.returnFlight.priceChild = priceFlightChild;
              this.returnFlight.priceInfant = priceFlightInfant;
            }
            this.adultPriceReturnDisplay = this.gf.convertNumberToString(this.returnFlight.priceAdult);
            this.childPriceReturnDisplay = this.gf.convertNumberToString(this.returnFlight.priceChild);
            this.infantPriceReturnDisplay = this.gf.convertNumberToString(this.returnFlight.priceInfant);
          }


          this.listdepartseatselected = this._flightService.itemFlightCache.listdepartseatselected;
          this.listreturnseatselected = this._flightService.itemFlightCache.listreturnseatselected;
         //đưa đón sân bay
         if (this._flightService.itemFlightCache.DICHUNGParam) {
          if (this._flightService.itemFlightCache.roundTrip) {
            this.departPriceDC = this._flightService.itemFlightCache.DICHUNGParam.TotalPriceGo;
            this.returnPriceDC = this._flightService.itemFlightCache.DICHUNGParam.TotalPriceReturn;
          } else {
            this.departPriceDC = this._flightService.itemFlightCache.DICHUNGParam.TotalPriceGo+this._flightService.itemFlightCache.DICHUNGParam.TotalPriceReturn;
          }
         
        }
          if(this._flightService.itemFlightCache.departSeatChoiceAmout){
            this.totaldepartpriceseat = this.gf.convertNumberToString(this._flightService.itemFlightCache.departSeatChoiceAmout);
          }
          if(this._flightService.itemFlightCache.returnSeatChoiceAmout){
            this.totalreturnpriceseat = this.gf.convertNumberToString(this._flightService.itemFlightCache.returnSeatChoiceAmout);
          }

          if(this._flightService.itemFlightCache.adults){
            this.departluggageprice = this._flightService.itemFlightCache.adults.reduce((total,a)=>{ return total + (a.itemLug ? (a.itemLug.amount) : 0); }, 0);
            this.departluggageprice += this._flightService.itemFlightCache.childs.reduce((total,c)=>{ return total + (c.itemLug ? (c.itemLug.amount) : 0); }, 0);
            if(this._flightService.itemFlightCache && this._flightService.itemFlightCache.returnFlight){
              this.returnluggageprice = this._flightService.itemFlightCache.adults.reduce((total,a)=>{ return total + (a.itemLugReturn ? (a.itemLugReturn.amount) : 0); }, 0);
              this.returnluggageprice += this._flightService.itemFlightCache.childs.reduce((total,c)=>{ return total + (c.itemLugReturn ? (c.itemLugReturn.amount) : 0); }, 0);
            }
            let _a = this._flightService.itemFlightCache.adults.map(a => a.itemLug);
            _a.forEach(element => {
              if(element){
                element.amountDisplay = this.gf.convertNumberToString(element.amount);
                this.departLuggage.push(element);
              }
            });
            let _c = this._flightService.itemFlightCache.childs.map(a => a.itemLug);
            _c.forEach(elementC => {
              if(elementC){
                elementC.amountDisplay = this.gf.convertNumberToString(elementC.amount);
                this.departLuggage.push(elementC);
              }
            });
  
            if(this._flightService.itemFlightCache && this._flightService.itemFlightCache.returnFlight){
              
                  let _a = this._flightService.itemFlightCache.adults.map(a => a.itemLugReturn);
                  _a.forEach(element => {
                    if(element){
                      element.amountDisplay = this.gf.convertNumberToString(element.amount);
                      this.returnLuggage.push(element);
                    }
                  });
                  let _c = this._flightService.itemFlightCache.childs.map(a => a.itemLugReturn);
                  _c.forEach(elementC => {
                    if(elementC){
                      elementC.amountDisplay = this.gf.convertNumberToString(elementC.amount);
                      this.returnLuggage.push(elementC);
                    }
                  });
                 
            }
          }
          
          
          this.departSeatChoice = this._flightService.itemFlightCache.departSeatChoice;
          this.returnSeatChoice = this._flightService.itemFlightCache.returnSeatChoice;
          if(this.departSeatChoice && this.departSeatChoice.length >0){
            this.departSeatChoice.forEach(element => {
                element.amountDisplay = this.gf.convertNumberToString(element.amount);
            });
          }
          if(this.returnSeatChoice && this.returnSeatChoice.length >0){
            this.returnSeatChoice.forEach(element => {
                element.amountDisplay = this.gf.convertNumberToString(element.amount);
            });
          }

          let totalprice = this.departFlight.totalPrice + (this.returnFlight ? this.returnFlight.totalPrice : 0);
          if(this.departluggageprice >0){
            totalprice += this.departluggageprice;
            this.totalpriceluggage += this.departluggageprice;
          }

          if(this.returnluggageprice >0){
            totalprice += this.returnluggageprice;
            this.totalpriceluggage += this.returnluggageprice;
          }

          if(this._flightService.itemFlightCache.departSeatChoiceAmout){
            totalprice += this._flightService.itemFlightCache.departSeatChoiceAmout;
          }

          if(this._flightService.itemFlightCache.returnSeatChoiceAmout){
            totalprice += this._flightService.itemFlightCache.returnSeatChoiceAmout;
          }
          if (this._flightService.itemFlightCache.DICHUNGParam) {
            totalprice += this._flightService.itemFlightCache.DICHUNGParam.TotalPriceGo;
            totalprice += this._flightService.itemFlightCache.DICHUNGParam.TotalPriceReturn;
          }
          if(this._flightService.itemFlightCache.objHotelCitySelected){
            this.itemHotelCity = this._flightService.itemFlightCache.objHotelCitySelected;
            let dtime, rtime ;
            dtime =this._flightService.itemFlightCache.checkInDate;
            this.checkInDisplay = this.gf.getDayOfWeek(dtime).dayname + ", " + moment(dtime).format("DD/MM/YYYY");
            rtime = this._flightService.itemFlightCache.checkOutDate;
            this.checkOutDisplay = this.gf.getDayOfWeek(rtime).dayname + ", " + moment(rtime).format("DD/MM/YYYY");
            this.textPax = this.itemHotelCity.SummaryFilter + " x"+this.itemHotelCity.TotalRoom+ " phòng";
            
            totalprice += this._flightService.itemFlightCache.objHotelCitySelected.RoomPrices;
          }
           //thêm voucher
           if(this._flightService.itemFlightCache.promotionCode && this._flightService.itemFlightCache.discount > 0 )
           {
             this.promotionCode=this._flightService.itemFlightCache.promotionCode;
             this.discount=this._flightService.itemFlightCache.discount;
             totalprice=totalprice-this.discount;
           }
            //thêm cathay
            if(this._flightService.itemFlightCache.InsuranceType && this._flightService.itemFlightCache.priceCathay)
            {
              this.priceCathay=this._flightService.itemFlightCache.priceCathay;
              totalprice=totalprice+this._flightService.itemFlightCache.priceCathay;
            }
            if(totalprice*1 <0){
              totalprice = 0;
            }
          this.totalpricedisplay = this.gf.convertNumberToString(totalprice);
        }

       
    }

    ngOnInit(){

    }

    close(){
        this.modalCtrl.dismiss();
    }
}