import { EnumColumnName, EnumFieldName } from "@/enums/EnumColumnValues";
import { EnumTypeField } from "@/enums/EnumsByFilter";
import { EnumRuleFormatting } from "@/enums/EnumsByRules";
import { EnumTypeFormattingRuleInputs } from "@/enums/EnumsByTabPanel";
import { EnumConditionRule } from "@/enums/EnumsCommon";

/* export interface IConditionFormula {
    id: string,
    propName: EnumFieldName,
    jsCode?: string,
    fieldName: EnumColumnName,
    textConditions: string,
    rules: IConditionFormulasRule[]
} */
export interface IConditionFormula {
    id: string,
    textRules: ITextRuleByConditionFormula[],
    rules: IConditionFormulasRule[]
}

export interface IConditionFormulasRule {
    id: string,
    jsCondition: string,
    fieldName: EnumColumnName,
    appliedRule: EnumRuleFormatting,
    appliedRuleObject: any,
    textRule: string,
    propName: any,
    fieldType: EnumTypeField,
    typeInputs: EnumTypeFormattingRuleInputs,
    value1: string | number | boolean,
    value2: number
}

export interface ITextRuleByConditionFormula {
    idRule: string,
    text: string,
    fieldName: string
}