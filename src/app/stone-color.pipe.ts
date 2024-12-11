import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stoneColor'
})
export class StoneColorPipe implements PipeTransform {

  transform(value: 'black' | 'white',): string {
    return { black: 'くろ', white: 'しろ' }[value];
  }

}
