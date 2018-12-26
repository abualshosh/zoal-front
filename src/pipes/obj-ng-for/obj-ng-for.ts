import { Pipe, PipeTransform } from "@angular/core";

/**
 * Generated class for the ObjNgForPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: "ObjNgForPipe"
})
export class ObjNgForPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(inputObj: any, arg: any) {
    if (!inputObj) {
      return [];
    }

    let arr = [];
    for (let key in inputObj) {
      // Option1 (only value without the json object's key)
      // this way will lose the key of Json Object
      //arr.push(inputObj[key]);

      // OPtion2 (both the key and value)
      let obj = {};
      obj[key] = inputObj[key];
      arr.push(obj);
    }
    return arr;
  }
}
