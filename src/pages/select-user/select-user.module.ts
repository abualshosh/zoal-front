import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectUserPage } from './select-user';

@NgModule({
  declarations: [
    SelectUserPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectUserPage),
  ],
})
export class SelectUserPageModule {}
