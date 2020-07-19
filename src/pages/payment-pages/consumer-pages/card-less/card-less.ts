import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ModalController,
  Events
} from "ionic-angular";
import * as moment from "moment";
import { Validators, FormBuilder } from "@angular/forms";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import * as uuid from "uuid";
import { AlertProvider } from "../../../../providers/alert/alert";
import { StorageProvider, Item } from "../../../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-card-less",
  templateUrl: "card-less.html"
})
export class CardLessPage {
  public cards:any[] = [];
  submitAttempt: boolean = false;
  favorites: any[];

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
    ],
    voucherNumber: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern("0[0-9]*")
      ])
    ],
    Amount: [
      "",
      Validators.compose([Validators.required, Validators.pattern("[0-9]*")])
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
  

    
    this.storageProvider.getFavorites().subscribe(favorites => {
      this.favorites = favorites.body;
    });
  }

  showFavorites() {
    if (this.favorites) {
      this.alertProvider.showRadio(this.favorites, "favorites").then(fav => {
        this.todo.controls["voucherNumber"].setValue(fav);
        if (!this.todo.controls["voucherNumber"].valid) {
          this.alertProvider.showToast("validvoucherNumberError");
          this.todo.controls["voucherNumber"].reset();
        }
      });
    }
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
        tranAmount: form.Amount,
        voucherNumber: form.voucherNumber,
        authenticationType: "00",
        fromAccountType: "00",
        toAccountType: "00",
        PAN: form.Card.cardNumber,
        expDate: form.Card.expDate
      };

      this.serviceProvider
        .doTransaction(request, "consumer/generateVoucher")
        .subscribe(res => {
          if (res != null && res.responseCode == 0) {
            const datetime = moment(res.tranDateTime, "DDMMyyHhmmss").format(
              "DD/MM/YYYY  hh:mm:ss"
            );

            const main = [{ cardLess: res.tranAmount }];
            const dat = [
              {
                voucherCode: res.voucherCode
              },
              {
                Card: res.PAN,
                fees:
                  this.calculateFees(res) !== 0
                    ? this.calculateFees(res)
                    : null,
                date: datetime
              }
            ];

            let modal = this.modalCtrl.create(
              "TransactionDetailPage",
              { data: dat, main: main },
              { cssClass: "inset-modal" }
            );

            modal.present();
            this.todo.reset();
            this.submitAttempt = false;
          } else {
            this.alertProvider.showAlert(res);
            this.todo.reset();
            this.submitAttempt = false;
          }
        });
    }
  }

  calculateFees(response) {
    let fees = 0;
    if (response.acqTranFee) {
      fees += response.acqTranFee;
    }

    if (response.issuerTranFee) {
      fees += response.issuerTranFee;
    }

    if (response.dynamicFees) {
      fees += response.dynamicFees;
    }

    return fees;
  }
}
