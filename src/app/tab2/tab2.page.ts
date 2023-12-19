import { Component, OnInit, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, Platform, LoadingController, ModalController } from '@ionic/angular';

import { SearchHotel, ValueGlobal } from './../providers/book-service';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';

import { NetworkProvider } from './../network-provider.service';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import * as moment from 'moment';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { tourService } from './../providers/tourService';
var document:any;
@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  private subscription: Subscription;
  ishide = false;
  public json1:any = [];
  public jsontemp:any = [];
  nodata = false;
  nodatablog = false;
  dataList:any = [];
  listhotels = "";
  listhotelIdInternal = "";
  jsonhtprice:any = [];
  jsonhtprice1;
  istext = false;
  istextblog = false;
  public itemsSkeleton = [1,2,3,4,5];
 
  intervalID;
  myloader;
  public isConnected: boolean = true;
  public activeTabTrip = 1;
  public tablike: string = "hotellike"; arrblog
  cin: any;
  datecin: any;
  cout: any;
  datecout: any;
  loginuser: any;
  nodataplace: boolean = false;
  arrplace: any = [];
  istextplace: boolean = false;
  slideData: any;
  ishidetour: boolean = false;
  nodatatour: boolean = false;
  constructor(public platform: Platform, public navCtrl: NavController, public storage: Storage, public zone: NgZone, public searchhotel: SearchHotel, public gf: GlobalFunction, public valueGlobal: ValueGlobal,
     public loadingCtrl: LoadingController, private socialSharing: SocialSharing,
    public networkProvider: NetworkProvider, public router: Router, public modalCtrl: ModalController, public tourService: tourService) {
    this.platform.resume.subscribe(async () => {
      this.ionViewWillEnter();
    })
  }
  ionViewDidLoad() {
    let elements = window.document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'flex';
      });
    }
    //google analytic
    this.gf.googleAnalytion('hotel-like', 'Search', '');
  }

  async presentLoadingData() {
    this.myloader = await this.loadingCtrl.create({
    });
    this.myloader.present();
  }
  
  ionViewWillEnter() {
    this.gf.clearActivatedTab();
    this.storage.remove('tab2_listHotelLike');
   
    this.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        this.loginuser = auth_token;
      } else {
        this.loginuser = null;
      }

    });
    this.nodata = false;
    this.json1 = [];
    this.istext = false;
    this.istextblog = false;
    this.ishide = false;
    this.ishidetour =false;
   
    if (this.networkProvider.isOnline()) {
      this.isConnected = true;
      
      this.gf.setNetworkStatus(true);
      setTimeout(() => {
        this.getlisthotellike();
        this.getlisttourlike();
      }, 100)
      this.arrblog=[];
      this.getblog();
      //this.getPlace();
    } else {
      this.isConnected = false;
      
      this.gf.setNetworkStatus(false);
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
    }
    //});
    //});
    // if(this.gf.getNetworkStatus()){
    //   setTimeout(()=>{
    //     this.getlisthotellike();
    //   },100)
    // }
  }
  ionViewWillLeave() {
    this.zone.run(() => {
      clearInterval(this.intervalID);
    })
  }
  ionViewDidEnter() {

  }
  itemSelected(msg) {
    if (!this.networkProvider.isOnline()) {
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      return;
    }
    this.searchhotel.hotelID = msg.HotelId;
    this.searchhotel.rootPage = "likepage";
    this.valueGlobal.notRefreshDetail = false;
    var item: any ={};
    item.adult=this.searchhotel.adult;
    item.child=this.searchhotel.child;
    item.arrchild= this.searchhotel.arrchild
    if(msg.Avatar){
      item.Avatar = (msg.Avatar.toLocaleString().trim().indexOf("http") == -1) ? 'https:' + msg.Avatar : msg.Avatar;
    }
    else{
      item.Avatar='https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage-110x110.jpg';
    }
    var checkInDate=new Date(this.searchhotel.CheckInDate);
    var checkOutDate=new Date(this.searchhotel.CheckOutDate);
    item.CheckInDate=this.searchhotel.CheckInDate
    item.CheckOutDate=this.searchhotel.CheckOutDate;
    item.checkInDate=moment(checkInDate).format('DD')+ ' '+ 'tháng' + ' ' +  moment(checkInDate).format('MM') +', ' +moment(checkInDate).format('YYYY')
    item.checkOutDate=moment(checkOutDate).format('DD')+ ' '+ 'tháng' + ' ' +  moment(checkOutDate).format('MM') +', ' +moment(checkOutDate).format('YYYY')
    item.id=msg.HotelId;
    item.name=msg.Name;
    item.isType=0;
    this.gf.setCacheSearch(item,0);
    this.navCtrl.navigateForward('/hoteldetail/' + msg.HotelId);
    //this.navCtrl.navigateForward('HoteldetailPage', id1);
  }
  unlikeItem(id) {
    if (!this.networkProvider.isOnline()) {
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      return;
    }
    var se = this;
    //se.jsontemp = se.json1;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        for (let i = 0; i < se.json1.length; i++) {
          if (se.json1[i].HotelId == id) {
            se.json1[i].Liked=false;
            break;
          }
        }
        var text = "Bearer " + auth_token;
       
        let urlStr = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteHotelByUser';
            let headers = { 
              'cache-control': 'no-cache',
              'content-type': 'application/json',
              authorization: text
             };
            this.gf.RequestApi('POST', urlStr, headers, { hotelId: id }, 'tab2', 'unlikeItem').then((data)=>{

          // se.json1 = [];
       

        });
      }
    });
  }
  likeItem(id) {
    if (!this.networkProvider.isOnline()) {
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      return;
    }
    var se = this;
    //se.jsontemp = se.json1;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        for (let i = 0; i < se.json1.length; i++) {
          if (se.json1[i].HotelId == id) {
            se.json1[i].Liked=true;
            break;
          }
        }
        var text = "Bearer " + auth_token;

        let urlStr = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/AddFavouriteHotel';
            let headers = { 
              'cache-control': 'no-cache',
              'content-type': 'application/json',
              authorization: text
             };
            this.gf.RequestApi('POST', urlStr, headers, { hotelId: id }, 'tab2', 'unlikeItem').then((data)=>{
          // se.json1 = [];
       

        });
      }
    });
  }
  setItemLikeStatus(id) {
    this.json1.forEach(el => {
      if (el.HotelId == id) {
        el.Liked = !el.Liked;
      }
    });
  }
  getListHotelLikeWithToken(auth_token){
    let se = this;
    se.loginuser = auth_token;
        var text = "Bearer " + auth_token;
        let urlStr = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteHotelByUser';
            let headers = { 
              'cache-control': 'no-cache',
              'content-type': 'application/json',
              authorization: text
             };
            this.gf.RequestApi('GET', urlStr, headers, { }, 'tab2', 'getListHotelLikeWithToken').then((data)=>{
              if(data && data.statusCode ==401){
                this.gf.refreshTokenNew(auth_token).then((newtoken)=>{
                  if(newtoken){
                    this.storage.remove('auth_token').then(()=>{
                      this.storage.set('auth_token', newtoken.auth_token).then(()=>{ 
                        this.getListHotelLikeWithToken(newtoken.auth_token);
                      })
                    })
                  }
                })
              }else{
                var arr = data;
                if(arr && arr.length >0){
                  var chuoi = "";
                  for (let i = 0; i < arr.length; i++) {
                    if (i == arr.length - 1) {
                      chuoi = chuoi + arr[i];
                    } else {
                      chuoi = chuoi + arr[i] + ",";
                    }
      
                  }
                  se.zone.run(() => {
                    if (chuoi) {
                      // se.nodata = false;
                      se.postdata(chuoi);
                    }
                    else {
                      se.nodata = true;
                      if (se.myloader) {
                        se.myloader.dismiss();
                      }
                    }
      
                  });
                }else{
                  se.nodata = true;
                  se.ishide = true;
                  if (se.myloader) {
                    se.myloader.dismiss();
                  }
                }
              }
         
          

        });
  }

  checkNewDataHotelLike(auth_token, cachedata) {
    let se = this;
      var text = "Bearer " + auth_token;
      let urlStr = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteHotelByUser';
          let headers = { 
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
           };
          this.gf.RequestApi('GET', urlStr, headers, { }, 'tab2', 'getlisthotellike').then((data)=>{
            if(data && data.statusCode ==401){
              this.gf.refreshTokenNew(auth_token).then((newtoken)=>{
                if(newtoken){
                  this.storage.remove('auth_token').then(()=>{
                    this.storage.set('auth_token', newtoken.auth_token).then(()=>{ 
                      this.checkNewDataHotelLike(newtoken.auth_token, cachedata);
                    })
                  })
                }
              })
            }
            else if(data && data.error){
              this.gf.refreshTokenNew(auth_token).then((newtoken)=>{
                if(newtoken){
                  this.storage.remove('auth_token').then(()=>{
                    this.storage.set('auth_token', newtoken.auth_token).then(()=>{ 
                      this.checkNewDataHotelLike(newtoken.auth_token, cachedata);
                    })
                  })
                }
              })
            }
            else{
              var arr = data;
              var chuoi = "";
              if(arr && arr.length >0){
                chuoi = arr.join(',');
              }
              return cachedata != chuoi;
            }
      });
  }

  getlisthotellike() {
    var se = this;
    //se.presentLoadingData();
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
       
        se.storage.get('tab2_listHotelLike').then((datalike)=>{
           //Ưu tiên load cache
          if(datalike && datalike.length >0){
            let chuoi = datalike;
            se.postdata(chuoi);

            setTimeout(()=>{
              // if(se.checkNewDataHotelLike(auth_token, datalike)){

              // }
            }, 30 * 1000)
          }else{
            //Không có cache thì loadapi
            se.loginuser = auth_token;
            var text = "Bearer " + auth_token;
            let urlStr = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteHotelByUser';
                let headers = { 
                  'cache-control': 'no-cache',
                  'content-type': 'application/json',
                  authorization: text
                 };

                 try {
                  this.gf.RequestApi('GET', urlStr, headers, { }, 'tab2', 'getlisthotellike').then((data)=>{
                    if(data && data.statusCode ==401){
                      this.gf.refreshTokenNew(auth_token).then((newtoken)=>{
                        if(newtoken){
                          this.storage.remove('auth_token').then(()=>{
                            this.storage.set('auth_token', newtoken.auth_token).then(()=>{ 
                              this.getListHotelLikeWithToken(newtoken.auth_token);
                            })
                          })
                        }else {
                          alert(newtoken)
                        }
                      })
                    }
                    else if(data && data.error){
                      this.gf.refreshTokenNew(auth_token).then((newtoken)=>{
                        if(newtoken){
                          this.storage.remove('auth_token').then(()=>{
                            this.storage.set('auth_token', newtoken.auth_token).then(()=>{ 
                              this.getListHotelLikeWithToken(newtoken.auth_token);
                            })
                          })
                        }else {
                          alert(newtoken)
                        }
                      })
                    }
                    else{
                      var arr = data;
                      
                      if(arr && arr.length >0){
                        var chuoi = "";
                        chuoi = arr.join(',');
                        // se.storage.remove('tab2_listHotelLike').then(()=>{
                        //   se.storage.set('tab2_listHotelLike', chuoi);
                        // })
                        se.zone.run(() => {
                          if (chuoi) {
                            // se.nodata = false;
                            se.postdata(chuoi);
                          }
                          else {
                            se.nodata = true;
                            if (se.myloader) {
                              se.myloader.dismiss();
                            }
                          }
            
                        });
                      }else{
                        se.nodata = true;
                        se.ishide = true;
                        if (se.myloader) {
                          se.myloader.dismiss();
                        }
                      }
                    }
                  });
                 } catch (error) {
                  se.nodata = true;
                  se.ishide = true;
                 }
                
          }
        })

        
      }
      else {
        se.nodata = true;
        se.istext = true;
        se.nodatablog = true;
        se.istextblog = true;
        se.arrblog = [];
        if (se.myloader) {
          se.myloader.dismiss();
        }
        //se.refreshToken();
      }

    });
    setTimeout(() => {
      if (se.myloader) {
        se.myloader.dismiss();
      }
    }, 1000)
  }

  getListTourLikeWithToken(auth_token){
    let se = this;
    se.loginuser = auth_token;
        var text = "Bearer " + auth_token;
        let urlStr = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteTourByUser';
        let headers = { 
          'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        };
        this.gf.RequestApi('GET', urlStr, headers, {}, 'tab2', 'getblog').then((data)=>{
          if(data && data.statusCode ==401){
            this.gf.refreshTokenNew(auth_token).then((newtoken)=>{
              if(newtoken){
                this.storage.remove('auth_token').then(()=>{
                  this.storage.set('auth_token', newtoken.auth_token).then(()=>{ 
                    this.getListTourLikeWithToken(newtoken.auth_token);
                  })
                })
              }else {

              }
            })
          }else{
            var arr = data;
            if (arr && arr.length > 0) {
              var chuoi = "";
              for (let i = 0; i < arr.length; i++) {
                if (i == arr.length - 1) {
                  chuoi = chuoi + arr[i];
                } else {
                  chuoi = chuoi + arr[i] + ",";
                }
              }
            
              se.loadTourListByListId(chuoi)
            } else {
              se.zone.run(() => {
                se.ishidetour = true;
                se.nodatatour = true;
              })

              // if (se.myloader) {
              //   se.myloader.dismiss();
              // }
            }
          }
        });
  }

  getlisttourlike() {
    var se = this;
    //se.presentLoadingData();
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.loginuser = auth_token;
        var text = "Bearer " + auth_token;
        let urlStr = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteTourByUser';
        let headers = { 
          'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        };
        try {
          this.gf.RequestApi('GET', urlStr, headers, {}, 'tab2', 'getblog').then((data)=>{
            if(data && data.statusCode ==401){
              this.gf.refreshTokenNew(auth_token).then((newtoken)=>{
                if(newtoken){
                  this.storage.remove('auth_token').then(()=>{
                    this.storage.set('auth_token', newtoken.auth_token).then(()=>{ 
                      this.getListTourLikeWithToken(newtoken.auth_token);
                    })
                  })
                }else {
  
                }
              })
            }
            else if(data && data.error){
              this.gf.refreshTokenNew(auth_token).then((newtoken)=>{
                if(newtoken){
                  this.storage.remove('auth_token').then(()=>{
                    this.storage.set('auth_token', newtoken.auth_token).then(()=>{ 
                      this.getListTourLikeWithToken(newtoken.auth_token);
                    })
                  })
                }
              })
            }
            else{
              var arr = data;
              if (arr && arr.length > 0) {
                var chuoi = "";
                for (let i = 0; i < arr.length; i++) {
                  if (i == arr.length - 1) {
                    chuoi = chuoi + arr[i];
                  } else {
                    chuoi = chuoi + arr[i] + ",";
                  }
                }
              
                se.loadTourListByListId(chuoi);
                
              } else {
                se.zone.run(() => {
                  se.ishidetour = true;
                  se.nodatatour = true;
                })
  
                // if (se.myloader) {
                //   se.myloader.dismiss();
                // }
              }
            }
          });
        } catch (error) {
          se.zone.run(() => {
            se.ishidetour = true;
            se.nodatatour = true;
           
          })
        }
        
      }
      else {
        se.zone.run(() => {
          se.ishidetour = true;
          se.nodatatour = true;
         
        })
        // if (se.myloader) {
        //   se.myloader.dismiss();
        // }
      }

    });
    setTimeout(() => {
      if (se.myloader) {
        se.myloader.dismiss();
      }
    }, 1000)
  }
  async postdata(chuoi) {
    var se = this;
    let _dataHotelList = await se.storage.get('tab2_listHotelList');
    //console.log(_dataHotelList);
    if(_dataHotelList){
      se.dataList = JSON.parse(_dataHotelList);
      se.executePushData();
    }else{
      let urlStr = C.urls.baseUrl.urlGet + '/hotelslist?hotelIds=' + chuoi;
      let headers = { };
      try {
        this.gf.RequestApi('GET', urlStr, headers, { }, 'tab2', 'getlisthotellike').then((data)=>{
          var json = data;
          se.dataList = json.List;
          se.executePushData();
        });
      } catch (error) {
        se.dataList = [];
        se.ishide = true;
      }
     
    }
    

  }

  executePushData(){
    let se = this;
      se.pushdata();

      se.listhotels = "";
      se.listhotelIdInternal = "";
      for (let i = 0; i < se.dataList.length; i++) {
        if (i == se.dataList.length - 1) {
          if (se.dataList[i].EANCode != "") {
            se.listhotels = se.listhotels + se.dataList[i].EANCode;
          }
          se.listhotelIdInternal = se.listhotelIdInternal + se.dataList[i].HotelId;

        } else {
          if (se.dataList[i].EANCode != "") {
            se.listhotels = se.listhotels + se.dataList[i].EANCode + ",";
          }
          se.listhotelIdInternal = se.listhotelIdInternal + se.dataList[i].HotelId + ",";
        }
      }
      se.getHotelprice();
  }

  pushdata() {

    var se = this;
    this.json1 = [];
    se.zone.run(() => {
      for (let index = 0; index < se.dataList.length; index++) {

        if (se.dataList[index].Avatar) {
          if(se.dataList[index].Avatar.indexOf('travelapi') == -1){
            se.dataList[index].Avatar = (se.dataList[index].Avatar.toLocaleString().trim().indexOf("http") != -1) ? se.dataList[index].Avatar : 'https:' + se.dataList[index].Avatar;
          }
        } else {
          se.dataList[index].Avatar = "https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage.png";
        }

        if (se.dataList[index].DealType) {
          if (se.dataList[index].DealPrice) {
            se.dataList[index].DealPrice = se.dataList[index].DealPrice.toLocaleString();
          }

        }
        switch (se.dataList[index].Rating) {
          case 50:
            se.dataList[index].Rating = "./assets/star/ic_star_5.png";
            break;
          case 45:
            se.dataList[index].Rating = "./assets/star/ic_star_4.5.png";
            break;
          case 40:
            se.dataList[index].Rating = "./assets/star/ic_star_4.png";
            break;
          case 35:
            se.dataList[index].Rating = "./assets/star/ic_star_3.5.png";
            break;
          case 30:
            se.dataList[index].Rating = "./assets/star/ic_star_3.png";
            break;
          case 25:
            se.dataList[index].Rating = "./assets/star/ic_star_2.5.png";
            break;
          case 20:
            se.dataList[index].Rating = "./assets/star/ic_star_2.png";
            break;
          case 15:
            se.dataList[index].Rating = "./assets/star/ic_star_1.5.png";
            break;
          case 10:
            se.dataList[index].Rating = "./assets/star/ic_star.png";
            break;
          case 5:
            se.dataList[index].Rating = "./assets/star/ic_star_0.5.png";
            break;
          default:
            break;
        }
        var item;
        if (se.dataList[index].DealType) {

          if (se.dataList[index].Address) {
            item = { Avatar: se.dataList[index].Avatar, Name: se.dataList[index].HotelName, AvgPoint: se.dataList[index].Point, DealPrice: se.dataList[index].DealPrice, DealType: se.dataList[index].DealTypeSubstring, SubLocation: se.dataList[index].Address, Rating: se.dataList[index].Rating, HotelId: se.dataList[index].HotelId, Liked: true,StyleTag: se.dataList[index].StyleTag };
          } else {
            item = { Avatar: se.dataList[index].Avatar, Name: se.dataList[index].HotelName, AvgPoint: se.dataList[index].Point, DealPrice: se.dataList[index].DealPrice, DealType: se.dataList[index].DealTypeSubstring, SubLocation: '', Rating: se.dataList[index].Rating, HotelId: se.dataList[index].HotelId, Liked: true,StyleTag: se.dataList[index].StyleTag };
          }
        }
        else {
          if (se.dataList[index].Address) {
            item = { Avatar: se.dataList[index].Avatar, Name: se.dataList[index].HotelName, AvgPoint: se.dataList[index].Point, DealPrice: se.dataList[index].DealPrice, DealType: se.dataList[index].DealTypeSubstring, SubLocation: se.dataList[index].Address, Rating: se.dataList[index].Rating, HotelId: se.dataList[index].HotelId, RoomNameSubString: "", MinPriceOTAStr: se.dataList[index].MinPrice ? se.dataList[index].MinPrice.toLocaleString().replace("VND", "").trim() : se.dataList[index].MaxPrice.toLocaleString().replace("VND", "").trim(), PromotionDescriptionSubstring: "", MinPriceTAStr: se.dataList[index].MinPrice ? se.dataList[index].MinPrice.toLocaleString().replace("VND", "").trim() : se.dataList[index].MaxPrice.toLocaleString().replace("VND", "").trim(), Liked: true,StyleTag: se.dataList[index].StyleTag };
          } else {
            item = { Avatar: se.dataList[index].Avatar, Name: se.dataList[index].HotelName, AvgPoint: se.dataList[index].Point, DealPrice: se.dataList[index].DealPrice, DealType: se.dataList[index].DealTypeSubstring, SubLocation: '', Rating: se.dataList[index].Rating, HotelId: se.dataList[index].HotelId, RoomNameSubString: "", MinPriceOTAStr: se.dataList[index].MinPrice ? se.dataList[index].MinPrice.toLocaleString().replace("VND", "").trim() : se.dataList[index].MaxPrice.toLocaleString().replace("VND", "").trim(), PromotionDescriptionSubstring: "", MinPriceTAStr: se.dataList[index].MinPrice ? se.dataList[index].MinPrice.toLocaleString().replace("VND", "").trim() : se.dataList[index].MaxPrice.toLocaleString().replace("VND", "").trim(), Liked: true,StyleTag: se.dataList[index].StyleTag };
          }
        }
        se.json1.push(item);
      }
      se.ishide = true;
      if (se.myloader) {
        se.myloader.dismiss();
      }
    });

  }
  async getHotelprice() {
    var se = this;
    var options;

    let _dataHotelPrice = await se.storage.get('tab2_listHotelPrice');
    console.log(_dataHotelPrice);
    if(_dataHotelPrice){
      se.jsonhtprice = JSON.parse(_dataHotelPrice);
      se.zone.run(() => se.fillDataPrice());
      se.ishide = true;
    }else{
      if(!se.searchhotel.CheckInDate){
        se.cin = new Date();
        var rescin = se.cin.setTime(se.cin.getTime() + (24 * 60 * 60 * 1000));
        var datein = new Date(rescin);
        se.cin = moment(datein).format('YYYY-MM-DD');
        se.datecin = new Date(rescin);
  
        se.cout = new Date();
        var res = se.cout.setTime(se.cout.getTime() + (2 * 24 * 60 * 60 * 1000));
        var date = new Date(res);
        se.cout = moment(date).format('YYYY-MM-DD');
        se.datecout = new Date(res);
    }
      var form = {
        RoomNumber: '1',
        IsLeadingPrice: '',
        ReferenceClient: '',
        Supplier: 'IVIVU',
        CheckInDate: se.searchhotel.CheckInDate ?se.searchhotel.CheckInDate : se.cin ,
        CheckOutDate: se.searchhotel.CheckOutDate ? se.searchhotel.CheckOutDate : se.cout,
        CountryID: '',
        CityID: '',
        NationalityID: '',
        'RoomsRequest[0][RoomIndex]': '0',
        'RoomsRequest[0][Adults][value]': se.searchhotel.adult ? se.searchhotel.adult : '2' ,
        'RoomsRequest[0][Child][value]': se.searchhotel.child ? se.searchhotel.child : '0',
        StatusMethod: '2',
        'CityCode': '',
        CountryCode: 'VN',
        NoCache: 'false',
        SearchType: '2',
        HotelIds: se.listhotels,
        HotelIdInternal: se.listhotelIdInternal
      };
      if (this.searchhotel.arrchild) {
        for (var i = 0; i < this.searchhotel.arrchild.length; i++) {
          form["RoomsRequest[0][AgeChilds][" + i + "][value]"] = + this.searchhotel.arrchild[i].numage;
        }
      }
  
      let body = `RoomNumber=1&IsLeadingPrice=''&ReferenceClient=''&Supplier='IVIVU'`
      +`&CheckInDate=${se.searchhotel.CheckInDate ? se.searchhotel.CheckInDate : se.cin}&CheckOutDate=${se.searchhotel.CheckOutDate ? se.searchhotel.CheckOutDate : se.cout}&CountryID=''&CityID=''&NationalityID=''&RoomsRequest[0][RoomIndex]=0&`
      +`RoomsRequest[0][Adults][value]=${se.searchhotel.adult ? se.searchhotel.adult : '2'}&RoomsRequest[0][Child][value]=${se.searchhotel.child ? se.searchhotel.child : '0'}&StatusMethod=2&`
      +`CityCode=''&CountryCode='VN'&NoCache=false&SearchType=2&HotelIds=${se.listhotels}&HotelIdInternal=${se.listhotelIdInternal}`;
      
      if (this.searchhotel.arrchild) {
        for (var i = 0; i < this.searchhotel.arrchild.length; i++) {
          body += `RoomsRequest[0][AgeChilds]["${i}"][value]=${se.searchhotel.arrchild[i].numage}`;
        }
      }
  
      let urlStr = C.urls.baseUrl.urlContracting + '/api/contracting/HotelsSearchPriceAjax';
      let headers = { 'content-type' : 'application/x-www-form-urlencoded', accept: '*/*'};
      try {
        this.gf.RequestApi('POST', urlStr, headers, body, 'tab2', 'getlisthotellike').then((data)=>{
       
          se.zone.run(() => {
            se.jsonhtprice = [];
            se.jsonhtprice1 = data;
            if (se.jsonhtprice1.HotelListResponse) {
              se.jsonhtprice1 = se.jsonhtprice1.HotelListResponse.HotelList.HotelSummary;
              for (var i = 0; i < se.jsonhtprice1.length; i++) {
                let itemprice = se.jsonhtprice1[i];
                //Add vào list ks có giá
                se.jsonhtprice.push(itemprice);
    
              }
              // se.storage.remove('tab2_listHotelPrice').then(()=>{
              //   se.storage.set('tab2_listHotelPrice', JSON.stringify(se.jsonhtprice));
              // })
              //Bind giá vào list ks đã search
              se.zone.run(() => se.fillDataPrice());
              
            }
            se.ishide = true;
          });
        });
      } catch (error) {
        se.zone.run(() => {
          se.jsonhtprice = [];
          se.ishide = true;
      });
      }
     
    }

    

  }
  fillDataPrice() {
    var se = this;
    for (let index = 0; index < se.dataList.length; index++) {
      se.json1[index].HasCheckPrice = true;
      for (let i = 0; i < se.jsonhtprice.length; i++) {
        //Chỉ bind lại giá cho hotel, combo bỏ qua
        if (se.json1[index] && se.json1[index].HotelId == se.jsonhtprice[i].HotelId) {
          se.json1[index].MinPriceOTAStr = se.jsonhtprice[i].MinPriceOTAStr;
          se.json1[index].MinPriceTAStr = se.jsonhtprice[i].MinPriceTAStr;
          se.json1[index].RoomNameSubString = se.jsonhtprice[i].RoomNameSubString;
          se.json1[index].PromotionDescription = se.jsonhtprice[i].PromotionDescription;
          se.json1[index].PromotionDescriptionSubstring = se.jsonhtprice[i].PromotionDescriptionSubstring;
        }
      }
    }

    //this.pushdata(0, this.json1.length);

  }
  gologin() {
    this.valueGlobal.logingoback = 'HotelLikePage';
    this.navCtrl.navigateForward('login');
  }

  goToLogin() {
    this.valueGlobal.logingoback='/app/tabs/tab2';
    this.storage.remove('auth_token');
    this.storage.remove('email');
    this.storage.remove('username');
    this.storage.remove('jti');
    this.navCtrl.navigateForward('login');
  }

  public async ngOnInit(): Promise<void> {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && (event.url === '/' || event.url === '/tabs/tab2' || event.url === '/app/tabs/tab2')) {
        this.onEnter();
      }
    })
  }
  Selectblog() {
    this.json1=[];
    this.getlisthotellike();
    //this.getPlace();
    this.activeTabTrip = 2;
  }
  Selecthotel() {
    this.getblog();
    //this.getPlace();
    this.activeTabTrip = 1;

  }

  SelectPlace(){
    this.getlisthotellike();
    this.getblog();
    this.activeTabTrip = 3;
  }
  
  getbloglocal() {
    if (this.arrblog.length > 0) {
      var arrtemp:any=[];
      for (let i = 0; i < this.arrblog.length; i++) {
        if (!this.arrblog[i].Like) {
          arrtemp.push(i);
        }
      }
      if (this.arrblog.length == 0) {
        this.nodatablog = true;
        if (this.myloader) {
          this.myloader.dismiss();
        }
      }
    }
    else {
      this.nodatablog = true;
      if (this.myloader) {
        this.myloader.dismiss();
      }
    }
  }
  getBlogLikeWithToken(auth_token){
    let se = this;
    var text = "Bearer " + auth_token;
     
    let urlStr = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteBlogByUser';
    let headers = { 
      'cache-control': 'no-cache',
        'content-type': 'application/json',
        authorization: text
    };
    this.gf.RequestApi('GET', urlStr, headers, {}, 'tab2', 'getblog').then((data)=>{
      if(data && data.statusCode ==401){
        this.gf.refreshTokenNew(auth_token).then((newtoken)=>{
          if(newtoken){
            this.storage.remove('auth_token').then(()=>{
              this.storage.set('auth_token', newtoken).then(()=>{ 
                this.getBlogLikeWithToken(newtoken);
              })
            })
          }else {

          }
        })
      }else{
        se.zone.run(() => {
          se.arrblog = data;
          if (se.arrblog.length > 0) {
            se.nodatablog = false
            for (let index = 0; index < se.arrblog.length; index++) {
              se.arrblog[index].date = moment(se.arrblog[index].date).format('HH:ss DD/MM/YYYY');
              se.arrblog[index].Like = true;
            }
          }
          else {
            se.arrblog = [];
            se.nodatablog = true;
            if (se.myloader) {
              se.myloader.dismiss();
            }
          }
        });
      }
    });
  }

  getblog() {
    var se = this;
    //se.presentLoadingData();
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
     
        let urlStr = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteBlogByUser';
        let headers = { 
          'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        };
        this.gf.RequestApi('GET', urlStr, headers, {}, 'tab2', 'getblog').then((data)=>{
          if(data && data.statusCode ==401){
            this.gf.refreshTokenNew(auth_token).then((newtoken)=>{
              if(newtoken){
                this.storage.remove('auth_token').then(()=>{
                  this.storage.set('auth_token', newtoken).then(()=>{ 
                    this.getBlogLikeWithToken(newtoken);
                  })
                })
              }
            })
          }
          else if(data && data.error){
            this.gf.refreshTokenNew(auth_token).then((newtoken)=>{
              if(newtoken){
                this.storage.remove('auth_token').then(()=>{
                  this.storage.set('auth_token', newtoken).then(()=>{ 
                    this.getBlogLikeWithToken(newtoken);
                  })
                })
              }
            })
          }
          else{
            se.zone.run(() => {
              se.arrblog = data;
              if (se.arrblog.length > 0) {
                se.nodatablog = false
                for (let index = 0; index < se.arrblog.length; index++) {
                  se.arrblog[index].date = moment(se.arrblog[index].date).format('HH:ss DD/MM/YYYY');
                  se.arrblog[index].Like = true;
                }
              }
              else {
                se.arrblog = [];
                se.nodatablog = true;
                if (se.myloader) {
                  se.myloader.dismiss();
                }
              }
            });
          }
        });

      }
      else {
        se.ishide = true;
        se.arrblog = [];
        this.nodatablog = true;
        this.istextblog = true;
        if (se.myloader) {
          se.myloader.dismiss();
        }
      }

    });
    setTimeout(() => {
      if (se.myloader) {
        se.myloader.dismiss();
      }
    }, 1000)
  }
  share(item) {
    this.socialSharing.share('','','', item.url).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
  unlikeItemblog(item) {
    if (!this.networkProvider.isOnline()) {
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      return;
    }
    var se = this;
    // se.jsontemp = se.json1;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.bindItemUnLike(item);
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'POST',
        //   url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteBlogByUser',
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     'postman-token': 'a19ecc0a-cb83-4dd9-3fd5-71062937a931',
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json',
        //     authorization: text
        //   },
        //   body: { postId: item },
        //   json: true
        // };

        let urlStr = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteBlogByUser';
        let headers = { 
          'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        };
        this.gf.RequestApi('POST', urlStr, headers, { postId: item }, 'tab2', 'getblog').then((data)=>{
        });
      }
    });
  }
  likeItemblog(item) {
    if (!this.networkProvider.isOnline()) {
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      return;
    }
    var se = this;
    // se.jsontemp = se.json1;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.bindItemLike(item);
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'POST',
        //   url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/AddFavouriteBlog',
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     'postman-token': 'a19ecc0a-cb83-4dd9-3fd5-71062937a931',
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json',
        //     authorization: text
        //   },
        //   body: { postId: item },
        //   json: true
        // };

        let urlStr = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/AddFavouriteBlog';
        let headers = { 
          'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        };
        this.gf.RequestApi('POST', urlStr, headers, { postId: item }, 'tab2', 'likeItemblog').then((data)=>{
        });
      }
    });
  }
  itemblogclick(item) {
    this.valueGlobal.urlblog = item.url;
    this.navCtrl.navigateForward('/blog/' + item.id);
    //google analytic
    this.gf.googleAnalytion('blog', 'Search', '');
  }
  public async onEnter(): Promise<void> {
    this.json1 = [];
    this.nodata = false;
    this.istext = false;
    this.istextblog = false;
    this.ishide = false;
    //this.getlisthotellike();
    //this.getblog();

  }
  bindItemUnLike(id) {
    for (let i = 0; i < this.arrblog.length; i++) {
      if (this.arrblog[i].id == id) {
        this.arrblog[i].Like = false;
        break;
      }
    }
  }
  bindItemLike(id) {
    for (let i = 0; i < this.arrblog.length; i++) {
      if (this.arrblog[i].id == id) {
        this.arrblog[i].Like = true;
        break;
      }
    }
  }

  refreshToken() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
       
        let urlStr = C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims';
        let headers = { 
          'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        };
        this.gf.RequestApi('GET', urlStr, headers, { }, 'tab2', 'refreshToken').then((data)=>{
            var json=data;
            if (json.auth_token) {
              se.storage.remove('auth_token');
              se.storage.set("auth_token", json.auth_token);
              se.getlisthotellike();
            }
          
        })
      }
    })
  }

  getPlace(){
    var se = this;
    se.getPlaceLikeByUser().then(data => {
      if(data && data.length >0){
        let ids = data.join(',');
        let urlApi = C.urls.baseUrl.urlMobile + '/api/Data/GetPlace?IdPlaces='+ids+'&paging.pageNumber=0&paging.pageSize=50';
        //let urlApi = 'http://192.168.10.121:3400/api/Data/GetPlace?IdPlaces='+ids+'&paging.pageNumber=0&paging.pageSize=500';
        se.gf.RequestApi('GET',urlApi,{},{},'ExperienceSearch', 'loadDataAfterSearchItem').then((data:any)=>{
          if(data && data.data.length >0){
            se.nodataplace =false;
            se.zone.run(()=> {
              se.arrplace = data.data;

              se.arrplace.forEach(element => {
                element.liked = true;
                  if(element.workingHours.length >0){
                    element.workingHoursDisplay = '';
                    element.workingHours.forEach(elementsub => {
                      if(!element.workingHoursDisplay){
                        element.workingHoursDisplay = elementsub.name + ' | '+ elementsub.timeFrom + '-'+ elementsub.timeTo;
                      }else{
                        element.workingHoursDisplay += " , " + elementsub.name + ' | '+ elementsub.timeFrom + '-'+ elementsub.timeTo;
                      }
                    });
                  }
              });
            })
            
          }
        })
      }else{
          se.arrplace=[];
          se.nodataplace = true;
          if (se.myloader) {
            se.myloader.dismiss();
          }
      }
    })
  }

  getPlaceLikeByUser(): Promise<any> {
    var se = this;
    return new Promise((resolve, reject)=>{
      se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
          var text = "Bearer " + auth_token;
          // var options = {
          //   method: 'GET',
          //   url: C.urls.baseUrl.urlMobile + '/api/Data/GetPlaceUserLike',
          //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
          //   headers:
          //   {
          //     'cache-control': 'no-cache',
          //     'content-type': 'application/json',
          //     authorization: text
          //   }
          // };
          let urlStr = C.urls.baseUrl.urlMobile + '/api/Data/GetPlaceUserLike';
          let headers = { 
            'cache-control': 'no-cache',
              'content-type': 'application/json',
              authorization: text
          };
          this.gf.RequestApi('GET', urlStr, headers, { }, 'tab2', 'refreshToken').then((data)=>{

            se.zone.run(() => {
              var ids = data;
              resolve(ids);
            });
          });
  
        }
        else {
          se.arrplace=[];
          this.nodataplace = true;
          this.istextplace = true;
          if (se.myloader) {
            se.myloader.dismiss();
          }
          resolve([]);
        }
  
      });
    })
  }

  async itemListSearchClick(item){
    var se = this;
  }

  unlikePlace(item){
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
            var text = "Bearer " + auth_token;
            var header = { authorization: text};
            var body = item.id;
            let urlLikePlace = C.urls.baseUrl.urlMobile + '/api/Data/UnLikePlace';
            se.gf.RequestApi('POST',urlLikePlace,header,body,'ExperienceSearch', 'unlikePlace').then((data:any)=>{
           
              se.zone.run(()=>{
                item.liked = false;
              })
            })
        }
      })
  }

  likePlace(item){
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
            var text = "Bearer " + auth_token;
            var header = { authorization: text};
            var body = item.id;
            let urlLikePlace = C.urls.baseUrl.urlMobile + '/api/Data/LikePlace';
            se.gf.RequestApi('POST',urlLikePlace,header,body,'ExperienceSearch', 'likePlace').then((data:any)=>{
          
              se.zone.run(()=>{
                item.liked = true;
              })
            })
        }
      })
  }
  loadTourListByListId(listId) {
    let se = this;
    let url = C.urls.baseUrl.urlMobile + '/tour/api/TourApi/SearchTourDestination?lsIdTour=' + listId + `&departuredId=${((this.tourService.itemSearchDepature && this.tourService.itemSearchDepature.Id) ? this.tourService.itemSearchDepature.Id : 37)}`;
    let headers = {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    se.gf.RequestApi('GET', url, headers, null, 'tourlist', 'loadTourListByListId').then((data) => {
      let res = data;
      se.slideData = res.Response;

      se.slideData.forEach(element => {
        let itemmap = this.tourService.listTopSale.filter((item) => item.Id == element.Id);
        if (itemmap && itemmap.length > 0) {
          element.TopSale = itemmap[0].TotalPax;
        }
        if (element.TourTimeName && element.TourTimeName.split(' ').length == 4) {
          let arr = element.TourTimeName.split(' ');
          element.sortTourTime = arr[0] * 1 + arr[2] * 1;
        } else {
          element.sortTourTime = 0;
        }
        if (element.AvartarLink && element.AvartarLink.indexOf('http') == -1) {
          element.AvartarLink = 'https:' + element.AvartarLink;
        }
        element.Liked=true;
        se.convertAvgPoint(element);
      });
      if(se.slideData.length>0){
        se.nodatatour=false;
      }
      se.ishidetour = true;
      se.mapingPriceTour();
    })
  }
  convertAvgPoint(element) {
    if (element.AvgPoint && (element.AvgPoint.toString().length == 1 || element.AvgPoint === 10)) {
      element.AvgPoint = element.AvgPoint + ".0";
    }
  }
  mapingPriceTour() {
    let se = this;
    let headers = {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    if (se.slideData && se.slideData.length > 0) {
      let listIds = se.slideData.map(item => item.Id).join(',');
      se.gf.RequestApiWithQueryString('GET', C.urls.baseUrl.urlMobile + '/tour/api/TourApi/GetMercuriusPriceByTourIds', headers, { TourIds: listIds, date: moment(this.searchhotel.CheckInDate).format('YYYY-MM-DD') }, 'tourList', 'GetMercuriusPriceByTourIds').then((data) => {
        if (data && data.Status == "Success" && data.Response && data.Response.length > 0) {
          this.zone.run(() => {
          for (let index = 0; index < se.slideData.length; index++) {
            const element = se.slideData[index];
            
              data.Response.forEach((p) => {
                if (p.Contract && p.Contract[0] && p.Contract[0].PriceAdult && p.Code == "TO" + element.Id) {
                  element.PriceAdult = p.Contract[0].PriceAdult;
                  if (p.Contract[0].PriceAdult < element.MinPrice) {
                    element.priceShow = se.gf.convertNumberToString(p.Contract[0].PriceAdult);
                  } else {
                    element.priceShow = se.gf.convertNumberToString(element.MinPrice);
                  }
                  element.DepartureTime = moment(p.Contract[0].DepartureTime[0]).format("DD-MM-YYYY");
                  element.sortByTime = p.Contract[0].DepartureTime[0];
  
                }
              })
           
           
          }
            
        })

        }
      })

    }
  }
  itemSelectedTour(msg) {
    if (!this.networkProvider.isOnline()) {
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      return;
    }
    this.tourService.tourDetailId = msg.Id;
    this.tourService.backPage = 'hometour';
    this.navCtrl.navigateForward('/tourdetail');
  }
  likeItemTour(msg) {
    if (!this.networkProvider.isOnline()) {
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      return;
    }
    var se = this;
    //se.jsontemp = se.json1;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        for (let i = 0; i < se.slideData.length; i++) {
          if ( se.slideData[i].Id == msg.Id) {
             se.slideData[i].Liked = true;
            break;
          }
        }
        var text = "Bearer " + auth_token;
  
        let urlStr = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/AddFavouriteTour';
        let headers = { 
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
         };
        this.gf.RequestApi('POST', urlStr, headers, { tourId: msg.Id  }, 'tab2', 'likeItemTour').then((data)=>{
      // se.json1 = [];
   

    });
      }
    });
  }
  unlikeItemTour(msg) {
    if (!this.networkProvider.isOnline()) {
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      return;
    }
    var se = this;
    se.jsontemp = se.json1;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        for (let i = 0; i < se.slideData.length; i++) {
          if (se.slideData[i].Id == msg.Id) {
            se.slideData[i].Liked = false;
            break;
          }
        }
        var text = "Bearer " + auth_token;
        let urlStr = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteTour';
        let headers = { 
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
         };
        this.gf.RequestApi('POST', urlStr, headers, { tourId: msg.Id  }, 'tab2', 'likeItemTour').then((data)=>{
      // se.json1 = [];
   

        });
      }
    });
  }
  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }
}

