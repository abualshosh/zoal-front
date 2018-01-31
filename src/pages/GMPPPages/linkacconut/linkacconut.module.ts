import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LinkacconutPage } from './linkacconut';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LinkacconutPage,
  ],
  imports: [
    IonicPageModule.forChild(LinkacconutPage),
          TranslateModule.forChild()
  ],
  exports: [
    LinkacconutPage
  ]
})
export class LinkacconutPageModule {}
