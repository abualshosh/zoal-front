import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPostPage } from './add-post';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    AddPostPage,
  ],
  imports: [
    IonicImageLoader,
    IonicPageModule.forChild(AddPostPage),
  ],
})
export class AddPostPageModule {}
