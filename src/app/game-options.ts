import { computed, Injectable, Signal, signal } from "@angular/core";

export class PlayerOptions {

  readonly enablePutHint = signal(true);
  readonly manualReverse = signal(true);
  readonly manualReverseHintDelay = signal(5);
  readonly putHintDelay = signal(0);

  readonly manualReverseHintDelayForCSS = computed(() => `${this.manualReverseHintDelay()}s`);
  readonly putHintDelayForCSS = computed(() => `${this.putHintDelay()}s`);
  constructor(arg?: PlayerOptionsInitial) {
    this.enablePutHint = signal(arg?.enablePutHint ?? true);
    this.manualReverse = signal(arg?.manualReverse ?? true);
    this.manualReverseHintDelay = signal(arg?.manualReverseHintDelay ?? 5);
    this.putHintDelay = signal(arg?.putHintDelay ?? 0);
  }

}
type PlayerOptionsInitial = {
  [K in keyof PlayerOptions]?: PlayerOptions[K] extends Signal<infer PP> ? PP : PlayerOptions[K]
};

@Injectable({ providedIn: 'root' })
export class GameOptions {
  black: PlayerOptions;
  white: PlayerOptions;

  constructor() {
    this.black = new PlayerOptions({ manualReverse: false });
    this.white = new PlayerOptions();
  }
}