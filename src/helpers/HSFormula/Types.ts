import { EnumColumnTableNumber, EnumFieldName } from '@/enums/EnumColumnValues'
import {EnumCategoriesFormula,EnumNameField,EnumTypeField, EnumNamesFormula, EnumNamesEngFormula, EnumCategoriesRusFormula} from '../../enums/EnumsHSFormula'


export interface IFormula {
	nameEng: EnumNamesEngFormula,
	nameRus: EnumNamesFormula,
	category: EnumCategoriesRusFormula,
    description: string,
} 

export interface IFieldConfiguration {
	name: EnumNameField,
    type: EnumTypeField,
} 

export interface IUserFormula {
    id: string,
    fieldType?: EnumTypeField | string,
    typeValue: EnumTypeField | string,
    column: number,
    depends: EnumFieldName[] | string[],
    formulaText: string,
    formulaTextOriginal?: string,
    fieldName: EnumFieldName | string,
    tokens: string[],
    tokensFormulaTextOriginal: string[]
} 

export interface IResultFormula {
    text: string,
    error: boolean,
    isHaveRangeInFormula: boolean,
    typeValue: string
}