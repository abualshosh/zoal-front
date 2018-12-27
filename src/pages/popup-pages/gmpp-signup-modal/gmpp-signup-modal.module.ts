import { GmppSignupModalPage } from "./gmpp-signup-modal";
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [GmppSignupModalPage],
  imports: [
    IonicPageModule.forChild(GmppSignupModalPage),
    TranslateModule.forChild()
  ],
  exports: [GmppSignupModalPage]
})
export class GmppSignupModalPageModule {}
