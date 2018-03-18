import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the KeysPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'keys',
})
export class KeysPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
   transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
        if (value[key]){
          if(value[key]!==0||key==='balance'||key==='availableBalance'){
      keys.push({key: key, value: value[key]});
          }
        }
    }
    return keys;
  }
}
