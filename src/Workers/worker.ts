
import { EnumColumnTableNumber, EnumFieldName } from '@/enums/EnumColumnValues';
import { getEnumKeys } from '@/enums/EnumsCommon';
import { IUserFormula } from '@/helpers/HSFormula/Types';
import * as Comlink from 'comlink'

/* import vm from 'node:vm'; */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import FormulaParser, {FormulaError} from 'fast-formula-parser';

interface IChange {
    changefileldName: EnumFieldName,
    processed: boolean,
    changes: Array<[number, any]> //строка, значение
}
let dataAtRowProp: IChange[] = []

let formulasListGlobalMap = new Map<EnumColumnTableNumber, IUserFormula>([])


const parser: FormulaParser = new FormulaParser({}) as FormulaParser

 const fns: any = {
    async setDataAtRowPropFn(changes: any[], fieldName: EnumFieldName,formulasList: any, pushChange?: boolean) {
        dataAtRowProp = []
        if (pushChange) dataAtRowProp.push({changefileldName: fieldName, processed: true, changes: changes })

        return await setDataAtRowProp(changes, fieldName, formulasList)
    }
}

Comlink.expose(fns)

async function setDataAtRowProp(changesParam: any[], fileldName: EnumFieldName, formulasList: any) {

    formulasListGlobalMap = formulasList

    await proseccedDependsByProp(changesParam, fileldName)

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

    const result: any[] = []

    for (const change of dataAtRowProp) { 
        for (const changeRow of change.changes) { 
            result.push([changeRow[0], change.changefileldName, changeRow[1] ])
        }
    }

    return result
}

export async function proseccedDependsByProp(changes: any[], fieldName: EnumFieldName) {
    
    const depends = Array.from(formulasListGlobalMap.values()).map((formula: IUserFormula) => {
        if (~formula.depends.indexOf(fieldName as EnumFieldName))  {
            return formula.fieldName
        }
    }).filter(el=>el) as EnumFieldName[] 

    for (const fileldNameDep of depends) {
        
        const formulaObject: IUserFormula | undefined = (Array.from(formulasListGlobalMap.values()) as IUserFormula[]).find((formula: IUserFormula)=> formula.fieldName === fileldNameDep)
        let tokensLal: string[] = []
        if (formulaObject) {

            const tokens = formulaObject.tokens
            tokensLal = [...tokens]
            const nameFields = getEnumKeys(EnumFieldName)

            for (const change of changes) {
                const row = change[0] as number

                for (const [index, tokenProp] of tokens.entries()) {
                    if (nameFields.some(el=>el===tokenProp)) {
                        //надо проверить: value надо брать из таблицы или из локального массива зависимостей
                        const depend = dataAtRowProp.find((change: IChange) => change.changefileldName === tokenProp)
                        let value: any
                        if (depend) {
                            //данные берутся из локального массива зависимостей посчитанных здесь
                            value = (depend.changes.find((changeRow: [number, any]) => changeRow[0] === row) as any[])[1]
                        } else {
                            //иначе данные берутся из рабочей таблицы
                            //value = await instance.getDataAtRowProp(row, tokenProp)
                            value = change[1]
                        }

                        tokensLal[index] = String(`"${value}"`)
                    }
                }

                const formulaText: string = tokensLal.join("")
                let resultFormula: any

                try {
                    resultFormula = await parser.parse(formulaText)
                    const depend = dataAtRowProp.find((change: IChange) => change.changefileldName === fileldNameDep)
                    if (depend) {
                        const idxDep: number = depend.changes.findIndex((change: [number, any]) => change[0] === row)
                        if (~idxDep) {
                            depend.changes[idxDep] = [row, resultFormula]
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