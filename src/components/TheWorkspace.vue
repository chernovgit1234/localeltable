<style lang="scss">
.workspace {
    height: 100%;

    &__body {
        display: grid;
        grid-template-columns: auto 330px !important;
        gap: 5px;
    }

    &__menu-panel {
        padding: 7px 20px 7px 20px;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
    display: none;
}
</style>

<template>
    <div class="workspace">
        <div class="workspace__body">
            <div class="workspace__main">
                <div class="workspace__menu-panel" :style="{'padding-right': visibleSidebar === true ? '0px' : '20px'}">
                    <TheMenuPanel></TheMenuPanel>
                </div>
                <div class="workspace__table">
                    <TheTable 
                        @showPopupCreateFilterName="showPopupCreateFilterName()"
                        @showPopupShowStoryRow="showPopupShowStoryRow"
                    ></TheTable>
                </div>
            </div>
            <transition name="fade">
                <div class="workspace__sidebar" v-show="visibleSidebar">
                    <TheSidebar>
                        <template #content>
                            <TheConditionalFormattingMain v-if="stateSidebar.visibleFormatting"></TheConditionalFormattingMain>
                            <TheConditionalFormulasMain v-else-if="stateSidebar.visibleConditionalFormulas"></TheConditionalFormulasMain>
                            <TheDiagSettMain v-else-if="stateSidebar.visDiagSett"></TheDiagSettMain>
                            <TheValidMain v-else-if="stateSidebar.visValid"></TheValidMain>
                            <TheSettingsHeader v-else-if="stateSidebar.visHeadSett"></TheSettingsHeader>
                            <TheManagColumns v-else-if="stateSidebar.visManagCols"></TheManagColumns>
                        </template>
                    </TheSidebar>
                </div>
            </transition>
        </div>
        <q-dialog class="app__popup" v-model="showDailog" persistent transition-show="scale" transition-hide="scale">
            <TheFormCreateFastFilter v-if="typePopup === TypePopup.CreateFilter" @closeDialog="closeDialog()"></TheFormCreateFastFilter>
            <TheFormShowStoryRow :idRow="idRow" v-if="typePopup === TypePopup.ShowStoryRow || typePopup === TypePopup.ShowCompare" @closeDialog="closeDialog()" @showCompareForm="showCompareForm"></TheFormShowStoryRow>
        </q-dialog>
        <q-dialog class="app__popup-after" v-model="showDailogAfter" persistent transition-show="scale" transition-hide="scale" backdrop-filter="grayscale(100%)" >
            <TheFormCompareValues :compareRow="compareRow" v-if="typePopup === TypePopup.ShowCompare"></TheFormCompareValues>
        </q-dialog>    
    </div>
</template>

<script setup lang="ts">
import TheMenuPanel from './HeaderComponents/TheMenuPanel.vue'
import TheConditionalFormattingMain from './SidebarComponents/Formatting/TheConditionalFormattingMain.vue'
import TheConditionalFormulasMain from './SidebarComponents/ConditionalFormulas/TheConditionalFormulasMain.vue'
import TheDiagSettMain from './SidebarComponents/Diagram/TheDiagSettMain.vue'
import TheValidMain from './SidebarComponents/Validate/TheValidMain.vue'
import TheSettingsHeader from './HeaderComponents/TheSettingsHeader.vue'
import TheManagColumns from './HeaderComponents/TheSettingsColumns.vue'

import TheTable from './TheTable.vue'
import TheSidebar from './TheSidebar.vue'
import { ref, watch } from 'vue';
import { IStoryRow } from './TheFormShowStoryRow.vue';
import { visSettHeaderDial, visibleSidebar, stateSidebar } from '@/helpers/States/StateDialogs';
import TheFormCreateFastFilter from './TheFormCreateFastFilter.vue'
import TheFormShowStoryRow from './TheFormShowStoryRow.vue'
import TheFormCompareValues from './TheFormCompareValues.vue'

enum TypePopup {
    Default = 0,
    CreateFilter = 1,
    ShowStoryRow = 2,
    ShowCompare = 3,
    ShowSettingsHeader = 4
}
function showCompareForm(row: IStoryRow) {
    typePopup.value = TypePopup.ShowCompare
    showDailogAfter.value = true
    compareRow.value = row
}
let typePopup = ref<TypePopup>(TypePopup.Default)
let showDailog = ref(false)
let showDailogAfter = ref(false)
let idRow = ref<string>('')
let compareRow = ref<IStoryRow | null>(null)
    
function showPopupShowStoryRow(idRowValue: any) {
    showDailog.value = true
    typePopup.value = TypePopup.ShowStoryRow
    idRow.value = idRowValue
}

function closeDialog() {
    showDailog.value = false

    switch (typePopup.value) {
        case TypePopup.ShowSettingsHeader:
            visSettHeaderDial.value = false
            break;
    }

    typePopup.value = TypePopup.Default
}

function showPopupCreateFilterName() {
    showDailog.value = true
    typePopup.value = TypePopup.CreateFilter
}
</script>