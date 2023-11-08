import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { NavController, ModalController, ToastController,  IonContent,LoadingController } from '@ionic/angular';
import { GlobalFunction } from '../../providers/globalfunction';
import * as $ from 'jquery';
import { C } from '../../providers/constants';
import { tourService } from '../../providers/tourService';

import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { SearchHotel, ValueGlobal } from 'src/app/providers/book-service';
import { HotelreviewsimagePage } from 'src/app/hotelreviewsimage/hotelreviewsimage';
import { DomSanitizer } from '@angular/platform-browser';
import { HotelreviewsvideoPage } from 'src/app/hotelreviewsvideo/hotelreviewsvideo';
import { ticketService } from '../../providers/ticketService';
var document:any;
@Component({
  selector: 'app-ticketdetail',
  templateUrl: './ticketdetail.page.html',
  styleUrls: ['./ticketdetail.page.scss'],
})

export class TicketDetailPage {
  @ViewChild('mySlider') slider:  ElementRef | undefined;
  @ViewChild('slideTourTab') sliderTab: ElementRef | undefined;
  @ViewChild('headerScroll') headerScroll: IonContent;
  @ViewChild('scrollArea') scrollYArea: IonContent;
  slideOpts = {
      loop: false,
      slidesPerView: 1,
      centeredSlides: false,
      spaceBetween: 10,
      zoom: {
        toggle: false
      }
    };
      
  comboId = 1668;
  departureDate = "";
  coutslide: number = 1;
  listDepartureDate:any = [];
  listDepartureDatesdk = [1,2,3,4,5];
  tabTourRule: number=1;
totalReview: any=0;
AvgPoint: any=0;
expanddivdepature = false;
expanddivreview = false;
loaddeparturedone: boolean;
loadslidedone = false;
youtubeId: any;
listSlides: any =[];
itemDetail:any;
itemDetail1:any;
experiencePackages: any;
itemSlide:any;
ticketReviews: any;
isseemore: boolean = false;
isseemorenotes: boolean = false;
overview: any;
notes: any;
ishowMap: boolean = false;
linkGoogleMap: any;
kkdayExchanges: any;
kkdayVenueLocations: any;
objRate: any;
kkdayProductIntroDesc: any;
kkdayProductExpe: any;
loader: any;
  constructor(private navCtrl: NavController, public gf: GlobalFunction,
      private modalCtrl: ModalController,
      private toastCtrl: ToastController,
      private zone: NgZone,
      private storage: Storage,
      public tourService: tourService,
      public searchHotel: SearchHotel,
      private sanitizer: DomSanitizer,
      public ticketService: ticketService,public loadingCtrl: LoadingController) {
          this.loaddata();
          this.gf.logEventFirebase('',this.tourService, 'ticketdetail', 'view_item', 'Ticket');
      }
private loaddata() {

    let url = C.urls.baseUrl.urlTicket + '/api/Detail/GetExperienceDetail/' + (this.ticketService.itemTicketDetail.experienceId || 1);
    let headers = {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    this.gf.RequestApi('GET', url, headers, null, 'hometicketslide', 'getAllExperiences').then((data) => {
      let res = data;
      this.ticketService.experience = res.data.experience;
      this.loadslidedone = true;
      this.AvgPoint = res.data.experience.avgPoint;
      if(this.AvgPoint && (this.AvgPoint == 10  || this.AvgPoint == 6  || this.AvgPoint == 9  || this.AvgPoint == 8  || this.AvgPoint == 7)){
        this.AvgPoint = this.AvgPoint + ".0";
      }
      this.totalReview = res.data.experience.numOfReview;
  
      this.itemDetail = res.data.experience;

      if (this.ticketService.experience.latitude && this.ticketService.experience.longitude) {
        let link = "https://maps.google.com/maps?q="+this.ticketService.experience.latitude+","+this.ticketService.experience.longitude+"&hl=es;z=14&amp&output=embed";
        // let link = "https://maps.google.com?q="+this.ticketService.experience.latitude+","+this.ticketService.experience.longitude+"";
        this.linkGoogleMap = this.sanitizer.bypassSecurityTrustResourceUrl(link);
      }
    
      if (this.itemDetail.overview.length >= 1e3) {
        let $ =this.itemDetail.overview.trim().substr(0, 1e3).split(" ");
        $.pop(),
        $ = $.join(" ") + '...',
        this.overview  = $;
      }
      else{
        this.overview=this.itemDetail.overview;
        this.isseemore=true;
      }
      if (this.itemDetail.notes)
      if (this.itemDetail.notes.length >= 2610) {
          let qn = this.itemDetail.notes.trim().substr(0, 2610).split(" ");
          var $;
          qn.pop(),
          qn = qn.join(" "),
          $ = this.isIncludeUnclosedElement(qn) ? ($ = qn.trim().substr(0, qn.lastIndexOf("<")).split(" ")).join(" ") + ' ...' : qn + ' ...',
          this.notes = $
      }else{
        this.notes =this.itemDetail.notes;
        this.isseemorenotes = true;
      }
    
      this.experiencePackages = res.data.experiencePackages;
      this.loaddeparturedone = true;
      // this.itemDetail.experienceImages = this.itemDetail.Image.split(', ');
      this.itemDetail.experienceImages.forEach(element => {
        if (element.imageLink.indexOf('http') == -1) {
          this.listSlides.push({ ImageUrl: 'https:' + element.imageLink });
        } else {
          this.listSlides.push({ ImageUrl: element.imageLink });
        }
      });
      // thêm giới thiệu
      this.kkdayProductIntroDesc=res.data.kkdayProductIntroDesc;
      // thêm địa điểm trải nghiệm
      this.kkdayProductExpe=res.data.kkdayProductExpe;
      this.kkdayProductExpe.forEach(element => {
        element.isshow=false;
        let link = "https://maps.google.com/maps?q="+element.latitude+","+element.longitude+"&hl=es;z=14&amp&output=embed";          element.linkGoogleMap = this.sanitizer.bypassSecurityTrustResourceUrl(link);
      });
      // thêm địa điểm đổi vé
      this.kkdayExchanges=res.data.kkdayExchanges;
      this.kkdayExchanges.forEach(element => {
        element.isshow=false;
        let link = "https://maps.google.com/maps?q="+element.latitude+","+element.longitude+"&hl=es;z=14&amp&output=embed";          element.linkGoogleMap = this.sanitizer.bypassSecurityTrustResourceUrl(link);
      });
      this.kkdayVenueLocations=res.data.kkdayVenueLocations;

      this.kkdayVenueLocations.forEach(element => {
        element.isshow=false;
        let link = "https://maps.google.com/maps?q="+element.latitude+","+element.longitude+"&hl=es;z=14&amp&output=embed";
        element.linkGoogleMap = this.sanitizer.bypassSecurityTrustResourceUrl(link);
      });
      let url = C.urls.baseUrl.urlTicket + '/api/Home/GetExperienceSameTopic/' + res.data.topic.id +'?expId=' + (this.ticketService.itemTicketDetail.experienceId || 1)+'&numberKeep=3';
      let headers = {
        apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
      };
      this.gf.RequestApi('POST', url, headers, null, 'hometicketslide', 'GetExperienceSameTopic').then((data) => {
        let res = data;
        this.itemSlide=[];
        if (res.data) {
          for (let i = 0; i < 3; i++) {
            const element = res.data[i];
              if(element.avgPoint && (element.avgPoint == 10  || element.avgPoint == 6  || element.avgPoint == 9  || element.avgPoint == 8  || element.avgPoint == 7)){
                element.avgPoint = element.avgPoint + ".0";
              }
            this.itemSlide.push(element);
          }
        }
       
        let url = C.urls.baseUrl.urlTicket + '/api/Detail/GetExperienceReviews?experienceCode=' + this.ticketService.itemTicketDetail.experienceId+'&pageSize=10&pageindex=1';
        let headers = {
        apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
        };
       this.gf.RequestApi('GET', url, headers, null, 'hometicketslide', 'GetExperienceSameTopic').then((data) => {
        let res = data;
        this.ticketReviews = res.data.reviews;
        if (this.ticketReviews) {
          this.ticketReviews =  this.ticketReviews.map((item) => {
            return { ...item, reviewDateDisplay: moment(this.ticketReviews.reviewDate).format('DD-MM-YYYY') }
          });
        }
   
      });

      });
    });
  
}
isIncludeUnclosedElement($) {
  return !($.lastIndexOf("<") < $.lastIndexOf(">"))
}
      ngOnInit() { 
        this.tourService.getObservableScrollToDepartureDiv().subscribe((data) => {
          if(data){
            this.changeItemHeader(3);
          }
        })
       
      }

      goback() {
        // if(this.ticketService.backPage == 'hometicket'){
     
        //   this.ticketService.backPage = '';
        // }else{
        //   this.navCtrl.back();
        //   this.ticketService.backPage = '';
        // }
        this.navCtrl.navigateBack('/tabs/tab1');
        
      }

  /***
   * Next trên slide
   */
  onSlideChange() {
      //this.slider?.nativeElement.getActiveIndex().then(index => {
          this.coutslide = this.slider?.nativeElement.swiper.activeIndex + 1;
      //});
  }

  getDayName(date) {
      let thu ='';
      thu = moment(date).format('dddd');
        switch (thu) {
          case "Monday":
            thu = "Thứ 2"
            break;
          case "Tuesday":
            thu = "Thứ 3"
            break;
          case "Wednesday":
            thu = "Thứ 4"
            break;
          case "Thursday":
            thu = "Thứ 5"
            break;
          case "Friday":
            thu = "Thứ 6"
            break;
          case "Saturday":
            thu = "Thứ 7"
            break;
          default:
            thu = "Chủ nhật"
            break;
        }
        return thu;
    }

    slidetabchange(){
      //this.sliderTab?.nativeElement.getActiveIndex().then(index => {
        this.tabTourRule = this.slider?.nativeElement.swiper.activeIndex+1;
      //});
    }
  
    SelectTab(tabindex){
      this.zone.run(()=>{
        this.tabTourRule = tabindex;
        this.sliderTab?.nativeElement.swiper.slideTo(tabindex-1);
      })
  }

  public scrollFunction = (event: any) => {
    try {
      let elheader = window.document.getElementsByClassName('cls-tourdetail-header');
      if (event.detail.currentY > 505) {
        elheader[0].classList.add('float-arrow-enabled');
        elheader[0].classList.remove('float-arrow-disabled');
        if (elheader[1]) {
          elheader[1].classList.add('float-arrow-enabled');
          elheader[1].classList.remove('float-arrow-disabled');
        }
        (window.document.getElementById('header1')as any).scrollIntoView({  block: 'center'  });
      }
      else {
        elheader[0].classList.add('float-arrow-disabled');
        elheader[0].classList.remove('float-arrow-enabled');
        if (elheader[1]) {
          elheader[1].classList.add('float-arrow-disabled');
          elheader[1].classList.remove('float-arrow-enabled');
        }
      }

      if ($('#content2') && $('#content2').length >0 && event.detail.currentY >= $('#content2')[0].offsetTop - 120) {
        $($('.item-tour-header')[1]).siblings().removeClass('item-header-actived');
        $($('.item-tour-header')[1]).addClass('item-header-actived');
        (window.document.getElementById('header2')as any).scrollIntoView({  block: 'center'  });

        if ($('#content3') && $('#content3').length >0&& event.detail.currentY >= $('#content3')[0].offsetTop - 120) {
          $($('.item-tour-header')[2]).siblings().removeClass('item-header-actived');
          $($('.item-tour-header')[2]).addClass('item-header-actived');
          (window.document.getElementById('header3')as any).scrollIntoView({  block: 'center'  });
        }else if ($('#content3') && $('#content3').length >0 && $('#content2').length >0 && event.detail.currentY < $('#content3')[0].offsetTop - 120 && event.detail.currentY > $('#content2')[0].offsetTop - 120){
          $($('.item-tour-header')[1]).siblings().removeClass('item-header-actived');
          $($('.item-tour-header')[1]).addClass('item-header-actived');
          (window.document.getElementById('header2')as any).scrollIntoView({  block: 'center'  });
        }

          if ($('#content4') && $('#content4').length >0&& event.detail.currentY >= $('#content4')[0].offsetTop - 120) {
            $($('.item-tour-header')[4]).siblings().removeClass('item-header-actived');
            $($('.item-tour-header')[4]).addClass('item-header-actived');
            (window.document.getElementById('header4')as any).scrollIntoView({  block: 'center'  });
          }else if ($('#content4') && $('#content4').length >0 && $('#content3').length >0 && event.detail.currentY < $('#content4')[0].offsetTop - 120 && event.detail.currentY > $('#content3')[0].offsetTop - 120){
            $($('.item-tour-header')[2]).siblings().removeClass('item-header-actived');
            $($('.item-tour-header')[2]).addClass('item-header-actived');
            (window.document.getElementById('header3')as any).scrollIntoView({  block: 'center'  });
          }

          if ($('#content5') && $('#content5').length >0&& event.detail.currentY >= $('#content5')[0].offsetTop - 120) {
            $($('.item-tour-header')[4]).siblings().removeClass('item-header-actived');
            $($('.item-tour-header')[4]).addClass('item-header-actived');
            (window.document.getElementById('header5')as any).scrollIntoView({  block: 'center'  });
          }else if ($('#content5') && $('#content5').length >0 && $('#content4').length >0 && event.detail.currentY < $('#content5')[0].offsetTop - 120 && event.detail.currentY > $('#content4')[0].offsetTop - 120){
            $($('.item-tour-header')[3]).siblings().removeClass('item-header-actived');
            $($('.item-tour-header')[3]).addClass('item-header-actived');
            (window.document.getElementById('header4')as any).scrollIntoView({  block: 'center'  });
          }

          if ($('#content6') && $('#content6').length >0&& event.detail.currentY >= $('#content6')[0].offsetTop - 120) {
            $($('.item-tour-header')[5]).siblings().removeClass('item-header-actived');
            $($('.item-tour-header')[5]).addClass('item-header-actived');
            (window.document.getElementById('header6')as any).scrollIntoView({  block: 'center'  });
          }else if ($('#content6') && $('#content6').length >0 && $('#content5').length >0&& event.detail.currentY < $('#content6')[0].offsetTop - 120 && event.detail.currentY > $('#content5')[0].offsetTop - 120){
            $($('.item-tour-header')[4]).siblings().removeClass('item-header-actived');
            $($('.item-tour-header')[4]).addClass('item-header-actived');
            (window.document.getElementById('header5')as any).scrollIntoView({  block: 'center'  });
          }

          if ($('#divReview') && $('#divReview').length >0&& event.detail.currentY >= $('#divReview')[0].offsetTop - 120) {
            $($('.item-tour-header')[3]).siblings().removeClass('item-header-actived');
            $($('.item-tour-header')[3]).addClass('item-header-actived');
            (window.document.getElementById('header7')as any).scrollIntoView({  block: 'center'  });
          }
          if ($('#divGT') && $('#divGT').length >0&& event.detail.currentY >= $('#divGT')[0].offsetTop - 120) {
            $($('.item-tour-header')[3]).siblings().removeClass('item-header-actived');
            $($('.item-tour-header')[3]).addClass('item-header-actived');
            (window.document.getElementById('headerGT')as any).scrollIntoView({  block: 'center'  });
          }
          if ($('#divDDTN') && $('#divDDTN').length >0&& event.detail.currentY >= $('#divDDTN')[0].offsetTop - 120) {
            if (this.kkdayProductIntroDesc) {
              $($('.item-tour-header')[4]).siblings().removeClass('item-header-actived');
              $($('.item-tour-header')[4]).addClass('item-header-actived');
              (window.document.getElementById('headerDDTN')as any).scrollIntoView({  block: 'center'  });
            }else{
              $($('.item-tour-header')[3]).siblings().removeClass('item-header-actived');
              $($('.item-tour-header')[3]).addClass('item-header-actived');
              (window.document.getElementById('headerDDTN')as any).scrollIntoView({  block: 'center'  });
            }
          
          }
          // else if ($('#divDDTN') && $('#divDDTN').length >0&& event.detail.currentY < $('#divDDTN')[0].offsetTop - 120 && event.detail.currentY > $('#content6')[0].offsetTop - 120){
          //   $($('.item-tour-header')[3]).siblings().removeClass('item-header-actived');
          //   $($('.item-tour-header')[3]).addClass('item-header-actived');
          //   window.document.getElementById('header6').scrollIntoView({  block: 'center'  });
          // }

      }else {
        $($('.item-tour-header')[0]).siblings().removeClass('item-header-actived');
        $($('.item-tour-header')[0]).addClass('item-header-actived');
      }

      

    } catch (error:any) {
      error.page = "hoteldetail";
      error.func = "scrollFunction";
      error.param = "";
      C.writeErrorLog(error, null);
    }

  }

    changeItemHeader(index) {

        if(index) {
          $($('.item-tour-header')[index-1]).siblings().removeClass('item-header-actived');
          $($('.item-tour-header')[index-1]).addClass('item-header-actived');

           setTimeout(()=>{
            if(index != 7){
              (window.document.getElementById('header'+index)as any).scrollLeft = parseInt($("#header"+index)[0].offsetLeft.toString())
              $('#header'+index).animate({'scrollLeft': $('#header'+index).position().left + 220}, 500);
              //this.scrollYArea.scrollToPoint(0, $('#content'+index).position().top +50, 350);
              if($('#content'+index) && $('#content'+index).length >0){
                (window.document.getElementById('content'+index)as any).scrollIntoView({ behavior: 'smooth', block: 'center'  });
              }
              
            }else{
              this.scrollToTopGroupReview(1)
            }
            
              if($('.div-item').hasClass('scroll-horizontal')){
                this.changeStyleHeader();
              }
          },50)
        }
    }

    changeStyleHeader(){
      let se = this;
      if($('.div-item').hasClass('scroll-horizontal')){
        $('.div-item').removeClass('scroll-horizontal');
        //$('.item-tour-header').removeClass('item-scroll-horizontal');
      }else{
        $('.div-item').addClass('scroll-horizontal');
        //$('.item-tour-header').addClass('item-scroll-horizontal');
      }
    }

 

    async imgreview(arrimgreview, indeximgreview,CustomerName,DateStayed) {
      this.searchHotel.arrimgreview = arrimgreview;
      this.searchHotel.indexreviewimg = indeximgreview;
      this.searchHotel.cusnamereview = CustomerName;
      this.searchHotel.datereview = DateStayed;
      this.searchHotel.openFromTopReviewList = false;
      const modal: HTMLIonModalElement =
        await this.modalCtrl.create({
          component: HotelreviewsimagePage,
        });
      modal.present();
    }

    expandDeparture(value){
      if(value ==1){
        var divCollapse = $('.div-wrap-departure.div-collapse');
        if(divCollapse && divCollapse.length >0){
          divCollapse.removeClass('div-collapse').addClass('div-expand');
        }
        this.expanddivdepature = true;
        //this.scrollToTopGroup(1);
      }else{
        var divCollapse = $('.div-wrap-departure.div-expand');
        if(divCollapse && divCollapse.length >0){
          divCollapse.removeClass('div-expand').addClass('div-collapse');
        }

        this.expanddivdepature = false;
        this.scrollToTopGroup(2);
      }
      
    }

    expandReview(value){
      if(value ==1){
        var divCollapse = $('.div-item-review.div-collapse');
        if(divCollapse && divCollapse.length >0){
          divCollapse.removeClass('div-collapse').addClass('div-expand');
        }
        this.expanddivreview = true;
        this.scrollToTopGroupReview(1);
      }else{
        var divCollapse = $('.div-item-review.div-expand');
        if(divCollapse && divCollapse.length >0){
          divCollapse.removeClass('div-expand').addClass('div-collapse');
        }

        this.expanddivreview = false;
        this.scrollToTopGroupReview(2);
      }
    }


    scrollToTopGroup(value){
      //scroll to top of group
      setTimeout(()=>{
        var objHeight = value == 2 ? $('.div-departure') : $('.div-wrap-departure').last();
        if(objHeight && objHeight.length >0){
          var h = 0;
          h = value == 2 ? objHeight[0].offsetTop - 150 : objHeight[0].offsetTop - 50;
          if(this.scrollYArea){
            this.scrollYArea.scrollToPoint(0,h,500);
          }
          
        }
      },100)
    }

    scrollToTopGroupReview(value){
      //scroll to top of group
      setTimeout(()=>{
        var objHeight =  $('.div-review');
        if(objHeight && objHeight.length >0){
          var h = 0;
          h = value == 2 ? objHeight[0].offsetTop - 200 : objHeight[0].offsetTop - 50;
          if(this.scrollYArea){
            this.scrollYArea.scrollToPoint(0,h,500);
          }
          
        }
      },100)
    }

    scrollToPrice(value){
      //scroll to top of group
      setTimeout(()=>{
        var objHeight =  $('.text-headservice');
        if(objHeight && objHeight.length >0){
          var h = 0;
          h = value == 2 ? objHeight[0].offsetTop - 200 : objHeight[0].offsetTop - 50;
          if(this.scrollYArea){
            this.scrollYArea.scrollToPoint(0,h,657);
          }
          
        }
      },100)
    }
    ionViewWillEnter(){
      this.departureDate = moment(this.searchHotel.CheckInDate).format('DD/MM/YYYY');
      this.hidetopbar();
    }

    hidetopbar(){
      var se = this;
      let el = window.document.getElementsByClassName('div-statusbar-float');
        el[0].classList.remove('float-statusbar-enabled');
        el[0].classList.add('float-statusbar-disabled');
    }

    async showSlideImage(idx) {
      if(!this.listSlides || this.listSlides.length <2){
        return;
      }
      this.searchHotel.arrimgreview = this.listSlides;
      this.searchHotel.indexreviewimg = idx;
      this.searchHotel.cusnamereview = '';
      this.searchHotel.datereview = '';
      this.searchHotel.tourDetailName = this.itemDetail.name;
      this.searchHotel.openFromTopReviewList = false;
      const modal: HTMLIonModalElement =
        await this.modalCtrl.create({
          component: HotelreviewsimagePage,
        });
      modal.present();
   }
   async showFullScreen(){
    this.searchHotel.ticketDetailName = this.itemDetail.name;
    this.searchHotel.trustedVideoUrl = this.itemDetail.trustedVideoUrl;
    const modal: HTMLIonModalElement =
    await this.modalCtrl.create({
      component: HotelreviewsvideoPage,
    });
  modal.present();
   }

   showTicketServices(itemService){
      if(itemService){
        this.ticketService.itemTicketService = itemService;
        this.FindAvailableRateDateByExpeId(itemService);
      
      }
   }

   showTicketServiceDetail(itemService) {
    if(itemService){
      this.ticketService.itemTicketService = itemService;
      this.navCtrl.navigateForward('/ticketservicedetail');
    }
   }
   showDetail(item){
    var se= this;
    this.ticketService.itemTicketDetail = item;
    se.ticketService.backPage = 'hometicket';
    se.itemDetail = {};
    se.itemDetail.name = item.experienceName;
    // if(this.ticketService.itemTicketDetail.experienceId){
    //   this.loaddata();
    // }
    se.loaddata();
  }
  seemore(){
    this.isseemore=true;
  }
  seemorenotes(){
    this.isseemorenotes=true;
  }
  openmap(){
    this.ishowMap=!this.ishowMap;
    if (this.ishowMap) {
      this.presentLoadingRelated();
    }
   
  }
  async presentLoadingRelated() {
    var loader = await this.loadingCtrl.create({
      message: "",
      duration: 1000
    });
    loader.present();
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      message: ""
    });
    this.loader.present();
  }
  showdetail(item){
    item.isshow=!item.isshow;
    if (item.isshow) {
      this.presentLoadingRelated();
    }
  }
  FindAvailableRateDateByExpeId(itemService) {
    this.gf.showLoading();
    let obj = {
      expeId: this.ticketService.itemTicketDetail.experienceId,
    }
    let headers =
    {
      'content-type': 'application/json'
    }
    this.gf.RequestApi('POST', C.urls.baseUrl.urlTicket + '/api/Detail/FindAvailableRateDateByExpeId', headers, obj, 'ticketservice', 'FindAvailableRateDateByExpeId').then((data: any) => {
      this.gf.hideLoading();
      if (data && data.success && data.data.length>0) {
        this.objRate=data.data;
      }
      if (this.objRate) {
        this.ticketService.itemTicketService.itemObjRate = {};
        this.ticketService.itemTicketService.itemObjRate = this.objRate.find((el) => { return el.pkgId == itemService.id });
        if (this.ticketService.itemTicketService.itemObjRate) {
          if (this.ticketService.itemTicketService.itemObjRate.specs && this.ticketService.itemTicketService.itemObjRate.specs.length >0) {
            this.ticketService.itemTicketService.itemObjRate.specs.forEach(element => {
              element.child = element.child.map((item, index) => {
                if (index === 0) {
                  return { ...item, action: true };
                }
                return { ...item, action: false };
              });
            });
          }
          this.navCtrl.navigateForward('/ticketservice');
        }
        else{
          alert("Gói dịch vụ chưa có ngày khởi hành, vui lòng chọn gói khác");
        }
      }

      // this.GetCalendarBySkuId(itemService);
    })

  }
  GetCalendarBySkuId(itemService) {
    let obj = {
      expeId: this.ticketService.itemTicketDetail.experienceId,
    }
    let headers =
    {
      'content-type': 'application/json'
    }
    this.gf.RequestApi('POST', C.urls.baseUrl.urlTicket + '/api/Detail/GetCalendarBySkuId', headers, obj, 'ticketservice', 'FindAvailableRateDateByExpeId').then((data: any) => {

      this.gf.hideLoading();
      if (data && data.success && data.data.length>0) {
        this.ticketService.itemTicketService.itemObjRateTime = {};
        this.ticketService.itemTicketService.itemObjRateTime=data.data;
      }
      if (this.ticketService.itemTicketService.itemObjRateTime) {
        this.ticketService.itemTicketService.itemObjRateTime = this.ticketService.itemTicketService.itemObjRateTime.find((el) => { return el.pkgId == itemService.id });
      }

    })

  }
}
