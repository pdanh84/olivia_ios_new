import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InsurrancedetailPage } from './insurrancedetail.page';
import { InsurranceBankSelectPageModule } from '../insurrancebankselect/insurrancebankselect.module';

const routes: Routes = [
  {
    path: '',
    component: InsurrancedetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InsurranceBankSelectPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InsurrancedetailPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class InsurrancedetailPageModule {}
