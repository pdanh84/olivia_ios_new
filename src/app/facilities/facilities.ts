import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, Platform,LoadingController } from '@ionic/angular';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { SearchHotel } from '../providers/book-service';
/**
 * Generated class for the FacilitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-facilities',
  templateUrl: 'facilities.html',
  styleUrls: ['facilities.scss'],
})
export class FacilitiesPage implements OnInit{
  Name;
  HotelFacilities;
  HotelID;
  urlpath = C.urls.baseUrl.urlPost;
  loader: any;
  constructor(public platform: Platform,public navCtrl: NavController, public gf: GlobalFunction, private activatedRoute:ActivatedRoute,public zone: NgZone,
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
          this.HotelFacilities = jsondata.HotelFacilities
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
    gf.googleAnalytion('facilities','load','');
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
    this.gf.RequestApi('POST', strUrl, headers, { }, 'facilities', 'getdata').then((data)=>{
      se.loader.dismiss();
      if(data){
        let jsondata = data;
        se.zone.run(()=>{
          se.Name = jsondata.Name;
          se.HotelFacilities = jsondata.HotelFacilities
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
