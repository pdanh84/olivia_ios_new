import { Bookcombo } from './../providers/book-service';
import { GlobalFunction } from './../providers/globalfunction';
import { OnInit, Component, NgZone } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { C } from './../providers/constants';
@Component({
  selector: 'app-cardeparture',
  templateUrl: './cardeparture.page.html',
  styleUrls: ['./cardeparture.page.scss'],
})
export class CardeparturePage implements OnInit {
  isdepart = false; fromplace; daytitle: string; listcardisplay: any = []; listcar; departTicketSale; returnTicketSale; column: string;
  listcarname: any = []; titlepage; totalAdult;public loader: any; cars: any = [];diff_fee;ischeckseemore=true;codem=0;count=0;
  sortcar;seat_group_english;
  constructor(public modalCtrl: ModalController, public gf: GlobalFunction, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public bookCombo: Bookcombo, public zone: NgZone) {
    var params = this.gf.getParams('listcar');
    this.departTicketSale = this.bookCombo.ComboDetail.comboDetail.departTicketSale;
    this.returnTicketSale = this.bookCombo.ComboDetail.comboDetail.returnTicketSale;
    if (params) {
      this.daytitle = params.title;
      if (params.isdepart) {
        this.titlepage = "Giờ xe chiều đi"
        this.isdepart = true;
        this.listcar = params.listdepart;
      } else {
        this.titlepage = "Giờ xe chiều về"
        this.isdepart = false;
        this.listcar = params.listreturn;
      }
      this.totalAdult = params.totalAdult;
      for (let i = 0; i < this.listcar.length; i++) {
        this.listcar[i].sortByTime = this.listcar[i].route.pickup_time
        this.listcar[i].cartime = this.listcar[i].route.pickup_time + ' → ' + this.listcar[i].route.arrival_time;
        this.listcar[i].companyname = this.listcar[i].company.name;
        this.listcar[i].id = this.listcar[i].company.id;
        this.listcar[i].priceorder = this.listcar[i].route.schedules[0].fare.price;
        this.listcar[i].trip_code = this.listcar[i].route.schedules[0].trip_code;
        this.listcar[i].vehicle_type = this.listcar[i].route.schedules[0].vehicle_type
        var price = this.listcar[i].route.schedules[0].fare.price - this.departTicketSale;
        if (price <= 0) {
          this.listcar[i].checkdiscountdepart = true;
          price = Math.abs(price);
        }
        else {
          this.listcar[i].checkdiscountdepart = false;
        }
        this.listcar[i].priceshow = price.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        var ishide;
        if (this.listcar[i].sort_order != 999) {
          ishide=true;
          this.listcar[i].ishide=ishide;
          this.codem=1;
          this.listcardisplay.push(this.listcar[i]);
        }
      }
      if (this.codem==0) {
        this.ischeckseemore=false;
        for (let i = 0; i < this.listcar.length; i++) {
          this.listcar[i].sortByTime = this.listcar[i].route.pickup_time
          this.listcar[i].cartime = this.listcar[i].route.pickup_time + ' → ' + this.listcar[i].route.arrival_time;
          this.listcar[i].companyname = this.listcar[i].company.name;
          this.listcar[i].id = this.listcar[i].company.id;
          this.listcar[i].priceorder = this.listcar[i].route.schedules[0].fare.price;
          this.listcar[i].trip_code = this.listcar[i].route.schedules[0].trip_code;
          this.listcar[i].vehicle_type = this.listcar[i].route.schedules[0].vehicle_type;
          var price = this.listcar[i].route.schedules[0].fare.price - this.departTicketSale;
          if (price <= 0) {
            this.listcar[i].checkdiscountdepart = true;
            price = Math.abs(price);
          }
          else {
            this.listcar[i].checkdiscountdepart = false;
          }
          this.listcar[i].priceshow = price.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.listcardisplay.push(this.listcar[i]);
        }
      }
      else{
        this.count=this.listcar.length-this.listcardisplay.length
      }
      for (let i = 0; i < this.listcardisplay.length; i++) {
        var ischeck = this.checkitem(this.listcardisplay[i].company.id);
        if (ischeck) {
          var item = { id: this.listcardisplay[i].company.id, name: this.listcardisplay[i].company.name }
          this.listcarname.push(item);
        }
      }
      this.sort("sortByTimeDepartEarly");
      this.sort("priceup");
    }
  }

  ngOnInit() {
  }

  goback() {
    this.listcardisplay=[];
    this.modalCtrl.dismiss();
  }
  changeCarInfo(obj) {
    this.cars=[];
    this.cars.push(obj);
    this.getavailableseats();
  }
  getavailableseats() {
    var se = this;
    this.presentLoading(1);
    let headers ={
      'content-type' : 'application/json', 
      accept: '*/*'
    };
    let body =  {
      departParams:
      {
        trip_code: this.cars[0].route.schedules[0].trip_code,
        total_seats: this.totalAdult,
        total_price: this.cars[0].route.schedules[0].fare.price * se.totalAdult,
      },
    };
      let strUrl = C.urls.baseUrl.urlMobile + '/get-available-seats';
      se.gf.RequestApi('POST', strUrl, headers, body, 'cardeparture', 'getavailableseats').then((data) => {
      se.zone.run(() => {
        if (data.status == -1 || data.status == 2||data.status == 4) {
          for (let i = 0; i < se.listcardisplay.length; i++) {
            if (se.cars[0].route.schedules[0].trip_code == se.listcardisplay[i].trip_code) {
              se.listcardisplay.splice(i, 1);
              se.cars=[];
              break;
            }
          }
          if (se.loader) {
            se.loader.dismiss();
          }
          se.gf.showAlertMessageOnly("Không đủ số ghế trống, vui lòng chọn nhà xe khác");
        }
        if (data.status == 1 || data.status == 3) {
          se.diff_fee = data.data[0].diff_fee;
          se.seat_group_english=data.data[0].list_seats[0].seat_group_english;
          se.modalCtrl.dismiss({ isdepart: se.isdepart, cars: se.cars,diff_fee:se.diff_fee,loader: se.loader,seat_group_english:se.seat_group_english });
        }
      })
    })
  }
  async presentLoading(value) {
    this.loader = await this.loadingCtrl.create({
      message: "",
    });
    this.loader.present();
    if (value==0) {
      this.modalCtrl.dismiss({ isdepart: this.isdepart, cars: this.cars, diff_fee: this.diff_fee,loader: this.loader });
    }
  }
  async presentLoadinggoback() {
    this.cars=[];
    this.loader = await this.loadingCtrl.create({
      message: "",
    });
    this.loader.present();
  }
  sortAirline(event) {
    if(event)
    {
      this.sortcar=event.detail.value;
      this.sort(event.detail.value);
    }
    else
    {
      if (this.sortcar) {
        this.sort(this.sortcar);
      }
    }
  }
  public async showConfirm(msg) {
       if (this.loader) {
        this.loader.dismiss()
        }
    let alert = await this.alertCtrl.create({
      message: msg,
      cssClass: "request-combo-css",
      buttons: [{
        text: 'Có',
        role: 'OK',
        handler: () => {
        }
      },
      {
        text: 'Không',
        handler: () => {
          this.presentLoading(0);
        }
      }
      ]
    });
    alert.present();
  }
  /**Hàm sort list khách sạn theo giá, điểm trung bình 
     * PDANH 23/01/2018
     */
   sort(property) {
    var se = this;
    se.column = property;
    se.zone.run(() => se.listcardisplay.sort(function (a, b) {
      let direction = -1;
      if (property == "priceup") {
        let col = 'priceorder';
        if (a[col] * 1 < b[col] * 1) {
          return 1 * direction;
        }
        else if (a[col] * 1 > b[col] * 1) {
          return -1 * direction;
        }
      } else {
        let direction = (property == "sortByTimeDepartEarly" || property == "sortByTimeLandingEarly") ? -1 : 1;
        let columnname = "sortByTime";
        if (a[columnname] < b[columnname]) {
          return 1 * direction;
        }
        else if (a[columnname] > b[columnname]) {
          return -1 * direction;
        }
      }
    }));
  };

  checkitem(id) {
    for (let i = 0; i < this.listcarname.length; i++) {
      if (this.listcarname[i].id == id) {
        return false;
      }
    }
    return true;
  }
  filterAirline(event) {
    var se = this;
    if (event.detail.value && event.detail.value.length > 0) {
      let arrCar = event.detail.value;
      let strCar = "";
      arrCar.forEach(element => {
        strCar += (strCar != "") ? ("," + element) : element;
      });
      se.listcardisplay = [];
      se.zone.run(() => {
        se.listcar.forEach(f => {
          if (strCar.indexOf(f.id) != -1) {
            se.listcardisplay.push(f);
          }
        });
      })
    } 
    else {
      se.listcardisplay = [];
      for (let i = 0; i < this.listcar.length; i++) {
        this.listcar[i].sortByTime = this.listcar[i].route.pickup_time
        this.listcar[i].cartime = this.listcar[i].route.pickup_time + ' → ' + this.listcar[i].route.arrival_time;
        this.listcar[i].companyname = this.listcar[i].company.name;
        this.listcar[i].id = this.listcar[i].company.id;
        this.listcar[i].priceorder = this.listcar[i].route.schedules[0].fare.price;
        this.listcar[i].trip_code = this.listcar[i].route.schedules[0].trip_code
        var price = this.listcar[i].route.schedules[0].fare.price - this.departTicketSale;
        if (price <= 0) {
          this.listcar[i].checkdiscountdepart = true;
          price = Math.abs(price);
        }
        else {
          this.listcar[i].checkdiscountdepart = false;
        }
        this.listcar[i].priceshow = price.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        var ishide;
        if (this.ischeckseemore) {
          if (this.listcar[i].sort_order != 999) {
            ishide=true;
            this.listcar[i].ishide=ishide;
            this.listcardisplay.push(this.listcar[i]);
          }
        }
        else{
          this.listcardisplay.push(this.listcar[i]);
        }
       
      }
    }
    if (se.column) {
      this.sort(se.column);
    }
  }
  ionViewDidEnter() {
    // ion-select customizing
    const ionSelects: any = window.document.querySelectorAll('ion-select');
    let img = null;
    ionSelects.forEach((ionSelect) => {
      const selectIconInner = ionSelect.shadowRoot.querySelector('.select-icon');
      if (selectIconInner) {
        selectIconInner.setAttribute('style', 'display:none !important');
      }
    });
  }
  seemore()
  {
    this.zone.run(() => {
      this.ischeckseemore=false;
      // this.listcardisplay=[];
      for (let i = 0; i < this.listcar.length; i++) {
        this.listcar[i].sortByTime = this.listcar[i].route.pickup_time
        this.listcar[i].cartime = this.listcar[i].route.pickup_time + ' → ' + this.listcar[i].route.arrival_time;
        this.listcar[i].companyname = this.listcar[i].company.name;
        this.listcar[i].id = this.listcar[i].company.id;
        this.listcar[i].priceorder = this.listcar[i].route.schedules[0].fare.price;
        this.listcar[i].trip_code = this.listcar[i].route.schedules[0].trip_code
        var price = this.listcar[i].route.schedules[0].fare.price - this.departTicketSale;
        if (price <= 0) {
          this.listcar[i].checkdiscountdepart = true;
          price = Math.abs(price);
        }
        else {
          this.listcar[i].checkdiscountdepart = false;
        }
        this.listcar[i].priceshow = price.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        if (this.listcar[i].sort_order == 999) {
          this.listcardisplay.push(this.listcar[i]);
        }
      }
       for (let i = 0; i < this.listcardisplay.length; i++) {
        var ischeck = this.checkitem(this.listcardisplay[i].company.id);
        if (ischeck) {
          var item = { id: this.listcardisplay[i].company.id, name: this.listcardisplay[i].company.name }
          this.listcarname.push(item);
        }
      }
     
    })
  }
}
