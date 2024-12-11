import { computed, effect, Injectable, Signal, signal, WritableSignal } from "@angular/core";

type PickKeysByPropType<T, S> = {
  [k in keyof T]: T[k] extends S ? k : never
}[keyof T];

type WritableSignalPropSet<T> = {
  [k in PickKeysByPropType<T, WritableSignal<unknown>>]: T[k] extends WritableSignal<infer S> ? S : never
};

interface PlayerOptionsIF {
  readonly enablePutHint: WritableSignal<boolean>;
  readonly manualReverse: WritableSignal<boolean>;
  readonly manualReverseHintDelay: WritableSignal<number>;
  readonly putHintDelay: WritableSignal<number>;
}
export class PlayerOptions implements PlayerOptionsIF {

  enablePutHint: WritableSignal<boolean>;
  manualReverse: WritableSignal<boolean>;
  manualReverseHintDelay: WritableSignal<number>;
  putHintDelay: WritableSignal<number>;
  readonly manualReverseHintDelayForCSS = computed(() => `${this.manualReverseHintDelay()}s`);
  readonly putHintDelayForCSS = computed(() => `${this.putHintDelay()}s`);
  constructor(arg?: PlayerOptionsInitial) {
    this.enablePutHint = signal(arg?.enablePutHint ?? true);
    this.manualReverse = signal(arg?.manualReverse ?? true);
    this.manualReverseHintDelay = signal(arg?.manualReverseHintDelay ?? 5);
    this.putHintDelay = signal(arg?.putHintDelay ?? 0);
  }

  readonly optsAsObject = computed<WritableSignalPropSet<PlayerOptionsIF>>(() => ({
    enablePutHint: this.enablePutHint(),
    manualReverse: this.manualReverse(),
    manualReverseHintDelay: this.manualReverseHintDelay(),
    putHintDelay: this.putHintDelay(),
  }))

}
type PlayerOptionsInitial = {
  [K in keyof PlayerOptions]?: PlayerOptions[K] extends Signal<infer PP> ? PP : PlayerOptions[K]
};

@Injectable({ providedIn: 'root' })
export class GameOptions {
  black: PlayerOptions;
  white: PlayerOptions;

  constructor() {
    this.black = new PlayerOptions(JSON.parse(localStorage.getItem('playerConfigBlack') ?? '{}'));
    this.white = new PlayerOptions(JSON.parse(localStorage.getItem('playerConfigWhite') ?? '{}'));

    effect(() => {
      localStorage.setItem('playerConfigBlack', JSON.stringify(this.black.optsAsObject()))
    });
    effect(() => {
      localStorage.setItem('playerConfigWhite', JSON.stringify(this.white.optsAsObject()))
    });
  }
}