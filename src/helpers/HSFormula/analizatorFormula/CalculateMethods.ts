import { instance } from "@/helpers/InstanceHelper";
import { IFormula, IResultFormula, IUserFormula } from "../Types";
import { storage } from '@/store';
import {fieldsInfoMap, IField, IPropsRangeNameMapValue, nestedHighHeaderRange, propsRangeNameMap, propsRangeNameMapFull, nameFieldsArray}  from '../../ColumnsHelper'
import { EnumColumnNameRange, EnumFieldName } from "@/enums/EnumColumnValues";
import {formulaMap, mathOperators} from '../../../helpers/HSFormula/FormulaHelper'
import {lex} from '../../../helpers/HSFormula/analizatorFormula/lexer'
/* import vm from 'node:vm'; */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import FormulaParser, {FormulaError} from 'fast-formula-parser';
import { EnumTypeField } from "@/enums/EnumsByFilter";
import { IConditionFormula } from "@/types/ConditionalFormulasTyles";
import { calculateRemainderSourceAsWebWorker } from "@/helpers/HooksChangeDataMethods";
import { EnumNamesEngFormula, EnumNamesFormula } from "@/enums/EnumsHSFormula";
import { getEnumStringValues, getEnumKeys } from "@/enums/EnumsCommon";
import HyperFormula from 'hyperformula' 

const hfInstance = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });
const parser: FormulaParser = new FormulaParser({}) as FormulaParser
hfInstance.addSheet('Mortgage Calculator');

export function filterChangesByconditionalFormulas(changesLocal: any[]) {
    const conditionalFormulasArray = storage.getters.getConditionalFormulasArray as IConditionFormula[]

    const changes = changesLocal.filter((change) => {

        let jsCondition = ''
        for (const [idx, condition] of conditionalFormulasArray.entries()) {

            for (const [index, rule] of condition.rules.entries()) {
                const value: any = instance.getDataAtRowProp(change[0], `${rule.propName}`)

                let jsConditionLocal = `${rule.jsCondition.replace('value', `"${value}"`)}`
                if (index !== 0) jsConditionLocal = ' && '+jsConditionLocal
                jsCondition += jsConditionLocal
            }
            
            if (idx < conditionalFormulasArray.length - 1) {
                jsCondition += ' || '
            }
        }

        if (!eval(`${jsCondition}`)) {
            return change
        }
    })

    return changes
}

export function generateColorsForTokens(tokensLocal: string[]) {

    const tokens = tokensLocal.map((token: string) => {
        let color = '#1f1f1f'
        let weight = 'normal'
        //проанализироваь токен и дать ему цвет
        if (~(getEnumKeys(EnumNamesFormula) as any[]).indexOf(token)) {
            color = '#cd7f32'
            color = '#93c47d'
            weight = 'bold'
            
        } else if (rangesRus.some(el=>el===token)) {
            color = '#666666'
        } else if (!isNaN(parseFloat(token)) && isFinite(+token)) {
            //если число
            color = '#1155d4'
        } else if (~mathOperators.indexOf(token)) {
            //если строка
            color = '#1f1f1f'
        } else if (typeof token == 'string') {
            //если строка
            color = '#008000'
        } else {
            color = '#1f1f1f'
        }

        return {token, color, weight}      
    })

    return tokens  
}

//formFuncRus - массив функций формул на русском
//formFuncEng - массив функций формул на англ
const formFuncRus = getEnumKeys(EnumNamesFormula)
const formFuncEng = getEnumKeys(EnumNamesEngFormula)
const rangesRus = getEnumStringValues(EnumColumnNameRange) as EnumColumnNameRange[] 

export function getTestResultFormulaAtInputedText(txt: string) {
   /*  console.log('getTestResultFormulaAtInputedText') */
    //text - введенный текст в инпут
    //функция для получения тестового результата на ходу
    let txtLocal = txt
    let txtRanges = ''

    //1.1.поменять диапазоны на псевыдонимы 
    for (const range of rangesRus) {
        txtLocal = txtLocal.replaceAll(range, (propsRangeNameMapFull.get(range as EnumColumnNameRange) as IPropsRangeNameMapValue)?.psevdoName)
    }
    
    //1.2.замена рус функ на англ
    for (const nameFunc of formFuncRus) {
        txtLocal = txtLocal.replaceAll(nameFunc, (formulaMap.get(nameFunc) as IFormula).nameEng)
        txtLocal = txtLocal.replaceAll(';', ',')
    }

    //1.3.обратно поменять псевыдонимы на диапазоны
    const psevdos =(Array.from(propsRangeNameMapFull.values()) as IPropsRangeNameMapValue[]).map((rl: IPropsRangeNameMapValue) => rl.psevdoName)
    for (const psevdo of psevdos) {
        const rangeName = (Array.from(propsRangeNameMapFull.values()) as IPropsRangeNameMapValue[]).find(el=>el.psevdoName===psevdo)?.rangeName as string 
        txtLocal = txtLocal.replaceAll(psevdo, rangeName )
    }

    /* const idx = inputedTextFormulaLocal.indexOf(":") */
    //найти все диапазоны и заменить их названиями полей в пределах диапазона
    
    if (~txtLocal.indexOf(":")) {
        //замена диапазонов на перечесление колонок
        txtLocal = replaceColonWithFields(txtLocal)
        txtRanges = replaceColonWithFields(txtLocal)  
    } else {
        txtRanges = txtLocal
    }
    //psevdoName
    for (const columnNameRange of rangesRus) {
        if (txtLocal.includes(columnNameRange)) {
            //если есть такоe поле в формуле, то заменить его на значение
            const prop = propsRangeNameMap.get(columnNameRange)
            const value = instance.getDataAtRowProp(0, prop)

            //в зависиисосмти от типа колонки . для строки надо ""
            txtLocal = txtLocal.replaceAll(columnNameRange, `"${value}"` )
        }
    }

    let resultFormula: IResultFormula
    try {
    
        //проверка: есть ли в формуле названия колонок
        let haveClmn = false
        //keyColumnNameRangeInFormula
        let key = 0
        for (const columnNameRange of rangesRus) {
            if (txtRanges.includes(columnNameRange)) key++; break
        }
        
        //определение: есть ли в формуле названия колонок
        if (key > 0) haveClmn = true
        
        /* const resultParse = parser.parse(txtLocal) */
        const sheetId: number = hfInstance.getSheetId('Mortgage Calculator') as number;
        console.log('333txtLocal', txtLocal)
        /* txtLocal = "MODE(4;55;55)" */
        const resultParse = hfInstance.calculateFormula(`=${txtLocal}`, sheetId) as any
        console.log('resultParse', resultParse)
        resultFormula = {text: resultParse, error: false, isHaveRangeInFormula: haveClmn, typeValue: typeof resultParse}

        //получить тип не в виде ""
        setNewFormulaToState(txt, txtRanges, false, typeof resultParse as EnumTypeField)

    } catch (formulaError: FormulaError) {
        /* console.log('formulaError', formulaError) */
        setNewFormulaToState(txt, txtRanges, true, typeof 'error' as EnumTypeField)
        resultFormula = {text: formulaError.name, error: true, isHaveRangeInFormula: false, typeValue: typeof formulaError.name}
    }
        
    return  resultFormula
}

function setNewFormulaToState(formulaParam: string, formulaText: string, error: boolean, typeValue: EnumTypeField) {

    if (error === true) {
        //если формула с ошибкой то очистить из стэйта
        storage.dispatch('clearFakeCurrentFormula')
    } else {
        let formulaTextLocal = formulaText
        const depends: string[] = []

        for (const columnNameRange of rangesRus) {
            if (formulaText.includes(columnNameRange)) {
                const psevdoName = (propsRangeNameMapFull.get(columnNameRange) as IPropsRangeNameMapValue).psevdoName
                formulaTextLocal = formulaTextLocal.replaceAll(columnNameRange, psevdoName)
                depends.push((propsRangeNameMapFull.get(columnNameRange) as IPropsRangeNameMapValue).fieldName)
            }
        }
        
        //забрал исходные токены с псевдоименами колонок
        const tokensFromformulaTextLocal = lex(formulaTextLocal).map(token => token.image) as string[];
        //создание токенов для вставки в инпут
        //tokens = tokensFormulaTextOriginal
        let tokens = formulaParam.slice()

        for (const [key, value] of propsRangeNameMapFull.entries()) {
            tokensFromformulaTextLocal.forEach((token: string, idx: number, thisArray: string[]) => {
                if (value.psevdoName === token) thisArray[idx] = value.fieldName
            })

            //1.замена русских диап на псевдонимы
            tokens = tokens.replaceAll(key, value.psevdoName)
        }

        //чтобы сделать токены оригинального текста формулы,Надо:
        //1.заменить функции на англ функции, а диапазоны на псевдонисы
        //2.затем разбить на токены

        //2.замена русских функция на англ
        for (const nameFunc of formFuncRus) {
            tokens = tokens.replaceAll(nameFunc, (formulaMap.get(nameFunc) as IFormula).nameEng)
            tokens = tokens.replaceAll(';', ',')
        }
        //3.разбитие на токены
        //tokensFrom = tokensFromformulaTextOriginal
        const tokensFrom: string[] = lex(tokens).map(token => token.image) as string[];
        //4. замена англ фунукций на рус
        
        tokensFrom.forEach((token: string, idx: number, array: string[]) => {
            for (const nameFunc of formFuncEng) {
                if (nameFunc === token) {
                    const nameRus = (Array.from(formulaMap.values()).find((el: IFormula) => el.nameEng === token))?.nameRus
                    if (nameRus) array[idx] = nameRus;break
                }
            }

            if (token === ",") array[idx] = ";"
        })  
        //4. замена псевдонимов  на рус диап
        for (const [key, value] of propsRangeNameMapFull.entries()) {
            tokensFrom.forEach((token: string, idx: number, thisArray: string[]) => {
                if (value.psevdoName === token) {
                    thisArray[idx] = key
                }
            })
        }
        
        const newFakeCurrentFormula: IUserFormula = {
            id: String(new Date().getTime()),
            typeValue: typeValue,
            column: 9999,
            depends: depends,
            formulaText: formulaText,
            formulaTextOriginal: formulaParam,
            tokensFormulaTextOriginal: tokensFrom,
            fieldName: '9999',
            tokens: tokensFromformulaTextLocal,
        }

        //запись новой фэйковой формулы
        storage.dispatch('setFakeCurrentFormula', newFakeCurrentFormula)
    }
}

function replaceColonWithFields(textFormula: string) {
    let txtFormula = textFormula
    const colons = []

    for(let i = 0; i < txtFormula.length; i++) {
        if (txtFormula[i] === ':') colons.push(i)
    }

    //массив диапазонов
    const shortRanges: string[] = []


    if (colons.length) {
        //idsMatches = usedIdxMatchFieldToRightArray
        const idsMatches: number[] = []
       /*  console.log('colons', colons) */ 
        /* let leftRange, rightRange = ''
        let leftIdxRange: number | null = null
        let rightIdxRange: number | null = null */
        let [leftRange, rightRange, leftIdxRange, rightIdxRange] = ['', '', -1, -1]

        for (const [idx, idColon] of colons.entries()) {
            
            /* let leftRange, rightRange = ''
            let leftIdxRange: number | null = null
            let rightIdxRange: number | null = null */
            
            //искать вправо и влево от индекса колон
            for (const columnNameRange of rangesRus) {
                //idxMatchLft = idxMatchFieldToLeft
                const idxMatchLft = txtFormula.lastIndexOf(columnNameRange, idColon) 

                if (~idxMatchLft && (idxMatchLft + columnNameRange.length) === idColon) {
                    //значит  нашел слева
                    leftRange = columnNameRange
                    leftIdxRange = idxMatchLft
                }

                //ищет справа от :
                const idxMatchFieldToRight = txtFormula.indexOf(columnNameRange, idColon)

                if (~idxMatchFieldToRight && (idxMatchFieldToRight -1) === idColon) {
                    //значит нашел справа
                    idsMatches.push(idxMatchFieldToRight)
                    rightRange = columnNameRange
                    rightIdxRange = idxMatchLft
                }
            }

            //проверка: использовался ли индекс в прошлой итерации. если исп-ся , то нельзя добавлять в массив диапазонов
            const usedIdxMatchFieldToRight: boolean = idsMatches.some(r=> r === leftIdxRange)

            if (idx >= 1 && usedIdxMatchFieldToRight === true) {
                //
            } else {
                const resultRange = `${leftRange}:${rightRange}`
                shortRanges.push(resultRange)
            }

            //обнуление
            [leftRange, rightRange, leftIdxRange, rightIdxRange] = ['', '', -1, -1]
        }
    }

    if (shortRanges.length) {
        for (const shortRange of shortRanges) {
            const spreadRange = generateSpreadRange(shortRange)
            txtFormula = txtFormula.replace(shortRange, spreadRange)
        }
    }

    return txtFormula
}

function generateSpreadRange(shortRange: string): string {
    const shortRangeLocal = shortRange
    const leftRange: string = shortRangeLocal.split(':')[0]
    const rightRange: string = shortRangeLocal.split(':')[1]

    if (rangesRus.some(t => t === leftRange) && rangesRus.some(t => t === rightRange)) {
        const leftIdx: number =  rangesRus.findIndex((field: EnumColumnNameRange) => field === leftRange)
        const rightIdx: number =  rangesRus.findIndex((field: EnumColumnNameRange) => field === rightRange)
    
        const result = rangesRus.map((field: EnumColumnNameRange, idx: number) => {
            if (idx >= leftIdx && idx <= rightIdx) {
                return field
            }
        }).filter(e => e).join(",")
        
        return result
    }

    return 'ОШИБКА'
}

interface IChange {
    changefileldName: EnumFieldName,
    processed: boolean,
    changes: Array<[number, any]> //строка, значение
}

//массив записи в метода setDataAtRowProp
let dataAtRowProp: IChange[] = []

export async function setDataAtRowProp(changes: any[], fileldName: EnumFieldName, noClearData?: boolean) {
    /* console.log('changes', changes) */
    if (!noClearData) dataAtRowProp = []

    await proseccedDependsByProp(changes, fileldName)

    if (dataAtRowProp.length) {
        
        for (const change of dataAtRowProp) {
            if (change.processed === false) {
                //еще не обраб-ся
                await proseccedDependsByProp(change.changes, change.changefileldName)
                const depend = dataAtRowProp.find((change: IChange) => change.changefileldName === change.changefileldName)

                if (depend) depend.processed = true
            }
        }
    }

    if (!dataAtRowProp.length) return
    
    const result = []

    for (const change of dataAtRowProp) { 
        for (const changeRow of change.changes) { 
            result.push([changeRow[0], change.changefileldName, changeRow[1] ])
        }
    }
    /* console.log('result', result) */
    await instance.setDataAtRowProp(result)
}

export async function proseccedDependsByProp(changes: any[], fieldName: EnumFieldName) {
    /* console.log('changes', changes) */
    const depends = storage.getters.dependsByField(fieldName) as EnumFieldName[]

    for (const fileldNameDep of depends) {
        
        const formulaObject: IUserFormula | undefined = (Array.from(storage.getters.formulasList.values()) as IUserFormula[]).find((formula: IUserFormula)=> formula.fieldName === fileldNameDep)
        let tokensLal: string[] = []

        if (formulaObject) {
            const tokens = formulaObject.tokens
            tokensLal = [...tokens]

            for (const change of changes) {
                const row = change[0] as number

                for (const [index, tokenProp] of tokens.entries()) {
                    if (nameFieldsArray.indexOf(tokenProp as EnumFieldName) !== -1) {
                    /* if (nameFieldsArray.some(el=>el===tokenProp)) { */
                        //надо проверить: value надо брать из таблицы или из локального массива зависимостей
                        const depend = dataAtRowProp.find((change: IChange) => change.changefileldName === tokenProp)
                        let value: any
                        if (depend) {
                            //данные берутся из локального массива зависимостей посчитанных здесь
                            value = (depend.changes.find((changeRow: [number, any]) => changeRow[0] === row) as any[])[1]
                        } else {
                            //иначе данные берутся из рабочей таблицы
                            //1-ый вариант черех АПИ
                            value = await instance.getDataAtRowProp(row, tokenProp)
                             //2-ой вариант через полученный changes
                            //value = change[1]
                        }
                        
                        
                        //tokensLal[index] = String(`"${value}"`)
                        const fieldType = Array.from(fieldsInfoMap.values()).find((el: IField) => el.fieldName === tokenProp)?.fieldType
                        if (fieldType === EnumTypeField.String) {
                            /* console.log('fieldType=== String', fieldType) */
                            tokensLal[index] = String(`"${value}"`)
                        } else if (fieldType === EnumTypeField.Number) {
                            /* console.log('fieldType ===Number', fieldType) */
                            tokensLal[index] = value
                        }
                    }
                }

                const formulaText: string = tokensLal.join("")
                let resultFormula: any

                try {
                    resultFormula = await parser.parse(formulaText)
                    const depend = dataAtRowProp.find((change: IChange) => change.changefileldName === fileldNameDep)
                    if (depend) {
                        const changesDepend = depend.changes.findIndex((change: [number, any]) => change[0] === row)
                        if (changesDepend !== -1) {
                            depend.changes[changesDepend] = [row, resultFormula] 
                        } else {
                            depend.changes.push([row, resultFormula])
                        }
                    } else {
                        dataAtRowProp.push({changefileldName: fileldNameDep,processed: false, changes: [[row, resultFormula]] })
                    }
                } catch (formulaError: FormulaError) {
                    throw new Error(formulaError.name)
                }
            }
        }
    }
}

export async function setDataAtRowPropFromContextMenu(column: number) {

    const fieldName = (fieldsInfoMap.get(column) as IField).fieldName
    const fakeFormula = storage.getters.fakeCurrentFormula as IUserFormula
    
    const fieldType = Array.from(fieldsInfoMap.values()).find((el: IField) => el.fieldName === fieldName)?.fieldType
    const newFormula: IUserFormula = {...fakeFormula, column, fieldName, fieldType, id: String(new Date().getTime())} 
    /* console.log('newFormula', newFormula) */
    if (fakeFormula) {
        storage.dispatch('setFormulaObject', {key: column, value: newFormula})
    }
    
    const dataLength = instance.countRows()
    const changes = []
    const first = instance.getFirstRenderedVisibleRow()
    const last = instance.getLastRenderedVisibleRow() 
    
    for (let i = 0; i <= dataLength -1; i++) {
        const tokensLal: string[] = [...newFormula.tokens]
        /* console.log('newFormula.tokens', newFormula.tokens)
        console.log('tokensLal', tokensLal) */
        for (const [index, token] of newFormula.tokens.entries()) {
            if (nameFieldsArray.indexOf(token as EnumFieldName) !== -1) {
                const value: any = instance.getDataAtRowProp(i, token)

                //value в зависимости от типа колонки
                //tokensLal[index] = String(`"${value}"`)

                //token - TypeRow
                const fieldType = Array.from(fieldsInfoMap.values()).find((el: IField) => el.fieldName === token)?.fieldType
                if (fieldType === EnumTypeField.String) {
                    console.log('fieldType=== String', fieldType)
                    tokensLal[index] = String(`"${value}"`)
                } else if (fieldType === EnumTypeField.Number) {
                    console.log('fieldType ===Number', fieldType)
                    tokensLal[index] = value
                }
            }
        }
       /*  console.log('tokensLal', tokensLal) */
        const formulaText: string = tokensLal.join("")
        const resultFormulaValue = parser.parse(formulaText)

        changes.push([i, resultFormulaValue])
    }

    const condForms = storage.getters.getConditionalFormulasArray as IConditionFormula[]

    let splicedArray: any[] = []
    splicedArray = changes.splice(first, last+1)
    /* console.log('splicedArray', splicedArray) */
    dataAtRowProp = []
    dataAtRowProp.push({changefileldName: fieldName, processed: true, changes: splicedArray.length ? splicedArray : changes })

    if (changes.length > (last - first)) {
        if (condForms.length) {
            await setDataAtRowProp(filterChangesByconditionalFormulas(splicedArray), fieldName)
            calculateRemainderSourceAsWebWorker(filterChangesByconditionalFormulas(changes), fieldName, true)
        } else {
            await setDataAtRowProp(splicedArray, fieldName, true)
            calculateRemainderSourceAsWebWorker(changes, fieldName, true)
        }
    } else {
        if (condForms.length) {
            await setDataAtRowProp(filterChangesByconditionalFormulas(splicedArray), fieldName)
        } else {
            await setDataAtRowProp(splicedArray, fieldName, true)
        }
    }
}

/* export async function setDataAtRowPropFromContextMenuTets(column: number) {
    console.log('нажал применить формулу контекстное меню')
    const fieldName = (fieldsInfoMap.get(column) as IField).fieldName
    const fakeFormula = storage.getters.fakeCurrentFormula as IUserFormula

    const newFormula: IUserFormula = {...fakeFormula, column, fieldName, id: String(new Date().getTime())} 
    
    if (fakeFormula) {
        //записать в Map обьект формулы для колонки 
        storage.dispatch('setFormulaObject', {key: column, value: newFormula})
    }
    
    const dataLength = instance.countRows()
    const changes = []
    const first = instance.getFirstRenderedVisibleRow()
    const last = instance.getLastRenderedVisibleRow() 

    for (let i = 0; i <= dataLength -1; i++) {
        const tokensLal: string[] = [...newFormula.tokens]

        for (const [index, token] of newFormula.tokens.entries()) {

            if (nameFieldsArray.some(el=>el===token)) {
                const value: any = instance.getDataAtRowProp(i, token)
                tokensLal[index] = String(`"${value}"`)
            }
        }

        const formulaText: string = tokensLal.join("")
        const resultFormulaValue = parser.parse(formulaText)

        changes.push([i, resultFormulaValue])
    }
    
    //длина changes равна длина массива всех данных (changes.length ===dataLength)
    const condForms = storage.getters.getConditionalFormulasArray as IConditionFormula[]

    let splicedArray: any[] = []
    splicedArray = changes.splice(first, last+1) //+1 ??? пусть будет +1

    dataAtRowProp = []
    dataAtRowProp.push({changefileldName: fieldName, processed: true, changes: splicedArray.length ? splicedArray : changes })

    if (changes.length > (last - first)) {
        //если строк changes больше чем строк во вьюпорте , то надо делить на 2
        // если код здесь то splicedArray имеет длину
        if (condForms.length) {
            await setDataAtRowProp(filterChangesByconditionalFormulas(splicedArray), fieldName)
            
            //если массив порезан, то отправить во второй поток считать формулы
            //if (splicedArray.length) {
                //если есть отрезанный массив то значит отправить в воркер остатки
                //если был отрезанный сегмент массива, то отправить остатки исходного массива в воркер
                calculateRemainderSourceAsWebWorker(filterChangesByconditionalFormulas(changes), fieldName, true)
            //}  
        } else {
            //если нет условий, то тогда просто  вернуть сегмент массива (40 строк напр) (не надо всё вовращать) а остатки на WebWorker
            
            await setDataAtRowProp(splicedArray, fieldName, true)
            //if (splicedArray.length) {
                //если был отрезанный сегмент массива, то отправить остатки исходного массива в воркер
                calculateRemainderSourceAsWebWorker(changes, fieldName, true)
            //}
        }
    } else {
        //случай , когда строк мало изначально в массиве и вьюпорт не заполнен . веб воркер тут не нужен, данных мало
        //splicedArray - в таком случае это полная копия от changes
        if (condForms.length) {
            await setDataAtRowProp(filterChangesByconditionalFormulas(splicedArray), fieldName)
        } else {
            await setDataAtRowProp(splicedArray, fieldName, true)
        }
    }
} */
