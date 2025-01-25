import { EnumTypeField } from "@/enums/EnumsByFilter";
import { EnumRuleFormatting } from "@/enums/EnumsByRules";
import { IFormattingRules } from "@/types/FormattingTypes";
import { reactive } from "vue";

export const optionsFormattingRules: IFormattingRules[] = [
    {
        label: EnumRuleFormatting.includedata,
        value: EnumRuleFormatting.includedata,
        disable: false,
        type: EnumTypeField.NoType 
    },
    {
        label: EnumRuleFormatting.noincludedata,
        value: EnumRuleFormatting.noincludedata,
        disable: false,
        type: EnumTypeField.NoType
    },
    {
        label: EnumRuleFormatting.textinclude,
        value: EnumRuleFormatting.textinclude,
        disable: false,
        type: EnumTypeField.String
    },
    {
        label: EnumRuleFormatting.textnoinclude,
        value: EnumRuleFormatting.textnoinclude,
        disable: false,
        type: EnumTypeField.String
    },
    {
        label: EnumRuleFormatting.textstartswith,
        value: EnumRuleFormatting.textstartswith,
        disable: false,
        type: EnumTypeField.String
    },
    {
        label: EnumRuleFormatting.textendswith,
        value: EnumRuleFormatting.textendswith,
        disable: false,
        type: EnumTypeField.String
    },
    {
        label: EnumRuleFormatting.textaccurate,
        value: EnumRuleFormatting.textaccurate,
        disable: false,
        type: EnumTypeField.String
    },
    {
        label: '<div style="margin: -10px 0;padding: 0;background-color: transparent;height: 32px;cursor: default !important;display: flex;align-items: center"><span style="display:block;width:100%;cursor: default !important;border-top: 1px solid #ccc;" ></span></div>',
        html: true,
        disable: true,
    },
    {
        label: EnumRuleFormatting.numberequalto,
        value: EnumRuleFormatting.numberequalto,
        disable: false,
        type: EnumTypeField.Number
    },
    {
        label: EnumRuleFormatting.numbernotequalto,
        value: EnumRuleFormatting.numbernotequalto,
        disable: false,
        type: EnumTypeField.Number
    },
    {
        label: EnumRuleFormatting.numbermorethan,
        value: EnumRuleFormatting.numbermorethan,
        disable: false,
        type: EnumTypeField.Number
    },
    {
        label: EnumRuleFormatting.numbermorethanorequalto,
        value: EnumRuleFormatting.numbermorethanorequalto,
        disable: false,
        type: EnumTypeField.Number
    },
    {
        label: EnumRuleFormatting.numberlessthan,
        value: EnumRuleFormatting.numberlessthan,
        disable: false,
        type: EnumTypeField.Number
    },
    {
        label: EnumRuleFormatting.numberlessthanorequalto,
        value: EnumRuleFormatting.numberlessthanorequalto,
        disable: false,
        type: EnumTypeField.Number
    },
    {
        label: EnumRuleFormatting.numberbetween,
        value: EnumRuleFormatting.numberbetween,
        disable: false,
        type: EnumTypeField.Number
    },
    {
        label: EnumRuleFormatting.numbernobetween,
        value: EnumRuleFormatting.numbernobetween,
        disable: false,
        type: EnumTypeField.Number
    },
    {
        label: '<div style="margin: -10px 0;padding: 0;background-color: transparent;height: 32px;cursor: default !important;display: flex;align-items: center"><span style="display:block;width:100%;cursor: default !important;border-top: 1px solid #ccc;" ></span></div>',
        html: true,
        disable: true,
    },
    {
        label: EnumRuleFormatting.dateequalto,
        value: EnumRuleFormatting.dateequalto,
        disable: false,
        type: EnumTypeField.Date
    },
    {
        label: EnumRuleFormatting.datebefore,
        value: EnumRuleFormatting.datebefore,
        disable: false,
        type: EnumTypeField.Date
    },
    {
        label: EnumRuleFormatting.dateafter,
        value: EnumRuleFormatting.dateafter,
        disable: false,
        type: EnumTypeField.Date
    },
/*     {
        label: EnumRuleFormatting.datebefore,
        value: EnumRuleFormatting.datebefore,
        disable: false,
        type: EnumTypeField.Date
    },
    {
        label: EnumRuleFormatting.dateafter,
        value: EnumRuleFormatting.dateafter,
        disable: false,
        type: EnumTypeField.Date
    } */
]