import { GetterTree } from 'vuex';
import { ConfigData } from './types';
import { RootState } from '../types';

export const getters: GetterTree<ConfigData, RootState> = {
  getValidRuleByColumn: s=>(colNum: number)=>s.rulesValidMap.get(colNum),
  getValidRules: s => s.rulesValidMap,
  errorValid: s=>s.errorValid,
  errorTxt: s=>s.errorTxt
}