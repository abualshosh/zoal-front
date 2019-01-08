import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppE15Page } from "./gmpp-e15";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [GmppE15Page],
  imports: [IonicPageModule.forChild(GmppE15Page), TranslateModule.forChild()],
  exports: [GmppE15Page]
})
export class GmppE15PageModule {}
