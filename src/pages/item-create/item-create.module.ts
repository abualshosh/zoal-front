import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ItemCreatePage } from './item-create';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    ItemCreatePage,
  ],
  imports: [
    IonicImageLoader,
    IonicPageModule.forChild(ItemCreatePage),
    TranslateModule.forChild()
  ],
  exports: [
    ItemCreatePage
  ]
})
export class ItemCreatePageModule { }
