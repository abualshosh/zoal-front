import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { HomePage } from "./home";
import { TranslateModule } from "@ngx-translate/core";
import { NgxQRCodeModule } from "ngx-qrcode2";

@NgModule({
  declarations: [HomePage],
  imports: [
    NgxQRCodeModule,
    IonicPageModule.forChild(HomePage),
    TranslateModule.forChild()
  ],
  exports: [HomePage]
})
export class HomePageModule {}
