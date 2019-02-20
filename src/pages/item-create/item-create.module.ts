import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ItemCreatePage } from "./item-create";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [ItemCreatePage],
  imports: [
    IonicPageModule.forChild(ItemCreatePage),
    TranslateModule.forChild()
  ]
})
export class ItemCreatePageModule {}
