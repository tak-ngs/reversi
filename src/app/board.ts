import { computed, Injectable, signal } from "@angular/core";


type FixedLengthArray<T, N extends number, A extends any[] = []> = A extends { length: N }
    ? A
    : FixedLengthArray<T, N, [...A, T]>

export type CellState = 'empty' | 'black' | 'white';
export type Row = FixedLengthArray<Cell, 8>;
export type RowCol = FixedLengthArray<Row, 8>

export type BoardIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export class Cell {
    state = signal<CellState>('empty');
    put(s: 'black' | 'white') {
        this.state.set(s);
    }
    reverse() {
        const s = this.state();
        if (s === 'empty') {
            return;
        }
        this.state.set(reverseColor[s])
    }
}

export const reverseColor = {
    black: 'white',
    white: 'black',
} as const;

export function isBoardIndex(i: number): i is BoardIndex {
    return i >= 0 && i < 8;
}

function reversableCells(cells: Cell[], forC: 'black' | 'white'): Cell[] {
    const firstFriendIdx = cells.findIndex(c => c.state() === forC);
    if (firstFriendIdx > 0) {
        const candidates = cells.slice(0, firstFriendIdx);
        return candidates.every(c => c.state() === reverseColor[forC])
            ? candidates
            : [];
    }
    return [];
}

@Injectable({ providedIn: 'root' })
export class Board {

    readonly cells = Array(64).fill(0).map(_ => new Cell());
    readonly rows: RowCol = Array(8).fill(0)
        .map((_, i) => this.cells.slice(i * 8, i * 8 + 8) as Row) as RowCol;
    readonly aroundsCells = Array(64).fill(0).map((_, i) => {
        const r = (i / 8 | 0) as BoardIndex;
        const c = (i % 8) as BoardIndex;
        return this.getCellsAround(r, c);
    });
    reversableCells = computed(() => ({
        black: this.aroundsCells.map((ac, i) => {
            return this.cells[i].state() === 'empty'
                ? ac.reduce((acc, cells) => acc.concat(reversableCells(cells, 'black')), [])
                : [];
        }),
        white: this.aroundsCells.map((ac, i) => {
            return this.cells[i].state() === 'empty'
                ? ac.reduce((acc, cells) => acc.concat(reversableCells(cells, 'white')), [])
                : [];
        }),
    }))

    constructor() {
        this.getCell(3, 3).put('black');
        this.getCell(3, 4).put('white');
        this.getCell(4, 3).put('white');
        this.getCell(4, 4).put('black');
    }

    getCell(r: BoardIndex, c: BoardIndex): Cell {
        return this.cells[8 * r + c];
    }

    getCellsAround(r: BoardIndex, c: BoardIndex): [
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
            getCellsFor(r, c, (rr, cc) => [rr - 1, cc]).map(([r, c]) => this.getCell(r, c)),
            getCellsFor(r, c, (rr, cc) => [rr, cc + 1]).map(([r, c]) => this.getCell(r, c)),
            getCellsFor(r, c, (rr, cc) => [rr + 1, cc]).map(([r, c]) => this.getCell(r, c)),
            getCellsFor(r, c, (rr, cc) => [rr, cc - 1]).map(([r, c]) => this.getCell(r, c)),
            getCellsFor(r, c, (rr, cc) => [rr - 1, cc + 1]).map(([r, c]) => this.getCell(r, c)),
            getCellsFor(r, c, (rr, cc) => [rr + 1, cc + 1]).map(([r, c]) => this.getCell(r, c)),
            getCellsFor(r, c, (rr, cc) => [rr + 1, cc - 1]).map(([r, c]) => this.getCell(r, c)),
            getCellsFor(r, c, (rr, cc) => [rr - 1, cc - 1]).map(([r, c]) => this.getCell(r, c)),
        ]
    }

}

function getCellsFor(
    r: BoardIndex, c: BoardIndex,
    direction: (r: BoardIndex, c: BoardIndex) => [r: number, c: number]
): [r: BoardIndex, c: BoardIndex][] {
    const [rr, cc] = direction(r, c);
    if (isBoardIndex(rr) && isBoardIndex(cc)) {
        return [[rr, cc],
        ...getCellsFor(rr, cc, direction)
        ];
    }
    return []
}

