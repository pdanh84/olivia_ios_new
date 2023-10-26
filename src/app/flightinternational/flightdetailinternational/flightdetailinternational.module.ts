import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightDetailInternationalPage } from './flightdetailinternational.page';

const routes: Routes = [
  {
    path: '',
    component: FlightDetailInternationalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightDetailInternationalPage]
})
export class FlightDetailInternationalPageModule {}