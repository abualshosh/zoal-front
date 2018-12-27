import { MainMenuPage } from "./main-menu";
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [MainMenuPage],
  imports: [
    NgxQRCodeModule,
    IonicPageModule.forChild(MainMenuPage),
    TranslateModule.forChild()
  ],
  exports: [MainMenuPage]
})
export class MainMenuPageModule {}
