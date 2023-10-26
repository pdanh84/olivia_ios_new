import { Booking, Bookcombo, ValueGlobal, SearchHotel, RoomInfo } from './../providers/book-service';

import * as moment from 'moment';
import { Component, ViewChild, NgZone, ElementRef, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { NavController, ModalController, ToastController, AlertController, LoadingController, Platform,  IonRouterOutlet, ActionSheetController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AuthService } from '../providers/auth-service';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { C } from './../providers/constants';
import { GlobalFunction, ActivityService } from './../providers/globalfunction';
import { DomSanitizer } from '@angular/platform-browser';
import { IonContent } from '@ionic/angular';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { NetworkProvider } from '../network-provider.service';
//import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';
import { flightService } from '../providers/flightService';

declare var google;
declare var infowindow;

@Component({
  selector: 'app-hotelcityitemdetail',
  templateUrl: 'hotelcityitemdetail.html',
  styleUrls: ['hotelcityitemdetail.scss'],
})
export class HotelCityItemDetailPage implements OnInit {
  @Input('myScrollVanish') scrollArea;
  @ViewChild('scrollArea') content: IonContent;
  @ViewChild('mySlider') slider:  ElementRef | undefined;;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild(IonRouterOutlet) routerOutlets: IonRouterOutlet;
  mapGoogle: any;
  slideData:any = [];
  hotelid: string;
  itemdetail: any;
  slideOpts = {
    zoom: false,
    loop: true,
    preloadImages: true,
    lazy: true
  };
  ischeck: boolean;
  public linkGoogleMap: any;
  loadcomplete: boolean;
  public itemsSk = [1, 2];
  coutslide =0;
  showAllFac: boolean = false;
  showMoreReviews: boolean =false;
  itemlike: boolean;
  HotelIDLike: any;
  dataListLike: any;
  arrimgreview: any[];
  countimgrv: number;
  constructor(public toastCtrl: ToastController, private alertCtrl: AlertController, public zone: NgZone, public modalCtrl: ModalController, public navCtrl: NavController,
    private http: HttpClientModule, public loadingCtrl: LoadingController, public Roomif: RoomInfo,
    public booking: Booking, public storage: Storage, public authService: AuthService, public platform: Platform, public bookCombo: Bookcombo, public value: ValueGlobal, public searchhotel: SearchHotel, public valueGlobal: ValueGlobal, private socialSharing: SocialSharing,
    public gf: GlobalFunction, private sanitizer: DomSanitizer, public router: Router, public actionsheetCtrl: ActionSheetController,
    public network: Network,
    public networkProvider: NetworkProvider,
    private activeRoute: ActivatedRoute,
    public activityService: ActivityService,
    //private splashScreen: SplashScreen,
    //private fb: Facebook,
    //private imgLoaderConfigService: ImageLoaderConfigService,
    public _flightService: flightService) {
      if(searchhotel.itemHotelCityDetail){
        this.loadData(searchhotel.itemHotelCityDetail);
      }
   
  }

  public async ngOnInit() {
    var se = this;
    
  }

  loadData(item){
    var se = this;
    if(item){
       
      se.itemdetail = item;
      if (item.HotelImages.length > 0 && (!se.slideData || se.slideData.length == 0)) {
        se.slideData = item.HotelImages;
        for (let index = 0; index < se.slideData.length; index++) {
          // if (index == 0) {
          //   se.imgHotel = (se.slideData[index].LinkImage.toLocaleString().trim().indexOf("http") != -1) ? se.slideData[index].LinkImage : 'https:' + se.slideData[index].LinkImage;
          // }
          se.slideData[index].LinkImage = (se.slideData[index].LinkImage.toLocaleString().trim().indexOf("http") == -1) ? 'https:' + se.slideData[index].LinkImage : se.slideData[index].LinkImage;
          se.slideData[index].coutslide = index;
        }
        se.itemdetail.lengthslide = item.HotelImages.length;
        se.ischeck = true;
      }
      else {
        let itemavatar= { LinkImage: item.Avatar }
        se.slideData.push(itemavatar);
      }

      if(se.itemdetail && se.itemdetail.HotelReviews && se.itemdetail.HotelReviews.length >0){
        se.itemdetail.HotelReviews.forEach(element => {
          element.DateStayedDisplay = moment(element.DateStayed).format('DD-MM-YYYY');
        });
        
      }
      //Load all image reviews
      se.loadHotelImageReviews();
      if (se.HotelIDLike) {
        se.likeItem();
      }
      else {
        se.updateLikeStatus();
      }
      se.loadcomplete = true;
    }
  }

  seeAllFacility(type){
    var divFac = $('.hide-fac.d-list-item');
    this.showAllFac = !this.showAllFac;
    if(type == 1){
      if (divFac && divFac.length > 0) {
        for (let i = 0; i < divFac.length; i++) {
          $(divFac[i]).removeClass('cls-hidden').addClass('cls-visible');
        }
      }
      
    }else{
      if (divFac && divFac.length > 0) {
        for (let i = 0; i < divFac.length; i++) {
          $(divFac[i]).removeClass('cls-visible').addClass('cls-hidden');
        }
      }
    }
    this.scrollToDiv(type,'fac');
  }

  scrollToDiv(type, objecttype) {
    //scroll to top of group
    setTimeout(() => {
      var objHeight = objecttype == 'fac'? $('.show-fac.d-list-item').first() : $('.div-hide-review.div-hotelreview').first();
      if (objHeight && objHeight.length > 0) {
        var h = type ==1? objHeight[0].offsetTop + 50 : objHeight[0].offsetTop - 50;
        if (this.content) {
          this.content.scrollToPoint(0, h, 500);
        }

      }
    }, 100)
  }

 
  goback(){
    this.navCtrl.back();
  }

  onSlideChange() {
    //this.slider?.nativeElement.getActiveIndex().then(index => {
      let index = this.slider?.nativeElement.swiper.activeIndex;
      if (this.slideData[index]) {
        //this.hotelimg = this.slideData[index].LinkImage;
        this.coutslide = index;
      }
    //});
  }

  btnseemore(){
    var divReviews = $('.div-hide-review');
    this.showMoreReviews = !this.showMoreReviews;
    if(this.showMoreReviews){
      if (divReviews && divReviews.length > 0) {
        for (let i = 0; i < divReviews.length; i++) {
          $(divReviews[i]).removeClass('cls-hidden').addClass('cls-visible').addClass('mt25');
        }
      }
      
    }else{
      if (divReviews && divReviews.length > 0) {
        for (let i = 0; i < divReviews.length; i++) {
          $(divReviews[i]).removeClass('cls-visible').removeClass('mt25').addClass('cls-hidden');
        }
      }
    }
    this.scrollToDiv(this.showMoreReviews ? 1 : 2,'review');
  }
  /***
   * Share link hotel
   * PDANH 15/02/2019
   */
  share() {
    let url = "https://www.ivivu.com" + this.itemdetail.Url;
    this.socialSharing.share('','','', url).then(() => {
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
        //     //'postman-token': '89692e55-6555-1572-db28-4becc311f0ba',
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json',
        //     authorization: text
        //   }
        // };
        let urlPath = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteHotelByUser';
        let headers = {
          'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        };
        this.gf.RequestApi('POST', urlPath, headers, {}, 'hotelcityitem', 'loadDataHotelDetail').then((data)=>{
            if (data) {
              se.zone.run(() => {
                se.dataListLike = data;
                let like = false;
                //Kiểm tra có trong list like không
                if (se.dataListLike.length > 0) {
                  like = se.checkItemLiked(se.itemdetail.Id) == 1 ? true : false;
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
        //   body: { hotelId: se.itemdetail.Id },
        //   json: true
        // };
        let urlPath = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/AddFavouriteHotel';
        let headers = {
          'postman-token': '9fd84263-7323-0848-1711-8022616e1815',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        };
        this.gf.RequestApi('POST', urlPath, headers, {hotelId: se.itemdetail.Id}, 'hotelcityitem', 'likeItem').then((data)=>{

          se.HotelIDLike = '';
          se.zone.run(() => {
            setTimeout(() => {
              se.itemlike = true;
            }, 10)
          })
        });
      }
      else {
        se.HotelIDLike = se.itemdetail.Id;
        se.router.navigateByUrl('/login');
      }
    });
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
        //   body: { hotelId: se.itemdetail.HotelID },
        //   json: true
        // };

        let urlPath = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteHotelByUser';
        let headers = {
          'postman-token': 'a19ecc0a-cb83-4dd9-3fd5-71062937a931',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        };
        this.gf.RequestApi('POST', urlPath, headers, {hotelId: se.itemdetail.HotelID}, 'hotelcityitem', 'unlikeItem').then((data)=>{

          se.zone.run(() => {
            setTimeout(() => {
              se.itemlike = false;
            }, 10)
          })
        });
      }
      else {
        se.router.navigateByUrl('/login');
      }
    });
  }

  seemoreimgrv() {
    this.valueGlobal.notRefreshDetail = true;
    this.searchhotel.hotelID = this.itemdetail.Id;
    this.searchhotel.hotelName = this.itemdetail.Nam;
    this.navCtrl.navigateForward('/cusimgreview/1');
  }

  loadHotelImageReviews() {
    var se = this;
    if (se.itemdetail.Id) {
      let url = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetHotelImageReviews?hotelid=' + se.itemdetail.Id;
      se.gf.RequestApi('GET', url, {}, {}, 'hoteldetail', 'GetHotelImageReviews').then((data) => {
        if (data.data) {
          se.storage.set('hotelimagereviews_' + se.itemdetail.Id, data.data);
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

  done(){
    this._flightService.itemHotelCityAddHotel.emit({id: this.itemdetail.Id, value: true});
    this.navCtrl.back();
  }

}
