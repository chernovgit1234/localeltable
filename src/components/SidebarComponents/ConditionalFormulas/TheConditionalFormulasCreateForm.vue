<style lang="scss">
//condition-formulas-create-form = cf-create-form
.cf-create-form {
    &__body {
        margin-top: 10px;
        padding: 0 15px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    &__label-section {
        color: #3c4043;
        font-family: Roboto700;
        font-size: 14px;
        font-weight: 500;
        display: block;
        margin-bottom: 13px;
    }

    &__label-small {
        color: #646464;
        font-family: Roboto400;
        font-size: 12px;
        line-height: 14px;
        display: block;
        margin-bottom: 6px;
    }

    &__actions {

    }
}
</style>


<template>
    <div class="cf-create-form">
        <div class="cf-create-form__body">
            <div class="cf-create-form__apply-column-section">
                <span class="cf-create-form__label-section">Применить к столбцу</span>
                <q-select 
                    @popup-show="fab1 ? selectFieldNameCondFormulas.hidePopup() : false"
                    ref="selectFieldNameCondFormulas"
                    outlined
                    v-model="appliedFieldName" 
                    :options="nestedHighHeader" 
                    dense 
                    options-dense
                    disable-tab-selection
                    map-options
                />
            </div>
            <div class="cf-create-form__formatting-rule-section">
                <span class="cf-create-form__label-section">Правила применения формулы</span>
                <span class="cf-create-form__label-small">Не расчитывать по формуле строку, если...</span>
                <q-select 
                    @popup-show="fab1 ? selectAppliedRuleCondFormulas.hidePopup() : false"
                    ref="selectAppliedRuleCondFormulas"
                    outlined
                    v-model="appliedRuleObject" 
                    :options="optionsFormattingRules" 
                    dense 
                    options-dense
                    disable-tab-selection
                ></q-select>
                <div class="formatting-inputs-section" v-if="typeInputs !== EnumTypeFormattingRuleInputs.Default">
                        <div class="formatting-inputs-section__body">
                            <div class="formatting-inputs-section__text-type" v-if="typeInputs === EnumTypeFormattingRuleInputs.Text">
                                <q-input v-model="formTextValue"  no-error-icon class="mp-0" :error="formTextValueError" type="text" outlined dense placeholder="Значение" />
                            </div>
                            <div class="formatting-inputs-section__date-type" v-else-if="typeInputs === EnumTypeFormattingRuleInputs.Date">
                                <q-input no-error-icon class="mp-0" :error="formDateValueError" type="date" outlined dense v-model="formDateValue" placeholder="Значение" />
                            </div>
                            <div class="formatting-inputs-section__text-number" v-else-if="typeInputs === EnumTypeFormattingRuleInputs.Number">
                                <q-input no-error-icon class="mp-0" :error="formNumberValueError" type="number" outlined dense v-model.number="formNumberValue" placeholder="Значение" />
                            </div>
                            <div class="formatting-inputs-section__date-numbers"  v-else-if="typeInputs === EnumTypeFormattingRuleInputs.Numbers">
                                <q-input no-error-icon class="mp-0" :error="formNumber1ValueError" type="number" outlined dense v-model.number="formNumber1Value" placeholder="Значение от" />
                                <q-input no-error-icon class="mp-0" :error="formNumber2ValueError" type="number" outlined dense v-model.number="formNumber2Value" placeholder="Значение до" />
                            </div>
                        </div>
                </div>
            </div>
            <div class="cf-create-form__actions action-format-section">
                <div class="action-format-section__body">
                    <button class="btn-light-custom" @click="emit('closeFormCreateCondition')">Отмена</button>
                    <q-fab
                        square
                        hide-icon
                        text-color="green"
                        padding="0"
                        label-style="margin-top: -8px"
                        outline
                        v-model="fab1"
                        direction="up"
                        anchor="top"
                        label-position="top"
                        @before-show.stop="beforeshowFab"
                    >
                    <template v-slot:label >
                        <div class="btn-custom" @click="!idCurrentCondition ? createCondition(EnumConditionRule.OR) : false">
                            Сохранить
                        </div>
                    </template>
                        <q-fab-action v-if="editMode" color="primary" @click.stop="createCondition()">
                            <template v-slot:default >
                                <div style="padding: 0 10px;"> 
                                    текущее правило
                                </div>
                            </template>
                        </q-fab-action>
                        <q-fab-action  v-if="idCurrentCondition" color="primary" @click.stop="createCondition(EnumConditionRule.OR)">
                            <template v-slot:default>
                                <div style="padding: 0 10px;"> 
                                    в новой группе
                                </div>
                            </template>
                        </q-fab-action>
                        <q-fab-action v-if="idCurrentCondition" color="primary" @click.stop="createCondition(EnumConditionRule.AND)" >
                            <template v-slot:default >
                                <div style="padding: 0 10px;"> 
                                    в этой группе
                                </div>
                            </template>
                        </q-fab-action>
                    </q-fab>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref , defineEmits, watch, computed, defineExpose} from 'vue';
import {fieldsInfoMap, nestedHighHeader, propsRangeNameMap} from '../../../helpers/ColumnsHelper'
import { EnumColumnName, EnumFieldName } from '@/enums/EnumColumnValues';
import { EnumRuleFormatting } from '@/enums/EnumsByRules';
import { IFormattingRules } from '@/types/FormattingTypes';
import { optionsFormattingRules } from '@/helpers/Formatting/FormattingRuleHelper';
import { EnumTypeFormattingRuleInputs } from '@/enums/EnumsByTabPanel';
import { EnumTypeField } from '@/enums/EnumsByFilter';
import { IConditionFormula, IConditionFormulasRule } from '@/types/ConditionalFormulasTyles';
import { useStore } from 'vuex';
import { EnumConditionRule } from '@/enums/EnumsCommon';

const store = useStore()
const emit = defineEmits(['closeFormCreateCondition'])

defineExpose({
    editConditionRule, resetEditMode
});

let selectFieldNameCondFormulas = ref()
let selectAppliedRuleCondFormulas = ref()

let fab1 = ref(false)
let editMode = ref(false)
let appliedFieldName = ref<EnumColumnName>(EnumColumnName.Type)
let appliedFieldType = ref<EnumTypeField>(EnumTypeField.String)
let idByEditingRule = ref('')

let appliedRule = ref<any | EnumRuleFormatting | EnumRuleFormatting>(EnumRuleFormatting.includedata)
let appliedRuleObject = ref<any | EnumRuleFormatting | IFormattingRules>(EnumRuleFormatting.includedata)
let typeInputs = ref<EnumTypeFormattingRuleInputs>(EnumTypeFormattingRuleInputs.Default)

let formTextValue = ref<string>('')
let formDateValue = ref<string | number>('')
let formNumberValue = ref<number | null>(null)
let formNumber1Value = ref<number | null>(null)
let formNumber2Value = ref<number | null>(null)

let formTextValueError = ref<boolean>(false)
let formDateValueError = ref<boolean>(false)
let formNumberValueError = ref<boolean>(false)
let formNumber1ValueError = ref<boolean>(false)
let formNumber2ValueError = ref<boolean>(false)

const сonditionalsLength = computed(() => store.getters.сonditionalFormulasArrayLength)
const idCurrentCondition = computed(() => store.getters.idCurrentCondition)

watch(appliedRuleObject, (newValue: IFormattingRules | EnumRuleFormatting | any) => {
    
    if (typeof newValue === "object") {
        appliedRule.value = newValue.value
    } else {
        appliedRule.value = newValue
    }

    if (newValue.value === EnumRuleFormatting.includedata || newValue.value === EnumRuleFormatting.noincludedata) {
        typeInputs.value = EnumTypeFormattingRuleInputs.Default
    } else if (newValue.value === EnumRuleFormatting.textinclude || 
            newValue.value === EnumRuleFormatting.textnoinclude ||
            newValue.value === EnumRuleFormatting.textstartswith ||
            newValue.value === EnumRuleFormatting.textendswith ||
            newValue.value === EnumRuleFormatting.textaccurate) {
        typeInputs.value = EnumTypeFormattingRuleInputs.Text
    }
    else if (newValue.value === EnumRuleFormatting.numberequalto || 
            newValue.value === EnumRuleFormatting.numbernotequalto ||
            newValue.value === EnumRuleFormatting.numbermorethan ||
            newValue.value === EnumRuleFormatting.numbermorethanorequalto ||
            newValue.value === EnumRuleFormatting.numberlessthan ||
            newValue.value === EnumRuleFormatting.numberlessthanorequalto) {
        typeInputs.value = EnumTypeFormattingRuleInputs.Number
    }
    else if (newValue.value === EnumRuleFormatting.numberbetween || newValue.value === EnumRuleFormatting.numbernobetween) {
        typeInputs.value = EnumTypeFormattingRuleInputs.Numbers
    }
    else if (newValue.value === EnumRuleFormatting.dateequalto || 
            newValue.value === EnumRuleFormatting.datebefore ||
            newValue.value === EnumRuleFormatting.dateafter) {
        typeInputs.value = EnumTypeFormattingRuleInputs.Date
    }
})

watch(appliedFieldName, (newValue: EnumColumnName) => {
    //при выборе другой колонки, устанавливается первое общее правило 
    appliedRule.value = EnumRuleFormatting.includedata
    appliedRuleObject.value = EnumRuleFormatting.includedata
    clearInputsSettings()

    let appliedFieldTypeLocal: EnumTypeField | null = null
    
    fieldsInfoMap.forEach((value) => {
        if (newValue === value.columnName) {
            appliedFieldTypeLocal = value.fieldType
            appliedFieldType.value = value.fieldType
        }
    });

    //заморозка правил
    optionsFormattingRules.map((rule: IFormattingRules) => {
        rule.disable = false
        //заморозить все правила с другими типами
        if (rule.type !== appliedFieldTypeLocal) {
            rule.disable = true
        } 

        if (rule.type === EnumTypeField.NoType) {
            rule.disable = false
        }

        return rule
    })
}, {immediate: true})

function createCondition(ruleConditionLocal?: EnumConditionRule) {

    clearFormErrorValues()

    if (ruleConditionLocal === EnumConditionRule.AND || ruleConditionLocal === EnumConditionRule.OR) resetEditMode()

    let isError = false

    if (typeInputs.value === EnumTypeFormattingRuleInputs.Text && !formTextValue.value) {
        formTextValueError.value = true
        isError = true
    } else if (typeInputs.value === EnumTypeFormattingRuleInputs.Date && !formDateValue.value) {
        formDateValueError.value = true
        isError = true
    } else if (typeInputs.value === EnumTypeFormattingRuleInputs.Number && !formNumberValue.value) {
        formNumberValueError.value = true
        isError = true
    } else if (typeInputs.value === EnumTypeFormattingRuleInputs.Numbers && !formNumber1Value.value) {
        formNumber1ValueError.value = true
        isError = true
    } else if (typeInputs.value === EnumTypeFormattingRuleInputs.Numbers && !formNumber2Value.value) {
        formNumber2ValueError.value = true
        isError = true
    }

    if (isError) {
        return
    } else {
        let jsCondition = ''

        switch (appliedRule.value) {
            case EnumRuleFormatting.includedata:
                if (appliedFieldType.value === EnumTypeField.Number) {
                    jsCondition = 'value !== null && value !== undefined'
                } else {
                    jsCondition = 'value'
                }
                break;
            case EnumRuleFormatting.noincludedata:
                if (appliedFieldType.value === EnumTypeField.Number) {
                    jsCondition = 'value === null || value === undefined'
                } else {
                    jsCondition = '!value'
                }
                break;
            case EnumRuleFormatting.textinclude:
                jsCondition = `value.includes("${formTextValue.value}")`
                break;
            case EnumRuleFormatting.textnoinclude:
                jsCondition = `!value.includes("${formTextValue.value}")`
                break;
            case EnumRuleFormatting.textstartswith:
                console.log('textstartswith')
                jsCondition = `value.startsWith("${formTextValue.value}")`
                break;
            case EnumRuleFormatting.textendswith:
                jsCondition = `value.endsWith("${formTextValue.value}")`
                break;
            case EnumRuleFormatting.textaccurate:
                jsCondition = `value === "${formTextValue.value}"`
                break;

            case EnumRuleFormatting.numberequalto:
                jsCondition = `value === ${formNumberValue.value}`
                break;
            case EnumRuleFormatting.numbernotequalto:
                jsCondition = `value !== ${formNumberValue.value}`
                break;
            case EnumRuleFormatting.numbermorethan:
                jsCondition = `value > ${formNumberValue.value}`
                break;
            case EnumRuleFormatting.numberlessthan:
                jsCondition = `value < ${formNumberValue.value}`
                break;
            case EnumRuleFormatting.numbermorethanorequalto:
                jsCondition = `value >= ${formNumberValue.value}`
                break;
            case EnumRuleFormatting.numberlessthanorequalto:
                jsCondition = `value <= ${formNumberValue.value}`
                break;
            case EnumRuleFormatting.numberbetween:
                jsCondition = `value > ${formNumber1Value.value} && value < ${formNumber2Value.value}`
                break;
            case EnumRuleFormatting.numbernobetween:
                jsCondition = `value < ${formNumber1Value.value} || value > ${formNumber2Value.value}`
                break;
            case EnumRuleFormatting.dateequalto:
                jsCondition = `new Date(value).getTime() === new Date("${formDateValue.value}").getTime()`
                break;
            case EnumRuleFormatting.datebefore:
                jsCondition = `new Date(value).getTime() < new Date("${formDateValue.value}").getTime()`
                break;
            case EnumRuleFormatting.dateafter:
                jsCondition = `new Date(value).getTime() > new Date("${formDateValue.value}").getTime()`
                break;
        }

        let value1: string | number | boolean, value2: number, textRule: string

        switch (typeInputs.value) {
            
            case EnumTypeFormattingRuleInputs.Default:
                textRule = `${String(appliedRule.value).toLowerCase()}`
                break;
            case EnumTypeFormattingRuleInputs.Text:
                value1 = formTextValue.value as string
                textRule = `${String(appliedRule.value).toLowerCase()} "${value1}"`
                break;
            case EnumTypeFormattingRuleInputs.Number:
                value1 = formNumberValue.value as number
                textRule = `${String(appliedRule.value).toLowerCase()} "${value1}"`
                break;
            case EnumTypeFormattingRuleInputs.Date:
                value1 = formDateValue.value as string
                textRule = `${String(appliedRule.value).toLowerCase()} "${value1}"`
                break;
            case EnumTypeFormattingRuleInputs.Numbers:
                value1 = formNumber1Value.value as number
                value2 = formNumber2Value.value as number
                if (appliedRule.value === EnumRuleFormatting.numberbetween) {
                    textRule = `от ${value1} до ${value2}`
                } else if (appliedRule.value === EnumRuleFormatting.numbernobetween) {
                    textRule = `меньше ${value1} или больше ${value2}`
                }
                break;
        }

        setTimeout(() => {
            let propName = propsRangeNameMap.get(String(appliedFieldName.value).toUpperCase()) as EnumFieldName
            

            const newid = editMode.value ? idByEditingRule.value : String(new Date().getTime())
            
            const rule: IConditionFormulasRule | null = {
                id: newid,
                fieldType: appliedFieldType.value,
                appliedRule: appliedRule.value,
                appliedRuleObject: appliedRuleObject.value,
                typeInputs: typeInputs.value,
                textRule,
                value1,
                value2,
                jsCondition,
                fieldName: appliedFieldName.value,
                propName
            }

            if (editMode.value === true) {
                store.dispatch('editConditionRule', rule)
            } else if (сonditionalsLength.value === 0 || сonditionalsLength.value > 0 &&  ruleConditionLocal === EnumConditionRule.OR) {
                let newCondition: IConditionFormula = {
                    id: String(new Date().getTime()+1),
                    rules: [rule],
                    textRules: [{text: rule.textRule, idRule: newid, fieldName: rule.fieldName}]
                }

                store.dispatch('createCondition', newCondition)
            } else {
                store.dispatch('addConditionRule',rule)
            }
        })
    }
}

function editConditionRule(ruleLocal: IConditionFormulasRule) {
    const rule = structuredClone(ruleLocal)

    if (rule && rule.id) {
        editMode.value = true
        fab1.value = false
        idByEditingRule.value = rule.id

        appliedFieldName.value = rule.fieldName
        appliedFieldType.value = rule.fieldType
        appliedRuleObject.value = rule.appliedRuleObject
        appliedRule.value = rule.appliedRule
        typeInputs.value = rule.typeInputs
        
        switch (typeInputs.value) {
            case EnumTypeFormattingRuleInputs.Text:
                formTextValue.value = rule.value1 as string
                break;
            case EnumTypeFormattingRuleInputs.Number:
                formNumberValue.value = rule.value1 as number
                break;
            case EnumTypeFormattingRuleInputs.Date:
                formDateValue.value = rule.value1 as string
                break;
            case EnumTypeFormattingRuleInputs.Numbers:
                formNumber1Value.value = rule.value1 as number
                formNumber2Value.value = rule.value2 as number
                break;
        }
    }
}

function beforeshowFab() {
    if (!idCurrentCondition.value) fab1.value = false
}
function clearFormErrorValues() {
    formTextValueError.value = false
    formDateValueError.value = false
    formNumberValueError.value = false
    formNumber1ValueError.value = false
    formNumber2ValueError.value = false
}
function resetEditMode() {
    idByEditingRule.value = ''
    editMode.value = false
}
function clearInputsSettings() {
    typeInputs.value = EnumTypeFormattingRuleInputs.Default
    formTextValue.value = ''
    formDateValue.value = ''
    formNumberValue.value = null
    formNumber1Value.value = null
    formNumber2Value.value = null
}
</script>