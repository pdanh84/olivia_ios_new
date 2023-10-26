import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightcomboinfoluggagePage } from './flightcomboinfoluggage.page';

const routes: Routes = [
  {
    path: '',
    component: FlightcomboinfoluggagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightcomboinfoluggagePage]
})
export class FlightcomboinfoluggagePageModule {}
