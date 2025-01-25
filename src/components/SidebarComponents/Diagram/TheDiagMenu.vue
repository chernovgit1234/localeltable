<style lang="scss" scoped>
/* .param-menu {

&__list {
    display: flex;
    flex-direction: column;
    user-select: none;
    overflow-y: auto;
    padding: 8px 0;
    border: 1px solid transparent;
    border-radius: 4px;
    box-shadow: 0 2px 6px 2px rgba(60, 64, 67, .15) !important;
    width: 200px;
}

&__item {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 30px;
    word-break: break-word;
    font-family: Roboto400;
    color: #202124;
    font-size: 14px;
    

    &:hover{
        background-color: #f1f3f4;    
    }
}
} */
</style>

<template>
    <div class="diag-view__menu">
                <q-icon 
                    name="more_vert" 
                    color="grey-8" 
                    size='sm'
                    style="cursor: pointer"> 
                    <q-menu fit anchor="bottom end" self="top left" aito-close>
                        <div class="param-menu__list">
                            <div class="param-menu__item" @click="changeD">Изменить диаграмму</div>
                            <div class="param-menu__item" @click="deleteD">Удалить диаграмму</div>
                            <div class="param-menu__item" @click="emit('saveAsPDF')">Скачать диаграмму (PDF)</div>
                            <div class="param-menu__item" @click="close">Закрыть окно</div>
                        </div>
                    </q-menu>
                </q-icon>
            </div>
</template>

<script lang="ts" setup>
import { defineEmits} from 'vue'
import {resetStateSidebar, stateSidebar, visDiagDial, visDragDial, visibleSidebar } from '@/helpers/States/StateDialogs';

const emit = defineEmits(['saveAsPDF', 'deleteDiag'])

function changeD() {
    visibleSidebar.value=true
    stateSidebar.visDiagSett=true
}
function deleteD() {
    visDragDial.value=false
    visDiagDial.value=false

    resetStateSidebar()
    visibleSidebar.value=false
    stateSidebar.visDiagSett=false
    emit('deleteDiag')
}
function close() {
    visDragDial.value=false
    visDiagDial.value=false
}


</script>
