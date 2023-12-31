import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {  RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserZaloPage } from './userzalo.page';

@NgModule({
  declarations: [
    UserZaloPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: UserZaloPage
    }]),
  ],
})
export class UserZaloPageModule {}