import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppTransPage } from "./gmpp-trans";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [GmppTransPage],
  imports: [
    IonicPageModule.forChild(GmppTransPage),
    TranslateModule.forChild()
  ],
  exports: [GmppTransPage]
})
export class GmppTransPageModule {}
