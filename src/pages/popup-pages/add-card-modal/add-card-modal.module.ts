import { AddCardModalPage } from "./add-card-modal";
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [AddCardModalPage],
  imports: [
    IonicPageModule.forChild(AddCardModalPage),
    TranslateModule.forChild()
  ],
  exports: [AddCardModalPage]
})
export class AddCardModalPageModule {}
