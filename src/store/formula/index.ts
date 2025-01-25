import { Module } from 'vuex';
import { ConfigData, ISelectedData } from './types';
import { RootState } from '../types';
import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';
import {EnumColumnNumber, EnumColumnName, EnumColumnTableNumber, EnumFieldName} from '../../enums/EnumColumnValues'

const state: ConfigData = {
    selectedRowsRange: [],
    rangeHighlightedMetaData: {
      row: 0,
      selectionHeight: 0,
      column: 0,
      selectionWidth: 0
    },
    rangeSelectedMetaData: {
      row: 0,
      column: 0,
    },
    fakeCurrentFormula: null,
    currentSelectedCell: '',
    formulasList: new Map([
      /* [
        EnumColumnTableNumber.CostTwo,
        {
          id: '1111',
          typeValue: 'string',
          column: 6,
          fieldName: EnumFieldName.CostTwo,
          depends: [EnumFieldName.CostOne, EnumFieldName.Percent],
          formulaText: 'SUM(СТОИМОСТЬПЕРВАЯ - ПРОЦЕНТ)',
          tokens: [
            'SUM', '(','СТОИМОСТЬПЕРВАЯ','-','ПРОЦЕНТ', ')' 
          ]
        }
      ], */
      /* [
        EnumColumnTableNumber.CostOne,
        {
          id: '2222',
          column: EnumColumnTableNumber.CostOne,
          fieldName: EnumFieldName.CostOne,
          depends: [EnumFieldName.CostTwo, EnumFieldName.Percent],
          formulaText: 'SUM(Стоимостьвторая + 100)',
          tokens: [
            'SUM', '(','Стоимостьвторая','-','Процент', ')' 
          ]
        }
      ], */
    ])
};

export const formula: Module<ConfigData, RootState> = {
  state, 
  getters,
  mutations,
  actions
};