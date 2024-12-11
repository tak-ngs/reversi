import { Component, input } from '@angular/core';
import { PlayerOptions } from '../../game-options';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-player-option-form',
  imports: [
    FormsModule,
    MatListModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './player-option-form.component.html',
  styleUrl: './player-option-form.component.scss'
})
export class PlayerOptionFormComponent {
  options = input.required<PlayerOptions>();
}
