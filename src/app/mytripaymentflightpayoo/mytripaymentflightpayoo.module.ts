import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MytripaymentflightpayooPage } from './mytripaymentflightpayoo.page';

const routes: Routes = [
  {
    path: '',
    component: MytripaymentflightpayooPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MytripaymentflightpayooPage]
})
export class MytripaymentflightpayooPageModule {}
