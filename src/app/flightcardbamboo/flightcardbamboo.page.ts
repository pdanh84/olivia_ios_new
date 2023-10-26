import { Bookcombo } from './../providers/book-service';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, ToastController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ValueGlobal } from '../providers/book-service';
import { GlobalFunction } from '../providers/globalfunction';
import { flightService } from '../providers/flightService';

@Component({
  selector: 'app-flightcardbamboo',
  templateUrl: './flightcardbamboo.page.html',
  styleUrls: ['./flightcardbamboo.page.scss'],
})
export class FlightcardbambooPage implements OnInit {

  cardbamboocode;
  constructor(public modalCtrl: ModalController, public zone: NgZone, public navCtrl: NavController, public keyboard: Keyboard, public storage: Storage, public value: ValueGlobal, public toastCtrl: ToastController,
    public gf: GlobalFunction,
    public _flightService: flightService,public bookcombo: Bookcombo) {
      if(this._flightService.itemFlightCache.airlineCardCode){
        this.cardbamboocode = this._flightService.itemFlightCache.airlineCardCode;
      }
      else if(this.bookcombo.airlineCardCode){
        this.cardbamboocode = this.bookcombo.airlineCardCode;
      }
  }

  ngOnInit() {
  }

  close(){
      this.modalCtrl.dismiss();
  }

  confirm(){
      
    if (this.cardbamboocode && this.checkValidCode(this.cardbamboocode)) {
        this.modalCtrl.dismiss({ code: this.cardbamboocode});
    } else {
      this.gf.showToastWarning('Mã thẻ không hợp lệ. Vui lòng nhập lại.');
    }
  }

  checkValidCode(code){
    var re = /^([a-zA-Z\-0-9]*)$/;
    return re.test(String(code).toLowerCase())
  }
}