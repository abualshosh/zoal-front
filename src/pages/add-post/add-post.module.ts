import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPostPage } from './add-post';
import { IonicImageLoader } from 'ionic-image-loader';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AddPostPage,
  ],
  imports: [
    IonicImageLoader,
    IonicPageModule.forChild(AddPostPage),
    TranslateModule.forChild()

  ],
})
export class AddPostPageModule {}
