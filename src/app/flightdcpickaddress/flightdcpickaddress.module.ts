import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightdcpickaddressPage } from './flightdcpickaddress.page';

const routes: Routes = [
  {
    path: '',
    component: FlightdcpickaddressPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightdcpickaddressPage]
})
export class FlightdcpickaddressPageModule {}
