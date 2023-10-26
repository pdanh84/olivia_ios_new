import { Bookcombo } from './../providers/book-service';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, ToastController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ValueGlobal } from '../providers/book-service';

import { GlobalFunction } from '../providers/globalfunction';
import { flightService } from '../providers/flightService';
@Component({
  selector: 'app-flightpointsave',
  templateUrl: './flightpointsave.page.html',
  styleUrls: ['./flightpointsave.page.scss'],
})
export class FlightpointsavePage implements OnInit {
  lotussavecode;
  constructor(public modalCtrl: ModalController, public zone: NgZone, public navCtrl: NavController, public keyboard: Keyboard, public storage: Storage, public value: ValueGlobal, public toastCtrl: ToastController,
    public gf: GlobalFunction,
    public _flightService: flightService,public bookcombo: Bookcombo) {
      if(this._flightService.itemFlightCache.airlineMemberCode){
        this.lotussavecode = this._flightService.itemFlightCache.airlineMemberCode;
      }
      else if(this.bookcombo.airlineMemberCode){
        this.lotussavecode = this.bookcombo.airlineMemberCode;
      }
  }

  ngOnInit() {
  }

  close(){
      this.modalCtrl.dismiss();
  }

  confirm(){
      
    if (this.lotussavecode && this.checkValidCode(this.lotussavecode)) {
        this.modalCtrl.dismiss({ code: this.lotussavecode});
    } else {
      this.gf.showToastWarning('Mã thẻ không hợp lệ. Vui lòng nhập lại.');
    }
  }

  checkValidCode(code){
    var re = /^([a-zA-Z\-0-9]*)$/;
    return re.test(String(code).toLowerCase())
  }
}