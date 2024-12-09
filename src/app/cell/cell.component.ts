import { Component, computed, HostListener, inject, input } from '@angular/core';
import { Board, BoardIndex, Cell } from '../board';
import { Game } from '../game';
import { concatMap, delay, from, of } from 'rxjs';
import { NgClass } from '@angular/common';
import { GameOptions } from '../game-options';

const blackDotMap: { [k: string]: string | undefined } = {
  '[1,1]': 'bottom right',
  '[1,6]': 'bottom left',
  '[6,1]': 'top right',
  '[6,6]': 'top left',
}
@Component({
  selector: 'app-cell',
  imports: [NgClass],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss'
})
export class CellComponent {

  readonly cell = input.required<Cell>();
  readonly address = input.required<[
    row: BoardIndex,
    col: BoardIndex
  ]>();

  blackdot = computed(() => {
    return blackDotMap[JSON.stringify(this.address())];
  });

  #reversableCells = computed(() => {
    const turnFor = this.#game.turnFor();
    if (this.#game.state() !== 'waitToPut') {
      return [];
    }
    const [r, c] = this.address();
    return this.#board.reversableCells()[turnFor][8 * r + c];
  })

  canPut = computed(() => this.#reversableCells().length > 0
    ? this.#game.turnFor()
    : undefined
  );

  #game = inject(Game);
  #board = inject(Board);
  #opt = inject(GameOptions);

  #onClickFn = computed(() => {
    return this.#opt[this.#game.turnFor()].manualReverse()
      ? this.#reverseManual
      : this.#reverseAutomatic
  });
  @HostListener('click')
  async onClick() {
    this.#onClickFn()();
  }

  #reverseManual = async () => {
    if (this.#game.state() === 'waitToRev' && this.cell().isWaitedToReverse()) {
      this.cell().reverse();
      return;
    }

    const reversableCells = this.#reversableCells();
    if (reversableCells.length === 0) { return; }

    this.cell().put(this.#game.turnFor());
    this.#game.waitToReverse();
    this.cell().setHighlight('just-putted');
    await Promise.all(reversableCells.map(c => c.waitToReverse()));
    this.#game.endTurn();
    this.cell().setHighlight('');
  }

  #reverseAutomatic = () => {
    if (this.#game.state() !== 'waitToPut') { return; }

    const reversableCells = this.#reversableCells();
    if (reversableCells.length === 0) { return; }

    this.cell().put(this.#game.turnFor());
    this.#game.waitToReverse();
    from(reversableCells).pipe(
      concatMap(c => of(c).pipe(delay(150))),
    ).subscribe({
      next: cell => cell.reverse(),
      complete: () => {
        this.#game.endTurn();
      }
    });

  }
}
