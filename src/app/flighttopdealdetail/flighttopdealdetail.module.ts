import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlighttopdealdetailPage } from './flighttopdealdetail.page';

const routes: Routes = [
  {
    path: '',
    component: FlighttopdealdetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlighttopdealdetailPage]
})
export class FlighttopdealdetailPageModule {}