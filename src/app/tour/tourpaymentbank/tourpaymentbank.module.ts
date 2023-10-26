import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TourPaymentBankPage } from './tourpaymentbank.page';

const routes: Routes = [
  {
    path: '',
    component: TourPaymentBankPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TourPaymentBankPage]
})
export class TourPaymentBankPageModule {}
