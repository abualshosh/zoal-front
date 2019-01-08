import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppLinkAccountPage } from "./gmpp-link-account";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [GmppLinkAccountPage],
  imports: [
    IonicPageModule.forChild(GmppLinkAccountPage),
    TranslateModule.forChild()
  ],
  exports: [GmppLinkAccountPage]
})
export class GmppLinkAccountPageModule {}
