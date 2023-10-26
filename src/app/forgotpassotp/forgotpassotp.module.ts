import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ForgotpassotpPage } from './forgotpassotp.page';

const routes: Routes = [
  {
    path: '',
    component: ForgotpassotpPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ForgotpassotpPage]
})
export class ForgotpassotpPageModule {}
