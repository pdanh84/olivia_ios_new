import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { VoucherSlideCarComboPage } from './voucherslidecarcombo.page';

@NgModule({
  declarations: [
    VoucherSlideCarComboPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [ VoucherSlideCarComboPage ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  
})
export class VoucherSlideCarComboPageModule {}