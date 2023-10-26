import { SearchHotel, ValueGlobal } from '../../providers/book-service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import * as moment from 'moment';
import { NavController, ModalController, Platform,AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { flightService } from '../../providers/flightService';
import { GlobalFunction } from '../../providers/globalfunction';
import { FlightquickbackPage } from '../../flightquickback/flightquickback.page';
import { CustomAnimations } from '../../providers/CustomAnimations';
import { ticketService } from 'src/app/providers/ticketService';
import { voucherService } from 'src/app/providers/voucherService';
import { tourService } from 'src/app/providers/tourService';
import { ActivityService } from '../../providers/globalfunction';
@Component({
  selector: 'app-ticketpaymentdone',
  templateUrl: './ticketpaymentdone.page.html',
  styleUrls: ['./ticketpaymentdone.page.scss'],
})
export class TicketPaymentDonePage implements OnInit {
  code = ""; startdate; enddate; _email = ""; stt; total; text; isDinner
  bookingCode: any='IVIVUVE007';
  bookingFlight: any;
  pacificVNA: string = "";
  pacificVNAReturn: string = "";
  listDiChung: any = "";
  checkInDisplayDC: string;
  checkOutDisplayDC: string;
  checkreview;
  paymentDate: string;
  experienceName: any;
  constructor(private activatedRoute: ActivatedRoute, public _flightService: flightService,
    private navCtrl: NavController, public searchhotel: SearchHotel, public storage: Storage, private zone: NgZone,
    public valueGlobal: ValueGlobal,
    public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private _platform: Platform, public alertCtrl: AlertController,
    public ticketService: ticketService,
    public tourService: tourService,
    public _voucherService: voucherService, public activityService: ActivityService) {
      this.storage.get('checkreview').then(checkreview => {
        if (checkreview == 0) {
          this.checkreview = 0;
        } else {
          this.checkreview = checkreview;
        }
      })
      var ti = new Date();
      this.paymentDate= moment(ti).add(1, 'hours').format('HH:mm, DD/MM/YYYY');

  }


  ngOnInit() {
    this.stt = this.activatedRoute.snapshot.paramMap.get('stt');
    if (this.stt==0) {
     this.experienceName = this.ticketService.itemTicketDetail.experienceName;
    }else{
      this.experienceName = this.activityService.objPaymentMytrip.trip.hotel_name;
    }
  }

  async ionViewWillEnter() {
    this.gf.hideLoading();
    this.gf.logEventFirebase(this.ticketService.gaPaymentType,this.ticketService, 'ticketpaymentdone', 'purchase', 'Ticket');
  }

  next() {
    this.gf.hideLoading();
    this.tourService.itemPaymentDone.emit(3);
    this.valueGlobal.backValue = "hometicket";
    //this.ticketService.BookingTourMytrip = null;
    // 
    // this._flightService.bookingCodePayment = this.bookingCode;
    // this._flightService.bookingSuccess = true;
    
    this.navCtrl.navigateBack('/app/tabs/tab1');
  }
  

  async showQuickBack() {
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: FlightquickbackPage,
        componentProps: {
          aParameter: true,
        },
        showBackdrop: true,
        backdropDismiss: true,
        // enterAnimation: CustomAnimations.iosCustomEnterAnimation,
        // leaveAnimation: CustomAnimations.iosCustomLeaveAnimation,
        cssClass: "modal-flight-quick-back",
      });
    modal.present();
  }
  goMyTrip(){
    this._flightService.itemMenuFlightClick.emit(2);
    this.navCtrl.navigateBack(['/app/tabs/tab3']);
  }
  openZalo(){
    window.open('https://zalo.me/3888313238733373810');
  }
}
