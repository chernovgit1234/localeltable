import { Module } from 'vuex';
import {  ConfigData } from './types';
import { RootState } from '../types';
import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';
import { EnumColumnName, EnumFieldName } from '@/enums/EnumColumnValues';

const state: ConfigData = {
    conditionalFormulasArray: [],
    idCurrentCondition: null,
    appliedFieldName: EnumColumnName.Type
};

export const conditionalFormulas: Module<ConfigData, RootState> = {
    state, 
    getters,
    mutations,
    actions
};