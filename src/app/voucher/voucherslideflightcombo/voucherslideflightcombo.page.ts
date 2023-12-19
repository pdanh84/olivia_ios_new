import { Component,NgZone ,OnInit} from '@angular/core';
import { Platform, NavController, AlertController,  ToastController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { C } from './../../providers/constants';
import { Bookcombo, Booking, RoomInfo, SearchHotel, ValueGlobal } from '../../providers/book-service';
import { GlobalFunction } from './../../providers/globalfunction';
import { VoucherDetailPage } from '../voucherdetail/voucherdetail.page';
import { voucherService } from 'src/app/providers/voucherService';
import * as moment from 'moment';
import { flightService } from 'src/app/providers/flightService';

@Component({
  selector: 'app-voucherslideflightcombo',
  templateUrl: 'voucherslideflightcombo.page.html',
  styleUrls: ['voucherslideflightcombo.page.scss'],
})

export class VoucherSlideFlightComboPage implements OnInit{
    userRewardData:any;
    userInfoData:any;
    CityName: string;
    CountryCode: string;
    public isShowConfirm = false;
    public intervalID;
    vouchers:any = [];
    msgMultiVoucherError: any;
    constructor(public platform: Platform,public navCtrl: NavController,public toastCtrl: ToastController,
        public zone: NgZone,public storage: Storage,public alertCtrl: AlertController,public modalCtrl: ModalController,public valueGlobal: ValueGlobal,
        public gf: GlobalFunction,
        public _voucherService: voucherService,
        public bookCombo: Bookcombo,
        public booking: Booking,
        public Roomif: RoomInfo,
        public searchHotel: SearchHotel,){
          storage.get('auth_token').then(auth_token => {
            if (auth_token) {
              //this.loadVoucher(auth_token);
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
            }
            
          }
        }
      })
      
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
        this.checkVoucherActive(voucher).then((check) => {
          if(!check){
            if(this.msgMultiVoucherError){
              this.gf.showAlertMessageOnly(this.msgMultiVoucherError);
            } else {
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
              this._voucherService.publicVoucherFlightComboClicked(voucher);
            }
          
        })
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
            let body = { bookingCode: 'FLIGHTCOMBO',code: itemVoucher.code, totalAmount: itemVoucher.rewardsItem.price, comboDetailId: se.bookCombo.ComboId };
            let strUrl = C.urls.baseUrl.urlMobile + '/api/data/validpromocode';
            se.gf.RequestApi('POST', strUrl, headers, body, 'AdddiscountPage', 'loadUserInfo').then((data) => {
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

    loadVoucher(auth_token){
      let url = `${C.urls.baseUrl.urlMobile}/api/dashboard/GetRewardItems`;
      let text = "Bearer " + auth_token;
      let  headers =
      {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
      }
      this.gf.RequestApi('GET', url, headers, {}, 'myvoucher', 'loadVoucher').then((data)=> {
        console.log(data);
        if(data && data.length >0){
          data.forEach(element => {
            element.validdateDisplay = moment(element.to).format('DD-MM-YYYY');
          });
          this.vouchers = [...data];
          this.zone.run(()=>{
            this._voucherService.hasVoucher = this._voucherService.vouchers && this._voucherService.vouchers.length >0;
          })
        }
        
        //this.vouchersClaimed = data;
        //this.loadvoucherdone = true;
      })
    }

    loadVoucherClaimed(auth_token){
      let url = `${C.urls.baseUrl.urlMobile}/api/dashboard/GetVoucherClaimed`;
      let text = "Bearer " + auth_token;
      let  headers =
      {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
      };
      let body = { bookingCode: 'VMB' ,codes: [], totalAmount: 0, comboDetailId: 0,
      couponData: {
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
      }, };
      this.gf.RequestApi('POST', url, headers, body, 'myvoucher', 'loadVoucher').then((data)=> {
        //console.log(data);
        //this.vouchersClaimed = data;
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
            this._voucherService.hasVoucher = this._voucherService.vouchers.some(v => v.isActive);
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