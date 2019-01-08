import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppLastTransactionsPage } from "./gmpp-last-transactions";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [GmppLastTransactionsPage],
  imports: [
    IonicPageModule.forChild(GmppLastTransactionsPage),
    TranslateModule.forChild()
  ],
  exports: [GmppLastTransactionsPage]
})
export class GmppTransactionsPageModule {}
