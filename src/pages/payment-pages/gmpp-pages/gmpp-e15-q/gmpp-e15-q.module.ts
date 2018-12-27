import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppE15QPage } from "./gmpp-e15-q";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [GmppE15QPage],
  imports: [IonicPageModule.forChild(GmppE15QPage), TranslateModule.forChild()],
  exports: [GmppE15QPage]
})
export class GmppE15QPageModule {}
