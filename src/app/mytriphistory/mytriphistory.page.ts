import { Component, NgZone, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NetworkProvider } from '../network-provider.service';
import { ActivityService, GlobalFunction } from '../providers/globalfunction';
import { MytripService } from '../providers/mytrip-service.service';
import { OverlayEventDetail } from '@ionic/core';
import { UserFeedBackPage } from '../userfeedback/userfeedback';

import * as moment from 'moment';
import { C } from './../providers/constants';
import * as $ from 'jquery';
import { flightService } from '../providers/flightService';
import { ValueGlobal } from '../providers/book-service';

@Component({
  selector: 'app-mytriphistory',
  templateUrl: './mytriphistory.page.html',
  styleUrls: ['./mytriphistory.page.scss'],
})
export class MytripHistoryPage implements OnInit {
  listHistoryTrips: any = [];
  historytripcount: number=0;
  isConnected: boolean;
  hasloaddata: boolean = false;
  listFoodOrders: any=[];
  selectedTab: string= "1";
  showOnlyOne: boolean;
  myloader: any;
  nodata: boolean = false;
  memberid: any;
  listWeek: any=[];
  _infiniteScroll: any;
  totalHistoryTrip: any;
  pageIndex: number = 1;
  pageSize: number = 10;
  loadingmore: boolean;

  constructor(public _mytripservice: MytripService,
    public networkProvider: NetworkProvider,
    public gf: GlobalFunction,
    private platform: Platform,
    private navCtrl: NavController,
    private zone: NgZone,
    private storage: Storage,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    public _flightService: flightService,
    public valueGlobal: ValueGlobal,public activityService: ActivityService) { 
      this.networkProvider.getNetworkStatus().then((connected) => {
      this.isConnected = connected;
      if (!this.isConnected) {
        this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      }
    });

    this.platform.resume.subscribe(async () => {
      //this.loadMytripHistory();
    })
  }

  ngOnInit() {
    this.loadMytripHistory();
    let se = this;
    this._mytripservice.getLoadDataMytripHistorySubject().subscribe((check)=>{
      if(check){
        se.hasloaddata = true;
        se.totalHistoryTrip = se._mytripservice.totalHistoryTrip;
        se.listHistoryTrips = se._mytripservice.listHistoryTrips ? se._mytripservice.listHistoryTrips : [];
        //se.listFoodOrders = se._mytripservice.mylistOrders ? se._mytripservice.mylistOrders : [];
        se.historytripcount = se.listHistoryTrips ? se.listHistoryTrips.length : 0;
      }else{
        se.hasloaddata = false;
        se.totalHistoryTrip = 0;
        se.listHistoryTrips = [];
        //se.listFoodOrders = [];
        se.historytripcount = 0;
      }
    })
  }

  loadMytripHistory() {
    var se = this;
   
    let itemf = se.listFoodOrders.filter((o) => !o.isActive);
    if(itemf.length ==0){
      se.nodata = true;
    }
    else if(itemf.length ==1){
      se.showOnlyOne = itemf[0].detailBooking.length ==1 ? true : false;
      se.nodata = false;
    }
    else{
      se.showOnlyOne = false;
      se.nodata = false;
    }
  }

  goback(){
    this._mytripservice.backroute = "";
    if(this._mytripservice.rootPage == "homehotel"){
      //this.navCtrl.navigateBack('/app/tabs/tab3');
      this.navCtrl.back();
    }else if(this._mytripservice.rootPage == "homeflight"){
      if(this._mytripservice.backfrompage == "mytripdetail"){
        this._flightService.itemTabFlightActive.emit(true);
        this._flightService.itemMenuFlightClick.emit(2);
        this.valueGlobal.backValue = "homeflight";
        this.navCtrl.navigateBack('/app/tabs/tab1');
        this._mytripservice.backfrompage= "";
      }else{
        this.navCtrl.back();
      }
      
    }
  }

  gohomepage(){
    this.navCtrl.navigateRoot('/');
  }

  SelectHotelTab(){
    this.selectedTab = "1";
  }

  SelectFoodTab(){
    this.selectedTab = "2";
  }

  async feedback(trip: any) {
    var se = this;
    if (trip.booking_id) {
      se.gf.showLoading();
      se.checkBookingReview(trip).then((result) => {
        if (result) {
          this.activityService.objPaymentMytrip = { returnPage: 'mytrip', tripindex: se._mytripservice.currentTrip, paymentStatus: 0, bookingid: trip.HotelIdERP, trip: trip };
          se.showUserFeedBackPage(trip);
        }else{
          se.gf.hideLoading();
        }
      })
    }
  }

  async showUserFeedBackPage(trip) {
    var se = this;
    se.gf.setParams(trip, 'tripFeedBack');
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: UserFeedBackPage,
        componentProps: {
          aParameter: true,
        }
      });
    modal.present().then(()=>{
      se.gf.hideLoading();
    });

    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      this.reloadHistoryTrip();

    })
  }
  reloadHistoryTrip() {
    var se = this;
    se.presentLoadingData();
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'GET',
        //   url: C.urls.baseUrl.urlMobile + '/api/dashboard/getMyTripPaging?getall=true&getHistory=true&pageIndex=1&pageSize=100',
        //   //url: 'http://localhost:34290/api/dashboard/getmytrip?getall=true',
        //   headers:
        //   {
        //     'accept': 'application/json',
        //     'content-type': 'application/json-patch+json',
        //     authorization: text
        //   }
        // };
        let urlPath = C.urls.baseUrl.urlMobile + '/api/dashboard/getMyTripPaging?getall=true&getHistory=true&pageIndex='+se.pageIndex+'&pageSize='+se.pageSize;
        let headers = {
          'accept': 'application/json',
            'content-type': 'application/json-patch+json',
            authorization: text
        };
        this.gf.RequestApi('GET', urlPath, headers, {}, 'MytripHistory', 'reloadHistoryTrip').then((data)=>{
            if (data) {
              se.zone.run(() => {
                se.historytripcount = 0;
                se.listHistoryTrips = [];

                let lstTrips = data;
                //List trip đã đi
                se.loadMytrip(lstTrips, true);
              });
            } else {
              //if (response.statusCode != 200) {
                se.historytripcount = 0;
                se.listHistoryTrips = [];
                se.hasloaddata = true;
                se.hideloader();
                se.loadingmore = false;
             // }
            }

          

        });
      } else {
        se.hasloaddata = true;
        se.listHistoryTrips = [];
        se.historytripcount = 0;
        se.hideloader();
        se.loadingmore = false;
      }
    });
    setTimeout(() => {
      se.hideloader();
      se.loadingmore = false;
    }, 500)
  }

  getRatingStar(trip){
    let se = this;
    switch (trip.rating) {
      case 50:
        trip.RatingStar = "./assets/star/ic_star_5.svg";
        break;
      case 45:
        trip.RatingStar = "./assets/star/ic_star_4.5.svg";
        break;
      case 40:
        trip.RatingStar = "./assets/star/ic_star_4.svg";
        break;
      case 35:
        trip.RatingStar = "./assets/star/ic_star_3.5.svg";
        break;
      case 30:
        trip.RatingStar = "./assets/star/ic_star_3.svg";
        break;
      case 25:
        trip.RatingStar = "./assets/star/ic_star_2.5.svg";
        break;
      case 20:
        trip.RatingStar = "./assets/star/ic_star_2.svg";
        break;
      case 15:
        trip.RatingStar = "./assets/star/ic_star_1.5.svg";
        break;
      case 10:
        trip.RatingStar = "./assets/star/ic_star_1.svg";
        break;
      case 5:
        trip.RatingStar = "./assets/star/ic_star_0.5.svg";
        break;
      default:
        break;
    }
  }

  checkItemHasNotClaim(listItem) {
    var res = false;
    listItem.forEach(element => {
      if (!element.isClaim) {
        res = true;
        return;
      }
    });
    return res;
  }

  async checkBookingReview(trip): Promise<any> {
    var se = this;
    var result = false;
    return new Promise((resolve, reject) => {
      se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
          var text = "Bearer " + auth_token;
          var headerobj =
          {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
          }

          se.gf.RequestApi('GET', C.urls.baseUrl.urlSVC3 + 'review?BookingId=' + trip.booking_id, null, null, 'MyTrip', 'CheckBookingReview').then((data: any) => {
            if (data) {
              //Trả về isSuccess = true => chưa review
              //Trả về false => đã review hoặc có lỗi
              result = data.isSuccess && !data.isReview;
              resolve(result);
            }
          });
        }
      })
    })
  }

  async presentLoadingData() {
    this.myloader = await this.loadingCtrl.create({
    });
    this.myloader.present();
  }  
  
  async hideloader() {
    var se = this;
    if (se.myloader) {
      se.myloader.dismiss();
    }
  }


  showtripdetail(trip){
    if (trip.payment_status==1 || trip.payment_status==5) {
      if(trip){
        trip.isHistoryItem = true;
        this._mytripservice.tripdetail = trip;
        this._mytripservice.backroute = "mytriphistory";
        trip.checkInDisplayCity=trip.checkInDisplay;
        trip.checkOutDisplayCity=trip.checkOutDisplay;
        this.navCtrl.navigateForward('mytripdetail');
      }
    }

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
    catch (error:any) {
      if (error) {
        error.page = "mytrips";
        error.func = "makeCallSupport";
        C.writeErrorLog(error, null);
      };
    }
    //google analytic
    this.gf.googleAnalytion('mytrips', 'Search', 'callsupport');
  }
  getAirportByCode(code){
    var se = this, res ="";
    if(se._flightService.listAirport && se._flightService.listAirport.length >0){
      let itemmap = se._flightService.listAirport.filter((item) => { return item.code == code});
      res = (itemmap && itemmap.length >0) ? itemmap[0].airport : ""; 
    } 
    return res;
  }

  doInfinite(infiniteScroll){
    this.zone.run(() => {
      if(this.listHistoryTrips.length < this.totalHistoryTrip){
        this.pageIndex = this.pageIndex + 1;
        this.getdata(null, true);
        this._infiniteScroll = infiniteScroll;
      }
    })
  }

  loadmore(){
    this.zone.run(() => {
      this.loadingmore = true;
      if(this.listHistoryTrips.length < this.totalHistoryTrip){
        this.pageIndex = this.pageIndex + 1;
        this.getdata(null, true);
      }
    })
  }

  getdata(token, ishistory) {
    var se = this;
    if(!se.isConnected){
      se.gf.showToastWarning('Thiết bị đang không kết nối mạng, vui lòng bật kết nối để tiếp tục thao tác!');
      se.hasloaddata = true;
      return;
    }
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token || token) {
        var text = "Bearer " + (token ? token : auth_token);
        let urlPath = C.urls.baseUrl.urlMobile + '/api/dashboard/getMyTripPaging?getall=true&getHistory=true&pageIndex='+se.pageIndex+'&pageSize='+se.pageSize;
        let headers = {
          'accept': 'application/json',
            'content-type': 'application/json-patch+json',
            authorization: text
        };
        this.gf.RequestApi('GET', urlPath, headers, {}, 'MytripHistory', 'reloadHistoryTrip').then((data)=>{

          if (data && data.statusCode == 401) {
            se.storage.get('jti').then((memberid) => {
              se.storage.get('deviceToken').then((devicetoken) => {
                se.gf.refreshToken(memberid, devicetoken).then((token) => {
                  setTimeout(() => {
                    se.getdatanewtoken(token, ishistory);
                  }, 100)
                });

              })
            })
          }
          else {
            if (data) {
              se.zone.run(() => {
                let lstTrips = data;
                se.loadMytrip(lstTrips, true);
                se.hideloader();
                se.loadingmore = false;
              });
            } else {
              //if (response.statusCode != 200) {
                se.listHistoryTrips = [];
                se.hasloaddata = true;
                se.historytripcount = 0;
                se.hideloader();
                se.loadingmore = false;
             // }
              // else if (response.statusCode == 401) {
              //   se.storage.get('jti').then((memberid) => {
              //     se.storage.get('deviceToken').then((devicetoken) => {
              //       se.gf.refreshToken(memberid, devicetoken).then((token) => {
              //         setTimeout(() => {
              //           se.getdatanewtoken(token, ishistory);
              //         }, 100)
              //       });

              //     })
              //   })
              // }
            }

          }

        });
      } else {
        se.hasloaddata = true;
        se.listHistoryTrips = [];
        se.hideloader();
        se.loadingmore = false;
        se.historytripcount = 0;
      }
    });
    setTimeout(() => {
      if (se.myloader) {
        se.myloader.dismiss();
      }
    }, 1000)
  }

  getdatanewtoken(token, ishistory) {
    var se = this;
    if (token) {
      var text = "Bearer " + token;
      
      let urlPath = C.urls.baseUrl.urlMobile + '/api/dashboard/getMyTripPaging?getall=true&getHistory='+ishistory+'&pageIndex='+se.pageIndex+'&pageSize='+se.pageSize;
        let headers = {
          'accept': 'application/json',
            'content-type': 'application/json-patch+json',
            authorization: text
        };
        this.gf.RequestApi('GET', urlPath, headers, {}, 'MytripHistory', 'getdatanewtoken').then((data)=>{

          if (data) {
            se.zone.run(() => {

              let lstTrips = data;
              se.loadMytrip(lstTrips, true);
              se.hideloader();
              se.loadingmore = false;
            });
          } else {
              se.listHistoryTrips = [];
              se.hasloaddata = true;
              se.historytripcount = 0;
              se.hideloader();
              se.loadingmore = false;
          }

      });
    } else {
      se.hasloaddata = true;
      se.listHistoryTrips = [];
      se.historytripcount = 0;
      se.hideloader();
      se.loadingmore = false;
    }
    setTimeout(() => {
      if (se.myloader) {
        se.myloader.dismiss();
      }
    }, 500)
  }

  loadMytrip(listtrips, ishistory) {
    var se = this;
    if(listtrips.trips && listtrips.trips.length ==0){
      se.pageIndex =1;
    }
    se.valueGlobal.countclaim = 0;
    se.totalHistoryTrip = listtrips.total;

    let lstTrips = listtrips;
   
    //List trip đã đi
    if (lstTrips && lstTrips.trips && lstTrips.trips.length > 0) {
      lstTrips.trips.forEach(elementHis => {
        if(!se.gf.checkExistsItemInArray(se.listHistoryTrips, elementHis, 'order')){
          if (elementHis.avatar && elementHis.avatar.indexOf('i.travelapi.com') ==-1) {
            let urlavatar = elementHis.avatar.substring(0, elementHis.avatar.length - 4);
            let tail = elementHis.avatar.substring(elementHis.avatar.length - 4, elementHis.avatar.length);
            elementHis.avatar157 = urlavatar + "-" + "110x157" + tail;
            elementHis.avatar104 = urlavatar + "-" + "110x104" + tail;
            elementHis.avatar110 = urlavatar + "-" + "110x118" + tail;
          } else {
            elementHis.avatar110 = "//cdn1.ivivu.com/iVivu/2018/02/07/15/noimage-110x124.jpg";
          }
          elementHis.checkInDisplay = se.gf.getDayOfWeek(elementHis.checkInDate).daynameshort+", " + + moment(elementHis.checkOutDate).format("DD-MM-YYYY")
          elementHis.checkOutDisplay = se.gf.getDayOfWeek(elementHis.checkOutDate).daynameshort+", " + moment(elementHis.checkOutDate).format("DD-MM-YYYY")
          se.getRatingStar(elementHis);
  
          //map thông tin giống với trip future
        if (elementHis.booking_id.indexOf("FLY") == -1 && elementHis.booking_id.indexOf("VMB") == -1) {
          if (elementHis.flight_ticket_info && elementHis.flight_ticket_info.indexOf("VXR") != -1) {
            elementHis.booking_type = "COMBO_VXR";
          }
          if(elementHis.booking_id.indexOf('DL') != -1 ){
            elementHis.tourCheckinDisplay = moment(elementHis.checkInDate).format('DD-MM-YYYY');
            let _listpax = elementHis.totalPaxStr.split('|');
            _listpax = _listpax.map((p) => { return p.trim().split(' ').slice(1).join(' ').replace('n', 'N').replace('t', 'T') + ' x' + p.trim().split(' ')[0] });
            elementHis.tourListPax = _listpax;
          }
          if(elementHis.booking_type == "20" || elementHis.booking_id.indexOf('OFF') != -1 || elementHis.booking_id.indexOf('TO') != -1 ){
            elementHis.isFlyBooking = false;
              if(elementHis.hotel_name && (elementHis.room_id || elementHis.hotel_name.toUpperCase().indexOf('VOUCHER') != -1) ){
                elementHis.bookingOffType = 1;//KS
              }
              else if(elementHis.hotel_name && (elementHis.hotel_name.toUpperCase().indexOf('VIETJET') != -1 
               || elementHis.hotel_name.toUpperCase().indexOf('VIETNAM') != -1) 
               || elementHis.hotel_name.toUpperCase().indexOf('JETSTAR') != -1 
               || elementHis.hotel_name.toUpperCase().indexOf('BAMBOO') != -1
               || elementHis.hotel_name.toUpperCase().indexOf('VMB') != -1
               || elementHis.hotel_name.toUpperCase().indexOf('VÉ MÁY BAY') != -1){
                 elementHis.bookingOffType = 2;//VMB
               }
               else if(elementHis.hotel_name && (elementHis.hotel_name.toUpperCase().indexOf('TRANSFER') != -1 || elementHis.hotel_name.toUpperCase().indexOf('XE') != -1)){
                elementHis.bookingOffType = 3;//DC
               }
               else if(elementHis.booking_id.indexOf('TO') != -1 ){
                elementHis.bookingOffType = 4;//TOUR
               }
               
          }
          //if (elementHis.payment_status != 3 && elementHis.payment_status != -2) {
            if (elementHis.avatar && elementHis.avatar.indexOf("104x104") ==-1 && elementHis.avatar.indexOf('i.travelapi.com') ==-1) {
              let urlavatar = elementHis.avatar.substring(0, elementHis.avatar.length - 4);
              let tail = elementHis.avatar.substring(elementHis.avatar.length - 4, elementHis.avatar.length);
              if (tail.indexOf('jpeg') != -1) {
                 urlavatar = elementHis.avatar.substring(0, elementHis.avatar.length - 5);
                 tail = elementHis.avatar.substring(elementHis.avatar.length - 5, elementHis.avatar.length);
              }
              elementHis.avatar = urlavatar + "-" + "104x104" + tail;
            }
            if (elementHis.avatar) {
              elementHis.avatar = (elementHis.avatar.toLocaleString().trim().indexOf("http") != -1) ? elementHis.avatar : 'https:' + elementHis.avatar;
            }
            if (elementHis.delivery_payment_date) {
              let arrpaymentdate = elementHis.delivery_payment_date.split("T");
              let hour ='',day='';
              let arrday;
              if(arrpaymentdate && arrpaymentdate.length >1){
                //hour = arrpaymentdate[1].substring(0,5);
                let arrhour = arrpaymentdate[1].substring(0,5).split(":");
                if(arrhour && arrhour.length>0){
                  hour = arrhour[0].toString() + "h" + arrhour[1].toString();
                }
                  arrday = arrpaymentdate[0].split('-');
                if(arrday && arrday.length>0){
                  day = arrday[2].toString()+"-"+arrday[1].toString();
                }
              }
                elementHis.deliveryPaymentDisplay = "Trước " +hour + ", " + day;
                  let arrhours = arrpaymentdate[1].split(":");
                  let today = new Date();
                  let d = new Date(Number(arrday[0]), Number(arrday[1])-1, Number(arrday[2]),Number(arrhours[0]),Number(arrhours[1]),0);
                  let diffminutes = moment(d).diff(today, 'minutes');
                  //Quá hạn thanh toán thì không hiển thị thông tin thanh toán
                  if(diffminutes <0){
                    elementHis.deliveryPaymentDisplay = "";
                  }
            
             
              if (elementHis.extra_guest_info) {
                let arrpax = elementHis.extra_guest_info.split('|');
                if (arrpax && arrpax.length > 1 && arrpax[1] > 0) {
                  elementHis.paxDisplay = arrpax[0].toString() + " người lớn, " + arrpax[1].toString() + " trẻ em";
                } else if (arrpax && arrpax.length > 1 && arrpax[1] == 0) {
                  elementHis.paxDisplay = arrpax[0].toString() + " người lớn";
                }
              }
              if (elementHis.amount_after_tax) {
                elementHis.priceShow = Math.round(elementHis.amount_after_tax).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
              }
            }
            elementHis.isRequestTrip = false;
            //date display
            elementHis.checkInDisplay = se.gf.getDayOfWeek(elementHis.checkInDate).daynameshort+", " + moment(elementHis.checkInDate).format("DD-MM-YYYY")
            elementHis.checkOutDisplay = se.gf.getDayOfWeek(elementHis.checkOutDate).daynameshort+", " + moment(elementHis.checkOutDate).format('DD-MM-YYYY')
            se.getRatingStar(elementHis);
            if (elementHis.insuranceInfo && elementHis.insuranceInfo.adultList.length > 0) {
              if (se.checkItemHasNotClaim(elementHis.insuranceInfo.adultList) || se.checkItemHasNotClaim(elementHis.insuranceInfo.childList)) {
                se.zone.run(() => {
                  se.valueGlobal.countclaim++;
                })
              }
            }
  
            //tính giờ bay
            if(elementHis.bookingsComboData && elementHis.bookingsComboData.length >0){
              let diffhours = elementHis.bookingsComboData[0].arrivalTime.replace(':','')*1 - elementHis.bookingsComboData[0].departureTime.replace(':','')*1;
              if(diffhours){
                let str = diffhours.toString();
                let m = str.substring(str.length - 2, str.length);
                let h = str.substring(0, str.length - 2);
                h = h.length <2 ? "0"+h +"h" : h +"h";
                m = m != "00" ? m + "m" : "";
                elementHis.bookingsComboData[0].flightTimeDisplay = h + m;
              }
              let ddate = elementHis.checkInDate;
              elementHis.bookingsComboData[0].checkInDisplay = se.gf.getDayOfWeek(ddate).daynameshort+", " + moment(ddate).format('DD-MM-YYYY')
              if(elementHis.bookingsComboData[1]){
                let diffhours = elementHis.bookingsComboData[1].arrivalTime.replace(':','')*1 - elementHis.bookingsComboData[1].departureTime.replace(':','')*1;
                if(diffhours){
                  let str = diffhours.toString();
                  let m = str.substring(str.length - 2, str.length);
                  let h = str.substring(0, str.length - 2);
                  h = h.length <2 ? "0"+h +"h" : h +"h";
                  m = m != "00" ? m + "m" : "";
                  elementHis.bookingsComboData[1].flightTimeDisplay = h + m;
                }
  
                let rdate = elementHis.checkOutDate;
                elementHis.bookingsComboData[1].checkOutDisplay = se.gf.getDayOfWeek(rdate).daynameshort+", " + moment(rdate).format('DD-MM-YYYY')
              }

              elementHis.bookingsComboData.forEach(el => {
                if (el.trip_Code == "GO" || el.trip_Code == "RETURN" || el.trip_Code == "GOROUNDTRIP" || el.trip_Code == "RETURNROUNDTRIP") {
                  elementHis.isPickupDropoff = true;
                  if (el.departureDate) {
                    let newdate = el.departureDate.split('/');
                    if (newdate && newdate.length > 1) {
                      el.departureDateDisplay = newdate[0] + "." + newdate[1];
                    }

                  }

                }
              });
            }
            
          //}
        }
        //list vmb
        else{
          if(elementHis.flight_ticket_info && elementHis.flight_ticket_info.indexOf("VXR") != -1){
            elementHis.booking_type = "COMBO_VXR";
          }
          //if (elementHis.payment_status != 3 && elementHis.payment_status != -2) {
            //if (elementHis.payment_status != 3) {
            if (elementHis.avatar && elementHis.avatar.indexOf('i.travelapi.com') ==-1) {
              let urlavatar = elementHis.avatar.substring(0, elementHis.avatar.length - 4);
              let tail = elementHis.avatar.substring(elementHis.avatar.length - 4, elementHis.avatar.length);
              if (tail.indexOf('jpeg') != -1) {
                urlavatar = elementHis.avatar.substring(0, elementHis.avatar.length - 5);
                tail = elementHis.avatar.substring(elementHis.avatar.length - 5, elementHis.avatar.length);
              }
              elementHis.avatar = urlavatar + "-" + "104x104" + tail;
            }
            if (elementHis.avatar) {
              elementHis.avatar = (elementHis.avatar.toLocaleString().trim().indexOf("http") != -1) ? elementHis.avatar : 'https:' + elementHis.avatar;
            }
            if(elementHis.booking_id.indexOf("FLY") != -1 || elementHis.booking_id.indexOf("VMB") != -1){
              elementHis.isFlyBooking = true;
              elementHis.totalpricedisplay = se.gf.convertNumberToString(Math.round(elementHis.amount_after_tax));
             
              elementHis.checkInDisplay = se.gf.getDayOfWeek(elementHis.checkInDate).daynameshort+", "+ moment(elementHis.checkInDate).format("DD-MM-YYYY")
              elementHis.checkOutDisplay = se.gf.getDayOfWeek(elementHis.checkOutDate).daynameshort+", "+ moment(elementHis.checkOutDate).format("DD-MM-YYYY") 
              let departFlight = elementHis.bookingsComboData.filter((f) => { return f.departureDate == elementHis.checkInStr });
              if(departFlight && departFlight.length >0){
                elementHis.itemdepart = departFlight[0];
               
              }else{
                elementHis.itemdepart = elementHis.bookingsComboData[0];
                
              }
              elementHis.flightFrom = elementHis.itemdepart.flightFrom;
              elementHis.flightTo = elementHis.itemdepart.flightTo;
              elementHis.departAirport = se.getAirportByCode(elementHis.itemdepart.departCode);
              elementHis.returnAirport = se.getAirportByCode(elementHis.itemdepart.arrivalCode);
              
              let idxlug =0;
              elementHis.textChildDisplay = "";
              elementHis.bookingsComboData.forEach(el => {
               
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
                      const elementHislug = el.passengers[index];
                      let departElementHisLug:any= null;
                      if(idxlug ==1){
                        departElementHisLug = elementHis.bookingsComboData[idxlug-1].passengers;
                      }
                      
                      if(elementHislug.hanhLy && elementHislug.hanhLy.indexOf(':') == -1 && (elementHislug.hanhLy.replace('kg',''))*1 >0){
                        if(idxlug ==1){
                          if(departElementHisLug){
                            let itemfilter = departElementHisLug.filter((l) => { return l.arrlug && l.name == elementHislug.name});
                            if(itemfilter && itemfilter.length >0){
                              itemfilter[0].arrlug.push({lugname: el.departCode + " - " + el.arrivalCode , lugweight: elementHislug.hanhLy, lugprice: elementHislug.giaTienHanhLy})
                            }
                          }else{
                            elementHislug.arrlug.push({lugname: el.departCode + " - " + el.arrivalCode , lugweight: elementHislug.hanhLy, lugprice: elementHislug.giaTienHanhLy})
                          }
                        }else{
                            if(elementHislug.arrlug.length >0){
                              let itemfilter = elementHislug.arrlug.filter((l) => { return l.paxname == elementHislug.name});
                              if(itemfilter && itemfilter.length >0){
                                itemfilter[0].arrlug.push({lugname: el.departCode + " - " + el.arrivalCode , lugweight: elementHislug.hanhLy, lugprice: elementHislug.giaTienHanhLy})
                              }
                          }else{
                            elementHislug.arrlug.push({lugname: el.departCode + " - " + el.arrivalCode , lugweight: elementHislug.hanhLy, lugprice: elementHislug.giaTienHanhLy})
                          }
                        }
                        
                      }
                    
                    }
                   
                  }

                  elementHis.bookingsComboData.forEach(el => {
                    if (el.trip_Code == "GO" || el.trip_Code == "RETURN" || el.trip_Code == "GOROUNDTRIP" || el.trip_Code == "RETURNROUNDTRIP") {
                      elementHis.isPickupDropoff = true;
                      if (el.departureDate) {
                        let newdate = el.departureDate.split('/');
                        if (newdate && newdate.length > 1) {
                          el.departureDateDisplay = newdate[0] + "." + newdate[1];
                        }
    
                      }
    
                    }
                  });
                  
                  idxlug++;
              })
  
              if(elementHis.bookingsComboData.length >1){
                let returnFlight = elementHis.bookingsComboData.filter((f) => { return f.departureDate == elementHis.checkOutStr });
                if(returnFlight && returnFlight.length >0){
                  elementHis.itemreturn = returnFlight[0];
                  
                }else{
                  elementHis.itemreturn = elementHis.bookingsComboData[1];
                
                }
                  elementHis.textReturn = se.gf.getDayOfWeek(elementHis.itemreturn.departureDate).daynameshort + ', ' + elementHis.itemreturn.departureDate;
              }
      
              if(elementHis.bookingsComboData && elementHis.bookingsComboData[0].passengers && elementHis.bookingsComboData[0].passengers.length >0){
                elementHis.adult =0;
                elementHis.child =0;
                elementHis.infant =0;
  
                elementHis.bookingsComboData[0].passengers.forEach( (elementHislug, index) => {
                  let yearold = 18;
                  
                  if(elementHislug.dob){
                    let arr = elementHislug.dob.split('/');
                    let newdob = new Date(arr[2], arr[1]-1, arr[0]);
                    yearold = moment(elementHis.checkInDate).diff(moment(newdob), 'years');
  
                    elementHislug.isAdult = yearold > 12 ? true : false;
                    if(elementHislug.isAdult){
                      elementHis.adult += 1;
                    }else{
                      if(!elementHis.textChildDisplay){
                        elementHis.textChildDisplay = "(";
                      }
                        if(yearold< 2){
                            elementHis.infant += 1;
                            elementHislug.isInfant = true;
                            elementHis.textChildDisplay +=elementHis.textChildDisplay && elementHis.textChildDisplay.length > 1 ? ", "+(yearold >0 ? yearold : 1) : (yearold >0 ? yearold : 1);
                        }else{
                            elementHis.child += 1;
                            elementHis.textChildDisplay +=elementHis.textChildDisplay && elementHis.textChildDisplay.length > 1 ? ", "+(yearold >0 ? yearold : 1) : (yearold >0 ? yearold : 1);
                        }
                    }
                   
                      if(index == elementHis.bookingsComboData[0].passengers.length -1 && elementHis.textChildDisplay){
                          elementHis.textChildDisplay += ")";
                      }

                  }
                  
                  if(elementHislug.hanhLy && elementHislug.hanhLy.length >0 && elementHislug.hanhLy.indexOf(':') != -1){
                    elementHislug.hanhLy = elementHislug.hanhLy.replace(/\n/ig, ':');
                    let arrlug = elementHislug.hanhLy.split(':');
                    elementHislug.arrlug = [];
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
                            elementHislug.arrlug.push({lugname: elementHis.bookingsComboData[0].departCode + " - " + elementHis.bookingsComboData[0].arrivalCode , lugweight: arrlugname});
                          }
                          else if(idx == 3 && lugweight >0){
                            elementHislug.arrlug.push({lugname: elementHis.bookingsComboData[0].arrivalCode + " - " + elementHis.bookingsComboData[0].departCode, lugweight: arrlugname});
                          }
                        }
                        idx++;
                      });
                    }
                  }
  
                });
              }
            }
        }
        elementHis.isRequestTrip = false;
        if(elementHis.totalPaxStr){
          elementHis.totalPaxStr = elementHis.totalPaxStr.replace('|', ',');
        }

        se.listHistoryTrips.push(elementHis);
        se.historytripcount++;
        //}
      }

       

        if (elementHis.insuranceInfo && elementHis.insuranceInfo.adultList.length > 0) {
          if (se.checkItemHasNotClaim(elementHis.insuranceInfo.adultList) || se.checkItemHasNotClaim(elementHis.insuranceInfo.childList)) {
            se.zone.run(() => {
              se.valueGlobal.countclaim++;
            })
          }
        }
      });
    }
      

      se._mytripservice.listHistoryTrips = se.listHistoryTrips;
      se.zone.run(()=>{
        se._mytripservice.totalHistoryTripText = " (" + se.listHistoryTrips.length + ")";
      })
      //se.historytripcounttext = " (" + se.historytripcount + ")";
    
    if(se._infiniteScroll && se._infiniteScroll.target){
      se._infiniteScroll.target.complete();
    }
    
    se.hideloader();
    se.loadingmore = false;
  }

}



