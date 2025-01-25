<style lang="scss">
.settings-menu-drop-down {
    width:350px;
    user-select: none;
    
&__body {
   
    
}

&__row {
    padding: 6px 10px 6px 10px;
    white-space: normal;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;

    &:hover {
        border: none;
        background-color: #f1f3f4;
    }
}

&__img {
    margin-right: 10px !important;
    width: 18px;
    height: 18px;
}

&__text {
    color: #202124;
    font-size: 14px;
    letter-spacing: .2px;
    line-height: 20px;
    font-family: Roboto400;
    width: 100%;
    display: flex;
    justify-content: space-between;
}
&__name {
    
}
&__code {
    color: rgb(197, 197, 197);
    font-size: 14px;
    text-align: end;
    letter-spacing: .2px;
    line-height: 20px;
    font-family: GoogleSans-Bold;
    color: #898f94;
}
}

</style>

<template>
    <div class="settings-menu-drop-down">
        <div class="settings-menu-drop-down__body">
            <div class="settings-menu-drop-down__row" @click="showManagCols">
                <div class="settings-menu-drop-down__text">
                    <span class="settings-menu-drop-down__name">Управление столбцами</span>
                    <span class="settings-menu-drop-down__code">Shift+Ctrl+Q</span>
                </div>
            </div>
            <div class="settings-menu-drop-down__row" @click="showSettingsHeaderTable">
                <div class="settings-menu-drop-down__text">
                    <span class="settings-menu-drop-down__name">Настройка шапки</span>
                    <span class="settings-menu-drop-down__code">Shift+Ctrl+F</span>
                </div>
            </div>
            <div class="settings-menu-drop-down__row" @click="showConditionalFormulas">
                <div class="settings-menu-drop-down__text">
                    <span class="settings-menu-drop-down__name">Настройки применения формулы</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { visSettHeaderDial, visibleDropDownMenu, visibleDropDownSettingsMenu, visSettColsDial, stateSidebar, resetStateSidebar, visibleSidebar } from '@/helpers/States/StateDialogs';

function showConditionalFormulas() {
    resetStateSidebar()
    visibleSidebar.value = true
    stateSidebar.visibleConditionalFormulas = true
}

function showSettingsHeaderTable() {
    resetStateSidebar()
    visibleSidebar.value = true
    stateSidebar.visHeadSett = true
}
function showManagCols() {
    resetStateSidebar()
    visibleSidebar.value = true
    stateSidebar.visManagCols = true
}

function ashowSettingsHeaderTable() {

    //отключение выпадашек
    /* visibleDropDownMenu.value = false
    visibleDropDownSettingsMenu.value = false */
    
    //отключение других окон
    //visSettColsDial.value = false

    //включение выбранного окна
    //visSettHeaderDial.value = true


}
function ashowSettingsColumnsTable() {
    //visibleDropDownMenu.value = false
    //visibleDropDownSettingsMenu.value = false

    //отключение других окон
    //visSettHeaderDial.value = false
    //включение выбранного окна
    //visSettColsDial.value = true
}


</script>