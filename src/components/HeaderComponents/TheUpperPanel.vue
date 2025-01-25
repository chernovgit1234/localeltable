<style lang="scss">
.upper-panel {
height: 100%;
align-self: flex-end;
display: flex;
flex-direction: row;

&__body {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 10px;
    align-self: flex-end;
}

&__config {
}

&__config-img {
    width: 36px;
    height: 36px;
}

&__menu {
}
}
.menu-upper-panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    
    &__body {

    }

    &__row-menu {
        
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: 2px;

    }

    &__menu {
        /* margin-bottom: -4px;
        margin-top: 8px;
        padding: 2px 7px;
        overflow: hidden;
        vertical-align: text-bottom; */
    }

    &__menu-btn {
        background-color: transparent;
        padding: 2px 8px;
        font-family: GoogleSans-Regular;
        /* line-height: 1; */
        /* letter-spacing: .2px;
        border-radius: 4px;
        cursor: pointer;
        color: #202124;
        background-color: transparent;
        font-size: 13.5px; */

        border: 1px solid transparent;
    border-radius: 4px;
    box-shadow: none;
    color: #202124;
    cursor: pointer;
    font-size: 14px;
    letter-spacing: .2px;
        &:hover {
            background-color: #e8ebee;
            transition: all 0.1s ease 0s;
        }
    }
}

</style>

<template>
    <div class="upper-panel">
        <div class="upper-panel__body">
            <div class="upper-panel__config">
                <!-- <img  src="../../assets/icons/gsheet-3.svg" alt="conf" class="upper-panel__config-img"> -->
                <q-tooltip  class="custom-tooltip-menu" anchor="bottom middle" self="top middle" :offset="[10, 5]">
                    <span class="cursor-carret_none">Загружена конфигурация: Набор данных 2</span><br/>
                </q-tooltip>
            </div>
            <div class="upper-panel__menu menu-upper-panel">
                <div class="menu-upper-panel__body">
                    <div class="menu-upper-panel__row-menu">
                        <div class="menu-upper-panel__menu" v-for="(item, i) in menuItems" :key="i">
                            <button disabled class="menu-upper-panel__menu-btn">{{item.name}}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {  } from '@vueuse/core';



const menuItems = [
    {name: 'Конфигурации'},
    /* {name: 'Правка'}, */
    {name: 'Вид'},
    {name: 'Формат'},
    /* {name: 'Данные'}, */
    {name: 'Макросы'},
] 
</script>