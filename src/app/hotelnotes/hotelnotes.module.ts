import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HotelNotesPage } from './hotelnotes';

@NgModule({
  declarations: [
    HotelNotesPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HotelNotesPage
      }
    ])
  ],
})
export class HotelNotesPageModule {}
