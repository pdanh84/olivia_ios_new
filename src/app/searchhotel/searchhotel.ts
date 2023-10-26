import { audit } from 'rxjs/operators';
import { json } from 'body-parser';
import { Component, NgZone, ViewChild, OnInit, Input } from '@angular/core';
import { NavController, Platform} from '@ionic/angular';

import { AuthService } from '../providers/auth-service';
import * as moment from 'moment';
import { SearchHotel, ValueGlobal } from '../providers/book-service';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { NetworkProvider } from './../network-provider.service';
import { Storage } from '@ionic/storage';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
var document:any;
/**
 * Generated class for the SearchhotelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-searchhotel',
  templateUrl: 'searchhotel.html',
  styleUrls: ['searchhotel.scss'],
})
export class SearchHotelPage implements OnInit{
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
   
    if(this.id==1){
      this.inputText = this.activatedRoute.snapshot.paramMap.get('text');
      this.getItem(this.inputText)
    }
  }
  @ViewChild('myInput') myInput ;
  json; input; child1 = 0; child = 0;
  fieldName1: any;
  adults1 = 2; adults = 2;
  arrchild1:any = [];
  arrchild:any = [];
  showpopup = false;
  ischeckadults = true;
  ischeckchild = false;
  ischeckroom = false;
  public room1 = 1; public room = 1; gbitem; gbmsg;
  items:any = []; ischecklist = false; isenabled = true;
  co = 0; recent; index
  setInter;ischecktext=false;
  public isConnected:boolean;
  inputText:any="";arrHistory:any=[];objHotelInfo;id;
  showInLandTitle: boolean = true;
  showOutBoundTitle: boolean = true;
  constructor(public platform: Platform,public navCtrl: NavController, public authService: AuthService, public zone: NgZone, public searchHotel: SearchHotel,
    public gf: GlobalFunction,
    public networkProvider: NetworkProvider,
    public storage: Storage,
    public keyboard: Keyboard,
    public router: Router,
    public valueGlobal: ValueGlobal, public activatedRoute: ActivatedRoute) {
    this.recent = this.searchHotel.recent;
    
    //clear local
    this.searchHotel.local0check = false;
    this.searchHotel.local1check = false;
    this.searchHotel.local2check = false;
    this.searchHotel.local3check = false;
    this.searchHotel.local4check = false;
    this.searchHotel.local5check = false;
    this.searchHotel.local6check = false;
    this.searchHotel.local7check = false;
    this.searchHotel.local8check = false;
    this.searchHotel.local9check = false;
    this.searchHotel.local10check = false;
    this.searchHotel.local11check = false;
    this.searchHotel.local12check = false;
    this.searchHotel.local13check = false;
    this.searchHotel.local14check = false;
    this.searchHotel.local15check = false;
    this.searchHotel.local16check = false;
    this.searchHotel.local17check = false;
    this.searchHotel.local18check = false;
    this.searchHotel.local19check = false;
    this.searchHotel.location = "";
    //google analytic
    this.gf.googleAnalytion('search-hotel','load','');
    //Kiểm tra mạng trước khi loaddata
    //this.networkProvider.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = this.networkProvider.isOnline();
      if (this.isConnected) {
        setTimeout(()=>{
          this.storage.get('listregion').then((data:any)=>{
            if(data){
              this.json = data;
            }else{
              this.getdata();
            }
          })
        
        },100)
      }else{
        this.gf.showWarning('Không có kết nối mạng','Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng','Đóng');
      }
    //});
  }

  change() {
    // this.ischeck = true;
    this.showpopup = false;
    this.recent = this.searchHotel.recent;
  }

  ionViewWillEnter(){
    this.showpopup = false;
    this.recent = this.searchHotel.recent;
  }
  getdata() {
    var se = this;
    
    let  headers =
    {
      apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
      apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
    };
    let strUrl = C.urls.baseUrl.urlMobile+ '/mobile/OliviaApis/Regions';
    se.gf.RequestApi('GET', strUrl, headers, {}, 'searchhotel', 'getdata').then((data) => {
      se.json = data;
      se.storage.set('listregion',se.json);
      //se.test();

    });
  }
  test()
  {
    this.setInter = setInterval(function () {
      (window.document.getElementById("mytext") as any).focus();
    },1500)

  }
  nextPopular(msg, i) {
    // this.gbmsg = msg;
    this.index = i;
    this.searchHotel.gbmsg = msg;
    this.searchHotel.input = msg.regionName;
    this.searchHotel.flag = 1;
    this.co = 1;
    this.searchHotel.recent = this.recent;
   
      this.searchHotel.itemSearchHotelHome.emit(1);
          this.router.navigateByUrl('/app/tabs/tab1');
  
  }
  nextRecent(msg) {
    this.searchHotel.gbmsg = msg;
    // this.gbmsg = msg;
    if (msg.regionName) {
      this.searchHotel.input = msg.regionName;
    } else {
      this.searchHotel.input = msg.hotelName;
    }
    this.searchHotel.flag = 2;
    this.co = 2;
    this.searchHotel.itemSearchHotelHome.emit(1);
    this.router.navigateByUrl('/app/tabs/tab1');
  }
  itemclick(msg) {
    this.searchHotel.gbitem = msg;
   
    if (msg.regionName) {
      this.searchHotel.input = msg.regionName;
      // var obj = this.arrHistory.filter((item) =>  item.id == msg.RegionId);

      //this.arrHistory.push(item);
    // }
    } else {
      this.searchHotel.input = msg.hotelName;
      // var obj = this.arrHistory.filter((item) =>  item.id == msg.HotelId);
      
    }
    this.searchHotel.flag = 0;
    this.co = 0;
    this.searchHotel.itemSearchHotelHome.emit(1);
    this.router.navigateByUrl('/app/tabs/tab1');
    // }
    // var objtext = this.arrHistory.filter((item) =>  item.name == this.inputText.trim());
    // if(objtext.length==0){
      
        
        
    
   
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    var se = this;
    if(ev.detail.value){
      const val = ev.detail.value;
      let  headers =
      {
        
      };
      let strUrl = C.urls.baseUrl.urlGate+'/search/searchhotel?keyword=' + val;
      se.gf.RequestApi('GET', strUrl, headers, { }, 'searchhotel', 'getdata').then((data) => {
        se.zone.run(() => {
          let lstitems=data;
          
          if(lstitems.length && lstitems.length >0){
            se.ischecktext=false;
            se.ischecklist = true;
              if(se.items.length ==0){
                lstitems.forEach(element => {
                  element.show = true;
                  se.items.push(element);
                })
                
              }else{
                
                se.items=[];
                   lstitems.forEach(element => {
                    se.items.push(element);
                })
              }
              se.showInLandTitle = se.items.some(item => item.inLand);
              se.showOutBoundTitle = se.items.some(item => !item.inLand);
          }else{
            se.items=[];
            se.ischecktext=true;
            se.ischecklist = true;
            se.showInLandTitle = false;
            se.showOutBoundTitle =false;
          }
        });
      })
    }
    else {
      se.ischecklist = false;
      se.ischecktext=false;
      se.items=[];
    }
  }
  search() {
    var se = this;
    this.searchHotel.backPage = "";
    var cocheck = 0;
    if (this.co == 1) {
      this.authService.region = this.gbmsg.regionName;
      this.authService.regionid = this.gbmsg.regionId;
      this.authService.regioncode = this.gbmsg.regionCode;
      
      if (this.recent) {
        
        for (let i = 0; i < this.recent.length; i++) {
          if (this.recent[i].RegionId == this.gbmsg.regionId) {
            cocheck = 1;
            break;
          }
        }
        if (cocheck == 0) {
          var item1 = { Type: "2", HotelId: "", HotelName: "", RegionId: this.gbmsg.regionId, RegionCode: this.gbmsg.regionCode, regionName: this.gbmsg.regionName, flag: "1", TotalHotels: this.gbmsg.totalHotel };
          se.searchHotel.recent = [];

          if (this.recent.length > 1) {
            se.searchHotel.recent.push(this.recent[1]);
          } else {
            se.searchHotel.recent.push(this.recent[0]);
          }
          se.searchHotel.recent.push(item1);
          se.searchHotel.flag = 0;
        }

      }
      else {
        var item1 = { Type: "2", HotelId: "", HotelName: "", RegionId: this.gbmsg.regionId, RegionCode: this.gbmsg.regionCode, regionName: this.gbmsg.regionName, flag: "1", TotalHotels: this.gbmsg.totalHotel };
        se.searchHotel.recent = [];
        se.searchHotel.recent.push(item1);
      }
      this.navCtrl.navigateForward('hotellist/false');
      //this.navCtrl.navigateForward(['/app/tabs/hotellist/false']);
    }
    else if (this.co == 0) {
      if (this.gbitem.Type == 1) {
        var id1 = { root: "mainpage" };
        if (this.recent) {
          for (let i = 0; i < this.recent.length; i++) {
            if (this.recent[i].HotelId == id1) {
              cocheck = 1;
              break;
            }
          }
          if (cocheck == 0) {
            var item2 = { Type: "1", HotelId: this.gbitem.HotelId, HotelName: this.gbitem.hotelName, RegionId: "", RegionCode: "", regionName: "", flag: "0", TotalHotels: '' };
            se.searchHotel.recent = [];

            if (this.recent.length > 1) {
              se.searchHotel.recent.push(this.recent[1]);
            } else {
              se.searchHotel.recent.push(this.recent[0]);
            }
            se.searchHotel.recent.push(item2);
            se.searchHotel.flag = 0;
          }
        }
        else {
          var item2 = { Type: "1", HotelId: this.gbitem.HotelId, HotelName: this.gbitem.hotelName, RegionId: "", RegionCode: "", regionName: "", flag: "0", TotalHotels: '' };
          se.searchHotel.recent = [];

          this.searchHotel.recent.push(item2);
        }
        this.searchHotel.hotelID = this.gbitem.HotelId;
        this.searchHotel.rootPage = "mainpage";
        this.valueGlobal.notRefreshDetail = false;
        //this.navCtrl.navigateForward('/hoteldetail/'+this.searchHotel.hotelID);
        this.navCtrl.navigateForward('/hoteldetail/'+this.searchHotel.hotelID);
      } else {
        if (this.recent) {
          for (let i = 0; i < this.recent.length; i++) {
            if (this.recent[this.index].regionId == this.gbitem.regionId) {
              cocheck = 1;
              break;
            }
          }
          if (cocheck == 0) {
            var item3 = { Type: "2", HotelId: "", HotelName: "", RegionId: this.gbitem.regionId, RegionCode: this.gbitem.regionCode, regionName: this.gbitem.regionName, flag: "0", TotalHotels: this.gbitem.totalHotels };
            se.searchHotel.recent = [];

            if (this.recent.length > 1) {
              se.searchHotel.recent.push(this.recent[1]);
            } else {
              se.searchHotel.recent.push(this.recent[0]);
            }
            this.searchHotel.recent.push(item3);
            se.searchHotel.flag = 0;
          }

        }
        else {
          var item3 = { Type: "2", HotelId: "", HotelName: "", RegionId: this.gbitem.regionId, RegionCode: this.gbitem.regionCode, regionName: this.gbitem.regionName, flag: "0", TotalHotels: this.gbitem.totalHotels };
          se.searchHotel.recent = [];


          this.searchHotel.recent.push(item3)
        }

        this.authService.region = this.gbitem.regionName;
        this.authService.regionid = this.gbitem.regionId;
        this.authService.regioncode = this.gbitem.regionCode;
        this.navCtrl.navigateForward('/hotellist/false/0');
        //this.navCtrl.navigateForward(['/app/tabs/hotellist/false']);
      }
    }
    else if (this.co == 2) {
      if (this.gbmsg.Type == 1) {
        this.searchHotel.hotelID = this.gbitem.HotelId;
        this.searchHotel.rootPage = "mainpage";
        this.valueGlobal.notRefreshDetail = false;
        //this.navCtrl.navigateForward('/hoteldetail/'+this.searchHotel.hotelID);
        this.navCtrl.navigateForward('/hoteldetail/'+this.searchHotel.hotelID);
      } else {
        this.authService.region = this.gbmsg.regionName;
        this.authService.regionid = this.gbmsg.regionId;
        this.authService.regioncode = this.gbmsg.regionCode;
        this.navCtrl.navigateForward('/hotellist/false/0');
        //this.navCtrl.navigateForward(['/app/tabs/hotellist/false']);
      }
    }
  }
  ionViewDidLoad() {
    let elements = window.document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'none';
      });
    }
  }

  goback() {
    this.navCtrl.back();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.myInput.setFocus();
    }, 150);
  }
  clearText(){
    this.inputText="";
    this.ischecklist = false;
  }
  getItem(input){
    var se = this
    const val =input;
    // var options = {
    //   method: 'GET',
    //   url: 'https://www.ivivu.com/GListSuggestion',
    //   timeout: 10000, maxAttempts: 5, retryDelay: 2000,
    //   qs: { key: val },
    //   headers:
    //   {
    //   }
    // };

    let  headers =
    {
    };
    let strUrl = C.urls.baseUrl.urlGate+'/search/searchhotel?key=' + val;
    se.gf.RequestApi('GET', strUrl, headers, { }, 'searchhotel', 'getdata').then((data) => {
      se.zone.run(() => {
        let lstitems = data;
        
        if(lstitems.length && lstitems.length >0){
          se.ischecktext=false;
          se.ischecklist = true;
            if(se.items.length ==0){
              lstitems.forEach(element => {
                element.show = true;
                se.items.push(element);
              })
              
            }else{
              se.items=[];
                 lstitems.forEach(element => {
                  se.items.push(element);
              })
            }
          
        }else{
          se.items=[];
          se.ischecktext=true;
          se.ischecklist = true;
        }
      });
    })
  }
}
