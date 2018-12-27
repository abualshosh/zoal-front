import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SelectUserPage } from "./select-user";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [SelectUserPage],
  imports: [
    IonicPageModule.forChild(SelectUserPage),
    TranslateModule.forChild()
  ],
  exports: [SelectUserPage]
})
export class SelectUserPageModule {}
