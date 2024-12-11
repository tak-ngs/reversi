import { Component, ElementRef, inject, viewChild } from '@angular/core';
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

@Component({
  selector: 'app-root',
  imports: [CellComponent,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    PlayerOptionsPageComponent,
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

  constructor() {
    toObservable(this.game.state).subscribe(state => {
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
