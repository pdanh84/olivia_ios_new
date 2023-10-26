import { Component,NgZone,OnInit } from '@angular/core';
import { ModalController,Platform,AlertController,ToastController,NavController } from '@ionic/angular';
import { SearchHotel, ValueGlobal, Bookcombo, RoomInfo, Booking } from '../providers/book-service';
import * as moment from 'moment';

import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import {PickupCalendarPage} from '../pickup-calendar/pickup-calendar';
import {OccupancyPage} from '../occupancy/occupancy';
import * as $ from 'jquery';

import { SelectDateRangePage } from '../selectdaterange/selectdaterange.page';
//import { Appsflyer } from '@ionic-native/appsflyer/ngx';

import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';

@Component({
  selector: 'app-requestroom',
  templateUrl: 'requestroom.html',
  styleUrls: ['requestroom.scss'],
})

export class RequestRoomPage implements OnInit{
  public datecin: Date;
  public datecout: Date;
  public cindisplay; cin; cout; adult = 2; child = 0;
  public customerName;
  public mobile = '';
  public usermail = '';
  public location = 'SGN';
  public mobilevalidate = true;
  public emailvalidate = true;
  public isFlashSaleCombo = false;
  //public hasDepatureFromCanTho = false;
  public myCalendar: any;
  codelocation;

  inputtext: boolean = false;
  listPaxSuggestByMemberId:any= [];
  listpaxhint: any = [];
  hidepaxhint: boolean = false;
  currentSelectPax: any;
  arrPlace:any = [{checked: true, departureName: 'Hồ Chí Minh', departureCode: 'HCM'},
  {checked: false, departureName: 'Hà Nội', departureCode: 'HAN'},
  {checked: false, departureName: 'Cần Thơ', departureCode: 'CTA'}];
  auth_token: any;
    constructor(public toastCtrl: ToastController,private alertCtrl: AlertController, public zone: NgZone, public modalCtrl: ModalController,
      public storage: Storage, public platform: Platform, public bookCombo: Bookcombo, public value: ValueGlobal, 
      public searchhotel: SearchHotel, public valueGlobal: ValueGlobal,public navCtrl: NavController,
      public gf: GlobalFunction,
      private fb: Facebook,
      public Roomif: RoomInfo,
      public booking: Booking
      ) {
          
    }

    ngOnInit(){
      var se = this;
      se.storage.get('auth_token').then(auth_token => {
        se.auth_token = auth_token;
      });
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
       });
     if (se.searchhotel.adult) {
       se.adult = se.searchhotel.adult;
     }
     if (se.searchhotel.child) {
       se.child = se.searchhotel.child;
     }
     if (se.bookCombo.CheckInDate) {
       se.cin = this.gf.getCinIsoDate(se.bookCombo.CheckInDate);
       se.datecin = new Date(this.gf.getCinIsoDate(se.bookCombo.CheckInDate));
       se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
       se.cin = moment(se.datecin).format('YYYY-MM-DD');
       se.datecout = new Date(this.gf.getCinIsoDate(se.bookCombo.CheckOutDate));
       se.cout = moment(se.datecout).format('YYYY-MM-DD');
     }
     else if (se.searchhotel.CheckInDate) {
       se.cin = this.gf.getCinIsoDate(se.searchhotel.CheckInDate);
       se.datecin = new Date(this.gf.getCinIsoDate(se.searchhotel.CheckInDate));
       se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
       se.cin = moment(se.datecin).format('YYYY-MM-DD');
       se.datecout = new Date(this.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
       se.cout = moment(se.datecout).format('YYYY-MM-DD');
     } else {
       se.cin = new Date(this.gf.getCinIsoDate(new Date()));
       var rescin = se.cin.setTime(se.cin.getTime() + (24 * 60 * 60 * 1000));
       var datein = new Date(this.gf.getCinIsoDate(rescin));
       se.cin = moment(datein).format('YYYY-MM-DD');
       se.cindisplay = moment(datein).format('DD-MM-YYYY');
       se.datecin = new Date(this.gf.getCinIsoDate(rescin));
     }
     se.isFlashSaleCombo = se.bookCombo.isFlashSale;
    //  if(se.bookCombo.ComboDetail && se.bookCombo.ComboDetail.list && se.bookCombo.ComboDetail.list.length >2){
    //    se.hasDepatureFromCanTho = true;
    //  }
     //google analytic
    //se.gf.googleAnalytion('requestcombo', 'add_to_cart',se.bookCombo.titleComboShort+'|'+se.bookCombo.HotelCode+'|'+se.cin+'|'+se.cout+'|'+se.adult+'|'+se.child);
    if (se.bookCombo.ComboDetail) {
      this.codelocation=se.bookCombo.ComboDetail.departureCode;
    }
    if (this.bookCombo.objComboDetail) {
      this.arrPlace=this.bookCombo.objComboDetail.list;
      if (!this.codelocation) {
          this.arrPlace[0].checked = true;
          for (let i = 1; i < this.arrPlace.length; i++) {
              this.arrPlace[i].checked = false;
          }
      }
      else
      {
        for (let i = 0; i < this.arrPlace.length; i++) {
          if (this.arrPlace[i].departureCode==this.codelocation) {
            this.arrPlace[i].checked = true;
          }
          else{
            this.arrPlace[i].checked = false;
          }
        }
      }
    }
    if(se.bookCombo.ComboDetail && se.bookCombo.ComboDetail.list && se.bookCombo.ComboDetail.list.length >0){
      let itemprices = se.bookCombo.ComboDetail.list;
       se.bookCombo.ComboRoomPrice = (itemprices.length >0 && itemprices[0] && itemprices[0].details[0]) ?  itemprices[0].details[0].totalPriceSale : 0;
     }
    var priceshow:any = se.bookCombo.ComboDetail && se.bookCombo.ComboDetail.comboDetail ? Number(se.bookCombo.ComboDetail.comboDetail.totalPriceSale.toString().replace(/\./g, '').replace(/\,/g, '')) : se.gf.convertStringToNumber(se.bookCombo.ComboRoomPrice);
    //se.gf.googleAnalytionCustom('add_to_cart',{item_category:'requestcombo' , item_name: se.bookCombo.HotelName, item_id: se.bookCombo.HotelCode, start_date: se.cin, end_date: se.cout, value: priceshow ,currency: "VND"});
      se.bookCombo.location = se.location;
      se.searchhotel.gaComboId = se.bookCombo.HotelCode;
      se.searchhotel.gaComboId = se.bookCombo.HotelCode ? se.bookCombo.HotelCode : se.searchhotel.gaHotelDetail.Code;
      se.searchhotel.totalPrice = priceshow;
      se.gf.logEventFirebase('On request',se.searchhotel, 'requestcombo', 'begin_checkout', 'Combo');
     se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_INITIATED_CHECKOUT, {'fb_content_type': 'hotel'  ,'fb_content_id': se.bookCombo.HotelCode,'fb_num_items': 1, 'fb_value': se.gf.convertNumberToDouble(priceshow) ,  'fb_currency': 'VND' , 
     'checkin_date': se.searchhotel.CheckInDate ,'checkout_date ': se.searchhotel.CheckOutDate,'num_adults': se.searchhotel.adult,'num_children': (se.searchhotel.child ? se.searchhotel.child : 0) }, se.gf.convertStringToNumber(priceshow) );

     se.storage.get('jti').then(jti => {
      if (jti) {
        se.gf.RequestApi('GET', C.urls.baseUrl.urlMobile+'/api/Dashboard/GetListNameHotel?memberid='+jti, {},{}, 'flightadddetails', 'GetListNameHotel').then((data)=>{
          if(data && data.length >0){
            se.listPaxSuggestByMemberId = [...data];
          }
        })
      }
    })
    }

    ionViewDidLoad(){
        this.location=="SGN" ? this.radioCheck(1) : (this.location=="HAN" ? this.radioCheck(2) : this.radioCheck(3) );
        this.mobilevalidate = true;
        this.emailvalidate = true;
    }

    dismiss(){
      this.modalCtrl.dismiss();
    }

    sendRequest() {
      var se = this;
      if(this.customerName && this.customerName != ""){
        //Gửi yêu cầu
        var options;
        
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
       
        let priceshow =  se.booking.cost ? Number( se.booking.cost.toString().replace(/\./g, '').replace(/\,/g, '')) : 0;
        se.searchhotel.totalPrice = priceshow.toString();
        se.gf.logEventFirebase('On request',se.searchhotel, 'requestcombo', 'add_shipping_info', 'Combo');
        se.gf.logEventFirebase('On request',se.searchhotel, 'requestcombo', 'add_payment_info', 'Combo');

        let roomData:any = [];
        for (let index = 0; index < se.booking.OriginalRoomClass.length; index++) {
          const element = se.booking.OriginalRoomClass[index];
          element.MealTypeRates.forEach(elementRate => {
            delete elementRate.countMealType;
            delete elementRate.displayLastPriceAvgPlusOTA;
            delete elementRate.displayLastPriceAvgPlusOTAStr;
            delete elementRate.displayMealType;
            delete elementRate.groupMealType;
            delete elementRate.point;
            //console.log(elementRate);
          });
          
      
          if(element.Rooms[0]){
            let obj = {
              "RoomName": element.Rooms[0].RoomName,
              "BBCode": element.Rooms[0].BBCode,
              "TotalPrice": element.Rooms[0].TotalPriceHadDiscountOta,
              "CurrencyCode": element.Rooms[0].CurrencyCode,
              "Adults": element.Rooms[0].Adults,
              "MaxAdults": element.Rooms[0].MaxAdults,
              "Childs": element.Rooms[0].Childs,
              "MaxChils": element.Rooms[0].MaxChils,
              "IncludeAdults": element.Rooms[0].IncludeAdults,
              "MaxPax": element.Rooms[0].MaxPax,
              "MealTypeRates": element.MealTypeRates,
              "SupplierRef": element.ListObjRoomClass,
              "Promotion": element.Rooms[0].PromotionDescription,
              "HotelOptionals": '',
              "Penaltys": element.Rooms[0].Penaltys
            }
            roomData.push(obj);
          }
          
        }
        var form = JSON.stringify({
          HotelId: se.booking.HotelId,
          HotelName: se.booking.HotelName,
          RegionId: se.booking.RegionId.toString(),
          RegionName:"",
          CheckIn: moment(this.gf.getCinIsoDate(se.booking.CheckInDate)).format('YYYY-MM-DD'),
          CheckOut: moment(this.gf.getCinIsoDate(se.booking.CheckOutDate)).format('YYYY-MM-DD'),
          CustomerName: se.customerName,
          Email: se.usermail,
          Phone: se.mobile,
          RequestOther:"",
          Avatar: se.booking.Avatar,
          Address: se.booking.Address,
          Adult: se.booking.Adults ,
          Child: se.booking.Child,
          ChildAgeStr:"",
          Troom: se.Roomif.roomnumber,
          UrlBookBack: C.urls.baseUrl.urlGet + `/virtual-detail?ci=${moment(se.booking.CheckInDate).format('DD-MM-YYYY')}&co=${moment(se.booking.CheckOutDate).format('DD-MM-YYYY')}&rn=${se.Roomif.roomnumber}&an=${se.booking.Adults}&cn=${se.booking.Child}&cas=&url='${se.booking.HotelLink}'`,
          HotelLink: se.booking.HotelLink,
          RoomData: roomData,
          Markup:"0",
          Username:"kmudivivu",
          RoomName: (se.Roomif.jsonroom as any).RoomClasses[0].ClassName,
          PromotionDescription:"",
          employeeKey: '',
          MemberId:""
      });
      var urlstr = C.urls.baseUrl.urlContracting +"/gui-yeu-cau-gia-contracting?intenalHotel=true";

      
      
       
      let headers = { 
        'content-type' :'application/x-www-form-urlencoded; charset=UTF-8', accept: '*/*'
      };
      this.gf.RequestApi('POST', urlstr, headers, form, 'requestRoom', 'sendRequest').then((data)=>{
           // var data = JSON.parse(body);
            if(data.success){
              se.bookCombo.bookingcode = data.id;
                se.presentAlert('Gửi yêu cầu thành công','Báo giá sẽ được gửi tới email của quý khách.');
                //google analytic
                setTimeout(()=> {
                  se.modalCtrl.dismiss();
                },200);
                let priceshow =  se.booking.cost ? Number( se.booking.cost.toString().replace(/\./g, '').replace(/\,/g, '')) : 0;
                se.searchhotel.paymentType = 'On request';
                se.gf.logEventFirebase('On request',se.searchhotel, 'requestcombo', 'purchase', 'Combo');
                se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_ADDED_TO_CART, {'fb_content_type': 'hotel'  ,'fb_content_id': se.booking.HotelId,'fb_num_items': 1, 'fb_value': se.gf.convertStringToNumber(priceshow) ,  'fb_currency': 'VND' , 
                'checkin_date': se.searchhotel.CheckInDate ,'checkout_date ': se.searchhotel.CheckOutDate,'num_adults': se.searchhotel.adult,'num_children': (se.searchhotel.child ? se.searchhotel.child : 0) }, se.gf.convertStringToNumber(priceshow) );
  
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
                se.searchhotel.CheckInDate = moment(this.gf.getCinIsoDate(fromdate)).format('YYYY-MM-DD');
                se.searchhotel.CheckOutDate = moment(this.gf.getCinIsoDate(todate)).format('YYYY-MM-DD');
                se.bookCombo.CheckInDate = moment(this.gf.getCinIsoDate(fromdate)).format('YYYY-MM-DD');
                se.bookCombo.CheckOutDate = moment(this.gf.getCinIsoDate(todate)).format('YYYY-MM-DD');
                se.zone.run(()=>{
                  se.cin = se.searchhotel.CheckInDate;
                  se.cout = se.searchhotel.CheckOutDate;
                  se.datecin = new Date(this.gf.getCinIsoDate(se.searchhotel.CheckInDate));
                  se.datecout = new Date(this.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
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
        fromdate = new Date(se.bookCombo.CheckInDate);
        todate = new Date(se.bookCombo.CheckOutDate);
      }

      let modal = await se.modalCtrl.create({
        component: SelectDateRangePage,
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
              if(!todate){
                todate = moment(fromdate).add('days',1);
              }
              se.searchhotel.CheckInDate = moment(fromdate).format('YYYY-MM-DD');
              se.searchhotel.CheckOutDate = moment(todate).format('YYYY-MM-DD');
              se.booking.CheckInDate = moment(fromdate).format('YYYY-MM-DD');
              se.booking.CheckOutDate = moment(todate).format('YYYY-MM-DD');

            }
            se.zone.run(()=>{
              se.cin = se.searchhotel.CheckInDate;
              se.cout = se.searchhotel.CheckOutDate;
              se.datecin = new Date(this.gf.getCinIsoDate(se.searchhotel.CheckInDate));
              se.datecout = new Date(this.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
              se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
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
}