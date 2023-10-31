import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { NavController, ModalController, Platform, LoadingController } from '@ionic/angular';
import { GlobalFunction } from './../providers/globalfunction';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { SearchHotel, Booking, RoomInfo, ValueGlobal } from '../providers/book-service';
import * as $ from 'jquery';
@Component({
  selector: 'app-hotelroomdetail',
  templateUrl: 'hotelroomdetail.html',
  styleUrls: ['hotelroomdetail.scss'],
})

export class HotelRoomDetailPage implements OnInit {
  @ViewChild('mySlider') slider:  ElementRef | undefined;;
  roomdetail:any = null;
  roomdetailarr:any = [];
  imgurl:any = null;
  public HotelID;
  penaltyItemSelected: number;
  loginuser: any;
  arrroom: any[];
  duration: any;
  indexroom: any;
  notAllowBook: boolean = false;
  slideData:any=[];
  nameRoom: any;
  countslide=0
  RoomDescription: any;
  ischeck: boolean = false;
  constructor(public platform: Platform, public modalCtrl: ModalController, public navCtrl: NavController,
    public gf: GlobalFunction, private activatedRoute: ActivatedRoute, public zone: NgZone, private storage: Storage,
    public searchhotel: SearchHotel,
    public booking: Booking,
    private loadingCtrl: LoadingController,
    public Roomif: RoomInfo,
    public valueGlobal: ValueGlobal) {
      setTimeout(()=>{
        this.ischeck = true;
      },2000)
      this.zone.run(()=>{
        this.HotelID = this.activatedRoute.snapshot.paramMap.get('id');
        this.roomdetail = this.gf.getParams('hotelroomdetail').objroom;
        this.nameRoom=this.roomdetail.ClassName;
        this.slideData=this.roomdetail.Rooms[0].RoomInfomations.RoomImageList;
        if(!this.slideData){
          this.slideData=[];
        }
        this.RoomDescription=this.roomdetail.Rooms[0].RoomInfomations.RoomDescription;
        if (this.roomdetail && this.roomdetail.Rooms[0].ImagesMaxWidth500) {
         
          var str = this.roomdetail.Rooms[0].ImagesMaxWidth500;
          var res = str.substr(0, 4);
          if (res != "http") {
            this.imgurl="https:"+str;
          }
          else
          {
            this.imgurl=str;
          }
          
          if (str.indexOf('noimage') != -1) {
            this.imgurl = "https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage-104x110.jpg";
          }
          if(this.slideData && this.slideData.length == 0){
            this.slideData.push({Url: this.imgurl});
          }
          this.imgurl = this.roomdetail.Rooms[0].ImagesMaxWidth500 ? "https:"+ this.roomdetail.Rooms[0].ImagesMaxWidth500 : 'https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage.png';
         
        }
        if(this.slideData && this.slideData.length >0 ){
          for (let i = 0; i < this.slideData.length; i++) {
            const element = this.slideData[i];
            element.Url = (element.Url.toLocaleString().trim().indexOf("http") != -1) ? element.Url : 'https:' + element.Url;
          }
        }
      
        this.roomdetailarr = [];
        this.roomdetailarr.push(this.roomdetail);
        // this.clearBlurEffect();
      })
     
    if(this.valueGlobal.backValue && this.valueGlobal.backValue == "flightcomboupgrade"){
      this.notAllowBook = true;
    }

  
    //google analytic
    gf.googleAnalytion('hotelroomdetail', 'load', '');

  }

  clearBlurEffect(){
    //$('img.preview').removeClass('preview').addClass('reveal');
    setTimeout(()=>{
      $('img.preview').removeClass('preview');
    },500)
    
  }

  ngOnInit() {

  }
  goback() {
    if(this.valueGlobal.backValue && this.valueGlobal.backValue == "flightcomboupgrade"){
      this.modalCtrl.dismiss();
    }else{
      this.valueGlobal.backValue = "";
      this.navCtrl.navigateBack('/hoteldetail/'+ this.HotelID);
    }
    
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
        this.navCtrl.navigateForward('/login');
      }
    });
  }



  async presentLoadingNew() {
    var loader = await this.loadingCtrl.create({
      duration: 1000,
    });
    loader.present();
  }
  imgDetail(){
    if(this.slideData.length>1){
      this.navCtrl.navigateForward('roomimagedetail');
    }
  
  }
  nextslide()
  {
    if (this.countslide<this.slideData.length) {
      this.countslide = this.slider?.nativeElement.swiper.activeIndex + 1
      this.slider?.nativeElement.swiper.slideTo(this.countslide);
    }

  }
  backslide()
  {
    if (this.countslide>0) {
      this.countslide = this.slider?.nativeElement.swiper.activeIndex -1
      this.slider?.nativeElement.swiper.slideTo(this.countslide);
    }

  }
  onSlideChange()
  {
    // this.slider?.nativeElement.getActiveIndex().then(index => {
    //   this.countslide = index + 1;
    // });
    // this.countslide = this.slider?.nativeElement.swiper.activeIndex + 1;
  }
}