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
import { tourService } from 'src/app/providers/tourService';


@Component({
  selector: 'app-ticketpaymentfail',
  templateUrl: './ticketpaymentfail.page.html',
  styleUrls: ['./ticketpaymentfail.page.scss'],
})
export class TicketpaymentfailPage implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, public _flightService: flightService,
    private navCtrl: NavController, public searchhotel: SearchHotel, public storage: Storage, private zone: NgZone,
    public valueGlobal: ValueGlobal,
    public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private _platform: Platform, public alertCtrl: AlertController,public ticketService: ticketService,
    public tourService: tourService) { }

  ngOnInit() {

  }

  async ionViewWillEnter() {
    this.gf.hideLoading();
  }

  next() {
    this.gf.hideLoading();
    this.tourService.itemPaymentDone.emit(3);
    this.valueGlobal.backValue = "hometicket";
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
  openZalo(){
    window.open('https://zalo.me/3888313238733373810');
  }

}
