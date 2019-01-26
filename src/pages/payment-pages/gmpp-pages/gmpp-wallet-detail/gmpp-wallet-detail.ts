import { Component } from "@angular/core";
import { StorageProvider, Wallet } from "../../../../providers/storage/storage";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Platform, IonicPage, ToastController } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-gmpp-wallet-detail",
  templateUrl: "gmpp-wallet-detail.html"
})
export class GmppWalletDetailPage {
  wallets: Wallet[] = [];
  newWallet: Wallet = <Wallet>{};

  private form: FormGroup;
  submitAttempt = false;

  constructor(
    private storageProvider: StorageProvider,
    private plt: Platform,
    private formBuilder: FormBuilder,
    private toastController: ToastController
  ) {
    this.plt.ready().then(() => {
      this.loadWallets();
    });

    this.form = this.formBuilder.group({
      walletNumber: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12),
          Validators.pattern("249[0-9]*")
        ])
      ]
    });
  }

  addWallet() {
    this.submitAttempt = true;
    if (this.form.valid) {
      this.newWallet.number = this.form.controls["walletNumber"].value;
      this.newWallet.modified = Date.now();
      this.newWallet.id = Date.now();

      this.storageProvider.addItem(this.newWallet).then(item => {
        this.newWallet = <Wallet>{};
        this.loadWallets(); // Or add it to the array directly
      });
      this.submitAttempt = false;
    }
  }

  loadWallets() {
    this.storageProvider.getItems().then(items => {
      this.wallets = items;
    });
  }

  updateWallet(item: Wallet) {
    if (this.newWallet) {
      item.number = this.newWallet.number;
      item.modified = Date.now();
      this.storageProvider.updateItem(item).then(item => {
        this.loadWallets(); // Or update it inside the array directly
      });
    }
  }

  deleteWallet(item: Wallet) {
    this.storageProvider.deleteItem(item.id).then(item => {
      this.loadWallets(); // Or splice it from the array directly
    });
  }

  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
