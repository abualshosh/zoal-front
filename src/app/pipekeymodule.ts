import { NgModule } from '@angular/core';

import { KeysPipe } from '../pipes/keys/keys';

    @NgModule({
    
    declarations: [KeysPipe],
    exports: [KeysPipe]
})
export class KeysPipeModule { }


