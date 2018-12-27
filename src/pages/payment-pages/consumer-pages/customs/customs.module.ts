import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CustomsPage } from "./customs";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [CustomsPage],
  imports: [IonicPageModule.forChild(CustomsPage), TranslateModule.forChild()],
  exports: [CustomsPage]
})
export class CustomsPageModule {}
