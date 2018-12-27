import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ElectricityServicesPage } from "./electricity-services";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [ElectricityServicesPage],
  imports: [
    IonicPageModule.forChild(ElectricityServicesPage),
    TranslateModule.forChild()
  ],
  exports: [ElectricityServicesPage]
})
export class ElectricityServicesPageModule {}
