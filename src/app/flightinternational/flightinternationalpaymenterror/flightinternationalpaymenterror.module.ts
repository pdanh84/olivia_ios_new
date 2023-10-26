import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightInternationalPaymentErrorPage } from './flightinternationalpaymenterror.page';

const routes: Routes = [
  {
    path: '',
    component: FlightInternationalPaymentErrorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightInternationalPaymentErrorPage]
})
export class FlightInternationalPaymentErrorPageModule {}
