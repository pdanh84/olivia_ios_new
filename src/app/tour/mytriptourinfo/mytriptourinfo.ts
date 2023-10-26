import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, Platform,LoadingController } from '@ionic/angular';
import { C } from './../../providers/constants';
import { GlobalFunction } from './../../providers/globalfunction';
import { ActivatedRoute } from '@angular/router';

import { Storage } from '@ionic/storage';
import { MytripService } from 'src/app/providers/mytrip-service.service';
import * as $ from 'jquery';
/**
 * Generated class for the DescriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-mytriptourinfo',
  templateUrl: 'mytriptourinfo.html',
  styleUrls: ['mytriptourinfo.scss'],
})
export class MytripTourInfoPage implements OnInit{

  public Name;
  public FullDescription;
  public HotelID;
  public urlpath = C.urls.baseUrl.urlPost;
  loader: any;
  trip: any;
  expanddivcontent: boolean;
  constructor(public platform: Platform,public navCtrl: NavController,public gf: GlobalFunction,public activatedRoute: ActivatedRoute,
    public zone: NgZone,
    private storage: Storage,public loadingCtrl: LoadingController,
    public _mytripservice: MytripService) {
      this.trip = this._mytripservice.tripdetail;
  }

  ngOnInit(){

  }
  goback(){
    this.navCtrl.pop();
  }
  expandDiv(value){
      if(value ==1){
        var divCollapse = $('.div-wrap-content.div-collapse');
        if(divCollapse && divCollapse.length >0){
          divCollapse.removeClass('div-collapse').addClass('div-expand');
        }
        this.expanddivcontent = true;
        //this.scrollToTopGroupReview(1);
      }else{
        var divCollapse = $('.div-wrap-content.div-expand');
        if(divCollapse && divCollapse.length >0){
          divCollapse.removeClass('div-expand').addClass('div-collapse');
        }

        this.expanddivcontent = false;
        //this.scrollToTopGroupReview(2);
      }
  }
}
