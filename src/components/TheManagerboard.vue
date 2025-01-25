<style lang="scss">

.board-manager {
  background-color: #f9fbfd;
  /* background-color: #ffcc0007; */
  padding: 0px 20px;

  &__header-row {
    height: 45px;
  }
}

</style>

<template>
  <div class="board-manager">
    <div class="board-manager__body">
      <div class="board-manager__header-row"  v-if="visibleUpperPanel" >
        <TheUpperPanel></TheUpperPanel>
      </div>
    
      <!-- <div class="board-manager__actions-row">
        <TheActionsMenu @changeVisibleUpperPanel="changeVisibleUpperPanel"></TheActionsMenu>
      </div> -->
    </div>
    <!-- <CustomDraggableDialog :style="widthComputed" :title="titleComputed" v-if="showDialog === true || visDiagDial=== true" @closeDialog="closeDialog">
      <template #form>
        <TheSettingsHeader  v-if="visSettHeaderDial"></TheSettingsHeader>
        <TheSettingsColumns  v-else-if="visSettColsDial"></TheSettingsColumns>
      </template>
    </CustomDraggableDialog>
    <CustomDropDownMenu v-show="visibleDropDownMenu === true" @mousedown.stop>
      <template #form >
        <TheDropDownSettingsMenu v-if="visibleDropDownSettingsMenu"></TheDropDownSettingsMenu>
      </template>
    </CustomDropDownMenu> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, defineEmits } from 'vue';
import TheMenuPanel from './HeaderComponents/TheMenuPanel.vue'
import TheUpperPanel from './HeaderComponents/TheUpperPanel.vue'
import TheTabPanelFormula from './TabsComponents/TheTabPanelFormula.vue'
import { useStore } from 'vuex'
import CustomDraggableDialog from './SpecialComponents/CustomDraggableDialog.vue'
import TheSettingsHeader from './HeaderComponents/TheSettingsHeader.vue'
import TheSettingsColumns from './HeaderComponents/TheSettingsColumns.vue'

import {visSettHeaderDial, visibleDropDownMenu, visibleDropDownSettingsMenu, visSettColsDial, visDiagDial} from '../helpers/States/StateDialogs'
import CustomDropDownMenu from './SpecialComponents/CustomDropDownMenu.vue'
import TheDropDownSettingsMenu from '../components/HeaderComponents/TheDropDownSettingsMenu.vue'
import { LocalStorageHandler } from '@/utils/LocalStorageHandler';

const titleComputed = computed(() => {
  let retutnValue = ''

  switch (typePopup.value) {
    case TypePopup.ShowSettingsHeader:
      retutnValue = 'Настройка шапки'
      break;
    case TypePopup.ShowSettingsColumns:
      retutnValue = 'Управление столбцами'
      break;
  }

  return retutnValue 
})
const widthComputed = computed(() => {
  let retutnValue = ''

  switch (typePopup.value) {
    case TypePopup.ShowSettingsHeader:
      retutnValue = 'width: 440px;'
      break;
    case TypePopup.ShowSettingsColumns:
      retutnValue = 'width: 440px;'
      break;
  }

  return retutnValue 
})

enum TypePopup {
  Default = 0,
  ShowSettingsHeader = 1,
  ShowSettingsColumns = 2
}

const store = useStore()

let visibleUpperPanel = ref(LocalStorageHandler.getItem('visibleUpperPanel'))
function changeVisibleUpperPanel() {
  visibleUpperPanel.value = !visibleUpperPanel.value
}

let typePopup = ref<TypePopup>(TypePopup.Default)
let showDialog = ref(false)
/* let visDiagDial = ref(false) */

watch(visDiagDial, (value: boolean) => {
  if (value) showCustomDraggableDialog()
})
watch(visSettHeaderDial, (value: boolean) => {
  if (value) showPopupShowSettingsHeader()
})
watch(visSettColsDial, (value: boolean) => {
  if (value) showPopupShowSettingsColumns()
})
function showCustomDraggableDialog() {
  visDiagDial.value = true
}
function showPopupShowSettingsHeader() {
  showDialog.value = true
  visDiagDial.value = true
  typePopup.value = TypePopup.ShowSettingsHeader

  //отключить остальные
}
function showPopupShowSettingsColumns() {
  showDialog.value = true
  visDiagDial.value = true

  typePopup.value = TypePopup.ShowSettingsColumns
}
function closeDialog() {
  showDialog.value = false
  visDiagDial.value = false


  switch (typePopup.value) {
    case TypePopup.ShowSettingsHeader:
    visSettHeaderDial.value = false
      break;
    case TypePopup.ShowSettingsColumns:
    visSettColsDial.value = false
      break;
  }

  typePopup.value = TypePopup.Default
}
</script>

