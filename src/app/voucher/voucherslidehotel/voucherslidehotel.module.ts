import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { VoucherSlideHotelPage } from './voucherslidehotel.page';

@NgModule({
  declarations: [
    VoucherSlideHotelPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [ VoucherSlideHotelPage ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  
})
export class VoucherSlideHotelPageModule {}