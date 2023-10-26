import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TicketAdddetailsPage } from './ticketadddetails.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VoucherSlideTicketPageModule } from '../../voucher/voucherslideticket/voucherslideticket.module';

@NgModule({
  declarations: [
    TicketAdddetailsPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    VoucherSlideTicketPageModule,
    RouterModule.forChild([
      {
        path: '',
        component: TicketAdddetailsPage
      }
    ])
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TicketAdddetailsPageModule {}
