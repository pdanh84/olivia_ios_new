import { ValueGlobal } from './../providers/book-service';
import { InsurrancehistorypopoverPage } from './../insurrancehistorypopover/insurrancehistorypopover.page';
import { NavController, PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { GlobalFunction } from '../providers/globalfunction';
import { Router } from '@angular/router';


@Component({
  selector: 'app-insurrancepopover',
  templateUrl: './insurrancepopover.page.html',
  styleUrls: ['./insurrancepopover.page.scss'],
})
export class InsurrancepopoverPage implements OnInit {

  arrinsurrance:any=[];
  arrchildinsurrance: any=[];
  constructor(public navCtrl: NavController,public valueGlobal:ValueGlobal,
    public gf: GlobalFunction,
    private router: Router,
    public popoverController: PopoverController) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    var se = this;
    var obj = se.gf.getParams('insurrenceHistory');
    if(obj){
      obj.listInsurrance.forEach(element => {
            se.arrinsurrance.push(element);
      });

      obj.childlist.forEach(element => {
        let itemchild = {claimed: element.claimedFlights.length >1 ? true : false ,insurance_code: element.id,customer_name: element.name, customer_id: element.identification, customer_address: element.address, customer_dob: element.birth};
        se.arrchildinsurrance.push(itemchild);
      });
    }
  }
  async showInsurranceHistoryPopover(ev, item, ischild)
  {
    var se = this;
      const popover = await this.popoverController.create({
        component: InsurrancehistorypopoverPage,
        event: ev,
        translucent: true,
        cssClass: 'popover-history'
      });
    let obj = se.gf.getParams('insurrenceHistory');
    obj.item = item;
    if(ischild && obj.childlist.length <=1){
      obj.childlist = [];
    }
    se.gf.setParams(obj,'insurrenceDetail');
    return await popover.present();
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

    showInsurranceInfo(){
      var se = this;
      se.popoverController.dismiss();
      se.valueGlobal.popover.dismiss();
      se.navCtrl.navigateForward('/insurrancenote');
    }
}
