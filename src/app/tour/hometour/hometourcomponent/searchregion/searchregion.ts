import { Component, NgZone, ViewChild, OnInit, Input } from '@angular/core';
import { NavController, Platform} from '@ionic/angular';

import { AuthService } from './../../../../providers/auth-service';
import { ValueGlobal } from './../../../../providers/book-service';
import { tourService } from './../../../../providers/tourService';
import { C } from './../../../../providers/constants';
import { GlobalFunction } from './../../../../providers/globalfunction';
import { NetworkProvider } from './../../../../network-provider.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
/**
 * Generated class for the tourServicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-searchregion',
  templateUrl: 'searchregion.html',
  styleUrls: ['searchregion.scss'],
})
export class SearchRegionPage implements OnInit{
  ngOnInit() {
   // this.id = this.activatedRoute.snapshot.paramMap.get('id');
   
    //if(this.id==1){
     // this.inputText = this.activatedRoute.snapshot.paramMap.get('text');
    //  this.getItem(this.inputText)
    //}
  }
  @ViewChild('ipsearchregion') myInput;
  json; input; child1 = 0; child = 0;
  fieldName1: any;
  adults1 = 2; adults = 2;
  arrchild1:any = [];
  arrchild:any = [];
  showpopup = false;
  ischeckadults = true;
  ischeckchild = false;
  ischeckroom = false;
  public room1 = 1; public room = 1; gbitem; gbmsg;
  items:any = []; ischecklist = false; isenabled = true;
  co = 0; recent; index
  setInter;ischecktext=false;
  public isConnected:boolean;
  inputText="";arrHistory:any=[];objHotelInfo;id;
  arrsdk = [1,2,3,4,5,6];
  loadregiondone = false;
  constructor(public platform: Platform,public navCtrl: NavController, public authService: AuthService, public zone: NgZone, 
    public tourService: tourService,
    public gf: GlobalFunction,
    public networkProvider: NetworkProvider,
    public storage: Storage,
    public router: Router,
    public valueGlobal: ValueGlobal, public activatedRoute: ActivatedRoute) {
    //this.recent = this.tourService.recent;
    
    this.getdata();

    
  }
  ionViewDidEnter() {
    setTimeout(() => {
      this.myInput.setFocus();
    }, 150);

    
    this.storage.get('listSearchTour').then((recent)=> {
      if(recent && recent.length >0){
        console.log(recent);
        this.recent = recent;
      }
    })
    
  }
  change() {
    this.showpopup = false;
    this.recent = this.tourService.recent;
  }
  

  ionViewWillEnter(){
    this.showpopup = false;
    this.recent = this.tourService.recent;
  }
  getdata() {
    var se = this;
    let url = C.urls.baseUrl.urlMobile+ '/tour/api/TourApi/GetHotRegion';
      let headers = {
        apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
      };
      se.gf.RequestApi('GET', url, headers, null, 'searchregion', 'getdata').then((res) => {
          se.loadregiondone = true;
          if(res && res.Response && res.Response.length >0){
            se.json = res.Response;
            se.json.forEach(element => {
              if(element.Image && element.Image.indexOf('http') == -1){
                element.Image = 'https:'+element.Image;
              }
            });
          }else{
            se.json = [];
          }
          
        //}
      })
  }

  itemclick(item) {
    this.tourService.input = item;
    this.tourService.itemSearchTour.emit(1);
    //this.navCtrl.back();
    this.navCtrl.pop();
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    var se = this;
    if(ev.detail.value){
      const val = ev.detail.value;
      let url = C.urls.baseUrl.urlMobile+'/tour/api/TourApi/SearchTour?keyword=' +val;
      let headers = {
        apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
      };
      se.gf.RequestApi('GET', url, headers, null, 'searchregion', 'getItems').then((lstitems) => {
              se.zone.run(() => {
                //let lstitems = JSON.parse(data);
                console.log(lstitems);
                if(lstitems.length && lstitems.length >0){
                  se.ischecktext=false;
                  se.ischecklist = true;
                 se.items = lstitems;
                  
                }else{
                  se.items.forEach(element => {
                    element.show = false;
                  });
                  se.ischecktext=true;
                }
              });
      })
     }
    else {
      se.ischecklist = false;
      se.ischecktext=false;
      se.items.forEach(element => {
          element.show = false;
      });
    }
  }
  goback() {
    this.navCtrl.pop();
  }

  clearText(){
    this.inputText="";
    this.ischecklist = false;
  }
  
  selectItemHot(item) {
    this.tourService.input = item;
    this.tourService.itemSearchTour.emit(1);
    //this.navCtrl.navigateBack('/app/tabs/tab1');
    this.navCtrl.pop();
  }
}
