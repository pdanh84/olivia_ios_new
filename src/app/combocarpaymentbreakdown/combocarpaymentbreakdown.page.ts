import { Component, OnInit } from '@angular/core';
import { GlobalFunction, ActivityService } from './../providers/globalfunction';
import { NavController } from '@ionic/angular';
import { Bookcombo } from '../providers/book-service';

@Component({
  selector: 'app-combocarpaymentbreakdown',
  templateUrl: './combocarpaymentbreakdown.page.html',
  styleUrls: ['./combocarpaymentbreakdown.page.scss'],
})
export class CombocarpaymentbreakdownPage implements OnInit {
  objectDetail: any;
  roomObj: any;
  totalRoomOtherFee: any =0;
  PriceDiffUnitAdult: any=0;
  RoomPriceDiffUnit: any;
  TicketDifferenceFeeUnit: any;
  childsTicketFee: any;
  surchargedep: string;
  surchargeret: string;
  diff_feedep: any;
  diff_feeret: any;
  PriceAvgPlusTAStr: any;
  childrendisplay: any;
  extrabeddisplay: any;
  extrabedprice: any;
  extrabedchilddisplay: any;
  extrabedchildprice: any;
  mealtypePromotion: any;
  ChildDiffUnit: any;

  constructor(public activityService: ActivityService,
    private navCtrl: NavController,
    public bookcombo: Bookcombo,
    public gf: GlobalFunction) { 
    var se = this;
    se.objectDetail = activityService.objCarComboPaymentBreakDown.objectDetail;
    if(se.objectDetail){
      console.log(se.objectDetail);
      se.totalRoomOtherFee = se.objectDetail.totalAdultExtrabed + 
      se.objectDetail.ChildOtherFeeTotal +
      se.objectDetail.AdultOtherFee;

      se.PriceDiffUnitAdult = (se.objectDetail.elementMealtype.priceDiffUnit*1 + se.objectDetail.pricedepart*1 + se.objectDetail.pricereturn*1+ se.objectDetail.roomPriceSale*1).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
      if(se.totalRoomOtherFee >0){
        se.totalRoomOtherFee = se.totalRoomOtherFee.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
      }

      if(se.objectDetail.room && se.objectDetail.room.length>0){
        se.roomObj = se.objectDetail.room[0].Rooms[0];
        if (se.roomObj.Images) {
          se.roomObj.Images=(se.roomObj.Images.toLocaleString().trim().indexOf("http") != -1) ? se.roomObj.Images : 'https:' + se.roomObj.Images;
        }
      }
      if(se.objectDetail.elementMealtype.priceDiffUnit){
        se.RoomPriceDiffUnit = se.objectDetail.elementMealtype.priceDiffUnit.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
      }
      if(se.objectDetail.TicketDifferenceFeeUnit){
        se.TicketDifferenceFeeUnit = se.objectDetail.TicketDifferenceFeeUnit.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
      }
      se.PriceAvgPlusTAStr = se.objectDetail.PriceAvgPlusTAStr.toLocaleString().replace(/\,/g,'.');
      se.ChildDiffUnit = 0;
      if(se.objectDetail.childsTicketFee){
        se.ChildDiffUnit += se.objectDetail.childsTicketFee.replace(/\,/g,'')*1;
        se.ChildDiffUnit = se.ChildDiffUnit.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
        se.childsTicketFee = se.objectDetail.childsTicketFee.replace(/\,/g,'.');
      }
      if(se.objectDetail.surchargedepd >0 || se.objectDetail.surchargedept >0){
        se.surchargedep = (se.objectDetail.surchargedepd*1 + se.objectDetail.surchargedept*1).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
      }
      if(se.objectDetail.surchargeretd >0 || se.objectDetail.surchargerett >0){
        se.surchargeret = (se.objectDetail.surchargeretd*1 + se.objectDetail.surchargerett*1).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
      }
      if(se.objectDetail.diff_feedep){
        se.diff_feedep = se.objectDetail.diff_feedep.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
      }
      if(se.objectDetail.diff_feeret){
        se.diff_feeret = se.objectDetail.diff_feeret.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
      }
      if(se.objectDetail.childrendisplay){
        se.childrendisplay = se.objectDetail.childrendisplay;
      }
      if(se.objectDetail.JsonSurchargeFee.SurchargeFee && se.objectDetail.JsonSurchargeFee.SurchargeFee.length >0){
        if(se.objectDetail.JsonSurchargeFee.SurchargeFee[0].PassengerType == 1){
          se.extrabedchilddisplay = se.objectDetail.JsonSurchargeFee.SurchargeFee[0].Text;
          se.extrabedchildprice = se.objectDetail.JsonSurchargeFee.SurchargeFee[0].PriceFormat;
          se.ChildDiffUnit += se.objectDetail.JsonSurchargeFee.SurchargeFee[0].Price*1;
          se.ChildDiffUnit = se.ChildDiffUnit.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
        }else{
          se.extrabeddisplay = se.objectDetail.JsonSurchargeFee.SurchargeFee[0].Text;
          se.extrabedprice = se.objectDetail.JsonSurchargeFee.SurchargeFee[0].PriceFormat;
        }
        
      }
      if(se.objectDetail.elementMealtype && se.objectDetail.elementMealtype.PromotionInclusions && se.objectDetail.elementMealtype.PromotionInclusions.length >0){
        se.mealtypePromotion = se.objectDetail.elementMealtype.PromotionInclusions[0];
      }
    }
  }

  ngOnInit() {
  }

  goback(){
    this.navCtrl.back();
  }
}
