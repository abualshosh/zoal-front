import { Component } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import {
  ModalController,
  IonicPage,
  NavController,
  Events
} from "ionic-angular";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import * as uuid from "uuid";
import * as moment from "moment";
import { AlertProvider } from "../../../../providers/alert/alert";
import { StorageProvider, Item } from "../../../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-get-balance",
  templateUrl: "get-balance.html"
})
export class GetBalancePage {
  public cards: any[] = [];
  submitAttempt: boolean = false;
  isReadyToSave: boolean;

  todo = this.formBuilder.group({
    Card: ["", Validators.required],
    IPIN: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
        Validators.pattern("[0-9]*")
      ])
    ]
  });

  constructor(
    public events: Events,
    private formBuilder: FormBuilder,
    public serviceProvider: GetServicesProvider,
    public navCtrl: NavController,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController
  ) {
    this.todo.valueChanges.subscribe(v => {
      this.isReadyToSave = this.todo.valid;
    });
  }

  ionViewWillEnter() {
    this.subscribeToDataChanges();
    this.loadData();
  }

  subscribeToDataChanges() {
    this.events.subscribe("data:updated", () => {
      this.todo.reset();
      this.loadData();
    });
  }

  loadData() {
    this.storageProvider.getCards().subscribe(res => {
      this.cards = res.body
    })

  }

  logForm() {
    this.submitAttempt = true;
    if (this.todo.valid) {
      const form = this.todo.value;
      const tranUuid = uuid.v4();
      const request = {
        UUID: tranUuid,
        IPIN: this.serviceProvider.encrypt(tranUuid + form.IPIN),
        tranCurrency: "SDG",
        authenticationType: "00",
        fromAccountType: "00",
        pan: form.Card.cardNumber,
        expDate: form.Card.expDate
      };

      this.serviceProvider
        .doTransaction(request, "consumer/getBalance")
        .subscribe(res => {
          if (res != null && res.responseCode == 0) {
            const datetime = moment(res.tranDateTime, "DDMMyyHhmmss").format(
              "DD/MM/YYYY  hh:mm:ss"
            );
            const main = [{ balance: res.balance.available }];
            const data = [{ Card: res.PAN, date: datetime }];

            let modal = this.modalCtrl.create(
              "TransactionDetailPage",
              { data: data, main: main },
              { cssClass: "inset-modal" }
            );
            modal.present();

            this.todo.reset();
            this.submitAttempt = false;
          } else {
            if (res.responseCode != null) {
              this.alertProvider.showAlert(res);
            } else {
              res.responseMessage = "Connection Error";
              this.alertProvider.showAlert(res);
            }
            this.todo.reset();
            this.submitAttempt = false;
          }
        });
    }
  }
}
