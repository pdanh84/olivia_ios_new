import { Bookcombo, SearchHotel } from './../providers/book-service';
import { Component, NgZone, OnInit } from '@angular/core';
import {  NavController, LoadingController,Platform } from '@ionic/angular';
import { Booking, RoomInfo } from '../providers/book-service';

import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';
@Component({
  selector: 'app-combocarlive',
  templateUrl: './combocarlive.page.html',
  styleUrls: ['./combocarlive.page.scss'],
})
export class CombocarlivePage implements OnInit {

  text;
  public loader:any;listcars;hoten;phone;totalAdult;email;
  jti: any;
  constructor(public bookCombo: Bookcombo,public platform: Platform,public navCtrl: NavController, public Roomif: RoomInfo, public storage: Storage, public booking: Booking, public loadingCtrl: LoadingController,public gf: GlobalFunction, public zone: NgZone,
    public searchhotel: SearchHotel) {
    this.text = "<b>Văn phòng tại TP. Hồ Chí Minh:</b> Lầu 2, tòa nhà Saigon Prime, 107-109-111 Nguyễn Đình Chiểu, Phường 6, Quận 3, Thành phố Hồ Chí Minh<br />Thời gian làm việc:<br /><ul><li>Thứ 2 - Thứ 7: từ 07h30 đến 21h00</li><li>Chủ Nhật: từ 07h30 đến 20h00</li></ul><br /><b>Văn phòng tại Hà Nội:</b> Lầu 9, 70-72 Bà Triệu, Quận Hoàn Kiếm<br />Thời gian làm việc:<br /><ul ><li>Thứ 2 - Thứ 6: từ 07h30 đến 17h30</li></ul>";
    this.listcars = this.gf.getParams('carscombo');
    this.hoten=this.Roomif.hoten;
      this.phone=this.Roomif.phone
      this.totalAdult = bookCombo.totalAdult;
    this.storage.get('email').then(e => {
      if (e !== null) {
        this.email = e;
      }
    })
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
      }
    })
    //google analytic
    //gf.googleAnalytion('roompaymentlive','load','');
    this.gf.logEventFirebase('office',this.searchhotel, 'combocarbank', 'add_payment_info', 'Combo');
  }
  ngOnInit() {
  }
  CreateCombo() {
    var se = this;
    var form = this.listcars;
    form.HotelBooking.PaymentMethod="51";
      // var options = {
      //   method: 'POST',
      //   url: C.urls.baseUrl.urlContracting+'/api/ToolsAPI/CreateComboTransferBooking',
      //   headers:
      //   {
      //     'Content-Type': 'application/x-www-form-urlencoded'
      //   },
      //   form
      // };
      let headers=
      {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      let strUrl = C.urls.baseUrl.urlContracting+'/api/ToolsAPI/CreateComboTransferBooking';
        se.gf.RequestApi('POST', strUrl, headers, form, 'combocarlive', 'CreateCombo').then((data) => {
        var obj = data;
        // var options = {
        //   method: 'POST',
        //   url: C.urls.baseUrl.urlContracting+'/api/ToolsAPI/CreateTransactionIDComboTransfer',
        //   headers:
        //     {
        //       'Content-Type': 'application/x-www-form-urlencoded'
        //     },
        //   form:
        //   {
        //     BookingCode: obj.Code,
        //     DepartATCode: obj.TransferReserveCode.DepartReserveCode,
        //     ReturnATCode: obj.TransferReserveCode.ReturnReserveCode,
        //     FromPlaceCode: se.listcars.TransferBooking.fromPlaceCode
        //   }
        // };
        let headers=
        {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
        let form=
        {
          BookingCode: obj.Code,
          DepartATCode: obj.TransferReserveCode.DepartReserveCode,
          ReturnATCode: obj.TransferReserveCode.ReturnReserveCode,
          FromPlaceCode: se.listcars.TransferBooking.fromPlaceCode
        }
        let strUrl = C.urls.baseUrl.urlContracting+'/api/ToolsAPI/CreateTransactionIDComboTransfer';
          se.gf.RequestApi('POST', strUrl, headers, form, 'combocarlive', 'CreateCombo').then((data) => {
          se.loader.dismiss();
          var json=data;
          if (json.Error==0) {
            if(se.jti){
              var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=office&source=app&amount=' + se.bookCombo.totalprice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + obj.Code+ '&memberId=' + se.jti;
              se.gf.CreatePayoo(url);
            }
            se.navCtrl.navigateForward('/combodone/'+obj.Code);
          }
        });
      })
  }
  refreshToken() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'GET',
        //   url: C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims',
        //   headers:
        //   {
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json',
        //     authorization: text
        //   },
        // }
        let headers=
        {
          'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        };
        
        let strUrl = C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims';
          se.gf.RequestApi('GET', strUrl, headers, {}, 'combocarlive', 'refreshToken').then((data) => {
            var au = data;
            se.zone.run(() => {
              se.storage.remove('auth_token');
              se.storage.set('auth_token', au.auth_token);
              var decoded = jwt_decode<any>(au.auth_token);
              se.storage.remove('point');
              se.storage.set('point', decoded.point);
            })
          
        })
      }
    })
  }
  
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }
  goback(){
    this.navCtrl.back();
  }
  postapibook() {
    var se = this;
    se.presentLoading();
      // var options = {
      //   method: 'POST',
      //   url: C.urls.baseUrl.urlMobile + '/booking',
      //   headers:
      //   {
      //     apikey: 'sx25k7TABO6W4ULFjfxoJJaLjQr0wUGxYCph1TQiTBM',
      //     apisecret: 'wZH8vCalp5-ZsUzJiP1IP6V2beWUm0ej8G_25gzg2xg'
      //   },
      //   body:
      //   {
      //     departParams:
      //     {
      //       trip_code: this.listcars.TransferBooking.departTransfer.TransferNumber,
      //       total_seats: this.bookCombo.totalseatsdep,
      //       total_price: this.bookCombo.pricedep,
      //       code: '',
      //       dropoff_place: "",
      //       pickup_place: ""
      //     },
      //     returnParams:
      //     {
      //       trip_code: this.listcars.TransferBooking.returnTransfer.TransferNumber,
      //       total_seats: this.bookCombo.totalseatsret,
      //       total_price: this.bookCombo.priceret,
      //       code: '',
      //       pickup_place: '',
      //       dropoff_place: ''
      //     },
      //     customer_phone: se.phone,
      //     customer_name: se.hoten,
      //     customer_email: 'tc@ivivu.com',
      //     pay_status: 0
      //   },
      //   json: true
      // };
        let headers=
        {
          apikey: 'sx25k7TABO6W4ULFjfxoJJaLjQr0wUGxYCph1TQiTBM',
          apisecret: 'wZH8vCalp5-ZsUzJiP1IP6V2beWUm0ej8G_25gzg2xg'
        };
        let body =
        {
          departParams:
          {
            trip_code: this.listcars.TransferBooking.departTransfer.TransferNumber,
            total_seats: this.bookCombo.totalseatsdep,
            total_price: this.bookCombo.pricedep,
            code: '',
            dropoff_place: "",
            pickup_place: ""
          },
          returnParams:
          {
            trip_code: this.listcars.TransferBooking.returnTransfer.TransferNumber,
            total_seats: this.bookCombo.totalseatsret,
            total_price: this.bookCombo.priceret,
            code: '',
            pickup_place: '',
            dropoff_place: ''
          },
          customer_phone: se.phone,
          customer_name: se.hoten,
          customer_email: 'tc@ivivu.com',
          pay_status: 0
        }
        let strUrl = C.urls.baseUrl.urlMobile + '/booking';
          se.gf.RequestApi('POST', strUrl, headers, body, 'combocarlive', 'postapibook').then((data) => {
        if (data.status == 0) {
          var json = data;
          if (json.length > 0) {
            se.listcars.TransferBooking.departTransfer.ReservedTickets = JSON.stringify(json[0].data.reserve_Tickets);
            se.listcars.TransferBooking.returnTransfer.ReservedTickets = JSON.stringify(json[1].data.reserve_Tickets);
            var expiredtimedep=moment(json[0].data.reserve_Tickets.expired_time).format('YYYYMMDDHHmm');
            var expiredtimeret=moment(json[1].data.reserve_Tickets.expired_time).format('YYYYMMDDHHmm');
            
            if(Number(expiredtimedep)==Number(expiredtimeret))
            {
              se.Roomif.expiredtime=json[0].data.reserve_Tickets.expired_time;
            }
            else if(Number(expiredtimedep)>Number(expiredtimeret))
            {
              se.Roomif.expiredtime=json[1].data.reserve_Tickets.expired_time;
            }
            else if(Number(expiredtimedep)<Number(expiredtimeret))
            {
              se.Roomif.expiredtime=json[0].data.reserve_Tickets.expired_time;
            }
            var Seatsde = json[0].data.seats;
            var Seatsre = json[1].data.seats;
            var seatstextde = "";
            var seatstextre = "";
            for (let i = 0; i < Seatsde.length; i++) {
              if (i == Seatsde.length - 1) {
                seatstextde = seatstextde + Seatsde[i].seat_code;
              }
              else {
                seatstextde = seatstextde + Seatsde[i].seat_code + ',';
              }
            }
            for (let i = 0; i < Seatsre.length; i++) {
              if (i == Seatsre.length - 1) {
                seatstextre = seatstextre + Seatsre[i].seat_code;
              }
              else {
                seatstextre = seatstextre + Seatsre[i].seat_code + ',';
              }
            }
            se.listcars.TransferBooking.departTransfer.Seats = seatstextde;
            se.listcars.TransferBooking.returnTransfer.Seats = seatstextre;
            // se.listcars.TransferBooking.departTransfer.CancelPolicy = seatstextde;
            // se.listcars.TransferBooking.returnTransfer.CancelPolicy = seatstextre;
            var textfullname = se.hoten.split(' ')
            var FirstName;
            var LastName;
            if (textfullname.length > 2) {
              let name = '';
              for (let i = 1; i < textfullname.length; i++) {
                if (i == 1) {
                  name += textfullname[i];
                } else {
                  name += ' ' + textfullname[i];
                }
              }
              FirstName = textfullname[0];
              LastName = name;
            } else if (textfullname.length > 1) {
              FirstName = textfullname[0];
              LastName = textfullname[1];
            }
            else if (textfullname.length == 1) {
              FirstName = textfullname[0];
              LastName = "";
            }
            se.listcars.TransferBooking.passengerInfo.FirstName = FirstName;
            se.listcars.TransferBooking.passengerInfo.LastName = LastName;
            se.listcars.TransferBooking.passengerInfo.Email = se.email;
            se.listcars.TransferBooking.passengerInfo.MobileNumber = se.phone;
            se.listcars.HotelBooking.CPhone = se.phone;
            se.listcars.HotelBooking.LeadingName = se.hoten;
            se.listcars.HotelBooking.LeadingEmail = se.email;
            se.listcars.HotelBooking.LeadingPhone = se.phone;
            //se.CreateCombo();
            if(se.bookCombo.mealTypeRates.Supplier == 'SERI' && se.bookCombo.mealTypeRates.HotelCheckDetailTokenInternal){
              //Check allotment trước khi book
              se.gf.checkAllotmentSeri(
                se.booking.HotelId,
                se.bookCombo.mealTypeRates.RoomId,
                se.booking.CheckInDate,
                se.booking.CheckOutDate,
                se.bookCombo.mealTypeRates.TotalRoom,
                'SERI', se.bookCombo.mealTypeRates.HotelCheckDetailTokenInternal
                ).then((allow)=> {
                  if(allow){
                    se.CreateCombo();
                  }else{
                    if (se.loader) {
                      se.loader.dismiss();
                    }
                    se.gf.showToastWarning('Hiện tại khách sạn đã hết phòng loại này.');
                  }
                })
            }else{
              se.CreateCombo();
            }
  
          } else {
            se.loader.dismiss();
            se.gf.showAlertMessageOnly("Không còn ghế xe, vui lòng chọn Nhà xe khác!");
            se.navCtrl.navigateForward('/combocarnew');
          }
        }
        else {
          se.loader.dismiss();
          se.gf.showAlertMessageOnly("Không còn ghế xe, vui lòng chọn Nhà xe khác!");
          se.navCtrl.navigateForward('/combocarnew');
        }
  
      });
  }
  CreateBuildLink(){
    var se = this;
    var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=office&source=app&amount=' + this.bookCombo.totalprice + '&orderCode=' + se.Roomif.bookingCode + '&buyerPhone=' + this.Roomif.phone + '&callbackUrl=android-app%3A%2F%2FiVIVU.com%2F';
    this.gf.CreateUrl(url).then(dataBuildLink => {
      if (this.loader) {
        this.loader.dismiss();
      }
      se.navCtrl.navigateForward('/combodone/'+this.Roomif.bookingCode);
    })
  }

}
