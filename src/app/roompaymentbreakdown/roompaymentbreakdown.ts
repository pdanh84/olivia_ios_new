import { ActivatedRoute } from '@angular/router';
import { SearchHotel } from '../providers/book-service';
import { Component, OnInit } from '@angular/core';
import { NavController,Platform } from '@ionic/angular';
import { RoomInfo } from '../providers/book-service';
import { GlobalFunction } from '../providers/globalfunction';
import { voucherService } from '../providers/voucherService';
/**
 * Generated class for the RoompaymentbreakdownPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'app-roompaymentbreakdown',
  templateUrl: 'roompaymentbreakdown.html',
  styleUrls: ['roompaymentbreakdown.scss'],
})
export class RoompaymentbreakdownPage implements OnInit{
  Name; room; imgroom; breakfast; dur; price; PriceAvgMinPriceStr; roomnumber
  PriceAvgPlusOTAStr; roomtype; ExtraBedAndGalaDinerList; phuthu; PriceOTA; total; arr:any = []
  totalPrice: any;
  constructor(public platform: Platform, public activatedRoute: ActivatedRoute, public navCtrl: NavController, public searchHotel: SearchHotel, public Roomif: RoomInfo, public gf: GlobalFunction,
    public _voucherService: voucherService) {
    this.room = this.Roomif.arrroom;
    this.dur = this.activatedRoute.snapshot.paramMap.get('dur');
    this.roomnumber = this.activatedRoute.snapshot.paramMap.get('roomnumber');
    this.roomtype = this.Roomif.roomtype
    this.total = this.roomtype.PriceAvgPlusTAStr;
    this.totalPrice = this.gf.convertStringToNumber(this.roomtype.PriceAvgPlusTAStr);
    this.imgroom = this.Roomif.imgRoom;
    var str = this.imgroom;
    if (str) {
      var res = str.substr(0, 4);
      if (res != "http") {
        this.imgroom = 'https:' + this.imgroom;
      }
    }
    else {
      this.imgroom = 'https://cdn1.ivivu.com/img/noimage.jpg';
    }
    this.Name = this.room[0].ClassName;
    this.breakfast = this.roomtype.Name;

    this.ExtraBedAndGalaDinerList = this.roomtype.ExtraBedAndGalaDinerList

    if (this.ExtraBedAndGalaDinerList.length > 0) {
    
      this.phuthu = this.ExtraBedAndGalaDinerList[0].NameDisplay;
      //this.PriceOTA=this.ExtraBedAndGalaDinerList[0].PriceOTA*this.dur;
      this.PriceAvgMinPriceStr = this.roomtype.PriceAvgDefaultTA;
      this.PriceAvgPlusOTAStr = this.PriceAvgMinPriceStr * this.dur * this.roomnumber;
      // this.total= (this.PriceAvgPlusOTAStr+ this.PriceOTA).toLocaleString();
      this.PriceAvgMinPriceStr = this.PriceAvgMinPriceStr.toLocaleString();
      this.PriceAvgPlusOTAStr = this.PriceAvgPlusOTAStr.toLocaleString();
      for (var i = 0; i < this.ExtraBedAndGalaDinerList.length; i++) {
        var price="";
        if (this.ExtraBedAndGalaDinerList[i].ChargeType == "Per Night" || this.ExtraBedAndGalaDinerList[i].ChargeType == "Per Bed" || this.ExtraBedAndGalaDinerList[i].ChargeType == "Per Meal WithoutNo") {
          // totalExtraBedAndGalaDinerListOTA += mealType.ExtraBedAndGalaDinerList[i].Quantity.value * mealType.ExtraBedAndGalaDinerList[i].PriceOTA * $scope.RoomsPrice.TotalNight;
          price += (this.ExtraBedAndGalaDinerList[i].Quantity.value * this.ExtraBedAndGalaDinerList[i].PriceOTA * this.dur).toLocaleString();
          
          // totalExtraBedAndGalaDinerList += mealType.ExtraBedAndGalaDinerList[i].Quantity.value * mealType.ExtraBedAndGalaDinerList[i].Price * $scope.RoomsPrice.TotalNight;
        }
        else {
          price += this.ExtraBedAndGalaDinerList[i].Quantity.value * this.ExtraBedAndGalaDinerList[i].PriceOTA;
        }
        var item = { text: this.ExtraBedAndGalaDinerList[i].NameDisplay, price: price };
        this.arr.push(item);
      }
    }
    else {
        this.PriceAvgMinPriceStr = this.roomtype.PriceAvgMinPriceStr;
        this.PriceAvgPlusOTAStr = Number(this.roomtype.PriceAvgPlusTAStr) * this.roomnumber;
        this.PriceAvgPlusOTAStr = this.roomtype.PriceAvgPlusTAStr.toLocaleString();
      }

   
    //google analytic
    gf.googleAnalytion('roompaymentbreakdown', 'load', '');
  }
  ngOnInit() {

  }
  goback() {
    this.navCtrl.back();
  }
}
