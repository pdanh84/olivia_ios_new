import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CarComboPage } from './carcombo.page';
@NgModule({
  declarations: [
    CarComboPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: CarComboPage
      }
    ])
  ],
})
export class CarComboPageModule {}
