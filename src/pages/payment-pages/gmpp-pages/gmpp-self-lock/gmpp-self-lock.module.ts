import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppSelfLockPage } from "./gmpp-self-lock";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [GmppSelfLockPage],
  imports: [
    IonicPageModule.forChild(GmppSelfLockPage),
    TranslateModule.forChild()
  ],
  exports: [GmppSelfLockPage]
})
export class GmppSelfLockPageModule {}
