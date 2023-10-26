import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule,FormControl } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserPrivacyPolicyPage } from './userprivacypolicy.page';

@NgModule({
  declarations: [
    UserPrivacyPolicyPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: UserPrivacyPolicyPage
    }]),
  ],
})
export class UserPrivacyPolicyPageModule {}