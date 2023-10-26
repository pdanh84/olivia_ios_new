import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightInternationalPaymentPayooPage } from './flightinternationalpaymentpayoo.page';

const routes: Routes = [
  {
    path: '',
    component: FlightInternationalPaymentPayooPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightInternationalPaymentPayooPage]
})
export class FlightInternationalPaymentPayooPageModule {}
