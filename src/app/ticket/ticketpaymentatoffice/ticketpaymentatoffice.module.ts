import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TicketPaymentAtOfficePage } from './ticketpaymentatoffice.page';

@NgModule({
  declarations: [
    TicketPaymentAtOfficePage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: TicketPaymentAtOfficePage
      }
    ])
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TicketPaymentAtOfficePageModule {}
