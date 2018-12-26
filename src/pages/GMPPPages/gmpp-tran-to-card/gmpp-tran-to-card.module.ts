import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppTranToCardPage } from "./gmpp-tran-to-card";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [GmppTranToCardPage],
  imports: [
    IonicPageModule.forChild(GmppTranToCardPage),
    TranslateModule.forChild()
  ],
  exports: [GmppTranToCardPage]
})
export class GmppTranToCardPageModule {}
