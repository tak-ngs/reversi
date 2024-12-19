import { Component, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { Board } from './board';
import { CellComponent } from "./cell/cell.component";
import { Game } from './game';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { GameOptions } from './game-options';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PlayerOptionsPageComponent } from './options/player-options-page/player-options-page.component';
import { StoneColorPipe } from "./stone-color.pipe";
import { FnPipe } from './fn.pipe';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    NgClass,
    CellComponent,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    PlayerOptionsPageComponent,
    StoneColorPipe,
    FnPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'reversi';

  readonly board = inject(Board);
  readonly game = inject(Game);
  readonly dialog = inject(MatDialog);
  readonly opt = inject(GameOptions);
  cannotPutDialog = viewChild<ElementRef<HTMLDialogElement>>('cannotPutDialog');
  gameEndDialog = viewChild<ElementRef<HTMLDialogElement>>('gameEndDialog');
  cellViews = viewChildren<CellComponent, ElementRef<HTMLElement>>(CellComponent, { read: ElementRef });

  dot: { [k: number]: string | undefined } = {
    9: 'bottom right',
    14: 'bottom left',
    49: 'top right',
    54: 'top left',
  }
  constructor() {
    toObservable(this.game.state).subscribe(async state => {
      switch (state) {
        case 'endByFilled':
        case 'endByCannotPut':
          await sleep(1500);
          await this.#order();
          this.gameEndDialog()?.nativeElement.showModal();
          break;
        case 'waitToPass':
          this.cannotPutDialog()?.nativeElement.showModal();
          break;
        default:
          break;
      }
    });
  }

  address = (i: number): [number, number] => {
    return [Math.trunc(i / 8), i % 8];
  }
  async #order() {
    for (let i = 0; i < 64; i++) {
      const cell = this.board.cells[i]();
      if (cell === 'black') { continue; }
      if (cell === 'empty') {
        // 最も遠くの黒をここにおく
        const farthestBlackIdx = i + this.board.cells.slice(i).findLastIndex(c => c() === 'black');
        farthestBlackIdx > i && await this.#swapCells(i, farthestBlackIdx);
      }
      if (cell === 'white') {
        // 最も遠くの 白以外に これ(白)を置く
        const farthestNonWhiteIdx = i + this.board.cells.slice(i).findLastIndex(c => c() === 'empty' || c() === 'black');
        farthestNonWhiteIdx > i && await this.#swapCells(i, farthestNonWhiteIdx);
        // 最も遠くの黒をここに置く
        const farthestBlackIdx = i + this.board.cells.slice(i).findLastIndex(c => c() === 'black');
        farthestBlackIdx > i && await this.#swapCells(i, farthestBlackIdx);
      }
    }
  }

  async #swapCells(aIdx: number, bIdx: number) {
    if (aIdx === bIdx) { return; }
    const a = this.cellViews()[aIdx].nativeElement.querySelector<HTMLElement>('.stone-wrapper')!;
    const b = this.cellViews()[bIdx].nativeElement.querySelector<HTMLElement>('.stone-wrapper')!;

    const posA = a.getBoundingClientRect();
    const posB = b.getBoundingClientRect();
    const stoneA = a.querySelector<HTMLElement>('.stone');
    const stoneB = b.querySelector<HTMLElement>('.stone');
    const colorA = this.board.cells[aIdx]();
    const colorB = this.board.cells[bIdx]();
    const transDuration = 150;

    a.parentElement!.style.zIndex = '3';
    a.style.zIndex = '4';
    a.style.transition = `transform ${transDuration}ms ease-in-out`;
    a.style.transform = `translate(${posB.x - posA.x}px,${posB.y - posA.y}px)` // b - a
    b.parentElement!.style.zIndex = '3';
    b.style.zIndex = '4';
    b.style.transition = `transform ${transDuration}ms ease-in-out`;
    b.style.transform = `translate(${posA.x - posB.x}px,${posA.y - posB.y}px)` // a - b

    await sleep(transDuration);
    a.parentElement!.style.zIndex = '';
    a.style.transition = 'unset';
    b.parentElement!.style.zIndex = '';
    b.style.transition = 'unset';
    await sleep(50);
    a.style.transform = ''
    b.style.transform = ''

    this.board.cells[aIdx].set(colorB);
    this.board.cells[bIdx].set(colorA);
    await sleep(50);
    stoneA && (stoneA.style.transition = '');
    stoneB && (stoneB.style.transition = '');
  }

}

const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));
