import { Component, OnInit, NgZone, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NavController, Platform, LoadingController, IonContent, ModalController,ToastController } from '@ionic/angular';
import { C } from '../providers/constants';
import * as moment from 'moment';
import * as $ from 'jquery';
import  Litepicker  from 'litepicker';
import 'litepicker/dist/plugins/mobilefriendly';
import {ValueGlobal, SearchHotel, Bookcombo} from '../providers/book-service';
import { ActivityService, GlobalFunction } from '../providers/globalfunction';
import { flightService } from '../providers/flightService';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-selectdateofbirth',
  templateUrl: './selectdateofbirth.page.html',
  styleUrls: ['./selectdateofbirth.page.scss'],
})
export class SelectDateOfBirthPage implements OnInit {
  item: any;
  itemChange:any;
  constructor(private modalCtrl: ModalController, 
    public valueGlobal: ValueGlobal, 
    public searchhotel: SearchHotel,
    public gf: GlobalFunction,
    private navCtrl: NavController,
    public bookCombo: Bookcombo, private alertCtrl: ToastController,
    public activityService: ActivityService) {
      if(activityService.itemPax.isChangeBOD){
          activityService.itemPax.dateofbirth = activityService.itemPax.dateofbirth ? moment(activityService.itemPax.dateofbirth).format('YYYY-MM-DD') : null;
      }
      else if(activityService.itemPax.isChangeBODCombo){
        activityService.itemPax.BirthDay = activityService.itemPax.BirthDay ? moment(activityService.itemPax.BirthDay).format('YYYY-MM-DD') : null;
      }
      else{
        activityService.itemPax.passportExpireDate = activityService.itemPax.passportExpireDate ? moment(activityService.itemPax.passportExpireDate).format('YYYY-MM-DD') : null;
      }
      
      this.item = activityService.itemPax;
  }

  ngOnInit() {
   
  }

  cancel(){
      this.modalCtrl.dismiss();
  }

  ok(){
    if(this.activityService.itemPax.isChangeBOD){
      this.item.birdayDisplay = moment(this.item.dateofbirth).format("DD/MM/YYYY");
    }else if(this.activityService.itemPax.isChangeBODCombo){
      this.item.BirthDay = this.item.passportExpireDate;
      this.item.birdayDisplay = moment(this.item.passportExpireDate).format("DD/MM/YYYY");
    }else{
      this.item.passportExpireDateDisplay = moment(this.item.passportExpireDate).format("DD/MM/YYYY");
    }
    this.modalCtrl.dismiss({itempushback: this.item});
  }

      changeDate(event){
        if(event.detail.value){
          let _d = event.detail.value;
          this.itemChange = this.item;
          if(this.activityService.itemPax.isChangeBOD){
            this.itemChange.dateofbirth = _d;
            this.itemChange.birdayDisplay = moment(_d).format("DD/MM/YYYY");
          }else if(this.activityService.itemPax.isChangeBODCombo){
            this.itemChange.BirthDay = _d;
            this.itemChange.birdayDisplay = moment(_d).format("DD/MM/YYYY");
          }else{
            this.itemChange.passportExpireDate = _d;
            this.itemChange.passportExpireDateDisplay = moment(_d).format("DD/MM/YYYY");
          }
        }
      }
}
