import { Component, NgZone, OnInit } from '@angular/core';
import { NavController,LoadingController,AlertController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { C } from '../../providers/constants';
import {  ActivityService, GlobalFunction} from '../../providers/globalfunction';
import { ActivatedRoute } from '@angular/router';
import { MytripService } from 'src/app/providers/mytrip-service.service';
import * as moment from 'moment';
import { flightService } from 'src/app/providers/flightService';
import { SearchHotel, ValueGlobal } from 'src/app/providers/book-service';
import * as $ from 'jquery';
import { SelectDateRangePage } from 'src/app/selectdaterange/selectdaterange.page';

@Component({
  selector: 'app-orderrequestchangeflight',
  templateUrl: './orderrequestchangeflight.page.html',
  styleUrls: ['./orderrequestchangeflight.page.scss'],
})
export class OrderRequestChangeFlightPage implements OnInit {
  listSupport: any[];
  allowBuyMoreLuggage: any= true;
    itemdepart: any;
    itemreturn: any;
    trip: any;
  myCalendar: any;
  allowclickcalendar: any=true;
  showlowestprice: any;
  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController, 
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public activityService: ActivityService , 
    private activatedRoute: ActivatedRoute,
    public _mytripservice: MytripService,
    private zone: NgZone,
    public gf: GlobalFunction,
    public _flightService: flightService,
    public valueGlobal: ValueGlobal,
    private modalCtrl: ModalController,
    public searchhotel: SearchHotel) { 
        this.trip = this.activityService.objPaymentMytrip.trip;
        this.itemdepart = this.activityService.objPaymentMytrip.trip.itemdepart;
        this.itemreturn = this.activityService.objPaymentMytrip.trip.itemreturn;
        if(this.itemdepart){
          this.itemdepart.allowChangeFlight = this.trip.departChangeDepartTime;
          if(this.itemdepart.allowChangeFlight) {
            this.itemdepart.allowChangeFlight = this.trip.itemdepart.checkDepartValidTime;
            if(this.itemdepart.allowChangeFlight){
              this.itemdepart.allowChangeFlight = !(this.itemdepart.passengers && this.itemdepart.passengers.some((p) => { return (!p.isInfant && ((p.giaTienHanhLy != '0' && p.hanhLy != '0kg') || (p.seatNumber && p.seatPrice)) )}) );
            }
          }
        }
        if(this.itemreturn){
          this.itemreturn.allowChangeFlight = this.trip.returnChangeDepartTime;
          if(this.itemreturn.allowChangeFlight) {
            this.itemreturn.allowChangeFlight = this.trip.itemreturn.checkReturnValidTime;
          }
          if(this.itemreturn.allowChangeFlight){
            this.itemreturn.allowChangeFlight = !(this.itemreturn.passengers && this.itemreturn.passengers.some((p) => { return (!p.isInfant && ((p.giaTienHanhLy != '0' && p.hanhLy != '0kg') || (p.seatNumber && p.seatPrice)) )}) );
          }
        }
        this.trip.adult =0;
        this.trip.child =0;
        this.trip.infant =0;
        this.trip.bookingsComboData[0].passengers.forEach((elementlug, index) => {
          let yearold = 18;
          if (elementlug.dob) {
            let arr = [];
            if (elementlug.dob && elementlug.dob.indexOf('/') != -1) {
              arr = elementlug.dob.split('/');
            }
            else if (elementlug.dob && elementlug.dob.indexOf('-') != -1) {
              arr = elementlug.dob.split('-');
            }

            if (arr.length > 0) {
              let newdob = new Date(Number(arr[2]), Number(arr[1] - 1), Number(arr[0]));
              yearold = moment(this.trip.checkInDate).diff(moment(newdob), 'years');
            }

            elementlug.isAdult = yearold > 12 ? true : false;
            if (elementlug.isAdult) {
              this.trip.adult += 1;
            } else {
              if (!this.trip.textChildDisplay) {
                this.trip.textChildDisplay = "(";
              }
              if (yearold < 2) {
                this.trip.infant += 1;
               
              } else {
                this.trip.child += 1;
              }
            }

          }else {
            this.trip.adult += 1;
          }

        });
  }

  ngOnInit() {

  }

  goback() {
  
    this.navCtrl.navigateBack('/orderrequestsupport');
  }

  clickChangeFlight(type){
    let url ='';
    if((type == 1 && !this.itemdepart.allowChangeFlight) || (type ==2 && !this.itemreturn.allowChangeFlight)){
      return;
    }else if(type ==3 && (!this.itemdepart.allowChangeFlight || !this.itemreturn.allowChangeFlight)){
      return;
    }
    //this.showChangeDate();
    this.activityService.typeChangeFlight = type;
    //this.navCtrl.navigateForward('/orderrequestsearchflight');
    
   
    
  }

  async showAlertChangeDate(msg){
    var se = this;
    let alert = await this.alertCtrl.create({
      message: msg,
      cssClass: "cls-alert-searchresult",
      backdropDismiss: false,
      buttons: [
      {
        text: 'OK',
        role: 'OK',
        handler: () => {
          se.navCtrl.navigateForward('/orderrequestsearchflight');
          alert.dismiss();
        }
      },
      {
        text: 'Hủy',
        role: 'Cancel',
        handler: () => {
          alert.dismiss();
        }
      }
    ]
  });
  alert.present();
  }


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
  
          //let objsearch = this._flightService.objSearch;
          // if(this.trip.itemreturn && this.trip.itemreturn.airlineName.toLowerCase().indexOf('cathay') == -1 ){
          //   if ($(obj.parentNode).hasClass('endSelection')) {
          //     if ( $('.days-btn.lunarcalendar.on-selected > p')[0]) {
          //       fday= $('.days-btn.lunarcalendar.on-selected > p')[0].innerText;
          //     } else {
          //       fday = $('.on-selected > p')[0].textContent;
          //     }
          //     if ($('.days.endSelection .days-btn.lunarcalendar > p')[0]) {
          //       tday = $('.days.endSelection .days-btn.lunarcalendar > p')[0].innerText; 
          //     } else {
          //       //tday = $(obj)[0].textContent;
          //       tday = $('.days.endSelection .days-btn > p')[0].innerText;
          //     }
          //     objTextMonthStartDate = $('.on-selected')?.closest('.month-box')?.children()[0]?.textContent?.replace('Tháng ','');
          //     objTextMonthEndDate = $(obj)?.closest('.month-box')?.children()[0]?.textContent?.replace('Tháng ','');
          //   } else {
          //     if ($('.days-btn.lunarcalendar.on-selected > p')[0]) {
          //       fday =$('.days-btn.lunarcalendar.on-selected > p')[0].innerText;
          //     }
          //     else{
          //       //fday = $(obj)[0].textContent;
          //       fday = $(obj)[0].children[0].textContent
          //     }
          //     if ($('.days.endSelection .days-btn.lunarcalendar > p')[0]) {
          //       tday = $('.days.endSelection .days-btn.lunarcalendar > p')[0].innerText;
          //     }
          //     else{
          //       //tday = $('.endSelection').children('.days-btn')[0].textContent;
          //       tday = $('.days.endSelection .days-btn > p')[0].innerText;
          //     }
          //     objTextMonthStartDate = $(obj)?.closest('.month-box')?.children()[0]?.textContent?.replace('Tháng ','');
          //     objTextMonthEndDate = $('.endSelection')?.closest('.month-box')?.children()[0]?.textContent?.replace('Tháng ','');
          //   }
          // }else{
              if ( $('.days-btn.lunarcalendar.on-selected > p')[0]) {
                fday= $('.days-btn.lunarcalendar.on-selected > p')[0].innerText;
              } else {
                //fday = $('.on-selected')[0].textContent;
                fday = $('.on-selected > p')[0].textContent;
              }
              tday = fday;
              objTextMonthStartDate = $('.on-selected')?.closest('.month-box')?.children()[0]?.textContent?.replace('Tháng ','');
              objTextMonthEndDate = objTextMonthStartDate;
          //}
  
          if (
            objTextMonthEndDate &&
            objTextMonthEndDate.length > 0 &&
            objTextMonthStartDate &&
            objTextMonthStartDate.length > 0
          ) {
            monthstartdate = objTextMonthStartDate.trim().split(",")[0];
            yearstartdate = objTextMonthStartDate.trim().split(",")[1];
            monthenddate = objTextMonthEndDate.trim().split(",")[0];
            yearenddate = objTextMonthEndDate.trim().split(",")[1];
  
            var fromdate = new Date(yearstartdate, monthstartdate - 1, fday);
            var todate = new Date(yearenddate, monthenddate - 1, tday);
            let diffday =moment(todate).diff(fromdate, "days");
            var se = this;
            let allowseach = (diffday >=0 ? true : false);
            if (fromdate && todate && allowseach) {
              se._flightService.itemFlightCache.checkInDate = moment(fromdate).format('YYYY-MM-DD');
              se._flightService.itemFlightCache.checkOutDate = moment(todate).format('YYYY-MM-DD');
              setTimeout(() => {
                se.modalCtrl.dismiss({from: fromdate, to: todate});
                se.showAlertChangeDate(`Chuyến bay mới đổi qua ngày ${this.activityService.typeChangeFlight ==1 ? moment(fromdate).format('DD-MM-YYYY') : moment(todate).format('DD-MM-YYYY')}. Quý khách muốn tiếp tục?`);
              }, 300);
  
            }
          }
        }
      }
    }
    closecalendar(){
      this.modalCtrl.dismiss();
      
    }
}