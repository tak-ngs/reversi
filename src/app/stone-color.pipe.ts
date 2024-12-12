import { Pipe, PipeTransform } from '@angular/core';
import { StoneColor } from './board';

@Pipe({
  name: 'stoneColor'
})
export class StoneColorPipe implements PipeTransform {

  transform(value: StoneColor): string {
    return { black: 'くろ', white: 'しろ' }[value];
  }

}
