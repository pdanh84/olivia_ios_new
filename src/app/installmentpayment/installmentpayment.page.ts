import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { RoomInfo, Booking, Bookcombo, SearchHotel } from '../providers/book-service';
import { ActivityService, GlobalFunction } from '../providers/globalfunction';
import * as $ from 'jquery';
import { C } from '../providers/constants';

import { Storage } from '@ionic/storage';
import { InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-installmentpayment',
  templateUrl: './installmentpayment.page.html',
  styleUrls: ['./installmentpayment.page.scss'],
})
export class InstallmentpaymentPage implements OnInit {
  ischeckpayment: boolean;
  arrchild: any;
  titlecombo: string;
  Avatar: string;
  Name: string;
  Address: string;
  cin: any;
  cout: any;
  adults: any;
  children: any;
  room: any;
  nameroom: any;
  breakfast: any;
  PriceAvgPlusTAStr: any;
  roomtype: any;
  banks: any=[];
  cards: any=[];
  periods: any=[];
  periodSelected: any;
  amountByMonth: any;
  amountFinal: any;
  amountFee: any;
  bankCode: any;
  paymentMethod: any;
  month: any;
  auth_token: any;
  jsonroom: any;
  loader: any;
  ischeckNote=true;
  constructor(private navCtrl: NavController,
    public Roomif: RoomInfo,
    public booking: Booking,
    public bookCombo: Bookcombo,
    public searchhotel: SearchHotel,
    public activityService: ActivityService,
    private toastCtrl: ToastController,
    private storage: Storage,
    private iab: InAppBrowser,
    private loadingCtrl: LoadingController,
    private zone: NgZone,
    public gf: GlobalFunction) {
    var se = this;

    this.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.auth_token = auth_token;
      }
    })
    //setTimeout(()=>{
      se.ischeckpayment = Roomif.ischeckpayment;
      se.arrchild = se.searchhotel.arrchild;
      se.titlecombo = se.bookCombo.ComboTitle;
      se.Avatar = se.Roomif.imgHotel;
      se.Name = se.booking.HotelName;
      se.Address = se.Roomif.Address;
      se.cin = se.booking.CheckInDate;
      se.cout = se.booking.CheckOutDate;
      var chuoicin = se.cin.split('-');
      var chuoicout = se.cout.split('-');
      se.cin = chuoicin[2] + "-" + chuoicin[1] + "-" + chuoicin[0];
      se.cout = chuoicout[2] + "-" + chuoicout[1] + "-" + chuoicout[0];
      se.adults = se.booking.Adults;
      se.children = se.booking.Child;
      se.room = se.Roomif.arrroom;
      se.nameroom = se.room[0].ClassName;
      se.breakfast = se.Roomif.objMealType.Name;
      se.roomtype = se.Roomif.roomtype;
      se.jsonroom = se.Roomif.jsonroom;
      //se.PriceAvgPlusTAStr = se.Roomif.priceshow;
      if(se.Roomif.priceshow){
        se.PriceAvgPlusTAStr = se.Roomif.priceshow;
      }else if(se.booking.cost){
        se.PriceAvgPlusTAStr = se.booking.cost;
      }
      //se.roomtype.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g, '.');
      if(se.activityService.objBankInStallment){
        se.banks = se.activityService.objBankInStallment.banks.data;
      }
    //},150)
   }

  ngOnInit() {
  }

  goback(){
    this.navCtrl.back();
  }

  itemBankClick(item){
    var se = this;
    if(item){
      $("#"+item.bankCode).siblings().removeClass('selected');
      $("#"+item.bankCode).addClass('selected');
      se.bankCode = item.bankCode;
      se.periods = [];
      se.periodSelected = null;
      if(item.paymentMethods && item.paymentMethods.length >0){
        se.cards = item.paymentMethods;
        
      }
    }
  }

  itemCardClick(item){
    var se = this;
    if(item){
      $("#"+item.paymentMethod).siblings().removeClass('selected');
      $("#"+item.paymentMethod).addClass('selected');
      se.paymentMethod = item.paymentMethod;
      se.periodSelected = null;
      if(item.periods && item.periods.length >0){
        se.periods = item.periods;
        se.zone.run(() => se.periods.sort(function (a, b) {
          let direction = -1;
          let property='month';
            if (a[property] * 1 < b[property] * 1) {
              return 1 * direction;
            }
            else if (a[property] * 1 > b[property] * 1) {
              return -1 * direction;
            }
        }));
      }
    }
  }

  itemPeriodClick(item){
    var se =this;
    if(item){
      $("#"+item.month).siblings().removeClass('period-selected');
      $("#"+item.month).addClass('period-selected');
      se.month = item.month;
      se.periodSelected = item;
      //góp mỗi tháng
      se.amountByMonth = item.amountByMonth.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g, '.');
      //tổng tiền trả góp
      se.amountFinal = item.amountFinal.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g, '.');
      //chênh lệch trả thẳng
      se.amountFee = item.amountFee.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g, '.');
    }
  }

  validInstallment(){
    var se = this,
    res = true;
    if(!se.bankCode){
      res = false;
      se.presentToastWarning("Chưa chọn ngân hàng trả góp. Xin vui lòng chọn lại!");
    }
    else if(!se.paymentMethod){
      res = false;
      se.presentToastWarning("Chưa chọn phương thức thanh toán. Xin vui lòng chọn lại!");
    }
    else if(!se.month){
      res = false;
      se.presentToastWarning("Chưa số tháng trả góp. Xin vui lòng chọn lại!");
    }
    return res;
  }

  async presentLoader(){
    var se = this;
    se.loader = await this.loadingCtrl.create({
      message: "",
    });
    this.loader.present();
  }

  installment(){
    var se = this;
    if(!se.validInstallment()){
      return;
    }
   
    if(this.roomtype.Supplier == 'SERI'){
      //Check allotment khi book
      this.gf.checkAllotmentSeri(
        this.booking.HotelId,
        this.Roomif.RoomId,
        this.booking.CheckInDate,
        this.booking.CheckOutDate,
        this.Roomif.roomnumber,
        'SERI', this.Roomif.roomtype.HotelCheckDetailTokenInternal
        ).then((allow)=> {
          if(allow){
            this.continueBook();
          }else{
            if (this.loader) {
              this.loader.dismiss();
            }
            this.gf.showToastWarning('Hiện tại khách sạn đã hết phòng loại này.');
          }
        })
    }else{
      this.continueBook();
    }
  }

  continueBook() {
    var se =this;
    se.presentLoader();
    se.processBooking().then((data) => {
      if(data){
        let urlPath = C.urls.baseUrl.urlContracting + "/api/toolsapi/sendOrderToAlepay";
        let headers = {'content-type' : 'application/x-www-form-urlencoded', accept: '*/*'};
        let body = `buyerEmail=${se.booking.CEmail}&buyerName=${se.Roomif.hoten}&buyerPhone=${se.Roomif.phone}&orderCode=${data.code}&orderDescription=Thanh toan tra gop don hang: ${data.code}`;
        body += `&amount=${se.PriceAvgPlusTAStr.replace(/\,/g, '').replace(/\./g, '')}&bankCode=${se.bankCode}&paymentMethod=${se.paymentMethod}&month=${se.month}`;
        body += `&cancelUrl=https://betapay.ivivu.com/thanh-toan-sau-thanh-cong?paylate=done&paytype=nganluong&status=cancel&ivivuapp=1&callbackUrl=https://betapay.ivivu.com/thanh-toan-sau-thanh-cong?paylate=done&paytype=nganluong&status=ok&ivivuapp=1`;
        this.gf.RequestApi('POST', urlPath, headers, body, 'Installmentpayment', 'installment').then((data)=>{

          var rs = data;
          se.activityService.objBankInStallment = rs;
          if (se.loader) {
            se.loader.dismiss();
          }
          if(rs.DataOrder && rs.DataOrder.errorCode=="000"){
            se.openWebpage(rs.DataOrder.data.checkoutUrl);
          }
          else{
            if (se.loader) {
              se.loader.dismiss();
            }
          }
        });
      }else{
        if (se.loader) {
          se.loader.dismiss();
        }
        se.presentToastWarning("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
      }
    })
  }

  processBooking() : Promise<any>{
    var se = this;
    return new Promise((resolve, reject) => {
      if (se.booking.CEmail) {
        var Invoice = 0;
        if (se.Roomif.order) {
          Invoice = 1;
        }
        var jsonroom:any = se.Roomif.arrroom[0];

        let urlPath = C.urls.baseUrl.urlPost + '/mInsertBooking';
        let headers = {'content-type': 'application/json'};
        let body =
        {
          RoomClassObj: jsonroom.ListObjRoomClass,
          CName: se.Roomif.hoten,
          CEmail: se.booking.CEmail,
          CPhone: se.Roomif.phone,
          timestamp: Date.now(),
          HotelID: se.booking.HotelId,
          paymentMethod: "8",
          note: se.Roomif.notetotal,
          Source: '6',
          MemberToken: se.auth_token,
          CustomersStr: JSON.stringify(se.Roomif.arrcustomer),
          UsePointPrice: se.Roomif.pricepoint,
          NoteCorp: se.Roomif.order,
          Invoice: Invoice,
          UserPoints: se.Roomif.point,
          CheckInDate: se.booking.CheckInDate,
          CheckOutDate: se.booking.CheckOutDate,
          TotalNight: se.jsonroom.TotalNight,
          MealTypeIndex: se.booking.indexmealtype,
          CompanyName: se.Roomif.companyname,
          CompanyAddress: se.Roomif.address,
          CompanyTaxCode: se.Roomif.tax,
          BillingAddress: se.Roomif.addressorder,
          promotionCode:se.Roomif.promocode,
          comboid:se.bookCombo.ComboId
        };
        this.gf.RequestApi('POST', urlPath, headers, body, 'Installmentpayment', 'processBooking').then((data)=>{

          if(data)
          {
            if (data.error == 0) {
              se.booking.code = data.code;
              var code = data.code;
              var stt = data.bookingStatus;
              if (se.Roomif.notetotal) {
                se.gf.CreateSupportRequest(data.code,se.booking.CEmail,se.Roomif.hoten,se.Roomif.phone,se.Roomif.notetotal);
              }
              //se.navCtrl.navigateForward('/roompaymentdone/' + code + '/' + stt);
              resolve(data);
            }
            else {
              resolve(false);
            }
          }
          else{
            resolve(false);
          }
        
        });
      }
    })
      
    }

    openWebpage(url: string) {
      var se = this;
      const options: InAppBrowserOptions = {
        zoom: 'no',
        location: 'yes',
        toolbar: 'yes',
        hideurlbar: 'yes',
        closebuttoncaption: 'Đóng',
        hidenavigationbuttons: 'yes'
      };
      const browser = se.iab.create(url, '_self', options);
      //const browser = se.iab.open(url, '_self', "zoom=no; location=yes; toolbar=yes; hideurlbar=yes; closebuttoncaption=Đóng");
      setTimeout(()=>{
        if (se.loader) {
          se.loader.dismiss();
      }
      },500)

      browser.on("loadstop").subscribe(function (event) { 
        if(event && event.url.indexOf('thanh-toan-sau-thanh-cong?paylate=done') != -1){
          let params = event.url.split('&');
          params.forEach(element => {
            if(element.indexOf('errorCode') != -1){
              let errorcodes = element.split('=');
              let errorvalue = errorcodes[1];
              if(errorvalue == "000"){
                browser.close();
                se.activityService.installmentPaymentSuccess = true;
                se.activityService.installmentPaymentErrorCode = "";
                se.navCtrl.navigateForward('/installmentpaymentdone');
              }else{
                browser.close();
                se.activityService.installmentPaymentSuccess = false;
                if(errorvalue == "150"){
                  se.activityService.installmentPaymentErrorCode = "Thẻ bị review";
                }
                else if(errorvalue == "155"){
                  se.activityService.installmentPaymentErrorCode = "Đợi người mua xác nhận trả góp";
                }
                
                se.navCtrl.navigateForward('/installmentpaymentdone');
              }
            }
          });
        }
      });
      
      browser.on('exit').subscribe(() => {
        se.presentLoader();
        se.checkBooking().then((data)=>{
          if(data){
            se.activityService.installmentPaymentSuccess = true;
          }else{
            se.activityService.installmentPaymentSuccess = false;
          }
          se.navCtrl.navigateForward('/installmentpaymentdone');
        })
        
      }, err => {
        console.error(err);
      });
      browser.show();
  
    }

  async presentToastWarning(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }

  checkBooking():Promise<any>{
    var se = this;
    
    return new Promise((resolve, reject) =>{
      //wait 5s
      setTimeout(()=>{
        var options = {
          method: 'GET',
          url: C.urls.baseUrl.urlPost + '/mCheckBooking',
          qs: { code: se.booking.code },
          headers:
          {
          }
        };
        let urlPath = C.urls.baseUrl.urlPost + '/mCheckBooking?code=' +se.booking.code;
        let headers = {'content-type': 'application/json'};
        this.gf.RequestApi('POST', urlPath, headers, {}, 'Installmentpayment', 'checkBooking').then((data)=>{

          if (data) {
            var rs = data;
            if (rs.StatusBooking == 3) {
              console.log(rs);
              if(se.loader){
                se.loader.dismiss();
              }
              resolve(true);
            }
            else {
              if(se.loader){
                se.loader.dismiss();
              }
              resolve(false);
            }
          }
          else {
            if(se.loader){
              se.loader.dismiss();
            }
            se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
          }
  
        });
      }, 5000)
      
    })
  }
  checknote(ev){
    this.ischeckNote = ev.detail.checked;
  }
}
