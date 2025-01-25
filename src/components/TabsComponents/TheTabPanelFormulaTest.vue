<style lang="scss">

.formula-table {
    
    text-decoration: dotted;
    background-color: #ffffff;
    min-width: 100%;
    height: 100%;
    position: relative;

    &__body {
        max-width: 100%;
        display: flex;
        flex-direction: row;
        gap: 12px;
        align-items: center;
    }

    &__navigate {
        min-width: 350px;
    }

    &__navigate-text {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        color: #1f1f1f;
        font-size: 13px;
        height: 19px;
        margin: 2px 0 2px 2px;
        padding: 0 8px 0 6px;
        text-transform: uppercase;
        font-family:  GoogleSans-Regular !important;
    }

    &__separator-body {
        border: 1px solid #c7c7c7;
        height: 18px;
        color: #c7c7c7;
    }

    &__formula {
        color: #1f1f1f;
    }
}

.formula-block {
    width: 100%; 
    display: flex;
    flex-direction: row;
    gap: 15px;
    align-items: center;
    overflow: hidden;
    position: relative;
    
    &__status {
        width: 100px;
        background-color: #fafafa;
        border: 1px solid #e6e6e6;
        border-radius: 3px;
        height: 20px;
        display: flex;
        align-items: center;

        span {
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
            width:100px;
            display:inline-block;
            color: #1f1f1f;
            padding: 2px 5px 0 5px;
            font-size: 12px;
            font-family:  GoogleSans-Regular !important;
        }
    }

    &__fx-text {
        font-family: Roboto400 !important;
        font-size: 12px;
        font-weight: bold;
        
    }

    &__input {
        display: inline !important;
        min-width: 500px;
        color: #1f1f1f;
        font-size: 13px;
        white-space: nowrap;
        padding: 0px 30px 0 0px;
        font-family: GoogleSans-Regular !important;
        word-wrap: break-word;
        cursor: text;
        -webkit-user-modify: read-write-plaintext-only;
        white-space: pre-wrap;
        word-wrap: break-word;
        height: calc(100% - 2px);
        background-color: #fff;
        
        br {
            display: none;
        }
    }

    &__menu {
        user-select: none;
        min-width: 100px;
        width:340px;
        max-height:400px;
    }
    
}

.menu-formula {

&__list {
    padding: 4px 0;
    display: flex;
    flex-direction: column;
}

&__item {
    min-height: 24px;
    vertical-align: middle;
    padding: 6px 10px;
    cursor: pointer;
    &:hover{
        background-color: #f5f5f5;
    }
}

&__fn-name {
    white-space: nowrap;
    font-family: Roboto400;
    font-size: 12px;
    font-weight: 400;
    color: #202124;
}

&__fn-desc {
    font-family: Roboto400;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #5f6368;
}
}

.formula-desc {
    font-size: 14px;
    font-family: GoogleSans-Regular !important;
    color: #1f1f1f;
    letter-spacing: 0.25px;
}

</style>

<template>
    <div class="formula-table">
        <div class="formula-table__body">
            <div class="formula-table__navigate">
                <span class="formula-table__navigate-text" style="white-space: nowrap;">
                    <span>{{ leftColumnName }}</span>
                    <span style="color:#666666; padding-left: 2px;font-weight: bold;">{{ leftColumnNumber }}</span>
                    <span v-show="rightColumn" style="padding: 0 2px 0 2px;">:</span>
                    <span>{{ rightColumnName }}</span>
                    <span style="color:#666666;padding-left: 2px;font-weight: bold;">{{ rightColumnNumber }}</span>
                </span>
            </div>
            <div class="formula-table__separator-body"></div>
            <div 
                class="formula-block__status"  
                :style="[{'backgroundColor': resultFormulaObject.error ? '#ecb4b45d' : '#fafafa' }]"
            >
                <span>{{resultFormulaObject.text}}</span>
                <q-tooltip 
                    class="custom-tooltip-info"
                    style="white-space: pre-line !important;"
                    v-if="resultFormulaObject.text !== ''"
                    anchor="bottom left" self="top left"
                >
                    <div class="formula-desc" v-html="resultInfoByFormulaText"></div>
                </q-tooltip> 
            </div>
            <div class="formula-block__fx">
                <span class="formula-block__fx-text" :style="{'color': isHaveActiveFormulaByColumn ? '#0b57d0' : '#989a99'}">fx</span>
            </div>
            <div class="formula-table__formula formula-block">
                <div class="formula-block__input-body">
                    <TheContentedTableFormula 
                        ref="cntrtbl"
                        @inputedText="inputedText"
                        @resetResultFormula="resetResultFormula" 
                        @changeHaveActiveFormulaByColumn="changeHaveActiveFormulaByColumn" 
                        @changeResultFormula="changeResultFormula">
                    </TheContentedTableFormula> 
                    <q-menu 
                        v-model="menuModel"
                        no-parent-event
                        class="formula-block__menu menu-formula" 
                        auto-close
                        no-focus
                        :offset="[0, 5]" 
                    >
                        <div class="menu-formula__list" >
                            <div class="menu-formula__item" 
                                @mouseover="currI =i" 
                                :style="{'background-color': currI===i ? '#f5f5f5': 'white' }" 
                                v-for="(item, i) in funcs" :key="i"
                                @click="selectFunc(item.name)"
                            >
                                <div class="menu-formula__fn-name">{{item.name}}</div>
                                <div v-if="i===currI" class="menu-formula__fn-desc">{{item.desc}}</div>
                            </div>
                        </div>
                    </q-menu>
                </div>
                    
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import TheContentedTableFormula from './TheContentedTableFormula.vue'
import { ref, computed, watch } from 'vue';
/* import HyperFormula from 'hyperformula' */
import {formulaMap} from '../../helpers/HSFormula/FormulaHelper'
import {IFormula, IResultFormula, IUserFormula} from '../../helpers/HSFormula/Types'
import {getCaretPosition, getCurrentPositionByEventMosedown} from '../../helpers/HSFormula/CommonMethods'
import TheFormCreateFormula from './TheFormCreateFormula.vue'
import CustomDialog from '../SpecialComponents/CustomDraggableDialog.vue'
import { useStore } from 'vuex'
import {lex, tokenVocabulary} from '../../helpers/HSFormula/analizatorFormula/lexer'
import {IPropsRangeNameMapValue, propsRangeNameMapFull}  from '../../helpers/ColumnsHelper'
import { getTypeValueRus } from '@/helpers/CommonMethods';

let currI = ref(0)
let menuModel = ref(false)
const cntrtbl = ref()
const replSubstr = ref('')
const funcs = ref<any[]>([])

watch(funcs, (val: any) => {
    val.length ? menuModel.value = true:menuModel.value = false;currI.value=0
})

function selectFunc(func: string) {
    cntrtbl.value.replaceFunc(func, replSubstr.value)
}
function inputedText(value: any) {
    const substr = extractTextSubstring(value.value, value.caretPos)
    replSubstr.value = substr
    //по подстроке найти ввсе формулы
    if (!substr.length) {
        menuModel.value = false
        currI.value=0 
        return
    }

    funcs.value = Array.from(formulaMap.values()).filter(el => el.nameRus.includes(substr)).map((rl: any)=> {
        return {name: rl.nameRus, desc: rl.description}
    }).sort((a, b) => {
        let x = a.name
        let y = b.name
        if (x.startsWith(substr) && !y.startsWith(substr)) {
            return -1;
        }
        if (!x.startsWith(substr) && y.startsWith(substr)) {
            return 1;
        }

        return x.length - y.length;
    });

}
function extractTextSubstring(str:string, index: number) {
    
    if (index < 0 || index >= str.length) {
        return '';
    }

    let start = index;
    let end = index + 1;

    while (start > 0 && /[a-zA-Zа-яА-ЯЁё]/.test(str[start - 1])) {
        start--;
    }

    while (end < str.length && /[a-zA-Zа-яА-ЯЁё]/.test(str[end])) {
        end++;
    }

    return str.substring(start, end);
}

const store = useStore()
enum TypePopup {
    Default = 0,
    TheFormCreateFormula = 1
}

const currentSelectedCell = computed(() => {
    return store.getters.currentSelectedCell
})

let leftColumnName = ref('')
let leftColumnNumber = ref('')
let rightColumnName = ref('')
let rightColumnNumber = ref('')
let rightColumn = ref(false)
let resultFormulaObject = ref<IResultFormula>({text: '', error: false, isHaveRangeInFormula: false,typeValue: 'string' })

const highlightedRangeCells = computed((value: any) => {
    return store.getters.highlightedRangeCells
})

let oldValueHighlightedRangeCells = ref('')
let highlightedRangeCellsKey = ref(0)
let highlightedMode = ref(false)

let isHaveActiveFormulaByColumn  = ref(false)

function changeResultFormula(resultFormulaObjectParam: IResultFormula) {
    resultFormulaObject.value = resultFormulaObjectParam
}
function changeHaveActiveFormulaByColumn(isHaveActiveFormula: boolean) {
    isHaveActiveFormulaByColumn.value = isHaveActiveFormula

    if (isHaveActiveFormulaByColumn.value === true) {
        resultFormulaObject.value = {text: '', error: false, isHaveRangeInFormula: false,typeValue: 'string' }
    }
    
}
function resetResultFormula() {
    resultFormulaObject.value = {text: '', error: false, isHaveRangeInFormula: false,typeValue: 'string' }
}

const resultInfoByFormulaText = computed(() => {
    let typeResultValue = ''
    let accessNames = ''
    //если в формуле нет ошибок,то получаю список доступных колонок для применения формулы
    if (!resultFormulaObject.value.error) {
        typeResultValue = getTypeValueRus(resultFormulaObject.value.typeValue.toLocaleLowerCase())

        let accessRangeNames: string[] = []
        const fakeCurrentFormula = store.getters.fakeCurrentFormula as IUserFormula

        propsRangeNameMapFull.forEach((value: IPropsRangeNameMapValue, key: string) => {
            if (resultFormulaObject.value.typeValue === value.type.toLocaleLowerCase() && !fakeCurrentFormula.depends.includes(value.fieldName)) {
                //если тип значения результата формулы совпадает 
                //и не должно быть в зависимостях
                accessRangeNames.push(key)
            }
        });
        //если найдены названия диап-в, то обьединить в строку через перенос строк (вертикальный список)
        if (accessRangeNames.length) {
            accessNames =  `<span>Формулу можно применить к столбцам:</span> \n <span style="font-weight: bold; background-color:#fff0d1">${accessRangeNames.join("\n")}</span>`
        } else {
            accessNames = '<span>Нет доступных колонок для применения формулы</span>'
        }
    }

    if (resultFormulaObject.value.error === true) {
        return `<span style="text-transform: uppercase;font-weight: bold; color: #d93025">Ошибка</span>: ${resultFormulaObject.value.text}`
    } else {

        
        if (resultFormulaObject.value.isHaveRangeInFormula) {
            return `<span style="text-transform: uppercase;font-weight: bold">возможный результат</span>: <span style="color: #0b57d0">${resultFormulaObject.value.text}</span> <span style="background-color:#d8e4f7">(${typeResultValue})</span>, \n(тестовые данные взяты из первой строки); \n 
                ${accessNames}`
        } else {
            return `<span style="text-transform: uppercase;font-weight: bold">возможный результат</span>: <span style="color: #0b57d0">${resultFormulaObject.value.text}</span> (<span style="background-color:#d8e4f7">${typeResultValue}</span>);
            ${accessNames}`
        }
    }

})
watch(highlightedRangeCells, (newValue: any, oldValue: string) => {
     
    oldValueHighlightedRangeCells.value = oldValue
    /* console.log('highlightedRangeCells', newValue) */
    
    const r = /\d+/; 
    if (newValue && newValue.indexOf(":") === -1) {
        //если только левая
        rightColumn.value = false
        leftColumnNumber.value = newValue.match(r)[0]
        leftColumnName.value = newValue.replace(/[0-9]/g, '')
        

        rightColumnNumber.value = ''
        rightColumnName.value = ''
    } else if (newValue && ~newValue.indexOf(":")) {
        rightColumn.value = true
        leftColumnName.value = newValue.split(':')[0].replace(/[0-9]/g, '')
        leftColumnNumber.value = newValue.split(':')[0].match(r) !==null ? newValue.split(':')[0].match(r)[0] : ''
        rightColumnNumber.value = newValue.split(':')[1].match(r) !==null ? newValue.split(':')[1].match(r)[0] : ''
        rightColumnName.value =  newValue.split(':')[1].replace(/[0-9]/g, '')
    }
})

let rangeText = ref<string>('')
let formulaText = ref<string>('')
let showDialog = ref(false)
let typePopup = ref<TypePopup>(TypePopup.Default)

function showFormCreateFormula() {
    formulaText.value = '='
    showDialog.value = true
    typePopup.value = TypePopup.TheFormCreateFormula
}

function closeDialog() {
    console.log('closeDialog')
    showDialog.value = false
    typePopup.value = TypePopup.Default
}

</script>