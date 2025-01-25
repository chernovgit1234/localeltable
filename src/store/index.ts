
import { createStore, StoreOptions   } from "vuex";
import { RootState } from '@/store/types';
import { presets } from '../store/preset/index';
import { autofilter } from '../store/autofilter';
import { configData } from '../store/configData';
import { formula } from '../store/formula';
import { formatting } from '../store/formatting';
import { diagramm } from '../store/diagramm/index';
import { valid } from '../store/valid/index';

import { conditionalFormulas } from '../store/conditionalFormulas';
import {ISearchByColumnMetadata} from '../types/OtherTypes'
import { EnumEmptyString } from '../enums/EnumsCommon'
import { LocalStorageHandler } from "@/utils/LocalStorageHandler";

const store: StoreOptions<RootState> = {
  state: {
    visibleUpperPanel: (LocalStorageHandler.getItem('visibleUpperPanel')) as boolean, 
    version: '1.0.0',
    error: null,
    load: null,
    message: null,
    selectedColumn: null,
    selectedColumnCommonUse: null,
    setSelectedColumnHeaderClickLeftBtn: null,
    columnSearchMetadata: {value: EnumEmptyString.EmptyStringValue, fieldName: null, column: null},
    fieldNameSearchedColumn: null,
    valueSearchedColumn: EnumEmptyString.EmptyStringValue,
    summObject: {CostOneField: 0, CostTwoField: 0},
    countRow: 0
  },
  mutations: {
    CHANGE_UPPER_PANEL(state) {
      state.visibleUpperPanel = !state.visibleUpperPanel
    },
    SET_SELECTED_COLUMN(state, selectedColumn) {
      state.selectedColumn = selectedColumn
    },
    SET_SELECTED_COLUMN_COMMON_USE(state, selectedColumn) {
      state.selectedColumnCommonUse = selectedColumn
    },
    SET_SELECTED_COLUMN_HEADER_CLICK_LEFT(state, selectedColumn) {
      state.setSelectedColumnHeaderClickLeftBtn = selectedColumn
    },
    SET_SEARCH_METADATA(state, metadata: ISearchByColumnMetadata) {
      state.columnSearchMetadata = {value: metadata.value.trim(), fieldName: metadata.fieldName, column: metadata.column}
      state.fieldNameSearchedColumn = metadata.fieldName
      state.valueSearchedColumn = metadata.value
    },
    RESET_SEARCH(state) {
      state.columnSearchMetadata = {value: EnumEmptyString.EmptyStringValue, fieldName: null, column: null}

      state.fieldNameSearchedColumn = null
      state.valueSearchedColumn = EnumEmptyString.EmptyStringValue
    },
    SET_SUMM_OBJECT(state, summObject: any) {
      state.summObject = summObject
    },
    SET_COUNT_ROW(state, countRow: number) {
      state.countRow = countRow
    }
  },
  getters: {
    error: s => s.error,
    load: s => s.load,
    message: s => s.message,
    selectedColumn: s => s.selectedColumn,
    selectedColumnCommonUse: s => s.selectedColumnCommonUse,
    setSelectedColumnHeaderClickLeftBtn: s => s.setSelectedColumnHeaderClickLeftBtn,
    columnSearchMetadata: s => s.columnSearchMetadata,
    fieldNameSearchedColumn: s => s.fieldNameSearchedColumn,
    valueSearchedColumn: s => s.valueSearchedColumn,
    summObject: s => s.summObject,
    countRow: s => s.countRow,
    visibleUpperPanel: s => s.visibleUpperPanel
  }, 
  actions: {
    changeUpperPanel({commit}) {
      commit('CHANGE_UPPER_PANEL')
    },
    setSelectedColumn({commit}, selectedColumn: number) {
      commit('SET_SELECTED_COLUMN', selectedColumn)
    },
    setSelectedColumnHeaderClickLeft({commit}, selectedColumn: number) {
      commit('SET_SELECTED_COLUMN_HEADER_CLICK_LEFT', selectedColumn)
    },
    setSelectedColumnCommonUse({commit}, selectedColumn: number) {
      commit('SET_SELECTED_COLUMN_COMMON_USE', selectedColumn)
    },
    setSearchMetadata({commit}, metadata: ISearchByColumnMetadata) {
      commit('SET_SEARCH_METADATA', metadata)
    },
    resetSearch({commit}) {
      commit('RESET_SEARCH')
    },
    setSummObject({commit}, summObject: any) {
      commit('SET_SUMM_OBJECT', summObject)
    },
    setCountRow({commit}, countRow: number) {
      commit('SET_COUNT_ROW', countRow)
    }
  },
  modules: {
    presets, autofilter, configData, formula, formatting, conditionalFormulas, diagramm, valid
  }
};
export const storage = createStore<RootState>(store)
//export default createStore<RootState>(store);