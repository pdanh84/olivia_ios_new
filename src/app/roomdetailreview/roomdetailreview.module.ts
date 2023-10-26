import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RoomdetailreviewPage } from './roomdetailreview';
import { VoucherSlideHotelPageModule } from '../voucher/voucherslidehotel/voucherslidehotel.module';

@NgModule({
  declarations: [
    RoomdetailreviewPage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    VoucherSlideHotelPageModule,
    RouterModule.forChild([
      {
        path: '',
        component: RoomdetailreviewPage
      }
    ])
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class RoomdetailreviewPageModule {}
