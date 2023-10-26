import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FlighttopplanPage } from './flighttopplan.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [FlighttopplanPage],
  exports: [FlighttopplanPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FlighttopplanPageModule {}