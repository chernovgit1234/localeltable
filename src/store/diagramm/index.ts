import { Module } from 'vuex';
import {  ConfigData } from './types';
import { RootState } from '../types';
import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';
import { EnumAccumType, EnumDiagName, EnumDiagType, EnumJoinType, EnumUnionType } from '@/enums/EnumsDiagramm';

const state: ConfigData = {
    config: {indexAxis:'x'},
    ranges: [],
    params: [],
    axisX: null,
    union: false,
    unionType: EnumUnionType.Сумма,
    accumType: EnumAccumType.Нет,
    joinType: EnumJoinType.Погоризонтали,
    type: EnumDiagType.Bar,
    tension: 0,
    fill: false,
    stepped: false,
    stacked: false,
    diagName: EnumDiagName.СтолбДиаг,
    normir: false,
    opacity: false,
    slant: false,
    bubbleUnion: false,
    bubbleParams: []
};

export const diagramm: Module<ConfigData, RootState> = {
    state, 
    getters,
    mutations,
    actions
};