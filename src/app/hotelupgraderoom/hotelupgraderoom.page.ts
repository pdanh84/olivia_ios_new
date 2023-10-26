import { Component, OnInit, Input,NgZone } from '@angular/core';
import { NavController, ModalController,LoadingController } from '@ionic/angular';
import { ActivityService, GlobalFunction } from '../providers/globalfunction';
import { Storage } from '@ionic/storage';
import { ValueGlobal, Bookcombo,RoomInfo } from '../providers/book-service';
import { ActivatedRoute } from '@angular/router';
import { C } from './../providers/constants';

@Component({
  selector: 'app-hotelupgraderoom',
  templateUrl: './hotelupgraderoom.page.html',
  styleUrls: ['./hotelupgraderoom.page.scss'],
})
export class HotelupgraderoomPage implements OnInit {
  @Input('myScrollVanish') scrollArea;
  hotelRoomClasses: any = [];
  currentRoomSelect: any;
  username: any;
  email: any;
  roomPriceSale: any;
  loginuser: any;
  ListRoomClassestemp: any[];
  jsonroom: any;
  loader: any;
  indexMeal: any;
  penaltyItemSelected=-1;
  constructor(private modalCtrl: ModalController, 
    public activityService: ActivityService, 
    private storage: Storage,
    public valueGlobal: ValueGlobal,
    private navCtrl: NavController,
    public gf: GlobalFunction,
    public bookCombo: Bookcombo,public activatedRoute: ActivatedRoute,private zone: NgZone,private loadingCtrl: LoadingController
    , private Roomif: RoomInfo) { 
      this.jsonroom=this.Roomif.jsonroom
      this.ListRoomClassestemp=[];
      for (let i = 0; i < this.jsonroom.RoomClasses.length; i++) {
        const element = this.jsonroom.RoomClasses[i];
        this.ListRoomClassestemp.push(element);
      }
      for (let i = 0; i < this.jsonroom.RoomClassesRecomments.length; i++) {
        const element = this.jsonroom.RoomClassesRecomments[i];
        this.ListRoomClassestemp.push(element);
      }
      this.checkRoomFsale();
    }
    getHotelContractPrice(data) {
      var se = this;
      if (data) {
        data.IsOccWithBed = true;
        data.NoCache = true;
        //se.presentLoading();
        let headers = {'content-type' : 'application/x-www-form-urlencoded', accept: '*/*'};
          let strUrl = C.urls.baseUrl.urlContracting + '/api/contracting/HotelSearchReqContractAppV2';
          se.gf.RequestApi('POST', strUrl, headers, data, 'hotelUpgradeRoom', 'getHotelContractPrice').then((result) => {
          se.zone.run(() => {
            //se.loader.dismiss();
            if (result.Hotels) {
              se.ListRoomClassestemp = result.Hotels[0].RoomClasses;
              se.checkRoomFsale();
            }
          })
         
        })
      }
    }
    checkRoomFsale(){
      this.currentRoomSelect = this.activityService.objFlightComboUpgrade.CurrentRoom;
      this.indexMeal = this.activityService.objFlightComboUpgrade.CurrentRoomIndex;
       this.hotelRoomClasses=[];
      for (var i = 0; i < this.ListRoomClassestemp.length; i++) {
          const element = this.ListRoomClassestemp[i];
          if (element.MealTypeRates.filter((e) => { return e.IsFlashSale == true && e.Status != 'IP' }).length > 0)
          {
            this.hotelRoomClasses.push(this.ListRoomClassestemp[i]);
          }
      }
      // for (var i = 0; i <this.hotelRoomClasses.length; i++) {
      //   //lọc mealType là promotion và Internal
      // this.hotelRoomClasses[i].MealTypeRates = this.hotelRoomClasses[i].MealTypeRates.filter((Meal) => {
      //   return  Meal.IsFlashSale == true && (Meal.Supplier == 'Internal' || Meal.Supplier == 'VINPEARL' || Meal.Supplier == 'B2B'|| Meal.Supplier == 'SMD') && Meal.PromotionNote != '';
      // })
      // }
      for (let i = 0; i < this.hotelRoomClasses.length; i++) {
        for (let j = 0; j <  this.hotelRoomClasses[i].MealTypeRates.length; j++) {
          const elementmeal = this.hotelRoomClasses[i].MealTypeRates[j];
          var checkmeal=''+elementmeal.RoomId+elementmeal.Code+j;
          if (checkmeal==''+this.currentRoomSelect.RoomId+this.currentRoomSelect.Code+this.indexMeal) {
            this.hotelRoomClasses[i].MealTypeRates[j].elementmeal=true;
          }else{
            this.hotelRoomClasses[i].MealTypeRates[j].elementmeal=false;
          }
          
        }
        
      }
    
    }
    ngOnInit() {
     
    }
  
    close(){
      this.navCtrl.back();
    }
  
    upgradeRoom(itemroom, itemmealtype,index){
      var se = this;
      se.bookCombo.upgradeRoomChange.emit({itemroom: itemroom, itemmealtype: itemmealtype,index});
      this.navCtrl.back();
  
     
    }
    /*** Về trang login
     * PDANH  18/02/2018
     */
    goToLogin() {
      this.storage.get('auth_token').then(auth_token => {
        if (!auth_token) {
          //this.valueGlobal.logingoback = 'TabPage';
          this.valueGlobal.backValue = 'carcombo';
          this.navCtrl.navigateForward('/login');
        }
      });
    }
    async presentLoading() {
      this.loader = await this.loadingCtrl.create({
     });
     this.loader.present();
   }

   penaltySelected(index){

   }
  }