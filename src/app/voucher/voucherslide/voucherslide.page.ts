import { Component,NgZone ,OnInit, EventEmitter, Input} from '@angular/core';
import { Platform, NavController, AlertController,  ToastController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { C } from './../../providers/constants';
import { ValueGlobal, Bookcombo } from '../../providers/book-service';
import { GlobalFunction } from './../../providers/globalfunction';
import { VoucherDetailPage } from '../voucherdetail/voucherdetail.page';
import { voucherService } from 'src/app/providers/voucherService';
import * as moment from 'moment';
import { flightService } from 'src/app/providers/flightService';

@Component({
  selector: 'app-voucherslide',
  templateUrl: 'voucherslide.page.html',
  styleUrls: ['voucherslide.page.scss'],
})

export class VoucherSlidePage implements OnInit{
  @Input() item:any;
    userRewardData:any;
    userInfoData:any;
    CityName: string;
    CountryCode: string;
    public isShowConfirm = false;
    public intervalID;
    vouchers:any = [];
    msgApplyFor: any;
  msgMultiVoucherError: string;
    constructor(public platform: Platform,public navCtrl: NavController,public toastCtrl: ToastController,
        public zone: NgZone,public storage: Storage,public alertCtrl: AlertController,public modalCtrl: ModalController,public valueGlobal: ValueGlobal,
        public gf: GlobalFunction,
        public _voucherService: voucherService,
        public _flightService: flightService,
        public bookCombo: Bookcombo){
          storage.get('auth_token').then(auth_token => {
            if (auth_token) {
              this._voucherService.vouchers = [];
              this.loadVoucherClaimed(auth_token);
            }else{
              this.loadUserInfo();
            }
          })
    }

    ngOnInit(){
      this._voucherService.rollbackSelectedVoucher.pipe().subscribe((itemRollback) => {
        if(itemRollback){
          for (let index = 0; index < this.vouchers.length; index++) {
            const element = this.vouchers[index];
            if(element.id == itemRollback.id){
              element.claimed = false;
              if(this._flightService.itemFlightInternational && this._flightService.itemFlightInternational.hasvoucher){
                this._flightService.itemFlightInternational.hasvoucher = '';
              }
            }
            
          }
        }
      })

      this._voucherService.getVoucherRefreshList().subscribe((check) => {
        if(check){
          this.vouchers = [];
          this._voucherService.vouchers = [];
          //this._voucherService.publicClearVoucherAfterPaymentDone(1);
          this.storage.get('auth_token').then(auth_token => {
            if (auth_token) {
              this.loadVoucherClaimed(auth_token);
            }else{
              this.loadUserInfo();
            }
          })
        }
      })
    }

    ngAfterContentInit(){
      
    }

    goback(){
        this.navCtrl.back();
    }

    loadUserInfo(){
      var se = this;
      se.storage.get('auth_token').then(auth_token => {
          if (auth_token) {
            this.gf.getUserInfo(auth_token).then((data) => {
                  if(data && data.statusCode != 401){
                      se.zone.run(()=>{
                          se.userInfoData = data;
                      });
                  }
              });
          }else{
            se._voucherService.hasVoucher = false;
            se._voucherService.vouchers = [];
          }
      })
  }

    voucherSelect(voucher){
      if(!voucher.isActive){
        return;
      }
      if(voucher.rewardsItem.price <= 0){
        this.showVoucherDetail(voucher);
      }else{
        if(voucher.applyFor && voucher.applyFor != 'flight'){
          this.gf.showAlertMessageOnly(`Mã giảm giá chỉ áp dụng cho đơn hàng ${ voucher.applyFor == 'hotel' ? 'khách sạn' : 'tour'}. Quý khách vui lòng chọn lại mã khác!`);
          return;
        } else{
          this.checkVoucherActive(voucher).then((check) => {
            if(!check){
              if(this.msgApplyFor){
                this.gf.showAlertMessageOnly(this.msgApplyFor);
              } 
              else if(this.msgMultiVoucherError){
                this.gf.showAlertMessageOnly(this.msgMultiVoucherError);
              } 
              else {
                if(voucher.claimed){//Cảnh báo với voucher đã sử dụng
                  this._voucherService.publicVoucherUsedClicked(voucher);
                }else{
                  this.gf.showAlertMessageOnly('Mã voucher không còn hiệu lực. Vui lòng chọn mã voucher khác!');
                }
              }
              
              return;
            }else{
             
              voucher.claimed = !voucher.claimed;
              if(voucher.claimed && !this.gf.checkExistsItemInArray(this._voucherService.voucherSelected, voucher, 'voucher')){
                this._voucherService.voucherSelected.push(voucher);
              }else if(!voucher.claimed && this.gf.checkExistsItemInArray(this._voucherService.voucherSelected, voucher, 'voucher')){
                this.gf.removeItemInArray(this._voucherService.voucherSelected, voucher);
              }
              this._voucherService.publicVoucherClicked(voucher);
            }
          })
        }
      }
    }
    checkVoucherActive(itemVoucher): Promise<any> {
      return new Promise((resolve, reject) => {
          var se = this;
          if (itemVoucher.code) {
            let headers = {
              'cache-control': 'no-cache',
              'content-type': 'application/json',
            };
            let body = { bookingCode: 'VMB',code: itemVoucher.code, totalAmount: itemVoucher.rewardsItem.price ? itemVoucher.rewardsItem.price : se._flightService.itemFlightCache.totalPrice, comboDetailId: 0, couponData: (itemVoucher.applyFor && itemVoucher.applyFor == 'flight') ? {
               flight: { "tickets": this._flightService.itemFlightCache.roundTrip ? [
                {
                  "flightNumber":  se._flightService.itemFlightCache.departFlight.flightNumber,
                  "airLineCode":  se._flightService.itemFlightCache.departFlight.airlineCode ,
                  "departTime":  se._flightService.itemFlightCache.departFlight.departTime,
                  "landingTime":  se._flightService.itemFlightCache.departFlight.landingTime,
                  "flightDuration":  se._flightService.itemFlightCache.departFlight.flightDuration,
                  "fromPlaceCode":  se._flightService.itemFlightCache.departFlight.fromPlaceCode,
                  "toPlaceCode":  se._flightService.itemFlightCache.departFlight.toPlaceCode,
                  "stops":  se._flightService.itemFlightCache.departFlight.stops,
                  "ticketClass":  se._flightService.itemFlightCache.departFlight.ticketClass,
                  "fareBasis":  se._flightService.itemFlightCache.departFlight.ticketType,
                  "jsonObject": ""
                },
                {
                  "flightNumber": se._flightService.itemFlightCache.returnFlight.flightNumber,
                  "airLineCode": se._flightService.itemFlightCache.returnFlight.airlineCode,
                  "departTime": se._flightService.itemFlightCache.returnFlight.departTime,
                  "landingTime": se._flightService.itemFlightCache.returnFlight.landingTime,
                  "flightDuration": se._flightService.itemFlightCache.returnFlight.flightDuration,
                  "fromPlaceCode": se._flightService.itemFlightCache.returnFlight.fromPlaceCode,
                  "toPlaceCode": se._flightService.itemFlightCache.returnFlight.toPlaceCode,
                  "stops": se._flightService.itemFlightCache.returnFlight.stops,
                  "ticketClass": se._flightService.itemFlightCache.returnFlight.ticketClass,
                  "fareBasis": se._flightService.itemFlightCache.returnFlight.ticketType,
                  "jsonObject": ""
                }
              ] : 
              [
                {
                  "flightNumber":  se._flightService.itemFlightCache.departFlight.flightNumber,
                  "airLineCode":  se._flightService.itemFlightCache.departFlight.airlineCode,
                  "departTime":  se._flightService.itemFlightCache.departFlight.departTime,
                  "landingTime":  se._flightService.itemFlightCache.departFlight.landingTime,
                  "flightDuration":  se._flightService.itemFlightCache.departFlight.flightDuration,
                  "fromPlaceCode":  se._flightService.itemFlightCache.departFlight.fromPlaceCode,
                  "toPlaceCode":  se._flightService.itemFlightCache.departFlight.toPlaceCode,
                  "stops":  se._flightService.itemFlightCache.departFlight.stops,
                  "ticketClass":  se._flightService.itemFlightCache.departFlight.ticketClass,
                  "fareBasis":  se._flightService.itemFlightCache.departFlight.ticketType,
                  "jsonObject": ""
                }
              ],
              "totalAdult": se._flightService.itemFlightCache.adult,
              "totalChild": se._flightService.itemFlightCache.child,
              "totalInfant": se._flightService.itemFlightCache.infant
            ,
          } }: '' };
            let strUrl = C.urls.baseUrl.urlMobile + '/api/data/validpromocode';
            se.gf.RequestApi('POST', strUrl, headers, body, 'voucherslide', 'checkVoucherActive').then((data) => {
              if (data.error == 0) {
                itemVoucher.type = data.data.type;
                if(se._voucherService.voucherSelected && se._voucherService.voucherSelected.length >0 && (se._voucherService.voucherSelected.some(v => v.type != data.data.type && v.id != itemVoucher.id) || se._voucherService.voucherSelected.some(v => v.type != 2 && v.id != itemVoucher.id))){
                  se.msgMultiVoucherError = "Chỉ hỗ trợ áp dụng nhiều voucher tiền mặt trên một đơn hàng, Coupon và Voucher khuyến mãi chỉ áp dụng một mã";
                  resolve(false);
                }else{
                  resolve(true);
                }
                
              }
             
              else{
                if(data.msg && itemVoucher.applyFor && itemVoucher.applyFor == 'flight'){
                  se.msgApplyFor = data.msg;
                }
                resolve(false);
              }
            });
          }
      })
    }
    
    async showVoucherDetail(voucher){
      var se = this;
      se._voucherService.itemVoucher = voucher;
        const modal: HTMLIonModalElement =
        await se.modalCtrl.create({
          component: VoucherDetailPage,
          showBackdrop: true,
          backdropDismiss: true,
          
          cssClass: "modal-voucher-detail"
        });
      modal.present();
}

    loadVoucherClaimed(auth_token){
      let se = this;
      let url = `${C.urls.baseUrl.urlMobile}/api/dashboard/GetVoucherClaimed`;
      let text = "Bearer " + auth_token;
      let  headers =
      {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
      };
      let body = { bookingCode: 'VMB' ,codes: [], totalAmount: 0, comboDetailId: 0,
              couponData: { flight: {
                  "tickets": this._flightService.itemFlightCache.roundTrip ? [
                    {
                      "flightNumber":  se._flightService.itemFlightCache.departFlight.flightNumber,
                      "airLineCode":  se._flightService.itemFlightCache.departFlight.airlineCode ,
                      "departTime":  se._flightService.itemFlightCache.departFlight.departTime,
                      "landingTime":  se._flightService.itemFlightCache.departFlight.landingTime,
                      "flightDuration":  se._flightService.itemFlightCache.departFlight.flightDuration,
                      "fromPlaceCode":  se._flightService.itemFlightCache.departFlight.fromPlaceCode,
                      "toPlaceCode":  se._flightService.itemFlightCache.departFlight.toPlaceCode,
                      "stops":  se._flightService.itemFlightCache.departFlight.stops,
                      "ticketClass":  se._flightService.itemFlightCache.departFlight.ticketClass,
                      "fareBasis":  se._flightService.itemFlightCache.departFlight.ticketType,
                      "jsonObject": ""
                    },
                    {
                      "flightNumber": se._flightService.itemFlightCache.returnFlight.flightNumber,
                      "airLineCode": se._flightService.itemFlightCache.returnFlight.airlineCode,
                      "departTime": se._flightService.itemFlightCache.returnFlight.departTime,
                      "landingTime": se._flightService.itemFlightCache.returnFlight.landingTime,
                      "flightDuration": se._flightService.itemFlightCache.returnFlight.flightDuration,
                      "fromPlaceCode": se._flightService.itemFlightCache.returnFlight.fromPlaceCode,
                      "toPlaceCode": se._flightService.itemFlightCache.returnFlight.toPlaceCode,
                      "stops": se._flightService.itemFlightCache.returnFlight.stops,
                      "ticketClass": se._flightService.itemFlightCache.returnFlight.ticketClass,
                      "fareBasis": se._flightService.itemFlightCache.returnFlight.ticketType,
                      "jsonObject": ""
                    }
                  ] : 
                  [
                    {
                      "flightNumber":  se._flightService.itemFlightCache.departFlight.flightNumber,
                      "airLineCode":  se._flightService.itemFlightCache.departFlight.airlineCode,
                      "departTime":  se._flightService.itemFlightCache.departFlight.departTime,
                      "landingTime":  se._flightService.itemFlightCache.departFlight.landingTime,
                      "flightDuration":  se._flightService.itemFlightCache.departFlight.flightDuration,
                      "fromPlaceCode":  se._flightService.itemFlightCache.departFlight.fromPlaceCode,
                      "toPlaceCode":  se._flightService.itemFlightCache.departFlight.toPlaceCode,
                      "stops":  se._flightService.itemFlightCache.departFlight.stops,
                      "ticketClass":  se._flightService.itemFlightCache.departFlight.ticketClass,
                      "fareBasis":  se._flightService.itemFlightCache.departFlight.ticketType,
                      "jsonObject": ""
                    }
                  ],
                  "totalAdult": se._flightService.itemFlightCache.adult,
                  "totalChild": se._flightService.itemFlightCache.child,
                  "totalInfant": se._flightService.itemFlightCache.infant
                ,
              } } };
      this.gf.RequestApi('POST', url, headers, body, 'myvoucher', 'loadVoucher').then((data)=> {
        if(data && data.length >0){
          data.forEach(element => {
            element.validdateDisplay = moment(element.to).format('DD-MM-YYYY');
            element.claimed = this._voucherService.voucherSelected.some(v => v.id == element.id);
          });
       
          this.zone.run(()=>{
            let voucheractive = data.filter((i)=> {return i.isActive});
            let voucherdeactive = data.filter((i)=> {return !i.isActive});
            this.vouchers = [...voucheractive, ...voucherdeactive];
            this._voucherService.vouchers = [...voucheractive, ...voucherdeactive];
            this._voucherService.hasVoucher = this._voucherService.vouchers && this._voucherService.vouchers.length >0;

            if(this._flightService.itemFlightInternational && this._flightService.itemFlightInternational.hasvoucher){
              for (let index = 0; index < this._voucherService.vouchers.length; index++) {
                const element = this._voucherService.vouchers[index];
                if(element.code == this._flightService.itemFlightInternational.hasvoucher){
                  element.claimed = true;
                  this._voucherService.selectVoucher = element;
                }
                
              }
            }
            
            //check list voucher mới nhất còn voucher đang tích chọn không? Không còn áp dụng thì bỏ tích
            if(this._voucherService.voucherSelected && this._voucherService.voucherSelected.length >0){
              this._voucherService.voucherSelected.forEach(element => {
                let vc = this._voucherService.vouchers.some(v => v.id == element.id && v.isActive);
                if(!vc){
                  this.gf.removeItemInArray(this._voucherService.voucherSelected, element);
                  this._voucherService.publicVoucherRefreshList(1);
                }
              });
            }

            if(this._voucherService.listObjectPromoCode && this._voucherService.listObjectPromoCode.length>0){
              this._voucherService.listObjectPromoCode.forEach(element => {
                let vctm = this._voucherService.vouchers.some(v => v.code == element.code && v.isActive);
                if(!vctm){
                  this.gf.removeItemInArray(this._voucherService.listObjectPromoCode, element);
                  this._voucherService.publicVoucherRefreshList(1);
                }
              });
            }

          })
        }else if(data.statusCode == 401){
          this.gf.refreshTokenNew(auth_token).then((token) => {
            setTimeout(() => {
              if(token && token.auth_token){
                this.storage.remove('auth_token').then(()=>{
                  this.storage.set('auth_token', token.auth_token);
                  this.loadVoucherClaimed(token.auth_token);
                })
              }
            }, 100)
          });
        }
       
      })
    }
}