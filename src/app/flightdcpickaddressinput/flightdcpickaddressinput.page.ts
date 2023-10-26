import { NavController, ModalController } from '@ionic/angular';
import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { C } from '../providers/constants';

import { flightService } from './../providers/flightService';
import * as $ from 'jquery';
import { GlobalFunction } from '../providers/globalfunction';
@Component({
  selector: 'app-flightdcpickaddressinput',
  templateUrl: './flightdcpickaddressinput.page.html',
  styleUrls: ['./flightdcpickaddressinput.page.scss'],
})
export class FlightdcpickaddressinputPage implements OnInit {
  @ViewChild('input') myInput ;
  input="";listInput:any=[];
  @Input() value: string;
  @Input() location: string;
  title="";
  constructor(public navCtrl: NavController, public _flightService: flightService, public modalCtrl: ModalController,
    public gf: GlobalFunction) {
      //  console.log(this._flightService.itemFlightCache);
      $('#place-text').focus();
   }

  ngOnInit() {
    if (this.value=='From') {
      this.title=this._flightService.itemFlightCache.departCity;
    } else {
      this.title=this._flightService.itemFlightCache.returnCity;
    }
  }
  closetext(){
    this.input="";
  }
  goback(){
    this.modalCtrl.dismiss();
  }
  getInput(ev: any){
    var se=this;
    if(ev.detail.value){
      // var options = {
      //   method: 'GET',
      //   url: C.urls.baseUrl.urlMobile + '/api/Dashboard/AutoCompleteFromGG?AirportLocation=' + this.location + '&Place=' + ev.detail.value,
      //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
      //   headers:
      //   {
      //   }
      // };
      let headers = {};
      let strUrl = C.urls.baseUrl.urlMobile + '/api/Dashboard/AutoCompleteFromGG?AirportLocation=' + this.location + '&Place=' + ev.detail.value;
        this.gf.RequestApi('GET', strUrl, headers, {}, 'flightDCPickAddressInput', 'AutoCompleteFromGG').then((data)=>{

        var body=data;
        se.listInput=[];
        se.listInput=body.data.predictions;
        //console.log(body);
      });
    }else{
      se.listInput=[];
    }
   
  }
  clickText(item){
    this.modalCtrl.dismiss({ item:  item,FromTo:this.value});
  }
  clearText(){
    this.input="";
  }
  ionViewDidEnter() {
    setTimeout(() => {
      this.myInput.setFocus();
    }, 150);
  }
}
