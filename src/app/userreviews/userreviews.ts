import { Component,ViewChild,NgZone, OnInit, ElementRef } from '@angular/core';
import { Platform,NavController, AlertController,  ToastController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { C } from './../providers/constants';
import { ValueGlobal } from '../providers/book-service';
import { GlobalFunction } from './../providers/globalfunction';
import { SwiperContainer } from 'swiper/element';

@Component({
  selector: 'app-userreviews',
  templateUrl: 'userreviews.html',
  styleUrls: ['userreviews.scss'],
})

export class UserReviewsPage implements OnInit{
    userInfoData:any;
    CityName: string;
    CountryCode: string;
    public isShowConfirm = false;
    public arrHotelReviews:any = [];
    public numHotelReviews = 3;
    public intervalID;
    public coutslide = 0;
    public loaddatadone = false;
    username='';
    @ViewChild('mySlider') slider:  ElementRef | undefined;
    constructor(public platform: Platform,public navCtrl: NavController,public toastCtrl: ToastController,
        public zone: NgZone,public storage: Storage,public alertCtrl: AlertController,public modalCtrl: ModalController,public valueGlobal: ValueGlobal,
        public gf: GlobalFunction){
        //this.loadUserReviews();
        
      //google analytic
      gf.googleAnalytion('userreviews','load','');
    }

    ngOnInit(){

    }

    ionViewWillEnter(){
      this.loadUserReviews();
      this.storage.get('username').then(username => {
        if(username){
          this.username = username;
        }else{
          this.username = '';
        }
      });
    }

    loadUserReviews(){
        var se = this;
            se.storage.get('auth_token').then(auth_token => {
                if (auth_token) {
                  if(se.gf.getParams('hotelreviewlist')){
                    let arrdata = se.gf.getParams('hotelreviewlist').hotelreviewlist;
                    let trip = se.gf.getParams('hotelreviewlist').trip;
                    let mapitem = arrdata.filter((item)=>{
                      var d = item.dateStayed.split('-');
                      return (item.hotelId == trip.HotelIdERP && item.bookingId == trip.booking_id);
                    });
                    if(mapitem){
                      se.arrHotelReviews.push(mapitem[0]);
                    }
                  }
                   
                }
            }) 
    }

    public async showConfirm(){
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
              this.navCtrl.navigateBack('/');
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
              //this.valueGlobal.logingoback = "MainPage";
              this.navCtrl.navigateForward('/login');
            }
          }
        ]
      });
      alert.present();
      alert.onDidDismiss().then((data)=>{
        this.storage.remove('auth_token');
        this.storage.remove('email');
        this.storage.remove('username');
        this.storage.remove('jti');
        this.storage.remove('userInfoData');
        this.storage.remove('userRewardData');
        this.storage.remove('point');
        this.navCtrl.navigateBack('/');
        })
    }

    goback(){
        //var self = this;
        //this.navCtrl.back();
        this.modalCtrl.dismiss();
    }

    async presentToast(msg) {
        const toast = await this.toastCtrl.create({
          message: msg,
          duration: 2000,
          position: 'top',
        });
        toast.present();
      }

    /***
     * Next trên slide
     */
    onSlideChange() {
        //this.slider?.nativeElement.getActiveIndex().then((currentIndex)=>{
            this.coutslide = this.slider?.nativeElement.swiper.activeIndex + 1;
        //});
        
    }
}