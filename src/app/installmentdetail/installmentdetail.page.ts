import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as $ from 'jquery';

@Component({
  selector: 'app-installmentdetail',
  templateUrl: './installmentdetail.page.html',
  styleUrls: ['./installmentdetail.page.scss'],
})
export class InstallmentdetailPage implements OnInit {

  constructor(private navCtrl: NavController) {
   
   }

  ngOnInit() {
  }

  goback(){
    this.navCtrl.back();
  }

}
