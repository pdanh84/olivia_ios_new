import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AccountDeletionDonePage } from './accountdeletiondone.page';

const routes: Routes = [
  {
    path: '',
    component: AccountDeletionDonePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AccountDeletionDonePage]
})
export class AccountDeletionDonePageModule {}
