import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BlogModalPage } from './blogmodal';

@NgModule({
  declarations: [
    BlogModalPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: BlogModalPage
    }]),
  ],
})
export class BlogModalPageModule {}
