import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DescriptionPage } from './description';

@NgModule({
  declarations: [
    DescriptionPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: DescriptionPage
      }
    ])
  ],
})
export class DescriptionPageModule {}
