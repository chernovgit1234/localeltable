
import { ActionTree } from 'vuex';
import {  ConfigData, IHighlightedDataByColumn, IHighlightedDataByRow, ISelectedData } from './types';
import { RootState } from '../types';
import { IUserFormula } from '@/helpers/HSFormula/Types';
import { EnumColumnTableNumber } from '@/enums/EnumColumnValues';

export const actions: ActionTree<ConfigData, RootState> = {
    
  setHighlightedDataByColumn({commit}, metadata: IHighlightedDataByColumn) {
    commit('SET_HIGHLIGHTED_DATA_BY_COLUMN', metadata)
  },
  setHighlightedDataByRow({commit}, metadata: IHighlightedDataByRow) {
    commit('SET_HIGHLIGHTED_DATA_BY_ROW', metadata)
  },
  setSelectedData({commit}, metadata: ISelectedData) {
    commit('SET_SELECTED_DATA', metadata)
  },
  setFakeCurrentFormula({commit}, newFakeCurrentFormula: IUserFormula) {
    commit('SET_FAKE_CURRENT_FORMULA', newFakeCurrentFormula)
  },
  clearFakeCurrentFormula({commit}) {
    commit('CLEAR_FAKE_CURRENT_FORMULA')
  },
  setFormulaObject({commit}, formulaObject: {key: number, value: IUserFormula}) {
    commit('SET_FORMULA_OBJECT', formulaObject)
  },
  deleteFormulaObject({commit}, selectedColumn: EnumColumnTableNumber) {
    commit('DELETE_FORMULA_OBJECT', selectedColumn)
  },
  setSelectedRow({commit}, selectedRows: number[]) {
    commit('SET_SELECTED_ROWS', selectedRows)
  },
  clearSelectedRowsRange({commit}) {
    commit('CLEAR_SELECTED_ROWS_RANGE')
  },
  
};