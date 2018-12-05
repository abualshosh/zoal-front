import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LastTransactionsModPage } from './last-transactions-mod';
//import {KeysPipeModule} from '../../../app/pipekeymodule';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LastTransactionsModPage

  ],
  imports: [
    IonicPageModule.forChild(LastTransactionsModPage),
  //  KeysPipeModule,
     TranslateModule.forChild()
  ],
  exports: [
    LastTransactionsModPage
  ]
})
export class LastTransactionsModPageModule {}
