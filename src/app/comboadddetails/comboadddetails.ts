import { Bookcombo, SearchHotel } from './../providers/book-service';

import { Booking } from '../providers/book-service';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController, Platform } from '@ionic/angular';
import { RoomInfo } from '../providers/book-service';
import { C } from '../providers/constants';
import { Storage } from '@ionic/storage';
import { GlobalFunction } from '../providers/globalfunction';
import { Facebook } from '@awesome-cordova-plugins/facebook/ngx';
import { BizTravelService } from '../providers/bizTravelService';
/**
 * Generated class for the RoomadddetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-comboadddetails',
  templateUrl: 'comboadddetails.html',
  styleUrls: ['comboadddetails.scss'],
})
export class ComboadddetailsPage implements OnInit {

  hoten; phone = ""; note; arr; roomnumber; room; ischeck: boolean; ishide;
  companyname; address; tax; addressorder; bed; bedchuoi; priceshow; ischeckpoint; ischeckbtn
  timestamp; paymentMethod; jsonroom; ischeckpayment; public loader: any; listcars; totalAdult
  _email: any;
  validemail: boolean = true;
  ishideNameMail=true;hotenhddt;emailhddt;

  inputtext: boolean = false;
  listPaxSuggestByMemberId: any= [];
  listpaxhint: any = [];
  hidepaxhint: boolean = false;
  currentSelectPax: any;
  jti: any;
  ngOnInit() {
  }
  constructor(public platform: Platform, public navCtrl: NavController, public zone: NgZone,
    private toastCtrl: ToastController, public Roomif: RoomInfo, public storage: Storage, public loadingCtrl: LoadingController,
    public booking: Booking, public gf: GlobalFunction, public Bookcombo: Bookcombo,
    private fb: Facebook,
    public searchhotel: SearchHotel,
    public bizTravelService: BizTravelService) {
    this.ischeckpayment = Roomif.ischeckpayment;
    this.totalAdult = Bookcombo.totalAdult;
    this.listcars = this.gf.getParams('carscombo');
    this.storage.get('infocus').then(infocus => {
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
    })
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
      }
    })
    this.storage.get('order').then(order => {
      if (order) {
        this.companyname = order.companyname;
        this.address = order.address;
        this.tax = order.tax;
        this.addressorder = order.addressorder;
        this.ishide = true;
        this.ischeck = true;
      } else {
        this.ishide = false;
        this.ischeck = false;
      }
    })
    this.note = Roomif.notetotal;
    this.room = this.Roomif.arrroom;
    this.jsonroom = {...Roomif.jsonroom};
    this.ischeckpoint = this.Roomif.ischeckpoint;
    if (this.ischeckpoint == true) {
      if (this.listcars.HotelBooking.TotalPrices == "0") {
        this.priceshow = 0;
      }
      else {
        this.priceshow = 1;
      }

    }
    else {
      this.ischeckbtn = true;
      if (this.Roomif.promocode) {
        if (this.listcars.HotelBooking.TotalPrices == "0") {
          this.priceshow = 0;
          this.ischeckbtn = false;
        }
        else {
          this.priceshow = 1;
        }
      }
      else {
        this.priceshow = 1;
      }
    }
    if (Roomif.ischeck) {
      this.ischeck = Roomif.ischeck;
    }
    
    this.storage.get('email').then(email => {
      if(email){
        this._email = email;
        var checkappleemail=this._email.includes("appleid");
        if (checkappleemail) {
          this.validemail = false;
        }
      }else{
        this.validemail = false;
      }
    })
    this.GetUserInfo();

    this.storage.get('jti').then(jti => {
      if (jti) {
        this.gf.RequestApi('GET', C.urls.baseUrl.urlMobile+'/api/Dashboard/GetListNameHotel?memberid='+jti, {},{}, 'flightadddetails', 'GetListName').then((data)=>{
          if(data && data.response && data.response.length >0){
            this.listPaxSuggestByMemberId = [...data.response];
          }
        })
      }
    })
    
    let se = this;
    se.searchhotel.totalPrice = se.listcars.HotelBooking.TotalPrices;
    se.gf.logEventFirebase('',se.searchhotel, 'comboadddetails', 'add_shipping_info', 'Combo');
    
    se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_INITIATED_CHECKOUT, {'fb_content_type': 'hotel'  ,'fb_content_id': se.Bookcombo.HotelCode ? se.Bookcombo.HotelCode : se.booking.code,'fb_num_items': se.searchhotel.roomnumber, 'fb_value': se.gf.convertNumberToDouble(se.listcars.HotelBooking.TotalPrices) ,  'fb_currency': 'VND' , 
    'checkin_date': se.listcars.HotelBooking.CheckInDate ,'checkout_date ': se.listcars.HotelBooking.CheckOutDate,'num_adults': se.listcars.HotelBooking.Adult,'num_children': (se.listcars.HotelBooking.Child ? se.listcars.HotelBooking.Child : 0), }, se.gf.convertStringToNumber(se.listcars.HotelBooking.TotalPrices) );
  }
  insertbooking() {
    var se = this;
    var form = this.listcars;
    form.HotelBooking.PaymentMethod="51"
    let headers ={};
    let body =  form;
      let strUrl = C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateComboTransferBooking';
      se.gf.RequestApi('POST', strUrl, headers, body, 'comboadddetails', 'insertbooking').then((data) => {
      var obj = data;
      let body1 = {
        BookingCode: obj.Code,
        DepartATCode: obj.TransferReserveCode.DepartReserveCode,
        ReturnATCode: obj.TransferReserveCode.ReturnReserveCode,
        FromPlaceCode: se.listcars.TransferBooking.fromPlaceCode
      };
      let strUrl = C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateTransactionIDComboTransfer';
      se.gf.RequestApi('POST', strUrl, headers, body1, 'comboadddetails', 'CreateTransactionIDComboTransfer').then((data) => {
        se.loader.dismiss();
        var json = data;
        if (json.Error == 0) {
          var ischeck = '1';
          se.Roomif.priceshowtt = '0';
          var total = 0;
          se.loader.dismiss();
          if(se.bizTravelService.isCompany){
            let url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=2&source=app&amount=' + se.listcars.HotelBooking.TotalPrices.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + obj.Code + '&buyerPhone=' + se.phone + '&memberId=' + se.jti ;
            se.gf.CreateUrl(url);
          }
          if (se.Roomif.payment == "AL") {
            se.navCtrl.navigateForward('/combodoneprepay/' + obj.Code + '/' + total + '/' + ischeck);
          }
          else {
            se.navCtrl.navigateForward('/combodone/' + obj.Code);
          }
          se.Bookcombo.bookingcode = obj.Code;
        }
      });
    })

  }
  GetUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        let headers = {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo';
        se.gf.RequestApi('GET', strUrl, headers, {}, 'comboadddetails', 'GetUserInfo').then((data) => {
            if (data && data.statusCode != 401) {
              var data = data;
              se.zone.run(() => {
                se.ishide = false;
                se.ischeck = false;
                var corpInfomations=data.corpInfomations[0];
                if(data.corpInfomations){
                  se.companyname = corpInfomations.legalName;
                  se.address = corpInfomations.address;
                  se.tax = corpInfomations.taxCode;
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
  next() {
    this.Roomif.notetotal = "";
    this.gf.googleAnalytion('roomadddetails', 'add_payment_info', '');
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
    //validate mail
    if(!this.validateEmail(this._email) || !this._email || !this.gf.checkUnicodeCharactor(this._email)){
      this.presentToastEmail();
      this.validemail = false;
      return;
    }
    this.clearClonePage('page-roompaymentselect');
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

          this.listcars.HotelBooking.Note = this.note;
          this.listcars.HotelBooking.CompName = this.companyname;
          this.listcars.HotelBooking.CompAddress = this.address;
          this.listcars.HotelBooking.CompTaxCode = this.tax;
          this.listcars.HotelBooking.CompanyContactEmail = this.Roomif.addressorder;
          this.listcars.HotelBooking.CompanyContactName = this.Roomif.nameOrder;
          this.listcars.HotelBooking.IsInvoice = 1;
          //xử lý tiếp ở đây
          if (this.priceshow > 0) {
            if (this.Roomif.payment == "AL") {
              this.Roomif.bookingCode="";
              this.navCtrl.navigateForward("combopayment");
            }
            else {
              this.postapibook();
            }
          } else {
            this.postapibook();
          }
        } else {
          this.presentToastOrder();
        }
      } else {
        this.presentToastPhone();
      }

    } else {
      if (this.phonenumber(this.phone)) {
        this.Roomif.hoten = this.hoten;
        this.Roomif.phone = this.phone;
        this.Roomif.notetotal = this.note;
        this.Roomif.ischeck = this.ischeck;
        this.clearClonePage('page-roompaymentselect');
        this.Roomif.notetotal = this.note;
        this.listcars.HotelBooking.Note = this.note;
        var textfullname = this.hoten.split(' ')
        var FirstName;
        var LastName;
        if (textfullname.length > 2) {
          let name = '';
          for (let i = 1; i < textfullname.length; i++) {
            if (i == 1) {
              name += textfullname[i];
            } else {
              name += ' ' + textfullname[i];
            }
          }
          FirstName = textfullname[0];
          LastName = name;
        } else if (textfullname.length > 1) {
          FirstName = textfullname[0];
          LastName = textfullname[1];
        }
        else if (textfullname.length == 1) {
          FirstName = textfullname[0];
          LastName = "";
        }
        this.listcars.TransferBooking.passengerInfo.FirstName = FirstName;
        this.listcars.TransferBooking.passengerInfo.LastName = LastName;
        this.listcars.TransferBooking.passengerInfo.Email = this._email;
        this.listcars.TransferBooking.passengerInfo.MobileNumber = this.phone;
        this.listcars.HotelBooking.CPhone = this.phone;
        this.listcars.HotelBooking.LeadingName = this.hoten;
        this.listcars.HotelBooking.CName = this.hoten;
        this.listcars.HotelBooking.LeadingEmail = this._email;
        this.listcars.HotelBooking.LeadingPhone = this.phone;
        if (this.priceshow > 0) {
          if (this.Roomif.payment == "AL") {
            this.Roomif.bookingCode="";
            this.navCtrl.navigateForward("combopayment");
          }
          else {
            this.postapibook();
          }
        } else {
          this.postapibook();
        }
      } else {
        this.presentToastPhone();
      }
    }
  }
  postapibook1() {
    var se = this;
    se.presentLoading();
    let body = {
      trip_code: this.listcars.TransferBooking.departTransfer.TransferNumber,
        seats: this.totalAdult,
        customer_phone: this.phone,
        customer_name: this.hoten,
        customer_email: 'tc@ivivu.com',
        coupon: "",
        pickup_id: this.listcars.TransferBooking.departTransfer.PickupPlaceCode,
        pickup: this.listcars.TransferBooking.departTransfer.PickupPlaceName,
        drop_off_id: this.listcars.TransferBooking.departTransfer.DropoffPlaceCode,
        drop_off: this.listcars.TransferBooking.departTransfer.DropoffPlaceName
    };
        let headers = {
          apikey: 'sx25k7TABO6W4ULFjfxoJJaLjQr0wUGxYCph1TQiTBM',
          apisecret: 'wZH8vCalp5-ZsUzJiP1IP6V2beWUm0ej8G_25gzg2xg'
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/reserve-transfer-seat';
        se.gf.RequestApi('POST', strUrl, headers, body, 'comboadddetails', 'postapibook1').then((data) => {
      if (data.status == 0) {
        var json = data.data;
        if (json.length > 0) {
          se.listcars.TransferBooking.departTransfer.ReservedTickets = JSON.stringify(json[0].data.reserve_Tickets);
          se.listcars.TransferBooking.returnTransfer.ReservedTickets = JSON.stringify(json[1].data.reserve_Tickets);
          var Seatsde = json[0].data.seats;
          var Seatsre = json[1].data.seats;
          var seatstextde = "";
          var seatstextre = "";
          for (let i = 0; i < Seatsde.length; i++) {
            if (i == Seatsde.length - 1) {
              seatstextde = seatstextde + Seatsde[i].seat_code;
            }
            else {
              seatstextde = seatstextde + Seatsde[i].seat_code + ',';
            }
          }
          for (let i = 0; i < Seatsre.length; i++) {
            if (i == Seatsre.length - 1) {
              seatstextre = seatstextre + Seatsre[i].seat_code;
            }
            else {
              seatstextre = seatstextre + Seatsre[i].seat_code + ',';
            }
          }
          se.listcars.TransferBooking.departTransfer.Seats = seatstextde;
          se.listcars.TransferBooking.returnTransfer.Seats = seatstextre;
          var textfullname = se.hoten.split(' ')
          var FirstName;
          var LastName;
          if (textfullname.length > 2) {
            let name = '';
            for (let i = 1; i < textfullname.length; i++) {
              if (i == 1) {
                name += textfullname[i];
              } else {
                name += ' ' + textfullname[i];
              }
            }
            FirstName = textfullname[0];
            LastName = name;
          } else if (textfullname.length > 1) {
            FirstName = textfullname[0];
            LastName = textfullname[1];
          }
          else if (textfullname.length == 1) {
            FirstName = textfullname[0];
            LastName = "";
          }
          se.listcars.TransferBooking.passengerInfo.FirstName = FirstName;
          se.listcars.TransferBooking.passengerInfo.LastName = LastName;
          se.listcars.TransferBooking.passengerInfo.Email = se._email;
          se.listcars.TransferBooking.passengerInfo.MobileNumber = se.phone;
          se.listcars.HotelBooking.CPhone = se.phone;
          se.listcars.HotelBooking.LeadingName = se.hoten;
          se.listcars.HotelBooking.LeadingEmail = se._email;
          se.listcars.HotelBooking.LeadingPhone = se.phone;
          if (se.priceshow > 0) {
            se.loader.dismiss();
            se.Roomif.bookingCode="";
            se.navCtrl.navigateForward("combopayment");
          } else {
            se.insertbooking();
          }
        } else {
          se.loader.dismiss();
          se.gf.showAlertMessageOnly("Không còn ghế xe, vui lòng chọn Nhà xe khác!");
        }
      }
      else {
        se.loader.dismiss();
        se.gf.showAlertMessageOnly("Không còn ghế xe, vui lòng chọn Nhà xe khác!");
      }

    });
  }
  postapibook() {
    var se = this;
    se.presentLoading();
    let headers = {
      apikey: 'sx25k7TABO6W4ULFjfxoJJaLjQr0wUGxYCph1TQiTBM',
      apisecret: 'wZH8vCalp5-ZsUzJiP1IP6V2beWUm0ej8G_25gzg2xg'
    };
    let body = {
      departParams:
      {
        trip_code: this.listcars.TransferBooking.departTransfer.TransferNumber,
        total_seats: this.Bookcombo.totalseatsdep,
        total_price: this.Bookcombo.pricedep,
        code: '',
        dropoff_place: "",
        pickup_place: ""
      },
      returnParams:
      {
        trip_code: this.listcars.TransferBooking.returnTransfer.TransferNumber,
        total_seats: this.Bookcombo.totalseatsret,
        total_price: this.Bookcombo.priceret,
        code: '',
        pickup_place: '',
        dropoff_place: ''
      },
      customer_phone: this.phone,
      customer_name: this.hoten,
      customer_email: 'tc@ivivu.com',
      pay_status: 0
    };
    let strUrl = C.urls.baseUrl.urlMobile + '/booking';
    se.gf.RequestApi('POST', strUrl, headers, body, 'comboadddetails', 'postapibook').then((data) => {
      if (data.status == 0) {
        var json = data.data;
        if (json.length > 0) {
          se.listcars.TransferBooking.departTransfer.ReservedTickets = JSON.stringify(json[0].data.reserve_Tickets);
          se.listcars.TransferBooking.returnTransfer.ReservedTickets = JSON.stringify(json[1].data.reserve_Tickets);
          var Seatsde = json[0].data.seats;
          var Seatsre = json[1].data.seats;
          var seatstextde = "";
          var seatstextre = "";
          for (let i = 0; i < Seatsde.length; i++) {
            if (i == Seatsde.length - 1) {
              seatstextde = seatstextde + Seatsde[i].seat_code;
            }
            else {
              seatstextde = seatstextde + Seatsde[i].seat_code + ',';
            }
          }
          for (let i = 0; i < Seatsre.length; i++) {
            if (i == Seatsre.length - 1) {
              seatstextre = seatstextre + Seatsre[i].seat_code;
            }
            else {
              seatstextre = seatstextre + Seatsre[i].seat_code + ',';
            }
          }
          se.listcars.TransferBooking.departTransfer.Seats = seatstextde;
          se.listcars.TransferBooking.returnTransfer.Seats = seatstextre;
          var textfullname = se.hoten.split(' ')
          var FirstName;
          var LastName;
          if (textfullname.length > 2) {
            let name = '';
            for (let i = 1; i < textfullname.length; i++) {
              if (i == 1) {
                name += textfullname[i];
              } else {
                name += ' ' + textfullname[i];
              }
            }
            FirstName = textfullname[0];
            LastName = name;
          } else if (textfullname.length > 1) {
            FirstName = textfullname[0];
            LastName = textfullname[1];
          }
          else if (textfullname.length == 1) {
            FirstName = textfullname[0];
            LastName = "";
          }
          se.listcars.TransferBooking.passengerInfo.FirstName = FirstName;
          se.listcars.TransferBooking.passengerInfo.LastName = LastName;
          se.listcars.TransferBooking.passengerInfo.Email = se._email;
          se.listcars.TransferBooking.passengerInfo.MobileNumber = se.phone;
          se.listcars.HotelBooking.CPhone = se.phone;
          se.listcars.HotelBooking.LeadingName = se.hoten;
          se.listcars.HotelBooking.LeadingEmail = se._email;
          se.listcars.HotelBooking.LeadingPhone = se.phone;
          se.insertbooking();
        } else {
          se.loader.dismiss();
          se.gf.showAlertMessageOnly("Không còn ghế xe, vui lòng chọn Nhà xe khác!");
          se.navCtrl.navigateBack('/combocarnew');
        }
      }
      else {
        se.loader.dismiss();
        se.gf.showAlertMessageOnly("Không còn ghế xe, vui lòng chọn Nhà xe khác!");
        se.navCtrl.navigateBack('/combocarnew');
      }
    });
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
    //validate mail
    if(!this.validateEmail(this._email) || !this._email || !this.gf.checkUnicodeCharactor(this._email)){
      this.presentToastEmail();
      this.validemail = false;
      return;
    }
    this.Roomif.order = "";
    this.clearClonePage('page-roompaymentdoneean');
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
          this.listcars.HotelBooking.Note = this.note;
          this.listcars.HotelBooking.CompName = this.companyname;
          this.listcars.HotelBooking.CompAddress = this.address;
          this.listcars.HotelBooking.CompTaxCode = this.tax;
          this.listcars.HotelBooking.CAddress = this.addressorder;
          this.listcars.HotelBooking.IsInvoice = 1;
          if (this.priceshow > 0) {
            this.Roomif.bookingCode="";
            this.navCtrl.navigateForward("combopayment");
          } else {
            this.postapibook();
          }
        } else {
          this.presentToastOrder();
        }
      } else {
        this.presentToastPhone();
      }
    } else {
      if (this.phonenumber(this.phone)) {
        this.Roomif.hoten = this.hoten;
        this.Roomif.phone = this.phone;
        this.Roomif.notetotal = this.note;
        this.Roomif.ischeck = this.ischeck;
        this.clearClonePage('page-roompaymentdoneean');
        this.Roomif.notetotal = this.note;
        this.listcars.HotelBooking.Note = this.note;
        if (this.priceshow > 0) {
          this.Roomif.bookingCode="";
          this.navCtrl.navigateForward("combopayment");
        } else {
          this.postapibook();
        }
      } else {
        this.presentToastPhone();
      }
    }
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
  clearClonePage(pagename) {
    //Xóa clone do push page
    let elements: any = [];
    elements = Array.from(window.document.querySelectorAll(pagename));
    if (elements != null && elements.length > 0) {
      elements.forEach(el => {
        if (el != null && el.length > 0) {
          el.remove();
        }
      });
    }
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
    this.navCtrl.back();
  }
  hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
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
  showNameMail(ev)
  {
    this.ishideNameMail=ev.detail.checked;
  }

  inputFocus(item, event){
    var se = this;
    
      if(!se.inputtext){
        if(se.listPaxSuggestByMemberId && se.listPaxSuggestByMemberId.length >0){
          se.inputtext = true;
          se.createHintPaxName(null, se.listPaxSuggestByMemberId);
        }
      }else{
        se.inputtext = true;
        se.updateHintPaxName(item, event.target.value, se.listPaxSuggestByMemberId)
      }
  }

  updateHintPaxName(item, value, listpaxhint){
    var se = this;
      let arraypax: any =[];
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

  inputLostFocus(item){
    var se = this;
      setTimeout(()=>{
        se.inputtext = false;
        if(se.hidepaxhint){
          if(item){
            item.hidePaxHint = true;
          }
          se.hidepaxhint = false;
        }
      }, 400)
  }

  async createHintPaxName(item, listpaxhint){
    var se = this;
    if(item){
      se.currentSelectPax = item;
    }
    se.listpaxhint = [...listpaxhint];
  }

  selectPaxHint(paxhint){
    var se = this;
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
  }
  hidePaxHint(){
    this.hidepaxhint = true;
  }

  inputOnFocus(item, type){
    var se = this;
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
}

