import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-ordersupportdone',
  templateUrl: './ordersupportdone.page.html',
  styleUrls: ['./ordersupportdone.page.scss'],
})
export class OrdersupportdonePage implements OnInit {

 constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }
  next(){
    this.navCtrl.navigateBack(['/app/tabs/tab3']);
  }

}
