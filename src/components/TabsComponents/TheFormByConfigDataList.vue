<style>
.config-list {
    background-color: #fff;
    min-width: 60%;
    max-height: 90%;
    min-height: 60%;
    gap: 20px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.config-list__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid var(--table-grey-color);
}
.config-list__content-body {
    min-height: 400px;
    min-width: 100%;
    display: grid;
    place-items: center;
    border: 2px solid var(--table-grey-color);
}
.config-list__content {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
    gap: 15px;
    display: grid;
    grid-template-columns: repeat(5, auto);
    
}

.config-list__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    padding: 5px;
    max-width: 200px;
    max-height: 170px;
    overflow: hidden;
    cursor: pointer;
}
.config-list__item-text {
    min-height: 80px;
    -webkit-line-clamp: 5; /* Число отображаемых строк */
    display: -webkit-box; /* Включаем флексбоксы */
    -webkit-box-orient: vertical; /* Вертикальная ориентация */
    overflow: hidden; /* Обрезаем всё за пределами блока */
}

.config-list__item:hover {
    transition: all 0.3s ease 0s;
    background-color: var(--grey-hover-color) !important;
}
</style>

<template>
    <div class="config-list">
        <div class="config-list__header">
                <div style="white-space: nowrap;" class="text-h6 ">Конфигурации данных</div>
                <q-btn flat round dense icon="close" v-close-popup/>
            </div>
            <div class="config-list__content-body">
                <div class="config-list__content scrollbar-custom">
                    <div class="config-list__item" :style="{'background-color': activeKey === i ? 'var(--ex-light-color)' : 'white' }" @click.stop="applyConfigData(i)" v-for="(item, i) in configDataList" :key="i">
                        <img class="" height="60" width="60" src="../../assets/icons/gsheet-3.svg" alt="" />
                        <small  class="config-list__item-text">{{i+1}}. {{ item.name }}</small>
                        <q-tooltip  class="custom-tooltip">
                            {{ item.name }}
                        </q-tooltip>
                    </div> 
                </div>
                
            </div>
            <div class="config-list__actions">
                <button :disabled="activeKey === null" class="btn" @click.stop>Применить</button>
            </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue';
import { useStore } from 'vuex'

const store = useStore()

const configDataList = computed(() => {
    return store.getters.configDataList
})

let activeKey = ref<number | null>(null)

function applyConfigData(key: number) {
    activeKey.value = activeKey.value !== key ? key : null
}
</script>


