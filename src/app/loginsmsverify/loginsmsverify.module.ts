import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginsmsverifyPage } from './loginsmsverify.page';

const routes: Routes = [
  {
    path: '',
    component: LoginsmsverifyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LoginsmsverifyPage]
})
export class LoginsmsverifyPageModule {}
