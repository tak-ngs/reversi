import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { Board } from './board';
import { CellComponent } from "./cell/cell.component";
import { Game } from './game';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [CellComponent,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'reversi';

  board = inject(Board);
  game = inject(Game);

  cannotPutDialog = viewChild<ElementRef<HTMLDialogElement>>('cannotPutDialog');
  gameEndDialog = viewChild<ElementRef<HTMLDialogElement>>('gameEndDialog');

  constructor() {
    toObservable(this.game.state).pipe(

    ).subscribe(state => {
      console.log(state);

      switch (state) {
        case 'endByFilled':
        case 'endByCannotPut':
          this.gameEndDialog()?.nativeElement.showModal()
          break;
        case 'waitToPass':
          this.cannotPutDialog()?.nativeElement.showModal();
          break;
        default:
          break;
      }
    });
  }

}
