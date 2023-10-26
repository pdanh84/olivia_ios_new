import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule,FormControl } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserProfilePage } from './userprofile';

@NgModule({
  declarations: [
    UserProfilePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: UserProfilePage
    }]),
  ],
})
export class UserProfilePageModule {}