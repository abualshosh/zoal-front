import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardLessPage } from './card-less';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    CardLessPage,
  ],
  imports: [
    IonicPageModule.forChild(CardLessPage),
    TranslateModule.forChild()
  ],
  exports: [
    CardLessPage
  ]
})
export class CardLessPageModule {}
