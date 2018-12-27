import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { VlidateOtpPage } from "./vlidate-otp";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [VlidateOtpPage],
  imports: [
    IonicPageModule.forChild(VlidateOtpPage),
    TranslateModule.forChild()
  ]
})
export class VlidateOtpPageModule {}
