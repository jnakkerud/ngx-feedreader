import { Pipe, PipeTransform } from '@angular/core';

import { stripTags } from '../../core/feed-service/feed-reader'

@Pipe({
    name: 'stripTags'
})
export class StripTagsPipe implements PipeTransform {
    transform(value: string, ...args: any[]): any {
        return stripTags(value);
    }
}