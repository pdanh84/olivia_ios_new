import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-insurrancenote',
  templateUrl: './insurrancenote.page.html',
  styleUrls: ['./insurrancenote.page.scss'],
})
export class InsurranceNotePage implements OnInit {

  constructor(public router: Router, public navCtrl: NavController) { }

  ngOnInit() {
  }

  goback(){
    //this.router.navigateByUrl('/app/tabs/tab3?refresh=false');
    this.navCtrl.back();
  }
  /***
     * Gọi tổng đài hỗ trợ
     * PDANH 26/02/2019
     */
    async makeCallSupport(phone) {
      try {
        setTimeout(() => {
          window.open(`tel:${phone}`, '_system');
        }, 10);
      }
      catch (error) {
      }
    }
}
