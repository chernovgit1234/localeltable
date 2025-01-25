
import { ActionTree } from 'vuex';
import {  ConfigData } from './types';
import { RootState } from '../types';
import { IPaylAddRule, IPaylDelRule } from '@/types/FormattingTypes';

export const actions: ActionTree<ConfigData, RootState> = {
    addValidRule({commit}, payl: IPaylAddRule) {
        commit('ADD_VALID_RULE', payl)
    },
    editValidRule({commit}, payl: IPaylAddRule) {
        commit('EDIT_VALID_RULE', payl)
    },
    deleteValidRule({commit}, payl: IPaylDelRule) {
        commit('DELETE_VALID_RULE', payl)
    },
    setValid({commit}, txt: string) {
        console.log('setValid', txt)
        commit('SET_VALID', txt)
    },
    resetValid({commit}) {
        commit('RESET_VALID')
    },
}