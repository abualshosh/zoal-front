import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ConsumerMenuPage } from "./consumer-menu";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [ConsumerMenuPage],
  imports: [
    NgxQRCodeModule,
    IonicPageModule.forChild(ConsumerMenuPage),
    TranslateModule.forChild()
  ],
  exports: [ConsumerMenuPage]
})
export class ConsumerMenuPageModule {}
