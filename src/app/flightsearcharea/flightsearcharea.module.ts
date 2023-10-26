import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightSearchAreaPage } from './flightsearcharea.page';

const routes: Routes = [
  {
    path: '',
    component: FlightSearchAreaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightSearchAreaPage]
})
export class FlightSearchAreaPageModule {}
