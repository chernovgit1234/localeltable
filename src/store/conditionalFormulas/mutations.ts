import { MutationTree } from 'vuex';
import {  ConfigData } from './types';
import { EnumColumnName } from '@/enums/EnumColumnValues';
import { IConditionFormula, IConditionFormulasRule, ITextRuleByConditionFormula } from '@/types/ConditionalFormulasTyles';

export const mutations: MutationTree<ConfigData> = {
  SET_APPLIED_FIELD_NAME(state: ConfigData, fieldName: EnumColumnName) {
    state.appliedFieldName = fieldName
  },
  CREATE_CONDITION(state: ConfigData, newCondition: IConditionFormula) {
    state.conditionalFormulasArray.push(newCondition)
    state.idCurrentCondition = newCondition.id
  },
  DELETE_CONDITION(state: ConfigData, id: string) {
    const idxDeletedCondition: number = state.conditionalFormulasArray.findIndex((condition: IConditionFormula) => condition.id === id)
    state.conditionalFormulasArray.splice(idxDeletedCondition, 1)
  },

  ADD_CONDITION_RULE(state: ConfigData, newRule: IConditionFormulasRule) {
    
    const currentCondition =state.conditionalFormulasArray.find(el => el.id === state.idCurrentCondition) as IConditionFormula

    if (currentCondition) {
      currentCondition.rules.push(newRule)
      /* currentCondition.textRules += `\n И ${newRule.textRule}` */
      currentCondition.textRules.push({idRule: newRule.id, text: newRule.textRule, fieldName: newRule.fieldName})
    }

    /* const idxAddedCondition = state.conditionalFormulasArray.findIndex((condition: IConditionFormula) => condition.id === currentCondition.id)
    state.conditionalFormulasArray[idxAddedCondition] = currentCondition */
  },
  OPEN_CONDITION(state: ConfigData, idCond: string) {
    state.idCurrentCondition = idCond
  },
  DELETE_CONDITION_RULE(state: ConfigData, idRule: string) {

    const currentCondition = state.conditionalFormulasArray.find(el => el.id === state.idCurrentCondition) as IConditionFormula

    if (currentCondition) {
      const idxDeletedRule: number = currentCondition.rules.findIndex((rule: IConditionFormulasRule) => rule.id === idRule)
      currentCondition.rules.splice(idxDeletedRule, 1)
      const idxTextRule: number =  currentCondition.textRules.findIndex((rule: ITextRuleByConditionFormula) => rule.idRule === idRule)
      currentCondition.textRules.splice(idxTextRule, 1)

      if (!currentCondition.rules.length) {
        const idxDeletedCond: number = state.conditionalFormulasArray.findIndex((cond: IConditionFormula) => cond.id === currentCondition.id)
        state.conditionalFormulasArray.splice(idxDeletedCond, 1)
        state.idCurrentCondition = null
        
      }
    }
  },
  RESET_ID_CONDITION(state: ConfigData) {
    state.idCurrentCondition = null
  },
  EDIT_CONDITION_RULE(state: ConfigData, editedRule: IConditionFormulasRule) {
    const currentCondition = state.conditionalFormulasArray.find(el => el.id === state.idCurrentCondition) as IConditionFormula

    if (currentCondition) {
      const idxEditedRule: number = currentCondition.rules.findIndex((rule: IConditionFormulasRule) => rule.id === editedRule.id)
      currentCondition.rules[idxEditedRule] = editedRule
      const idxTextRule: number =  currentCondition.textRules.findIndex((rule: ITextRuleByConditionFormula) => rule.idRule === editedRule.id)
      currentCondition.textRules[idxTextRule] = {idRule: editedRule.id, text: editedRule.textRule, fieldName: editedRule.fieldName}
    }
  },
};