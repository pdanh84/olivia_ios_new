import { Component, NgZone,ViewChild,OnInit, ElementRef } from '@angular/core';
import { Platform, NavController,  ModalController } from '@ionic/angular';
import { Bookcombo, SearchHotel, ValueGlobal } from '../../providers/book-service';

import * as moment from 'moment';
import { C } from './../../providers/constants';
import { GlobalFunction } from './../../providers/globalfunction';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { MytripService } from '../../providers/mytrip-service.service';
import { flightService } from '../../providers/flightService';
import { BizTravelService } from 'src/app/providers/bizTravelService';

/**
 * Generated class for the MytripsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-bookinghoteldetail',
  templateUrl: 'bookinghoteldetail.html',
  styleUrls: ['bookinghoteldetail.scss'],
})
export class BookingHotelDetailPage implements OnInit{
  @ViewChild('mySlider') slider:  ElementRef | undefined;
  jsonroom1:any = [];
  hotelRooms:any = [];
  hotelRoomClasses:any= [];
  hotelMealTypes:any = [];
  hotelroom:any = [];
  slideData:any = [];
  lengthslide = 0;
  coutslide = 1;
  hotelimg;
  hotelname;
  roomname;
  loaddatadone = false;
  public HotelIdIntenal = 0;
  public HotelId=0;
  public checkIn = '';
  public checkOut = '';
  public mytrip = null;
  public roomNumber = 1;
  public adult = 2;
  public child = 0;
  public cityId = 0;
  public roomId = 0;
  public penaltyItemSelected = -1;
  currentTripIndex=0;
  mealPlan: any;
  inclusion: any;
  constructor(public platform: Platform,public navCtrl: NavController, public gf: GlobalFunction,private router: Router,
    public bookCombo: Bookcombo,public zone: NgZone,public modalCtrl: ModalController,private searchhotel: SearchHotel,
    private storage: Storage,
    public _mytripservice: MytripService,
    public _flightService: flightService,
    public valueGlobal: ValueGlobal,
    public bizTravelService: BizTravelService) {
      
  }

  ngOnInit(){

  }

  ionViewWillEnter(){
    let obj = this.bizTravelService.objBookinghoteldetail;
      if(obj.trip){
        this.loaddatadone= false;
        this.mytrip = obj.trip;
        let objTrip = obj.trip;
        this.currentTripIndex = obj.currentTrip;
        this.HotelId = objTrip.hotel_id;
        this.checkIn = moment(objTrip.checkInDate).format('YYYY-MM-DD');
        this.checkOut = moment(objTrip.checkOutDate).format('YYYY-MM-DD');
        this.roomNumber = objTrip.room_count;
        this.roomId = objTrip.room_id;
        this.mealPlan = objTrip.meal_plan;
        this.inclusion = objTrip.inclusion;
        if(this.inclusion && this.inclusion.indexOf('↵')){
          this.inclusion = this.inclusion.replace('↵','<br>')
        }
        if(objTrip.extra_guest_info){
          this.adult = objTrip.extra_guest_info.split('|')[0].trim();
          this.child = objTrip.extra_guest_info.split('|')[1].trim();
        }
      }
    this.storage.get('bookinghoteldetail_'+this.HotelId).then((data)=>{
      if(data){
        this.zone.run(() => {
          var jsondata = data;
          this.storage.set('bookinghoteldetail_'+this.HotelId,jsondata);
          this.cityId = jsondata.CityId;
          this.HotelIdIntenal = jsondata.Id;
          if (jsondata.HotelImages.length > 0) {
            this.slideData = jsondata.HotelImages;
            for (let index = 0; index < this.slideData.length; index++) {
              if(this.slideData[index].LinkImage.indexOf("https") == -1){
                this.slideData[index].LinkImage = 'https:' + this.slideData[index].LinkImage;
              }
            }
          }
          else {
            var item;
            if(jsondata.Avatar.indexOf("https") == -1){
              item = { LinkImage: 'https:' + jsondata.Avatar }
            }else{
              item = { LinkImage: jsondata.Avatar }
            }
            this.slideData.push(item);
          }
          this.lengthslide = this.slideData.length;
        },10)

      this.storage.get('bookinghoteldetail_'+this.HotelIdIntenal+"_"+this.checkIn +"_"+this.checkOut).then((dataroom)=>{
        if(dataroom){
          if(dataroom.Hotels){
            this.hotelname = dataroom.Hotels[0].HotelName;
            this.hotelRooms = [];
            this.hotelRoomClasses = [];
            this.hotelRooms = dataroom.Hotels[0];
            dataroom.Hotels[0].RoomClasses.forEach((element,index) => {
              if(element.Rooms[0].RoomID == this.roomId){
                this.hotelRoomClasses.push(element);
                this.roomname = element.ClassName;
                this.loaddatadone = true;
              }
              });
          }else{
            this.loaddatadone = true;
            this.hotelRoomClasses = [];
          }
        }else{
          this.getdataroom();
        }
      })
      }else{
        this.getdata();
      }
    })
    //google analytic
    this.gf.googleAnalytion('mytripbookingdetail','load','');
  }

  /***
   * Hàm load thông tin phòng
   */
  getdataroom() {
    var se = this, self = this;
    var form = {
      CheckInDate: se.checkIn,
      CheckOutDate: se.checkOut,
      CityID: se.cityId,
      CountryID: 'VN',
      HotelID: se.HotelIdIntenal,
      IsLeadingPrice: '1',
      IsPackageRate: 'false',
      NationalityID: '82',
      ReferenceClient: '',
      RoomNumber: se.roomNumber,
      'RoomsRequest[0].RoomIndex': '1',
      Supplier: 'IVIVU',
      dataKey: '',
      'RoomsRequest[0][Adults][value]': se.adult,
      'RoomsRequest[0][Child][value]': se.child,
      GetVinHms: 1,
      GetSMD: 1,
      IsFenced: true
    };
    let strUrl = C.urls.baseUrl.urlContracting +'/api/contracting/HotelSearchReqContractAppV2';
    se.gf.RequestApi('POST', strUrl, {}, form, 'bookinghoteldetail', 'getdataroom').then((data) => {
      self.zone.run(() => {
            self.jsonroom1 = data;
            if (self.jsonroom1) {
               var result = data;
              if(result.Hotels){
                self.storage.set('bookinghoteldetail_'+self.HotelIdIntenal+"_"+self.checkIn +"_"+self.checkOut,result);
                self.hotelname = result.Hotels[0].HotelName;
                self.hotelRooms = [];
                self.hotelRoomClasses = [];
                self.hotelRooms = result.Hotels[0];
                result.Hotels[0].RoomClasses.forEach((element,index) => {
                  if(element.Rooms[0].RoomID == self.roomId){
                    self.hotelRoomClasses.push(element);
                    self.roomname = element.ClassName;
                    self.loaddatadone = true;
                  }
                    
                  });
              }else{
                self.loaddatadone = true;
                self.hotelRoomClasses = [];
              }
            }
            else {
              self.loaddatadone = true;
              self.hotelRoomClasses = [];
            }
          },100);
    })
  }

  getdata() {
    var self = this;
    let strUrl = C.urls.baseUrl.urlPost + "/mhoteldetail/" + self.HotelId;
    self.gf.RequestApi('POST', strUrl, {}, {}, 'bookinghoteldetail', 'getdata').then((data) => {
        self.zone.run(() => {
          var jsondata = data;
          self.storage.set('bookinghoteldetail_'+self.HotelId,jsondata);
          self.cityId = jsondata.CityId;
          self.HotelIdIntenal = jsondata.Id;
          if (jsondata.HotelImages.length > 0) {
            self.slideData = jsondata.HotelImages;
            for (let index = 0; index < self.slideData.length; index++) {
              self.slideData[index].LinkImage = 'https:' + self.slideData[index].LinkImage;
            }
          }
          else {
            var item = { LinkImage: 'https:' + jsondata.Avatar }
            self.slideData.push(item);
          }
          self.lengthslide = self.slideData.length;
          self.getdataroom();
        },10)
    })
  }

  ionViewDidLoad() {
    let elements = window.document.querySelectorAll(".tabbar");
  
      if (elements != null) {
        Object.keys(elements).map((key) => {
          elements[key].style.display = 'none';
        });
      }
  }

  onSlideChange(){
    // this.slider?.nativeElement.getActiveIndex().then((currentIndex)=>{
    //   this.hotelimg = this.slideData[currentIndex].LinkImage;
    //   this.coutslide = currentIndex + 1;
    // });
    let _currentIndex = this.slider?.nativeElement.swiper.activeIndex;
    this.hotelimg = this.slideData[_currentIndex].LinkImage;
    this.coutslide = _currentIndex + 1;
  }

  goback() {
    if(this._mytripservice.backroute){
        if(this._mytripservice.rootPage == "homeflight"){
          this._flightService.itemTabFlightActive.emit(true);
          this._flightService.itemMenuFlightClick.emit(2);
          this.valueGlobal.backValue = "homeflight";
          this.navCtrl.navigateBack('/tabs/tab1', {animated: true});
          this._mytripservice.backfrompage= "";
        }else{
          this.navCtrl.navigateBack("/tabs/tab3");
        }
      }else{
        this.navCtrl.navigateBack('/bookingdetail');
        this._mytripservice.backfrompage = "bookinghoteldetail";
      }
    
  }

  openRoomCancel(roominfo){
    roominfo.showFromMytrip = true;
    this.gf.setParams(roominfo,'roomInfo')
    this.searchhotel.backPage ="mytripbookingdetail";
    this.navCtrl.navigateForward('/roomcancel');
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
}
