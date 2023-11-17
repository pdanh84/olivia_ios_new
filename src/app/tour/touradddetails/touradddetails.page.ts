import { Bookcombo } from './../../providers/book-service';

import { Booking } from '../../providers/book-service';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController, Platform, AlertController, ModalController } from '@ionic/angular';
import { RoomInfo } from '../../providers/book-service';
import { C } from '../../providers/constants';

import { Storage } from '@ionic/storage';
import { GlobalFunction, ActivityService } from '../../providers/globalfunction';
import jwt_decode from 'jwt-decode';
import { tourService } from 'src/app/providers/tourService';
import * as moment from 'moment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as $ from 'jquery';
import { voucherService } from '../../providers/voucherService';
import { AdddiscountPage } from 'src/app/adddiscount/adddiscount.page';
import { OverlayEventDetail } from '@ionic/core';

import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
var document:any;
/**
 * Generated class for the RoomadddetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-touradddetails.page',
  templateUrl: 'touradddetails.page.html',
  styleUrls: ['touradddetails.page.scss'],
})
export class TourAddDetailsPage implements OnInit {

  hoten;phone = ""; note; arr; roomnumber; room; ischeck: boolean = false; ishide = false;
  companyname; address; tax; addressorder; bed; bedchuoi; priceshow; ischeckbtn;
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
  memberid: any='';
  totalPriceStr: any;
  point: number;
  promocode:string='';
  discountpromo:number=0;
  itemVoucherTour: any;
  ischeckpoint = false;
  msg: string;
  textpromotion: any;
  Pricepointshow: any;
  ischeckpromo: boolean;
  usePointPrice: number;
  private subscription: Subscription;
  ngOnInit() {
    this._voucherService.getTourObservable().subscribe((itemVoucher)=> {
      if(itemVoucher){
        if(itemVoucher.applyFor && itemVoucher.applyFor != 'tour'){
          this._voucherService.rollbackSelectedVoucher.emit(itemVoucher);
          this.gf.showAlertMessageOnly(`Mã voucher ${this.promocode} không áp dụng cho chương trình này. Quý khách vui lòng kiểm tra lại.`);
          return;
        }
        if(this.promocode && this.promocode != itemVoucher.code && !this.itemVoucherTour){
          this._voucherService.rollbackSelectedVoucher.emit(itemVoucher);
          this.gf.showAlertMessageOnly(`Mã voucher ${this.promocode} đang được sử dụng. Quý khách vui lòng kiểm tra lại.`);
          return;
        }
        if(itemVoucher.claimed){
          this.zone.run(()=>{
            this._voucherService.selectVoucher = itemVoucher;
            this.itemVoucherTour = itemVoucher;
            this.promocode = itemVoucher.code;
            this.discountpromo = itemVoucher.rewardsItem.price;
            this.ischeckpromo = true;
            this.tourService.promocode = itemVoucher.code;
            this.tourService.discountpromo = this.discountpromo;
            
          })
        }else{
          this.zone.run(()=>{
            this._voucherService.selectVoucher = null;
            this.itemVoucherTour = null;
            this.promocode = "";
            this.discountpromo = 0;
            this.ischeckpromo = false;
            this.tourService.promocode = "";
            this.tourService.discountpromo = 0;
            this.tourService.totalPriceBeforeDiscount = 0;
            this.tourService.discountPrice = 0;
            
          })
          
        }
        this.edit(2);
       
        this.modalCtrl.dismiss();
        setTimeout(()=> {
          this.checkVoucherClaimed();
        },300)
      }
    })
    
    this._voucherService.getObservableClearVoucherAfterPaymentDone().subscribe((check)=> {
      if(check){
        this._voucherService.selectVoucher = null;
          this.itemVoucherTour = null;
          this.promocode = "";
          this.discountpromo = 0;
          this.tourService.usePointPrice = 0;
          //this.ischeckbtnpromo = false;
          //this.ischeckpromo = false;
          this.edit(2);
      }
    })
  }
  constructor(public platform: Platform, public navCtrl: NavController, public zone: NgZone,
    private toastCtrl: ToastController, public Roomif: RoomInfo, public storage: Storage, public loadingCtrl: LoadingController,
    public booking: Booking, public gf: GlobalFunction,public bookCombo:Bookcombo, public httpClient: HttpClient,
    private alertCtrl: AlertController,
    public activityService: ActivityService,
    public tourService: tourService,
    public _voucherService: voucherService,
    private modalCtrl: ModalController,
    public router: Router) {
      this.platform.resume.subscribe(async () => {
        this.subscription = this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd && (event.url.indexOf('touradddetails') != -1) ) {
            if (!this.tourService || (this.tourService && !this.tourService.itemDepartureCalendar)) {
              this.navCtrl.navigateBack('/app/tabs/tab1');
            }
          }
        })
      })
    this.ischeckpayment = Roomif.ischeckpayment;
    let tp =0;
    if(this.tourService.itemDepartureCalendar && this.tourService.itemDepartureCalendar.TotalRate){
      tp = this.tourService.itemDepartureCalendar.TotalRate;
    }else{
      tp = ((this.tourService.itemDepartureCalendar.RateAdultAvg || (this.tourService.itemDepartureCalendar.PriceAdultAvg ||0)) * this.tourService.adult || 0) + ((this.tourService.itemDepartureCalendar.RateChildAvg ||0) * this.tourService.child || 0);
    }
    
    this.totalPriceStr = this.gf.convertNumberToString(tp);
    this.storage.get('jti').then((memberid) => {
      this.memberid = memberid;
    })
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
        this.priceshow = this.gf.convertStringToNumber(this.Roomif.priceshow);
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
          this.priceshow = this.gf.convertStringToNumber(this.Roomif.priceshow);
        }
      }
    }
    if (Roomif.ischeck) {
      this.ischeck = Roomif.ischeck;
    }
    //var roomtype:any = this.Roomif.roomtype;
    var priceBooking:any = "";
    if(this.Roomif.priceshow){
      priceBooking = this.gf.convertStringToNumber(this.Roomif.priceshow);
    }else if(this.booking.cost){
      priceBooking = this.gf.convertStringToNumber(this.booking.cost);
    }
   
    this.GetUserInfo();
    //tour nước ngoài mặc định tích chọn xuất HD
      if(!this.tourService.itemDetail.Inbound){
        this.ishide = true;
        this.ischeck = true;
      }
    
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
        this.gf.RequestApi('GET', C.urls.baseUrl.urlMobile+'/api/Dashboard/GetListNameHotel?memberid='+jti, {},{}, 'flightadddetails', 'GetListNameHotel').then((data)=>{
          if(data && data.length >0){
            this.listPaxSuggestByMemberId = [...data];
          }
        })
      }
    })
  }
  GetUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
      if (auth_token) {
        var text = "Bearer " + auth_token;
        let headers =
          {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
          }
        let strUrl = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo';
        se.gf.RequestApi('GET', strUrl, headers, {}, 'touradddetails', 'loadUserInfo').then((data) => {
              //var data = JSON.parse(body);
            if(data){
              se.zone.run(() => {
                var corpInfomations=data.corpInfomations[0];
                if(corpInfomations){
                  se.companyname = corpInfomations.legalName;
                  se.address = corpInfomations.address;
                  se.tax = corpInfomations.taxCode;
                  // se.addressorder = corpInfomations.addressorder;
                  // se.hotenhddt=corpInfomations.hotenhddt;
                  // se.emailhddt=corpInfomations.emailhddt;
                  // se.ishideNameMail=corpInfomations.ishideNameMail;
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
                    }
                  })
                }

                if (data.point) {
                  se.Roomif.point = data.point;
                  se.point = data.point * 1000;
                  //se.price = se.point.toLocaleString();
                }
              })
            }
            else if (data.statusCode == 401) {
              se.storage.get('jti').then((memberid) => {
                  se.storage.get('deviceToken').then((devicetoken) => {
                      se.gf.refreshToken(memberid, devicetoken).then((token) => {
                          se.storage.remove('auth_token').then(() => {
                              se.storage.set('auth_token', token);
                          })
                          setTimeout(() => {
                              se.GetUserInfo();
                          }, 300)
                      });
  
                  })
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


    this.zone.run(()=> {
      if(this._voucherService.selectVoucher){
        this._voucherService.rollbackSelectedVoucher.emit(this._voucherService.selectVoucher);
        this._voucherService.selectVoucher = null;
      }
      
      this.itemVoucherTour = null;
      this.promocode = "";
      this.discountpromo = 0;
      this.ischeckpromo = false;
      this.tourService.promocode = "";
      this.tourService.discountpromo = 0;
      this.tourService.totalPriceBeforeDiscount = 0;
      this.tourService.discountPrice = 0;
      this.tourService.usePointPrice = 0;
      this.edit(2);
    })

    this.gf.logEventFirebase('',this.tourService, 'touradddetails', 'add_shipping_info', 'Tours');
  }
  createObjectBooking(isPaymentDirect) : Promise<any>{
    return new Promise((resolve, reject)=> {
      this.Roomif.notetotal = "";
      this.gf.googleAnalytion('touradddetails', 'tour_payment_info', '');
      if (this.hoten) {
        this.hoten = this.hoten.trim();
        var checktext=this.hasWhiteSpace(this.hoten);
        if (!checktext) {
          this.presentToastHo();
          resolve(false);
          return;
          
        }
      }
      else {
        this.presentToastHo();
        resolve(false);
        return;
        
      }
      
    
      //this.clearClonePage('page-roompaymentselect');
      this.Roomif.order = "";
      
          if (!this.phonenumber(this.phone)) {
            this.presentToastPhone();
            resolve(false);
            return;
            
          }
          //validate mail
          if(!this.validateEmail(this._email) || !this._email || !this.gf.checkUnicodeCharactor(this._email)){
            this.presentToastEmail();
            this.validemail = false;
            resolve(false);
            return;
            
          }
          this.booking.CEmail = this._email;
        
          let objTourReq:any = {};
          objTourReq.TourId = this.tourService.tourDetailId;
          objTourReq.StartDate =  moment(this.tourService.DepartureDate).format('YYYY-MM-DD');
          objTourReq.AdultNo = this.tourService.adult;
          objTourReq.ChildNo = this.tourService.child ? this.tourService.child :0;
          //objTourReq.ChildAges = this.tourService.child ? this.tourService.arrchild.join(',') : "";
          objTourReq.NightNo = this.tourService.itemDetail.NightNo;
          objTourReq.PaymentStatus = -1;
          
  
          if (this.ischeck && isPaymentDirect) {
            if (this.companyname && this.address && this.tax) {
              this.companyname = this.companyname.trim();
              this.address = this.address.trim();
              this.tax = this.tax.trim();
            }
            else {
              this.presentToastOrder();
              resolve(false);
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
    
              objTourReq.CustomerEmail = this._email;
              objTourReq.CustomerName = this.hoten;
              objTourReq.CustomerPhone = this.phone;
              objTourReq.CustomerTitle = "";
              objTourReq.BillingAddress = this.addressorder;
              objTourReq.CompanyAddress = this.address;
              objTourReq.CompanyTaxCode = this.tax;
              objTourReq.CompanyName = this.companyname;
              objTourReq.CooperatorEmail = "";
              objTourReq.CooperatorName = "";
              objTourReq.CooperatorPhone = "";
              objTourReq.IsInvoice = this.tourService.itemDetail.Inbound ? 1 : 0;
    
              if (!this.ishideNameMail ) {
                if (this.emailhddt && this.hotenhddt) {
                  if(!this.validateEmail(this.emailhddt) || !this.gf.checkUnicodeCharactor(this.emailhddt)){
                    this.gf.showToastWarning('email xuất hóa đơn không hợp lệ. Vui lòng kiểm tra lại');
                    resolve(false);
                    return;
                  }
                  else{
                    this.Roomif.addressorder = this.emailhddt;
                    this.Roomif.nameOrder = this.hotenhddt;
  
                    var order1 = { companyname: this.companyname, address: this.address, tax: this.tax, addressorder: this.addressorder,ishideNameMail: this.ishideNameMail,hotenhddt:this.hotenhddt,emailhddt:this.emailhddt }
                    this.storage.set("order", order1);
                    this.Roomif.order = this.companyname + "," + this.address + "," + this.tax + "," + this.addressorder;
                    this.Roomif.notetotal = this.note;
                    this.Roomif.ischeck = this.ischeck;
                    
                    
                  }
                }
                else{
                  this.presentToastOrder();
                  resolve(false);
                  return;
                }
              } 
              
            } else {
              this.presentToastOrder();
              resolve(false);
              return;
            }
            this.tourService.order = this.companyname + "," + this.address + "," + this.tax + "," + this.addressorder;
            this.tourService.notetotal = this.note;
            this.tourService.ischeck = this.ischeck;
            if(this.tourService.itemDetail.Inbound){
              let tp =0;
              if(this.tourService.itemDepartureCalendar && this.tourService.itemDepartureCalendar.TotalRate){
                tp = this.tourService.itemDepartureCalendar.TotalRate;
              }else{
                tp = ((this.tourService.itemDepartureCalendar.RateAdultAvg || (this.tourService.itemDepartureCalendar.PriceAdultAvg ||0)) * this.tourService.adult || 0) + ((this.tourService.itemDepartureCalendar.RateChildAvg ||0) * this.tourService.child || 0);
              }
              tp = tp *1.08;
              
              this.zone.run(()=> {
                this.totalPriceStr = this.gf.convertNumberToString(tp);
              })
            }
            
          } else{
              objTourReq.CustomerTitle = "";
              objTourReq.BillingAddress = "";
              objTourReq.CompanyAddress = "";
              objTourReq.CompanyTaxCode = "";
              objTourReq.CompanyName = "";
              objTourReq.CooperatorEmail = "";
              objTourReq.CooperatorName = "";
              objTourReq.CooperatorPhone = "";
              objTourReq.IsInvoice = 0;
          }
  
              objTourReq.CustomerEmail = this._email;
              objTourReq.CustomerName = this.hoten;
              objTourReq.CustomerPhone = this.phone;
              objTourReq.AdultNo = this.tourService.adult;
              objTourReq.ChildNo = this.tourService.child;
              if(this.tourService.arrchild && this.tourService.arrchild.length >0){
                let arrChildAges = this.tourService.arrchild.map((a) => a.numage);
                objTourReq.ChildAges = arrChildAges.join(',');
              }else{
                objTourReq.ChildAges ='';
              }
              
              objTourReq.LeadingTitle = "";
              objTourReq.LeadingName = this.hoten;
              objTourReq.LeadingPhone = this.phone;
              objTourReq.LeadingEmail = this._email;
              objTourReq.BookingChanel = 'Olivia_App';
              objTourReq.BookingType = 'TOUR';
              objTourReq.CancelRules = this.tourService.itemDetail.CancelRules;
              objTourReq.CancelRulesChange = this.tourService.itemDetail.CancelRules;
              objTourReq.Destinations = this.tourService.itemDetail.Destination;
              objTourReq.IncludePrice = this.tourService.itemDetail.IncludePrice;
              objTourReq.NoIncludePrice = this.tourService.itemDetail.NoIncludePrice;
              objTourReq.InternalNote = this.tourService.itemDetail.CancelRules;
              objTourReq.IsInLand = this.tourService.itemDetail.Inbound ? 1 :0 ;
              objTourReq.TourNotes = this.note || '';
              objTourReq.InternalNote = "";
              objTourReq.PaxList = "";
              objTourReq.MemberId = this.memberid;
              objTourReq.UsePointPrice = this.ischeckpoint ? this.usePointPrice : 0;
              objTourReq.Source = 6;
              objTourReq.SupplierCode = "Internal";
              objTourReq.SupplierOrderID = "";
              objTourReq.RequestBookingXml = "";
              objTourReq.BookingType = "Tour";
              objTourReq.IsNonRefundable = false;
              objTourReq.DiscountCode = this.promocode || "";
              objTourReq.Discount = 0;
              objTourReq.PromoPrice = this.discountpromo || 0;
              objTourReq.Username = "itsupport";
              objTourReq.PaymentMethod = 2;
              if(this.tourService.itemDepartureCalendar && this.tourService.itemDepartureCalendar.RateSurchargeAdult && this.tourService.itemDepartureCalendar.Note){
                let JsonSurchargeFee:any = [];
                JsonSurchargeFee.push({
                  "name": this.tourService.itemDepartureCalendar.Note,
                  "quantity": 1,
                  "price": this.tourService.itemDepartureCalendar.RateSurchargeAdult,
                  "priceNet": this.tourService.itemDepartureCalendar.RateSurchargeAdult
                });
                objTourReq.JsonSurchargeFee = JSON.stringify(JsonSurchargeFee);
                objTourReq.Supplement = this.tourService.itemDepartureCalendar.Note;
              }else {
                objTourReq.JsonSurchargeFee = JSON.stringify([]);
                objTourReq.Supplement = "";
              }
              this.tourService.TourBooking = objTourReq;
              resolve(true);
    })
    
  }
  next() {
    this.createObjectBooking(1).then((checkvalid)=>{
      if(checkvalid){
        this.checkTourAllotment().then((data)=>{
          if(data.Status != 'Error' && data.Status != 'False' && data.Response.TourRate && data.Response.TourRate.Status == 'AL'){
            if(this.tourService.discountPrice == 0 && (this.tourService.promocode || this.ischeckpoint)){
              this.createBookingTour().then((code)=>{
                this.gf.hideLoading();
                if(code){
                  this.tourService.tourBookingCode = code;
                  this.tourService.BookingTourMytrip = null;
                  this.createBookingTourDiscountTransaction(code);
               
                }
              })
            }else{
              this.tourService.dataBookResponse = data.Response;
              this.tourService.BookingTourMytrip = null;
              this.navCtrl.navigateForward('/tourpaymentselect');
            }
            
          }else{
            this.gf.showAlertMessageOnly(data.Msg);
          }
        })
      }
      
    })
    
        

      
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
    //this.clearClonePage('page-roompaymentdoneean');
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
          //this.pushdata();
        } else {
          this.presentToastOrder();
          return;
        }

      } else {
        this.presentToastPhone();
        return;
      }
    } else {
      if (this.phonenumber(this.phone)) {
        // var info = { ho: this.ho, ten: this.ten, phone: this.phone }
        // this.storage.set("infocus", info);
        this.Roomif.hoten = this.hoten;
        this.Roomif.phone = this.phone;
        this.Roomif.notetotal = this.note;
        this.Roomif.ischeck = this.ischeck;
        //this.clearClonePage('page-roompaymentdoneean');
       
        this.Roomif.notetotal = this.note;
        //console.log(this.Roomif.notetotal);
        //this.pushdata();

      } else {
        this.presentToastPhone();
        return;
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
      if(co != 2){//use point
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
      }
      let tp =0;
      this.tourService.discountPrice = 0;
      if(this.tourService.itemDepartureCalendar && this.tourService.itemDepartureCalendar.TotalRate){
        tp = this.tourService.itemDepartureCalendar.TotalRate;
      }else{
        tp = ((this.tourService.itemDepartureCalendar.RateAdultAvg || (this.tourService.itemDepartureCalendar.PriceAdultAvg ||0)) * this.tourService.adult || 0) + ((this.tourService.itemDepartureCalendar.RateChildAvg ||0) * this.tourService.child || 0);
      }

      if(this.ischeck && this.tourService.itemDetail.Inbound){
          tp = tp *1.08;
      }

      this.tourService.totalPriceBeforeDiscount = tp;
      if(this.ischeckpoint && this.point >0) {
        if(this.point >= tp){
          this.usePointPrice = tp;
        }else {
          this.usePointPrice = this.point;
        }
        this.tourService.usePointPrice = this.usePointPrice;

        tp = tp - this.point;
        if(tp <= 0) {
          this.Pricepointshow = 0;
          tp =0;
        }
        this.tourService.discountPrice = tp;
      }

      if(this.discountpromo){
        tp = this.ischeckpromo ? tp - this.discountpromo : tp;
        if(tp <= 0) {
          this.Pricepointshow = 0;
          tp =0;
        }
        this.tourService.discountPrice = tp;
      }

      this.tourService.totalPrice = tp;
      this.zone.run(()=> {
        this.totalPriceStr = tp >0 ? this.gf.convertNumberToString(tp) : "0";
      })
    })

  }
  ionViewDidLoad() {
    // this.navBar.backButtonClick = (e: UIEvent) => {
    //   // todo something
    //   //this.clearClonePage('page-roomdetailreview');
    //   //this.navCtrl.push("RoomdetailreviewPage");
    //   this.navCtrl.pop();
    // }
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
    this.itemVoucherTour = null;
      this.promocode = "";
      this.discountpromo = 0;
      this.ischeckpromo = false;
      this.tourService.promocode = "";
      this.tourService.discountpromo = 0;
      this.tourService.totalPriceBeforeDiscount = 0;
      this.tourService.discountPrice = 0;
      this.tourService.usePointPrice = 0;
    this.navCtrl.navigateBack('tourdeparturecalendar');
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
          book() {
            if(this.tourService.hasDeparture){
              this.navCtrl.navigateForward('/tourpaymentselect');
            }else{
              this.navCtrl.navigateForward('/tourpaymentdone');
            }
            
          }

          checkTourAllotment() : Promise<any>{
            var se = this;
            let body = { "TourId": se.tourService.tourDetailId,
            "StartDate": moment(se.tourService.DepartureDate).format('YYYY-MM-DD'),
            "AdultNo": se.tourService.adult,
            "ChildNo": se.tourService.child ? se.tourService.child :0,
            "ChildAges": se.tourService.child ? se.tourService.arrchild.map(c=>c.numage).join(',') : ""
            };
          
            return new Promise((resolve, reject) => {
              let urlApi = C.urls.baseUrl.urlMobile+'/tour/api/TourApi/CheckAllotmentPreBooking';
              let headers = {
                apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
                apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
              };
              se.gf.RequestApi('POST', C.urls.baseUrl.urlMobile+'/tour/api/TourApi/CheckAllotmentPreBooking', headers, body, 'touradddetails', 'CheckAllotmentPreBooking').then((data)=>{
                  resolve(data);
               })
            })
          }

          request(type){
            let se = this;
            if(type ==2){
              se.createObjectBooking(0);
              se.createBookingTour().then((code)=>{
                se.gf.hideLoading();
                if(code){
                  se.tourService.tourBookingCode = code;
                  se.createBookingTourTransaction(code);
                  se.tourService.gaPaymentType = 'Yeu Cau Dat Tour';
                  se.gf.logEventFirebase('Yeu Cau Dat Tour',se.tourService, 'touradddetails', 'add_payment_info', 'Tours');
                  se.navCtrl.navigateForward('/tourrequestdone');
                }
              })
            }else{
              se.tourService.gaPaymentType = 'Yeu Cau Tu Van';
              se.gf.logEventFirebase('Yeu Cau Tu Van',se.tourService, 'touradddetails', 'add_payment_info', 'Tours');
              se.gf.showLoading();
              let urlApi = C.urls.baseUrl.urlMobile+`/tour/api/TourApi/CreateRequestQuote?TourId=${se.tourService.tourDetailId}&date=${moment(se.tourService.DepartureDate).format('YYYY-MM-DD')}&adult=${se.tourService.adult}&child=${se.tourService.child || 0}&childAges=${se.tourService.child ? se.tourService.arrchild.map(c=>c.numage).join(',') : ""}&nightNo=${se.tourService.itemDetail.NightNo}&totalRate=${se.tourService.totalPrice}&act=book&paymentMethod=1&receiverAddress&customerName=${this.hoten}&customerphone=${this.phone}&customeremail=${this._email}&notes=${this.note}&qty=1`;
                  let headers = {
                    apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
                    apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
                  };
                  se.gf.RequestApi('GET', urlApi, headers, {}, 'touradddetails', 'CreateRequestQuote').then((data)=>{
                     if(data && data.Status == 'Success'){
                      se.gf.hideLoading();
                      //se.gf.showToastWarning(`${type==3? 'Gửi yêu cầu tư vấn':'Gửi yêu cầu đặt'} thành công!`);
                      se.navCtrl.navigateForward('/tourrequestdone');
                     }else{
                      se.gf.hideLoading();
                      se.gf.showAlertMessageOnly(data.Msg);
                     }
                  })
            }
            
          }

          createBookingTourTransaction(code) {
            let urlApiTrans = C.urls.baseUrl.urlMobile+'/tour/api/BookingsApi/UpdateTransaction?bookingCode='+code;
            let headers = {
              apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
              apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
            };
            this.gf.RequestApi('GET', urlApiTrans, headers, null , 'tourpaymentbank', 'UpdateTransaction').then((dataTrans)=>{
              console.log(dataTrans);
              if(dataTrans){
                this.navCtrl.navigateForward('/tourrequestdone');
              }
            });
          }

          createBookingTour():Promise<any> {
            var se = this;
            this.gf.showLoading();
            return new Promise((resolve, reject) => {
              if (se._email) {
                var Invoice=0;
                if (se.tourService.order) {
                  Invoice=1;
                }
                  let urlApi = C.urls.baseUrl.urlMobile+'/tour/api/TourApi/CreateBookingVerApi';
                  let headers = {
                    apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
                    apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
                  };
                  se.gf.RequestApi('POST', urlApi, headers, se.tourService.TourBooking, 'tourpaymentbank', 'CreateBookingVerApi').then((data)=>{
                    if(data && data.Status == "Success" && data.Response && data.Response.BookingCode){
                      se.tourService.tourBookingCode = data.Response.BookingCode;
                      se.tourService.tourTotal = data.Response.Total;
                      // moi truong test k có api sử dụng link live
                      let urlApiSendMail="https://gate.ivivu.com/tour/api/TourApi/AppSendEmailCustomer";
                      let objTourSendMail:any = {};
                      objTourSendMail.startDate=se.tourService.TourBooking.StartDate;
                      var endDate = moment(se.tourService.TourBooking.StartDate).add(this.tourService.itemDetail.NightNo-1, 'days').format('YYYY-MM-DD');
                      objTourSendMail.endDate=endDate;
                      objTourSendMail.customerName=se.tourService.TourBooking.CustomerName;
                      objTourSendMail.customerPhone=se.tourService.TourBooking.CustomerPhone;
                      objTourSendMail.customerEmail=se.tourService.TourBooking.CustomerEmail;
                      objTourSendMail.receiverAddress='';
                      objTourSendMail.notes=se.tourService.TourBooking.TourNotes;
                      objTourSendMail.qty=0;
                      objTourSendMail.QtyAdults=se.tourService.TourBooking.AdultNo;
                      objTourSendMail.QtyChilds=se.tourService.TourBooking.ChildNo;;
                      objTourSendMail.ChildAges=se.tourService.TourBooking.ChildAges;
                      objTourSendMail.tourAvatarLink="/content/img/no-image.svg",
                      objTourSendMail.tourName=se.tourService.itemDetail.Name;
                      objTourSendMail.tourCode=se.tourService.itemDetail.Code;
                      objTourSendMail.tourId=se.tourService.itemDetail.Id;
                      objTourSendMail.bookingId=se.tourService.tourBookingCode;
                      objTourSendMail.timeName=se.tourService.itemDetail.TourTime;
                      objTourSendMail.Transport="";
                      objTourSendMail.Transports=null;
                      objTourSendMail.TotalPrice=se.tourService.tourTotal;
                      objTourSendMail.TotalAmountAfterTax=0.0;
                      objTourSendMail.RateAdult=se.tourService.itemDepartureCalendar.RateAdultAvg;
                      objTourSendMail.RateChild=se.tourService.itemDepartureCalendar.RateChildAvg;
                      objTourSendMail.Surcharge=0.0;
                      objTourSendMail.AliasTour="";
                      objTourSendMail.paymentMethod=42;
                      se.gf.RequestApi('POST', urlApiSendMail, '', objTourSendMail, 'touradddetails', 'AppSendEmailCustomer').then((data)=>{
                    
                      });
                      resolve(data.Response.BookingCode)
                    }else{
                      resolve(false);
                    }
                    se.gf.hideLoading();
                  });
            }else{
              se.gf.hideLoading();
              se.gf.showToastWarning('Email không hợp lệ. Vui lòng kiểm tra lại.');
              resolve(false);
            }
            })
               
          }

          createBookingTourDiscountTransaction(code) {
            let urlApiTrans = C.urls.baseUrl.urlMobile+'/tour/api/BookingsApi/UpdateTransaction?bookingCode='+code+'&status=3';
            let headers = {
              apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
              apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
            };
            this.gf.RequestApi('GET', urlApiTrans, headers, null , 'tourpaymentbank', 'UpdateTransaction').then((dataTrans)=>{
              console.log(dataTrans);
              if(dataTrans){
                this.tourService.paymentType = 1;
                this.tourService.BookingTourMytrip = null;
                this.navCtrl.navigateForward('/tourpaymentdone');
              }
            });
          }

          usePoint() {

          }

          async showdiscount(){
            $('.div-point').removeClass('div-disabled');
            this._voucherService.openFrom = 'touradddetails';
            this.msg="";
            this.zone.run(()=> {
            
              this.promocode = "";
              this.discountpromo = 0;
              this.ischeckpromo = false;
              this.tourService.promocode = "";
              this.tourService.discountpromo = 0;
              this.tourService.totalPriceBeforeDiscount = 0;
              this.tourService.discountPrice = 0;
            })
            const modal: HTMLIonModalElement =
            await this.modalCtrl.create({
              component: AdddiscountPage,
            });
            modal.present();
            if(this._voucherService.selectVoucher && this._voucherService.selectVoucher.claimed){
              this._voucherService.rollbackSelectedVoucher.emit(this._voucherService.selectVoucher);
              this._voucherService.selectVoucher = null;
            }
            this.edit(2);
            modal.onDidDismiss().then((data: OverlayEventDetail) => {
              if (data.data) {
                let vc = data.data;
                if(vc.applyFor && vc.applyFor != 'tour'){
                  this.gf.showAlertMessageOnly(`Mã giảm giá chỉ áp dụng cho đơn hàng ${ vc.applyFor == 'flight' ? 'vé máy bay' : 'khách sạn'}. Quý khách vui lòng chọn lại mã khác!`);
                  this._voucherService.rollbackSelectedVoucher.emit(vc);
                  return;
                }else {
                  this.zone.run(() => {
                    if (data.data.promocode) {
                      $('.div-point').addClass('div-disabled');
                      this.promocode=data.data.promocode;
                      this.textpromotion=data.data.promocode;
                      this.tourService.promocode = data.data.promocode;

                      this.promofunc(vc.applyFor && vc.applyFor == 'tour' ? vc : '');
                     
                    }
                  })
                }
                
              }
            })
            //}
          }

          promofunc(vc) {
            var se = this;
            if (se.promocode) {
                let body = JSON.stringify({ bookingCode: 'TOUR',code: se.promocode, totalAmount: se.totalPriceStr.toString().replace(/\./g, '').replace(/\,/g, '') ,comboDetailId: "", 
                  couponData: vc ? {
                    "tour": {
                      "tourId": se.tourService.itemDetail.tourDetailId,
                      "totalAdult": se.tourService.adult,
                      "totalChild": se.tourService.child,
                      "jsonObject": "",
                      "checkIn": se.tourService.checkInDate,
                      "checkOut": se.tourService.checkInDate
                    }
                  } : ''
                  });
                  let headers = {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                  };
              let strUrl = C.urls.baseUrl.urlMobile + '/api/data/validpromocode';
              se.gf.RequestApi('POST', strUrl, headers, body, 'AdddiscountPage', 'loadUserInfo').then((data) => {
                //if (error) throw new Error(error);
                se.zone.run(() => {
                  var json = data;
                  if (json.error==0) {
                    var total = se.totalPriceStr.toString().replace(/\./g, '').replace(/\,/g, '');
                    
                    se.discountpromo= json.data.orginDiscount ? json.data.orginDiscount : json.data.discount;
                    se.Pricepointshow = total -  se.discountpromo;
                    se.tourService.discountpromo = se.discountpromo;
                    se.ischeckpromo = true;
                    // if (se.ischeckpoint) {
                    //   total = se.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
                    // }
                    if (se.Pricepointshow>0) {
                      se.Pricepointshow = se.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
                      //se.ischeckpromo = true;
                    }
                    else
                    {
                      //se.ischeckbtnpromo = true;
                      se.Pricepointshow=0;
                    }
                    se.msg=json.msg;
                    se.edit(2);
                    //se.ischecktext=0;
                    //se.ischeckerror=0;
                  }
                  else if(json.error==1)
                  {
                    se.ischeckpromo = false;
                    se.msg=json.msg;
                    se.discountpromo=0;
                    //se.ischecktext=1;
                    //se.ischeckerror=1;
                  }
                  else if(json.error==2)
                  {
                    //se.ischeckbtnpromo = false;
                    se.ischeckpromo = false;
                    se.msg=json.msg;
                    se.discountpromo=0;
                    //se.ischecktext=2;
                    //se.ischeckerror=1;
                  }
                  else{
                    //se.ischeckbtnpromo = false;
                    se.ischeckpromo = false;
                    se.msg = json.msg;
                    se.discountpromo = 0;
                    //se.ischecktext = 2;
                    //se.ischeckerror = 1;
                  }
                })
              });
            }
          }

          scrollToElement(type){
            let el = type == 1 ? 'ipEmail' : 'ipNote';
            if($('#'+el) && $('#'+el).length >0){
              (window.document.getElementById(el)as any).scrollIntoView({ behavior: 'smooth', block: 'center'  });
            }
          }

          checkVoucherClaimed(){
            if(this.itemVoucherTour && this.itemVoucherTour.claimed){
              this._voucherService.vouchers.forEach((element)=>{
                if(element.id == this.itemVoucherTour.id){
                  element.claimed = true;
                }
              });
            }
          }
}

