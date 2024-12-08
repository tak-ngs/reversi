import { computed, inject, Injectable, Signal, signal } from "@angular/core";
import { Board, reverseColor } from "./board";


export type GameState = 'black' | 'white' | 'end' | 'pending'

@Injectable({ providedIn: 'root' })
export class Game {
    readonly board = inject(Board);

    #state = signal<GameState>('black');
    readonly state: Signal<GameState> = this.#state;
    readonly turnFor = computed(() => {
        return {
            'black': 'black' as const,
            'white': 'white' as const,
            'end': undefined,
            'pending': undefined,
        }[this.#state()];
    });

    readonly cannotPut = computed(() => {
        const turnFor = this.turnFor();
        if (turnFor === undefined) {
            return undefined;
        }
        return this.stats().empty > 0 &&
            this.board.reversableCells()[turnFor].every(cells => cells.length === 0)
    })
    readonly stats = computed(() => {
        const black = this.board.cells.filter(cell => cell() === 'black').length;
        const white = this.board.cells.filter(cell => cell() === 'white').length;
        return {
            black,
            white,
            empty: this.board.cells.filter(cell => cell() === 'empty').length,
            advantage: black > white ? 'black'
                : white > black ? 'white'
                    : '-'
        };
    });

    newGame() {
        this.board.reset();
        this.#state.set('black');
    }

    endTurn() {
        const turnFor = this.turnFor()
        if (turnFor === undefined) { return; }
        this.#state.set(reverseColor[turnFor]);
    }

    pass() {
        const turnFor = this.turnFor()
        if (turnFor === undefined) { return; }
        this.#state.set(reverseColor[turnFor]);
    }

    pending(): { unlock: () => void } {
        const originalState = this.state();
        this.#state.set('pending');
        return {
            unlock: () => {
                this.#state.set(originalState);
            }
        }
    }

}
