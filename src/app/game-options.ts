import { Injectable, Signal, signal } from "@angular/core";

export class PlayerOptions {

  readonly enablePutHint = signal(true);
  readonly manualReverse = signal(true);
  readonly manualReverseHintDelay = signal(6);
  readonly putHintDelay = signal(0);

}
type PlayerOptionsInitial = {
  [K in keyof PlayerOptions]?: PlayerOptions[K] extends Signal<infer PP> ? PP : PlayerOptions[K]
};

@Injectable({ providedIn: 'root' })
export class GameOptions {
  black: PlayerOptions;
  white: PlayerOptions;

  constructor() {
    this.black = new PlayerOptions();
    this.white = new PlayerOptions();
  }
}