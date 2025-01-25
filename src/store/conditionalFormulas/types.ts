import { EnumColumnName, EnumFieldName } from "@/enums/EnumColumnValues";
import { IConditionFormulasRule, IConditionFormula } from "@/types/ConditionalFormulasTyles";

export interface ConfigData {
  conditionalFormulasArray: IConditionFormula[],
  idCurrentCondition: string | null,
  appliedFieldName: EnumColumnName
}
