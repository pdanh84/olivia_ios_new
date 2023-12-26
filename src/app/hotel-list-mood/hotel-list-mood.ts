import { moodService } from './../providers/moodService';
import { topDealService } from './../providers/topDealService';
import { HotellistmoodfilterPage } from './../hotellistmoodfilter/hotellistmoodfilter.page';
import { OverlayEventDetail } from '@ionic/core';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, AlertController, Platform, LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from '../providers/auth-service';
import * as moment from 'moment';
import { ValueGlobal, SearchHotel } from '../providers/book-service';
import { C } from './../providers/constants';
import { Storage } from '@ionic/storage';
import { GlobalFunction } from './../providers/globalfunction';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import {FCM} from '@capacitor-community/fcm';
@Component({
  selector: 'app-hotel-list-mood',
  templateUrl: 'hotel-list-mood.html',
  styleUrls: ['hotel-list-mood.scss'],
})
export class HotelListMoodPage implements OnInit {

  public id;
  public json:any = []; public json1:any = [];
  public name;
  public code;
  ishide = false;
  num = 0;
  length;
  len = 10;
  co = 0;
  listhotels:any = "";
  listhotelIdInternal:any = "";
  jsonhtprice; cin; cout;
  public dataListLike:any = [];
  public dataList:any = [];
  public listHotelPrice:any = [];
  loginuser: any;
  public title:any = "";
  public loadpricedone = false;
  public page = 1;
  _infiniteScroll: any;
  memberid: any;
  public itemsSkeleton = [1, 2, 3, 4, 5];
  private subscription: Subscription; hotelId
  constructor(public platform: Platform, public navCtrl: NavController, public zone: NgZone, public authService: AuthService,
    public value: ValueGlobal, public storage: Storage, public searchhotel: SearchHotel, public alertCtrl: AlertController,
    public gf: GlobalFunction, private activeRoute: ActivatedRoute, public loadingCtrl: LoadingController, private router: Router,
    private modalCtrl: ModalController ,public moodService: moodService) {
    storage.get('auth_token').then(auth_token => {
      this.loginuser = auth_token;
    });
    storage.get('jti').then((uid: any) => {
      this.memberid = uid;
    })
    this.loadpricedone = false;
    if (value.flagreview == 1) {
      this.ishide = true;
      if (value.arrhotellist) {
        this.json1 = value.arrhotellist;
      }
    } else {
      this.cin = new Date();
      this.cin = moment(this.cin).format('YYYY-MM-DD');
      this.cout = new Date();
      var rescout = this.cout.setTime(this.cout.getTime() + (1 * 24 * 60 * 60 * 1000));
      var datecout = new Date(rescout);
      this.cout = moment(datecout).format('YYYY-MM-DD');
      //this.id = navParams.get('id');
      //this.title = navParams.get('title');
      //this.getdata();
    }
    //google analytic
    //gf.googleAnalytion('hotel-list-mood','load','');
    this.moodService.listAllData=[];
    this.platform.ready().then(() => {
      window.document.addEventListener("backbutton", async () => {
        this.goback();
      })
    })
  }

  public async ngOnInit() {
    var se = this;
    await se.onEnter();

    se.subscription = se.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && (event.url === '/' || event.url == '/app/tabs/tab1' || event.url === 'searchhotelfilterandsort' || event.url === 'searchhotelfilteragain' || event.url === '/hotellist/true' || event.url === '/app/tabs/hotellist/true' || event.url.indexOf('hotellistmood') != -1)) {
        se.onEnter();
      }
    });

    this.id = this.activeRoute.snapshot.paramMap.get('id');
    this.title = this.activeRoute.snapshot.paramMap.get('title');
    this.gf.setParams({ moodid: this.id, title: this.title }, 'hotellistmood');
    this.getdata();
  }
  public async onEnter(): Promise<void> {
    // do your on enter page stuff here
    this.ishide=false;
    this.id = this.activeRoute.snapshot.paramMap.get('id');
    this.title = this.activeRoute.snapshot.paramMap.get('title');
    this.gf.setParams({ moodid: this.id, title: this.title }, 'hotellistmood');
    this.storage.get('auth_token').then(auth_token => {
      this.loginuser = auth_token;
    });
    this.getdata();
    if (this.hotelId && this.loginuser) {
      this.likeItem(this.hotelId);
    }

  }
  private getdata() {
    var se = this;
    // var options = {
    //   method: 'POST',
    //   url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/HotelByMoodId' + '?pageIndex=' + this.page + '&pageSize=1000&version=2' + (this.memberid ? '&memberid=' + this.memberid : ''),
    //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
    //   headers:
    //   {
    //     'cache-control': 'no-cache',
    //     'content-type': 'application/json',
    //     apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
    //     apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    //   },
    //   body: se.id,
    //   json: true
    // };

    let urlPath = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/HotelByMoodId' + '?pageIndex=' + this.page + '&pageSize=1000&version=2' + (this.memberid ? '&memberid=' + this.memberid : '');
    let headers = {
      'cache-control': 'no-cache',
        'content-type': 'application/json',
        apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    this.gf.RequestApi('POST', urlPath, headers, se.id, 'hotellistmood', 'getdata').then((data)=>{

      se.zone.run(() => {
        if (data && data.length > 0) {
          se.json = [];
          se.dataList = [];
          se.json1=[];
          let jsonData = data
          //se.pushdata(0,se.json.length);
          se.listhotels = "";
          se.listhotelIdInternal = "";
        
          if (se.searchhotel.selectedRegion.length>0) {
          for (let i = 0; i < jsonData.length; i++) {
            const element = jsonData[i];
            for (let j = 0; j < se.searchhotel.selectedRegion.length; j++) {
              if (element.regionId ==  se.searchhotel.selectedRegion[j]) {
                se.json.push(element);
              }
            }
          }
          } else{
            se.json = data;
          }

         
          for (let i = 0; i < se.json.length; i++) {
            let item = se.json[i];
            se.dataList.push(item);

            if (i == se.json.length - 1) {
              if (se.json[i].eanCode != "") {
                se.listhotels = se.listhotels + se.json[i].eanCode;
              }
              se.listhotelIdInternal = se.listhotelIdInternal + se.json[i].id;

            } else {
              if (se.json[i].eanCode != "") {
                se.listhotels = se.listhotels + se.json[i].eanCode + ",";
              }
              se.listhotelIdInternal = se.listhotelIdInternal + se.json[i].id + ",";
            }
          }
          se.pushdatanew();
          se.getHotelprice();
        }
        else if (data.length == 0) {
          se.json1 = [];
          se.ishide = true;
          se._infiniteScroll.target.complete();
        }
      })
    });
    var moodcode = '';
    if (se.id == 1039) {
      moodcode = "nghi-he"
    }
    if (se.id == 1040) {
      moodcode = "doi-nhom"
    }
    if (se.id == 1002) {
      moodcode = "lang-man"
    }
    if (se.id == 1005) {
      moodcode = "tron-goi"
    }
    se.gf.googleAnalytion("mood-" + moodcode, "screen_view", {});
  }

  getHotelprice() {
    var se = this;
    var options = {
      method: 'POST',
      url: C.urls.baseUrl.urlContracting + '/api/contracting/HotelsSearchPriceAjax',
      timeout: 180000, maxAttempts: 5, retryDelay: 2000,
      headers:
      {
      },
      form:
      {
        RoomNumber: '1',
        IsLeadingPrice: '',
        ReferenceClient: '',
        Supplier: 'IVIVU',
        CheckInDate: se.cin,
        CheckOutDate: se.cout,
        CountryID: '',
        CityID: '',
        NationalityID: '',
        'RoomsRequest[0][RoomIndex]': '0',
        'RoomsRequest[0][Adults][value]': '2',
        'RoomsRequest[0][Child][value]': '0',
        StatusMethod: '2',
        CountryCode: 'VN',
        NoCache: 'false',
        SearchType: '2',
        HotelIds: se.listhotels,
        HotelIdInternal: se.listhotelIdInternal
      }
    };

    let body = `RoomNumber=1&IsLeadingPrice=''&ReferenceClient=''&Supplier='IVIVU'`
    +`&CheckInDate=${se.cin}&CheckOutDate=${se.cout}&CountryID=''&CityID=''&NationalityID=''&RoomsRequest[0][RoomIndex]=0&`
    +`RoomsRequest[0][Adults][value]=2&RoomsRequest[0][Child][value]=0&StatusMethod=2&`
    +`CityCode=VN&CountryCode='VN'&NoCache=false&SearchType=2&HotelIds=${se.listhotels}&HotelIdInternal=${se.listhotelIdInternal}`;
    
    let urlPath = C.urls.baseUrl.urlContracting + '/api/contracting/HotelsSearchPriceAjax';
    let headers = {};
    this.gf.RequestApi('POST', urlPath, {'content-type' : 'application/x-www-form-urlencoded', accept: '*/*'},body, 'hotellistmood', 'getHotelprice').then((data)=>{
    
      se.zone.run(() => {
        se.jsonhtprice = data;
        if (se.jsonhtprice.HotelListResponse) {
          se.jsonhtprice = se.jsonhtprice.HotelListResponse.HotelList.HotelSummary;
          se.length = se.json.length;
          // if (se.length > 10) {
          //   se.pushdata(0, 10);
          // }
          // else {
          //   se.pushdata(0, se.length);
          // }
          for (var i = 0; i < se.jsonhtprice.length; i++) {
            let itemprice = se.jsonhtprice[i];
            se.listHotelPrice.push(itemprice);
            //Add vào list ks có giá
            //se.jsonhtprice.push(itemprice);
          }

          //Bind giá vào list ks đã search
          // setTimeout(() => {
          //   se.zone.run(() => se.fillDataPrice());
          // },100);
           //Bind giá vào list ks đã search
           setTimeout(() => {
            se.zone.run(() => se.fillDataPrice());
          },100);
          //Check lại phòng có giá hay ko
          setTimeout(() => {
            se.zone.run(()=>{
              se.json1.forEach(element => {
                if(!se.checkExistsPriceItem(element.HotelId)){
                  element.MinPriceOTAStr = "";
                }
              })
            })
            se.loadpricedone = true;
          },200);

        }

      })


    });
  }

  /**Bind lại giá nếu có giá OTA
      * PDANH 23/01/2018
      * PDANH 29/11/2019: Sửa lại code thành hàm async
      */
   fillDataPrice() {
    var se = this;
    for (let index = 0; index < se.json1.length; index++) {
      for (let i = 0; i < se.listHotelPrice.length; i++) {
        //Chỉ bind lại giá cho hotel, combo bỏ qua
        if (se.json1[index] && se.json1[index].HotelId == se.listHotelPrice[i].HotelId) {
          se.json1[index].MinPriceOTAStr = se.listHotelPrice[i].MinPriceOTAStr;
          se.json1[index].MinPriceTAStr = se.listHotelPrice[i].MinPriceTAStr;
          se.json1[index].RoomNameSubString = se.listHotelPrice[i].RoomNameSubString.replace('...','');
          se.json1[index].PromotionDescription = se.listHotelPrice[i].PromotionDescription;
          se.json1[index].PromotionDescriptionSubstring = se.listHotelPrice[i].PromotionDescriptionSubstring;
        }
      }
    }
  }

  /**Sửa lại bind data
     * PDANH 23/01/2018
     */
  pushdatanew() {
    /**Sửa phần combine điều kiện search
     * PDANH 05/01/2018
     */
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'GET',
        //   url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteHotelByUser',
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     //'postman-token': '89692e55-6555-1572-db28-4becc311f0ba',
        //     authorization: text
        //   }
        // };

        let urlPath = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteHotelByUser';
        let headers = {authorization: text};
        this.gf.RequestApi('GET', urlPath, headers, {}, 'hotellistmood', 'pushdatanew',auth_token).then((data)=>{

            if (data) {
              se.zone.run(() => {
                se.dataListLike = data;
                se.executePushData();
              });
            } else {
              //se.showConfirm();
            }

          

        });
      } else {
        se.executePushData();
        for (let i = 0; i < se.json1.length; i++) {
          se.json1[i].Liked = false;
        }
      }
    });

  }

  executePushData() {
    var se = this;
    for (let index = 0; index < se.dataList.length; index++) {
      let itemlike = false;
      //Kiểm tra có trong list like không
      if (se.dataListLike.length > 0) {
        itemlike = se.checkItemLiked(se.dataList[index].id) == 1 ? true : false;
      }
      //Kiểm tra trong list đã có rồi thì bỏ qua ko add vào nữa
      var co = se.checkExistsItem(se.dataList[index].id);
      if (co == 1) {
        se.bindItemLike(se.dataList[index], itemlike);
        continue;
      }
      if (se.dataList[index].avatar) {
        se.dataList[index].avatar = (se.dataList[index].avatar.toLocaleString().trim().indexOf("http") != -1) ? se.dataList[index].avatar : 'https:' + se.dataList[index].avatar;
      } else {
        se.dataList[index].avatar = "https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage.png";
      }

      if (se.dataList[index].DealType) {
        if (se.dataList[index].DealPrice) {
          se.dataList[index].DealPrice = se.dataList[index].DealPrice;
        }

      }
      switch (se.dataList[index].rating) {
        case 50:
          se.dataList[index].rating = "./assets/star/ic_star_5.svg";
          break;
        case 45:
          se.dataList[index].rating = "./assets/star/ic_star_4.5.svg";
          break;
        case 40:
          se.dataList[index].rating = "./assets/star/ic_star_4.svg";
          break;
        case 35:
          se.dataList[index].rating = "./assets/star/ic_star_3.5.svg";
          break;
        case 30:
          se.dataList[index].rating = "./assets/star/ic_star_3.svg";
          break;
        case 25:
          se.dataList[index].rating = "./assets/star/ic_star_2.5.svg";
          break;
        case 20:
          se.dataList[index].rating = "./assets/star/ic_star_2.svg";
          break;
        case 15:
          se.dataList[index].rating = "./assets/star/ic_star_1.5.svg";
          break;
        case 10:
          se.dataList[index].rating = "./assets/star/ic_star_1.svg";
          break;
        case 5:
          se.dataList[index].rating = "./assets/star/ic_star_0.5.svg";
          break;
        default:
          break;
      }
      var item;
      if (se.dataList[index].DealType) {

        if (se.dataList[index].subLocation[0]) {
          item = { Avatar: se.dataList[index].avatar, Name: se.dataList[index].name, AvgPoint: se.dataList[index].avgPoint, dealPrice: se.dataList[index].dealPrice ? se.dataList[index].dealPrice :se.dataList[index].dealPrice , dealType: se.dataList[index].dealType, SubLocation: se.dataList[index].subLocation[0].name, Rating: se.dataList[index].rating, HotelId: se.dataList[index].id, Liked: itemlike, IsShowPrice: se.dataList[index] ? se.dataList[index].isShowPrice : 0,regionName: this.dataList[index].regionName,regionId: this.dataList[index].regionId };
        } else {
          item = { Avatar: se.dataList[index].avatar, Name: se.dataList[index].name, AvgPoint: se.dataList[index].avgPoint, dealPrice: se.dataList[index].dealPrice ? se.dataList[index].dealPrice:se.dataList[index].dealPrice, dealType: se.dataList[index].dealType, SubLocation: '', Rating: se.dataList[index].rating, HotelId: se.dataList[index].id, Liked: itemlike, IsShowPrice: se.dataList[index] ? se.dataList[index].isShowPrice :0,regionName: this.dataList[index].regionName,regionId: this.dataList[index].regionId };
        }
      }
      else {
        if (se.dataList[index].subLocation[0]) {
          item = { Avatar: se.dataList[index].avatar, Name: se.dataList[index].name, AvgPoint: se.dataList[index].avgPoint, dealPrice: se.dataList[index].dealPrice ?se.dataList[index].dealPrice:se.dataList[index].dealPrice, dealType: se.dataList[index].dealType, SubLocation: se.dataList[index].subLocation[0].name, Rating: se.dataList[index].rating, HotelId: se.dataList[index].id, RoomNameSubString: "", MinPriceOTAStr: se.dataList[index].MinPriceOTAStr, PromotionDescriptionSubstring: "" , Liked: itemlike, IsShowPrice: se.dataList[index] ? se.dataList[index].isShowPrice : 0,regionName: this.dataList[index].regionName,regionId: this.dataList[index].regionId};
        } else {
          item = { Avatar: se.dataList[index].avatar, Name: se.dataList[index].name, AvgPoint: se.dataList[index].avgPoint, dealPrice: se.dataList[index].dealPrice ?se.dataList[index].dealPrice:se.dataList[index].dealPrice, dealType: se.dataList[index].dealType, SubLocation: '', Rating: se.dataList[index].rating, HotelId: se.dataList[index].id, RoomNameSubString: "", MinPriceOTAStr: se.dataList[index].MinPriceOTAStr, PromotionDescriptionSubstring: "" , Liked: itemlike, IsShowPrice: se.dataList[index] ? se.dataList[index].isShowPrice : 0,regionName: this.dataList[index].regionName,regionId: this.dataList[index].regionId };
        }
      }
      if(item.AvgPoint.toString().length ==1){
        item.AvgPoint = item.AvgPoint.toString() + ".0";
      }
      se.json1.push(item);
    }
    se.ishide = true;
    if(this._infiniteScroll){
      this._infiniteScroll.target.complete();
    }
  }

  bindItemLike(item, like) {
    var se = this;
    se.json1.forEach((element) => {
      if (element.HotelId == item.id)
        se.zone.run(() => {
          element.Liked = like;
        })
    })
  }

  /*
 * Hàm check item khách sạn đã tồn tại trong list json1 hay chưa: 1 = đã có; 0 - chưa có
 * @param item khách sạn cần check
 */
  checkExistsItem(id) {
    var co = 0;
    if (id) {
      for (let i = 0; i < this.json1.length; i++) {
        if (id == this.json1[i].HotelId) {
          co = 1;
          break;
        }
      }
    }

    return co;
  }

  checkItemLiked(id) {
    var co = 0;
    if (id) {
      for (let i = 0; i < this.dataListLike.length; i++) {
        if (this.dataListLike.indexOf(id) != -1) {
          co = 1;
          break;
        }
      }
    }

    return co;
  }

  checkExistsPriceItem(id) {
    var co = 0;
    var se = this;
    if (id) {
      for (let i = 0; i < se.listHotelPrice.length; i++) {
        if (id == se.listHotelPrice[i].HotelId) {
          co = 1;
          break;
        }
      }
    }

    return co;
  }

  pushdata(num, len) {
    var se = this;
    for (let index = num; index < len; index++) {
      if (this.json[index].avatar) {
        this.json[index].avatar = (this.json[index].avatar.toLocaleString().trim().indexOf("http") != -1) ? this.json[index].avatar : 'http:' + this.json[index].avatar;
      } else {
        this.json[index].avatar = "https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage.png";
      }

      if (this.json[index].dealType) {
        this.json[index].dealPrice = this.json[index].dealPrice;
      }
      switch (this.json[index].rating) {
        case 50:
          this.json[index].rating = "./assets/star/ic_star_5.svg";
          break;
        case 45:
          this.json[index].rating = "./assets/star/ic_star_4.5.svg";
          break;
        case 40:
          this.json[index].rating = "./assets/star/ic_star_4.svg";
          break;
        case 35:
          this.json[index].rating = "./assets/star/ic_star_3.5.svg";
          break;
        case 30:
          this.json[index].rating = "./assets/star/ic_star_3.svg";
          break;
        case 25:
          this.json[index].rating = "./assets/star/ic_star_2.5.svg";
          break;
        case 20:
          this.json[index].rating = "./assets/star/ic_star_2.svg";
          break;
        case 15:
          this.json[index].rating = "./assets/star/ic_star_1.5.svg";
          break;
        case 10:
          this.json[index].rating = "./assets/star/ic_star_1.svg";
          break;
        case 5:
          this.json[index].rating = "./assets/star/ic_star_0.5.svg";
          break;
        default:
          break;
      }
      var item;
      if (this.json[index].dealType) {
        if (this.json[index].subLocation[0]) {
          item = { Avatar: this.json[index].avatar, Name: this.json[index].name, AvgPoint: this.json[index].avgPoint, dealPrice: this.json[index].dealPrice, dealType: this.json[index].dealType, SubLocation: this.json[index].subLocation[0].name, Rating: this.json[index].rating, HotelId: this.json[index].id, IsShowPrice: this.json[index].isShowPrice };
        } else {
          item = { Avatar: this.json[index].avatar, Name: this.json[index].name, AvgPoint: this.json[index].avgPoint, dealPrice: this.json[index].dealPrice, dealType: this.json[index].dealType, SubLocation: '', Rating: this.json[index].rating, HotelId: this.json[index].id, IsShowPrice: this.json[index].isShowPrice }
        }
      } else {
        var flag = 0;
        for (let i = 0; i < this.jsonhtprice.length; i++) {
          if (this.jsonhtprice[i].HotelId == this.json[index].id) {
            if (this.json[index].subLocation[0]) {
              item = { Avatar: this.json[index].avatar, Name: this.json[index].name, AvgPoint: this.json[index].avgPoint, dealPrice: this.json[index].dealPrice, dealType: this.json[index].dealType, SubLocation: this.json[index].subLocation[0].name, Rating: this.json[index].rating, HotelId: this.json[index].id, RoomNameSubString: this.jsonhtprice[i].RoomNameSubString, MinPriceOTAStr: this.jsonhtprice[i].MinPriceOTAStr, PromotionDescriptionSubstring: this.jsonhtprice[i].PromotionDescriptionSubstring, IsShowPrice: this.json[index].isShowPrice };
            } else {
              item = { Avatar: this.json[index].avatar, Name: this.json[index].name, AvgPoint: this.json[index].avgPoint, dealPrice: this.json[index].dealPrice, dealType: this.json[index].dealType, SubLocation: '', Rating: this.json[index].rating, HotelId: this.json[index].id, RoomNameSubString: this.jsonhtprice[i].RoomNameSubString, MinPriceOTAStr: this.jsonhtprice[i].MinPriceOTAStr, PromotionDescriptionSubstring: this.jsonhtprice[i].PromotionDescriptionSubstring, IsShowPrice: this.json[index].isShowPrice };
            }
            flag = 1;
            break;
          }
        }
        if (flag == 0) {
          if (this.json[index].SubLocation) {
            item = { Avatar: this.json[index].avatar, Name: this.json[index].name, AvgPoint: this.json[index].avgPoint, dealPrice: this.json[index].dealPrice, dealType: this.json[index].dealType, SubLocation: this.json[index].subLocation[0].name, Rating: this.json[index].rating, HotelId: this.json[index].id, IsShowPrice: this.json[index].isShowPrice };
          } else {
            item = { Avatar: this.json[index].avatar, Name: this.json[index].name, AvgPoint: this.json[index].avgPoint, dealPrice: this.json[index].dealPrice, dealType: this.json[index].dealType, SubLocation: '', Rating: this.json[index].rating, HotelId: this.json[index].id, IsShowPrice: this.json[index].isShowPrice }
          }
        }
      }
      se.json1.push(item);
    }
    se.ishide = true;
    se.loadpricedone = true;
  }
  seemap() {
    this.presentLoadingnavi();
    var id1 = { name: this.name, code: this.code };
    this.navCtrl.navigateForward('MapPage/name' + this.name + "/code" + this.code);
  }
  filter() {
    var id1 = { name: this.name, code: this.code };
    //this.navCtrl.navigateForward('SearchPage', id1);
  }

  itemSelected(msg) {
    //this.presentLoadingnavi();
    var se = this;
    se.searchhotel.hotelID = msg.HotelId;
    se.searchhotel.rootPage = "listmood";
    se.gf.setParams(msg.HotelId, 'hotellistmoodselected');
    this.gf.setParams({ moodid: this.id, title: this.title }, 'hotellistmood');
    this.value.logingoback = '/hoteldetail/' + msg.HotelId;
    this.value.notRefreshDetail = false;
    //this.navCtrl.navigateForward('/hoteldetail/'+hotelid);
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
    this.gf.setCacheSearch(item,1);
    setTimeout(() => {
      this.navCtrl.navigateForward('/hoteldetail/' + msg.HotelId);
    }, 10)
  }
  doInfinite(infiniteScroll) {
    if (this.ishide == true) {
      var se = this;
      setTimeout(() => {
        se.page = se.page + 1;
        se.getdata();
        se._infiniteScroll = infiniteScroll;
        //infiniteScroll.target.complete();
      }, 10);
    }
    else {
      infiniteScroll.target.complete();
    }

  }

  ionViewDidLoad() {
    let elements = window.document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'flex';
      });
    }
  }

  goback() {
    // todo something
    this.value.flagreview = 0;
    this.searchhotel.selectedRegion=[];
    this.router.navigateByUrl('/app/tabs/tab1');
  }
  /*** Về trang login
   * PDANH  29/01/2018
   */
  goToLogin() {
    this.navCtrl.navigateForward('/login');
  }
  /*** Set like item
   * PDANH  29/01/2018
   */
  likeItem(id) {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'POST',
        //   //url: 'https://beta-olivia.ivivu.com/mobile/OliviaApis/AddFavouriteHotel',
        //   url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/AddFavouriteHotel',
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     authorization: text
        //   },
        //   body: { hotelId: id },
        //   json: true
        // };

        let urlPath = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/AddFavouriteHotel';
        let headers = {authorization: text};
        this.gf.RequestApi('POST', urlPath, headers, {hotelId: id}, 'hotellistmood', 'likeItem').then((data)=>{

          if (se.json1.length > 0) {
            se.zone.run(() => se.setItemLikeStatus(id));
          }
          se.hotelId = '';
        });
      }
      else {
        this.hotelId = id;
        this.navCtrl.navigateForward('/login');
      }
    });

  }
  /*** Set unlike item
   * PDANH  29/01/2018
   */
  unlikeItem(id) {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'POST',
        //   //url: 'https://beta-olivia.ivivu.com/mobile/OliviaApis/RemoveFavouriteHotelByUser',
        //   url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteHotelByUser',
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     authorization: text
        //   },
        //   body: { hotelId: id },
        //   json: true
        // };

        let urlPath = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteHotelByUser';
        let headers = {authorization: text};
        this.gf.RequestApi('POST', urlPath, headers, {hotelId: id}, 'hotellistmood', 'unlikeItem').then((data)=>{

          if (se.json1.length > 0) {
            se.zone.run(() => se.setItemLikeStatus(id));
          }
         
        });
      }
      else {
        this.router.navigateByUrl('/login');
      }
    });
  }
  /*** Set like/unlike item
   * PDANH  29/01/2018
   */
  setItemLikeStatus(id) {
    this.json1.forEach(el => {
      if (el.HotelId == id) {
        el.Liked = !el.Liked;
      }
    });
  }
  /*** Gọi lại api lấy list like để refresh lại trạng thái like
   * PDANH  31/01/2018
   */
  ionViewWillEnter() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      this.loginuser = auth_token;
    });
    //Set activetab theo form cha
    se.gf.setActivatedTab(1);
  }

  goToLogout() {
    this.storage.get('auth_token').then(id_token => {
      if (id_token !== null) {
        this.storage.remove('auth_token');
        this.storage.remove('mail');
        this.storage.remove('username');
        this.storage.remove('listblogtripdefault');
        this.storage.remove('point');
        //Xóa token device khi logout
        if(this.platform.is('cordova')){
          FCM.getToken().then(token => {
            this.gf.DeleteTokenOfUser(token, id_token, this.gf.getAppVersion());
          });
        }
        this.router.navigateByUrl('/login');
      }
    });
  }
  /*** Set lại trạng thái like
   * PDANH  31/01/2018
   */
  reloadDataLike() {
    var se = this;
    if (se.json1 && se.json1.length > 0) {
      se.json1.forEach(item => {
        //Nếu item đang like và list like trả về ko có id của item đang xét thì untick like
        // if(item.Liked && se.dataListLike.indexOf(item.HotelId) == -1){
        //   item.Liked = !item.Liked;
        // }
      });
    }
  }
  /*** Hàm set lại điều kiện sort and filter
   * PDANH 11/02/2018
   */
  sortAndFilterAgain() {
    this.router.navigateByUrl('/searchhotelfilterandsort');
  }
  /*** Set clear điều kiện sort and filter
   * PDANH 11/02/2018
   */
  clearSortAndFilter() {
    //set về default
    this.presentLoadingnavi();
    this.searchhotel.minprice = '';
    this.searchhotel.maxprice = '';
    this.searchhotel.star = [];
    this.searchhotel.review = 0;
    this.searchhotel.chuoi = "";
    this.searchhotel.recent = [];
    this.searchhotel.adult = 2;
    this.searchhotel.child = 0;
    this.searchhotel.roomnumber = 1;
    //this.navCtrl.push('HotelListPage');
    this.searchhotel.meal1check = false;
    this.searchhotel.meal2check = false;
    this.searchhotel.meal3check = false;
    this.searchhotel.local0check = false;
    this.searchhotel.local1check = false;
    this.searchhotel.local2check = false;
    this.searchhotel.local3check = false;
    this.searchhotel.local4check = false;
    this.searchhotel.local5check = false;
    this.searchhotel.local6check = false;
    this.searchhotel.local7check = false;
    this.searchhotel.local8check = false;
    this.searchhotel.local9check = false;
    this.searchhotel.local10check = false;
    this.searchhotel.local11check = false;
    this.searchhotel.local12check = false;
    this.searchhotel.local13check = false;
    this.searchhotel.local14check = false;
    this.searchhotel.local15check = false;
    this.searchhotel.local16check = false;
    this.searchhotel.local17check = false;
    this.searchhotel.local18check = false;
    this.searchhotel.local19check = false;
    this.searchhotel.facility0check = false;
    this.searchhotel.facility1check = false;
    this.searchhotel.facility2check = false;
    this.searchhotel.facility3check = false;
    this.searchhotel.facility4check = false;
    this.searchhotel.facility5check = false;
    this.searchhotel.facility6check = false;
    this.searchhotel.facility7check = false;
    this.searchhotel.facility8check = false;
    this.searchhotel.facility9check = false;
    this.searchhotel.style0check = false;
    this.searchhotel.style1check = false;
    this.searchhotel.style2check = false;
    this.searchhotel.style3check = false;
    this.searchhotel.style4check = false;
    this.searchhotel.style5check = false;
    this.searchhotel.style6check = false;
    this.searchhotel.style7check = false;
    this.searchhotel.style8check = false;
    this.searchhotel.style9check = false;
    this.searchhotel.hoteltype0check = false;
    this.searchhotel.hoteltype1check = false;
    this.searchhotel.hoteltype2check = false;
    this.searchhotel.hoteltype3check = false;
    this.searchhotel.hoteltype4check = false;
    this.searchhotel.hoteltype5check = false;
    this.searchhotel.hoteltype6check = false;
    this.searchhotel.hoteltype7check = false;
    this.searchhotel.hoteltype8check = false;
    this.searchhotel.hoteltype9check = false;
    this.searchhotel.sortOrder = '';
    this.searchhotel.location = '';
    this.searchhotel.facsearch = '';
    this.searchhotel.tagIds = '';
    this.searchhotel.classIds = '';
    this.router.navigateByUrl('/hotellistmood/false');
  }

  async showConfirm() {
    let alert = await this.alertCtrl.create({
      message: "Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại để sử dụng chức năng này.",
      buttons: [{
        text: 'Đăng nhập',
        role: 'OK',
        handler: () => {
          this.storage.remove('auth_token');
          this.storage.remove('email');
          this.storage.remove('username');
          this.storage.remove('jti');
          this.storage.remove('userInfoData');
          this.storage.remove('userRewardData');
          this.storage.remove('point');
          this.storage.remove('listblogtripdefault');
          this.navCtrl.navigateForward('/login');
        }
      },
      {
        text: 'Để sau',
        handler: () => {
          this.storage.remove('auth_token');
          this.storage.remove('email');
          this.storage.remove('username');
          this.storage.remove('jti');
          this.storage.remove('userInfoData');
          this.storage.remove('userRewardData');
          this.storage.remove('point');
          this.storage.remove('listblogtripdefault');
          //this.app.getActiveNav().push('MainPage');
          this.navCtrl.navigateForward('/login');
        }
      }
      ]
    });
    alert.present();
  }
  async presentLoadingnavi() {
    var loader = await this.loadingCtrl.create({
      message: "",
      duration: 10
    });
    loader.present();
  }
  async showFilter() {
    var se=this;
    const key = 'regionName';
    let unique:any;
    if(se.moodService.listAllData && se.moodService.listAllData.length >0){
      let items = se.moodService.listAllData.map(item => [item[key], item]);
      if(items && items.length >0){
        unique = [...new Map(items).values()];
      }
      
    }else{
      let items = se.json1.map(item => [item[key], item]);
      unique = [...new Map(items).values()];
      se.moodService.listAllData = [...se.json1];
    }
    
    console.log(unique);
    se.moodService.listRegion = unique;
    se.moodService.listData = [...se.moodService.listAllData];
    se.moodService.listSlideData = [...se.json1];
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: HotellistmoodfilterPage,
        componentProps: {
          aParameter: true,
        }
      });
    modal.present();

    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      if(data.data.stt==1){
        this.ishide=false;
        this.getdata();
      }
    
    })
  }
}
