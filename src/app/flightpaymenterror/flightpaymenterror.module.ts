import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightpaymenterrorPage } from './flightpaymenterror.page';

const routes: Routes = [
  {
    path: '',
    component: FlightpaymenterrorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightpaymenterrorPage]
})
export class FlightpaymenterrorPageModule {}
