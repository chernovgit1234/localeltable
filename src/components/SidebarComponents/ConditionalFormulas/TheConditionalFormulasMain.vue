<style lang="scss">
.condition-formulas {

    &__body {
        display: grid;
        grid-template-rows: 60px calc(100vh - 170px);
    }

    &__actions {
        border: 1px solid transparent;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0px 15px;
        height: 60px;
    }

    &__actions-btn {
        padding: 8px 10px 8px 24px;
        border-radius: 4px;
        
        &:hover {
            background-color: #1976d215;
        }
    }

    &__actions-icon {
        position: relative;

        &::before {
            content: '\002B';
            font-size: 24px;
            position: absolute;
            left: -18px;
            top: -1px;
            font-size: 24px;
        }
    }

    &__toggle-content {
        overflow-y: auto;
    }

    &__list {
        min-height: 100%;
    }
}
</style>

<template>
    <div class="condition-formulas">
        <div class="condition-formulas__body">
            <div class="condition-formulas__actions">
                <button @click="addRule" class="btn-light-custom-unboard">
                    <span style="content: \002B;"></span>
                    <span class="condition-formulas__actions-icon">Добавить правило</span>
                </button>
            </div>
            <div class="condition-formulas__toggle-content scroll-custom" :style="{'height': visibleUpperPanel ? 'calc(100vh - 210px)' : 'calc(100vh - 165px)'}">
                <div class="condition-formulas__list" v-if="showConditionsList">
                    <TheConditionalFormulasList @changeshowConditionsList="changeshowConditionsList"></TheConditionalFormulasList>
                </div>
                <div class="condition-formulas__by-field" v-else>
                    <TheConditionalFormulasByFieldMain @closeFormCreateCondition="closeFormCreateCondition()"></TheConditionalFormulasByFieldMain>
                </div>
            </div>
        </div> 
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import TheConditionalFormulasList from './TheConditionalFormulasList.vue'
import TheConditionalFormulasByFieldMain from './TheConditionalFormulasByFieldMain.vue'
import { useStore } from 'vuex';

const store = useStore()

const visibleUpperPanel = computed(() => store.getters.visibleUpperPanel)

let showConditionsList = ref(true)

function changeshowConditionsList() {
    showConditionsList.value = false
}

function closeFormCreateCondition() {
    showConditionsList.value = true
}

function addRule() {
    store.dispatch('resetIdCurrentCondition')
    showConditionsList.value = false
}

</script>