import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { BizTravelService } from 'src/app/providers/bizTravelService';
import { flightService } from 'src/app/providers/flightService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivityService, GlobalFunction } from 'src/app/providers/globalfunction';
import { C } from '../../providers/constants';
import { Storage } from '@ionic/storage';
import { Bookcombo, RoomInfo, ValueGlobal } from 'src/app/providers/book-service';
import { MytripService } from 'src/app/providers/mytrip-service.service';
import { foodService } from 'src/app/providers/foodService';

@Component({
  selector: 'app-confirmpayment',
  templateUrl: './confirmpayment.html',
  styleUrls: ['./confirmpayment.scss'],
})
export class ConfirmPaymentPage implements OnInit {
  typeSearch: any=0;
    bookingCode: any;
    phoneNo: any;
    public otpData: FormGroup;
    @ViewChild('user') input; otp='';
  balance: any;
  intervalID: NodeJS.Timeout;
  loader: any;
  startDate: any;
  endDate: any;
  totalPriceDisplay: any;
  jti: any;
  totalPrice: number;
  constructor(private navCtrl :NavController,
    public bizTravelService: BizTravelService,
    public _flightService: flightService,
    public formBuilder: FormBuilder,
    public gf: GlobalFunction,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private alertCtrl: AlertController,
    public bookCombo: Bookcombo,
    public roomInfo: RoomInfo,
    public activityService: ActivityService,
    public Roomif: RoomInfo,
    public _mytripservice: MytripService,
    public _foodService: foodService,
    public valueGlobal: ValueGlobal) { 
        this.otpData = this.formBuilder.group({
            otp: ['', Validators.compose([Validators.required])],
          });
      if(this.bizTravelService.paymentType == 1){//vmb
        if(this._flightService.itemFlightCache){
          this.bookingCode =  this._flightService.itemFlightCache.pnr.bookingCode ? this._flightService.itemFlightCache.pnr.bookingCode : this._flightService.itemFlightCache.pnr.resNo;
          this.startDate = moment(this._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');
          this.endDate = moment(this._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD');
          this.totalPriceDisplay = _flightService.itemFlightCache.totalPriceDisplay;
          this.totalPrice = this.gf.convertStringToNumber(_flightService.itemFlightCache.totalPriceDisplay);
        }
      }else if(this.bizTravelService.paymentType == 3){//combovmb
        this.bookingCode = this.bookCombo.bookingcode;
        this.totalPriceDisplay =  this.gf.convertNumberToString(this.bookCombo.totalprice);
        this.totalPrice = this.bookCombo.totalprice;
      }
      else if(this.bizTravelService.paymentType == 2){//room
        if (roomInfo.priceshow) {
          this.totalPriceDisplay= this.gf.convertNumberToString(roomInfo.priceshow);
          this.totalPrice = this.gf.convertStringToNumber(roomInfo.priceshow);
        }
        else
        {
          this.totalPriceDisplay= (roomInfo.roomtype as any).PriceAvgPlusTAStr;
          this.totalPrice = this.gf.convertStringToNumber((roomInfo.roomtype as any).PriceAvgPlusTAStr);
        }
        this.bookingCode = this.roomInfo.bookingCode;
      }else if(this.bizTravelService.paymentType == 4){//mytrip
        this.totalPrice = this.activityService.objPaymentMytrip.trip.priceShow.toString().replace(/\./g, '').replace(/\,/g, '');
        this.totalPriceDisplay= this.activityService.objPaymentMytrip.trip.priceShow;
        this.bookingCode = this.activityService.objPaymentMytrip.trip.booking_id;
      }
      
      this.storage.get('jti').then(jti => {
        this.jti = jti;
        })
    }

  ngOnInit() {
  }

  goback(){
    this.navCtrl.back();
  }

  cancel(){
    var se = this;
    if(se.bizTravelService.routeBackWhenCancel && se.bizTravelService.routeBackWhenCancel == 'roomdetailreview' && (se.Roomif.point || se.Roomif.promocode)){
      se.redirectConfirm(se.Roomif.point, se.Roomif.promocode,se.bookingCode, se.bizTravelService.routeBackWhenCancel, 2);
    }else{
      se.goback();
    }
  }
  /**
   * 
   * @param point : dùng điểm
   * @param promocode : dùng mã voucher
   * @param bookingcode : mã bkg
   * @param routecancel 
   * @param type : 1 - comboxe; 2 - phòng; 3 - combovmb
   */

  redirectConfirm(point, promocode, bookingcode, routecancel, type){
    var se = this;
    if (point && bookingcode) {
      se.navCtrl.navigateForward('/roomdetailreview');
      se.showConfirm("Điểm tích luỹ "+point+" đã được dùng cho booking "+bookingcode+".Xin vui lòng thao tác lại booking!");

      se.Roomif.point = "";
      se.Roomif.bookingCode="";
    }
    else if (promocode && bookingcode) {
      se.navCtrl.navigateForward('/roomdetailreview');
      se.showConfirm("Mã giảm giá "+promocode+" đã được dùng cho booking "+bookingcode+".Xin vui lòng thao tác lại booking!");
      se.Roomif.promocode = "";
      se.Roomif.bookingCode="";
    }
    else{
      this.navCtrl.navigateBack('/'+this.bizTravelService.routeBackWhenCancel);
    }
  }

  async showConfirm(msg){
    let alert = await this.alertCtrl.create({
      message: msg,
      cssClass: 'cls-global-confirm',
      buttons: [
      {
        text: 'Xác nhận',
        role: 'OK',
        handler: () => {
          this.navCtrl.navigateBack('/'+this.bizTravelService.routeBackWhenCancel);
        }
        }
      ]
    });
    alert.present();
  }

  confirm(){
    if(!this.otpData.value.otp){
      this.gf.showToastWarning("Vui lòng nhập mã OTP");
      return;
    }
    this.gf.showLoading();
    this.checkOTP(this.otpData.value.otp);
  }
  checkOTP(otp: any){
      try {
        this.storage.get('auth_token').then(auth_token => {
          if(auth_token){
            var text = "Bearer " + auth_token;
            var  headers =
            {
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                authorization: text
            }
            var params = {bookingCode: this.bookingCode, otp: otp};
            this.gf.checkAcceptBizCredit('POST', C.urls.baseUrl.urlContracting +'/biz-otp-valid', headers, params, 'confirmpayment', 'checkOTP').then((data) => {
              this.gf.hideLoading();
              if(data && data.success){
                this.navCtrl.navigateForward('confirmpaymentdone');
              }else{
                this.gf.showToastWarning(data.msg);
              }
            })
          }
        })
      } catch (error) {
        this.gf.showToastWarning("Đã có lỗi xảy ra. Vui lòng thử lại sau");
      }
     
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }

  async hideLoading(){
    if(this.loader){
      this.loader.dismiss();
    }
  }

  resendOTP(){
    var se = this;
    se.presentLoading();
      if(this.jti){
        let strUrl = C.urls.baseUrl.urlContracting +'/biz-otp-resend';
        se.gf.RequestApi('POST', strUrl, {}, {}, 'confirmpayment', 'resendOTP').then((data) => {
            se.hideLoading();
            if (data) {
              se.gf.showToastWarning(data.msg);
            }
        })
      }else{
        se.gf.showToastWarning('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
        se.hideLoading();
      }
  }
}
