import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { MultiCreditPage } from './multi-credit';

@NgModule({
  declarations: [
    MultiCreditPage,
  ],
  imports: [
    IonicPageModule.forChild(MultiCreditPage),
    TranslateModule.forChild()
  ],
  exports: [
    MultiCreditPage
  ]
})
export class MultiCreditPageModule {}
