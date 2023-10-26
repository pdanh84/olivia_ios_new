import { Component, OnInit, ViewChild, HostListener, NgZone } from '@angular/core';
import { NavController, ModalController, ToastController } from '@ionic/angular';
import { GlobalFunction } from '../../providers/globalfunction';
import * as $ from 'jquery';
import { C } from '../../providers/constants';
import { OverlayEventDetail } from '@ionic/core';
import { tourService } from '../../providers/tourService';

@Component({
  selector: 'app-tourmenufooter',
  templateUrl: './tourmenufooter.page.html',
  styleUrls: ['./tourmenufooter.page.scss'],
})

export class TourMenuFooterPage {
    menuindex:any = 1;
    countcart = 0;
    constructor(private navCtrl: NavController, public gf: GlobalFunction,
        private modalCtrl: ModalController,
        private toastCtrl: ToastController,
        private zone: NgZone,
        public tourService: tourService) {

        }

        ngOnInit(){
          this.tourService.menuFooterClick.subscribe(data => {
            this.zone.run(()=>{
              this.menuindex = data;
            })
              
            })
      }

    menuFooterClick(menuindex){
        var se = this;
        se.zone.run(()=>{
            se.menuindex = menuindex;
            se.tourService.tabFoodIndex = menuindex;
            se.tourService.menuFooterClick.emit(menuindex);
        })
        
        if(menuindex == 1){
          $(".div-myorder").removeClass("cls-tab-visible").addClass("cls-tab-disabled");
          $(".div-notify").removeClass("cls-tab-visible").addClass("cls-tab-disabled");
          $(".div-account").removeClass("cls-tab-visible").addClass("cls-tab-disabled");

          $(".homefoodheader").removeClass("cls-tab-disabled").addClass("cls-tab-visible");
          $(".div-wraper-slide").removeClass("cls-disabled").addClass("cls-visible");
          $(".div-wraper-home").removeClass("cls-disabled").addClass("cls-visible");
          $(".div-home").removeClass("cls-tab-disabled").addClass("cls-tab-visible");
        }
        else if(menuindex == 2){
            $(".div-home").removeClass("cls-tab-visible").addClass("cls-tab-disabled");
            $(".div-notify").removeClass("cls-tab-visible").addClass("cls-tab-disabled");
            $(".div-account").removeClass("cls-tab-visible").addClass("cls-tab-disabled");
            $(".homefoodheader").removeClass("cls-tab-visible").addClass("cls-tab-disabled");

            setTimeout(()=>{
              $(".food-combo-detail-header").removeClass("cls-visible").addClass("cls-disabled");
              $(".div-wraper-slide").removeClass("cls-visible").addClass("cls-disabled");
              $(".div-myorder").removeClass("cls-tab-disabled").addClass("cls-tab-visible");
            },50);
            //se._mytripService.itemLoginUser.emit(1);
        }
        else if(menuindex == 3){
          $(".div-home").removeClass("cls-tab-visible").addClass("cls-tab-disabled");
          $(".div-myorder").removeClass("cls-tab-visible").addClass("cls-tab-disabled");
          $(".div-account").removeClass("cls-tab-visible").addClass("cls-tab-disabled");
          $(".homefoodheader").removeClass("cls-tab-visible").addClass("cls-tab-disabled");

          setTimeout(()=>{
            $(".food-combo-detail-header").removeClass("cls-visible").addClass("cls-disabled");
            $(".div-wraper-slide").removeClass("cls-visible").addClass("cls-disabled");
            $(".div-notify").removeClass("cls-tab-disabled").addClass("cls-tab-visible");
          },50)
        }
        else if(menuindex == 4){
          $(".div-home").removeClass("cls-tab-visible").addClass("cls-tab-disabled");
          $(".div-myorder").removeClass("cls-tab-visible").addClass("cls-tab-disabled");
          $(".div-notify").removeClass("cls-tab-visible").addClass("cls-tab-disabled");
          $(".homefoodheader").removeClass("cls-tab-visible").addClass("cls-tab-disabled");

          setTimeout(()=>{
            $(".food-combo-detail-header").removeClass("cls-visible").addClass("cls-disabled");
            $(".div-wraper-slide").removeClass("cls-visible").addClass("cls-disabled");
            $(".div-account").removeClass("cls-tab-disabled").addClass("cls-tab-visible");
          },50)
        }
      }
}