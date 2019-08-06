import { Injectable } from "@angular/core";
import {
  AlertController,
  ToastController,
  LoadingController
} from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import { Item } from "../storage/storage";

@Injectable()
export class AlertProvider {
  closeTitle: string;
  closeMessage: string;
  errorMessage: string;
  errorTitle: string;
  errorButton: string;
  cancelButton: string;
  okButton: string;
  loader: any;
  public isClose: boolean;

  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public translateService: TranslateService
  ) {
    this.getTranslatedStrings();
  }

  getTranslatedStrings() {
    this.translateService
      .get([
        "closeTitle",
        "closeMessage",
        "errorTitle",
        "errorMessage",
        "errorButton",
        "cancel",
        "ok"
      ])
      .subscribe(values => {
        this.closeTitle = values["closeTitle"];
        this.closeMessage = values["closeMessage"];
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
      position: "bottom",
      cssClass: 'customToastClass'
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

  showCloseAppAlert() {
    if (!this.isClose) {
      this.isClose = true;
      this.getTranslatedStrings();

      return new Promise<any>((resolve, reject) => {
        const alert = this.alertCtrl.create({
          title: this.closeTitle,
          message: this.closeMessage,
          buttons: [
            {
              text: this.cancelButton,
              handler: () => {
                reject();
              }
            },
            {
              text: this.okButton,
              handler: () => {
                resolve();
              }
            }
          ],
          enableBackdropDismiss: false
        });
        alert.present();
      });
    }
  }

  showLoading() {
    this.loader = this.loadingCtrl.create({
      spinner: "hide",
      content: `
      <div class="sk-folding-cube">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
      </div>`
    });
    this.loader.present();
  }

  hideLoading() {
    if (this.loader) {
      this.loader.dismiss();
    }
  }
}
