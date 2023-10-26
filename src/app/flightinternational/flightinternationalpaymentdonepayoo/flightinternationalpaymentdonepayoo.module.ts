import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightInternationalPaymentDonePayooPage } from './flightinternationalpaymentdonepayoo.page';

const routes: Routes = [
  {
    path: '',
    component: FlightInternationalPaymentDonePayooPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightInternationalPaymentDonePayooPage]
})
export class FlightInternationalPaymentDonePayooPageModule {}
