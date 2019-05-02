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
  dateFilter: any;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public api: Api
  ) {
    this.alertProvider.showLoading();
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
      },
      () => {
        this.alertProvider.hideLoading();
      }
    );
  }

  doRefresh(refresher) {
    this.api.get("profile-transactions", "?page=0&size=15", null).subscribe(
      (res: any) => {
        this.last = res.last;
        this.transactions = res.content;
        this.storageProvider.setTransactions(res).then(res => {});
        this.dateFilter = null;
        refresher.complete();
      },
      err => {
        console.error("ERROR", err);
        this.dateFilter = null;
        refresher.complete();
      }
    );
  }

  filterByDate() {
    this.alertProvider.showLoading();
    this.api.get("all-profile-transactions").subscribe(
      (res: any) => {
        this.filterTransactions(res);
      },
      err => {
        this.storageProvider.getTransactions().subscribe(res => {
          this.filterTransactions(res.content);
        });
        this.alertProvider.showToast("errorMessage");
      },
      () => {
        this.alertProvider.hideLoading();
      }
    );
  }

  filterTransactions(transactions) {
    this.dateFilter = moment(this.dateFilter, "YYYY-MM-DD").format("DDMMYY");
    this.transactions = transactions.filter(val => {
      let tranDate = moment(val.tranDateTime, "DDMMyyHhmmss").format("DDMMYY");
      return tranDate == this.dateFilter;
    });
  }

  parseTranType(type: string): string {
    let result: string = type.replace(/Consumer: |Gmpp: |IPINGeneration: /, "");
    return result.replace(/payment - |billInquiry - |specialPayment - /, "");
  }

  openTransaction(transaction) {
    let isSuccess;
    if (transaction.responseStatus === "Successful") {
      isSuccess = true;
    } else {
      isSuccess = false;
    }

    let response;
    if (transaction.ebsResponse) {
      response = JSON.parse(transaction.ebsResponse);

      let data = [];

      let mainData = {
        transactionType: this.parseTranType(transaction.type),
        tranAmount: transaction.tranAmount ? transaction.tranAmount : null
      };

      let balance = null;
      if (transaction.type == "Consumer: balanceInquiry") {
        balance = response.balance.available;
      }

      let bodyData = {
        date: moment(response.tranDateTime, "DDMMyyHhmmss").format(
          "DD/MM/YYYY  hh:mm:ss"
        ),
        Card: response.PAN,
        toCard: response.toCard,
        WalletNumber: response.entityId
          ? response.entityId
          : response.consumerIdentifier,
        voucherCode: response.voucherCode,

        balance: balance,

        serviceInfo: response.serviceInfo,
        fees:
          response.acqTranFee + response.issuerTranFee + response.dynamicFees,

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
          // Customs unneeded fields
          response.billInfo.Status = null;
          response.billInfo.ReceiptDate = null;
          response.billInfo.ReceiptSerial = null;
          response.billInfo.RegistrationSerial = null;
          response.billInfo.RegistrationSerial = null;
          response.billInfo.ProcStatus = null;
          response.billInfo.ProcError = null;

          //E15 unneeded fields
          response.billInfo.UnitName = null;
          response.billInfo.ServiceName = null;
          response.billInfo.TotalAmount = null;

          //NEC unneeded fields
          response.billInfo.opertorMessage = null;
          response.billInfo.accountNo = null;
          response.billInfo.netAmount = null;

          data.push(response.billInfo);
        }
      }

      let modal = this.modalCtrl.create(
        "TransactionDetailPage",
        {
          data: data,
          main: mainData,
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
