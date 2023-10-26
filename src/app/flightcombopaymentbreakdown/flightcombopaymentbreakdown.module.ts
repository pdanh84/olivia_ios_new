import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightcombopaymentbreakdownPage } from './flightcombopaymentbreakdown.page';

const routes: Routes = [
  {
    path: '',
    component: FlightcombopaymentbreakdownPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightcombopaymentbreakdownPage]
})
export class FlightcombopaymentbreakdownPageModule {}
