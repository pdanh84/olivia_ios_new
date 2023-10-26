import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Bookcombo } from './../providers/book-service';
@Component({
  selector: 'app-shuttlebusnote',
  templateUrl: './shuttlebusnote.page.html',
  styleUrls: ['./shuttlebusnote.page.scss'],
})
export class ShuttlebusnotePage implements OnInit {
  text: any;
  constructor(public navCtrl: NavController,public bookCombo: Bookcombo) {
    //this.bookCombo.isshuttlebus[0].PolicyDes= this.bookCombo.isshuttlebus[0].PolicyDes.replace('//cdn1', 'https://cdn1');
    this.text=this.bookCombo.isshuttlebus[0].PolicyDes.replace(/\/\/cdn1/g,'https://cdn1');
   // this.bookCombo.isshuttlebus[0].PolicyDes= this.bookCombo.isshuttlebus[0].PolicyDes.replace(/[^//cdn1]*/g, "https://cdn1");
    


  }
  ngOnInit(){
  }
  goback(){
    this.navCtrl.back();
  }
}
