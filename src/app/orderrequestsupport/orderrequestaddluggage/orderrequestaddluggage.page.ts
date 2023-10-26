import { Component,OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NavController,Platform, ModalController, ActionSheetController, PickerController,  IonContent } from '@ionic/angular';
import { SearchHotel } from '../../providers/book-service';
import { C } from '../../providers/constants';
import { ActivityService, GlobalFunction } from '../../providers/globalfunction';
import { ValueGlobal } from '../../providers/book-service';
import { flightService } from '../../providers/flightService';
import * as moment from 'moment';

/**
 * Generated class for the OccupancyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-orderrequestaddluggage',
  templateUrl: 'orderrequestaddluggage.page.html',
  styleUrls: ['orderrequestaddluggage.page.scss'],
})
export class OrderRequestAddluggagePage implements OnInit {
  @ViewChild('slideTab') sliderTab: ElementRef;
  @ViewChild('scrollorderrequestaddluggage') contentorderrequestaddluggage: IonContent;
  slideOpts = {
    loop: false,
    slidesPerView: 1,
    centeredSlides: false,
    spaceBetween: 10,
    zoom: {
      toggle: false
    }
  };
  tabluggage = 1;
  adults = 2;
  child = 0;
  room = 1;
  arrchild:any = [];
  public numage;
  ischeckadults = true;
  ischeckchild = false;
  ischeckroom = false;
  cout; cin;
  ComboDayNum;namecombo;Address;imghotel;namehotel;
  showpopupfromrequestcombo = false;ChildAgeTo
  departLuggage: any=[];
  returnLuggage: any=[];
  quantitydisplay = "chưa chọn";
  quantityreturndisplay ="chưa chọn" ;
  totalprice: number=0;
  totalpricedisplay: any;
  totalquantity=0;
  totaldepartquantity: any=0;
  totalreturnquantity: any=0;
  totalquantityreturn: any=0;
  departConditionInfo: any;
  returnConditionInfo: any;
  hasDepartLuggage: boolean;
  hasReturnLuggage: boolean;
  roundtrip: any;
  departPass:any = [];
  listPass:any = [];
  loadluggagedepartdone = false;
  loadluggagereturndone = false;
  arraySkeleton = [1,2,3,4,5];
  listPassReturn:any = [];
  returnPass:any= [];
  hadBuyLuggageDepart: boolean = false;
  hadBuyLuggageReturn: boolean = false;
  emptyLuggage: boolean=false;
  emptyLuggageReturn: boolean=false;
  constructor(public platform: Platform,public navCtrl: NavController, public modalCtrl: ModalController,public valueGlobal:ValueGlobal,
    public searchhotel: SearchHotel, public gf: GlobalFunction,
    public actionsheetCtrl: ActionSheetController,
    public pickerController: PickerController,
    private zone: NgZone,
    public _flightService: flightService,
    public activityService: ActivityService) {
    
  }

  ionViewWillEnter(){
    if(this.activityService.objPaymentMytrip){
      console.log(this.activityService.objPaymentMytrip);
      let itemFlightTrip = this.activityService.objPaymentMytrip.trip;
      this.roundtrip = itemFlightTrip.itemdepart && (itemFlightTrip.itemreturn && itemFlightTrip.itemreturn.airlineCode && itemFlightTrip.itemreturn.airlineName.toLowerCase().indexOf('cathay') == -1 && ['GO', 'RETURN', 'GOROUNDTRIP', 'RETURNROUNDTRIP'].indexOf(itemFlightTrip.itemreturn.trip_Code) == -1);
      this.departLuggage = [];
      this.returnLuggage = [];
      this.totalprice=0;
      this.totalpricedisplay ='';
      this.listPass =[];
      this.listPassReturn =[];
      itemFlightTrip.itemdepart.passengers.forEach(p => {
        p.departLuggage = null;
      });
      if(itemFlightTrip.itemreturn && itemFlightTrip.itemreturn.passengers){
        itemFlightTrip.itemreturn.passengers.forEach(p => {
          p.returnLuggage = null;
        });
      }
     
      if(itemFlightTrip && itemFlightTrip.itemdepart && itemFlightTrip.itemdepart){
        this.getLuggage(itemFlightTrip.itemdepart).then((data) =>{
          this.loadluggagedepartdone = true;
          if(data && data.baggage){
            if(itemFlightTrip.itemdepart.airlineName.toLowerCase().indexOf('vietnam airline') != -1){
              this.departLuggage = data.baggage;
            }else{
              this.departLuggage = data.baggage.filter((lug) => lug.weight >= 15);
            }
            
           
            this.departPass = data.passengers;
            if(data.passengers && data.passengers.passenger){
              this.departPass = data.passengers.passenger;
            }
            this.listPass = [...itemFlightTrip.itemdepart.passengers];
            this.mapPassenger(data.baggage[0].airLineCode ,1);
            this.checkAllowAddMoreLuggage(itemFlightTrip.itemdepart, 1);
            this.hadBuyLuggageDepart = this.listPass.filter((p) => p.allowAddMoreLuggage).length ==0;
            
            if(itemFlightTrip.itemreturn && data.returnBaggage && data.returnBaggage.length >0){
              if(itemFlightTrip.itemreturn.airlineName.toLowerCase().indexOf('vietnam airline') != -1){
                this.returnLuggage = data.returnBaggage;
              }else{
                this.returnLuggage = data.returnBaggage.filter((lug) => lug.weight >= 15);
              }
              
            }
          }
        })
      }
      if(itemFlightTrip && itemFlightTrip.itemreturn && itemFlightTrip.itemreturn.airlineCode && itemFlightTrip.itemreturn.airlineName.toLowerCase().indexOf('cathay') == -1 && ['GO', 'RETURN', 'GOROUNDTRIP', 'RETURNROUNDTRIP'].indexOf(itemFlightTrip.itemreturn.trip_Code) == -1){
        this.getLuggage(itemFlightTrip.itemreturn).then((datareturn) =>{
          //Chiều về và chiều đi cùng mã pnr
          if(itemFlightTrip && itemFlightTrip.itemdepart && itemFlightTrip.itemdepart.ticketCode == itemFlightTrip.itemreturn.ticketCode){
            if(datareturn && datareturn.returnBaggage){
              if(itemFlightTrip.itemreturn.airlineName.toLowerCase().indexOf('vietnam airline') != -1){
                this.returnLuggage = datareturn.returnBaggage;
              }else{
                this.returnLuggage = datareturn.returnBaggage.filter((lug) => lug.weight >= 15);
              }
              
              this.returnPass = datareturn.passengers;
              if(datareturn.passengers && datareturn.passengers.passenger){
                this.returnPass = datareturn.passengers.passenger;
              }
                this.listPassReturn = [...itemFlightTrip.itemreturn.passengers];
                this.mapPassenger(datareturn.baggage[0].airLineCode ,2);
                this.checkAllowAddMoreLuggage(itemFlightTrip.itemreturn, 2);
                this.hadBuyLuggageReturn = this.listPassReturn.filter((p) => p.allowAddMoreLuggage).length ==0;
            }
          }else{
            if(datareturn && datareturn.baggage){
              if(itemFlightTrip.itemreturn.airlineName.toLowerCase().indexOf('vietnam airline') != -1){
                this.returnLuggage = datareturn.baggage;
              }else{
                this.returnLuggage = datareturn.baggage.filter((lug) => lug.weight >= 15);
              }
              this.returnPass = datareturn.passengers;
              if(datareturn.passengers && datareturn.passengers.passenger){
                this.returnPass = datareturn.passengers.passenger;
              }
                this.listPassReturn = [...itemFlightTrip.itemreturn.passengers];
                this.mapPassenger(datareturn.baggage[0].airLineCode ,2);
                this.checkAllowAddMoreLuggage(itemFlightTrip.itemreturn, 2);
                this.hadBuyLuggageReturn = this.listPassReturn.filter((p) => p.allowAddMoreLuggage).length ==0;
            }
          }
          
          
          this.loadluggagereturndone = true;
        })
      }

      if(this.departLuggage && this.departLuggage.length>0){
        this.departLuggage.forEach(element => {
         
            this.totalprice += element.amount;
            this.totaldepartquantity += element.quantity;
            this.totalquantity+= element.quantity;
            this.hasDepartLuggage = true;

        });
        if(this.totaldepartquantity >0){
          this.quantitydisplay = this.totaldepartquantity + " kiện";
        }
      }

      if(this.returnLuggage && this.returnLuggage.length>0){
        this.returnLuggage.forEach(element => {
            this.totalprice += element.amount;
            this.totalreturnquantity+= element.quantity;
            this.totalquantity+= element.quantity;
            this.hasReturnLuggage = true;
        });
        if(this.totalreturnquantity >0){
          this.quantityreturndisplay = this.totalreturnquantity + " kiện";
        }
        
      }

      if(this.totalprice >0){
        this.totalpricedisplay = this.gf.convertNumberToString(this.totalprice) + "đ";
      }
      
      
    }
  }

  mapPassenger(airlineCode, type){
    if(type == 1){
      this.listPass.forEach((p) => {
        //let itemmap = this.departPass.filter((f) => {return this.gf.convertFontVNI(f.lastName.toLowerCase().trim()) + " " + this.gf.convertFontVNI(this.gf.removeString(f.firstName)) == this.gf.convertFontVNI(p.name.toLowerCase().trim()) });
        let itemmap = this.departPass.filter((f) => {return this.gf.convertUnicodeCharactor(f.lastName.toLowerCase().trim()) + " " + this.gf.convertUnicodeCharactor(this.gf.removeString(f.firstName)) == this.gf.convertUnicodeCharactor(p.name.toLowerCase().trim()) });
        if(itemmap && itemmap.length >0){
          if(airlineCode == 'BB' || airlineCode == 'VJ'){
            p.lastName = itemmap[0].lastName;
            p.firstName = itemmap[0].firstName;
            p.paxid = itemmap[0].paxid;
            p.title = itemmap[0].title;
          }
          else if(airlineCode == 'VN'){
            p.lastName = itemmap[0].lastName;
            p.firstName = itemmap[0].firstName;
            p.paxid = itemmap[0].nameId;
            p.title = itemmap[0].title;
            p.elementId = itemmap[0].elementId;
          }
          if(this.activityService.objPaymentMytrip.trip.itemdepart){
            p.departCode = this.activityService.objPaymentMytrip.trip.itemdepart.departCode;
            p.arrivalCode = this.activityService.objPaymentMytrip.trip.itemdepart.arrivalCode;
          }
         
        }
      });
    }else{
      this.listPassReturn.forEach((p) => {
        //let itemmap = this.returnPass.filter((f) => {return this.gf.convertFontVNI(f.lastName.toLowerCase().trim()) + " " + this.gf.convertFontVNI(this.gf.removeString(f.firstName)) == this.gf.convertFontVNI(p.name.toLowerCase().trim()) });
        let itemmap = this.returnPass.filter((f) => {return this.gf.convertUnicodeCharactor(f.lastName.toLowerCase().trim()) + " " + this.gf.convertUnicodeCharactor(this.gf.removeString(f.firstName)) == this.gf.convertUnicodeCharactor(p.name.toLowerCase().trim()) });
        if(itemmap && itemmap.length >0){
          if(airlineCode == 'BB'|| airlineCode == 'VJ'){
            p.lastName = itemmap[0].lastName;
            p.firstName = itemmap[0].firstName;
            p.paxid = itemmap[0].paxid;
            p.title = itemmap[0].title;
          }
          else if(airlineCode == 'VN'){
            p.lastName = itemmap[0].lastName;
            p.firstName = itemmap[0].firstName;
            p.paxid = itemmap[0].nameId;
            p.title = itemmap[0].title;
            p.elementId = itemmap[0].elementId;
          }

          if(this.activityService.objPaymentMytrip.trip.itemreturn){
            p.departCode = this.activityService.objPaymentMytrip.trip.itemreturn.departCode;
            p.arrivalCode = this.activityService.objPaymentMytrip.trip.itemreturn.arrivalCode;
          }
        }
      });
    }
    
  }

  checkAllowAddMoreLuggage(item, type){
    if(type == 1){
      this.listPass.forEach((p)=> { if( (item.airlineName.toLowerCase().indexOf('vietnam airline') != -1 && !p.isInfant) || (!p.isInfant && p.giaTienHanhLy == '0' && p.hanhLy == '0kg')){
        p.allowAddMoreLuggage = true;
      }
     });
    }else{
      this.listPassReturn.forEach((p)=> { if( (item.airlineName.toLowerCase().indexOf('vietnam airline') != -1 && !p.isInfant) || (!p.isInfant && p.giaTienHanhLy == '0' && p.hanhLy == '0kg')){
        p.allowAddMoreLuggage = true;
      }
     });
    }
    
  }

  ngOnInit() {
   
  }

  goback(){
    this.listPass.forEach((p)=> {
      p.departLuggage = null;
    });
    this.listPassReturn.forEach((p)=> {
      p.returnLuggage = null;
    });

    this.navCtrl.back();
  }

  getValue(event, type, passenger){
    if(type == 1){
      passenger.departLuggage = event.detail.value;
    }else{
      passenger.returnLuggage = event.detail.value;
    }
    
    //this.totalprice += item.amount;
    this.calculateTotalPrice();
  }

  calculateTotalPrice(){
    this.totalprice = this.listPass.reduce((total,p) => { return total + (p.departLuggage ? p.departLuggage.amount : 0); }, 0);
    this.totalprice += this.listPassReturn.reduce((total,p) => { return total + (p.returnLuggage ? p.returnLuggage.amount : 0); }, 0);
    this.totalpricedisplay = this.gf.convertNumberToString(this.totalprice) + "đ";
  }
  
  confirm()
  {
    this.createObjectAddLuggage();
      //console.log(this.activityService.objRequestAddLuggage);
      //this.navCtrl.navigateForward('/orderrequestaddluggagepayment');
  }

  createObjectAddLuggage(){
    let obj:any = {}, objreturn:any = {};
    obj.bookingCode = this.activityService.objPaymentMytrip.trip.booking_id;
    objreturn.bookingCode = this.activityService.objPaymentMytrip.trip.booking_id;
    this.emptyLuggage = false;
    this.emptyLuggageReturn = false;
    
    if(this.listPass && this.listPass.some((p) => {return p.departLuggage && p.departLuggage.amount >0 })){
      let itemd = this.activityService.objPaymentMytrip.trip.itemdepart;
      obj.pnr = itemd.ticketCode;
      obj.airline = itemd.airlineName.toLowerCase().indexOf('vietnam airline') != -1 ? 'VN' : (itemd.airlineName.toLowerCase().indexOf('vietjet') != -1 ? 'VJ' : 'QH');
      obj.startDate = moment(this.activityService.objPaymentMytrip.trip.checkInDate).format('YYYY-MM-DD')+'T'+itemd.departureTime+':00';
      obj.items = [];
      this.listPass.forEach((p) => {
        if(p.departLuggage && p.firstName && p.lastName){
          obj.items.push({
            "nameId": p.paxid,
            "firstName": p.firstName,
            "lastName": p.lastName,
            "baggages": [
              {
                "quantity": 1,
                "weight": p.departLuggage.weight,
                "price": p.departLuggage.amount
              }
            ]
          })
        }
      })
    }else{
      this.emptyLuggage = true;
    }

    if(this.listPassReturn && this.listPassReturn.some((p) => {return p.returnLuggage && p.returnLuggage.amount >0 })){
      let itemr = this.activityService.objPaymentMytrip.trip.itemreturn;
      objreturn.pnr = itemr.ticketCode;
      objreturn.airline = itemr.airlineName.toLowerCase().indexOf('vietnam airline') != -1 ? 'VN' : (itemr.airlineName.toLowerCase().indexOf('vietjet') != -1 ? 'VJ' : 'QH');
      objreturn.startDate = moment(this.activityService.objPaymentMytrip.trip.checkOutDate).format('YYYY-MM-DD')+'T'+itemr.departureTime+':00';
      objreturn.items = [];
      this.listPassReturn.forEach((p) => {
        if(p.returnLuggage && p.firstName && p.lastName){
          objreturn.items.push({
            "nameId": p.paxid,
            "firstName": p.firstName,
            "lastName": p.lastName,
            "baggages": [
              {
                "quantity": 1,
                "weight": p.returnLuggage.weight,
                "price": p.returnLuggage.amount
              }
            ]
          })
        }
      })
    }else{
      this.emptyLuggageReturn = true;
    }

    if(this.emptyLuggage && this.emptyLuggageReturn){
      this.gf.showAlertMessage('Bạn chưa chọn gói hành lý nào. Vui lòng kiểm tra lại!','');
      return;
    }else if((!obj.items || obj.items.length ==0 )&& (!objreturn.items || objreturn.items.length ==0)){
      this.gf.showAlertMessage('Đã có lỗi xảy ra. Vui lòng liên hệ iVIVU để được hỗ trợ thêm!','');
      return;
    }

    this.activityService.objRequestAddLuggage = {
      bookingCode: this.activityService.objPaymentMytrip.trip.booking_id,
      totalPrice: this.totalprice,
      totalPriceDisplay: this.totalpricedisplay,
      departWeight: this.listPass.reduce((totalweight,p) => { return totalweight + (p.departLuggage ? p.departLuggage.weight : 0); }, 0),
      returnWeight: this.listPassReturn.reduce((totalweight,p) => { return totalweight + (p.returnLuggage ? p.returnLuggage.weight : 0); }, 0),
      objectDepartLuggage: obj,
      objectReturnLuggage: objreturn,
      listPass: this.listPass,
      listPassReturn: this.listPassReturn,
    }
    
    this.gf.showLoading();
      if(this.activityService.objRequestAddLuggage && this.activityService.objRequestAddLuggage.objectDepartLuggage && this.activityService.objRequestAddLuggage.objectDepartLuggage.items && this.activityService.objRequestAddLuggage.objectDepartLuggage.items.length >0){
        let urllug = C.urls.baseUrl.urlFlight + "gate/apiv1/AddBaggage";
        let  headers = {
          "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          'Content-Type': 'application/json; charset=utf-8',
        };
        let body = this.activityService.objRequestAddLuggage.objectDepartLuggage;
        this.gf.RequestApi('POST', urllug, headers , body, 'orderrequestaddluggagepaymentchoosebank', 'AddBaggage' ).then((data) => {
          if(data && data.success){

            if(this.activityService.objRequestAddLuggage.listPassReturn && this.activityService.objRequestAddLuggage.listPassReturn.some((p) => {return p.returnLuggage && p.returnLuggage.amount >0 })){
              let urllug = C.urls.baseUrl.urlFlight + "gate/apiv1/AddBaggage";
              let  headers = {
                "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                'Content-Type': 'application/json; charset=utf-8',
              };
              let body = this.activityService.objRequestAddLuggage.objectReturnLuggage;
              this.gf.RequestApi('POST', urllug, headers , body, 'orderrequestaddluggagepaymentchoosebank', 'AddBaggage' ).then((data1) => {
                if(data1 && data1.success){
                  this.gf.hideLoading();
                  this.navCtrl.navigateForward('/orderrequestaddluggagepaymentselect');
                }else{
                  this.gf.hideLoading();
                  this.gf.showAlertMessageOnly('Mua hành lý không thành công. Vui lòng liên hệ iVIVU để được hỗ trợ thêm!');
                }
              })
            }else{
              this.gf.hideLoading();
              this.navCtrl.navigateForward('/orderrequestaddluggagepaymentselect');
            }
          }else{
            this.gf.hideLoading();
            this.gf.showAlertMessageOnly('Mua hành lý không thành công. Vui lòng liên hệ iVIVU để được hỗ trợ thêm!');
          }
          
        })
      }
      else if(this.activityService.objRequestAddLuggage.listPassReturn && this.activityService.objRequestAddLuggage.listPassReturn.some((p) => {return p.returnLuggage && p.returnLuggage.amount >0 })){
        let urllug = C.urls.baseUrl.urlFlight + "gate/apiv1/AddBaggage";
        let  headers = {
          "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          'Content-Type': 'application/json; charset=utf-8',
        };
        let body = this.activityService.objRequestAddLuggage.objectReturnLuggage;
        this.gf.RequestApi('POST', urllug, headers , body, 'orderrequestaddluggagepaymentchoosebank', 'AddBaggage' ).then((data1) => {
          if(data1 && data1.success){
            this.gf.hideLoading();
            this.navCtrl.navigateForward('/orderrequestaddluggagepaymentselect');
          }else{
            this.gf.hideLoading();
            this.gf.showAlertMessageOnly('Mua hành lý không thành công. Vui lòng liên hệ iVIVU để được hỗ trợ thêm!');
          }
        })
      }else{
        this.gf.hideLoading();
      } 
  }

  slidetabchange(){
    // this.sliderTab?.nativeElement.getActiveIndex().then(index => {
    //   this.tabluggage = index+1;
    // });
    this.tabluggage = this.sliderTab?.nativeElement.swiper.activeIndex+1;
    //this.contentFlightAddLuggage.scrollToTop(200);
  }

  SelectTab(tabindex){
    this.zone.run(()=>{
      this.tabluggage = tabindex;
      this.sliderTab?.nativeElement.swiper.slideTo(tabindex-1);
      //this.contentFlightAddLuggage.scrollToTop(200);
    })
  
  }

  getLuggage(item) : Promise<any>{
    var se = this;
    
      return new Promise((resolve, reject) => {
        if(item.ticketCode && item.ticketCode.indexOf('T__') == -1){
      let url = C.urls.baseUrl.urlFlight + "gate/apiv1/getAncillaryByPnr?pnr="+item.ticketCode +"&airline="+se.getAirlineShortName(item.airlineName);
      let headers = {
              "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
              'Content-Type': 'application/json; charset=utf-8'
            }
            se.gf.RequestApi('GET', url, headers, {}, 'OrderRequestAddLuggage', 'getLuggage').then((data) =>{
                resolve(data);
            });
    }else{
      resolve([]);
    }
      })
    
  }

  getAirlineShortName(name) {
    return name.toLowerCase().indexOf('vietnam airline') != -1 ? 'VN' : (name.toLowerCase().indexOf('vietjet') != -1 ? 'VJ' : 'QH');
  }
}