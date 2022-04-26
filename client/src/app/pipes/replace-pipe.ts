import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'replace'})
export class ReplacePipe implements PipeTransform {
  transform(value: string, stringToReplace: string, replacementString: string): string {
    if(!value || ! stringToReplace || ! replacementString)
    {
      return value;
    }
    return value.replace(new RegExp(stringToReplace, 'g'), replacementString);
  }
}
