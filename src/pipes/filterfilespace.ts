import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addSpace'
})
export class FilterFileName implements PipeTransform {

  transform(fileName: string): string {
    return fileName.replace('%20', ' ');
  }

}
