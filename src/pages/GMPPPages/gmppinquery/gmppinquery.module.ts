import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GmppinqueryPage } from './gmppinquery';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    GmppinqueryPage,
  ],
  imports: [
    IonicPageModule.forChild(GmppinqueryPage),
      TranslateModule.forChild()
  ],
  exports: [
    GmppinqueryPage
  ]
})
export class GmppinqueryPageModule {}
