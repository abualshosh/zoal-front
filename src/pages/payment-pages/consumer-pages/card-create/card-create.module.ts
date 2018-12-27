import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CardCreatePage } from "./card-create";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [CardCreatePage],
  imports: [
    IonicPageModule.forChild(CardCreatePage),
    TranslateModule.forChild()
  ],
  exports: [CardCreatePage]
})
export class CardCreatePageModule {}
