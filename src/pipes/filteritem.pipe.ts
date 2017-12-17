import { Pipe, PipeTransform } from '@angular/core';
import { ItemType } from '../core/data/enum/item-type.enum';

@Pipe({name: 'filterItem'})
export class FilterItemPipe implements PipeTransform {
  transform(documents: any, term: string): any {
    const filteredDocuments = [];
    if (!term) {
      return documents;
    }
    for (const i in documents) {
      // look at files only
      if (documents[i].type === ItemType.FILE) {
        // look in name and file type
        if ((documents[i].name.toLowerCase().includes(term.toLowerCase())) ||
            (documents[i].value.type.toLowerCase().includes(term.toLowerCase()))) {
          filteredDocuments.push(documents[i]);
        }

      }
    }
    return filteredDocuments;
  }
}
