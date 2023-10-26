import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightInternationalPaymentBankPage } from './flightinternationalpaymentbank.page';

const routes: Routes = [
  {
    path: '',
    component: FlightInternationalPaymentBankPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightInternationalPaymentBankPage]
})
export class FlightInternationalPaymentBankPageModule {}
