import { Component, OnInit } from '@angular/core';
import { GlobalFunction } from '../providers/globalfunction';
import { ModalController, NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { MytripService } from '../providers/mytrip-service.service';
import { flightService } from '../providers/flightService';
import { ValueGlobal } from '../providers/book-service';

@Component({
  selector: 'app-insurrancedone',
  templateUrl: './insurrancedone.page.html',
  styleUrls: ['./insurrancedone.page.scss'],
})
export class InsurrancedonePage implements OnInit {
  paramReturn: any;

  constructor(public gf: GlobalFunction, public modalCtrl: ModalController,
    public router: Router,
    public _mytripservice: MytripService,
    public _flightService: flightService,
    public valueGlobal: ValueGlobal,
    private navCtrl: NavController) { 
    this.paramReturn = this.gf.getParams('insurranceClaimed');
  }

  ngOnInit() {
  }
  next()
  {
    //this.modalCtrl.dismiss(this.paramReturn);

    let navigationExtras: NavigationExtras = {
      state: {
        param: this.paramReturn
      }
    };
    //this.router.navigate(['details'], navigationExtras);
    if(this._mytripservice.rootPage == "homeflight"){
      if( this.valueGlobal.backpageCathay=='mytripdetail'){
        this.navCtrl.navigateForward('mytripdetail', { animated: true });
      }else{
        this._flightService.itemTabFlightActive.emit(true);
        this.valueGlobal.backValue = "homeflight";
        this._mytripservice.orderPageState.emit(1);
        this._flightService.bookingSuccess = true;
        setTimeout(()=>{
          this._flightService.itemMenuFlightClick.emit(2);
        },200)
        this.navCtrl.navigateBack('/tabs/tab1');
        this._mytripservice.backfrompage = "";
       
      }
    
    
    }else{
      if( this.valueGlobal.backpageCathay=='mytripdetail'){
        this.navCtrl.navigateForward('mytripdetail', { animated: true });
      }else{
        this.router.navigateByUrl("/app/tabs/tab3?refresh=true", navigationExtras);
      }
      
    }
    
  }

}
