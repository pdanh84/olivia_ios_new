import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { RequestCombo1Page } from './requestcombo1';

@NgModule({
  declarations: [
    RequestCombo1Page,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: RequestCombo1Page
    }]),
  ],
})
export class RequestCombo1PageModule {}
