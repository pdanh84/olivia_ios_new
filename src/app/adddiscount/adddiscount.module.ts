import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdddiscountPage } from './adddiscount.page';
import { VoucherSlidePageModule } from '../voucher/voucherslide/voucherslide.module';
import { VoucherSlideCarComboPageModule } from '../voucher/voucherslidecarcombo/voucherslidecarcombo.module';
import { VoucherSlideHotelPageModule } from '../voucher/voucherslidehotel/voucherslidehotel.module';
import { VoucherSlideFlightComboPageModule } from '../voucher/voucherslideflightcombo/voucherslideflightcombo.module';

import { VoucherSlideTourPageModule } from '../voucher/voucherslidetour/voucherslidetour.module';
import { VoucherSlideTicketPageModule } from '../voucher/voucherslideticket/voucherslideticket.module';
import { VoucherSlideInternationalPageModule } from '../voucher/voucherslideinternational/voucherslideinternational.module';
const routes: Routes = [
  {
    path: '',
    component: AdddiscountPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoucherSlidePageModule,
    VoucherSlideHotelPageModule,
    VoucherSlideCarComboPageModule,
    VoucherSlideFlightComboPageModule,
    VoucherSlideTourPageModule,
    VoucherSlideTicketPageModule,
    VoucherSlideInternationalPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdddiscountPage]
})
export class AdddiscountPageModule {}
