export interface IColumnConfifuration {
    activeGroupRow: boolean,
    activeSearchRow: boolean,
    activeFilterRow: boolean
}

export type LocalStorageValues = {
    posFixedColumn: number,

    visibleUpperPanel: boolean,

    showGroupRow: boolean,
    showSearchRow: boolean,

    colorGroupRowColumn1: string,
    colorGroupRowColumn2: string,
    colorGroupRowColumn3: string,

    headerColumnsConfifuration: IColumnConfifuration,

    pageXcustomDialog: number,
    pageYcustomDialog: number
}

export type LocalStorageKeys = keyof LocalStorageValues