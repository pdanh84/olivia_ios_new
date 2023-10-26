import { AuthService } from './../providers/auth-service';
import { SearchHotel, ValueGlobal } from './../providers/book-service';
import { Component, NgZone,OnInit } from '@angular/core';
import { NavController,Platform } from '@ionic/angular';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
/**
 * Generated class for the SearchHotelFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-search-hotel-filter-again',
  templateUrl: 'search-hotel-filter-again.html',
  styleUrls: ['search-hotel-filter-again.scss'],
})
export class SearchHotelFilterAgainPage implements OnInit{
  ngOnInit() {
  }
  structure: any = { lower: 100000, upper: 15000000 }; review; minprice; maxprice;
  star_1 = true; star_1active = false; star_2 = true; star_2active = false; star_3 = true; star_3active = false;
  star_4 = true; star_4active = false; star_5 = true; star_5active = false;chuoi= "";ischeckAL=false;
  constructor(public platform: Platform,public navCtrl: NavController, public zone: NgZone, public searchhotel: SearchHotel, public authService: AuthService, 
    public gf: GlobalFunction,
    public valueGlobal: ValueGlobal) {
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
    this.ischeckAL=this.searchhotel.ischeckAL;
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

  }
  Cancel() {
      // Reset giá
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
      this.ischeckAL=false;
      this.searchhotel.hasSortHotelList ="";
  }
  Ok() {
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

    //Build chuỗi filter
    if (!this.searchhotel.chuoi) {
      if (this.searchhotel.star) {
        for (let i = 0; i < this.searchhotel.star.length; i++) {
          if (i == 0) {
            if (i == this.searchhotel.star.length - 1) {
              this.chuoi = "* " + this.searchhotel.star[i];
            } else {
              this.chuoi = "* " + this.searchhotel.star[i] + ",";
            }

          }
          else if (i != 0) {
            if (i != this.searchhotel.star.length - 1) {
              this.chuoi = this.chuoi + this.searchhotel.star[i] + ",";
            } else {
              this.chuoi = this.chuoi + this.searchhotel.star[i];
            }
          }
        }
      }
      if (this.searchhotel.minprice) {
        if (this.chuoi) {
          this.chuoi = this.chuoi + " | " + "đ " + this.searchhotel.minprice.toLocaleString() + "-" + " " + this.searchhotel.maxprice.toLocaleString();
        } else {
          this.chuoi = "đ " + this.searchhotel.minprice.toLocaleString() + "-" + " " + this.searchhotel.maxprice.toLocaleString();
        }
      }
      if (this.searchhotel.review > 0) {
        if (this.chuoi) {
          this.chuoi = this.chuoi + " | " + "Nhận xét " + this.searchhotel.review + "+";
        } else {
          this.chuoi = "Nhận xét " + this.searchhotel.review + "+";
        }
      }
      else {
        this.chuoi = this.chuoi;
      }
    }
    else {
      this.chuoi = this.searchhotel.chuoi;
    }

    if(this.chuoi){
      this.searchhotel.chuoi = this.chuoi;
    }
    this.searchhotel.ischeckAL=this.ischeckAL;
    this.searchhotel.hasSortHotelList = this.searchhotel.minprice || this.searchhotel.maxprice || this.searchhotel.chuoi || this.searchhotel.location ||this.searchhotel.facsearch || this.searchhotel.tagIds || this.searchhotel.classIds || this.searchhotel.tagIds || this.searchhotel.ischeckAL; 
    if (this.searchhotel.gbmsg && this.searchhotel.gbmsg.Type == 1) {
      var id1 = { id: this.searchhotel.gbmsg.HotelId };
      this.valueGlobal.notRefreshDetail = false;
      //this.navCtrl.navigateForward('/hoteldetail/'+this.searchhotel.gbmsg.HotelId);
      this.navCtrl.navigateForward('/hoteldetail/'+this.searchhotel.gbmsg.HotelId);
    } else {
      this.authService.region = this.searchhotel.gbmsg.regionName;
      this.authService.regionid = this.searchhotel.gbmsg.regionId;
      this.authService.regioncode = this.searchhotel.gbmsg.regionCode;
      var id2 = {filteragain: true};
      //this.navCtrl.push('HotelListPage',id2);
      //this.navCtrl.navigateForward('/hotellist/true/0');
      //this.navCtrl.navigateBack(['/app/tabs/hotellist/true']);
      this.navCtrl.navigateBack('/hotellist/true');
      //google analytic
      this.gf.googleAnalytion('searchagain','Search',this.chuoi+'|'+ this.searchhotel.gbmsg.regionCode);
    }

    //this.navCtrl.push("MainPage");
  }
  ionViewDidLoad() {
    let elements = window.document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'none';
      });
    }
  }
}
