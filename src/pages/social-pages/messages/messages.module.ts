//import { SharedModule } from '../../../../app/shared.module';
import { MessagesPage } from "./messages";
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [MessagesPage],
  imports: [
    IonicPageModule.forChild(MessagesPage),
    TranslateModule.forChild()
    //    SharedModule,
  ],
  exports: [MessagesPage]
})
export class MessagesPageModule {}
