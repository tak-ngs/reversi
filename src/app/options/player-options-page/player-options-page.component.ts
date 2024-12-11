import { Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { PlayerOptionFormComponent } from '../player-option-form/player-option-form.component';
import { GameOptions } from '../../game-options';

@Component({
  selector: 'app-player-options-page',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    PlayerOptionFormComponent,
  ],
  templateUrl: './player-options-page.component.html',
  styleUrl: './player-options-page.component.scss'
})
export class PlayerOptionsPageComponent {
  close = output();
  opt = inject(GameOptions);

}
