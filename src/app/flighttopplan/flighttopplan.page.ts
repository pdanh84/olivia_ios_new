import { Component, } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ValueGlobal } from '../providers/book-service';
import {flightService} from '../providers/flightService';


@Component({
  selector: 'app-flighttopplan',
  templateUrl: './flighttopplan.page.html',
  styleUrls: ['./flighttopplan.page.scss'],
})
export class FlighttopplanPage {
    listflighttopplan: any= [{linkImage: 'https://res.ivivu.com/flight/inbound/images/home/cover-1.png?'+ new Date().getTime(), link: '',title: 'Du học',subtitle: 'Đặt vé máy bay du học giá đặc biệt, không bỏ lỡ ưu đãi riêng cho du học sinh.'},
    {linkImage:'https://res.ivivu.com/flight/inbound/images/home/cover-2.png?'+ new Date().getTime(), link: '',title: 'Định cư',subtitle: 'Săn vé giá rẻ cho người đi định cư. Liên hệ với chúng tôi ngay hôm nay!'},
    {linkImage:'https://res.ivivu.com/flight/inbound/images/home/cover-3.png?'+ new Date().getTime(), link: '',title: 'Làm việc',subtitle: 'Giá vé đặc biệt cho cô dâu định cư và người đi xuất khẩu lao động.'},
    {linkImage:'https://res.ivivu.com/flight/inbound/images/home/cover-4.png?'+ new Date().getTime(), link: '',title: 'Săn vé',subtitle: 'Vé máy bay giá rẻ du lịch và thăm thân Mỹ, Canada. Chat để tư vấn miễn phí.'},
    ];

    constructor(
        public storage: Storage,
        public valueGlobal: ValueGlobal,
        public _flightService: flightService) { 
        }
    
        ngOnInit(){
            
        }
}