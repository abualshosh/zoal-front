import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { QrGeneratorPage } from "./qr-generator";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [QrGeneratorPage],
  imports: [
    NgxQRCodeModule,
    IonicPageModule.forChild(QrGeneratorPage),
    TranslateModule.forChild()
  ]
})
export class QrGeneratorPageModule {}
