import { GetterTree } from 'vuex';
import { ConfigData } from './types';
import { RootState } from '../types';
import {fieldsInfoMap} from '../../helpers/ColumnsHelper'
import {instance, getData} from '../../helpers/InstanceHelper'
import {EnumColumnTableNumber, EnumFieldName} from '../../enums/EnumColumnValues'
import {IUserFormula} from '../../helpers/HSFormula/Types'
import { EnumTypeField } from '@/enums/EnumsByFilter';

function getColumnNameByColumnNumber(column: number): string {
  let columnLocal: number
  //защита. если выбранная колонка левее Name, то берется по Name
  if (column < EnumColumnTableNumber.Name) {
    columnLocal = EnumColumnTableNumber.Name
  } else {
    columnLocal = column
  }
  return fieldsInfoMap.get(columnLocal)?.columnName as string
}

export const getters: GetterTree<ConfigData, RootState> = {
  typeColumnByColumnNumber: s => (column: number) => fieldsInfoMap.get(column)?.fieldType,
  selectedRowsRange:s=> s.selectedRowsRange as number[],
  dependsByField: s => (fileldName: EnumFieldName): string[] => {
    
    const arr = Array.from(s.formulasList.values()).map((formula: IUserFormula) => {
      if (~formula.depends.indexOf(fileldName as EnumFieldName)) {
        return formula.fieldName
      }
    }).filter(e=>e) as string[]

    /* console.log('getter--formulasList', s.formulasList)
    console.log('getter--fileldName', fileldName)
    console.log('getter--arr return', arr) */

    return arr 
  },
  isHaveFormulaObjectByColumn: s=> (column: number): boolean => {
    const formulaObject = s.formulasList.get(column)
    return formulaObject ? true : false
  },
  formulaObjectByColumn: s=> (column: number): IUserFormula | undefined => s.formulasList.get(column),
  /* formulaTextByColumn: s=> (column: number): any => {
    const formulaObject = s.formulasList.get(column)

    return formulaObject ? formulaObject.formulaText : ''
  }, */
  formulasList: s=> s.formulasList,
  dataByHighlightedRangeCells: state => {
    const row = state.rangeHighlightedMetaData.row
    const column = state.rangeHighlightedMetaData.column
    const height = state.rangeHighlightedMetaData.selectionHeight
    const width = state.rangeHighlightedMetaData.selectionWidth
    const selectedRow = state.rangeSelectedMetaData.row
    const selectedColumn = state.rangeSelectedMetaData.column
    
    /* console.log('row', row)
    console.log('column', column)
    console.log('height', height)
    console.log('width', width)
    console.log('selectedRow', selectedRow)
    console.log('selectedColumn', selectedColumn) */

    if (height === 1 && width === 1) {
      //значит без выделения ячеек
      /* console.log('текст') */
      return instance.getData(row, column, row, column)
    } else {
      if (selectedColumn === column) {
        //влево
        if (row === selectedRow) {
          //вверх
          return instance.getData(row ,column , row - (height -1) , column - (width - 1) )
        } else {
          //вниз   
          return instance.getData(selectedRow ,column , selectedRow + (height -1) , column - (width - 1) )
        }
      } else if (selectedColumn !== column) {
        //вправо
        if (row === selectedRow) {
          //вверх
          return instance.getData(row ,column , row - (height -1) , column - (width - 1) )
        } else {
          //вниз   
          return instance.getData(selectedRow ,selectedColumn , selectedRow + (height -1) , selectedColumn + (width - 1) )
        }
      }
    }
  },
  fakeCurrentFormula: state => state.fakeCurrentFormula,
  currentSelectedCell: state => state.currentSelectedCell,
  highlightedRangeCells: state=> {
    const row = state.rangeHighlightedMetaData.row
    const column = state.rangeHighlightedMetaData.column
    const height = state.rangeHighlightedMetaData.selectionHeight
    const width = state.rangeHighlightedMetaData.selectionWidth
    const selectedRow = state.rangeSelectedMetaData.row
    const selectedColumn = state.rangeSelectedMetaData.column
    //console.log('row', row)
    //console.log('column', column)
    //console.log('height', height)
    //console.log('width', width)
    //console.log('selectedRow', selectedRow)

    //console.log('selectedColumn', selectedColumn)
    if (row === selectedRow) {
      
      //значит без выделения ячеек
      if (height === 1 && width === 1 && ((column && selectedColumn) > EnumColumnTableNumber.Type) ) {

        return state.currentSelectedCell
      }

      if ((row >= 0 && row !== undefined) && (column > EnumColumnTableNumber.Type && column !== undefined)) {
        const leftNameColumn = getColumnNameByColumnNumber(column-(width-1))
        const leftNumber = (row  + 1) - (height - 1)

        const rightNameColumn = getColumnNameByColumnNumber(column)
        const rightNumber = row + 1

        const leftCoord = `${leftNameColumn}${leftNumber}`
        const rightCoord = `${rightNameColumn}${rightNumber}`

        const resultRange = `${leftCoord}:${rightCoord}`.split(' ').join('')

        return  resultRange 
      }

    } else {
    //было выделения ячеек
      if (selectedRow < 0 && width === 1) {
        //вся колонка 
        const nameColumn = getColumnNameByColumnNumber(column)
        const resultRange = `${nameColumn}:${nameColumn}`.split(' ').join('') 

        return  resultRange 
      } else if (selectedRow < 0 && width > 1) {
        //нескольуо колонок выделено
        const leftNameColumn = getColumnNameByColumnNumber(column-(width-1))
        const rightNameColumn = getColumnNameByColumnNumber(column)
        const resultRange = `${leftNameColumn}:${rightNameColumn}`.split(' ').join('') 

        return  resultRange 
      }

      if ((row >= 0 && row !== undefined) && (column > EnumColumnTableNumber.Type && column !== undefined)) {

        let leftNameColumn
        if (selectedColumn === column) {
          //влево
          leftNameColumn = getColumnNameByColumnNumber(selectedColumn-(width-1))
        } else {
          //вправо
          leftNameColumn = getColumnNameByColumnNumber(selectedColumn)
        }

        const leftNumber = selectedRow + 1

        const rightNameColumn = fieldsInfoMap.get(column)?.columnName
        const rightNumber = row + 1

        const leftCoord = `${leftNameColumn}${leftNumber}`
        const rightCoord = `${rightNameColumn}${rightNumber}`
        const resultRange = `${leftCoord}:${rightCoord}`.split(' ').join('') 

        return  resultRange 
      }
    }
  }
};