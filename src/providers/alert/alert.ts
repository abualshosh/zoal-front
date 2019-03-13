import { Injectable } from "@angular/core";
import { AlertController, ToastController } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import { Item } from "../storage/storage";

@Injectable()
export class AlertProvider {
  errorMessage: string;
  errorTitle: string;
  errorButton: string;
  cancelButton: string;
  okButton: string;

  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public translateService: TranslateService
  ) {
    this.getTranslatedStrings();
  }

  getTranslatedStrings() {
    this.translateService
      .get(["errorTitle", "errorMessage", "errorButton", "cancel", "ok"])
      .subscribe(values => {
        this.errorTitle = values["errorTitle"];
        this.errorMessage = values["errorMessage"];
        this.errorButton = values["errorButton"];
        this.cancelButton = values["cancel"];
        this.okButton = values["ok"];
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
      }
    });
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  showRadio(data: Item[], title) {
    this.getTranslatedStrings();

    this.translateService.get(title).subscribe(val => {
      if (val) {
        title = val;
      }
    });

    return new Promise<any>((resolve, reject) => {
      let alert = this.alertCtrl.create();
      alert.setTitle(title);

      data.forEach(val => {
        alert.addInput({
          type: "radio",
          label: val.name,
          value: val.favoriteText
        });
      });

      alert.addButton({
        text: this.cancelButton,
        handler: () => {}
      });
      alert.addButton({
        text: this.okButton,
        handler: data => {
          resolve(data);
        }
      });

      alert.present();
    });
  }
}
