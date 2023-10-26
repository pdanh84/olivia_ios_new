import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, Platform,LoadingController } from '@ionic/angular';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { ActivatedRoute } from '@angular/router';

import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { SearchHotel } from '../providers/book-service';

@Component({
  selector: 'app-description',
  templateUrl: 'description.html',
  styleUrls: ['description.scss'],
})
export class DescriptionPage implements OnInit{
  public Name;
  public FullDescription;
  public HotelID;
  public urlpath = C.urls.baseUrl.urlPost;
  loader: any;
  constructor(public platform: Platform,public navCtrl: NavController,public gf: GlobalFunction,public activatedRoute: ActivatedRoute,
    public zone: NgZone,
    private storage: Storage,public loadingCtrl: LoadingController,
    public searchhotel: SearchHotel) {
    this.HotelID = this.activatedRoute.snapshot.paramMap.get('id');
    this.Name = this.activatedRoute.snapshot.paramMap.get('name');
    let cindisplay = moment(this.searchhotel.CheckInDate).format('DD-MM-YYYY');
    let coutdisplay = moment(this.searchhotel.CheckOutDate).format('DD-MM-YYYY');
    this.storage.get('hoteldetail_'+ this.HotelID + "_" + cindisplay + "_" + coutdisplay ).then((data) =>{
      if(data){
        let jsondata = data;
        this.zone.run(()=>{
          this.Name = jsondata.Name;
          this.FullDescription = jsondata.FullDescription;
        })
      }else{
        this.getdata();
      }
    })
     //Xử lý nút back của dt
    this.platform.ready().then(() => {
      this.platform.backButton.subscribe(() => {
        this.navCtrl.navigateBack('/hoteldetail/'+this.HotelID);
      })
    })
    //google analytic
    gf.googleAnalytion('description','load','');
  }

  ngOnInit(){

  }
  goback(){
    this.navCtrl.navigateBack('/hoteldetail/'+this.HotelID);
  }
  getdata() {
    var se = this;
    let headers = {};
    let strUrl = se.urlpath + "/mhoteldetail/" + se.HotelID;
    this.presentLoading();
    this.gf.RequestApi('POST', strUrl, headers, { }, 'description', 'getdata').then((data)=>{
      se.loader.dismiss();
      if(data){
        let jsondata = data;
        se.zone.run(()=>{
          se.Name = jsondata.Name;
          se.FullDescription = jsondata.FullDescription
        })
      }
    })
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }
}
