import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FlightaddmealPage } from './flightaddmeal.page';

@NgModule({
  declarations: [
    FlightaddmealPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: FlightaddmealPage
    }]),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FlightaddmealPageModule {}