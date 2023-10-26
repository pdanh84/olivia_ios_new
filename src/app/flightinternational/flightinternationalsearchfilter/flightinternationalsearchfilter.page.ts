import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, ModalController, ToastController, ActionSheetController } from '@ionic/angular';
import { GlobalFunction } from '../../providers/globalfunction';
import * as $ from 'jquery';
import { Storage } from '@ionic/storage';
import { ValueGlobal, SearchHotel } from '../../providers/book-service';
import {flightService} from './../../providers/flightService';

@Component({
  selector: 'app-flightinternationalsearchfilter',
  templateUrl: './flightinternationalsearchfilter.page.html',
  styleUrls: ['./flightinternationalsearchfilter.page.scss'],
})
export class FlightInternationalSearchfilterPage implements OnInit {

  loadpricedone = false;
  items: any[];
  itemsfull: any[];
  minpricedisplay = "1 triệu";
  maxpricedisplay = "200 triệu";
  priceobject: any = { lower: 0, upper: 200 };

  minoverlaydisplay = "1 giờ";
  maxoverlaydisplay = "50 giờ";
  overlayobject: any = { lower: 0, upper: 50 };
  minoverlayvalue: any="0";
  maxoverlayvalue: any="50";

  countFilter = 0;
  listAirlines: any=[];
  minvalue: any="0";
  maxvalue: any="200";

  hasfilter: boolean;
  airlineSelected = [];
  listStops: any;
  isCheckAll: boolean = false;
  pinvalue: any;
  pinoverlayvalue: any;
  count0Stops = 0;
  count1Stops: number=0;
  count2Stops: number=0;
  stopSelected: any;
  divItemClass2Selected: boolean;
  divItemClass3Selected: boolean;
  divItemClass4Selected: boolean;
  divItemClass5Selected: boolean;
  classSelected: any;

  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private zone: NgZone,
    public storage: Storage,
    private actionsheetCtrl: ActionSheetController,
    public valueGlobal: ValueGlobal,
    public searchhotel: SearchHotel,
    public _flightService: flightService) { 
      //console.log(this._flightService.listAllFlightInternational);
      if(this._flightService.listAirlinesFilter) {
        this.listAirlines = this._flightService.listAirlinesFilter;
        this.listAirlines.forEach(elementAirline => {
          let listFlightByAirline =[];
          if(!this._flightService.itemFlightCache.roundTrip){
            listFlightByAirline = this._flightService.listAllFlightInternational.filter((item:any) => {return elementAirline.name == item.departFlights[0].airline});
          }else{
            listFlightByAirline = this._flightService.listAllFlightInternational.filter((item:any) => {return elementAirline.name == item.departFlights[0].airline || elementAirline.name == item.returnFlights[0].airline});
          }
         
          elementAirline.minPrice = Math.min(...listFlightByAirline.map((o:any) => o.fare.price));
          
        });

        setTimeout(()=>{
          this.zone.run(() => this.listAirlines.sort(function (a, b) {
            return a.minPrice - b.minPrice;
          }))
        })

        //console.log(this.listAirlines);
      }
      if(this._flightService.listStops){
        this.listStops = this._flightService.listStops;
      }
      
        this.zone.run(()=>{
         
          if(this._flightService.objectFilterInternational && this._flightService.objectFilterInternational.stopSelected && this._flightService.objectFilterInternational.stopSelected >0){
            this.stopSelected = _flightService.objectFilterInternational.stopSelected.toString();
          }
            let maxValue = Math.round(Math.max(...this._flightService.listAllFlightInternational.map((o:any) => o.fare.price), 0)/1000000);
            let minValue = Math.round(Math.min(...this._flightService.listAllFlightInternational.map((o:any) => o.fare.price))/1000000);

            if(_flightService.objectFilterInternational && _flightService.objectFilterInternational.maxprice ){
             this.pinvalue = _flightService.objectFilterInternational.maxprice;
            }else {
              this.pinvalue = maxValue;
            }

           

            let maxOverlayValue = Math.round(Math.max(...this._flightService.listAllFlightInternational.map((o:any) => o.fare.maxDepartTime),...this._flightService.listAllFlightInternational.map((o:any) => o.fare.maxReturnTime))/60);
            let minOverlayValue = Math.round(Math.min(...this._flightService.listAllFlightInternational.map((o:any) => o.fare.minDepartTime),...this._flightService.listAllFlightInternational.map((o:any) => o.fare.minReturnTime))/60);
            if(_flightService.objectFilterInternational && _flightService.objectFilterInternational.maxoverlay ){
              this.pinoverlayvalue = _flightService.objectFilterInternational.maxoverlay;
             }else {
               this.pinoverlayvalue = maxOverlayValue;
             }

            this.minvalue = minValue.toString();
            this.maxvalue = maxValue.toString();

            this.minoverlayvalue = minOverlayValue.toString();
            this.maxoverlayvalue = maxOverlayValue.toString();

            this.minpricedisplay = this.gf.convertNumberToString(minValue) + " triệu"; 
            this.maxpricedisplay = this.gf.convertNumberToString(maxValue) + " triệu";

            this.minoverlaydisplay = this.gf.convertNumberToString(minOverlayValue) + " giờ"; 
            this.maxoverlaydisplay = this.gf.convertNumberToString(maxOverlayValue) + " giờ";

             this.isCheckAll = this._flightService.objectFilterInternational ? this._flightService.objectFilterInternational.isCheckAll : false;
           
            if(_flightService.objectFilterInternational && _flightService.objectFilterInternational.airlineSelected && _flightService.objectFilterInternational.airlineSelected.length >0 ){
                setTimeout(()=> {
                  _flightService.objectFilterInternational.airlineSelected.forEach(item => {
                    ($('#'+item)[0] as any).checked = true;
                  });
                },500)
            }

            if(_flightService.objectFilterInternational && _flightService.objectFilterInternational.isCheckAll) {
              setTimeout(()=> {
                ($('#chkAll')[0] as any).checked = true;
              },500)
            }

            this.count1Stops = 0;
            this.count2Stops = this._flightService.listAllFlightInternational.length;
            if(this._flightService.listAllFlightInternational && this._flightService.listAllFlightInternational.length >0){
              this._flightService.listAllFlightInternational.forEach((element:any) => {
                if(this._flightService.itemFlightCache.roundTrip) {
                  if( (element.departFlights[0] && element.departFlights[0].stops <=1) && (element.returnFlights[0] && element.returnFlights[0].stops <=1) && !(element.departFlights[0] && element.returnFlights[0] && element.departFlights[0].stops ==0 && element.returnFlights[0].stops ==0 )){
                    this.count1Stops +=1;
                  } 
                  if((element.departFlights[0] && element.departFlights[0].stops ==0) && (element.returnFlights[0] && element.returnFlights[0].stops ==0)){
                    this.count0Stops +=1;
                  }
                }else {
                  if( (element.departFlights[0] && element.departFlights[0].stops ==1)){
                    this.count1Stops +=1;
                  } 
                  if((element.departFlights[0] && element.departFlights[0].stops ==0)){
                    this.count0Stops +=1;
                  }
                }
                  
                  
              });
            }
            if(this._flightService.objSearch && this._flightService.objSearch.classSelected){
              if(!this._flightService.objectFilterInternational){
                this._flightService.objectFilterInternational = {};
              }
              this.classSelected = this.getTicketClassValueByType(this._flightService.objSearch.classSelected);
              this._flightService.objectFilterInternational.classSelected = this._flightService.objSearch.classSelected;
            }
      })
      
    }

    ngOnInit(){

    }

    close(){
      this.modalCtrl.dismiss();
    }

    changeprice(value) {
      console.log(value.detail.value);
      if(value.detail.value){
        this._flightService.objectFilterInternational = this._flightService.objectFilterInternational || {};
        this._flightService.objectFilterInternational.minprice = this.minvalue;
        this._flightService.objectFilterInternational.maxprice = value.detail.value;
      }
      
    }

    changeoverlay(value) {
      if(value.detail.value){
        this._flightService.objectFilterInternational = this._flightService.objectFilterInternational || {};
        this._flightService.objectFilterInternational.minoverlay = this.minvalue;
        this._flightService.objectFilterInternational.maxoverlay = value.detail.value;
      }
    }


    clearFilter(){
        ($("#chkAll")[0]as any).checked = false;
        this._flightService.classSelected ='';
        this._flightService.classSelectedName='';
        this._flightService.objectFilterInternational = {};
        this._flightService.objectFilterInternational.stopSelected = -1;
        this._flightService.objectFilterInternational.airlineSelected = [];
          let listcheckboxs = $('.chkAirline');
          for (let index = 0; index < listcheckboxs.length; index++) {
            const element:any = listcheckboxs[index];
            element.checked = false;
          }
          this.stopSelected = -1;
        let maxValue = Math.round(Math.max(...this._flightService.listAllFlightInternational.map((o:any) => o.fare.price), 0)/1000000);
            this.pinvalue = maxValue;
            let maxOverlayValue = Math.round(Math.max(...this._flightService.listAllFlightInternational.map((o:any) => o.fare.maxDepartTime),...this._flightService.listAllFlightInternational.map((o:any) => o.fare.maxReturnTime))/60);
            this.pinoverlayvalue = maxOverlayValue;
          
        this._flightService.listflightInternationalFilter = this._flightService.listAllFlightInternational;
        if(this._flightService.objSearch && this._flightService.objSearch.classSelected){
          this._flightService.objSearch.classSelected = null;
          this.classSelected = '';
          this._flightService.itemChangeTicketFlight.emit(1);
        }
    }

    checkAll(value) {
        this.isCheckAll = !this.isCheckAll;
        this._flightService.objectFilterInternational.isCheckAll = this.isCheckAll;
        if(value.detail.checked){
          this._flightService.objectFilterInternational.airlineSelected = [];
          let listcheckboxs = $('.chkAirline');
          for (let index = 0; index < listcheckboxs.length; index++) {
            const element:any = listcheckboxs[index];
            element.checked = false;
          }
        }
    }

    checkItem(type, item, value) {
      if(type ==2) {
        if(!this._flightService.objectFilterInternational){
          this._flightService.objectFilterInternational = {};
        }
        if(!this._flightService.objectFilterInternational.airlineSelected){
          this._flightService.objectFilterInternational.airlineSelected = [];
        }
        item.checked = !item.checked;
        if(value.detail.checked){
          this.zone.run(()=>{
            this.isCheckAll = false;
            this._flightService.objectFilterInternational.isCheckAll = false;
            ($("#chkAll")[0] as any).checked = false
          })
        }
        
        if(this._flightService.objectFilterInternational.airlineSelected && (this._flightService.objectFilterInternational.airlineSelected.length == 0 || this._flightService.objectFilterInternational.airlineSelected.indexOf(item.namefilter) == -1)){
            this._flightService.objectFilterInternational.airlineSelected.push(item.namefilter);
          }
          if(!value.detail.checked){
            this.gf.removeItem(this._flightService.objectFilterInternational.airlineSelected, item.namefilter);
          }
      }else if(type ==1) {
        if(!this._flightService.objectFilterInternational){
          this._flightService.objectFilterInternational = {};
        }
        item.stopEventDefault;
        if(this._flightService.objectFilterInternational.stopSelected != item.detail.value*1){
          this._flightService.objectFilterInternational.stopSelected = item.detail.value*1;
        }else{
          this._flightService.objectFilterInternational.stopSelected = -1;
        }
      }

    }

    ionViewWillLeave(){
      this._flightService.publicItemFlightInternationalFilter(1);
      if(this._flightService.objectFilterInternational 
        && this._flightService.objectFilterInternational.classSelected 
        && this._flightService.objectFilterInternational.classSelected != '-1'
        && (this._flightService.objSearch 
        && this._flightService.objSearch.classSelected != this._flightService.objectFilterInternational.classSelected) ){
        this._flightService.itemChangeTicketFlight.emit(2);
      }else if(this._flightService.objectFilterInternational && this._flightService.objectFilterInternational.classSelected && this._flightService.objectFilterInternational.classSelected == '-1'
        && (this._flightService.objSearch 
        && this._flightService.objSearch.classSelected != this._flightService.objectFilterInternational.classSelected)){
        this._flightService.objSearch.classSelected = null;
        this._flightService.itemChangeTicketFlight.emit(1);
      }
    }

    filter(){
      this.modalCtrl.dismiss();
    }
    checkItemClass(item, value){
      if(!this._flightService.objectFilterInternational){
        this._flightService.objectFilterInternational = {};
      }
      item.stopEventDefault;
      this._flightService.objectFilterInternational.classSelected = -1;
      this.classSelected = item.detail.value;
      if(item.detail.value){
        this._flightService.objectFilterInternational.classSelected = this.getTicketClassByType(item.detail.value*1);
      }
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
            res = '-1'
          break;
      }
      return res;
    }

    expandItemClass(event, type){
      if($(event.currentTarget).siblings().hasClass('div-text-item-class')){
        $(event.currentTarget).siblings().removeClass('div-text-item-class').addClass('m-width-90');
      }else {
        $(event.currentTarget).siblings().removeClass('m-width-90').addClass('div-text-item-class');
      }

      if(type == 2){
        this.divItemClass2Selected = !this.divItemClass2Selected;
      }
      else if(type == 3){
        this.divItemClass3Selected = !this.divItemClass3Selected;
      }
      else if(type == 4){
        this.divItemClass4Selected = !this.divItemClass4Selected;
      }
      else if(type == 5){
        this.divItemClass5Selected = !this.divItemClass5Selected;
      }
    }
}