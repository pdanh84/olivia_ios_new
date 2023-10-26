import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightpaymenttimeoutPage } from './flightpaymenttimeout.page';

const routes: Routes = [
  {
    path: '',
    component: FlightpaymenttimeoutPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightpaymenttimeoutPage]
})
export class FlightpaymenttimeoutPageModule {}
