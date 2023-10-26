import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CombocarnewPage } from './combocarnew.page';
import { VoucherSlideCarComboPageModule } from '../voucher/voucherslidecarcombo/voucherslidecarcombo.module';

const routes: Routes = [
  {
    path: '',
    component: CombocarnewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoucherSlideCarComboPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CombocarnewPage]
})
export class CombocarnewPageModule {}
