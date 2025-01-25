<style lang="scss" scoped>
.valid-list {

&__body {
    height: 100%;
}

&__items {
    overflow: auto !important;
}

}
.item-valid {
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
        position: relative;
        background-color: transparent;
        gap: 10px;
        display: flex;
        justify-content: space-between;

    }

    &__desc {
        margin-bottom: auto;
        margin-right: 8px;
        margin-top: auto;
        position: relative;
        width: 160px;
    }

    &__desc-text {
        color: #333333;
        font-size: 13px;
        line-height: 15px;
        max-height: 30px;
        margin-bottom: 4px;
        width: 220px;
        font-family: Roboto400;
        font-weight: bold;

        span {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;  
            overflow: hidden;
        }
    }

    &__desc-rule-text {
        display: block;
        color: #555;
        height: 14px;
        font-size: 12px;
        line-height: 14px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 220px;
    }

    &__actions {
        display: flex;
        align-items: center;
        gap: 20px;

    }

    &__color {
        border: 1px solid #cccccc;
        background-color: #ffffff;
        width: 20px;
        height: 20px;
    }
}

</style>

<template>
    <div class="valid-list">
        <div class="valid-list__body">
            <div class="valid-list__items">
                <div v-if=currentRule  @click="emit('editRule', currentRule)" class="valid-list__item item-valid">
                    <div class="item-valid__body">
                        <div class="item-valid__desc">
                            <div class="item-valid__desc-text">
                                <span>{{ currentRule.textRule }}</span>
                            </div>
                            <span class="item-valid__desc-rule-text">Это правило</span>
                        </div>
                        <div class="item-valid__actions">
                            <div class="item-valid__icon-btn" @click.stop="deleteRule(currentRule)">
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
    </div>
</template>

<script lang="ts" setup>
import { instance } from '@/helpers/InstanceHelper';
import { IValidRule } from '@/store/valid/types';
import { IPaylDelRule } from '@/types/FormattingTypes';
import { computed, ref, watch, defineEmits } from 'vue'
import { useStore } from 'vuex';
const store=useStore()
const emit = defineEmits(['editRule'])

let currentRule = ref<IValidRule | null>(null)
const rule = computed(() => store.getters.getValidRuleByColumn(store.getters.selectedColumnCommonUse)) 

watch(rule, (val: IValidRule) => {
    console.log('watch(rule,', val)
    if (val !== undefined) {
        currentRule.value=val
    } else {
        currentRule.value=null
    }
}, {immediate: true})

function deleteRule(el: any) {
    const selected: any[] = instance.getSelected()
    const endCol = selected[0][3] as number

    setTimeout(() => {
        store.dispatch('deleteValidRule', {columnNumber: endCol, idRule: el.id} as IPaylDelRule)
        renderTable()  
    })
}

function renderTable() {
    setTimeout(()=> {
        instance.render()
    })
}
</script>

