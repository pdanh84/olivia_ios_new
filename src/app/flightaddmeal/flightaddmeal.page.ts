import { Component,OnInit, NgZone, ViewChild } from '@angular/core';
import { NavController,Platform, ModalController, ActionSheetController, PickerController } from '@ionic/angular';
import { SearchHotel } from '../providers/book-service';
import { GlobalFunction } from '../providers/globalfunction';
import { ValueGlobal } from '../providers/book-service';
import { flightService } from '../providers/flightService';
/**
 * Generated class for the OccupancyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-flightaddmeal',
  templateUrl: 'flightaddmeal.page.html',
  styleUrls: ['flightaddmeal.page.scss'],
})
export class FlightaddmealPage implements OnInit {
tabmeal = 1;
slideOpts = {
    loop: false,
    slidesPerView: 1,
    centeredSlides: false,
    spaceBetween: 10,
    zoom: {
      toggle: false
    }
  };
listMeal = [
    {id: 1, name: 'Cơm cá sốt cà ri', description: "Filê cá basa lăn bột và chiên. Vị thơm của nước sốt cà ri quyện với thịt cá sẽ khiến bạn không thể quên",imagePath: "https://cdn1.ivivu.com/images/2020/05/08/16/thanhbac3____horizontal.png", quantity: 0},
    {id: 2, name: 'Cơm chiên kim chi', description: "Filê cá basa lăn bột và chiên. Vị thơm của nước sốt cà ri quyện với thịt cá sẽ khiến bạn không thể quên",imagePath: "https://cdn1.ivivu.com/images/2020/05/08/16/thanhbac3____horizontal.png", quantity: 0},
    {id: 3, name: 'Hủ tiếu xào kiểu thái', description: "Filê cá basa lăn bột và chiên. Vị thơm của nước sốt cà ri quyện với thịt cá sẽ khiến bạn không thể quên",imagePath: "https://cdn1.ivivu.com/images/2020/05/08/16/thanhbac3____horizontal.png", quantity: 0},
    {id: 4, name: 'Miến xào thập cẩm', description: "Filê cá basa lăn bột và chiên. Vị thơm của nước sốt cà ri quyện với thịt cá sẽ khiến bạn không thể quên",imagePath: "https://cdn1.ivivu.com/images/2020/05/08/16/thanhbac3____horizontal.png", quantity: 0},
]
constructor(public platform: Platform,public navCtrl: NavController, public modalCtrl: ModalController,public valueGlobal:ValueGlobal,
    public searchhotel: SearchHotel, public gf: GlobalFunction,
    public actionsheetCtrl: ActionSheetController,
    public pickerController: PickerController,
    private zone: NgZone,
    public _flightService: flightService) {
   
  }

  ngOnInit() {
   
  }

  goback(){
    this.navCtrl.navigateBack('/flightaddservice');
  }

  slidetabchange(){
    // this.sliderTab.getActiveIndex().then(index => {
    //   this.tabmeal = index+1;
    // });
  }

  SelectTab(tabindex){
    this.tabmeal = tabindex;
    //this.sliderTab.slideTo(tabindex-1);
  }

  slideDoubleClick(){

  }

  minusQuantity(item){
    this.zone.run(()=>{
        if(item.quantity >=1){
            item.quantity--;
        }
    })
  }

  plusQuantity(item){
    this.zone.run(()=>{
        item.quantity++;
    })
  }
}
