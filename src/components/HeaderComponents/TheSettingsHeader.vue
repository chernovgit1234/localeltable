<style lang="scss">

.header-sett {
&__body {
    padding: 15px;
    //grid-template-rows: 36px calc(100vh - 170px); 
    display: flex;
    flex-direction: column;
    gap: 20px;
}

&__item-color {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

&__color-text {
    font-size: 14px;
    font-family: Roboto400;
    color: #202124 !important;
    line-height: 20px !important;
}

&__color-btn {
    cursor: pointer;
    border-radius: 4px;
    padding: 2px 2px 0px 2px;
    background-color: #edf2fa !important;
    width: 32px;
    height: 32px;
    
    &:hover{
        background-color: #dee3e8 !important; 
    }
}
}

</style>
<template>
    <div class="header-sett">
        <div class="header-sett__body">
            <div class="header-sett__checks">
                <span class="label-section">Отображение строк шапки</span>
                <q-checkbox class="left-check" v-model="showGroupRow"  label="Видеть строку групп" />
                <q-checkbox class="left-check" v-model="showSearchRow" label="Видеть строку поиска" />
            </div>
            <div class="header-sett__colors">
                <span class="label-section">Стилизация групп</span>
                
                <div class="header-sett__item-color">
                    <span class="header-sett__color-text">{{EnumGroupColumnName.GroupColumn1 }}</span>
                    <button class="header-sett__color-btn" >
                        <svg  width="20" height="20" viewBox="0 0 24 24">
                            <path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z" fill="#444746"></path>
                            <path d="M0 20h24v4H0z" :style="{'fill': colorGroupRowColumn1}"></path>
                        </svg>
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-color v-model="colorGroupRowColumn1" />
                        </q-popup-proxy>
                    </button>
                </div>
                <div class="header-sett__item-color" >
                    <span class="header-sett__color-text">{{EnumGroupColumnName.GroupColumn2 }}</span>
                    <button class="header-sett__color-btn">
                        <svg  width="20" height="20" viewBox="0 0 24 24">
                            <path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z" fill="#444746"></path>
                            <path d="M0 20h24v4H0z" :style="{'fill': colorGroupRowColumn2}"></path>
                        </svg>
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-color v-model="colorGroupRowColumn2" />
                        </q-popup-proxy>
                    </button>
                </div>
                <div class="header-sett__item-color">
                    <span class="header-sett__color-text">{{EnumGroupColumnName.GroupColumn3 }}</span>
                    <button class="header-sett__color-btn" >
                        <svg  width="20" height="20" viewBox="0 0 24 24">
                            <path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z" fill="#444746"></path>
                            <path d="M0 20h24v4H0z" :style="{'fill': colorGroupRowColumn3}"></path>
                        </svg>
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-color v-model="colorGroupRowColumn3" />
                        </q-popup-proxy>
                    </button>
                </div>
            </div>
            <div>
                <button class="btn-custom" @click.stop="saveSettings">Сохранить</button>
            </div>
        </div>
    </div>  
</template>

<script setup lang="ts">
import { ref, defineEmits,onMounted } from 'vue';
import { LocalStorageHandler } from '../../utils/LocalStorageHandler';
import {nestedHighHeaderGroup, nestedSearchRowHeader, nestedHighHeader} from '../../helpers/ColumnsHelper'
import {instance} from '../../helpers/InstanceHelper'
import {EnumGroupColumnName} from '../../enums/EnumColumnValues'
import {IColumnConfifuration} from '../../types/LocalStorageTypes'

const emit = defineEmits(['closeDialog'])

let showGroupRow = ref(LocalStorageHandler.getItem('showGroupRow') ?? true)
let showSearchRow = ref(LocalStorageHandler.getItem('showSearchRow') ?? true)
let colorGroupRowColumn1 = ref<string>(LocalStorageHandler.getItem('colorGroupRowColumn1') ?? '#ffffff')
let colorGroupRowColumn2 = ref<string>(LocalStorageHandler.getItem('colorGroupRowColumn2') ?? '#ffffff')
let colorGroupRowColumn3 = ref<string>(LocalStorageHandler.getItem('colorGroupRowColumn3') ?? '#ffffff')

function saveSettings() {
    LocalStorageHandler.setItem('showGroupRow', showGroupRow.value);
    LocalStorageHandler.setItem('showSearchRow', showSearchRow.value);

    LocalStorageHandler.setItem('colorGroupRowColumn1', colorGroupRowColumn1.value);
    LocalStorageHandler.setItem('colorGroupRowColumn2', colorGroupRowColumn2.value);
    LocalStorageHandler.setItem('colorGroupRowColumn3', colorGroupRowColumn3.value);

    const showGroupRowLocal = LocalStorageHandler.getItem('showGroupRow') as boolean
    const showSearchRowLocal = LocalStorageHandler.getItem('showSearchRow') as boolean

    let headerColumnsConfifuration: IColumnConfifuration = {
        activeGroupRow: showGroupRowLocal,
        activeSearchRow: showSearchRowLocal,
        activeFilterRow: true
    }

    LocalStorageHandler.setItem('headerColumnsConfifuration', headerColumnsConfifuration);

    if (showGroupRowLocal === true && showSearchRowLocal === true) {
        instance.updateSettings({
            nestedHeaders: [nestedHighHeaderGroup,nestedSearchRowHeader, nestedHighHeader]
        })
    } else if (showGroupRowLocal === false && showSearchRowLocal === true) {
        instance.updateSettings({
            nestedHeaders: [nestedSearchRowHeader, nestedHighHeader]
        })
    } else if (showGroupRowLocal === true && showSearchRowLocal === false) {
        instance.updateSettings({
            nestedHeaders: [nestedHighHeaderGroup, nestedHighHeader]
        })
    } else {
        instance.updateSettings({
            nestedHeaders: [nestedHighHeader]
        })
    }
}

</script>