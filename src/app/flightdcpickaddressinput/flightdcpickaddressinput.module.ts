import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightdcpickaddressinputPage } from './flightdcpickaddressinput.page';

const routes: Routes = [
  {
    path: '',
    component: FlightdcpickaddressinputPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightdcpickaddressinputPage]
})
export class FlightdcpickaddressinputPageModule {}
