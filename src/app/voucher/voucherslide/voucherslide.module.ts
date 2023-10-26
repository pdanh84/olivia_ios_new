import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { VoucherSlidePage } from './voucherslide.page';

@NgModule({
  declarations: [
    VoucherSlidePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [ VoucherSlidePage ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  
})
export class VoucherSlidePageModule {}