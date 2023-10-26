import { Component, OnInit, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SearchHotel } from '../providers/book-service';
import { GlobalFunction } from '../providers/globalfunction';
@Component({
  selector: 'app-roomimagedetail',
  templateUrl: './roomimagedetail.page.html',
  styleUrls: ['./roomimagedetail.page.scss'],
})
export class RoomimagedetailPage implements OnInit {
  listsk= [1,2,3,4,5];
  listImages: any = [];
  listImagesTemp: any = [];
  loaddatadone: boolean = false;
  hotelName: any;
  fromhotel: boolean = true;
  stt; 
  defaultImage = "./assets/imgs/demopic.svg";
  totalItem=10;
  indexItem=5;
  nameRoom="";
  roomdetail: any;
  constructor(private navCtrl: NavController,
    public searchhotel: SearchHotel,
    public gf: GlobalFunction,
    public zone: NgZone) { 
      setTimeout(()=>{
        this.loaddatadone = true;
      },600)
      this.roomdetail = this.gf.getParams('hotelroomdetail').objroom;
      this.nameRoom=this.roomdetail.ClassName;
      this.listImages=this.roomdetail.Rooms[0].RoomInfomations.RoomImageList;
  }

  ngOnInit() {
  }

  goback(){
    this.navCtrl.back();
  }
}

