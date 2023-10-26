import { InsurrancepopoverPage } from './../insurrancepopover/insurrancepopover.page';
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { GlobalFunction } from '../providers/globalfunction';
import { Router } from '@angular/router';
import { ValueGlobal } from '../providers/book-service';

@Component({
  selector: 'app-insurrancehistorypopover',
  templateUrl: './insurrancehistorypopover.page.html',
  styleUrls: ['./insurrancehistorypopover.page.scss'],
})
export class InsurrancehistorypopoverPage implements OnInit {
  hasClaimDepart: any;
  hasClaimReturn: any;
  departFlightNumber: any="";
  returnFlightNumber: any="";
  departCodeDisplay: string;
  arrivalCodeDisplay: string;

  constructor(public popoverController: PopoverController,
    public gf: GlobalFunction,
    public valueGlobal: ValueGlobal,
    public router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    var se = this;
    
    //se.gf.setParams({ childlist: se.arrchild, trip: trip }, 'insurrenceHistory' );
    var obj = se.gf.getParams('insurrenceHistory');
    if(obj){
      se.departFlightNumber = obj.departFlightNumber;
      se.returnFlightNumber = obj.returnFlightNumber;
      se.hasClaimDepart = obj.claimedDepart;
      se.hasClaimReturn = obj.claimedReturn;

      if(obj.trip.bookingsComboData && obj.trip.bookingsComboData.length >1){
        se.departCodeDisplay =  obj.trip.bookingsComboData[0].departCode + ' → ' + obj.trip.bookingsComboData[0].arrivalCode;
        se.arrivalCodeDisplay = obj.trip.bookingsComboData[1].departCode + ' → ' + obj.trip.bookingsComboData[1].arrivalCode;
      }
    }
  }

  async presentPopover(ev: any, value) {
    var se = this;
    var obj = se.gf.getParams('insurrenceDetail');
    if(obj){
      obj.type = value;
      obj.flightNumber = (value == 1 || value==3) ? obj.departFlightNumber : obj.returnFlightNumber;
      se.popoverController.dismiss();
      se.valueGlobal.popover.dismiss();
      se.router.navigateByUrl("/insurrancedetail");
    }
  }

  /***
     * Gọi tổng đài hỗ trợ
     */
    async makeCallSupport(phone) {
      try {
        setTimeout(() => {
          window.open(`tel:${phone}`, '_system');
        }, 10);
      }
      catch (error) {
      }
    }
}
