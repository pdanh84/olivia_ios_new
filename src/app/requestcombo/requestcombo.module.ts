import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { RequestComboPage } from './requestcombo';

@NgModule({
  declarations: [
    RequestComboPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: RequestComboPage
    }]),
  ],
})
export class RequestComboPageModule {}
