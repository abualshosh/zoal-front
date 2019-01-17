import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GenerateIpinPage } from "./generate-ipin";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [GenerateIpinPage],
  imports: [
    IonicPageModule.forChild(GenerateIpinPage),
    TranslateModule.forChild()
  ],
  exports: [GenerateIpinPage]
})
export class GenerateIpinPageModule {}
