import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'filterTerm'})
export class FilterItemPipe implements PipeTransform {
  transform(term: string): string {
    console.log(term);
    return term;
  }
}
