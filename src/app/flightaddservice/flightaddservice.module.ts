import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightaddservicePage } from './flightaddservice.page';
import { HotelCityItemPageModule } from '../hotelcityitem/hotelcityitem.module';
import { VoucherSlidePageModule } from '../voucher/voucherslide/voucherslide.module';

const routes: Routes = [
  {
    path: '',
    component: FlightaddservicePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HotelCityItemPageModule,
    VoucherSlidePageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightaddservicePage]
})
export class FlightaddservicePageModule {}