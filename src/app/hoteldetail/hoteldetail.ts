import { HotelreviewsimagePage } from './../hotelreviewsimage/hotelreviewsimage';
import { RequestCombo1Page } from './../requestcombo1/requestcombo1';
import { Booking, Bookcombo, ValueGlobal, SearchHotel, RoomInfo } from './../providers/book-service';

import * as moment from 'moment';
import { Component, ViewChild, NgZone, ElementRef, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { NavController, ModalController, ToastController, AlertController, LoadingController, Platform,  IonRouterOutlet, ActionSheetController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AuthService } from '../providers/auth-service';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { RequestComboPage } from '../requestcombo/requestcombo';
import jwt_decode from 'jwt-decode';
import { C } from './../providers/constants';
import { GlobalFunction, ActivityService } from './../providers/globalfunction';
import { DomSanitizer } from '@angular/platform-browser';
import { IonContent } from '@ionic/angular';
import { DepartureCalendarPage } from '../departurecalendar/departurecalendar';
import { OverlayEventDetail } from '@ionic/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { OccupancyPage } from 'src/app/occupancy/occupancy';
import * as $ from 'jquery';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { NetworkProvider } from '../network-provider.service';
import { Subscription } from 'rxjs';
import { SelectDateRangePage } from '../selectdaterange/selectdaterange.page';
import { MytripService } from '../providers/mytrip-service.service';
import { flightService } from '../providers/flightService';
import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';
import { RequestRoomPage } from '../requestroom/requestroom';
import { YoutubeVideoPlayer } from '@awesome-cordova-plugins/youtube-video-player/ngx';
import { HotelreviewsvideoPage } from '../hotelreviewsvideo/hotelreviewsvideo';

declare var google;
declare var infowindow;

import { hotelDetailService } from '../providers/hotelDetailService';
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hoteldetail',
  templateUrl: 'hoteldetail.html',
  styleUrls: ['hoteldetail.scss'],
})
export class HotelDetailPage implements OnInit {
  @Input('myScrollVanish') scrollArea;
  @ViewChild('scrollArea') content: IonContent;
  @ViewChild('mySlider') slider:  ElementRef | undefined;;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild(IonRouterOutlet) routerOutlets: IonRouterOutlet;
  mapGoogle: any;
  slideData:any = [];
  name;
  json;
  public jsonroom:any = [];
  jsonroom1;
  jsonroom2;
  AvgPoint; totalAdult;
  isAvgPoint = true;
  ischeckcbcar = false;
  ischeckcbfs = false;
  ischeckcbcarhide = false;
  Combos;
  numHotelReviews;
  public cin;
  public cout;
  public cincombo;
  public coutcombo;
  public guest = 2;
  public room1 = 1;
  public room = 1;
  dd; mm;
  selectOptions
  arrcombo; valueComboDetail:any = [];
  comboDetail: any;
  titlecombo;
  notecombo;
  Description;
  mon;
  arrroom :any= [];
  public isShown: boolean = false;
  isbtnseemore = true;
  isShow = false;
  HotelReviews;
  arrHotelReviews:any = [];
  HotelRelated;
  isheader = false;
  isheader1 = true;
  ischeckcombo;
  child1 = 0;
  child = 0;
  adults1 = 2;
  adults = 2;
  arrchild:any = [];
  arrchild1:any = [];
  arrchild2:any = [];
  numagesc1;
  numagesc2;
  numagesc3;
  numagesc4;
  numagesc5;
  HotelID:any = "377594";
  HotelIDLike = "";
  Longitude;
  Latitude;
  imgHotel;
  Address;
  duration;
  ischeckMaxAdults = true;
  RoomID;
  ComboDayNum; ischeckoutofroom; public ischeckbtnreset = false;
  public ischeckbtn = true;
  id1; showpopup = true;
  ischeckadults = true;
  ischeckchild = false;
  ischeckroom = false; ischeck = false;
  Chuoi; scrollTopvalue; indexroom; text; email; flag = 0; num = 0; roomvalue; HotelName; location; comboprice; cocombo = 0;
  lengthslide; coutslide = 1; datecin; datecout; cindisplay; coutdisplay; cindisplayhr; coutdisplayhr;
  alert: any;
  public comboDetailList:any = [];
  public hotelDetail:any = [];
  public objDetail: any;
  public hotelRoomClasses:any = [];
  public hotelMealTypes:any = [];
  public hotelMealTypesHidden:any = [];
  public hotelRooms;
  public loginuser = null;
  public comboid;
  public hotelname; hotelurl; hotelimg;
  public dataListLike:any = []; itemlike = false;
  public ListHotelRelatedPrice:any = [];
  public sendRequest = true;
  public hasComboRoom = false;
  public changedate = false;
  public combopriceontitle = 0;
  public penaltyItemSelected = -1;
  public hotelAvatar = null;
  public regionId = null;
  fs = false; fc = false; nm = false;
  //thêm comboxe
  fcbcar = false;
  public loadcomplete = false;
  public showroominfo = false;
  public loadpricecombodone = false;
  public warningMaxPax = '';
  warningCombofs = '';
  warningCombofsIP = '';
  public flashSaleEndDate: any;
  public dateRegex = /^\/Date\((d|-|.*)\)[\/|\\]$/;
  public loadmapdone = false;
  public isexit = false;
  public linkGoogleMap: any;
  public usermail = '';
  public formParam: any;
  public loader: any;
  private hidden: boolean = false;
  slideOpts = {
    zoom: false,
    loop: true,
    preloadImages: true,
    lazy: true
  };
  ischeckBOD = false;
  dateofcombo;
  allowbookcombofc = true; hotelcode = ''; allowbookcombofx = true;
  myCalendar: any;
  isConnected; ChildAgeTo;
  memberid: any;
  topsale24Total: any;
  seemoreroomdetailvalue = true;
  seemoreroomdetaillist:any = [];
  mealtypegrouplist:any = [];
  checkBODdone: boolean = false;
  public itemsSk = [1, 2];
  private subscription: Subscription; intervalID;
  arrMeal:any = []; checkcombocar = 0;
  includeInsurrance = 1;
  hasInsurrance: any;
  checkInsurranceFee;
  //InsurranceFee="77.000đ";
  InsurranceFee = "";
  SpecialNote: any;
  objInsurranceFee: any;
  objroomfsale: any = [];
  indexmeal;
  ListRoomClasses:any = [];
  arrimgreview:any = [];
  countimgrv: number;
  installmentPriceStr: any;
  ischeckwarn = false;
  ischeckcalendar = true;
  defaultImage = "./assets/imgs/demopic.svg";
  slideloaddone: boolean = false;
  listBOD: any;
  emptyroom = false;
  ExcludeVAT;
  PriceFor: any;
  roomCombo = '';
  comboDetailEndDate: any;
  loaddonecombo=false;
  isLoadingData: boolean;
  elementMealtype: any;
  indexMealTypeRates: any;
  arrroomFS: any[];
  ischeckUpgrade: boolean;
  textMSG: any;
  hotelRoomClassesFS: any;
  isShowPrice: boolean = true;
  isShowPriceHotel: boolean = true;
  youtubeId: any;
  trustedVideoUrl: any;
  callbackNote:any;
  checkOutOfRangeCombo: boolean=true;
  _hotelDetailContractPrice: Observable<any>;
  _hotelSuggestDaily: any;
  constructor(public toastCtrl: ToastController, private alertCtrl: AlertController, public zone: NgZone, public modalCtrl: ModalController, public navCtrl: NavController,
    private http: HttpClientModule, public loadingCtrl: LoadingController, public Roomif: RoomInfo,
    public booking: Booking, public storage: Storage, public authService: AuthService, public platform: Platform, public bookCombo: Bookcombo, public value: ValueGlobal, public searchhotel: SearchHotel, public valueGlobal: ValueGlobal, private socialSharing: SocialSharing,
    public gf: GlobalFunction, private sanitizer: DomSanitizer, public router: Router, public actionsheetCtrl: ActionSheetController,
    public network: Network,
    public networkProvider: NetworkProvider,
    private activeRoute: ActivatedRoute,
    public activityService: ActivityService,
    public _mytripservice: MytripService,
    private fb: Facebook,
    public _flightService: flightService,
    private youtube: YoutubeVideoPlayer,
    public _hotelDetailService: hotelDetailService) {
    this.platform.resume.subscribe(async () => {
      this.network.onConnect().subscribe(() => {
      this.subscription = this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd && (event.url.indexOf('/hoteldetail/') != -1) ) {
            let key = 'hoteldetail_' + this.HotelID;
            if((this.searchhotel.keySearchHotelDetail && this.searchhotel.keySearchHotelDetail != key) || !this.searchhotel.keySearchHotelDetail){
              this.searchhotel.keySearchHotelDetail = key;
              this.loaddata(true);
            }
          }
        })
      })
    })
  }
  getHotelSuggestDaily(value) {
    var se = this;
    let strUrl = C.urls.baseUrl.urlMobile + '/api/data/HotelSuggestDaily?hotelcode='+ (this.HotelID ? this.HotelID : this.booking.HotelId) + '&type='+value;
    // let  headers = {};
    //     se.gf.RequestApi('GET', url, headers, {}, 'hoteldetail', 'getHotelSuggestDaily').then((res) => {
    this._hotelSuggestDaily =  this._hotelDetailService.loadHotelSuggestDaily(strUrl).pipe(shareReplay());
    this._hotelSuggestDaily.subscribe((res:any) => {
          if (value) {
            // var promotionPackage : any;
            se.valueGlobal.notSuggestDailyCB=[];
            if (res.data) {
              se.valueGlobal.notSuggestDailyCB=res.data.notSuggestDaily;
            }
            se.getBOD('');
          }else{
            se.valueGlobal.dayhot=[]; 
            se.valueGlobal.notSuggestDaily=[];
            if (res.data) {
              se.valueGlobal.dayhot=res.data.promotionIsHot; 
              se.valueGlobal.notSuggestDaily=res.data.notSuggestDaily;
            }
          }
        })
  }
  public async ngOnInit(){
    var se = this;
    await se.onEnter();
    se.subscription = se.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd && (event.url === '/hoteldetail/'+se.HotelID) ) {
            se.onEnter();
        }
        if(event instanceof NavigationEnd && (event.url == '/app/tabs/hoteldetail' || event.url == '/' ) ){
          //Set activetab theo form cha
          if(se.searchhotel.rootPage == 'likepage'){
            se.gf.setActivatedTab(2);
          }else if(se.searchhotel.rootPage == 'combolist' || se.searchhotel.rootPage == 'MyTrip'){
            se.gf.setActivatedTab(3);
          }else{
            se.gf.setActivatedTab(1);
          }
        }
      });
    }

    public async onEnter(): Promise<void> {
      var se = this;
      //this.splashScreen.hide();
      se.storage.get('auth_token').then(auth_token => {
        se.loginuser = auth_token;
      });
      se.storage.get('email').then(email => {
        se.usermail = email;
      })
      //Sửa lại dấu = => == (lỗi back về main)
      if (se.searchhotel.rootPage == 'login') {
        if (se.fcbcar) {
          se.ischeckcbcarhide = true;
        }
        if (se.HotelIDLike) {
          se.likeItem();
        }
        else {
          se.updateLikeStatus();
        }
        se.searchhotel.rootPage ='';
        se.valueGlobal.notRefreshDetail = false;
        //se.loaddata();
      }
      //se.loaddata();
      // do your on enter page stuff here
      if (se.valueGlobal.backValue == 'flightcombo'
        && ((se.searchhotel.CheckInDate && new Date(se.cin).toLocaleDateString() != new Date(se.searchhotel.CheckInDate).toLocaleDateString())
          || se.searchhotel.CheckOutDate && new Date(se.cout).toLocaleDateString() != new Date(se.searchhotel.CheckOutDate).toLocaleDateString()
          || se.searchhotel.adult != se.adults || se.searchhotel.child != se.child)
      ) {
        se.storage.get('auth_token').then(auth_token => {
          se.loginuser = auth_token;
          se.valueGlobal.notRefreshDetail = false;
          se.loaddata(false);
        });
  
        se.valueGlobal.backValue = '';
      }
      if (se.valueGlobal.backValue == 'carcombo') {
        se.storage.get('auth_token').then(auth_token => {
          se.loginuser = auth_token;
          //se.loaddata();
        });
      }
      if (se.valueGlobal.backValue == 'popupinfobkg') {
        // se.mealtypegrouplist = [];
        // se.hotelRoomClasses = [];
        // se.hotelRoomClassesFS = [];
        // se.loadcomplete = false;
        // se.valueGlobal.notRefreshDetail = false;
  
        // se.setCacheHotel();
        // se.storage.get('auth_token').then(auth_token => {
        //   se.loginuser = auth_token;
        //   se.emptyroom = false;
        //   //se.loaddata();
        // });
      }
      //Set activetab theo form cha
      if (se.searchhotel.rootPage == 'likepage') {
        se.gf.setActivatedTab(2);
      } else if (se.searchhotel.rootPage == 'combolist' || se.searchhotel.rootPage == 'MyTrip') {
        se.gf.setActivatedTab(3);
      } else {
        se.gf.setActivatedTab(1);
      }
  
      se.searchhotel.itemChangeDate.subscribe((data) => {
        if (data && se.searchhotel.formChangeDate == 2) {
          se.selectedDate();
        }
      })
  
      if (se.slideData && se.slideData.length == 0) {
        //se.loaddata();
      }
      se.loadUserInfo();
    }
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setCacheHotel() {
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
    item.id=this.HotelID;
    item.name=this.hotelname;
    item.isType=0;
    item.imageUrl=this.hotelAvatar;
    this.gf.setCacheSearch(item,1);
  }

  selectedDate() {
    let se = this;
    se.zone.run(() => {
      if (se.searchhotel.CheckInDate && se.searchhotel.CheckOutDate) {
        se.cin = se.searchhotel.CheckInDate;
        se.cout = se.searchhotel.CheckOutDate;
        se.datecin = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckInDate));
        se.datecout = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
        se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
        se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');
        se.cindisplayhr = moment(se.datecin).format('DD/MM');
        se.coutdisplayhr = moment(se.datecout).format('DD/MM');
        let date1 = new Date(se.gf.getCinIsoDate(se.cin));
        let date2 = new Date(se.gf.getCinIsoDate(se.cout));
        let timeDiff = Math.abs(date2.getTime() - date1.getTime());
        se.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
      }

      se.gf.setCacheSearchHotelInfo({checkInDate: se.searchhotel.CheckInDate, checkOutDate: se.searchhotel.CheckOutDate, adult: se.searchhotel.adult, child: se.searchhotel.child, childAge: se.searchhotel.arrchild, roomNumber: se.searchhotel.roomnumber});
      se.storage.set('hasChangeDate', true);

      se.changedate = true;
      se.hasComboRoom = false;
      se.comboprice = se.combopriceontitle;
      se.showpopup = true;
      se.ischeck = true;
      se.guest = se.adults + (se.child ? se.child : 0);
      if (!se.guest) {
        se.guest = 2;
      }
      // if (se.comboid) {
      //   se.getDetailCombo(se.comboid);
      // }
      // se.getdata(false);

      
    })
  }

  async presentLoadingDetail() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }

  loaddata(isResume) {
    //this.HotelID = this.bookCombo.Hotelid;
    if(this.isLoadingData){
      this.isLoadingData = false;
      return;
    }
    this.storage.get('auth_token').then(auth_token => {
      this.loginuser = auth_token;
    });
    //this.value.logingoback = "HoteldetailPage";
    if (this.searchhotel.isRefreshDetail) {
      this.HotelID = this.searchhotel.hotelID ? this.searchhotel.hotelID : (this.searchhotel.gbitem ? this.searchhotel.gbitem.hotelId : this.searchhotel.hotelID);
      this.searchhotel.isRefreshDetail = false;
    } else {
      if (this.searchhotel.rootPage == "listpage" || this.searchhotel.rootPage == "topdeal" || this.searchhotel.rootPage == "listmood" || this.searchhotel.rootPage == "likepage" || this.searchhotel.rootPage == "MyTrip" || this.searchhotel.rootPage == "combolist" || this.searchhotel.rootPage == "topdeallist") {
        this.HotelID = this.searchhotel.hotelID;
      }
      else if (this.searchhotel.rootPage == "mainpage" || this.searchhotel.backPage == "roompaymentselect" || this.searchhotel.backPage == "roompaymentselect-ean") {
        //this.HotelID = (this.searchhotel.gbitem ? this.searchhotel.gbitem.HotelId : this.searchhotel.hotelID);
        //if(this.searchhotel.isRecent==1){
          this.HotelID=this.activeRoute.snapshot.paramMap.get('id');
        //}
      } else if (this.activeRoute.snapshot.paramMap.get('id')) {
        this.HotelID = this.activeRoute.snapshot.paramMap.get('id');
      }
    }
    // if (this.searchhotel.backPage == "roompaymentselect-ean"||this.searchhotel.backPage == "roompaymentselect") {
    //   this.HotelID  = this.booking.HotelId;
    // }
    //this.HotelID = searchhotel.hotelID;
    this.checkBODdone = false;
    this.hasComboRoom = false;
    this.location = this.bookCombo.location;
    if(this.searchhotel && this.searchhotel.CheckInDate){
      if (this.searchhotel.adult) {
        this.guest = this.searchhotel.adult + (this.searchhotel.child ? this.searchhotel.child : 0);
        this.adults = this.searchhotel.adult;
      }
      if (this.searchhotel.child == 0) {
        this.child = 0;
      }
      else {
        this.child = this.searchhotel.child;
      }
      if (this.searchhotel.roomnumber) {
        this.room = this.searchhotel.roomnumber;
      }
      this.arrchild = [];
      if (this.searchhotel.arrchild) {
        this.arrchild = this.searchhotel.arrchild;
      }
      this.totalAdult = this.adults
      for (let i = 0; i < this.arrchild.length; i++) {
        if (this.arrchild[i].numage >= 4) {
          this.totalAdult++;
        }
      }

      if (this.searchhotel.CheckInDate &&  moment(this.searchhotel.CheckInDate).diff(moment(moment(new Date()).format('YYYY-MM-DD')), 'days') >=0) {
        this.cin = this.searchhotel.CheckInDate;
        this.cout = this.searchhotel.CheckOutDate;
        this.datecin = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckInDate));
        this.datecout = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckOutDate));
        this.cindisplay = moment(this.datecin).format('DD-MM-YYYY');
        this.coutdisplay = moment(this.datecout).format('DD-MM-YYYY');

        this.cindisplayhr = moment(this.datecin).format('DD/MM');
        this.coutdisplayhr = moment(this.datecout).format('DD/MM');
        this.bookCombo.CheckInDate = this.searchhotel.CheckInDate;
        this.bookCombo.CheckOutDate = this.searchhotel.CheckOutDate;
      } else {
        this.cin = new Date(this.gf.getCinIsoDate(new Date()));
        var rescin = this.cin.setTime(this.cin.getTime() + (1 * 24 * 60 * 60 * 1000));
        var datein = new Date(this.gf.getCinIsoDate(rescin));
        this.cin = moment(datein).format('YYYY-MM-DD');
        this.cindisplay = moment(datein).format('DD-MM-YYYY');
        this.cindisplayhr = moment(datein).format('DD/MM');
        this.datecin = new Date(this.gf.getCinIsoDate(rescin));

        this.cout = new Date(this.gf.getCinIsoDate(new Date()));
        var res = this.cout.setTime(this.cout.getTime() + (2 * 24 * 60 * 60 * 1000));
        var date = new Date(this.gf.getCinIsoDate(res));
        this.cout = moment(date).format('YYYY-MM-DD');
        this.coutdisplay = moment(date).format('DD-MM-YYYY');
        this.coutdisplayhr = moment(date).format('DD/MM');
        this.datecout = new Date(this.gf.getCinIsoDate(res));
        this.searchhotel.CheckInDate = this.cin;
        this.searchhotel.CheckOutDate = this.cout;
      }
    }
    else{
      this.storage.get('cacheSearchHotelInfo').then((data) => {
        if(data && data.checkInDate && moment(data.checkInDate).diff(moment(moment(new Date()).format('YYYY-MM-DD')), 'days') >=0){
          if (data.adult) {
            this.guest = data.adult + (data.child ? data.child : 0);
            this.adults = data.adult;
          }
          if (data.child==0) {
            this.child = 0;
          }
          else{
            this.child = data.child;
          }
          if (data.roomNumber) {
            this.room = data.roomNumber;
          }
          this.arrchild=[];
          if (data.childAge) {
            this.arrchild = data.childAge;
          }
          this.totalAdult=this.adults
          for (let i = 0; i < this.arrchild.length; i++) {
            if (this.arrchild[i].numage >= 4) {
              this.totalAdult++;
            }
          }
  
          this.cin = data.checkInDate;
            this.cout = data.checkOutDate;
            this.datecin = new Date(this.gf.getCinIsoDate(data.checkInDate));
            this.datecout = new Date(this.gf.getCinIsoDate(data.checkOutDate));
            this.cindisplay = moment(this.datecin).format('DD-MM-YYYY');
            this.coutdisplay = moment(this.datecout).format('DD-MM-YYYY');
            this.cindisplayhr = moment(this.datecin).format('DD/MM');
            this.coutdisplayhr = moment(this.datecout).format('DD/MM');
            this.bookCombo.CheckInDate = data.checkInDate;
            this.bookCombo.CheckOutDate = data.checkOutDate;
        }else{
          this.cin = new Date(this.gf.getCinIsoDate(new Date()));
          var rescin = this.cin.setTime(this.cin.getTime() + (1*24 * 60 * 60 * 1000));
          var datein = new Date(this.gf.getCinIsoDate(rescin));
          this.cin = moment(datein).format('YYYY-MM-DD');
          this.cindisplay = moment(datein).format('DD-MM-YYYY');
          this.cindisplayhr = moment(datein).format('DD/MM');
          this.datecin = new Date(this.gf.getCinIsoDate(rescin));
    
          this.cout = new Date(this.gf.getCinIsoDate(new Date()));
          var res = this.cout.setTime(this.cout.getTime() + (2 * 24 * 60 * 60 * 1000));
          var date = new Date(this.gf.getCinIsoDate(res));
          this.cout = moment(date).format('YYYY-MM-DD');
          this.coutdisplay = moment(date).format('DD-MM-YYYY');
          this.coutdisplayhr = moment(date).format('DD/MM');
          this.datecout = new Date(this.gf.getCinIsoDate(res));
          this.searchhotel.CheckInDate = this.cin;
          this.searchhotel.CheckOutDate = this.cout;
        }
      })
    }
    this.gf.setCacheSearchHotelInfo({checkInDate: this.searchhotel.CheckInDate, checkOutDate: this.searchhotel.CheckOutDate, adult: this.searchhotel.adult, child: this.searchhotel.child, childAge: this.searchhotel.arrchild, roomNumber: this.searchhotel.roomnumber});
    
    var date1 = new Date(this.gf.getCinIsoDate(this.cin));
    var date2 = new Date(this.gf.getCinIsoDate(this.cout));
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    this.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.loadTopSale24h(null);
    if(!this.valueGlobal.notRefreshDetail || isResume){
      this.presentLoading();
    }
    
    //Load all image reviews
    this.loadHotelImageReviews();
    this.isLoadingData = false;
  }

  loadTopSale24h(id) {
    var se = this;
    let url = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/TopSale24hByHotel?hotelId=' + (id ? id : se.HotelID);
    let  headers = {
          apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
          apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U',
        };
        se.gf.RequestApi('GET', url, headers, {}, 'hoteldetail', 'loadTopSale24h').then((data) => {
          if(data){
            var res = data;
            se.topsale24Total = res.total;
          }
        })
  }

  // ionViewWillLeave() {
  //   this.searchhotel.isRefreshDetail = false;
  // }
  hidetopbar(){
    var se = this;
    let el = document.getElementsByClassName('div-statusbar-float');
      el[0].classList.remove('float-statusbar-enabled');
      el[0].classList.add('float-statusbar-disabled');
  }
  ionViewWillEnter() {
    //this.scrollToTop1();
    var se = this;
    //se.loaddata();
    se.hidetopbar();
    if(!se.valueGlobal.notRefreshDetail){
      se.zone.run(() => {
        se.loadpricecombodone = false;
        se.loadcomplete = false;
        se.emptyroom = false;
        se.hotelRoomClasses = [];
        se.hotelRoomClassesFS = [];
        se.flashSaleEndDate = null;
        se.allowbookcombofc = true;
        se.searchhotel.ischeckBOD = false;
        se.ischeckBOD = false;
        se.checkBODdone = false;
        se.mealtypegrouplist = [];
      });
      se.loaddata(false);

       //bind lại cin,cout khi đóng popup requestcombo
       if((se.searchhotel.CheckInDate && moment(new Date(se.cin)).format('DD-MM-YYYY') != moment(new Date(se.searchhotel.CheckInDate)).format('DD-MM-YYYY'))
       || se.searchhotel.CheckOutDate && moment(new Date(se.cout)).format('DD-MM-YYYY') != moment(new Date(se.searchhotel.CheckOutDate)).format('DD-MM-YYYY') ){
         se.zone.run(() => {
           se.loadpricecombodone = false;
           se.loadcomplete = false;
           se.emptyroom = false;
           se.hotelRoomClasses = [];
           se.hotelRoomClassesFS = [];
           se.flashSaleEndDate = null;
           se.allowbookcombofc = true;
           se.searchhotel.ischeckBOD = false;
           se.ischeckBOD = false;
           se.checkBODdone = false;
           // se.warningMaxPax="";
           //this.getDetailCombo(null);
           se.cin = se.searchhotel.CheckInDate;
           se.cout = se.searchhotel.CheckOutDate;
           se.datecin = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckInDate));
           se.datecout = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
           se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
           se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');
 
           se.cindisplayhr = moment(se.datecin).format('DD/MM');
           se.coutdisplayhr = moment(se.datecout).format('DD/MM');
           se.bookCombo.CheckInDate = moment(se.datecin).format('YYYY-MM-DD');
           se.bookCombo.CheckOutDate = moment(se.datecout).format('YYYY-MM-DD');
           se.changedate = true;
           se.hasComboRoom = false;
           se.comboprice = se.combopriceontitle;
           se.showpopup = true;
           se.ischeck = true;
           se.guest = se.adults + se.child;
           var date1 = new Date(se.gf.getCinIsoDate(this.cin));
           var date2 = new Date(se.gf.getCinIsoDate(this.cout));
           var timeDiff = Math.abs(date2.getTime() - date1.getTime());
           this.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
           //se.scrollToTopwithvalue1();
           if(se.comboid){
             se.getDetailCombo(se.comboid);
           }
           se.getdataroom();
           })
       }
    }else {
      //rollback lại dk search
      se.searchhotel.CheckInDate = se.cin;
      se.searchhotel.CheckOutDate = se.cout;
      se.searchhotel.adult = se.adults;
      se.searchhotel.child = se.child;
      se.searchhotel.arrchild = se.arrchild;

      se.datecin = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckInDate));
      se.datecout = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
      se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
      se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');
 
      se.cindisplayhr = moment(se.datecin).format('DD/MM');
      se.coutdisplayhr = moment(se.datecout).format('DD/MM');
      se.bookCombo.CheckInDate = moment(se.datecin).format('YYYY-MM-DD');
      se.bookCombo.CheckOutDate = moment(se.datecout).format('YYYY-MM-DD');
    }
    //se.presentLoadingDetail();
    se.storage.get('email').then(email => {
      se.usermail = email;
    })
    
   
     
  }

  closeModal() {
    //this.loadMap();
    var se = this;
    se.zone.run(() => {
      se.ischeck = true;
      se.showpopup = true;
      se.loadcomplete = true;
    });
    //se.content.scrollToTop(50);
  }
  public scrollFunction = (event: any) => {
    try {
      this.zone.run(() => {
        if (this.penaltyItemSelected != -1) {
          this.penaltyItemSelected = -1;
        }
      })
      // let el = window.document.getElementsByClassName('div-float-arrow');
      let elheader = window.document.getElementsByClassName('cls-header');
      if (event.detail.currentY > 505) {
        elheader[0].classList.add('float-arrow-enabled');
        elheader[0].classList.remove('float-arrow-disabled');
        if (elheader[1]) {
          elheader[1].classList.add('float-arrow-enabled');
          elheader[1].classList.remove('float-arrow-disabled');
        }
      }
      else {
        elheader[0].classList.add('float-arrow-disabled');
        elheader[0].classList.remove('float-arrow-enabled');
        if (elheader[1]) {
          elheader[1].classList.add('float-arrow-disabled');
          elheader[1].classList.remove('float-arrow-enabled');
        }
      }
      // if (el.length > 0) {
      //   if (event.detail.currentY === 0 && this.hidden) {
      //     el[0].classList.add('float-arrow-enabled');
      //     el[0].classList.remove('float-arrow-disabled');
      //     this.hidden = false;
      //   }
      //   else if (!this.hidden && event.detail.deltaY > 1) {
      //     el[0].classList.remove('float-arrow-enabled');
      //     el[0].classList.add('float-arrow-disabled');
      //     this.hidden = true;
      //   } else if (this.hidden && event.detail.deltaY < -1) {
      //     el[0].classList.add('float-arrow-enabled');
      //     el[0].classList.remove('float-arrow-disabled');
      //     this.hidden = false;
      //   }
      //   //console.log(event.detail.currentY)
      //   if (event.detail.currentY < 200) {
      //     el[0].classList.remove('float-arrow-enabled');
      //     el[0].classList.add('float-arrow-disabled');
      //     this.hidden = true;
      //   }
      // }
    } catch (error:any) {
      error.page = "hoteldetail";
      error.func = "scrollFunction";
      error.param = "";
      C.writeErrorLog(error, null);
    }

  }

  async openmnu() {
   
    this.searchhotel.CheckInDate = this.cin;
    this.searchhotel.CheckOutDate = this.cout;
    this.searchhotel.adult = this.adults;
    this.searchhotel.child = this.child;
    this.searchhotel.arrchild = this.arrchild;
    this.searchhotel.roomnumber = this.room;
    if(!this.loadcomplete){
      this.presentToastwarming('Giá đang được cập nhật, xin vui lòng đợi trong giây lát!');
      return;
    }
  
    const modal: HTMLIonModalElement =
    await this.modalCtrl.create({
      component: OccupancyPage,

    });
    this.allowbookcombofc = true;
    this.allowbookcombofx = true;
    this.gf.setParams(true,'requestcombo');
    modal.present();
  //this.navCtrl.navigateForward('/requestcombo');;

  modal.onDidDismiss().then((data: OverlayEventDetail) => {
    var se = this;
    if(data.data){
      se.setCacheHotel();
      //this.presentLoadingnotime();
          se.zone.run(() => {
            this.loadpricecombodone = false;
            this.loadcomplete = false;
            this.hotelRoomClasses = [];
            this.mealtypegrouplist = [];
            this.hotelRoomClassesFS = [];
            this.flashSaleEndDate = null;
            this.allowbookcombofc = true;
            this.allowbookcombofx = true;
            this.searchhotel.ischeckBOD = false;
            this.ischeckBOD = false;
            this.checkBODdone = false;
            this.emptyroom = true;
            this.searchhotel.ChildAgeTo = this.ChildAgeTo;

            if(se.searchhotel.adult){
              se.guest = se.searchhotel.adult + se.searchhotel.child;
              se.child = se.searchhotel.child;
              se.adults = se.searchhotel.adult;
              se.child = se.searchhotel.child;
            }else{
              se.guest = se.adults1 + se.child1;
              se.child = se.child1;
            }
  
            if(se.guest)
            
            if(se.searchhotel.roomnumber || se.room){
              se.room = se.searchhotel.roomnumber ? se.searchhotel.roomnumber : se.room;
              se.room1 = se.room;
            }else{
              se.room == se.room1;
            }
  
            se.arrchild = [];
            if(se.searchhotel.arrchild && se.searchhotel.arrchild.length >0){
              
              //se.this.arrchild2 = 
              for (let i = 0; i < se.searchhotel.arrchild.length; i++) {
                se.arrchild.push(se.searchhotel.arrchild[i]);
              }
            }
            se.totalAdult=se.adults
            for (let i = 0; i < se.arrchild.length; i++) {
              if (se.arrchild[i].numage >= 4) {
                se.totalAdult++;
              }
            }
            if (se.comboid) {
              se.getDetailCombo(se.comboid);
            }
            //se.getdataroom();
            se.checkPriceHotelDetail().then((check)=>{
              if(check){
                se.getdataroom();
              }else{
                se.hotelRoomClasses = [];
                se.hotelRoomClassesFS = [];
                se.emptyroom = true;
                se.ischeckoutofroom = false;
                se.loadcomplete = true;
                se.loadpricecombodone = true;
                se.ischeck = true;
                se.allowbookcombofc = false;
                se.allowbookcombofx = false;
                se.mealtypegrouplist = [];
              }
            });
          })
  
          se.searchhotel.publicChangeInfoHotelList(1);
    }
    
    })

  }
  done() {
    var se = this;
    se.room = se.room1;
    se.adults = se.adults1;
    se.child = se.child1
    se.arrchild = [];
    for (let i = 0; i < se.arrchild2.length; i++) {
      se.arrchild.push(se.arrchild2[i]);

    }
    se.searchhotel.adult = se.adults;
    se.searchhotel.child = se.child;
    se.searchhotel.roomnumber = se.room ? se.room : 1;
    se.searchhotel.arrchild = se.arrchild;

    se.zone.run(() => {
      se.ischeck = false;
      se.showpopup = true;
      se.isheader = false;
      se.guest = se.adults + se.child;
      if (!se.guest) {
        se.guest = 2;
      }
      se.scrollToTopwithvalue1();
    })


  }

  loadMap() {
    let posMaceio = { lat: this.Latitude, lng: this.Longitude }
    this.mapGoogle = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 12,
      center: posMaceio,
      mapTypeId: 'roadmap'
    });

    this.mapGoogle.setCenter(posMaceio);
    var latLng = new google.maps.LatLng(this.Latitude, this.Longitude);

    var marker = new google.maps.Marker({
      position: latLng,
      map: this.mapGoogle,
    });
    let se =this;
    google.maps.event.addListener(marker, 'click', function () {
      infowindow.open(se.mapGoogle, marker);
    });
    // // Create a map after the view is ready and the native platform is ready.
    //   this.map = GoogleMaps.create('map_canvas');
    // this.map.clear();

    // var lat = this.Latitude;
    // var lng = this.Longitude
    // // Get the location of you

    // // Move the map camera to the location with animation
    // this.map.animateCamera({
    //   target: {
    //     lat: this.Latitude,
    //     lng: this.Longitude
    //   },
    //   zoom: 12,
    //   tilt: 30
    // })
    //   .then(() => {
    //     // add a marker
    //     let marker: Marker = this.map.addMarkerSync({
    //       position: {
    //         lat: this.Latitude,
    //         lng: this.Longitude
    //       },
    //       animation: GoogleMapsAnimation.BOUNCE
    //     });
    //     // show the infoWindow
    //     marker.showInfoWindow();
    //     //this.loadmapdone = true;
    //   }).catch(error=>{
    //     error.page = "hoteldetail";
    //     error.func = "loadMap";
    //     C.writeErrorLog(error,response);
    //   });

    // if (this.flag == 1) {
    //   this.scrollToTop1();
    // }
  }

  doInfinite(infiniteScroll) {

    this.isShown = true;
    infiniteScroll.complete();

  }

  scrollToTop() {


    //this.isShown = false;
    this.content.scrollToTop(500);
    //this.isheader = false;




    // TOTAL CONTENT SIZE
    //this.isShown = screenSize - bottomPosition >= 10 ? true : false;
    //alert(this.isShown);
  }
  scrollToTopwithvalue() {
    this.zone.run(() => {
      this.isShown = false;
      this.content.scrollToTop(50);
      this.isheader = false;
    })
  }
  scrollToTopwithvalue1() {
    this.zone.run(() => {
      this.isShown = false;
      this.content.scrollToTop(50);
      this.isheader = false;
      this.presentLoading();
    })
  }
  scrollToTop1() {
    this.zone.run(() => {
      this.isShown = false;
      this.content.scrollToTop(50);
      this.isheader = false;
    })
    // TOTAL CONTENT SIZE
    //this.isShown = screenSize - bottomPosition >= 10 ? true : false;
    //alert(this.isShown);
  }
  strip_html_tags(str) {
    if ((str === null) || (str === ''))
      return false;
    else
      str = str.toString();
    return str.replace(/<[^>]*>/g, '');
  }
  presentLoading() {
    var se = this;
    
    se.getdata(false);
  }

  loadHotelDetailFromItemRelate() {
    var se = this;
    se.getdata(false);
  }
  //Thêm hàm getBOD()
  getBOD(roomid) {
    var se = this;
    this.ischeckBOD = false;
    let arrBOD= se.valueGlobal.notSuggestDailyCB;
    if (arrBOD && arrBOD.length>0) {
        var checkcintemp = new Date(se.gf.getCinIsoDate(se.cin));
        var checkdatecout = new Date(se.gf.getCinIsoDate(se.cout));
        var checkcin=moment(checkcintemp).format('YYYYMMDD');
        var checkcout=moment(checkdatecout).format('YYYYMMDD');

        let objcheckbod = arrBOD.filter((bod) => { return checkcin<= moment(bod).format('YYYYMMDD') && moment(bod).format('YYYYMMDD') <checkcout });
        if(objcheckbod && objcheckbod.length >0){
          se.ischeckBOD=true;
        }
    }
    se.zone.run(()=>{
      se.checkBODdone = true;
    })
    
  }
  async getdataRefresh() {
    var se = this;
    se.zone.run(() => {
      se.getdata(false);
    })

  }
  async getdata(isloaddata) {
    var se = this;
    se.storage.get('hoteldetail_' + se.HotelID+"_"+se.cindisplay+"_"+se.coutdisplay).then((data) => {
      if(data){
        se.hotelcode = data.Code;
         //Gọi hàm load thông tin detail
         se.loadHotelDetail(data, isloaddata);
      }else{
        let url = C.urls.baseUrl.urlPost + "/mhoteldetail/" + (this.HotelID ? this.HotelID : this.booking.HotelId);//+ (se.memberid ? '&memberid='+se.memberid : '')
        se.gf.RequestApi('POST', url, {}, {}, 'hoteldetail', 'getdata').then((data) => {
          if(data){
                  let jsondata = data;
                  //Có cache thì xóa đi load mới nhất
                  se.storage.get('hoteldetail_' + se.HotelID + "_" + se.cindisplay + "_" + se.coutdisplay).then((data) => {
                    if (data) {
                      se.storage.remove('hoteldetail_' + se.HotelID + "_" + se.cindisplay + "_" + se.coutdisplay).then((s) => {
                        se.storage.set('hoteldetail_' + se.HotelID + "_" + se.cindisplay + "_" + se.coutdisplay, jsondata);
                      })
                    } else {
                      se.storage.set('hoteldetail_' + se.HotelID + "_" + se.cindisplay + "_" + se.coutdisplay, jsondata);
                    }
                  })
                  //Gọi hàm load thông tin detail
                  se.loadHotelDetail(jsondata, isloaddata);
                  
                  if (!isloaddata) {
                    se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_SEARCHED, {
                      'fb_content_type': 'hotel', 'fb_content_id': jsondata.Code,
                      'city': jsondata.Province ? jsondata.Province : se.searchhotel.OriginalCity, 'region': jsondata.District, 'country': 'Viet Nam', 'checkin_date': se.searchhotel.CheckInDate, 'checkout_date ': se.searchhotel.CheckOutDate, 'num_adults': se.searchhotel.adult, 'num_children': (se.searchhotel.child ? se.searchhotel.child : 0)
                    });
          
                    se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_VIEWED_CONTENT, {
                      'fb_content_type': 'hotel', 'fb_content_id': jsondata.Code,
                      'city': jsondata.Province ? jsondata.Province : se.searchhotel.OriginalCity, 'region': jsondata.District, 'country': 'Viet Nam', 'checkin_date': se.searchhotel.CheckInDate, 'checkout_date ': se.searchhotel.CheckOutDate, 'num_adults': se.searchhotel.adult, 'num_children': (se.searchhotel.child ? se.searchhotel.child : 0)
                    });
                  }
                
          } else {
            if (se.loader) {
              se.loader.dismiss();
            }
          }
        })
      }
    })
  }

  async loadHotelDetail(jsondata, isloaddata) {
    var se = this;
    se.valueGlobal.dayhot=[]; 
    se.valueGlobal.notSuggestDaily=[];
    se.valueGlobal.notSuggestDailyCB=[];
    if (jsondata && jsondata.IsExtranet) {
      se.getHotelSuggestDaily('');
    }
    se.hotelcode = jsondata.Code;
    se.ChildAgeTo = jsondata.ChildAgeTo;
    //google analytic
    se.gf.googleAnalytion('hoteldetail', 'Search', jsondata.Code + '|' + se.cin + '|' + se.cout);
    se.updateLikeStatus();
    if (jsondata.Combos) {
      se.valueGlobal.titlecombo = jsondata.Combos.MiniTitle;
    }
    se.objDetail = jsondata;
    se.hotelDetail = [];
    se.hotelDetail.push(jsondata);
    se.hotelDetail = se.hotelDetail[0];
    se.hotelname = jsondata.Name;
    se.searchhotel.hotelName = se.hotelname;
    se.hotelurl = "https://www.ivivu.com" + jsondata.Url;
    let link = "https://maps.google.com/maps?q=" + se.hotelname + "&hl=es;z=14&amp&output=embed";
    se.linkGoogleMap = se.sanitizer.bypassSecurityTrustResourceUrl(link);
    //se.hotelAvatar = "https:" + jsondata.Avatar;
    se.hotelAvatar = (jsondata.Avatar.toLocaleString().trim().indexOf("http") != -1) ? jsondata.Avatar : 'https:' + jsondata.Avatar;
    se.regionId = jsondata.RegionId;
    se.bookCombo.HotelLink = se.hotelurl;
    se.bookCombo.Avatar = se.hotelAvatar;
    se.bookCombo.RegionId = se.regionId;
    se.bookCombo.HotelName = se.hotelname;
    se.bookCombo.Hotelid = se.HotelID;
    se.isShowPriceHotel = jsondata.IsShowPrice !=2;//=2 ks luôn ẩn giá; 0 - ẩn giá trong ngày
    se.booking.CheckinTime = jsondata.CheckinTime;
    se.booking.CheckoutTime = jsondata.CheckoutTime;
    se.id1 = { id: se.HotelID };
    if(jsondata.Youtube){
      se.youtubeId = jsondata.Youtube;
      se.trustedVideoUrl = se.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+se.youtubeId);
    }
    if (!isloaddata) {
      if (jsondata.HotelImages.length > 0) {
        se.slideData = jsondata.HotelImages;
        for (let index = 0; index < se.slideData.length; index++) {
          if (index == 0) {
            se.imgHotel = (se.slideData[index].LinkImage.toLocaleString().trim().indexOf("http") != -1) ? se.slideData[index].LinkImage : 'https:' + se.slideData[index].LinkImage;
          }
          //pdanh 27/09/2023: Thêm case fix hình webp ko hiển thị được
          if(se.slideData[index].LinkImage && se.slideData[index].LinkImage.indexOf('1024x768.webp') != -1){
            se.slideData[index].LinkImage = se.slideData[index].LinkImage.replace('1024x768.webp', '1024x768-1024x768.webp');
          }
          else if(se.slideData[index].LinkImage && se.slideData[index].LinkImage.indexOf('768x576.webp') != -1){
            se.slideData[index].LinkImage = se.slideData[index].LinkImage.replace('768x576.webp', '768x576-768x576.webp');
          }
          else if(se.slideData[index].LinkImage && se.slideData[index].LinkImage.indexOf('346x260.webp') != -1){
            se.slideData[index].LinkImage = se.slideData[index].LinkImage.replace('346x260.webp', '346x260-346x260.webp');
          }
          se.slideData[index].LinkImage = (se.slideData[index].LinkImage.toLocaleString().trim().indexOf("http") == -1) ? 'https:' + se.slideData[index].LinkImage : se.slideData[index].LinkImage;
          se.slideData[index].ImageUrl = (se.slideData[index].LinkImage.toLocaleString().trim().indexOf("http") == -1) ? 'https:' + se.slideData[index].LinkImage : se.slideData[index].LinkImage;
        }
        se.ischeck = true;
      }
      else {
        var item = { LinkImage: jsondata.Avatar, ImageUrl: jsondata.Avatar }
        se.slideData.push(item);
      }
    } else {
      se.slideData = [];
      se.slideData = jsondata.HotelImages;
      for (let index = 0; index < se.slideData.length; index++) {
        if (index == 0) {
          se.imgHotel = (se.slideData[index].LinkImage.toLocaleString().trim().indexOf("http") != -1) ? se.slideData[index].LinkImage : 'https:' + se.slideData[index].LinkImage;
        }
        se.slideData[index].LinkImage = (se.slideData[index].LinkImage.toLocaleString().trim().indexOf("http") == -1) ? 'https:' + se.slideData[index].LinkImage : se.slideData[index].LinkImage;
        se.slideData[index].ImageUrl = (se.slideData[index].LinkImage.toLocaleString().trim().indexOf("http") == -1) ? 'https:' + se.slideData[index].LinkImage : se.slideData[index].LinkImage;
      }
      se.ischeck = true;
    }

    if (se.slideData && se.slideData.length > 0) {
      se.ischeck = true;
      se.slideloaddone = true;
      se.clearBlurEffect();

      se.zone.run(() => se.slideData.sort(function (a, b) {
        return a['SortOrder'] - b['SortOrder'];
      }))
    }
    se.setCacheHotel();
    se.lengthslide = se.slideData.length;
    
    se.searchhotel.gaHotelDetail = {...jsondata};
    se.searchhotel.gaHotelDetail.RatingValue = se.searchhotel.gaHotelDetail.Rating/10;

      if((se.searchhotel.keySearchHotelDetail && se.searchhotel.keySearchHotelDetail != 'hoteldetail_' + se.HotelID) || !se.searchhotel.keySearchHotelDetail){
        se.searchhotel.keySearchHotelDetail = 'hoteldetail_' + se.HotelID;
        se.searchhotel.gaHotelId = jsondata.Code;
        se.gf.logEventFirebase('',se.searchhotel, 'hoteldetail', 'view_item', 'Hotels');
      }

    se.name = jsondata.Name;
    se.json = jsondata.Rating;
    se.AvgPoint = jsondata.AvgPoint;
    if (se.AvgPoint && se.AvgPoint.toString().length == 1) {
      se.AvgPoint = se.AvgPoint + ".0";
    }
    se.Latitude = jsondata.Latitude;
    se.Longitude = jsondata.Longitude;
    se.Address = jsondata.Address;
    se.ExcludeVAT = jsondata.ExcludeVAT;
    se.ischeckcombo = false;

    if (se.content && se.searchhotel.isRefreshDetail) {
      se.content.scrollToTop(300);
    }
    if (jsondata.Combos) {
      se.sendRequest = false;
      se.ischeckcombo = true;

    }
    var checkLoadCombo = false;
    if (jsondata.ComboPromtion || jsondata.Combos) {
      se.nm = (jsondata.ComboPromtion && jsondata.ComboPromtion.Description && jsondata.ComboPromtion.Title);
      se.sendRequest = false;
      se.cocombo = 1;
      se.titlecombo = jsondata.ComboPromtion && jsondata.ComboPromtion.Title ? jsondata.ComboPromtion.Title : (jsondata.Combos ? jsondata.Combos.Title : '');
      se.notecombo = jsondata.ComboPromtion && jsondata.ComboPromtion.Note ? (jsondata.ComboPromtion.Note || '') : (jsondata.Combos ? jsondata.Combos.Note : '');
      se.combopriceontitle = jsondata.ComboPromtion && jsondata.ComboPromtion.Description ? jsondata.ComboPromtion.Price : (jsondata.Combos ? jsondata.Combos.Price : '');
      se.comboprice = jsondata.ComboPromtion && jsondata.ComboPromtion.Description ? jsondata.ComboPromtion.Price : (jsondata.Combos ? jsondata.Combos.Price : '');
      if (jsondata.Combos) {
        se.PriceFor = jsondata.Combos.PriceFor;
        se.SpecialNote = jsondata.Combos.SpecialNote ? jsondata.Combos.SpecialNote.replace(/\r\n/g, "") : "";
      }
      se.Description = jsondata.ComboPromtion && jsondata.ComboPromtion.Description ? jsondata.ComboPromtion.Description.replace(/\r\n/g, "<br/>") : (jsondata.Combos ? jsondata.Combos.Description.replace(/\r\n/g, "<br/>") : '');
      se.Description = se.Description.replace("Trọn gói bao gồm:", "");
      se.Description = se.Description.replace(/#r/g, "");
      se.Description = se.Description.replace(/r#/g, "");
      se.Description = se.Description.replace(/#m/g, "");
      se.Description = se.Description.replace(/m#/g, "");
      se.Description = se.Description.replace(/#n/g, "");
      se.Description = se.Description.replace(/n#/g, "");
      se.ischeckcombo = true;
      se.ComboDayNum = jsondata.Combos ? jsondata.Combos.ComboDayNum : 1;
      se.bookCombo.tolocation = jsondata.Combos ? jsondata.Combos.ArrivalCode : '';
      se.valueComboDetail = [];
      if (jsondata.ComboPromtion && jsondata.ComboPromtion.Id) {
        se.comboid = jsondata.ComboPromtion.Id;
      }
      if (jsondata.Combos && jsondata.Combos.ComboDetail) {
        se.comboid = jsondata.Combos.Id;
        checkLoadCombo = await se.getDetailCombo(jsondata.Combos.Id);
      }

    }
    //Không có description thì ẩn nội dung combo
    if ((jsondata.ComboPromtion && !jsondata.ComboPromtion.Description && !jsondata.Combos) || (!jsondata.ComboPromtion && jsondata.Combos && !jsondata.Combos.Description)) {
      se.ischeckcombo = false;
    }

    se.HotelReviews = jsondata.HotelReviews;
    se.HotelRelated = jsondata.HotelRelated;
    for (let index = 0; index < se.HotelRelated.length; index++) {
      //se.HotelRelated[index].Avatar = 'https:' + se.HotelRelated[index].Avatar;
      if (se.HotelRelated[index].Avatar) {
        se.HotelRelated[index].Avatar = (se.HotelRelated[index].Avatar.toLocaleString().trim().indexOf("http") != -1) ? se.HotelRelated[index].Avatar : 'https:' + se.HotelRelated[index].Avatar;
      }
      else {
        se.HotelRelated[index].Avatar = "https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage-104x110.png";
      }

      switch (se.HotelRelated[index].Rating) {
        case 50:
          se.HotelRelated[index].Rating = "./assets/star/ic_star_5.svg";
          se.booking.RatingHotel = se.HotelRelated[index].Rating;
          break;
        case 45:
          se.HotelRelated[index].Rating = "./assets/star/ic_star_4.5.svg";
          se.booking.RatingHotel = se.HotelRelated[index].Rating;
          break;
        case 40:
          se.HotelRelated[index].Rating = "./assets/star/ic_star_4.svg";
          se.booking.RatingHotel = se.HotelRelated[index].Rating;
          break;
        case 35:
          se.HotelRelated[index].Rating = "./assets/star/ic_star_3.5.svg";
          se.booking.RatingHotel = se.HotelRelated[index].Rating;
          break;
        case 30:
          se.HotelRelated[index].Rating = "./assets/star/ic_star_3.svg";
          se.booking.RatingHotel = se.HotelRelated[index].Rating;
          break;
        case 25:
          se.HotelRelated[index].Rating = "./assets/star/ic_star_2.5.svg";
          se.booking.RatingHotel = se.HotelRelated[index].Rating;
          break;
        case 20:
          se.HotelRelated[index].Rating = "./assets/star/ic_star_2.svg";
          se.booking.RatingHotel = se.HotelRelated[index].Rating;
          break;
        case 15:
          se.HotelRelated[index].Rating = "./assets/star/ic_star_1.5.svg";
          se.booking.RatingHotel = se.HotelRelated[index].Rating;
          break;
        case 10:
          se.HotelRelated[index].Rating = "./assets/star/ic_star_1.svg";
          se.booking.RatingHotel = se.HotelRelated[index].Rating;
          break;
        case 5:
          se.HotelRelated[index].Rating = "./assets/star/ic_star_0.5.svg";
          se.booking.RatingHotel = se.HotelRelated[index].Rating;
          break;
        default:
          break;
      }
      se.booking.RatingHotel = se.HotelRelated[index].Rating;

    }
    //se.getPriceHotelRelated();
    se.numHotelReviews = jsondata.NumOfReview;
    se.arrHotelReviews = [];
    if (se.numHotelReviews > 0) {
      if (se.numHotelReviews < 3) {
        se.HotelReviews[0].DateStayed = moment(se.HotelReviews[0].DateStayed).format('DD-MM-YYYY');
        se.arrHotelReviews.push(se.HotelReviews[0]);
      }
      else {
        for (let index = 0; index < 3; index++) {
          if(se.HotelReviews[index] && se.HotelReviews[index].DateStayed){
            if(se.HotelReviews[index] && moment(se.HotelReviews[index].DateStayed).format('DD-MM-YYYY') != "Invalid date"){
              se.HotelReviews[index].DateStayed = moment(se.HotelReviews[index].DateStayed).format('DD-MM-YYYY');
            }else{
              se.HotelReviews[index].DateStayed = se.HotelReviews[index].DateStayed;
            }
          }
          if(se.HotelReviews[index] && se.HotelReviews[index].ReviewPoint){
            se.HotelReviews[index].ReviewPoint = Math.round(se.HotelReviews[index].ReviewPoint * 100) / 100;
            se.arrHotelReviews.push(se.HotelReviews[index]);
          }
        }
      }
    }



    switch (se.json) {
      case 50:
        se.json = "./assets/star/ic_star_5.svg";
        break;
      case 45:
        se.json = "./assets/star/ic_star_4.5.svg";
        break;
      case 40:
        se.json = "./assets/star/ic_star_4.svg";
        break;
      case 35:
        se.json = "./assets/star/ic_star_3.5.svg";
        break;
      case 30:
        se.json = "./assets/star/ic_star_3.svg";
        break;
      case 25:
        se.json = "./assets/star/ic_star_2.5.svg";
        break;
      case 20:
        se.json = "./assets/star/ic_star_2.svg";
        break;
      case 15:
        se.json = "./assets/star/ic_star_1.5.svg";
        break;
      case 10:
        se.json = "./assets/star/ic_star_1.svg";
        break;
      case 5:
        se.json = "./assets/star/ic_star_0.5.svg";
        break;
      default:
        break;
    }
    se.bookCombo.isshuttlebus = jsondata.HotelPolicies.filter(item => {
      return item.Key=='Lịch trình Shuttle Bus'});
    if (se.loader) {
      se.loader.dismiss();
    }
    if(!isloaddata){
      if(checkLoadCombo){
        let strchildage = se.searchhotel.arrchild && se.searchhotel.arrchild.length >0 ? se.searchhotel.arrchild.map(c => c.numage).join('_') : '';
        let key = se.HotelID.toString() +"_"+se.cin.toString()+"_"+se.cout.toString()+"_"+se.adults.toString()+"_" + (se.child ? se.child.toString() : "0")+se.room+"_"+strchildage;
        if(se.activityService.HotelSearchReqContract && se.activityService.HotelSearchReqContract.id == key && se.activityService.HotelSearchReqContract.value){
          let check = se.activityService.HotelSearchReqContract.value.Hotels;
          if (check) {
              if (jsondata.Combos) {
                se.fc = jsondata.Combos.ComboType == "Vé Máy Bay";
                se.fs = jsondata.Combos.ComboType == "Flash Sale";
                se.fcbcar =  jsondata.Combos.ComboType == "Combo Xe";
              } else {
                se.fs = false;
                se.fc = false;
              }
              se.getdataroom();
          } else {
            se.zone.run(()=> {
              se.mealtypegrouplist = [];
              se.hotelRoomClasses = [];
              se.hotelRoomClassesFS = [];
              se.emptyroom = true;
              se.ischeckoutofroom = false;
              se.loadcomplete = true;
              se.loadpricecombodone = true;
              se.ischeck = true;
              se.allowbookcombofc = false;
              se.allowbookcombofx = false;
            })
            
          }
        }else {
          se.checkPriceHotelDetail().then((check) => {
            if (check) {
                if (jsondata.Combos) {
                  se.fc = jsondata.Combos.ComboType == "Vé Máy Bay";
                  se.fs = jsondata.Combos.ComboType == "Flash Sale";
                  se.fcbcar =  jsondata.Combos.ComboType == "Combo Xe";
                } else {
                  se.fs = false;
                  se.fc = false;
                }
                se.getdataroom();
            } else {
              se.zone.run(()=> {
                se.mealtypegrouplist = [];
                se.hotelRoomClasses = [];
                se.hotelRoomClassesFS = [];
                se.emptyroom = true;
                se.ischeckoutofroom = false;
                se.loadcomplete = true;
                se.loadpricecombodone = true;
                se.ischeck = true;
                se.allowbookcombofc = false;
                se.allowbookcombofx = false;
              })
              
            }
          });
        }
      }
      
      else if(!jsondata.ComboPromtion && !jsondata.Combos){
        se.checkPriceHotelDetail().then((check) => {
          if (check) {
              if (jsondata.Combos) {
                se.fc = jsondata.Combos.ComboType == "Vé Máy Bay";
                se.fs = jsondata.Combos.ComboType == "Flash Sale";
                se.fcbcar =  jsondata.Combos.ComboType == "Combo Xe";
              } else {
                se.fs = false;
                se.fc = false;
              }
              se.getdataroom();
          } else {
            se.zone.run(()=> {
              se.mealtypegrouplist = [];
              se.hotelRoomClasses = [];
              se.hotelRoomClassesFS = [];
              se.emptyroom = true;
              se.ischeckoutofroom = false;
              se.loadcomplete = true;
              se.loadpricecombodone = true;
              se.ischeck = true;
              se.allowbookcombofc = false;
              se.allowbookcombofx = false;
            })
            
          }
        });
      }
    }
  }

  checkPriceHotelDetail(): Promise<boolean> {
    var se = this;
    var result = true;

    return new Promise((resolve, reject) => {
      let strchildage = se.searchhotel.arrchild && se.searchhotel.arrchild.length >0 ? se.searchhotel.arrchild.map(c => c.numage).join('_') : '';
      let key = se.HotelID.toString() +"_"+se.cin.toString()+"_"+se.cout.toString()+"_"+se.adults.toString()+"_" + (se.child ? se.child.toString() : "0")+se.room+"_"+strchildage;
      if(se.activityService.HotelSearchReqContract && se.activityService.HotelSearchReqContract.id == key && se.activityService.HotelSearchReqContract.value){
          se.textMSG= se.activityService.HotelSearchReqContract.value.MSG;
          if(se.loader){
            se.loader.dismiss();
          }
          if (se.activityService.HotelSearchReqContract.value.Hotels) {
            resolve(true);
          }else{
            resolve(false);
          }
        }else{
          var form = {
            CheckInDate: moment(se.cin).format('YYYY-MM-DD'),
            CheckOutDate: moment(se.cout).format('YYYY-MM-DD'),
            CityID: '',
            CountryID: '',
            HotelID: se.HotelID,
            IsLeadingPrice: '1',
            IsPackageRate: 'false',
            NationalityID: '82',
            ReferenceClient: '',
            RoomNumber: se.room,
            'RoomsRequest[0].RoomIndex': '1',
            Supplier: 'IVIVU',
            dataKey: '',
            'RoomsRequest[0][Adults][value]': se.adults,
            'RoomsRequest[0][Child][value]': se.child ? se.child : 0,
            IsFenced: se.loginuser && se.isShowPrice ? true : false,
            GetVinHms: 1,
            GetSMD: 1,
            IsB2B: true,
            IsSeri: true,
            IsAgoda:true,
            IsOccWithBed: true,
            NoCache: false,
          };
          let body = `CheckInDate=${moment(se.cin).format('YYYY-MM-DD')}&CheckOutDate=${moment(se.cout).format('YYYY-MM-DD')}&CityID=''&CountryID=''`
          +`&HotelID=${se.HotelID}&IsLeadingPrice=1&IsPackageRate=false&NationalityID=82&ReferenceClient=''&RoomNumber=${se.room}&RoomsRequest[0].RoomIndex=1`
          +`&Supplier='IVIVU'&dataKey=''&RoomsRequest[0][Adults][value]=${se.adults ? se.adults : "2"}&RoomsRequest[0][Child][value]=${se.child ? se.child : "0"}&IsFenced=${se.loginuser && se.isShowPrice ? true : false}`
          +`&GetVinHms=1&GetSMD=1&IsB2B=true&IsSeri=true&IsAgoda=true&IsOccWithBed=true&NoCache=false`;
          
          if (this.searchhotel.arrchild && this.searchhotel.arrchild.length >0) {
            this.arrchild1 = [];
            for (var i = 0; i < this.searchhotel.arrchild.length; i++) {
              // form["RoomsRequest[0][AgeChilds][" + i + "][value]"] = + this.arrchild[i].numage;
              form["RoomsRequest[0][AgeChilds][" + i + "][value]"] = + this.searchhotel.arrchild[i].numage;
              this.arrchild1.push(this.searchhotel.arrchild[i].numage);
              body += `&RoomsRequest[0][AgeChilds][${i}][value]=${se.searchhotel.arrchild[i].numage}`;
            }
          }
          //this.formParam = form;
          //this.formParam = body;
          let strUrl = C.urls.baseUrl.urlContracting + '/api/contracting/HotelSearchReqContractAppV2';
          //se.gf.RequestApi('POST', strUrl, {'content-type' : 'application/x-www-form-urlencoded', accept: '*/*'}, body, 'hoteldetail', 'checkPriceHotelDetail').then((data) => {
          let headers = {'content-type' : 'application/x-www-form-urlencoded', accept: '*/*'};
          this._hotelDetailContractPrice =  this._hotelDetailService.loadHotelDetailContractPrice(strUrl, headers, body).pipe(shareReplay());
          this._hotelDetailContractPrice.subscribe(data => {
              let jsonhtprice1 = data;
              let strchildage = se.searchhotel.arrchild && se.searchhotel.arrchild.length >0 ? se.searchhotel.arrchild.map(c => c.numage).join('_') : '';
      let key = se.HotelID.toString() +"_"+se.cin.toString()+"_"+se.cout.toString()+"_"+se.adults.toString()+"_" + (se.child ? se.child.toString() : "0")+se.room+"_"+strchildage;
              se.activityService.HotelSearchReqContract = { id: key, value: {...data}, formParam: form };
              if (jsonhtprice1.Hotels) {
                result = true;
              } else {
                result = false;
                se.textMSG=jsonhtprice1.MSG;
                if (se.loader) {
                  se.loader.dismiss();
                }
              }
              resolve(result);
          })
        }
      });
      
  }


  /***
   * Hàm load giá khách sạn liên quan
   * PDANH 15/02/2019
   */
  getPriceHotelRelated(): any {
    var se = this;
    let listhotels = "";
    let listhotelIdInternal = "";
    for (let i = 0; i < se.HotelRelated.length; i++) {
      if (i == se.HotelRelated.length - 1) {
        listhotels = listhotels + se.HotelRelated[i].Id;
        listhotelIdInternal = listhotelIdInternal + se.HotelRelated[i].Id;
      } else {
        listhotels = listhotels + se.HotelRelated[i].Id + ",";
        listhotelIdInternal = listhotelIdInternal + se.HotelRelated[i].Id + ",";
      }
    }
    var options;
    var form = {
      RoomNumber: se.searchhotel.roomnumber ? se.searchhotel.roomnumber : 1,
      IsLeadingPrice: '',
      ReferenceClient: '',
      Supplier: 'IVIVU',
      CheckInDate: se.searchhotel.CheckInDate ? se.searchhotel.CheckInDate : se.cin,
      CheckOutDate: se.searchhotel.CheckOutDate ? se.searchhotel.CheckOutDate : se.cout,
      CountryID: '',
      CityID: '',
      NationalityID: '',
      'RoomsRequest[0][RoomIndex]': '0',
      'RoomsRequest[0][Adults][value]': se.searchhotel.adult ? se.searchhotel.adult : se.adults,
      'RoomsRequest[0][Child][value]': se.searchhotel.child ? se.searchhotel.child : se.child,
      StatusMethod: '2',
      'CityCode': se.authService.region,
      CountryCode: 'VN',
      NoCache: 'false',
      SearchType: '2',
      HotelIds: listhotels,
      HotelIdInternal: listhotelIdInternal
    };

    let body = `RoomNumber=${se.searchhotel.roomnumber ? se.searchhotel.roomnumber : 1}&IsLeadingPrice=''&ReferenceClient=''&Supplier='IVIVU'`
    +`&CheckInDate=${se.searchhotel.CheckInDate ? se.searchhotel.CheckInDate : se.cin}&CheckOutDate=${se.searchhotel.CheckOutDate ? se.searchhotel.CheckOutDate : se.cout}&CountryID=''&CityID=''&NationalityID=''&RoomsRequest[0][RoomIndex]=0&`
    +`RoomsRequest[0][Adults][value]=${se.searchhotel.adult ? se.searchhotel.adult : se.adults}&RoomsRequest[0][Child][value]=${se.searchhotel.child ? se.searchhotel.child : se.child}&StatusMethod=2&`
    +`CityCode=${se.authService.region}&CountryCode='VN'&NoCache=false&SearchType=2&HotelIds=${listhotels}&HotelIdInternal=${listhotelIdInternal}`;
    
    if (this.searchhotel.arrchild) {
      for (var i = 0; i < this.searchhotel.arrchild.length; i++) {
        form["RoomsRequest[0][AgeChilds][" + i + "][value]"] = + this.searchhotel.arrchild[i].numage;
        body += `&RoomsRequest[0][AgeChilds]["${i}"][value]=${se.searchhotel.arrchild[i].numage}`;
      }
    }
    
    let strUrl = C.urls.baseUrl.urlContracting + '/api/contracting/HotelsSearchPriceAjax';
    se.gf.RequestApi('POST', strUrl, {'content-type' : 'application/x-www-form-urlencoded', accept: '*/*'}, body, 'hoteldetail', 'getPriceHotelRelated').then((data) => {
        se.zone.run(() => {
        se.ListHotelRelatedPrice = [];
        let jsonhtprice1 = data;
        if (jsonhtprice1.HotelListResponse) {
          jsonhtprice1 = jsonhtprice1.HotelListResponse.HotelList.HotelSummary;
          for (var i = 0; i < jsonhtprice1.length; i++) {
            se.ListHotelRelatedPrice.push(jsonhtprice1[i]);
          }
          //Bind giá vào list ks đã search
          setTimeout(() => {
            se.zone.run(() => se.fillDataPrice());
          }, 300);

        }
      })
    })
  }
  /**Bind lại giá nếu có giá OTA
     * PDANH 15/02/2018
     */
  fillDataPrice() {
    for (let index = 0; index < this.HotelRelated.length; index++) {
      for (let i = 0; i < this.ListHotelRelatedPrice.length; i++) {
        //Chỉ bind lại giá cho hotel, combo bỏ qua
        if (this.HotelRelated[index] && this.HotelRelated[index].Id == this.ListHotelRelatedPrice[i].HotelId) {
          this.HotelRelated[index].MinPriceOTAStr = this.ListHotelRelatedPrice[i].MinPriceOTAStr;
          this.HotelRelated[index].MinPriceTAStr = this.ListHotelRelatedPrice[i].MinPriceTAStr;
          this.HotelRelated[index].RoomNameSubString = this.ListHotelRelatedPrice[i].RoomNameSubString;
          this.HotelRelated[index].PromotionDescription = this.ListHotelRelatedPrice[i].PromotionDescription;
          this.HotelRelated[index].PromotionDescriptionSubstring = this.ListHotelRelatedPrice[i].PromotionDescriptionSubstring;
        }
      }
    }
  }
  /*
  * Hàm check item khách sạn đã tồn tại trong list json1 hay chưa: 1 = đã có; 0 - chưa có
  * @param item khách sạn cần check
  */
  checkExistsItem(id) {
    var co = 0;
    if (id) {
      for (let i = 0; i < this.HotelRelated.length; i++) {
        if (id == this.HotelRelated[i].HotelId) {
          co = 1;
          break;
        }
      }
    }

    return co;
  }



  convertWCFStringDate(strDate) {
    var matched = this.dateRegex.exec(strDate);
    if (matched) {
      var parts = matched[1].split(/[-+,.]/);
      return new Date(parts[0] ? +parts[0] : 0 - +parts[1]);
    }
  }
  /***
   * Hàm load thông tin combo khách sạn
   * PDANH 15/02/2019
   */
  getDetailCombo(comboid): Promise<any> {
    var se = this;
    return new Promise((resolve, reject) =>{
      se.ischeckcbcarhide = false;
      se.loaddonecombo=false;
     
        let headers = {
              apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
              apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U',
            };
      let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/ComboDetailList?comboId=' + (comboid ? comboid : se.comboid) + '&checkin=' + moment(this.cin).format('DD-MM-YYYY') + '&checkout=' + moment(this.cout).format('DD-MM-YYYY');
      se.gf.RequestApi('GET', strUrl, headers, {}, 'hoteldetail', 'getDetailCombo').then((data) => {
        if (data) {
          var obj = data;
          se.warningCombofs = '';
          se.warningCombofsIP = '';
          se.searchhotel.destinationCity = obj.arrivalName;
          //Giờ xe
          if (obj.comboDetail) {
            se.bookCombo.transportDepartTime = obj.comboDetail.transportDepartTime;
            se.bookCombo.transportReturnTime = obj.comboDetail.transportReturnTime;
            se.combopriceontitle = obj.comboDetail.totalPriceSale ? obj.comboDetail.totalPriceSale : obj.comboDetail.price;
          } else {
            se.allowbookcombofc = false;
            se.allowbookcombofx = false;
            se.loaddonecombo = true;
            se.loadpricecombodone = true;
            se.checkBODdone = true;
          }
          var item = obj.comboDetail;
          var itemList = obj.list;
          se.comboDetail = obj;
          se.dateofcombo = se.comboDetail.dateOfCombo;
          se.hasInsurrance = item ? item.isInsurance : false;
          if(se.valueGlobal.notRefreshDetail){
            se.loaddonecombo = true;
          }
          se.zone.run(() => {
            se.changedate = false;
            se.comboDetailList = [];
            if (item) {
              se.fc = (item.comboType == "1");
              se.fs = (item.comboType == "2");
              se.fcbcar = item.comboType == "3";
              se.nm = (item.comboType == null);
              if (se.fs) {
                se.getHotelSuggestDaily('flashsale');
              }else {
                se.getHotelSuggestDaily('package');
              }
  
              if (se.fs && item.availableTo) {
                let dateEnd = new Date(item.availableTo.toLocaleString());
                let y:any = moment(se.searchhotel.CheckInDate).format('YYYY'),
                    m:any = moment(se.searchhotel.CheckInDate).format('MM'),
                    d:any = moment(se.searchhotel.CheckInDate).format('DD');
                let dateNow = new Date(y*1, m*1 -1, d*1);
                if (moment(dateNow).diff(moment(dateEnd),'days') > 0 ) {
                  se.flashSaleEndDate = moment(dateEnd).format('DD.MM.YYYY');
                }
              }
              if (se.fc && (item.availableTo || se.comboDetail.endDate)) {
                var diffday = 1;
                if (se.comboDetail && se.comboDetail.endDate) {
                  var arr = se.comboDetail.endDate.split('-');
                  var newdate = new Date(arr[2], arr[1] - 1, arr[0]);
                  var d = moment(this.gf.getCinIsoDate(newdate)).format('YYYY-MM-DD');
                  se.comboDetailEndDate = d;
                  se.allowbookcombofc = moment(this.gf.getCinIsoDate(se.searchhotel.CheckOutDate)).diff(moment(d), 'days') > 1 ? false : true;
  
                  se.checkOutOfRangeCombo = moment(this.gf.getCinIsoDate(se.searchhotel.CheckOutDate)).diff(moment(d), 'days') > 1 ? false : true;
                }
              }
              if (se.fcbcar && (item.availableTo || se.comboDetail.endDate)) {
                if (se.comboDetail && se.comboDetail.endDate) {
                  var arr = se.comboDetail.endDate.split('-');
                  var newdate = new Date(arr[2], arr[1] - 1, arr[0]);
                  var d = moment(this.gf.getCinIsoDate(newdate)).format('YYYY-MM-DD');
                  se.allowbookcombofx = moment(this.gf.getCinIsoDate(se.searchhotel.CheckOutDate)).diff(moment(d), 'days') > 1 ? false : true;
                  se.checkOutOfRangeCombo = moment(this.gf.getCinIsoDate(se.searchhotel.CheckOutDate)).diff(moment(d), 'days') > 1 ? false : true;
                }
                
              }
              if (se.fcbcar && se.comboDetail) {
                se.bookCombo.ComboRoomPrice = se.comboDetail.comboDetail.totalPriceSale;
              }
              if (item.roomId && item.price ) {
               
                se.zone.run(() => {
                  setTimeout(() => {
                    if (se.loadcomplete) {
                      if (se.jsonroom1 && se.jsonroom1.length > 0) {
                        se.jsonroom1.forEach(element => {
                          element.MealTypeRates.forEach(elementMealtype => {
                            if (elementMealtype.RoomId == item.roomId && elementMealtype.IsFlashSale) {
                              se.hasComboRoom = true;
                              se.bookCombo.Hotelid = se.HotelID;
                              se.bookCombo.roomid = elementMealtype.RoomId;
                              se.bookCombo.roomNb = se.searchhotel.roomnumber;
                              se.bookCombo.Adults = se.searchhotel.adult;
                              se.bookCombo.Child = se.searchhotel.child;
                              se.bookCombo.ChildAge = se.searchhotel.arrchild;
                              se.bookCombo.ComboRoomPrice = elementMealtype.PriceAvgPlusTAStr;
                              se.comboprice = elementMealtype.PriceAvgPlusTAStr;
                              if (se.loginuser) {
                                se.loadpricecombodone = true;
                              } else {
                                se.loadpricecombodone = false;
                              }
                              se.warningMaxPax = elementMealtype.MSG;
                            }
                          })
                        });
                      }
                    } else {
                      setTimeout(() => {
                        if (se.loadcomplete) {
                          if (se.jsonroom1 && se.jsonroom1.length > 0) {
                            se.jsonroom1.forEach(element => {
                              element.MealTypeRates.forEach(elementMealtype => {
                                if (elementMealtype.RoomId == item.roomId && elementMealtype.IsFlashSale) {
                                  se.hasComboRoom = true;
                                  se.bookCombo.Hotelid = se.HotelID;
                                  se.bookCombo.roomid = elementMealtype.RoomId;
                                  se.bookCombo.roomNb = se.searchhotel.roomnumber;
                                  se.bookCombo.Adults = se.searchhotel.adult;
                                  se.bookCombo.Child = se.searchhotel.child;
                                  se.bookCombo.ChildAge = se.searchhotel.arrchild;
                                  se.bookCombo.ComboRoomPrice = elementMealtype.PriceAvgPlusTAStr;
                                  se.comboprice = elementMealtype.PriceAvgPlusTAStr;
                                  if (se.loginuser) {
                                    se.loadpricecombodone = true;
                                  } else {
                                    se.loadpricecombodone = false;
                                  }
                                  se.warningMaxPax = elementMealtype.MSG;
                                }
                              })
                            });
                          }
                        }
                      }, 3000);
                    }
  
                  }, 3000);
  
                });
              } else if (!item.roomId) {
                se.ischeckcombo = false;
              }
              se.changedate = false;
            }
            else {
              se.allowbookcombofc = false;
              se.allowbookcombofx = false;
  
              if(obj && obj.endDate)
              var arr = obj.endDate.split('-');
                  var newdate = new Date(arr[2],arr[1] -1,arr[0]);
                  var d = moment(newdate).format('YYYY-MM-DD');
                  se.checkOutOfRangeCombo = moment(se.searchhotel.CheckOutDate).diff(moment(d),'days') > 1 ? false : true;
            }
            if (itemList) {
              itemList.forEach(item => {
                se.comboDetailList.push(item);
              });
            }
          })
        } 
        se.searchhotel.roomID = se.RoomID;
        //se.getBOD(item.roomId);
        if ((item && item.roomId) || se.searchhotel.hotelID) {
          se.getBOD((item && item.roomId) ? item.roomId : '');
        } else {
          se.zone.run(() => {
            se.checkBODdone = true;
          })
        }
        //Nếu có bảo hiểm thì gọi api lấy giá bảo hiểm
        se.getInsurranceFee(comboid).then((data) => {
          if (data.data) {
            se.objInsurranceFee = data.data;
            if (data.data.priceTaTotal > 0) {
              se.InsurranceFee = data.data.priceTaTotal.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + "đ";
            } else {
              se.InsurranceFee = "";
            }
  
          }
        })
        se.loaddonecombo = true;
        resolve(true);
      })
    })
    
  }

  async getInsurranceFee(comboid): Promise<any> {
    var se = this;
    let days = moment(this.cout).diff(moment(this.cin), 'days') + 1;
    return new Promise((resolve, reject) => {
      let headers = {
            apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
            apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U',
          };
      let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/ComboServiceFee?comboId=' + (comboid ? comboid : se.comboid) + '&days=' + days + '&pax=' + (se.adults + (se.child ? se.child : 0));
      se.gf.RequestApi('GET', strUrl, headers, {}, 'hoteldetail', 'getInsurranceFee').then((data) => {
        resolve(data);
      })
    })
  }

  btnseemore() {
    this.HotelreviewsPage();
    //this.isbtnseemore = false;
    //this.isShow = true;

  }
  seedetail(id) {
    var self = this;
    this.arrroom = [];
    var coroom;
    for (let i = 0; i < self.jsonroom.length; i++) {
      if (id == self.jsonroom[i].value.Rooms[0].RoomID) {
        this.arrroom.push(self.jsonroom[i].value);
        coroom = self.jsonroom[i].co;
        break;
      }
    }
    var date1 = new Date(this.gf.getCinIsoDate(this.cin));
    var date2 = new Date(this.gf.getCinIsoDate(this.cout));
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    this.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));

    var value = { Address: this.Address, Name: this.name, imghotel: this.imgHotel, cin: this.cin, cout: this.cout, dur: this.duration, room: this.arrroom, adults: this.adults, child: this.child, roomnumber: this.roomvalue, coroom: coroom, texttitle: this.text };
    this.searchhotel.hotelID = id;
    this.router.navigateByUrl('/hotelroomdetail');
    // alert(self.arrroom);
  }
  // selectclick() {

  //   if (this.room && this.guest) {
  //     this.presentLoading5000();
  //     this.getdataroom();
  //   }

  // }
  selectclick(event, text) {
    for (let i = 0; i < this.arrchild.length; i++) {
      if (this.arrchild[i].text == text) {
        this.arrchild[i].numage = event;
        break;
      }
    }
  }
  selectclickcin() {

    this.cout = new Date(this.gf.getCinIsoDate(this.cin));
    var datecin = new Date(this.gf.getCinIsoDate(this.cin));
    this.cincombo = moment(datecin).format('YYYYMMDD');
    var res = this.cout.setTime(this.cout.getTime() + (1 * 24 * 60 * 60 * 1000));
    var date = new Date(this.gf.getCinIsoDate(res));
    this.cout = moment(date).format('YYYY-MM-DD');
    if (this.room && this.guest) {
      //this.presentLoading5000();
      this.ischeck = false
      this.presentLoading();
    }
  }
  selectclickout() {

    var datecin = Date.parse(this.gf.getCinIsoDate(this.cin));
    var datecout = Date.parse(this.gf.getCinIsoDate(this.cout));

    if (datecin >= datecout) {
      this.presentToastwarming('Ngày check in không lớn hơn hoặc bằng ngày check out');
    }
    else {
      if (this.room && this.guest) {
        // this.presentLoading5000();
        this.ischeck = false
        this.presentLoading();
      }
    }
  }

  async presentToastwarming(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }

  /***
 * Hàm load thông tin phòng
 */
  async getdataroom() {
    var self = this;
    var se = this;
    var options;
    let key = se.HotelID.toString() +"_"+se.cin.toString()+"_"+se.cout.toString()+"_"+se.adults.toString()+"_" + (se.child ? se.child.toString() : "0" ) +se.room;
    if(se.activityService.HotelSearchReqContract && se.activityService.HotelSearchReqContract.id == key && se.activityService.HotelSearchReqContract.value){
          var result = {...se.activityService.HotelSearchReqContract.value};
          se.formParam = se.activityService.HotelSearchReqContract.formParam;
          //console.log(se.activityService.HotelSearchReqContract.value);
          se.excuteLoadHotelRoom(result);
  }
  else{
    var form = {
      CheckInDate: moment(se.gf.getCinIsoDate(self.cin)).format('YYYY-MM-DD'),
      CheckOutDate: moment(se.gf.getCinIsoDate(self.cout)).format('YYYY-MM-DD'),
      CityID: '',
      CountryID: '',
      HotelID: self.HotelID,
      IsLeadingPrice: '1',
      IsPackageRate: 'false',
      NationalityID: '82',
      ReferenceClient: '',
      RoomNumber: self.room,
      'RoomsRequest[0].RoomIndex': '1',
      Supplier: 'IVIVU',
      dataKey: '',
      'RoomsRequest[0][Adults][value]': self.adults ? self.adults : "2",
      'RoomsRequest[0][Child][value]': self.child ? self.child : "0",
      IsFenced: self.loginuser ? true : false,
      GetVinHms: 1,
      GetSMD: 1,
      IsAgoda:true,
      IsOccWithBed: true,
      NoCache: false,
    };

    let body = `CheckInDate=${moment(self.cin).format('YYYY-MM-DD')}&CheckOutDate=${moment(self.cout).format('YYYY-MM-DD')}&CityID=''&CountryID=''`
    +`&HotelID=${self.HotelID}&IsLeadingPrice=1&IsPackageRate=false&NationalityID=82&ReferenceClient=''&RoomNumber=${self.room}&RoomsRequest[0].RoomIndex=1`
    +`&Supplier='IVIVU'&dataKey=''&RoomsRequest[0][Adults][value]=${self.adults ? self.adults : "2"}&RoomsRequest[0][Child][value]=${self.child ? self.child : "0"}&IsFenced=${self.loginuser && self.isShowPrice ? true : false}`
    +`GetVinHms=1&GetSMD=1&IsB2B=true&IsSeri=true&IsAgoda=true&IsOccWithBed=true&NoCache=false`;
    if (self.searchhotel.arrchild && self.searchhotel.arrchild.length >0) {
      self.arrchild1 = [];
      for (var i = 0; i < self.searchhotel.arrchild.length; i++) {
        // form["RoomsRequest[0][AgeChilds][" + i + "][value]"] = + self.arrchild[i].numage;
        form["RoomsRequest[0][AgeChilds][" + i + "][value]"] = + self.searchhotel.arrchild[i].numage;
        self.arrchild1.push(self.searchhotel.arrchild[i].numage);
        body += `&RoomsRequest[0][AgeChilds][${i}][value]=${se.searchhotel.arrchild[i].numage}`;
      }
    }
      self.formParam = form;
      let strUrl = C.urls.baseUrl.urlContracting + '/api/contracting/HotelSearchReqContractAppV2';
      let headers = {'content-type' : 'application/x-www-form-urlencoded', accept: '*/*'};
      try {
        this._hotelDetailContractPrice =  this._hotelDetailService.loadHotelDetailContractPrice(strUrl, headers, body).pipe(shareReplay());
        this._hotelDetailContractPrice.subscribe(data => {
          if(data){
            se.activityService.HotelSearchReqContract = { id: key, value: {...data}, formParam: form};
            setTimeout(()=>{
              se.activityService.HotelSearchReqContract = null;
            }, 1000 * 60 * 5)
            se.excuteLoadHotelRoom(data);
          }else{
            se.activityService.HotelSearchReqContract = null;
          }
          
        })
      } catch (error) {
        se.activityService.HotelSearchReqContract = null;
      }
    }
  }

  resetShowHidePanel() {
    var se = this;

    for (let index = 0; index < se.hotelRoomClasses.length; index++) {
      se.checkAddAndRemoveItem(2, index);
      //group mealtype
      var objmealtypes = $('.group-' + index + ' .cls-visible');
      if (objmealtypes && objmealtypes.length > 0) {
        for (let i = 0; i < objmealtypes.length; i++) {
          $(objmealtypes[i]).removeClass('cls-visible').addClass('cls-hidden');
        }
      }
    }

  }

  excuteLoadHotelRoom(data) {
    var self = this,
      se = this;
    self.zone.run(() => {
      if (self.loader) {
        self.loader.dismiss();
      }
      self.loadcomplete = false;
      self.ischeck = true;
      self.jsonroom = [];
      self.jsonroom2 = data;
      var result = data;

      //Load roomdetail
      //var result = data;
      if (result.Hotels) {
        se.emptyroom = false;
        self.hotelRooms = [];
        self.hotelRoomClasses = [];
        se.hotelRoomClassesFS = [];
        self.hotelMealTypes = [];
        self.hotelMealTypesHidden = [];
        self.hotelRooms = result.Hotels[0];
        self.callbackNote = result.Hotels[0].CallbackNote ? (result.Hotels[0].CallbackNote.replace(' phút','’').replace('phút','’')) : 'Xác nhận trong 60’';
        setTimeout(()=>{
          if (result.Hotels[0].RoomClasses.length == 0) {
            self.ischeckwarn = true;
          }
          else {
            self.ischeckwarn = false;
          }
        }, 100);
       
        se.booking.OriginalRoomClass = result.Hotels[0].RoomClasses;
        se.zone.run(()=> result.Hotels[0].RoomClasses.sort(function (a, b) {
          return a.PercentPaxRoom > b.PercentPaxRoom ? -2 : a.MealTypeRates[0].PriceAvgPlusTotalTA < b.MealTypeRates[0].PriceAvgPlusTotalTA ? -1 : 1;
      }));
        setTimeout(()=>{
          result.Hotels[0].RoomClasses.forEach((element, index) => {
            var groupMealType = 0;
            var indexMealTypeHidden = 0;
            element.hotelMealTypes = [];
            element.hotelMealTypesHidden = [];
            if (element.Rooms[0].Images) {
              element.Rooms[0].Images = (element.Rooms[0].Images.toLocaleString().trim().indexOf("http") == -1) ? 'https:' + element.Rooms[0].Images : element.Rooms[0].Images;
            }
            
            if (!element.Rooms[0].Images || element.Rooms[0].Images.indexOf('noimage') != -1) {
              element.Rooms[0].Images = "https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage-110x110.jpg";
            } else if (element.Rooms[0].Images.indexOf('220x125') != -1) {
              let urlimage = element.Rooms[0].Images.substring(0, element.Rooms[0].Images.lastIndexOf('-') +1 );
              let idexofdot = element.Rooms[0].Images.lastIndexOf('.');
              let tail = element.Rooms[0].Images.substring(idexofdot, element.Rooms[0].Images.length);
              element.Rooms[0].Images = urlimage + "110x110" + tail;
            }
            for (let i = 0; i < element.MealTypeRates.length; i++) {
              if (element.MealTypeRates[i] != null) {
                var PriceAvgPlusTA = element.MealTypeRates[i].PriceAvgPlusTotalTA
                PriceAvgPlusTA = PriceAvgPlusTA / 100000;
                PriceAvgPlusTA = Math.floor(PriceAvgPlusTA);
                element.MealTypeRates[i].point = PriceAvgPlusTA;

                if (element.hotelMealTypes.length == 0) {
                  groupMealType = groupMealType + 1;
                  element.MealTypeRates[i].displayMealType = true;
                  element.MealTypeRates[i].groupMealType = index;
                  element.hotelMealTypes.push(element.MealTypeRates[i]);
                } else {
                  var mealTypeName = element.MealTypeRates[i].Name;
                  //Trường hợp có thêm note thì filter theo name + note
                  if (element.MealTypeRates[i].Notes && element.MealTypeRates[i].Notes.length > 0) {
                    mealTypeName = element.MealTypeRates[i].Name + ", " + element.MealTypeRates[i].Notes.join(', ');
                  }
                  if (element.hotelMealTypes.filter(item => item.Notes && item.Notes.length > 0 ? (item.Name + ", " + item.Notes.join(', ') == mealTypeName && (item.Supplier != 'HBED' || (item.Supplier == 'HBED' && item.Penaltys && item.Penaltys.length > 0))) : item.Name == mealTypeName && (item.Supplier != 'HBED' || (item.Supplier == 'HBED' && item.Penaltys && item.Penaltys.length > 0))).length == 0) {
                    groupMealType = groupMealType + 1;
                    element.MealTypeRates[i].displayMealType = true;
                    element.MealTypeRates[i].groupMealType = index;
                    element.hotelMealTypes.push(element.MealTypeRates[i]);
                  } else {
                    element.MealTypeRates[i].groupMealType = index;
                    indexMealTypeHidden = indexMealTypeHidden + 1;
                    //Nếu nhiều hơn 2 item thì add vào list ẩn
                    //Hiển thị item đầu tiên của list ẩn (hiển thị 2 item đầu của 1 mealtype của room)
                    element.MealTypeRates[i].displayMealType = false;
                    if (indexMealTypeHidden == element.MealTypeRates.length - 1) {
                      element.MealTypeRates[i].displaySecondItem = true;
                    }
                    element.hotelMealTypesHidden.push(element.MealTypeRates[i]);
                  }
                }
              }

            }
            if (element.hotelMealTypes && element.hotelMealTypes.length > 0) {
              element.countMealType = 0;
              for (let m = 0; m < element.hotelMealTypes.length; m++) {
                let mealTypeCode = element.hotelMealTypes[m].Code;
                let  count = element.MealTypeRates.filter(item => item.Code == mealTypeCode && (item.Supplier != 'HBED' || (item.Supplier=='HBED'&& item.Penaltys && item.Penaltys.length >0) ) ).length;
                element.hotelMealTypes[m].countMealType = count -1;
                //Nếu chỉ có 2 nhóm mealtype thì hiển thị 2 item đầu
                if(element.hotelMealTypes.length <= 1){
                  var el = element.hotelMealTypesHidden.filter(item => item.displaySecondItem);
                  if(el && el.length >0){
                    el[0].displayMealType = true;
                    element.hotelMealTypes[m].countMealType = count -2;
                  }
                }
                //Nhiều hơn 2 nhóm mealtype => hiển thị giá gạch TA của item có giá cao nhất
                else{
                  let lastElementMealTypeGroup = element.MealTypeRates.filter(item => item.Code == mealTypeCode && (item.Supplier != 'HBED' || (item.Supplier=='HBED'&& item.Penaltys && item.Penaltys.length >0) ) ).length;
                  let objMap = lastElementMealTypeGroup[lastElementMealTypeGroup.length - 1];
                  if(objMap){
                    lastElementMealTypeGroup[0].displayLastPriceAvgPlusOTA = true;
                    lastElementMealTypeGroup[0].displayLastPriceAvgPlusOTAStr = objMap.PriceAvgPlusOTAStr;
                  }
                  
                }
              }
              element.countMealType = 0;
              for (let m = 0; m < element.hotelMealTypes.length; m++) {
                element.countMealType += element.hotelMealTypes[m].countMealType;
              }
            }
            element.checkwarning = 0;
            self.hotelRoomClasses.push(element);
          });
        }, 50);
        // thêm RoomClassesRecomments
        setTimeout(()=>{
          result.Hotels[0].RoomClassesRecomments.forEach((element, index) => {
            var groupMealType = 0;
            var indexMealTypeHidden = 0;
            element.isFromListRecomment = true;
            element.hotelMealTypes = [];
            element.hotelMealTypesHidden = [];
            if (index == 0) {
              if (self.hotelRoomClasses.length > 0) {
                element.checkwarning = 1;
              }
            } else {
              element.checkwarning = 0;
            }
            if (element.Rooms[0].Images) {
              element.Rooms[0].Images = (element.Rooms[0].Images.toLocaleString().trim().indexOf("http") == -1) ? 'https:' + element.Rooms[0].Images : element.Rooms[0].Images;
            }
            if (!element.Rooms[0].Images || element.Rooms[0].Images.indexOf('noimage') != -1) {
              element.Rooms[0].Images = "https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage-110x110.jpg";
            } else if (element.Rooms[0].Images.indexOf('220x125') != -1) {
              let urlimage = element.Rooms[0].Images.substring(0, element.Rooms[0].Images.lastIndexOf('-') +1 );
              let idexofdot = element.Rooms[0].Images.lastIndexOf('.');
              let tail = element.Rooms[0].Images.substring(idexofdot, element.Rooms[0].Images.length);
              element.Rooms[0].Images = urlimage + "110x110" + tail;
            }
            for (let i = 0; i < element.MealTypeRates.length; i++) {
              if (element.MealTypeRates[i] != null) {
                var PriceAvgPlusTA = element.MealTypeRates[i].PriceAvgPlusTotalTA
                PriceAvgPlusTA = PriceAvgPlusTA / 100000;
                PriceAvgPlusTA = Math.floor(PriceAvgPlusTA);
                element.MealTypeRates[i].point = PriceAvgPlusTA;

                if (element.hotelMealTypes.length == 0) {
                  groupMealType = groupMealType + 1;
                  element.MealTypeRates[i].displayMealType = true;
                  element.MealTypeRates[i].groupMealType = index;
                  element.hotelMealTypes.push(element.MealTypeRates[i]);
                } else {
                  var mealTypeName = element.MealTypeRates[i].Name;
                  //Trường hợp có thêm note thì filter theo name + note
                  if (element.MealTypeRates[i].Notes && element.MealTypeRates[i].Notes.length > 0) {
                    mealTypeName = element.MealTypeRates[i].Name + ", " + element.MealTypeRates[i].Notes.join(', ');
                  }
                  if (element.hotelMealTypes.filter(item => item.Notes && item.Notes.length > 0 ? (item.Name + ", " + item.Notes.join(', ') == mealTypeName && (item.Supplier != 'HBED' || (item.Supplier == 'HBED' && item.Penaltys && item.Penaltys.length > 0))) : item.Name == mealTypeName && (item.Supplier != 'HBED' || (item.Supplier == 'HBED' && item.Penaltys && item.Penaltys.length > 0))).length == 0) {
                    groupMealType = groupMealType + 1;
                    element.MealTypeRates[i].displayMealType = true;
                    element.MealTypeRates[i].groupMealType = index;
                    element.hotelMealTypes.push(element.MealTypeRates[i]);
                  } else {
                    element.MealTypeRates[i].groupMealType = index;
                    indexMealTypeHidden = indexMealTypeHidden + 1;
                    //Nếu nhiều hơn 2 item thì add vào list ẩn
                    //Hiển thị item đầu tiên của list ẩn (hiển thị 2 item đầu của 1 mealtype của room)
                    element.MealTypeRates[i].displayMealType = false;
                    if (indexMealTypeHidden == element.MealTypeRates.length - 1) {
                      element.MealTypeRates[i].displaySecondItem = true;
                    }
                    element.hotelMealTypesHidden.push(element.MealTypeRates[i]);
                  }
                }
              }

            }
            if (element.hotelMealTypes && element.hotelMealTypes.length > 0) {
              element.countMealType = 0;
              for (let m = 0; m < element.hotelMealTypes.length; m++) {
                let mealTypeName = element.hotelMealTypes[m].Name;
                //Trường hợp có thêm note thì filter theo name + note
                if (element.hotelMealTypes[m].Notes && element.hotelMealTypes[m].Notes.length > 0) {
                  mealTypeName = element.hotelMealTypes[m].Name + ", " + element.hotelMealTypes[m].Notes.join(', ');
                }
                let count = element.MealTypeRates.filter(item => item.Notes && item.Notes.length > 0 ? (item.Name + ", " + item.Notes.join(', ') == mealTypeName && (item.Supplier != 'HBED' || (item.Supplier == 'HBED' && item.Penaltys && item.Penaltys.length > 0))) : item.Name == mealTypeName && (item.Supplier != 'HBED' || (item.Supplier == 'HBED' && item.Penaltys && item.Penaltys.length > 0))).length;
                element.hotelMealTypes[m].countMealType = count - 1;
                //Nếu chỉ có 2 nhóm mealtype thì hiển thị 2 item đầu
                if (element.hotelMealTypes.length <= 1) {
                  var el = element.hotelMealTypesHidden.filter(item => item.displaySecondItem);
                  if (el && el.length > 0) {
                    el[0].displayMealType = true;
                    element.hotelMealTypes[m].countMealType = count - 2;
                  }
                }
                //Nhiều hơn 2 nhóm mealtype => hiển thị giá gạch TA của item có giá cao nhất
                else {
                  let lastElementMealTypeGroup = element.MealTypeRates.filter(item => item.Notes && item.Notes.length > 0 ? (item.Name + ", " + item.Notes.join(', ') == mealTypeName) : item.Name == mealTypeName);
                  let objMap = lastElementMealTypeGroup[lastElementMealTypeGroup.length - 1];
                  if (objMap) {
                    lastElementMealTypeGroup[0].displayLastPriceAvgPlusOTA = true;
                    lastElementMealTypeGroup[0].displayLastPriceAvgPlusOTAStr = objMap.PriceAvgPlusOTAStr;
                  }

                }
              }
              element.countMealType = 0;
              for (let m = 0; m < element.hotelMealTypes.length; m++) {
                element.countMealType += element.hotelMealTypes[m].countMealType;
              }
            }

            self.hotelRoomClasses.push(element);
          });
        }, 100);

        setTimeout(()=>{
          self.loadcomplete = true;
        }, 110);
      } else {
        self.hotelRoomClasses = [];
        self.hotelRoomClassesFS = [];
        se.emptyroom = true;
        self.loadpricecombodone = true;
        self.textMSG=result.MSG;
      }
     
    });

    //check combo xe
    setTimeout(()=> {
      if (se.fcbcar) {
        se.ischeckcbcarhide = true;
      }
      se.resetShowHidePanel();
      if (se.loginuser) {
        if (se.hotelRoomClasses.length > 0 && se.comboDetail) {
          //Xét có room default trong combo và không bị quá số khách => trả về obj/ không có trả về null
          if (se.comboDetail.comboDetail) {
            se.checkRoomDefaultMaxPax(se.comboDetail.comboDetail.roomId, se.hotelRoomClasses).then((check) => {
              if (se.loadcomplete && !se.ischeckBOD && se.comboDetailList.length > 0 && se.hotelRoomClasses.length > 0 && se.totalAdult <= 6 && se.hotelRoomClasses.length > 0 && se.fcbcar && se.allowbookcombofx && check) {
                se.ischeckcbcar = true;
              } else {
                se.ischeckcbcar = false;
              }
            })
          }
          else {
            se.ischeckcbcar = false;
          }
    
        }
  
        //check combo xe
        if (se.fcbcar) {
          se.ischeckcbcarhide = true;
          if (se.loginuser) {
            if (se.hotelRoomClasses.length > 0 && se.comboDetail) {
              //Xét có room default trong combo và không bị quá số khách => trả về obj/ không có trả về null
              if (se.comboDetail.comboDetail) {
                se.checkRoomDefaultMaxPax(se.comboDetail.comboDetail.roomId, se.hotelRoomClasses).then((check) => {
                  if (se.loadcomplete && (!se.ischeckBOD) && se.comboDetailList.length > 0 && se.hotelRoomClasses.length > 0 && se.totalAdult <= 6 && se.hotelRoomClasses.length > 0 && se.fcbcar && se.allowbookcombofx && check && se.usermail) {
                    se.ischeckcbcar = true;
                  } else {
                    se.ischeckcbcar = false;
                  }
                })
              }
              else {
                se.ischeckcbcar = false;
              }
            }
            else {
              se.ischeckcbcar = false;
            }
          } else {
            se.ischeckcbcar = false;
          }
        }
  
      }
    },150)
    
    setTimeout(()=>{
      //check combo flash sale
      if (se.fs) {
        se.activityService.objFlightComboUpgrade = {};
        se.ListRoomClasses = [];
        for (let i = 0; i < se.hotelRoomClasses.length; i++) {
          if (se.hotelRoomClasses[i].Rooms[0].RoomID == se.comboDetail.comboDetail.roomId) {
            se.ListRoomClasses.push(se.hotelRoomClasses[i]);
            break;
          }
        }
        // if(se.ListRoomClasses.length==0){
        //   se.warningCombofs='Phòng cuối vừa được đặt. Vui lòng chọn ngày khác!';
        //   return;
        // }
        se.roomCombo = '';
        se.ischeckcbfs = false;
        se.checkRoomDefaultFsale(se.comboDetail.comboDetail.roomId, se.ListRoomClasses).then((check) => {
          if (check) {
            if (se.objroomfsale[0].Status == 'AL') {
              se.ischeckcbfs = true;
            }
            else {
              // check status IP thi k show gia
              if (se.objroomfsale[0].Status == 'IP') {
                se.warningCombofsIP = 'Phòng cuối vừa được đặt. Vui lòng chọn ngày khác!';
              }
              // se.ischeckcbfs = false;
              if(se.warningCombofsIP){
                let cocheckCombofs = false;
                for (let i = 0; i < se.hotelRoomClasses.length; i++) {
                  if (se.hotelRoomClasses[i].IsFlashSale) {
                    var jMealTypeRates =-1;
                    for (let j = 0; j < se.hotelRoomClasses[i].MealTypeRates.length; j++) {
                      if (se.hotelRoomClasses[i].MealTypeRates[j].Code == se.comboDetail.comboDetail.mealTypeNote) {
                        jMealTypeRates=j;
                        se.warningCombofsIP = '';
                        break;
                      }
                    }
                  se.comboprice=se.hotelRoomClasses[i].MealTypeRates[jMealTypeRates].PriceAvgPlusTAStr;
                    se.roomCombo = se.hotelRoomClasses[i].ClassName;
                    se.bookCombo.roomNb = se.hotelRoomClasses[i].MealTypeRates[jMealTypeRates].TotalRoom;
                    se.elementMealtype=se.hotelRoomClasses[i].MealTypeRates[jMealTypeRates];
                    se.indexMealTypeRates=jMealTypeRates;
                    se.activityService.objFlightComboUpgrade.CurrentRoomIndex=jMealTypeRates;
                    // check status IP thi k show gia
                    if (se.hotelRoomClasses[i].Status == 'IP') {
                      se.warningCombofsIP = 'Phòng cuối vừa được đặt. Vui lòng chọn ngày khác!';
                      // se.ischeckcbfs = false;
                    }
      
                    cocheckCombofs = true;
                    break;
                  }
                }
                if (!cocheckCombofs) {
                  se.warningCombofs = 'Phòng cuối vừa được đặt. Vui lòng chọn ngày khác!';
                }
              }
              
            }
          }
          else {
            let cocheckCombofs = false;
            for (let i = 0; i < se.hotelRoomClasses.length; i++) {
              if (se.hotelRoomClasses[i].IsFlashSale) {
                var jMealTypeRates=-1;
                for (let j = 0; j < se.hotelRoomClasses[i].MealTypeRates.length; j++) {
                  if (se.hotelRoomClasses[i].MealTypeRates[j].Code == se.comboDetail.comboDetail.mealTypeNote) {
                    jMealTypeRates=j;
                    break;
                  }
                }
              se.comboprice=se.hotelRoomClasses[i].MealTypeRates[jMealTypeRates].PriceAvgPlusTAStr;
                se.roomCombo = se.hotelRoomClasses[i].ClassName;
                se.bookCombo.roomNb = se.hotelRoomClasses[i].MealTypeRates[jMealTypeRates].TotalRoom;
                se.elementMealtype=se.hotelRoomClasses[i].MealTypeRates[jMealTypeRates];
                se.indexMealTypeRates=jMealTypeRates;
                se.activityService.objFlightComboUpgrade.CurrentRoomIndex=jMealTypeRates;
                // check status IP thi k show gia
                if (se.hotelRoomClasses[i].Status == 'IP') {
                  se.warningCombofsIP = 'Phòng cuối vừa được đặt. Vui lòng chọn ngày khác!';
                  se.ischeckcbfs = false;
                }

                else if(se.hotelRoomClasses[i].Status == 'AL'){
                  se.objroomfsale.push(se.hotelRoomClasses[i].MealTypeRates[jMealTypeRates]);
                  se.ischeckcbfs = true;
                  //nếu map dc phòng cho book thì bật biên auto update rooom = true
                  se.ischeckUpgrade=true;
                  this.arrroomFS = [];
                  this.arrroomFS.push(se.hotelRoomClasses[i]);
            
                }
                
                cocheckCombofs = true;
                break;
              }
            }
            if (!cocheckCombofs) {
              se.warningCombofs = 'Phòng cuối vừa được đặt. Vui lòng chọn ngày khác!';
            }

          }
          se.loadpricecombodone = true;

        })
      }
      if(se.fc){
        se.loadpricecombodone = true;
      }

      setTimeout(()=>{
        se.loadpricecombodone = true;
      },100)
      
      if (se.hotelRoomClasses && se.hotelRoomClasses.length > 0) {
        let priceinstallment = Math.round(se.hotelRoomClasses[0].MealTypeRates[0].PriceAvgPlusTotalTA * 1 / 12 * 1.05);
        se.installmentPriceStr = priceinstallment.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g, '.') + "đ/tháng";
        se.activityService.installmentPriceStr = se.installmentPriceStr;
      }
      this.checkRoomFsale();
      se.loaddonecombo = true;
    },100)
  }

  loadHotelImageReviews() {
    var se = this;
    if (se.HotelID) {
      let url = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetHotelImageReviews?hotelid=' + se.HotelID;
      se.gf.RequestApi('GET', url, {}, {}, 'hoteldetail', 'GetHotelImageReviews').then((data) => {
        if (data.data) {
          se.storage.set('hotelimagereviews_' + se.HotelID, data.data);
          se.pushAllImageReviews(data.data);
        }
      })
    }
  }

  pushAllImageReviews(data) {
    var se = this;
    se.arrimgreview = [];
    for (let i = 0; i < 3; i++) {
      se.arrimgreview.push(data[i]);
    }
    if (data.length > 3) {
      se.countimgrv = data.length - 3;
    }
  }
  /**
    * Hàm check có phòng default combo và không vượt quá số khách
    * @param roomId id room default của combo xe
    * @param roomClass list room api trả về
    */
   checkRoomDefaultFsale(roomId, roomClass): Promise<any> {
    var res = true;
    return new Promise((resolve, reject) => {
      this.objroomfsale=[];
      var objmap;
      roomClass.forEach((el) => {
         objmap = el.MealTypeRates.filter((Meal) => {
          return Meal.RoomId == roomId && Meal.IsFlashSale == true && (Meal.Supplier == 'Internal' || Meal.Supplier == 'VINPEARL' || Meal.Supplier == 'B2B'|| Meal.Supplier == 'SMD'|| Meal.Supplier == 'SERI') && Meal.PromotionNote != '';
        })
        // if (objmap && objmap.length > 0) {
        //   this.objroomfsale=objmap;
        // }
      })
      
      res = ( objmap &&  objmap.length > 0);
      if (res) {
        if (objmap.length > 1) {
          for (let i = 0; i < objmap.length; i++) {
            if (objmap[i].Code == this.comboDetail.comboDetail.mealTypeNote) {
              this.activityService.objFlightComboUpgrade.CurrentRoomIndex=i;
              this.objroomfsale.push(objmap[i]);
              break;
            }
          }
          if(this.objroomfsale==0){
            this.objroomfsale = objmap;
          }
        }
        else {
          this.objroomfsale = objmap;
        }
        if( this.objroomfsale.length > 0){
          this.comboprice = this.objroomfsale[0].PriceAvgPlusTAStr;
          this.roomCombo = this.objroomfsale[0].RoomName;
          this.bookCombo.roomNb = this.objroomfsale[0].TotalRoom;
          this.elementMealtype=this.objroomfsale[0];
           // check lại index metaltype
           for (let i = 0; i < roomClass[0].MealTypeRates.length; i++) {
            const element = roomClass[0].MealTypeRates[i];
            if (this.objroomfsale[0].guidId==element.guidId){
              this.indexMealTypeRates=i;
              break;
            }
            
          }
        }
      
      }
      resolve(res);
    })

  }

  /**
   * Hàm check có phòng default combo và không vượt quá số khách
   * @param roomId id room default của combo xe
   * @param roomClass list room api trả về
   */
  checkRoomDefaultMaxPax(roomId, roomClass): Promise<any> {
    var se = this, res = true, listresult: any = [];
    return new Promise((resolve, reject) => {
      roomClass.forEach((el) => {
        var objmap = el.Rooms.filter((room) => {
          return room.RoomID == roomId && !el.MSG;
        })

        if (objmap && objmap.length > 0) {
          listresult.push(objmap)
        }
      })

      res = (listresult && listresult.length > 0);
      resolve(res);
    })

  }

  checknmeal(code) {
    var co = 0;
    if (this.arrMeal.length > 0) {
      for (let i = 0; i < this.arrMeal.length; i++) {
        if (this.arrMeal[i].Code == code) {
          co = 1;
          break;
        }
      }
      return co;
    }
    else {
      return co;
    }

  }
  DescriptionPage() {
    this.valueGlobal.notRefreshDetail = true;
    this.router.navigateByUrl('/hoteldescription/' + this.HotelID);
  }
  HotelreviewsPage() {
    this.valueGlobal.notRefreshDetail = true;
    this.navCtrl.navigateForward('/hotelreviews/'+this.HotelID);
  }
  FacilitiesPage() {
    this.valueGlobal.notRefreshDetail = true;
    this.router.navigateByUrl('/facilities/' + this.HotelID);
  }
  PolicyPage() {
    this.valueGlobal.notRefreshDetail = true;
    this.router.navigateByUrl('/policy/' + this.HotelID);
  }
  // async presentAlertbook() {
  //   const alertController = window.document.querySelector('ion-alert-controller');
  //   await alertController.componentOnReady();

  //   let alert = await this.alertCtrl.create({
  //     message: 'Phòng cuối cùng vừa được đặt. Quý khách vui lòng chọn ngày khác.',
  //     buttons: ['Ok']
  //   });
  //   alert.present();
  // }

  book(id, MealTypeRates, indexme, roomName, RoomType) {
    //this.presentLoadingNew();
    var self = this;
    this.valueGlobal.notRefreshDetail = true;
    //Lấy số phòng theo số room từ api trả về
    this.roomvalue = MealTypeRates.TotalRoom;
    this.arrroom = [];
    for (let i = 0; i < self.hotelRoomClasses.length; i++) {
      //pdanh 22-02-2023: Bỏ rule check số phòng theo api trả về = cấu hình phòng lúc search
      //pdanh 27-07-2023: Bổ xung map thêm theo mealtypeid
      if (id == self.hotelRoomClasses[i].Rooms[0].RoomID && self.hotelRoomClasses[i].MealTypeRates.some(r => r.guidId == MealTypeRates.guidId)){
        this.arrroom.push(self.hotelRoomClasses[i]);
        this.indexroom = i;
        break;
      }
    }
    var date1 = new Date(this.gf.getCinIsoDate(self.cin));
    var date2 = new Date(this.gf.getCinIsoDate(self.cout));
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    self.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));

    self.booking.CheckInDate = moment(this.gf.getCinIsoDate(self.cin)).format('YYYY-MM-DD');
    self.booking.CheckOutDate = moment(this.gf.getCinIsoDate(self.cout)).format('YYYY-MM-DD'),
      self.booking.roomNb = self.room,
      self.booking.Adults = self.adults,
      self.booking.Child = self.child,
      self.booking.CName = '',
      self.booking.CEmail = self.usermail,
      self.booking.cost = MealTypeRates.PriceAvgPlusTAStr,
      self.booking.indexroom = self.indexroom,
      self.booking.indexmealtype = indexme,
      self.booking.HotelId = self.HotelID,
      self.Roomif.RoomId = id,
      self.booking.HotelName = self.name,
      self.booking.RoomName = roomName,
      self.Roomif.Address = self.Address,
      self.Roomif.dur = self.duration,
      self.Roomif.arrroom = self.arrroom,
      self.Roomif.roomnumber = MealTypeRates.TotalRoom,
      self.Roomif.roomtype = MealTypeRates,
      self.Roomif.jsonroom = {...self.jsonroom2.Hotels[0]},
      self.Roomif.imgHotel = self.imgHotel;
    self.Roomif.objMealType = MealTypeRates;
    self.Roomif.HotelRoomHBedReservationRequest = JSON.stringify(self.arrroom[0].HotelRoomHBedReservationRequest);
    self.Roomif.arrrbed = [];
    self.Roomif.imgRoom = self.arrroom[0].Rooms[0].ImagesMaxWidth320;
    self.searchhotel.adult = self.adults;
    self.searchhotel.child = self.child;
    self.searchhotel.roomnumber = self.room;
    self.searchhotel.CheckInDate = self.cin;
    self.searchhotel.CheckOutDate = self.cout;
    self.booking.code = self.hotelcode;
    self.bookCombo.ComboId = -1;
    self.bookCombo.ComboTitle = "";
    self.Roomif.textcancel = "";
    //Truyền thêm param gọi lại request lấy giá phòng khi đổi ngày bên form roomdetailreview
    self.booking.FormParam = self.formParam;
    self.Roomif.ExcludeVAT = self.ExcludeVAT;
    this.bookCombo.ischeckShowupgrade=false;
    self.Roomif.DescriptionTaxFee=null;
    //if (self.arrroom[0].MealTypeRates[indexme].Supplier == 'Internal') {
    if (MealTypeRates.Supplier == 'Internal') {
      let qs =
        {
          token: '3b760e5dcf038878925b5613c32615ea3',
          hotelcode: self.booking.HotelId,
          roomcode: self.Roomif.RoomId,
          checkin: self.booking.CheckInDate,
          checkout: self.booking.CheckOutDate,
          totalroom: self.Roomif.roomnumber
        };
      let strUrl = C.urls.baseUrl.urlContracting + `/api/toolsapi/CheckAllotment?token=3b760e5dcf038878925b5613c32615ea3&hotelcode=${self.booking.HotelId}&roomcode=${self.Roomif.RoomId}&checkin=${self.booking.CheckInDate}&checkout=${self.booking.CheckOutDate}&totalroom=${self.Roomif.roomnumber}`;
      self.gf.RequestApi('GET', strUrl, {}, {}, 'hoteldetail', 'book').then((data) => {
        var rs = data;
          if (rs.Msg == "AL") {
            self.Roomif.payment = rs.Msg;
            self.Roomif.ischeckpayment = true;
            self.Roomif.roomcancelhbed = 1;
            self.router.navigateByUrl('/roomdetailreview')
          } else if (rs.Msg == "RQ") {
            self.Roomif.payment = rs.Msg;
            self.Roomif.ischeckpayment = false;
            self.Roomif.roomcancelhbed = 1;
            self.router.navigateByUrl('/roomdetailreview')
          }
          else if(rs.error != 0){
            //let result = JSON.parse(rs.Msg);
            self.gf.showAlertMessageOnly(rs.Msg);
          }
      })
      
    }
    else if (MealTypeRates.Supplier == 'HBED') {
      if (MealTypeRates.HotelRoomHBedReservationRequest.rooms[0].rateType == 'RECHECK') {
        self.checkhbed(MealTypeRates);
      } else {
        if (MealTypeRates.Penaltys.length > 0) {
          //check IsPenaltyFree true:đc hủy/ false:k dc hủy
          self.Roomif.payment = self.arrroom[0].MealTypeRates[indexme].Penaltys[0].IsPenaltyFree;
          self.Roomif.ischeckpayment = true;
          self.Roomif.roomcancelhbed = 1;
          self.navCtrl.navigateForward('/roomdetailreview');
        }
        else {
          self.checkhbed(MealTypeRates);
        }
      }
    }
    else if (MealTypeRates.Supplier == 'VINPEARL' || MealTypeRates.Supplier == 'SMD') {
      self.Roomif.payment = "AL";
      self.Roomif.roomcancelhbed = 0;
      self.Roomif.ischeckpayment = true;
      self.navCtrl.navigateForward('/roomdetailreview')
    }
    else if(MealTypeRates.Supplier == 'SERI') {
      //Check allotment trÆ°á»›c khi book
      self.gf.checkAllotmentSeri(
      self.booking.HotelId,
      self.Roomif.RoomId,
      self.booking.CheckInDate,
      self.booking.CheckOutDate,
      self.Roomif.roomnumber,
      'SERI', self.Roomif.roomtype.HotelCheckDetailTokenInternal
      ).then((allow)=> {
        if(allow){
          self.Roomif.payment = "AL";
          self.Roomif.roomcancelhbed = 0;
          self.Roomif.ischeckpayment = true;
          self.navCtrl.navigateForward('/roomdetailreview');
        }else{
          self.gf.showToastWarning('Hiá»‡n táº¡i khÃ¡ch sáº¡n Ä‘Ã£ háº¿t phÃ²ng loáº¡i nÃ y.');
        }
      })
    }
    else if(MealTypeRates.Supplier == 'B2B'){
      self.Roomif.payment = "RQ";
      self.Roomif.ischeckpayment = false;
      self.Roomif.roomcancelhbed = 1;
      self.router.navigateByUrl('/roomdetailreview')
    }
    else {
      // console.log(self.arrroom[0].Rooms[0].Penaltys[0].IsPenaltyFree);
      self.Roomif.arrrbed = self.arrroom[0].MealTypeRates[indexme].BedTypes;
      //check IsPenaltyFree true:đc hủy/ false:k dc hủy
      self.Roomif.payment = self.arrroom[0].MealTypeRates[indexme].Penaltys[0].IsPenaltyFree;

      self.Roomif.ischeckpayment = true;
      self.Roomif.roomcancelhbed = 1;
      self.Roomif.DescriptionTaxFee=MealTypeRates.DescriptionTaxFee;
      self.router.navigateByUrl('/roomdetailreview');
    }
    //}

  }
  checkhbed(MealTypeRates) {
    var self = this;
    self.gf.showLoading();
    var form = {
      GrossProfitOnline: MealTypeRates.HotelRoomHBedReservationRequest.GrossProfitOnline,
      rooms: MealTypeRates.HotelRoomHBedReservationRequest.rooms,
      rateCommentId: MealTypeRates.HotelRoomHBedReservationRequest.rateCommentId
    }
    
    let strUrl = C.urls.baseUrl.urlContracting + '/api/contracting/GetRateCommonHbedAjax';
    self.gf.RequestApi('POST', strUrl, {}, form, 'hoteldetail', 'getdataroom').then((data) => {
      var json = data;
      self.gf.hideLoading();
      if (json.totalNetTa && json.totalNetTa > MealTypeRates.PriceAvgPlusTotalTA) {
        self.gf.showAlertMessageOnly("Giá đã thay đổi, vui lòng thực hiện lại booking !");
        self.activityService.HotelSearchReqContract = null;
        self.getdataRefresh();
        return;
      }
      if (json.cancelPolicy) {

        self.Roomif.payment = json.cancelPolicy[0].IsPenaltyFree;
        self.Roomif.ischeckpayment = true;
        var Penalty_Datetemp = json.cancelPolicy[0].Penalty_Date;
        var Penalty_Date1 = new Date(Penalty_Datetemp);
        var Penalty_Date = Penalty_Date1.setTime(Penalty_Date1.getTime() - (1 * 24 * 60 * 60 * 1000));
        var Penalty_Date2 = moment(Penalty_Date).format('DD-MM-YYYY');
        var thu = moment(Penalty_Date).format('dddd');
        switch (thu) {
          case "Monday":
            thu = "Thứ 2"
            break;
          case "Tuesday":
            thu = "Thứ 3"
            break;
          case "Wednesday":
            thu = "Thứ 4"
            break;
          case "Thursday":
            thu = "Thứ 5"
            break;
          case "Friday":
            thu = "Thứ 6"
            break;
          case "Saturday":
            thu = "Thứ 7"
            break;
          default:
            thu = "Chủ nhật"
            break;
        }
        var a = json.cancelPolicy[0].Penalty_Val_OTA;
        var money = Math.ceil(a / 100) * 100;
        var money1 = money.toLocaleString()
        var text = "Sau 12:00 PM ngày " + thu + ", " + Penalty_Date2 + " sẽ bị tính phí là: " + money1 + " VND";
        self.Roomif.objMealType = MealTypeRates;
        self.Roomif.textcancel = text;
       
        self.Roomif.roomcancelhbed = 0;
        self.router.navigateByUrl('/roomdetailreview');
      }
      else {
        self.gf.showAlertMessageOnly("Đã hết phòng, vui lòng chọn lại phòng khác!");
      }
    });
  }
  async bookcombo() {
    this.storage.get('email').then(email => {
      if (email) {
        //Gọi popup gửi yêu cầu
        this.bookCombo.Email = email;
        this.bookCombo.Address = this.Address;
        // const modal: HTMLIonModalElement = await this.modalCtrl.create('RequestComboPage');
        // modal.present();
      }
    })
    //google analytic
    this.gf.googleAnalytion('hoteldetail', 'bookcombo', '');
    // var item = { namecombo: this.titlecombo, ComboDayNum: this.ComboDayNum, cin: this.cin, imghotel: this.imgHotel, namehotel: this.name, Address: this.Address };
    // this.navCtrl.push('CombochoosedeparturetimePage', item);
  }
  btnclick() {
    this.ischeckbtn = false;
    this.ischeckbtnreset = true;
    this.navCtrl.back();
  }
  btnclick1() {
    this.ischeckbtn = true;
    this.ischeckbtnreset = false;

  }
  goback() {
    this.isexit = true;
    this.searchhotel.isRefreshDetail = false;
    this.searchhotel.showPopup = false;
    if (this.searchhotel.rootPage == "mainpage" || this.searchhotel.rootPage == "topdeal") {
      this.router.navigateByUrl('/app/tabs/tab1');
    }
    else {
      if (this.searchhotel.rootPage == "listpage") {
        this.router.navigateByUrl('/hotellist/false');
      }
      else if (this.searchhotel.rootPage == "likepage") {
        this.router.navigateByUrl('/tabs/tab2');
      }
      else if (this.searchhotel.rootPage == "MyTrip") {
        if (this._mytripservice.rootPage == "homeflight") {
          this._flightService.itemTabFlightActive.emit(true);
          this._flightService.itemMenuFlightClick.emit(2);
          this.valueGlobal.backValue = "homeflight";
          this.navCtrl.navigateBack('/tabs/tab1', { animated: true });
          this._mytripservice.backfrompage = "";
        } else {
          this.router.navigateByUrl('/app/tabs/tab3');
        }

      }
      else if (this.searchhotel.rootPage == "combolist") {
        this.router.navigateByUrl('/combolist');
      }
      else if (this.searchhotel.rootPage == "topdeallist") {
        this.router.navigateByUrl('/topdeallist');
      }
      else if (this.searchhotel.rootPage == "listmood") {
        let hotellistmoodparams = this.gf.getParams('hotellistmood')
        if (hotellistmoodparams) {
          this.router.navigateByUrl('/hotellistmood/' + hotellistmoodparams.moodid + '/' + hotellistmoodparams.title);
        } else {
          this.navCtrl.back();
        }

      } else {
        this.router.navigateByUrl('/');
      }
    }
  }
  /***
   * Hàm click vào row khách sạn liên quan
   * PDANH 15/02/2019
   */
  itemHotelRelated(msg) {
    var se = this;
    se.flag = 1;
    se.isheader1 = true;
    se.presentLoadingnotime();
    se.zone.run(() => {
      se.HotelID = msg.Id;
      se.hotelname=msg.Name;
      se.searchhotel.isRefreshDetail = true;
      se.searchhotel.hotelID = msg.Id;
        se.loadcomplete = false;
        se.mealtypegrouplist = [];
        se.hotelRoomClasses = [];
        se.hotelRoomClassesFS = [];
        se.ischeck = false;
      se.setCacheHotel();
      se.loadTopSale24h(msg.Id);
      se.loadHotelDetailFromItemRelate();

      let el = window.document.getElementsByClassName('div-float-arrow');
      if (el.length > 0) {
        el[0].classList.remove('float-arrow-enabled');
        el[0].classList.add('float-arrow-disabled');
      }
      if (se.loader) {
        se.loader.dismiss();
      }
    })
    //google analytic
    se.gf.googleAnalytion('hoteldetail', 'hotelrelatedclick', '');
  }
  // add value KH
  plusadults() {
    this.adults1++;
    if (this.adults1 == 1) {
      this.ischeckadults = false;
    }
    else {
      this.ischeckadults = true;
    }
  }
  minusadults() {
    if (this.adults1 > 1) {
      this.adults1--;
    }
    if (this.adults1 == 1) {
      this.ischeckadults = false;
    }
    else {
      this.ischeckadults = true;
    }


  }
  pluschild() {
    this.child1++;
    var arr = { text: 'Trẻ em' + ' ' + this.child1, numage: "7" }
    this.arrchild2.push(arr);
    if (this.child1 == 0) {
      this.ischeckchild = false;
    }
    else {
      this.ischeckchild = true;
    }

  }
  minuschild() {
    if (this.child1 > 0) {
      this.child1--;
      this.arrchild2.splice(this.arrchild2.length - 1, 1);
    }
    if (this.child1 == 0) {
      this.ischeckchild = false;
    }
    else {
      this.ischeckchild = true;
    }
  }
  minusroom() {
    if (this.room1 > 1) {
      this.room1--;
    }
    if (this.room1 == 1) {
      this.ischeckroom = false;
    } else {
      this.ischeckroom = true;
    }
  }
  plusroom() {
    this.room1++;
    if (this.room1 == 1) {
      this.ischeckroom = false;
    } else {
      this.ischeckroom = true;
    }
  }
  async presentAlert(msg, PenaltyDateParseStr) {
    let alert = await this.alertCtrl.create({
      message: 'Yêu cầu hủy/thay đổi phòng nhận được từ: ' + msg + '',
      buttons: ['Ok']
    });
    alert.present();
  }

  async presentWarning(msg) {
    let alert = await this.alertCtrl.create({
      message: msg,
      buttons: ['Ok']
    });
    alert.present();
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }
  /***
   * Next trên slide
   */
  onSlideChange() {
    // this.slider?.nativeElement.getActiveIndex().then(index => {
    //   if (this.slideData[index]) {
    //     this.hotelimg = this.slideData[index].LinkImage;
    //     this.coutslide = index + 1;
    //   }

    // });
    this.coutslide = this.slider?.nativeElement.swiper.activeIndex +1;

    let elements = window.document.querySelectorAll(".grad1");
    if (elements != null) {
      // debugger
    }
  }

  /***
   * Mở page chọn lịch
   * PDANH 15/02/2019
   */
  openPickupCalendar() {
    this.zone.run(() => {
      this.loadcomplete = false;
      this.hotelRoomClasses = [];
      this.hotelRoomClassesFS = [];
    });
    this.searchhotel.CheckInDate = this.gf.getCinIsoDate(this.cin);
    this.searchhotel.CheckOutDate = this.gf.getCinIsoDate(this.cout);
    //Xóa clone page-searchhotel do push page
    //this.clearClonePage("page-pickup-calendar");
    //this.router.navigateByUrl('/pickup-calendar/true');
  }
  
  /***
   * Share link hotel
   * PDANH 15/02/2019
   */
  share() {
    this.socialSharing.share('','','', this.hotelurl).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
  /***
   * Cập nhật like của hotel
   * PDANH 15/02/2019
   */
  updateLikeStatus() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'GET',
        //   url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteHotelByUser',
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json',
        //     authorization: text
        //   }
        // };
        let headers =
        {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteHotelByUser';
        se.gf.RequestApi('GET', strUrl, headers, {}, 'hoteldetail', 'getdataroom').then((data) => {
            if (data) {
              se.zone.run(() => {
                se.dataListLike = data;
                let like = false;
                //Kiểm tra có trong list like không
                if (se.dataListLike.length > 0) {
                  like = se.checkItemLiked(se.HotelID) == 1 ? true : false;
                }
                se.itemlike = like;
              });
            } else {
              //se.showConfirm();
            }
        });
      }
      else {
        se.itemlike = false;
      }
    });

  }
  /***
   * Hàm check hotel like/unlike
   * PDANH 15/02/2019
   */
  checkItemLiked(id) {
    var co = 0;
    id = parseInt(id);
    if (id) {
      for (let i = 0; i < this.dataListLike.length; i++) {
        if (this.dataListLike.indexOf(id) != -1) {
          co = 1;
          break;
        }
      }
    }

    return co;
  }
  /*** Set like item
   * PDANH  29/01/2018
   */
  likeItem() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'POST',
        //   url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/AddFavouriteHotel',
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     'postman-token': '9fd84263-7323-0848-1711-8022616e1815',
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json',
        //     authorization: text
        //   },
        //   body: { hotelId: se.HotelID },
        //   json: true
        // };
        let headers =
        {
          'postman-token': '9fd84263-7323-0848-1711-8022616e1815',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
        };
        let body = { hotelId: se.HotelID };
        let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/AddFavouriteHotel';
        se.gf.RequestApi('POST', strUrl, headers, body, 'hoteldetail', 'likeItem').then((data) => {
          se.HotelIDLike = '';
          se.zone.run(() => {
            setTimeout(() => {
              se.itemlike = true;
            }, 10)
          })
        });
      }
      else {
        //se.valueGlobal.logingoback = 'TabPage';
        se.HotelIDLike = se.HotelID;
        se.router.navigateByUrl('/login');
      }
    });
    //google analytic
    se.gf.googleAnalytion('hoteldetail', 'likeitem', '');
  }
  /*** Set unlike item
   * PDANH  29/01/2018
   */
  unlikeItem() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'POST',
        //   url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteHotelByUser',
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     'postman-token': 'a19ecc0a-cb83-4dd9-3fd5-71062937a931',
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json',
        //     authorization: text
        //   },
        //   body: { hotelId: se.HotelID },
        //   json: true
        // };

       // request(options, function (error, response, body) {
        let headers =
        {
          'postman-token': '9fd84263-7323-0848-1711-8022616e1815',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
        };
        let body = { hotelId: se.HotelID };
        let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteHotelByUser';
        se.gf.RequestApi('POST', strUrl, headers, body, 'hoteldetail', 'likeItem').then((data) => {
          se.zone.run(() => {
            setTimeout(() => {
              se.itemlike = false;
            }, 10)
          })
        });
      }
      else {
        //se.valueGlobal.logingoback = 'TabPage';
        se.router.navigateByUrl('/login');
      }
    });
    //google analytic
    se.gf.googleAnalytion('hoteldetail', 'unlikeitem', '');
  }
  /*** Show popup  chi tiết khách sạn
   * PDANH  18/02/2018
   */
  showRoomDetail(obj) {
    let param = {
      hoteldetail: obj
    };
    this.searchhotel.showPopup = true;
    this.gf.setParams({ objroom: obj, jsonroom: this.jsonroom2.Hotels[0], imgHotel: this.imgHotel, address: this.Address }, 'hotelroomdetail');
    this.searchhotel.hotelID = this.HotelID;
    this.valueGlobal.notRefreshDetail = true;
    this.router.navigateByUrl('/hotelroomdetail/'+this.HotelID);
    // let modal = this.modalCtrl.create('HotelRoomDetailPage', param);
    // modal.present();
    //google analytic
    //this.gf.googleAnalytion('hoteldetail','showroomdetail','');
  }

  /**
   * Hàm xử lý sau khi chọn fromdate,todate thì đóng popup, tự xử lý ngày chọn fromdate,todate
   * @param e Sự kiện click chọn ngày fromdate,todate trên lịch
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
            setTimeout(() => {
              se.modalCtrl.dismiss();
            }, 250)
            var se = this;
            se.searchhotel.CheckInDate = moment(se.gf.getCinIsoDate(fromdate)).format('YYYY-MM-DD');
            se.searchhotel.CheckOutDate = moment(se.gf.getCinIsoDate(todate)).format('YYYY-MM-DD');
            se.bookCombo.CheckInDate = se.searchhotel.CheckInDate
            se.bookCombo.CheckOutDate = se.searchhotel.CheckOutDate
            se.zone.run(() => {
              if (se.searchhotel.CheckInDate && se.searchhotel.CheckOutDate) {
                se.cin = se.searchhotel.CheckInDate;
                se.cout = se.searchhotel.CheckOutDate;
                se.datecin = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckInDate));
                se.datecout = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
                se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
                se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');
                se.cindisplayhr = moment(se.datecin).format('DD/MM');
                se.coutdisplayhr = moment(se.datecout).format('DD/MM');
                se.loadcomplete = false;
                var date1 = new Date(se.gf.getCinIsoDate(se.cin));
                var date2 = new Date(se.gf.getCinIsoDate(se.cout));
                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                se.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
              }
              se.gf.setCacheSearchHotelInfo({checkInDate: se.searchhotel.CheckInDate, checkOutDate: se.searchhotel.CheckOutDate, adult: se.searchhotel.adult, child: se.searchhotel.child, childAge: se.searchhotel.arrchild, roomNumber: se.searchhotel.roomnumber});
              se.changedate = true;
              se.hasComboRoom = false;
              se.comboprice = se.combopriceontitle;
              se.showpopup = true;
              se.ischeck = true;
              se.guest = se.adults + (se.child ? se.child : 0);
              if (!se.guest) {
                se.guest = 2;
              }
              se.mealtypegrouplist = [];
              se.hotelRoomClasses = [];
              se.hotelRoomClassesFS = [];
              se.loadcomplete = false;
              se.emptyroom = false;
              if (se.comboid) {
                se.getDetailCombo(se.comboid);
              }
              se.checkPriceHotelDetail().then((check) => {
                if (check) {
                  se.getdataroom();
                } else {
                  se.mealtypegrouplist = [];
                  se.hotelRoomClasses = [];
                  se.hotelRoomClassesFS = [];
                  se.emptyroom = true;
                  se.ischeckoutofroom = false;
                  se.loadcomplete = true;
                  se.loaddonecombo = true;
                  se.loadpricecombodone = true;
                  se.ischeck = true;
                  se.allowbookcombofc = false;
                  se.allowbookcombofx = false;
                }
              });
            })
          }
        }
      }
      this.searchhotel.publicChangeInfoHotelList(1);
    }
  }

  changeHotel() {
    this.goback();
  }
  /*** Xử lý lấy detailcombo khi người dùng nhấn lấy giá combo
   * PDANH  18/02/2018
   */
  checkComboPrice() {
    this.getDetailCombo(null);
  }
  /*** Ẩn hiện popup chính sách phạt
   * PDANH  18/02/2018
   */
  penaltySelected(index) {
    if (this.penaltyItemSelected >= 0) {
      this.penaltyItemSelected = -1;
    } else {
      this.penaltyItemSelected = index;
    }
  }
  /*** Về trang login
   * PDANH  18/02/2018
   */
  goToLogin() {
    this.storage.get('auth_token').then(auth_token => {
      if (!auth_token) {
        //this.valueGlobal.logingoback = 'TabPage';
        this.valueGlobal.backValue = 'carcombo';
        this.router.navigateByUrl('/login');
      }
    });
  }

  /*** Xử lý yêu cầu đặt combo
   * PDANH  22/02/2018
   */
  async requestCombo(value, combolist, input) {
  
    this.valueGlobal.notRefreshDetail = true;
    this.searchhotel.showPopup = true;
    this.bookCombo.HotelCode = this.hotelcode;
    let titlecomboshort = '';
    if (this.titlecombo && this.titlecombo.length > 0) {
      let arr = this.titlecombo.split('+');
      if (arr.length > 1) {
        let arr1 = arr[0].split(' ');
        if (arr1.length > 1) {
          titlecomboshort += arr1[1];
          titlecomboshort += "+Vé máy bay";
        } else {
          titlecomboshort += arr1[0];
          titlecomboshort += "+Vé máy bay";
        }
      } else {
        titlecomboshort = this.titlecombo;
      }
      this.bookCombo.titleComboShort = titlecomboshort;
    }
    //Gọi popup gửi yêu cầu
    this.bookCombo.Address = this.Address;
    this.bookCombo.ComboId = this.comboid;
    if (value == 1) {
      this.bookCombo.isFlightCombo = true;
      this.bookCombo.isFlashSale = false;
      this.bookCombo.isNormalCombo = false;
    }
    if (value == 2) {
      this.bookCombo.isFlashSale = true;
      this.bookCombo.isFlightCombo = false;
      this.bookCombo.isNormalCombo = false;
    }
    if (value == 3) {
      this.bookCombo.isNormalCombo = true;
      this.bookCombo.isFlashSale = false;
      this.bookCombo.isFlightCombo = false;
    }
    if (value == 4) {
      this.bookCombo.isFlashSale = true;
      this.bookCombo.isFlightCombo = false;
      this.bookCombo.isNormalCombo = false;
    }
    if (value == 5) {
      this.bookCombo.isFlashSale = true;
      this.bookCombo.isFlightCombo = false;
      this.bookCombo.isNormalCombo = false;
    }
   
    var diffday = 1;
    if (this.comboDetail && this.comboDetail.endDate) {
     
      var arr = this.comboDetail.endDate.split('-');
      var newdate = new Date(arr[2], arr[1] - 1, arr[0]);
      var d = moment(newdate).format('YYYY-MM-DD');
      diffday = moment(this.searchhotel.CheckOutDate).diff(moment(d), 'days');
    }
    //Combo vé máy bay
    if (value == 1 && this.usermail && (diffday <= 1)) {
      if (this.searchhotel.ischeckBOD || this.ischeckBOD) {
        return;
      }
      if (this.arrchild.length > 4) {
        this.presentToastwarming('Số trẻ em không được lớn hơn số người lớn. Vui lòng chọn lại.')
        return;
      }
      if (input == 0) {
        if (this.comboDetail.list.length == 2) {
          let actionSheet = await this.actionsheetCtrl.create({
            cssClass: 'action-sheets-basic-page',
            header: 'Quý khách khởi hành từ đâu?',
            buttons: [
              {
                text: this.comboDetail.list[0].departureName,
                handler: () => {
                  this.choiceFlightDeparture(this.comboDetail.list[0]);
                }
              },
              {
                text: this.comboDetail.list[1].departureName,
                handler: () => {
                  this.choiceFlightDeparture(this.comboDetail.list[1]);
                }
              },

            ]
          });
          actionSheet.present();
        }
        else if (this.comboDetail.list.length == 4) {
          let actionSheet = await this.actionsheetCtrl.create({
            cssClass: 'action-sheets-basic-page',
            header: 'Quý khách khởi hành từ đâu?',
            buttons: [
              {
                text: this.comboDetail.list[0].departureName,
                handler: () => {
                  this.choiceFlightDeparture(this.comboDetail.list[0]);
                }
              },
              {
                text: this.comboDetail.list[1].departureName,
                handler: () => {
                  this.choiceFlightDeparture(this.comboDetail.list[1]);
                }
              },
              {
                text: this.comboDetail.list[2].departureName,
                handler: () => {
                  this.choiceFlightDeparture(this.comboDetail.list[2]);
                }
              },
              {
                text: this.comboDetail.list[3].departureName,
                handler: () => {
                  this.choiceFlightDeparture(this.comboDetail.list[3]);
                }
              },
            ]
          });
          actionSheet.present();
        }
        else if (this.comboDetail.list.length == 3) {
          let actionSheet = await this.actionsheetCtrl.create({
            cssClass: 'action-sheets-basic-page',
            header: 'Quý khách khởi hành từ đâu?',
            buttons: [
              {
                text: this.comboDetail.list[0].departureName,
                handler: () => {
                  this.choiceFlightDeparture(this.comboDetail.list[0]);
                }
              },
              {
                text: this.comboDetail.list[1].departureName,
                handler: () => {
                  this.choiceFlightDeparture(this.comboDetail.list[1]);
                }
              },
              {
                text: this.comboDetail.list[2].departureName,
                handler: () => {
                  this.choiceFlightDeparture(this.comboDetail.list[2]);
                }
              },
            ]
          });
          actionSheet.present();
        } else if (this.comboDetail.list.length == 1) {
          let actionSheet = await this.actionsheetCtrl.create({
            cssClass: 'action-sheets-basic-page',
            header: 'Quý khách khởi hành từ đâu?',
            buttons: [
              {
                text: this.comboDetail.list[0].departureName,
                handler: () => {
                  this.choiceFlightDeparture(this.comboDetail.list[0]);
                }
              }
            ]
          });
          actionSheet.present();
        } else {
          this.choiceFlightDeparture(this.comboDetail);
        }
      }
      else {
        this.choiceFlightDeparture(combolist);
      }
    }
    else if (value == 2 && this.usermail) {
      var self = this;
      var strroomname = "";
      var objMealTypeRates;
      self.arrroom = [];
    
      for (let i = 0; i < self.hotelRoomClasses.length; i++) {
        if (this.comboDetail.comboDetail.roomId == self.hotelRoomClasses[i].Rooms[0].RoomID) {
          self.arrroom.push(self.hotelRoomClasses[i]);
          self.indexroom = i;
          objMealTypeRates = self.hotelRoomClasses[i].MealTypeRates;
          strroomname = self.hotelRoomClasses[i].ClassName;
          break;
        }
      }
      //Kiểm tra ko map được room default thì lấy phòng đầu tiên trả về
      if (self.arrroom.length == 0 && self.hotelRoomClasses.length > 0) {
        self.arrroom.push(self.hotelRoomClasses[0]);
        self.indexroom = 0;
        objMealTypeRates = self.hotelRoomClasses[0].MealTypeRates;
        strroomname = self.hotelRoomClasses[0].ClassName;
      }
      if (objMealTypeRates) {
        var date1 = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckInDate));
        var date2 = new Date(this.gf.getCinIsoDate(this.searchhotel.CheckOutDate));
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        this.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (this.dateofcombo > this.duration + 1) {
          var datein = new Date(this.gf.getCinIsoDate(this.cin));
          var rescin = datein.setTime(datein.getTime() + (this.dateofcombo - 1) * 24 * 60 * 60 * 1000);
          this.cout = moment(rescin).format('YYYY-MM-DD');
        }
        this.booking.CheckInDate = this.cin;
        this.booking.CheckOutDate = this.cout;
        // this.booking.CheckInDate = this.searchhotel.CheckInDate ? this.searchhotel.CheckInDate : this.cin;
        // this.booking.CheckOutDate = this.searchhotel.CheckOutDate ? this.searchhotel.CheckOutDate : this.cout;
        this.booking.roomNb = this.room ? this.room : 1;
        this.booking.Adults = this.adults;
        this.booking.Child = this.child;
        this.booking.CName = '';
        this.booking.CEmail = this.usermail;
        this.booking.indexroom = this.indexroom;
        this.booking.ChildAge = this.arrchild1;
        this.booking.HotelId = this.HotelID;
        this.Roomif.RoomId = this.bookCombo.roomid;
        this.booking.HotelName = this.name;
        this.booking.RoomName = strroomname;
        this.Roomif.Address = this.Address;
        this.Roomif.dur = this.duration;
        this.Roomif.arrroom = this.arrroom;
        this.Roomif.roomtype = this.comboDetail.mealTypeName;
        this.Roomif.jsonroom = {...this.jsonroom2.Hotels[0]};
        this.Roomif.imgHotel = this.imgHotel;
        this.Roomif.arrrbed = [];
        //this.Roomif.imgRoom = this.arrroom ? this.arrroom[0].Rooms[0].ImagesMaxWidth320 : '';
        this.Roomif.objMealType = objMealTypeRates[0];
        this.searchhotel.adult = this.adults;
        this.searchhotel.child = this.child;
        this.searchhotel.roomnumber = this.room;
        this.searchhotel.CheckInDate = this.cin;
        this.searchhotel.CheckOutDate = this.cout;
        this.bookCombo.ComboDetail = this.comboDetail;
        this.bookCombo.ComboTitle = this.titlecombo;
        this.bookCombo.MealTypeName = this.comboDetail.mealTypeName;
        this.bookCombo.MealTypeCode = this.comboDetail.mealTypeCode;
        this.formParam.RoomNumber = this.room;
        this.formParam.CheckOutDate = this.cout;
        //this.formParam += `&RoomNumber=${this.room}&CheckOutDate=${this.cout}`;
        this.bookCombo.FormParam = this.formParam;
        this.bookCombo.ObjectHotelDetail = this.objDetail;
        this.bookCombo.ComboRoomPrice = this.comboDetail.comboDetail.totalPriceSale;
        this.bookCombo.objComboDetail = this.comboDetail;
        self.router.navigateByUrl('/combocarnew');
        
        
      } else {
        self.router.navigateByUrl('/combocarnew');
      }
    }
    else if (value == 4) {
      if(this.fcbcar && !this.checkOutOfRangeCombo){
            this.gf.showAlertMessageOnly(`Combo Chỉ áp dụng đến ngày ${this.comboDetail.endDate}. Quý khách vui lòng chọn ngày khởi hành trong giai đoạn Combo hoặc liên hệ với chúng tôi qua hotline 19001870 để được tư vấn thêm.`)
            return;
          }
    
      const modal: HTMLIonModalElement =
        await this.modalCtrl.create({
          component: RequestCombo1Page,
          componentProps: {
            aParameter: true,
          }
        });
      modal.present();
      //this.router.navigateByUrl('/requestcombo');

      modal.onDidDismiss().then((data: OverlayEventDetail) => {
        var se = this;
        //if (se.valueGlobal.checksendcb) {
        se.zone.run(() => {
          //this.getDetailCombo(null);
          se.cin = se.searchhotel.CheckInDate;
          se.cout = se.searchhotel.CheckOutDate;
          se.datecin = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckInDate));
          se.datecout = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
          se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
          se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');

          se.cindisplayhr = moment(se.datecin).format('DD/MM');
          se.coutdisplayhr = moment(se.datecout).format('DD/MM');
          se.changedate = true;
          se.hasComboRoom = false;
          se.comboprice = se.combopriceontitle;
          se.showpopup = true;
          se.ischeck = true;
          se.loadcomplete = false;
          se.mealtypegrouplist = [];
          se.hotelRoomClasses = [];
          se.hotelRoomClassesFS = [];
          se.emptyroom = false;
          se.guest = se.searchhotel.adult + (se.searchhotel.child ? se.searchhotel.child : 0);
          se.room = se.searchhotel.roomnumber;
          se.child = (se.searchhotel.child ? se.searchhotel.child : 0);
          se.adults = se.searchhotel.adult;
          var date1 = new Date(se.gf.getCinIsoDate(se.cin));
          var date2 = new Date(se.gf.getCinIsoDate(se.cout));
          var timeDiff = Math.abs(date2.getTime() - date1.getTime());
          se.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
          this.totalAdult = this.adults;
          if (se.searchhotel.adult) {
            se.guest = se.searchhotel.adult + (se.searchhotel.child ? se.searchhotel.child : 0);
          }

          if (se.searchhotel.roomnumber) {
            se.room = se.searchhotel.roomnumber;
          }

          for (let i = 0; i < this.arrchild.length; i++) {
            if (this.arrchild[i].numage >= 4) {
              this.totalAdult++;
            }
          }
          if (se.comboid) {
            se.getDetailCombo(se.comboid);
          }
          //se.getdataroom();
          se.checkPriceHotelDetail().then((check) => {
            if (check) {
              se.getdataroom();
            } else {
              se.mealtypegrouplist = [];
              se.hotelRoomClasses = [];
              se.hotelRoomClassesFS = [];
              se.emptyroom = true;
              se.ischeckoutofroom = false;
              se.loadcomplete = true;
              se.loaddonecombo = true;
                  se.loadpricecombodone = true;
              se.ischeck = true;
              se.allowbookcombofc = false;
              se.allowbookcombofx = false;
            }
          });
        })
        
      })
    }
    else if (value == 5) {
      var self = this;
      var MealTypeRates = this.objroomfsale[0];
      var id = self.comboDetail.comboDetail.roomId;
      //Lấy số phòng theo số room từ api trả về
      this.roomvalue = MealTypeRates.TotalRoom;

      //this.roomvalue = this.room;

      if (!self.ischeckUpgrade) {
        this.arrroomFS = [];
        for (let i = 0; i < self.hotelRoomClasses.length; i++) {
          if (id == self.hotelRoomClasses[i].Rooms[0].RoomID) {
            this.arrroomFS.push(self.hotelRoomClasses[i]);
            this.indexroom = i;
            break;
          }
        }
      }
      // for (let i = 0; i < this.arrroom[0].MealTypeRates.length; i++) {
      //   var Meal = this.arrroom[0].MealTypeRates[i];
      //   if (Meal.IsFlashSale == true && (Meal.Supplier == 'Internal' || Meal.Supplier == 'VINPEARL') && Meal.PromotionNote != '') {
      //     this.indexmeal = i;
      //     break;
      //   }
      // }
      var date1 = new Date(this.gf.getCinIsoDate(self.cin));
      var date2 = new Date(this.gf.getCinIsoDate(self.cout));
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      self.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));

      //if (email) {
      self.booking.CheckInDate = self.cin;
      self.booking.CheckOutDate = self.cout,
        self.booking.roomNb = self.room,
        self.booking.Adults = self.adults,
        self.booking.Child = self.child,
        self.booking.CName = '',
        self.booking.CEmail = self.usermail,
        self.booking.cost = MealTypeRates.PriceAvgPlusTAStr,
        self.booking.indexroom = self.indexroom,
        self.booking.indexmealtype = this.indexMealTypeRates,
        self.booking.HotelId = self.HotelID,
        self.Roomif.RoomId = id,
        self.booking.HotelName = self.name,
        self.booking.RoomName = "roomName",
        self.Roomif.Address = self.Address,
        self.Roomif.dur = self.duration,
        self.Roomif.arrroom = self.arrroomFS,
        self.Roomif.roomnumber = MealTypeRates.TotalRoom,
        self.Roomif.roomtype = MealTypeRates,
        self.Roomif.jsonroom = {...self.jsonroom2.Hotels[0]},
        self.Roomif.imgHotel = self.imgHotel;
      self.Roomif.objMealType = MealTypeRates;
      self.Roomif.HotelRoomHBedReservationRequest = JSON.stringify(self.arrroomFS[0].HotelRoomHBedReservationRequest);
      self.Roomif.arrrbed = [];
      self.Roomif.imgRoom = self.arrroomFS[0].Rooms[0].ImagesMaxWidth320;
      self.searchhotel.adult = self.adults;
      self.searchhotel.child = self.child;
      self.searchhotel.roomnumber = self.room;
      self.searchhotel.CheckInDate = self.cin;
      self.searchhotel.CheckOutDate = self.cout;
      self.booking.code = self.hotelcode;
      self.Roomif.payment = "AL";
      self.Roomif.ischeckpayment = true;
      self.Roomif.roomcancelhbed = 1;
      this.bookCombo.ComboId = this.comboid ? this.comboid : null;
      self.bookCombo.ComboTitle = this.titlecombo;
      self.activityService.objFlightComboUpgrade.CurrentRoom = self.elementMealtype;
      this.bookCombo.FormParam = this.formParam;
      self.navCtrl.navigateForward('/roomdetailreview')
    }

  }

  async sendRequestCombo() {
    if(this.fc && !this.checkOutOfRangeCombo){
      this.gf.showAlertMessageOnly(`Combo Chỉ áp dụng đến ngày ${this.comboDetail.endDate}. Quý khách vui lòng chọn ngày khởi hành trong giai đoạn Combo hoặc liên hệ với chúng tôi qua hotline 19001870 để được tư vấn thêm.`)
      return;
    }
    this.bookCombo.HotelCode = this.hotelcode;
    let titlecomboshort = '';
    if (this.titlecombo && this.titlecombo.length > 0) {
      let arr = this.titlecombo.split('+');
      if (arr.length > 1) {
        let arr1 = arr[0].split(' ');
        if (arr1.length > 1) {
          titlecomboshort += arr1[1];
          titlecomboshort += "+Vé máy bay";
        } else {
          titlecomboshort += arr1[0];
          titlecomboshort += "+Vé máy bay";
        }
      } else {
        titlecomboshort = this.titlecombo;
      }
      this.bookCombo.titleComboShort = titlecomboshort;
    }
    this.bookCombo.Address = this.Address;
    this.bookCombo.ComboId = this.comboid;
    this.bookCombo.isFlightCombo = true;
    this.bookCombo.isFlashSale = false;
    this.bookCombo.isNormalCombo = false;
    this.bookCombo.objComboDetail = this.comboDetail;
    if (!this.ischeckBOD) {
      const modal: HTMLIonModalElement =
        await this.modalCtrl.create({
          component: RequestComboPage
        });
      modal.present();

      modal.onDidDismiss().then((data: OverlayEventDetail) => {
        var se = this;
        if ((se.searchhotel.CheckInDate && new Date(se.cin).toLocaleDateString() != new Date(se.searchhotel.CheckInDate).toLocaleDateString())
          || (se.searchhotel.CheckOutDate && new Date(se.cout).toLocaleDateString() != new Date(se.searchhotel.CheckOutDate).toLocaleDateString())
          || (se.searchhotel.adult && se.searchhotel.adult != se.adults) || (se.searchhotel.child && se.searchhotel.child != se.child)) {
          se.zone.run(() => {
            //this.getDetailCombo(null);
            se.cin = se.searchhotel.CheckInDate;
            se.cout = se.searchhotel.CheckOutDate;
            se.datecin = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckInDate));
            se.datecout = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
            se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
            se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');
            se.cindisplayhr = moment(se.datecin).format('DD/MM');
            se.coutdisplayhr = moment(se.datecout).format('DD/MM');
            if (se.searchhotel.child) {
              se.child = se.searchhotel.child;
            }
            se.changedate = true;
            se.hasComboRoom = false;
            se.comboprice = se.combopriceontitle;
            se.showpopup = true;
            se.ischeck = true;
            se.loadcomplete = false;
            se.mealtypegrouplist = [];
            se.hotelRoomClasses = [];
            se.hotelRoomClassesFS = [];
            se.emptyroom = false;
            se.guest = se.searchhotel.adult + se.searchhotel.child;
            se.room = se.searchhotel.roomnumber ? se.searchhotel.roomnumber : se.room;
            se.child = se.searchhotel.child;
            se.adults = se.searchhotel.adult;
            if (se.searchhotel.CheckInDate) {
              var date1 = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckInDate));
              var date2 = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
              var timeDiff = Math.abs(date2.getTime() - date1.getTime());
              se.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
            }
            //se.scrollToTopwithvalue1();
            if (se.comboid) {
              se.getDetailCombo(se.comboid);
            }
            //se.getdataroom();
            se.checkPriceHotelDetail().then((check) => {
              if (check) {
                se.getdataroom();
              } else {
                se.mealtypegrouplist = [];
                se.hotelRoomClasses = [];
                se.hotelRoomClassesFS = [];
                se.emptyroom = true;
                se.ischeckoutofroom = false;
                se.loadcomplete = true;
                se.loaddonecombo = true;
                  se.loadpricecombodone = true;
                se.ischeck = true;
                se.allowbookcombofc = false;
                se.allowbookcombofx = false;
              }
            });
          })
        } else {
          if (se.searchhotel.adult) {
            se.guest = se.searchhotel.adult + se.searchhotel.child;
            se.adults = se.searchhotel.adult;
          }

          if (se.searchhotel.roomnumber) {
            se.room = se.searchhotel.roomnumber;
          }

          if (se.searchhotel.CheckInDate) {
            se.loadcomplete = true;
            var date1 = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckInDate));
            var date2 = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            se.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
          }
        }
      })
    }

  }

  choiceFlightDeparture(combodetail: any): any {
    //this.presentLoadingNew();
    var self = this;
    //self.roomvalue = self.room;
   
    var se = this;
    var date1 = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckInDate));
    var date2 = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    se.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (se.dateofcombo > se.duration + 1) {
      se.showConfirmAutoAddDayCombo(se.dateofcombo - 1,combodetail);
    }else{
      se.continueBookCombo(combodetail);
    }

  }

  async continueBookCombo(combodetail){
    var se = this, self = this;

    self.arrroom = [];
    var objMealTypeRates: any;
    var strroomname = "";
    this.searchhotel.searchCityName = combodetail.departureName;
    for (let i = 0; i < self.hotelRoomClasses.length; i++) {
      if (this.comboDetail.comboDetail.roomId == self.hotelRoomClasses[i].Rooms[0].RoomID) {
        self.arrroom.push(self.hotelRoomClasses[i]);
        self.indexroom = i;
        objMealTypeRates = self.hotelRoomClasses[i].MealTypeRates;
        strroomname = self.hotelRoomClasses[i].ClassName;
        break;
      }
    }
    //Kiểm tra ko map được room default thì lấy phòng đầu tiên trả về
    if (self.arrroom.length == 0 && self.hotelRoomClasses.length > 0) {
      self.arrroom.push(self.hotelRoomClasses[0]);
      self.indexroom = 0;
      objMealTypeRates = self.hotelRoomClasses[0].MealTypeRates;
      strroomname = self.hotelRoomClasses[0].ClassName;
    }
    if (se.loginuser && se.dateofcombo > se.duration + 1) {
     
      var datein = new Date(this.gf.getCinIsoDate(se.cin));
      var rescin = datein.setTime(datein.getTime() + (se.dateofcombo - 1) * 24 * 60 * 60 * 1000);

      if(se.comboDetailEndDate && moment(rescin).diff(moment(se.comboDetailEndDate), 'days') > 1){
        se.presentToastwarming('Combo chỉ áp dụng đến ngày '+moment(se.comboDetailEndDate).format('DD-MM-YYYY') + '.Vui lòng chọn ngày khác.');
        return;
      }
      
      se.cout = moment(rescin).format('YYYY-MM-DD');
    }
    se.booking.CheckInDate = se.cin;
    se.booking.CheckOutDate = se.cout;

    se.searchhotel.CheckInDate = se.cin;
    se.searchhotel.CheckOutDate = se.cout;
    se.cindisplay = moment(se.searchhotel.CheckInDate).format('DD-MM-YYYY');
    se.coutdisplay = moment(se.searchhotel.CheckOutDate).format('DD-MM-YYYY');
    se.cindisplayhr = moment(se.searchhotel.CheckInDate).format('DD/MM');
    se.coutdisplayhr = moment(se.searchhotel.CheckOutDate).format('DD/MM');

    se.gf.setCacheSearchHotelInfo({checkInDate: se.searchhotel.CheckInDate, checkOutDate: se.searchhotel.CheckOutDate, adult: se.searchhotel.adult, child: se.searchhotel.child, childAge: se.searchhotel.arrchild, roomNumber: se.searchhotel.roomnumber});
    se.storage.set('hasChangeDate', true);
    se.getdataRefresh();
    self.booking.roomNb = objMealTypeRates[0].TotalRoom,
      self.booking.Adults = self.adults,
      self.booking.Child = self.child,
      self.booking.CName = '',
      self.booking.CEmail = self.usermail,
      self.booking.cost = combodetail.details[0].totalPriceSale,
      self.booking.indexroom = self.indexroom,
      self.booking.ChildAge = self.arrchild1,
      self.booking.HotelId = self.HotelID,
      self.Roomif.RoomId = self.bookCombo.roomid,
      self.booking.HotelName = self.name,
      self.booking.RoomName = strroomname,
      self.Roomif.Address = self.Address,
      self.Roomif.dur = self.duration,
      self.Roomif.arrroom = self.arrroom,
      self.Roomif.roomnumber = objMealTypeRates[0].TotalRoom ? objMealTypeRates[0].TotalRoom : self.roomvalue,
      self.Roomif.roomtype = self.comboDetail.mealTypeName,
      self.Roomif.jsonroom = {...self.jsonroom2.Hotels[0]},
      self.Roomif.imgHotel = self.imgHotel;
    self.Roomif.arrrbed = [];
    self.Roomif.imgRoom = self.arrroom ? self.arrroom[0].Rooms[0].ImagesMaxWidth320 : '';
    self.searchhotel.adult = self.adults;
    self.searchhotel.child = self.child;
    self.searchhotel.roomnumber = self.room;
    self.searchhotel.CheckInDate = self.cin;
    self.searchhotel.CheckOutDate = self.cout;
    self.bookCombo.ComboDetail = combodetail;
    self.bookCombo.arrivalCode = self.comboDetail.arrivalCode;
    self.bookCombo.ComboTitle = self.titlecombo;
    self.bookCombo.MealTypeName = self.comboDetail.mealTypeName;
    self.bookCombo.MealTypeCode = self.comboDetail.mealTypeCode;
    self.formParam.CheckOutDate = moment(self.cout).format('YYYY-MM-DD');
    self.bookCombo.FormParam = self.formParam;
    self.bookCombo.arrPassengers = [];
    self.bookCombo.arrlugage = [];
    self.bookCombo.hasInsurrance = self.hasInsurrance ? true : false;
    self.bookCombo.checkInsurranceFee = self.checkInsurranceFee;
    self.bookCombo.objInsurranceFee = self.objInsurranceFee;
    self.bookCombo.objComboDetail = self.comboDetail;
    self.bookCombo.roomid=self.comboDetail.comboDetail.roomId;
    self.bookCombo.MealTypeIndex = -1;
    self.router.navigateByUrl('/flightcomboreviews');
   
  }

  async showConfirmAutoAddDayCombo(day, combodetail){
    let alert = await this.alertCtrl.create(({
      message: 'Combo yêu cầu đặt ít nhất '+day+' đêm, quý khách muốn tiếp tục?',
      cssClass: "cls-confirm-add-day-combo",
      buttons: [
        {
          text: 'Để sau',
          handler: () => {
            
          }
        },
        {
          text: 'Tiếp tục',
          role: 'OK',
          handler: () => {
           
            this.continueBookCombo(combodetail);
          }
        }
      ]
    }));
    alert.present();
  }

  showRoomInfo() {
    this.showroominfo = !this.showroominfo;
  }

  async showDepartureCalendar(combolist) {
    var se = this;
    if (!se.loadcomplete) {
      se.presentToastwarming('Giá đang được cập nhật, xin vui lòng đợi trong giây lát!');
      return;
    }
    //se.resetLoadingDefault();
    se.loadcomplete = false;
    se.searchhotel.hotelID = se.HotelID;
    se.searchhotel.roomID = se.RoomID;
    se.searchhotel.ischeckBOD = se.ischeckBOD;
    se.bookCombo.ComboDetail = combolist;
    se.bookCombo.objComboDetail = se.comboDetail;
    const modal: HTMLIonModalElement =
      await se.modalCtrl.create({
        component: DepartureCalendarPage
      });
    se.gf.setParams({ comboId: se.comboid, fromPlace: combolist.departureCode, comboStartDate: se.comboDetail.startDate, comboEndDate: se.comboDetail.endDate }, 'departure')
    await modal.present();

    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      if (!data.data !== null) {

        if (!data.data) {
          se.setCacheHotel();
          //se.storage.get('email').then(email => {
          //if (email) {
          se.ischeckBOD = se.searchhotel.ischeckBOD;
          se.bookCombo.Address = se.Address;
          se.bookCombo.ComboId = se.comboid;

          se.zone.run(() => {
            se.cin = se.searchhotel.CheckInDate;
            se.cout = se.searchhotel.CheckOutDate;

          })
          se.presentLoadingRelated(5000);
          
          se.loaddata(false);

          setTimeout(() => {
            let val = 1;
            if (se.fc) {
              se.bookCombo.isFlightCombo = true;
              se.bookCombo.isFlashSale = false;
              se.bookCombo.isNormalCombo = false;
              val = 1;
              se.requestCombo(val, combolist, 1);
            }
            if (se.fs) {
              se.bookCombo.isFlashSale = true;
              se.bookCombo.isFlightCombo = false;
              se.bookCombo.isNormalCombo = false;
              val = 2;
              se.requestCombo(2, null, 1);
            }
            if (se.nm) {
              se.bookCombo.isNormalCombo = true;
              se.bookCombo.isFlashSale = false;
              se.bookCombo.isFlightCombo = false;
              val = 3;
              se.requestCombo(3, null, 1);
            }
          }, 1500)
        } else {
          se.loadcomplete = true;
        }
      } else {
        se.loadcomplete = true;

      }
      se.gf.googleAnalytion('hoteldetail', 'showdepaturecalendar', se.nm);
    });

  }

  async showConfirm() {
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
            this.router.navigateByUrl('/');
          }
        },
        {
          text: 'Đăng nhập ngay',
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
            this.router.navigateByUrl('/login');
          }
        }
      ]
    });
    alert.present();
  }
  async presentLoadingNew() {
    var loader = await this.loadingCtrl.create({
      duration: 1000,
    });
    loader.present();
  }

  async presentLoadingRelated(time) {
    this.loader = await this.loadingCtrl.create({
      message: "",
      duration: time
    });
    this.loader.present();
  }
  async presentLoadingnotime() {
    this.loader = await this.loadingCtrl.create({
      message: "",
    });
    this.loader.present();
  }
  seemoreroomdetail(value, groupId) {
    var se = this;
    if (value == 1) {
      se.checkAddAndRemoveItem(1, groupId);
     
      //group mealtype
      var objmealtypes = $('.group-' + groupId + ' .cls-hidden');
      if (objmealtypes && objmealtypes.length > 0) {
        for (let i = 0; i < objmealtypes.length; i++) {
          $(objmealtypes[i]).removeClass('cls-hidden').addClass('cls-visible');
        }
      }
      se.scrollToTopGroup(1, groupId);
    } else {
      se.checkAddAndRemoveItem(2, groupId);
      //group mealtype
      var objmealtypes = $('.group-' + groupId + ' .cls-visible');
      if (objmealtypes && objmealtypes.length > 0) {
        for (let i = 0; i < objmealtypes.length; i++) {
          $(objmealtypes[i]).removeClass('cls-visible').addClass('cls-hidden');
        }
      }
      se.scrollToTopGroup(2, groupId);
    }

  }

  checkAddAndRemoveItem(type, groupId) {
    var se = this;
    if (type == 1) {
      //mealtype group
      if (se.mealtypegrouplist && se.mealtypegrouplist.length > 0) {
        if (!se.gf.checkExistsIndex(se.mealtypegrouplist, groupId)) {
          se.mealtypegrouplist.push(groupId);
        }
      } else {
        se.mealtypegrouplist.push(groupId);
      }
    } else {
      //se.gf.removeItem(se.seemoreroomdetaillist,groupId);
      se.gf.removeItem(se.mealtypegrouplist, groupId);
    }

  }
  async imgreview(arrimgreview, indeximgreview, CustomerName, DateStayed) {
    this.searchhotel.arrimgreview = arrimgreview;
    this.searchhotel.indexreviewimg = indeximgreview;
    this.searchhotel.cusnamereview = CustomerName;
    this.searchhotel.datereview = DateStayed;
    this.searchhotel.openFromTopReviewList = false;
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: HotelreviewsimagePage,
      });
    modal.present();
  }

  scrollToTopGroup(value, groupId) {
    //scroll to top of group
    setTimeout(() => {
      var objHeight = value == 2 ? $('.div-show-' + groupId) : $('.div-hide-' + groupId);
      if (objHeight && objHeight.length > 0) {
        var h = 0;
        if (groupId == 0) {
          h = objHeight.offsetParent()[0].offsetTop - 50;
        } else {
          let idx = groupId - 1;
          var groupHeight = 0;
          for (let i = 0; i < groupId; i++) {
            groupHeight += $('.group-' + i).parent()[0].offsetHeight;
          }
          h = objHeight.offsetParent()[0].offsetTop - 50 + groupHeight;
        }
        if (this.content) {
          this.content.scrollToPoint(0, h, 500);
        }

      }
    }, 100)
  }
  filterMealType(item) {
    this.loadcomplete = false;
    this.hotelRoomClasses = [];
    this.hotelRoomClassesFS = [];
    this.emptyroom = false;
    for (let i = 0; i < this.arrMeal.length; i++) {
      if (item.Code == this.arrMeal[i].Code) {
        this.arrMeal[i].ischeck = true;
        break;
      }
    }
    this.getdataroom();
  }
  notfilterMealType(item) {
    this.loadcomplete = false;
    this.hotelRoomClasses = [];
    this.hotelRoomClassesFS = [];
    this.emptyroom = false;
    for (let i = 0; i < this.arrMeal.length; i++) {
      if (item.Code == this.arrMeal[i].Code) {
        this.arrMeal[i].ischeck = false;
        break;
      }
    }
    this.getdataroom();
  }
  refreshToken() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
      
        let  headers =
        {
          'cache-control': 'no-cache',
          'content-type': 'application/json-patch+json',
          authorization: text
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims';
        se.gf.RequestApi('POST', strUrl, headers, {}, 'hoteldetail', 'refreshToken').then((data) => {
            var au = data;
            se.zone.run(() => {
              se.storage.remove('auth_token');
              se.storage.set('auth_token', au.auth_token);
              var decoded = jwt_decode<any>(au.auth_token);
              se.storage.remove('point');
              se.storage.set('point', decoded.point);
              se.router.navigateByUrl('/carcombo');
            })
          
        })
      }
    })
  }
  changeinfo() {
    if (!this.loadcomplete) {
      this.presentToastwarming('Giá đang được cập nhật, xin vui lòng đợi trong giây lát!');
      return;
    }
   //this.resetLoadingDefault();
    this.valueGlobal.backValue = 'popupinfobkg';
    this.searchhotel.changeInfoFromPage = '';
    this.searchhotel.CheckInDate = this.cin;
    this.searchhotel.CheckOutDate = this.cout;
    this.searchhotel.adult = this.adults;
    this.searchhotel.child = this.child;
    this.searchhotel.arrchild = this.arrchild;
    this.searchhotel.roomnumber = this.room;
    this.navCtrl.navigateForward('/popupinfobkg');
  }
  seemoreimgrv() {
    this.valueGlobal.notRefreshDetail = true;
    this.searchhotel.hotelID = this.HotelID;
    this.searchhotel.hotelName = this.hotelname;
    this.valueGlobal.backValue = "notrefreshdetail";
    this.navCtrl.navigateForward('/cusimgreview/1');
  }

  showInstallmentDetail() {
    var se = this;
    se.valueGlobal.backValue = "notrefreshdetail";
    se.valueGlobal.notRefreshDetail = true;
    se.navCtrl.navigateForward('/installmentdetail');
  }

  clearBlurEffect() {
    setTimeout(() => {
      $('img.preview').removeClass('preview').addClass('reveal');
    }, 500)
  }

  async changeDate() {
    let se = this;
    if (se.ischeckcalendar) {
      if (!se.loadcomplete) {
        se.presentToastwarming('Giá đang được cập nhật, xin vui lòng đợi trong giây lát!');
        return;
      }
      se.ischeckcalendar = false;
      se.searchhotel.changeInfoFromPage = 'hoteldetail';
      
      se.valueGlobal.ischeckCB=0;
      let modal = await se.modalCtrl.create({
        component: SelectDateRangePage,
      });
      se.searchhotel.formChangeDate = 2;
      se.searchhotel.CheckInDate = se.gf.getCinIsoDate(se.cin);
      se.searchhotel.CheckOutDate = se.gf.getCinIsoDate(se.cout);
      se.bookCombo.CheckInDate = se.gf.getCinIsoDate(se.cin);
      se.bookCombo.CheckOutDate = se.gf.getCinIsoDate(se.cout);
      modal.present().then(() => {
        se.ischeckcalendar = true;
      });

      const event: any = await modal.onDidDismiss();
      if (event && event.data) {
        se.resetLoadingDefault();
        se.changedate = true;
        se.hasComboRoom = false;
        se.comboprice = se.combopriceontitle;
        se.showpopup = true;
        se.ischeck = true;
        se.guest = se.adults + (se.child ? se.child : 0);
        if (!se.guest) {
          se.guest = 2;
        }
        if (se.comboid) {
          se.getDetailCombo(se.comboid);
        }
        se.getdata(false);

        se.setCacheHotel();
        se.gf.setCacheSearchHotelInfo({checkInDate: se.searchhotel.CheckInDate, checkOutDate: se.searchhotel.CheckOutDate, adult: se.searchhotel.adult, child: se.searchhotel.child, childAge: se.searchhotel.arrchild, roomNumber: se.searchhotel.roomnumber});
        se.storage.set('hasChangeDate', true);
        se.searchhotel.publicChangeInfoHotelList(1);
      }

    }
  }

  resetLoadingDefault(){
    var se = this;
    se.zone.run(() => {
      se.loadpricecombodone = false;
      se.loadcomplete = false;
      se.hotelRoomClasses = [];
      se.hotelRoomClassesFS = [];
      se.emptyroom = false;
      se.flashSaleEndDate = null;
      se.allowbookcombofc = true;
      se.searchhotel.ischeckBOD = false;
      se.valueGlobal.notRefreshDetail = false;
      se.ischeckBOD = false;
      se.checkBODdone = false;
      se.mealtypegrouplist = [];
    });
  }
  async showVip(){
    this.alert = await this.alertCtrl.create({
     header:'Vui lòng nhập mã ưu đãi',
     cssClass: 'action-sheets-flight-cathay',
     inputs: [{
      // placeholder: 'Your placeholder..',
      type: 'text',
      name: 'yourInputName', 
      // value: notification.message
    }],
     buttons: [
      {
        text: 'Quay lại',
        cssClass:"btn-cancel",
        handler: () => {
          
        }
      },
       {
         text: 'Kích hoạt mã',
         cssClass:"btn-ok",
         handler: (alertData) => {
          console.log(alertData.yourInputName);
         }
       }
       
     ]
     
   });
   this.alert.present();
  }

  checkRoomFsale(){
    let ListRoomClassestemp:any=[];
    this.bookCombo.ischeckShowupgrade=false;
    for (var i = 0; i < this.hotelRoomClasses.length; i++) {
      for (let j = 0; j < this.hotelRoomClasses[i].MealTypeRates.length; j++) {
        const element = this.hotelRoomClasses[i].MealTypeRates[j];
        if (element.IsFlashSale == true && element.Status != 'IP') {
         ListRoomClassestemp.push(this.hotelRoomClasses[i]);
        }
        
      }
    }
    if (ListRoomClassestemp.length>1) {
      this.bookCombo.ischeckShowupgrade=true;
    }
  }
  async upgradeRoom(){
    var se = this;
    se.activityService.objFlightComboUpgrade = {};
    // se.activityService.objFlightComboUpgrade.Rooms =this.jsonroom2.Hotels[0].RoomClasses;
    se.activityService.objFlightComboUpgrade.CurrentRoom = se.elementMealtype;
    se.activityService.objFlightComboUpgrade.CurrentRoomIndex = se.indexMealTypeRates;
    this.bookCombo.FormParam = this.formParam;
    se.valueGlobal.backValue = "hotelupgraderoom";
    se.valueGlobal.notRefreshDetail=true;
    se.navCtrl.navigateForward('/hotelupgraderoom');
  }
  
  updateRoomChange(dataRoomChange) {
    var se = this;
    this.objroomfsale=[];
    se.comboprice=dataRoomChange.itemroom.MealTypeRates[dataRoomChange.index].PriceAvgPlusTAStr;
    se.roomCombo = dataRoomChange.itemroom.ClassName;
    se.bookCombo.roomNb = dataRoomChange.itemroom.TotalRoom;
    se.elementMealtype=dataRoomChange.itemroom.MealTypeRates[dataRoomChange.index];
    this.objroomfsale.push(dataRoomChange.itemroom.MealTypeRates[dataRoomChange.index]);
     if (se.objroomfsale[0].Status == 'RQ' || se.objroomfsale[0].Supplier == 'B2B') {
          se.ischeckcbfs = false;
        }else{
          se.ischeckcbfs = true;
        }
    this.indexMealTypeRates=dataRoomChange.index;
    this.arrroomFS = [];
    this.arrroomFS.push(dataRoomChange.itemroom);
  }

  loadUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        let headers =
          {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
          }
        let strUrl = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo';
        se.gf.RequestApi('GET', strUrl, headers, {}, 'Tab5', 'loadUserInfo').then((data) => {
          if (data.statusCode == 401) {
            se.storage.get('jti').then((memberid) => {
              se.storage.get('deviceToken').then((devicetoken) => {
                se.gf.refreshToken(memberid, devicetoken).then((token) =>{
                  setTimeout(()=>{
                    se.loadUserInfoRefresh(token);
                  },100)
                });

              })
            })
          }
          else {
            if (data) {
              se.zone.run(() => {
                se.isShowPrice = data.showPrice;
                se.storage.set('userInfoData', data);
              })
            }
          }
        });
      }else{
        se.zone.run(()=>{
          se.loginuser = null;
        })
      }
    })
  }

  loadUserInfoRefresh(token) {
    var se = this;
        if (token) {
            var text = "Bearer " + token;
            let urlStr = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo';
            let headers = { 
              'cache-control': 'no-cache',
              'content-type': 'application/json',
              authorization: text
            };
            this.gf.RequestApi('GET', urlStr, headers, {}, 'tab5', 'loadUserInfoRefresh').then((data)=>{
                    if (data) {
                        se.storage.remove('userInfoData').then(()=>{
                          se.storage.set('userInfoData', data);
                        });
                    }
                
            });
        } 
}
/***
   * PDANH  18/06/2022
   */
 async requestRoom(id, MealTypeRates, indexme, roomName, RoomType, roomClass) {
  var se = this;
  if(MealTypeRates.MSG) {
    se.gf.showToastWarning(MealTypeRates.MSG);
    return;
  }
  se.valueGlobal.notRefreshDetail = true;
  se.roomvalue = MealTypeRates.TotalRoom;
  se.arrroom = [];
  for (let i = 0; i < se.hotelRoomClasses.length; i++) {
    if (id == se.hotelRoomClasses[i].Rooms[0].RoomID && MealTypeRates.TotalRoom == se.hotelRoomClasses[i].TotalRoom) {
      se.arrroom.push(se.hotelRoomClasses[i]);
      se.indexroom = i;
      break;
    }
  }
  
  var date1 = new Date(se.gf.getCinIsoDate(se.cin));
  var date2 = new Date(se.gf.getCinIsoDate(se.cout));
  var timeDiff = Math.abs(date2.getTime() - date1.getTime());
  se.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));

  se.booking.CheckInDate = se.cin;
  se.booking.CheckOutDate = se.cout,
    se.booking.roomNb = se.room,
    se.booking.Adults = se.adults,
    se.booking.Child = se.child,
    se.booking.CName = '',
    se.booking.CEmail = se.usermail,
    se.booking.cost = MealTypeRates.PriceAvgPlusTAStr,
    se.booking.indexroom = se.indexroom,
    se.booking.indexmealtype = indexme,
    se.booking.HotelId = se.HotelID,
    se.Roomif.RoomId = id,
    se.booking.HotelName = se.name,
    se.booking.RoomName = roomName,
    se.Roomif.Address = se.Address,
    se.Roomif.dur = se.duration,
    se.Roomif.arrroom = se.arrroom,
    se.Roomif.roomnumber = MealTypeRates.TotalRoom,
    se.Roomif.roomtype = MealTypeRates,
    se.Roomif.jsonroom = {...se.jsonroom2.Hotels[0]},
    se.Roomif.imgHotel = se.imgHotel;
    se.Roomif.objMealType = MealTypeRates;
    se.Roomif.HotelRoomHBedReservationRequest = JSON.stringify(se.arrroom[0].HotelRoomHBedReservationRequest);
    se.Roomif.arrrbed = [];
    se.Roomif.imgRoom = se.arrroom[0].Rooms[0].ImagesMaxWidth320;
    se.Roomif.RoomClass = roomClass;
    se.searchhotel.adult = se.adults;
    se.searchhotel.child = se.child;
    se.searchhotel.roomnumber = se.room;
    se.searchhotel.CheckInDate = se.cin;
    se.searchhotel.CheckOutDate = se.cout;
    se.booking.code = se.hotelcode;
    se.bookCombo.ComboId = -1;
    se.bookCombo.ComboTitle = "";
    se.Roomif.textcancel = "";
    se.booking.FormParam = se.formParam;
    se.Roomif.ExcludeVAT = se.ExcludeVAT;
    se.bookCombo.ischeckShowupgrade=false;

    if (!this.ischeckBOD) {
      const modal: HTMLIonModalElement =
        await this.modalCtrl.create({
          component: RequestRoomPage
        });
      modal.present();

      modal.onDidDismiss().then((data: OverlayEventDetail) => {
        var se = this;
       
          se.zone.run(() => {
            //this.getDetailCombo(null);
            se.cin = se.searchhotel.CheckInDate;
            se.cout = se.searchhotel.CheckOutDate;
            se.datecin = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckInDate));
            se.datecout = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
            se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
            se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');
            se.cindisplayhr = moment(se.datecin).format('DD/MM');
            se.coutdisplayhr = moment(se.datecout).format('DD/MM');
            if (se.searchhotel.child) {
              se.child = se.searchhotel.child;
            }
            se.changedate = true;
            se.hasComboRoom = false;
            se.comboprice = se.combopriceontitle;
            se.showpopup = true;
            se.ischeck = true;
            se.loadcomplete = false;
            se.mealtypegrouplist = [];
            se.hotelRoomClasses = [];
            se.hotelRoomClassesFS = [];
            se.emptyroom = false;
            se.guest = se.searchhotel.adult + se.searchhotel.child;
            se.room = se.searchhotel.roomnumber ? se.searchhotel.roomnumber : se.room;
            se.child = se.searchhotel.child;
            se.adults = se.searchhotel.adult;
            if (se.searchhotel.CheckInDate) {
              var date1 = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckInDate));
              var date2 = new Date(se.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
              var timeDiff = Math.abs(date2.getTime() - date1.getTime());
              se.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
            }
            //se.scrollToTopwithvalue1();
            if (se.comboid) {
              se.getDetailCombo(se.comboid);
            }
            //se.getdataroom();
            se.checkPriceHotelDetail().then((check) => {
              if (check) {
                se.getdataroom();
              } else {
                se.mealtypegrouplist = [];
                se.hotelRoomClasses = [];
                se.hotelRoomClassesFS = [];
                se.emptyroom = true;
                se.ischeckoutofroom = false;
                se.loadcomplete = true;
                se.loadpricecombodone = true;
                se.loaddonecombo = true;
                se.ischeck = true;
                se.allowbookcombofc = false;
                se.allowbookcombofx = false;
              }
            });
          })
        
      })
    }
 }
  async showSlideImage(idx) {
    this.searchhotel.arrimgreview = this.slideData;
    this.searchhotel.indexreviewimg = idx;
    this.searchhotel.cusnamereview = '';
    this.searchhotel.datereview = '';
    this.searchhotel.tourDetailName = '';
    this.searchhotel.openFromTopReviewList = false;
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: HotelreviewsimagePage,
      });
    modal.present();
 }


 async showFullScreen(){
  this.searchhotel.tourDetailName = '';
  const modal: HTMLIonModalElement =
  await this.modalCtrl.create({
    component: HotelreviewsvideoPage,
  });
modal.present();
 }
 CheckHasInternal(Meal) {
  return Meal.filter((el) => { return el.Supplier == 'Internal' || el.Supplier  == 'B2B' }).length > 0 ? true : false;
}
}
