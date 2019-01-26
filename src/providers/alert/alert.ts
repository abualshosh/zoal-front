import { Injectable } from "@angular/core";
import { AlertController } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class AlertProvider {
  errorMessage: string;
  errorTitle: string;
  errorButton: string;

  constructor(
    public alertCtrl: AlertController,
    public translateService: TranslateService
  ) {
    translateService
      .get(["errorTitle", "errorMessage", "errorButton"])
      .subscribe(values => {
        this.errorTitle = values["errorTitle"];
        this.errorMessage = values["errorMessage"];
        this.errorButton = values["errorButton"];
      });
  }

  showAlert(data: any) {
    let message: any;
    if (data.responseCode != null) {
      message = data.responseMessage;
    } else {
      message = this.errorMessage;
    }
    let alert = this.alertCtrl.create({
      title: this.errorTitle,
      message: message,

      buttons: [this.errorButton],
      cssClass: "alertCustomCss"
    });
    alert.present();
  }
}
