import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

import { Item } from '@interfaces/item/item';

@Pipe({
    name: 'diaryFilterByDate'
})
export class DiaryFilterByDate implements PipeTransform {
    transform(items: Item[], dateFromTerm: string, dateToTerm: string) {
        if (!items) {
            return items;
        }
        return items.filter((item) => {
            // need to specify granularity because chosen_date has a precision of miliseconds, so the granularity needs to be
            // reduced to days
            const isBetween = (moment(item.chosen_date).isBetween(dateFromTerm, dateToTerm, 'day', '[]'));
            return isBetween;
        });
    }
}

@Pipe({
    name: 'diaryFilterByTerm'
})
export class DiaryFilterByTerm implements PipeTransform {
    transform(items: Item[], terms: string) {
        if (!items) {
            return items;
        }
        let arrayTerms = terms.split(' ');
        // remove empty strings from array
        arrayTerms = arrayTerms.filter(function(x) {
            return (x !== (undefined || null || ''));
        });
        return items.filter((item) => {
            // for every term in arrayTerms we want to see if it is in description
            return _multiSearchOr(item.description, arrayTerms) || _multiSearchOr(item.title, arrayTerms);
        });
    }
}

/*
 * Do an OR search from array(searchWords) over text
 */
function _multiSearchOr(text, searchWords) {
    const searchExp = new RegExp(searchWords.join('|'), 'gi');
    return (searchExp.test(text)) ? true : false;
}
