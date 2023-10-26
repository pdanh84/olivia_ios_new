import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomeTourPage } from './hometour.page';
import { HomeTourSearchPageModule } from './hometourcomponent/hometoursearch/hometoursearch.module';
import { HomeTourItemSlidePageModule } from './hometourcomponent/hometouritemslide/hometouritemslide.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeTourSearchPageModule,
    HomeTourItemSlidePageModule,
  ],
  declarations: [HomeTourPage],
  exports: [HomeTourPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class HomeTourPageModule {}
