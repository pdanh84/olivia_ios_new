import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InsurranceNotePage } from './insurrancenote.page';

const routes: Routes = [
  {
    path: '',
    component: InsurranceNotePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InsurranceNotePage]
})
export class InsurranceNotePageModule {}
