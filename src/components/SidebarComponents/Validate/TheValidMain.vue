<style lang="scss" scoped>
.valid {
    &__body {
        display: grid;
        //grid-template-rows: 60px calc(100vh - 170px);
    }

    &__rules-list {
        height: 100%;
    }

    &__toggle-content {
        overflow-y: auto;
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
}
</style>

<template>
    <div class="valid">
        <div class="valid__body">
            <div class="valid__actions">
                <button class="btn-light-custom-unboard" @click="createRule">
                    <span style="content: \002B;"></span>
                    <span class="actions-icon">Добавить правило</span>
                </button>
            </div>
            <div class="valid__toggle-content scroll-custom" :style="{'height': visibleUpperPanel ? 'calc(100vh - 210px)' : 'calc(100vh - 165px)'}">
                <div class="valid__rules-list" v-if="shwList">
                    <TheValidList @editRule="editRule"></TheValidList>
                </div>
                <div class="valid__form-create-rule" v-else>
                    <TheValidCreateForm ref="crteRule" @closeFormRule="shwList=true"></TheValidCreateForm>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue'
import { useStore } from 'vuex'
import TheValidList from './TheValidList.vue'
import TheValidCreateForm from './TheValidCreateForm.vue'

const store = useStore()

const visibleUpperPanel=computed(()=>store.getters.visibleUpperPanel)
let shwList=ref(true)
const crteRule=ref()


function createRule() {
    let shwListLocal=shwList.value
    shwList.value=false
    nextTick(() =>{
        if (!shwListLocal) {
            crteRule.value.crteRule()
        } else {
            crteRule.value.clearSetts()
        }
    })
}

function editRule(rule: any) {

    if (rule) {
        shwList.value = false

        nextTick(() =>{
            crteRule.value.editRule(rule)
        })
    }
}
</script> 

