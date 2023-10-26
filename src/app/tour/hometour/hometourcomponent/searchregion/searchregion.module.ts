import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SearchRegionPage } from './searchregion';

@NgModule({
  declarations: [
    SearchRegionPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: SearchRegionPage
    }]),
  ],
})
export class SearchRegionPageModule {}
