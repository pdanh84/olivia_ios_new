import { Bookcombo, SearchHotel } from './../providers/book-service';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { Booking, RoomInfo } from '../providers/book-service';

import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction, ActivityService} from '../providers/globalfunction';
import { ActivatedRoute } from '@angular/router';
import { voucherService } from '../providers/voucherService';
/**
 * Generated class for the RoompaymentlivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-roompaymentlive',
  templateUrl: 'roompaymentlive.html',
  styleUrls: ['roompaymentlive.scss'],
})
export class RoompaymentlivePage implements OnInit {
  text; isenabled = true; ischeck; timestamp; paymentMethod; auth_token: any = '';
  jti: any;
  ; room; jsonroom;
  public loader: any;
  roomtype;PriceAvgPlusTAStr;priceshow;stt
  constructor(private activatedRoute: ActivatedRoute,public activityService: ActivityService,public platform: Platform, public navCtrl: NavController, public Roomif: RoomInfo,
    public storage: Storage, public booking: Booking,
    public loadingCtrl: LoadingController,
    public gf: GlobalFunction,
    public zone: NgZone,
    public toastCtrl: ToastController, public bookCombo: Bookcombo,
    public searchhotel: SearchHotel,
    public _voucherService: voucherService) {
      this.storage.get('jti').then(jti => {
        if (jti) {
          this.jti = jti;
        }
      })
    //google analytic
    //gf.googleAnalytion('roompaymentlive', 'load', '');
    this.gf.logEventFirebase('office',this.searchhotel, 'roompaymentlive', 'add_payment_info', 'Hotels');
  }
  ngOnInit() {
    this.stt= this.activatedRoute.snapshot.paramMap.get('stt');
    if (this.stt==0) {
      this.text = "<b>Văn phòng tại TP. Hồ Chí Minh:</b> Lầu 2, tòa nhà Saigon Prime, 107-109-111 Nguyễn Đình Chiểu, Phường 6, Quận 3, Thành phố Hồ Chí Minh<br />Thời gian làm việc:<br /><ul><li>Thứ 2 - Thứ 7: từ 07h30 đến 21h00</li><li>Chủ Nhật: từ 07h30 đến 20h00</li></ul><br /><b>Văn phòng tại Hà Nội:</b> Lầu 9, 70-72 Bà Triệu, Quận Hoàn Kiếm<br />Thời gian làm việc:<br /><ul ><li>Thứ 2 - Thứ 6: từ 07h30 đến 17h30</li></ul>";
      this.room = this.Roomif.arrroom;
      this.jsonroom = this.Roomif.jsonroom;
      this.roomtype = this.Roomif.roomtype;
      this.PriceAvgPlusTAStr = this.roomtype.PriceAvgPlusTAStr;
      if (this.Roomif.priceshow) {
        this.priceshow = this.Roomif.priceshow;
      }
      else {
        this.priceshow = this.PriceAvgPlusTAStr;
      }
    }
  }
  ionViewWillEnter() {
    this.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
    })
  }
  next() {
    this.presentLoading();
    var se = this;
    se.jsonroom.RoomClasses = se.room;
    se.timestamp = Date.now();
    if (se.booking.CEmail) {
      if(se.Roomif.roomtype.Supplier == 'SERI'){
        se.gf.checkAllotmentSeri(
          se.booking.HotelId,
          se.Roomif.RoomId,
          se.booking.CheckInDate,
          se.booking.CheckOutDate,
          se.Roomif.roomnumber,
          'SERI', se.Roomif.roomtype.HotelCheckDetailTokenInternal
          ).then((allow)=> {
            if(allow){
              se.CreateBooking();
            }
            else{
              if (se.loader) {
                se.loader.dismiss();
              }
              se.gf.showToastWarning('Hiện tại khách sạn đã hết phòng loại này.');
            }
          })
      
      }else{
        se.CreateBooking();
      }
    } else {
      se.loader.dismiss();
      se.presentToastr('Email không hợp lệ. Vui lòng kiểm tra lại.');
    }
  }
  CreateBooking() {
    var se = this;
    var Invoice = 0;
    if (se.Roomif.order) {
      Invoice = 1;
    }
    let voucherSelectedMap = this._voucherService.voucherSelected.map(v => {
      let newitem = {};
      newitem["voucherCode"] = v.code;
      newitem["voucherName"] = v.rewardsItem.title;
      newitem["voucherType"] = v.applyFor || v.rewardsItem.rewardsType;
      newitem["voucherDiscount"] = v.rewardsItem.price;
      newitem["keepCurrentVoucher"] = false;
      return newitem;
    });
    let promoSelectedMap = this._voucherService.listObjectPromoCode.map(v => {
      let newitem = {};
      newitem["voucherCode"] = v.code;
      newitem["voucherName"] = v.name;
      newitem["voucherType"] = 2;
      newitem["voucherDiscount"] = v.price;
      newitem["keepCurrentVoucher"] = false;
      return newitem;
    });
    let checkpromocode = this._voucherService.voucherSelected && this._voucherService.voucherSelected.length ==0 && this._voucherService.listObjectPromoCode && this._voucherService.listObjectPromoCode.length ==0;
    let arrpromocode = this.Roomif.promocode ?[{"voucherCode": this.Roomif.promocode, "voucherName": this.Roomif.promocode,"voucherType": 1,"voucherDiscount": this.Roomif.priceshow ,"keepCurrentVoucher": false  }] : [];

    let body =
    {
      RoomClassObj: se.jsonroom.RoomClasses[0].ListObjRoomClass,
      CName: se.Roomif.hoten,
      CEmail: se.booking.CEmail,
      CPhone: se.Roomif.phone,
      timestamp: se.timestamp,
      HotelID: se.booking.HotelId,
      paymentMethod: "51",
      note: se.Roomif.notetotal,
      source: '8',
      MemberToken: se.auth_token,
      CustomersStr: JSON.stringify(se.Roomif.arrcustomer),
      UsePointPrice: se.Roomif.pricepoint,
      NoteCorp: se.Roomif.order,
      Invoice: Invoice,
      UserPoints: se.Roomif.point,
      CheckInDate: se.jsonroom.CheckInDate,
      CheckOutDate: se.jsonroom.CheckOutDate,
      TotalNight: se.jsonroom.TotalNight,
      MealTypeIndex: se.booking.indexmealtype,
      CompanyName: se.Roomif.companyname,
      CompanyAddress: se.Roomif.address,
      CompanyTaxCode: se.Roomif.tax,
      BillingAddress: se.Roomif.addressorder,
      //promotionCode: se.Roomif.promocode,
      vouchers : !checkpromocode ? [...voucherSelectedMap,...promoSelectedMap] : arrpromocode,
      comboid: se.bookCombo.ComboId,
      PenaltyDescription: se.Roomif.textcancel,
      companycontactname: this.Roomif.nameOrder
    };
    let headers = {};
    let strUrl = C.urls.baseUrl.urlPost + '/mInsertBooking';
    this.gf.RequestApi('POST', strUrl, headers, body, 'roompaymentlive', 'CreateBooking').then((data)=>{
        if (data && data.error == 0) {
          // console.log(data.code);
          var code = data.code;
          var stt = data.bookingStatus;
          se.loader.dismiss();
          //PDANH 22/03/2021 - Case trả sau của VIN gọi thêm hàn build link để đẩy xuống backend luồng VIN
          // let mealtype = se.jsonroom.RoomClasses[0].MealTypeRates[se.booking.indexmealtype];
          // if(mealtype && mealtype.Supplier == "VINPEARL" || mealtype.Supplier == "SMD"){
          //   let url  = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=office&source=app&amount=' + se.gf.convertStringToNumber(se.Roomif.priceshow)  + '&orderCode=' + body.code + '&buyerPhone=' + se.Roomif.phone;
          //   se.gf.CreateUrl(url);
          // }
          let totalprice = '';
          if (se.Roomif.priceshow) {
            totalprice= se.Roomif.priceshow;
          }
          else
          {
            totalprice=(se.Roomif.roomtype as any).PriceAvgPlusTAStr;
          }
          if(se.jti){
            let url  = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=office&source=app&amount=' + totalprice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + data.code + '&memberId=' + se.jti + '&buyerPhone=' + se.Roomif.phone;
            se.gf.CreateUrl(url);
          }
          if (se.Roomif.notetotal) {
            se.gf.CreateSupportRequest(data.code,se.booking.CEmail,se.Roomif.hoten,se.Roomif.phone,se.Roomif.notetotal);
          }
          se.navCtrl.navigateForward('/roompaymentdone/' + code + '/' + stt);
        }
        else {
          se.loader.dismiss();
          alert(data.Msg);
          //se.refreshToken();
          // se.navCtrl.popToRoot();
          // se.app.getRootNav().getActiveChildNav().select(0);
        }
    });
  }
  check() {
    if (this.ischeck) {
      this.isenabled = false;
    } else {
      this.isenabled = true;
    }
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }
  goback() {
    this.navCtrl.back();
  }
  async presentToastr(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
