import { Component,NgZone, OnInit } from '@angular/core';
import { ModalController,Platform,AlertController,ToastController,NavController } from '@ionic/angular';
import { SearchHotel, ValueGlobal, Bookcombo,Booking,RoomInfo } from './../providers/book-service';
import * as moment from 'moment';

import { Storage } from '@ionic/storage';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import {PickupCalendarPage} from '../pickup-calendar/pickup-calendar';
import {OccupancyPage} from '../occupancy/occupancy';
import * as $ from 'jquery';

import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';
import { SelectDateRangePage } from '../selectdaterange/selectdaterange.page';
import { voucherService } from '../providers/voucherService';
import { AdddiscountPage } from '../adddiscount/adddiscount.page';
import { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-requestcombo',
  templateUrl: 'requestcombo.html',
  styleUrls: ['requestcombo.scss'],
})

export class RequestComboPage implements OnInit{
  public datecin: Date;
  public datecout: Date;
  public cindisplay; cin; cout; adult = 2; child = 0;
  public customerName = '';
  public mobile = '';
  public usermail = '';
  public location = 'SGN';
  public mobilevalidate = true;
  public emailvalidate = true;
  public isFlashSaleCombo = false;
  public hasDepatureFromCanTho = false;
  public myCalendar: any;
  checkchangeemail=false;
  allowclickcalendar: boolean = true;

  inputtext: boolean = false;
  listPaxSuggestByMemberId : any = [];
  listpaxhint: any = [];
  hidepaxhint: boolean = false;
  currentSelectPax: any;
  textOther = "";
  msg: string;
  strPromoCode = "";
  ischeckbtnpromo: boolean;
  promocode: any;
  ischecktext: number;
  ischeckerror: number;
  itemVoucher: any;
    constructor(public toastCtrl: ToastController,private alertCtrl: AlertController, public zone: NgZone, public modalCtrl: ModalController,
      public storage: Storage, public platform: Platform, public bookCombo: Bookcombo, public value: ValueGlobal, 
      public searchhotel: SearchHotel, public valueGlobal: ValueGlobal,public navCtrl: NavController,
      public gf: GlobalFunction,
      private fb: Facebook,public _voucherService: voucherService,    public booking: Booking,
      public Roomif: RoomInfo) {
        this.gf.GetUserInfo().then((data)=>{
          if(data && data.email){
            this.usermail = data.email;
          }
        })
    }

    ngOnInit(){
      var se = this;
      this._voucherService.getFlightComboObservable().subscribe((itemVoucher)=> {
        if(itemVoucher){
          // if(this.promocode && this.promocode != itemVoucher.code && !this.itemVoucherCombo){
          //   this._voucherService.rollbackSelectedVoucher.emit(itemVoucher);
          //   this.gf.showAlertMessageOnly(`Mã voucher ${this.promocode} đang được sử dụng. Quý khách vui lòng kiểm tra lại.`);
          //   return;
          // }
          //this._voucherService.selectVoucher = itemVoucher;
          if(this.promocode && this.promocode != itemVoucher.code && !this.itemVoucher){
            this._voucherService.rollbackSelectedVoucher.emit(itemVoucher);
            this.gf.showAlertMessageOnly(`Chỉ hỗ trợ áp dụng nhiều voucher tiền mặt trên một đơn hàng, Coupon và Voucher khuyến mãi chỉ áp dụng một`);
            return;
          }
  
          this.zone.run(()=>{
          
            if(itemVoucher.claimed){
              this.buildStringPromoCode();
            }else{
              this.itemVoucher = null;
              this.promocode = "";
              this.bookCombo.promoCode = "";
              this.bookCombo.discountpromo = 0;
              this.ischeckbtnpromo = false;
  
              this.buildStringPromoCode();
  
              if(this._voucherService.voucherSelected && this._voucherService.voucherSelected.length ==0 && this._voucherService.listPromoCode && this._voucherService.listPromoCode.length ==0){
                this.strPromoCode = '';
                this.ischeckbtnpromo = false;
              }
            }
          })
          
          //this.modalCtrl.dismiss();
        }
      })
  
      this._voucherService.getObservableClearVoucherAfterPaymentDone().subscribe((check)=> {
        if(check){
          this.itemVoucher= null;
              this.promocode = "";
              this.bookCombo.promoCode = "";
              this.bookCombo.discountpromo = 0;
              this.ischeckbtnpromo = false;
  
              this.strPromoCode = '';
            this._voucherService.voucherSelected = [];
            this._voucherService.listPromoCode = "";
            this._voucherService.listObjectPromoCode = [];
            this._voucherService.totalDiscountPromoCode = 0;
            this._voucherService.comboFlightPromoCode = "";
            this._voucherService.comboFlightTotalDiscount = 0;
        }
      })
      se.storage.get('email').then(email => {
       se.usermail = email;
      });
      se.storage.get('username').then(name => {
       se.customerName = name;
      });
      se.storage.get('infocus').then(infocus => {
        if(infocus){
          se.mobile = infocus.phone;
        }
        
       })
     if (se.searchhotel.adult) {
       se.adult = se.searchhotel.adult;
     }
     if (se.searchhotel.child) {
       se.child = se.searchhotel.child;
     }
     if (se.bookCombo.CheckInDate) {
       let arrdate =  moment(se.bookCombo.CheckInDate).format('DD-MM-YYYY').split('-');
       let arrdatecout =  moment(se.searchhotel.CheckOutDate).format('DD-MM-YYYY').split('-');
       se.datecin = new Date(Number(arrdate[2]), Number(arrdate[1]) -1, Number(arrdate[0]));
       se.datecout = new Date(Number(arrdatecout[2]), Number(arrdatecout[1]) -1, Number(arrdatecout[0]));
       se.cindisplay = moment(se.gf.getCinIsoDate(se.datecin)).format('DD-MM-YYYY');
       se.cin = moment(se.gf.getCinIsoDate(se.datecin)).format('YYYY-MM-DD');
       se.cout = moment(se.gf.getCinIsoDate(se.datecout)).format('YYYY-MM-DD');
     }
     else if (se.searchhotel.CheckInDate) {
      let arrdatecin =  moment(se.searchhotel.CheckInDate).format('DD-MM-YYYY').split('-');
      let arrdatecout =  moment(se.searchhotel.CheckOutDate).format('DD-MM-YYYY').split('-');
       se.datecin = new Date(Number(arrdatecin[2]), Number(arrdatecin[1]) -1, Number(arrdatecin[0]));
       se.datecout = new Date(Number(arrdatecout[2]), Number(arrdatecout[1]) -1, Number(arrdatecout[0]));
       se.cindisplay = moment(se.gf.getCinIsoDate(se.datecin)).format('DD-MM-YYYY');
       se.cin = moment(se.gf.getCinIsoDate(se.datecin)).format('YYYY-MM-DD');
       se.cout = moment(se.gf.getCinIsoDate(se.datecout)).format('YYYY-MM-DD');
     } else {
       se.cin = new Date(se.gf.getCinIsoDate(new Date()));
       var rescin = se.cin.setTime(se.cin.getTime() + (24 * 60 * 60 * 1000));
       var datein = new Date(se.gf.getCinIsoDate(rescin));
       se.cin = moment(datein).format('YYYY-MM-DD');
       se.cindisplay = moment(datein).format('DD-MM-YYYY');
       se.datecin = new Date(se.gf.getCinIsoDate(rescin));
     }
     se.isFlashSaleCombo = se.bookCombo.isFlashSale;
     
     if(se.bookCombo.ComboDetail && se.bookCombo.ComboDetail.list && se.bookCombo.ComboDetail.list.length >0){
       let itemprices = se.bookCombo.ComboDetail.list;
        se.bookCombo.ComboRoomPrice = (itemprices.length >0 && itemprices[0] && itemprices[0].details[0]) ?  itemprices[0].details[0].totalPriceSale : 0;
      }
     if(se.bookCombo.ComboDetail && se.bookCombo.ComboDetail.list && se.bookCombo.ComboDetail.list.length >2){
       se.hasDepatureFromCanTho = true;
     }
     //google analytic
     se.bookCombo.location = se.location;
     se.searchhotel.gaComboId = se.bookCombo.HotelCode;
     se.searchhotel.gaComboName = se.searchhotel.gaHotelDetail.Combos? se.searchhotel.gaHotelDetail.Combos.Title : se.bookCombo.HotelName;
     var priceshow:any = se.bookCombo.ComboDetail && se.bookCombo.ComboDetail.comboDetail ? se.gf.convertNumberToString(se.bookCombo.ComboDetail.comboDetail.totalPriceSale) : se.gf.convertNumberToString(se.bookCombo.ComboRoomPrice);
     se.searchhotel.totalPrice = priceshow;
      se.gf.logEventFirebase('On request',se.searchhotel, 'requestcombo', 'begin_checkout', 'Combo');
      

      this.storage.get('jti').then(jti => {
        if (jti) {
          this.gf.RequestApi('GET', C.urls.baseUrl.urlMobile+'/api/Dashboard/GetListNameHotel?memberid='+jti, {},{}, 'flightadddetails', 'GetListName').then((data)=>{
            if(data && data.length >0){
              this.listPaxSuggestByMemberId = [...data];
            }
          })
        }
      })
    }
    ionViewWillEnter() {
   
  
      this.zone.run(() => {
        if (this._voucherService.selectVoucher) {
          this._voucherService.rollbackSelectedVoucher.emit(this._voucherService.selectVoucher);
          this._voucherService.selectVoucher = null;
        }

      })
    }
    buildStringPromoCode(){
  
      if(this._voucherService.voucherSelected && this._voucherService.voucherSelected.length >0){
        this.strPromoCode = this._voucherService.voucherSelected.map(item => item.code).join(', ');
      }else{
        this.strPromoCode = '';
      }
    
      if(this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0){
        if(this.strPromoCode){
          this.strPromoCode += ', '+this._voucherService.listPromoCode.join(', ');
        }else{
          this.strPromoCode += this._voucherService.listPromoCode.join(', ');
        }
      }
      this._voucherService.ticketPromoCode = this.strPromoCode;
    }
    ionViewDidLoad(){
      this.platform.ready().then(()=>{
        this.location=="SGN" ? this.radioCheck(1) : (this.location=="HAN" ? this.radioCheck(2) : this.radioCheck(3) );
        this.mobilevalidate = true;
        this.emailvalidate = true;
      })
    }

    dismiss(){
      this.modalCtrl.dismiss();
    }
    
    sendRequest() {
      var se = this;
      if(this.customerName && this.customerName != ""){

         //Validate số điện thoại
         if(this.mobile.length >0 && !this.filterPhone(this.mobile)){
          this.mobilevalidate = false;
          this.setInputFocus("cusMobile");
          this.presentToast('Số điện thoại không hợp lệ. Vui lòng nhập lại.');
          return;
        }else if(this.filterPhone(this.mobile)){
          this.mobilevalidate= true;
        }
        //Validate email
        if(!this.filterEmail(this.usermail) || !this.gf.checkUnicodeCharactor(this.usermail)){
          this.emailvalidate = false;
          this.setInputFocus("cusEmail");
          this.presentToast('Email không hợp lệ. Vui lòng nhập lại.');
          return;
        }else if(this.filterEmail(this.usermail)){
          this.emailvalidate = true;
        }

        //Gửi yêu cầu
        var options;
        var form = "";
        var urlstr = "";
        let body = "";

        let priceshow = se.bookCombo.ComboDetail && se.bookCombo.ComboDetail.comboDetail ? se.gf.convertNumberToString(se.bookCombo.ComboDetail.comboDetail.totalPriceSale) : se.gf.convertNumberToString((se.bookCombo.ComboRoomPrice ? se.bookCombo.ComboRoomPrice : 0));
        se.searchhotel.totalPrice = priceshow;
        se.gf.logEventFirebase('On request',se.searchhotel, 'requestcombo', 'add_shipping_info', 'Combo');
        se.gf.logEventFirebase('On request',se.searchhotel, 'requestcombo', 'add_payment_info', 'Combo');

        if(this.bookCombo.isFlashSale){
          form = JSON.stringify({
            HotelId: this.bookCombo.Hotelid,
            HotelName: this.bookCombo.HotelName,
            RegionId: this.bookCombo.RegionId,
            RegionName: "",
            CheckIn: this.cin,
            CheckOut: this.cout,
            CustomerName: this.customerName,
            Email: this.usermail,
            Phone: this.mobile,
            RequestOther: "",
            Avatar: this.bookCombo.Avatar,
            Address: this.bookCombo.Address,
            Adult: this.searchhotel.adult,
            child:this.searchhotel.child,
            ChildAgeStr: "",
            Troom: this.searchhotel.roomnumber ? this.searchhotel.roomnumber : 1,
            UrlBookBack: "",
            HotelLink: this.bookCombo.HotelLink,
            RoomData: null,
            Markup: "0",
            Username: 'kmudivivu',
            employeeKey: '',
            Source: 6,
            RequestPromotion: this.strPromoCode
            });

            urlstr = C.urls.baseUrl.urlContracting + '/gui-yeu-cau-gia-vexe-deal';
        }else if(this.bookCombo.isFlightCombo || this.bookCombo.isNormalCombo){
          form = JSON.stringify({
            HotelId: this.bookCombo.Hotelid,
            HotelName: this.bookCombo.HotelName,
            RegionId: this.bookCombo.RegionId,
            RegionName: "",
            CheckIn: this.cin,
            CheckOut: this.cout,
            CustomerName: this.customerName,
            Email: this.usermail,
            Phone: this.mobile,
            RequestOther: "",
            Avatar: this.bookCombo.Avatar,
            Address: this.bookCombo.Address,
            Adult: this.searchhotel.adult,
            child:this.searchhotel.child,
            ChildAgeStr: "",
            Troom: this.searchhotel.roomnumber ?this.searchhotel.roomnumber : 1,
            UrlBookBack: this.bookCombo.isNormalCombo ? "" : C.urls.baseUrl.urlGate + "/dat-combo?cid="+this.bookCombo.ComboId+"&fp="+this.location+"&ci="+this.cin+"&co="+this.cout+"&rn="+ (this.searchhotel.roomnumber ?this.searchhotel.roomnumber : 1)+"&an="+this.adult+"&cn="+this.child+"&cas=''",
            HotelLink: this.bookCombo.HotelLink,
            RoomData: null,
            Markup: "0",
            Username: 'kmudivivu',
            employeeKey: '',
            Source: 6,
            RequestPromotion: this.strPromoCode
          });
       
          urlstr = C.urls.baseUrl.urlContracting +'/gui-yeu-cau-gia-deal';
        }
         
        options = {
        method: 'POST',
        url: urlstr,
        timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        headers:{'content-type':  'application/x-www-form-urlencoded; charset=UTF-8'},
        form
        };
       
        var se = this;

        let headers = { 
          'content-type' :'application/x-www-form-urlencoded; charset=UTF-8', accept: '*/*'
        };
        this.gf.RequestApi('POST', urlstr, headers, form, 'requestCombo', 'sendRequest').then((data)=>{

            if(data.success){
              se.bookCombo.bookingcode = data.id;
                se.presentAlert('Gửi yêu cầu thành công','Báo giá sẽ được gửi tới email của quý khách.');
                //google analytic
                //se.gf.googleAnalytion('requestcombo','ecommerce_purchase',se.bookCombo.titleComboShort+'|'+se.bookCombo.HotelCode+'|'+se.cin+'|'+se.cout+'|'+se.adult+'|'+se.child);
                setTimeout(()=> {
                  se.modalCtrl.dismiss();
                },200);
                let priceshow = se.bookCombo.ComboDetail && se.bookCombo.ComboDetail.comboDetail ? Number(se.bookCombo.ComboDetail.comboDetail.totalPriceSale.toString().replace(/\./g, '').replace(/\,/g, '')) : (se.bookCombo.ComboRoomPrice ? se.bookCombo.ComboRoomPrice.toString().replace(/\./g, '').replace(/\,/g, '') : 0);
                let pricecurrency:any = se.bookCombo.ComboDetail && se.bookCombo.ComboDetail.comboDetail ? Number(se.bookCombo.ComboDetail.comboDetail.totalPriceSale.toString().replace(/\./g, ',')) : (se.bookCombo.ComboRoomPrice ? se.bookCombo.ComboRoomPrice.toString().replace(/\./g, ',') : 0);
                //se.gf.googleAnalytionCustom('ecommerce_purchase',{items: [{item_category:'requestcombo' , item_name: se.bookCombo.HotelName, item_id: se.bookCombo.HotelCode, start_date: se.cin, end_date: se.cout,origin: se.location, destination: se.bookCombo.ComboDetail ? se.bookCombo.ComboDetail.arrivalCode : '' }], value: se.gf.convertStringToNumber(priceshow) ,currency: "VND"});
                se.searchhotel.totalPrice = priceshow;
                se.searchhotel.paymentType = 'On request';
                se.gf.logEventFirebase('On request',se.searchhotel, 'requestcombo', 'purchase', 'Combo');

                se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_PURCHASED, {'fb_content_type': 'hotel'  ,'fb_content_id': se.bookCombo.HotelCode,'fb_num_items': 1, 'fb_value': se.gf.convertStringToNumber(priceshow) ,  'fb_currency': 'VND' , 
                'checkin_date': se.searchhotel.CheckInDate ,'checkout_date ': se.searchhotel.CheckOutDate,'num_adults': se.searchhotel.adult,'num_children': (se.searchhotel.child ? se.searchhotel.child : 0) }, se.gf.convertStringToNumber(pricecurrency) );
  
            }else{
              se.presentAlert('Gửi yêu cầu không thành công','Gửi yêu cầu không thành công. Vui lòng kiểm tra lại thông tin trước khi gửi.')
            }
            
          
          
        })
      }else{
        //Set lại focus cho input
        this.presentToast('Họ tên không được để trống. Vui lòng nhập lại.');
        this.setInputFocus("cusName");
      }
      
    }
    
    setInputFocus(name){
      //const element = window.document.getElementById(name);
      //this.renderer.invokeElementMethod(element, 'focus', []);
    }

    async openmnu() {
        this.gf.setParams(true,'requestcombo');
        const modal: HTMLIonModalElement =
           await this.modalCtrl.create({
              component: OccupancyPage
        })
        modal.present();
        var se = this;
        modal.onDidDismiss().then(() => {
          let self = this;
          self.zone.run(()=>{
            if (self.searchhotel.adult) {
              self.adult = self.searchhotel.adult;
            }
            self.child = self.searchhotel.child;
            
          })
        })
    }

    async clickedElement(e: any) {
      var obj:any = e.currentTarget;
      if($(obj.parentNode).hasClass('endSelection') || $(obj.parentNode).hasClass('startSelection')){
        if(this.modalCtrl){
          let fday:any;
          let tday:any;
          var monthenddate:any;
          var yearenddate:any;
          var monthstartdate:any;
          var yearstartdate:any;
          var objTextMonthEndDate: any;
          var objTextMonthStartDate: any;
          
          if ($(obj.parentNode).hasClass('endSelection')) {
            // fday = $('.on-selected')[0].textContent;
            // tday = $(obj)[0].textContent;
            if ($('.days-btn.lunarcalendar.on-selected > p')[0]) {
              fday = $('.days-btn.lunarcalendar.on-selected > p')[0].innerText;
            } else {
              fday = $('.on-selected')[0].textContent;
            }
            if ($('.days.endSelection .days-btn.lunarcalendar > p')[0]) {
              tday = $('.days.endSelection .days-btn.lunarcalendar > p')[0].innerText;
            } else {
              tday = $(obj)[0].textContent;
            }
            objTextMonthStartDate = $('.on-selected').closest('.month-box').children()[0].textContent;
            objTextMonthEndDate = $(obj).closest('.month-box').children()[0].textContent;
          } else {
            if ($('.days-btn.lunarcalendar.on-selected > p')[0]) {
              fday = $('.days-btn.lunarcalendar.on-selected > p')[0].innerText
            }
            else {
              fday = $(obj)[0].textContent;
            }
            if ($('.days.endSelection .days-btn.lunarcalendar > p')[0]) {
              tday = $('.days.endSelection .days-btn.lunarcalendar > p')[0].innerText;
            }
            else {
              tday = $('.endSelection').children('.days-btn')[0].textContent;
            }
            objTextMonthStartDate = $(obj).closest('.month-box').children()[0].textContent;
            objTextMonthEndDate = $('.endSelection').closest('.month-box').children()[0].textContent;
          }
          
          
          if(objTextMonthEndDate && objTextMonthEndDate.length >0 && objTextMonthStartDate && objTextMonthStartDate.length >0){
            monthstartdate = objTextMonthStartDate.split('/')[0];
            yearstartdate = objTextMonthStartDate.split('/')[1];
            monthenddate = objTextMonthEndDate.split('/')[0];
            yearenddate = objTextMonthEndDate.split('/')[1];
            var fromdate = new Date(yearstartdate, monthstartdate - 1, fday);
            var todate = new Date(yearenddate, monthenddate - 1, tday);
            var se = this;
            if(fromdate && todate && moment(todate).diff(fromdate,'days') > 0){
              setTimeout(()=>{
                se.modalCtrl.dismiss();
              },100)
                se.searchhotel.CheckInDate = moment(fromdate).format('YYYY-MM-DD');
                se.searchhotel.CheckOutDate = moment(todate).format('YYYY-MM-DD');
                se.bookCombo.CheckInDate = moment(fromdate).format('YYYY-MM-DD');
                se.bookCombo.CheckOutDate = moment(todate).format('YYYY-MM-DD');
                se.zone.run(()=>{
                  se.cin = se.searchhotel.CheckInDate;
                  se.cout = se.searchhotel.CheckOutDate;
                  se.datecin = new Date(se.searchhotel.CheckInDate);
                  se.datecout = new Date(se.searchhotel.CheckOutDate);
                  se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
                })
                se.gf.setCacheSearchHotelInfo({checkInDate: se.searchhotel.CheckInDate, checkOutDate: se.searchhotel.CheckOutDate, adult: se.searchhotel.adult, child: se.searchhotel.child, childAge: se.searchhotel.arrchild, roomNumber: se.searchhotel.roomnumber});
                return true;
            }
            
          }
        }
      }
    }

    async openPickupCalendar(){
      let se = this;
      let fromdate = new Date();
        let todate = new Date();
      if(se.bookCombo.CheckInDate && se.bookCombo.CheckOutDate){
        fromdate = new Date(this.gf.getCinIsoDate(se.bookCombo.CheckInDate));
        todate = new Date(this.gf.getCinIsoDate(se.bookCombo.CheckOutDate));
      }

      let modal = await se.modalCtrl.create({
        component: SelectDateRangePage,
        animated: true,
        mode: 'ios'
      });
      se.searchhotel.formChangeDate = 9;

      se.searchhotel.CheckInDate = this.gf.getCinIsoDate(se.bookCombo.CheckInDate);
      se.searchhotel.CheckOutDate = this.gf.getCinIsoDate(se.bookCombo.CheckOutDate);
      modal.present();

      const event: any = await modal.onDidDismiss();
        if(event){
          let fromdate = this.gf.getCinIsoDate(event.data.from);
          let todate:any = this.gf.getCinIsoDate(event.data.to);
          if (fromdate) {
            if(event.data){
              if(!todate || (todate && moment(todate).diff(fromdate, 'hours') <0) ){
                todate = moment(fromdate).add('days',1);
              }
              se.searchhotel.CheckInDate = moment(fromdate).format('YYYY-MM-DD');
              se.searchhotel.CheckOutDate = moment(todate).format('YYYY-MM-DD');
              se.bookCombo.CheckInDate = moment(fromdate).format('YYYY-MM-DD');
              se.bookCombo.CheckOutDate = moment(todate).format('YYYY-MM-DD');
            }
            se.zone.run(()=>{
              se.cin = se.searchhotel.CheckInDate;
              se.cout = se.searchhotel.CheckOutDate;
              se.datecin = new Date(this.gf.getCinIsoDate(se.searchhotel.CheckInDate));
              se.datecout = new Date(this.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
              se.cindisplay = moment(this.gf.getCinIsoDate(se.datecin)).format('DD-MM-YYYY');
            })
            se.gf.setCacheSearchHotelInfo({checkInDate: se.searchhotel.CheckInDate, checkOutDate: se.searchhotel.CheckOutDate, adult: se.searchhotel.adult, child: se.searchhotel.child, childAge: se.searchhotel.arrchild, roomNumber: se.searchhotel.roomnumber});
          }
        }
        return true;
    }

    async presentAlert(title,msg) {
      const alert = await this.alertCtrl.create({
        message: msg,
        buttons: ['OK']
      });
  
      await alert.present();
    }

    async presentToast(msg) {
      const toast = await this.toastCtrl.create({
        message: msg,
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
    /***
     * Xử lý change value radio khi click vào label
     * PDANH 26/02/2019
     */
    radioCheck(item){
      this.location=item.departureCode;
      // var itemListDeparture = window.document.getElementsByClassName('list-departure');
      // var itemRadioDeparture = window.document.getElementsByClassName('rd-departure');
      // if(value==1){
      //   itemListDeparture[0].setAttribute('aria-activedescendant',"rb-1-0");
      //   this.location = "SGN";
      // }else if(value==2){
      //   itemListDeparture[0].setAttribute('aria-activedescendant',"rb-1-1");
      //   this.location = "HN";
      // }else if(value==3){
      //   itemListDeparture[0].setAttribute('aria-activedescendant',"rb-1-2");
      //   this.location = "VCA";
      // }

    }
    /***
     * Gọi tổng đài hỗ trợ
     * PDANH 26/02/2019
     */
    async makeCallSupport(value){
      try {
        let tel = "19001870";
        if(value == 1){
          tel = "19002045";
        }else if(value==2){
          tel = "19001870";
        }
        else{
          tel = "19002087";
        }
        setTimeout(() => {
          window.open(`tel:${tel}`, '_system');
        },100);
      }
      catch (error:any) {
        if (error) {
          error.page="requestcombo";
          error.func="makeCallSupport";
          C.writeErrorLog(error,null);
          throw new Error(error)
        };
      }
      //google analytic
      this.gf.googleAnalytion('requestcombo','callsupport','');
    }

    filterPhone(phone){
      var pattern = new RegExp("0[9|8|1|7|3|5]([0-9]|\s|-|\.){8,12}");
      return pattern.test(phone);
    }

    filterEmail(email) {
      var regex = new RegExp(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/);
      return regex.test(email);
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
    inputFocusOther(event){
      this.textOther = event.target.value;
    }
    inputLostFocus(item){
      var se = this;
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
          se.customerName = paxhint.fullName ? paxhint.fullName :se.customerName;
          se.mobile = paxhint.phoneNumber ? paxhint.phoneNumber : se.mobile;
          se.usermail =  paxhint.email && se.filterEmail(paxhint.email) ? paxhint.email : se.usermail;
      }
    }
    hidePaxHint(){
      this.hidepaxhint = true;
    }

   
    inputOnFocus(item, type){
      var se = this;
      
      //se.clearError(item, type);
      if(type == 9 && !se.customerName){

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
    async showdiscount(){
      $('.div-point').removeClass('div-disabled');
      this._voucherService.openFrom = 'flightcomboreview';
      this.msg="";
      this._voucherService.hasVoucher = true;
      this._voucherService.listPromoCode = [];
      this.promocode = "";
      this.buildStringPromoCode();
      this.zone.run(()=> {
      
        // if (this.ticketService.promocode) {
        //   this.promocode = "";
        //   this.discountpromo = 0;
        //   this.ischeckpromo = false;
        //   this.ticketService.promocode = "";
        //   this.totalPriceNum = this.ticketService.totalPriceNum;
        //   this.ticketService.discountpromo = 0;
        // }

      })
      const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: AdddiscountPage,
      });
      modal.present();
      modal.onDidDismiss().then((data: OverlayEventDetail) => {
        if(this._voucherService.listPromoCode && this._voucherService.listPromoCode.length >0){
          if(this.strPromoCode){
            this.strPromoCode += ', '+this._voucherService.listPromoCode.join(', ');
          }else{
            this.strPromoCode = this._voucherService.listPromoCode.join(', ');
        
          }

        }else if (data.data) {//case voucher km
          let vc = data.data;
          if(vc.applyFor && vc.applyFor != 'comboflight'){
            this.gf.showAlertMessageOnly(`Mã giảm giá chỉ áp dụng cho đơn hàng ${ vc.applyFor == 'hotel' ? 'khách sạn' : 'vé máy bay'}. Quý khách vui lòng chọn lại mã khác!`);
            this._voucherService.rollbackSelectedVoucher.emit(vc);
            return;
          }
          else {
            this.zone.run(() => {
              if (data.data.promocode) {
                $('.div-point').addClass('div-disabled');
                this.promocode=data.data.promocode;
                this.promofunc();
              }
            })
          }
        }
        else{
          this.ischeckbtnpromo = false;
        }
      })
}
promofunc() {
  var se = this;
  if (se.promocode) {

    let headers = {
      'postman-token': '37a7a641-c2dd-9fc6-178b-6a5eed1bc611',
        'cache-control': 'no-cache',
        'content-type': 'application/json'
    };
    let strUrl = C.urls.baseUrl.urlMobile + '/api/data/validpromocode';
      this.gf.RequestApi('POST', strUrl, headers, { bookingCode: 'FLIGHTCOMBO',code: se.promocode, totalAmount: 0, comboDetailId: this.bookCombo.ComboId,
      couponData: {
        "hotel": {
          "hotelId": this.booking.HotelId,
          "roomName": this.booking.RoomName,
          "totalRoom": this.Roomif.roomnumber,
          "totalAdult": this.booking.Adults,
          "totalChild": this.booking.Child,
          "jsonObject": "",
          "checkIn": this.searchhotel.CheckInDate,
          "checkOut": this.searchhotel.CheckOutDate
        }
      } }, 'flightComboReview', 'reloadTokenClaims').then((data)=>{

        se.zone.run(() => {
          var json = data;
          if (json.error==0) {
            
       
            se.promocode = json.data.code;
            se.strPromoCode = json.data.code;
        
            se.msg=json.msg;
            se.ischecktext=0;
            se.ischeckerror=0;
          }
          else if(json.error==1)
          {
            se.ischeckbtnpromo = false;
            se.msg=json.msg;
            se.ischecktext=1;
            se.ischeckerror=1;
          }
          else if(json.error==2)
          {
            se.ischeckbtnpromo = false;
            se.msg=json.msg;
            se.ischecktext=2;
            se.ischeckerror=1;
          }
          else {
            se.ischeckbtnpromo = false;
            se.msg = json.msg;
            se.ischecktext = 2;
            se.ischeckerror = 1;
          }
        })
    });
  }
}
}