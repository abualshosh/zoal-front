import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListPage } from './list';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    ListPage,
  ],
  imports: [
    IonicPageModule.forChild(ListPage),
    TranslateModule.forChild()
  ],
  exports: [
    ListPage
  ]
})
export class ListPageModule {}