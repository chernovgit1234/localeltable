import { GetterTree } from 'vuex';
import { ConfigData } from './types';
import { RootState } from '../types';

export const getters: GetterTree<ConfigData, RootState> = {
  сonditionalFormulasArrayLength: state => state.conditionalFormulasArray.length,
  getConditionalFormulasArray: state => state.conditionalFormulasArray,
  idCurrentCondition: state => state.idCurrentCondition,
  getCurrentConditionRules: state => state.conditionalFormulasArray.find(el => el.id === state.idCurrentCondition)?.rules
};