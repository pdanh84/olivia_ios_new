import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, ToastController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ValueGlobal } from '../providers/book-service';
import { GlobalFunction } from '../providers/globalfunction';
@Component({
  selector: 'app-confirmemail',
  templateUrl: './confirmemail.page.html',
  styleUrls: ['./confirmemail.page.scss'],
})
export class ConfirmemailPage implements OnInit {
    email;
  constructor(public modalCtrl: ModalController, public zone: NgZone, public navCtrl: NavController, public keyboard: Keyboard, public storage: Storage, public value: ValueGlobal, public toastCtrl: ToastController,
    public gf: GlobalFunction) {
  }

  ngOnInit() {
  }

  close(){
      this.modalCtrl.dismiss();
  }

  confirm(){
      
    var test = this.validateEmail(this.email);
    if (test == true) {
        this.modalCtrl.dismiss({ email: this.email});
    } else {
      this.gf.showToastWarning('Email không hợp lệ. Vui lòng nhập lại.');
    }
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}