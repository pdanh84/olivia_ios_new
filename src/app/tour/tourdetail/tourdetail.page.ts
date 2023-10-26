import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { NavController, ModalController, ToastController, IonContent } from '@ionic/angular';
import { GlobalFunction } from '../../providers/globalfunction';
import * as $ from 'jquery';
import { C } from '../../providers/constants';
import { tourService } from '../../providers/tourService';

import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { SearchHotel, ValueGlobal } from 'src/app/providers/book-service';
import { HotelreviewsimagePage } from 'src/app/hotelreviewsimage/hotelreviewsimage';
import { YoutubeVideoPlayer } from '@awesome-cordova-plugins/youtube-video-player/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { HotelreviewsvideoPage } from 'src/app/hotelreviewsvideo/hotelreviewsvideo';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

@Component({
  selector: 'app-tourdetail',
  templateUrl: './tourdetail.page.html',
  styleUrls: ['./tourdetail.page.scss'],
})

export class TourDetailPage {
  @ViewChild('scrollArea') sliderTab:  ElementRef | undefined;;
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
  itemDetail: any;
  showloadmore;
  comboId = 1668;
  departureDate = "";
  coutslide: number = 1;
  listDepartureDate:any = [];
  listDepartureDatesdk = [1, 2, 3, 4, 5];
  tabTourRule: number = 1;
  totalReview: any = 0;
  AvgPoint: any = 0;
  tourReviews: any = [];
  expanddivdepature = false;
  expanddivreview = false;
  loaddeparturedone: boolean;
  loadslidedone = false;
  youtubeId = '';
  listSlides: any = [];
  tourRelated:any = [];
  itemlike = false;
  TourIDLike: string;
  dataListLike: any;
  isChangeItemHeader: boolean=false;
  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private zone: NgZone,
    private storage: Storage,
    public tourService: tourService,
    public searchHotel: SearchHotel,
    private youtube: YoutubeVideoPlayer,
    private domSanitizer: DomSanitizer, public valueGlobal: ValueGlobal, private socialSharing: SocialSharing) {
    if (tourService.tourDetailId) {
      this.loaddata();
    }

  }

  loaddata() {
    this.tourService.itemDepartureCalendar = null;
    let headers = {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    this.gf.RequestApi('GET', C.urls.baseUrl.urlMobile + '/tour/api/TourApi/GetTourById?id=' + this.tourService.tourDetailId, headers, {}, 'tourDetail', 'init').then((data) => {
      if (data && data.Status == "Success" && data.Response) {
        this.itemDetail = data.Response;
        this.tourService.gaTourDetail = this.itemDetail;
        if (this.itemDetail && this.itemDetail.Image && this.tourService.listTopSale && this.tourService.listTopSale.length > 0) {
          let itemmap = this.tourService.listTopSale.filter((item) => item.Id == this.tourService.tourDetailId);
          if (itemmap && itemmap.length > 0) {
            this.itemDetail.TopSale = itemmap[0].TotalPax;
          }
          this.itemDetail.ImagesSlide = this.itemDetail.Image.split(', ');
          this.itemDetail.ImagesSlide.forEach(element => {
            if (element.indexOf('http') == -1) {
              this.listSlides.push({ ImageUrl: 'https:' + element });
            } else {
              this.listSlides.push({ ImageUrl: element });
            }
          });
          if (this.itemDetail.YoutubeId) {
            this.youtubeId = this.itemDetail.YoutubeId;
            this.itemDetail.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.itemDetail.YoutubeId);
          }

          setTimeout(() => {
            this.loadslidedone = true;
          }, 3000)
          let countstring = this.itemDetail.ProgramContent.match(/cdn2/g || []).length;
          for (let index = 0; index < countstring; index++) {
            this.itemDetail.ProgramContent = this.itemDetail.ProgramContent.replace('src="//cdn2', 'src="https://cdn2');
          }

          this.gf.RequestApiWithQueryString('GET', `https://www.ivivu.com/hotelrequest/morereviews?hotelSlug=${this.itemDetail.Code}&total=100&offset=0&mode=2&timespan=${new Date().getTime()}`, headers, {}, 'tourDetail', 'morereviews').then((data) => {
            if (data && data.reviews) {

              if (data.reviews && data.reviews.length > 0) {
                this.zone.run(() => {
                  this.totalReview = data.loaded;
                  this.AvgPoint = (data.reviews.reduce((total, b) => { return total + (b.ReviewPoint * 1 || 0); }, 0) / data.loaded).toFixed(1);
                  this.tourReviews = data.reviews;
                })




              }
            }
          })
        }
        if (this.itemDetail.AvgPoint && (this.itemDetail.AvgPoint.toString().length == 1 || this.itemDetail.AvgPoint === 10)) {
          this.itemDetail.AvgPoint = this.itemDetail.AvgPoint + ".0";
        }
      } else {
        this.gf.showAlertMessageOnly('Sản phẩm đang được cập nhật, Quý khách vui lòng chọn thông báo khác!');
        this.goback();
      }
    })
    this.gf.RequestApiWithQueryString('GET', C.urls.baseUrl.urlMobile + '/tour/api/TourApi/GetMercuriusPriceByTourIds', headers, { TourIds: this.tourService.tourDetailId, date: moment(this.tourService.checkInDate).format('YYYY-MM-DD') }, 'tourDetail', 'GetMercuriusPriceByTourIds').then((data) => {
      if (data && data.Status == "Success" && data.Response && data.Response.length > 0) {
        let itemDefault = data.Response[0];
        if (itemDefault && itemDefault.Contract) {
          this.gf.RequestApiWithQueryString('GET', C.urls.baseUrl.urlMobile + '/tour/api/TourApi/GetMercuriusTourDetail', headers, { TourId: this.tourService.tourDetailId, date: moment(itemDefault.Contract[0].AllotmentDate).format('YYYY-MM-DD'), DefaultAdultForRate: itemDefault.DefaultAdultForRate }, 'tourDetail', 'GetMercuriusTourDetail').then((data1) => {
            if (data1 && data1.Status == "Success" && data1.Response && data1.Response.TourRate) {

              if (data1.Response.StrListDepartures) {
                this.gf.RequestApi('POST', C.urls.baseUrl.urlMobile + '/tour/api/TourApi/MercuriusTourDepartureDate', headers, { TourCode: this.tourService.tourDetailId, DepartureTime: data1.Response.StrListDepartures.split(',') }, 'tourDetail', 'MercuriusTourDeparture').then((data2) => {
                  if (data2 && data2.Status == 'Success') {
                    let lstDepartures = JSON.parse(data2.Response);
                    this.tourService.calendarDeparture=JSON.parse(data2.Response);
                    this.listDepartureDate=[];
                    lstDepartures.forEach(element => {
                      let _item = {
                        AllotmentDateStr: `${moment(element.AllotmentDate).format('DD/MM/YYYY')}`,
                        PriceAdultAvgStr: this.gf.convertNumberToString(element.PriceAdultAvg),
                        PriceChildAvgStr: element.PriceChildAvg ? this.gf.convertNumberToString(element.PriceChildAvg) : 0,
                        IsMinPrice: Math.min(...lstDepartures.map(o => o.PriceAdultAvg)) == element.PriceAdultAvg && (Math.min(...lstDepartures.map(o => o.PriceAdultAvg)) != Math.max(...lstDepartures.map(o => o.PriceAdultAvg))|| Math.min(...lstDepartures.map(o => o.PriceAdultAvg)) == Math.max(...lstDepartures.map(o => o.PriceAdultAvg))),
                        IsMaxPrice: Math.max(...lstDepartures.map(o => o.PriceAdultAvg)) == element.PriceAdultAvg && Math.max(...lstDepartures.map(o => o.PriceAdultAvg)) == Math.max(...lstDepartures.map(o => o.PriceAdultAvg)) && Math.max(...lstDepartures.map(o => o.PriceAdultAvg)) != Math.min(...lstDepartures.map(o => o.PriceAdultAvg)),
                        AllotmentDateDisplay: moment(element.AllotmentDate).format('DD-MM-YYYY'),
                        PriceAdultAvg: element.PriceAdultAvg,
                        PriceChildAvg: element.PriceChildAvg || 0,
                        DepartureDate: moment(element.AllotmentDate).format('YYYY-MM-DD'),
                        DayDisplay: this.gf.getDayOfWeek(element.AllotmentDate).dayname,
                        AllotmentDisplay: element.Status == 'RQ' ? 'Liên hệ' : (element.AllotmentNo > 0 ? `Còn ${element.AllotmentNo} chỗ` : 'Đã hết chỗ'),
                        Status: element.Status == 'AL' ? true : false
                      }
                      this.listDepartureDate.push(_item);
                    });
                    this.tourService.departures = this.listDepartureDate.map(o => o.DepartureDate);
                    this.tourService.departuresItemList = this.listDepartureDate;

                    let itemdeparturemap = this.listDepartureDate.filter((itemd) => { return moment(itemd.DepartureDate).format('DD/MM/YYYY') == moment(this.tourService.checkInDate).format('DD/MM/YYYY') });
                    if (itemdeparturemap && itemdeparturemap.length > 0) {
                      this.departureDate = moment(this.tourService.checkInDate).format('DD/MM/YYYY');
                      this.tourService.DepartureDate = itemdeparturemap[0].DepartureDate;
                      this.zone.run(() => {
                        this.tourService.itemDepartureCalendar = itemdeparturemap[0];
                      });

                    } else {
                      let listDepartureDateSort = [...this.listDepartureDate];
                      listDepartureDateSort.forEach((itemd) => {
                        itemd.subtractDayDepartured = moment(this.tourService.checkInDate).diff(moment(itemd.DepartureDate));
                        if (itemd.subtractDayDepartured < 0) {
                          itemd.subtractDayDepartured = itemd.subtractDayDepartured * -1;
                        }
                      });
                      this.zone.run(() => listDepartureDateSort.sort(function (a, b) {
                        return a['subtractDayDepartured'] - b['subtractDayDepartured'];
                      }));


                      this.departureDate = moment(listDepartureDateSort[0].DepartureDate).format('DD/MM/YYYY');
                      this.tourService.DepartureDate = listDepartureDateSort[0].DepartureDate;
                      this.zone.run(() => {
                        this.tourService.itemDepartureCalendar = listDepartureDateSort[0];
                      });
                    }
                    this.loaddeparturedone = true;
                  } else {
                    this.loaddeparturedone = true;
                  }
                  this.gf.logEventFirebase('', this.tourService, 'tourdetail', 'view_item', 'Tours');
                })
                this.changeItemHeader(1);
              }




            }
          })
        }

      } else {
        this.changeItemHeader(1);
        this.tourService.departuresItemList = [];
        this.loaddeparturedone = true;
      }
    })

    this.gf.RequestApi('GET', C.urls.baseUrl.urlMobile + '/tour/api/TourApi/SearchTourInRegionByTourId?TourId=' + this.tourService.tourDetailId, headers, {}, 'tourDetail', 'SearchTourInRegionByTourId').then((data) => {
      if (data && data.Status == "Success" && data.Response) {
        //console.log(data.Response)
        this.tourRelated = data.Response;
        this.tourRelated.forEach(slide => {
          if (slide.AvartarLink && slide.AvartarLink.indexOf('http') == -1) {
            slide.AvartarLink = 'https:' + slide.AvartarLink;
          }
          slide.priceShow = this.gf.convertNumberToString(slide.AdultSalePrice);
        });
        let listIds = this.tourRelated.map(item => item.Id).join(',');
        let se = this;
        let url = C.urls.baseUrl.urlMobile + '/tour/api/TourApi/SearchTourDestination?lsIdTour=' + listIds + `&departuredId=${((this.tourService.itemSearchDepature && this.tourService.itemSearchDepature.Id) ? this.tourService.itemSearchDepature.Id : 37)}`;
        se.gf.RequestApi('GET', url, headers, null, 'tourDetail', 'SearchTourDestination').then((res) => {
          res.Response.forEach(element => {
            let itemmap = this.tourRelated.filter((item) => item.Id == element.Id);
            if (itemmap && itemmap.length > 0) {
              itemmap[0].MinPrice = element.MinPrice;
              itemmap[0].AvgPoint = element.AvgPoint;
              itemmap[0].NumOfReview = element.NumOfReview;
            }

            se.convertAvgPoint(itemmap[0]);
          });
          se.mapingPriceTour(this.tourRelated);
        })

      }
    }
    )
  }
  convertAvgPoint(element) {
    if (element.AvgPoint && (element.AvgPoint.toString().length == 1 || element.AvgPoint === 10)) {
      element.AvgPoint = element.AvgPoint + ".0";
    }
  }
  mapingPriceTour(slideData) {
    let se = this;
    let headers = {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    if (slideData && slideData.length > 0) {
      let listIds = slideData.map(item => item.Id).join(',');
      se.gf.RequestApiWithQueryString('GET', C.urls.baseUrl.urlMobile + '/tour/api/TourApi/GetMercuriusPriceByTourIds', headers, { TourIds: listIds, date: moment(this.tourService.checkInDate).format('YYYY-MM-DD') }, 'tourDetail', 'GetMercuriusPriceByTourIds').then((data) => {
        if (data && data.Status == "Success" && data.Response && data.Response.length > 0) {
          for (let index = 0; index < slideData.length; index++) {
            const element = slideData[index];
            let datamap = data.Response.filter((p) => { return p.Contract && p.Contract[0] && p.Contract[0].PriceAdult && p.Code == "TO" + element.Id });
            if (datamap && datamap.length > 0) {
              if (!element.MinPrice || datamap[0].Contract[0].PriceAdult < element.MinPrice) {
                element.priceShow = se.gf.convertNumberToString(datamap[0].Contract[0].PriceAdult);
                element.PriceAdult = datamap[0].Contract[0].PriceAdult;
              } else {
                element.priceShow = se.gf.convertNumberToString(element.MinPrice);
              }
            } else {
              element.priceShow = se.gf.convertNumberToString(element.MinPrice ? element.MinPrice : element.AdultSalePrice);
            }
          }
        }
      })
    }
  }
  ngOnInit() {
    this.tourService.getObservableScrollToDepartureDiv().subscribe((data) => {
      if (data) {
        this.changeItemHeader(3);
      }
    })

  }

  goback() {
    if (this.tourService.backPage == 'hometour') {
      this.navCtrl.pop();
      this.tourService.backPage = '';
    } else {
      this.navCtrl.navigateBack('/tourlist');
      this.tourService.backPage = '';
    }

  }

  /***
   * Next trên slide
   */
  onSlideChange() {
    // this.sliderTab?.nativeElement.getActiveIndex().then(index => {
    //   this.coutslide = index + 1;
    // });
    this.coutslide = this.sliderTab?.nativeElement.swiper.activeIndex +1;
  }

  getDayName(date) {
    let thu = '';
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

  slidetabchange() {
    // this.sliderTab?.nativeElement.getActiveIndex().then(index => {
    //   this.tabTourRule = index + 1;
    // });
    this.tabTourRule = this.sliderTab?.nativeElement.swiper.activeIndex +1;
  }

  SelectTab(tabindex) {
    this.zone.run(() => {
      this.tabTourRule = tabindex;
      //this.sliderTab?.nativeElement.slideTo(tabindex - 1);
      this.sliderTab?.nativeElement.swiper.slideTo(tabindex - 1);
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
        if(!this.isChangeItemHeader){
          (window.document.getElementById('header2') as any).scrollIntoView({  block: 'center'  });
        }

        if ($('#content3') && $('#content3').length >0&& event.detail.currentY >= $('#content3')[0].offsetTop - 120) {
          $($('.item-tour-header')[2]).siblings().removeClass('item-header-actived');
          $($('.item-tour-header')[2]).addClass('item-header-actived');
          if(!this.isChangeItemHeader){
            (window.document.getElementById('header3')as any).scrollIntoView({  block: 'center'  });
          }
        }else if ($('#content3') && $('#content3').length >0 && $('#content2').length >0 && event.detail.currentY < $('#content3')[0].offsetTop - 120 && event.detail.currentY > $('#content2')[0].offsetTop - 120){
          $($('.item-tour-header')[1]).siblings().removeClass('item-header-actived');
          $($('.item-tour-header')[1]).addClass('item-header-actived');
          if(!this.isChangeItemHeader){
            (window.document.getElementById('header2')as any).scrollIntoView({  block: 'center'  });
          }
        }

          if ($('#content4') && $('#content4').length >0&& event.detail.currentY >= $('#content4')[0].offsetTop - 120) {
            $($('.item-tour-header')[3]).siblings().removeClass('item-header-actived');
            $($('.item-tour-header')[3]).addClass('item-header-actived');
            if(!this.isChangeItemHeader){
              (window.document.getElementById('header4')as any).scrollIntoView({  block: 'center'  });
            }
          }else if ($('#content4') && $('#content4').length >0 && $('#content3').length >0 && event.detail.currentY < $('#content4')[0].offsetTop - 120 && event.detail.currentY > $('#content3')[0].offsetTop - 120){
            $($('.item-tour-header')[2]).siblings().removeClass('item-header-actived');
            $($('.item-tour-header')[2]).addClass('item-header-actived');
            if(!this.isChangeItemHeader){
              (window.document.getElementById('header3')as any).scrollIntoView({  block: 'center'  });
            }
          }

          if ($('#content5') && $('#content5').length >0&& event.detail.currentY >= $('#content5')[0].offsetTop - 120) {
            $($('.item-tour-header')[4]).siblings().removeClass('item-header-actived');
            $($('.item-tour-header')[4]).addClass('item-header-actived');
            if(!this.isChangeItemHeader){
              (window.document.getElementById('header5')as any).scrollIntoView({  block: 'center'  });
            }
          }else if ($('#content5') && $('#content5').length >0 && $('#content4').length >0 && event.detail.currentY < $('#content5')[0].offsetTop - 120 && event.detail.currentY > $('#content4')[0].offsetTop - 120){
            $($('.item-tour-header')[3]).siblings().removeClass('item-header-actived');
            $($('.item-tour-header')[3]).addClass('item-header-actived');
            if(!this.isChangeItemHeader){
              (window.document.getElementById('header4')as any).scrollIntoView({  block: 'center'  });
            }
          }

          if ($('#content6') && $('#content6').length >0&& event.detail.currentY >= $('#content6')[0].offsetTop - 120) {
            $($('.item-tour-header')[5]).siblings().removeClass('item-header-actived');
            $($('.item-tour-header')[5]).addClass('item-header-actived');
            if(!this.isChangeItemHeader){
              (window.document.getElementById('header6')as any).scrollIntoView({  block: 'center'  });
            }
          }else if ($('#content6') && $('#content6').length >0 && $('#content5').length >0&& event.detail.currentY < $('#content6')[0].offsetTop - 120 && event.detail.currentY > $('#content5')[0].offsetTop - 120){
            $($('.item-tour-header')[4]).siblings().removeClass('item-header-actived');
            $($('.item-tour-header')[4]).addClass('item-header-actived');
            if(!this.isChangeItemHeader){
              (window.document.getElementById('header5')as any).scrollIntoView({  block: 'center'  });
            }
          }

          if ($('#divReview') && $('#divReview').length >0&& event.detail.currentY >= $('#divReview')[0].offsetTop - 120) {
            $($('.item-tour-header')[6]).siblings().removeClass('item-header-actived');
            $($('.item-tour-header')[6]).addClass('item-header-actived');
            if(!this.isChangeItemHeader){
              (window.document.getElementById('header7')as any).scrollIntoView({  block: 'center'  });
            }
          }else if ($('#divReview') && $('#divReview').length >0 && $('#content6').length >0&& event.detail.currentY < $('#divReview')[0].offsetTop - 120 && event.detail.currentY > $('#content6')[0].offsetTop - 120){
            $($('.item-tour-header')[5]).siblings().removeClass('item-header-actived');
            $($('.item-tour-header')[5]).addClass('item-header-actived');
            if(!this.isChangeItemHeader){
              (window.document.getElementById('header6')as any).scrollIntoView({  block: 'center'  });
            }
          }

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
    var se = this;
    if (index) {
      $($('.item-tour-header')[index - 1]).siblings().removeClass('item-header-actived');
      $($('.item-tour-header')[index - 1]).addClass('item-header-actived');

      setTimeout(() => {
        if (index != 7) {
          (window.document.getElementById('header' + index)as any).scrollLeft = parseInt($("#header" + index)[0].offsetLeft.toString())
          $('#header' + index).animate({ 'scrollLeft': $('#header' + index).position().left + 220 }, 500);
          //this.scrollYArea.scrollToPoint(0, $('#content'+index).position().top +50, 350);
          if ($('#content' + index) && $('#content' + index).length > 0) {
            se.isChangeItemHeader = true;
            setTimeout(()=>{
              (window.document.getElementById('content' + index)as any).scrollIntoView({ behavior: 'smooth', block: 'center' });
            },200)

            setTimeout(()=>{
              se.isChangeItemHeader = false;
            },1000)
            
          }

        } else {
          this.expandReview(1);
        }

        if ($('.div-item').hasClass('scroll-horizontal')) {
          this.changeStyleHeader();
        }
      }, 50)
    }
  }

  changeStyleHeader() {
    let se = this;
    if ($('.div-item').hasClass('scroll-horizontal')) {
      $('.div-item').removeClass('scroll-horizontal');
      //$('.item-tour-header').removeClass('item-scroll-horizontal');
    } else {
      $('.div-item').addClass('scroll-horizontal');
      //$('.item-tour-header').addClass('item-scroll-horizontal');
    }
  }

  showDepartureCalendar(itemdeparture) {
    if (!this.loaddeparturedone) {
      this.gf.showToastWarning('Đang tải dữ liệu, vui lòng chờ trong giây lát!');
      return;
    }
    if (itemdeparture) {
      this.tourService.itemDepartureCalendar = itemdeparture;
      this.tourService.hasDeparture = true;
    }
    if (!this.tourService.departuresItemList || this.tourService.departuresItemList.length == 0) {
      return;
    }
    this.tourService.itemDetail = this.itemDetail;

    this.navCtrl.navigateForward('/tourdeparturecalendar');

  }

  async imgreview(arrimgreview, indeximgreview, CustomerName, DateStayed) {
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

  expandDeparture(value) {
    if (value == 1) {
      var divCollapse = $('.div-wrap-departure.div-collapse');
      if (divCollapse && divCollapse.length > 0) {
        divCollapse.removeClass('div-collapse').addClass('div-expand');
      }
      this.expanddivdepature = true;
      //this.scrollToTopGroup(1);
    } else {
      var divCollapse = $('.div-wrap-departure.div-expand');
      if (divCollapse && divCollapse.length > 0) {
        divCollapse.removeClass('div-expand').addClass('div-collapse');
      }

      this.expanddivdepature = false;
      this.scrollToTopGroup(2);
    }

  }

  expandReview(value) {
    if (value == 1) {
      var divCollapse = $('.div-item-review.div-collapse');
      if (divCollapse && divCollapse.length > 0) {
        divCollapse.removeClass('div-collapse').addClass('div-expand');
      }
      this.expanddivreview = true;
      this.scrollToTopGroupReview(1);
    } else {
      var divCollapse = $('.div-item-review.div-expand');
      if (divCollapse && divCollapse.length > 0) {
        divCollapse.removeClass('div-expand').addClass('div-collapse');
      }

      this.expanddivreview = false;
      this.scrollToTopGroupReview(2);
    }
  }


  scrollToTopGroup(value) {
    //scroll to top of group
    setTimeout(() => {
      var objHeight = value == 2 ? $('.div-departure') : $('.div-wrap-departure').last();
      if (objHeight && objHeight.length > 0) {
        var h = 0;
        h = value == 2 ? objHeight[0].offsetTop - 150 : objHeight[0].offsetTop - 50;
        if (this.scrollYArea) {
          this.scrollYArea.scrollToPoint(0, h, 500);
        }

      }
    }, 100)
  }

  scrollToTopGroupReview(value) {
    //scroll to top of group
    setTimeout(() => {
      var objHeight = $('.div-review');
      if (objHeight && objHeight.length > 0) {
        var h = 0;
        h = value == 2 ? objHeight[0].offsetTop - 200 : objHeight[0].offsetTop - 50;
        if (this.scrollYArea) {
          this.scrollYArea.scrollToPoint(0, h, 500);
        }

      }
    }, 100)
  }

  ionViewWillEnter() {
    this.departureDate = moment(this.tourService.checkInDate).format('DD/MM/YYYY');
    this.updateLikeStatus();
  }

  async showSlideImage(idx) {
    if (!this.listSlides || this.listSlides.length < 2) {
      return;
    }
    this.searchHotel.arrimgreview = this.listSlides;
    this.searchHotel.indexreviewimg = idx;
    this.searchHotel.cusnamereview = '';
    this.searchHotel.datereview = '';
    this.searchHotel.tourDetailName = this.itemDetail.Name;
    this.searchHotel.openFromTopReviewList = false;
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: HotelreviewsimagePage,
      });
    modal.present();
  }

  async showFullScreen() {
    this.searchHotel.tourDetailName = this.itemDetail.Name;
    this.searchHotel.trustedVideoUrl = this.itemDetail.trustedVideoUrl;
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: HotelreviewsvideoPage,
      });
    modal.present();
  }
  showDetail(item) {
    var se = this;
    se.tourService.tourDetailId = item.Id;
    se.tourService.backPage = 'hometour';
    se.itemDetail = null;
    if (se.tourService.tourDetailId) {

      se.loaddata();

    }
  }
  likeItem() {
    var se = this;

    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.zone.run(() => {
          setTimeout(() => {
            se.itemlike = true;
          }, 10)
        })
        var text = "Bearer " + auth_token;
        let headers =
        {
          authorization: text
        }
        let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/AddFavouriteTour';
        se.gf.RequestApi('POST', strUrl, headers, { tourId: se.tourService.tourDetailId }, 'tour', 'likeItem').then((data) => {
          se.TourIDLike = '';
        })

      }
      else {
        se.TourIDLike = se.tourService.tourDetailId;
        se.valueGlobal.logingoback = '/tourdetail'
        se.navCtrl.navigateForward('/login');
      }
    });
    //google analytic
    se.gf.googleAnalytion('hoteldetail', 'likeitem', '');
  }
  /*** Set unlike item
   * PDANH  29/01/2018
   */
  unlikeItem() {
    var se = this;
    se.zone.run(() => {
      setTimeout(() => {
        se.itemlike = false;
      }, 10)
    })
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        let headers =
        {
          authorization: text
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteTour';
        se.gf.RequestApi('POST', strUrl, headers, { tourId: se.tourService.tourDetailId }, 'tour', 'unlikeItem').then((data) => {
        });
      }
    });
    //google analytic
    se.gf.googleAnalytion('hoteldetail', 'unlikeitem', '');
  }
  share() {
    console.log(this.itemDetail.TourDetailUrl)
    this.socialSharing.share('', '', '', this.itemDetail.TourDetailUrl).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
  updateLikeStatus() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {

        var text = "Bearer " + auth_token;
        let headers =
        {
          'postman-token': '89692e55-6555-1572-db28-4becc311f0ba',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteTourByUser';
        se.gf.RequestApi('GET', strUrl, headers, {}, 'tour', 'GetFavouriteTourByUser').then((data) => {

          se.zone.run(() => {
            se.dataListLike = data;
            let like = false;
            //Kiểm tra có trong list like không
            if (se.dataListLike.length > 0) {
              like = se.checkItemLiked(se.tourService.tourDetailId) == 1 ? true : false;
            }
            se.itemlike = like;
          });
        })
      }
      else {
        se.itemlike = false;
      }
    });

  }
  checkItemLiked(id) {
    var co = 0;
    id = parseInt(id);
    if (id) {
      for (let i = 0; i < this.dataListLike.length; i++) {
        if (this.dataListLike.indexOf(id) != -1) {
          co = 1;
          break;
        }
      }
    }

    return co;
  }
}