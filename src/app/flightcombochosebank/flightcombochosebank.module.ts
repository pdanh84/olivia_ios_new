import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightcombochosebankPage } from './flightcombochosebank.page';

const routes: Routes = [
  {
    path: '',
    component: FlightcombochosebankPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightcombochosebankPage]
})
export class FlightcombochosebankPageModule {}
