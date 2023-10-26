import { Bookcombo } from './../providers/book-service';
import { RoomInfo } from '../providers/book-service';
import { GlobalFunction } from './../providers/globalfunction';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { C } from '../providers/constants';
import * as moment from 'moment';
@Component({
  selector: 'app-combocarpaymentpayoonew',
  templateUrl: './combocarpaymentpayoonew.page.html',
  styleUrls: ['./combocarpaymentpayoonew.page.scss'],
})
export class CombocarpaymentpayoonewPage implements OnInit {
  bookingCode;stt;text;qrimg;BillingCode;PeriodPaymentDate
  intervalID: NodeJS.Timeout;priceshow;PriceAvgPlusTAStr;roomtype;sttbooking;listcars
  constructor(private navCtrl:NavController, public gf: GlobalFunction,
    private activatedRoute: ActivatedRoute,private Roomif:RoomInfo,private bookCombo:Bookcombo) { }

  ngOnInit() {
    this.bookingCode = this.activatedRoute.snapshot.paramMap.get('code');
    this.stt= this.activatedRoute.snapshot.paramMap.get('stt');
    this.sttbooking= this.activatedRoute.snapshot.paramMap.get('sttbooking');
    this.roomtype = this.Roomif.roomtype;
    this.PriceAvgPlusTAStr = this.roomtype.PriceAvgPlusTAStr;
    this.listcars = this.gf.getParams('carscombo');
    this.priceshow = this.bookCombo.totalprice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    if (this.stt=='0') {
      this.BillingCode=this.Roomif.BillingCode;
    }
    else
    {
      this.qrimg=this.Roomif.qrimg;
      this.intervalID = setInterval(() => {
        this.checkBooking(0);
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
      se.navCtrl.navigateForward('/combodone/'+se.bookingCode);
    }
    else
    {
      se.checkBooking(1);
    }

  }
  checkBooking(value) {
    var se = this;
    let strUrl = C.urls.baseUrl.urlPost + '/mCheckBooking?code='+se.bookingCode;
        let headers =  {};
        se.gf.RequestApi('GET', strUrl, headers, {}, 'combocarpaymentpayoonew', 'checkBooking').then((data) => {
      if (data) {
        var rs = data;
        if (rs.StatusBooking == 3) {
          var id = rs.BookingCode;
          var total = se.priceshow;
          se.Roomif.priceshowtt = se.priceshow;
          clearInterval(se.intervalID);
          se.navCtrl.navigateForward('/combodoneprepay/' + id + '/' + total + '/0');
        }
      }
      else {
        se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
      }
    });
  }
  CreateComboTransferBooking(value) {
    var se = this;
    var form = this.listcars;
    let strUrl = C.urls.baseUrl.urlContracting+'/api/ToolsAPI/CreateComboTransferBooking';
        let headers =  {'Content-Type': 'application/x-www-form-urlencoded'};
        se.gf.RequestApi('POST', strUrl, headers, form, 'combocarpaymentpayoonew', 'CreateComboTransferBooking').then((data) => {
      var obj = data;
      let strUrl = C.urls.baseUrl.urlContracting+ `/api/ToolsAPI/CreateTransactionIDComboTransfer?BookingCode=${obj.Code}&DepartATCode=${obj.TransferReserveCode.DepartReserveCode}&ReturnATCode=${obj.TransferReserveCode.ReturnReserveCode}&FromPlaceCode=${se.listcars.TransferBooking.fromPlaceCode}`;
        let headers =  {'Content-Type': 'application/x-www-form-urlencoded'};
        se.gf.RequestApi('POST', strUrl, headers, form, 'combocarpaymentpayoonew', 'CreateTransactionIDComboTransfer').then((data1) => {

        var json=data1;
        if (json.Error==0) {
          if (value==0) {
            se.navCtrl.navigateForward('/combodoneprepay/' + se.bookingCode + '/' + se.priceshow + '/0');
          } else {
            se.navCtrl.navigateForward('/combodone/'+obj.Code);
          }
          
        }
      });
    })
  }
}

