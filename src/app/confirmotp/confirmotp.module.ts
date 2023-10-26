import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ConfirmotpPage } from './confirmotp';

@NgModule({
  declarations: [
    ConfirmotpPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ConfirmotpPage
      }
    ])
  ],
schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ConfirmotpPageModule {}
