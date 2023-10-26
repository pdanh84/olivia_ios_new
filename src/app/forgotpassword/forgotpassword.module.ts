import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ForgotPasswordPage } from './forgotpassword';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ForgotPasswordPage
      }
    ])
  ],
  declarations: [ForgotPasswordPage]
})
export class ForgotPasswordPageModule {}
