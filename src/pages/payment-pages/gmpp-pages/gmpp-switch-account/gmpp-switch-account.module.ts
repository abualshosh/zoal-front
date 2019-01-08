import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppSwitchAccountPage } from "./gmpp-switch-account";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [GmppSwitchAccountPage],
  imports: [
    IonicPageModule.forChild(GmppSwitchAccountPage),
    TranslateModule.forChild()
  ],
  exports: [GmppSwitchAccountPage]
})
export class GmppSwitchAccountPageModule {}
