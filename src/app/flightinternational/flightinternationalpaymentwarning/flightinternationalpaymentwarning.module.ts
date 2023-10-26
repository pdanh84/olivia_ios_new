import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightInternationalPaymentwarningPage } from './flightinternationalpaymentwarning.page';

const routes: Routes = [
  {
    path: '',
    component: FlightInternationalPaymentwarningPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightInternationalPaymentwarningPage]
})
export class FlightInternationalPaymentwarningPageModule {}
