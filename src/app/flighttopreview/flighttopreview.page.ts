import { Component, NgZone } from '@angular/core';
import { NavController, } from '@ionic/angular';
import { GlobalFunction } from '../providers/globalfunction';
import { C } from '../providers/constants';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { ValueGlobal } from '../providers/book-service';
import {flightService} from '../providers/flightService';


@Component({
  selector: 'app-flighttopreview',
  templateUrl: './flighttopreview.page.html',
  styleUrls: ['./flighttopreview.page.scss'],
})
export class FlightTopReviewPage {
    listflighttopreview: any= [];
    avgPoint: any;
    numOfReview: any;
  listflighttopreviewgroup: any[];
  page=1;
    constructor(private navCtrl: NavController, public gf: GlobalFunction,
        public storage: Storage,
        public valueGlobal: ValueGlobal,
        public _flightService: flightService,
        private zone: NgZone) { 
          this.page=1;
            this.loadDataFlightTopReviews();
        }
    
        ngOnInit(){
            
        }

        loadDataFlightTopReviews(){
          let url = C.urls.baseUrl.urlFlight + `gate/apiv1/GetReviewFlights?pageIndex=${this.page}&pageSize=102&nocache=true`;
            this.gf.RequestApi("GET", url, {
                "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                'Content-Type': 'application/json; charset=utf-8'
                }, {}, "homeflight", "GetSlideHome").then((data) =>{
                  if(data && data.reviews){
                      data.reviews.forEach(element => {
                        element.reviewDateDisplay = moment(element.reviewDate).format("DD/MM/YYYY");
                        
                      });
                      if(this.page ==1){
                        this._flightService.listTopReviews = {...data};
                        if(data.avgPoint){
                          this.valueGlobal.flightAvgPoint = data.avgPoint.toFixed(1).replace(/\./g,',');
                          this.valueGlobal.flightNumOfReview = this.gf.convertNumberToString(data.total);
                          this.avgPoint = data.avgPoint.toFixed(1).replace(/\./g,',');
                        }
                        
                        this.numOfReview = this.gf.convertNumberToString(data.total);
                        this.listflighttopreviewgroup = [];
                      }else{
                        let _reviews  = [...this._flightService.listTopReviews.reviews,...data.reviews];
                        this._flightService.listTopReviews = {...data};
                        this._flightService.listTopReviews.reviews = _reviews;
                      }
                      let _datareviews = [...data.reviews];
                      for (let index = 0; index < 34; index++) {
                        this.listflighttopreviewgroup.push({name: `group${index+1}`, listflighttopreview: _datareviews.splice(0,3)});
                        
                      }

                  }
                })
        }

        showReviewList(slide){
          this._flightService.itemReview = slide;
          this.navCtrl.navigateForward('/flighttopreviewlist');
        }

         /**
         * Sự kiện loadmore khi scroll reviews
         * @param event biến event
         */
         onScrollReviews(event: any) {
          let scrolled = 0;
          let el: any = window.document.getElementsByClassName("div-content-review");
          if (el.length > 0) {
            scrolled = Math.round(el[0].scrollWidth - el[0].scrollLeft);
          }
          if (scrolled == el[0].offsetWidth || scrolled + 1 == el[0].offsetWidth) {
            setTimeout(() => {
              this.loadMoreReviews();
            }, 500);
          }
        }

        loadMoreReviews() {
          this.zone.run(() => {
              this.page = this.page + 1;
              this.loadDataFlightTopReviews();
          });
        }
}