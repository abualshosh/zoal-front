import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Api } from '../../../../providers/api/api';
import { b } from '@angular/core/src/render3';

@IonicPage()
@Component({
  selector: 'internet-card',
  templateUrl: 'internet-card.html'
})
export class InternetCardComponent {

internetCardTypes :any[]
  result: any[];
  rate:any
  constructor(private api: Api, public navCtrl: NavController) {
    
    this.internetCardLoad();
    this.loadRate();
  }
  internetCardLoad() {
    this.api.get('internet-card-types').subscribe((res:any) => {

      var type = new Set(res.map(res => res.type));
      this.result = [];
      type.forEach(getType =>
        this.result.push({
          type_name: getType,
          values: res.filter(i => i.type === getType) ,
       }
        ))
    }
    )

  }
  loadRate() {
    this.api.get("dollar-rates").subscribe((res: any) => {
      
      this.rate = res[0].rate
    })    
  }
  openModal(value) {
    this.navCtrl.push('InternetCardPaymentPage', {
      value: value,
      amount:this.rate*value.price
    })
} 
  
}
