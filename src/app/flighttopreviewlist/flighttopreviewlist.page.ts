import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { GlobalFunction } from '../providers/globalfunction';
import { Storage } from '@ionic/storage';
import { ValueGlobal, SearchHotel } from '../providers/book-service';
import {flightService} from '../providers/flightService';
import { tourService } from '../providers/tourService';
import { C } from '../providers/constants';
import * as moment from 'moment';
import { HotelreviewsimagePage } from '../hotelreviewsimage/hotelreviewsimage';

var document:any;
@Component({
  selector: 'app-flighttopreviewlist',
  templateUrl: './flighttopreviewlist.page.html',
  styleUrls: ['./flighttopreviewlist.page.scss'],
})

export class FlightTopReviewListPage implements OnInit {
  currentVersion: string;
  avgPoint: any;
  numOfReview: any;
  listflighttopreview: any=[];
  page: any=1;
  pageSize: any=102;
  numOfReviewRemain: number;
  listImages:any=[];
  
    constructor(private navCtrl: NavController, public gf: GlobalFunction,
        public storage: Storage,
        public valueGlobal: ValueGlobal,
        public _flightService: flightService,
        public tourService: tourService,
        public searchHotel: SearchHotel,
        private modalCtrl: ModalController) { 
         this.loadDataFlightTopReviews();
              this.loadImageTopReviews();
        }

        ionViewWillEnter(){
          this._flightService.typeFlightUsefulShow = 2;
        }

        ngOnInit(){
            var se = this;
        }

        close(){
          this._flightService.itemReview='';
          this._flightService.typeFlightUsefulShow = 1;
            this.navCtrl.back();
        }
        executeLoadData(data){
          if(data && data.reviews){
              data.reviews.forEach(element => {
                element.reviewDateDisplay = moment(element.reviewDate).format("DD/MM/YYYY");
                if(element.replyDate){
                  element.replyDateDisplay = moment(element.replyDate).format("DD/MM/YYYY");
                }
                
                if(element.replyMessage){
                  element.replyMessage = element.replyMessage.replace(/\r\n/g, "<br/>");
                }
              });

            this.valueGlobal.flightAvgPoint = data.avgPoint.toFixed(1).replace(/\./g,',');
            this.avgPoint = data.avgPoint.toFixed(1).replace(/\./g,',');
            this.numOfReview = this.gf.convertNumberToString(data.total);
            if(this.listflighttopreview && this.listflighttopreview.length ==0){
              this.listflighttopreview = data.reviews;
            }else{
              this.listflighttopreview = [...this.listflighttopreview,...data.reviews];
            }

            this.numOfReviewRemain = this.numOfReview - this.listflighttopreview.length;
            if(this._flightService.itemReview){
              setTimeout(()=>{
                (window.document.getElementById(this._flightService.itemReview.reviewId) as any).scrollIntoView({  block: 'center', behavior: 'smooth' });
              },300)
            }
            this.gf.hideLoading();
          }
        }

        loadDataFlightTopReviews(){
          if(this._flightService.listTopReviews){
            let data = this._flightService.listTopReviews;
            this.page  = this._flightService.listTopReviews.reviews.length/102 || 1;
            this.executeLoadData(data);
          }else{
            let url = C.urls.baseUrl.urlFlight + `gate/apiv1/GetReviewFlights?pageIndex=${this.page}&pageSize=${this.pageSize}&nocache=true`;
            this.gf.RequestApi("GET", url, {
                "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                'Content-Type': 'application/json; charset=utf-8'
                }, {}, "homeflight", "GetSlideHome").then((data) =>{
                  this.executeLoadData(data);
                })
          }
      }

      loadImageTopReviews(){
        let url = C.urls.baseUrl.urlFlight + `gate/apiv1/GetReviewFlights?pageIndex=1&pageSize=1000`;
        this.gf.RequestApi("GET", url, {
            "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
            'Content-Type': 'application/json; charset=utf-8'
            }, {}, "homeflight", "GetSlideHome").then((data) =>{
              if(data && data.reviews && data.reviews.length >0){
                  let _images = data.reviews.map(r => 
                    { 
                      let arr = [];
                  
                      return r.images && r.images.length >0 ? r.images : [];
                    }
                    )

                if(_images && _images.length >0){
                  this.listImages = Array.prototype.concat.apply([], _images);
                }
                
               //console.log(this.listImages);
              }
            })
    }

    loadMoreDataFlightTopReviews(){
      let url = C.urls.baseUrl.urlFlight + `gate/apiv1/GetReviewFlights?pageIndex=${this.page}&pageSize=${this.pageSize}&nocache=true`;
            this.gf.RequestApi("GET", url, {
                "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                'Content-Type': 'application/json; charset=utf-8'
                }, {}, "homeflight", "GetSlideHome").then((data) =>{
                  this.executeLoadData(data);
                })
    }
      showMoreReview(){
        this.page +=1;
        this.gf.showLoading();
        this.loadMoreDataFlightTopReviews();
      }

      async imgreview(arrimgreview, indeximgreview,CustomerName,DateStayed,type) {
        //if(arrimgreview && arrimgreview.length >4){
          this.searchHotel.arrimgreview = arrimgreview;
          this.searchHotel.indexreviewimg = indeximgreview;
          this.searchHotel.openFromTopReviewList = true;
          if(type==1){
            this.searchHotel.reviewName = CustomerName;
            this.searchHotel.cusnamereview = '';
            this.searchHotel.datereview = '';
          }else {
            this.searchHotel.cusnamereview = CustomerName;
            this.searchHotel.datereview = DateStayed;
            this.searchHotel.reviewName = '';
          }
          const modal: HTMLIonModalElement =
            await this.modalCtrl.create({
              component: HotelreviewsimagePage,
            });
          modal.present();
        //}
       
      }
        
}