import { Component, NgZone } from '@angular/core';
import { SearchHotel, ValueGlobal, Bookcombo, Booking, RoomInfo } from './../providers/book-service';
import * as moment from 'moment';
import { ActivityService, GlobalFunction } from './../providers/globalfunction';
import { OnInit } from '@angular/core';
import { Platform, NavController, ModalController, ToastController, AlertController} from '@ionic/angular';
import { File, FileReader } from '@awesome-cordova-plugins/file/ngx';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { flightService } from '../providers/flightService';
import { LaunchReview } from '@awesome-cordova-plugins/launch-review/ngx';
import { Storage } from '@ionic/storage';
import { FlightquickbackPage } from '../flightquickback/flightquickback.page';
import {tourService } from '../providers/tourService';
import { FileTransferObject, FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { PhotoLibrary } from '@awesome-cordova-plugins/photo-library/ngx';
import { voucherService } from '../providers/voucherService';
import { ticketService } from '../providers/ticketService';

@Component({
  selector: 'app-paymentqrcode',
  templateUrl: './paymentqrcode.page.html',
  styleUrls: ['paymentqrcode.page.scss'],
})

export class PaymentqrcodePage implements OnInit {
    qrcodeurl: any;
    bankTransfer: string;
    totalPrice: any;
    bookingCode: any;
    accountNumber: string;
    bankName: string;
  checkreview: number;
  defaultEmail: any;
  _email: any;
  contactOption: any;
  periodPaymentDisplay: string;

    constructor(public platform:Platform,  public zone: NgZone,public navCtrl: NavController,public modalCtrl: ModalController,
        public searchhotel: SearchHotel,public valueGlobal:ValueGlobal,public gf: GlobalFunction,private launchReview: LaunchReview,
        private file: File,
        public activityService: ActivityService,
        private clipboard: Clipboard,
        private toastCtrl: ToastController,
        public _flightService: flightService,
        private storage: Storage,
        private alertCtrl: AlertController,
        public tourService: tourService,
        public bookCombo: Bookcombo,
        private transfer: FileTransfer,
        private photoLibrary: PhotoLibrary,
        public booking: Booking,
        public Roomif: RoomInfo,
        public _voucherService: voucherService,
        private ticketService: ticketService
         ){
            this.bankName = activityService.bankName;
            this.bankTransfer = activityService.bankTransfer;
            this.accountNumber = activityService.bankAccount;
            this.totalPrice = activityService.totalPriceTransfer;
            if(!this.totalPrice){
              this.totalPrice = '0';
            }
            this.bookingCode = activityService.bookingCode;
            this.buildLinkQrCode();
            this.storage.get('checkreview').then(checkreview => {
              if (checkreview==0) {
                this.checkreview=0;
              }else
              {
                this.checkreview=checkreview;
              }
            })

            this.storage.get('email').then(email => {
              this.defaultEmail = email || '';

              this._email = (this.activityService.qrcodepaymentfrom == 1 ? this._flightService.itemFlightCache.email : 
                (( (this.activityService.qrcodepaymentfrom == 2 || this.activityService.qrcodepaymentfrom == 4 || this.activityService.qrcodepaymentfrom == 5)? this.Roomif.addressorder : 
                  (this.activityService.qrcodepaymentfrom == 3 ? this.booking.CEmail : (
                    (this.activityService.qrcodepaymentfrom == 4 ? this.booking.CEmail : this.defaultEmail
                  )))))) ;
            })

            if(this.activityService.qrcodepaymentfrom ==1){//flight
              this.gf.logEventFirebase(this._flightService.itemFlightCache.paymentType, this._flightService.itemFlightCache, 'paymentqrcode', 'purchase', 'Flights');
            }
            else if(this.activityService.qrcodepaymentfrom ==2){//ks
              this.gf.logEventFirebase(this.searchhotel.paymentType,this.searchhotel, 'paymentqrcode', 'purchase', 'Hotels');
            }
            else if(this.activityService.qrcodepaymentfrom ==3){//tour
              this.gf.logEventFirebase(this.searchhotel.paymentType,this.tourService, 'paymentqrcode', 'purchase', 'Tours');
            }
            else if(this.activityService.qrcodepaymentfrom ==4){//comboflight
              this.gf.logEventFirebase(this.searchhotel.paymentType,this.searchhotel, 'paymentqrcode', 'purchase', 'Combo');
            }
            else if(this.activityService.qrcodepaymentfrom ==5){//combocar
              this.gf.logEventFirebase(this.searchhotel.paymentType,this.searchhotel, 'paymentqrcode', 'purchase', 'Combo');
            }

            this.storage.get('contactOption').then((option)=>{
              this.contactOption = option;
            })
        }
    ngOnInit() {

    }
    async ionViewWillEnter(){
      if(this._flightService && this._flightService.itemFlightCache){
        let dataSummary = await this.gf.getSummaryBooking(this._flightService.itemFlightCache);
        let date = dataSummary.periodPaymentDate;
        if(date){
          this.periodPaymentDisplay= moment(date).format("HH:mm") + " " + this.gf.getDayOfWeek(date).dayname +", "+ moment(date).format("DD") + " thg " + moment(date).format("MM");
        }
      }
      if( this.ticketService){
        this.ticketService.ischeckCalendar = false;
      }
      
    }

    buildLinkQrCode() {
        this.zone.run(()=>{
         this.qrcodeurl = `https://cdn1.ivivu.com/newcdn/qr-payment?bankname=${this.bankTransfer}&amount=${this.gf.convertStringToNumber(this.totalPrice)}&description=${this.bookingCode}`;
        })
         
       }

  async downloadqrcode(){
    let storageDirectory = '';
    if (this.platform.is('android')) {
        storageDirectory = this.file.dataDirectory ;
    }
    this.gf.showLoading();
    try {
      const fileTransfer: FileTransferObject = this.transfer.create();
      this.photoLibrary.requestAuthorization({read: true, write: true}).then(() => {
        fileTransfer.download(this.qrcodeurl, storageDirectory + `qrcode_${this.bookingCode}.png`).then((entry) => {
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

  copyClipboard(type){
    if(type == 1){
      this.clipboard.copy(this.accountNumber);
    }else if(type == 2){
      this.clipboard.copy("Người thụ hưởng: Công ty Cổ Phần IVIVU.COM");
    }else if(type == 3){
      this.clipboard.copy(this.bookingCode);
    }else if(type == 4){
        this.clipboard.copy(this.totalPrice);
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

  gotohomepage(){
    this.gf.hideLoading();
    if (this.checkreview == 0) {
      this.showConfirm();
    }
    this._voucherService.publicClearVoucherAfterPaymentDone(1);
    if(this.activityService.qrcodepaymentfrom == 1){//vmb
      this._flightService.itemTabFlightActive.emit(true);
      this.valueGlobal.backValue = "homeflight";
      this._flightService.itemMenuFlightClick.emit(2);
      this._flightService.bookingCodePayment = this.bookingCode;
      this._flightService.bookingSuccess = true;
      this.navCtrl.navigateBack('/tabs/tab1');
    }else if(this.activityService.qrcodepaymentfrom == 2){//ks
      if(this.searchhotel.rootPage == "topdeallist"){
        this.navCtrl.navigateBack('/topdeallist');
        this.searchhotel.rootPage = "";
      }else{
        this.navCtrl.navigateBack('/');
      }
    }
    else if(this.activityService.qrcodepaymentfrom == 3){//tour
      this.tourService.itemPaymentDone.emit(3);
      this.valueGlobal.backValue = "hometour";
      this.tourService.BookingTourMytrip = null;
      this.navCtrl.navigateBack('/app/tabs/tab1');
    }
    else if(this.activityService.qrcodepaymentfrom == 4) {
      this.gf.setParams(null, 'flightcombo');
      this.bookCombo.isAGODABooking = false;
      this.bookCombo.isHBEDBooking = false;
      this.bookCombo.roomPenalty = false;
      this.navCtrl.navigateBack('/tabs/tab1');
    }
    else if(this.activityService.qrcodepaymentfrom == 5){
      this.gf.setParams(2, 'seemoreblog');
      this.bookCombo.isAGODABooking = false;
      this.bookCombo.isHBEDBooking = false;
      this.bookCombo.roomPenalty = false;
      this.navCtrl.navigateForward('/bloglist');
    }else{
      this.navCtrl.navigateBack('/tabs/tab1');
    }
   
    
    //this.navCtrl.navigateBack('/tabs/tab1');
  }

  gotomytrip(){
    this._voucherService.publicClearVoucherAfterPaymentDone(1);
    if(this.activityService.qrcodepaymentfrom == 1){//vmb
      this._flightService.itemTabFlightActive.emit(true);
      this.valueGlobal.backValue = "homeflight";
      this._flightService.itemMenuFlightClick.emit(2);
      this._flightService.bookingCodePayment = this.bookingCode;
      this._flightService.bookingSuccess = true;
      this.navCtrl.navigateBack('/tabs/tab1');
    }else{
      this.navCtrl.navigateBack(['/app/tabs/tab3']);
    }
    
  }

  public async showConfirm() {
    this.storage.set("checkreview", 1);
    let alert = await this.alertCtrl.create({
      header: 'Bạn thích iVIVU.com?',
      message: 'Đánh giá ứng dụng trên App Store',
      mode: "ios",
      cssClass: 'cls-reivewapp',
      buttons: [
        {
          text: 'Hủy',
          handler: () => {
          }
        },
        {
          text: 'Đánh giá',
          role: 'OK',
          handler: () => {
            this.launchReview.launch()
              .then(() => console.log('Successfully launched store app'));
          }
        }
      ]
    });
    alert.present();
    alert.onDidDismiss().then((data) => {
    })
  }

  async showQuickBack(){
    const modal: HTMLIonModalElement =
    await this.modalCtrl.create({
      component: FlightquickbackPage,
      componentProps: {
        aParameter: true,
      },
      showBackdrop: true,
      backdropDismiss: true,
      //enterAnimation: CustomAnimations.iosCustomEnterAnimation,
      //leaveAnimation: CustomAnimations.iosCustomLeaveAnimation,
      cssClass: "modal-flight-quick-back",
    });
  modal.present();
  }
}