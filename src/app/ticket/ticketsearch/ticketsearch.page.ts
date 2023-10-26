
import { Component, NgZone,OnInit,ViewChild } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { C } from '../../providers/constants';
import { GlobalFunction } from '../../providers/globalfunction';
import * as moment from 'moment';
import * as $ from 'jquery';
import { Storage } from '@ionic/storage';
import { ticketService } from 'src/app/providers/ticketService';
/**
 * Generated class for the SearchHotelFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-ticketsearch',
  templateUrl: 'ticketsearch.page.html',
  styleUrls: ['ticketsearch.page.scss'],
})
export class TicketSearchPage implements OnInit{
  @ViewChild('ipSearch') myInput ;
  listHistorySearch:any =[];
  listRegionSearch:any =[];
  listHotRegion:any = [];
  listHotExperience: any;
  ischecktext: boolean;
  ischecklist: boolean;
  items: any;
itemRegion: any;
itemTicket:any
constructor(
  public gf: GlobalFunction,public navCtrl: NavController, private storage: Storage, public ticketService: ticketService,public zone: NgZone) {
    this.loadHistorySearch();
    this.loadRegion();

  }
  ionViewDidEnter(){
    setTimeout(() => {
      this.myInput.setFocus();
    }, 150);
  }
 
  loadBestExperience() {
      let se = this;
      let url = `${C.urls.baseUrl.urlTicket}/api/Home/GetBestExperiences`;
      let headers = {
          apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
          apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
      };
      se.gf.RequestApi('GET', url, headers, null, 'ticketsearch', 'GetBestExperiences').then((data) => {
          this.gf.hideLoading()
          let res = data;
          se.listHotExperience = res.data;
      })
  }
  async loadHistorySearch() {
      let listLastSearch:any = await this.gf.getListLastSearchTicketRegion();
      if(listLastSearch && listLastSearch.length >0){
          this.listHistorySearch = listLastSearch;
      }else{
          this.listHistorySearch = [];
      }
  }
  getItems(ev: any) {
      // Reset items back to all of the items
      var se = this;
      if(ev.detail.value){
        const val = ev.detail.value;
        let url = `${C.urls.baseUrl.urlTicket}/api/Home/SearchExperience?keyword=` +val;
        let headers = {
          apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
          apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
        };
        se.gf.RequestApi('GET', url, headers, null, 'searchregion', 'getItems').then((data) => {
                se.zone.run(() => {
                  let lstitems = data;
                  console.log(lstitems);
                  if(lstitems.data.experiences.length && lstitems.data.experiences.length >0 || lstitems.data.regions.length && lstitems.data.regions.length >0){
                    se.ischecktext=false;
                    se.ischecklist = true;
                    se.itemTicket = lstitems.data.experiences;
                    se.itemRegion = lstitems.data.regions;
                  }else{
                    // se.items.forEach(element => {
                    //   element.show = false;
                    // });
                    // se.ischecktext=true;
                  }
                });
        })
       }
      else {
        se.ischecklist = false;
        se.ischecktext=false;
      }
    }

  loadRegion() {
      let se = this;
      this.gf.showLoading()
      let url = C.urls.baseUrl.urlTicket+'/api/Home/GetAllRegions';
      let headers = {
          apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
          apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
      };
      se.gf.RequestApi('GET', url, headers, null, 'ticketsearch', 'GetAllRegions').then((data) => {
          let res = data;
          se.listRegionSearch = res.data;
          se.loadBestExperience();
      })
  }

ngOnInit() {
  
}

goback() {
  this.navCtrl.back();
}

clickItemRegion(item){
  this.ticketService.publicSearchTicketRegion(item);
  this.gf.createListLastSearchTicketRegion(item,0);
  this.ticketService.input = item;
  // this.ticketService.itemSearchTicket.emit(1);
  this.ticketService.inputText = "";
        this.gotoListSearch();
  // this.navCtrl.back();
}
clearText(){
  this.ticketService.inputText="";
}
itemclick(item,stt) {
  item.stt=stt;
  if (stt==1) {
    let itemTicket = {
      expId:item.id,
      expName:item.name
    };
    this.ticketService.publicSearchTicketRegion(itemTicket);
    this.gf.createListLastSearchTicketRegion(itemTicket,stt);
    this.ticketService.input = itemTicket;
  }else{
    this.ticketService.publicSearchTicketRegion(item);
    this.gf.createListLastSearchTicketRegion(item,stt);
    this.ticketService.input = item;
  }
  this.ticketService.inputText = "";

  this.gotoListSearch();


  // this.ticketService.itemSearchTicket.emit(1);
  // this.navCtrl.pop();
}
gotoListSearch() {
  if (this.ticketService.input) {
    if (this.ticketService.input.expId && this.ticketService.input.expName) {
      this.ticketService.itemTicketDetail = this.ticketService.input;
      this.ticketService.itemTicketDetail.experienceId = this.ticketService.input.expId;
      this.ticketService.input = "";
      this.ticketService.backPage = 'hometicket';
      this.navCtrl.navigateForward('/ticketdetail');
    } else {
      this.ticketService.itemSearchDestination = this.ticketService.input;
      this.ticketService.searchType = 1;
      this.ticketService.regionFilters = [];
      this.ticketService.regionFilters.push(this.ticketService.itemSearchDestination.id);
      this.ticketService.itemShowList = null;
      this.navCtrl.navigateForward('/ticketlist/2');
    }
  }
}
funcHotExperience(item){
  this.ticketService.input = item;
  this.ticketService.publicSearchTicketRegion(item);
  this.gf.createListLastSearchTicketRegion(item,1);
  // this.ticketService.itemSearchTicket.emit(1);
  this.ticketService.inputText = "";
  this.gotoListSearch();
  // this.navCtrl.pop();
}
onEnter(){
  this.ticketService.input = "";
  this.ticketService.isFilter = false;
  this.ticketService.itemShowList = "";
  this.ticketService.itemTicketTopic = "";
  this.ticketService.searchType = 1 ;
  this.gotoListSearch();
  // this.navCtrl.navigateForward('/ticketlist/2');
}
}