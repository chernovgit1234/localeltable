<style lang="scss">
/* edf2fa */
/* 444746 - иконка */
.action-menu {
    height: 40px;
    display: flex;
    align-items: center;
    background-color: #edf2fa;
    border-radius: 8px;

    &__body {
        background-color: #edf2fa;
        width: 100%;
        padding: 0 30px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 30px;
        align-items: center;
        flex-wrap: nowrap;
    }

    &__left {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: 10px;
        align-items: center;
    }

    &__right {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: 3px;
    }

    &__separator {
        border: 0.5px solid #c7c7c7;
        height: 20px;
    }

    &__group-btn {
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
    }
}
.action-menu-item {
    border-radius: 4px;
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #edf2fa !important;
    
    &:hover {
        background-color: #dfe5eb !important;
        transition: all 0.3s ease 0s;
    }

    img, span {
        cursor: pointer;
        caret-color: transparent;
    }
}
.action-menu-item-group {
    border-radius: 4px;
    cursor: pointer;
    width: auto;
    height: 30px;
    padding: 5px 2px 5px 5px;
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: space-between;
    background-color: #edf2fa;

    &:hover {
        background-color: #dfe5eb !important;
        transition: all 0.3s ease 0s;
    }
}
</style>

<template>
    <div class="action-menu">
        <div class="action-menu__body">
            <div class="action-menu__left">
                <div class="action-menu__group-btn">
                    <button class="action-menu-item" @click="printStart">
                        <img width="22" height="22" src="../../assets/icons/contextMenuIcons/print.svg" alt="ctrl-z">
                        
                        <q-tooltip class="custom-tooltip-menu" anchor="bottom middle" self="top middle" :offset="[10, 5]">
                            <span>Печать (Ctrl+P)</span><br/>
                        </q-tooltip>
                    </button>
                    <button class="action-menu-item" @click="undo">
                        <img width="22" height="22" src="../../assets/icons/contextMenuIcons/undo.svg" alt="ctrl-z">
                        <q-tooltip class="custom-tooltip-menu" anchor="bottom middle" self="top middle" :offset="[10, 5]">
                            <span>Отменить (Ctrl+Z)</span><br/>
                        </q-tooltip>
                    </button>
                    <button  class="action-menu-item" @click="redo">
                        <img width="22" height="22" src="../../assets/icons/contextMenuIcons/redo.svg" alt="ctrl-z">
                        <q-tooltip class="custom-tooltip-menu" anchor="bottom middle" self="top middle" :offset="[10, 5]">
                            <span>Повторить (Ctrl+Y)</span><br/>
                        </q-tooltip>
                    </button>
                </div>
                <div class="action-menu__separator"></div>
                <div class="action-menu__group-btn">
                    <button 
                        @mousedown.stop
                        class="action-menu-item-group" 
                        :style="{'background-color': visibleDropDownMenu ? '#dfe5eb' : 'transparent' }"
                        id="setting-drop-down-menu" 
                        @click="showDropDownMenu"
                    >
                        <img width="20" height="20" src="../../assets/icons/contextMenuIcons/setting2.svg" alt="ctrl-z">
                            <q-tooltip v-if="!visibleDropDownMenu" class="custom-tooltip-menu" anchor="bottom middle" self="top middle" :offset="[10, 5]">
                                <span>Управление и настройки</span><br/>
                            </q-tooltip>
                        <img width="16" height="16" src="../../assets/icons/contextMenuIcons/arrow-down-menu.svg" alt="ctrl-z">
                    </button>
                </div>
                <div class="action-menu__separator"></div>
                <div class="action-menu__group-btn">
                    <button class="action-menu-item" @click="openChart">
                        <img width="22" height="22" src="../../assets/icons/menu/insert_chart.svg" alt="ctrl-z">
                        <q-tooltip class="custom-tooltip-menu" anchor="bottom middle" self="top middle" :offset="[10, 5]">
                            <span>Редактор диаграмм</span><br/>
                        </q-tooltip>
                    </button>
                </div>

                
            </div>
            <div class="action-menu__right">
                <button v-if="visibleUpperPanel" class="action-menu-item" @click="changeUpperPanel">
                    <q-icon size="25px" name="keyboard_arrow_up"></q-icon>
                    <q-tooltip class="custom-tooltip-menu" anchor="bottom middle" self="top middle" :offset="[10, 5]">
                        <span>Скрыть верхнюю панель</span><br/>
                    </q-tooltip>
                </button>
                <button v-else class="action-menu-item" @click="changeUpperPanel">
                    <q-icon size="25px" name="keyboard_arrow_down"></q-icon>
                    <q-tooltip class="custom-tooltip-menu" anchor="bottom middle" self="top middle" :offset="[10, 5]">
                        <span>Показать верхнюю панель</span><br/>
                    </q-tooltip>
                </button>
        
            </div>
        </div>
    </div>
    <CustomDraggableDialog 
        @resizing="resizing" 
        :resizable="visDiagDial" 
        @mousedown.stop="closeContextMenu()" 
        :style="widthComputed" 
        :title="titleComputed" 
        v-if="visDragDial" 
        @closeDialog="closeDialog"
    >
        <template #form>
            <!-- <TheSettingsHeader  v-if="visSettHeaderDial"></TheSettingsHeader>
            <TheSettingsColumns  v-else-if="visSettColsDial"></TheSettingsColumns> -->
            <TheDiagramViewer :coord="coord" v-if="visDiagDial"></TheDiagramViewer>
        </template>
        
    </CustomDraggableDialog>
    <CustomDropDownMenu v-show="visibleDropDownMenu === true" @mousedown.stop>
        <template #form >
            <TheDropDownSettingsMenu v-if="visibleDropDownSettingsMenu"></TheDropDownSettingsMenu>
        </template>
    </CustomDropDownMenu>
</template>

<script setup lang="ts">
import { instance } from '@/helpers/InstanceHelper';
import { visSettHeaderDial, visibleDropDownMenu, visibleDropDownSettingsMenu, visSettColsDial,visDiagDial, visDragDial, closeContextMenu, resetStateSidebar, visibleSidebar, stateSidebar } from '@/helpers/States/StateDialogs';
import { LocalStorageHandler } from '@/utils/LocalStorageHandler';
import printJS from 'print-js'
import { watch, ref, computed, watchEffect } from 'vue';
import CustomDropDownMenu from '../SpecialComponents/CustomDropDownMenu.vue'
import CustomDraggableDialog from '../SpecialComponents/CustomDraggableDialog.vue'
import TheDropDownSettingsMenu from './TheDropDownSettingsMenu.vue'
import TheSettingsHeader from './TheSettingsHeader.vue'
import TheSettingsColumns from './TheSettingsColumns.vue'
import TheDiagramViewer from '../DiagramComponents/TheDiagramViewer.vue'
import { useStore } from 'vuex'

const store = useStore()
let coord = ref()
function resizing(coords: any) {
    coord.value = {...coords}
}

enum TypePopup {
    Default = 0,
    ShowSettingsHeader = 1,
    ShowSettingsColumns = 2,
    ShowDiagDial = 3
}
let typePopup = ref<TypePopup>(TypePopup.Default)
let showDialog = ref(false)

const titleComputed = computed(() => {
    let retutnValue = ''

    switch (typePopup.value) {
        case TypePopup.ShowSettingsHeader:
        retutnValue = 'Настройка шапки'
        break;
        case TypePopup.ShowSettingsColumns:
        retutnValue = 'Управление столбцами'
        break;
        default:
        retutnValue = ''
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

let visibleUpperPanel = ref(LocalStorageHandler.getItem('visibleUpperPanel'))

/* watch(visDragDial, (value: boolean) => {
    if (value) showCustomDraggableDialog()
})
watch(visSettHeaderDial, (value: boolean) => {
    if (value) showPopupShowSettingsHeader()
})
watch(visSettColsDial, (value: boolean) => {
    if (value) showPopupShowSettingsColumns()
}) */
/* watch(visSettColsDial, (value: boolean) => {
    if (value) showPopupShowSettingsColumns()
}) */
function openChart() {
    //драг окно
    showDialog.value = true
    typePopup.value = TypePopup.ShowDiagDial
    visDiagDial.value = true
    visDragDial.value = true
    //сайдбар
    resetStateSidebar()
    visibleSidebar.value = true
    stateSidebar.visDiagSett = true

}
function showCustomDraggableDialog() {
    visDragDial.value = true
}
function showPopupShowSettingsHeader() {
    showDialog.value = true
    visDragDial.value = true
    typePopup.value = TypePopup.ShowSettingsHeader
  //отключить остальные
}
function showPopupShowSettingsColumns() {
    showDialog.value = true
    visDragDial.value = true

    typePopup.value = TypePopup.ShowSettingsColumns
}

watch(visDragDial, (val: boolean)=>{
    console.log('watch visDragDial')
    //showDialog.value=val
}, {immediate: true, deep:true})
watchEffect(()=>{
    console.log('watch visDragDial', visDragDial.value)
})

function closeDialog() {
    console.log('closeDialog')
    showDialog.value = false
    visDragDial.value = false

    switch (typePopup.value) {
        case TypePopup.ShowSettingsHeader:
        visSettHeaderDial.value = false
        break;
        case TypePopup.ShowSettingsColumns:
        visSettColsDial.value = false
        break;
        case TypePopup.ShowDiagDial:
        visDiagDial.value = false

        break;
        
    }
    console.log('closeDialog')
    typePopup.value = TypePopup.Default
}
function showDropDownMenu() {
    
    const settingGroupMenu = document.getElementById('setting-drop-down-menu')
    let left = settingGroupMenu?.getBoundingClientRect().left as number
    const dropDownMenu = document.getElementById('drop-down-menu') as HTMLDivElement
    if (dropDownMenu) dropDownMenu.style.left = `${left}px`

    visibleDropDownSettingsMenu.value = !visibleDropDownSettingsMenu.value
    visibleDropDownMenu.value = !visibleDropDownMenu.value

    closeContextMenu()
}
function showSettingsHeaderTable() {
    visSettHeaderDial.value = true
}
function changeUpperPanel() {
    
    visibleUpperPanel.value = !visibleUpperPanel.value
    store.dispatch('changeUpperPanel')
    LocalStorageHandler.setItem('visibleUpperPanel', visibleUpperPanel.value);
    /* emit('changeVisibleUpperPanel') */
}
function undo() {
    instance.undo()
}
function redo() {
    instance.redo()
}


function printStart() {
    //let html: string = instance.toHTML() 
    let data: any =  instance.getSourceData()

    printJS({ 
        printable: data, 
        properties: [
            { field: 'TypeRow', displayName: 'Тип'},
            { field: 'Brand', displayName: 'Бренд'},
            { field: 'Name', displayName: 'Наименование'},
            { field: 'ProductionDate', displayName: 'Дата производства'},
            { field: 'CostOne', displayName: 'Стоимость 1'},
            { field: 'CostTwo', displayName: 'Стоимость 2'},
            { field: 'Percent', displayName: 'Процент'},
            { field: 'Status', displayName: 'Статус'}
        ],
        type: 'json',
        header: 'Название печати',
        documentTitle: 'место для текста',
        gridHeaderStyle: 'color: black;border: 0.1px solid #e6e6e6;font-family: Roboto, sans-serif; font-size: 14px; white-space: nowrap;',
        gridStyle: 'border: 0.1px solid #e6e6e6;font-family: Roboto, sans-serif;'
    })
}
</script>