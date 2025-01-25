<style lang="scss">
.vdr-handle, .vdr-handle-tr, .handle, .handle-tr {
    color: #1a73e8;
    background-color: #1a73e8;
    z-index: 1003 !important;
    border: 1px solid transparent;
}
.drag-component {
    min-height: 50px; 
    min-width: 50px;
    height: 400px; 
    width: 700px;

    z-index: 1002 !important; 
    border: none !important;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: fixed;
    background-color: transparent !important;
    border-radius: 0px !important;
    border: 1px solid #dddfe3 !important;
}

.popup {
    user-select: none;
    border: 2px solid transparent;
    z-index: 1002 !important;
    position: relative;
    background-color: #fff !important;
    min-height: 100%;
    color: #000;
    cursor: move;
    font-weight: 400;
    line-height: 24px;
    padding: 24px;

    &__header {
        margin-bottom: 16px;
        height: 30px;
        width: 100%;
        position: relative;
    }

    &__header-title {
        padding-right: 15px;
        line-height: 28px;
        color: #202124 !important;
        font-family: GoogleSans-Regular !important;
        font-size: 22px !important;
        font-weight: 400;
        text-align: start;

    }

    &__header-close-btn {
        cursor: pointer;
        position: absolute !important;
        top: 0px !important;
        right: 0px !important;
        color: #757575 !important;
        background-color: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        height: 30px;
        width: 30px;
        font-size: 16px;
        line-height: 18px;

        &:hover {
            background-color: #f3f5f5;
            color: #212121 !important;
        }
    }

    &__content {
        position: absolute;
        inset: 0;
        background-color: #fff;
        line-height: 1.4em;
        word-wrap: break-word;
        cursor: default;
        font-size: 14px;
    }
}
</style>

<template>
    <Vue3DraggableResizable  class="drag-component" style="border-radius: 12px;"
        v-model:x="x"
        v-model:y="y"
        :draggable="true"
        :resizable="props.resizable"
        @drag-end="dragend(x, y)"
        @deactivated="focus"
        @activated="focus"
        @resizing="resizing"
    >
        <div id="popup" class="popup" :style="{'border-color': focused ? '#1a73e8':'transparent'}">
            <div  v-show="title.length" class="popup__header">
                <div class="text-h6 popup__header-title">{{props.title}}</div>
                <span @click="emit('closeDialog')" class="popup__header-close-btn modal-dialog-title-close" id="dialog-close-title"></span>
            </div>
            <div  class="popup__content" >
                <slot name="form">Форма не передана</slot>
            </div>
        </div>
    </Vue3DraggableResizable>
    <!-- <Vue3DraggableResizable  class="drag-component" style="border-radius: 12px;"
        v-model:x="x"
        v-model:y="y"
        :draggable="true"
        :resizable="false"
        @drag-end="dragend(x, y)"
    >
        <div id="popup" class="popup">
            <div class="popup__header">
                <div class="text-h6 popup__header-title">{{props.title}}</div>
                <span @mousedown.stop @click="emit('closeDialog')" class="popup__header-close-btn modal-dialog-title-close" id="dialog-close-title"></span>
            </div>
            <div @mousedown.stop class="popup__content">
                <slot name="form">Форма не передана</slot>
            </div>
        </div>
    </Vue3DraggableResizable> -->
</template>

<script lang="ts" setup>
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import {onMounted, ref, defineEmits, defineProps} from 'vue'
import { LocalStorageHandler } from '../../utils/LocalStorageHandler';

const emit = defineEmits(['closeDialog', 'resizing'])
const props = defineProps<{
    title: string,
    resizable: boolean
}>()

let x: any = ref(LocalStorageHandler.getItem('pageXcustomDialog') || 0)
let y: any = ref(LocalStorageHandler.getItem('pageYcustomDialog') || 0) 
let focused = ref(false)

onMounted(() => {
    (document.querySelector("#dialog-close-title") as HTMLSpanElement).innerHTML = '&#10006'
})
function resizing(e: any) {
    let coord = {...e}
    emit('resizing', {w: coord.w, h: coord.h})
}
function focus() {
    focused.value = !focused.value 
}
function dragend(posX: any, posY: any) {

    const popup: HTMLDivElement = document.querySelector("#popup") as HTMLDivElement
    const rect: any = popup.getBoundingClientRect();
    const clientWidth: number = document.documentElement.clientWidth
    const clientHeight: number = document.documentElement.clientHeight

    let left: number = rect.left
    let top: number = rect.top
    if (rect.left < 0) {
        x.value = 1
        left = 1
    }
    if (posY < 0) {
        y.value = 1
        top = 1
    }

    if (clientWidth < left+popup.offsetWidth) {
        x.value = clientWidth - 1 - popup.offsetWidth
        left = clientWidth - 1 - popup.offsetWidth
    }

    if (clientHeight < top+popup.offsetHeight) {
        y.value = clientHeight - 1 - popup.offsetHeight
        top = clientHeight - 1 - popup.offsetHeight
    }

    LocalStorageHandler.setItem('pageXcustomDialog', left);
    LocalStorageHandler.setItem('pageYcustomDialog', top);
}
</script>

