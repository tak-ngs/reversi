import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { Board } from './board';
import { CellComponent } from "./cell/cell.component";
import { Game } from './game';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CellComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'reversi';

  board = inject(Board);
  game = inject(Game);

  dialog = viewChild<ElementRef<HTMLDialogElement>>('cannotPutDialog');
  gameEndDialog = viewChild<ElementRef<HTMLDialogElement>>('gameEndDialog');

  constructor() {
    toObservable(this.game.cannotPut)
      .subscribe(cannotPut => cannotPut ? this.dialog()?.nativeElement.showModal() : undefined)

    toObservable(this.game.stats).pipe(
      filter(s => s.empty === 0),
    )
      .subscribe(end => end ? this.gameEndDialog()?.nativeElement.showModal() : undefined)
  }

}
