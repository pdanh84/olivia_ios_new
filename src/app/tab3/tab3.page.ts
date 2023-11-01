
import { InsurrancepopoverPage } from './../insurrancepopover/insurrancepopover.page';

import { Component, NgZone, ViewChild, OnInit, Input, ElementRef } from '@angular/core';
import { NavController, ModalController, AlertController, Platform, IonContent,  LoadingController, PopoverController, ActionSheetController, ToastController } from '@ionic/angular';

import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { C } from './../providers/constants';
import { ValueGlobal, SearchHotel } from '../providers/book-service';
import { GlobalFunction, ActivityService } from './../providers/globalfunction';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NetworkProvider } from '../network-provider.service';

import { UserReviewsPage } from '../userreviews/userreviews';
import { OverlayEventDetail } from '@ionic/core';
import { UserFeedBackPage } from '../userfeedback/userfeedback';
import * as $ from 'jquery';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { InsurrancedetailPage } from '../insurrancedetail/insurrancedetail.page';
import { Subscription } from 'rxjs';
import { flightService } from '../providers/flightService';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { MytripService } from '../providers/mytrip-service.service';
import { BizTravelService } from '../providers/bizTravelService';
/**
 * Generated class for the MytripsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  @Input('myScrollVanish') scrollArea;
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('mySlider') slider:  ElementRef | undefined;;
  public listMyTrips = [];
  public listHistoryTrips = [];
  public listRequestTrips = [];
  public listAlltrips = [];
  public listSupport = [];
  public currentTrip = 0;
  public currentRQTrip = 0;
  public showCalCin = false;
  public showCalCout = false;
  public datecin: Date;
  public datecout: Date;
  public cindisplay; coutdisplay;
  public cinRQdisplay; coutRQdisplay;
  public cincombodeparturedisplay; cincomboarrivaldisplay; coutcombodeparturedisplay; coutcomboarrivaldisplay;
  public cincombodeparturelocationdisplay; cincomboarrivallocationdisplay; coutcombodeparturelocationdisplay; coutcomboarrivallocationdisplay;
  public cincombodeparturetimedisplay; cincomboarrivaltimedisplay; coutcombodeparturetimedisplay; coutcomboarrivaltimedisplay;
  public cincombodepartureflightnumberdisplay; cincomboarrivalflightnumberdisplay; coutcombodepartureflightnumberdisplay; coutcomboarrivalflightnumberdisplay;
  public cin; cout; coutthu; cinthu; numberOfDay = 0; numberOfRQDay = 0;
  public hasdata = false;
  public hasloaddata = false;
  public hasloadRQdata = false;
  public activeTabTrip = 1;
  public tabtrip: string = "nexttrip";
  public isShowConfirm = false;
  private tabBarHeight;
  private topOrBottom: string;
  private contentBox;
  public currentPosition = 0;
  public intervalID;
  public isRequestTrip = false;
  public isConnected;
  public loader: any;
  public myloader;
  topDealData = [];
  slide;
  Description: any;
  loginuser: any;
  mytripcount = 0;
  requestripcount = 0;
  historytripcount = 0;
  reloadcount = 0;
  arrHotelReviews: any[];
  nexttripcounttext = '';
  historytripcounttext = ''; popover; arrinsurrance = [];

  // arrchild = [{claimed: false,isClaim: false ,id: "CI19T4U00071",name: "Ninh Dương Lan Ngọc", identification: "123456789", address: "Hồ Chí Minh", birth: "09/12/1984"},
  // {claimed: false,isClaim: false ,id: "CI19T4U00072",name: "Ad Pham", identification: "123456789", address: "Hồ Chí Minh", birth: "09/12/1984"}];

  // arrInsurrance = [{claimed: false,isClaim: false ,id: "CI19T4U00069",name: "Phạm Đức Anh", identification: "123456789", address: "Hồ Chí Minh", birth: "09/12/1984"},
  // {claimed: false,isClaim: false ,id: "CI19T4U00070",name: "Đỗ Lê", identification: "123456789", address: "Hồ Chí Minh", birth: "31/01/1985"}]

  arrchildinsurrance: any = [];
  arrchild: any = [];
  private subscription: Subscription;
  listClaimed: any[];
  listClaimedFlightOriginal: any = [];
  firstload: any = true;
  departCodeDisplay: string;
  arrivalCodeDisplay: string;
  isFlyBooking: boolean = false;
  textDeparture: string;
  textRegionDepart: string;
  textRegionReturn: string;
  textAirpotDepart: string;
  textAirpotReturn: string;
  textReturn: string;
  textArrivalRegionDepart: string;
  textArrivalRegionReturn: string;
  textAirpotArrivalDepart: string;
  textAirpotArrivalReturn: string;
  pageIndex: any=1;
  pageSize: any=10;
  isBizAccount: boolean;
  constructor(public platform: Platform, public navCtrl: NavController, public searchhotel: SearchHotel, public popoverController: PopoverController,
    public storage: Storage, public zone: NgZone, public modalCtrl: ModalController, public iab: InAppBrowser,
    public alertCtrl: AlertController, public valueGlobal: ValueGlobal, public gf: GlobalFunction, public loadingCtrl: LoadingController,
    
    public networkProvider: NetworkProvider,
    private router: Router,
    private actionsheetCtrl: ActionSheetController,
    private activatedRoute: ActivatedRoute,
    public toastCtrl: ToastController,
    public activityService: ActivityService,
    public _flightService: flightService,public clipboard: Clipboard,
    public _mytripService: MytripService,
    public bizTravelService: BizTravelService) {
      
  }

  public async ngOnInit() {
    var se = this;
    this.bizTravelService.accountBizTravelChange.pipe().subscribe((check)=> {
      if(check == 1){
        this.loadUserInfo();
      }else if(check == 2){
        this.isBizAccount = false;
      }
    })
  }

  async ionViewWillEnter() {
    this.loadUserInfo();

  }

  /**
     * Load thông tin user
     */
   loadUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
            var text = "Bearer " + auth_token;
            var options = {
                method: 'GET',
                url: C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo',
                timeout: 10000, maxAttempts: 5, retryDelay: 2000,
                headers:
                {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    authorization: text
                }
            };
           
            this.gf.RequestApi('GET', options.url, options.headers, { }, 'tab3', 'loadUserInfo').then((data)=>{
                if (data && data.statusCode != 401) {
                    se.storage.remove('userInfoData');
                    se.storage.set('userInfoData', data);

                    if(data.bizAccount){
                      se.bizTravelService.bizAccount = data.bizAccount;
                      se.isBizAccount = true;
                    }else{
                      se.bizTravelService.bizAccount = null;
                      se.isBizAccount = false;
                    }
                    //this._mytripService.itemLoginUser.emit(1);
                    this._mytripService.publicLoadDataWhenLoginUserSubject(1);
                }
                else if (data && data.statusCode == 401) {
                  se.storage.get('jti').then((memberid) => {
                    se.storage.get('deviceToken').then((devicetoken) => {
                      se.gf.refreshToken(memberid, devicetoken).then((token) => {
                        setTimeout(() => {
                          se.loadUserInfo();
                        }, 100)
                      });
      
                    })
                  })
                }
                else{
                  se.isBizAccount = false;
                }
               
            });
        } 
    })
  }
}
