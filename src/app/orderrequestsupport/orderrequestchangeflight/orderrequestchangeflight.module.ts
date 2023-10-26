import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderRequestChangeFlightPage } from './orderrequestchangeflight.page';

const routes: Routes = [
  {
    path: '',
    component: OrderRequestChangeFlightPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderRequestChangeFlightPage]
})
export class OrderRequestChangeFlightPageModule {}
