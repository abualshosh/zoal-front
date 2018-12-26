/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

export class Card {
  constructor(
    public CARDNAME,
    public pan: string,
    public panview: string,
    public expDate: string,
    public selected: boolean
  ) {}

  printuser() {
    //console.log(this.pan);
  }
}
