import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlightInternationalFilterClassPage } from './flightinternationalfilterclass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: FlightInternationalFilterClassPage
    }]),
  ],
  declarations: [FlightInternationalFilterClassPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FlightInternationalFilterClassPageModule {}