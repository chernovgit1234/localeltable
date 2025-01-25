<template>
    <contenteditable 
        @input="inputInput($event)"
        @keyup="keydownInput($event)"
        style="display: inline-block !important; white-space:nowrap !important;" 
        @mousedown="mousedownInput($event)"
        class="formula-block__input" 
        id="contenteditable-input"
        tag="div"
        :contenteditable="true" 
        v-model="content" 
        :no-html="true"
    />
</template>

<script setup lang="ts">
import contenteditable from 'vue-contenteditable'
import { ref, defineEmits, computed, watch, nextTick, defineExpose} from 'vue';
import {getCurrentPositionByEventMosedown} from '../../helpers/HSFormula/CommonMethods'
import {mathOperatorsForRange} from '../../helpers/HSFormula/FormulaHelper'
import { useStore } from 'vuex'
import {IUserFormula} from '../../helpers/HSFormula/Types'
import {generateColorsForTokens, getTestResultFormulaAtInputedText} from '../../helpers/HSFormula/analizatorFormula/CalculateMethods'

defineExpose({replaceFunc})
const emit = defineEmits(['changeResultFormula', 'changeHaveActiveFormulaByColumn', 'resetResultFormula', 'inputedText'])

function replaceFunc(func: string, replSubstr: string) {
    content.value = content.value.replace(replSubstr, func)

    nextTick(() => {
        setCurrentCursorPosition(false)
    })
}

function pasteTokensInInput(tokensLocal: string[], focusedEnd?: boolean ) {
    const tokens = generateColorsForTokens(tokensLocal)
    const customInput: HTMLDivElement = document.getElementById('contenteditable-input') as HTMLDivElement
    let inneredHTML = ['<span style="color: #1f1f1f">=</span>']

    tokens.forEach((token:any) =>{
        inneredHTML.push(`<span style="color: ${token.color};font-weight: ${token.weight}; ">${token.token}</span>`)
    })
    
    //nextTick(() => {
        customInput.innerHTML = `${inneredHTML.join('')}`
        setCurrentCursorPosition(focusedEnd)
    //})
}

function setCurrentCursorPosition(focusedEnd?: boolean) {
    const customInput: any = document.getElementById('contenteditable-input')
    if (focusedEnd === true) {
        Cursor.setCurrentCursorPosition(content.value.length, customInput);
    } else {
        Cursor.setCurrentCursorPosition(currentCaretNumber.value + differenceLength.value, customInput);
    }
    
    if (highlightedMode.value === false) customInput.focus();
}   

const store = useStore()
let currentCaretNumber = ref(0)
let leftColumnName = ref('')
let leftColumnNumber = ref('')
let rightColumnName = ref('')
let rightColumnNumber = ref('')
let rightColumn = ref(false)
let content = ref('')
let arrayDataForHtml = ref<any[]>([])

let highlightedMode = ref(false)
let isActiveReplace  = ref(false)
let isHaveActiveFormulaByColumn  = ref(false)

const setSelectedColumnHeaderClickLeftBtn = computed(() => store.getters.setSelectedColumnHeaderClickLeftBtn)

watch(setSelectedColumnHeaderClickLeftBtn, (newValue: number) => {
    //отображение формулы по выбранной колонке
    let formulaObject: IUserFormula = store.getters.formulaObjectByColumn(newValue)
    
    if (formulaObject) {
        isHaveActiveFormulaByColumn.value = true
        pasteTokensInInput(formulaObject.tokensFormulaTextOriginal, true)
    } else {
        let fakeCurrentFormula = store.getters.fakeCurrentFormula as IUserFormula
        
        if (fakeCurrentFormula) {
            isHaveActiveFormulaByColumn.value = false
            pasteTokensInInput(fakeCurrentFormula.tokensFormulaTextOriginal, true)
        }
    } 

    emit('changeHaveActiveFormulaByColumn', isHaveActiveFormulaByColumn.value)
})

const highlightedRangeCells = computed((value: any) => {
    return store.getters.highlightedRangeCells
})

watch(highlightedMode, (newValue: boolean) => {
    if (newValue !== true) isActiveReplace.value = false 
})

watch(currentCaretNumber, (newValue: number) => {

    
    let valueText = content.value
    let valueTextLocal = valueText.slice(1)
    //let ett = valueTextLocal.replace(/\n|\r/g, "")
    emit('inputedText', {value: valueTextLocal.replace(/\n|\r/g, ""), caretPos: currentCaretNumber.value-2})

    let preSimbolAtCarretPosition = content.value[newValue - 1]
    //если  символ перед кареткой содержит оператор, то можно вставлять диапазон
    highlightedMode.value = mathOperatorsForRange.includes(preSimbolAtCarretPosition) ? true : false
})

let differenceLength = ref(0)

watch(content, (valueText: string, oldValueText: string) => {

    if (valueText.replace(/\n|\r/g, "") === oldValueText.replace(/\n|\r/g, "")) {
        return   
    }

    differenceLength.value = valueText.length - oldValueText.length 

    if (isHaveActiveFormulaByColumn.value === true) return 

    if (valueText.length > 1 && valueText[0] === '=') {
        
        arrayDataForHtml.value = []
        
        let valueTextLocal = valueText.slice(1)

        //заменить имена колонок диапазонов на тестовые данные
        const resultFormula = getTestResultFormulaAtInputedText(valueTextLocal.replace(/\n|\r/g, ""))
        
        emit('changeResultFormula', resultFormula)

        const fakeCurrentFormula = structuredClone(store.getters.fakeCurrentFormula as IUserFormula) 
        
        if (fakeCurrentFormula) {
            pasteTokensInInput(fakeCurrentFormula.tokensFormulaTextOriginal)
        } else {
            const customInput: any = document.getElementById('contenteditable-input') as any
            for (let children of customInput.children) { 
                children.style.color = '#1f1f1f';
                children.style.fontWeight = 'normal';
            }
        }

    } else if (valueText.length === 0) {
        emit('resetResultFormula')
    }
})


function inputInput(event: InputEvent) {
    
    /* const customInput: any = document.getElementById('contenteditable-input') as any */
    
    if (event.inputType === "insertLineBreak" || event.data === null) {

        const fakeCurrentFormula = structuredClone(store.getters.fakeCurrentFormula as IUserFormula) 
        if (fakeCurrentFormula) {
            pasteTokensInInput(fakeCurrentFormula.tokensFormulaTextOriginal)
        }

        nextTick(() => {
            setCurrentCursorPosition()
        })
    } else {
        nextTick(() => {
            getCurrentPositionByEventMosedown().then((result: any) => currentCaretNumber.value = result)
            setCurrentCursorPosition()
        })
    }
}

function keydownInput(event: KeyboardEvent) {
    if (event.code !== "Enter") {
        getCurrentPositionByEventMosedown().then((result: any) => currentCaretNumber.value = result)
    } 
}

function mousedownInput(event: any) {
    //нахождение каретки по мыши
    getCurrentPositionByEventMosedown().then((result: any) => currentCaretNumber.value = result)
}

watch(highlightedRangeCells, (newValue: any, oldValue: string) => {

/* const customInput: HTMLDivElement = document.getElementById('contenteditable-input') as HTMLDivElement */

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
//если вставка в формулу
if (highlightedMode.value === true) {

    let newRange = ''
    if (rightColumnName.value.length) {
        newRange = `${leftColumnName.value}:${rightColumnName.value}`.toLocaleUpperCase()
    } else {
        newRange = leftColumnName.value.toLocaleUpperCase()
    }

    let tokens: string[] =  content.value.split('')

    if (isActiveReplace.value === false) {
        tokens.splice(currentCaretNumber.value, 0, newRange)
        //включить возможность замены
        isActiveReplace.value = true

    } else {
        let oldValueLocal = oldValue.replace(/[0-9]/g, '')
        tokens.splice(currentCaretNumber.value, oldValueLocal.length, newRange)
    }

    //вставка 
        content.value = tokens.join('')
    }
}
)

class Cursor {
    static getCurrentCursorPosition(parentElement: any) {
        var selection = window.getSelection(),
            charCount = -1,
            node: any;
        
        if (selection && selection.focusNode) {
            if (Cursor._isChildOf(selection.focusNode, parentElement)) {
                node = selection.focusNode; 
                charCount = selection.focusOffset;
                
                while (node) {
                    if (node === parentElement) {
                        break;
                    }

                    if (node.previousSibling) {
                        node = node.previousSibling;
                        charCount += node.textContent.length;
                    } else {
                        node = node.parentNode;
                        if (node === null) {
                            break;
                        }
                    }
                }
            }
        }
        
        return charCount;
    }
    
    static setCurrentCursorPosition(chars: any, element: any) {
        if (chars >= 0) {
            var selection = window.getSelection();
            
            let range = Cursor._createRange(element, { count: chars });

            if (range && selection) {
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }
    
    static _createRange(node: any, chars: any, range?: any) {
        if (!range) {
            range = document.createRange()
            range.selectNode(node);
            range.setStart(node, 0);
        }

        if (chars.count === 0) {
            range.setEnd(node, chars.count);
        } else if (node && chars.count >0) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent.length < chars.count) {
                    chars.count -= node.textContent.length;
                } else {
                    range.setEnd(node, chars.count);
                    chars.count = 0;
                }
            } else {
                for (var lp = 0; lp < node.childNodes.length; lp++) {
                    range = Cursor._createRange(node.childNodes[lp], chars, range);

                    if (chars.count === 0) {
                    break;
                    }
                }
            }
        } 

        return range;
    }
    
    static _isChildOf(node: any, parentElement: any) {
        while (node !== null) {
            if (node === parentElement) {
                return true;
            }
            node = node.parentNode;
        }

        return false;
    }
}
</script>