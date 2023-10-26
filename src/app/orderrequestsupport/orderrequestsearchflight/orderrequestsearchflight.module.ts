import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderRequestSearchFlightPage } from './orderrequestsearchflight.page';

const routes: Routes = [
  {
    path: '',
    component: OrderRequestSearchFlightPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderRequestSearchFlightPage]
})
export class OrderRequestSearchFlightPageModule {}
