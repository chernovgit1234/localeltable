
import { EnumFieldName } from '@/enums/EnumColumnValues'
import {validatorDate, validatorNumber,validatorBoolean} from '../validators/ValidatorFunctions'
import { instance } from './InstanceHelper'
import { storage } from '../store/index'
import {filterChangesByconditionalFormulas, setDataAtRowProp} from '../helpers/HSFormula/analizatorFormula/CalculateMethods'
import { fieldsInfoMap, IField } from './ColumnsHelper'
import { IConditionFormula } from '@/types/ConditionalFormulasTyles'
import { toRaw } from 'vue'
import { setDataAtRowPropFn } from '@/Workers/worker-api'
import { EnumTypeCell, EnumTypeField } from '@/enums/EnumsByFilter'
import { IValidRule } from '@/store/valid/types'


export async function afterChangeHook(changesParam: any[]): Promise<any> {
    //ХУК ДЛЯ работа с формулами после редактирования
    if (!changesParam.length) return false

    const fileldName: EnumFieldName = changesParam[0][1] as EnumFieldName
    const changes: [number, any][] = changesParam.map((change: any[]) => [change[0], change[3]])
    //получить индексы и нарезать массив  
    const conditionalFormulasArray = storage.getters.getConditionalFormulasArray as IConditionFormula[]
    const first = instance.getFirstRenderedVisibleRow()
    const last = instance.getLastRenderedVisibleRow() 

    let splicedArray: any[] = []
    if (changes.length > (last - first)) {
        let isxLast = changes.length - 1
        let isxFirst = changes.findIndex((el: any) => el[0] === first)
        if (isxFirst === -1) {
            //значит направление выделения снизу вверх , для верхней границы взять первый элемент, для нижней взять индекс вычисленный
            isxFirst = 0
            isxLast = changes.findIndex((el: any) => el[0] === last)
        }

        splicedArray = changes.splice(isxFirst, isxLast)
    }

    //если есть условия , то отфильтровавть и отправить в основной поток считать формулы
    if (conditionalFormulasArray.length) {
        await setDataAtRowProp(filterChangesByconditionalFormulas(splicedArray.length ? splicedArray : changes), fileldName)

        //если массив порезан, то отправить во второй поток считать формулы
        if (splicedArray.length) {
            //если есть отрезанный массив то значит отправить в воркер остатки
            //если был отрезанный сегмент массива, то отправить остатки исходного массива в воркер
            calculateRemainderSourceAsWebWorker(filterChangesByconditionalFormulas(changes), fileldName)
        }  
    } else {
       //если нет условий, то тогда просто  вернуть сегмент массива (40 строк напр) (не надо всё вовращать) а остатки на WebWorker
       /*  console.log('setDataAtRowProp') */
        await setDataAtRowProp(splicedArray.length ? splicedArray : changes, fileldName)

        if (splicedArray.length) {
            //если был отрезанный сегмент массива, то отправить остатки исходного массива в воркер
            calculateRemainderSourceAsWebWorker(changes, fileldName)
        }
    }
}

export async function calculateRemainderSourceAsWebWorker(changes: any[], fileldName: EnumFieldName, pushChange?: boolean) {
    /* console.log('AsWebWorker pushChange', fileldName, changes, pushChange) */
    const formulasList = structuredClone(toRaw(storage.getters.formulasList))
    const result = await setDataAtRowPropFn(changes, fileldName, formulasList, pushChange)
    await instance.setDataAtRowProp(result)
}
const getTdCell = (row: number, col: number): HTMLTableCellElement => instance.getCell(row, col) as HTMLTableCellElement

/* function checkValid(rule: IValidRule, newValue: any) {
    let valid, errTxt
    if (rule) {
        const jsCode = `${rule.jsCode.replaceAll('value', `${newValue}`)}`
        if (!eval(`${jsCode}`)) {
            valid=false
            errTxt=rule.errorText
        } 

        return {valid: valid as boolean, errTxt: errTxt as string}
    } else {
        return null
    }
} */

export function beforeChangeHook(changes: any[], selectCol: number): any {
    //ХУК ДЛЯ ВАЛИДАЦИИ
    if (!changes.length) return false
    //console.log('changes', changes)
    let valid=true
    let errTxt=''

    let row=0
    for (const change of changes) {
        let col = selectCol
        const changedRow: number = change[0] as number
        row==changedRow ? col++ : row=changedRow
            
        const newValue: any = change[3]
        const td = getTdCell(changedRow, col) as HTMLTableCellElement 
        const rule = storage.getters.getValidRuleByColumn(col) as IValidRule
        const field = fieldsInfoMap.get(col) as IField

        switch(field.fieldType) {
            case EnumTypeField.Date:
                if (validatorDate(newValue)==false) {
                    //если не прошло валидацию то окрасить ячейку красным
                    valid=false
                    errTxt='Введенное значение не является датой.'
                } else {
                    if (rule) {
                        const jsCode = `${rule.jsCode.replaceAll('value', `"${newValue}"`)}`
                        if (!eval(`${jsCode}`)) {
                            valid=false
                            errTxt=rule.errorText
                        } 
                    }
                }
                break
            case EnumTypeField.Number:
                if (validatorNumber(newValue)==false) {
                    //если не прошло валидацию то окрасить ячейку красным
                    valid=false
                    errTxt='Введенное значение не является числом.'
                } else {
                    //здесь валидация по пользоввательским правилам
                    if (rule) {
                        const jsCode = `${rule.jsCode.replaceAll('value', `${newValue}`)}`
                        if (!eval(`${jsCode}`)) {
                            valid=false
                            errTxt=rule.errorText
                        } 
                    }  
                }
                break
            case EnumTypeField.Boolean:

                if (validatorBoolean(newValue)===false) {
                    //если не прошло валидацию то окрасить ячейку красным
                    valid=false
                    errTxt='Введенное значение не является логическим значением.'
                } else {
                    //здесь валидация по пользоввательским правилам
                    if (rule) {
                        const jsCode = `${rule.jsCode.replaceAll('value', `${newValue}`)}`
                        if (!eval(`${jsCode}`)) {
                            valid=false
                            errTxt=rule.errorText
                        } 
                    }  
                }
                break
            case EnumTypeField.String:
                if (field && field.typeCell==EnumTypeCell.Dropdown) {
                    if (field.options?.indexOf(newValue) == -1) {
                        valid=false
                        errTxt='Введенное значение не является одним из значений списка.'
                    } else {
                        //здесь валидация по пользоввательским правилам
                        if (rule) {
                            const jsCode = `${rule.jsCode.replaceAll('value', `"${newValue}"`)}`
                            if (!eval(`${jsCode}`)) {
                                valid=false
                                errTxt=rule.errorText
                            } 
                        }  
                    }
                } else {
                    if (rule) {
                        const jsCode = `${rule.jsCode.replaceAll('value', `"${newValue}"`)}`
                        console.log('jsCode', jsCode)
                        console.log('eval(`${jsCode}`)', eval(`${jsCode}`))
                        if (!eval(`${jsCode}`)) {
                            valid=false
                            errTxt=rule.errorText
                        } 
                    }
                    break
                }
        }

        const validPopup = document.getElementById('valid-popup')
        
        if (validPopup && td) {

            const left = td.getBoundingClientRect().left
            const top = td.getBoundingClientRect().top
            const width = td.getBoundingClientRect().width

            const validWidth = Number(validPopup.offsetWidth) //ширина попап
            const validHeight = validPopup.offsetHeight 

            const windowWidth = window.innerWidth

            if ((windowWidth -20 - (left+width)) < 0) {
                //если не лезет в окно, надо пере   нести левее от ячейки
                validPopup.style.left = `${left-(width/2)+validWidth-10}px`
                validPopup.style.top = `${top+validHeight-10}px`
            } else {
                validPopup.style.left=`${left+width}px`
                validPopup.style.top=`${top}px`
            } 
        }

        if (valid==false) {
            if (changes.length>1) {
                errTxt=errTxt+' Вставка отменена.'
            }

            valid ? storage.dispatch('setValid', '') : storage.dispatch('setValid', errTxt)

            return valid 
        }
    }

    valid ? storage.dispatch('setValid', '') : storage.dispatch('setValid', errTxt) 
    
    return valid
}


