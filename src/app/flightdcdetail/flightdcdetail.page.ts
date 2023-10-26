import { GlobalFunction } from './../providers/globalfunction';
import { NavController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { flightService } from './../providers/flightService';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core';
import { FlightdcpickaddressinputPage } from './../flightdcpickaddressinput/flightdcpickaddressinput.page';
@Component({
  selector: 'app-flightdcdetail',
  templateUrl: './flightdcdetail.page.html',
  styleUrls: ['./flightdcdetail.page.scss'],
})
export class FlightdcdetailPage implements OnInit {
  isblocktextDepart;
  isblocktextReturn;
  PhaseGo; PhaseReturn; textDepart; textReturn; returnPhaseGo; returnPhaseReturn;
  selectedTimePhaseGo: any[] = []; selectedTimeReturnPhaseGo: any[] = []; selectedTimePhaseTo: any[] = []; selectedTimeReturnPhaseTo: any[] = [];
  InfoGo; SendGo; InfoReturn; SendReturn; returnInfoGo; returnSendGo; returnInfoReturn; returnSendReturn
  Vehicle_Go; Vehicle_Return; departPriceGo = 0; departPriceTo = 0; returnPriceGo = 0; returnPriceTo = 0; returnVehicle_Go; returnVehicle_Return;
  departTotalPrice = 0; returnTotalPrice = 0; TotalPrice = 0;
  ListProductsGo; ListProductsGo_RoundTrip; ListProductsReturn; ListProductsReturn_RoundTrip;
  CountTrip = 0;
  CountGo = 0;
  CountReturn = 0;
  loaddonedepart = false;
  loaddonereturn = false;
  loadsk:any = [1, 2];
  DateGoResult: string;
  Date_Go_RoundTrip: string;
  Date_Return: string;
  Date_Return_RoundTrip: string;
  constructor(public _flightService: flightService, public gf: GlobalFunction, private navCtrl: NavController, private activatedRoute: ActivatedRoute,
    public loadingCtrl: LoadingController, private toastCtrl: ToastController, public modalCtrl: ModalController) {

  }
  goback() {
    this._flightService.itemFlightCache.isblocktextDepart = this.isblocktextDepart;
    this._flightService.itemFlightCache.isblocktextReturn = this.isblocktextReturn;
    this._flightService.itemTranferChange.emit(true);
    this.navCtrl.navigateBack('/flightdcpickaddress');
  }
  ngOnInit() {
    // this.presentLoading();
    this.isblocktextDepart = this.activatedRoute.snapshot.paramMap.get('isDepart');
    this.isblocktextReturn = this.activatedRoute.snapshot.paramMap.get('isReturn');
    if (this.isblocktextDepart == 'true') {
      this.isblocktextDepart = true;
    } else {
      this.isblocktextDepart = false;
    }
    if (this.isblocktextReturn == 'true') {
      this.isblocktextReturn = true;
    } else {
      this.isblocktextReturn = false;
    }
    if (this.isblocktextDepart) {
      this.textDepart = this._flightService.itemFlightCache.departDCPlace.description;
      this.gf.getDirection(this._flightService.itemFlightCache.departDCPlace.place_id, this._flightService.itemFlightCache.departDCAirport, this._flightService.itemFlightCache.departFlight.departTime, true).then(data => {
        this.getDirectionFrom(data.data, 0);
      })
    } else {
      this.loaddonedepart = true;
    }
    if (this.isblocktextReturn) {
      this.textReturn = this._flightService.itemFlightCache.returnDCPlace.description;
      this.gf.getDirection(this._flightService.itemFlightCache.returnDCAirport, this._flightService.itemFlightCache.returnDCPlace.place_id, this._flightService.itemFlightCache.departFlight.landingTime, false).then(data => {
        this.getDirectionFrom(data.data, 1);
      })
    } else {
      this.loaddonereturn = true;
    }

  }
  toggleChangeDepart(ev) {
    this.isblocktextDepart = ev.detail.checked;
    this.loaddonedepart = false;
    if (this.isblocktextDepart) {
      if (this._flightService.itemFlightCache.departDCPlace) {
        // this.presentLoading();
        this.textDepart = this._flightService.itemFlightCache.departDCPlace.description;
        this.gf.getDirection(this._flightService.itemFlightCache.departDCPlace.place_id, this._flightService.itemFlightCache.departDCAirport, this._flightService.itemFlightCache.departFlight.departTime, true).then(data => {
          this.getDirectionFrom(data.data, 0);
        })
      }
      else {
        this.loaddonedepart = true;
      }
    } else {
      this.funcTotalPrice(0);
    }
    // this.funcTotalPrice();
  }
  toggleChangeReturn(ev) {
    this.isblocktextReturn = ev.detail.checked;
    this.loaddonereturn = false;
    if (this.isblocktextReturn) {
      if (this._flightService.itemFlightCache.returnDCPlace) {
        // this.presentLoading();
        this.textReturn = this._flightService.itemFlightCache.returnDCPlace.description;
        this.gf.getDirection(this._flightService.itemFlightCache.returnDCAirport, this._flightService.itemFlightCache.returnDCPlace.place_id, this._flightService.itemFlightCache.departFlight.landingTime, false).then(data => {
          this.getDirectionFrom(data.data, 1);
        })
      }
      else {
        this.loaddonereturn = true;
      }
    } else {
      this.funcTotalPrice(1);
    }
    // this.funcTotalPrice();
  }
  confirm() {
    if (!this.loaddonedepart || !this.loaddonereturn) {
      this.presentToastwarming("Đang tìm chuyến xe vui lòng đợi trong giây lát!!!");
      return;
    }
    if (this.TotalPrice > 0 && this.loaddonedepart && this.loaddonereturn) {
      let AllParam = {
        PhaseGo: {} as any,
        ListProductsGo: {}as any,
        Date_Go: {}as any,
        Time_Go: {}as any,
        Go_planenumber: {}as any,

        PhaseGo_RoundTrip: {}as any,
        ListProductsGo_RoundTrip: {}as any,
        PassiveTimeGo_RoundTrip: {}as any,
        Date_Go_RoundTrip: {}as any,
        Time_Go_RoundTrip: {}as any,
        Go_RoundTrip_planenumber: {}as any,

        PhaseReturn: {}as any,
        ListProductsReturn: {}as any,
        PassiveTimeReturn: {}as any,
        Date_Return: {}as any,
        Time_Return: {}as any,
        Return_planenumber: {}as any,

        PhaseReturn_RoundTrip: {}as any,
        ListProductsReturn_RoundTrip: {}as any,
        PassiveTimeReturn_RoundTrip: {}as any,
        Date_Return_RoundTrip: {}as any,
        Time_Return_RoundTrip: {}as any,
        Return_RoundTrip_planenumber: {}as any,

        slot: 1,
        TotalPriceReturn: 0,
        TotalPriceGo: 0,
        User: { email: "", phone: "", fullName: "" }
      }
      if (this.isblocktextDepart && this.departTotalPrice) {
        if (this.PhaseGo != undefined) {
          // let DateGo = moment(this._flightService.itemFlightCache.departFlight.departTime).format("YYYY-MM-DDT00:00:00.000");
          // let TimeGo = moment(DateGo).add(this.PhaseGo.pickUpTime.value / 1000, 'seconds').utc().format("YYYY-MM-DDTHH:mm:ss.000") + "Z";
          AllParam.PhaseGo = this.PhaseGo;
          AllParam.ListProductsGo = this.ListProductsGo;
          AllParam.Date_Go = this.DateGoResult;
          AllParam.Time_Go = moment(this.DateGoResult).add(this.PhaseGo.pickUpTime.value / 1000, 'seconds').utc().format("YYYY-MM-DDTHH:mm:ss.000") + "Z";;
          AllParam.Go_planenumber = (this._flightService.itemFlightCache != undefined && this._flightService.itemFlightCache.departFlight != undefined) ? this._flightService.itemFlightCache.departFlight.flightNumber : "";
        }
        else {
          AllParam.PhaseGo = null;
          AllParam.ListProductsGo = null;
          AllParam.Date_Go = null;
          AllParam.Time_Go = null;
          AllParam.Go_planenumber = "";
        }

        if (this.PhaseReturn != undefined) {
          // let Date_Go_RoundTrip = moment(this._flightService.itemFlightCache.returnFlight.landingTime).format("YYYY-MM-DDT00:00:00.000");
          // let Time_Go_RoundTrip = moment(Date_Go_RoundTrip).add(this.PhaseReturn.pickUpTime.value / 1000, 'seconds').utc().format("YYYY-MM-DDTHH:mm:ss.000") + "Z";
          AllParam.PhaseGo_RoundTrip = this.PhaseReturn;
          AllParam.ListProductsGo_RoundTrip = this.ListProductsGo_RoundTrip;
          AllParam.Date_Go_RoundTrip = this.Date_Go_RoundTrip;
          AllParam.Time_Go_RoundTrip = moment(this.Date_Go_RoundTrip).add(this.PhaseReturn.pickUpTime.value / 1000, 'seconds').utc().format("YYYY-MM-DDTHH:mm:ss.000") + "Z";;
          AllParam.Go_RoundTrip_planenumber = (this._flightService.itemFlightCache != undefined && this._flightService.itemFlightCache.returnFlight != undefined) ? this._flightService.itemFlightCache.returnFlight.flightNumber : "";
        }
        else {
          AllParam.PhaseGo_RoundTrip = null;
          AllParam.ListProductsGo_RoundTrip = null;
          AllParam.Date_Go_RoundTrip = null;
          AllParam.Time_Go_RoundTrip = null;
          AllParam.Go_RoundTrip_planenumber = "";
        }
      }
      else {
        AllParam.PhaseGo = null;
        AllParam.ListProductsGo = null;
        AllParam.PhaseGo_RoundTrip = null;
        AllParam.ListProductsGo_RoundTrip = null;
        AllParam.Date_Go = null;
        AllParam.Time_Go = null;
        AllParam.Date_Go_RoundTrip = null;
        AllParam.Time_Go_RoundTrip = null;
        AllParam.Go_planenumber = "";
        AllParam.Go_RoundTrip_planenumber = "";
      }
      //return
      if (this.isblocktextReturn && this.returnTotalPrice) {
        if (this.returnPhaseGo != undefined) {
          // let Date_Return = moment(this._flightService.itemFlightCache.departFlight.landingTime).format("YYYY-MM-DDT00:00:00.000");
          // let Time_Return = moment(Date_Return).add(this.returnPhaseGo.pickUpTime.value / 1000, 'seconds').utc().format("YYYY-MM-DDTHH:mm:ss.000") + "Z";
          AllParam.PhaseReturn = this.returnPhaseGo;
          AllParam.ListProductsReturn = this.ListProductsReturn;
          AllParam.Date_Return = this.Date_Return;
          AllParam.Time_Return = moment(this.Date_Return).add(this.returnPhaseGo.pickUpTime.value / 1000, 'seconds').utc().format("YYYY-MM-DDTHH:mm:ss.000") + "Z";;
          AllParam.Return_planenumber = (this._flightService.itemFlightCache != undefined && this._flightService.itemFlightCache.departFlight != undefined) ? this._flightService.itemFlightCache.departFlight.flightNumber : "";
        }
        else {
          AllParam.PhaseReturn = null;
          AllParam.ListProductsReturn = null;
          AllParam.Date_Return = null;
          AllParam.Time_Return = null;
          AllParam.Return_planenumber = "";
        }
        if (this.returnPhaseReturn != null) {
          // let Date_Return_RoundTrip = moment(this._flightService.itemFlightCache.returnFlight.departTime).format("YYYY-MM-DDT00:00:00.000");
          // let Time_Return_RoundTrip = moment(Date_Return_RoundTrip).add(this.returnPhaseReturn.pickUpTime.value / 1000, 'seconds').utc().format("YYYY-MM-DDTHH:mm:ss.000") + "Z";
          AllParam.PhaseReturn_RoundTrip = this.returnPhaseReturn;
          AllParam.ListProductsReturn_RoundTrip = this.ListProductsReturn_RoundTrip;
          AllParam.Date_Return_RoundTrip = this.Date_Return_RoundTrip;
          AllParam.Time_Return_RoundTrip = moment(this.Date_Return_RoundTrip).add(this.returnPhaseReturn.pickUpTime.value / 1000, 'seconds').utc().format("YYYY-MM-DDTHH:mm:ss.000") + "Z";
          AllParam.Return_RoundTrip_planenumber = (this._flightService.itemFlightCache != undefined && this._flightService.itemFlightCache.returnFlight != undefined) ? this._flightService.itemFlightCache.returnFlight.flightNumber : "";
        }
        else {
          AllParam.PhaseReturn_RoundTrip = null;
          AllParam.ListProductsReturn_RoundTrip = null;
          AllParam.Date_Return_RoundTrip = null;
          AllParam.Time_Return_RoundTrip = null;
          AllParam.Return_RoundTrip_planenumber = "";
        }
      }
      else {
        AllParam.PhaseReturn = null;
        AllParam.ListProductsReturn = null;
        AllParam.PhaseReturn_RoundTrip = null;
        AllParam.ListProductsReturn_RoundTrip = null;
        AllParam.Date_Return = null;
        AllParam.Time_Return = null;
        AllParam.Date_Return_RoundTrip = null;
        AllParam.Time_Return_RoundTrip = null;
        AllParam.Return_planenumber = "";
        AllParam.Return_RoundTrip_planenumber = "";
      }
      if (this.isblocktextDepart) {
        AllParam.TotalPriceGo = this.departTotalPrice;
      }
      if (this.isblocktextReturn) {
        AllParam.TotalPriceReturn = this.returnTotalPrice;
      }
      this._flightService.itemFlightCache.isblocktextDepart = this.isblocktextDepart;
      this._flightService.itemFlightCache.isblocktextReturn = this.isblocktextReturn;

      this._flightService.itemFlightCache.DICHUNGParam = AllParam;
      this._flightService.itemTranferChange.emit(true);
      this.navCtrl.navigateBack('/flightaddservice');
    }
    else {
      this._flightService.itemTranferChange.emit(true);
      this._flightService.itemFlightCache.DICHUNGParam = null;
      this.navCtrl.navigateBack('/flightaddservice');
    }
    // this._flightService.itemFlightCache.AllParamDichung = AllParam;
  }
  // 0:chiều đi/1:chiều về
  getDirectionFrom(data, stt) {
    var se = this;
    if (stt == 0) {

      se.PhaseGo = data;
      let numberAddOrReduceDay = data.addOrReduceDay; //Them phan tang ngay hoac giam ngay
      if (se.PhaseGo != undefined &&  se.PhaseGo.pickUpTime) {
        se.selectedTimePhaseGo =
          [{ name: se.PhaseGo.pickUpTime.text, value: se.PhaseGo.pickUpTime.value },
          { name: moment(se.PhaseGo.pickUpTime.text, 'HH:mm').add(-15, 'minutes').format('HH:mm'), value: (se.PhaseGo.pickUpTime.value - 900000) },
          { name: moment(se.PhaseGo.pickUpTime.text, 'HH:mm').add(-30, 'minutes').format('HH:mm'), value: (se.PhaseGo.pickUpTime.value - 1800000) },
          { name: moment(se.PhaseGo.pickUpTime.text, 'HH:mm').add(-45, 'minutes').format('HH:mm'), value: (se.PhaseGo.pickUpTime.value - 2700000) }
          ];
          let dateProductDICHUNG = se._flightService.itemFlightCache.departFlight.departTime
          this.DateGoResult = "";
          let tempDate;
          switch (numberAddOrReduceDay) {
            case 0:
                this.DateGoResult = moment(se._flightService.itemFlightCache.departFlight.departTime).format("YYYY-MM-DDT00:00:00.000");
                break;
            case 1:
                tempDate = moment(new Date(dateProductDICHUNG)).add(1, 'days');
                this.DateGoResult = moment(tempDate).format("YYYY-MM-DDT00:00:00.000");
                break;
            case -1:
                tempDate = moment(new Date(dateProductDICHUNG)).subtract(1, 'days');
                this.DateGoResult = moment(tempDate).format("YYYY-MM-DDT00:00:00.000");
                break;
            default:
                break;
        }
        //let DateGo = moment(se._flightService.itemFlightCache.departFlight.departTime).format("YYYY-MM-DDT00:00:00.000");
        let TimeGo = moment(this.DateGoResult).add(se.PhaseGo.pickUpTime.value / 1000, 'seconds').utc().format("YYYY-MM-DDTHH:mm:ss.000") + "Z";
        this.gf.GetListProduct(TimeGo, se._flightService.itemFlightCache.departDCPlace.place_id, se._flightService.itemFlightCache.departDCAirport, se._flightService.itemFlightCache.pax, "v_transfer", "dichungtaxi", "price","Go").then(data => {
          se.GetListProductGo(data.data, stt);
        })

      }else{
        this.loaddonedepart =true;
        this.departTotalPrice  =0;
      }
    } else {
      se.returnPhaseGo = data;
      let numberAddOrReduceDay = data.addOrReduceDay; //Them phan tang ngay hoac giam ngay
      if (se.returnPhaseGo != undefined &&  se.returnPhaseGo.pickUpTime) {
        se.selectedTimeReturnPhaseGo =
          [{ name: se.returnPhaseGo.pickUpTime.text, value: se.returnPhaseGo.pickUpTime.value },
          { name: moment(se.returnPhaseGo.pickUpTime.text, 'HH:mm').add(-15, 'minutes').format('HH:mm'), value: (se.returnPhaseGo.pickUpTime.value - 900000) },
          { name: moment(se.returnPhaseGo.pickUpTime.text, 'HH:mm').add(-30, 'minutes').format('HH:mm'), value: (se.returnPhaseGo.pickUpTime.value - 1800000) },
          { name: moment(se.returnPhaseGo.pickUpTime.text, 'HH:mm').add(-45, 'minutes').format('HH:mm'), value: (se.returnPhaseGo.pickUpTime.value - 2700000) }
          ];
          let dateProductDICHUNG = this._flightService.itemFlightCache.departFlight.landingTime
          this.Date_Return = "";
          let tempDate;
          switch (numberAddOrReduceDay) {
            case 0:
                this.Date_Return = moment(this._flightService.itemFlightCache.departFlight.landingTime).format("YYYY-MM-DDT00:00:00.000");
                break;
            case 1:
                tempDate = moment(new Date(dateProductDICHUNG)).add(1, 'days');
                this.Date_Return = moment(tempDate).format("YYYY-MM-DDT00:00:00.000");
                break;
            case -1:
                tempDate = moment(new Date(dateProductDICHUNG)).subtract(1, 'days');
                this.Date_Return = moment(tempDate).format("YYYY-MM-DDT00:00:00.000");
                break;
            default:
                break;
        }
        //let DateGo = moment(this._flightService.itemFlightCache.departFlight.landingTime).format("YYYY-MM-DDT00:00:00.000");
        let TimeGo = moment(this.Date_Return).add(se.returnPhaseGo.pickUpTime.value / 1000, 'seconds').utc().format("YYYY-MM-DDTHH:mm:ss.000") + "Z";
        this.gf.GetListProduct(TimeGo, this._flightService.itemFlightCache.returnDCAirport, this._flightService.itemFlightCache.returnDCPlace.place_id, se._flightService.itemFlightCache.pax, "v_transfer", "dichungtaxi", "price","Go_RoundTrip").then(data => {
          se.GetListProductGo(data.data, stt);
        })

      }else{
        this.loaddonereturn =true;
        this.returnTotalPrice=0;
      }
    }

  }
  getDirectionTo(data, stt) {
    var se = this;
    if (stt == 0) {
      se.PhaseReturn = data;
      let numberAddOrReduceDay = data.addOrReduceDay;
      if (se.PhaseReturn != undefined && se.PhaseReturn.pickUpTime) {
        se.selectedTimePhaseTo =
          [{ name: se.PhaseReturn.pickUpTime.text, value: se.PhaseReturn.pickUpTime.value },
          { name: moment(se.PhaseReturn.pickUpTime.text, 'HH:mm').add(-15, 'minutes').format('HH:mm'), value: (se.PhaseReturn.pickUpTime.value - 900000) },
          { name: moment(se.PhaseReturn.pickUpTime.text, 'HH:mm').add(-30, 'minutes').format('HH:mm'), value: (se.PhaseReturn.pickUpTime.value - 1800000) },
          { name: moment(se.PhaseReturn.pickUpTime.text, 'HH:mm').add(-45, 'minutes').format('HH:mm'), value: (se.PhaseReturn.pickUpTime.value - 2700000) }
          ];
          let dateProductDICHUNG = se._flightService.itemFlightCache.returnFlight.departTime
          this.Date_Go_RoundTrip = "";
          let tempDate;
          switch (numberAddOrReduceDay) {
            case 0:
                this.Date_Go_RoundTrip = moment(this._flightService.itemFlightCache.returnFlight.departTime).format("YYYY-MM-DDT00:00:00.000");
                break;
            case 1:
                tempDate = moment(new Date(dateProductDICHUNG)).add(1, 'days');
                this.Date_Go_RoundTrip = moment(tempDate).format("YYYY-MM-DDT00:00:00.000");
                break;
            case -1:
                tempDate = moment(new Date(dateProductDICHUNG)).subtract(1, 'days');
                this.Date_Go_RoundTrip = moment(tempDate).format("YYYY-MM-DDT00:00:00.000");
                break;
            default:
                break;
        }
        // let DateGo = this.Date_Go_RoundTrip;
        //let DateGo = moment(this._flightService.itemFlightCache.returnFlight.departTime).format("YYYY-MM-DDT00:00:00.000");
        let TimeGo = moment(this.Date_Go_RoundTrip).add(se.PhaseReturn.pickUpTime.value / 1000, 'seconds').utc().format("YYYY-MM-DDTHH:mm:ss.000") + "Z";
        this.gf.GetListProduct(TimeGo, se._flightService.itemFlightCache.departDCAirport, se._flightService.itemFlightCache.departDCPlace.place_id, se._flightService.itemFlightCache.pax, "v_transfer", "dichungtaxi", "price","Return").then(data => {
          se.GetListProductReturn(data.data, stt);
        })

      }
      else{
        this.loaddonedepart =true;
        this.departTotalPrice  =0;
      }
    } else {
      se.returnPhaseReturn = data;
      let numberAddOrReduceDay = data.addOrReduceDay;
      if (se.returnPhaseReturn != undefined && se.returnPhaseReturn.pickUpTime) {
        se.selectedTimeReturnPhaseTo =
          [{ name: se.returnPhaseReturn.pickUpTime.text, value: se.returnPhaseReturn.pickUpTime.value },
          { name: moment(se.returnPhaseReturn.pickUpTime.text, 'HH:mm').add(-15, 'minutes').format('HH:mm'), value: (se.returnPhaseReturn.pickUpTime.value - 900000) },
          { name: moment(se.returnPhaseReturn.pickUpTime.text, 'HH:mm').add(-30, 'minutes').format('HH:mm'), value: (se.returnPhaseReturn.pickUpTime.value - 1800000) },
          { name: moment(se.returnPhaseReturn.pickUpTime.text, 'HH:mm').add(-45, 'minutes').format('HH:mm'), value: (se.returnPhaseReturn.pickUpTime.value - 2700000) }
          ];
          let dateProductDICHUNG = this._flightService.itemFlightCache.returnFlight.departTime
          this.Date_Return_RoundTrip = "";
          let tempDate;
          switch (numberAddOrReduceDay) {
            case 0:
                this.Date_Return_RoundTrip = moment(this._flightService.itemFlightCache.returnFlight.departTime).format("YYYY-MM-DDT00:00:00.000");
                break;
            case 1:
                tempDate = moment(new Date(dateProductDICHUNG)).add(1, 'days');
                this.Date_Return_RoundTrip = moment(tempDate).format("YYYY-MM-DDT00:00:00.000");
                break;
            case -1:
                tempDate = moment(new Date(dateProductDICHUNG)).subtract(1, 'days');
                this.Date_Return_RoundTrip = moment(tempDate).format("YYYY-MM-DDT00:00:00.000");
                break;
            default:
                break;
        }
        // let DateGo = moment(this._flightService.itemFlightCache.returnFlight.departTime).format("YYYY-MM-DDT00:00:00.000");
        let TimeGo = moment(this.Date_Return_RoundTrip).add(se.returnPhaseReturn.pickUpTime.value / 1000, 'seconds').utc().format("YYYY-MM-DDTHH:mm:ss.000") + "Z";
        this.gf.GetListProduct(TimeGo, se._flightService.itemFlightCache.returnDCPlace.place_id, se._flightService.itemFlightCache.returnDCAirport, se._flightService.itemFlightCache.pax, "v_transfer", "dichungtaxi", "price","Return_RoundTrip").then(data => {
          se.GetListProductReturn(data.data, stt);
        })

      }
      else{
        this.loaddonereturn =true;
        this.returnTotalPrice  =0;
      }
    }

  }
  GetListProductGo(Product, stt) {
    var se = this;
    if (stt == 0) {
      if (Product != undefined) {
        let dataGet = Product;
        this.ListProductsGo = Product;
        se.InfoGo = dataGet.info;
        se.SendGo = dataGet.send;
        se.departPriceGo = this.RoundPrice((this.InfoGo != undefined && this.InfoGo.price  ? this.InfoGo.price.value : 0) * 1.08);
        if (se.InfoGo != undefined && se.InfoGo.hasOwnProperty('price')) {
          this.CountTrip++;
          se.Vehicle_Go = se.SendGo != undefined ? se.SendGo.vehicle.type.search("Xe") != -1 ? se.SendGo.vehicle.type.slice(3) : se.SendGo.vehicle.type : "";
        }
        else {
          se.PhaseGo = null;
          se.InfoGo = null;
          se.SendGo = null;
          se.Vehicle_Go = "";
        }
      }
      if (this._flightService.itemFlightCache.roundTrip) {
        this.gf.getDirection(this._flightService.itemFlightCache.departDCAirport, this._flightService.itemFlightCache.departDCPlace.place_id, this._flightService.itemFlightCache.returnFlight.landingTime, false).then(data => {
          this.getDirectionTo(data.data, stt);
        })
      }
      else {
        this.funcTotalPrice(stt);
      }
    } else {
      if (Product != undefined) {
 
        let dataGet = Product
        se.ListProductsReturn = Product;
        se.returnInfoGo = dataGet.info;
        se.returnSendGo = dataGet.send;
        se.returnPriceGo = se.RoundPrice((se.returnInfoGo != undefined && se.returnInfoGo.price ? se.returnInfoGo.price.value : 0) * 1.08);
        if (se.returnInfoGo != undefined && se.returnInfoGo.hasOwnProperty('price')) {
          this.CountTrip++;
          se.returnVehicle_Go = se.returnSendGo != undefined ? se.returnSendGo.vehicle.name.search("Xe") != -1 ? se.returnSendGo.vehicle.name.slice(3) : se.returnSendGo.vehicle.name : "";
        }
        else {
          se.returnPhaseGo = null;
          se.returnInfoGo = null;
          se.returnSendGo = null;
          se.returnVehicle_Go = "";
        }
      }
      if (this._flightService.itemFlightCache.roundTrip) {
        this.gf.getDirection(this._flightService.itemFlightCache.returnDCPlace.place_id, this._flightService.itemFlightCache.returnDCAirport, this._flightService.itemFlightCache.returnFlight.departTime, true).then(data => {
          this.getDirectionTo(data.data, stt);
        })
      }
      else {
        this.funcTotalPrice(stt);
      }
    }

  }
  GetListProductReturn(Product, stt) {
    var se = this;
    if (stt == 0) {
      if (Product != undefined) {
        let dataGet = Product
        this.ListProductsGo_RoundTrip = Product;
        se.InfoReturn = dataGet.info;
        se.SendReturn = dataGet.send;
        se.departPriceTo = se.RoundPrice((se.InfoReturn != undefined && se.InfoReturn.price ? se.InfoReturn.price.value : 0) * 1.08);
        if (se.departPriceTo==0) {
          se.funcTotalPrice(stt);
        }
        if (se.InfoReturn != undefined && se.InfoReturn.hasOwnProperty('price')) {
          this.CountTrip++;
          se.Vehicle_Return = se.SendReturn != undefined ? se.SendReturn.vehicle.type.search("Xe") != -1 ? se.SendReturn.vehicle.type.slice(3) : se.SendReturn.vehicle.type : "";
        }
        else {
          se.PhaseReturn = null;
          se.InfoReturn = null;
          se.SendReturn = null;
          se.Vehicle_Return = "";
        }
      }
    } else {
      if (Product != undefined) {
  
        let dataGet = Product;
        this.ListProductsReturn_RoundTrip = Product;
        se.returnInfoReturn = dataGet.info;
        se.returnSendReturn = dataGet.send;
        se.returnPriceTo = se.RoundPrice((se.returnInfoReturn != undefined && se.returnInfoReturn.price ? se.returnInfoReturn.price.value : 0) * 1.08);
        if (se.returnInfoReturn != undefined && se.returnInfoReturn.hasOwnProperty('price')) {
          this.CountTrip++;
          se.returnVehicle_Return = se.returnSendReturn != undefined ? se.returnSendReturn.vehicle.name.search("Xe") != -1 ? se.returnSendReturn.vehicle.name.slice(3) : se.returnSendReturn.vehicle.name : "";
        }
        else {
          se.returnPhaseReturn = null;
          se.returnInfoReturn = null;
          se.returnSendReturn = null;
          se.returnVehicle_Return = "";
        }
      }
    }
    this.funcTotalPrice(stt);
  }
  funcTotalPrice(stt) {
    this.TotalPrice = 0;
    this.departTotalPrice = 0;
    this.returnTotalPrice = 0;

    if (this._flightService.itemFlightCache.roundTrip) {
      if (this.departPriceGo==0|| this.departPriceTo==0) {
        this.departTotalPrice =0
      }else{
        this.departTotalPrice = this.departPriceGo + this.departPriceTo;
      }
      if (this.returnPriceGo==0|| this.returnPriceTo==0) {
        this.returnTotalPrice =0
      }else{
        this.returnTotalPrice = this.returnPriceGo + this.returnPriceTo;
      }
    }
    else{
     
      this.departTotalPrice = this.departPriceGo + this.departPriceTo;
      this.returnTotalPrice = this.returnPriceGo + this.returnPriceTo;
    }
    if (this.isblocktextDepart && this.isblocktextReturn) {
      this.TotalPrice = this.departTotalPrice + this.returnTotalPrice;
    } else {
      if (this.isblocktextDepart) {
        this.TotalPrice = this.departTotalPrice;
      }
      else if (this.isblocktextReturn) {
        this.TotalPrice = this.returnTotalPrice;
      }
    }
    this.funcCountTrip();
    if (stt == 0) {
      this.loaddonedepart = true;
    } else {
      this.loaddonereturn = true;
    }
  }
  funcCountTrip() {
    this.CountTrip = 0
    this.CountGo = 0;
    this.CountReturn = 0;
    if (this.isblocktextDepart) {
      if (this._flightService.itemFlightCache.roundTrip == true) {
        if (this.departTotalPrice!=0) {
          this.CountGo = 2;
        }
      }
      else {
        if (this.departTotalPrice!=0) {
          this.CountGo = 1;
        }
      }
    }

    if (this.isblocktextReturn) {
      if (this._flightService.itemFlightCache.roundTrip == true) {
        if (this.returnTotalPrice!=0) {
          this.CountReturn = 2;
        }
      
      }
      else {
        if (this.returnTotalPrice!=0) {
          this.CountReturn = 1;
        }
      
      }
    }
    this.CountTrip = this.CountGo + this.CountReturn;
  }
  RoundPrice(price: number): number {
    if (price != undefined && price > 0) {
      let priceTemp: number = 0;
      priceTemp = price % 1000;
      if (priceTemp > 1) {
        priceTemp = (Math.trunc(price / 1000) + 1) * 1000;
      }
      else {
        priceTemp = (Math.trunc(price / 1000)) * 1000;
      }
      return priceTemp;
    }
    else {
      return 0;
    }
  }
  showmsg(msg) {
    alert(msg);
  }
  async presentToastwarming(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }
  edit(text) {
    this.showInput(text);
  }
  async showInput(text) {
    var location;
    if (text == 'From') {
      location = this._flightService.itemFlightCache.locationFrom;
    } else {
      location = this._flightService.itemFlightCache.locationTo;
    }
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: FlightdcpickaddressinputPage,
        componentProps: {
          'value': text,
          'location': location
        }
      });
    modal.present();
    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      if (data.data) {
        if (data.data.FromTo == 'From') {
          this.loaddonedepart = false;
          this.TotalPrice=0;
          this._flightService.itemFlightCache.departDCPlace = data.data.item;
          this.textDepart = this._flightService.itemFlightCache.departDCPlace.description;
          this.gf.getDirection(this._flightService.itemFlightCache.departDCPlace.place_id, this._flightService.itemFlightCache.departDCAirport, this._flightService.itemFlightCache.departFlight.departTime, true).then(data => {
            this.getDirectionFrom(data.data, 0);
          })
        }
        else if (data.data.FromTo == 'To') {
          this.loaddonereturn = false;
          this.TotalPrice=0;
          this._flightService.itemFlightCache.returnDCPlace = data.data.item;
          this.textReturn = this._flightService.itemFlightCache.returnDCPlace.description;
          this.gf.getDirection(this._flightService.itemFlightCache.returnDCAirport, this._flightService.itemFlightCache.returnDCPlace.place_id, this._flightService.itemFlightCache.departFlight.landingTime, false).then(data => {
            this.getDirectionFrom(data.data, 1);
          })
        }
      }
    })
  }
}
