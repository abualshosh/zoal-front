import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { Storage } from "@ionic/storage";
import "rxjs/add/observable/fromPromise";
import { Observable } from "rxjs/Observable";
import { Api } from "../api/api";
import { HttpClient, HttpResponse } from "@angular/common/http";

export interface Wallet {
  id: number;
  number: string;
  modified: number;
}
export class Item {
  constructor(
    public id: number,
    public name?: string,
    public walletNumber?: string,
    public cardNumber?: string,
    public expDate?: string,
    public favoriteText?: string
  ) {}
}

const WALLETS_KEY = "wallets";

const CARDS_KEY = "cards";

const FAVORITES_KEY = "favorites";

const TRANSACTIONS_KEY = "profile";

@Injectable()
export class StorageProvider {
  constructor(private storage: Storage, protected http: HttpClient, private api :Api) {}

  setTransactions(transactions): Promise<any> {
    return this.storage.set(TRANSACTIONS_KEY, transactions);
  }

  getTransactions(): Observable<any> {
    return Observable.fromPromise(this.storage.get(TRANSACTIONS_KEY));
  }

  getWallets(): Promise<Item[]> {
    return this.storage.get(WALLETS_KEY);
  }

  getCards(): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(this.api.url+"/card-profile",{observe:'response'})
  }

  getFavorites(): Promise<Item[]> {
    return this.storage.get(FAVORITES_KEY);
  }

  // CREATE
  addItem(item, key): Promise<any> {
    return this.storage.get(key).then(items => {
      if (items) {
        items.push(item);
        return this.storage.set(key, items);
      } else {
        return this.storage.set(key, [item]);
      }
    });
  }

  // READ
  getItemss(key: string): Promise<any[]> {
    return this.storage.get(key);
  }

  // UPDATE
  updateItem(item, key): Promise<any> {
    return this.storage.get(key).then(items => {
      if (!items || items.length === 0) {
        return null;
      }

      let newItems: any[] = [];

      for (let i of items) {
        if (i.id === item.id) {
          newItems.push(item);
        } else {
          newItems.push(i);
        }
      }

      return this.storage.set(key, newItems);
    });
  }

  // DELETE
  deleteItem(id: number, key): Promise<any> {
    return this.storage.get(key).then(items => {
      if (!items || items.length === 0) {
        return null;
      }

      let toKeep: any[] = [];

      for (let i of items) {
        if (i.id !== id) {
          toKeep.push(i);
        }
      }
      return this.storage.set(key, toKeep);
    });
  }
}
