import { Component,OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NavController,Platform, ModalController, ActionSheetController, PickerController, IonContent } from '@ionic/angular';
import { SearchHotel } from '../providers/book-service';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import { ValueGlobal } from '../providers/book-service';
import { flightService } from '../providers/flightService';
import * as moment from 'moment';
import * as $ from 'jquery';
/**
 * Generated class for the OccupancyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-flightaddluggage',
  templateUrl: 'flightaddluggage.page.html',
  styleUrls: ['flightaddluggage.page.scss'],
})
export class FlightaddluggagePage implements OnInit {
  @ViewChild('slideTab') sliderTab: ElementRef| undefined;
  @ViewChild('scrollFlightAddLuggage') contentFlightAddLuggage: IonContent;
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
  arrchild = [];
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
  roundtrip: number;
  emptyAdultLugReturn: any;
  emptyAdultLug: any;
  emptyChildLug: any;
  emptyChildLugReturn: any;
  constructor(public platform: Platform,public navCtrl: NavController, public modalCtrl: ModalController,public valueGlobal:ValueGlobal,
    public searchhotel: SearchHotel, public gf: GlobalFunction,
    public actionsheetCtrl: ActionSheetController,
    public pickerController: PickerController,
    private zone: NgZone,
    public _flightService: flightService) {
    if(this._flightService.itemFlightCache.departFlight){
      this.roundtrip = this._flightService.itemFlightCache.roundTrip;
      this.departLuggage = [];
      this.returnLuggage = [];
      if(this._flightService.itemFlightCache.departFlight){
        this.departLuggage = this._flightService.itemFlightCache.departFlight.airLineLuggage;
      }

      if(this._flightService.itemFlightCache.returnFlight){
        this.returnLuggage = this._flightService.itemFlightCache.returnFlight.airLineLuggage;
      }

      if(this._flightService.itemFlightCache.departLuggage && this._flightService.itemFlightCache.departLuggage.length >0){
        
        this.departLuggage = this._flightService.itemFlightCache.departLuggage;
      }

      if(this._flightService.itemFlightCache.returnLuggage && this._flightService.itemFlightCache.returnLuggage.length >0){
       
        this.returnLuggage = this._flightService.itemFlightCache.returnLuggage;
      }
      
      if(this._flightService.itemFlightCache.dataBooking && this._flightService.itemFlightCache.dataBooking.departCondition){
        this.getDetailTicket(this._flightService.itemFlightCache.departFlight).then((data) =>{
          if(data.ticketCondition){
            this.departConditionInfo = data.ticketCondition;
          }
        })
      }

      if(this._flightService.itemFlightCache.dataBooking && this._flightService.itemFlightCache.dataBooking.returnCondition){
          this.getDetailTicket(this._flightService.itemFlightCache.returnFlight).then((data) =>{
            if(data.ticketCondition){
              this.returnConditionInfo = data.ticketCondition;
            }
          })
      }
      
      if(this.departLuggage && this.departLuggage.length>0){
        this.departLuggage.forEach(element => {
          element.priceshow = " "+ this.gf.convertNumberToString(element.amount) +"đ";
          if(!element.quantity){
            element.quantity = 0;
          }else{
            this.totalprice += element.quantity * element.amount;
            this.totaldepartquantity += element.quantity;
            this.totalquantity+= element.quantity;
            this.hasDepartLuggage = true;
          }
         
        });
        if(this.totaldepartquantity >0){
          this.quantitydisplay = this.totaldepartquantity + " kiện";
        }
      }

      if(this.returnLuggage && this.returnLuggage.length>0){
        this.returnLuggage.forEach(element => {
          element.priceshow = " "+ this.gf.convertNumberToString(element.amount) +"đ";
          if(!element.quantity){
            element.quantity = 0;
          }else{
            this.totalprice += element.quantity * element.amount;
            this.totalreturnquantity+= element.quantity;
            this.totalquantity+= element.quantity;
            this.hasReturnLuggage = true;
          }
        });
        if(this.totalreturnquantity >0){
          this.quantityreturndisplay = this.totalreturnquantity + " kiện";
        }
      }

      if(this.totalprice >0){
        this.totalpricedisplay = this.gf.convertNumberToString(this.totalprice) + "đ";
      }
      this.checkLug();
    }
  }

  ngOnInit() {
   
  }

  ionViewWillEnter(){
    this.platform.ready().then(()=>{
      setTimeout(()=>{
        if(this.sliderTab){
          //this.sliderTab?.nativeElement.swiper.lockSwipes(true);
         }
      }, 100)
      
    })
    
  }

  goback(){
   
    this.navCtrl.navigateBack('/flightaddservice');
  }

  plusroom(item, isdepart) {
    this.zone.run(()=>{
      let maxluggagepax = this._flightService.itemFlightCache.pax - (this._flightService.itemFlightCache.infant ? this._flightService.itemFlightCache.infant : 0);
      if((this.totaldepartquantity < maxluggagepax && isdepart) || (this.totalreturnquantity < maxluggagepax && !isdepart)){
        item.quantity++;
        if(isdepart){
          this.totalquantity++;
        }else{
          this.totalquantityreturn++;
        }
        
        if(isdepart){
          this.totaldepartquantity++;
          this.quantitydisplay = this.totaldepartquantity + " kiện";
        }else{
          this.totalreturnquantity++;
          this.quantityreturndisplay = this.totalreturnquantity + " kiện";
        }
        
        this.totalprice = this.departLuggage.reduce((total,b)=>{ return total + (b.quantity * b.amount); }, 0);
        this.totalprice += this.returnLuggage.reduce((total,b)=>{ return total + (b.quantity * b.amount); }, 0);
        this.totalpricedisplay = this.gf.convertNumberToString(this.totalprice) + "đ";

      }else{
        if(this._flightService.itemFlightCache.infant){
          this.gf.showToastWarning("Không chọn hành lý cho em bé. Xin vui lòng kiểm tra lại!");
        }else{
          this.gf.showToastWarning("Số kiện không được vượt quá số khách. Xin vui lòng kiểm tra lại!");
        }
        
      }
    })
    
  }
  minusroom(item, isdepart) {
    this.zone.run(()=>{
      if (item.quantity >= 1) {
        item.quantity--;
        this.totalquantity--;
        if(isdepart){
          this.totaldepartquantity--;
          this.quantitydisplay = this.totaldepartquantity >0 ? (this.totaldepartquantity + " kiện") : "Chưa chọn";
        }else{
          this.totalreturnquantity--;
          this.quantityreturndisplay = this.totalreturnquantity >0 ? (this.totalreturnquantity + " kiện") : "Chưa chọn";
        }
        this.totalprice = this.departLuggage.reduce((total,b)=>{ return total + (b.quantity * b.amount); }, 0);
        this.totalprice += this.returnLuggage.reduce((total,b)=>{ return total + (b.quantity * b.amount); }, 0);
        this.totalpricedisplay = this.gf.convertNumberToString(this.totalprice) +"đ";
      }
    })
    
  }
  confirm()
  {
    if(this.tabluggage ==1 && this.roundtrip){
      this.SelectTab(2);
    }else{
      this._flightService.itemFlightLuggagePriceChange.emit(true);
      this.navCtrl.navigateBack('/flightaddservice');
    }
  }

  slidetabchange(){
    // this.sliderTab.getActiveIndex().then(index => {
    //   this.tabluggage = index+1;
    // });
    this.tabluggage = this.sliderTab?.nativeElement.swiper.activeIndex+1;
    this.contentFlightAddLuggage.scrollToTop(200);
  }

  SelectTab(tabindex){
    //this.sliderTab?.nativeElement.swiper.lockSwipes(false);
    this.zone.run(()=>{
      this.tabluggage = tabindex;
      this.sliderTab?.nativeElement.swiper.slideTo(tabindex-1);
      this.contentFlightAddLuggage.scrollToTop(200);
    })
    //this.sliderTab?.nativeElement.swiper.lockSwipes(true);
  }

  getDetailTicket(item) : Promise<any>{
    return new Promise((resolve, reject) => {
      let headers = {
        "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
        'Content-Type': 'application/json; charset=utf-8',
      };
      let strUrl = C.urls.baseUrl.urlFlight + "gate/apiv1/GetDetailTicketAirBus?airlineCode="+item.airlineCode +"&ticketType="+item.ticketType+"&airbusCode="+item.aircraft+"&flightNumber="+item.flightNumber+"&fromPlace="+item.fromPlaceCode+"&toPlace="+item.toPlaceCode+"&departDate="+moment(item.departTime).format("MM-DD-YYYY")+"&bookingDate="+moment(new Date()).format("MM-DD-YYYY");
      this.gf.RequestApi('GET', strUrl, headers, {}, 'flightAddDetails', 'getDetailTicket').then((data)=>{
        if (data) {
          let result = data;
          resolve(result);
      }
    })
    })
}
choiceLuggage(pax, item, index, indexpax, type, isdepart){
  if(type==1){
    if(isdepart){
      $('#itemluguc_adult_'+indexpax).removeClass('selected');
    }else {
      $('#itemluguc_return_adult_'+indexpax).removeClass('selected');
    }
  }else{
    if(isdepart){
      $('#itemluguc_child_'+indexpax).removeClass('selected');
    }else {
      $('#itemluguc_return_child_'+indexpax).removeClass('selected');
    }
  }
  this.zone.run(()=>{
    setTimeout(()=>{
      if(isdepart){
        pax.itemLug = item;
        pax.indexLugSelected = index;
      }else {
        pax.itemLugReturn = item;
        pax.indexLugReturnSelected = index;
      }

      this.checkLug();
    },10)
  })
}
unchoiceLug(pax, indexpax, type, isdepart){
  if(type==1){
    if(isdepart){
      $('#itemluguc_adult_'+indexpax).addClass('selected');
      pax.itemLug = null;
      pax.indexLugSelected = -1;
    }else {
      $('#itemluguc_return_adult_'+indexpax).addClass('selected');
      pax.itemLugReturn = null;
      pax.indexLugReturnSelected = -1;
    }

  }else{
    if(isdepart){
      $('#itemluguc_child_'+indexpax).addClass('selected');
      pax.itemLug = null;
      pax.indexLugSelected = -1;
    }else {
      $('#itemluguc_return_child_'+indexpax).addClass('selected');
      pax.itemLugReturn = null;
      pax.indexLugReturnSelected = -1;
    }
  }
  this.checkLug();
}

checkLug(){
  if(this.departLuggage){
    this.emptyAdultLug = this._flightService.itemFlightCache.adults && this._flightService.itemFlightCache.adults.length >0 && !this._flightService.itemFlightCache.adults.some(a => a.itemLug);
    this.emptyChildLug = this._flightService.itemFlightCache.childs && this._flightService.itemFlightCache.childs.length >0 && !this._flightService.itemFlightCache.childs.some(a => a.itemLug);
  }
  if(this.returnLuggage){
    this.emptyAdultLugReturn = this._flightService.itemFlightCache.adults && this._flightService.itemFlightCache.adults.length >0 && !this._flightService.itemFlightCache.adults.some(a => a.itemLugReturn);
    this.emptyChildLugReturn = this._flightService.itemFlightCache.childs && this._flightService.itemFlightCache.childs.length >0 && !this._flightService.itemFlightCache.childs.some(a => a.itemLugReturn);
  }

  this.totalprice = this._flightService.itemFlightCache.adults.reduce((total,a)=>{ return total + (a.itemLug ? (a.itemLug.amount) : 0); }, 0);
  this.totalprice += this._flightService.itemFlightCache.childs.reduce((total,c)=>{ return total + (c.itemLug ? (c.itemLug.amount) : 0); }, 0);
  if(this.returnLuggage && this.returnLuggage.length >0){
    this.totalprice += this._flightService.itemFlightCache.adults.reduce((total,a)=>{ return total + (a.itemLugReturn ? (a.itemLugReturn.amount) : 0); }, 0);
    this.totalprice += this._flightService.itemFlightCache.childs.reduce((total,c)=>{ return total + (c.itemLugReturn ? (c.itemLugReturn.amount) : 0); }, 0);
  }
  this.totalpricedisplay = (this.gf.convertNumberToString(this.totalprice)||0) + "đ";
}
}