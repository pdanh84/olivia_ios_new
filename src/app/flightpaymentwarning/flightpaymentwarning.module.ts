import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightpaymentwarningPage } from './flightpaymentwarning.page';

const routes: Routes = [
  {
    path: '',
    component: FlightpaymentwarningPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightpaymentwarningPage]
})
export class FlightpaymentwarningPageModule {}
