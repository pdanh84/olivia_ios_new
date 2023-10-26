import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { Tab1Page } from './tab1.page';
import { HomeflightPageModule } from '../homeflight/homeflight.module';
import { HomeTourPageModule } from '../tour/hometour/hometour.module';
import { HomeTicketPageModule } from '../ticket/tickethome/hometicket/hometicket.module';

const routes: Routes = [
  {
    path: '',
    component: Tab1Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    HomeflightPageModule,
    HomeTourPageModule,
    HomeTicketPageModule
  ],
  declarations: [Tab1Page],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class Tab1PageModule {}
