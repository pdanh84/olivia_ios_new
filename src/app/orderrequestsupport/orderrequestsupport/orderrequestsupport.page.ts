import { Component, NgZone, OnInit } from '@angular/core';
import { NavController,LoadingController,AlertController } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import { C } from '../../providers/constants';
import {  ActivityService, GlobalFunction} from '../../providers/globalfunction';
import { ActivatedRoute, Router } from '@angular/router';
import { MytripService } from 'src/app/providers/mytrip-service.service';
import * as moment from 'moment';
import { flightService } from 'src/app/providers/flightService';
@Component({
  selector: 'app-orderrequestsupport',
  templateUrl: './orderrequestsupport.page.html',
  styleUrls: ['./orderrequestsupport.page.scss'],
})
export class OrderRequestSupportPage implements OnInit {
  listSupport: any[];
  allowBuyMoreLuggage: any= true;
  allowChangeFlight: boolean;
  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController, 
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public activityService: ActivityService , 
    private activatedRoute: ActivatedRoute,
    public _mytripservice: MytripService,
    private zone: NgZone,
    public gf: GlobalFunction,
    public _flightService: flightService) { 
        storage.get('auth_token').then(auth_token => {
            if(auth_token){
                if(this._mytripservice.listSupport && this._mytripservice.listSupport.length >0){
                    this.listSupport = this._mytripservice.listSupport;
                }else if (this._mytripservice.listSupport && this._mytripservice.listSupport.length ==0 ){
                    this.listSupport = []
                }else {
                    this.getListSupportByUser(auth_token);
                }
            }
        });

        this.allowBuyMoreLuggage = this.checkAllowBuyMoreLuggage(this.activityService.objPaymentMytrip.trip);
        if(this.allowBuyMoreLuggage){
          //check bkg chưa thanh toán
          this.allowBuyMoreLuggage = (this.activityService.objPaymentMytrip.trip.payment_status == 1 || this.activityService.objPaymentMytrip.trip.payment_status == 5);
          if(this.allowBuyMoreLuggage){
            //Check bkg chờ xử lý
            this.allowBuyMoreLuggage = this.activityService.objPaymentMytrip.trip.bookingsComboData[0].issueTicketDate && this.activityService.objPaymentMytrip.trip.approve_date;
          }
          if(this.allowBuyMoreLuggage){
            this.allowBuyMoreLuggage = this.activityService.objPaymentMytrip.trip.booking_type != 'CB_FLY_HOTEL' && this.activityService.objPaymentMytrip.trip.hotel_name.indexOf('VMB QT') == -1 && this.activityService.objPaymentMytrip.trip.flight_ticket_info.toLowerCase().indexOf('seri') == -1;
            if(this.allowBuyMoreLuggage){
              //check các rule khác
              this.allowBuyMoreLuggage = this.checkBeforeAddLuggage();
            }
          }
        }
        
        // let trip = this.activityService.objPaymentMytrip.trip;
        // this.allowChangeFlight = trip.hotel_name.indexOf('VMB QT') == -1 && (trip.payment_status == 1 || trip.payment_status == 5) && trip.bookingsComboData[0].issueTicketDate && trip.approve_date;
        // //check bkg chưa thanh toán
        // if(this.allowChangeFlight){
        //   this.allowChangeFlight = !trip.isRoundTrip ? trip.departChangeDepartTime : (trip.departChangeDepartTime || trip.returnChangeDepartTime );
        // }
        // if(trip.itemreturn){
        //   trip.itemreturn.checkReturnValidTime =true;
        // }
        // if(trip.itemdepart){
        //   trip.itemdepart.checkDepartValidTime =true;
        // }
        
        // if(this.allowChangeFlight){
        //     if(trip.itemreturn && trip.itemreturn.airlineCode && trip.itemreturn.airlineName.toLowerCase().indexOf('cathay') == -1 && !this.checkValidChangeFlightTime(trip.itemreturn)){
        //       //this.allowChangeFlight = false;
        //       trip.itemreturn.checkReturnValidTime =false;
        //     }else if(trip.itemdepart && trip.itemdepart.airlineCode && trip.itemdepart.airlineName.toLowerCase().indexOf('cathay') == -1 && !this.checkValidChangeFlightTime(trip.itemdepart)){
        //       //this.allowChangeFlight = false;
        //       trip.itemdepart.checkDepartValidTime =false;
        //     }
        //   if((trip.itemreturn && trip.itemdepart && !trip.itemdepart.checkDepartValidTime &&!trip.itemreturn.checkReturnValidTime) || (!trip.itemreturn && !trip.itemdepart.checkDepartValidTime)){
        //     this.allowChangeFlight = false;
        //   }
        // }
        // if(this.allowChangeFlight){
        //   this.allowChangeFlight = !trip.isRoundTrip ? trip.itemdepart.airlineName.toLowerCase().indexOf('vietnam airline') == -1 : (trip.itemdepart.airlineName.toLowerCase().indexOf('vietnam airline') == -1 || trip.itemreturn.airlineName.toLowerCase().indexOf('vietnam airline') == -1);
        // }
        
        
  }

  ngOnInit() {
  }
  goback() {
    if(this._flightService.fromOrderRequestChangeFlight){
      if(this._mytripservice.rootPage == "homeflight"){
        this._flightService.itemTabFlightActive.emit(true);
        setTimeout(()=>{
          this._flightService.itemMenuFlightClick.emit(2);
        },200)
        
        this.navCtrl.navigateBack('/tabs/tab1', {animated: true});
        this._mytripservice.backfrompage= "";
      }else {
        if(this._flightService.fromOrderRequestDetailSupport){
          this.navCtrl.navigateBack('/mytripdetail');
        }else{
          this._flightService.itemMenuFlightClick.emit(2);
          this.navCtrl.navigateBack(['/app/tabs/tab3']);
        }
      }
    }else{
      this.navCtrl.back();
    }
  }
 
  changeInfo() {
    if (!this.activityService.objPaymentMytrip.isRequestTrip && this.activityService.objPaymentMytrip.trip.isFlyBooking) {
      } else {
        this.navCtrl.navigateForward('/ordersupport/0');
      }
  }

   async makeCallSupport(phone) {
    try {
      setTimeout(() => {
        window.open(`tel:${phone}`, '_system');
      }, 10);
    }
    catch (error:any) {
      if (error) {
        error.page = "orderrequestsupport";
        error.func = "makeCallSupport";
        C.writeErrorLog(error, null);
      };
    }
  }

  getListSupportByUser(auth_token) {
    var se = this;
    if (auth_token) {
      var text = "Bearer " + auth_token;
      let headers =
      {
        'accept': 'application/json',
        'content-type': 'application/json-patch+json',
        authorization: text
      };
      let url = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/BookingMemberDetailByUser';
      
      se.gf.RequestApi('GET', url, headers, {}, 'OrderRuquestSupport', 'getListSupportByUser').then((data) => {
        if(data){
          se.zone.run(() => {
              se.listSupport = data;
              se._mytripservice.listSupport = se.listSupport;
            });
        }else{
          se.listSupport = [];
        }
      })
    }
  }

  addLuggage(){
    if(!this.allowBuyMoreLuggage){
      return;
    }
    let trip = this.activityService.objPaymentMytrip.trip;
    //bkg chưa thanh toán
    if(!(trip.payment_status == 1 || trip.payment_status == 5)){
      this.gf.showMessageWarning('Đơn hàng chưa được thanh toán. Xin vui lòng kiểm tra lại!');
          return;
    }
      else if(this.checkBeforeAddLuggage() == -1){
          this.gf.showMessageWarning('Đã quá hạn mua hành lý. Xin vui lòng kiểm tra lại!');
          return;
      }
      else if(this.checkBeforeAddLuggage() == -2){
        this.gf.showMessageWarning('Không hỗ trợ mua thêm hành lý. Xin vui lòng kiểm tra lại!');
        return;
    }
      this.navCtrl.navigateForward('/orderrequestaddluggage');
  }

  checkBeforeAddLuggage(){
      let res = 1;
      let trip = this.activityService.objPaymentMytrip.trip;
        if(trip.itemreturn && trip.itemreturn.airlineCode && trip.itemreturn.airlineName.toLowerCase().indexOf('cathay') == -1 && ['GO', 'RETURN', 'GOROUNDTRIP', 'RETURNROUNDTRIP'].indexOf(trip.itemreturn.trip_Code) == -1){
            if(!this.checkValidFlightTime(trip.itemreturn)){
                res = -1;
            }else if(!this.checkAllowBuyMoreLuggage(trip)){
                res = -2;
            }
        }else{
            if(!this.checkValidFlightTime(trip.itemdepart)){
                res = -1;
            }else if(!this.checkAllowBuyMoreLuggage(trip)){
                res = -2;
            }
        }

      return res;
  }

  /**
    * - Trong 3 tiếng trước khởi hành (VJA,BAV)
    - Trong 6 tiếng trước khởi hành (VNA)
   * @param itemFlight item chuyến di/chuyến về
   * @returns true/false
   */
  checkValidFlightTime(itemFlight) {
      let arrdate = [], arrtime = [];
      if(itemFlight.departureDate && itemFlight.departureTime){
        if(itemFlight.departureDate.indexOf('/')){
          arrdate = itemFlight.departureDate.split('/');
        }
        else if(itemFlight.departureDate.indexOf('-')){
          arrdate = itemFlight.departureDate.split('-');
        }
        arrtime = itemFlight.departureTime.split(':')
        let datecheck = new Date(arrdate[2], arrdate[1]-1, arrdate[0], arrtime[0], arrtime[1], 0);
        let hours = moment(datecheck).diff(new Date(), 'minutes')/60;
        return itemFlight.airlineName.toLowerCase().indexOf('vietnam airline') != -1 ? hours >= 6 : hours >=3;
      }else {
        return false;
      }
  }

  /**
   * Check dk cho phép mua thêm hành lý:
   * + Hãng VNA: 
        - Mua thêm kiện nào cũng được
        - Kiện mới không ảnh hưởng kiện cũ đã mua
        + Hãng VJ: 
        - Khách chưa có ký gửi, mua bất kỳ kiện nào cũng đc từ gói 15kgs
        - Khách đã có ký gửi 15kgs, muốn mua thêm gói => LIÊN HỆ OPS 
        Hãng BB: 
        - Khách chưa có ký gửi, mua bất kỳ kiện nào cũng đc từ gói 15kgs
        - Khách đã có ký gửi 15kgs, muốn mua thêm gói => LIÊN HỆ OPS
   * @param itemFlight item trip
   * @returns true/false
   */
  checkAllowBuyMoreLuggage(itemFlight){
      return itemFlight.itemdepart.passengers && itemFlight.itemdepart.passengers.some((p) => { return itemFlight.itemdepart.airlineName.toLowerCase().indexOf('vietnam airline') != -1 || (!p.isInfant && p.giaTienHanhLy == '0' && p.hanhLy == '0kg')}) 
      || (itemFlight.itemreturn && (itemFlight.itemreturn.airlineName.toLowerCase().indexOf('vietnam airline') != -1 || (itemFlight.itemreturn.passengers && itemFlight.itemreturn.passengers.some((p) => { return !p.isInfant && p.giaTienHanhLy == '0' && p.hanhLy == '0kg'})) ) );
  }

  /**
    * Đổi vé trong khung 3h30 phút so với giờ khởi hành: show Chuyến bay sắp vào khung đóng chuyến. Gửi thông tin qua Zalo OA iVIVU Flights để được hỗ trợ
   * @param itemFlight item chuyến di/chuyến về
   * @returns true/false
   */
  checkValidChangeFlightTime(itemFlight) {
    let arrdate = [], arrtime = [];
    if(itemFlight.departureDate && itemFlight.departureTime){
      if(itemFlight.departureDate.indexOf('/')){
        arrdate = itemFlight.departureDate.split('/');
      }
      else if(itemFlight.departureDate.indexOf('-')){
        arrdate = itemFlight.departureDate.split('-');
      }
      arrtime = itemFlight.departureTime.split(':')
      let datecheck = new Date(arrdate[2], arrdate[1]-1, arrdate[0], arrtime[0], arrtime[1], 0);
      let minutes = moment(datecheck).diff(new Date(), 'minutes');
      return minutes >=210;
    }else {
      return false;
    }
    
}
modifyFlight(){
  if(!this.allowChangeFlight){
    return;
  }
  this._flightService.fromOrderRequestChangeFlight = true;
  this._flightService.itemFlightCache.departCity = '';
  this._flightService.itemFlightCache.returnCity = '';
  this._flightService.itemFlightCache.checkInDate = this.activityService.objPaymentMytrip.checkInDate;
  this._flightService.itemFlightCache.checkOutDate = this.activityService.objPaymentMytrip.checkOutDate;
  this.navCtrl.navigateForward('/orderrequestchangeflight');
}

}

