import { GetterTree } from 'vuex';
import { ConfigData } from './types';
import { RootState } from '../types';
import { IConditionFormattingRules } from '@/types/FormattingTypes';

export const getters: GetterTree<ConfigData, RootState> = {
  getRulesByColumn: state => (columnNumber: number) => state.rulesMap.get(columnNumber),
  getRules: state => state.rulesMap,
  getRuleByColumn: state => (columnNumber: number) => {
    const rules = state.rulesMap.get(columnNumber)
    //вернуть первое правило масссива, потому что оно применяется в таблице
    if (rules && rules.length) return rules[0]
  },
};