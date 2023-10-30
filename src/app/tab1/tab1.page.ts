
import { AuthService } from './../providers/auth-service';
import { SearchHotel, ValueGlobal } from './../providers/book-service';
import { Component, NgZone, ViewChild, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { NavController, ModalController, IonContent, Platform, IonRouterOutlet, LoadingController, ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import * as moment from 'moment';
import { InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { C } from './../providers/constants';

import { GlobalFunction, ActivityService } from './../providers/globalfunction';

import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

import { Network } from '@awesome-cordova-plugins/network/ngx';
import { NetworkProvider } from './../network-provider.service';
import * as $ from 'jquery';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import {FCM} from '@capacitor-community/fcm';
import { tourService } from '../providers/tourService';
import { flightService } from '../providers/flightService';
import { AppRoutingPreloaderService } from '../providers/AppRoutingPreloaderService';
import { SelectDateRangePage } from '../selectdaterange/selectdaterange.page';
import 'litepicker/dist/plugins/mobilefriendly';
import { MytripService } from '../providers/mytrip-service.service';

import {SplashScreen} from '@capacitor/splash-screen';
//import { Plugins } from '@capacitor/core';
var document:any;
/**
 * 
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})

export class Tab1Page implements OnInit {
  private subscription: Subscription;
  @ViewChild('myHomeSlider') slider: ElementRef;
  @ViewChild(IonContent) content: IonContent;
  @ViewChildren(IonRouterOutlet) routerOutlets: IonRouterOutlet;
  slideOpts = {
    loop: false,
    //initialSlide: 1,
    slidesPerView: 1,
    centeredSlides: false,
    spaceBetween: 10,
  };
  pet: string = "khachsan";
  tabhome = "hotel";
  slideData1:any = [];
  slideMood;
  slideData:any = [];
  slideData2:any = [];
  sl; slregion; slmood;
  regions:any = [];
  regionshtml:any = [];
  regionscheck:any = [];
  regionsend:any = [];
  recom:any = [];
  arrregion;
  arrtemp;
  recoms:any = [];
  arrtempdeal:any = [];
  email; jti; ischeck = false; ischeckks = true; ischeckvmb;
  public showCalCin = false;
  public showCalCout = false;
  public datecin: Date;
  public datecout: Date;
  public cindisplay; coutdisplay;
  public cin; gbitem;
  public cout; ischecklist = false; isenabled = true; co; gbmsg; json; index; ischeckclose = false;
  cinthu; coutthu; blog:any = []; items; adult = 2; child = 0; roomnumber = 1; chuoi; ischecksearch = false; recent; input; ischeckdelete;
  tabBarElement: any;
  page = 1;
  pagesize = 5;
  totalItem = 200;
  _infiniteScroll: any;
  showloadmore = true;
  showloadmoreblog = true;
  public isConnected: boolean;
  public myCalendar: any;
  pageBlog = 1;
  pageSizeBlog = 5;
  totalItemBlog = 200;
  blogDisplay:any = [];
  intervalID;
  myloader;
  regionsinter:any = [];
  regionintersend:any = [];
  canLoadBlog: boolean = true; blogtrips:any = [];
  memberid; versionNumber; username; arrbloglike: any; listBlogtemp; listBlog:any = [];
  regionnamesuggest = "";
  canLoadBlogTrip: boolean = true;
  pageBlogTrip: number = 1;
  showloadmoreblogtrip: boolean = true;
  intervalTrip;
  deviceToken: any;
  eventRefresh: any;
  appversion: string; listlunar:any = [];
  cofdate = 0;
  cotdate = 0;
  _daysConfig: any[] = [];
  isrefresh = "false";
  activeTab = 0;
  countcart: any;
  arrDistrict:any = [];
  arrCity:any = [];
  ischeckcalendar = true;
  picker: any;
  isNotice = false;
  allowclickcalendar: boolean = true;
  arrHistory:any = [];
  topsale: any=0;
  summerDateEnd = '2023-09-01';
  isShowSummerMood: boolean;
  constructor(private iab: InAppBrowser, public navCtrl: NavController, public authService: AuthService, public modalCtrl: ModalController, public zone: NgZone,
    public platform: Platform, public searchhotel: SearchHotel, public valueGlobal: ValueGlobal, public gf: GlobalFunction,
    public activeRoute: ActivatedRoute, public router: Router, public loadCtrl: LoadingController, public loadingCtrl: LoadingController,
    private socialSharing: SocialSharing, public network: Network, public toastCtrl: ToastController, private alertCtrl: AlertController, private storage: Storage,
    public networkProvider: NetworkProvider,
    private actionSheetCtrl: ActionSheetController,
    public activityService: ActivityService,
    public tourService: tourService,
    public flightService: flightService,
    public routingService: AppRoutingPreloaderService,
    public _mytripservice: MytripService
  ) {
    this.platform.ready().then(() => {
      setTimeout(()=>{
        SplashScreen.hide();
      },3000)
    })
    this.isShowSummerMood = moment(this.summerDateEnd).diff(moment(moment(new Date()).format('YYYY-MM-DD'))) >= 0;
    //this.platform.resume.subscribe(async () => {
      this.networkProvider.setNetworkStatus(true);
      this.network.onConnect().subscribe(() => {
        this.isConnected = true;
        // We just got a connection but we need to wait briefly
        // before we determine the connection type. Might need to wait.
        // prior to doing any api requests as well.
        this.zone.run(() => {
          this.loaddata();

        })

        setTimeout(() => {
          if (this.network.type !== 'none') {
            if (this.slideData1.length == 0) {
              this.loadInfo();
            }
          }
          if (this.myloader) {
            this.myloader.dismiss();
          }
        }, 3000);
      });

      this.network.onDisconnect().subscribe(() => {
        this.isConnected = false;
        this.gf.setReLoadValue(true);
        this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      });

      this.valueGlobal.notRefreshDetail = false;
      this.gettopSale();
  
      var se = this;
      //setTimeout(()=>{
        se.platform.resume.subscribe(async()=>{
          se.networkProvider.getNetworkStatus().subscribe((connected: boolean) => {
            se.isConnected = connected;
            if (se.isConnected) {
              se.networkProvider.setNetworkStatus(true);
              se.zone.run(()=>{
                se.loaddata();
              })
              
              se.getNewsBlog(0);
              se.storage.get("listtopdealdefault").then((data: any) => {
                if (data && data.length > 0) {
                  
                  //se.slideData = data;
                  se.loadTopDeal(data);
                  se.getHotelDealPaging();
                  se.getRegions();
                  se.getRegionsInternational();
                } else {
                  //se.presentLoadingData();
                  se.getHoteldeal();
      
                  setTimeout(() => {
                    if (se.myloader) {
                      se.myloader.dismiss();
                    }
                  }, 2000);
                }
              });
              //se.getHoteldeal();
            } else {
              setTimeout(() => {
                se.isConnected = false;
                se.ischeck = false;
                se.slideData1 = [];
              }, 100);
              se.gf.showWarning(
                "Không có kết nối mạng",
                "Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng",
                "Đóng"
              );
            }
          });
        })
    //})

    
  }

  async ionViewDidEnter() {
    
    this.ischeck = true;

      setTimeout(()=>{
        SplashScreen.hide();
      },100)
      
   
    
    this.getCalendarholidays();
    var se = this;
    se.storage.get('jti').then((uid: any) => {
      se.memberid = uid;
    })
    se.storage.get('username').then(username => {
      this.username = username;
    });
    //Lấy app version
    this.appversion= await this.gf.getAppVersion();
    this.storage.get('arrHistory').then((data: any) => {
      if (data) {
        this.arrHistory = data;
        if(this.arrHistory.length>1){
          let elements = window.document.querySelectorAll(".d-flex-recent");
          if (elements.length>0) {
            Object.keys(elements).map((key) => {
              let itemstyle=(320*this.arrHistory.length) + 20 +'px';
              elements[key].style.width = itemstyle;
            });
          }else{
            let elements = window.document.querySelectorAll(".d-flex-only");
            Object.keys(elements).map((key) => {
              let itemstyle=(320*this.arrHistory.length) + 20 +'px';
              elements[key].style.width = itemstyle;
            });
          }
        }
        
      }
    })
    // //Xóa cache blogtrip
    // se.intervalTrip = setInterval(() => {
    //   se.storage.remove('blogtripdefault');
    //   se.storage.remove('listtopdealdefault');
    //   se.storage.remove('regionnamesuggest');
    // }, 24 * 60 * 60 * 1000);

    //Gọi lại userinfo
    se.loadUserInfo();
  }
  loadUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        let headers = {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo';
        se.gf.RequestApi('GET', strUrl, headers, {}, 'Tab1', 'loadUserInfo').then((data) => {
          se.zone.run(() => {
              se.storage.set('point', data.point);
            })
        })
      }
    })
  }
  loadInfo() {
    var se = this;
    //console.log('already load tab1');
    se.zone.run(() => {
      se.isConnected = true;
      se.networkProvider.setNetworkStatus(true);
      se.gf.setNetworkStatus(true);
      se.gf.setReLoadValue(false);
      se.page = 1;
      se.pageBlog = 1;
      se.pageBlogTrip = 1;
      se.loaddata();
      //Lấy từ service trước
      if(!se.slideData || se.slideData.length == 0 ){
        se.storage.get("listtopdealdefault").then((data: any) => {
          if (data && data.length > 0) {
            se.slideData = data;
          }else{
            se.getHoteldeal();
          }
        })
      }
      if(!se.slideData1 || se.slideData1.length == 0 ){
        se.slideData1 = se.activityService.listTopDeal;
        se.getHotelDealPaging();
            se.storage.get('listtopregions').then(dataregion => {
              if(dataregion){
                se.loadCacheRegion();
              }else{
                se.getRegions();
              }
            })
            se.storage.get('listtopregioninternational').then(dataregionnation => {
              if(dataregionnation){
                se.loadRegionsInternational(dataregionnation);
              }else{
                se.getRegionsInternational();
              }
            })
      }
      // se.storage.get('listtopdealdefault').then(data => {
      //   if (data && data.length >0) {
      //     se.loadTopDeal(data);
      //     se.getHotelDealPaging();
      //     se.loadCacheRegion();
      //     //se.getbloglike(1);
      //     if (se.blog.length == 0) {
      //       se.getNewsBlog(0);
      //     }
      //     // setTimeout(() => {
      //     //   this.zone.run(() => {
      //     //     se.getHoteldeal()
      //     //   })
      //     // }, 30000);
      //   } else {
      //     se.slideData1 = [];
      //     se.blog = [];
      //     setTimeout(() => {
      //       se.getHoteldeal();
      //       se.getNewsBlog(0);
      //       //se.getbloglike(0);
      //     }, 50)
      //   }
      // })
      //Nếu vẫn không có data thì lấy từ cache
      if (se.slideData1.length == 0) {
        se.loaddata();
        se.storage.get("listtopdealdefault").then((data: any) => {
          if (data && data.length > 0) {
            se.loadTopDeal(data)
            se.getHotelDealPaging();
            se.storage.get('listtopregions').then(dataregion => {
              if(dataregion){
                se.loadCacheRegion();
              }else{
                se.getRegions();
              }
            })
            se.storage.get('listtopregioninternational').then(dataregionnation => {
              if(dataregionnation){
                se.loadRegionsInternational(dataregionnation);
              }else{
                se.getRegionsInternational();
              }
            })
          } else {
            setTimeout(() => {
              se.getHoteldeal();
            }, 100);
          }
        });
      } else {
        se.loaddata();
      }
    })

  }
  ionViewWillLeave() {
    // this.zone.run(() => {
    //   clearInterval(this.intervalID);
    // })
  }
  /**
   * Hàm show cảnh báo
   */
  async presentToastWarning(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }

  public async ngOnInit(): Promise<void> {
    await this.onEnter();
    this.ischeck = true;
    this.gbmsg = this.searchhotel.gbmsg;
    this.gbitem = this.searchhotel.gbitem;
    this.co = this.searchhotel.flag;
    this.input = this.searchhotel.input;
    this.chuoi = this.searchhotel.chuoi;
    this.recent = this.searchhotel.recent;
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && (event.url === '/' || event.url === '/app/tabs/tab1' || event.url === '/tabs/tab1')) {
        //this.blogtrips=[];
        this.isrefresh = "false";
        this.onEnter();
        //this.getbloglike(1);
        //this.getNewsBlog(0);
        if (this.gf.getParams('resetBlogTrips')) {
          this.regionnamesuggest = '';
          this.blogtrips = [];
          this.pageBlogTrip = 1;
          //this.getbloglike(0);
          //this.getNewsBlog(0);
          this.gf.setParams(false, 'resetBlogTrips');
        } else {
          //this.getbloglike(1);
        }

      }
    });
  }

  selectedDate(fromdate, todate) {
    var se = this;
    se.cin = moment(fromdate).format('YYYY-MM-DD');
    se.cout = moment(todate).format('YYYY-MM-DD');
    se.zone.run(() => {
      se.searchhotel.CheckInDate = se.cin;
      se.searchhotel.CheckOutDate = se.cout;
      se.datecin = new Date(se.cin);
      se.datecout = new Date(se.cout);
      se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
      se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');
      se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
      se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');
      se.coutthu = moment(se.datecout).format('dddd');
      switch (se.coutthu) {
        case "Monday":
          se.coutthu = "Thứ 2"
          break;
        case "Tuesday":
          se.coutthu = "Thứ 3"
          break;
        case "Wednesday":
          se.coutthu = "Thứ 4"
          break;
        case "Thursday":
          se.coutthu = "Thứ 5"
          break;
        case "Friday":
          se.coutthu = "Thứ 6"
          break;
        case "Saturday":
          se.coutthu = "Thứ 7"
          break;
        default:
          se.coutthu = "Chủ nhật"
          break;
      }

      //Set thứ theo ngày checkin được select
      se.cinthu = moment(se.datecin).format('dddd');
      switch (se.cinthu) {
        case "Monday":
          se.cinthu = "Thứ 2"
          break;
        case "Tuesday":
          se.cinthu = "Thứ 3"
          break;
        case "Wednesday":
          se.cinthu = "Thứ 4"
          break;
        case "Thursday":
          se.cinthu = "Thứ 5"
          break;
        case "Friday":
          se.cinthu = "Thứ 6"
          break;
        case "Saturday":
          se.cinthu = "Thứ 7"
          break;
        default:
          se.cinthu = "Chủ nhật"
          break;
      }
    })
  }

  public async onEnter(): Promise<void> {
    if (this.activeTab == 0) {
      this._mytripservice.rootPage = "homehotel";
    }
    if (this.activeTab == 1) {
      return;
    }
    this.storage.get('arrHistory').then((data: any) => {
      if (data) {
        this.arrHistory = data;
        if( this.arrHistory.length>1){
          let elements = window.document.querySelectorAll(".d-flex-recent");
          if (elements.length>0) {
            Object.keys(elements).map((key) => {
              let itemstyle=(320*this.arrHistory.length) + 20 +'px';
              elements[key].style.width = itemstyle;
            });
          }else{
            let elements = window.document.querySelectorAll(".d-flex-only");
            Object.keys(elements).map((key) => {
              let itemstyle=(320*this.arrHistory.length) + 20 +'px';
              elements[key].style.width = itemstyle;
            });
          }
        }
       
        // let itemstyle = 320 * this.arrHistory.length + 'px';
        // var style = window.document.createElement('style');
        // style.type = 'text/css';
        // style.innerHTML = '.cssClass { width: ' + itemstyle + ' }';
        // window.document.getElementsByTagName('head')[0].appendChild(style);
        // window.document.getElementById('div-recent').className = 'd-flex-recent cssClass';
        // console.log(this.arrHistory);
      }
    })
    this.flightService.itemTabFlightActive.subscribe((data) => {
      if (data) {
        this.setActiveTab(1);
      }
    })


    this.flightService.itemUseFulClick.subscribe((data: any) => {
      if (data) {
        this.content.scrollToPoint(0, data, 200);
      }
    })

    this.searchhotel.itemChangeDate.subscribe((data) => {
      if (data) {
        this.selectedDate(this.searchhotel.CheckInDate, this.searchhotel.CheckOutDate);
      }
    })


    this.flightService.itemHomeFlightScrollTop.subscribe((data) => {
      if (data) {
        setTimeout(() => {
          this.content.scrollToTop(200);
        }, 300)

      }
    })
    this.storage.get('auth_token').then((data) => {
      if (!data) {
        this.blogtrips = [];
        this.valueGlobal.countNotifi = 0;
      }
    })
    this.storage.get('jti').then((uid: any) => {
      this.memberid = uid;
    });
    //Load list default nếu list bị reset
    if (this.blogtrips.length == 0) {
      this.storage.get('blogtripdefault').then(data => {
        if (data && data.length > 0) {
          this.blogtrips = data;
        } else {
          this.getblogtrips();
        }
      })

      this.storage.get('regionnamesuggest').then((regionname: any) => {
        this.regionnamesuggest = regionname;
      })
    }

    if (this.slideData1.length == 0) {
      this.loadInfo();
    } else {
      this.loaddata();
    }
    setTimeout(() => {
      if (this.valueGlobal.backValue != 'blog' && this.valueGlobal.backValue != 'experience') {
        this.content.scrollToTop(50);
      }
    }, 10);

    this.searchhotel.itemSearchHotelHome.pipe().subscribe((data) => {
      if (data) {
        if (data && !this.searchhotel.hasShowCalendarFirstTime) {
          this.searchhotel.hasShowCalendarFirstTime = true;
          //this.checkDefaultDateFocus();
        }
      }
    })
    this.searchhotel.itemChangePax.pipe().subscribe((data)=> {
      if (this.searchhotel.adult) {
        this.adult = this.searchhotel.adult;
      }
      if (this.searchhotel.child != null) {
        this.child = this.searchhotel.child;
      }
      if (this.searchhotel.child == 0) {
        this.child = this.searchhotel.child;
      }
      if (this.searchhotel.roomnumber) {
        this.roomnumber = this.searchhotel.roomnumber;
      }
    })

    this.flightService.getItemShowMoreFlightTopDeal().subscribe((data)=>{
      if(data){
        this.scrollToDivShowMore(data);
      }
    })

    if (this.blog.length == 0) {
      this.storage.get("listblogdefault").then((data: any) => {
        if (data && data.length > 0) {
          this.blog = data;
        }else{
          this.getNewsBlog(0);
        }
      });
      this.getNewsBlog(1);
    }
  }

  showNotification(data) {
    //chuyển qua tab mytrip
    if (data && data.BookingCode && data.notifyAction != "cancel") {
      if (data.notifyAction == "sharereviewofhotel") {
        this.navCtrl.navigateForward(['/app/tabs/tab3']);
        this.gf.setParams(data.BookingCode, 'notifiBookingCode');
        this.gf.setParams(2, 'selectedTab3');
      }
      else if (data.NotifyType == "blog" && data.notifyAction == "blogofmytrip") {
        this.valueGlobal.backValue = "tab4";
        this.navCtrl.navigateForward("/blog/" + data.BookingCode);
      }
      else if (data.NotifyType == "fly" && data.notifyAction == "flychangeinfo") {
        this.navCtrl.navigateForward(['/app/tabs/tab3']);
        this.gf.setParams(data.BookingCode, 'notifiBookingCode');
        this.gf.setParams(data.switchObj, 'notifiSwitchObj');
      }
      else {
        this.gf.setParams(data.BookingCode, 'notifiBookingCode');
        this.navCtrl.navigateForward(['/app/tabs/tab3']);
      }
    } else {
      //show notifi
      this.showToast(data.message);
    }
  }

  async showToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 5000
    })

    toast.present();
  }


  async showActionSheetNoti(data) {
    var se = this;
    var iconStr = 'ic_home';
    var subclass = '';
    if (data.NotifyType == 'bookingbegoingcombotransfer') {
      iconStr = 'ic_bus2';
    } else if (data.NotifyType == 'blog') {
      iconStr = 'ic_message';
    }
    else if (data.notifyAction == 'bookingbegoingcombofly' || data.notifyAction == 'flychangeinfo') {
      iconStr = 'ic_paper';
    }

    if (data.notifyAction == 'waitingconfirmtopayment') {
      subclass = 'fixheight-60';
    }
    if (data.notifyAction == 'cancel') {
      subclass = 'fixheight-76';
    }
    if (data.notifyAction == 'blogofmytrip') {
      subclass = 'fixheight-36';
    }

    if(data.notifyType == "alert"){
      se.presentToastNotifi(data.message);
    }else{
      let actionSheet = await se.actionSheetCtrl.create({
        cssClass: 'action-sheets-notification ' + iconStr + ' ' + subclass,
        mode: 'ios',
        header: data.title,
        animated: true,
        backdropDismiss: true,
        buttons: [
          {
            text: data.message,
            handler: () => {
              se.showNotification(data);
            }
          }
        ]
      });
      actionSheet.present();
    }
  }

  /**
   * Hàm show cảnh báo
   */
   async presentToastNotifi(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  getblogtrips() {
    var se = this;
    se.canLoadBlogTrip = false;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GeBlogByTripLatestOfUser' + '?pageIndex=' + se.pageBlogTrip + '&pageSize=10';
        let headers = {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
        };
        se.gf.RequestApi('GET', strUrl, headers, {}, 'Tab1', 'getHoteldeal').then((data)=> {
          se.zone.run(() => {
            var listBlogtemp = data.items;
            if (listBlogtemp && listBlogtemp.length > 0) {

              se.regionnamesuggest = data.regionName;
              if (se.arrbloglike && se.arrbloglike.length > 0) {
                var itemblog;
                for (let i = 0; i < listBlogtemp.length; i++) {
                  itemblog = { avatar: listBlogtemp[i].avatar, date: listBlogtemp[i].Date, id: listBlogtemp[i].id, title: listBlogtemp[i].title, url: listBlogtemp[i].url, Like: false }
                  for (let j = 0; j < se.arrbloglike.length; j++) {
                    if (se.arrbloglike[j].id == listBlogtemp[i].id) {
                      itemblog = { avatar: listBlogtemp[i].avatar, date: listBlogtemp[i].date, id: listBlogtemp[i].id, title: listBlogtemp[i].title, url: listBlogtemp[i].url, Like: true };
                      break;
                    }
                  }
                  if (!se.checkExistsItemInArray(se.blogtrips, itemblog, 1)) {
                    se.blogtrips.push(itemblog);
                  }
                }
              }
              else {
                for (let i = 0; i < listBlogtemp.length; i++) {
                  itemblog = { avatar: listBlogtemp[i].avatar, date: listBlogtemp[i].date, id: listBlogtemp[i].id, title: listBlogtemp[i].title, url: listBlogtemp[i].url, Like: false }
                  if (!se.checkExistsItemInArray(se.blogtrips, itemblog, 1)) {
                    se.blogtrips.push(itemblog);
                  }
                }
              }
              //Gán cache để không bị load lại
              if (se.page == 1 && se.blogtrips.length > 0) {
                se.storage.get('blogtripdefault').then((data) => {
                  if (data) {
                    se.storage.remove('blogtripdefault').then(() => {
                      se.storage.set('blogtripdefault', se.blogtrips);
                    })
                  } else {
                    se.storage.set('blogtripdefault', se.blogtrips);
                  }
                })

                se.storage.get('regionnamesuggest').then((data) => {
                  if (data) {
                    se.storage.remove('regionnamesuggest').then(() => {
                      se.storage.set('regionnamesuggest', se.regionnamesuggest);
                    })
                  } else {
                    se.storage.set('regionnamesuggest', se.regionnamesuggest);
                  }
                })

              }
            } else {
              se.showloadmoreblogtrip = false;
            }
            se.canLoadBlogTrip = true;
            if (se.arrbloglike && se.arrbloglike.length > 0) {
              se.bindItemLiketrips(se.arrbloglike);
            }


          });
        })
       
      }
      else {
        //se.blogtrips=[];
        se.regionnamesuggest = "";
      }
    });
  }
  loaddata() {
    this.page = 1;
    this.pagesize = 5;
    this.totalItem = 200;
    this.pageBlog = 1;
    this.pageSizeBlog = 5;
    this.ischeck = true;
    this.ischeckks = true
    this.isConnected = true;
    this.gbmsg = this.searchhotel.gbmsg;
    this.gbitem = this.searchhotel.gbitem;
    this.co = this.searchhotel.flag;
    this.input = this.searchhotel.input;
    this.chuoi = this.searchhotel.chuoi;
    this.recent = this.searchhotel.recent;
    if (this.searchhotel.adult) {
      this.adult = this.searchhotel.adult;
    }
    if (this.searchhotel.child != null) {
      this.child = this.searchhotel.child;
    }
    if (this.searchhotel.child == 0) {
      this.child = this.searchhotel.child;
    }
    if (this.searchhotel.roomnumber) {
      this.roomnumber = this.searchhotel.roomnumber;
    }
    if (!this.searchhotel.chuoi) {
      if (this.searchhotel.star) {
        for (let i = 0; i < this.searchhotel.star.length; i++) {
          if (i == 0) {
            if (i == this.searchhotel.star.length - 1) {
              this.chuoi = "* " + this.searchhotel.star[i];
            } else {
              this.chuoi = "* " + this.searchhotel.star[i] + ",";
            }

          }
          else if (i != 0) {
            if (i != this.searchhotel.star.length - 1) {
              this.chuoi = this.chuoi + this.searchhotel.star[i] + ",";
            } else {
              this.chuoi = this.chuoi + this.searchhotel.star[i];
            }
          }
        }
      }
      if (this.searchhotel.minprice) {
        if (this.chuoi) {
          this.chuoi = this.chuoi + " | " + "đ " + this.searchhotel.minprice.toLocaleString() + " -" + " " + this.searchhotel.maxprice.toLocaleString();
        } else {
          this.chuoi = "đ " + this.searchhotel.minprice.toLocaleString() + " -" + " " + this.searchhotel.maxprice.toLocaleString();
        }
      }
      if (this.searchhotel.review > 0) {
        if (this.chuoi) {
          this.chuoi = this.chuoi + " | " + "Nhận xét " + this.searchhotel.review + "+";
        } else {
          this.chuoi = "Nhận xét " + this.searchhotel.review + "+";
        }
      }
      else {
        this.chuoi = this.chuoi;
      }

    }
    else {
      this.chuoi = this.searchhotel.chuoi;
    }
    if (this.searchhotel.CheckInDate) {
      if (this.searchhotel.adult) {
        this.adult = this.searchhotel.adult;
      }
      if (this.searchhotel.child != null) {
        this.child = this.searchhotel.child;
      }
      if (this.searchhotel.child == 0) {
        this.child = this.searchhotel.child;
      }
      if (this.searchhotel.roomnumber) {
        this.roomnumber = this.searchhotel.roomnumber;
      }
      if (this.searchhotel.CheckInDate && moment(this.searchhotel.CheckInDate).diff(moment(moment(new Date()).format('YYYY-MM-DD')), 'days') >= 0) {
        let diffcincout = moment(this.searchhotel.CheckOutDate).diff(this.searchhotel.CheckInDate, 'days');
        if(diffcincout <=0){
          this.searchhotel.CheckOutDate = moment(this.searchhotel.CheckInDate).add(1, 'days').format('YYYY-MM-DD');
        }

        this.cin = this.gf.getCinIsoDate(this.searchhotel.CheckInDate);
        this.cout = this.gf.getCinIsoDate(this.searchhotel.CheckOutDate);
       
        this.datecin = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckInDate));
        this.datecout = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckOutDate));
        this.cindisplay = moment(this.gf.getCinIsoDate(this.datecin)).format("DD-MM-YYYY");
        this.coutdisplay = moment(this.gf.getCinIsoDate(this.datecout)).format("DD-MM-YYYY");

        this.searchhotel.datecin = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckInDate));
        this.searchhotel.datecout = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckOutDate));
        this.searchhotel.cindisplay = moment(this.gf.getCinIsoDate(this.searchhotel.datecin)).format("DD-MM-YYYY");
        this.searchhotel.coutdisplay = moment(this.gf.getCinIsoDate(this.searchhotel.datecout)).format("DD-MM-YYYY");
      } else {
        this.cin = new Date(this.gf.getCinIsoDate(new Date()));
        var rescin = this.cin.setTime(this.cin.getTime() + (1 * 24 * 60 * 60 * 1000));
        var datein = new Date(this.gf.getCinIsoDate(rescin));
        this.cin = moment(datein).format("YYYY-MM-DD");
        this.cindisplay = moment(datein).format("DD-MM-YYYY");
        this.datecin = new Date(this.gf.getCinIsoDate(rescin));

        this.cout = new Date(this.gf.getCinIsoDate(new Date()));
        var res = this.cout.setTime(
          this.cout.getTime() + (2 * 24 * 60 * 60 * 1000)
        );
        var date = new Date(this.gf.getCinIsoDate(res));
        this.cout = moment(date).format("YYYY-MM-DD");
        this.coutdisplay = moment(date).format("DD-MM-YYYY");
        this.datecout = new Date(this.gf.getCinIsoDate(res));

        this.searchhotel.datecin = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckInDate));
        this.searchhotel.datecout = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckOutDate));
        this.searchhotel.cindisplay = moment(this.gf.getCinIsoDate(this.searchhotel.datecin)).format("DD-MM-YYYY");
        this.searchhotel.coutdisplay = moment(this.gf.getCinIsoDate(this.searchhotel.datecout)).format("DD-MM-YYYY");
      }

      this.getCinCoutDayName();
    }
    else {
      this.storage.get('cacheSearchHotelInfo').then((data) => {
        if (data && data.checkInDate) {
          if (data.adult) {
            this.adult = data.adult;
            this.searchhotel.adult = data.adult;
          }
          if (data.child != null) {
            this.child = data.child;
            this.searchhotel.child = data.child;
          }
          if (data.child == 0) {
            this.child = data.child;
            this.searchhotel.child = data.child;
          }
          if (data.childAge) {
            this.searchhotel.arrchild = data.childAge;
          }
          if (data.roomNumber) {
            this.roomnumber = data.roomNumber;
            this.searchhotel.roomnumber = data.roomNumber;
          }
          let diffdate = moment(data.checkInDate).diff(moment(moment(new Date()).format('YYYY-MM-DD')), 'days');
          if (data.checkInDate && diffdate >= 0) {
            this.cin = this.gf.getCinIsoDate(this.gf.getCinIsoDate(data.checkInDate));
            this.cout = this.gf.getCinIsoDate(this.gf.getCinIsoDate(data.checkOutDate));

            this.datecin = new Date(this.gf.getCinIsoDate(data.checkInDate));
            this.datecout = new Date(this.gf.getCinIsoDate(data.checkOutDate));
            this.cindisplay = moment(this.gf.getCinIsoDate(this.datecin)).format("DD-MM-YYYY");
            this.coutdisplay = moment(this.gf.getCinIsoDate(this.datecout)).format("DD-MM-YYYY");

            this.searchhotel.CheckInDate = this.cin;
            this.searchhotel.CheckOutDate = this.cout;
            this.searchhotel.datecin = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckInDate));
            this.searchhotel.datecout = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckOutDate));
            this.searchhotel.cindisplay = moment(this.gf.getCinIsoDate(this.searchhotel.datecin)).format("DD-MM-YYYY");
            this.searchhotel.coutdisplay = moment(this.gf.getCinIsoDate(this.searchhotel.datecout)).format("DD-MM-YYYY");
          } else {
            this.cin = new Date(this.gf.getCinIsoDate(new Date()));
            var rescin = this.cin.setTime(this.cin.getTime() + (1 * 24 * 60 * 60 * 1000));
            var datein = new Date(this.gf.getCinIsoDate(rescin));
            this.cin = moment(datein).format("YYYY-MM-DD");
            this.cindisplay = moment(datein).format("DD-MM-YYYY");
            this.datecin = new Date(this.gf.getCinIsoDate(rescin));

            this.cout = new Date(this.gf.getCinIsoDate(new Date()));
            var res = this.cout.setTime(
              this.cout.getTime() + (2 * 24 * 60 * 60 * 1000)
            );
            var date = new Date(this.gf.getCinIsoDate(res));
            this.cout = moment(date).format("YYYY-MM-DD");
            this.coutdisplay = moment(date).format("DD-MM-YYYY");
            this.datecout = new Date(this.gf.getCinIsoDate(res));

            this.searchhotel.CheckInDate = this.gf.getCinIsoDate(this.cin);
            this.searchhotel.CheckOutDate = this.gf.getCinIsoDate(this.cout);
            this.searchhotel.datecin = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckInDate));
            this.searchhotel.datecout = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckOutDate));
            this.searchhotel.cindisplay = moment(this.gf.getCinIsoDate(this.searchhotel.datecin)).format("DD-MM-YYYY");
            this.searchhotel.coutdisplay = moment(this.gf.getCinIsoDate(this.searchhotel.datecout)).format("DD-MM-YYYY");
          }

          this.getCinCoutDayName();

        } else if (!this.cin || !this.searchhotel.CheckInDate) {
          this.cin = new Date(this.gf.getCinIsoDate(new Date()));
          var rescin = this.cin.setTime(this.cin.getTime() + (1 * 24 * 60 * 60 * 1000));
          var datein = new Date(this.gf.getCinIsoDate(rescin));
          this.cin = moment(datein).format("YYYY-MM-DD");
          this.cindisplay = moment(datein).format("DD-MM-YYYY");
          this.datecin = new Date(this.gf.getCinIsoDate(rescin));

          this.cout = new Date(this.gf.getCinIsoDate(new Date()));
          var res = this.cout.setTime(
            this.cout.getTime() + (2 * 24 * 60 * 60 * 1000)
          );
          var date = new Date(this.gf.getCinIsoDate(res));
          this.cout = moment(date).format("YYYY-MM-DD");
          this.coutdisplay = moment(date).format("DD-MM-YYYY");
          this.datecout = new Date(this.gf.getCinIsoDate(res));

          this.searchhotel.CheckInDate = this.gf.getCinIsoDate(this.cin);
          this.searchhotel.CheckOutDate = this.gf.getCinIsoDate(this.cout);
          this.searchhotel.datecin = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckInDate));
          this.searchhotel.datecout = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckOutDate));
          this.searchhotel.cindisplay = moment(this.gf.getCinIsoDate(this.searchhotel.datecin)).format("DD-MM-YYYY");
          this.searchhotel.coutdisplay = moment(this.gf.getCinIsoDate(this.searchhotel.datecout)).format("DD-MM-YYYY");

          this.getCinCoutDayName();
        }
      })
    }
    this.getCalendarholidays();
  }

  getCinCoutDayName() {
    if (this.searchhotel.datecin) {
      this.searchhotel.cinthu = moment(this.searchhotel.datecin).format("dddd");
      switch (this.searchhotel.cinthu) {
        case "Monday":
          this.searchhotel.cinthu = "Thứ 2";
          break;
        case "Tuesday":
          this.searchhotel.cinthu = "Thứ 3";
          break;
        case "Wednesday":
          this.searchhotel.cinthu = "Thứ 4";
          break;
        case "Thursday":
          this.searchhotel.cinthu = "Thứ 5";
          break;
        case "Friday":
          this.searchhotel.cinthu = "Thứ 6";
          break;
        case "Saturday":
          this.searchhotel.cinthu = "Thứ 7";
          break;
        default:
          this.searchhotel.cinthu = "Chủ nhật";
          break;
      }
    }
    if (this.searchhotel.datecout) {
      this.searchhotel.coutthu = moment(this.searchhotel.datecout).format("dddd");
      switch (this.searchhotel.coutthu) {
        case "Monday":
          this.searchhotel.coutthu = "Thứ 2";
          break;
        case "Tuesday":
          this.searchhotel.coutthu = "Thứ 3";
          break;
        case "Wednesday":
          this.searchhotel.coutthu = "Thứ 4";
          break;
        case "Thursday":
          this.searchhotel.coutthu = "Thứ 5";
          break;
        case "Friday":
          this.searchhotel.coutthu = "Thứ 6";
          break;
        case "Saturday":
          this.searchhotel.coutthu = "Thứ 7";
          break;
        default:
          this.searchhotel.coutthu = "Chủ nhật";
          break;
      }
    }

  }

  getDayName(datecin, datecout) {
    if (!this.cinthu) {
      this.cinthu = moment(datecin).format('dddd');
      switch (this.cinthu) {
        case "Monday":
          this.cinthu = "Thứ 2"
          break;
        case "Tuesday":
          this.cinthu = "Thứ 3"
          break;
        case "Wednesday":
          this.cinthu = "Thứ 4"
          break;
        case "Thursday":
          this.cinthu = "Thứ 5"
          break;
        case "Friday":
          this.cinthu = "Thứ 6"
          break;
        case "Saturday":
          this.cinthu = "Thứ 7"
          break;
        default:
          this.cinthu = "Chủ nhật"
          break;
      }
    }
    if (!this.coutthu) {
      this.coutthu = moment(datecout).format('dddd');
      switch (this.coutthu) {
        case "Monday":
          this.coutthu = "Thứ 2"
          break;
        case "Tuesday":
          this.coutthu = "Thứ 3"
          break;
        case "Wednesday":
          this.coutthu = "Thứ 4"
          break;
        case "Thursday":
          this.coutthu = "Thứ 5"
          break;
        case "Friday":
          this.coutthu = "Thứ 6"
          break;
        case "Saturday":
          this.coutthu = "Thứ 7"
          break;
        default:
          this.coutthu = "Chủ nhật"
          break;
      }
    }


    setTimeout(() => {
      if (this.myloader) {
        this.myloader.dismiss();
      }
    }, 500)
  }

  cin_click() {

  }

  showcalendarcin() {
    this.showCalCin = !this.showCalCin;
    if (this.showCalCout) {
      this.showCalCout = !this.showCalCout;
    }
  }

  showcalendarcout() {
    if (this.showCalCin) {
      this.showCalCin = !this.showCalCin;
    }
    this.showCalCout = !this.showCalCout;
  }

  getRegions() {
    var se = this;
    let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RegionsBanner' + (se.memberid ? '?memberid=' + se.memberid : '');
    let headers = {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    se.gf.RequestApi('GET', strUrl, headers, {}, 'Tab1', 'getNewsBlog').then((data)=> {
      se.zone.run(() => {
        se.regions = data;
        se.loadRegions(se.regions);
        se.storage.get('listtopregions').then((data1) => {
          if (data1) {
            se.storage.remove('listtopregions').then((d) => {
              se.storage.set('listtopregions', se.regions);
            })
          } else {
            se.storage.set('listtopregions', se.regions);
          }
        })
      })
    })
  }

  loadRegions(listregions) {
    var se = this;
    se.regions = listregions;
    for (let i = 0; i < se.regions.length; i++) {
      if (se.regions[i].image.indexOf('https') == -1) {
        se.regions[i].image = 'https:' + se.regions[i].image;
      }

      if (i == 0 || i == 6) {
        if (se.regions[i].image.indexOf('380x190') == -1) {
          if (se.regions[i].image.indexOf('jpq') != -1) {
            se.regions[i].image = se.regions[i].image.replace(".jpg", "-380x190.jpg");
          } else if (se.regions[i].image.indexOf('png') != -1) {
            se.regions[i].image = se.regions[i].image.replace(".png", "-380x190.png");
          }

        }
      }
      if (i == 1 || i == 5) {
        if (se.regions[i].image.indexOf('130x260') == -1) {
          if (se.regions[i].image.indexOf('jpq') != -1) {
            se.regions[i].image = se.regions[i].image.replace(".jpg", "-130x260.jpg");
          } else if (se.regions[i].image.indexOf('png') != -1) {
            se.regions[i].image = se.regions[i].image.replace(".png", "-130x260.png");
          }

        }
      }
      if (i != 0 && i != 1 && i != 5 && i != 6) {
        if (se.regions[i].image.indexOf('130x130') == -1) {

          if (se.regions[i].image.indexOf('jpq') != -1) {
            se.regions[i].image = se.regions[i].image.replace(".jpg", "-130x130.jpg");
          } else if (se.regions[i].image.indexOf('png') != -1) {
            se.regions[i].image = se.regions[i].image.replace(".png", "-130x130.png");
          }
        }
      }
      var item = { image: se.regions[i].image, name: se.regions[i].title, id: se.regions[i].regionId, regionCode: se.regions[i].code, totalHotel: se.regions[i].total };
      if (!se.checkExistsItemInArray(se.regionsend, item, 2)) {
        se.regionsend.push(item);
      }
    }
    se.slregion = se.regionsend.length;
    //se.getmood();
    se.storage.get('listtopmoods').then((data) => {
      if (data) {
        se.loadMoods(data);
        setTimeout(() => {
          se.zone.run(() => {
            se.getmood();
          })
        }, 30000);
      } else {
        se.getmood();
      }
    })
  }

  /**
   * Lấy top vùng nước ngoài
   */
  getRegionsInternational() {
    var se = this;
    let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RegionsBanner?isInternation=true' + (se.memberid ? '&memberid=' + se.memberid : '');
    let headers = {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    se.gf.RequestApi('GET', strUrl, headers, {}, 'Tab1', 'getRegionsInternational').then((data)=> {
      se.zone.run(() => {
        se.regionsinter = data;
        se.storage.get('listtopregioninternational').then((data1) => {
          if (data1) {
            se.storage.remove('listtopregioninternational').then(() => {
              se.storage.set('listtopregioninternational', se.regionsinter);
            })
          } else {
            se.storage.set('listtopregioninternational', se.regionsinter);
          }
        })
        se.loadRegionsInternational(se.regionsinter);

      })
    })
  }

  loadRegionsInternational(listregions) {
    var se = this;
    se.regionsinter = listregions;
    for (let i = 0; i < se.regionsinter.length; i++) {
      if (se.regionsinter[i].image.indexOf('https') == -1) {
        se.regionsinter[i].image = 'https:' + se.regionsinter[i].image;
      }
      if (i == 0) {
        if (se.regionsinter[i].image.indexOf('750x190') == -1 && se.regionsinter[i].image.indexOf('380x190') == -1) {
          if (se.regionsinter[i].image.indexOf('jpq') != -1) {
            se.regionsinter[i].image = se.regionsinter[i].image.replace(".jpg", "-380x190.jpg");
          } else if (se.regionsinter[i].image.indexOf('png') != -1) {
            se.regionsinter[i].image = se.regionsinter[i].image.replace(".png", "-380x190.png");
          }
        }
        if (se.regionsinter[i].image.indexOf('380x190') == -1) {

          if (se.regionsinter[i].image.indexOf('jpq') != -1) {
            se.regionsinter[i].image = se.regionsinter[i].image.replace(".jpg", "-380x190.jpg");
          } else if (se.regionsinter[i].image.indexOf('png') != -1) {
            se.regionsinter[i].image = se.regionsinter[i].image.replace(".png", "-380x190.png");
          }
        }
      }
      else {
        if (se.regionsinter[i].image.indexOf('130x130') == -1) {
          if (se.regionsinter[i].image.indexOf('jpq') != -1) {
            se.regionsinter[i].image = se.regionsinter[i].image.replace(".jpg", "-130x130.jpg");
          } else if (se.regionsinter[i].image.indexOf('png') != -1) {
            se.regionsinter[i].image = se.regionsinter[i].image.replace(".png", "-130x130.png");
          }
        }
      }
      var item = { image: se.regionsinter[i].image, name: se.regionsinter[i].title, id: se.regionsinter[i].regionId, regionCode: se.regionsinter[i].code, totalHotel: se.regionsinter[i].total };
      if (!se.checkExistsItemInArray(se.regionintersend, item, 2)) {
        se.regionintersend.push(item);
      }

    }
  }

  /**
   * 
   * @param arrays mảng kiểm tra trùng
   * @param item item kiểm tra
   * @param type loại 1 - topdeal, 2 - region, 3 - mood, 4 - blog
   */
  checkExistsItemInArray(arrays: any, item: any, type: any) {
    var res = false;
    if (type == 1 || type == 3 || type == 2)//hoteldeal || mood
    {
      res = arrays.some(r => r.id == item.id);
    }
    if (type == 4)//blog
    {
      res = arrays.some(r => r.Id == item.Id);
    }

    return res;
  }

  /**
   * Sự kiện loadmore khi scroll topdeal
   * @param event biến event
   */
  onScroll(event: any) {
    let scrolled = 0;
    let el: any = window.document.getElementsByClassName('slide2-scroll');
    if (el.length > 0) {
      scrolled = Math.round(el[0].scrollWidth - el[0].scrollLeft);
    }
    if (scrolled == el[0].offsetWidth || scrolled + 1 == el[0].offsetWidth) {
      setTimeout(() => {
        this.doInfinite();
      }, 500)
    }

  }

  /**
   * Sự kiện loadmore khi scroll blog
   * @param event biến event
   */
  onScrollBlog(event: any) {
    let scrolled = 0;
    let el: any = window.document.getElementsByClassName('slide5-scroll');
    if (el.length > 0) {
      scrolled = Math.round(el[0].scrollWidth - el[0].scrollLeft);
    }
    if (scrolled == el[0].offsetWidth || scrolled + 1 == el[0].offsetWidth) {
      setTimeout(() => {
        this.doInfiniteBlog();
      }, 500)
    }

  }
  /**
   * Sự kiện loadmore khi scroll blog
   * @param event biến event
   */
  onScrollBlogTrip(event: any) {
    let scrolled = 0;
    let el: any = window.document.getElementsByClassName('slideblogtrips-scroll');
    if (el.length > 0) {
      scrolled = Math.round(el[0].scrollWidth - el[0].scrollLeft);
    }
    if (scrolled == el[0].offsetWidth || scrolled + 1 == el[0].offsetWidth) {
      setTimeout(() => {
        this.doInfiniteBlogTrip();
      }, 500)
    }

  }

  /**
   * Hàm gọi loadpaging topdeal
   */
  doInfinite() {
    this.zone.run(() => {
      if (this.ischeck == true) {
        this.page = this.page + 1;
        this.getHotelDealPaging();
      }
    })
  }

  /**
   * Hàm gọi loadpaging topdeal
   */
  doInfiniteBlog() {
    this.zone.run(() => {
      if (this.ischeck == true && this.canLoadBlog) {
        this.pageBlog = this.pageBlog + 1;
        this.getNewsBlog(0);
      }
    })
  }

  /**
   * Hàm gọi loadpaging topdeal
   */
  doInfiniteBlogTrip() {
    this.zone.run(() => {
      if (this.ischeck == true && this.canLoadBlogTrip) {
        this.pageBlogTrip = this.pageBlogTrip + 1;
        this.getblogtrips();
      }
    })
  }

  getHoteldeal() {
    var se = this;
    let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/TopDeals?pageIndex=' + se.page + '&pageSize=' + (se.totalItem ? se.totalItem : 200) + (se.memberid ? '&memberid=' + se.memberid : '');
    let headers =
    {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    se.gf.RequestApi('POST', strUrl, headers, {}, 'Tab1', 'getHoteldeal').then((res)=> {
      se.slideData = res;
      se.storage.get('listtopdealdefault').then((data) => {
        if (data) {
          se.storage.remove('listtopdealdefault').then(() => {
            se.storage.set('listtopdealdefault', se.slideData);
          })
        } else {
          se.storage.set('listtopdealdefault', se.slideData);
        }
      })

      se.loadTopDeal(se.slideData);

    })
    // var options = {
    //   method: 'POST',
    //   url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/TopDeals?pageIndex=' + se.page + '&pageSize=' + (se.totalItem ? se.totalItem : 200) + (se.memberid ? '&memberid=' + se.memberid : ''),
    //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
    //   headers:
    //   {

    //     apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
    //     apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    //   }
    // };
    // request(options, function (error, response, body) {
    //   if (response.statusCode != 200) {
    //     var objError = {
    //       page: "main",
    //       func: "getHoteldeal",
    //       message: response.statusMessage,
    //       content: response.body,
    //       param: JSON.stringify(options),
    //       type: "warning"
    //     };
    //     C.writeErrorLog(objError, response);
    //   }
    //   if (error) {
    //     error.page = "main";
    //     error.func = "getHoteldeal";
    //     error.param = JSON.stringify(options);
    //     C.writeErrorLog(error, response);
    //   };
    //   se.slideData = JSON.parse(body);
    //   se.storage.get('listtopdealdefault').then((data) => {
    //     if (data) {
    //       se.storage.remove('listtopdealdefault').then(() => {
    //         se.storage.set('listtopdealdefault', se.slideData);
    //       })
    //     } else {
    //       se.storage.set('listtopdealdefault', se.slideData);
    //     }
    //   })

    //   se.loadTopDeal(se.slideData);


    // });
  }

  loadTopDeal(listtopdeal) {
    var se = this;
    se.slideData = listtopdeal;
    se.totalItem = se.slideData.length;
    se.showloadmore = se.slideData.length == se.totalItem ? false : true;
    var chuoi = "";
    se.zone.run(() => {
      for (let i = 0; i < se.pagesize; i++) {
        if (se.slideData && se.slideData[i] && se.slideData[i].images[0]) {
          var res = se.slideData[i].images[0].url.substring(0, 4);
          if (res != "http") {
            se.slideData[i].images[0].url = 'https:' + se.slideData[i].images[0].url;
          }
          var minPrice = se.slideData[i].minPrice.toLocaleString();
          chuoi = "";
          var name = se.slideData[i].name.split('|');
          for (let x = 1; x < name.length; x++) {
            if (x == name.length - 1) {
              chuoi = chuoi + name[x];
            } else {
              chuoi = chuoi + name[x] + "|";
            }
          }
          switch (se.slideData[i].rating) {
            case 50:
              se.slideData[i].rating = "./assets/star/ic_star_5.svg";
              break;
            case 45:
              se.slideData[i].rating = "./assets/star/ic_star_4.5.svg";
              break;
            case 40:
              se.slideData[i].rating = "./assets/star/ic_star_4.svg";
              break;
            case 35:
              se.slideData[i].rating = "./assets/star/ic_star_3.5.svg";
              break;
            case 30:
              se.slideData[i].rating = "./assets/star/ic_star_3.svg";
              break;
            case 25:
              se.slideData[i].rating = "./assets/star/ic_star_2.5.svg";
              break;
            case 20:
              se.slideData[i].rating = "./assets/star/ic_star_2.svg";
              break;
            case 15:
              se.slideData[i].rating = "./assets/star/ic_star_1.5.svg";
              break;
            case 10:
              se.slideData[i].rating = "./assets/star/ic_star.svg";
              break;
            case 5:
              se.slideData[i].rating = "./assets/star/ic_star_0.5.svg";
              break;
            default:
              break;
          }
          var item = { ischecked: 0, id: se.slideData[i].id, name: name[0], imageUrl: se.slideData[i].images[0].url, regionName: se.slideData[i].regionName, minPrice: minPrice, description: chuoi, rating: se.slideData[i].rating, priceshow: se.slideData[i].minPrice / 1000 > 1000 ? (se.slideData[i].minPrice / 1000).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(',', '.') : 0, priceFor: se.slideData[i].priceFor };
          se.slideData1.push(item);
        }

      }

      se.sl = se.slideData1.length;
      se.ischeck = true;

      if (se.myloader) {
        se.myloader.dismiss();
      }
      if (se._infiniteScroll) {
        se._infiniteScroll.target.complete();
      }
      se.loadCacheRegion();

    })
  }

  loadCacheRegion() {
    var se = this;
    se.storage.get('listtopregions').then(data => {
      if (data) {
        se.loadRegions(data);
        // setTimeout(() => {
        //   se.zone.run(() => {
        //     se.getRegions();
        //   })
        // }, 30000);
      } else {
        se.getRegions();
      }

    })

    se.storage.get('listtopregioninternational').then(data => {
      if (data) {
        se.loadRegionsInternational(data);
        // setTimeout(() => {
        //   se.getRegionsInternational();
        // }, 30000);
      } else {
        se.getRegionsInternational();
      }
    })
  }

  /**
   * Hàm load paging topdeal
   */
  getHotelDealPaging() {
    var se = this;
    se.showloadmore = se.slideData1.length == se.slideData.length ? false : true;
    let start = se.slideData1.length;
    var chuoi = "";
    se.zone.run(() => {
      for (let i = start; i < start + se.pagesize; i++) {
        if (se.slideData[i] && se.slideData[i].images[0]) {
          var res = se.slideData[i].images[0].url.substring(0, 4);
          if (res != "http") {
            se.slideData[i].images[0].url = 'https:' + se.slideData[i].images[0].url;
          }

          var minPrice = se.slideData[i].minPrice ? se.slideData[i].minPrice.toLocaleString() : '';
          chuoi = "";
          var name = se.slideData[i].name.split('|');
          for (let x = 1; x < name.length; x++) {
            if (x == name.length - 1) {
              chuoi = chuoi + name[x];
            } else {
              chuoi = chuoi + name[x] + "|";
            }
          }
          switch (se.slideData[i].rating) {
            case 50:
              se.slideData[i].rating = "./assets/star/ic_star_5.svg";
              break;
            case 45:
              se.slideData[i].rating = "./assets/star/ic_star_4.5.svg";
              break;
            case 40:
              se.slideData[i].rating = "./assets/star/ic_star_4.svg";
              break;
            case 35:
              se.slideData[i].rating = "./assets/star/ic_star_3.5.svg";
              break;
            case 30:
              se.slideData[i].rating = "./assets/star/ic_star_3.svg";
              break;
            case 25:
              se.slideData[i].rating = "./assets/star/ic_star_2.5.svg";
              break;
            case 20:
              se.slideData[i].rating = "./assets/star/ic_star_2.svg";
              break;
            case 15:
              se.slideData[i].rating = "./assets/star/ic_star_1.5.svg";
              break;
            case 10:
              se.slideData[i].rating = "./assets/star/ic_star.svg";
              break;
            case 5:
              se.slideData[i].rating = "./assets/star/ic_star_0.5.svg";
              break;
            default:
              break;
          }
          var item = { ischecked: 0, id: se.slideData[i].id, name: name[0], imageUrl: se.slideData[i].images[0].url, regionName: se.slideData[i].regionName, minPrice: minPrice, description: chuoi, rating: se.slideData[i].rating, priceshow: se.slideData[i].minPrice / 1000 > 1000 ? (se.slideData[i].minPrice / 1000).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(',', '.') : 0, priceFor: se.slideData[i].priceFor };
          se.slideData1.push(item);
        }

      }
      se.sl = se.slideData1.length;
      se.ischeck = true;
      setTimeout(() => {
        if (se.myloader) {
          se.myloader.dismiss();
        }
      }, 500)
    })
  }

  getmood() {
    var se = this;
    let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/Moods' + (se.memberid ? '?memberid=' + se.memberid : '');
    let headers =
    {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    se.gf.RequestApi('POST', strUrl, headers, {}, 'Tab1', 'getHoteldeal').then((res)=> {
      se.zone.run(() => {
          se.slideMood = res;
          se.storage.get('listtopmoods').then((data) => {
            if (data) {
              se.storage.remove('listtopmoods').then((datanew) => {
                se.storage.set('listtopmoods', datanew);
              })
            } else {
              se.storage.set('listtopmoods', se.slideMood);
            }
          })
          se.loadMoods(se.slideMood);
        })
    })
    // var options = {
    //   method: 'POST',
    //   url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/Moods' + (se.memberid ? '?memberid=' + se.memberid : ''),
    //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
    //   headers:
    //   {
    //     'postman-token': 'f0589249-bf19-001c-f359-9b33dcf6db86',
    //     'cache-control': 'no-cache',
    //     apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
    //     apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    //   }
    // };
    // request(options, function (error, response, body) {
    //   if (response.statusCode != 200) {
    //     var objError = {
    //       page: "main",
    //       func: "getmood",
    //       message: response.statusMessage,
    //       content: response.body,
    //       param: JSON.stringify(options),
    //       type: "warning"
    //     };
    //     C.writeErrorLog(objError, response);
    //   }
    //   if (error) {
    //     error.page = "main";
    //     error.func = "getmood";
    //     error.param = JSON.stringify(options);
    //     C.writeErrorLog(error, response);
    //   };
    //   se.zone.run(() => {
    //     se.slideMood = JSON.parse(body);

    //     se.storage.get('listtopmoods').then((data) => {
    //       if (data) {
    //         se.storage.remove('listtopmoods').then((datanew) => {
    //           se.storage.set('listtopmoods', datanew);
    //         })
    //       } else {
    //         se.storage.set('listtopmoods', se.slideMood);
    //       }
    //     })
    //     se.loadMoods(se.slideMood);

    //   })
    // });
  }

  loadMoods(listmoods) {
    var se = this;
    se.slideMood = listmoods;
    for (let i = 0; i < se.slideMood.length; i++) {
      var res = se.slideMood[i].avatar.substring(0, 4);
      if (res != "http") {
        se.slideMood[i].avatar = 'https:' + se.slideMood[i].avatar;
      }
    }
    let itemmap = se.slideMood.some((m) => m.name == 'voucher');
    if(!itemmap){
      se.slideMood.push({name: 'voucher' , avatar: 'https://cdn1.ivivu.com/images/general/dangcap1.png', title: 'Gift Voucher',shortDescription: 'Nâng tầm chuyến du lịch của công ty và đội nhóm của bạn!' });
    }
    
    se.slmood = se.slideMood.length;
  }
  clickks() {
    this.ischeckks = true;
    this.ischeckvmb = false;
  }
  clickvmb() {
    this.ischeckks = false;
    this.ischeckvmb = true;
  }
  /**
   * Sự kiện khi chọn ngày trên datetimepicker checkin
   * @param selectdate ngày được chọn
   */
  selectcin(selectdate: Date) {
    var sdate = new Date(selectdate);
    this.datecin = new Date(selectdate);
    this.cin = moment(sdate).format('YYYY-MM-DD');
    this.cindisplay = moment(sdate).format('DD-MM-YYYY');
    //Set lại ngày checkout nếu chọn ngày checkin >= ngày checkout
    if (selectdate >= this.datecout) {
      var res = sdate.setTime(sdate.getTime() + (1 * 24 * 60 * 60 * 1000));
      var date = new Date(res);
      this.datecout = date;
      this.cout = moment(date).format('YYYY-MM-DD');
      this.coutdisplay = moment(sdate).format('DD-MM-YYYY');
      this.coutthu = moment(date).format('dddd');
      switch (this.coutthu) {
        case "Monday":
          this.coutthu = "Thứ 2"
          break;
        case "Tuesday":
          this.coutthu = "Thứ 3"
          break;
        case "Wednesday":
          this.coutthu = "Thứ 4"
          break;
        case "Thursday":
          this.coutthu = "Thứ 5"
          break;
        case "Friday":
          this.coutthu = "Thứ 6"
          break;
        case "Saturday":
          this.coutthu = "Thứ 7"
          break;
        default:
          this.coutthu = "Chủ nhật"
          break;
      }
    }
    //Set thứ theo ngày checkin được select
    this.cinthu = moment(selectdate).format('dddd');
    switch (this.cinthu) {
      case "Monday":
        this.cinthu = "Thứ 2"
        break;
      case "Tuesday":
        this.cinthu = "Thứ 3"
        break;
      case "Wednesday":
        this.cinthu = "Thứ 4"
        break;
      case "Thursday":
        this.cinthu = "Thứ 5"
        break;
      case "Friday":
        this.cinthu = "Thứ 6"
        break;
      case "Saturday":
        this.cinthu = "Thứ 7"
        break;
      default:
        this.cinthu = "Chủ nhật"
        break;
    }
    //Ẩn datepicker
    this.showCalCin = !this.showCalCin;
  }
  /**
   * Sự kiện khi chọn trên datetimepicker checkout
   * @param selectdate ngày check out
   */
  selectcout(selectdate: Date) {
    //Nếu ngày checkout > ngày checkin thì vào set lại biến ngày checkout
    if (selectdate > this.datecin) {
      this.datecout = new Date(selectdate);
      this.cout = moment(this.datecout).format('YYYY-MM-DD');
      this.coutdisplay = moment(this.datecout).format('DD-MM-YYYY');
      this.coutthu = moment(this.datecout).format('dddd');
      switch (this.coutthu) {
        case "Monday":
          this.coutthu = "Thứ 2"
          break;
        case "Tuesday":
          this.coutthu = "Thứ 3"
          break;
        case "Wednesday":
          this.coutthu = "Thứ 4"
          break;
        case "Thursday":
          this.coutthu = "Thứ 5"
          break;
        case "Friday":
          this.coutthu = "Thứ 6"
          break;
        case "Saturday":
          this.coutthu = "Thứ 7"
          break;
        default:
          this.coutthu = "Chủ nhật"
          break;
      }
      this.showCalCout = !this.showCalCout;
    } else {//Nếu ngày check in >= ngày checkout thì show cảnh báo
      //this.presentToastwarming();
    }

  }
  selectclickcin() {
    this.cout = new Date(this.cin);
    var res = this.cout.setTime(this.cout.getTime() + (1 * 24 * 60 * 60 * 1000));
    var date = new Date(res);
    this.cout = moment(date).format('YYYY-MM-DD');
    this.cinthu = moment(this.cin).format('dddd');
    switch (this.cinthu) {
      case "Monday":
        this.cinthu = "Thứ 2"
        break;
      case "Tuesday":
        this.cinthu = "Thứ 3"
        break;
      case "Wednesday":
        this.cinthu = "Thứ 4"
        break;
      case "Thursday":
        this.cinthu = "Thứ 5"
        break;
      case "Friday":
        this.cinthu = "Thứ 6"
        break;
      case "Saturday":
        this.cinthu = "Thứ 7"
        break;
      default:
        this.cinthu = "Chủ nhật"
        break;
    }
  }
  selectclickcout() {
    var datecin = Date.parse(this.cin);
    var datecout = Date.parse(this.cout);
    this.coutthu = moment(datecout).format('dddd');
    switch (this.coutthu) {
      case "Monday":
        this.coutthu = "Thứ 2"
        break;
      case "Tuesday":
        this.coutthu = "Thứ 3"
        break;
      case "Wednesday":
        this.coutthu = "Thứ 4"
        break;
      case "Thursday":
        this.coutthu = "Thứ 5"
        break;
      case "Friday":
        this.coutthu = "Thứ 6"
        break;
      case "Saturday":
        this.coutthu = "Thứ 7"
        break;
      default:
        this.coutthu = "Chủ nhật"
        break;
    }
    if (datecin >= datecout) {
      //this.presentToastwarming();
    }
  }

  openmnu() {
    this.searchhotel.ChildAgeTo = 16;
    this.searchhotel.input = this.input;
    this.searchhotel.flag = this.co;
    this.searchhotel.chuoi = this.chuoi;
    this.searchhotel.CheckInDate = this.cin;
    this.searchhotel.CheckOutDate = this.cout;
    //Xóa clone page-searchhotel do push page
    this.gf.setParams(false, 'requestcombo');
    this.navCtrl.navigateForward('/occupancy');
  }
  openmnu1() {
    this.searchhotel.input = this.input;
    this.searchhotel.flag = this.co;
    this.searchhotel.chuoi = this.chuoi;
    this.searchhotel.CheckInDate = this.cin;
    this.searchhotel.CheckOutDate = this.cout;
    this.navCtrl.navigateForward('/searchhotelfilter');
    this.gf.googleAnalytion('mainpage', 'Search', this.input + '|' + this.chuoi + '|' + this.cin + '|' + this.cout);
  }

  async presentLoading() {
    var loader = await this.loadingCtrl.create({
      message: "",
      duration: 3000
    });
    loader.present();
  }

  async presentLoadingData() {
    this.myloader = await this.loadingCtrl.create({
      duration: 3000
    });
    this.myloader.present();
  }

  /**
   * Hàm bắt sự kiện click chọn ngày trên lịch bằng jquery
   * @param e biến event
   */
  async clickedElement(e: any) {
    var obj: any = e.currentTarget;
    if ($(obj.parentNode).hasClass('endSelection') || $(obj.parentNode).hasClass('startSelection')) {
      if (this.modalCtrl) {
        let fday: any;
        let tday: any;
        var monthenddate: any;
        var yearenddate: any;
        var monthstartdate: any;
        var yearstartdate: any;
        var objTextMonthEndDate: any;
        var objTextMonthStartDate: any;
        this.cofdate = 0;
        this.cotdate = 0;
        this.cinthu = "";
        this.coutthu = "";
        if ($(obj.parentNode).hasClass('endSelection')) {
          // fday = $('.on-selected')[0].textContent;
          // tday = $(obj)[0].textContent;
          if ($('.days-btn.lunarcalendar.on-selected > p')[0]) {
            fday = $('.days-btn.lunarcalendar.on-selected > p')[0].innerText;
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
            fday = $('.days-btn.lunarcalendar.on-selected > p')[0].innerText
          }
          else {
            fday = $(obj)[0].textContent;
          }
          if ($('.days.endSelection .days-btn.lunarcalendar > p')[0]) {
            tday = $('.days.endSelection .days-btn.lunarcalendar > p')[0].innerText;
          }
          else {
            tday = $('.endSelection').children('.days-btn')[0].textContent;
          }
          objTextMonthStartDate = $(obj).closest('.month-box').children()[0].textContent;
          objTextMonthEndDate = $('.endSelection').closest('.month-box').children()[0].textContent;
        }


        if (objTextMonthEndDate && objTextMonthEndDate.length > 0 && objTextMonthStartDate && objTextMonthStartDate.length > 0) {
          monthstartdate = objTextMonthStartDate.split('/')[0];
          yearstartdate = objTextMonthStartDate.split('/')[1];
          monthenddate = objTextMonthEndDate.split('/')[0];
          yearenddate = objTextMonthEndDate.split('/')[1];
          var fromdate = new Date(yearstartdate, monthstartdate - 1, fday);
          var todate = new Date(yearenddate, monthenddate - 1, tday);
          if (fromdate && todate && moment(todate).diff(fromdate, 'days') > 0) {
            var se = this;
            setTimeout(() => {
              se.modalCtrl.dismiss();
            }, 250)

            se.cin = moment(se.gf.getCinIsoDate(fromdate)).format('YYYY-MM-DD');
            se.cout = moment(se.gf.getCinIsoDate(todate)).format('YYYY-MM-DD');

            se.searchhotel.CheckInDate = moment(se.gf.getCinIsoDate(fromdate)).format('YYYY-MM-DD');
            se.searchhotel.CheckOutDate = moment(se.gf.getCinIsoDate(todate)).format('YYYY-MM-DD');

            se.zone.run(() => {
              se.searchhotel.CheckInDate = se.gf.getCinIsoDate(se.cin);
              se.searchhotel.CheckOutDate = se.gf.getCinIsoDate(se.cout);
              se.datecin = new Date(se.gf.getCinIsoDate(se.cin));
              se.datecout = new Date(se.gf.getCinIsoDate(se.cout));
              se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
              se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');

              se.searchhotel.datecin = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckInDate));
              se.searchhotel.datecout = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckOutDate));

              se.searchhotel.cindisplay = moment(se.searchhotel.datecin).format("DD-MM-YYYY");
              se.searchhotel.coutdisplay = moment(se.searchhotel.datecout).format("DD-MM-YYYY");

              //xử lý âm lịch
              this.bindlunar();
              se.storage.set('hasChangeDate', true);
              se.gf.setCacheSearchHotelInfo({ checkInDate: se.searchhotel.CheckInDate, checkOutDate: se.searchhotel.CheckOutDate, adult: se.searchhotel.adult, child: se.searchhotel.child, childAge: se.searchhotel.arrchild, roomNumber: se.searchhotel.roomnumber });
            })
          }
        }
      }
    }
  }

  async openPickupCalendar(){
    let se = this;
    if(se.ischeckcalendar){
    se.ischeckcalendar = false;
    se.searchhotel.formChangeDate = 1;
      let modal = await se.modalCtrl.create({
        component: SelectDateRangePage,
      });

      modal.present().then(() => {
        se.ischeckcalendar=true;
      });

      const event: any = await modal.onDidDismiss();
      const date = event.data;
      if (event.data) {
        se.cin = moment(se.gf.getCinIsoDate(se.searchhotel.CheckInDate)).format('YYYY-MM-DD');
        se.cout = moment(se.gf.getCinIsoDate(se.searchhotel.CheckOutDate)).format('YYYY-MM-DD');
        se.zone.run(() => {
          se.searchhotel.CheckInDate = se.cin;
          se.searchhotel.CheckOutDate = se.cout;

          se.searchhotel.datecin = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckInDate));
          se.searchhotel.datecout = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckOutDate));

          se.searchhotel.cindisplay = moment(se.searchhotel.datecin).format("DD-MM-YYYY");
          se.searchhotel.coutdisplay = moment(se.searchhotel.datecout).format("DD-MM-YYYY");

          se.getCinCoutDayName();
          se.bindlunar();

          se.datecin = new Date(se.gf.getCinIsoDate(se.cin));
          se.datecout = new Date(se.gf.getCinIsoDate(se.cout));
          se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
          se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');
          se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
          se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');
          se.getDayName(se.datecin, se.datecout);
          se.gf.setCacheSearchHotelInfo({ checkInDate: se.searchhotel.CheckInDate, checkOutDate: se.searchhotel.CheckOutDate, adult: se.searchhotel.adult, child: se.searchhotel.child, childAge: se.searchhotel.arrchild, roomNumber: se.searchhotel.roomnumber });
        })
      }
       
    }
  }

  getNewsBlog(value) {
    var se = this;
    se.canLoadBlog = false;
    let strUrl = C.urls.baseUrl.urlBlog + '/GetNewsBlog?pageIndex=' + se.pageBlog + '&pageSize=' + se.pageSizeBlog + (se.memberid ? '&memberid=' + se.memberid : '');
    se.gf.RequestApi('GET', strUrl, {}, {}, 'Tab1', 'getNewsBlog').then((data)=> {
      se.zone.run(() => {
            var listBlogtemp = data;
            se.listBlog = [];
            se.showloadmoreblog = listBlogtemp.length == 0 ? false : true;
            for (let i = 0; i < listBlogtemp.length; i++) {
              listBlogtemp[i].Date = moment(listBlogtemp[i].Date).format('DD/MM/YYYY');
            }
            if (se.arrbloglike && se.arrbloglike.length > 0) {
              var itemblog;
              for (let i = 0; i < listBlogtemp.length; i++) {
                itemblog = { Avatar: listBlogtemp[i].Avatar, Date: listBlogtemp[i].Date, Id: listBlogtemp[i].id, Title: listBlogtemp[i].Title, Url: listBlogtemp[i].Url, Like: false }
                for (let j = 0; j < se.arrbloglike.length; j++) {
                  if (se.arrbloglike[j].id == listBlogtemp[i].id) {
                    itemblog = { Avatar: listBlogtemp[i].Avatar, Date: listBlogtemp[i].Date, Id: listBlogtemp[i].id, Title: listBlogtemp[i].Title, Url: listBlogtemp[i].Url, Like: true };
                    break;
                  }
                }
                se.listBlog.push(itemblog);
              }
            }
            else {
              for (let i = 0; i < listBlogtemp.length; i++) {
                itemblog = { Avatar: listBlogtemp[i].Avatar, Date: listBlogtemp[i].Date, Id: listBlogtemp[i].id, Title: listBlogtemp[i].Title, Url: listBlogtemp[i].Url, Like: false }
                se.listBlog.push(itemblog);
              }
            }
            if (!se.checkExistsItemInArray(se.blog, listBlogtemp[0], 4)) {
              se.blog.push(...se.listBlog);
              se.canLoadBlog = true;
            } else {
              if (value == 1) {
                for (let i = 0; i < se.blog.length; i++) {
                  se.blog[i].Like = false;
                }
              }
              se.showloadmoreblog = false;
              se.canLoadBlog = true;
            }
    
          })
    })
  }
  getbloglike(value) {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'GET',
        //   url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteBlogByUser',
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json',
        //     authorization: text
        //   }
        // };

        let headers=
        {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteBlogByUser';
            se.gf.RequestApi('GET', strUrl, headers, {}, 'Tab1', 'GetFavouriteHotelByUser').then((data) => {
          se.zone.run(() => {
            se.arrbloglike = data;
            if (se.arrbloglike.msg) {
              se.arrbloglike = [];
            }
            if (value == 0) {
              se.getNewsBlog(0);
              se.storage.get('blogtripdefault').then(data => {
                if (data) {
                  se.blogtrips = data;
                } else {
                  se.getblogtrips();
                }
              })

            } else {
              se.bindItemLike(se.arrbloglike);
            }


          });
        });
      }
      else {
        se.arrbloglike = [];
        se.getNewsBlog(1);
      }
    });
  }

  getbloglikelocaltrips(id, value) {
    this.zone.run(() => {
      if (this.blogtrips && this.blogtrips.length > 0) {
        for (let i = 0; i < this.blogtrips.length; i++) {
          if (this.blogtrips[i].id == id) {
            if (value == 1) {
              this.blogtrips[i].Like = true;
            } else {
              this.blogtrips[i].Like = false;
            }
            break;
          }
        }
      }
    })
  }
  getbloglikelocal(id, value) {
    this.zone.run(() => {
      if (this.blog && this.blog.length > 0) {
        for (let i = 0; i < this.blog.length; i++) {
          if (this.blog[i].Id == id) {
            if (value == 1) {
              this.blog[i].Like = true;
            } else {
              this.blog[i].Like = false;
            }
            break;
          }
        }
      }
    })
  }
  bindItemLike(listLike) {
    var se = this;
    if (listLike && listLike.length > 0) {
      se.blog.forEach(element => {
        if (listLike && listLike.length > 0) {
          var itemlikemap = listLike.filter((item) => { return item.id == element.Id });
          if (itemlikemap && itemlikemap.length > 0) {
            se.zone.run(() => {
              element.Like = true;
            })
          }
          else {
            se.zone.run(() => {
              element.Like = false;
            })
          }
        }
      });
    } else {
      for (let i = 0; i < se.blog.length; i++) {
        se.blog[i].Like = false;
      }
    }

    if (se.blogtrips && se.blogtrips.length > 0) {
      se.bindItemLiketrips(se.arrbloglike);
    } else {
      // se.storage.get('blogtripdefault').then((data:any)=>{
      //   if(data){
      //     se.blogtrips = data;
      //   }else{
      //     se.getblogtrips();
      //   }
      // })
      se.getblogtrips();
    }
  }
  bindItemLiketrips(listLike) {
    var se = this;
    if (listLike && listLike.length > 0) {
      se.blogtrips.forEach(element => {
        var itemlikemap = listLike.filter((item) => { return item.id == element.id });
        if (itemlikemap && itemlikemap.length > 0) {
          se.zone.run(() => {
            element.Like = true;
          })
        }
        else {
          se.zone.run(() => {
            element.Like = false;
          })
        }
      });
    } else {
      for (let i = 0; i < se.blogtrips.length; i++) {
        se.blogtrips[i].Like = false;
      }
    }
  }
  likeItemblog(id) {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.getbloglikelocal(id, 1);
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'POST',
        //   url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/AddFavouriteBlog',
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     authorization: text
        //   },
        //   body: { postId: id },
        //   json: true
        // };

        let headers =
        {
          authorization: text
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/AddFavouriteBlog';
            se.gf.RequestApi('POST', strUrl, headers, {postId: id}, 'Tab1', 'likeItemblog').then((data) => {
          if (se.valueGlobal.blogid) {
            se.getbloglike(1);
            se.valueGlobal.blogid = '';
          }
        });

      }
      else {
        se.valueGlobal.logingoback = '/app/tabs/tab1';
        se.valueGlobal.blogid = id;
        se.navCtrl.navigateForward('/login');
      }
    });
  }
  likeItemblogtrips(id) {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.getbloglikelocaltrips(id, 1);
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'POST',
        //   //url: 'https://beta-olivia.ivivu.com/mobile/OliviaApis/AddFavouriteHotel',
        //   url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/AddFavouriteBlog',
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     authorization: text
        //   },
        //   body: { postId: id },
        //   json: true
        // };

        let headers =
        {
          authorization: text
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/AddFavouriteBlog';
        se.gf.RequestApi('POST', strUrl, headers, {postId: id}, 'Tab1', 'likeItemblogtrips').then((data) => {
          se.valueGlobal.blogid = "";
        });

      }
      else {
        //se.valueGlobal.logingoback = 'TabPage';
        se.navCtrl.navigateForward('/login');
      }
    });
  }
  unlikeItemblog(id) {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.getbloglikelocal(id, 0);
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'POST',
        //   //url: 'https://beta-olivia.ivivu.com/mobile/OliviaApis/RemoveFavouriteHotelByUser',
        //   url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteBlogByUser',
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     authorization: text
        //   },
        //   body: { postId: id },
        //   json: true
        // };

        let headers =
        {
          authorization: text
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteBlogByUser';
        se.gf.RequestApi('POST', strUrl, headers, {postId: id}, 'Tab1', 'likeItemblogtrips').then((data) => {

        });
      }
      else {
        this.navCtrl.navigateForward('/login');
      }
    });
  }
  unlikeItemblogtrips(id) {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.getbloglikelocaltrips(id, 0);
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'POST',
        //   url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteBlogByUser',
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     authorization: text
        //   },
        //   body: { postId: id },
        //   json: true
        // };

        let headers =
        {
          authorization: text
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteBlogByUser';
        se.gf.RequestApi('POST', strUrl, headers, {postId: id}, 'Tab1', 'likeItemblogtrips').then((data) => {

        });
      }
      else {
        this.navCtrl.navigateForward('/login');
      }
    });
  }
  // getNewsBlogPaging() {
  //   var se = this;
  //     se.zone.run(() => {
  //       for (let i = se.blog.length; i < se.pageSizeBlog; i++) {
  //         //se.blog[i].Date = moment(se.blog[i].Date).format('DD/MM/YYYY');
  //         se.blog.push(se.blogDisplay[i]);
  //       }
  //     })
  // }

  itemblog(item) {
    this.valueGlobal.urlblog = item.Url;
    this.valueGlobal.backValue = 'blog';
    this.valueGlobal.logingoback = '/blog/' + item.Id;
    this.navCtrl.navigateForward('/blog/' + item.Id);
    //google analytic
    this.gf.googleAnalytion('blog', 'Search', '');
  }
  clickitemblogtrips(item) {
    this.valueGlobal.urlblog = item.url;
    this.valueGlobal.backValue = 'blog';
    this.valueGlobal.logingoback = '/blog/' + item.id;
    this.navCtrl.navigateForward('/blog/' + item.id);
    //google analytic
    this.gf.googleAnalytion('blog', 'Search', '');
  }
  clickitemblog(item) {
    this.valueGlobal.urlblog = item.Url;
    this.valueGlobal.backValue = 'blog';
    this.navCtrl.navigateForward('/blog/' + item.Id);
    //google analytic
    this.gf.googleAnalytion('blog', 'Search', '');
  }
  clickitemblogmain() {
    var url = "https://www.ivivu.com/blog";
    this.openWebpage(url);
    //gooclickgle analytic
    this.gf.googleAnalytion('blog', 'Search', '');
  }
  openWebpage(url: string) {
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'yes',
      toolbar: 'yes',
      hideurlbar: 'yes',
      closebuttoncaption: 'Đóng',
      hidenavigationbuttons: 'yes'
    };
    const browser = this.iab.create(url, '_self', options);
    //const browser = this.iab.open(url, '_self', "zoom=no; location=yes; toolbar=yes; hideurlbar=yes; closebuttoncaption=Đóng");
    browser.show();
  }
  getItems(ev: any) {
    // Reset items back to all of the items

    if (this.input) {
      this.ischeckclose = true;
      var se = this;
      const val = ev.target.value;

      var options = {
        method: 'GET',
        url: 'https://www.ivivu.com/GListSuggestion',
        timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        qs: { key: val },
        headers:
        {
        }
      };

        let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteBlogByUser';
        se.gf.RequestApi('POST', strUrl, {}, { key: val }, 'Tab1', 'likeItemblogtrips').then((data) => {

        se.zone.run(() => {
          se.items = data;
          if (val && val.trim() != '') {
            se.items;
            se.ischecklist = true;
          }
          else {
            se.items = [];
            se.ischecklist = false;
          }
        });
      })
    }
    else {
      this.ischeckclose = false;
      this.ischecklist = false;
    }
    //google analytic
    this.gf.googleAnalytion('main', 'searchregion', '');
  }
  change() {
    // this.ischecksearch = true;
    var se = this;
    if (!this.isConnected) {
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      return;
    }
    if (this.input) {
      this.ischeckclose = true;
    }
    this.recent = this.searchhotel.recent;
    se.searchhotel.adult = se.adult;
    se.searchhotel.child = se.child;
    // this.gf.setCacheSearchHotelInfo({checkInDate: se.searchhotel.CheckInDate, checkOutDate: se.searchhotel.CheckOutDate, adult: se.adult, child: se.child, roomNumber: se.roomnumber});
    this.navCtrl.navigateForward('/searchhotel/0/null');
    //this.gf.googleAnalytion('main','Search', 'searchrecent:'+this.input+'|'+this.cin + '|'+this.cout );
  }

  itemclick(item) {
    this.gbitem = item;
    if (item.hotelName) {
      this.input = item.hotelName;
    } else {
      this.input = item.regionName;
    }
    this.ischeckclose = false;
    // this.isenabled = false
    // this.showpopup = false;
    this.ischecksearch = false;
    this.co = 0;
    this.content.scrollToTop(50);
    //google analytic
    this.gf.googleAnalytion('main', 'Search', '' + this.input + '|' + this.cin + '|' + this.cout);
  }
  next1(msg) {
    this.gbmsg = msg;
    this.ischeckclose = false;
    this.searchhotel.gbmsg = msg;
    this.ischecksearch = false;
    if (msg.regionName) {
      this.input = msg.regionName;
    } else {
      this.input = msg.hotelName;
    }
    this.isenabled = false;
    this.co = 2;
    this.content.scrollToTop(50);
    //this.authService.region=name;
    //this.navCtrl.push('HotelListPage');
    this.gf.googleAnalytion('main', 'Search', '' + this.input + '|' + this.cin + '|' + this.cout);
  }

  close() {
    this.ischecksearch = false;
    if (!this.input) {
      this.isenabled = true;
    }
  }
  next(msg, i) {
    this.ischeckclose = false;
    this.gbmsg = msg;
    this.searchhotel.gbmsg = msg;
    this.ischecksearch = false;
    this.index = i;

    this.input = msg.regionName;

    this.isenabled = false;
    this.co = 1;
    this.content.scrollToTop(50);
    //this.authService.region=name;
    //this.navCtrl.push('HotelListPage');
    this.gf.googleAnalytion('main', 'Search', '' + this.input + '|' + this.cin + '|' + this.cout);
  }
  getdata() {
    var se = this;
    // var options = {
    //   method: 'GET',
    //   url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/Relogions',
    //   headers:
    //   {
    //     apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
    //     apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    //   }
    // };
    let headers =
      {
        apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
      };
    let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/Relogions';
        se.gf.RequestApi('GET', strUrl, headers, {}, 'Tab1', 'getdata').then((data) => {
      se.json = data;
      se.getRegions();
    });
  }
  search() {
    if (!this.isConnected) {
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      return;
    }
    this.searchhotel.backPage = "";
    this.searchhotel.isRecent=0;
    if (this.input) {
      this.searchhotel.chuoi = this.chuoi;
      //this.searchhotel.CheckInDate = this.cin;
      //this.searchhotel.CheckOutDate = this.cout;
      this.searchhotel.child = this.child;
      this.searchhotel.adult = this.adult;
      this.searchhotel.input = this.input;

      var se = this;
      var cocheck = 0;
      if (this.co == 1) {
        this.authService.region = this.gbmsg.regionName;
        this.authService.regionid = this.gbmsg.regionId;
        this.authService.regioncode = this.gbmsg.regionCode;
        if (this.recent) {
         
          for (let i = 0; i < this.recent.length; i++) {
            if (this.recent[i].RegionId == this.gbmsg.regionId) {
              cocheck = 1;
              break;
            }
          }
          if (cocheck == 0) {
            var item1 = { Type: "2", HotelId: "", HotelName: "", RegionId: this.gbmsg.regionId, RegionCode: this.gbmsg.regionCode, regionName: this.gbmsg.regionName, flag: "1", TotalHotels: this.gbmsg.totalHotel };
            se.searchhotel.recent = [];

            if (this.recent.length > 1) {
              se.searchhotel.recent.push(this.recent[1]);
            } else {
              se.searchhotel.recent.push(this.recent[0]);
            }
            se.searchhotel.recent.push(item1);
            se.isrefresh = "true";
          }

        }
        else {
          var item1 = { Type: "2", HotelId: "", HotelName: "", RegionId: this.gbmsg.regionId, RegionCode: this.gbmsg.regionCode, regionName: this.gbmsg.regionName, flag: "1", TotalHotels: this.gbmsg.totalHotel };
          se.searchhotel.recent = [];
          se.searchhotel.recent.push(item1);
        }
        var item: any ={};
        item.adult=se.searchhotel.adult;
        item.child=se.searchhotel.child;
        item.arrchild= se.searchhotel.arrchild
        if(this.gbmsg.imageUrl){
          item.imageUrl = (this.gbmsg.imageUrl.toLocaleString().trim().indexOf("http") == -1) ? 'https:' + this.gbmsg.imageUrl : this.gbmsg.imageUrl;
        }
        else{
          item.imageUrl='https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage-110x110.jpg';
        }
        var checkInDate=new Date(this.gf.getCinIsoDate(this.searchhotel.CheckInDate));
        var checkOutDate=new Date(this.gf.getCinIsoDate(this.searchhotel.CheckOutDate));
        item.CheckInDate=this.searchhotel.CheckInDate
        item.CheckOutDate=this.searchhotel.CheckOutDate;
        item.checkInDate=moment(checkInDate).format('DD')+ ' '+ 'tháng' + ' ' +  moment(checkInDate).format('MM') +', ' +moment(checkInDate).format('YYYY')
        item.checkOutDate=moment(checkOutDate).format('DD')+ ' '+ 'tháng' + ' ' +  moment(checkOutDate).format('MM') +', ' +moment(checkOutDate).format('YYYY')
        item.id=this.gbmsg.regionId;
        item.name=this.gbmsg.regionName;
        item.code = this.gbmsg.regionCode;
        item.isType=1;
        this.searchhotel.objRecent = item;
        this.gf.setCacheSearch(item,0);
          
        this.navCtrl.navigateForward('/hotellist/' + se.isrefresh);
          
        this.gf.googleAnalytion('main', 'Search', '' + this.authService.regioncode + '|' + this.input + '|' + this.cin + '|' + this.cout);
      }
      else if (this.co == 0) {
        if (this.gbitem.type == 1) {
          var id1 = { id: this.gbitem.hotelId };
          if (this.recent) {
            var cocheck = 0;
            for (let i = 0; i < this.recent.length; i++) {
              var temp = this.recent[i].hotelId;
              if (temp == id1.id) {
                cocheck = 1;
                break;
              }
            }
            if (cocheck == 0) {
              var item2 = { Type: "1", HotelId: this.gbitem.hotelId, HotelName: this.gbitem.hotelName, RegionId: "", RegionCode: "", regionName: "", flag: "0", TotalHotels: '' };
              se.searchhotel.recent = [];

              if (this.recent.length > 1) {
                se.searchhotel.recent.push(this.recent[1]);
              } else {
                se.searchhotel.recent.push(this.recent[0]);
              }
              this.searchhotel.recent.push(item2);

            }
          }
          else {
            var item2 = { Type: "1", HotelId: this.gbitem.hotelId, HotelName: this.gbitem.hotelName, RegionId: "", RegionCode: "", regionName: "", flag: "0", TotalHotels: '' };
            se.searchhotel.recent = [];

            this.searchhotel.recent.push(item2);
          }
          this.searchhotel.rootPage = "mainpage";
          //this.navCtrl.navigateForward('/hoteldetail/'+this.gbitem.HotelId);
          this.valueGlobal.notRefreshDetail = false;
          this.valueGlobal.logingoback = '/hoteldetail/' + this.gbitem.hotelId;
          var item: any ={};
          item.adult=this.searchhotel.adult;
          item.child=this.searchhotel.child;
          item.arrchild= this.searchhotel.arrchild;
          item.roomnumber= this.searchhotel.roomnumber;
          item.imageUrl = '';
          var checkInDate=new Date(this.searchhotel.CheckInDate);
          var checkOutDate=new Date(this.searchhotel.CheckOutDate);
          item.CheckInDate=this.searchhotel.CheckInDate
          item.CheckOutDate=this.searchhotel.CheckOutDate;
          item.checkInDate=moment(checkInDate).format('DD')+ ' '+ 'tháng' + ' ' +  moment(checkInDate).format('MM') +', ' +moment(checkInDate).format('YYYY')
          item.checkOutDate=moment(checkOutDate).format('DD')+ ' '+ 'tháng' + ' ' +  moment(checkOutDate).format('MM') +', ' +moment(checkOutDate).format('YYYY')
          item.id=this.gbitem.hotelId;
          item.name=this.gbitem.hotelName;
          item.isType=0;
          //this.arrHistory.push(item);
          this.gf.setCacheSearch(item,0);
            
          this.navCtrl.navigateForward('/hoteldetail/' + this.gbitem.hotelId);
            
          
         
          this.gf.googleAnalytion('main', 'Search', '' + this.input + '|' + this.cin + '|' + this.cout + '|' + this.gbitem.hotelId + '|' + this.gbitem.hotelName);
        } else {
          var cocheck = 0;
          if (this.recent) {
            for (let i = 0; i < this.recent.length; i++) {
              if (this.recent[i].RegionId == this.gbitem.regionId) {
                cocheck = 1;
                break;
              }
            }
            if (cocheck == 0) {
              var item3 = { Type: "2", HotelId: "", HotelName: "", RegionId: this.gbitem.regionId, RegionCode: this.gbitem.regionCode, regionName: this.gbitem.regionName, flag: "0", TotalHotels: this.gbitem.totalHotels };
              se.searchhotel.recent = [];

              if (this.recent.length > 1) {
                se.searchhotel.recent.push(this.recent[1]);
              } else {
                se.searchhotel.recent.push(this.recent[0]);
              }
              this.searchhotel.recent.push(item3);
              se.isrefresh = "true";
            }
          }
          else {
            var item3 = { Type: "2", HotelId: "", HotelName: "", RegionId: this.gbitem.regionId, RegionCode: this.gbitem.regionCode, regionName: this.gbitem.regionName, flag: "0", TotalHotels: this.gbitem.totalHotels };
            se.searchhotel.recent = [];
            this.searchhotel.recent.push(item3)
          }

          this.authService.region = this.gbitem.regionName;
          this.authService.regionid = this.gbitem.regionId;
          this.authService.regioncode = this.gbitem.regionCode;
          var obj = {
            regionName: this.authService.region,
            regionId: this.authService.regionid,
            regionCode: this.authService.regioncode
          }
          this.searchhotel.gbmsg = obj;

          var item: any ={};
          item.adult=this.searchhotel.adult;
          item.child=this.searchhotel.child;
          item.arrchild= this.searchhotel.arrchild;
          item.roomnumber= this.searchhotel.roomnumber;
          if(this.gbitem.imageUrl){
            item.imageUrl = (this.gbitem.imageUrl.toLocaleString().trim().indexOf("http") == -1) ? 'https:' + this.gbitem.imageUrl : this.gbitem.imageUrl;
          }
          else{
            item.imageUrl='';
          }
          var checkInDate=new Date(this.gf.getCinIsoDate(this.searchhotel.CheckInDate));
          var checkOutDate=new Date(this.gf.getCinIsoDate(this.searchhotel.CheckOutDate));
          item.CheckInDate=this.searchhotel.CheckInDate
          item.CheckOutDate=this.searchhotel.CheckOutDate;
          item.checkInDate=moment(checkInDate).format('DD')+ ' '+ 'tháng' + ' ' +  moment(checkInDate).format('MM') +', ' +moment(checkInDate).format('YYYY')
          item.checkOutDate=moment(checkOutDate).format('DD')+ ' '+ 'tháng' + ' ' +  moment(checkOutDate).format('MM') +', ' +moment(checkOutDate).format('YYYY')
          item.id=this.gbitem.regionId;
          item.name=this.gbitem.regionName;
          item.code = this.gbitem.regionCode;
          item.isType=1;
          this.searchhotel.objRecent = item;
          this.gf.setCacheSearch(item,0);
          //this.navCtrl.navigateForward('/hotellist/false/0');
          //this.navCtrl.navigateForward(['/app/tabs/hotellist/'+ se.isrefresh]);
          this.navCtrl.navigateForward('/hotellist/' + se.isrefresh);
          this.gf.googleAnalytion('main', 'Search', '' + this.authService.regioncode + '|' + this.input + '|' + this.cin + '|' + this.cout + '|' + this.gbitem.RegionCode);
        }
      }
      else if (this.co == 2) {
        if (this.gbmsg.type == 1) {
          var id1 = { id: this.gbmsg.hotelId };
          this.searchhotel.rootPage = "mainpage";
          this.searchhotel.gbitem.hotelId = this.gbmsg.hotelId;
          //this.navCtrl.navigateForward('/hoteldetail/'+id1);
          this.valueGlobal.notRefreshDetail = false;
          this.valueGlobal.logingoback = '/hoteldetail/' + id1;
          var item: any ={};
          item.adult=this.searchhotel.adult;
          item.child=this.searchhotel.child;
          item.arrchild= this.searchhotel.arrchild;
          item.roomnumber= this.searchhotel.roomnumber;
          item.imageUrl = '';
          var checkInDate=new Date(this.gf.getCinIsoDate(this.searchhotel.CheckInDate));
          var checkOutDate=new Date(this.gf.getCinIsoDate(this.searchhotel.CheckOutDate));
          item.CheckInDate=this.searchhotel.CheckInDate
          item.CheckOutDate=this.searchhotel.CheckOutDate;
          item.checkInDate=moment(checkInDate).format('DD')+ ' '+ 'tháng' + ' ' +  moment(checkInDate).format('MM') +', ' +moment(checkInDate).format('YYYY')
          item.checkOutDate=moment(checkOutDate).format('DD')+ ' '+ 'tháng' + ' ' +  moment(checkOutDate).format('MM') +', ' +moment(checkOutDate).format('YYYY')
          item.id=this.gbmsg.hotelId;
          item.name=this.gbmsg.hotelName;
          item.isType=0;
          //this.arrHistory.push(item);
          this.gf.setCacheSearch(item,0);
          this.navCtrl.navigateForward('/hoteldetail/' + id1);
          this.gf.googleAnalytion('main', 'Search', '' + this.input + '|' + this.cin + '|' + this.cout + '|' + this.gbitem.hotelId);
        } else {
          this.authService.region = this.gbmsg.regionName;
          this.authService.regionid = this.gbmsg.regionId;
          this.authService.regioncode = this.gbmsg.regionCode;
          for (let i = 0; i < this.recent.length; i++) {
            if (this.recent[i].RegionId == this.gbmsg.regionId) {
              cocheck = 1;
              break;
            }
          }
          if (cocheck == 0) {
            se.isrefresh = "true";
          }
          var item: any ={};
          item.adult=this.searchhotel.adult;
          item.child=this.searchhotel.child;
          item.arrchild= this.searchhotel.arrchild;
          item.roomnumber= this.searchhotel.roomnumber;
          if(this.gbmsg.imageUrl){
            item.imageUrl = (this.gbmsg.imageUrl.toLocaleString().trim().indexOf("http") == -1) ? 'https:' + this.gbmsg.imageUrl : this.gbmsg.imageUrl;
          }
          else{
            item.imageUrl='https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage-110x110.jpg';
          }
          var checkInDate=new Date(this.gf.getCinIsoDate(this.searchhotel.CheckInDate));
          var checkOutDate=new Date(this.gf.getCinIsoDate(this.searchhotel.CheckOutDate));
          item.CheckInDate=this.searchhotel.CheckInDate
          item.CheckOutDate=this.searchhotel.CheckOutDate;
          item.checkInDate=moment(checkInDate).format('DD')+ ' '+ 'tháng' + ' ' +  moment(checkInDate).format('MM') +', ' +moment(checkInDate).format('YYYY')
          item.checkOutDate=moment(checkOutDate).format('DD')+ ' '+ 'tháng' + ' ' +  moment(checkOutDate).format('MM') +', ' +moment(checkOutDate).format('YYYY')
          item.id=this.gbmsg.regionId;
          item.name=this.gbmsg.regionName;
          item.code = this.gbmsg.regionCode;
          item.isType=1;
          this.searchhotel.objRecent = item;
          this.gf.setCacheSearch(item,0);
          this.navCtrl.navigateForward('/hotellist/' + se.isrefresh);
          this.gf.googleAnalytion('main', 'Search', '' + (this.authService.regioncode ? this.authService.regioncode : this.gbmsg.RegionCode) + '|' + this.input + '|' + this.cin + '|' + this.cout);

        }
      }
      else if (this.input && !this.co) {
        this.input = "";
        this.navCtrl.navigateForward('/searchhotel/0/null');
      }
    }
    else {
      this.navCtrl.navigateForward('/searchhotel/0/null');
    }
  }
  deletetext() {
    this.input = "";
    this.ischeckclose = false;
    this.ischecklist = false;
  }


  ionViewDidLoad() {
    let elements = window.document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'flex';
      });
    }
  }

  ionViewWillEnter() {
    this.isConnected = this.networkProvider.isOnline();
    FCM.getToken().then(token => {
      this.storage.get('checktoken').then(checktoken => {
        if (!checktoken) {
          this.storage.set('checktoken',"1");
          //PDANH 19/07/2019: Push memberid & devicetoken
            this.gf.pushTokenAndMemberID("", token, this.appversion);
          }
      })
   
    });
    this.getShowNotice();
    this.valueGlobal.logingoback = '/app/tabs/tab1';
    if (this.valueGlobal.backValue == "homeflight") {
        setTimeout(() => {
          this.activeTab = 1;
          this.setActiveTab(1);
          this.valueGlobal.backValue = "";
        }, 100)
      
    } else if (this.valueGlobal.backValue == "flightmytrip") {
        setTimeout(() => {
          this.activeTab = 1;
          this.setActiveTab(1);
          this.flightService.itemMenuFlightClick.emit(2);
          //$(".div-wraper-slide").removeClass("cls-visible").addClass("cls-disabled");
        }, 100)
    }
    else if(this.valueGlobal.backValue == "hometicket" || this.valueGlobal.activeTab ==3) {
      this.setActiveTab(3);
    }
    else if(this.valueGlobal.activeTab ==1){
      this.setActiveTab(1);
    }
    else {
      this._mytripservice.rootPage = "homehotel";
      this.gf.clearActivatedTab();
      
      this.setActiveTab(0);
    }

    $(".homefood-header").removeClass("cls-visible").addClass("cls-disabled");
    this.searchhotel.backPage = "";
    
  }

  itemclickht(item) {
    if (!this.isConnected) {
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      return;
    }
    //this.searchhotel.CheckInDate = this.cin;
    //this.searchhotel.CheckOutDate = this.cout;
    this.searchhotel.child = this.child;
    this.searchhotel.adult = this.adult;
    this.searchhotel.roomnumber = this.roomnumber;
    this.searchhotel.hotelID = item.id;
    this.searchhotel.rootPage = "topdeal";
    this.valueGlobal.notRefreshDetail = false;

    //this.navCtrl.navigateForward('/hoteldetail/'+item.id);
    this.valueGlobal.logingoback = '/hoteldetail/' + item.id;

    var itemRecent: any ={};
    itemRecent.adult=this.searchhotel.adult;
    itemRecent.child=this.searchhotel.child;
    itemRecent.arrchild= this.searchhotel.arrchild;
    itemRecent.roomnumber= this.searchhotel.roomnumber;
    if(item.imageUrl){
      itemRecent.imageUrl = (item.imageUrl.toLocaleString().trim().indexOf("http") == -1) ? 'https:' + item.imageUrl : item.imageUrl;
    }
    // itemRecent.imageUrl = 'https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage-110x110.jpg';
    var checkInDate=new Date(this.gf.getCinIsoDate(this.searchhotel.CheckInDate));
    var checkOutDate=new Date(this.gf.getCinIsoDate(this.searchhotel.CheckOutDate));
    itemRecent.CheckInDate=this.searchhotel.CheckInDate;
    itemRecent.CheckOutDate=this.searchhotel.CheckOutDate;
    itemRecent.checkInDate=moment(checkInDate).format('DD')+ ' '+ 'tháng' + ' ' +  moment(checkInDate).format('MM') +', ' +moment(checkInDate).format('YYYY')
    itemRecent.checkOutDate=moment(checkOutDate).format('DD')+ ' '+ 'tháng' + ' ' +  moment(checkOutDate).format('MM') +', ' +moment(checkOutDate).format('YYYY')
    itemRecent.id=item.id;
    itemRecent.name=item.name;
    itemRecent.code = item.code;
    itemRecent.isType=0;
    //this.arrHistory.push(item);
    this.gf.setCacheSearch(itemRecent,0);
    this.navCtrl.navigateForward('/hoteldetail/' + item.id);
    //google analytic
  }
  itemSelectedmood(item) {
    this.valueGlobal.logingoback = '/hotellistmood/' + item.id + '/' + item.title;
    if (!this.isConnected) {
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      return;
    }
    
    var id1 = { id: item.id, title: item.title };
    //this.searchhotel.CheckInDate = this.cin;
    //this.searchhotel.CheckOutDate = this.cout;
    this.searchhotel.child = this.child;
    this.searchhotel.adult = this.adult;
    this.searchhotel.roomnumber = this.roomnumber;
    if(item.name == "Team X"){
      this.openWebpage('https://www.ivivu.com/teamx');
    }else if(item.name == 'voucher'){
      this.openWebpage('https://www.ivivu.com/voucher-du-lich');
    }else{
      setTimeout(()=>{
        this.navCtrl.navigateForward("/hotellistmood/" + item.id + "/" + item.title);
      },10)
    }
    //google analytic
    this.gf.googleAnalytion('hotellistmood', 'Search', item.id + '|' + item.title);
  }

  /**
   * Chuyển sang hotel list theo id vùng
   * @param item //item vùng
   */
  itemclickregion(item) {
    if (!this.isConnected) {
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      return;
    }
    //this.searchhotel.CheckInDate = this.cin;
    //this.searchhotel.CheckOutDate = this.cout;
    this.searchhotel.child = this.child;
    this.searchhotel.adult = this.adult;
    this.searchhotel.roomnumber = this.roomnumber;
    this.searchhotel.rootPage = "topregion";
    this.authService.region = item.name;
    this.authService.regionid = item.id;
    this.authService.regioncode = item.regionCode;
    this.searchhotel.location = "";
    this.searchhotel.chuoi = this.chuoi;
    this.searchhotel.isRecent=0;
    this.zone.run(() => {
      this.input = item.name;
      this.searchhotel.input = item.name;
    })
    //clear local
    this.searchhotel.local0check = false;
    this.searchhotel.local1check = false;
    this.searchhotel.local2check = false;
    this.searchhotel.local3check = false;
    this.searchhotel.local4check = false;
    this.searchhotel.local5check = false;
    this.searchhotel.local6check = false;
    this.searchhotel.local7check = false;
    this.searchhotel.local8check = false;
    this.searchhotel.local9check = false;
    this.searchhotel.local10check = false;
    this.searchhotel.local11check = false;
    this.searchhotel.local12check = false;
    this.searchhotel.local13check = false;
    this.searchhotel.local14check = false;
    this.searchhotel.local15check = false;
    this.searchhotel.local16check = false;
    this.searchhotel.local17check = false;
    this.searchhotel.local18check = false;
    this.searchhotel.local19check = false;
    this.searchhotel.location = "";
    var obj = {
      regionName: this.authService.region,
      regionId: this.authService.regionid,
      regionCode: this.authService.regioncode
    }
    this.searchhotel.gbmsg = obj;
    this.searchhotel.flag = 1;
    this.valueGlobal.logingoback = '/hotellist/true';

    var itemRecent: any ={};
        itemRecent.adult=this.searchhotel.adult;
        itemRecent.child=this.searchhotel.child;
        itemRecent.arrchild= this.searchhotel.arrchild;
        itemRecent.roomnumber= this.searchhotel.roomnumber;
        if(item.image){
          itemRecent.imageUrl = (item.image.toLocaleString().trim().indexOf("http") == -1) ? 'https:' + item.image : item.image;
        }
        var checkInDate=new Date(this.gf.getCinIsoDate(this.searchhotel.CheckInDate));
        var checkOutDate=new Date(this.gf.getCinIsoDate(this.searchhotel.CheckOutDate));
        itemRecent.CheckInDate=this.searchhotel.CheckInDate;
        itemRecent.CheckOutDate=this.searchhotel.CheckOutDate
        itemRecent.checkInDate=moment(checkInDate).format('DD')+ ' '+ 'tháng' + ' ' +  moment(checkInDate).format('MM') +', ' +moment(checkInDate).format('YYYY')
        itemRecent.checkOutDate=moment(checkOutDate).format('DD')+ ' '+ 'tháng' + ' ' +  moment(checkOutDate).format('MM') +', ' +moment(checkOutDate).format('YYYY')
        itemRecent.id=item.id;
        itemRecent.name=item.name;
        itemRecent.code = item.regionCode;
        itemRecent.isType=1;
        this.searchhotel.objRecent = itemRecent;
        this.gf.setCacheSearch(itemRecent,0);
          
  
    //this.navCtrl.navigateForward(['/app/tabs/hotellist/true']);
    this.navCtrl.navigateForward('/hotellist/false');
    //google analytic
    this.gf.googleAnalytion('topregion', 'Search', this.authService.regioncode);
  }
  public async showConfirm() {
    let alert = await this.alertCtrl.create({
      cssClass: "logocss",
      header: 'Bạn thích iVIVU.com?',
      message: 'Đánh giá ứng dụng trên CH Play',
      mode: "ios",
      buttons: [
        {
          text: 'Hủy',
          handler: () => {
          }
        },
        {
          text: 'Đánh giá',
          role: 'OK',
          // handler: () => {
          //   this.launchReview.launch()
          //     .then(() => console.log('Successfully launched store app'));
          // }
        }
      ]
    });
    alert.present();
    alert.onDidDismiss().then((data) => {
    })
  }
  share(url) {
    this.socialSharing.share('','','', url).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
  seemoreblog(value) {
    this.gf.setParams(value, 'seemoreblog');
    this.valueGlobal.backValue = 'blog';
    //this.valueGlobal.logingoback='/bloglist';
    this.navCtrl.navigateForward('/bloglist');
  }

  seemoredeal() {
    this.valueGlobal.backValue = 'topdeallist';
    //this.valueGlobal.logingoback='/topdeallist';
    this.navCtrl.navigateForward('/topdeallist');
  }

  scrollFunction(event) {
    var se = this;
    let el = window.document.getElementsByClassName('div-statusbar-float');
    if (el.length > 0) {
      if (event.detail.scrollTop > 100) {
        if (!el[0].classList.contains("float-statusbar-enabled")) {
          el[0].classList.add('float-statusbar-enabled');
          el[0].classList.remove('float-statusbar-disabled');
        }
      } else {
        el[0].classList.remove('float-statusbar-enabled');
        el[0].classList.add('float-statusbar-disabled');
      }
    }

    if (se.activeTab == 1) {
      let el = window.document.getElementsByClassName('div-flight-topdeal');
      let el1 = window.document.getElementsByClassName('div-flightinternational-topdeal');
      let elinter = $('.div-flightinternational-topdeal');
      let eluseful = window.document.getElementsByClassName('div-useful-title');
      if(el && el.length >0){
        if(event.detail.scrollTop >= 1300 ){
          if(elinter && elinter.length >0 && event.detail.scrollTop < $('.div-group-name')[0].offsetTop - 100){
            setTimeout(()=>{
              if(el.length >0 && el[0] && !el[0].classList.contains("cls-topdeal-float")){
                el[0].classList.add('cls-topdeal-float');
              }
            },100)
            
            // if(el1 && el1.length >0 && el1[0]){
            //   el1[0].classList.remove('cls-topdeal-float');
            // }
          }else{
            
              //el[0].classList.remove('cls-topdeal-float');
              //setTimeout(()=>{
                if(el1 && el1.length >0 && event.detail.scrollTop >= $('.div-group-name')[0].offsetTop ){
                
                    if(el1.length >0 && el1[0] && !el1[0].classList.contains("cls-topdeal-float")){
                      el1[0].classList.add('cls-topdeal-float');
                    }
                  
                }
                else if(el1 && el1[0] && el1.length >0 && event.detail.scrollTop < $('.div-group-name')[0].offsetTop -100){
                  el1[0].classList.remove('cls-topdeal-float');
                }
            //},100)
          }
         
        }else{
          if(el[0]){
            el[0].classList.remove('cls-topdeal-float');
          }
          if(el1[0]){
            el1[0].classList.remove('cls-topdeal-float');
          }
          
        }

      }else{
        if(el1 && el1.length >0 && event.detail.scrollTop >= 1200){
          if(el1.length >0 && el1[0] && !el1[0].classList.contains("cls-topdeal-float")){
            el1[0].classList.add('cls-topdeal-float');
          }
        }if(el1 && el1.length >0 && event.detail.scrollTop < 1200){
          el1[0].classList.remove('cls-topdeal-float');
        }
      }

      if(eluseful && eluseful.length >0){
        let h = 1100 + ($('.div-topdeal-flight')[0] ? $('.div-topdeal-flight')[0].offsetHeight : 0);
        if(event.detail.scrollTop >= h){
          if(eluseful.length >0 && !eluseful[0].classList.contains("cls-topdeal-float")){
            eluseful[0].classList.add('cls-topdeal-float');
          }
        }
        else{
          eluseful[0].classList.remove('cls-topdeal-float');
        }
      }
      
    }
  }

  doRefresh(event) {
    this.eventRefresh = event;
    if (this.activeTab == 1) {
      return;
    }
    if (this.networkProvider.isOffline()) {
      this.isConnected = false;
      this.gf.setReLoadValue(true);
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
    } else {
      this.loaddata();
      this.storage.remove("listblogtripdefault");
      this.storage.remove("listtopdealdefault");
      this.storage.remove("regionnamesuggest");
      this.onEnter();
      this.blogtrips = [];
      this.pageBlogTrip = 1;
      this.getNewsBlog(0);
      //this.getbloglike(0);
      this.gf.setParams(false, "resetBlogTrips");

      setTimeout(() => {
        event.target.complete();
        this.eventRefresh = null;
      }, 1000)

      this.flightService.itemFlightMytripRefresh.emit(1);
    }
  }

  // openExperienceMusttry(idx) {
  //   var se = this,
  //     regionCode = '';
  //   se.valueGlobal.backValue = 'experience';
  //   se.gf.setParams(regionCode, 'experiencesearch');
  //   se.searchhotel.ef_arrdistancecheck = [];
  //   se.searchhotel.ef_arrhoteltypecheck = [];
  //   se.searchhotel.ef_arrstylecheck = [];
  //   se.searchhotel.ef_arrlocalcheck = [];
  //   se.searchhotel.ef_arrhouropencheck = [];
  //   se.searchhotel.ef_arrhoteltypenamecheck = [];
  //   se.searchhotel.ef_arrdistancenamecheck = [];
  //   se.searchhotel.ef_arrlocalnamecheck = [];
  //   se.searchhotel.ef_arrhouropennamecheck = [];
  //   se.searchhotel.ef_arrsubregioncheck = [];
  //   se.searchhotel.ef_arrsubregionnamecheck = [];
  //   se.searchhotel.ef_arrstylenamecheck = [];
  //   se.searchhotel.ef_location = null;
  //   se.searchhotel.ef_hoteltype = null;
  //   se.searchhotel.ef_houropen = null;
  //   se.searchhotel.ef_style = null;
  //   se.searchhotel.ef_arrhoteltypecheck.push(idx);
  //   se.searchhotel.stringFilterName = se.getFilterName(idx);
  //   se.searchhotel.ef_arrhoteltypenamecheck.push(se.getFilterName(idx));
  //   se.searchhotel.inputExperienceItem = null;
  //   se.searchhotel.inputExperienceText = "";
  //   se.searchhotel.inputExperienceRegionCode = "";
  //   se.valueGlobal.logingoback = 'experiencesearch';
  //   se.navCtrl.navigateForward('/experiencesearch');
  // }

  getFilterName(type) {
    if (type == 3) {
      return "Ăn gì";
    }
    if (type == 6) {
      return "Xem gì";
    }
    if (type == 7) {
      return "Chơi gì";
    }
    if (type == 4) {
      return "Ở đâu";
    }
    if (type == 9) {
      return "Sống ảo";
    }
    if (type == 22) {
      return "Uống gì";
    }
  }

  getCalendarholidays() {
    var se = this;
    // var options = {
    //   method: 'GET',
    //   url: C.urls.baseUrl.urlMobile + '/api/Data/calendarholidays',
    //   timeout: 180000, maxAttempts: 5, retryDelay: 2000,
    // };
    // request(options, function (error, response, body) {
    //   se.valueGlobal.listlunar = [];
    //   var json = JSON.parse(body);
    //   se.valueGlobal.listlunar = json;
    //   se.cofdate = 0;
    //   se.cotdate = 0;
    //   se.bindlunar();
    //   for (let j = 0; j < se.valueGlobal.listlunar.length; j++) {
    //     se._daysConfig.push({
    //       date: se.valueGlobal.listlunar[j].date,
    //       subTitle: se.valueGlobal.listlunar[j].name,
    //       cssClass: 'lunarcalendar'
    //     })
    //   }

    // })
    let strUrl = C.urls.baseUrl.urlMobile + '/api/Data/calendarholidays';
    se.gf.RequestApi('GET', strUrl, {}, {}, 'Tab1', 'getCalendarholidays').then((data)=> {
      console.log(data);
      se.valueGlobal.listlunar = [];
      var json = data;
      se.valueGlobal.listlunar = json;
      se.cofdate = 0;
      se.cotdate = 0;
      se.bindlunar();
      for (let j = 0; j < se.valueGlobal.listlunar.length; j++) {
        se._daysConfig.push({
          date: se.valueGlobal.listlunar[j].date,
          subTitle: se.valueGlobal.listlunar[j].name,
          cssClass: 'lunarcalendar'
        })
      }
    })
  }
  checklunar(s) {
    return s.indexOf('Mùng') >= 0;
  }
  bindlunar() {
    var se = this;
    for (let i = 0; i < se.valueGlobal.listlunar.length; i++) {
      var checkdate = moment(se.valueGlobal.listlunar[i].date).format('YYYY-MM-DD');
      if (checkdate == se.cin) {
        se.cofdate = 1;
        if (se.valueGlobal.listlunar[i].isNameDisplay == 1) {
          var ischecklunar = se.checklunar(se.valueGlobal.listlunar[i].name);
          if (ischecklunar) {
            se.cinthu = se.valueGlobal.listlunar[i].name + ' ' + 'tết';
            se.searchhotel.cinthu = se.valueGlobal.listlunar[i].name + ' ' + 'tết';
          }
          else {
            se.cinthu = se.valueGlobal.listlunar[i].name;
            se.searchhotel.cinthu = se.valueGlobal.listlunar[i].name;
          }
        }
      }
      else {
        this.getDayName(this.datecin, this.datecout);
      }
      if (checkdate == se.cout) {
        se.cotdate = 1;
        if (se.valueGlobal.listlunar[i].isNameDisplay == 1) {
          var ischecklunar = se.checklunar(se.valueGlobal.listlunar[i].name);
          if (ischecklunar) {
            se.coutthu = se.valueGlobal.listlunar[i].name + ' ' + 'tết';
            se.searchhotel.coutthu = se.valueGlobal.listlunar[i].name + ' ' + 'tết';
          }
          else {
            se.coutthu = se.valueGlobal.listlunar[i].name;
            se.searchhotel.coutthu = se.valueGlobal.listlunar[i].name;
          }
        }
      }
      else {
        this.getDayName(this.datecin, this.datecout);
      }
    }
  }

  clickhotel() {
    this.activeTab = 1;
    this.tabhome = "hotel";
  }
  clickfood() {
    this.activeTab = 2;
    this.tabhome = "food";
  }
  onSlideChange() {
    //debugger
    var se = this;
    //se.slider?.nativeElement.getActiveIndex().then((currentIndex) => {
      let currentIndex = se.slider?.nativeElement.swiper.activeIndex;
      se.activeTab = currentIndex;
      se.setActiveTab(currentIndex);
    //})
  }

  setActiveTab(currentIndex) {
    this.activeTab = currentIndex;
    if ( currentIndex === 1 ) {//Flight
      this.valueGlobal.logingoback = "";
      this._mytripservice.rootPage = "homeflight";
      this.valueGlobal.activeTab=1;
      this.flightService.itemTabFlightFocus.emit(1);
        
    }
    else if (currentIndex === 2) {//Tour
      this._mytripservice.rootPage = "hometour";
      this.valueGlobal.logingoback = "";
      this.valueGlobal.ischeckFavourite='Tour';
      this.valueGlobal.activeTab=2;
      $(".div-wraper-home").removeClass("cls-disabled").addClass("cls-visible");
    }
    else if (currentIndex === 3) {//Ticket
      this._mytripservice.rootPage = "hometicket";
      this.valueGlobal.logingoback = "";
      this.valueGlobal.activeTab=3;
      this.flightService.itemTabFlightFocus.emit(1);
      this.storage.remove('TabHomeActive').then(() => {
        this.storage.set('TabHomeActive', 1);
      })
    } 
   
    else {
      this._mytripservice.rootPage = "homehotel";
      this.valueGlobal.ischeckFavourite='Hotel';
      this.valueGlobal.activeTab=0;
      $(".div-wraper-home").removeClass("cls-disabled").addClass("cls-visible");
    
     this.valueGlobal.backValue = "";
     this.loaddata();
    }
    this.gf.setActivatedTab(1);
  }
 
  //Địa chỉ các quận giao hàng
  getAddress() {
    var se = this;
    let url = C.urls.baseUrl.urlFood + "/api/FOAdmin/GetData";
    this.gf.RequestApi("GET", url, {}, {}, "", "").then((data) => {
      se.arrDistrict = [];
      se.arrCity = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].levelId == 1) {
          se.arrCity.push(data[i]);
        }
        if (data[i].levelId == 2) {
          se.arrDistrict.push(data[i]);
        }
      }
      //se.dataDist();
    })
  }
  // dataDist() {
  //   var se = this;
  //   se.foodService.district = [];
  //   for (let i = 0; i < se.arrCity.length; i++) {
  //     var item;
  //     var chuoi = "";
  //     if (se.foodService.district.length > 0) {
  //       var str = se.foodService.district[i - 1].namedist.length;
  //       se.foodService.district[i - 1].namedist = se.foodService.district[i - 1].namedist.slice(0, str - 2);
  //     }
  //     for (let j = 0; j < se.arrDistrict.length; j++) {
  //       if (se.arrCity[i].id == se.arrDistrict[j].parentId) {
  //         if (j == se.arrDistrict.length - 1) {
  //           chuoi = chuoi + se.arrDistrict[j].name;
  //         } else {
  //           chuoi = chuoi + se.arrDistrict[j].name + ', ';
  //         }
  //       }
  //     }
  //     item = { namecity: se.arrCity[i].name, namedist: chuoi };
  //     se.foodService.district.push(item);
  //   }
  // }

  async showDR() {

    let modal = await this.modalCtrl.create({
      component: SelectDateRangePage,
    });
    this.searchhotel.formChangeDate = 1;
    this.searchhotel.CheckInDate = this.cin;
    this.searchhotel.CheckOutDate = this.cout;
    modal.present();

  }

  renderCustomDayConfig() {
    this.addHeader();
    if (this._daysConfig && this._daysConfig.length > 0 && this.picker.ui.children && this.picker.ui.children.length > 0) {
      let containermain = this.picker.ui.children[0];
      let containermonth = containermain.children[0];
      for (let index = 0; index < containermonth.children.length; index++) {
        const monthitem = containermonth.children[index];
        if ($(monthitem).hasClass('month-item')) {
          let containerdays = monthitem.children[2];
          for (let index = 0; index < containerdays.children.length; index++) {
            const dayitem = containerdays.children[index];
            let mapconfig = this._daysConfig.filter((d) => { return dayitem.attributes.length > 0 && moment(d.date).diff(new Date(dayitem.attributes[1].value * 1), 'days') == 0 });
            if (mapconfig && mapconfig.length > 0) {
              $(monthitem).append("<div class='custom-dayconfig'>" + moment(mapconfig[0].date).format("DD/MM") + ": " + mapconfig[0].subTitle + "</div>")
            }
          }
        }

      }
    }
  }

  addHeader() {
    if ($('.container__months') && $('.container__months').length > 0) {
      let strHtml = "<div class='selectdaterange-header'><ion-row><ion-col class='col-header'><div class='d-flex'><div class='div-goback' (click)='goback()'><img class='header-img-back' src='./assets/imgs/ios-arrow-round-back-white.svg' ></div><div class='div-header-title'><div class='div-title'>Chọn ngày</div></div> </div></ion-col></ion-row></div>";
      $('.container__months').append(strHtml);

      $('.div-goback').on('click', () => {
        this.picker.hide();
      })
    }
  }
  getShowNotice() {
    var se = this;
    // var options = {
    //   'method': 'GET',
    //   'url': C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/getCovidNotify',
    //   'headers': {
    //   }
    // };
    // request(options, function (error, response) {
    //   if (error) throw new Error(error);
    //   var data = JSON.parse(response.body);
    //   se.isNotice = data.show;
    // });
    let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/getCovidNotify';
    se.gf.RequestApi('GET', strUrl, {}, {}, 'Tab1', 'getShowNotice').then((data)=> {
      se.isNotice = data.show;
    })
  }

  checkDefaultDateFocus() {
    var se = this;

    se.storage.get('cacheSearchHotelInfo').then((data) => {
      if (!data || (data && data.checkInDate && moment(this.gf.getCinIsoDate(data.checkInDate)).diff(moment(new Date(this.gf.getCinIsoDate(new Date()))), 'days') <= 0)) {
        se.storage.get('hasChangeDate').then((data) => {
          if (!data) {
            se.openPickupCalendar();
            se.allowclickcalendar = false;
            se.storage.set('hasChangeDate', true);
          }
        })
      }
    })
  }
  funcRecent(item) {
    this.searchhotel.isRecent=1;
    if (item.isType == 0) {
      this.searchhotel.rootPage = "mainpage";
      this.valueGlobal.notRefreshDetail = false;
      this.valueGlobal.logingoback = '/hoteldetail/' + item.id;
      this.searchhotel.hotelID = item.id;
      this.searchhotel.adult=item.adult;
      this.searchhotel.child=item.child;
      this.searchhotel.arrchild= item.arrchild;
      this.searchhotel.roomnumber= item.roomnumber;
      this.searchhotel.CheckInDate =  item.CheckInDate;
      this.searchhotel.CheckOutDate = item.CheckOutDate;
      this.searchhotel.objRecent=item;
      // item.CheckInDate='2022-01-10'
      // item.CheckOutDate='2022-01-12'
      let diffdate = moment(this.gf.getCinIsoDate(item.CheckInDate)).diff(moment(moment(new Date(this.gf.getCinIsoDate(new Date()))).format('YYYY-MM-DD')), 'days');
      if (item.CheckInDate && diffdate < 0) {
        this.newMethod(item);
      }
      this.navCtrl.navigateForward('/hoteldetail/' + item.id);
     

     
    } else if (item.isType == 1) {
      this.authService.region = item.name;
      this.authService.regionid = item.id;
      this.searchhotel.adult=item.adult;
      this.searchhotel.child=item.child;
      this.searchhotel.arrchild= item.arrchild;
      this.searchhotel.roomnumber= item.roomnumber;
      this.searchhotel.CheckInDate =  item.CheckInDate;
      this.searchhotel.CheckOutDate = item.CheckOutDate;
      this.searchhotel.objRecent=item;
      let diffdate = moment(this.gf.getCinIsoDate(item.CheckInDate)).diff(moment(moment(new Date(this.gf.getCinIsoDate(new Date()))).format('YYYY-MM-DD')), 'days');
      if (item.CheckInDate && diffdate < 0) {
        this.newMethod(item);
      }
      let obj = {
        regionName: item.name,
        regionId: item.id,
        regionCode: item.code
      };
      this.searchhotel.gbmsg = obj;
      this.navCtrl.navigateForward('/hotellist/' + this.isrefresh);
    
      
    // } else if (item.isType == 2) {
    //   this.navCtrl.navigateForward('/searchhotel/1/' + item.name + '');
    }
  }

  private newMethod(item: any) {
    this.cin = new Date(this.gf.getCinIsoDate(new Date()));
    var rescin = this.cin.setTime(this.cin.getTime() + (1 * 24 * 60 * 60 * 1000));
    var datein = new Date(this.gf.getCinIsoDate(rescin));
    this.cin = moment(datein).format("YYYY-MM-DD");
    this.cindisplay = moment(datein).format("DD-MM-YYYY");
    this.datecin = new Date(this.gf.getCinIsoDate(rescin));
    let diffdateCheckout = moment(item.CheckOutDate).diff(moment(item.CheckInDate), 'days');
    this.cout = new Date(this.gf.getCinIsoDate(new Date()));
    var res = this.cout.setTime(
      this.cout.getTime() + ((diffdateCheckout + 1) * 24 * 60 * 60 * 1000)
    );
    var date = new Date(this.gf.getCinIsoDate(res));
    this.cout = moment(date).format("YYYY-MM-DD");
    this.coutdisplay = moment(date).format("DD-MM-YYYY");
    this.datecout = new Date(this.gf.getCinIsoDate(res));

    this.searchhotel.CheckInDate = this.cin;
    this.searchhotel.CheckOutDate = this.cout;
    this.searchhotel.datecin = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckInDate));
    this.searchhotel.datecout = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckOutDate));
    this.searchhotel.cindisplay = moment(this.searchhotel.datecin).format("DD-MM-YYYY");
    this.searchhotel.coutdisplay = moment(this.searchhotel.datecout).format("DD-MM-YYYY");
    item.CheckInDate=this.searchhotel.CheckInDate;
    item.CheckOutDate=this.searchhotel.CheckOutDate;
    item.checkInDate=moment(this.searchhotel.datecin).format('DD')+ ' '+ 'tháng' + ' ' +  moment(this.searchhotel.datecin).format('MM') +', ' +moment(this.searchhotel.datecin).format('YYYY')
    item.checkOutDate=moment(this.searchhotel.datecout).format('DD')+ ' '+ 'tháng' + ' ' +  moment(this.searchhotel.datecout).format('MM') +', ' +moment(this.searchhotel.datecout).format('YYYY')
    this.gf.setCacheSearch(item,0);
  }

  gettopSale() {
    var se=this;
    let url = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/TopSale24hByHotel?hotelId=0';
    let  headers = {
          apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
          apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U',
        };
        se.gf.RequestApi('GET', url, headers, {}, 'hoteldetail', 'loadTopSale24h').then((data) => {
          if(data){
            se.topsale = se.gf.convertNumberToString(data.total);
          }
        })
  }

  scrollToDivShowMore(id){
    setTimeout(()=>{
      (window.document.getElementById(id) as any).scrollIntoView({ behavior: 'smooth', block: 'center'  });
    },100)
  }
}
