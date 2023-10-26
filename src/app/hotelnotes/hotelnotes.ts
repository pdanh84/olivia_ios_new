import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from '@ionic/angular';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';

@Component({
  selector: 'app-hotelnotes',
  templateUrl: 'hotelnotes.html',
  styleUrls: ['hotelnotes.scss'],
})

export class HotelNotesPage {
    listNotes:any = [];
    constructor(public platform: Platform,public navCtrl: NavController,public gf: GlobalFunction){
        let params = this.gf.getParams('hotelnotes');
        this.loadNotes(params);
        //Xử lý nút back của dt
        this.platform.ready().then(() => {
            this.platform.backButton.subscribe(() => {
            this.navCtrl.back();
            })
        })
        //google analytic
        this.gf.googleAnalytion('hotelnotes','load','');
    }

    loadNotes(lstNotes){
        lstNotes.forEach(element => {
            this.listNotes.push(element);
        });
    }

    goback() {
        this.navCtrl.back();
    }
}