import { Component, NgZone, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';
import * as $ from 'jquery';
import { BizTravelService } from 'src/app/providers/bizTravelService';
import { GlobalFunction } from 'src/app/providers/globalfunction';
import { C } from './../../providers/constants';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-paymentdetail',
  templateUrl: './paymentdetail.page.html',
  styleUrls: ['./paymentdetail.page.scss'],
})
export class PaymentDetailPage implements OnInit {
  typeSearch: any=0;
  showDetailTransaction: boolean = false;
  pageIndex = 1;
  pageSize = 50;
  private _infiniteScroll: any;
  emptyCredit: boolean;
  emptyDedit: boolean;
  loadDataDone: boolean = false;
  itemskeleton = [1,2,3,4,5,6,7,8]
  constructor(private navCtrl :NavController,
    public bizTravelService: BizTravelService,
    public gf: GlobalFunction,
    private storage: Storage,
    private zone: NgZone) { 
      this.bizTravelService.actionHistory = [];
      this.loadData();
    }

  ngOnInit() {
  }

  loadData(){
    this.storage.get('auth_token').then(auth_token => {
      var text = "Bearer " + auth_token;
      var  headers =
      {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
      }
      if (auth_token && this.bizTravelService.bizAccount) {
        this.gf.showLoading();
        this.gf.RequestApi('GET', C.urls.baseUrl.urlMobile + '/api/Dashboard/GetBizTransactions?type=0&pageIndex='+this.pageIndex+'&pageSize='+this.pageSize, headers, {}, 'companyinfo', 'GetBizTransactions').then((data) => {
          this.loadDataDone = true;
          this.gf.hideLoading();
          if(data && data.length >0){
            if(this.bizTravelService.actionHistory && this.bizTravelService.actionHistory.length >0){
              this.bizTravelService.actionHistory = [...this.bizTravelService.actionHistory,...data]; 
            }else{
              this.bizTravelService.actionHistory = data; 
            }
           if(this.bizTravelService.actionHistory && this.bizTravelService.actionHistory.length >0){
            this.bizTravelService.actionHistory.forEach((e) => {
                e.BookingDateDisplay = moment(e.created).format('DD-MM-YYYY');
                e.BookingHourDisplay = moment(e.created).format('hh:mm:ss');
              })
              this.zone.run(() => this.bizTravelService.actionHistory.sort((a,b) => {
                  let direction = -1;
                  return moment(a['created']).diff(b['created'])* direction;
                })
              );
              this.emptyCredit = this.bizTravelService.actionHistory.some((cre) => { return cre.actionType ==1}) ? false : true;
              this.emptyDedit = this.bizTravelService.actionHistory.some((cre) => { return cre.actionType ==2}) ? false : true;
            }
          }
        })
      }
    })
  }

  goback(){
    this.navCtrl.back();
  }

  showDetail(){
    this.showDetailTransaction = !this.showDetailTransaction;
  }

  /**
   * 
   * @param type 0 - tất cả; 1 - tiền vào; 2 - tiền ra
   */
  filterItem(type){
    this.typeSearch = type;
    if(type ==0){
      $('.btn-all').siblings().removeClass('btn-active');
      $('.btn-all').addClass('btn-active');
    }else if(type ==1){
      $('.btn-in').siblings().removeClass('btn-active');
      $('.btn-in').addClass('btn-active');
    }else if(type ==2){
      $('.btn-out').siblings().removeClass('btn-active');
      $('.btn-out').addClass('btn-active');
    }
  }
  loadMorePage(infiniteScroll){
    this.zone.run(() => {
          this.pageIndex++;
          this.loadData();
            this._infiniteScroll = infiniteScroll;
            infiniteScroll.target.complete();
    })
  }

  refresh(){
    this.pageIndex = 1;
    this.loadDataDone = false;
    this.bizTravelService.actionHistory = [];
    this.loadData();
  }
}
