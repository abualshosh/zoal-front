import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppPruchasPage } from "./gmpp-pruchas";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [GmppPruchasPage],
  imports: [
    IonicPageModule.forChild(GmppPruchasPage),
    TranslateModule.forChild()
  ],
  exports: [GmppPruchasPage]
})
export class GmppPruchasPageModule {}
