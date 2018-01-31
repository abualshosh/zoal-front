import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GmpppatmentlistPage } from './gmpppatmentlist';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    GmpppatmentlistPage,
  ],
  imports: [
    IonicPageModule.forChild(GmpppatmentlistPage),
      TranslateModule.forChild()
  ],
  exports: [
    GmpppatmentlistPage
  ]
})
export class GmpppatmentlistPageModule {}
