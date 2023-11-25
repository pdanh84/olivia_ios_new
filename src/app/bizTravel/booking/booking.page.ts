
import { InsurrancepopoverPage } from './../../insurrancepopover/insurrancepopover.page';
import { Component, NgZone, ViewChild, OnInit, Input } from '@angular/core';
import { NavController, ModalController, AlertController, Platform, IonContent, LoadingController, PopoverController, ActionSheetController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { C } from './../../providers/constants';
import { ValueGlobal, SearchHotel } from '../../providers/book-service';
import { GlobalFunction, ActivityService } from './../../providers/globalfunction';
import { UserReviewsPage } from '../../userreviews/userreviews';
import { OverlayEventDetail } from '@ionic/core';
import { UserFeedBackPage } from '../../userfeedback/userfeedback';
import * as $ from 'jquery';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { flightService } from '../../providers/flightService';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { MytripService } from '../../providers/mytrip-service.service';

import { BizTravelService } from 'src/app/providers/bizTravelService';
import { InAppBrowserOptions,InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

import { Network } from '@capacitor/network';
import { NetworkProvider } from './../../network-provider.service';

var document:any;
@Component({
    selector: 'app-booking',
    templateUrl: './booking.page.html',
    styleUrls: ['./booking.page.scss'],
  })
  export class BookingPage {
    @Input('myScrollVanish') scrollArea:any;
    //@ViewChild(IonContent) content: IonContent;
    //@ViewChild('mySlider') slider:  ElementRef | undefined;;
    @Input() rootpage: any;
    
    public listMyTrips:any = [];
    public listHistoryTrips:any = [];
    public listRequestTrips:any = [];
    public listAlltrips:any = [];
    public listSupport:any = [];
    public currentTrip = 0;
    public currentRQTrip = 0;
    public showCalCin = false;
    public showCalCout = false;
    public datecin: Date=new Date();
    public datecout: Date=new Date();
    public cindisplay: any; coutdisplay: any;
    public cinRQdisplay: any; coutRQdisplay: any;
    public cincombodeparturedisplay: any; cincomboarrivaldisplay: any; coutcombodeparturedisplay: any; coutcomboarrivaldisplay: any;
    public cincombodeparturelocationdisplay: any; cincomboarrivallocationdisplay: any; coutcombodeparturelocationdisplay: any; coutcomboarrivallocationdisplay: any;
    public cincombodeparturetimedisplay: any; cincomboarrivaltimedisplay: any; coutcombodeparturetimedisplay: any; coutcomboarrivaltimedisplay: any;
    public cincombodepartureflightnumberdisplay: any; cincomboarrivalflightnumberdisplay: any; coutcombodepartureflightnumberdisplay: any; coutcomboarrivalflightnumberdisplay: any;
    public cin: any; cout: any; coutthu: any; cinthu: any; numberOfDay = 0; numberOfRQDay = 0;
    public hasdata = false;
    public hasloaddata = false;
    public hasloadRQdata = false;
    public activeTabTrip = 1;
    public tabtrip: string = "nexttrip";
    public isShowConfirm = false;
    private tabBarHeight: any;
    private topOrBottom: string='';
    private contentBox: any;
    public currentPosition = 0;
    public intervalID: any;
    public isRequestTrip = false;
    public isConnected: any;
    public loader: any;
    public myloader: any;
    topDealData:any = [];
    slide: any;
    Description: any;
    loginuser: any;
    mytripcount = 0;
    requestripcount = 0;
    historytripcount = 0;
    reloadcount = 0;
    arrHotelReviews: any=[];
    nexttripcounttext = '';
    historytripcounttext = ''; popover: any; arrinsurrance:any = [];
    arrchildinsurrance: any = [];
    arrchild: any = [];
    listClaimed: any=[];
    listClaimedFlightOriginal: any = [];
    firstload: any = true;
    departCodeDisplay: string='';
    arrivalCodeDisplay: string='';
    isFlyBooking: boolean = false;
    textDeparture: string='';
    textRegionDepart: string='';
    textRegionReturn: string='';
    textAirpotDepart: string='';
    textAirpotReturn: string='';
    textReturn: string='';
    textArrivalRegionDepart: string='';
    textArrivalRegionReturn: string='';
    textAirpotArrivalDepart: string='';
    textAirpotArrivalReturn: string='';
    listWeek: any = [];
    mylistOrders: any=[];
    listOrderDinnerActive: any;
    listOrderActive: any;
    loaddatadone: boolean=false;
    memberid: string='';
    foodtextorder: any;
    showOnlyOne: any;
    detail: any;
  pageIndex: any=1;
  pageSize: any=25;
  totalTrip: any=0;
  _infiniteScroll: any;
   enableheader = false;
   itemsks = [1,2,3,4,5,6];
  cincombodeparture: string='';
  cincomboarrival: string='';
  noLoginObj: any;
  childList: any;
  allowclickcalendar: boolean=false;
  myCalendar: any;
  subscription: Subscription | undefined;
  content: any;
    constructor(public platform: Platform, public navCtrl: NavController, public searchhotel: SearchHotel, public popoverController: PopoverController,
        public storage: Storage, public zone: NgZone, public modalCtrl: ModalController, public iab: InAppBrowser,
        public alertCtrl: AlertController, public valueGlobal: ValueGlobal, public gf: GlobalFunction, public loadingCtrl: LoadingController,
        private router: Router,
        private actionsheetCtrl: ActionSheetController,
        public toastCtrl: ToastController,
        public activityService: ActivityService,
        public _flightService: flightService,public clipboard: Clipboard,
        public _mytripservice: MytripService,
        public bizTravelService: BizTravelService,
        public networkProvider: NetworkProvider
        ) {
        storage.get('auth_token').then(auth_token => {
          zone.run(()=>{
            this.loginuser = auth_token;
          })
        });
        storage.get('jti').then((uid: any) => {
          if(uid){
              this.memberid = uid;
            }
        })
        //google analytic
        gf.googleAnalytion('mytrips', 'Search', '');
    
        this.storage.get("listAirport").then((data) => {
          if (!data) {
            this.loadLocation().then((data) => {
              this._flightService.listAirport = data;
            });
          } else {
            this._flightService.listAirport = data;
          }
        })
        this.ionViewWillEnter();
        this.platform.resume.subscribe(async () => {
          this.ionViewWillEnter();
          const _network = await Network.getStatus();
          if (_network.connected) {
            this.isConnected = true;
            //
            this.gf.setNetworkStatus(true);
          } else {
            this.isConnected = false;
            this.gf.setNetworkStatus(false);
            this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
            this.storage.get('listmytrips').then(data => {
              if (data) {
                this.loadMytrip(data, false);
              }
            })
          }
        })
        this.bizTravelService.checkInDate = '2021-11-01';
        this.bizTravelService.checkOutDate = '2021-11-30';
        this.bizTravelService.checkInDateDisplay = moment(this.bizTravelService.checkInDate).format("DD/MM/YYYY");
        this.bizTravelService.checkOutDateDisplay = moment(this.bizTravelService.checkOutDate).format("DD/MM/YYYY");
      }
    
      public async ngOnInit() {
        var se = this;
        //Gọi hàm refresh claim bảo hiểm khi back từ trang hoàn thành claim
        await se.refreshInsurranceInfo();
        se.subscription = se.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd && (event.url === '/app/tabs/tab3?refresh=true')) {
            se.refreshInsurranceInfo();
          }
        });

        se._mytripservice.orderPageState.pipe().subscribe((data) => {
            se.ionViewWillEnter();
            se.enableheader = true;
        })

        se._flightService.itemMenuFlightClick.pipe().subscribe((data)=> {
          if(data == 2){
            se.zone.run(()=>{
                se.enableheader = true;
              })
          }
        })

        se._mytripservice.getLoadDataWhenLoginUserSubject().subscribe((checkuser)=>{
          if(checkuser){
            se.storage.get('auth_token').then(auth_token => {
              se.zone.run(()=>{
                se.loginuser = auth_token;
              })
             
            });
            se.listMyTrips = [];
            se.hasloaddata = false;
            se.loaddatadone = false;
            se.hasdata= false;
            se.mytripcount = 0;
            se.foodtextorder= "";
            se.pageIndex=1;
            se.isConnected = true;
            if (se.networkProvider && se.networkProvider.isOnline()) {
              se.getdata(null, false);
              se.getdata(null, true);
            }
            else{
              se.isConnected = false;
              se.storage.get('listmytrips').then(data => {
                if (data) {
                  se.loadMytrip(data, false);
                }
              })
            }
          }
        })

        se._mytripservice.itemEnableHeader.pipe().subscribe((data) => {
          se.enableheader = true;
      })
      }
    
      async ionViewWillEnter() {
        var se = this;
        se.enableheader = true;
        se.storage.get('auth_token').then(auth_token => {
          se.zone.run(()=>{
            se.loginuser = auth_token;
          })
        });
        se.storage.get('jti').then((uid: any) => {
          if(uid){
              se.memberid = uid;
            }
        })
        if (se.listMyTrips.length > 0) {
          se.listMyTrips = [];
          se.mytripcount = 0;
          se.foodtextorder= "";
          se.hasloaddata = false;
          se.loaddatadone = false;
          se.hasdata= false;
          se.getdata(null, false);

          setTimeout(()=>{
            se.getdata(null, true);
          },1000)
          se.loadOrder();
          if (se.activityService.insurranceBookingId) {
            se.refreshInsurranceInfo();
          }
          if (se.mytripcount + se.requestripcount > 0) {
            let totalnexttrip = se.mytripcount * 1 + se.requestripcount * 1;
            se.nexttripcounttext = " (" + totalnexttrip + ")";
          } else {
            se.nexttripcounttext = "";
          }
          if (se.historytripcount > 0) {
            se.historytripcounttext = " (" + se.historytripcount + ")";
          }
    
          //Update trạng thái đã thanh toán nếu thanh toán từ mytrip
          if (se.listMyTrips && se.listMyTrips.length > 0 && se.activityService.objPaymentMytrip && se.activityService.objPaymentMytrip.book) {
            se.listMyTrips.forEach((element:any) => {
              if (element.HotelIdERP == se.activityService.objPaymentMytrip.trip.HotelIdERP && se.activityService.objPaymentMytrip.trip.payment_status == 1) {
                element.payment_status = 1;
              }
            });
            se.activityService.objPaymentMytrip = null;
          }
          if (se.listMyTrips && se.listMyTrips.length > 0 && se.currentTrip == se.listMyTrips.length) {
            se.currentTrip = 0;
          }
          if (se.gf.getParams('notifiBookingCode')) {
            se.storage.get('listmytrips').then(data => {
              if (data) {
                se.loadMytrip(data, false);
              }
            })
          }
    
        } else {
          se.loadPageData();
        }
        se.storage.get('auth_token').then(auth_token => {
          se.loginuser = auth_token;
        });
      }
    
      loadPageData() {
        
        if (this.gf.getParams('notifiBookingCode') && !this.gf.getParams('selectedTab3')) {
          this.activeTabTrip = 1;
          this.tabtrip = 'nexttrip';
        }
        if (this.gf.getParams('selectedTab3') && this.gf.getParams('notifiBookingCode')) {
          this.activeTabTrip = 3;
          this.tabtrip = 'historytrip';
        }
        this.storage.get('auth_token').then((data: any) => {
          this.loginuser = data;
        })
    
        if (!this.activityService.tab3Loaded || (this.activityService.tab3Loaded && this.listAlltrips.length == 0)) {
          this.mytripcount = 0;
          this.requestripcount = 0;
          this.historytripcount = 0;
          this.historytripcounttext = "";
          this.nexttripcounttext = "";
          //Kiểm tra mạng on/off để hiển thị
          if (this.networkProvider.isOnline()) {
            
            this.gf.setNetworkStatus(true);
            this.isConnected = true;
            //Có cache thì ưu tiên load cache
            this.storage.get('listmytrips').then(data => {
              if (data) {
                this.loadMytrip(data, false);
                this.activityService.tab3Loaded = true;
                //Sau 1s load lại dữ liệu mới nhất
                setTimeout(() => {
                  this.getdata(null, false);
                }, 1 * 1000);
              } else {
                setTimeout(() => {
                  this.getdata(null, false);
                  this.activityService.tab3Loaded = true;
                }, 300)
              }
            })

            this.storage.get('listmytripshistory').then(data => {
              if (data) {
                this.loadMytrip(data, true);
              }else{
                setTimeout(()=>{
                  this.getdata(null, true);
                },1000)
                
              }
            })
    
            //load dữ liệu topdeal suggest
            this.storage.get('listtopdealdefault').then((data: any) => {
              if (data && data.length > 0) {
                this.topDealData = data;
                this.loaddatatopdeal(data);
              }else{
                this.getHoteldeal();
              }
            })
          } else {
            this.isConnected = false;
            this.storage.get('listmytrips').then(data => {
              if (data) {
                this.loadMytrip(data, false);
              }
            })
          }
        } 
      }
    
      ionViewDismiss() {
        this.hasloaddata = false;
        this.loaddatadone = false;
      }
    
      ionViewWillLeave() {
        this.zone.run(() => {
          clearInterval(this.intervalID);
        })
        this.hasloaddata = false;
        this.loaddatadone = false;
      }
    
      async presentLoadingData() {
        this.myloader = await this.loadingCtrl.create({
        });
        this.myloader.present();
      }
      async presentLoadingDuration(timeout) {
        let loader = await this.loadingCtrl.create({
          message: "",
          duration: timeout
        });
        loader.present();
      }
    
      /***
       * Hàm load thông tin phòng
       */
      getListSupportByUser(auth_token) {
        var se = this;
        if (auth_token) {
          var text = "Bearer " + auth_token;
          let headers = {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
          };
          let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/BookingMemberDetailByUser';
          se.gf.RequestApi('GET', strUrl, headers, {}, 'Tab1', 'loadUserInfo').then((data) => {
                if (data) {
                  se.zone.run(() => {
                    se.listSupport = data;
                    se._mytripservice.listSupport = se.listSupport;
                  });
                } else {
                    if (se.isShowConfirm) return;
                    se.isShowConfirm = true;
                }
          })
          
        }
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
            let headers = {
              'cache-control': 'no-cache',
              'content-type': 'application/json-patch+json',
              authorization: text
            };
            let strUrl = C.urls.baseUrl.urlMobile + '/api/dashboard/getMyTripPaging?getall=true&getHistory='+ishistory+'&pageIndex='+se.pageIndex+'&pageSize='+se.pageSize;
            se.gf.RequestApi('GET', strUrl, headers, {}, 'booking', 'getdata').then((data) => {
              if (data.statusCode == 401) {
                      se.storage.get('jti').then((memberid) => {
                        se.storage.get('deviceToken').then((devicetoken) => {
                          if(devicetoken){
                          se.gf.refreshToken(memberid, devicetoken).then((token) => {
                            setTimeout(() => {
                              se.getdatanewtoken(token, ishistory);
                              se.loadOrder();
                            }, 100)
                          });
                        }
          
                        })
                      })
                    }
                    else {
                      if (data) {
                        se.zone.run(() => {
          
                          let lstTrips = data;
                          if(!ishistory){
                            se._mytripservice.listmytrips = lstTrips;
                            se.storage.get('listmytrips').then(data => {
                              if (data) {
                                se.storage.remove('listmytrips').then(() => {
                                  se.storage.set('listmytrips', lstTrips);
                                })
                              } else {
                                se.storage.set('listmytrips', lstTrips);
                              }
                            })
                            se.loadMytrip(lstTrips, ishistory);
                            
                          }else{
                            //se._mytripservice.listHistoryTrips = lstTrips.trips;
                            se.storage.get('listmytripshistory').then(data => {
                              if (data) {
                                se.storage.remove('listmytripshistory').then(() => {
                                  se.storage.set('listmytripshistory', lstTrips);
                                })
                              } else {
                                se.storage.set('listmytripshistory', lstTrips);
                              }
                            })
                            se.loadMytrip(lstTrips, ishistory);
                            se._mytripservice.totalHistoryTrip = lstTrips.total;
                          }
                          
                          se.hideloader();
                        });
                      } else {
                        if (data.statusCode != 200) {
                          se.listMyTrips = [];
                          se.listHistoryTrips = [];
                          se.hasloaddata = true;
                          se.mytripcount = 0;
                          se.historytripcount = 0;
                          se.hideloader();
          
                        }
                        else if (data.statusCode == 401) {
                          se.storage.get('jti').then((memberid) => {
                            se.storage.get('deviceToken').then((devicetoken) => {
                              if(devicetoken){
                                se.gf.refreshToken(memberid, devicetoken).then((token) => {
                                  setTimeout(() => {
                                    se.getdatanewtoken(token, ishistory);
                                  }, 100)
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
                  se.hideloader();
                  se.mytripcount = 0;
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
            let headers = {
              'cache-control': 'no-cache',
              'content-type': 'application/json-patch+json',
              authorization: text
            };
            let strUrl = C.urls.baseUrl.urlMobile + '/api/dashboard/getMyTripPaging?getall=true&getHistory='+ishistory+'&pageIndex='+se.pageIndex+'&pageSize='+se.pageSize;
            se.gf.RequestApi('GET', strUrl, headers, {}, 'booking', 'getdata').then((data) => {
              if (data) {
                      se.zone.run(() => {
                        let lstTrips = data;
                        if(!ishistory){
                          se._mytripservice.listmytrips = lstTrips;
                          se.storage.get('listmytrips').then(data => {
                            if (data) {
                              se.storage.remove('listmytrips').then(() => {
                                se.storage.set('listmytrips', lstTrips);
                              })
                            } else {
                              se.storage.set('listmytrips', lstTrips);
                            }
                          })
                          se.loadMytrip(lstTrips, ishistory);
                        }else{
                          se.storage.get('listmytripshistory').then(data => {
                            if (data) {
                              se.storage.remove('listmytripshistory').then(() => {
                                se.storage.set('listmytripshistory', lstTrips);
                              })
                            } else {
                              se.storage.set('listmytripshistory', lstTrips);
                            }
                          })
                          se.loadMytrip(lstTrips, ishistory);
                          se._mytripservice.totalHistoryTrip = lstTrips.total;
                        }
                        se.hideloader();
                      });
                    } else {
                      if (data.statusCode != 200) {
                        se.listMyTrips = [];
                        se.listHistoryTrips = [];
                        se.hasloaddata = true;
                        se.mytripcount = 0;
                        se.historytripcount = 0;
                        se.hideloader();
                      }
                    }
              })
        } else {
          se.hasloaddata = true;
          se.listMyTrips = [];
          se.listHistoryTrips = [];
          se.mytripcount = 0;
          se.historytripcount = 0;
          se.hideloader();
        }
        setTimeout(() => {
          if (se.myloader) {
            se.myloader.dismiss();
          }
        }, 500)
      }
    
      loadMytrip(listtrips, ishistory) {
        var se = this;
        se.loadLocation().then((data)=> {
          if(listtrips.trips && listtrips.trips.length ==0){
            se.pageIndex =1;
          }
          se.valueGlobal.countclaim = 0;
          se.totalTrip = listtrips.total;
          let lstTrips = listtrips;
          if(!ishistory){
            if (lstTrips && lstTrips.trips && lstTrips.trips.length > 0) {
              se.hasdata = true;
              lstTrips.trips.forEach(element => {
  
                if(!se.gf.checkExistsItemInArray(se.listMyTrips, element, 'order')){
                  if (element.booking_id && (element.booking_id.indexOf("FLY") == -1 && element.booking_id.indexOf("VMB") == -1) && element.booking_type != "CB_FLY_HOTEL") {
                    if (element.flight_ticket_info && element.flight_ticket_info.indexOf("VXR") != -1) {
                      element.booking_type = "COMBO_VXR";
                    }
                    element.isFlyBooking = false;
                    
                      if (element.avatar && element.avatar.indexOf("104x104") ==-1  && element.avatar.indexOf('i.travelapi.com') ==-1) {
                        let urlavatar = "";
                        let tail = "";
                        if(element.avatar.indexOf('jpeg') != -1){
                          urlavatar = element.avatar.substring(0, element.avatar.length - 5);
                          tail = element.avatar.substring(element.avatar.length - 5, element.avatar.length);
                        }else{
                          urlavatar = element.avatar.substring(0, element.avatar.length - 4);
                          tail = element.avatar.substring(element.avatar.length - 4, element.avatar.length);
                        }
                        element.avatar = urlavatar + "-" + "104x104" + tail;
                      }
                      if (element.delivery_payment_date) {
                        let arrpaymentdate = element.delivery_payment_date.split("T");
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
                        let d = new Date(Number(arrday[0]), Number(arrday[1])-1, Number(arrday[2]),Number(arrhours[0]),Number(arrhours[1]),0);
                        let diffminutes = moment(d).diff(today, 'minutes');
                        //Quá hạn thanh toán thì không hiển thị thông tin thanh toán
                        if(diffminutes <0){
                          element.deliveryPaymentDisplay = "";
                        }
                        else{
                          element.delivery_payment_date_display = "Hạn thanh toán trước "+moment(element.delivery_payment_date).format("HH:mm") +" "+ se.gf.getDayOfWeek(element.delivery_payment_date).dayname +", "+ moment(element.delivery_payment_date).format("DD") + " thg " + moment(element.delivery_payment_date).format("MM") + ", " + moment(element.delivery_payment_date).format("YYYY");
                          if (!(element.pay_method==3||element.pay_method==51||element.pay_method==2)) {
                            var obj=se.gf.getbank(element.pay_method);
                            element.urlimgbank =obj.urlimgbank;
                            element.textbank =obj.textbank;
                            element.accountNumber =obj.accountNumber;
                            element.bankName =obj.bankName;
                            element.url =obj.url;
                          } else if (element.pay_method==3) {
                            if(element.payment_info && element.payment_info.length >0){
                              element.payment_info=JSON.parse(element.payment_info);
                            }
                            if(element.payment_info){
                              element.PaymentCode=element.payment_info.PaymentCode;
                            }
                            
                          }
                        
                        }
                        if (diffminutes<60) {
                          element.paymentBefore = diffminutes+"'";
                          if(diffminutes<15){
                            element.deliveryPaymentDisplay = "";
                          }
                        }else if (diffminutes>=60){
                          let hours = Math.floor(diffminutes/60);
                          let minutes = diffminutes - (hours * 60);
                            element.paymentBefore = hours +"h"+minutes+"'";
                        }
                      
                        if (element.extra_guest_info) {
                          let arrpax = element.extra_guest_info.split('|');
                          if (arrpax && arrpax.length > 1 && arrpax[1] > 0) {
                            element.paxDisplay = arrpax[0].toString() + " người lớn, " + arrpax[1].toString() + " trẻ em";
                          } else if (arrpax && arrpax.length > 1 && arrpax[1] == 0) {
                            element.paxDisplay = arrpax[0].toString() + " người lớn";
                          }
                        }
                        if (element.amount_after_tax) {
                          element.priceShow = Math.round(element.amount_after_tax).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
                        }
                      }

                      if(element.booking_type == "20" || element.booking_id.indexOf('OFF') != -1 || element.booking_id.indexOf('TO') != -1){
                        if(element.hotel_name && (element.room_id || element.hotel_name.toUpperCase().indexOf('VOUCHER') != -1) ){
                          element.bookingOffType = 1;//KS
                        }
                        else if(element.hotel_name && (element.hotel_name.toUpperCase().indexOf('VIETJET') != -1 
                         || element.hotel_name.toUpperCase().indexOf('VIETNAM') != -1) 
                         || element.hotel_name.toUpperCase().indexOf('JETSTAR') != -1 
                         || element.hotel_name.toUpperCase().indexOf('BAMBOO') != -1
                         || element.hotel_name.toUpperCase().indexOf('VMB') != -1
                         || element.hotel_name.toUpperCase().indexOf('VÉ MÁY BAY') != -1){
                           element.bookingOffType = 2;//VMB
                         }
                         else if(element.hotel_name && (element.hotel_name.toUpperCase().indexOf('TRANSFER') != -1 || element.hotel_name.toUpperCase().indexOf('XE') != -1)){
                          element.bookingOffType = 3;//DC
                         }else if(element.booking_id.indexOf('TO') != -1){
                          element.bookingOffType = 4;//TOUR
                         }
                         element.delivery_payment_date_display ="";
                      }

                      element.isRequestTrip = false;
                      //date display
                      element.checkInDisplay = se.gf.getDayOfWeek(element.checkInDate).daynameshort+", " + moment(element.checkInDate).format('DD') +" thg "+moment(element.checkInDate).format('MM');
                      element.checkOutDisplay = se.gf.getDayOfWeek(element.checkOutDate).daynameshort+", " + moment(element.checkOutDate).format('DD') +" thg "+moment(element.checkOutDate).format('MM');

                      element.checkInDisplayShort = se.gf.getDayOfWeek(element.checkInDate).daynameshort+", " + moment(element.checkInDate).format('DD') +" thg "+moment(element.checkInDate).format('MM');
                      element.checkOutDisplayShort = se.gf.getDayOfWeek(element.checkOutDate).daynameshort+", " + moment(element.checkOutDate).format('DD') +" thg "+moment(element.checkOutDate).format('MM');
                      
                      se.getRatingStar(element);
                      se.listMyTrips.push(element);
                      se.mytripcount++;
                      if (element.insuranceInfo && element.insuranceInfo.adultList.length > 0) {
                        if (se.checkItemHasNotClaim(element.insuranceInfo.adultList) || se.checkItemHasNotClaim(element.insuranceInfo.childList)) {
                          se.zone.run(() => {
                            se.valueGlobal.countclaim++;
                          })
                        }
                      }
          
                      //tính giờ bay
                      if(element.bookingsComboData && element.bookingsComboData.length >0){
                        let diffhours = element.bookingsComboData[0].arrivalTime ? element.bookingsComboData[0].arrivalTime.replace(':','')*1 - element.bookingsComboData[0].departureTime.replace(':','')*1 : 0;
                        if(diffhours){
                          let str = diffhours.toString();
                          let m = str.substring(str.length - 2, str.length);
                          let h = str.substring(0, str.length - 2);
                          h = h.length <2 ? "0"+h +"h" : h +"h";
                          m = m != "00" ? m + "m" : "";
                          element.bookingsComboData[0].flightTimeDisplay = h + m;
                        }
                        let ddate = element.checkInDate;
                        element.bookingsComboData[0].checkInDisplay = se.gf.getDayOfWeek(ddate).dayname+", " + moment(ddate).format('DD') +" thg "+moment(ddate).format('MM');
                        if(element.bookingsComboData[1]){
                          let diffhours = element.bookingsComboData[1].arrivalTime ? element.bookingsComboData[1].arrivalTime.replace(':','')*1 - element.bookingsComboData[1].departureTime.replace(':','')*1 : 0;
                          if(diffhours){
                            let str = diffhours.toString();
                            let m = str.substring(str.length - 2, str.length);
                            let h = str.substring(0, str.length - 2);
                            h = h.length <2 ? "0"+h +"h" : h +"h";
                            m = m != "00" ? m + "m" : "";
                            element.bookingsComboData[1].flightTimeDisplay = h + m;
                          }
          
                          let rdate = element.checkOutDate;
                          element.bookingsComboData[1].checkOutDisplay = se.gf.getDayOfWeek(rdate).dayname+", " + moment(rdate).format('DD') +" thg "+moment(rdate).format('MM')
                        }
                        element.arrPickupDropoff = [];
                        element.bookingsComboData.forEach(el => {
                          if(el.trip_Code == "GO" || el.trip_Code == "RETURN" || el.trip_Code == "GOROUNDTRIP" || el.trip_Code == "RETURNROUNDTRIP"){
                            element.isPickupDropoff = true;
                            el.sortPD = el.trip_Code == "GO" ? 1 : (el.trip_Code == "GOROUNDTRIP" ? 2 : (el.trip_Code == "RETURN" ? 3 : 4));
                            element.arrPickupDropoff.push(el);
                              if(el.departureDate){
                                let newdate = el.departureDate.split('/');
                                if(newdate && newdate.length >1){
                                  el.departureDateDisplay = newdate[0] + "." + newdate[1];
                                }
                                
                              }
                              
                          }

                            if (el.airlineName.toLowerCase().indexOf('cathay') != -1) {
                                element.hasCathay = true;
                            }
                        });

                        if(element.arrPickupDropoff && element.arrPickupDropoff.length >0){
                          se.zone.run(() => element.arrPickupDropoff.sort(function (a, b) {
                            return a.sortPD - b.sortPD;
                          }))
                        }
                      }
                  }
                  else{
                    if(element.flight_ticket_info && element.flight_ticket_info.indexOf("VXR") != -1){
                      element.booking_type = "COMBO_VXR";
                    }
                        if (element.avatar && element.avatar.indexOf("104x104") ==-1  && element.avatar.indexOf('i.travelapi.com') ==-1) {
                        let urlavatar = element.avatar.substring(0, element.avatar.length - 4);
                        let tail = element.avatar.substring(element.avatar.length - 4, element.avatar.length);
                        element.avatar = urlavatar + "-" + "104x104" + tail;
                      }
                      if(element.booking_id && (element.booking_id.indexOf("FLY") != -1 || element.booking_id.indexOf("VMB") != -1 || element.booking_type == "CB_FLY_HOTEL") ){
                        element.isFlyBooking = true;
                        element.totalpricedisplay = se.gf.convertNumberToString(Math.round(element.amount_after_tax));
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
                            if (!(element.pay_method==3||element.pay_method==51||element.pay_method==2)) {
                              var obj=se.gf.getbank(element.pay_method);
                              element.urlimgbank =obj.urlimgbank;
                              element.textbank =obj.textbank;
                              element.accountNumber =obj.accountNumber;
                              element.bankName =obj.bankName;
                              element.url =obj.url;
                            } else if (element.pay_method==3 && element.payment_info) {
                              element.payment_info=JSON.parse(element.payment_info);
                              element.PaymentCode=element.payment_info.PaymentCode
                            }
                          }
                            
                        }
                        element.checkInDisplay = se.gf.getDayOfWeek(element.checkInDate).dayname +", "+ moment(element.checkInDate).format("DD") + " thg " + moment(element.checkInDate).format("MM");
                        element.checkOutDisplay = se.gf.getDayOfWeek(element.checkOutDate).dayname +", "+ moment(element.checkOutDate).format("DD") + " thg " + moment(element.checkOutDate).format("MM");

                        element.checkInDisplayShort = se.gf.getDayOfWeek(element.checkInDate).daynameshort+", " + moment(element.checkInDate).format('DD') +" thg "+moment(element.checkInDate).format('MM');
                        element.checkOutDisplayShort = se.gf.getDayOfWeek(element.checkOutDate).daynameshort+", " + moment(element.checkOutDate).format('DD') +" thg "+moment(element.checkOutDate).format('MM');

                        let departFlight = element.bookingsComboData.filter((f) => { return moment(f.departureDate).format('DD-MM-YYYY') == moment(element.checkInDate).format('DD-MM-YYYY')&& f.airlineCode });
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
                        element.textChildDisplay = "";
                        //đi chung
                        element.arrPickupDropoff = [];
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
                                
                                if(elementlug.hanhLy && elementlug.hanhLy.indexOf(':') == -1 && ((elementlug.hanhLy.replace('kg',''))*1 >0 || elementlug.seatNumber)){
                                  if(idxlug ==1){
                                    if(departElementLug){
                                      let itemfilter = departElementLug.filter((l) => { return l.arrlug && l.name == elementlug.name});
                                      if(itemfilter && itemfilter.length >0){
                                        itemfilter[0].arrlug.push({lugname: el.departCode + " - " + el.arrivalCode , lugweight: elementlug.hanhLy, lugprice: (elementlug.hanhLy.replace('kg','')*1 >0 ? elementlug.giaTienHanhLy : 0), seatnumber: elementlug.seatNumber})
                                      }
                                      else{
                                        if(elementlug.seatNumber){
                                          itemfilter[0].arrlug.push({lugname: el.departCode + " - " + el.arrivalCode , lugweight: "", lugprice: 0, seatnumber: elementlug.seatNumber})
                                        }
                                      }
                                    }else{
                                      elementlug.arrlug.push({lugname: el.departCode + " - " + el.arrivalCode , lugweight: elementlug.hanhLy, lugprice: (elementlug.hanhLy.replace('kg','')*1 >0 ? elementlug.giaTienHanhLy : 0), seatnumber: elementlug.seatNumber})
                                    }
                                  }else{
                                      if(elementlug.arrlug.length >0){
                                        let itemfilter = elementlug.arrlug.filter((l) => { return l.paxname == elementlug.name});
                                        if(itemfilter && itemfilter.length >0){
                                          itemfilter[0].arrlug.push({lugname: el.departCode + " - " + el.arrivalCode , lugweight: elementlug.hanhLy, lugprice: (elementlug.hanhLy.replace('kg','')*1 >0 ? elementlug.giaTienHanhLy : 0), seatnumber: elementlug.seatNumber})
                                        }
                                        else{
                                          if(elementlug.seatNumber){
                                            itemfilter[0].arrlug.push({lugname: el.departCode + " - " + el.arrivalCode , lugweight: "", lugprice: 0, seatnumber: elementlug.seatNumber})
                                          }
                                        }
                                    }else{
                                      elementlug.arrlug.push({lugname: el.departCode + " - " + el.arrivalCode , lugweight: elementlug.hanhLy, lugprice: (elementlug.hanhLy.replace('kg','')*1 >0 ? elementlug.giaTienHanhLy : 0), seatnumber: elementlug.seatNumber})
                                    }
                                  }
                                }
                              }
                            }
                            if(el.trip_Code == "GO" || el.trip_Code == "RETURN" || el.trip_Code == "GOROUNDTRIP" || el.trip_Code == "RETURNROUNDTRIP"){
                              element.isPickupDropoff = true;
                              el.sortPD = el.trip_Code == "GO" ? 1 : (el.trip_Code == "GOROUNDTRIP" ? 2 : (el.trip_Code == "RETURN" ? 3 : 4));
                              element.arrPickupDropoff.push(el);
                              if(el.departureDate){
                                let newdate = el.departureDate.split('/');
                                if(newdate && newdate.length >1){
                                  el.departureDateDisplay = newdate[0] + "." + newdate[1];
                                }
                              }
                            }
                            idxlug++;
                        })

                        if(element.arrPickupDropoff && element.arrPickupDropoff.length >0){
                          se.zone.run(() => element.arrPickupDropoff.sort(function (a, b) {
                            return a.sortPD - b.sortPD;
                          }))
                        }
                        if(element.bookingsComboData.length >1){
                          let returnFlight = element.bookingsComboData.filter((f) => { return moment(f.departureDate).format('DD-MM-YYYY') == moment(element.checkOutDate).format('DD-MM-YYYY') && f.airlineCode });
                          if(returnFlight && returnFlight.length >0){
                            element.itemreturn = returnFlight[0];
                          }else{
                            element.itemreturn = element.bookingsComboData[1];
                          }
                            element.textReturn = se.getDayOfWeek(element.itemreturn.departureDate) + ', ' + element.itemreturn.departureDate;
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
                              let arr = [];
                              if(elementlug.dob && elementlug.dob.indexOf('/') != -1){
                                arr = elementlug.dob.split('/');
                              }
                              else if(elementlug.dob && elementlug.dob.indexOf('-') != -1){
                                arr = elementlug.dob.split('-');
                              }
                              if(arr.length >0){
                                let newdob = new Date(Number(arr[2]), Number(arr[1]-1), Number(arr[0]));
                                yearold = moment(element.checkInDate).diff(moment(newdob), 'years');
                              }
                              elementlug.isAdult = yearold > 12 ? true : false;
                              if(elementlug.isAdult){
                                element.adult += 1;
                              }else{
                                if(!element.textChildDisplay){
                                  element.textChildDisplay = "(";
                                }
                                  if(yearold< 2){
                                      element.infant += 1;
                                      elementlug.isInfant = true;
                                      element.textChildDisplay +=element.textChildDisplay  && element.textChildDisplay.length > 1 ? ", "+(yearold >0 ? yearold : 1) : (yearold >0 ? yearold : 1);
                                  }else{
                                      element.child += 1;
                                      element.textChildDisplay +=element.textChildDisplay && element.textChildDisplay.length > 1 ? ", "+(yearold >0 ? yearold : 1) : (yearold >0 ? yearold : 1);
                                  }
                              }
                              if(index == element.bookingsComboData[0].passengers.length -1 && element.textChildDisplay){
                                element.textChildDisplay += ")";
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
                                  }
                                  idx++;
                                });
                              }
                            }
                          });
                        }
                      }
                      if(element.delivery_payment_date){
                        let arrpaymentdate = element.delivery_payment_date.split("T");
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
                        element.delivery_payment_date_display = "Hạn thanh toán trước "+moment(element.delivery_payment_date).format("HH:mm") +" "+ se.gf.getDayOfWeek(element.delivery_payment_date).dayname +", "+ moment(element.delivery_payment_date).format("DD") + " thg " + moment(element.delivery_payment_date).format("MM") + ", " + moment(element.delivery_payment_date).format("YYYY");
                        let arrhours = arrpaymentdate[1].split(":");
                        let today = new Date();
                        let d = new Date(Number(arrday[0]), Number(arrday[1])-1, Number(arrday[2]),Number(arrhours[0]),Number(arrhours[1]),0);
                        let diffminutes = moment(d).diff(today, 'minutes');
                        //Quá hạn thanh toán thì không hiển thị thông tin thanh toán
                        if(diffminutes <0){
                          element.deliveryPaymentDisplay = "";
                          element.delivery_payment_date_display = "";
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
                          element.priceShow = Math.round(element.amount_after_tax).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
                        }
                      }
                      element.isRequestTrip = false;
                      if(element.totalPaxStr){
                        element.totalPaxStr = element.totalPaxStr.replace('|', ',');
                      }
                if (element.bookingsComboData) {
                  let Temp:any = [];
                  Temp.push(element.bookingsComboData);
                  if (Temp) {
                    let Temp_Cathay:any = [];
                    Temp.forEach(function (item) {

                      Temp_Cathay.push(
                        item.filter(function (word) {
                          return word.airlineName.toLowerCase().includes("cathay");
                        })
                      );
                    });
                    if (
                      Temp_Cathay[0] &&
                      Temp_Cathay[0][0] && Temp_Cathay[0][0].passengers &&
                      Temp_Cathay[0][0].passengers.length > 0
                    )
                    {
                      element.IsCathay = true;
                      element.hasCathay = true;
                    }
                    else {
                      element.IsCathay = false;
                    }
                    if (element.IsCathay && element.itemdepart && element.itemdepart.passengers.length>0) {
                      element.itemdepart.passengers.forEach(el => {
                        for (let i = 0; i < Temp_Cathay[0][0].passengers.length; i++) {
                          if (el.name.toLowerCase().trim() == Temp_Cathay[0][0].passengers[i].name.toLowerCase().trim()) {
                            el.IsCathay = true;
                            break;
                          }
                        }
                      })
                    }
                  }
                }
                      if(element.booking_id && (element.booking_id.indexOf("FLY") != -1 || element.booking_id.indexOf("VMB") != -1 || element.booking_type == "CB_FLY_HOTEL") ){
                          se.listMyTrips.push(element);
                          se.mytripcount++;
                      }
                  }
                }
              });
            }
  
            if(lstTrips && lstTrips.requestPrices && lstTrips.requestPrices.length >0){
                lstTrips.requestPrices.forEach(element => {
                  if(!se.gf.checkExistsItemInArray(se.listMyTrips, element, 'order')){
                    if(element.request_id.indexOf("HTBKG") == -1){
                      let urlavatar = "", tail ="";
                      if(element.hotelAvatar.indexOf('i.travelapi.com') ==-1){
                        if(element.hotelAvatar.indexOf('jpeg') != -1){
                          urlavatar = element.hotelAvatar.substring(0, element.hotelAvatar.length - 5);
                          tail = element.hotelAvatar.substring(element.hotelAvatar.length - 5, element.hotelAvatar.length);
                        }else{
                          urlavatar = element.hotelAvatar.substring(0, element.hotelAvatar.length - 4);
                          tail = element.hotelAvatar.substring(element.hotelAvatar.length - 4, element.hotelAvatar.length);
                        }

                        element.avatar = urlavatar + "-" + "104x104" + tail;
                      }else{
                        element.avatar = element.hotelAvatar;
                      }
                      
                      element.isRequest = true;
                      element.booking_id = element.request_id;
                      element.checkInDisplay = se.gf.getDayOfWeek(element.start_date).daynameshort+", " + moment(element.start_date).format('DD') +" thg "+moment(element.start_date).format('MM');
                      element.checkOutDisplay = se.gf.getDayOfWeek(element.end_date).daynameshort+", " + moment(element.end_date).format('DD') +" thg "+moment(element.end_date).format('MM');
  
                      element.checkInDisplayShort = se.gf.getDayOfWeek(element.start_date).daynameshort+", " + moment(element.start_date).format('DD') +" thg "+moment(element.start_date).format('MM');
                      element.checkOutDisplayShort = se.gf.getDayOfWeek(element.end_date).daynameshort+", " + moment(element.end_date).format('DD') +" thg "+moment(element.end_date).format('MM');
  
                      element.address = element.hotelAddress;
                      element.totalPaxStr = "" + (element.total_adult ? element.total_adult + " người lớn" : "") + (element.total_child ? ", " + element.total_child + " trẻ em" : "");
                      se.getRatingStar(element);
                      se.listMyTrips.push(element);
                      se.mytripcount++;
                    }
                    
                  }
                });
            }
  
            se._mytripservice.listMyTrips = se.listMyTrips;
            let idx1 = 0;
            if (se.gf.getParams('mytripbookingdetail') && se.gf.getParams('mytripbookingdetail').currentTrip) {
                idx1 = se.gf.getParams('mytripbookingdetail').currentTrip;
                se.currentTrip = idx;
            }
    
            se.sortMytrip();
    
            if (se.listMyTrips.length > 0) {
              //Tạm thời gọi api get notifi để build lại thông tin thay đổi chuyến bay nếu có
              se.loadUserNotificationAndMapFlightChange();
    
              if (se.gf.getParams('notifiBookingCode') && se.listMyTrips.length > 1) {
                //Map số bkg trong listtrip để focus vào bkg được notifi
                var idxMap = se.listMyTrips.map((item, index) => {
                  return item.booking_id == se.gf.getParams('notifiBookingCode');
                });
                if (idxMap && idxMap.length > 0) {
                  var idx = idxMap.findIndex((el) => { return el == true });
                  se.currentTrip = idx;
                  se.gf.setParams('','notifiBookingCode');
                  se.showtripdetail(se.listMyTrips[idx]);
                }
              }
    
              //Map item được claim nếu có load lại dữ liệu
              if (se.activityService.insurranceBookingId) {
                var idxMap = se.listMyTrips.map((item, index) => {
                  return item.booking_id == se.activityService.insurranceBookingId;
                });
                if (idxMap && idxMap.length > 0) {
                  var idx = idxMap.findIndex((el) => { return el == true });
                  se.currentTrip = idx;
                }
              }

              if(se.listMyTrips.length ==1 && se.listMyTrips[0].bookingsComboData && se.listMyTrips[0].bookingsComboData.length >0){
                se.listMyTrips[0].bookingsComboData.forEach(element => {
                if (element.airlineName.toLowerCase().indexOf('cathay') != -1) {
                  //Add bảo hiểm
                  se.getCathayClaimInfo(se.listMyTrips[0].booking_id).then((data)=> {
                  let objData = data;
                  if(objData.insurObj){
                    let dataCathay = objData.insurObj;
                    se.listMyTrips[0].hasCathay = true;
                   dataCathay.adultList.forEach(objAdult => {
                     if(!objAdult.claimedFlights ){
                      let itemAdult = { claimed: objAdult.claimedFlights, insurance_code: objAdult.insurance_code, customer_name: objAdult.customer_name, customer_id: objAdult.customer_cmnd, customer_address: '', customer_dob: objAdult.customer_dob};
                      if(!se.gf.checkExistsItemInArray(se.arrinsurrance, itemAdult, 'cathay')){
                        se.arrinsurrance.push(itemAdult);
                      }
                     }else{
                      objAdult.flightObj.forEach((f) => {
                        var objmap = objAdult.claimedFlights.filter((cf) => f.flightNumner && cf == f.flightNumner.replace(' ',''));
                        if(objmap && objmap.length >0){
                          se.listClaimed.push({ flight_number: objmap[0], insurance_code: objAdult.insurance_code, bookingid: objAdult.booking_id });
                        }
                      });
                      var claimedDone;
                      if (objData.flightObj[1].airlineCode && objData.flightObj[1].airlineName.toLowerCase().indexOf('cathay') == -1 ) {
                        claimedDone = objAdult.claimedFlights.filter((cf, i, arr) => { return arr.indexOf(arr.find(t => t === cf)) === i }).length > 1;
                      }
                      else {
                        claimedDone = objAdult.claimedFlights.filter((cf, i, arr) => { return arr.indexOf(arr.find(t => t === cf)) === i }).length > 0;
                      }
                      let itemAdult = { claimed: claimedDone, insurance_code: objAdult.insurance_code, customer_name: objAdult.customer_name, customer_id: objAdult.customer_cmnd, customer_address: '', customer_dob: objAdult.customer_dob };
                      if(!se.gf.checkExistsItemInArray(se.arrinsurrance, itemAdult, 'cathay')){
                        se.arrinsurrance.push(itemAdult);
                      }
                     }
                    });
                      dataCathay.childList.forEach(objChild => {
                        if(!objChild.claimedFlights){
                          let itemChild = { claimed: objChild.claimedFlights, insurance_code: objChild.insurance_code, customer_name: objChild.customer_name, customer_id: objChild.customer_cmnd, customer_address: '', customer_dob: objChild.customer_dob, 
                          name: objChild.customer_name,id: objChild.insurance_code, birth: objChild.customer_dob};
                          if(!se.gf.checkExistsItemInArray(se.arrchildinsurrance, itemChild, 'cathay')){
                            se.arrchildinsurrance.push(itemChild);
                            se.arrchild.push(itemChild);
                          }
                        }else{
                          objChild.flightObj.forEach((f) => {
                            var objmap = objChild.claimedFlights.filter((cf) => f.flightNumner && cf == f.flightNumner.replace(' ',''));
                            if(objmap && objmap.length >0){
                              se.listClaimed.push({ flight_number: objmap[0], insurance_code: objChild.insurance_code, bookingid: objChild.booking_id });
                            }
                          });
                          var claimedDone;
                          if (objData.flightObj[1].airlineCode && objData.flightObj[1].airlineName.toLowerCase().indexOf('cathay') == -1 ) {
                            claimedDone = objChild.claimedFlights.filter((cf, i, arr) => { return arr.indexOf(arr.find(t => t === cf)) === i }).length > 1;
                          } else {
                            claimedDone = objChild.claimedFlights.filter((cf, i, arr) => { return arr.indexOf(arr.find(t => t === cf)) === i }).length > 0;
                          }
                          let itemChild = {
                            claimed: claimedDone, insurance_code: objChild.insurance_code, customer_name: objChild.customer_name, customer_id: objChild.customer_cmnd, customer_address: '', customer_dob: objChild.customer_dob,
                            name: objChild.customer_name, id: objChild.insurance_code, birth: objChild.customer_dob
                          };
                          if(!se.gf.checkExistsItemInArray(se.arrchildinsurrance, itemChild, 'cathay')){
                            se.arrchildinsurrance.push(itemChild);
                            se.arrchild.push(itemChild);
                          }
                        }
                      });
                  }
                   //check cathay VMB
                   if (se.listMyTrips[0] && se.listMyTrips[0].itemdepart && se.arrinsurrance.length > 0) {
                    se.listMyTrips[0].itemdepart.passengers.forEach((item) => {
                      for (let i = 0; i < se.arrinsurrance.length; i++) {
                        if (item.name.toLowerCase().trim() == se.arrinsurrance[i].customer_name.toLowerCase().trim()) {
                          item.claimed = se.arrinsurrance[i].claimed;
                          break;
                        }
                      }
                    });
                  }
                  if (se.listMyTrips[0] && se.listMyTrips[0].itemdepart && se.arrchildinsurrance.length > 0) {
                    se.listMyTrips[0].itemdepart.passengers.forEach((item) => {
                      for (let i = 0; i < se.arrchildinsurrance.length; i++) {
                        if (item.name.toLowerCase().trim() == se.arrchildinsurrance[i].customer_name.toLowerCase().trim()) {
                          item.claimed = se.arrchildinsurrance[i].claimed;
                          break;
                        }
                      }
                    });
                  }
                })

                let arrcd = se.listMyTrips[0].bookingsComboData[0].departureDate.split('-');
                let nd = new Date(arrcd[2], arrcd[1] - 1, arrcd[0]);
                se.cincombodeparture = moment(nd).format('YYYY-MM-DD');
  
                if (se.listMyTrips[0].bookingsComboData && se.listMyTrips[0].bookingsComboData.length > 1) {
                  se.departCodeDisplay = se.listMyTrips[0].bookingsComboData[0].departCode + ' → ' + se.listMyTrips[0].bookingsComboData[0].arrivalCode;
                  if (se.listMyTrips[0].bookingsComboData.length > 1) {
                    se.arrivalCodeDisplay = se.listMyTrips[0].bookingsComboData[1].departCode + ' → ' + se.listMyTrips[0].bookingsComboData[1].arrivalCode;
                  }
  
                  if(!se.cincombodepartureflightnumberdisplay){
                    se.cincombodepartureflightnumberdisplay = se.listMyTrips[0].bookingsComboData[0].flightNumner;
                  }
  
                  if(!se.cincomboarrivalflightnumberdisplay){
                    se.cincomboarrivalflightnumberdisplay = se.listMyTrips[0].bookingsComboData[1].flightNumner;
                  }

                  if(se.listMyTrips[0].bookingsComboData[1] && se.listMyTrips[0].bookingsComboData[1].departCode){
                    let arrca = se.listMyTrips[0].bookingsComboData[1].departureDate.split('-');
                    let nd = new Date(arrca[2], arrca[1] - 1, arrca[0]);
                    se.cincomboarrival= moment(nd).format('YYYY-MM-DD');
                  }
                }
                  }
                })

                if(!se.listMyTrips[0].hasCathay){
                  se.arrinsurrance = [];
                }
              }
    
            } else {
              se.hasdata = false;
            }
            se.zone.run(()=>{
              se.hasloaddata = true;
              se.hasdata = true;
            })
           
            setTimeout(() => {
              if (se.myloader) {
                se.myloader.dismiss();
              }
              if (se.mytripcount + se.requestripcount > 0) {
                se.nexttripcounttext = " (" + (se.mytripcount + se.requestripcount) + ")";
              } else {
                se.nexttripcounttext = "";
              }
    
            }, 300);
            se.getListSupportByUser(this.loginuser);
          }
          //List trip đã đi
          else {
            if (lstTrips && lstTrips.trips && lstTrips.trips.length > 0) {
            lstTrips.trips.forEach(elementHis => {
              if(!se.gf.checkExistsItemInArray(se.listMyTrips, elementHis, 'order')){
                if (elementHis.avatar  && elementHis.avatar.indexOf('i.travelapi.com') ==-1) {
                  let urlavatar = elementHis.avatar.substring(0, elementHis.avatar.length - 4);
                  let tail = elementHis.avatar.substring(elementHis.avatar.length - 4, elementHis.avatar.length);
                  elementHis.avatar157 = urlavatar + "-" + "110x157" + tail;
                  elementHis.avatar104 = urlavatar + "-" + "110x104" + tail;
                  elementHis.avatar110 = urlavatar + "-" + "110x118" + tail;
                } else {
                  elementHis.avatar110 = "//cdn1.ivivu.com/iVivu/2018/02/07/15/noimage-110x124.jpg";
                }
                elementHis.checkInDisplay = se.gf.getDayOfWeek(elementHis.checkInDate).daynameshort+", " + moment(elementHis.checkInDate).format('DD') +" thg "+moment(elementHis.checkInDate).format('MM');
                elementHis.checkOutDisplay = se.gf.getDayOfWeek(elementHis.checkOutDate).daynameshort+", " + moment(elementHis.checkOutDate).format('DD') +" thg "+moment(elementHis.checkOutDate).format('MM');
                se.getRatingStar(elementHis);
        
                //map thông tin giống với trip future
              if (elementHis.booking_id.indexOf("FLY") == -1 && elementHis.booking_id.indexOf("VMB") == -1) {
                elementHis.isFlyBooking = false;
                if (elementHis.flight_ticket_info && elementHis.flight_ticket_info.indexOf("VXR") != -1) {
                  elementHis.booking_type = "COMBO_VXR";
                }
                if(elementHis.booking_type == "20" || elementHis.booking_id.indexOf('OFF') != -1 || elementHis.booking_id.indexOf('TO') != -1){
                  
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
                     else if(elementHis.booking_id.indexOf('TO') != -1){
                      elementHis.bookingOffType = 4;//TOUR
                     }
                }
                  if (elementHis.avatar && elementHis.avatar.indexOf("104x104") ==-1  && elementHis.avatar.indexOf('i.travelapi.com') ==-1) {
                    let urlavatar = elementHis.avatar.substring(0, elementHis.avatar.length - 4);
                    let tail = elementHis.avatar.substring(elementHis.avatar.length - 4, elementHis.avatar.length);
                    elementHis.avatar = urlavatar + "-" + "104x104" + tail;
                  }
                  if (elementHis.delivery_payment_date) {
                    let arrpaymentdate = elementHis.delivery_payment_date.split("T");
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
                  elementHis.checkInDisplay = se.gf.getDayOfWeek(elementHis.checkInDate).daynameshort+", " + moment(elementHis.checkInDate).format('DD') +" thg "+moment(elementHis.checkInDate).format('MM');
                  elementHis.checkOutDisplay = se.gf.getDayOfWeek(elementHis.checkOutDate).daynameshort+", " + moment(elementHis.checkOutDate).format('DD') +" thg "+moment(elementHis.checkOutDate).format('MM');
                  elementHis.checkInDisplayShort = se.gf.getDayOfWeek(elementHis.checkInDate).daynameshort+", " + moment(elementHis.checkInDate).format('DD') +" thg "+moment(elementHis.checkInDate).format('MM');
                  elementHis.checkOutDisplayShort = se.gf.getDayOfWeek(elementHis.checkOutDate).daynameshort+", " + moment(elementHis.checkOutDate).format('DD') +" thg "+moment(elementHis.checkOutDate).format('MM');
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
                    let diffhours = elementHis.bookingsComboData[0].arrivalTime ? elementHis.bookingsComboData[0].arrivalTime.replace(':','')*1 - elementHis.bookingsComboData[0].departureTime.replace(':','')*1 : 0;
                    if(diffhours){
                      let str = diffhours.toString();
                      let m = str.substring(str.length - 2, str.length);
                      let h = str.substring(0, str.length - 2);
                      h = h.length <2 ? "0"+h +"h" : h +"h";
                      m = m != "00" ? m + "m" : "";
                      elementHis.bookingsComboData[0].flightTimeDisplay = h + m;
                    }
                    let ddate = elementHis.checkInDate;
                    elementHis.bookingsComboData[0].checkInDisplay = se.gf.getDayOfWeek(ddate).dayname+", " + moment(ddate).format('DD') +" thg "+moment(ddate).format('MM')
                    if(elementHis.bookingsComboData[1]){
                      let diffhours = elementHis.bookingsComboData[1].arrivalTime ? elementHis.bookingsComboData[1].arrivalTime.replace(':','')*1 - elementHis.bookingsComboData[1].departureTime.replace(':','')*1 : 0;
                      if(diffhours){
                        let str = diffhours.toString();
                        let m = str.substring(str.length - 2, str.length);
                        let h = str.substring(0, str.length - 2);
                        h = h.length <2 ? "0"+h +"h" : h +"h";
                        m = m != "00" ? m + "m" : "";
                        elementHis.bookingsComboData[1].flightTimeDisplay = h + m;
                      }
                      let rdate = elementHis.checkOutDate;
                      elementHis.bookingsComboData[1].checkOutDisplay = se.gf.getDayOfWeek(rdate).dayname+", " + moment(rdate).format('DD') +" thg "+moment(rdate).format('MM')
                    }
                    elementHis.arrPickupDropoff = [];
                    elementHis.bookingsComboData.forEach(el => {
                      if(el.trip_Code == "GO" || el.trip_Code == "RETURN" || el.trip_Code == "GOROUNDTRIP" || el.trip_Code == "RETURNROUNDTRIP"){
                        elementHis.isPickupDropoff = true;
                        el.sortPD = el.trip_Code == "GO" ? 1 : (el.trip_Code == "GOROUNDTRIP" ? 2 : (el.trip_Code == "RETURN" ? 3 : 4));
                        elementHis.arrPickupDropoff.push(el);
                        if(el.departureDate){
                          let newdate = el.departureDate.split('/');
                          if(newdate && newdate.length >1){
                            el.departureDateDisplay = newdate[0] + "." + newdate[1];
                          }
                          
                        }
                      }
                      if (el.airlineName.toLowerCase().indexOf('cathay') != -1) {
                        elementHis.hasCathay = true;
                    }
                    });

                    if(elementHis.arrPickupDropoff && elementHis.arrPickupDropoff.length >0){
                      se.zone.run(() => elementHis.arrPickupDropoff.sort(function (a, b) {
                        return a.sortPD - b.sortPD;
                      }))
                    }
                    
                  }
              }
              //list vmb
              else{
                if(elementHis.flight_ticket_info && elementHis.flight_ticket_info.indexOf("VXR") != -1){
                  elementHis.booking_type = "COMBO_VXR";
                }
                if(elementHis.flight_ticket_info && elementHis.flight_ticket_info.indexOf("VXR") != -1){
                  elementHis.booking_type = "COMBO_VXR";
                }
                  if (elementHis.avatar  && elementHis.avatar.indexOf('i.travelapi.com') ==-1) {
                    let urlavatar = elementHis.avatar.substring(0, elementHis.avatar.length - 4);
                    let tail = elementHis.avatar.substring(elementHis.avatar.length - 4, elementHis.avatar.length);
                    elementHis.avatar = urlavatar + "-" + "104x104" + tail;
                  }
                  if(elementHis.booking_id.indexOf("FLY") != -1 || elementHis.booking_id.indexOf("VMB") != -1 || elementHis.booking_type == "CB_FLY_HOTEL"){
                    elementHis.isFlyBooking = true;
                    elementHis.totalpricedisplay = se.gf.convertNumberToString(Math.round(elementHis.amount_after_tax));
                    elementHis.checkInDisplay = se.gf.getDayOfWeek(elementHis.checkInDate).dayname +", "+ moment(elementHis.checkInDate).format("DD") + " thg " + moment(elementHis.checkInDate).format("MM");
                    elementHis.checkOutDisplay = se.gf.getDayOfWeek(elementHis.checkOutDate).dayname +", "+ moment(elementHis.checkOutDate).format("DD") + " thg " + moment(elementHis.checkOutDate).format("MM");
                    let departFlight = elementHis.bookingsComboData.filter((f) => { return moment(f.departureDate).format('DD-MM-YYYY') == moment(elementHis.checkInDate).format('DD-MM-YYYY')&& f.airlineCode });
                    if(departFlight && departFlight.length >0){
                      elementHis.itemdepart = departFlight[0];
                    }else{
                      elementHis.itemdepart = elementHis.bookingsComboData[0];
                    }
                    elementHis.flightFrom = elementHis.itemdepart.flightFrom;
                    elementHis.flightTo = elementHis.itemdepart.flightTo;
                    elementHis.departAirport = se.getAirportByCode(elementHis.itemdepart.departCode);
                    elementHis.returnAirport = se.getAirportByCode(elementHis.itemdepart.arrivalCode);
                    
                    se.textDeparture = se.getDayOfWeek(elementHis.itemdepart.departureDate) + ', ' + elementHis.itemdepart.departureDate;
                    se.textRegionDepart = se.getRegionByCode(elementHis.itemdepart.departCode);
                    se.textRegionReturn = se.getRegionByCode(elementHis.itemdepart.arrivalCode);
                    se.textAirpotDepart = se.getAirpot(elementHis.itemdepart.departCode);
                    se.textAirpotReturn = se.getAirpot(elementHis.itemdepart.arrivalCode);
                    let idxlug =0;
                    elementHis.textChildDisplay = "";
                    elementHis.arrPickupDropoff = [];
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
                        if(el.trip_Code == "GO" || el.trip_Code == "RETURN" || el.trip_Code == "GOROUNDTRIP" || el.trip_Code == "RETURNROUNDTRIP"){
                          elementHis.isPickupDropoff = true;
                          el.sortPD = el.trip_Code == "GO" ? 1 : (el.trip_Code == "GOROUNDTRIP" ? 2 : (el.trip_Code == "RETURN" ? 3 : 4));
                          elementHis.arrPickupDropoff.push(el);
                          if(el.departureDate){
                            let newdate = el.departureDate.split('/');
                            if(newdate && newdate.length >1){
                              el.departureDateDisplay = newdate[0] + "." + newdate[1];
                            }
                          }
                        }
                        if (el.airlineName.toLowerCase().indexOf('cathay') != -1) {
                          elementHis.hasCathay = true;
                        }
                        idxlug++;
                    })
                    if(elementHis.arrPickupDropoff && elementHis.arrPickupDropoff.length >0){
                      se.zone.run(() => elementHis.arrPickupDropoff.sort(function (a, b) {
                        return a.sortPD - b.sortPD;
                      }))
                    }
                    if(elementHis.bookingsComboData.length >1){
                      let returnFlight = elementHis.bookingsComboData.filter((f) => { return moment(f.departureDate).format('DD-MM-YYYY') == moment(elementHis.checkOutDate).format('DD-MM-YYYY')&& f.airlineCode });
                      if(returnFlight && returnFlight.length >0){
                        elementHis.itemreturn = returnFlight[0];
                      }else{
                        elementHis.itemreturn = elementHis.bookingsComboData[1];
                      }
                        elementHis.textReturn = se.getDayOfWeek(elementHis.itemreturn.departureDate) + ', ' + elementHis.itemreturn.departureDate;
                        se.textArrivalRegionDepart = se.getRegionByCode(elementHis.itemreturn.departCode);
                        se.textArrivalRegionReturn = se.getRegionByCode(elementHis.itemreturn.arrivalCode);
                        se.textAirpotArrivalDepart = se.getAirpot(elementHis.itemreturn.departCode);
                        se.textAirpotArrivalReturn = se.getAirpot(elementHis.itemreturn.arrivalCode);
                    }
                    if(elementHis.bookingsComboData && elementHis.bookingsComboData[0].passengers && elementHis.bookingsComboData[0].passengers.length >0){
                      elementHis.adult =0;
                      elementHis.child =0;
                      elementHis.infant =0;
                      elementHis.bookingsComboData[0].passengers.forEach( (elementHislug, index) => {
                        let yearold = 18;
                        let arr =[];
                        if(elementHislug.dob){
                          if(elementHislug.dob && elementHislug.dob.indexOf('/') != -1){
                            arr = elementHislug.dob.split('/');
                          }
                          else if(elementHislug.dob && elementHislug.dob.indexOf('-') != -1){
                            arr = elementHislug.dob.split('-');
                          }
                          if(arr.length >0){
                            let newdob = new Date(Number(arr[2]), Number(arr[1]-1), Number(arr[0]));
                            yearold = moment(elementHislug.checkInDate).diff(moment(newdob), 'years');
                          }
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
   //check cathay
   if (elementHis.bookingsComboData) {
    let Temp:any = [];
    Temp.push(elementHis.bookingsComboData);
    if (Temp) {
      let Temp_Cathay:any = [];
      Temp.forEach(function (item) {
        Temp_Cathay.push(
          item.filter(function (word) {
            return word.airlineName.toLowerCase().includes("cathay");
          })
        );
      });
      if (
        Temp_Cathay[0] &&
        Temp_Cathay[0][0] && Temp_Cathay[0][0].passengers &&
        Temp_Cathay[0][0].passengers.length > 0
      )
        elementHis.IsCathay = true;
      else {
        elementHis.IsCathay = false;
      }
      if (elementHis.IsCathay && elementHis.itemdepart && elementHis.itemdepart.passengers.length>0) {
        elementHis.itemdepart.passengers.forEach(el => {
          for (let i = 0; i < Temp_Cathay[0][0].passengers.length; i++) {
            if (el.name.toLowerCase().trim() == Temp_Cathay[0][0].passengers[i].name.toLowerCase().trim()) {
              el.IsCathay = true;
              break;
            }
          }
        })
      }
    }
  }
              se.listMyTrips.push(elementHis);
              se.historytripcount++;
            }
            if(se.listMyTrips.length >0){
              se._mytripservice.totalHistoryTripText = "(" + se.listMyTrips.length + ")";
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
            if (se.gf.getParams('notifiBookingCode') && se.gf.getParams('selectedTab3') || se.checkishistorytrip()) {
              se.activeTabTrip = 3;
              se.tabtrip = 'historytrip';
              //Map số bkg trong listtriphistory để focus vào bkg được notifi
              var idxMap = se.listHistoryTrips.map((item, index) => {
                return item.booking_id == se.gf.getParams('notifiBookingCode');
              });
              if (idxMap && idxMap.length > 0) {
                var idx = idxMap.findIndex((el) => { return el == true });
                if (se.checkIsSharingTrip()) {
                  se.gf.setParams('','notifiBookingCode');
                  se.feedback(se.listHistoryTrips[idx]);
                }
              }
              //Sau khi map được trip thì set giá trị về null
              se.gf.setParams(null, 'notifiBookingCode');
              se.gf.setParams(null, 'selectedTab3');
            }
            se.historytripcounttext = " (" + se.historytripcount + ")";
          }
          if(se._infiniteScroll && se._infiniteScroll.target){
            se._infiniteScroll.target.complete();
          }
        })
        se.hideloader();
      }
    
      checkishistorytrip() {
        var se = this;
        var res = false;
        var objmap = se.listHistoryTrips.map((item, index) => {
          return (item.booking_id == se.gf.getParams('notifiBookingCode'));
        });
        return res = (objmap && objmap.length > 0 && objmap.findIndex((el) => { return el == true }) != -1);
      }
    
      checkIsSharingTrip() {
        var se = this;
        var res = false;
        var objmap = se.listHistoryTrips.map((item, index) => {
          return (item.booking_id == se.gf.getParams('notifiBookingCode') && se.gf.getParams('selectedTab3') != null);
        });
        return res = (objmap && objmap.length > 0 && objmap.findIndex((el) => { return el == true }) != -1);
      }
      /**
       * Thực hiện sort theo checkin/startdate
       * Vì có 2 list mytrip và requestrip nên phải sort lại đồng nhất theo date
       */
      sortMytrip() {
        var se = this;
        if (se.listMyTrips && se.listMyTrips.length > 0) {
          se.zone.run(() => se.listMyTrips.sort(function (a, b) {
            let direction = -1;
            if (!a['isRequestTrip'] && !b['isRequestTrip']) {
              if (moment(a['checkInDate']).diff(moment(b['checkInDate']), 'days') > 0) {
                return -1 * direction;
              }
              else {
                return 1 * direction;
              }
            }
            else if (!a['isRequestTrip'] && b['isRequestTrip']) {
              if (moment(a['checkInDate']).diff(moment(b['start_date']), 'days') > 0) {
                return -1 * direction;
              }
              else {
                return 1 * direction;
              }
            }
            else if (a['isRequestTrip'] && !b['isRequestTrip']) {
              if (moment(a['start_date']).diff(moment(b['checkInDate']), 'days') > 0) {
                return -1 * direction;
              }
              else {
                return 1 * direction;
              }
            } else {
              if (moment(a['start_date']).diff(moment(b['start_date']), 'days') > 0) {
                return -1 * direction;
              }
              else {
                return 1 * direction;
              }
            }
          }));
        }
      };
    
      hideloader() {
        var se = this;
        if (se.myloader) {
          se.myloader.dismiss();
        }
      }
    
      getDayOfWeek(day) {
        let cinthu ='';
        if(day){
          let arrdate = day.split('/');
          let newdate = new Date(arrdate[2], arrdate[1], arrdate[0]);
          cinthu = moment(newdate).format("dddd");
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
        }
        
        return cinthu;
      }
    
      getAirpot(code) {
        let name = '';
        if(this._flightService.listAirport && this._flightService.listAirport.length >0){
          let itemairport = this._flightService.listAirport.filter((itemairport) => { return itemairport.code == code });
          return itemairport && itemairport.length > 0 ? itemairport[0].airport : '';
        }
       return '';
      }
    
      getRegionByCode(code) {
        let itemairport:any;
        if(this._flightService.listAirport && this._flightService.listAirport.length >0){
          itemairport = this._flightService.listAirport.filter((itemairport) => { return itemairport.code == code});
        }
        return itemairport && itemairport.length >0 ? itemairport[0].city : '';
      }
    
      setCheckInCheckOutInfo(obj) {
        var se = this;
        se.arrinsurrance = [];
        se.arrchildinsurrance = [];
        se.isFlyBooking = (obj.booking_id.indexOf('FLY') != -1 || obj.booking_id.indexOf("VMB") != -1 || obj.booking_type == "CB_FLY_HOTEL") ? true : false;
        se.datecin = new Date(obj.checkInDate);
        se.datecout = new Date(obj.checkOutDate);
        se.cindisplay = se.gf.getDayOfWeek(se.datecin).dayname+ " " + moment(se.datecin).format('DD') + "Thg " + moment(se.datecin).format('MM');
        se.coutdisplay = se.gf.getDayOfWeek(se.datecout).dayname+ " " + moment(se.datecout).format('DD') + "Thg " + moment(se.datecout).format('MM');
        if (obj.bookingsComboData) {
          se.valueGlobal.bookingsComboData = obj.bookingsComboData[0];
          se.cincombodeparturedisplay = moment(new Date(obj.bookingsComboData[0].departureDate)).format('DD-MM-YYYY');
          se.cincomboarrivaldisplay = moment(new Date(obj.bookingsComboData[0].arrivalDate)).format('DD-MM-YYYY');
          if (obj.bookingsComboData.length > 1) {
            se.coutcombodeparturedisplay = moment(new Date(obj.bookingsComboData[1].departureDate)).format('DD-MM-YYYY');
            se.coutcomboarrivaldisplay = moment(new Date(obj.bookingsComboData[1].arrivalDate)).format('DD-MM-YYYY');
          }
          if (se.isFlyBooking) {
            se.textDeparture = se.getDayOfWeek(obj.bookingsComboData[0].departureDate) + ', ' + obj.bookingsComboData[0].departureDate;
            se.textRegionDepart = se.getRegionByCode(obj.bookingsComboData[0].flightFrom);
            se.textRegionReturn = se.getRegionByCode(obj.bookingsComboData[0].flightTo);
            se.textAirpotDepart = se.getAirpot(obj.bookingsComboData[0].flightFrom);
            se.textAirpotReturn = se.getAirpot(obj.bookingsComboData[0].flightTo);
            if (obj.bookingsComboData.length > 1) {
              se.textReturn = se.getDayOfWeek(obj.bookingsComboData[1].departureDate) + ', ' + obj.bookingsComboData[1].departureDate;
              se.textArrivalRegionDepart = se.getRegionByCode(obj.bookingsComboData[1].flightFrom);
              se.textArrivalRegionReturn = se.getRegionByCode(obj.bookingsComboData[1].flightTo);
              se.textAirpotArrivalDepart = se.getAirpot(obj.bookingsComboData[1].flightFrom);
              se.textAirpotArrivalReturn = se.getAirpot(obj.bookingsComboData[1].flightTo);
            }
            if (obj.bookingsComboData[0].passengers && obj.bookingsComboData[0].passengers.length > 0) {
              obj.bookingsComboData[0].passengers.forEach((element, index) => {
                if(element.dob){
                  let arr = element.dob.split('/');
                  let newdate = new Date(Number(arr[2]), Number(arr[1]), Number(arr[0]));
                  let yearold = moment(new Date()).diff(moment(newdate), 'years');
                  element.isAdult = yearold > 12 ? true : false;
                }
                if (element.hanhLy && element.hanhLy.length > 0) {
                  let arrlug = element.hanhLy.split(':');
                  element.arrlug = [];
                  if (arrlug && arrlug.length > 0) {
                    let idx = 0;
                    arrlug.forEach(lug => {
                      if (idx > 0) {
                        let arrlugname = lug;
                        if (arrlugname.length > 4) {
                          arrlugname = arrlugname.substring(0, 4);
                        }
                        if (idx == 1) {
                          element.arrlug.push({ lugname: obj.bookingsComboData[0].flightFrom + " - " + obj.bookingsComboData[0].flightTo, lugweight: arrlugname });
                        }
                        else if (obj.bookingsComboData.length > 1 && idx == 2) {
                          element.arrlug.push({ lugname: obj.bookingsComboData[1].flightFrom + " - " + obj.bookingsComboData[1].flightTo, lugweight: arrlugname });
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
        se.numberOfDay = moment(se.datecout).diff(moment(se.datecin), 'days');
        if (obj.bookingsComboData && obj.bookingsComboData.length > 2) {
          obj.bookingsComboData = obj.bookingsComboData.slice(0, 2);
        }
        if (obj.bookingsComboData && obj.bookingsComboData.length > 1) {
          se.departCodeDisplay = obj.bookingsComboData[0].departCode + ' → ' + obj.bookingsComboData[0].arrivalCode;
          if (obj.bookingsComboData.length > 1) {
            se.arrivalCodeDisplay = obj.bookingsComboData[1].departCode + ' → ' + obj.bookingsComboData[1].arrivalCode;
          }
        }
      }
    
      checkExitClaim(listcheck, itemcheck, bkgid) {
        var se = this, res = false;
        res = listcheck.filter((item) => { return item.flight_number == itemcheck.flight_number && item.insurance_code == itemcheck.insurance_code && item.bookingid == bkgid }).length > 0 ? true : false;
        return res;
      }
    
      setCheckInCheckOutRQInfo(obj) {
        var se = this;
        var datecinRQ = new Date(obj.start_date);
        var datecoutRQ = new Date(obj.end_date);
        se.cinRQdisplay =se.gf.getDayOfWeek(datecinRQ).dayname+ " " + moment(datecinRQ).format('DD') + "Thg " + moment(datecinRQ).format('MM');
        se.coutRQdisplay = se.gf.getDayOfWeek(datecoutRQ).dayname+ " " + moment(datecoutRQ).format('DD') + "Thg " + moment(datecoutRQ).format('MM');
        se.numberOfRQDay = moment(datecoutRQ).diff(moment(datecinRQ), 'days');
      }
    
      ionViewDidLoad() {
        let elements = window.document.querySelectorAll(".tabbar");
    
        if (elements != null) {
          Object.keys(elements).map((key) => {
            elements[key].style.display = 'flex';
          });
        }
      }
    
      loaddatatopdeal(data: any) {
        var se = this;
        var chuoi = "";
        if(data && data.length >0){
        se.zone.run(() => {
          let i = 0;
          if (data[i].images[0]) {
            var res = data[i].images[0].url.substring(0, 4);
            if (res != "http") {
              data[i].images[0].url = 'https:' + data[i].images[0].url;
            }
            var minPrice = data[i].minPrice.toLocaleString();
            chuoi = "";
            var name = data[i].name.split('|');
            for (let x = 1; x < name.length; x++) {
              if (x == name.length - 1) {
                chuoi = chuoi + name[x];
              } else {
                chuoi = chuoi + name[x] + "|";
              }
            }
            switch (data[i].rating) {
              case 50:
                data[i].rating = "./assets/star/ic_star_5.svg";
                break;
              case 45:
                data[i].rating = "./assets/star/ic_star_4.5.svg";
                break;
              case 40:
                data[i].rating = "./assets/star/ic_star_4.svg";
                break;
              case 35:
                data[i].rating = "./assets/star/ic_star_3.5.svg";
                break;
              case 30:
                data[i].rating = "./assets/star/ic_star_3.svg";
                break;
              case 25:
                data[i].rating = "./assets/star/ic_star_2.5.svg";
                break;
              case 20:
                data[i].rating = "./assets/star/ic_star_2.svg";
                break;
              case 15:
                data[i].rating = "./assets/star/ic_star_1.5.svg";
                break;
              case 10:
                data[i].rating = "./assets/star/ic_star.svg";
                break;
              case 5:
                data[i].rating = "./assets/star/ic_star_0.5.svg";
                break;
              default:
                break;
            }
            var item = { ischecked: 0, id: data[i].id, name: name[0], imageUrl: data[i].images[0].url, regionName: data[i].regionName, minPrice: minPrice, description: chuoi, rating: data[i].rating, priceshow: (data[i].minPrice / 1000).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(',', '.') };
            se.zone.run(() => {
              se.slide = item;
            })
            //load combodetail
            se.loaddetailcombo(item.id);
          }
        })
        }
      }
    
      loaddetailcombo(hotelID) {
        let url = C.urls.baseUrl.urlPost + "/mhoteldetail/" + hotelID;
        var se = this;
        se.gf.RequestApi('POST', url, {}, {}, 'booking', 'loaddetailcombo').then((data) => {
          let jsondata = data;
            if (jsondata.Combos || jsondata.ComboPromotion) {
              se.Description = jsondata.ComboPromtion ? jsondata.ComboPromtion.Description.replace(/\r\n/g, "<br/>") : jsondata.Combos.Description.replace(/\r\n/g, "<br/>");
              se.Description = se.Description.replace("Trọn gói bao gồm:", "");
              se.Description = se.Description.replace(/#r/g, "");
              se.Description = se.Description.replace(/r#/g, "");
              se.Description = se.Description.replace(/#m/g, "");
              se.Description = se.Description.replace(/m#/g, "");
              se.Description = se.Description.replace(/#n/g, "");
              se.Description = se.Description.replace(/n#/g, "");
              se.Description = se.Description.replace(/n#/g, "");
            }
        })
      }
    
      viewComboDetail(item) {
        this.searchhotel.hotelID = item.id;
        this.searchhotel.rootPage = "MyTrip";
        this.valueGlobal.notRefreshDetail = false;
        this.navCtrl.navigateForward('/hoteldetail/' + item.id);
      }
    
      viewComboList() {
        this.searchhotel.fromPage = 'order';
        this.navCtrl.navigateForward('/combolist');
      }
    
      goback() {
        if(this._mytripservice.rootPage == "homeflight"){
          this._flightService.itemTabFlightActive.emit(true);
          this._flightService.itemMenuFlightClick.emit(1);
          this.valueGlobal.backValue = "homeflight";
          this.navCtrl.navigateBack('/app/tabs/tab1');
          this._mytripservice.backfrompage= "";
        }
        else if(this._mytripservice.rootPage == "homefood"){
          this._mytripservice.rootPage = "homefood";
          this.valueGlobal.backValue = "";
          this.navCtrl.navigateForward('/homefood');
        }
        else{
          this.navCtrl.navigateRoot('/');
        }
      }
    
      enableTabbar(modal) {
        modal.onDidDismiss(() => {
          let elements = window.document.querySelectorAll(".tabbar");
          if (elements != null) {
            Object.keys(elements).map((key) => {
              elements[key].style.display = 'flex';
            });
          }
        })
      }
      
      openBookingTrip(trip) {
        if (!this.networkProvider.isOnline()) {
          this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
          return;
        }
        if (trip && !trip.isRequestTrip) {
          this.gf.setParams({ trip: trip, currentTrip: this.currentTrip }, 'mytripbookingdetail');
          if(this._mytripservice.rootPage == "homeflight"){
            this._mytripservice.backroute = "tabs/tab1";
          }else{
            this._mytripservice.backroute = "/app/tabs/tab3";
          }
          
          this.router.navigateByUrl('/mytripbookingdetail');
          //google analytic
          this.gf.googleAnalytion('mytrips', 'Search', '/opentripdeail');
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
        se.gf.setParams({ notes: notes, provincename: provincename }, 'hotelexpsnotes');
        se.navCtrl.navigateForward('/hotelexpsnotes');
      }
    
      async presentLoading() {
        this.loader = await this.loadingCtrl.create({
          duration: 300
        });
        this.loader.present();
      }
    
      nextTrip() {
        if (!this.networkProvider.isOnline()) {
          this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
          return;
        }
    
        this.zone.run(() => {
          this.currentTrip = this.currentTrip + 1;
          let obj = this.listMyTrips[this.currentTrip];
          if (obj && !obj.isRequestTrip) {
            this.setCheckInCheckOutInfo(obj);
            this.isRequestTrip = false;
          } else {
            this.setCheckInCheckOutRQInfo(obj);
            this.isRequestTrip = true;
          }
        })
        if (this.content) {
          this.content.scrollToTop(500);
        }
    
        //google analytic
        this.gf.googleAnalytion('mytrips', 'Search', 'nexttrip');
      }
    
      previousTrip() {
        if (!this.networkProvider.isOnline()) {
          this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
          return;
        }
        this.zone.run(() => {
          this.currentTrip = this.currentTrip - 1;
          let obj = this.listMyTrips[this.currentTrip];
          if (obj && !obj.isRequestTrip) {
            this.setCheckInCheckOutInfo(obj);
            this.isRequestTrip = false;
          } else {
            this.setCheckInCheckOutRQInfo(obj);
            this.isRequestTrip = true;
          }
        })
        if (this.content) {
          this.content.scrollToTop(500);
        }
        //google analytic
        this.gf.googleAnalytion('mytrips', 'Search', 'previoustrip');
      }
    
      nextRQTrip() {
        this.zone.run(() => {
          this.currentRQTrip = this.currentRQTrip + 1;
          let obj = this.listRequestTrips[this.currentRQTrip];
          this.setCheckInCheckOutRQInfo(obj);
        })
        if (this.content) {
          this.content.scrollToTop(50);
        }
        //google analytic
        this.gf.googleAnalytion('mytrips', 'Search', 'nextrequesttrip');
      }
    
      previousRQTrip() {
        this.zone.run(() => {
          this.currentRQTrip = this.currentRQTrip - 1;
          let obj = this.listRequestTrips[this.currentRQTrip];
          this.setCheckInCheckOutRQInfo(obj);
        })
        if (this.content) {
          this.content.scrollToTop(50);
        }
        //google analytic
        this.gf.googleAnalytion('mytrips', 'Search', 'previousrequesttrip');
      }
    
      openHistoryTrip() {
        this.navCtrl.navigateForward('/mytripshistory');
        //google analytic
        this.gf.googleAnalytion('mytrips', 'Search', 'openhistorytrip');
      }
    
      openInclusion(inclusion) {
        this.navCtrl.navigateForward('/comboinclusion');
        //google analytic
        this.gf.googleAnalytion('mytrips', 'Search', 'openinclusion');
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
    
      public async showConfirm() {
        let alert = await this.alertCtrl.create({
          message: "Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại để sử dụng chức năng này.",
          buttons: [
            {
              text: 'Để sau',
              handler: () => {
                this.storage.remove('auth_token');
                this.storage.remove('email');
                this.storage.remove('username');
                this.storage.remove('jti');
                this.storage.remove('userInfoData');
                this.storage.remove('userRewardData');
                this.storage.remove('point');
                this.storage.remove('blogtripdefault');
                this.zone.run(() => {
                  this.mytripcount = 0;
                  this.nexttripcounttext = "";
                  this.historytripcounttext = "";
                  this.requestripcount = 0;
                  this.historytripcount = 0;
                  this.loginuser = null;
                  this.valueGlobal.countNotifi = 0;
                })
                this.navCtrl.navigateRoot('/');
              }
            },
            {
              text: 'Đăng nhập',
              role: 'OK',
              handler: () => {
                this.storage.remove('auth_token');
                this.storage.remove('email');
                this.storage.remove('username');
                this.storage.remove('jti');
                this.storage.remove('userInfoData');
                this.storage.remove('userRewardData');
                this.storage.remove('point');
                this.storage.remove('blogtripdefault');
                this.zone.run(() => {
                  this.mytripcount = 0;
                  this.nexttripcounttext = "";
                  this.historytripcounttext = "";
                  this.requestripcount = 0;
                  this.historytripcount = 0;
                  this.loginuser = null;
                  this.valueGlobal.countNotifi = 0;
                })
                this.navCtrl.navigateForward('/login');
              }
            },
          ]
        });
        alert.present();
      }
    
      SelectNextTrip() {
        this.activeTabTrip = 1;
       
      }
      SelectHistoryTrip(){
        this.activeTabTrip = 3;
       
      }
    
      SelectFoodTab() {
        this.activeTabTrip = 2;
        
        this.loadUserReviews();
      }

      SelectFoodHistoryTab(){
        this.activeTabTrip = 4;
       

        this.loadUserReviews();
      }
    
      loadRequestTrip(listrequesttrips) {
        var se = this;
        se.requestripcount = 0;
        se.listRequestTrips = [];
        let lstRQTrips = listrequesttrips.data;
        se.hasloadRQdata = true;
        //List trip yêu cầu
        lstRQTrips.forEach(element => {
            if(element.request_id.indexOf("HTBKG") == -1){
              element.avatar = element.hotelAvatar;
              element.isRequestTrip = true;
              element.booking_id = element.request_id;
              element.checkInDisplay = se.gf.getDayOfWeek(element.start_date).daynameshort+", " + moment(element.start_date).format('DD') +" thg "+moment(element.start_date).format('MM');
              element.checkOutDisplay = se.gf.getDayOfWeek(element.end_date).daynameshort+", " + moment(element.end_date).format('DD') +" thg "+moment(element.end_date).format('MM');
              se.getRatingStar(element);
              se.listRequestTrips.push(element);
              se.requestripcount++;
            }
        });
    
        se._mytripservice.listRequestTrips = se.listRequestTrips;
    
        if (se.listRequestTrips.length > 0) {
          se.listMyTrips.push(...se.listRequestTrips)
        }
    
        se.sortMytrip();
    
        if (se.listMyTrips.length > 0) {
          //Tạm thời gọi api get notifi để build lại thông tin thay đổi chuyến bay nếu có
          se.loadUserNotificationAndMapFlightChange();
          if (se.gf.getParams('notifiBookingCode')) {
            //Map số bkg trong listtrip để focus vào bkg được notifi
            var idxMap = se.listMyTrips.map((item, index) => {
              return item.booking_id == se.gf.getParams('notifiBookingCode');
            });
            if (idxMap && idxMap.length > 0) {
              var idx = idxMap.findIndex((el) => { return el == true });
              se.currentTrip = idx;
              se.gf.setParams('','notifiBookingCode');
              se.showtripdetail(se.listMyTrips[idx]);
            }
            //Sau khi map được trip thì set giá trị về null
            se.gf.setParams(null, 'notifiBookingCode');
          }
          //Map item được claim nếu có load lại dữ liệu
          if (se.activityService.insurranceBookingId) {
            var idxMap = se.listMyTrips.map((item, index) => {
              return item.booking_id == se.activityService.insurranceBookingId;
            });
            if (idxMap && idxMap.length > 0) {
              var idx = idxMap.findIndex((el) => { return el == true });
              se.currentTrip = idx;
            }
          }
          if (se.currentTrip && se.currentTrip != -1) {
            let obj = se.listMyTrips[se.currentTrip];
            if (obj && !obj.isRequestTrip) {
              se.setCheckInCheckOutInfo(obj);
              se.isRequestTrip = false;
            } else {
              se.setCheckInCheckOutRQInfo(obj);
              se.isRequestTrip = true;
            }
          }
          else {
            se.currentTrip = -1;
            if (se.listMyTrips.length > 0) {
              se.nextTrip();
            }
          }
        } else {
          se.hasdata = false;
        }
        se.hasdata = true;
        se.hasloaddata = true;
        setTimeout(() => {
          if (se.myloader) {
            se.myloader.dismiss();
          }
          if (se.mytripcount + se.requestripcount > 0) {
            se.nexttripcounttext = " (" + (se.mytripcount + se.requestripcount) + ")";
          } else {
            se.nexttripcounttext = "";
          }
        }, 300);
        se.getListSupportByUser(this.loginuser);
      }
    
      public scrollFunction = (event: any) => {
        var se = this;
        se.zone.run(() => {
          if (!se.currentPosition) {
            se.currentPosition = event.detail.scrollTop;
          }
          if (event.detail.scrollTop > se.currentPosition) {
            //window.document.querySelector(".tabbar")['style'].display = 'none';
            if (se.topOrBottom == "top") {
              se.contentBox.marginTop = 0;
            } else if (se.topOrBottom == "bottom") {
              se.contentBox.marginBottom = 0;
            }
          } else {
            if (window.document.querySelector(".tabbar")) {
             // window.document.querySelector(".tabbar")['style'].display = 'flex';
            }
    
            if (se.topOrBottom == "top") {
              se.contentBox.marginTop = se.tabBarHeight;
            } else if (se.topOrBottom == "bottom") {
              se.contentBox.marginBottom = se.tabBarHeight;
            }
          }
          if (se.activeTabTrip != 1) {
            if (window.document.querySelector(".tabbar")) {
             // window.document.querySelector(".tabbar")['style'].display = 'flex';
              return;
            }
          }
        })
      }
    
      async feedback(trip: any) {
        var se = this;
        if (trip.booking_id) {
          se.checkBookingReview(trip).then((result) => {
            if (result) {
              se.showUserFeedBackPage(trip);
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
        modal.present();
    
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
            let headers =
              {
                'accept': 'application/json',
                'content-type': 'application/json-patch+json',
                authorization: text
              };
            let strUrl = C.urls.baseUrl.urlMobile + '/api/dashboard/getMyTripPaging?getall=true&getHistory=true&pageIndex=1&pageSize=100';
            se.gf.RequestApi('GET', strUrl, headers, {}, 'booking', 'reloadHistoryTrip').then((data) => {
              if (data) {
                      se.zone.run(() => {
                        se.historytripcount = 0;
                        se.listHistoryTrips = [];
        
                        let lstTrips = data;
                        if (lstTrips.tripHistory.length > 0) {
                          lstTrips.tripHistory.forEach(elementHis => {
                            if (elementHis.avatar  && elementHis.avatar.indexOf('i.travelapi.com') ==-1) {
                              let urlavatar = elementHis.avatar.substring(0, elementHis.avatar.length - 4);
                              let tail = elementHis.avatar.substring(elementHis.avatar.length - 4, elementHis.avatar.length);
                              elementHis.avatar157 = urlavatar + "-" + "110x157" + tail;
                              elementHis.avatar104 = urlavatar + "-" + "110x104" + tail;
                              elementHis.avatar110 = urlavatar + "-" + "110x118" + tail;
                            } else {
                              elementHis.avatar110 = "//cdn1.ivivu.com/iVivu/2018/02/07/15/noimage-110x124.jpg";
                            }
                            se.listHistoryTrips.push(elementHis);
                            se.historytripcount++;
        
                          });
                          se.historytripcounttext = " (" + se.historytripcount + ")";
                        }
                      })
                    }
              })
          } else {
            se.hasdata = false;
            se.hasloaddata = true;
            se.listMyTrips = [];
            se.listHistoryTrips = [];
            se.mytripcount = 0;
            se.historytripcount = 0;
            se.hideloader();
          }
        });
        setTimeout(() => {
          if (se.myloader) {
            se.myloader.dismiss();
          }
        }, 500)
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
    
      openWebpage(url: string) {
        // const options: InAppBrowserOptions = {
        //   zoom: 'no',
        //   location: 'yes',
        //   toolbar: 'yes',
        //   hideurlbar: 'yes',
        //   closebuttoncaption: 'Đóng'
        // };
        // const browser = this.iab.create(url, '_self', options);
        // browser.show();
      }
    
      loadUserReviews() {
        var se = this;
        se.storage.get('auth_token').then(auth_token => {
          if (auth_token) {
            var text = "Bearer " + auth_token;
            let headers =
              {
                'accept': 'application/json',
                'content-type': 'application/json-patch+json',
                authorization: text
              };
            let strUrl =  C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserReviews';
            se.gf.RequestApi('GET', strUrl, headers, {}, 'booking', 'loadUserReviews').then((data) => {
              if (data) {
                      var result = data;
                      se.arrHotelReviews = [];
                      if (result.data && result.data.length > 0) {
                        se.zone.run(() => {
                          result.data.forEach(element => {
                            if (element.images && element.images.length > 0) {
                              element.images.forEach(img => {
                                img.thumpUrl = img.thumpUrl.replace("84x84", "150x150");
                              });
                            }
                            se.arrHotelReviews.push(element);
                          });
                        })
                       
                        se.bindUserReviews();
                      }
                    } else if (data.statusCode == 401) {
                    }
            })
          }
        })
      }
    
      bindUserReviews() {
        var se = this;
        if (se.arrHotelReviews && se.arrHotelReviews.length > 0) {
          se.arrHotelReviews.forEach((item) => {
            var itemReview = se.listMyTrips.filter((element) => {
              return element.booking_id == item.bookingId && item.hotelId == element.HotelIdERP;
            })
            if (itemReview && itemReview.length > 0) {
              se.zone.run(() => {
                item.reviewLink = 'manualBindReview';
                item.reviewPoint = itemReview[0].reviewPoint;
                item.reviewPoint = itemReview[0].reviewPoint;
              })
            }
          })
        }
      }
    
      async showReviews(trip: any) {
        var se = this;
        se.gf.setParams({ trip: trip, hotelreviewlist: se.arrHotelReviews }, 'hotelreviewlist');
        const modal: HTMLIonModalElement =
          await se.modalCtrl.create({
            component: UserReviewsPage,
          });
        modal.present();
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
    
      /**
         * Load thông báo của user
         */
      loadUserNotificationAndMapFlightChange() {
        var se = this;
        if (!se.networkProvider.isOnline()) {
          se.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
          return;
        }
        se.storage.get('auth_token').then(auth_token => {
          if (auth_token) {
            var text = "Bearer " + auth_token;
            let headers =
            {
              'accept': 'application/json',
              'content-type': 'application/json-patch+json',
              authorization: text
            };
          let strUrl =  C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetNotificationByUserIVV';
          se.gf.RequestApi('GET', strUrl, headers, {}, 'booking', 'loadUserNotificationAndMapFlightChange').then((data) => {
                  if (data && data.length > 0 && se.listMyTrips.length > 0) {
                    se.listMyTrips.forEach((el) => {
                      //Lấy ra object notify theo loại noti thay đổi chuyến bay và có trong listmytrip
                      var objnoti = data.filter((item, index) => {
                        return item.bookingCode == el.booking_id && item.notifyAction == 'flychangeinfo';
                      });
                      if (objnoti && objnoti.length > 0) {
                        objnoti.forEach((itemnotify: any) => {
                          //Lấy ra index của object mytrip theo số bkg
                          var idx = se.listMyTrips.findIndex((el) => { return el.booking_id == itemnotify.bookingCode });
                          var objmap = se.listMyTrips[idx];
                          if (itemnotify.switchObj) {
                            var objFlightChange = itemnotify.switchObj.split('|');
                            
                            if (objmap && objmap.bookingsComboData && objmap.bookingsComboData.length > 0) {
                              var newFlightObject = objFlightChange[1].split(' ');
                              var oldFlightObjectOldTime = objFlightChange[0].split(' ');
                              if (newFlightObject && newFlightObject.length > 3) {
                                let fn = newFlightObject[0] + ' ' + newFlightObject[1];
                                if (objmap.bookingsComboData[0].flightNumner == fn) {
                                  objmap.bookingsComboData[0].changeFlightInfo = true;
                                  objmap.bookingsComboData[0].oldFlightTime = oldFlightObjectOldTime[oldFlightObjectOldTime.length - 1];
                                  objmap.bookingsComboData[0].departureTime = newFlightObject[newFlightObject.length - 1];
                                }
                                if (objmap.bookingsComboData[1] && objmap.bookingsComboData[1].flightNumner == fn) {
                                  objmap.bookingsComboData[1].changeFlightInfo = true;
                                  objmap.bookingsComboData[1].oldFlightTime = oldFlightObjectOldTime[oldFlightObjectOldTime.length - 1];
                                  objmap.bookingsComboData[1].departureTime = newFlightObject[newFlightObject.length - 1];
                                }
                              } else if (newFlightObject && newFlightObject.length > 2) {
                                let fn = newFlightObject[0];
                                if (objmap.bookingsComboData[0].flightNumner == fn) {
                                  objmap.bookingsComboData[0].changeFlightInfo = true;
                                  objmap.bookingsComboData[0].oldFlightTime = oldFlightObjectOldTime[oldFlightObjectOldTime.length - 1];
                                  objmap.bookingsComboData[0].departureTime = newFlightObject[newFlightObject.length - 1];
                                }
                                if (objmap.bookingsComboData[1] && objmap.bookingsComboData[1].flightNumner == fn) {
                                  objmap.bookingsComboData[1].changeFlightInfo = true;
                                  objmap.bookingsComboData[1].oldFlightTime = oldFlightObjectOldTime[oldFlightObjectOldTime.length - 1];
                                  objmap.bookingsComboData[1].departureTime = newFlightObject[newFlightObject.length - 1];
                                }
                              }
    
                            }
    
                          }
                        })
                      }
                    })
                  }
            });
          }
        })
      }
    
      async presentPopoverHis(ev: any, trip) {
        var se = this;
        const popover = await this.popoverController.create({
          component: InsurrancepopoverPage,
          event: ev,
          translucent: true,
          cssClass: 'popover-history'
        });
        se.valueGlobal.popover = popover;
        var arrinsurranceHis:any = [];
        let bkgflyinfo = JSON.parse(trip.booking_json_data);
        var departFlightNumber = '', returnFlightNumber = '';
        var bookingsComboData:any = [];
        if (bkgflyinfo && bkgflyinfo.length > 1) {
          departFlightNumber = bkgflyinfo[0].FlightNumner;
          returnFlightNumber = bkgflyinfo[1].FlightNumner;
          let obj = {
            departureDate: bkgflyinfo[0].DepartureDate,
            departureTime: bkgflyinfo[0].DepartureTime,
            departCode: bkgflyinfo[0].DepartCode,
            arrivalCode: bkgflyinfo[0].ArrivalCode,
            flightNumber: bkgflyinfo[0].FlightNumner,
            flightNumner: bkgflyinfo[0].FlightNumner,
            flightFrom: bkgflyinfo[0].FlightFrom,
            flightTo: bkgflyinfo[0].FlightTo,
            airlineName: bkgflyinfo[0].AirlineName
          };
          bookingsComboData.push(obj);
          let obj1 = {};
          if (bkgflyinfo.length > 1) {
            obj1 = {
              departureDate: bkgflyinfo[1].DepartureDate,
              departureTime: bkgflyinfo[1].DepartureTime,
              departCode: bkgflyinfo[1].DepartCode,
              arrivalCode: bkgflyinfo[1].ArrivalCode,
              flightNumber: bkgflyinfo[1].FlightNumner,
              flightNumner: bkgflyinfo[0].FlightNumner,
              flightFrom: bkgflyinfo[1].FlightFrom,
              flightTo: bkgflyinfo[1].FlightTo,
              airlineName: bkgflyinfo[1].AirlineName
            };
            bookingsComboData.push(obj1);
          }
        }
        trip.bookingsComboData = bookingsComboData;
        trip.insuranceInfo.adultList.forEach(element => {
          let claimed = false, claimedDepart = false, claimedReturn = false;
          if (element.claimedFlights && element.claimedFlights.length > 0) {
            element.claimedFlights.forEach((fn) => {
              se.listClaimed.push({ flight_number: fn.replace(" ", ""), insurance_code: element.id, bookingid: trip.booking_id });
            })
          }
    
          let fnDepart = departFlightNumber.replace(" ", ""),
            fnReturn = returnFlightNumber.replace(" ", "");
          if (se.listClaimed && se.listClaimed.length > 0) {
           var listclaim = se.listClaimed.filter((item) => { return item.insurance_code == element.id && item.bookingid == trip.booking_id });
            var listuniqueclaimed:any = [];
            if (listclaim && listclaim.length > 0) {
              listclaim.forEach(element => {
                if (listuniqueclaimed.length == 0) {
                  listuniqueclaimed.push(element);
                } else {
                  var bexists = listuniqueclaimed.filter((el) => { return el.flight_number == element.flight_number }).length > 0 ? true : false;
                  if (!bexists) {
                    listuniqueclaimed.push(element);
                  }
                }
              });
            }
            claimed = listuniqueclaimed.length > 1 ? true : false;
            var listclaimdepart = se.listClaimed.filter((el) => { return el.flight_number == fnDepart && el.insurance_code == element.id && el.bookingid == trip.booking_id });
            var listuniqueclaimdepart:any = [];
            if (listclaimdepart && listclaimdepart.length > 0) {
              listclaimdepart.forEach(element => {
                if (listuniqueclaimdepart.length == 0) {
                  listuniqueclaimdepart.push(element);
                } else {
                  var bexists = listuniqueclaimdepart.filter((el) => { return el.flight_number == element.flight_number }).length > 0 ? true : false;
                  if (!bexists) {
                    listuniqueclaimdepart.push(element);
                  }
                }
              });
            }
            claimedDepart = listuniqueclaimdepart.length > 1 ? true : false;
    
            var listclaimreturn = se.listClaimed.filter((el) => { return el.flight_number == fnReturn && el.insurance_code == element.id && el.bookingid == trip.booking_id });
            var listuniqueclaimreturn:any = [];
            if (listclaimreturn && listclaimreturn.length > 0) {
              listclaimreturn.forEach(element => {
                if (listuniqueclaimreturn.length == 0) {
                  listuniqueclaimreturn.push(element);
                } else {
                  var bexists = listuniqueclaimreturn.filter((el) => { return el.flight_number == element.flight_number }).length > 0 ? true : false;
                  if (!bexists) {
                    listuniqueclaimreturn.push(element);
                  }
                }
              });
            }
            claimedReturn = listuniqueclaimreturn.length > 1 ? true : false;
          }
          //Nếu chưa có tron listclaimed thì kiểm tra tiếp trong list chuyến bay ban đầu(cho trường hợp hủy chuyến)
          if (se.listClaimedFlightOriginal && se.listClaimedFlightOriginal.length > 0) {
            if (!claimedDepart) {
              claimedDepart = se.listClaimedFlightOriginal.filter((el) => { return el.flight_number == fnDepart && el.insurance_code == element.insurance_code && el.bookingid == trip.booking_id }).length > 0 ? true : false;
            }
            if (!claimedReturn) {
              claimedReturn = se.listClaimedFlightOriginal.filter((el) => { return el.flight_number == fnReturn && el.insurance_code == element.insurance_code && el.bookingid == trip.booking_id }).length > 0 ? true : false;
            }
          }
          var itemAdult = { claimed: claimed, insurance_code: element.id, customer_name: element.name, customer_id: element.identification, customer_address: element.address, customer_dob: element.birth, claimedDepart: claimedDepart, claimedReturn: claimedReturn }
          arrinsurranceHis.push(itemAdult);
        });
    
        let listChild:any = [];
        trip.insuranceInfo.childList.forEach(element => {
          let claimed = false, claimedDepart = false, claimedReturn = false;
          if (element.claimedFlights && element.claimedFlights.length > 0) {
            element.claimedFlights.forEach((fn) => {
              if (!se.checkExitClaim(se.listClaimed, element, trip.booking_id)) {
                se.listClaimed.push({ flight_number: fn, insurance_code: element.id, bookingid: trip.booking_id });
              }
            })
          }
    
          let fnDepart = departFlightNumber.replace(" ", ""),
            fnReturn = returnFlightNumber.replace(" ", "");
          if (se.listClaimed && se.listClaimed.length > 0) {
            var listclaim = se.listClaimed.filter((item) => { return item.insurance_code == element.id && item.bookingid == trip.booking_id });
            var listuniqueclaimed:any = [];
            listclaim.forEach(element => {
              if (listuniqueclaimed.length == 0) {
                listuniqueclaimed.push(element);
              } else {
                var bexists = listuniqueclaimed.filter((el) => { return el.flight_number == element.flight_number }).length > 0 ? true : false;
                if (!bexists) {
                  listuniqueclaimed.push(element);
                }
              }
            });
            claimed = listuniqueclaimed.length > 1 ? true : false;
            var listclaimdepart = se.listClaimed.filter((el) => { return el.flight_number == fnDepart && el.insurance_code == element.id && el.bookingid == trip.booking_id });
            var listuniqueclaimdepart:any = [];
            listclaimdepart.forEach(element => {
              if (listuniqueclaimdepart.length == 0) {
                listuniqueclaimdepart.push(element);
              } else {
                var bexists = listuniqueclaimdepart.filter((el) => { return el.flight_number == element.flight_number }).length > 0 ? true : false;
                if (!bexists) {
                  listuniqueclaimdepart.push(element);
                }
              }
            });
            claimedDepart = listuniqueclaimdepart.length > 1 ? true : false;
            var listclaimreturn = se.listClaimed.filter((el) => { return el.flight_number == fnReturn && el.insurance_code == element.id && el.bookingid == trip.booking_id });
            var listuniqueclaimreturn:any = [];
            listclaimreturn.forEach(element => {
              if (listuniqueclaimreturn.length == 0) {
                listuniqueclaimreturn.push(element);
              } else {
                var bexists = listuniqueclaimreturn.filter((el) => { return el.flight_number == element.flight_number }).length > 0 ? true : false;
                if (!bexists) {
                  listuniqueclaimreturn.push(element);
                }
              }
            });
            claimedReturn = listuniqueclaimreturn.length > 1 ? true : false;
          }
          //Nếu chưa có tron listclaimed thì kiểm tra tiếp trong list chuyến bay ban đầu(cho trường hợp hủy chuyến)
          if (se.listClaimedFlightOriginal && se.listClaimedFlightOriginal.length > 0) {
            if (!claimedDepart) {
              claimedDepart = se.listClaimedFlightOriginal.filter((el) => { return el.flight_number == fnDepart && el.insurance_code == element.insurance_code && el.bookingid == trip.booking_id }).length > 0 ? true : false;
            }
            if (!claimedReturn) {
              claimedReturn = se.listClaimedFlightOriginal.filter((el) => { return el.flight_number == fnReturn && el.insurance_code == element.insurance_code && el.bookingid == trip.booking_id }).length > 0 ? true : false;
            }
          }
          var itemchild = { claimed: claimed, insurance_code: element.id, customer_name: element.name, customer_id: element.identification, customer_address: element.address, customer_dob: element.birth, claimedDepart: claimedDepart, claimedReturn: claimedReturn }
          se.arrchildinsurrance.push(itemchild);
          listChild.push(element);
        });
    
        se.gf.setParams({ childlist: listChild, trip: trip, listInsurrance: arrinsurranceHis, departFlightNumber: departFlightNumber, returnFlightNumber: returnFlightNumber, listClaimed: se.listClaimed }, 'insurrenceHistory');
        return await popover.present();
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
        if(ischild && !se.checkChildAge(item, (type == 1 || type == 3) ? true : false )){
          se.gf.showToastWarning('Trẻ em dưới 14 tuổi sẽ thực hiện yêu cầu bồi thường bảo hiểm theo người lớn đi cùng');
          return;
        }
        se.checkValidDate(trip, (type == 1 || type == 3) ? se.cincombodepartureflightnumberdisplay : se.cincomboarrivalflightnumberdisplay ).then((valid) => {
          if(valid){
            se.gf.setParams({ trip: trip, currentTrip: se.currentTrip }, 'mytripbookingdetail');
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
            se.valueGlobal.backpageCathay='order';
            se.router.navigateByUrl("/insurrancedetail");
          }else{
            se.showWarning('Chuyến bay chưa khởi hành nên quý khách chưa thực hiện claim bảo hiểm!') 
          }
        })
      }

      checkValidDate(trip, flightNumber) : Promise<any>{
        return new Promise((resolve, reject) => {
          let d =  moment(new Date()).format('YYYY-MM-DD');
          let obj = trip.bookingsComboData.filter((f) => {
            if(f.departureDate){
              let arr = f.departureDate.split('-');
              let newdate = new Date(arr[2], arr[1] - 1, arr[0]);
              let df = moment(newdate).format('YYYY-MM-DD');
              return f.flightNumner && f.flightNumner.replace(' ','') == flightNumber.replace(' ','') && moment(d).diff(df, 'days') >= 0;
            }
           
          });
          console.log(obj);
          
          resolve(obj && obj.length >0);
        })
      }

      /**
       * Valid tuổi trẻ em claim riêng > 14 tuổi
       * @param child 
       * @returns 
       */
      checkChildAge(child, isdepart){
        let arr =child.birth.split('-');
        let newdate = new Date(arr[2], arr[1] - 1, arr[0]);
        let chilđob = moment(newdate).format('YYYY-MM-DD');
        console.log(moment(moment(isdepart ? this.cincombodeparture : this.cincomboarrival).format('YYYY-MM-DD')).diff(chilđob, 'days'));
        return moment(moment(isdepart ? this.cincombodeparture : this.cincomboarrival).format('YYYY-MM-DD')).diff(chilđob, 'days') > 5113
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
          //Nếu chưa có tron listclaimed thì kiểm tra tiếp trong list chuyến bay ban đầu(cho trường hợp hủy chuyến)
          if (se.listClaimedFlightOriginal && se.listClaimedFlightOriginal.length > 0) {
            if (!claimedDepart) {
              claimedDepart = se.listClaimedFlightOriginal.filter((el) => { return el.flight_number.replace(" ", "") == fnDepart && el.insurance_code == item.insurance_code && el.bookingid == trip.booking_id }).length > 0 ? true : false;
            }
            if (!claimedReturn) {
              claimedReturn = se.listClaimedFlightOriginal.filter((el) => { return el.flight_number.replace(" ", "") == fnReturn && el.insurance_code == item.insurance_code && el.bookingid == trip.booking_id }).length > 0 ? true : false;
            }
          }
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
    
      async showWarning(msg) {
        var se = this;
        const toast = await se.toastCtrl.create({
          message: msg,
          duration: 3000,
          position: 'top',
        });
        toast.present();
      }
    
    
      showInsurranceInfo() {
        var se = this;
        se.gf.setParams({ currentTrip: se.currentTrip }, 'mytripbookingdetail');
        se.router.navigateByUrl('/insurrancenote');
      }
    
      /**
       * Refresh lại thông tin bảo hiểm đã claim
       * @param bkgid id bkg đã claim bảo hiểm
       */
      public async refreshInsurranceInfo(): Promise<void> {
        var se = this;
        let objClaimed = se.activityService.objClaimed;
        if (objClaimed) {
          if (!se.listClaimedFlightOriginal) {
            se.listClaimedFlightOriginal = [];
          }
    
          let fn = objClaimed.flightNumber.replace(" ", "");
          var objcheck = { flight_number: fn, insurance_code: objClaimed.code, bookingid: se.activityService.insurranceBookingId };
          if (!se.checkExitClaim(se.listClaimed, objcheck, se.activityService.insurranceBookingId)) {
            se.listClaimed.push(objcheck);
            if (objClaimed.flightNumberOriginal) {
              se.listClaimedFlightOriginal.push({ flight_number: objClaimed.flightNumberOriginal, insurance_code: objClaimed.code, bookingid: se.activityService.insurranceBookingId });
            }
          }
    
          if (objClaimed.listchildclaimed && objClaimed.listchildclaimed.length > 0) {
            objClaimed.listchildclaimed.forEach(element => {
              var objChildcheck = { flight_number: fn, insurance_code: element.code };
              if (!se.checkExitClaim(se.listClaimed, objChildcheck, se.activityService.insurranceBookingId)) {
                se.listClaimed.push(objChildcheck);
                if (objClaimed.flightNumberOriginal) {
                  se.listClaimedFlightOriginal.push({ flight_number: objClaimed.flightNumberOriginal, insurance_code: element.code, bookingid: se.activityService.insurranceBookingId });
                }
              }
            });
          }
        }
      }
    
      doRefresh(event) {
        var se = this;
        if(!se.isConnected){
          se.gf.showToastWarning('Thiết bị đang không kết nối mạng, vui lòng bật kết nối để tiếp tục thao tác!');
          se.hasloaddata = true;
          se.loaddatadone = true;
          return;
        }
        se.mytripcount = 0;
        se.nexttripcounttext = "";
        se.foodtextorder ="";
        se.pageIndex = 1;
        se.hasdata = false;
        se.listMyTrips =[];
        se.listHistoryTrips = [];
        se.arrinsurrance = [];
        se.hasloaddata = false;
        se.loaddatadone = false;
        se.getdata(null, false);
        setTimeout(() => {
          if(event){
            event.target.complete();
          }
          se.getdata(null, true);
        }, 1000);
        se.storage.remove('listrequesttrips');
        se.storage.get('auth_token').then(auth_token => {
          se.loginuser = auth_token;
        });
      }
    
      refreshData() {
        var se = this;
        se.presentLoadingData();
        se.getdata(null, false);
      }
    
      showPolicy(trip) {
        if (trip.off_hotel_paypolicy) {
          let textstr = trip.off_hotel_paypolicy;
          this.gf.setParams({ showFromMytrip: true, textcancel: textstr, RoomName: trip.room_name }, 'roomInfo');
          this.searchhotel.backPage = "tab3";
          this.navCtrl.navigateForward('/roomcancel');
        }
      }
      showRules() {
        this.navCtrl.navigateForward("/rules");
      }
      loadLocation() : Promise<any>{
        var se = this;
        return new Promise((resolve, reject) => {
          if(se._flightService.listAirport && se._flightService.listAirport.length >1){
            resolve(se._flightService.listAirport);
          }else{
            let urlPath = C.urls.baseUrl.urlFlight + "gate/apiv1/AllPlace?token=3b760e5dcf038878925b5613c32615ea3ds";
            let header = {
                  "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                  'Content-Type': 'application/json; charset=utf-8'
                };
            se.gf.RequestApi('GET', urlPath, header, {}, 'booking', 'loadLocation').then((data) => {
              let result = data;
                if (result && result.length > 0) {
                  se.zone.run(() => {
                    se._flightService.listAirport = [...result];
                    resolve([...result]);
                  })
          
                }else{
                  resolve([]);
                }
            });
          }
        })
        
      }
      payment(trip) {
        var se = this;
        if(!se.isConnected){
          se.gf.showToastWarning('Thiết bị đang không kết nối mạng, vui lòng bật kết nối để tiếp tục thao tác!');
          se.hasloaddata = true;
          return;
        }
        se.activityService.objPaymentMytrip = { returnPage: 'mytrip', tripindex: se.currentTrip, paymentStatus: 0, bookingid: trip.HotelIdERP, trip: trip };
        C.writePaymentLog("order", "payment", "purchase", trip.HotelIdERP);
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
      paymentselect(trip,stt) {
        var se = this;
        if(!se.isConnected){
          se.gf.showToastWarning('Thiết bị đang không kết nối mạng, vui lòng bật kết nối để tiếp tục thao tác!');
          se.hasloaddata = true;
          return;
        }
        se.activityService.objPaymentMytrip = { returnPage: 'mytrip', tripindex: se.currentTrip, paymentStatus: 0, bookingid: trip.HotelIdERP, trip: trip };
        if (trip.booking_type == 'COMBO_FLIGHT') {
          if (stt==0) {
            se.navCtrl.navigateForward("/mytripaymentflightcombo/0");
          }
          else{
            se.navCtrl.navigateForward("/mytripaymentflightcombo/1");
          }
        } else if (trip.booking_type == 'COMBO_VXR') {
          if (stt==0) {
            se.navCtrl.navigateForward("/mytripaymentcarcombo/0");
          }
          else{
            se.navCtrl.navigateForward("/mytripaymentcarcombo/1");
          }
        } 
        else if(trip.isFlyBooking){
          if (stt==0) {
            se.navCtrl.navigateForward("/mytripaymentflightselect/0");
          }
          else{
            se.navCtrl.navigateForward("/mytripaymentflightselect/1");
          }
        }
        else {
          // stt 0:CKNH
          if (stt==0) {
            se.navCtrl.navigateForward("/mytripaymentselect/0");
          }
          else{
            se.navCtrl.navigateForward("/mytripaymentselect/1");
          }
        }
        C.writePaymentLog("order", "paymentselect", "purchase", trip.HotelIdERP);
      }
    
      showHistoryTrip(){
        if(!this.isConnected){
          this.gf.showToastWarning('Thiết bị đang không kết nối mạng, vui lòng bật kết nối để tiếp tục thao tác!');
          return;
        }
        this._mytripservice.backroute = "order";
        if(!this._mytripservice.rootPage){
          this._mytripservice.rootPage = "homehotel";
        }
        this.navCtrl.navigateForward("mytriphistory");
      }
    
      getAirportByCode(code){
        var se = this, res ="";
        if(se._flightService.listAirport && se._flightService.listAirport.length >0){
          let itemmap = se._flightService.listAirport.filter((item) => { return item.code == code});
          res = (itemmap && itemmap.length >0) ? itemmap[0].airport : ""; 
        }
        return res;
      }
      

      showtripdetail(trip){
        if(!this.isConnected){
          this.gf.showToastWarning('Thiết bị đang không kết nối mạng, vui lòng bật kết nối để tiếp tục thao tác!');
          return;
        }
        if(trip){
          this.enableheader = false;
          this._mytripservice.tripdetail = trip;
          this._mytripservice.currentTrip = this.currentTrip;
          if(this._mytripservice.rootPage == "homeflight"){
            this._mytripservice.backroute = "tabs/tab1";
          }else{
            this._mytripservice.backroute = "/app/tabs/tab3";
          }
          this.navCtrl.navigateForward('bookingdetail', {animated: true});
        }
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
    
      loadOrder(){
        var se = this;
        if(!se.isConnected){
          return;
        }
        let headers =
            {
              token: "584f470f-7a45-4793-a136-0084fadea81c",
            };
        let strUrl = C.urls.baseUrl.urlFood + "/api/FOBooking/GetBookingByMember?memberid="+ se.memberid;
        se.gf.RequestApi('GET', strUrl, headers, {}, 'booking', 'loadOrder').then((data) => {
          if(data){
              var result = data;
              if(result.response){
                se.loadReviewMember();
               
                  se.mylistOrders = result.response;
                  if(se.mylistOrders && se.mylistOrders.length >0){
                      
                      se.executeBindDetailOrder(se.mylistOrders).then(()=>{
                          
                          se.zone.run(() => se.mylistOrders.sort(function (a, b) {
                            let fcount = se.mylistOrders.filter((o) => o.isActive).length;
                              let itemf = se.mylistOrders.filter((o) => o.isActive);
                              if(itemf.length ==1){
                                se.showOnlyOne = itemf[0].detailBooking.length ==1 ? true : false;
                              }else{
                                se.showOnlyOne = false;
                              }
                              se.foodtextorder = fcount > 0 ? (' ('+fcount+') ') : '';
                              if(se.showOnlyOne == 1){
                                let item = se.mylistOrders.filter((o) => o.isActive);
                                se.getFoodDetail(item[0]);
                              }
                              let direction = -1;
                              if (moment(a["bookingDate"]).diff(moment(b["bookingDate"]),'minutes') >0) {
                                  return 1 * direction;
                                }
                                else {
                                  return -1 * direction;
                                }
                              })
                          )
                          setTimeout(()=>{
                              se.loaddatadone = true;
                              se._mytripservice.mylistOrders = se.mylistOrders;
                          },100)
                         
                      })
                      
                      
                  }else{
                      se.mylistOrders = [];
                      se.loaddatadone = true;
                      se.foodtextorder = "";
                  }
              }else{
                se.zone.run(()=>{
                  se.mylistOrders = [];
                  se.loaddatadone = true;
                })
               
            }
          }
        })
        
    }
    
    executeBindDetailOrder(listorder):Promise<any>{
        var se = this;
        return new Promise((resolve, reject) => {
            let count=0;
            se.listOrderDinnerActive = [];
            se.listOrderActive = [];
            for (let index = 0; index < listorder.length; index++) {
                const element = listorder[index];
                element.listDetailCurrentWeek = [];
                element.listDetailNextWeek = [];
                element.listDetailHistory = [];
                  let timediffminutes = moment(new Date()).diff(moment(element.startDate), 'minutes');
                  let timediffhours = moment(new Date()).diff(moment(element.startDate), 'hours');
                  let timediffdays = moment(new Date()).diff(moment(element.endDate), 'days');
                //tạm rem
                let maxId = Math.max(...element.fobookingDetail.map(o => o.combo.categoryId), 0);
                let minId = Math.min(...element.fobookingDetail.map(o => o.combo.categoryId));
                if(minId <=24 && maxId >24){
                  element.isComplexOrder = true;
                }
    
                if(element.isComplexOrder){
                  element.detailBooking = [];
                    element.fobookingDetail.forEach(elementbd => {
                      if((this.listWeek[0] && this.listWeek[0].startDate && this.listWeek[0].endDate) && ((moment(elementbd.startDate).format('YYYY-MM-DD') == this.listWeek[0].startDate && moment(elementbd.endDate).format('YYYY-MM-DD') == this.listWeek[0].endDate) || 
                      ((this.listWeek[0] && this.listWeek[0].startDate && this.listWeek[0].endDate) && moment(element.startDate).format('YYYY-MM-DD') == this.listWeek[0].startDate && moment(element.endDate).format('YYYY-MM-DD') == this.listWeek[0].endDate)) )
                      {
                          elementbd.iscurrentweek = true;
                          element.hasitemcurrentweek = true;
                      }else{
                        if(moment(elementbd.startDate).diff(new Date(),'days') >0){
                          elementbd.iscurrentweek = false;
                          elementbd.isnextweek = true;
                          element.hasitemnextweek = true;
                        }
                      }
    
                      let timediffminutes = moment(new Date()).diff(moment(elementbd.startDate), 'minutes');
                      let timediffhours = moment(new Date()).diff(moment(elementbd.startDate), 'hours');
                      let timediffdays = moment(new Date()).diff(moment(elementbd.endDate), 'days');
                      let ishistory = moment(new Date()).diff(moment(elementbd.endDate), 'hours') >= 13 ? true : false;
                      if(element.status != 1 && (element.status != 2 || (element.status == 2 && timediffdays <=0) ) && !ishistory){
                        if(elementbd.combo.categoryId <=24){
                          elementbd.isDinner = false;
                          if(elementbd.startDate && elementbd.endDate){
                            elementbd.nameDisplay = "Gói Tuần " + moment(elementbd.startDate).format("DD/MM") + " - "+ moment(moment(elementbd.startDate).add('days',4)).format("DD/MM");
                          }else{
                            elementbd.nameDisplay = "Gói Tuần " + moment(element.startDate).format("DD/MM") + " - "+ moment(moment(element.startDate).add('days',4)).format("DD/MM");
                          }
                          element.isOver = moment(new Date()).diff(moment(elementbd.endDate), 'hours') >= 13 ? true : false;
                          element.statusOrder = timediffdays <= 0 ? ( timediffdays == 0 ? ( timediffminutes < 690 ? 2 : (timediffminutes <= 750 ? 3 : 4 ) ) : 1 ) : 1;
                          element.allowReview = (element.statusOrder ==4 || (timediffdays >=1 && (element.status == 1 || element.status == 3) )) ? true : false;
      
                        }else{
                          elementbd.isDinner = true;
                          elementbd.nameDisplay = elementbd.combo.category.name;
                          elementbd.weeknameDisplay = elementbd.combo.category.name;
    
                          if(elementbd.startDate && elementbd.endDate){
                            elementbd.weekDisplay = "Tuần "+ moment(elementbd.startDate).format("DD/MM") + " - "+ moment(moment(elementbd.startDate).add('days',4)).format("DD/MM") + " · "+(elementbd.quantity ?  elementbd.quantity : element.quantity)+ " khẩu phần";
                          }else{
                            elementbd.weekDisplay = "Tuần "+ moment(element.startDate).format("DD/MM") + " - "+ moment(moment(element.startDate).add('days',4)).format("DD/MM") + " · "+ (elementbd.quantity ?  elementbd.quantity : element.quantity) + " khẩu phần";
                          }
                          element.isOver = moment(new Date()).diff(moment(elementbd.endDate), 'hours') >= 19 ? true : false;
                          element.statusOrder = timediffdays <= 0 ? ( timediffdays == 0 ? ( timediffminutes < 1140 ? 2 : (timediffminutes <= 1050 ? 3 : 4 ) ) : 1 ) : 1;
                          element.allowReview = (element.statusOrder ==4 || (timediffdays >=1 && (element.status == 1 || element.status == 3) )) ? true : false;
                        }
      
                        elementbd.priceDisplay = se.gf.convertNumberToString(elementbd.itemPrice);
                        se.loadMenuOrderDetail(elementbd, element);
                      }
                      else{
                          if(elementbd.combo.categoryId <=24){
                            elementbd.isDinner = false;
                            if(elementbd.startDate && elementbd.endDate){
                              elementbd.nameDisplay = "Gói Tuần " + moment(elementbd.startDate).format("DD/MM") + " - "+ moment(moment(elementbd.startDate).add('days',4)).format("DD/MM");
                            }else{
                              elementbd.nameDisplay = "Gói Tuần " + moment(element.startDate).format("DD/MM") + " - "+ moment(moment(element.startDate).add('days',4)).format("DD/MM");
                            }
                            element.isOver = moment(new Date()).diff(moment(elementbd.endDate), 'hours') >= 13 ? true : false;
                            element.statusOrder = timediffdays <= 0 ? ( timediffdays == 0 ? ( timediffminutes < 690 ? 2 : (timediffminutes <= 750 ? 3 : 4 ) ) : 1 ) : 1;
                            element.allowReview = (element.statusOrder ==4 || (timediffdays >=1 && (element.status == 1 || element.status == 3) )) ? true : false;
                          }else{
                            elementbd.isDinner = true;
                            elementbd.nameDisplay = elementbd.combo.category.name;
                            elementbd.weeknameDisplay = elementbd.combo.category.name;
                            if(elementbd.startDate && elementbd.endDate){
                              elementbd.weekDisplay = "Tuần "+ moment(elementbd.startDate).format("DD/MM") + " - "+ moment(moment(elementbd.startDate).add('days',4)).format("DD/MM") + " · "+(elementbd.quantity ?  elementbd.quantity : element.quantity)+ " khẩu phần";
                            }else{
                              elementbd.weekDisplay = "Tuần "+ moment(element.startDate).format("DD/MM") + " - "+ moment(moment(element.startDate).add('days',4)).format("DD/MM") + " · "+ (elementbd.quantity ?  elementbd.quantity : element.quantity) + " khẩu phần";
                            }
                            element.isOver = moment(new Date()).diff(moment(elementbd.endDate), 'hours') >= 19 ? true : false;
                            element.statusOrder = timediffdays <= 0 ? ( timediffdays == 0 ? ( timediffminutes < 1140 ? 2 : (timediffminutes <= 1050 ? 3 : 4 ) ) : 1 ) : 1;
                            element.allowReview = (element.statusOrder ==4 || (timediffdays >=1 && (element.status == 1 || element.status == 3) )) ? true : false;
                          }
                          elementbd.priceDisplay = se.gf.convertNumberToString(elementbd.itemPrice);
                          se.loadMenuOrderDetailHistory(elementbd, element);
                        element.isActive = false;
                      }
                    });
                }else{
                  let ishistory = moment(new Date()).diff(moment(element.endDate), 'hours') >= 13 ? true : false;
                  if(element.status != 1 && (element.status != 2 || (element.status == 2 && timediffdays <=0) )  && !ishistory){
                    if(element.fobookingDetail && element.fobookingDetail.length >0){
                        element.detailBooking = [];
                        element.fobookingDetail.forEach(detail => {
                          if((this.listWeek[0] && this.listWeek[0].startDate && this.listWeek[0].endDate) &&  (moment(detail.startDate).format('YYYY-MM-DD') == this.listWeek[0].startDate && moment(detail.endDate).format('YYYY-MM-DD') == this.listWeek[0].endDate) 
                          || ((this.listWeek[0] && this.listWeek[0].startDate && this.listWeek[0].endDate) && moment(element.startDate).format('YYYY-MM-DD') == this.listWeek[0].startDate && moment(element.endDate).format('YYYY-MM-DD') == this.listWeek[0].endDate))
                            {
                                detail.iscurrentweek = true;
                                element.hasitemcurrentweek = true;
                            }else{
                              if(moment(detail.startDate).diff(moment(new Date()),'days') >0){
                                detail.iscurrentweek = false;
                                detail.isnextweek = true;
                                element.hasitemnextweek = true;
                              }
                            }
                          if(detail.combo.categoryId <=24){
                            detail.isDinner = false;
                            if(detail.startDate && detail.endDate){
                              detail.nameDisplay = "Gói Tuần " + moment(detail.startDate).format("DD/MM") + " - "+ moment(moment(detail.startDate).add('days',4)).format("DD/MM");
                            }else{
                              detail.nameDisplay = "Gói Tuần " + moment(element.startDate).format("DD/MM") + " - "+ moment(moment(element.startDate).add('days',4)).format("DD/MM");
                            }
                            detail.isOver = moment(new Date()).diff(moment(detail.endDate), 'hours') >= 13 ? true : false;
                            element.statusOrder = timediffdays <= 0 ? ( timediffdays == 0 ? ( timediffminutes < 690 ? 2 : (timediffminutes <= 750 ? 3 : 4 ) ) : 1 ) : 1;
                            element.allowReview = (element.statusOrder ==4 || (timediffdays >=1 && (element.status == 1 || element.status == 3) )) ? true : false;
                          }else{
                            detail.isDinner = true;
                            detail.weeknameDisplay = detail.combo.category.name;
                            detail.nameDisplay = detail.combo.category.name;
                            if(detail.startDate && detail.endDate){
                              detail.weekDisplay = "Tuần "+ moment(detail.startDate).format("DD/MM") + " - "+ moment(moment(detail.startDate).add('days',4)).format("DD/MM") + " · "+(detail.quantity ?  detail.quantity : element.quantity) + " khẩu phần";
                            }else{
                              detail.weekDisplay = "Tuần "+ moment(element.startDate).format("DD/MM") + " - "+ moment(moment(element.startDate).add('days',4)).format("DD/MM") + " · "+(detail.quantity ?  detail.quantity : element.quantity) + " khẩu phần";
                            }
                            element.isOver = moment(new Date()).diff(moment(element.endDate), 'hours') >= 19 ? true : false;
                            element.statusOrder = timediffdays <= 0 ? ( timediffdays == 0 ? ( timediffminutes < 1140 ? 2 : (timediffminutes <= 1050 ? 3 : 4 ) ) : 1 ) : 1;
                            element.allowReview = (element.statusOrder ==4 || (timediffdays >=1 && (element.status == 1 || element.status == 3) )) ? true : false;
                          }
                            detail.priceDisplay = se.gf.convertNumberToString(detail.itemPrice);
                            se.loadMenuOrderDetail(detail, element);
                        });
                    }
                  }
                  else{
                    element.isActive = false;
                    if(element.fobookingDetail && element.fobookingDetail.length >0){
                      element.detailBooking = [];
                      element.fobookingDetail.forEach(detail => {
                        if((this.listWeek[0] && this.listWeek[0].startDate && this.listWeek[0].endDate) &&  (moment(detail.startDate).format('YYYY-MM-DD') == this.listWeek[0].startDate && moment(detail.endDate).format('YYYY-MM-DD') == this.listWeek[0].endDate) 
                        || ((this.listWeek[0] && this.listWeek[0].startDate && this.listWeek[0].endDate) &&moment(element.startDate).format('YYYY-MM-DD') == this.listWeek[0].startDate && moment(element.endDate).format('YYYY-MM-DD') == this.listWeek[0].endDate))
                          {
                              detail.iscurrentweek = true;
                              element.hasitemcurrentweek = true;
                          }else{
                            if(moment(detail.startDate).diff(moment(new Date()),'days') >0){
                              detail.iscurrentweek = false;
                              detail.isnextweek = true;
                              element.hasitemnextweek = true;
                            }
                          }
                        if(detail.combo.categoryId <=24){
                          detail.isDinner = false;
      
                          if(detail.startDate && detail.endDate){
                            detail.nameDisplay = "Gói Tuần " + moment(detail.startDate).format("DD/MM") + " - "+ moment(moment(detail.startDate).add('days',4)).format("DD/MM");
                          }else{
                            detail.nameDisplay = "Gói Tuần " + moment(element.startDate).format("DD/MM") + " - "+ moment(moment(element.startDate).add('days',4)).format("DD/MM");
                          }
                          detail.isOver = moment(new Date()).diff(moment(detail.endDate), 'hours') >= 13 ? true : false;
                          element.statusOrder = timediffdays <= 0 ? ( timediffdays == 0 ? ( timediffminutes < 690 ? 2 : (timediffminutes <= 750 ? 3 : 4 ) ) : 1 ) : 1;
                          element.allowReview = (element.statusOrder ==4 || (timediffdays >=1 && (element.status == 1 || element.status == 3) )) ? true : false;
                        }else{
                          detail.isDinner = true;
                          detail.weeknameDisplay = detail.combo.category.name;
                          detail.nameDisplay = detail.combo.category.name;
                          if(detail.startDate && detail.endDate){
                            detail.weekDisplay = "Tuần "+ moment(detail.startDate).format("DD/MM") + " - "+ moment(moment(detail.startDate).add('days',4)).format("DD/MM") + " · "+(detail.quantity ?  detail.quantity : element.quantity) + " khẩu phần";
                          }else{
                            detail.weekDisplay = "Tuần "+ moment(element.startDate).format("DD/MM") + " - "+ moment(moment(element.startDate).add('days',4)).format("DD/MM") + " · "+(detail.quantity ?  detail.quantity : element.quantity) + " khẩu phần";
                          }
                          element.isOver = moment(new Date()).diff(moment(element.endDate), 'hours') >= 19 ? true : false;
                          element.statusOrder = timediffdays <= 0 ? ( timediffdays == 0 ? ( timediffminutes < 1140 ? 2 : (timediffminutes <= 1050 ? 3 : 4 ) ) : 1 ) : 1;
                          element.allowReview = (element.statusOrder ==4 || (timediffdays >=1 && (element.status == 1 || element.status == 3) )) ? true : false;
                        }
                          detail.priceDisplay = se.gf.convertNumberToString(detail.itemPrice);
                          se.loadMenuOrderDetailHistory(detail, element);
                      });
                    }
                  }
                }
                count++;
            }
            if(count == listorder.length){
                resolve(listorder);
            }
        })
    }
    
    loadMenuOrderDetailHistory(orderdetail, order){
      var se = this;
      let data = orderdetail.detailCombo;
      if(data){
        orderdetail.categoryId = orderdetail.combo.categoryId;
          orderdetail.menu ={};
          orderdetail.menus = [];
          orderdetail.menus.push(data.menuId2);
          orderdetail.menus.push(data.menuId3);
          orderdetail.menus.push(data.menuId4);
          orderdetail.menus.push(data.menuId5);
          orderdetail.menus.push(data.menuId6);
          if(data.menuId2){
            orderdetail.menu = data.menuId2;
          }
          if(order.statusOrder == 1){
            if(data.menuId2){
              orderdetail.menu = data.menuId2;
            }
          }else if(order.statusOrder == 2){
            let curdate = moment(order.bookingDate);
            let startdatemenu = moment(order.startDate);
            if(curdate.diff(startdatemenu,'days') == 0){
              if(data.menuId2){
                orderdetail.menu = data.menuId2;
              }
            }
            else if(curdate.diff(startdatemenu,'days') == 1){
              if(data.menuId3){
                orderdetail.menu = data.menuId3;
              }
            }
            else if(curdate.diff(startdatemenu,'days') == 2){
              if(data.menuId4){
                orderdetail.menu = data.menuId4;
              }
            }
            else if(curdate.diff(startdatemenu,'days') == 3){
              if(data.menuId5){
                orderdetail.menu = data.menuId5;
              }
            }
            else if(curdate.diff(startdatemenu,'days') == 4){
              if(data.menuId6){
                orderdetail.menu = data.menuId6;
              }
            }
          }
          se.orderMenu(orderdetail.menu);
          orderdetail.name = orderdetail.combo.category.name;
          orderdetail.typePriceId = orderdetail.combo.category.typePriceId;
          orderdetail.totalPriceDisplay = se.gf.convertNumberToString(orderdetail.itemPrice * orderdetail.quantity);
          orderdetail.image = orderdetail.detailCombo.image;
          if(orderdetail.image.indexOf('104x104') == -1){
            let urlavatar = orderdetail.image.substring(0, orderdetail.image.length - 4);
            let tail = orderdetail.image.substring(orderdetail.image.length - 4, orderdetail.image.length);
            orderdetail.image = urlavatar + "-104x104" + tail;
          }
          let extraitem = JSON.parse(orderdetail.extra);
          var extraText = "";
          if(extraitem && extraitem.length >0){
            extraText =  extraitem.map((item) => item.name).join(" · ");
          }
          orderdetail.extraDisplay = extraText;
          order.detailBooking.push(orderdetail);
          orderdetail.isDinner = orderdetail.combo.categoryId >24 ? true : false;
          if(order.isComplexOrder){
            se.listOrderDinnerActive.push(order);
            se.listOrderActive.push(order);
          }else{
            if(order.isDinner){
              se.listOrderDinnerActive.push(order);
            }else{
              se.listOrderActive.push(order);
            }
          }
          orderdetail.weekname = "Tuần " + moment(orderdetail.startDate).format('DD/MM') + " - " + moment(orderdetail.endDate).format('DD/MM');
          order.listDetailHistory.push(orderdetail);
      }else{
          order.isActive = false;
      }
    }
    
    
    loadMenuOrderDetail(orderdetail, order){
      var se = this;
      let data = orderdetail.detailCombo;
      if(data ){
        orderdetail.categoryId = orderdetail.combo.categoryId;
          orderdetail.menu ={};
          orderdetail.menus = [];
          orderdetail.menus.push(data.menuId2);
          orderdetail.menus.push(data.menuId3);
          orderdetail.menus.push(data.menuId4);
          orderdetail.menus.push(data.menuId5);
          orderdetail.menus.push(data.menuId6);
          if(data.menuId2){
            orderdetail.menu = data.menuId2;
          }
          if(order.statusOrder == 1){
            if(data.menuId2){
              orderdetail.menu = data.menuId2;
            }
          }else if(order.statusOrder == 2){
            let curdate = moment(order.bookingDate);
            let startdatemenu = moment(order.startDate);
            if(curdate.diff(startdatemenu,'days') == 0){
              if(data.menuId2){
                orderdetail.menu = data.menuId2;
              }
            }
            else if(curdate.diff(startdatemenu,'days') == 1){
              if(data.menuId3){
                orderdetail.menu = data.menuId3;
              }
            }
            else if(curdate.diff(startdatemenu,'days') == 2){
              if(data.menuId4){
                orderdetail.menu = data.menuId4;
              }
            }
            else if(curdate.diff(startdatemenu,'days') == 3){
              if(data.menuId5){
                orderdetail.menu = data.menuId5;
              }
            }
            else if(curdate.diff(startdatemenu,'days') == 4){
              if(data.menuId6){
                orderdetail.menu = data.menuId6;
              }
            }
          }
          se.orderMenu(orderdetail.menu);
          orderdetail.name = orderdetail.combo.category.name;
          orderdetail.typePriceId = orderdetail.combo.category.typePriceId;
          orderdetail.totalPriceDisplay = se.gf.convertNumberToString(orderdetail.itemPrice * orderdetail.quantity);
          orderdetail.image = orderdetail.detailCombo.image;
          if(orderdetail.image.indexOf('104x104') == -1){
            let urlavatar = orderdetail.image.substring(0, orderdetail.image.length - 4);
            let tail = orderdetail.image.substring(orderdetail.image.length - 4, orderdetail.image.length);
            orderdetail.image = urlavatar + "-104x104" + tail;
          }
          let extraitem = JSON.parse(orderdetail.extra);
          var extraText = "";
          if(extraitem && extraitem.length >0){
            extraText =  extraitem.map((item) => item.name).join(" · ");
          }
          orderdetail.extraDisplay = extraText;
          order.detailBooking.push(orderdetail);
          order.isActive = true;
          orderdetail.isDinner = orderdetail.combo.categoryId >24 ? true : false;
          if(order.isComplexOrder){
            se.listOrderDinnerActive.push(order);
            se.listOrderActive.push(order);
          }else{
            if(order.isDinner){
              se.listOrderDinnerActive.push(order);
            }else{
              se.listOrderActive.push(order);
            }
          }
          if(orderdetail.iscurrentweek){
            order.listDetailCurrentWeek.push(orderdetail);
          }else if(orderdetail.isnextweek){
            order.listDetailNextWeek.push(orderdetail);
          }
          else{
            if(!order.isOver){
              orderdetail.weekname = "Tuần " + moment(orderdetail.startDate).format('DD/MM') + " - " + moment(orderdetail.endDate).format('DD/MM');
              order.listDetailHistory.push(orderdetail);
            }else{
              order.isActive = false;
              orderdetail.weekname = "Tuần " + moment(orderdetail.startDate).format('DD/MM') + " - " + moment(orderdetail.endDate).format('DD/MM');
              order.listDetailHistory.push(orderdetail);
            }
          }
      }else{
          order.isActive = false;
      }
    }
    
    orderMenu(menu){
      this.zone.run(() => {
        menu.listmenu = [];
        if(menu && menu.forecipe && menu.forecipe.length>0){
          menu.forecipe.forEach(element => {
            if(element.type == 5){
              menu.listmenu.push(element);
            }
            if(element.type == 4 || element.type == 7 || element.type ==6){
              menu.listmenu.push(element);
            }
            if(element.type == 3 || element.type == 8){
              menu.listmenu.push(element);
            }
          });
        }
        }
      )
    }
    
    loadReviewMember(){
      var se = this;
      let headers =
            {
              token: "584f470f-7a45-4793-a136-0084fadea81c",
            };
        let strUrl =  C.urls.baseUrl.urlFood + "/api/FOReview/GetReviewByMember?memberId="+ se.memberid;
        se.gf.RequestApi('GET', strUrl, headers, {}, 'booking', 'loadReviewMember').then((data) => {
          if(data){
              var result = data;
              if(result.response){
                let reviews = result.response;
                se.zone.run(()=>{
                  reviews.filter((re)=>{
                    let itemreview = se.mylistOrders.filter((or)=>{
                    return re.bookingId == or.id
                    })
          
                    if(itemreview && itemreview.length>0){
                      itemreview.forEach(element => {
                        element.allowReview = false;
                      });
                    }
                  })
                })
              }
            }
        });
    }
    
      getFoodDetail(order){
        let se = this;
        if(!se.isConnected){
          se.gf.showToastWarning('Thiết bị đang không kết nối mạng, vui lòng bật kết nối để tiếp tục thao tác!');
          se.hasloaddata = true;
          return;
        }
        let id = order.detailBooking[0].combo.categoryId;
                if(id){
                    let element = order.detailBooking[0];
                    let timediffminutes = 0,timediffhours = 0, timediffdays =0;
                    if(element.startDate){
                      timediffminutes = moment(new Date()).diff(moment(element.startDate), 'minutes');
                      timediffhours = moment(new Date()).diff(moment(element.startDate), 'hours');
                      timediffdays = moment(new Date()).diff(moment(element.startDate), 'days');
                    }else{
                      timediffminutes = moment(new Date()).diff(moment(order.startDate), 'minutes');
                      timediffhours = moment(new Date()).diff(moment(order.startDate), 'hours');
                      timediffdays = moment(new Date()).diff(moment(order.startDate), 'days');
                    }
                  element.menu ={};
                  if(element.detailCombo.menuId2){
                    element.menu = element.detailCombo.menuId2;
                  }
                  if(timediffdays == 0)//thứ 2
                  {
                    element.menu = element.detailCombo.menuId2;
                    se.setOrderStatus(element, 0);
                  }else if(timediffdays == 1){
                    if(element.detailCombo.menuId3){
                      element.menu = element.detailCombo.menuId3;
                      se.setOrderStatus(element, 1);
                    }
                  }
                  else if(timediffdays == 2){
                    if(element.detailCombo.menuId4){
                      element.menu = element.detailCombo.menuId4;
                      se.setOrderStatus(element, 2);
                    }
                  }
                  else if(timediffdays == 3){
                    if(element.detailCombo.menuId5){
                      element.menu = element.detailCombo.menuId5;
                      se.setOrderStatus(element, 3);
                    }
                  }
                  else if(timediffdays == 4){
                    if(element.detailCombo.menuId6){
                      element.menu = element.detailCombo.menuId6;
                      se.setOrderStatus(element, 4);
                    }
                  }else if(timediffdays >4 ){
                    element.statusOrderDetail = 4;
                  }
                  else{
                    element.statusOrderDetail = 1;
                  }
                  se.orderMenu(element.menu);
                    element.typePriceId = element.combo.category.typePriceId;
                    element.totalPriceDisplay = this.gf.convertNumberToString(element.itemPrice* element.quantity) ;
                    let extraitem = JSON.parse(element.extra);
                    var extraText = "";
                    if(extraitem && extraitem.length >0){
                      extraText =  extraitem.map((item) => item.name).join(" · ");
                    }
                    element.extraDisplay = extraText;
                    se.detail  = element;
                }
      }
    
      setOrderStatus(element, count){
        var se = this;
        let curdate =  moment(element.startDate).add(count, 'days');
        let days = moment(new Date()).diff(curdate, 'days');
        let minutes:any = moment(new Date()).diff(moment(curdate), 'minutes');
        if(element.isDinner){
          element.statusOrderDetail = days <= 0 ? ( days == 0 ? ( minutes < 990 ? 2 : (minutes <= 1050 ? 3 : 4 ) ) : 1 ) : 1;
        }else{
          element.statusOrderDetail = days <= 0 ? ( days == 0 ? ( minutes < 690 ? 2 : (minutes <= 750 ? 3 : 4 ) ) : 1 ) : 1;
        }
      }
    
      showOrderDetail(order,orderdetail){
        if(!this.isConnected){
          this.gf.showToastWarning('Thiết bị đang không kết nối mạng, vui lòng bật kết nối để tiếp tục thao tác!');
          return;
        }
        this.gf.hideStatusBar();
      }
    
      gotomenu(tabindex){
        if(this._mytripservice.rootPage == 'homeflight'){
          this.valueGlobal.backValue = "homeflight";
        }else if(this._mytripservice.rootPage == 'homehotel'){
          this.valueGlobal.backValue = "homehotel";
        }else if(this._mytripservice.rootPage == 'homefood'){
          this.valueGlobal.backValue = "homefood";
        }
        this._mytripservice.backfrompage = "order";
        $(".div-myorder").removeClass("cls-tab-visible").addClass("cls-tab-disabled");
            $(".div-notify").removeClass("cls-tab-visible").addClass("cls-tab-disabled");
            $(".div-account").removeClass("cls-tab-visible").addClass("cls-tab-disabled");
            $(".homefoodheader").removeClass("cls-tab-disabled").addClass("cls-tab-visible");
            $(".div-wraper-slide").removeClass("cls-disabled").addClass("cls-visible");
            $(".div-home").removeClass("cls-tab-disabled").addClass("cls-tab-visible");
            //khác tab food thì set chuyển về tab homefood
            if(this._mytripservice.rootPage != "homefood"){
              this.navCtrl.navigateForward('/homefood');
            }
            this._mytripservice.rootPage = "homefood";
        }
    
        getHoteldeal() {
          var se = this;
          let headers =
              {
                apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
                apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
              }
          let strUrl =  C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/TopDeals?pageIndex=1&pageSize=200' + (se.memberid ? '&memberid=' + se.memberid : '');
          se.gf.RequestApi('GET', strUrl, headers, {}, 'booking', 'loadReviewMember').then((data) => {
            se.storage.set('listtopdealdefault', data);
            se.loaddatatopdeal(data);
          })
        }
    
        showFoodReview(detail, order){
          //Review tuần
          
        }

        showBlog(menu){
            var se = this;
            if(menu.linkBlog){
              se.gf.showLoading();
              se.mapBlogId(menu.linkBlog).then((id)=>{
                se.gf.hideLoading();
                if(id){
                  se.valueGlobal.backValue = "fooddinner";
                  se.navCtrl.navigateForward("/blog/"+id);
                }else{
                  se.gf.showToastWarning("Không tìm thấy bài viết. Xin vui lòng quay lại sau!");
                }
              })
            }
          }
        
          mapBlogId(item): Promise<any>{
            var se = this;
            return new Promise((resolve, reject) => {
            let strUrl =  'https://svc3.ivivu.com/GetBlogByUrl?url='+item;
            se.gf.RequestApi('GET', strUrl, {}, {}, 'booking', 'loadReviewMember').then((data) => {
                se.zone.run(()=>{
                  resolve(data.post.ID);
                })
              })
              
            })
          }

          doInfinite(infiniteScroll){
              this.zone.run(() => {
                if(this.listMyTrips.length < this.totalTrip){
                  this.pageIndex = this.pageIndex + 1;
                  this.getdata(null, false);
                  setTimeout(() => {
                  this.getdata(null, true);
                  },300)
                  this._infiniteScroll = infiniteScroll;
                }
              })
          }
          nextSupport(trip){
            // this.activityService.objPaymentMytrip = { trip: trip };
            // if (!trip.isRequestTrip && trip.isFlyBooking) {
            //   this.navCtrl.navigateForward('/ordersupport/1');
            // } else {
            //   this.navCtrl.navigateForward('/ordersupport/0');
            // }
            this.activityService.objPaymentMytrip = { trip: trip };
            if (!trip.isRequestTrip && trip.isFlyBooking) {
              this.navCtrl.navigateForward('/orderrequestsupport');
            } else {
              this.navCtrl.navigateForward('/ordersupport/0');
            }
          }

          getCathayClaimInfo(bkgid): Promise<any>{
            return new Promise((resole, reject) => {
                let url = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetCathayByKey?key='+bkgid;
                let header = {
                  apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
                  apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
                }
                this.gf.RequestApi('GET', url, header, null, 'MytripDetail', "getCathayClaimInfo").then((data)=>{
                  if(data){
                    resole(data);
                  }else{
                    resole(false);
                  }
                })
            })
          }
          requestCathay(name, trip, gender) {
            if (gender.indexOf('Bé') == 0) {
              this.getCathay(name, trip);
              return;
            }
            this.activityService.objCathayMytrip = { name: name, trip: trip };
            this.valueGlobal.backpageCathay='order';
            this.navCtrl.navigateForward('/mytripcathay/' + trip.booking_id);
          }
          getCathay(cusname, trip) {
            var co = 0;
            this.presentLoadingData();
            this.gf.getCathayByKey(trip.booking_id).then((data) => {
              this.myloader.dismiss();
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
                        if (element.claiming_flights && element.customer_name.toLowerCase().trim() == cusname.toLowerCase().trim()) {
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

    async openPickupCalendar(openDefault: boolean) {
            // if(!this.allowclickcalendar){
            //   return;
            // }
            // this.allowclickcalendar = false;
            // //this.navCtrl.navigateForward('/pickup-calendar/true');
            // let fromdate = new Date(this.bizTravelService.checkInDate ? this.bizTravelService.checkInDate : this.cin);
            // let todate = new Date(this.bizTravelService.checkOutDate ? this.bizTravelService.checkOutDate : this.cout);
            // let _daysConfig: DayConfig[] = [];
            // for (let j = 0; j < this.valueGlobal.listlunar.length; j++) {
            //   _daysConfig.push({
            //     date: this.valueGlobal.listlunar[j].date,
            //     subTitle: this.valueGlobal.listlunar[j].name,
            //     cssClass: 'lunarcalendar'
            //   })
            // }
            // const options: CalendarModalOptions = {
            //   pickMode: "range",
            //   title: "Chọn ngày",
            //   monthFormat: "MM / YYYY",
            //   weekdays: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
            //   weekStart: 1,
            //   closeLabel: "Thoát",
            //   doneLabel: "",
            //   step: 0,
            //   defaultScrollTo: fromdate,
            //   defaultDateRange: { from: fromdate, to: todate },
            //   daysConfig: _daysConfig
            // };
        
            // this.myCalendar = await this.modalCtrl.create({
            //   component: CalendarModal,
            //   animated: true,
            //   componentProps: { options }
            // });
        
            // this.myCalendar.present().then(() => {
            //   se.allowclickcalendar = true;
            //   $(".days-btn").click(e => this.clickedElement(e, openDefault));
            // });
            // var se = this;
            // const event: any = await this.myCalendar.onDidDismiss();
            // if(event){
            //   se.allowclickcalendar = true;
            // }
            // const date = event.data;
            // if (event.data) {
            //   const from: CalendarResult = date.from;
            //   const to: CalendarResult = date.to;
            //   se.cin = moment(from.dateObj).format("YYYY-MM-DD");
            //   se.cout = moment(to.dateObj).format("YYYY-MM-DD");
            //   se.zone.run(() => {
            //     se.bizTravelService.checkInDate = se.cin;
            //     se.bizTravelService.checkOutDate = se.cout;
            //     se.datecin = new Date(se.cin);
            //     se.datecout = new Date(se.cout);
            //     se.cindisplay = moment(se.datecin).format("DD-MM-YYYY");
            //     se.coutdisplay = moment(se.datecout).format("DD-MM-YYYY");
            //     se.searchhotel.cindisplay = moment(se.datecin).format("DD-MM-YYYY");
            //     se.searchhotel.coutdisplay = moment(se.datecout).format("DD-MM-YYYY");
            //   });
            // }
        
          }

          /**
   * Hàm bắt sự kiện click chọn ngày trên lịch bằng jquery
   * @param e biến event
   */
  async clickedElement(e: any, openDefault: boolean) {
    var obj: any = e.currentTarget;
    if (
      $(obj.parentNode).hasClass("endSelection") ||
      $(obj.parentNode).hasClass("startSelection")
    ) {
      if (this.modalCtrl) {
        let fday: any;
        let tday: any;
        var monthenddate: any;
        var yearenddate: any;
        var monthstartdate: any;
        var yearstartdate: any;
        var objTextMonthEndDate: any;
        var objTextMonthStartDate: any;

        if ($(obj.parentNode).hasClass('endSelection')) {
          if ( $('.days-btn.lunarcalendar.on-selected > p')[0]) {
            fday= $('.days-btn.lunarcalendar.on-selected > p')[0].innerText;
          } else {
            fday = $('.on-selected')[0].textContent;
          }
          if ($('.days.endSelection .days-btn.lunarcalendar > p')[0]) {
            tday = $('.days.endSelection .days-btn.lunarcalendar > p')[0].innerText;
          } else {
            tday = $(obj)[0].textContent;
          }
          objTextMonthStartDate = $('.on-selected').closest('.month-box').children()[0].textContent;
          objTextMonthEndDate = $(obj).closest('.month-box').children()[0].textContent;
        } else {
          if ($('.days-btn.lunarcalendar.on-selected > p')[0]) {
            fday =$('.days-btn.lunarcalendar.on-selected > p')[0].innerText
          }
          else{
            fday = $(obj)[0].textContent;
          }
          if ($('.days.endSelection .days-btn.lunarcalendar > p')[0]) {
            tday = $('.days.endSelection .days-btn.lunarcalendar > p')[0].innerText;
          }
          else{
            tday = $('.endSelection').children('.days-btn')[0].textContent;
          }
          objTextMonthStartDate = $(obj).closest('.month-box').children()[0].textContent;
          objTextMonthEndDate = $('.endSelection').closest('.month-box').children()[0].textContent;
        }

        if (
          objTextMonthEndDate &&
          objTextMonthEndDate.length > 0 &&
          objTextMonthStartDate &&
          objTextMonthStartDate.length > 0
        ) {
          monthstartdate = objTextMonthStartDate.split("/")[0];
          yearstartdate = objTextMonthStartDate.split("/")[1];
          monthenddate = objTextMonthEndDate.split("/")[0];
          yearenddate = objTextMonthEndDate.split("/")[1];
          var fromdate = new Date(yearstartdate, monthstartdate - 1, fday);
          var todate = new Date(yearenddate, monthenddate - 1, tday);
          if (fromdate && todate && moment(todate).diff(fromdate, "days") > 0) {
            var se = this;
            setTimeout(() => {
              se.modalCtrl.dismiss();
            }, 300);

          
            se.zone.run(() => {
              se.cin = moment(fromdate).format("YYYY-MM-DD");
              se.cout = moment(todate).format("YYYY-MM-DD");
              se.bizTravelService.checkInDate = moment(fromdate).format("YYYY-MM-DD");
              se.bizTravelService.checkOutDate = moment(todate).format("YYYY-MM-DD");
              se.bizTravelService.checkInDateDisplay = moment(se.bizTravelService.checkInDate).format("DD/MM/YYYY");
              se.bizTravelService.checkOutDateDisplay = moment(se.bizTravelService.checkOutDate).format("DD/MM/YYYY");
            });
          }
        }
      }
    }
  }

  exportExcel(){
      let se = this;
      let url = C.urls.baseUrl.urlMobile + '/api/Dashboard/OnPostExportBizExcel';
      let body = se.listMyTrips;
      se.gf.showLoading();
      se.gf.RequestApi('POST', url, {}, body, 'booking', 'exportExcel').then((data) => {
         var time = new Date().toTimeString();
         var fileName = 'bookings.xls';//if you have the fileName header available
         var blob = se.b64toBlob(data, 'application/vnd.ms-excel');
          let blobUrl = URL.createObjectURL(blob);
          var a:any =$('.exportdiv')[0];
          a.href = blobUrl;
          a.download = fileName;
         setTimeout(()=> {
          a.click();
          se.gf.hideLoading();
         },500)
         
          //let urldata =  'data:application/octet-stream;base64,' +data;
          //var blob = new Blob([urldata], {type:"application/vnd.openxmlformats-officewindow.document.spreadsheetml.sheet"});
          //var url:any = URL.createObjectURL(urldata);
         // window.open(urldata, "_blank");

        //  this.fileOpener.open(blobUrl, 'application/vnd.ms-excel').then(() => console.log('File is opened'))
        //  .catch(e => console.log('Error opening file', e));
        //saveAs(blob, fileName);
        //this.file.checkDir(this.file.dataDirectory, 'mydir').then((check)=> {
          //if(check){
            // this.file.writeFile(this.file.dataDirectory, fileName, blob).then((value)=>{
            //   setTimeout(()=> {
            //     window.open(value, "_blank");
            //   },500)
            // });
            
          //}
        //})
        //se.previewAnyFile.previewBase64(data,{mimeType:'application/vnd.ms-excel'});
        // const fileTransfer: FileTransferObject = this.transfer.create();
        
        // fileTransfer.download(blobUrl, this.file.dataDirectory + '/'+fileName).then((entry) => {
        //     console.log('download complete: ' + entry.toURL());
        //   }
        // );
        

          // if (se.platform.is('desktop') || se.platform.is('mobileweb')) {
          //     const url = window.URL.createObjectURL(blob);
          //     const link = window.window.document.createElement("a");
          //     link.href = url;
          //     link.setAttribute("download", fileName);
          //     window.window.document.body.appendChild(link);
          //     link.click();
          //     link.remove();
          //   } else {
          //     return se.file.writeFile(
          //       se.file.documentsDirectory + "/Download",
          //       fileName,blob).then(()=>{
          //         se.fileOpener.open(
          //           se.file.documentsDirectory +  "/Download/" + fileName,
          //         "application/vnd.ms-excel"
          //       );
          //       })
          //   }
          // })
          // .then(() => {
          //   var time = new Date().toTimeString();
          //   var fileName = 'bookings.xls';
          //     return se.fileOpener.open(
          //       se.file.documentsDirectory +  "/Download/" + fileName,
          //     "application/vnd.ms-excel"
          //   );
          // })
          // .catch((error) => {
          //   console.log(error);
          // });
         
         


       })
  }

  b64toBlob (b64Data, contentType='', sliceSize=512){
    const byteCharacters = atob(b64Data);
    const byteArrays:any = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
  

  }
