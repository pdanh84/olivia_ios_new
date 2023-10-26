import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { GlobalFunction } from '../providers/globalfunction';
import { Bookcombo,SearchHotel,RoomInfo,Booking } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
@Component({
  selector: 'app-flightcombobookingdetail',
  templateUrl: './flightcombobookingdetail.page.html',
  styleUrls: ['./flightcombobookingdetail.page.scss'],
})
export class FlightcombobookingdetailPage implements OnInit {
  bookingCode = ""; listfly;arradults;arrchilds;roomnumber;breakfast;room;nameroom;Rating;Name;objectFlight
  constructor(private modalCtrl: ModalController, public gf: GlobalFunction, private bookcombo: Bookcombo
    , public storage: Storage,public searchhotel: SearchHotel, public Roomif: RoomInfo,public booking: Booking) {
    this.listfly = this.gf.getParams('flightcombo');
    this.objectFlight = this.gf.getParams('objinfofly');
    this.bookingCode = this.bookcombo.bookingcode;
    this.roomnumber = this.searchhotel.roomnumber;
    this.breakfast = this.bookcombo.MealTypeName;
    this.room = Roomif.arrroom;
    this.nameroom = this.room[0].ClassName;
    this.Rating = this.booking.RatingHotel;
    this.Name = booking.HotelName;
    this.storage.get('infoPassengerscombo').then(data => {
      if (data) {
        if (data.adult && data.adult.length > 0) {
          this.arradults=data.adult;
        }
        if (data.child && data.child.length > 0) {
          this.arrchilds=data.child;
          this.arrchilds.forEach(element => {
            element.BirthDay =  moment(element.BirthDay).format("D") + ' thg ' + moment(element.BirthDay).format("M") + ", "+ moment(element.BirthDay).format("YYYY");
        });
        }
      }
    })
  }

  ngOnInit() {
  }
  close() {
    this.modalCtrl.dismiss();
  }
}
