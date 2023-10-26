import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MytripTourInfoPage } from './mytriptourinfo';

@NgModule({
  declarations: [
    MytripTourInfoPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: MytripTourInfoPage
      }
    ])
  ],
})
export class MyTripTourInfoPageModule {}
