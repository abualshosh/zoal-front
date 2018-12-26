import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { MohePage } from "./mohe";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [MohePage],
  imports: [IonicPageModule.forChild(MohePage), TranslateModule.forChild()],
  exports: [MohePage]
})
export class MohePageModule {}
