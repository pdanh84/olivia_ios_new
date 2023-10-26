import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightpricedetailPage } from './flightpricedetail.page';

const routes: Routes = [
  {
    path: '',
    component: FlightpricedetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightpricedetailPage]
})
export class FlightpricedetailPageModule {}
