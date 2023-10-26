import { Component, NgZone } from '@angular/core';
import { SearchHotel, ValueGlobal } from './../providers/book-service';
import * as moment from 'moment';
import { GlobalFunction } from './../providers/globalfunction';
import { OnInit } from '@angular/core';
import { Platform,ToastController, NavController, ModalController} from '@ionic/angular';
import { Router,ActivatedRoute } from '@angular/router';

//@IonicPage()
@Component({
  selector: 'app-pickup-calendar',
  templateUrl: './pickup-calendar.html',
  styleUrls: ['pickup-calendar.scss'],
})

export class PickupCalendarPage implements OnInit {
    ngOnInit() {
    }
    dateRange: { from: string; to: string; };
    type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'

    public showCalCin = false;
    public showCalCout = false;
    public datecin:Date;
    public datecout:Date;
    public cindisplay;coutdisplay;
    public cin; cout; coutthu;cinthu;numberOfDay = 0;
    public showpopupfrommain:any;

    constructor(public platform:Platform,  public zone: NgZone,public router: Router,public navCtrl: NavController,public modalCtrl: ModalController,
      public searchhotel: SearchHotel,public value:ValueGlobal,public gf: GlobalFunction,public toastCtrl:ToastController,private activeRoute: ActivatedRoute ){
     // this.rootpage = navParams.data ? navParams.data.rootpage : '';
      this.showpopupfrommain = this.activeRoute.snapshot.paramMap.get('openfrommain') ? true: false;
        if (searchhotel.CheckInDate) {
            this.cin=searchhotel.CheckInDate;
            this.cout=searchhotel.CheckOutDate;
            //set fromdate,todate cho control ion-calendar
            this.dateRange = { from: this.cin, to: this.cout};
            this.datecin=new Date(searchhotel.CheckInDate);
            this.datecout=new Date(searchhotel.CheckOutDate);
            this.cindisplay = moment(this.datecin).format('DD-MM-YYYY');
            this.coutdisplay = moment(this.datecout).format('DD-MM-YYYY');
            this.numberOfDay = moment(this.datecout).diff(moment(this.datecin),'days');
          } else {
            this.cin = new Date();
            var rescin = this.cin.setTime(this.cin.getTime() + (7 * 24 * 60 * 60 * 1000));
            var datein = new Date(rescin);
            this.cin = moment(datein).format('YYYY-MM-DD');
            this.cindisplay = moment(datein).format('DD-MM-YYYY');
            this.datecin = new Date(rescin);

            this.cout = new Date();
            var res = this.cout.setTime(this.cout.getTime() + (8 * 24 * 60 * 60 * 1000));
            var date = new Date(res);
            this.cout = moment(date).format('YYYY-MM-DD');
            this.coutdisplay = moment(date).format('DD-MM-YYYY');
            this.datecout = new Date(res);
            //set fromdate,todate cho control ion-calendar
            this.dateRange = { from: this.cin, to: this.cout};
            this.numberOfDay = moment(this.datecout).diff(moment(this.datecin),'days');
          }
          //Xử lý nút back của dt
          this.platform.ready().then(() => {
            this.platform.backButton.subscribe(() => {
              // code that is executed when the user pressed the back button
              this.navCtrl.back();
            })
          })
          //google analytic
          gf.googleAnalytion('pickupcalendar','load','');
    }

    close(){
        if(!this.showpopupfrommain){
          this.modalCtrl.dismiss();
        }else{
          this.router.navigateByUrl('/');
        }
    }
    clickCancel() {
        this.clickOk();
    }

    clickOk(){
     var countday = moment(this.datecout).diff(moment(this.datecin),'days');
     
        if(countday >30){
          this.presentToast('Số đêm vượt quá giới hạn. Vui lòng kiểm tra lại.');
          return;
        }
        if(!this.showpopupfrommain){
          this.modalCtrl.dismiss();
        }else{
          this.searchhotel.CheckInDate = this.cin;
          this.searchhotel.CheckOutDate = this.cout;
          this.gf.setCacheSearchHotelInfo({checkInDate: this.searchhotel.CheckInDate, checkOutDate: this.searchhotel.CheckOutDate, adult: this.searchhotel.adult, child: this.searchhotel.child, childAge: this.searchhotel.arrchild, roomNumber: this.searchhotel.roomnumber});
          this.router.navigateByUrl('/');
        }
       
      }

    async presentToast(msg) {
      const toast = await this.toastCtrl.create({
        message: msg,
        duration: 2000,
        position: 'top',
      });
      toast.present();
    }

    reloadSource(objDate){
        var datefrom = new Date(objDate.from);
        var fromdate = moment(datefrom).format('YYYY-MM-DD');
        this.datecin = new Date(fromdate);
        this.cin = fromdate;
        this.cindisplay = moment(datefrom).format('DD-MM-YYYY');

        var dateto = new Date(objDate.to);
        var todate = moment(dateto).format('YYYY-MM-DD');
        this.datecout = new Date(todate);
        this.cout = todate;
        this.coutdisplay = moment(dateto).format('DD-MM-YYYY');
        this.coutthu = moment(dateto).format('dddd');
        //set fromdate,todate cho control ion-calendar
        this.dateRange = { from: this.cin, to: this.cout};
        this.searchhotel.CheckInDate = this.cin;
        this.searchhotel.CheckOutDate = this.cout;
        this.numberOfDay = moment(this.datecout).diff(moment(this.datecin),'days');
        this.gf.setCacheSearchHotelInfo({checkInDate: this.searchhotel.CheckInDate, checkOutDate: this.searchhotel.CheckOutDate, adult: this.searchhotel.adult, child: this.searchhotel.child, childAge: this.searchhotel.arrchild, roomNumber: this.searchhotel.roomnumber});
        switch (this.coutthu) {
          case "Monday":
            this.coutthu = "Thứ 2"
            break;
          case "Tuesday":
            this.coutthu = "Thứ 3"
            break;
          case "Wednesday":
            this.coutthu = "Thứ 4"
            break;
          case "Thursday":
            this.coutthu = "Thứ 5"
            break;
          case "Friday":
            this.coutthu = "Thứ 6"
            break;
          case "Saturday":
            this.coutthu = "Thứ 7"
            break;
          default:
            this.coutthu = "Chủ nhật"
            break;
        }
      //Set thứ theo ngày checkin được select
      this.cinthu = moment(datefrom).format('dddd');
      switch (this.cinthu) {
        case "Monday":
          this.cinthu = "Thứ 2"
          break;
        case "Tuesday":
          this.cinthu = "Thứ 3"
          break;
        case "Wednesday":
          this.cinthu = "Thứ 4"
          break;
        case "Thursday":
          this.cinthu = "Thứ 5"
          break;
        case "Friday":
          this.cinthu = "Thứ 6"
          break;
        case "Saturday":
          this.cinthu = "Thứ 7"
          break;
        default:
          this.cinthu = "Chủ nhật"
          break;
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

}