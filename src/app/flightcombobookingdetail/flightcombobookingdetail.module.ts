import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightcombobookingdetailPage } from './flightcombobookingdetail.page';

const routes: Routes = [
  {
    path: '',
    component: FlightcombobookingdetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightcombobookingdetailPage]
})
export class FlightcombobookingdetailPageModule {}
