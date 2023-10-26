import { OverlayEventDetail } from '@ionic/core';
import { FlightdcpickaddressinputPage } from './../flightdcpickaddressinput/flightdcpickaddressinput.page';
import { NavController, ModalController,LoadingController } from '@ionic/angular';
import { Component, OnInit, NgZone } from '@angular/core';
import { C } from '../providers/constants';

import { flightService } from './../providers/flightService';
import { GlobalFunction } from '../providers/globalfunction';
@Component({
  selector: 'app-flightdcpickaddress',
  templateUrl: './flightdcpickaddress.page.html',
  styleUrls: ['./flightdcpickaddress.page.scss'],
})
export class FlightdcpickaddressPage implements OnInit {

  isblocktextDepart = false;
  isblocktextReturn = false; inputFrom = "Nhập sân bay, địa điểm hoặc tên khách sạn"; inputTo = "Nhập sân bay, địa điểm hoặc tên khách sạn"
  locationFrom;locationTo;
  isenabledbtn=true;location
  isLoaderDepart=true;isLoaderReturn=true;
  public loader: any;
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,public _flightService: flightService, public modalCtrl: ModalController,public zone:NgZone,
    public gf: GlobalFunction) {
   
    this.getLocationFrom(0);
    this.getLocationTo(0);
  }

  ngOnInit() {
    this._flightService.itemTranferChange.subscribe((data) => {
      if (data) {
        this.isblocktextDepart=this._flightService.itemFlightCache.isblocktextDepart;
        if (this._flightService.itemFlightCache.departDCPlace) {
         this.inputFrom=this._flightService.itemFlightCache.departDCPlace.description;
       }
       this.isblocktextReturn=this._flightService.itemFlightCache.isblocktextReturn;
       if (this.isblocktextReturn) {
        if (this._flightService.itemFlightCache.returnDCPlace) {
          this.inputTo = this._flightService.itemFlightCache.returnDCPlace.description;
        }else{
          if (this._flightService.itemFlightCache.objHotelCitySelected) {
            this.inputTo = this._flightService.itemFlightCache.objHotelCitySelected.Address;
            this.location = this._flightService.itemFlightCache.objHotelCitySelected.Location;
            this.getInput();
           
          } else {
            this.inputTo="Nhập sân bay, địa điểm hoặc tên khách sạn";
          }
        }
       
      }else{
        this.inputTo="Nhập sân bay, địa điểm hoặc tên khách sạn";
      }
      
      }
     
    })

  }
  getInput() {
    var se = this;
    if (this.inputTo) {
      this.presentLoading();
      // var options = {
      //   method: 'GET',
      //   url: C.urls.baseUrl.urlMobile + '/api/Dashboard/AutoCompleteFromGG?AirportLocation=' + this.location + '&Place=' + this.inputTo,
      //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
      //   headers:
      //   {
      //   }
      // };
      let headers = {};
      let strUrl = C.urls.baseUrl.urlMobile + '/api/Dashboard/AutoCompleteFromGG?AirportLocation=' + this.location + '&Place=' + this.inputTo;
        this.gf.RequestApi('GET', strUrl, headers, {}, 'flightDCPickAddress', 'checkBOD').then((data)=>{

        if(se.loader)
        {
          se.loader.dismiss();
        }
        var body = data;
        se._flightService.itemFlightCache.returnDCPlace = body.data.predictions[0];
      });
    }

  }
  goback() {
    this._flightService.itemFlightCache.isblocktextDepart = this.isblocktextDepart;
    this._flightService.itemFlightCache.isblocktextReturn = this.isblocktextReturn;
    if (!this.isblocktextDepart&&!this.isblocktextReturn) {
      this._flightService.itemFlightCache.DICHUNGParam=null;
    }
    this._flightService.itemTranferChange.emit(true);
    this.navCtrl.navigateBack('/flightaddservice');
  }
  toggleChangeDepart(ev) {
    this.isblocktextDepart = ev.detail.checked;
    if(this.isblocktextDepart){ 
      if (this._flightService.itemFlightCache.departDCPlace) {
        this.inputFrom =this._flightService.itemFlightCache.departDCPlace.description
      } else {
        this.inputFrom = "Nhập sân bay, địa điểm hoặc tên khách sạn"
      }
     
    }else{
      this.inputFrom = "Nhập sân bay, địa điểm hoặc tên khách sạn"
    }
  }
  toggleChangeReturn(ev) {
    this.isblocktextReturn = ev.detail.checked;
    if (this.isblocktextReturn) {
      // this.getLocationTo(0);
      if (this._flightService.itemFlightCache.objHotelCitySelected) {
        this.inputTo = this._flightService.itemFlightCache.objHotelCitySelected.Address;
        this.location = this._flightService.itemFlightCache.objHotelCitySelected.Location;
        this.getInput();
      } else {
        if (this._flightService.itemFlightCache.returnDCPlace) {
          this.inputTo = this._flightService.itemFlightCache.returnDCPlace.description
        }
        else {
          this.inputTo = "Nhập sân bay, địa điểm hoặc tên khách sạn"
        }
      }

    } else {
      this.inputTo = "Nhập sân bay, địa điểm hoặc tên khách sạn"
    }
  }
  searchDepart() {
    if(this.isLoaderDepart){
      this.isLoaderDepart=false;
      this.getLocationFrom(1);
    }
  }
  searchReturn() {
    if(this.isLoaderReturn){
      this.isLoaderReturn=false;
      this.getLocationTo(1);
    }
  }
  getLocationFrom(value) {
    var se = this;
    // var options = {
    //   method: 'GET',
    //   url: C.urls.baseUrl.urlMobile + '/api/Dashboard/FindPlaceFromGG?input=' + this._flightService.itemFlightCache.departAirport,
    //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
    //   headers:
    //   {
    //   }
    // };
    let headers = {};
      let strUrl = C.urls.baseUrl.urlMobile + '/api/Dashboard/FindPlaceFromGG?input=' + this._flightService.itemFlightCache.departAirport;
        this.gf.RequestApi('GET', strUrl, headers, {}, 'flightDCPickAddress', 'getLocationFrom').then((data)=>{

      var body = data;
      se.locationFrom = body.data.location;
      se._flightService.itemFlightCache.departDCAirport=body.data.placeId;
      if (se.locationFrom && value == 1) {
        se.isblocktextDepart=true;
        se.isLoaderDepart=true;
        se.showInput('From');
      }
    });
  }
  getLocationTo(value) {
    var se = this;
    // var options = {
    //   method: 'GET',
    //   url: C.urls.baseUrl.urlMobile + '/api/Dashboard/FindPlaceFromGG?input=' + this._flightService.itemFlightCache.returnAirport,
    //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
    //   headers:
    //   {
    //   }
    // };
    let headers = {};
      let strUrl = C.urls.baseUrl.urlMobile + '/api/Dashboard/FindPlaceFromGG?input=' + this._flightService.itemFlightCache.returnAirport;
        this.gf.RequestApi('GET', strUrl, headers, {}, 'flightDCPickAddress', 'getLocationTo').then((data)=>{

      var body = data;
      se.locationTo = body.data.location;
      se._flightService.itemFlightCache.returnDCAirport=body.data.placeId;
      if (se.locationTo && value == 1) {
        se.isblocktextReturn=true;
        se.isLoaderReturn=true;
        se.showInput('To');
      }
    });
  }
  async showInput(text) {
    var location;
    if (text=='From') {
      location=this.locationFrom;
    }else{
      location=this.locationTo;
    }
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: FlightdcpickaddressinputPage,
        componentProps: {
          'value': text,
          'location': location
        }
      });
    modal.present();
    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      if (data.data) {
        if (data.data.FromTo == 'From') {
          this.inputFrom = data.data.item.description;
          this._flightService.itemFlightCache.departDCPlace=data.data.item;
        }
        else if (data.data.FromTo == 'To') {
          this.inputTo = data.data.item.description;
          this._flightService.itemFlightCache.returnDCPlace=data.data.item;
        }
      }
    })
  }
  next(){
    if (!this.isblocktextDepart && !this.isblocktextReturn) {
      alert('Vui lòng chọn địa điểm đón tiễn');
      return;
    }
    if (!this._flightService.itemFlightCache.departDCPlace && !this._flightService.itemFlightCache.returnDCPlace) {
      alert('Vui lòng chọn địa điểm đón tiễn');
      return;
    }
    if (this.isblocktextDepart) {
      if (!this._flightService.itemFlightCache.departDCPlace) {
          alert('Vui lòng chọn địa điểm đón tiễn tại '+this._flightService.itemFlightCache.departCity);
          return;
      }
    }
    else{
      this._flightService.itemFlightCache.departDCPlace=null
    }
    if(this.isblocktextReturn)
    {
      if (!this._flightService.itemFlightCache.returnDCPlace) {
        alert('Vui lòng chọn địa điểm đón tiễn tại '+this._flightService.itemFlightCache.returnCity);
        return;
      }
    }else{
      this._flightService.itemFlightCache.returnDCPlace=null;
    }

    if(this.locationFrom){
      this._flightService.itemFlightCache.locationFrom=this.locationFrom;
    }else{
      this._flightService.itemFlightCache.locationFrom=null;
    }
    if(this.locationTo){
      this._flightService.itemFlightCache.locationTo=this.locationTo;
    }else{
      this._flightService.itemFlightCache.locationTo=null;
    }
    this.navCtrl.navigateForward('/flightdcdetail/'+this.isblocktextDepart+'/'+this.isblocktextReturn);
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }
}

