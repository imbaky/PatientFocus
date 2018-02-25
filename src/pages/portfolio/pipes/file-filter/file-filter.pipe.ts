import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

import { PortfolioType, FileFormatType } from '@enum/file-type.enum';
import {Item} from '@interfaces/item/item';
import {File} from '@interfaces/file/file';

@Pipe({
  name: 'fileFilterByDate'
})
export class FileFilterByDate implements PipeTransform {
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
  name: 'fileFilterByName'
})
export class FileFilterByName implements PipeTransform {
  transform(items: Item[], filterName: string) {
    if (!items) {
      return items;
    }
    return items.filter((item) => {
       return item.title.toLowerCase().includes(filterName.toLowerCase());
    });
  }
}

@Pipe({
  name: 'fileFilterByDocType'
})
export class FileFilterByDocType implements PipeTransform {
  transform(items: Item[], filterDoctype: PortfolioType) {
    if (!filterDoctype || !items) {
      return items;
    }
    return items.filter((item) => {
      return item.document_type === filterDoctype;
    });
  }
}

@Pipe({
  name: 'fileFilterByFormatType'
})
export class FileFilterByFormatType implements PipeTransform {
  transform(items: Item[], format: FileFormatType) {
    if (!format || !items) {
      return items;
    }
    return items.filter((item) => {
      return (item.file as File).format === format;
    });
  }
}
