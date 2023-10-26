import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrdersupportdonePage } from './ordersupportdone.page';

const routes: Routes = [
  {
    path: '',
    component: OrdersupportdonePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrdersupportdonePage]
})
export class OrdersupportdonePageModule {}
