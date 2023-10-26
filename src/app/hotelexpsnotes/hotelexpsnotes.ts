import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { GlobalFunction } from './../providers/globalfunction';

@Component({
  selector: 'app-hotelexpsnotes',
  templateUrl: 'hotelexpsnotes.html',
  styleUrls: ['hotelexpsnotes.scss'],
})

export class HotelExpsNotesPage implements OnInit{
    listExpsNotes:any = [];
    provinceName ="";
    constructor(public platform: Platform,public navCtrl: NavController,public gf: GlobalFunction){
        let params = this.gf.getParams('hotelexpsnotes');
        if(params){
            this.provinceName = params.provinceName;
            this.loadNotes(params.notes);
        }
        //Xử lý nút back của dt
        this.platform.ready().then(() => {
            this.platform.backButton.subscribe(() => {
                this.navCtrl.back();
            })
        })
        //google analytic
        gf.googleAnalytion('hotelexpsnote','load','');
    }

    ngOnInit(){

    }

    loadNotes(lstExpsNotes){
        lstExpsNotes.forEach(element => {
            this.listExpsNotes.push(element);
        });
    }

    goback() {
        this.navCtrl.back();
    }
}