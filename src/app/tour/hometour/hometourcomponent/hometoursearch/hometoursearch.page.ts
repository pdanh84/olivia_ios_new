import { Component, OnInit, ViewChild, HostListener, NgZone, Input } from '@angular/core';
import { NavController, ModalController, ToastController, ActionSheetController,  Platform } from '@ionic/angular';
import { GlobalFunction } from './../../../../providers/globalfunction';
import * as $ from 'jquery';
import { C } from './../../../../providers/constants';
import { OverlayEventDetail } from '@ionic/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

import { SearchHotel } from 'src/app/providers/book-service';
import { tourService } from 'src/app/providers/tourService';
import { SelectDateRangePage } from 'src/app/selectdaterange/selectdaterange.page';
// import { SelectDateRangePage } from 'src/app/selectdaterange/selectdaterange.page';

@Component({
  selector: 'app-hometoursearch',
  templateUrl: './hometoursearch.page.html',
  styleUrls: ['./hometoursearch.page.scss'],
})
export class HomeTourSearchPage implements OnInit {
  @Input('itemSearch') itemSearch;
  cofdate= 0;
  itemSearchDepature: any;
  itemHot: any;
  myCalendar: HTMLIonModalElement;
  allowclickcalendar: boolean=true;
  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private zone: NgZone,
    public storage: Storage,
    private actionsheetCtrl: ActionSheetController,
    private platform: Platform,
    public searchhotel: SearchHotel,
    public tourService: tourService) {
  }

  ngOnInit(){
    this.tourService.itemSearchTour.subscribe((data) => {
      if(data){
        this.zone.run(()=> {
          this.itemSearch = this.tourService.input;
          this.storage.get('listSearchTour').then((data) => {
            if(data && data.length >0) {
              if(data.length < 3) {
                data = data.push(this.tourService.input);
                this.storage.remove('listSearchTour').then(()=> {
                  this.storage.set('listSearchTour',data);
                })
              }else {
                data = [...data.splice(0, 1)];
                data = data.push(this.tourService.input);
                this.storage.remove('listSearchTour').then(()=> {
                  this.storage.set('listSearchTour',data);
                })
              }
            }else{
              let list:any = [];
              list.push(this.tourService.input);
              this.storage.set('listSearchTour',list);
            }
          })
        })
      }
    })

    this.tourService.itemSearchDeparture.subscribe((data) => {
      if(data){
        this.zone.run(()=> {
          this.itemSearchDepature = this.tourService.itemDeparture;
          this.tourService.itemSearchDepature = this.tourService.itemDeparture;
        })
      }
    })
    
    if(!this.tourService.checkInDate){
      this.tourService.checkInDate = moment(new Date()).add(1, 'days');
      this.tourService.cindisplay = moment(this.gf.getCinIsoDate(this.tourService.checkInDate)).format("DD-MM-YYYY");
      this.tourService.datecin = new Date(this.gf.getCinIsoDate(this.tourService.checkInDate));
      this.getCinCoutDayName();
    }
  }

  change() {
    this.navCtrl.navigateForward('/searchregion');
  }

  search(){
    if(!this.itemSearch){
      this.gf.showToastWarning('Vui lòng chọn điểm đến!');
      return;
    }
    if(this.itemSearch && this.itemSearch.Id && this.itemSearch.TourCode){
      this.tourService.tourDetailId = this.itemSearch.Id;
      this.tourService.backPage = 'hometour';
      this.navCtrl.navigateForward('/tourdetail');
    }else {
      this.tourService.itemSearchDestination = this.itemSearch;
      this.tourService.itemShowList = null;
      this.navCtrl.navigateForward('/tourlist');
    }
    
  }

  opendeparture() {
    this.navCtrl.navigateForward('/searchdeparture');
  }

  async openPickupCalendar(){
    let se = this;
    if(!se.allowclickcalendar){
      return;
    }
    se.tourService.itemDepartureCalendar = null;
    se.searchhotel.formChangeDate = 10;
    se.tourService.departures = [];
    let modal = await se.modalCtrl.create({
      component: SelectDateRangePage,
        animated: true,
        mode: 'ios'
      });
  
    modal.present();
      const event: any = await modal.onDidDismiss();
      const date = event.data;
      if (event.data) {
         se.zone.run(() => {
           se.tourService.checkInDate = moment(this.gf.getCinIsoDate(event.data.from)).format('YYYY-MM-DD');
           se.tourService.datecin = new Date(this.gf.getCinIsoDate(event.data.from));
           se.tourService.cindisplay = moment(this.gf.getCinIsoDate(se.tourService.datecin)).format("DD-MM-YYYY");
           se.getCinCoutDayName();
         })
      }

      
  }
   /**
   * Hàm bắt sự kiện click chọn ngày trên lịch bằng jquery
   * @param e biến event
   */
    async clickedElement(e: any) {
      var obj: any = e.currentTarget;
      if ($(obj).hasClass('on-selected')) {
        if (this.modalCtrl) {
          let fday: any;
          let tday: any;
          var monthenddate: any;
          var yearenddate: any;
          var monthstartdate: any;
          var yearstartdate: any;
          var objTextMonthEndDate: any;
          var objTextMonthStartDate: any;
          if ( $('.days-btn.lunarcalendar.on-selected > p')[0]) {
            fday= $('.days-btn.lunarcalendar.on-selected > p')[0].innerText;
          } else {
            fday = $('.on-selected > p')[0].textContent;
            tday = fday;
            objTextMonthStartDate = $('.on-selected')?.closest('.month-box')?.children()[0]?.textContent?.replace('Tháng ','');
            objTextMonthEndDate = objTextMonthStartDate;
          }
          if (
            objTextMonthEndDate &&
            objTextMonthEndDate.length > 0 &&
            objTextMonthStartDate &&
            objTextMonthStartDate.length > 0
          ) {
            monthstartdate = objTextMonthStartDate.split("/")[0];
            yearstartdate = objTextMonthStartDate.split("/")[1];
            monthenddate = objTextMonthEndDate.split("/")[0];
            yearenddate = objTextMonthEndDate.split("/")[1];
            var fromdate = new Date(yearstartdate, monthstartdate - 1, fday);
            var todate = new Date(yearenddate, monthenddate - 1, tday*1 +1);
            if (fromdate && todate && moment(todate).diff(fromdate, "days") >= 0) {
              var se = this;
              setTimeout(() => {
                se.modalCtrl.dismiss();
              }, 300);
  
            
              se.zone.run(() => {
                se.tourService.checkInDate = moment(this.gf.getCinIsoDate(fromdate)).format("YYYY-MM-DD");
                se.tourService.cindisplay = moment(this.gf.getCinIsoDate(fromdate)).format("DD-MM-YYYY");
              });
              
            }
          }
        }
      }
    }
  closecalendar(){
    this.modalCtrl.dismiss();
  }
  getCinCoutDayName() {
    if (this.tourService.datecin) {
      this.tourService.cinthu = moment(this.tourService.datecin).format("dddd");
      switch (this.tourService.cinthu) {
        case "Monday":
          this.tourService.cinthu = "Thứ 2";
          break;
        case "Tuesday":
          this.tourService.cinthu = "Thứ 3";
          break;
        case "Wednesday":
          this.tourService.cinthu = "Thứ 4";
          break;
        case "Thursday":
          this.tourService.cinthu = "Thứ 5";
          break;
        case "Friday":
          this.tourService.cinthu = "Thứ 6";
          break;
        case "Saturday":
          this.tourService.cinthu = "Thứ 7";
          break;
        default:
          this.tourService.cinthu = "Chủ nhật";
          break;
      }
    }
  }
}
