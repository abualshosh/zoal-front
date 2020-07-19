import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Api } from '../../../../providers/api/api';

@IonicPage()
@Component({
  selector: 'internet-card',
  templateUrl: 'internet-card.html'
})
export class InternetCardComponent {

internetCards :any[] =[]
  constructor(private api:Api) {
    this.internetCardLoad()
  }
  internetCardLoad() {
    this.api.get('internet-cards').subscribe((res:any) => {
   const data =    res.filter(internetCard => {
    
      
      if (internetCard.sold == false) {
          this.internetCards.push(internetCard)   
          return internetCard;
        }

   })
      console.log(data);
      
      console.table(this.internetCards);
      

      
    })
  }

}
