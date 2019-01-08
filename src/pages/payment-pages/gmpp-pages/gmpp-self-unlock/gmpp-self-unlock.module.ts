import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppSelfUnlockPage } from "./gmpp-self-unlock";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [GmppSelfUnlockPage],
  imports: [
    IonicPageModule.forChild(GmppSelfUnlockPage),
    TranslateModule.forChild()
  ],
  exports: [GmppSelfUnlockPage]
})
export class SelfunlockPageModule {}
