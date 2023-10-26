import { Bookcombo, RoomInfo, SearchHotel, ValueGlobal } from './../../providers/book-service';
import { Component, OnInit, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { flightService } from '../../providers/flightService';
import { ActivityService, GlobalFunction } from '../../providers/globalfunction';
import { BizTravelService } from 'src/app/providers/bizTravelService';
@Component({
  selector: 'app-confirmpaymentdone',
  templateUrl: './confirmpaymentdone.page.html',
  styleUrls: ['./confirmpaymentdone.page.scss'],
})
export class ConfirmPaymentDonePage implements OnInit {
  event;
  code="";startdate;enddate;_email="";stt= 1;total;text;isDinner
  bookingCode: any;
  bookingFlight: any;
  pacificVNA: string = "";
  pacificVNAReturn: string="";listDiChung: any = "";
  checkInDisplayDC: string;
  checkOutDisplayDC: string;
  totaldisplay: any;
  constructor(public _flightService: flightService,
    private navCtrl:NavController, public searchhotel: SearchHotel,public storage: Storage, private zone: NgZone,
    public valueGlobal: ValueGlobal,
    public gf: GlobalFunction,
    public bizTravelService: BizTravelService,
    public bookCombo: Bookcombo,
    public roomInfo: RoomInfo,
    public activityService: ActivityService) { 
      if(this.bizTravelService.paymentType == 1 && this._flightService.itemFlightCache && this._flightService.itemFlightCache.pnr){
          this.total = this._flightService.itemFlightCache.totalPrice;
          this._email = this._flightService.itemFlightCache.email;
          this.bookingCode =  this._flightService.itemFlightCache.pnr.bookingCode ? this._flightService.itemFlightCache.pnr.bookingCode : this._flightService.itemFlightCache.pnr.resNo;
          this.bookingFlight = this._flightService.itemFlightCache;
          this.bizTravelService.bizAccount.balanceAvaiable = this.bizTravelService.bizAccount.balanceAvaiable - this._flightService.itemFlightCache.totalPrice;
          this.totaldisplay = this.gf.convertNumberToString(this._flightService.itemFlightCache.totalPrice);
      }else if(this.bizTravelService.paymentType == 3){
        this.bizTravelService.bizAccount.balanceAvaiable = this.bizTravelService.bizAccount.balanceAvaiable - this.bookCombo.totalprice;
        this.total = this.bookCombo.totalprice;
        this.totaldisplay = this.gf.convertNumberToString(this.bookCombo.totalprice);
        this.bookingCode = this.bookCombo.bookingcode;
      }
      else if(this.bizTravelService.paymentType == 2){//room
        if (roomInfo.priceshow) {
          this.bizTravelService.bizAccount.balanceAvaiable = this.bizTravelService.bizAccount.balanceAvaiable - this.gf.convertStringToNumber(this.roomInfo.priceshow);
          this.totaldisplay= this.gf.convertNumberToString(roomInfo.priceshow);
          this.total = this.roomInfo.priceshow;
        }
        else
        {
          this.bizTravelService.bizAccount.balanceAvaiable = this.bizTravelService.bizAccount.balanceAvaiable - this.gf.convertStringToNumber((roomInfo.roomtype as any).PriceAvgPlusTAStr);
          this.totaldisplay= this.gf.convertNumberToString((roomInfo.roomtype as any).PriceAvgPlusTAStr);
          this.total = (roomInfo.roomtype as any).PriceAvgPlusTAStr;
        }
        this.bookingCode = this.roomInfo.bookingCode;
      }
      else if(this.bizTravelService.paymentType == 4){//mytrip
        this.total = this.activityService.objPaymentMytrip.trip.priceShow.toString().replace(/\./g, '').replace(/\,/g, '');
        this.bizTravelService.bizAccount.balanceAvaiable = this.bizTravelService.bizAccount.balanceAvaiable - this.total;
        this.totaldisplay= this.activityService.objPaymentMytrip.trip.priceShow;
        this.bookingCode = this.bizTravelService.mytripPaymentBookingCode ;
      }
    }

 
  ngOnInit() {
    
  }

  ionViewWillEnter(){
    
  }

  next()
  {
    this.gf.hideLoading();
    this.clearItemCache();
    this.navCtrl.navigateBack('/tabs/tab1');
  }

  async showBooking(){
    var se = this;
    se.clearItemCache();
    se.navCtrl.navigateBack('/tabs/tab1');
   
  }

  clearItemCache(){
    this._flightService.itemFlightCache = {};
    this._flightService.itemFlightCache.departLuggage = [];
    this._flightService.itemFlightCache.returnLuggage = [];
    this._flightService.itemFlightCache.jsonSeats = null;
        this._flightService.itemFlightCache.listdepartseatselected = "";
        this._flightService.itemFlightCache.listreturnseatselected = "";
        this._flightService.itemFlightCache.departLuggage = [];
        this._flightService.itemFlightCache.returnLuggage = [];
        this._flightService.itemFlightCache.hasChoiceLuggage = false;
        this._flightService.itemFlightCache.listSeatNormal = [];
        this._flightService.itemFlightCache.listReturnSeatNormal = [];
        this._flightService.itemFlightCache.departConditionInfo = null;
        this._flightService.itemFlightCache.returnConditionInfo = null;
        this._flightService.itemFlightCache.isnewmodelseat = false;
        this._flightService.itemFlightCache.isnewmodelreturnseat = false;
  }

  
}
