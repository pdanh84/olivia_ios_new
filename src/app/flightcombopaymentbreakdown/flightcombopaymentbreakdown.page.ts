import { Bookcombo } from './../providers/book-service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivityService, GlobalFunction } from '../providers/globalfunction';
import { voucherService } from '../providers/voucherService';

@Component({
  selector: 'app-flightcombopaymentbreakdown',
  templateUrl: './flightcombopaymentbreakdown.page.html',
  styleUrls: ['./flightcombopaymentbreakdown.page.scss'],
})
export class FlightcombopaymentbreakdownPage implements OnInit {
  objFlightComboDetail: any;
  PriceDiffUnitAdult: any;
  roomObj: any;
  PriceAvgPlusTAStr: any;
  totalGetSubPriceForChild: any;
  PriceDiffUnit: string;
  AdultUnit: any;
  InsuranceFee: any;
  totalPriceForChildCWE: any;
  ChildUnit: string;
  childUnitExb: any;
  childFlightPrice: any;
  Luggage;
  constructor(public activityService: ActivityService,
    private navCtrl: NavController,public bookcombo:Bookcombo,
    public gf: GlobalFunction,
    public _voucherService: voucherService) {
      var se = this;
      se.objFlightComboDetail = se.activityService.objFlightComboPaymentBreakDown.objDetail;
      if(se.bookcombo.Luggage){
        this.Luggage=se.bookcombo.Luggage.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
      }
    
      if(se.objFlightComboDetail){
       
       se.roomObj = se.objFlightComboDetail.room[0].Rooms[0];
        if (se.roomObj.Images) {
          se.roomObj.Images=(se.roomObj.Images.toLocaleString().trim().indexOf("http") != -1) ? se.roomObj.Images : 'https:' + se.roomObj.Images;
        }
        se.PriceDiffUnitAdult = (se.objFlightComboDetail.totalPriceSale*1 + (se.objFlightComboDetail.ComboPriceDiff.DepartFlightDiff.AdultUnit*1 + se.objFlightComboDetail.ComboPriceDiff.ReturnFlightDiff.AdultUnit*1 ) + Math.round(se.objFlightComboDetail.ComboPriceDiff.RoomDiff.AdultUnit)*1).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
        se.PriceAvgPlusTAStr=Number(se.objFlightComboDetail.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, ''));
        se.PriceAvgPlusTAStr = se.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
        se.totalGetSubPriceForChild = se.objFlightComboDetail.totalGetSubPriceForChild.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
        se.PriceDiffUnit = (se.objFlightComboDetail.ComboPriceDiff.DepartFlightDiff.AdultUnit*1 + se.objFlightComboDetail.ComboPriceDiff.ReturnFlightDiff.AdultUnit*1 ).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
        se.AdultUnit = se.objFlightComboDetail.ComboPriceDiff.RoomDiff.AdultUnit;
        se.InsuranceFee = se.objFlightComboDetail.bookCombo.checkInsurranceFee ? se.objFlightComboDetail.objInsurranceFee.priceTaUnit.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.') : 0;
        if(se.AdultUnit){
          se.AdultUnit = Math.round(se.AdultUnit).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
        }
        if(se.objFlightComboDetail.totalPriceForChildCWE){
          se.totalPriceForChildCWE = se.objFlightComboDetail.totalPriceForChildCWE.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
          let childUnit = se.objFlightComboDetail.ComboPriceDiff.DepartFlightDiff.ChildUnit + se.objFlightComboDetail.ComboPriceDiff.ReturnFlightDiff.ChildUnit + se.objFlightComboDetail.totalPriceForChildCWE;
          se.childUnitExb = childUnit.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
          se.childFlightPrice = (se.objFlightComboDetail.ComboPriceDiff.DepartFlightDiff.ChildUnit + se.objFlightComboDetail.ComboPriceDiff.ReturnFlightDiff.ChildUnit).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
          if(se.objFlightComboDetail.totalGetSubPriceForChild != childUnit){
            se.ChildUnit = (se.objFlightComboDetail.totalGetSubPriceForChild - childUnit).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
          }
        }
      }
     }

  ngOnInit() {
  }

  goback(){
    this.navCtrl.back();
  }

}
