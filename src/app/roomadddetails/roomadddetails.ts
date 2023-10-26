import { Bookcombo, SearchHotel } from './../providers/book-service';

import { Booking } from '../providers/book-service';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController, Platform, AlertController } from '@ionic/angular';
import { RoomInfo } from '../providers/book-service';
import { C } from '../providers/constants';

import { Storage } from '@ionic/storage';
import { GlobalFunction, ActivityService } from '../providers/globalfunction';
import jwt_decode from 'jwt-decode';
import { voucherService } from '../providers/voucherService';
var document:any;
/**
 * Generated class for the RoomadddetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-roomadddetails',
  templateUrl: 'roomadddetails.html',
  styleUrls: ['roomadddetails.scss'],
})
export class RoomadddetailsPage implements OnInit {

  hoten;phone = ""; note; arr; roomnumber; room; ischeck: boolean; ishide;
  companyname; address; tax; addressorder; bed; bedchuoi; priceshow; ischeckpoint; ischeckbtn
  timestamp; paymentMethod; jsonroom; ischeckpayment;public loader:any
  _email: any;
  validemail: boolean= true;
  auth_token: any='';
  installmentPriceStr: any;
  showInstallmentButton: boolean = false;
  ishideNameMail=true;hotenhddt;emailhddt;

  inputtext: boolean = false;
  listPaxSuggestByMemberId:any= [];
  listpaxhint: any = [];
  hidepaxhint: boolean = false;
  currentSelectPax: any;
  jti: any;
  ngOnInit() {
  }
  constructor(public platform: Platform, public navCtrl: NavController, public zone: NgZone,
    private toastCtrl: ToastController, public Roomif: RoomInfo, public storage: Storage, public loadingCtrl: LoadingController,
    public booking: Booking, public gf: GlobalFunction,public bookCombo:Bookcombo,
    public activityService: ActivityService,
    private alertCtrl: AlertController,
    public searchhotel: SearchHotel,
    public _voucherService: voucherService) {
    this.ischeckpayment = Roomif.ischeckpayment;
    this.storage.get('infocus').then(infocus => {
      if (infocus) {
        if (infocus.ho&&infocus.ten) {
          this.hoten = infocus.ho+' '+infocus.ten;
        } else {
          if (infocus.ho) {
            this.hoten=infocus.ho;
          }
          else if (infocus.ten) {
            this.hoten=infocus.ten;
          }
        }
        this.phone = infocus.phone;
      }
    })
   
    this.note = Roomif.notetotal;
    this.room = this.Roomif.arrroom;
    this.jsonroom = {...Roomif.jsonroom};
    this.ischeckpoint = this.Roomif.ischeckpoint;
    if (this.ischeckpoint == true) {
      if (this.Roomif.priceshow == "0") {
        this.priceshow = this.Roomif.priceshow;
      }
      else {
        this.priceshow = this.Roomif.priceshow.replace(/\./g, '').replace(/\,/g, '');
      }

    }
    else {
      this.ischeckbtn = true;
      if (this.Roomif.promocode) {
        if (this.Roomif.priceshow == "0") {
          this.priceshow = this.Roomif.priceshow;
          this.ischeckbtn = false;
        }
        else {
          this.priceshow = this.Roomif.priceshow.replace(/\./g, '').replace(/\,/g, '');
        }
      }
    }
    if (Roomif.ischeck) {
      this.ischeck = Roomif.ischeck;
    }
    //var roomtype:any = this.Roomif.roomtype;
    var priceBooking:any = "";
    if(this.Roomif.priceshow){
      priceBooking = this.Roomif.priceshow.replace(/\./g, '').replace(/\,/g, '');
    }else if(this.booking.cost){
      priceBooking = this.booking.cost.replace(/\./g, '').replace(/\,/g, '');
    }
     
    this.searchhotel.totalPrice = priceBooking;
    this.showInstallmentButton = (priceBooking*1 >= 3000000 && this.Roomif.payment == 'AL') ? true : false;
    this.getInstallment(priceBooking*1);
    this.zone.run(()=>{
      let priceinstallment = Math.round(priceBooking*1 / 12 * 1.05);
      this.installmentPriceStr = priceinstallment.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g, '.') + "đ/tháng";
    })
    this.GetUserInfo();

    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
        this.gf.RequestApi('GET', C.urls.baseUrl.urlMobile+'/api/Dashboard/GetListNameHotel?memberid='+jti, {},{}, 'flightadddetails', 'GetListNameHotel').then((data)=>{
          if(data && data.response && data.response.length >0){
            this.listPaxSuggestByMemberId = [...data.response];
          }
        })
      }
    })
    //google analytic
  }
  GetUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
      if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'GET',
        //   url: C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo',
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json',
        //     authorization: text
        //   }
        // };
        let headers =
          {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
          };
        let strUrl = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo';
        this.gf.RequestApi('GET', strUrl, headers, {}, 'roomadddetails', 'GetUserInfo').then((data)=>{
          if(data && data.corpInfomations && data.corpInfomations.length >0){
              se.zone.run(() => {
                se.ishide = false;
                se.ischeck = false;
                var corpInfomations=data.corpInfomations[0];
                if(corpInfomations){
                  se.companyname = corpInfomations.legalName;
                  se.address = corpInfomations.address;
                  se.tax = corpInfomations.taxCode;
                  // se.addressorder = corpInfomations.addressorder;
                  // se.hotenhddt=corpInfomations.hotenhddt;
                  // se.emailhddt=corpInfomations.emailhddt;
                  // se.ishideNameMail=corpInfomations.ishideNameMail;
                  se.ishide = true;
                  se.ischeck = true;
                }
                else{
                  se.storage.get('order').then(order => {
                    if (order) {
                      se.companyname = order.companyname;
                      se.address = order.address;
                      se.tax = order.tax;
                      se.addressorder = order.addressorder;
                      se.hotenhddt=order.hotenhddt;
                      se.emailhddt=order.emailhddt;
                      se.ishideNameMail=order.ishideNameMail;
                      se.ishide = true;
                      se.ischeck = true;
                    }
                  })
                }
              })
            }
            else{
              se.storage.get('order').then(order => {
                if (order) {
                  se.companyname = order.companyname;
                  se.address = order.address;
                  se.tax = order.tax;
                  se.addressorder = order.addressorder;
                  se.hotenhddt=order.hotenhddt;
                  se.emailhddt=order.emailhddt;
                  se.ishideNameMail=order.ishideNameMail;
                  se.ishide = true;
                  se.ischeck = true;
                }else {
                  se.ishide = false;
                  se.ischeck = false;
                }
              })
            }

          
        });
      }
    })
  }
  ionViewWillEnter(){
    this.storage.get('email').then(email => {
      if(email){
        this._email = email;
      }else{
        this.validemail = false;
      }
      
    })
    this.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
    })
  }
  next() {
   
    this.Roomif.notetotal = "";
    if (this.phone) {
      this.phone = this.phone.replace(/ /g, "");
    }
    //this.gf.googleAnalytion('roomadddetails', 'add_payment_info', '');
    if (this.hoten) {
      this.hoten = this.hoten.trim();
      var checktext=this.hasWhiteSpace(this.hoten);
      if (!checktext) {
        this.presentToastHo();
        return;
      }
    }
    else {
      this.presentToastHo();
      return;
    }
    
  
    
    this.Roomif.order = "";
    if (this.ischeck) {
      if (this.phonenumber(this.phone)) {
        //validate mail
        if(!this.validateEmail(this._email) || !this._email || !this.gf.checkUnicodeCharactor(this._email)){
          this.presentToastEmail();
          this.validemail = false;
          return;
        }
        this.booking.CEmail = this._email;
        if (this.companyname && this.address && this.tax) {
          this.companyname = this.companyname.trim();
          this.address = this.address.trim();
          this.tax = this.tax.trim();
        }
        else {
          this.presentToastOrder();
          return;
        }
        if (this.companyname && this.address && this.tax) {
          this.Roomif.hoten = this.hoten;
          this.Roomif.phone = this.phone;
          this.Roomif.companyname = this.companyname;
          this.Roomif.address = this.address;
          this.Roomif.tax = this.tax;
          this.Roomif.notetotal = this.note;
          this.Roomif.addressorder = this._email;
          this.Roomif.nameOrder = this.hoten;

          if (!this.ishideNameMail ) {
            if (this.emailhddt && this.hotenhddt) {
              if(!this.validateEmail(this.emailhddt) || !this.gf.checkUnicodeCharactor(this.emailhddt)){
                this.gf.showToastWarning('email xuất hóa đơn không hợp lệ. Vui lòng kiểm tra lại');
                return;
              }
              else{
                this.Roomif.addressorder = this.emailhddt;
                this.Roomif.nameOrder = this.hotenhddt;
              }
            }
            else{
              this.presentToastOrder();
              return;
            }
          } 
          var order1 = { companyname: this.companyname, address: this.address, tax: this.tax, addressorder: this.addressorder,ishideNameMail: this.ishideNameMail,hotenhddt:this.hotenhddt,emailhddt:this.emailhddt }
          this.storage.set("order", order1);
          this.Roomif.order = this.companyname + "," + this.address + "," + this.tax + "," + this.addressorder
          this.Roomif.notetotal = this.note;
          this.Roomif.ischeck = this.ischeck;
          
          if (this.Roomif.payment == 'AL') {
            this.booking.CEmail = this._email;
            this.Roomif.bookingCode="";
            this.navCtrl.navigateForward("roompaymentselect");
          }
          else {
            this.paymentnotAL();
          }

        } else {
          this.presentToastOrder();
        }

      } else {
        this.presentToastPhone();
      }

    } else {
      if (this.phonenumber(this.phone)) {
        //validate mail
        if(!this.validateEmail(this._email) || !this._email){
          this.presentToastEmail();
          this.validemail = false;
          return;
        }
        this.Roomif.hoten = this.hoten;
        this.Roomif.phone = this.phone;
        this.Roomif.notetotal = this.note;
        this.Roomif.ischeck = this.ischeck;
        
        this.Roomif.notetotal = this.note;
        //console.log(this.Roomif.notetotal);
        if (this.Roomif.payment == 'AL') {
          this.booking.CEmail = this._email;
          this.Roomif.bookingCode="";
          this.navCtrl.navigateForward("roompaymentselect");
        }
        else {
          this.paymentnotAL();
        }
      } else {
        this.presentToastPhone();
      }

    }
  }
  next1() {
    this.Roomif.notetotal = "";
    if (this.hoten) {
      this.hoten = this.hoten.trim();
      var checktext=this.hasWhiteSpace(this.hoten);
      if (!checktext) {
        this.presentToastHo();
        return;
      }
    }
    else {
      this.presentToastHo();
      return;
    }
    this.Roomif.order = "";
    
    if (this.ischeck) {
      if (this.phonenumber(this.phone)) {
        if (this.companyname && this.address && this.tax) {
          this.companyname = this.companyname.trim();
          this.address = this.address.trim();
          this.tax = this.tax.trim();
        }
        else {
          this.presentToastOrder();
          return;
        }
        if (this.companyname && this.address && this.tax) {
          this.Roomif.hoten = this.hoten;
          this.Roomif.phone = this.phone;
          this.Roomif.companyname = this.companyname;
          this.Roomif.address = this.address;
          this.Roomif.tax = this.tax;
          this.Roomif.notetotal = this.note;
          this.Roomif.addressorder = this.addressorder;
          this.Roomif.nameOrder = this.hoten;

          if (!this.ishideNameMail ) {
            if (this.emailhddt && this.hotenhddt) {
              if(!this.validateEmail(this.emailhddt) || !this.gf.checkUnicodeCharactor(this.emailhddt)){
                this.gf.showToastWarning('email xuất hóa đơn không hợp lệ. Vui lòng kiểm tra lại');
                return;
              }
              else{
                this.Roomif.addressorder = this.emailhddt;
                this.Roomif.nameOrder = this.hotenhddt;
              }
            }
            else{
              this.presentToastOrder();
              return;
            }
          }
          var order1 = { companyname: this.companyname, address: this.address, tax: this.tax, addressorder: this.addressorder,ishideNameMail: this.ishideNameMail,hotenhddt:this.hotenhddt,emailhddt:this.emailhddt }
          this.storage.set("order", order1);
          this.Roomif.order = this.companyname + "," + this.address + "," + this.tax + "," + this.addressorder
          this.Roomif.notetotal = this.note;
          this.Roomif.ischeck = this.ischeck;
          this.pushdata();
        } else {
          this.presentToastOrder();
        }

      } else {
        this.presentToastPhone();
      }
    } else {
      if (this.phonenumber(this.phone)) {
        // var info = { ho: this.ho, ten: this.ten, phone: this.phone }
        // this.storage.set("infocus", info);
        this.Roomif.hoten = this.hoten;
        this.Roomif.phone = this.phone;
        this.Roomif.notetotal = this.note;
        this.Roomif.ischeck = this.ischeck;
        
        
        this.Roomif.notetotal = this.note;
        this.pushdata();

      } else {
        this.presentToastPhone();
      }
    }
  }
  pushdata() {
    this.presentLoading();
    var se = this;
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


    this.jsonroom.RoomClasses = this.room;
    this.timestamp = Date.now();
        var Invoice = 0;
        if (se.Roomif.order) {
          Invoice = 1;
        }
        let body =
        {
          RoomClassObj: se.jsonroom.RoomClasses[0].ListObjRoomClass,
          CName: se.Roomif.hoten,
          CEmail: se._email,
          CPhone: se.Roomif.phone,
          timestamp: se.timestamp,
          HotelID: se.booking.HotelId,
          paymentMethod: "51",
          note: se.Roomif.notetotal,
          Source: '6',
          MemberToken: se.auth_token,
          CustomersStr: se.Roomif.arrcustomer,
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
          //promotionCode:se.Roomif.promocode,
          vouchers : !checkpromocode ? [...voucherSelectedMap,...promoSelectedMap] : arrpromocode,
          comboid:se.bookCombo.ComboId,
          PenaltyDescription:se.Roomif.textcancel,
          companycontactname: se.Roomif.nameOrder
        };
        let headers =
          {
            'content-type': 'application/json',
          };
        let strUrl = C.urls.baseUrl.urlPost + '/mInsertBooking';
        this.gf.RequestApi('POST', strUrl, headers, body, 'roomadddetails', 'pushdata').then((data)=>{
          if(data)
          {
            if (data.error == 0) {
              //console.log(body.code);
              // var value = { BookingCode: body.code, total: se.Roomif.pricepoint ,ischeck:'1'};
              //se.closeLoading();
              se.Roomif.bookingCode = data.code;
              var id = data.code;
              var total = se.Roomif.pricepoint;
              var ischeck = '1';
              se.loader.dismiss();

              var priceBooking:any = "";
              if(se.Roomif.priceshow){
                priceBooking = se.Roomif.priceshow.replace(/\./g, '').replace(/\,/g, '');
              }else if(se.booking.cost){
                priceBooking = se.booking.cost.replace(/\./g, '').replace(/\,/g, '');
              }
              if(priceBooking){
                let url  = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=office&source=app&amount=' + priceBooking + '&orderCode=' + data.code + '&buyerPhone=' + se.Roomif.phone+ '&memberId=' + se.jti;
                se.gf.CreateUrl(url);
              }
              se.searchhotel.paymentType = 'On request';
              se.gf.logEventFirebase('On request',se.searchhotel, 'roomadddetails', 'add_payment_info', 'Hotels');
              if (se.Roomif.notetotal) {
                se.gf.CreateSupportRequest(data.code,se.booking.CEmail,se.Roomif.hoten,se.Roomif.phone,se.Roomif.notetotal);
              }
              se.navCtrl.navigateForward('/roompaymentdoneean/' + id + '/' + total + '/' + ischeck);
            }
            else {
              se.loader.dismiss();
              se.storage.get('jti').then((memberid) => {
                if(memberid){
                  se.storage.get('deviceToken').then((devicetoken) => {
                    if(devicetoken){
                      se.gf.refreshToken(memberid, devicetoken).then((token) =>{
                        setTimeout(()=>{
                          se.auth_token = token;
                        },100)
                      });
                    }else{
                      se.showAlertMessageOnly(data.Msg);
                    }
                  })
                }else{
                  se.showAlertMessageOnly(data.Msg);
                }
                
              })
            }
          }
          else{
            se.loader.dismiss();
            se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
          }
         
        });

    
  }
  async showAlertMessageOnly(msg){
    let alert = await this.alertCtrl.create({
      header: '',
      message: 'Mã đăng nhập đã hết hạn, vui lòng đăng nhập lại!',
      cssClass: "cls-alert-message",
      backdropDismiss: false,
      buttons: [
      {
        text: 'OK',
        role: 'OK',
        handler: () => {
          this.navCtrl.navigateForward('/login');
          alert.dismiss();
        }
      }
      ]
    });
    alert.present();
  }

  async presentToasterror() {
    let toast = await this.toastCtrl.create({
      message: "Số điểm không đủ để tạo booking",
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }
  async presentToastHo() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập họ tên",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async presentToastTen() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập tên",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async presentToastPhone() {
    let toast = await this.toastCtrl.create({
      message: "Số điện thoại không hợp lệ. Xin vui lòng nhập lại.",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async presentToastOrder() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập thông tin xuất hóa đơn",
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }
  edit(co) {
    this.zone.run(() => {
      if (co == 0) {
        if (this.ischeck) {
          this.ishide = false;
        } else {
          this.ishide = true;
        }
      }
      else {
        this.ishide = false;
        this.ischeck = true;
      }
    })

  }
  ionViewDidLoad() {
  
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }

  phonenumber(inputtxt) {
    var n = Number(inputtxt);
    if (n) {
      var test1 = inputtxt.length;
      if (inputtxt) {
        if (test1 == 10) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
  goback() {
    this.navCtrl.navigateBack('roomdetailreview');
  }
  paymentnotAL() {
    this.presentLoading();
    var se = this;
    se.jsonroom.RoomClasses = se.room;
    se.timestamp = Date.now();
    if(se._email){
      se.booking.CEmail = se._email;
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


    //29/11/2019: Cho phép book không cần đăng nhập => bỏ validate auth_token, chỉ cần email
    //se.storage.get('auth_token').then(auth_token => {
      if (se.booking.CEmail) {
        var Invoice = 0;
        if (se.Roomif.order) {
          Invoice = 1;
        }
       

        let body =
        {
          RoomClassObj: se.jsonroom.RoomClasses[0].ListObjRoomClass,
          CName: se.Roomif.hoten,
          CEmail: se._email,
          CPhone: se.Roomif.phone,
          timestamp: se.timestamp,
          HotelID: se.booking.HotelId,
          paymentMethod: "51",
          note: se.Roomif.notetotal,
          Source: '6',
          MemberToken: se.auth_token,
          CustomersStr: se.Roomif.arrcustomer,
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
          //promotionCode:se.Roomif.promocode,
          vouchers : !checkpromocode ? [...voucherSelectedMap,...promoSelectedMap] : arrpromocode,
          comboid:se.bookCombo.ComboId,
          PenaltyDescription:se.Roomif.textcancel,
          companycontactname: se.Roomif.nameOrder
        };
        let headers =
          {
            'content-type': 'application/json',
          };
        let strUrl = C.urls.baseUrl.urlPost + '/mInsertBooking';
        this.gf.RequestApi('POST', strUrl, headers, body, 'roomadddetails', 'paymentnotAL').then((data)=>{
          if(data)
          {
            if (data.error == 0) {
              // console.log(data.code);
              var code = data.code;
              var stt = data.bookingStatus;
              var priceBooking:any = "";
              se.Roomif.bookingCode = data.code;
              if(se.Roomif.priceshow){
                priceBooking = se.Roomif.priceshow.replace(/\./g, '').replace(/\,/g, '');
              }else if(se.booking.cost){
                priceBooking = se.booking.cost.replace(/\./g, '').replace(/\,/g, '');
              }
              if(priceBooking){
                let url  = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=office&source=app&amount=' + priceBooking + '&orderCode=' + data.code + '&buyerPhone=' + se.Roomif.phone+ '&memberId=' + se.jti;
                se.gf.CreateUrl(url);
              }
              se.searchhotel.paymentType = 'On request';
              se.gf.logEventFirebase('On request',se.searchhotel, 'roomadddetails', 'add_payment_info', 'Hotels');
              se.navCtrl.navigateForward('/roompaymentdone/' + code + '/' + se.Roomif.payment);
              se.loader.dismiss();
              //se.gf.googleAnalytion('paymentdirect', 'Purchases', 'hotelid:' + se.booking.cost + '/cin:' + se.jsonroom.CheckInDate + '/cout:' + se.jsonroom.CheckOutDate + '/adults:' + se.booking.Adults + '/child:' + se.booking.Child + '/price:' + se.booking.cost)
            }
            else {
              se.loader.dismiss();
              se.storage.get('jti').then((memberid) => {
                if(memberid){
                  se.storage.get('deviceToken').then((devicetoken) => {
                    if(devicetoken){
                      se.gf.refreshToken(memberid, devicetoken).then((token) =>{
                        setTimeout(()=>{
                          se.auth_token = token;
                        },100)
                      });
                    }else{
                      se.showAlertMessageOnly(data.Msg);
                    }
                  })
                }else{
                  se.showAlertMessageOnly(data.Msg);
                }
                
              })
            }
          }
          else{
            se.loader.dismiss();
            se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
          }
         
        });

      }
    //})

  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  async presentToastEmail() {
    let toast = await this.toastCtrl.create({
      message: "Thông tin email không hợp lệ. Vui lòng nhập lại.",
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }
  hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
  } 

  getInstallment(price){
    var se = this;
    // var options = {
    //   method: 'GET',
    //   url: C.urls.baseUrl.urlContracting + '/api/toolsapi/getInstallmentInfo',
    //   qs:
    //   {
    //     amount: price.toString()
    //   },
    //   headers:
    //     {}
    // };
    
    let url = C.urls.baseUrl.urlContracting + '/api/toolsapi/getInstallmentInfo?amount=' + price.toString();
    var se = this;
    
    se.gf.RequestApi('GET', url, {}, {}, 'roomadddetails', 'getInstallment').then((data) => {
      var rs = data;
      se.activityService.objBankInStallment = rs;
    });
  }

  checkInput(){
    var se = this, res = true;
    if (se.hoten) {
      se.hoten = se.hoten.trim();
      var checktext=se.hasWhiteSpace(se.hoten);
      if (!checktext) {
        se.presentToastHo();
        res = false;
      }
      else if(!se.hoten) {
        se.presentToastHo();
        res = false;
      }
      //validate mail
      else if(!se.validateEmail(se._email) || !se._email){
        se.presentToastEmail();
        se.validemail = false;
        res = false;
      }
      else if(!se.phone || !se.phonenumber(se.phone)) {
        se.presentToastPhone();
        res = false;
      }
      else if (se.ischeck && !(se.companyname && se.address && se.tax)) {
        se.presentToastOrder();
        res = false;
      }
    }
    else if(!se.hoten) {
      se.presentToastHo();
      res = false;
    }
    //validate mail
    else if(!se.validateEmail(se._email) || !se._email){
      se.presentToastEmail();
      se.validemail = false;
      res = false;
    }
    else if(!se.phone || !se.phonenumber(se.phone)) {
      se.presentToastPhone();
      res = false;
    }
    else if (se.ischeck && !(se.companyname && se.address && se.tax)) {
      se.presentToastOrder();
      res = false;
    }

    if(res){
      if(se._email){
        se.booking.CEmail = se._email;
      }
      if(se.ischeck){
        if(se.companyname && se.address && se.tax){
          se.Roomif.hoten = se.hoten;
          se.Roomif.phone = se.phone;
          se.Roomif.companyname = se.companyname;
          se.Roomif.address = se.address;
          se.Roomif.tax = se.tax;
          se.Roomif.notetotal = se.note;
          se.Roomif.addressorder = se.addressorder;
          var order1 = { companyname: se.companyname, address: se.address, tax: se.tax, addressorder: se.addressorder }
          se.storage.set("order", order1);
          se.Roomif.order = se.companyname + "," + se.address + "," + se.tax + "," + se.addressorder
          se.Roomif.notetotal = se.note;
          se.Roomif.ischeck = se.ischeck;
        }
      }else{
        se.Roomif.hoten = se.hoten;
        se.Roomif.phone = se.phone;
        se.Roomif.notetotal = se.note;
        se.Roomif.ischeck = se.ischeck;
        se.Roomif.notetotal = se.note;
      }
    }
    

    return res;
  }
  
  installment(){
    var se = this;
    if(!se.checkInput()){
      return;
    }
    if(!se.activityService.objBankInStallment){
      se.presentToastWarning("Đang tính giá trả góp, xin quý khách vui lòng đợi trong giây lát!");
      return;
    }
    se.navCtrl.navigateForward('/installmentpayment');
  }

  async presentToastWarning(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }
  showNameMail(ev)
  {
    this.ishideNameMail=ev.detail.checked;
  }

  updateHintPaxName(value, listpaxhint){
    var se = this;
      let arraypax:any =[];
      se.listpaxhint = [];
        for (let index = 0; index < listpaxhint.length; index++) {
          const element = listpaxhint[index];
          if(element.fullName &&value && se.gf.convertFontVNI(element.fullName).toLowerCase().indexOf(se.gf.convertFontVNI(value).toLowerCase()) != -1 ){
            arraypax.push(element);
          }
          
        }
     
      se.listpaxhint = [...arraypax];
  }

  inputFocus(event){
    var se = this;
    se.zone.run(()=>{
      if(!se.inputtext){
        if(se.listPaxSuggestByMemberId && se.listPaxSuggestByMemberId.length >0){
          se.inputtext = true;
          se.createHintPaxName(null, se.listPaxSuggestByMemberId);
        }
      }else{
        se.inputtext = true;
        se.updateHintPaxName(event.target.value, se.listPaxSuggestByMemberId)
      }
    })
    
    
  }

  inputLostFocus(item){
    var se = this;
      setTimeout(()=>{
        se.zone.run(()=>{
          se.inputtext = false;

          if(se.hidepaxhint){
            item.hidePaxHint = true;
            se.hidepaxhint = false;
          }
        })
        
      }, 400)
    
  }

  async createHintPaxName(item, listpaxhint){
    var se = this;
    se.listpaxhint = [...listpaxhint];
  }

  selectPaxHint(paxhint){
    var se = this;
    se.zone.run(()=>{
      if(paxhint){
        if(se.currentSelectPax){
          se.currentSelectPax.hoten = paxhint.fullName ? paxhint.fullName :se.currentSelectPax.hoten;
          se.currentSelectPax.phone = paxhint.phoneNumber ? paxhint.phoneNumber : se.currentSelectPax.phone;
        }
        else{
          se.hoten = paxhint.fullName ? paxhint.fullName :se.hoten;
          se.phone = paxhint.phoneNumber ? paxhint.phoneNumber : se.phone;
        }
        
      }
    })
    
  }
  hidePaxHint(){
    this.hidepaxhint = true;
  }
  
  inputOnFocus(item, type){
            var se = this;
            
            //se.clearError(item, type);
            if(type == 9 && !se.hoten){

              if(se.listPaxSuggestByMemberId && se.listPaxSuggestByMemberId.length >0){
                se.inputtext = true;
                se.createHintPaxName(item, se.listPaxSuggestByMemberId);
                
              }else{
                se.storage.get('listpaxcache').then((data)=>{
                      if(data){
                          se.inputtext = true;
                          se.createHintPaxName(item, se.listPaxSuggestByMemberId);
                      }
                    })
              }
            }
          }
          setFocusInput(){
            (window.document.getElementById('ipNote') as any).scrollIntoView({  block: 'center' });
          }
}
