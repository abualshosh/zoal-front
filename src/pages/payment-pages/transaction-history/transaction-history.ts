import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Content
} from "ionic-angular";
import { Api } from "../../../providers/providers";
import { StorageProvider } from "../../../providers/storage/storage";
import { AlertProvider } from "../../../providers/alert/alert";
import * as moment from "moment";

@IonicPage()
@Component({
  selector: "page-transaction-history",
  templateUrl: "transaction-history.html"
})
export class TransactionHistoryPage {
  last: boolean = false;
  showSearchbar: boolean = false;
  size: any;
  page: any = 0;
  transactions = [];

  @ViewChild("content") content: Content;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public api: Api
  ) {
    this.api.get("profile-transactions", "?page=0&size=15", null).subscribe(
      (res: any) => {
        this.last = res.last;
        this.transactions = res.content;
        this.storageProvider.setTransactions(res).then(res => {});
      },
      err => {
        this.alertProvider.showToast("errorMessage");
        this.storageProvider.getTransactions().subscribe(res => {
          this.last = res.last;
          this.transactions = res.content;
        });
      }
    );
  }

  doRefresh(refresher) {
    this.api.get("profile-transactions", "?page=0&size=15", null).subscribe(
      (res: any) => {
        this.last = res.last;
        this.transactions = res.content;
        this.storageProvider.setTransactions(res).then(res => {});
        refresher.complete();
      },
      err => {
        console.error("ERROR", err);
        refresher.complete();
      }
    );
  }

  openTransaction(transaction) {
    let isSuccess;
    if (transaction.responseStatus === "Approved") {
      isSuccess = true;
    } else {
      isSuccess = false;
    }

    let response;
    if (transaction.ebsResponse) {
      response = JSON.parse(transaction.ebsResponse);

      let data = [];

      let mainData = {
        transactionType: transaction.type
      };

      let bodyData = {
        Card: response.PAN,
        WalletNumber: response.entityId
          ? response.entityId
          : response.consumerIdentifier,
        tranAmount: response.tranAmount,
        balance: response.balance ? response.balance.available : null,
        tranCurrency: response.tranCurrency,

        date: moment(response.tranDateTime, "DDMMyyHhmmss").format(
          "DD/MM/YYYY  hh:mm:ss"
        ),

        toCard: response.toCard,
        serviceInfo: response.serviceInfo,
        acqTranFee: response.acqTranFee,
        issuerTranFee: response.issuerTranFee,
        voucherCode: response.voucherCode,

        destinationIdentifier: response.destinationIdentifier,
        availableBalance: response.availableBalance,
        reservedBalance: response.reservedBalance,
        tan: response.tan,
        fee: response.fee,
        externalFee: response.externalFee,
        transactionAmount: response.transactionAmount,
        totalAmount: response.totalAmount,
        transactionId: response.transactionId
      };

      data.push(bodyData);

      if (response.billInfo) {
        if (Object.keys(response.billInfo).length > 0) {
          data.push(response.billInfo);
        }
      }

      let modal = this.modalCtrl.create(
        "TransactionDetailPage",
        {
          data: data,
          main: [mainData],
          isHistory: true,
          isSuccess: isSuccess
        },
        { cssClass: "inset-modal" }
      );
      modal.present();
    } else {
    }
  }

  doInfinite(infiniteScroll) {
    this.page = this.page + 1;
    this.api
      .get("profile-transactions", "?page=" + this.page + "&size=15", null)
      .subscribe(
        (res: any) => {
          this.last = res.last;
          for (let i = 0; i < res.content.length; i++) {
            this.transactions.push(res.content[i]);
          }
          infiniteScroll.complete();
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }
}
