import { MutationTree } from 'vuex';
import {  ConfigData } from './types';
import { IPaylAddRule, IPaylDelRule } from './types';

export const mutations: MutationTree<ConfigData> = {

    ADD_VALID_RULE(state: ConfigData,payl: IPaylAddRule) {
        state.rulesValidMap.set(payl.columnNumber, payl.rule)
    },
    EDIT_VALID_RULE(state: ConfigData,payl: IPaylAddRule) {
        state.rulesValidMap.set(payl.columnNumber, payl.rule)
    },
    DELETE_VALID_RULE(state: ConfigData, payl: IPaylDelRule) {
        state.rulesValidMap.delete(payl.columnNumber)
    },
    SET_VALID(state: ConfigData, txt: string) {
        if (txt.length) {
            state.errorTxt=txt
            state.errorValid=true
        } else {
            state.errorTxt=''
            state.errorValid=false
        }
    },
    RESET_VALID(state: ConfigData) {
        state.errorTxt=''
        state.errorValid=false
    },
};