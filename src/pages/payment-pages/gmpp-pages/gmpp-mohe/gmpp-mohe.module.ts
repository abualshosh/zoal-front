import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppMohePage } from "./gmpp-mohe";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [GmppMohePage],
  imports: [IonicPageModule.forChild(GmppMohePage), TranslateModule.forChild()],
  exports: [GmppMohePage]
})
export class GmppMohePageModule {}
