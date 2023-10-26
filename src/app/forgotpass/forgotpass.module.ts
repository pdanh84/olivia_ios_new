import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ForgotpassPage } from './forgotpass.page';

// import {
//   RecaptchaModule,
//   RECAPTCHA_SETTINGS,
//   RecaptchaSettings,
//   RecaptchaFormsModule,
//   //RecaptchaComponent,
// } from 'ng-recaptcha';

const routes: Routes = [
  {
    path: '',
    component: ForgotpassPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ForgotpassPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  // providers: [
  //   {
  //     provide: RECAPTCHA_SETTINGS,
  //     useValue: {
  //       siteKey: '6Lfy_gAnAAAAAK1jziFGhO6qF9irAG6b-lYsa27h',
  //     } as RecaptchaSettings,
  //   },
  // ],
})
export class ForgotpassPageModule {}
