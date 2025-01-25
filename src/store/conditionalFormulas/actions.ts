
import { ActionTree } from 'vuex';
import {  ConfigData } from './types';
import { RootState } from '../types';
import { EnumColumnName } from '@/enums/EnumColumnValues';
import { IConditionFormula, IConditionFormulasRule } from '@/types/ConditionalFormulasTyles';

export const actions: ActionTree<ConfigData, RootState> = {
  setAppliedFieldName({commit}, fieldName: EnumColumnName) {
    commit('SET_APPLIED_FIELD_NAME', fieldName)
  },
  createCondition({commit}, newCondition: IConditionFormula) {
    commit('CREATE_CONDITION', newCondition)
  },
  deleteCondition({commit}, id: string) {
    commit('DELETE_CONDITION', id)
  },
  deleteConditionRule({commit}, id: string) {
    commit('DELETE_CONDITION_RULE', id)
  },
  openCondition({commit}, id: string) {
    commit('OPEN_CONDITION', id)
  },
  
  addConditionRule({commit}, rule: IConditionFormulasRule) {
    commit('ADD_CONDITION_RULE', rule)
  },
  resetIdCurrentCondition({commit}, id: IConditionFormulasRule) {
    commit('RESET_ID_CONDITION')
  },
  editConditionRule({commit}, rule: IConditionFormulasRule) {
    commit('EDIT_CONDITION_RULE', rule)
  },
};