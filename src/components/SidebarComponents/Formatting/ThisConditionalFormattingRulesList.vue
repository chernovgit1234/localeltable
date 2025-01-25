<style lang="scss">

.formatting-rules-list {
    &__body {
        height: 100%;
    }

    &__items {
        overflow: auto !important;
    }
}

.item-formatting-rule {
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
        grid-template-columns: 50px auto;
        gap: 10px;
    }
    &__icon-btn {
        position: absolute;
        top: 15px;
        right: 30px;
    }
    &__icon-vert {
        position: absolute;
        top: 15px;
        left: -17px;
    }
    &__preview-cell {
        border: 1px solid rgb(217, 217, 217);
        display: flex;
        display: flex;
        align-items: center;
        padding: 1px;
        

        div {
            width: 100%;
        }
    }
    &__desc {
        margin-bottom: auto;
        margin-right: 8px;
        margin-top: auto;
        position: relative;
        width: 160px;
    }

    &__desc-rule-text {
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

    &__desc-type-rule-text {
        
        color: #555;
        height: 14px;
        font-size: 12px;
        line-height: 14px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 160px;
    }
}

.ghost {
    background-color: #f3f3f3;
}
</style>

<template>
    <div class="formatting-rules-list">
        <div class="formatting-rules-list__body">
            <draggable
                :list="currentRules"
                :animation="100"
                item-key="id"
                class="formatting-rules-list__items"
                :forceFallback="false"
                ghost-class="ghost"
                @end="renderTable"
            >
                <template #item="{ element }" >
                        <div @click="emit('editRule', element)" class="item-formatting-rule" @mouseover="mouseoverRule(element.id)" @mouseout="mouseoutRule(element.id)">
                            <div class="item-formatting-rule__body">
                                <div :style="element.style" class="item-formatting-rule__preview-cell">
                                    <div :style="element.style">абвг</div>
                                </div>
                                <div class="item-formatting-rule__desc">
                                    <div class="item-formatting-rule__desc-rule-text"><span>{{ element.textRule }}</span></div>
                                    <div class="item-formatting-rule__desc-type-rule-text">{{ element.isMacros ? 'Это макрос' : 'Это правило' }}</div>
                                </div>
                                <div @click.stop="deleteRule(element)" class="item-formatting-rule__icon-btn" v-show="mouseovered && element.id === currentId">
                                    <q-icon size="24px" name="delete_forever" style="color: #b9bcbf;"></q-icon>
                                    <q-tooltip class="custom-tooltip-menu" anchor="bottom middle" self="top middle" :offset="[10, 5]">
                                        <span class="cursor-carret_none">Удалить {{ element.isMacros ? 'макрос' : 'правило' }}</span><br/>
                                    </q-tooltip>
                                </div>
                            </div>

                        </div>
                </template>
            </draggable>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits, computed } from 'vue';
import draggable from 'vuedraggable'
import { IConditionFormattingRules,IPaylDelRule } from '@/types/FormattingTypes';
import { watch } from 'vue';
import { useStore } from 'vuex';
import { instance } from '@/helpers/InstanceHelper';
const store = useStore()

const emit = defineEmits(['editRule'])

let currentRules = ref<IConditionFormattingRules[]>([])
const rules = computed(() => store.getters.getRulesByColumn(store.getters.selectedColumnCommonUse))

watch(rules, (newValue: IConditionFormattingRules[]) => {
    if (newValue !== undefined) {
        currentRules.value = newValue
    } else {
        currentRules.value = []
    }
}, {deep: true, immediate: true})

let mouseovered = ref(false)
let currentId = ref<string | null>(null)

function deleteRule(element: any) {
    const selected: any[] = instance.getSelected()
    const endCol = selected[0][3] as number

    setTimeout(() => {
        store.dispatch('deleteFormatRule', {columnNumber: endCol, idRule: element.id} as IPaylDelRule)
        renderTable()  
    })
}

function mouseoverRule(id: string) {
    currentId.value = id
    mouseovered.value = true
}

function mouseoutRule(id: string) {
    currentId.value = null
    mouseovered.value = false
}

function renderTable() {
    setTimeout(()=> {
        instance.render()
    })
}
</script>