import { ValueGlobal } from './../providers/book-service';
import { ToastController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../providers/globalfunction';
@Component({
  selector: 'app-accountdeletiondone',
  templateUrl: './accountdeletiondone.page.html',
  styleUrls: ['./accountdeletiondone.page.scss'],
})
export class AccountDeletionDonePage implements OnInit {
  phone: any;
  constructor(private toastCtrl: ToastController, public navCtrl: NavController, public valueGlobal: ValueGlobal,
    public activityService: ActivityService) { }
  ngOnInit() {
  }
  goback() {
    this.navCtrl.navigateBack('/app/tabs/tab1');
  }
  
}
