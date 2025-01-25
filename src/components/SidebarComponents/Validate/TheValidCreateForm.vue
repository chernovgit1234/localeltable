<style lang="scss" scoped>
.valid-rule {
    &__body {
        margin-top: 10px;
        padding: 0 15px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
}


</style>

<template>
    <div class="valid-rule">
        <div class="valid-rule__body">
            <div>
                <span class="label-section">Применить к столбцу</span>
                <!-- <TheSelectField
                    v-model="appliedFieldName" 
                    :IdEditRule="IdByEditingRule"
                    :options="fieldNames"
                ></TheSelectField> -->
                <q-select 
                :disable="IdByEditingRule !==''"
                    outlined
                    v-model="appliedFieldName" 
                    :options="fieldNames" 
                    dense 
                    options-dense
                    disable-tab-selection
                ></q-select>
            </div>
            <div>
                <span class="label-section">Критерии</span>
                <span class="label-small">Ячейка доступна для редактирования, если...</span>
                <q-select 
                    outlined
                    v-model="appliedRuleObject" 
                    :options="optionsFormattingRules" 
                    dense 
                    options-dense
                    disable-tab-selection
                ></q-select>
                <div class="inputs-section" v-if="typeInputs !== EnumTypeFormattingRuleInputs.Default">
                        <div class="inputs-section__body">
                            <div class="inputs-section__text-type" v-if="typeInputs === EnumTypeFormattingRuleInputs.Text">
                                <q-input v-model="formTextValue"  no-error-icon class="mp-0" :error="formTextValueError" type="text" outlined dense placeholder="Значение" />
                            </div>
                            <div class="inputs-section__date-type" v-else-if="typeInputs === EnumTypeFormattingRuleInputs.Date">
                                <q-input no-error-icon class="mp-0" :error="formDateValueError" type="date" outlined dense v-model="formDateValue" placeholder="Значение" />
                            </div>
                            <div class="inputs-section__text-number" v-else-if="typeInputs === EnumTypeFormattingRuleInputs.Number">
                                <q-input no-error-icon class="mp-0" :error="formNumberValueError" type="number" outlined dense v-model.number="formNumberValue" placeholder="Значение" />
                            </div>
                            <div class="inputs-section__date-numbers"  v-else-if="typeInputs === EnumTypeFormattingRuleInputs.Numbers">
                                <q-input no-error-icon class="mp-0" :error="formNumber1ValueError" type="number" outlined dense v-model.number="formNumber1Value" placeholder="Значение от" />
                                <q-input no-error-icon class="mp-0" :error="formNumber2ValueError" type="number" outlined dense v-model.number="formNumber2Value" placeholder="Значение до" />
                            </div>
                        </div>
                </div>
            </div>
            <div class="action-section">
                <div class="action-section__body">
                    <button class="btn-light-custom" @click="emit('closeFormRule')">Отмена</button>
                    <button class="btn-custom" @click="addRule">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { EnumColumnName } from '@/enums/EnumColumnValues';
import { getEnumStringValues } from '@/enums/EnumsCommon';
import { defineEmits, ref, defineExpose, onMounted, watch } from 'vue'
import { optionsFormattingRules } from '@/helpers/Formatting/FormattingRuleHelper';
import { EnumRuleFormatting } from '@/enums/EnumsByRules';
import { IFormattingRules, IPaylAddRule } from '@/types/FormattingTypes';
import { instance } from '@/helpers/InstanceHelper';
import { EnumTypeField } from '@/enums/EnumsByFilter';
import { fieldsInfoMap, IField } from '@/helpers/ColumnsHelper';
import { EnumTypeFormattingRuleInputs } from '@/enums/EnumsByTabPanel';
import { useStore } from 'vuex';
import { IValidRule } from '@/store/valid/types';

const emit = defineEmits(['closeFormRule'])
const store = useStore()
defineExpose({clearSetts, editRule, crteRule})

const fieldNames=getEnumStringValues(EnumColumnName)

onMounted(() => {
    setTimeout(() => {
        const selected: any[] = instance.getSelected()
        const endCol = selected[0][3] as number
        const nameField: EnumColumnName | undefined = (fieldsInfoMap.get(endCol) as IField).columnName as EnumColumnName
        const typeField: EnumTypeField | undefined = (fieldsInfoMap.get(endCol) as IField).fieldType as EnumTypeField

        colNum.value = endCol
        
        if (nameField) appliedFieldName.value = nameField
        if (typeField) appliedFieldType.value = typeField
    })
})

let colNum = ref<number>(0)
let editMode = ref(false)

let IdByEditingRule = ref('')
let appliedFieldName = ref<EnumColumnName>(EnumColumnName.Type)
let appliedRule = ref<any | EnumRuleFormatting | EnumRuleFormatting>(EnumRuleFormatting.includedata)
let appliedRuleObject = ref<any | EnumRuleFormatting | IFormattingRules>(EnumRuleFormatting.includedata)
let appliedFieldType = ref<EnumTypeField>(EnumTypeField.String)

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


watch(appliedFieldName, (newValue: EnumColumnName) => {

    //при выборе другой колонки, устанавливается первое общее правило 
    appliedRule.value = EnumRuleFormatting.includedata

    //добавил строку 16.12.2024 когда делал комп создания правила валидации
    //appliedRuleObject.value = EnumRuleFormatting.includedata

    let appliedFieldTypeLocal: EnumTypeField | null= null
    
    fieldsInfoMap.forEach((value) => {
        if (newValue === value.columnName) {
            appliedFieldTypeLocal = value.fieldType
            appliedFieldType.value = value.fieldType
            colNum.value = value.colNum
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

watch(appliedRuleObject, (newValue: IFormattingRules) => {
    appliedRule.value = newValue.value

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
    } else {
        typeInputs.value = EnumTypeFormattingRuleInputs.Default
    }
})

function crteRule() {
    IdByEditingRule.value = ''
    editMode.value = false
}
function editRule(rule: IValidRule) {
    if (rule && rule.id) {
        editMode.value = true
        IdByEditingRule.value = rule.id
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

function addRule() {
    //очистить ошибки
    clearFormErrorValues()

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
        //если не тошибки то создать правило
        let jsCondition = ''
        let errorText = ''
        let noempty ='Нельзя вводить пустое значение'
        let empty ='Необходимо ввести пустое значение'
        switch (appliedRule.value) {
            case EnumRuleFormatting.includedata:
                if (appliedFieldType.value === EnumTypeField.Number) {
                    jsCondition = 'value !== null && value !== undefined'
                    errorText=noempty
                } else if (appliedFieldType.value === EnumTypeField.Boolean) {
                    jsCondition = 'value !== null && value !== undefined && value !== false'
                    errorText=`Нельзя вводить пустое или ложное значение`
                } else {
                    jsCondition = 'value'
                    errorText=noempty
                }
                
                break;
            case EnumRuleFormatting.noincludedata:
                
                if (appliedFieldType.value === EnumTypeField.Number) {
                    jsCondition = 'value === null && value === undefined'
                    errorText=`Необходимо ввести пустое значение`
                }  else if (appliedFieldType.value === EnumTypeField.Boolean) {
                    jsCondition = 'value === null && value === undefined && value === false'
                    errorText=empty
                } else {
                    jsCondition = '!value'
                    errorText=empty
                }
            
                break;
            case EnumRuleFormatting.textinclude:
                jsCondition = `value.includes("${formTextValue.value}")`
                errorText=`Введите текст, который содержит аргумент "${formTextValue.value}".`
                break;
            case EnumRuleFormatting.textnoinclude:
                jsCondition = `!value.includes("${formTextValue.value}")`
                errorText=`Введите текст, который не содержит аргумент "${formTextValue.value}".`
                break;
            case EnumRuleFormatting.textstartswith:
                jsCondition = `value.startsWith("${formTextValue.value}")`
                errorText=`Введите текст, который начинается аргументом "${formTextValue.value}".`
                break;
            case EnumRuleFormatting.textendswith:
                jsCondition = `value.endsWith("${formTextValue.value}")`
                errorText=`Введите текст, который заканчивается аргументом "${formTextValue.value}".`
                break;
            case EnumRuleFormatting.textaccurate:
                jsCondition = `value === "${formTextValue.value}"`
                errorText=`Введите текст, который совпадает с аргументом "${formTextValue.value}".`
                break;

            case EnumRuleFormatting.numberequalto:
                jsCondition = `value === ${formNumberValue.value}`
                errorText=`Укажите число, равное ${formNumberValue.value}`
                break;
            case EnumRuleFormatting.numbernotequalto:
                jsCondition = `value !== ${formNumberValue.value}`
                errorText=`Укажите число, не равное ${formNumberValue.value}`
                break;
            case EnumRuleFormatting.numbermorethan:
                jsCondition = `value > ${formNumberValue.value}`
                errorText=`Укажите число больше ${formNumberValue.value}`
                break;
            case EnumRuleFormatting.numberlessthan:
                jsCondition = `value < ${formNumberValue.value}`
                errorText=`Укажите число меньше ${formNumberValue.value}`
                break;
            case EnumRuleFormatting.numbermorethanorequalto:
                jsCondition = `value >= ${formNumberValue.value}`
                errorText=`Укажите число не меньше ${formNumberValue.value}`
                break;
            case EnumRuleFormatting.numberlessthanorequalto:
                jsCondition = `value <= ${formNumberValue.value}`
                errorText=`Укажите число не больше ${formNumberValue.value}`
                break;
            case EnumRuleFormatting.numberbetween:
                jsCondition = `value > ${formNumber1Value.value} && value < ${formNumber2Value.value}`
                errorText=`Укажите число в диапазоне от ${formNumber1Value.value} до ${formNumber2Value.value}`
                break;
            case EnumRuleFormatting.numbernobetween:
                jsCondition = `value < ${formNumber1Value.value} || value > ${formNumber2Value.value}`
                errorText=`Укажите число, не находящееся в диапазоне от ${formNumber1Value.value} до ${formNumber2Value.value}`
                break;
            case EnumRuleFormatting.dateequalto:
                jsCondition = `new Date(value).getTime() === new Date("${formDateValue.value}").getTime()`
                errorText=`Укажите дату ${formDateValue.value}`
                break;
            case EnumRuleFormatting.datebefore:
                jsCondition = `new Date(value).getTime() < new Date("${formDateValue.value}").getTime()`
                errorText=`Укажите дату до ${formDateValue.value}` 
                break;
            case EnumRuleFormatting.dateafter:
                jsCondition = `new Date(value).getTime() > new Date("${formDateValue.value}").getTime()`
                errorText=`Укажите дату после ${formDateValue.value}`
                break;
        }

        let value1: string | number | boolean, value2: number, textRule: string

        switch (typeInputs.value) {
            case EnumTypeFormattingRuleInputs.Default:
                textRule = `${appliedRule.value}`
                break;
            case EnumTypeFormattingRuleInputs.Text:
                value1 = formTextValue.value as string
                textRule = `${appliedRule.value} "${value1}"`
                break;
            case EnumTypeFormattingRuleInputs.Number:
                value1 = formNumberValue.value as number
                textRule = `${appliedRule.value} "${value1}"`
                break;
            case EnumTypeFormattingRuleInputs.Date:
                value1 = formDateValue.value as string
                textRule = `${appliedRule.value} "${value1}"`
                break;
            case EnumTypeFormattingRuleInputs.Numbers:
                value1 = formNumber1Value.value as number
                value2 = formNumber2Value.value as number
                if (appliedRule.value === EnumRuleFormatting.numberbetween) {
                    textRule = `От ${value1} до ${value2}`
                } else if (appliedRule.value === EnumRuleFormatting.numbernobetween) {
                    textRule = `Меньше ${value1} или больше ${value2}`
                }
                break;
        }
    
        let newRule: IValidRule
    
        setTimeout(() => {
            newRule = {
                id: editMode.value ? IdByEditingRule.value : String(new Date().getTime()),
                jsCode: jsCondition,
                errorText:errorText,
                fieldName: appliedFieldName.value,
                fieldType: appliedFieldType.value,
                appliedRule: appliedRule.value,
                appliedRuleObject:  appliedRuleObject.value,
                typeInputs: typeInputs.value,
                textRule: textRule,
                value1,
                value2
            }
            
            console.log('valid---newRule', newRule)
            if (editMode.value === true) {
                store.dispatch('editValidRule', {columnNumber: colNum.value, rule: newRule} as IPaylAddRule)
            } else {
                store.dispatch('addValidRule', {columnNumber: colNum.value, rule: newRule} as IPaylAddRule)
            }

            emit('closeFormRule')
            //instance.render()  
        })
    }
}

function clearSetts() {
    appliedFieldName.value = EnumColumnName.Type
    appliedFieldType.value = EnumTypeField.String
    appliedRule.value = EnumRuleFormatting.includedata
    appliedRuleObject.value = EnumRuleFormatting.includedata
    typeInputs.value = EnumTypeFormattingRuleInputs.Default
    IdByEditingRule.value = ''
    editMode.value = false
    formTextValue.value = ''
    formDateValue.value = ''
    formNumberValue.value = null
    formNumber1Value.value = null
    formNumber2Value.value = null
}

function clearFormErrorValues() {
    formTextValueError.value = false
    formDateValueError.value = false
    formNumberValueError.value = false
    formNumber1ValueError.value = false
    formNumber2ValueError.value = false
}
</script>

