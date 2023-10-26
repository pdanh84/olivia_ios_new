import { Component,OnInit, NgZone } from '@angular/core';
import { NavController,Platform,LoadingController } from '@ionic/angular';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { ActivatedRoute } from '@angular/router';

import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { SearchHotel } from '../providers/book-service';
/**
 * Generated class for the PolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-policy',
  templateUrl: 'policy.html',
  styleUrls: ['policy.scss'],
})
export class PolicyPage implements OnInit{
  Name;
  cin; cout;
  HotelPolicies;
  HotelID;
  loader: any;
  constructor(public platform: Platform,public navCtrl: NavController, public gf: GlobalFunction,private activatedRoute:ActivatedRoute,public zone: NgZone,
    private storage:Storage,public loadingCtrl: LoadingController,
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
          this.cin = jsondata.CheckinTime;
          this.cout = jsondata.CheckoutTime;
          this.HotelPolicies = jsondata.HotelPolicies
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
    gf.googleAnalytion('policy','load','');
  }

  ngOnInit(){

  }

  getdata() {
    // this.http.post(C.urls.baseUrl.urlPost +"/mhoteldetail/" + this.HotelID + "", "")
    //   .toPromise()
    //   .then(data => {
    //     let jsondata = data.json();
    //     this.Name = jsondata.Name;
    //     this.cin = jsondata.CheckinTime;
    //     this.cout = jsondata.CheckoutTime;
    //     this.HotelPolicies = jsondata.HotelPolicies
    //     // for (let i = 0; i < this.HotelPolicies.length; i++) {
    //     //   this.HotelPolicies[i].PolicyDes=this.strip_html_tags(htmlDecode(this.HotelPolicies[i].PolicyDes))
    //     // }
    //   })
    //   .catch(
    //     error => {
    //     console.log("reg error", error)
    //     if (error) {
    //       error.page="policy";
    //       error.func="getdata";
    //       C.writeErrorLog(error);
    //     };
    //   }
    //   );
    var se=this;
    //let url = C.urls.baseUrl.urlPost +"/mhoteldetail/"+this.HotelID;
    // var options = {
    //   method: 'POST',
    //   url: url,
    //   timeout: 180000, maxAttempts: 5, retryDelay: 2000,
    // };

    let urlPath = C.urls.baseUrl.urlPost +"/mhoteldetail/"+this.HotelID;
    
    this.gf.RequestApi('POST', urlPath, {}, {}, 'policy', 'getdata').then((data)=>{

        let jsondata = data;
        se.loader.dismiss();
        se.zone.run(()=>{
          se.Name = jsondata.Name;
          se.cin = jsondata.CheckinTime;
          se.cout = jsondata.CheckoutTime;
          se.HotelPolicies = jsondata.HotelPolicies
        })
       
    })
  }
  goback(){
    //this.navCtrl.navigateBack('/hoteldetail/'+this.HotelID);
    this.navCtrl.navigateBack('/hoteldetail/'+this.HotelID);
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }

}
