
import { EnumColumnName } from "@/enums/EnumColumnValues";
import { EnumTypeField } from "@/enums/EnumsByFilter";
import { EnumRuleFormatting } from "@/enums/EnumsByRules";
import { EnumTypeFormattingRuleInputs } from "@/enums/EnumsByTabPanel";

export interface ConfigData {
  rulesValidMap: Map<number, IValidRule>
  errorValid: boolean
  errorTxt: string
}
export interface IPaylAddRule {
  columnNumber: number
  rule: IValidRule
}
export interface IPaylDelRule {
  columnNumber: number
  idRule: string
}
export interface IValidRule {
  id: string
  jsCode: string
  errorText: string
  fieldName: EnumColumnName
  appliedRule: EnumRuleFormatting
  appliedRuleObject: any
  textRule: string
  fieldType: EnumTypeField
  typeInputs: EnumTypeFormattingRuleInputs
  value1: string | number | boolean | Date
  value2: string | number | boolean | Date
}