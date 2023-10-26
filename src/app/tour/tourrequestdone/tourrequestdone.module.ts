import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TourRequestDonePage } from './tourrequestdone.page';

const routes: Routes = [
  {
    path: '',
    component: TourRequestDonePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TourRequestDonePage]
})
export class TourRequestDonePageModule {}
