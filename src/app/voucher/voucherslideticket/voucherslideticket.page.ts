import { Component,NgZone ,OnInit, EventEmitter, Input} from '@angular/core';
import { Platform, NavController, AlertController,  ToastController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { C } from '../../providers/constants';
import { Bookcombo, SearchHotel, ValueGlobal } from '../../providers/book-service';
import { GlobalFunction } from '../../providers/globalfunction';
import { VoucherDetailPage } from '../voucherdetail/voucherdetail.page';
import { voucherService } from 'src/app/providers/voucherService';
import * as moment from 'moment';
import { ticketService } from 'src/app/providers/ticketService';

@Component({
  selector: 'app-voucherslideticket',
  templateUrl: 'voucherslideticket.page.html',
  styleUrls: ['voucherslideticket.page.scss'],
})

export class VoucherSlideTicketPage implements OnInit{
  @Input() item:any;
    userRewardData:any;
    userInfoData:any;
    CityName: string;
    CountryCode: string;
    public isShowConfirm = false;
    public intervalID;
    vouchers:any = [];
  msgApplyFor: any;
  msgMultiVoucherError='';
  VoucherData: any;
    constructor(public platform: Platform,public navCtrl: NavController,public toastCtrl: ToastController,
        public zone: NgZone,public storage: Storage,public alertCtrl: AlertController,public modalCtrl: ModalController,public valueGlobal: ValueGlobal,
        public gf: GlobalFunction,
        public _voucherService: voucherService,
        public bookCombo: Bookcombo,
        public searchHotel: SearchHotel, public ticketService: ticketService){
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
      if(voucher.rewardsItem.price <= 0 && !voucher.limitUse){
        this.showVoucherDetail(voucher);
      }else{
        if(voucher.applyFor && voucher.applyFor != 'vvc'){
          this.gf.showAlertMessageOnly(`Mã giảm giá chỉ áp dụng cho đơn hàng ${ voucher.applyFor == 'hotel' ? 'khách sạn' : 'tour'}. Quý khách vui lòng chọn lại mã khác!`);
          return;
        } else{
         
          this.gf.showLoading();
          this.checkVoucherActive(voucher).then((check) => {
            this.gf.hideLoading();
            if(!check){
              if(this.msgApplyFor){
                this.gf.showAlertMessageOnly(this.msgApplyFor);
              } 
              else if(this.msgMultiVoucherError){
                
                this.gf.showAlertMessageOnly(this.msgMultiVoucherError);
              } 
              else {
                if(voucher.claimed){//Cảnh báo với voucher đã sử dụng
                  this._voucherService.publicVoucherTicketClicked(voucher);
                }else{
                  this.gf.showAlertMessageOnly('Mã voucher không còn hiệu lực. Vui lòng chọn mã voucher khác!');
                }
                
              }
              
              return;
            }else{
                  voucher.claimed = !voucher.claimed;
                  if (voucher.claimed) {
                    if (this._voucherService.ticketTotalDiscount >= this.ticketService.bookingInfo.booking.totalPriceAfterDiscount) {
                      voucher.claimed = false;
                      alert("Không thể giảm ít hơn 0đ");
                      return;
                    }
                  }
                  if(voucher.claimed && !this.gf.checkExistsItemInArray(this._voucherService.voucherSelected, voucher, 'voucher')){
                    this._voucherService.voucherSelected.push(voucher);
                  }else if(!voucher.claimed && this.gf.checkExistsItemInArray(this._voucherService.voucherSelected, voucher, 'voucher')){
                    this.gf.removeItemInArray(this._voucherService.voucherSelected, voucher);
                  }
                  voucher.rewardsItem.price = this.VoucherData.discount
                  //console.log(this.item);
                  //this._voucherService.itemSelectVoucher.emit(voucher);
                  this._voucherService.publicVoucherTicketClicked(voucher);
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
            let body = {bookingCode: this.ticketService.itemTicketService.objbooking.bookingCode, code: itemVoucher.code, totalAmount: this.ticketService.bookingInfo.booking.totalPriceAfterDiscount,
              couponData: {
                "vvc": {
                  "experienceId": se.ticketService.itemTicketDetail.experienceId,
                  "supplier": se.ticketService.bookingInfo.booking.supplierCode
                }
              }
            };
            let strUrl = C.urls.baseUrl.urlMobile + '/api/data/validpromocode';
            se.gf.RequestApi('POST', strUrl, headers, body, 'AdddiscountPage', 'loadUserInfo').then((data) => {
              var json = data;
              if (json.error == 0) {
                itemVoucher.type = json.data.type;
                se.VoucherData = json.data;
                if(se._voucherService.voucherSelected && se._voucherService.voucherSelected.length >0 && (se._voucherService.voucherSelected.some(v => v.type != json.data.type && v.id != itemVoucher.id) || se._voucherService.voucherSelected.some(v => v.type != 2 && v.id != itemVoucher.id))){
                  se.msgMultiVoucherError = "Chỉ hỗ trợ áp dụng nhiều voucher tiền mặt trên một đơn hàng, Coupon và Voucher khuyến mãi chỉ áp dụng một mã";
                  resolve(false);
                }else{
                  resolve(true);
                }
                
              }
             
              else{
                if(json.msg && itemVoucher.applyFor && itemVoucher.applyFor == 'vvc'){
                  se.msgApplyFor = json.msg;
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
            this._voucherService.hasVoucher = this._voucherService.vouchers.some(v => v.isActive);
          })
        }
        
        //this.vouchersClaimed = data;
        //this.loadvoucherdone = true;
      })
    }

    loadVoucherClaimed(auth_token){
      let se = this;
      let url = `${C.urls.baseUrl.urlMobile}/api/dashboard/GetVoucherClaimed`;
      let text = "Bearer " + auth_token;
      const {  expeCode, packageCode, supplierCode } = this.ticketService.bookingInfo.booking;
      let  headers =
      {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
      };
      let body = {
        bookingCode: this.ticketService.itemTicketService.objbooking.bookingCode, code:"", totalAmount: 0,
        couponData: {
          "vvc": {
            "experienceId":  Number(expeCode.replace('EX', '')),
            "supplier": Number(packageCode.replace('PKG', '')),
            "packageId": supplierCode
          }
        }
      }
      //console.log(headers);
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
          //this._voucherService.publicVoucherRefreshList(1);
            this._voucherService.hasVoucher = this._voucherService.vouchers && this._voucherService.vouchers.length >0;

       

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
          
        }else if(data.error == 401){
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