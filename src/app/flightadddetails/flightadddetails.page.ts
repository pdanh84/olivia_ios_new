import { FlightcardbambooPage } from './../flightcardbamboo/flightcardbamboo.page';
import { Component,OnInit, NgZone, HostListener, ViewChild } from '@angular/core';
import { NavController,Platform, ModalController, ActionSheetController, PickerController,AlertController, IonContent } from '@ionic/angular';
import { SearchHotel } from '../providers/book-service';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import { ValueGlobal } from '../providers/book-service';
import { flightService } from '../providers/flightService';
import * as moment from 'moment';
import {FlightpricedetailPage} from './../flightpricedetail/flightpricedetail.page';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { FlightpointsavePage } from './../flightpointsave/flightpointsave.page';
import { OverlayEventDetail } from '@ionic/core';
import { ConfirmemailPage } from '../confirmemail/confirmemail.page';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { Facebook } from '@awesome-cordova-plugins/facebook/ngx';
import { flightConfirmBookingDetailPage } from '../flightconfirmbookingdetail/flightconfirmbookingdetail.page';
import { SelectDateOfBirthPage } from '../selectdateofbirth/selectdateofbirth.page';
import { ActivityService } from '../providers/globalfunction';
import { Router } from '@angular/router';
import { voucherService } from '../providers/voucherService';
import * as $ from 'jquery';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';

/**
 * Generated class for the OccupancyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-flightadddetails',
  templateUrl: 'flightadddetails.page.html',
  styleUrls: ['flightadddetails.page.scss'],
})
export class FlightadddetailsPage implements OnInit {
  @ViewChild('scrollArea') scrollFlightAddetailsArea: IonContent;
    adults:any =[];
    childs:any = [];
    maxAgeOfChild:any = 2020;
    adult: any;
    child: any;
    totalPriceDisplay: any;
    activeStep: number=1;
    userInfoData: any;
    public userData: FormGroup;
    hoten ='';
    sodienthoai = '';
    email = '';
  loginuser: any;
  ischeckedit = true;
  ischeck: any;
  companyname: any;
  address: any;
  tax: any;
  Invoice: boolean;
  maxbod: string;
  options: {
    method: string; url: string;
    timeout: number; maxAttempts: number; retryDelay: number; headers: { Authorization: string; 'Content-Type': string; }; body: string;
  };
  gender: any;
  showLotusPoint = false;
  showCardBamBoo = false;
  flightcodesave = "";
  inputtext: boolean = false;
  listpaxhint: any[];
  currentSelectPax: any;
  checkchangeemail=false;
  jti: any;
  isExtenal: boolean = false;
  showSelectCountry: boolean = false;
  listcountry:any = [];
  listcountryFull:any = [];
  textCountrySearch: any;
  showSelectPassportCountry: boolean = false;
  textPassportCountrySearch: any;
  listpassportcountry:any = [];
  emailinvalid: boolean;
  hoteninvalid: boolean;
  sodienthoaiinvalid: boolean;
  hasinput: boolean = false;
  subnameinvalid: boolean;
  ishideNameMail=false;hotenhddt;emailhddt;addressorder
  hidepaxhint: boolean = false;
  listPaxSuggestByMemberId:any = [];
  subscription: any;
  allowClickDateOfBirth = true;
  allowCheckinOnline: boolean = true;
  contactOption:any="zalo";
  departFlight: any;
  returnFlight: any;
  expanddivairlinemember: boolean;
  textCheckinOnline: string;
  isInternal: boolean;
  isApiDirect: any;
  constructor(public platform: Platform,public navCtrl: NavController, public modalCtrl: ModalController,public valueGlobal:ValueGlobal,
    public searchhotel: SearchHotel, public gf: GlobalFunction,
    public actionsheetCtrl: ActionSheetController,
    public pickerController: PickerController,
    private zone: NgZone,
    public _flightService: flightService,
    public formBuilder: FormBuilder,
    private _keyboard: Keyboard,
    private storage: Storage,public alertCtrl: AlertController,
    private fb: Facebook,
    public activityService: ActivityService,
    private router: Router,
    public _voucherService: voucherService,
    private _clipboard: Clipboard) {
      this.platform.resume.subscribe(async()=>{
        if(!this._flightService.itemFlightCache){
          this._flightService.itemTabFlightActive.emit(true);
          this.valueGlobal.backValue = "homeflight";
          this._flightService.itemMenuFlightClick.emit(2);
          this.navCtrl.navigateBack('/tabs/tab1');
        }
      })
        if(this._flightService.itemFlightCache){
          let totalprice:any = this._flightService.itemFlightCache.departFlight.totalPrice + (this._flightService.itemFlightCache.returnFlight ? this._flightService.itemFlightCache.returnFlight.totalPrice : 0);
          this.totalPriceDisplay = this.gf.convertNumberToString(totalprice);
          
          this.isInternal = this._flightService.itemFlightCache.fromCountryCode == 'VN' && this._flightService.itemFlightCache.toCountryCode == 'VN';
          this.isApiDirect = this._flightService.itemFlightCache.isApiDirect;
          this.departFlight = this._flightService.itemFlightCache.departFlight;
          if(this._flightService.itemFlightCache.returnFlight){
            this.returnFlight = this._flightService.itemFlightCache.returnFlight;
          }
          this.listcountry = this.gf.getNationList();
          this.listcountryFull = [...this.listcountry];
          this.isExtenal = this._flightService.itemFlightCache.isExtenal;
            this.showLotusPoint = ((this._flightService.itemFlightCache.departFlight && this._flightService.itemFlightCache.departFlight.airlineCode.indexOf('VietnamAirlines') != -1) || (this._flightService.itemFlightCache.returnFlight && this._flightService.itemFlightCache.returnFlight.airlineCode.indexOf('VietnamAirlines') != -1)) ? true : false;
            this.showCardBamBoo = ((this._flightService.itemFlightCache.departFlight && this._flightService.itemFlightCache.departFlight.airlineCode.indexOf('BambooAirways') != -1) || (this._flightService.itemFlightCache.returnFlight && this._flightService.itemFlightCache.returnFlight.airlineCode.indexOf('BambooAirways') != -1)) ? true : false;
            this._flightService.itemFlightCache.showLotusPoint = this.showLotusPoint;
            this._flightService.itemFlightCache.showCardBamBoo = this.showCardBamBoo;
          this.maxbod = moment(new Date()).format('YYYY-MM-DD');
          let infant = this._flightService.itemFlightCache.infant >0 ? this._flightService.itemFlightCache.infant : 0;
            this.adult = this._flightService.itemFlightCache.adult;
            this.child = this._flightService.itemFlightCache.child*1 + infant*1;
            //this.totalPriceDisplay = this._flightService.itemFlightCache.totalPriceDisplay;
            this.maxAgeOfChild = moment(new Date()).format('YYYY').toString();
            let mindob ='2007', maxdob = '2020';
            let amindob ='1900', amaxdob = new Date().getFullYear() - 12, maxepdate = 2100;
            let departdate = this._flightService.itemFlightCache.roundTrip ? moment(this._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD') : moment(this._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');
            for (let index = 0; index < this._flightService.itemFlightCache.adult; index++) {
                this.adults.push({id: index+1, name: '', subName: '', gender: 1, genderdisplay: '', airlineMemberCode: '',airlineMemberCodeReturn: '',airlineCardCode:'', dateofbirth: '', mindob: amindob, maxdob: amaxdob, isChild: false,country: '',passport: '', passportCountry: '', passportExpireDate: '', maxepdate: maxepdate,
                                  errorName: false});
            }
            if(this._flightService.itemFlightCache.child >0){
              this.zone.run(()=>{
                maxdob = moment( moment(moment(departdate).add(-2, 'years')).add(-1,'days') ).format('YYYY-MM-DD');//trên 2 tuổi
                mindob = moment(moment(departdate).add(-12, 'years')).add(1,'days').format('YYYY-MM-DD');//dưới 12 tuổi
                  for (let index = 0; index < this._flightService.itemFlightCache.child; index++) {
                      this.childs.push({id: index+1, name: '', subName: '', dateofbirth: '', gender: 1, genderdisplay: '', isInfant: false, mindob: mindob, maxdob: maxdob, isChild: true ,country: '',passport: '', passportCountry: '', passportExpireDate: '', maxepdate: maxepdate});
                  }
              })
            }
            if(this._flightService.itemFlightCache.infant >0){
              this.zone.run(()=>{
                maxdob = moment(moment(departdate).add(-14, 'days')).format('YYYY-MM-DD');//trên 14 ngày tuổi
                mindob = moment( moment(moment(departdate).add(-2, 'years')).add(1,'days') ).format('YYYY-MM-DD');//dưới 2 tuổi
                for (let index = 0; index < this._flightService.itemFlightCache.infant; index++) {
                    this.childs.push({id: (this._flightService.itemFlightCache.child > 0 ? this._flightService.itemFlightCache.child : index) +1, iddisplay: index +1, name: '', subName: '', dateofbirth: '', gender: 1, genderdisplay: '', isInfant: true, mindob: mindob, maxdob: maxdob, isChild: true ,country: '',passport: '', passportCountry: '', passportExpireDate: '', maxepdate: maxepdate});
                }
              })
          }
            this.loadUserInfo();
            this.checkAndRebindPaxInfo();
           
          let se = this;
          se.fb.logEvent(se.fb.EVENTS.EVENT_NAME_INITIATED_CHECKOUT, {'fb_content_type': 'flight','fb_content_id': 'flightadddetails', 'fb_value': (se._flightService.itemFlightCache.totalPrice ? se.gf.convertNumberToDouble(se._flightService.itemFlightCache.totalPrice) : 0) , 'fb_currency': 'VND' ,
          'destination_airport': se._flightService.itemFlightCache.returnCode,'origin_airport' : se._flightService.itemFlightCache.departCode  ,
          'departing_departure_date': se._flightService.itemFlightCache.checkInDate ,'returning_departure_date ': se._flightService.itemFlightCache.checkOutDate,'num_adults': se._flightService.itemFlightCache.adult,'num_children': se._flightService.itemFlightCache.child ? se._flightService.itemFlightCache.child : 0,'num_infants': se._flightService.itemFlightCache.infant ? se._flightService.itemFlightCache.infant : 0, }, se._flightService.itemFlightCache.totalPrice ? se.gf.convertStringToNumber(se._flightService.itemFlightCache.totalPrice) : 0);
       
          se.gf.logEventFirebase('', se._flightService.itemFlightCache, 'flightadddetails', 'add_shipping_info', 'Flights');
          //this.checkAllowCheckinOnline();
          //pdanh 08-08-2023: Sửa lại load từ api summarybooking ở trang searchresult
          this.zone.run(() => {
            let dataBooking = this._flightService.itemFlightCache.dataBooking;
            if(dataBooking && dataBooking.allowRequestCheckinOnline){
              this._flightService.itemFlightCache.allowCheckinOnline = dataBooking.allowRequestCheckinOnline.allowCheckin;
              this._flightService.itemFlightCache.textCheckinOnline = dataBooking.allowRequestCheckinOnline.note;
              this.allowCheckinOnline = dataBooking.allowRequestCheckinOnline.allowCheckin;
              this.textCheckinOnline = dataBooking.allowRequestCheckinOnline.note;
            }else{
              this._flightService.itemFlightCache.allowCheckinOnline = false;
              this.allowCheckinOnline = false;
              this._flightService.itemFlightCache.textCheckinOnline = dataBooking.allowRequestCheckinOnline && dataBooking.allowRequestCheckinOnline.note ? dataBooking.allowRequestCheckinOnline.note : '';
              this.textCheckinOnline =dataBooking.allowRequestCheckinOnline && dataBooking.allowRequestCheckinOnline.note ? dataBooking.allowRequestCheckinOnline.note : '';
            }
            
          })
        }
        
    }

     //pdanh 02-08-2023: Thêm rule valid checkin online
     checkAllowCheckinOnline(){
      let _time = moment(this._flightService.itemFlightCache.departFlight.departTime).diff(new Date(), 'minutes');
       //_time = khoảng thời gian từ lúc book vé so với ngày khởi hành
       //Nếu _time > 24 tiếng => cho phép chọn checkin online
       this.zone.run(() => {
        if(_time > 24*60){
          this.allowCheckinOnline = true;
          this.textCheckinOnline = "* Thẻ lên tàu bay sẽ được cập nhật trong vòng 24 tiếng trước khi đóng chuyến";
        }
        //Nếu 4 < _time < 24: Ẩn nút YC Checkin online
        else if(24*60 > _time && _time > 4*60){
          this.allowCheckinOnline = false;
          this.textCheckinOnline = "* Vui lòng liên hệ nhân viên iVIVU để được hỗ trợ";
        }
        //Nếu _time <= 4: Ẩn nút YC Checkin online
        else if(_time <=4*60){
          this.allowCheckinOnline = false;
          this.textCheckinOnline = "* Chuyến bay trong khung đóng chuyến. Quý khách vui lòng làm thủ tục tại sân bay";
        }
      })
    }

    ionViewDidEnter(){
      this.storage.get('contactOption').then((co)=>{
        this.zone.run(()=>{
            if(co){
              this.contactOption = co;
            }else{
                this.contactOption = 'zalo';
            }
        })
      })
    }
    GetUserInfo(auth_token) {
      var se = this;
          var text = "Bearer " + auth_token;
          let headers = {
            'cache-control': 'no-cache',
              'content-type': 'application/json',
              authorization: text
          };
          let strUrl = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo';
          this.gf.RequestApi('GET', strUrl, headers, {}, 'flightAddDetails', 'GetUserInfo').then((data)=>{
              if (data && !data.statusCode) {
                se.zone.run(() => {
                  se.ischeck = false;
                  var corpInfomations=data.corpInfomations[0];
                  if(corpInfomations){
                    se.companyname = corpInfomations.legalName;
                    se.address = corpInfomations.address;
                    se.tax = corpInfomations.taxCode;
                    se._flightService.itemFlightCache.companyname =corpInfomations.legalName;
                    se._flightService.itemFlightCache.address =corpInfomations.address;
                    se._flightService.itemFlightCache.tax = corpInfomations.taxCode;
                    se.ischeck = true;
                  }
                  else{
                    se.storage.get('orderflight').then(order => {
                      if (order) {
                        se.companyname = order.companyname;
                        se.address = order.address;
                        se.tax = order.tax;
                        se.addressorder = order.addressorder;
                        se.hotenhddt=order.hotenhddt;
                        se.emailhddt=order.emailhddt;
                        se.ishideNameMail=order.ishideNameMail;
                        se._flightService.itemFlightCache.companyname = order.companyname;
                        se._flightService.itemFlightCache.address = order.address;
                        se._flightService.itemFlightCache.tax = order.tax;
                        se.ischeck = true;
                        se.ishideNameMail = se.contactOption == 'zalo';
                      } else {
                        se.ischeck = false;
                        se._flightService.itemFlightCache.companyname = '';
                        se._flightService.itemFlightCache.address = '';
                        se._flightService.itemFlightCache.tax = '';
                      }
                    })
                  }
                })
              }else{
                se.storage.get('orderflight').then(order => {
                  if (order) {
                    se.companyname = order.companyname;
                    se.address = order.address;
                    se.tax = order.tax;
                    se.addressorder = order.addressorder;
                    se.hotenhddt=order.hotenhddt;
                    se.emailhddt=order.emailhddt;
                    se.ishideNameMail=order.ishideNameMail;
                    se._flightService.itemFlightCache.companyname = order.companyname;
                    se._flightService.itemFlightCache.address = order.address;
                    se._flightService.itemFlightCache.tax = order.tax;
                    se.ischeck = true;
                    se.ishideNameMail = se.contactOption == 'zalo';
                  } else {
                    se.ischeck = false;
                    se._flightService.itemFlightCache.companyname = '';
                    se._flightService.itemFlightCache.address = '';
                    se._flightService.itemFlightCache.tax = '';
                  }
                })
              }
  
            
          });
        
      
    }
    @HostListener('keydown', ['$event'])
    keyEvent(e) {
      var se = this;
        let code = e.keyCode || e.which;
        if (code === 13) {
              if(se._keyboard && se._keyboard.isVisible){
                setTimeout(()=>{
                  se.checkValidInput().then((valid) => {                  
                      if(valid){
                        se.gotopayment();
                      }else{
                            se._keyboard.hide();
                            se.inputtext = false;
                      }
                  })
                },50)
              }
        }
    }

        ngOnInit(){
            var se =this;
            se._flightService.itemFlightLogin.subscribe((data)=>{
                if(data){
                  setTimeout(()=>{
                    se.loadUserInfo();
                  },300)
                    
                }
            })

            this.platform.ready().then(() => {
              this.zone.run(()=>{
                this.subscription = this.platform.backButton.subscribeWithPriority(9999, async(ev) => {
                  this.goback();
                })
              })
            })
        }

        ionViewWillLeave(){
          this.subscription.unsubscribe();
        }

        checkAndRebindPaxInfo(){
          var se = this;
          se.storage.get('paxdetailInfo').then((data) =>{
            if(data){
              se.zone.run(()=>{
                if(data.adults && data.adults.length >0){
                    for (let index = 0; index < this.adults.length; index++) {
                      const element = this.adults[index];
                      const elementcache = data.adults[index];
                      if(elementcache){
                        element.id = elementcache.id;
                        element.name = elementcache.name;
                        element.subName = elementcache.subName;
                        element.gender = elementcache.gender;
                        element.genderdisplay = elementcache.genderdisplay;
                        //element.airlineMemberCode = elementcache.airlineMemberCode;
                        //element.airlineCardCode = elementcache.airlineCardCode;
                        if(elementcache.dateofbirth){
                          element.dateofbirth = elementcache.dateofbirth;
                          element.birdayDisplay = elementcache.dateofbirth ? moment(elementcache.dateofbirth).format('DD/MM/YYYY') : '';
                        }
                        
                        if(se.isExtenal && se.showLotusPoint){
                          element.dateofbirth = elementcache.dateofbirth;
                          element.birdayDisplay = elementcache.dateofbirth ? moment(elementcache.dateofbirth).format('DD/MM/YYYY') : '';
                          element.country = elementcache.country;
                          element.passport = elementcache.passport;
                          element.passportCountry = elementcache.passportCountry;
                          element.passportExpireDate = elementcache.passportExpireDate;
                       }

                       if(element.gender){
                        this.checkInput(element, 1, true);
                      }
                      if(element.name){
                        this.checkInput(element, 2, true);
                      }
                      
                      if(this.isExtenal && this.showLotusPoint){
                        if(element.dateofbirth){
                          this.checkInput(element, 3, true);
                        }
                        if(element.country){
                          this.checkInput(element, 4, true);
                        }
                        if(element.passport){
                          this.checkInput(element, 5, true);
                        }
                        if(element.passportCountry){
                          this.checkInput(element, 6, true);
                        }
                        if(element.passportExpireDate){
                          this.checkInput(element, 7, true);
                        }
                      }
                      }
                    }
                  }

                  let mindob ='2007', maxdob = '2020';
                  let departdate = se._flightService.itemFlightCache.roundTrip ? moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD') : moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');

                  if(data.childs && data.childs.length >0){
                    for (let index = 0; index < this.childs.length; index++) {
                      const element = this.childs[index];
                      const elementcache = data.childs[index];
                      if(elementcache){
                        element.id = elementcache.id;
                        element.name = elementcache.name;
                        element.subName = elementcache.subName;
                        element.gender = elementcache.gender;
                        element.genderdisplay = elementcache.genderdisplay;
                        if(elementcache.dateofbirth){
                          element.dateofbirth = elementcache.dateofbirth;
                          element.birdayDisplay = elementcache.dateofbirth ? moment(elementcache.dateofbirth).format('DD/MM/YYYY') : '';
                        }
                        if(se.isExtenal && se.showLotusPoint){
                          element.country = elementcache.country;
                          element.passport = elementcache.passport;
                          element.passportCountry = elementcache.passportCountry;
                          element.passportExpireDate = elementcache.passportExpireDate;
                        }

                        this.zone.run(()=>{
                          if(!element.isInfant){
                            maxdob = moment( moment(moment(departdate).add(-2, 'years')).add(-1,'days') ).format('YYYY-MM-DD');//trên 2 tuổi
                            mindob = moment(moment(departdate).add(-12, 'years')).format('YYYY-MM-DD');//dưới 12 tuổi
                          }else{
                            maxdob = moment(moment(departdate).add(-14, 'days')).format('YYYY-MM-DD');//trên 14 ngày tuổi
                            mindob = moment( moment(moment(departdate).add(-2, 'years')).add(1,'days') ).format('YYYY-MM-DD');//dưới 2 tuổi
                          }
                            element.mindob = mindob;
                            element.maxdob = maxdob;
                        })

                        if(element.gender){
                          this.checkInput(element, 1, false);
                        }
                        if(element.name){
                          this.checkInput(element, 2, false);
                        }
                        if(element.dateofbirth){
                          this.checkInput(element, 3, false);
                        }
                        
                        if(this.isExtenal && this.showLotusPoint){
                          if(element.country){
                            this.checkInput(element, 4, false);
                          }
                          if(element.passport){
                            this.checkInput(element, 5, false);
                          }
                          if(element.passportCountry){
                            this.checkInput(element, 6, false);
                          }
                          if(element.passportExpireDate){
                            this.checkInput(element, 7, false);
                          }
                        }
                      }
                    }
                }
              })
            }
          })
        }
        

        changegender(event, item){
          if(event.detail.value){
            item.gender = event.detail.value == "Ông" ? 1 : (event.detail.value == "Bà" ? 2 : (event.detail.value == "Bé trai" ? 1 : 2));
            item.genderdisplay = event.detail.value;
          }
        }

        setAdultProperty(){
          var se = this;
          if(se.adults && se.adults.length>0){
            let itema = se.adults[0];
            if(!itema.name){
              itema.name =  se.hoten ? se.hoten : ( se.email ? se.email : '');
              if(se.gender){
                itema.gender = (se.gender == 1 || se.gender.toLowerCase().indexOf('Ông')!= -1 || se.gender.toLowerCase().indexOf('Nam')!= -1 || se.gender.toLowerCase().indexOf('m')!= -1 ) ? 1 : 2;
                itema.genderdisplay = (se.gender == 1 || se.gender.toLowerCase().indexOf('ông') != -1 || se.gender.toLowerCase().indexOf('nam') != -1 || se.gender.toLowerCase().indexOf('m')!= -1) ? 'Ông' : 'Bà';
              }
            }
          }
        }

        loadUserInfo(){
            var se = this;
            se.zone.run(()=>{
              se.storage.get('jti').then(jti => {
                if (jti) {
                  se.jti = jti;
                  se.gf.RequestApi('GET', C.urls.baseUrl.urlMobile+'/api/Dashboard/GetListName?memberid='+jti, {},{}, 'flightadddetails', 'GetListName').then((data)=>{
                      if(data && data.response && data.response.length >0){

                        this.maxAgeOfChild = moment(new Date()).format('YYYY').toString();
                        let mindob ='2007', maxdob = '2020';
                        let amindob ='1900', amaxdob = new Date().getFullYear() - 12, maxepdate = 2100;
                        let departdate = moment(this._flightService.itemFlightCache.checkOutDate);

                        for (let index = 0; index < data.response.length; index++) {
                          const element = data.response[index];
                          let checkAdult = true;
                          if(element.dateOfBirth){
                            checkAdult = moment(se._flightService.itemFlightCache.checkOutDate).diff(moment(element.dateOfBirth).format('YYYY-MM-DD'), 'months') > 144;
                          }
                          
                          if(checkAdult){
                           let item= {id: index+1, name: element.fullName, subName: '', gender: element.gender ?element.gender: 1, 
                           genderdisplay: element.gender == 1? 'Ông' : 'Bà', 
                           airlineMemberCode: element.airlineMemberCode&& this.showLotusPoint ? element.airlineMemberCode:'',
                           airlineCardCode: element.airlineCardCode&& this.showLotusPoint ? element.airlineCardCode: '', 
                           dateofbirth: element.dateOfBirth && (se._flightService.itemFlightCache.priceCathay>0 || se.isExtenal) ? element.dateOfBirth:'', mindob: amindob, maxdob: amaxdob, isChild: false,
                           maxepdate: maxepdate,
                           country: '',
                            passport: '', 
                            passportCountry: '', 
                            passportExpireDate: '',  errorName: false};

                          if(this.isExtenal ){
                            item= {id: index+1, name: element.fullName, subName: '', gender: element.gender ?element.gender: 1, 
                            genderdisplay: element.gender ==1? 'Ông' : 'Bà', 
                            airlineMemberCode: element.airlineMemberCode && this.showLotusPoint ? element.airlineMemberCode:'',
                            airlineCardCode: element.airlineCardCode && this.showLotusPoint ? element.airlineCardCode: '', 
                            dateofbirth: element.dateOfBirth ? element.dateOfBirth:'', mindob: amindob, maxdob: amaxdob, isChild: false,
                            maxepdate: maxepdate,
                            country: element.nationality ? element.nationality:'',
                              passport: element.passportNumber ? element.passportNumber: '', 
                              passportCountry: element.passportIssueCountry ? element.passportIssueCountry:'', 
                              passportExpireDate: element.passportExpired ? element.passportExpired:'',  errorName: false}
                           }

                            let isexist = se.listPaxSuggestByMemberId.some(r => r.name == element.name );
                            if(!isexist){
                              se.listPaxSuggestByMemberId.push(item);
                            }
                          }
                          else
                          {
                            let isInfant = moment(departdate).diff(moment(element.dateOfBirth), 'month') < 24 ;
                            if(isInfant){
                              maxdob = moment(moment(departdate).add(-14, 'days')).format('YYYY-MM-DD');//trên 14 ngày tuổi
                              mindob = moment( moment(moment(departdate).add(-2, 'years')).add(1,'days') ).format('YYYY-MM-DD');//dưới 2 tuổi
                            }else 
                            {
                              maxdob = moment( moment(moment(departdate).add(-2, 'years')).add(-1,'days') ).format('YYYY-MM-DD');//trên 2 tuổi
                              mindob = moment(moment(departdate).add(-12, 'years')).format('YYYY-MM-DD');//dưới 12 tuổi

                            }
                            let itemchild = {id: index+1, name: element.fullName, subName: '', gender: element.gender ?element.gender: 1, 
                            genderdisplay: element.gender ==1 ? 'Bé trai' : 'Bé gái', 
                            airlineMemberCode: element.airlineMemberCode && this.showLotusPoint ? element.airlineMemberCode:'',
                            airlineCardCode: element.airlineCardCode && this.showLotusPoint ? element.airlineCardCode: '', 
                            dateofbirth: element.dateOfBirth&& (se._flightService.itemFlightCache.priceCathay>0 || se.isExtenal) ? element.dateOfBirth:'', mindob: mindob, maxdob: maxdob, isChild: true, isInfant: isInfant,
                            country:'',
                            passport:  '', 
                            passportCountry:'', 
                            passportExpireDate: '', 
                            maxepdate: maxepdate,
                              errorName: false}
                              if(this.isExtenal){
                                itemchild = {id: index+1, name: element.fullName, subName: '', gender: element.gender ?element.gender: 1, 
                                genderdisplay: element.gender == 1? 'Bé trai' : 'Bé gái', 
                                airlineMemberCode: element.airlineMemberCode && this.showLotusPoint ? element.airlineMemberCode:'',
                                airlineCardCode: element.airlineCardCode && this.showLotusPoint ? element.airlineCardCode: '', 
                                dateofbirth: element.dateOfBirth ? element.dateOfBirth:'', mindob: mindob, maxdob: maxdob, isChild: true, isInfant: isInfant,
                                country: element.nationality ? element.nationality:'',
                                passport: element.passportNumber ? element.passportNumber: '', 
                                passportCountry: element.passportIssueCountry ? element.passportIssueCountry:'', 
                                passportExpireDate: element.passportExpired ? element.passportExpired:'', 
                                maxepdate: maxepdate,
                                  errorName: false}
                              }
                            let isexist = se.listPaxSuggestByMemberId.some(r => r.name == element.name );
                            if(!isexist){
                              se.listPaxSuggestByMemberId.push(itemchild);
                            }
                          }
                        }
                      }
                  });
                }
              })

              se.storage.get('infocus').then(infocus => {
                if (infocus) {
                  if (infocus.ho && infocus.ten) {
                    se.hoten = infocus.ho + ' ' + infocus.ten;
                    
                  } else {
                    if (infocus.ho) {
                        se.hoten = infocus.ho;
                        
                    }
                    else if (infocus.ten) {
                        se.hoten = infocus.ten;
                    }else{
                        se.hoten = '';
                    }
                  }
                  if (infocus.phone) {
                    se.sodienthoai = infocus.phone;
                    se.ischeckedit = false;
                  }

                  if(infocus.gender){
                    se.gender = infocus.gender;
                  }
                }else{
                  se.ischeckedit = false;
                }
              })
              se.storage.get('email').then(email => {
                if(email){
                  se.email = email;
                  if(!se.ishideNameMail){
                    se.emailhddt = email;
                  }
                }
              })
              
              if(!se.hoten){
                se.storage.get('username').then(username => {
                  se.hoten = username;
                 });
              }
              setTimeout(()=>{
                se.setAdultProperty();
              },200)
             
              se.storage.get('auth_token').then(auth_token => {
                se.loginuser = auth_token;
                if(auth_token){
                  se.GetUserInfo(auth_token);
                }
              
              });
            })
        }

        goback(){
          this._flightService.itemFlightCache.isCathay = null;
            if(this.activeStep ==1){
                this.resetLuggage();
                if(this._flightService.itemFlightCache.isApiDirect){
                  this.navCtrl.navigateBack('/flightsearchresultinternational');
                }else{
                  this.navCtrl.navigateBack('/flightsearchresult');
                }
            }else{
              this._flightService.itemFlightCache.hotenstep2 = this.hoten;
                this._flightService.itemFlightCache.sodienthoaistep2 = this.sodienthoai;
                this.activeStep = 1;
            }
            
        }

        resetLuggage(){
          let data = this._flightService.itemFlightCache;
          if(data.adults && data.adults.length >0){
            data.adults.forEach(element => {
              element.itemLug = null;
              element.itemLugReturn = null;
            });
          }
          if(data.childs && data.childs.length >0){
            data.childs.forEach(elementc => {
              elementc.itemLug = null;
              elementc.itemLugReturn = null;
            });
          }
        }

        textchangehoten(item){

        }

        async showPriceDetail(){
            const modal: HTMLIonModalElement =
            await this.modalCtrl.create({
              component: FlightpricedetailPage,
            });
          modal.present();
        }

        checkValidInput() : Promise<any>{
          var se = this;
          return new Promise((resolve, reject) => {
            if(se.adults && se.adults.length >0){
              for (let index = 0; index < se.adults.length; index++) {
                  const elementAdult = se.adults[index];
                  elementAdult.errorName = false;
                  elementAdult.errorGender = false;
                  elementAdult.errorDateofbirth = false;
                  elementAdult.errorCountry = false;
                  elementAdult.errorPassport = false;
                  elementAdult.errorPassportCountry = false;
                  elementAdult.errorPassportExpireDate = false;
                  elementAdult.errorInfo = false;

                  elementAdult.textErrorGender = '';
                  elementAdult.textErrorName = '';
                  elementAdult.textErrorDateofbirth = '';
                  elementAdult.textErrorCountry = '';
                  elementAdult.textErrorPassport = '';
                  elementAdult.textErrorPassportCountry = '';
                  elementAdult.textErrorPassportExpireDate = '';
                  elementAdult.textErrorInfo= '';

                  if(!elementAdult.genderdisplay && !elementAdult.name){
                    elementAdult.errorInfo = !elementAdult.errorInfo;
                    elementAdult.textErrorInfo = "Vui lòng nhập thông tin Người lớn "+(index+1);
                    resolve(false);
                  }

                  if(!elementAdult.genderdisplay){
                      elementAdult.errorGender = !elementAdult.errorGender;
                      elementAdult.textErrorGender = "Vui lòng nhập danh xưng Người lớn "+(index+1);
                      resolve(false);
                  }
                  
                  else if(!elementAdult.name){
                      elementAdult.errorName = !elementAdult.errorName;
                      resolve(false);
                  }
                  
                  else if(elementAdult.name){
                    elementAdult.errorName = !elementAdult.errorName;

                   if(se.isExtenal && se.showLotusPoint){
                      if(!elementAdult.dateofbirth){
                        elementAdult.errorDateofbirth = true;
                        elementAdult.textErrorDateofbirth = "Vui lòng nhập ngày sinh Người lớn "+(elementAdult.id);
                        resolve(false);
                      }
                      else if(elementAdult.dateofbirth){
                        let diffdate = moment(new Date()).diff(moment(elementAdult.dateofbirth).format('YYYY-MM-DD'), 'months');
                        if(diffdate < 144){
                          elementAdult.errorDateofbirth = true;
                          elementAdult.textErrorDateofbirth = "Vui lòng nhập ngày sinh Người lớn "+(elementAdult.id)+" trên 12 tuổi";
                          resolve(false);
                        }
                        
                        else if(!elementAdult.country){
                          elementAdult.errorCountry = true;
                          elementAdult.textErrorCountry = "Vui lòng nhập quốc tịch Người lớn "+(elementAdult.id);
                          resolve(false);
                        }
                        else if(!elementAdult.passport){
                          elementAdult.errorPassport = true;
                          elementAdult.textErrorPassport = "Vui lòng nhập hộ chiếu Người lớn "+(elementAdult.id);
                          resolve(false);
                        }
                        else if(elementAdult.passport){
                          if(!se.validatePassport(elementAdult.passport)){
                            elementAdult.errorPassport = true;
                            elementAdult.textErrorPassport = "Vui lòng nhập hộ chiếu Người lớn không chứa ký tự đặc biệt";
                            resolve(false);
                          }
                          
                          else if(!elementAdult.passportCountry){
                            elementAdult.errorPassportCountry = true;
                            elementAdult.textErrorPassportCountry = "Vui lòng nhập quốc gia cấp Người lớn "+(elementAdult.id);
                            resolve(false);
                          }
                          else if(!elementAdult.passportExpireDate){
                            elementAdult.errorPassportExpireDate = true;
                            elementAdult.textErrorPassportExpireDate = "Vui lòng nhập ngày hết hạn Người lớn "+(elementAdult.id);
                            resolve(false);
                          }
                          else if(elementAdult.passportExpireDate){
                            let departdate = moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD');
                            let diffdate = moment(moment(elementAdult.passportExpireDate).format('YYYY-MM-DD')).diff(moment(departdate), 'days');
                            if(diffdate < 0){
                              elementAdult.errorPassportExpireDate = true;
                              elementAdult.textErrorPassportExpireDate = "Hộ chiếu Người lớn "+(elementAdult.id)+" đã hết hạn";
                              resolve(false);
                            }
                          }
                        }
                      }
                    }
                  }
              }
          }

          if(se.childs && se.childs.length >0){
              for (let index = 0; index < se.childs.length; index++) {
                  const elementChild = se.childs[index];
                  elementChild.errorName = false;
                  elementChild.errorGender = false;
                  elementChild.errorDateofbirth = false;
                  elementChild.errorCountry = false;
                  elementChild.errorPassport = false;
                  elementChild.errorPassportCountry = false;
                  elementChild.errorPassportExpireDate = false;
                  elementChild.errorInfo = false;

                  elementChild.textErrorGender = '';
                  elementChild.textErrorName = '';
                  elementChild.textErrorDateofbirth = '';
                  elementChild.textErrorCountry = '';
                  elementChild.textErrorPassport = '';
                  elementChild.textErrorPassportCountry = '';
                  elementChild.textErrorPassportExpireDate = '';
                  elementChild.textErrorInfo ='';

                  let departdate = moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD');

                  if(!elementChild.genderdisplay && !elementChild.name){
                    resolve(false);
                  }

                  if(!elementChild.isInfant){
                      if(!elementChild.genderdisplay){
                        resolve(false);
                      }
  
                      else if(!elementChild.name){
                        resolve(false);
                      }
                      else if(elementChild.name){
                      
                        if (!se.hasWhiteSpace(elementChild.name.trim()) || !se.validateNameNotContainNumber(elementChild.name.trim()) || !se.validateNameNotContainExceptionChar(elementChild.name.trim())) {
                          resolve(false);
                        }

                        if(!elementChild.dateofbirth){
                          resolve(false);
                        }
                        let departdatestring = moment(departdate).format('DD-MM-YYYY');
                        //Check độ tuổi trẻ em > 2
                        if(!elementChild.isInfant && moment(departdate).diff(moment(elementChild.dateofbirth).format('YYYY-MM-DD'), 'months') < 24){
                          resolve(false);
                        }
                        //Check độ tuổi trẻ em <12
                        if(!elementChild.isInfant && moment(departdate).diff(moment(elementChild.dateofbirth).format('YYYY-MM-DD'), 'months') >= 144){
                          resolve(false);
                        }
                        
                      }
                  }else{
                    let idx = elementChild.iddisplay;
                    let departdatestring = moment(departdate).format('DD-MM-YYYY');
                    if(!elementChild.genderdisplay){
                      resolve(false);
                    }

                    else if(!elementChild.name){
                        resolve(false);
                        return;
                    }
                    // else if(elementChild.name){
                    //   var checktext = se.hasWhiteSpace(elementChild.name.trim());
                    //   if (!checktext || !se.validateNameNotContainNumber(elementChild.name) || !se.validateNameNotContainExceptionChar(elementChild.name)) {
                    //     resolve(false);
                    //   }

                    // }
                    if(!elementChild.dateofbirth){
                      resolve(false);
                    }
                    //Check độ tuổi của em bé <14 ngày
                    if(elementChild.isInfant && moment(departdate).diff(moment(elementChild.dateofbirth).format('YYYY-MM-DD'), 'days') < 14){
                      resolve(false);
                    }
                    //Check độ tuổi của em bé <2
                    if(elementChild.isInfant && moment(departdate).diff(moment(elementChild.dateofbirth).format('YYYY-MM-DD'), 'months') >= 24){
                      resolve(false);
                    }
                  }
                  
                  if(se.isExtenal && se.showLotusPoint){
                    if(!elementChild.dateofbirth){
                      resolve(false);
                    }
                    else if(!elementChild.country){
                      resolve(false);
                    }
                    else if(!elementChild.passport){
                      resolve(false);
                    }
                    else if(elementChild.passport){
                      if(!se.validatePassport(elementChild.passport)){
                        resolve(false);
                      }
                      else if(!elementChild.passportCountry){
                        resolve(false);
                      }
                      else if(!elementChild.passportExpireDate){
                        resolve(false);
                      }
                      else if(elementChild.passportExpireDate){
                        let diffdate = moment(elementChild.passportExpireDate).diff(moment(departdate), 'days');
                        if(diffdate < 0){
                          resolve(false);
                        }
                      }
                    }
                }
              }
          }
          resolve(true);
          })
        }

        confirm(){
            var se = this;
            se.checkchangeemail=false;
            se.hasinput = false;
            if(se.activeStep == 2){
                if(se.adults && se.adults.length >0){
                    for (let index = 0; index < se.adults.length; index++) {
                        const elementAdult = se.adults[index];
                        elementAdult.errorName = false;
                        elementAdult.errorGender = false;
                        elementAdult.errorDateofbirth = false;
                        elementAdult.errorCountry = false;
                        elementAdult.errorPassport = false;
                        elementAdult.errorPassportCountry = false;
                        elementAdult.errorPassportExpireDate = false;
                        elementAdult.errorInfo = false;

                        elementAdult.textErrorGender = '';
                        elementAdult.textErrorName = '';
                        elementAdult.textErrorDateofbirth = '';
                        elementAdult.textErrorCountry = '';
                        elementAdult.textErrorPassport = '';
                        elementAdult.textErrorPassportCountry = '';
                        elementAdult.textErrorPassportExpireDate = '';
                        elementAdult.textErrorInfo= '';

                        if(!elementAdult.genderdisplay && !elementAdult.name){
                          elementAdult.errorInfo = !elementAdult.errorInfo;
                          elementAdult.textErrorInfo = "Vui lòng nhập thông tin Người lớn "+(index+1);
                          se.gf.showToastWarning("Vui lòng nhập thông tin Người lớn "+(index+1));
                          return;
                        }

                        if(!elementAdult.genderdisplay){
                            elementAdult.errorGender = !elementAdult.errorGender;
                            elementAdult.textErrorGender = "Vui lòng nhập danh xưng Người lớn "+(index+1);
                            se.gf.showToastWarning("Vui lòng nhập danh xưng Người lớn "+(index+1));
                            return;
                        }
                        
                        else if(!elementAdult.name){
                            elementAdult.errorName = !elementAdult.errorName;
                           // elementAdult.textErrorName = "Vui lòng nhập họ tên Người lớn "+(index+1);
                           se.gf.showToastWarning("Vui lòng nhập họ tên Người lớn "+(index+1));
                            return;
                        }
                        
                        else if(elementAdult.name){
                          elementAdult.errorName = false;
                          if(se.isExtenal && se.showLotusPoint){
                            if(!elementAdult.dateofbirth){
                              elementAdult.errorDateofbirth = true;
                              elementAdult.textErrorDateofbirth = "Vui lòng nhập ngày sinh Người lớn "+(elementAdult.id);
                              se.gf.showToastWarning("Vui lòng nhập ngày sinh Người lớn "+(elementAdult.id));
                              return;
                            }
                            else if(elementAdult.dateofbirth){
                              let diffdate = moment(new Date()).diff(moment(elementAdult.dateofbirth).format('YYYY-MM-DD'), 'months');
                              if(diffdate < 144){
                                elementAdult.errorDateofbirth = true;
                                elementAdult.textErrorDateofbirth = "Vui lòng nhập ngày sinh Người lớn "+(elementAdult.id)+" trên 12 tuổi";
                                se.gf.showToastWarning("Vui lòng nhập ngày sinh Người lớn "+(elementAdult.id)+" trên 12 tuổi");
                                return;
                              }
                              
                              else if(!elementAdult.country){
                                elementAdult.errorCountry = true;
                                elementAdult.textErrorCountry = "Vui lòng nhập quốc tịch Người lớn "+(elementAdult.id);
                                se.gf.showToastWarning("Vui lòng nhập quốc tịch Người lớn "+(elementAdult.id));
                                return;
                              }
                              else if(!elementAdult.passport){
                                elementAdult.errorPassport = true;
                                elementAdult.textErrorPassport = "Vui lòng nhập hộ chiếu Người lớn "+(elementAdult.id);
                                se.gf.showToastWarning("Vui lòng nhập hộ chiếu Người lớn "+(elementAdult.id));
                                return;
                              }
                              else if(elementAdult.passport){
                                if(!se.validatePassport(elementAdult.passport)){
                                  elementAdult.errorPassport = true;
                                  elementAdult.textErrorPassport = "Vui lòng nhập hộ chiếu Người lớn không chứa ký tự đặc biệt";
                                  se.gf.showToastWarning("Vui lòng nhập hộ chiếu Người lớn không chứa ký tự đặc biệt");
                                  return;
                                }
                                
                                else if(!elementAdult.passportCountry){
                                  elementAdult.errorPassportCountry = true;
                                  elementAdult.textErrorPassportCountry = "Vui lòng nhập quốc gia cấp Người lớn "+(elementAdult.id);
                                  se.gf.showToastWarning("Vui lòng nhập quốc gia cấp Người lớn "+(elementAdult.id));
                                  return;
                                }
                                else if(!elementAdult.passportExpireDate){
                                  elementAdult.errorPassportExpireDate = true;
                                  elementAdult.textErrorPassportExpireDate = "Vui lòng nhập ngày hết hạn Người lớn "+(elementAdult.id);
                                  se.gf.showToastWarning("Vui lòng nhập ngày hết hạn Người lớn "+(elementAdult.id));
                                  return;
                                }
                                else if(elementAdult.passportExpireDate){
                                  let departdate = moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD');
                                  let diffdate = moment(moment(elementAdult.passportExpireDate).format('YYYY-MM-DD')).diff(moment(departdate), 'days');
                                  if(diffdate < 0){
                                    elementAdult.errorPassportExpireDate = true;
                                    elementAdult.textErrorPassportExpireDate = "Hộ chiếu Người lớn "+(elementAdult.id)+" đã hết hạn";
                                    se.gf.showToastWarning("Hộ chiếu Người lớn "+(elementAdult.id)+" đã hết hạn");
                                    return;
                                  }
                                  
                                }
                              }
                            }
                          }
                          else if(se._flightService.itemFlightCache.priceCathay>0&&!se.isExtenal){
                            if(!elementAdult.dateofbirth){
                              elementAdult.errorDateofbirth = true;
                              elementAdult.textErrorDateofbirth = "Vui lòng nhập ngày sinh Người lớn "+(elementAdult.id);
                              se.gf.showToastWarning("Vui lòng nhập ngày sinh Người lớn "+(elementAdult.id));
                              return;
                            }
                            else{
                              let departdate = moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD');
                              let dateofbirth = moment(elementAdult.dateofbirth).format('YYYY-MM-DD');
                              let diffdate = moment(departdate).diff(dateofbirth, 'months');
                              if(diffdate < 144){
                                elementAdult.errorDateofbirth = true;
                                elementAdult.textErrorDateofbirth = "Vui lòng nhập ngày sinh Người lớn "+(elementAdult.id)+" trên 12 tuổi";
                                se.gf.showToastWarning("Vui lòng nhập ngày sinh Người lớn "+(elementAdult.id)+" trên 12 tuổi");
                                return;
                              }
                            }
                          }
                        }
                    }
                }
    
                if(se.childs && se.childs.length >0){
                    for (let index = 0; index < se.childs.length; index++) {
                        const elementChild = se.childs[index];
                        elementChild.errorName = false;
                        elementChild.errorGender = false;
                        elementChild.errorDateofbirth = false;
                        elementChild.errorCountry = false;
                        elementChild.errorPassport = false;
                        elementChild.errorPassportCountry = false;
                        elementChild.errorPassportExpireDate = false;
                        elementChild.errorInfo = false;

                        elementChild.textErrorGender = '';
                        elementChild.textErrorName = '';
                        elementChild.textErrorDateofbirth = '';
                        elementChild.textErrorCountry = '';
                        elementChild.textErrorPassport = '';
                        elementChild.textErrorPassportCountry = '';
                        elementChild.textErrorPassportExpireDate = '';
                        elementChild.textErrorInfo ='';

                        let departdate = se._flightService.itemFlightCache.roundTrip ? moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD') : moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');

                        if(!elementChild.genderdisplay && !elementChild.name){
                          elementChild.errorInfo = !elementChild.errorInfo;
                          elementChild.textErrorInfo = "Vui lòng nhập thông tin "+ (!elementChild.isInfant ? "Trẻ em" : "Em bé")+" "+(!elementChild.isInfant ? elementChild.id : elementChild.iddisplay);
                          se.gf.showToastWarning("Vui lòng nhập thông tin "+ (!elementChild.isInfant ? "Trẻ em" : "Em bé")+" "+(!elementChild.isInfant ? elementChild.id : elementChild.iddisplay));
                          return;
                        }

                        if(!elementChild.isInfant){
                            if(!elementChild.genderdisplay){
                              elementChild.errorGender = true;
                              elementChild.textErrorGender = "Vui lòng nhập danh xưng Trẻ em "+(elementChild.id);
                              se.gf.showToastWarning("Vui lòng nhập danh xưng Trẻ em "+(elementChild.id));
                              return;
                            }
        
                            else if(!elementChild.name){
                                elementChild.errorName = true;
                                elementChild.textErrorName = "Vui lòng nhập họ tên Trẻ em "+(elementChild.id);
                                se.gf.showToastWarning("Vui lòng nhập họ tên Trẻ em "+(elementChild.id));
                                return;
                            }
                            else if(elementChild.name){
                              elementChild.errorName = false;

                              if(!elementChild.dateofbirth){
                                elementChild.errorDateofbirth = true;
                                elementChild.textErrorDateofbirth = "Vui lòng nhập ngày sinh Trẻ em "+(elementChild.id);
                                se.gf.showToastWarning("Vui lòng nhập ngày sinh Trẻ em "+(elementChild.id));
                                return;
                              }
                              let departdatestring = moment(departdate).format('DD-MM-YYYY');
                              //Check độ tuổi trẻ em > 2
                              if(!elementChild.isInfant && moment(departdate).diff(moment(elementChild.dateofbirth).format('YYYY-MM-DD'), 'months') < 24){
                                elementChild.errorDateofbirth = true;
                                elementChild.textErrorDateofbirth = "Vui lòng nhập ngày sinh Trẻ em "+(elementChild.id) +" lớn hơn hoặc bằng 2 tuổi so với ngày về "+departdatestring;
                                se.gf.showToastWarning("Vui lòng nhập ngày sinh Trẻ em "+(elementChild.id) +" lớn hơn hoặc bằng 2 tuổi so với ngày về "+departdatestring);
                                  return;
                              }
                              //Check độ tuổi trẻ em <12
                              if(!elementChild.isInfant && moment(departdate).diff(moment(elementChild.dateofbirth).format('YYYY-MM-DD'), 'months') >= 144){
                                elementChild.errorDateofbirth = true;
                                elementChild.textErrorDateofbirth = "Vui lòng nhập ngày sinh Trẻ em "+(elementChild.id) +" không được lớn hơn 12 tuổi so với ngày về "+departdatestring;
                                se.gf.showToastWarning("Vui lòng nhập ngày sinh Trẻ em "+(elementChild.id) +" không được lớn hơn 12 tuổi so với ngày về "+departdatestring);
                                  return;
                              }
                              
                            }
                        }else{
                          let idx = elementChild.iddisplay;
                          let departdatestring = moment(departdate).format('DD-MM-YYYY');
                          if(!elementChild.genderdisplay){
                              elementChild.errorGender = true;
                              elementChild.textErrorGender = "Vui lòng nhập danh xưng Em bé "+idx;
                              se.gf.showToastWarning("Vui lòng nhập danh xưng Em bé "+idx);
                            return;
                          }
      
                          else if(!elementChild.name){
                                elementChild.errorName = true;
                                elementChild.textErrorName = "Vui lòng nhập họ tên Em bé "+idx;
                                se.gf.showToastWarning("Vui lòng nhập họ tên Em bé "+idx);
                              return;
                          }
                          else if(elementChild.name){
                            elementChild.errorName = false;
                           
                          }
                          if(!elementChild.dateofbirth){
                            elementChild.errorDateofbirth = true;
                            elementChild.textErrorDateofbirth = "Vui lòng nhập ngày sinh Em bé "+idx;
                            se.gf.showToastWarning("Vui lòng nhập ngày sinh Em bé "+idx);
                            return;
                          }
                          //Check độ tuổi của em bé <14 ngày
                          if(elementChild.isInfant && moment(departdate).diff(moment(elementChild.dateofbirth).format('YYYY-MM-DD'), 'days') < 14){
                              elementChild.errorDateofbirth = true;
                              elementChild.textErrorDateofbirth = "Vui lòng nhập ngày sinh Em bé "+ idx +" lớn hơn 14 ngày tuổi so với ngày về "+departdatestring;
                              se.gf.showToastWarning("Vui lòng nhập ngày sinh Em bé "+ idx +" lớn hơn 14 ngày tuổi so với ngày về "+departdatestring);
                              return;
                          }
                          //Check độ tuổi của em bé <2
                          if(elementChild.isInfant && moment(departdate).diff(moment(elementChild.dateofbirth).format('YYYY-MM-DD'), 'months') >= 24){
                              elementChild.errorDateofbirth = true;
                                elementChild.textErrorDateofbirth = "Vui lòng nhập ngày sinh Em bé "+ idx +" không được lớn hơn 2 tuổi so với ngày về "+departdatestring;
                                se.gf.showToastWarning("Vui lòng nhập ngày sinh Em bé "+ idx +" không được lớn hơn 2 tuổi so với ngày về "+departdatestring);
                              return;
                          }
                          
                          
                        }
                        
                        if(se.isExtenal && se.showLotusPoint){
                          if(!elementChild.dateofbirth){
                            elementChild.errorDateofbirth = true;
                            elementChild.textErrorDateofbirth = "Vui lòng nhập ngày sinh "+ (!elementChild.isInfant ? "Trẻ em " : "Em bé ")+(!elementChild.isInfant ?  elementChild.id : elementChild.iddisplay);
                            se.gf.showToastWarning("Vui lòng nhập ngày sinh "+ (!elementChild.isInfant ? "Trẻ em " : "Em bé ")+(!elementChild.isInfant ?  elementChild.id : elementChild.iddisplay));
                            return;
                          }
                          else if(!elementChild.country){
                            elementChild.errorCountry = true;
                            elementChild.textErrorCountry = "Vui lòng nhập quốc tịch "+ (!elementChild.isInfant ? "Trẻ em " : "Em bé ")+(!elementChild.isInfant ?  elementChild.id : elementChild.iddisplay);
                            se.gf.showToastWarning("Vui lòng nhập quốc tịch "+ (!elementChild.isInfant ? "Trẻ em " : "Em bé ")+(!elementChild.isInfant ?  elementChild.id : elementChild.iddisplay));
                            return;
                          }
                          else if(!elementChild.passport){
                            elementChild.errorPassport = true;
                            elementChild.textErrorPassport = "Vui lòng nhập hộ chiếu "+ (!elementChild.isInfant ? "Trẻ em " : "Em bé ")+(!elementChild.isInfant ?  elementChild.id : elementChild.iddisplay);
                            se.gf.showToastWarning("Vui lòng nhập hộ chiếu "+ (!elementChild.isInfant ? "Trẻ em " : "Em bé ")+(!elementChild.isInfant ?  elementChild.id : elementChild.iddisplay));
                            return;
                          }
                          else if(elementChild.passport){
                            if(!se.validatePassport(elementChild.passport)){
                              elementChild.errorPassport = true;
                              elementChild.textErrorPassport = "Vui lòng nhập hộ chiếu "+ (!elementChild.isInfant ? "Trẻ em " : "Em bé ")+(!elementChild.isInfant ?  elementChild.id : elementChild.iddisplay) + " không chứa ký tự đặc biệt";
                              se.gf.showToastWarning("Vui lòng nhập hộ chiếu "+ (!elementChild.isInfant ? "Trẻ em " : "Em bé ")+(!elementChild.isInfant ?  elementChild.id : elementChild.iddisplay) + " không chứa ký tự đặc biệt");
                              return;
                            }
                            else if(!elementChild.passportCountry){
                              elementChild.errorPassportCountry = true;
                              elementChild.textErrorPassportCountry = "Vui lòng nhập quốc gia cấp "+ (!elementChild.isInfant ? "Trẻ em " : "Em bé ")+(!elementChild.isInfant ?  elementChild.id : elementChild.iddisplay);
                              se.gf.showToastWarning("Vui lòng nhập quốc gia cấp "+ (!elementChild.isInfant ? "Trẻ em " : "Em bé ")+(!elementChild.isInfant ?  elementChild.id : elementChild.iddisplay));
                              return;
                            }
                            else if(!elementChild.passportExpireDate){
                              elementChild.errorPassportExpireDate = true;
                              elementChild.textErrorPassportExpireDate = "Vui lòng nhập ngày hết hạn "+ (!elementChild.isInfant ? "Trẻ em " : "Em bé ")+(!elementChild.isInfant ?  elementChild.id : elementChild.iddisplay);
                              se.gf.showToastWarning("Vui lòng nhập ngày hết hạn "+ (!elementChild.isInfant ? "Trẻ em " : "Em bé ")+(!elementChild.isInfant ?  elementChild.id : elementChild.iddisplay));
                              return;
                            }
                            else if(elementChild.passportExpireDate){
                              let diffdate = moment(elementChild.passportExpireDate).diff(moment(departdate), 'days');
                              if(diffdate < 0){
                                elementChild.errorPassportExpireDate = true;
                                elementChild.textErrorPassportExpireDate = "Hộ chiếu "+ (!elementChild.isInfant ? "Trẻ em " : "Em bé ")+(!elementChild.isInfant ?  elementChild.id : elementChild.iddisplay) + " đã hết hạn";
                                se.gf.showToastWarning("Hộ chiếu "+ (!elementChild.isInfant ? "Trẻ em " : "Em bé ")+(!elementChild.isInfant ?  elementChild.id : elementChild.iddisplay) + " đã hết hạn");
                                return;
                              }
                              
                            }
                          }
                      }
                    }
                }
                //check tên nhập trùng
                let itempax = [...se.adults]
                if(se.childs && se.childs.length >0){
                  itempax = [...itempax, ...se.childs];
                }

                if(se._flightService.itemFlightCache.backtochoiceseat){
                  se.showAlertChoiceSeat();
                }else{
                  se.gotopayment();
                  // se.checkDuplicateItem(itempax).then((itemcheck) => {
                  //   if(itemcheck && itemcheck.length >0){
                  //     se._flightService.itemFlightCache.duplicateItem = itemcheck;
                  //     //show cảnh báo trùng
                  //     se.showAlertDuplicateName();
                  //     return;
                  //   }
                  //   else{
                  //     se.gotopayment();
                  //   }
                  // })
                }
            }else{
              se.emailinvalid = false;
              se.hoteninvalid = false;
              se.sodienthoaiinvalid = false;
              se.hasinput= true;
                if(!se.hoten){
                    return;
                }

                if(!se.sodienthoai){
                    return;
                }
                else if(se.sodienthoai && se.gf.checkPhoneInValidFormat(se.sodienthoai)){
                  se.sodienthoaiinvalid = true;
                  return;
                }

                if(!se.contactOption){
                  se.gf.showToastWarning('Chưa chọn kênh liên lạc và nhận vé. Vui lòng kiểm tra lại');
                  return;
                }

                if(se.contactOption && se.contactOption == "mail"){
                  if(!se.email){
                      return;
                  }
                  else if(se.email && (!se.validateEmail(se.email) || !se.gf.checkUnicodeCharactor(se.email) || se.gf.checkEmailInvalidFormat(se.email)) ){
                      se.emailinvalid = true;
                      return;
                  }
                }

                if (se.ischeck) {
                  if (se.companyname && se.address && se.tax) {
                    se.Invoice = true;
                    if (!se.ishideNameMail ) {
                      if (se.emailhddt && se.hotenhddt) {
                        if(!se.validateEmail(se.emailhddt) || !se.gf.checkUnicodeCharactor(se.emailhddt)){
                          se.gf.showToastWarning('email xuất hóa đơn không hợp lệ. Vui lòng kiểm tra lại');
                          return;
                        }
                        else{
                          se.addressorder = se.emailhddt;
                        }
                      }
                      else{
                        se.gf.showAlertMessageOnly("Xin vui lòng nhập đầy đủ thông tin xuất hóa đơn");
                        return;
                      }
                    } 
                    else{
                      se.hotenhddt = se.hoten;
                      se.addressorder = se.email;
                    }
                    se._flightService.itemFlightCache.Invoice = true;
                    se.storage.set("InvoiceFlight", true);
                    var order1 = { companyname: this.companyname, address: this.address, tax: this.tax, addressorder: this.addressorder,ishideNameMail: this.ishideNameMail,hotenhddt:this.hotenhddt,emailhddt:this.emailhddt }
                    se.storage.set("orderflight", order1);
                  }
                  else {
                    se.gf.showToastWarning("Xin vui lòng nhập đầy đủ thông tin xuất hóa đơn");
                    return false;
                  }
                }
                else {
                  se.Invoice = false;
                  se._flightService.itemFlightCache.Invoice = false;
                  se.storage.set("InvoiceFlight", false);
                  se.companyname = "";
                  se.address = "";
                  se.tax = "";
                }
                
                 if (se.email) {
                  var checkappleemail=(se.email.includes("appleid") || se.email.includes('vivumember.info'));
                  if (checkappleemail) {
                    se.checkchangeemail=true;
                    se.showConfirmEmail();
                  }
                }
                se.storage.set('email', se.email);
                se.storage.set('contactOption', se.contactOption);

                  se._flightService.itemFlightCache.phone = se.sodienthoai;
                  se._flightService.itemFlightCache.email = se.email;
                  se._flightService.itemFlightCache.hoten = se.hoten;
                if (se.ischeck) {
                  se._flightService.itemFlightCache.companyname = se.companyname;
                  se._flightService.itemFlightCache.address = se.address;
                  se._flightService.itemFlightCache.tax = se.tax;
                }

                if(!se.ishideNameMail|| se.contactOption=='zalo'){
                  se._flightService.itemFlightCache.hotenhddt = se.hotenhddt;
                  se._flightService.itemFlightCache.emailhddt = se.emailhddt;
                }
                if(se._flightService.itemFlightCache.backtochoiceseat){
                    se.showAlertChoiceSeat();
                }else{
                  if (!se.checkchangeemail) {
                    //se.gotopaymentpage();
                    se.gonextstep();
                  }
                }
            }
        }

        gonextstep(){
          var se = this;
          se.inputtext = false;
          se.activeStep = 2;
          setTimeout(()=>{
            if(se.adults && se.adults.length >0){
              for (let index = 0; index < se.adults.length; index++) {
                let elementcache = se.adults[index];
                if(elementcache.expanddivairlinemember){
                  var divCollapse:any = $(`.div-expand-airlinemember-${index}.div-collapse`);
                  if(divCollapse && divCollapse.length >0){
                    divCollapse.removeClass('div-collapse').addClass('div-expand');
                  }
                  ($('.div-checkbox ion-checkbox')[index]as any).checked = true;
                  this.scrollToTopGroupReview(1,index);
                }
              }
            }
          },50)
                            
        }

        async confirmBeforeGoToPaymentPage(){
          var se = this;
          
          let alert = await this.modalCtrl.create({
            component: flightConfirmBookingDetailPage,
            cssClass: "cls-modal-confirmbookingdetail",
            animated: true,
          });
          alert.present();
          const event: any = await alert.onDidDismiss();
          const date = event.data;
          if (event.data) {
            se.gotopaymentpage();
          }
        }

        checkInputUserInfo(type){
          var se = this;
          se.hasinput = true;
          if(type ==1){
            if(!se.hoten ){
              se.hoteninvalid = true;
            }
          }

          if(type == 2){
            if(se.gf.checkPhoneInValidFormat(se.sodienthoai)){
              se.sodienthoaiinvalid = true; 
            }else{
              se.sodienthoaiinvalid = false; 
            }
          }
          if(type == 3){
            let strcheck = se.email;
            if(se.email.indexOf('@') != -1){
              strcheck = se.email.split('@')[1];
            }
            
              if(se.gf.checkEmailInvalidFormat(strcheck) || !se.validateEmail(se.email) || !se.gf.checkUnicodeCharactor(se.email) ){
                  se.emailinvalid = true; 
              }else{
                se.emailinvalid = false; 
              }
          }
        }
        /**
         * @param inputcheck đối tượng check
         * @param type: 1 - giới tính; 2 - name;
         * @param isadult: true - là người lớn
         */
        checkInput(inputcheck, type, isadult, event?){
          var se = this;
          if(isadult){
              if(type == 1){
                if(!inputcheck.genderdisplay && !inputcheck.name){
                  inputcheck.errorInfo = true;
                  inputcheck.textErrorInfo = "Vui lòng nhập thông tin Người lớn "+(inputcheck.id);
                  return;
                }else{
                  inputcheck.errorInfo = false;
                  inputcheck.textErrorInfo = "";
                }

                if(!inputcheck.genderdisplay){
                  inputcheck.errorGender = true;
                  inputcheck.textErrorGender = "Vui lòng nhập danh xưng Người lớn "+(inputcheck.id);
                  return;
                }else{
                  
                  inputcheck.errorGender = false;
                  inputcheck.textErrorGender = "";

                  inputcheck.errorInfo = false;
                  inputcheck.textErrorInfo ="";
                }
              }

              if(type == 2){
                if(!inputcheck.name){
                  inputcheck.errorName = true;
                  return;
                }
                
                else if(inputcheck.name){
                  inputcheck.errorName = false;
                }
              }
             

              if(se.isExtenal && se.showLotusPoint){
                
                if(type == 3){
                  if(!inputcheck.dateofbirth){
                    inputcheck.errorDateofbirth = true;
                    inputcheck.textErrorDateofbirth = "Vui lòng nhập ngày sinh Người lớn "+(inputcheck.id);
                    return;
                  }
                  else{
                    inputcheck.errorDateofbirth = false;
                    inputcheck.textErrorDateofbirth = "";
                  }
                  if(inputcheck.dateofbirth){
                    inputcheck.birdayDisplay = moment(inputcheck.dateofbirth).format('DD/MM/YYYY');
                    let diffdate = moment(new Date()).diff(moment(inputcheck.dateofbirth).format('YYYY-MM-DD'), 'months');
                    if(diffdate < 144){
                      inputcheck.errorDateofbirth = true;
                      inputcheck.textErrorDateofbirth = "Vui lòng nhập ngày sinh Người lớn "+(inputcheck.id)+" trên 12 tuổi";
                      return;
                    }
                  }
                }
                if(type == 4){
                  if(!inputcheck.countryName){
                    inputcheck.errorCountry = true;
                    inputcheck.showSelectCountry = false;
                    inputcheck.textErrorCountry = "Vui lòng nhập quốc tịch Người lớn "+(inputcheck.id);
                    return;
                    }
                    else{
                      inputcheck.errorCountry = false;
                      inputcheck.textErrorCountry = "";
                    }
                }
  
                if(type == 5){
                  if(!inputcheck.passport){
                    inputcheck.errorPassport = true;
                    inputcheck.textErrorPassport = "Vui lòng nhập hộ chiếu Người lớn "+(inputcheck.id);
                    return;
                  }
                  else{
                    if(!se.validatePassport(inputcheck.passport)){
                      inputcheck.errorPassport = true;
                      inputcheck.textErrorPassport = "Vui lòng nhập hộ chiếu Người lớn không chứa ký tự đặc biệt";
                      return;
                    }
                    else{
                      inputcheck.errorPassport = false;
                      inputcheck.textErrorPassport = "";
                    }
                 
                  }
                }
  
                if(type == 6){
                  if(!inputcheck.passportCountryName){
                    inputcheck.errorPassportCountry = true;
                    inputcheck.showSelectPassportCountry = false;
                    inputcheck.textErrorPassportCountry = "Vui lòng nhập quốc gia cấp Người lớn "+(inputcheck.id);
                    return;
                  }
                  else{
                    inputcheck.errorPassportCountry = false;
                    inputcheck.textErrorPassportCountry = "";
                  }
                }
  
                if(type == 7){
                  if(!inputcheck.passportExpireDate){
                      inputcheck.errorPassportExpireDate = true;
                      inputcheck.textErrorPassportExpireDate = "Vui lòng nhập ngày hết hạn Người lớn "+(inputcheck.id);
                      return;
                  }
                  else{
                    inputcheck.passportExpireDateDisplay = moment(inputcheck.passportExpireDate).format('DD/MM/YYYY');
                    let departdate = moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD');
                    let diffdate = moment(moment(inputcheck.passportExpireDate).format('YYYY-MM-DD')).diff(moment(departdate), 'days');
                    if(diffdate < 0){
                      inputcheck.errorPassportExpireDate = true;
                      inputcheck.textErrorPassportExpireDate = "Hộ chiếu Người lớn "+(inputcheck.id)+" đã hết hạn";
                      return;
                    }
                    else{
                      inputcheck.errorPassportExpireDate = false;
                      inputcheck.textErrorPassportExpireDate = "";
                    }
                  }
                }
              }
          }
          else{
            if(type == 1){
              if(!inputcheck.genderdisplay && !inputcheck.name){
                inputcheck.errorInfo = !inputcheck.errorInfo;
                inputcheck.textErrorInfo = "Vui lòng nhập thông tin "+ (!inputcheck.isInfant ? "Trẻ em" : "Em bé") +" "+(!inputcheck.isInfant ? inputcheck.id : inputcheck.iddisplay);
                return;
              }
              else{
                inputcheck.errorInfo = false;
                inputcheck.textErrorInfo = "";
              }

              if(!inputcheck.genderdisplay){
                inputcheck.errorGender = !inputcheck.errorGender;
                inputcheck.textErrorGender = "Vui lòng nhập danh xưng "+ (!inputcheck.isInfant ? "Trẻ em" : "Em bé") +" "+(!inputcheck.isInfant ? inputcheck.id : inputcheck.iddisplay);
                return;
              }else{
                inputcheck.errorGender = false;
                inputcheck.textErrorGender = "";
              }
            }

            if(type == 2){
              if(!inputcheck.name){
                inputcheck.errorName = true;
                return;
              }
              
              else if(inputcheck.name){
                inputcheck.errorName = false;
              }
            }

            if(type == 3){
              if(!inputcheck.dateofbirth){
                inputcheck.errorDateofbirth = true;
                inputcheck.textErrorDateofbirth = "Vui lòng nhập ngày sinh "+ (!inputcheck.isInfant ? "Trẻ em" : "Em bé") +" "+ (!inputcheck.isInfant ? inputcheck.id : inputcheck.iddisplay);
                return;
              }
              else{
                inputcheck.errorDateofbirth = false;
                inputcheck.textErrorDateofbirth = "";
              }

              if(inputcheck.dateofbirth){
                inputcheck.birdayDisplay = moment(inputcheck.dateofbirth).format('DD/MM/YYYY');
                let departdate = se._flightService.itemFlightCache.roundTrip ? moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD') : moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');
                let departdatestring = moment(departdate).format('DD-MM-YYYY');
                            //Check độ tuổi trẻ em > 2
                            if(!inputcheck.isInfant && moment(departdate).diff(moment(inputcheck.dateofbirth).format('YYYY-MM-DD'), 'months') < 24){
                              inputcheck.errorDateofbirth = !inputcheck.errorDateofbirth;
                              inputcheck.textErrorDateofbirth = "Vui lòng nhập ngày sinh Trẻ em "+(!inputcheck.isInfant ? inputcheck.id : inputcheck.iddisplay) +" lớn hơn hoặc bằng 2 tuổi so với ngày về "+departdatestring;
                                return;
                            }else{
                              inputcheck.errorDateofbirth = false;
                              inputcheck.textErrorDateofbirth = "";
                            }
                            //Check độ tuổi trẻ em <12
                            if(!inputcheck.isInfant && moment(departdate).diff(moment(inputcheck.dateofbirth).format('YYYY-MM-DD'), 'months') >= 144){
                              inputcheck.errorDateofbirth = !inputcheck.errorDateofbirth;
                              inputcheck.textErrorDateofbirth = "Vui lòng nhập ngày sinh Trẻ em "+(!inputcheck.isInfant ? inputcheck.id : inputcheck.iddisplay) +" không được lớn hơn 12 tuổi so với ngày về "+departdatestring;
                                return;
                            }
                            else{
                              inputcheck.errorDateofbirth = false;
                              inputcheck.textErrorDateofbirth = "";
                            }

                            //Check độ tuổi của em bé <14 ngày
                            if(inputcheck.isInfant && moment(departdate).diff(moment(inputcheck.dateofbirth).format('YYYY-MM-DD'), 'days') < 14){
                                inputcheck.errorDateofbirth = !inputcheck.errorDateofbirth;
                                inputcheck.textErrorDateofbirth = "Vui lòng nhập ngày sinh Em bé "+ (!inputcheck.isInfant ? inputcheck.id : inputcheck.iddisplay) +" lớn hơn 14 ngày tuổi so với ngày về "+departdatestring;
                                return;
                            }
                            else{
                              inputcheck.errorDateofbirth = false;
                              inputcheck.textErrorDateofbirth = "";
                            }
                            //Check độ tuổi của em bé <2
                            if(inputcheck.isInfant && moment(departdate).diff(moment(inputcheck.dateofbirth).format('YYYY-MM-DD'), 'months') >= 24){
                                inputcheck.errorDateofbirth = !inputcheck.errorDateofbirth;
                                  inputcheck.textErrorDateofbirth = "Vui lòng nhập ngày sinh Em bé "+ (!inputcheck.isInfant ? inputcheck.id : inputcheck.iddisplay) +" không được lớn hơn 2 tuổi so với ngày về "+departdatestring;
                                return;
                            }
                            else{
                              inputcheck.errorDateofbirth = false;
                              inputcheck.textErrorDateofbirth = "";
                            }
              }
            }

            if(se.isExtenal && se.showLotusPoint){
              if(type == 3){
                if(!inputcheck.dateofbirth){
                  inputcheck.errorDateofbirth = true;
                  inputcheck.textErrorDateofbirth = "Vui lòng nhập ngày sinh "+ (!inputcheck.isInfant ? "Trẻ em" : "Em bé") +" "+ (!inputcheck.isInfant ? inputcheck.id : inputcheck.iddisplay);
                  return;
                }
                else{
                  inputcheck.errorDateofbirth = false;
                  inputcheck.textErrorDateofbirth = "";
                }

                if(inputcheck.dateofbirth){
                  inputcheck.birdayDisplay = moment(inputcheck.dateofbirth).format('DD/MM/YYYY');
                  let departdate = se._flightService.itemFlightCache.roundTrip ? moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD') : moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');
                  let departdatestring = moment(departdate).format('DD-MM-YYYY');
                              //Check độ tuổi trẻ em > 2
                              if(!inputcheck.isInfant && moment(departdate).diff(moment(inputcheck.dateofbirth).format('YYYY-MM-DD'), 'months') < 24){
                                inputcheck.errorDateofbirth = !inputcheck.errorDateofbirth;
                                inputcheck.textErrorDateofbirth = "Vui lòng nhập ngày sinh Trẻ em "+(!inputcheck.isInfant ? inputcheck.id : inputcheck.iddisplay) +" lớn hơn hoặc bằng 2 tuổi so với ngày về "+departdatestring;
                                  return;
                              }else{
                                inputcheck.errorDateofbirth = false;
                                inputcheck.textErrorDateofbirth = "";
                              }
                              //Check độ tuổi trẻ em <12
                              if(!inputcheck.isInfant && moment(departdate).diff(moment(inputcheck.dateofbirth).format('YYYY-MM-DD'), 'months') >= 144){
                                inputcheck.errorDateofbirth = !inputcheck.errorDateofbirth;
                                inputcheck.textErrorDateofbirth = "Vui lòng nhập ngày sinh Trẻ em "+(!inputcheck.isInfant ? inputcheck.id : inputcheck.iddisplay) +" không được lớn hơn 12 tuổi so với ngày về "+departdatestring;
                                  return;
                              }
                              else{
                                inputcheck.errorDateofbirth = false;
                                inputcheck.textErrorDateofbirth = "";
                              }

                              //Check độ tuổi của em bé <14 ngày
                              if(inputcheck.isInfant && moment(departdate).diff(moment(inputcheck.dateofbirth).format('YYYY-MM-DD'), 'days') < 14){
                                  inputcheck.errorDateofbirth = !inputcheck.errorDateofbirth;
                                  inputcheck.textErrorDateofbirth = "Vui lòng nhập ngày sinh Em bé "+ (!inputcheck.isInfant ? inputcheck.id : inputcheck.iddisplay) +" lớn hơn 14 ngày tuổi so với ngày về "+departdatestring;
                                  return;
                              }
                              else{
                                inputcheck.errorDateofbirth = false;
                                inputcheck.textErrorDateofbirth = "";
                              }
                              //Check độ tuổi của em bé <2
                              if(inputcheck.isInfant && moment(departdate).diff(moment(inputcheck.dateofbirth).format('YYYY-MM-DD'), 'months') >= 24){
                                  inputcheck.errorDateofbirth = !inputcheck.errorDateofbirth;
                                    inputcheck.textErrorDateofbirth = "Vui lòng nhập ngày sinh Em bé "+ (!inputcheck.isInfant ? inputcheck.id : inputcheck.iddisplay) +" không được lớn hơn 2 tuổi so với ngày về "+departdatestring;
                                  return;
                              }
                              else{
                                inputcheck.errorDateofbirth = false;
                                inputcheck.textErrorDateofbirth = "";
                              }
                }
              }

              if(type == 4){
                if(!inputcheck.countryName){
                  inputcheck.errorCountry = true;
                  inputcheck.showSelectCountry = false;
                  inputcheck.textErrorCountry = "Vui lòng nhập quốc tịch "+ (!inputcheck.isInfant ? "Trẻ em" : "Em bé") +" "+ (!inputcheck.isInfant ? inputcheck.id : inputcheck.iddisplay);
                  return;
                  }
                  else{
                    inputcheck.errorCountry = false;
                    inputcheck.textErrorCountry = "";
                  }
              }

              if(type == 5){
                if(!inputcheck.passport){
                  inputcheck.errorPassport = true;
                  inputcheck.textErrorPassport = "Vui lòng nhập hộ chiếu "+ (!inputcheck.isInfant ? "Trẻ em" : "Em bé") +" "+ (!inputcheck.isInfant ? inputcheck.id : inputcheck.iddisplay);
                  return;
                }
                else{
                  if(!se.validatePassport(inputcheck.passport)){
                    inputcheck.errorPassport = true;
                    inputcheck.textErrorPassport = "Vui lòng nhập hộ chiếu "+ (!inputcheck.isInfant ? "Trẻ em" : "Em bé") +" không chứa ký tự đặc biệt";
                    return;
                  }
                  else{
                    inputcheck.errorPassport = false;
                    inputcheck.textErrorPassport = "";
                  }
                }
              }

              if(type == 6){
                if(!inputcheck.passportCountryName){
                  inputcheck.errorPassportCountry = true;
                  inputcheck.showSelectPassportCountry = false;
                  inputcheck.textErrorPassportCountry = "Vui lòng nhập quốc gia cấp "+ (!inputcheck.isInfant ? "Trẻ em" : "Em bé") +" "+ (!inputcheck.isInfant ? inputcheck.id : inputcheck.iddisplay);
                  return;
                }
                else{
                  inputcheck.errorPassportCountry = false;
                  inputcheck.textErrorPassportCountry = "";
                }
              }

              if(type == 7){
                if(!inputcheck.passportExpireDate){
                    inputcheck.errorPassportExpireDate = true;
                    inputcheck.textErrorPassportExpireDate = "Vui lòng nhập ngày hết hạn "+ (!inputcheck.isInfant ? "Trẻ em" : "Em bé") +" "+ (!inputcheck.isInfant ? inputcheck.id : inputcheck.iddisplay);
                    return;
                }
                else{
                  inputcheck.passportExpireDateDisplay = moment(inputcheck.passportExpireDate).format('DD/MM/YYYY');
                  let departdate = se._flightService.itemFlightCache.roundTrip ? moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD') : moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD');
                  let diffdate = moment(moment(inputcheck.passportExpireDate).format('YYYY-MM-DD')).diff(moment(departdate), 'days');
                  if(diffdate < 0){
                    inputcheck.errorPassportExpireDate = true;
                    inputcheck.textErrorPassportExpireDate = "Hộ chiếu "+ (!inputcheck.isInfant ? "Trẻ em" : "Em bé") +" "+ (!inputcheck.isInfant ? inputcheck.id : inputcheck.iddisplay)+" đã hết hạn";
                    return;
                  }
                  else{
                    inputcheck.errorPassportExpireDate = false;
                    inputcheck.textErrorPassportExpireDate = "";
                  }
                }
              }

            }
          }
           
        }


  gotopayment(){
  var se = this;
  se.activeStep = 2;
    se.inputtext = false;
                    if(!se.loginuser){
                      let ad = se.adults[0];
                      se.hoten = ad.name;
                    }
                    se.storage.get('paxdetailInfo').then((data) =>{
                      if(data){
                        se.storage.remove('paxdetailInfo').then(()=>{
                          se.storage.set('paxdetailInfo', { adults: se.adults, childs: se.childs });
                        })
                      }else{
                        se.storage.set('paxdetailInfo', { adults: se.adults, childs: se.childs });
                      }
                    })
    
                    //Lưu cache danh sách khách
                    se.storage.get('listpaxcache').then((data)=>{
                      if(data){
                        let datapax = [...data];
                        let arraycheck = [...this.adults,...this.childs];
                        for (let index = 0; index < arraycheck.length; index++) {
                          const elementpax = arraycheck[index];
                          let isexist = data.some(r => r.name == elementpax.name );
                          if(!isexist){
                            datapax.push(elementpax);
                          }
                        }
    
                        se.storage.remove('listpaxcache').then(()=>{
                          se.storage.set('listpaxcache', datapax);
                        })
                      }else{
                        let arraypax = [...this.adults,...this.childs];
                        se.storage.set('listpaxcache', arraypax);
                      }
                    })
                    se._flightService.itemFlightCache.adults = se.adults;
                    se._flightService.itemFlightCache.childs = se.childs;
          
                    se.gotopaymentpage();
}
  async showAlertDuplicateName(){
    var se = this;
    var arrdup = this._flightService.itemFlightCache.duplicateItem;
    let strmsg = '';
    arrdup.forEach(element => {
        for (let index = 0; index < element.list.length; index++) {
          const itemlist = element.list[index];
          if(index == 0){
            strmsg += 'Tên '+ (itemlist.isChild ? (!itemlist.isInfant ?  'Trẻ em ': 'Em bé '): 'Người lớn ')+(itemlist.isInfant ? itemlist.iddisplay : itemlist.id) + ' và ';
          }else{
            strmsg += (itemlist.isChild ? (!itemlist.isInfant ?  'Trẻ em ': 'Em bé '): 'Người lớn ')+ (itemlist.isInfant ? itemlist.iddisplay : itemlist.id)+  (index < element.list.length-1 ? ' và ' : '');
          }
        }
        strmsg += " <span class='cls-error'>" + element.list[0].name + '</span> trùng nhau.';
    });
    strmsg += ' Có khả năng quý khách đã nhập nhầm.</br>Nếu quý khách đã nhập đúng họ tên, vui lòng tiếp tục thanh toán.'
    let alert = await this.alertCtrl.create({
      header: 'Tên hành khách trùng nhau',
      message: strmsg,
      cssClass: "cls-alert-duplicatename",
      backdropDismiss: false,
      buttons: [
      {
        text: 'Thanh toán',
        role: 'OK',
        cssClass: 'button-payment',
        handler: () => {
          alert.dismiss();
          se.gotopayment();
        }
        
      },
      {
        text: 'Nhập lại họ tên',
        role: 'Cancel',
        cssClass: 'button-reinput',
        handler: () => {
          se._flightService.itemFlightCache.duplicateName = null;
          alert.dismiss();
        }
      }
    ]
  });
  alert.present();
  }

  async showAlertInvalidName(iteminvalid){
      var se = this;
      let strmsg = '';
      if(iteminvalid.length <2){
        let element = iteminvalid[0];
        strmsg = 'Tên '+ (element.isChild ? (!element.isInfant ?  'Trẻ em ': 'Em bé '): 'Người lớn ')+ (element.isInfant ? element.iddisplay : element.id) + " <span class='cls-error'>" + element.name + '</span> chỉ có 2 chữ. Có khả năng quý khách đã nhập thiếu tên đệm.</br>Nếu quý khách đã nhập đúng họ tên, vui lòng tiếp tục thanh toán.';
      }else{
        for (let index = 0; index < iteminvalid.length; index++) {
          const element = iteminvalid[index];
          strmsg += 'Tên '+ (element.isChild ? (!element.isInfant ?  'Trẻ em ': 'Em bé '): 'Người lớn ')+ (element.isInfant ? element.iddisplay : element.id) + " <span class='cls-error'>" + element.name + '</span>' + (index < iteminvalid.length -1 ? ', ' : ' ')
        }
        strmsg += " chỉ có 2 chữ. Có khả năng quý khách đã nhập thiếu tên đệm.</br>Nếu quý khách đã nhập đúng họ tên, vui lòng tiếp tục thanh toán."
      }
      let alert = await this.alertCtrl.create({
        header: 'Họ tên hành khách chỉ có 2 chữ',
        message: strmsg,
        cssClass: "cls-alert-duplicatename",
        backdropDismiss: false,
        buttons: [
        {
          text: 'Thanh toán',
          role: 'OK',
          cssClass: 'button-payment',
          handler: () => {
            alert.dismiss();
            se.gotopayment();
          }
          
        },
        {
          text: 'Nhập lại họ tên',
          role: 'Cancel',
          cssClass: 'button-reinput',
          handler: () => {
            se._flightService.itemFlightCache.duplicateName = null;
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  async showAlertInvalidFirstName(iteminvalid){
    var se = this;
    let strmsg = 'Tên '+ (iteminvalid.isChild ? (!iteminvalid.isInfant ?  'Trẻ em ': 'Em bé '): 'Người lớn ')+iteminvalid.id + " <span class='cls-error'>" + iteminvalid.name + '</span> chỉ có 2 chữ. Có khả năng quý khách đã nhập thiếu tên đệm.</br>Nếu quý khách đã nhập đúng họ tên, vui lòng tiếp tục thanh toán.'
    let alert = await this.alertCtrl.create({
      header: 'Họ tên hành khách chỉ có 2 chữ',
      message: strmsg,
      cssClass: "cls-alert-duplicatename",
      backdropDismiss: false,
      buttons: [
      {
        text: 'Thanh toán',
        role: 'OK',
        cssClass: 'button-payment',
        handler: () => {
          alert.dismiss();
          se.gotopayment();
        }
        
      },
      {
        text: 'Nhập lại họ tên',
        role: 'Cancel',
        cssClass: 'button-reinput',
        handler: () => {
          se._flightService.itemFlightCache.duplicateName = null;
          alert.dismiss();
        }
      }
    ]
  });
  alert.present();
}

async showAlertInvalidSubName(iteminvalid){
  var se = this;
  let strmsg = 'Họ của '+ (iteminvalid.isChild ? (!iteminvalid.isInfant ?  'Trẻ em ': 'Em bé '): 'Người lớn ')+(iteminvalid.isInfant ? iteminvalid.iddisplay : iteminvalid.id) + " <span class='cls-error'>" + iteminvalid.name + '</span> không nằm trong danh sách họ phổ biến. Có khả năng quý khách đã nhập sai.</br>Nếu quý khách đã nhập đúng họ tên, vui lòng tiếp tục thanh toán.';
  let alert = await this.alertCtrl.create({
    header: 'Họ không nằm trong danh sách họ phổ biến',
    message: strmsg,
    cssClass: "cls-alert-duplicatename",
    backdropDismiss: false,
    buttons: [
    {
      text: 'Thanh toán',
      role: 'OK',
      cssClass: 'button-payment',
      handler: () => {
        alert.dismiss();
        se.gotopayment();
      }
      
    },
    {
      text: 'Nhập lại họ tên',
      role: 'Cancel',
      cssClass: 'button-reinput',
      handler: () => {
        alert.dismiss();
      }
    }
  ]
});
alert.present();
}

    checkInValidSubNameBeforeNextStep(listpax) : Promise<any>{
      var se = this, res = false;
          return new Promise((resolve, reject) =>{
                listpax.filter((itempax) => {
                  let itemValueInvalid =  se.gf.getListSubName().filter((sn) => { return sn.value.indexOf(itempax.name.split(' ')[0].toLowerCase()) != -1});
                  let itemRawValueInvalid =  se.gf.getListSubName().filter((sn) => { return sn.rawValue.indexOf(itempax.name.split(' ')[0].toLowerCase()) != -1});
                  if(itemValueInvalid.length == 0 && itemRawValueInvalid.length ==0){
                      res = itempax;
                  }
                 }) 
             resolve(res);
          })
    }

        checkDuplicateItem(listpax): Promise<any>{
            var se = this, res = false;
            return new Promise((resolve, reject) =>{
              resolve(se.getArrayDuplicate(listpax));
            })
        }

        getArrayDuplicate(listpax): Promise<any>{
          let arrres:any = [];
            return new Promise((resolve, reject) => {
              for (let index = 0; index < listpax.length; index++) {
                const element = listpax[index];
                  let itemdup = listpax.filter((i, indexp) => i.name.trimEnd().trimStart().toLowerCase() == element.name.trimEnd().trimStart().toLowerCase() && i.indexp != index);
                  if(itemdup && itemdup.length >1){
                  let arrdup = listpax.filter((i) => i.name.trimEnd().trimStart().toLowerCase() == itemdup[0].name.trimEnd().trimStart().toLowerCase());
                  if(arrres.length == 0){
                    arrres.push({list: [...arrdup]});
                  }else {
                    let checkvalid = true;
                    for (let index = 0; index < arrres.length; index++) {
                      const element = arrres[index];
                      if(this.checkExistsItemInArray(element.list, arrdup[0])){
                        checkvalid = false;
                      }
                    }
                    if(checkvalid){
                      arrres.push({list: [...arrdup]});
                    }
                    
                  }
                }
              }
              resolve(arrres);
            })
        }

        checkExistsItemInArray(arrays: any, item: any) {
          var res = false;
          res = arrays.some(r => r.name == item.name);
          return res;
        }

        checkValidName(listpax): Promise<any>{
          var se = this, res = false, arrItem = [];
          return new Promise((resolve, reject) =>{
            for (let index = 0; index < listpax.length; index++) {
              const element = listpax[index];
              let iteminvalid = listpax.filter((item) => { return item.name.trimEnd().trimStart().split(' ').length < 3});
                 if(iteminvalid && iteminvalid.length >0){
                   resolve(iteminvalid);
                 }
              }

              resolve(res);
          })
        }

        checkValidSubName(subname): Promise<any>{
          var se = this, res = false;
          return new Promise((resolve, reject) =>{
            let iteminvalid = se.gf.getListSubName().filter((sn) => { return ((sn.value.indexOf( subname.split(' ')[0].toLowerCase() ) != -1) || (sn.rawValue.indexOf( subname.split(' ')[0].toLowerCase() ) != -1)) }) 
              if(iteminvalid && iteminvalid.length >0){
                  resolve(iteminvalid[0])
              }
            resolve(res);
          })
        }

        gotopaymentpage(){
          var se = this;
          se._flightService.itemFlightCache.backtochoiceseat = false;
          se.updatePassengerInfo().then((data)=>{
            if(!data.error){
                se.gf.hideLoading();
                se.navCtrl.navigateForward('/flightaddservice');
            }else{
              se.gf.showToastWarning(data.error);
              se.gf.hideLoading();
            }
          })

          
        }

        hasWhiteSpace(s) {
          return s.indexOf(' ') >= 0;
        } 

        validateNameNotContainNumber(name){
          var re = /^([^0-9]*)$/;
          return re.test(String(name).toLowerCase())
        }
        validateNameNotContainExceptionChar(name){
          let re = /^(?:[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0523\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0621-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971\u0972\u097B-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D3D\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC\u0EDD\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8B\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10D0-\u10FA\u10FC\u1100-\u1159\u115F-\u11A2\u11A8-\u11F9\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u1676\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19A9\u19C1-\u19C7\u1A00-\u1A16\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u2094\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2C6F\u2C71-\u2C7D\u2C80-\u2CE4\u2D00-\u2D25\u2D30-\u2D65\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31B7\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FC3\uA000-\uA48C\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA65F\uA662-\uA66E\uA67F-\uA697\uA717-\uA71F\uA722-\uA788\uA78B\uA78C\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA90A-\uA925\uA930-\uA946\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAC00-\uD7A3\uF900-\uFA2D\uFA30-\uFA6A\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1E\uDF30-\uDF4A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F\uDD00-\uDD15\uDD20-\uDD39\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33]|\uD808[\uDC00-\uDF6E]|\uD809[\uDC00-\uDC62]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|[\uD840-\uD868][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6]|\uD87E[\uDC00-\uDE1D])(?:[\$0-9A-Z_a-z\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0523\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0621-\u065E\u0660-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0901-\u0939\u093C-\u094D\u0950-\u0954\u0958-\u0963\u0966-\u096F\u0971\u0972\u097B-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC\u0EDD\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F8B\u0F90-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u1099\u10A0-\u10C5\u10D0-\u10FA\u10FC\u1100-\u1159\u115F-\u11A2\u11A8-\u11F9\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u1676\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17B3\u17B6-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19A9\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BAA\u1BAE-\u1BB9\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1D00-\u1DE6\u1DFE-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u2094\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2C6F\u2C71-\u2C7D\u2C80-\u2CE4\u2D00-\u2D25\u2D30-\u2D65\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31B7\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FC3\uA000-\uA48C\uA500-\uA60C\uA610-\uA62B\uA640-\uA65F\uA662-\uA66F\uA67C\uA67D\uA67F-\uA697\uA717-\uA71F\uA722-\uA788\uA78B\uA78C\uA7FB-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA900-\uA92D\uA930-\uA953\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAC00-\uD7A3\uF900-\uFA2D\uFA30-\uFA6A\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1E\uDF30-\uDF4A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F\uDD00-\uDD15\uDD20-\uDD39\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F]|\uD808[\uDC00-\uDF6E]|\uD809[\uDC00-\uDC62]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|[\uD840-\uD868][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF])*$/
          let str = name.toLowerCase().replace(/\ /g,'');
          return re.test(String(str));
        }

        validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
          }
          validatePassport(passport){
            var re = /^([a-zA-Z0-9]*)$/;
            return re.test(String(passport).toLowerCase())
          }
          phonevalid(inputtxt) {
            if(inputtxt){
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
            }else{
              return false;
            }
          }

          goToLogin(){
            this.storage.get('auth_token').then(auth_token => {
              if (!auth_token) {
                this.valueGlobal.logingoback = 'flightadddetails';
                this.navCtrl.navigateForward('/login');
              }
            });
          }

          splitFullName(strHoten, ho, ten){
            let textfullname = strHoten.trim().split(' ');
              let name = '';
              if (textfullname.length > 2) {
                for (let i = 1; i < textfullname.length; i++) {
                  if (i == 1) {
                    name += textfullname[i];
                  } else {
                    name += ' ' + textfullname[i];
                  }
                }
                ho = textfullname[0];
                ten = name;
              } else if (textfullname.length > 1) {
                ho = textfullname[0];
                ten =  textfullname[1];
              }
              else if (textfullname.length == 1) {
                ho = textfullname[0];
                ten = "";
              }
              return {firstname: ho, lastname: ten};
          }

          updatePassengerInfo() : Promise<any>{
            var se = this;
            return new Promise((resolve, reject) => {
              se.gf.showLoadingWithMsg('Đang tiến hành giữ vé');
              try{
                let data = se._flightService.itemFlightCache;
  
                var ho ='', ten ='';
                let objhoten = se.splitFullName(se.adults[0].name, ho, ten);
                ho = objhoten.firstname;
                ten = objhoten.lastname;
                data.ho = ho;
                data.ten = ten;
                data.phone = se.sodienthoai;
                data.email = se.email;
                data.hoten = se.hoten;
                data.contactOption = se.contactOption;
                
                let listpassenger:any = [];
                
                for (let index = 0; index < se.adults.length; index++) {
                  const element = se.adults[index];
                  //tên
                  var ho1 ='', ten1='';
                  let objhoten1 = se.splitFullName(element.name, ho1, ten1);
                  ho1 = objhoten1.firstname;
                  ten1 = objhoten1.lastname;
                  
                     element.ancillaryJson = "";
                     element.ancillaryReturnJson =  "";
                    //console.log(element.ancillaryJson);
                    //console.log(element.ancillaryReturnJson);
                    listpassenger.push({
                      "passengerType": 0,
                      "gender": element.gender,
                      "firstName": ten1,
                      "lastName": ho1,
                      "mobileNumber": "",
                      "baggage": "",
                      "returnBaggage": "",
                      "birthDay": element.dateofbirth,
                      "email": "",
                      "passportNumber": (se.showLotusPoint && se.isExtenal) ? element.passport :"",
                      "passportExpired": (se.showLotusPoint && se.isExtenal) ? element.passportExpireDate : "", 
                      "nationality": (se.showLotusPoint && se.isExtenal) ? element.country : "",
                      "destinationCity": "",
                      "destinationPostal": "",
                      "destinationStreet": "",
                      "passportIssueCountry": (se.showLotusPoint && se.isExtenal) ? element.passportCountry : "",
                      "airlineMemberCode": element.departAirlineMemberCode && element.expanddivairlinemember ? element.departAirlineMemberCode : '', 
                      "airlineMemberCodeReturn": (se._flightService.itemFlightCache.roundTrip && element.returnAirlineMemberCode && element.expanddivairlinemember? element.returnAirlineMemberCode : ''), 
                      "departMealPlan": "", 
                      "returnMealPlan": "",  
                      "adultIndex": index, 
                      "ancillaryJson": element.ancillaryJson,
                      "ancillaryReturnJson": element.ancillaryReturnJson
                    })
                }
    
                //trẻ em 
                //pdanh 30-05-2023: truyền thêm netprice all case fixbug hành lý
                let adultIndex = 0;
                for (let index = 0; index < se.childs.length; index++) {
                  const element = se.childs[index];
                  
                  //hành lý
                  let objAncilary =[],objAncilaryReturn =[] ;
                  let departluggageweight = 0, returnluggageweight = 0;
  
                  //tên
                  var ho1 ='', ten1='';
                  let objhoten1 = se.splitFullName(element.name, ho1, ten1);
                  ho1 = objhoten1.firstname;
                  ten1 = objhoten1.lastname;
                
                  if(element.isInfant){
                    adultIndex++;
                  }
                  element.ancillaryJson =  "";
                  element.ancillaryReturnJson = "";
  
                    listpassenger.push({
                      "passengerType": element.isInfant ? 2 : 1,
                      "gender": element.gender,
                      "firstName": ten1,
                      "lastName": ho1,
                      "mobileNumber": "",
                      "baggage": departluggageweight ? departluggageweight : "",
                      "returnBaggage": returnluggageweight ? returnluggageweight : "",
                      "birthDay": element.dateofbirth,
                      "email": "",
                      "passportNumber": (se.showLotusPoint && se.isExtenal) ? element.passport :"",
                      "passportExpired": (se.showLotusPoint && se.isExtenal) ? element.passportExpireDate : "", 
                      "nationality": (se.showLotusPoint && se.isExtenal) ? element.country : "",
                      "destinationCity": "",
                      "destinationPostal": "",
                      "destinationStreet": "",
                      "passportIssueCountry": (se.showLotusPoint && se.isExtenal) ? element.passportCountry : "",
                      "airlineMemberCode": "", 
                      "departMealPlan": "", 
                      "returnMealPlan": "",  
                      "adultIndex": element.isInfant ? adultIndex -1 : 0, 
                      "ancillaryJson": element.ancillaryJson,
                      "ancillaryReturnJson": element.ancillaryReturnJson
                    })
                }
    
                let firstnamecontact = '', lastnamecontact = '';
                let objcontact = se.splitFullName(se.hoten, firstnamecontact, lastnamecontact);
                firstnamecontact = objcontact.firstname;
                lastnamecontact = objcontact.lastname;
                data.ho = firstnamecontact;
                data.ten = lastnamecontact;
                var bookingJsonData;
               
                let checkpromocode = this._voucherService.voucherSelected && this._voucherService.voucherSelected.length ==0 && this._voucherService.listObjectPromoCode && this._voucherService.listObjectPromoCode.length ==0;
                let arrpromocode = se._voucherService.flightPromoCode ? [{"voucherCode": se._voucherService.flightPromoCode, "voucherName": se._voucherService.flightPromoCode,"voucherType": 1,"voucherDiscount": se._voucherService.flightTotalDiscount,"keepCurrentVoucher": false  }] : [];
  
                //return new Promise((resolve, reject) => {
                  let objPass
                     objPass = {
                      "contact": {
                        "gender": "1",
                        "firstName": lastnamecontact,
                        "lastName": firstnamecontact ,
                        "mobileNumber": se.sodienthoai,
                        "email": se.email || "",
                        "address": "",
                        "phoneNumber": se.sodienthoai,
                        "hasvoucher": se._flightService.itemFlightCache.promotionCode ? true : false,
                        "memberCodeAirline": '',
                        "contactChannel": se.contactOption =='mail' ? 'mail' : 'zalo'
                      },
                      "passengers": listpassenger,
                      "userToken": "",
                      "noteCorp": "",
                      "compName": se.companyname,
                      "compAddress": se.address,
                      "compTaxCode": se.tax,
                      "compContactEmail": se.addressorder,
                      "compContactName": se.hotenhddt,
                      "isInvoice": se.Invoice,
                      "isHoldTicket": false,//tạm thời chưa giữ chỗ
                      "departFlightId": data.departFlight ? data.departFlight.id : "",
                      "returnFlightId": data.returnFlight ? data.returnFlight.id : "",
                      "memberId": se.jti ? se.jti : "",
                      "hotelAddon" : "" ,//truyền thêm hotelcity nếu chọn
                      "bookingJsonData":bookingJsonData,//đi chung
                      "vouchers" : [],
                      "InsuranceType": null,
                      "isCheckinOnline": null,
                      "isInitAncillary" : true
                    }
                    
                    
                  let headers = {
                    "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                    'Content-Type': 'application/json; charset=utf-8',
                  };
                  let strUrl = C.urls.baseUrl.urlFlight + "gate/apiv1/PassengerSave/"+data.reservationId;
                  this.gf.RequestApi('POST', strUrl, headers, objPass, 'flightAddDetails', 'GetUserInfo').then((data)=>{
                    if (data) {
                      let result = data;
                      console.log(result);
                      resolve(result);
                    }else{
                      resolve(false);
                    }
                  })
    
                //})
              }
              catch(e){
                se.gf.hideLoading();
                let result = (e as Error).message;
                console.log(result)
                let objError = {
                  page: "flightadddetails",
                  func: "updatePassengerInfo",
                  message: "exception",
                  content: result,
                  type: "warning",
                  param: JSON.stringify(se.options)
                };
                C.writeErrorLog(objError,result);
                se.gf.showAlertErrorMessage();
              }
            })
            
            
          }

          async selectGender(item){
            let actionSheet = await this.actionsheetCtrl.create({
              cssClass: 'action-sheets-flightselectgender',
              mode: 'md',
              header: 'Danh xưng',
              buttons: [
                {
                  text: "Bé trai",
                  cssClass: item.genderdisplay ==  "Bé trai" ? 'text-bold' : '',
                  handler: () => {
                      item.genderdisplay = 'Bé trai';
                      item.gender = 1;
                  }
                },
                {
                  text: "Bé gái",
                  cssClass: item.genderdisplay ==  "Bé gái" ? 'text-bold' : '',
                  handler: () => {
                    item.genderdisplay = 'Bé gái';
                    item.gender = 2;
                  }
                }
              ],
        
            });
        
            actionSheet.present();
            actionSheet.onDidDismiss().then((data: OverlayEventDetail) => {
              this.checkInput(item, 1, false);
          })
          }

          async selectAdultGender(item){
            let actionSheet = await this.actionsheetCtrl.create({
              cssClass: 'action-sheets-flightselectgender',
              mode: 'md',
              header: 'Danh xưng',
              buttons: [
                {
                  text: "Ông",
                  cssClass: item.genderdisplay ==  "Ông" ? 'text-bold' : '',
                  handler: () => {
                      item.genderdisplay = 'Ông';
                      item.gender = 1;
                  }
                },
                {
                  text: "Bà",
                  cssClass: item.genderdisplay ==  "Bà" ? 'text-bold' : '',
                  handler: () => {
                    item.genderdisplay = 'Bà';
                    item.gender = 2;
                  }
                }
              ],
        
            });
        
            actionSheet.present();
            actionSheet.onDidDismiss().then((data: OverlayEventDetail) => {
                this.checkInput(item, 1, true);
            })
          }

          editPaxInfo(item, idx){
            var se = this;
              if(item && idx == 1){
                  item.genderdisplay = '';
                  item.name = '';
                  item.airlineMemberCode ='';
                  item.airlineMemberCodeReturn ='';
                  item.airlineCardCode ='';
                  item.errorGender = true;
                  item.errorName = true;
                  item.dateofbirth = '';
                  item.birdayDisplay = '';
                  item.textErrorInfo = "Vui lòng nhập thông tin Người lớn " +item.id;
                  if(se.isExtenal){
                    item.country = '';
                    item.passport = ''; 
                    item.passportCountry = '';
                    item.passportExpireDate = ''; 
                    item.airlineMemberCode = '';
                  }
              }
              else if(item && idx == 2){
                  item.genderdisplay = '';
                  item.name = '';
                  item.dateofbirth = '';
                  item.birdayDisplay = '';
                  item.errorGender = true;
                  item.errorName = true;
                  item.errorDateofbirth = true;
                  item.textErrorInfo = "Vui lòng nhập thông tin "+ (!item.isInfant ? "Trẻ em" : "Em bé")+" "+(!item.isInfant ? item.id : item.iddisplay);
              }
          }

          async openLotusPointSave(itemAdult){
            var se = this;
            se._flightService.itemFlightCache.airlineMemberCode = itemAdult.airlineMemberCode;
            const modal: HTMLIonModalElement =
                    await this.modalCtrl.create({
                      component: FlightpointsavePage
                    });
                  modal.present();
                
                  modal.onDidDismiss().then((data: OverlayEventDetail) => {
                    if(data && data.data && data.data.code){
                      itemAdult.airlineMemberCode = data.data.code;
                    }
                  })
          }

          async openCardBamBoo(itemAdult){
            var se = this;
            se._flightService.itemFlightCache.airlineCardCode = itemAdult.airlineCardCode;
            const modal: HTMLIonModalElement =
                    await this.modalCtrl.create({
                      component: FlightcardbambooPage
                    });
                  modal.present();
                
                  modal.onDidDismiss().then((data: OverlayEventDetail) => {
                    if(data && data.data && data.data.code){
                      itemAdult.airlineCardCode = data.data.code;
                    }
                  })
          }
          
          inputOnFocus(item, type){
            var se = this;
            if(se.activeStep == 2 && se.hasinput){
              se.hasinput = false;
            }
            se.clearError(item, type);
            if((type ==2 && !item.name) || (type == 9 && !se.hoten)){

              if(se.listPaxSuggestByMemberId && se.listPaxSuggestByMemberId.length >0){
                se.inputtext = true;
                if(type ==2){
                  se.createHintPaxName(item, se.listPaxSuggestByMemberId);
                }else{
                  se.createHintPaxNameStep2(item, se.listPaxSuggestByMemberId);
                }
                
              }else{
                se.storage.get('listpaxcache').then((data)=>{
                      if(data){
                          se.inputtext = true;
                          if(type ==2){
                            se.createHintPaxName(item, se.listPaxSuggestByMemberId);
                          }else{
                            se.createHintPaxNameStep2(item, se.listPaxSuggestByMemberId);
                          }
                      }
                    })
              }
            }
          }

          inputFocus(item, event, type?){
            var se = this;
            if(!se.inputtext){
              //clear error when focus
              if(item && !item.hidePaxHint){
                if(se.listPaxSuggestByMemberId && se.listPaxSuggestByMemberId.length >0){
                  se.inputtext = true;
                  se.createHintPaxName(item, se.listPaxSuggestByMemberId);
                }else{
                  se.storage.get('listpaxcache').then((data)=>{
                    if(data){
                        se.inputtext = true;
                        se.createHintPaxName(item, data);
                    }
                  })
                }
              }else if(!se.hidepaxhint && se.activeStep ==1)
              {
                if(se.listPaxSuggestByMemberId && se.listPaxSuggestByMemberId.length >0){
                  se.inputtext = true;
                  se.createHintPaxNameStep2(item, se.listPaxSuggestByMemberId);
                }
              }
             
            }else if(se.listPaxSuggestByMemberId && se.listPaxSuggestByMemberId.length >0){
              
              if(se.activeStep ==1){
                se.inputtext = true;
                  se.updateHintPaxName(item, se.gf.convertFontVNI(event.target.value), se.listPaxSuggestByMemberId);
                }else{
                  se.inputtext = true;
                  se.updateHintPaxNameStep2(item, se.gf.convertFontVNI(event.target.value), se.listPaxSuggestByMemberId);
                }
                
              }
            
          }

          updateHintPaxName(item, value, listpaxhint){
            var se = this;
              let arraypax:any =[];
              se.listpaxhint = [];
              if(item){
                se.currentSelectPax = item;
              
                for (let index = 0; index < listpaxhint.length; index++) {
                  const element = listpaxhint[index];
                  if(!item.isChild && !element.isChild && element.name &&value && se.gf.convertFontVNI(element.name).toLowerCase().indexOf(value.toLowerCase()) != -1 ){
                    if(!item.genderdisplay || (item.gender && item.gender == element.gender) ){
                        arraypax.push(element);
                    }
                  }
    
                  else if(item.isChild && element.name && value && element.isChild && se.gf.convertFontVNI(element.name).toLowerCase().indexOf(value.toLowerCase()) != -1 ){
                    if(!item.genderdisplay || (item.gender && item.gender == element.gender) ){
                        arraypax.push(element);
                    }
                  }
    
                  
                }
              }
             
              se.listpaxhint = [...arraypax];
          }
            
            async createHintPaxName(item, listpaxhint){
              var se = this;
              let arraypax:any =[];
              if(item){
                se.currentSelectPax = item;
              
                for (let index = 0; index < listpaxhint.length; index++) {
                  const element = listpaxhint[index];
                  if(!item.isChild && !element.isChild){
                    if(!item.genderdisplay || (item.gender && item.gender == element.gender) ){
                        arraypax.push(element);
                    }
                    
                  }
    
                  else if(item.isChild && element.isChild){
                    if(!item.genderdisplay || (item.gender && item.gender == element.gender) ){
                        arraypax.push(element);
                    }
                  }
                }
              }
             
              se.listpaxhint = [...arraypax];
            }
  
            async createHintPaxNameStep2(item, listpaxhint){
              var se = this;
              let arraypax:any =[];
                for (let index = 0; index < listpaxhint.length; index++) {
                  const element = listpaxhint[index];
                  if(!element.isChild){
                    arraypax.push(element);
                  }
                }
             
              se.listpaxhint = [...arraypax];
            }

            updateHintPaxNameStep2(item, value, listpaxhint){
              var se = this;
              let arraypax:any =[];
                for (let index = 0; index < listpaxhint.length; index++) {
                  const element = listpaxhint[index];
                  if(value && element.name && !element.isChild && se.gf.convertFontVNI(element.name).toLowerCase().indexOf(se.gf.convertFontVNI(value).toLowerCase()) != -1){
                    arraypax.push(element);
                  }
                }
             
              se.listpaxhint = [...arraypax];
            }
  
            selectPaxHint(paxhint){
              var se = this;
              se.inputtext = false;
              if(se.currentSelectPax && se.activeStep ==2){
                se.currentSelectPax.name = paxhint.name;
                se.currentSelectPax.gender = paxhint.gender;
                se.currentSelectPax.genderdisplay = paxhint.genderdisplay; 

                se.currentSelectPax.errorGender = false;
                se.currentSelectPax.errorInfo = false;
                se.currentSelectPax.textErrorInfo ='';
                se.currentSelectPax.airlineMemberCode = paxhint.airlineMemberCode ? paxhint.airlineMemberCode : se.currentSelectPax.airlineMemberCode;

                if(paxhint.dateofbirth){
                  se.currentSelectPax.dateofbirth = paxhint.dateofbirth ? paxhint.dateofbirth : se.currentSelectPax.dateofbirth;
                  se.currentSelectPax.birdayDisplay = paxhint.dateofbirth ? moment(paxhint.dateofbirth).format('DD/MM/YYYY') : moment(se.currentSelectPax.dateofbirth).format('DD/MM/YYYY');
                  se.currentSelectPax.errorDateofbirth = false;
                  se.currentSelectPax.textErrorDateofbirth = '';
                }
                if(se.isExtenal){
                  se.currentSelectPax.country = paxhint.country ? paxhint.country: se.currentSelectPax.country;
                  se.currentSelectPax.passport = paxhint.passport ? paxhint.passport: se.currentSelectPax.passport; 
                  se.currentSelectPax.passportCountry = paxhint.passportCountry ? paxhint.passportCountry: se.currentSelectPax.passportCountry;
                  se.currentSelectPax.passportExpireDate = paxhint.passportExpireDate ? paxhint.passportExpireDate: se.currentSelectPax.passportExpireDate; 
                  se.currentSelectPax.errorDateofbirth = false;
                  se.currentSelectPax.errorCountry = false;
                  se.currentSelectPax.errorPassport = false;
                  se.currentSelectPax.errorPassportCountry = false;
                  se.currentSelectPax.errorPassportExpireDate = false;
                  se.currentSelectPax.textErrorDateofbirth = '';
                  se.currentSelectPax.textErrorPassport = '';
                  se.currentSelectPax.textErrorPassportCountry = '';
                  se.currentSelectPax.textErrorPassportExpireDate = '';
                }
                se.currentSelectPax.textErrorInfo = '';
                se.currentSelectPax.textErrorGender ='';
                se.currentSelectPax.textErrorName = '';
                se.currentSelectPax.textErrorCountry = '';
                se.currentSelectPax.byPassCheckRegularName = true;
              }else{
                se.hoten = paxhint.name ? paxhint.name : se.hoten;
                se.sodienthoai = paxhint.phoneNumber ? paxhint.phoneNumber : se.sodienthoai;
                se._flightService.itemFlightCache.hotenstep2 = se.hoten;
                se._flightService.itemFlightCache.sodienthoaistep2 = se.sodienthoai;
                se._flightService.itemFlightCache.emailstep2 = se.email;
              }
            }

          inputLostFocus(item, isadult){
            var se = this;
              setTimeout(()=>{
                se.inputtext = false;
                if(se.activeStep ==1){
                  se.checkInput(item, 2, isadult);
                }else{
                  se.checkInputUserInfo(1);
                }
                if(se.hidepaxhint){
                  item.hidePaxHint = true;
                  se.hidepaxhint = false;
                }
              }, 400)
            
          }
          public async showConfirmEmail(){
            let alert = await this.alertCtrl.create({
              message: "Vui lòng cập nhật địa chỉ email để đảm bảo quý khách nhận được thông tin booking từ iVIVU!",
              cssClass: "cls-alert-showmore",
              buttons: [
                {
                text: 'Đổi email',
                role: 'OK',
                handler: () => {
                    this.showChangeEmail();
                }
              }
            ]
          });
          alert.present();
        }

        async showChangeEmail(){
          var se = this;
          const modal: HTMLIonModalElement =
                  await this.modalCtrl.create({
                    component: ConfirmemailPage,
                    componentProps: {
                      aParameter: true,
                    }
                  });
                modal.present();
              
                modal.onDidDismiss().then((data: OverlayEventDetail) => {
                  if(data && data.data && data.data.email){
                    if(data.data.email){
                      se.storage.remove("email");
                      se.storage.set("email", data.data.email);
                      se.storage.set("saveemail", data.data.email);
                      se.email = data.data.email;
                      se.gotopaymentpage();
                    }
                  }
                  
                 
                })
        }


    getSummaryBooking(data) : Promise<any>{
      var se = this;
      return new Promise((resolve, reject) => {
        let headers = {
          "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          'Content-Type': 'application/json; charset=utf-8',
        };
        let strUrl = C.urls.baseUrl.urlFlight + "gate/apiv1/SummaryBooking/"+data.pnr.resNo;
        this.gf.RequestApi('GET', strUrl, headers, {}, 'flightAddDetails', 'getSummaryBooking').then((data)=>{
          if (data) {
            let result = data;
            resolve(result);
          }
        })
      })
    }

    async showAlertChoiceSeat(){
      var se = this;
      let msg ='Vui lòng chọn lại ghế ngồi!';
      let alert = await se.alertCtrl.create({
        message: msg,
        cssClass: "cls-alert-choiceseat",
        backdropDismiss: false,
        buttons: [
        {
          text: 'OK',
          role: 'OK',
          handler: () => {
            se._flightService.itemFlightCache.backtochoiceseat = true;
            se._flightService.itemFlightReChoiceSeat.emit(1);
            se.navCtrl.navigateBack('flightaddservice');
          }
        }
      ]
    });
    alert.present();
    }

    gobackpage(){
      this.navCtrl.navigateBack('flightadddetails');
    }
    gotoaddservicepage(){
      this.showAlertChoiceSeat();
    }

    selectCountry(item, itemcountry){
      var se = this;
      se.zone.run(()=>{
        item.country = itemcountry.code;
        item.countryName = itemcountry.name;
        item.showSelectCountry = false;
        item.hasselectcountry = true;
        item.errorCountry = false;
        item.textErrorCountry = "";
      })
    }

    getCountry(ev, item){
      var se = this;
      
      se.zone.run(()=>{
        if(ev != 'dropdownicon'){
          item.showSelectCountry = true;
        }else{
          item.showSelectCountry = !item.showSelectCountry;
          if(!item.showSelectCountry && !item.country){
            item.errorCountry = true;
          }
        }
      })
      
      if(ev != 'dropdownicon'&& ev.detail && ev.detail.data ){
        se.textCountrySearch = ev.detail.data;
        const val =  ev.detail.data.toLowerCase();
        let filteritems = se.listcountryFull.filter((element) => { return se.gf.convertFontVNI(element.name.toLowerCase()).indexOf(val) != -1 });

        se.zone.run(()=>{
          if(filteritems && filteritems.length >0){
            se.listcountry = [...filteritems];
          }
        })
        item.errorCountry = false;
      }else{
        se.textCountrySearch = "";
        se.zone.run(()=>{
          se.listcountry = [...se.listcountryFull];
        })
      }
      
    }

    blurCountry(item){
      setTimeout(()=>{
        this.zone.run(()=>{
          item.showSelectCountry = false;
        })
      },100)
    
    }
    

    selectPassportCountry(item, itemcountry){
      var se = this;
      se.zone.run(()=>{
        item.passportCountry = itemcountry.code;
        item.passportCountryName = itemcountry.name;
        item.showSelectPassportCountry = false;
        item.errorPassportCountry = false;
        item.textErrorPassportCountry = "";
      })
    }

    getPassportCountry(ev, item){
      var se = this;
      
      se.zone.run(()=>{
        if(ev != 'dropdownicon'){
          item.showSelectPassportCountry = true;
        }else{
          item.showSelectPassportCountry = !item.showSelectPassportCountry;
          if(!item.showSelectPassportCountry && !item.passportCountry){
            item.errorPassportCountry = true;
          }
        }
        
      })
      
      if(ev != 'dropdownicon' && ev.detail && ev.detail.data){
        se.textPassportCountrySearch = ev.detail.data;
        const val =  ev.detail.data.toLowerCase();
        let filteritems = se.listcountryFull.filter((element) => { return se.gf.convertFontVNI(element.name.toLowerCase()).indexOf(val) != -1 });

        se.zone.run(()=>{
          if(filteritems && filteritems.length >0){
            se.listpassportcountry = [...filteritems];
          }
        })
       
      }else{
        se.textPassportCountrySearch = "";
        
        se.zone.run(()=>{
          se.listpassportcountry = [...se.listcountryFull];
        })
      }
      
    }

    blurPassportCountry(item){
      setTimeout(()=>{
        this.zone.run(()=>{
          item.showSelectPassportCountry = false;
        })
      },100)
    
    }

    checkValidFirstNameAndSubName(listpax): Promise<any>{
      var se = this, res = false, arrItem = [];
      return new Promise((resolve, reject) =>{
        for (let index = 0; index < listpax.length; index++) {
          const element = listpax[index];
          let iteminvalid = listpax.filter((item) => { return item.name.trim().split(' ').length >= 5});
             if(iteminvalid && iteminvalid.length >0){
               resolve(iteminvalid);
             }
          }

          resolve(res);
      })
    }

    checkValidDuplicateFirstNameAndSubName(listpax): Promise<any>{
      var se = this, res = false, arrItem = [];
      return new Promise((resolve, reject) =>{
        for (let index = 0; index < listpax.length; index++) {
          const element = listpax[index];
              let arrname = se.gf.convertFontVNI(element.name).trim().split(' ');
              if(arrname && arrname.length >1){
                let samename = arrname.filter((v,i,a)=> a.findIndex(t=>(t === v)) !== i );
                if(samename && samename.length >0){
                  resolve(element);
                }
              }
          }

          resolve(res);
      })
    }

    async showAlertInvalidFirtNameAndLastName(item){
      var se = this;
      let strmsg = '';
      if(item.length <2){
        let element = item[0];
        strmsg += 'Tên '+ (element.isChild ? (!element.isInfant ?  'Trẻ em ': 'Em bé '): 'Người lớn ');
        strmsg += " <span class='cls-error'>" + element.name + '</span>';
      }else{
        for (let index = 0; index < item.length; index++) {
          const element = item[index];
          strmsg += 'Tên '+ (element.isChild ? (!element.isInfant ?  'Trẻ em ': 'Em bé '): 'Người lớn ') + " <span class='cls-error'>" + element.name + '</span>' + (index < item.length -1 ? ', ' : ' ')
        }
      }
      strmsg += " chứa nhiều hơn 4 chữ cái. Có khả năng quý khách đã nhập nhầm.</br>Nếu quý khách đã nhập đúng họ tên, vui lòng tiếp tục thanh toán."
      let alert = await this.alertCtrl.create({
        header: 'Tên nhiều hơn 4 chữ cái',
        message: strmsg,
        cssClass: "cls-alert-duplicatename",
        backdropDismiss: false,
        buttons: [
        {
          text: 'Thanh toán',
          role: 'OK',
          cssClass: 'button-payment',
          handler: () => {
            alert.dismiss();
            se.gotopayment();
          }
          
        },
        {
          text: 'Nhập lại họ tên',
          role: 'Cancel',
          cssClass: 'button-reinput',
          handler: () => {
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
    }
    
    async showAlertDuplicateFirtNameAndLastName(item){
      var se = this;
      let strmsg = '';
      strmsg += 'Tên '+ (item.isChild ? (!item.isInfant ?  'Trẻ em ': 'Em bé '): 'Người lớn ');
      strmsg += " <span class='cls-error'>" + item.name + '</span> chứa nhiều hơn 1 chữ cái trùng nhau.';
      strmsg += ' Có khả năng quý khách đã nhập nhầm.</br>Nếu quý khách đã nhập đúng họ tên, vui lòng tiếp tục thanh toán.'
      let alert = await this.alertCtrl.create({
        header: 'Chữ cái trùng nhau',
        message: strmsg,
        cssClass: "cls-alert-duplicatename",
        backdropDismiss: false,
        buttons: [
        {
          text: 'Thanh toán',
          role: 'OK',
          cssClass: 'button-payment',
          handler: () => {
            alert.dismiss();
            se.gotopayment();
          }
          
        },
        {
          text: 'Nhập lại họ tên',
          role: 'Cancel',
          cssClass: 'button-reinput',
          handler: () => {
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
    }
    showNameMail(ev)
    {
      this.ishideNameMail=ev.detail.checked;
    }

    hidePaxHint(){
      this.hidepaxhint = true;
    }

    clearError(item, typeInput){
      var se = this;
      if(typeInput == 1)//gender
      {
          item.errorGender = false;
          item.textErrorGender ='';
          
      }

      if(typeInput == 2)//name
      {
          item.errorName = false;
          item.errorSubName = false;
          item.textErrorName ='';
          item.textErrorSubName = '';

           item.errorInfo = false;
          item.textErrorInfo = '';
      }

      if(typeInput == 3)//dob
      {
          item.errorDateofbirth = false;
          item.textErrorDateofbirth = '';
      }

      if(typeInput == 4)//country
      {
          item.errorCountry = false;
          item.textErrorCountry = '';
      }

      if(typeInput == 5)//passport
      {
          item.errorPassport = false;
          item.textErrorPassport = '';
      }

      if(typeInput == 6)//passportcountry
      {
          item.errorPassportCountry = false;
          item.textErrorPassportCountry = '';
      }

      if(typeInput == 7)//passportexpiredate
      {
          item.errorPassportExpireDate = false;
          item.textErrorPassportExpireDate = '';
      }

       if(typeInput == 9)//name contact
      {
          se.hoteninvalid = false;
          se.subnameinvalid = false;
      }
      if(typeInput == 10)//phone contact
      {
          se.sodienthoaiinvalid = false;
      }
      if(typeInput == 11)//email contact
      {
          se.emailinvalid = false;
      }
    }

    async selectDateOfBirth(pax, isChangeBOD){
      let se = this;
      if(!se.allowClickDateOfBirth){
        return;
      }
      se.allowClickDateOfBirth = false;
      se.activityService.itemPax = pax;
      se.activityService.itemPax.isChangeBOD = isChangeBOD;
        let modal = await se.modalCtrl.create({
          component: SelectDateOfBirthPage,
          cssClass: 'cls-flight-adddetails-selectdatetime'
        });
        
        modal.present().then(()=>{
          se.allowClickDateOfBirth = true;
        });
        const event: any = await modal.onDidDismiss();
        const rs = event.data;
        if(rs){
          se.zone.run(()=>{
            pax = rs.itempushback;
          })
          
        }
    }
    togglecheckinonline(event){
      this._flightService.itemFlightCache.isCheckinOnline=event.detail.checked
    }

    contactOptionClick(event){
      this.contactOption = event.currentTarget.value;
      this.ishideNameMail = this.contactOption == 'mail';
    }

    expandAirlineMember(itemAdult, index){
      itemAdult.expanddivairlinemember = !itemAdult.expanddivairlinemember;
      if(itemAdult.expanddivairlinemember){
        var divCollapse = $(`.div-expand-airlinemember-${index}.div-collapse`);
        if(divCollapse && divCollapse.length >0){
          divCollapse.removeClass('div-collapse').addClass('div-expand');
        }
        
        this.scrollToTopGroupReview(1,index);
      }else{
        var divCollapse = $(`.div-expand-airlinemember-${index}.div-expand`);
        if(divCollapse && divCollapse.length >0){
          divCollapse.removeClass('div-expand').addClass('div-collapse');
        }

        this.scrollToTopGroupReview(2,index);
      }
    }

    scrollToTopGroupReview(value,index){
      //scroll to top of group
      setTimeout(()=>{
        var objHeight =  $(`.div-expand-airlinemember-${index}`);
        if(objHeight && objHeight.length >0){
          var h = 0;
          h = value == 2 ? objHeight[0].offsetTop - 200 : objHeight[0].offsetTop - 50;
          if(this.scrollFlightAddetailsArea){
            this.scrollFlightAddetailsArea.scrollToPoint(0,h,500);
          }
          
        }
      },100)
    }

    copyInfoContact(item){
      item.name = this.hoten;
      item.errorName = false;
      item.errorInfo = false;
    }

    pasteClipBoard(event){
      let clipboardtext = event.clipboardData.getData('text');
      if(clipboardtext){
        this.sodienthoai = clipboardtext;
      }
    }

    ipairlinememberOnFocus(id){
      setTimeout(()=>{
      (window.document.getElementById(id) as any).scrollIntoView({ behavior: 'smooth', block: 'start'});
      },100)
    }
}