import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InsurrancehistorypopoverPage } from './insurrancehistorypopover.page';

const routes: Routes = [
  {
    path: '',
    component: InsurrancehistorypopoverPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InsurrancehistorypopoverPage]
})
export class InsurrancehistorypopoverPageModule {}
