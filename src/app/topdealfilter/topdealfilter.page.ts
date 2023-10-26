import { Component, OnInit, ViewChild, HostListener, NgZone, Input } from '@angular/core';
import { NavController, ModalController, ToastController, ActionSheetController } from '@ionic/angular';
import { GlobalFunction } from '../providers/globalfunction';
import * as $ from 'jquery';
import { C } from '../providers/constants';
import { OverlayEventDetail } from '@ionic/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { ValueGlobal, SearchHotel } from '../providers/book-service';
import {flightService} from '../providers/flightService';

import { topDealService} from '../providers/topDealService';
var document:any;
@Component({
  selector: 'app-topdealfilter',
  templateUrl: './topdealfilter.page.html',
  styleUrls: ['./topdealfilter.page.scss'],
})
export class TopdealfilterPage implements OnInit {

  loadpricedone = false;
  items: any[];
  itemsfull: any[];
  selectedRegion: any=[];
  minpricedisplay = "0đ";
  maxpricedisplay = "15.000.000đ";
  priceobject: any = { lower: 0, upper: 15000000 }
  countTopdealFilter = 0;
  minvalue: any;
  maxvalue: any;
  listRegion:any = [];
  cleartopdealfilter: boolean=false;

  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private zone: NgZone,
    public storage: Storage,
    private actionsheetCtrl: ActionSheetController,
    public valueGlobal: ValueGlobal,
    public searchhotel: SearchHotel,
    public topDealService: topDealService) { 

      this.zone.run(()=>{
          this.zone.run(()=>{
            let maxValue = Math.max(...this.topDealService.listData.map((o:any) => o.minPrice), 0);
            let minValue = Math.min(...this.topDealService.listData.map((o:any) => o.minPrice));
            this.minvalue = minValue.toString();
            this.maxvalue = maxValue.toString();
            this.minpricedisplay = this.gf.convertNumberToString(minValue) + "đ"; 
            this.maxpricedisplay = this.gf.convertNumberToString(maxValue) + "đ";

            let maxValuePriceObject = Math.max(...this.topDealService.listSlideData.map(o => o.minPrice), 0);
            let minValuePriceObject = Math.min(...this.topDealService.listSlideData.map(o => o.minPrice));
            this.priceobject = { lower: minValuePriceObject.toString(), upper: maxValuePriceObject.toString() };

            this.countTopdealFilter = this.topDealService.listSlideData.length;
        })
          if(this.topDealService.listRegion && this.topDealService.listRegion.length >0){
            this.listRegion = this.topDealService.listRegion;
          }
          //this.countTopdealFilter = this.topDealService.listData.length;
          if(this.topDealService.objectFilter && this.topDealService.objectFilter.selectedRegion && this.topDealService.objectFilter.selectedRegion.length >0){
            this.selectedRegion = this.topDealService.objectFilter.selectedRegion;
              setTimeout(()=> {
                for (let index = 0; index < this.topDealService.objectFilter.selectedRegion.length; index++) {
                  const element = this.topDealService.objectFilter.selectedRegion[index];
                  if(this.gf.checkExistsIndex(this.selectedRegion,element)){
                    this.renderCssByType(element, true );
                  }
                  
                }
              },300)
          }
        })


    }

    ngOnInit(){
      var se = this;
     
    }

    close(){
      this.modalCtrl.dismiss();
    }

    changeprice() {
      console.log(this.priceobject)
      if(this.priceobject && !isNaN(this.priceobject.lower) && !isNaN(this.priceobject.upper) ){
        this.minpricedisplay = this.gf.convertNumberToString(this.priceobject.lower) + "đ"; 
        this.maxpricedisplay = this.gf.convertNumberToString(this.priceobject.upper) + "đ";
        this.filterItem();
      }
    }

    /***
   * Hàm set style mục chọn filter được check(màu xanh)/uncheck (ko màu)
   * PDANH 28/01/2019
   */
  renderCssByType(strIndex: string,checked: boolean){
    var objRegion = window.document.getElementById(strIndex);
    if(objRegion){
      objRegion.classList.remove('region-check');
      objRegion.classList.remove('region-uncheck');
      objRegion.classList.add(checked ? 'region-check' : 'region-uncheck');
    }
  }

   /***
   * Hàm set style mục chọn filter được check(màu xanh)/uncheck (ko màu)
   * PDANH 28/01/2019
   */
  renderDisabledItem(strIndex: string){
    var objRegion = window.document.getElementById(strIndex);
    if(objRegion){
      objRegion.classList.remove('region-check');
      objRegion.classList.remove('region-uncheck');
      objRegion.classList.add('region-disabled');
    }
  }
    
    itemRegionClick(item){
      var objRegion = window.document.getElementById(item.regionId);
      let itemdisabled = objRegion?.classList.contains('region-disabled');
      if(itemdisabled){
        return;
      }
      if(this.selectedRegion.indexOf(item.regionId) != -1){
        this.gf.removeItem(this.selectedRegion, item.regionId);
      }else{
        this.selectedRegion.push(item.regionId);
      }
      this.renderCssByType(item.regionId, this.gf.checkExistsIndex(this.selectedRegion,item.regionId) );
      
      this.filterItem();
    }

    

    filterByListFlight(list){
      var se = this;
      var listFilter:any =[];
        let filterPrice = list.filter((filterpriceitem) => {
          return filterpriceitem.minPrice *1 >= this.priceobject.lower *1 && filterpriceitem.minPrice *1 <= this.priceobject.upper *1;
        })
        listFilter = [...filterPrice];

          

          if(se.selectedRegion && se.selectedRegion.length >0){
            let filterRegion = listFilter.filter((filterRegionitem) => {
              let str;
              return se.selectedRegion.indexOf(filterRegionitem.regionId) != -1;
            })
            listFilter = [...filterRegion];
          }

          list = listFilter;
          
        return list;
    }

    filterItem(){
      var se = this;
      if(se.selectedRegion && se.selectedRegion.length >0){
        se.topDealService.listDataFilter = se.filterByListFlight([...se.topDealService.listData]);
      }else{
        se.topDealService.listData = [...se.topDealService.listAllData];
        se.topDealService.listDataFilter = se.filterByListFlight([...se.topDealService.listAllData]);
      }
      

      if(se.topDealService.listDataFilter && se.topDealService.listDataFilter.length >0){
        se.zone.run(()=>{
          se.countTopdealFilter = se.topDealService.listDataFilter.length;
          })
      }else{
        se.zone.run(()=>{
          se.countTopdealFilter = 0;
        })
      }
      
    }

    filter(){
        this.topDealService.objectFilter = {};
        this.topDealService.objectFilter.minprice = this.priceobject.lower;
        this.topDealService.objectFilter.maxprice = this.priceobject.upper;
        this.topDealService.objectFilter.selectedRegion = this.selectedRegion;
        if(this.topDealService.listDataFilter.length != this.topDealService.listSlideData.length && (!this.cleartopdealfilter || (this.cleartopdealfilter && this.selectedRegion.length >0) )){
          this.topDealService.itemCountFilter.emit(1);
        }
        
      
      this.modalCtrl.dismiss({hasfilter: true});
    } 

    clearFilter(){
      this.cleartopdealfilter = true;
        this.topDealService.objectFilter = null;
        let maxValue = Math.max(...this.topDealService.listAllData.map(o => o.minPrice), 0);
        let minValue = Math.min(...this.topDealService.listAllData.map(o => o.minPrice));
        this.minvalue = minValue;
        this.maxvalue = maxValue;
        this.priceobject = { lower: minValue.toString(), upper: maxValue.toString() };
       
        this.selectedRegion =[];
      setTimeout(()=>{
        this.zone.run(()=>{
          this.topDealService.listData = [...this.topDealService.listAllData];
          this.topDealService.listDataFilter = this.topDealService.listAllData;
          this.countTopdealFilter = this.topDealService.listAllData.length;
          
          for (let index = 0; index < this.listRegion.length; index++) {
            const element = this.listRegion[index];
            let objRegion = window.document.getElementById(element.regionId);
            if(objRegion){
              objRegion.classList.remove('region-check');
              objRegion.classList.remove('region-uncheck');
              objRegion.classList.remove('region-disabled');
            }
          }
        })
        this.topDealService.itemClearFilter.emit(1);
      },100)
       
    }
}