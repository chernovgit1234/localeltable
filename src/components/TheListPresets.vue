<style lang="scss">

.list-preset {
   padding: 20px 10px;
   color: #202124;

   &__list {
      height: 500px;
      overflow-y: auto;
      border-top: 1px solid #dddfe3;
      border-bottom: 1px solid #dddfe3;
      margin-bottom: 20px;
   }

   &__item-label {
      color: #3c4043;
      font-family: Roboto400;
      font-size: 14px;
      letter-spacing: .25px;
      width: 250px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
   }

   &__item-active-class:after {
      content: '';
      position: absolute !important;
      top: 0;
      height: 100%;
      left: 0;
      border-left: 5px solid #1976d2 !important;
      transition: border-left 0.3s ease 0s;
   }

   &__actions {
      display: flex;
      justify-content: space-between;
   }
}

</style>

<template>
   <div class="list-preset">
      <q-list class="list-preset__list scroll-custom">
         <q-item
            v-for="(item, i) in presets" :key="i"  
            clickable
            :active="idSelectedPreset === item.id"
            @click="clickItem(item.id)"
            active-class="list-preset__item-active-class"
         >
            <q-item-section top :key="keyItem">
               <q-item-label 
                  class="q-mt-sm list-preset__item-label" 
                  :style="[
                     {'fontWeight': item.active === true ? 'bold' : 'auto'},
                     {'color': item.active === true ? '#137333' : '#3c4043'}
                  ]"
               >{{item.name}}</q-item-label>
            </q-item-section>
            
            <q-item-section side>
               <!-- <div class="q-gutter-xs">
                  <img width="24" height="24" v-if="item.active" src="../assets/icons/contextMenuIcons/active-check.svg"/>

               </div> -->
               <q-icon v-if="item.active" name="verified" color="#8e7cc3"></q-icon>
            </q-item-section>
         </q-item>
      </q-list>
      
      <div class="list-preset__actions" >
         <button class="btn-custom" @click="usePreset()" :disabled="activeSelectedPreset==null" v-text="activeSelectedPreset ? ' Не использовать' : 'Использовать'"></button>
         <button class="btn-light-custom" @click="deletePreset()" :disabled="!idSelectedPreset">Удалить</button>
      </div>
   </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, computed, defineEmits } from 'vue';

import { useStore } from 'vuex'
import { IPreset } from '../types/PresetTypes'

const store = useStore()
const idSelectedPreset = ref('id')
const activeSelectedPreset = ref<boolean | null>(null)

const presets = computed<IPreset[]>(() => store.getters.presets.filter((preset: IPreset) => !preset.isDefault))

function clickItem(id: string) {
   idSelectedPreset.value = id
   
   activeSelectedPreset.value = (presets.value.find((preset: IPreset) => preset.id === id) as IPreset).active
}

let keyItem = ref(0)
function usePreset() {
   
   let idPreset = idSelectedPreset.value
   let activePreset: boolean = activeSelectedPreset.value as boolean
   console.log('activePreset', activePreset)
   keyItem.value++
   store.dispatch('usePreset', {idPreset, activePreset})
}

function deletePreset() {
   let idPreset = idSelectedPreset.value

   store.dispatch('deletePreset', idPreset)
}
</script>

