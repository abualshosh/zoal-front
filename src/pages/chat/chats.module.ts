// import { SharedModule } from '../../../app/shared.module';
import { ChatsPage } from './chats';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChatsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatsPage),
    TranslateModule.forChild()
  //  SharedModule
  ],
  exports: [
    ChatsPage
  ]
})

export class ChatsPageModule { }
