import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightBookingDetailsPage } from './flightbookingdetails.page';

const routes: Routes = [
  {
    path: '',
    component: FlightBookingDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightBookingDetailsPage]
})
export class FlightBookingDetailsPageModule {}