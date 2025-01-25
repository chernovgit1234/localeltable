
import {Autofilter} from './autofilter/types'

import {ISearchByColumnMetadata} from '../types/OtherTypes'

export interface RootState {
  visibleUpperPanel: boolean;
  version: string;
  error: string | null;
  message: string | null;
  load: boolean | null;
  selectedColumn: number | null;
  selectedColumnCommonUse: number | null;
  setSelectedColumnHeaderClickLeftBtn: number | null;
  columnSearchMetadata: ISearchByColumnMetadata | null
  fieldNameSearchedColumn: string | null;
  valueSearchedColumn: string;
  summObject: any
  countRow: number
  }

  export type CommonStateType = RootState |  Autofilter 