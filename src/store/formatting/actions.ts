
import { ActionTree } from 'vuex';
import {  ConfigData } from './types';
import { RootState } from '../types';
import { IPaylAddRule, IPaylDelRule } from '@/types/FormattingTypes';

export const actions: ActionTree<ConfigData, RootState> = {
    
  addFormatRule({commit}, payl: IPaylAddRule) {
    console.log('333-addFormatRule')

    commit('ADD_FORMAT_RULE', payl)
  },
  editFormatRule({commit}, payl: IPaylAddRule) {
    commit('EDIT_FORMAT_RULE', payl)
  },
  deleteFormatRule({commit}, payl: IPaylDelRule) {
    commit('DELETE_FORMAT_RULE', payl)
  }
}