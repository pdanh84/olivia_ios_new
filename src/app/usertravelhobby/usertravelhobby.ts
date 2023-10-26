import { SearchHotel } from './../providers/book-service';
import { Component, NgZone,OnInit } from '@angular/core';
import { NavController, Platform, ModalController, AlertController } from '@ionic/angular';
import { AuthService } from '../providers/auth-service';
import { HttpClientModule } from '@angular/common/http';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the SearchHotelFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-usertravelhobby',
  templateUrl: 'usertravelhobby.html',
  styleUrls: ['usertravelhobby.scss'],
})
export class UserTravelHobbyPage implements OnInit{
  
  objData:any = [];
  structure: any = { lower: 100000, upper: 15000000 }; review; minprice; maxprice;
  star_1 = true; star_1active = false; star_2 = true; star_2active = false; star_3 = true; star_3active = false;
  star_4 = true; star_4active = false; star_5 = true; star_5active = false;  public ischeckbtnreset = false;
  public ischeckbtn = true;
  chuoi= "";
  arrlocalcheck:any= [];
  arrtrademarkcheck:any =[];
  arrfacilitycheck:any =[];
  arrstylecheck:any=[];
  arrhoteltypecheck:any=[];
  
  public dataFilter; dataLocal:any = [];dataFacility:any=[];dataStyle:any=[];dataHotelType:any=[];dataTrademark:any=[];
  strLocal="";
  strFacility="";
  strStyle="";
  strHotelType="";
  regioncode: any;
  memberid: any;
  strTrademark: any;
  
  constructor(public platform: Platform,public navCtrl: NavController, public zone: NgZone, public searchhotel: SearchHotel, public authService: AuthService, private http: HttpClientModule,
    public gf: GlobalFunction,public modalCtrl: ModalController,public storage: Storage, public alertCtrl: AlertController) {
      this.storage.get('jti').then((uid:any)=>{
        this.memberid = uid;
      })
      this.loadRecommentSetting();
  }

  ionViewWilEnter(){
    var se = this;
    se.loadRecommentSetting();
    //Set activetab theo form cha
    se.gf.setActivatedTab(5);
  }

  loadRecommentSetting() {
    var se = this;
      se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'GET',
        //   url: C.urls.baseUrl.urlMobile+ '/api/Dashboard/GetRecommentSetting'+(se.memberid ? ('?memberid='+this.memberid) : ''),
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json',
        //     authorization: text
        //   }
        // };
        let urlStr = C.urls.baseUrl.urlMobile+ '/api/Dashboard/GetRecommentSetting'+(se.memberid ? ('?memberid='+this.memberid) : '');
        let headers = {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        };
        this.gf.RequestApi('GET', urlStr, headers, {}, 'userTravelHobby', 'loadRecommentSetting').then((data)=>{

          if(data){
            se.objData = data.recomments;
            se.bindData();
          }
          else{
                //se.showConfirm();
          }
          })  
      }
    })
  }

  public async showConfirm(){
    let alert = await this.alertCtrl.create({
      message: "Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại để sử dụng chức năng này.",
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
          this.storage.remove('blogtripdefault');
          this.navCtrl.navigateRoot('/tab5');
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
          this.storage.remove('blogtripdefault');
          this.navCtrl.navigateForward('/login');
        }
      }
    ]
  });
  alert.present();

}

  bindData(){
    var se = this;
    se.arrtrademarkcheck =[];
    se.arrfacilitycheck=[];
    se.arrhoteltypecheck=[];
    se.arrstylecheck=[];
    se.zone.run(()=>{
      if (se.objData && se.objData[0].items.length >0)  {
        se.strLocal = se.objData[0].propertyName;
          for (let i = 0; i < se.objData[0].items.length; i++) {
              var itemId = se.objData[0].items[i].id;
              var itemChecked = se.objData[0].items[i].hasCheck;
            if (itemId == 1 && itemChecked) {
              this.star_1active = true;
              this.star_1 = false;
            }
            else if (itemId == 2 && itemChecked) {
              this.star_2active = true;
              this.star_2 = false;
            }
            else if (itemId == 3 && itemChecked) {
              this.star_3active = true;
              this.star_3 = false;
            }
            else if (itemId == 4 && itemChecked) {
              this.star_4active = true;
              this.star_4 = false;
            }
            else if (itemId == 5 && itemChecked) {
              this.star_5active = true;
              this.star_5 = false;
            }
          }
        }
        //Thương hiệu
        if(se.objData && se.objData[1] && se.objData[1].items.length >0){
          se.strTrademark = se.objData[1].propertyName;
          se.dataTrademark = se.objData[1].items;
        }
        //Phong cách
        if(se.objData && se.objData[2] && se.objData[2].items.length >0){
          se.strStyle = se.objData[2].propertyName;
          se.dataStyle = se.objData[2].items;
        }
        //Loại hình
        if(se.objData && se.objData[3] && se.objData[3].items.length >0){
          se.strHotelType = se.objData[3].propertyName;
          se.dataHotelType = se.objData[3].items;
        }
        //Tiện ích
        if(se.objData && se.objData[4] && se.objData[4].items.length >0){
          se.strFacility = se.objData[4].propertyName;
          se.dataFacility = se.objData[4].items;
        }
       
        setTimeout(()=>{
            //Trademark
            if(se.dataTrademark && se.dataTrademark.length >0){
                se.dataTrademark.forEach(item => {
                  se.renderCssByType("trademark",(Number(item.id)).toString(), item.hasCheck );
                  if(item.hasCheck){
                    if(!se.gf.checkExistsIndex(se.arrtrademarkcheck,item)){
                      se.arrtrademarkcheck.push(item.id);
                    }
                  }
                });
            }
          //facility
          if(se.dataFacility && se.dataFacility.length >0){
            se.dataFacility.forEach(item => {
              se.renderCssByType("facility",(Number(item.id)).toString(), item.hasCheck );
              if(item.hasCheck){
                if(!se.gf.checkExistsIndex(se.arrfacilitycheck,item)){
                  se.arrfacilitycheck.push(item.id);
                }
              }
            });
            }
          //style
          if(se.dataStyle && se.dataStyle.length >0){
            se.dataStyle.forEach(item => {
              se.renderCssByType("style",(Number(item.id)).toString(), item.hasCheck );
              if(item.hasCheck){
                if(!se.gf.checkExistsIndex(se.arrstylecheck,item)){
                  se.arrstylecheck.push(item.id);
                }
              }
            });
            }
          //hoteltype
          if(se.dataHotelType && se.dataHotelType.length >0){
            se.dataHotelType.forEach(item => {
              se.renderCssByType("hoteltype",(Number(item.id)).toString(), item.hasCheck );
              if(item.hasCheck){
                if(!se.gf.checkExistsIndex(se.arrhoteltypecheck,item)){
                  se.arrhoteltypecheck.push(item.id);
                }
              }
            });
            }
        })
          
      },10)
  }
  
  
  ngOnInit() {
    
  }

  goback(){
      this.navCtrl.back();
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
      }else if(strType == "trademark"){
        objLocal[0].classList.add(checked ? 'trademark-check' : 'trademark-uncheck');
      }
    }
  }

  close() {
    //this.navCtrl.navigateBack('/hotellist/false');
    //this.navCtrl.navigateBack(['/app/tabs/hotellist/false']);
    this.modalCtrl.dismiss();
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
    this.clickOk('starlevel',1);
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
    this.clickOk('starlevel',2);
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
    this.clickOk('starlevel',3);
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
    this.clickOk('starlevel',4);
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
    this.clickOk('starlevel',5);
  }
  reviewchange() {

  }

  /***
   * Hàm reset style mục chọn
   * PDANH 28/01/2019
   */
  clickCancel() {
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
      //Reset other filter
      this.arrlocalcheck = [];
      this.arrfacilitycheck = [];
      this.arrstylecheck=[];
      this.arrtrademarkcheck=[];
      this.arrhoteltypecheck=[];
     
      this.searchhotel.arrlocalcheck = [];
      this.searchhotel.arrfacilitycheck = [];
      this.searchhotel.arrstylecheck=[];
      this.searchhotel.arrtrademarkcheck=[];
      this.searchhotel.arrhoteltypecheck=[];
      

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
  }
  clickOk(namechanged, indexCheck) {
    var items = {};
    var objStar ={};
    var objtrademark ={};
    var objfacility={};
    var objstyle={};
    var objhoteltype={};
    if(namechanged == 'starlevel'){
      if(indexCheck==1){
        items = {id: 1,name: '1 Sao', hasCheck: (this.star_1active ? true : false),isCheckType: true,isValueType: false,propertyId: 4,propertyName: "Hạng sao",propertySort: 3, value: null};
      }
      if(indexCheck==2){
        items = {id: 2,name: '2 Sao', hasCheck: (this.star_2active ? true : false),isCheckType: true,isValueType: false,propertyId: 4,propertyName: "Hạng sao",propertySort: 3, value: null};
      }
      if(indexCheck==3){
        items ={id: 3,name: '3 Sao', hasCheck: (this.star_3active ? true : false),isCheckType: true,isValueType: false,propertyId: 4,propertyName: "Hạng sao",propertySort: 3, value: null};
      }
      if(indexCheck==4){
        items = {id: 4,name: '4 Sao', hasCheck: (this.star_4active ? true : false),isCheckType: true,isValueType: false,propertyId: 4,propertyName: "Hạng sao",propertySort: 3, value: null};
      }
      if(indexCheck==5){
        items={id: 5,name: '5 Sao', hasCheck: (this.star_5active ? true : false),isCheckType: true,isValueType: false,propertyId: 4,propertyName: "Hạng sao",propertySort: 3, value: null};
      }

      objStar = {
        changed: namechanged == 'starlevel' ? true : false,
        code: 'starlevel',
        propertyName: 'Hạng sao',
        items: [items]
      }
    }
    //trademark
    if(namechanged == 'trademark'){
      this.dataTrademark.forEach((element,index) => {
        if(indexCheck == element.id){
          element.hasCheck = this.gf.checkExistsIndex(this.arrtrademarkcheck,element.id)? true : false;
          objtrademark = {
            changed: namechanged == 'trademark' ? true : false,
            code: 'trademark',
            propertyName: 'Thương hiệu',
            items: [element]
          }
        }
      });
     
    }
      //Facility
      if(namechanged == 'facility'){
        this.dataFacility.forEach((element,index) => {
          if(indexCheck == element.id){
            element.hasCheck = this.gf.checkExistsIndex(this.arrfacilitycheck,element.id)? true : false;
            objfacility = {
              changed: namechanged == 'facility' ? true : false,
              code: 'facility',
              propertyName: 'Tiện ích',
              items: [element]
            }
          }
        });
      }
      //Style
      if(namechanged == 'style'){
      this.dataStyle.forEach((element,index) => {
        if(indexCheck == element.id){
        element.hasCheck = this.gf.checkExistsIndex(this.arrstylecheck,element.id)? true : false;
        objstyle ={
          changed: namechanged == 'style' ? true : false,
          code: 'style',
          propertyName: 'Phong cách',
          items: [element]
        }
        }
      });
    }
    
      //HotelType
      if(namechanged == 'hoteltype'){
        this.dataHotelType.forEach((element,index) => {
          if(indexCheck == element.id){
          element.hasCheck = this.gf.checkExistsIndex(this.arrhoteltypecheck,element.id)? true : false;
            objhoteltype ={
              changed: namechanged == 'hoteltype' ? true : false,
              code: 'hoteltype',
              propertyName: 'Loại hình',
              items: [element]
            }
          }
        });
      }
    
    var data = {};
    if(namechanged == 'starlevel'){
      data = objStar;
    }
    if(namechanged == 'trademark'){
      data = objtrademark;
    }
    if(namechanged == 'facility'){
      data = objfacility;
    }
    if(namechanged == 'style'){
      data = objstyle;
    }
    if(namechanged == 'hoteltype'){
      data = objhoteltype;
    }

  //push data to server
  var se =this;
    //if(se.memberid){
      se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'POST',
        //   url: C.urls.baseUrl.urlMobile + '/api/Dashboard/SetRecommentSetting', // + (se.memberid? ('?memberid='+ se.memberid) : '' ),
        //   body: data,
        //   json: true,
        //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        //   headers:
        //   {
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json',
        //     authorization: text
        //   }
        // };
        let urlStr = C.urls.baseUrl.urlMobile + '/api/Dashboard/SetRecommentSetting';
        let headers = {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        };
        this.gf.RequestApi('POST', urlStr, headers, {}, 'userTravelHobby', 'SetRecommentSetting').then((data)=>{
          
          })
        }
      })
   
  }
  /***
   * Hàm set style check/uncheck theo option được chọn
   * PDANH 28/01/2019
   */
  localClick(objEvent, name){
    let idx = objEvent.target.className.toLocaleString().split(' ')[1].split('-')[2];
    //idx = Number(idx)+1;
    var obj = window.document.getElementsByClassName(objEvent.target.className.toLocaleString().split(' ')[1]);
    obj[0].classList.remove('local-check');
    obj[0].classList.remove('local-uncheck');
    obj[0].classList.remove('style-check');
    obj[0].classList.remove('style-uncheck');
    obj[0].classList.remove('facility-check');
    obj[0].classList.remove('facility-uncheck');
    obj[0].classList.remove('hoteltype-check');
    obj[0].classList.remove('hoteltype-uncheck');
    obj[0].classList.remove('trademark-check');
    obj[0].classList.remove('trademark-uncheck');
    //trademark
    if(name == "trademark"){
      //this.arrtrademarkcheck.filter((item,index) => {this.arrtrademarkcheck.indexOf(item) === index});
      if(this.gf.checkExistsIndex(this.arrtrademarkcheck,idx)){
        this.gf.removeItem(this.arrtrademarkcheck,idx);
        this.gf.removeItem(this.searchhotel.arrtrademarkcheck,idx);
      }else{
        this.arrtrademarkcheck.push(idx*1);
        this.searchhotel.arrtrademarkcheck.push(idx*1);
      }
      obj[0].classList.add(this.gf.checkExistsIndex(this.arrtrademarkcheck,idx) ? 'trademark-check' : 'trademark-uncheck');
    }
    //facility
    if(name == "facility"){
     // this.arrfacilitycheck.filter((item,index) => {this.arrfacilitycheck.indexOf(item) === index});
        if(this.gf.checkExistsIndex(this.arrfacilitycheck,idx)){
          this.gf.removeItem(this.arrfacilitycheck,idx);
          this.gf.removeItem(this.searchhotel.arrfacilitycheck,idx);
        }else{
          this.arrfacilitycheck.push(idx*1);
          this.searchhotel.arrfacilitycheck.push(idx*1);
        }
        obj[0].classList.add(this.gf.checkExistsIndex(this.arrfacilitycheck,idx) ? 'facility-check' : 'facility-uncheck');
      }
      //style
      if(name == "style"){
       // this.arrstylecheck.filter((item,index) => {this.arrstylecheck.indexOf(item) === index});
        if(this.gf.checkExistsIndex(this.arrstylecheck,idx)){
          this.gf.removeItem(this.arrstylecheck,idx);
          this.gf.removeItem(this.searchhotel.arrstylecheck,idx);
        }else{
          this.arrstylecheck.push(idx*1);
          this.searchhotel.arrstylecheck.push(idx*1);
        }
        obj[0].classList.add(this.gf.checkExistsIndex(this.arrstylecheck,idx) ? 'style-check' : 'style-uncheck');
      }
      //hoteltype
      if(name == "hoteltype"){
        //this.arrhoteltypecheck.filter((item,index) => {this.arrhoteltypecheck.indexOf(item) === index});
        if(this.gf.checkExistsIndex(this.arrhoteltypecheck,idx)){
          this.gf.removeItem(this.arrhoteltypecheck,idx);
          this.gf.removeItem(this.searchhotel.arrhoteltypecheck,idx);
        }else{
          this.arrhoteltypecheck.push(idx*1);
          this.searchhotel.arrhoteltypecheck.push(idx*1);
        }
        obj[0].classList.add(this.gf.checkExistsIndex(this.arrhoteltypecheck,idx) ? 'hoteltype-check' : 'hoteltype-uncheck');
      }

      this.clickOk(name,idx);
      
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
