import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppRetireAccountPage } from "./gmpp-retire-account";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [GmppRetireAccountPage],
  imports: [
    IonicPageModule.forChild(GmppRetireAccountPage),
    TranslateModule.forChild()
  ],
  exports: [GmppRetireAccountPage]
})
export class RetireAccountPageModule {}
