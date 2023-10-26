import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MytripaymentflighdonePage } from './mytripaymentflighdone.page';

const routes: Routes = [
  {
    path: '',
    component: MytripaymentflighdonePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MytripaymentflighdonePage]
})
export class MytripaymentflighdonePageModule {}
