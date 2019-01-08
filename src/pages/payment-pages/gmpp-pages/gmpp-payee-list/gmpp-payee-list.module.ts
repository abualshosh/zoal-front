import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppPayeeListPage } from "./gmpp-payee-list";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [GmppPayeeListPage],
  imports: [
    IonicPageModule.forChild(GmppPayeeListPage),
    TranslateModule.forChild()
  ],
  exports: [GmppPayeeListPage]
})
export class GmppPayeeListPageModule {}
