import { Component,OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NavController,Platform, ModalController, ActionSheetController, PickerController } from '@ionic/angular';
import { SearchHotel } from '../providers/book-service';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import { ValueGlobal } from '../providers/book-service';
import * as $ from 'jquery';
import { flightService } from '../providers/flightService';
import * as moment from 'moment';
/**
 * Generated class for the OccupancyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-flightaddseat',
  templateUrl: 'flightaddseat.page.html',
  styleUrls: ['flightaddseat.page.scss'],
})
export class FlightaddseatPage implements OnInit {
@ViewChild('slideTab') sliderTab: ElementRef | undefined;
slideOpts = {
  loop: false,
  slidesPerView: 1,
  centeredSlides: false,
  spaceBetween: 10,
  zoom: {
    toggle: false
  }
};
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
  departSeat: any=[];
  returnSeat: any=[];
  quantitydisplay = "Chưa chọn";
  quantityreturndisplay ="Chưa chọn" ;
  totalprice: number=0;
  totalquantity=0;
  totaldepartquantity: any=0;
  totalreturnquantity: any=0;
  tabseat = 1;
  totalpricedisplay = "0đ";
  totalreturnpricedisplay = "0đ";
  listdepartseatselected = "";
  listreturnseatselected="";
  listSeatNameLeft =['A','B','C'];
  listSeatNameRight =['D','E','F'];

    totalreturnprice: any =0;
    listSeatNormal:any= [];
    listReturnSeatNormal:any=[];

    departSeatChoice:any = [];
    returnSeatChoice:any = [];
    departnewmodel = false;
    returnnewmodel = false;
  departCabinDetails: any;
  listSeatName: any;
  listReturnSeatName: any;
  roundtrip: any;
  haschoiceseat: boolean;
  haschoiceseatreturn: any;
  listSeatRollback:any = [];
  listReturnSeatRollback:any = [];
  departSeatTemp:any= [];
  returnSeatTemp:any= [];
  constructor(public platform: Platform,public navCtrl: NavController, public modalCtrl: ModalController,public valueGlobal:ValueGlobal,
    public searchhotel: SearchHotel, public gf: GlobalFunction,
    public actionsheetCtrl: ActionSheetController,
    public pickerController: PickerController,
    private zone: NgZone,
    public _flightService: flightService) {
      this.roundtrip = this._flightService.itemFlightCache.roundTrip;
    if(this._flightService.itemFlightCache.isnewmodelseat || this._flightService.itemFlightCache.isnewmodelreturnseat ){
        if(this._flightService.itemFlightCache.isnewmodelseat){
          this.departnewmodel = true;
          this.listSeatName = this._flightService.itemFlightCache.listSeatName;
          if(this.listSeatName && this.listSeatName.indexOf('-1') == -1){
            this.listSeatName.splice(3,0,'-1');
            this.listSeatName.splice(7,0,'-1');
          }
        }

        this.listSeatNormal = this._flightService.itemFlightCache.listSeatNormal;
        if(this._flightService.itemFlightCache.isnewmodelreturnseat){
          this.listReturnSeatName = this._flightService.itemFlightCache.listReturnSeatName;
          if(this.listReturnSeatName && this.listReturnSeatName.indexOf('-1') == -1){
            this.listReturnSeatName.splice(3,0,'-1');
            this.listReturnSeatName.splice(7,0,'-1');
          }
          this.returnnewmodel = true;
        }
        this.listReturnSeatNormal = this._flightService.itemFlightCache.listReturnSeatNormal;
    }
    else if((this._flightService.itemFlightCache.listSeatNormal && this._flightService.itemFlightCache.listSeatNormal.length >0) || (this._flightService.itemFlightCache.listReturnSeatNormal && this._flightService.itemFlightCache.listReturnSeatNormal.length >0) ){
      this.listSeatNormal = this._flightService.itemFlightCache.listSeatNormal;
      this.listReturnSeatNormal = this._flightService.itemFlightCache.listReturnSeatNormal;

    }
    if(this._flightService.itemFlightCache.listdepartseatselected || this._flightService.itemFlightCache.listreturnseatselected){
      
      this.totalquantity = this._flightService.itemFlightCache.departSeatChoice.length;
      this.totalreturnprice = this._flightService.itemFlightCache.returnSeatChoice.length;
        this.departSeatChoice = [...this._flightService.itemFlightCache.departSeatChoice];
        this.returnSeatChoice = [...this._flightService.itemFlightCache.returnSeatChoice];
        if(this.departSeatChoice && this.departSeatChoice.length >0){
          this.haschoiceseat = true;
        }
        if(this.returnSeatChoice && this.returnSeatChoice.length >0){
          this.haschoiceseatreturn = true;
        }
        this.listdepartseatselected = this._flightService.itemFlightCache.listdepartseatselected;
        this.listreturnseatselected = this._flightService.itemFlightCache.listreturnseatselected;
        this.totalprice = this._flightService.itemFlightCache.departSeatChoiceAmout;
        this.totalreturnprice = this._flightService.itemFlightCache.returnSeatChoiceAmout;

        this.totalpricedisplay = this.gf.convertNumberToString(this.totalprice) +"đ";
        this.totalreturnpricedisplay = this.gf.convertNumberToString(this.totalreturnprice) +"đ";
       
    }
   
  }

  ngOnInit() {
    this._flightService.itemFlightReChoiceSeat.subscribe((data)=>{
      if(data){
        if(this.departSeatChoice && this.departSeatChoice.length >0){
          this.departSeatChoice.forEach((s) => {
            s.booked = false;
          })
          this.departSeatChoice = [];
          this.listdepartseatselected="";
        } 

        if(this.returnSeatChoice && this.returnSeatChoice.length >0){
          this.returnSeatChoice.forEach((s) => {
            s.booked = false;
          })
          this.returnSeatChoice = [];
          this.listreturnseatselected ="";
        }

        this.totalprice = 0;
        this.totalreturnprice = 0;

        this.totalpricedisplay = "0đ";
        this.totalreturnpricedisplay = "0đ";

      }
      (this.listSeatNormal as any).sort((a, b) => {
        a.row < b.row ? -1 : 1;
      })
    })
  }

  goback(){
    
    this.departSeatChoice = this._flightService.itemFlightCache.departSeatChoice;
    this.listdepartseatselected =  this._flightService.itemFlightCache.listdepartseatselected;
    this.totalprice =  this._flightService.itemFlightCache.departSeatChoiceAmout;

    this.returnSeatChoice = this._flightService.itemFlightCache.returnSeatChoice;
    this.listreturnseatselected =  this._flightService.itemFlightCache.listreturnseatselected;
    this.totalreturnprice =  this._flightService.itemFlightCache.returnSeatChoiceAmout;
    //Tích chọn lại item đi đã chọn khi back về mà chưa xác nhận
      if(this.listSeatRollback && this.listSeatRollback.length >0)
      {
          this.listSeatRollback.forEach((item) => {
            if(this._flightService.itemFlightCache.listdepartseatselected && this._flightService.itemFlightCache.listdepartseatselected.indexOf(item.name) != -1){
              item.booked = true;
            }
          })
      }
      //Bỏ tích chọn item đi chọn khi back về nhưng chưa xác nhận
      if(this.departSeatTemp && this.departSeatTemp.length >0)
      {
          this.departSeatTemp.forEach((item) => {
            if(this._flightService.itemFlightCache.listdepartseatselected && this._flightService.itemFlightCache.listdepartseatselected.indexOf(item.name) == -1){
              item.booked = false;
            }
            else if(!this._flightService.itemFlightCache.listdepartseatselected && (!this.departSeatChoice || this.departSeatChoice.length ==0)){
              item.booked = false;
            }
          })

          

      }
    //Tích chọn lại item về đã chọn khi back về mà chưa xác nhận
      if(this.listReturnSeatRollback && this.listReturnSeatRollback.length >0)
      {
          this.listReturnSeatRollback.forEach((item) => {
            if(this._flightService.itemFlightCache.listreturnseatselected && this._flightService.itemFlightCache.listreturnseatselected.indexOf(item.name) != -1){
              item.booked = true;
            }
            
          })
      }
       //Bỏ tích chọn item về chọn khi back về nhưng chưa xác nhận
       if(this.returnSeatTemp && this.returnSeatTemp.length >0)
       {
           this.returnSeatTemp.forEach((item) => {
             if(this._flightService.itemFlightCache.listreturnseatselected && this._flightService.itemFlightCache.listreturnseatselected.indexOf(item.name) == -1){
               item.booked = false;
             }
             else if(!this._flightService.itemFlightCache.listreturnseatselected && (!this.returnSeatChoice || this.returnSeatChoice.length ==0)){
              item.booked = false;
            }
           })
       }

      if(!this.haschoiceseat){
        if(this.departSeatChoice && this.departSeatChoice.length >0){
          this.departSeatChoice.forEach((s) => {
            s.booked = false;
          })
          this.departSeatChoice = [];
          this.listdepartseatselected="";
        }
    
      }

      if(this.departSeatChoice && this.departSeatChoice.length >0){
        this.departSeatChoice.forEach((s) => {
          if(this._flightService.itemFlightCache.listdepartseatselected.indexOf(s.name) == -1){
            s.booked = false;
          }
        })
      }


    if(!this.haschoiceseatreturn){
        if(this.returnSeatChoice && this.returnSeatChoice.length >0){
          this.returnSeatChoice.forEach((s) => {
            s.booked = false;
          })
          this.returnSeatChoice = [];
          this.listreturnseatselected ="";
        }
      }

      if(this.returnSeatChoice && this.returnSeatChoice.length >0){
       
        this.returnSeatChoice.forEach((s) => {
          if(this._flightService.itemFlightCache.listreturnseatselected.indexOf(s.name) == -1){
            s.booked = false;
          }
        })
       
      }
      
    this.navCtrl.navigateBack('/flightaddservice');
  }

  plusroom(item, isdepart) {
    this.zone.run(()=>{
      let maxseat = (this._flightService.itemFlightCache.pax - (this._flightService.itemFlightCache.infant ? this._flightService.itemFlightCache.infant : 0) );
      if(this.totalquantity < maxseat){
        item.quantity++;
        this.totalquantity++;
        this.totalprice += item.quantity * item.amount;
        this.totalpricedisplay = this.gf.convertNumberToString(this.totalprice) + "đ";
        if(isdepart){
          this.totaldepartquantity++;
          this.quantitydisplay = this.totaldepartquantity + " kiện";
        }else{
          this.totalreturnquantity++;
          this.quantityreturndisplay = this.totalreturnquantity + " kiện";
        }
        
      }else{
        this.gf.showToastWarning("Số chỗ ngồi không được vượt quá số khách. Xin vui lòng kiểm tra lại!");
      }
    })
    
  }
  minusroom(item, isdepart) {
    this.zone.run(()=>{
      if (item.quantity >= 1) {
        
        this.totalprice -= item.quantity * item.amount;
        this.totalpricedisplay = this.gf.convertNumberToString(this.totalprice) +"đ";
        if(isdepart){
          this.totaldepartquantity--;
          this.quantitydisplay = this.totaldepartquantity >0 ? (this.totaldepartquantity + " kiện") : "Chưa chọn";
        }else{
          this.totalreturnquantity--;
          this.quantityreturndisplay = this.totalreturnquantity >0 ? (this.totalreturnquantity + " kiện") : "Chưa chọn";
        }

        item.quantity--;
        this.totalquantity--;
      }
    })
    
  }
  confirm()
  {
    this._flightService.itemFlightCache.departSeatChoice = [...this.departSeatChoice];
    this._flightService.itemFlightCache.returnSeatChoice = [...this.returnSeatChoice];
    this._flightService.itemFlightCache.listdepartseatselected = this.listdepartseatselected;
    this._flightService.itemFlightCache.listreturnseatselected = this.listreturnseatselected;
    this._flightService.itemFlightCache.departSeatChoiceAmout = this.totalprice;
    this._flightService.itemFlightCache.returnSeatChoiceAmout = this.totalreturnprice;
    this._flightService.itemFlightCache.listSeatNormal = this.listSeatNormal;
    this._flightService.itemFlightCache.listReturnSeatNormal = this.listReturnSeatNormal;
      this._flightService.itemFlightSeatPriceChange.emit(true);
      if(this.departSeatChoice && this.departSeatChoice.length >0){
          this.haschoiceseat = true;
      }
      if(this.returnSeatChoice && this.returnSeatChoice.length >0){
        this.haschoiceseatreturn = true;
      }
      if(this.tabseat ==1 && this.listReturnSeatNormal && this.listReturnSeatNormal.length >0){
        this.SelectTab(2);
      }else{
        this.navCtrl.navigateBack('/flightaddservice');
      }
  }

  choiceSeat(seat,tabindex){
    let airlinecode = (tabindex == 1 ? this._flightService.itemFlightCache.departFlight.airlineCode : this._flightService.itemFlightCache.returnFlight.airlineCode);
    let seatname = seat.name.substring(0, seat.name.length-1);
      if(seat.type == 5){
        this.gf.showToastWarning('Ghế đã được chọn. Vui lòng chọn ghế khác!');
        return;
      }
      if(seat.type == 3 && this._flightService.itemFlightCache.infant){
        this.gf.showToastWarning('Ghế hạn chế khi có trẻ nhỏ đi cùng. Vui lòng chọn ghế khác!');
        return;
      }
      //Loại ghế gần cửa thoát hiểm
      if(seat.type == 3){
        this.gf.showToastWarning('Ghế hạn chế. Vui lòng chọn ghế khác!');
        return;
      }
      //VJ loại ghế thứ 3
      if(seat.type == 6){
        this.gf.showToastWarning('Ghế hạn chế. Vui lòng chọn ghế khác!');
        return;
      }
      //Loại item ảo
      if(seat.type == -1 || seat.type == -2){
        return;
      }
      this.zone.run(()=>{
          if(!seat.booked){
            if(this.checkPax()){
              seat.booked = true;
              if(tabindex ==1){
                  this.listdepartseatselected += this.listdepartseatselected.length ==0 ? seat.name : (", " +seat.name);
              }else{
                  this.listreturnseatselected += this.listreturnseatselected.length ==0 ? seat.name : (", " + seat.name);
              }
         
              if(tabindex ==1){
                this.departSeatTemp.push(seat);
                  this.totalprice += seat.amount;
                  this.totalpricedisplay = this.gf.convertNumberToString(this.totalprice) +"đ";
                  this.departSeatChoice.push(seat);
              }else{
                this.returnSeatTemp.push(seat);
                  this.totalreturnprice += seat.amount;
                  this.totalreturnpricedisplay = this.gf.convertNumberToString(this.totalreturnprice) +"đ";
                  this.returnSeatChoice.push(seat);
              }
            }
          }else{
            seat.booked = false;
            let textreplace =", "+seat.name;
            if(this.listdepartseatselected.indexOf(textreplace) != -1 || this.listreturnseatselected.indexOf(textreplace) != -1 ){
                if(tabindex ==1){
                    this.listdepartseatselected = this.listdepartseatselected.replace(textreplace,"");
                }else{
                    this.listreturnseatselected = this.listreturnseatselected.replace(textreplace,"");
                }
            }
            if(this.listdepartseatselected.indexOf(seat.name+", ") != -1 || this.listreturnseatselected.indexOf(seat.name+", ") != -1){
                
                if(tabindex ==1){
                    this.listdepartseatselected = this.listdepartseatselected.replace(seat.name+", ","");
                }else{
                    this.listreturnseatselected = this.listreturnseatselected.replace(seat.name+", ","");
                }
            }
            if(this.listdepartseatselected.indexOf(seat.name) != -1 || this.listreturnseatselected.indexOf(seat.name) != -1){
                
                if(tabindex ==1){
                    this.listdepartseatselected = this.listdepartseatselected.replace(seat.name,"");
                }else{
                    this.listreturnseatselected = this.listreturnseatselected.replace(seat.name,"");
                }
            }

            if(tabindex ==1){
               this.listSeatRollback.push(seat);
                this.totalprice -= seat.amount;
                this.totalpricedisplay = this.gf.convertNumberToString(this.totalprice) +"đ";
                this.gf.removeItemInArrayByName(this.departSeatChoice, seat);
            }else{
               this.listReturnSeatRollback.push(seat);
                this.totalreturnprice -= seat.amount;
                this.totalreturnpricedisplay = this.gf.convertNumberToString(this.totalreturnprice) +"đ";
                this.gf.removeItemInArrayByName(this.returnSeatChoice, seat);
            }
          }
      })
  }

  slidetabchange(){
    // this.sliderTab?.nativeElement.getActiveIndex().then(index => {
    //   this.tabseat = index+1;
    // });
    this.tabseat =this.sliderTab?.nativeElement.swiper.activeIndex+1;
  }

  SelectTab(tabindex){
    this.tabseat = tabindex;
    this.sliderTab?.nativeElement.swiper.slideTo(tabindex-1);
  }

  checkPax(){
    let maxseat = (this._flightService.itemFlightCache.pax - (this._flightService.itemFlightCache.infant ? this._flightService.itemFlightCache.infant : 0) );
      if(this.departSeatChoice.length == maxseat && this.tabseat ==1){
        if(this._flightService.itemFlightCache.infant){
          this.gf.showToastWarning("Không chọn ghế cho em bé. Vui lòng kiểm tra lại!");
        }else{
          this.gf.showToastWarning("Số ghế không được vượt quá số khách. Vui lòng kiểm tra lại!");
        }
          return false;
      }

      if(this.returnSeatChoice.length == maxseat && this.tabseat ==2){
        if(this._flightService.itemFlightCache.infant){
          this.gf.showToastWarning("Không chọn ghế cho em bé. Vui lòng kiểm tra lại!");
        }else{
          this.gf.showToastWarning("Số ghế không được vượt quá số khách. Vui lòng kiểm tra lại!");
        }
        return false;
    }
      return true;
  }
}