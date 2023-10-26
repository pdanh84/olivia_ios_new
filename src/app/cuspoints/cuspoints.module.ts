import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CuspointsPage } from './cuspoints';

@NgModule({
  declarations: [
    CuspointsPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: CuspointsPage
      }
    ])
  ],
})
export class CuspointsPageModule {}
