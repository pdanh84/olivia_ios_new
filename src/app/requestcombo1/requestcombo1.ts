import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController, Platform, AlertController, ToastController, NavController } from '@ionic/angular';
import { SearchHotel, ValueGlobal, Bookcombo } from '../providers/book-service';
import * as moment from 'moment';

import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import { PickupCalendarPage } from '../pickup-calendar/pickup-calendar';
import { OccupancyPage } from '../occupancy/occupancy';
import { OverlayEventDetail } from '@ionic/core';
import * as $ from 'jquery';

import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';
import { SelectDateRangePage } from '../selectdaterange/selectdaterange.page';
//import { Appsflyer } from '@ionic-native/appsflyer/ngx';

@Component({
  selector: 'app-requestcombo1',
  templateUrl: 'requestcombo1.html',
  styleUrls: ['requestcombo1.scss'],
})

export class RequestCombo1Page implements OnInit {
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
  public myCalendar: any;

  inputtext: boolean = false;
  listPaxSuggestByMemberId:any = [];
  listpaxhint: any = [];
  hidepaxhint: boolean = false;
  currentSelectPax: any;
  arrPlace: any;
  arrtransportDepartTime; arrtransportReturnTime; transportDepartTime; transportReturnTime
  constructor(public toastCtrl: ToastController, private alertCtrl: AlertController, public zone: NgZone, public modalCtrl: ModalController,
    public storage: Storage, public platform: Platform, public bookCombo: Bookcombo, public value: ValueGlobal,
    public searchhotel: SearchHotel, public valueGlobal: ValueGlobal, public navCtrl: NavController,
    public gf: GlobalFunction,
    private fb: Facebook) {

  }

  ngOnInit() {
    var se = this;
    se.storage.get('email').then(email => {
      se.usermail = email;
    });
    se.storage.get('username').then(name => {
      se.customerName = name;
    });
    se.storage.get('infocus').then(infocus => {
      if (infocus) {
        se.mobile = infocus.phone;
      }
    });
    if (se.searchhotel.adult) {
      se.adult = se.searchhotel.adult;
    }
    if (se.searchhotel.child) {
      se.child = se.searchhotel.child;
    }
    if (se.searchhotel.CheckInDate) {
      se.cin = this.gf.getCinIsoDate(se.searchhotel.CheckInDate);
      se.datecin = new Date(this.gf.getCinIsoDate(se.searchhotel.CheckInDate));
      se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
      se.cin = moment(se.datecin).format('YYYY-MM-DD');
      se.datecout = new Date(this.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
      se.cout = moment(se.datecout).format('YYYY-MM-DD');
    } else {
      se.cin = new Date(this.gf.getCinIsoDate(new Date()));
      let rescin = se.cin.setTime(se.cin.getTime() + (24 * 60 * 60 * 1000));
      let datein = new Date(this.gf.getCinIsoDate(rescin));
      se.cin = moment(datein).format('YYYY-MM-DD');
      se.cindisplay = moment(datein).format('DD-MM-YYYY');
      se.datecin = new Date(this.gf.getCinIsoDate(rescin));
    }
    se.isFlashSaleCombo = se.bookCombo.isFlashSale;
    //Xử lý nút back của dt
    se.platform.ready().then(() => {
      se.platform.backButton.subscribe(() => {
        // code that is executed when the user pressed the back button
        se.navCtrl.back();
      })
    })
    let priceshow:any = se.bookCombo.ComboDetail && se.bookCombo.ComboDetail.comboDetail ? Number(se.bookCombo.ComboDetail.comboDetail.totalPriceSale.toString().replace(/\./g, '').replace(/\,/g, '')) : se.gf.convertStringToNumber(se.bookCombo.ComboRoomPrice);
    se.bookCombo.location = se.location;
    se.searchhotel.gaComboId = se.bookCombo.HotelCode;
    se.searchhotel.gaComboName = se.searchhotel.gaHotelDetail.Combos? se.searchhotel.gaHotelDetail.Combos.Title : se.bookCombo.HotelName;
    se.searchhotel.totalPrice = priceshow;
     se.gf.logEventFirebase('On request',se.searchhotel, 'requestcombo', 'begin_checkout', 'Combo');

    se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_INITIATED_CHECKOUT, {
      'fb_content_type': 'hotel', 'fb_content_id': se.bookCombo.HotelCode, 'fb_num_items': 1, 'fb_value': se.gf.convertNumberToDouble(se.bookCombo.ComboRoomPrice ? se.bookCombo.ComboRoomPrice : 0), 'fb_currency': 'VND',
      'checkin_date': se.searchhotel.CheckInDate, 'checkout_date ': se.searchhotel.CheckOutDate, 'num_adults': se.searchhotel.adult, 'num_children': (se.searchhotel.child ? se.searchhotel.child : 0)
    }, se.gf.convertStringToNumber(se.bookCombo.ComboRoomPrice));

    se.storage.get('jti').then(jti => {
      if (jti) {
        se.gf.RequestApi('GET', C.urls.baseUrl.urlMobile + '/api/Dashboard/GetListNameHotel?memberid=' + jti, {}, {}, 'flightadddetails', 'GetListNameHotel').then((data) => {
          if(data && data.response && data.response.length >0){
            se.listPaxSuggestByMemberId = [...data.response];
          }
        })
      }
    })
  }

  ionViewDidLoad() {

  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  sendRequest() {
    var se = this;
    this.valueGlobal.checksendcb = false;
    if (this.customerName && this.customerName != "") {
      //Validate số điện thoại
      if (this.mobile.length > 0 && !this.filterPhone(this.mobile)) {
        this.mobilevalidate = false;
        this.setInputFocus("cusMobile");
        this.presentToast('Số điện thoại không hợp lệ. Vui lòng nhập lại.');
        return;
      } else if (this.filterPhone(this.mobile)) {
        this.mobilevalidate = true;
      }
      //Validate email
      if (!this.filterEmail(this.usermail) || !this.gf.checkUnicodeCharactor(this.usermail)) {
        this.emailvalidate = false;
        this.setInputFocus("cusEmail");
        this.presentToast('Email không hợp lệ. Vui lòng nhập lại.');
        return;
      } else if (this.filterEmail(this.usermail)) {
        this.emailvalidate = true;
      }
      //Gửi yêu cầu
      var transportDepartTime;
      var transportReturnTime;
      if (this.transportDepartTime) {
        transportDepartTime = this.transportDepartTime.trim();
      }
      if (this.transportReturnTime) {
        transportReturnTime = this.transportReturnTime.trim();
      }

      let priceshow = se.bookCombo.ComboDetail && se.bookCombo.ComboDetail.comboDetail ? se.gf.convertNumberToString(se.bookCombo.ComboDetail.comboDetail.totalPriceSale) : se.gf.convertNumberToString((se.bookCombo.ComboRoomPrice ? se.bookCombo.ComboRoomPrice : 0));
        se.searchhotel.totalPrice = priceshow;
        se.gf.logEventFirebase('On request',se.searchhotel, 'requestcombo', 'add_shipping_info', 'Combo');
        se.gf.logEventFirebase('On request',se.searchhotel, 'requestcombo', 'add_payment_info', 'Combo');

      var options;
      var form = "";
      var urlstr = "";
      if (this.bookCombo.isFlashSale) {
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
          child: this.searchhotel.child,
          ChildAgeStr: "",
          Troom: this.bookCombo.roomNb,
          UrlBookBack: "",
          HotelLink: this.bookCombo.HotelLink,
          RoomData: null,
          Markup: "0",
          Username: 'kmudivivu',
          employeeKey: '',
          TPDepartTime: transportDepartTime,
          TPReturnTime: transportReturnTime,
          source: 8,
        });
        urlstr = C.urls.baseUrl.urlContracting + '/gui-yeu-cau-gia-deal-fs';
      }
       options = {
        'method': 'POST',
        'url': urlstr,
        'headers': {
          'Content-Type': 'application/json'
        },
        body: form
      };
      let headers = { 
        'content-type':  'application/x-www-form-urlencoded; charset=UTF-8'
      };
      this.gf.RequestApi('POST', urlstr, headers, form, 'requestCombo1', 'sendRequest').then((data)=>{

          if (data.success) {
            se.bookCombo.bookingcode = data.id;
            se.presentAlert('Gửi yêu cầu thành công', 'Báo giá sẽ được gửi tới email của quý khách.');
            setTimeout(() => {
              se.modalCtrl.dismiss();
            }, 200);
            //se.gf.googleAnalytionCustom('ecommerce_purchase',{item_category:'requestcombo' , item_name: se.bookCombo.HotelName, item_id: se.bookCombo.HotelCode, start_date: se.cin, end_date: se.cout, value: Number(se.bookCombo.ComboRoomPrice ? se.bookCombo.ComboRoomPrice.toString().replace(/\./g, '').replace(/\,/g, '') : 0) ,currency: "VND"});
            se.searchhotel.totalPrice = priceshow;
            se.searchhotel.paymentType = 'On request';
            se.gf.logEventFirebase('On request',se.searchhotel, 'requestcombo', 'purchase', 'Combo');

            se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_PURCHASED, {'fb_content_type': 'hotel'  ,'fb_content_id': se.bookCombo.HotelCode,'fb_num_items': 1, 'fb_value': se.gf.convertNumberToDouble(se.bookCombo.ComboRoomPrice) ,  'fb_currency': 'VND' , 
              'checkin_date': se.searchhotel.CheckInDate ,'checkout_date ': se.searchhotel.CheckOutDate,'num_adults': se.searchhotel.adult,'num_children': (se.searchhotel.child ? se.searchhotel.child : 0), }, se.gf.convertStringToNumber(se.bookCombo.ComboRoomPrice) );

          } else {
            se.presentAlert('Gửi yêu cầu không thành công', 'Vui lòng kiểm tra lại thông tin trước khi gửi.')
          }

      })
    } else {
      this.presentToast('Họ tên không được để trống. Vui lòng nhập lại.');
      //Set lại focus cho input
      this.setInputFocus("cusName");
    }
  }
  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  setInputFocus(name) {
    const element = window.document.getElementById(name);
    //this.renderer.invokeElementMethod(element, 'focus', []);
  }

  async openmnu() {
    this.gf.setParams(true, 'requestcombo');
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: OccupancyPage
      })
    modal.present();
    var se = this;
    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      let self = this;
      self.zone.run(() => {
        if (self.searchhotel.adult) {
          self.adult = self.searchhotel.adult;
        }
        self.child = self.searchhotel.child;
      })
    })
  }

  async clickedElement(e: any) {
    var obj: any = e.currentTarget;
    if ($(obj.parentNode).hasClass('endSelection') || $(obj.parentNode).hasClass('startSelection')) {
      if (this.modalCtrl) {
        let fday: any;
        let tday: any;
        var monthenddate: any;
        var yearenddate: any;
        var monthstartdate: any;
        var yearstartdate: any;
        var objTextMonthEndDate: any;
        var objTextMonthStartDate: any;

        if ($(obj.parentNode).hasClass('endSelection')) {
          fday = $('.on-selected')[0].textContent;
          tday = $(obj)[0].textContent;

          objTextMonthStartDate = $('.on-selected').closest('.month-box').children()[0].textContent;
          objTextMonthEndDate = $(obj).closest('.month-box').children()[0].textContent;
        } else {
          fday = $(obj)[0].textContent;
          tday = $('.endSelection').children('.days-btn')[0].textContent;

          objTextMonthStartDate = $(obj).closest('.month-box').children()[0].textContent;
          objTextMonthEndDate = $('.endSelection').closest('.month-box').children()[0].textContent;
        }


        if (objTextMonthEndDate && objTextMonthEndDate.length > 0 && objTextMonthStartDate && objTextMonthStartDate.length > 0) {
          monthstartdate = objTextMonthStartDate.split('/')[0];
          yearstartdate = objTextMonthStartDate.split('/')[1];
          monthenddate = objTextMonthEndDate.split('/')[0];
          yearenddate = objTextMonthEndDate.split('/')[1];
          var fromdate = new Date(yearstartdate, monthstartdate - 1, fday);
          var todate = new Date(yearenddate, monthenddate - 1, tday);
          var se = this;
          if (fromdate && todate && moment(todate).diff(fromdate, 'days') > 0) {
            setTimeout(() => {
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

  async openPickupCalendar() {
    let se = this;
    let fromdate = new Date();
    let todate = new Date();
    if (se.bookCombo.CheckInDate && se.bookCombo.CheckOutDate) {
      fromdate = new Date(se.bookCombo.CheckInDate);
      todate = new Date(se.bookCombo.CheckOutDate);
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
    if (event) {
      let fromdate = this.gf.getCinIsoDate(event.data.from);
      let todate:any = this.gf.getCinIsoDate(event.data.to);
      if (fromdate) {
        if (event.data) {
          if (!todate) {
            todate = moment(fromdate).add('days', 1);
          }
          se.zone.run(()=>{
            se.cin = se.searchhotel.CheckInDate;
            se.cout = se.searchhotel.CheckOutDate;
            se.datecin = new Date(this.gf.getCinIsoDate(se.searchhotel.CheckInDate));
            se.datecout = new Date(this.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
            se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
          })
          se.gf.setCacheSearchHotelInfo({checkInDate: se.searchhotel.CheckInDate, checkOutDate: se.searchhotel.CheckOutDate, adult: se.searchhotel.adult, child: se.searchhotel.child, childAge: se.searchhotel.arrchild, roomNumber: se.searchhotel.roomnumber});
          se.searchhotel.CheckInDate = moment(fromdate).format('YYYY-MM-DD');
          se.searchhotel.CheckOutDate = moment(todate).format('YYYY-MM-DD');
          se.bookCombo.CheckInDate = moment(fromdate).format('YYYY-MM-DD');
          se.bookCombo.CheckOutDate = moment(todate).format('YYYY-MM-DD');
        }
        se.zone.run(() => {
          se.cin = se.searchhotel.CheckInDate;
          se.cout = se.searchhotel.CheckOutDate;
          se.datecin = new Date(this.gf.getCinIsoDate(se.searchhotel.CheckInDate));
          se.datecout = new Date(this.gf.getCinIsoDate(se.searchhotel.CheckOutDate));
          se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
        })

      }
    }
    return true;
  }

  async presentAlert(title, msg) {
    const alert = await this.alertCtrl.create({
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  /***
   * Xử lý change value radio khi click vào label
   * PDANH 26/02/2019
   */
  radioCheck(value) {
    var itemListDeparture = window.document.getElementsByClassName('list-departure');
    var itemRadioDeparture = window.document.getElementsByClassName('rd-departure');
    //var itemRadioButton = window.document.getElementsByClassName('radio-icon')
    let itemprices = this.bookCombo.ComboDetail.list;
    if (value == 1) {
      itemListDeparture[0].setAttribute('aria-activedescendant', "rb-1-0");
      // itemRadioButton[0].classList.add('radio-checked');
      // itemRadioButton[1].classList.remove('radio-checked');
      // itemRadioButton[0].nextElementSibling.setAttribute('aria-checked','true');
      // itemRadioButton[1].nextElementSibling.setAttribute('aria-checked','false');
      this.location = "SGN";
      this.bookCombo.ComboRoomPrice = (itemprices.length > 0 && itemprices[0] && itemprices[0].details[0]) ? itemprices[0].details[0].totalPriceSale : 0;
    } else {
      itemListDeparture[0].setAttribute('aria-activedescendant', "rb-1-1");
      // itemRadioButton[1].classList.add('radio-checked');
      // itemRadioButton[0].classList.remove('radio-checked');
      // itemRadioButton[1].nextElementSibling.setAttribute('aria-checked','true');
      // itemRadioButton[0].nextElementSibling.setAttribute('aria-checked','false');
      this.location = "HN";
      this.bookCombo.ComboRoomPrice = (itemprices.length > 0 && itemprices[1] && itemprices[1].details[0]) ? itemprices[1].details[0].totalPriceSale : 0;
    }
  }
  /***
   * Gọi tổng đài hỗ trợ
   * PDANH 26/02/2019
   */
  async makeCallSupport(value) {
    try {
      let tel = "19001870";
      if (value == 1) {
        tel = "19002045";
      } else if (value == 2) {
        tel = "19001870";
      }
      else {
        tel = "19002087";
      }
      setTimeout(() => {
        window.open(`tel:${tel}`, '_system');
      }, 100);
    }
    catch (error:any) {
      if (error) {
        error.page = "requestcombo";
        error.func = "makeCallSupport";
        C.writeErrorLog(error, null);
        throw new Error(error)
      };
    }
    //google analytic
    this.gf.googleAnalytion('requestcombo', 'callsupport', '');
  }

  filterPhone(phone) {
    var pattern = new RegExp("0[9|8|1|7|3|5]([0-9]|\s|-|\.){8,12}");
    return pattern.test(phone);
  }

  filterEmail(email) {
    var regex = new RegExp(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/);
    return regex.test(email);
  }
  selectclickdepart(events) {
    this.zone.run(() => {
      this.transportDepartTime = events.detail.value;
    })

  }
  selectclickreturn(events) {
    this.zone.run(() => {
      this.transportReturnTime = events.detail.value;
    })

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
    setTimeout(() => {
      se.inputtext = false;

      //se.checkInput(item, 2, isadult);
      if (se.hidepaxhint) {
        if (item) {
          item.hidePaxHint = true;
        }
        //item.hidePaxHint = true;
        se.hidepaxhint = false;
      }
    }, 400)

  }

  async createHintPaxName(item, listpaxhint) {
    var se = this;
    if (item) {
      se.currentSelectPax = item;
    }
    se.listpaxhint = [...listpaxhint];
  }

  selectPaxHint(paxhint) {
    var se = this;
    if (paxhint) {
      if (se.currentSelectPax) {
        se.currentSelectPax.hoten = paxhint.fullName ? paxhint.fullName : se.currentSelectPax.hoten;
        se.currentSelectPax.phone = paxhint.phoneNumber ? paxhint.phoneNumber : se.currentSelectPax.phone;
      }
      else {
        se.customerName = paxhint.fullName ? paxhint.fullName : se.customerName;
        se.mobile = paxhint.phoneNumber ? paxhint.phoneNumber : se.mobile;
        se.usermail = paxhint.email && se.filterEmail(paxhint.email) ? paxhint.email : se.usermail;
      }

    }
  }
  hidePaxHint() {
    this.hidepaxhint = true;
  }

  inputOnFocus(item, type) {
    var se = this;

    //se.clearError(item, type);
    if (type == 9 && !se.customerName) {

      if (se.listPaxSuggestByMemberId && se.listPaxSuggestByMemberId.length > 0) {
        se.inputtext = true;
        se.createHintPaxName(item, se.listPaxSuggestByMemberId);

      } else {
        se.storage.get('listpaxcache').then((data) => {
          if (data) {
            se.inputtext = true;
            se.createHintPaxName(item, se.listPaxSuggestByMemberId);
          }
        })
      }
    }
  }
}