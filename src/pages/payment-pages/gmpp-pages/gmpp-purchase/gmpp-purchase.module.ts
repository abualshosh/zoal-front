import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppPurchasePage } from "./gmpp-purchase";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [GmppPurchasePage],
  imports: [
    IonicPageModule.forChild(GmppPurchasePage),
    TranslateModule.forChild()
  ],
  exports: [GmppPurchasePage]
})
export class GmppPurchasePageModule {}
