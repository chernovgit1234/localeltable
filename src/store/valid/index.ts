import { Module } from 'vuex';
import {  ConfigData } from './types';
import { RootState } from '../types';
import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';

const state: ConfigData = {
    rulesValidMap: new Map(),
    errorValid: false,
    errorTxt: ''
};

export const valid: Module<ConfigData, RootState> = {
    state, 
    getters,
    mutations,
    actions
};