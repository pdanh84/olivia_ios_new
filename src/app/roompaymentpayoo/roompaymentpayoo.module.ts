import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RoompaymentpayooPage } from './roompaymentpayoo.page';

const routes: Routes = [
  {
    path: '',
    component: RoompaymentpayooPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RoompaymentpayooPage]
})
export class RoompaymentpayooPageModule {}
