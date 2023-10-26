import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightInternationalPaymentTimeoutPage } from './flightinternationalpaymenttimeout.page';

const routes: Routes = [
  {
    path: '',
    component: FlightInternationalPaymentTimeoutPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightInternationalPaymentTimeoutPage]
})
export class FlightInternationalPaymentTimeoutPageModule {}
