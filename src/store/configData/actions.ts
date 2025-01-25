
import { ActionTree } from 'vuex';
import {  ConfigData, IConfigData } from './types';
import { RootState } from '../types';

export const actions: ActionTree<ConfigData, RootState> = {
    
  createConfigData({commit}, configData: IConfigData) {
    commit('CREATE_CONFIG_DATA', configData)
  }
};