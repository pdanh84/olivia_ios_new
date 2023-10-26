import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightInternationalPaymentDoneBankPage } from './flightinternationalpaymentdonebank.page';

const routes: Routes = [
  {
    path: '',
    component: FlightInternationalPaymentDoneBankPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightInternationalPaymentDoneBankPage]
})
export class FlightInternationalPaymentDoneBankPageModule {}
