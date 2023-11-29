import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { GlobalFunction } from '../providers/globalfunction';
import * as $ from 'jquery';

import { C } from './../providers/constants';
import { SearchHotel } from '../providers/book-service';
import { DomSanitizer } from '@angular/platform-browser';
import { flightService } from '../providers/flightService';

@Component({
  selector: 'app-hotelcityitem',
  templateUrl: './hotelcityitem.page.html',
  styleUrls: ['./hotelcityitem.page.scss'],
})
export class HotelCityItemPage {
    @Input() item:any;
    @Input() index:any;
    @Input() itemlen:any;
    constructor(private navCtrl: NavController, public gf: GlobalFunction,
        public _searchhotel: SearchHotel,
        private sanitizer: DomSanitizer,
        public _flightService: flightService) {
          var se = this;
       }

       itemHotelCityClick(item){
          if(item && item.defaultHotelData){
             this.showHotelCityDetail(item.defaultHotelData);
          }else{
            this.loadDataHotelDetail(item);
          }
       }

       loadDataHotelDetail(item){
        var se = this;
        se.gf.showLoading();
        //let url = C.urls.baseUrl.urlPost + "/mhoteldetail/" + item.HotelId;
        
        // var options = {
        //   method: 'POST',
        //   url: url,
        //   timeout: 180000, maxAttempts: 5, retryDelay: 2000,
        // };
        let urlPath = C.urls.baseUrl.urlPost + "/mhoteldetail/" + item.HotelId;
        let headers = {};
        this.gf.RequestApi('POST', urlPath, headers, {}, 'hotelcityitem', 'loadDataHotelDetail').then((data)=>{

          if (data) {
            let jsondata = data;
            item.defaultHotelData = jsondata;
            item.Avatar = (item.Avatar.trim().indexOf("http") != -1 ? item.Avatar : 'https:' + item.Avatar);
            se.showHotelCityDetail(item.defaultHotelData);
          }
          se.gf.hideLoading();
        })
    
    }

    showHotelCityDetail(data){
      var se = this;
        if(data && data.Rating){
          switch (data.Rating) {
            case 50:
              data.RatingStar = "../../assets/star/ic_star_5.svg";
              break;
            case 45:
              data.RatingStar = "../../assets/star/ic_star_4.5.svg";
              break;
            case 40:
              data.RatingStar = "../../assets/star/ic_star_4.svg";
              break;
            case 35:
              data.RatingStar = "../../assets/star/ic_star_3.5.svg";
              break;
            case 30:
              data.RatingStar = "../../assets/star/ic_star_3.svg";
              break;
            case 25:
              data.RatingStar = "../../assets/star/ic_star_2.5.svg";
              break;
            case 20:
              data.RatingStar = "../../assets/star/ic_star_2.svg";
              break;
            case 15:
              data.RatingStar = "../../assets/star/ic_star_1.5.svg";
              break;
            case 10:
              data.RatingStar = "../../assets/star/ic_star_1.svg";
              break;
            case 5:
              data.RatingStar = "../../assets/star/ic_star_0.5.svg";
              break;
            default:
              break;
          }
        }

        let link = "https://maps.google.com/maps?q=" + data.Code + "&hl=es;z=14&amp&output=embed";
        data.linkGoogleMap = se.sanitizer.bypassSecurityTrustResourceUrl(link);

      se._searchhotel.itemHotelCityDetail = data;
      se.navCtrl.navigateForward('/hotelcityitemdetail');
    }

    changeRoom(item){
      this._flightService.itemHotelCityChangeRoom.emit(1);
      setTimeout(()=>{
        item.checkaddhotel = true;
        let objselect = item.hotelDetail.RoomClasses.filter((item) => {return item.selected});
        if(objselect && objselect.length==0){
          item.hotelDetail.RoomClasses[0].selected = true;
        }
  
        this._searchhotel.listHotelCityRoomUpgrade = item.hotelDetail.RoomClasses;
        this._searchhotel.hotelCityId = item.HotelId;
        this.navCtrl.navigateForward('/hotelcityroomupgrade');
      },50)
      
    }

    addHotelCityPrice(e){
      if(e.currentTarget.checked){
            this._flightService.itemHotelCityAddHotel.emit({id: e.currentTarget.itemid, value: true});
          }else{
            this._flightService.itemHotelCityAddHotel.emit({id: e.currentTarget.itemid, value: false});
            //this._flightService.itemFlightCache.returnDCPlace=null;
          }
          
    }
}