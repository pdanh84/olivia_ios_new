import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.page.html',
  styleUrls: ['./rules.page.scss'],
})
export class RulesPage implements OnInit {

  constructor(public navCtrl: NavController) {
    
   }

  ngOnInit() {
  }

  goback(){
    this.navCtrl.back();
  }

}
