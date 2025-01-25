
import { ActionTree } from 'vuex';
import {  ConfigData, IParam, IRangeParam, ISettGraph } from './types';
import { RootState } from '../types';

export const actions: ActionTree<ConfigData, RootState> = {
  addRange({commit}, range: IRangeParam) {
    commit('ADD_RANGE', range)
    commit('UPDATE_CONFIG')
  },
  deleteDataAtCol({commit}, col: number) {
    commit('DEL_DATA_AT_COL', col)
    commit('UPDATE_CONFIG')
  },
  addDataAtCol({commit}, col: number) {
    commit('ADD_DATA_AT_COL', col)
    commit('UPDATE_CONFIG')
  },
  updateDataRange({commit}, colNums: number[]) {
    commit('UPDATE_DATA_RANGE', colNums)
    commit('UPDATE_CONFIG')
  },
  deleteRange({commit}, range: string) {
    commit('DELETE_RANGE', range)
    commit('UPDATE_CONFIG')
  },
  setParams({commit}, obj: any) {
    commit('SET_PARAMS', obj)
    commit('UPDATE_CONFIG')
  },
  setBubbleSett({commit}, obj: any) {
    commit('SET_BUBBLE_SETT', obj)
    commit('UPDATE_CONFIG')
  },
  setAxisX({commit}, axisX: any) {
    commit('SET_AXISX', axisX)
    commit('UPDATE_CONFIG')
  },
  setSettings({commit}, sett: any) {
    commit('SET_SETTINGS', sett)
    commit('UPDATE_CONFIG')
  },
  setUnion({commit}, val: boolean) {
    commit('SET_UNION', val)
    commit('UPDATE_CONFIG')
  },
  setUnionBubble({commit}, val: boolean) {
    commit('SET_UNION_BUBBLE', val)
    commit('UPDATE_CONFIG')
  },
  
  setDiagType({commit}, sett: ISettGraph) {
    commit('SET_DIAG_TYPE', sett)
    commit('UPDATE_CONFIG')
  },

  updateConfig({commit}) {
    commit('UPDATE_CONFIG')  
  },
  resetStateDiag({commit}) {
    commit('RESET_STATE_DIAG')  
  }
  }