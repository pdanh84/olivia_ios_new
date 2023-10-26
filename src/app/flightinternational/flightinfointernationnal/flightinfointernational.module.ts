import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightInfoInternationalPage } from './flightinfointernational.page';

const routes: Routes = [
  {
    path: '',
    component: FlightInfoInternationalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightInfoInternationalPage]
})
export class FlightInfoInternationalPageModule {}