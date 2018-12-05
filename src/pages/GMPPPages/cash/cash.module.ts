import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CashPage } from './cash';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CashPage,
  ],
  imports: [
    IonicPageModule.forChild(CashPage),
    TranslateModule.forChild()

  ],
  exports: [
    CashPage
  ]
})
export class CashPageModule {}
