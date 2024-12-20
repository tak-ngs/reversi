import { computed, Injectable, Signal, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { first, firstValueFrom, share, tap } from "rxjs";


type FixedLengthArray<T, N extends number, A extends any[] = []> = A extends { length: N }
    ? A
    : FixedLengthArray<T, N, [...A, T]>

export type StoneColor = 'black' | 'white';
export type CellState = 'empty' | StoneColor;
export type Row = FixedLengthArray<Cell, 8> & readonly Cell[];
export type RowCol = FixedLengthArray<Row, 8> & readonly Row[];

export type BoardIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Cell = Signal<CellState> & {
    asReadonly: () => Signal<CellState>;
    isWaitedToReverse: Signal<boolean>;
    waitToReverse: () => Promise<unknown>;
    put: (s: StoneColor) => void;
    reverse: () => void;
    highlight: Signal<string>;
    setHighlight: (str: string) => void;
}
type CellForBoard = Cell & {
    reset: () => void;
    set: (state: CellState) => void
}
function cell(): CellForBoard {
    const state = signal<CellState>('empty');
    const isWaitedToReverse = signal(false);
    const state$ = toObservable(state).pipe(share());
    const highlight = signal('');
    return Object.assign(state.asReadonly(), {
        isWaitedToReverse: isWaitedToReverse.asReadonly(),
        highlight: highlight.asReadonly(),
        put: (s: StoneColor) => {
            if (state() !== 'empty') {
                return;
            }
            state.set(s);
        },
        reverse: () => {
            const s = state();
            if (s === 'empty') {
                return;
            }
            isWaitedToReverse.set(false);
            state.set(reverseColor[s]);
        },
        reset: () => {
            isWaitedToReverse.set(false);
            state.set('empty');
        },
        set: (s: CellState) => {
            state.set(s);
        },
        waitToReverse: () => {
            const s = state();
            if (s === 'empty') { return Promise.reject(); }

            isWaitedToReverse.set(true);
            state()
            return firstValueFrom(state$.pipe(
                first(v => v === reverseColor[s])),
            )
        },
        setHighlight: (str: string) => highlight.set(str),
        asReadonly: state.asReadonly,
    })
}

export const reverseColor = {
    black: 'white',
    white: 'black',
} as const;

export function isBoardIndex(i: number): i is BoardIndex {
    return i >= 0 && i < 8;
}

function reversableCells(cells: Cell[], forC: StoneColor): Cell[] {
    const firstFriendIdx = cells.findIndex(cell => cell() === forC);
    if (firstFriendIdx > 0) {
        const candidates = cells.slice(0, firstFriendIdx);
        return candidates.every(cell => cell() === reverseColor[forC])
            ? candidates
            : [];
    }
    return [];
}

@Injectable({ providedIn: 'root' })
export class Board {

    readonly cells: readonly CellForBoard[] = Array(64).fill(0).map(_ => cell());
    readonly rows: RowCol = Array(8).fill(0)
        .map((_, i) => (this.cells as readonly Cell[]).slice(i * 8, i * 8 + 8)) as RowCol;
    readonly aroundsCells = Array(64).fill(0).map((_, i) => {
        const r = (i / 8 | 0) as BoardIndex;
        const c = (i % 8) as BoardIndex;
        return this.#getCellsAround(r, c);
    });
    readonly reversableCells = computed(() => ({
        black: this.aroundsCells.map((ac, i) => {
            return this.cells[i]() === 'empty'
                ? ac.reduce((acc, cells) => acc.concat(reversableCells(cells, 'black')), [])
                : [];
        }),
        white: this.aroundsCells.map((ac, i) => {
            return this.cells[i]() === 'empty'
                ? ac.reduce((acc, cells) => acc.concat(reversableCells(cells, 'white')), [])
                : [];
        }),
    }))

    constructor() {
        this.reset();
    }

    reset() {
        this.cells.map(c => c.reset());
        this.#getCell(3, 3).put('white');
        this.#getCell(3, 4).put('black');
        this.#getCell(4, 3).put('black');
        this.#getCell(4, 4).put('white');
    }

    #getCell(r: BoardIndex, c: BoardIndex): Cell {
        return this.cells[8 * r + c];
    }

    #getCellsAround(r: BoardIndex, c: BoardIndex): [
        top: Cell[],
        right: Cell[],
        bottom: Cell[],
        left: Cell[],
        topRight: Cell[],
        bottomRight: Cell[],
        bottomLeft: Cell[],
        topLeft: Cell[],
    ] {
        return [
            getAdjoiningCellIndexes(r, c, (rr, cc) => [rr - 1, cc]).map(([r, c]) => this.#getCell(r, c)),
            getAdjoiningCellIndexes(r, c, (rr, cc) => [rr, cc + 1]).map(([r, c]) => this.#getCell(r, c)),
            getAdjoiningCellIndexes(r, c, (rr, cc) => [rr + 1, cc]).map(([r, c]) => this.#getCell(r, c)),
            getAdjoiningCellIndexes(r, c, (rr, cc) => [rr, cc - 1]).map(([r, c]) => this.#getCell(r, c)),
            getAdjoiningCellIndexes(r, c, (rr, cc) => [rr - 1, cc + 1]).map(([r, c]) => this.#getCell(r, c)),
            getAdjoiningCellIndexes(r, c, (rr, cc) => [rr + 1, cc + 1]).map(([r, c]) => this.#getCell(r, c)),
            getAdjoiningCellIndexes(r, c, (rr, cc) => [rr + 1, cc - 1]).map(([r, c]) => this.#getCell(r, c)),
            getAdjoiningCellIndexes(r, c, (rr, cc) => [rr - 1, cc - 1]).map(([r, c]) => this.#getCell(r, c)),
        ]
    }

}

function getAdjoiningCellIndexes(
    r: BoardIndex, c: BoardIndex,
    direction: (r: BoardIndex, c: BoardIndex) => [r: number, c: number]
): [r: BoardIndex, c: BoardIndex][] {
    const [rr, cc] = direction(r, c);
    if (isBoardIndex(rr) && isBoardIndex(cc)) {
        return [[rr, cc],
        ...getAdjoiningCellIndexes(rr, cc, direction)
        ];
    }
    return []
}

