<template>
  <!-- oncontextmenu="return false" -->
  <div class="app"  @keydown="keydownGlobal">
    <div class="app__managerboard" v-if="visibleUpperPanel">
      <the-managerboard @click.stop="mousedownOnManagerboard"></the-managerboard>
    </div>
    <div :style="tableHeightStyle" class="app__workspace">
      <the-workspace></the-workspace>
    </div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, onBeforeMount } from 'vue';
import TheManagerboard from './components/TheManagerboard.vue'
import TheWorkspace from './components/TheWorkspace.vue'
import {IStoryRow} from './components/TheFormShowStoryRow.vue'
import { LocalStorageHandler } from './utils/LocalStorageHandler';
import {IColumnConfifuration} from './types/LocalStorageTypes'
import { useStore } from 'vuex'
import hotkeys from 'hotkeys-js';
import {visSettHeaderDial, visSettColsDial, visibleDropDownMenu, visibleDropDownSettingsMenu, visDiagDial, visibleContextMenu, closeContextMenu} from './helpers/States/StateDialogs'
import { initLocalStorageValues } from './helpers/LocalStorageMethods';
const store = useStore()

const visibleUpperPanel = computed(() => store.getters.visibleUpperPanel)

onBeforeMount(()=>{
  initLocalStorageValues()  
})

function hideDropDownMenu() {
  if (visibleDropDownSettingsMenu.value) visibleDropDownSettingsMenu.value = false
  visibleDropDownMenu.value = false
}

function mousedownOnManagerboard() {
  closeContextMenu()
  hideDropDownMenu()
}

function keydownGlobal(event: any) {
  hotkeys('shift+ctrl+q, shift+ctrl+f', function (event, handler){
  switch (handler.key) {
    case 'shift+ctrl+q': 
      visSettHeaderDial.value = true
      if (visSettColsDial) visSettColsDial.value = false
      break; 
    case 'shift+ctrl+f': 
      visSettColsDial.value = true

      if (visSettHeaderDial) visSettHeaderDial.value = false
      break;
      default:
      visDiagDial.value = true
  }
});
}

const tableHeightStyle = computed(() => {
  return visibleUpperPanel.value === true ? 'min-height: calc(100vh - 45px);' : 'min-height: calc(100vh);'
})
</script>

<style lang="css">
.material {
  cursor: pointer;
}

.app__popup {
  position: absolute;
	inset: 0;
	background-color: #21212108;
	z-index: 1000;
}
.app__popup-after {
  position: absolute;
	inset: 0;
	background-color: #21212108;
	z-index: 1001;
}
.app {
  background-color: #f9fbfd !important;
  /* background-color: #f1efe7; */
  width: 100%;
  flex-direction: column;
  
}
.app__managerboard {
  height: 45px;
}
.app__workspace {
  background-color: #f9fbfd !important;
  /* background-color: #ffcc0007; */

}

		
</style>
