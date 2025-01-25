<style lang="scss">
//condition-formulas-list = cf-list
.cf-list {
    &__body {
    }

    &__items {
        display: flex;
        flex-direction: column;
        position: relative;
    }
}
.cf-list-item {
    border-top: 1px solid #cccccc;
    cursor: pointer;
    height: 75px;
    padding: 10px;
    position: relative;

    &:hover {
        background-color: #f3f3f3;
    }

    &__body {
        height: 56px;
        width: 100%;
        position: relative;
        background-color: transparent;
        display: grid;
        grid-template-columns: 50px 155px auto;
        gap: 10px;
    }

    &__description {
        margin-bottom: auto;
        margin-right: 8px;
        margin-top: auto;
        position: relative;
        width: 155px;
    }

    &__description-rule-text {
        color: #333333;
        font-size: 13px;
        line-height: 15px;
        max-height: 30px;
        margin-bottom: 4px;
        width: 142px;
        font-family: Roboto400;
        font-weight: bold;

        span {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;  
            overflow: hidden;
        }
    }

    &__description-type-rule-text {
        color: #555;
        height: 14px;
        font-size: 12px;
        line-height: 14px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 155px;
    }
    &__icons {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    &__icon-btn {
        /* position: absolute;
        top: 15px;
        right: 30px; */
    }
    &__preview-cell {
        border: 1px solid rgb(217, 217, 217);
        display: flex;
        display: flex;
        align-items: center;
        padding: 1px;

        div {
            width: 100%;
            display: grid;
            place-items: center;
            font-family: GoogleSans-Regular;
        }
    }
    
}

</style>

<template>
    <div class="cf-list">
        <div class="cf-list__body">
            <div class="cf-list__items">
                <div class="cf-list__item cf-list-item" v-for="(item, i) in list" :key="i" @click="openCondition(item.id)">
                    <div class="cf-list-item__body">
                        <div class="cf-list-item__preview-cell">
                            <div>ИЛИ</div>
                        </div>
                        <div class="cf-list-item__description">
                            <div class="cf-list-item__description-rule-text"><span>Всего правил: {{item.rules.length }}</span></div>
                            <div class="cf-list-item__description-type-rule-text">Это группа правил</div>
                        </div>
                        <div class="cf-list-item__icons" @click.stop>
                            <div class="cf-list-item__icon-btn" style="cursor: help;">
                                <q-icon size="24px" name="notes" style="color: #b9bcbf;"></q-icon>
                                <q-tooltip class="custom-tooltip-info" self="top left">
                                    <span style="font-weight: normal;font-size: 18px;line-height:30px !important;">К строке не будет применена формула, если:</span>
                                    <div v-for="(textRule, i) in item.textRules" :key="i">
                                        <span v-if="i !== 0" style="font-weight: bold;">И </span>
                                        <span>зачение по столбцу
                                            &nbsp;<span style="background-color: #d8e4f7;padding: 0 1px;"> {{ textRule.fieldName }}</span>
                                            &nbsp;<span style="background-color: #fff0d1;padding: 0 3px;">{{ textRule.text }}</span><br/>
                                        </span>
                                    </div>
                                </q-tooltip>
                            </div>
                            <div class="cf-list-item__icon-btn" @click="deleteCondition(item.id)">
                                    <q-icon size="24px" name="delete_forever" style="color: #b9bcbf;"></q-icon>
                                    <q-tooltip class="custom-tooltip-menu" anchor="bottom middle" self="top middle" :offset="[10, 5]">
                                        <span class="cursor-carret_none">Удалить группу правил</span><br/>
                                    </q-tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, defineEmits } from 'vue'
import { useStore } from 'vuex'
import { IConditionFormula } from '@/types/ConditionalFormulasTyles'

const emit = defineEmits(['closeFormCreateCondition', 'changeshowConditionsList'])
const store = useStore()

const list = computed(() => store.getters.getConditionalFormulasArray as IConditionFormula[]) 
function openCondition(id: string) {
    emit('changeshowConditionsList')
    store.dispatch('openCondition', id)
}
function deleteCondition(id: string) {
    store.dispatch('deleteCondition', id)
}

</script>