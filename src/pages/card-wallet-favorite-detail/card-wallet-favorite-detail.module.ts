import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CardWalletFavoriteDetailPage } from "./card-wallet-favorite-detail";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [CardWalletFavoriteDetailPage],
  imports: [
    IonicPageModule.forChild(CardWalletFavoriteDetailPage),
    TranslateModule.forChild()
  ]
})
export class CardWalletFavoriteDetailPageModule {}
