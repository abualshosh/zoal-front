import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelfunlockPage } from './selfunlock';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SelfunlockPage,
  ],
  imports: [
    IonicPageModule.forChild(SelfunlockPage),
          TranslateModule.forChild()
  ],
  exports: [
    SelfunlockPage
  ]
})
export class SelfunlockPageModule {}
