import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InstallmentpaymentPage } from './installmentpayment.page';

const routes: Routes = [
  {
    path: '',
    component: InstallmentpaymentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InstallmentpaymentPage]
})
export class InstallmentpaymentPageModule {}
