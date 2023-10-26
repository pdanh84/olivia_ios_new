import { SearchHotel } from './../../providers/book-service';
import { Component, NgZone,OnInit } from '@angular/core';
import { NavController, Platform, ModalController } from '@ionic/angular';
import { AuthService } from '../../providers/auth-service';
import { HttpClientModule } from '@angular/common/http';
import { GlobalFunction } from './../../providers/globalfunction';
import { tourService } from 'src/app/providers/tourService';
/**
 * Generated class for the SearchHotelFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-tourlistfilter',
  templateUrl: 'tourlistfilter.page.html',
  styleUrls: ['tourlistfilter.page.scss'],
})
export class TourListFilterPage implements OnInit{
  public dataFilter; 
  dataForeignRegion:any = [
    {id: 1, name: 'Thái Lan', code: 'thai-lan'}, {id: 2, name: 'Singapore', code: 'singapore'}, {id: 3, name: 'Hàn Quốc', code: 'han-quoc'}, {id: 4, name: 'Châu Âu', code: 'chau-au'}, {id: 5, name: 'Thụy Sỹ', code: 'thuy-sy'}, 
    {id: 6, name: 'Dubai', code: 'dubai'}, {id: 7, name: 'Maldives', code: 'maldives'}, {id: 8, name: 'Campuchia', code: 'campuchia'}, {id: 9, name: 'Indonesia', code: 'indonesia'}, 
  ];
  dataLocalRegion:any=[
    {id: 1, name: 'Phú Quốc', code: 'phu-quoc'}, {id: 2, name: 'Đà Nẵng', code: 'da-nang'}, {id: 3, name: 'Hạ Long', code: 'ha-long'}, {id: 4, name: 'Sapa', code: 'sapa'}, {id: 5, name: 'Hà Nội', code: 'ha-noi'}, 
    {id: 6, name: 'Quy Nhơn', code: 'quy-nhon'}, {id: 7, name: 'Phú Yên', code: 'phu-yen'}, {id: 8, name: 'Nha Trang', code: 'nha-trang'}, {id: 9, name: 'Miền Tây', code: 'mien-tay'}, {id: 9, name: 'Buôn Mê Thuột', code: 'buon-me-thuot'},
  ];
  dataTourTitle:any=[
    {id: 1, name: 'Tour nội địa cao cấp', code: 'tour-noi-dia-cao-cap'}, {id: 2, name: 'Tour nghỉ dưỡng', code: 'tour-nghi-duong'}, {id: 3, name: 'Tour nước ngoài cao cấp', code: 'tour-nuoc-ngoai-cao-cap'}, {id: 4, name: 'Tour truyền thống', code: 'tour-truyen-thong'}, 
    {id: 5, name: 'Tailor Tour iVIVU', code: 'tailor-tour-ivivu'}, 
    {id: 6, name: 'Du lịch hè', code: 'du-lich-he'},
  ];
  dataTourType:any=[
    {id: 1, name: 'Trọn gói'}, {id: 2, name: 'Tour Land'}, {id: 3, name: 'Free & Easy'}, {id: 4, name: 'Daily Tours'}, {id: 5, name: 'Dịch vụ tư vấn du lịch'}, 
    {id: 6, name: 'Vivu Journeys'},
  ];
  strLocal="";
  strFacility="";
  strStyle="";
  strHotelType="";
  regioncode: any;
  hasfilter: boolean;
  itemOrder: string;
  ischeckbtnreset = true;
  ischeckbtn=true;
  constructor(public platform: Platform,public navCtrl: NavController, public zone: NgZone, public searchhotel: SearchHotel, public authService: AuthService, private http: HttpClientModule,
    public gf: GlobalFunction,public modalCtrl: ModalController,
    public tourService: tourService) {
    if(searchhotel.chuoi){
      this.hasfilter = true;
    }
    if(searchhotel.sortOrder){
      this.itemOrder = searchhotel.sortOrder;
    }
    

    //google analytic
    gf.googleAnalytion('tourlistfilter','load','');

    this.platform.ready().then(() => {
      window.document.addEventListener("backbutton", async() => { 
        this.navCtrl.navigateBack('/tourlist');
      })
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
  

  /***
   * Hàm reset style mục chọn
   * PDANH 28/01/2019
   */
  clickCancel() {
     
  }
  clickOk() {
    this.modalCtrl.dismiss();
  }

  
  /***
   * Hàm set style check/uncheck theo option được chọn
   * PDANH 28/01/2019
   */
  localClick(item, name){
    this.tourService.foreignList = [];
    this.tourService.localList = [];
    this.tourService.typeList = [];
    this.tourService.topicList = [];
    if(name == 'foreign'){
      this.tourService.foreignList.push(item.id);
      this.tourService.publicFilterTour(item);
      
    }
    if(name == 'local'){
      this.tourService.localList.push(item.id);
      this.tourService.publicFilterTour(item);
    }
    if(name == 'type'){
      this.tourService.typeList.push(item.id);
    }
    if(name == 'topic'){
      this.tourService.topicList.push(item.Id);
      this.tourService.publicFilterTour(item);
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
