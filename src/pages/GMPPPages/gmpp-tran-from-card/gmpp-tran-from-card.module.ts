import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GmppTranFromCardPage } from './gmpp-tran-from-card';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    GmppTranFromCardPage,
  ],
  imports: [
    IonicPageModule.forChild(GmppTranFromCardPage),
          TranslateModule.forChild()
  ],
  exports: [
    GmppTranFromCardPage
  ]
})
export class GmppTranFromCardPageModule {}
