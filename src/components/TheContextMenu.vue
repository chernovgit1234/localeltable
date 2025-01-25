<style lang="scss">
.context-menu {
    width: 340px; 
    border-radius: 3px;
    background-color: rgb(255, 255, 255); 
    z-index: 200 !important; 
    position: fixed;
    -webkit-box-shadow: 0px 0px 10px 2px rgba(34, 60, 80, 0.2);
    -moz-box-shadow: 0px 0px 10px 2px rgba(34, 60, 80, 0.2);
    box-shadow: 0px 0px 10px 2px rgba(34, 60, 80, 0.2);
    user-select: none;
    
    &__body {
        padding: 8px 1px;
    }

    &__list {
        
    }

    &__item {
    }
}

.item-context-menu {
    background-color: #fff;
    user-select: none;
    display: grid;
    grid-template-columns: 30px auto 60px;
    align-items: center;
   
    cursor: pointer;
    padding: 0 10px;
    height: 32px;
    transition: all 0.2s ease 0s;
    width: 100%;
    
    &:hover {
        background-color: #f1f3f4;
    }

    &__img {
        /* max-width: 16px;
        max-height: 16px; */
        color: #444746;
        /* display: grid;
        place-items: center; */
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    &__name-command {
        text-align: left;
        font-size: 15px;
        letter-spacing: 0.1px;
        color: #202124;
        font-size: 14px;
        letter-spacing: .2px;
        line-height: 20px;
        font-family: GoogleSans-Medium;
    }

    &__code {
        color: rgb(197, 197, 197);
        font-size: 14px;
        text-align: end;
        letter-spacing: .2px;
        line-height: 20px;
        font-family: GoogleSans-Bold;
        color: #898f94;        
    }

    &__hr {
        margin: 10px 0;
        background-color: #e0dada !important;
        height: 0.5px;
    }
}

</style>

<template>
    <div class="context-menu" oncontextmenu="return false;">
        <div class="context-menu__body">
            <ul class="context-menu__list">
                <button :disabled="disableGroupRow" class="context-menu__item item-context-menu" @click="cut" id="cut-btn">
                    <q-icon size="18px" name="content_cut"></q-icon>
                    <span class="item-context-menu__name-command">Вырезать</span>
                    <span class="item-context-menu__code">Ctrl-X</span>
                </button>
                <button class="context-menu__item item-context-menu" @click="copy" id="copy-btn">
                    <q-icon size="18px" name="content_copy"></q-icon>
                    <span class="item-context-menu__name-command">Копировать</span>
                    <span class="item-context-menu__code">Ctrl-C</span>
                </button>
                <button :disabled="disableGroupRow" class="context-menu__item item-context-menu" @click.prevent="paste" id="paste-btn"> 
                    <q-icon size="18px" name="content_paste"></q-icon>
                    <span class="item-context-menu__name-command">Вставить</span>
                    <span class="item-context-menu__code">Ctrl-V</span>
                </button>
                
                <div class="item-context-menu__hr" v-if="hiddenRowCommand"></div>

                <button v-if="hiddenRowCommand" :disabled="false" class="context-menu__item item-context-menu">        
                    <div class="item-context-menu__img">
                        <q-icon size="20px" name="add"></q-icon>
                    </div>
                    <span class="item-context-menu__name-command">Добавить строку выше</span>
                </button>
                <button v-if="hiddenRowCommand" class="context-menu__item item-context-menu" @click="showStory">
                    <q-icon size="18px" name="history"></q-icon>
                    <span class="item-context-menu__name-command">История изменений</span>
                </button>

                <div class="item-context-menu__hr" v-if="hiddenRowCommand"></div>
                
                <button v-if="hiddenRowCommand" :disabled="disabledDeleteBtn" class="context-menu__item item-context-menu" @click="deleteRow">
                    <div class="item-context-menu__img">
                        <q-icon color="red" size="20px" name="delete_forever"></q-icon>
                    </div>
                    <span class="item-context-menu__name-command" style="color: #d93025;">{{textDeleteBtn}}</span>
                </button>
                
                <div v-if="!hiddenRowCommand" class="item-context-menu__hr"></div>

                <button :disabled="disabledApplyFormulaBtn" v-if="columnCommand" class="context-menu__item item-context-menu" @click="emit('applyFormulaFromContextMenu')">
                    <div class="item-context-menu__img">
                        <q-icon style="margin-left: -2px;" size="20px" name="functions"></q-icon>
                    </div>
                    <span class="item-context-menu__name-command">Применить формулу </span>
                </button>
                <button :disabled="disabledHiddenBtn" v-if="columnCommand && visibleDeleteFormulaBtn" class="context-menu__item item-context-menu" @click="emit('resetFormulaFromContextMenu')">
                    <div class="item-context-menu__img">
                        <q-icon  size="20px" name="functions"></q-icon>
                    </div>
                    <span class="item-context-menu__name-command">Удалить формулу</span>
                </button>
                                
                <button :disabled="disabledHiddenBtn" v-if="columnCommand && !posFixedColumnEqualSelectedColumn" class="context-menu__item item-context-menu" @click.stop="fixColumn">
                    <div class="item-context-menu__img">
                        <q-icon style="margin-left: -2px;" size="20px" name="attach_file"></q-icon>
                    </div>
                    <span class="item-context-menu__name-command">Закрепить столбец</span>
                </button>
                <button :disabled="disabledHiddenBtn" v-else-if="columnCommand && posFixedColumnEqualSelectedColumn" class="context-menu__item item-context-menu" @click="defixColumn">
                    <div class="item-context-menu__img">
                        <q-icon style="margin-left: -2px;" size="20px" name="attach_file"></q-icon>
                    </div>
                    <span class="item-context-menu__name-command">Открепить столбец</span>
                </button>
                <button :disabled="disabledHiddenBtn" v-if="hiddenHiddenBtn" @click="hideColumn" class="context-menu__item item-context-menu">
                    <q-icon size="18px" name="visibility_off"></q-icon>
                    <span class="item-context-menu__name-command">Скрыть выделенные столбцы</span>
                </button>
                <button v-if="columnCommand" class="context-menu__item item-context-menu" @click="shwFormat">
                    <q-icon size="18px" name="format_paint"></q-icon>
                    <span class="item-context-menu__name-command">Условное форматирование</span>
                </button>
                <button v-if="columnCommand" class="context-menu__item item-context-menu" @click="shwValid">
                    <q-icon style="margin-left: 2px;"  size="20px" name="playlist_add_check"></q-icon>
                    <span class="item-context-menu__name-command">Настроить проверку данных</span>
                </button>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { EnumColumnTableNumber, EnumFieldName } from '@/enums/EnumColumnValues';
import { EnumTypeField } from '@/enums/EnumsByFilter';
import { fieldsInfoMap } from '@/helpers/ColumnsHelper';
import { IUserFormula } from '@/helpers/HSFormula/Types';
import { instance } from '@/helpers/InstanceHelper';
import { closeContextMenu, visibleContextMenu, visibleSidebar, stateSidebar, resetStateSidebar } from '@/helpers/States/StateDialogs';
import { headerColumnsConfifuration } from '@/helpers/States/StateLocalStorage';
import { IModelData } from '@/types/TableTypes';
import { LocalStorageHandler } from '@/utils/LocalStorageHandler';
import { CopyPaste, AutoColumnSize } from 'handsontable/plugins';
import { watchEffect } from 'vue';
import { watch } from 'vue';
import { computed, ref, onUpdated, defineEmits, defineProps,withDefaults } from 'vue';
import { useStore } from 'vuex'

const store = useStore()

const props = defineProps<{
    selectRow: number,
    selectColumn: number
}>()


const emit = defineEmits([
    'deleteRowsFromContextMenu', 
    'hiddenColumnsHideFromContextMenu', 
    'showStoryRowFromContextMenu', 
    'applyFormulaFromContextMenu',
    'resetFormulaFromContextMenu'
])

onUpdated(() => {
    deleteRowsIdxs.value = store.getters.selectedRowsRange
})


let copyPastePlugin: any
const deleteRowsIdxs = ref<number[]>([])


const disabledApplyFormulaBtn = computed(() => {

    let typeSelectedColumn: EnumTypeField = store.getters.typeColumnByColumnNumber(props.selectColumn) 
    let typeValue: EnumTypeField | string | null = null
    let dependsColumns: EnumFieldName[] | string[] = []
    const fakeCurrentFormula = store.getters.fakeCurrentFormula as IUserFormula
    if (fakeCurrentFormula) {
        typeValue = fakeCurrentFormula.typeValue 
        dependsColumns = fakeCurrentFormula.depends
    }

    let selectedColumnName = fieldsInfoMap.get(props.selectColumn)?.fieldName

    //1 условие: если тип результата фэйк формулы и тип колонки соответстувуют 
    //2 и 3 условие: если колонка (а именно ее выбранное название) поля нет среди зависимостей формулы 
    return typeSelectedColumn === typeValue && selectedColumnName && (dependsColumns.indexOf(selectedColumnName) === -1) ? false : true
})
const visibleDeleteFormulaBtn = computed(() => store.getters.formulaObjectByColumn(props.selectColumn))

//для кнопки скрытия
const disabledHiddenBtn = computed(() => {
    //если нажали на колонку с номерами строк
    return props.selectColumn < EnumColumnTableNumber.Type ? true : false
})
const disableGroupRow = computed(() => {
    const headerColumnsConfifuration = LocalStorageHandler.getItem('headerColumnsConfifuration')
    const isActiveGroupRow = headerColumnsConfifuration?.activeGroupRow
    const isActiveSearchRow = headerColumnsConfifuration?.activeSearchRow

    if ((isActiveGroupRow && isActiveSearchRow && props.selectRow === -3) || 
        (isActiveGroupRow && !isActiveSearchRow && props.selectRow === -2)) {
        return true
    } else {
        return false
    }
})

//если нажата на шапку
const hiddenHiddenBtn = computed(() => props.selectRow < 0 ? true : false)

const columnCommand = computed(() => {
    const headerColumnsConfifuration = LocalStorageHandler.getItem('headerColumnsConfifuration')
    const isActiveGroupRow = headerColumnsConfifuration?.activeGroupRow
    const isActiveSearchRow = headerColumnsConfifuration?.activeSearchRow
    
    //если нажата строка, то не отображать
    if (props.selectRow >= 0) {
        return false
    }

    if (isActiveGroupRow && isActiveSearchRow) {
        return props.selectRow > -3 ? true : false
    } else if (!isActiveGroupRow && isActiveSearchRow) {

        return props.selectRow >= -2 ? true : false
    } else if (isActiveGroupRow && !isActiveSearchRow) {
        return props.selectRow >= -1 ? true : false
    } else {
        return true
    }
})

//для кнопки удаления
//если выбранная строка это шапка
const hiddenRowCommand = computed(() => props.selectRow < 0 ? false : true)

const disabledDeleteBtn = computed(() => props.selectRow < 0 || deleteRowsIdxs.value.length === 0 ? true : false)
const textDeleteBtn = computed(() => deleteRowsIdxs.value.length > 1 ? `Удалить строки` : 'Удалить строку')

let posFixedColumnEqualSelectedColumn = ref(false)
watchEffect(() => {
    if (props.selectColumn+1 === (LocalStorageHandler.getItem('posFixedColumn') as number)) {
        posFixedColumnEqualSelectedColumn.value = true
    } else {
        posFixedColumnEqualSelectedColumn.value = false
    }
})

function fixColumn() {
    console.log('fixColumn')
    let posFixCol = props.selectColumn + 1
    instance.updateSettings({fixedColumnsStart: posFixCol})
    LocalStorageHandler.setItem('posFixedColumn', posFixCol);

    //visibleContextMenu.value = false
    closeContextMenu()
    //emit('closeContextMenu')
}
function defixColumn() {
    let posFixCol = 0
    instance.updateSettings({fixedColumnsStart: posFixCol})
    LocalStorageHandler.setItem('posFixedColumn', posFixCol);

    //visibleContextMenu.value = false
    closeContextMenu()
    //emit('closeContextMenu')
}

function shwFormat() {
    visibleSidebar.value = true

    resetStateSidebar()
    stateSidebar.visibleFormatting = true

    visibleContextMenu.value = false

    //и выбрать компонент условного форматирования  в сайдбаре 
}
function shwValid() {
    visibleSidebar.value = true

    resetStateSidebar()
    stateSidebar.visValid = true

    visibleContextMenu.value = false
}

function hideColumn() {
    //hiddenColumnsHideFromContextMenu()
    emit('hiddenColumnsHideFromContextMenu')
}

function showStory() {
    let physicalRow = instance.toPhysicalRow(props.selectRow) 
    let dataAtRow: IModelData =  instance.getSourceDataAtRow(physicalRow)
    emit('showStoryRowFromContextMenu', dataAtRow.Guid)
}

function deleteRow() {
    deleteRowsIdxs.value.sort((a,b)=>a-b)
    emit('deleteRowsFromContextMenu', deleteRowsIdxs.value)
    deleteRowsIdxs.value = []
    //store.dispatch('clearSelectedRowsRange')
}



function copy() {
    copyPastePlugin = instance.getPlugin('CopyPaste')
    copyPastePlugin.copy();
}
function cut() {
    copyPastePlugin = instance.getPlugin('CopyPaste')
    copyPastePlugin.cut();
}
async function  paste() {
    let changes: any[] = []

    if (navigator.clipboard) {
        let text = await navigator.clipboard.readText();
        let textArray: string[] = text.split('\n')
        let row = props.selectRow

        if (row < 0) row = 0

        changes = textArray.map((value: string, index: number) => {
            return [row+index, props.selectColumn, value]
        })
    }

    setTimeout(() => {
        instance.setDataAtCell(changes)
    })
    
}


</script>