import { Component } from '@angular/core';
import { GlobalFunction, ActivityService } from '../providers/globalfunction';

@Component({
  selector: 'app-insurrancebankselect',
  templateUrl: './insurrancebankselect.page.html',
  styleUrls: ['./insurrancebankselect.page.scss'],
})
export class InsurranceBankSelectPage{
  bankselect: any;

  constructor(public gf: GlobalFunction, public activityService: ActivityService) { }

  selectBank(ev){
    this.activityService.bank = {};
    if(ev){
      this.activityService.bank.id = ev.detail.value.split('|')[0];
      this.activityService.bank.name = ev.detail.value.split('|')[1];
      this.activityService.bank.bankSelected = ev.detail.value.split('|')[0];
      this.activityService.currentArticle.emit(ev);
    }
    
  }

}
