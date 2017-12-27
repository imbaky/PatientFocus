import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'addSpace'
})
export class FilterFileName implements PipeTransform {
  transform(fileName: string): string {
    console.log(fileName);
    return fileName.replace('%20', ' ');
  }

}
