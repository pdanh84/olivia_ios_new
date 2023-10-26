import { SearchHotel } from './../providers/book-service';
import { Component, NgZone,OnInit } from '@angular/core';
import { NavController, Platform, ModalController } from '@ionic/angular';
import { AuthService } from '../providers/auth-service';
import { HttpClientModule } from '@angular/common/http';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
/**
 * Generated class for the SearchHotelFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search-hotel-filter-and-sort',
  templateUrl: 'search-hotel-filter-and-sort.html',
  styleUrls: ['search-hotel-filter-and-sort.scss'],
})
export class SearchHotelFilterAndSortPage implements OnInit{
  
  structure: any = { lower: 100000, upper: 15000000 }; review=0; minprice; maxprice;
  star_1 = true; star_1active = false; star_2 = true; star_2active = false; star_3 = true; star_3active = false;
  star_4 = true; star_4active = false; star_5 = true; star_5active = false;  public ischeckbtnreset = false;
  public ischeckbtn = true;ischeckAL=false;
  chuoi= "";
  itemOrder;
  hasfilter = false;
  meal1check = false;
  meal2check = false;
  meal3check = false;
  local0check = false;
  local1check = false;
  local2check = false;
  local3check = false;
  local4check = false;
  local5check = false;
  local6check = false;
  local7check = false;
  local8check = false;
  local9check = false;
  local10check = false;
  local11check = false;
  local12check = false;
  local13check = false;
  local14check = false;
  local15check = false;
  local16check = false;
  local17check = false;
  local18check = false;
  local19check = false;
  arrlocalcheck:any= [];
  facility0check = false;
  facility1check = false;
  facility2check = false;
  facility3check = false;
  facility4check = false;
  facility5check = false;
  facility6check = false;
  facility7check = false;
  facility8check = false;
  facility9check = false;
  facility10check = false;
  facility11check = false;
  style0check = false;
  style1check = false;
  style2check = false;
  style3check = false;
  style4check = false;
  style5check = false;
  style6check = false;
  style7check = false;
  style8check = false;
  style9check = false;
  style10check = false;
  style11check = false;
  hoteltype0check = false;
  hoteltype1check = false;
  hoteltype2check = false;
  hoteltype3check = false;
  hoteltype4check = false;
  hoteltype5check = false;
  hoteltype6check = false;
  hoteltype7check = false;
  hoteltype8check = false;
  hoteltype9check = false;
  hoteltype10check = false;
  hoteltype11check = false;
  public dataFilter; dataLocal:any = [];dataFacility:any=[];dataStyle:any=[];dataHotelType:any=[];
  strLocal="";
  strFacility="";
  strStyle="";
  strHotelType="";
  regioncode: any;
  
  constructor(public platform: Platform,public navCtrl: NavController, public zone: NgZone, public searchhotel: SearchHotel, public authService: AuthService, private http: HttpClientModule,
    public gf: GlobalFunction,public modalCtrl: ModalController) {
    if(searchhotel.chuoi){
      this.hasfilter = true;
    }
    if(searchhotel.sortOrder){
      this.itemOrder = searchhotel.sortOrder;
    }

    if (searchhotel.minprice && this.searchhotel.maxprice) {
      this.hasfilter = true;
      //PDANH 09/01/2018: Fix lỗi không lấy được minprice,maxprice do lỗi định dạng thập phân ','
      this.structure.lower = searchhotel.minprice.replace(/\./g, '').replace(/\,/g, '');
      this.structure.upper = searchhotel.maxprice.replace(/\./g, '').replace(/\,/g, '');
      this.minprice = searchhotel.minprice;
      this.maxprice = searchhotel.maxprice; 
    }
    else {
      this.minprice = this.structure.lower.toLocaleString();
      this.maxprice = this.structure.upper.toLocaleString()
    }

    if (searchhotel.review) {
      this.hasfilter = true;
      this.review = searchhotel.review
    }
    this.ischeckAL=searchhotel.ischeckAL;
    if (searchhotel.star && searchhotel.star.length>0) {
      this.hasfilter = true;
      for (let i = 0; i < searchhotel.star.length; i++) {
        if (searchhotel.star[i] == 1) {
          this.star_1active = true;
          this.star_1 = false;
        }
        else if (searchhotel.star[i] == 2) {
          this.star_2active = true;
          this.star_2 = false;
        }
        else if (searchhotel.star[i] == 3) {
          this.star_3active = true;
          this.star_3 = false;
        }
        else if (searchhotel.star[i] == 4) {
          this.star_4active = true;
          this.star_4 = false;
        }
        else if (searchhotel.star[i] == 5) {
          this.star_5active = true;
          this.star_5 = false;
        }
      }

    //google analytic
    gf.googleAnalytion('search-hotel-filter-and-sort','load','');

    this.platform.ready().then(() => {
      window.document.addEventListener("backbutton", async() => { 
        this.navCtrl.navigateBack('/hotelist/false');
      })
    })

    }

    //console.log(authService.regioncode);
    
    var se = this;
    var code = se.searchhotel.objRecent && se.searchhotel.objRecent.code ? se.searchhotel.objRecent.code : (se.searchhotel.gbmsg ?  (se.searchhotel.gbmsg.regionCode ? se.searchhotel.gbmsg.regionCode : se.searchhotel.gbmsg.RegionCode) : authService.regioncode);
    var options = {
      method: 'POST',
      //url: 'https://beta-olivia.ivivu.com/mobile/OliviaApis/AddFavouriteHotel',
      url: C.urls.baseUrl.urlPost + '/mGetListParamForFilter?region=' + code,
      timeout: 10000, maxAttempts: 5, retryDelay: 2000,
    };

    let urlStr = C.urls.baseUrl.urlPost + '/mGetListParamForFilter?region=' + code;
    let headers = { 
      'content-type':  'application/json'
    };
    this.gf.RequestApi('POST', urlStr, headers, {}, 'searchHotelFilterAndSort', 'mGetListParamForFilter').then((data)=>{

      zone.run(()=>{
          var lstData = data;
          se.dataLocal = lstData.Locas;
          // lstData.Locas.forEach((item)=>{
          //   se.dataLocal.push(item);
          // })
         
          se.dataFacility = lstData.FacilityFilter;
          // lstData.FacilityFilter.forEach((item)=>{
          //   se.dataFacility.push(item);
          // })
          se.dataStyle = lstData.Style;
          // lstData.Style.forEach((item)=>{
          //   se.dataStyle.push(item);
          // })
          se.dataHotelType = lstData.HotelType;
          // lstData.HotelType.forEach((item)=>{
          //   se.dataHotelType.push(item);
          // })
          setTimeout(()=>{
              se.meal1check = searchhotel.meal1check;
              se.renderCssByType("meal","1", se.meal1check);
              se.meal2check = searchhotel.meal2check;
              se.renderCssByType("meal","2", se.meal2check);
              se.meal3check = searchhotel.meal3check;
              se.renderCssByType("meal","3", se.meal3check);
            //local
              se.local0check = searchhotel.local0check;
              se.renderCssByType("local","0", se.local0check);
              se.local1check = searchhotel.local1check;
              se.renderCssByType("local","1", se.local1check);
              se.local2check = searchhotel.local2check;
              se.renderCssByType("local","2", se.local2check);
              se.local3check = searchhotel.local3check;
              se.renderCssByType("local","3", se.local3check);
              se.local4check = searchhotel.local4check;
              se.renderCssByType("local","4", se.local4check);
              se.local5check = searchhotel.local5check;
              se.renderCssByType("local","5", se.local5check);
              se.local6check = searchhotel.local6check;
              se.renderCssByType("local","6", se.local6check);
              se.local7check = searchhotel.local7check;
              se.renderCssByType("local","7", se.local7check);
              se.local8check = searchhotel.local8check;
              se.renderCssByType("local","8", se.local8check);
              se.local9check = searchhotel.local9check;
              se.renderCssByType("local","9", se.local9check);
              se.local10check = searchhotel.local10check;
              se.renderCssByType("local","10", se.local10check);
              se.local11check = searchhotel.local11check;
              se.renderCssByType("local","11", se.local11check);
              se.local12check = searchhotel.local12check;
              se.renderCssByType("local","12", se.local12check);
              se.local13check = searchhotel.local13check;
              se.renderCssByType("local","13", se.local13check);
              se.local14check = searchhotel.local14check;
              se.renderCssByType("local","14", se.local14check);
              se.local15check = searchhotel.local15check;
              se.renderCssByType("local","15", se.local15check);
              se.local16check = searchhotel.local16check;
              se.renderCssByType("local","16", se.local16check);
              se.local17check = searchhotel.local17check;
              se.renderCssByType("local","17", se.local17check);
              se.local18check = searchhotel.local18check;
              se.renderCssByType("local","18", se.local18check);
              se.local19check = searchhotel.local19check;
              se.renderCssByType("local","19", se.local19check);

              if(se.searchhotel.arrlocalcheck && se.searchhotel.arrlocalcheck.length >0){
                se.arrlocalcheck = se.searchhotel.arrlocalcheck;
                se.arrlocalcheck.forEach(item => {
                  se.renderCssByType("local",item, se.gf.checkExistsIndex(se.arrlocalcheck,item) );
                });
              }
            //facility
              se.facility0check = searchhotel.facility0check;
              se.renderCssByType("facility","0", se.facility0check);
              se.facility1check = searchhotel.facility1check;
              se.renderCssByType("facility","1", se.facility1check);
              se.facility2check = searchhotel.facility2check;
              se.renderCssByType("facility","2", se.facility2check);
              se.facility3check = searchhotel.facility3check;
              se.renderCssByType("facility","3", se.facility3check);
              se.facility4check = searchhotel.facility4check;
              se.renderCssByType("facility","4", se.facility4check);
              se.facility5check = searchhotel.facility5check;
              se.renderCssByType("facility","5", se.facility5check);
              se.facility6check = searchhotel.facility6check;
              se.renderCssByType("facility","6", se.facility6check);
              se.facility7check = searchhotel.facility7check;
              se.renderCssByType("facility","7", se.facility7check);
              se.facility8check = searchhotel.facility8check;
              se.renderCssByType("facility","8", se.facility8check);
              se.facility9check = searchhotel.facility9check;
              se.renderCssByType("facility","9", se.facility9check);
              se.facility10check = searchhotel.facility10check;
              se.renderCssByType("facility","10", se.facility10check);
              se.facility11check = searchhotel.facility11check;
              se.renderCssByType("facility","11", se.facility11check);
            //style
              se.style0check = searchhotel.style0check;
              se.renderCssByType("style","0", se.style0check);
              se.style1check = searchhotel.style1check;
              se.renderCssByType("style","1", se.style1check);
              se.style2check = searchhotel.style2check;
              se.renderCssByType("style","2", se.style2check);
              se.style3check = searchhotel.style3check;
              se.renderCssByType("style","3", se.style3check);
              se.style4check = searchhotel.style4check;
              se.renderCssByType("style","4", se.style4check);
              se.style5check = searchhotel.style5check;
              se.renderCssByType("style","5", se.style5check);
              se.style6check = searchhotel.style6check;
              se.renderCssByType("style","6", se.style6check);
              se.style7check = searchhotel.style7check;
              se.renderCssByType("style","7", se.style7check);
              se.style8check = searchhotel.style8check;
              se.renderCssByType("style","8", se.style8check);
              se.style9check = searchhotel.style9check;
              se.renderCssByType("style","9", se.style9check);
              se.style10check = searchhotel.style10check;
              se.renderCssByType("style","10", se.style10check);
              se.style11check = searchhotel.style11check;
              se.renderCssByType("style","11", se.style11check);
            //hoteltype
              se.hoteltype0check = searchhotel.hoteltype0check;
              se.renderCssByType("hoteltype","0", se.hoteltype0check);
              se.hoteltype1check = searchhotel.hoteltype1check;
              se.renderCssByType("hoteltype","1", se.hoteltype1check);
              se.hoteltype2check = searchhotel.hoteltype2check;
              se.renderCssByType("hoteltype","2", se.hoteltype2check);
              se.hoteltype3check = searchhotel.hoteltype3check;
              se.renderCssByType("hoteltype","3", se.hoteltype3check);
              se.hoteltype4check = searchhotel.hoteltype4check;
              se.renderCssByType("hoteltype","4", se.hoteltype4check);
              se.hoteltype5check = searchhotel.hoteltype5check;
              se.renderCssByType("hoteltype","5", se.hoteltype5check);
              se.hoteltype6check = searchhotel.hoteltype6check;
              se.renderCssByType("hoteltype","6", se.hoteltype6check);
              se.hoteltype7check = searchhotel.hoteltype7check;
              se.renderCssByType("hoteltype","7", se.hoteltype7check);
              se.hoteltype8check = searchhotel.hoteltype8check;
              se.renderCssByType("hoteltype","8", se.hoteltype8check);
              se.hoteltype9check = searchhotel.hoteltype9check;
              se.renderCssByType("hoteltype","9", se.hoteltype9check);
              se.hoteltype10check = searchhotel.hoteltype10check;
              se.renderCssByType("hoteltype","10", se.hoteltype10check);
              se.hoteltype11check = searchhotel.hoteltype11check;
              se.renderCssByType("hoteltype","11", se.hoteltype11check);
          })
            
        },10)
      })
         
  }
  
  ngOnInit() {
    
  }

  /***
   * Hàm set style mục chọn filter được check(màu xanh)/uncheck (ko màu)
   * PDANH 28/01/2019
   */
  renderCssByType(strType: string, strIndex: string,checked: boolean){
    var objLocal = window.document.getElementsByClassName(strType + '-item-'+ strIndex);
    if(objLocal[0]){
      objLocal[0].classList.remove('local-check');
      objLocal[0].classList.remove('local-uncheck');
      if(strType == "local"){
        objLocal[0].classList.add(checked ? 'local-check' : 'local-uncheck');
      }else if(strType == "style"){
        objLocal[0].classList.add(checked ? 'style-check' : 'style-uncheck');
      }else if(strType == "facility"){
        objLocal[0].classList.add(checked ? 'facility-check' : 'facility-uncheck');
      }else if(strType == "hoteltype"){
        objLocal[0].classList.add(checked ? 'hoteltype-check' : 'hoteltype-uncheck');
      }
    }
  }

  close() {
    //this.navCtrl.navigateBack('/hotellist/false');
    //this.navCtrl.navigateBack(['/app/tabs/hotellist/false']);
    this.modalCtrl.dismiss('close');
  }
  test() {
    this.minprice = this.structure.lower.toLocaleString()
    this.maxprice = this.structure.upper.toLocaleString()

  }
  star1() {
    if (this.star_1 == true) {
      this.star_1 = false;
      this.star_1active = true;
    }
    else {
      this.star_1 = true;
      this.star_1active = false;
    }
  }
  star2() {
    if (this.star_2 == true) {
      this.star_2 = false;
      this.star_2active = true;
    }
    else {
      this.star_2 = true;
      this.star_2active = false;
    }
  }
  star3() {
    if (this.star_3 == true) {
      this.star_3 = false;
      this.star_3active = true;
    }
    else {
      this.star_3 = true;
      this.star_3active = false;
    }
  }
  star4() {
    if (this.star_4 == true) {
      this.star_4 = false;
      this.star_4active = true;
    }
    else {
      this.star_4 = true;
      this.star_4active = false;
    }
  }
  star5() {
    if (this.star_5 == true) {
      this.star_5 = false;
      this.star_5active = true;
    }
    else {
      this.star_5 = true;
      this.star_5active = false;
    }
  }
  reviewchange() {

  }

  /***
   * Hàm reset style mục chọn
   * PDANH 28/01/2019
   */
  clickCancel() {
      //reset allotment
      this.ischeckAL=false;
      // Reset giá
      this.ischeckbtnreset=true;
      this.ischeckbtn=false;
      this.structure = { lower: 100000, upper: 15000000 };
      // Reset *
      this.star_1=true;
      this.star_2=true;
      this.star_3=true;
      this.star_4=true;
      this.star_5=true;
      this.star_1active=false;
      this.star_2active=false;
      this.star_3active=false;
      this.star_4active=false;
      this.star_5active=false;
      // Reset review
      this.review=0;
      this.searchhotel.chuoi = "";
      this.searchhotel.minprice = '';
      this.searchhotel.maxprice = '';
      //Reset other filter
      this.meal1check = false;
      this.meal2check = false;
      this.meal3check = false;
      this.local0check = false;
      this.local1check = false;
      this.local2check = false;
      this.local3check = false;
      this.local4check = false;
      this.local5check = false;
      this.local6check = false;
      this.local7check = false;
      this.local8check = false;
      this.local9check = false;
      this.local10check = false;
      this.local11check = false;
      this.local12check = false;
      this.local13check = false;
      this.local14check = false;
      this.local15check = false;
      this.local16check = false;
      this.local17check = false;
      this.local18check = false;
      this.arrlocalcheck = [];
      this.local19check = false;
      this.facility0check = false;
      this.facility1check = false;
      this.facility2check = false;
      this.facility3check = false;
      this.facility4check = false;
      this.facility5check = false;
      this.facility6check = false;
      this.facility7check = false;
      this.facility8check = false;
      this.facility9check = false;
      this.style0check = false;
      this.style1check = false;
      this.style2check = false;
      this.style3check = false;
      this.style4check = false;
      this.style5check = false;
      this.style6check = false;
      this.style7check = false;
      this.style8check = false;
      this.style9check = false;
      this.hoteltype0check = false;
      this.hoteltype1check = false;
      this.hoteltype2check = false;
      this.hoteltype3check = false;
      this.hoteltype4check = false;
      this.hoteltype5check = false;
      this.hoteltype6check = false;
      this.hoteltype7check = false;
      this.hoteltype8check = false;
      this.hoteltype9check = false;

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
      this.searchhotel.arrlocalcheck = [];
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
      this.itemOrder = null;

      let listMeal = window.document.getElementsByClassName("meal-check");
      if(listMeal.length >0){
        for(let i =listMeal.length-1; i>=0; i--){
          listMeal[i].classList.remove('meal-check');
        }
      }
      let listLocal = window.document.getElementsByClassName("local-check");
      if(listLocal.length >0){
        for(let i =listLocal.length-1; i>=0; i--){
          listLocal[i].classList.remove('local-check');
        }
      }
      let listStyle = window.document.getElementsByClassName("style-check");
      if(listStyle.length >0){
        for(let i =listStyle.length-1; i>=0; i--){
          listStyle[i].classList.remove('style-check');
        }
      }
      let listFacility = window.document.getElementsByClassName("facility-check");
      if(listFacility.length >0){
        for(let i =listFacility.length-1; i>=0; i--){
          listFacility[i].classList.remove('facility-check');
        }
      }
      let listHotelType = window.document.getElementsByClassName("hoteltype-check");
      if(listHotelType.length >0){
        for(let i =listHotelType.length-1; i >=0; i--){
          listHotelType[i].classList.remove('hoteltype-check');
        }
      }
      this.strLocal="";
      this.strStyle="";
      this.strFacility="";
      this.strHotelType="";
      this.searchhotel.hasSortHotelList = "";
  }
  clickOk() {
    this.ischeckbtnreset=false;
    this.ischeckbtn=true;
    this.searchhotel.sortOrder = this.itemOrder;
    this.searchhotel.chuoi = "";
    this.searchhotel.star = [];
    if (this.star_1active == true) {
      this.searchhotel.star.push(1);
    }
    if (this.star_2active == true) {
      this.searchhotel.star.push(2);
    }
    if (this.star_3active == true) {
      this.searchhotel.star.push(3);
    }
    if (this.star_4active == true) {
      this.searchhotel.star.push(4);
    }
    if (this.star_5active == true) {
      this.searchhotel.star.push(5);
    }
    //PDANH 09/01/2018: Fix lỗi không lấy được minprice,maxprice do lỗi định dạng thập phân ','
    var minprice1 = this.minprice.replace(/\./g, '').replace(/\,/g, '');
    var maxprice1 = this.maxprice.replace(/\./g, '').replace(/\,/g, '');
    if (minprice1*1 > 100000 || maxprice1*1 < 15000000) {
      this.searchhotel.minprice = this.minprice;
      this.searchhotel.maxprice = this.maxprice;
    }else{//Nếu chọn = biên thì reset lại minprice = null
      this.minprice = this.structure.lower.toLocaleString();
      this.maxprice = this.structure.upper.toLocaleString()
    }
    if (this.review >= 0) {
      this.searchhotel.review = this.review;
    }

    //Build chuỗi filter
    if (!this.searchhotel.chuoi) {
      if (this.searchhotel.star) {
        for (let i = 0; i < this.searchhotel.star.length; i++) {
          if (i == 0) {
            if (i == this.searchhotel.star.length - 1) {
              this.chuoi = "* " + this.searchhotel.star[i];
            } else {
              this.chuoi = "* " + this.searchhotel.star[i] + ",";
            }

          }
          else if (i != 0) {
            if (i != this.searchhotel.star.length - 1) {
              this.chuoi = this.chuoi + this.searchhotel.star[i] + ",";
            } else {
              this.chuoi = this.chuoi + this.searchhotel.star[i];
            }
          }
        }
      }
      if (this.searchhotel.minprice) {
        if (this.chuoi) {
          this.chuoi = this.chuoi + " | " + "đ " + this.searchhotel.minprice.toLocaleString() + " -" + " " + this.searchhotel.maxprice.toLocaleString();
        } else {
          this.chuoi = "đ " + this.searchhotel.minprice.toLocaleString() + " -" + " " + this.searchhotel.maxprice.toLocaleString();
        }
      }
      if (this.searchhotel.review > 0) {
        if (this.chuoi) {
          this.chuoi = this.chuoi + " | " + "Nhận xét " + this.searchhotel.review + "+";
        } else {
          this.chuoi = "Nhận xét " + this.searchhotel.review + "+";
        }
      }
      this.searchhotel.chuoi = this.chuoi;
    }

    if (this.searchhotel.gbmsg && this.searchhotel.gbmsg.Type == 1) {
      var id1 = { id: this.searchhotel.gbmsg.HotelId };
      this.navCtrl.navigateForward('/hoteldetail:'+this.searchhotel.gbmsg.HotelId);
    } else {
      if(this.searchhotel.gbmsg){
        this.authService.region = this.searchhotel.gbmsg.regionName;
        this.authService.regionid = this.searchhotel.gbmsg.regionId;
        this.authService.regioncode = this.searchhotel.gbmsg.regionCode;
      }
     
      var sortOnly = (this.searchhotel.chuoi == "" && this.itemOrder);
      var id2 = {filteragain: true, sortOnly: sortOnly};
      //Build other filter
      //Meal

      //Local
      let listLocal = window.document.getElementsByClassName("local-check");
      this.searchhotel.location = "";
      if(listLocal.length >0){
        for(let i =0; i<listLocal.length; i++){
          if(i==0){
            this.strLocal += listLocal[i].getAttribute("id");
          }else{
            this.strLocal += "," + listLocal[i].getAttribute("id");
          }
        }
        this.searchhotel.location = this.strLocal;
      }
      //Facility
      let listFacility = window.document.getElementsByClassName("facility-check");
      this.searchhotel.facsearch ="";
      if(listFacility.length >0){
        for(let i =0; i<listFacility.length; i++){
          if(i==0){
            this.strFacility += listFacility[i].getAttribute("id");
          }else{
            this.strFacility += "," + listFacility[i].getAttribute("id");
          }
        }
        this.searchhotel.facsearch = this.strFacility;
      }
      //Style
      let listStyle = window.document.getElementsByClassName("style-check");
      this.searchhotel.tagIds = "";
      if(listStyle.length >0){
        for(let i =0; i<listStyle.length; i++){
          if(i==0){
            this.strStyle += listStyle[i].getAttribute("id");
          }else{
            this.strStyle += "," + listStyle[i].getAttribute("id");
          }
        }
        this.searchhotel.tagIds = this.strStyle;
      }
      //HotelType
      let listHotelType = window.document.getElementsByClassName("hoteltype-check");
      this.searchhotel.classIds = "";
      if(listHotelType.length >0){
        for(let i =0; i<listHotelType.length; i++){
          if(i==0){
            this.strHotelType += listHotelType[i].getAttribute("id");
          }else{
            this.strHotelType += "," + listHotelType[i].getAttribute("id");
          }
        }
        this.searchhotel.classIds = this.strHotelType;
      }
      this.searchhotel.ischeckAL=this.ischeckAL;
      this.searchhotel.hasSortHotelList = this.searchhotel.minprice || this.searchhotel.maxprice || this.searchhotel.chuoi || this.searchhotel.location ||this.searchhotel.facsearch || this.searchhotel.tagIds || this.searchhotel.classIds || this.searchhotel.tagIds || this.searchhotel.ischeckAL; 
      //Xóa clone page-hotel-list do push page
      let elements = Array.from(window.document.querySelectorAll("page-hotel-list")); 
      if(elements.length > 0){
        elements.forEach(el => {
          el.remove();
        });
      }
      //this.navCtrl.navigateBack('/hotellist/true');
      //this.navCtrl.navigateBack(['/app/tabs/hotellist/true']);
      this.modalCtrl.dismiss();
      //google analytic
      this.gf.googleAnalytion('filterandsort','Search',this.chuoi + '|' + this.strLocal+'|'+this.strFacility+'|'+this.strStyle+'|'+this.strHotelType);
    }
    //this.view.dismiss();
  }

  meal1Click(){
    this.meal1check = !this.meal1check;
    this.searchhotel.meal1check = this.meal1check;
  }
  meal2Click(){
    this.meal2check = !this.meal2check;
    this.searchhotel.meal2check = this.meal2check;
  }
  meal3Click(){
    this.meal3check = !this.meal3check;
    this.searchhotel.meal3check = this.meal3check;
  }
  /***
   * Hàm set style check/uncheck theo option được chọn
   * PDANH 28/01/2019
   */
  localClick(objEvent, name){
    let idx = objEvent.target.className ? objEvent.target.className.toLocaleString().split(' ')[1].split('-')[2] : (objEvent.currentTarget.className ? objEvent.currentTarget.className.toLocaleString().split(' ')[1].split('-')[2] : '');
    var obj = window.document.getElementsByClassName(objEvent.target.className ? objEvent.target.className.toLocaleString().split(' ')[1] : (objEvent.currentTarget.className ? objEvent.currentTarget.className.toLocaleString().split(' ')[1] : ''));
    if(idx && obj){
      obj[0].classList.remove('local-check');
      obj[0].classList.remove('local-uncheck');
      obj[0].classList.remove('style-check');
      obj[0].classList.remove('style-uncheck');
      obj[0].classList.remove('facility-check');
      obj[0].classList.remove('facility-uncheck');
      obj[0].classList.remove('hoteltype-check');
      obj[0].classList.remove('hoteltype-uncheck');
      switch(idx){
        case "0":
        if(name == "local"){
          this.local0check = !this.local0check;
          this.searchhotel.local0check = this.local0check;
          obj[0].classList.add(this.local0check ? 'local-check' : 'local-uncheck');
        }else if(name == "style"){
          this.style0check = !this.style0check;
          this.searchhotel.style0check = this.style0check;
          obj[0].classList.add(this.style0check ? 'style-check' : 'style-uncheck');
        }else if(name == "facility"){
          this.facility0check = !this.facility0check;
          this.searchhotel.facility0check = this.facility0check;
          obj[0].classList.add(this.facility0check ? 'facility-check' : 'facility-uncheck');
        }
        else if(name == "hoteltype"){
          this.hoteltype0check = !this.hoteltype0check;
          this.searchhotel.hoteltype0check = this.hoteltype0check;
          obj[0].classList.add(this.hoteltype0check ? 'hoteltype-check' : 'hoteltype-uncheck');
        }
          
        break;
        case "1":
          if(name == "local"){
            this.local1check = !this.local1check;
            this.searchhotel.local1check = this.local1check;
            obj[0].classList.add(this.local1check ? 'local-check' : 'local-uncheck');
          }else if(name == "style"){
            this.style1check = !this.style1check;
            this.searchhotel.style1check = this.style1check;
            obj[0].classList.add(this.style1check ? 'style-check' : 'style-uncheck');
          }else if(name == "facility"){
            this.facility1check = !this.facility1check;
            this.searchhotel.facility1check = this.facility1check;
            obj[0].classList.add(this.facility1check ? 'facility-check' : 'facility-uncheck');
          }else if(name == "hoteltype"){
            this.hoteltype1check = !this.hoteltype1check;
            this.searchhotel.hoteltype1check = this.hoteltype1check;
            obj[0].classList.add(this.hoteltype1check ? 'hoteltype-check' : 'hoteltype-uncheck');
          }
          
        break;
        case "2":
          if(name == "local"){
            this.local2check = !this.local2check;
            this.searchhotel.local2check = this.local2check;
            obj[0].classList.add(this.local2check ? 'local-check' : 'local-uncheck');
          }else if(name == "style"){
            this.style2check = !this.style2check;
            this.searchhotel.style2check = this.style2check;
            obj[0].classList.add(this.style2check ? 'style-check' : 'style-uncheck');
          }else if(name == "facility"){
            this.facility2check = !this.facility2check;
            this.searchhotel.facility2check = this.facility2check;
            obj[0].classList.add(this.facility2check ? 'facility-check' : 'facility-uncheck');
          }else if(name == "hoteltype"){
            this.hoteltype2check = !this.hoteltype2check;
            this.searchhotel.hoteltype2check = this.hoteltype2check;
            obj[0].classList.add(this.hoteltype2check ? 'hoteltype-check' : 'hoteltype-uncheck');
          }
        break;
        case "3":
          if(name == "local"){
            this.local3check = !this.local3check;
            this.searchhotel.local3check = this.local3check;
            obj[0].classList.add(this.local3check ? 'local-check' : 'local-uncheck');
          }else if(name == "style"){
            this.style3check = !this.style3check;
            this.searchhotel.style3check = this.style3check;
            obj[0].classList.add(this.style3check ? 'style-check' : 'style-uncheck');
          }else if(name == "facility"){
            this.facility3check = !this.facility3check;
            this.searchhotel.facility3check = this.facility3check;
            obj[0].classList.add(this.facility3check ? 'facility-check' : 'facility-uncheck');
          }else if(name == "hoteltype"){
            this.hoteltype3check = !this.hoteltype3check;
            this.searchhotel.hoteltype3check = this.hoteltype3check;
            obj[0].classList.add(this.hoteltype3check ? 'hoteltype-check' : 'hoteltype-uncheck');
          }
        break;
        case "4":
          if(name == "local"){
            this.local4check = !this.local4check;
            this.searchhotel.local4check = this.local4check;
            obj[0].classList.add(this.local4check ? 'local-check' : 'local-uncheck');
          }else if(name == "style"){
            this.style4check = !this.style4check;
            this.searchhotel.style4check = this.style4check;
            obj[0].classList.add(this.style4check ? 'style-check' : 'style-uncheck');
          }else if(name == "facility"){
            this.facility4check = !this.facility4check;
            this.searchhotel.facility4check = this.facility4check;
            obj[0].classList.add(this.facility4check ? 'facility-check' : 'facility-uncheck');
          }else if(name == "hoteltype"){
            this.hoteltype4check = !this.hoteltype4check;
            this.searchhotel.hoteltype4check = this.hoteltype4check;
            obj[0].classList.add(this.hoteltype4check ? 'hoteltype-check' : 'hoteltype-uncheck');
          }
        break;
        case "5":
          if(name == "local"){
            this.local5check = !this.local5check;
            this.searchhotel.local5check = this.local5check;
            obj[0].classList.add(this.local5check ? 'local-check' : 'local-uncheck');
          }else if(name == "style"){
            this.style5check = !this.style5check;
            this.searchhotel.style5check = this.style5check;
            obj[0].classList.add(this.style5check ? 'style-check' : 'style-uncheck');
          }else if(name == "facility"){
            this.facility5check = !this.facility5check;
            this.searchhotel.facility5check = this.facility5check;
            obj[0].classList.add(this.facility5check ? 'facility-check' : 'facility-uncheck');
          }else if(name == "hoteltype"){
            this.hoteltype5check = !this.hoteltype5check;
            this.searchhotel.hoteltype5check = this.hoteltype5check;
            obj[0].classList.add(this.hoteltype5check ? 'hoteltype-check' : 'hoteltype-uncheck');
          }
        break;
        case "6":
          if(name == "local"){
            this.local6check = !this.local6check;
            this.searchhotel.local6check = this.local6check;
            obj[0].classList.add(this.local6check ? 'local-check' : 'local-uncheck');
          }else if(name == "style"){
            this.style6check = !this.style6check;
            this.searchhotel.style6check = this.style6check;
            obj[0].classList.add(this.style6check ? 'style-check' : 'style-uncheck');
          }else if(name == "facility"){
            this.facility6check = !this.facility6check;
            this.searchhotel.facility6check = this.facility6check;
            obj[0].classList.add(this.facility6check ? 'facility-check' : 'facility-uncheck');
          }else if(name == "hoteltype"){
            this.hoteltype6check = !this.hoteltype6check;
            this.searchhotel.hoteltype6check = this.hoteltype6check;
            obj[0].classList.add(this.hoteltype6check ? 'hoteltype-check' : 'hoteltype-uncheck');
          }
        break;
        case "7":
          if(name == "local"){
            this.local7check = !this.local7check;
            this.searchhotel.local7check = this.local7check;
            obj[0].classList.add(this.local7check ? 'local-check' : 'local-uncheck');
          }else if(name == "style"){
            this.style7check = !this.style7check;
            this.searchhotel.style7check = this.style7check;
            obj[0].classList.add(this.style7check ? 'style-check' : 'style-uncheck');
          }else if(name == "facility"){
            this.facility7check = !this.facility7check;
            this.searchhotel.facility7check = this.facility7check;
            obj[0].classList.add(this.facility7check ? 'facility-check' : 'facility-uncheck');
          }else if(name == "hoteltype"){
            this.hoteltype7check = !this.hoteltype7check;
            this.searchhotel.hoteltype7check = this.hoteltype7check;
            obj[0].classList.add(this.hoteltype7check ? 'hoteltype-check' : 'hoteltype-uncheck');
          }
        break;
        case "8":
          if(name == "local"){
            this.local8check = !this.local8check;
            this.searchhotel.local8check = this.local8check;
            obj[0].classList.add(this.local8check ? 'local-check' : 'local-uncheck');
          }else if(name == "style"){
            this.style8check = !this.style8check;
            this.searchhotel.style8check = this.style8check;
            obj[0].classList.add(this.style8check ? 'style-check' : 'style-uncheck');
          }else if(name == "facility"){
            this.facility8check = !this.facility8check;
            this.searchhotel.facility8check = this.facility8check;
            obj[0].classList.add(this.facility8check ? 'facility-check' : 'facility-uncheck');
          }else if(name == "hoteltype"){
            this.hoteltype8check = !this.hoteltype8check;
            this.searchhotel.hoteltype8check = this.hoteltype8check;
            obj[0].classList.add(this.hoteltype8check ? 'hoteltype-check' : 'hoteltype-uncheck');
          }
        break;
        case "9":
          if(name == "local"){
            this.local9check = !this.local9check;
            this.searchhotel.local9check = this.local9check;
            obj[0].classList.add(this.local9check ? 'local-check' : 'local-uncheck');
          }else if(name == "style"){
            this.style9check = !this.style9check;
            this.searchhotel.style9check = this.style9check;
            obj[0].classList.add(this.style9check ? 'style-check' : 'style-uncheck');
          }else if(name == "facility"){
            this.facility9check = !this.facility9check;
            this.searchhotel.facility9check = this.facility9check;
            obj[0].classList.add(this.facility9check ? 'facility-check' : 'facility-uncheck');
          }else if(name == "hoteltype"){
            this.hoteltype9check = !this.hoteltype9check;
            this.searchhotel.hoteltype9check = this.hoteltype9check;
            obj[0].classList.add(this.hoteltype9check ? 'hoteltype-check' : 'hoteltype-uncheck');
          }
        break;
        case "10":
        if(name == "local"){
          this.local10check = !this.local10check;
          this.searchhotel.local10check = this.local10check;
          obj[0].classList.add(this.local10check ? 'local-check' : 'local-uncheck');
        }else if(name == "style"){
          this.style10check = !this.style10check;
          this.searchhotel.style10check = this.style10check;
          obj[0].classList.add(this.style10check ? 'style-check' : 'style-uncheck');
        }else if(name == "facility"){
          this.facility10check = !this.facility10check;
          this.searchhotel.facility10check = this.facility10check;
          obj[0].classList.add(this.facility10check ? 'facility-check' : 'facility-uncheck');
        }else if(name == "hoteltype"){
          this.hoteltype10check = !this.hoteltype10check;
          this.searchhotel.hoteltype10check = this.hoteltype10check;
          obj[0].classList.add(this.hoteltype10check ? 'hoteltype-check' : 'hoteltype-uncheck');
        }
        break;
        case "11":
        if(name == "local"){
          this.local11check = !this.local11check;
          this.searchhotel.local11check = this.local11check;
          obj[0].classList.add(this.local11check ? 'local-check' : 'local-uncheck');
        }else if(name == "style"){
          this.style11check = !this.style11check;
          this.searchhotel.style11check = this.style11check;
          obj[0].classList.add(this.style11check ? 'style-check' : 'style-uncheck');
        }else if(name == "facility"){
          this.facility11check = !this.facility11check;
          this.searchhotel.facility11check = this.facility11check;
          obj[0].classList.add(this.facility11check ? 'facility-check' : 'facility-uncheck');
        }else if(name == "hoteltype"){
          this.hoteltype11check = !this.hoteltype11check;
          this.searchhotel.hoteltype11check = this.hoteltype11check;
          obj[0].classList.add(this.hoteltype11check ? 'hoteltype-check' : 'hoteltype-uncheck');
        }
        break;
        case "12":
        if(name == "local"){
          this.local12check = !this.local12check;
          this.searchhotel.local12check = this.local12check;
          obj[0].classList.add(this.local12check ? 'local-check' : 'local-uncheck');
        }
        break;
        case "13":
        if(name == "local"){
          this.local13check = !this.local13check;
          this.searchhotel.local13check = this.local13check;
          obj[0].classList.add(this.local13check ? 'local-check' : 'local-uncheck');
        }
        break;
        case "14":
        if(name == "local"){
          this.local14check = !this.local14check;
          this.searchhotel.local14check = this.local14check;
          obj[0].classList.add(this.local14check ? 'local-check' : 'local-uncheck');
        }
        break;
        case "15":
        if(name == "local"){
          this.local15check = !this.local15check;
          this.searchhotel.local15check = this.local15check;
          obj[0].classList.add(this.local15check ? 'local-check' : 'local-uncheck');
        }
        break;
        case "16":
        if(name == "local"){
          this.local16check = !this.local16check;
          this.searchhotel.local16check = this.local16check;
          obj[0].classList.add(this.local16check ? 'local-check' : 'local-uncheck');
        }
        break;
        case "17":
        if(name == "local"){
          this.local17check = !this.local17check;
          this.searchhotel.local17check = this.local17check;
          obj[0].classList.add(this.local17check ? 'local-check' : 'local-uncheck');
        }
        break;
        case "18":
        if(name == "local"){
          this.local18check = !this.local18check;
          this.searchhotel.local18check = this.local18check;
          obj[0].classList.add(this.local18check ? 'local-check' : 'local-uncheck');
        }
        break;
        case "19":
        if(name == "local"){
          this.local19check = !this.local19check;
          this.searchhotel.local19check = this.local19check;
          obj[0].classList.add(this.local19check ? 'local-check' : 'local-uncheck');
        }
        break;
        default:
          if(name == "local"){
            if(this.gf.checkExistsIndex(this.arrlocalcheck,idx)){
              this.gf.removeItem(this.arrlocalcheck,idx);
              this.gf.removeItem(this.searchhotel.arrlocalcheck,idx);
            }else{
              this.arrlocalcheck.push(idx);
              this.searchhotel.arrlocalcheck.push(idx);
            }
            
            obj[0].classList.add(this.gf.checkExistsIndex(this.arrlocalcheck,idx) ? 'local-check' : 'local-uncheck');
          }
        break;
      }
    }
    
    
  }

 
  closeModal() {
    this.navCtrl.navigateBack('/hotellist/true');
    //this.navCtrl.navigateBack(['/app/tabs/hotellist/true']);
    
  }
  ionViewDidLoad() {
    let elements = window.document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'none';
      });
    }
  }

}
