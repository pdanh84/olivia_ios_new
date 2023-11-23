
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { ActivityService, GlobalFunction } from '../providers/globalfunction';
import { MytripService } from '../providers/mytrip-service.service';
import * as moment from 'moment';
import { ActionSheetController, IonRouterOutlet, NavController, ToastController, AlertController, LoadingController, IonContent, Platform, ModalController } from '@ionic/angular';
import { NetworkProvider } from '../network-provider.service';
import { SearchHotel, ValueGlobal } from '../providers/book-service';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { flightService } from '../providers/flightService';
import { C } from '../providers/constants';
import * as $ from 'jquery';
import { tourService } from '../providers/tourService';

import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { File, FileReader } from '@awesome-cordova-plugins/file/ngx';
import { FileTransferObject, FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { PhotoLibrary } from '@awesome-cordova-plugins/photo-library/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { MytripTicketQrcodeSlidePage } from '../mytripticketqrcodeslide/mytripticketqrcodeslide';

@Component({
  selector: 'app-mytripdetail',
  templateUrl: './mytripdetail.page.html',
  styleUrls: ['./mytripdetail.page.scss'],
})
export class MytripdetailPage implements OnInit {
  @ViewChild('scrollArea') scrollYArea: IonContent;
  trip: any;
  datecin: Date;
  datecout: Date;
  cindisplay: string;
  coutdisplay: string;
  enableheader = false;
  listClaimed: any = [];
  arrchild: any[] = [];
  arrchildinsurrance: any[] = [];
  cincomboarrivaldisplay: any;
  cincomboarrivallocationdisplay: any;
  cincomboarrivalflightnumberdisplay: any;
  cincombodeparturedisplay: any;
  cincombodeparturelocationdisplay: any;
  cincombodepartureflightnumberdisplay: any;
  arrinsurrance:any = [];
  departCodeDisplay: string;
  arrivalCodeDisplay: string;
  cincombodeparture: string;
  cincomboarrival: string;
  noLoginObj: any;
  childList: any;
  loader: any;
  expandDivIncludePrice: boolean;
  expandDivTourInfo: boolean;
  expandDivTourNotes: boolean;
  cin: any;
  cout: any;
  flightRoundTripStr: string = '';
  totalPaxStr: any = '';
  bookingjson: any;
  totalCost: number = 0;
  _inAppBrowser: any;

  dataSummaryBooking: any;
  expanddivcondition: boolean;
  expanddivrefund: boolean;
  loadsummarydone: boolean = false;
  listsdk = [1, 2, 3];
  departTicketInfo: any;
  returnTicketInfo: any;
  loadingdepartdetailticket: boolean = false;
  loadingreturndetailticket: boolean = false;
  listpolicy:any = [];
  hasreturnpolicy: boolean;
  hasdepartpolicy: boolean;
  baggageHandedDepart; baggageHandedReturn; totalVMB = 0;
  totalService: number;
  luggageSignedDepart: any;
  departConditionInfo: any;
  returnConditionInfo: any;
  luggageSignedReturn: any;
  isdkv = false;
  ishdnp = false;
  isptp = false;
  isttt = false;
  booking_json_data: any;
  ischeckStops = false;
  departAirport: any;
  returnAirport: any;
  totalDichung = 0;
  coutDC: number;
  PromotionNote: any;
  HotelPolicies: any;
  totalHotel: any;
  amount_after_tax: any;
  qrcodeurl: any;
  departTicketInfoCRM: any;
  returnTicketInfoCRM: any;
  _departTicketInfoCRM: any;
  _returnTicketInfoCRM: any;
  objectDetail: any;
  ticketDownloadFiles: any=[];
  ischeckqrLink: boolean;
  listQrLink: any=[];
  includePrice: any;
  objSummary: any;
  ticketChangeLocation: any;
  showIncludeContent: string;
  expandPrice: boolean;
  isTTV: boolean;
  constructor(public _mytripservice: MytripService,
    public gf: GlobalFunction,
    private navCtrl: NavController,
    public networkProvider: NetworkProvider,
    public searchhotel: SearchHotel,
    public valueGlobal: ValueGlobal,
    public activityService: ActivityService,
    private clipboard: Clipboard,
    private toastCtrl: ToastController,
    public _flightService: flightService,
    private routerOutlet: IonRouterOutlet,
    private actionsheetCtrl: ActionSheetController, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    public _tourService: tourService, public zone: NgZone,
    private iab: InAppBrowser,
    private transfer: FileTransfer,
    private photoLibrary: PhotoLibrary,
    private file: File,
    public platform: Platform, private socialSharing: SocialSharing,
    private modalCtrl: ModalController
  ) {
    if (this._mytripservice.tripdetail) {
      this.trip = this._mytripservice.tripdetail;
      // this.getmhoteldetail();
      if (this.trip.isBookingVMBQT && this.trip.isTravelPort) {
        this.getSummaryBooking();
         //pdanh 12-07-2023: Sửa lỗi sync thông tin, điều kiện vé update dưới CRM
            //Nếu có cập nhật từ CRM thì ưu tiên show thông tin update dưới CRM( 'ticketConditions' trong object 'bookingJsonDataParse')
            if(this.trip.bookingJsonDataParse[0] && this.trip.bookingJsonDataParse[0].ticketConditions){
              this.departTicketInfoCRM = this.trip.bookingJsonDataParse[0].ticketConditions;
            }
            if(this.trip.bookingJsonDataParse[1] && this.trip.bookingJsonDataParse[1].ticketConditions){
              this.returnTicketInfoCRM = this.trip.bookingJsonDataParse[1].ticketConditions;
            }
      }
      if (this.trip.off_hotel_paypolicy && this.trip.off_hotel_paypolicy.indexOf('\r\n')) {
        let arrpolicy = this.trip.off_hotel_paypolicy.split('\r\n');
        arrpolicy.forEach(element => {
          if (element && element.toLowerCase().indexOf('đổi chiều đi') != -1) {
            this.hasdepartpolicy = true;
            this.listpolicy.push({ type: 1, name: element.replace('-', ''), isdepart: true, typePolicy:1});//1- đổi vé; 2- hủy vé 
          } else if (element && element.toLowerCase().indexOf('đổi chiều về') != -1) {
            this.hasreturnpolicy = true;
            this.listpolicy.push({ type: 1, name: element.replace('-', ''), isdepart: false, typePolicy:1 });
          }
          else if (element && element.toLowerCase().indexOf('hủy chiều đi') != -1) {
            this.hasdepartpolicy = true;
            this.listpolicy.push({ type: 2, name: element.replace('-', ''), isdepart: true, typePolicy:2 });
          } else if (element && element.toLowerCase().indexOf('hủy chiều về') != -1) {
            this.hasreturnpolicy = true;
            this.listpolicy.push({ type: 2, name: element.replace('-', ''), isdepart: false, typePolicy:2 });
          }
        });
      }
      if (this.trip.booking_json_data) {
        //console.log(JSON.parse(this.trip.booking_json_data));
        let curdate = new Date(this.trip.checkInDate);
        let _timezone = curdate.getTimezoneOffset();
        this.bookingjson = JSON.parse(this.trip.booking_json_data);
        if (this.bookingjson && this.bookingjson.length > 0) {
          this.bookingjson.forEach((elementbkg,idx) => {
            if (elementbkg && elementbkg.Transits) {
              this.totalCost += elementbkg.TotalCost * 1;

              for (let index = 0; index < elementbkg.Transits.length; index++) {
                const element = elementbkg.Transits[index];
                let cin = moment(new Date(element.DepartTime.replace('/Date(', '').replace(')/', '') * 1)).format('YYYY-MM-DD');
                if(this.trip.bookingJsonDataParse && this.trip.bookingJsonDataParse[idx] && this.trip.bookingJsonDataParse[idx].transits[index] && this.trip.bookingJsonDataParse[idx].transits[index].departTimeParse){
                  element.DepartTimeDisplay = moment(this.trip.bookingJsonDataParse[idx].transits[index].departTimeParse).format('HH:mm');
                  let _d = this.trip.bookingJsonDataParse[idx].transits[index].departTimeParse;
                  element.DepartDayDisplay = moment(_d).format('DD')+ "Thg " + moment(_d).format('MM');
                  if(element.LandingTime){
                    element.LandingTimeDisplay = moment(this.trip.bookingJsonDataParse[idx].transits[index].landingTimeParse).format('HH:mm');
                    let _dr = this.trip.bookingJsonDataParse[idx].transits[index].landingTimeParse;
                    element.LandingDayDisplay = moment(_dr).format('DD')+ "Thg " + moment(_dr).format('MM');
                  }
                  cin = moment(_d).format('YYYY-MM-DD');
                } else if (_timezone != -420) {
                    element.DepartTimeDisplay = moment(new Date(element.DepartTime.replace('/Date(', '').replace(')/', '') * 1 + _timezone * 60000 + 25200000)).format('HH:mm');
                    element.LandingTimeDisplay = moment(new Date(element.LandingTime.replace('/Date(', '').replace(')/', '') * 1 + _timezone * 60000 + 25200000)).format('HH:mm');

                    element.DepartDayDisplay = moment(new Date(element.DepartTime.replace('/Date(', '').replace(')/', '') * 1 + _timezone * 60000 + 25200000)).format('DD') + "Thg " + moment(new Date(element.DepartTime.replace('/Date(', '').replace(')/', '') * 1 + _timezone * 60000 + 25200000)).format('MM');
                    element.LandingDayDisplay = moment(new Date(element.LandingTime.replace('/Date(', '').replace(')/', '') * 1 + _timezone * 60000 + 25200000)).format('DD') + "Thg " + moment(new Date(element.LandingTime.replace('/Date(', '').replace(')/', '') * 1 + _timezone * 60000 + 25200000)).format('MM');
                    cin = moment(new Date(element.DepartTime.replace('/Date(', '').replace(')/', '') * 1 + _timezone * 60000 + 25200000)).format('YYYY-MM-DD');

                  } else {
                    element.DepartTimeDisplay = moment(new Date(element.DepartTime.replace('/Date(', '').replace(')/', '') * 1)).format('HH:mm');
                    element.LandingTimeDisplay = moment(new Date(element.LandingTime.replace('/Date(', '').replace(')/', '') * 1)).format('HH:mm');

                    element.DepartDayDisplay = moment(new Date(element.DepartTime.replace('/Date(', '').replace(')/', '') * 1)).format('DD') + "Thg " + moment(new Date(element.DepartTime.replace('/Date(', '').replace(')/', '') * 1)).format('MM');
                    element.LandingDayDisplay = moment(new Date(element.LandingTime.replace('/Date(', '').replace(')/', '') * 1)).format('DD') + "Thg " + moment(new Date(element.LandingTime.replace('/Date(', '').replace(')/', '') * 1)).format('MM');

                  }
                
                element.departAirport = this.getAirportByCode(element.FromPlaceCode);
                element.landingAirport = this.getAirportByCode(element.ToPlaceCode);
                // let cin = moment(new Date(element.DepartTime.replace('/Date(','').replace(')/','')*1)).format('YYYY-MM-DD');
                element.cindisplay = this.gf.getDayOfWeek(cin).dayname + ", " + moment(cin).format('DD') + "Thg " + moment(cin).format('MM');

                let elementNext = elementbkg.Transits[index + 1];
                if (elementNext) {

                  let dt = elementNext.DepartTime.replace('/Date(', '').replace(')/', '') * 1;
                  let lt = element.LandingTime.replace('/Date(', '').replace(')/', '') * 1;
                  let diffminutes = moment(dt).diff(lt, 'minutes');
                  if (diffminutes) {
                    let hours: any = Math.floor(diffminutes / 60);
                    let minutes: any = diffminutes - (hours * 60);
                    if (hours < 10) {
                      hours = hours != 0 ? "0" + hours : "0";
                    }
                    if (minutes < 10) {
                      minutes = "0" + minutes;
                    }
                    element.timeOverlay = hours + ' tiếng ' + minutes + ' phút';
                  }
                }
              }
            }
          });

        }
        this.flightRoundTripStr = 'Vé máy bay ' + (this.bookingjson.length > 1 ? 'khứ hồi' : 'một chiều');
        if (this.trip.totalPaxStr) {
          this.totalPaxStr = this.trip.totalPaxStr.replace(' |', ',');
        }
      }

      this.enableheader = true;
      this.loadDetailInfo();

      if (this.trip.booking_type && this.trip.booking_type == "TOUR") {
        this.getBookingTourDetail(this.trip);
      }
      
      else if (this.trip.booking_type && (this.trip.booking_type == "TICKET" || this.trip.booking_type == "VC")){
        if ((this.trip.payment_status == 1 || this.trip.payment_status == 5) && this.trip.approve_date){
          this.gf.showLoading();
          this.gf.ticketGetBookingCRM(this.trip.booking_id).then((data) => {
              this.objectDetail=data.response;
            if(this.objectDetail && this.objectDetail.startDate){
              let arrcd = this.objectDetail.startDate.split('-');
              let nd = new Date(arrcd[0], arrcd[1] - 1, arrcd[2]);
              this.objectDetail.startDateShow = moment(nd).format('DD-MM-YYYY');
            }
            if(this.objectDetail && this.objectDetail.fileUrls && this.objectDetail.fileUrls.length >0){
              this.objectDetail.fileUrls.forEach(element => {
                if(element.indexOf('&') != -1){
                  let _arrsplit = element.split('&');
                  if(_arrsplit && _arrsplit.length >0 && _arrsplit[1]){
                    let _fname = _arrsplit[1].split('=');
                    this.ticketDownloadFiles.push({name: _fname[1] || '', url: element});
                  }
                }else{
                  this.ticketDownloadFiles.push({name: element, url: element });
                }
               
              });
              
            }
           
            var objmap;
            if (this.objectDetail.listNotes) {
              objmap = this.objectDetail.listNotes.filter((item) => item.qrLink);
            }
          
            if(objmap && objmap.length >0){
              this.ischeckqrLink=true;
              this.listQrLink = objmap.map(item => {
                return {'qrlink': item.qrLink}
              });
            }else{
     
                this.GetVoucherLinks(this.trip.booking_id).then((data) => {
                  this.trip.listVoucher=data;
             
                  if (Array.isArray(this.trip.listVoucher)) {
                    for (let index = 0; index < this.trip.listVoucher.length; index++) {
                      const result = this.trip.listVoucher[index].split("filename=");
                      var objlink= {
                        filename:result[1],
                        link:this.trip.listVoucher[index]='https://beta-vvcapi.ivivu.com/'+this.trip.listVoucher[index]
                      }
                      this.trip.listVoucher[index]=objlink;
                    }
                  }else{
                    this.trip.listVoucher = [];
                  }
               
                
                })
              
            
              
            }
            this.gf.hideLoading();
           
          });
        }
        this.gf.RequestApi('GET', C.urls.baseUrl.urlTicket + '/api/Booking/Summary/' + this.trip.booking_id , {}, {}, '', '').then((data) => {
          if (data && data.success) {
            this.includePrice = data.data.booking.includePrice.split('|');
            this.includePrice = "<p>" + this.includePrice[0] + " | " + this.includePrice[1] + "</p>" + this.includePrice[2] + this.includePrice[3];
            this.objSummary=data.data.booking;
            if(this.objSummary && this.objSummary.supplement){
              console.log(JSON.parse(this.objSummary.supplement));
              let _objSup = JSON.parse(this.objSummary.supplement);
                if(_objSup && _objSup.traffic && _objSup.traffic.car && _objSup.traffic.car.s_location && this.objSummary.expeName.indexOf('Vé') != -1){
                    //this.ticketChangeLocation = _objSup.traffic.car.s_location;
                    let id = _objSup.traffic.car.s_location;
                      if(data.data && data.data.kkdayResource && data.data.kkdayResource.data && data.data.kkdayResource.data.length >0){
                        let _objlocationmap = data.data.kkdayResource.data.filter((f) => {return f.name == 's_location'});
                        if(_objlocationmap && _objlocationmap.length >0){
                          if(_objlocationmap[0] && _objlocationmap[0].dataRaw && _objlocationmap[0].dataRaw.length >0){
                              let _location = _objlocationmap[0].dataRaw.filter((l) => {return l.id == id});
                              if(_location && _location.length >0){
                                this.ticketChangeLocation = _location[0].name;
                              }
                          }
                        }
                      }
                }
            }
            this.showIncludeContent ='';
            if(this.objSummary && this.objSummary.includePrice){
              let arr = this.objSummary.includePrice.split('|');
              console.log(arr);
              if(arr && arr.length >0 && arr[4]){
                this.showIncludeContent = arr[4];
              }
            }
          }
        });
      }
      
      if (this.trip.child_ages) {
        let countstring = this.trip.child_ages.match(/tuổi/g || []).length;
        let inputstr = this.trip.child_ages;
        for (let index = 0; index < countstring; index++) {
          inputstr = inputstr.replace('tuổi', 't');
        }
        this.trip.childAgesDisplay = inputstr;
      }

      if (this.trip.isFlyBooking) {
        this.getDetailTicketFromDat(0).then((data) => {
          if (this.trip.textReturn && this.trip.bookingsComboData[1].airlineCode && this.trip.bookingsComboData[1].airlineName.toLowerCase().indexOf('cathay') == -1 && ['GO', 'RETURN', 'GOROUNDTRIP', 'RETURNROUNDTRIP'].indexOf(this.trip.bookingsComboData[1].trip_Code) == -1) {
            this.getDetailTicketFromDat(1).then((data) => {
              this.loadDetailInfo();
              this.getmhoteldetail();
            })
          } else {
            this.loadDetailInfo();
          }
        })
      } else {
        if (this.trip.booking_type == 'COMBO_FLIGHT') {
          this.departAirport = this.getAirportByCode(this.trip.bookingsComboData[0].departCode);
          this.returnAirport = this.getAirportByCode(this.trip.bookingsComboData[1].departCode);
          this.getDetailTicketFromDat(0).then((data) => {
            if (this.trip.bookingsComboData[1].airlineCode && this.trip.bookingsComboData[1].airlineName.toLowerCase().indexOf('cathay') == -1 && ['GO', 'RETURN', 'GOROUNDTRIP', 'RETURNROUNDTRIP'].indexOf(this.trip.bookingsComboData[1].trip_Code) == -1) {
              this.getDetailTicketFromDat(1).then((data) => {
                this.loadDetailInfo();
                this.getmhoteldetail();
              })
            }
          })
        } else {
          this.loadDetailInfo();
          this.getmhoteldetail();
        }
      }
      this.routerOutlet.swipeGesture = false;
      if (!(this.trip.pay_method == 3 || this.trip.pay_method == 51 || this.trip.pay_method == 2)) {
        this.buildLinkQrCode();
      }

      //parse obj flight_ticket_info để lấy flightDuration
      if(this.trip.flight_ticket_info){
          
        let _finfo = this.trip.flight_ticket_info.split('|');
        if(_finfo && _finfo.length >0){
          if(_finfo[0]){
            let _arr = _finfo[0].trimEnd().split(' ');
            if(_arr && _arr.length >0){
              let _lastitem = _arr[_arr.length -1];
              if(_lastitem && this.trip.itemdepart){
                 let _arrItem = _lastitem.split('(');
                 this.trip.itemdepart.flightDuration = _arrItem[_arrItem.length -1].replace(")",'');
                 let hours:any = Math.floor(this.trip.itemdepart.flightDuration/60);
                 let minutes:any = this.trip.itemdepart.flightDuration*1 - (hours*60);
                 if(hours < 10){
                   hours = hours != 0?  "0"+hours : "0";
                 }
                 if(minutes < 10){
                   minutes = "0"+minutes;
                 }
                 this.trip.itemdepart.flightTimeDisplay = hours+"h"+minutes+"p";
              }
            }
            
          }

          if(_finfo[1]){
            let _arr = _finfo[1].trimStart().split(' ');
            if(_arr && _arr.length >0){
              let _lastitem = _arr[_arr.length -1];
              if(_lastitem && this.trip.itemreturn){
                 let _arrItem = _lastitem.split('(');
                 this.trip.itemreturn.flightDuration = _arrItem[_arrItem.length -1].replace(")",'');
                 let hours:any = Math.floor(this.trip.itemreturn.flightDuration/60);
                 let minutes:any = this.trip.itemreturn.flightDuration*1 - (hours*60);
                 if(hours < 10){
                   hours = hours != 0?  "0"+hours : "0";
                 }
                 if(minutes < 10){
                   minutes = "0"+minutes;
                 }
                 this.trip.itemreturn.flightTimeDisplay = hours+"h"+minutes+"p";
              }
            }
            
          }
        }
      }

      this.trip.isRoundTrip = this.trip.itemdepart && this.trip.itemreturn ? true : false;
      if(this.trip.itemdepart){
        this.trip.itemdepart.allowChangeFlight = this.trip.itemdepart.airlineName.toLowerCase().indexOf('vietnam airline') == -1;
      }
      if(this.trip.itemreturn){
        this.trip.itemreturn.allowChangeFlight = this.trip.itemreturn.airlineName.toLowerCase().indexOf('vietnam airline') == -1;
      }
    }
  }
  ionViewWillEnter() {
    this.expandDivIncludePrice = false;
    this.expandDivTourInfo = false;
    this.expandDivTourNotes = false;
  }
  loadDetailInfo() {
    let se = this;
    se.datecin = new Date(this.gf.getCinIsoDate(this.trip.checkInDate ? this.trip.checkInDate : this.trip.start_date));
    se.datecout = new Date(this.gf.getCinIsoDate(this.trip.checkOutDate ? this.trip.checkOutDate : this.trip.end_date));
    se.cindisplay = se.gf.getDayOfWeek(se.datecin).dayname + ", " + moment(se.datecin).format('DD') + "Thg " + moment(se.datecin).format('MM');
    se.coutdisplay = se.gf.getDayOfWeek(se.datecout).dayname + ", " + moment(se.datecout).format('DD') + "Thg " + moment(se.datecout).format('MM');

    if (this.trip.bookingsComboData && this.trip.bookingsComboData.length > 0) {
      this.trip.bookingsComboData.forEach(element => {
        if (element.trip_Code == "GO" || element.trip_Code == "RETURN" || element.trip_Code == "GOROUNDTRIP" || element.trip_Code == "RETURNROUNDTRIP") {

          if (element.departureDate) {
            let newdate = element.departureDate.split('/');
            if (newdate && newdate.length > 1) {
              element.departureDateDisplay = newdate[0] + "." + newdate[1];
            }

          }

        }

        if (element.airlineName.toLowerCase().indexOf('cathay') != -1) {
          //Add bảo hiểm
          se.getCathayClaimInfo(se.trip.booking_id).then((data) => {

            var claimed;
            let objData = data;
            if (objData.insurObj && objData.insurObj.adultList) {
              let dataCathay = objData.insurObj;
              se.arrinsurrance = [];
              dataCathay.adultList.forEach(objAdult => {
                if (!objAdult.claimedFlights) {
                  let itemAdult = { claimed: objAdult.claimedFlights, insurance_code: objAdult.insurance_code, customer_name: objAdult.customer_name, customer_id: objAdult.customer_cmnd, customer_address: '', customer_dob: objAdult.customer_dob };
                  se.arrinsurrance.push(itemAdult);
                } else {
                  objAdult.flightObj.forEach((f) => {
                    var objmap = objAdult.claimedFlights.filter((cf) => f.flightNumner && cf == f.flightNumner.replace(' ', ''));
                    if (objmap && objmap.length > 0) {
                      se.listClaimed.push({ flight_number: objmap[0], insurance_code: objAdult.insurance_code, bookingid: objAdult.booking_id });
                    }
                  });
                  var claimedDone;
                  if (objData.flightObj[1].airlineCode) {
                    claimedDone = objAdult.claimedFlights.filter((cf, i, arr) => { return arr.indexOf(arr.find(t => t === cf)) === i }).length > 1;
                  }
                  else {
                    claimedDone = objAdult.claimedFlights.filter((cf, i, arr) => { return arr.indexOf(arr.find(t => t === cf)) === i }).length > 0;
                  }
                  let itemAdult = { claimed: claimedDone, insurance_code: objAdult.insurance_code, customer_name: objAdult.customer_name, customer_id: objAdult.customer_cmnd, customer_address: '', customer_dob: objAdult.customer_dob };
                  se.arrinsurrance.push(itemAdult);
                }
              });
              se.arrchildinsurrance=[];
              dataCathay.childList.forEach(objChild => {
                if (!objChild.claimedFlights) {
                  let itemChild = {
                    claimed: objChild.claimedFlights, insurance_code: objChild.insurance_code, customer_name: objChild.customer_name, customer_id: objChild.customer_cmnd, customer_address: '', customer_dob: objChild.customer_dob,
                    name: objChild.customer_name, id: objChild.insurance_code, birth: objChild.customer_dob
                  };
                  se.arrchildinsurrance.push(itemChild);
                  se.arrchild.push(itemChild);
                } else {
                  objChild.flightObj.forEach((f) => {
                    var objmap = objChild.claimedFlights.filter((cf) => f.flightNumner && cf == f.flightNumner.replace(' ', ''));
                    if (objmap && objmap.length > 0) {
                      se.listClaimed.push({ flight_number: objmap[0], insurance_code: objChild.insurance_code, bookingid: objChild.booking_id });
                    }
                  });

                  var claimedDone
                  if (objData.flightObj[1].airlineCode) {
                    claimedDone = objChild.claimedFlights.filter((cf, i, arr) => { return arr.indexOf(arr.find(t => t === cf)) === i }).length > 1;
                  } else {
                    claimedDone = objChild.claimedFlights.filter((cf, i, arr) => { return arr.indexOf(arr.find(t => t === cf)) === i }).length > 0;
                  }
                  let itemChild = {
                    claimed: claimedDone, insurance_code: objChild.insurance_code, customer_name: objChild.customer_name, customer_id: objChild.customer_cmnd, customer_address: '', customer_dob: objChild.customer_dob,
                    name: objChild.customer_name, id: objChild.insurance_code, birth: objChild.customer_dob
                  };
                  se.arrchildinsurrance.push(itemChild);
                  se.arrchild.push(itemChild);
                }
                //check cathay VMB
                if (se.trip.itemdepart && se.arrinsurrance.length > 0) {
                  se.trip.itemdepart.passengers.forEach((item) => {
                    for (let i = 0; i < se.arrinsurrance.length; i++) {
                      if (item.name.toLowerCase().trim() == se.arrinsurrance[i].customer_name.toLowerCase().trim()) {
                        item.claimed = se.arrinsurrance[i].claimed;
                        break;
                      }
                    }
                  });
                }
                if (se.trip.itemdepart && se.arrchildinsurrance.length > 0) {
                  se.trip.itemdepart.passengers.forEach((item) => {
                    for (let i = 0; i < se.arrchildinsurrance.length; i++) {
                      if (item.name.toLowerCase().trim() == se.arrchildinsurrance[i].customer_name.toLowerCase().trim()) {
                        item.claimed = se.arrchildinsurrance[i].claimed;
                        break;
                      }
                    }
                  });
                }
              });


              let arrInfo = se.trip.flight_ticket_info.split("<br/>");
              if (arrInfo.length == 2) {
                let arrFlightStart = arrInfo[0].split("|");
                let arrFlightReturn = arrInfo[1].split("|");
                se.cincombodeparturedisplay = arrFlightStart[0];
                se.cincombodeparturelocationdisplay = arrFlightStart[1];
                se.cincombodepartureflightnumberdisplay = arrFlightStart[2];
                //se.cincombodepartureflightnumberdisplay = arrFlightStart[3];


                se.cincomboarrivaldisplay = arrFlightReturn[0];
                se.cincomboarrivallocationdisplay = arrFlightReturn[1];
                se.cincomboarrivalflightnumberdisplay = arrFlightReturn[2];
                //se.cincomboarrivalflightnumberdisplay = arrFlightReturn[3];
              }
              else if (arrInfo.length > 2) {
                let arrFlightStart = arrInfo[0].split("|");
                let arrFlightReturn = [];
                if (arrInfo[1].indexOf('|') != -1) {
                  arrFlightReturn = arrInfo[1].split("|");
                } else if (arrInfo[2].indexOf('|') != -1) {
                  arrFlightReturn = arrInfo[2].split("|");
                }
                se.cincombodeparturedisplay = arrFlightStart[0];
                se.cincombodeparturelocationdisplay = arrFlightStart[1];
                se.cincombodepartureflightnumberdisplay = arrFlightStart[2];

                //se.cincombodepartureflightnumberdisplay = arrFlightStart[3];

                se.cincomboarrivaldisplay = arrFlightReturn[0];
                se.cincomboarrivallocationdisplay = arrFlightReturn[1];
                se.cincomboarrivalflightnumberdisplay = arrFlightReturn[2];
                //se.cincomboarrivalflightnumberdisplay = arrFlightReturn[3];
              }
            }

          })

          let arrcd = se.trip.bookingsComboData[0].departureDate.split('-');
          let nd = new Date(arrcd[2], arrcd[1] - 1, arrcd[0]);
          se.cincombodeparture = moment(nd).format('YYYY-MM-DD');

          if (se.trip.bookingsComboData && se.trip.bookingsComboData.length > 1) {
            se.departCodeDisplay = se.trip.bookingsComboData[0].departCode + ' → ' + se.trip.bookingsComboData[0].arrivalCode;
            if (se.trip.bookingsComboData.length > 1) {
              se.arrivalCodeDisplay = se.trip.bookingsComboData[1].departCode + ' → ' + se.trip.bookingsComboData[1].arrivalCode;
            }

            if (!se.cincombodepartureflightnumberdisplay) {
              se.cincombodepartureflightnumberdisplay = se.trip.bookingsComboData[0].flightNumner;
            }

            if (!se.cincomboarrivalflightnumberdisplay) {
              se.cincomboarrivalflightnumberdisplay = se.trip.bookingsComboData[1].flightNumner;
            }

            if (se.trip.bookingsComboData[1] && se.trip.bookingsComboData[1].departCode) {
              let arrca = se.trip.bookingsComboData[1].departureDate.split('-');
              let nd = new Date(arrca[2], arrca[1] - 1, arrca[0]);
              se.cincomboarrival = moment(nd).format('YYYY-MM-DD');
            }

          }


        }


      });
    }
    this.totalVMB = 0;
    se.totalService = 0;
    //chặng dừng nếu có
    if (this.trip.booking_json_data) {
      let TotalPriceReturn = 0;
      let TotalPriceGo = 0;
      this.booking_json_data = JSON.parse(this.trip.booking_json_data);
      this.booking_json_data.forEach(item => {
        if (item.Passengers) {
          item.Passengers.forEach(element => {
            //se.totalService=se.totalService + Number(element.GiaTienHanhLyTA)+Number(element.SeatPriceTA);
            if (element.GiaTienHanhLyTA) {
              se.totalService = se.totalService + Number(element.GiaTienHanhLyTA);
            }
            if (element.SeatPriceTA) {
              se.totalService = se.totalService + Number(element.SeatPriceTA);
            }
          });
        }
        if (item.PromotionNote && this.isJson(item.PromotionNote)) {
          this.PromotionNote = JSON.parse(item.PromotionNote);
          TotalPriceReturn = this.PromotionNote.TotalPriceReturn;
          TotalPriceGo = this.PromotionNote.TotalPriceGo;
        }

        if (item.Transits && item.Transits.length > 1) {
          this.ischeckStops = true;
        }
      })
      if (this.ischeckStops) {
        this.booking_json_data.forEach(item => {
          if (item.Transits) {
            for (let i = 0; i < item.Transits.length; i++) {
              item.Transits[i].departAirport = this.getAirportByCode(item.Transits[i].FromPlaceCode);
              item.Transits[i].returnAirport = this.getAirportByCode(item.Transits[i].ToPlaceCode);
              item.Transits[i].DepartureTime = moment(item.Transits[i].DepartTime).format('HH:mm')
              item.Transits[i].ArrivalTime = moment(item.Transits[i].LandingTime).format('HH:mm')
              if (i > 0) {
                var DepartureDate: any = this.parseDatetime(item.DepartureDate, item.Transits[i].DepartureTime)
                var LandingTime: any = this.parseDatetime(item.DepartureDate, item.Transits[i - 1].ArrivalTime)
                let hours = (DepartureDate - LandingTime) / 36e5;
                // item.Transits[i].hours =hours;
                let layminutes: any = hours - (Math.floor(hours));
                item.Transits[i].timeOverStop = Math.floor(hours) + " tiếng " + (layminutes > 0 ? (+Math.round(layminutes * 60) + " phút") : '');
              }
            }

          }
        })

      }
      let coutDCdepart = 0;
      let coutDCreturn = 0;
      if (TotalPriceGo > 0) {
        coutDCdepart = 2;
      }
      if (TotalPriceReturn > 0) {
        coutDCreturn = 2;
      }
      se.coutDC = coutDCdepart + coutDCreturn;
      se.totalDichung = TotalPriceGo + TotalPriceReturn;
      se.totalVMB = se.trip.amount_after_tax - se.totalService - se.totalDichung + se.trip.promotionDiscountAmount;
      if(se.trip.payment_fee){
        se.totalVMB = se.totalVMB - se.trip.payment_fee;
      }
      se.trip.totalPriceVMB = se.totalVMB;
    }

    // xử lý case khách sạn có khuyến mãi
    se.totalHotel = 0;
    if (!this.trip.isFlyBooking) {
      se.totalHotel = se.trip.amount_after_tax + se.trip.promotionDiscountAmount;
    }
    if (se.trip.paid_amount && se.trip.paid_amount > 0) {
      se.amount_after_tax = se.trip.amount_after_tax - se.trip.paid_amount;
    } else {
      se.amount_after_tax = se.trip.amount_after_tax
    }


  }

  ngOnInit() {

  }

  goback() {
    this.enableheader = false;
    this._mytripservice.itemEnableHeader.emit(1);
    //this.nativePageTransitions.slide(this.options);
    if (this._mytripservice.backroute) {
      //this.navCtrl.navigateBack(this._mytripservice.backroute, {animated: true});
      // this.navCtrl.back();
      this._mytripservice.backroute = "";
      this._mytripservice.backfrompage = "mytripdetail";

      if (this._mytripservice.rootPage == "homeflight") {
        this._flightService.itemTabFlightActive.emit(true);
        setTimeout(() => {
          this._flightService.itemMenuFlightClick.emit(2);
        }, 200)

        this.valueGlobal.backValue = "homeflight";
        this.navCtrl.navigateBack('/tabs/tab1', { animated: true });
        this._mytripservice.backfrompage = "";
      } 
      else {
        if (this.valueGlobal.backValue == "homeflight") {
          this._flightService.itemTabFlightActive.emit(true);
          setTimeout(() => {
            this._flightService.itemMenuFlightClick.emit(2);
          }, 200)
          this.navCtrl.navigateBack('/tabs/tab1', { animated: true });
        } 
        else {
          this.navCtrl.navigateBack('/app/tabs/tab3');
        }

      }


    }

    else if (this._mytripservice.rootPage == "homeflight") {
      if (this._mytripservice.backfrompage == "mytripdetail" || this._mytripservice.backfrompage == "mytripbookingdetail") {
        this._flightService.itemTabFlightActive.emit(true);
        setTimeout(() => {
          this._flightService.itemMenuFlightClick.emit(2);
        }, 200)

        this.valueGlobal.backValue = "homeflight";
        this.navCtrl.navigateBack('/tabs/tab1', { animated: true });
        this._mytripservice.backfrompage = "";
      } else {
        this.navCtrl.navigateBack('/app/tabs/tab3');
      }

    }
    else {
      this.navCtrl.navigateBack('/app/tabs/tab3');
    }

  }

  openWeather(cityname) {
    this.navCtrl.navigateForward('/tripweather/' + cityname);
    //google analytic
    this.gf.googleAnalytion('mytrips', 'Search', 'openweather/' + cityname);
  }

  openHotelNotes(notes) {
    if (!this.networkProvider.isOnline()) {
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      return;
    }
    this.gf.setParams(notes, 'hotelnotes');
    this.navCtrl.navigateForward('/hotelnotes');
    //google analytic
    this.gf.googleAnalytion('mytrips', 'Search', 'opentripnote');
  }

  openHotelExpsNotes(trip, notes, provincename) {
    var se = this;
    if (!se.networkProvider.isOnline()) {
      se.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      return;
    }
    se.gf.setParams({ notes: notes, provincename: provincename }, 'hotelexpsnotes')
    //check location của ks
    if (trip.provinceName) {
      var regionCode = se.gf.convertFontVNI(trip.provinceName).replace(/ /g, '-');
      regionCode = regionCode.toLowerCase();
      regionCode = regionCode.replace('---', '-');
      regionCode = regionCode.replace('-province', '');
      regionCode = regionCode.replace('tinh-', '');
      regionCode = regionCode.replace('-district', '');

      se.searchhotel.inputExperienceItem = {};
      se.searchhotel.inputExperienceItem.regionCode = regionCode;
      se.searchhotel.inputExperienceRegionCode = regionCode;
      se.searchhotel.inputExperienceRegionName = trip.provinceName;
      se.searchhotel.inputExperienceText = trip.provinceName;
      se.searchhotel.inputExperienceItem.latitude = trip.Latitude;
      se.searchhotel.inputExperienceItem.longitude = trip.Longitude;
      se.valueGlobal.backValue = 'tab3';
      se.navCtrl.navigateForward('/experiencesearch');
    } else {
      se.navCtrl.navigateForward('/hotelexpsnotes');
    }
  }

  openBookingTrip(trip) {
    if (!this.networkProvider.isOnline()) {
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      return;
    }
    if (trip && !trip.isRequestTrip && !trip.isHistoryItem) {
      this.gf.setParams({ trip: trip, currentTrip: this._mytripservice.currentTrip }, 'mytripbookingdetail');
      this._mytripservice.backroute = "";
      this.navCtrl.navigateForward('/mytripbookingdetail');
      //google analytic
      this.gf.googleAnalytion('mytrips', 'Search', '/opentripdeail');
    }
  }

  paymentselect(trip, stt) {
    var se = this;
    this._mytripservice.backroute = "";
    se.activityService.objPaymentMytrip = { returnPage: 'mytrip', tripindex: se._mytripservice.currentTrip, paymentStatus: 0, bookingid: trip.HotelIdERP, trip: trip };
    this.activityService.objPaymentMytrip.trip.priceShow = se.amount_after_tax;
    if (trip.booking_type == 'COMBO_FLIGHT') {
      if (stt == 0) {
        se.navCtrl.navigateForward("/mytripaymentflightcombo/0");
      }
      else {
        se.navCtrl.navigateForward("/mytripaymentflightcombo/1");
      }

    } else if (trip.booking_type == 'COMBO_VXR') {
      if (stt == 0) {
        se.navCtrl.navigateForward("/mytripaymentcarcombo/0");
      }
      else {
        se.navCtrl.navigateForward("/mytripaymentcarcombo/1");
      }

    }
    else if (trip.isBookingVMBQT && trip.isTravelPort) {
      se._flightService.itemFlightInternational = null;
      se.activityService.objPaymentMytrip = trip;
      this.gf.showLoading();
      let url = C.urls.baseUrl.urlFlightInt + `api/bookings/${trip.booking_id}/summary?${new Date().getTime()}`;
      this.gf.RequestApi('GET', url, {}, {}, 'flightadddetailsinternational', 'getSummaryBooking').then((data) => {
        this.gf.hideLoading();
        this._flightService.itemFlightCache.dataSummaryBooking = data.data;
        se.navCtrl.navigateForward("/flightinternationalpaymentselect");
      })

    }
    else if (trip.isFlyBooking) {
      if (stt == 0) {
        se.navCtrl.navigateForward("/mytripaymentflightselect/0");
      }
      else {
        se.navCtrl.navigateForward("/mytripaymentflightselect/1");
      }

    }
    else if (trip.booking_type == 'TOUR') {
      se._tourService.BookingTourMytrip = trip;
      se._tourService.itemDetail = null;
      se.navCtrl.navigateForward("/tourpaymentselect");
    }
    else {
      // stt 0:CKNH
      if (stt == 0) {
        se.navCtrl.navigateForward("/mytripaymentselect/0");
      }
      else {
        se.navCtrl.navigateForward("/mytripaymentselect/1");
      }
    }

  }

  payment(trip) {
    var se = this;
    se.activityService.objPaymentMytrip = { returnPage: 'mytrip', tripindex: se._mytripservice.currentTrip, paymentStatus: 0, bookingid: trip.HotelIdERP, trip: trip };
    se.navCtrl.navigateForward("/roompaymentlive/1");
  }
  copyClipboard(text) {

    this.clipboard.copy(text);

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

  showPolicy(trip) {
    var se = this;
    if (trip.off_hotel_paypolicy) {
      let textstr = trip.off_hotel_paypolicy;
      this.gf.setParams({ showFromMytrip: true, textcancel: textstr, RoomName: trip.room_name }, 'roomInfo');
      this.searchhotel.backPage = "tab3";
      this.navCtrl.navigateForward('/roomcancel');
    }
  }
  showRules() {
    var se = this;
    this.navCtrl.navigateForward("/rules");
  }

  /***
         * Gọi tổng đài hỗ trợ
         * PDANH 26/02/2019
         */
  async makeCallSupport(phone) {
    try {
      setTimeout(() => {
        window.open(`tel:${phone}`, '_system');
      }, 10);
    }
    catch (error) {
    }
    //google analytic
    this.gf.googleAnalytion('mytrips', 'Search', 'callsupport');
  }
  nextSupport(trip) {
   
    this.activityService.objPaymentMytrip = { trip: trip };
    if (!trip.isRequestTrip && trip.isFlyBooking) {
      this._flightService.fromOrderRequestDetailSupport = true;
      this.navCtrl.navigateForward('/orderrequestsupport');
    } else {
      this.navCtrl.navigateForward('/ordersupport/0');
    }
  }
  requestCathay(name, trip, gender) {
    if (gender.indexOf('Bé') == 0) {
      this.getCathay(name);
      return;
    }
    this.activityService.objCathayMytrip = { name: name, trip: trip };
    this.valueGlobal.backpageCathay = 'mytripdetail';
    this.navCtrl.navigateForward('/mytripcathay/' + this.trip.booking_id);

  }

  checkExitClaim(listcheck, itemcheck, bkgid) {
    var se = this, res = false;
    res = listcheck.filter((item) => { return item.flight_number == itemcheck.flight_number && item.insurance_code == itemcheck.insurance_code && item.bookingid == bkgid }).length > 0 ? true : false;
    return res;
  }

  getCathayClaimInfo(bkgid): Promise<any> {
    return new Promise((resole, reject) => {
      let url = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetCathayByKey?key=' + bkgid;
      let header = {
        apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
      }
      this.gf.RequestApi('GET', url, header, null, 'MytripDetail', "getCathayClaimInfo").then((data) => {
        if (data) {
          resole(data);
        } else {
          resole(false);
        }
      })
    })
  }

  /**
       * Show popup claim bảo hiểm
       * @param trip thông tin chuyến đi
       * @param item thông tin bảo hiểm
       * @param type loại bảo hiểm (1 - trễ chiều đi; 2 - trễ chiều về; 3 - hủy chiều đi; 4 - hủy chiều về)
       * @param flightNumner số hiệu chuyến bay
       */
  async showInsuranceDetail(trip, item, type, flightNumber, ischild) {
    var se = this;
    if (ischild && !se.checkChildAge(item, (type == 1 || type == 3) ? true : false)) {
      se.gf.showToastWarning('Trẻ em dưới 14 tuổi sẽ thực hiện yêu cầu bồi thường bảo hiểm theo người lớn đi cùng');
      return;
    }
    se.checkValidDate(trip, (type == 1 || type == 3) ? se.cincombodepartureflightnumberdisplay : se.cincomboarrivalflightnumberdisplay).then((valid) => {
      if (valid) {
        //se.gf.setParams({ trip: trip, currentTrip: se.currentTrip }, 'mytripbookingdetail');
        let listChild:any = [];
        //Lọc lại những item child chưa được claim
        se.arrchild.forEach(element => {
          let hadclaimed = false;
          if (se.listClaimed && se.listClaimed.length > 0) {
            hadclaimed = se.listClaimed.filter((el) => { return el.flight_number == flightNumber.replace(" ", "") && element.id == el.insurance_code && el.bookingid == trip.booking_id }).length > 0 ? true : false;
          }
          if (!hadclaimed) {
            listChild.push(element);
          }
        });

        if (ischild && listChild.length <= 1) {
          listChild = [];
        }

        se.gf.setParams({ childlist: listChild, item: item, trip: trip, type: type, flightNumber: flightNumber, ischild: ischild }, 'insurrenceDetail');
        se.valueGlobal.backpageCathay = 'mytripdetail';
        se.navCtrl.navigateForward("/insurrancedetail");
      } else {
        se.showWarning('Chuyến bay chưa khởi hành nên quý khách chưa thực hiện claim bảo hiểm!')
      }
    })

  }
  async showWarning(msg) {
    var se = this;
    const toast = await se.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }

  checkValidDate(trip, flightNumber): Promise<any> {
    return new Promise((resolve, reject) => {
      let d = moment(new Date()).format('YYYY-MM-DD');
      let obj = trip.bookingsComboData.filter((f) => {
        let arr = f.departureDate.split('-');
        let newdate = new Date(arr[2], arr[1] - 1, arr[0]);
        let df = moment(newdate).format('YYYY-MM-DD');
        return f.flightNumner && f.flightNumner.replace(' ', '') == flightNumber.replace(' ', '') && moment(d).diff(df, 'days') >= 0
      });
      console.log(obj);

      resolve(obj && obj.length > 0);
    })
  }

  /**
       * Valid tuổi trẻ em claim riêng > 14 tuổi
       * @param child 
       * @returns 
       */
  checkChildAge(child, isdepart) {
    let arr = child.birth.split('-');
    let newdate = new Date(arr[2], arr[1] - 1, arr[0]);
    let chilđob = moment(newdate).format('YYYY-MM-DD');
    console.log(moment(moment(isdepart ? this.cincombodeparture : this.cincomboarrival).format('YYYY-MM-DD')).diff(chilđob, 'days'));
    return moment(moment(isdepart ? this.cincombodeparture : this.cincomboarrival).format('YYYY-MM-DD')).diff(chilđob, 'days') > 5113
  }

  showInsurranceInfo() {
    var se = this;
    se.gf.setParams({ currentTrip: se.trip }, 'mytripbookingdetail');
    se.navCtrl.navigateForward('/insurrancenote');
  }

  /**
       * Show option chọn claim bảo hiểm
       * @param trip thông tin chuyến đi
       * @param item thông tin bảo hiểm
       */
  async showActionSheetInsurrance(trip, item, ischild) {
    var se = this;
    let claimedDepart = false, claimedReturn = false;
    if (se.listClaimed && se.listClaimed.length > 0) {
      let fnDepart = se.cincombodepartureflightnumberdisplay.replace(" ", ""),
        fnReturn = se.cincomboarrivalflightnumberdisplay.replace(" ", "");
      claimedDepart = se.listClaimed.filter((el) => { return el.flight_number == fnDepart && el.insurance_code == item.insurance_code }).length > 0 ? true : false;
      claimedReturn = se.listClaimed.filter((el) => { return el.flight_number == fnReturn && el.insurance_code == item.insurance_code }).length > 0 ? true : false;


    }

    let actionSheet = await se.actionsheetCtrl.create({
      cssClass: 'action-sheets-insurrance',
      buttons: [
        {
          text: "Trễ chuyến " + se.cincombodepartureflightnumberdisplay + "| " + se.departCodeDisplay,
          handler: () => {
            claimedDepart ? se.showWarning('Chuyến bay này đã được yêu cầu bảo hiểm. Xin vui lòng chọn lại.') : se.showInsuranceDetail(trip, item, 1, se.cincombodepartureflightnumberdisplay, ischild);
          },
          cssClass: claimedDepart ? 'has-claimed' : '',
        },
        {
          text: "Trễ chuyến " + se.cincomboarrivalflightnumberdisplay + "| " + se.arrivalCodeDisplay,
          handler: () => {
            claimedReturn ? se.showWarning('Chuyến bay này đã được yêu cầu bảo hiểm. Xin vui lòng chọn lại.') : se.showInsuranceDetail(trip, item, 2, se.cincomboarrivalflightnumberdisplay, ischild);
          },
          cssClass: claimedReturn ? 'has-claimed' : '',
        },
        {
          text: "Hủy chuyến " + se.cincombodepartureflightnumberdisplay + "| " + se.departCodeDisplay,
          handler: () => {
            claimedDepart ? se.showWarning('Chuyến bay này đã được yêu cầu bảo hiểm. Xin vui lòng chọn lại.') : se.showInsuranceDetail(trip, item, 3, se.cincombodepartureflightnumberdisplay, ischild);
          },
          cssClass: claimedDepart ? 'has-claimed' : '',
        },
        {
          text: "Hủy chuyến " + se.cincomboarrivalflightnumberdisplay + "| " + se.arrivalCodeDisplay,
          handler: () => {
            claimedReturn ? se.showWarning('Chuyến bay này đã được yêu cầu bảo hiểm. Xin vui lòng chọn lại.') : se.showInsuranceDetail(trip, item, 4, se.cincomboarrivalflightnumberdisplay, ischild);
          },
          cssClass: claimedReturn ? 'has-claimed' : '',
        },
      ]
    });
    actionSheet.present();
  }
  getCathay(cusname) {
    var co = 0;
    this.presentLoading();
    this.gf.getCathayByKey(this.trip.booking_id).then((data) => {
      if (this.loader) {
        this.loader.dismiss();
      }

      var json = data;
      if (json.result) {
        this.noLoginObj = json;

        if (
          this.noLoginObj &&
          this.noLoginObj.insurObj &&
          this.noLoginObj.insurObj.adultList.length > 0
        ) {
          this.childList = this.noLoginObj.insurObj.childList;
          if (this.childList.length > 0) {
            let i = 1;
            this.childList.forEach(element => {
              element.birth = element.customer_dob;
              element.id = i;
              i++;
              element.name = element.customer_name;
              if (element.claiming_flights && element.customer_name.toLowerCase() == cusname.toLowerCase()) {
                this.presentToastwarming('Trẻ em đã claim chuyến bay ' + element.claiming_flights + '');
                co = 1;
              }
            });

          }

        }

      }
      if (co == 0) {
        this.presentToastwarming('Trẻ em dưới 14 tuổi sẽ thực hiện yêu cầu bồi thường bảo hiểm theo người lớn đi cùng');
      }
    })


  }
  async presentToastwarming(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }


  getBookingTourDetail(trip) {
    let headers = {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    this.gf.RequestApi('GET', C.urls.baseUrl.urlMobile + '/tour/api/TourApi/GetTourById?id=' + trip.hotel_id.replace('TO', ''), headers, {}, 'order', 'getBookingTourDetail').then((data) => {
      if (data && data.Status == "Success" && data.Response) {
        trip.itemTourDetail = data.Response;
        if (trip.itemTourDetail && trip.itemTourDetail.Image) {
          // let itemmap = this.tourService.listTopSale.filter((item) => item.Id == tourService.tourDetailId );
          // if(itemmap && itemmap.length >0){
          //   trip.TopSale = itemmap[0].TotalQuest;
          // }
          trip.itemTourDetail.ImagesSlide = trip.itemTourDetail.Image.split(', ');
          let countstring = trip.itemTourDetail.ProgramContent.match(/cdn2/g || []).length;
          for (let index = 0; index < countstring; index++) {
            trip.itemTourDetail.ProgramContent = trip.itemTourDetail.ProgramContent.replace('src="//cdn2', 'src="https://cdn2');
          }

        }
        if (trip.itemTourDetail.AvgPoint && (trip.itemTourDetail.AvgPoint.toString().length == 1 || trip.itemTourDetail.AvgPoint === 10)) {
          trip.itemTourDetail.AvgPoint = trip.itemTourDetail.AvgPoint + ".0";
        }
      }
    })
  }

  expandDiv(type) {
    if (type == 1) {
      this.expandDivIncludePrice = !this.expandDivIncludePrice;

      if (this.expandDivIncludePrice) {
        var divCollapse = $('.div-wrap-includeprice.div-collapse');
        if (divCollapse && divCollapse.length > 0) {
          divCollapse.removeClass('div-collapse').addClass('div-expand');
        }

      } else {
        var divCollapse = $('.div-wrap-includeprice.div-expand');
        if (divCollapse && divCollapse.length > 0) {
          divCollapse.removeClass('div-expand').addClass('div-collapse');
        }

      }
    }
    else if (type == 2) {
      this.expandDivTourInfo = !this.expandDivTourInfo;

      if (this.expandDivTourInfo) {
        var divCollapse = $('.div-wrap-tourinfo.div-collapse');
        if (divCollapse && divCollapse.length > 0) {
          divCollapse.removeClass('div-collapse').addClass('div-expand');
        }

        setTimeout(() => {
          if ($('#contentcontentIncludePrice') && $('#contentcontentIncludePrice').length > 0) {
            (window.document.getElementById('contentcontentIncludePrice')as any).scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 50)

      } else {
        var divCollapse = $('.div-wrap-tourinfo.div-expand');
        if (divCollapse && divCollapse.length > 0) {
          divCollapse.removeClass('div-expand').addClass('div-collapse');
        }

        setTimeout(() => {
          if ($('#contentTourInfo') && $('#contentTourInfo').length > 0) {
            (window.document.getElementById('contentTourInfo')as any).scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 50)

      }
    }
    else if (type == 3) {
      this.expandDivTourNotes = !this.expandDivTourNotes;

      if (this.expandDivTourNotes) {
        var divCollapse = $('.div-wrap-tournotes.div-collapse');
        if (divCollapse && divCollapse.length > 0) {
          divCollapse.removeClass('div-collapse').addClass('div-expand');
        }

        setTimeout(() => {
          if ($('#contentTourNotes') && $('#contentTourNotes').length > 0) {
            (window.document.getElementById('contentTourNotes')as any).scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 50)

      } else {
        var divCollapse = $('.div-wrap-tournotes.div-expand');
        if (divCollapse && divCollapse.length > 0) {
          divCollapse.removeClass('div-expand').addClass('div-collapse');
        }

        setTimeout(() => {
          if ($('#contentTourNotes') && $('#contentTourNotes').length > 0) {
            (window.document.getElementById('contentTourNotes')as any).scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 50)

      }
    }
    else {

    }
  }

  showTourInfo() {
    this.navCtrl.navigateForward('/mytriptourinfo');
  }
  getmhoteldetail() {

    var se = this;
    let url = C.urls.baseUrl.urlPost + "/mhoteldetail/" + this.trip.booking_id;
    se.gf.RequestApi('POST', url, {}, {}, 'hoteldetail', 'getdata').then((data) => {
      if (data) {
        se.zone.run(() => {
          se.cin = data.CheckinTime;
          se.cout = data.CheckoutTime;
          se.HotelPolicies = data.HotelPolicies
        })

      }
    });

  }

  getAirportByCode(code) {
    var se = this, res = "";
    if (se._flightService.listAirport && se._flightService.listAirport.length > 0) {
      let itemmap = se._flightService.listAirport.filter((item) => { return item.code == code });
      res = (itemmap && itemmap.length > 0) ? itemmap[0].airport : "";
    }
    return res;
  }

  openLinkCondition() {
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'yes',
      toolbar: 'yes',
      hideurlbar: 'yes',
      closebuttoncaption: 'Đóng',
      hidenavigationbuttons: 'yes'
    };
    this._inAppBrowser = this.iab.create('https://www.ivivu.com/dieu-kien-dieu-khoan-hang-khong', '_self', options);

  }


  getSummaryBooking() {
    let url = C.urls.baseUrl.urlFlightInt + `api/bookings/${this.trip.booking_id}/summary?${new Date().getTime()}`;
    this.gf.RequestApi('GET', url, {}, {}, 'flightadddetailsinternational', 'getSummaryBooking').then((data) => {
      if (data.data) {
        this.zone.run(() => {
          this._flightService.itemFlightCache.dataSummaryBooking = data.data;
          this.dataSummaryBooking = data.data;

        })
        //this.loadsummarydone = true;
        console.log(data.data);
        if (this.dataSummaryBooking.departFlightData) {
          this.getDetailTicket(this.dataSummaryBooking.departFlightData, 1);
        }

        if (this.dataSummaryBooking.returnFlightData && this.dataSummaryBooking.returnFlightData.id) {
          this.getDetailTicket(this.dataSummaryBooking.returnFlightData, 0);
        }
      }

    })
  }

  getDetailTicket(item, isdepart) {
    let se = this;
    if (item.id) {
      if (isdepart) {
        this.loadingdepartdetailticket = true;
      } else {
        this.loadingreturndetailticket = true;
      }
      let url = C.urls.baseUrl.urlFlight + `gate/apiv1/GetDetailTicketAirBus?airlineCode=${item.airline}&ticketType=${item.ticketClass}&flightNumber=${item.flightNumber}&fromPlace=${item.fromPlaceCode}&toPlace=${item.toPlaceCode}&resbookCode=${item.ticketType}&airbusCode=${item.aircraft}&departDate=${moment(item.departTime).format('YYYY-MM-DD')}&bookingDate=${moment(this.trip.bookingDate).format('YYYY-MM-DD')}`;
      this.gf.RequestApi('GET', url, {}, {}, 'flightadddetailsinternational', 'getSummaryBooking').then((data) => {
        if (data) {

          se.zone.run(() => {
            this.loadsummarydone = true;
            if (isdepart) {
              this.departTicketInfo = data;
              this.loadingdepartdetailticket = false;
            } else {
              this.returnTicketInfo = data;
              this.loadingreturndetailticket = false;
            }


          })

        }
      })
    }

  }

  expandCondition() {
    if (!this.loadsummarydone) {
      this.gf.showAlertMessageOnly('Đang tải chi tiết vé, xin vui lòng đợi trong giây lát!');
      return;
    }
    this.expanddivcondition = !this.expanddivcondition;
    if (this.expanddivcondition) {
      var divCollapse = $('.div-wrap-condition.div-collapse');
      if (divCollapse && divCollapse.length > 0) {
        divCollapse.removeClass('div-collapse').addClass('div-expand');
      }

    } else {
      var divCollapse = $('.div-wrap-condition.div-expand');
      if (divCollapse && divCollapse.length > 0) {
        divCollapse.removeClass('div-expand').addClass('div-collapse');
      }
      this.scrollToTopGroup(1);
    }

  }

  expandRefund() {
    this.expanddivrefund = !this.expanddivrefund;
    if (this.expanddivrefund) {
      var divCollapse = $('.div-wrap-refund.div-collapse');
      if (divCollapse && divCollapse.length > 0) {
        divCollapse.removeClass('div-collapse').addClass('div-expand');
      }

    } else {
      var divCollapse = $('.div-wrap-refund.div-expand');
      if (divCollapse && divCollapse.length > 0) {
        divCollapse.removeClass('div-expand').addClass('div-collapse');
      }
      this.scrollToTopGroup(2);
    }

  }

  scrollToTopGroup(value) {
    //scroll to top of group
    setTimeout(() => {
      var objHeight = value == 1 ? $('.div-condition') : $('.div-refund').last();
      if (objHeight && objHeight.length > 0) {
        var h = 0;
        h = objHeight[0].offsetTop;
        if (this.scrollYArea) {
          this.scrollYArea.scrollToPoint(0, h, 500);
        }

      }
    }, 100)
  }
  getDetailTicketFromDat(stt): Promise<any> {
    var se = this;
    return new Promise((resolve, reject) => {
      if (stt == 0) {
        var airlineCode = this.getairlineCode(stt);
        var ticketClass = this.trip.bookingsComboData[0].ticketClass;
        var departDate = this.trip.bookingsComboData[0].departureTime;
        var flightNumber = this.trip.bookingsComboData[0].flightNumner;
        var fromplace = this.trip.bookingJsonDataParse[0].departCode;
        var toplace = this.trip.bookingJsonDataParse[0].arrivalCode;
      } else {
        var airlineCode = this.getairlineCode(stt);
        var ticketClass = this.trip.bookingsComboData[1].ticketClass;
        var departDate = this.trip.bookingsComboData[1].departureTime;
        var flightNumber = this.trip.bookingsComboData[1].flightNumner;
        var fromplace = this.trip.bookingJsonDataParse[1].departCode;
        var toplace = this.trip.bookingJsonDataParse[1].arrivalCode;
      }
      let url = C.urls.baseUrl.urlFlight + "gate/apiv1/GetDetailTicketAirBus?airlineCode=" + airlineCode + "&ticketType=" + ticketClass + "&flightNumber=" + flightNumber + "&departDate=" + departDate + "&bookingDate=" + moment(this.trip.bookingDate).format('YYYY-MM-DD')+`&fromPlace=${fromplace}&toPlace=${toplace}`;
      let header = {

      }
      this.gf.RequestApi('GET', url, header, null, 'MytripDetail', "GetDetailTicketAirBus").then((data) => {
        if (data) {
          let result = data;
          if (stt == 0) {
            se.baggageHandedDepart= se.trip.bookingJsonDataParse[0] && se.trip.bookingJsonDataParse[0].ticketConditions && se.trip.bookingJsonDataParse[0].ticketConditions.BaggageHanded ? se.trip.bookingJsonDataParse[0].ticketConditions.BaggageHanded : result.ticketCondition.baggageHanded;
            se.luggageSignedDepart= se.trip.bookingJsonDataParse[0] && se.trip.bookingJsonDataParse[0].ticketConditions && se.trip.bookingJsonDataParse[0].ticketConditions.LuggageSigned ? se.trip.bookingJsonDataParse[0].ticketConditions.LuggageSigned : result.ticketCondition.luggageSigned;
            se.departConditionInfo = result;
            se.trip.bookingsComboData[0].passengers.forEach(element => {
              element.hanhLyshow = "";
              if (element.hanhLy && se.luggageSignedDepart) {
                let _arr = se.luggageSignedDepart.split(' ');
                let _luggageSignedDepart =0;
                if(_arr && _arr.length >0){
                  _luggageSignedDepart = isNaN(Number(_arr[_arr.length-1].toString().replace('kgs', '').replace('kg', ''))) ? 0 : Number(_arr[_arr.length-1].toString().replace('kgs', '').replace('kg', ''));
                }else{
                  _luggageSignedDepart = Number(se.luggageSignedDepart.toString().replace('kgs', '').replace('kg', ''));
                }
                element.hanhLyshow = Number(element.hanhLy.toString().replace('kgs', '').replace('kg', '')) + _luggageSignedDepart;
              } else {
                if (element.hanhLy) {
                  element.hanhLyshow = element.hanhLy;
                } else {
                  element.hanhLyshow = se.luggageSignedDepart;
                }

              }
              if (element.hanhLyshow) {
                element.hanhLyshow = element.hanhLyshow.toString().replace('kgs', '').replace('kg', '');
              }
            });
            se._departTicketInfoCRM = se.trip.bookingJsonDataParse[0] && se.trip.bookingJsonDataParse[0].ticketConditions ? se.trip.bookingJsonDataParse[0] : null;
            se.trip.departChangeDepartTime = !((result && (!result.ticketCondition.changeDepartTime || result.ticketCondition.changeDepartTime.indexOf('Không') != -1)) || !result );
          } else {
            se.baggageHandedReturn=se.trip.bookingJsonDataParse[1] && se.trip.bookingJsonDataParse[1].ticketConditions && se.trip.bookingJsonDataParse[1].ticketConditions.BaggageHanded ? se.trip.bookingJsonDataParse[1].ticketConditions.BaggageHanded : result.ticketCondition.baggageHanded;
            se.luggageSignedReturn=se.trip.bookingJsonDataParse[1] && se.trip.bookingJsonDataParse[1].ticketConditions && se.trip.bookingJsonDataParse[1].ticketConditions.LuggageSigned ? se.trip.bookingJsonDataParse[1].ticketConditions.LuggageSigned : result.ticketCondition.luggageSigned;
            se.returnConditionInfo = result;
            se.trip.bookingsComboData[1].passengers.forEach(element => {
              element.hanhLyshow = "";
              if (element.hanhLy && se.luggageSignedReturn) {
                //element.hanhLyshow = Number(element.hanhLy.toString().replace('kgs', '').replace('kg', '')) + Number(se.luggageSignedReturn.toString().replace('kgs', '').replace('kg', ''));
                let _arr = se.luggageSignedReturn.split(' ');
                let _luggageSignedReturn =0;
                if(_arr && _arr.length >0){
                  _luggageSignedReturn = isNaN(Number(_arr[_arr.length-1].toString().replace('kgs', '').replace('kg', ''))) ? 0 : Number(_arr[_arr.length-1].toString().replace('kgs', '').replace('kg', ''));
                }else{
                  _luggageSignedReturn = Number(se.luggageSignedReturn.toString().replace('kgs', '').replace('kg', ''));
                }
                element.hanhLyshow = Number(element.hanhLy.toString().replace('kgs', '').replace('kg', '')) + _luggageSignedReturn;
              } else {
                if (element.hanhLy) {
                  element.hanhLyshow = element.hanhLy;
                } else {
                  element.hanhLyshow = se.luggageSignedReturn;
                }

              }
              if (element.hanhLyshow) {
                element.hanhLyshow = element.hanhLyshow.toString().replace('kgs', '').replace('kg', '');
              }
            });
            se._returnTicketInfoCRM = se.trip.bookingJsonDataParse[1] && se.trip.bookingJsonDataParse[1].ticketConditions ? se.trip.bookingJsonDataParse[1] : null;
            se.trip.returnChangeDepartTime = !((result && (!result.ticketCondition.changeDepartTime || result.ticketCondition.changeDepartTime.indexOf('Không') != -1)) || !result );
          }
          resolve(result);
        }
      })
    })
  }
  getairlineCode(stt) {
    var airlineName = "";
    if (this.trip.bookingsComboData) {
      if (stt == 0) {
        if (this.trip.bookingsComboData[0].airlineName.indexOf('VIETJET') != -1) {
          airlineName = "VietJetAir"
        } else if (this.trip.bookingsComboData[0].airlineName.indexOf('Vietnam Airlines') != -1 || this.trip.bookingsComboData[0].airlineName.indexOf('VIETNAM AIRLINES') != -1) {
          airlineName = "VietnamAirlines"
        } else {
          airlineName = "BambooAirways"
        }
      } else {
        if (this.trip.bookingsComboData[1].airlineName.indexOf('VIETJET') != -1) {
          airlineName = "VietJetAir"
        } else if (this.trip.bookingsComboData[1].airlineName.indexOf('Vietnam Airlines') != -1 || this.trip.bookingsComboData[1].airlineName.indexOf('VIETNAM AIRLINES') != -1) {
          airlineName = "VietnamAirlines"
        } else {
          airlineName = "BambooAirways"
        }
      }
    }

    return airlineName;
  }
  dkv() {
    this.isdkv = !this.isdkv
  }
  policy() {
    this.ishdnp = !this.ishdnp;
  }
  phuthuP() {
    this.isptp = !this.isptp;
  }
  info() {
    this.isttt = !this.isttt;
  }

  openWebpage() {
    var url = "https://www.ivivu.com/dieu-kien-dieu-khoan-hang-khong";
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'yes',
      toolbar: 'yes',
      hideurlbar: 'yes',
      closebuttoncaption: 'Đóng'
    };
    const browser = this.iab.create(url, '_self', options);
    browser.show();
  }
  parseDatetime(date: string, time: string) {
    let dateObj = date.split("/");
    let dtStr = dateObj[1] + "/" + dateObj[0] + "/" + dateObj[2] + " " + time;
    return new Date(dtStr);
  }
  isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }


  buildLinkQrCode() {
    this.zone.run(() => {
      this.qrcodeurl = `https://cdn1.ivivu.com/newcdn/qr-payment?bankname=${this.trip.textbank}&amount=${this.gf.convertStringToNumber((this.amount_after_tax ? this.amount_after_tax : this.trip.amount_after_tax))}&description=${this.trip.booking_id}`;
    })

  }

  async downloadqrcode(trip) {
    let storageDirectory = '';
    if (this.platform.is('android')) {
      storageDirectory = this.file.dataDirectory;
    }
    this.gf.showLoading();
    try {
      const fileTransfer: FileTransferObject = this.transfer.create();
      this.photoLibrary.requestAuthorization({ read: true, write: true }).then(() => {
        fileTransfer.download(this.qrcodeurl, storageDirectory + `qrcode_${trip.booking_id}.png`).then((entry) => {
          this.photoLibrary.saveImage(entry.toURL(), 'qrcode');
          this.gf.hideLoading();
          this.presentToastr('Đã lưu');
        }, (error) => {
          console.error(error);
        });
      });

    } catch (error) {
      this.gf.hideLoading();
    }
  }
  share(item) {
    this.socialSharing.share('', '', item.CheckinInfo, '').then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });

  }
  async downloadimg(item, trip) {
    console.log(trip);
    if (trip.bookingsComboData[0].airlineName.indexOf('Vietnam Airlines') != -1 || trip.bookingsComboData[0].airlineName.indexOf('VIETNAM AIRLINES') != -1 || trip.bookingsComboData[0].airlineName.indexOf('BAMBOO') != -1) {
      this.downloadPDF(item.CheckinInfo);
    } else {
      let storageDirectory = '';
      if (this.platform.is('android')) {
        storageDirectory = this.file.dataDirectory;
      }
      this.gf.showLoading();
      try {
        const fileTransfer: FileTransferObject = this.transfer.create();
        this.photoLibrary.requestAuthorization({ read: true, write: true }).then(() => {
          fileTransfer.download(item.CheckinInfo, storageDirectory + `boarding${trip.booking_id}.png`).then((entry) => {
            this.photoLibrary.saveImage(entry.toURL(), 'boarding');
            this.gf.hideLoading();
            this.presentToastr('Đã lưu');
          }, (error) => {
            console.error(error);
          });
        });

      } catch (error) {
        this.gf.hideLoading();
      }
    }

  }
  checkinOnline(trip) {
    var se = this;
    var se = this;
    let temp = trip.bookingsComboData[0].arrivalDate.split("/");
    let daytemp=temp[2]+ temp[1] + temp[0];
    // let daytemp="2023"+ "05" + "12";
    var dep = moment(daytemp+ " " + trip.bookingsComboData[0].arrivalTime, "YYYYMMDD HH:mm")
    let diffminutes = moment(dep).diff(new Date(), 'minutes');
    if (diffminutes > 210) {
      if(trip.allowRequestCheckinOnline && trip.allowRequestCheckinOnline.allowCheckin){
        let body =
        {
          bookingCode: trip.booking_id,
          customerEmail: trip.cus_email,
          customerName: trip.cus_name,
          customerPhone: trip.cus_phone,
          requestContent: "Yêu cầu checkin Online",
          requestType: "Yêu cầu checkin Online",
          sourceRequest: "App"
        };
        let urlPath = C.urls.baseUrl.urlMobile + '/app/CRMOldApis/CreateSupportRequest';
        let headers = {
          'cache-control': 'no-cache',
          'content-type': 'application/json'
        };
        this.gf.RequestApi('POST', urlPath, headers, body, 'orderSupport', 'CreateSupportRequest').then((data) => {
    
          trip.bookingjson[0].RequestCheckin = 1;
          
        })
      }else{
        alert("Chuyến bay chưa hỗ trợ checkin online! Quý khách vui lòng làm thủ tục tại quầy vé");
      }
    }else{
      this.zone.run(() => {
        trip.bookingjson[0].RequestCheckin=0;
        trip.ischeckinOnl=true;
        alert("Chuyến bay trong khung đóng chuyến. Qúy khách vui lòng làm thủ tục tại kios hoặc quầy checkin tại sân bay");
      })


    }
   

  }

  downloadPDF(url) {
    // url = 'https://cdn1.ivivu.com/files/2023/04/28/10/BoardingPass_.pdf';
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(url, this.file.externalRootDirectory + "/Download/" + 'boarding.pdf').then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.presentToastr('Đã lưu');
    }, (error) => {
      // handle error
    });
  }

  downloadPDFVC(url) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(url, this.file.externalRootDirectory + "/Download/"+ 'file.pdf').then((entry) => {
      // console.log('download complete: ' + entry.toURL());
      this.presentToastr('Đã lưu');
    }, (error) => {
      // handle error
    });
  }
  GetVoucherLinks(booking_id): Promise<any>{
    return new Promise((resolve, reject) => {
      this.gf.RequestApi('GET', C.urls.baseUrl.urlTicket + '/api/Reservation/GetVoucherLinks?bookingCode='+booking_id , {}, {}, '', '').then((data) => {
        if (data && data.success) {

            resolve(data.data);
           
        }
      });
    })

  }

  sharePDF(url){
    this.socialSharing.share('','','', url).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
  
  async showQrCodeSlide(){
    if(this.ischeckqrLink){
      this._mytripservice.objectDetail = this.objectDetail;
      this._mytripservice.listQrLink = this.listQrLink;
        const modal: HTMLIonModalElement = await this.modalCtrl.create({
          component: MytripTicketQrcodeSlidePage,
        });
        modal.present();
        
    }
  }
  showPrice(){
    this.expandPrice = !this.expandPrice;
  }
  ticketinfo(){
    this.isTTV=!this.isTTV;
  }
}
