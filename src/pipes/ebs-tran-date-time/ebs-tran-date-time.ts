import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";

@Pipe({
  name: "ebsTranDateTime"
})
export class EbsTranDateTimePipe implements PipeTransform {
  transform(value: string, ...args) {
    return moment(value, "DDMMyyHhmmss").format("DD/MM/YYYY  hh:mm:ss");
  }
}
