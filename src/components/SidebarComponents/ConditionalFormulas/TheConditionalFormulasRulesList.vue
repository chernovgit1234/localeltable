<style lang="scss">
//condition-formulas-list = cf-rules-list
.cf-rules-list {

    &__body {
        overflow: hidden;
        height: 100%;
    }

    &__items {
        display: flex;
        flex-direction: column;
        position: relative;
    }

    &__item {

    }
}
.cf-rules-list-item {
    border-top: 1px solid #cccccc;
    cursor: pointer;
    height: 75px;
    padding: 10px;
    position: relative;

    &:hover {
        background-color: #f3f3f3 !important;
    }

    &__body {
        height: 56px;
        width: 100%;
        position: relative;
        background-color: transparent;
        display: grid;
        grid-template-columns: 50px auto;
        gap: 10px;
    }

    &__description {
        margin-bottom: auto;
        margin-right: 8px;
        margin-top: auto;
        position: relative;
        width: 142px;
    }

    &__description-rule-text {
        color: #333333;
        font-size: 13px;
        line-height: 15px;
        max-height: 30px;
        margin-bottom: 4px;
        width: 160px;
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
        overflow: hidden;
        text-overflow: ellipsis;
        width: 142px;
    }

    &__icon-btn {
        position: absolute;
        top: 15px;
        right: 30px;
    }

    &__preview-cell {
        border: 1px solid rgb(217, 217, 217);
        display: flex;
        display: flex;
        align-items: center;
        padding: 1px;
        background-color: #fff;

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
    <div class="cf-rules-list">
        <div class="cf-rules-list__body">
            <div class="cf-rules-list__items scroll-custom">
                <div 
                    class="cf-rules-list__item cf-rules-list-item" 
                    v-for="(rule, i) in currentConditionRules" 
                    :key="i" 
                    @click="emit('editRule', rule), idEditedRule = rule.id"
                    :style="{'background-color': idEditedRule === rule.id ? '#f3f3f3' : '#fff' }"
                >
                    <div class="cf-rules-list-item__body">
                        <div class="cf-rules-list-item__preview-cell">
                            <div>И</div>
                        </div>
                        <div class="cf-rules-list-item__description">
                            <div class="cf-rules-list-item__description-rule-text"><span>{{ rule.textRule }}</span></div>
                            <div class="cf-rules-list-item__description-type-rule-text">Это правило</div>
                        </div>
                        <div class="cf-rules-list-item__icon-btn" @click.stop="deleteRule(rule.id)">
                            <q-icon size="24px" name="delete_forever" style="color: #b9bcbf;"></q-icon>
                            <q-tooltip class="custom-tooltip-menu" anchor="bottom middle" self="top middle" :offset="[10, 5]">
                                <span class="cursor-carret_none">Удалить правило</span><br/>
                            </q-tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IConditionFormula, IConditionFormulasRule } from '@/types/ConditionalFormulasTyles';
import { computed, ref, defineEmits } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const emit = defineEmits(['editRule'])

let idEditedRule = ref('')

const currentConditionRules = computed(() => store.getters.getCurrentConditionRules) 

function deleteRule(id: string) {
    store.dispatch('deleteConditionRule', id)
}
</script>