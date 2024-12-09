import { Component, computed, HostListener, inject, input } from '@angular/core';
import { Board, BoardIndex, Cell } from '../board';
import { Game } from '../game';
import { concatMap, delay, from, of } from 'rxjs';
import { NgClass } from '@angular/common';

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
    if (turnFor === undefined) {
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

  @HostListener('click')
  async onClick() {
    this.#reverseManual();
    // this.#reverseAutomatic();
  }

  async #reverseManual() {
    if (this.#game.state() === 'pending' && this.cell().isWaitedToReverse()) {
      this.cell().reverse();
      return;
    }

    const turnFor = this.#game.turnFor();
    if (turnFor === undefined) { return }
    const reversableCells = this.#reversableCells();
    if (reversableCells.length === 0) { return; }
    const pendingRef = this.#game.pending();
    this.cell().put(turnFor);
    this.cell().setHighlight('just-putted');
    await Promise.all(reversableCells.map(c => c.waitToReverse()));
    pendingRef.unlock();
    this.#game.endTurn();
    this.cell().setHighlight('');
  }

  #reverseAutomatic() {
    const turnFor = this.#game.turnFor();
    if (turnFor === undefined) { return }
    const reversableCells = this.#reversableCells();
    if (reversableCells.length === 0) { return; }
    const pendingRef = this.#game.pending();
    this.cell().put(turnFor);
    from(reversableCells).pipe(
      concatMap(c => of(c).pipe(delay(150))),
    ).subscribe({
      next: cell => cell.reverse(),
      complete: () => {
        pendingRef.unlock();
        this.#game.endTurn();
      }
    });

  }
}
