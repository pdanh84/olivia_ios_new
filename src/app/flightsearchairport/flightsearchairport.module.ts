import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightsearchairportPage } from './flightsearchairport.page';

const routes: Routes = [
  {
    path: '',
    component: FlightsearchairportPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightsearchairportPage]
})
export class FlightsearchairportPageModule {}
