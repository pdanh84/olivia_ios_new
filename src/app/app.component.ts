import { HomePage } from './home/home.page';
import { Component, ViewChildren, QueryList, NgZone, OnInit } from '@angular/core';
import { Platform, IonRouterOutlet, ModalController, PopoverController, ActionSheetController, ToastController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SearchHotel,Booking, ValueGlobal } from'./providers/book-service';
import { GlobalFunction } from'./providers/globalfunction';
import { C } from './providers/constants';
import { Network } from '@capacitor/network';
import {
  ActionPerformed,
  DeliveredNotifications,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import {FCM} from '@capacitor-community/fcm';
import { Storage } from '@ionic/storage';
//import { FirebaseDynamicLinks } from '@awesome-cordova-plugins/firebase-dynamic-links/ngx';
import {
  FirebaseDynamicLinks,
  LinkConfig,
} from '@pantrist/capacitor-firebase-dynamic-links';
import { App } from '@capacitor/app';
import { codePush } from "cap-codepush";
import { OverlayEventDetail } from '@ionic/core';
//import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { flightService } from './providers/flightService';
import { MytripService } from './providers/mytrip-service.service';
import { tourService } from 'src/app/providers/tourService';
import { ticketService } from 'src/app/providers/ticketService';
import { Facebook } from '@awesome-cordova-plugins/facebook/ngx';
import { register } from 'swiper/element/bundle';
import { Browser } from '@capacitor/browser';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { FacebookLogin, FacebookLoginResponse } from '@capacitor-community/facebook-login';
import { InstallMode } from '@awesome-cordova-plugins/code-push/ngx';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  // set up hardware back button event.
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  disconnectSubscription:any;
  connectSubscription:any;
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  email: any;
  appversion: string="1.9.1";
  phone: any;
  countcart: any;
  hascachecart: boolean;
  enableCountFilter =0;
  allowShowCart: boolean;
  constructor(
    private platform: Platform,
    //private statusBar: StatusBarPlugin,
    public modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController,
    private router: Router,
    private toast: ToastController,
    private navCtrl: NavController,
    public searchhotel: SearchHotel,
    public gf: GlobalFunction,
    public booking: Booking,
    private storage: Storage,
    public valueGlobal: ValueGlobal,
    //private firebaseDynamicLinks: FirebaseDynamicLinks,
    private toastCrl: ToastController,
    private zone: NgZone,
    private toastCtrl: ToastController,
    //private deeplinks: Deeplinks,
    public _flightService: flightService,
    public _mytripservice: MytripService,public tourService: tourService,
    private fb: Facebook,
    public ticketService: ticketService
  ) {
    //console.log(performance.now());
    
    this.initializeApp();
    this.storage.create();
    

    this.storage.get('jti').then((memberid) => {
      this.storage.get('deviceToken').then((devicetoken) => {
        this.gf.refreshToken(memberid, devicetoken);
      })
    })
  }
  loadTopSale(Id) {
    let se = this;
    let url = C.urls.baseUrl.urlMobile+'/tour/api/TourApi/GetAllBooking24h';
    let headers = {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    se.gf.RequestApi('GET', url, headers, null, 'hometour', 'loadTopSale').then((res) => {
      se.tourService.listTopSale = res.Response;
      se.tourService.tourDetailId = Id;
      se.tourService.backPage = 'hometour';
      se.navCtrl.navigateForward('/tourdetail');
      //se.slideData = res.Response;
      //se.loaddatadone = true;
    })
  }
  async ngOnInit(){
    this.storage.create();
  }
  
  ionViewDidEnter() {
    
  }

  getToken() {
    
  }
  initializeApp() {
    
    this.platform.ready().then(async () => {
      //this.getToken();
      
      //codepush
      try {
        if(this.platform.is('iphone')){
          //codePush.sync({ installMode: InstallMode.ON_NEXT_RESUME, minimumBackgroundDuration: 60 * 2 }).subscribe((syncStatus) => console.log(syncStatus));
          codePush.sync({
            onSyncStatusChanged: (syncStatus) => {
              console.log(syncStatus);
            },
            updateDialog: { updateTitle: "Đang cập nhật lên phiên bản mới nhất!" },
            installMode: InstallMode.IMMEDIATE,
          });
        }
      } catch (error) {
        let objError = {
          page: 'appcomponent',
          func: 'autoupdate',
          message: 'error',
          content: error,
          type: "error",
      };
      C.writeErrorLog(objError,error);
      }
     
      try {
        if(this.platform.is('iphone')){
          PushNotifications.requestPermissions().then(result => {
            if (result.receive === 'granted') {
              // Register with Apple / Google to receive push via APNS/FCM
              PushNotifications.register();
            } else {
              // Show some error
            }
          });

          
  
          PushNotifications.addListener(
            'pushNotificationReceived',
            (notification: PushNotificationSchema) => {
              //alert('Push received: ' + JSON.stringify(notification));
            },
          );
      
          PushNotifications.addListener(
            'pushNotificationActionPerformed',
            (notification: ActionPerformed) => {
              let datanoti:any = notification;
             
                if(datanoti && datanoti.notification && datanoti.notification.data) {
                  let _data:any = datanoti.notification.data;
                     // we know the user launched the app by clicking on the notification
                     this.showNotification(_data);
                }
  
            },
          );

            FCM.getToken().then(token => {
              this.storage.get('auth_token').then((auth_token)=>{
                let deviceToken = (token && token.token) ? token.token: token;
                this.storage.set('deviceToken',token);
                if(deviceToken){
                  this.gf.pushTokenAndMemberID(auth_token, deviceToken, this.appversion);
                }
              })
            });
        }
        
        
      } catch (error) {
        
      }
      
      //phone
      this.storage.get('phone').then(data =>{
        if(data){
          this.phone = data;
        }
      })
      //get email
      this.storage.get('email').then(e =>{
        if(e){
          this.email = e;
        }
      })
      //Lấy app version
      // this.appVersion.getVersionNumber().then(version => {
      //   this.appversion=version;
      // })
      if(this.platform.is('iphone')){
        App.getInfo().then((info)=>{
          this.appversion = info.version;
        })
      }
  
      this.connectSubscription = await Network.getStatus();
      if(this.connectSubscription.connected){
        this.gf.setNetworkStatus(this.connectSubscription);
      }else{
        this.gf.setNetworkStatus(false);
        this.gf.showWarning('Không có kết nối mạng','Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng','Đóng');
      }
      if(this.platform.is('iphone')){
        this.createShortLink();
        FirebaseDynamicLinks.addListener('deepLinkOpen', (data) => {
          
        });
      }
      //Dynamiclink
      // this.firebaseDynamicLinks.onDynamicLink().subscribe((res:any)=>{
      //   console.log(res);
      //   if(res && res.deepLink){
      //     var arrLink = res.deepLink.split('?');
      //     if(arrLink && arrLink.length >1){
      //       var id = arrLink[1];
      //       this.valueGlobal.notRefreshDetail = false;
      //       this.navCtrl.navigateForward('/hoteldetail/' + id);
      //     }
      //   }
      // })
            //PDANH 19/07/2019: Push memberid & devicetoken
      // FCM.onTokenRefresh().subscribe(token =>{
      //   //PDANH 19/07/2019: Push memberid & devicetoken
      //   alert("mo app "+token)
      //     this.gf.pushTokenAndMemberID("", token, this.appversion);
      // })
     
      this.valueGlobal.countNotifi=0;
      if(this.platform.is('iphone')){
        await FirebaseAnalytics.enable();
        await FacebookLogin.setAdvertiserTrackingEnabled({enabled: true});
        await FacebookLogin.setAdvertiserIDCollectionEnabled({enabled: true});

        await StatusBar.setStyle({ style: Style.Light });
      }

      
    });
    
  }

  createShortLink(): Promise<string> {
    const config: LinkConfig = {
       domainUriPrefix: 'https://ivivudownload.page.link',
       uri: 'https://ivivudownload.page.link/ivivuapp',
    };
    return FirebaseDynamicLinks.createDynamicShortLink(config).then(link => link.value);
 }

  showNotification(data){
    //chuyển qua tab mytrip
    if(data && data.BookingCode && data.notifyAction && data.notifyAction != "cancel"){
      if(data.notifyAction == "sharereviewofhotel"){
        this.checkBookingReview(data).then((result) => {
          if (result) {
            this.navCtrl.navigateForward(['/app/tabs/tab3']);
            this.valueGlobal.notifyAction="sharereview"
            this.gf.setParams(data.bookingCode, 'notifiBookingCode');
          }else{
            alert("Chuyến đi của quý khách đã được đánh giá");
          }
        })
      }
      else if(data.NotifyType == "blog" && data.notifyAction == "blogofmytrip"){
        this.valueGlobal.backValue = "tab4";
        this.navCtrl.navigateForward("/blog/" + data.BookingCode);
      }
      else if(data.NotifyType == "fly" && data.notifyAction == "flychangeinfo"){
        this.navCtrl.navigateForward(['/app/tabs/tab3']);
        this.gf.setParams(data.BookingCode,'notifiBookingCode');
        this.gf.setParams(data.switchObj,'notifiSwitchObj');
      }
      else{
        this.gf.setParams(data.BookingCode,'notifiBookingCode');
        this.navCtrl.navigateForward(['/app/tabs/tab3']);
      }
    }else{
      if(data.dataLink){
        if (data.dataLink=='1') {
          this.valueGlobal.backValue = "homeflight"
        }
        //pdanh 16-10-2023:Thêm params noti trỏ link fb
        else if(data.dataLink.indexOf('fblink') != -1){
          let arr = data.dataLink.split('#');
          if(arr && arr.length ==2){
            this.openLink(arr[1]);
          }
        }
      //pdanh 17-10-2023: Sửa lại params noti bên vmb điều hướng vào home/search vmb
      //Dùng chung biến dataLink để không phải thêm biến flyNotify dưới CRM
      else if(data.dataLink.indexOf('flynotify') != -1){
        let arr = data.dataLink.split('#');
        if(arr && arr.length ==2 && arr[1] && arr[1] == 1){
              this._flightService.itemTabFlightActive.emit(true);
              this.valueGlobal.backValue = "homeflight";
              this.navCtrl.navigateForward('/tabs/tab1');
        }else if(arr && arr.length ==2 && arr[1]){
          let _params = arr[1];
          if(_params){
            this.gf.gotoFlightSearchPage(_params.split('&'));
          }
          
        }
      }
      else if(data.dataLink.indexOf('ticketdetail') != -1){
        setTimeout(()=>{
          let arr = data.dataLink.split(':');
          if(arr && arr.length ==2){
            this.ticketService.itemTicketDetail = {};
            this.ticketService.itemTicketDetail.experienceId = arr[1];
            this.ticketService.backPage = 'hometicket';
            this.navCtrl.navigateForward('/ticketdetail');
          }
        
        },300);
       
      }
      else if(data.dataLink.indexOf('blog') != -1){
        setTimeout(()=>{
          let arr = data.dataLink.split(':');
          if(arr && arr.length ==2){
            this.valueGlobal.backValue = "tab4";
            this.navCtrl.navigateForward("/blog/" +arr[1]);
          }
        
        },300);
       
      }
        else{
          if (data.updateNewVersion) {
            window.open('https://play.google.com/store/apps/details?id=iVIVU.com');
          }else{
            if(data.dataLink.indexOf('tourdetail') != -1){
              let arr = data.dataLink.replace('/','').split('/');
              if(arr && arr.length ==2){
                this.tourService.tourDetailId = arr[1];
                this.tourService.backPage = 'hometour';
                this.loadTopSale(arr[1]);
              }
            
            }
            
            else {
              this.navCtrl.navigateForward(data.dataLink);
            }
          }
        }
      
      }
      else if(data.flyNotify){
        this._flightService.itemTabFlightActive.emit(true);
        this.valueGlobal.backValue = "homeflight";
        this.navCtrl.navigateForward('/tabs/tab1');
      }
      else{
        //show notifi
        this.showToast(data.message);
      }
    }
    //this.loadNotificationAndUpdateState(data.BookingCode)
  }
  async openLink(url) {
    await Browser.open({url : url})
  }
  async showActionSheetNoti(data){
    var se = this;
    var iconStr='ic_home';
    var subClass = '';
    if(data.NotifyType == 'bookingbegoingcombotransfer'){
      iconStr = 'ic_bus2';
    }else if(data.NotifyType == 'blog')
    {
      iconStr = 'ic_message';
    }
    else if(data.notifyAction == 'bookingbegoingcombofly' || data.notifyAction == 'flychangeinfo')
    {
      iconStr = 'ic_paper';
    }
    if(data.notifyAction == 'waitingconfirmtopayment'){
      subClass = 'fixheight-90';
    }
    if(data.notifyAction == 'cancel'){
      subClass = 'fixheight-76';
    }
    if(data.notifyAction == 'flychangeinfo' || data.notifyAction == 'blogofmytrip'){
      subClass = 'fixheight-36';
    }

    if(data.dataLink){
      if(data.dataLink.indexOf('tourdetail') != -1){
        let arr = data.dataLink.replace('/','').split('/');
        if(arr && arr.length ==2){
          this.tourService.tourDetailId = arr[1];
          this.tourService.backPage = 'hometour';
          this.loadTopSale(arr[1]);
        }
      
      }else {
        this.navCtrl.navigateForward(data.dataLink);
      }
    }

    let actionSheet = await se.actionSheetCtrl.create({
      cssClass: 'action-sheets-notification '+iconStr+' '+subClass,
      header: data.title,
      mode: 'ios',
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
    setTimeout(()=>{
        actionSheet.dismiss(); 
    },5000)
  }

  async showToast(msg){
    let toast = await this.toastCrl.create({
        message: msg,
        position: 'top',
        duration: 5000
    })

    toast.present();
  }

  /**
   * Hàm show cảnh báo
   */
  async presentToastNotifi(msg) {
    const toast = await this.toast.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }

  showCart(){
    this.gf.hideStatusBar();
    //this.navCtrl.navigateForward('/foodbill');
  }

  async presentToastWarning(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      cssClass: 'cls-warning-orderfoodempty',
      
    });

    toast.present();
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

          se.gf.RequestApi('GET', C.urls.baseUrl.urlSVC3 + 'review?BookingId=' + trip.bookingCode, null, null, 'MyTrip', 'CheckBookingReview').then((data: any) => {
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
}
