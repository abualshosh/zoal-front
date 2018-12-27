import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CardDetailPage } from "./card-detail";
import { TranslateModule } from "@ngx-translate/core";
import { NgxQRCodeModule } from "ngx-qrcode2";

@NgModule({
  declarations: [CardDetailPage],
  imports: [
    NgxQRCodeModule,
    IonicPageModule.forChild(CardDetailPage),
    TranslateModule.forChild()
  ],
  exports: [CardDetailPage]
})
export class CardDetailPageModule {}
