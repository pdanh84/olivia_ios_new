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
  selector: 'app-flightsearchfilter',
  templateUrl: './flightsearchfilter.page.html',
  styleUrls: ['./flightsearchfilter.page.scss'],
})
export class FlightsearchfilterPage implements OnInit {

  loadpricedone = false;
  items: any[];
  itemsfull: any[];
  itemsHasSameCity: any=[];
  minpricedisplay = "0đ";
  maxpricedisplay = "15.000.000đ";
  priceobject: any = { lower: 0, upper: 15000000 }
  departTimeRange: any=[];
  returnTimeRange:any=[];
  airlineSelected: any=[];
  classSelected: any=[];
  stopSelected: any=[];

  minpricereturndisplay = "0đ";
  maxpricereturndisplay = "15.000.000đ";
  priceobjectreturn: any = { lower: 0, upper: 15000000 }
  departTimeRangeReturn: any=[];
  returnTimeRangeReturn:any=[];
  airlineSelectedReturn: any=[];
  classSelectedReturn: any=[];
  stopSelectedReturn: any=[];

  countFilter = 0;
  listDepartAirlines: any=[];
  listReturnAirlines: any=[];
  listDepartLandingTimeRange: any=[];
  listDepartTimeRange: any=[];
  listReturnTimeRange: any=[];
  listReturnLandingTimeRange: any=[];
  isdepart: boolean;
  minvalue: any="0";
  maxvalue: any="15000000";
  listDepartStops: any=[];
  listReturnStops: any=[];
  listDepartTicketClass: any=[];
  listReturnTicketClass: any=[];
  minvalueReturn: any;
  maxvalueReturn: any;
  step: any;
  countFilterReturn: any= 0;

  listDepartAirlinesReturn: any=[];
  listReturnAirlinesReturn: any=[];
  listDepartLandingTimeRangeReturn: any=[];
  listDepartTimeRangeReturn: any=[];
  listReturnTimeRangeReturn: any=[];
  listReturnLandingTimeRangeReturn: any=[];
  listDepartStopsReturn: any=[];
  listReturnStopsReturn: any=[];
  listDepartTicketClassReturn: any=[];
  listReturnTicketClassReturn: any=[];

  facilitySelected: any=[];
  facilitySelectedReturn: any=[];
  listDepartFacility: any=[];
  listReturnFacility: any=[];
  VJSaverTicket = ['E1_Eco','A_Eco'];
  hasfilter: boolean;


  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private zone: NgZone,
    public storage: Storage,
    private actionsheetCtrl: ActionSheetController,
    public valueGlobal: ValueGlobal,
    public searchhotel: SearchHotel,
    public _flightService: flightService) { 
      this.step = this._flightService.itemFlightCache.step;
      if(this._flightService.objectFilter && this._flightService.objectFilter.minprice){
        this.zone.run(()=>{
        if(this._flightService.itemFlightCache.step ==2){
              this.priceobject = { lower: this._flightService.objectFilter.minprice.toString(), upper: this._flightService.objectFilter.maxprice.toString() };
              this.minpricedisplay = this.gf.convertNumberToString(this.priceobject.lower) + "đ"; 
              this.maxpricedisplay = this.gf.convertNumberToString(this.priceobject.upper) + "đ";
              this.departTimeRange = this._flightService.objectFilter.departTimeRange;
              this.returnTimeRange = this._flightService.objectFilter.returnTimeRange;
              this.airlineSelected = this._flightService.objectFilter.airlineSelected;
              this.classSelected = this._flightService.objectFilter.classSelected;
              this.stopSelected = this._flightService.objectFilter.stopSelected;
              this.facilitySelected = this._flightService.objectFilter.facilitySelected;
          }
        })
        this.filterItem();
      }else{
        this.zone.run(()=>{
          if(this._flightService.itemFlightCache.step ==2){
            this.isdepart = true;
            let maxValue = Math.max(...this._flightService.listAllFlightDepart.map(o => o.totalPrice), 0);
            let minValue = Math.min(...this._flightService.listAllFlightDepart.map(o => o.totalPrice));
            this.minvalue = minValue.toString();
            this.maxvalue = maxValue.toString();
            this.priceobject = { lower: this.minvalue.toString(), upper: this.maxvalue.toString() };
            this.minpricedisplay = this.gf.convertNumberToString(minValue) + "đ"; 
            this.maxpricedisplay = this.gf.convertNumberToString(maxValue) + "đ";
            if(this._flightService.objectFilter){
              if(this._flightService.objectFilter.departTimeRange && this._flightService.objectFilter.departTimeRange.length >0){
                this.departTimeRange = this._flightService.objectFilter.departTimeRange;
                this.hasfilter = true;
              }
        
              if(this._flightService.objectFilter.returnTimeRange && this._flightService.objectFilter.returnTimeRange.length >0){
                this.returnTimeRange = this._flightService.objectFilter.returnTimeRange;
                this.hasfilter = true;
              }
    
              if(this._flightService.objectFilter.airlineSelected && this._flightService.objectFilter.airlineSelected.length >0){
                this.airlineSelected = this._flightService.objectFilter.airlineSelected;
                this.hasfilter = true;
              }
    
              if(this._flightService.objectFilter.classSelected && this._flightService.objectFilter.classSelected.length>0){
                this.classSelected = this._flightService.objectFilter.classSelected;
                this.hasfilter = true;
              }
    
              if(this._flightService.objectFilter.stopSelected && this._flightService.objectFilter.stopSelected.length>0){
                this.stopSelected = this._flightService.objectFilter.stopSelected;
                this.hasfilter = true;
              }
    
              if(this._flightService.objectFilter.facilitySelected && this._flightService.objectFilter.facilitySelected.length>0){
                this.facilitySelected = this._flightService.objectFilter.facilitySelected;
                this.hasfilter = true;
              }
  
              if(this.hasfilter){
                this.countFilter = this._flightService.listflightDepartFilter.length;
              }else{
                this.countFilter = this._flightService.listAllFlightDepart.length;
              }
            }
            
          }
      })
      }
      if(this._flightService.objectFilterReturn && this._flightService.objectFilterReturn.minprice){
        if(this._flightService.itemFlightCache.step == 3){

            this.priceobjectreturn = { lower: this._flightService.objectFilterReturn.minprice.toString(), upper: this._flightService.objectFilterReturn.maxprice.toString() };
            this.minpricereturndisplay = this.gf.convertNumberToString(this.priceobjectreturn.lower) + "đ"; 
            this.maxpricereturndisplay = this.gf.convertNumberToString(this.priceobjectreturn.upper) + "đ";
            this.departTimeRangeReturn = this._flightService.objectFilterReturn.departTimeRangeReturn;
            this.returnTimeRangeReturn = this._flightService.objectFilterReturn.returnTimeRangeReturn;
            this.airlineSelectedReturn = this._flightService.objectFilterReturn.airlineSelectedReturn;
            this.classSelectedReturn = this._flightService.objectFilterReturn.classSelectedReturn;
            this.stopSelectedReturn = this._flightService.objectFilterReturn.stopSelectedReturn;
            this.facilitySelectedReturn = this._flightService.objectFilterReturn.facilitySelectedReturn;

            this.filterItem();
        }
        
      }else{
        if(this._flightService.itemFlightCache.step == 3){
          this.isdepart = false;
          let maxValueReturn = Math.max(...this._flightService.listAllFlightReturn.map(o => o.totalPrice), 0);
          let minValueReturn = Math.min(...this._flightService.listAllFlightReturn.map(o => o.totalPrice));
          this.minvalueReturn = minValueReturn.toString();
          this.maxvalueReturn = maxValueReturn.toString();
          this.priceobjectreturn = { lower: this.minvalueReturn.toString(), upper: this.maxvalueReturn.toString() };
          this.minpricereturndisplay = this.gf.convertNumberToString(minValueReturn) + "đ"; 
          this.maxpricereturndisplay = this.gf.convertNumberToString(maxValueReturn) + "đ";
          this.countFilterReturn = this._flightService.listAllFlightReturn.length;
        }
      }

      this.zone.run(()=>{
        if(this._flightService.itemFlightCache.step ==2){
          this.isdepart = true;
          let maxValue = Math.max(...this._flightService.listAllFlightDepart.map(o => o.totalPrice), 0);
          let minValue = Math.min(...this._flightService.listAllFlightDepart.map(o => o.totalPrice));
          this.minvalue = minValue.toString();
          this.maxvalue = maxValue.toString();
          if(this._flightService.itemFlightCache.listDepartTimeRange && this._flightService.itemFlightCache.listDepartTimeRange.length >0){
            this.listDepartTimeRange = this._flightService.itemFlightCache.listDepartTimeRange;
          }
    
          if(this._flightService.itemFlightCache.listDepartLandingTimeRange && this._flightService.itemFlightCache.listDepartLandingTimeRange.length >0){
            this.listDepartLandingTimeRange = this._flightService.itemFlightCache.listDepartLandingTimeRange;
          }

          if(this._flightService.itemFlightCache.listDepartAirlines && this._flightService.itemFlightCache.listDepartAirlines.length >0){
            this.listDepartAirlines = this._flightService.itemFlightCache.listDepartAirlines;
          }

          if(this._flightService.itemFlightCache.listDepartTicketClass && this._flightService.itemFlightCache.listDepartTicketClass.length>0){
            this.listDepartTicketClass = this._flightService.itemFlightCache.listDepartTicketClass;
          }

          if(this._flightService.itemFlightCache.listDepartStops && this._flightService.itemFlightCache.listDepartStops.length>0){
            this.listDepartStops = this._flightService.itemFlightCache.listDepartStops;
          }
          if(this._flightService.itemFlightCache.listDepartFacility && this._flightService.itemFlightCache.listDepartFacility.length>0){
            this.listDepartFacility = this._flightService.itemFlightCache.listDepartFacility;
          }
        }else{
          this.isdepart = false;
          let maxValue = Math.max(...this._flightService.listAllFlightReturn.map(o => o.totalPrice), 0);
            let minValue = Math.min(...this._flightService.listAllFlightReturn.map(o => o.totalPrice));
            this.minvalueReturn = minValue.toString();
            this.maxvalueReturn = maxValue.toString();
          if(this._flightService.itemFlightCache.listReturnTimeRangeReturn && this._flightService.itemFlightCache.listReturnTimeRangeReturn.length >0){
            this.listReturnTimeRangeReturn = this._flightService.itemFlightCache.listReturnTimeRangeReturn;
          }
    
          if(this._flightService.itemFlightCache.listReturnLandingTimeRangeReturn && this._flightService.itemFlightCache.listReturnLandingTimeRangeReturn.length >0){
            this.listReturnLandingTimeRangeReturn = this._flightService.itemFlightCache.listReturnLandingTimeRangeReturn;
          }

          if(this._flightService.itemFlightCache.listReturnAirlinesReturn && this._flightService.itemFlightCache.listReturnAirlinesReturn.length >0){
            this.listReturnAirlinesReturn = this._flightService.itemFlightCache.listReturnAirlinesReturn;
          }

          if(this._flightService.itemFlightCache.listReturnTicketClassReturn && this._flightService.itemFlightCache.listReturnTicketClassReturn.length>0){
            this.listReturnTicketClassReturn = this._flightService.itemFlightCache.listReturnTicketClassReturn;
          }

          if(this._flightService.itemFlightCache.listReturnStopsReturn && this._flightService.itemFlightCache.listReturnStopsReturn.length>0){
            this.listReturnStopsReturn = this._flightService.itemFlightCache.listReturnStopsReturn;
          }

          if(this._flightService.itemFlightCache.listReturnFacility && this._flightService.itemFlightCache.listReturnFacility.length>0){
            this.listReturnFacility = this._flightService.itemFlightCache.listReturnFacility;
          }
        }

      })
    }

    ngOnInit(){

    }

    close(){
      this.modalCtrl.dismiss();
    }

    changeprice() {
      if(this.step ==2 ){
        this.minpricedisplay = this.gf.convertNumberToString(this.priceobject.lower) + "đ"; 
        this.maxpricedisplay = this.gf.convertNumberToString(this.priceobject.upper) + "đ";
      }else{
        this.minpricereturndisplay = this.gf.convertNumberToString(this.priceobjectreturn.lower) + "đ"; 
        this.maxpricereturndisplay = this.gf.convertNumberToString(this.priceobjectreturn.upper) + "đ";
      }
      
      this.filterItem();
    }

    departTimeClick(value){
        if(this.step == 2){
          if(this.departTimeRange.indexOf(value) != -1){
            this.gf.removeItem(this.departTimeRange, value);
          }else{
            this.departTimeRange.push(value);
          }
        }else{
          if(this.departTimeRangeReturn.indexOf(value) != -1){
            this.gf.removeItem(this.departTimeRangeReturn, value);
          }else{
            this.departTimeRangeReturn.push(value);
          }
        }
      
      this.filterItem();
    }

    returnTimeClick(value){
      if(this.step == 2){
        if(this.returnTimeRange.indexOf(value) != -1){
          this.gf.removeItem(this.returnTimeRange, value);
        }else{
          this.returnTimeRange.push(value);
        }
      }else{
        if(this.returnTimeRangeReturn.indexOf(value) != -1){
          this.gf.removeItem(this.returnTimeRangeReturn, value);
        }else{
          this.returnTimeRangeReturn.push(value);
        }
      }
      this.filterItem();
    }

    airlineFitlerClick(value){
      if(this.step == 2){
        if(this.airlineSelected.indexOf(value) != -1){
          this.gf.removeItem(this.airlineSelected, value);
        }else{
          this.airlineSelected.push(value);
        }
      }else{
        if(this.airlineSelectedReturn.indexOf(value) != -1){
          this.gf.removeItem(this.airlineSelectedReturn, value);
        }else{
          this.airlineSelectedReturn.push(value);
        }
      }
      this.filterItem();
    }

    classFitlerClick(value){
      if(this.step == 2){
        if(this.classSelected.indexOf(value) != -1){
          this.gf.removeItem(this.classSelected, value);
        }else{
          this.classSelected.push(value);
        }
      }else{
        if(this.classSelectedReturn.indexOf(value) != -1){
          this.gf.removeItem(this.classSelectedReturn, value);
        }else{
          this.classSelectedReturn.push(value);
        }
      }
      this.filterItem();
    }

    stopFitlerClick(value){
      if(this.step == 2){
        if(this.stopSelected.indexOf(value) != -1){
          this.gf.removeItem(this.stopSelected, value);
        }else{
          this.stopSelected.push(value);
        }
      }else{
        if(this.stopSelectedReturn.indexOf(value) != -1){
          this.gf.removeItem(this.stopSelectedReturn, value);
        }else{
          this.stopSelectedReturn.push(value);
        }
      }
      
      this.filterItem();
      }

      flightFacilityFitlerClick(value){
        if(this.step == 2){
          if(this.facilitySelected.indexOf(value) != -1){
            this.gf.removeItem(this.facilitySelected, value);
          }else{
            this.facilitySelected.push(value);
          }
        }else{
          if(this.facilitySelectedReturn.indexOf(value) != -1){
            this.gf.removeItem(this.facilitySelectedReturn, value);
          }else{
            this.facilitySelectedReturn.push(value);
          }
        }
        
        this.filterItem();
      }

    filterByListFlight(list){
      var se = this;
      var listFilter: any =[];
      if(se.step == 2){
        let filterPrice = list.filter((filterpriceitem) => {
          return filterpriceitem.totalPrice *1 >= this.priceobject.lower *1 && filterpriceitem.totalPrice *1 <= this.priceobject.upper *1;
        })
        listFilter = [...filterPrice];

          if( se.departTimeRange && se.departTimeRange.length >0){//Lọc theo giờ cất cánh
              let filterDepart = listFilter.filter((filterdepartitem) => {
                let time = moment(filterdepartitem.departTime).format("HH:mm:ss");
                let timerange = time ? se.gf.convertStringToNumber(time) : -1;

                let strFilter;
                if(se.departTimeRange.indexOf(1) != -1){
                  strFilter = timerange >= 0 && timerange <= 60000;
                }
                if(se.departTimeRange.indexOf(2) != -1){
                  strFilter = strFilter ? (strFilter || timerange >= 60000 && timerange <= 120000) : timerange >= 60000 && timerange <= 120000;
                }
                if(se.departTimeRange.indexOf(3) != -1){
                  strFilter = strFilter ? (strFilter || timerange >= 120000 && timerange <= 180000) : timerange >= 120000 && timerange <= 180000 ;
                }
                if(se.departTimeRange.indexOf(4) != -1){
                  strFilter = strFilter ? (strFilter || timerange >= 180000 && timerange <= 240000) : timerange >= 180000 && timerange <= 240000;
                }
                
                return strFilter;
              })
              listFilter = [...filterDepart];
          }

        if( se.returnTimeRange && se.returnTimeRange.length >0){//Lọc theo giờ hạ cánh
            let filterReturn = listFilter.filter((filterreturnitem) => {
              let time = moment(filterreturnitem.landingTime).format("HH:mm:ss");
              let timerange = time ? se.gf.convertStringToNumber(time) : -1;

              let strFilter;
                if(se.returnTimeRange.indexOf(1) != -1){
                  strFilter = timerange >= 0 && timerange <= 60000;
                }
                if(se.returnTimeRange.indexOf(2) != -1){
                  strFilter = strFilter ? (strFilter || timerange >= 60000 && timerange <= 120000) : timerange >= 60000 && timerange <= 120000;
                }
                if(se.returnTimeRange.indexOf(3) != -1){
                  strFilter = strFilter ? (strFilter || timerange >= 120000 && timerange <= 180000) : timerange >= 120000 && timerange <= 180000 ;
                }
                if(se.returnTimeRange.indexOf(4) != -1){
                  strFilter = strFilter ? (strFilter || timerange >= 180000 && timerange <= 240000) : timerange >= 180000 && timerange <= 240000;
                }
                
                return strFilter;
            })
            listFilter = [...filterReturn];
        }

          if(se.airlineSelected && se.airlineSelected.length >0){
            let filterAirline = listFilter.filter((filterairlineitem) => {
              let str;
              if(se.airlineSelected.indexOf(1) != -1){
                str = filterairlineitem.airlineCode == "VietnamAirlines";
              }
              if(se.airlineSelected.indexOf(2) != -1){
                str = str ? (str || filterairlineitem.airlineCode == "BambooAirways") : filterairlineitem.airlineCode == "BambooAirways";
              }
              if(se.airlineSelected.indexOf(3) != -1){
                str = str ? (str || filterairlineitem.airlineCode == "JetStar") : filterairlineitem.airlineCode == "JetStar" ;
              }
              if(se.airlineSelected.indexOf(4) != -1){
                str = str ? (str || filterairlineitem.airlineCode == "VietJetAir") : filterairlineitem.airlineCode == "VietJetAir";
              }
              if(se.airlineSelected.indexOf(5) != -1){
                str = str ? (str || filterairlineitem.airlineCode == "AirAsia") : filterairlineitem.airlineCode == "AirAsia" ;
              }
              return str;
            })
            listFilter = [...filterAirline];
          }

          if( se.classSelected && se.classSelected.length >0){
            let filterclass = listFilter.filter((filterclassitem) => {
              let str;
              if(se.classSelected.indexOf(1) != -1){
                str = ((filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Phổ thông") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Eco" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) == -1));
              }
              if(se.classSelected.indexOf(2) != -1){
                str = str ? (str || filterclassitem.ticketClass == "Thương gia") : filterclassitem.ticketClass == "Thương gia";
              }
              if(se.classSelected.indexOf(3) != -1){
                str = str ? (str || ((filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Linh hoạt") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Deluxe" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) == -1))) : ((filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Linh hoạt") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Deluxe" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) == -1)) ;
              }
              if(se.classSelected.indexOf(4) != -1){
                
                str = str ? (str || ((filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Tiết kiệm") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Eco" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) != -1))) : ((filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Tiết kiệm") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Eco" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) != -1)) ;
              }
              return str;
            })
            listFilter = [...filterclass];
          }

          if( se.stopSelected && se.stopSelected.length >0){
            let filterclass = listFilter.filter((filterstopitem) => {
              let stop = filterstopitem.stops*1 +1;
              return se.stopSelected.indexOf(stop) != -1 ? true : false ;
            })
            listFilter = [...filterclass];
          }

          if( se.facilitySelected && se.facilitySelected.length >0){
            let filterfac = listFilter.filter((filterfacility) => {
              //let stop = filterstopitem.stops*1 +1;
              let str;
              if(filterfacility.ticketCondition){
                  if(se.facilitySelected.indexOf(1) != -1){
                    str = filterfacility.ticketCondition.isTicketRefund;
                  }
                  if(se.facilitySelected.indexOf(2) != -1){
                    str = str ? ( str || (filterfacility.promotions && filterfacility.promotions.length >0)) : (filterfacility.promotions && filterfacility.promotions.length >0);
                  }
                  if(se.facilitySelected.indexOf(3) != -1){
                    str = str ? ( str  || filterfacility.ticketCondition.luggageSigned ) : filterfacility.ticketCondition.luggageSigned;
                  }
                  if(se.facilitySelected.indexOf(4) != -1){
                    str = str ? ( str || (filterfacility.ticketCondition && filterfacility.ticketCondition.priorityCI)) : (filterfacility.ticketCondition && filterfacility.ticketCondition.priorityCI);
                  }
              }
              
              return str ;
            })
            listFilter = [...filterfac];
          }

          list = listFilter;
      }
      //Chiều về
      else{
        let filterPrice = list.filter((filterpriceitem) => {
          return filterpriceitem.totalPrice *1 >= this.priceobjectreturn.lower *1 && filterpriceitem.totalPrice *1 <= this.priceobjectreturn.upper *1;
        })
        listFilter = [...filterPrice];

          if( se.departTimeRangeReturn && se.departTimeRangeReturn.length >0){//Lọc theo giờ cất cánh
              let filterDepart = listFilter.filter((filterdepartitem) => {
                let time = moment(filterdepartitem.departTime).format("HH:mm:ss");
                let timerange = time ? se.gf.convertStringToNumber(time) : -1;

                let strFilter;
                if(se.departTimeRangeReturn.indexOf(1) != -1){
                  strFilter = timerange >= 0 && timerange <= 60000;
                }
                if(se.departTimeRangeReturn.indexOf(2) != -1){
                  strFilter = strFilter ? (strFilter || timerange >= 60000 && timerange <= 120000) : timerange >= 60000 && timerange <= 120000;
                }
                if(se.departTimeRangeReturn.indexOf(3) != -1){
                  strFilter = strFilter ? (strFilter || timerange >= 120000 && timerange <= 180000) : timerange >= 120000 && timerange <= 180000 ;
                }
                if(se.departTimeRangeReturn.indexOf(4) != -1){
                  strFilter = strFilter ? (strFilter || timerange >= 180000 && timerange <= 240000) : timerange >= 180000 && timerange <= 240000;
                }
                
                return strFilter;
              })
              listFilter = [...filterDepart];
          }

        if( se.returnTimeRangeReturn && se.returnTimeRangeReturn.length >0){//Lọc theo giờ hạ cánh
            let filterReturn = listFilter.filter((filterreturnitem) => {
              let time = moment(filterreturnitem.landingTime).format("HH:mm:ss");
              let timerange = time ? se.gf.convertStringToNumber(time) : -1;

              let strFilter;
                if(se.returnTimeRangeReturn.indexOf(1) != -1){
                  strFilter = timerange >= 0 && timerange <= 60000;
                }
                if(se.returnTimeRangeReturn.indexOf(2) != -1){
                  strFilter = strFilter ? (strFilter || timerange >= 60000 && timerange <= 120000) : timerange >= 60000 && timerange <= 120000;
                }
                if(se.returnTimeRangeReturn.indexOf(3) != -1){
                  strFilter = strFilter ? (strFilter || timerange >= 120000 && timerange <= 180000) : timerange >= 120000 && timerange <= 180000 ;
                }
                if(se.returnTimeRangeReturn.indexOf(4) != -1){
                  strFilter = strFilter ? (strFilter || timerange >= 180000 && timerange <= 240000) : timerange >= 180000 && timerange <= 240000;
                }
                
                return strFilter;
            })
            listFilter = [...filterReturn];
        }

          if(se.airlineSelectedReturn && se.airlineSelectedReturn.length >0){
            let filterAirline = listFilter.filter((filterairlineitem) => {
              let str;
              if(se.airlineSelectedReturn.indexOf(1) != -1){
                str = filterairlineitem.airlineCode == "VietnamAirlines";
              }
              if(se.airlineSelectedReturn.indexOf(2) != -1){
                str = str ? (str || filterairlineitem.airlineCode == "BambooAirways") : filterairlineitem.airlineCode == "BambooAirways";
              }
              if(se.airlineSelectedReturn.indexOf(3) != -1){
                str = str ? (str || filterairlineitem.airlineCode == "JetStar") : filterairlineitem.airlineCode == "JetStar" ;
              }
              if(se.airlineSelectedReturn.indexOf(4) != -1){
                str = str ? (str || filterairlineitem.airlineCode == "VietJetAir") : filterairlineitem.airlineCode == "VietJetAir";
              }
              if(se.airlineSelectedReturn.indexOf(5) != -1){
                str = str ? (str || filterairlineitem.airlineCode == "AirAsia") : filterairlineitem.airlineCode == "AirAsia" ;
              }
              return str;
            })
            listFilter = [...filterAirline];
          }

          if( se.classSelectedReturn && se.classSelectedReturn.length >0){
            let filterclass = listFilter.filter((filterclassitem) => {
              let str;
              if(se.classSelectedReturn.indexOf(1) != -1){
                str = ( (filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Phổ thông") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Eco" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) == -1) );
              }
              if(se.classSelectedReturn.indexOf(2) != -1){
                str = str ? (str || filterclassitem.ticketClass == "Thương gia") : filterclassitem.ticketClass == "Thương gia";
              }
              if(se.classSelectedReturn.indexOf(3) != -1){
                str = str ? (str || ((filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Linh hoạt") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Deluxe" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) == -1))) : ((filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Linh hoạt") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Deluxe" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) == -1)) ;
              }
              if(se.classSelectedReturn.indexOf(4) != -1){
                
                str = str ? (str || ((filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Tiết kiệm") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Eco" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) != -1))) : ((filterclassitem.airlineCode != 'VietJetAir' && filterclassitem.ticketClass == "Tiết kiệm") || (filterclassitem.airlineCode == 'VietJetAir' && filterclassitem.ticketType == "Eco" && se.VJSaverTicket.indexOf(filterclassitem.details[0].ticketType) != -1)) ;
              }
              return str;
            })
            listFilter = [...filterclass];
          }

          if( se.stopSelectedReturn && se.stopSelectedReturn.length >0){
            let filterclass = listFilter.filter((filterstopitem) => {
              let stop = filterstopitem.stops*1 + 1;
              return se.stopSelectedReturn.indexOf(stop) != -1 ? true : false ;
            })
            listFilter = [...filterclass];
          }

          if( se.facilitySelectedReturn && se.facilitySelectedReturn.length >0){
            let filterfac = listFilter.filter((filterfacility) => {
              let str;
              if(filterfacility.ticketCondition){
                  if(se.facilitySelectedReturn.indexOf(1) != -1){
                    str = filterfacility.ticketCondition.isTicketRefund;
                  }
                  if(se.facilitySelectedReturn.indexOf(2) != -1){
                    str = str ? ( str || (filterfacility.promotions && filterfacility.promotions.length >0)) : (filterfacility.promotions && filterfacility.promotions.length >0);
                  }
                  if(se.facilitySelectedReturn.indexOf(3) != -1){
                    str = str ? ( str ||  filterfacility.ticketCondition.luggageSigned ) : filterfacility.ticketCondition.luggageSigned;
                  }
                  if(se.facilitySelectedReturn.indexOf(4) != -1){
                    str = str ? ( str || (filterfacility.ticketCondition && filterfacility.ticketCondition.priorityCI)) : (filterfacility.ticketCondition && filterfacility.ticketCondition.priorityCI);
                  }
              }
              
              return str ;
            })
            listFilter = [...filterfac];
          }

          list = listFilter;
      }
        
          
        return list;
    }

    filterItem(){
      var se = this;
      if(se._flightService.listAllFlight && se._flightService.listAllFlight.length >0){

        if(se.step == 2){
          se._flightService.listflightDepartFilter = se.filterByListFlight([...se._flightService.listAllFlightDepart]);
        }else{
          if(se._flightService.listAllFlightReturn && se._flightService.listAllFlightReturn.length >0){
            se._flightService.listflightReturnFilter = se.filterByListFlight([...se._flightService.listAllFlightReturn]);
          }
        }
        
       se.zone.run(()=>{
        if(se._flightService.itemFlightCache.step ==2){
          if(se._flightService.listflightDepartFilter.length >0){
            se.countFilter = se._flightService.listflightDepartFilter.length;
          }else{
            se.countFilter = 0;
          }
        }else{
          if(se._flightService.listflightReturnFilter.length >0){
            se.countFilterReturn = se._flightService.listflightReturnFilter.length;
          }else{
            se.countFilterReturn = 0;
          }
        }
     
       })
       
      }else{
        se.countFilter = 0;
        se.countFilterReturn = 0;
      }
      
    }

    filter(){
      if(this.step == 2){
        this._flightService.objectFilter = {};
        this._flightService.objectFilter.minprice = this.priceobject.lower;
        this._flightService.objectFilter.maxprice = this.priceobject.upper;
        this._flightService.objectFilter.departTimeRange = this.departTimeRange;
        this._flightService.objectFilter.returnTimeRange = this.returnTimeRange;
        this._flightService.objectFilter.airlineSelected = this.airlineSelected;
        this._flightService.objectFilter.classSelected = this.classSelected;
        this._flightService.objectFilter.stopSelected = this.stopSelected;
        this._flightService.objectFilter.facilitySelected = this.facilitySelected;
        if(this._flightService.objectFilter && (
          this._flightService.objectFilter.minprice*1 != this.minvalue*1
          || this._flightService.objectFilter.maxprice*1 != this.maxvalue*1
          || this._flightService.objectFilter.departTimeRange.length >0
          || this._flightService.objectFilter.returnTimeRange.length >0
          || this._flightService.objectFilter.airlineSelected.length >0
          || this._flightService.objectFilter.classSelected.length >0
          || this._flightService.objectFilter.stopSelected.length >0
          || this._flightService.objectFilter.facilitySelected.length >0
        ))
        {
          this._flightService.itemFlightFilterChange.emit(1);
        }else{
          this.filterItem();
          //this._flightService.itemFlightFilterChange.emit(0);
          this._flightService.itemFlightFilterChange.emit(0);
        }
      }else{
        this._flightService.objectFilterReturn = {};
        this._flightService.objectFilterReturn.minprice = this.priceobjectreturn.lower;
        this._flightService.objectFilterReturn.maxprice = this.priceobjectreturn.upper;
        this._flightService.objectFilterReturn.departTimeRangeReturn = this.departTimeRangeReturn;
        this._flightService.objectFilterReturn.returnTimeRangeReturn = this.returnTimeRangeReturn;
        this._flightService.objectFilterReturn.airlineSelectedReturn = this.airlineSelectedReturn;
        this._flightService.objectFilterReturn.classSelectedReturn = this.classSelectedReturn;
        this._flightService.objectFilterReturn.stopSelectedReturn = this.stopSelectedReturn;
        this._flightService.objectFilterReturn.facilitySelectedReturn = this.facilitySelectedReturn;
        if(this._flightService.objectFilterReturn && (
          this._flightService.objectFilterReturn.minprice*1 != this.minvalueReturn*1
          || this._flightService.objectFilterReturn.maxprice*1 != this.maxvalueReturn*1
          || this._flightService.objectFilterReturn.departTimeRangeReturn.length >0
          || this._flightService.objectFilterReturn.returnTimeRangeReturn.length >0
          || this._flightService.objectFilterReturn.airlineSelectedReturn.length >0
          || this._flightService.objectFilterReturn.classSelectedReturn.length >0
          || this._flightService.objectFilterReturn.stopSelectedReturn.length >0
          || this._flightService.objectFilterReturn.facilitySelectedReturn.length >0
        ))
        {
           this._flightService.itemFlightFilterChangeReturn.emit(1);
        }else{
          this.filterItem();
           this._flightService.itemFlightFilterChangeReturn.emit(0);
        }
      }
      
      
      this.modalCtrl.dismiss({hasfilter: true});
    } 

    clearFilter(){
      if(this.step ==2){
        this._flightService.objectFilter = null;
        this.priceobject = { lower: this.minvalue.toString(), upper: this.maxvalue.toString() }
        this.departTimeRange=[];
        this.returnTimeRange=[];
        this.airlineSelected=[];
        this.classSelected=[];
        this.stopSelected=[];
        this.facilitySelected=[];
        this.countFilter = this._flightService.listAllFlightDepart.length;
        this._flightService.listflightDepartFilter = this._flightService.listAllFlightDepart;
        this._flightService.itemFlightFilterChange.emit(1);
      }else{
        this._flightService.objectFilterReturn = null;
        this.priceobjectreturn = { lower: this.minvalueReturn.toString(), upper: this.maxvalueReturn.toString() }
        this.departTimeRangeReturn=[];
        this.returnTimeRangeReturn=[];
        this.airlineSelectedReturn=[];
        this.classSelectedReturn=[];
        this.stopSelectedReturn=[];
        this.facilitySelectedReturn=[];
        this.countFilter = this._flightService.listAllFlightReturn.length;
        this._flightService.listflightReturnFilter = this._flightService.listAllFlightReturn;
        this._flightService.listFlightFilter = this._flightService.listAllFlight;
        this._flightService.itemFlightFilterChangeReturn.emit(1);
      }
      
    }
}