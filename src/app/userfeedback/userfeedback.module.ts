import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserFeedBackPage } from './userfeedback';
import { File } from '@awesome-cordova-plugins/file';
@NgModule({
  declarations: [
    UserFeedBackPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: UserFeedBackPage
    }]),
  ],
  providers: [File], 
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class UserFeedBackPageModule {}