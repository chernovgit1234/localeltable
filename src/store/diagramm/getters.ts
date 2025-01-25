import { GetterTree } from 'vuex';
import { ConfigData } from './types';
import { RootState } from '../types';

export const getters: GetterTree<ConfigData, RootState> = {
  config: f=>f.config,
  indexAxis: f=>f.config.indexAxis,
  typeDiag: g=>g.type
};