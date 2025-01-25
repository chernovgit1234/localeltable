import { MutationTree } from 'vuex';
import {  ConfigData, IConfigData } from './types';

export const mutations: MutationTree<ConfigData> = {

  CREATE_CONFIG_DATA(state: ConfigData, configData: IConfigData) {
    state.configDataList.push(configData)
  }
};