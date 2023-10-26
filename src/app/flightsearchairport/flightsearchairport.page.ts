import { Component, OnInit, ViewChild, HostListener, NgZone, Input } from '@angular/core';
import { NavController, ModalController, ToastController, ActionSheetController } from '@ionic/angular';
import { GlobalFunction } from '../providers/globalfunction';
import { C } from './../providers/constants';
import { Storage } from '@ionic/storage';
import { ValueGlobal, SearchHotel } from '../providers/book-service';
import {flightService} from './../providers/flightService';


@Component({
  selector: 'app-flightsearchairport',
  templateUrl: './flightsearchairport.page.html',
  styleUrls: ['./flightsearchairport.page.scss'],
})
export class FlightsearchairportPage implements OnInit {
  @ViewChild('ipSearchAiport') ipSearchAiport ;
  loaddatadone = false;
  items: any = [];
  itemsfull: any = [];
  itemsHasSameCity: any=[];
  isdepart:any;
  itemsRegular: any = [];
  itemsRegularInternational: any = [];
  listLastSearch: any = [];
  itemsFilter: any=[];

  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private zone: NgZone,
    public storage: Storage,
    private actionsheetCtrl: ActionSheetController,
    public valueGlobal: ValueGlobal,
    public searchhotel: SearchHotel,
    public _flightService: flightService) { 
       this.isdepart = this._flightService.searchDepartCode;
      this.storage.get("listAirport").then((data)=>{
        if(!data || (data && data.length ==0 )){
          this.loadLocation();
        }else{
          this.zone.run(()=>{
            let datainbound = data.filter((item) =>{ return item.code != 'FDF' && item.countryCode == 'VN'});
            let dataoutbound = data.filter((item) =>{ return item.code != 'FDF' && item.countryCode != 'VN'});
            let data1 = data.filter((item) =>{ return item.code != 'FDF'});
            this.itemsfull = [...data1];
            for (let index = 0; index < 25; index++) {
              const element = data1[index];
              this.items.push(element)
            }
            
            datainbound.sort((a,b)=>{ return (a.count - b.count)*-1 });
            for (let index = 0; index < 5; index++) {
              const element = datainbound[index];
              element.show = true;
              this.itemsRegular.push(element);
            }
            dataoutbound.sort((a,b)=>{ return (a.count - b.count)*-1 });
            for (let index = 0; index < 5; index++) {
              const element = dataoutbound[index];
              element.show = true;
              this.itemsRegularInternational.push(element);
            }
            
            this.itemsfull.forEach(element => {
              element.show = true;
              
            });

            setTimeout(()=>{
              this.loaddatadone = true;
            },300);
        })
        }
      })


      this.gf.getListLastSearchFlight().then((data)=>{
        this.listLastSearch = data;
        console.log(this.listLastSearch);
      })
    }

    ngOnInit(){

    }
    ionViewDidEnter() {
      setTimeout(() => {
        this.ipSearchAiport.setFocus();
      }, 150);
    }
    loadLocation(){
        var se = this;
    
          //let urlPath = C.urls.baseUrl.urlFlight + "gate/apiv1/AllPlace?token=3b760e5dcf038878925b5613c32615ea3ds";
          let urlPath = C.urls.baseUrl.urlFlight + "gate/apiv1/AllPlace";
          let headers = {
                "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                'Content-Type': 'application/json; charset=utf-8',
          };
          this.gf.RequestApi('GET', urlPath, headers, {}, 'flightSearchAiport', 'loadLocation').then((data)=>{

            let result = data;
            if(result && result.length >0){
              //result = result.filter((item) =>{ return item.country == "Việt Nam" && item.code != 'FDF'});
                se.zone.run(()=>{
                    se.items = [...result];
                    se.itemsfull = [...result];
                    se.items.forEach(element => {
                      element.show = true;
                    });

                    let datainbound = se.items.filter((item) =>{ return item.code != 'FDF' && item.countryCode == 'VN'});
                    let dataoutbound = se.items.filter((item) =>{ return item.code != 'FDF' && item.countryCode != 'VN'});
                    datainbound.sort((a,b)=>{ return (a.count - b.count)*-1 });
                    for (let index = 0; index < 5; index++) {
                      const element = datainbound[index];
                      element.show = true;
                      this.itemsRegular.push(element);
                    }
                    dataoutbound.sort((a,b)=>{ return (a.count - b.count)*-1 });
                    for (let index = 0; index < 5; index++) {
                      const element = dataoutbound[index];
                      element.show = true;
                      this.itemsRegularInternational.push(element);
                    }
                    setTimeout(()=>{
                      se.loaddatadone = true;
                    },300);
                })
              
            }
        })
    }

    goback(){
      if(this.valueGlobal.backValue == "flightchangeinfo"){
        this.modalCtrl.dismiss();
      }else{
        this.navCtrl.back();
      }
        
    }

    getItems(ev: any) {
      var se = this;
      if(ev.detail.value){
        const val = se.gf.convertUnicodeCharactorNew(ev.detail.value).toLowerCase();
        if(se.itemsfull && se.itemsfull.length >0){
          let filteritems = se.itemsfull.filter((element) => { return element && (se.gf.convertUnicodeCharactorNew(element.name).toLowerCase().indexOf(val) != -1 || se.gf.convertUnicodeCharactorNew(element.airport).toLowerCase().indexOf(val) != -1) });
            se.zone.run(()=>{
              se.itemsfull.sort((a,b)=>{ return ((a.order - b.order) > 0 ? 2 : -2) + ((a.internal - b.internal) > 0 ? -5 : 5 ) + ((a.count - b.count) >0 ? -1 : 1 ) });
              if(filteritems && filteritems.length >0){
                //se.items = [...filteritems];
                se.itemsFilter = [...filteritems];
              }
              //console.log(filteritems)
              //se.items = filteritems;
            })
        }
      }else{
        se.zone.run(()=>{
          se.itemsFilter = [];
          // for (let index = 0; index < 25; index++) {
          //   const element = se.itemsfull[index];
          //   if(element){
          //     element.show = true;
          //     se.items.push(element);
          //   }
            
          // }
        })
      }
    }

    itemclick(item){
      var se = this;
      if(se._flightService.searchDepartCode){
        se._flightService.itemFlightCache.departCode = item.code;
        se._flightService.itemFlightCache.departCity = item.city;
        se._flightService.itemFlightCache.departAirport = item.airport;
        se._flightService.itemFlightCache.fromCountryCode = item.countryCode;
      }else{
        se._flightService.itemFlightCache.returnCode = item.code;
        se._flightService.itemFlightCache.returnCity = item.city;
        se._flightService.itemFlightCache.returnAirport = item.airport;
        se._flightService.itemFlightCache.toCountryCode = item.countryCode;
      }
      se.gf.createListLastSearchFlight(item);
      se._flightService.itemFlightChangeLocation.emit(item);
      if(this.valueGlobal.backValue == "flightchangeinfo"){
        this.modalCtrl.dismiss();
      }else{
          this.navCtrl.back();
      }
    }
}