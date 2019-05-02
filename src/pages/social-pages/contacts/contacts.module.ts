import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { IonicPageModule } from "ionic-angular";
import { IonicImageLoader } from "ionic-image-loader";
import { ContactsPage } from "./contacts";

@NgModule({
  declarations: [ContactsPage],
  imports: [
    IonicPageModule.forChild(ContactsPage),
    TranslateModule.forChild(),
    IonicImageLoader
  ],
  exports: [ContactsPage]
})
export class ContactsPageModule {}
