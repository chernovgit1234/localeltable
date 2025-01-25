<style lang="scss">
.sidebar {
    width: 330px;
    height: 100% !important;
    padding: 5px 5px 25px 5px;
    background-color: #f9fbfd !important; 
    background-color: #ffcc0007;
    user-select: none;
    outline: none; 

    &__body {
        background-color: #fff;
        border-radius: 16px;  
       /*  height: 100%; */
        border-left: 0;
        border: 2px solid #edf2f7a4;
        /* display: grid; */
        /* border: 1px solid red; */
        /* grid-template-rows: 60px calc(100vh - 105px); */
       /*  display: flex;
        flex-direction: column; */
    }

    &__header {
        height: 60px;
    }
    &__content {
        /* border: 1px solid rgb(0, 253, 245); */
        background-color: #fff;
        font-size: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        position: relative;
        /* border: 1px solid red;  */ 
        /* height: calc(100vh - 145px) */
    }

    &__content-container {
        width: auto;
        user-select: none;
    }
}

.header-sidebar {
    display: flex;
    align-items: center;
    /* height: 60px; */
    padding: 0px 16px;
    border-bottom: 1px solid #dadce0;

    &__body {
        box-shadow: none;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 35px;
    }

    &__title {
        color: #202124 !important;
        font-family: GoogleSans-Medium !important;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px !important;
    }

    &__close-btn {
        cursor: pointer;
        bottom: 50% !important;
        right: 0px !important;
        color: #757575 !important;
        background-color: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        min-height: 30px;
        min-width: 30px;
        font-size: 16px;
        line-height: 18px;

        &:hover {
            background-color: #f3f5f5;
            color: #212121 !important;
        }
    }
}
/* :style="{'grid-template-rows': visibleUpperPanel ? '60px calc(100vh - 190px)' : '60px calc(100vh - 105px)'}" */
/* :style="{'height': visibleSidebar ? 'calc(100vh - 145px)' : 'calc(100vh - 105px)'}" */
</style>

<template>
    <div class="sidebar">
        <div class="sidebar__body" >
            <div class="sidebar__header header-sidebar">
                <div class="header-sidebar__body" >
                    <div class="text-h6 header-sidebar__title">{{textSidebarHeader}}</div>
                    <span @click="closeSidebar" class="header-sidebar__close-btn" id="dialog-close-header"></span>
                </div>
            </div>
            <div class="sidebar__content" :style="{'height': visibleUpperPanel ? 'calc(100vh - 150px)' : 'calc(100vh - 105px)'}">
                <div class="sidebar__content-container">
                    <slot name="content">Контент не передан</slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { resetStateSidebar, stateSidebar, visibleSidebar } from '@/helpers/States/StateDialogs';
import {onMounted, computed} from 'vue'
import { useStore } from 'vuex';
const store = useStore()
const visibleUpperPanel = computed(() => store.getters.visibleUpperPanel)

onMounted(() => {
    (document.querySelector("#dialog-close-header") as HTMLSpanElement).innerHTML = '&#10006'
})

const textSidebarHeader = computed(() => {
    if (stateSidebar.visibleFormatting) {
        return 'Условное форматирование'
    } else if (stateSidebar.visibleConditionalFormulas) {
        return 'Условное применение формулы'
    } else if (stateSidebar.visDiagSett) {
        return 'Редактор диаграм'
    } else if (stateSidebar.visValid) {
        return 'Правила проверки данных'
    } else if (stateSidebar.visHeadSett) {
        return 'Настройка шапки таблицы'
    } else if (stateSidebar.visManagCols) {
        return 'Управление столбцами'
    } else {
        return 'Нет текста'
    }
})

function closeSidebar() {
    visibleSidebar.value = false
    resetStateSidebar()
}
</script>