import { Booking, ValueGlobal } from './../providers/book-service';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Platform, IonTabBar, ActionSheetController, ToastController, IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SearchHotel } from 'src/app/providers/book-service';
import { NavController } from '@ionic/angular';
import { C } from './../providers/constants';
import { ActivityService, GlobalFunction } from './../providers/globalfunction';
import * as $ from 'jquery';
import { Badge } from '@capawesome/capacitor-badge';
import { Storage } from '@ionic/storage';
import { NetworkProvider } from '../network-provider.service';
import { flightService } from '../providers/flightService';
import { AppRoutingPreloaderService } from '../providers/AppRoutingPreloaderService';
import { MytripService } from '../providers/mytrip-service.service';
import * as moment from 'moment';
import { tourService } from 'src/app/providers/tourService';
import { Location } from '@angular/common';
import { Browser } from '@capacitor/browser';
var document:any;
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  @ViewChild(IonTabBar) tabBar: IonTabBar;
  countmessage = 0;
  intervalNoti;
  phone: any;
  email: any;
  appversion: any;
  countclaim: any;
  username: any;
  listStatus: any;
  constructor(public platform: Platform, private router: Router, private activeRoute: ActivatedRoute, private modalCtrl: ModalController,
    public searchhotel: SearchHotel, private navCtrl: NavController, public gf: GlobalFunction, public booking: Booking, private storage: Storage,
    private zone: NgZone,
    public valueGlobal: ValueGlobal,
    private networkProvider: NetworkProvider,
    private actionSheetCtrl: ActionSheetController,
    private toastCrl: ToastController,
    public _flightService: flightService,
    public routingService: AppRoutingPreloaderService,
    //private splashScreen: SplashScreen,
    public activityService: ActivityService,
    public _mytripservice: MytripService,public tourService: tourService,
    private location: Location,
    private routerOutlet: IonRouterOutlet) { }

  async ionViewDidEnter() {
    //await this.routingService.preloadRoute('homeflight');
    //this.splashScreen.hide();
    //Lấy app version
    this.appversion= await this.gf.getAppVersion();
  }

  ngOnInit() {
    this.storage.get('phone').then(data => {
      if (data) {
        this.phone = data;
      }
    })
    //get email
    this.storage.get('email').then(e => {
      if (e) {
        this.email = e;
      }
    })
    //get username
    this.storage.get('username').then(username => {
      if (username) {
        this.username = username;
      }
    })
    

    //Xử lý nút back của dt
    try {
      this.platform.ready().then(() => {
        this.zone.run(()=>{
          this.platform.backButton.subscribeWithPriority(-1, async(ev) => {
            if(!this.routerOutlet.canGoBack()){
              navigator['app'].exitApp();
            }
          })
        })
        
      })
    }
    catch (error:any) {
      error.page = "tabspage";
      error.func = "handleBackButton";
      error.param = this.router.url;
      C.writeErrorLog(error, null);
    }
  }

  async clickedElement(e: any) {
    var obj: any = e.currentTarget;
    var items = $(obj).siblings('ion-tab-button');
    if (items && items.length > 0) {
      for (let index = 0; index < items.length; index++) {
        const element = items[index];
        $(element).attr('aria-selected', 'false');
      }
    }
    //Count noti
    if (obj.id != "tab-button-tab4") {
      this.loadUserNotificationStatus();
    }
    //Ẩn statusbar
    if (obj.id != "tab-button-tab1") {
      var se = this;
      let el = window.document.getElementsByClassName('div-statusbar-float');
      el[0].classList.remove('float-statusbar-enabled');
      el[0].classList.add('float-statusbar-disabled');
    }
    //Count claim
    setTimeout(() => {
      this.countClaim();
    }, 5000)
  }

  countClaim() {
    this.zone.run(() => {
      this.countclaim = this.valueGlobal.countclaim;
    })
  }

  ionViewWillLeave() {
    this.zone.run(() => {
      clearInterval(this.intervalNoti);
    })
  }

  showNotification(data) {
    //chuyển qua tab mytrip
    if (data && data.BookingCode && data.notifyAction != "cancel") {
      if (data.notifyAction == "sharereviewofhotel") {
        // this.setNotification(data,"other");
        this.navCtrl.navigateForward(['/app/tabs/tab3']);
        this.gf.setParams(data.BookingCode, 'notifiBookingCode');
        this.gf.setParams(2, 'selectedTab3');
      }
      else if (data.NotifyType == "blog" && data.notifyAction == "blogofmytrip") {
        // this.setNotification(data,"other");
        this.valueGlobal.backValue = "tab4";
        this.navCtrl.navigateForward("/blog/" + data.BookingCode);
      }
      else if (data.NotifyType == "fly" && data.notifyAction == "flychangeinfo") {
        // this.setNotification(data,"product");
        this.navCtrl.navigateForward(['/app/tabs/tab3']);
        this.gf.setParams(data.BookingCode, 'notifiBookingCode');
        this.gf.setParams(data.switchObj, 'notifiSwitchObj');
      }
      else if (data.NotifyType == "booking" && data.notifyAction == "paymented") {
        // this.setNotification(data,"product");
        this.navCtrl.navigateForward(['/app/tabs/tab3']);
        this.gf.setParams(data.BookingCode, 'notifiBookingCode');
      }
      else {
        this.gf.setParams(data.BookingCode, 'notifiBookingCode');
        //this.navCtrl.navigateForward(['/app/tabs/tab3']);
        this.mapBookingAndPayment(data.BookingCode);
      }
    } else {
      //show notifi
      //this.showToast(data.message);
      if (data.updateNewVersion) {
        // this.setNotification(data,"product");
        this.gotoPlayStore();
      }
      else if (data.activeTab) {
        // this.setNotification(data,"product");
        this.valueGlobal.backValue = "homeflight";
      }
      else if (data.dataLink) {
        if(data.dataLink.indexOf('tourdetail') != -1){
          let arr = data.dataLink.replace('/','').split('/');
          if(arr && arr.length ==2){
            this.tourService.tourDetailId = arr[1];
            this.tourService.backPage = 'hometour';
            this.navCtrl.navigateForward('/tourdetail');
          }
        
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
        else {
          this.navCtrl.navigateForward(data.dataLink);
        }
      }
      else if (data.flyNotify) {
        this._flightService.itemTabFlightActive.emit(true);
        this.valueGlobal.backValue = "homeflight";
        this.navCtrl.navigateForward('/app/tabs/tab1');
      }
      else if (data.customParamNoti) {
        let msg = '';
        msg = data.message;
        if (msg.indexOf('@param1') != -1) {
          msg.replace('@param1', data.param1);
        }
        if (msg.indexOf('@param2') != -1) {
          msg.replace('@param2', data.param2);
        }
        if (msg.indexOf('@param3') != -1) {
          msg.replace('@param3', data.param3);
        }
        if (msg.indexOf('@param4') != -1) {
          msg.replace('@param4', data.param4);
        }
        if (msg.indexOf('@param5') != -1) {
          msg.replace('@param5', data.param5);
        }
        if (msg.indexOf('@param6') != -1) {
          msg.replace('@param6', data.param6);
        }
        if (msg.indexOf('@param7') != -1) {
          msg.replace('@param7', data.param7);
        }
        if (msg.indexOf('@param8') != -1) {
          msg.replace('@param8', data.param8);
        }
        if (msg.indexOf('@param9') != -1) {
          msg.replace('@param9', data.param9);
        }
        if (msg.indexOf('@param10') != -1) {
          msg.replace('@param10', data.param10);
        }
        if (msg.indexOf('Chúc') != -1) {
          msg.replace('Chúc Quý Khách Hàng', 'Chúc ' + this.username);
        }
        this.showToast(msg);
      }

      else {
        this.showToast(data.message);
      }
    }
    this.loadNotificationAndUpdateState(data.BookingCode)
  }

  async showActionSheetNoti(data) {
    var se = this;
    var iconStr = 'ic_home';
    var subClass = '';
    if (data.NotifyType == 'bookingbegoingcombotransfer') {
      iconStr = 'ic_bus2';
    } else if (data.NotifyType == 'blog' || data.notifyAction == 'blogofmytrip') {
      // se.setNotification(data,"other");
      iconStr = 'ic_message';
    }
    else if (data.notifyAction == 'bookingbegoingcombofly' || data.notifyAction == 'flychangeinfo') {
      iconStr = 'ic_paper';
    }
    if (data.notifyAction == 'waitingconfirmtopayment') {
      subClass = 'fixheight-90';
    }

    if (data.notifyAction == 'cancel') {
      subClass = 'fixheight-76';
    }
    if (data.notifyAction == 'flychangeinfo' || data.notifyAction == 'blogofmytrip') {
      subClass = 'fixheight-36';
    }

    var msg = data.message;
    if (data.dataLink) {
      // se.setNotification(data,"product");
      if(data.dataLink.indexOf('tourdetail') != -1){
        let arr = data.dataLink.replace('/','').split('/');
        if(arr && arr.length ==2){
          this.tourService.tourDetailId = arr[1];
          this.tourService.backPage = 'hometour';
          this.navCtrl.navigateForward('/tourdetail');
        }
      
      }else {
        this.navCtrl.navigateForward(data.dataLink);
      }
    }
    else if (data.flyNotify) {
      se._flightService.itemTabFlightActive.emit(true);
      se.valueGlobal.backValue = "homeflight";
      se.navCtrl.navigateForward('/app/tabs/tab1');
    }
    else if (data.activeTab) {
      se.valueGlobal.backValue = "homeflight";
    }
    else if (data.customParamNoti) {
      if (msg.indexOf('@param1') != -1) {
        msg = msg.replace('@param1', data.param1);
      }
      if (msg.indexOf('@param2') != -1) {
        msg = msg.replace('@param2', data.param2);
      }
      if (msg.indexOf('@param3') != -1) {
        msg = msg.replace('@param3', data.param3);
      }
      if (msg.indexOf('@param4') != -1) {
        msg = msg.replace('@param4', data.param4);
      }
      if (msg.indexOf('@param5') != -1) {
        msg = msg.replace('@param5', data.param5);
      }
      if (msg.indexOf('@param6') != -1) {
        msg = msg.replace('@param6', data.param6);
      }
      if (msg.indexOf('@param7') != -1) {
        msg = msg.replace('@param7', data.param7);
      }
      if (msg.indexOf('@param8') != -1) {
        msg = msg.replace('@param8', data.param8);
      }
      if (msg.indexOf('@param9') != -1) {
        msg = msg.replace('@param9', data.param9);
      }
      if (msg.indexOf('@param10') != -1) {
        msg = msg.replace('@param10', data.param10);
      }
      if (msg.indexOf('Chúc') != -1) {
        msg = msg.replace('Chúc Quý Khách Hàng', 'Chúc ' + this.username);
      }
      subClass = 'fixheight-44';
      if (data.height) {
        subClass = 'fixheight-' + data.height;
      }
    }

    if(data.notifyType == "alert"){
      se.presentToastNotifi(data.message);
    }else{
      let actionSheet = await se.actionSheetCtrl.create({
        cssClass: 'action-sheets-notification ' + iconStr + ' ' + subClass,
        header: data.title,
        mode: 'ios',
        animated: true,
        backdropDismiss: true,
        buttons: [
          {
            text: msg,
            handler: () => {
              se.showNotification(data);
            }
          }
        ]
      });
      actionSheet.present();
      setTimeout(() => {
        actionSheet.dismiss();
      }, 5000)
    }
  }

/**
   * Hàm show cảnh báo
   */
 async presentToastNotifi(msg) {
  const toast = await this.toastCrl.create({
    message: msg,
    duration: 3000,
    position: 'top',
  });
  toast.present();
}

  async showToast(msg) {
    let toast = await this.toastCrl.create({
      message: msg,
      position: 'top',
      duration: 5000
    })

    toast.present();
  }

  /**
     * Load thông báo của user
     */
  loadNotificationAndUpdateState(bookingCode) {
    var se = this;

    if (!this.networkProvider.isOnline()) {
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      return;
    }
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
          let headers =
          {
              'cache-control': 'no-cache',
              'accept': 'application/json',
              authorization: text
          }
          let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetNotificationByUserIVV';
          se.gf.RequestApi('GET', strUrl, headers, {}, 'Tabs', 'loadNotificationAndUpdateState').then((data) => {
            if (data && data != "[]") {
              if (data && data.length > 0) {
                console.log(data);
                data.forEach(element => {
                  if (element.bookingCode == bookingCode) {
                    se.callUpdateStatus(element);
                  }
                });
              }
            }
          
        });
      }
    })
  }

  /**
   * Hàm update trạng thái đã đọc thông báo
   */
  callUpdateStatus(item) {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
       
          let headers =
          {
              'cache-control': 'no-cache',
              'accept': 'application/json',
              authorization: text
          };
          let body = {
                "id": item.id,
                "phoneNumber": se.phone,
                "email": se.email,
                "memberId": auth_token,
                "switchTypeOf": item.NotifyType,
                "switchAction": item.notifyAction,
                "switchObj": item.switchObj,
                "title": item.title,
                "message": item.message,
                "status": 1
              }
          let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/UpdateStatusNotificationOfUser';
          se.gf.RequestApi('POST', strUrl, headers, body, 'Tabs', 'callUpdateStatus').then((data) => {
            if (data && data != "[]") {
            se.loadUserNotification();
          }

        });
      }
    })
  }

  ionViewWillEnter() {
    // let datatest = {title: 'Đặt phòng thành công!',
    // notifyAction: 'paymentConfirm',
    // message: 'Bạn đã thanh toán 2.100.000đ cho mã nhận phòng IVIVU755884 tại khu nghỉ dưỡng The Grand Hồ Tràm Strip Vũng Tàu. Xác nhận đặt phòng sẽ gửi đến email Quý khách.'
    // };
    // this.showActionSheetNoti(datatest);

    //Count noti
    this.loadUserNotificationStatus();
    //count claim
    setTimeout(() => {
      this.countClaim();
    }, 5000)

    if ($(".div-wraper-food").hasClass("cls-visible")) {
      if (window.document.getElementsByClassName("homefood-footer").length > 0) {
        window.document.getElementsByClassName("homefood-footer")[0]['style'].display = 'block';
      }
    }
    //////////////
    var el = window.document.getElementsByClassName('tab-button');
    $('.tab-button').click(e => this.clickedElement(e));
    //Xử lý nút back của dt
    this.platform.ready().then(() => {
    
    })
    //gọi refresh token
    //this.refreshToken();
  }
  loadUserNotificationStatus() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
          let headers =
          {
              'cache-control': 'no-cache',
              'accept': 'application/json',
              authorization: text
          }
          let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetNotificationStatus';
          se.gf.RequestApi('GET', strUrl, headers, {}, 'homeflight', 'getdata').then((data) => {
            if (data && data != "[]") {
              if (data && data.length > 0) {
                se.listStatus=data;
              }
            
            }
            se.loadUserNotification();
        });
      } else {
        se.valueGlobal.countNotifi = 0;
        se.countmessage = 0;
      }
    })
    // this.handlerBackButton();
  }
  /**
     * Load thông báo của user
     */
  loadUserNotification() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
          let headers =
          {
              'cache-control': 'no-cache',
              'accept': 'application/json',
              authorization: text
          }
          let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetNotificationByUserIVV';
          se.gf.RequestApi('GET', strUrl, headers, {}, 'homeflight', 'getdata').then((data) => {
            if (data && data != "[]") {
              if (data && data.length > 0) {
                se.zone.run(async () => {
                  let timeCheckAll = await se.storage.get('timeCheckAll');
                  data.forEach(element =>{
                    if (element.memberId=='alluser') {
                      element.status=0;
                      if (se.listStatus && se.listStatus.length>0) {
                          if(se.checkItemInArray(element.id)){
                              element.status=1;
                            }
                      }
                    }
                    if(timeCheckAll){
                      element.hascheckall = moment(timeCheckAll).diff(element.created, 'second') >0;
                    }
                  })
                  let countNoti = data.filter(item=>{ return item.status == 0 && !item.hascheckall }).length;
                          // if(se.valueGlobal.updatedLastestVersion){
                          //   countNoti ++;
                          // }
                          if(countNoti <0){
                            countNoti =0;
                          }
            
                  se.valueGlobal.countNotifi = countNoti;
                  se.countmessage = se.valueGlobal.countNotifi;
                  await Badge.set({count: countNoti});

                })
              }
            
          }
        });
      } else {
        se.valueGlobal.countNotifi = 0;
        se.countmessage = 0;
      }
    })
    // this.handlerBackButton();
  }
  checkItemInArray(id){
    
    var co=false;
    for (let i = 0; i < this.listStatus.length; i++) {
      const element = this.listStatus[i];
      if (element==id) {
        co= true;
        break;
      }
    }
    return co;
  }
  gotoPlayStore() {
    window.open('https://play.google.com/store/apps/details?id=iVIVU.com');
  }

  refreshToken() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
       
          let headers =
          {
              'cache-control': 'no-cache',
              'accept': 'application/json',
              authorization: text
          }
          let strUrl = C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims';
          se.gf.RequestApi('GET', strUrl, headers, {}, 'homeflight', 'getdata').then((data) => {
            var json = data;
            if (json.auth_token) {
              se.storage.remove('auth_token');
              se.storage.set("auth_token", json.auth_token);
            }
          
        })
      }
    })
  }

  mapBookingAndPayment(BookingCode: any) {
    let se = this;
    if (BookingCode) {
      //Map số bkg trong listtrip để focus vào bkg được notifi
      se.getdatamytrip().then((data) => {
        se.gf.hideLoading();
        var idxMap = data.map((item, index) => {
          return item.booking_id == BookingCode;
        });
        var itemMap = data.filter((item) => { return item.booking_id == BookingCode });
        if (itemMap && itemMap.length > 0) {
          let idx = idxMap.findIndex((el) => { return el == true });
          //Đã thanh toán về mytrip
          se.checkPayment(BookingCode, itemMap[0], idx);

        }
      })

    }
  }
  setActiveTabHome() {
    this._mytripservice.rootPage = "homehotel";
    $(".div-wraper-home").removeClass("cls-disabled").addClass("cls-visible");

    this.valueGlobal.backValue = "";
  }

  getdatamytrip(): Promise<any> {
    var se = this;
    se.gf.showLoading();
    return new Promise((resolve, reject) => {
      se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
          var text = "Bearer " + auth_token;
            let headers =
            {
                'cache-control': 'no-cache',
                'accept': 'application/json',
                authorization: text
            }
            let strUrl = C.urls.baseUrl.urlMobile + '/api/dashboard/getMyTripPaging?getall=true&getHistory=false&pageIndex=1&pageSize=25';
            se.gf.RequestApi('GET', strUrl, headers, {}, 'homeflight', 'getdata').then((data) => {
              if (data) {
                se.zone.run(() => {
                  let lstTrips = data;
                  se.gf.hideLoading();
                  resolve(lstTrips.trips);
                });
              }
            
          });
        }else{
          se.gf.hideLoading();
        }
      });
    })

  }

  paymentselect(trip, tripidx) {
    var se = this;
    se._mytripservice.rootPage = "notify";
    if (trip.amount_after_tax) {
      trip.priceShow = trip.amount_after_tax;
    }
    se.activityService.objPaymentMytrip = { returnPage: 'mytrip', tripindex: tripidx, paymentStatus: 0, bookingid: trip.HotelIdERP, trip: trip };
    if (trip.booking_type == 'COMBO_FLIGHT') {
      if (!(trip.pay_method==51||trip.pay_method==2||trip.pay_method==3)) {
        se.navCtrl.navigateForward("/mytripaymentflightcombo/0");
      } else {
        se.navCtrl.navigateForward("/mytripaymentflightcombo/1");
      }
    } else if (trip.booking_type == 'COMBO_VXR') {
      if (!(trip.pay_method==51||trip.pay_method==2||trip.pay_method==3)) {
        se.navCtrl.navigateForward("/mytripaymentcarcombo/0");
      } else {
        se.navCtrl.navigateForward("/mytripaymentcarcombo/1");
      }
     
    }else{
      if (!(trip.pay_method==51||trip.pay_method==2||trip.pay_method==3)) {
        se.navCtrl.navigateForward("/mytripaymentselect/0");
      } else {
        se.navCtrl.navigateForward("/mytripaymentselect/1");
      }
    
    }
    C.writePaymentLog("notify", "paymentselect", "purchase", trip.HotelIdERP);
  }
  checkPayment(bookingCode, itemMap, idx) {
    var se = this;
   
      let strUrl = C.urls.baseUrl.urlPost + '/mCheckBooking';
      se.gf.RequestApi('GET', strUrl, {}, { code: bookingCode }, 'Tabs', 'checkPayment').then((data) => {
      if (data) {
        var rs = data;
        if (rs.StatusBooking == 3) {
          se.navCtrl.navigateForward(['/app/tabs/tab3']);
          se.setActiveTabHome();

        }
        else {
          se.gf.setParams(bookingCode,'notifiBookingCode');    //Chưa thanh toán thì không show detail trong mytrip
          se.navCtrl.navigateForward(['/app/tabs/tab3']);
        }
      }
      else {
        se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
      }
    });
  }
  async openLink(url) {
    await Browser.open({url : url});
  }
  
}
