import { Bookcombo } from './../providers/book-service';
import { RoomInfo } from '../providers/book-service';
import { GlobalFunction } from './../providers/globalfunction';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { C } from '../providers/constants';
import * as moment from 'moment';
@Component({
  selector: 'app-flightcombopaymentpayoonew',
  templateUrl: './flightcombopaymentpayoonew.page.html',
  styleUrls: ['./flightcombopaymentpayoonew.page.scss'],
})
export class FlightcombopaymentpayoonewPage implements OnInit {

  bookingCode;stt;text;qrimg;BillingCode;PeriodPaymentDate
  intervalID: NodeJS.Timeout;priceshow;PriceAvgPlusTAStr;roomtype;sttbooking
  constructor(private navCtrl:NavController, public gf: GlobalFunction,
    private activatedRoute: ActivatedRoute,private Roomif:RoomInfo,private bookCombo: Bookcombo) { }

  ngOnInit() {
    this.bookingCode = this.activatedRoute.snapshot.paramMap.get('code');
    this.stt= this.activatedRoute.snapshot.paramMap.get('stt');
    this.sttbooking= this.activatedRoute.snapshot.paramMap.get('sttbooking');
    this.priceshow = this.bookCombo.totalprice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    if (this.stt=='0') {
      this.BillingCode=this.Roomif.BillingCode;
    }
    else
    {
      this.qrimg=this.Roomif.qrimg;
      this.intervalID = setInterval(() => {
        this.checkBooking();
      }, 1000 * 5);
      setTimeout(() => {
        clearInterval(this.intervalID);
      }, 60000 * 15);
    }
    this.PeriodPaymentDate=moment(this.Roomif.PeriodPaymentDate).format('HH:mm DD/MM/YYYY');
  }
  goback()
  {
    if (this.stt=='1') {
      clearInterval(this.intervalID);
    }
    this.navCtrl.back();
  }
  next()
  {
    var se=this;
    clearInterval(this.intervalID);
    if (this.stt=='0') {
      se.Roomif.priceshowtt = se.priceshow;
      if(se.Roomif.payment=='AL' &&  se.bookCombo.DepartATCode  && se.bookCombo.ReturnATCode){
        se.navCtrl.navigateForward('/flightcombopaymentdone/AL');
      }
      else{
        se.navCtrl.navigateForward('/flightcombopaymentdone/RQ');
      }
    }
    else
    {
      se.checkBooking();
    }
  }
  checkBooking() {
    var se = this;
    // var options = {
    //   method: 'GET',
    //   url: C.urls.baseUrl.urlPost + '/mCheckBooking',
    //   qs: { code: se.bookingCode },
    //   headers:
    //   {
    //   }
    // };
    let headers = {
      "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
        'Content-Type': 'application/json; charset=utf-8'
    };
    let strUrl = C.urls.baseUrl.urlPost + '/mCheckBooking?code=' + se.bookingCode;
    this.gf.RequestApi('GET', strUrl, headers, {}, 'flightComboPaymentDone', 'checkBooking').then((data)=>{

      if (data) {
        var rs = data;
        if (rs.StatusBooking == 3) {
          var id = rs.BookingCode;
          var total = se.priceshow;
          se.Roomif.priceshowtt = se.priceshow;
          clearInterval(se.intervalID);
          if(se.Roomif.payment=='AL' && se.bookCombo.DepartATCode &&  se.bookCombo.ReturnATCode){
            se.navCtrl.navigateForward('/flightcombodoneprepay/' + id + '/' + total + '/0')
          }
          else{
            se.navCtrl.navigateForward('/flightcombopaymentdone/RQ');
          }
        }
      }
      else {
        se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
      }
    });
  }
  callCheckHoldTicket(url) {
    var res = false;
    return new Promise((resolve, reject) => {
      // var options = {
      //   method: 'GET',
      //   url: url,
      //   timeout: 180000, maxAttempts: 5, retryDelay: 20000,
      //   headers: {
      //     "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
      //     'Content-Type': 'application/json; charset=utf-8',
      //   },
      // };
      let headers = {
        "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          'Content-Type': 'application/json; charset=utf-8'
      };
      this.gf.RequestApi('GET', url, headers, {}, 'flightComboPaymentDone', 'callCheckHoldTicket').then((data)=>{

        if (data) {
          let result = data;
          if (result.isRoundTrip) {//khứ hồi
            //Có mã giữ chỗ và trạng thái đã xuất vé cả 2 chiều thì trả về true - hoàn thành
            if (result.departFlight.atBookingCode != null && result.departFlight.atBookingCode.indexOf("T__") == -1 && result.returnFlight.atBookingCode != null && result.returnFlight.atBookingCode.indexOf("T__") == -1
              && result.departFlight.status == 4 && result.returnFlight.status == 4) {
              resolve(true);
            } else {
              resolve(false);
            }
          } else {//Có mã giữ chỗ và trạng thái đã xuất vé thì trả về true - hoàn thành
            if (result.departFlight.atBookingCode != null && result.departFlight.atBookingCode.indexOf("T__") == -1 && result.departFlight.status == 4) {
              resolve(true);
            } else {
              resolve(false);
            }
          }
        }
      })
    })
  }

}
