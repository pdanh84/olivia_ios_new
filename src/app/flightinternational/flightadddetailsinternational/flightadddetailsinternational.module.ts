import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FlightAdddetailsInternationalPage } from './flightadddetailsinternational.page';
import { VoucherSlideInternationalPageModule } from '../../voucher/voucherslideinternational/voucherslideinternational.module';

@NgModule({
  declarations: [
    FlightAdddetailsInternationalPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoucherSlideInternationalPageModule,
    RouterModule.forChild( [{
      path: '',
      component: FlightAdddetailsInternationalPage
    }]),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FlightAdddetailsInternationalPageModule {}
