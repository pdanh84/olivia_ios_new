import { Component, OnInit, NgZone } from '@angular/core';
import { SearchHotel, ValueGlobal } from '../providers/book-service';
import { GlobalFunction } from '../providers/globalfunction';
import { NavController } from '@ionic/angular';
import { NetworkProvider } from '../network-provider.service';
import { C } from './../providers/constants';

import * as moment from 'moment';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-hoteltopdeal',
  templateUrl: './hoteltopdeal.page.html',
  styleUrls: ['./hoteltopdeal.page.scss'],
})
export class HotelTopDealPage implements OnInit {
  page =1;
  pagesize=5;
  totalItem=200;
  memberid: any;
  slideData: any = [];
  showloadmore: boolean = true;

  slideData1: any =[];
  sl: any;
  _infiniteScroll: any;
  myloader: any;
  ischeck: boolean = false;

  constructor(public searchhotel: SearchHotel, 
    public valueGlobal: ValueGlobal, 
    public gf: GlobalFunction,
    private storage: Storage,
    public networkProvider: NetworkProvider,
    public zone: NgZone,
    public navCtrl: NavController) { 
      var se = this
      se.storage.get('jti').then((uid: any) => {
        se.memberid = uid;
      })
      
      se.getHoteldeal();
  }

  ngOnInit() {

  }

  getHoteldeal() {
    var se = this;
    // var options = {
    //   method: 'POST',
    //   url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/TopDeals?pageIndex=' + se.page + '&pageSize=' + se.totalItem + (se.memberid ? '&memberid=' + se.memberid : ''),
    //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
    //   headers:
    //   {

    //     apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
    //     apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    //   }
    // };
    let urlPath = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/TopDeals?pageIndex=' + se.page + '&pageSize=' + se.totalItem + (se.memberid ? '&memberid=' + se.memberid : '');
        let headers = {
          apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
          apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
        };
        this.gf.RequestApi('POST', urlPath, headers, {}, 'hoteltopdeal', 'getHoteldeal').then((data)=>{

      se.slideData = data;
      if (se.slideData && se.slideData.length > 0) {
        se.storage.set('listtopdealdefault', se.slideData);
      }
      se.totalItem = se.slideData.length;
      se.showloadmore = se.slideData.length == se.totalItem ? false : true;
      var chuoi = "";
      se.zone.run(() => {
        for (let i = 0; i < se.pagesize; i++) {
          if (se.slideData && se.slideData[i].images[0]) {
            var res = se.slideData[i].images[0].url.substring(0, 4);
            if (res != "http") {
              se.slideData[i].images[0].url = 'https:' + se.slideData[i].images[0].url;
            }
            var minPrice = se.slideData[i].minPrice.toLocaleString();
            chuoi = "";
            var name = se.slideData[i].name.split('|');
            for (let x = 1; x < name.length; x++) {
              if (x == name.length - 1) {
                chuoi = chuoi + name[x];
              } else {
                chuoi = chuoi + name[x] + "|";
              }
            }
            switch (se.slideData[i].rating) {
              case 50:
                se.slideData[i].rating = "./assets/star/ic_star_5.svg";
                break;
              case 45:
                se.slideData[i].rating = "./assets/star/ic_star_4.5.svg";
                break;
              case 40:
                se.slideData[i].rating = "./assets/star/ic_star_4.svg";
                break;
              case 35:
                se.slideData[i].rating = "./assets/star/ic_star_3.5.svg";
                break;
              case 30:
                se.slideData[i].rating = "./assets/star/ic_star_3.svg";
                break;
              case 25:
                se.slideData[i].rating = "./assets/star/ic_star_2.5.svg";
                break;
              case 20:
                se.slideData[i].rating = "./assets/star/ic_star_2.svg";
                break;
              case 15:
                se.slideData[i].rating = "./assets/star/ic_star_1.5.svg";
                break;
              case 10:
                se.slideData[i].rating = "./assets/star/ic_star.svg";
                break;
              case 5:
                se.slideData[i].rating = "./assets/star/ic_star_0.5.svg";
                break;
              default:
                break;
            }
            var item = { ischecked: 0, id: se.slideData[i].id, name: name[0], imageUrl: se.slideData[i].images[0].url, regionName: se.slideData[i].regionName, minPrice: minPrice, description: chuoi, rating: se.slideData[i].rating, priceshow: (se.slideData[i].minPrice / 1000).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(',', '.') };
            se.slideData1.push(item);
          }

        }

        se.sl = se.slideData1.length;
        se.ischeck = true;

        if (se.myloader) {
          se.myloader.dismiss();
        }
        if (se._infiniteScroll) {
          se._infiniteScroll.target.complete();
        }

        //se.getRegions();
        //se.getRegionsInternational();
      })
    });
  }

  /**
   * Hàm load paging topdeal
   */
  getHotelDealPaging() {
    var se = this;
    se.showloadmore = se.slideData1.length == se.slideData.length ? false : true;
    let start = se.slideData1.length;
    var chuoi = "";
    se.zone.run(() => {
      for (let i = start; i < start + se.pagesize; i++) {
        if (se.slideData[i] && se.slideData[i].images[0]) {
          var res = se.slideData[i].images[0].url.substring(0, 4);
          if (res != "http") {
            se.slideData[i].images[0].url = 'https:' + se.slideData[i].images[0].url;
          }

          var minPrice = se.slideData[i].minPrice ? se.slideData[i].minPrice.toLocaleString() : '';
          chuoi = "";
          var name = se.slideData[i].name.split('|');
          for (let x = 1; x < name.length; x++) {
            if (x == name.length - 1) {
              chuoi = chuoi + name[x];
            } else {
              chuoi = chuoi + name[x] + "|";
            }
          }
          switch (se.slideData[i].rating) {
            case 50:
              se.slideData[i].rating = "./assets/star/ic_star_5.svg";
              break;
            case 45:
              se.slideData[i].rating = "./assets/star/ic_star_4.5.svg";
              break;
            case 40:
              se.slideData[i].rating = "./assets/star/ic_star_4.svg";
              break;
            case 35:
              se.slideData[i].rating = "./assets/star/ic_star_3.5.svg";
              break;
            case 30:
              se.slideData[i].rating = "./assets/star/ic_star_3.svg";
              break;
            case 25:
              se.slideData[i].rating = "./assets/star/ic_star_2.5.svg";
              break;
            case 20:
              se.slideData[i].rating = "./assets/star/ic_star_2.svg";
              break;
            case 15:
              se.slideData[i].rating = "./assets/star/ic_star_1.5.svg";
              break;
            case 10:
              se.slideData[i].rating = "./assets/star/ic_star.svg";
              break;
            case 5:
              se.slideData[i].rating = "./assets/star/ic_star_0.5.svg";
              break;
            default:
              break;
          }
          var item = { ischecked: 0, id: se.slideData[i].id, name: name[0], imageUrl: se.slideData[i].images[0].url, regionName: se.slideData[i].regionName, minPrice: minPrice, description: chuoi, rating: se.slideData[i].rating, priceshow: (se.slideData[i].minPrice / 1000).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(',', '.') };
          se.slideData1.push(item);
        }

      }
      se.sl = se.slideData1.length;
      se.ischeck = true;
      setTimeout(() => {
        if (se.myloader) {
          se.myloader.dismiss();
        }
      }, 500)
    })
  }

  /**
   * Sự kiện loadmore khi scroll topdeal
   * @param event biến event
   */
  onScroll(event: any) {
    let scrolled = 0;
    let el: any = window.document.getElementsByClassName('slide2-scroll');
    if (el.length > 0) {
      scrolled = Math.round(el[0].scrollWidth - el[0].scrollLeft);
    }
    if (scrolled == el[0].offsetWidth || scrolled + 1 == el[0].offsetWidth) {
      setTimeout(() => {
        this.doInfinite();
      }, 300)
    }

  }

   /**
   * Hàm gọi loadpaging topdeal
   */
  doInfinite() {
    this.zone.run(() => {
      if (this.ischeck == true) {
        this.page = this.page + 1;
        this.getHotelDealPaging();
      }
    })
  }
  seemoredeal() {
    this.valueGlobal.backValue = 'topdeallist';
    this.navCtrl.navigateForward('/topdeallist');
  }
  itemclickht(item) {
    this.searchhotel.hotelID = item.id;
    this.searchhotel.rootPage = "topdeal";
    //this.navCtrl.navigateForward('/hoteldetail/'+item.id);
    this.valueGlobal.logingoback='/hoteldetail/' + item.id;
    this.valueGlobal.notRefreshDetail = false;
    this.navCtrl.navigateForward(['/hoteldetail/' + item.id]);
    //google analytic
  }
}
