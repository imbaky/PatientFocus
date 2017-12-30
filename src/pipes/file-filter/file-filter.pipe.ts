import { Pipe, PipeTransform } from '@angular/core';
import { ItemType } from '../../core/data/enum/item-type.enum';

import { Item } from '../../core/data/services/item/item.service';

@Pipe({
  name: 'fileFilter'
})
export class FileFilter implements PipeTransform {
  transform(items: Item[], filterFunc: Function, term: any): any {

    if (!term || !items) {
      return items;
    }

    return items.filter((item) => item.type === ItemType.FILE && filterFunc(item, term));
  }
}
