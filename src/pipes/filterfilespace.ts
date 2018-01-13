import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addSpace'
})
export class FilterFileName implements PipeTransform {

  transform(fileName: string): string {
    // On empty database there are no files
    // TODO: revisit this
    if (!fileName) {
      return 'Name not defined';
    }
    return fileName.replace('%20', ' ');
  }

}
