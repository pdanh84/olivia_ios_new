import { Component, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';
import { GlobalFunction } from '../providers/globalfunction';
import * as $ from 'jquery';
import { C } from './../providers/constants';
import { Storage } from '@ionic/storage';
import { ValueGlobal } from '../providers/book-service';
import {flightService} from './../providers/flightService';
var document:any;

@Component({
  selector: 'app-flightuseful',
  templateUrl: './flightuseful.page.html',
  styleUrls: ['./flightuseful.page.scss'],
})
export class FlightusefulPage {
    //@ViewChild('divuseful') content ion
    item: any;
    listUseful: any=[];
    itemclick: any;
    type: any;
    listIdNew = [
        {id: 6, imageLink: "https://res.ivivu.com/flight/inbound/images/home/qa2.svg",},
        {id: 12, imageLink: "https://res.ivivu.com/flight/inbound/images/home/qa8.svg",},
        {id: 5, imageLink: "https://res.ivivu.com/flight/inbound/images/home/qa1.svg",},
        {id: 8, imageLink: "https://res.ivivu.com/flight/inbound/images/home/qa4.svg",},
        {id: 13, imageLink: "https://res.ivivu.com/flight/inbound/images/home/qa9.svg",},
        {id: 15, imageLink: "https://res.ivivu.com/flight/inbound/images/home/qa11.svg",},
        {id: 16, imageLink: "https://res.ivivu.com/flight/inbound/images/home/qa12.svg",},
        {id: 14, imageLink: "https://res.ivivu.com/flight/inbound/images/home/qa10.svg",},
        {id: 9, imageLink: "https://res.ivivu.com/flight/inbound/images/home/qa5.svg",},
        {id: 17, imageLink: "https://res.ivivu.com/flight/inbound/images/home/qa13.svg",},
        {id: 20, imageLink: "https://res.ivivu.com/flight/inbound/images/home/qa15.svg",},
        {id: 10, imageLink: "https://res.ivivu.com/flight/inbound/images/home/qa6.svg",},
        //{id: 18, imageLink: "https://res.ivivu.com/flight/inbound/images/home/qa14.svg",},
        {id: 21, imageLink: "https://res.ivivu.com/flight/inbound/images/home/qa16.svg",},
        {id: 19, imageLink: "https://res.ivivu.com/images/home/qa17_Covid19.svg",},
        {id: 7, imageLink: "https://res.ivivu.com/flight/inbound/images/home/qa3.svg",},
        {id: 11, imageLink: "https://res.ivivu.com/flight/inbound/images/home/qa7.svg",},
        ];
        listNewUseful:any =[];
    listNewData: any[];
    constructor(private navCtrl: NavController, public gf: GlobalFunction,
        private zone: NgZone,
        public storage: Storage,
        public valueGlobal: ValueGlobal,
        public _flightService: flightService) { 
            this.loadDataFlightUseful();
        }

        ngOnInit(){

        }

        loadDataFlightUseful(){
            let url = C.urls.baseUrl.urlFlight + "gate/apiv1/GetUsefulHome";
            this.gf.RequestApi("GET", url, {
                "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
                'Content-Type': 'application/json; charset=utf-8'
                }, {}, "homeflight", "GetUsefulHome").then((data) =>{
                  if(data){
                   
                        this.listNewUseful  = this.listIdNew.map((item, index) => {
                            let itemfilter = data.filter((itemf) => {return item.id == itemf.id});
                            if(itemfilter && itemfilter.length >0){
                                return { id: item.id, title: itemfilter[0].title, imageLink: item.imageLink, contents: itemfilter[0].contents};
                            }
                        });
                        
                        this.listNewData = [];
                        this.listNewData.push({id: 1,name: 'slide1', data: this.listNewUseful.splice(0,3),clicked: false});
                        this.listNewData.push({id: 2,name: 'slide2', data: this.listNewUseful.splice(0,3),clicked: false});
                        this.listNewData.push({id: 3,name: 'slide3', data: this.listNewUseful.splice(0,3),clicked: false});
                        this.listNewData.push({id: 4,name: 'slide4', data: this.listNewUseful.splice(0,3),clicked: false});
                        this.listNewData.push({id: 5,name: 'slide5', data: this.listNewUseful.splice(0,3),clicked: false});
                        this.listNewData.push({id: 6,name: 'slide6', data: this.listNewUseful.splice(0,3),clicked: false});       
                  }
                })
        }

        itemClick(item){
           
            if(this.itemclick && this.itemclick.id == item.id){
                this.itemclick = item;
            }else{
                this.itemclick = item;

                this.listNewData.forEach((itemlist)=>{
                    itemlist.data.forEach(element => {
                        if(element){
                            element.clicked = false;
                        }
                        
                    });
                })
                
            }
            
            if(item.clicked){
                item.clicked = false;
                this.itemclick = '';
            }else{
                item.clicked = true;
                setTimeout(()=>{
                    this._flightService.itemUseFulClick.emit(parseInt($("#"+item.id)[0]?.offsetTop.toString())- 100);
                    
                },10)

                setTimeout(()=> {
                    (window.document.getElementById(item.id) as any).scrollIntoView({  block: 'nearest', inline: 'nearest', behavior: 'smooth' });
                },300)
            }
           
        }
        showusefuldetail(){
            this.navCtrl.navigateForward('/flightusefuldetail');
        }
}