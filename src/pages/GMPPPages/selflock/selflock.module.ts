import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SelflockPage } from "./selflock";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [SelflockPage],
  imports: [IonicPageModule.forChild(SelflockPage), TranslateModule.forChild()],
  exports: [SelflockPage]
})
export class SelflockPageModule {}
