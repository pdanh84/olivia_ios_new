import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { SearchHotel } from '../providers/book-service';


/**
 * Generated class for the OccupancyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-hotelreviewsvideo',
  templateUrl: 'hotelreviewsvideo.html',
  styleUrls: ['hotelreviewsvideo.scss'],
})
export class HotelreviewsvideoPage  {
  hotelName: any;
  tourName: any;
  trustedVideoUrl: any;
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public searchhotel: SearchHotel,public zone:NgZone) {
    this.hotelName = this.searchhotel.hotelName;
    this.tourName = this.searchhotel.tourDetailName;
    this.trustedVideoUrl=this.searchhotel.trustedVideoUrl;
  }
  goback() {
    this.modalCtrl.dismiss();
  }
  ionViewDidEnter() {
  }
}