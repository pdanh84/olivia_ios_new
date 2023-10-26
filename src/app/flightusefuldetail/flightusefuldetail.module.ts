import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightUsefulDetailPage } from './flightusefuldetail.page';
import { FlightusefulPageModule } from '../flightuseful/flightuseful.module';

const routes: Routes = [
  {
    path: '',
    component: FlightUsefulDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlightusefulPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightUsefulDetailPage]
})
export class FlightUsefulDetailPageModule {}