import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightpaymentchoosebankPage } from './flightpaymentchoosebank.page';

const routes: Routes = [
  {
    path: '',
    component: FlightpaymentchoosebankPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightpaymentchoosebankPage]
})
export class FlightpaymentchoosebankPageModule {}
