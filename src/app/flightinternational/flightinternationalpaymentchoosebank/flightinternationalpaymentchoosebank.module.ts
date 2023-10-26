import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightInternationalPaymentChooseBankPage } from './flightinternationalpaymentchoosebank.page';

const routes: Routes = [
  {
    path: '',
    component: FlightInternationalPaymentChooseBankPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightInternationalPaymentChooseBankPage]
})
export class FlightInternationalPaymentChooseBankPageModule {}
