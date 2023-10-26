import { Component, OnInit, ViewChild, HostListener, NgZone, Input } from '@angular/core';
import { NavController, ModalController, ToastController, ActionSheetController,  Platform } from '@ionic/angular';
import { GlobalFunction } from './../../providers/globalfunction';
import { Storage } from '@ionic/storage';
import { ticketService } from 'src/app/providers/ticketService';

@Component({
  selector: 'app-ticketservicedetail',
  templateUrl: './ticketservicedetail.page.html',
  styleUrls: ['./ticketservicedetail.page.scss'],
})
export class TicketServiceDetailPage implements OnInit {
  itemSearch: any;
  itemTicketService: any;
  
  constructor(private navCtrl: NavController, public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private zone: NgZone,
    public storage: Storage,
    public ticketService: ticketService) {
      if(ticketService.itemTicketService){
        this.itemTicketService = this.ticketService.itemTicketService;
      }
  }
  goback(){
    this.navCtrl.pop();
  }
  ngOnInit(){
   
  }
 
}
