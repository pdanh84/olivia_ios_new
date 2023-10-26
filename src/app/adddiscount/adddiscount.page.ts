import { ModalController } from '@ionic/angular';
import { ValueGlobal, Bookcombo, Booking, RoomInfo, SearchHotel } from './../providers/book-service';
import { Component, OnInit, NgZone } from '@angular/core';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import { voucherService } from '../providers/voucherService';
import { flightService } from '../providers/flightService';
import { tourService } from '../providers/tourService';
import { Storage } from '@ionic/storage';
import { ticketService } from '../providers/ticketService';
@Component({
  selector: 'app-adddiscount',
  templateUrl: './adddiscount.page.html',
  styleUrls: ['./adddiscount.page.scss'],
})
export class AdddiscountPage implements OnInit {
  discountpromo: any;msg: any;ischecktext=3;ischeckerror=0;ischeckbtnpromo = false;promocode: any;
  error: number=-1;
  kmcode: any;
  loginuser: any;
  constructor(public zone: NgZone,public valueGlobal:ValueGlobal, public modalCtrl: ModalController,public bookCombo:Bookcombo,
    public gf: GlobalFunction,
    public _voucherService: voucherService,
    public _flightService: flightService,
    public _tourService: tourService,
    public booking: Booking,
    public Roomif: RoomInfo,
    public searchHotel: SearchHotel,
    private storage: Storage,public ticketService: ticketService) { 
      this.storage.get('auth_token').then(auth_token => {
        this.loginuser = auth_token;
       });
  }

  ngOnInit() {
  }
  closeModal()
  {
    this.modalCtrl.dismiss();
  }
  click()
  {
    this.ischecktext=3
  }

  applyVoucher(){
    if(this.promocode){
      this._voucherService.listPromoCode = [];
      this._voucherService.totalDiscountPromoCode = 0;
      this.kmcode = '';

      let arrcode = this.promocode.split(',');
      for (let index = 0; index < arrcode.length; index++) {
        let code = arrcode[index];
        this.promofunc(code).then((error)=>{
          if(index == arrcode.length -1 && !this.error){
            this.modalCtrl.dismiss({promocode: this.kmcode ||''});
          }
        })
        
      }
      
      
    }else{
      this.modalCtrl.dismiss();
    }
  }
  promofunc(code:any) :Promise<any>{
    var se = this;
    return new Promise((resolve, reject) => {
      if (code) {
        let coupondata:any;
        let bookingCode = '';
        if(se._voucherService.openFrom == 'flightaddservice' ){
          coupondata = { flight: { "tickets": this._flightService.itemFlightCache.roundTrip ? [
            {
              "flightNumber": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.flightNumber : se._flightService.itemFlightCache.itemFlightInternationalDepart.flightNumber ,
                  "airLineCode": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.airlineCode : se._flightService.itemFlightCache.itemFlightInternationalDepart.airline.replace(' ',''),
                  "departTime": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.departTime : se._flightService.itemFlightCache.itemFlightInternationalDepart.departTime,
                  "landingTime": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.landingTime : se._flightService.itemFlightCache.itemFlightInternationalDepart.landingTime,
                  "flightDuration": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.flightDuration : se._flightService.itemFlightCache.itemFlightInternationalDepart.flightDuration,
                  "fromPlaceCode": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.fromPlaceCode : se._flightService.itemFlightCache.itemFlightInternationalDepart.fromPlaceCode,
                  "toPlaceCode": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.toPlaceCode : se._flightService.itemFlightCache.itemFlightInternationalDepart.toPlaceCode,
                  "stops": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.stops : se._flightService.itemFlightCache.itemFlightInternationalDepart.stops,
                  "ticketClass": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.ticketClass : se._flightService.itemFlightCache.itemFlightInternationalDepart.ticketClass,
                  "fareBasis": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.ticketType : se._flightService.itemFlightCache.itemFlightInternationalDepart.ticketClass,
                  "jsonObject": ""
            },
            {
              "flightNumber": !se._flightService.itemFlightCache.isInternationalFlight ?se._flightService.itemFlightCache.returnFlight.flightNumber : se._flightService.itemFlightCache.itemFlightInternationalReturn.flightNumber,
                  "airLineCode": !se._flightService.itemFlightCache.isInternationalFlight ?se._flightService.itemFlightCache.returnFlight.airlineCode : se._flightService.itemFlightCache.itemFlightInternationalReturn.airline.replace(' ',''),
                  "departTime": !se._flightService.itemFlightCache.isInternationalFlight ?se._flightService.itemFlightCache.returnFlight.departTime : se._flightService.itemFlightCache.itemFlightInternationalReturn.departTime,
                  "landingTime": !se._flightService.itemFlightCache.isInternationalFlight ?se._flightService.itemFlightCache.returnFlight.landingTime : se._flightService.itemFlightCache.itemFlightInternationalReturn.landingTime,
                  "flightDuration": !se._flightService.itemFlightCache.isInternationalFlight ?se._flightService.itemFlightCache.returnFlight.flightDuration : se._flightService.itemFlightCache.itemFlightInternationalReturn.flightDuration,
                  "fromPlaceCode": !se._flightService.itemFlightCache.isInternationalFlight ?se._flightService.itemFlightCache.returnFlight.fromPlaceCode : se._flightService.itemFlightCache.itemFlightInternationalReturn.fromPlaceCode,
                  "toPlaceCode": !se._flightService.itemFlightCache.isInternationalFlight ?se._flightService.itemFlightCache.returnFlight.toPlaceCode : se._flightService.itemFlightCache.itemFlightInternationalReturn.toPlaceCode,
                  "stops": !se._flightService.itemFlightCache.isInternationalFlight ?se._flightService.itemFlightCache.returnFlight.stops : se._flightService.itemFlightCache.itemFlightInternationalReturn.stops,
                  "ticketClass": !se._flightService.itemFlightCache.isInternationalFlight ?se._flightService.itemFlightCache.returnFlight.ticketClass : se._flightService.itemFlightCache.itemFlightInternationalReturn.ticketClass,
                  "fareBasis": !se._flightService.itemFlightCache.isInternationalFlight ?se._flightService.itemFlightCache.returnFlight.ticketType : se._flightService.itemFlightCache.itemFlightInternationalReturn.ticketClass,
                  "jsonObject": ""
            }
          ] : 
          [
            {
              "flightNumber": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.flightNumber : se._flightService.itemFlightCache.itemFlightInternationalDepart.flightNumber ,
                  "airLineCode": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.airlineCode : se._flightService.itemFlightCache.itemFlightInternationalDepart.airline.replace(' ',''),
                  "departTime": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.departTime : se._flightService.itemFlightCache.itemFlightInternationalDepart.departTime,
                  "landingTime": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.landingTime : se._flightService.itemFlightCache.itemFlightInternationalDepart.landingTime,
                  "flightDuration": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.flightDuration : se._flightService.itemFlightCache.itemFlightInternationalDepart.flightDuration,
                  "fromPlaceCode": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.fromPlaceCode : se._flightService.itemFlightCache.itemFlightInternationalDepart.fromPlaceCode,
                  "toPlaceCode": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.toPlaceCode : se._flightService.itemFlightCache.itemFlightInternationalDepart.toPlaceCode,
                  "stops": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.stops : se._flightService.itemFlightCache.itemFlightInternationalDepart.stops,
                  "ticketClass": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.ticketClass : se._flightService.itemFlightCache.itemFlightInternationalDepart.ticketClass,
                  "fareBasis": !se._flightService.itemFlightCache.isInternationalFlight ? se._flightService.itemFlightCache.departFlight.ticketType : se._flightService.itemFlightCache.itemFlightInternationalDepart.ticketClass,
                  "jsonObject": ""
            }
          ],
          "totalAdult": se._flightService.itemFlightCache.adult,
          "totalChild": se._flightService.itemFlightCache.child,
          "totalInfant": se._flightService.itemFlightCache.infant
        ,
      } };
        bookingCode = 'VMB';
        }  else if(se._voucherService.openFrom == 'touradddetails'){
          coupondata = {
            "tour": {
              "tourId": se._tourService.itemDetail.tourDetailId,
              "totalAdult": se.searchHotel.adult,
              "totalChild": se.searchHotel.child,
              "jsonObject": "",
              "checkIn": se.searchHotel.CheckInDate,
              "checkOut": se.searchHotel.CheckOutDate
            }
          }
          bookingCode = 'TOUR';
        } 
        else if(se._voucherService.openFrom == 'ticketadddetails'){
          coupondata = {
            "vvc": {
              "experienceId": se.ticketService.itemTicketDetail.experienceId,
              "supplier": se.ticketService.bookingInfo.booking.supplierCode
            }
          };
          bookingCode = this.ticketService.itemTicketService.objbooking.bookingCode;
        }else{
          coupondata = {
            "hotel": {
              "hotelId": this.booking.HotelId,
              "roomName": this.booking.RoomName,
              "totalRoom": this.Roomif.roomnumber,
              "totalAdult": this.booking.Adults,
              "totalChild": this.booking.Child,
              "jsonObject": "",
              "checkIn": this.searchHotel.CheckInDate,
              "checkOut": this.searchHotel.CheckOutDate
            }
          };
          bookingCode = 'HOTEL';
        };
        let headers = {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
        };
        let body ;
        if(se._voucherService.openFrom == 'ticketadddetails')
        {
          body = { bookingCode: bookingCode,code: code, totalAmount: this.ticketService.bookingInfo.booking.totalPriceAfterDiscount,
          couponData: coupondata,
          };
        }else{
          body = { bookingCode: bookingCode,code: se.promocode, totalAmount: se._voucherService.openFrom == 'touradddetails' ? se._tourService.totalPrice : (!se._voucherService.isFlightPage? se.valueGlobal.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '') : (se._flightService.itemFlightCache.totalPrice || se._flightService.itemFlightInternational.fare.price)), comboDetailId: se.bookCombo.ComboId,
          couponData: coupondata,
          };
        }
      
        let strUrl = C.urls.baseUrl.urlMobile + '/api/data/validpromocode';
        se.gf.RequestApi('POST', strUrl, headers, body, 'AdddiscountPage', 'loadUserInfo').then((data) => {
          if (data.error==0) {
              se.discountpromo=data.data.orginDiscount ? data.data.orginDiscount : data.data.discount;
              se.msg=data.msg;
              se.ischecktext=0;
              se.ischeckerror=0;
              //se.modalCtrl.dismiss({promocode:se.promocode});
              if(data.data.type == 2 && !se.gf.checkExistsItemInArray(se._voucherService.listPromoCode, code, 'code') && !se._voucherService.voucherSelected.some((v: any) => v.type != 2)){
                se._voucherService.listPromoCode.push(code);
                se._voucherService.totalDiscountPromoCode += data.data.orginDiscount ? data.data.orginDiscount : data.data.discount;
                se._voucherService.listObjectPromoCode.push({code: code, name: data.data.program || '', title: data.msg, price: data.data.orginDiscount ? data.data.orginDiscount : data.data.discount});
                se.error = 0;
              }
              else if(se._voucherService.voucherSelected && se._voucherService.voucherSelected.length >0 && se._voucherService.voucherSelected.some((v: any) => v.type != data.data.type)){
                se.error = 1;
                se.ischeckerror=1;
                se.msg = "Chỉ hỗ trợ áp dụng nhiều voucher tiền mặt trên một đơn hàng, Coupon và Voucher khuyến mãi chỉ áp dụng một";
              }
              else if(data.data.type != 2 && (se._voucherService.voucherSelected && se._voucherService.voucherSelected.length ==0)){
                se.kmcode = code;
                se.error = 0;
              }else {
                se.error = 0;
              }
              //
              console.log(se._voucherService.listPromoCode);
              console.log(se._voucherService.totalDiscountPromoCode);
            }
          else if(data.error==1)
            {
              se.ischeckbtnpromo = false;
              se.msg=data.msg;
              se.discountpromo=0;
              se.ischecktext=1;
              se.ischeckerror=1;
              if(se.gf.checkExistsItemInArray(se._voucherService.listPromoCode, code, 'code')){
                se.gf.removeItemInArray(se._voucherService.listPromoCode, code);
              }
              se.error = data.error;
            }
          else if(data.error==2)
            {
              se.ischeckbtnpromo = false;
              se.msg=data.msg;
              se.discountpromo=0;
              se.ischecktext=2;
              se.ischeckerror=1;
              if(se.gf.checkExistsItemInArray(se._voucherService.listPromoCode, code, 'code')){
                se.gf.removeItemInArray(se._voucherService.listPromoCode, code);
              }
              se.error = data.error;
            }
          else if(data.error==3)
            {
              se.ischeckbtnpromo = false;
              se.msg=data.msg;
              se.discountpromo=0;
              se.ischecktext=2;
              se.ischeckerror=1;
              if(se.gf.checkExistsItemInArray(se._voucherService.listPromoCode, code, 'code')){
                se.gf.removeItemInArray(se._voucherService.listPromoCode, code);
              }
              se.error = data.error;
            }
          else {
              se.ischeckbtnpromo = false;
              se.msg=data.msg;
              se.discountpromo=0;
              se.ischecktext=2;
              se.ischeckerror=1;
              if(se.gf.checkExistsItemInArray(se._voucherService.listPromoCode, code, 'code')){
                se.gf.removeItemInArray(se._voucherService.listPromoCode, code);
              }
              se.error = data.error;
            }

            resolve(this.error);
        })
      }
    })
  }
  textchange() {
    this.ischeckbtnpromo = false;
    this.discountpromo=0;
    this.ischeckerror=0;
    this.msg="";
    this.ischecktext=3
  }
}
