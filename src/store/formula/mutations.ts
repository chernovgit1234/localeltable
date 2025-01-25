import { MutationTree } from 'vuex';
import {  ConfigData, IHighlightedDataByColumn, IHighlightedDataByRow, ISelectedData } from './types';
import {fieldsInfoMap} from '../../helpers/ColumnsHelper'
import { IUserFormula } from '@/helpers/HSFormula/Types';
import { EnumColumnTableNumber } from '@/enums/EnumColumnValues';
import {generateArrayBetweenMinMax} from '@/helpers/CommonMethods'

let previosSelectedRowsLength = 0

export const mutations: MutationTree<ConfigData> = {
  
  CLEAR_SELECTED_ROWS_RANGE(state: ConfigData) {
    state.selectedRowsRange = []
  },
  SET_SELECTED_ROWS(state: ConfigData, selectedRows: number[]) {
    //console.log('MuT selectedRows', selectedRows)
    function returnUniqueElements(range: number[]): number[]  {
      const arr: number[] = []
    
      range.forEach((el: number) => {
        if (!state.selectedRowsRange.some((elem: number)=> elem === el) ) {
          arr.push(el)
        }
      })

      return arr
    }
    
    setTimeout(() => {
      const row = state.rangeHighlightedMetaData.row
      const height = state.rangeHighlightedMetaData.selectionHeight
      const selectedRow = state.rangeSelectedMetaData.row

      const lastRow = selectedRows[selectedRows.length - 1]
    
      if (previosSelectedRowsLength ===0 && selectedRows.length === 1 || previosSelectedRowsLength > selectedRows.length && selectedRows.length === 1) {
        //когда старое значение 0 и выделенных строк 1 ИЛИ когда после нескольких выделений был выбран один 
        if (row === selectedRow && height > 1) {
          //вверх
          const range = generateArrayBetweenMinMax(lastRow - height, lastRow )
          const newrange = returnUniqueElements(range)
          state.selectedRowsRange.push(...newrange)
        } else if (row > selectedRow) {
          //вниз
          const range = generateArrayBetweenMinMax(lastRow, row)
          const newrange = returnUniqueElements(range)
          state.selectedRowsRange.push(...newrange)
        } else if (row === selectedRow && height === 1) {
          //один
          state.selectedRowsRange = []
          state.selectedRowsRange.push(lastRow)
        }
      } else if (previosSelectedRowsLength === 1 &&  selectedRows.length === 1) {

        state.selectedRowsRange = []
        if (row === selectedRow && height > 1) {
          //вверх
          const range = generateArrayBetweenMinMax(lastRow - height+1, lastRow )
          const newrange = returnUniqueElements(range)
          state.selectedRowsRange.push(...newrange)
        } else if (row > selectedRow) {
          //вниз
          const range = generateArrayBetweenMinMax(lastRow, row)
          const newrange = returnUniqueElements(range)
          state.selectedRowsRange.push(...newrange)
        } else if (row === selectedRow && height === 1) {
          //один
          state.selectedRowsRange = []
          state.selectedRowsRange.push(lastRow)
        }
      } else if (previosSelectedRowsLength <= selectedRows.length && selectedRows.length > 1) {
        //нажато выделение на клаве
        if (row === selectedRow && height > 1) {
          //вверх
          const range = generateArrayBetweenMinMax(lastRow - height+1, lastRow )
          const newrange = returnUniqueElements(range)
          state.selectedRowsRange.push(...newrange)
        } else if (row > selectedRow) {
          //вниз
          const range = generateArrayBetweenMinMax(lastRow, row)
          const newrange = returnUniqueElements(range)
          state.selectedRowsRange.push(...newrange)
        } else if (row === selectedRow && height === 1) {
          //один
          state.selectedRowsRange.push(lastRow)
        }
      }

      previosSelectedRowsLength = selectedRows.length
    });
    
  },
  SET_HIGHLIGHTED_DATA_BY_COLUMN(state: ConfigData, metadata: IHighlightedDataByColumn) {
    state.rangeHighlightedMetaData.column = metadata.column
    state.rangeHighlightedMetaData.selectionWidth = metadata.selectionWidth
  },

  SET_HIGHLIGHTED_DATA_BY_ROW(state: ConfigData, metadata: IHighlightedDataByRow) {
    state.rangeHighlightedMetaData.row = metadata.row
    state.rangeHighlightedMetaData.selectionHeight = metadata.selectionHeight
  },
  SET_SELECTED_DATA(state: ConfigData, metadata: ISelectedData) {
    //currentSelectedCell
    state.rangeSelectedMetaData.row = metadata.row
    state.rangeSelectedMetaData.column = metadata.column

    //текущая ячейка
    if ((metadata.row >= 0 && metadata.row !== undefined) && (metadata.column > 0 && metadata.column !== undefined)) {
      const nameColumn = fieldsInfoMap.get(metadata.column)?.columnName
      state.currentSelectedCell =  String(`${nameColumn}${metadata.row + 1}`).split(' ').join('') 
    }
  },
  SET_FAKE_CURRENT_FORMULA(state: ConfigData, newFakeCurrentFormula: IUserFormula) {
    state.fakeCurrentFormula = newFakeCurrentFormula
  },
  CLEAR_FAKE_CURRENT_FORMULA(state: ConfigData) {
    state.fakeCurrentFormula = null
  },
  SET_FORMULA_OBJECT(state: ConfigData, formulaObject: {key: number, value: IUserFormula}) {
    state.formulasList.set(formulaObject.key, formulaObject.value)
  },
  DELETE_FORMULA_OBJECT(state: ConfigData, selectedColumn: EnumColumnTableNumber) {
    console.log('DELETE_FORMULA_OBJECT', selectedColumn)
    state.formulasList.delete(selectedColumn)
  }
};