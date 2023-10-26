import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomeTourSearchPage } from './hometoursearch.page';

@NgModule({
  declarations: [
    HomeTourSearchPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [HomeTourSearchPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class HomeTourSearchPageModule {}
