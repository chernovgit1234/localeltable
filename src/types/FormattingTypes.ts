import { EnumColumnName } from "@/enums/EnumColumnValues";
import { EnumTypeField } from "@/enums/EnumsByFilter";
import { EnumRuleFormatting } from "@/enums/EnumsByRules";
import { EnumTypeFormattingRuleInputs } from "@/enums/EnumsByTabPanel";

export interface IFormattingRules {
    label: EnumRuleFormatting | string,
    value?: EnumRuleFormatting ,
    disable: boolean,
    type?: EnumTypeField,
    html?: boolean
}

/* export interface IStyleConditionFormattingRules {
    background-color: string,
    font-style: string,
    color: string,
    font-weight: string,
    text-decoration: string,
    text-align: string
} */

export interface IPaylAddRule {
    columnNumber: number,
    rule: IConditionFormattingRules
}

export interface IPaylDelRule {
    columnNumber: number,
    idRule: string
}
export interface IFormattingAlignPosition {
    left: boolean,
    center: boolean,
    right: boolean
}

export interface IConfigStyle {
    formattingBoldActive: boolean,
    formattingItalicActive: boolean,
    formattingUnderlinedActive: boolean,
    formattingStrikethroughActive: boolean,
    formattingTextColorActive: boolean,
    formattingFillColorActive: boolean,
    formattingAlignPosition: IFormattingAlignPosition
}



export interface IConditionFormattingRules {
    isMacros: boolean,
    id: string,
    style: any,
    errorText?: string
    jsCode: string,
    fieldName: EnumColumnName,
    appliedRule: EnumRuleFormatting,
    appliedRuleObject: any,
    textRule: string,
    fieldType: EnumTypeField,
    typeInputs: EnumTypeFormattingRuleInputs,
    value1: string | number | boolean | Date,
    value2: string | number | boolean | Date,
    styleConfig: IConfigStyle
}