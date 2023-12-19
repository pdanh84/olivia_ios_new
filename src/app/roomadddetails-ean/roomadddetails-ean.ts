import { Bookcombo, SearchHotel } from './../providers/book-service';
import { RoomInfo, Booking } from '../providers/book-service';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController, Platform, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';

import { GlobalFunction,ActivityService } from '../providers/globalfunction';
import jwt_decode from 'jwt-decode';
import { voucherService } from '../providers/voucherService';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
var document:any;
/**
 * Generated class for the RoomadddetailsEanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'app-roomadddetails-ean',
  templateUrl: 'roomadddetails-ean.html',
  styleUrls: ['roomadddetails-ean.scss'],
})
export class RoomadddetailsEanPage implements OnInit {
  hoten; phone = ""; note; arr:any = []; roomnumber; room; arr1:any = []; BedType; priceshow; ischeckpoint; arrpush:any = [];
  ishide; companyname; address; tax; addressorder; bed; bedchuoi; arrbed:any = []; _email: any;
  validemail: boolean = true;
  auth_token: any = '';
  ischeck: boolean;
  timestamp; paymentMethod; jsonroom; ischeckbtn; textbed; ischeckpayment; public loader: any;
  hotenhddt; emailhddt; ishideNameMail = true;
  showInstallmentButton: boolean = false;
  installmentPriceStr: any;
  inputtext: boolean = false;
  listPaxSuggestByMemberId:any= [];
  listpaxhint: any = [];
  hidepaxhint: boolean = false;
  currentSelectPax: any;
  jti: any;
  constructor(public platform: Platform, public navCtrl: NavController, public Roomif: RoomInfo,
    private toastCtrl: ToastController, public booking: Booking, public zone: NgZone, public storage: Storage,
    public loadingCtrl: LoadingController, public gf: GlobalFunction, public bookCombo: Bookcombo,public activityService: ActivityService,
    private alertCtrl: AlertController,
    public searchhotel: SearchHotel,
    public _voucherService: voucherService,
    private _clipboard: Clipboard) {
    this.ischeckpayment = Roomif.ischeckpayment;
    this.roomnumber = Roomif.roomnumber;
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
    if (this.Roomif.arrrbed && this.Roomif.arrrbed.length > 1) {
      // this.arrbed = this.Roomif.arrrbed;
      this.BedType = this.Roomif.arrrbed[0];
    }
    else if (this.Roomif.arrrbed && this.Roomif.arrrbed.length == 1) {
      this.BedType = this.Roomif.arrrbed[0];
      this.textbed = this.Roomif.arrrbed[0];
      this.textbed = this.textbed.description;
    }
    if (Roomif.ischeck) {
      this.ischeck = Roomif.ischeck;
    }
    this.storage.get('infocus').then(infocus => {
      this.arrbed = [];
      this.bed = this.Roomif.arrrbed;
      if (this.roomnumber > 1) {
        var item1;
        if (infocus) {
          for (let i = 0; i < this.roomnumber; i++) {
            let number = i + 1;
            if (i == 0) {
              if (infocus.ho && infocus.ten) {
                item1 = { text: "Khách nhận phòng " + number + "", hoten: infocus.ho + ' ' + infocus.ten, arrbed: this.arrbed, phone: infocus.phone }
              } else {
                if (infocus.ho) {
                  item1 = { text: "Khách nhận phòng " + number + "", hoten: infocus.ho, arrbed: this.arrbed, phone: infocus.phone }
                }
                else if (infocus.ten) {
                  item1 = { text: "Khách nhận phòng " + number + "", hoten: infocus.ten, arrbed: this.arrbed, phone: infocus.phone }
                }
                else {
                  item1 = { text: "Khách nhận phòng " + number + "", hoten: "", arrbed: this.arrbed, phone: infocus.phone ? infocus.phone : "" }
                }
              }

            }
            else {
              item1 = { text: "Khách nhận phòng " + number + "", hoten: "", arrbed: this.arrbed, phone: "" }
            }
            this.arr.push(item1);
            if(this.bed && this.bed.length >0){
              this.arrpush[i] = this.bed[0];
            }
           
          }
        }
        else {
          for (let i = 0; i < this.roomnumber; i++) {
            let number = i + 1;
            item1 = { text: "Khách nhận phòng " + number + "", fristname: "", lastname: "", arrbed: this.arrbed, phone: "" }
            this.arr.push(item1);
            if(this.bed && this.bed.length >0){
              this.arrpush[i] = this.bed[0];
            }
          }
        }
        if (this.bed) {
          if (this.bed.length > 1) {
            for (let i = 0; i < this.bed.length; i++) {
              var item;
              if (i == 0) {
                item = { text: this.bed[i], ischeck: true };
                this.bedchuoi = this.bed[i];
              }
              else {
                item = { text: this.bed[i], ischeck: false }
              }
              this.arrbed.push(item);
            }
          }
        }
      }
      else {
        if (infocus) {
          if (infocus.ho && infocus.ten) {
            this.hoten = infocus.ho + ' ' + infocus.ten;
          } else {
            if (infocus.ho) {
              this.hoten = infocus.ho;
            }
            else if (infocus.ten) {
              this.hoten = infocus.ten;
            }
          }
          this.phone = infocus.phone;
        }
        this.room = this.Roomif.arrroom;
        if (this.Roomif.arrrbed && this.Roomif.arrrbed.length > 1) {
          this.bed = this.Roomif.arrrbed
          for (let i = 0; i < this.bed.length; i++) {
            var item;
            if (i == 0) {
              item = { text: this.bed[i], ischeck: true };
              this.bedchuoi = this.bed[i];
            }
            else {
              item = { text: this.bed[i], ischeck: false }
            }
            this.arrbed.push(item);
          }
          if(this.bed && this.bed.length >0){
            this.arrpush[0] = this.bed[0];
          }
        }
        else if(this.Roomif.arrrbed){
          this.bed = this.Roomif.arrrbed;
          if (this.bed) {
            if (this.bed.length > 1) {
              for (let i = 0; i < this.bed.length; i++) {
                var item;
                if (i == 0) {
                  item = { text: this.bed[i], ischeck: true };
                  this.bedchuoi = this.bed[i];
                }
                else {
                  item = { text: this.bed[i], ischeck: false }
                }
                this.arrbed.push(item);
              }
            }
            if(this.bed && this.bed.length >0){
              this.arrpush[0] = this.bed[0];
            }
          }
        }
      }

    })
    // this.storage.get('order').then(order => {
    //   if (order) {
    //     this.companyname = order.companyname;
    //     this.address = order.address;
    //     this.tax = order.tax;
    //     this.addressorder = order.addressorder;
    //     this.hotenhddt=order.hotenhddt;
    //     this.emailhddt=order.emailhddt;
    //     this.ishideNameMail=order.ishideNameMail;
    //     this.ishide = true;
    //     this.ischeck = true;
    //   } else {
    //     this.ishide = false;
    //     this.ischeck = false;
    //   }
    // })
    var priceBooking:any = "";
    if(this.Roomif.priceshow){
      priceBooking = this.Roomif.priceshow.replace(/\./g, '').replace(/\,/g, '');
    }else if(this.booking.cost){
      priceBooking = this.booking.cost.replace(/\./g, '').replace(/\,/g, '');
    }
    this.searchhotel.totalPrice = priceBooking;
    this.jsonroom.RoomClasses = this.room;
    let mealtype = this.jsonroom.RoomClasses[0].MealTypeRates[this.booking.indexmealtype];
         
    this.showInstallmentButton = (priceBooking*1 >= 3000000 && this.Roomif.payment == 'AL' && (mealtype && mealtype.Supplier == "VINPEARL" || mealtype.Supplier == "SMD"|| mealtype.Supplier == 'SERI')) ? true : false;
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
    //this.gf.googleAnalytion('roomadddetails-ean', 'add_payment_info', '');
    this.gf.logEventFirebase('',this.searchhotel, 'roomadddetails-ean', 'add_shipping_info', 'Hotels');
  }
  GetUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
      if (auth_token) {
        this.gf.getUserInfo(auth_token).then((data) => {
            if (data && data.corpInfomations && data.corpInfomations.length >0) {
              se.zone.run(() => {
                se.ishide = false;
                se.ischeck = false;
                if(data.email){
                  se._email = data.email;
                }
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
            }else{
              if(data.email){
                se._email = data.email;
              }
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
  getInstallment(price){
    var se = this;
    var options = {
      method: 'GET',
      url: C.urls.baseUrl.urlContracting + '/api/toolsapi/getInstallmentInfo',
      qs:
      {
        amount: price.toString()
      },
      headers:
        {}
    };
    
    let headers = {};
      let strUrl = C.urls.baseUrl.urlContracting + '/api/toolsapi/getInstallmentInfo?amount='+price.toString();
      this.gf.RequestApi('GET', strUrl, headers, {}, 'roomadddetails-eans', 'getInstallment').then((data)=>{
      var rs = data;
      se.activityService.objBankInStallment = rs;
    });
  }
  ngOnInit() {
  }
  ionViewWillEnter() {
    this.storage.get('email').then(email => {
      if (email) {
        this._email = email;
      } else {
        this.validemail = false;
      }

    })
    this.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
    })
  }
  next(value) {
    this.Roomif.notetotal = "";
    if (this.phone) {
      this.phone = this.phone.replace(/ /g, "");
    }
    if (this.roomnumber == 1) {
      if (this.hoten) {
        this.hoten = this.hoten.trim();
        var checktext = this.hasWhiteSpace(this.hoten);
        if (!checktext) {
          this.presentToastName();
          return;
        }
      }
      else {
        this.presentToastName();
        return;
      }
      if (this.ischeck) {
        if (this.hoten) {
          if (this.phonenumber(this.phone)) {
            //validate mail
            if (!this.validateEmail(this._email) || !this._email || !this.gf.checkUnicodeCharactor(this._email)) {
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
              // this.Roomif.ten = this.ten;
              this.Roomif.notetotal = this.note;
              this.Roomif.phone = this.phone;
              // var info = { ho: this.ho, ten: this.ten, phone: this.phone }
              // this.storage.set("infocus", info);
              var texthoten = this.hoten.split(' ');
              var item1;
              if (texthoten.length > 2) {
                let name = '';
                for (let j = 1; j < texthoten.length; j++) {
                  if (j == 1) {
                    name += texthoten;
                  } else {
                    name += ' ' + texthoten[j];
                  }
                }
                item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
              } else if (this.hoten.length > 1) {
                item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
              }
              else if (this.hoten.length == 1) {
                item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
              }
              this.arr1 = [];
              this.arr1.push(item1);
              this.Roomif.arrcustomer = this.arr1;
              this.Roomif.companyname = this.companyname;
              this.Roomif.address = this.address;
              this.Roomif.tax = this.tax;
              this.Roomif.notetotal = this.note;
              this.Roomif.addressorder = this._email;
              this.Roomif.nameOrder = this.hoten;
              if (!this.ishideNameMail) {
                if (this.emailhddt && this.hotenhddt) {
                  if (!this.validateEmail(this.emailhddt) || !this.gf.checkUnicodeCharactor(this.emailhddt)) {
                    this.gf.showToastWarning('email xuất hóa đơn không hợp lệ. Vui lòng kiểm tra lại');
                    return;
                  }
                  else {
                    this.Roomif.addressorder = this.emailhddt;
                    this.Roomif.nameOrder = this.hotenhddt;
                  }

                }
                else {
                  this.presentToastOrder();
                  return;
                }
              }
              var order1 = { companyname: this.companyname, address: this.address, tax: this.tax, addressorder: this.addressorder, ishideNameMail: this.ishideNameMail, hotenhddt: this.hotenhddt, emailhddt: this.emailhddt }
              this.storage.set("order", order1);
              this.Roomif.order = this.companyname + "," + this.address + "," + this.tax + "," + this.addressorder;
              if (this.Roomif.payment == 'true') {
                this.paymentnotAL();
              } else {
                this.booking.CEmail = this._email;
                this.Roomif.bookingCode = "";
                if(value==0){
                  this.navCtrl.navigateForward("roompaymentselect-ean");
                }
                else{
                  this.installment();
                }
              }

            }
            else {
              this.presentToastOrder();
            }
          }
          else {
            this.presentToastPhone();
          }
        }
        else {
          this.presentToastName();
        }

      } else {
        if (this.hoten) {
          if (this.phonenumber(this.phone)) {
            //validate mail
            if (!this.validateEmail(this._email) || !this._email) {
              this.presentToastEmail();
              this.validemail = false;
              return;
            }
            this.booking.CEmail = this._email;
            this.Roomif.hoten = this.hoten;
            this.Roomif.phone = this.phone;
            this.Roomif.notetotal = this.note;
            // var info = { ho: this.ho, ten: this.ten, phone: this.phone }
            // this.storage.set("infocus", info);
            var texthoten = this.hoten.split(' ');
            if (texthoten.length > 2) {
              let name = '';
              for (let j = 1; j < texthoten.length; j++) {
                if (j == 1) {
                  name += texthoten[j];
                } else {
                  name += ' ' + texthoten[j];
                }
              }
              item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
            } else if (texthoten.length > 1) {
              item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
            }
            else if (texthoten.length == 1) {
              item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
            }

            this.arr1 = [];
            this.arr1.push(item1);
            this.Roomif.arrcustomer = this.arr1;
            if (this.Roomif.payment == 'true') {
              this.paymentnotAL();
            } else {
              this.booking.CEmail = this._email;
              this.Roomif.bookingCode = "";
              if(value==0){
                this.navCtrl.navigateForward("roompaymentselect-ean");
              }
              else{
                this.installment();
              }
            }
          }
          else {
            this.presentToastPhone();
          }
        }
        else {
          this.presentToastName();
        }
      }

    }
    else {
      if (this.ischeck) {
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
          this.Roomif.companyname = this.companyname;
          this.Roomif.address = this.address;
          this.Roomif.tax = this.tax;
          this.Roomif.notetotal = this.note;
          this.Roomif.addressorder = this._email;
          this.Roomif.nameOrder = this.hoten;

          if (!this.ishideNameMail) {
            if (this.emailhddt && this.hotenhddt) {
              if (!this.validateEmail(this.emailhddt) || !this.gf.checkUnicodeCharactor(this.emailhddt)) {
                this.gf.showToastWarning('email xuất hóa đơn không hợp lệ. Vui lòng kiểm tra lại');
                return;
              }
              else {
                this.Roomif.addressorder = this.emailhddt;
                this.Roomif.nameOrder = this.hotenhddt;
              }

            }
            else {
              this.presentToastOrder();
              return;
            }
          }

          var order1 = { companyname: this.companyname, address: this.address, tax: this.tax, addressorder: this.addressorder, ishideNameMail: this.ishideNameMail, hotenhddt: this.hotenhddt, emailhddt: this.emailhddt }
          this.storage.set("order", order1);
          this.Roomif.order = this.companyname + "," + this.address + "," + this.tax + "," + this.addressorder
          this.pushdata1(value);
        }
        else {
          this.presentToastOrder();
        }
      }
      else {
        this.pushdata1(value);
      }
    }
  }
  pushdata1(value) {
    var item1;
    var co = 0;
    for (let i = 0; i < this.arr.length; i++) {
      if (this.arr[i].hoten) {
        this.arr[i].hoten = this.arr[i].hoten.trim();
      }else{
        this.presentToastName();
        return;
      }
      if (i == 0) {
        if (this.arr[i].hoten) {
          var checktext = this.hasWhiteSpace(this.arr[i].hoten);
          if (!checktext) {
            co = 1;
            break;
          }
        }
        else {
          co = 1;
          break;
        }
        if (!this.arr[i].phone) {
          co = 2;
          break;
        }
        this.arr[i].phone = this.arr[i].phone.replace(/ /g, "");
      }
      else {
        if (this.arr[i].hoten) {
          var checktext = this.hasWhiteSpace(this.arr[i].hoten);
          if (!checktext) {
            co = 1;
            break;
          }
        }
        else {
          co = 1;
          break;
        }
      }
    }
    if (co == 0) {
      this.arr1 = [];
      //console.log(this.arr);
      if (this.arrbed.length > 1) {
        for (let i = 0; i < this.arr.length; i++) {
          var texthoten = this.arr[i].hoten.split(' ');
          if (texthoten.length > 2) {
            let name = '';
            for (let j = 1; j < texthoten.length; j++) {
              if (j == 1) {
                name += texthoten[j];
              } else {
                name += ' ' + texthoten[j];
              }
            }
            item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.arrpush[i] }
          } else if (texthoten.length > 1) {
            item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.arrpush[i] }
          }
          else if (texthoten.length == 1) {
            item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.arrpush[i] }
          }
          this.arr1.push(item1);
        }
      }
      else {
        for (let i = 0; i < this.arr.length; i++) {
          var texthoten = this.arr[i].hoten.split(' ');
          if (texthoten.length > 2) {
            let name = '';
            for (let j = 1; j < texthoten.length; j++) {
              if (j == 1) {
                name += texthoten[j];
              } else {
                name += ' ' + texthoten[j];
              }
            }
            item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
          } else if (texthoten.length > 1) {
            item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
          }
          else if (texthoten.length == 1) {
            item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
          }
          this.arr1.push(item1);
        }

      }

      this.Roomif.hoten = this.arr1[0].LastName + ' ' + this.arr1[0].FirstName;
      this.Roomif.phone = this.arr1[0].Phone;
      // var info = { ho: this.arr1[0].LastName, ten: this.arr1[0].FirstName, phone: this.arr1[0].Phone }
      // this.storage.set("infocus", info);
      this.Roomif.arrcustomer = this.arr1;
      this.Roomif.notetotal = this.note;
      if (this.Roomif.payment == 'true') {
        this.paymentnotAL();
      } else {
        this.booking.CEmail = this._email;
        this.Roomif.bookingCode = "";
        if(value==0){
          this.navCtrl.navigateForward("roompaymentselect-ean");
        }
        else{
          this.installment();
        }
      }
    } else {
      if (co == 1) {
        this.presentToastName();
      } else if (co == 2) {
        this.presentToastPhone();
      }

    }
  }
  next1() {
    this.Roomif.notetotal = "";
    if (this.roomnumber == 1) {
      if (this.hoten) {
        this.hoten = this.hoten.trim();
        var checktext = this.hasWhiteSpace(this.hoten);
        if (!checktext) {
          this.presentToastName();
          return;
        }
      }
      else {
        this.presentToastName();
        return;
      }
      if (this.ischeck) {
        if (this.hoten) {
          if (this.phonenumber(this.phone)) {
            //validate mail
            if (!this.validateEmail(this._email) || !this._email) {
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
              // this.Roomif.ten = this.ten;
              this.Roomif.phone = this.phone;
              // var info = { ho:  this.ho, ten:  this.ten, phone:  this.phone }
              // this.storage.set("infocus", info);
              var texthoten = this.hoten.split(' ');
              var item1;
              if (this.hoten.length > 2) {
                let name = '';
                for (let j = 1; j < texthoten.length; j++) {
                  if (j == 1) {
                    name += texthoten[j];
                  } else {
                    name += ' ' + texthoten[j];
                  }
                }
                item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
              } else if (texthoten.length > 1) {
                item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
              }
              else if (texthoten.length == 1) {
                item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
              }
              this.arr1 = [];
              this.arr1.push(item1);
              this.Roomif.arrcustomer = this.arr1;
              this.Roomif.companyname = this.companyname;
              this.Roomif.address = this.address;
              this.Roomif.tax = this.tax;
              this.Roomif.notetotal = this.note;

              this.Roomif.addressorder = this._email;
              this.Roomif.nameOrder = this.hoten;
              if (!this.ishideNameMail) {
                if (this.emailhddt && this.hotenhddt) {
                  if (!this.validateEmail(this.emailhddt) || !this.gf.checkUnicodeCharactor(this.emailhddt)) {
                    this.gf.showToastWarning('email xuất hóa đơn không hợp lệ. Vui lòng kiểm tra lại');
                    return;
                  }
                  else {
                    this.Roomif.addressorder = this.emailhddt;
                    this.Roomif.nameOrder = this.hotenhddt;
                  }

                }
                else {
                  this.presentToastOrder();
                  return;
                }
              }
              var order1 = { companyname: this.companyname, address: this.address, tax: this.tax, addressorder: this.addressorder, ishideNameMail: this.ishideNameMail, hotenhddt: this.hotenhddt, emailhddt: this.emailhddt }
              this.storage.set("order", order1);
              this.Roomif.order = this.companyname + "," + this.address + "," + this.tax + "," + this.addressorder
              this.pushdata();
            }
            else {
              this.presentToastOrder();
            }
          }
          else {
            this.presentToastPhone();
          }
        }
        else {
          this.presentToastName();
        }

      } else {
        if (this.hoten) {
          if (this.phonenumber(this.phone)) {
            //validate mail
            if (!this.validateEmail(this._email) || !this._email) {
              this.presentToastEmail();
              this.validemail = false;
              return;
            }
            this.booking.CEmail = this._email;
            this.Roomif.hoten = this.hoten;
            this.Roomif.phone = this.phone;
            // var info = { ho: this.ho, ten: this.ten, phone: this.phone }
            // this.storage.set("infocus", info);
            var texthoten = this.hoten.split(' ');
            var item1;
            if (this.hoten.length > 2) {
              let name = '';
              for (let j = 1; j < texthoten.length; j++) {
                if (j == 1) {
                  name += texthoten[j];
                } else {
                  name += ' ' + texthoten[j];
                }
              }
              item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
            } else if (texthoten.length > 1) {
              item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
            }
            else if (texthoten.length == 1) {
              item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
            }
            this.arr1 = [];
            this.arr1.push(item1);
            this.Roomif.arrcustomer = this.arr1;
            this.pushdata();
          }
          else {
            this.presentToastPhone();
          }
        }
        else {
          this.presentToastName();
        }
      }

    }
    else {
      if (this.ischeck) {
        if (this.companyname && this.address && this.tax) {
          this.companyname = this.companyname.trim();
          this.address = this.address.trim();
          this.tax = this.tax.trim();
          // this.addressorder = this.addressorder.trim();
        }
        else {
          this.presentToastOrder();
          return;
        }
        if (this.companyname && this.address && this.tax) {
          this.Roomif.companyname = this.companyname;
          this.Roomif.address = this.address;
          this.Roomif.tax = this.tax;
          this.Roomif.notetotal = this.note;
          this.Roomif.addressorder = this._email;
          this.Roomif.nameOrder = this.hoten;

          if (!this.ishideNameMail) {
            if (this.emailhddt && this.hotenhddt) {
              if (!this.validateEmail(this.emailhddt) || !this.gf.checkUnicodeCharactor(this.emailhddt)) {
                this.gf.showToastWarning('email xuất hóa đơn không hợp lệ. Vui lòng kiểm tra lại');
                return;
              }
              else {
                this.Roomif.addressorder = this.emailhddt;
                this.Roomif.nameOrder = this.hotenhddt;
              }

            }
            else {
              this.presentToastOrder();
              return;
            }
          }
          var order1 = { companyname: this.companyname, address: this.address, tax: this.tax, addressorder: this.addressorder, ishideNameMail: this.ishideNameMail, hotenhddt: this.hotenhddt, emailhddt: this.emailhddt }
          this.storage.set("order", order1);
          this.Roomif.order = this.companyname + "," + this.address + "," + this.tax + "," + this.addressorder;

          var co = 0;
          for (let i = 0; i < this.arr.length; i++) {
            this.arr[i].hoten = this.arr[i].hoten.trim();
            if (i == 0) {
              if (this.arr[i].hoten) {
                var checktext = this.hasWhiteSpace(this.arr[i].hoten);
                if (!checktext) {
                  co = 1;
                  break;
                }
              }
              else {
                co = 1;
                break;
              }
              if (!this.arr[i].phone) {
                co = 2;
                break;
              }
            }
            else {
              if (!this.arr[i].hoten) {
                var checktext = this.hasWhiteSpace(this.arr[i].hoten);
                if (!checktext) {
                  co = 1;
                  break;
                }
              }
            }
          }
          if (co == 0) {
            this.arr1 = [];
            //console.log(this.arr);
            if (this.arrbed.length > 1) {
              for (let i = 0; i < this.arr.length; i++) {
                var texthoten = this.arr[i].hoten.split(' ');
                if (texthoten.length > 2) {
                  let name = '';
                  for (let j = 1; j < texthoten.length; j++) {
                    if (j == 1) {
                      name += texthoten[j];
                    } else {
                      name += ' ' + texthoten[j];
                    }
                  }
                  item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.arrpush[i] }
                } else if (texthoten.length > 1) {
                  item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.arrpush[i] }
                }
                else if (texthoten.length == 1) {
                  item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.arrpush[i] }
                }
                this.arr1.push(item1);
              }
            }
            else {
              for (let i = 0; i < this.arr.length; i++) {
                var texthoten = this.arr[i].hoten.split(' ');
                if (texthoten > 2) {
                  let name = '';
                  for (let j = 1; j < texthoten.length; j++) {
                    if (j == 1) {
                      name += texthoten[j];
                    } else {
                      name += ' ' + texthoten[j];
                    }
                  }
                  item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
                } else if (texthoten.length > 1) {
                  item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
                }
                else if (texthoten.length == 1) {
                  item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
                }
                this.arr1.push(item1);
                // item1 = { Title: "MR", FirstName: this.arr[i].fristname, LastName: this.arr[i].lastname, Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
                // this.arr1.push(item1);
              }

            }

            this.Roomif.hoten = this.arr1[0].LastName + ' ' + this.arr1[0].FirstName;
            this.Roomif.phone = this.arr1[0].Phone;
            // info = { ho: this.arr1[0].LastName, ten: this.arr1[0].FirstName, phone: this.arr1[0].Phone }
            // this.storage.set("infocus", info);
            this.Roomif.arrcustomer = this.arr1;
            this.Roomif.notetotal = this.note;
            this.pushdata();
          } else {
            if (co == 1) {
              this.presentToastName();
            }
            else if (co == 2) {
              this.presentToastPhone();
            }

          }
        }
        else {
          this.presentToastOrder();
        }
      }
      else {
        var co = 0;
        for (let i = 0; i < this.arr.length; i++) {
          this.arr[i].hoten = this.arr[i].hoten.trim();
          if (i == 0) {
            if (this.arr[i].hoten) {
              var checktext = this.hasWhiteSpace(this.arr[i].hoten);
              if (!checktext) {
                co = 1;
                break;
              }
            }
            else {
              co = 1;
              break;
            }
            if (!this.arr[i].phone) {
              co = 2;
              break;
            }
          }
          else {
            if (this.arr[i].hoten) {
              var checktext = this.hasWhiteSpace(this.arr[i].hoten);
              if (!checktext) {
                co = 1;
                break;
              }
            }
            else {
              co = 1;
              break;
            }
          }
        }
        if (co == 0) {
          this.arr1 = [];
          //console.log(this.arr);
          if (this.arrbed.length > 1) {
            for (let i = 0; i < this.arr.length; i++) {
              var texthoten = this.arr[i].hoten.split(' ');
              if (texthoten.length > 2) {
                let name = '';
                for (let j = 1; j < texthoten.length; j++) {
                  if (j == 1) {
                    name += texthoten[j];
                  } else {
                    name += ' ' + texthoten[j];
                  }
                }
                item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.arrpush[i] }
              } else if (texthoten.length > 1) {
                item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.arrpush[i] }
              }
              else if (texthoten.length == 1) {
                item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.arrpush[i] }
              }
              this.arr1.push(item1);
            }
          }
          else {
            for (let i = 0; i < this.arr.length; i++) {
              var texthoten = this.arr[i].hoten.split(' ');
              if (texthoten.length > 2) {
                let name = '';
                for (let j = 1; j < texthoten.length; j++) {
                  if (j == 1) {
                    name += texthoten[j];
                  } else {
                    name += ' ' + texthoten[j];
                  }
                }
                item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
              } else if (texthoten.length > 1) {
                item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
              }
              else if (texthoten.length == 1) {
                item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
              }
              this.arr1.push(item1);
              // item1 = { Title: "MR", FirstName: this.arr[i].fristname, LastName: this.arr[i].lastname, Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
              // this.arr1.push(item1);
            }

          }

          this.Roomif.hoten = this.arr1[0].LastName + ' ' + this.arr1[0].FirstName;
          this.Roomif.phone = this.arr1[0].Phone;
          // info = { ho: this.arr1[0].LastName, ten: this.arr1[0].FirstName, phone: this.arr1[0].Phone }
          // this.storage.set("infocus", info);
          this.Roomif.arrcustomer = this.arr1;
          this.Roomif.notetotal = this.note;
          this.pushdata();
        } else {
          this.presentToastName();
        }
      }
    }
  }
  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập họ tên",
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
  async presentToastName() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập đầy đủ họ tên",
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
  pushdata() {
    if(this.Roomif.roomtype.Supplier == 'SERI'){
      //Check allotment trước khi book
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
    this.presentLoading();
    var se = this;
    this.jsonroom.RoomClasses = this.room;
    this.timestamp = Date.now();
        var Invoice = 0;
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

        let headers = {'content-type': 'application/json'};
        let body =
        {
          RoomClassObj: se.jsonroom.RoomClasses[0].ListObjRoomClass,
          CName: se.Roomif.hoten.trim(),
          CEmail: se._email,
          CPhone: se.Roomif.phone,
          timestamp: se.timestamp,
          HotelID: se.booking.HotelId,
          paymentMethod: "51",
          note: se.Roomif.notetotal,
          Source: '6',
          MemberToken: se.auth_token,
          CustomersStr: JSON.stringify(se.Roomif.arrcustomer),
          UsePointPrice: se.Roomif.pricepoint,
          NoteCorp: se.Roomif.order,
          Invoice: Invoice,
          UserPoints: se.Roomif.point,
          CheckInDate: se.jsonroom.CheckInDate,
          CheckOutDate: se.jsonroom.CheckOutDate,
          TotalNight: se.jsonroom.TotalNight,
          MealTypeIndex: this.booking.indexmealtype,
          CompanyName: se.Roomif.companyname,
          CompanyAddress: se.Roomif.address,
          CompanyTaxCode: se.Roomif.tax,
          BillingAddress: se.Roomif.addressorder,
          //promotionCode: se.Roomif.promocode,
          vouchers : !checkpromocode ? [...voucherSelectedMap,...promoSelectedMap] : arrpromocode,
          comboid: se.bookCombo.ComboId,
          PenaltyDescription: se.Roomif.textcancel,
          companycontactname: se.Roomif.nameOrder
        };
        let strUrl = C.urls.baseUrl.urlPost + '/mInsertBooking';
        this.gf.RequestApi('POST', strUrl, headers, body, 'roomadddetails-eans', 'getInstallment').then((data)=>{
          if (data) {
            if (data.error == 0) {
              var id = data.code;
              var total = se.Roomif.pricepoint;
              var ischeck = '1';
              let mealtype = se.jsonroom.RoomClasses[0].MealTypeRates[se.booking.indexmealtype];
              //PDANH 22/03/2021 - Case cấn trừ điểm của VIN gọi thêm hàn build link để đẩy xuống backend luồng VIN
              // if(mealtype && mealtype.Supplier == "VINPEARL" || mealtype.Supplier == "SMD"){
              //   let url  = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=office&source=app&amount=' + se.gf.convertStringToNumber(total) + '&orderCode=' + body.code + '&buyerPhone=' + se.Roomif.phone;
              //   se.gf.CreateUrl(url);
              // }
              se.Roomif.bookingCode = data.code;
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
              se.gf.logEventFirebase('On request',se.searchhotel, 'roomadddetails-ean', 'add_payment_info', 'Hotels');

              se.loader.dismiss();
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
          else {
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
  
  itemrd(item, itemindex) {
    if (this.arr.length == 0) {
      this.BedType = item;
    } else {
      this.zone.run(() => {
        this.arrpush[itemindex] = item;
        // if (this.arrpush) {
        //   for (let i = 0; i < this.arrpush.length; i++) {


        //   }
        // }
        // for (let i = 0; i < this.arr[itemindex].arrbed.length; i++) {
        //   if (this.arr[itemindex].arrbed[i].text.description == event.detail.value) {
        //     this.arr[itemindex].arrbed[i] =  event.detail;
        //   }
        //   else {
        //     this.arr[itemindex].arrbed[i].ischeck = false;
        //   }
        // }

      })
    }

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
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }
  // closeLoading() { this.loader.dismiss(); }
  // async presentToast() {
  //   let toast =await this.toastCtrl.create({
  //     message: "Xin vui lòng nhập họ tên",
  //     duration: 3000,
  //     position: 'top'
  //   });
  //   toast.present();
  // }
  // async presentToastOrder() {
  //   let toast =await this.toastCtrl.create({
  //     message: "Xin vui lòng nhập thông tin xuất hóa đơn",
  //     duration: 3000,
  //     position: 'top'
  //   });
  //   toast.present();
  // }
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
  refreshToken() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'GET',
        //   url: C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims',
        //   headers:
        //   {
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json',
        //     authorization: text
        //   },
        // }
        let headers =
        {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
        }
        let strUrl = C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims';
        this.gf.RequestApi('GET', strUrl, headers, {}, 'roomadddetails-eans', 'refreshToken').then((data)=>{
            var au = data;
            se.zone.run(() => {
              se.storage.remove('auth_token');
              se.storage.set('auth_token', au.auth_token);
              var decoded = jwt_decode<any>(au.auth_token);
              se.storage.remove('point');
              se.storage.set('point', decoded.point);
            })
          
        })
      }
    })
  }
  goback() {
    this.navCtrl.navigateBack('roomdetailreview');
  }
  paymentnotAL() {
    this.presentLoading();
    var se = this;
   
    se.jsonroom.RoomClasses = se.room;
    se.timestamp = Date.now();
    if (se._email) {
      se.booking.CEmail = se._email;
    }
    //29/11/2019: Cho phép book khi không login => bỏ require auth_token, chỉ require email
    //se.storage.get('auth_token').then(auth_token => {
    if (se.booking.CEmail) {
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

      let headers =
        {
          'cache-control': 'no-cache',
          'content-type': 'application/json'
        };
       let body =
        {
          RoomClassObj: se.jsonroom.RoomClasses[0].ListObjRoomClass,
          CName: se.Roomif.hoten.trim(),
          CEmail: se.booking.CEmail,
          CPhone: se.Roomif.phone,
          timestamp: se.timestamp,
          HotelID: se.booking.HotelId,
          paymentMethod: "51",
          note: se.Roomif.notetotal,
          Source: '6',
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
          companycontactname: se.Roomif.nameOrder
        };

        let strUrl = C.urls.baseUrl.urlPost + '/mInsertBooking';
        this.gf.RequestApi('POST', strUrl, headers, body, 'roomadddetails-eans', 'refreshToken').then((data)=>{
        if (data) {
          if (data.error == 0) {
            var code = data.code;
            var stt = data.bookingStatus;
            se.Roomif.bookingCode = data.code;
            se.searchhotel.paymentType = 'On request';
            se.gf.logEventFirebase('On request',se.searchhotel, 'roomadddetails-ean', 'add_payment_info', 'Hotels');
            se.loader.dismiss();
            if (se.Roomif.notetotal) {
              se.gf.CreateSupportRequest(data.code,se.booking.CEmail,se.Roomif.hoten,se.Roomif.phone,se.Roomif.notetotal);
            }
            se.navCtrl.navigateForward('/roompaymentdone/' + code + '/' + stt);
        
          }
          else {
            se.loader.dismiss();
            alert(data.Msg);
            se.storage.get('jti').then((memberid) => {
              se.storage.get('deviceToken').then((devicetoken) => {
                se.gf.refreshToken(memberid, devicetoken).then((token) =>{
                  setTimeout(()=>{
                    se.auth_token = token;
                  },100)
                });

              })
            })
          }
        }
        else {
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
  showNameMail(ev) {
    this.ishideNameMail = ev.detail.checked;
  }
  installment(){
    var se = this;
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

  inputFocus(item, event){
    var se = this;
    se.zone.run(()=>{
      if(!se.inputtext){
          if(se.listPaxSuggestByMemberId && se.listPaxSuggestByMemberId.length >0){
            se.inputtext = true;
            se.createHintPaxName(null, se.listPaxSuggestByMemberId);
          }
      }else{
        se.inputtext = true;
        se.updateHintPaxName(item, event.target.value, se.listPaxSuggestByMemberId)
      }
    })
    
  }

  inputLostFocus(item){
    var se = this;
    se.zone.run(()=>{
      setTimeout(()=>{
        se.inputtext = false;

        //se.checkInput(item, 2, isadult);
        if(se.hidepaxhint){
          if(item){
            item.hidePaxHint = true;
          }
          //item.hidePaxHint = true;
          se.hidepaxhint = false;
        }
      }, 400)
    })
    
  }

  async createHintPaxName(item, listpaxhint){
    var se = this;
    se.zone.run(()=>{
      if(item){
        se.currentSelectPax = item;
      }
      se.listpaxhint = [...listpaxhint];
    })
  }

  updateHintPaxName(item, value, listpaxhint){
    var se = this;
      let arraypax:any =[];
      se.zone.run(()=>{
          se.currentSelectPax = item;
        
          for (let index = 0; index < listpaxhint.length; index++) {
            const element = listpaxhint[index];
            if(element.fullName &&value && se.gf.convertFontVNI(element.fullName).toLowerCase().indexOf(se.gf.convertFontVNI(value).toLowerCase()) != -1 ){
              arraypax.push(element);
            }
            
          }

     
      se.listpaxhint = [...arraypax];
      })
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
            if(type == 9 && (!se.hoten || item.hoten)){

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
