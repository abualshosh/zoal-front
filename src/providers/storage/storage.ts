import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { Storage } from "@ionic/storage";

export interface Wallet {
  id: number;
  number: string;
  modified: number;
}

const WALLETS_KEY = "wallets";

@Injectable()
export class StorageProvider {
  constructor(private storage: Storage) {}

  // CREATE
  addItem(item: Wallet): Promise<any> {
    return this.storage.get(WALLETS_KEY).then((items: Wallet[]) => {
      if (items) {
        items.push(item);
        return this.storage.set(WALLETS_KEY, items);
      } else {
        return this.storage.set(WALLETS_KEY, [item]);
      }
    });
  }

  // READ
  getItems(): Promise<Wallet[]> {
    return this.storage.get(WALLETS_KEY);
  }

  // UPDATE
  updateItem(item: Wallet): Promise<any> {
    return this.storage.get(WALLETS_KEY).then((items: Wallet[]) => {
      if (!items || items.length === 0) {
        return null;
      }

      let newItems: Wallet[] = [];

      for (let i of items) {
        if (i.id === item.id) {
          newItems.push(item);
        } else {
          newItems.push(i);
        }
      }

      return this.storage.set(WALLETS_KEY, newItems);
    });
  }

  // DELETE
  deleteItem(id: number): Promise<Wallet> {
    return this.storage.get(WALLETS_KEY).then((items: Wallet[]) => {
      if (!items || items.length === 0) {
        return null;
      }

      let toKeep: Wallet[] = [];

      for (let i of items) {
        if (i.id !== id) {
          toKeep.push(i);
        }
      }
      return this.storage.set(WALLETS_KEY, toKeep);
    });
  }
}
