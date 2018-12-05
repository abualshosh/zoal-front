import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransferListPage } from './transfer-list';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    TransferListPage,
  ],
  imports: [
    IonicPageModule.forChild(TransferListPage),
          TranslateModule.forChild()
  ],
  exports: [
    TransferListPage
  ]
})
export class TransferListPageModule {}
