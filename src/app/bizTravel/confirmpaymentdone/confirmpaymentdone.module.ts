import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConfirmPaymentDonePage } from './confirmpaymentdone.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmPaymentDonePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConfirmPaymentDonePage]
})
export class ConfirmPaymentDonePageModule {}
