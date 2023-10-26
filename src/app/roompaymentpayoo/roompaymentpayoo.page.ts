import { RoomInfo, SearchHotel } from '../providers/book-service';
import { GlobalFunction } from './../providers/globalfunction';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { C } from '../providers/constants';
import * as moment from 'moment';

@Component({
  selector: 'app-roompaymentpayoo',
  templateUrl: './roompaymentpayoo.page.html',
  styleUrls: ['./roompaymentpayoo.page.scss'],
})
export class RoompaymentpayooPage implements OnInit {

  bookingCode;stt;text;qrimg;BillingCode;PeriodPaymentDate;payment
  intervalID: NodeJS.Timeout;priceshow;PriceAvgPlusTAStr;roomtype;sttbooking
  constructor(private navCtrl:NavController, public gf: GlobalFunction,
    private activatedRoute: ActivatedRoute,private Roomif:RoomInfo,
    public searchhotel: SearchHotel) { }

  ngOnInit() {
    this.bookingCode = this.activatedRoute.snapshot.paramMap.get('code');
    this.stt= this.activatedRoute.snapshot.paramMap.get('stt');
    this.sttbooking= this.activatedRoute.snapshot.paramMap.get('sttbooking');
    this.roomtype = this.Roomif.roomtype;
    this.PriceAvgPlusTAStr = this.roomtype.PriceAvgPlusTAStr;
    if (this.Roomif.priceshow) {
      this.priceshow = this.Roomif.priceshow;
    }
    else {
      this.priceshow = this.PriceAvgPlusTAStr;
    }
    if (this.stt=='0') {
      this.BillingCode=this.Roomif.BillingCode;
    }
    else
    {
      this.qrimg=this.Roomif.qrimg;
      this.intervalID = setInterval(() => {
        this.checkBooking(0);
      }, 1000 * 1);
      setTimeout(() => {
        clearInterval(this.intervalID);
      }, 60000 * 15);
    }
    this.PeriodPaymentDate=moment(this.Roomif.PeriodPaymentDate).format('HH:mm DD/MM/YYYY');
    this.gf.logEventFirebase('payoo',this.searchhotel, 'roompaymentpayoo', 'add_payment_info', 'Hotels');
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
      if (this.Roomif.payment) {
        this.payment="AL";
      }
      else{
        this.payment="RQ";
      }
      se.navCtrl.navigateForward('/roompaymentdone/'+se.bookingCode+'/'+this.payment);
    }
    else
    {
      se.checkBooking(1);
    }

  }
  checkBooking(value) {
    var se = this;
    // var options = {
    //   method: 'GET',
    //   url: C.urls.baseUrl.urlPost + '/mCheckBooking',
    //   qs: { code: se.bookingCode },
    //   headers:
    //   {
    //   }
    // };
    let headers = {};
    let strUrl = C.urls.baseUrl.urlPost + '/mCheckBooking?code='+ se.bookingCode;
    this.gf.RequestApi('GET', strUrl, headers, {}, 'roompaymentpayoo', 'checkBooking').then((data)=>{
      if (data) {
        var rs = data;
        if (rs.StatusBooking == 3) {
          var id = rs.BookingCode;
          var total = se.priceshow;
          se.Roomif.priceshowtt = se.priceshow;
          clearInterval(se.intervalID);
          se.navCtrl.navigateForward('/roompaymentdoneean/' + id + '/' + total + '/0');
        }
      }
      else {
        // error.page = "roompaymentselect";
        // error.func = "openWebpage";
        // error.param = JSON.stringify(options);
        // C.writeErrorLog(error, response);
        se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
      }
    });
  }
}
