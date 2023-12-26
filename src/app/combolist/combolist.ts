import { Bookcombo, ValueGlobal, SearchHotel, Booking } from './../providers/book-service';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController,Platform,LoadingController } from '@ionic/angular';
import { AuthService } from '../providers/auth-service';
import { Storage } from '@ionic/storage';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { SearchHotelFilterAndSortPage } from '../search-hotel-filter-and-sort/search-hotel-filter-and-sort';
import { OverlayEventDetail } from '@ionic/core';
import * as moment from 'moment';
import {FCM} from '@capacitor-community/fcm';
import { MytripService } from '../providers/mytrip-service.service';
import { flightService } from '../providers/flightService';

@Component({
  selector: 'app-combolist',
  templateUrl: 'combolist.html',
  styleUrls: ['combolist.scss'],
})
export class ComboListPage implements OnInit{
  public id;
  public json:any = []; public json1:any = [];
  public dataList:any = [];
  public dataListLike:any = [];
  public name;
  public code;
  public itemsSkeleton = [1,2,3,4,5];
  ishide = false;
  nodata = false;
  num = 0;
  length;
  len = 30;
  co = 0;
  listhotels = "";
  listhotelIdInternal = "";
  hasfilter = false;
  hasfilteragain = false;
  hassortfilter = false;
  jsonhtprice:any = []; cin; cout; jsontemp; jsonhtprice1; minprice; maxprice;
  listHotelPrice:any = [];
  page = 1;
  totalData = 0;
  totalPage = 0;
  perPage = 10;
  listSort:any = [];
  sortOnly = true;
  direction: number;
  isDesc: boolean = false;
  column: string = 'MinPriceOTAStr';
  liked = false;
  loginuser = null;
  public loadpricedone = false;
  subscription: Subscription;
  _infiniteScroll;
    memberid: any;
  datecin: Date;
  datecout: Date;
  constructor(public platform: Platform, public navCtrl: NavController, public zone: NgZone, public authService: AuthService, public bookcombo: Bookcombo, public value: ValueGlobal, public searchhotel: SearchHotel, 
    public modalCtrl: ModalController, private router: Router,public booking: Booking,public loadingCtrl: LoadingController,
    public storage: Storage,public valueGlobal:ValueGlobal,public alertCtrl: AlertController,public gf: GlobalFunction,
    public activeRoute : ActivatedRoute,
    public _mytripservice: MytripService,
    public _flightService: flightService,) {
    this.name = searchhotel.gbmsg ?  (searchhotel.gbmsg.regionName ? searchhotel.gbmsg.regionName : searchhotel.gbmsg.RegionName) : authService.region;
      storage.get('auth_token').then(auth_token => {
        this.loginuser = auth_token;
      });
      storage.get('jti').then((uid:any)=>{
        this.memberid = uid;
      })
      this.loadpricedone = false;
      setTimeout(() => { 
          this.loaddata();
        }, 50);
      
  }

  public async ngOnInit(){
    var se = this;
    await se.onEnter();
    se.subscription = se.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd && (event.url == '/app/tabs/tab3') ) {
            se.onEnter();
        }
      });
  }

  public async onEnter(): Promise<void> {
    var se = this;
    se.gf.setActivatedTab(3);
  }

  private loaddata() {
    var se = this;
    var strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/TopDeals?pageIndex='+se.page+'&pageSize=200'+ (se.memberid ? '?memberid='+se.memberid : '');
    let headers = {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };

    this.gf.RequestApi('POST', strUrl, headers, {}, 'combolist', 'loaddata').then((data)=>{
      if(data){
      var lst = data;

        se.totalData = lst.length;
        se.totalPage = se.totalData / 10;
        for(let i = 0; i< lst.length; i++){
            se.dataList.push(lst[i]);
        }
        se.pushdata(se.json1.length, lst.length);
      }
    })
  }
  
  /**Xóa ký tự định dạng số tiền VD: .,VNDđ
       * PDANH 23/01/2018
       */
  clearSubFix(value) {
    let re1 = /\./gi;
    let re2 = /\,/gi;
    let re3 = /\đ/gi;
    //return value.toLocaleString().replace("VND","").replace("đ","").replace(".","").replace(",","").trim();
    return value.toLocaleString().replace(re1, '').replace(re2, '').replace("đ", '').replace("VND", '').trim();
  }

  /*
   * Hàm check sao khách sạn
   * @param item khách sạn cần check
   */
  checkHotelStar(item) {
    let res = false;
    for (let j = 0; j < this.searchhotel.star.length; j++) {
      if (this.searchhotel.star[j] * 10 == item.Rating) {
        var co = this.checkvalue(item.HotelId);
        if (co == 0) {
          res = true;
        }
      }
    }
    return res;
  }
  /*
   * Hàm check giá khách sạn
   * @param item khách sạn cần check
   */
  checkMinPrice(item) {
    let res = false;
    if (item) {
      if (item.DealType) {
        if (this.minprice * 1 <= item.DealPrice && item.DealPrice <= this.maxprice * 1) {
          var co = this.checkvalue(item.id);
          if (co == 0) {
            res = true;
          }
        }
      }
      else {
        var co = this.checkvalue(item.id);
        if (co == 0) {
          res = true;
        }
      }
    }
    return res;
  }

  checkvalue(id) {
    var co = 0;
    if (id) {
      for (let i = 0; i < this.json.length; i++) {
        if (id == this.json[i].id) {
          co = 1;
          break;
        }
      }
    }
    return co;
  }
  /*
   * Hàm check item khách sạn đã tồn tại trong list json1 hay chưa: 1 = đã có; 0 - chưa có
   * @param item khách sạn cần check
   */
  checkExistsItem(id) {
    var co = 0;
    if (id) {
      for (let i = 0; i < this.json1.length; i++) {
        if (id == this.json1[i].id) {
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
        if (id == se.listHotelPrice[i].id) {
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

  
  /**Sửa lại bind data
     * PDANH 23/01/2018
     */
  public pushdata(num, len) {
    /**Sửa phần combine điều kiện search
     * PDANH 05/01/2018
     */
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        let headers = { authorization: text };
        let strUrl = C.urls.baseUrl.urlMobile +'/mobile/OliviaApis/GetFavouriteHotelByUser';
        this.gf.RequestApi('GET', strUrl, headers, {}, 'combolist', 'pushdata', auth_token).then((data)=>{
            if(data){
              se.zone.run(() => {
                se.dataListLike = data;
                se.executePushData(false);
              });
            }else{
            }
        });
      } else {
        se.executePushData(false);
      }
    });
  }

  executePushData(isloadmore) {
    var se = this;
    if (!se.dataList) {
      se.dataList = [];
    }
    for (let index = 0; index < se.dataList.length; index++) {
      let itemlike = false;
      //Kiểm tra có trong list like không
      if (se.dataListLike.length > 0) {
        itemlike = se.checkItemLiked(se.dataList[index].id) == 1 ? true : false;
      }
      //Kiểm tra trong list đã có rồi thì bỏ qua ko add vào nữa
      var co = se.checkExistsItem(se.dataList[index].id);
      if (co == 1) {
        continue;
      }
      if (se.dataList[index].images[0]) {
        se.dataList[index].Avatar = (se.dataList[index].images[0].url.toLocaleString().trim().indexOf("http") != -1) ? se.dataList[index].images[0].url : 'https:' + se.dataList[index].images[0].url;
      } else {
        se.dataList[index].Avatar = "https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage.png";
      }
        if (se.dataList[index].minPrice) {
            se.dataList[index].minPrice = se.dataList[index].minPrice.toLocaleString();
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
        item = { Avatar: se.dataList[index].Avatar, Name: se.dataList[index].name, AvgPoint: se.dataList[index].point, DealPrice: se.dataList[index].minPrice ? se.dataList[index].minPrice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(',','.').replace(',','.') : se.dataList[index].minPrice, DealType: se.dataList[index].description, SubLocation: se.dataList[index].address, Rating: se.dataList[index].rating, HotelId: se.dataList[index].id, Liked: itemlike,HasCheckPrice: false };
      se.json1.push(item);
    }
    //load giá theo id
    se.listhotels = "";
          se.listhotelIdInternal = "";
          for (let i = 0; i < se.dataList.length; i++) {
            if (i == se.dataList.length - 1) {
              if (se.dataList[i].EANCode && se.dataList[i].EANCode != "") {
                se.listhotels = se.listhotels + se.dataList[i].EANCode;
              }
              se.listhotelIdInternal = se.listhotelIdInternal + se.dataList[i].id;

            } else {
              if (se.dataList[i].EANCode && se.dataList[i].EANCode != "") {
                se.listhotels = se.listhotels + se.dataList[i].EANCode + ",";
              }
              se.listhotelIdInternal = se.listhotelIdInternal + se.dataList[i].id + ",";
            }
          }
    se.zone.run(()=>{
      se.ishide = true;
    })
    if(se._infiniteScroll){
        se._infiniteScroll.target.complete();
    }
    se.getHotelprice();
    
  }

  getHotelprice() {
    var se = this;
    var options;
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
    let body = `RoomNumber=1&IsLeadingPrice=''&ReferenceClient=''&Supplier='IVIVU'`
    +`&CheckInDate=${se.searchhotel.CheckInDate ? se.searchhotel.CheckInDate : se.cin}&CheckOutDate=${se.searchhotel.CheckOutDate ? se.searchhotel.CheckOutDate : se.cout}&CountryID=''&CityID=''&NationalityID=''&RoomsRequest[0][RoomIndex]=0&`
    +`RoomsRequest[0][Adults][value]=${se.searchhotel.adult ? se.searchhotel.adult : 2}&RoomsRequest[0][Child][value]=${se.searchhotel.child ? se.searchhotel.child : 0}&StatusMethod=2&`
    +`CityCode=${se.authService.region}&CountryCode='VN'&NoCache=false&SearchType=2&HotelIds=${se.listhotels}&HotelIdInternal=${se.listhotelIdInternal}`;
    if (this.searchhotel.arrchild) {
      for (var i = 0; i < this.searchhotel.arrchild.length; i++) {
        body += `RoomsRequest[0][AgeChilds]["${i}"][value]=${se.searchhotel.arrchild[i].numage}`;
      }
    }
    let headers = { };
        let strUrl = C.urls.baseUrl.urlContracting +'/api/contracting/HotelsSearchPriceAjax';
        this.gf.RequestApi('POST', strUrl, headers, body, 'combolist', 'getHotelprice').then((data)=>{
      se.zone.run(() => {
        se.jsonhtprice = [];
        se.jsonhtprice1 = data;
        if (se.jsonhtprice1.HotelListResponse) {
          se.jsonhtprice1 = se.jsonhtprice1.HotelListResponse.HotelList.HotelSummary;
          for (var i = 0; i < se.jsonhtprice1.length; i++) {
            let itemprice = se.jsonhtprice1[i];
            se.listHotelPrice.push(itemprice);
            //Add vào list ks có giá
            se.jsonhtprice.push(itemprice);
          }
          //Bind giá vào list ks đã search
          setTimeout(() => {
            se.zone.run(() => se.fillDataPrice());
            se.loadpricedone = true;
          },100);
          se.ishide = true;
        }else{
          se.loadpricedone = true;
        }
      })
    })

  }

  /**Bind lại giá nếu có giá OTA
     * PDANH 23/01/2018
     */
    fillDataPrice() {
      var se = this;
      for (let index = 0; index < se.json1.length; index++) {
        se.json1[index].HasCheckPrice = true;
        for (let i = 0; i < se.listHotelPrice.length; i++) {
          //Chỉ bind lại giá cho hotel, combo bỏ qua
          if (se.json1[index] && se.json1[index].HotelId == se.listHotelPrice[i].HotelId) {
            se.json1[index].MinPriceOTAStr = se.listHotelPrice[i].MinPriceOTAStr;
            se.json1[index].MinPriceTAStr = se.listHotelPrice[i].MinPriceTAStr;
            se.json1[index].RoomNameSubString = se.listHotelPrice[i].RoomNameSubString;
            se.json1[index].PromotionDescription = se.listHotelPrice[i].PromotionDescription;
            se.json1[index].PromotionDescriptionSubstring = se.listHotelPrice[i].PromotionDescriptionSubstring;
          }
        }
      }
    }

  filter() {
    var id1 = { name: this.name, code: this.code };
    this.navCtrl.navigateForward('/searchhotel/0/null');
  }
  async presentLoadingnavi() {
    var loader = await this.loadingCtrl.create({
      message: "",
      duration: 1000
    });
    loader.present();
  }
  itemSelected(id) {
      this.presentLoadingnavi();
      let id1 = {detailId: id};
      this.searchhotel.hotelID = id;
      this.value.flag = 1;
      this.value.arrhotellist = this.json1;
      this.searchhotel.rootPage = "combolist";
      this.booking.HotelId = '';
      this.valueGlobal.notRefreshDetail = false;
      this.navCtrl.navigateForward('/hoteldetail/'+id);
  }
  doInfinite(infiniteScroll) {
    this.zone.run(() => {
      if (this.ishide == true) {
        if (this.co == 0 && this.loadpricedone) {
          this.page = this.page + 1;
          this.executePushData(true);
          this._infiniteScroll = infiniteScroll;
        }
        else {
          infiniteScroll.target.complete();
        }
      }
      else {
        infiniteScroll.target.complete();
      }
    })
  }

  ionViewDidLoad() {
    let elements = window.document.querySelectorAll(".tabbar");
    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'flex';
      });
    }
  }
  goback(){
    if(this.searchhotel.fromPage == 'order'){
      if(this._mytripservice.rootPage == "homeflight"){
        this.valueGlobal.backValue = "homeflight";
          this._mytripservice.orderPageState.emit(1);
          this._flightService.itemTabFlightActive.emit(true);
          setTimeout(()=> {
            this._flightService.itemMenuFlightClick.emit(2);
          },200)
          this._mytripservice.backfrompage= "";
          this.navCtrl.navigateBack('/tabs/tab1');
      }else if(this._mytripservice.rootPage == 'homehotel'){
        this.navCtrl.navigateBack('app/tabs/tab3');
      }
      else if(this._mytripservice.rootPage == 'homefood'){
        this.navCtrl.navigateForward('/homefood');
      }
      else{
        this.navCtrl.back();
      }
    }
    else{
      this.navCtrl.navigateBack('app/tabs/tab1');
    }
  }
  
  filterAgain() {
    this.navCtrl.navigateForward('/searchhotelfilteragain');
  }
  clearFilter() {
    this.presentLoadingnavi();
    this.zone.run(()=>{
      this.searchhotel.minprice = '';
      this.searchhotel.maxprice = '';
      this.searchhotel.star = [];
      this.searchhotel.review = 0;
      this.searchhotel.chuoi = "";
      this.searchhotel.recent = [];
      this.loadpricedone = false;
      this.nodata = false;
      this.json1 = [];
      this.dataList = [];
      this.page = 1;
      this.loaddata();
      this.hasfilteragain= false;
    })
  }
  searchAgain() {
    this.navCtrl.navigateForward('/');
  }
  async presentModal() {
    const modal: HTMLIonModalElement =
        await this.modalCtrl.create({
          component: SearchHotelFilterAndSortPage,
          componentProps: {
            aParameter: true,
          }
        });
      modal.present();
      modal.onDidDismiss().then((data: OverlayEventDetail) => {
        this.zone.run(() => {
         this.ishide = false;
          this.loadpricedone = false;
          this.nodata = false;
          this.json1 = [];
          this.dataList = [];
          this.page = 1;
          this.name = this.searchhotel.gbmsg ?  (this.searchhotel.gbmsg.regionName ? this.searchhotel.gbmsg.regionName : this.searchhotel.gbmsg.RegionName) : this.authService.region;
          this.loaddata();
          this.hasfilteragain= false;
        })
     
      })
  }
  /*** show trang filterandsort
   * PDANH  29/01/2018
   */
  showFilterAndSort() {
    this.presentModal();
    if(this.searchhotel.gbitem){
      if(this.searchhotel.gbitem.RegionName){
        this.authService.region = this.searchhotel.gbitem.RegionName;
      }
      if(this.searchhotel.gbitem.RegionId){
        this.authService.regionid = this.searchhotel.gbitem.RegionId;
      }
      if(this.searchhotel.gbitem.RegionCode){
        this.authService.regioncode = this.searchhotel.gbitem.RegionCode;
      }
    }
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
        let headers = { authorization: text };
        let strUrl = C.urls.baseUrl.urlMobile +'/mobile/OliviaApis/AddFavouriteHotel';
        this.gf.RequestApi('POST', strUrl, headers, { hotelId: id }, 'combolist', 'getHotelprice').then((data)=>{
          if (se.json1.length > 0) {
            se.zone.run(() => se.setItemLikeStatus(id));
          }
          console.log(data);
        });
      }
      else {
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
        let headers = { authorization: text };
        let strUrl = C.urls.baseUrl.urlMobile +'/mobile/OliviaApis/RemoveFavouriteHotelByUser';
        this.gf.RequestApi('POST', strUrl, headers, { hotelId: id }, 'combolist', 'unlikeItem').then((data)=>{
          if (se.json1.length > 0) {
            se.zone.run(() => se.setItemLikeStatus(id));
          }
          console.log(data);
        });
      }
      else {
        this.navCtrl.navigateForward('/login');
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
  
  goToLogout(){
    this.storage.get('auth_token').then(id_token => {
      if (id_token !== null) {
        this.storage.remove('auth_token');
        this.storage.remove('mail');
        this.storage.remove('username');
        this.storage.remove('jti');
          this.storage.remove('userInfoData');
          this.storage.remove('userRewardData');
          this.storage.remove('point');
          //Xóa token device khi logout
          if(this.platform.is('cordova')){
            FCM.getToken().then(token => {
              this.gf.DeleteTokenOfUser(token, id_token, this.gf.getAppVersion());
            });
          }
        this.navCtrl.navigateForward('/login');
      }
    });
  }
  /*** Set lại trạng thái like
   * PDANH  31/01/2018
   */
  reloadDataLike(){
    var se = this;
    if(se.json1 && se.json1.length >0){
      se.json1.forEach(item => {
        //Nếu item đang like và list like trả về ko có id của item đang xét thì untick like
        if(item.Liked && se.dataListLike.indexOf(item.HotelId) == -1){
          item.Liked = !item.Liked;
        }
      });
    }
  }
  /*** Hàm set lại điều kiện sort and filter
   * PDANH 11/02/2018
   */
  sortAndFilterAgain(){
    this.presentModal();
    if(this.searchhotel.gbitem){
      if(this.searchhotel.gbitem.RegionName){
        this.authService.region = this.searchhotel.gbitem.RegionName;
      }
      if(this.searchhotel.gbitem.RegionId){
        this.authService.regionid = this.searchhotel.gbitem.RegionId;
      }
      if(this.searchhotel.gbitem.RegionCode){
        this.authService.regioncode = this.searchhotel.gbitem.RegionCode;
      }
    }
  }
  /*** Set clear điều kiện sort and filter
   * PDANH 11/02/2018
   */
  clearSortAndFilter(){
    this.zone.run(()=>{
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
  })
    this.zone.run(()=>{
      this.searchhotel.minprice = '';
      this.searchhotel.maxprice = '';
      this.searchhotel.star = [];
      this.searchhotel.review = 0;
      this.searchhotel.chuoi = "";
      this.searchhotel.recent = [];
      this.loadpricedone = false;
      this.nodata = false;
      this.json1 = [];
      this.dataList = [];
      this.page = 1;
      this.loaddata();
      this.hasfilteragain= false;
    })
  }

  async showConfirm(){
      const alert = await this.alertCtrl.create({ 
        message: "Phiên đăng nhập hết hạn. Nhấn OK để về trang đăng nhập hoặc nhấn Cancel để về màn hình chính.",
        buttons: [
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
            this.navCtrl.navigateForward('/app/tabs/tab1');
          }
        },
        {
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
            this.navCtrl.navigateForward('/login');
          }
        }
      ]
    });
    alert.present();
  }
}
