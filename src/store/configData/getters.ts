import { GetterTree } from 'vuex';
import { IConfigData, ConfigData } from './types';
import { RootState } from '../types';

export const getters: GetterTree<ConfigData, RootState> = {
  configDataList: state=> state.configDataList,
  configDataListLength: state=> state.configDataList.length
};