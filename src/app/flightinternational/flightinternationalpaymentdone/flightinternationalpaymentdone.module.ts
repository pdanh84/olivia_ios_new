import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightInternationalPaymentDone } from './flightinternationalpaymentdone.page';

const routes: Routes = [
  {
    path: '',
    component: FlightInternationalPaymentDone
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightInternationalPaymentDone]
})
export class FlightInternationalPaymentDoneModule {}
