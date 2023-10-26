import { Bookcombo } from './../providers/book-service';
import { Component,OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NavController,  IonContent } from '@ionic/angular';
import { GlobalFunction } from '../providers/globalfunction';

@Component({
  selector: 'app-flightcomboaddluggage',
  templateUrl: './flightcomboaddluggage.page.html',
  styleUrls: ['./flightcomboaddluggage.page.scss'],
})
export class FlightcomboaddluggagePage implements OnInit {
  @ViewChild('slideTab') sliderTab: ElementRef | undefined;
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
  objectFlight
  constructor(public gf: GlobalFunction,public navCtrl: NavController,private zone: NgZone,public bookCombo:Bookcombo) { 
    this.objectFlight = this.gf.getParams('flightcombo');
    this.departLuggage= this.objectFlight.airLineLuggageDepart;
    this.returnLuggage= this.objectFlight.airLineLuggageReturn;
    if(this.departLuggage && this.departLuggage.length>0){
      this.departLuggage.forEach(element => {
        element.priceshow = "x "+ this.gf.convertNumberToString(element.Amount) +"đ";
        if(!element.quantity){
          element.quantity = 0;
        }else{
          this.totalprice += element.quantity * element.Amount;
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
        element.priceshow = "x "+ this.gf.convertNumberToString(element.Amount) +"đ";
        if(!element.quantity){
          element.quantity = 0;
        }else{
          this.totalprice += element.quantity * element.Amount;
          this.totalreturnquantity+= element.quantity;
          this.totalquantity+= element.quantity;
          this.hasReturnLuggage = true;
        }
      });
      if(this.totalreturnquantity >0){
        this.quantityreturndisplay = this.totalreturnquantity + " kiện";
      }
      
    }
    this.departConditionInfo=this.bookCombo.departConditionInfo;
    this.returnConditionInfo=this.bookCombo.returnConditionInfo;
    if(this.totalprice >0){
      this.totalpricedisplay = this.gf.convertNumberToString(this.totalprice) + "đ";
    }
  }

  ngOnInit() {
   
  }

  goback(){
    if(!this.hasDepartLuggage){
      if(this.departLuggage && this.departLuggage.length >0){
        this.departLuggage.forEach(element => {
            element.quantity = 0;
        });
      }
      
    }

    if(!this.hasReturnLuggage){
      if(this.returnLuggage && this.returnLuggage.length >0){
        this.returnLuggage.forEach(element => {
            element.quantity = 0;
        });
      }
      
    }

    this.navCtrl.navigateBack('/flightcomboreviews');
  }

  plusroom(item, isdepart) {
    this.zone.run(()=>{
      let maxluggagepax = this.objectFlight.FlightBooking.adult+this.objectFlight.FlightBooking.child;
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
        
        this.totalprice = this.departLuggage.reduce((total,b)=>{ return total + (b.quantity * b.Amount); }, 0);
        this.totalprice += this.returnLuggage.reduce((total,b)=>{ return total + (b.quantity * b.Amount); }, 0);
        this.totalpricedisplay = this.gf.convertNumberToString(this.totalprice) + "đ";

      }else{
        if(this.objectFlight.FlightBooking.infant){
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
        //this.totalprice = item.quantity * item.Amount;
        
        if(isdepart){
          this.totaldepartquantity--;
          this.quantitydisplay = this.totaldepartquantity >0 ? (this.totaldepartquantity + " kiện") : "Chưa chọn";
        }else{
          this.totalreturnquantity--;
          this.quantityreturndisplay = this.totalreturnquantity >0 ? (this.totalreturnquantity + " kiện") : "Chưa chọn";
        }
        this.totalprice = this.departLuggage.reduce((total,b)=>{ return total + (b.quantity * b.Amount); }, 0);
        this.totalprice += this.returnLuggage.reduce((total,b)=>{ return total + (b.quantity * b.Amount); }, 0);
        this.totalpricedisplay = this.gf.convertNumberToString(this.totalprice) +"đ";
      }
    })
    
  }
  confirm()
  {
    if(this.tabluggage ==1){
      this.SelectTab(2);
    }else{
      this.bookCombo.Luggage=this.totalprice;
      this.objectFlight.airLineLuggageDepart=this.departLuggage;
      this.objectFlight.airLineLuggageReturn=this.returnLuggage;
      this.gf.setParams(this.objectFlight,'flightcombo');
      this.bookCombo.itemFlightLuggagePriceChange.emit(true);
      this.navCtrl.navigateBack('/flightcomboreviews');
    }
      
  }
  slidetabchange(){
    // this.sliderTab?.nativeElement.getActiveIndex().then(index => {
    //   this.tabluggage = index+1;
    // });
    this.tabluggage = this.sliderTab?.nativeElement.swiper.activeIndex+1;
    this.contentFlightAddLuggage.scrollToTop(200);
  }

  SelectTab(tabindex){
    this.tabluggage = tabindex;
    this.sliderTab?.nativeElement.swiper.slideTo(tabindex-1);
    this.contentFlightAddLuggage.scrollToTop(200);
  }
}
