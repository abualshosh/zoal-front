import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GmppChangePinPage } from './gmpp-change-pin';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    GmppChangePinPage,
  ],
  imports: [
    IonicPageModule.forChild(GmppChangePinPage),
        TranslateModule.forChild()
  ],
  exports: [
    GmppChangePinPage
  ]
})
export class GmppChangePinPageModule {}
