import { Component, OnInit, ViewChild, HostListener, NgZone } from '@angular/core';
import { NavController, ModalController, ToastController, IonContent } from '@ionic/angular';
import { GlobalFunction ,ActivityService} from '../providers/globalfunction';
import * as $ from 'jquery';
import { flightService } from '../providers/flightService';
import { C } from './../providers/constants';
import { OverlayEventDetail } from '@ionic/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

import { ValueGlobal } from '../providers/book-service';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
@Component({
  selector: 'app-flightmytrip',
  templateUrl: './flightmytrip.page.html',
  styleUrls: ['./flightmytrip.page.scss'],
})

export class FlightmytripPage {
    @ViewChild(IonContent) content: IonContent;
    tabflight = 1;
    hasloaddata = false;
    mytripcount: number;
    listMyTrips: any[];
    historytripcount: number;
    listHistoryTrips: any[];
    currentTrip: number;
    historytripcounttext: string;
    requestripcount: number;
    listRequestTrips: any[];
    hasloadRQdata: boolean;
    isRequestTrip: boolean;
    cinRQdisplay: string;
    coutRQdisplay: string;
    numberOfRQDay: number;
    numberOfDay: number;
    datecout: any;
    datecin: any;
    isFlyBooking: boolean;
    cindisplay: string;
    coutdisplay: string;
    cincombodeparturedisplay: string;
    cincomboarrivaldisplay: string;
    coutcombodeparturedisplay: string;
    coutcomboarrivaldisplay: string;
    textDeparture: string;
    textRegionDepart: any;
    textRegionReturn: any;
    textAirpotDepart: any;
    textAirpotReturn: any;
    textReturn: string;
    textArrivalRegionDepart: any;
    textArrivalRegionReturn: any;
    textAirpotArrivalDepart: any;
    textAirpotArrivalReturn: any;
    cincombodeparturelocationdisplay: any;
    cincombodepartureflightnumberdisplay: any;
    cincomboarrivallocationdisplay: any;
    cincomboarrivalflightnumberdisplay: any;
    departCodeDisplay: string;
    arrivalCodeDisplay: string;
    myloader: any;
    hasdata: boolean;
    nexttripcounttext: string;
    listAirport: any=[];
  loginuser: any;
  itemdepart: any;
  itemreturn: any;
  nextflightcounttext: string;
  accountNumber: string;
  bookingCode: string;
  total: string;
    constructor(private navCtrl: NavController, public gf: GlobalFunction,
        public _flightService: flightService,
        private modalCtrl: ModalController,
        private toastCtrl: ToastController,
        private zone: NgZone,
        private storage: Storage,
        public valueGlobal: ValueGlobal,
        private clipboard: Clipboard,public activityService: ActivityService) {
          $(".div-wraper-slide").removeClass("cls-visible").addClass("cls-disabled");
            this.storage.get('listmytrips').then(data => {
                if(data){
                  this.loadMytrip(data);
                }else{
                  this.getdata(null);
                }
              })

              if(this._flightService.listAirport){
                this.listAirport = this._flightService.listAirport;
              }else{
                this.storage.get("listAirport").then((data)=>{
                  if(!data){
                    this.loadLocation();
                  }else{
                    this.listAirport = data;
                    this._flightService.listAirport = data;
                  }
                })
              }

              
        }

        ngOnInit(){
          this._flightService.itemMenuFlightClick.subscribe(data => {
            if(data == 2){
              this.zone.run(()=>{
                this.storage.get('listmytrips').then(data => {
                  if(data){
                    this.loadMytrip(data);
                  }else{
                    this.getdata(null);
                  }
                })
              })
            }
              
            })

            this._flightService.itemFlightMytripRefresh.subscribe((data) =>{
                if(data){
                  this.getdata(null);
                }
            })
      }

      loadLocation(){
        var se = this;
       
        let urlPath = C.urls.baseUrl.urlFlight + "gate/apiv1/AllPlace?token=3b760e5dcf038878925b5613c32615ea3ds";
          let headers = {
            "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            'Content-Type': 'application/json; charset=utf-8'
          };
         
          this.gf.RequestApi('GET', urlPath, headers, {}, 'flightMytrip', 'loadLocation').then((data)=>{

            let result = data;
            if(result && result.length >0){
                se.zone.run(()=>{
                    se.listAirport = [...result];
                })
              
            }
        })
    }

      Selecttab(value){
        this.zone.run(()=>{
            this.tabflight = value;
        })
      }

      refreshData(){
        var se = this;
        se.listMyTrips = [];
        se.listHistoryTrips = [];
        se.hasloaddata = false;
        se.mytripcount = 0;
        se.historytripcount =0;
        se.nextflightcounttext = "";
        se.historytripcounttext = "";
        se.getdata(null);
      }

      getdata(token) {
        var se = this;
        se.storage.get('auth_token').then(auth_token => {
          se.loginuser = auth_token;
          if (auth_token || token) {
            var text = "Bearer " + (token ? token : auth_token);
            // var options = {
            //   method: 'GET',
            //   url: C.urls.baseUrl.urlMobile + '/api/dashboard/getmytrip?getall=true',
            //   //url: 'http://localhost:34290/api/dashboard/getmytrip?getall=true&memberid=91f60b04-328e-4e04-a603-cd49139e2c0c',
            //   headers:
            //   {
            //     'accept': 'application/json',
            //     'content-type': 'application/json-patch+json',
            //     authorization: text
            //   }
            // };
            let urlPath = C.urls.baseUrl.urlMobile + '/api/dashboard/getmytrip?getall=true';
            let headers = {
              'accept': 'application/json',
                  'content-type': 'application/json-patch+json',
                  authorization: text
            };
         
          this.gf.RequestApi('GET', urlPath, headers, {}, 'flightMytrip', 'getdata').then((data)=>{

              if(data.statusCode == 401){
                se.storage.get('jti').then((memberid) => {
                  se.storage.get('deviceToken').then((devicetoken) => {
                    if(devicetoken){
                      se.gf.refreshToken(memberid, devicetoken).then((token) =>{
                        setTimeout(()=>{
                          se.getdatanewtoken(token);
                        },100)
                        
                      });
                    }
                  })
                })
              }
              else {
                if (data) {
                  se.zone.run(() => {
                   
                    let lstTrips = data;
                    se.storage.get('listmytrips').then(data => {
                      if(data){
                        se.storage.remove('listmytrips').then(()=>{
                          se.storage.set('listmytrips', lstTrips);
                        })
                      }else{
                        se.storage.set('listmytrips', lstTrips);
                      }
                    })
                    se.loadMytrip(lstTrips);
                  });
                } else {
                  if (!data) {
                    se.listMyTrips = [];
                    se.listHistoryTrips = [];
                    se.hasloaddata = true;
                    se.mytripcount = 0;
                    se.historytripcount =0;
                    se.nextflightcounttext = "";
                    se.historytripcounttext = "";
                  }
                  else if(data.statusCode == 401){
                    se.storage.get('jti').then((memberid) => {
                      se.storage.get('deviceToken').then((devicetoken) => {
                        if(devicetoken){
                          se.gf.refreshToken(memberid, devicetoken).then((token) =>{
                            setTimeout(()=>{
                              se.getdatanewtoken(token);
                            },100)
                          });
                        }
                      })
                    })
                  }
                }
    
              }
    
            });
          } else {
            se.hasloaddata = true;
            se.listMyTrips = [];
            se.listHistoryTrips = [];
            se.mytripcount = 0;
            se.historytripcount =0;
            se.nextflightcounttext = "";
            se.historytripcounttext = "";
          }
        });
        setTimeout(() => {
          if (se.myloader) {
            se.myloader.dismiss();
          }
        }, 500)
      }

      getdatanewtoken(token) {
        var se = this;
          se.loginuser = token;
          console.log(token)
          if (token) {
            var text = "Bearer " + token;
            // var options = {
            //   method: 'GET',
            //   url: C.urls.baseUrl.urlMobile + '/api/dashboard/getmytrip?getall=true',
            //   headers:
            //   {
            //     'accept': 'application/json',
            //     'content-type': 'application/json-patch+json',
            //     authorization: text
            //   }
            // };
            let urlPath = C.urls.baseUrl.urlMobile + '/api/dashboard/getmytrip?getall=true';
            let headers = {
              'accept': 'application/json',
                  'content-type': 'application/json-patch+json',
                  authorization: text
            };
         
            this.gf.RequestApi('GET', urlPath, headers, {}, 'flightMytrip', 'getdata').then((data)=>{
                if (data) {
                  se.zone.run(() => {
                   
                    let lstTrips = data;
                    se.storage.get('listmytrips').then(data => {
                      if(data){
                        se.storage.remove('listmytrips').then(()=>{
                          se.storage.set('listmytrips', lstTrips);
                        })
                      }else{
                        se.storage.set('listmytrips', lstTrips);
                      }
                    })
                    se.loadMytrip(lstTrips);
                  });
                } else {
                    se.listMyTrips = [];
                    se.listHistoryTrips = [];
                    se.hasloaddata = true;
                    se.mytripcount = 0;
                    se.historytripcount =0;
                    se.nextflightcounttext = "";
                    se.historytripcounttext = "";
                }
    
              
    
            });
          } else {
            se.hasloaddata = true;
            se.listMyTrips = [];
            se.listHistoryTrips = [];
            se.mytripcount = 0;
            se.historytripcount =0;
            se.nextflightcounttext = "";
            se.historytripcounttext = "";
          }
        setTimeout(() => {
          if (se.myloader) {
            se.myloader.dismiss();
          }
        }, 500)
      }

      goback(){
          this.zone.run(()=>{
            this._flightService.itemMenuFlightClick.emit(1);
                this._flightService.itemTabFlightActive.emit(1);
          })
      }

      loadMytrip(listtrips){
        var se = this;
        se.storage.get('auth_token').then(auth_token => {
          se.loginuser = auth_token;
          if(auth_token){
            se.mytripcount = 0;
            se.listMyTrips = [];
            se.historytripcount = 0;
            se.listHistoryTrips = [];
            se.nextflightcounttext = "";
            se.historytripcounttext = "";
            
              let lstTrips = listtrips;
              //List trip sắp đi
              if (lstTrips.tripFuture && lstTrips.tripFuture.length > 0) {
                lstTrips.tripFuture.forEach(element => {
                  if(element.flight_ticket_info && element.flight_ticket_info.indexOf("VXR") != -1){
                    element.booking_type = "COMBO_VXR";
                  }
                  if (element.payment_status != 3 && element.payment_status != -2) {
                    //if (element.payment_status != 3) {
                    if (element.avatar) {
                      let urlavatar = element.avatar.substring(0, element.avatar.length - 4);
                      let tail = element.avatar.substring(element.avatar.length - 4, element.avatar.length);
                      element.avatar = urlavatar + "-" + "104x104" + tail;
                    }
                    if(element.booking_id.indexOf("FLY") != -1 || element.booking_id.indexOf("VMB") != -1){
                      element.totalpricedisplay = se.gf.convertNumberToString(element.amount_after_tax);
                      if(element.payment_status == 0 && element.delivery_payment_date){
                        let diffminutes = moment(new Date()).diff(moment(element.delivery_payment_date), 'minutes');
                        if(diffminutes <= 0){
                          let hours:any = Math.floor(diffminutes*(-1)/60);
                          let minutes:any = diffminutes*(-1) - (hours*60);
                          if(hours < 10){
                            hours = hours != 0?  "0"+hours : "0";
                          }
                          if(minutes < 10){
                            minutes = "0"+minutes;
                          }
                          element.delivery_payment_date_display = "Hạn thanh toán trước "+moment(element.delivery_payment_date).format("HH:mm") +" "+ se.gf.getDayOfWeek(element.delivery_payment_date).dayname +", "+ moment(element.delivery_payment_date).format("DD") + " thg " + moment(element.delivery_payment_date).format("MM") + ", " + moment(element.delivery_payment_date).format("YYYY");
                          //element.delivery_payment_date_display = "Vui lòng thanh toán trong vòng " + hours + 'h'+ minutes +"'";
                          if (!(element.pay_method==3||element.pay_method==51)) {
                            var obj=se.gf.getbank(element.pay_method);
                            element.urlimgbank =obj.urlimgbank;
                            element.textbank =obj.textbank;
                            element.accountNumber =obj.accountNumber;
                            element.bankName =obj.bankName;
                            element.url =obj.url;
                          } else if (element.pay_method==3) {
                            element.payment_info=JSON.parse(element.payment_info);
                            element.PaymentCode=element.payment_info.PaymentCode
                          }
                        }
                          
                      }
                      element.checkInDisplay = se.gf.getDayOfWeek(element.checkInDate).dayname +", "+ moment(element.checkInDate).format("DD") + " thg " + moment(element.checkInDate).format("MM");
                      element.checkOutDisplay = se.gf.getDayOfWeek(element.checkOutDate).dayname +", "+ moment(element.checkOutDate).format("DD") + " thg " + moment(element.checkOutDate).format("MM");
                      let departFlight = element.bookingsComboData.filter((f) => { return f.departureDate == element.checkInStr });
                      if(departFlight && departFlight.length >0){
                        element.itemdepart = departFlight[0];
                       
                      }else{
                        element.itemdepart = element.bookingsComboData[0];
                        
                      }
                      element.flightFrom = element.itemdepart.flightFrom;
                      element.flightTo = element.itemdepart.flightTo;
                      element.departAirport = se.getAirportByCode(element.itemdepart.departCode);
                      element.returnAirport = se.getAirportByCode(element.itemdepart.arrivalCode);
                      
                      se.textDeparture = se.getDayOfWeek(element.itemdepart.departureDate) + ', ' + element.itemdepart.departureDate;
                      se.textRegionDepart = se.getRegionByCode(element.itemdepart.departCode);
                      se.textRegionReturn = se.getRegionByCode(element.itemdepart.arrivalCode);
                      se.textAirpotDepart = se.getAirpot(element.itemdepart.departCode);
                      se.textAirpotReturn = se.getAirpot(element.itemdepart.arrivalCode);
                      
                      let idxlug =0;
                      element.bookingsComboData.forEach(el => {
                       
                        if(el.airlineName.indexOf('Vietnam Airlines') != -1 ){
                          //chặng dừng
                          if(el.flightNumner.indexOf(',') != -1){
                            let fnstring = el.flightNumner.split(',')[0].trim();
                            let fn = fnstring.substring(2, el.flightNumner.length)*1;
                            if(fn >= 6000){
                              el.operatedBy = "Khai thác bởi Pacific Airlines";
                            }
                          }else{//bay thẳng
                            let fn = el.flightNumner.substring(2, el.flightNumner.length)*1;
                            if(fn >= 6000){
                              el.operatedBy = "Khai thác bởi Pacific Airlines";
                            }
                          }
                          
                        }
                        
                          if(el.passengers && el.passengers.length >0){
                            for (let index = 0; index < el.passengers.length; index++) {
                              el.passengers[index].arrlug = [];
                            }
                            for (let index = 0; index < el.passengers.length; index++) {
                              const elementlug = el.passengers[index];
                              let departElementLug:any= null;
                              if(idxlug ==1){
                                departElementLug = element.bookingsComboData[idxlug-1].passengers;
                              }
                              
                              if(elementlug.hanhLy && elementlug.hanhLy.indexOf(':') == -1 && (elementlug.hanhLy.replace('kg',''))*1 >0){
                                if(idxlug ==1){
                                  if(departElementLug){
                                    let itemfilter = departElementLug.filter((l) => { return l.arrlug && l.name == elementlug.name});
                                    if(itemfilter && itemfilter.length >0){
                                      itemfilter[0].arrlug.push({lugname: el.departCode + " - " + el.arrivalCode , lugweight: elementlug.hanhLy, lugprice: elementlug.giaTienHanhLy, seatnumber: elementlug.seatNumber})
                                    }
                                    else{
                                      if(elementlug.seatNumber){
                                        itemfilter[0].arrlug.push({lugname: el.departCode + " - " + el.arrivalCode , lugweight: "", lugprice: 0, seatnumber: elementlug.seatNumber})
                                      }
                                    }
                                  }else{
                                    elementlug.arrlug.push({lugname: el.departCode + " - " + el.arrivalCode , lugweight: elementlug.hanhLy, lugprice: elementlug.giaTienHanhLy, seatnumber: elementlug.seatNumber})
                                  }
                                }else{
                                    if(elementlug.arrlug.length >0){
                                      let itemfilter = elementlug.arrlug.filter((l) => { return l.paxname == elementlug.name});
                                      if(itemfilter && itemfilter.length >0){
                                        itemfilter[0].arrlug.push({lugname: el.departCode + " - " + el.arrivalCode , lugweight: elementlug.hanhLy, lugprice: elementlug.giaTienHanhLy, seatnumber: elementlug.seatNumber})
                                      }
                                      else{
                                        if(elementlug.seatNumber){
                                          itemfilter[0].arrlug.push({lugname: el.departCode + " - " + el.arrivalCode , lugweight: "", lugprice: 0, seatnumber: elementlug.seatNumber})
                                        }
                                      }
                                  }else{
                                    elementlug.arrlug.push({lugname: el.departCode + " - " + el.arrivalCode , lugweight: elementlug.hanhLy, lugprice: elementlug.giaTienHanhLy, seatnumber: elementlug.seatNumber})
                                  }
                                }
                                
                              }
                            
                            }
                           
                          }
                          
                          idxlug++;
                      })

                      if(element.bookingsComboData.length >1){
                        let returnFlight = element.bookingsComboData.filter((f) => { return f.departureDate == element.checkOutStr });
                        if(returnFlight && returnFlight.length >0){
                          element.itemreturn = returnFlight[0];
                          
                        }else{
                          element.itemreturn = element.bookingsComboData[1];
                        
                        }
                          se.textReturn = se.getDayOfWeek(element.itemreturn.departureDate) + ', ' + element.itemreturn.departureDate;
                          se.textArrivalRegionDepart = se.getRegionByCode(element.itemreturn.departCode);
                          se.textArrivalRegionReturn = se.getRegionByCode(element.itemreturn.arrivalCode);
                          se.textAirpotArrivalDepart = se.getAirpot(element.itemreturn.departCode);
                          se.textAirpotArrivalReturn = se.getAirpot(element.itemreturn.arrivalCode);
                        
                      }
              
                      if(element.bookingsComboData && element.bookingsComboData[0].passengers && element.bookingsComboData[0].passengers.length >0){
                        element.adult =0;
                        element.child =0;
                        element.infant =0;

                        element.bookingsComboData[0].passengers.forEach( (elementlug, index) => {
                          let yearold = 18;
                          if(elementlug.dob){
                            let arr = elementlug.dob.split('/');
                            let newdob = new Date(arr[2], arr[1]-1, arr[0]);
                            yearold = moment(element.checkInDate).diff(moment(newdob), 'years');
                          }
                          
                          elementlug.isAdult = yearold > 12 ? true : false;
                          if(elementlug.isAdult){
                            element.adult += 1;
                          }else{
                              if(yearold< 2){
                                  element.infant += 1;
                                  elementlug.isInfant = true;
                              }else{
                                  element.child += 1;
                              }
                          }
              
                          if(elementlug.hanhLy && elementlug.hanhLy.length >0 && elementlug.hanhLy.indexOf(':') != -1){
                            elementlug.hanhLy = elementlug.hanhLy.replace(/\n/ig, ':');
                            let arrlug = elementlug.hanhLy.split(':');
                            elementlug.arrlug = [];
                            if(arrlug && arrlug.length >0){
                              let idx =0;
                              arrlug.forEach(lug => {
                                if(idx >0){
                                  let arrlugname = lug;
                                  if(arrlugname.length > 4){
                                    arrlugname = arrlugname.substring(0,4);
                                  }
                                  let lugweight = arrlugname.substring(0,2);
                                  if(idx == 1 && lugweight >0){
                                    elementlug.arrlug.push({lugname: element.bookingsComboData[0].departCode + " - " + element.bookingsComboData[0].arrivalCode , lugweight: arrlugname});
                                  }
                                  else if(idx == 3 && lugweight >0){
                                    elementlug.arrlug.push({lugname: element.bookingsComboData[0].arrivalCode + " - " + element.bookingsComboData[0].departCode, lugweight: arrlugname});
                                  }
                                  // else if(element.bookingsComboData.length >1 && idx == 2){
                                  //   elementlug.arrlug.push({lugname: element.bookingsComboData[1].departCode + " - " + element.bookingsComboData[1].arrivalCode, lugweight: arrlugname});
                                  // }
                                  
                                }
                                
                                idx++;
                              });
                            }
                          }

                        });
                      }
                    }
                    if(element.delivery_payment_date){
                      let arrpaymentdate = element.delivery_payment_date.split(" ");
                      let hour ='',day='';
                      let arrday;
                      if(arrpaymentdate && arrpaymentdate.length >1){
                        let arrhour = arrpaymentdate[1].substring(0,5).split(":");
                        if(arrhour && arrhour.length>0){
                          hour = arrhour[0].toString() + "h" + arrhour[1].toString();
                        }
                          arrday = arrpaymentdate[0].split('-');
                        if(arrday && arrday.length>0){
                          day = arrday[2].toString()+"-"+arrday[1].toString();
                        }
                      }
                      element.deliveryPaymentDisplay = "Trước " +hour + ", " + day;
                      let arrhours = arrpaymentdate[1].split(":");
                      let today = new Date();
                      let d = new Date(Number(arrday[0]), Number(arrday[1])-1, Number(arrday[2]),Number(arrhours[0]),Number(arrhours[1]),Number(arrhours[2]));
                      let diffminutes = moment(d).diff(today, 'minutes');
                      //Quá hạn thanh toán thì không hiển thị thông tin thanh toán
                      if(diffminutes <0){
                        element.deliveryPaymentDisplay = "";
                      }
                      let hours = Math.round(diffminutes/60);
                      let minutes = diffminutes - (hours * 60);
                      element.paymentBefore = hours +"h"+minutes+"'";
                      if(element.extra_guest_info){
                        let arrpax = element.extra_guest_info.split('|');
                        if(arrpax && arrpax.length >1 && arrpax[1] >0){
                          element.paxDisplay = arrpax[0].toString() + " người lớn, " + arrpax[1].toString()+" trẻ em";
                        }else if(arrpax && arrpax.length >1 && arrpax[1] == 0){
                          element.paxDisplay = arrpax[0].toString() + " người lớn";
                        }
                      }
                      if(element.amount_after_tax){
                        element.priceShow = element.amount_after_tax.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
                      }
                    }
                    element.isRequestTrip = false;
    
                    
                      
    
                    if(element.booking_id.indexOf("FLY") != -1 || element.booking_id.indexOf("VMB") != -1){
                        se.listMyTrips.push(element);
                        se.mytripcount++;
                        se.nextflightcounttext ="(" + se.mytripcount +")";
                    }
                  
                  }
                });
              }
              //List trip đã đi
              if (lstTrips.tripHistory && lstTrips.tripHistory.length > 0) {
                lstTrips.tripHistory.forEach(elementHis => {
                  if (elementHis.avatar) {
                    let urlavatar = elementHis.avatar.substring(0, elementHis.avatar.length - 4);
                    let tail = elementHis.avatar.substring(elementHis.avatar.length - 4, elementHis.avatar.length);
                    elementHis.avatar157 = urlavatar + "-" + "104x157" + tail;
                    elementHis.avatar104 = urlavatar + "-" + "104x104" + tail;
                    elementHis.avatar110 = urlavatar + "-" + "110x118" + tail;
                  } else {
                    elementHis.avatar110 = "//cdn1.ivivu.com/iVivu/2018/02/07/15/noimage-110x118.jpg";
                  }
        
                  if(elementHis.booking_id.indexOf("FLY") != -1 || elementHis.booking_id.indexOf("VMB") != -1){
                    elementHis.checkInDisplay = se.gf.getDayOfWeek(elementHis.checkInDate).dayname +", "+ moment(elementHis.checkInDate).format("DD") + " thg " + moment(elementHis.checkInDate).format("MM");
                    elementHis.checkOutDisplay = se.gf.getDayOfWeek(elementHis.checkOutDate).dayname +", "+ moment(elementHis.checkOutDate).format("DD") + " thg " + moment(elementHis.checkOutDate).format("MM");
                    elementHis.flightFrom = elementHis.bookingsComboData[0].flightFrom;
                    elementHis.flightTo = elementHis.bookingsComboData[0].flightTo;
                    elementHis.departAirport = se.getAirportByCode(elementHis.bookingsComboData[0].departCode);
                    elementHis.returnAirport = se.getAirportByCode(elementHis.bookingsComboData[0].arrivalCode);
                    elementHis.roundTrip = elementHis.bookingsComboData.length > 1 ? true : false;
    
                    if(elementHis.bookingsComboData && elementHis.bookingsComboData[0].passengers && elementHis.bookingsComboData[0].passengers.length >0){
                      elementHis.bookingsComboData[0].passengers.forEach( (elementHisLug, index) => {
                        let yearold = 18;
                        if(elementHisLug.dob){
                          let arr = elementHisLug.dob.split('/');
                          let newdate = new Date(arr[2], arr[1], arr[0]);
                          yearold = moment(new Date()).diff(moment(newdate), 'years');
                        }
                        
                        elementHisLug.isAdult = yearold > 12 ? true : false;
            
                        if(elementHisLug.hanhLy && elementHisLug.hanhLy.length >0){
                          let arrlug = elementHisLug.hanhLy.split(':');
                          elementHisLug.arrlug = [];
                          if(arrlug && arrlug.length >0){
                            let idx =0;
                            arrlug.forEach(lug => {
                              if(idx >0){
                                let arrlugname = lug;
                                if(arrlugname.length > 4){
                                  arrlugname = arrlugname.substring(0,4);
                                }
                                if(idx == 1){
                                  elementHisLug.arrlug.push({lugname: elementHis.bookingsComboData[0].flightFrom + " - " + elementHis.bookingsComboData[0].flightTo , lugweight: arrlugname});
                                }
                                else if(elementHis.bookingsComboData.length >1 && idx == 2){
                                  elementHisLug.arrlug.push({lugname: elementHis.bookingsComboData[1].flightFrom + " - " + elementHis.bookingsComboData[1].flightTo, lugweight: arrlugname});
                                }
                                
                              }
                              
                              idx++;
                            });
                          }
                        }
                      });
                    }
    
                    se.listHistoryTrips.push(elementHis);
                    se.historytripcount++;
                    }
              
                });
        
                se.historytripcounttext = " (" + se.historytripcount + ")";
              }
         
            se.sortMytrip();
            se.hasloaddata = true;
            se.currentTrip = 0;
            if(se.listMyTrips && se.listMyTrips.length >0){
              se.hasdata = true;
              let firstitem = se.listMyTrips[0];
    
            //check xem có item vừa thanh toán thì focus theo item mới nhất
            if(se._flightService.bookingCodePayment){
              let itempayment = se.listMyTrips.filter((itemf) =>{ return itemf.booking_id == se._flightService.bookingCodePayment});
              if(itempayment && itempayment.length >0){
                se.setCheckInCheckOutInfo(itempayment[0]);
              }else{
                se.setCheckInCheckOutInfo(firstitem);
              }
              se._flightService.bookingCodePayment = "";
            }else{
              se.setCheckInCheckOutInfo(firstitem);
            }
              
            }
          }else{
            se.hasloaddata = true;
            se.listMyTrips = [];
            se.listHistoryTrips = [];
            se.mytripcount = 0;
            se.historytripcount =0;
            se.nextflightcounttext = "";
            se.historytripcounttext = "";
          }
        
      })
        
      }

        /**
         * Thực hiện sort theo checkin/startdate
         * Vì có 2 list mytrip và requesttrip nên sort lại đồng nhất theo date
         */
        sortMytrip() {
            var se = this;
            if (se.listMyTrips && se.listMyTrips.length > 0) {
            se.zone.run(() => se.listMyTrips.sort(function (a, b) {
                let direction = -1;
                if (!a['isRequestTrip'] && !b['isRequestTrip']) {
                if (moment(a['checkInDate']).diff(moment(b['checkInDate']), 'days') >0) {
                    return -1 * direction;
                }
                else {
                    return 1 * direction;
                }
                }
                else if (!a['isRequestTrip'] && b['isRequestTrip']) {
                if (moment(a['checkInDate']).diff(moment(b['start_date']), 'days') >0) {
                    return -1 * direction;
                }
                else {
                    return 1 * direction;
                }
                }
                else if (a['isRequestTrip'] && !b['isRequestTrip']) {
                if (moment(a['start_date']).diff(moment(b['checkInDate']), 'days') >0) {
                    return -1 * direction;
                }
                else {
                    return 1 * direction;
                }
                }else{
                if (moment(a['start_date']).diff(moment(b['start_date']), 'days') >0) {
                    return -1 * direction;
                }
                else {
                    return 1 * direction;
                }
                }
            }));
            }
        }

        setCheckInCheckOutInfo(obj){
            var se = this;
            se.isFlyBooking = (obj.booking_id.indexOf("FLY") != -1 || obj.booking_id.indexOf("VMB") != -1) ? true : false;
            se.datecin=new Date(obj.checkInDate);
            se.datecout=new Date(obj.checkOutDate);
            se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
            se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');
            if(obj.bookingsComboData){
                //se.valueGlobal.bookingsComboData=obj.bookingsComboData[0];
                se.cincombodeparturedisplay = moment(new Date(obj.bookingsComboData[0].departureDate)).format('DD-MM-YYYY');
                se.cincomboarrivaldisplay = moment(new Date(obj.bookingsComboData[0].arrivalDate)).format('DD-MM-YYYY');
                if(obj.bookingsComboData.length >1){
                    se.coutcombodeparturedisplay = moment(new Date(obj.bookingsComboData[1].departureDate)).format('DD-MM-YYYY');
                    se.coutcomboarrivaldisplay = moment(new Date(obj.bookingsComboData[1].arrivalDate)).format('DD-MM-YYYY');
                }
              
              
            }
            
            se.numberOfDay = moment(se.datecout).diff(moment(se.datecin),'days');
            //Set flight info nếu là combo
            if(obj.flight_ticket_info){
            
              let arrInfo = obj.flight_ticket_info.split("<br/>");
              if(arrInfo.length ==2){
                let arrFlightStart = arrInfo[0].split("|");
                let arrFlightReturn = arrInfo[1].split("|");
                se.cincombodeparturedisplay = arrFlightStart[0];
                se.cincombodeparturelocationdisplay = arrFlightStart[1];
                //se.cincombodeparturetimedisplay = arrFlightStart[2];
                se.cincombodepartureflightnumberdisplay = arrFlightStart[2];
        
                se.cincomboarrivaldisplay = arrFlightReturn[0];
                se.cincomboarrivallocationdisplay = arrFlightReturn[1];
                //se.cincomboarrivaltimedisplay = arrFlightReturn[2];
                se.cincomboarrivalflightnumberdisplay = arrFlightReturn[2];
              }
              else if(arrInfo.length >2){
                let arrFlightStart = arrInfo[0].split("|");
                let arrFlightReturn = arrInfo[1].split("|");
                se.cincombodeparturedisplay = arrFlightStart[0];
                se.cincombodeparturelocationdisplay = arrFlightStart[1];
                //se.cincombodeparturetimedisplay = arrFlightStart[2];
                se.cincombodepartureflightnumberdisplay = arrFlightStart[2];
        
                se.cincomboarrivaldisplay = arrFlightReturn[0];
                se.cincomboarrivallocationdisplay = arrFlightReturn[1];
                //se.cincomboarrivaltimedisplay = arrFlightReturn[2];
                se.cincomboarrivalflightnumberdisplay = arrFlightReturn[2];
              }
              if(obj.bookingsComboData && obj.bookingsComboData.length >2){
                obj.bookingsComboData = obj.bookingsComboData.slice(0,2);
              }
          
              if(obj.bookingsComboData && obj.bookingsComboData.length >1){
                se.departCodeDisplay =  obj.bookingsComboData[0].departCode + ' → ' + obj.bookingsComboData[0].arrivalCode;
                if(obj.bookingsComboData.length >1){
                  se.arrivalCodeDisplay = obj.bookingsComboData[1].departCode + ' → ' + obj.bookingsComboData[1].arrivalCode;
                }
              }
            }
          }
          
          setCheckInCheckOutRQInfo(obj){
            var se = this;
            var datecinRQ =new Date(obj.start_date);
            var datecoutRQ =new Date(obj.end_date);
            se.cinRQdisplay = moment(datecinRQ).format('DD-MM-YYYY');
            se.coutRQdisplay = moment(datecoutRQ).format('DD-MM-YYYY');
            
            se.numberOfRQDay = moment(datecoutRQ).diff(moment(datecinRQ),'days');
          }


          getDayOfWeek(day){
            let arrdate = day.split('/');
            let newdate = new Date(arrdate[2], arrdate[1], arrdate[0]);
            let cinthu = moment(newdate).format("dddd");
            switch (cinthu) {
              case "Monday":
                cinthu = "Thứ 2";
                break;
              case "Tuesday":
                cinthu = "Thứ 3";
                break;
              case "Wednesday":
                cinthu = "Thứ 4";
                break;
              case "Thursday":
                cinthu = "Thứ 5";
                break;
              case "Friday":
                cinthu = "Thứ 6";
                break;
              case "Saturday":
                cinthu = "Thứ 7";
                break;
              default:
                cinthu = "Chủ nhật";
                break;
            }
            return cinthu;
          }
        
          getAirpot(code){
            let itemairport = this._flightService.listAirport.filter((itemairport) => { return itemairport.code == code});
            return itemairport && itemairport.length >0 ? itemairport[0].airport : '';
            // let name = '';
            // switch (code) {
            //   case "SGN":
            //     name = "Sân bay Quốc tế Tân Sơn Nhất | "+ code;
            //     break;
            //   case "PQC":
            //     name = "Sân bay Quốc tế Phú Quốc | "+ code;
            //     break;
            //   case "DAD":
            //     name = "Sân bay Quốc tế Đà Nẵng | "+ code;
            //     break;
            //   case "HAN":
            //     name = "Sân bay Quốc tế Nội Bài | "+ code;
            //     break;
            //   case "VCA":
            //       name = "Sân bay Quốc tế Cần Thơ | "+ code;
            //     break;
            //   case "CXR":
            //       name = "Sân bay Quốc tế Cam Ranh | "+ code;
            //     break;
            //   case "VII":
            //     name = "Sân bay Quốc tế Vinh – Nghệ An | "+ code;
            //     break;
            //   case "HUI":
            //     name = "Sân bay Quốc tế Phú Bài – Huế | "+ code;
            //     break;
            //   case "VCL":
            //     name = "Sân bay Chu Lai Quảng Nam | "+ code;
            //     break;
            //   case "VCS":
            //     name = "Sân bay Côn Đảo | "+ code;
            //     break;
            //   case "BMV":
            //     name = "Sân bay Buôn Ma Thuột | "+ code;
            //     break;
            //   case "THD":
            //     name = "Sân bay Thọ Xuân – Thanh Hóa | "+ code;
            //     break;
            // }
            // return name;
          }
        
          getRegionByCode(code){
            let itemairport:any;
            if(this._flightService.listAirport && this._flightService.listAirport.length >0){
              itemairport = this._flightService.listAirport.filter((itemairport) => { return itemairport.code == code});
            }
            return itemairport && itemairport.length >0 ? itemairport[0].city : '';
            // switch (code) {
            //   case "SGN":
            //     name = "TP HCM";
            //     break;
            //   case "PQC":
            //     name = "Phú Quốc";
            //     break;
            //   case "DAD":
            //     name = "Đà Nẵng";
            //     break;
            //   case "HAN":
            //     name = "Hà Nội";
            //     break;
            //   case "VCA":
            //       name = "Cần Thơ";
            //     break;
            //   case "CXR":
            //       name = "Cam Ranh";
            //     break;
            //   case "VII":
            //       name = "Vinh – Nghệ An";
            //     break;
            //   case "HUI":
            //     name = "Huế";
            //     break;
            //   case "VCL":
            //     name = "Quảng Nam";
            //     break;
            //   case "VCS":
            //     name = "Bà Rịa-Vũng Tàu";
            //     break;
            //   case "BMV":
            //     name = "Đắk Lắk";
            //     break;
            //   case "THD":
            //     name = "Thanh Hóa";
            //     break;
            // }
            // return name;
          }

          nextTrip(){
            this.currentTrip = this.currentTrip +1;
           
            let obj = this.listMyTrips[this.currentTrip];
            if(!obj.isRequestTrip){
              this.setCheckInCheckOutInfo(obj);
              this.isRequestTrip = false;
            }else{
              this.setCheckInCheckOutRQInfo(obj);
              this.isRequestTrip = true;
            }
            
            this.content.scrollToTop(50);
            //google analytic
            this.gf.googleAnalytion('mytrips','Search','nexttrip');
          }
        
          previousTrip(){
            //this.presentLoading();
            this.currentTrip = this.currentTrip -1;
            let obj = this.listMyTrips[this.currentTrip];
            if(!obj.isRequestTrip){
              this.setCheckInCheckOutInfo(obj);
              this.isRequestTrip = false;
            }
            else{
              this.setCheckInCheckOutRQInfo(obj);
              this.isRequestTrip = true;
            }
            this.content.scrollToTop(50);
            //google analytic
            this.gf.googleAnalytion('mytrips','Search','previoustrip');
          }

        getAirportByCode(code){
          var se = this, res ="";
          if(se.listAirport && se.listAirport.length >0){
            let itemmap = se.listAirport.filter((item) => { return item.code == code});
            res = (itemmap && itemmap.length >0) ? itemmap[0].airport : ""; 
          } 
          return res;
        }

        gotologin(){
          this.valueGlobal.backValue = "flightmytrip";
          this.navCtrl.navigateForward('/login');
        }
        copyClipboard(type) {
          if (type == 1) {
            this.clipboard.copy(this.accountNumber);
          } else if (type == 2) {
            this.clipboard.copy("Người thụ hưởng: Công ty Cổ Phần IVIVU.COM");
          } else if (type == 3) {
            this.clipboard.copy(this.bookingCode);
          }
          else if (type == 4) {
            this.clipboard.copy(this.total);
          }
          this.presentToastr('Đã sao chép');
        }

        async presentToastr(msg) {
          let toast = await this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }

        gotoflightpaymentselect(itemflight){
            this._flightService.itemFlightCache = itemflight;
            this.navCtrl.navigateForward('/flightpaymentselect');
        }
        payment(trip){
          var se= this;
          se.navCtrl.navigateForward("/roompaymentlive/1");
        }
        paymentselect(trip)
        {
          this.activityService.objPaymentMytrip = { trip: trip };
          this.navCtrl.navigateForward("/mytripaymentflightselect");
        }
    }