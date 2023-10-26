import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TopdealfilterPage } from './topdealfilter.page';

const routes: Routes = [
  {
    path: '',
    component: TopdealfilterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TopdealfilterPage]
})
export class TopdealfilterPageModule {}