import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CombochoosebankPage } from './combochoosebank.page';

const routes: Routes = [
  {
    path: '',
    component: CombochoosebankPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CombochoosebankPage]
})
export class CombochoosebankPageModule {}
