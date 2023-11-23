import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';
import { GlobalFunction } from '../../../../providers/globalfunction';
import { C } from './../../../../providers/constants';
import { Storage } from '@ionic/storage';
import {tourService} from './../../../../providers/tourService';

@Component({
  selector: 'app-searchdeparture',
  templateUrl: './searchdeparture.page.html',
  styleUrls: ['./searchdeparture.page.scss'],
})
export class SearchDeparturePage implements OnInit {
  @ViewChild('ipSearchDeparture') ipSearchDeparture;
  loaddatadone = false;
  items: any = [];
  itemsfull: any = [];
  itemsHasSameCity: any=[];
  isdepart:any;

  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private zone: NgZone,
    public storage: Storage,
    public tourService: tourService) { 
      this.storage.get("listdeparture").then((data)=>{
        if(!data){
          this.loadLocation();
        }else{
          this.zone.run(()=>{
            this.items = [...data];
            this.itemsfull = [...data];
            setTimeout(()=>{
              this.loaddatadone = true;
            },300);
        })
        }
      })
    }

    ngOnInit(){

    }
    ionViewDidEnter() {
      setTimeout(() => {
        this.ipSearchDeparture.setFocus();
      }, 150);
    }

    loadLocation(){
        var se = this;
        let headers = {
          apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
          apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
        };
        let url = C.urls.baseUrl.urlMobile+ '/tour/api/TourApi/GetDepartureLocation';
        se.gf.RequestApi('GET', url, headers, null, 'searchregion', 'getdata').then((result) => {
            //let result = JSON.parse(data);
            if(result && result.Response && result.Response.length >0){
                se.zone.run(()=>{
                    se.items = [...result.Response];
                    se.storage.set('listdeparture', result.Response);
                    se.itemsfull = [...result.Response];
                    se.items.forEach(element => {
                        element.show = true;
                      });
                    setTimeout(()=>{
                      se.loaddatadone = true;
                    },300);
                })
              
            }
        })
    }

    goback(){
        this.navCtrl.pop();
    }

    getItems(ev: any) {
      var se = this;
      if(ev.detail.value){
        const val = se.gf.convertFontVNI(ev.detail.value).toLowerCase();
        if(se.itemsfull && se.itemsfull.length >0){
          let filteritems = se.itemsfull.filter((element) => { return element && se.gf.convertFontVNI(element.Name).toLowerCase().indexOf(val) != -1 });
            se.zone.run(()=>{
              if(filteritems && filteritems.length >0){
                se.items = [...filteritems];
              }
             
            })
        }
      }else{
        se.zone.run(()=>{
          se.items = [];
          for (let index = 0; index < 25; index++) {
            const element = se.itemsfull[index];
            if(element){
              element.show = true;
              se.items.push(element);
            }
            
          }
        })
      }
    }

    itemclick(item){
      var se = this;
        se.tourService.itemDeparture = item;
        se.tourService.itemSearchDeparture.emit(1);
        se.navCtrl.back();
    }
}