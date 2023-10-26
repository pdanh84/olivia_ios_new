import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { VoucherSlideTicketPage } from './voucherslideticket.page';

@NgModule({
  declarations: [
    VoucherSlideTicketPage,
  ],
  exports: [ VoucherSlideTicketPage ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
})
export class VoucherSlideTicketPageModule {}