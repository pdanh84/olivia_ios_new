import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InstallmentpaymentdonePage } from './installmentpaymentdone.page';

const routes: Routes = [
  {
    path: '',
    component: InstallmentpaymentdonePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InstallmentpaymentdonePage]
})
export class InstallmentpaymentdonePageModule {}
