import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppMenuPage } from "./gmpp-menu";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [GmppMenuPage],
  imports: [
    NgxQRCodeModule,
    IonicPageModule.forChild(GmppMenuPage),
    TranslateModule.forChild()
  ],
  exports: [GmppMenuPage]
})
export class GmppMenuPageModule {}
