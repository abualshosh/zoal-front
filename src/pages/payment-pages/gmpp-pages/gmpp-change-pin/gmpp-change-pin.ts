import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ModalController,
  Events
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController } from "ionic-angular";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import * as uuid from "uuid";
import { Item, StorageProvider } from "../../../../providers/storage/storage";
import { AlertProvider } from "../../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-gmpp-change-pin",
  templateUrl: "gmpp-change-pin.html"
})
export class GmppChangePinPage {
  // consumerIdentifier: any;
  private todo: FormGroup;
  public wallets: Item[];
  submitAttempt: boolean = false;

  public GetServicesProvider: GetServicesProvider;

  constructor(
    public events: Events,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProviderg: GetServicesProvider,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController,
    public storageProvider: StorageProvider,
    public navCtrl: NavController
  ) {
    // this.consumerIdentifier = "249" + localStorage.getItem("username");

    this.GetServicesProvider = GetServicesProviderg;

    this.todo = this.formBuilder.group({
      oldPIN: ["", Validators.required],
      newPIN: ["", Validators.required],
      connewPIN: ["", Validators.required]
    });
  }

  ionViewWillEnter() {
    this.subscribeToDataChanges();
    this.loadWallets();
  }

  loadWallets() {
    this.storageProvider.getWallets().then(wallets => {
      this.wallets = wallets;
      if (!this.wallets || this.wallets.length <= 0) {
      }
    });
  }

  subscribeToDataChanges() {
    this.events.subscribe("data:updated", () => {
      this.todo.reset();
      this.loadWallets();
    });
  }

  logForm() {
    this.submitAttempt = true;
    if (this.todo.valid) {
      let loader = this.loadingCtrl.create();
      loader.present();
      var dat = this.todo.value;
      if (dat.connewPIN == dat.newPIN) {
        dat.UUID = uuid.v4();
        dat.oldPIN = this.GetServicesProvider.encryptGmpp(
          dat.UUID + dat.oldPIN
        );
        dat.newPIN = this.GetServicesProvider.encryptGmpp(
          dat.UUID + dat.newPIN
        );
        dat.consumerIdentifier = this.wallets[0].walletNumber;

        dat.isConsumer = "true";
        dat.connewPIN = "";
        this.GetServicesProvider.load(this.todo.value, "gmpp/changePIN").then(
          data => {
            if (data != null && data.responseCode == 1) {
              loader.dismiss();
              var datas = [{ tital: "Status", desc: data.responseMessage }];
              let modal = this.modalCtrl.create(
                "GmppReceiptPage",
                { data: datas },
                { cssClass: "inset-modals" }
              );
              modal.present();
              this.submitAttempt = false;
            } else {
              this.submitAttempt = false;
              loader.dismiss();
              this.alertProvider.showAlert(data);
              this.todo.reset();
            }
          }
        );
      } else {
        this.submitAttempt = false;
        loader.dismiss();
        var data = { responseMessage: "" };
        data.responseMessage = "PIN Miss Match";
        this.alertProvider.showAlert(data);
      }
    }
  }
}
