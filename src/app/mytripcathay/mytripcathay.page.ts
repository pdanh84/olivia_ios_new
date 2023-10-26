import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ActivityService, GlobalFunction } from '../providers/globalfunction';
import { NavController,LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-mytripcathay',
  templateUrl: './mytripcathay.page.html',
  styleUrls: ['./mytripcathay.page.scss'],
})
export class MytripcathayPage implements OnInit {
  booking_id:any = ""; customerName = "";
  noLoginObj: any;
  insurance_: any;
  trip: any;
  childList:any=[];
  childListCathay:any=[];
  loader: any;
  constructor(public gf: GlobalFunction, public activatedRoute: ActivatedRoute,public loadingCtrl: LoadingController,
     public activityService: ActivityService, private navCtrl: NavController,private router: Router) {


  }

  ngOnInit() {
    this.booking_id = this.activatedRoute.snapshot.paramMap.get('bookingid');
    this.customerName = this.activityService.objCathayMytrip.name;
    this.trip=this.activityService.objCathayMytrip.trip;
    this.getCathay();
  }
  goback() {
    this.navCtrl.back();
  }
  getCathay() {
    this.presentLoading();
    this.gf.getCathayByKey(this.booking_id).then((data) => {
      this.loader.dismiss();
      var json = data;
      if (json.result) {
        this.noLoginObj = json;

        if (
          this.noLoginObj &&
          this.noLoginObj.insurObj &&
          this.noLoginObj.insurObj.adultList.length > 0
        ) {
          this.noLoginObj.insurObj.adultList =
            this.noLoginObj.insurObj.adultList.filter((x) =>
              x.customer_name.toLowerCase().trim().includes(this.customerName.toLowerCase())
            );
            var childList= this.noLoginObj.insurObj.childList;
            if(childList.length>0){
              childList.forEach(element => { 
                
                  element.birth=element.customer_dob;
                  element.id=element.insurance_code;
                  element.name=element.customer_name;
                  this.childList.push(element);
              });
            
            }
          // console.log(this.noLoginObj.insurObj.adultList);
        }

      }
    })
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }
  checkClaimTime(flightObj) {
    if (!flightObj || !flightObj.departureDate || !flightObj.departureTime)
       return false;
    if (flightObj.departureDate.indexOf("/")) {
      flightObj.departureDate = flightObj.departureDate.replace(/\//g, "-");
    }
   
    let now: any = new Date();
    let flightDT: any = this.parseDatetime(
      flightObj.departureDate,
      flightObj.departureTime
    );
    let hours = (now - flightDT) / 36e5;
    return hours >= -24 && hours <= 720 ? true : false;
  }
  parseDatetime(date: string, time: string) {
    let dateObj = date.split("-");
    let dtStr = dateObj[1] + "/" + dateObj[0] + "/" + dateObj[2] + " " + time;
    return new Date(dtStr);
  }

  isClaim(flights, flightNumner) {
    // if(1===1)
    //   return false;
    if (!flights) return false;
    else {
      // check đã claim tất cả chuyến bay
      //if(!flightObj)
      //  return true;
      // let allFlight = flightObj.filter(x => x.flightNumner);
      // let flightClaimed = allFlight.filter(x => flights.includes(x.flightNumner.replace(' ', '')));
      // if(flightClaimed.length === allFlight.length)
      //   return true;
      // else
      //   return false;

      if ( flightNumner && flights.includes(flightNumner.replace(' ', ''))) return true;
      else return false;
    }
  }
  replaceDate(dateStr: string) {
    if (dateStr) return dateStr.replace(/-/g, "/");
    else return "";
  }
  
  claimCathay(insurId,flightNumner,item,isCancel) {
    //  Lay insurance
    this.childListCathay=[];
     if (insurId.includes("|")) {
      if (flightNumner && flightNumner != "") {
        let insSeparate = insurId.split(",");

        this.insurance_ = insSeparate.find((x) => x.includes(flightNumner));
        
        // if (insSeparate.length == 2) {
          
        //   // if (this.insurance_ && this.insurance_ != "") {
        //   //   this.insurance_ = this.insurance_.split("|")[0];
        //   // }
        // } else {
        //   if (insurId && insurId != "") {
        //     // this.insurance_ = insurId.split("|")[0];
        //     this.insurance_ = insurId;
        //   }
        // }
      }
    }
    let chuoi=this.insurance_.split("|");
    this.insurance_=chuoi[0];
    item.insurance_code= this.insurance_;
    item.customer_id=item.customer_cmnd;
    if(this.childList.length>0){
  
        this.childList.forEach(element => {
          if(!this.isClaim(element.claimedFlights, flightNumner)){
            if(element.insurance_code.indexOf(",")){
              let insSeparate = element.insurance_code.split(",");
              let id = insSeparate.find((x) => x.includes(flightNumner));
              let chuoi=id.split("|");
              element.id=chuoi[0];
            }
            else{
              let id = element.insurance_code.find((x) => x.includes(flightNumner));
              let chuoi=id.split("|");
              element.id=chuoi[0];
            }
            this.childListCathay.push(element);
          }
          
       
        });
    }
   
    console.log(this.insurance_);
    this.gf.setParams({ childlist: this.childListCathay, item: item, trip: this.trip, type: isCancel, flightNumber: flightNumner, ischild: false }, 'insurrenceDetail');
    this.router.navigateByUrl("/insurrancedetail");
  }
  
}
