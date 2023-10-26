import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, ModalController, Platform, LoadingController } from '@ionic/angular';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { SearchHotel, Booking, RoomInfo, ValueGlobal } from '../providers/book-service';

import { flightService } from '../providers/flightService';

@Component({
  selector: 'app-hotelcityroomupgrade',
  templateUrl: 'hotelcityroomupgrade.html',
  styleUrls: ['hotelcityroomupgrade.scss'],
})

export class HotelCityRoomUpgradePage implements OnInit {
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
  constructor(public platform: Platform, public modalCtrl: ModalController, public navCtrl: NavController,
    public gf: GlobalFunction, private activatedRoute: ActivatedRoute, public zone: NgZone, private storage: Storage,
    public searchhotel: SearchHotel,
    public booking: Booking,
    private loadingCtrl: LoadingController,
    public Roomif: RoomInfo,
    public valueGlobal: ValueGlobal,
    public _flightService: flightService) {
      setTimeout(()=>{
        this.HotelID = this.searchhotel.hotelID;
        this.roomdetail = this.searchhotel.listHotelCityRoomUpgrade;
        this.storage.get('auth_token').then(auth_token => {
          if (auth_token) {
            this.loginuser = auth_token;
          }
        });
        if (this.roomdetail) {
          this.roomdetailarr = [];
          this.roomdetail.forEach(element => {
            if(!element.imgurl){
              var str = element.Rooms[0].ImagesMaxWidth500;
              var res = str.substr(0, 4);
              if (res != "http") {
                element.imgurl="https:"+str;
              }
              else
              {
                element.imgurl=str;
              }
              if (str.indexOf('noimage') != -1) {
                element.imgurl = "https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage-104x110.jpg";
              }
            }
          
            this.roomdetailarr.push(element);
          });
         
        }
        if(this.valueGlobal.backValue && this.valueGlobal.backValue == "flightcomboupgrade"){
          this.notAllowBook = true;
        }
      },300)
  }

  ngOnInit() {

  }
  goback() {
      this.navCtrl.navigateBack('/flightaddservice');
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

  changeRoom(itemRoom){
    this.roomdetailarr.forEach((item)=>{
      item.selected = false;
    })
    itemRoom.selected = true;
    this._flightService.itemFlightCache.objectHotelCity = itemRoom;
    this._flightService.itemHotelCityChange.emit(itemRoom);
    this.navCtrl.navigateBack('/flightaddservice');
  }


  async presentLoadingNew() {
    var loader = await this.loadingCtrl.create({
      duration: 1000,
    });
    loader.present();
  }

}