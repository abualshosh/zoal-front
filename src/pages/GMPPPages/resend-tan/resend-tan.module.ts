import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ResendTanPage } from "./resend-tan";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [ResendTanPage],
  imports: [
    IonicPageModule.forChild(ResendTanPage),
    TranslateModule.forChild()
  ],
  exports: [ResendTanPage]
})
export class ResendTanPageModule {}
