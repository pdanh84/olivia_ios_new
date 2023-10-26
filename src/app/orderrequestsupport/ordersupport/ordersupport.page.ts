import { Component, OnInit } from '@angular/core';
import { NavController,LoadingController,AlertController } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import { C } from '../../providers/constants';
import {  ActivityService, GlobalFunction} from '../../providers/globalfunction';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-ordersupport',
  templateUrl: './ordersupport.page.html',
  styleUrls: ['./ordersupport.page.scss'],
})
export class OrdersupportPage implements OnInit {
  booking_id="";cus_email;cus_name;cus_phone;note="";requestType;
  public loader: any;stt
  isFlyBooking = false;
  constructor(public navCtrl: NavController,public alertCtrl: AlertController, private storage: Storage,public loadingCtrl: LoadingController,public activityService: ActivityService , private activatedRoute: ActivatedRoute,
    public gf: GlobalFunction) { 
    this.booking_id=this.activityService.objPaymentMytrip.trip.booking_id;
    this.cus_email=this.activityService.objPaymentMytrip.trip.cus_email;
    this.cus_name=this.activityService.objPaymentMytrip.trip.cus_name;
    this.cus_phone=this.activityService.objPaymentMytrip.trip.cus_phone;
    this.isFlyBooking = this.activityService.objPaymentMytrip.trip.isFlyBooking;
  }

  ngOnInit() {
    this.stt = this.activatedRoute.snapshot.paramMap.get('stt');
  }
  goback() {
  
    this.navCtrl.back();

  }
  ionViewDidEnter() {
    // ion-select customizing
    const ionSelects: any = window.document.querySelectorAll('ion-select');
    ionSelects.forEach((ionSelect) => {
      const selectIconInner = ionSelect.shadowRoot.querySelector('.select-icon');
      const selectTextInner = ionSelect.shadowRoot.querySelector('.select-text');
      const selectTextPlace = ionSelect.shadowRoot.querySelector('.select-placeholder');
      if (selectIconInner) {
        selectIconInner.setAttribute('style', ' position: absolute;right: 12px;top:13px');
      }
    
      if (selectTextPlace) {
        selectTextInner.setAttribute('style', '   opacity: 1;position: absolute;top:13px;  font-size: 14px !important;   letter-spacing: -0.28px !important;     color: #333 !important;  line-height: 1.5 !important');
      }
    });
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }
  next(){
    var se=this;
    if(!this.requestType){
      // alert('Vui lòng chọn thông tin cần thay đổi');
      this.showWarning('Vui lòng chọn thông tin cần thay đổi');
      return;
    }
    if(!this.note){
      // alert('Vui lòng nhập nội dung cần hỗ trợ');
      this.showWarning('Vui lòng nhập nội dung cần hỗ trợ');
      return;
    }
    this.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        this.presentLoading()
        let body =
        {
          bookingCode: this.booking_id,
          customerEmail:this.cus_email,
          customerName: this.cus_name,
          customerPhone: this.cus_phone,
          requestContent: this.note,
          requestType: this.requestType,
          sourceRequest: "App"
        };
        let urlPath = C.urls.baseUrl.urlMobile + '/app/CRMOldApis/CreateSupportRequest';
              let headers = { 
                'cache-control': 'no-cache',
                'content-type': 'application/json'
              };
              this.gf.RequestApi('POST', urlPath, headers, body, 'orderSupport', 'CreateSupportRequest').then((data)=>{

          if(data)
          {
            if(se.loader)
            {
              se.loader.dismiss();
            }
            se.navCtrl.navigateBack(['/ordersupportdone']);
          }
         
        })
      }
    })
  }
  getValue(event){
    this.requestType=event.detail.value;

  }
  async showWarning(msg) {
    let alert = await this.alertCtrl.create({
      header: "iVIVU.com",
      message: msg,
      cssClass: "cls-alert-flightcomboreview",
      buttons: [{
        text: 'Hủy',
        role: 'Hủy',
        handler: () => {
          alert.dismiss();
        }
      },
      {
        text: 'OK',
        role: 'OK',
        handler: () => {
          alert.dismiss();
        }
      }
      ]
    });
    alert.present();
  }
}

