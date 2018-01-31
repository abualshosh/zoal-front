import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedsPage } from './feeds';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    FeedsPage,
  ],
  imports: [
    IonicImageLoader,
    IonicPageModule.forChild(FeedsPage),
  ],
})
export class FeedsPageModule {}
