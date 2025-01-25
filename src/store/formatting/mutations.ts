import { MutationTree } from 'vuex';
import {  ConfigData } from './types';
import { IPaylAddRule, IPaylDelRule } from '@/types/FormattingTypes';
import { instance } from '@/helpers/InstanceHelper';

export const mutations: MutationTree<ConfigData> = {

  ADD_FORMAT_RULE(state: ConfigData,payl: IPaylAddRule) {
    console.log('111-ADD_FORMAT_RULE')
    const rules = state.rulesMap.get(payl.columnNumber)
    if (rules) {
      rules.push(payl.rule)
    } else {
      state.rulesMap.set(payl.columnNumber, [payl.rule])
    }
    /* instance.render() */
  },
  EDIT_FORMAT_RULE(state: ConfigData,payl: IPaylAddRule) {
    const rules = state.rulesMap.get(payl.columnNumber)
    if (rules) {
      const editableRuleIndex = rules.findIndex(rule => rule.id === payl.rule.id)
      
      rules[editableRuleIndex] = payl.rule
    }
    /* instance.render() */
  },
  DELETE_FORMAT_RULE(state: ConfigData, payl: IPaylDelRule) {
    const rules = state.rulesMap.get(payl.columnNumber)
    
    if (rules && rules.length) {

      const idxRule: number = rules.findIndex(rule => rule.id === payl.idRule)
      
      //если есть такое правило то удалить
      if (~idxRule) {
        rules.splice(idxRule, 1)
      }
      //если в массиве не осталось правил, то удалить весь мап по колонке
      if (!rules.length)  {
        state.rulesMap.delete(payl.columnNumber)
      }
        
      /* instance.render() */
    }
  },
  DELETE_FORMAT_ALL_RULES(state: ConfigData, columnNumber: number) {
    const rules = state.rulesMap.get(columnNumber)
    if (rules) {
      state.rulesMap.delete(columnNumber)
      /* instance.render() */
    }
  }
};