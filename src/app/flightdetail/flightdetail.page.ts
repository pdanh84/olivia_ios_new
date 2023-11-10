import { Component,OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NavController,Platform, ModalController, ActionSheetController, PickerController,  IonContent } from '@ionic/angular';
import { SearchHotel } from '../providers/book-service';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import { ValueGlobal } from '../providers/book-service';
import * as $ from 'jquery';
import { flightService } from '../providers/flightService';
import * as moment from 'moment';

import { FlightpricedetailPage } from '../flightpricedetail/flightpricedetail.page';

/**
 * Generated class for the OccupancyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-flightdetail',
  templateUrl: 'flightdetail.page.html',
  styleUrls: ['flightdetail.page.scss'],
})
export class FlightdetailPage implements OnInit {
    @ViewChild('slideTabDetail') sliderTabDetail: ElementRef | undefined;
    @ViewChild('scrollFlightDetail') contentFlightDetail: IonContent;
    slideOpts = {
      loop: false,
      slidesPerView: 1,
      centeredSlides: false,
      spaceBetween: 10,
      zoom: {
        toggle: false
      }
    };
    tabflightdetail = '1';
    title: any;
    subtitle: any;
    itemFlight: any;
    timedisplay: any;
    departTime: any;
    landingTime: any;
    departAirPort: any;
    returnAirPort: any;
    luggage = 0;
    handluggage =7;
    itemFlightCache: any;
    itemFlightDetail: any;
    itemFlightTicketCondition: any;
    priceSummaries: any;
    adult: any;
    child: any;
    totalPriceDisplay: any=0;
    ticketCondition: any;
    step = 2;
    seatMap: string;
    seatSpace: string;
  powerSupply: any;
  relax: any;
  meal: any;
  loaddatadone: boolean = false;
  airCraft: any;
    constructor(public platform: Platform,public navCtrl: NavController, public modalCtrl: ModalController,public valueGlobal:ValueGlobal,
        public searchhotel: SearchHotel, public gf: GlobalFunction,
        public actionsheetCtrl: ActionSheetController,
        public pickerController: PickerController,
        private zone: NgZone,
        public _flightService: flightService) {
          
        }

        ionViewDidEnter() {
            if(this._flightService.itemFlightCache.itemFlight){
              this.itemFlight = this._flightService.itemFlightCache.itemFlight;
              this.itemFlightCache = this._flightService.itemFlightCache;
              this.itemFlightDetail = this.itemFlight.details[0];
              this.itemFlightTicketCondition = this.itemFlight.ticketCondition;
              this.priceSummaries = this.itemFlight.priceSummaries;
              this.itemFlight.priceAdultDisplay = this.gf.convertNumberToString(this.itemFlight.priceAdult);
              this.itemFlight.priceChildDisplay = this.gf.convertNumberToString(this.itemFlight.priceChild);
              this.itemFlight.priceInfantDisplay = this.gf.convertNumberToString(this.itemFlight.priceInfant);
              this.ticketCondition = this._flightService.itemFlightCache.itemFlight.ticketCondition;

              if(this.priceSummaries && this.priceSummaries.length >0){
                  this.priceSummaries.forEach(element => {
                      element.pricedisplay = this.gf.convertNumberToString(element.total);
                  });
              }
              let totalprice:any = 0;
              this.totalPriceDisplay = 0;
              if(this._flightService.itemFlightCache.departFlight && this._flightService.itemFlightCache.roundTrip){
                totalprice += this._flightService.itemFlightCache.departFlight.totalPrice;
              }else{
                totalprice += this._flightService.itemFlightCache.itemFlight.totalPrice;
              }
              

              if(this._flightService.itemFlightCache.step == 3 && this._flightService.itemFlightCache.roundTrip){
                  this.step = 3;
                  totalprice += this._flightService.itemFlightCache.itemFlight.totalPrice;
              }

              //+ (this._flightService.itemFlightCache.returnFlight ? this._flightService.itemFlightCache.returnFlight.totalPrice : 0);
              this.totalPriceDisplay = this.gf.convertNumberToString(totalprice);
              this.itemFlight.totalPriceDisplay = this.gf.convertNumberToString(this.itemFlight.totalPrice);
              
              let flighttype = this.itemFlight.stops == 0 ? "Bay thẳng" :  "Chặng dừng";
              this.timedisplay = this.itemFlight.flightTimeDetailDisplay.replace('m','p');
              this.title = this.itemFlight.airlineCode;
              if(this.itemFlight.details && this.itemFlight.details.length <=1){
                this.subtitle = this.itemFlight.details[0].from + " - " + this.itemFlight.details[0].to + " · " + this.timedisplay + " · " + flighttype;
              }else{
                let detaillen = this.itemFlight.details.length -1;
                this.subtitle = this.itemFlight.details[0].from + " - " + this.itemFlight.details[detaillen].to + " · " + this.timedisplay + " · " + flighttype;
              }

              if(this.itemFlight.timeDisplay){
                if(this.itemFlight.timeDisplay.indexOf('→') != -1){
                  this.departTime = this.itemFlight.timeDisplay.split('→')[0].trim();
                  this.landingTime = this.itemFlight.timeDisplay.split('→')[1].trim();
                }else{
                  this.departTime = this.itemFlight.timeDisplay.split('-')[0].trim();
                  this.landingTime = this.itemFlight.timeDisplay.split('-')[1].trim();
                }
                  
              }
              
            //this.departAirPort = this._flightService.itemFlightCache.departAirport;
            //this.returnAirPort = this._flightService.itemFlightCache.returnAirPort;
            if(!this.departAirPort){
              if(this.itemFlightDetail.fromAirport){
                this.departAirPort = this.itemFlightDetail.fromAirport.substring(0, this.itemFlightDetail.fromAirport.length -5 );
              }else if(this.itemFlightCache.departAirport){
                this.departAirPort =this.itemFlightCache.departAirport;
              }
            }
            if(!this.returnAirPort){
              if(this.itemFlightDetail.toAirport){
                this.returnAirPort = this.itemFlightDetail.toAirport.substring(0, this.itemFlightDetail.toAirport.length -5 );
              }else if(this.itemFlightCache.returnAirport){
                this.returnAirPort =this.itemFlightCache.returnAirport;
              }
          }
            this.adult = this.itemFlightCache.adult;
            this.child = this.itemFlightCache.child + (this.itemFlightCache.infant ? this.itemFlightCache.infant : 0);
            //if(this._flightService.itemFlightCache.)
              //let url = = C.urls.baseUrl.urlFlight + "gate/apiv1/GetSeatMaps?reservationId="+id+"&airline="+returnairlines;
            //this.getSeatMaps();

            if(this.itemFlight.details && this.itemFlight.details.length >1){
              this.itemFlight.details.forEach(element => {
                  //element.timedisplay = element.flightTimeDetailDisplay.replace('m','p');
                  let hours:any = Math.floor(element.flightDuration/60);
                  let minutes:any = element.flightDuration*1 - (hours*60);
                  if(hours < 10){
                    hours = hours != 0?  "0"+hours : "0";
                  }
                  if(minutes < 10){
                    minutes = "0"+minutes;
                  }
                  element.timedisplay = hours+"h"+minutes+"p";
                  element.departTimeDisplay = moment(element.departTime).format("HH:mm");
                  element.checkInDisplayMonth = moment(element.departTime).format("DD") + " thg " + moment(element.departTime).format("MM");
                  element.checkOutDisplayMonth = moment(element.landingTime).format("DD") + " thg " + moment(element.landingTime).format("MM");
                  element.departAirPort = element.fromAirport.substring(0, element.fromAirport.length -5);
                  element.landingTimeDisplay = moment(element.landingTime).format("HH:mm");
                  element.returnAirPort = element.toAirport.substring(0, element.toAirport.length -5);
                  element.landingTimeDisplay = moment(element.landingTime).format("HH:mm");
                  element.landingTimeDisplayMonth = moment(element.landingTime).format("DD") + " thg " + moment(element.landingTime).format("MM");
                  let layhours:any = Math.floor(element.layover/60);
                    let layminutes:any = element.layover*1 - (layhours*60);

                    element.timeOverStop = layhours + " tiếng " + (layminutes > 0 ? (+layminutes + " phút") : '') ; //moment(this.itemFlight.details[1].departTime).diff(moment(this.itemFlight.details[0].landingTime), 'hours');
                    this.getDetailTicket(element).then((data) => {
                    element.seatMap = data.addon.seatMap;
                    element.seatSpace = data.addon.seatSpace;
                    element.powerSupply = data.addon.powerSupply;
                    element.relax = data.addon.relax;

                    if(data.ticketCondition){
                      element.ticketCondition = data.ticketCondition;
                      element.meal = data.ticketCondition.meal;
                    }
                    this.loaddatadone = true;
                  })

              });
              
            }else{
              this.itemFlight.details[0].landingTimeDisplay = moment(this.itemFlight.details[0].landingTime).format("HH:mm");
              this.itemFlight.details[0].landingTimeDisplayMonth = moment(this.itemFlight.details[0].landingTime).format("DD") + " thg " + moment(this.itemFlight.details[0].landingTime).format("MM");
              
              this.getDetailTicket(this.itemFlight).then((data) =>{
                this.seatMap = data.addon.seatMap;
                this.seatSpace = data.addon.seatSpace;
                this.powerSupply = data.addon.powerSupply;
                this.relax = data.addon.relax;
                this.airCraft = data.addon.airCaft;

                if(data.ticketCondition){
                  this.itemFlightTicketCondition = data.ticketCondition;
                  this.ticketCondition = data.ticketCondition;
                  this.meal = data.ticketCondition.meal;
                }
                this.loaddatadone = true;
              })
            }
          }
        }

        ngOnInit(){

        }

        close(){
            this.modalCtrl.dismiss();
        }

        SelectTabFlight(tabIndex){
            this.tabflightdetail = tabIndex;
            this.sliderTabDetail?.nativeElement.swiper.slideTo(tabIndex-1);
            this.contentFlightDetail.scrollToTop(200);
        }

        confirm(){
            this.modalCtrl.dismiss({select: true});
        }

    slidetabchange(){
        // this.sliderTabDetail?.nativeElement.getActiveIndex().then(index => {
        //   this.tabflightdetail = index+1;
        // });
        this.tabflightdetail = this.sliderTabDetail?.nativeElement.swiper.activeIndex +1;
        this.contentFlightDetail.scrollToTop(200);
      }

      getDetailTicket(item) : Promise<any>{
        var se = this;
        return new Promise((resolve, reject) => {
          let headers = {
            "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            'Content-Type': 'application/json; charset=utf-8'
          };
          let strUrl = C.urls.baseUrl.urlFlight + "gate/apiv1/GetDetailTicketAirBus?airlineCode="+item.airlineCode +"&ticketType="+item.ticketType+"&airbusCode="+item.aircraft+"&flightNumber="+item.flightNumber+"&fromPlace="+(item.fromPlaceCode || item.from)+"&toPlace="+(item.toPlaceCode || item.to)+"&departDate="+moment(item.departTime).format("MM-DD-YYYY")+"&bookingDate="+moment(new Date()).format("MM-DD-YYYY");
          this.gf.RequestApi('GET', strUrl, headers, {}, 'flightdetail', 'getDetailTicket').then((data)=>{

            if (data) {
              let result = data;
              resolve(result);
              
          }
        })
        })
        
    }
}

