import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomeTourItemSlidePage } from './hometouritemslide.page';

@NgModule({
  declarations: [
    HomeTourItemSlidePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [HomeTourItemSlidePage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class HomeTourItemSlidePageModule {}