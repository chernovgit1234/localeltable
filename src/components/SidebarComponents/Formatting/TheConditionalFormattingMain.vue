<style lang="scss">
.formatting {

    &__body {
        display: grid;
        /* grid-template-rows: 60px calc(100vh - 170px); */
    }

    &__rules-list {
        height: 100%;
    }

    &__form-create-rule {
    }

    &__actions {
        border: 1px solid transparent;
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: flex-start;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0px 15px;
        height: 60px;
    }

    &__toggle-content {
        overflow-y: auto;
    }
    &__actions-btn {
        padding: 6px 6px 6px 20px;
        border-radius: 4px;

        &:hover {
            background-color: #1976d215;
        }
    }

    &__add-macros-btn {
        color: #42bdae !important;
        padding: 6px 6px 6px 22px;
        border-radius: 4px;

        &:hover {
            background-color: #42bdaf11;
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
}
</style>

<template>
    <div class="formatting">
        <div class="formatting__body">
            <div class="formatting__actions">
                <button class="btn-out-custom formatting__actions-btn" @click="createRule">
                    <span style="content: \002B;"></span>
                    <span class="formatting__actions-icon">Добавить правило</span>
                </button>
                <button disabled class="btn-out-custom formatting__add-macros-btn">
                    <span style="content: \002B;"></span>
                    <span class="formatting__actions-icon">Добавить макрос</span>
                </button>
            </div>
            <div class="formatting__toggle-content scroll-custom" :style="{'height': visibleUpperPanel ? 'calc(100vh - 210px)' : 'calc(100vh - 165px)'}">
                <div class="formatting__rules-list" v-if="shwList">
                    <ThisConditionalFormattingRulesList @editRule="editRule"></ThisConditionalFormattingRulesList>
                </div>
                <div class="formatting__form-create-rule" v-else>
                    <ThisConditionalFormattingRuleCreateForm ref="crteFormatRule" @closeFormRule="shwList=true"></ThisConditionalFormattingRuleCreateForm>
                </div>
            </div>

        </div> 
    </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import ThisConditionalFormattingRulesList from './ThisConditionalFormattingRulesList.vue'
import ThisConditionalFormattingRuleCreateForm from './ThisConditionalFormattingRuleCreateForm.vue'
import { IConditionFormattingRules } from '@/types/FormattingTypes'
import { useStore } from 'vuex'

const store=useStore()
const visibleUpperPanel=computed(()=>store.getters.visibleUpperPanel)
const crteFormatRule=ref()
let shwList=ref(true)

function createRule() {
    let shwListLocal=shwList.value
    shwList.value=false

    nextTick(() =>{
        if (!shwListLocal) {
            crteFormatRule.value.createNewRule()
        } else {
            crteFormatRule.value.clearFormattingSettings()
        }
    })
}

function editRule(rule: IConditionFormattingRules) {

    if (rule) {
        shwList.value = false

        nextTick(() =>{
            crteFormatRule.value.editRule(rule)
        })
    }
}

</script>