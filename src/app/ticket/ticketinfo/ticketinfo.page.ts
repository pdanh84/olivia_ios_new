import { Component, OnInit } from '@angular/core';
import { GlobalFunction } from 'src/app/providers/globalfunction';
import { C } from '../../providers/constants';
import { ticketService } from '../../providers/ticketService';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-ticketinfo',
  templateUrl: './ticketinfo.page.html',
  styleUrls: ['./ticketinfo.page.scss'],
})
export class TicketinfoPage implements OnInit {
  includePrice: any;
  code;
  expeName: any;

  constructor(public gf: GlobalFunction, private ticketService: ticketService, private navCtrl: NavController, public activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('code');
    this.getSummary()
  }
  goback() {
    this.navCtrl.back();
  }
  getSummary() {
    this.gf.RequestApi('GET', C.urls.baseUrl.urlTicket + '/api/Booking/Summary/' + this.code, {}, {}, '', '').then((data) => {
      if (data && data.success) {
        const [pkgName, description, include, confirm, userManual, cancelPolicy] = data.data.booking.includePrice.split('|');
        const stylePkg = `<p class='pkg-name'>${pkgName}</p>`
        const styleDesc = `<p class='pkg-desc'>${description.replaceAll('\n', '').trim() ? description : '\n'}</p>`
        this.includePrice = `${stylePkg}${styleDesc}${include}${confirm}${userManual}${cancelPolicy}`
        // this.includePrice = data.data.booking.includePrice.split('|');
        // this.includePrice = this.includePrice[0]  + this.includePrice[1]  + this.includePrice[2] + this.includePrice[3]+ this.includePrice[4]+ this.includePrice[5];
        this.expeName = data.data.booking.expeName;
      }
    });
  }
}
