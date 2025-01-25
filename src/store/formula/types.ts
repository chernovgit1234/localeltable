
import {IUserFormula} from '../../helpers/HSFormula/Types'
import { EnumColumnTableNumber} from '../../enums/EnumColumnValues'

export interface ConfigData {
  rangeHighlightedMetaData: IHighlightedMetaData,
  rangeSelectedMetaData: ISelectedData,
  currentSelectedCell: string,
  formulasList: Map<EnumColumnTableNumber, IUserFormula>,
  fakeCurrentFormula: IUserFormula | null,
  selectedRowsRange: any[]
}

export interface IHighlightedMetaData {
  row: number,
  selectionHeight: number,
  column: number,
  selectionWidth: number
}

export interface IHighlightedDataByColumn {
  column: number,
  selectionWidth: number
}
export interface IHighlightedDataByRow {
  row: number,
  selectionHeight: number
}

export interface ISelectedData {
  row: number,
  column: number
}