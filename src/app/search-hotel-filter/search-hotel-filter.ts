import { SearchHotel } from './../providers/book-service';
import { Component, NgZone ,OnInit} from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';

/**
 * Generated class for the SearchHotelFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-search-hotel-filter',
  templateUrl: 'search-hotel-filter.html',
  styleUrls: ['search-hotel-filter.scss'],
})

export class SearchHotelFilterPage implements OnInit{
  ngOnInit() {
  }
  structure: any = { lower: 100000, upper: 15000000 }; review; minprice; maxprice;
  star_1 = true; star_1active = false; star_2 = true; star_2active = false; star_3 = true; star_3active = false;
  star_4 = true; star_4active = false; star_5 = true; star_5active = false;  public ischeckbtnreset = false;
  public ischeckbtn = true;
  constructor(public platform: Platform,public navCtrl: NavController, public zone: NgZone, public searchhotel: SearchHotel,
    public gf: GlobalFunction) {
    if (searchhotel.minprice && this.searchhotel.maxprice) {
      //PDANH 09/01/2018: Fix lỗi không lấy được minprice,maxprice do lỗi định dạng thập phân ','
      this.structure.lower = searchhotel.minprice.replace(/\./g, '').replace(/\,/g, '');
      this.structure.upper = searchhotel.maxprice.replace(/\./g, '').replace(/\,/g, '');
      this.minprice = searchhotel.minprice;
      this.maxprice = searchhotel.maxprice; 
    }
    else {
      this.minprice = this.structure.lower.toLocaleString();
      this.maxprice = this.structure.upper.toLocaleString()
    }

    if (searchhotel.review) {
      this.review = searchhotel.review
    }
    if (searchhotel.star) {
      for (let i = 0; i < searchhotel.star.length; i++) {
        if (searchhotel.star[i] == 1) {
          this.star_1active = true;
          this.star_1 = false;
        }
        else if (searchhotel.star[i] == 2) {
          this.star_2active = true;
          this.star_2 = false;
        }
        else if (searchhotel.star[i] == 3) {
          this.star_3active = true;
          this.star_3 = false;
        }
        else if (searchhotel.star[i] == 4) {
          this.star_4active = true;
          this.star_4 = false;
        }
        else if (searchhotel.star[i] == 5) {
          this.star_5active = true;
          this.star_5 = false;
        }
      }
    }
    
    //google analytic
    gf.googleAnalytion('search-hotel-filter','load','');
  }

  close() {
    this.navCtrl.back();
  }
  test() {
    this.minprice = this.structure.lower.toLocaleString()
    this.maxprice = this.structure.upper.toLocaleString()

  }
  star1() {
    if (this.star_1 == true) {
      this.star_1 = false;
      this.star_1active = true;
    }
    else {
      this.star_1 = true;
      this.star_1active = false;
    }
  }
  star2() {
    if (this.star_2 == true) {
      this.star_2 = false;
      this.star_2active = true;
    }
    else {
      this.star_2 = true;
      this.star_2active = false;
    }
  }
  star3() {
    if (this.star_3 == true) {
      this.star_3 = false;
      this.star_3active = true;
    }
    else {
      this.star_3 = true;
      this.star_3active = false;
    }
  }
  star4() {
    if (this.star_4 == true) {
      this.star_4 = false;
      this.star_4active = true;
    }
    else {
      this.star_4 = true;
      this.star_4active = false;
    }
  }
  star5() {
    if (this.star_5 == true) {
      this.star_5 = false;
      this.star_5active = true;
    }
    else {
      this.star_5 = true;
      this.star_5active = false;
    }
  }
  reviewchange() {
    if (this.review==0) {
      this.review="0";
    }
  }
  clickCancel() {
      // Reset giá
      this.ischeckbtnreset=true;
      this.ischeckbtn=false;
      this.structure = { lower: 100000, upper: 15000000 };
      // Reset *
      this.star_1=true;
      this.star_2=true;
      this.star_3=true;
      this.star_4=true;
      this.star_5=true;
      this.star_1active=false;
      this.star_2active=false;
      this.star_3active=false;
      this.star_4active=false;
      this.star_5active=false;
      // Reset review
      this.review=0;
  }
  clickOk() {
    this.ischeckbtnreset=false;
    this.ischeckbtn=true;
    this.searchhotel.chuoi = "";
    this.searchhotel.star = [];
    if (this.star_1active == true) {
      this.searchhotel.star.push(1);
    }
    if (this.star_2active == true) {
      this.searchhotel.star.push(2);
    }
    if (this.star_3active == true) {
      this.searchhotel.star.push(3);
    }
    if (this.star_4active == true) {
      this.searchhotel.star.push(4);
    }
    if (this.star_5active == true) {
      this.searchhotel.star.push(5);
    }
    //PDANH 09/01/2018: Fix lỗi không lấy được minprice,maxprice do lỗi định dạng thập phân ','
    var minprice1 = this.minprice.replace(/\./g, '').replace(/\,/g, '');
    var maxprice1 = this.maxprice.replace(/\./g, '').replace(/\,/g, '');
    if (minprice1*1 > 100000 || maxprice1*1 < 15000000) {
      this.searchhotel.minprice = this.minprice;
      this.searchhotel.maxprice = this.maxprice;
    }else{//Nếu chọn = biên thì reset lại minprice = null
      this.searchhotel.minprice = '';
      this.searchhotel.maxprice = '';
    }
    if (this.review >= 0) {
      this.searchhotel.review = this.review;
    }
    //this.navCtrl.push("MainPage");
    //this.app.getActiveNav().push('MainPage');
    this.navCtrl.navigateBack('/');
    //google analytic
    //Build chuỗi filter
    var chuoi ="";
    if (!this.searchhotel.chuoi) {
      if (this.searchhotel.star) {
        for (let i = 0; i < this.searchhotel.star.length; i++) {
          if (i == 0) {
            if (i == this.searchhotel.star.length - 1) {
              chuoi = "* " + this.searchhotel.star[i];
            } else {
              chuoi = "* " + this.searchhotel.star[i] + ",";
            }

          }
          else if (i != 0) {
            if (i != this.searchhotel.star.length - 1) {
              chuoi = chuoi + this.searchhotel.star[i] + ",";
            } else {
              chuoi = chuoi + this.searchhotel.star[i];
            }
          }
        }
      }
      if (this.searchhotel.minprice) {
        if (chuoi) {
          chuoi = chuoi + " | " + "đ " + this.searchhotel.minprice.toLocaleString() + "-" + " " + this.searchhotel.maxprice.toLocaleString();
        } else {
          chuoi = "đ " + this.searchhotel.minprice.toLocaleString() + "-" + " " + this.searchhotel.maxprice.toLocaleString();
        }
      }
      if (this.searchhotel.review > 0) {
        if (chuoi) {
          chuoi = chuoi + " | " + "Nhận xét " + this.searchhotel.review + "+";
        } else {
          chuoi = "Nhận xét " + this.searchhotel.review + "+";
        }
      }
      else {
        chuoi = chuoi;
      }

    }
      this.gf.googleAnalytion('hotelfilter','Search',chuoi);
  }
  ionViewDidEnter() {
    // ion-select customizing
    const ionSelects:any = window.document.querySelectorAll('ion-range');
    ionSelects.forEach((ionSelect) => {
      const selectIconInnermin = ionSelect.shadowRoot.querySelectorAll('.range-knob-min');
      if(selectIconInnermin && selectIconInnermin.length >0){
        selectIconInnermin[0].setAttribute('style','padding: 6px; margin-left: -24px; margin-top: -6px;left:0%');
      }
      const selectIconInnermax = ionSelect.shadowRoot.querySelectorAll('.range-knob-max');
      if(selectIconInnermax && selectIconInnermax.length >0){
        selectIconInnermax[0].setAttribute('style','padding: 6px; margin-left: -24px; margin-top: -6px;left:100%');
      }
      // selectIconInner.forEach(element => {
      //   element.setAttribute('style','padding: 6px; margin-left: -24px; margin-top: -6px;');
      // });
      // if(selectIconInner){
      //   selectIconInner.attributes.removeNamedItem("class");
      //   img = window.document.createElement("img");
      //   img.src = "./new-arrow-down-image.svg";
      //   img.style.width = "12px";
      //   img.style.paddingTop = "3px";
      //   img.style.paddingLeft = "4px";
      //   img.style.color = "black";
      //   img.style.opacity = "0.5";
      //   selectIconInner.appendChild(img);
      // }
    });
}
}
