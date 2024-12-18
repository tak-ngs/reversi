import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fn'
})
export class FnPipe implements PipeTransform {

  transform<F extends (...args: any) => any>(
    v: Parameters<F>[0],
    fn: F,
    ...args: Parameters<F> extends [unknown, ...infer R] ? R : never
  ): ReturnType<F> {
    return fn(v, ...args);
  }

}
