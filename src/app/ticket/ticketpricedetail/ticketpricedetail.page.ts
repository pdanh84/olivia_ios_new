import { Component, OnInit, ViewChild, HostListener, NgZone, Input } from '@angular/core';
import { NavController, ModalController, ToastController, ActionSheetController,  Platform } from '@ionic/angular';
import { GlobalFunction } from '../../providers/globalfunction';
import { Storage } from '@ionic/storage';
import { ticketService } from 'src/app/providers/ticketService';
import { SearchHotel } from 'src/app/providers/book-service';
import { voucherService } from 'src/app/providers/voucherService';

@Component({
  selector: 'app-ticketpricedetail',
  templateUrl: './ticketpricedetail.page.html',
  styleUrls: ['./ticketpricedetail.page.scss'],
})
export class TicketPriceDetailPage implements OnInit {


  totalPriceStr: Promise<boolean>;
  avatarLink: any;

 
  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private zone: NgZone,
    private storage: Storage,
    public ticketService: ticketService,
    public searchhotel: SearchHotel,public _voucherService: voucherService) {
    // if (this.ticketService.itemTicketDetail.avatarLink) {
    //   this.avatarLink=this.ticketService.itemTicketDetail.avatarLink;
    // }else{
    //   this.avatarLink=this.ticketService.itemTicketDetail.expAvatar;
    // }
     
  }
  goback(){
    this.navCtrl.back();
  }
  ngOnInit(){
  //  this.getSummary();
  }
  goTicketinfo(){
    this.navCtrl.navigateForward('ticketinfo/'+this.ticketService.itemTicketService.objbooking.bookingCode);
  }
  
}
