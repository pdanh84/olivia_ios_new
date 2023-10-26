import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TourPaymentDonePage } from './tourpaymentdone.page';

const routes: Routes = [
  {
    path: '',
    component: TourPaymentDonePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TourPaymentDonePage]
})
export class TourPaymentDonePageModule {}
