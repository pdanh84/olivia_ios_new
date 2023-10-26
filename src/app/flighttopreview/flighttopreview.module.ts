import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightTopReviewPage } from './flighttopreview.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [FlightTopReviewPage],
  exports: [FlightTopReviewPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FlightTopReviewPageModule {}