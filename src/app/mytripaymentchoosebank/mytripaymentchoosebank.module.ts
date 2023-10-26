import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MytripaymentchoosebankPage } from './mytripaymentchoosebank.page';

const routes: Routes = [
  {
    path: '',
    component: MytripaymentchoosebankPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MytripaymentchoosebankPage]
})
export class MytripaymentchoosebankPageModule {}
