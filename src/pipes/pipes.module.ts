import { NgModule } from '@angular/core';
import { RelativeTime } from './relative-time/relative-time';
import { EbsTranDateTimePipe } from './ebs-tran-date-time/ebs-tran-date-time';
@NgModule({
	declarations: [RelativeTime,
    EbsTranDateTimePipe],
	imports: [],
	exports: [RelativeTime,
    EbsTranDateTimePipe]
})
export class PipesModule {}
