import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransfaerToCardPage } from './transfaer-to-card';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    TransfaerToCardPage,
  ],
  imports: [
    IonicPageModule.forChild(TransfaerToCardPage),
        TranslateModule.forChild()
  ],
  exports: [
    TransfaerToCardPage
  ]
})
export class TransfaerToCardPageModule {}
