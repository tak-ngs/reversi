import { Component, computed, HostListener, inject, input } from '@angular/core';
import { Board, BoardIndex, Cell, reverseColor } from '../board';
import { Game } from '../game';
import { concatMap, delay, from, of } from 'rxjs';

@Component({
  selector: 'app-cell',
  imports: [],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss'
})
export class CellComponent {

  readonly cell = input.required<Cell>();
  readonly address = input.required<[
    row: BoardIndex,
    col: BoardIndex
  ]>();

  private reversableCells = computed(() => {
    const turnFor = this.game.turnFor();
    if (turnFor === undefined) {
      return [];
    }
    const [r, c] = this.address();
    return this.board.reversableCells()[turnFor][8 * r + c];
  })

  canPut = computed(() => this.reversableCells().length > 0
    ? `can-put-${this.game.turnFor()}`
    : undefined
  );

  game = inject(Game);
  board = inject(Board);

  @HostListener('click')
  onClick() {
    const turnFor = this.game.turnFor();
    if (turnFor === undefined) { return }
    const reversableCells = this.reversableCells();
    if (reversableCells.length > 0) {
      this.game.state.set('pending');
      this.cell().put(turnFor);
      from(reversableCells).pipe(
        concatMap(c => of(c).pipe(delay(150))),
      ).subscribe({
        next: cell => cell.reverse(),
        complete: () => this.game.state.set(reverseColor[turnFor])
      });
    }
  }
}
