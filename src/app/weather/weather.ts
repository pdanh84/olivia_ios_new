import { Component,NgZone,OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-weather',
  templateUrl: 'weather.html',
  styleUrls: ['weather.scss'],
})

export class WeatherPage implements OnInit{
    weatherData:any;
    CityName: string='';
    CountryCode: string;
    constructor(public platform: Platform,public navCtrl: NavController,public zone: NgZone,public storage: Storage,
      public gf: GlobalFunction,private ActivatedRoute: ActivatedRoute){
        //Xử lý nút back của dt
        this.platform.ready().then(() => {
          this.platform.backButton.subscribe(() => {
            // code that is executed when the user pressed the back button
            this.navCtrl.back();
          })
        })
      //google analytic
      gf.googleAnalytion('wearther','load','');
    }

    ngOnInit(){
      this.CityName =this.ActivatedRoute.snapshot.paramMap.get('cityName')||'';
      this.storage.get('weatherInfo'+"-"+this.CityName).then((data:any)=>{
        if(data){
          this.weatherData = data;
        }else{
          this.fetWeatherData();
        }
    })
    }

    fetWeatherData(){
        let self = this;
        self.CountryCode="VN";
        // var options = {
        //     method: 'GET',
        //     url: C.urls.baseUrl.urlMobile +'/api/Dashboard/GetWeatherByCityAndCountryCode?cityName='+self.CityName+'&countryCode='+self.CountryCode,
        //     timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //     headers:
        //     {},
        //     json: true
        //   };

          let urlStr = C.urls.baseUrl.urlMobile +'/api/Dashboard/GetWeatherByCityAndCountryCode?cityName='+self.CityName+'&countryCode='+self.CountryCode;
        let headers = {};
        this.gf.RequestApi('GET', urlStr, headers, {}, 'weather', 'fetWeatherData').then((data)=>{

              self.zone.run(() => {
                let result = data;
                if(result && result.length >0){
                  self.weatherData = result;
                  self.storage.set('weatherInfo'+"-"+self.CityName, result);
                }
              });
            
            
          });

          
    }
    goback(){
      this.navCtrl.back();
    }
}