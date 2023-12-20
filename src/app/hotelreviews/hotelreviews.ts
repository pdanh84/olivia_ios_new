import { Component, OnInit, NgZone } from '@angular/core';
import { Platform, NavController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';

import { ActivatedRoute } from '@angular/router';
import { HotelreviewsimagePage } from './../hotelreviewsimage/hotelreviewsimage';
import { SearchHotel } from '../providers/book-service';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the HotelreviewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-hotelreviews',
  templateUrl: 'hotelreviews.html',
  styleUrls: ['hotelreviews.scss'],
})
export class HotelReviewsPage implements OnInit {

  Name;
  HotelReviews;
  HotelID;
  arrHotelReviews:any = [];
  numHotelReviews: any = 0;
  AvgPoint: any;
  countimgrv: any;
  arrimgreview: any[];
  reviewsk = [1, 2, 3, 4, 5];
  loaddatadone = false;
  fromhotel: boolean = true;
  constructor(public platform: Platform, public navCtrl: NavController, public gf: GlobalFunction, private activatedRoute: ActivatedRoute, public zone: NgZone, public searchhotel: SearchHotel, public modalCtrl: ModalController,
    private storage: Storage) {
    this.HotelID = this.activatedRoute.snapshot.paramMap.get('id');
    this.Name = this.activatedRoute.snapshot.paramMap.get('name');
    //Load all image reviews
    this.HotelID = this.activatedRoute.snapshot.paramMap.get('id');
    this.Name = this.activatedRoute.snapshot.paramMap.get('name');
    //Load all image reviews
    setTimeout(() => {
      this.loaddatadone = true;
    }, 500)
    
      this.storage.get('hotelimagereviews_' + this.HotelID).then((data) => {
        if (!data) {
          this.loadHotelImageReviews();
        } else {
          this.countimgrv = data.length;
          this.pushAllImageReviews(data);
        }
      })
      this.storage.get('hoteldetail_' + this.HotelID).then((data) => {
        if (data) {
          this.zone.run(() => {
            this.Name = data.Name;
            this.HotelReviews = data.HotelReviews

            for (let index = 0; index < this.HotelReviews.length; index++) {
              if (this.HotelReviews[index].DateStayed.indexOf('-') == -1) {
                this.HotelReviews[index].DateStayed = moment(this.HotelReviews[index].DateStayed).format('DD-MM-YYYY');
              }

              // this.HotelReviews[index].ReviewPoint = Math.round(this.HotelReviews[index].ReviewPoint *100)/100;
              this.HotelReviews[index].ReviewPoint = Math.round(this.HotelReviews[index].ReviewPoint * 100) / 100
              this.arrHotelReviews.push(this.HotelReviews[index]);
            }
            this.numHotelReviews = data.NumOfReview;
            this.AvgPoint = data.AvgPoint;
            if (this.AvgPoint.toString().length == 1) {
              this.AvgPoint = this.AvgPoint + ".0";
            }
            this.sortdate();
          })
        } else {
          this.getdata();
        }
      })
    



    //Xử lý nút back của dt
    this.platform.ready().then(() => {
      this.platform.backButton.subscribe(() => {
        this.navCtrl.navigateBack('/hoteldetail/' + this.HotelID);
      })
    })
    //google analytic
    gf.googleAnalytion('hotelreviews', 'load', '');
  }

  ngOnInit() {

  }

  goback() {
    if (this.fromhotel) {
      this.navCtrl.navigateBack('/hoteldetail/' + this.HotelID);
    } else {
      this.navCtrl.back();
    }

    //this.navCtrl.navigateBack(['/app/tabs/hoteldetail/'+this.HotelID]);
  }
  getdata() {
    var se = this;
    let url = C.urls.baseUrl.urlPost + "/mhoteldetail/" + this.HotelID;
    // var options = {
    //   method: 'POST',
    //   url: url,
    //   timeout: 180000, maxAttempts: 5, retryDelay: 2000,
    // };

    let urlPath = C.urls.baseUrl.urlPost + "/mhoteldetail/" + this.HotelID;
        let headers = {};
        this.gf.RequestApi('POST', urlPath, headers, {}, 'hotelreviews', 'getdata').then((data)=>{

      if (data) {
        let jsondata = data;

        se.zone.run(() => {
          se.Name = jsondata.Name;
          se.HotelReviews = jsondata.HotelReviews

          for (let index = 0; index < se.HotelReviews.length; index++) {

            se.HotelReviews[index].DateStayed = moment(se.HotelReviews[index].DateStayed).format('DD-MM-YYYY');
            // se.HotelReviews[index].ReviewPoint = Math.round(se.HotelReviews[index].ReviewPoint *100)/100;
            se.HotelReviews[index].ReviewPoint = Math.round(se.HotelReviews[index].ReviewPoint * 100) / 100
            se.arrHotelReviews.push(se.HotelReviews[index]);
          }
          se.numHotelReviews = se.HotelReviews.length;
          se.AvgPoint = jsondata.AvgPoint;
          se.sortdate();
        })

      }
    })
  }

  /**Hàm sort list khách sạn theo giá, điểm trung bình 
     * PDANH 23/01/2018
     */
  sortdate() {
    var se = this;
    if (se.arrHotelReviews && se.arrHotelReviews.length > 0) {
      se.zone.run(() => se.arrHotelReviews.sort(function (a, b) {
        let direction = 1;
        if (moment(a['DateSort']).diff(moment(b['DateSort']), 'days') > 0) {
          return -1 * direction;
        }
        else {
          return 1 * direction;
        }
      }));
    }
  };
  async imgreview(arrimgreview, indeximgreview, CustomerName, DateStayed) {
    this.searchhotel.arrimgreview = arrimgreview;
    this.searchhotel.indexreviewimg = indeximgreview;
    this.searchhotel.cusnamereview = CustomerName;
    this.searchhotel.datereview = DateStayed;
    this.searchhotel.openFromTopReviewList = false;
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: HotelreviewsimagePage,
      });
    modal.present();
  }

  loadHotelImageReviews() {
    var se = this;
    if (this.HotelID) {
      let url = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetHotelImageReviews?hotelid=' + this.searchhotel.hotelID;
      this.gf.RequestApi('GET', url, {}, {}, 'hoteldetail', 'GetHotelImageReviews').then((data) => {
        if (data.data) {
          this.storage.set('hotelimagereviews_' + this.HotelID, data.data);
          this.pushAllImageReviews(data.data);
        }
      })
    }
  }

  pushAllImageReviews(data) {
    var se = this;
    se.arrimgreview = [];
    for (let i = 0; i < 3; i++) {
      se.arrimgreview.push(data[i]);
    }
    if (data.length > 3) {
      se.countimgrv = data.length - 3;
    }
  }

  seemoreimgrv() {
    this.navCtrl.navigateForward('/cusimgreview/0');
  }
}
