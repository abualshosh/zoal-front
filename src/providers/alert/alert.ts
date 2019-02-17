import { Injectable } from "@angular/core";
import { AlertController, ToastController } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class AlertProvider {
  errorMessage: string;
  errorTitle: string;
  errorButton: string;

  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public translateService: TranslateService
  ) {
    this.getTranslatedStrings();
  }

  getTranslatedStrings() {
    this.translateService
      .get(["errorTitle", "errorMessage", "errorButton"])
      .subscribe(values => {
        this.errorTitle = values["errorTitle"];
        this.errorMessage = values["errorMessage"];
        this.errorButton = values["errorButton"];
      });
  }

  showAlert(data: any, showExact?: boolean) {
    this.getTranslatedStrings();

    let message: any;
    if (data.responseCode != null) {
      message = data.responseMessage;
    } else if (showExact) {
      this.translateService.get(data).subscribe(val => {
        if (val) {
          message = val;
        } else {
          message = data;
        }
      });
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

  showToast(message) {
    this.translateService.get(message).subscribe(val => {
      if (val) {
        message = val;
      } else {
        message = message;
      }
    });
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }
}
