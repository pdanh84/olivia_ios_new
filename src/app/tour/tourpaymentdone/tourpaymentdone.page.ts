import { SearchHotel, ValueGlobal } from './../../providers/book-service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import * as moment from 'moment';
import { NavController, ModalController, Platform,AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { flightService } from '../../providers/flightService';
import { GlobalFunction } from '../../providers/globalfunction';
import { FlightquickbackPage } from '../../flightquickback/flightquickback.page';
import { CustomAnimations } from '../../providers/CustomAnimations';
import { tourService } from 'src/app/providers/tourService';
import { voucherService } from 'src/app/providers/voucherService';

@Component({
  selector: 'app-tourpaymentdone',
  templateUrl: './tourpaymentdone.page.html',
  styleUrls: ['./tourpaymentdone.page.scss'],
})
export class TourPaymentDonePage implements OnInit {
  code = ""; startdate; enddate; _email = ""; stt; total; text; isDinner
  bookingCode: any;
  bookingFlight: any;
  pacificVNA: string = "";
  pacificVNAReturn: string = "";
  listDiChung: any = "";
  checkInDisplayDC: string;
  checkOutDisplayDC: string;
  checkreview;
  constructor(private activatedRoute: ActivatedRoute, public _flightService: flightService,
    private navCtrl: NavController, public searchhotel: SearchHotel, public storage: Storage, private zone: NgZone,
    public valueGlobal: ValueGlobal,
    public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private _platform: Platform, public alertCtrl: AlertController,
    public tourService: tourService,
    public _voucherService: voucherService) {
      this.storage.get('checkreview').then(checkreview => {
        if (checkreview == 0) {
          this.checkreview = 0;
        } else {
          this.checkreview = checkreview;
        }
      })

      if(tourService.itemDetail) {
        if(this.tourService.discountPrice){
          this.total = this.tourService.discountPrice;
        }else{
          this.total = tourService.totalPriceStr;
        }
      }
  }


  ngOnInit() {

  }

  async ionViewWillEnter() {
    this.gf.hideLoading();
    if(this.tourService.BookingTourMytrip) {
      this.bookingCode = this.tourService.BookingTourMytrip.booking_id;
      this.total = this.gf.convertNumberToString(this.tourService.BookingTourMytrip.amount_after_tax);
    }else{
      this.bookingCode = this.tourService.tourBookingCode;
      if(this.tourService.discountPrice){
        this.total = this.gf.convertNumberToString(this.tourService.discountPrice);
      }else{
        this.total = this.gf.convertNumberToString(this.tourService.totalPrice);
      }
    }

    let se = this;
    se.tourService.totalPrice = this.total;
    se.gf.logEventFirebase(se.tourService.gaPaymentType,se.tourService, 'tourpaymentdone', 'purchase', 'Tours');
    //se.gf.googleAnalytionCustom('ecommerce_purchase', { item_category: 'tour', start_date: se.tourService.DepartureDate, end_date: se.searchhotel.CheckOutDate, origin: this.tourService.itemSearchDestination ? this.tourService.itemSearchDestination.Name || this.tourService.itemSearchDestination.RegionCode : '', destination: se.tourService.itemDetail.Destinations, value: se.tourService.tourTotal, currency: "VND" });
    se._voucherService.publicClearVoucherAfterPaymentDone(1);
    se.tourService.promocode = "";
    se.tourService.discountpromo = 0;
  }

  next() {
    this.gf.hideLoading();
    this.tourService.itemPaymentDone.emit(true);
    this.valueGlobal.backValue = "hometour";
    this.tourService.BookingTourMytrip = null;
    // this._flightService.itemMenuFlightClick.emit(2);
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
        //enterAnimation: CustomAnimations.iosCustomEnterAnimation,
        //leaveAnimation: CustomAnimations.iosCustomLeaveAnimation,
        cssClass: "modal-flight-quick-back",
      });
    modal.present();
  }

}
