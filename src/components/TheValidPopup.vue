<style lang='scss' scoped>
.valid-popup {
    border-left: 4px solid #d93025;
	height: auto;
	width: 200px;
    z-index: 200 !important; 
    position: fixed;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 4px 8px 3px rgba(60, 64, 67, .15);
    font-size: 13px;
    overflow-wrap: break-word;
    padding: 12px;
    -webkit-user-select: text;
    user-select: none;

    strong {
        color: #d93025;
        display: block;
        font-family: Roboto400;
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
        margin-bottom: 8px;
    }

    span {
        display: block;
    }

    &__close-btn {
        position: absolute;
        right: 4px;
        top: 4px;
        cursor: pointer;
        color: #757575 !important;
        background-color: transparent;
        border-radius: 100%;
        height: 25px;
        width: 25px;
        font-size: 14px;

        &:hover {
            background-color: #f3f5f5;
            color: #212121 !important;
        }
    }
}

#close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
<template>
    <div v-show="show && showLocal" id="valid-popup" class="valid-popup">
        <strong>Ошибка!</strong>
        <span @click="close" class="valid-popup__close-btn" id="close-btn"></span>
        <span>{{errorTxt}}</span>
    </div>
</template>

<script lang='ts' setup>
import {computed,ref,watch,onMounted} from 'vue'
import {useStore} from 'vuex'
onMounted(() => {
    (document.querySelector("#close-btn") as HTMLSpanElement).innerHTML = '&#10006'
})
let showLocal=ref(true)
const store=useStore()
const show = computed(()=>store.getters.errorValid)
const errorTxt = computed(()=>store.getters.errorTxt)

watch(show,(val:boolean)=>{
    showLocal.value=val
})
watch(errorTxt,(val:string)=>{
    if (val) showLocal.value=true
})

function close() {
    showLocal.value=false
    store.dispatch('resetValid')
}
</script>
