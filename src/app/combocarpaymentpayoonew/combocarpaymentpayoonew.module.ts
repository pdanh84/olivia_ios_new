import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CombocarpaymentpayoonewPage } from './combocarpaymentpayoonew.page';

const routes: Routes = [
  {
    path: '',
    component: CombocarpaymentpayoonewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CombocarpaymentpayoonewPage]
})
export class CombocarpaymentpayoonewPageModule {}
