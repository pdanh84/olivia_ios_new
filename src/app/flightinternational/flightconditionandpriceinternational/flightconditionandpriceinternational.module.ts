import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightConditionAndPriceInternationalPage } from './flightconditionandpriceinternational.page';

const routes: Routes = [
  {
    path: '',
    component: FlightConditionAndPriceInternationalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightConditionAndPriceInternationalPage]
})
export class FlightConditionAndPriceInternationalPageModule {}