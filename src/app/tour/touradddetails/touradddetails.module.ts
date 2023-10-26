import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TourAddDetailsPage } from './touradddetails.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VoucherSlideTourPageModule } from '../../voucher/voucherslidetour/voucherslidetour.module';

@NgModule({
  declarations: [
    TourAddDetailsPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    VoucherSlideTourPageModule,
    RouterModule.forChild([
      {
        path: '',
        component: TourAddDetailsPage
      }
    ])
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TourAddDetailsPageModule {}
