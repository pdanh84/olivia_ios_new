import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightcombodoneprepayPage } from './flightcombodoneprepay.page';

const routes: Routes = [
  {
    path: '',
    component: FlightcombodoneprepayPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightcombodoneprepayPage]
})
export class FlightcombodoneprepayPageModule {}
