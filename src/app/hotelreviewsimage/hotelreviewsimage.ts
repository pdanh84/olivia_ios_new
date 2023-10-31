import { Component, ViewChild, NgZone, ElementRef } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { SearchHotel } from '../providers/book-service';
import { GlobalFunction } from '../providers/globalfunction';


/**
 * Generated class for the OccupancyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-hotelreviewsimage',
  templateUrl: 'hotelreviewsimage.html',
  styleUrls: ['hotelreviewsimage.scss'],
})
export class HotelreviewsimagePage  {
  arrimgreview:any=[];cusnamereview;datereview;countslide=0;lengthslide;ischeckslide=false
  @ViewChild('mySlider') slider:  ElementRef | undefined;;
  captionImg: any;
  hotelName: any;
  tourName: any;
  reviewName: any;
  openFromTopReviewList: boolean = false;
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public searchhotel: SearchHotel,public zone:NgZone,
    public gf: GlobalFunction) {
  }
  goback() {
    this.modalCtrl.dismiss();
  }
  ionViewDidEnter() {
    
    this.cusnamereview=this.searchhotel.cusnamereview;
    this.datereview=this.searchhotel.datereview;
    this.hotelName = this.searchhotel.hotelName;
    this.tourName = this.searchhotel.tourDetailName;
    this.reviewName = this.searchhotel.reviewName;
    this.openFromTopReviewList = this.searchhotel.openFromTopReviewList;
    setTimeout(() => {
      this.arrimgreview = this.searchhotel.arrimgreview;
      if(this.searchhotel.indexreviewimg){
        this.slider?.nativeElement.swiper.slideTo(this.searchhotel.indexreviewimg);
        if(this.arrimgreview[this.searchhotel.indexreviewimg].CaptionImg){
          this.captionImg = this.arrimgreview[this.searchhotel.indexreviewimg].CaptionImg;
        }
      }
      else{
        if ( this.arrimgreview) {
          this.captionImg = this.arrimgreview[0].CaptionImg;
        }
       
      }
      this.lengthslide=this.arrimgreview.length;
      this.ischeckslide=true;
    },900);
    this.gf.hideStatusBar();
  }
  nextslide()
  {
    if (this.countslide<this.arrimgreview.length-1) {
      this.countslide++;
      this.slider?.nativeElement.swiper.slideTo(this.countslide);
      if(this.arrimgreview[this.countslide] && this.arrimgreview[this.countslide].CaptionImg){
        this.captionImg = this.arrimgreview[this.countslide].CaptionImg;
      }
    }

  }
  backslide()
  {
    if (this.countslide-1>=0) {
      this.countslide--;
      this.slider?.nativeElement.swiper.slideTo(this.countslide);
      if(this.arrimgreview[this.countslide] && this.arrimgreview[this.countslide].CaptionImg){
        this.captionImg = this.arrimgreview[this.countslide].CaptionImg;
      }
    }

  }
  onSlideChange()
  {
    // this.slider?.nativeElement.getActiveIndex().then(index => {
    //   this.countslide = index + 1;
    //   this.captionImg = this.arrimgreview[this.countslide].CaptionImg;
    // });
    this.countslide = this.slider?.nativeElement.swiper.activeIndex;
    if(this.arrimgreview[this.countslide]){
      this.captionImg = this.arrimgreview[this.countslide].CaptionImg;
    }
  }

  ionSlideTransitionStart() {
    //this.slider?.nativeElement.getActiveIndex().then(index => {
      this.countslide = this.slider?.nativeElement.swiper.activeIndex;
      if(this.arrimgreview[this.countslide]){
        this.captionImg = this.arrimgreview[this.countslide].CaptionImg;
      }
      
   // });
  }
}