import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HotelListMoodPage } from './hotel-list-mood';

@NgModule({
  declarations: [
    HotelListMoodPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HotelListMoodPage
      }
    ])
  ],
})
export class HotelListMoodPageModule {}
