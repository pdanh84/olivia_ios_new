import { Component, OnInit, ViewChild, HostListener, NgZone, Input } from '@angular/core';
import { NavController, ModalController, ToastController, ActionSheetController,  Platform } from '@ionic/angular';
import { GlobalFunction } from '../../../providers/globalfunction';
import * as $ from 'jquery';
import { C } from '../../../providers/constants';
import { OverlayEventDetail } from '@ionic/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

import { SearchHotel } from 'src/app/providers/book-service';
import { ticketService } from 'src/app/providers/ticketService';
import { NetworkProvider } from 'src/app/network-provider.service';

@Component({
  selector: 'app-hometicketslide',
  templateUrl: './hometicketslide.page.html',
  styleUrls: ['./hometicketslide.page.scss'],
})
export class HomeTicketSlidePage implements OnInit {
  @Input() type:any;
  slideData:any = [];
  slidePopular : any = [];
  slidePopularVN: any = [];
  arrsk=[1,2,3,4,5,6];
  pageSize=10;
  loadslidedatadone: boolean;
  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private zone: NgZone,
    public storage: Storage,
    private actionsheetCtrl: ActionSheetController,
    private platform: Platform,
    public searchhotel: SearchHotel,
    public ticketService: ticketService,
    public networkProvider: NetworkProvider) {
      this.loadData();      
      this.platform.resume.subscribe(async()=>{
        if (this.networkProvider.isOnline()) {
          
          this.gf.setNetworkStatus(true);
          this.loadData();
        } else {
          
          this.gf.setNetworkStatus(false);
          this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
        }
      })
  }

  ngOnInit(){
    this.ticketService.itemTicketTopic='';
  }

  loadData(){
    if(!this.ticketService.dataAllExperiences || this.ticketService.dataAllExperiences.length ==0){
      this.getAllExperiences();
    }else{
      this.loadDataAllExperiences(false);
    }
    if(!this.ticketService.dataPopularLocationVN || this.ticketService.dataPopularLocationVN.length ==0){
      this.getPopularLocationVN();
    }else{
      this.loadDataPopularLocationVN();
    }

    if(!this.ticketService.dataPopularLocation || this.ticketService.dataPopularLocation.length ==0){
      this.getPopularLocation();
    }else{
      this.loadDataPopularLocation();
    }
  }

  loadDataAllExperiences(isfirstload){
    let se = this;
      se.slideData = se.ticketService.dataAllExperiences;
      if(isfirstload){
        for (let index = 0; index < se.slideData.length; index++) {
          se.slideData[index].pageIndex = 1;
          se.slideData[index].totalPage = Math.ceil(se.slideData[index].experienceHomeModels.length/10);
          se.slideData[index].experienceHomeModelsDisplay = [];
          for (let j = 0; j < se.slideData[index].experienceHomeModels.length; j++) {
            const elementVVC = se.slideData[index].experienceHomeModels[j];
            if(elementVVC.avgPoint && elementVVC.avgPoint.toString().indexOf('.0') == -1 && (elementVVC.avgPoint == 10  || elementVVC.avgPoint == 6  || elementVVC.avgPoint == 9  || elementVVC.avgPoint == 8  || elementVVC.avgPoint == 7)){
              elementVVC.avgPoint = elementVVC.avgPoint + ".0";
            }
            if(elementVVC.avatarLink && elementVVC.avatarLink.indexOf('cdn') != -1 && elementVVC.avatarLink.indexOf('360x240') ==-1 && elementVVC.avatarLink.indexOf('.webp') != -1){
              elementVVC.avatarLink = elementVVC.avatarLink.replace('.webp', '-360x240.webp');
            }
            if(j <10){
              se.slideData[index].experienceHomeModelsDisplay.push(elementVVC);
            }
           
          }
          if(se.slideData[0].experienceHomeModelsDisplay && se.slideData[0].experienceHomeModelsDisplay.length >=10){
            se.loadslidedatadone = true;
          }
          
        }
      }else{
        se.loadslidedatadone = true;
      }
      
      
      
  }

  getAllExperiences() {
    let se = this;
    let url = C.urls.baseUrl.urlTicket+'/api/Home/GetAllExperiences';
    let headers = {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    se.gf.RequestApi('GET', url, headers, null, 'hometicketslide', 'getAllExperiences').then((data) => {
      let res = data;
      se.ticketService.dataAllExperiences = res.data;
      se.loadDataAllExperiences(true);
    })
  }

  sortTourOrder(listsort, columnName) : Promise<any> {
    return new Promise((resolve, reject) => {
      let se = this;
      if (listsort && listsort.length > 0) {
        se.zone.run(() => listsort.sort(function (a, b) {
          return a[columnName] < b[columnName] ? -1 : 1;
        }));

        resolve(true);
      }
    })
  }

  loadDataPopularLocationVN(){
    let se = this;
    se.slidePopularVN = se.ticketService.dataPopularLocationVN;

    if(se.slidePopularVN.vertical && se.slidePopularVN.vertical.avatarLink.indexOf('http') == -1){
        se.slidePopularVN.vertical[0].avatarLink = 'https:'+se.slidePopularVN.vertical[0].avatarLink;
    }

    se.slidePopularVN.horizontals.forEach(slide => {
      if(slide.avatarLink && slide.avatarLink.indexOf('http') == -1){
        slide.avatarLink = 'https:'+slide.avatarLink;
      }
    });
  }

  getPopularLocationVN() {
    let se = this;
    let url = C.urls.baseUrl.urlTicket+'/api/Home/GetRecommendDestination?position=2&vertical=4';
    let headers = {
      // apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      // apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    se.gf.RequestApi('GET', url, headers, null, 'hometicketitemslide', 'GetRecommendDestination').then((data) => {
      let res = data;
      se.ticketService.dataPopularLocationVN = res.data;
      se.loadDataPopularLocationVN();
    })
  }

  loadDataPopularLocation(){
    let se = this;
    se.slidePopular = se.ticketService.dataPopularLocation;

    if(se.slidePopular.vertical && se.slidePopular.vertical.avatarLink.indexOf('http') == -1){
        se.slidePopular.vertical[0].avatarLink = 'https:'+se.slidePopular.vertical[0].avatarLink;
    }

    se.slidePopular.horizontals.forEach(slide => {
      if(slide.avatarLink && slide.avatarLink.indexOf('http') == -1){
        slide.avatarLink = 'https:'+slide.avatarLink;
      }
    });
  }
  getPopularLocation() {
    let se = this;
    let url = C.urls.baseUrl.urlTicket+'/api/Home/GetRecommendDestination?position=3&vertical=3';
    let headers = {
      // apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      // apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    se.gf.RequestApi('GET', url, headers, null, 'hometicketitemslide', 'GetRecommendDestination').then((data) => {
      let res = data;
      se.ticketService.dataPopularLocation = res.data;
      se.loadDataPopularLocation();
    })
  }
  /**
   * Sự kiện loadmore khi scroll topdeal
   * @param event biến event
   */
   onScroll(event: any, _index) {
    let scrolled = 0;
    let el: any = document.getElementsByClassName('item-ticketslide-scroll-'+_index);
    if (el.length > 0) {
      scrolled = Math.round(el[0].scrollWidth - el[0].scrollLeft);
    }
    if (scrolled == el[0].offsetWidth || scrolled + 1 == el[0].offsetWidth) {
      setTimeout(() => {
        console.log(_index)
        this.doInfinite(_index);
      }, 500)
    }

  }
  doInfinite(_index) {
    if(this.slideData && this.slideData[_index] && this.slideData[_index].pageIndex < this.slideData[_index].totalPage){
      this.slideData[_index].pageIndex +=1;
      let idxCount = this.pageSize*(this.slideData[_index].pageIndex -1);
      for (let index = idxCount; index < this.pageSize * this.slideData[_index].pageIndex; index++) {
        const element = this.slideData[_index].experienceHomeModels[index];
        if(element && element.experienceId && !this.gf.checkExistsItemInArray(this.slideData[_index].experienceHomeModelsDisplay, element, 'ticketslide')){
          this.slideData[_index].experienceHomeModelsDisplay.push(element);
        }
      }
      
    }
  }

  showDetail(item){
    var se= this;
    se.ticketService.itemTicketDetail = item;
    se.ticketService.backPage = 'hometicket';
    se.navCtrl.navigateForward('/ticketdetail');
  }

  showTicketList(item){
    if(item){
      this.ticketService.itemTicketTopic = item;
      this.ticketService.searchType = 3;
      this.ticketService.isFilter = false;
      this.ticketService.typeFilters = [];
      this.ticketService.regionFilters = [];
      this.ticketService.topicfilters = [];
      this.ticketService.topicfilters.push(item.topicId);
      this.ticketService.inputText = "";
      this.ticketService.itemSearchTicket.emit(0);
      this.navCtrl.navigateForward('/ticketlist/0');
    }
  }
  showRegionList(item,stt?){
    if(item){
      this.ticketService.itemTicketTopic = "";
      this.ticketService.itemShowList = item;
      this.ticketService.searchType = 2;
      this.ticketService.isFilter = false;
      this.ticketService.typeFilters = [];
      this.ticketService.regionFilters = [];
      this.ticketService.topicfilters = [];
      this.ticketService.inputText = "";
      if (stt==1) {
        this.getdata();
      }else{
        this.ticketService.regionFilters.push(item.id);
        this.navCtrl.navigateForward('/ticketlist/1');
      }
    }
  }
  getdata() {
    let url = C.urls.baseUrl.urlTicket + '/api/Category/GetInitsearchModel';
    this.gf.RequestApi('GET', url, null, null, 'hometicketslide', 'GetInitsearchModel').then((data) => {
      let res = data;
      var objregion = res.data.regions.filter(item => item.id === this.ticketService.itemShowList.id);
      this.ticketService.regionFilters = [];
      objregion[0].childs.forEach(element => {
        this.ticketService.regionFilters.push(element.id);
      });
      this.navCtrl.navigateForward('/ticketlist/1');
    })
  }
}
