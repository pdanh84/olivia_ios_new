import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, Platform, LoadingController } from '@ionic/angular';
import { Booking, ValueGlobal, RoomInfo, Bookcombo } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';

import * as moment from 'moment';
import { ActionSheetController } from '@ionic/angular';
import * as $ from 'jquery';
/**
 * Generated class for the FacilitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-flightdeparture',
  templateUrl: 'flightdeparture.html',
  styleUrls: ['flightdeparture.scss'],
})
export class FlightDeparturePage implements OnInit{
    listflight:any;
    listflightdisplay:any = [];
    daytitle:string;
    column: string;
    airlinename=false;
    sortairline=false;
    isdepart = false;
    flightdeparttitle;
    fromplace;
  buttonVASelected: boolean = false;
  buttonVJSelected: boolean = false;
  buttonJSSelected: boolean = false;
  buttonBASelected: boolean = false;
  arrFilterAirline: any = [];
  public loader: any;
  constructor(public platform: Platform,public valueGlobal: ValueGlobal, public navCtrl: NavController, private Roomif: RoomInfo, public zone: NgZone,
    public booking: Booking, public storage: Storage, public alertCtrl: AlertController, public value: ValueGlobal, public modalCtrl: ModalController, public gf: GlobalFunction, public loadingCtrl: LoadingController,
    public bookCombo: Bookcombo,private actionsheetCtrl: ActionSheetController) {
        var params = this.gf.getParams('listflight');
        if(params){
            this.daytitle = params.title;
            this.flightdeparttitle = params.flightdeparttitle;
            if(params.isdepart){
                this.isdepart = true;
                this.listflight = params.listdepart;
                this.fromplace = params.listdepart[0].fromPlace;
            }else{
                this.isdepart = false;
                this.listflight = params.listreturn;
                this.fromplace = params.listreturn[0].fromPlace;
            }
            var se = this;
            se.listflight.forEach(element => {
                let de_date = new Date(element.departTime);
                let de_date_landing = new Date(element.landingTime);
                element.flighttime = moment(de_date).format("HH") +':'+  moment(de_date).format("mm")+ ' → ' + moment(de_date_landing).format("HH")+ ':' + moment(de_date_landing).format("mm");

                var priceFlightAdult = 0;
                element.priceSummaries.forEach(e => {
                  if(e.passengerType == 0){
                    priceFlightAdult+= e.price;
                  }
                });

                let ticketSale = 0;
                var cb;
                if(this.bookCombo.ComboDetail.details.length ==1){
                  cb = this.bookCombo.ComboDetail.details[0];
                }else{
                  this.bookCombo.ComboDetail.details.forEach(element => {
                    let df = moment(element.stayFrom).format('YYYY-MM-DD');
                    let dt = moment(element.stayTo).format('YYYY-MM-DD');
                    if(moment(this.booking.CheckInDate).diff(moment(df),'days') >=0 && moment(dt).diff(moment(this.booking.CheckInDate),'days') >=0
                      && moment(this.booking.CheckOutDate).diff(moment(df),'days') >=0 && moment(dt).diff(moment(this.booking.CheckOutDate),'days') >=0){
                        cb = element;
                    }
                  });
                  if(!cb){
                    cb= this.bookCombo.ComboDetail.details[0];
                  }
                }
                if(params.isdepart){
                  ticketSale = cb.departTicketSale;
                }else{
                  ticketSale = cb.returnTicketSale;
                }
                if(ticketSale > priceFlightAdult){
                    // let pricesdepartstr = se.bookCombo.ComboDetail.details[0].ticketSale - element.price;
                    // element.pricedown = pricesdepartstr;
                    // element.pricestrdown = pricesdepartstr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
                    let pricesdepartstr = Math.ceil(((ticketSale - priceFlightAdult) * 0.7 )/1000)*1000;
                    element.pricedown = pricesdepartstr;
                    element.pricestrdown = pricesdepartstr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
                  }
                  if(ticketSale <= priceFlightAdult){
                    // let pricesdepartstr = element.price - se.bookCombo.ComboDetail.details[0].departTicketSale;
                    // element.priceup = pricesdepartstr;
                    // element.pricestrup = pricesdepartstr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
                    let pricesdepartstr = Math.ceil( (priceFlightAdult - ticketSale)/1000 )*1000;
                    element.priceup = pricesdepartstr;
                    element.pricestrup = pricesdepartstr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
                  }
                  se.listflightdisplay.push(element);
            });
        }
        this.gf.googleAnalytion('flightdeparture','Search','');
    }

  ngOnInit(){
  }

  goback(){
    this.modalCtrl.dismiss();
  }
  

  async openFilterFlight(){
    this.airlinename = true;

    let actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-flight-departure',
      buttons: [
        {
          text: "VietnamAirlines/ Pacific Airlines",
          cssClass:"btn-VietnamAirlines cls-border-bottom",
          handler: () => {
            this.buttonVASelected = !this.buttonVASelected;
            this.buttonVASelected ? $(".btn-VietnamAirlines > span").addClass('selected') : $(".btn-VietnamAirlines > span").removeClass('selected');
            this.buttonVASelected ? this.arrFilterAirline.push("VietnamAirlines") : this.removeItemAirlineFileterInArray(this.arrFilterAirline, "VietnamAirlines");
            return false;
          }
        },
        {
          text: "VietJet",
          cssClass:"btn-VietJet cls-border-bottom",
          handler: () => {
            this.buttonVJSelected = !this.buttonVJSelected;
            this.buttonVJSelected ? $(".btn-VietJet > span").addClass('selected') : $(".btn-VietJet > span").removeClass('selected');
            this.buttonVJSelected ? this.arrFilterAirline.push("VietJetAir") : this.removeItemAirlineFileterInArray(this.arrFilterAirline, "VietJetAir");
            return false;
          }
        },
        // {
        //   text: "Pacific Airlines",
        //   cssClass:"btn-JetStar cls-border-bottom",
        //   handler: () => {
        //     this.buttonJSSelected = !this.buttonJSSelected;
        //     this.buttonJSSelected ? $(".btn-JetStar > span").addClass('selected') : $(".btn-JetStar > span").removeClass('selected');
        //     this.buttonJSSelected ? this.arrFilterAirline.push("JetStar") : this.removeItemAirlineFileterInArray(this.arrFilterAirline, "JetStar");
        //     return false;
        //   }
        // },
        {
          text: "BambooAirways",
          cssClass:"btn-BambooAirways cls-border-bottom",
          handler: () => {
            this.buttonBASelected = !this.buttonBASelected;
            this.buttonBASelected ? $(".btn-BambooAirways > span").addClass('selected') : $(".btn-BambooAirways > span").removeClass('selected');
            this.buttonBASelected ? this.arrFilterAirline.push("BambooAirways") : this.removeItemAirlineFileterInArray(this.arrFilterAirline, "BambooAirways");
            return false;
          }
        },
        {
          text: "Xác nhận",
          cssClass:"btn-filter",
          handler: () => {
              this.filterAirline(this.arrFilterAirline);
          }
        },
      ],

    });
    $(".btn-VietnamAirlines > span").prepend('<img class="img-filter" src="./assets/ic_airticket/ic_vietnamairlines_b.png" />');
    $(".btn-VietJet > span").prepend('<img class="img-filter" src="./assets/ic_airticket/ic_vietjet_b.png" />');
    $(".btn-JetStar > span").prepend('<img class="img-filter" src="./assets/ic_airticket/ic_jetstar_b.png" />');
    $(".btn-BambooAirways > span").prepend('<img class="img-filter" src="./assets/ic_airticket/ic_bamboo_b.png" />');
    this.buttonVASelected ? $(".btn-VietnamAirlines > span").addClass('selected') : $(".btn-VietnamAirlines > span").removeClass('selected');
    this.buttonVJSelected ? $(".btn-VietJet > span").addClass('selected') : $(".btn-VietJet > span").removeClass('selected');
    //this.buttonJSSelected ? $(".btn-JetStar > span").addClass('selected') : $(".btn-JetStar > span").removeClass('selected');
    this.buttonBASelected ? $(".btn-BambooAirways > span").addClass('selected') : $(".btn-BambooAirways > span").removeClass('selected');

    actionSheet.present();
  }

  public removeItemAirlineFileterInArray(array,item){
    array.forEach( (arrayItem, index) => {
      if(arrayItem == item) array.splice(index,1);
    });
}

  sortAirline(event){
    this.sortairline = true;
    this.sort(event.detail.value);
  }

  /**Hàm sort list khách sạn theo giá, điểm trung bình 
     * PDANH 23/01/2018
     */
    sort(property) {
        var se = this;
        se.column = property;
        se.listflightdisplay.forEach(element => {
          var priceFlightAdult = 0;
          element.priceSummaries.forEach(e => {
            if(e.passengerType == 0){
              priceFlightAdult+= e.price;
            }
          });
          element.priceorder = priceFlightAdult;
        });

        //se.sort('priceorder',se.listDepart[0]);

        se.zone.run(() => se.listflightdisplay.sort(function (a, b) {
            let direction = -1;
            if(property == "priceup"){
              // if(!a[property] || !b[property]){
              //   if(a[property] && !b[property]){
              //     return -1;
              //   }
              //   if(!a[property] && b[property]){
              //     return 1;
              //   }
              //   if(!a[property] && !b[property]){
              //     return -1;
              //   }
              // }else{
                // if (a[property] * 1 < b[property] * 1) {
                //   return 1 * direction;
                // }
                // else if (a[property] * 1 > b[property] * 1) {
                //   return -1 * direction;
                // }
              //}
              let col = 'priceorder';
              if (a[col] * 1 < b[col] * 1) {
                return 1 * direction;
              }
              else if (a[col] * 1 > b[col] * 1) {
                return -1 * direction;
              }
            }else{
              // let direction = (property == "sortByTimeDepartEarly" || property =="sortByTimeLandingEarly") ? -1 : 1;
              // let columnname = "sortTimeDepart";
              // if (a[columnname] < b[columnname]) {
              //   return 1 * direction;
              // }
              // else if (a[columnname] > b[columnname]) {
              //   return -1 * direction;
              // }
              let direction = (property == "sortByTimeDepartEarly" || property =="sortByTimeLandingEarly") ? -1 : 1;
              let columnname = property == "sortByTimeDepartEarly" ? 'departTime' : 'landingTime';
              if (a[columnname] < b[columnname]) {
                return 1 * direction;
              }
              else if (a[columnname] > b[columnname]) {
                return -1 * direction;
              }
            }
        }));
      };
    /**Hàm lọc lại chuyến bay
     * PDANH 24/04/2018
     */
      filterAirline(arrAirline){
        var se = this;
        if(arrAirline && arrAirline.length >0){
          //let arrAirline = event.detail.value;
          let strAirline = "";
          arrAirline.forEach(element => {
            strAirline += (strAirline != "")? (","+element) : element;
          });
          se.listflightdisplay = [];
          se.zone.run(()=>{
            se.listflight.forEach(f => {
              if(strAirline.indexOf(f.airlineCode) != -1){
                se.listflightdisplay.push(f);
              }
            });
          })
        }else{
          se.listflightdisplay = [];
          se.zone.run(()=>{
            se.listflight.forEach(f => {
              se.listflightdisplay.push(f);
            });
          })
        }
        if(se.column){
          this.sort(se.column);
        }
      }
    /**Hàm chọn lại lịch bay trên list chuyến bay
     * PDANH 24/04/2018
     */
      changeFlightInfo(obj){
        var se = this;
        this.presentLoading(obj);
        //se.gf.setParams({isdepart: se.isdepart, flight: obj},'flightdeparture');
        
      }

      ionViewDidEnter() {
        // ion-select customizing
        const ionSelects:any = window.document.querySelectorAll('ion-select');
        let img = null;
        ionSelects.forEach((ionSelect) => {
          const selectIconInner = ionSelect.shadowRoot.querySelector('.select-icon');
          if(selectIconInner){
            selectIconInner.setAttribute('style','display:none !important');
          }
        });
    }
    async presentLoading(obj) {
      var se=this;
      this.loader = await this.loadingCtrl.create({
        message: "",
      });
      this.loader.present();
      let flights:any =[];
        flights.push(obj);
        se.modalCtrl.dismiss({isdepart: se.isdepart,loader: se.loader, flights: {flights: flights}});
    }
}
