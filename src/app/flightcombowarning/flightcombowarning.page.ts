import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Bookcombo,RoomInfo } from './../providers/book-service';
import { GlobalFunction } from '../providers/globalfunction';
@Component({
  selector: 'app-flightcombowarning',
  templateUrl: './flightcombowarning.page.html',
  styleUrls: ['./flightcombowarning.page.scss'],
})
export class FlightcombowarningPage implements OnInit {
  total;code;phone;listfly;bookingcode="";
  constructor(private navCtrl:NavController, public Roomif: RoomInfo, private bookCombo: Bookcombo,public gf: GlobalFunction) { 
    this.listfly = this.gf.getParams('flightcombo');
    this.phone=this.listfly.HotelBooking.LeadingPhone;
  }

  ngOnInit() {
    this.total = this.Roomif.priceshowtt;
    this.bookingcode=this.bookCombo.bookingcode;
  }
  gohome(){
    this.navCtrl.navigateBack('/app/tabs/tab1');
  }

  goback(){
    this.navCtrl.navigateBack('/app/tabs/tab1');
  }
}
