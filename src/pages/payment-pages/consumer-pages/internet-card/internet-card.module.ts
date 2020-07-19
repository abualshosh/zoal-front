import { NgModule } from "@angular/core";
import { InternetCardComponent } from "./internet-card";
import { IonicPageModule } from "ionic-angular";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    declarations: [InternetCardComponent],
    imports: [
        IonicPageModule.forChild(InternetCardComponent),
        TranslateModule.forChild()
        
    ],
    exports:[InternetCardComponent]
})
export class InternetCardComponentModule {}