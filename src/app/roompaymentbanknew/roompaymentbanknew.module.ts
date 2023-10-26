import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RoompaymentbanknewPage } from './roompaymentbanknew.page';

const routes: Routes = [
  {
    path: '',
    component: RoompaymentbanknewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RoompaymentbanknewPage]
})
export class RoompaymentbanknewPageModule {}
