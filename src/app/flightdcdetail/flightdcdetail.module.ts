import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightdcdetailPage } from './flightdcdetail.page';

const routes: Routes = [
  {
    path: '',
    component: FlightdcdetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightdcdetailPage]
})
export class FlightdcdetailPageModule {}
