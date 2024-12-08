import { computed, inject, Injectable, signal } from "@angular/core";
import { Board, reverseColor } from "./board";


export type GameState = 'black' | 'white' | 'end' | 'pending'
@Injectable({ providedIn: 'root' })
export class Game {
    board = inject(Board);

    state = signal<GameState>('black');
    turnFor = computed(() => {
        return {
            'black': 'black' as const,
            'white': 'white' as const,
            'end': undefined,
            'pending': undefined,
        }[this.state()];
    });

    cannotPut = computed(() => {
        const turnFor = this.turnFor();
        if (turnFor === undefined) {
            return undefined;
        }
        return this.stats().empty > 0 &&
            this.board.reversableCells()[turnFor].every(cells => cells.length === 0)
    })
    stats = computed(() => {
        const black = this.board.cells.filter(c => c.state() === 'black').length;
        const white = this.board.cells.filter(c => c.state() === 'white').length;
        return {
            black,
            white,
            empty: this.board.cells.filter(c => c.state() === 'empty').length,
            advantage: black > white ? 'black'
                : white > black ? 'white'
                    : '-'
        };
    });
    pass() {
        const turnFor = this.turnFor()
        if (turnFor === undefined) { return; }
        this.state.set(reverseColor[turnFor]);
    }

    newGame() {
        this.board.cells.forEach(c => c.state.set('empty'));
        this.board.getCell(3, 3).state.set('black');
        this.board.getCell(3, 4).state.set('white');
        this.board.getCell(4, 3).state.set('white');
        this.board.getCell(4, 4).state.set('black');
        this.state.set('black');

    }

}
