import { computed, inject, Injectable, Signal, signal } from "@angular/core";
import { Board, reverseColor } from "./board";


export type GameState = 'waitToPut' | 'waitToRev' | 'waitToPass' | 'endByFilled' | 'endByCannotPut'

@Injectable({ providedIn: 'root' })
export class Game {
    readonly board = inject(Board);

    #state = signal<GameState>('waitToPut');
    readonly state: Signal<GameState> = this.#state;
    readonly #turnFor = signal<'black' | 'white'>('black');
    readonly turnFor = this.#turnFor.asReadonly();

    /**
     * @deprecated
     */
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
            advantage: black > white ? 'くろ'
                : white > black ? 'しろ'
                    : '-'
        };
    });

    newGame() {
        this.board.reset();
        this.#state.set('waitToPut');
        this.#turnFor.set('black');
    }

    endTurn() {
        const turnFor = this.turnFor();
        this.#turnFor.set(reverseColor[turnFor]);

        // 全部埋まった
        if (this.board.cells.filter(cell => cell() === 'empty').length === 0) {
            this.#state.set('endByFilled');
            return;
        }
        // 両者共おけない
        if (
            this.board.reversableCells().black.every(cells => cells.length === 0) &&
            this.board.reversableCells().white.every(cells => cells.length === 0)
        ) {
            this.#state.set('endByCannotPut');
            return;
        }
        // 相手はおけない
        if (this.board.reversableCells()[reverseColor[turnFor]].every(cells => cells.length === 0)) {
            this.#state.set('waitToPass');
            return;
        }
        // 相手おける
        this.#state.set('waitToPut');
    }

    pass() {
        const turnFor = this.turnFor()
        this.#turnFor.set(reverseColor[turnFor]);
        this.#state.set('waitToPut');
    }

    waitToReverse() {
        this.#state.set('waitToRev');
    }

}
