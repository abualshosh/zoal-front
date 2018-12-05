import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedsPage } from './feeds';
import { IonicImageLoader } from 'ionic-image-loader';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FeedsPage,
  ],
  imports: [
    IonicImageLoader,
    IonicPageModule.forChild(FeedsPage),
    TranslateModule.forChild()
  ],
})
export class FeedsPageModule {}
