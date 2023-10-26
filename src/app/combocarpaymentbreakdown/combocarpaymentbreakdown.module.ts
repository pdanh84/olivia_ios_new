import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CombocarpaymentbreakdownPage } from './combocarpaymentbreakdown.page';

const routes: Routes = [
  {
    path: '',
    component: CombocarpaymentbreakdownPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CombocarpaymentbreakdownPage]
})
export class CombocarpaymentbreakdownPageModule {}
